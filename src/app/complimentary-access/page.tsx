import { BookOpen, KeyRound, MailCheck } from 'lucide-react'
import { pageMeta } from '@/lib/seo'
import { courseChoices } from '@/lib/complimentary'
import ComplimentaryForm from '@/components/ComplimentaryForm'
import { Ico } from '@/components/stage/Ico'

export const dynamic = 'force-dynamic'

export const metadata = pageMeta({
  title: 'Complimentary access to the Learning Studio',
  description: 'Ask for complimentary access to up to two Learning Studio courses. Choose the courses, and we email a code for each.',
  path: '/complimentary-access',
})

export default async function ComplimentaryAccessPage() {
  const courses = await courseChoices().catch(() => [])
  const steps = [
    { icon: BookOpen, title: 'Choose up to two courses', body: 'Open any course first to see what is inside.' },
    { icon: MailCheck, title: 'We look at your request', body: 'Usually within one working day.' },
    { icon: KeyRound, title: 'A code for each course', body: 'Full access, not a preview, with nothing to pay.' },
  ]
  return (
    <div className="mx-auto max-w-[1120px] px-4 sm:px-6 py-10 lg:py-14">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] items-start">
        <div>
          <p className="st-kicker">Learning Studio</p>
          <h1 className="display-section mt-2 text-gray-900">Complimentary access</h1>
          <p className="lede mt-3 text-gray-600">Try a Learning Studio course in full before you decide anything. Tell us who you are and which courses you would like, and we email you a code for each.</p>
          <ul className="mt-6 space-y-4">
            {steps.map((s) => (
              <li key={s.title} className="flex gap-3">
                <Ico icon={s.icon} tone="blue" size={40} />
                <span><span className="block font-semibold text-gray-900">{s.title}</span><span className="block text-sm text-gray-600">{s.body}</span></span>
              </li>
            ))}
          </ul>
        </div>
        <ComplimentaryForm courses={courses} />
      </div>
    </div>
  )
}
