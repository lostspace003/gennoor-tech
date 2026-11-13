/**
 * Has one article written for real, and saves nothing.
 *
 *   npx tsx --env-file=.env.local scripts/blog-live-check.ts            the top story of the day
 *   npx tsx --env-file=.env.local scripts/blog-live-check.ts blog       a topic found the way the daily blog finds it
 *
 * It searches now, reads up on the hottest story (the "dossier": a second search for this story only), sends the
 * real request to the agent team (POST /blog) and prints the title, the summary, the headings, the opening and
 * the review. No draft is saved, nothing is published and nothing is posted. It takes two to four minutes and
 * costs about what one article costs to write (well under one US dollar).
 *
 * Read what it prints as the reader would: a manager who is not technical. It must end with ALL OK, which means
 * an article came back, it is neither too short nor too long, and it does not talk about its own drafting.
 * Use it after changing the writing rules (src/lib/writing-rules.ts) or putting the agent service out again.
 */
import { loadState, researchIdeas } from '@/lib/autopilot/live'
import { localParts } from '@/lib/autopilot/time'
import { blogRequest } from '@/lib/blog-auto-live'
import { agentFetch } from '@/lib/social/agent-service'
import { selfTalk } from '@/lib/writing-rules'

const plain = (html: string) => html.replace(/<\/(p|h2|h3|li|ul|ol)>/g, '\n').replace(/<li[^>]*>/g, '  - ').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\n{3,}/g, '\n\n').trim()

async function main() {
  const s = await loadState()
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))
  const today = localParts(new Date(), s.config.tz).date
  const asBlog = process.argv[2] === 'blog'
  console.log(`searching now (${asBlog ? 'the daily blog\'s own search' : 'the top story'}), ${today} ...`)
  const ideas = await researchIdeas(asBlog
    ? { date: today, weekend: false, cfg: s.config, recent: s.history.slice(-60).map((h) => h.title), count: 5, blog: true }
    : { date: today, weekend: false, cfg: s.config, recent: [], pillar: 'top-story', count: 3 }, sleep)
  if (!ideas.length) throw new Error('The search found nothing recent enough.')
  for (const i of ideas) console.log(`  ${i.date || 'no date'}  heat ${i.heat ?? '-'}  ${i.title}`)
  const topic = ideas[0]

  console.log(`\nreading up on: ${topic.title} ...`)
  const request = await blogRequest(topic)
  const refs = String(request.references)
  console.log(`the writers receive ${refs.split('\n').filter((l) => l.startsWith('- ')).length} lines of facts, words to explain and sources (${refs.length} characters); rules ${String(request.rules).length} characters`)
  console.log(refs.split('\n').slice(0, 14).map((l) => `    | ${l.slice(0, 200)}`).join('\n'))

  const started = Date.now()
  const res = await agentFetch('/blog', request)
  if (!res.ok || !res.body) throw new Error(`The agent service answered ${res.status}: ${(await res.text().catch(() => '')).slice(0, 200)}`)
  const lines = (await res.text()).split('\n').filter(Boolean).map((l) => { try { return JSON.parse(l) } catch { return null } }).filter(Boolean)
  const error = lines.find((l) => l.type === 'error')
  const result = lines.find((l) => l.type === 'result')
  if (error || !result?.body) throw new Error(`No article came back: ${error?.message || 'empty result'}`)

  const text = plain(result.body)
  const words = text.split(/\s+/).length
  const headings = [...String(result.body).matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => m[1].replace(/<[^>]+>/g, ''))
  const leak = selfTalk(`${result.meta?.title || ''} ${result.meta?.excerpt || ''} ${result.meta?.tldr || ''} ${result.body}`)
  console.log(`\nan article came back in ${Math.round((Date.now() - started) / 1000)} s: ${words} words, ${headings.length} sections, review "${result.review?.verdict}"`)
  console.log(`title:   ${result.meta?.title}`)
  console.log(`excerpt: ${result.meta?.excerpt}`)
  console.log(`summary: ${result.meta?.tldr}`)
  console.log(`headings:\n${headings.map((h) => `    - ${h}`).join('\n')}`)
  console.log(`\nthe opening:\n${text.split('\n').filter(Boolean).slice(0, 12).map((l) => `    | ${l}`).join('\n')}`)
  if (result.review?.notes?.length) console.log(`\nreview notes: ${result.review.notes.slice(0, 5).join(' | ').slice(0, 900)}`)
  console.log(`\ntalks about its own drafting: ${leak ? `YES: "${leak}"` : 'no'}`)
  const good = words >= 800 && words <= 2100 && !leak && headings.length >= 4
  console.log(good ? '\nALL OK' : `\nNOT OK (${words} words, ${headings.length} sections${leak ? ', talks about itself' : ''})`)
  process.exit(good ? 0 : 1)
}
main().catch((e) => { console.error(String(e?.message || e)); process.exit(1) })
