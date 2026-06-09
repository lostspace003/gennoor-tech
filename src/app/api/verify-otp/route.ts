import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp-store'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
    }

    if (!rateLimit(`otp-verify:${clientIp(request.headers)}`, 20, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait a few minutes and try again.' },
        { status: 429 },
      )
    }

    const valid = verifyOTP(email, otp)

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please try again.' },
        { status: 400 },
      )
    }

    return NextResponse.json({ success: true, verified: true })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 },
    )
  }
}
