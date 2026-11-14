import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { getLeads, mutateLeads, touch } from '@/lib/crm/store'
import { sendEmail, catalogExcelAttachment } from '@/lib/email-service'
import { teamMember } from '@/lib/crm/team'
import { SEQUENCE, stepById, stepNumber, sequenceProgress, isOpen, setOrder } from '@/lib/crm/sequence'
import { buildStepEmail } from '@/lib/crm/sequence-emails'
import { newLead } from '@/lib/crm/types'
import { needsAnswer, sendRoom, sentInLastHour, HOURLY_SEND_LIMIT } from '@/lib/crm/replies'
import { sendAgain } from '@/lib/crm/delivery'
import { syncRepliesBriefly } from '@/lib/crm/reply-sync'

const ADMIN_CC = process.env.EMAIL_ADMIN || 'admin@gennoor.com'
// Outreach always leaves as sales@gennoor.com
const FROM = process.env.EMAIL_FROM_SALES || 'sales@gennoor.com'
const MAX_PER_CALL = 50

/**
 * Preview one step of the email series.
 *   ?step=intro            a sample lead, for the Emails page
 *   ?step=intro&sample=bare   the same email for a lead with no clear name and no company
 *   ?step=intro&leadId=…   exactly what this lead would receive
 */
export async function GET(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const step = stepById(req.nextUrl.searchParams.get('step') || '')
  if (!step) return NextResponse.json({ error: 'Unknown step' }, { status: 400 })

  const leadId = req.nextUrl.searchParams.get('leadId')
  // A made-up lead, only ever shown on the Emails page. Real leads get their own name (see lib/crm/greeting.ts).
  const bare = req.nextUrl.searchParams.get('sample') === 'bare'
  let lead = newLead(bare ? { name: '', company: '', email: 'sample@example.com' } : { name: 'Priya Sharma', company: 'Acme Industries', email: 'priya@example.com' }, user.email)
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
    // Look at the mailboxes first: someone who wrote back a minute ago must not get the next email of the series
    // (for a few seconds at most: if Microsoft is slow, the send goes on with what is already known)
    await syncRepliesBriefly()
    const all = await getLeads()
    const skipped: string[] = []
    const jobs: Array<{ leadId: string; to: string; step: string; subject: string; html: string; text: string }> = []

    for (const id of leadIds) {
      const lead = all.find((l) => l.id === id)
      if (!lead) continue
      if (!canWorkLead(lead, user)) { skipped.push(`${lead.name}: held by ${lead.owner.split('@')[0]}`); continue }
      if (!isOpen(lead)) { skipped.push(`${lead.name}: archived or closed`); continue }
      if (!lead.email) { skipped.push(`${lead.name}: no email address`); continue }
      if (needsAnswer(lead)) { skipped.push(`${lead.name}: they replied and are waiting for an answer`); continue }
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

    // The email service allows about 100 emails an hour for the whole site (sign-in codes included), so the CRM
    // keeps to HOURLY_SEND_LIMIT. What does not fit now is left unsent and said so; it can go later.
    const room = sendRoom(all)
    if (room === 0) {
      const freeAt = sentInLastHour(all).freeAt
      const when = freeAt ? new Date(freeAt).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' }) : 'a little later'
      return NextResponse.json({ error: `${HOURLY_SEND_LIMIT} emails have gone in the last hour, which is all the email service safely allows. Send these after ${when} (India time).` }, { status: 429 })
    }
    if (jobs.length > room) {
      for (const j of jobs.splice(room)) skipped.push(`${all.find((l) => l.id === j.leadId)?.name || 'A lead'}: held back, the hourly limit of ${HOURLY_SEND_LIMIT} emails is reached`)
    }

    // The catalogue workbook is read once and reused for every lead that needs it
    const needsCatalogue = jobs.some((j) => stepById(j.step)?.attachCatalogue)
    const catalogue = needsCatalogue ? await catalogExcelAttachment() : null

    const cc = [...new Set([ADMIN_CC, user.email])]
    // `done` is false when the email service has taken the email and not finished sending it yet (see lib/crm/delivery.ts)
    const results: Array<{ leadId: string; ok: boolean; error?: string; op?: string; done?: boolean }> = []
    for (const job of jobs) {
      const attach = stepById(job.step)?.attachCatalogue && catalogue ? [catalogue] : undefined
      const r = await sendEmail({ to: job.to, cc, from: FROM, fromName: 'Gennoor Tech', subject: job.subject, html: job.html, attachments: attach })
      results.push({ leadId: job.leadId, ok: r.success, error: r.error, op: r.messageId, done: r.done })
    }

    const now = new Date().toISOString()
    await mutateLeads((leads) => {
      for (const r of results) {
        const lead = leads.find((l) => l.id === r.leadId)
        const job = jobs.find((j) => j.leadId === r.leadId)!
        if (!lead) continue
        const n = stepNumber(job.step)
        lead.emailHistory.unshift({
          at: now, by: user.email, to: job.to, subject: job.subject, status: r.ok ? 'sent' : 'failed', body: job.text.slice(0, 4000), cc, step: job.step,
          ...(r.op ? { op: r.op } : {}),
          ...(r.ok && r.done ? { confirmedAt: now, confirmedBy: 'service' as const } : {}),
          ...(!r.ok && r.error ? { error: r.error.slice(0, 300) } : {}),
        })
        if (r.ok) {
          lead.sequence = lead.sequence || { sent: [] }
          lead.sequence.sent.push({ step: job.step, at: now, by: user.email })
          if (lead.status === 'new') lead.status = 'contacted'
          // Sending to an unassigned lead makes it yours, so the follow-ups have an owner
          if (!lead.owner) lead.owner = user.email
        }
        touch(lead, { at: now, by: user.email, type: 'email', description: r.ok ? `Email ${n} of ${SEQUENCE.length} ${r.done ? 'sent' : 'handed to the email service'}: ${stepById(job.step)!.title}` : `Email ${n} FAILED: ${r.error || 'unknown error'}` })
      }
    })

    const sent = results.filter((r) => r.ok).length
    // Taken by the email service and not finished yet: shown as "on its way" until it is confirmed
    const onItsWay = results.filter((r) => r.ok && !r.done).length
    const failed = results.filter((r) => !r.ok)
    return NextResponse.json({
      success: failed.length === 0,
      sent,
      onItsWay,
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

/**
 * Stop or resume the series for leads: { leadIds, action: 'stop' | 'resume', reason? }
 * Make one email of the series due again: { leadIds: [id], action: 'again', step }. Only for an email that
 * failed, or that nothing confirmed for a day (lib/crm/delivery.ts decides); never for one that has gone.
 * Put the emails not sent yet in another order for ONE lead: { leadIds: [id], action: 'order', order: [step, ...] }.
 */
export async function PATCH(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadIds, action, reason, step, order } = await request.json()
    if (!Array.isArray(leadIds) || !['stop', 'resume', 'again', 'order'].includes(action)) return NextResponse.json({ error: 'leadIds and action required' }, { status: 400 })
    const now = new Date().toISOString()
    if (action === 'order') {
      const body: unknown = order
      if (!Array.isArray(body)) return NextResponse.json({ error: 'order required' }, { status: 400 })
      const kept = await mutateLeads((leads) => {
        const lead = leads.find((l) => l.id === leadIds[0])
        if (!lead || !canWorkLead(lead, user)) return null
        // Moving an email is planning, not contact with the lead: it is not written in the lead's history
        const next = setOrder(lead, body.map(String))
        lead.updatedAt = now
        return next
      })
      if (!kept) return NextResponse.json({ error: 'This lead is held by someone else, or no longer exists.' }, { status: 409 })
      return NextResponse.json({ success: true, order: kept })
    }
    if (action === 'again') {
      if (!stepById(step)) return NextResponse.json({ error: 'Unknown step' }, { status: 400 })
      const due = await mutateLeads((leads) => {
        const lead = leads.find((l) => l.id === leadIds[0])
        return !!lead && canWorkLead(lead, user) && sendAgain(lead, step, user.email, now)
      })
      if (!due) return NextResponse.json({ error: 'This email cannot be sent again: it has gone, or it is still on its way.' }, { status: 409 })
      return NextResponse.json({ success: true, done: 1 })
    }
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
