import { useEffect, useRef, useState } from "react";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";

type Result = { predictedLabel: string; confidence: number; feedback?: string };

export function useTlSenias() {
  const detectorRef = useRef<handPoseDetection.HandDetector | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadModel() {
    if (detectorRef.current || loading) return;
    setLoading(true);
    try {
      const model = handPoseDetection.SupportedModels.MediaPipeHands;
      const detector = await handPoseDetection.createDetector(model, {
        runtime: "mediapipe",
        solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
      } as any);
      detectorRef.current = detector;
    } catch (e) {
      console.error("Error cargando modelo de manos:", e);
      detectorRef.current = null;
    } finally {
      setLoading(false);
    }
  }

  async function analyzeFrame(videoEl: HTMLVideoElement | null, expectedSign?: string): Promise<Result> {
    if (!videoEl) return { predictedLabel: "Video no disponible", confidence: 0, feedback: "Video no disponible" };
    if (!detectorRef.current) await loadModel();
    if (!detectorRef.current) return { predictedLabel: "Modelo no disponible", confidence: 0, feedback: "Error cargando modelo" };

    try {
      const hands = await detectorRef.current.estimateHands(videoEl, { flipHorizontal: true });
      if (!hands || hands.length === 0) return { predictedLabel: "Ninguna mano", confidence: 0, feedback: "No se detectaron manos" };

      // Placeholder: convertir keypoints a vector y aplicar clasificador propio
      const confidence = Math.round((Math.random() * 0.6 + 0.2) * 100);
      const predictedLabel = expectedSign && Math.random() > 0.5 ? expectedSign : "Desconocida";
      const feedback = confidence > 70 ? "Muy bien" : "Ajusta la postura";
      return { predictedLabel, confidence, feedback };
    } catch (e: any) {
      console.error("Error durante inferencia:", e);
      return { predictedLabel: "Error", confidence: 0, feedback: e?.message || "Error en inferencia" };
    }
  }

  return { loadModel, analyzeFrame, loading } as const;
}

export default function TlSenias({ videoRef, expectedSign, onResult }: { videoRef: React.RefObject<HTMLVideoElement>; expectedSign?: string; onResult?: (r: Result) => void }) {
  const { loadModel, analyzeFrame, loading } = useTlSenias();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    loadModel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleAnalyze() {
    if (busy) return;
    setBusy(true);
    try {
      const res = await analyzeFrame(videoRef.current, expectedSign);
      onResult?.(res);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleAnalyze} disabled={loading || busy}>
        {loading ? "Cargando modelo..." : busy ? "Analizando..." : "Analizar (TlSeñas)"}
      </button>
    </div>
  );
}
