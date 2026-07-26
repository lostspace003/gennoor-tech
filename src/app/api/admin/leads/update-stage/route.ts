import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, touch } from '@/lib/crm/store'
import { PIPELINE_STAGES } from '@/lib/crm/types'

export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadId, stage } = await request.json()
    if (!leadId || !PIPELINE_STAGES.includes(stage)) {
      return NextResponse.json({ error: 'leadId and valid stage required' }, { status: 400 })
    }

    const found = await mutateLeads((leads) => {
      const lead = leads.find((l) => l.id === leadId)
      if (!lead) return false
      if (!canWorkLead(lead, user)) return 'forbidden' as const
      lead.stage = stage
      touch(lead, {
        at: new Date().toISOString(),
        by: user.email,
        type: 'stage',
        description: `Moved to stage: ${stage}`,
      })
      return true
    })

    if (found === 'forbidden') return NextResponse.json({ error: 'Lead is owned by someone else — claim it first.' }, { status: 403 })
    if (!found) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating stage:', error)
    return NextResponse.json({ error: 'Failed to update stage' }, { status: 500 })
  }
}
