import { after, NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { blogAutoTick, DEFAULT_BLOG_AUTO } from '@/lib/blog-auto'
import { liveAutoDeps, loadAutoState, saveAutoState } from '@/lib/blog-auto-live'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/
const tzOk = (tz: string) => { try { new Intl.DateTimeFormat('en', { timeZone: tz }); return true } catch { return false } }

/** Settings and today's progress for the daily blog autopilot. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const s = await loadAutoState()
  const days = Object.values(s.days).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7)
  return NextResponse.json({ config: s.config, days, lastTick: s.lastTick, log: s.log.slice(-15).reverse() })
}

export async function PATCH(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const s = await loadAutoState()
  const c = { ...s.config }
  if (typeof b.enabled === 'boolean') c.enabled = b.enabled
  if (typeof b.autoMerge === 'boolean') c.autoMerge = b.autoMerge
  if (typeof b.shareToLinkedIn === 'boolean') c.shareToLinkedIn = b.shareToLinkedIn
  if (typeof b.time === 'string' && HHMM.test(b.time)) c.time = b.time
  if (typeof b.tz === 'string' && tzOk(b.tz)) c.tz = b.tz
  if (Number.isFinite(Number(b.perDay))) c.perDay = Math.min(3, Math.max(1, Math.round(Number(b.perDay))))
  if (Number.isFinite(Number(b.maxRevisions))) c.maxRevisions = Math.min(3, Math.max(0, Math.round(Number(b.maxRevisions))))
  s.config = { ...DEFAULT_BLOG_AUTO, ...c }
  await saveAutoState(s)
  return NextResponse.json({ config: s.config })
}

/** "Write today's article now": runs in the background (it takes several minutes); the page shows the progress. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  after(async () => { try { console.log('[blog-auto]', (await blogAutoTick(liveAutoDeps(), { force: true })).join(' | ')) } catch (e) { console.error('[blog-auto] failed', e) } })
  return NextResponse.json({ accepted: true })
}
