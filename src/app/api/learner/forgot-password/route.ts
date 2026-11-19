import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, storeOTP } from '@/lib/otp-store'
import { sendEmail } from '@/lib/email-service'
import { emailTop } from '@/lib/crm/email-theme'
import { resolveLearnerEmail, getLearner } from '@/lib/azure-storage'
import { looksLikeEmail, maskEmail } from '@/lib/learner-username'
import { rateLimit, clientIp } from '@/lib/rate-limit'

/**
 * Start of the forgot-password flow.
 *
 * Takes whichever handle the learner still remembers — their email address OR
 * their username — resolves it to the address on file, and mails a one-time
 * code there. The response carries only a masked address, so a stranger
 * probing usernames learns nothing they could use.
 */
export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`learner-forgot-pw-ip:${ip}`, 10, 30 * 60_000)) {
      return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes.' }, { status: 429 })
    }

    const { identifier } = await request.json()
    const handle = String(identifier || '').trim()
    if (!handle) {
      return NextResponse.json({ error: 'Enter your email address or username.' }, { status: 400 })
    }

    const email = await resolveLearnerEmail(handle)

    // An unknown username is the one case we answer plainly: there is no
    // mailbox to send a code to, and no account is disclosed by saying so.
    if (!email) {
      return NextResponse.json(
        { error: "We don't recognise that username. Try your email address instead." },
        { status: 404 },
      )
    }
    if (!looksLikeEmail(email)) {
      return NextResponse.json({ error: 'Enter a valid email address or username.' }, { status: 400 })
    }

    // Per-mailbox throttle on top of the per-IP one, so this route can't be
    // used to bomb an inbox or burn ACS quota.
    if (!rateLimit(`otp-send:${email}`, 3, 15 * 60 * 1000) || !rateLimit(`otp-send-day:${email}`, 12, 24 * 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many codes requested. Please wait a few minutes and try again.' },
        { status: 429 },
      )
    }

    // Sending a code to an address with no learner record would be a way to
    // enumerate accounts by email, so unknown addresses get the same shape of
    // success response without any mail going out.
    const record = await getLearner(email)
    if (record) {
      const otp = generateOTP()
      storeOTP(email, otp)
      await sendEmail({
        to: email,
        from: process.env.EMAIL_FROM_SUPPORT || process.env.EMAIL_FROM_INFO || 'support@gennoor.com',
        fromName: 'Gennoor Academy',
        subject: `${otp} is your password reset code`,
        html: `
          <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
            <div style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:14px;">${emailTop()}</div>
            <p style="color:#64748b;font-size:12px;margin:0 0 14px;text-align:center;">Gennoor Academy: password reset</p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;">
              <p style="color:#334155;font-size:14px;margin:0 0 16px;">Enter this code to choose a new password:</p>
              <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#1e293b;padding:12px 0;">${otp}</div>
              <p style="color:#94a3b8;font-size:12px;margin:16px 0 0;">This code expires in 5 minutes.</p>
            </div>
            <p style="color:#94a3b8;font-size:11px;text-align:center;margin-top:20px;">
              Didn&apos;t ask for this? Ignore this email — your password stays unchanged.
            </p>
          </div>`,
      })
    }

    return NextResponse.json({ success: true, maskedEmail: maskEmail(email) })
  } catch (error) {
    console.error('Forgot-password start error:', error)
    return NextResponse.json({ error: 'Could not send the code. Please try again.' }, { status: 500 })
  }
}
