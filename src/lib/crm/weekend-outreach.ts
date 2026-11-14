import { mutateLeads, touch } from './store'
import { CAMPAIGN_KINDS, WEEKEND_EMAILS, type WeekendEmailKind } from '@/lib/weekend-emails'
import type { CohortSettings } from '@/lib/weekend'

/**
 * Where the AI Weekend campaign meets the CRM. The campaign's emails are written in lib/weekend-emails.ts and
 * sent from the AI Weekend page (to many chosen people) or from one lead's Emails board (to that lead). Either
 * way, what went to a lead is written on that lead, so the board and the email tracker show it beside the
 * nine-email series. Server only.
 */

/** The settings entry that holds what is the same for every weekend (the order of the campaign emails). */
export const ALL_WEEKENDS = '_all'

/** The campaign emails in the order staff gave them; anything they never placed follows in the written order. */
export function campaignOrder(settings: Record<string, CohortSettings>): WeekendEmailKind[] {
  const saved = (settings[ALL_WEEKENDS]?.order || []).filter((k): k is WeekendEmailKind => CAMPAIGN_KINDS.includes(k as WeekendEmailKind))
  return [...saved, ...CAMPAIGN_KINDS.filter((k) => !saved.includes(k))]
}

/** Who has had a campaign email that goes to chosen people: the invitation keeps its own list, the others share one. */
export const hadIt = (s: CohortSettings, kind: string): Record<string, string> => (kind === 'invite' ? s.invited : s.sentTo?.[kind]) || {}

/** The words of an email without its markup: what is kept on the lead, and what a person reads in the pop-up. */
export function emailText(html: string): string {
  return html
    .replace(/<(style|script|head|title)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/<(br|\/p|\/div|\/tr|\/h[1-6]|\/li|\/table)\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#10003;/g, '✓').replace(/&middot;/g, '·').replace(/&rarr;/g, '→')
    .replace(/[ \t ]+/g, ' ')
    .replace(/ ?\n ?/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export interface WeekendSend {
  email: string
  subject: string
  html: string
  /** The email service's own number for this send, so the CRM can ask later what became of it. */
  op?: string
  /** True when the email service has already finished sending it. */
  done?: boolean
}

/**
 * An AI Weekend campaign email went to these addresses: write it on the lead behind each address that has one.
 * Addresses that belong to no lead are left alone (the AI Weekend page keeps its own count of them).
 * `claim`: the lead becomes the sender's when it had no owner, as with the series. Returns how many leads were written to.
 */
export async function noteWeekendEmails(sends: WeekendSend[], kind: string, cohort: string, by: string, opts: { claim?: boolean; now?: string } = {}): Promise<number> {
  if (!sends.length) return 0
  const now = opts.now || new Date().toISOString()
  const title = WEEKEND_EMAILS.find((e) => e.kind === kind)?.title || kind
  return mutateLeads((leads) => {
    let n = 0
    for (const s of sends) {
      const address = s.email.trim().toLowerCase()
      const lead = leads.find((l) => !l.dumped && [l.email, ...(l.altEmails || [])].some((e) => (e || '').trim().toLowerCase() === address))
      if (!lead) continue
      lead.emailHistory.unshift({
        at: now, by, to: s.email, subject: s.subject, status: 'sent', body: emailText(s.html).slice(0, 4000), weekend: { kind, cohort },
        ...(s.op ? { op: s.op } : {}),
        ...(s.done ? { confirmedAt: now, confirmedBy: 'service' as const } : {}),
      })
      if (lead.status === 'new') lead.status = 'contacted'
      if (opts.claim && !lead.owner) lead.owner = by
      touch(lead, { at: now, by, type: 'email', description: `AI Weekend email ${s.done ? 'sent' : 'handed to the email service'}: ${title}` })
      n++
    }
    return n
  })
}
