// What to do next for one university, and how the whole campaign is moving. Pure, so a check can run it on made-up
// universities and the browser can run it on the real ones (docs/CRM.md, section 15).

import {
  UNI_COURSES, UNI_STAGES, waitingForAnswer, whyNotReady,
  type University, type UniStage,
} from './universities-types'

const DAY_MS = 86_400_000
const daysBetween = (fromIso: string, to: number) => Math.max(0, Math.floor((to - Date.parse(fromIso)) / DAY_MS))

/** The days since the first email that went, or null when none has. */
export function daysSinceFirstEmail(u: Pick<University, 'emails'>, now = Date.now()): number | null {
  const first = u.emails.filter((e) => e.status === 'sent').map((e) => e.at).sort()[0]
  return first ? daysBetween(first, now) : null
}

/** Write again after this many days without an answer. */
export const REPLY_AFTER_DAYS = 5
/** The debrief call is asked for five to seven days after access is given (the toolkit's own workflow). */
export const FOLLOW_UP_DAYS = 5

export type NextTab = 'email' | 'evaluation' | 'overview' | 'contacts'
export interface NextStep { text: string; tab: NextTab; urgent: boolean }

/** The one thing to do now for this university, in plain words. `null` when nothing is waiting on us. */
export function nextStep(u: University, now = Date.now()): NextStep | null {
  if (u.stage === 'partner' || u.stage === 'closed') return null
  if (waitingForAnswer(u)) return { text: 'They wrote back. Answer them from Outlook, then press "No reply needed".', tab: 'email', urgent: true }
  if (u.emails[0]?.status === 'failed' && !u.emails.some((e) => e.status === 'sent')) return { text: 'The email did not go. Look at why and send it again.', tab: 'email', urgent: true }
  const days = daysSinceFirstEmail(u, now)
  if (u.stage === 'new' || days === null) {
    const why = whyNotReady(u)
    return why ? { text: why, tab: 'email', urgent: false } : { text: 'Read the email and send it.', tab: 'email', urgent: false }
  }
  if (u.stage === 'emailed') {
    return days >= REPLY_AFTER_DAYS
      ? { text: `No answer after ${days} days. Write again, or call the office.`, tab: 'email', urgent: true }
      : { text: `Waiting for an answer (day ${days}).`, tab: 'email', urgent: false }
  }
  if (u.stage === 'replied') return u.formAnswers?.length
    ? { text: 'They chose courses in the form. Give their faculty access, then send "Access is ready".', tab: 'evaluation', urgent: true }
    : { text: 'They are interested. Note the courses they chose and give their faculty access.', tab: 'evaluation', urgent: false }
  if (u.stage === 'evaluating') {
    const granted = u.evaluation?.grantedAt
    if (!granted) return { text: 'Give their faculty access to the courses they chose.', tab: 'evaluation', urgent: true }
    const d = daysBetween(granted, now)
    return d >= FOLLOW_UP_DAYS
      ? { text: `Access was given ${d} days ago. Ask for a 20-minute debrief call.`, tab: 'email', urgent: true }
      : { text: `Faculty are evaluating (day ${d}). Ask for a call in a few days.`, tab: 'evaluation', urgent: false }
  }
  if (u.stage === 'call') {
    if (!u.callOn) return { text: 'Put the date of the call on this page.', tab: 'overview', urgent: false }
    return Date.parse(`${u.callOn}T23:59:59`) < now
      ? { text: 'The call date has passed. Note how it went, and move it to Partner or Closed.', tab: 'overview', urgent: true }
      : { text: `Call on ${u.callOn}.`, tab: 'overview', urgent: false }
  }
  return null
}

export interface Group { total: number; emailed: number; replied: number; evaluating: number; partner: number }
export interface CampaignStats {
  total: number
  stages: Record<UniStage, number>
  /** How far each university has ever got, whatever stage it is in now. */
  funnel: Array<{ key: string; label: string; count: number }>
  emailsSent: number
  failed: number
  replied: number
  /** Share of the emailed universities that have written back, 0-100. */
  replyRate: number
  /** Median days from the first email to the first reply, or null before there are replies. */
  medianReplyDays: number | null
  byWave: Array<Group & { wave: 1 | 2 }>
  byRegion: Array<Group & { region: string }>
  /** Emails that went, a column for each of the last 14 days (oldest first). */
  perDay: Array<{ day: string; sent: number }>
  attention: Array<{ id: string; name: string; text: string; tab: NextTab }>
  upcomingCalls: Array<{ id: string; name: string; on: string }>
  readyToSend: number
  /** Answers to the evaluation form: all of them, and those that came through the general link and wait to be attached. */
  formAnswers: number
  unmatched: number
  coursesChosen: Array<{ id: string; title: string; count: number }>
}

const reached = (u: University) => ({
  emailed: u.emails.some((e) => e.status === 'sent') || u.stage !== 'new',
  replied: u.replies.length > 0 || Boolean(u.formAnswers?.length) || ['replied', 'evaluating', 'call', 'partner'].includes(u.stage),
  evaluating: Boolean(u.evaluation?.grantedAt) || ['evaluating', 'call', 'partner'].includes(u.stage),
  call: Boolean(u.callOn) || ['call', 'partner'].includes(u.stage),
  partner: u.stage === 'partner',
})

function groupOf(members: University[]): Group {
  const r = members.map(reached)
  return { total: members.length, emailed: r.filter((x) => x.emailed).length, replied: r.filter((x) => x.replied).length, evaluating: r.filter((x) => x.evaluating).length, partner: r.filter((x) => x.partner).length }
}

export function campaignStats(unis: University[], now = Date.now(), unmatched = 0): CampaignStats {
  const stages = Object.fromEntries(UNI_STAGES.map((s) => [s, unis.filter((u) => u.stage === s).length])) as Record<UniStage, number>
  const r = unis.map(reached)
  const count = (k: keyof ReturnType<typeof reached>) => r.filter((x) => x[k]).length
  const emailed = count('emailed')
  const replied = count('replied')
  const funnel = [
    { key: 'total', label: 'In the campaign', count: unis.length },
    { key: 'emailed', label: 'Emailed', count: emailed },
    { key: 'replied', label: 'Replied', count: replied },
    { key: 'evaluating', label: 'Evaluating', count: count('evaluating') },
    { key: 'call', label: 'Call booked', count: count('call') },
    { key: 'partner', label: 'Partner', count: count('partner') },
  ]

  const replyDays: number[] = []
  for (const u of unis) {
    const first = u.emails.filter((e) => e.status === 'sent').map((e) => e.at).sort()[0]
    const firstReply = [...u.replies].map((x) => x.at).sort()[0]
    if (first && firstReply && firstReply >= first) replyDays.push(Math.round(((Date.parse(firstReply) - Date.parse(first)) / DAY_MS) * 10) / 10)
  }
  replyDays.sort((a, b) => a - b)
  const n = replyDays.length
  const median = n ? (n % 2 ? replyDays[(n - 1) / 2] : (replyDays[n / 2 - 1] + replyDays[n / 2]) / 2) : null

  const byWave = ([1, 2] as const).map((wave) => ({ wave, ...groupOf(unis.filter((u) => u.wave === wave)) })).filter((g) => g.total > 0)
  const regions = [...new Set(unis.map((u) => u.region))]
  const byRegion = regions.map((region) => ({ region, ...groupOf(unis.filter((u) => u.region === region)) })).sort((a, b) => b.total - a.total || a.region.localeCompare(b.region))

  const perDay: Array<{ day: string; sent: number }> = []
  for (let i = 13; i >= 0; i--) {
    const day = new Date(now - i * DAY_MS).toISOString().slice(0, 10)
    perDay.push({ day, sent: unis.reduce((total, u) => total + u.emails.filter((e) => e.status === 'sent' && e.at.slice(0, 10) === day).length, 0) })
  }

  const attention: CampaignStats['attention'] = []
  for (const u of unis) {
    const step = nextStep(u, now)
    if (step?.urgent) attention.push({ id: u.id, name: u.name, text: step.text, tab: step.tab })
  }
  // Those who wrote to us come first
  attention.sort((a, b) => Number(/wrote back/.test(b.text)) - Number(/wrote back/.test(a.text)))

  const chosen = new Map<string, number>()
  for (const u of unis) for (const c of u.evaluation?.courses || []) chosen.set(c, (chosen.get(c) || 0) + 1)

  return {
    total: unis.length, stages, funnel,
    emailsSent: unis.reduce((total, u) => total + u.emails.filter((e) => e.status === 'sent').length, 0),
    failed: unis.reduce((total, u) => total + u.emails.filter((e) => e.status === 'failed').length, 0),
    replied,
    replyRate: emailed ? Math.round((replied / emailed) * 100) : 0,
    medianReplyDays: median,
    byWave, byRegion, perDay, attention,
    upcomingCalls: unis
      .filter((u) => u.stage === 'call' && u.callOn && Date.parse(`${u.callOn}T23:59:59`) >= now)
      .map((u) => ({ id: u.id, name: u.name, on: u.callOn }))
      .sort((a, b) => a.on.localeCompare(b.on)),
    readyToSend: unis.filter((u) => u.stage === 'new' && !u.emails.length && !whyNotReady(u)).length,
    formAnswers: unis.reduce((total, u) => total + (u.formAnswers?.length || 0), 0) + unmatched,
    unmatched,
    coursesChosen: UNI_COURSES.map((c) => ({ id: c.id, title: c.title, count: chosen.get(c.id) || 0 })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count),
  }
}
