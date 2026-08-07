'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'ghost-dark'
  children: React.ReactNode
  as?: 'button' | 'a'
  href?: string
}

export default function Button({ variant = 'primary', children, className = '', as: Tag = 'button', href, ...props }: ButtonProps) {
  const base: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.75rem 1.75rem',
    fontSize: '0.88rem',
    fontWeight: 500,
    letterSpacing: '0.01em',
    borderRadius: 2,
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.25s',
    border: 'none',
    outline: 'none',
  }

  const styles: Record<string, React.CSSProperties> = {
    primary: { ...base, background: '#1A4FFF', color: '#fff' },
    ghost:   { ...base, background: 'transparent', color: 'rgba(12,15,30,0.55)', border: '1px solid rgba(30,50,120,0.18)' },
    'ghost-dark': { ...base, background: 'transparent', color: 'rgba(237,240,255,0.6)', border: '1px solid rgba(237,240,255,0.18)' },
  }

  if (Tag === 'a' && href) {
    return <a href={href} style={styles[variant]} className={className}>{children}</a>
  }
  return <button style={styles[variant]} className={className} {...props}>{children}</button>
}
