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
    // Several ticked places: one lookup per place (the connector takes one at a time), joined under a heading each.
    const places = (def.name === 'search_people' || def.name === 'search_jobs') && typeof args.location === 'string' ? args.location.split(',').map(x => x.trim()).filter(Boolean).slice(0, 5) : []
    const label = (v: string) => toolByName(def.name)!.fields.find(f => f.name === 'location')?.options?.find(o => o.v === v)?.l.replace(/\s*\(.*\)$/, '') || v
    const calls = places.length > 1 ? places : [null]
    const outs: { place: string | null; j: any; ok: boolean; status: number }[] = []
    for (const place of calls) {
      const res = await agentFetch('/li/call', { tool: def.name, args: place ? { ...args, location: place } : args, fresh: b.fresh === true }, req.signal)
      outs.push({ place, j: await res.json().catch(() => ({})), ok: res.ok, status: res.status })
    }
    const bad = outs.find(o => !o.ok)
    if (bad) { await log(false, false, bad.j.detail || `Service returned ${bad.status}`); return NextResponse.json({ error: bad.j.detail || `The LinkedIn service returned ${bad.status}.` }, { status: 502 }) }
    let j = outs[0].j
    if (outs.length > 1) {
      const text = (o: typeof outs[number]) => (typeof o.j.data === 'string' ? o.j.data : o.j.data?.text ? String(o.j.data.text) : o.j.ok === false ? String(o.j.error || o.j.data?.error || 'LinkedIn reported a problem') : JSON.stringify(o.j.data))
      j = { ...outs[0].j, ok: outs.some(o => o.j.ok !== false), cached: outs.every(o => o.j.cached), data: { text: outs.map(o => `## ${label(o.place!)}\n${text(o)}`).join('\n\n') } }
    }
    await log(j.ok !== false, !!j.cached, j.ok === false ? 'LinkedIn reported an error' : undefined)
    return NextResponse.json(j)
  } catch (e: any) {
    await log(false, false, e?.message)
    return NextResponse.json({ error: e?.message || 'The LinkedIn service is unreachable.' }, { status: 502 })
  }
}
