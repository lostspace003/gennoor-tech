import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email-service'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    const { email, name, reportType, role, category, subcategory } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const firstName = name.split(' ')[0]
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'

    const orgHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 36px 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">AI Readiness for Your Organization</h1>
          <p style="color: #d1fae5; margin: 8px 0 0; font-size: 14px;">Gennoor Tech — AI Transformation Partner</p>
        </div>

        <div style="padding: 36px 30px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Hi ${firstName},</h2>

          <p style="color: #475569; line-height: 1.8; font-size: 15px;">
            Thank you for completing your AI Readiness assessment. We&rsquo;d love to help bring this to your entire organization.
          </p>

          <p style="color: #475569; line-height: 1.8; font-size: 15px; margin-top: 20px;">
            How interested are you in exploring AI readiness for your organization?
          </p>

          <div style="text-align: center; margin: 28px 0;">
            <a href="${baseUrl}/resources/calendar?topic=ai-readiness&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}"
               style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; margin: 6px;">
              Yes, Interested!
            </a>
          </div>

          <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 18px 20px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #047857; margin: 0; font-size: 14px; line-height: 1.7;">
              Click above to book a free discovery call. Your details will be pre-filled.
            </p>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px;">
            <table style="width: 100%; color: #64748b; font-size: 13px; line-height: 1.8;">
              <tr><td>Email:</td><td><a href="mailto:info@gennoor.com" style="color: #2563eb;">info@gennoor.com</a></td></tr>
              <tr><td>WhatsApp:</td><td><a href="https://wa.me/919326352241" style="color: #2563eb;">+91 9326352241</a></td></tr>
              <tr><td>Website:</td><td><a href="https://www.gennoor.com" style="color: #2563eb;">www.gennoor.com</a></td></tr>
            </table>
          </div>
        </div>

        <div style="background: #1e293b; padding: 24px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="color: #e2e8f0; margin: 0; font-size: 13px;">&copy; ${new Date().getFullYear()} Gennoor Tech. All rights reserved.</p>
        </div>
      </div>
    `

    await sendEmail({
      to: email,
      from: process.env.EMAIL_FROM_INFO || 'DoNotReply@gennoor.com',
      fromName: 'Gennoor Tech',
      subject: `AI Readiness for Your Organization — Gennoor Tech`,
      html: orgHtml,
    })

    // Notify Gennoor team
    const teamHtml = `
      <div style="font-family: monospace; padding: 20px;">
        <h2>New Org-Level AI Readiness Lead</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Report Type</td><td style="padding: 8px; border: 1px solid #ddd;">${reportType}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Role</td><td style="padding: 8px; border: 1px solid #ddd;">${role || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Industry</td><td style="padding: 8px; border: 1px solid #ddd;">${category || 'N/A'}${subcategory ? ' > ' + subcategory : ''}</td></tr>
        </table>
        <p style="margin-top: 16px; color: #666;">Interest: YES. Follow up within 24 hours.</p>
      </div>
    `

    await sendEmail({
      to: 'info@gennoor.com',
      from: process.env.EMAIL_FROM_INFO || 'DoNotReply@gennoor.com',
      fromName: 'Gennoor AI Readiness Bot',
      subject: `[LEAD] Org AI Readiness: ${name} (${email})`,
      html: teamHtml,
    }).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Org interest email error:', err)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}
