import { promises as fs } from 'fs'
import path from 'path'
import { BlobServiceClient } from '@azure/storage-blob'
import { commentOnPost, getLinkedInState, publishVideo, resharePost } from '@/lib/linkedin'
import { formatForLinkedIn } from '@/lib/linkedin-format'
import { readBlob, writeBlob } from '@/lib/social/studio'
import { sendAdminAlert } from '@/lib/blog-publish'
import { localParts, zonedToUtc } from '@/lib/autopilot/time'
import { nextCohort } from '@/data/ai-weekend'
import { WEEKEND_WEEKDAY, WEEKEND_WEEKEND } from '@/data/linkedin-campaign-weekend'
import { OVERVIEW_POSTS } from '@/data/linkedin-campaign-overview'

/**
 * The LinkedIn campaign for the two films (owner, 13 November 2026).
 *
 *  - The AI Weekend film goes out every second day, at a different time each time:
 *    morning, then afternoon, then evening. A post that lands on a Saturday or a Sunday is
 *    written in a slower, more personal way.
 *  - The film "What we do" goes out twice a week, on days that have no AI Weekend post.
 *  - Every post goes out from the founder's PROFILE first. A little later the COMPANY PAGE
 *    reposts it with a short line of its own. The link to the page is the first comment.
 *  - The posts are written once (src/data/linkedin-campaign-*.ts) for a cycle of 14 weeks,
 *    then the cycle starts again by itself. 14 weeks, because it is about three months, it
 *    is a whole number of weeks (a weekend post always lands on a weekend) and it is an even
 *    number of days (the "every second day" rhythm carries over into the next cycle).
 *
 * It runs on the same heartbeat as everything else (src/lib/heartbeat.ts), keeps what it
 * has done in the store (promo-campaign/state.json), and is seen and steered from
 * Admin -> Film campaign. Modelled on the Claude certification video series
 * (src/lib/video-series.ts), which posts to the page and the profile separately.
 */

export interface CampaignPost {
  id: string
  /** The founder's post: the hook in **double asterisks**, short lines, the page address, hashtags */
  text: string
  /** The short line the company page writes when it reposts */
  share: string
}

export type Film = 'weekend' | 'overview'
export type Target = 'member' | 'organization'
export interface TargetRun { status: 'done' | 'failed' | 'missed'; at: string; attempts: number; urn?: string; error?: string; comment?: string; commentError?: string }

export interface PlannedPost extends CampaignPost {
  /** One going-out of a post: "<cycle>:<id>" */
  key: string
  cycle: number
  film: Film
  /** Which file of the film: the tall one reads best on a phone, the wide one on a desk */
  shape: 'tall' | 'wide'
  date: string
  time: string
  slot: 'morning' | 'afternoon' | 'evening'
  weekendDay: boolean
}

export interface CampaignState {
  enabled: boolean
  runs: Record<string, Partial<Record<Target, TargetRun>>>
  /** Words changed in the admin centre. Kept for every cycle. Keyed by the post's id. */
  texts: Record<string, { text?: string; share?: string }>
  /** One going-out left out. Keyed like `runs`. */
  skipped: Record<string, boolean>
  log: { at: string; msg: string }[]
  lastTick?: string
}

export const TZ = 'Asia/Kolkata'
/** The first day of the first cycle. A Saturday: the plan below counts on it. */
export const START = '2026-11-14'
export const CYCLE_DAYS = 98
const FILE = 'promo-campaign/state.json'
/** How late a post may still go out, in minutes. After that it is left for the next cycle. */
const GRACE_MIN = 180
/** The page reposts this long after the profile has posted, so the founder's post is clearly first. */
const RESHARE_AFTER_MIN = 25
const RESHARE_WITHIN_MIN = 24 * 60
const MAX_ATTEMPTS = 3

/** Morning, afternoon, evening (India time), away from the times the other LinkedIn jobs use. */
const WEEKEND_TIMES = [['morning', '09:15'], ['afternoon', '13:30'], ['evening', '18:45']] as const
const OVERVIEW_TIMES = [['morning', '11:15'], ['afternoon', '16:15'], ['evening', '19:45']] as const
/** The days of each fortnight (counted from a Saturday) that carry "What we do": Tuesday, Thursday, Monday, Wednesday. */
const OVERVIEW_DAYS = [3, 5, 9, 11]

const FILMS: Record<Film, { title: string; wide: string; tall: string; tags: string[] }> = {
  weekend: { title: 'The Gennoor AI Weekend', wide: 'gennoor-ai-weekend.mp4', tall: 'gennoor-ai-weekend-reel.mp4', tags: ['AIWeekend', 'Claude'] },
  overview: { title: 'Gennoor Tech: what we do', wide: 'gennoor-what-we-do.mp4', tall: 'gennoor-what-we-do-reel.mp4', tags: ['AITraining', 'Upskilling'] },
}

const addDays = (ymd: string, n: number) => new Date(Date.parse(`${ymd}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10)
const dowOf = (ymd: string) => new Date(`${ymd}T00:00:00Z`).getUTCDay()
const daysBetween = (a: string, b: string) => Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000)

/** The cycle a day belongs to. Days before the start belong to cycle 0. */
export const cycleOf = (ymd: string) => Math.max(0, Math.floor(daysBetween(START, ymd) / CYCLE_DAYS))
export const cycleStart = (cycle: number) => addDays(START, cycle * CYCLE_DAYS)

/** Every post of one cycle, with its day and time. The same for every cycle, 14 weeks later each time. */
export function plan(cycle: number): PlannedPost[] {
  const first = cycleStart(cycle)
  const out: PlannedPost[] = []
  // The AI Weekend film: every second day. A weekend day takes the next weekend-voiced post.
  let weekday = 0, weekend = 0
  for (let i = 0; i * 2 < CYCLE_DAYS; i++) {
    const date = addDays(first, i * 2)
    const weekendDay = dowOf(date) === 0 || dowOf(date) === 6
    const post = weekendDay ? WEEKEND_WEEKEND[weekend++ % WEEKEND_WEEKEND.length] : WEEKEND_WEEKDAY[weekday++ % WEEKEND_WEEKDAY.length]
    const [slot, time] = WEEKEND_TIMES[i % 3]
    out.push({ ...post, key: `${cycle}:${post.id}`, cycle, film: 'weekend', shape: i % 2 === 0 ? 'tall' : 'wide', date, time, slot, weekendDay })
  }
  // "What we do": four days of every fortnight, none of them a day of the AI Weekend film.
  let n = 0
  for (let block = 0; block * 14 < CYCLE_DAYS; block++) {
    for (const day of OVERVIEW_DAYS) {
      const post = OVERVIEW_POSTS[n % OVERVIEW_POSTS.length]
      const [slot, time] = OVERVIEW_TIMES[n % 3]
      out.push({ ...post, key: `${cycle}:${post.id}`, cycle, film: 'overview', shape: n % 2 === 0 ? 'wide' : 'tall', date: addDays(first, block * 14 + day), time, slot, weekendDay: false })
      n++
    }
  }
  return out.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
}

export async function loadCampaign(): Promise<CampaignState> {
  const raw = await readBlob(FILE)
  const base: CampaignState = { enabled: true, runs: {}, texts: {}, skipped: {}, log: [] }
  return raw ? { ...base, ...JSON.parse(raw.toString('utf-8')) } : base
}

export async function saveCampaign(s: CampaignState) {
  s.log = s.log.slice(-200)
  // What is older than the cycle before this one is of no more use
  const keep = cycleOf(localParts(new Date(), TZ).date) - 1
  for (const k of Object.keys(s.runs)) if (Number(k.split(':')[0]) < keep) delete s.runs[k]
  for (const k of Object.keys(s.skipped)) if (Number(k.split(':')[0]) < keep) delete s.skipped[k]
  await writeBlob(FILE, JSON.stringify(s), 'application/json')
}

export type ShownPost = PlannedPost & { skip: boolean; edited: boolean; original: CampaignPost }

/** One cycle as the admin centre shows it: the words as changed there, and what is left out. */
export function effective(s: CampaignState, cycle: number): ShownPost[] {
  return plan(cycle).map((p) => {
    const o = s.texts[p.id] || {}
    return { ...p, text: o.text || p.text, share: o.share || p.share, skip: !!s.skipped[p.key], edited: !!(o.text || o.share), original: { id: p.id, text: p.text, share: p.share } }
  })
}

/**
 * The dates the AI Weekend page shows, written into a post as it goes out, so a post is right
 * in every cycle: {dates} "28 and 29 November", {when} "on 28 and 29 November" (in its own
 * week "this weekend, 28 and 29 November", on the Saturday "today and tomorrow, ...").
 */
export function fill(text: string, now = new Date()): string {
  const cohort = nextCohort(now)
  const dates = cohort.label.replace(/\s+\d{4}$/, '')
  const away = daysBetween(localParts(now, TZ).date, cohort.saturday)
  const when = away <= 0 ? `today and tomorrow, ${dates}` : away <= 5 ? `this weekend, ${dates}` : `on ${dates}`
  return text.replace(/\{dates\}/g, dates).replace(/\{when\}/g, when)
}

/** The page a post points to, as a full link for the first comment. It is the address written in the post. */
export function linkOf(p: { text: string; film: Film }): string {
  const m = p.text.match(/gennoor\.com(\/[a-z0-9\-/]*)?/i)
  const page = (m?.[1] || '').replace(/\/+$/, '') || '/'
  return `https://gennoor.com${page}?utm_source=linkedin&utm_medium=post&utm_campaign=${p.film === 'weekend' ? 'ai-weekend-film' : 'what-we-do-film'}`
}

const commentOf = (p: { text: string; film: Film }) => (p.film === 'weekend' ? `Reserve your seat for the AI Weekend: ${linkOf(p)}` : `See it on the website: ${linkOf(p)}`)

/** The film itself. The wide films are in the site's own files; the tall ones are in the media store. */
async function videoOf(film: Film, shape: 'tall' | 'wide'): Promise<Buffer> {
  const name = FILMS[film][shape]
  if (shape === 'wide') {
    try {
      return await fs.readFile(path.join(process.cwd(), 'public', 'videos', name))
    } catch {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.gennoor.com'}/videos/${name}`)
      if (!res.ok) throw new Error(`The film ${name} could not be read (${res.status}).`)
      return Buffer.from(await res.arrayBuffer())
    }
  }
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set.')
  return BlobServiceClient.fromConnectionString(conn).getContainerClient('media').getBlockBlobClient(`videos/${name}`).downloadToBuffer()
}

const alive = (expiresAt: string | undefined, now: Date) => !!expiresAt && new Date(expiresAt) > now

/** Step one: the founder's profile posts the film, then adds the link as the first comment. A failed comment never fails the post. */
export async function postFromProfile(p: PlannedPost, now = new Date()): Promise<{ urn: string; comment?: string; commentError?: string }> {
  const li = await getLinkedInState()
  const token = alive(li.expiresAt, now) ? li.accessToken : ''
  if (!li.memberUrn || !token) throw new Error('The LinkedIn profile is not connected, or its sign-in has run out.')
  const urn = await publishVideo({ token, author: li.memberUrn, commentary: formatForLinkedIn(fill(p.text, now)), video: await videoOf(p.film, p.shape), title: FILMS[p.film].title })
  for (let i = 0; i < 3; i++) {
    try { return { urn, comment: await commentOnPost({ token, actor: li.memberUrn, postUrn: urn, text: commentOf(p) }) } }
    catch (e: unknown) { if (i === 2) return { urn, commentError: String((e as Error)?.message || e).slice(0, 300) }; await new Promise((r) => setTimeout(r, 4000 * (i + 1))) }
  }
  return { urn }
}

/** Step two: the company page reposts the founder's post, with its own short line. */
export async function repostFromPage(p: PlannedPost, parentUrn: string, now = new Date()): Promise<{ urn: string }> {
  const li = await getLinkedInState()
  const token = alive(li.orgExpiresAt, now) ? li.orgAccessToken : ''
  if (!li.orgUrn || !token) throw new Error('The LinkedIn company page is not connected, or its sign-in has run out.')
  const urn = await resharePost({ token, author: li.orgUrn, parentUrn, commentary: formatForLinkedIn(fill(p.share, now), { fallbackHashtags: FILMS[p.film].tags }) })
  return { urn }
}

const note = (s: CampaignState, msg: string) => { s.log.push({ at: new Date().toISOString(), msg }) }
const errorOf = (e: unknown) => String((e as Error)?.message || e).slice(0, 300)

/** Runs on every heartbeat: posts what is due from the profile, and has the page repost what the profile has posted. */
export async function campaignTick(now = new Date()): Promise<string[]> {
  const s = await loadCampaign()
  const out: string[] = []
  s.lastTick = now.toISOString()
  if (!s.enabled) { await saveCampaign(s); return ['paused'] }
  const today = localParts(now, TZ).date
  if (today < START) { await saveCampaign(s); return [`starts on ${START}`] }
  const cycle = cycleOf(today)
  // Yesterday's last post may still be waiting for its repost when a new cycle begins
  const posts = [...(cycle > 0 ? effective(s, cycle - 1).slice(-2) : []), ...effective(s, cycle)]
  for (const p of posts) {
    if (p.skip) continue
    const due = zonedToUtc(p.date, p.time, TZ)
    const late = (now.getTime() - due.getTime()) / 60000
    if (late < 0 || late > RESHARE_WITHIN_MIN + GRACE_MIN + 60) continue
    const runs = (s.runs[p.key] ||= {})

    // 1. the profile
    const m = runs.member
    if (!m || (m.status === 'failed' && m.attempts < MAX_ATTEMPTS)) {
      if (late > GRACE_MIN) {
        runs.member = { status: 'missed', at: now.toISOString(), attempts: m?.attempts || 0, error: m?.error }
        note(s, `${p.id} (${p.date} ${p.time}): missed its time`)
        await sendAdminAlert('A LinkedIn campaign post was missed', `<p>The post "${p.id}" of ${p.date} ${p.time} IST could not go out from the profile${m?.error ? `: ${m.error}` : ''}.</p><p>Open Admin, Film campaign, to see why. It comes round again in the next cycle.</p>`, 'promo-campaign-missed')
      } else {
        try {
          const done = await postFromProfile(p, now)
          runs.member = { status: 'done', at: new Date().toISOString(), attempts: (m?.attempts || 0) + 1, ...done }
          note(s, `${p.id}: posted from the profile${done.commentError ? ` (the link comment failed: ${done.commentError})` : ', with the link as the first comment'}`)
          out.push(`${p.id} profile posted`)
        } catch (e) {
          runs.member = { status: 'failed', at: new Date().toISOString(), attempts: (m?.attempts || 0) + 1, error: errorOf(e) }
          note(s, `${p.id}: the profile post failed (${runs.member.error})`)
          out.push(`${p.id} profile failed`)
        }
      }
      await saveCampaign(s)
      continue // the page waits for a later heartbeat
    }

    // 2. the company page reposts it
    const o = runs.organization
    if (m.status === 'done' && m.urn && (!o || (o.status === 'failed' && o.attempts < MAX_ATTEMPTS))) {
      const since = (now.getTime() - Date.parse(m.at)) / 60000
      if (since < RESHARE_AFTER_MIN) continue
      if (since > RESHARE_WITHIN_MIN) {
        runs.organization = { status: 'missed', at: now.toISOString(), attempts: o?.attempts || 0, error: o?.error }
        note(s, `${p.id}: the company page did not repost within a day`)
        await sendAdminAlert('The company page did not repost a campaign post', `<p>The founder's post "${p.id}" of ${p.date} went out, but the company page could not repost it${o?.error ? `: ${o.error}` : ''}.</p><p>Open Admin, Film campaign.</p>`, 'promo-campaign-repost')
      } else {
        try {
          const done = await repostFromPage(p, m.urn, now)
          runs.organization = { status: 'done', at: new Date().toISOString(), attempts: (o?.attempts || 0) + 1, ...done }
          note(s, `${p.id}: reposted by the company page`)
          out.push(`${p.id} page reposted`)
        } catch (e) {
          runs.organization = { status: 'failed', at: new Date().toISOString(), attempts: (o?.attempts || 0) + 1, error: errorOf(e) }
          note(s, `${p.id}: the company page repost failed (${runs.organization.error})`)
          out.push(`${p.id} page failed`)
        }
      }
      await saveCampaign(s)
    }
  }
  await saveCampaign(s)
  return out.length ? out : ['nothing due']
}
