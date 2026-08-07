'use client'

import React, { useRef, useEffect, useState } from 'react'

const SECTORS = [
  { label: 'Financial Services',           icon: '◈' },
  { label: 'Healthcare & Life Sciences',   icon: '◉' },
  { label: 'Government & Public Sector',   icon: '◇' },
  { label: 'Energy & Utilities',           icon: '◎' },
  { label: 'Technology & Software',        icon: '◆' },
  { label: 'Retail & Consumer',            icon: '○' },
  { label: 'Industrial & Manufacturing',   icon: '◐' },
  { label: 'Media & Information',          icon: '◑' },
]

const CAPABILITIES = [
  { text: 'Enterprise-scale technology transformation', accent: '#1A4FFF' },
  { text: 'Cloud migration and platform modernisation', accent: '#0070CC' },
  { text: 'Data platform and analytics strategy',       accent: '#7B3CFF' },
  { text: 'Security architecture and compliance',       accent: '#0070CC' },
  { text: 'Digital product and service delivery',       accent: '#1A4FFF' },
  { text: 'Engineering capability and team enablement', accent: '#7B3CFF' },
]

const STATS = [
  { value: 8, suffix: '+', label: 'Industries' },
  { value: 4, suffix: '',  label: 'Practice areas' },
  { value: 20, suffix: '+', label: 'Years combined' },
]

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect() } }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

function AnimatedCounter({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    let frame = 0
    const total = 40
    const iv = setInterval(() => {
      frame++
      setCount(Math.round((frame / total) * target))
      if (frame >= total) clearInterval(iv)
    }, 30)
    return () => clearInterval(iv)
  }, [inView, target])
  return <>{count}{suffix}</>
}

const HEADLINE_WORDS = ['Complex', 'problems', 'across', 'industries', 'and', 'sectors.']

const CSS = `
  @keyframes svc-fade-up {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes svc-line-grow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes svc-dot-breathe {
    0%, 100% { opacity: 0.07; }
    50%       { opacity: 0.16; }
  }
  @keyframes svc-bar-rise {
    from { transform: scaleY(0); }
    to   { transform: scaleY(1); }
  }
`

export default function ServicesSection() {
  const { ref: sectionRef, inView } = useInView(0.08)
  const [hoveredSector, setHoveredSector] = useState<string | null>(null)

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        background: 'var(--bg)',
        padding: 'clamp(5rem, 10vw, 11rem) clamp(2rem, 6vw, 7rem)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Animated dot grid background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        {Array.from({ length: 240 }, (_, idx) => {
          const row = Math.floor(idx / 20)
          const col = idx % 20
          const dur = (2.5 + (row + col) * 0.15).toFixed(2)
          const del = ((row * 5 + col) * 0.08 % 2).toFixed(2)
          return (
            <div
              key={`${row}-${col}`}
              style={{
                position: 'absolute',
                width: 3, height: 3, borderRadius: '50%',
                background: '#1A4FFF',
                left: `${(col / 19) * 100}%`,
                top: `${(row / 11) * 100}%`,
                animation: `svc-dot-breathe ${dur}s ease-in-out ${del}s infinite`,
              }}
            />
          )
        })}
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Section label */}
        <div style={{
          opacity: inView ? 1 : 0,
          transform: inView ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.5s ease, transform 0.5s ease',
        }}>
          <span style={{
            display: 'block', fontSize: '0.7rem', fontWeight: 700,
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'var(--text-muted)', marginBottom: '2.5rem',
          }}>
            Context
          </span>
        </div>

        {/* Animated headline - word by word */}
        <h2 style={{
          fontSize: 'clamp(2.2rem, 4.5vw, 4.5rem)',
          fontWeight: 300, letterSpacing: '-0.025em',
          color: 'var(--text-primary)', lineHeight: 1.1,
          marginBottom: '3.5rem', maxWidth: '18ch',
        }}>
          {HEADLINE_WORDS.map((word, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                marginRight: '0.28em',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 0.55s ease ${0.1 + i * 0.08}s, transform 0.55s ease ${0.1 + i * 0.08}s`,
              }}
            >
              {word}
            </span>
          ))}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
          {/* Left: capabilities */}
          <div>
            <p style={{
              fontSize: '1.05rem', color: 'var(--text-secondary)',
              fontWeight: 300, lineHeight: 1.75, maxWidth: '46ch', marginBottom: '2.5rem',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 0.35s, transform 0.6s ease 0.35s',
            }}>
              Our work spans the intersection of business strategy and technical execution,
              in environments where the stakes are high and the systems need to last.
            </p>

            {CAPABILITIES.map((cap, i) => (
              <div
                key={cap.text}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '1rem',
                  marginBottom: '0.8rem',
                  opacity: inView ? 1 : 0,
                  transform: inView ? 'translateX(0)' : 'translateX(-18px)',
                  transition: `opacity 0.5s ease ${0.5 + i * 0.07}s, transform 0.5s ease ${0.5 + i * 0.07}s`,
                }}
              >
                <div style={{
                  width: '2rem', height: 1,
                  background: cap.accent,
                  opacity: 0.6, marginTop: '0.68rem', flexShrink: 0,
                  transformOrigin: 'left',
                  animation: inView ? `svc-line-grow 0.5s ease ${0.5 + i * 0.07}s both` : 'none',
                }} />
                <span style={{
                  fontSize: '0.95rem',
                  color: 'var(--text-secondary)', fontWeight: 300,
                }}>
                  {cap.text}
                </span>
              </div>
            ))}

            {/* Stats row */}
            <div style={{
              display: 'flex', gap: '2.5rem', marginTop: '2.5rem',
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s ease 1s, transform 0.6s ease 1s',
            }}>
              {STATS.map((s, i) => (
                <div key={s.label}>
                  <div style={{
                    fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 200,
                    letterSpacing: '-0.03em', color: 'var(--text-primary)',
                    lineHeight: 1,
                  }}>
                    <AnimatedCounter target={s.value} suffix={s.suffix} inView={inView} />
                  </div>
                  <div style={{
                    fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.14em',
                    textTransform: 'uppercase', color: 'var(--text-muted)',
                    marginTop: '0.35rem',
                  }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: sectors */}
          <div>
            <span style={{
              display: 'block', fontSize: '0.7rem', fontWeight: 700,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'var(--text-muted)', marginBottom: '1.5rem',
              opacity: inView ? 1 : 0,
              transition: 'opacity 0.5s ease 0.3s',
            }}>
              Sectors
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
              {SECTORS.map((s, i) => {
                const isHovered = hoveredSector === s.label
                return (
                  <div
                    key={s.label}
                    onMouseEnter={() => setHoveredSector(s.label)}
                    onMouseLeave={() => setHoveredSector(null)}
                    style={{
                      background: isHovered ? 'rgba(26,79,255,0.05)' : 'var(--bg)',
                      padding: '1.1rem 1.3rem',
                      display: 'flex', alignItems: 'center', gap: '0.7rem',
                      cursor: 'default',
                      opacity: inView ? 1 : 0,
                      transform: inView ? 'scale(1)' : 'scale(0.97)',
                      transition: `opacity 0.45s ease ${0.4 + i * 0.05}s, transform 0.45s ease ${0.4 + i * 0.05}s, background 0.2s ease`,
                    }}
                  >
                    <span style={{
                      fontSize: 11, color: '#1A4FFF',
                      opacity: isHovered ? 0.9 : 0.3,
                      transition: 'opacity 0.2s ease',
                      flexShrink: 0,
                    }}>
                      {s.icon}
                    </span>
                    <span style={{
                      fontSize: '0.9rem',
                      color: isHovered ? 'var(--text-primary)' : 'var(--text-secondary)',
                      fontWeight: isHovered ? 400 : 300,
                      transition: 'color 0.2s ease, font-weight 0.2s ease',
                    }}>
                      {s.label}
                    </span>
                  </div>
                )
              })}
            </div>

            <p style={{
              marginTop: '1.5rem', fontSize: '0.82rem',
              color: 'var(--text-muted)', lineHeight: 1.65,
              opacity: inView ? 1 : 0,
              transition: 'opacity 0.6s ease 0.9s',
            }}>
              We work with established enterprises navigating complexity
              and growth-stage organisations building for scale.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
