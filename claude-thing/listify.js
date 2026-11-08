/* Turns inline enumerations ("… three things: (1) a, (2) b, and (3) c. Tailor …") into a lead-in,
   a real numbered list and any trailing sentence. Used by build_course_json.js on chapter HTML and on
   the plain-text explanation fields. Code blocks are never touched. */

const MARK = /(?:\((\d{1,2})\)|(?:^|(?<=[\s>:;,]))(\d{1,2})\)|\bStep (\d{1,2}):)\s*/g;

function findRun(text) {
  // ordered markers 1..n (n >= 2) in one stretch of text
  const marks = [];
  let m;
  MARK.lastIndex = 0;
  while ((m = MARK.exec(text))) marks.push({ n: +(m[1] || m[2] || m[3]), start: m.index, end: m.index + m[0].length });
  for (let i = 0; i < marks.length; i++) {
    if (marks[i].n !== 1) continue;
    const run = [marks[i]];
    for (let j = i + 1; j < marks.length; j++) if (marks[j].n === run[run.length - 1].n + 1) run.push(marks[j]);
    if (run.length >= 2) return run;
  }
  return null;
}

function cleanItem(s) {
  s = s.trim()
    .replace(/^(and|or|then)\s+/i, '')
    .replace(/[\s,;]+(and|or|then)\s*$/i, '')
    .replace(/[,;]\s*$/, '')
    .replace(/(?<!\.\.)\.$/, '')
    .trim();
  if (s && /^[a-z]/.test(s)) s = s[0].toUpperCase() + s.slice(1);
  return s;
}

/** returns { lead, items, tail } or null */
function split(text) {
  const run = findRun(text);
  if (!run) return null;
  const lead = text.slice(0, run[0].start).trim();
  const items = [];
  for (let k = 0; k < run.length; k++) {
    const end = k + 1 < run.length ? run[k + 1].start : text.length;
    items.push(text.slice(run[k].end, end));
  }
  // the last item stops at its first sentence end; the rest is a trailing sentence
  let tail = '';
  const last = items[items.length - 1];
  const stop = last.search(/[.!?](?:<\/[a-z]+>)*\s+(?=<?[A-Z"“(])/);
  if (stop >= 0) {
    const cut = last.indexOf(' ', stop) >= 0 ? last.indexOf(' ', stop) : last.length;
    tail = last.slice(cut).trim();
    items[items.length - 1] = last.slice(0, cut).replace(/\.\s*$/, '').trim();
  } else {
    items[items.length - 1] = last.replace(/\.\s*$/, '');
  }
  const cleaned = items.map(cleanItem);
  if (cleaned.some(i => !i || i.length < 3)) return null;
  // unbalanced tags inside an item mean the run crossed markup boundaries: leave the text alone
  const balanced = s => (s.match(/<(b|i|code|strong|em|a)\b/g) || []).length === (s.match(/<\/(b|i|code|strong|em|a)>/g) || []).length;
  if (!cleaned.every(balanced) || !balanced(lead) || !balanced(tail)) return null;
  return { lead, items: cleaned, tail };
}

function listHtml(items) {
  return '<ol class="cc-steps">' + items.map(i => '<li>' + i + '</li>').join('') + '</ol>';
}

/** chapter HTML: rewrite <p>, <li> and <td> elements that contain an enumeration */
function listifyHtml(html) {
  if (typeof html !== 'string' || !/\(1\)|\b1\)|Step 1:/.test(html)) return { html, count: 0 };
  let count = 0;
  // never touch code
  const keep = [];
  let out = html.replace(/<pre[\s\S]*?<\/pre>/g, m => { keep.push(m); return '\u0000' + (keep.length - 1) + '\u0000'; });
  out = out.replace(/<(p|li|td)(\s[^>]*)?>((?:(?!<\/?\1[\s>])[\s\S])*?)<\/\1>/g, (whole, tag, attrs, inner) => {
    const r = split(inner);
    if (!r) return whole;
    count++;
    const list = listHtml(r.items);
    if (tag === 'p') return (r.lead ? '<p' + (attrs || '') + '>' + r.lead + '</p>' : '') + list + (r.tail ? '<p>' + r.tail + '</p>' : '');
    return '<' + tag + (attrs || '') + '>' + (r.lead ? '<span class="cc-steps-lead">' + r.lead + '</span>' : '') + list + (r.tail ? '<span class="cc-steps-tail">' + r.tail + '</span>' : '') + '</' + tag + '>';
  });
  out = out.replace(/\u0000(\d+)\u0000/g, (m, i) => keep[+i]);
  return { html: out, count };
}

/** plain explanation text (rendered inside a <div>) */
function listifyText(text) {
  if (typeof text !== 'string') return { html: text, count: 0 };
  const r = split(text);
  if (!r) return { html: text, count: 0 };
  return { html: (r.lead ? '<span class="cc-steps-lead">' + r.lead + '</span>' : '') + listHtml(r.items) + (r.tail ? '<span class="cc-steps-tail">' + r.tail + '</span>' : ''), count: 1 };
}

module.exports = { listifyHtml, listifyText, split };
