import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp-store'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 })
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
