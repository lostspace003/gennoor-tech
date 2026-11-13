import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

// The pages under this one (a course, a chapter) write their own: see their generateMetadata.
export const metadata: Metadata = pageMeta({
  forLayout: true,
  title: 'AI Essentials - Interactive AI courses',
  description: 'AI courses for every role — technical, business, HR, or any domain. Interactive courses plus full video certification courses with labs and quizzes. No prior technical knowledge needed.',
  path: '/ai-academy',
  image: 'ai-essentials',
})

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
