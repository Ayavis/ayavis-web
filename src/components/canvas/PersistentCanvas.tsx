'use client'

import React, { useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import dynamic from 'next/dynamic'
import CameraRig from './CameraRig'
import { scrollState } from '@/lib/scrollStore'

const HeroZone        = dynamic(() => import('./zones/HeroZone'),        { ssr: false })
const CloudZone       = dynamic(() => import('./zones/CloudZone'),       { ssr: false })
const SecurityZone    = dynamic(() => import('./zones/SecurityZone'),    { ssr: false })
const DataZone        = dynamic(() => import('./zones/DataZone'),        { ssr: false })
const EngineeringZone = dynamic(() => import('./zones/EngineeringZone'), { ssr: false })
const OperationsZone  = dynamic(() => import('./zones/OperationsZone'),  { ssr: false })

/* Zone visibility ranges — only render when camera is nearby */
const ZONE_RANGES = [
  { ref: 'hero',        min: 0.00, max: 0.58 },
  { ref: 'cloud',       min: 0.54, max: 0.70 },
  { ref: 'security',    min: 0.62, max: 0.80 },
  { ref: 'data',        min: 0.72, max: 0.90 },
  { ref: 'engineering', min: 0.80, max: 0.95 },
  { ref: 'operations',  min: 0.88, max: 1.00 },
]

function WorldScene() {
  const groupRefs = useRef<Record<string, THREE.Group | null>>({
    hero: null, cloud: null, security: null,
    data: null, engineering: null, operations: null,
  })
  const zoneAlpha = useRef<Record<string, number>>({
    hero: 1, cloud: 0, security: 0, data: 0, engineering: 0, operations: 0,
  })
  /* Initialize prevAlpha to -1 so first frame always applies visibility */
  const prevAlpha = useRef<Record<string, number>>({
    hero: -1, cloud: -1, security: -1, data: -1, engineering: -1, operations: -1,
  })

  useFrame(() => {
    const p = scrollState.progress
    ZONE_RANGES.forEach(({ ref, min, max }) => {
      const g = groupRefs.current[ref]
      if (!g) return

      const target = (p >= min && p <= max) ? 1 : 0
      const prev = zoneAlpha.current[ref]
      const next = prev + (target - prev) * 0.055
      zoneAlpha.current[ref] = Math.abs(next - target) < 0.004 ? target : next
      const alpha = zoneAlpha.current[ref]

      /* Always update visibility; skip material traversal only when stable */
      g.visible = alpha > 0.004

      if (Math.abs(alpha - prevAlpha.current[ref]) > 0.001) {
        prevAlpha.current[ref] = alpha
        if (g.visible) {
          g.traverse((child) => {
            const obj = child as any
            if (!obj.material) return
            const mats: THREE.Material[] = Array.isArray(obj.material) ? obj.material : [obj.material]
            for (const mat of mats) {
              if (!mat) continue
              if ((mat as any).__baseOp === undefined) {
                (mat as any).__baseOp = mat.opacity
                mat.transparent = true
              }
              mat.opacity = (mat as any).__baseOp * alpha
            }
          })
        }
      }
    })
  })

  return (
    <>
      {/* Daylight-style lighting for light background */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[8, 14, 8]}  intensity={0.7} color="#ffffff" />
      <directionalLight position={[-6, 4, 10]} intensity={0.4} color="#E8F0FF" />
      <directionalLight position={[0, -8, -4]} intensity={0.2} color="#F0EEE8" />

      <group ref={(r) => { groupRefs.current.hero        = r }}><HeroZone        z={0}    /></group>
      <group ref={(r) => { groupRefs.current.cloud       = r }}><CloudZone       z={-80}  /></group>
      <group ref={(r) => { groupRefs.current.security    = r }}><SecurityZone    z={-160} /></group>
      <group ref={(r) => { groupRefs.current.data        = r }}><DataZone        z={-240} /></group>
      <group ref={(r) => { groupRefs.current.engineering = r }}><EngineeringZone z={-320} /></group>
      <group ref={(r) => { groupRefs.current.operations  = r }}><OperationsZone  z={-400} /></group>
    </>
  )
}

function ScrollDriver() {
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      scrollState.progress = max > 0 ? window.scrollY / max : 0
    }
    const onMouse = (e: MouseEvent) => {
      scrollState.mouseX = (e.clientX / window.innerWidth - 0.5) * 2
      scrollState.mouseY = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('scroll',    onScroll, { passive: true })
    window.addEventListener('mousemove', onMouse,  { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll',    onScroll)
      window.removeEventListener('mousemove', onMouse)
    }
  }, [])
  return null
}

class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() {
    /* WebGL unavailable — page works fine without the 3D canvas */
    if (this.state.failed) return null
    return this.props.children
  }
}

export default function PersistentCanvas() {
  return (
    <CanvasErrorBoundary>
      <ScrollDriver />
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0,
          width: '100vw', height: '100vh',
          zIndex: 0,
          pointerEvents: 'none',
          background: '#F4F6FB',
        }}
      >
        <Canvas
          camera={{ position: [0, 0, 14], fov: 60, near: 0.1, far: 600 }}
          dpr={[1, 1.2]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          onCreated={({ scene, gl }) => {
            scene.fog = new THREE.FogExp2(0xF4F6FB, 0.003)
            gl.setClearColor(0xF4F6FB, 1)
          }}
        >
          <Suspense fallback={null}>
            <WorldScene />
            <CameraRig />
          </Suspense>
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  )
}
