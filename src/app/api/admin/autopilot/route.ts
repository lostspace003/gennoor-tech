import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { applyAction, tick, type Action } from '@/lib/autopilot/engine'
import { liveDeps, loadState, saveState } from '@/lib/autopilot/live'
import { DEFAULT_CONFIG, type Config, type Kind } from '@/lib/autopilot/types'
import { hhmmToMinutes } from '@/lib/autopilot/time'
import { getLinkedInState } from '@/lib/linkedin'
import { listDrafts } from '@/lib/social/studio'
import { agentServiceConfigured } from '@/lib/social/agent-service'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/
const KINDS: Kind[] = ['post', 'poll', 'motion']
const ACTIONS: Action[] = ['skip', 'manual', 'resume', 'release', 'retry', 'post-now']

const strs = (v: unknown, n: number, max: number) => (Array.isArray(v) ? v : []).map(x => String(x).trim().slice(0, max)).filter(Boolean).slice(0, n)
const slots = (v: unknown) => (Array.isArray(v) ? v : []).map((s: any) => ({ time: String(s?.time || ''), kind: s?.kind as Kind })).filter(s => HHMM.test(s.time) && KINDS.includes(s.kind)).slice(0, 8)
const tzOk = (tz: string) => { try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true } catch { return false } }

export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const [s, li, drafts] = await Promise.all([loadState(), getLinkedInState().catch(() => ({} as any)), listDrafts()])
  // History window: ?from=YYYY-MM-DD&to=YYYY-MM-DD (default: the last 7 days), never more than 120 days at once.
  const ymd = /^\d{4}-\d{2}-\d{2}$/
  const q = req.nextUrl.searchParams
  const to = ymd.test(q.get('to') || '') ? q.get('to')! : '9999-12-31'
  const from = ymd.test(q.get('from') || '') ? q.get('from')! : new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10)
  const days = Object.values(s.days).filter(x => x.date >= from && x.date <= to).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 120)
  const ids = new Set(days.flatMap(d => d.slots.map(x => x.draftId)).filter(Boolean))
  const previews: Record<string, { text: string; hasImage: boolean; motion: boolean; poll?: { question: string; options: string[] } }> = {}
  for (const d of drafts) if (ids.has(d.id)) previews[d.id] = { text: d.text, hasImage: d.hasImage, motion: !!d.motion, poll: d.poll ? { question: d.poll.question, options: d.poll.options } : undefined }
  const days_ = (iso?: string) => (iso ? Math.floor((Date.parse(iso) - Date.now()) / 86_400_000) : null)
  return NextResponse.json({
    config: s.config, days, previews, log: s.log.slice(-40).reverse(), lastTick: s.lastTick, lastTickNote: s.lastTickNote,
    health: { agentService: agentServiceConfigured(), member: { connected: !!li.accessToken, days: days_(li.expiresAt) }, organization: { connected: !!li.orgAccessToken, days: days_(li.orgExpiresAt) } },
  })
}

/** Settings. Everything is validated, so a typo cannot schedule a post at a wrong or unsafe time. */
export async function PATCH(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const s = await loadState()
  const c: Config = { ...s.config }
  if (typeof b.enabled === 'boolean') c.enabled = b.enabled
  if (b.mode === 'auto' || b.mode === 'review') c.mode = b.mode
  if (typeof b.tz === 'string' && tzOk(b.tz)) c.tz = b.tz
  if (b.weekdaySlots) { const v = slots(b.weekdaySlots); if (v.length) c.weekdaySlots = v }
  if (b.weekendSlots) { const v = slots(b.weekendSlots); if (v.length) c.weekendSlots = v }
  if (b.profileMode === 'reshare' || b.profileMode === 'own') c.profileMode = b.profileMode
  if (b.targets) c.targets = { organization: !!b.targets.organization, member: !!b.targets.member }
  const num = (k: keyof Config, lo: number, hi: number) => { if (b[k] !== undefined && Number.isFinite(Number(b[k]))) (c as any)[k] = Math.min(hi, Math.max(lo, Math.round(Number(b[k])))) }
  num('staggerMinutes', 0, 480); num('draftLeadMinutes', 60, 720); num('missedGraceMinutes', 30, 480); num('dailyMax', 1, 6); num('minGapMinutes', 30, 360); num('maxRegens', 0, 3)
  if (typeof b.researchTime === 'string' && HHMM.test(b.researchTime)) c.researchTime = b.researchTime
  if (typeof b.digestTime === 'string' && HHMM.test(b.digestTime)) c.digestTime = b.digestTime
  if (Array.isArray(b.topics)) c.topics = strs(b.topics, 20, 200)
  if (Array.isArray(b.avoid)) c.avoid = strs(b.avoid, 30, 200)
  if (Array.isArray(b.avoidKeywords)) c.avoidKeywords = strs(b.avoidKeywords, 40, 60)
  if (typeof b.weekendTheme === 'string') c.weekendTheme = b.weekendTheme.slice(0, 600)
  if (typeof b.alertEmail === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.alertEmail)) c.alertEmail = b.alertEmail
  if (!c.topics.length) c.topics = DEFAULT_CONFIG.topics
  // Never allow the research time to fall after the first slot: there would be nothing to draft from.
  const firstSlot = Math.min(...[...c.weekdaySlots, ...c.weekendSlots].map(x => hhmmToMinutes(x.time)))
  if (hhmmToMinutes(c.researchTime) >= firstSlot - 60) return NextResponse.json({ error: 'Research must run at least an hour before the earliest slot.' }, { status: 400 })
  s.config = c
  await saveState(s)
  return NextResponse.json({ config: c })
}

/** Slot actions (skip, take over, release a held post, post now) and "run a tick now". */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  try {
    if (b.action === 'tick') return NextResponse.json({ result: await tick(liveDeps()) })
    if (!ACTIONS.includes(b.action)) return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    const s = await loadState()
    const status = applyAction(s, String(b.slotId || ''), b.action, new Date())
    await saveState(s)
    return NextResponse.json({ status })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed.' }, { status: 400 })
  }
}
