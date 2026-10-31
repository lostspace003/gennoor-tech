import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { agentFetch } from '@/lib/social/agent-service'
import { toolByName } from '@/lib/linkedin-catalog'
import { limitFor, listActivity, logActivity, summarise } from '@/lib/linkedin-hub'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * One LinkedIn lookup or action through the MCP server. Enforces: known tools only, explicit confirmation for
 * anything that changes your account, and daily limits. Every call is journalled.
 */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const def = toolByName(String(b.tool || ''))
  if (!def) return NextResponse.json({ error: 'Unknown LinkedIn tool.' }, { status: 400 })
  if (def.kind === 'action' && b.confirm !== true) return NextResponse.json({ error: 'This changes your LinkedIn account. Confirm it first.' }, { status: 400 })

  // Keep only the declared fields; drop empties so optional arguments stay unset.
  const args: Record<string, unknown> = {}
  for (const f of def.fields) {
    const v = (b.args || {})[f.name]
    if (v === undefined || v === null || v === '') { if (f.required) return NextResponse.json({ error: `${f.label} is required.` }, { status: 400 }); continue }
    args[f.name] = f.type === 'number' ? Number(v) : f.type === 'bool' ? v === true || v === 'true' : String(v).slice(0, 3000)
  }
  if (def.name === 'send_message') args.confirm_send = true
  if (def.name === 'get_conversation' && !args.thread_id && !args.linkedin_username) return NextResponse.json({ error: 'Give a thread ID or a username.' }, { status: 400 })

  const history = await listActivity()
  const blocked = limitFor(def.name, history)
  if (blocked) return NextResponse.json({ error: blocked, limited: true }, { status: 429 })

  const started = Date.now()
  const log = (ok: boolean, cached: boolean, error?: string) => logActivity({ tool: def.name, label: def.label, kind: def.kind, area: String(b.area || 'hub').slice(0, 20), summary: summarise(def.name, args), ok, cached, ms: Date.now() - started, ...(error ? { error: error.slice(0, 300) } : {}) })
  try {
    const res = await agentFetch('/li/call', { tool: def.name, args, fresh: b.fresh === true }, req.signal)
    const j = await res.json().catch(() => ({}))
    if (!res.ok) { await log(false, false, j.detail || `Service returned ${res.status}`); return NextResponse.json({ error: j.detail || `The LinkedIn service returned ${res.status}.` }, { status: 502 }) }
    await log(j.ok !== false, !!j.cached, j.ok === false ? 'LinkedIn reported an error' : undefined)
    return NextResponse.json(j)
  } catch (e: any) {
    await log(false, false, e?.message)
    return NextResponse.json({ error: e?.message || 'The LinkedIn service is unreachable.' }, { status: 502 })
  }
}
