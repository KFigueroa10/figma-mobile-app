import { useState, useEffect, useRef } from 'react'

export default function VozASena() {
  const [text, setText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [signImages, setSignImages] = useState<string[]>([])
  const [recognition, setRecognition] = useState<any>(null)
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const accumulatedTextRef = useRef('')

  useEffect(() => {
    // Inicializar reconocimiento de voz si está disponible
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      const rec = new SpeechRecognition()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'es-ES' // Español

      rec.onresult = (event: any) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        if (finalTranscript) {
          accumulatedTextRef.current += finalTranscript
          setText(accumulatedTextRef.current)
          convertToSign(accumulatedTextRef.current)
          resetSilenceTimeout()
        }
      }

      rec.onend = () => {
        setIsRecording(false)
        accumulatedTextRef.current = ''
      }

      rec.onerror = (event: any) => {
        console.error('Error en reconocimiento de voz:', event.error)
        setIsRecording(false)
      }

      setRecognition(rec)
    }
  }, [])

  const resetSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
    }
    silenceTimeoutRef.current = setTimeout(() => {
      if (isRecording && recognition) {
        recognition.stop()
      }
    }, 3000) // 3 segundos de silencio
  }

  const convertToSign = (inputText: string) => {
    const letters = inputText.toLowerCase().replace(/[^a-z\s]/g, '').split('')
    const images = letters.map(letter => {
      if (letter === ' ') {
        return 'space' // Representar espacio como string especial
      }
      return letter ? `src/img/img_señas/${letter}.png` : null
    }).filter(item => item !== null) as string[]
    setSignImages(images)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    setText(newText)
    convertToSign(newText)
  }

  const startRecording = () => {
    if (recognition) {
      accumulatedTextRef.current = ''
      setIsRecording(true)
      recognition.start()
      resetSilenceTimeout()
    } else {
      alert('El reconocimiento de voz no está disponible en este navegador.')
    }
  }

  const stopRecording = () => {
    if (recognition) {
      recognition.stop()
    }
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current)
    }
  }

  return (
    <div className="px-4 md:px-6 py-8 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-lg">Voz a Seña</h1>
        <p className="text-white/80">Convierte tu voz o texto en lenguaje de señas</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Escribe el texto o graba tu voz..."
          className="w-full max-w-md p-4 rounded-lg bg-gray-900/60 backdrop-blur-md border border-white/10 text-white placeholder-white/50 focus:outline-none focus:border-orange-400"
          rows={4}
        />

        <div className="flex gap-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-lg font-semibold transition ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'} text-white`}
          >
            {isRecording ? 'Detener Grabación' : 'Grabar Voz'}
          </button>
        </div>

        {signImages.length > 0 && (
          <div className="w-full max-w-4xl bg-gray-900/60 backdrop-blur-md border border-white/10 rounded-lg p-4">
            <h3 className="text-white text-center mb-4">Señas Generadas:</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {signImages.map((image, index) => (
                image === 'space' ? (
                  <div
                    key={index}
                    className="w-20 h-20 bg-white/20 border border-white/10 rounded p-1 flex items-center justify-center"
                    title="Espacio"
                  >
                    <span className="text-white/60 text-xs">ESP</span>
                  </div>
                ) : (
                  <img
                    key={index}
                    src={image}
                    alt={`Seña ${index + 1}`}
                    className="w-20 h-20 object-contain bg-white/10 rounded p-1"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
