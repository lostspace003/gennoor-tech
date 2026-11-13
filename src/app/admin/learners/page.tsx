'use client'

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { Check, ChevronDown, ChevronRight, Download, RefreshCw } from 'lucide-react'
import type { CourseKind, CourseStat, DayStat, LearnerAnalytics, LearnerStat } from '@/lib/learner-analytics'

/**
 * Admin > Learner analytics: who is learning what.
 *
 * One period, chosen at the top, scopes everything under it: the figures, the three charts,
 * the table by course and the table by student. A figure "in the period" counts what
 * happened in it; the rest (enrolled, where learners are, progress, price) is as of now.
 *
 * The charts follow the house rules for data: one job per chart, one axis, one blue for a
 * single series, values in text colours, every column readable by pointer and by keyboard,
 * and the same numbers in the tables under them and in the Excel file.
 */

// ---------------------------------------------------------------- the period
const IST = 5.5 * 3_600_000
const iso = (t: number) => new Date(t).toISOString().slice(0, 10)
const today = () => iso(Date.now() + IST)
const addDays = (day: string, n: number) => iso(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000)
/** "All time" asks from this day on; the charts then start at the first day anything happened. */
const FIRST_DAY = '2020-01-01'
type Preset = '7' | '30' | 'month' | 'last-month' | 'all' | 'custom'
const PRESETS: Array<[Preset, string]> = [['7', 'Last 7 days'], ['30', 'Last 30 days'], ['month', 'This month'], ['last-month', 'Last month'], ['all', 'All time']]
function presetRange(p: Preset): { from: string; to: string } {
  const t = today()
  if (p === '7') return { from: addDays(t, -6), to: t }
  if (p === 'month') return { from: `${t.slice(0, 8)}01`, to: t }
  if (p === 'last-month') { const end = addDays(`${t.slice(0, 8)}01`, -1); return { from: `${end.slice(0, 8)}01`, to: end } }
  if (p === 'all') return { from: FIRST_DAY, to: t }
  return { from: addDays(t, -29), to: t }
}
/** "5 Nov" or "5 Nov 2026" from a day written YYYY-MM-DD. */
const nice = (day: string, year = false) => (day
  ? new Date(`${day.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', ...(year ? { year: 'numeric' } : {}), timeZone: 'UTC' })
  : '')
/** The day in India a moment falls on. */
const dayIn = (moment: string) => { const t = Date.parse(moment || ''); return Number.isFinite(t) ? iso(t + IST) : '' }
const when = (moment: string) => nice(dayIn(moment), true)

// ---------------------------------------------------------------- small parts
// Chart colours, checked with the palette validator on white and on the hover grey of a table row.
const SERIES = '#2a78d6'                                        // the one blue of a single series, and of a progress bar
const DONE = '#1c5cab', GOING = '#5996e0', IDLE = '#a8b0be'      // finished, in progress, not started: one hue from dark to light, then grey
const STAGES = [['finished', DONE], ['in progress', GOING], ['not started', IDLE]] as const
const KIND: Record<CourseKind, string> = { studio: 'Learning Studio', short: 'AI Essentials', claude: 'Claude guide' }
const num = (n: number) => n.toLocaleString('en-IN')
/** "1 lesson", "2 lessons". */
const many = (n: number, one: string, more = `${one}s`) => `${num(n)} ${n === 1 ? one : more}`
const usd =(n: number) => `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`
const money = (dollars: number, rupees: number) => [dollars ? usd(dollars) : '', rupees ? inr(rupees) : ''].filter(Boolean).join(' + ')
const priceOf = (c: CourseStat) => (c.price === 'open' ? 'open to all' : c.price ? `${usd(c.price.usd)} or ${inr(c.price.inr)}` : '')
const none = <span className="text-gray-300">–</span>
const btn = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md border border-gray-200 bg-white hover:border-gray-400 disabled:opacity-40'
const card = 'rounded-xl border border-gray-200 bg-white'
const field = 'text-sm border border-gray-200 rounded-md bg-white'

function Tile({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className={`${card} px-4 py-3 min-w-0`}>
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold tracking-tight text-gray-900 mt-0.5 break-words">{value}</div>
      {note && <div className="text-xs text-gray-400 mt-0.5">{note}</div>}
    </div>
  )
}

interface Bucket { key: string; label: string; long: string; value: number }
/** A round, even number at or above n: the top of an axis whose middle is also a whole number. */
function ceiling(n: number) {
  if (n <= 10) return n <= 2 ? 2 : n <= 4 ? 4 : n <= 6 ? 6 : n <= 8 ? 8 : 10
  const pow = 10 ** Math.floor(Math.log10(n))
  for (const m of [1, 2, 3, 4, 5, 6, 8, 10]) if (m * pow >= n) return m * pow
  return 10 * pow
}

/** One measure over time, as columns. Point at a column, or tab to it, to read it. */
function Columns({ title, unit, headline, buckets }: { title: string; unit: string; headline: string; buckets: Bucket[] }) {
  const [at, setAt] = useState<number | null>(null)
  const n = buckets.length
  const top = ceiling(Math.max(1, ...buckets.map(b => b.value)))
  const empty = buckets.every(b => b.value === 0)
  return (
    <figure className={`${card} p-4 min-w-0`}>
      <figcaption className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-semibold text-gray-900">{title}</span>
        <span className="text-xs text-gray-500 text-right">{headline}</span>
      </figcaption>
      <div className="mt-3 grid grid-cols-[auto_1fr] gap-x-2">
        <div className="flex h-[120px] flex-col justify-between text-right text-[10.5px] leading-none tabular-nums text-gray-400" aria-hidden="true">
          <span>{num(top)}</span><span>{num(top / 2)}</span><span>0</span>
        </div>
        <div className="relative h-[120px]" onMouseLeave={() => setAt(null)}>
          <div className="absolute inset-x-0 top-0 border-t border-gray-100" />
          <div className="absolute inset-x-0 top-1/2 border-t border-gray-100" />
          <div className="absolute inset-x-0 bottom-0 border-t border-gray-300" />
          <div className={`absolute inset-0 flex items-end ${n > 60 ? 'gap-px' : 'gap-[2px]'}`}>
            {buckets.map((b, i) => {
              const height = (b.value / top) * 100
              return (
                <button
                  key={b.key}
                  type="button"
                  onMouseEnter={() => setAt(i)}
                  onFocus={() => setAt(i)}
                  onBlur={() => setAt(null)}
                  aria-label={`${b.long}: ${many(b.value, unit)}`}
                  className="group relative flex h-full min-w-0 flex-1 cursor-default items-end justify-center focus:outline-none"
                >
                  <span
                    className="block w-full max-w-[24px] rounded-t-[4px] group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-1 group-focus-visible:outline-gray-900"
                    style={{ height: `${height}%`, minHeight: b.value ? 2 : 0, background: at === i ? DONE : SERIES }}
                  />
                  {at === i && (
                    <span
                      className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-md bg-gray-900 px-2 py-1 text-left text-[11px] leading-snug text-white shadow ${i < n / 3 ? 'left-0' : i >= (2 * n) / 3 ? 'right-0' : 'left-1/2 -translate-x-1/2'}`}
                      style={{ bottom: `min(calc(${height}% + 6px), calc(100% - 40px))` }}
                    >
                      <b className="font-semibold tabular-nums">{num(b.value)}</b> {b.value === 1 ? unit : `${unit}s`}
                      <span className="block text-gray-300">{b.long}</span>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div />
        <div className="mt-1.5 flex justify-between text-[10.5px] text-gray-400" aria-hidden="true">
          <span>{buckets[0]?.label}</span>
          {n > 2 && <span>{buckets[Math.floor(n / 2)].label}</span>}
          {n > 1 && <span>{buckets[n - 1].label}</span>}
        </div>
      </div>
      {empty && <p className="mt-2 text-xs text-gray-400">Nothing in this period.</p>}
    </figure>
  )
}

/**
 * Where the learners of a course are. The length of the bar is how many learners the course
 * has, against the largest course; its parts are finished, in progress and not started.
 */
function Stage({ c, most }: { c: CourseStat; most: number }) {
  if (!c.enrolled) return none
  const counts = [c.finished, c.inProgress, c.notStarted]
  return (
    <div className="w-[150px]">
      <div
        className="flex h-2 gap-[2px] overflow-hidden rounded-full"
        style={{ width: `${Math.max(5, (c.enrolled / Math.max(1, most)) * 100)}%` }}
        role="img"
        aria-label={STAGES.map(([name], i) => `${counts[i]} ${name}`).join(', ')}
      >
        {STAGES.map(([name, colour], i) => counts[i] > 0 && <span key={name} className="h-full" style={{ flex: `${counts[i]} 0 3px`, background: colour }} />)}
      </div>
      <div className="mt-1 flex gap-2.5 text-xs tabular-nums text-gray-600">
        {STAGES.map(([name, colour], i) => (
          <span key={name} className="inline-flex items-center gap-1" title={`${counts[i]} ${name}`}><i className="h-1.5 w-1.5 rounded-full" style={{ background: colour }} />{counts[i]}</span>
        ))}
      </div>
    </div>
  )
}

/** A share of the way, 0 to 100. */
function Meter({ percent }: { percent: number }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-gray-200" role="img" aria-label={`${percent} percent`}>
      <div className="h-full rounded-full" style={{ width: `${percent}%`, background: SERIES }} />
    </div>
  )
}

// ---------------------------------------------------------------- the page
type CourseSort = 'enrolled' | 'title' | 'averageProgress' | 'activeInRange' | 'lessonsInRange' | 'hoursInRange' | 'certificatesInRange' | 'questionsInRange' | 'paid'
type StudentSort = 'recent' | 'courses' | 'hours' | 'name'
const PAGE = 25
const average = (l: LearnerStat) => (l.courses.length ? Math.round(l.courses.reduce((n, c) => n + c.progress, 0) / l.courses.length) : 0)

export default function LearnerAnalyticsPage() {
  const [preset, setPreset] = useState<Preset>('30')
  const [range, setRange] = useState(() => presetRange('30'))
  const [data, setData] = useState<LearnerAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [tab, setTab] = useState<'courses' | 'students'>('courses')
  const [sort, setSort] = useState<CourseSort>('enrolled')
  const [q, setQ] = useState('')
  const [course, setCourse] = useState('')
  const [several, setSeveral] = useState(false)
  const [activeOnly, setActiveOnly] = useState(false)
  const [order, setOrder] = useState<StudentSort>('recent')
  const [page, setPage] = useState(0)
  const [open, setOpen] = useState('')
  const asked = useRef(0)

  const load = useCallback(async () => {
    const mine = ++asked.current                       // a slow answer for an older period must not replace a newer one
    setLoading(true)
    setError('')
    try {
      const r = await fetch(`/api/admin/learner-analytics?from=${range.from}&to=${range.to}`, { cache: 'no-store' })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(j.error || `The figures could not be read (${r.status}). Try Refresh.`)
      if (mine === asked.current) setData(j)
    } catch (e) {
      if (mine === asked.current) setError(e instanceof Error ? e.message : 'The figures could not be read. Try Refresh.')
    } finally {
      if (mine === asked.current) setLoading(false)
    }
  }, [range])
  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(0) }, [q, course, several, activeOnly, order, data])

  // The charts: a column a day up to about six weeks, a week up to about a year, a month beyond that
  const charts = useMemo(() => {
    if (!data) return null
    const byDay = new Map<string, DayStat>(data.daily.map(d => [d.day, d]))
    const start = range.from === FIRST_DAY ? data.daily[0]?.day || range.to : range.from
    const days: string[] = []
    for (let d = start; d <= range.to && days.length < 4000; d = addDays(d, 1)) days.push(d)
    const grain: 'day' | 'week' | 'month' = days.length <= 45 ? 'day' : days.length <= 370 ? 'week' : 'month'
    const monday = (d: string) => addDays(d, -((new Date(`${d}T00:00:00Z`).getUTCDay() + 6) % 7))
    const keyOf = (d: string) => (grain === 'day' ? d : grain === 'month' ? d.slice(0, 7) : monday(d))
    const groups = new Map<string, string[]>()
    for (const d of days) { const k = keyOf(d); if (!groups.has(k)) groups.set(k, []); groups.get(k)!.push(d) }
    const month = (k: string, long: boolean) => new Date(`${k}-01T00:00:00Z`).toLocaleDateString('en-IN', { month: long ? 'long' : 'short', year: long ? 'numeric' : '2-digit', timeZone: 'UTC' })
    const label = (k: string) => (grain === 'month' ? month(k, false) : nice(k))
    const long = (k: string) => (grain === 'day' ? nice(k, true) : grain === 'week' ? `Week of ${nice(k, true)}` : month(k, true))
    const added = (pick: (d: DayStat) => number): Bucket[] => [...groups].map(([k, ds]) => ({ key: k, label: label(k), long: long(k), value: ds.reduce((n, d) => n + (byDay.get(d) ? pick(byDay.get(d)!) : 0), 0) }))
    // Different learners in a week or a month come counted from the server: adding up the days would count one person several times
    const active: Bucket[] = [...groups.keys()].map(k => ({ key: k, label: label(k), long: long(k), value: (grain === 'day' ? byDay.get(k)?.active : grain === 'week' ? data.activeByWeek[k] : data.activeByMonth[k]) ?? 0 }))
    return { grain, lessons: added(d => d.lessons), enrolments: added(d => d.enrolments), active }
  }, [data, range])

  const courses = useMemo(() => {
    const list = [...(data?.courses || [])]
    list.sort((a, b) => (sort === 'title' ? a.title.localeCompare(b.title) : b[sort] - a[sort] || b.enrolled - a.enrolled || a.title.localeCompare(b.title)))
    return list
  }, [data, sort])
  const most = useMemo(() => Math.max(1, ...(data?.courses || []).map(c => c.enrolled)), [data])

  const students = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const list = (data?.learners || []).filter(l =>
      (!needle || `${l.name} ${l.email} ${l.organization}`.toLowerCase().includes(needle))
      && (!course || l.courses.some(c => c.key === course))
      && (!several || l.courses.length > 1)
      && (!activeOnly || l.activeInRange))
    if (order === 'courses') list.sort((a, b) => b.courses.length - a.courses.length || b.finishedCount - a.finishedCount)
    else if (order === 'hours') list.sort((a, b) => b.hoursInRange - a.hoursInRange || b.lessonsInRange - a.lessonsInRange)
    else if (order === 'name') list.sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email))
    return list                                         // 'recent' is the order they arrive in
  }, [data, q, course, several, activeOnly, order])
  const pages = Math.max(1, Math.ceil(students.length / PAGE))
  const shown = students.slice(page * PAGE, page * PAGE + PAGE)
  const chosen = data?.courses.find(c => c.key === course)

  function excel() {
    if (!data) return
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.courses.map(c => ({
      Course: c.title, Code: c.code, Kind: KIND[c.kind], 'On the site': c.published ? 'yes' : 'no', Lessons: c.lessons, 'Length in hours': c.lengthHours,
      'Price $': c.price && c.price !== 'open' ? c.price.usd : '', 'Price ₹': c.price && c.price !== 'open' ? c.price.inr : '', 'Open to all': c.price === 'open' ? 'yes' : '',
      Enrolled: c.enrolled, 'Enrolled in the period': c.enrolledInRange, 'Active in the period': c.activeInRange,
      Finished: c.finished, 'In progress': c.inProgress, 'Not started': c.notStarted, 'Average progress %': c.averageProgress,
      'Lessons finished in the period': c.lessonsInRange, 'Hours in the period': c.hoursInRange, 'Hours in all': c.hours,
      'Certificates in the period': c.certificatesInRange, 'Questions in the period': c.questionsInRange,
      'Payments in all': c.paid, 'Payments in the period': c.paidInRange, 'With a coupon in the period': c.couponsInRange,
      'Received $ in all': c.usd, 'Received ₹ in all': c.inr, 'Received $ in the period': c.usdInRange, 'Received ₹ in the period': c.inrInRange,
    }))), 'By course')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.learners.map(l => ({
      Name: l.name, Email: l.email, Organisation: l.organization, Role: l.role, Joined: dayIn(l.joinedAt), 'Last active': dayIn(l.lastSeen),
      Courses: l.courses.length, 'Courses finished': l.finishedCount, 'Average progress %': average(l), Certificates: l.certificates,
      'Lessons finished in the period': l.lessonsInRange, 'Hours in the period': l.hoursInRange, 'Questions in the period': l.questionsInRange,
      'Active in the period': l.activeInRange ? 'yes' : 'no', 'Paid $': l.usd, 'Paid ₹': l.inr, 'Course codes': l.courses.map(c => c.code).join(', '),
    }))), 'By student')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.learners.flatMap(l => l.courses.map(c => ({
      Name: l.name, Email: l.email, Organisation: l.organization, Course: c.title, Code: c.code, Kind: KIND[c.kind],
      'In the course since': dayIn(c.enrolledAt), 'Last opened': dayIn(c.lastActive), 'Progress %': c.progress, 'Lessons done': c.lessonsDone, Lessons: c.lessons,
      Finished: c.finished ? 'yes' : 'no', Certificate: dayIn(c.certificateAt), 'Hours in all': c.hours,
      'Paid amount': c.paid ? c.paid.amount : '', 'Paid in': c.paid ? c.paid.currency : '', Coupon: c.paid?.coupon || '',
    })))), 'Student by course')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.daily.map(d => ({
      Day: d.day, 'Learners active': d.active, 'Lessons finished': d.lessons, 'New enrolments': d.enrolments, 'New accounts': d.joined, 'Received $': d.usd, 'Received ₹': d.inr,
    }))), 'By day')
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([{ Note: `Period: ${range.from === FIRST_DAY ? 'all time' : range.from} to ${range.to}. Made ${when(data.generatedAt)}.` }, ...data.notes.map(n => ({ Note: n }))]), 'How it is counted')
    XLSX.writeFile(wb, `gennoor-learners-${preset === 'all' ? 'all-time' : `${range.from}-to-${range.to}`}.xlsx`)
  }

  const t = data?.totals
  const period = preset === 'all' ? 'all time' : range.from === range.to ? nice(range.from, true) : `${nice(range.from, true)} to ${nice(range.to, true)}`
  const th = 'px-3 py-2 font-medium whitespace-nowrap'
  const head = (key: CourseSort, label: string, left = false) => (
    <th className={`${th} ${left ? 'text-left' : 'text-right'}`} aria-sort={sort === key ? (key === 'title' ? 'ascending' : 'descending') : undefined}>
      <button type="button" onClick={() => setSort(key)} title={`Sort by ${label.toLowerCase()}`} className={`inline-flex items-center gap-0.5 hover:text-gray-900 ${sort === key ? 'text-gray-900' : ''}`}>
        {label}<ChevronDown className={`h-3 w-3 ${sort === key ? '' : 'opacity-0'}`} />
      </button>
    </th>
  )

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-gray-900">Learner analytics</h1>
          <p className="mt-0.5 text-xs text-gray-500">Who is learning what, by course and by student. Showing {period}.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={load} disabled={loading} className={btn}><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />{loading ? 'Reading…' : 'Refresh'}</button>
          <button onClick={excel} disabled={!data} className={btn}><Download className="h-3.5 w-3.5" />Download Excel</button>
        </div>
      </div>

      {/* The period comes first: it scopes everything below it */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5" role="group" aria-label="Period">
        {PRESETS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => { setPreset(key); setRange(presetRange(key)) }}
            aria-pressed={preset === key}
            className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-[13px] transition-colors ${preset === key ? 'border-gray-900 bg-gray-900 font-medium text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'}`}
          >
            {preset === key && <Check className="h-3.5 w-3.5" strokeWidth={3} />}{label}
          </button>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-gray-200 sm:block" aria-hidden="true" />
        {/* Your own dates: the two stay together on one line */}
        <span className="inline-flex items-center gap-1.5">
          <label className="inline-flex items-center gap-1.5 text-[13px] text-gray-600">From
            <input type="date" value={range.from === FIRST_DAY ? '' : range.from} max={range.to} onChange={e => { if (e.target.value) { setPreset('custom'); setRange(r => ({ ...r, from: e.target.value })) } }} className={`${field} px-2 py-1 text-[13px] text-gray-900`} />
          </label>
          <label className="inline-flex items-center gap-1.5 text-[13px] text-gray-600">to
            <input type="date" value={range.to} min={range.from === FIRST_DAY ? undefined : range.from} max={today()} onChange={e => { if (e.target.value) { setPreset('custom'); setRange(r => ({ ...r, to: e.target.value })) } }} className={`${field} px-2 py-1 text-[13px] text-gray-900`} />
          </label>
        </span>
      </div>

      {error && <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">{error}</div>}

      {!data && !error && (
        <div className="mt-4" role="status">
          <p className="mb-3 text-xs text-gray-500">Reading the learner records. This takes a few seconds.</p>
          <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">{[0, 1, 2, 3, 4, 5, 6, 7].map(i => <div key={i} className="admin-skeleton h-[78px]" />)}</div>
          <div className="mt-3 grid gap-2.5 lg:grid-cols-3">{[0, 1, 2].map(i => <div key={i} className="admin-skeleton h-[200px]" />)}</div>
        </div>
      )}

      {data && t && charts && (
        // While another period is being read, the last one stays where it is, a little faded
        <div className={`transition-opacity ${loading ? 'opacity-60' : ''}`}>
          <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
            <Tile label="Learners" value={num(t.learners)} note={`${num(t.joinedInRange)} joined in this period`} />
            <Tile label="Active in this period" value={num(t.activeInRange)} note={`${many(t.questionsInRange, 'question')} put to the course assistant`} />
            <Tile label="New enrolments" value={num(t.enrolmentsInRange)} note={`${num(t.enrolments)} in all`} />
            <Tile label="On more than one course" value={num(t.onSeveralCourses)} note="learners, as of now" />
            <Tile label="Lessons finished" value={num(t.lessonsInRange)} note="in this period" />
            <Tile label="Hours of learning" value={num(t.hoursInRange)} note="in this period" />
            <Tile label="Courses finished" value={num(t.finishedInRange)} note={`${many(t.certificatesInRange, 'certificate')} issued`} />
            <Tile label="Money received" value={money(t.usdInRange, t.inrInRange) || '0'} note={`${many(t.paymentsInRange, 'payment')} in this period`} />
          </div>

          <div className="mt-3 grid gap-2.5 lg:grid-cols-3">
            <Columns title="Lessons finished" unit="lesson" headline={`${num(t.lessonsInRange)} in the period`} buckets={charts.lessons} />
            <Columns title="Learners active" unit="learner" headline={`${many(t.activeInRange, 'different learner')}`} buckets={charts.active} />
            <Columns title="New enrolments" unit="enrolment" headline={`${num(t.enrolmentsInRange)} in the period`} buckets={charts.enrolments} />
          </div>
          <p className="mt-1.5 text-xs text-gray-400">Each column is one {charts.grain}. Point at a column, or tab to it, to read it.</p>

          <div className="mt-4 flex gap-1 border-b border-gray-200 text-sm" role="tablist" aria-label="Break down">
            {([['courses', `By course (${data.courses.length})`], ['students', `By student (${data.learners.length})`]] as const).map(([key, label]) => (
              <button key={key} type="button" role="tab" aria-selected={tab === key} onClick={() => setTab(key)} className={`-mb-px border-b-2 px-3 py-2 ${tab === key ? 'border-gray-900 font-medium text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{label}</button>
            ))}
          </div>

          {tab === 'courses' ? (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                <span>Where learners are:</span>
                {STAGES.map(([name, colour]) => <span key={name} className="inline-flex items-center gap-1.5"><i className="h-2 w-4 rounded-full" style={{ background: colour }} />{name}</span>)}
                <span className="text-gray-400">The longer the bar, the more learners. Pick a course to see its students.</span>
              </div>
              <div className={`${card} mt-2 max-h-[72vh] overflow-auto`}>
                <table className="w-full min-w-[1020px] text-[13px]">
                  <thead className="sticky top-0 z-10 bg-gray-50 text-xs text-gray-500">
                    <tr>
                      {head('title', 'Course', true)}
                      {head('enrolled', 'Enrolled')}
                      <th className={`${th} text-left`}>Where they are</th>
                      {head('averageProgress', 'Progress')}
                      {head('activeInRange', 'Active')}
                      {head('lessonsInRange', 'Lessons')}
                      {head('hoursInRange', 'Hours')}
                      {head('certificatesInRange', 'Certificates')}
                      {head('questionsInRange', 'Questions')}
                      {head('paid', 'Paid for')}
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(c => (
                      <tr key={c.key} className="cursor-pointer border-t border-gray-100 align-top hover:bg-gray-50" onClick={() => { setCourse(c.key); setTab('students') }}>
                        <td className="min-w-[230px] px-3 py-2">
                          <button type="button" className="break-words text-left font-medium text-gray-900 hover:underline">{c.title}</button>
                          <div className="text-xs text-gray-400">{c.code} · {KIND[c.kind]}</div>
                          <div className="text-xs text-gray-400">{[many(c.lessons, 'lesson'), c.lengthHours ? `${c.lengthHours} h long` : '', priceOf(c)].filter(Boolean).join(' · ')}</div>
                          {!c.published && <div className="text-xs text-amber-700">Not on the site at the moment</div>}
                        </td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-right tabular-nums"><span className="font-semibold text-gray-900">{num(c.enrolled)}</span>{c.enrolledInRange > 0 && <div className="text-xs text-gray-400">+{num(c.enrolledInRange)} in period</div>}</td>
                        <td className="px-2.5 py-2"><Stage c={c} most={most} /></td>
                        <td className="px-2.5 py-2 text-right tabular-nums">{c.enrolled ? `${c.averageProgress}%` : none}</td>
                        <td className="px-2.5 py-2 text-right tabular-nums">{num(c.activeInRange)}</td>
                        <td className="px-2.5 py-2 text-right tabular-nums">{num(c.lessonsInRange)}</td>
                        <td className="whitespace-nowrap px-2.5 py-2 text-right tabular-nums">{num(c.hoursInRange)}{c.hours > 0 && <div className="text-xs text-gray-400">{num(c.hours)} in all</div>}</td>
                        <td className="px-2.5 py-2 text-right tabular-nums">{num(c.certificatesInRange)}</td>
                        <td className="px-2.5 py-2 text-right tabular-nums">{c.kind === 'claude' ? none : num(c.questionsInRange)}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {c.kind !== 'studio' ? none : c.paid ? <>{money(c.usd, c.inr) || '0'}<div className="text-xs text-gray-400">{many(c.paid, 'payment')}</div></> : '0'}
                          {c.paidInRange > 0 && <div className="text-xs text-gray-400">+{money(c.usdInRange, c.inrInRange) || num(c.paidInRange)} in period{c.couponsInRange > 0 ? `, ${num(c.couponsInRange)} with a coupon` : ''}</div>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {courses.length === 0 && <div className="p-8 text-center text-sm text-gray-500">No course has a learner yet.</div>}
              </div>
              <p className="mt-2 text-xs text-gray-400">Active, Lessons, Hours, Certificates and Questions are for the period. Enrolled, where they are, Progress (the average over everyone enrolled) and Paid for are as of now.</p>
            </>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, email or organisation" aria-label="Search students" className={`${field} w-64 max-w-full px-2.5 py-1.5`} />
                <select value={course} onChange={e => setCourse(e.target.value)} aria-label="Course" className={`${field} w-[190px] max-w-full py-1.5 pl-2 pr-8`}>
                  <option value="">All courses</option>
                  {[...data.courses].filter(c => c.enrolled > 0).sort((a, b) => a.code.localeCompare(b.code)).map(c => <option key={c.key} value={c.key}>{c.code} · {c.title}</option>)}
                </select>
                <select value={order} onChange={e => setOrder(e.target.value as StudentSort)} aria-label="Order" className={`${field} w-[170px] max-w-full py-1.5 pl-2 pr-8`}>
                  <option value="recent">Last active first</option>
                  <option value="courses">Most courses first</option>
                  <option value="hours">Most hours first</option>
                  <option value="name">By name</option>
                </select>
                {([[several, setSeveral, 'On more than one course'], [activeOnly, setActiveOnly, 'Active in this period']] as const).map(([on, set, label]) => (
                  <button key={label} type="button" aria-pressed={on} onClick={() => set(!on)}
                    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-xs transition-colors ${on ? 'border-gray-900 bg-gray-900 font-medium text-white' : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'}`}>
                    {on && <Check className="h-3 w-3" strokeWidth={3} />}{label}
                  </button>
                ))}
                <span className="ml-auto text-xs text-gray-500">{num(students.length)} of {num(data.learners.length)}</span>
              </div>
              {chosen && (
                <p className="mt-2 text-xs text-gray-500">
                  Students of <b className="font-medium text-gray-800">{chosen.title}</b>. <button type="button" onClick={() => setCourse('')} className="underline hover:text-gray-900">Show all students</button>
                </p>
              )}
              <div className={`${card} mt-2 overflow-auto [container-type:inline-size]`}>
                <table className="w-full min-w-[1040px] text-[13px]">
                  <thead className="bg-gray-50 text-xs text-gray-500">
                    <tr>
                      <th className={`${th} text-left`}>Student</th><th className={`${th} text-left`}>Courses</th><th className={`${th} text-left`}>Completion</th>
                      <th className={`${th} text-right`}>Lessons</th><th className={`${th} text-right`}>Hours</th><th className={`${th} text-right`}>Questions</th>
                      <th className={`${th} text-left`}>Last active</th><th className={`${th} text-left`}>Joined</th><th className={`${th} text-right`}>Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map(l => (
                      <Fragment key={l.email}>
                        <tr className="cursor-pointer border-t border-gray-100 align-top hover:bg-gray-50" onClick={() => setOpen(o => (o === l.email ? '' : l.email))}>
                          <td className="max-w-[300px] px-3 py-2">
                            <button type="button" aria-expanded={open === l.email} className="flex items-start gap-1.5 text-left">
                              <ChevronRight className={`mt-1 h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform ${open === l.email ? 'rotate-90' : ''}`} />
                              <span className="min-w-0">
                                <span className="block break-words font-medium text-gray-900">{l.name || 'No name given'}</span>
                                <span className="block break-all text-xs text-gray-500">{l.email}</span>
                                {(l.organization || l.role) && <span className="block break-words text-xs text-gray-400">{[l.role, l.organization].filter(Boolean).join(', ')}</span>}
                              </span>
                            </button>
                          </td>
                          <td className="px-3 py-2">
                            <span className="font-semibold tabular-nums text-gray-900">{l.courses.length}</span>
                            <div className="mt-0.5 flex max-w-[220px] flex-wrap gap-1">
                              {l.courses.slice(0, 4).map(c => <span key={c.key} className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-700" title={c.title}>{c.code}</span>)}
                              {l.courses.length > 4 && <span className="text-[11px] text-gray-400">+{l.courses.length - 4}</span>}
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            {l.courses.length ? (
                              <div className="w-[150px]">
                                <Meter percent={average(l)} />
                                <div className="mt-1 text-xs tabular-nums text-gray-500">{average(l)}% · {l.finishedCount} of {l.courses.length} finished</div>
                              </div>
                            ) : none}
                          </td>
                          <td className="px-3 py-2 text-right tabular-nums">{num(l.lessonsInRange)}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{num(l.hoursInRange)}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{num(l.questionsInRange)}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-gray-600">{when(l.lastSeen) || none}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-gray-600">{when(l.joinedAt) || none}</td>
                          <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">{money(l.usd, l.inr) || none}</td>
                        </tr>
                        {open === l.email && (
                          <tr className="bg-gray-50">
                            <td colSpan={9} className="px-3 pb-3 pt-1">
                              {/* As wide as the panel, not the table: on a phone it stays in view while the table scrolls sideways */}
                              <div className="sticky left-3 w-[calc(100cqw-1.5rem)] max-w-full">
                              {l.courses.length === 0 ? <p className="pl-5 text-xs text-gray-500">Has an account, and has not started a course.</p> : (
                                <ul className="grid gap-1.5 pl-5">
                                  {l.courses.map(c => (
                                    <li key={c.key} className="grid items-center gap-x-4 gap-y-1 rounded-lg border border-gray-200 bg-white px-3 py-2 md:grid-cols-[minmax(0,1.6fr)_minmax(140px,1fr)_minmax(0,1fr)]">
                                      <div className="min-w-0">
                                        <div className="break-words font-medium text-gray-900">{c.title}</div>
                                        <div className="text-xs text-gray-400">{[c.code, KIND[c.kind], c.enrolledAt ? `since ${when(c.enrolledAt)}` : ''].filter(Boolean).join(' · ')}</div>
                                      </div>
                                      <div>
                                        <Meter percent={c.progress} />
                                        <div className="mt-1 text-xs tabular-nums text-gray-500">{[c.finished ? 'Finished' : `${c.progress}%`, `${c.lessonsDone} of ${c.lessons} lessons`, c.hours ? `${c.hours} h` : ''].filter(Boolean).join(' · ')}</div>
                                      </div>
                                      <div className="text-xs text-gray-500 md:text-right">
                                        {c.certificateAt && <div className="font-medium text-gray-900">Certificate {when(c.certificateAt)}</div>}
                                        {c.lastActive && <div>Last opened {when(c.lastActive)}</div>}
                                        {c.paid && <div>Paid {c.paid.currency === 'INR' ? inr(c.paid.amount) : usd(c.paid.amount)}{c.paid.coupon ? `, coupon ${c.paid.coupon}` : ''}</div>}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
                {students.length === 0 && <div className="p-8 text-center text-sm text-gray-500">{data.learners.length ? 'No student matches. Clear the search or the filters to see everyone.' : 'No learner has an account yet.'}</div>}
              </div>
              {pages > 1 && (
                <div className="mt-2 flex items-center justify-end gap-2 text-[13px] text-gray-600">
                  <button type="button" className={btn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</button>
                  <span className="tabular-nums">Page {page + 1} of {pages}</span>
                  <button type="button" className={btn} disabled={page >= pages - 1} onClick={() => setPage(p => p + 1)}>Next</button>
                </div>
              )}
              <p className="mt-2 text-xs text-gray-400">Lessons, Hours and Questions are for the period. Completion is the average over the student&apos;s courses, as of now. Pick a student to see each course.</p>
            </>
          )}

          <div className="mt-5 max-w-[900px] text-xs text-gray-500">
            <h2 className="text-[13px] font-semibold leading-normal tracking-normal text-gray-700">How these figures are counted</h2>
            <ul className="mt-1.5 list-disc space-y-1 pl-5">{data.notes.map(n => <li key={n}>{n}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  )
}
