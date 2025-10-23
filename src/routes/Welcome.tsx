import { Link } from 'react-router-dom'
import welcome from '@/img/welcome.png'

export default function Welcome() {
  return (
    <div 
      data-layer="Welcome" 
      className="Welcome min-h-screen w-full relative bg-white flex justify-center overflow-hidden"
    >
      {/* Fondo con imagen */}
      <img 
        data-layer="KMK-Photoroom 1" 
        className="KmkPhotoroom1 absolute inset-0 w-full h-full object-cover" 
        src={welcome} 
        alt="Fondo"
      />

      {/* Capa de degradado */}
      <div 
        data-layer="personas" 
        className="Personas absolute inset-0 bg-gradient-to-b from-indigo-700/20 to-black/60" 
      />

      {/* Contenido centrado horizontal y más abajo */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 py-8 rounded-3xl shadow-lg w-full max-w-md mt-56 sm:mt-72">

        {/* Botón Login como Link */}
        <Link 
          to="/login"
          className="Rectangle1 w-64 h-14 bg-slate-900 rounded-[40px] flex items-center justify-center mb-4 hover:bg-slate-800 transition"
        >
          <span className="LogIn text-white text-xl font-bold font-['Phetsarath']">
            Log in
          </span>
        </Link>

        {/* Texto registro debajo del botón */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-white text-xl font-normal font-['Phetsarath'] mb-4">
          <span data-layer="¿No tienes cuenta?">¿No tienes cuenta?</span>
          <Link 
            data-layer="Regístrate" 
            to="/register" 
            className="RegStrate text-green-500 underline"
          >
            Regístrate
          </Link>
        </div>

        {/* Recupera tu contraseña al final */}
        <h2 
          data-layer="Recupera tu contraseña" 
          className="RecuperaTuContraseA text-sky-300/90 text-xl font-normal font-['Phetsarath']"
        >
          Recupera tu contraseña
        </h2>
      </div>
    </div>
  )
}
