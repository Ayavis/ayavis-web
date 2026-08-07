'use client'
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const RACK_HEIGHTS = [6.2, 7.4, 6.8, 8.1, 7.0, 6.5, 7.8, 6.3, 7.2, 8.0, 6.7, 7.5]
const NUM_RACKS = 12

function ServerRack({ x, rowZ, heightIndex, phase }: { x: number; rowZ: number; heightIndex: number; phase: number }) {
  const bodyRef = useRef<THREE.Mesh>(null)
  const ledRef = useRef<THREE.Mesh>(null)
  const h = RACK_HEIGHTS[heightIndex]

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (ledRef.current) {
      ;(ledRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.7 + Math.abs(Math.sin(t * 0.5 + phase)) * 0.5
    }
  })

  const faceZ = rowZ > 0 ? rowZ - 0.9 : rowZ + 0.9

  return (
    <group position={[x, h / 2 - 3, rowZ]}>
      {/* Main rack body */}
      <mesh ref={bodyRef}>
        <boxGeometry args={[1.2, h, 1.8]} />
        <meshStandardMaterial color="#0d1117" roughness={0.6} metalness={0.8} />
      </mesh>
      {/* LED strip on face */}
      <mesh ref={ledRef} position={[0, 0, faceZ - rowZ]}>
        <boxGeometry args={[0.15, h - 0.4, 0.05]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.8} roughness={0.1} />
      </mesh>
      {/* LED indicator rows */}
      {[0.3, 0, -0.3].map((dy, ri) => (
        <group key={ri} position={[0.3, dy, faceZ - rowZ + 0.02]}>
          {[0, 0.12, 0.24].map((dx, ci) => (
            <mesh key={ci} position={[dx, 0, 0]}>
              <boxGeometry args={[0.06, 0.04, 0.03]} />
              <meshStandardMaterial
                color={ci === 0 ? '#22D3EE' : ci === 1 ? '#34D399' : '#60A5FA'}
                emissive={ci === 0 ? '#22D3EE' : ci === 1 ? '#34D399' : '#60A5FA'}
                emissiveIntensity={0.9}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

function CracUnit({ x, rowZ }: { x: number; rowZ: number }) {
  const fanRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (fanRef.current) fanRef.current.rotation.z = clock.getElapsedTime() * 3
  })
  const faceZ = rowZ > 0 ? rowZ - 0.92 : rowZ + 0.92
  return (
    <group position={[x, 0.5, rowZ]}>
      <mesh>
        <boxGeometry args={[2.5, 7, 2.0]} />
        <meshStandardMaterial color="#0a0e1a" roughness={0.5} metalness={0.9} />
      </mesh>
      {/* Fan disc */}
      <mesh ref={fanRef} position={[0, 1.5, faceZ - rowZ]}>
        <cylinderGeometry args={[0.8, 0.8, 0.08, 8]} />
        <meshStandardMaterial color="#1a2744" emissive="#22D3EE" emissiveIntensity={0.3} metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.5, faceZ - rowZ]}>
        <cylinderGeometry args={[0.6, 0.6, 0.06, 8]} />
        <meshStandardMaterial color="#1a2744" emissive="#22D3EE" emissiveIntensity={0.25} metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

function CableTray({ rowZ }: { rowZ: number }) {
  const totalWidth = (NUM_RACKS - 1) * 2.0 + 1.2
  return (
    <mesh position={[0, 5.5, rowZ]}>
      <boxGeometry args={[totalWidth + 5, 0.18, 0.35]} />
      <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.6} />
    </mesh>
  )
}

function MovingAisleLight({ offset }: { offset: number }) {
  const ref = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() + offset
    ref.current.position.x = Math.sin(t * 0.18) * 11
    ref.current.position.z = 0
    ref.current.intensity = 6 + Math.sin(t * 0.4) * 2
  })
  return <pointLight ref={ref} position={[0, 4, 0]} intensity={6} color="#22D3EE" distance={18} />
}

function DustParticles() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const p = new Float32Array(800 * 3)
    for (let i = 0; i < 800; i++) {
      p[i * 3]     = (Math.random() - 0.5) * 30
      p[i * 3 + 1] = (Math.random() - 0.5) * 12
      p[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    return p
  }, [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.004
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#22D3EE" transparent opacity={0.35} sizeAttenuation />
    </points>
  )
}

function FloorGrid() {
  const lines: Array<[THREE.Vector3, THREE.Vector3]> = useMemo(() => {
    const l: Array<[THREE.Vector3, THREE.Vector3]> = []
    for (let i = -10; i <= 10; i++) {
      l.push([new THREE.Vector3(i * 1.5, -3, -8), new THREE.Vector3(i * 1.5, -3, 8)])
    }
    for (let j = -5; j <= 5; j++) {
      l.push([new THREE.Vector3(-15, -3, j * 1.6), new THREE.Vector3(15, -3, j * 1.6)])
    }
    return l
  }, [])
  return (
    <>
      {lines.map(([a, b], i) => (
        <Line key={i} points={[a, b]} color="#22D3EE" lineWidth={0.3} transparent opacity={0.05} />
      ))}
    </>
  )
}

export default function CloudZone({ z = 0 }: { z?: number }) {
  const racks = useMemo(() =>
    Array.from({ length: NUM_RACKS }, (_, i) => ({
      x: (i - (NUM_RACKS - 1) / 2) * 2.0,
      heightIndex: i,
      phase: (i / NUM_RACKS) * Math.PI * 2,
    })), [])

  return (
    <group position={[0, 0, z]}>
      <ambientLight intensity={0.3} color="#0A1540" />
      <pointLight position={[0, 8, 0]} intensity={5} color="#22D3EE" distance={40} />
      <pointLight position={[-12, 2, 0]} intensity={3} color="#0EA5E9" distance={25} />
      <pointLight position={[12, 2, 0]} intensity={3} color="#38BDF8" distance={25} />
      <MovingAisleLight offset={0} />
      <MovingAisleLight offset={2.5} />
      <MovingAisleLight offset={5.0} />

      {/* Row A (front) */}
      {racks.map((r, i) => (
        <ServerRack key={`a-${i}`} x={r.x} rowZ={4} heightIndex={r.heightIndex} phase={r.phase} />
      ))}
      <CracUnit x={-13} rowZ={4} />
      <CracUnit x={13} rowZ={4} />
      <CableTray rowZ={4} />

      {/* Row B (back) */}
      {racks.map((r, i) => (
        <ServerRack key={`b-${i}`} x={r.x} rowZ={-4} heightIndex={(i + 6) % NUM_RACKS} phase={r.phase + 1.5} />
      ))}
      <CracUnit x={-13} rowZ={-4} />
      <CracUnit x={13} rowZ={-4} />
      <CableTray rowZ={-4} />

      <FloorGrid />
      <DustParticles />
    </group>
  )
}
