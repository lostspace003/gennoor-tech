// Adds durationSec to every lecture in src/data/lms/<slug>.json by reading the
// end time of the last cue in its .vtt caption (within a few seconds of the
// video length).
//   node scripts/add-lms-durations.mjs <slug> <container-sas-url>
import fs from 'node:fs'
import { ContainerClient } from '@azure/storage-blob'

const [, , slug, sasUrl] = process.argv
const file = `src/data/lms/${slug}.json`
const course = JSON.parse(fs.readFileSync(file, 'utf8'))
const source = new ContainerClient(sasUrl.trim())

const toSec = t => {
  const p = t.split(':').map(Number)
  return p.length === 3 ? p[0] * 3600 + p[1] * 60 + p[2] : p[0] * 60 + p[1]
}
const items = course.sections.flatMap(s => s.items).filter(i => i.type === 'lecture' && i.caption)
let n = 0
const queue = [...items]
await Promise.all(Array.from({ length: 16 }, async () => {
  for (let it = queue.pop(); it; it = queue.pop()) {
    const txt = (await source.getBlobClient(it.caption).downloadToBuffer()).toString('utf8')
    const ends = [...txt.matchAll(/-->\s*([\d:.]+)/g)].map(m => toSec(m[1]))
    if (ends.length) { it.durationSec = Math.ceil(Math.max(...ends)); n++ }
  }
}))
fs.writeFileSync(file, JSON.stringify(course, null, 1))
const total = items.reduce((a, i) => a + (i.durationSec || 0), 0)
console.log(slug, `${n}/${items.length} durations`, (total / 3600).toFixed(1) + 'h')
