import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";

// Simple Lottie loader from a remote JSON (replace the URL if you have your own file)
const DEFAULT_LOTTIE_URL =
  "https://assets9.lottiefiles.com/private_files/lf30_q5pk6p1k.json"; // friendly character waving

const tipsDefault = [
  "Practica 5 minutos al día",
  "Repasa tus señas recientes",
  "Usa /learn para explorar lecciones",
  "Prueba /practice?sign=hola",
];

export function MascotLottie({
  lottieUrl = DEFAULT_LOTTIE_URL,
  animationData,
  tips = tipsDefault,
  className = "w-full h-full",
}: {
  lottieUrl?: string;
  animationData?: any;
  tips?: string[];
  className?: string;
}) {
  const [data, setData] = useState<any | null>(animationData ?? null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (animationData) {
      try {
        const parsed = typeof animationData === 'string' ? JSON.parse(animationData) : animationData;
        setData(parsed);
        // eslint-disable-next-line no-console
        console.log('[MascotLottie] Loaded animationData (direct import)');
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('[MascotLottie] Failed to parse animationData string', e);
      }
      return;
    }
    let mounted = true;
    fetch(lottieUrl)
      .then((r) => r.json())
      .then((json) => {
        if (mounted) {
          setData(json);
          // eslint-disable-next-line no-console
          console.log('[MascotLottie] Fetched Lottie JSON from URL');
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[MascotLottie] Fetch failed', err);
        setData(null);
      });
    return () => {
      mounted = false;
    };
  }, [lottieUrl, animationData]);

  useEffect(() => {
    if (!tips?.length) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % tips.length);
    }, 4000);
    return () => clearInterval(t);
  }, [tips]);

  const currentTip = useMemo(() => tips[idx] ?? "", [idx, tips]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center min-h-[240px] rounded-xl overflow-hidden">
        {data ? (
          <Lottie
            animationData={data}
            loop
            autoplay
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
            style={{ width: '70%', height: '70%', minHeight: 240, background: 'transparent', pointerEvents: 'none' }}
          />
        ) : (
          <div className="text-gray-500 text-sm">Cargando animación…</div>
        )}
      </div>

      {/* Bubble tip */}
      <div className="absolute top-2 right-2 max-w-[220px] p-3 rounded-2xl bg-white/95 text-gray-800 text-sm shadow-lg border border-gray-200">
        <div className="absolute -right-2 top-4 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white/95" />
        {currentTip}
      </div>
    </div>
  );
}

export default MascotLottie;
