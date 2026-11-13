import { getLeads, mutateLeads } from './store'
import { graphConfigured, listRecentReceived, listRecentSentTo } from './graph'
import { applyReplies, kindOf, needsAnswer, type Received, type ReplyChange, type ReplyKind } from './replies'
import type { Lead } from './types'

/**
 * Keeps the leads in step with the team's mailboxes. Server only.
 *
 * It reads the recent mail from addresses that belong to leads, and what the team sent back, and lets
 * `applyReplies` (./replies.ts) decide: a reply moves a lead to Talking, a request to stop stops the series,
 * a reply answered from Outlook counts as answered. It writes to the store only when something changed.
 *
 * It runs from the heartbeat (every 15 minutes, whether or not anyone has the CRM open), whenever the Replies
 * page or Today asks for the mail, and just before a series send, so nobody is emailed "email 4" a minute
 * after they wrote back.
 */

/** A message from a lead, as the Replies page shows it. */
export interface LeadMessage extends Received {
  leadId: string
  leadName: string
  leadCompany: string
  owner: string
  kind: ReplyKind
  /** This is the message the lead is waiting on an answer for. */
  waiting: boolean
}

export interface SyncResult {
  configured: boolean
  messages: LeadMessage[]
  changes: ReplyChange[]
  /** Nothing could be read. */
  error?: string
  /** Some of it could be read: said on screen, so nobody trusts an empty list too far. */
  note?: string
}

let last: { at: number; result: SyncResult } | null = null
let running: Promise<SyncResult> | null = null
const REUSE_MS = 45_000

/** The plain words shown when the mailboxes cannot be read. */
export function mailProblem(error: unknown): string {
  const detail = String((error as Error)?.message || error || '')
  if (/Access.*denied|Authorization|Forbidden|ErrorAccessDenied|insufficient privileges/i.test(detail)) {
    return 'The CRM is not allowed to read the mailboxes. An administrator needs to give it permission to read mail (Mail.Read) in Microsoft Entra.'
  }
  if (/not configured|MS_GRAPH/i.test(detail)) return 'Reading replies is not set up on this site yet.'
  return 'The mailboxes could not be read just now. Try again in a minute.'
}

async function run(): Promise<SyncResult> {
  if (!graphConfigured()) return { configured: false, messages: [], changes: [] }
  try {
    const leads = await getLeads()
    const byAddress = new Map<string, Lead>()
    for (const l of leads) for (const a of [l.email, ...(l.altEmails || [])]) if (a) byAddress.set(a.trim().toLowerCase(), l)

    const [mail, answeredAt] = await Promise.all([listRecentReceived(), listRecentSentTo().catch(() => ({} as Record<string, string>))])
    const fromLeads = mail.messages.filter((m) => byAddress.has(m.from))
    const note = mail.unread ? `${mail.unread === 1 ? 'One mailbox' : `${mail.unread} mailboxes`} could not be read just now, so a reply may be missing from this list. It is looked at again within a few minutes.` : undefined

    // Try it on a copy first: the store is written only when something really changed
    const trial = applyReplies(structuredClone(leads), fromLeads, answeredAt)
    let current = leads
    let changes: ReplyChange[] = []
    if (trial.length) {
      changes = await mutateLeads((stored) => applyReplies(stored, fromLeads, answeredAt))
      current = await getLeads()
    }
    const now = new Map(current.map((l) => [l.id, l]))
    const messages = fromLeads.map((m): LeadMessage => {
      const lead = now.get(byAddress.get(m.from)!.id) || byAddress.get(m.from)!
      const kind = kindOf(m)
      return {
        id: m.id, from: m.from, fromName: m.fromName, subject: m.subject, preview: m.preview, receivedAt: m.receivedAt, mailboxes: m.mailboxes,
        leadId: lead.id, leadName: lead.name, leadCompany: lead.company, owner: lead.owner || '',
        kind, waiting: kind !== 'auto' && needsAnswer(lead) && lead.reply?.at === m.receivedAt,
      }
    })
    return { configured: true, messages, changes, ...(note ? { note } : {}) }
  } catch (error) {
    console.error('Reply check failed:', error)
    return { configured: true, messages: [], changes: [], error: mailProblem(error) }
  }
}

/** Checks the mailboxes, unless it did so in the last 45 seconds (then the same answer is given again). */
export async function syncReplies(fresh = false): Promise<SyncResult> {
  if (!fresh && last && Date.now() - last.at < REUSE_MS) return { ...last.result, changes: [] }
  if (running) return running
  running = run().then((result) => { last = { at: Date.now(), result }; return result }).finally(() => { running = null })
  return running
}

/**
 * The same check, for a moment when someone is waiting (a send about to start): if the mailboxes are slow,
 * go on with what is already known rather than keep the person waiting.
 */
export function syncRepliesBriefly(ms = 8000): Promise<SyncResult | null> {
  return Promise.race([syncReplies(true).catch(() => null), new Promise<null>((r) => setTimeout(() => r(null), ms))])
}

/** For the heartbeat: one line that says what changed. */
export async function replyTick(): Promise<string[]> {
  if (!graphConfigured()) return ['mailboxes not set up']
  const r = await syncReplies(true)
  if (r.error) return [r.error]
  return r.changes.length ? r.changes.map((c) => `${c.what}: ${c.leadId}`) : ['nothing new']
}
