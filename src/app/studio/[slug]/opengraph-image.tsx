import { ImageResponse } from 'next/og'
import { getLmsCourse, toCard } from '@/lib/lms'

// A stable, per-course share image (the stored thumbnails are signed links that expire).
export const alt = 'Gennoor Learning Studio course'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const KIND: Record<string, string> = { certification: 'Certification course', project: 'Project course', course: 'Course' }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getLmsCourse(slug).catch(() => undefined)
  const card = course ? toCard(course) : null
  const title = course?.title || 'Learning Studio'
  const meta = card ? [card.vendor, KIND[card.kind] || 'Course', card.level].filter(Boolean).join('  ·  ') : 'Gennoor Tech'
  const facts = course
    ? [`${course.stats.lectures} video lessons`, `${course.stats.quizzes} quizzes`, card?.hours ? `${card.hours} hours` : ''].filter(Boolean).join('   ·   ')
    : ''
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '64px 72px', color: 'white', background: 'linear-gradient(135deg,#0b1426 0%,#12306b 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, fontWeight: 700 }}>
          <div style={{ display: 'flex', width: 18, height: 18, borderRadius: 9, background: '#f59e0b' }} />
          <div style={{ display: 'flex', width: 18, height: 18, borderRadius: 9, background: '#6fa8ff' }} />
          <span style={{ marginLeft: 8 }}>Gennoor Tech · Learning Studio</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 28, color: '#a8c3ef', marginBottom: 20 }}>{meta}</div>
          <div style={{ display: 'flex', fontSize: title.length > 60 ? 54 : 66, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
          <div style={{ display: 'flex', fontSize: 30, color: '#cdd8eb', marginTop: 28 }}>{facts}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#a8c3ef' }}>gennoor.com/studio · Free with one sign-in</div>
      </div>
    ),
    { ...size },
  )
}
