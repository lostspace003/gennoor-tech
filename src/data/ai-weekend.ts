// The AI Weekend: a live two-day workshop held on the last Saturday and Sunday
// of every month. Everything a visitor reads on /ai-weekend comes from here, so
// the programme can be changed in one place. No server imports: the page, the
// emails and the admin list all read it.

export const WEEKEND = {
  name: 'Gennoor AI Weekend',
  /**
   * It is about AI, not one product (owner, 13 November 2026: "why to have claude based only"). Claude is
   * one of the tools used; the weekend is not named after it.
   */
  tagline: 'Build with AI',
  /**
   * The big words at the top of its page (owner, 14 November 2026, pointing at "Gennoor AI Weekend / Build with
   * AI in one weekend": "Can we have here only AI Weekend Program with tagline Build with AI"). The emails and
   * receipts keep `name`, so a reader knows who is writing.
   */
  heading: 'AI Weekend Program',
  /** What people in India pay now, in rupees. */
  fee: 499,
  /** The regular price, shown crossed out beside the fee. */
  regularFee: 1999,
  /**
   * What people outside India pay, in US dollars (owner, 14 November 2026: "$9.99 outside India. For Indian
   * 499 rupees"). A visitor sees one of the two, never both: weekendFee() below.
   * The regular dollar price is taken at the same reduction as the rupee one (499 of 1,999 is a quarter).
   */
  feeUsd: 9.99,
  regularFeeUsd: 39.99,
  /** Seats in each cohort. The page shows how many are left. */
  seats: 1000,
  /** Each day, India time (24-hour "HH:MM"). */
  startTime: '10:00',
  endTime: '14:00',
  hoursPerDay: 4,
  mode: 'Live online, on Microsoft Teams',
  /**
   * Who teaches it. No person is named (owner, 13 November 2026: "Don't put my name under trainer. That will
   * give a wrong trust value ... you can have words like learn from the industry expert"). The picture is a
   * drawn 3D figure, not a photograph of anyone (public/assets/ai-weekend-expert.jpg, made by scripts/make-expert-avatar.ts).
   */
  expert: {
    heading: 'Learn from an industry expert',
    line: 'The sessions are led live by a practitioner who trains corporate teams on AI and cloud, and builds the courses on the Gennoor Learning Studio.',
    image: '/assets/ai-weekend-expert.jpg',
  },
}

/** The fee in the visitor's own money: rupees in India, dollars everywhere else. */
export function weekendFee(india: boolean): { fee: number; regular: number; currency: 'INR' | 'USD' } {
  return india
    ? { fee: WEEKEND.fee, regular: WEEKEND.regularFee, currency: 'INR' }
    : { fee: WEEKEND.feeUsd, regular: WEEKEND.regularFeeUsd, currency: 'USD' }
}

export interface WeekendDay {
  label: string
  title: string
  summary: string
  /** What is built live in front of you, and is in your kit to repeat. One for each part of the day. */
  projects: { name: string; result: string }[]
  /** The parts of the day, in order. */
  agenda: string[]
}

/**
 * Seven parts over the eight hours: four on Saturday, three on Sunday. They follow the owner's list
 * (foundations and workflows; operations and automation; image, video and audio; MCP and skills; automating
 * your workflows; your AI agent; multi-agent systems), said in our own words.
 */
export const DAYS: WeekendDay[] = [
  {
    label: 'Day 1 · Saturday',
    title: 'From understanding AI to using it on your work',
    summary: 'Start with how AI works and where it fits. Then put it to work on the documents, sheets, pictures and tools you already deal with.',
    projects: [
      { name: 'Your context file', result: 'The AI stops giving generic answers because it knows your role, your company and how you write' },
      { name: 'A weekly report in minutes', result: 'A messy spreadsheet goes in, a summary you can send upward comes out' },
      { name: 'A picture, a short video and a voice track', result: 'Made with AI from a plain description, so you see what each tool is good for' },
      { name: 'A connected workspace', result: 'The AI reads your files and reaches your tools, without copy and paste' },
    ],
    agenda: ['How AI works, and where it fits in your work', 'AI for everyday operations', 'Pictures, video and sound with AI', 'Skills and connectors (MCP)'],
  },
  {
    label: 'Day 2 · Sunday',
    title: 'Automate your work, then build agents',
    summary: 'Pick a task you repeat every week and automate it. Then build an agent that does a job from start to end, and a small team of agents that work together.',
    projects: [
      { name: 'One task automated', result: 'A job you do by hand every week now runs when you ask' },
      { name: 'Your first agent', result: 'Give it a goal, and it researches, drafts and checks its own work' },
      { name: 'A team of agents', result: 'Each one has a single job, and they pass the work to each other' },
    ],
    agenda: ['Automate a workflow you repeat', 'Build your first AI agent', 'Agents that work as a team'],
  },
]

/** How many things are built live over the two days. Said in the page, the emails and the films. */
export const DEMO_COUNT = DAYS.reduce((n, d) => n + d.projects.length, 0)
export const DEMO_WORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'][DEMO_COUNT] || String(DEMO_COUNT)

export const FOR_YOU = [
  { title: 'Use AI for small things', text: 'Emails and summaries, but nothing that saves real time yet.' },
  { title: 'Repeat yourself', text: 'Explaining your business and your goals again in every chat.' },
  { title: 'Edit everything twice', text: 'The answers are generic and need rework before you can use them.' },
  { title: 'Want to build', text: 'You hear about agents and automation and have not built one.' },
  { title: 'Lead a team', text: 'You need to see what is practical before you ask your team to adopt it.' },
]

export const INCLUDED = [
  '8 hours live with an industry expert, across two days',
  `${DEMO_WORD.charAt(0).toUpperCase()}${DEMO_WORD.slice(1)} working demos, built step by step in front of you`,
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

/** What is worked with. Kinds of tool, not a list of brands: the weekend is about AI, and Claude is one of the assistants used. */
export const TOOLS = ['Claude and other AI assistants', 'AI tools for pictures', 'AI tools for video and sound', 'Skills', 'Connectors (MCP)', 'Agents', 'Excel', 'PowerPoint']

export const FAQS: { q: string; a: string }[] = [
  { q: 'Do I need to know how to code?', a: 'No. Everything is built by describing what you want in plain language. If you can write a clear email, you can follow it.' },
  { q: 'Do I build during the session?', a: 'You learn by watching. Each demo is built live and explained step by step, so you can follow the thinking without rushing to keep up. After the weekend you receive the full kit and repeat every demo yourself.' },
  { q: 'What is in the kit?', a: 'The session notes, every prompt that was used, the demo files and step-by-step guides. It is sent to everyone who attended, after the weekend.' },
  { q: 'What do I need?', a: 'A stable internet connection to watch and ask questions. To repeat the demos afterwards you need a laptop and an account for the AI tools that were used; the kit includes a setup checklist that names them.' },
  { q: 'Is it only about Claude?', a: 'No. It is about working with AI: how it works, everyday work, pictures, video and sound, connecting it to your tools, automation and agents. Claude is one of the assistants used, and what you learn carries over to the others.' },
  { q: 'When does it run?', a: 'On the last Saturday and Sunday of every month, four hours each day. The dates for the next one are at the top of this page.' },
  { q: 'Is it live or recorded?', a: 'It is live. You watch each demo being built and ask questions as it happens.' },
  { q: 'How do I pay?', a: 'Reserve your seat with the form. We email you the payment details, and your seat is confirmed once the fee is received.' },
  { q: 'Why is the price lower than the regular price?', a: 'The fee on this page is an introductory one, below the regular price shown crossed out beside it. Each cohort has a fixed number of seats.' },
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
  /** When registration closes: one day before the Saturday session starts (ISO instant). */
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
    // Registration closes one day before the weekend begins: Friday, at the hour the Saturday session starts
    // (owner, 14 November 2026: "the registration should close 1 day prior, and then a new list will
    // auto-populate ... for the new month"). From that moment the page, the form and the admin list are on
    // the next month. India time is UTC+5:30, with no daylight saving.
    closesAt: new Date(new Date(`${ymd(sat)}T${WEEKEND.startTime}:00+05:30`).getTime() - 24 * 3_600_000).toISOString(),
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

/**
 * The weekend whose registration has just closed and which is not over yet, or null.
 * On those days (Friday 10:00 India time until the end of its Sunday) a visitor can still register, and is
 * told plainly that this month is closed and the seat is for the next weekend (owner, 14 November 2026:
 * "he will be given a short intimation ... this will be taken into the next month").
 */
export function closedCohort(now = new Date()): Cohort | null {
  const ist = new Date(now.getTime() + 5.5 * 3_600_000)
  const c = cohortOf(ist.getUTCFullYear(), ist.getUTCMonth())
  const over = new Date(`${c.sunday}T23:59:59+05:30`).getTime()
  return now.getTime() >= new Date(c.closesAt).getTime() && now.getTime() <= over ? c : null
}

/** The sentence shown on the form and in the confirmation email on those days. Empty on every other day. */
export function closedNote(now = new Date()): string {
  const closed = closedCohort(now)
  return closed ? `Registration for this month's weekend (${closed.label}) has closed. Your seat is for the next one: ${nextCohort(now).label}.` : ''
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
