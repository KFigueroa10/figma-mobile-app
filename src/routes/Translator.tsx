import TlSenias from '../components/tlseñas'

export default function Translator() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Fondo de pantalla */}
      <img
        src="src/img/fondo3.0.png"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      {/* Logo en la esquina superior derecha */}
      <img
        src="src/img/logo.png"
        alt="Logo"
        className="absolute top-4 right-8 sm:right-12 w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-40"
      />

      {/* Contenido para Traductor */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen gap-8">
        <h1 className="text-white text-4xl font-bold mb-6">Traductor</h1>
        <div className="flex flex-col items-center gap-4 bg-white/10 p-6 rounded-2xl shadow-lg">
          <TlSenias />
        </div>
      </div>
    </div>
  )
}
