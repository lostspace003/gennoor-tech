import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { getGraphClient, graphConfigured } from '@/lib/crm/graph'
import { MAILBOXES } from '@/lib/mailboxes'

export const dynamic = 'force-dynamic'

// Read-only: asks Microsoft 365 whether each mailbox exists and how full its inbox is.
export async function GET(request: NextRequest) {
  const { authorized } = await verifyAdmin(request)
  if (!authorized) return unauthorizedResponse()

  if (!graphConfigured()) {
    return NextResponse.json({ connected: false, mailboxes: MAILBOXES.map(m => ({ ...m, status: 'unknown' })) })
  }
  const client = await getGraphClient()
  const mailboxes = await Promise.all(MAILBOXES.map(async m => {
    try {
      const f = await client.api(`/users/${m.address}/mailFolders/inbox`).select('totalItemCount,unreadItemCount').get()
      return { ...m, status: 'ok', total: f.totalItemCount as number, unread: f.unreadItemCount as number }
    } catch (e: unknown) {
      const code = (e as { code?: string; statusCode?: number })
      return { ...m, status: code.statusCode === 404 ? 'missing' : 'error' }
    }
  }))
  return NextResponse.json({ connected: true, mailboxes })
}
