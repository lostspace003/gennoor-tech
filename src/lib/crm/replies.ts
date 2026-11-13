import type { Lead } from './types'

/**
 * What a reply from a lead means for the CRM. Pure functions, safe to import in the browser:
 * the screens and the server decide the same way.
 *
 * The owner's questions (13 November 2026): "how do we follow up? What if someone replies? Where
 * will we see the reply?" Before this file a reply changed nothing: the series went on, and the
 * promise at the foot of every email ("Reply with the word stop and I will not write again")
 * was kept only if a person happened to read the reply.
 *
 * Now:
 *  - A real reply moves a lead from New or Emailed to Talking, so the series is no longer on the
 *    send lists, and the lead shows under "They replied" until someone answers.
 *  - The ready-made "Not for us" reply of email 9 (subject "stop") closes the lead.
 *  - Any other way of asking us to stop ("unsubscribe", "please remove me", "not interested")
 *    stops the series and shows the reply to a person, who decides what else to do.
 *  - An automatic reply (out of office, delivery failure, a meeting answer) changes nothing.
 */

/** One message received, as the mailbox check reports it (no body: the first lines are enough). */
export interface Received {
  id: string
  from: string
  fromName?: string
  subject: string
  preview: string
  receivedAt: string
  mailboxes?: string[]
}

export type ReplyKind = 'reply' | 'stop' | 'auto'

/** What is kept on a lead about the last thing they wrote to us. */
export interface LeadReply {
  /** When their latest real message arrived. */
  at: string
  subject: string
  /** The first of their own words, for the lists. */
  preview: string
  kind: 'reply' | 'stop'
  /** Set when someone answered it, or said it needs no answer. */
  handledAt?: string
  handledBy?: string
}

const AUTO_SUBJECT = /^\s*(automatic reply|auto[- ]?reply|autoreply|auto:|out of (the )?office|ooo\b|away from|on leave|undeliverable|undelivered|delivery (status notification|has failed|failure|delayed)|mail delivery (failed|subsystem|failure)|returned mail|failure notice|message (not delivered|blocked|undeliverable)|delivery incomplete|read:|not read:|accepted:|declined:|tentative(ly accepted)?:|canceled:|cancelled:|new time proposed:|forwarded:)/i
const AUTO_SENDER = /^(mailer-daemon|postmaster|no-?reply|do-?not-?reply|donotreply|bounces?|notifications?|noreply-[a-z0-9-]+)@/i
const AUTO_BODY = /^\W*(i am|i'm|i will be|i'll be) (currently )?(out of (the )?office|on (annual |medical |maternity |paternity )?leave|away|travell?ing|on vacation)\b/i

/** Out of office, a delivery failure, a meeting answer: mail a machine sent. */
export function isAutoReply(m: Pick<Received, 'from' | 'subject' | 'preview'>): boolean {
  return AUTO_SUBJECT.test(m.subject || '') || AUTO_SENDER.test((m.from || '').trim()) || AUTO_BODY.test(m.preview || '')
}

// Where the quoted email begins. The first lines of a message are their own words; everything from
// the first of these marks on is our email quoted back, which is full of words like "stop".
const QUOTE_START = /(\r?\n\s*>|\bOn\s[^\n]{4,90}\swrote:|-{2,}\s*Original Message\s*-{2,}|_{6,}|\bFrom:\s[^\n]{0,90}\b(Sent|Date):\s|\bLe\s[^\n]{4,80}\sa écrit|\bSent from my\b|\bGet Outlook for\b|Not useful\? Reply with the word stop)/i

/** The sender's own words: the message without the email it quotes. */
export function ownWords(text: string): string {
  const flat = (text || '').replace(/\r/g, '')
  const m = flat.match(QUOTE_START)
  return (m ? flat.slice(0, m.index) : flat).replace(/[ \t]+/g, ' ').replace(/\n{2,}/g, '\n').trim()
}

const STOP_PHRASE = /\b(unsubscribe|remove me|remove my (name|email|e-mail|address)|take me off|opt(ing)? (me )?out|not interested|no longer interested|no interest\b|(do not|don'?t|dont|stop|cease|quit) (e-?mail(ing)?|contact(ing)?|writ(e|ing)|send(ing)?|mail(ing)?|messag(e|ing)|spamm?(ing)?)|stop (these|the|your|all|any|further) (e-?mails?|messages|mails?|communication)|no more (e-?mails?|messages|mails?))\b/i
// The word alone, as the foot of every email asks for it: "stop", "Stop.", "STOP please", "please stop, thanks"
const STOP_ALONE = /^\W*(please[, ]+)?stop\W*((please|thanks?|thank you|regards|best|cheers|sent from)\b.*)?$/i

/** Did they ask us to stop writing? Read from their own words and the subject, never from the quoted email. */
export function wantsStop(m: Pick<Received, 'subject' | 'preview'>): boolean {
  const subject = (m.subject || '').replace(/^\s*((re|fw|fwd)\s*:\s*)+/i, '').trim().toLowerCase()
  if (subject === 'stop' || subject === 'unsubscribe') return true
  const own = ownWords(m.preview || '')
  const firstLine = own.split('\n').map((l) => l.trim()).find(Boolean) || ''
  return STOP_ALONE.test(firstLine) || STOP_PHRASE.test(own.slice(0, 400))
}

/** The ready-made "Not for us" answer of the last email: its subject is the single word "stop". */
export const isReadyMadeStop = (m: Pick<Received, 'subject'>) => (m.subject || '').replace(/^\s*((re|fw|fwd)\s*:\s*)+/i, '').trim().toLowerCase() === 'stop'

export function kindOf(m: Pick<Received, 'from' | 'subject' | 'preview'>): ReplyKind {
  // A person who writes "stop" from a no-reply style address is still asking; the request wins over "automatic".
  if (wantsStop(m)) return 'stop'
  return isAutoReply(m) ? 'auto' : 'reply'
}

/** When we last wrote to this lead from the CRM. */
export const lastSentAt = (lead: Pick<Lead, 'emailHistory'>) => (lead.emailHistory || []).find((e) => e.status === 'sent')?.at || ''

/**
 * Is this lead waiting for an answer from us? True from the moment a real reply arrives until we write
 * to them again, or someone marks the reply as needing no answer.
 */
export function needsAnswer(lead: Pick<Lead, 'reply' | 'emailHistory' | 'dumped'>): boolean {
  const r = lead.reply
  if (!r || lead.dumped) return false
  if (r.handledAt && r.handledAt >= r.at) return false
  return r.at > lastSentAt(lead)
}

/** When anything last passed between us and this lead: an email either way, a note, a meeting. */
export function lastContactAt(lead: Pick<Lead, 'reply' | 'emailHistory' | 'lastActivity' | 'createdAt'>): string {
  return [lead.reply?.at, lastSentAt(lead), lead.lastActivity, lead.createdAt].filter(Boolean).sort().pop() || ''
}

export interface ReplyChange {
  leadId: string
  name: string
  what: 'replied' | 'stopped' | 'closed' | 'answered'
  subject: string
}

/**
 * Brings the leads in step with the mailboxes. `received` is the recent mail from addresses that belong to
 * leads; `answeredAt` gives, per address, when we last wrote to it from any team mailbox (so a reply
 * answered from Outlook or a phone counts as answered). Changes the leads it is given and says what it did.
 * Running it twice with the same mail changes nothing the second time.
 */
export function applyReplies(leads: Lead[], received: Received[], answeredAt: Record<string, string> = {}, now = new Date().toISOString()): ReplyChange[] {
  const changes: ReplyChange[] = []
  const byAddress = new Map<string, Lead>()
  for (const l of leads) for (const a of [l.email, ...(l.altEmails || [])]) if (a) byAddress.set(a.trim().toLowerCase(), l)

  // Newest real message per lead
  const newest = new Map<string, { m: Received; kind: 'reply' | 'stop' }>()
  for (const m of received) {
    const lead = byAddress.get((m.from || '').trim().toLowerCase())
    if (!lead) continue
    const kind = kindOf(m)
    if (kind === 'auto') continue
    const seen = newest.get(lead.id)
    if (!seen || m.receivedAt > seen.m.receivedAt) newest.set(lead.id, { m, kind })
  }

  const log = (lead: Lead, description: string) => {
    lead.activities = lead.activities || []
    lead.activities.unshift({ at: now, by: 'system', type: 'email', description })
    if (lead.activities.length > 200) lead.activities.length = 200
    lead.updatedAt = now
    lead.lastActivity = now
  }

  for (const lead of leads) {
    const hit = newest.get(lead.id)
    if (hit && (!lead.reply || hit.m.receivedAt > lead.reply.at)) {
      const { m, kind } = hit
      lead.reply = { at: m.receivedAt, subject: (m.subject || '').slice(0, 200), preview: ownWords(m.preview || '').slice(0, 220), kind }
      if (kind === 'stop') {
        lead.sequence = lead.sequence || { sent: [] }
        if (!lead.sequence.stopped) lead.sequence.stopped = { at: now, by: 'system', reason: 'They asked us to stop' }
        if (isReadyMadeStop(m) && !lead.dumped && lead.status !== 'won' && lead.status !== 'lost') {
          // "Not for us: I will close this and not write again" is what the email promised
          lead.status = 'lost'
          lead.reply.handledAt = now
          lead.reply.handledBy = 'system'
          log(lead, 'They chose "Not for us" in the check-in email. Closed, and the emails have stopped.')
          changes.push({ leadId: lead.id, name: lead.name, what: 'closed', subject: m.subject })
        } else {
          log(lead, `They asked us to stop ("${lead.reply.preview.slice(0, 80) || m.subject}"). The email series has stopped.`)
          changes.push({ leadId: lead.id, name: lead.name, what: 'stopped', subject: m.subject })
        }
      } else {
        const moved = !lead.dumped && (lead.status === 'new' || lead.status === 'contacted')
        if (moved) lead.status = 'qualified'
        log(lead, `They replied: ${m.subject || '(no subject)'}${moved ? '. Moved to Talking; the email series waits.' : ''}`)
        changes.push({ leadId: lead.id, name: lead.name, what: 'replied', subject: m.subject })
      }
    }
    // Answered from Outlook, a phone or anywhere else that is not the CRM
    const r = lead.reply
    if (r && !(r.handledAt && r.handledAt >= r.at) && r.at > lastSentAt(lead)) {
      const answered = [lead.email, ...(lead.altEmails || [])].map((a) => answeredAt[(a || '').trim().toLowerCase()] || '').sort().pop() || ''
      if (answered > r.at) {
        r.handledAt = answered
        r.handledBy = 'mailbox'
        log(lead, 'Their reply was answered from a team mailbox (outside the CRM).')
        changes.push({ leadId: lead.id, name: lead.name, what: 'answered', subject: r.subject })
      }
    }
  }
  return changes
}

// ---- How many emails may still go this hour ----------------------------------------------------------------------

/**
 * The email service allows about 100 sends an hour for the WHOLE site, and the codes that let learners sign
 * in share that allowance. On 12 November 2026 one large send used it up and every email of the site was
 * refused for an hour. So the CRM keeps to 60 an hour and leaves the rest free.
 */
export const HOURLY_SEND_LIMIT = 60

/** Emails the CRM has sent in the last hour, counted from the leads' own history. */
export function sentInLastHour(leads: Pick<Lead, 'emailHistory'>[], now = Date.now()): { count: number; freeAt: string | null } {
  const since = new Date(now - 3_600_000).toISOString()
  const times: string[] = []
  for (const l of leads) for (const e of l.emailHistory || []) if (e.status === 'sent' && e.at > since) times.push(e.at)
  times.sort()
  // When the oldest of them is an hour old, one place is free again
  return { count: times.length, freeAt: times.length ? new Date(Date.parse(times[0]) + 3_600_000).toISOString() : null }
}

/** How many more may go now. */
export const sendRoom = (leads: Pick<Lead, 'emailHistory'>[], now = Date.now()) => Math.max(0, HOURLY_SEND_LIMIT - sentInLastHour(leads, now).count)
