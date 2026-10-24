import { formatTranscript, pairText, plainText, buildPdf, pdfSafe } from '../src/lib/chat-export'
import { writeFileSync } from 'fs'

const msgs = [
  { role: 'learner' as const, text: 'What will I build?', at: '2026-10-24T14:05:00' },
  { role: 'assistant' as const, text: '**You build** an agent.\n- Step one\n- See [the course](https://gennoor.com/studio/ai-103)\n```py\nprint("hi")\n```', at: '2026-10-24T14:05:20' },
  { role: 'learner' as const, text: 'Thanks', at: '2026-10-24T14:06:00' },
  { role: 'assistant' as const, text: 'You are welcome — “quotes” → done', at: '2026-10-24T14:06:10' },
]
let fail = 0
const ok = (n: string, c: boolean) => { if (!c) { fail++; console.log('FAIL', n) } else console.log('ok  ', n) }
const t = formatTranscript(msgs, { courseTitle: 'AI-103', now: new Date('2026-10-24T15:00:00') })
ok('header course', t.includes('Course: AI-103'))
ok('timestamp question', t.includes('[24 Oct 2026, 14:05] You: What will I build?'))
ok('markdown stripped', t.includes('You build an agent.') && !t.includes('**'))
ok('link kept', t.includes('the course (https://gennoor.com/studio/ai-103)'))
ok('code kept', t.includes('print("hi")') && !t.includes('```'))
const p = pairText(msgs, 3)
ok('pair has question and answer', p.includes('You: Thanks') && p.includes('Assistant: You are welcome') && !p.includes('What will I build'))
ok('safe chars', pdfSafe('a—b→c中') === 'a-b>c?')
const pdf = buildPdf(t + '\n' + 'long '.repeat(2000), 'x')
ok('pdf header and footer', pdf.startsWith('%PDF-1.4') && pdf.trimEnd().endsWith('%%EOF'))
ok('pdf has several pages', (pdf.match(/\/Type \/Page /g) || []).length > 1)
writeFileSync(process.argv[2] || 'chat-export-test.pdf', Buffer.from(pdf, 'latin1'))
console.log(plainText('## Title\n**b** `c`').replace(/\n/g, '|'))
process.exit(fail ? 1 : 0)
