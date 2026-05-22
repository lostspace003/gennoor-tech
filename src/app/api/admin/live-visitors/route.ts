import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
  if (!connStr) return NextResponse.json({ count: 0, byPage: [] })

  try {
    const client = TableClient.fromConnectionString(connStr, 'PageViews')
    const since = new Date(Date.now() - 5 * 60 * 1000)
    const sinceStr = since.toISOString().slice(0, 10)

    const uniqueIps = new Set<string>()
    const byPage = new Map<string, number>()
    for await (const entity of client.listEntities({
      queryOptions: { filter: `PartitionKey ge '${sinceStr}'` },
    })) {
      const ts = new Date(String(entity.timestamp || ''))
      if (ts < since) continue
      const ip = String(entity.ip || '')
      if (ip) uniqueIps.add(ip)
      const page = String(entity.page || entity.url || '')
      if (page) byPage.set(page, (byPage.get(page) || 0) + 1)
    }

    return NextResponse.json({
      count: uniqueIps.size,
      byPage: [...byPage.entries()]
        .map(([page, hits]) => ({ page, hits }))
        .sort((a, b) => b.hits - a.hits)
        .slice(0, 10),
      asOf: new Date().toISOString(),
    })
  } catch (err: any) {
    if (err?.statusCode === 404 || err?.message?.includes('TableNotFound')) {
      return NextResponse.json({ count: 0, byPage: [], asOf: new Date().toISOString() })
    }
    return NextResponse.json({ error: err?.message || 'Failed' }, { status: 500 })
  }
}
