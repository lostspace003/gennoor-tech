import { NextRequest, NextResponse } from 'next/server'
import { isEmailVerified, clearVerification } from '@/lib/otp-store'
import { createLearnerToken, learnerCookieOptions, isReservedAdminEmail } from '@/lib/learner-auth'
import { saveLearner, getLearner } from '@/lib/azure-storage'
import { sendAcademyWelcomeEmail } from '@/lib/email-service'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { hasOtpProof, clearOtpProof } from '@/lib/otp-proof'
import { plainField } from '@/lib/plain-text'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!rateLimit(`learner-login-otp:${clientIp(request.headers)}`, 20, 10 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 })
    }

    if (isReservedAdminEmail(email)) return NextResponse.json({ error: 'This address signs in with Microsoft only.' }, { status: 403 })

    // Two things, both: the code for this address was right, AND this is the browser that typed it. The first
    // alone is true for everyone for thirty minutes, so on its own it let a stranger who only knew the address
    // sign in as that person (src/lib/otp-proof.ts).
    if (!isEmailVerified(email) || !(await hasOtpProof(email))) {
      return NextResponse.json({ error: 'Email not verified. Please complete OTP verification first.' }, { status: 401 })
    }

    const displayName = plainField(body.name, 80) || email.split('@')[0]
    const isNewLearner = !(await getLearner(email))
    await saveLearner({ email, name: displayName, provider: 'otp' })
    clearVerification(email)

    // First-ever sign-in: send a one-time welcome email with the catalog attached.
    if (isNewLearner) {
      sendAcademyWelcomeEmail({ name: displayName, email }).catch(err =>
        console.error('Academy welcome email failed:', err),
      )
    }

    const token = await createLearnerToken({ email, name: displayName, provider: 'otp' })
    const response = NextResponse.json({ success: true, name: displayName, email })
    response.cookies.set(learnerCookieOptions(token, request))
    clearOtpProof(response)
    return response
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
