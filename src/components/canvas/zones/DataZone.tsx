'use client'
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const TOWER_CONFIGS: Array<{ pos: [number, number, number]; h: number; r: number; color: string }> = [
  { pos: [-8, 0, 0],  h: 5.5, r: 1.4, color: '#A78BFA' },
  { pos: [-4, 0, -2], h: 7.0, r: 1.4, color: '#818CF8' },
  { pos: [0, 0, -3],  h: 8.5, r: 1.6, color: '#C084FC' },
  { pos: [4, 0, -2],  h: 7.0, r: 1.4, color: '#818CF8' },
  { pos: [8, 0, 0],   h: 5.5, r: 1.4, color: '#A78BFA' },
]

function DatabaseTower({ pos, h, r, color, idx }: { pos: [number, number, number]; h: number; r: number; color: string; idx: number }) {
  const bodyRef = useRef<THREE.Mesh>(null)
  const capRingRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const phase = (idx / TOWER_CONFIGS.length) * Math.PI * 2

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (bodyRef.current) {
      ;(bodyRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.25 + Math.abs(Math.sin(t * 0.4 + phase)) * 0.25
    }
    if (capRingRef.current) {
      ;(capRingRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.8 + Math.abs(Math.sin(t * 0.6 + phase)) * 0.5
      capRingRef.current.rotation.y = t * 0.5 + phase
    }
    if (glowRef.current) {
      glowRef.current.intensity = 2.0 + Math.abs(Math.sin(t * 0.4 + phase)) * 1.5
    }
  })

  const baseY = pos[1] - h / 2 + h / 2

  return (
    <group position={[pos[0], baseY, pos[2]]}>
      {/* Main cylinder body */}
      <mesh ref={bodyRef}>
        <cylinderGeometry args={[r, r * 1.05, h, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} roughness={0.15} metalness={0.7} />
      </mesh>
      {/* Segmentation rings */}
      {[0.2, 0, -0.2].map((dy, i) => (
        <mesh key={i} position={[0, dy + h * 0.1, 0]}>
          <torusGeometry args={[r + 0.08, 0.05, 8, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* Flat top cap */}
      <mesh position={[0, h / 2, 0]}>
        <cylinderGeometry args={[r + 0.1, r + 0.1, 0.12, 24]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.2} metalness={0.9} />
      </mesh>
      {/* Glowing top ring */}
      <mesh ref={capRingRef} position={[0, h / 2 + 0.1, 0]}>
        <torusGeometry args={[r * 0.85, 0.08, 8, 40]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.9} />
      </mesh>
      <pointLight ref={glowRef} position={[0, h / 2 + 1, 0]} intensity={2.0} color={color} distance={8} />
    </group>
  )
}

function DataStream({ from, to }: { from: [number, number, number]; to: [number, number, number] }) {
  const pts = useMemo(() => {
    const f = new THREE.Vector3(...from)
    const t = new THREE.Vector3(...to)
    const mid = f.clone().lerp(t, 0.5)
    mid.y -= 1.5
    const curve = new THREE.CatmullRomCurve3([f, mid, t])
    return curve.getPoints(30)
  }, [from, to])

  return <Line points={pts} color="#A78BFA" lineWidth={0.8} transparent opacity={0.3} />
}

function StreamParticles({ from, to, color, speed }: { from: [number, number, number]; to: [number, number, number]; color: string; speed: number }) {
  const COUNT = 15
  const ref = useRef<THREE.Points>(null)
  const progressRef = useRef<Float32Array>(new Float32Array(COUNT).map((_, i) => i / COUNT))

  const curve = useMemo(() => {
    const f = new THREE.Vector3(...from)
    const t = new THREE.Vector3(...to)
    const mid = f.clone().lerp(t, 0.5)
    mid.y -= 1.5
    return new THREE.CatmullRomCurve3([f, mid, t])
  }, [from, to])

  const initPos = useMemo(() => new Float32Array(COUNT * 3), [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const p = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const dt = 0.003 * speed
    for (let i = 0; i < COUNT; i++) {
      progressRef.current[i] = (progressRef.current[i] + dt) % 1
      const pt = curve.getPoint(progressRef.current[i])
      p.setXYZ(i, pt.x, pt.y, pt.z)
    }
    p.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initPos, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.12} color={color} transparent opacity={0.8} sizeAttenuation />
    </points>
  )
}

function CentralSphere() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.y = clock.getElapsedTime() * 0.2
    ref.current.rotation.x = clock.getElapsedTime() * 0.08
    ;(ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.3 + Math.abs(Math.sin(clock.getElapsedTime() * 0.5)) * 0.3
  })
  return (
    <mesh ref={ref} position={[0, 5, -2]}>
      <sphereGeometry args={[2.2, 16, 16]} />
      <meshStandardMaterial color="#C084FC" emissive="#C084FC" emissiveIntensity={0.3} wireframe transparent opacity={0.35} />
    </mesh>
  )
}

function DataRain() {
  const COUNT = 400
  const ref = useRef<THREE.Points>(null)
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 32
      positions[i * 3 + 1] = (Math.random() - 0.5) * 16 + 4
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16
      speeds[i] = 0.02 + Math.random() * 0.04
    }
    return { positions, speeds }
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const p = ref.current.geometry.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < COUNT; i++) {
      let y = p.getY(i) - speeds[i]
      if (y < -6) y = 12
      p.setY(i, y)
    }
    p.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#A78BFA" transparent opacity={0.25} sizeAttenuation />
    </points>
  )
}

export default function DataZone({ z = 0 }: { z?: number }) {
  const streams: Array<[number, number]> = [[0,1],[1,2],[2,3],[3,4],[0,2],[2,4]]

  return (
    <group position={[0, 0, z]}>
      <ambientLight intensity={0.2} color="#1a0a2e" />
      <pointLight position={[0, 10, 0]} intensity={3} color="#C084FC" distance={40} />
      <pointLight position={[0, 2, 4]} intensity={2} color="#A78BFA" distance={20} />

      {TOWER_CONFIGS.map((cfg, i) => (
        <DatabaseTower key={i} pos={cfg.pos} h={cfg.h} r={cfg.r} color={cfg.color} idx={i} />
      ))}

      {streams.map(([a, b], i) => (
        <React.Fragment key={i}>
          <DataStream
            from={[TOWER_CONFIGS[a].pos[0], TOWER_CONFIGS[a].h * 0.2, TOWER_CONFIGS[a].pos[2]]}
            to={[TOWER_CONFIGS[b].pos[0], TOWER_CONFIGS[b].h * 0.2, TOWER_CONFIGS[b].pos[2]]}
          />
          <StreamParticles
            from={[TOWER_CONFIGS[a].pos[0], TOWER_CONFIGS[a].h * 0.2, TOWER_CONFIGS[a].pos[2]]}
            to={[TOWER_CONFIGS[b].pos[0], TOWER_CONFIGS[b].h * 0.2, TOWER_CONFIGS[b].pos[2]]}
            color={TOWER_CONFIGS[a].color}
            speed={0.8 + i * 0.3}
          />
        </React.Fragment>
      ))}

      <CentralSphere />
      <DataRain />

      {/* Floor */}
      <mesh position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 24]} />
        <meshStandardMaterial color="#0a0520" roughness={0.9} metalness={0.1} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}
