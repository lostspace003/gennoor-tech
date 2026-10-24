// Quick check of the keyword helpers: node --experimental-strip-types scripts/check-keyword-core.ts
import { buildBrief, groupByPage, matchCourseQueries, toKeywordRows } from '../src/lib/gsc-keywords-core.ts'

const rows = toKeywordRows([
  { keys: ['azure ai agent course', 'https://gennoor.com/studio/ai-103'], clicks: 3, impressions: 220, ctr: 0.013, position: 11.4 },
  { keys: ['ai-103 exam preparation', 'https://gennoor.com/studio/ai-103'], clicks: 9, impressions: 140, ctr: 0.06, position: 6.2 },
  { keys: ['microsoft foundry agents tutorial', 'https://gennoor.com/'], clicks: 0, impressions: 60, ctr: 0, position: 15 },
  { keys: ['cooking pasta', 'https://gennoor.com/'], clicks: 0, impressions: 500, ctr: 0, position: 12 },
])
const m = matchCourseQueries(rows, 'ai-103', 'AI-103: Build and Ship AI Agents on Microsoft Azure', ['Foundry', 'Microsoft'])
const checks: [string, boolean][] = [
  ['matches the course queries and drops the unrelated one', m.length === 3 && !m.some(q => q.query === 'cooking pasta')],
  ['flags position 8 to 20 with demand as striking distance', m.find(q => q.query === 'azure ai agent course')?.strikingDistance === true],
  ['does not flag a query already near the top', m.find(q => q.query === 'ai-103 exam preparation')?.strikingDistance === false],
  ['groups by page', groupByPage(rows).length === 2],
]
const brief = buildBrief('AI-103: Build and Ship AI Agents on Microsoft Azure', 'Build AI apps and agents.', m)
checks.push(['brief has a title within 68 characters and some H2s', brief.suggestedTitle.length <= 68 && brief.h2.length > 0])
let ok = true
for (const [name, pass] of checks) {
  console.log(pass ? 'ok  ' : 'FAIL', name)
  if (!pass) ok = false
}
console.log(brief)
process.exit(ok ? 0 : 1)
