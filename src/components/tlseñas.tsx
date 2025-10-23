import { useEffect, useRef, useState } from "react";
import imgLoading1 from "../img/image-3-6.png";
import imgLoading2 from "../img/image-4-7.png";
import imgLoading3 from "../img/node-8.png";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";

// ✅ URLs fijas y estables de MediaPipe (con fallback)
const HANDS_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240";
const CAMERA_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675469240/camera_utils.js";
const DRAWING_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1675469240/drawing_utils.js";

const HANDS_SOURCES = [
  `${HANDS_CDN}/hands.js`,
  "https://unpkg.com/@mediapipe/hands/hands.js",
];
const CAMERA_SOURCES = [
  CAMERA_CDN,
  "https://unpkg.com/@mediapipe/camera_utils/camera_utils.js",
];
const DRAWING_SOURCES = [
  DRAWING_CDN,
  "https://unpkg.com/@mediapipe/drawing_utils/drawing_utils.js",
];

// Ruta de de donde esta el mdoelo 
const MODEL_PATH = "/models/lessa_model_incremental.json";

// Función auxiliar para cargar scripts externos
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.body.appendChild(script);
  });
}

async function loadScriptWithFallback(sources: string[]): Promise<void> {
  let lastError: any = null;
  for (const src of sources) {
    try {
      await loadScript(src);
      return;
    } catch (e) {
      lastError = e;
    }
  }
  throw lastError ?? new Error("No se pudieron cargar los scripts externos");
}

function preprocessLandmarks(landmarks: any[]): number[] {
  if (!landmarks || landmarks.length === 0) return new Array(63).fill(0);
  const base = landmarks[0];
  const centered = landmarks.flatMap((lm: any) => [
    (lm.x ?? 0) - (base.x ?? 0),
    (lm.y ?? 0) - (base.y ?? 0),
    (lm.z ?? 0) - (base.z ?? 0),
  ]);
  const maxAbs = Math.max(1e-6, ...centered.map((v) => Math.abs(v)));
  return centered.map((v) => v / maxAbs);
}

export default function TlSenias() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [letter, setLetter] = useState("—");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startRequested, setStartRequested] = useState(false);
  const [modelStatus, setModelStatus] = useState<string>("Cargando modelo...");
  const [loadingImageIndex, setLoadingImageIndex] = useState(0);
  const [progress, setProgress] = useState<number>(0);

  // Cargar modelo
  useEffect(() => {
    async function loadModel() {
      try {
        try {
          await tf.setBackend("webgl");
        } catch {}
        await tf.ready();
        setProgress(25);
        if (tf.getBackend() !== "webgl") {
          try {
            await tf.setBackend("cpu");
            await tf.ready();
          } catch {}
        }
        const model = await tf.loadLayersModel(MODEL_PATH);
        modelRef.current = model;
        console.log("✅ Modelo LESSA cargado exitosamente");
        setModelStatus("Modelo cargado correctamente");
        setProgress(50);
      } catch (err) {
        console.error("❌ Error al cargar el modelo:", err);
        setError("No se pudo cargar el modelo LESSA.");
        setModelStatus("Error al cargar el modelo. Revisa rutas y red.");
      }
    }
    loadModel();
  }, []);

  // Rotar imágenes de carga mientras loading sea true
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => {
      setLoadingImageIndex((i) => (i + 1) % 3);
    }, 1200);
    return () => clearInterval(id);
  }, [loading]);

  async function retestModel() {
    setModelStatus("Reintentando carga del modelo...");
    try {
      const tmp = await tf.loadLayersModel(MODEL_PATH);
      tmp?.dispose();
      setModelStatus("Modelo cargado correctamente");
      console.log("🔁 Reprueba de modelo: OK");
    } catch (e) {
      console.error("🔁 Reprueba de modelo: ERROR", e);
      setModelStatus("Error al cargar el modelo. Ver consola para detalles.");
    }
  }

  // Configurar MediaPipe y camara para agregar efectos a la camara

  useEffect(() => {
    let hands: any = null;
    let camera: any = null;
    let running = true;

    async function setup() {
      setLoading(true);
      try {
        // Verificar contexto seguro (HTTPS o localhost) para permisos de cámara
        const isSecure = location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1";
        if (!isSecure) {
          setError("La cámara requiere HTTPS o localhost.");
          setLoading(false);
          return;
        }

        // Cargar dependencias con fallback
        await loadScriptWithFallback(CAMERA_SOURCES);
        await loadScriptWithFallback(DRAWING_SOURCES);
        await loadScriptWithFallback(HANDS_SOURCES);
        setProgress((p) => Math.max(p, 75));

        // @ts-ignore
        const Hands = window.Hands;
        // @ts-ignore
        const Camera = window.Camera;
        // @ts-ignore
        const { drawConnectors, drawLandmarks, HAND_CONNECTIONS } = window;

        console.log("Hands:", Hands);
        console.log("Camera:", Camera);

        if (!Hands || !Camera) throw new Error("MediaPipe no se cargó correctamente.");

        hands = new Hands({
          locateFile: (file: string) => `${HANDS_CDN}/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        hands.onResults(async (results: any) => {
          const ctx = canvasRef.current?.getContext("2d");
          const video = videoRef.current;
          if (!ctx || !video) return;

          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(results.image, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0];
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: "#00FFC6", lineWidth: 3 });
            drawLandmarks(ctx, landmarks, { color: "#FF4444", lineWidth: 1 });

            // Predicción del modelo con preprocesamiento
            if (modelRef.current) {
              const input = preprocessLandmarks(landmarks);
              const tensor = tf.tensor2d([input], [1, 63]);
              const prediction = modelRef.current.predict(tensor) as tf.Tensor;
              const probs = await prediction.data();
              const maxIndex = probs.indexOf(Math.max(...probs));
              if (maxIndex >= 0 && isFinite(maxIndex)) {
                const detectedLetter = String.fromCharCode(65 + maxIndex);
                setLetter(detectedLetter);
              }
              tensor.dispose();
              prediction.dispose();
            }
          } else {
            setLetter("—");
          }
        });

        // ✅ Iniciar la cámara sólo si el usuario lo solicita
        if (startRequested) {
          // Retraso leve para asegurar que el video está en el DOM
          setTimeout(() => {
            camera = new Camera(videoRef.current, {
              onFrame: async () => {
                if (running) await hands.send({ image: videoRef.current });
              },
              width: 400,
              height: 300,
            });
            camera
              .start()
              .then(() => {
                console.log("🎥 Cámara iniciada correctamente");
                setCameraReady(true);
                setLoading(false);
                setProgress(100);
                setError(null);
              })
              .catch((e: any) => {
                console.error("Error al iniciar cámara:", e);
                setError("No se pudo acceder a la cámara. Verifica permisos.");
                setLoading(false);
              });
          }, 300);
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Error general de setup:", e);
        setError("No se pudo cargar la cámara o los modelos. Verifica conexión y permisos.");
        setLoading(false);
      }
    }

    setup();

    return () => {
      running = false;
      if (camera && camera.stop) camera.stop();
    };
  }, [startRequested]);

  return (
    <div className="w-full max-w-xl mx-auto bg-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-emerald-400 mb-2 drop-shadow">Traductor LESSA</h2>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
        <div className="flex flex-col items-center relative w-[400px] h-[300px]">
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              className="rounded-lg border border-emerald-400 shadow w-full h-full bg-black object-cover"
              style={{ display: cameraReady ? "block" : "none" }}
              autoPlay
              playsInline
              muted
            />
            <canvas
              ref={canvasRef}
              width={400}
              height={300}
              className="rounded-lg border border-emerald-400 shadow w-full h-full absolute top-0 left-0 pointer-events-none"
              style={{ zIndex: 2 }}
            />
            {!cameraReady && (
              <div className="absolute z-10 flex flex-col items-center">
                <button
                  onClick={() => {
                    setError(null);
                    setStartRequested(true);
                    setLoading(true);
                  }}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-semibold shadow hover:bg-emerald-600 transition"
                >
                  Iniciar Cámara
                </button>
              </div>
            )}
          </div>
          {error && <div className="mt-2 text-red-400 text-sm font-semibold text-center w-full">{error}</div>}
          <div className="mt-2 text-emerald-300 text-xs text-center w-full">{modelStatus}</div>
          <div className="mt-2 w-full flex justify-center">
            <button onClick={retestModel} className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded">
              Reprobar modelo
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <div className="bg-white/10 rounded-xl p-4 w-48 text-center">
            <div className="text-emerald-400 font-bold text-lg mb-2">Letra detectada:</div>
            <div className="letter text-7xl font-extrabold text-emerald-400 drop-shadow">{letter}</div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-4 text-white/80 w-full">
          <div className="flex items-center justify-center gap-6">
            <img src={imgLoading1} alt="img-1" style={{ width: 80, height: 80 }} className="object-contain rounded" />
            <img src={imgLoading2} alt="img-2" style={{ width: 100, height: 80 }} className="object-contain rounded" />
            <img src={imgLoading3} alt="img-3" style={{ width: 80, height: 80 }} className="object-contain rounded" />
          </div>
          <div className="w-full max-w-md">
            <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
              />
            </div>
            <div className="text-center mt-1 text-sm font-semibold">{Math.round(progress)}%</div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-400 mt-2 text-center max-w-md">
        Si la cámara no se activa, revisa los permisos del navegador y asegúrate de estar en localhost o https.
      </div>
    </div>
  );
}
