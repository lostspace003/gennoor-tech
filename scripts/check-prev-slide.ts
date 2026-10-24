// npx tsx scripts/check-prev-slide.ts
import { prevSlideStartIdx } from '../src/components/academy/ChapterAudioControls'

// cues: slide 1 start, slide 2 start + 2 bullets, slide 3 start + 1 bullet
const cues = [
  { slide: 1 }, { slide: 2 }, { slide: 2, step: 1 }, { slide: 2, step: 2 }, { slide: 3 }, { slide: 3, step: 1 },
]
const cases: Array<[string, number, number]> = [
  ['slide 3 mid-slide -> slide 2 start', 5, 1],
  ['slide 3 start -> slide 2 start', 4, 1],
  ['slide 2 mid-slide -> slide 1 start', 3, 0],
  ['slide 2 start -> slide 1 start', 1, 0],
  ['slide 1 start -> stays (restart)', 0, 0],
]
let bad = 0
for (const [name, cur, want] of cases) {
  const got = prevSlideStartIdx(cues, cur)
  const ok = got === want
  if (!ok) bad++
  console.log(ok ? 'ok  ' : 'FAIL', name, '->', got)
}
process.exit(bad ? 1 : 0)
