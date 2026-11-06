/* Build the full prep-hub banks.js from the parsed exam JSONs + the CCAR-F guide bank. */
const fs = require('fs');
const path = require('path');
const HERE = __dirname;
const ROOT = path.join(HERE, '..');

function esc(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function fromParsed(slug, prefix) {
  const raw = JSON.parse(fs.readFileSync(path.join(HERE, 'parsed', slug + '.json'), 'utf8'));
  return raw.filter(q => q.format !== 'table').map((q, i) => ({
    id: prefix + '-' + q.n,
    type: q.format === 'multi' ? 'multi' : 'single',
    stem: esc(q.stem),
    options: q.options.map(esc),
    correct: Array.isArray(q.answer) ? q.answer : [q.answer],
    explanation: esc(q.explanation),
  }));
}

/* The 6 table-style questions in architect-professional.json, hand-converted to single choice. */
const AP = JSON.parse(fs.readFileSync(path.join(HERE, 'parsed', 'architect-professional.json'), 'utf8'));
function tableQ(n, stemSuffix, options, correctIdx) {
  const src = AP.find(q => q.n === n);
  return {
    id: 'ccar-p-' + n,
    type: 'single',
    stem: esc(src.stem.split('\n')[0]) + ' ' + stemSuffix,
    options: options.map(esc),
    correct: [correctIdx],
    explanation: esc(src.explanation),
    _src: src, // kept for the build log, stripped before writing
  };
}

// Pull numbered items out of a table stem ("1. ... 2. ..." lines)
function items(n) {
  const src = AP.find(q => q.n === n);
  return src.stem.split('\n').filter(l => /^\s*\d+[.)]/.test(l)).map(l => l.replace(/^\s*\d+[.)]\s*/, '').trim());
}

function yesNoCombo(n, yesIdx) {
  const its = items(n);
  const yes = its.filter((_, i) => yesIdx.includes(i));
  const no = its.filter((_, i) => !yesIdx.includes(i));
  return { its, yes, no };
}

/* Manual conversions — each table question hand-converted to a clean single-choice item. */
function buildTableConversions() {
  const hand = [
    {
      n: 14,
      ask: 'Which set of tools should REMAIN after a least-privilege audit?',
      options: [
        'Tools 1, 3 and 5 — read-only catalog lookup, draft-write to the review queue, and read-only policy lookup',
        'All five tools, since each could plausibly help the agent complete procurement tasks faster',
        'Tools 2 and 4 — direct vendor email and the production-database admin tool',
        'Tools 1 and 3 only — the policy-document tool is unnecessary once drafts are reviewed by humans',
      ],
    },
    {
      n: 35,
      ask: 'Which assessment of the four practices is correct?',
      options: [
        'Practices 1 and 2 are sound; practices 3 and 4 are unsound',
        'All four practices are sound production-architecture choices',
        'Practices 1 and 3 are sound; practices 2 and 4 are unsound',
        'Only practice 1 is sound; practices 2, 3 and 4 are unsound',
      ],
    },
    {
      n: 36,
      ask: 'Which set of statements is accurate?',
      options: [
        'Statements 1, 2 and 4 are accurate; statements 3 and 5 are inaccurate',
        'All five statements are accurate',
        'Statements 3 and 5 are accurate; statements 1, 2 and 4 are inaccurate',
        'Statements 1 and 2 are accurate; statements 3, 4 and 5 are inaccurate',
      ],
    },
    {
      n: 40,
      ask: 'Which assessment of the four claims is correct?',
      options: [
        'Claims 1, 2 and 3 are accurate; claim 4 is inaccurate',
        'All four claims are accurate',
        'Claims 1 and 4 are accurate; claims 2 and 3 are inaccurate',
        'Only claim 1 is accurate; claims 2, 3 and 4 are inaccurate',
      ],
    },
    {
      n: 45,
      ask: 'Which use cases are appropriate for a Claude-based system?',
      options: [
        'Use cases 1, 3 and 5 — drafting investigative reports, long-context contract review, and reasoned ticket routing',
        'All five use cases, since Claude can be applied to any data-processing workload',
        'Use cases 2 and 4 — sub-50ms fraud scoring and replacing a vector index',
        'Use cases 1 and 3 only — ticket routing requires a dedicated classical classifier',
      ],
    },
    {
      n: 58,
      ask: 'Which mapping of tactics to lifecycle stages is correct?',
      options: [
        'Tactics 1–2: Input Preparation; tactics 3–4: Prompt Construction; tactics 5–6: Output Handling',
        'Tactics 1–2: Prompt Construction; tactics 3–4: Input Preparation; tactics 5–6: Output Handling',
        'Tactics 1–3: Input Preparation; tactics 4–6: Output Handling',
        'Tactics 1, 3 and 5: Input Preparation; tactics 2, 4 and 6: Output Handling',
      ],
    },
  ];
  return hand.map(h => {
    const src = AP.find(q => q.n === h.n);
    const its = items(h.n);
    const stemList = its.map((it, i) => (i + 1) + '. ' + it).join('\n');
    const lead = src.stem.split('\n')[0];
    // Rotate options so the correct answer isn't always A.
    const rot = h.n % h.options.length;
    const options = h.options.slice(rot).concat(h.options.slice(0, rot));
    const correct = options.indexOf(h.options[0]);
    return {
      id: 'ccar-p-' + h.n,
      type: 'single',
      stem: esc(lead + '\n' + stemList + '\n' + h.ask),
      options: options.map(esc),
      correct: [correct],
      explanation: esc(src.explanation),
      n: h.n,
    };
  });
}

function buildTableConversionsOld() {
  const out = [];
  const specs = [
    // n, indices (0-based) of items whose answer is Yes/true per the raw answer text
    { n: 14, yes: [0, 2, 4], ask: 'Which tools should REMAIN after a least-privilege audit?' },
    { n: 35, yes: null, ask: null }, // resolved generically below
    { n: 36, yes: null, ask: null },
    { n: 40, yes: null, ask: null },
    { n: 45, yes: null, ask: null },
    { n: 58, yes: null, ask: null },
  ];
  for (const spec of specs) {
    const src = AP.find(q => q.n === spec.n);
    const its = items(spec.n);
    // Parse raw answer "item → Yes ; item → No ; ..." into yes-indices
    const parts = String(src.answer).split(';').map(s => s.trim()).filter(Boolean);
    const yesIdx = [];
    parts.forEach(p => {
      const m = p.match(/^(\d+)[.)]?\s*(.*?)(?:→|->)\s*(Yes|No|Accurate|Inaccurate|Valid|Invalid|True|False)\s*$/i)
        || p.match(/^(.*?)(?:→|->)\s*(Yes|No|Accurate|Inaccurate|Valid|Invalid|True|False)\s*$/i);
      if (!m) return;
      const verdict = m[m.length - 1].toLowerCase();
      const isYes = ['yes', 'accurate', 'valid', 'true'].includes(verdict);
      let idx = -1;
      if (/^\d+$/.test(m[1])) idx = parseInt(m[1], 10) - 1;
      else {
        const txt = m[1].toLowerCase().slice(0, 50);
        idx = its.findIndex(it => it.toLowerCase().startsWith(txt.slice(0, 30)) || txt.includes(it.toLowerCase().slice(0, 30)));
      }
      if (idx >= 0 && isYes) yesIdx.push(idx);
    });
    const yesSet = yesIdx.sort((a, b) => a - b);
    const correctLabel = yesSet.length ? 'Items ' + yesSet.map(i => i + 1).join(', ') : 'None of the items';
    // Build 4 options: the correct set + 3 plausible distractor sets
    const all = its.map((_, i) => i);
    const distractors = [];
    const tryAdd = set => {
      const label = set.length ? 'Items ' + set.map(i => i + 1).join(', ') : 'None of the items';
      if (label !== correctLabel && !distractors.includes(label)) distractors.push(label);
    };
    tryAdd(all);                                   // "all of them"
    tryAdd(all.filter(i => !yesSet.includes(i)));  // the inverse
    tryAdd(yesSet.slice(0, Math.max(1, yesSet.length - 1))); // drop one
    tryAdd(yesSet.concat(all.filter(i => !yesSet.includes(i)).slice(0, 1)).sort((a, b) => a - b)); // add one wrong
    const options = [correctLabel, ...distractors.slice(0, 3)];
    const stemList = its.map((it, i) => (i + 1) + '. ' + it).join('\n');
    const lead = src.stem.split('\n')[0];
    out.push({
      id: 'ccar-p-' + spec.n,
      type: 'single',
      stem: esc(lead + ' ' + (spec.ask || 'Which items are correct (Yes)?') + '\n' + stemList),
      options: options.map(esc),
      correct: [0],
      explanation: esc(src.explanation),
      n: spec.n,
    });
  }
  return out;
}

/* CCAR-F: curate 60 balanced questions from the guide's 100-question bank. */
function ccarfBank() {
  const code = fs.readFileSync(path.join(ROOT, 'public/claude-certifications/architect-foundations/assets/questions.js'), 'utf8');
  const sandbox = { window: {} };
  const fn = new Function('window', code + '\nreturn window.QUESTIONS;');
  const all = fn(sandbox.window) || sandbox.window.QUESTIONS;
  // group by topic, take proportional share of 60
  const byTopic = {};
  all.forEach(q => { (byTopic[q.t] = byTopic[q.t] || []).push(q); });
  const topics = Object.keys(byTopic);
  const picked = [];
  topics.forEach(t => {
    const qs = byTopic[t];
    const share = Math.max(1, Math.round(60 * qs.length / all.length));
    // spread across difficulties: sort B,I,A interleaved by original order
    picked.push(...qs.slice(0, share));
  });
  const sel = picked.slice(0, 60);
  return sel.map((q, i) => ({
    id: 'ccar-f-' + (i + 1),
    type: 'single',
    stem: esc(q.q),
    options: q.o.map(esc),
    correct: [q.a],
    explanation: esc(q.w) + (q.x ? ' <b>Why the others fail:</b> ' + esc(q.x) : ''),
  }));
}

const banks = {
  'ccas-f': fromParsed('associate-foundations', 'ccas-f'),
  'ccdv-f': fromParsed('developer-foundations', 'ccdv-f'),
  'ccar-f': ccarfBank(),
  'ccar-p': fromParsed('architect-professional', 'ccar-p').concat(
    buildTableConversions().map(({ n, ...q }) => q)
  ),
};

// order ccar-p by original question number
banks['ccar-p'].sort((a, b) => parseInt(a.id.split('-').pop(), 10) - parseInt(b.id.split('-').pop(), 10));

const header = '/* Full practice banks for the Claude Certification Prep Hub.\n' +
  '   Generated by claude-thing/build_banks.js — regenerate there, do not hand-edit. */\n';
const body = 'window.CERT_BANKS = ' + JSON.stringify(banks, null, 1) + ';\n';
const outPath = path.join(ROOT, 'public/claude-certifications/prep-hub/banks.js');
fs.writeFileSync(outPath, header + body);
Object.entries(banks).forEach(([k, v]) => {
  const multi = v.filter(q => q.type === 'multi').length;
  console.log(k, v.length, 'questions (', multi, 'multi )');
});
console.log('wrote', outPath, fs.statSync(outPath).size, 'bytes');
