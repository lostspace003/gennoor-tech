// Dynamic Open Graph image for academy course pages.
// Next.js auto-binds this to /ai-academy/<courseId>/opengraph-image and serves
// it as the og:image for the route. 1200×630 PNG, generated server-side.

import { ImageResponse } from 'next/og'
import { getCourseById } from '@/config/courses'

export const runtime = 'edge'
export const alt = 'Gennoor Academy course'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props {
  params: { courseId: string }
}

export default async function CourseOgImage({ params }: Props) {
  const course = getCourseById(params.courseId)
  const title = course?.title ?? 'Gennoor Academy'
  const tagline = course?.description?.slice(0, 180) ?? 'Train, innovate, build.'
  const duration = course?.duration ?? ''
  const level = course?.level ?? ''
  const theme = course?.theme
  const accent = theme?.accent || '#F97316'
  const navy = theme?.navy || '#0F172A'

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          background: `linear-gradient(135deg, ${navy} 0%, #1E293B 50%, #334155 100%)`,
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top: brand lockup + accent bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="44" height="44" viewBox="0 0 130 130">
              <circle cx="80" cy="65" r="6" fill={accent} />
              <circle cx="95" cy="65" r="6" fill={accent} />
            </svg>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>
                Genn<span style={{ color: accent }}>oor</span> Tech
              </span>
              <span style={{ fontSize: 12, color: accent, letterSpacing: 3, marginTop: 2 }}>
                ACADEMY
              </span>
            </div>
          </div>
          <span
            style={{
              fontSize: 13,
              color: 'white',
              opacity: 0.7,
              border: `1px solid ${accent}`,
              padding: '6px 14px',
              borderRadius: 999,
              letterSpacing: 1.5,
            }}
          >
            FREE · SELF-PACED
          </span>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1, display: 'flex' }} />

        {/* Title + tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '900px' }}>
          <h1
            style={{
              fontSize: title.length > 36 ? 56 : 72,
              fontWeight: 800,
              color: accent,
              lineHeight: 1.05,
              margin: 0,
              marginBottom: 20,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 22,
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            {tagline}
          </p>
        </div>

        {/* Bottom: stats + URL */}
        <div
          style={{
            marginTop: 40,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 24,
          }}
        >
          <div style={{ display: 'flex', gap: 28, fontSize: 16, color: 'rgba(255,255,255,0.8)' }}>
            {duration && <span>⏱ {duration.replace(/^~/, '')}</span>}
            {level && <span>● {level}</span>}
            <span>📜 Free Certificate</span>
          </div>
          <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)' }}>gennoor.com</span>
        </div>
      </div>
    ),
    { ...size },
  )
}
