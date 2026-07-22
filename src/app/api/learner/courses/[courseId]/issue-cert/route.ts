import { NextRequest, NextResponse } from 'next/server'
import { verifyLearnerSession } from '@/lib/learner-auth'
import { getCourseProgress } from '@/lib/azure-storage'
import { findCertificateByRecipient, buildVerifyUrl } from '@/lib/certificates'
import { issueCourseCertificate } from '@/lib/issue-course-cert'
import { courses as configCourses } from '@/config/courses'

export const dynamic = 'force-dynamic'

/**
 * Issue an academy course-completion certificate for the authenticated learner.
 *
 * Issuance is idempotent — if a certificate already exists for this learner
 * (email) + courseId pair, the existing certificate is returned.
 *
 * Completion is gated server-side: the learner must have completed === true
 * on the last regular (non-mock-exam) chapter of the course.
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  const { courseId } = await params

  const learner = await verifyLearnerSession()
  if (!learner) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const course = configCourses.find(c => c.id === courseId)
  if (!course) {
    return NextResponse.json({ error: 'Course not found' }, { status: 404 })
  }

  // Server-side completion gate — EVERY non-mock, non-intro chapter must be completed.
  // chapter-00 (intro screen, no audio) is excluded from the gate so cert issuance
  // doesn't depend on the learner explicitly visiting the welcome screen.
  const gatedChapters = course.chapters.filter(c => !c.isMockExam && c.id !== 'chapter-00')
  if (gatedChapters.length === 0) {
    return NextResponse.json({ error: 'Course has no chapters' }, { status: 500 })
  }

  const progressEntries = await getCourseProgress(learner.email, courseId)
  const incomplete = gatedChapters.filter(ch => {
    const p = progressEntries.find(e => e.chapterId === ch.id)
    return !p?.completed
  })
  if (incomplete.length > 0) {
    return NextResponse.json(
      {
        error: 'Course not yet complete',
        completed: false,
        incompleteChapters: incomplete.map(ch => ({ id: ch.id, title: ch.title, number: ch.number })),
        totalChapters: gatedChapters.length,
        completedChapters: gatedChapters.length - incomplete.length,
      },
      { status: 403 },
    )
  }

  const result = await issueCourseCertificate(courseId, {
    email: learner.email,
    name: learner.name,
  })

  if (result.alreadyIssued) {
    return NextResponse.json({
      cert: result.cert,
      verifyUrl: result.verifyUrl,
      issued: false,
      alreadyIssued: true,
    })
  }

  return NextResponse.json({
    cert: result.cert,
    verifyUrl: result.verifyUrl,
    issued: true,
    alreadyIssued: false,
    pdfReady: result.pdfReady,
  })
}

/**
 * GET — Look up existing cert (no issuance). Returns 404 if none exists.
 * Used by the celebration overlay to detect whether a cert was already
 * issued so it can route directly without re-issuing.
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

  const existing = await findCertificateByRecipient(courseId, learner.email)
  if (!existing) {
    return NextResponse.json({ error: 'No certificate found' }, { status: 404 })
  }

  return NextResponse.json({
    cert: existing,
    verifyUrl: buildVerifyUrl(existing.certId),
  })
}
