import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { saveCourseFeedback, getCourseFeedback } from '@/lib/course-feedback'
import { findCertificateByRecipient } from '@/lib/certificates'

export const dynamic = 'force-dynamic'

/**
 * Submit course-completion feedback. Requires the learner to have a cert
 * issued for the course — feedback is keyed on (courseId, certId).
 *
 * Body: { rating: 1-5, comments?: string }
 *
 * Resubmission overwrites the previous entry so a learner can refine their
 * rating after thinking about it.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params

  const learner = await verifyLearnerSession()
  if (!learner) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  let body: { rating?: number; comments?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const rating = Number(body.rating)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: 'rating must be an integer between 1 and 5' },
      { status: 400 },
    )
  }
  const comments = typeof body.comments === 'string' ? body.comments.slice(0, 4000) : undefined

  // Feedback is tied to a cert — find the learner's issued cert for this course.
  const cert = await findCertificateByRecipient(courseId, learner.email)
  if (!cert) {
    return NextResponse.json(
      { error: 'No issued certificate found for this course — complete the course first.' },
      { status: 403 },
    )
  }

  const saved = await saveCourseFeedback({
    courseId,
    certId: cert.certId,
    learnerEmail: learner.email,
    learnerName: cert.recipientName,
    rating,
    comments,
  })

  return NextResponse.json({
    ok: true,
    feedback: {
      courseId: saved.courseId,
      certId: saved.certId,
      rating: saved.rating,
      comments: saved.comments,
      createdAt: saved.createdAt,
    },
  })
}

/**
 * Fetch the learner's previously-submitted feedback for a course (if any).
 * Used to pre-populate the form if they return to the completion screen.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params

  const learner = await verifyLearnerSession()
  if (!learner) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const cert = await findCertificateByRecipient(courseId, learner.email)
  if (!cert) {
    return NextResponse.json({ feedback: null }, { status: 200 })
  }

  const existing = await getCourseFeedback(courseId, cert.certId)
  return NextResponse.json({
    feedback: existing
      ? {
          courseId: existing.courseId,
          certId: existing.certId,
          rating: existing.rating,
          comments: existing.comments,
          createdAt: existing.createdAt,
        }
      : null,
  })
}
