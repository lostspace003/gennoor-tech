import { NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'
import { emailTop } from '@/lib/crm/email-theme'
import { saveEnquiry } from '@/lib/azure-storage'
import { rateLimit, clientIp } from '@/lib/rate-limit'
import { escapeHtml } from '@/lib/escape-html'

/**
 * Webinar / live-workshop registration.
 *
 * Flow: rate-limit → validate → persist to Azure Table Storage
 * ('WebinarRegistration') → confirmation email to the attendee from
 * EMAIL_FROM_WEBINAR → notification to EMAIL_ADMIN. The joining link is
 * sent separately closer to the session (manual or follow-up automation).
 *
 * Payload: { name, email, company?, webinarId, webinarTitle, webinarDate }
 */
export async function POST(request: Request) {
  try {
    const ip = clientIp(request.headers)
    if (!rateLimit(`webinar-register:${ip}`, 5, 10 * 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const { name, email, company, webinarId, webinarTitle, webinarDate } = body

    if (!name || !email || !webinarId || !webinarTitle) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      )
    }
    // One real address, and short plain fields: the confirmation goes to `email` with the title in its subject,
    // so a list of addresses and a title of the sender's own wording must never get this far
    const short = (v: unknown, max: number) => v === undefined || v === null || (typeof v === 'string' && v.length <= max)
    if (typeof email !== 'string' || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || typeof name !== 'string' || name.length > 120 || !short(company, 160) || !short(webinarId, 120)
      || typeof webinarTitle !== 'string' || webinarTitle.length > 160 || /https?:|www\.|[\r\n]/i.test(webinarTitle)
      || !short(webinarDate, 80) || /https?:|www\.|[\r\n]/i.test(String(webinarDate || ''))) {
      return NextResponse.json({ success: false, message: 'Please check the form and try again.' }, { status: 400 })
    }

    await saveEnquiry('WebinarRegistration', {
      name,
      email,
      company: company || '',
      webinarId,
      webinarTitle,
      webinarDate: webinarDate || '',
    })

    const firstName = escapeHtml(String(name).split(' ')[0])
    const safeTitle = escapeHtml(webinarTitle)
    const safeDate = escapeHtml(webinarDate || 'date to be confirmed')

    const userEmailHtml = `
      <div style="font-family: system-ui, 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1d1d1f;">
        <div style="background:#ffffff;border:1px solid #e8e8ed;border-bottom:0;border-radius:12px 12px 0 0;overflow:hidden">${emailTop("You're registered", 'Free session')}</div>
        <div style="padding: 36px 30px; background: #ffffff; border: 1px solid #e8e8ed; border-top: none;">
          <p style="font-size: 16px; margin: 0 0 16px;">Hi ${firstName},</p>
          <p style="color: #6e6e73; line-height: 1.7; font-size: 15px; margin: 0 0 20px;">
            You're confirmed for <strong style="color:#1d1d1f">${safeTitle}</strong> (${safeDate}).
          </p>
          <div style="background: #f5f5f7; border-radius: 12px; padding: 18px 20px; margin: 0 0 20px;">
            <p style="margin: 0; font-size: 14px; color: #1d1d1f; line-height: 1.7;">
              The joining link and calendar invite will arrive in a separate
              email before the session. Recordings go to our
              <a href="https://www.youtube.com/@GennoorTech" style="color:#0071e3; text-decoration:none;">YouTube channel</a>
              if you can't make it live.
            </p>
          </div>
          <p style="color: #6e6e73; line-height: 1.7; font-size: 14px; margin: 0;">
            Questions? Just reply to this email.<br/><br/>
            — The Gennoor Team<br/>
            <a href="https://gennoor.com/webinars" style="color:#0071e3; text-decoration:none;">gennoor.com/webinars</a>
          </p>
        </div>
        <div style="background: #f5f5f7; padding: 18px; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e8e8ed; border-top: none;">
          <p style="color: #86868b; margin: 0; font-size: 12px;">© ${new Date().getFullYear()} Gennoor Tech. Free session · no upsell.</p>
        </div>
      </div>
    `

    await sendEmail({
      to: email,
      from: process.env.EMAIL_FROM_WEBINAR || 'webinar@gennoor.com',
      fromName: 'Gennoor Tech Webinars',
      subject: `You're registered — ${webinarTitle}`,
      html: userEmailHtml,
    })

    const adminEmailHtml = `
      <h2>New webinar registration</h2>
      <table role="presentation" border="1" cellpadding="8" style="border-collapse: collapse; font-family: Arial, sans-serif;">
        <tr><td><strong>Session:</strong></td><td>${safeTitle} (${escapeHtml(webinarId)})</td></tr>
        <tr><td><strong>Date:</strong></td><td>${safeDate}</td></tr>
        <tr><td><strong>Name:</strong></td><td>${escapeHtml(name)}</td></tr>
        <tr><td><strong>Email:</strong></td><td>${escapeHtml(email)}</td></tr>
        <tr><td><strong>Company:</strong></td><td>${escapeHtml(company) || 'Not provided'}</td></tr>
      </table>
    `

    await sendEmail({
      to: process.env.EMAIL_ADMIN || 'admin@gennoor.com',
      from: process.env.EMAIL_FROM_WEBINAR || 'webinar@gennoor.com',
      fromName: 'Webinar Registration System',
      subject: `Webinar registration — ${webinarTitle} — ${name}`,
      html: adminEmailHtml,
    })

    return NextResponse.json({
      success: true,
      message: 'Registration confirmed! Check your email.',
    })
  } catch (error) {
    console.error('Error processing webinar registration:', error)
    return NextResponse.json(
      { success: false, message: 'Registration failed. Please try again or email webinar@gennoor.com.' },
      { status: 500 }
    )
  }
}
