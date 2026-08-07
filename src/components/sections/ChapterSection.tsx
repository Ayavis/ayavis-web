'use client'

import React from 'react'
import type { Chapter } from '@/types'

interface ChapterSectionProps {
  chapter: Chapter
  tag?: string
  align?: 'left' | 'right'
}

export default function ChapterSection({ chapter, tag, align = 'left' }: ChapterSectionProps) {
  const isRight = align === 'right'

  return (
    <section
      id={chapter.slug}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-end',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      {/* Text block */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          paddingBottom: '6rem',
          paddingLeft: isRight ? undefined : 'clamp(2rem, 6vw, 7rem)',
          paddingRight: isRight ? 'clamp(2rem, 6vw, 7rem)' : undefined,
          display: 'flex',
          justifyContent: isRight ? 'flex-end' : 'flex-start',
        }}
      >
        <div style={{
          maxWidth: '44ch',
          background: 'rgba(244,246,251,0.88)',
          backdropFilter: 'blur(8px)',
          padding: '2.5rem 3rem',
          borderRadius: 4,
        }}>
          {tag && (
            <span style={{
              display: 'block',
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(12,15,30,0.4)',
              marginBottom: '1.2rem',
            }}>
              {tag}
            </span>
          )}

          <h2 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)',
            fontWeight: 300,
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
            color: '#0C0F1E',
            marginBottom: '1.5rem',
          }}>
            {chapter.headline}
          </h2>

          <p style={{
            fontSize: '1.05rem',
            color: 'rgba(12,15,30,0.55)',
            fontWeight: 300,
            lineHeight: 1.7,
          }}>
            {chapter.body}
          </p>
        </div>
      </div>
    </section>
  )
}
