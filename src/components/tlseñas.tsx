import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-backend-cpu";

// URLs fijas de MediaPipe
const HANDS_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240";
const CAMERA_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675469240/camera_utils.js";
const DRAWING_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1675469240/drawing_utils.js";

// Fallbacks por si falla un CDN (priorizando unpkg para mayor confiabilidad)
const HANDS_SOURCES = [ "https://unpkg.com/@mediapipe/hands/hands.js", `${HANDS_CDN}/hands.js` ];
const CAMERA_SOURCES = [ "https://unpkg.com/@mediapipe/camera_utils/camera_utils.js", CAMERA_CDN ];
const DRAWING_SOURCES = [ "https://unpkg.com/@mediapipe/drawing_utils/drawing_utils.js", DRAWING_CDN ];

// Modelo
const MODEL_PATH = "/models/lessa_model_incremental.json";



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

async function loadScriptWithStatus(
  sources: string[],
  setProgress: (value: number) => void,
  setStatusText: (text: string) => void
): Promise<void> {
  let step = 100 / sources.length;
  for (let i = 0; i < sources.length; i++) {
    const src = sources[i];
    setStatusText(`Cargando ${src.split("/").pop()}...`);
    try {
      await loadScript(src);
      setProgress((i + 1) * step);
      setStatusText(`✅ ${src.split("/").pop()} cargado`);
      return;
    } catch (e) {
      console.warn(`Fallo al cargar ${src}`);
    }
  }
  throw new Error("No se pudieron cargar los scripts externos");
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
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [startRequested, setStartRequested] = useState(false);

  // Cargar modelo
  useEffect(() => {
    async function loadModel() {
      try {
        setStatusText("Cargando modelo LESSA...");
        await tf.setBackend("webgl").catch(() => tf.setBackend("cpu"));
        await tf.ready();

        const model = await tf.loadLayersModel(MODEL_PATH);
        modelRef.current = model;
        setProgress(100);
        setStatusText("✅ Modelo LESSA cargado correctamente");
        console.log("✅ Modelo LESSA cargado exitosamente");
      } catch (err) {
        console.error("❌ Error al cargar el modelo:", err);
        setError("No se pudo cargar el modelo LESSA.");
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    }
    loadModel();
  }, []);

  // Configurar cámara y MediaPipe
  useEffect(() => {
    let hands: any = null;
    let camera: any = null;
    let running = true;

    async function setup() {
      try {
        setLoading(true);
        setProgress(0);

        const isSecure = location.protocol === "https:" || location.hostname === "localhost";
        if (!isSecure) {
          setError("⚠️ La cámara requiere HTTPS o localhost.");
          setLoading(false);
          return;
        }

        await loadScriptWithStatus(CAMERA_SOURCES, setProgress, setStatusText);
        await loadScriptWithStatus(DRAWING_SOURCES, setProgress, setStatusText);
        await loadScriptWithStatus(HANDS_SOURCES, setProgress, setStatusText);

        // @ts-ignore
        const Hands = window.Hands;
        // @ts-ignore
        const Camera = window.Camera;
        // @ts-ignore
        const { drawConnectors, drawLandmarks, HAND_CONNECTIONS } = window;

        hands = new Hands({
          locateFile: (file: string) => `${HANDS_CDN}/${file}`,
        });
        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.7,
          minTrackingConfidence: 0.7,
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

            if (modelRef.current) {
              const input = preprocessLandmarks(landmarks);
              const tensor = tf.tensor2d([input], [1, 63]);
              const prediction = modelRef.current.predict(tensor) as tf.Tensor;
              const probs = await prediction.data();
              const maxIndex = probs.indexOf(Math.max(...probs));
              if (maxIndex >= 0 && isFinite(maxIndex)) {
                setLetter(String.fromCharCode(65 + maxIndex));
              }
              tensor.dispose();
              prediction.dispose();
            }
          } else {
            setLetter("—");
          }
        });

        if (startRequested) {
          setTimeout(() => {
            camera = new Camera(videoRef.current, {
              onFrame: async () => running && (await hands.send({ image: videoRef.current })),
              width: 480,
              height: 360,
            });
            camera.start().then(() => {
              setCameraReady(true);
              setError(null);
              setStatusText("🎥 Cámara iniciada correctamente");
            });
          }, 500);
        }
      } catch (e) {
        console.error(e);
        setError("No se pudo iniciar la cámara o cargar los modelos.");
      } finally {
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
      <h2 className="text-2xl font-bold text-emerald-400 drop-shadow">Traductor LESSA</h2>

      {/* Contenedor de cámara */}
      <div className="relative w-[480px] h-[360px]">
        <video
          ref={videoRef}
          className="rounded-lg border border-emerald-400 shadow w-full h-full bg-black object-contain"
          style={{ display: cameraReady ? "block" : "none" }}
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          className="absolute top-0 left-0 w-full h-full pointer-events-none rounded-lg border border-emerald-400"
        />
        {!cameraReady && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => {
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

      {/* Barra de progreso */}
      {loading && (
        <div className="w-full mt-4 text-center">
          <div className="text-sm text-emerald-300 mb-1">{statusText}</div>
          <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Resultado */}
      <div className="mt-4 bg-white/10 rounded-xl p-4 w-48 text-center">
        <div className="text-emerald-400 font-bold text-lg mb-2">Letra detectada:</div>
        <div className="text-7xl font-extrabold text-emerald-400 drop-shadow">{letter}</div>
      </div>

      {error && <div className="mt-3 text-red-400 text-sm font-semibold">{error}</div>}
    </div>
  );
}
