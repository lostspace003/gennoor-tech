import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP, clearVerification } from '@/lib/otp-store'
import { updateLearnerFields, getLearner } from '@/lib/azure-storage'
import { hashPassword, passwordProblem } from '@/lib/learner-password'
import { rateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Forgot-password completion: the learner requests a code through the
 * standard /api/send-otp route, then submits { email, otp, newPassword }
 * here. The OTP proves mailbox ownership, so no old password is needed.
 * Works even for accounts that never had a password (it simply sets one).
 */
export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`learner-reset-pw:${ip}`, 8, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
    }

    const { email, otp, newPassword } = await request.json()
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and code are required.' }, { status: 400 })
    }
    const problem = passwordProblem(newPassword)
    if (problem) return NextResponse.json({ error: problem }, { status: 400 })

    if (!verifyOTP(email, otp)) {
      return NextResponse.json({ error: 'Invalid or expired code.' }, { status: 401 })
    }
    clearVerification(email)

    const existing = await getLearner(email)
    await updateLearnerFields(email, {
      name: (existing?.name as string) || email.split('@')[0],
      provider: (existing?.provider as string) || 'otp',
      passwordHash: await hashPassword(newPassword),
      passwordUpdatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Could not reset password' }, { status: 500 })
  }
}
