import { tick } from '@/lib/autopilot/engine'
import { liveDeps } from '@/lib/autopilot/live'
import { pipelineTick } from '@/lib/blog-pipeline'
import { liveBlogPipelineDeps } from '@/lib/blog-publish'
import { blogAutoTick } from '@/lib/blog-auto'
import { liveAutoDeps } from '@/lib/blog-auto-live'

let running = false

/**
 * One heartbeat drives: the LinkedIn autopilot, the blog publishing flow (merge, live, share) and the daily blog.
 * Used by the cron route and by the in-app timer, so both do exactly the same work. A run already going is not doubled.
 */
export async function runHeartbeat(): Promise<void> {
  if (running) return
  running = true
  try {
    const run = async (name: string, fn: () => Promise<string[]>) => {
      try { console.log(`[${name}]`, (await fn()).join(' | ')) } catch (e) { console.error(`[${name}] failed`, e) }
    }
    await run('autopilot', () => tick(liveDeps()))
    await run('blog-pipeline', () => pipelineTick(liveBlogPipelineDeps()))
    await run('blog-auto', () => blogAutoTick(liveAutoDeps()))
  } finally {
    running = false
  }
}
