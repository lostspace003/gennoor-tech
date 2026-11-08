/* Renders every flow spec to MP4 (page) and a poster JPG, frame by frame through headless Chrome.
   When the flow has voiced narration (voice/_work/<key>-<id>/voice/s<n>.wav, from voice_kaggle.py) the cut is narrated:
   each section opens with LEAD ms of quiet, then motion and voice start together, and the section holds until the
   voice ends; the voice track is muxed into the MP4 (the player starts it muted).
   Run: node claude-thing/flows/render.js [slug/id ...] [--force]
   Output: claude-thing/flows/out/<key>-<id>.{mp4,jpg} and claude-thing/flows/manifest.json */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { execFileSync } = require('child_process');
const puppeteer = require('puppeteer-core');

const ROOT = __dirname;
const SPECS = path.join(ROOT, 'specs');
const OUT = path.join(ROOT, 'out');
const MANIFEST = path.join(ROOT, 'manifest.json');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg';
const FPS = 30, W = 1280, H = 720, PORT = 3098, PARALLEL = Number(process.env.FLOW_PARALLEL || 3), LEAD = 1500;
const VOICE = path.join(ROOT, 'voice', '_work');
const COURSES = {
  'associate-foundations': { key: 'ccasf', code: 'CCAS-F', accent: '#c4713c' },
  'developer-foundations': { key: 'ccdvf', code: 'CCDV-F', accent: '#3f6fb8' },
  'architect-foundations': { key: 'ccarf', code: 'CCAR-F', accent: '#3f9c8f' },
  'architect-professional': { key: 'ccarp', code: 'CCAR-P', accent: '#8068c9' },
};

function serve() {
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml' };
  return new Promise(resolve => {
    const srv = http.createServer((req, res) => {
      const file = path.normalize(path.join(ROOT, decodeURIComponent(req.url.split('?')[0])));
      if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    }).listen(PORT, () => resolve(srv));
  });
}

// the voiced steps of a flow, or null when any step is missing (then the flow renders silent)
function voiceFor(out, n) {
  const mf = path.join(VOICE, out, 'voice', 'manifest.json');
  if (!fs.existsSync(mf)) return null;
  const man = JSON.parse(fs.readFileSync(mf, 'utf8'));
  const steps = [];
  for (let i = 1; i <= n; i++) {
    const m = man['s' + i], wav = path.join(VOICE, out, 'voice', 's' + i + '.wav');
    if (!m || !fs.existsSync(wav)) return null;
    steps.push({ wav, ms: Math.round(m.seconds * 1000), say: m.say || m.text });
  }
  return steps;
}

function listJobs(filter) {
  const jobs = [];
  for (const slug of Object.keys(COURSES)) {
    const dir = path.join(SPECS, slug);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) {
      const id = f.replace('.json', '');
      const name = slug + '/' + id;
      if (filter.length && !filter.includes(name)) continue;
      const out = COURSES[slug].key + '-' + id;
      const spec = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      jobs.push({ slug, id, name, out, spec, voice: voiceFor(out, spec.steps.length) });
    }
  }
  return jobs;
}

async function renderOne(browser, job, manifest) {
  const { out, spec, slug } = job;
  const base = path.join(OUT, out);
  const framesDir = path.join(OUT, 'frames', out);
  fs.mkdirSync(framesDir, { recursive: true });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(`http://localhost:${PORT}/engine/flow.html`, { waitUntil: 'load' });
  const full = Object.assign({}, spec, { accent: COURSES[slug].accent, code: COURSES[slug].code });
  const timing = job.voice ? { lead: LEAD, speech: job.voice.map(v => v.ms) } : null;
  const { duration, sections } = await page.evaluate((sp, tm) => { document.body.classList.add('render'); window.Flow.load(sp, tm); return { duration: window.Flow.duration, sections: window.Flow.sections }; }, full, timing);
  // let the logo image load before the first frame
  await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
  const n = Math.ceil(duration / 1000 * FPS);
  const t0 = Date.now();
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.Flow.seek(t), i * 1000 / FPS);
    await page.screenshot({ path: path.join(framesDir, String(i).padStart(5, '0') + '.jpg'), type: 'jpeg', quality: 92, clip: { x: 0, y: 0, width: W, height: H }, optimizeForSpeed: true });
  }
  // poster: the completed picture (end of the last step, before the hold runs out)
  await page.evaluate(t => window.Flow.seek(t), duration - 700);
  await page.screenshot({ path: base + '.jpg', type: 'jpeg', quality: 86, clip: { x: 0, y: 0, width: W, height: H } });
  await page.close();
  const capMs = Date.now() - t0;
  const pattern = path.join(framesDir, '%05d.jpg');
  const video = ['-c:v', 'libx264', '-preset', 'medium', '-crf', '22', '-pix_fmt', 'yuv420p', '-g', String(FPS), '-movflags', '+faststart'];
  if (job.voice) {
    // each step's voice starts LEAD ms into its section; the track is padded to the full video length
    const ins = [], parts = [];
    job.voice.forEach((v, i) => { ins.push('-i', v.wav); const d = sections[i] + LEAD; parts.push(`[${i + 1}:a]aresample=48000,adelay=${d}:all=1[a${i}]`); });
    const mix = parts.join(';') + ';' + job.voice.map((_, i) => `[a${i}]`).join('') + `amix=inputs=${job.voice.length}:normalize=0,apad,atrim=0:${(duration / 1000).toFixed(3)}[aout]`;
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', pattern, ...ins, '-filter_complex', mix, '-map', '0:v', '-map', '[aout]', ...video, '-c:a', 'aac', '-b:a', '128k', '-ac', '1', base + '.mp4']);
  } else {
    execFileSync(FFMPEG, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', pattern, ...video, base + '.mp4']);
  }
  fs.rmSync(framesDir, { recursive: true, force: true });
  const size = f => fs.statSync(f).size;
  manifest[out] = { slug, id: job.id, title: spec.title, kicker: spec.kicker, duration: Math.round(duration), steps: spec.steps.length, sections, narrated: !!job.voice, mp4: size(base + '.mp4'), poster: size(base + '.jpg'), renderedAt: new Date().toISOString() };
  console.log(`${out}: ${(duration / 1000).toFixed(1)}s${job.voice ? ' narrated' : ''}, ${n} frames in ${(capMs / 1000).toFixed(0)}s, mp4 ${(manifest[out].mp4 / 1024).toFixed(0)}KB`);
}

(async () => {
  const argv = process.argv.slice(2);
  const force = argv.includes('--force');
  const filter = argv.filter(a => !a.startsWith('--'));
  fs.mkdirSync(OUT, { recursive: true });
  const manifest = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
  let jobs = listJobs(filter);
  if (!force) jobs = jobs.filter(j => !(manifest[j.out] && fs.existsSync(path.join(OUT, j.out + '.mp4')) && manifest[j.out].specHash === jobHash(j)));
  jobs.forEach(j => { j.hash = jobHash(j); });
  console.log(jobs.length + ' flows to render');
  if (!jobs.length) return;
  const srv = await serve();
  // one browser per worker: screenshots of a background tab can hang in headless Chrome
  const launch = () => puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 90000, args: ['--hide-scrollbars', '--force-device-scale-factor=1', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
  let next = 0, failures = 0;
  async function worker() {
    let browser = await launch();
    while (next < jobs.length) {
      const job = jobs[next++];
      let ok = false;
      for (let attempt = 1; attempt <= 2 && !ok; attempt++) {
        try { await renderOne(browser, job, manifest); manifest[job.out].specHash = job.hash; ok = true; }
        catch (e) {
          console.error((attempt === 2 ? 'FAILED ' : 'retrying ') + job.name + ': ' + String(e.message).split('\n')[0]);
          try { await browser.close(); } catch (_) { /* already gone */ }
          browser = await launch();
        }
      }
      if (!ok) failures++;
      fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
    }
    await browser.close();
  }
  await Promise.all(Array.from({ length: Math.min(PARALLEL, jobs.length) }, worker));
  srv.close();
  console.log(failures ? 'FAILURES: ' + failures : 'ALL FLOWS RENDERED');
  process.exit(failures ? 1 : 0);
})();

function jobHash(j) { return hash({ spec: j.spec, voice: j.voice && j.voice.map(v => [v.ms, v.say]), lead: j.voice ? LEAD : 0 }); }
function hash(obj) { const s = JSON.stringify(obj); let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return (h >>> 0).toString(16); }
