import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  FiHome, 
  FiGlobe, 
  FiBookOpen, 
  FiUsers, 
  FiBell, 
  FiLogOut, 
  FiMoreVertical, 
  FiGrid, 
  FiMessageSquare,
  FiAward,
  FiUser,
  FiSettings
} from 'react-icons/fi'

interface MenuLayoutProps {
  children?: React.ReactNode;
}

export default function MenuLayout({ children }: MenuLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const nav = useNavigate()
  const location = useLocation()

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
    <div className="relative w-full min-h-screen overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url("src/img/fondo3.0.png")' }}>
      <div className="flex h-full">
        {/* Botón menú */}
        <button 
          className="fixed top-6 left-6 text-white text-3xl z-50"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-full w-80 bg-slate-900/95 backdrop-blur-sm border-r border-slate-700/50 z-30 transform transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Logo y título */}
          <div className="flex items-center justify-center py-6 border-b border-slate-700/50">
            <img 
              src="src/img/logo.png" 
              alt="Logo" 
              className="h-16 w-16 object-contain"
            />
            <h1 className="ml-3 text-xl font-bold text-white">AprendeLengua</h1>
          </div>

          {/* Menu items con espaciado mejorado */}
          <div className="flex flex-col space-y-2 px-6 py-6 overflow-y-auto h-[calc(100vh-180px)] scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
            {/* Inicio */}
            <div 
              className={`${location.pathname === '/home' ? 'bg-slate-800/80 text-white ring-1 ring-slate-700' : ''} text-white/90 text-base font-medium flex items-center gap-4 cursor-pointer hover:bg-slate-800/70 p-3 rounded-xl transition-all duration-200 hover:translate-x-2 hover:text-white`}
              onClick={() => nav('/home')}
            >
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <FiHome className="text-xl text-blue-400" aria-hidden="true"/>
              </div>
              <span>Inicio</span>
            </div>

            {/* Tablero (ST-main) */}
            <div 
              className={`${location.pathname === '/dashboard' ? 'bg-slate-800/80 text-white ring-1 ring-slate-700' : ''} text-white/90 text-base font-medium flex items-center gap-4 cursor-pointer hover:bg-slate-800/70 p-3 rounded-xl transition-all duration-200 hover:translate-x-2 hover:text-white`}
              onClick={() => nav('/dashboard')}
            >
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <FiGrid className="text-xl text-purple-400" aria-hidden="true"/>
              </div>
              <span>Tablero</span>
            </div>

            {/* Aprender (ST-main usa /learn) */}
            <div 
              className={`${location.pathname === '/learn' ? 'bg-slate-800/80 text-white ring-1 ring-slate-700' : ''} text-white/90 text-base font-medium flex items-center gap-4 cursor-pointer hover:bg-slate-800/70 p-3 rounded-xl transition-all duration-200 hover:translate-x-2 hover:text-white`}
              onClick={() => nav('/learn')}
            >
              <div className="p-2 bg-green-500/20 rounded-lg">
                <FiBookOpen className="text-xl text-green-400" aria-hidden="true"/>
              </div>
              <span>Aprender</span>
            </div>

            {/* Practica (ST-main) */}
            <div 
              className={`${location.pathname === '/practice' ? 'bg-slate-800/80 text-white ring-1 ring-slate-700' : ''} text-white/90 text-base font-medium flex items-center gap-4 cursor-pointer hover:bg-slate-800/70 p-3 rounded-xl transition-all duration-200 hover:translate-x-2 hover:text-white`}
              onClick={() => nav('/practice')}
            >
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <FiAward className="text-xl text-yellow-400" aria-hidden="true"/>
              </div>
              <span>Practica</span>
            </div>

            {/* Traductor */}
            <div 
              className={`${location.pathname === '/translator' ? 'bg-slate-800/80 text-white ring-1 ring-slate-700' : ''} text-white/90 text-base font-medium flex items-center gap-4 cursor-pointer hover:bg-slate-800/70 p-3 rounded-xl transition-all duration-200 hover:translate-x-2 hover:text-white`}
              onClick={() => nav('/translator')}
            >
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <FiGlobe className="text-xl text-cyan-400" aria-hidden="true"/>
              </div>
              <span>Traductor</span>
            </div>

            {/* Chatbot (ST-main) */}
            <div 
              className={`${location.pathname === '/chatbot' ? 'bg-slate-800/80 text-white ring-1 ring-slate-700' : ''} text-white/90 text-base font-medium flex items-center gap-4 cursor-pointer hover:bg-slate-800/70 p-3 rounded-xl transition-all duration-200 hover:translate-x-2 hover:text-white`}
              onClick={() => nav('/chatbot')}
            >
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <FiMessageSquare className="text-xl text-pink-400" aria-hidden="true"/>
              </div>
              <span>Chatbot</span>
            </div>

            {/* Comunidad */}
            <div 
              className={`${location.pathname === '/community' ? 'bg-slate-800/80 text-white ring-1 ring-slate-700' : ''} text-white/90 text-base font-medium flex items-center gap-4 cursor-pointer hover:bg-slate-800/70 p-3 rounded-xl transition-all duration-200 hover:translate-x-2 hover:text-white`}
              onClick={() => nav('/community')}
            >
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <FiUsers className="text-xl text-emerald-400" aria-hidden="true"/>
              </div>
              <span>Comunidad</span>
            </div>

            {/* Notificaciones */}
            <div 
              className={`${location.pathname === '/notification' ? 'bg-slate-800/80 text-white ring-1 ring-slate-700' : ''} text-white/90 text-base font-medium flex items-center gap-4 cursor-pointer hover:bg-slate-800/70 p-3 rounded-xl transition-all duration-200 hover:translate-x-2 hover:text-white`}
              onClick={() => nav('/notification')}
            >
              <div className="p-2 bg-rose-500/20 rounded-lg">
                <FiBell className="text-xl text-rose-400" aria-hidden="true"/>
              </div>
              <span>Notificaciones</span>
            </div>
          </div>

          {/* Panel de usuario en la parte inferior */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50 p-4">
            <div ref={userMenuRef} className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <img 
                  src="src/img/k.png" 
                  alt="avatar" 
                  className="w-10 h-10 rounded-full border-2 border-slate-600 object-cover" 
                />
                <div className="overflow-hidden">
                  <div className="text-white font-medium truncate">usuario</div>
                  <div className="text-slate-400 text-xs truncate">usuario@example.com</div>
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
                  <FiMoreVertical className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 bottom-12 w-56 bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl overflow-hidden border border-slate-700/50">
                    <button 
                      className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-700/50 flex items-center gap-3 transition-colors" 
                      onClick={() => { /* abrir perfil */ setUserMenuOpen(false) }}
                    >
                      <div className="p-1.5 bg-blue-500/20 rounded-lg">
                        <FiUser className="text-blue-400" />
                      </div>
                      <span>Perfil</span>
                    </button>
                    <button 
                      className="w-full text-left px-4 py-3 text-slate-200 hover:bg-slate-700/50 flex items-center gap-3 transition-colors" 
                      onClick={() => { /* abrir ajustes */ setUserMenuOpen(false) }}
                    >
                      <div className="p-1.5 bg-purple-500/20 rounded-lg">
                        <FiSettings className="text-purple-400" />
                      </div>
                      <span>Configuración</span>
                    </button>
                    <button 
                      className="w-full text-left px-4 py-3 text-rose-400 hover:bg-slate-700/50 flex items-center gap-3 transition-colors" 
                      onClick={() => { localStorage.removeItem('authed'); nav('/welcome') }}
                    >
                      <div className="p-1.5 bg-rose-500/20 rounded-lg">
                        <FiLogOut className="text-rose-400" />
                      </div>
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
        
        {/* Contenido principal */}
        <div className={`flex-1 transition-all duration-300 ${menuOpen ? 'ml-80' : 'ml-0'} overflow-auto`}>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
