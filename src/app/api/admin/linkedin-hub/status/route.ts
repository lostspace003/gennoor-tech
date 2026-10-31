import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { agentFetch, agentGet, agentServiceConfigured } from '@/lib/social/agent-service'
import { listActivity, usageToday } from '@/lib/linkedin-hub'
import { TOOLS } from '@/lib/linkedin-catalog'

export const dynamic = 'force-dynamic'
export const maxDuration = 90

/** Is the LinkedIn session alive, what is left of today's limits, and the recent activity. */
export async function GET(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const activity = await listActivity()
  const usage = usageToday(activity)
  const caps = TOOLS.filter(t => t.kind === 'action' && t.cap).map(t => ({ tool: t.name, label: t.label, cap: t.cap!, used: usage.byTool[t.name] || 0 }))
  const base = { usage: { reads: usage.reads, readCap: usage.readCap }, caps, activity: activity.slice(-200).reverse() }
  if (!agentServiceConfigured()) return NextResponse.json({ ...base, service: 'not-configured', session: null })
  try {
    // The connector's own tool list says what it can do (the hub hides the rest) and proves it is running.
    const tl = await agentGet('/li/tools', req.signal)
    if (!tl.ok) { const j = await tl.json().catch(() => ({})); return NextResponse.json({ ...base, service: tl.status === 503 ? 'not-configured' : 'down', session: null, detail: j.detail || '' }) }
    const available: string[] = ((await tl.json().catch(() => ({}))).tools || []).map((x: { name: string }) => x.name)
    // get_session_status only inspects the saved login. Not every connector build offers it; without it, whether you
    // are signed in is learned from the first real lookup.
    if (!available.includes('get_session_status')) return NextResponse.json({ ...base, service: 'up', available, session: null, sessionUnknown: true })
    const res = await agentFetch('/li/call', { tool: 'get_session_status', args: {}, fresh: true }, req.signal)
    const j = await res.json().catch(() => ({}))
    return NextResponse.json({ ...base, service: 'up', available, session: res.ok ? j.data ?? null : null, sessionUnknown: !res.ok, ok: j.ok !== false })
  } catch (e: any) {
    return NextResponse.json({ ...base, service: 'down', session: null, detail: e?.message || '' })
  }
}
