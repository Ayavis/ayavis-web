import { ImageResponse } from 'next/og'

export const dynamic     = 'force-static'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        background: '#F4F6FB',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '80px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
      }}>
        {/* Top accent bar */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: '#1A4FFF', display: 'flex',
        }} />

        {/* Wordmark */}
        <div style={{
          position: 'absolute', top: 72, left: 80,
          fontSize: 22, fontWeight: 700, letterSpacing: '0.18em',
          color: 'rgba(12,15,30,0.4)', display: 'flex',
        }}>
          AYAVIS
        </div>

        {/* Headline */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          fontSize: 68, fontWeight: 300, letterSpacing: '-0.025em',
          color: '#0C0F1E', lineHeight: 1.08, marginBottom: 36,
        }}>
          <span>Technology consulting</span>
          <span>built to last.</span>
        </div>

        {/* Tagline */}
        <div style={{
          display: 'flex',
          fontSize: 18, fontWeight: 600, letterSpacing: '0.18em',
          color: '#1A4FFF', opacity: 0.65,
        }}>
          STRATEGIZE · DESIGN · BUILD · OPERATE
        </div>

        {/* Decorative phase dots */}
        <div style={{
          position: 'absolute', right: 80, bottom: 80,
          display: 'flex', gap: 10, alignItems: 'center',
        }}>
          {['#1A4FFF', '#7B3CFF', '#0070CC', '#00884A'].map((c, i) => (
            <div key={i} style={{
              width: i === 0 ? 28 : 9, height: 9,
              borderRadius: 9, background: c, opacity: 0.45,
              display: 'flex',
            }} />
          ))}
        </div>
      </div>
    ),
    { ...size },
  )
}
