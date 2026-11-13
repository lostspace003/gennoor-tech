import { tick } from '@/lib/autopilot/engine'
import { liveDeps } from '@/lib/autopilot/live'
import { pipelineTick } from '@/lib/blog-pipeline'
import { liveBlogPipelineDeps } from '@/lib/blog-publish'
import { blogAutoTick } from '@/lib/blog-auto'
import { liveAutoDeps } from '@/lib/blog-auto-live'
import { warmTick } from '@/lib/linkedin-warm'
import { syncLeadGenLeads, adsAppConfigured } from '@/lib/linkedin-ads'
import { jobsTick } from '@/lib/linkedin-queue'
import { blogScheduleTick, socialScheduleTick } from '@/lib/scheduled-publish'
import { videoSeriesTick } from '@/lib/video-series'
import { campaignTick } from '@/lib/promo-campaign'
import { replyTick } from '@/lib/crm/reply-sync'

let running = false

/**
 * One heartbeat drives: the LinkedIn autopilot, posts and blogs you scheduled by hand, the Claude video series, the campaign for the two films,
 * the blog publishing flow (merge, live, share) and the daily blog.
 * Used by the cron route and by the in-app timer, so both do exactly the same work. A run already going is not doubled.
 */
export async function runHeartbeat(): Promise<void> {
  if (running) return
  running = true
  try {
    const run = async (name: string, fn: () => Promise<string[]>) => {
      try { console.log(`[${name}]`, (await fn()).join(' | ')) } catch (e) { console.error(`[${name}] failed`, e) }
    }
    // Replies from leads: a reply moves the lead to Talking and a "stop" stops the emails, whether or not anyone has the CRM open
    await run('crm-replies', () => replyTick())
    await run('autopilot', () => tick(liveDeps()))
    await run('blog-pipeline', () => pipelineTick(liveBlogPipelineDeps()))
    await run('social-scheduled', () => socialScheduleTick())
    await run('video-series', () => videoSeriesTick())
    await run('promo-campaign', () => campaignTick())
    await run('blog-scheduled', () => blogScheduleTick())
    await run('linkedin-warm', () => warmTick())
    await run('linkedin-jobs', () => jobsTick())
    if (adsAppConfigured()) await run('linkedin-leadgen', async () => { const r = await syncLeadGenLeads(); return [`imported ${r.imported} of ${r.scanned}`] })
    await run('blog-auto', () => blogAutoTick(liveAutoDeps()))
  } finally {
    running = false
  }
}
