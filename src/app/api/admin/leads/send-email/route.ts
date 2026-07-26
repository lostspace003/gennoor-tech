import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { mutateLeads, getLeads, touch } from '@/lib/crm/store'
import { downloadDocument } from '@/lib/crm/documents'
import { sendEmail } from '@/lib/email-service'
import { escapeHtml } from '@/lib/escape-html'

const ADMIN_CC = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
const FROM = process.env.EMAIL_FROM_SALES || process.env.EMAIL_FROM_INFO || 'info@gennoor.com'

function wrapHtml(bodyText: string): string {
  const paragraphs = escapeHtml(bodyText)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;white-space:pre-line">${p}</p>`)
    .join('')
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0C1426;padding:26px 28px;text-align:center">
        <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:800">Gennoor Tech</h1>
        <p style="color:#93b4ff;margin:6px 0 0;font-size:11px;letter-spacing:2px">TRAIN. INNOVATE. BUILD.</p>
      </div>
      <div style="padding:28px;background:#ffffff;color:#374151;font-size:15px;line-height:1.7">
        ${paragraphs}
      </div>
      <div style="background:#f8fafc;padding:16px 28px;text-align:center;border-top:1px solid #e2e8f0">
        <p style="margin:0;color:#64748b;font-size:12px">Gennoor Tech · admin@gennoor.com · +91 9326352241 · www.gennoor.com</p>
      </div>
    </div>`
}

export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadIds, subject, body, attachBlobs, extraTo, extraCc, bcc } = await request.json()
    if (!Array.isArray(leadIds) || leadIds.length === 0 || !subject || !body) {
      return NextResponse.json({ error: 'leadIds, subject and body are required' }, { status: 400 })
    }

    const allLeads = await getLeads()
    const targets = allLeads.filter((l) => leadIds.includes(l.id))
    const missingEmail = targets.filter((l) => !l.email)
    const sendable = targets.filter((l) => l.email)

    if (sendable.length === 0) {
      return NextResponse.json({ error: 'None of the selected leads have an email address' }, { status: 400 })
    }

    // Load attachments from the CRM document library
    const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = []
    if (Array.isArray(attachBlobs)) {
      for (const name of attachBlobs) {
        const doc = await downloadDocument(name)
        if (doc) {
          attachments.push({ filename: name.split('/').pop() || name, content: doc.content, contentType: doc.contentType })
        }
      }
    }

    const html = wrapHtml(body)
    const results: Array<{ leadId: string; to: string; success: boolean; error?: string }> = []

    // One email per lead so each lead gets an individually addressed message.
    // admin@ is ALWAYS on CC regardless of what the caller passes.
    const ccList = [ADMIN_CC, ...(Array.isArray(extraCc) ? extraCc.filter(Boolean) : [])]
    const bccList = Array.isArray(bcc) ? bcc.filter(Boolean) : []
    for (const lead of sendable) {
      const to = [lead.email, ...(Array.isArray(extraTo) ? extraTo.filter(Boolean) : [])]
      const result = await sendEmail({
        to,
        cc: [...new Set(ccList)],
        bcc: bccList.length ? bccList : undefined,
        from: FROM,
        fromName: 'Gennoor Tech',
        subject,
        html,
        attachments: attachments.length ? attachments : undefined,
      })
      results.push({ leadId: lead.id, to: lead.email, success: result.success, error: result.error })
    }

    // Record history + activity on each lead
    const now = new Date().toISOString()
    await mutateLeads((leads) => {
      for (const r of results) {
        const lead = leads.find((l) => l.id === r.leadId)
        if (!lead) continue
        lead.emailHistory.unshift({
          at: now,
          by: user.email,
          to: r.to,
          subject,
          status: r.success ? 'sent' : 'failed',
          body: String(body).slice(0, 4000),
          cc: [...new Set(ccList)],
        })
        if (r.success && lead.status === 'new') lead.status = 'contacted'
        touch(lead, {
          at: now,
          by: user.email,
          type: 'email',
          description: r.success ? `Email sent: ${subject}` : `Email FAILED: ${subject}`,
        })
      }
    })

    const sent = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success)
    return NextResponse.json({
      success: failed.length === 0,
      sent,
      failed: failed.length,
      skippedNoEmail: missingEmail.map((l) => l.name),
      errors: failed.map((f) => `${f.to}: ${f.error}`),
      message: `Sent ${sent}/${sendable.length} emails (CC ${ADMIN_CC})`,
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
