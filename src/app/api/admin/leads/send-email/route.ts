import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, getLeads, touch } from '@/lib/crm/store'
import { downloadDocument, isDocumentName } from '@/lib/crm/documents'
import { sendEmail } from '@/lib/email-service'
import { emailShell, textToHtml, markdownToEmailHtml } from '@/lib/crm/email-theme'
import { teamMember } from '@/lib/crm/team'
import { sendRoom, HOURLY_SEND_LIMIT } from '@/lib/crm/replies'

// Outreach ALWAYS goes out as sales@gennoor.com (user rule, 2026-07-28)
const FROM = process.env.EMAIL_FROM_SALES || 'sales@gennoor.com'

// Mail leaves as sales@, but the footer signs the person who worked the lead:
// their name, direct number and own gennoor.com address (admin@ stays listed).
function wrapHtml(bodyText: string, senderEmail: string): string {
  const signer = teamMember(senderEmail)
  // The pitch is written into the body as markdown now rather than attached,
  // so headings and bullets have to survive into the email. Plain drafts with
  // no markdown render identically either way, so this is safe for all mail.
  const looksMarkdown = /^\s*(##?\s|[-*]\s)/m.test(bodyText) || /\*\*[^*]+\*\*/.test(bodyText)
  return emailShell(looksMarkdown ? markdownToEmailHtml(bodyText) : textToHtml(bodyText), {
    preheader: bodyText.split('\n')[0]?.slice(0, 90),
    signature: { name: signer.name, email: signer.email, phones: signer.phones },
  })
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
    // The same hourly limit as the series (see lib/crm/replies.ts): the whole site shares one allowance
    if (sendable.length > sendRoom(allLeads)) {
      return NextResponse.json({ error: `Only ${sendRoom(allLeads)} more email${sendRoom(allLeads) === 1 ? '' : 's'} can go this hour (the limit is ${HOURLY_SEND_LIMIT} an hour for the CRM). Try again a little later.` }, { status: 429 })
    }

    // Load attachments from the CRM document library
    const attachments: Array<{ filename: string; content: Buffer; contentType: string }> = []
    if (Array.isArray(attachBlobs)) {
      // Only files of the library may be attached, and a handful at most: a name such as
      // "email-attachments/../../crm-data/leads.json" once attached the whole leads store to an email
      if (attachBlobs.length > 10 || !attachBlobs.every(isDocumentName)) {
        return NextResponse.json({ error: 'One of the attachments is not a document in the library' }, { status: 400 })
      }
      for (const name of attachBlobs) {
        const doc = await downloadDocument(name)
        if (doc) {
          attachments.push({ filename: name.split('/').pop() || name, content: doc.content, contentType: doc.contentType })
        }
      }
    }

    const html = wrapHtml(body, user.email)
    // `done` is false when the email service has taken the email and not finished sending it yet (see lib/crm/delivery.ts)
    const results: Array<{ leadId: string; to: string; success: boolean; error?: string; op?: string; done?: boolean }> = []

    // One email per lead so each lead gets an individually addressed message.
    // A copy to the person sending, and to anyone they added. No copy to the admin mailbox (see leads/sequence).
    const ccList = [user.email, ...(Array.isArray(extraCc) ? extraCc.filter(Boolean) : [])]
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
      results.push({ leadId: lead.id, to: lead.email, success: result.success, error: result.error, op: result.messageId, done: result.done })
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
          ...(r.op ? { op: r.op } : {}),
          ...(r.success && r.done ? { confirmedAt: now, confirmedBy: 'service' as const } : {}),
          ...(!r.success && r.error ? { error: r.error.slice(0, 300) } : {}),
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
      message: `Sent ${sent}/${sendable.length} emails from ${FROM} (a copy to you)`,
    })
  } catch (error) {
    console.error('Email send error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
