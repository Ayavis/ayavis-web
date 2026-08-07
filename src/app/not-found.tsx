import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', padding: 'clamp(2rem, 8vw, 8rem)',
      background: '#F4F6FB',
    }}>
      <span style={{
        fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.28em',
        textTransform: 'uppercase', color: 'rgba(12,15,30,0.35)',
        marginBottom: '1.5rem', display: 'block',
      }}>
        404
      </span>
      <h1 style={{
        fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 300,
        letterSpacing: '-0.025em', color: '#0C0F1E',
        lineHeight: 1.08, margin: '0 0 1.5rem',
      }}>
        Page not found.
      </h1>
      <p style={{
        fontSize: '1.05rem', color: 'rgba(12,15,30,0.5)',
        fontWeight: 300, lineHeight: 1.7, maxWidth: '42ch',
        margin: '0 0 3rem',
      }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.6rem',
        fontSize: '0.82rem', fontWeight: 600, letterSpacing: '0.08em',
        color: '#1A4FFF', textDecoration: 'none',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M12 7H2M7 2L2 7l5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to home
      </Link>
    </div>
  )
}
