// The University Partnership campaign: types and the rules that need no server (they run in the browser too).
// Keep this file free of server-only imports. The store is ./universities-store.ts; the rules are in docs/CRM.md, section 15.

import type { EmailRecord } from './types'
import { shortFirstEmail } from '@/data/university-email-copy'
import type { Audience } from '@/data/partnership-campaigns'

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
// `code` is the short label on the course's tile; `why` is the one line that says what it gives a student.
export const UNI_COURSES = [
  { id: 'ai-103', slug: 'ai-103', code: 'AI-103', title: 'AI-103: Build and Ship AI Agents on Microsoft Azure', track: 'Certification Prep', level: 'Intermediate', scope: '164 lessons (8.9 hrs)', why: 'Prepares students for Microsoft\'s AI-103 exam by building working AI agents on Azure.' },
  { id: 'ai-500', slug: 'ai-500', code: 'AI-500', title: 'AI-500: Designing and Implementing Multi-Agent AI Solutions', track: 'Certification Prep', level: 'Expert', scope: '441 lessons (19.9 hrs)', why: 'For advanced students: systems where several AI agents work together, from design to production.' },
  { id: 'agent-ops', slug: 'agent-ops', code: 'AGENTS', title: 'AI Agents That Run a Business: Microsoft Foundry + Claude', track: 'Project', level: 'Intermediate', scope: '45 lessons (5.6 hrs)', why: 'A capstone-style project: agents that run real business processes, built with Foundry and Claude.' },
  { id: 'build-real-time-ai-on-microsoft-fabric', slug: 'build-real-time-ai-on-microsoft-fabric', code: 'FABRIC', title: 'Build Real-Time AI on Microsoft Fabric', track: 'Project', level: 'Intermediate', scope: '27 lessons (3.1 hrs)', why: 'Live data and AI on Microsoft Fabric, built step by step into a working solution.' },
  { id: 'ai-foundations', slug: 'ai-foundations', code: 'BASICS', title: 'AI Foundations', track: 'Use Case', level: 'Beginner', scope: '9 lessons (0.8 hrs)', why: 'A clear first step into AI for students and staff of any discipline.' },
  { id: 'ai-governance-risk-and-boards', slug: 'ai-governance-risk-and-boards', code: 'GOVERN', title: 'AI Governance, Risk and Boards', track: 'Use Case', level: 'Intermediate', scope: '9 lessons (0.6 hrs)', why: 'How an institution adopts AI safely: risk, policy and oversight.' },
  { id: 'ai-strategy-for-the-c-suite', slug: 'ai-strategy-for-the-c-suite', code: 'LEAD', title: 'AI Strategy for the C-Suite', track: 'Use Case', level: 'Intermediate', scope: '9 lessons (0.6 hrs)', why: 'For leaders deciding where AI fits and how to measure what it delivers.' },
] as const
export const UNI_COURSE_IDS: string[] = UNI_COURSES.map((c) => c.id)

/** The start of the note on every code made by the evaluation form, so they can be found again (lib/lms-coupons.ts). */
export const EVALUATION_NOTE = 'University evaluation'

/** What a university may tell us it cares about, in the evaluation form. */
export const UNI_AREAS = [
  { id: 'microsoft', label: 'Microsoft Azure, AI, Copilot, Fabric and Power Platform certification prep' },
  { id: 'claude', label: 'Anthropic Claude training and certifications (CCAS-F, CCDV-F, CCAR-F, CCAR-P, Claude Code)' },
  { id: 'capstones', label: 'Project-based Agentic AI capstone programs for students' },
  { id: 'lms', label: 'A white-label university LMS (cloud or on-premises, with a built-in AI assistant)' },
  { id: 'faculty', label: 'Faculty Development Programs or campus AI Weekend bootcamps' },
  { id: 'literacy', label: 'Campus-wide AI literacy (48 one-hour interactive AI Essentials courses)' },
] as const
export const UNI_AREA_IDS: string[] = UNI_AREAS.map((a) => a.id)
export const UNI_WALKTHROUGH = [
  { id: 'call', label: 'Yes, please suggest times for a 20-minute call' },
  { id: 'later', label: 'Not yet, we will evaluate the course(s) first' },
  { id: 'lms', label: 'Please also send details of the white-label university LMS' },
] as const
export type UniWalkthrough = '' | (typeof UNI_WALKTHROUGH)[number]['id']

/** Every email of this campaign goes out as the admin mailbox, with these two in copy (owner, 27 November 2026). */
export const CAMPAIGN_FROM = 'admin@gennoor.com'
export const CAMPAIGN_CC = ['jalalkhan@gennoor.com', 'yusufchaudhary@gennoor.com']
/** What the email files say where the evaluation form's link goes. */
export const FORM_TOKEN = '{{FORM_URL}}'
/** The evaluation form is our own page (owner, 27 November 2026: "nothing on google ... everything for ours"). */
export const FORM_SITE = 'https://www.gennoor.com'
/** A university's own key to the form: 24 hex characters, made on the server, never typed by anyone. */
export const FORM_KEY = /^[a-f0-9]{24}$/
/** The university's own link to the form, so its answer arrives on its page. '' before its key exists. */
export const formLinkOf = (u: { formKey?: string }): string => (u.formKey && FORM_KEY.test(u.formKey) ? `${FORM_SITE}/evaluate/${u.formKey}` : '')
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

/** One answer to the evaluation form, as checked by `cleanFormAnswer`. */
export interface UniFormAnswer {
  id: string
  at: string
  /** The university whose link was used, or '' for the general link. Never taken from what was typed. */
  uni: string
  institution: string
  place: string
  department: string
  reps: Array<{ name: string; title: string; email: string }>
  courses: string[]
  areas: string[]
  walkthrough: UniWalkthrough
  notes: string
  /** One evaluation code for each course chosen, course -> code (lib/complimentary.ts), when they were made. */
  coupons?: Record<string, string>
}

export interface University extends Omit<SeedUniversity, 'draft'> {
  /** The key in the university's own form link (`formLinkOf`). Made by the store. */
  formKey?: string
  /** Answers to the form that came through its link, newest first. */
  formAnswers?: UniFormAnswer[]
  /** The Teams meeting of the call, when it was booked from the CRM. */
  callLink?: string
  /** Who is working this university, in lower case; '' or missing when nobody has picked it up yet. */
  owner?: string
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
export interface UniDoc {
  /** 2 since the first emails were made short (27 November 2026). */
  version: 1 | 2
  universities: University[]
  /** Answers that came through the general link: a person attaches each to its university. */
  unmatched: UniFormAnswer[]
}

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

/**
 * What a stranger sent through the evaluation form, rebuilt from what we allow (docs/SECURITY.md). Every field is
 * named here and cut to its length; a course, an area or a choice that is not one of ours is dropped; an address is
 * an address or the answer is refused. `honeypot` is a field people cannot see: when it is filled, a machine filled it.
 */
export function cleanFormAnswer(input: unknown, allowedCourses: string[] = UNI_COURSE_IDS): { ok: true; answer: Omit<UniFormAnswer, 'id' | 'at' | 'uni'>; machine: boolean } | { ok: false; error: string } {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { ok: false, error: 'The form is empty.' }
  const p = input as Record<string, unknown>
  const machine = oneLineText(p.website, 200) !== ''
  const institution = oneLineText(p.institution, 160)
  const place = oneLineText(p.place, 120)
  const department = oneLineText(p.department, 160)
  if (!institution || !place || !department) return { ok: false, error: 'Please give the university, its country and city, and the department.' }
  const repsIn = Array.isArray(p.reps) ? p.reps : []
  if (repsIn.length < 1 || repsIn.length > 2) return { ok: false, error: 'Please give one or two representatives.' }
  const reps: UniFormAnswer['reps'] = []
  for (const [i, r] of (repsIn as Array<Record<string, unknown>>).entries()) {
    const name = oneLineText(r?.name, 120)
    const title = oneLineText(r?.title, 120)
    const email = String(r?.email ?? '').trim().toLowerCase()
    if (i > 0 && !name && !email) continue
    if (!name || !isEmail(email)) return { ok: false, error: i === 0 ? 'Please give the representative\'s name and official email.' : 'The second representative needs a name and a valid email, or leave both empty.' }
    if (i === 0 && !title) return { ok: false, error: 'Please give the representative\'s designation.' }
    reps.push({ name, title, email })
  }
  const pick = (v: unknown, allowed: string[]) => [...new Set((Array.isArray(v) ? v : []).filter((x): x is string => typeof x === 'string' && allowed.includes(x)))]
  // Up to two, from the live Learning Studio list the route passes in (owner, 27 November 2026)
  const courses = pick(p.courses, allowedCourses).slice(0, 2)
  if (!courses.length) return { ok: false, error: 'Please choose at least one course.' }
  const areas = pick(p.areas, UNI_AREA_IDS)
  const walkthrough = (UNI_WALKTHROUGH.map((w) => w.id) as string[]).includes(p.walkthrough as string) ? (p.walkthrough as UniWalkthrough) : ''
  return { ok: true, machine, answer: { institution, place, department, reps, courses, areas, walkthrough, notes: manyLinesText(p.notes, 2000).trim() } }
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
export function whyNotReady(uni: Pick<University, 'draft' | 'formKey'>): string {
  const d = uni.draft
  const formUrl = formLinkOf(uni)
  if (!d.to.length) return 'There is no address to send to yet. Add one under To.'
  if (!d.subject.trim()) return 'The email has no subject.'
  if (!d.body.trim()) return 'The email has no words.'
  const hasToken = d.body.includes(FORM_TOKEN) || d.subject.includes(FORM_TOKEN)
  if (hasToken && !formUrl) return 'This university has no form link yet. Press Refresh, and it is made.'
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
    .replace(/\[(?:University|Institution|Organization|Organisation|College) Name\]/g, short)
    .replace('[Name]', name || '[Name]')
    .replace(/\[Department Name\]/g, u.department || '[Department Name]')
    .replace('[Insert Google Form Link]', FORM_TOKEN)
  const to = [primary?.email, ...u.contacts.filter((c) => c !== primary && /^primary/i.test(c.order)).map((c) => c.email)].filter((e): e is string => !!e && isEmail(e))
  const cc = u.contacts.filter((c) => /^secondary/i.test(c.order)).map((c) => c.email).filter((e) => isEmail(e) && !to.includes(e))
  return { subject: swap(master.subject), body: swap(master.body), to: [...new Set(to)].slice(0, MAX_TO), cc: [...new Set(cc)].slice(0, MAX_TO), toLabel: primary ? `${primary.name} · ${primary.designation}` : u.decisionMaker }
}

/** The first email of a university in its short form (src/data/university-email-copy.ts), its copy list without Jalal and Yusuf. */
export function shortDraft(s: SeedUniversity, master: MasterEmail, audience: Audience = 'academic'): UniDraft {
  const d = s.draft ? { ...s.draft, cc: s.draft.cc.filter((e) => !CAMPAIGN_CC.includes(e)) } : draftFromMaster(s, master)
  return { ...d, body: shortFirstEmail(d.body, s.id, audience) }
}

/** Turns the seed into a stored university. */
export function universityFromSeed(s: SeedUniversity, master: MasterEmail, now = new Date().toISOString(), audience: Audience = 'academic'): University {
  const { draft, ...rest } = s
  return {
    ...rest,
    wave: s.priority === 'High' ? 1 : 2,
    stage: 'new',
    draft: shortDraft(s, master, audience),
    emails: [], replies: [], formAnswers: [], evaluation: null, callOn: '', notes: '', closedReason: '', activities: [], updatedAt: now,
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

/**
 * What an answer to the form does to its university: the courses and the people are put on the evaluation (unless
 * access has already been given), and a university that had not answered yet moves to Replied. A machine never
 * moves it further: giving access is a person's step.
 */
export function applyFormAnswer(u: University, a: UniFormAnswer): void {
  u.formAnswers = [a, ...(u.formAnswers || []).filter((x) => x.id !== a.id)].slice(0, 10)
  const ev = u.evaluation
  if (!ev?.grantedAt) {
    u.evaluation = {
      courses: [...new Set([...(ev?.courses || []), ...a.courses])],
      reps: a.reps.slice(0, 2).map((r) => ({ name: r.name, email: r.email })),
      requestedAt: ev?.requestedAt || a.at.slice(0, 10),
      grantedAt: '',
    }
  }
  if (u.stage === 'new' || u.stage === 'emailed') u.stage = 'replied'
}

/** They wrote and nobody has answered or pressed "No reply needed". */
export const waitingForAnswer = (u: Pick<University, 'replies'>) => u.replies.some((r) => !r.handled)
