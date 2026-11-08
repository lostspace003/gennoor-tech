import { BlobServiceClient } from '@azure/storage-blob'
import SERIES from '@/data/cert-video-series.json'
import { commentOnPost, getLinkedInState, publishVideo } from '@/lib/linkedin'
import { formatForLinkedIn } from '@/lib/linkedin-format'
import { readBlob, writeBlob } from '@/lib/social/studio'
import { sendAdminAlert } from '@/lib/blog-publish'
import { localParts, zonedToUtc } from '@/lib/autopilot/time'

/**
 * Claude certification video series: one narrated flow video a day, posted to the company page and the profile.
 * Separate from the LinkedIn autopilot (own schedule, own state blob). The schedule is fixed in
 * src/data/cert-video-series.json (built by claude-thing/flows/build_linkedin_pack.js); this only publishes it.
 */
export type Target = 'organization' | 'member'
export interface SeriesItem { id: string; date: string; time: string; slug: string; code: string; course: string; topic: string; title: string; text: string; url: string; comment: string }
export interface TargetRun { status: 'done' | 'failed' | 'missed'; at: string; attempts: number; urn?: string; error?: string; comment?: string; commentError?: string }
export interface SeriesState {
  enabled: boolean
  runs: Record<string, Partial<Record<Target, TargetRun>>>
  /** Admin edits: replaced text, skipped, or moved to another date. */
  overrides: Record<string, { text?: string; skip?: boolean; date?: string }>
  log: { at: string; msg: string }[]
  lastTick?: string
}

export const TZ = 'Asia/Kolkata'
const FILE = 'video-series/state.json'
const GRACE_MIN = 180
const MAX_ATTEMPTS = 3
const TARGETS: Target[] = ['organization', 'member']

export const items = (): SeriesItem[] => (SERIES as { items: SeriesItem[] }).items

export async function loadSeries(): Promise<SeriesState> {
  const raw = await readBlob(FILE)
  const base: SeriesState = { enabled: true, runs: {}, overrides: {}, log: [] }
  return raw ? { ...base, ...JSON.parse(raw.toString('utf-8')) } : base
}
export async function saveSeries(s: SeriesState) { s.log = s.log.slice(-200); await writeBlob(FILE, JSON.stringify(s), 'application/json') }

export function effective(s: SeriesState): (SeriesItem & { skip: boolean; edited: boolean })[] {
  return items().map(it => {
    const o = s.overrides[it.id] || {}
    return { ...it, date: o.date || it.date, text: o.text || it.text, skip: !!o.skip, edited: !!o.text }
  }).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
}

async function videoOf(id: string): Promise<Buffer> {
  const conn = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!conn) throw new Error('AZURE_STORAGE_CONNECTION_STRING is not set.')
  const blob = BlobServiceClient.fromConnectionString(conn).getContainerClient('media').getBlockBlobClient(`cert-flows/${id}.mp4`)
  return blob.downloadToBuffer()
}

/** Posts the video, then the course link as the first comment from the same account. A failed comment never fails the post. */
export async function publishItem(_s: SeriesState, it: SeriesItem, target: Target, now = new Date()): Promise<{ urn: string; comment?: string; commentError?: string }> {
  const li = await getLinkedInState()
  const author = target === 'member' ? li.memberUrn : li.orgUrn
  const ok = (exp?: string) => !!exp && new Date(exp) > now
  const token = target === 'member' ? (ok(li.expiresAt) ? li.accessToken : '') : (ok(li.orgExpiresAt) ? li.orgAccessToken : '')
  if (!author || !token) throw new Error(`LinkedIn ${target === 'member' ? 'profile' : 'company page'} is not connected or its token expired.`)
  const urn = await publishVideo({ token, author, commentary: formatForLinkedIn(it.text), video: await videoOf(it.id), title: it.topic })
  const text = it.comment || `Full ${it.code} prep course: ${it.url}`
  for (let i = 0; i < 3; i++) {
    try { return { urn, comment: await commentOnPost({ token, actor: author, postUrn: urn, text }) } }
    catch (e: any) { if (i === 2) return { urn, commentError: String(e?.message || e).slice(0, 300) }; await new Promise(r => setTimeout(r, 4000 * (i + 1))) }
  }
  return { urn }
}

function log(s: SeriesState, msg: string) { s.log.push({ at: new Date().toISOString(), msg }) }

/** Runs on every heartbeat: publishes today's video once its time has come, to each target not yet done. */
export async function videoSeriesTick(now = new Date()): Promise<string[]> {
  const s = await loadSeries()
  const out: string[] = []
  s.lastTick = now.toISOString()
  if (!s.enabled) { await saveSeries(s); return ['paused'] }
  const today = localParts(now, TZ).date
  for (const it of effective(s)) {
    if (it.skip || it.date > today) continue
    const due = zonedToUtc(it.date, it.time, TZ)
    if (due > now) continue
    const runs = (s.runs[it.id] ||= {})
    for (const t of TARGETS) {
      const r = runs[t]
      if (r && (r.status === 'done' || r.status === 'missed' || r.attempts >= MAX_ATTEMPTS)) continue
      if ((now.getTime() - due.getTime()) / 60000 > GRACE_MIN) {
        runs[t] = { status: 'missed', at: now.toISOString(), attempts: r?.attempts || 0, error: r?.error }
        log(s, `${it.id} → ${t}: missed its window`)
        await sendAdminAlert('A Claude cert video post was missed', `<p>${it.code} · ${it.title} (${it.date} ${it.time} IST) could not go out to the ${t === 'member' ? 'profile' : 'company page'}${r?.error ? `: ${r.error}` : ''}. Open Admin → Cert video series to post it now.</p>`, `vs-missed-${it.id}-${t}`).catch(() => {})
        continue
      }
      try {
        const p = await publishItem(s, it, t, now)
        runs[t] = { status: 'done', at: new Date().toISOString(), attempts: (r?.attempts || 0) + 1, ...p }
        log(s, `${it.id} → ${t}: posted${p.commentError ? ` (link comment failed: ${p.commentError})` : ' + link comment'}`)
        out.push(`${it.id} ${t} posted`)
      } catch (e: any) {
        runs[t] = { status: 'failed', at: new Date().toISOString(), attempts: (r?.attempts || 0) + 1, error: String(e?.message || e).slice(0, 300) }
        log(s, `${it.id} → ${t}: failed (${runs[t]!.error})`)
        out.push(`${it.id} ${t} failed`)
      }
      await saveSeries(s)
    }
  }
  await saveSeries(s)
  return out.length ? out : ['nothing due']
}
