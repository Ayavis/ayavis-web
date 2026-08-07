'use client'
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const STAGES: Array<{ x: number; z: number; color: string; label: string }> = [
  { x: -8, z:  1.5, color: '#60A5FA', label: 'Build'   },
  { x: -4, z: -0.5, color: '#34D399', label: 'Test'    },
  { x:  0, z:  1.0, color: '#FBBF24', label: 'Scan'    },
  { x:  4, z: -0.5, color: '#A78BFA', label: 'Deploy'  },
  { x:  8, z:  1.5, color: '#22D3EE', label: 'Monitor' },
]

const CHAMBER_R = 1.6
const CHAMBER_H = 3.5

function StageChamber({ x, z, color, idx }: { x: number; z: number; color: string; idx: number }) {
  const bodyRef = useRef<THREE.Mesh>(null)
  const topRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.PointLight>(null)
  const phase = (idx / STAGES.length) * Math.PI * 2

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (bodyRef.current) {
      ;(bodyRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.2 + Math.abs(Math.sin(t * 0.7 + phase)) * 0.4
    }
    if (topRef.current) {
      topRef.current.rotation.y = t * 1.2 + phase
      ;(topRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.6 + Math.abs(Math.sin(t * 1.0 + phase)) * 0.5
    }
    if (glowRef.current) {
      glowRef.current.intensity = 3 + Math.abs(Math.sin(t * 0.7 + phase)) * 3
    }
  })

  return (
    <group position={[x, 0, z]}>
      {/* Main chamber cylinder */}
      <mesh ref={bodyRef}>
        <cylinderGeometry args={[CHAMBER_R, CHAMBER_R * 1.1, CHAMBER_H, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} roughness={0.2} metalness={0.75} transparent opacity={0.9} />
      </mesh>
      {/* Equatorial band */}
      <mesh>
        <torusGeometry args={[CHAMBER_R + 0.1, 0.12, 8, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} roughness={0.1} metalness={0.8} />
      </mesh>
      {/* Spinning top disc */}
      <mesh ref={topRef} position={[0, CHAMBER_H / 2 + 0.1, 0]}>
        <cylinderGeometry args={[CHAMBER_R * 0.7, CHAMBER_R * 0.7, 0.1, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Vertical status strip */}
      <mesh position={[CHAMBER_R + 0.05, 0, 0]}>
        <boxGeometry args={[0.08, CHAMBER_H - 0.3, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9} />
      </mesh>
      <pointLight ref={glowRef} position={[0, CHAMBER_H / 2 + 1.5, 0]} intensity={3} color={color} distance={10} />
    </group>
  )
}

function PipelineTube({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const pts = useMemo(() => {
    const f = new THREE.Vector3(...from)
    const t2 = new THREE.Vector3(...to)
    return [f, f.clone().lerp(t2, 0.5), t2]
  }, [from, to])
  return (
    <Line points={pts} color={color} lineWidth={2.5} transparent opacity={0.5} />
  )
}

function PipelineParticles() {
  const COUNT = 200
  const ref = useRef<THREE.Points>(null)
  const progressRef = useRef(new Float32Array(COUNT).map((_, i) => i / COUNT))

  const curve = useMemo(() => {
    const pts: THREE.Vector3[] = []
    STAGES.forEach((s) => pts.push(new THREE.Vector3(s.x, 0, s.z)))
    return new THREE.CatmullRomCurve3(pts)
  }, [])

  const initPos = useMemo(() => new Float32Array(COUNT * 3), [])
  const colors = useMemo(() => {
    const c = new Float32Array(COUNT * 3)
    const stageColors = STAGES.map((s) => new THREE.Color(s.color))
    for (let i = 0; i < COUNT; i++) {
      const t = i / COUNT
      const si = Math.min(Math.floor(t * STAGES.length), STAGES.length - 1)
      c[i * 3]     = stageColors[si].r
      c[i * 3 + 1] = stageColors[si].g
      c[i * 3 + 2] = stageColors[si].b
    }
    return c
  }, [])

  useFrame(() => {
    if (!ref.current) return
    const p = ref.current.geometry.attributes.position as THREE.BufferAttribute
    const speed = 0.0015
    for (let i = 0; i < COUNT; i++) {
      progressRef.current[i] = (progressRef.current[i] + speed) % 1
      const pt = curve.getPoint(progressRef.current[i])
      p.setXYZ(i, pt.x, pt.y, pt.z)
    }
    p.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[initPos, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.14} transparent opacity={0.85} sizeAttenuation vertexColors />
    </points>
  )
}

function OverheadFramework() {
  return (
    <group position={[0, CHAMBER_H / 2 + 1.8, 0]}>
      {/* Main horizontal beam */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 22, 8]} />
        <meshStandardMaterial color="#1e293b" roughness={0.5} metalness={0.8} />
      </mesh>
      {/* Vertical drops to each stage */}
      {STAGES.map((s, i) => (
        <mesh key={i} position={[s.x, -0.9, s.z * 0.3]}>
          <cylinderGeometry args={[0.06, 0.06, 1.8, 6]} />
          <meshStandardMaterial color="#22337a" roughness={0.4} metalness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function SweepLight({ offset }: { offset: number }) {
  const ref = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() + offset
    ref.current.position.x = Math.sin(t * 0.25) * 10
    ref.current.intensity = 6 + Math.sin(t * 0.5) * 2
  })
  return <pointLight ref={ref} position={[0, 6, 0]} intensity={6} color="#60A5FA" distance={22} />
}

export default function EngineeringZone({ z = 0 }: { z?: number }) {
  return (
    <group position={[0, 0, z]}>
      <ambientLight intensity={0.25} color="#051025" />
      <pointLight position={[0, 8, 0]} intensity={4} color="#38BDF8" distance={35} />
      <SweepLight offset={0} />
      <SweepLight offset={3.14} />

      {STAGES.map((s, i) => (
        <StageChamber key={i} x={s.x} z={s.z} color={s.color} idx={i} />
      ))}

      {STAGES.slice(0, 4).map((s, i) => (
        <PipelineTube
          key={i}
          from={[s.x + CHAMBER_R, 0, s.z]}
          to={[STAGES[i + 1].x - CHAMBER_R, 0, STAGES[i + 1].z]}
          color={s.color}
        />
      ))}

      <PipelineParticles />
      <OverheadFramework />

      {/* Floor plane */}
      <mesh position={[0, -CHAMBER_H / 2 - 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[36, 14]} />
        <meshStandardMaterial color="#040d1a" roughness={0.95} transparent opacity={0.9} />
      </mesh>
    </group>
  )
}
