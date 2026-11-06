/* Code player: writes a runnable example line by line, explains each block in a card, then "runs" it and reveals the real captured output.
   Time-based so Play / Pause / Replay / -5s / +5s / scrubber all work from one clock. */
(function () {
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var KW = /\b(import|from|as|async|await|def|class|return|if|elif|else|for|in|with|try|except|raise|None|True|False|and|or|not|lambda|pass)\b/g;
  function hl(src) { // tiny Python highlighter for partial lines
    var out = '', re = /(#[^\n]*)|("[^"\n]*"?|'[^'\n]*'?)|(@\w+)|(\b\d+\.?\d*\b)|([\s\S])/g, m, buf = '';
    function fl() { if (buf) { out += esc(buf).replace(KW, '<span class="k">$1</span>'); buf = ''; } }
    while ((m = re.exec(src))) { if (m[1]) { fl(); out += '<span class="c">' + esc(m[1]) + '</span>'; } else if (m[2]) { fl(); out += '<span class="s">' + esc(m[2]) + '</span>'; } else if (m[3]) { fl(); out += '<span class="d">' + esc(m[3]) + '</span>'; } else if (m[4]) { fl(); out += '<span class="n">' + m[4] + '</span>'; } else buf += m[5]; }
    fl(); return out;
  }
  function el(tag, cls, html, p) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (p) p.appendChild(e); return e; }
  var HEAD = ['import os, asyncio', '🔑 A fake key, a real flow', 'These lines set a <b>mock</b> API key and the model id. Even the offline mock refuses to start without a key shaped like <code>sk-ant-…</code>, exactly like production would. Swap in your real key later and nothing else changes.'];

  function sentences(t) { return t.split(/(?<=[.!?])\s+(?=[A-Z<"'(])/).filter(Boolean); }
  function terms(t) { var r = [], m, re = /<(b|code)>(.*?)<\/>/g; while ((m = re.exec(t))) { var x = m[2].replace(/<[^>]+>/g, ''); if (x.length < 32 && r.indexOf(x) < 0) r.push(x); } return r.slice(0, 5); }
  function xcard(n, total, c, lines, now, idx) {
    var ss = sentences(c.text), title = c.title.replace(/^[^\w<]+/, '');
    var h = '<div class="xc k' + ((idx + 1) % 6) + (now ? ' now' : '') + '" data-i="' + idx + '"><small>STEP ' + n + ' OF ' + total + (lines ? ' · LINES ' + lines : '') + '</small><h5>' + title + '</h5><p>' + ss[0] + '</p>';
    if (ss.length > 1) h += '<ul>' + ss.slice(1).map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>';
    return h + '</div>';
  }
  function build(name) {
    var X = window.EX[name], lines = X.code.replace(/\n+$/, '').split('\n'), A = (window.ANN && window.ANN[name]) || { a: [], out: '' };
    var pairs = [], from = 0, used = {};
    [HEAD].concat(A.a).forEach(function (a) {
      var i = from; while (i < lines.length && lines[i].indexOf(a[0]) < 0) i++;
      if (i >= lines.length) { i = 0; while (i < lines.length && (lines[i].indexOf(a[0]) < 0 || used[i])) i++; } // retry from the top for out-of-order anchors
      if (i >= lines.length || used[i]) return; // anchor genuinely absent: skip the card instead of desyncing
      used[i] = 1; pairs.push({ i: i, card: { title: a[1], text: a[2] } }); from = i + 1;
    });
    pairs.sort(function (x, y) { return x.i - y.i; });
    var starts = pairs.map(function (p) { return p.i; }), cards = pairs.map(function (p) { return p.card; });
    var ls = [], le = [], t = 600, ai = 0, cardStart = [];
    lines.forEach(function (ln, i) {
      if (starts[ai] === i) { cardStart[ai] = t; ai++; }
      var d = ln.trim() ? Math.min(1400, Math.max(350, ln.length * 26)) : 120; ls[i] = t; le[i] = t + d; t += d;
      var nextStart = starts[ai]; // hold for reading at the end of an annotation block
      if (nextStart === i + 1 || i === lines.length - 1) { var c = cards[ai - 1]; if (c) t += 2600 + (c.text.replace(/<[^>]+>/g, '').split(' ').length) * 110; }
    });
    var runAt = t, outLines = X.out.split('\n'), outStart = runAt + 1200;
    var total = outStart + outLines.length * 420 + 3500;
    return { lines: lines, starts: starts, cards: cards, ls: ls, le: le, cardStart: cardStart, runAt: runAt, outLines: outLines, outStart: outStart, total: total, outNote: A.out || 'That is the real output captured from running this exact file.' };
  }

  window.CodePlayer = {
    mount: function (host, name) {
      var M = build(name), T = 0, playing = false, prev = 0, raf = 0, speed = 0.5, fresh = true, lastKey = '';
      host.classList.add('cp-wrap');
      var top = el('div', 'cp-top', '<b>examples/' + name + '.py</b>', host);
      var bP = el('button', 'pri', '▶ Play', top), bPa = el('button', '', '❚❚ Pause', top), bR = el('button', '', '↺ Replay', top), bB = el('button', '', '⏪ 5s', top), bF = el('button', '', '5s ⏩', top);
      var sel = el('select', '', '<option value="0.5" selected>0.5× (relaxed)</option><option value="0.75">0.75×</option><option value="1">1×</option><option value="2">2×</option>', top);
      var body = el('div', 'cp-body', '', host), pre = el('pre', 'cp-code', '', body), side = el('div', 'cp-side', '', body), feed = el('div', 'cp-feed', '', side), out = el('pre', 'cp-out', '', side);
      var bar = el('div', 'cp-bar', '', host), rng = el('input', '', '', bar), lab = el('span', '', '0:00', bar); rng.type = 'range'; rng.min = 0; rng.max = M.total; rng.value = 0; rng.title = 'Scrub';
      function draw() {
        var html = '', cur = -1, i, n = M.lines.length, shown = 0;
        for (i = 0; i < n; i++) { if (T >= M.ls[i]) shown = i + 1; }
        var ci = 0; for (i = 0; i < M.starts.length; i++) if (!fresh && T >= M.cardStart[i]) ci = i; // active card index
        var a0 = M.starts[ci], a1 = (M.starts[ci + 1] === undefined ? n : M.starts[ci + 1]) - 1;
        for (i = 0; i < shown; i++) {
          var full = M.lines[i], p = Math.max(0, Math.min(1, (T - M.ls[i]) / (M.le[i] - M.ls[i]))), part = full.slice(0, Math.round(full.length * p));
          var typing = p < 1;
          html += '<span class="cp-line' + (i >= a0 && i <= a1 && T < M.runAt ? ' cur' : '') + '"><i>' + (i + 1) + '</i>' + window.PyHL(part) + (typing ? '<span class="cp-caret"></span>' : '') + '</span>';
        }
        if (fresh) html = '<span class="cp-line cur"><i> </i><span class="t-com"># press Play - the code will write itself…</span><span class="cp-caret"></span></span>';
        pre.innerHTML = html; if (playing && T < M.runAt) pre.scrollTop = pre.scrollHeight;
        var running = T >= M.runAt;
        var key, h2 = '';
        if (fresh) { key = 'f'; h2 = '<div class="xc now"><small>READY</small><h5>Watch this code write itself</h5><p>Each block of code gets its own explanation.</p><ul><li>Steps stack up here; scroll up to revisit earlier ones.</li><li>Click a step to jump to that moment.</li><li>Use ⏪ 5s / 5s ⏩ or drag the bar to skip.</li></ul></div>'; }
        else { var notes = [], kk = 0; if (running && T >= M.outStart) { kk = Math.max(0, Math.min(M.outLines.length, Math.floor((T - M.outStart) / 420) + 1)); var seenTxt = M.outLines.slice(0, kk).join('\n'); notes = (window.OUTNOTES && window.OUTNOTES[name] || []).filter(function (x) { return seenTxt.indexOf(x[0]) >= 0; }); }
          key = ci + (running ? 'r' + (T >= M.outStart ? 'o' + notes.length : 'w') : ''); if (key !== lastKey) { for (var q = 0; q <= ci; q++) { var e = (M.starts[q + 1] === undefined ? n : M.starts[q + 1]) - 1; h2 += xcard(q + 1, M.cards.length, M.cards[q], (M.starts[q] + 1) + '–' + (e + 1), q === ci && !running, q); }
          if (running) h2 += '<div class="xc now"><small>RESULT · CAPTURED FROM A REAL RUN</small><h5>' + (T >= M.outStart ? 'What the run printed' : 'Running ' + name + '.py…') + '</h5><p>' + (T >= M.outStart ? M.outNote : 'The agent loop is executing against the mock SDK.') + '</p>' + (notes.length ? '<small style="margin-top:8px">HOW TO READ THE OUTPUT</small><ul>' + notes.map(function (x) { return '<li><code>' + esc(x[0]) + '</code> ' + esc(x[1]) + '</li>'; }).join('') + '</ul>' : '') + '</div>'; } }
        if (key !== lastKey) { lastKey = key; feed.innerHTML = h2; feed.scrollTop = feed.scrollHeight; }
        if (running) { var k = Math.max(0, Math.min(M.outLines.length, Math.floor((T - M.outStart) / 420) + 1)); out.className = 'cp-out on'; out.innerHTML = '<span style="color:var(--acc)">$ python ' + name + '.py</span>\n' + (T >= M.outStart ? esc(M.outLines.slice(0, k).join('\n')) : ''); } else out.className = 'cp-out';
        rng.value = T; lab.textContent = Math.floor(T / 1000) + 's / ' + Math.round(M.total / 1000) + 's';
        bP.disabled = playing; bPa.disabled = !playing;
      }
      function tick(now) { if (!playing) return; T += (now - prev) * speed; prev = now; if (T >= M.total) { T = M.total; playing = false; } draw(); if (playing) raf = requestAnimationFrame(tick); }
      function stop() { playing = false; cancelAnimationFrame(raf); }
      function play() { if (T >= M.total) T = 0; fresh = false; playing = true; prev = performance.now(); raf = requestAnimationFrame(tick); draw(); }
      function seek(ms) { stop(); fresh = false; T = Math.max(0, Math.min(M.total, T + ms)); draw(); }
      bP.onclick = play; bPa.onclick = function () { stop(); draw(); }; bR.onclick = function () { stop(); T = 0; play(); };
      bB.onclick = function () { seek(-5000); }; bF.onclick = function () { seek(5000); };
      feed.onclick = function (e) { var x = e.target.closest('.xc'); if (!x || x.getAttribute('data-i') === null) return; var i = +x.getAttribute('data-i'); stop(); fresh = false; T = M.cardStart[i]; lastKey = ''; draw(); };
      sel.onchange = function () { speed = parseFloat(sel.value); };
      rng.oninput = function () { stop(); fresh = false; T = parseFloat(rng.value); draw(); };
      draw();
    }
  };
})();
