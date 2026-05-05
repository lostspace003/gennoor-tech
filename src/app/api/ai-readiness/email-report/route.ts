import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'
import { isEmailVerified } from '@/lib/otp-store'
import { sendEmail } from '@/lib/email-service'

async function logEmailSent(email: string, name: string, reportType: string) {
  try {
    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connStr) return
    const client = TableClient.fromConnectionString(connStr, 'AIReadinessReports')
    await client.createTable().catch(() => {})
    const now = new Date()
    await client.createEntity({
      partitionKey: now.toISOString().slice(0, 10),
      rowKey: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      email,
      name: name || '',
      reportType: reportType || '',
      action: 'email-sent',
      generatedAt: now.toISOString(),
    })
  } catch (err) {
    console.error('Failed to log email send:', err)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, pdfBase64, reportType, orgInterest, role, category, subcategory } = await request.json()

    if (!email || !pdfBase64) {
      return NextResponse.json(
        { error: 'Missing required fields: email and pdfBase64 are required' },
        { status: 400 },
      )
    }

    if (!isEmailVerified(email)) {
      return NextResponse.json(
        { error: 'Email not verified. Please verify your email first.' },
        { status: 401 },
      )
    }

    const firstName = name ? name.split(' ')[0] : 'there'
    const reportLabel = reportType === 'blueprint' ? 'Custom Blueprint' : reportType === 'deep-dive' ? 'Deep Dive' : 'Quick Scan'

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); padding: 36px 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Gennoor Tech</h1>
          <p style="color: #dbeafe; margin: 8px 0 0; font-size: 14px;">AI Readiness Assessment</p>
        </div>

        <div style="padding: 36px 30px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none;">
          <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Hi ${firstName},</h2>

          <p style="color: #475569; line-height: 1.8; font-size: 15px;">
            Thank you for completing the <strong>AI Readiness ${reportLabel}</strong> assessment.
            Your personalised report is attached to this email as a PDF.
          </p>

          <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 18px 20px; margin: 24px 0; border-radius: 4px;">
            <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.7;">
              Your report includes your overall readiness score, dimension breakdown, skill gap analysis,
              recommended tools, a 90-day roadmap, and ROI projections — all tailored to your profile.
            </p>
          </div>

          <h3 style="color: #1e293b; margin-top: 28px; font-size: 16px;">What&rsquo;s Next?</h3>
          <ol style="color: #475569; line-height: 2; font-size: 14px; padding-left: 20px;">
            <li>Review your attached AI Readiness Blueprint</li>
            <li>Start with Phase 1 of your 90-day roadmap</li>
            <li>Explore the recommended tools (clickable links in report)</li>
            <li>Book a call if you want guided implementation</li>
          </ol>

          <div style="text-align: center; margin: 32px 0 16px;">
            <a href="https://www.gennoor.com/resources/calendar"
               style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px;">
              Book a Free 15-min Call
            </a>
          </div>

          <div style="border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 32px;">
            <table style="width: 100%; color: #64748b; font-size: 13px; line-height: 1.8;">
              <tr>
                <td>Email:</td>
                <td><a href="mailto:info@gennoor.com" style="color: #2563eb;">info@gennoor.com</a></td>
              </tr>
              <tr>
                <td>WhatsApp:</td>
                <td><a href="https://wa.me/919326352241" style="color: #2563eb;">+91 9326352241</a></td>
              </tr>
              <tr>
                <td>Website:</td>
                <td><a href="https://www.gennoor.com" style="color: #2563eb;">www.gennoor.com</a></td>
              </tr>
            </table>
          </div>
        </div>

        <div style="background: #1e293b; padding: 24px; text-align: center; border-radius: 0 0 10px 10px;">
          <p style="color: #e2e8f0; margin: 0; font-size: 13px;">
            &copy; ${new Date().getFullYear()} Gennoor Tech. All rights reserved.
          </p>
          <p style="color: #94a3b8; margin: 8px 0 0; font-size: 12px;">
            Empowering Organizations with AI Excellence
          </p>
        </div>
      </div>
    `

    const result = await sendEmail({
      to: email,
      from: process.env.EMAIL_FROM_INFO || 'DoNotReply@gennoor.com',
      fromName: 'Gennoor Tech',
      subject: `Your AI Readiness ${reportLabel} — Gennoor Tech`,
      html: htmlBody,
      attachments: [
        {
          filename: `AI-Readiness-${reportLabel.replace(/\s/g, '-')}.pdf`,
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf',
        },
      ],
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to send email' }, { status: 500 })
    }

    await logEmailSent(email, name || '', reportType || '')

    // If user expressed interest in org-level AI readiness, send follow-up email to them + notify team
    if (orgInterest === 'yes') {
      const orgHtml = `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #059669 0%, #047857 100%); padding: 36px 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Let&rsquo;s Build This for Your Organization</h1>
            <p style="color: #d1fae5; margin: 8px 0 0; font-size: 14px;">Gennoor Tech — AI Transformation Partner</p>
          </div>

          <div style="padding: 36px 30px; background: #ffffff; border: 1px solid #e2e8f0; border-top: none;">
            <h2 style="color: #1e293b; margin-top: 0; font-size: 20px;">Hi ${firstName},</h2>

            <p style="color: #475569; line-height: 1.8; font-size: 15px;">
              Thanks for expressing interest in bringing AI readiness assessment and training to your organization.
              Here&rsquo;s what we can do together:
            </p>

            <div style="margin: 24px 0;">
              <h3 style="color: #1e293b; font-size: 16px; margin-bottom: 12px;">What We Offer</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px 0; color: #2563eb; font-weight: bold; font-size: 14px; width: 40%;">Custom AI Assessment</td>
                  <td style="padding: 12px 0; color: #475569; font-size: 14px;">AI readiness evaluation built on your organization&rsquo;s data, tools, and workflows</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px 0; color: #2563eb; font-weight: bold; font-size: 14px;">AI Training Workshops</td>
                  <td style="padding: 12px 0; color: #475569; font-size: 14px;">Hands-on training for teams — from Copilot mastery to building AI agents</td>
                </tr>
                <tr style="border-bottom: 1px solid #f1f5f9;">
                  <td style="padding: 12px 0; color: #2563eb; font-weight: bold; font-size: 14px;">AI Strategy & Roadmap</td>
                  <td style="padding: 12px 0; color: #475569; font-size: 14px;">90-day implementation plan with tool selection, ROI tracking, and change management</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; color: #2563eb; font-weight: bold; font-size: 14px;">POC Development</td>
                  <td style="padding: 12px 0; color: #475569; font-size: 14px;">Build and deploy AI proof-of-concepts tailored to your business challenges</td>
                </tr>
              </table>
            </div>

            <p style="color: #475569; line-height: 1.8; font-size: 15px;">
              Our team will reach out within 24 hours to schedule a no-obligation discovery call.
              In the meantime, you can book a slot directly:
            </p>

            <div style="text-align: center; margin: 28px 0 16px;">
              <a href="https://www.gennoor.com/resources/calendar"
                 style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px;">
                Schedule a Discovery Call
              </a>
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

      // Send org interest email to user
      await sendEmail({
        to: email,
        from: process.env.EMAIL_FROM_INFO || 'DoNotReply@gennoor.com',
        fromName: 'Gennoor Tech',
        subject: `Let's Build AI Readiness for Your Organization — Gennoor Tech`,
        html: orgHtml,
      }).catch(() => {})

      // Notify Gennoor team about the lead
      const teamNotification = `
        <div style="font-family: monospace; padding: 20px;">
          <h2>🔔 New Org-Level AI Readiness Lead</h2>
          <table style="border-collapse: collapse; width: 100%;">
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${name || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Role</td><td style="padding: 8px; border: 1px solid #ddd;">${role || 'N/A'}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Industry</td><td style="padding: 8px; border: 1px solid #ddd;">${category || 'N/A'}${subcategory ? ' > ' + subcategory : ''}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Interest</td><td style="padding: 8px; border: 1px solid #ddd;">YES — wants org-level AI readiness</td></tr>
          </table>
          <p style="margin-top: 16px; color: #666;">Follow up within 24 hours.</p>
        </div>
      `

      await sendEmail({
        to: 'info@gennoor.com',
        from: process.env.EMAIL_FROM_INFO || 'DoNotReply@gennoor.com',
        fromName: 'Gennoor AI Readiness Bot',
        subject: `[LEAD] Org AI Readiness Interest: ${name || email}`,
        html: teamNotification,
      }).catch(() => {})
    }

    return NextResponse.json({ success: true, messageId: result.messageId })
  } catch (err: any) {
    console.error('Email report error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to send report email' },
      { status: 500 },
    )
  }
}
