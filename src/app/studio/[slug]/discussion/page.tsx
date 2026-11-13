import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getLmsCourse } from '@/lib/lms'
import { hasFullAccess } from '@/lib/lms-access'
import AcademyBar from '@/components/academy/AcademyBar'
import SignInGate from '@/components/academy/SignInGate'
import Discussion from '@/components/academy/Discussion'

export const dynamic = 'force-dynamic'

interface PageProps { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getLmsCourse(slug)
  return { title: course ? `${course.code} discussion - Learning Studio` : 'Discussion', robots: { index: false, follow: false } }
}

export default async function CourseDiscussionPage({ params }: PageProps) {
  const { slug } = await params
  const course = await getLmsCourse(slug)
  if (!course) notFound()

  const learner = await verifyLearnerSession()
  if (!learner) return <SignInGate heading={`Sign in to join the ${course.code} discussion`} body="Ask questions and talk with other learners and the Gennoor team." />
  const enrolled = await hasFullAccess(learner.email, slug).catch(() => false)

  return (
    <main className="bg-surface min-h-screen">
      <AcademyBar section="Discussion" />
      <div className="max-w-[820px] mx-auto px-6 py-8 lg:py-10">
        <Link href={`/studio/${slug}`} className="text-sm text-gray-500 hover:text-gray-900">‹ {course.title}</Link>
        <h1 className="font-heading text-[clamp(28px,3.4vw,40px)] font-bold tracking-[-0.03em] text-gray-900 mt-4">Discussion</h1>
        <p className="text-gray-500 mt-2 mb-8">Ask a question, share what worked, or help another learner. The Gennoor team joins in too.</p>
        {enrolled ? (
          <Discussion scope={slug} emptyText="No topics yet. Start the first one." />
        ) : (
          <div className="rounded-2xl bg-gray-50 p-6">
            <p className="text-[15px] text-gray-900">Get the full course to join its discussion.</p>
            <Link href={`/studio/${slug}`} className="pill-primary inline-block mt-4">Go to the course</Link>
          </div>
        )}
      </div>
    </main>
  )
}
