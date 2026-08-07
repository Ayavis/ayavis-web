'use client'

import React, { useRef, useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PHASES = [
  {
    tag: 'Strategy',
    headline: 'Start with clarity.',
    body: 'We help leadership teams define technology direction, architectural principles, and investment priorities that align with how the business needs to move.',
    chips: ['Technology roadmaps', 'Architecture assessment', 'Operating model design', 'Investment prioritisation'],
    accent: '#1A4FFF',
    bg: '#F4F6FB',
  },
  {
    tag: 'Design',
    headline: 'Build on solid foundations.',
    body: 'Our architects work at every level of the stack - from enterprise reference models to the specifics of platform topology, API contracts, and data governance.',
    chips: ['Solution architecture', 'Platform & cloud design', 'Data architecture', 'Security architecture'],
    accent: '#7B3CFF',
    bg: '#F4F6FB',
  },
  {
    tag: 'Build',
    headline: 'Deliver with intention.',
    body: 'We work alongside engineering teams to translate architecture into practice - establishing delivery systems, engineering standards, and platform capabilities that scale.',
    chips: ['Engineering delivery', 'Platform engineering', 'DevOps & CI/CD', 'Integration & APIs'],
    accent: '#0070CC',
    bg: '#F4F6FB',
  },
  {
    tag: 'Operate',
    headline: 'Sustain what you build.',
    body: 'The work does not end at launch. We help organisations build the observability, reliability practices, and operational structures that keep complex systems running well.',
    chips: ['SRE & reliability engineering', 'Observability & monitoring', 'Incident response design', 'Continuous improvement'],
    accent: '#00884A',
    bg: '#F4F6FB',
  },
]

function StrategyAmbient({ color }: { color: string }) {
  return (
    <div style={{ position: 'absolute', right: '8%', top: '50%', transform: 'translateY(-50%)', width: '36vw', height: '36vw', pointerEvents: 'none' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            inset: `${i * 9}%`,
            border: `${i < 2 ? 2 : 1.5}px solid ${color}`,
            opacity: 0.55 - i * 0.08,
            borderRadius: '50%',
            animation: `approach-ring-expand ${3.5 + i * 0.6}s ease-out infinite`,
            animationDelay: `${i * 0.75}s`,
          }}
        />
      ))}
    </div>
  )
}

function DesignAmbient({ color }: { color: string }) {
  const lines = []
  for (let i = 0; i <= 8; i++) {
    lines.push(
      <div key={`h${i}`} style={{ position: 'absolute', left: 0, right: 0, top: `${i * 12.5}%`, height: 1, background: color, opacity: i % 2 === 0 ? 0.28 : 0.14 }} />,
      <div key={`v${i}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${i * 12.5}%`, width: 1, background: color, opacity: i % 2 === 0 ? 0.28 : 0.14 }} />
    )
  }
  const nodes = []
  for (let r = 1; r <= 7; r += 2) {
    for (let c = 1; c <= 7; c += 2) {
      nodes.push(
        <div key={`n${r}${c}`} style={{
          position: 'absolute',
          left: `calc(${c * 12.5}% - 4px)`,
          top: `calc(${r * 12.5}% - 4px)`,
          width: 8, height: 8, borderRadius: '50%',
          background: color, opacity: 0.6,
          animation: `approach-node-pulse 3.2s ease-in-out infinite`,
          animationDelay: `${(r + c) * 0.25}s`,
        }} />
      )
    }
  }
  return (
    <div style={{ position: 'absolute', right: '4%', top: '8%', width: '38vw', height: '84vh', pointerEvents: 'none', opacity: 1 }}>
      {lines}{nodes}
    </div>
  )
}

/* Pre-computed outside component — Math.sin/cos floats must be rounded at module
   load time so SSR and client produce identical style strings. */
const BAR_DATA = Array.from({ length: 14 }, (_, i) => ({
  x: parseFloat((i * 7.2).toFixed(4)),
  h: parseFloat((Math.max(4, 18 + Math.sin(i * 0.9) * 38 + Math.cos(i * 1.4) * 18)).toFixed(4)),
  delay: parseFloat((i * 0.1).toFixed(4)),
}))

function BuildAmbient({ color }: { color: string }) {
  return (
    <div style={{ position: 'absolute', right: '6%', bottom: '8%', width: '40vw', height: '55vh', pointerEvents: 'none' }}>
      {BAR_DATA.map((bar, i) => (
        <div key={i} style={{
          position: 'absolute', bottom: '0', left: `${bar.x}%`, width: '5.5%',
          height: `${bar.h}%`,
          background: `linear-gradient(to top, ${color}CC, ${color}22)`,
          borderRadius: '2px 2px 0 0',
          animation: `approach-bar-rise 2.8s ease-in-out infinite alternate`,
          animationDelay: `${bar.delay}s`,
        }} />
      ))}
    </div>
  )
}

function OperateAmbient({ color }: { color: string }) {
  const W = 600, H = 180
  const makePath = (offset: number) =>
    Array.from({ length: 120 }, (_, i) => {
      const x = (i / 119) * W
      const y = H / 2 + Math.sin((i / 119) * Math.PI * 5 + offset) * 55 + Math.sin((i / 119) * Math.PI * 2.3 + offset) * 20
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    }).join(' ')

  return (
    <div style={{ position: 'absolute', right: '2%', top: '50%', transform: 'translateY(-50%)', width: '46vw', pointerEvents: 'none' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', overflow: 'visible' }}>
        <defs>
          <linearGradient id="wave-g1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0" />
            <stop offset="30%" stopColor={color} stopOpacity="0.75" />
            <stop offset="70%" stopColor={color} stopOpacity="0.75" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={makePath(0)} fill="none" stroke="url(#wave-g1)" strokeWidth="2.5"
          style={{ animation: 'approach-wave-drift 4s linear infinite' }} />
        <path d={makePath(1.5)} fill="none" stroke={color} strokeWidth="1.5" opacity="0.45"
          style={{ animation: 'approach-wave-drift 6s linear infinite reverse' }} />
        <path d={makePath(3.1)} fill="none" stroke={color} strokeWidth="2" opacity="0.3"
          style={{ animation: 'approach-wave-drift 5s linear infinite' }} />
      </svg>
    </div>
  )
}

const CSS_KEYFRAMES = `
  @keyframes approach-ring-expand {
    0%   { transform: scale(0.75); opacity: 0.5; }
    100% { transform: scale(1.5);  opacity: 0;   }
  }
  @keyframes approach-node-pulse {
    0%, 100% { opacity: 0.1; transform: scale(1);   }
    50%       { opacity: 0.6; transform: scale(2.2); }
  }
  @keyframes approach-bar-rise {
    0%   { transform: scaleY(0.65); }
    100% { transform: scaleY(1.2);  }
  }
  @keyframes approach-wave-drift {
    0%   { transform: translateX(0);   }
    100% { transform: translateX(-6%); }
  }
`

export default function ApproachSection() {
  const outerRef    = useRef<HTMLDivElement>(null)
  const bgRef       = useRef<HTMLDivElement>(null)
  const phaseRefs   = useRef<(HTMLDivElement | null)[]>([])
  const bgWordRefs  = useRef<(HTMLDivElement | null)[]>([])
  const ambientRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs     = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!outerRef.current) return

    phaseRefs.current.forEach((el, i) =>
      el && gsap.set(el, { autoAlpha: i === 0 ? 1 : 0, y: i === 0 ? 0 : 35 })
    )
    bgWordRefs.current.forEach((el, i) =>
      el && gsap.set(el, { autoAlpha: i === 0 ? 0.65 : 0, x: 0 })
    )
    ambientRefs.current.forEach((el, i) =>
      el && gsap.set(el, { autoAlpha: i === 0 ? 1 : 0 })
    )

    /* Each transition occupies 0.1 "seconds" of timeline.
       Out finishes at [at], in starts at [at + 0.02] — brief blackout prevents overlap. */
    const D = 0.09  // fade duration
    const GAP = 0.02

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: outerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          const active = Math.min(Math.floor(self.progress * 4), 3)
          dotRefs.current.forEach((dot, i) => {
            if (!dot) return
            dot.style.width      = i === active ? '2rem'            : '0.4rem'
            dot.style.background = i === active ? PHASES[i].accent  : 'rgba(12,15,30,0.15)'
            dot.style.opacity    = i === active ? '1'               : '0.4'
          })
        },
      },
    })

    PHASES.forEach((_, i) => {
      if (i === 0) return
      /* Each phase pair starts at a staggered timeline position */
      const base = (i - 1) * (D * 2 + GAP * 2 + 0.15)
      const outAt = base
      const inAt  = base + D + GAP

      const prev     = phaseRefs.current[i - 1]
      const curr     = phaseRefs.current[i]
      const prevWord = bgWordRefs.current[i - 1]
      const currWord = bgWordRefs.current[i]
      const prevAmb  = ambientRefs.current[i - 1]
      const currAmb  = ambientRefs.current[i]

      tl.to(prev,     { autoAlpha: 0, y: -30, duration: D, ease: 'power2.in'  }, outAt)
      tl.to(prevWord, { autoAlpha: 0, x: -20, duration: D                      }, outAt)
      tl.to(prevAmb,  { autoAlpha: 0,          duration: D                      }, outAt)

      tl.fromTo(curr,     { autoAlpha: 0, y: 30  }, { autoAlpha: 1, y: 0, duration: D, ease: 'power2.out' }, inAt)
      tl.fromTo(currWord, { autoAlpha: 0, x: 20  }, { autoAlpha: 0.65, x: 0, duration: D                  }, inAt)
      tl.fromTo(currAmb,  { autoAlpha: 0         }, { autoAlpha: 1, duration: D, ease: 'power2.out'        }, inAt)
    })

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  return (
    <section id="approach" ref={outerRef} style={{ height: '400vh', position: 'relative' }}>
      <style dangerouslySetInnerHTML={{ __html: CSS_KEYFRAMES }} />

      {/* Sticky container - bg color shifts per phase */}
      <div
        ref={bgRef}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: PHASES[0].bg,
        }}
      >
        {/* Large faint phase word - right side */}
        {PHASES.map((phase, i) => (
          <div
            key={phase.tag}
            ref={(el) => { bgWordRefs.current[i] = el }}
            style={{
              position: 'absolute',
              right: '-2vw',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 'clamp(9rem, 19vw, 21rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: 'transparent',
              WebkitTextStroke: `1.5px ${phase.accent}55`,
              lineHeight: 0.9,
              userSelect: 'none',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {phase.tag.toUpperCase()}
          </div>
        ))}

        {/* Per-phase ambient visuals */}
        {PHASES.map((phase, i) => (
          <div
            key={`amb-${phase.tag}`}
            ref={(el) => { ambientRefs.current[i] = el }}
            style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
          >
            {i === 0 && <StrategyAmbient color={phase.accent} />}
            {i === 1 && <DesignAmbient   color={phase.accent} />}
            {i === 2 && <BuildAmbient    color={phase.accent} />}
            {i === 3 && <OperateAmbient  color={phase.accent} />}
          </div>
        ))}

        {/* Section label */}
        <div style={{
          position: 'absolute', top: '2.5rem',
          left: 'clamp(2rem, 6vw, 7rem)', zIndex: 10,
        }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'rgba(12,15,30,0.35)',
          }}>
            How we work
          </span>
        </div>

        {/* Phase content stack */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 'clamp(2rem, 6vw, 7rem)',
          right: 0,
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}>
          <div style={{ position: 'relative' }}>
            {PHASES.map((phase, i) => (
              <div
                key={phase.tag}
                ref={(el) => { phaseRefs.current[i] = el }}
                style={{
                  position: i === 0 ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  width: 'min(54%, 680px)',
                  pointerEvents: 'none',
                }}
              >
                {/* Tag label */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.26em',
                    textTransform: 'uppercase', color: phase.accent,
                  }}>
                    {phase.tag}
                  </span>
                </div>

                <h2 style={{
                  fontSize: 'clamp(2.6rem, 5vw, 5.8rem)',
                  fontWeight: 300, lineHeight: 1.06, letterSpacing: '-0.02em',
                  color: 'var(--text-primary)', marginBottom: '1.75rem', maxWidth: '16ch',
                }}>
                  {phase.headline}
                </h2>

                <p style={{
                  fontSize: '1.05rem', color: 'var(--text-secondary)',
                  fontWeight: 300, lineHeight: 1.75, maxWidth: '52ch', marginBottom: '2.25rem',
                }}>
                  {phase.body}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.55rem' }}>
                  {phase.chips.map((chip) => (
                    <span key={chip} style={{
                      fontSize: '0.76rem', fontWeight: 500,
                      padding: '0.28rem 0.85rem',
                      border: `1px solid ${phase.accent}40`,
                      borderRadius: '100px', color: phase.accent,
                      background: `${phase.accent}0A`, letterSpacing: '0.02em',
                    }}>
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress dots - bottom right */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', right: 'clamp(2rem, 6vw, 7rem)',
          display: 'flex', gap: '0.65rem', alignItems: 'center', zIndex: 10,
        }}>
          {PHASES.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el }}
              style={{
                width: i === 0 ? '2rem' : '0.4rem',
                height: '0.4rem',
                borderRadius: '100px',
                background: i === 0 ? PHASES[0].accent : 'rgba(12,15,30,0.15)',
                opacity: i === 0 ? 1 : 0.4,
                transition: 'width 0.4s ease, background 0.4s ease, opacity 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
