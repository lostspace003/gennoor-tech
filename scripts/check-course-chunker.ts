// npx tsx scripts/check-course-chunker.ts
import { chunkCues, chunkText, formatClock, htmlToPlain, parseVtt } from '../src/lib/course-chunker'

const vtt = `WEBVTT

00:00:01.000 --> 00:00:04.000
Welcome to the course.

00:00:04.500 --> 00:00:09.000
<v Jalal>Today we build a chat app.</v>

01:02:03.250 --> 01:02:06.000
Last line here.
`
const cues = parseVtt(vtt)
const long = Array.from({ length: 400 }, (_, i) => `This is sentence number ${i} about Foundry agents.`).join(' ')
const textChunks = chunkText(long)
const cueChunks = chunkCues(Array.from({ length: 300 }, (_, i) => ({ start: i * 5, text: `Cue ${i} talks about deploying a model and tools.` })))

const cases: Array<[string, boolean]> = [
  ['vtt: three cues', cues.length === 3],
  ['vtt: tags stripped', cues[1].text === 'Today we build a chat app.'],
  ['vtt: hour timestamps', Math.round(cues[2].start) === 3723],
  ['text: several chunks', textChunks.length > 5],
  ['text: no chunk much over 2000', textChunks.every(c => c.length <= 2100)],
  ['text: ends on sentence', textChunks.slice(0, -1).every(c => /[.?!]$/.test(c))],
  ['text: short text stays one chunk', chunkText('Short.').length === 1],
  ['text: empty gives none', chunkText('   ').length === 0],
  ['cues: chunks carry start seconds', cueChunks.every(c => typeof c.startSeconds === 'number')],
  ['cues: starts increase', cueChunks.every((c, i) => i === 0 || c.startSeconds! > cueChunks[i - 1].startSeconds!)],
  ['html: scripts removed', !htmlToPlain('<p>Hi</p><script>var x=1</script><style>a{}</style>').includes('var x')],
  ['html: text kept', htmlToPlain('<h1>Title</h1><p>Body &amp; more</p>') === 'Title\nBody & more'],
  ['clock', formatClock(754) === '12:34'],
]
let bad = 0
for (const [name, ok] of cases) { console.log(ok ? 'ok  ' : 'FAIL', name); if (!ok) bad++ }
console.log(`${cases.length - bad}/${cases.length} passed; ${textChunks.length} text chunks, ${cueChunks.length} cue chunks`)
process.exit(bad ? 1 : 0)
