import { FiEye, FiTarget, FiInfo } from 'react-icons/fi'
import logo from '@/img/logo.png'

export default function Home() {
  return (
    <div className="relative w-full px-4 md:px-6 py-8 md:py-10">
      {/* Logo fijo arriba a la derecha */}
      <img
        src={logo}
        alt="Logo"
        className="absolute top-4 right-8 sm:right-12 w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] z-40 pointer-events-none"
      />
      {/* Encabezado */}
      <div className="max-w-7xl mx-auto mb-8 md:mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg tracking-tight">
          Bienvenido a AprendeLengua
        </h1>
        <p className="mt-2 text-white/80 max-w-2xl">
          Aprende, practica y domina la lengua de señas con una experiencia moderna, clara y accesible.
        </p>
      </div>

      {/* Sección de tarjetas */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-10">
        {/* Tarjeta 1 - Descripción */}
        <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/10 hover:border-white/25 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-center mb-4">
            <FiInfo className="text-blue-300 group-hover:text-blue-200 transition-colors text-4xl drop-shadow-md" />
          </div>
          <h2 className="text-xl font-bold text-center mb-3 text-white drop-shadow-sm">Descripción</h2>
          <p className="text-white/90 text-center">
            Nuestra app facilita el aprendizaje del lenguaje de señas, conectando a personas sordas y oyentes en una comunidad inclusiva.
          </p>
        </div>

        {/* Tarjeta 2 - Visión */}
        <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/10 hover:border-white/25 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0,18px,40px,rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-center mb-4">
            <FiEye className="text-purple-300 group-hover:text-purple-200 transition-colors text-4xl drop-shadow-md" />
          </div>
          <h2 className="text-xl font-bold text-center mb-3 text-white drop-shadow-sm">Visión</h2>
          <p className="text-white/90 text-center">
            Ser la plataforma líder en educación de lenguaje de señas, promoviendo inclusión y comunicación accesible para todos.
          </p>
        </div>

        {/* Tarjeta 3 - Misión */}
        <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/10 hover:border-white/25 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_18px_40px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-center mb-4">
            <FiTarget className="text-green-300 group-hover:text-green-200 transition-colors text-4xl drop-shadow-md" />
          </div>
          <h2 className="text-xl font-bold text-center mb-3 text-white drop-shadow-sm">Misión</h2>
          <p className="text-white/90 text-center">
            Proporcionar herramientas innovadoras para aprender y practicar lengua de señas de forma efectiva y divertida.
          </p>
        </div>
      </div>

      {/* Sección CTA */}
      <div className="max-w-7xl mx-auto mt-6 bg-gray-900/55 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/10 ring-1 ring-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-sm">¡Comienza tu viaje de aprendizaje!</h2>
        <p className="text-white/90 mb-6 max-w-3xl">
          Aprende lengua de señas con lecciones, práctica guiada y un tutor inteligente que te acompaña en cada paso.
        </p>
        <div className="flex flex-wrap gap-3 md:gap-4">
          <button
            onClick={() => window.location.href = '/learning'}
            className="px-5 md:px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
          >
            Empezar a aprender
          </button>
          <button
            onClick={() => window.location.href = '/practice'}
            className="px-5 md:px-6 py-3 bg-white/90 hover:bg-white text-gray-900 rounded-lg font-semibold transition-all border border-white/60 shadow-md hover:shadow-lg"
          >
            Practicar ahora
          </button>
        </div>
      </div>
    </div>
  )
}
 
