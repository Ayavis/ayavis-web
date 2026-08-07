'use client'
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const COLS = 10
const ROWS = 7
const HEX_R = 1.0

type HexCell = { x: number; y: number; col: string; baseOpacity: number }

function HexWall() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>([])
  const stateRef = useRef<number[]>([])

  const hexes: HexCell[] = useMemo(() => {
    const cells: HexCell[] = []
    const offsetX = ((COLS - 1) * 1.9 * HEX_R) / 2
    const offsetY = ((ROWS - 1) * 1.65 * HEX_R) / 2
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const x = col * 1.9 * HEX_R - offsetX
        const y = row * 1.65 * HEX_R + (col % 2) * 0.825 * HEX_R - offsetY
        const rnd = Math.random()
        cells.push({
          x, y,
          col: rnd > 0.92 ? '#FF4444' : rnd > 0.7 ? '#FB923C' : '#FB923C',
          baseOpacity: rnd > 0.92 ? 0.7 : rnd > 0.7 ? 0.45 : 0.08,
        })
      }
    }
    stateRef.current = cells.map((c) => c.baseOpacity)
    return cells
  }, [])

  const lastFlip = useRef(0)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Every 1.5s flip a random cell's activity
    if (t - lastFlip.current > 0.4) {
      lastFlip.current = t
      const idx = Math.floor(Math.random() * hexes.length)
      const mesh = meshRefs.current[idx]
      if (mesh) {
        const mat = mesh.material as THREE.MeshStandardMaterial
        const rnd = Math.random()
        if (rnd > 0.92) {
          mat.color.set('#FF4444'); mat.emissive.set('#FF4444'); mat.opacity = 0.7; mat.emissiveIntensity = 1.2
        } else if (rnd > 0.7) {
          mat.color.set('#FB923C'); mat.emissive.set('#FB923C'); mat.opacity = 0.5; mat.emissiveIntensity = 0.6
        } else {
          mat.color.set('#FB923C'); mat.emissive.set('#FB923C'); mat.opacity = 0.08; mat.emissiveIntensity = 0.1
        }
      }
    }
    // Flicker alert cells
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const mat = mesh.material as THREE.MeshStandardMaterial
      if (mat.opacity > 0.6) {
        mat.emissiveIntensity = 0.8 + Math.abs(Math.sin(t * 4.0 + i)) * 0.8
      }
    })
  })

  return (
    <group position={[0, 0, -2]}>
      {hexes.map((h, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el }}
          position={[h.x, h.y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[HEX_R * 0.88, HEX_R * 0.88, 0.12, 6]} />
          <meshStandardMaterial
            color={h.col}
            emissive={h.col}
            emissiveIntensity={h.baseOpacity > 0.3 ? 0.5 : 0.1}
            transparent
            opacity={h.baseOpacity}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

function ScanBeam() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    const ping = Math.sin(t * 0.78) // -1 to 1
    ref.current.position.x = ping * 9.5
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.18 + Math.abs(ping) * 0.08
  })
  return (
    <mesh ref={ref} position={[0, 0, -1.8]}>
      <boxGeometry args={[0.5, 12, 0.3]} />
      <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={1.2} transparent opacity={0.2} />
    </mesh>
  )
}

function ShieldRing({ radius, tilt, speed, opacity }: { radius: number; tilt: number; speed: number; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.z = clock.getElapsedTime() * speed
    ref.current.rotation.y = clock.getElapsedTime() * speed * 0.15
  })
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.05, 8, 120]} />
      <meshStandardMaterial color="#FB923C" emissive="#FB923C" emissiveIntensity={0.3} transparent opacity={opacity} />
    </mesh>
  )
}

function IdentityNetwork() {
  const SPHERE_COUNT = 20
  const positions: [number, number, number][] = useMemo(() =>
    Array.from({ length: SPHERE_COUNT }, (_, i) => {
      const a = (i / SPHERE_COUNT) * Math.PI * 2
      const r = 10 + Math.random() * 4
      return [Math.cos(a) * r, (Math.random() - 0.5) * 8, Math.sin(a) * 3] as [number, number, number]
    }), [])
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([])
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    nodeRefs.current.forEach((m, i) => {
      if (!m) return
      ;(m.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3 + Math.abs(Math.sin(t * 0.8 + i * 0.4)) * 0.5
    })
  })
  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={i} ref={(el) => { nodeRefs.current[i] = el }} position={pos}>
          <sphereGeometry args={[0.22, 12, 12]} />
          <meshStandardMaterial color="#FB923C" emissive="#FB923C" emissiveIntensity={0.4} transparent opacity={0.85} roughness={0.15} metalness={0.5} />
        </mesh>
      ))}
      {positions.slice(0, 15).map((pos, i) => {
        const next = positions[(i + 1) % positions.length]
        return (
          <Line
            key={i}
            points={[new THREE.Vector3(...pos), new THREE.Vector3(...next)]}
            color="#FB923C"
            lineWidth={0.4}
            transparent
            opacity={0.12}
          />
        )
      })}
    </group>
  )
}

export default function SecurityZone({ z = 0 }: { z?: number }) {
  return (
    <group position={[0, 0, z]}>
      <ambientLight intensity={0.2} color="#1a0a05" />
      <pointLight position={[0, 0, 5]} intensity={4} color="#FB923C" distance={28} />
      <pointLight position={[-8, 4, 3]} intensity={1.5} color="#FF4444" distance={20} />
      <pointLight position={[8, -4, 3]} intensity={1.0} color="#34D399" distance={16} />
      <HexWall />
      <ScanBeam />
      <ShieldRing radius={9} tilt={0.2} speed={0.012} opacity={0.06} />
      <ShieldRing radius={12} tilt={-0.15} speed={-0.008} opacity={0.04} />
      <ShieldRing radius={16} tilt={0.08} speed={0.006} opacity={0.025} />
      <IdentityNetwork />
    </group>
  )
}
