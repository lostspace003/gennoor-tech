import { NextRequest, NextResponse } from 'next/server'
import { createLearnerToken, learnerCookieOptions } from '@/lib/learner-auth'
import { getLearner, updateLearnerFields } from '@/lib/azure-storage'
import { verifyPassword } from '@/lib/learner-password'
import { rateLimit, clientIp } from '@/lib/rate-limit'

/** Email + password sign-in. OTP remains the always-available fallback. */
export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`learner-login-pw:${ip}`, 10, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
    }

    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }

    const learner = await getLearner(email)
    const hash = learner?.passwordHash as string | undefined
    if (!learner || !hash) {
      // Identical message whether the account or the password is missing —
      // no account enumeration. The hint about OTP is safe: it applies to
      // every email address.
      return NextResponse.json(
        { error: 'Incorrect email or password. You can always sign in with an email code instead.' },
        { status: 401 }
      )
    }

    const ok = await verifyPassword(password, hash)
    if (!ok) {
      return NextResponse.json(
        { error: 'Incorrect email or password. You can always sign in with an email code instead.' },
        { status: 401 }
      )
    }

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
