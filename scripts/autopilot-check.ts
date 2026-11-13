/**
 * The checks that would have caught the autopilot failure of 12 and 13 November 2026, when no post could be
 * written for two days: the list of recent opening lines (kept in Unicode bold, where one letter is two units)
 * was cut in the middle of a letter, and the request that carried it was refused.
 *
 *   npx tsx scripts/autopilot-check.ts          must end with ALL OK
 *
 * It reads no secret and calls nothing: it only runs the pure functions the autopilot uses to build what it sends.
 * Run it before every pull request that touches src/lib/autopilot, src/lib/safe-text.ts or the writing rules.
 */
import { cut, hasBrokenLetter, safeJson, wellFormed } from '@/lib/safe-text'
import { toBold as boldText } from '@/lib/linkedin-format'
import { HOOK_RULES, PILLARS, POST_FORMATS, buildBrief, echoedHook, firstLine, formatOf, freshEnough, pillarOf, pillarsFor } from '@/lib/autopilot/variety'
import { READER_CHECK, articleRules, postRules, selfTalk } from '@/lib/writing-rules'

let failed = 0
const ok = (name: string, pass: boolean, detail = '') => { console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${detail ? `  (${detail})` : ''}`); if (!pass) failed++ }

// ---- 1. Cutting never leaves half a letter
const bold = boldText('The most important update this week is not a new benchmark, it is where the model can run 123')
let halves = 0
for (let n = 1; n <= bold.length; n++) if (hasBrokenLetter(cut(bold, n))) halves++
ok('cut() at every length of a bold line leaves no half letter', halves === 0, `${bold.length} lengths tried`)
ok('cut() keeps a short text as it is', cut('plain text', 200) === 'plain text')
ok('a plain slice of the same line DOES break it (the old behaviour)', Array.from({ length: bold.length }, (_, n) => bold.slice(0, n + 1)).some(hasBrokenLetter))

// ---- 2. The opening line of a published post comes back in plain letters
const post = `${boldText('AI governance is no longer a policy document problem.')}\n\nIt is a data collection problem.\n\n#AIGovernance`
const opening = firstLine(post)
ok('firstLine() turns bold letters into plain ones', opening === 'AI governance is no longer a policy document problem.', opening)
const long = `${boldText('word '.repeat(80))}\nsecond line`
ok('firstLine() of a very long bold line is whole and at most 200', !hasBrokenLetter(firstLine(long)) && firstLine(long).length <= 200)

// ---- 3. A repeated opening is caught even though the earlier one was published in bold
ok('echoedHook() sees a plain opening that repeats a bold one', echoedHook('AI governance is no longer a policy document problem. Here is why.', [firstLine(post)]) !== null)
ok('echoedHook() lets a different opening through', echoedHook('Three checks before you give an AI agent access to email.', [firstLine(post)]) === null)

// ---- 4. The brief always fits, is whole, and keeps what matters
const openings = Array.from({ length: 30 }, (_, i) => (i % 2 ? bold.slice(0, 199) : `Opening number ${i} 💡 ${'x'.repeat(260)}`))
openings.push('THE NEWEST OPENING')
const rules = 'RULES-START ' + 'Write plainly. '.repeat(70) + ' RULES-END'
const notes = ['The opening line repeats a recent post. Open with a different hook.', 'n'.repeat(900), bold.slice(0, 77)]
for (const max of [2000, 6000, 12000]) {
  const b = buildBrief({ rules, format: 'Format: Real use case. The problem, what they built, the result.', weekend: 'Calmer and more useful.', avoid: ['politics', 'religion'], notes, openings }, max)
  ok(`buildBrief() fits in ${max}`, b.length <= max, `${b.length} characters`)
  ok(`buildBrief(${max}) holds no half letter`, !hasBrokenLetter(b))
  ok(`buildBrief(${max}) keeps the rules, the format and the fixes`, b.includes('RULES-START') && b.includes('RULES-END') && b.includes('Format: Real use case') && b.includes('Fix these problems') && b.includes('Never mention: politics; religion.'))
  if (max >= 6000) ok(`buildBrief(${max}) shows the newest opening`, b.includes('THE NEWEST OPENING') && b.includes(HOOK_RULES.slice(0, 40)))
}
ok('buildBrief() with no openings and no notes is just the rules', buildBrief({ rules: 'Only rules.' }, 6000) === 'Only rules.')

// ---- 5. A request body is always readable by a strict JSON reader
const body = safeJson({ topic: 'T', brief: `half ${bold.slice(0, 5)} letter`, list: [bold.slice(1, 4)], nested: { a: '\ud835' } })
ok('safeJson() writes no escaped half letter', !/\\ud[89a-f][0-9a-f]{2}/i.test(body), body.slice(0, 60))
ok('safeJson() output reads back', (() => { try { return typeof JSON.parse(body).brief === 'string' } catch { return false } })())
ok('safeJson() leaves whole letters alone', JSON.parse(safeJson({ t: `${bold} 💡` })).t === `${bold} 💡`)
ok('wellFormed() is the identity on ordinary text', wellFormed('Ordinary text, ₹499, café') === 'Ordinary text, ₹499, café')

// ---- 6. The day's streams: the top story first, the debate for the poll, the rest taking turns
const DAY = [{ kind: 'post' }, { kind: 'poll' }, { kind: 'post' }, { kind: 'post' }]
const week = ['2026-11-15', '2026-11-16', '2026-11-17', '2026-11-18', '2026-11-19', '2026-11-20', '2026-11-21'].map((d) => pillarsFor(d, DAY)) // Sunday to Saturday
ok('every day opens with the top story and polls on the debate', week.every((p) => p[0] === 'top-story' && p[1] === 'debate'))
ok('every stream named for a slot exists and has formats that exist', week.flat().every((k) => { const p = pillarOf(k); return !!p && p.formats.every((f) => !!formatOf(POST_FORMATS, f)) }))
ok('the afternoon and evening posts are not the same two streams every day', new Set(week.map((p) => `${p[2]}+${p[3]}`)).size >= 3, [...new Set(week.map((p) => `${p[2]}+${p[3]}`))].join(', '))
ok('Microsoft, the core, appears on at least five days of seven', week.filter((p) => p.includes('microsoft')).length >= 5)
ok('a day with five slots still gets a stream for each', pillarsFor('2026-11-16', [...DAY, { kind: 'post' }]).every(Boolean))
ok('only the top story is a news stream', PILLARS.filter((p) => p.news).map((p) => p.key).join() === 'top-story')

// ---- 7. Old news is dropped
const top = pillarOf('top-story'), useCase = pillarOf('use-case')
ok('a story of two days ago is still the top story', freshEnough({ date: '2026-11-11' }, top, '2026-11-13'))
ok('a story of five days ago is not', !freshEnough({ date: '2026-11-08' }, top, '2026-11-13'))
ok('a top story with no date is dropped', !freshEnough({}, top, '2026-11-13'))
ok('a use case of a month ago is kept, and one with no date too', freshEnough({ date: '2026-10-14' }, useCase, '2026-11-13') && freshEnough({}, useCase, '2026-11-13'))
ok('a use case of three months ago is dropped', !freshEnough({ date: '2026-08-10' }, useCase, '2026-11-13'))
ok('a date one day ahead is a time zone, a date next week is a mistake', freshEnough({ date: '2026-11-14' }, top, '2026-11-13') && !freshEnough({ date: '2026-11-20' }, top, '2026-11-13'))

// ---- 8. The writing rules reach every writer, and an article that talks about itself is caught
const forPost = postRules(), forArticle = articleRules()
ok('the post rules name the reader, plain language, the craft and what is always true', ['WHO READS THIS', 'PLAIN LANGUAGE', 'HOW TO WRITE THE POST', 'ALWAYS TRUE'].every((h) => forPost.includes(h)))
ok('the article rules do the same', ['WHO READS THIS', 'PLAIN LANGUAGE', 'HOW TO WRITE THE ARTICLE', 'ALWAYS TRUE'].every((h) => forArticle.includes(h)))
ok('the rules fit in what the service accepts (20,000 and 6,000)', forPost.length < 20_000 && forArticle.length < 20_000 && READER_CHECK.length < 6_000, `${forPost.length}, ${forArticle.length}, ${READER_CHECK.length}`)
ok('the reader is a manager who is not technical', /NOT technical/.test(forPost) && /not technical/.test(READER_CHECK))
// The sentences below were live on the site until 13 November 2026.
const LEAKS = [
  '<h2>What changed in this revision</h2>',
  'The source set provided for this article does not support the originally cited model names.',
  'Based on the reviewer’s notes and the materials provided, those details could not be verified from an official source.',
  'The earlier draft stated residency implications too directly.',
  'Several source links and date-specific claims in the earlier draft were not safely verifiable for review. So this revised version keeps the core argument.',
  'Not confirmed by the supplied material: any direct claim that OpenAI itself launched into AWS Marketplace.',
  'The provided source set is strong on official announcements, but it leaves some practical questions open.',
  'This article treats the partnership as a strategic signal from limited notes, not as a fully sourced report.',
  'Without primary source links or formal announcement materials in the review package, it is important to avoid implying verified details.',
  // from the first real article written with the new rules, 13 November 2026
  'There is no confirmed full global restoration time in the material provided. The pages reviewed do not say whether every customer is back.',
]
ok('every one of the leaked sentences is caught', LEAKS.every((t) => selfTalk(t) !== null), LEAKS.filter((t) => !selfTalk(t)).map((t) => t.slice(0, 40)).join(' | ') || 'all caught')
const CLEAN = [
  '<p>Anthropic announced Claude Fable 5.2 on November 9, 2026. Anthropic says it is faster than the version before it.</p>',
  '<p>A human reviewer still approves each loan. The earlier version of the product could not do this.</p>',
  '<p>Read the vendor’s release notes, then test a small set of real tasks. The official announcements leave some questions open.</p>',
  '<p>Researchers reviewed 2,000 support tickets. Their notes show where the assistant saved time.</p>',
  '<p>Microsoft has not said when the service was fully restored. The pages of its status site listed the affected products.</p>',
]
ok('ordinary sentences are not mistaken for it', CLEAN.every((t) => selfTalk(t) === null), CLEAN.filter((t) => selfTalk(t)).map((t) => selfTalk(t)).join(' | ') || 'none flagged')

console.log(failed ? `\n${failed} CHECK(S) FAILED` : '\nALL OK')
process.exit(failed ? 1 : 0)
