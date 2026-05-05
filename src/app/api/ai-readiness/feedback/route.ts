import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'

function getTableClient() {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return TableClient.fromConnectionString(connStr, 'AIReadinessFeedback')
}

export async function POST(request: NextRequest) {
  try {
    const { email, name, rating, comment, reportType, action, orgInterest } = await request.json()

    if (!email || !rating) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = getTableClient()
    await client.createTable().catch(() => {})

    const now = new Date()
    await client.createEntity({
      partitionKey: now.toISOString().slice(0, 10),
      rowKey: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      email,
      name: name || '',
      rating,
      comment: comment || '',
      reportType: reportType || '',
      action: action || '',
      orgInterest: orgInterest || '',
      submittedAt: now.toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Feedback save error:', err)
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
  }
}
