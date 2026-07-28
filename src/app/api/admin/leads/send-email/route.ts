import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, getLeads, touch } from '@/lib/crm/store'
import { downloadDocument } from '@/lib/crm/documents'
import { sendEmail } from '@/lib/email-service'
import { emailShell, textToHtml } from '@/lib/crm/email-theme'

const ADMIN_CC = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
// Outreach ALWAYS goes out as sales@gennoor.com (user rule, 2026-07-28)
const FROM = process.env.EMAIL_FROM_SALES || 'sales@gennoor.com'

function wrapHtml(bodyText: string): string {
  // Signature carries the sending address + admin@ (never a phone number)
  return emailShell(textToHtml(bodyText), { preheader: bodyText.split('\n')[0]?.slice(0, 90), senderEmail: FROM })
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
    const targets = allLeads.filter((l) => leadIds.includes(l.id) && canWorkLead(l, user))
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
    // admin@ AND the team member sending are ALWAYS on CC regardless of what
    // the caller passes — the sender sees replies in their own mailbox too.
    const ccList = [ADMIN_CC, user.email, ...(Array.isArray(extraCc) ? extraCc.filter(Boolean) : [])]
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
      message: `Sent ${sent}/${sendable.length} emails from ${FROM} (CC ${ADMIN_CC} + you)`,
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
