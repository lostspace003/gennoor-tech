/* Builds one JSON file per Claude certification course for the Next.js course reader.
   Sources: claude-thing/guides/<slug>/ (chapters, animations, knowledge checks, code examples,
   practice questions) and claude-thing/hub/data.js (blueprint / decision matrix / code patterns).
   Optional enrichment: claude-thing/enrich/<slug>/<chapterId>.json (short label, icon, scene, teaser, takeaways).

   Output: public/cert-data/<slug>.json (full course) and src/data/claude-cert-meta.json (chapter lists).

   Run: node claude-thing/build_course_json.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const { listifyHtml, listifyText } = require('./listify');
const ROOT = path.join(__dirname, '..');
const GUIDES = {
  'associate-foundations': { key: 'ccasf', hub: 'ccas-f' },
  'developer-foundations': { key: 'ccdvf', hub: 'ccdv-f' },
  'architect-foundations': { key: 'ccarf', hub: 'ccar-f' },
  'architect-professional': { key: 'ccarp', hub: 'ccar-p' },
};
const OUT_DIR = path.join(ROOT, 'public', 'cert-data');
const META_OUT = path.join(ROOT, 'src', 'data', 'claude-cert-meta.json');

function loadGuide(slug) {
  const dir = path.join(__dirname, 'guides', slug);
  const ctx = { console };
  vm.createContext(ctx);
  ctx.window = ctx;
  const chapterFiles = fs.readdirSync(dir).filter(f => /^c\d+\.js$/.test(f)).sort((a, b) => +a.slice(1) - +b.slice(1));
  const files = ['anims.js', 'examples.js', 'helpers.js', 'ann.js', 'ann_out.js', 'kc.js', ...chapterFiles, 'questions.js'];
  for (const f of files) {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) continue;
    vm.runInContext(fs.readFileSync(p, 'utf8'), ctx, { filename: slug + '/' + f });
  }
  return ctx;
}

function loadHub() {
  const ctx = {};
  vm.createContext(ctx);
  ctx.window = ctx;
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'hub', 'data.js'), 'utf8'), ctx, { filename: 'hub/data.js' });
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'hub', 'banks.js'), 'utf8'), ctx, { filename: 'hub/banks.js' });
  return { data: ctx.EXAM_DATA, banks: ctx.CERT_BANKS };
}

/* ---------- question-number references -> concept names ---------- */
// "Q26" in prose meant "practice question 26". Learners are not helped by a number, so every
// reference becomes the concept that question tests (the bank's own `k` field).
function conceptReplacer(questions) {
  const concept = n => {
    const q = questions[n - 1];
    return q ? q.k : null;
  };
  const chip = n => {
    const k = concept(n);
    return k ? '<i class="qref" title="Tested in the practice exam under this concept">' + k + '</i>' : 'the practice question';
  };
  return function replace(text) {
    if (typeof text !== 'string' || !/Q#?\d/.test(text)) return text;
    let s = text;
    // "(Q13)" / "(Q30, Q31)" / "(Q5, Q48, and Q60)" / "(Q59/Q60)" -> "(concepts: A · B)"
    s = s.replace(/\(\s*(Q#?\d{1,3}(?:\s*(?:,|\/|and|&)\s*Q#?\d{1,3})*)\s*\)/g, (m, inner) => {
      const nums = inner.match(/\d{1,3}/g).map(Number);
      const names = [];
      nums.forEach(n => { const k = concept(n); if (k && names.indexOf(k) < 0) names.push(k); });
      if (!names.length) return '';
      return '<span class="qrefs">(concepts: ' + names.map(k => '<i class="qref">' + k + '</i>').join(' · ') + ')</span>';
    });
    // "Q42 trap" / "Q13 pattern"
    s = s.replace(/\bQ#?(\d{1,3})\s+(trap|pattern|fix|scenario|question)s?\b/g, (m, n, w) => chip(+n) + ' ' + w);
    // remaining bare references, but never quarters like "Q2 2025" or "Q3 FY26"
    s = s.replace(/\bQ#?(\d{1,3})\b(?!\s*(?:20\d\d|FY|'\d\d))/g, (m, n) => chip(+n));
    return s;
  };
}

function replaceDeep(value, fn) {
  if (typeof value === 'string') return fn(value);
  if (Array.isArray(value)) return value.map(v => replaceDeep(v, fn));
  if (value && typeof value === 'object') {
    const o = {};
    for (const k of Object.keys(value)) o[k] = replaceDeep(value[k], fn);
    return o;
  }
  return value;
}

/* ---------- chapters ---------- */
function stripCover(html) {
  // The old cover banner is replaced by the course landing in the reader.
  return html.replace(/^<div class="cover">[\s\S]*?<\/div>/, '');
}
function cleanTitle(t) {
  return t.replace(/^\d+\.\s*/, '').trim();
}
function kindOf(ch, index, total) {
  const t = ch.title.toLowerCase();
  if (index === 0) return 'intro';
  if (ch.html.indexOf('exam-root') >= 0 || /\bmock exam\b|practice exam|comprehensive mock/.test(t)) return 'exam';
  if (/playbook/.test(t)) return 'playbook';
  if (/next steps/.test(t)) return 'next';
  if (/official documentation|references$/.test(t)) return 'refs';
  if (/chapter-wise knowledge checks/.test(t)) return 'drop';
  return 'story';
}
function shortLabel(title) {
  let s = title.replace(/\s*[:–—-]\s.*$/, '').trim();
  if (s.length > 24) s = s.slice(0, 22).replace(/\s+\S*$/, '') + '…';
  return s;
}
const FLOW_MANIFEST = (() => { const p = path.join(__dirname, 'flows', 'manifest.json'); return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {}; })();
function flowRef(key, slug, id) {
  // a flow reaches the page only once its spec is authored AND it has been rendered (manifest entry)
  const spec = path.join(__dirname, 'flows', 'specs', slug, id + '.json');
  const m = FLOW_MANIFEST[key + '-' + id];
  if (!fs.existsSync(spec) || !m) return null;
  return { id: key + '-' + id, title: m.title, duration: m.duration, steps: m.steps, sections: m.sections || null, narrated: !!m.narrated, v: m.specHash || null };
}
function readEnrich(slug, id) {
  const p = path.join(__dirname, 'enrich', slug, id + '.json');
  if (!fs.existsSync(p)) return null;
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { console.warn('bad enrich file', p, e.message); return null; }
}

/* ---------- concept -> chapter lookup for "review this concept" ---------- */
function chapterForQuestion(q, chapters) {
  const needles = [q.k, q.t].filter(Boolean).map(s => s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim());
  let best = null, bestScore = 0;
  chapters.forEach(ch => {
    if (ch.kind !== 'story' && ch.kind !== 'playbook') return;
    const text = (ch.title + ' ' + ch.html).toLowerCase();
    let score = 0;
    needles.forEach((n, i) => {
      const words = n.split(/\s+/).filter(w => w.length > 3);
      words.forEach(w => { const c = text.split(w).length - 1; score += c * (i === 0 ? 2 : 1); });
    });
    if (score > bestScore) { bestScore = score; best = ch.id; }
  });
  return best;
}

/* ---------- build ---------- */
const hub = loadHub();
const meta = {};
let failures = 0;
fs.mkdirSync(OUT_DIR, { recursive: true });

for (const slug of Object.keys(GUIDES)) {
  const { key, hub: hubId } = GUIDES[slug];
  const g = loadGuide(slug);
  const CH = g.CHAPTERS || [], KC = g.KC || {}, ANIMS = g.ANIMS || {}, EX = g.EX || {}, ANN = g.ANN || {}, OUTNOTES = g.OUTNOTES || {}, QS = g.QUESTIONS || [];
  const fix = conceptReplacer(QS);

  // chapters
  let chapters = CH.map((c, i) => {
    const kind = kindOf(c, i, CH.length);
    const title = cleanTitle(c.title);
    return { id: c.id, n: i + 1, title, short: shortLabel(title), kind, tag: c.tag || null, nocheck: !!c.nocheck, html: stripCover(c.html) };
  }).filter(c => c.kind !== 'drop');

  // enrichment
  chapters = chapters.map(ch => {
    const e = readEnrich(slug, ch.id);
    const out = Object.assign({ icon: null, teaser: '', scene: null, takeaways: [], flow: flowRef(key, slug, ch.id) }, ch);
    if (!e) return out;
    if (e.short && e.short.length <= 26) out.short = e.short;
    if (e.icon) out.icon = e.icon;
    if (e.teaser) out.teaser = e.teaser;
    if (Array.isArray(e.takeaways)) out.takeaways = e.takeaways.filter(t => typeof t === 'string' && t.trim()).slice(0, 5);
    if (e.scene && e.scene.title) {
      const sceneHtml = e.scene.sceneHtml || '';
      let body = out.html;
      let cut = false;
      if (sceneHtml && body.startsWith(sceneHtml)) { body = body.slice(sceneHtml.length); cut = true; }
      else if (sceneHtml) {
        // tolerate whitespace / quote differences by comparing the text content
        const norm = s => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        const target = norm(sceneHtml);
        if (target && norm(body).startsWith(target)) {
          // walk the raw html until the text content matches
          let acc = '', k = 0;
          while (k < body.length && norm(acc) !== target) { acc += body[k++]; }
          if (norm(acc) === target) { body = body.slice(k); cut = true; }
        }
      }
      out.scene = { kicker: e.scene.kicker || '', title: e.scene.title, html: cut ? sceneHtml : (e.scene.sceneHtml || '') , cut };
      out.html = body;
    }
    return out;
  });

  // cheat sheet from the hub, inserted before the exam
  const track = hub.data[hubId];
  const cheat = track ? {
    stats: track.stats,
    summary: track.summary,
    domains: track.domains.map(d => ({ title: d.title, weight: d.weight, points: d.points })),
    matrix: track.decisionMatrix,
    code: track.codePatterns.map(c => {
      const nums = (c.tag.match(/Q#?\d{1,3}/g) || []).map(x => +x.replace(/\D/g, ''));
      const concepts = [];
      nums.forEach(n => { const q = QS[n - 1]; if (q && concepts.indexOf(q.k) < 0) concepts.push(q.k); });
      return { title: c.title, tag: c.tag.replace(/\s*\((?:Q#?\d{1,3}[^)]*)\)\s*/g, '').trim(), concepts, description: c.description, lang: c.lang, code: c.code };
    }),
  } : null;
  if (cheat) {
    const examIdx = chapters.findIndex(c => c.kind === 'exam');
    const cs = { id: 'cheatsheet', n: 0, title: 'Exam cheat sheet', short: 'Cheat sheet', kind: 'cheatsheet', tag: null, nocheck: true, html: '', icon: 'ClipboardList', teaser: 'The blueprint, the "if you see X, choose Y" decision matrix, and the reference code patterns — the one page to re-read before exam day.', scene: null, takeaways: [], flow: null };
    chapters.splice(examIdx < 0 ? chapters.length : examIdx, 0, cs);
  }

  // questions with stable ids and a review chapter
  const questions = QS.map((q, i) => ({ id: key + '-q' + (i + 1), n: i + 1, t: q.t, d: q.d, c: q.c, q: q.q, o: q.o, a: q.a, w: q.w, x: q.x, k: q.k, ch: chapterForQuestion(q, chapters) }));

  // apply concept replacement everywhere text lives
  const trailer = flowRef(key, slug, 'trailer');
  const course = replaceDeep({
    slug, key, trailer, chapters, anims: ANIMS, kc: KC, ex: EX, ann: ANN, outnotes: OUTNOTES, questions, cheat,
  }, fix);

  // inline enumerations "(1) … (2) … (3) …" become a lead-in + a real numbered list
  let lists = 0;
  const lh = s => { const r = listifyHtml(s); lists += r.count; return r.html; };
  const lt = s => { const r = listifyText(s); lists += r.count; return r.html; };
  course.chapters.forEach(c => { c.html = lh(c.html); if (c.scene && c.scene.html) c.scene.html = lh(c.scene.html); });
  Object.keys(course.kc).forEach(k => course.kc[k].forEach(it => { it.e = lt(it.e); }));
  course.questions.forEach(q => { q.w = lt(q.w); q.x = lt(q.x); });
  if (course.cheat) course.cheat.domains.forEach(d => { d.points = d.points.map(lt); });

  // ---- checks ----
  const allHtml = course.chapters.map(c => c.html + (c.scene ? c.scene.html : '')).join('\n');
  const miss = [];
  for (const m of allHtml.matchAll(/data-anim="([^"]+)"/g)) if (!ANIMS[m[1]]) miss.push('anim:' + m[1]);
  for (const m of allHtml.matchAll(/data-kc="([^"]+)"/g)) if (!KC[m[1]]) miss.push('kc:' + m[1]);
  for (const m of allHtml.matchAll(/data-player="([^"]+)"/g)) if (!EX[m[1]]) miss.push('player:' + m[1]);
  const badQ = course.questions.filter(q => !q.q || !Array.isArray(q.o) || q.o.length < 2 ||
    (Array.isArray(q.a) ? q.a.some(x => x < 0 || x >= q.o.length) : (q.a < 0 || q.a >= q.o.length)));
  const leftover = (JSON.stringify(course).match(/\bQ#?\d{1,3}\b(?!\s*(?:20\d\d|FY))/g) || []).filter(x => true);
  const ids = new Set(course.chapters.map(c => c.id));
  if (ids.size !== course.chapters.length) { console.log(slug, 'DUP chapter ids'); failures++; }
  if (miss.length) { console.log(slug, 'MISSING REFS', miss.join(', ')); failures++; }
  if (badQ.length) { console.log(slug, 'BAD QUESTIONS', badQ.length); failures++; }
  if (!course.chapters.some(c => c.kind === 'exam')) { console.log(slug, 'NO exam chapter'); failures++; }
  const enriched = course.chapters.filter(c => c.icon).length;
  const flows = course.chapters.filter(c => c.flow).length + (trailer ? 1 : 0);
  console.log(`${slug}: lists=${lists} chapters=${course.chapters.length} (enriched ${enriched}, scenes ${course.chapters.filter(c => c.scene && c.scene.cut).length}, flows ${flows}) questions=${course.questions.length} anims=${Object.keys(ANIMS).length} kc=${Object.keys(KC).length} examples=${Object.keys(EX).length} cheat=${!!cheat} leftoverQrefs=${leftover.length}${leftover.length ? ' e.g. ' + leftover.slice(0, 5).join(',') : ''}`);

  const body = JSON.stringify(course);
  fs.writeFileSync(path.join(OUT_DIR, slug + '.json'), body);
  // content hash: the reader fetches /cert-data/<slug>.json?v=<version> so browsers never keep a stale course
  let hv = 0; for (let i = 0; i < body.length; i++) hv = (hv * 31 + body.charCodeAt(i)) | 0;
  meta[slug] = {
    key, version: (hv >>> 0).toString(36), questions: course.questions.length, trailer,
    chapters: course.chapters.map(c => ({ id: c.id, n: c.n, title: c.title, short: c.short, kind: c.kind, icon: c.icon, teaser: c.teaser, nocheck: c.nocheck, flow: c.flow })),
  };
}

fs.mkdirSync(path.dirname(META_OUT), { recursive: true });
fs.writeFileSync(META_OUT, JSON.stringify(meta, null, 1));
console.log(failures ? 'FAILURES: ' + failures : 'ALL COURSES BUILT');
process.exit(failures ? 1 : 0);
