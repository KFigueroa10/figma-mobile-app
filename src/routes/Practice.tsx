import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { lessons } from "../lib/data";

export default function Practice() {
  const [params, setParams] = useSearchParams();
  const signParam = params.get("sign") || "Hola";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [camOn, setCamOn] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);

  function selectSign(title: string) {
    setParams({ sign: title });
  }

  async function startCamera() {
    try {
      setCamError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setCamOn(true);
    } catch (e: any) {
      setCamError(e?.message || "No se pudo acceder a la cámara");
      setCamOn(false);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCamOn(false);
  }

  useEffect(() => {
    return () => {
      // cleanup al desmontar
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  return (
    <div className="px-4 md:px-6 py-8 max-w-7xl mx-auto grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2 space-y-4">
        <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white">Práctica: {signParam}</CardTitle>
            <CardDescription className="text-white/80">Imita la seña y practica hasta dominarla.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative aspect-video w-full rounded-xl border border-white/10 bg-black/40 overflow-hidden">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              {!camOn && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                  <img src="src/img/logo.png" alt="Logo" className="w-28 h-28 object-contain drop-shadow" />
                  <div className="text-white/80">Activa la cámara para practicar</div>
                </div>
              )}
            </div>
            {camError && <div className="text-sm text-red-300">{camError}</div>}
            <div className="flex flex-wrap gap-2">
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm" onClick={() => (camOn ? stopCamera() : startCamera())}>
                {camOn ? "Apagar cámara" : "Prender cámara"}
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-sm" onClick={() => alert("Detectar seña (placeholder)")}>Detectar</Button>
              <Button variant="secondary" className="bg-white/90 hover:bg-white text-gray-900 border border-white/60" onClick={() => alert("Repetir (placeholder)")}>Repetir</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          <CardHeader>
            <CardTitle className="text-white">Elige una Seña</CardTitle>
            <CardDescription className="text-white/80">Selecciona una seña que quieras practicar.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <Button
                    variant={signParam === lesson.title ? "default" : "secondary"}
                    className={`w-full justify-start ${signParam === lesson.title ? 'bg-blue-600 hover:bg-blue-700' : 'bg-white/90 hover:bg-white text-gray-900 border border-white/60'}`}
                    onClick={() => selectSign(lesson.title)}
                  >
                    {lesson.title}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
