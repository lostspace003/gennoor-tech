import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { authorized } = await verifyAdmin(request)
    if (!authorized) return unauthorizedResponse()

    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connStr) return NextResponse.json([])

    try {
      const client = TableClient.fromConnectionString(connStr, 'CareerSessions')
      const sessions: Record<string, any>[] = []
      for await (const entity of client.listEntities()) {
        sessions.push({
          rowKey: entity.rowKey,
          agentId: entity.partitionKey,
          agentName: entity.agentName || '',
          status: entity.status || '',
          resumeFileName: entity.resumeFileName || '',
          resumeBlobPath: entity.resumeBlobPath || '',
          contactInfo: entity.contactInfo || '',
          updatedAt: entity.updatedAt || entity.timestamp || '',
        })
      }
      return NextResponse.json(sessions)
    } catch (err: any) {
      if (err?.statusCode === 404 || err?.message?.includes('TableNotFound')) {
        return NextResponse.json([])
      }
      throw err
    }
  } catch (error) {
    console.error('Sessions error:', error)
    return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 })
  }
}
