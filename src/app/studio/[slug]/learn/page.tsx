import { notFound, redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { flattenItems, getLmsCourse, getLmsProgress, videoUrl } from '@/lib/lms'
import { hasFullAccess } from '@/lib/lms-access'
import SignInGate from '@/components/academy/SignInGate'
import LmsPlayer from '@/components/academy/LmsPlayer'
import ResumeGate from '@/components/academy/ResumeGate'
import { resumePoint } from '@/lib/lms-resume'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ item?: string; resume?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const course = await getLmsCourse(slug)
  return { title: course ? `${course.title} - Learn` : 'Course', robots: { index: false, follow: false } }
}

export default async function LearnPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { item, resume } = await searchParams
  const course = await getLmsCourse(slug)
  if (!course) notFound()

  const learner = await verifyLearnerSession()
  if (!learner) {
    return <SignInGate heading={`Sign in to learn ${course.code}`} body="The video lessons, labs and quizzes open after you sign in." />
  }
  // The full player is for people who own the course. Everyone else goes to the course page,
  // where the preview lessons play and the course can be bought.
  if (!(await hasFullAccess(learner.email, slug))) redirect(`/studio/${slug}`)

  const progress = await getLmsProgress(learner.email, slug)
  const items = flattenItems(course)
  const point = resumePoint(course, progress)

  // Opened without choosing a lesson (after signing in, from a bookmark): never start playing by itself.
  // Someone who has already watched part of the course is asked whether to resume.
  if (!item && point.kind !== 'start') return <ResumeGate course={course} point={point} />

  const initial = items.find(i => i.id === item)?.id ?? items[0].id

  // Every lesson opens paused and from its first second. Only the Resume button (?resume=1) goes back to where the learner stopped.
  return <LmsPlayer course={course} learnerEmail={learner.email} initialItem={initial} initialProgress={progress} resumeSaved={resume === '1'} congratsUrl={videoUrl(course, course.congrats)} />
}
