import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, getLead, touch } from '@/lib/crm/store'
import { aiConfigured, researchLead } from '@/lib/crm/ai'

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

    const research = await researchLead(lead)
    const aiResearch = { ...research, lastUpdated: new Date().toISOString() }

    await mutateLeads((leads) => {
      const l = leads.find((x) => x.id === leadId)
      if (!l) return
      l.aiResearch = aiResearch
      l.techProfile = research.techOrNonTech
      touch(l, { at: new Date().toISOString(), by: user.email, type: 'research', description: 'AI research completed' })
    })

    return NextResponse.json({ research: aiResearch })
  } catch (error) {
    console.error('Error performing AI research:', error)
    return NextResponse.json({ error: 'AI research failed. Check Azure OpenAI configuration.' }, { status: 500 })
  }
}
