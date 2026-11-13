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
import { HOOK_RULES, buildBrief, echoedHook, firstLine } from '@/lib/autopilot/variety'

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

console.log(failed ? `\n${failed} CHECK(S) FAILED` : '\nALL OK')
process.exit(failed ? 1 : 0)
