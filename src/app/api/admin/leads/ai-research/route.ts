import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, getLead, touch } from '@/lib/crm/store'
import { aiConfigured, researchLead, researchLeadWeb, researchLeadDeep } from '@/lib/crm/ai'
import { foundryConfigured } from '@/lib/crm/foundry'

export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!aiConfigured()) {
    return NextResponse.json(
      { error: 'AI research is not configured. Set AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_KEY.' },
      { status: 503 }
    )
  }

  try {
    const { leadId } = await request.json()
    if (!leadId) return NextResponse.json({ error: 'leadId required' }, { status: 400 })

    const lead = await getLead(leadId)
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    if (!canWorkLead(lead, user)) {
      return NextResponse.json({ error: `Lead is owned by ${lead.owner.split('@')[0]} — claim it or ask them/a manager.` }, { status: 403 })
    }

    // Three-pass research (company → person → offering fit), web-grounded on
    // the company pass when Foundry is up. Each pass degrades on its own; the
    // old single-shot calls remain the last resort so a lead is never left
    // without research because one pass misbehaved.
    let research: Awaited<ReturnType<typeof researchLeadDeep>> | undefined
    try {
      research = await researchLeadDeep(lead, { web: foundryConfigured() })
    } catch (error: any) {
      console.error('Deep research failed, falling back to single-pass:', error?.message)
      let webGrounded = false
      let basic
      if (foundryConfigured()) {
        try {
          basic = await researchLeadWeb(lead)
          webGrounded = true
        } catch (webError: any) {
          console.error('Web research failed, falling back to data-only:', webError?.message)
        }
      }
      if (!basic) basic = await researchLead(lead)
      research = { ...basic, webGrounded, passes: ['single-pass fallback'] }
    }

    const aiResearch = { ...research, lastUpdated: new Date().toISOString() }
    const matched = aiResearch.offeringMatches?.length
      ? ` — ${aiResearch.offeringMatches.length} offering(s) matched, leading with ${aiResearch.offeringMatches[0].title}`
      : ''

    await mutateLeads((leads) => {
      const l = leads.find((x) => x.id === leadId)
      if (!l) return
      l.aiResearch = aiResearch
      l.techProfile = aiResearch.techOrNonTech
      touch(l, {
        at: new Date().toISOString(),
        by: user.email,
        type: 'research',
        description: `AI research completed (${aiResearch.passes?.join(', ') || 'single pass'})${matched}`,
        stage: l.stage,
      })
    })

    return NextResponse.json({ research: aiResearch })
  } catch (error) {
    console.error('Error performing AI research:', error)
    return NextResponse.json({ error: 'AI research failed. Check Azure OpenAI configuration.' }, { status: 500 })
  }
}
