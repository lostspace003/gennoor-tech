import type { Lead } from './types'

// The email series: the same methodical steps for every lead, spread over about
// four months. This file is the plan (what, when, why) and is safe to import in
// the browser. The HTML for each step lives in ./sequence-emails.ts.

export interface SequenceStep {
  /** Stable id, stored on the lead. Never rename one that has been sent. */
  id: string
  /** Days after the PREVIOUS step before this one is due (0 for the first). */
  gapDays: number
  /** Short name shown to the team. */
  title: string
  /** What this email is for, in one line. */
  purpose: string
  subject: string
  /** The Excel course catalogue rides along as an attachment. */
  attachCatalogue?: boolean
  /** Which part of the plan this belongs to. */
  phase: 'Introduce' | 'Show' | 'Offer' | 'Stay in touch'
}

export const SEQUENCE: SequenceStep[] = [
  {
    id: 'intro',
    gapDays: 0,
    phase: 'Introduce',
    title: 'Introduction',
    purpose: 'Who we are and the open Learning Studio their team can use today',
    subject: 'Training your team can start today, {company}',
  },
  {
    id: 'samples',
    gapDays: 4,
    phase: 'Show',
    title: 'See it for yourself',
    purpose: 'Sample courses to open, with the full catalogue attached',
    subject: 'Sample courses and our full catalogue',
    attachCatalogue: true,
  },
  {
    id: 'custom',
    gapDays: 6,
    phase: 'Offer',
    title: 'Built for your organization',
    purpose: 'Custom training and a learning platform of their own',
    subject: 'A training programme built around {company}',
  },
  {
    id: 'time',
    gapDays: 11,
    phase: 'Stay in touch',
    title: 'Less time in the classroom',
    purpose: 'How self-paced lessons plus trainer support shorten a 3 to 5 day course',
    subject: 'Cutting classroom days without cutting the learning',
  },
  {
    id: 'claude',
    gapDays: 14,
    phase: 'Stay in touch',
    title: 'Claude for your team',
    purpose: 'Claude training, certification preparation and automation',
    subject: 'Claude training and certification for your team',
  },
  {
    id: 'projects',
    gapDays: 15,
    phase: 'Stay in touch',
    title: 'Learning by building',
    purpose: 'Project-based courses where the team builds one real thing',
    subject: 'Courses where your team builds something real',
  },
  {
    id: 'support',
    gapDays: 20,
    phase: 'Stay in touch',
    title: 'Support after the training',
    purpose: 'The doubt desk and trainer hours that follow every programme',
    subject: 'What happens after the training ends',
  },
  {
    id: 'platform',
    gapDays: 20,
    phase: 'Stay in touch',
    title: 'Your own learning platform',
    purpose: 'A closer look at a platform set up for their organization',
    subject: 'A learning platform under your own name',
  },
  {
    id: 'checkin',
    gapDays: 25,
    phase: 'Stay in touch',
    title: 'Checking in',
    purpose: 'A short, polite last note that leaves the door open',
    subject: 'Should I keep sending these, {firstName}?',
  },
]

export const stepById = (id: string) => SEQUENCE.find((s) => s.id === id)
export const stepNumber = (id: string) => SEQUENCE.findIndex((s) => s.id === id) + 1

/** Total days from the first email to the last. */
export const SEQUENCE_DAYS = SEQUENCE.reduce((n, s) => n + s.gapDays, 0)

export function fillTokens(text: string, lead: Pick<Lead, 'name' | 'company'>): string {
  const first = (lead.name || '').trim().split(/\s+/)[0] || 'there'
  return text.replace(/\{firstName\}/g, first).replace(/\{company\}/g, lead.company?.trim() || 'your team')
}

export interface SequenceProgress {
  /** Steps already sent, in order. */
  sentIds: string[]
  /** The next step to send, or null when the series is finished or stopped. */
  next: SequenceStep | null
  /** When `next` becomes due (ISO). The first step is due at once. */
  dueAt: string | null
  /** True when `next` can be sent now. */
  due: boolean
  /** Whole days until due (0 when due); for "next email in 3 days". */
  daysUntil: number
  finished: boolean
  stopped: boolean
}

/** Where a lead is in the series. Pure, so the browser and the server agree. */
export function sequenceProgress(lead: Pick<Lead, 'sequence'>, now = Date.now()): SequenceProgress {
  const sent = lead.sequence?.sent || []
  const sentIds = sent.map((s) => s.step)
  const stopped = !!lead.sequence?.stopped
  const next = SEQUENCE.find((s) => !sentIds.includes(s.id)) || null
  if (!next || stopped) {
    return { sentIds, next: stopped ? null : next, dueAt: null, due: false, daysUntil: 0, finished: !next, stopped }
  }
  const last = sent.length ? sent.reduce((a, b) => (a.at > b.at ? a : b)) : null
  const dueMs = last ? new Date(last.at).getTime() + next.gapDays * 86_400_000 : now
  const daysUntil = Math.max(0, Math.ceil((dueMs - now) / 86_400_000))
  return { sentIds, next, dueAt: new Date(dueMs).toISOString(), due: dueMs <= now, daysUntil, finished: false, stopped: false }
}

/** A lead is "in play" when it is not archived and not at an end step. */
export function isOpen(lead: Pick<Lead, 'dumped' | 'status'>): boolean {
  return !lead.dumped && lead.status !== 'won' && lead.status !== 'lost'
}

// ---- LinkedIn. Two short, prepared texts; a person sends each one by hand from
// the lead page, through the LinkedIn hub and inside its daily limits.

/** Connection note. LinkedIn allows about 300 characters, so keep it well under. */
export const LINKEDIN_CONNECT_NOTE =
  'Hi {firstName}, I work on corporate training at Gennoor Tech. We run AI and cloud courses that teams can take at their own pace. I would like to connect and share a few with you.'

/** First message once they accept. */
export const LINKEDIN_FIRST_MESSAGE =
  'Thank you for connecting, {firstName}. Our Learning Studio is open for your team to try: full video courses with labs and quizzes at https://www.gennoor.com/studio. If {company} is planning any AI or cloud training this year, I would be glad to show you how we shorten it. Would a 20-minute call suit you?'
