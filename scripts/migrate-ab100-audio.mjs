#!/usr/bin/env node
/*
 * Migrate AB-100 from legacy per-slide MP3s to the unified chapterAudio
 * pattern WITHOUT regenerating narration:
 *
 *   1. Download each chapter's deck HTML + per-slide MP3s from blob.
 *   2. Concatenate slide MP3s (slide-01..slide-NN — the legacy player was
 *      1-based; slide-00.mp3 was never requested) into one chapter MP3.
 *   3. Emit cues.json — slide cues at exact byte-accurate boundaries, step
 *      cues estimated inside each slide with the same heuristic the legacy
 *      AudioPlayer used (intro = min(8%, 3s), then equal time per step).
 *   4. Inject a gennoor-academy:cue listener into the deck HTML so it follows
 *      the parent ChapterAudioControls protocol.
 *   5. Stage everything under tmp/academy-build/ab-100/ for
 *      upload-chapter-assets.mjs.
 *
 * Usage: node scripts/migrate-ab100-audio.mjs
 */

import { config } from 'dotenv'
import { BlobServiceClient } from '@azure/storage-blob'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import mp3Duration from 'mp3-duration'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_ROOT = path.resolve(__dirname, '..')
config({ path: path.join(PROJECT_ROOT, '.env.local') })

const CONN = process.env.AZURE_STORAGE_CONNECTION_STRING
if (!CONN) { console.error('Missing AZURE_STORAGE_CONNECTION_STRING'); process.exit(1) }

const SLUG = 'ab-100'
const CONTAINER = 'website-content'
const OUT_ROOT = path.join(PROJECT_ROOT, 'tmp', 'academy-build', SLUG)

const CHAPTERS = [
  { id: 'chapter-00', html: 'chapter-00-introduction.html' },
  { id: 'chapter-01', html: 'chapter-01-introduction.html' },
  { id: 'chapter-02', html: 'chapter-02-analyze.html' },
  { id: 'chapter-03', html: 'chapter-03-strategy.html' },
  { id: 'chapter-04', html: 'chapter-04-roi.html' },
  { id: 'chapter-05', html: 'chapter-05-design.html' },
  { id: 'chapter-06', html: 'chapter-06-extensibility.html' },
  { id: 'chapter-07', html: 'chapter-07-orchestrate.html' },
  { id: 'chapter-08', html: 'chapter-08-monitor.html' },
  { id: 'chapter-09', html: 'chapter-09-testing.html' },
  { id: 'chapter-10', html: 'chapter-10-alm.html' },
  { id: 'chapter-11', html: 'chapter-11-governance.html' },
  { id: 'chapter-12', html: 'chapter-12-revision.html' },
]

// Same pacing heuristic the legacy AudioPlayer applied at runtime.
const stepTiming = (dur, steps) => {
  const intro = Math.min(dur * 0.08, 3)
  return { intro, per: (dur - intro) / steps }
}

const CUE_LISTENER = `
<script>
/* gennoor-academy unified-player adapter (injected by migrate-ab100-audio) */
(function(){
  var slides = document.querySelectorAll('.slide');
  var counter = document.getElementById('counter');
  var progressFill = document.getElementById('progressFill');
  function applyState(slideNum, step){
    var idx = slideNum - 1;
    if (idx < 0 || idx >= slides.length) return;
    for (var i = 0; i < slides.length; i++) slides[i].classList.remove('active');
    var slide = slides[idx];
    slide.classList.add('active');
    slide.scrollTop = 0;
    var steps = slide.querySelectorAll('[data-step]');
    for (var j = 0; j < steps.length; j++) {
      if (j < step) steps[j].classList.add('revealed');
      else steps[j].classList.remove('revealed');
    }
    var pl = slide.querySelector('.process-line');
    if (pl) { if (step > 0) pl.classList.add('revealed'); else pl.classList.remove('revealed'); }
    if (counter) counter.textContent = slideNum + ' / ' + slides.length;
    if (progressFill) progressFill.style.width = (slideNum / slides.length * 100) + '%';
  }
  window.addEventListener('message', function(e){
    if (!e || !e.data || e.data.type !== 'gennoor-academy:cue') return;
    var s = e.data.slide;
    if (typeof s !== 'number') return;
    // userDriven jumps reveal the whole slide; timed cues reveal progressively.
    applyState(s, e.data.userDriven ? 9999 : (e.data.step || 0));
  });
})();
</script>
`

const service = BlobServiceClient.fromConnectionString(CONN)
const container = service.getContainerClient(CONTAINER)

async function downloadBuffer(blobPath) {
  const blob = container.getBlobClient(blobPath)
  return blob.downloadToBuffer()
}

const duration = (buf) => new Promise((res, rej) =>
  mp3Duration(buf, (err, d) => (err ? rej(err) : res(d))))

for (const ch of CHAPTERS) {
  const htmlPath = `courses/${SLUG}/chapters/${ch.html}`
  const html = (await downloadBuffer(htmlPath)).toString('utf8')

  if (html.includes('unified-player adapter')) {
    console.log(`• ${ch.id} — already migrated, skipping`)
    continue
  }

  // Slide blocks: positions of each top-level slide div, used to count
  // [data-step] occurrences per slide.
  const slideRe = /<(?:div|section)[^>]*class="slide[" ][^>]*>/g
  const starts = []
  let m
  while ((m = slideRe.exec(html)) !== null) starts.push(m.index)
  const totalSlides = starts.length
  if (totalSlides === 0) { console.error(`✗ ${ch.id}: no slides found`); process.exit(1) }

  const stepsPerSlide = starts.map((s, i) => {
    const block = html.slice(s, i + 1 < starts.length ? starts[i + 1] : html.length)
    return (block.match(/data-step/g) || []).length
  })

  // Download slide MP3s 01..NN and build cue list.
  const buffers = []
  const cues = []
  let t = 0
  for (let slide = 1; slide <= totalSlides; slide++) {
    const audioPath = `courses/${SLUG}/audio/${ch.id}/slide-${String(slide).padStart(2, '0')}.mp3`
    let buf
    try {
      buf = await downloadBuffer(audioPath)
    } catch {
      console.error(`✗ ${ch.id}: missing ${audioPath} (deck has ${totalSlides} slides)`)
      process.exit(1)
    }
    const dur = await duration(buf)
    cues.push({ at: Number(t.toFixed(2)), slide })
    const nSteps = stepsPerSlide[slide - 1]
    if (nSteps > 0) {
      const { intro, per } = stepTiming(dur, nSteps)
      for (let st = 1; st <= nSteps; st++) {
        cues.push({ at: Number((t + intro + (st - 1) * per).toFixed(2)), slide, step: st })
      }
    }
    buffers.push(buf)
    t += dur
  }

  const chapterMp3 = Buffer.concat(buffers)
  const audioDir = path.join(OUT_ROOT, 'audio', ch.id)
  await mkdir(audioDir, { recursive: true })
  await writeFile(path.join(audioDir, `${ch.id}.mp3`), chapterMp3)
  const mins = Math.floor(t / 60), secs = Math.round(t % 60)
  await writeFile(path.join(audioDir, 'cues.json'), JSON.stringify({
    cues,
    expectedDurationSeconds: Number(t.toFixed(2)),
    expectedDurationDisplay: `${mins}:${String(secs).padStart(2, '0')}`,
  }, null, 2))

  // Inject the cue listener just before </body>.
  const injected = html.includes('</body>')
    ? html.replace('</body>', `${CUE_LISTENER}</body>`)
    : html + CUE_LISTENER
  const chaptersDir = path.join(OUT_ROOT, 'chapters')
  await mkdir(chaptersDir, { recursive: true })
  await writeFile(path.join(chaptersDir, ch.html), injected, 'utf8')

  console.log(`✓ ${ch.id} · ${totalSlides} slides · ${cues.length} cues · ${mins}:${String(secs).padStart(2, '0')} · ${(chapterMp3.length / 1024 / 1024).toFixed(1)} MB`)
}

console.log('\n✓ AB-100 staged. Next: node scripts/upload-chapter-assets.mjs ab-100')
