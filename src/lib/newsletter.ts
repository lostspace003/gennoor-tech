/**
 * The weekly email of new posts. Pure rules, with nothing of the server in them, so the check script can run
 * every one of them with made-up posts, made-up people and a made-up clock (scripts/newsletter-check.ts).
 *
 * The owner (14 November 2026) pointed at the box under the blog, "Get new posts by email", and asked: "has
 * this been automated". It had not: the box kept the address, sent one "You're subscribed" email, and nothing
 * ever followed. The site was promising something it did not do.
 *
 * Now, once a week:
 *  - on Thursday at 10:00 India time an issue is due. It holds the posts published in the seven days up to and
 *    including that Thursday, newest first. A post is never sent in two issues.
 *  - it goes to everyone who signed up and has not asked to stop since. One email a week, never one a post:
 *    the blog publishes every day, and the box says "No spam".
 *  - it goes out a few at a time (PER_TICK each heartbeat, PER_HOUR an hour), because the email service allows
 *    the whole site about 100 emails an hour and the codes that let learners sign in share that.
 *  - nobody is ever sent the same issue twice: who has had it is written down after every single send.
 *  - a week with no new post sends nothing.
 * The live parts (who signed up, the store, the sending) are in ./newsletter-live.ts.
 */

/** A post, as far as the weekly email needs it (the fields of BlogPostMeta in src/data/blog-posts). */
export interface DigestPost {
  slug: string
  title: string
  excerpt: string
  date: string
  category: string
  readTime: string
}

/** Thursday (0 is Sunday), at 10:00, India time. Change the two numbers here and nowhere else. */
export const ISSUE_DAY = 4
export const ISSUE_HOUR = 10
/** No more posts than this in one email: a week of daily posts. */
export const MAX_POSTS = 7
/** How many emails go at each heartbeat (every 15 minutes), and in any one hour. */
export const PER_TICK = 5
export const PER_HOUR = 20
/** An issue is closed after this many days even if someone could not be reached: they get the next one. */
export const ISSUE_OPEN_DAYS = 3
/** After this many failed tries an address is left out of the issue. */
export const MAX_TRIES = 3

const IST_MS = 5.5 * 3_600_000
const DAY_MS = 86_400_000
const dayOf = (ms: number) => new Date(ms).toISOString().slice(0, 10)

/** The issue that is due at a moment: the date (in India) of the latest Thursday whose 10:00 has passed. */
export function issueFor(now: number): string {
  const local = new Date(now + IST_MS) // India has no summer time, so its clock is always UTC + 5:30
  let back = (local.getUTCDay() - ISSUE_DAY + 7) % 7
  if (back === 0 && local.getUTCHours() < ISSUE_HOUR) back = 7
  return dayOf(Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate() - back))
}

/** The issue after that one: when the next email goes. */
export const nextIssue = (now: number): string => dayOf(Date.parse(issueFor(now)) + 7 * DAY_MS)

/** The moment an issue becomes due, as a time. */
export const issueTime = (issue: string): number => Date.parse(`${issue}T00:00:00Z`) + ISSUE_HOUR * 3_600_000 - IST_MS

/** The posts of an issue: published in the seven days up to and including its Thursday, and not sent before. */
export function postsFor<P extends DigestPost>(issue: string, posts: P[], sentBefore: string[] = []): P[] {
  const from = dayOf(Date.parse(issue) - 6 * DAY_MS)
  const gone = new Set(sentBefore)
  return posts
    .filter((p) => p.date >= from && p.date <= issue && !gone.has(p.slug))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_POSTS)
}

/** One sign-up, or one request to stop, as the store keeps it. */
export interface Mark {
  email: string
  at: string
}

const RESERVED = /(^|\.)(example\.(com|org|net)|test|invalid|example|localhost)$/i
const looksLikeAddress = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

/**
 * Who gets the email: everyone whose latest sign-up is later than their latest request to stop. Each address
 * once, in the order they signed up. Addresses that cannot be real (example.com and the like) are left out.
 */
export function subscribed(signUps: Mark[], optOuts: Mark[]): string[] {
  const latest = (marks: Mark[]) => {
    const at = new Map<string, string>()
    for (const m of marks) {
      const e = (m.email || '').trim().toLowerCase()
      if (e && (m.at || '') >= (at.get(e) || '')) at.set(e, m.at || '')
    }
    return at
  }
  const first = new Map<string, string>()
  for (const m of signUps) {
    const e = (m.email || '').trim().toLowerCase()
    if (e && (!first.has(e) || (m.at || '') < first.get(e)!)) first.set(e, m.at || '')
  }
  const joined = latest(signUps), left = latest(optOuts)
  return [...joined.keys()]
    .filter((e) => looksLikeAddress(e) && !RESERVED.test(e.split('@')[1] || ''))
    .filter((e) => !left.has(e) || joined.get(e)! > left.get(e)!)
    .sort((a, b) => (first.get(a) || '').localeCompare(first.get(b) || '') || a.localeCompare(b))
}

/** One issue while it is going out. */
export interface IssueState {
  /** Its Thursday. */
  issue: string
  /** The posts in it, fixed when it starts: everyone gets the same email. */
  slugs: string[]
  /** Who has had it, with the time (the hour's limit is counted from these). */
  sent: Array<{ email: string; at: string }>
  /** Tries that failed, per address. */
  failed: Record<string, number>
  startedAt: string
}

/** One issue that is done. */
export interface IssueDone {
  issue: string
  slugs: string[]
  sent: number
  finishedAt: string
  /** Why nothing went, when nothing did. */
  note?: string
}

export interface NewsletterState {
  current?: IssueState
  /** The newest first; the last twelve are kept. */
  history: IssueDone[]
}

export interface NewsletterDeps {
  now: () => number
  load: () => Promise<NewsletterState | null>
  save: (state: NewsletterState) => Promise<void>
  /** Every post of the blog. */
  posts: () => DigestPost[]
  /** Who is subscribed right now. */
  people: () => Promise<string[]>
  /** How many emails the rest of the site leaves room for this hour (the newsletter's own limit is applied here). */
  room: () => Promise<number>
  /** Send the issue to one address. True when the email service took it. */
  send: (email: string, issue: string, posts: DigestPost[]) => Promise<boolean>
}

const done = (state: NewsletterState, entry: IssueDone): NewsletterState => ({ history: [entry, ...state.history.filter((h) => h.issue !== entry.issue)].slice(0, 12) })

/**
 * One step of the weekly email, called by the heartbeat every 15 minutes. Says what it did, in a line or two.
 * It never throws for one bad address, and it saves after every send, so a restart in the middle cannot send
 * anyone the same issue twice.
 */
export async function newsletterTick(deps: NewsletterDeps): Promise<string[]> {
  const now = deps.now()
  const stamp = new Date(now).toISOString()
  const issue = issueFor(now)
  let state = (await deps.load()) || null

  // The first time ever: the issue that is "due" belongs to a week before this existed. It is marked as done,
  // so the first email is the next Thursday's and nobody gets a surprise the moment this goes live.
  if (!state) {
    await deps.save({ history: [{ issue, slugs: [], sent: 0, finishedAt: stamp, note: 'before the weekly email existed' }] })
    return [`set up; the first issue is ${nextIssue(now)}`]
  }

  // An issue left open too long is closed: whoever could not be reached gets the next one
  if (state.current && now - Date.parse(state.current.startedAt) > ISSUE_OPEN_DAYS * DAY_MS) {
    state = done(state, { issue: state.current.issue, slugs: state.current.slugs, sent: state.current.sent.length, finishedAt: stamp, note: 'closed after three days' })
    await deps.save(state)
  }

  // Is a new issue due?
  if (!state.current && !state.history.some((h) => h.issue === issue)) {
    const before = state.history.flatMap((h) => h.slugs)
    const posts = postsFor(issue, deps.posts(), before)
    if (!posts.length) {
      await deps.save(done(state, { issue, slugs: [], sent: 0, finishedAt: stamp, note: 'no new posts that week' }))
      return [`issue ${issue}: no new posts, nothing sent`]
    }
    state = { ...state, current: { issue, slugs: posts.map((p) => p.slug), sent: [], failed: {}, startedAt: stamp } }
    await deps.save(state)
  }

  const current = state.current
  if (!current) return ['nothing due']

  const bySlug = new Map(deps.posts().map((p) => [p.slug, p]))
  const posts = current.slugs.map((s) => bySlug.get(s)).filter((p): p is DigestPost => !!p)
  const had = new Set(current.sent.map((s) => s.email))
  const waiting = (await deps.people()).filter((e) => !had.has(e) && (current.failed[e] || 0) < MAX_TRIES)

  if (!posts.length || !waiting.length) {
    await deps.save(done(state, { issue: current.issue, slugs: current.slugs, sent: current.sent.length, finishedAt: stamp, ...(current.sent.length ? {} : { note: posts.length ? 'nobody is subscribed' : 'its posts are gone' }) }))
    return [`issue ${current.issue}: finished, sent to ${current.sent.length}`]
  }

  const lastHour = current.sent.filter((s) => now - Date.parse(s.at) < 3_600_000).length
  const room = Math.max(0, Math.min(PER_TICK, PER_HOUR - lastHour, await deps.room()))
  if (!room) return [`issue ${current.issue}: ${waiting.length} waiting, no room this hour`]

  let sent = 0, refused = 0
  for (const email of waiting.slice(0, room)) {
    let ok = false
    try { ok = await deps.send(email, current.issue, posts) } catch { ok = false }
    if (ok) { current.sent.push({ email, at: new Date(deps.now()).toISOString() }); sent++ }
    else { current.failed[email] = (current.failed[email] || 0) + 1; refused++ }
    // After every single send: a restart in the middle must not send the same person the issue again
    await deps.save(state)
  }
  return [`issue ${current.issue}: sent ${sent}${refused ? `, ${refused} not taken` : ''}, ${Math.max(0, waiting.length - sent - refused)} still waiting`]
}
