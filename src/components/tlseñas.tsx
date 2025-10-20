
import { useEffect, useRef, useState } from "react";
import * as tf from '@tensorflow/tfjs';

// Utilidades para cargar MediaPipe Hands desde CDN
const HANDS_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/hands";
const CAMERA_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js";
const DRAWING_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js";

// Ruta al modelo LESSA
const MODEL_PATH = '/models/lessa_model.json';

// Cargar scripts externos dinámicamente
function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src='${src}']`)) return resolve();
    const script = document.createElement('script');
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
  const [mode, setMode] = useState(1);
  const [fingerCount, setFingerCount] = useState(0);
  const [letter, setLetter] = useState("—");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Cargar el modelo LESSA
  useEffect(() => {
    async function loadModel() {
      try {
        const model = await tf.loadLayersModel(MODEL_PATH);
        modelRef.current = model;
        console.log('Modelo LESSA cargado exitosamente');
      } catch (err) {
        console.error('Error al cargar el modelo:', err);
        setError("Error al cargar el modelo LESSA. Por favor, recarga la página.");
      }
    }
    loadModel();
  }, []);

  // Cargar scripts y MediaPipe Hands
  useEffect(() => {
    let hands: any = null;
    let camera: any = null;
    let running = true;

    async function setup() {
      setLoading(true);
      setError(null);
      try {
        await loadScript(CAMERA_CDN);
        await loadScript(DRAWING_CDN);
        await loadScript(HANDS_CDN + "/hands.js");
        // @ts-ignore
        const Hands = window.Hands;
        // @ts-ignore
        const Camera = window.Camera;
        // @ts-ignore
        const { drawConnectors, drawLandmarks, HAND_CONNECTIONS } = window;

        hands = new Hands({
          locateFile: (file: string) => `${HANDS_CDN}/${file}`
        });
        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6
        });

        hands.onResults(async (results: any) => {
          if (!canvasRef.current || !videoRef.current || !modelRef.current) return;
          const ctx = canvasRef.current.getContext('2d');
          if (!ctx) return;
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.save();
          ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

          if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            const landmarks = results.multiHandLandmarks[0]; // Tomamos la primera mano detectada
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#00FFC6', lineWidth: 3 });
            drawLandmarks(ctx, landmarks, { color: '#FF4444', lineWidth: 1 });
            
            // Preparar datos para el modelo
            const input = landmarks.flatMap((lm: any) => [lm.x, lm.y, lm.z]); // Convertir landmarks a vector plano
            const tensorInput = tf.tensor2d([input]);
            
            // Hacer predicción
            const prediction = await modelRef.current.predict(tensorInput) as tf.Tensor;
            const probabilities = await prediction.data();
            const maxIndex = probabilities.indexOf(Math.max(...probabilities));
            const letter = String.fromCharCode(65 + maxIndex); // Convertir índice a letra (A=65 en ASCII)
            
            setLetter(letter);
            // Cleanup
            tensorInput.dispose();
            prediction.dispose();
          } else {
            setLetter("—");
          }
          ctx.restore();
        });

        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (running) await hands.send({ image: videoRef.current });
          },
          width: 400,
          height: 300
        });
        setCameraReady(true);
        setLoading(false);
      } catch (e) {
        setError("No se pudo cargar la cámara o los modelos. Verifica permisos y conexión a internet.");
        setLoading(false);
      }
    }
    setup();
    return () => {
      running = false;
      if (camera && camera.stop) camera.stop();
    };
  }, [mode]);

  // Iniciar cámara al presionar el botón
  function handleStartCamera() {
    setError(null);
    if (videoRef.current && videoRef.current.srcObject == null) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          videoRef.current!.srcObject = stream;
          videoRef.current!.play();
        })
        .catch(() => setError("No se pudo acceder a la cámara. Verifica permisos."));
    }
  }

  // Cambiar modo
  function handleMode(m: number) {
    setMode(m);
  }



  return (
    <div className="w-full max-w-xl mx-auto bg-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-emerald-400 mb-2 drop-shadow">Traductor LESSA</h2>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center w-full">
        <div className="flex flex-col items-center relative w-[400px] h-[300px]">
          <div className="relative w-full h-full flex items-center justify-center">
            <video ref={videoRef} className="rounded-lg border border-emerald-400 shadow w-full h-full bg-black object-cover" style={{display: cameraReady ? 'block' : 'none'}} autoPlay playsInline muted />
            <canvas ref={canvasRef} width={400} height={300} className="rounded-lg border border-emerald-400 shadow w-full h-full absolute top-0 left-0 pointer-events-none" style={{zIndex:2}} />
            {!cameraReady && (
              <button onClick={handleStartCamera} className="absolute z-10 px-6 py-2 bg-emerald-500 text-white rounded-lg font-semibold shadow hover:bg-emerald-600 transition">Iniciar Cámara</button>
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
      {loading && <div className="text-white/80">Cargando modelo y cámara...</div>}
      <div className="text-xs text-gray-400 mt-2 text-center max-w-md">Si la cámara no se activa, revisa los permisos del navegador y asegúrate de estar en localhost o https. Si ves este mensaje repetidamente, recarga la página o prueba otro navegador.</div>
    </div>
  );
}
