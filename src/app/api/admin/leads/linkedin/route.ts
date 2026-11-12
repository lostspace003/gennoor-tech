import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { getLeads, mutateLeads, touch } from '@/lib/crm/store'
import { agentFetch, agentServiceConfigured } from '@/lib/social/agent-service'
import { toolByName } from '@/lib/linkedin-catalog'
import { limitFor, listActivity, logActivity, summarise, usageToday } from '@/lib/linkedin-hub'
import { resultCards } from '@/lib/linkedin-hub-format'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

// LinkedIn from inside the CRM. Everything goes through the same LinkedIn
// service and the same journal as the LinkedIn hub, so the daily limits that
// protect the account are shared: a search here counts against the hub's
// lookups, and a message here counts against the hub's messages.

/** "https://www.linkedin.com/in/jane-doe/?x=1" -> "jane-doe" */
function usernameOf(url: string): string {
  const m = (url || '').match(/linkedin\.com\/in\/([^/?#\s]+)/i)
  return m ? decodeURIComponent(m[1]) : ''
}

async function callHub(tool: string, args: Record<string, unknown>) {
  const def = toolByName(tool)!
  const blocked = limitFor(tool, await listActivity())
  if (blocked) return { ok: false as const, status: 429, error: blocked }
  const started = Date.now()
  const log = (ok: boolean, cached: boolean, error?: string) =>
    logActivity({ tool, label: def.label, kind: def.kind, area: 'crm', summary: summarise(tool, args), ok, cached, ms: Date.now() - started, ...(error ? { error: error.slice(0, 300) } : {}) })
  try {
    const res = await agentFetch('/li/call', { tool, args })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) {
      await log(false, false, j.detail || `Service returned ${res.status}`)
      return { ok: false as const, status: 502, error: j.detail || `The LinkedIn service returned ${res.status}.` }
    }
    if (j.ok === false) {
      const reason = String(j.error || j.data?.error || 'LinkedIn reported a problem')
      await log(false, !!j.cached, reason)
      return { ok: false as const, status: 502, error: reason }
    }
    await log(true, !!j.cached)
    return { ok: true as const, data: j.data }
  } catch (e: any) {
    await log(false, false, e?.message)
    return { ok: false as const, status: 502, error: e?.message || 'The LinkedIn service is unreachable.' }
  }
}

/** Today's use against the limits, for the counters on screen. */
export async function GET() {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!agentServiceConfigured()) return NextResponse.json({ configured: false })
  const u = usageToday(await listActivity())
  return NextResponse.json({
    configured: true,
    lookups: { used: u.reads, cap: u.readCap },
    connects: { used: u.byTool.connect_with_person || 0, cap: toolByName('connect_with_person')?.cap || 0 },
    messages: { used: u.byTool.send_message || 0, cap: toolByName('send_message')?.cap || 0 },
  })
}

export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!agentServiceConfigured()) return NextResponse.json({ error: 'The LinkedIn service is not set up on this site.' }, { status: 503 })

  try {
    const body = await request.json()

    // ---- Find people, to add as leads
    if (body.action === 'search') {
      const keywords = String(body.keywords || '').trim().slice(0, 200)
      if (!keywords) return NextResponse.json({ error: 'Type a role or keyword to search for' }, { status: 400 })
      const args: Record<string, unknown> = { keywords }
      if (body.location) args.location = String(body.location)
      if (body.company) args.current_company = String(body.company).slice(0, 120)
      const r = await callHub('search_people', args)
      if (!r.ok) return NextResponse.json({ error: r.error, limited: r.status === 429 }, { status: r.status })

      const known = new Set((await getLeads()).map((l) => usernameOf(l.linkedin).toLowerCase()).filter(Boolean))
      const people = (resultCards(r.data) || [])
        .map((c) => c.person)
        .filter((p): p is NonNullable<typeof p> => !!p && !!p.name)
        .map((p) => ({
          name: p.name,
          title: p.title,
          company: p.company,
          location: p.location,
          degree: p.degree,
          linkedin: p.linkedin || '',
          inCrm: !!p.linkedin && known.has(usernameOf(p.linkedin).toLowerCase()),
        }))
      return NextResponse.json({ people })
    }

    // ---- Connect with, or message, one lead. Always one at a time, started by a person.
    if (body.action === 'connect' || body.action === 'message') {
      const text = String(body.text || '').trim()
      const lead = (await getLeads()).find((l) => l.id === body.leadId)
      if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
      if (!canWorkLead(lead, user)) return NextResponse.json({ error: 'This lead is held by someone else' }, { status: 403 })
      const username = usernameOf(lead.linkedin)
      if (!username) return NextResponse.json({ error: 'This lead has no LinkedIn profile link. Add one on the Details tab.' }, { status: 400 })
      if (body.action === 'message' && !text) return NextResponse.json({ error: 'Write the message first' }, { status: 400 })
      if (body.action === 'connect' && text.length > 300) return NextResponse.json({ error: 'A connection note can be at most 300 characters' }, { status: 400 })

      const r = body.action === 'connect'
        ? await callHub('connect_with_person', { linkedin_username: username, ...(text ? { note: text } : {}) })
        : await callHub('send_message', { linkedin_username: username, message: text.slice(0, 3000), confirm_send: true })
      if (!r.ok) return NextResponse.json({ error: r.error, limited: r.status === 429 }, { status: r.status })

      const now = new Date().toISOString()
      await mutateLeads((leads) => {
        const l = leads.find((x) => x.id === lead.id)
        if (!l) return
        l.linkedinTouches = l.linkedinTouches || []
        l.linkedinTouches.unshift({ at: now, by: user.email, kind: body.action, text: text.slice(0, 1000) })
        if (!l.owner) l.owner = user.email
        if (body.action === 'message' && l.status === 'new') l.status = 'contacted'
        touch(l, { at: now, by: user.email, type: 'linkedin', description: body.action === 'connect' ? 'LinkedIn connection request sent' : 'LinkedIn message sent' })
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    console.error('CRM LinkedIn error:', error)
    return NextResponse.json({ error: error?.message || 'LinkedIn action failed' }, { status: 500 })
  }
}
