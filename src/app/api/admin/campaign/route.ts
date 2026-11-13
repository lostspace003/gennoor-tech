import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getLinkedInState } from '@/lib/linkedin'
import { localParts } from '@/lib/autopilot/time'
import { CYCLE_DAYS, START, TZ, cycleOf, cycleStart, effective, fill, linkOf, loadCampaign, postFromProfile, repostFromPage, saveCampaign } from '@/lib/promo-campaign'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/** The campaign as the admin centre shows it: this cycle's posts, what has gone out, and whether LinkedIn is connected. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const [s, li] = await Promise.all([loadCampaign(), getLinkedInState().catch(() => null)])
  const now = new Date()
  const today = localParts(now, TZ).date
  const cycle = cycleOf(today)
  const days = (iso?: string) => (iso ? Math.floor((Date.parse(iso) - Date.now()) / 86_400_000) : null)
  return NextResponse.json({
    enabled: s.enabled,
    today,
    start: START,
    cycle,
    cycleStart: cycleStart(cycle),
    nextCycleStart: cycleStart(cycle + 1),
    cycleDays: CYCLE_DAYS,
    // the words as they would go out today, with the dates written in, beside the words as stored
    items: effective(s, cycle).map((p) => ({ ...p, preview: fill(p.text, now), sharePreview: fill(p.share, now), link: linkOf(p) })),
    runs: s.runs,
    log: s.log.slice(-40).reverse(),
    lastTick: s.lastTick,
    health: {
      member: { connected: !!li?.accessToken, days: days(li?.expiresAt) },
      organization: { connected: !!li?.orgAccessToken, days: days(li?.orgExpiresAt) },
    },
  })
}

/** { enabled } : the whole campaign on or paused. */
export async function PATCH(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const s = await loadCampaign()
  if (typeof b.enabled === 'boolean') {
    s.enabled = b.enabled
    s.log.push({ at: new Date().toISOString(), msg: b.enabled ? 'turned on in the admin centre' : 'paused in the admin centre' })
  }
  await saveCampaign(s)
  return NextResponse.json({ ok: true })
}

/** { key, action: 'skip' | 'unskip' | 'text' | 'reset' | 'post-now', text?, share? } */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const s = await loadCampaign()
  const cycle = Number(String(b.key || '').split(':')[0])
  const p = Number.isInteger(cycle) && cycle >= 0 ? effective(s, cycle).find((x) => x.key === b.key) : undefined
  if (!p) return NextResponse.json({ error: 'That post is not in the campaign.' }, { status: 404 })

  if (b.action === 'skip') s.skipped[p.key] = true
  else if (b.action === 'unskip') delete s.skipped[p.key]
  else if (b.action === 'text') {
    const text = String(b.text ?? '').trim()
    const share = String(b.share ?? '').trim()
    if (!text || !share) return NextResponse.json({ error: 'The post and the company page line cannot be empty.' }, { status: 400 })
    // Only what differs from the written post is kept, so a post put back to its own words is no longer "edited"
    const changed: { text?: string; share?: string } = {}
    if (text !== p.original.text) changed.text = text.slice(0, 2900)
    if (share !== p.original.share) changed.share = share.slice(0, 600)
    if (changed.text || changed.share) s.texts[p.id] = changed
    else delete s.texts[p.id]
  } else if (b.action === 'reset') delete s.texts[p.id]
  else if (b.action === 'post-now') {
    const runs = (s.runs[p.key] ||= {})
    const errors: string[] = []
    const fail = (e: unknown) => String((e as Error)?.message || e).slice(0, 300)
    if (runs.member?.status !== 'done') {
      try {
        runs.member = { status: 'done', at: new Date().toISOString(), attempts: (runs.member?.attempts || 0) + 1, ...(await postFromProfile(p)) }
      } catch (e) {
        runs.member = { status: 'failed', at: new Date().toISOString(), attempts: (runs.member?.attempts || 0) + 1, error: fail(e) }
        errors.push(`profile: ${runs.member.error}`)
      }
    }
    if (runs.member?.status === 'done' && runs.member.urn && runs.organization?.status !== 'done') {
      try {
        runs.organization = { status: 'done', at: new Date().toISOString(), attempts: (runs.organization?.attempts || 0) + 1, ...(await repostFromPage(p, runs.member.urn)) }
      } catch (e) {
        runs.organization = { status: 'failed', at: new Date().toISOString(), attempts: (runs.organization?.attempts || 0) + 1, error: fail(e) }
        errors.push(`company page: ${runs.organization.error}`)
      }
    }
    s.log.push({ at: new Date().toISOString(), msg: `${p.id}: posted now from the admin centre${errors.length ? ` (${errors.join('; ')})` : ''}` })
    await saveCampaign(s)
    return NextResponse.json({ ok: !errors.length, errors })
  } else return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })

  await saveCampaign(s)
  return NextResponse.json({ ok: true })
}
