import { sendLeadConversion } from '@/lib/linkedin-ads'
import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser, canWorkLead } from '@/lib/crm/access'
import { getLeads, mutateLeads, touch } from '@/lib/crm/store'
import { newLead, Lead, LEAD_STEPS, STEP_LABELS } from '@/lib/crm/types'
import { syncAutoLeadsIfDue } from '@/lib/crm/auto-leads'
import { syncCustomersIfDue } from '@/lib/crm/customers-live'

export async function GET() {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    // People who bought or finished a course, or sent a form, are added as leads first
    await syncAutoLeadsIfDue()
    // Then those who have paid are marked: the promotional emails stop for them
    await syncCustomersIfDue()
    const leads = await getLeads()
    return NextResponse.json({ leads, total: leads.length })
  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    if (!data.name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }
    const lead = newLead(data, user.email)
    await mutateLeads((leads) => leads.unshift(lead))
    return NextResponse.json({ lead }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}

// Editable fields; system fields (activities, emailHistory, ...) are managed server-side.
const EDITABLE: Array<keyof Lead> = [
  'name', 'email', 'phone', 'company', 'designation', 'linkedin', 'website',
  'status', 'country', 'city', 'owner', 'source', 'notes', 'altEmails', 'greeting',
]

export async function PUT(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const data = await req.json()
    if (!data.id) return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })

    let previousStatus = ''
    const updated = await mutateLeads((leads) => {
      const lead = leads.find((l) => l.id === data.id)
      if (!lead) return null
      if (!canWorkLead(lead, user)) return 'forbidden' as const
      previousStatus = lead.status
      for (const field of EDITABLE) {
        if (field in data) (lead as any)[field] = data[field]
      }
      if (!LEAD_STEPS.includes(lead.status)) lead.status = previousStatus as Lead['status']
      const moved = lead.status !== previousStatus
      touch(lead, {
        at: new Date().toISOString(),
        by: user.email,
        type: moved ? 'status' : 'updated',
        description: moved ? `Moved to ${STEP_LABELS[lead.status]}` : 'Details updated',
      })
      return lead
    })

    if (updated === 'forbidden') return NextResponse.json({ error: 'This lead is held by someone else.' }, { status: 403 })
    if (!updated) return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    // Tell LinkedIn about outcomes it can learn from (deduped on its side by lead id + kind)
    if (updated.status !== previousStatus && (updated.status === 'qualified' || updated.status === 'won')) {
      await sendLeadConversion(updated, updated.status)
    }
    return NextResponse.json({ success: true, lead: updated })
  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Only managers can delete leads' }, { status: 403 })

  try {
    const { searchParams } = new URL(req.url)
    const ids = searchParams.getAll('id')
    if (ids.length === 0) return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })

    const removed = await mutateLeads((leads) => {
      const before = leads.length
      for (const id of ids) {
        const idx = leads.findIndex((l) => l.id === id)
        if (idx !== -1) leads.splice(idx, 1)
      }
      return before - leads.length
    })

    return NextResponse.json({ success: true, deleted: removed })
  } catch (error) {
    console.error('Error deleting leads:', error)
    return NextResponse.json({ error: 'Failed to delete leads' }, { status: 500 })
  }
}
