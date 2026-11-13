/**
 * Tries the autopilot's real work against the real services, without writing anything down.
 *
 *   npx tsx --env-file=.env.local scripts/autopilot-live-check.ts
 *        the newest planned or held post: its request is built and sent, and the post that comes back is printed
 *   npx tsx --env-file=.env.local scripts/autopilot-live-check.ts --fresh [stream]
 *        research NOW for one stream (top-story by default; microsoft, use-case, hands-on, debate), print what it
 *        found (title, date, facts, words to explain), then have the hottest idea written. This is the way to
 *        read what the autopilot would publish today, in plain words or not, before it does.
 *   npx tsx --env-file=.env.local scripts/autopilot-live-check.ts --direct
 *        the same post written by the website itself, as it would be if the agent service were down
 *   ... --old    also sends the request as the site built it before 13 November 2026 (half letters and all)
 *
 * It reads the autopilot's saved plan and the list of published posts, builds the request exactly as the autopilot
 * does (src/lib/autopilot/live.ts, draftRequest), sends it and prints what came back. It saves no draft, changes no
 * plan and posts nothing. It costs one run of the writers, and with --fresh one web search (a few US cents each).
 * Use it after putting the agent service out again, after changing the writing rules, and whenever the Autopilot
 * page says "drafting failed". It must end with ALL OK.
 */
import { loadState, liveDeps, draftRequest, researchIdeas, writeDirect } from '@/lib/autopilot/live'
import { localParts } from '@/lib/autopilot/time'
import { agentFetch } from '@/lib/social/agent-service'
import { hasBrokenLetter } from '@/lib/safe-text'
import { selfTalk } from '@/lib/writing-rules'
import type { Slot, TopicIdea } from '@/lib/autopilot/types'

const has = (flag: string) => process.argv.includes(flag)
const show = (text: string) => console.log(String(text).split('\n').map((l) => `    | ${l}`).join('\n'))

async function run(label: string, body: Record<string, unknown>, raw = false) {
  const started = Date.now()
  // raw: sent as the site sent it before the fix, half letters and all, to prove the service now takes it
  const res = raw
    ? await fetch(`${(process.env.STUDIO_AGENTS_URL || '').replace(/\/$/, '')}/run`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Api-Key': process.env.STUDIO_AGENTS_KEY || '' }, body: JSON.stringify(body) })
    : await agentFetch('/run', body)
  if (!res.ok || !res.body) { console.log(`${label}: REFUSED ${res.status} ${(await res.text().catch(() => '')).slice(0, 200)}`); return false }
  const text = await res.text()
  const lines = text.split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
  const error = lines.find((l) => l.type === 'error')
  const result = lines.find((l) => l.type === 'result')
  if (error || !result?.text) { console.log(`${label}: FAILED ${error?.message || 'no post came back'}`); return false }
  const steps = lines.filter((l) => l.type === 'step' && l.status === 'done').map((l) => l.agent).join(', ')
  console.log(`${label}: a post came back in ${Math.round((Date.now() - started) / 1000)} s (steps: ${steps}), ${String(result.text).length} characters, review "${result.review?.verdict}"`)
  show(result.text)
  if (result.review?.notes?.length) console.log(`    review notes: ${result.review.notes.slice(0, 4).join(' | ').slice(0, 600)}`)
  return true
}

async function main() {
  const s = await loadState()
  const d = liveDeps()
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
  const past = d.pastPosts ? await d.pastPosts().catch(() => []) : []
  const openings = [...s.history.map((h) => ({ at: h.at, hook: h.hook || '' })), ...past.map((p) => ({ at: p.at, hook: p.hook || '' }))].filter((x) => x.hook).sort((a, b) => a.at.localeCompare(b.at))
  const recentHooks = [...new Set(openings.map((x) => x.hook))].slice(-30)

  let slot: Slot | undefined
  if (has('--fresh')) {
    const next = process.argv[process.argv.indexOf('--fresh') + 1]
    const pillar = next && !next.startsWith('--') ? next : 'top-story'
    const today = localParts(new Date(), s.config.tz).date
    console.log(`research now, stream "${pillar}", for ${today} ...`)
    const ideas: TopicIdea[] = await researchIdeas({ date: today, weekend: false, cfg: s.config, recent: s.history.slice(-60).map((h) => h.title), pillar, count: 4 }, sleep)
    if (!ideas.length) throw new Error('The research found nothing recent enough.')
    for (const i of ideas) console.log(`  ${i.date || 'no date'}  heat ${i.heat ?? '-'}  [${i.format || '-'}]  ${i.title}   (${i.facts?.length || 0} facts, ${i.terms?.length || 0} words to explain, ${i.sources.length} sources)`)
    const topic = { ...ideas[0], pillar }
    console.log(`\nthe hottest idea, as the writers receive it:`)
    show(draftRequest({ slot: { id: 'check', date: today, at: new Date().toISOString(), kind: 'post', weekend: false, topic, status: 'planned', genAttempts: 0, regens: 0, targets: {}, updatedAt: '' } as Slot, cfg: s.config, notes: [], recentHooks }).references)
    slot = { id: 'check', date: today, at: new Date().toISOString(), kind: 'post', weekend: false, topic, status: 'planned', genAttempts: 0, regens: 0, targets: {}, updatedAt: '' } as Slot
  } else {
    const slots = Object.keys(s.days).sort().flatMap((day) => s.days[day].slots).filter((sl) => sl.kind === 'post' && sl.topic)
    slot = [...slots].reverse().find((sl) => sl.status === 'planned' || sl.status === 'held') || slots[slots.length - 1]
  }
  if (!slot) throw new Error('The autopilot has no post planned to try.')

  const request = draftRequest({ slot, cfg: s.config, notes: [], recentHooks })
  const { brief, references } = request
  console.log(`\nslot ${slot.id} (${slot.status}): "${slot.topic!.title}"`)
  console.log(`brief: ${brief.length} characters, ${recentHooks.length} recent openings known, half letters: ${hasBrokenLetter(brief) ? 'YES (wrong)' : 'none'}`)
  console.log(`newest opening shown to the writer: "${recentHooks[recentHooks.length - 1] || '(none)'}"`)
  console.log(`mode "${request.mode}", writing rules ${request.rules.length} characters, reviewer's checks ${request.review_rules.length} characters; the story comes with ${slot.topic!.facts?.length || 0} facts`)
  let good = await run('as the site sends it now', { ...request })

  if (has('--direct')) {
    const started = Date.now()
    const { result } = await writeDirect(request.topic, brief, references)
    console.log(`\nwritten by the website itself (the path used when the agent service does not answer): ${Math.round((Date.now() - started) / 1000)} s, ${result.text.length} characters, review "${result.review.verdict}"`)
    show(result.text)
    if (result.review.notes.length) console.log(`    review notes: ${result.review.notes.slice(0, 4).join(' | ').slice(0, 600)}`)
    good = good && result.text.length > 120 && !selfTalk(result.text)
  }

  if (has('--old')) {
    // The request as it was built until 13 November 2026: openings cut through a letter
    const oldBrief = `${brief.split('\n\n')[0]}\nOpening line: must not resemble these recent openings:\n- ${recentHooks.slice(-15).join('\n- ')}\n- half a letter: \ud835 end`
    console.log(`\nold-style brief: ${oldBrief.length} characters, half letters: ${hasBrokenLetter(oldBrief) ? 'yes (as in production on 12 and 13 November)' : 'none'}`)
    good = (await run('as the site sent it before the fix', { topic: slot.topic!.title, brief: oldBrief, references, mode: 'post' }, true)) && good
  }
  console.log(good ? '\nALL OK' : '\nNOT OK')
  process.exit(good ? 0 : 1)
}
main().catch((e) => { console.error(String(e?.message || e)); process.exit(1) })
