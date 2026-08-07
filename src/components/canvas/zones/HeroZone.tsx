'use client'
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Float } from '@react-three/drei'
import * as THREE from 'three'

function HelixCloud() {
  const ref = useRef<THREE.Points>(null)
  const { positions, colors } = useMemo(() => {
    const n = 1800
    const positions = new Float32Array(n * 3)
    const colors = new Float32Array(n * 3)
    const ca = new THREE.Color('#5B8FFF'), cb = new THREE.Color('#E4BE7B')
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 14
      const s = i % 2
      const r = 3.2 + Math.sin(t * 0.3) * 0.5
      const noise = (Math.random() - 0.5) * 0.22
      positions[i * 3]     = Math.cos(t + s * Math.PI) * r + noise
      positions[i * 3 + 1] = (i / n) * 20 - 10 + noise
      positions[i * 3 + 2] = Math.sin(t + s * Math.PI) * r + noise
      const c = new THREE.Color().lerpColors(ca, cb, i / n)
      colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b
    }
    return { positions, colors }
  }, [])
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.055 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.06} vertexColors transparent opacity={0.75} sizeAttenuation />
    </points>
  )
}

function WireShell({ radius, speed, color }: { radius: number; speed: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * speed
    ref.current.rotation.x = clock.getElapsedTime() * speed * 0.4
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial color={color} wireframe transparent opacity={0.18} />
    </mesh>
  )
}

function Ring({ radius, tilt, color, speed }: { radius: number; tilt: number; color: string; speed: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => { if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * speed })
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.022, 8, 180]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} transparent opacity={0.55} />
    </mesh>
  )
}

function GlassCore() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.08
    ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.15) * 0.18
  })
  return (
    <Float speed={0.6} floatIntensity={0.4}>
      <mesh ref={ref}>
        <icosahedronGeometry args={[1.3, 2]} />
        <MeshTransmissionMaterial
          backside samples={6} resolution={512}
          transmission={0.97} roughness={0.02} thickness={0.6}
          ior={1.5} chromaticAberration={0.05}
          color="#7AAAFF" distortionScale={0.14} temporalDistortion={0.07}
        />
      </mesh>
    </Float>
  )
}

export default function HeroZone({ z = 0 }: { z?: number }) {
  return (
    <group position={[0, 0, z]}>
      <pointLight position={[0, 0, 8]} intensity={1.5} color="#5B8FFF" distance={25} />
      <pointLight position={[6, -5, 3]} intensity={0.6} color="#E4BE7B" distance={16} />
      <HelixCloud />
      <WireShell radius={5.0} speed={0.025} color="#5B8FFF" />
      <WireShell radius={7.0} speed={-0.018} color="#8AAFFF" />
      <WireShell radius={9.0} speed={0.012} color="#E4BE7B" />
      <Ring radius={3.8} tilt={Math.PI / 3} color="#5B8FFF" speed={0.04} />
      <Ring radius={6.0} tilt={-Math.PI / 5} color="#E4BE7B" speed={-0.028} />
      <Ring radius={8.2} tilt={Math.PI / 8} color="#8AAFFF" speed={0.02} />
      <GlassCore />
    </group>
  )
}
