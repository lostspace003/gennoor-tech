/* Validates every flow spec against the engine's contract. Exit 1 on any failure.
   Run: node claude-thing/flows/validate_flows.js [slug/id] */
const fs = require('fs');
const path = require('path');
const SPECS = path.join(__dirname, 'specs');
const ICONS = (() => { const src = fs.readFileSync(path.join(__dirname, 'engine', 'icons.js'), 'utf8'); const m = src.match(/window\.FLOW_ICONS = (\{[\s\S]*\});/); return Object.keys(JSON.parse(m[1])); })();
const SLOTS = ['L', 'C', 'R', 'TL', 'TC', 'TR', 'BL', 'BC', 'BR', 'L2', 'L3', 'R2', 'R3'];
const KINDS = ['check', 'cross', 'warn'];

function validate(spec, name) {
  const errs = [];
  const str = (v, max, what) => { if (typeof v !== 'string' || !v.trim()) errs.push(what + ' missing'); else if (v.length > max) errs.push(what + ' too long (' + v.length + ' > ' + max + ')'); };
  str(spec.title, 70, 'title');
  str(spec.kicker, 40, 'kicker');
  if (!Array.isArray(spec.actors) || spec.actors.length < 2 || spec.actors.length > 6) errs.push('actors must be 2–6');
  const ids = new Set(), slots = new Set();
  (spec.actors || []).forEach((a, i) => {
    if (!a.id || !/^[a-z][a-z0-9_-]{0,19}$/.test(a.id)) errs.push('actor ' + i + ' bad id'); else if (ids.has(a.id)) errs.push('duplicate actor id ' + a.id); else ids.add(a.id);
    if (!ICONS.includes(a.icon)) errs.push('actor ' + a.id + ' unknown icon ' + a.icon);
    if (!SLOTS.includes(a.slot)) errs.push('actor ' + a.id + ' bad slot ' + a.slot); else if (slots.has(a.slot)) errs.push('two actors share slot ' + a.slot); else slots.add(a.slot);
    str(a.label, 18, 'actor ' + a.id + ' label');
    if (a.sub != null && String(a.sub).length > 22) errs.push('actor ' + a.id + ' sub too long');
  });
  if (!Array.isArray(spec.steps) || spec.steps.length < 4 || spec.steps.length > 8) errs.push('steps must be 4–8');
  const ref = (id, what) => { if (!ids.has(id)) errs.push(what + ' references unknown actor ' + id); };
  (spec.steps || []).forEach((st, i) => {
    const w = 'step ' + (i + 1);
    str(st.caption, 92, w + ' caption');
    (st.focus || []).forEach(id => ref(id, w + ' focus'));
    ['send', 'reply'].forEach(k => {
      const t = st[k]; if (!t) return;
      ref(t.from, w + ' ' + k + '.from'); ref(t.to, w + ' ' + k + '.to');
      if (t.from === t.to) errs.push(w + ' ' + k + ' from == to');
      if (!ICONS.includes(t.icon)) errs.push(w + ' ' + k + ' unknown icon ' + t.icon);
      if (t.label != null && String(t.label).length > 24) errs.push(w + ' ' + k + ' label too long');
    });
    if (st.reply && !st.send) errs.push(w + ' reply without send');
    if (st.callout) { ref(st.callout.at, w + ' callout'); str(st.callout.text, 56, w + ' callout text'); }
    if (st.badge) { ref(st.badge.at, w + ' badge'); if (!KINDS.includes(st.badge.kind)) errs.push(w + ' badge kind'); if (st.badge.text != null && String(st.badge.text).length > 16) errs.push(w + ' badge text too long'); }
    if (st.state) { ref(st.state.at, w + ' state'); str(st.state.text, 26, w + ' state text'); }
    if (!st.send && !st.callout && !st.badge && !st.state && !(st.focus || []).length) errs.push(w + ' has nothing visual (needs send/callout/badge/state/focus)');
  });
  const usedActors = new Set();
  (spec.steps || []).forEach(st => { (st.focus || []).forEach(id => usedActors.add(id)); ['send', 'reply'].forEach(k => { if (st[k]) { usedActors.add(st[k].from); usedActors.add(st[k].to); } }); if (st.callout) usedActors.add(st.callout.at); if (st.badge) usedActors.add(st.badge.at); if (st.state) usedActors.add(st.state.at); });
  ids.forEach(id => { if (!usedActors.has(id)) errs.push('actor ' + id + ' is never used'); });
  const travels = (spec.steps || []).reduce((n, st) => n + (st.send ? 1 : 0) + (st.reply ? 1 : 0), 0);
  if (travels < 3) errs.push('fewer than 3 travelling items — not enough flow');
  return errs;
}

let failures = 0, count = 0;
const only = process.argv[2];
for (const slug of fs.readdirSync(SPECS)) {
  const dir = path.join(SPECS, slug);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) {
    const name = slug + '/' + f.replace('.json', '');
    if (only && name !== only) continue;
    count++;
    let spec;
    try { spec = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')); } catch (e) { console.log('INVALID JSON', name, e.message); failures++; continue; }
    const errs = validate(spec, name);
    if (errs.length) { failures++; console.log('FAIL', name, '\n  - ' + errs.join('\n  - ')); }
  }
}
console.log(count + ' specs checked, ' + failures + ' failing');
process.exit(failures ? 1 : 0);
