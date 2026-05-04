import { NextRequest, NextResponse } from 'next/server'
import { getEmailLogs } from '@/lib/azure-storage'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { authorized } = await verifyAdmin(request)
    if (!authorized) return unauthorizedResponse()
    const { days } = await request.json()

    const logs = await getEmailLogs(days || 30)

    const totalSent = logs.filter(l => l.status === 'sent').length
    const totalFailed = logs.filter(l => l.status === 'failed').length
    const uniqueRecipients = new Set(logs.filter(l => l.status === 'sent').map(l => l.to)).size

    return NextResponse.json({
      logs,
      totalSent,
      totalFailed,
      uniqueRecipients,
      total: logs.length,
    })
  } catch (error) {
    console.error('Email logs error:', error)
    return NextResponse.json({ error: 'Failed to fetch email logs' }, { status: 500 })
  }
}
