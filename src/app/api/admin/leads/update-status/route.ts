import { NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { mutateLeads, touch } from '@/lib/crm/store'

// Start / pause / stop the outreach process for one or more leads.
export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadIds, processStatus } = await request.json()
    if (!Array.isArray(leadIds) || !['active', 'paused', 'stopped'].includes(processStatus)) {
      return NextResponse.json({ error: 'leadIds and valid processStatus required' }, { status: 400 })
    }

    const count = await mutateLeads((leads) => {
      let n = 0
      for (const lead of leads) {
        if (leadIds.includes(lead.id)) {
          if (!canWorkLead(lead, user)) continue
          lead.processStatus = processStatus
          touch(lead, {
            at: new Date().toISOString(),
            by: user.email,
            type: 'status',
            description: `Process ${processStatus === 'active' ? 'started' : processStatus}`,
          })
          n++
        }
      }
      return n
    })

    return NextResponse.json({ success: true, updated: count })
  } catch (error) {
    console.error('Error updating process status:', error)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }
}
