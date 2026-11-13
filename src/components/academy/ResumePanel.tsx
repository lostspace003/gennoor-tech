import Link from 'next/link'
import { formatTime, type ResumePoint } from '@/lib/lms-resume'

/**
 * "Welcome back": a quiet panel on the course page. Nothing plays until the
 * learner chooses. `dark` is for the dark course hero.
 */
export default function ResumePanel({ slug, point, dark = false }: { slug: string; point: ResumePoint; dark?: boolean }) {
  const learn = (id: string, resume = false) => `/studio/${slug}/learn?item=${id}${resume ? '&resume=1' : ''}`
  const complete = point.kind === 'complete'

  return (
    <div className={`rounded-2xl p-5 max-w-md ${dark ? 'bg-white/[0.07] ring-1 ring-white/15' : 'bg-raised ring-1 ring-gray-200'}`}>
      <p className={`text-[13px] ${dark ? 'text-[#a9b4c4]' : 'text-gray-500'}`}>
        {complete ? 'You have finished this course' : `Welcome back, ${point.percent}% complete`}
      </p>
      {!complete && (
        <>
          <p className={`mt-2 text-[16px] font-semibold leading-snug ${dark ? 'text-white' : 'text-gray-900'}`}>{point.item.title}</p>
          <p className={`mt-1 text-[13px] tabular-nums ${dark ? 'text-[#a9b4c4]' : 'text-gray-500'}`}>
            {point.positionSec > 5 ? `You stopped at ${formatTime(point.positionSec)}` : 'Your next lesson'}
          </p>
        </>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        {!complete && (
          <Link href={learn(point.item.id, true)} className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold transition-colors">
            Resume
          </Link>
        )}
        <Link href={learn(point.first.id)} className={`text-[14px] font-medium hover:underline ${dark ? 'text-primary-300' : 'text-primary-600'}`}>
          {complete ? 'Watch again from the start' : 'Start from the beginning'}
        </Link>
      </div>
    </div>
  )
}
