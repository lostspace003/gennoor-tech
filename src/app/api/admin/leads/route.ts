import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { dbOperations } from '@/lib/azure/database'

// Authorized emails
const AUTHORIZED_EMAILS = [
  'admin@gennoor.com',
  'contact@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'jalalkhan@gennoor.com'
]

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !AUTHORIZED_EMAILS.includes(session.user?.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all leads from Azure SQL Database
    const leads = await dbOperations.getLeads()

    return NextResponse.json({
      leads: leads.recordset || [],
      total: leads.recordset?.length || 0
    })

  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !AUTHORIZED_EMAILS.includes(session.user?.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    // Validate required fields
    if (!data.name || !data.email || !data.company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Generate unique ID
    const leadId = `LEAD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const lead = {
      id: leadId,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      company: data.company,
      designation: data.designation || '',
      linkedin: data.linkedin || '',
      website: data.website || '',
      status: data.status || 'new',
      process_status: data.processStatus || 'active',
      stage: data.stage || 'diagnose',
      value: data.value || 0,
      score: data.score || 50,
      owner: data.owner || session.user?.email,
      source: data.source || 'manual',
      tags: JSON.stringify(data.tags || []),
      notes: data.notes || ''
    }

    await dbOperations.createLead(lead)

    return NextResponse.json(lead, { status: 201 })

  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !AUTHORIZED_EMAILS.includes(session.user?.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()

    if (!data.id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })
    }

    // Update lead in Azure SQL Database
    await dbOperations.updateLead(data.id, data)

    return NextResponse.json({ success: true, lead: data })

  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication - only admin can delete
    const session = await auth()
    if (!session || session.user?.email !== 'admin@gennoor.com') {
      return NextResponse.json({ error: 'Unauthorized - Admin only' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })
    }

    await dbOperations.deleteLead(id)

    return NextResponse.json({ success: true, deleted: id })

  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}