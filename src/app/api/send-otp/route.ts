import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, storeOTP } from '@/lib/otp-store'
import { sendEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const otp = generateOTP()
    storeOTP(email, otp)

    // Send OTP email
    await sendEmail({
      to: email,
      from: process.env.SMTP_USER || 'jalalkhan@gennoor.com',
      fromName: 'Gennoor Tech',
      subject: `${otp} is your verification code`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#2563eb;font-size:22px;margin:0 0 4px;">Gennoor Tech</h1>
            <p style="color:#64748b;font-size:12px;margin:0;">Email Verification</p>
          </div>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;">
            <p style="color:#334155;font-size:14px;margin:0 0 16px;">Your verification code is:</p>
            <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1e293b;padding:12px 0;">
              ${otp}
            </div>
            <p style="color:#94a3b8;font-size:12px;margin:16px 0 0;">This code expires in 5 minutes.</p>
          </div>
          <p style="color:#94a3b8;font-size:11px;text-align:center;margin-top:20px;">
            If you didn&apos;t request this code, you can safely ignore this email.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true, message: 'OTP sent' })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 },
    )
  }
}
