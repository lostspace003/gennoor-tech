import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'

export async function POST(request: NextRequest) {
  try {
    const { email, name, reportType, action } = await request.json()

    if (!email || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connStr) {
      return NextResponse.json({ success: true })
    }

    const client = TableClient.fromConnectionString(connStr, 'AIReadinessReports')
    await client.createTable().catch(() => {})

    const now = new Date()
    await client.createEntity({
      partitionKey: now.toISOString().slice(0, 10),
      rowKey: `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
      email,
      name: name || '',
      reportType: reportType || '',
      action,
      generatedAt: now.toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('Track event error:', err)
    return NextResponse.json({ success: true })
  }
}
