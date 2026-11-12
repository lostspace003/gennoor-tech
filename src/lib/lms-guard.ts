import { NextResponse } from 'next/server'
import { verifyLearnerSession, type LearnerPayload } from '@/lib/learner-auth'
import { getLmsCourse, type LmsCourse } from '@/lib/lms'
import { hasFullAccess, isPreview } from '@/lib/lms-access'

type Ok = { learner: LearnerPayload; course: LmsCourse }

/**
 * The gate shared by every Learning Studio endpoint that needs the whole course:
 * signed in, and either bought the course or (for a free course) enrolled.
 * The name is kept from when every course was free.
 */
export async function requireEnrolled(slug: string | null): Promise<Ok | NextResponse> {
  const learner = await verifyLearnerSession()
  if (!learner) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const course = slug ? await getLmsCourse(slug) : undefined
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  if (!(await hasFullAccess(learner.email, course.slug))) {
    return NextResponse.json({ error: 'Buy this course to open the full content', needsPurchase: true }, { status: 403 })
  }
  return { learner, course }
}

/**
 * The gate for one lesson's video and captions. A preview lesson is open to
 * anyone, signed in or not. Every other lesson needs full access.
 * `learner` is null for an anonymous preview.
 */
export async function requireLesson(slug: string | null, itemId: string): Promise<{ learner: LearnerPayload | null; course: LmsCourse } | NextResponse> {
  const course = slug ? await getLmsCourse(slug) : undefined
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  const learner = await verifyLearnerSession()
  if (isPreview(course, itemId)) return { learner, course }
  if (!learner) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  if (!(await hasFullAccess(learner.email, course.slug))) {
    return NextResponse.json({ error: 'Buy this course to open the full content', needsPurchase: true }, { status: 403 })
  }
  return { learner, course }
}

export const noStore = { 'Cache-Control': 'private, no-store' }
