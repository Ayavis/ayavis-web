'use client'

import React from 'react'
import AnimatedArchitecture from '@/components/diagrams/AnimatedArchitecture'

export default function ArchitectureSection() {
  return (
    <section
      id="architecture"
      className="relative"
      style={{ background: 'var(--bg)', paddingTop: '8rem', paddingBottom: '8rem' }}
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, rgba(26,79,255,0.2))' }}
      />

      <div style={{ paddingLeft: 'clamp(2rem, 5vw, 6rem)', paddingRight: 'clamp(2rem, 5vw, 6rem)' }}>
        {/* Heading */}
        <div className="mb-16">
          <span className="block text-xs font-semibold tracking-[0.28em] uppercase mb-5"
            style={{ color: 'var(--text-muted)' }}>
            Reference Architecture
          </span>
          <h2 className="font-light tracking-tight"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 5rem)', color: 'var(--text-primary)', lineHeight: 1.1, maxWidth: '18ch' }}>
            Every layer is intentional.
          </h2>
          <p className="mt-5 font-light leading-relaxed"
            style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '52ch' }}>
            From experience surfaces to cloud infrastructure, each component
            has a deliberate role. Watch the requests move through.
          </p>
        </div>

        {/* Animated SVG — full width */}
        <AnimatedArchitecture />
      </div>
    </section>
  )
}
