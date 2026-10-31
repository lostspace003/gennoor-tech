import { after, NextRequest, NextResponse } from 'next/server'
import { tick } from '@/lib/autopilot/engine'
import { liveDeps } from '@/lib/autopilot/live'
import { pipelineTick } from '@/lib/blog-pipeline'
import { liveBlogPipelineDeps } from '@/lib/blog-publish'
import { blogAutoTick } from '@/lib/blog-auto'
import { liveAutoDeps } from '@/lib/blog-auto-live'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * Called every 15 minutes by the GitHub Actions schedule (x-cron-secret, like the CRM digest). It answers at once and
 * does the work after the response, so Azure's 4-minute request limit can never cut a long drafting run short.
 * One heartbeat drives: the LinkedIn autopilot, the blog publishing flow (merge, live, share) and the daily blog.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRM_CRON_SECRET
  if (!secret || req.headers.get('x-cron-secret') !== secret) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  after(async () => {
    const run = async (name: string, fn: () => Promise<string[]>) => {
      try { console.log(`[${name}]`, (await fn()).join(' | ')) } catch (e) { console.error(`[${name}] failed`, e) }
    }
    await run('autopilot', () => tick(liveDeps()))
    await run('blog-pipeline', () => pipelineTick(liveBlogPipelineDeps()))
    await run('blog-auto', () => blogAutoTick(liveAutoDeps()))
  })
  return NextResponse.json({ accepted: true })
}
