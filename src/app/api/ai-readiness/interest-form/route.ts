import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'
import { sendEmail } from '@/lib/email-service'

export async function POST(request: NextRequest) {
  try {
    const { name, email, company, message, option } = await request.json()

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Log to Azure Table Storage
    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (connStr) {
      try {
        const client = TableClient.fromConnectionString(connStr, 'AIReadinessLeads')
        await client.createTable().catch(() => {})
        const now = new Date()
        await client.createEntity({
          partitionKey: now.toISOString().slice(0, 10),
          rowKey: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
          name,
          email,
          company: company || '',
          message: message || '',
          option: option || '',
          source: 'interest-form',
          submittedAt: now.toISOString(),
        })
      } catch (err) {
        console.error('Failed to log lead:', err)
      }
    }

    // Notify team
    const teamHtml = `
      <div style="font-family: monospace; padding: 20px;">
        <h2>New AI Readiness Organization Interest Form</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company</td><td style="padding: 8px; border: 1px solid #ddd;">${company || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Interest Level</td><td style="padding: 8px; border: 1px solid #ddd;">${option || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">${message || 'None'}</td></tr>
        </table>
        <p style="margin-top: 16px; color: #666;">Follow up within 24 hours.</p>
      </div>
    `

    await sendEmail({
      to: 'info@gennoor.com',
      from: process.env.EMAIL_FROM_INFO || 'DoNotReply@gennoor.com',
      fromName: 'Gennoor AI Readiness Bot',
      subject: `[ORG INTEREST] ${name} — ${company || 'No Company'} (${option})`,
      html: teamHtml,
    }).catch(() => {})

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Interest form error:', err)
    return NextResponse.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
