import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'

function getTableClient() {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) throw new Error('AZURE_STORAGE_CONNECTION_STRING not configured')
  return TableClient.fromConnectionString(connStr, 'AIReadiness')
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, answers, overallScore, pillars } = await request.json()

    if (!email || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = getTableClient()
    await client.createTable().catch(() => {})

    const now = new Date()
    const partitionKey = now.toISOString().slice(0, 10)
    const rowKey = `${now.getTime()}-${Math.random().toString(36).slice(2, 8)}`

    await client.createEntity({
      partitionKey,
      rowKey,
      name: name || '',
      email,
      overallScore: overallScore || 0,
      pillarScores: JSON.stringify(pillars || []),
      industry: answers.industry || '',
      companySize: answers.size || '',
      aiUsage: answers.usage || '',
      training: answers.training || '',
      challenge: answers.challenge || '',
      priority: answers.priority || '',
      timeline: answers.timeline || '',
      submittedAt: now.toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('AI Readiness save error:', err)
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 })
  }
}
