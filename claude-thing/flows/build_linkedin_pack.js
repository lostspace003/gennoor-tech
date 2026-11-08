/* Builds the Claude cert video series from flows/linkedin/<slug>/<id>.json (post copy) + out/<key>-<id>.mp4:
   1. src/data/cert-video-series.json: one post a day at 10:00 IST, courses in random order, never the same course on
      two consecutive days, each course in story order (trailer first). Published by src/lib/video-series.ts.
   2. A local pack: <Desktop>/Claude Certification Videos/<CODE> - <course>/<NN> - <topic>/{<topic>.mp4, linkedin.md}
   Run: node claude-thing/flows/build_linkedin_pack.js [--start YYYY-MM-DD] [--seed N] [--no-pack]
   Re-running changes the schedule: only do that before the series starts (or pass the same --start/--seed). */
const fs = require('fs');
const path = require('path');
const os = require('os');

const ROOT = __dirname;
const REPO = path.resolve(ROOT, '..', '..');
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : d; };
const START = arg('--start', '2026-11-09');
const SEED = Number(arg('--seed', 20261109));
const PACK_CLEAN = !argv.includes('--no-pack');
const TIME = '10:00';
const PACK = path.join(os.homedir(), 'Desktop', 'Claude Certification Videos');
const COURSES = {
  'associate-foundations': { key: 'ccasf', code: 'CCAS-F', name: 'Claude Certified Associate - Foundations' },
  'developer-foundations': { key: 'ccdvf', code: 'CCDV-F', name: 'Claude Certified Developer - Foundations' },
  'architect-foundations': { key: 'ccarf', code: 'CCAR-F', name: 'Claude Certified Architect - Foundations' },
  'architect-professional': { key: 'ccarp', code: 'CCAR-P', name: 'Claude Certified Architect - Professional' },
};

let rnd = SEED >>> 0;
const rand = () => { rnd = (rnd * 1664525 + 1013904223) >>> 0; return rnd / 2 ** 32; };
const safe = s => String(s).replace(/[\\/:*?"<>|]/g, '').replace(/\s+/g, ' ').trim();
const order = id => (id === 'trailer' ? 0 : Number(id.replace(/\D/g, '')));

// queues per course, story order
const queues = {};
for (const [slug, c] of Object.entries(COURSES)) {
  const dir = path.join(ROOT, 'linkedin', slug);
  queues[slug] = fs.readdirSync(dir).filter(f => f.endsWith('.json')).map(f => f.replace('.json', '')).sort((a, b) => order(a) - order(b)).map(id => {
    const p = JSON.parse(fs.readFileSync(path.join(dir, id + '.json'), 'utf8'));
    const spec = JSON.parse(fs.readFileSync(path.join(ROOT, 'specs', slug, id + '.json'), 'utf8'));
    const url = `https://gennoor.com/claude/certifications/${slug}`;
    const tags = (p.hashtags || []).join(' ');
    const bullets = (p.bullets || []).map(b => '▪ ' + b.trim()).join('\n');
    const text = `${p.hook.trim()}\n\n${bullets}\n\n${p.cta.trim()}\n👉 ${url}\n\n${tags}`;
    const comment = `📘 Full ${c.code} prep course, chapter by chapter + practice exam: ${url}`;
    return { id: `${c.key}-${id}`, chapter: id, slug, code: c.code, course: c.name, topic: p.topic, title: spec.title, hook: p.hook, hashtags: p.hashtags, text, comment, url };
  });
}

// weighted random course per day, never the previous day's course
const items = [];
let prev = null, day = new Date(START + 'T00:00:00Z');
while (Object.values(queues).some(q => q.length)) {
  const pool = Object.keys(queues).filter(s => queues[s].length && s !== prev);
  if (!pool.length) throw new Error('cannot avoid a repeat: ' + JSON.stringify(Object.fromEntries(Object.entries(queues).map(([k, v]) => [k, v.length]))));
  // the course with the most left must not be starved into a forced repeat at the end
  const max = Math.max(...pool.map(s => queues[s].length));
  const rest = Object.values(queues).reduce((n, q) => n + q.length, 0);
  const must = pool.find(s => queues[s].length === max && max * 2 - 1 >= rest);
  let pick = must;
  if (!pick) { const w = pool.map(s => queues[s].length), tot = w.reduce((a, b) => a + b, 0); let r = rand() * tot; pick = pool.find((s, i) => (r -= w[i]) < 0) || pool[pool.length - 1]; }
  const it = queues[pick].shift();
  items.push({ ...it, date: day.toISOString().slice(0, 10), time: TIME });
  prev = pick; day = new Date(day.getTime() + 86400000);
}
for (let i = 1; i < items.length; i++) if (items[i].slug === items[i - 1].slug) throw new Error('repeat on ' + items[i].date);

const site = items.map(({ id, date, time, slug, code, course, topic, title, text, comment, url }) => ({ id, date, time, slug, code, course, topic, title, text, comment, url }));
fs.writeFileSync(path.join(REPO, 'src', 'data', 'cert-video-series.json'), JSON.stringify({ tz: 'Asia/Kolkata', start: START, seed: SEED, items: site }, null, 1));
console.log(`schedule: ${items.length} posts, ${items[0].date} → ${items[items.length - 1].date} at ${TIME} IST`);

if (PACK_CLEAN) {
  fs.rmSync(PACK, { recursive: true, force: true });
  for (const it of items) {
    const c = COURSES[it.slug];
    const n = it.chapter === 'trailer' ? '00' : String(order(it.chapter)).padStart(2, '0');
    const dir = path.join(PACK, `${c.code} - ${c.name}`, `${n} - ${safe(it.topic)}`);
    fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(path.join(ROOT, 'out', it.id + '.mp4'), path.join(dir, `${safe(it.topic)}.mp4`));
    const md = `# ${it.topic}\n\n**${c.code} · ${c.name}**  \nVideo: \`${safe(it.topic)}.mp4\` (${it.title})  \nScheduled: ${it.date} at ${TIME} IST (company page + profile)\n\n## Hook\n\n${it.hook}\n\n## LinkedIn post (copy as is)\n\n${it.text}\n\n## First comment (posted right after the video)\n\n${it.comment}\n\n## Course link\n\n${it.url}\n\n## Hashtags\n\n${it.hashtags.join(' ')}\n`;
    fs.writeFileSync(path.join(dir, 'linkedin.md'), md);
  }
  const lines = items.map(i => `| ${i.date} | ${i.code} | ${i.topic} |`).join('\n');
  fs.writeFileSync(path.join(PACK, 'SCHEDULE.md'), `# Posting schedule (10:00 IST, company page + profile)\n\n| Date | Course | Topic |\n|---|---|---|\n${lines}\n`);
  console.log('pack: ' + PACK);
}
