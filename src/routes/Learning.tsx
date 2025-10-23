import { useState, useRef, useEffect, useMemo } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { FiHome, FiGlobe, FiBookOpen, FiUsers, FiBell, FiLogOut, FiMoreVertical } from 'react-icons/fi'
import fondo from '@/img/fondo3.0.png'
import logo from '@/img/logo.png'
import avatar from '@/img/k.png'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { lessons } from '@/lib/data'

export default function Learning() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const nav = useNavigate()
  const location = useLocation()
  const [videoError, setVideoError] = useState(false)

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

  // Resolver lección desde el query ?lesson=
  const { currentLesson, lessonId } = useMemo(() => {
    const params = new URLSearchParams(location.search)
    const title = params.get('lesson') || ''
    const byTitle = lessons.find(l => l.title.toLowerCase() === title.toLowerCase())
    const fallback = lessons[0]
    const useL = byTitle ?? fallback
    // Derivar un id simple (usa l.id si existe en data)
    const id = useL.id || useL.title.toLowerCase().replace(/\s+/g, '-')
    return { currentLesson: useL, lessonId: id }
  }, [location.search])

  // Contenido MVP por lección (objetivos, ejemplos, video/subs, quiz)
  const content = useMemo(() => {
    const base = {
      goals: [
        'Comprender el gesto y su contexto',
        'Practicar con ejemplos visuales',
        'Aplicarlo en frases cortas',
      ],
      steps: [
        'Observa la posición inicial de la mano y la orientación de la palma.',
        'Realiza el movimiento principal con ritmo suave y constante.',
        'Repite frente a un espejo y corrige pequeños detalles de ángulo.',
      ],
      examples: [
        { phrase: 'Hola', tip: 'Mano abierta, movimiento suave' },
        { phrase: 'Gracias', tip: 'Dedos desde barbilla hacia afuera' },
      ],
      videoSrc: `/videos/${lessonId}.mp4`,
      subtitleSrc: `/subtitles/${lessonId}.vtt`,
      quiz: [
        {
          q: '¿Cuál es el contexto correcto para este gesto?',
          options: ['Saludar', 'Despedir', 'Pedir ayuda'],
          a: 0,
        },
        {
          q: '¿Cuál es el movimiento de la mano?',
          options: ['Hacia adentro', 'Hacia afuera', 'Arriba y abajo'],
          a: 1,
        },
      ],
    }
    // Puedes extender por lessonId si quieres personalizar
    return base
  }, [lessonId])

  const [answers, setAnswers] = useState<number[]>(Array(content.quiz.length).fill(-1))
  const [score, setScore] = useState<number | null>(null)

  const submitQuiz = () => {
    let s = 0
    content.quiz.forEach((q, idx) => {
      if (answers[idx] === q.a) s += 1
    })
    setScore(s)
    try {
      localStorage.setItem(`lesson:${lessonId}:score`, String(s))
    } catch {}
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Fondo de pantalla */}
      <img
        src={fondo}
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />
      {/* Logo en la esquina superior derecha */}
      <img
        src={logo}
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
              <img src={avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
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

      {/* Contenido para Aprendizaje */}
      <div className="relative z-10 min-h-screen px-4 md:px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header de lección */}
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">{currentLesson.title}</h1>
            <p className="text-white/80">{currentLesson.description}</p>
          </div>

          {/* Objetivos */}
          <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Objetivos</CardTitle>
              <CardDescription className="text-white/80">Qué aprenderás en esta lección</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                {content.goals.map((g, i) => (
                  <li key={i} className="text-white/90">{g}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Video con subtítulos (si existe) */}
          <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Demostración</CardTitle>
              <CardDescription className="text-white/80">Observa el gesto y repítelo</CardDescription>
            </CardHeader>
            <CardContent>
              {!videoError ? (
                <video
                  src={content.videoSrc}
                  className="w-full rounded-lg border border-white/10"
                  controls
                  autoPlay={false}
                  onError={() => setVideoError(true)}
                >
                  <track kind="subtitles" srcLang="es" src={content.subtitleSrc} label="Español" default />
                </video>
              ) : (
                <div className="text-white/80">No se encontró el video. Próximamente añadiremos material visual para esta lección.</div>
              )}
            </CardContent>
          </Card>

          {/* Pasos guiados (fallback didáctico) */}
          <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Pasos guiados</CardTitle>
              <CardDescription className="text-white/80">Sigue estas instrucciones si no tienes video</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-5 space-y-2">
                {content.steps.map((s, i) => (
                  <li key={i} className="text-white/90">{s}</li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Ejemplos */}
          <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Ejemplos</CardTitle>
              <CardDescription className="text-white/80">Frases y consejos rápidos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {content.examples.map((ex, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/10 border border-white/10">
                    <div className="font-semibold text-white">{ex.phrase}</div>
                    <div className="text-sm text-white/80">{ex.tip}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quiz */}
          <Card className="bg-gray-900/60 backdrop-blur-md border border-white/10 text-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-white">Quiz rápido</CardTitle>
              <CardDescription className="text-white/80">Pon a prueba lo que acabas de aprender</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.quiz.map((q, qi) => (
                <div key={qi} className="space-y-2">
                  <div className="font-medium">{qi + 1}. {q.q}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {q.options.map((opt, oi) => (
                      <label key={oi} className={`cursor-pointer p-3 rounded-lg border ${answers[qi] === oi ? 'bg-blue-600 text-white border-blue-500' : 'bg-white/10 text-white/90 border-white/15'}`}>
                        <input
                          type="radio"
                          name={`q-${qi}`}
                          className="mr-2 accent-blue-500"
                          checked={answers[qi] === oi}
                          onChange={() => setAnswers(prev => { const c = [...prev]; c[qi] = oi; return c })}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex items-center gap-3">
                <Button onClick={submitQuiz} className="bg-blue-600 hover:bg-blue-700">Calificar</Button>
                {score !== null && (
                  <div className="text-white/90">Puntaje: {score} / {content.quiz.length}</div>
                )}
                <Button asChild variant="secondary" className="ml-auto bg-white/90 hover:bg-white text-gray-900">
                  <Link to={`/practice?sign=${encodeURIComponent(currentLesson.title)}`}>Ir a practicar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
