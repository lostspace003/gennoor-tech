import { NextResponse } from 'next/server'
import { verifyLearnerSession, type LearnerPayload } from '@/lib/learner-auth'
import { getLmsCourse, isEnrolled, type LmsCourse } from '@/lib/lms'

type Ok = { learner: LearnerPayload; course: LmsCourse }

/** Sign-in + enrollment gate shared by every LMS endpoint. */
export async function requireEnrolled(slug: string | null): Promise<Ok | NextResponse> {
  const learner = await verifyLearnerSession()
  if (!learner) return NextResponse.json({ error: 'Sign in required' }, { status: 401 })
  const course = slug ? await getLmsCourse(slug) : undefined
  if (!course) return NextResponse.json({ error: 'Unknown course' }, { status: 404 })
  if (!(await isEnrolled(learner.email, course.slug))) {
    return NextResponse.json({ error: 'Enroll in this course first' }, { status: 403 })
  }
  return { learner, course }
}

export const noStore = { 'Cache-Control': 'private, no-store' }
