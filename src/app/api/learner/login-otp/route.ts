import { NextRequest, NextResponse } from 'next/server'
import { isEmailVerified, clearVerification } from '@/lib/otp-store'
import { createLearnerToken, learnerCookieOptions } from '@/lib/learner-auth'
import { saveLearner, getLearner } from '@/lib/azure-storage'
import { sendAcademyWelcomeEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!isEmailVerified(email)) {
      return NextResponse.json({ error: 'Email not verified. Please complete OTP verification first.' }, { status: 401 })
    }

    const displayName = name || email.split('@')[0]
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
    response.cookies.set(learnerCookieOptions(token))
    return response
  } catch {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
