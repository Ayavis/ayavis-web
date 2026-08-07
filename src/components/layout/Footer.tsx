'use client'

import React from 'react'
import Logo from '@/components/ui/Logo'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--bg)',
      borderTop: '1px solid var(--border)',
      padding: '2.5rem clamp(2rem, 6vw, 7rem)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '1rem',
    }}>
      <Logo size="sm" className="opacity-40" />
      <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        © {new Date().getFullYear()} AYAVIS Consulting Services
      </p>
      <a href="mailto:mail@ayavis.com"
        style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
        mail@ayavis.com
      </a>
    </footer>
  )
}
