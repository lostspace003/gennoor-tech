/* Authoring helpers used by the content files. */
window.CHAPTERS = [];
window.KC = {};
function chapter(id, title, tag, html, opts) { var c = { id: id, title: title, tag: tag, html: html }; for (var k in (opts || {})) c[k] = opts[k]; window.CHAPTERS.push(c); }
function E(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function py(src) { return '<pre><code class="py">' + E(src.replace(/^\n/, '')) + '</code></pre>'; }
function out(src) { return '<pre><code>' + E(src.replace(/^\n/, '')) + '</code></pre>'; }
function anim(id) { return '<div data-anim="' + id + '"></div>'; }
function kc(id) { return '<h3>Knowledge check</h3><p>Try each question first, then open the answer.</p><div data-kc="' + id + '"></div>'; }
function note(t, cls) { return '<div class="note ' + (cls || '') + '">' + t + '</div>'; }
function examNote(t) { return note('<b>Exam relevance:</b> ' + t, 'exam'); }
function tbl(head, rows) { return '<div class="tw"><table><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' + rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table></div>'; }
function concept(title, f) {
  var h = '<h3>' + title + '</h3><div class="card">';
  [['what', 'What is it?'], ['why', 'Why is it needed?'], ['how', 'How does it work?'], ['analogy', 'Real-world analogy'], ['example', 'Practical example']].forEach(function (p) { if (f[p[0]]) h += '<h4>' + p[1] + '</h4><p>' + f[p[0]] + '</p>'; });
  if (f.ex) { var X = window.EX[f.ex]; h += '<h4>Code implementation</h4><p><small>Runnable file <code>examples/' + f.ex + '.py</code> (mock API key + model included).</small></p>' + '<div data-player="' + f.ex + '"></div>' + det('Show full code (copy) and captured output', py(X.code) + '<p><b>Output</b> (captured by actually running this file against the offline mock SDK):</p>' + out(X.out) + outExplain(f.ex)); if (f.walk) h += '<p><b>What happens at each step:</b></p><ol>' + f.walk.map(function (w) { return '<li>' + w + '</li>'; }).join('') + '</ol>'; }
  [['arch', 'Architecture explanation'], ['when', 'When to use it']].forEach(function (p) { if (f[p[0]]) h += '<h4>' + p[1] + '</h4><p>' + f[p[0]] + '</p>'; });
  if (f.exam) h += '<h4>Examination relevance</h4><p>' + f.exam + '</p>';
  return h + '</div>';
}
function det(title, body) { return '<details><summary>' + title + '</summary><div>' + body + '</div></details>'; }

function exBlock(n) { var X = window.EX[n]; return '<p><small>Runnable file <code>examples/' + n + '.py</code></small></p>' + '<div data-player="' + n + '"></div>' + det('Show full code (copy) and captured output', py(X.code) + '<p><b>Output</b> (captured from a real run against the offline mock SDK):</p>' + out(X.out) + outExplain(n)); }

function outExplain(n) { var o = (window.OUTNOTES || {})[n]; if (!o) return ''; return '<h4>Reading the output</h4><ul>' + o.map(function (x) { return '<li><code>' + E(x[0]) + '</code>: ' + E(x[1]) + '</li>'; }).join('') + '</ul>'; }
