import type { Metadata } from 'next'
import Link from 'next/link'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getEnrollments, listLmsCourses } from '@/lib/lms'
import AcademyBar from '@/components/academy/AcademyBar'
import SignInGate from '@/components/academy/SignInGate'
import Discussion from '@/components/academy/Discussion'
import { COMMUNITY_SCOPE } from '@/lib/lms-community'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Community - Learning Studio',
  description: 'Talk with other learners and the Gennoor team.',
  robots: { index: false, follow: false },
}

export default async function CommunityPage() {
  const learner = await verifyLearnerSession()
  if (!learner) return <SignInGate heading="Sign in to join the community" body="Talk with other learners and the Gennoor team about AI, your courses and your projects." />

  const enrolled = await getEnrollments(learner.email).catch(() => ({} as Record<string, string>))
  const mine = (await listLmsCourses()).filter(c => c.slug in enrolled)

  return (
    <main className="bg-white min-h-screen">
      <AcademyBar section="Community" />
      <div className="max-w-[820px] mx-auto px-6 py-12 lg:py-16">
        <h1 className="font-heading text-[clamp(28px,3.4vw,40px)] font-bold tracking-[-0.03em] text-gray-900">Community</h1>
        <p className="text-[#6e6e73] mt-2">Talk with other learners and the Gennoor team about AI, your courses and your projects.</p>

        {mine.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {mine.map(c => (
              <Link key={c.slug} href={`/studio/${c.slug}/discussion`} className="px-3.5 py-1.5 rounded-full bg-[#f5f5f7] text-[13.5px] font-medium text-gray-800 hover:bg-primary-50 hover:text-primary-700 transition-colors">
                {c.code} discussion
              </Link>
            ))}
          </div>
        )}

        <div className="mt-10">
          <Discussion scope={COMMUNITY_SCOPE} emptyText="No topics yet. Start the first one." />
        </div>
      </div>
    </main>
  )
}
