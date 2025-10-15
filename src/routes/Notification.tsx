import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiHome, FiGlobe, FiBookOpen, FiUsers, FiBell, FiLogOut, FiMoreVertical } from 'react-icons/fi'

export default function Notification() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const nav = useNavigate()

  // Cerrar el dropdown de usuario al hacer click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

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

      {/* Botón menú */}
      <button
        className="absolute top-6 left-6 text-white text-3xl z-50"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-slate-900 rounded-br-[45px] z-30 transform transition-transform duration-300 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Menu items */}
        <div className="absolute left-[82px] top-[115px] text-white text-base font-['Phetsarath'] flex items-center gap-3 cursor-pointer" onClick={() => nav('/home')}><FiHome className="text-xl text-white" aria-hidden="true"/>Inicio</div>
        <div className="absolute left-[82px] top-[178px] text-white text-base font-['Phetsarath'] flex items-center gap-3 cursor-pointer" onClick={() => nav('/translator')}><FiGlobe className="text-xl text-white" aria-hidden="true"/>Traductor</div>
        <div className="absolute left-[78px] top-[243px] text-white text-base font-['Phetsarath'] flex items-center gap-3 cursor-pointer" onClick={() => nav('/learning')}><FiBookOpen className="text-xl text-white" aria-hidden="true"/>Aprendizaje</div>
        <div className="absolute left-[79px] top-[310px] text-white text-base font-['Phetsarath'] flex items-center gap-3 cursor-pointer" onClick={() => nav('/community')}><FiUsers className="text-xl text-white" aria-hidden="true"/>Comunidad</div>
        <div className="absolute left-[78px] top-[379px] text-white text-base font-['Phetsarath'] flex items-center gap-3 cursor-pointer" onClick={() => nav('/notification')}><FiBell className="text-xl text-white" aria-hidden="true"/>Notificación</div>

        {/* Panel de usuario */}
        <div ref={userMenuRef} className="absolute left-6 bottom-6 w-56 z-40">
          <div className="bg-slate-800 rounded-lg flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3">
              <img src="src/img/k.png" alt="avatar" className="w-10 h-10 rounded-full object-cover" />
              <div>
                <div className="text-white font-bold">usuario</div>
                <div className="text-gray-300 text-xs">usuario@example.com</div>
              </div>
            </div>
            <div className="relative">
              <button
                aria-haspopup="true"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen(v => !v)}
                className="p-2 rounded-md text-white hover:bg-slate-700"
                title="Más opciones"
              >
                <FiMoreVertical className="w-5 h-5" />
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 bottom-12 w-44 bg-slate-800 rounded-md shadow-lg overflow-hidden">
                  <button className="w-full text-left px-4 py-2 text-white hover:bg-slate-700" onClick={() => { setUserMenuOpen(false) }}>Perfil</button>
                  <button className="w-full text-left px-4 py-2 text-white hover:bg-slate-700" onClick={() => { setUserMenuOpen(false) }}>Configuración</button>
                  <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-slate-700" onClick={() => { localStorage.removeItem('authed'); nav('/welcome') }}>Cerrar sesión</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Contenido para Notificación */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <h1 className="text-white text-4xl font-bold">Notificación</h1>
      </div>
    </div>
  )
}
