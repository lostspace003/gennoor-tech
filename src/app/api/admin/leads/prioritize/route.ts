import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { getLeads, mutateLeads, touch } from '@/lib/crm/store'
import { aiConfigured, chatCompletion } from '@/lib/crm/ai'

// POST {leadIds[]} → managers only. AI assigns High/Medium/Low to each lead
// from its profile (designation, company, sector, notes, research). The result
// lands in the same free-text `priority` field uploaders fill by hand.
// EMPTY-ONLY by design: a priority someone already set is never overwritten.
export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Managers only' }, { status: 403 })
  if (!aiConfigured()) return NextResponse.json({ error: 'AI not configured' }, { status: 503 })

  try {
    const { leadIds } = await req.json()
    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json({ error: 'leadIds required' }, { status: 400 })
    }
    const ids = new Set(leadIds.slice(0, 60).map(String))

    // AI pass happens OUTSIDE mutateLeads (the mutator must stay synchronous).
    // Only leads with NO priority are scored — manual verdicts always win.
    const all = await getLeads()
    const targets = all.filter((l) => ids.has(l.id) && !(l.priority || '').trim())
    if (targets.length === 0) return NextResponse.json({ updated: 0, priorities: {}, note: 'All selected leads already have a priority.' })

    const digest = targets
      .map((l) => `${l.id} | ${l.name} | ${l.designation || '-'} @ ${l.company || '-'} | sector: ${l.sector || '-'} | country: ${l.country || '-'} | value: ${l.value || 0} | stage: ${l.stage} | notes: ${(l.notes || '').slice(0, 120)} | research: ${(l.aiResearch?.summary || '').slice(0, 150)}`)
      .join('\n')

    const reply = await chatCompletion(
      [
        {
          role: 'system',
          content: `You prioritize B2B sales leads for Gennoor Tech (AI training for organizations and automation).
High = decision-maker at a sizeable org, clear budget/AI need, strategic sector. Medium = promising but unclear authority or need. Low = weak fit, junior role, or no signal.
Reply with ONLY a JSON object mapping each lead id to "High", "Medium" or "Low". No other text.`,
        },
        { role: 'user', content: digest },
      ],
      { maxTokens: 1200 }
    )
    const parsed: Record<string, string> = JSON.parse(reply.replace(/^```(json)?|```$/gm, '').trim())

    const priorities: Record<string, string> = {}
    const updated = await mutateLeads((leads) => {
      let count = 0
      for (const lead of leads) {
        const p = String(parsed[lead.id] || '').trim()
        // Re-check emptiness at write time too (someone may have set it meanwhile)
        if (!ids.has(lead.id) || (lead.priority || '').trim() || !/^(High|Medium|Low)$/i.test(p)) continue
        lead.priority = p[0].toUpperCase() + p.slice(1).toLowerCase()
        priorities[lead.id] = lead.priority
        touch(lead, { at: new Date().toISOString(), by: user.email, type: 'updated', description: `AI set priority: ${lead.priority}` })
        count++
      }
      return count
    })

    return NextResponse.json({ updated, priorities })
  } catch (error) {
    console.error('Prioritize error:', error)
    return NextResponse.json({ error: 'AI prioritization failed' }, { status: 500 })
  }
}
