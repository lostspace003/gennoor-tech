import type { BlogDraft } from '@/lib/blog-studio'

// What happens after a blog post is approved, the same for posts you write and posts the daily autopilot writes:
//   pull request -> merged -> live on the website (deploy finished) -> shared on LinkedIn (company page + your profile)
// Pure orchestration over injected dependencies so every step can be tested without GitHub or LinkedIn.
export type Target = 'organization' | 'member'
const TARGETS: Target[] = ['organization', 'member']
const BUSY_MS = 10 * 60_000
const DEPLOY_WAIT_MS = 45 * 60_000
const MAX_MERGE_TRIES = 6
const MAX_SHARE_TRIES = 3

export interface PipelineDeps {
  now(): Date
  /** Drafts that were approved and sent to GitHub. */
  list(): Promise<BlogDraft[]>
  update(id: string, fn: (d: BlogDraft) => void): Promise<BlogDraft | null>
  getPr(n: number): Promise<{ state: 'open' | 'closed'; merged: boolean }>
  merge(n: number, title: string): Promise<void>
  isLive(slug: string): Promise<boolean>
  /** Which LinkedIn destinations are connected and have a valid login. */
  linkedinReady(): Promise<Record<Target, boolean>>
  share(d: BlogDraft, target: Target): Promise<{ urn: string }>
  alert(subject: string, html: string, key: string): Promise<void>
}

const esc = (s: string) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)
const iso = (d: Date) => d.toISOString()

export async function pipelineTick(deps: PipelineDeps): Promise<string[]> {
  const out: string[] = []
  const now = deps.now()
  for (const draft of await deps.list()) {
    const p = draft.pipeline
    if (draft.status !== 'submitted' || !p || p.stage === 'done' || p.stage === 'attention') continue
    const id = draft.id, title = draft.meta.title
    const tag = `${draft.meta.slug}`

    // Something started a merge or a post and never reported back.
    if (p.busy) {
      const age = now.getTime() - Date.parse(p.busy.at)
      if (age < BUSY_MS) continue
      if (p.busy.what.startsWith('share:')) {
        // We cannot know whether LinkedIn accepted it, so never post again blindly.
        await deps.update(id, d => { d.pipeline!.stage = 'attention'; d.pipeline!.note = `The ${p.busy!.what.slice(6) === 'organization' ? 'company page' : 'profile'} post was interrupted. Check LinkedIn before sharing again.`; d.pipeline!.busy = undefined })
        await deps.alert('Check LinkedIn for a blog share', `<p>Sharing "${esc(title)}" was interrupted and may or may not have gone out. Check LinkedIn, then use the studio to mark or retry it.</p>`, `blog-busy-${id}`)
        out.push(`${tag}: share interrupted, needs a look`)
        continue
      }
      await deps.update(id, d => { d.pipeline!.busy = undefined }) // a merge is safe to re-check: the PR state tells us what happened
    }

    // 1. Pull request -> merged
    if (p.stage === 'pr' && draft.pr) {
      try {
        const pr = await deps.getPr(draft.pr.number)
        if (pr.merged) { await deps.update(id, d => { d.pipeline!.stage = 'merged'; d.pipeline!.mergedAt = iso(now); d.pipeline!.note = undefined }); out.push(`${tag}: merged`); p.stage = 'merged'; p.mergedAt = iso(now) }
        else if (pr.state === 'closed') { await deps.update(id, d => { d.pipeline!.stage = 'attention'; d.pipeline!.note = 'The pull request was closed without merging.' }); await deps.alert('A blog pull request was closed', `<p>The pull request for "${esc(title)}" was closed without merging, so the post is not on the website.</p>`, `blog-closed-${id}`); continue }
        else if (p.autoMerge) {
          if (p.mergeTries >= MAX_MERGE_TRIES) continue
          await deps.update(id, d => { d.pipeline!.busy = { what: 'merge', at: iso(now) } })
          try {
            await deps.merge(draft.pr.number, title)
            await deps.update(id, d => { d.pipeline!.stage = 'merged'; d.pipeline!.mergedAt = iso(deps.now()); d.pipeline!.busy = undefined; d.pipeline!.note = undefined })
            out.push(`${tag}: merged automatically`); p.stage = 'merged'; p.mergedAt = iso(deps.now())
          } catch (e: any) {
            const tries = p.mergeTries + 1
            await deps.update(id, d => { d.pipeline!.busy = undefined; d.pipeline!.mergeTries = tries; d.pipeline!.note = `Could not merge yet: ${String(e?.message || e).slice(0, 200)}`; if (tries >= MAX_MERGE_TRIES) d.pipeline!.stage = 'attention' })
            out.push(`${tag}: merge failed (${tries}/${MAX_MERGE_TRIES})`)
            if (tries >= MAX_MERGE_TRIES) await deps.alert('A blog post could not be merged', `<p>"${esc(title)}" could not be merged automatically: ${esc(String(e?.message || e))}.</p><p>Open the Blog studio and press Merge, or merge the pull request on GitHub.</p>`, `blog-merge-${id}`)
          }
        }
      } catch (e: any) { out.push(`${tag}: could not read the pull request (${String(e?.message || e).slice(0, 80)})`) }
      if (p.stage === 'pr') continue
    }

    // 2. Merged -> live (the deploy takes several minutes)
    if (p.stage === 'merged') {
      let live = false
      try { live = await deps.isLive(draft.meta.slug) } catch { /* try again next time */ }
      if (live) { await deps.update(id, d => { d.pipeline!.stage = 'live'; d.pipeline!.liveAt = iso(now) }); out.push(`${tag}: live on the website`); p.stage = 'live' }
      else if (p.mergedAt && now.getTime() - Date.parse(p.mergedAt) > DEPLOY_WAIT_MS) {
        await deps.update(id, d => { d.pipeline!.stage = 'attention'; d.pipeline!.note = 'The website has not shown the post 45 minutes after the merge. Check the deploy.' })
        await deps.alert('A blog post is not live yet', `<p>"${esc(title)}" was merged but is still not on the website after 45 minutes. Check the deploy on GitHub.</p>`, `blog-live-${id}`)
      }
      if (p.stage === 'merged') continue
    }

    // 3. Live -> shared on LinkedIn, company page first, then your profile
    if (p.stage === 'live') {
      if (!p.shareToLinkedIn) { await deps.update(id, d => { d.pipeline!.stage = 'done' }); continue }
      const ready = await deps.linkedinReady()
      for (const t of TARGETS) {
        if ((draft.shared || {})[t]) continue
        const tries = p.shareTries[t] || 0
        if (tries >= MAX_SHARE_TRIES) continue
        if (!ready[t]) {
          await deps.update(id, d => { d.pipeline!.shareTries[t] = MAX_SHARE_TRIES; d.pipeline!.note = `LinkedIn ${t === 'organization' ? 'company page' : 'profile'} is not connected or its login expired.` })
          await deps.alert('Reconnect LinkedIn to share a blog post', `<p>"${esc(title)}" is live, but the ${t === 'organization' ? 'company page' : 'profile'} LinkedIn connection is missing or expired, so it was not shared there. Reconnect on the LinkedIn page, then press Share in the Blog studio.</p>`, `blog-token-${t}-${id}`)
          continue
        }
        await deps.update(id, d => { d.pipeline!.busy = { what: `share:${t}`, at: iso(deps.now()) } })
        try {
          const res = await deps.share(draft, t)
          await deps.update(id, d => { d.shared = { ...(d.shared || {}), [t]: { urn: res.urn, at: iso(deps.now()) } }; d.pipeline!.busy = undefined; d.pipeline!.note = undefined })
          out.push(`${tag}: shared to ${t}`)
        } catch (e: any) {
          const n = tries + 1
          await deps.update(id, d => { d.pipeline!.busy = undefined; d.pipeline!.shareTries[t] = n; d.pipeline!.note = `${t === 'organization' ? 'Company page' : 'Profile'} share failed: ${String(e?.message || e).slice(0, 200)}` })
          out.push(`${tag}: ${t} share failed (${n}/${MAX_SHARE_TRIES})`)
          if (n >= MAX_SHARE_TRIES) await deps.alert('A blog post could not be shared on LinkedIn', `<p>Sharing "${esc(title)}" to the ${t === 'organization' ? 'company page' : 'profile'} failed ${n} times: ${esc(String(e?.message || e))}.</p>`, `blog-share-${t}-${id}`)
        }
      }
      // Done when every destination is shared; needs you only once a destination has used up its retries.
      const fresh = (await deps.list()).find(x => x.id === id)
      const all = TARGETS.every(t => fresh?.shared?.[t])
      const exhausted = TARGETS.some(t => !fresh?.shared?.[t] && (fresh?.pipeline?.shareTries[t] || 0) >= MAX_SHARE_TRIES)
      await deps.update(id, d => { d.pipeline!.stage = all ? 'done' : exhausted ? 'attention' : 'live' })
    }
  }
  return out.length ? out : ['nothing to do']
}
