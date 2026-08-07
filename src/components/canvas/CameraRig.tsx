'use client'
import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { scrollState } from '@/lib/scrollStore'

/* Zone z-positions — must match WorldScene and page layout */
export const ZONE_Z: Record<string, number> = {
  hero:        0,
  cloud:     -80,
  security:  -160,
  data:      -240,
  engineering: -320,
  operations: -400,
  final:     -460,
}

/* Camera waypoints: [progress 0→1, x, y, z, lookAtZ]
 * progress = scrollY / (scrollHeight - viewportHeight) = scrollY / 10057
 * Section scroll positions: cloud=5781-6591, sec=6591-7401, data=7401-8211,
 * eng=8211-9021, ops=9021-9831, contact=9831+
 * Chapter midpoints / 10057: cloud=0.615, sec=0.696, data=0.776, eng=0.857, ops=0.937 */
const WAYPOINTS = [
  { p: 0.00,  x:  0, y:  0, z: 14,   lz:  0   }, // hero
  { p: 0.55,  x:  0, y:  2, z: 14,   lz: -20  }, // still in light sections (services)
  { p: 0.615, x:  2, y:  0, z: -66,  lz: -80  }, // cloud chapter midpoint
  { p: 0.696, x: -2, y:  0, z: -146, lz: -160 }, // security chapter midpoint
  { p: 0.776, x:  1, y: -1, z: -226, lz: -240 }, // data chapter midpoint
  { p: 0.857, x: -1, y:  1, z: -306, lz: -320 }, // engineering chapter midpoint
  { p: 0.937, x:  1, y:  0, z: -386, lz: -400 }, // operations chapter midpoint
  { p: 1.00,  x:  0, y:  3, z: -440, lz: -460 }, // contact / final pullback
]

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

function getWaypointCamera(progress: number) {
  // find surrounding waypoints
  let i = 0
  while (i < WAYPOINTS.length - 2 && WAYPOINTS[i + 1].p <= progress) i++
  const a = WAYPOINTS[i], b = WAYPOINTS[i + 1]
  const t = (progress - a.p) / Math.max(0.001, b.p - a.p)
  const smooth = t * t * (3 - 2 * t) // smoothstep
  return {
    x: lerp(a.x, b.x, smooth),
    y: lerp(a.y, b.y, smooth),
    z: lerp(a.z, b.z, smooth),
    lz: lerp(a.lz, b.lz, smooth),
  }
}

export default function CameraRig() {
  const { camera } = useThree()
  const current = useRef({ x: 0, y: 0, z: 14, lz: 0 })

  useFrame(() => {
    // Read scroll progress directly — works with Lenis since it updates window.scrollY
    const maxScroll = document.body.scrollHeight - window.innerHeight
    if (maxScroll > 0) scrollState.progress = window.scrollY / maxScroll

    const target = getWaypointCamera(scrollState.progress)

    // Fast catch-up when far away (jumped scroll), smooth lerp otherwise
    const distZ = Math.abs(current.current.z - target.z)
    const speed = distZ > 30 ? 0.15 : 0.055

    // mouse parallax
    const mx = scrollState.mouseX * 1.2
    const my = scrollState.mouseY * 0.8

    current.current.x = lerp(current.current.x, target.x + mx, speed)
    current.current.y = lerp(current.current.y, target.y + my, speed)
    current.current.z = lerp(current.current.z, target.z, speed)
    current.current.lz = lerp(current.current.lz, target.lz, speed)

    camera.position.set(current.current.x, current.current.y, current.current.z)
    camera.lookAt(current.current.x * 0.5, current.current.y * 0.3, current.current.lz)
  })

  return null
}
