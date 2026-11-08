import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getLinkedInState } from '@/lib/linkedin'
import { effective, items, loadSeries, publishItem, saveSeries, type Target } from '@/lib/video-series'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const YMD = /^\d{4}-\d{2}-\d{2}$/

export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const [s, li] = await Promise.all([loadSeries(), getLinkedInState().catch(() => ({} as any))])
  const days = (iso?: string) => (iso ? Math.floor((Date.parse(iso) - Date.now()) / 86_400_000) : null)
  return NextResponse.json({
    enabled: s.enabled, items: effective(s), runs: s.runs, log: s.log.slice(-40).reverse(), lastTick: s.lastTick,
    health: { member: { connected: !!li.accessToken, days: days(li.expiresAt) }, organization: { connected: !!li.orgAccessToken, days: days(li.orgExpiresAt) } },
  })
}

export async function PATCH(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const s = await loadSeries()
  if (typeof b.enabled === 'boolean') s.enabled = b.enabled
  await saveSeries(s)
  return NextResponse.json({ ok: true })
}

/** { id, action: 'skip' | 'unskip' | 'text' | 'date' | 'post-now', text?, date?, target? } */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const s = await loadSeries()
  const it = effective(s).find(x => x.id === b.id)
  if (!it) return NextResponse.json({ error: 'Unknown video.' }, { status: 404 })
  const o = (s.overrides[it.id] ||= {})
  if (b.action === 'skip') o.skip = true
  else if (b.action === 'unskip') o.skip = false
  else if (b.action === 'text') { const t = String(b.text || '').trim(); if (!t) return NextResponse.json({ error: 'Text is empty.' }, { status: 400 }); o.text = t === items().find(x => x.id === it.id)?.text ? undefined : t.slice(0, 2900) }
  else if (b.action === 'date') { if (!YMD.test(String(b.date))) return NextResponse.json({ error: 'Bad date.' }, { status: 400 }); o.date = b.date }
  else if (b.action === 'post-now') {
    const targets: Target[] = b.target === 'member' || b.target === 'organization' ? [b.target] : ['organization', 'member']
    const runs = (s.runs[it.id] ||= {})
    const errors: string[] = []
    for (const t of targets) {
      if (runs[t]?.status === 'done') continue
      try { runs[t] = { status: 'done', at: new Date().toISOString(), attempts: (runs[t]?.attempts || 0) + 1, ...(await publishItem(s, it, t)) } }
      catch (e: any) { const m = String(e?.message || e).slice(0, 300); runs[t] = { status: 'failed', at: new Date().toISOString(), attempts: (runs[t]?.attempts || 0) + 1, error: m }; errors.push(`${t}: ${m}`) }
    }
    s.log.push({ at: new Date().toISOString(), msg: `${it.id}: posted now by admin${errors.length ? ` (errors: ${errors.join('; ')})` : ''}` })
    await saveSeries(s)
    return NextResponse.json({ ok: !errors.length, errors })
  } else return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
  await saveSeries(s)
  return NextResponse.json({ ok: true })
}
