import type { Lead } from './types'
import { isOpen, sequenceProgress } from './sequence'
import { lastContactAt, needsAnswer } from './replies'

/**
 * The lists of the Today page, worked out in one place so that the page and the morning email agree
 * (they used to count differently: the email called a lead "due" that the page had stopped listing).
 * Pure, so it runs in the browser and on the server.
 *
 * Every lead that needs someone sits in exactly one list:
 *   replies    they wrote to us and nobody has answered            answer these first
 *   talking    Talking or Proposal, the quietest first             follow up
 *   pool       nobody has picked them up yet                       pick up
 *   toStart    picked up, nothing sent                             send email 1
 *   due        the next email of the series is due                 send
 *   noEmail    no address to write to                              add one, or use LinkedIn
 *   finished   the series is over or stopped, and they never replied   close, or keep in touch by hand
 *   waiting    sent, the next email is not due yet                 nothing to do
 */
export interface TodayLists {
  replies: Lead[]
  talking: Lead[]
  pool: Lead[]
  toStart: Lead[]
  due: Lead[]
  noEmail: Lead[]
  finished: Lead[]
  waiting: Lead[]
  /** Every open lead this person holds (all of the lists above except replies and pool come from it). */
  mine: Lead[]
}

/** A conversation with no word either way for this many days is worth a follow-up. */
export const QUIET_DAYS = 4

/** Whole days since anything passed between us and this lead. */
export function quietDays(lead: Lead, now = Date.now()): number {
  const at = Date.parse(lastContactAt(lead))
  return Number.isNaN(at) ? 0 : Math.max(0, Math.floor((now - at) / 86_400_000))
}

/**
 * `me` is the person whose desk this is (lower case). `everyone` shows all held leads (a manager's view, and
 * the totals of the morning email).
 */
export function todayLists(leads: Lead[], me: string, everyone = false, now = Date.now()): TodayLists {
  const sees = (l: Lead) => everyone || !l.owner || l.owner.toLowerCase() === me
  // A reply is shown whatever step the lead is at: a closed lead who writes "actually, yes" must be seen
  const replies = leads.filter((l) => !l.dumped && needsAnswer(l) && sees(l)).sort((a, b) => (a.reply!.at < b.reply!.at ? -1 : 1))
  const waitingOnUs = new Set(replies.map((l) => l.id))

  const open = leads.filter((l) => isOpen(l) && !waitingOnUs.has(l.id))
  const pool = open.filter((l) => !l.owner)
  const mine = open.filter((l) => l.owner && (everyone || l.owner.toLowerCase() === me))
  const talking = mine.filter((l) => l.status === 'qualified' || l.status === 'proposal').sort((a, b) => quietDays(b, now) - quietDays(a, now))

  const inSeries = mine.filter((l) => l.status === 'new' || l.status === 'contacted')
  const noEmail = inSeries.filter((l) => !l.email)
  const toStart: Lead[] = [], due: Lead[] = [], waiting: Lead[] = [], finished: Lead[] = []
  for (const l of inSeries.filter((x) => x.email)) {
    const p = sequenceProgress(l, now)
    if (p.stopped || !p.next) finished.push(l)
    else if (p.sentIds.length === 0) toStart.push(l)
    else if (p.due) due.push(l)
    else waiting.push(l)
  }
  waiting.sort((a, b) => sequenceProgress(a, now).daysUntil - sequenceProgress(b, now).daysUntil)
  return { replies, talking, pool, toStart, due, noEmail, finished, waiting, mine }
}

/** How many leads need this person today: replies, conversations gone quiet, and emails to send. */
export function needsYou(t: TodayLists, now = Date.now()): number {
  return t.replies.length + t.talking.filter((l) => quietDays(l, now) >= QUIET_DAYS).length + t.toStart.length + t.due.length
}
