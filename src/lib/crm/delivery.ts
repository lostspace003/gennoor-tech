import type { EmailRecord, Lead } from './types'
import { stepNumber } from './sequence'

/**
 * Has an email really gone? Pure functions, safe to import in the browser: the screens and the server decide
 * the same way.
 *
 * The owner (13 November 2026) sent four emails, saw no copy arrive, and asked: "why is it still showing
 * emailing? ... will I be receiving it?" The CRM wrote "sent" the moment the email service TOOK an email. On an
 * ordinary day the service finishes within two seconds, so the two were the same. That day Microsoft's mail was
 * slow: the service took every email and finished almost none for hours, and the CRM could not tell.
 *
 * So an email now has one of four states:
 *   on its way     the email service has it and has not finished it (nothing to do: it is in its queue)
 *   sent           confirmed: the service finished it, or our own copy of it arrived in the admin mailbox
 *   not confirmed  a day has passed and nothing confirmed it: a person decides whether to send it again
 *   failed         the service refused it, or gave up on it later: for a series email, it is due again
 * The confirming is done on the server (./delivery-sync.ts), from the same clock as the reply check.
 */

/**
 * Emails recorded before this moment carry no confirmation and need none: until then every email the site sent
 * was finished by the service at once (the site's own log shows it), so they count as sent.
 */
export const TRACKED_FROM = '2026-11-13T12:00:00.000Z'

/** After this long without a confirmation an email is no longer "on its way": it is "not confirmed". */
export const UNCONFIRMED_AFTER_MS = 24 * 3_600_000

/** Nothing older than this is looked for any more. */
const LOOK_BACK_MS = 7 * 86_400_000

export type SendState = 'sent' | 'onItsWay' | 'unconfirmed' | 'failed'

export function sendState(e: Pick<EmailRecord, 'at' | 'status' | 'confirmedAt'>, now = Date.now()): SendState {
  if (e.status === 'failed') return 'failed'
  if (e.confirmedAt || e.at < TRACKED_FROM) return 'sent'
  return now - Date.parse(e.at) >= UNCONFIRMED_AFTER_MS ? 'unconfirmed' : 'onItsWay'
}

/** The record of the series email of one step: the one the series counts, or failing that the newest attempt. */
export function seriesRecord(lead: Pick<Lead, 'emailHistory' | 'sequence'>, step: string): EmailRecord | null {
  const rows = (lead.emailHistory || []).filter((e) => e.step === step)
  const counted = lead.sequence?.sent.find((s) => s.step === step)
  return (counted && rows.find((e) => e.at === counted.at && e.status === 'sent')) || rows.find((e) => e.status === 'sent') || rows[0] || null
}

export interface SeriesSend {
  /** 1 to 9. */
  number: number
  step: string
  at: string
  by: string
  state: SendState
  confirmedAt?: string
  error?: string
}

/** The newest email of the series this lead has been sent (or that is on its way to them). */
export function lastSeriesSend(lead: Pick<Lead, 'emailHistory' | 'sequence'>, now = Date.now()): SeriesSend | null {
  const sent = lead.sequence?.sent || []
  if (!sent.length) return null
  const last = sent.reduce((a, b) => (a.at > b.at ? a : b))
  const record = seriesRecord(lead, last.step)
  return {
    number: stepNumber(last.step), step: last.step, at: last.at, by: last.by,
    // A series entry with no history row is an old one: it went
    state: record ? sendState(record, now) : 'sent',
    confirmedAt: record?.confirmedAt,
  }
}

/** A series email that failed and has not been sent again since: it is due again, and the screens say why. */
export function failedSeriesSend(lead: Pick<Lead, 'emailHistory' | 'sequence'>): SeriesSend | null {
  const counted = new Set((lead.sequence?.sent || []).map((s) => s.step))
  // newest first, as the history is kept
  const row = (lead.emailHistory || []).find((e) => e.step)
  if (!row || row.status !== 'failed' || counted.has(row.step!)) return null
  return { number: stepNumber(row.step!), step: row.step!, at: row.at, by: row.by, state: 'failed', error: row.error }
}

/** One email still waiting to be confirmed. */
export interface PendingSend {
  leadId: string
  to: string
  subject: string
  at: string
  op?: string
  step?: string
}

/** Every email of the last days that nothing has confirmed yet. */
export function pendingSends(leads: Pick<Lead, 'id' | 'emailHistory'>[], now = Date.now()): PendingSend[] {
  const out: PendingSend[] = []
  for (const l of leads) {
    for (const e of l.emailHistory || []) {
      const state = sendState(e, now)
      if ((state !== 'onItsWay' && state !== 'unconfirmed') || now - Date.parse(e.at) > LOOK_BACK_MS) continue
      out.push({ leadId: l.id, to: (e.to || '').trim().toLowerCase(), subject: e.subject || '', at: e.at, op: e.op, step: e.step })
    }
  }
  return out
}

/** What was learned about one email: it has gone, or it failed. `at` is the moment the CRM recorded sending it. */
export type Finding = { leadId: string; at: string } & ({ confirmedAt: string; by: 'service' | 'copy' } | { failed: string })

/** One of our own outreach emails, as its copy arrived in the admin mailbox (read by ./graph.ts). */
export interface OwnCopy {
  /** Who the email was written to (lower case). */
  to: string[]
  subject: string
  /** When the copy arrived. */
  at: string
}

const sameWords = (a: string, b: string) => a.replace(/\s+/g, ' ').trim().toLowerCase() === b.replace(/\s+/g, ' ').trim().toLowerCase()
/** A copy can arrive a little "before" the time the CRM wrote down: the CRM notes one time for a whole batch, after its last send. */
export const COPY_EARLY_MS = 10 * 60_000

/**
 * Which waiting emails have a copy in the admin mailbox: same person written to, same subject, arrived after
 * the send. Each copy counts once, oldest email first, so two emails with one subject to one person need two copies.
 */
export function matchCopies(pending: PendingSend[], copies: OwnCopy[]): Finding[] {
  const used = new Set<OwnCopy>()
  const found: Finding[] = []
  for (const p of [...pending].sort((a, b) => a.at.localeCompare(b.at))) {
    const earliest = new Date(Date.parse(p.at) - COPY_EARLY_MS).toISOString()
    const hit = copies
      .filter((c) => !used.has(c) && c.at >= earliest && c.to.includes(p.to) && sameWords(c.subject, p.subject))
      .sort((a, b) => a.at.localeCompare(b.at))[0]
    if (!hit) continue
    used.add(hit)
    found.push({ leadId: p.leadId, at: p.at, confirmedAt: hit.at, by: 'copy' })
  }
  return found
}

export interface DeliveryChange {
  leadId: string
  name: string
  what: 'confirmed' | 'failed'
  /** Which email of the series, when it was one. */
  number?: number
}

const note = (lead: Lead, description: string, now: string) => {
  lead.activities = lead.activities || []
  lead.activities.unshift({ at: now, by: 'system', type: 'email', description })
  if (lead.activities.length > 200) lead.activities.length = 200
  lead.updatedAt = now
}

/**
 * An email that did not go. Its record says so, and a series email stops counting as sent, so it is due again
 * and the lead is not sent "email 2" without ever having had email 1. A lead whose only email it was goes
 * back to New.
 */
export function failSend(lead: Lead, record: EmailRecord, reason: string, now = new Date().toISOString()): void {
  record.status = 'failed'
  record.error = reason.slice(0, 300)
  delete record.confirmedAt
  delete record.confirmedBy
  if (record.step && lead.sequence) lead.sequence.sent = lead.sequence.sent.filter((s) => !(s.step === record.step && s.at === record.at))
  if (lead.status === 'contacted' && !(lead.emailHistory || []).some((e) => e.status === 'sent')) lead.status = 'new'
  note(lead, `${record.step ? `Email ${stepNumber(record.step)} of the series` : 'An email'} did not go: ${record.error || 'the email service could not send it'}.${record.step ? ' It is due again.' : ''}`, now)
}

/**
 * Writes what was learned onto the leads. Changes the leads it is given and says what it did. Running it twice
 * with the same findings changes nothing the second time.
 */
export function applyDelivery(leads: Lead[], findings: Finding[], now = new Date().toISOString()): DeliveryChange[] {
  const changes: DeliveryChange[] = []
  const byId = new Map(leads.map((l) => [l.id, l]))
  for (const f of findings) {
    const lead = byId.get(f.leadId)
    const record = lead?.emailHistory?.find((e) => e.at === f.at && e.status === 'sent' && !e.confirmedAt)
    if (!lead || !record) continue
    const number = record.step ? stepNumber(record.step) : undefined
    if ('failed' in f) {
      failSend(lead, record, f.failed, now)
      changes.push({ leadId: lead.id, name: lead.name, what: 'failed', number })
    } else {
      record.confirmedAt = f.confirmedAt
      record.confirmedBy = f.by
      changes.push({ leadId: lead.id, name: lead.name, what: 'confirmed', number })
    }
  }
  return changes
}

/**
 * A person says: send this email of the series again. Allowed only when it failed, or when a day has passed and
 * nothing confirmed it. An email that is on its way is in the service's queue, and a confirmed one has gone:
 * neither is ever sent twice. True when the step is due again.
 */
export function sendAgain(lead: Lead, step: string, by: string, now = new Date().toISOString()): boolean {
  const counted = lead.sequence?.sent.find((s) => s.step === step)
  if (!counted) return true
  const record = seriesRecord(lead, step)
  if (!record || sendState(record, Date.parse(now)) !== 'unconfirmed') return false
  record.status = 'failed'
  record.error = 'Never confirmed by the email service; sent again by hand'
  lead.sequence!.sent = lead.sequence!.sent.filter((s) => s.step !== step)
  lead.activities = lead.activities || []
  lead.activities.unshift({ at: now, by, type: 'email', description: `Email ${stepNumber(step)} of the series was never confirmed as gone. It is due again.` })
  lead.updatedAt = now
  lead.lastActivity = now
  return true
}

/** "12 min", "3 hours", "2 days": how long ago, for a line that already says what happened. */
export function span(iso: string, now = Date.now()): string {
  const mins = Math.max(0, Math.floor((now - Date.parse(iso)) / 60_000))
  if (mins < 1) return 'a moment'
  if (mins < 60) return `${mins} min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'}`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'}`
}

/** The state of an email in a few words, for a list: "Email 1 on its way · 12 min", "Email 1 sent · 3 hours ago". */
export function sendLine(s: Pick<SeriesSend, 'number' | 'at' | 'state'>, now = Date.now()): string {
  const name = `Email ${s.number}`
  if (s.state === 'failed') return `${name} did not go`
  if (s.state === 'unconfirmed') return `${name} not confirmed`
  if (s.state === 'onItsWay') return `${name} on its way · ${span(s.at, now)}`
  const when = span(s.at, now)
  return `${name} sent · ${when === 'a moment' ? 'just now' : `${when} ago`}`
}

/** One sentence that explains the state, for a tooltip or under the line. */
export function sendHint(s: Pick<SeriesSend, 'at' | 'state' | 'error'>): string {
  const when = new Date(s.at).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })
  if (s.state === 'failed') return `It could not be sent (${when})${s.error ? `: ${s.error}` : ''}. Send it again.`
  if (s.state === 'unconfirmed') return `The email service took it on ${when} and has still not said that it has gone. It can be sent again from the lead's Emails tab.`
  if (s.state === 'onItsWay') return `The email service took it on ${when} and has not confirmed yet that it has gone. Nothing to do: it is in its queue, and this line changes to "sent" by itself.`
  return `Sent ${when}.`
}
