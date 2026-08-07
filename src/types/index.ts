import type { Vector3 } from 'three'

export interface ArchitectureLayer {
  id: string
  label: string
  sublabel?: string
  y: number
  color: string
  strokeColor: string
  nodes: ArchitectureNode[]
}

export interface ArchitectureNode {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  type: 'service' | 'data' | 'gateway' | 'platform' | 'security' | 'integration'
  connections?: string[]
}

export interface Chapter {
  id: string
  slug: string
  label: string
  headline: string
  body: string
  camera: {
    position: [number, number, number]
    target: [number, number, number]
    fov: number
  }
  activeNodes?: string[]
}

export interface SceneProps {
  progress?: number
  active?: boolean
}
