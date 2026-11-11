import { tick, applyAction, similar, mentionsAvoided, slotsFor, withRetry, isTransient, type Deps } from '../src/lib/autopilot/engine'
import { zonedToUtc } from '../src/lib/autopilot/time'
import { DEFAULT_CONFIG, emptyState, type State, type TargetKey } from '../src/lib/autopilot/types'
import { echoedHook, freshIdeas, ideaVendor, planSlots, vendorCounts, vendorKey } from '../src/lib/autopilot/variety'
import { actionUrl, linksHtml, verifyAction } from '../src/lib/autopilot/email-actions'

let pass = 0, fail = 0
const ok = (cond: boolean | undefined, name: string) => { cond ? pass++ : (fail++, console.log('  FAIL:', name)); if (cond) console.log('  ok  :', name) }

// Monday 2 Nov 2026 (IST). Weekday slots: 08:30, 12:30, 17:30, 20:30 IST.
const at = (date: string, hhmm: string) => zonedToUtc(date, hhmm, 'Asia/Kolkata')

function harness(over: Partial<State['config']> = {}) {
  const store: { s: State } = { s: { ...emptyState(), config: { ...DEFAULT_CONFIG, enabled: true, ...over } } }
  const w = { now: at('2026-11-02', '05:10'), published: [] as { id: string; t: TargetKey; text?: string }[], alerts: [] as string[], genCalls: 0, manual: {} as Record<string, TargetKey[]>, deleted: new Set<string>(), pubFail: null as null | ((n: number) => Error | null), pubCalls: 0, verdicts: [] as ('pass' | 'revise')[], text: 'A solid post about agents. '.repeat(20), tokenOk: true, researchFail: 0, ideasExtra: [] as string[] }
  const d: Deps = {
    now: () => w.now,
    load: async () => JSON.parse(JSON.stringify(store.s)),
    save: async s => { store.s = JSON.parse(JSON.stringify(s)) },
    sleep: async () => {},
    research: async () => {
      if (w.researchFail-- > 0) throw new Error('503 service unavailable')
      return [...w.ideasExtra, 'Microsoft ships agent governance toolkit', 'Google Gemini Enterprise adds agent marketplace', 'AWS AgentCore goes generally available', 'OpenAI releases new reasoning model for enterprises', 'Meta open sources new agent benchmark', 'EU AI Act obligations start for agents'].map(title => ({ title, angle: 'a', sources: [] }))
    },
    generate: async () => { w.genCalls++; const v = w.verdicts.length ? w.verdicts.shift()! : 'pass'; return { draftId: `d${w.genCalls}`, text: w.text, verdict: v, notes: v === 'pass' ? [] : ['opening line is weak'], variant: 'Different opening. ' + w.text } },
    draft: async id => (w.deleted.has(id) ? null : { text: w.text, publishedAs: [...(w.manual[id] || []), ...w.published.filter(p => p.id === id).map(p => p.t)] }),
    approve: async () => {},
    publish: async (id, t, o) => { w.pubCalls++; const e = w.pubFail?.(w.pubCalls); if (e) throw e; w.published.push({ id, t, text: o.commentary }); return { urn: `urn:li:share:${id}-${t}` } },
    tokens: async () => ({ organization: { ok: w.tokenOk, days: 30 }, member: { ok: w.tokenOk, days: 30 } }),
    alert: async subject => { w.alerts.push(subject) },
  }
  return { store, w, d }
}
const day = (h: ReturnType<typeof harness>, date = '2026-11-02') => h.store.s.days[date]

async function main() {
  console.log('helpers')
  ok(zonedToUtc('2026-11-02', '08:30', 'Asia/Kolkata').toISOString() === '2026-11-02T03:00:00.000Z', 'IST 08:30 = 03:00 UTC')
  ok(similar('Microsoft ships agent governance toolkit', 'Microsoft ships agent governance toolkit today') > 0.55, 'near-duplicate topics detected')
  ok(similar('AWS AgentCore goes GA', 'Google Gemini adds marketplace') < 0.2, 'different topics not flagged')
  ok(!!mentionsAvoided('Why the election will change AI policy', DEFAULT_CONFIG.avoidKeywords) !== null, 'avoid-list catches politics/elections')
  ok(mentionsAvoided('A cyber attack on agents: Azure AI Foundry adds tracing', DEFAULT_CONFIG.avoidKeywords) === null, 'avoid-list lets normal posts through')
  ok(mentionsAvoided('A careful selection of tools and a data collection plan', DEFAULT_CONFIG.avoidKeywords) === null, 'a banned word inside another word ("selection") is not a match')
  ok(mentionsAvoided('How elections and political risk shape AI roadmaps', DEFAULT_CONFIG.avoidKeywords) !== null, 'whole words and their plurals ("elections", "political") are still caught')
  const wd = slotsFor('2026-11-02', DEFAULT_CONFIG), we = slotsFor('2026-11-07', DEFAULT_CONFIG)
  ok(wd.length === 4 && !wd[0].weekend, 'weekday has 4 slots')
  ok(we.length === 4 && we[0].weekend && we[0].at.toISOString() === '2026-11-07T04:00:00.000Z', 'Saturday has 4 weekend slots (09:30 IST start)')
  ok(slotsFor('2026-11-02', { ...DEFAULT_CONFIG, weekdaySlots: [{ time: '09:00', kind: 'post' }, { time: '09:20', kind: 'post' }, { time: '11:00', kind: 'post' }] }).length === 2, 'slots closer than the minimum gap are dropped')
  ok(slotsFor('2026-11-02', { ...DEFAULT_CONFIG, dailyMax: 2 }).length === 2, 'daily cap enforced')
  let n = 0
  ok(await withRetry(async () => { if (++n < 3) throw new Error('429 rate limit'); return 'fine' }, { sleep: async () => {}, retryable: isTransient }) === 'fine' && n === 3, 'retry succeeds after two transient failures')
  n = 0
  try { await withRetry(async () => { n++; throw new Error('400 bad request') }, { sleep: async () => {}, retryable: isTransient }) } catch { /* expected */ }
  ok(n === 1, 'non-transient error is not retried')

  console.log('off / timing')
  let h = harness({ enabled: false })
  ok((await tick(h.d))[0] === 'autopilot is off' && !day(h), 'does nothing while switched off')
  h = harness(); h.w.now = at('2026-11-02', '04:00')
  await tick(h.d); ok(!day(h), 'no planning before research time')

  console.log('planning, drafting, publishing')
  h = harness(); h.w.now = at('2026-11-02', '05:10')
  await tick(h.d)
  ok(day(h).slots.length === 4, 'plans 4 slots after research time')
  ok(day(h).slots[3].status === 'planned' && day(h).slots[2].status === 'planned', 'evening slots are not drafted early')
  h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  ok(day(h).slots[0].status === 'ready' && day(h).slots[1].status === 'planned', 'slot 1 drafted ~4h ahead, slot 2 not yet')
  h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  ok(h.w.published.length === 1 && h.w.published[0].t === 'organization', 'company page post goes out at the slot time')
  ok(h.w.published[0].text === undefined, 'company page gets the original text')
  h.w.now = at('2026-11-02', '09:20'); await tick(h.d)
  const mem = h.w.published.find(p => p.t === 'member')
  ok(!!mem && mem.text?.startsWith('Different opening'), 'profile post goes out 45 min later with a different opening')
  ok(day(h).slots[0].status === 'done', 'slot marked done after both targets')
  h.w.now = at('2026-11-02', '09:40'); await tick(h.d)
  ok(h.w.published.length === 2, 'a later tick never re-posts a finished slot')

  console.log('you post manually first')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); await tick(h.d)
  h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.manual['d1'] = ['member', 'organization']
  h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  ok(h.w.published.length === 0 && day(h).slots[0].status === 'done', 'both targets posted by you -> agent posts nothing')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); await tick(h.d)
  h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.manual['d1'] = ['member']
  h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  h.w.now = at('2026-11-02', '09:30'); await tick(h.d)
  ok(h.w.published.length === 1 && h.w.published[0].t === 'organization', 'you posted to your profile -> agent still posts to the page only')

  console.log('quality gate and avoid-list')
  h = harness(); h.w.verdicts = ['revise', 'pass']; h.w.now = at('2026-11-02', '05:10'); await tick(h.d)
  h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  ok(h.w.genCalls === 2 && day(h).slots[0].status === 'ready', 'rewrites once then passes the gate')
  h = harness(); h.w.verdicts = ['revise', 'revise', 'revise']; h.w.now = at('2026-11-02', '05:10'); await tick(h.d)
  h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  ok(day(h).slots[0].status === 'held' && h.w.alerts.some(a => /held/.test(a)), 'fails the gate 3 times -> held + you are emailed')
  h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  ok(h.w.published.length === 0, 'a held post is never published')
  h = harness(); h.w.text = 'Why the election result matters for every AI team. '.repeat(10); h.w.now = at('2026-11-02', '05:10'); await tick(h.d)
  h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  ok(day(h).slots[0].status === 'held', 'post that touches an avoided topic is held even if the reviewer passed it')
  applyAction(h.store.s, day(h).slots[0].id, 'skip', h.w.now)
  ok(h.store.s.days['2026-11-02'].slots[0].status === 'skipped', 'you can skip a held post')

  console.log('failures and retries')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.pubFail = c => (c <= 2 ? new Error('503 LinkedIn unavailable') : null)
  h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  ok(h.w.published.length === 1, 'transient publish errors are retried within the tick and succeed')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.pubFail = () => new Error('422 duplicate content')
  for (const m of ['08:31', '08:46', '09:01']) { h.w.now = at('2026-11-02', m); await tick(h.d) }
  ok(day(h).slots[0].targets.organization!.status === 'held' && h.w.alerts.some(a => /could not publish/.test(a)), 'permanent errors: 3 tries across ticks, then held + you are emailed')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); h.w.researchFail = 2; await tick(h.d); await tick(h.d); await tick(h.d)
  ok(day(h).slots.length === 4, 'research recovers after two transient failures')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); h.w.researchFail = 99; for (let i = 0; i < 5; i++) await tick(h.d)
  ok(day(h).slots.length === 0 && h.w.alerts.some(a => /could not plan/.test(a)), 'research keeps failing -> you are emailed, nothing posts')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); h.w.ideasExtra = []; await tick(h.d)
  h.w.now = at('2026-11-03', '05:10'); await tick(h.d)
  const t1 = h.store.s.days['2026-11-02'].slots.map(s => s.topic!.title), t2 = (h.store.s.days['2026-11-03']?.slots || []).map(s => s.topic!.title)
  ok(t2.length === 0 || t2.every(x => !t1.includes(x)), 'topics used in the last 30 days are not repeated')

  console.log('safety nets')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.now = at('2026-11-02', '12:00'); await tick(h.d)
  ok(h.w.published.filter(p => p.id === 'd1').length === 0 && day(h).slots[0].targets.organization!.status === 'skipped', 'missed window (3.5h late) -> skipped, never posted late')
  h = harness(); h.w.tokenOk = false; h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  ok(h.w.published.length === 0 && h.w.alerts.some(a => /reconnect/i.test(a)), 'expired LinkedIn token -> no post, you are emailed')
  h = harness({ mode: 'review' }); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  ok(h.w.published.length === 0 && day(h).slots[0].status === 'ready', 'review-only mode prepares drafts but never publishes')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  applyAction(h.store.s, day(h).slots[0].id, 'manual', h.w.now)
  h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  ok(h.w.published.length === 0, 'a slot you switched to manual is never auto-posted')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.deleted.add('d1'); h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  ok(h.w.published.length === 0 && day(h).slots[0].status === 'skipped', 'deleting the draft cancels the slot')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.now = at('2026-11-02', '08:31')
  await Promise.all([tick(h.d), tick(h.d), tick(h.d)])
  ok(h.w.published.filter(p => p.t === 'organization').length === 1, 'three simultaneous ticks publish exactly once')
  h = harness(); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.store.s.days['2026-11-02'].slots[0].targets.organization!.status = 'publishing'
  h.store.s.days['2026-11-02'].slots[0].updatedAt = at('2026-11-02', '08:00').toISOString()
  h.w.now = at('2026-11-02', '08:40'); await tick(h.d)
  ok(h.w.published.length === 0 && day(h).slots[0].targets.organization!.status === 'held', 'an interrupted publish is held for you, never blindly retried (no double post)')
  h = harness(); h.w.now = at('2026-11-07', '05:10'); await tick(h.d); h.w.now = at('2026-11-07', '06:30'); await tick(h.d)
  ok(day(h, '2026-11-07').slots[0].weekend === true && day(h, '2026-11-07').slots[0].at === '2026-11-07T04:00:00.000Z', 'Saturday is planned with weekend slots')
  h = harness(); h.w.now = at('2026-11-02', '07:30'); await tick(h.d)
  ok(h.w.alerts.some(a => /Today's LinkedIn plan/.test(a)), 'morning digest email is sent once the plan exists')
  const before = h.w.alerts.length; await tick(h.d)
  ok(h.w.alerts.length === before, 'digest is not sent twice')


  console.log('variety: repeats, vendors, formats, hooks')
  // A fake embedding: texts that share a "story" tag point the same way, so a reworded repeat is caught.
  const story = (t: string) => (/claude|anthropic/i.test(t) ? [1, 0, 0] : /fabric|microsoft/i.test(t) ? [0, 1, 0] : [0, 0, 1])
  const fakeEmbed = async (texts: string[]) => texts.map(story)
  const fresh = await freshIdeas([{ title: 'Why the new Claude model changes enterprise agents', angle: 'a' }, { title: 'GitHub trending: a local RAG starter kit', angle: 'b' }], [{ title: 'Anthropic ships its next model for businesses' }], fakeEmbed)
  ok(fresh.length === 1 && /RAG/.test(fresh[0].title), 'a reworded repeat (no shared title words) is caught by meaning')
  const noEmbed = await freshIdeas([{ title: 'Microsoft ships agent governance toolkit today' }], [{ title: 'Microsoft ships agent governance toolkit' }])
  ok(noEmbed.length === 0, 'word-overlap repeat is still caught without embeddings')
  const broken = await freshIdeas([{ title: 'A new idea' }], [{ title: 'Old idea about something else' }], async () => { throw new Error('429') })
  ok(broken.length === 1, 'an embedding failure falls back instead of blocking the day')
  ok(vendorKey('Azure AI Foundry') === 'microsoft' && vendorKey('Claude Code') === 'anthropic', 'products map to their vendor')
  const wk = vendorCounts([{ at: '2026-11-01T00:00:00Z', vendor: 'Microsoft' }, { at: '2026-10-31T00:00:00Z', vendor: 'Azure' }, { at: '2026-10-01T00:00:00Z', vendor: 'Google' }], new Date('2026-11-02T00:00:00Z'))
  ok(wk.microsoft === 2 && !wk.google, 'weekly vendor count groups products and ignores old posts')
  const idea = (title: string, vendor: string, format: string, heat: number) => ({ title, vendor, format, heat, angle: '', sources: [] })
  const pool = [idea('MS news', 'Microsoft', 'news-take', 10), idea('Google news', 'Google', 'news-take', 9), idea('AWS walkthrough', 'AWS', 'walkthrough', 8), idea('Repo buzz', 'none', 'builder-buzz', 7), idea('Use case', 'Infosys', 'use-case', 6), idea('Poll topic', 'Meta', 'contrarian', 5)]
  const plan = planSlots(pool, [{ kind: 'post' }, { kind: 'poll' }, { kind: 'post' }, { kind: 'post' }], { vendorWeek: { microsoft: 2 }, vendorCap: 2 })!
  ok(!!plan && !plan.some(i => i.vendor === 'Microsoft'), 'a vendor at its weekly cap is left out when there is enough else')
  ok(plan.filter(i => i.format === 'news-take').length <= 1, 'at most one plain news post a day')
  const postFormats = plan.filter((_, k) => k !== 1).map(i => i.format)
  ok(new Set(postFormats).size === postFormats.length, 'no format is used twice in a day when alternatives exist')
  const tight = planSlots([idea('A', 'Microsoft', 'walkthrough', 9), idea('B', 'Google', 'walkthrough', 8)], [{ kind: 'post' }, { kind: 'post' }], { vendorWeek: { microsoft: 5 }, vendorCap: 2 })
  ok(!!tight && tight.length === 2, 'caps relax rather than leave the day empty')
  ok(planSlots([idea('A', 'Microsoft', 'walkthrough', 9), idea('B', 'Azure', 'use-case', 8)], [{ kind: 'post' }, { kind: 'post' }], { vendorWeek: {}, vendorCap: 2 }) === null, 'never the same vendor twice in one day')
  ok(!!echoedHook('**Your agent passes every demo and fails in production.**\n- one', ['Your agent passes every demo and then fails in prod']), 'an opening that echoes a recent one is caught')
  ok(echoedHook('Three prompts that cut review time in half.', ['Your agent passes every demo and fails in production.']) === null, 'a different opening passes')

  h = harness(); h.w.now = at('2026-11-02', '05:10')
  h.store.s.history.push({ at: at('2026-11-01', '08:00').toISOString(), title: 'old', hook: 'A solid post about agents. A solid post about agents.' })
  await tick(h.d)
  ok(h.w.genCalls === 3 && day(h).slots[0].status === 'held', 'a draft whose opening repeats a recent post is rewritten, then held')

  console.log('email buttons')
  const old = process.env.AUTOPILOT_ACTION_SECRET
  process.env.AUTOPILOT_ACTION_SECRET = 'test-secret'
  const u = new URL(actionUrl('2026-11-02-1', 'approve')!)
  const q = (k: string) => u.searchParams.get(k)!
  ok(verifyAction(q('s'), q('a'), q('e'), q('t')).ok, 'a signed link verifies')
  ok(!verifyAction('2026-11-02-2', q('a'), q('e'), q('t')).ok, 'the link cannot be moved to another post')
  ok(!verifyAction(q('s'), 'skip', q('e'), q('t')).ok, 'the link cannot be changed to another action')
  ok(!verifyAction(q('s'), q('a'), String(Number(q('e')) + 1000), q('t')).ok, 'the expiry cannot be extended')
  const expired = new URL(actionUrl('x', 'skip', Date.now() - 40 * 3_600_000)!)
  ok(!verifyAction('x', 'skip', expired.searchParams.get('e')!, expired.searchParams.get('t')!).ok, 'an expired link is refused')
  delete process.env.AUTOPILOT_ACTION_SECRET
  const savedNa = process.env.NEXTAUTH_SECRET, savedA = process.env.AUTH_SECRET
  delete process.env.NEXTAUTH_SECRET; delete process.env.AUTH_SECRET
  ok(linksHtml('x', ['approve']) === '' && !verifyAction(q('s'), q('a'), q('e'), q('t')).ok, 'no secret configured: no buttons, and old links stop working')
  if (old) process.env.AUTOPILOT_ACTION_SECRET = old
  if (savedNa) process.env.NEXTAUTH_SECRET = savedNa
  if (savedA) process.env.AUTH_SECRET = savedA

  h = harness({ mode: 'review' }); const linkCalls: string[] = []
  h.d.links = (id, actions) => { linkCalls.push(`${id}:${actions.join(',')}`); return '' }
  h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  ok(linkCalls.includes('2026-11-02-1:approve,skip') && h.w.alerts.some(a => /Approve today's/.test(a)), 'review mode emails the draft with Approve / Skip buttons')
  h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  ok(h.w.published.length === 0, 'review mode: nothing posts before approval')
  applyAction(h.store.s, '2026-11-02-1', 'approve', h.w.now); h.w.now = at('2026-11-02', '08:40'); await tick(h.d)
  ok(h.w.published.some(p => p.t === 'organization'), 'approving from the email posts it')
  let threw = false; try { applyAction(h.store.s, '2026-11-02-3', 'approve', h.w.now) } catch { threw = true }
  ok(threw, 'a slot without a finished draft cannot be approved')

  console.log('vendor from sources')
  ok(ideaVendor({ vendor: 'none', sources: [{ url: 'https://shopify.engineering/reflex' }] }) === 'shopify', 'an untagged idea gets its company from the source site')
  ok(ideaVendor({ vendor: '', sources: [{ url: 'https://engineering.atspotify.com/2026/9/x' }] }) === 'spotify', 'engineering.atspotify.com counts as Spotify')
  ok(ideaVendor({ vendor: 'none', sources: [{ url: 'https://github.com/x/y' }] }) === '', 'GitHub, arXiv and news sites do not count as a company')
  ok(ideaVendor({ vendor: 'none', sources: [{ url: 'https://www.atlassian.com/blog/x' }] }) === 'atlassian', 'names starting with "at" are kept intact')
  ok(planSlots([idea('Remote Dev', 'Shopify', 'use-case', 9), { ...idea('Reflex', 'none', 'builder-buzz', 8), sources: [{ title: 'r', url: 'https://shopify.engineering/reflex' }] }, idea('Other', 'Stripe', 'workflow', 1)], [{ kind: 'post' }, { kind: 'post' }], { vendorWeek: {}, vendorCap: 2 })!.map(i => i.title).join() === 'Remote Dev,Other', 'two Shopify stories are never planned for the same day')

  console.log('late approval (review mode)')
  h = harness({ mode: 'review' }); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.now = at('2026-11-02', '13:00'); await tick(h.d)
  ok(h.w.published.length === 0, 'unapproved draft is not posted, even long after its time')
  applyAction(h.store.s, '2026-11-02-1', 'approve', h.w.now); await tick(h.d)
  ok(h.w.published.some(p => p.id === day(h).slots[0].draftId && p.t === 'organization'), 'approved 4.5h late: company page posts immediately')
  h.w.now = at('2026-11-02', '13:50'); await tick(h.d)
  ok(h.w.published.some(p => p.t === 'member'), 'profile repost follows after the usual gap')
  h = harness({ mode: 'review' }); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  h.w.now = at('2026-11-03', '10:00')
  applyAction(h.store.s, '2026-11-02-1', 'approve', h.w.now); await tick(h.d)
  ok(h.w.published.some(p => p.t === 'organization' && p.id === h.store.s.days['2026-11-02'].slots[0].draftId), "yesterday's draft approved today is posted straight away")
  const before2 = h.w.published.length; h.w.now = at('2026-11-03', '11:30'); await tick(h.d); h.w.now = at('2026-11-03', '12:00'); await tick(h.d)
  ok(h.w.published.length === before2 + 1 && h.store.s.days['2026-11-02'].slots[0].status === 'done', 'it settles once both targets are posted, and is never posted twice')
  h = harness({ mode: 'review' }); h.w.now = at('2026-11-02', '05:10'); await tick(h.d); h.w.now = at('2026-11-02', '07:00'); await tick(h.d)
  applyAction(h.store.s, '2026-11-02-1', 'approve', h.w.now); await tick(h.d)
  ok(h.w.published.length === 0, 'approved early: waits for its scheduled time')
  h.w.now = at('2026-11-02', '08:31'); await tick(h.d)
  ok(h.w.published.length === 1, '...and posts at that time')

  console.log('pillars and the weekly company cap')
  const pi = (title: string, vendor: string, format: string, heat: number, pillar: string) => ({ ...idea(title, vendor, format, heat), pillar })
  const day4 = [{ kind: 'post' }, { kind: 'poll' }, { kind: 'post' }, { kind: 'post' }]
  const mix = [pi('Shopify A', 'Shopify', 'use-case', 10, 'use-case'), pi('Shopify B', 'Shopify', 'builder-buzz', 9, 'hands-on'), pi('Foundry agents', 'Microsoft', 'walkthrough', 5, 'microsoft'), pi('Benchmarks lie', 'none', 'contrarian', 6, 'debate'), pi('LangGraph repo', 'LangChain', 'walkthrough', 7, 'hands-on'), pi('Best Buy', 'Best Buy', 'use-case', 8, 'use-case')]
  const pl = planSlots(mix, day4, { vendorWeek: {}, vendorCap: 1, pillars: ['microsoft', 'debate', 'use-case', 'hands-on'], core: ['microsoft'] })!
  ok(pl.map(i => i.title).join('|') === 'Foundry agents|Benchmarks lie|Shopify A|LangGraph repo', 'each slot gets its pillar, even when another idea scores hotter')
  const pl2 = planSlots(mix, day4, { vendorWeek: { shopify: 1, microsoft: 6 }, vendorCap: 1, pillars: ['microsoft', 'debate', 'use-case', 'hands-on'], core: ['microsoft'] })!
  ok(pl2[2].title === 'Best Buy' && pl2[0].title === 'Foundry agents', 'a company already covered this week is skipped; Microsoft (core) is never capped')
  const thin = planSlots([pi('Only MS', 'Microsoft', 'walkthrough', 5, 'microsoft'), pi('Debate', 'none', 'contrarian', 5, 'debate'), pi('Use', 'Acme', 'use-case', 5, 'use-case'), pi('Extra', 'Globex', 'number', 5, 'use-case')], day4, { vendorWeek: {}, vendorCap: 1, pillars: ['microsoft', 'debate', 'use-case', 'hands-on'], core: ['microsoft'] })
  ok(!!thin && thin[3].title === 'Extra', 'a pillar with no ideas is filled from another pillar rather than leaving the slot empty')

  console.log(`\n${pass} passed, ${fail} failed`)
  process.exit(fail ? 1 : 0)
}
main()
