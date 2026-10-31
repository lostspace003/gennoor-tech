import { listDrafts, mutateDraft } from '@/lib/social/studio'
import { publishNew } from '@/lib/social/publisher'
import { listBlogDrafts, mutateBlogDraft } from '@/lib/blog-studio'
import { sendAdminAlert, submitBlogPost } from '@/lib/blog-publish'

// Posts and blogs the editor scheduled by hand. The heartbeat calls these every few minutes.
const BUSY_MS = 10 * 60_000
const SOCIAL_GRACE_MS = 30 * 60_000 // a LinkedIn post this much past its time is not sent late
const MAX_TRIES = 3

const esc = (s: string) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)

/** Checks a time chosen in the studio: a real date, at least a minute ahead, at most 90 days out. */
export function parseScheduleAt(v: unknown, now = new Date()): Date {
  const t = typeof v === 'string' ? Date.parse(v) : NaN
  if (!Number.isFinite(t)) throw new Error('That date and time is not valid.')
  if (t < now.getTime() + 60_000) throw new Error('Pick a time at least a minute from now.')
  if (t > now.getTime() + 90 * 86_400_000) throw new Error('Pick a time within the next 90 days.')
  return new Date(t)
}

export async function socialScheduleTick(now = new Date()): Promise<string[]> {
  const out: string[] = []
  for (const d of await listDrafts()) {
    const s = d.scheduled
    if (!s || s.state === 'failed' || Date.parse(s.at) > now.getTime()) continue
    const name = d.topic.slice(0, 80)

    if (s.state === 'publishing') {
      // A run died mid-post. LinkedIn may or may not have it, so never post again without a human check.
      if (now.getTime() - Date.parse(s.busyAt || s.at) > BUSY_MS) {
        await mutateDraft(d.id, x => { if (x.scheduled) { x.scheduled.state = 'failed'; x.scheduled.error = 'The scheduled post was interrupted. Check LinkedIn before posting again.' } })
        await sendAdminAlert('Check LinkedIn for a scheduled post', `<p>Your scheduled post "${esc(name)}" was interrupted and may or may not have gone out. Check LinkedIn, then open the Social studio.</p>`, `sched-busy-${d.id}`)
        out.push(`${d.id}: interrupted, needs a look`)
      }
      continue
    }
    if (now.getTime() - Date.parse(s.at) > SOCIAL_GRACE_MS) {
      await mutateDraft(d.id, x => { if (x.scheduled) { x.scheduled.state = 'failed'; x.scheduled.error = 'The scheduled time passed before it could be posted, so it was not sent late. Pick a new time or post it now.' } })
      await sendAdminAlert('A scheduled LinkedIn post was missed', `<p>"${esc(name)}" was scheduled for ${new Date(s.at).toUTCString()} but could not go out in time. Open the Social studio to reschedule it or post it now.</p>`, `sched-missed-${d.id}`)
      out.push(`${d.id}: missed its window`)
      continue
    }

    await mutateDraft(d.id, x => { if (x.scheduled) { x.scheduled.state = 'publishing'; x.scheduled.busyAt = now.toISOString() } })
    const errors: string[] = []
    for (const t of s.as) {
      const fresh = (await listDrafts()).find(x => x.id === d.id)
      if (!fresh || fresh.published.some(p => p.as === t)) continue
      try { await publishNew(d.id, t, { media: s.media }); out.push(`${d.id}: posted to ${t}`) } catch (e: any) { errors.push(`${t}: ${String(e?.message || e).slice(0, 160)}`) }
    }
    const tries = s.tries + 1
    await mutateDraft(d.id, x => {
      if (!errors.length) { x.scheduled = undefined; return }
      // Only the targets that did not go out are retried.
      x.scheduled = { ...s, as: s.as.filter(t => !x.published.some(p => p.as === t)), tries, state: tries >= MAX_TRIES ? 'failed' : 'pending', error: errors.join(' | '), busyAt: undefined }
    })
    if (errors.length) {
      out.push(`${d.id}: failed (${tries}/${MAX_TRIES}) ${errors.join(' | ')}`)
      if (tries >= MAX_TRIES) await sendAdminAlert('A scheduled LinkedIn post failed', `<p>"${esc(name)}" failed ${tries} times: ${esc(errors.join(' | '))}.</p><p>Open the Social studio to fix it or post it now.</p>`, `sched-fail-${d.id}`)
    }
  }
  return out.length ? out : ['nothing to do']
}

export async function blogScheduleTick(now = new Date()): Promise<string[]> {
  const out: string[] = []
  for (const d of await listBlogDrafts()) {
    const s = d.scheduled
    if (!s || s.failed || d.status !== 'approved' || Date.parse(s.at) > now.getTime()) continue
    try {
      await submitBlogPost(d.id, { autoMerge: s.autoMerge, shareToLinkedIn: s.shareToLinkedIn })
      await mutateBlogDraft(d.id, x => { x.scheduled = undefined })
      out.push(`${d.meta.slug}: published as scheduled`)
    } catch (e: any) {
      const tries = s.tries + 1, msg = String(e?.message || e).slice(0, 200)
      await mutateBlogDraft(d.id, x => { if (x.scheduled) { x.scheduled.tries = tries; x.scheduled.error = msg; x.scheduled.failed = tries >= MAX_TRIES } })
      out.push(`${d.meta.slug}: scheduled publish failed (${tries}/${MAX_TRIES}): ${msg}`)
      if (tries >= MAX_TRIES) await sendAdminAlert('A scheduled blog post could not be published', `<p>"${esc(d.meta.title)}" failed ${tries} times: ${esc(msg)}.</p><p>Open the Blog studio to fix it or publish now.</p>`, `blog-sched-${d.id}`)
    }
  }
  return out.length ? out : ['nothing to do']
}
