import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { getLeads, mutateLeads, touch } from '@/lib/crm/store'
import { sendEmail, catalogExcelAttachment } from '@/lib/email-service'
import { teamMember } from '@/lib/crm/team'
import { SEQUENCE, stepById, stepNumber, sequenceProgress, isOpen } from '@/lib/crm/sequence'
import { buildStepEmail } from '@/lib/crm/sequence-emails'
import { newLead } from '@/lib/crm/types'

const ADMIN_CC = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
// Outreach always leaves as sales@gennoor.com
const FROM = process.env.EMAIL_FROM_SALES || 'sales@gennoor.com'
const MAX_PER_CALL = 50

/**
 * Preview one step of the email series.
 *   ?step=intro            a sample lead, for the Emails page
 *   ?step=intro&leadId=…   exactly what this lead would receive
 */
export async function GET(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const step = stepById(req.nextUrl.searchParams.get('step') || '')
  if (!step) return NextResponse.json({ error: 'Unknown step' }, { status: 400 })

  const leadId = req.nextUrl.searchParams.get('leadId')
  let lead = newLead({ name: 'Priya Sharma', company: 'Acme Industries', email: 'priya@example.com' }, user.email)
  if (leadId) {
    const found = (await getLeads()).find((l) => l.id === leadId)
    if (!found) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    lead = found
  }
  const mail = buildStepEmail(step.id, lead, teamMember(user.email), req.nextUrl.searchParams.get('note') || '')
  return NextResponse.json({ step: step.id, number: stepNumber(step.id), total: SEQUENCE.length, subject: mail.subject, html: mail.html, attachCatalogue: !!step.attachCatalogue })
}

/**
 * Send a step of the series.
 *   { leadIds, step? , note? }
 * Without `step`, each lead gets ITS next step. With `step`, every lead gets
 * that step (skipped where it was already sent). A step is never sent twice.
 */
export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadIds, step: stepId, note } = await request.json()
    if (!Array.isArray(leadIds) || leadIds.length === 0) return NextResponse.json({ error: 'leadIds required' }, { status: 400 })
    if (leadIds.length > MAX_PER_CALL) return NextResponse.json({ error: `Send to at most ${MAX_PER_CALL} leads at a time` }, { status: 400 })
    if (stepId && !stepById(stepId)) return NextResponse.json({ error: 'Unknown step' }, { status: 400 })

    const signer = teamMember(user.email)
    const all = await getLeads()
    const skipped: string[] = []
    const jobs: Array<{ leadId: string; to: string; step: string; subject: string; html: string; text: string }> = []

    for (const id of leadIds) {
      const lead = all.find((l) => l.id === id)
      if (!lead) continue
      if (!canWorkLead(lead, user)) { skipped.push(`${lead.name}: held by ${lead.owner.split('@')[0]}`); continue }
      if (!isOpen(lead)) { skipped.push(`${lead.name}: archived or closed`); continue }
      if (!lead.email) { skipped.push(`${lead.name}: no email address`); continue }
      const progress = sequenceProgress(lead)
      if (progress.stopped) { skipped.push(`${lead.name}: emails stopped`); continue }
      const step = stepId ? stepById(stepId)! : progress.next
      if (!step) { skipped.push(`${lead.name}: series finished`); continue }
      if (progress.sentIds.includes(step.id)) { skipped.push(`${lead.name}: already sent`); continue }
      const mail = buildStepEmail(step.id, lead, signer, typeof note === 'string' ? note : '')
      jobs.push({ leadId: lead.id, to: lead.email, step: step.id, subject: mail.subject, html: mail.html, text: mail.text })
    }

    if (jobs.length === 0) {
      return NextResponse.json({ error: skipped.length ? `Nothing to send. ${skipped.slice(0, 4).join('; ')}` : 'Nothing to send' }, { status: 400 })
    }

    // The catalogue workbook is read once and reused for every lead that needs it
    const needsCatalogue = jobs.some((j) => stepById(j.step)?.attachCatalogue)
    const catalogue = needsCatalogue ? await catalogExcelAttachment() : null

    const cc = [...new Set([ADMIN_CC, user.email])]
    const results: Array<{ leadId: string; ok: boolean; error?: string }> = []
    for (const job of jobs) {
      const attach = stepById(job.step)?.attachCatalogue && catalogue ? [catalogue] : undefined
      const r = await sendEmail({ to: job.to, cc, from: FROM, fromName: 'Gennoor Tech', subject: job.subject, html: job.html, attachments: attach })
      results.push({ leadId: job.leadId, ok: r.success, error: r.error })
    }

    const now = new Date().toISOString()
    await mutateLeads((leads) => {
      for (const r of results) {
        const lead = leads.find((l) => l.id === r.leadId)
        const job = jobs.find((j) => j.leadId === r.leadId)!
        if (!lead) continue
        const n = stepNumber(job.step)
        lead.emailHistory.unshift({ at: now, by: user.email, to: job.to, subject: job.subject, status: r.ok ? 'sent' : 'failed', body: job.text.slice(0, 4000), cc, step: job.step })
        if (r.ok) {
          lead.sequence = lead.sequence || { sent: [] }
          lead.sequence.sent.push({ step: job.step, at: now, by: user.email })
          if (lead.status === 'new') lead.status = 'contacted'
          // Sending to an unassigned lead makes it yours, so the follow-ups have an owner
          if (!lead.owner) lead.owner = user.email
        }
        touch(lead, { at: now, by: user.email, type: 'email', description: r.ok ? `Email ${n} of ${SEQUENCE.length} sent: ${stepById(job.step)!.title}` : `Email ${n} FAILED: ${r.error || 'unknown error'}` })
      }
    })

    const sent = results.filter((r) => r.ok).length
    const failed = results.filter((r) => !r.ok)
    return NextResponse.json({
      success: failed.length === 0,
      sent,
      failed: failed.length,
      skipped,
      errors: failed.map((f) => f.error || 'send failed'),
      message: `Sent ${sent} email${sent === 1 ? '' : 's'}${failed.length ? `, ${failed.length} failed` : ''}${skipped.length ? `, ${skipped.length} skipped` : ''}`,
    })
  } catch (error) {
    console.error('Sequence send error:', error)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}

/** Stop or resume the series for leads: { leadIds, action: 'stop' | 'resume', reason? } */
export async function PATCH(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadIds, action, reason } = await request.json()
    if (!Array.isArray(leadIds) || !['stop', 'resume'].includes(action)) return NextResponse.json({ error: 'leadIds and action required' }, { status: 400 })
    const now = new Date().toISOString()
    const done = await mutateLeads((leads) => {
      let n = 0
      for (const lead of leads) {
        if (!leadIds.includes(lead.id) || !canWorkLead(lead, user)) continue
        lead.sequence = lead.sequence || { sent: [] }
        if (action === 'stop') {
          lead.sequence.stopped = { at: now, by: user.email, reason: String(reason || 'Stopped by the team').slice(0, 200) }
          touch(lead, { at: now, by: user.email, type: 'status', description: `Email series stopped: ${lead.sequence.stopped.reason}` })
        } else {
          delete lead.sequence.stopped
          touch(lead, { at: now, by: user.email, type: 'status', description: 'Email series resumed' })
        }
        n++
      }
      return n
    })
    return NextResponse.json({ success: true, done })
  } catch (error) {
    console.error('Sequence update error:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
