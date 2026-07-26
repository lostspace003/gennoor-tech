import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { mutateLeads, touch } from '@/lib/crm/store'

type Action = 'claim' | 'release' | 'dump' | 'restore' | 'assign'

// Lead pool workflow: leads with no owner sit in the shared pool. Anyone can
// claim; the claimer works the lead until they release it. Vague/duplicate
// leads get dumped (parked with a reason), restorable later. Managers can
// assign directly and override ownership.
export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leadIds, action, reason, assignee } = (await request.json()) as {
      leadIds: string[]; action: Action; reason?: string; assignee?: string
    }
    if (!Array.isArray(leadIds) || leadIds.length === 0 || !['claim', 'release', 'dump', 'restore', 'assign'].includes(action)) {
      return NextResponse.json({ error: 'leadIds and valid action required' }, { status: 400 })
    }
    if (action === 'assign' && (!user.isManager || !assignee)) {
      return NextResponse.json({ error: 'Only managers can assign, and assignee is required' }, { status: 403 })
    }

    const now = new Date().toISOString()
    const result = await mutateLeads((leads) => {
      let done = 0
      const skipped: string[] = []
      for (const id of leadIds) {
        const lead = leads.find((l) => l.id === id)
        if (!lead) continue
        const isOwner = lead.owner?.toLowerCase() === user.email
        const mayControl = user.isManager || isOwner

        switch (action) {
          case 'claim':
            if (lead.owner && !user.isManager) { skipped.push(`${lead.name} (owned by ${lead.owner.split('@')[0]})`); continue }
            if (lead.dumped) { skipped.push(`${lead.name} (dumped — restore first)`); continue }
            lead.owner = user.email
            touch(lead, { at: now, by: user.email, type: 'status', description: 'Picked up from pool' })
            done++
            break
          case 'release':
            if (!lead.owner) continue
            if (!mayControl) { skipped.push(`${lead.name} (owned by ${lead.owner.split('@')[0]})`); continue }
            touch(lead, { at: now, by: user.email, type: 'status', description: `Released to pool (was ${lead.owner.split('@')[0]})` })
            lead.owner = ''
            done++
            break
          case 'dump':
            if (lead.owner && !mayControl) { skipped.push(`${lead.name} (owned by ${lead.owner.split('@')[0]})`); continue }
            lead.dumped = { at: now, by: user.email, reason: reason || 'Not specified' }
            lead.owner = ''
            lead.processStatus = 'stopped'
            touch(lead, { at: now, by: user.email, type: 'status', description: `Dumped: ${reason || 'no reason given'}` })
            done++
            break
          case 'restore':
            if (!lead.dumped) continue
            lead.dumped = undefined
            lead.processStatus = 'active'
            touch(lead, { at: now, by: user.email, type: 'status', description: 'Restored from dump to pool' })
            done++
            break
          case 'assign':
            lead.owner = assignee!.toLowerCase()
            if (lead.dumped) { lead.dumped = undefined; lead.processStatus = 'active' }
            touch(lead, { at: now, by: user.email, type: 'status', description: `Assigned to ${assignee!.split('@')[0]}` })
            done++
            break
        }
      }
      return { done, skipped }
    })

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('Claim action error:', error)
    return NextResponse.json({ error: 'Action failed' }, { status: 500 })
  }
}
