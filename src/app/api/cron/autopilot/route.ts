import { after, NextRequest, NextResponse } from 'next/server'
import { runHeartbeat } from '@/lib/heartbeat'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * Called every 15 minutes by the GitHub Actions schedule (x-cron-secret, like the CRM digest). It answers at once and
 * does the work after the response, so Azure's 4-minute request limit can never cut a long drafting run short.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRM_CRON_SECRET
  if (!secret || req.headers.get('x-cron-secret') !== secret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  after(runHeartbeat)
  return NextResponse.json({ accepted: true })
}
