// The AI Weekend: a live two-day workshop held on the last Saturday and Sunday
// of every month. Everything a visitor reads on /ai-weekend comes from here, so
// the programme can be changed in one place. No server imports: the page, the
// emails and the admin list all read it.

export const WEEKEND = {
  name: 'Gennoor AI Weekend',
  tagline: 'Build with Claude in one weekend',
  /** What people pay now, in rupees. */
  fee: 499,
  /** The regular price, shown crossed out beside the fee. */
  regularFee: 1999,
  /** Seats in each cohort. The page shows how many are left. */
  seats: 1000,
  /** Each day, India time (24-hour "HH:MM"). */
  startTime: '10:00',
  endTime: '14:00',
  hoursPerDay: 4,
  mode: 'Live online, on Microsoft Teams',
  trainer: {
    name: 'Jalal Ahmed Khan',
    role: 'Founder, Gennoor Tech · Microsoft Certified Trainer',
    line: 'Jalal trains corporate teams on AI and cloud, and builds the courses on the Gennoor Learning Studio.',
  },
}

export interface WeekendDay {
  label: string
  title: string
  summary: string
  /** What is built live in front of you, and is in your kit to repeat. */
  projects: { name: string; result: string }[]
  /** How the four hours are spent. */
  agenda: string[]
}

export const DAYS: WeekendDay[] = [
  {
    label: 'Day 1 · Saturday',
    title: 'From asking questions to getting work done',
    summary: 'Set Claude up so it knows your work, then use it on the documents, sheets and slides you already deal with.',
    projects: [
      { name: 'Your context file', result: 'Claude stops giving generic answers because it knows your role, your company and how you write' },
      { name: 'A weekly report in minutes', result: 'A messy spreadsheet goes in, a summary you can send upward comes out' },
      { name: 'A connected workspace', result: 'Claude reads your files and drafts directly, without copy and paste' },
    ],
    agenda: ['How Claude works, in plain words', 'Projects, instructions and context', 'Claude for documents, sheets and slides', 'Skills and connectors'],
  },
  {
    label: 'Day 2 · Sunday',
    title: 'Automate one task, then build your first agent',
    summary: 'Pick a task you repeat every week, automate it, and finish with an agent that does a job from start to end.',
    projects: [
      { name: 'One task automated', result: 'A job you do by hand every week now runs when you ask' },
      { name: 'A small working app', result: 'Built by describing it, with no coding background needed' },
      { name: 'Your first agent', result: 'Give it a goal, and it researches, drafts and checks its own work' },
    ],
    agenda: ['Mapping a task: trigger, steps, result', 'Building it with Claude', 'Claude Code for people who do not code', 'Agents: when to use one, and building yours'],
  },
]

export const FOR_YOU = [
  { title: 'Use AI for small things', text: 'Emails and summaries, but nothing that saves real time yet.' },
  { title: 'Repeat yourself', text: 'Explaining your business and your goals again in every chat.' },
  { title: 'Edit everything twice', text: 'The answers are generic and need rework before you can use them.' },
  { title: 'Want to build', text: 'You hear about agents and automation and have not built one.' },
  { title: 'Lead a team', text: 'You need to see what is practical before you ask your team to adopt it.' },
]

export const INCLUDED = [
  '8 hours live with the trainer, across two days',
  'Six working demos, built step by step in front of you',
  'The complete kit after the weekend, so you can repeat every demo',
  'Your questions answered live',
  'A certificate when you attend both days',
]

/** How the weekend teaches. Shown beside the registration form. */
export const HOW_YOU_LEARN = [
  { title: 'Watch it built live', text: 'Each demo is built from an empty screen while the trainer explains every step and why it is done that way.' },
  { title: 'Receive the full kit', text: 'After the weekend you get everything that was used: the notes, the prompts, the files and the step-by-step guides.' },
  { title: 'Do it for yourself', text: 'Follow the kit at your own pace to repeat each demo, then apply it to your own tasks.' },
]

/** What is inside the kit. */
export const KIT = ['Session notes', 'Every prompt used', 'Demo files', 'Step-by-step guides', 'Setup checklist']

export const TOOLS = ['Claude', 'Claude Projects', 'Claude Cowork', 'Claude Code', 'Skills', 'Connectors (MCP)', 'Excel', 'PowerPoint']

export const FAQS: { q: string; a: string }[] = [
  { q: 'Do I need to know how to code?', a: 'No. Everything is built by describing what you want in plain language. If you can write a clear email, you can follow it.' },
  { q: 'Do I build during the session?', a: 'You learn by watching. Each demo is built live and explained step by step, so you can follow the thinking without rushing to keep up. After the weekend you receive the full kit and repeat every demo yourself.' },
  { q: 'What is in the kit?', a: 'The session notes, every prompt that was used, the demo files and step-by-step guides. It is sent to everyone who attended, after the weekend.' },
  { q: 'What do I need?', a: 'A stable internet connection to watch and ask questions. To repeat the demos afterwards you need a laptop and a Claude account; the kit includes a setup checklist.' },
  { q: 'When does it run?', a: 'On the last Saturday and Sunday of every month, four hours each day. The dates for the next one are at the top of this page.' },
  { q: 'Is it live or recorded?', a: 'It is live. You watch each demo being built and ask questions as it happens.' },
  { q: 'How do I pay?', a: 'Reserve your seat with the form. We email you the payment details, and your seat is confirmed once the fee is received.' },
  { q: 'Why is the price lower than the regular price?', a: 'The regular price is ₹1,999. It is offered at ₹499, and each cohort has a fixed number of seats.' },
  { q: 'Can my company send a group?', a: 'Yes. Register each person, or write to admin@gennoor.com and we will arrange it. We also run this as a private session for one organization.' },
  { q: 'What if I miss this month?', a: 'It runs every month. Register for the next one whenever you are ready.' },
]

// ---- Dates. The cohort is the last Saturday of a month whose Sunday falls in
// the same month. Once the Saturday session has started, the page moves on to
// the following month.

export interface Cohort {
  /** "2026-11": used to group registrations. */
  id: string
  /** ISO dates, "YYYY-MM-DD". */
  saturday: string
  sunday: string
  /** "28 and 29 November 2026" */
  label: string
  monthName: string
  /** When registration closes: the start of the Saturday session (ISO instant). */
  closesAt: string
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const pad = (n: number) => String(n).padStart(2, '0')

function cohortOf(year: number, month: number): Cohort {
  // month is 0-based. Walk back from the last day to the last Sunday; the day before is the Saturday.
  const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  let sun = lastDay
  while (new Date(Date.UTC(year, month, sun)).getUTCDay() !== 0) sun--
  const sat = sun - 1
  const ymd = (d: number) => `${year}-${pad(month + 1)}-${pad(d)}`
  return {
    id: `${year}-${pad(month + 1)}`,
    saturday: ymd(sat),
    sunday: ymd(sun),
    label: `${sat} and ${sun} ${MONTHS[month]} ${year}`,
    monthName: MONTHS[month],
    // India time is UTC+5:30, with no daylight saving
    closesAt: new Date(`${ymd(sat)}T${WEEKEND.startTime}:00+05:30`).toISOString(),
  }
}

/** The weekend people can register for right now. */
export function nextCohort(now = new Date()): Cohort {
  // "Now" as a calendar date in India
  const ist = new Date(now.getTime() + 5.5 * 3_600_000)
  let y = ist.getUTCFullYear(), m = ist.getUTCMonth()
  for (let i = 0; i < 3; i++) {
    const c = cohortOf(y, m)
    if (new Date(c.closesAt).getTime() > now.getTime()) return c
    m++
    if (m > 11) { m = 0; y++ }
  }
  return cohortOf(y, m)
}

export function cohortById(id: string): Cohort | null {
  const m = id.match(/^(\d{4})-(\d{2})$/)
  if (!m) return null
  const month = Number(m[2]) - 1
  return month >= 0 && month <= 11 ? cohortOf(Number(m[1]), month) : null
}

/** "10:00 AM to 2:00 PM IST" */
export function timeLabel(): string {
  const fmt = (t: string) => {
    const [h, min] = t.split(':').map(Number)
    return `${h % 12 || 12}:${pad(min)} ${h < 12 ? 'AM' : 'PM'}`
  }
  return `${fmt(WEEKEND.startTime)} to ${fmt(WEEKEND.endTime)} IST`
}
