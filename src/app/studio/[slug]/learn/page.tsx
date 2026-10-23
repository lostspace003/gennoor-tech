import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { flattenItems, getLmsCourse, getLmsProgress, isEnrolled, videoUrl } from '@/lib/lms'
import SignInGate from '@/components/academy/SignInGate'
import LmsPlayer from '@/components/academy/LmsPlayer'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ item?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getLmsCourse(slug)
  return { title: course ? `${course.title} - Learn` : 'Course', robots: { index: false, follow: false } }
}

export default async function LearnPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { item } = await searchParams
  const course = await getLmsCourse(slug)
  if (!course) notFound()

  const learner = await verifyLearnerSession()
  if (!learner) {
    return <SignInGate heading={`Sign in to learn ${course.code}`} body="The video lessons, labs and quizzes open after you sign in." />
  }
  if (!(await isEnrolled(learner.email, slug))) redirect(`/studio/${slug}`)

  const progress = await getLmsProgress(learner.email, slug)
  const items = flattenItems(course)
  // Pick up where this account left off - the lesson touched most recently,
  // on any browser or device (progress lives on the server, keyed by account).
  const last = items
    .map((i, n) => ({ i, n, at: progress[i.id]?.updatedAt || '' }))
    .filter(x => x.at)
    .sort((a, b) => b.at.localeCompare(a.at))[0]
  const resume = last ? (progress[last.i.id]?.done ? items[last.n + 1] ?? last.i : last.i) : items[0]
  const initial = items.find(i => i.id === item)?.id ?? resume.id

  return <LmsPlayer course={course} learnerEmail={learner.email} initialItem={initial} initialProgress={progress} congratsUrl={videoUrl(course, course.congrats)} />
}
