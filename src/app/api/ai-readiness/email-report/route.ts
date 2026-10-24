import { readinessReportHtml, readinessOrgHtml } from '@/lib/email-templates'
import { escapeHtml } from '@/lib/escape-html'
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

    const reportLabel = reportType === 'blueprint' ? 'Deep Dive' : 'Quick Scan'

    const htmlBody = readinessReportHtml(name || '', reportLabel)

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
      const orgHtml = readinessOrgHtml(name || '')

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
          <table role="presentation" style="border-collapse: collapse; width: 100%;">
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
