import { TableClient } from '@azure/data-tables'
import { getStorage, listAllLmsCourses } from '@/lib/lms'
import { DEFAULT_PRICE, getPriceSettings, listPurchases } from '@/lib/lms-access'
import { courses as SHORT_COURSES } from '@/config/courses'
import { CLAUDE_CERTS } from '@/data/claude-certifications'
import certMeta from '@/data/claude-cert-meta.json'

/**
 * Who is learning what: the figures behind Admin > Learner analytics.
 *
 * Everything is read from what the site already records, nothing is estimated beyond what
 * is said in `notes` at the end. Three kinds of course are counted:
 *   studio  the Learning Studio video courses  (LmsEnrollments, LmsProgress, LmsPurchases, LmsChat)
 *   short   the AI Essentials interactive courses (CourseProgress, and LmsChat under "ia-<course>")
 *   claude  the Claude certification guides (CourseProgress, under "claude-cert-<key>")
 * plus the learner accounts (Learners) and the certificates issued (Certificates).
 *
 * A period is two calendar days in India, both included. Per-course and per-student figures
 * marked "in the period" count only what happened in it; the others are as of now.
 */
export interface AnalyticsRange { from: string; to: string }

export type CourseKind = 'studio' | 'short' | 'claude'

export interface CourseStat {
  key: string
  kind: CourseKind
  code: string
  title: string
  /** Video lessons (studio) or chapters (short). */
  lessons: number
  /** How long the whole course is, in hours (0 when its lessons have no set length). */
  lengthHours: number
  /** Learning Studio only: what it is sold for now, 'open' when anyone signed in gets all of it. Null for the other kinds. */
  price: { usd: number; inr: number } | 'open' | null
  /** False for a Learning Studio course that is not on the site at the moment. */
  published: boolean
  /** People who have ever enrolled in it or started it. */
  enrolled: number
  enrolledInRange: number
  activeInRange: number
  /** Where the enrolled people are now. */
  notStarted: number
  inProgress: number
  finished: number
  /** Average share of the lessons done, over everyone enrolled, 0 to 100. */
  averageProgress: number
  lessonsInRange: number
  hoursInRange: number
  /** Hours of learning in it by everyone, ever. */
  hours: number
  certificatesInRange: number
  /** Assistant questions asked in the course, in the period. */
  questionsInRange: number
  /** Payments ever, and in the period. */
  paid: number
  paidInRange: number
  usd: number
  inr: number
  usdInRange: number
  inrInRange: number
  couponsInRange: number
}

export interface LearnerCourse {
  key: string
  kind: CourseKind
  code: string
  title: string
  enrolledAt: string
  lastActive: string
  lessonsDone: number
  lessons: number
  /** 0 to 100 */
  progress: number
  finished: boolean
  certificateAt: string
  hours: number
  paid: { amount: number; currency: 'USD' | 'INR'; coupon?: string } | null
}

export interface LearnerStat {
  email: string
  name: string
  organization: string
  role: string
  joinedAt: string
  lastSeen: string
  courses: LearnerCourse[]
  finishedCount: number
  certificates: number
  lessonsInRange: number
  hoursInRange: number
  questionsInRange: number
  activeInRange: boolean
  usd: number
  inr: number
}

export interface DayStat { day: string; enrolments: number; lessons: number; active: number; joined: number; usd: number; inr: number }

export interface LearnerAnalytics {
  range: AnalyticsRange
  generatedAt: string
  totals: {
    learners: number
    joinedInRange: number
    activeInRange: number
    enrolments: number
    enrolmentsInRange: number
    lessonsInRange: number
    hoursInRange: number
    finishedInRange: number
    certificatesInRange: number
    questionsInRange: number
    onSeveralCourses: number
    paymentsInRange: number
    usdInRange: number
    inrInRange: number
  }
  daily: DayStat[]
  /** Different learners active in each week (keyed by its Monday) and each month (YYYY-MM): a week's figure is not the sum of its days. */
  activeByWeek: Record<string, number>
  activeByMonth: Record<string, number>
  courses: CourseStat[]
  learners: LearnerStat[]
  notes: string[]
}

const IST_MS = 5.5 * 3_600_000
/** The calendar day in India a moment falls on, as YYYY-MM-DD ('' when it is not a date). */
export function dayOf(iso: unknown): string {
  const t = Date.parse(String(iso || ''))
  return Number.isFinite(t) ? new Date(t + IST_MS).toISOString().slice(0, 10) : ''
}
const later = (a: string, b: string) => (a > b ? a : b)
const mail = (v: unknown) => String(v || '').toLowerCase().trim()
const round1 = (n: number) => Math.round(n * 10) / 10

/** The Monday of the week a day (YYYY-MM-DD) is in. */
export function weekOf(day: string): string {
  const d = new Date(`${day}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7))
  return d.toISOString().slice(0, 10)
}

/** Every row of a table. A table that does not exist yet simply has nothing in it. */
async function scan(conn: string, name: string): Promise<Record<string, unknown>[]> {
  const out: Record<string, unknown>[] = []
  try {
    for await (const e of TableClient.fromConnectionString(conn, name).listEntities<Record<string, unknown>>()) out.push(e)
  } catch (e) {
    if ((e as { statusCode?: number })?.statusCode !== 404) throw e
  }
  return out
}

export async function buildLearnerAnalytics(range: AnalyticsRange): Promise<LearnerAnalytics> {
  const main = process.env.AZURE_STORAGE_CONNECTION_STRING || ''
  const lms = getStorage().conn
  const [accounts, enrolments, progress, chat, shortProgress, certs, purchases, studio, prices] = await Promise.all([
    main ? scan(main, 'Learners') : [],
    scan(lms, 'LmsEnrollments'),
    scan(lms, 'LmsProgress'),
    main ? scan(main, 'LmsChat') : [],
    main ? scan(main, 'CourseProgress') : [],
    main ? scan(main, 'Certificates') : [],
    listPurchases().catch(() => []),
    listAllLmsCourses(),
    getPriceSettings(),
  ])
  const within = (iso: unknown) => { const d = dayOf(iso); return !!d && d >= range.from && d <= range.to }

  // ---- the courses, and what a lesson of each is worth in time
  const courseStat = new Map<string, CourseStat>()
  const blank = (key: string, kind: CourseKind, code: string, title: string, lessons: number, seconds = 0): CourseStat => ({
    key, kind, code, title, lessons, lengthHours: round1(seconds / 3600), price: null, published: true,
    enrolled: 0, enrolledInRange: 0, activeInRange: 0, notStarted: 0, inProgress: 0, finished: 0, averageProgress: 0,
    lessonsInRange: 0, hoursInRange: 0, hours: 0, certificatesInRange: 0, questionsInRange: 0, paid: 0, paidInRange: 0, usd: 0, inr: 0, usdInRange: 0, inrInRange: 0, couponsInRange: 0,
  })
  const lectureSeconds = new Map<string, Map<string, number>>()      // slug -> lecture id -> seconds
  const slugOfCode = new Map<string, string>()
  for (const c of studio) {
    slugOfCode.set(c.code.toLowerCase(), c.slug)
    const lectures = new Map<string, number>()
    for (const s of c.sections) for (const i of s.items) if (i.type === 'lecture') lectures.set(i.id, Number(i.durationSec) || 0)
    lectureSeconds.set(c.slug, lectures)
    const stat = blank(`studio:${c.slug}`, 'studio', c.code, c.title, lectures.size, [...lectures.values()].reduce((n, s) => n + s, 0))
    const set = prices[c.slug]
    stat.price = !set ? DEFAULT_PRICE : set.free ? 'open' : { usd: set.usd, inr: set.inr }
    stat.published = c.published !== false
    courseStat.set(stat.key, stat)
  }
  const chapterMinutes = new Map<string, Map<string, number>>()     // course id -> chapter id -> minutes
  for (const c of SHORT_COURSES) {
    const minutes = new Map(c.chapters.map(ch => [ch.id, Number(ch.estimatedMinutes) || 0]))
    chapterMinutes.set(c.id, minutes)
    courseStat.set(`short:${c.id}`, blank(`short:${c.id}`, 'short', c.shortTitle || c.title, c.title, c.chapters.length, [...minutes.values()].reduce((n, m) => n + m, 0) * 60))
  }
  for (const cert of CLAUDE_CERTS) {
    const id = `claude-cert-${cert.guideKey}`
    const chapters = (certMeta as unknown as Record<string, { chapters?: unknown[] }>)[cert.slug]?.chapters?.length ?? 0
    courseStat.set(`claude:${id}`, blank(`claude:${id}`, 'claude', cert.code, cert.name, chapters))
  }
  // Some older records name a Learning Studio course by its code ("c01") and not by its address: they are the same course
  const studioSlug = (slug: string) => (lectureSeconds.has(slug) ? slug : slugOfCode.get(slug.toLowerCase()) || slug)
  // A course that was deleted still has learners: keep their figures under its code
  const courseOf = (key: string, kind: CourseKind, id: string) => {
    let c = courseStat.get(key)
    if (!c) { c = blank(key, kind, id.toUpperCase(), `${id} (no longer in the catalogue)`, 0); courseStat.set(key, c) }
    return c
  }

  // ---- one record per learner per course
  interface Seat extends LearnerCourse { seconds: number; secondsInRange: number; lessonsInRange: number; activeInRange: boolean; finishedAt: string; started: boolean }
  const seats = new Map<string, Seat>()                               // email|key
  const seat = (email: string, key: string, kind: CourseKind, id: string): Seat => {
    const k = `${email}|${key}`
    let s = seats.get(k)
    if (!s) {
      const c = courseOf(key, kind, id)
      s = { key, kind, code: c.code, title: c.title, enrolledAt: '', lastActive: '', lessonsDone: 0, lessons: c.lessons, progress: 0, finished: false, certificateAt: '', hours: 0, paid: null,
        seconds: 0, secondsInRange: 0, lessonsInRange: 0, activeInRange: false, finishedAt: '', started: false }
      seats.set(k, s)
    }
    return s
  }
  const names = new Map<string, string>()
  const days = new Map<string, DayStat>()
  const day = (iso: unknown): DayStat | null => {
    const d = dayOf(iso)
    if (!d || d < range.from || d > range.to) return null
    let s = days.get(d)
    if (!s) { s = { day: d, enrolments: 0, lessons: 0, active: 0, joined: 0, usd: 0, inr: 0 }; days.set(d, s) }
    return s
  }
  const activeOn = new Map<string, Set<string>>()                     // day -> emails
  const sawOn = (iso: unknown, email: string) => {
    const d = dayOf(iso)
    if (!d || d < range.from || d > range.to) return
    if (!activeOn.has(d)) activeOn.set(d, new Set())
    activeOn.get(d)!.add(email)
    day(iso)
  }

  for (const e of enrolments) {
    const email = mail(e.partitionKey), slug = studioSlug(String(e.rowKey))
    if (!email) continue
    const s = seat(email, `studio:${slug}`, 'studio', slug)
    const at = String(e.enrolledAt || '')
    if (!s.enrolledAt || (at && at < s.enrolledAt)) s.enrolledAt = at
    if (e.name) names.set(email, String(e.name))
  }
  for (const p of progress) {
    const email = mail(p.partitionKey), row = String(p.rowKey), cut = row.indexOf(':')
    if (!email || cut < 0) continue
    const slug = studioSlug(row.slice(0, cut)), item = row.slice(cut + 1)
    const s = seat(email, `studio:${slug}`, 'studio', slug)
    const at = String(p.updatedAt || '')
    s.lastActive = later(s.lastActive, at)
    const inRange = within(at)
    if (inRange) { s.activeInRange = true; sawOn(at, email) }
    const length = lectureSeconds.get(slug)?.get(item)
    if (length === undefined) { s.started = true; continue }          // a quiz, or a lesson that has since been removed: they were there, and it adds no lesson and no time
    const done = !!p.done
    const watched = done ? (length || Number(p.positionSec) || 0) : Math.min(Number(p.positionSec) || 0, length || Infinity)
    s.seconds += watched
    if (done || watched > 0) s.started = true
    if (done) { s.lessonsDone += 1; s.finishedAt = later(s.finishedAt, at) }
    if (inRange) {
      s.secondsInRange += watched
      if (done) { s.lessonsInRange += 1; const d = day(at); if (d) d.lessons += 1 }
    }
  }
  for (const p of shortProgress) {
    const email = mail(p.partitionKey), id = String(p.courseId || ''), chapter = String(p.chapterId || '')
    if (!email || !id) continue
    const kind: CourseKind = id.startsWith('claude-cert-') ? 'claude' : 'short'
    const s = seat(email, `${kind}:${id}`, kind, id)
    const at = String(p.lastAccessed || '')
    s.lastActive = later(s.lastActive, at)
    if (!s.enrolledAt || (at && at < s.enrolledAt)) s.enrolledAt = at   // the earliest date we have for them in this course
    const minutes = chapterMinutes.get(id)?.get(chapter) ?? 0
    const share = p.completed ? 1 : Math.min(1, (Number(p.completionPercent) || 0) / 100)
    s.seconds += minutes * 60 * share
    if (share > 0 || Number(p.currentSlide) > 0) s.started = true
    if (p.completed) { s.lessonsDone += 1; s.finishedAt = later(s.finishedAt, at) }
    if (within(at)) {
      s.activeInRange = true
      s.secondsInRange += minutes * 60 * share
      sawOn(at, email)
      if (p.completed) { s.lessonsInRange += 1; const d = day(at); if (d) d.lessons += 1 }
    }
  }

  // ---- certificates, payments, questions
  const certAt = new Map<string, string>()                            // email|course id -> when
  for (const c of certs) {
    if (c.status === 'revoked') continue
    const email = mail(c.recipientEmail), id = String(c.workshopSlug || c.partitionKey || '')
    if (email && id) certAt.set(`${email}|${id}`, String(c.createdAt || c.issuedAt || ''))
  }
  for (const [k, s] of seats) {
    const email = k.slice(0, k.indexOf('|')), id = s.key.slice(s.key.indexOf(':') + 1)
    s.certificateAt = certAt.get(`${email}|${id}`) || ''
  }
  for (const p of purchases) {
    const email = mail(p.email), slug = studioSlug(p.slug)
    if (!email) continue
    const s = seat(email, `studio:${slug}`, 'studio', slug)
    s.paid = { amount: p.amount, currency: p.currency, coupon: p.coupon }
    if (!s.enrolledAt) s.enrolledAt = p.at                            // paid, and not yet opened
    if (p.name && !names.has(email)) names.set(email, p.name)
    const c = courseOf(s.key, 'studio', slug)
    c.paid += 1
    if (p.currency === 'INR') c.inr += p.amount; else c.usd += p.amount
    if (within(p.at)) {
      c.paidInRange += 1
      if (p.coupon) c.couponsInRange += 1
      if (p.currency === 'INR') c.inrInRange += p.amount; else c.usdInRange += p.amount
      const d = day(p.at)
      if (d) { if (p.currency === 'INR') d.inr += p.amount; else d.usd += p.amount }
    }
  }
  const questions = new Map<string, number>()                         // email -> asked in the period
  for (const m of chat) {
    if (m.role !== 'learner' || !within(m.at)) continue
    const [email, slug] = String(m.partitionKey).split('|')
    if (!email || !slug) continue
    // The assistant of a short course keeps its questions under "ia-<course>"
    const course = slug.startsWith('ia-') ? courseOf(`short:${slug.slice(3)}`, 'short', slug.slice(3)) : courseOf(`studio:${studioSlug(slug)}`, 'studio', studioSlug(slug))
    course.questionsInRange += 1
    questions.set(mail(email), (questions.get(mail(email)) || 0) + 1)
  }

  // ---- roll up: by course, by learner
  const people = new Map<string, LearnerStat>()
  const person = (email: string): LearnerStat => {
    let l = people.get(email)
    if (!l) {
      l = { email, name: names.get(email) || '', organization: '', role: '', joinedAt: '', lastSeen: '', courses: [], finishedCount: 0, certificates: 0,
        lessonsInRange: 0, hoursInRange: 0, questionsInRange: 0, activeInRange: false, usd: 0, inr: 0 }
      people.set(email, l)
    }
    return l
  }
  let joinedInRange = 0
  for (const a of accounts) {
    if (a.partitionKey !== 'learner') continue                        // the same table holds the username index
    const l = person(mail(a.email || a.rowKey))
    l.name = String(a.name || l.name || '')
    l.organization = String(a.organization || '')
    l.role = String(a.role || '')
    l.joinedAt = String(a.createdAt || '')
    l.lastSeen = String(a.lastLogin || '')
    if (within(l.joinedAt)) { joinedInRange += 1; const d = day(l.joinedAt); if (d) d.joined += 1 }
  }
  let finishedInRange = 0, certificatesInRange = 0
  for (const [k, s] of seats) {
    const email = k.slice(0, k.indexOf('|'))
    const c = courseStat.get(s.key)!
    const total = c.lessons
    s.lessons = total
    s.progress = total ? Math.min(100, Math.round((s.lessonsDone / total) * 100)) : 0
    s.finished = !!s.certificateAt || (total > 0 && s.lessonsDone >= total)
    s.hours = round1(s.seconds / 3600)
    c.enrolled += 1
    // Counted here, not where the enrolment rows are read, so the chart by day adds up to the same total as the tile
    const enrolledOn = day(s.enrolledAt)
    if (enrolledOn) { c.enrolledInRange += 1; enrolledOn.enrolments += 1 }
    if (s.activeInRange) c.activeInRange += 1
    if (s.finished) c.finished += 1; else if (s.started) c.inProgress += 1; else c.notStarted += 1
    c.averageProgress += s.finished ? 100 : s.progress
    c.lessonsInRange += s.lessonsInRange
    c.hoursInRange += s.secondsInRange / 3600
    c.hours += s.seconds / 3600
    if (s.finished && within(s.certificateAt || s.finishedAt)) finishedInRange += 1
    if (within(s.certificateAt)) { c.certificatesInRange += 1; certificatesInRange += 1 }

    const l = person(email)
    l.courses.push({ key: s.key, kind: s.kind, code: s.code, title: s.title, enrolledAt: s.enrolledAt, lastActive: s.lastActive, lessonsDone: s.lessonsDone, lessons: s.lessons,
      progress: s.finished ? 100 : s.progress, finished: s.finished, certificateAt: s.certificateAt, hours: s.hours, paid: s.paid })
    if (s.finished) l.finishedCount += 1
    if (s.certificateAt) l.certificates += 1
    l.lessonsInRange += s.lessonsInRange
    l.hoursInRange += s.secondsInRange / 3600
    l.activeInRange = l.activeInRange || s.activeInRange
    l.lastSeen = later(l.lastSeen, s.lastActive)
    if (s.paid) { if (s.paid.currency === 'INR') l.inr += s.paid.amount; else l.usd += s.paid.amount }
  }
  for (const c of courseStat.values()) {
    c.averageProgress = c.enrolled ? Math.round(c.averageProgress / c.enrolled) : 0
    c.hoursInRange = round1(c.hoursInRange)
    c.hours = round1(c.hours)
  }
  for (const l of people.values()) {
    l.hoursInRange = round1(l.hoursInRange)
    l.questionsInRange = questions.get(l.email) || 0
    l.courses.sort((a, b) => (b.lastActive || b.enrolledAt).localeCompare(a.lastActive || a.enrolledAt))
  }
  const weeks = new Map<string, Set<string>>(), months = new Map<string, Set<string>>()
  for (const [d, set] of activeOn) {
    const s = days.get(d)
    if (s) s.active = set.size
    for (const [bucket, key] of [[weeks, weekOf(d)], [months, d.slice(0, 7)]] as const) {
      if (!bucket.has(key)) bucket.set(key, new Set())
      for (const email of set) bucket.get(key)!.add(email)
    }
  }

  // Every Learning Studio course on the site is listed, with or without learners; anything else only once someone is in it
  const courses = [...courseStat.values()].filter(c => c.enrolled > 0 || (c.kind === 'studio' && c.published))
    .sort((a, b) => b.enrolled - a.enrolled || a.title.localeCompare(b.title))
  const learners = [...people.values()].sort((a, b) => (b.lastSeen || b.joinedAt).localeCompare(a.lastSeen || a.joinedAt))
  const sum = (f: (c: CourseStat) => number) => courses.reduce((n, c) => n + f(c), 0)

  return {
    range,
    generatedAt: new Date().toISOString(),
    totals: {
      learners: learners.length,
      joinedInRange,
      activeInRange: learners.filter(l => l.activeInRange).length,
      enrolments: sum(c => c.enrolled),
      enrolmentsInRange: sum(c => c.enrolledInRange),
      lessonsInRange: sum(c => c.lessonsInRange),
      hoursInRange: round1(sum(c => c.hoursInRange)),
      finishedInRange,
      certificatesInRange,
      questionsInRange: sum(c => c.questionsInRange),
      onSeveralCourses: learners.filter(l => l.courses.length > 1).length,
      paymentsInRange: sum(c => c.paidInRange),
      usdInRange: Math.round(sum(c => c.usdInRange) * 100) / 100,
      inrInRange: Math.round(sum(c => c.inrInRange)),
    },
    daily: [...days.values()].sort((a, b) => a.day.localeCompare(b.day)),
    activeByWeek: Object.fromEntries([...weeks].map(([k, v]) => [k, v.size])),
    activeByMonth: Object.fromEntries([...months].map(([k, v]) => [k, v.size])),
    courses,
    learners,
    notes: [
      'Days are India time. A lesson is counted on the day it was last opened, because the site keeps one date for each lesson a learner has touched.',
      'Active means the learner opened a lesson, a quiz or a chapter on that day. In a chart by week or by month, a learner is counted once in each week or month.',
      'Hours are worked out from the length of the lessons a learner has finished, plus how far they are into the ones they have not. Minutes actually watched are not recorded.',
      'A short course (AI Essentials) or a Claude certification guide has no enrolment date. A learner is counted in it from the first chapter the site saved for them, and its chapters are its lessons. The guides have no set length, so they add no hours.',
      'Questions are the ones learners put to the course assistant, in a Learning Studio course or an AI Essentials course.',
      'Money is what was paid for courses through the site. What a course costs to run (video storage, the assistant) is not recorded course by course; the Costs page has the Azure bill as a whole.',
    ],
  }
}
