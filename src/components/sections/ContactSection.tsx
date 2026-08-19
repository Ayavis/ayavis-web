'use client'

import React, { useRef, useEffect } from 'react'

function FadeWord({ word, delay, color }: { word: string; delay: number; color?: string }) {
  const spanRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = spanRef.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      obs.disconnect()
      setTimeout(() => {
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      }, delay)
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <span
      ref={spanRef}
      style={{
        color: color || 'inherit',
        opacity: 0,
        transform: 'translateY(6px)',
        display: 'inline-block',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      {word}
    </span>
  )
}

export default function ContactSection() {
  return (
    <section id="contact" style={{
      background: 'var(--bg)',
      padding: 'clamp(6rem, 12vw, 14rem) clamp(2rem, 6vw, 7rem)',
    }}>
      <div style={{ maxWidth: '100%' }}>
        <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          The full picture
        </span>

        <h2 style={{
          fontSize: 'clamp(3rem, 7vw, 7.5rem)',
          fontWeight: 300,
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
          color: 'var(--text-primary)',
          marginBottom: '2.5rem',
        }}>
          <FadeWord word="Strategize." delay={0}   />{' '}
          <FadeWord word="Design."     delay={120} color="var(--text-secondary)" />{' '}
          <FadeWord word="Build."      delay={240} />{' '}
          <FadeWord word="Operate."    delay={360} color="var(--text-secondary)" />
        </h2>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', fontWeight: 300, lineHeight: 1.7, maxWidth: '52ch', marginBottom: '4rem' }}>
          We bring clarity across the full lifecycle of complex technology initiatives,
          from early strategy through sustained operations.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '6rem', flexWrap: 'wrap' }}>
          <a
            // href="mailto:ayavis.cs@gmail.com"
            href="mailto:mail@ayavis.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              fontWeight: 500,
              padding: '0.9rem 2rem',
              background: 'var(--accent)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 2,
              letterSpacing: '0.01em',
            }}
          >
            Contact us
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 300 }}>
            Ready to explore what a more deliberate approach could look like?
          </span>
        </div>

        {/* Capabilities grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem' }}
          className="grid-cols-2 md:grid-cols-4">
          {[
            { label: 'Strategy', items: ['Technology roadmaps', 'Architecture reviews', 'Operating models'] },
            { label: 'Design', items: ['Solution architecture', 'Platform design', 'Data architecture'] },
            { label: 'Build', items: ['Engineering delivery', 'Platform engineering', 'Integration'] },
            { label: 'Operate', items: ['SRE & reliability', 'Observability', 'Continuous improvement'] },
          ].map((cap) => (
            <div key={cap.label}>
              <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', opacity: 0.7, marginBottom: '1rem' }}>
                {cap.label}
              </p>
              {cap.items.map((item) => (
                <p key={item} style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
                  {item}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
