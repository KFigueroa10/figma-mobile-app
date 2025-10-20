import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";

// ✅ URLs fijas y estables de MediaPipe
const HANDS_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240";
const CAMERA_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils@0.3.1675469240/camera_utils.js";
const DRAWING_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils@0.3.1675469240/drawing_utils.js";

// Ruta de de donde esta el mdoelo 
const MODEL_PATH = "/models/lessa_model.json";

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

export default function TlSenias() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);

  const [cameraReady, setCameraReady] = useState(false);
  const [letter, setLetter] = useState("—");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar modelo
  useEffect(() => {
    async function loadModel() {
      try {
        const model = await tf.loadLayersModel(MODEL_PATH);
        modelRef.current = model;
        console.log("✅ Modelo LESSA cargado exitosamente");
      } catch (err) {
        console.error("❌ Error al cargar el modelo:", err);
        setError("No se pudo cargar el modelo LESSA.");
      }
    }
    loadModel();
  }, []);

  // Configurar MediaPipe y camara para agregar efectos a la camara

  useEffect(() => {
    let hands: any = null;
    let camera: any = null;
    let running = true;

    async function setup() {
      setLoading(true);
      try {
        await loadScript(CAMERA_CDN);
        await loadScript(DRAWING_CDN);
        await loadScript(`${HANDS_CDN}/hands.js`);

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

            // Predicción del modelo
            if (modelRef.current) {
              const input = landmarks.flatMap((lm: any) => [lm.x, lm.y, lm.z]);
              const tensor = tf.tensor2d([input]);
              const prediction = modelRef.current.predict(tensor) as tf.Tensor;
              const probs = await prediction.data();
              const maxIndex = probs.indexOf(Math.max(...probs));
              const detectedLetter = String.fromCharCode(65 + maxIndex);
              setLetter(detectedLetter);
              tensor.dispose();
              prediction.dispose();
            }
          } else {
            setLetter("—");
          }
        });

        // ✅ Retraso para inicializar cámara después de renderizar
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
            })
            .catch((e: any) => {
              console.error("Error al iniciar cámara:", e);
              setError("No se pudo acceder a la cámara. Verifica permisos.");
              setLoading(false);
            });
        }, 1000);
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
  }, []);

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
                  onClick={() =>
                    navigator.mediaDevices
                      .getUserMedia({ video: true })
                      .then((stream) => {
                        videoRef.current!.srcObject = stream;
                        videoRef.current!.play();
                      })
                      .catch(() => setError("❌ No se pudo acceder a la cámara."))
                  }
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-semibold shadow hover:bg-emerald-600 transition"
                >
                  Iniciar Cámara
                </button>
              </div>
            )}
          </div>
          {error && <div className="mt-2 text-red-400 text-sm font-semibold text-center w-full">{error}</div>}
        </div>

        <div className="flex flex-col gap-3 items-center">
          <div className="bg-white/10 rounded-xl p-4 w-48 text-center">
            <div className="text-emerald-400 font-bold text-lg mb-2">Letra detectada:</div>
            <div className="letter text-7xl font-extrabold text-emerald-400 drop-shadow">{letter}</div>
          </div>
        </div>
      </div>

      {loading && <div className="text-white/80">⏳ Cargando modelo y cámara...</div>}

      <div className="text-xs text-gray-400 mt-2 text-center max-w-md">
        Si la cámara no se activa, revisa los permisos del navegador y asegúrate de estar en localhost o https.
      </div>
    </div>
  );
}
