import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP, clearVerification } from '@/lib/otp-store'
import { updateLearnerFields, getLearner, resolveLearnerEmail } from '@/lib/azure-storage'
import { hashPassword, passwordProblem } from '@/lib/learner-password'
import { rateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Forgot-password completion: the learner requests a code through
 * /api/learner/forgot-password (which accepts an email OR a username), then
 * submits { identifier, otp, newPassword } here. The OTP proves mailbox
 * ownership, so no old password is needed. Works even for accounts that never
 * had a password — it simply sets one.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`learner-reset-pw:${ip}`, 8, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
    }

    const body = await request.json()
    // `email` is still accepted so existing callers keep working.
    const identifier = String(body.identifier || body.email || '').trim()
    const { otp, newPassword } = body
    if (!identifier || !otp) {
      return NextResponse.json({ error: 'Email or username and code are required.' }, { status: 400 })
    }
    const problem = passwordProblem(newPassword)
    if (problem) return NextResponse.json({ error: problem }, { status: 400 })

    // The code was mailed to the address the identifier resolves to, so the
    // reset must verify against that same address.
    const email = await resolveLearnerEmail(identifier)
    if (!email || !verifyOTP(email, otp)) {
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

    return NextResponse.json({ success: true, email })
  } catch {
    return NextResponse.json({ error: 'Could not reset password' }, { status: 500 })
  }
}
