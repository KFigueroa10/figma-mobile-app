import { useEffect, useRef, useState } from "react";

// === Cargar scripts de MediaPipe desde CDN ===
async function loadMediaPipeScripts() {
  const scripts = [
    "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
    "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
    "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
  ];

  for (const src of scripts) {
    if (!document.querySelector(`script[src="${src}"]`)) {
      await new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => reject(`❌ Error al cargar ${src}`);
        document.body.appendChild(s);
      });
    }
  }

  // Esperar hasta que estén disponibles globalmente
  await new Promise<void>((resolve) => {
    const check = () => {
      if ((window as any).Hands && (window as any).Camera) resolve();
      else setTimeout(check, 300);
    };
    check();
  });
}

// === Función para normalizar puntos ===
function preprocessLandmarks(landmarks: any[]): number[] {
  if (!landmarks || landmarks.length === 0) return [];
  const base = landmarks[0];
  const centered = landmarks.flatMap((lm: any) => [
    (lm.x ?? 0) - (base.x ?? 0),
    (lm.y ?? 0) - (base.y ?? 0),
    (lm.z ?? 0) - (base.z ?? 0),
  ]);
  const maxAbs = Math.max(1e-6, ...centered.map((v) => Math.abs(v)));
  return centered.map((v) => v / maxAbs);
}

// === Calcular distancia Euclidiana entre dos vectores ===
function euclideanDistance(v1: number[], v2: number[]) {
  if (v1.length !== v2.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < v1.length; i++) {
    const diff = v1[i] - v2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

// === Cargar todas las señas del diccionario (JSONs) ===
async function loadSignDictionary() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const dictionary: Record<string, number[]> = {};

  for (const letter of letters) {
    try {
      const res = await fetch(`/images/json/${letter}.json`);
      if (!res.ok) continue;
      const data = await res.json();
      if (data.length > 0 && data[0].puntos) {
        const processed = preprocessLandmarks(data[0].puntos);
        dictionary[letter] = processed;
      }
    } catch {
      // Ignorar letras que no existan
    }
  }
  return dictionary;
}

// === Componente principal ===
export default function TlSenias() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [letter, setLetter] = useState("—");
  const [dictionary, setDictionary] = useState<Record<string, number[]>>({});
  const [loading, setLoading] = useState(true);
  const [cameraReady, setCameraReady] = useState(false);
  const [startRequested, setStartRequested] = useState(false);
  const [statusText, setStatusText] = useState("Cargando...");

  // === Cargar diccionario y MediaPipe ===
  useEffect(() => {
    async function init() {
      setStatusText("Cargando señas del diccionario...");
      const dict = await loadSignDictionary();
      setDictionary(dict);

      setStatusText("Cargando MediaPipe...");
      await loadMediaPipeScripts();

      setLoading(false);
      setStatusText("Listo ✅");
    }
    init();
  }, []);

  // === Configurar cámara ===
  useEffect(() => {
    if (!startRequested || loading) return;

    let camera: any = null;
    let hands: any = null;
    let running = true;

    async function setupCamera() {
      const Hands = (window as any).Hands;
      const Camera = (window as any).Camera;
      const { drawConnectors, drawLandmarks, HAND_CONNECTIONS } = (window as any);

      hands = new Hands({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240/${file}`,
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

        if (results.multiHandLandmarks?.length) {
          const landmarks = results.multiHandLandmarks[0];
          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: "#00FFC6", lineWidth: 3 });
          drawLandmarks(ctx, landmarks, { color: "#FF4444", lineWidth: 1 });

          const input = preprocessLandmarks(landmarks);

          // Buscar la seña más parecida en el diccionario
          let bestLetter = "—";
          let bestDistance = Infinity;

          for (const [ltr, ref] of Object.entries(dictionary)) {
            const dist = euclideanDistance(input, ref);
            if (dist < bestDistance) {
              bestDistance = dist;
              bestLetter = ltr;
            }
          }

          // Mostrar letra si la similitud es buena
          if (bestDistance < 2.5) setLetter(bestLetter);
          else setLetter("—");
        } else {
          setLetter("—");
        }
      });

      camera = new Camera(videoRef.current, {
        onFrame: async () => running && (await hands.send({ image: videoRef.current })),
        width: 480,
        height: 360,
      });
      await camera.start();
      setCameraReady(true);
    }

    setupCamera();

    return () => {
      running = false;
      if (camera && camera.stop) camera.stop();
    };
  }, [startRequested, dictionary]);

  return (
    <div className="w-full max-w-xl mx-auto bg-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-emerald-400 drop-shadow">Traductor LESSA (sin modelo)</h2>

      {/* Cámara */}
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
              onClick={() => setStartRequested(true)}
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg font-semibold shadow hover:bg-emerald-600 transition"
            >
              Iniciar Cámara
            </button>
          </div>
        )}
      </div>

      {/* Estado */}
      {loading && (
        <div className="text-emerald-300 text-sm text-center">{statusText}</div>
      )}

      {/* Resultado */}
      <div className="mt-4 bg-white/10 rounded-xl p-4 w-48 text-center">
        <div className="text-emerald-400 font-bold text-lg mb-2">Letra detectada:</div>
        <div className="text-7xl font-extrabold text-emerald-400 drop-shadow">{letter}</div>
      </div>
    </div>
  );
}
