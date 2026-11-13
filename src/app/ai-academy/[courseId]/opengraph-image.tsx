import { ClipboardCheck, Lightbulb, MousePointerClick } from 'lucide-react'
import { getCourseById } from '@/config/courses'
import { ogImageResponse, OG_SIZE } from '@/lib/og-card'

// The picture a link to an AI Essentials course (or one of its chapters) shows when it is shared:
// the same light card as the rest of the site (src/lib/og-card.tsx), with the course's own title.
export const alt = 'AI Essentials course'
export const size = OG_SIZE
export const contentType = 'image/jpeg'

export default async function CourseOgImage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const course = getCourseById(courseId)
  return ogImageResponse({
    kicker: ['AI Essentials', course?.duration?.replace(/^~/, ''), course?.level].filter(Boolean).join(', '),
    title: course?.title ?? 'Interactive AI courses for every role',
    line: course?.description,
    foot: 'gennoor.com/ai-academy',
    icon: Lightbulb,
    tone: 'blue',
    beside: [{ icon: MousePointerClick, tone: 'violet' }, { icon: ClipboardCheck, tone: 'rose' }],
  })
}
