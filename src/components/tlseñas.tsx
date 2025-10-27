import { useEffect, useRef, useState } from "react";

// === URLs de MediaPipe ===
const HANDS_CDN = "https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4.1675469240";

// === Normalizar landmarks ===
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

// === Calcular distancia euclidiana promedio ===
function euclideanDistance(arr1: number[], arr2: number[]): number {
  let sum = 0;
  for (let i = 0; i < arr1.length; i++) {
    sum += (arr1[i] - arr2[i]) ** 2;
  }
  return Math.sqrt(sum / arr1.length);
}

// === Cargar todos los JSON de señas ===
async function loadSignDictionary() {
  // 🔤 Cambia o expande según los JSON que tengas
  const letters = ["A", "B", "C", "D", "E"];
  const dict: Record<string, number[]> = {};

  for (const l of letters) {
    const res = await fetch(`/json/${l.toLowerCase()}.json`);
    const data = await res.json();
    // Convertimos a formato normalizado igual que MediaPipe
    dict[l] = preprocessLandmarks(
      data.landmarks.map(([x, y, z]: number[]) => ({ x, y, z }))
    );
  }

  console.log("✅ Diccionario de señas cargado:", dict);
  return dict;
}

// === Cargar scripts de MediaPipe dinámicamente ===
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

  await new Promise<void>((resolve) => {
    const check = () => {
      if ((window as any).Hands && (window as any).Camera) resolve();
      else setTimeout(check, 300);
    };
    check();
  });
}

// === Componente principal ===
export default function TlSenias() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [letter, setLetter] = useState("—");
  const [dict, setDict] = useState<Record<string, number[]> | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [startRequested, setStartRequested] = useState(false);
  const [statusText, setStatusText] = useState("Esperando inicialización...");
  const [loading, setLoading] = useState(true);

  // === Inicialización ===
  useEffect(() => {
    async function init() {
      try {
        setStatusText("Cargando MediaPipe...");
        await loadMediaPipeScripts();

        setStatusText("Cargando señas de referencia...");
        const dictionary = await loadSignDictionary();
        setDict(dictionary);

        setStatusText("✅ Todo listo, puedes iniciar la cámara.");
      } catch (err) {
        console.error("Error inicializando:", err);
        setStatusText("❌ Error al inicializar componentes");
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // === Configurar MediaPipe Hands y la cámara ===
  useEffect(() => {
    if (!dict || !startRequested) return;

    let camera: any = null;
    let hands: any = null;
    let running = true;

    async function setup() {
      try {
        const Hands = (window as any).Hands;
        const Camera = (window as any).Camera;
        const { drawConnectors, drawLandmarks, HAND_CONNECTIONS } = (window as any);

        hands = new Hands({
          locateFile: (file: string) => `${HANDS_CDN}/${file}`,
        });

        hands.setOptions({
          maxNumHands: 1,
          modelComplexity: 1,
          minDetectionConfidence: 0.6,
          minTrackingConfidence: 0.6,
        });

        hands.onResults((results: any) => {
          const ctx = canvasRef.current?.getContext("2d");
          const video = videoRef.current;
          if (!ctx || !video) return;

          ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
          ctx.drawImage(results.image, 0, 0, canvasRef.current!.width, canvasRef.current!.height);

          if (results.multiHandLandmarks?.length) {
            const landmarks = results.multiHandLandmarks[0];
            drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: "#00FFC6", lineWidth: 3 });
            drawLandmarks(ctx, landmarks, { color: "#FF4444", lineWidth: 1 });

            // Procesar landmarks actuales
            const normalized = preprocessLandmarks(landmarks);
            let bestMatch = null;
            let bestDistance = Infinity;

            for (const [key, refLandmarks] of Object.entries(dict)) {
              const dist = euclideanDistance(normalized, refLandmarks);
              if (dist < bestDistance) {
                bestDistance = dist;
                bestMatch = key;
              }
            }

            if (bestMatch && bestDistance < 0.25) setLetter(bestMatch);
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
        setStatusText("🎥 Cámara activa");
      } catch (err) {
        console.error("Error configurando cámara:", err);
        setStatusText("❌ Error iniciando cámara");
      }
    }

    setup();
    return () => {
      running = false;
      if (camera && camera.stop) camera.stop();
    };
  }, [dict, startRequested]);

  return (
    <div className="w-full max-w-xl mx-auto bg-gray-900/80 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold text-emerald-400 drop-shadow">Traductor LESSA (Lookup)</h2>

      {/* === Cámara === */}
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

      {/* === Estado === */}
      <div className="mt-4 text-emerald-300 text-sm text-center">{statusText}</div>

      {/* === Resultado === */}
      <div className="mt-4 bg-white/10 rounded-xl p-4 w-48 text-center">
        <div className="text-emerald-400 font-bold text-lg mb-2">Letra detectada:</div>
        <div className="text-7xl font-extrabold text-emerald-400 drop-shadow">{letter}</div>
      </div>
    </div>
  );
}
