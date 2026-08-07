'use client'

import React, { useEffect, useState } from 'react'
import Logo from '@/components/ui/Logo'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        transition: 'background 0.35s, box-shadow 0.35s',
        background: scrolled ? 'rgba(244,246,251,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(30,50,120,0.07)' : 'none',
      }}
    >
      <div style={{
        padding: '0 clamp(2rem, 6vw, 7rem)',
        height: '4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="#" aria-label="Back to top" style={{ lineHeight: 0 }}>
          <Logo size="md" className="text-[#0C0F1E] opacity-80" />
        </a>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          {[
            { label: 'Services',     href: '#services' },
            { label: 'Approach',     href: '#approach' },
            { label: 'Architecture', href: '#architecture' },
            { label: 'Contact',      href: '#contact' },
          ].map((item) => (
            <a key={item.label} href={item.href} style={{
              fontSize: '0.68rem', fontWeight: 700,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              textDecoration: 'none', color: 'rgba(12,15,30,0.45)',
              transition: 'color 0.2s',
            }}>
              {item.label}
            </a>
          ))}
        </nav>

        <a href="mailto:mail@ayavis.com" style={{
          display: 'none',
          fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em',
          padding: '0.45rem 1.2rem',
          border: '1px solid rgba(30,50,120,0.18)',
          color: 'rgba(12,15,30,0.55)',
          borderRadius: 2, textDecoration: 'none', transition: 'all 0.2s',
        }} className="md:inline-flex">
          Get in touch
        </a>
      </div>
    </header>
  )
}
