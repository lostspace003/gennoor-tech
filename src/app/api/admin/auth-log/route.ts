import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { TableClient, AzureNamedKeyCredential } from '@azure/data-tables'

function getTableClient() {
  const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING || ''
  const match = connStr.match(/AccountName=([^;]+).*AccountKey=([^;]+).*TableEndpoint=([^;]+)/)
  if (!match) throw new Error('Invalid storage connection string')
  const [, accountName, accountKey, endpoint] = match
  const credential = new AzureNamedKeyCredential(accountName, accountKey)
  return new TableClient(endpoint.replace(/\/$/, ''), 'AuthLogs', credential)
}

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = getTableClient()
    const logs: any[] = []
    let count = 0
    const iter = client.listEntities()
    for await (const entity of iter) {
      logs.push(entity)
      if (++count >= 50) break
    }
    logs.sort((a, b) => new Date(b.loginAt as string).getTime() - new Date(a.loginAt as string).getTime())
    return NextResponse.json({ logs })
  } catch {
    return NextResponse.json({ logs: [] })
  }
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const client = getTableClient()
    await client.createTable().catch(() => {})

    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const now = new Date()

    await client.createEntity({
      partitionKey: 'login',
      rowKey: `${now.getTime()}_${session.user.email}`,
      email: session.user.email,
      name: session.user.name || '',
      ip,
      userAgent,
      loginAt: now.toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
