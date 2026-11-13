/**
 * Tries the autopilot's real request against the real agent service, without writing anything down.
 *
 *   npx tsx --env-file=.env.local scripts/autopilot-live-check.ts            the newest planned or held post
 *   npx tsx --env-file=.env.local scripts/autopilot-live-check.ts --old      also sends the request as the site
 *                                                                           built it before 13 November 2026
 *
 * It reads the autopilot's saved plan and the list of published posts, builds the notes exactly as the autopilot
 * does (src/lib/autopilot/live.ts, draftRequest), sends them to the service and prints what came back. It saves no
 * draft, changes no plan and posts nothing. It costs one run of the writers (a few US cents).
 * Use it after putting the agent service out again, and whenever the Autopilot page says "drafting failed".
 */
import { loadState, liveDeps, draftRequest } from '@/lib/autopilot/live'
import { agentFetch } from '@/lib/social/agent-service'
import { hasBrokenLetter } from '@/lib/safe-text'

async function run(label: string, body: { topic: string; brief: string; references: string; mode: string }, raw = false) {
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
  console.log(`${label}: a post came back in ${Math.round((Date.now() - started) / 1000)} s, ${String(result.text).length} characters, review "${result.review?.verdict}"`)
  console.log(String(result.text).split('\n').slice(0, 14).map((l) => `    | ${l}`).join('\n'))
  if (result.review?.notes?.length) console.log(`    review notes: ${result.review.notes.slice(0, 3).join(' | ').slice(0, 400)}`)
  return true
}

async function main() {
  const s = await loadState()
  const d = liveDeps()
  const slots = Object.keys(s.days).sort().flatMap((day) => s.days[day].slots).filter((sl) => sl.kind === 'post' && sl.topic)
  const slot = [...slots].reverse().find((sl) => sl.status === 'planned' || sl.status === 'held') || slots[slots.length - 1]
  if (!slot) throw new Error('The autopilot has no post planned to try.')
  const past = d.pastPosts ? await d.pastPosts().catch(() => []) : []
  const openings = [...s.history.map((h) => ({ at: h.at, hook: h.hook || '' })), ...past.map((p) => ({ at: p.at, hook: p.hook || '' }))].filter((x) => x.hook).sort((a, b) => a.at.localeCompare(b.at))
  const recentHooks = [...new Set(openings.map((x) => x.hook))].slice(-30)
  const { brief, references } = draftRequest({ slot, cfg: s.config, notes: [], recentHooks })
  console.log(`slot ${slot.id} (${slot.status}): "${slot.topic!.title}"`)
  console.log(`brief: ${brief.length} characters, ${recentHooks.length} recent openings known, half letters: ${hasBrokenLetter(brief) ? 'YES (wrong)' : 'none'}`)
  console.log(`newest opening shown to the writer: "${recentHooks[recentHooks.length - 1] || '(none)'}"`)
  let good = await run('as the site sends it now', { topic: slot.topic!.title, brief, references, mode: 'post' })

  if (process.argv.includes('--old')) {
    // The request as it was built until 13 November 2026: bold openings, cut at 200 units, oldest fifteen
    const oldHooks = [...s.history.map((h) => h.hook || ''), ...past.map((p: any) => String(p.rawHook || p.hook || ''))].filter(Boolean)
    const cutBold = past.map((p: any) => String(p.bold || '')).filter(Boolean)
    const hooks = (cutBold.length ? cutBold : oldHooks).slice(-15)
    const oldBrief = `${brief.split('\n\n')[0]}\nOpening line: must not resemble these recent openings:\n- ${hooks.join('\n- ')}\n- half a letter: \ud835 end`
    console.log(`\nold-style brief: ${oldBrief.length} characters, half letters: ${hasBrokenLetter(oldBrief) ? 'yes (as in production on 12 and 13 November)' : 'none'}`)
    good = (await run('as the site sent it before the fix', { topic: slot.topic!.title, brief: oldBrief, references, mode: 'post' }, true)) && good
  }
  console.log(good ? '\nALL OK' : '\nNOT OK')
  process.exit(good ? 0 : 1)
}
main().catch((e) => { console.error(String(e?.message || e)); process.exit(1) })
