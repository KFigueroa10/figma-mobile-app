import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Loading() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Animación de carga de 10 segundos (100% en 10s)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate("/home"), 500); // Redirige a /home después de cargar
          return 100;
        }
        return prev + 1; // velocidad más lenta
      });
    }, 100);

    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-cyan-600 text-white font-sans p-4">
      {/* LOGO o íconos centrales */}
      <div className="flex gap-6 mb-8 items-center justify-center">
        <img
          src="https://placehold.co/80x80"
          alt="icono 1"
          className={`transition-all duration-700 ${
            progress > 20 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        />
        <img
          src="https://placehold.co/100x80"
          alt="icono 2"
          className={`transition-all duration-700 ${
            progress > 40 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        />
        <img
          src="https://placehold.co/60x80"
          alt="icono 3"
          className={`transition-all duration-700 ${
            progress > 60 ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        />
      </div>

      {/* Barra de progreso */}
      <div className="w-full max-w-xs bg-white/20 rounded-full h-2.5 mb-4">
        <div
          className="bg-white h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-sm font-medium">{progress}%</p>
    </div>
  );
}
