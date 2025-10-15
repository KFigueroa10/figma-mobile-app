import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, useGLTF, Bounds } from '@react-three/drei'
import { useMemo, useState, useEffect, Suspense } from 'react'

const tipsDefault = [
  'Practica 5 minutos al día',
  'Repasa tus señas recientes',
  'Ve a /learn para más lecciones',
  'Prueba /practice?sign=hola',
]

function TipsBubble({ tips = tipsDefault }: { tips?: string[] }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % tips.length), 4000)
    return () => clearInterval(t)
  }, [tips])
  const text = useMemo(() => tips[i] ?? '', [i, tips])
  return (
    <div className="absolute top-3 left-3 z-50 max-w-[260px] p-3 rounded-2xl bg-white text-gray-800 text-base shadow-2xl border border-gray-200">
      {text}
    </div>
  )
}

function MascotPrimitive() {
  // Placeholder simple: un icosaedro con material con algo de brillo
  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={1.2}>
      <group position={[0, -0.25, 0]}>
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#3b82f6" roughness={0.2} metalness={0.4} />
        </mesh>
      </group>
    </Float>
  )
}

function Model({ url }: { url: string }) {
  // useGLTF requiere Suspense
  const { scene } = useGLTF(url)
  return (
    <Float speed={1.1} rotationIntensity={0.4} floatIntensity={1.0}>
      <group position={[0, -0.35, 0]}>
        <primitive object={scene} scale={1} />
      </group>
    </Float>
  )
}

export default function Mascot3D({ modelUrl }: { modelUrl?: string }) {
  return (
    <div className="relative w-full h-full">
      <TipsBubble />
      <Canvas
        className="relative z-0 pointer-events-none"
        camera={{ position: [0, 1.2, 3], fov: 40 }}
        shadows
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={0.8} castShadow />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.5}>
            {modelUrl ? <Model url={modelUrl} /> : <MascotPrimitive />}
          </Bounds>
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate
          autoRotateSpeed={0.5}
          minAzimuthAngle={-0.5}
          maxAzimuthAngle={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  )
}
