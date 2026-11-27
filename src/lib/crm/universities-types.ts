// The University Partnership campaign: types and the rules that need no server (they run in the browser too).
// Keep this file free of server-only imports. The store is ./universities-store.ts; the rules are in docs/CRM.md, section 15.

import type { EmailRecord } from './types'

/** Where a university stands. One axis, like the leads' steps, but its own: this campaign is closed end to end here. */
export type UniStage = 'new' | 'emailed' | 'replied' | 'evaluating' | 'call' | 'partner' | 'closed'
export const UNI_STAGES: UniStage[] = ['new', 'emailed', 'replied', 'evaluating', 'call', 'partner', 'closed']
export const UNI_STAGE_LABELS: Record<UniStage, string> = {
  new: 'New', emailed: 'Emailed', replied: 'Replied', evaluating: 'Evaluating', call: 'Call booked', partner: 'Partner', closed: 'Closed',
}
// A stage is named for what has happened, never for something in progress (docs/CRM.md, section 1).
export const UNI_STAGE_HINTS: Record<UniStage, string> = {
  new: 'Nothing sent yet',
  emailed: 'The first email has gone, no reply yet',
  replied: 'Someone at the university wrote back',
  evaluating: 'Their faculty have been given course access',
  call: 'A call or demo with them is booked',
  partner: 'They are going ahead with a partnership',
  closed: 'Not going ahead for now',
}

/** The seven courses of the Learning Studio's Certifications & Projects section that a university may evaluate. */
export const UNI_COURSES = [
  { id: 'ai-103', title: 'AI-103: Build and Ship AI Agents on Microsoft Azure', track: 'Certification Prep', level: 'Intermediate', scope: '164 lessons (8.9 hrs)' },
  { id: 'ai-500', title: 'AI-500: Designing and Implementing Multi-Agent AI Solutions', track: 'Certification Prep', level: 'Expert', scope: '441 lessons (19.9 hrs)' },
  { id: 'agents-business', title: 'AI Agents That Run a Business: Microsoft Foundry + Claude', track: 'Project', level: 'Intermediate', scope: '45 lessons (5.6 hrs)' },
  { id: 'fabric-realtime', title: 'Build Real-Time AI on Microsoft Fabric', track: 'Project', level: 'Intermediate', scope: '27 lessons (3.1 hrs)' },
  { id: 'ai-foundations', title: 'AI Foundations', track: 'Use Case', level: 'Beginner', scope: '9 lessons (0.8 hrs)' },
  { id: 'ai-governance', title: 'AI Governance, Risk and Boards', track: 'Use Case', level: 'Intermediate', scope: '9 lessons (0.6 hrs)' },
  { id: 'ai-strategy', title: 'AI Strategy for the C-Suite', track: 'Use Case', level: 'Intermediate', scope: '9 lessons (0.6 hrs)' },
] as const
export const UNI_COURSE_IDS: string[] = UNI_COURSES.map((c) => c.id)

/** Every email of this campaign goes out as the admin mailbox, with these two in copy (owner, 27 November 2026). */
export const CAMPAIGN_FROM = 'admin@gennoor.com'
export const CAMPAIGN_CC = ['jalalkhan@gennoor.com', 'yusufchaudhary@gennoor.com']
/** What the email files say where the evaluation form's link goes. */
export const FORM_TOKEN = '{{FORM_URL}}'
/** The most addresses on one line (To, or Cc). */
export const MAX_TO = 6

// ---------------------------------------------------------------------------------------------------------------
// Shapes

export interface UniContact {
  id: string; name: string; designation: string; email: string; emailNote: string; status: string
  linkedin: string; phone: string; department: string; source: string; notes: string; order: string
}
export interface UniDraft { subject: string; body: string; to: string[]; cc: string[]; toLabel?: string; pitch?: string }
export interface SeedUniversity {
  id: string; name: string; region: string; country: string; city: string; website: string; type: string
  department: string; departmentUrl: string; decisionMaker: string; designation: string; officialEmail: string
  emailStatus: string; phone: string; evidence: string; offering: string; priority: string; hook: string; sourceUrl: string
  contacts: UniContact[]
  draft: UniDraft | null
}
export interface MasterEmail { subject: string; body: string }
export interface CountryNote { country: string; region: string; tier: string; proof: string; entry: string; why: string }

/** An email of the campaign. It is an EmailRecord so `sendState()` (lib/crm/delivery.ts) reads it as it reads a lead's. */
export type UniEmail = EmailRecord & { kind: 'first' | 'again' }
export interface UniReply { id: string; at: string; from: string; fromName: string; subject: string; preview: string; handled?: boolean }
export interface UniActivity { at: string; by: string; type: string; description: string }
export interface UniEvaluation {
  courses: string[]
  reps: Array<{ name: string; email: string }>
  /** YYYY-MM-DD */ requestedAt: string
  /** YYYY-MM-DD */ grantedAt: string
}

export interface University extends Omit<SeedUniversity, 'draft'> {
  stage: UniStage
  /** 1 for the High priority first wave, 2 for the rest. */
  wave: 1 | 2
  draft: UniDraft
  emails: UniEmail[]
  replies: UniReply[]
  evaluation: UniEvaluation | null
  /** YYYY-MM-DD, or ''. */ callOn: string
  notes: string
  closedReason: string
  activities: UniActivity[]
  /** Set while a send is in progress, so two presses cannot send the same email twice. */
  sendingSince?: string
  updatedAt: string
}
export interface UniSettings { formUrl: string }
export interface UniDoc { version: 1; settings: UniSettings; universities: University[] }

// ---------------------------------------------------------------------------------------------------------------
// Words and addresses that arrive are a stranger's until checked (docs/SECURITY.md). One gate each.

const control = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f\u2028\u2029]/g
/** A line of text: no line breaks, no control characters, cut to `max`. */
export const oneLineText = (v: unknown, max: number): string => String(v ?? '').replace(control, '').replace(/\s+/g, ' ').trim().slice(0, max)
/** Several lines of text: control characters out, `\r\n` made `\n`, cut to `max`. */
export const manyLinesText = (v: unknown, max: number): string => String(v ?? '').replace(/\r\n?/g, '\n').replace(control, '').slice(0, max)

const EMAIL = /^[^\s@<>"',;()[\]\\]+@[^\s@<>"',;()[\]\\]+\.[^\s@<>"',;()[\]\\]{2,}$/
export const isEmail = (v: unknown): v is string => typeof v === 'string' && v.length <= 254 && EMAIL.test(v)

/** A list of addresses, each checked and in lower case, with no repeats. `null` when anything in it is not an address. */
export function cleanEmails(v: unknown, max = MAX_TO): string[] | null {
  if (v === undefined || v === null || v === '') return []
  if (!Array.isArray(v) || v.length > max) return null
  const out: string[] = []
  for (const item of v) {
    const e = typeof item === 'string' ? item.trim().toLowerCase() : ''
    if (!isEmail(e)) return null
    if (!out.includes(e)) out.push(e)
  }
  return out
}

/** Where the evaluation form is. Read as a link and judged by its host, never by looking for a word in its text. */
const FORM_HOSTS = ['docs.google.com', 'forms.gle', 'forms.office.com', 'forms.microsoft.com']
export function safeFormUrl(v: unknown): string {
  const text = String(v ?? '').trim()
  if (!text || text.length > 400) return ''
  try {
    const url = new URL(text)
    if (url.protocol !== 'https:' || url.username || url.password) return ''
    const host = url.hostname.toLowerCase()
    if (!FORM_HOSTS.includes(host) && host !== 'gennoor.com' && !host.endsWith('.gennoor.com')) return ''
    return url.href
  } catch { return '' }
}

const day = /^\d{4}-\d{2}-\d{2}$/
const isDay = (v: unknown): v is string => typeof v === 'string' && day.test(v) && !Number.isNaN(Date.parse(v))

export interface UniPatch {
  stage?: UniStage
  notes?: string
  closedReason?: string
  callOn?: string
  draft?: Pick<UniDraft, 'subject' | 'body' | 'to' | 'cc'>
  evaluation?: UniEvaluation | null
}

/**
 * What a person may change on a university, and nothing else. Every field is named here: a field that is not
 * named is dropped, so the browser cannot write the history of sent emails, the replies or the id.
 */
export function cleanUniPatch(input: unknown): { ok: true; patch: UniPatch } | { ok: false; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, error: 'Nothing to change' }
  const p = input as Record<string, unknown>
  const patch: UniPatch = {}
  if ('stage' in p) {
    if (!UNI_STAGES.includes(p.stage as UniStage)) return { ok: false, error: 'That stage does not exist' }
    patch.stage = p.stage as UniStage
  }
  if ('notes' in p) patch.notes = manyLinesText(p.notes, 4000)
  if ('closedReason' in p) patch.closedReason = oneLineText(p.closedReason, 300)
  if ('callOn' in p) {
    if (p.callOn !== '' && !isDay(p.callOn)) return { ok: false, error: 'The date of the call is not a date' }
    patch.callOn = String(p.callOn)
  }
  if ('draft' in p) {
    const d = p.draft as Record<string, unknown> | null
    if (!d || typeof d !== 'object') return { ok: false, error: 'The email is missing' }
    const to = cleanEmails(d.to)
    const cc = cleanEmails(d.cc)
    if (!to) return { ok: false, error: 'One of the To addresses is not an email address' }
    if (!cc) return { ok: false, error: 'One of the Cc addresses is not an email address' }
    patch.draft = { subject: oneLineText(d.subject, 200), body: manyLinesText(d.body, 12000), to, cc }
  }
  if ('evaluation' in p) {
    const e = p.evaluation as Record<string, unknown> | null
    if (e === null) patch.evaluation = null
    else {
      if (!e || typeof e !== 'object') return { ok: false, error: 'The evaluation is missing' }
      const courses = Array.isArray(e.courses) ? e.courses.filter((c): c is string => typeof c === 'string' && UNI_COURSE_IDS.includes(c)) : []
      const repsIn = Array.isArray(e.reps) ? e.reps : []
      if (repsIn.length > 2) return { ok: false, error: 'Two representatives at most' }
      const reps: UniEvaluation['reps'] = []
      for (const r of repsIn as Array<Record<string, unknown>>) {
        const email = String(r?.email ?? '').trim().toLowerCase()
        if (!isEmail(email)) return { ok: false, error: 'A representative has no valid email address' }
        reps.push({ name: oneLineText(r.name, 120), email })
      }
      for (const k of ['requestedAt', 'grantedAt'] as const) if (e[k] !== '' && !isDay(e[k])) return { ok: false, error: 'A date of the evaluation is not a date' }
      patch.evaluation = { courses: [...new Set(courses)], reps, requestedAt: String(e.requestedAt || ''), grantedAt: String(e.grantedAt || '') }
    }
  }
  return Object.keys(patch).length ? { ok: true, patch } : { ok: false, error: 'Nothing to change' }
}

// ---------------------------------------------------------------------------------------------------------------
// The email

/** Words in square brackets that are still to be written ("[Insert 1-sentence ...]", "[University Name]"). */
export function unfilled(text: string): string[] {
  return [...new Set((text.match(/\[[^\]\n]{2,240}\]/g) || []).map((s) => s.slice(0, 60)))]
}

/** The email as it will leave: the form's link put in place of its token. */
export function withForm(text: string, formUrl: string): string {
  return formUrl ? text.split(FORM_TOKEN).join(formUrl) : text
}

/** What stops this email from going, in plain words, or '' when nothing does. */
export function whyNotReady(uni: Pick<University, 'draft'>, formUrl: string): string {
  const d = uni.draft
  if (!d.to.length) return 'There is no address to send to yet. Add one under To.'
  if (!d.subject.trim()) return 'The email has no subject.'
  if (!d.body.trim()) return 'The email has no words.'
  const hasToken = d.body.includes(FORM_TOKEN) || d.subject.includes(FORM_TOKEN)
  if (hasToken && !formUrl) return 'The evaluation form\'s link is not set. Paste it under Setup first.'
  const left = unfilled(`${d.subject}\n${withForm(d.body, formUrl)}`)
  if (left.length) return `Still to write: ${left.slice(0, 3).join(' · ')}`
  return ''
}

/**
 * Which paragraph (counting from 0, split on blank lines) the Claude Partner Network card goes under: the first one
 * that names Claude. -1 when none does. The email and its preview use this one rule.
 */
export function claudeCardAfter(text: string): number {
  return text.split(/\n{2,}/).findIndex((p) => /\bClaude\b/.test(p))
}

const TITLES =/^(dr|prof|professor|eng|mr|mrs|ms|miss|sir|dean|assoc|assistant|ir|engr)\.?$/i
/** "Dear Prof. Darwish" from "Prof. Ashraf Darwish"; "Dear Cheryl" from "Cheryl Middleton"; '' when there is no name. */
export function salutation(fullName: string): string {
  const words = fullName.replace(/\([^)]*\)/g, '').split(/\s+/).filter(Boolean)
  if (!words.length) return ''
  const titles: string[] = []
  while (words.length > 1 && TITLES.test(words[0])) titles.push(words.shift() as string)
  if (titles.length && words.length) return `${titles.join(' ')} ${words[words.length - 1]}`
  return words[0]
}

/**
 * A first email for a university that has none written, from the master email: the university's name, department
 * and the person's name put in. The one sentence about THEIR work is not made up: it stays in square brackets for a
 * person to write, and the email will not go while it does.
 */
export function draftFromMaster(u: Pick<SeedUniversity, 'name' | 'department' | 'decisionMaker' | 'contacts' | 'officialEmail'>, master: MasterEmail): UniDraft {
  const primary = u.contacts.find((c) => /^primary/i.test(c.order)) || u.contacts[0]
  const name = salutation(primary?.name || u.decisionMaker)
  const short = u.name.replace(/\s*\([^)]*\)\s*$/, '')
  const swap = (t: string) => t
    .replace('[Title & Last Name]', name || '[Title & Last Name]')
    .replace(/\[University Name\]/g, short)
    .replace(/\[Department Name\]/g, u.department || '[Department Name]')
    .replace('[Insert Google Form Link]', FORM_TOKEN)
  const to = [primary?.email, ...u.contacts.filter((c) => c !== primary && /^primary/i.test(c.order)).map((c) => c.email)].filter((e): e is string => !!e && isEmail(e))
  const cc = u.contacts.filter((c) => /^secondary/i.test(c.order)).map((c) => c.email).filter((e) => isEmail(e) && !to.includes(e))
  return { subject: swap(master.subject), body: swap(master.body), to: [...new Set(to)].slice(0, MAX_TO), cc: [...new Set(cc)].slice(0, MAX_TO), toLabel: primary ? `${primary.name} · ${primary.designation}` : u.decisionMaker }
}

/** Turns the seed into a stored university. */
export function universityFromSeed(s: SeedUniversity, master: MasterEmail, now = new Date().toISOString()): University {
  const { draft, ...rest } = s
  return {
    ...rest,
    wave: s.priority === 'High' ? 1 : 2,
    stage: 'new',
    draft: draft ? { ...draft, cc: draft.cc.filter((e) => !CAMPAIGN_CC.includes(e)) } : draftFromMaster(s, master),
    emails: [], replies: [], evaluation: null, callOn: '', notes: '', closedReason: '', activities: [], updatedAt: now,
  }
}

// ---------------------------------------------------------------------------------------------------------------
// Replies

const WEBMAIL = new Set(['gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com', 'yahoo.com', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'aol.com', 'msn.com'])
const AUTOMATIC = /out of office|automatic reply|auto-?reply|autoreply|undeliverable|delivery (has )?failed|delivery status|mail delivery|returned mail|vacation|away from/i
const domainOf = (email: string) => (email.split('@')[1] || '').toLowerCase()

/** Every address that belongs to a university: its contacts', the ones on its email, the representatives. */
export function addressesOf(u: Pick<University, 'contacts' | 'draft' | 'evaluation'>): string[] {
  return [...new Set([...u.contacts.map((c) => c.email), ...u.draft.to, ...u.draft.cc, ...(u.evaluation?.reps || []).map((r) => r.email)].map((e) => (e || '').toLowerCase()).filter(isEmail))]
}

/**
 * Which university a message from outside belongs to: the sender is one of its addresses, or writes from the same
 * mail domain as one (a colleague answers for the dean). A free webmail domain is never enough by itself. Mail that
 * arrived before our first email to them, and automatic mail, belongs to nobody.
 */
export function replyOwner(msg: { from: string; subject: string; receivedAt: string }, universities: University[]): University | null {
  const from = msg.from.toLowerCase()
  if (!isEmail(from) || AUTOMATIC.test(msg.subject)) return null
  const domain = domainOf(from)
  for (const u of universities) {
    const firstSent = u.emails.filter((e) => e.status === 'sent').map((e) => e.at).sort()[0]
    if (!firstSent || msg.receivedAt < firstSent) continue
    const addresses = addressesOf(u)
    if (addresses.includes(from)) return u
    if (!WEBMAIL.has(domain) && addresses.some((a) => domainOf(a) === domain)) return u
  }
  return null
}

/** They wrote and nobody has answered or pressed "No reply needed". */
export const waitingForAnswer = (u: Pick<University, 'replies'>) => u.replies.some((r) => !r.handled)
