import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [pw, setPw] = useState('')
  const nav = useNavigate()

  function submit(e: React.FormEvent) {
    e.preventDefault()
    localStorage.setItem('authed','1') // simulado
    nav('/loading')
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden p-4">

      {/* Fondo de pantalla completo */}
      <img
        src="src/img/welcome.png"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Logo en la esquina superior izquierda, más grande */}
      <img
        src="src/img/logo.png"
        alt="Logo"
        className="w-56 h-56 sm:w-64 sm:h-64 absolute top-4 left-4 sm:top-6 sm:left-6"
      />

      {/* Card semi-transparente centrado */}
      <div className="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-sm rounded-[40px] p-12 sm:p-14 space-y-6">
        {/* Título */}
        <h2 className="text-center text-lg sm:text-xl font-bold text-black">
          Bienvenidos a nuestra app
        </h2>

        {/* Switch Login / Sing Up */}
        <div className="flex justify-center gap-4 mb-6">
          <button className="bg-slate-900 text-white py-3 px-6 rounded-[40px] font-bold hover:bg-slate-800 transition">
            Log in
          </button>
          <Link to="/register" className="bg-stone-300 text-black py-3 px-6 rounded-[40px] font-bold text-center hover:bg-stone-400 transition">
            Sing UP
          </Link>
        </div>

        {/* Formulario */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-black mb-1 font-['Phetsarath']">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border-b-2 border-black py-2 px-3 text-black focus:outline-none focus:border-indigo-500 transition bg-transparent"
              placeholder="Tu correo"
            />
          </div>

          <div>
            <label className="block text-black mb-1 font-['Phetsarath']">Password</label>
            <input
              type="password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              required
              className="w-full border-b-2 border-black py-2 px-3 text-black focus:outline-none focus:border-indigo-500 transition bg-transparent"
              placeholder="Tu contraseña"
            />
          </div>

          <button className="w-full bg-slate-900 text-white py-3 rounded-[40px] font-bold hover:bg-slate-800 transition">
            Iniciar sesión
          </button>
        </form>

        {/* Olvidaste contraseña */}
        <Link to="/forgot-password" className="block text-center text-black mt-4 hover:underline">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </div>
  )
}
