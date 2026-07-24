import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { BlobServiceClient } from '@azure/storage-blob'
import * as XLSX from 'xlsx'
import { sql } from '@vercel/postgres'

// Azure Storage configuration
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!
const containerName = 'leads-data'

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

    // Get query parameters
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const priority = searchParams.get('priority') || ''
    const assignedTo = searchParams.get('assignedTo') || ''

    // Build query
    let query = 'SELECT * FROM leads WHERE 1=1'
    const params: any[] = []

    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 2} OR company ILIKE $${params.length + 3})`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (status) {
      query += ` AND status = $${params.length + 1}`
      params.push(status)
    }

    if (priority) {
      query += ` AND priority = $${params.length + 1}`
      params.push(priority)
    }

    if (assignedTo) {
      query += ` AND assigned_to = $${params.length + 1}`
      params.push(assignedTo)
    }

    // Add pagination
    const offset = (page - 1) * limit
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    // Execute query
    const result = await sql.query(query, params)

    // Get total count
    const countQuery = 'SELECT COUNT(*) FROM leads WHERE 1=1' +
      (search ? ` AND (name ILIKE $1 OR email ILIKE $2 OR company ILIKE $3)` : '') +
      (status ? ` AND status = $${search ? 4 : 1}` : '') +
      (priority ? ` AND priority = $${search ? (status ? 5 : 4) : (status ? 2 : 1)}` : '')

    const countParams = search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []
    if (status) countParams.push(status)
    if (priority) countParams.push(priority)

    const countResult = await sql.query(countQuery, countParams)
    const total = countResult.rows[0]?.count || 0

    return NextResponse.json({
      leads: result.rows,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching leads:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    // Insert into database
    const result = await sql`
      INSERT INTO leads (
        name, email, phone, company, designation, industry,
        location, website, linkedin, source, status, priority,
        tags, notes, assigned_to, score, created_by
      ) VALUES (
        ${data.name}, ${data.email}, ${data.phone || null}, ${data.company},
        ${data.designation || null}, ${data.industry || null},
        ${data.location || null}, ${data.website || null}, ${data.linkedin || null},
        ${data.source || 'manual'}, ${data.status || 'new'}, ${data.priority || 'medium'},
        ${JSON.stringify(data.tags || [])}, ${data.notes || null},
        ${data.assignedTo || session.user?.email}, ${data.score || 50},
        ${session.user?.email}
      ) RETURNING *
    `

    // Trigger embedding creation in background
    fetch(process.env.EMBEDDING_SERVICE_URL + '/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texts: [
          `${data.name} ${data.company} ${data.designation || ''} ${data.industry || ''} ${data.notes || ''}`
        ],
        model: 'efficient'
      })
    }).catch(console.error)

    return NextResponse.json(result.rows[0], { status: 201 })

  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
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

    // Build update query dynamically
    const updateFields = []
    const params = []
    let paramIndex = 1

    const allowedFields = [
      'name', 'email', 'phone', 'company', 'designation', 'industry',
      'location', 'website', 'linkedin', 'source', 'status', 'priority',
      'tags', 'notes', 'assigned_to', 'score', 'next_follow_up'
    ]

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateFields.push(`${field} = $${paramIndex}`)
        params.push(field === 'tags' ? JSON.stringify(data[field]) : data[field])
        paramIndex++
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updateFields.push(`updated_at = CURRENT_TIMESTAMP`)
    params.push(data.id)

    const query = `
      UPDATE leads
      SET ${updateFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `

    const result = await sql.query(query, params)

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Update embeddings in background
    const lead = result.rows[0]
    fetch(process.env.EMBEDDING_SERVICE_URL + '/embed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texts: [
          `${lead.name} ${lead.company} ${lead.designation || ''} ${lead.industry || ''} ${lead.notes || ''}`
        ],
        model: 'efficient'
      })
    }).catch(console.error)

    return NextResponse.json(result.rows[0])

  } catch (error) {
    console.error('Error updating lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !AUTHORIZED_EMAILS.includes(session.user?.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 })
    }

    const result = await sql`
      DELETE FROM leads WHERE id = ${id} RETURNING id
    `

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, deleted: id })

  } catch (error) {
    console.error('Error deleting lead:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}