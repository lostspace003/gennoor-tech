import { NextRequest, NextResponse } from 'next/server'
import { createLearnerToken, learnerCookieOptions } from '@/lib/learner-auth'
import { getLearner, updateLearnerFields, resolveLearnerEmail } from '@/lib/azure-storage'
import { verifyPassword } from '@/lib/learner-password'
import { rateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Password sign-in with either handle: the learner's email address OR their
 * username, for anyone who has forgotten which address they signed up with.
 * OTP remains the always-available fallback.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`learner-login-pw:${ip}`, 10, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
    }

    const body = await request.json()
    // `email` is still accepted so existing callers keep working.
    const identifier = String(body.identifier || body.email || '').trim()
    const password = body.password
    if (!identifier || !password) {
      return NextResponse.json({ error: 'Email or username and password are required.' }, { status: 400 })
    }

    // Identical message however the attempt fails — unknown username, unknown
    // email, no password set, or wrong password — so none of those states can
    // be told apart from outside. The OTP hint is safe: it is always true.
    const wrong = NextResponse.json(
      { error: 'Incorrect email/username or password. You can always sign in with an email code instead.' },
      { status: 401 },
    )

    const email = await resolveLearnerEmail(identifier)
    if (!email) return wrong

    const learner = await getLearner(email)
    const hash = learner?.passwordHash as string | undefined
    if (!learner || !hash) return wrong

    const ok = await verifyPassword(password, hash)
    if (!ok) return wrong

    const name = (learner.name as string) || email.split('@')[0]
    await updateLearnerFields(email, { lastLogin: new Date().toISOString() })
    const token = await createLearnerToken({ email: email.toLowerCase().trim(), name, provider: 'password' })
    const response = NextResponse.json({ success: true, name, email })
    response.cookies.set(learnerCookieOptions(token))
    return response
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
