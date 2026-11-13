import Link from 'next/link'
import type { LmsCourse } from '@/lib/lms'
import type { ResumePoint } from '@/lib/lms-resume'
import ResumePanel from './ResumePanel'

/**
 * Shown when a learner opens the learn page without choosing a lesson (after
 * signing in, or from a bookmark). The course does not start by itself: they
 * pick up where they left off, start over, or go back to the lesson list.
 */
export default function ResumeGate({ course, point }: { course: LmsCourse; point: ResumePoint }) {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-[#0f1824] text-white px-4 sm:px-6 py-3 flex items-center gap-3 text-sm">
        <Link href={`/studio/${course.slug}`} className="text-[#8d9bb0] hover:text-white shrink-0 transition-colors">{course.code}</Link>
        <span className="text-[#4b5a70]">/</span>
        <span className="truncate font-medium">{course.title}</span>
      </div>
      <div className="max-w-xl mx-auto px-6 py-16 sm:py-24">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-gray-900">{course.title}</h1>
        <div className="mt-8">
          <ResumePanel slug={course.slug} point={point} />
        </div>
        <Link href={`/studio/${course.slug}`} className="inline-block mt-6 text-[14px] font-medium text-primary-600 hover:underline">
          See all lessons
        </Link>
      </div>
    </div>
  )
}
