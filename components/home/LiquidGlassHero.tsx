'use client'

// Fond 3D "liquid glass" du hero — blobs en verre translucide (réfraction,
// aberration chromatique) qui flottent et se déforment lentement derrière le
// texte. Chargé uniquement côté client (voir l'import dynamic dans
// HomeClient) : aucune dépendance three.js ne doit toucher le rendu serveur.
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Float, MeshTransmissionMaterial } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// Position du pointeur en coordonnées normalisées (-1..1), lue dans la boucle
// de rendu pour un léger effet de parallaxe. Module-scope : un seul hero à la
// fois sur la page, pas besoin de contexte React pour ça.
const pointer = { x: 0, y: 0 }

function usePointerParallax() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
}

type BlobProps = {
  position: [number, number, number]
  scale: number
  speed: number
  distortion: number
  color: string
  reduced: boolean
}

function GlassBlob({ position, scale, speed, distortion, color, reduced }: BlobProps) {
  const ref = useRef<THREE.Mesh>(null)
  const amp = reduced ? 0 : 1

  useFrame((state) => {
    const mesh = ref.current
    if (!mesh) return
    const t = state.clock.getElapsedTime()
    mesh.rotation.x = t * speed * 0.08 * amp
    mesh.rotation.y = t * speed * 0.12 * amp
    mesh.position.y = position[1] + Math.sin(t * speed * 0.6) * 0.28 * amp
    mesh.position.x = position[0] + pointer.x * 0.22 * amp
    mesh.position.z = position[2] + pointer.y * 0.12 * amp
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 10]} />
      <MeshTransmissionMaterial
        samples={4}
        resolution={256}
        thickness={1.3}
        roughness={0.05}
        chromaticAberration={0.45}
        anisotropy={0.2}
        distortion={distortion}
        distortionScale={0.4}
        temporalDistortion={reduced ? 0 : 0.2}
        ior={1.25}
        transmission={1}
        clearcoat={1}
        clearcoatRoughness={0.08}
        attenuationDistance={0.6}
        attenuationColor={color}
        color={color}
      />
    </mesh>
  )
}

function Scene({ reduced, compact }: { reduced: boolean; compact: boolean }) {
  usePointerParallax()
  const blobs: BlobProps[] = [
    { position: [-2.5, 0.5, -1], scale: 1.7, speed: 0.8, distortion: 0.3, color: '#dff2ff', reduced },
    { position: [2.6, -0.7, -1.6], scale: 1.3, speed: 1.05, distortion: 0.45, color: '#ffe8d6', reduced },
    ...(compact ? [] : [{ position: [0.3, 1.7, -2.2] as [number, number, number], scale: 0.85, speed: 1.3, distortion: 0.55, color: '#e9ddff', reduced }]),
  ]

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={1.1} />
      {/* <Environment preset="city" /> */}
      {blobs.map((b, i) => (
        <Float key={i} speed={reduced ? 0 : b.speed} rotationIntensity={reduced ? 0 : 0.25} floatIntensity={reduced ? 0 : 0.5}>
          <GlassBlob {...b} />
        </Float>
      ))}
    </>
  )
}

export default function LiquidGlassHero() {
  const [ready, setReady] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [compact, setCompact] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    setCompact(window.innerWidth < 640)
    setReady(true)
  }, [])

  if (!ready) return null

  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ width: '100%', height: '100%' }}
      >
        <Suspense fallback={null}>
          <Scene reduced={reduced} compact={compact} />
        </Suspense>
      </Canvas>
    </div>
  )
}
