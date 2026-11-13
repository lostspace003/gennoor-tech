import { BadgeCheck, BookOpen, ClipboardCheck, FlaskConical, Hammer, Play } from 'lucide-react'
import { getLmsCourse, toCard } from '@/lib/lms'
import { ogImageResponse, OG_SIZE } from '@/lib/og-card'
import type { Tone } from '@/components/stage/Ico'

// The picture a link to a course shows when it is shared: the same light card as the rest of
// the site (src/lib/og-card.tsx), with the course's own title and figures. It is drawn here
// and not taken from the course's thumbnail, because the stored thumbnails are signed links
// that expire.
export const alt = 'Gennoor Learning Studio course'
export const size = OG_SIZE
export const contentType = 'image/jpeg'

const KIND: Record<string, string> = { certification: 'Certification course', project: 'Project course', course: 'Course' }

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = await getLmsCourse(slug).catch(() => undefined)
  const card = course ? toCard(course) : null
  const kind = card?.kind || 'course'
  // gold: something earned (a certification). violet: something built (a project). blue: something to watch.
  const tone: Tone = kind === 'certification' ? 'gold' : kind === 'project' ? 'violet' : 'blue'
  const facts = course
    ? [`${course.stats.lectures} video lessons`, course.stats.quizzes ? `${course.stats.quizzes} quizzes` : '', card?.hours ? `${card.hours} hours of video` : ''].filter(Boolean).join(', ')
    : ''
  return ogImageResponse({
    kicker: card ? [KIND[card.kind] || 'Course', card.vendor, card.level].filter(Boolean).join(', ') : 'Learning Studio',
    title: course?.title || 'Learning Studio',
    line: facts ? `${facts}.` : undefined,
    foot: 'gennoor.com/studio',
    icon: kind === 'certification' ? BadgeCheck : kind === 'project' ? Hammer : BookOpen,
    tone,
    beside: [
      { icon: Play, tone: tone === 'blue' ? 'cyan' : 'blue' },
      { icon: kind === 'project' ? ClipboardCheck : FlaskConical, tone: tone === 'violet' ? 'rose' : 'violet' },
    ],
  })
}
