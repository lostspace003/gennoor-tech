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
    const { email, name, pdfBase64, reportType } = await request.json()

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
    const reportLabel = reportType === 'deep-dive' ? 'Deep Dive' : 'Quick Scan'

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
              Your report includes your overall readiness score, pillar-by-pillar breakdown,
              actionable quick wins, and a 30-day plan tailored to your situation.
            </p>
          </div>

          <h3 style="color: #1e293b; margin-top: 28px; font-size: 16px;">What&rsquo;s Next?</h3>
          <ol style="color: #475569; line-height: 2; font-size: 14px; padding-left: 20px;">
            <li>Review your attached AI Readiness Report</li>
            <li>Start with the Quick Win action item</li>
            <li>Follow the 30-day plan to build momentum</li>
            <li>Reach out to us if you need guidance or training</li>
          </ol>

          <div style="text-align: center; margin: 32px 0 16px;">
            <a href="https://www.gennoor.com"
               style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px;">
              Explore Gennoor Tech
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
      subject: 'Your AI Readiness Report — Gennoor Tech',
      html: htmlBody,
      attachments: [
        {
          filename: 'AI-Readiness-Report.pdf',
          content: Buffer.from(pdfBase64, 'base64'),
          contentType: 'application/pdf',
        },
      ],
    })

    if (result.success) {
      await logEmailSent(email, name || '', reportType || '')
      return NextResponse.json({ success: true, messageId: result.messageId })
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 },
      )
    }
  } catch (err: any) {
    console.error('Email report error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to send report email' },
      { status: 500 },
    )
  }
}
