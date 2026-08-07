'use client'

import React from 'react'
import Button from '@/components/ui/Button'

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen flex flex-col justify-end overflow-hidden"
      id="hero"
      style={{ background: 'transparent' }}
    >
      {/* Bottom-anchored content — floats over the 3D canvas */}
      <div
        className="relative z-10 w-full pb-20 pt-40"
        style={{ paddingLeft: 'clamp(2rem, 6vw, 7rem)', paddingRight: 'clamp(2rem, 6vw, 7rem)' }}
      >
        <div
          className="animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          <span
            className="inline-block text-xs font-semibold tracking-[0.28em] uppercase mb-8"
            style={{ color: 'rgba(12,15,30,0.4)' }}
          >
            Strategy · Architecture · Engineering · Operations
          </span>
        </div>

        <h1
          className="font-light leading-[0.92] tracking-tight animate-fade-up"
          style={{
            fontSize: 'clamp(3.5rem, 9vw, 8.5rem)',
            color: '#0C0F1E',
            maxWidth: '16ch',
            animationDelay: '0.22s',
          }}
        >
          Design the systems that{' '}
          <em style={{ fontStyle: 'normal', color: '#1A4FFF' }}>move your&nbsp;business</em>{' '}
          forward.
        </h1>

        <div
          className="mt-8 animate-fade-up"
          style={{ animationDelay: '0.4s', maxWidth: '52ch' }}
        >
          <p style={{ fontSize: '1.2rem', color: 'rgba(12,15,30,0.6)', lineHeight: 1.65, fontWeight: 300 }}>
            We help organizations turn complex ambitions into resilient, intelligent,
            and operable solutions - built to last and built to evolve.
          </p>
        </div>

        <div
          className="mt-10 flex flex-wrap gap-4 animate-fade-up"
          style={{ animationDelay: '0.56s' }}
        >
          <Button as="a" href="#architecture" variant="primary">
            Explore the architecture
          </Button>
          <Button as="a" href="mailto:mail@ayavis.com" variant="ghost">
            Start a conversation
          </Button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        style={{ opacity: 0.3 }}>
        <span className="text-[9px] tracking-[0.3em] uppercase" style={{ color: 'rgba(12,15,30,0.6)' }}>Scroll</span>
        <div className="w-px h-8" style={{ background: 'linear-gradient(to bottom, rgba(12,15,30,0.4), transparent)' }} />
      </div>
    </section>
  )
}
