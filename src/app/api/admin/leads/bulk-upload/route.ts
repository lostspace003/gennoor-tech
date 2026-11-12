import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { upsertLeads } from '@/lib/crm/store'
import { newLead } from '@/lib/crm/types'

export async function POST(request: Request) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { leads } = await request.json()
    if (!Array.isArray(leads) || leads.length === 0) {
      return NextResponse.json({ error: 'No leads provided' }, { status: 400 })
    }
    if (leads.length > 10000) {
      return NextResponse.json({ error: 'Maximum 10,000 leads per upload' }, { status: 400 })
    }

    const prepared = leads
      .filter((l: any) => l && typeof l.name === 'string' && l.name.trim())
      .map((l: any) => newLead({ ...l, source: l.source || 'Excel import' }, user.email))

    const { added, updated } = await upsertLeads(prepared, user.email)

    return NextResponse.json({
      success: true,
      added,
      updated,
      message: `Imported ${added} new leads${updated ? `, refreshed ${updated} existing` : ''}`,
    })
  } catch (error) {
    console.error('Error uploading leads:', error)
    return NextResponse.json({ error: 'Failed to save leads' }, { status: 500 })
  }
}
