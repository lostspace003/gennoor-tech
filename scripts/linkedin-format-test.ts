import { formatForLinkedIn, toBold, toPlain, extractHashtags } from '../src/lib/linkedin-format'

let pass = 0, fail = 0
const ok = (c: boolean, n: string) => { c ? pass++ : (fail++, console.log('  FAIL:', n)); if (c) console.log('  ok  :', n) }

ok(toBold('AI 2026') === '𝗔𝗜 𝟮𝟬𝟮𝟲', 'ASCII letters and digits become Unicode bold')
ok(toPlain(toBold('Azure AI Foundry 5')) === 'Azure AI Foundry 5', 'bold converts back to plain text (for keyword screens)')
ok(toBold('café — naïve') === '𝗰𝗮𝗳é — 𝗻𝗮ï𝘃𝗲'.replace('𝗻𝗮ï𝘃𝗲', toBold('na') + 'ï' + toBold('ve')), 'accented characters and punctuation are left alone')

const raw = `**Agents are moving from demos to production** 🚀🔥

Most teams still treat them like chatbots. That is the gap.

- Governance first
* Observability second
• Cost control third

💡 The fix is boring and effective. 😀 Start with one narrow workflow.

#aiagents #AIAgents #AzureAI #Enterprise #MCP #Governance #Extra`
const f = formatForLinkedIn(raw)
ok(f.startsWith('𝗔𝗴𝗲𝗻𝘁𝘀'), 'the first line is bold')
ok(!f.includes('**'), 'no leftover asterisk markers')
ok(!/🚀|🔥|😀/u.test(f), 'shiny emojis are removed')
ok(f.includes('💡'), 'a professional symbol is kept')
ok((f.match(/▪ /g) || []).length === 3, 'all three bullet styles become one quiet bullet mark')
ok(f.trim().split('\n').pop()!.split(' ').length === 5 && f.trim().split('\n').pop()!.startsWith('#'), 'hashtags end up on the last line, capped at five')
ok(extractHashtags(f).filter(t => t.toLowerCase() === '#aiagents').length === 1, 'a repeated hashtag appears once')
ok(!/\n{3,}/.test(f), 'no more than one blank line between paragraphs')
ok(formatForLinkedIn(f) === f, 'formatting twice changes nothing (safe to run on every publish)')

const many = formatForLinkedIn('Intro 💡 a ⚙ b 🔒 c 📌 d 📊 e ✅ f 🎯 g\n\n→ Takeaway ◆ Label ✓ Done ↳ Next\n\nBody.')
ok((many.match(/\p{Extended_Pictographic}/gu) || []).length === 2 && many.includes('💡') && !/📌|📊|✅|🎯|🔒/u.test(many), 'only the light bulb and one plain symbol survive; coloured emojis are removed')
ok(['→', '◆', '✓', '↳'].every(c => many.includes(c)), 'plain typographic marks (arrow, diamond, tick, hook arrow) are always kept')
ok(formatForLinkedIn('Plain post with no tags.', { fallbackHashtags: ['azure ai', 'agents'] }).endsWith('#AzureAi #Agents') && formatForLinkedIn('Plain post.', { fallbackHashtags: ['AzureAI'] }).endsWith('#AzureAI'), 'a post with no hashtags gets the supplied ones, tidied into CamelCase')
const long = formatForLinkedIn('word '.repeat(1000) + '\n\n#AIAgents #Azure')
ok([...long].length <= 3000 && long.endsWith('#AIAgents #Azure'), 'a very long post is trimmed to LinkedIn\'s limit and keeps its hashtags')
ok(formatForLinkedIn('Read the full article: https://www.gennoor.com/resources/blog/x#section\n\n#AIAgents').includes('https://www.gennoor.com/resources/blog/x#section'), 'a link containing # is not mistaken for a hashtag')

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
