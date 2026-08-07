'use client'

import React, { useRef, useEffect } from 'react'
import { ARCHITECTURE_LAYERS } from '@/data/architecture'
import type { ArchitectureNode } from '@/types'

const typeColors: Record<string, { bg: string; border: string; text: string }> = {
  service:     { bg: 'rgba(26,79,255,0.06)',  border: 'rgba(26,79,255,0.22)',  text: 'rgba(12,15,50,0.65)' },
  data:        { bg: 'rgba(120,60,220,0.08)', border: 'rgba(120,60,220,0.36)', text: 'rgba(12,15,50,0.65)' },
  gateway:     { bg: 'rgba(26,79,255,0.09)',  border: 'rgba(26,79,255,0.5)',   text: 'rgba(12,15,50,0.72)' },
  platform:    { bg: 'rgba(0,180,220,0.07)',  border: 'rgba(0,180,220,0.4)',   text: 'rgba(12,15,50,0.65)' },
  security:    { bg: 'rgba(220,100,30,0.07)', border: 'rgba(220,100,30,0.4)',  text: 'rgba(12,15,50,0.65)' },
  integration: { bg: 'rgba(26,79,255,0.07)',  border: 'rgba(26,79,255,0.35)', text: 'rgba(12,15,50,0.65)' },
}

const layerAccentRgb: Record<string, string> = {
  experience:   '26,79,255',
  applications: '30,50,150',
  api:          '56,189,248',
  services:     '30,50,150',
  data:         '168,85,247',
  cloud:        '34,211,238',
  security:     '251,146,60',
  operations:   '34,197,94',
}

/* Only middle layers respond to mouse parallax */
const PARALLAX: Record<number, number> = {
  1: 20, 2: -14, 3: 18, 4: -16, 5: 14, 6: -12,
}

const LABEL_W = 148   /* px — label column width */
const MIN_DRAG = -700 /* max scroll left */

function NodeChip({ node, pulseDelay, accentRgb }: { node: ArchitectureNode; pulseDelay: number; accentRgb: string }) {
  const c = typeColors[node.type] || typeColors.service
  const [hovered, setHovered] = React.useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 32,
        padding: '0 11px',
        background: hovered ? c.bg.replace(/[\d.]+\)$/, '0.14)') : c.bg,
        border: `1px solid ${hovered ? c.border.replace(/[\d.]+\)$/, '0.75)') : c.border}`,
        borderRadius: 3,
        whiteSpace: 'nowrap',
        fontSize: 10.5,
        fontWeight: 500,
        color: c.text,
        letterSpacing: '0.025em',
        flexShrink: 0,
        cursor: 'default',
        userSelect: 'none',
        animation: `arch-node-pulse 3.5s ease-in-out ${pulseDelay.toFixed(2)}s infinite`,
        boxShadow: hovered ? `0 0 10px rgba(${accentRgb},0.2)` : 'none',
        transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
      }}
    >
      {node.label}
    </div>
  )
}

export default function AnimatedArchitecture() {
  const scrollRef   = useRef<HTMLDivElement>(null)  /* the overflow-x:auto container */
  const stripRefs   = useRef<(HTMLDivElement | null)[]>([])
  const parallaxOff = useRef<number[]>(new Array(ARCHITECTURE_LAYERS.length).fill(0))
  const dragState   = useRef<{ startX: number; startScroll: number } | null>(null)

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    /* Parallax on mouse-move (desktop) */
    const onMouseMove = (e: MouseEvent) => {
      if (dragState.current) {
        /* Drag scroll — move in opposite direction of drag */
        const delta = dragState.current.startX - e.clientX
        container.scrollLeft = Math.max(0, dragState.current.startScroll + delta)
      }

      const offsetX = (e.clientX / window.innerWidth - 0.5) * 2
      ARCHITECTURE_LAYERS.forEach((_, i) => {
        const strip = stripRefs.current[i]
        if (!strip) return
        const factor = PARALLAX[i]
        parallaxOff.current[i] = factor !== undefined ? offsetX * factor : 0
        strip.style.transform = `translateX(${parallaxOff.current[i]}px)`
      })
    }

    const onMouseDown = (e: MouseEvent) => {
      dragState.current = { startX: e.clientX, startScroll: container.scrollLeft }
      container.style.cursor = 'grabbing'
    }

    const onMouseUp = () => {
      dragState.current = null
      container.style.cursor = 'grab'
    }

    container.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      container.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  return (
    <div style={{ width: '100%' }}>
      <style>{`
        @keyframes arch-node-pulse {
          0%, 85%, 100% { opacity: 1; transform: scale(1); }
          90%            { opacity: 0.7; transform: scale(1.025); }
          95%            { opacity: 0.9; transform: scale(1.018); }
        }
        @keyframes shimmer-x {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .arch-scroll::-webkit-scrollbar { display: none; }
        .arch-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Scrollable wrapper — overflow-x handles mobile swipe + desktop drag */}
      <div
        ref={scrollRef}
        className="arch-scroll"
        style={{
          overflowX: 'auto',
          cursor: 'grab',
          userSelect: 'none',
        }}
      >
        {/* Inner table — min-width keeps content from collapsing on mobile */}
        <div style={{ minWidth: 900, display: 'flex', flexDirection: 'column' }}>
          {ARCHITECTURE_LAYERS.map((layer, i) => {
            const accentRgb = layerAccentRgb[layer.id] || '26,79,255'
            return (
              <div
                key={layer.id}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  height: 72,
                  background: `rgba(${accentRgb},0.03)`,
                  border: `1px solid rgba(${accentRgb},0.12)`,
                  borderRadius: 4,
                  marginBottom: 6,
                  overflow: 'hidden',
                }}
              >
                {/* Shimmer sweep */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: `linear-gradient(90deg, transparent 0%, rgba(${accentRgb},0.04) 40%, transparent 100%)`,
                  animation: `shimmer-x ${8 + i * 2.2}s linear infinite`,
                  pointerEvents: 'none', zIndex: 1,
                }} />

                {/* Left label — sticky so it stays visible while scrolling */}
                <div style={{
                  position: 'sticky',
                  left: 0,
                  flexShrink: 0,
                  width: LABEL_W,
                  alignSelf: 'stretch',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '0 14px',
                  background: `linear-gradient(to right, rgba(${accentRgb},0.09) 0%, rgba(${accentRgb},0.05) 70%, transparent 100%)`,
                  zIndex: 3,
                  borderRight: `1px solid rgba(${accentRgb},0.1)`,
                }}>
                  <span style={{
                    fontSize: 8, fontWeight: 700, letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: `rgba(${accentRgb},0.7)`,
                    lineHeight: 1.2,
                  }}>
                    {layer.label}
                  </span>
                  {layer.sublabel && (
                    <span style={{
                      fontSize: 7, fontWeight: 400, letterSpacing: '0.05em',
                      color: 'rgba(12,15,50,0.35)', marginTop: 2,
                    }}>
                      {layer.sublabel}
                    </span>
                  )}
                </div>

                {/* Node strip — parallax applied via transform */}
                <div
                  ref={(el) => { stripRefs.current[i] = el }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '0 18px',
                    height: '100%',
                    transition: 'transform 0.35s ease-out',
                    willChange: 'transform',
                    zIndex: 2,
                  }}
                >
                  {layer.nodes.map((node, ni) => (
                    <NodeChip
                      key={node.id}
                      node={node}
                      pulseDelay={ni * 0.55}
                      accentRgb={accentRgb}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <p style={{
        fontSize: 9.5, color: 'rgba(12,15,50,0.28)',
        letterSpacing: '0.04em', marginTop: 16, textAlign: 'right',
      }}>
        Illustrative reference architecture. Not vendor-specific.
      </p>
    </div>
  )
}
