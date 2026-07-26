import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, touch } from '@/lib/crm/store'

// Free-form notes on the activity trail — meeting outcomes, call summaries,
// anything the team wants remembered on the lead.
export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadId, note } = await request.json()
    if (!leadId || !note || typeof note !== 'string') {
      return NextResponse.json({ error: 'leadId and note required' }, { status: 400 })
    }

    const result = await mutateLeads((leads) => {
      const lead = leads.find((l) => l.id === leadId)
      if (!lead) return 'notfound' as const
      if (!canWorkLead(lead, user)) return 'forbidden' as const
      touch(lead, { at: new Date().toISOString(), by: user.email, type: 'note', description: note.slice(0, 1000) })
      return 'ok' as const
    })

    if (result === 'notfound') return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    if (result === 'forbidden') return NextResponse.json({ error: 'Lead is owned by someone else — claim it first.' }, { status: 403 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Add note error:', error)
    return NextResponse.json({ error: 'Failed to add note' }, { status: 500 })
  }
}
