import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp-store'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { saveLearner, saveCourseProgress } from '@/lib/azure-storage'
import { issueCourseCertificate } from '@/lib/issue-course-cert'
import { getCourseById } from '@/config/courses'

export const dynamic = 'force-dynamic'

interface ClaimChapterProgress {
  completed?: boolean
  completionPercent?: number
  currentSlide?: number
  totalSlides?: number
}

/**
 * No-login certificate claim.
 *
 * The learner proves ownership of an email address via OTP (same store as
 * /api/send-otp + /api/verify-otp — verified here server-side in one shot),
 * submits their device-local progress, and receives the same certificate the
 * legacy logged-in issue-cert flow produces.
 *
 * Progress is client-reported (localStorage), so the gate here is honesty-based
 * — same trust level as the free courses themselves. Learner + progress rows
 * are persisted so admin metrics keep flowing.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params

    if (!rateLimit(`claim-cert:${clientIp(request.headers)}`, 10, 15 * 60_000)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a few minutes and try again.' },
        { status: 429 },
      )
    }

    let body: { name?: unknown; email?: unknown; otp?: unknown; progress?: unknown }
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const otp = typeof body.otp === 'string' ? body.otp.trim() : ''

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (name.length < 2 || name.length > 100) {
      return NextResponse.json(
        { error: 'Please enter your full name (2-100 characters).' },
        { status: 400 },
      )
    }
    if (!otp) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 })
    }

    // One-shot server-side OTP verification (same store /api/verify-otp uses).
    if (!verifyOTP(email, otp)) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please try again.' },
        { status: 400 },
      )
    }

    const course = getCourseById(courseId)
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const progress = (
      body.progress && typeof body.progress === 'object' ? body.progress : {}
    ) as Record<string, ClaimChapterProgress>

    // Completion gate — every non-mock chapter except the intro must be
    // reported completed in the payload.
    const gatedChapters = course.chapters.filter(c => !c.isMockExam && c.id !== 'chapter-00')
    if (gatedChapters.length === 0) {
      return NextResponse.json({ error: 'Course has no chapters' }, { status: 500 })
    }
    const allCompleted = gatedChapters.every(ch => progress[ch.id]?.completed === true)
    if (!allCompleted) {
      return NextResponse.json({ error: 'Course not completed yet' }, { status: 403 })
    }

    // Persist learner + progress rows so admin metrics keep flowing.
    await saveLearner({ email, name, provider: 'otp' })

    const idOk = (s: string) => /^[a-z0-9][a-z0-9-]{0,80}$/i.test(s)
    const clampPct = (n: unknown) => Math.max(0, Math.min(100, Number(n) || 0))
    for (const [chapterId, ch] of Object.entries(progress)) {
      if (!idOk(chapterId) || !ch || typeof ch !== 'object') continue
      const pct = clampPct(ch.completionPercent)
      await saveCourseProgress({
        email,
        courseId,
        chapterId,
        currentSlide: Math.max(0, Number(ch.currentSlide) || 0),
        totalSlides: Math.max(0, Number(ch.totalSlides) || 0),
        completionPercent: pct,
        completed: ch.completed === true || pct >= 95,
      })
    }

    const result = await issueCourseCertificate(courseId, { email, name })

    return NextResponse.json({
      cert: result.cert,
      verifyUrl: result.verifyUrl,
    })
  } catch (error) {
    console.error('Claim cert error:', error)
    return NextResponse.json({ error: 'Failed to issue certificate' }, { status: 500 })
  }
}
