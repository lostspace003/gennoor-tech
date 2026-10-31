import { pipelineTick, type PipelineDeps, type Target } from '../src/lib/blog-pipeline'
import { blogAutoTick, emptyAutoState, DEFAULT_BLOG_AUTO, type AutoDeps, type AutoState } from '../src/lib/blog-auto'
import { zonedToUtc } from '../src/lib/autopilot/time'
import type { BlogDraft } from '../src/lib/blog-studio'

// Tests for the blog publishing flow and the daily blog autopilot, with GitHub, the deploy and LinkedIn simulated.
let pass = 0, fail = 0
const ok = (c: boolean | undefined, n: string) => { c ? pass++ : (fail++, console.log('  FAIL:', n)); if (c) console.log('  ok  :', n) }
const at = (date: string, hhmm: string) => zonedToUtc(date, hhmm, 'Asia/Kolkata')

// ---------------- publishing pipeline ----------------
function mkDraft(over: Partial<NonNullable<BlogDraft['pipeline']>> = {}): BlogDraft {
  return {
    id: 'd1', topic: 't', status: 'submitted', body: '<p>x</p>', createdAt: '', updatedAt: '', pr: { url: 'u', number: 7, branch: 'b' },
    meta: { title: 'Agents in production', slug: 'agents-in-production', excerpt: 'e', tldr: 't', keyTakeaways: [], faqs: [], references: [], category: 'AI', tags: [], hashtags: [], readTime: '9 min read', coverColor: '#000', icon: 'x', date: '2026-11-01' },
    pipeline: { stage: 'pr', autoMerge: true, shareToLinkedIn: true, mergeTries: 0, shareTries: {}, ...over },
  }
}
function pipe(draft: BlogDraft) {
  const w = { now: at('2026-11-01', '07:00'), pr: { state: 'open' as 'open' | 'closed', merged: false }, mergeErr: null as null | string, live: false, ready: { organization: true, member: true } as Record<Target, boolean>, shareErr: {} as Partial<Record<Target, string>>, merges: 0, shares: [] as Target[], alerts: [] as string[] }
  const store = { d: draft }
  const deps: PipelineDeps = {
    now: () => w.now,
    list: async () => [JSON.parse(JSON.stringify(store.d))],
    update: async (_id, fn) => { fn(store.d); return store.d },
    getPr: async () => w.pr,
    merge: async () => { w.merges++; if (w.mergeErr) throw new Error(w.mergeErr); w.pr = { state: 'closed', merged: true } },
    isLive: async () => w.live,
    linkedinReady: async () => w.ready,
    share: async (_d, t) => { if (w.shareErr[t]) throw new Error(w.shareErr[t]); w.shares.push(t); return { urn: `urn:${t}` } },
    alert: async s => { w.alerts.push(s) },
  }
  return { w, store, deps }
}

async function main() {
  console.log('publishing pipeline')
  let h = pipe(mkDraft())
  await pipelineTick(h.deps)
  ok(h.w.merges === 1 && h.store.d.pipeline!.stage === 'merged', 'open PR is merged automatically')
  await pipelineTick(h.deps)
  ok(h.store.d.pipeline!.stage === 'merged' && h.w.shares.length === 0, 'waits for the deploy: nothing is shared while the post is not live')
  h.w.live = true; await pipelineTick(h.deps)
  ok(h.store.d.pipeline!.stage === 'live', 'goes live once the website serves the post')
  await pipelineTick(h.deps)
  ok(h.w.shares.join() === 'organization,member' && h.store.d.pipeline!.stage === 'done', 'shared on the company page and then the profile, then done')
  await pipelineTick(h.deps); await pipelineTick(h.deps)
  ok(h.w.shares.length === 2, 'further ticks never share twice')

  h = pipe(mkDraft({ autoMerge: false }))
  await pipelineTick(h.deps)
  ok(h.w.merges === 0 && h.store.d.pipeline!.stage === 'pr', 'auto-merge off: waits for the Merge button')

  h = pipe(mkDraft()); h.w.mergeErr = 'Pull request is not mergeable'
  for (let i = 0; i < 6; i++) await pipelineTick(h.deps)
  ok(h.store.d.pipeline!.stage === 'attention' && h.w.alerts.some(a => /could not be merged/.test(a)), 'merge keeps failing: 6 tries, then needs attention and you are emailed')

  h = pipe(mkDraft()); h.w.pr = { state: 'closed', merged: false }
  await pipelineTick(h.deps)
  ok(h.store.d.pipeline!.stage === 'attention' && h.w.merges === 0, 'a PR closed without merging is flagged, not merged')

  h = pipe(mkDraft({ stage: 'merged', mergedAt: at('2026-11-01', '05:00').toISOString() }))
  await pipelineTick(h.deps)
  ok(h.store.d.pipeline!.stage === 'attention' && h.w.alerts.some(a => /not live/.test(a)), 'deploy takes over 45 minutes: you are emailed')

  h = pipe(mkDraft({ stage: 'live' })); h.w.shareErr.organization = '403 not allowed to post as organization'
  for (let i = 0; i < 3; i++) await pipelineTick(h.deps)
  ok(h.w.shares.join() === 'member' && h.store.d.pipeline!.stage === 'attention' && h.w.alerts.some(a => /could not be shared/.test(a)), 'company page fails 3 times: your profile is still shared and you are emailed')

  h = pipe(mkDraft({ stage: 'live' })); h.w.ready.organization = false
  await pipelineTick(h.deps)
  ok(h.w.shares.join() === 'member' && h.w.alerts.some(a => /Reconnect LinkedIn/.test(a)), 'company page not connected: profile is shared, you are asked to reconnect')

  h = pipe(mkDraft({ stage: 'live', shareToLinkedIn: false }))
  await pipelineTick(h.deps)
  ok(h.w.shares.length === 0 && h.store.d.pipeline!.stage === 'done', 'sharing switched off: finishes without posting')

  h = pipe(mkDraft({ stage: 'live', busy: { what: 'share:organization', at: at('2026-11-01', '06:00').toISOString() } }))
  await pipelineTick(h.deps)
  ok(h.w.shares.length === 0 && h.store.d.pipeline!.stage === 'attention', 'an interrupted share is held for you, never repeated blindly')

  h = pipe(mkDraft({ stage: 'live', busy: { what: 'share:organization', at: at('2026-11-01', '06:58').toISOString() } }))
  await pipelineTick(h.deps)
  ok(h.w.shares.length === 0, 'a share that just started is left alone')

  // ---------------- daily blog autopilot ----------------
  console.log('daily blog autopilot')
  function auto(over: Partial<AutoState['config']> = {}) {
    const store: { s: AutoState } = { s: { ...emptyAutoState(), config: { ...DEFAULT_BLOG_AUTO, ...over } } }
    const w = { now: at('2026-11-02', '07:00'), ideas: ['Why MCP gateways matter for enterprise AI agents', 'Azure AI Foundry agent tracing explained'], genVerdict: 'pass' as string, reviews: [] as string[], revisions: 0, submits: [] as string[], alerts: [] as string[], gen: 0, researchFail: 0, text: 'A calm, useful article about agents. '.repeat(40), published: [] as string[] }
    const deps: AutoDeps = {
      now: () => w.now, sleep: async () => {},
      load: async () => JSON.parse(JSON.stringify(store.s)), save: async s => { store.s = JSON.parse(JSON.stringify(s)) },
      research: async () => { if (w.researchFail-- > 0) throw new Error('503 unavailable'); return w.ideas.map(title => ({ title, angle: 'a', sources: [] })) },
      published: async () => w.published, avoidKeywords: async () => ['election', 'layoff'],
      generate: async () => { w.gen++; return { draftId: `b${w.gen}`, review: { verdict: w.genVerdict, notes: w.genVerdict === 'pass' ? [] : ['intro is weak'] } } },
      review: async () => { const v = w.reviews.shift() ?? 'pass'; return { verdict: v, notes: v === 'pass' ? [] : ['still weak'] } },
      revise: async () => { w.revisions++ }, text: async () => w.text,
      submit: async id => { w.submits.push(id) }, alert: async s => { w.alerts.push(s) },
    }
    return { store, w, deps }
  }
  let a = auto(); a.w.now = at('2026-11-02', '05:00')
  ok((await blogAutoTick(a.deps))[0] === 'before the daily start time', 'does nothing before the daily start time')
  a = auto(); a.w.now = at('2026-11-02', '07:00')
  await blogAutoTick(a.deps)
  ok(a.w.submits.length === 1 && a.store.s.days['2026-11-02'].runs[0].status === 'submitted', 'research, write, review passes: approved and sent to the website')
  await blogAutoTick(a.deps); await blogAutoTick(a.deps)
  ok(a.w.submits.length === 1, 'only one article per day')
  a.w.now = at('2026-11-03', '07:00'); await blogAutoTick(a.deps)
  ok(a.w.submits.length === 2, 'a new day starts a new article')

  a = auto({ enabled: false }); await blogAutoTick(a.deps)
  ok(a.w.gen === 0 && a.w.submits.length === 0, 'switched off: nothing is written')

  a = auto(); a.w.genVerdict = 'revise'; a.w.reviews = ['pass']
  await blogAutoTick(a.deps)
  ok(a.w.revisions === 1 && a.w.submits.length === 1, 'reviewer asks for changes: one revision, re-reviewed, then approved')
  a = auto(); a.w.genVerdict = 'revise'; a.w.reviews = ['revise', 'pass']
  await blogAutoTick(a.deps)
  ok(a.w.revisions === 2 && a.w.submits.length === 1, 'needs two revisions: both are done, then approved')
  a = auto(); a.w.genVerdict = 'revise'; a.w.reviews = ['revise', 'revise']
  await blogAutoTick(a.deps)
  ok(a.w.revisions === 2 && a.w.submits.length === 0 && a.store.s.days['2026-11-02'].runs[0].status === 'held' && a.w.alerts.some(x => /held/.test(x)), 'still failing after two revisions: held for you, not published, you are emailed')

  a = auto(); a.w.text = 'The election outcome will reshape every AI roadmap. '.repeat(30)
  await blogAutoTick(a.deps)
  ok(a.w.submits.length === 0 && a.store.s.days['2026-11-02'].runs[0].status === 'held', 'a banned-topic word holds the article even after a passing review')

  a = auto(); a.w.published = ['Why MCP gateways matter for enterprise AI agents today']
  await blogAutoTick(a.deps)
  ok(a.w.submits.length === 1 && a.store.s.days['2026-11-02'].runs[0].topic?.title.startsWith('Azure'), 'skips a topic already published and picks a fresh one')
  a = auto(); a.w.ideas = ['Layoff waves hit big tech this quarter']
  await blogAutoTick(a.deps)
  ok(a.w.submits.length === 0, 'a banned-topic idea is never picked')

  a = auto(); a.w.researchFail = 2
  await blogAutoTick(a.deps)
  ok(a.w.submits.length === 1, 'research recovers after two transient failures')
  a = auto(); a.w.researchFail = 99
  for (let i = 0; i < 4; i++) await blogAutoTick(a.deps)
  ok(a.w.submits.length === 0 && a.w.alerts.some(x => /could not finish/.test(x)), 'research keeps failing: 3 attempts, then you are emailed')

  a = auto(); a.w.now = at('2026-11-02', '07:00')
  await Promise.all([blogAutoTick(a.deps), blogAutoTick(a.deps), blogAutoTick(a.deps)])
  ok(a.w.submits.length === 1, 'three simultaneous runs publish exactly one article')

  console.log(`\n${pass} passed, ${fail} failed`)
  process.exit(fail ? 1 : 0)
}
main()
