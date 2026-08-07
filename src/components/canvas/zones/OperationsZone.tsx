'use client'
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

const PANEL_COLORS = ['#34D399', '#22D3EE', '#60A5FA', '#A78BFA', '#34D399', '#F59E0B', '#22D3EE', '#34D399', '#60A5FA', '#A78BFA', '#34D399', '#22D3EE', '#F59E0B', '#60A5FA', '#34D399']
const PANEL_COLS = 5
const PANEL_ROWS = 3
const PANEL_W = 1.8
const PANEL_H = 1.5
const PANEL_GAP = 0.2

function ScreenPanel({ col, row, color }: { col: number; row: number; color: string }) {
  const ref = useRef<THREE.Mesh>(null)
  const phase = (col + row * PANEL_COLS) * 0.3

  useFrame(({ clock }) => {
    if (!ref.current) return
    ;(ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
      0.1 + Math.abs(Math.sin(clock.getElapsedTime() * 0.4 + phase)) * 0.2
  })

  const x = (col - (PANEL_COLS - 1) / 2) * (PANEL_W + PANEL_GAP)
  const y = (row - (PANEL_ROWS - 1) / 2) * (PANEL_H + PANEL_GAP) + 1.5

  return (
    <group position={[x, y, -5]}>
      <mesh ref={ref}>
        <boxGeometry args={[PANEL_W, PANEL_H, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.1} roughness={0.2} metalness={0.6} transparent opacity={0.85} />
      </mesh>
      {/* Grid lines on panel face */}
      {[0.3, 0.1, -0.1, -0.3].map((dy, i) => (
        <Line
          key={i}
          points={[new THREE.Vector3(-PANEL_W / 2 + 0.1, dy, 0.04), new THREE.Vector3(PANEL_W / 2 - 0.1, dy, 0.04)]}
          color={color}
          lineWidth={0.5}
          transparent
          opacity={0.3}
        />
      ))}
      {[-0.6, 0, 0.6].map((dx, i) => (
        <Line
          key={i}
          points={[new THREE.Vector3(dx, -PANEL_H / 2 + 0.1, 0.04), new THREE.Vector3(dx, PANEL_H / 2 - 0.1, 0.04)]}
          color={color}
          lineWidth={0.5}
          transparent
          opacity={0.2}
        />
      ))}
    </group>
  )
}

function HeartbeatWave() {
  const ref = useRef<{ obj: THREE.Group | null }>({ obj: null })
  const groupRef = useRef<THREE.Group>(null)

  const basePts = useMemo(() => [
    new THREE.Vector3(-12, -4, 0),
    new THREE.Vector3(-8, -4, 0),
    new THREE.Vector3(-6.5, -4, 0),
    new THREE.Vector3(-6, -4, 0),
    new THREE.Vector3(-5.5, -1.5, 0),
    new THREE.Vector3(-5.0, -6.5, 0),
    new THREE.Vector3(-4.5, -4, 0),
    new THREE.Vector3(-3.8, -4, 0),
    new THREE.Vector3(0, -4, 0),
    new THREE.Vector3(12, -4, 0),
  ], [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.position.x = (clock.getElapsedTime() * 1.2) % 24 - 12
  })

  return (
    <group ref={groupRef}>
      <Line points={basePts} color="#34D399" lineWidth={1.5} transparent opacity={0.5} />
    </group>
  )
}

const ALERT_TOWER_XS = [-10, -6, -2, 2, 6, 10]

function AlertTower({ x, alertIdx, currentAlert }: { x: number; alertIdx: number; currentAlert: number }) {
  const lightRef = useRef<THREE.PointLight>(null)
  const stemRef = useRef<THREE.Mesh>(null)
  const isAlert = alertIdx === currentAlert

  useFrame(({ clock }) => {
    if (!lightRef.current || !stemRef.current) return
    const t = clock.getElapsedTime()
    if (isAlert) {
      const flash = Math.abs(Math.sin(t * 4))
      lightRef.current.intensity = flash * 6
      lightRef.current.color.set('#FF4444')
      ;(stemRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = flash * 0.8
      ;(stemRef.current.material as THREE.MeshStandardMaterial).color.set('#FF4444')
    } else {
      lightRef.current.intensity = 0.5 + Math.abs(Math.sin(t * 0.6 + alertIdx)) * 0.5
      lightRef.current.color.set('#34D399')
      ;(stemRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.3
      ;(stemRef.current.material as THREE.MeshStandardMaterial).color.set('#22D3EE')
    }
  })

  return (
    <group position={[x, 0.5, -3]}>
      <mesh ref={stemRef}>
        <cylinderGeometry args={[0.08, 0.1, 9, 8]} />
        <meshStandardMaterial color="#22D3EE" emissive="#22D3EE" emissiveIntensity={0.3} roughness={0.3} metalness={0.8} />
      </mesh>
      <pointLight ref={lightRef} position={[0, 4.8, 0]} intensity={0.5} color="#34D399" distance={8} />
      {/* Top indicator sphere */}
      <mesh position={[0, 4.8, 0]}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color={isAlert ? '#FF4444' : '#34D399'} emissive={isAlert ? '#FF4444' : '#34D399'} emissiveIntensity={0.7} />
      </mesh>
    </group>
  )
}

function OrbitalRing({ radius, tilt, speed, color, opacity }: { radius: number; tilt: number; speed: number; color: string; opacity: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.rotation.z = clock.getElapsedTime() * speed
    ref.current.rotation.y = clock.getElapsedTime() * speed * 0.18
  })
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.05, 8, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} transparent opacity={opacity} />
    </mesh>
  )
}

function Starfield() {
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const p = new Float32Array(600 * 3)
    for (let i = 0; i < 600; i++) {
      p[i * 3]     = (Math.random() - 0.5) * 40
      p[i * 3 + 1] = (Math.random() - 0.5) * 20
      p[i * 3 + 2] = (Math.random() - 0.5) * 14 - 3
    }
    return p
  }, [])
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.003
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#34D399" transparent opacity={0.3} sizeAttenuation />
    </points>
  )
}

function PatrolLight({ offset, color }: { offset: number; color: string }) {
  const ref = useRef<THREE.PointLight>(null)
  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime() + offset
    ref.current.position.x = Math.sin(t * 0.2) * 11
    ref.current.position.z = Math.cos(t * 0.15) * 5
  })
  return <pointLight ref={ref} position={[0, 3, 0]} intensity={5} color={color} distance={16} />
}

export default function OperationsZone({ z = 0 }: { z?: number }) {
  const currentAlert = useRef(0)
  const lastSwitch = useRef(0)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (t - lastSwitch.current > 3.5) {
      lastSwitch.current = t
      currentAlert.current = (currentAlert.current + 1) % ALERT_TOWER_XS.length
    }
  })

  return (
    <group position={[0, 0, z]}>
      <ambientLight intensity={0.15} color="#041a0e" />
      <pointLight position={[0, 8, -5]} intensity={3} color="#34D399" distance={30} />
      <PatrolLight offset={0} color="#34D399" />
      <PatrolLight offset={1.57} color="#22D3EE" />
      <PatrolLight offset={3.14} color="#60A5FA" />
      <PatrolLight offset={4.71} color="#34D399" />

      {/* Screen panels */}
      {PANEL_COLORS.map((color, i) => {
        const col = i % PANEL_COLS
        const row = Math.floor(i / PANEL_COLS)
        return <ScreenPanel key={i} col={col} row={row} color={color} />
      })}

      <HeartbeatWave />

      {/* Alert towers */}
      {ALERT_TOWER_XS.map((x, i) => (
        <AlertTower key={i} x={x} alertIdx={i} currentAlert={currentAlert.current} />
      ))}

      <OrbitalRing radius={10} tilt={0.2} speed={0.018} color="#34D399" opacity={0.05} />
      <OrbitalRing radius={14} tilt={-0.14} speed={-0.012} color="#22D3EE" opacity={0.035} />
      <OrbitalRing radius={18} tilt={0.08} speed={0.008} color="#A78BFA" opacity={0.025} />

      <Starfield />

      {/* Floor */}
      <mesh position={[0, -4.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 20]} />
        <meshStandardMaterial color="#020e07" roughness={0.95} transparent opacity={0.95} />
      </mesh>
    </group>
  )
}
