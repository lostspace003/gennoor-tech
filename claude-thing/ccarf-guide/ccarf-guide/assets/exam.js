/* Interactive mock exam. Questions are original practice items, not real exam content. */
(function () {
  var root = document.getElementById('exam-root'); if (!root) return;
  var ALL = window.QUESTIONS, S = null, timerId = 0;
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function el(h) { var d = document.createElement('div'); d.innerHTML = h; return d; }
  function fmt(s) { var m = Math.floor(s / 60), x = s % 60; return (m < 10 ? '0' : '') + m + ':' + (x < 10 ? '0' : '') + x; }

  function home() {
    clearInterval(timerId); root.innerHTML = '';
    var topics = {}; ALL.forEach(function (q) { topics[q.t] = (topics[q.t] || 0) + 1; });
    root.appendChild(el('<div class="card"><p><b>' + ALL.length + ' original practice questions</b> (beginner / intermediate / advanced). Order and answer positions are randomized each attempt. Correct answers are hidden until you submit. These are <u>not</u> real or leaked exam questions.</p><p>Question count: <select id="ex-n"><option value="' + ALL.length + '">All (' + ALL.length + ')</option><option value="50">50</option><option value="25">25</option></select> &nbsp; Time: 1.5 min per question.</p><button class="pri" id="ex-go">Start exam</button></div>'));
    document.getElementById('ex-go').onclick = function () { start(parseInt(document.getElementById('ex-n').value, 10)); };
  }
  function start(n) {
    var qs = shuffle(ALL).slice(0, n).map(function (q) {
      var order = shuffle([0, 1, 2, 3]); return { q: q, order: order, pick: null };
    });
    S = { qs: qs, i: 0, left: Math.round(n * 90), done: false };
    timerId = setInterval(function () { S.left--; var t = document.getElementById('timer'); if (t) t.textContent = fmt(Math.max(0, S.left)); if (S.left <= 0) submit(); }, 1000);
    draw();
  }
  function draw() {
    root.innerHTML = ''; var cur = S.qs[S.i], q = cur.q;
    var top = el('<div style="display:flex;justify-content:space-between;align-items:center"><b>Question ' + (S.i + 1) + ' of ' + S.qs.length + '</b><span id="timer">' + fmt(S.left) + '</span></div>'); root.appendChild(top);
    var pal = el('<div class="pal"></div>').firstChild;
    S.qs.forEach(function (x, k) { var b = document.createElement('button'); b.textContent = k + 1; b.className = (x.pick != null ? 'ans ' : '') + (k === S.i ? 'cur' : ''); b.onclick = function () { S.i = k; draw(); }; pal.appendChild(b); });
    root.appendChild(pal);
    var box = el('<div class="ex-q"><span class="tag">' + q.t + '</span><span class="tag">' + q.d + '</span><span class="tag">' + q.c + '</span><p>' + q.q + '</p></div>').firstChild;
    cur.order.forEach(function (oi, pos) { var b = document.createElement('button'); b.className = 'opt' + (cur.pick === pos ? ' sel' : ''); b.innerHTML = String.fromCharCode(65 + pos) + '. ' + q.o[oi]; b.onclick = function () { cur.pick = pos; draw(); }; box.appendChild(b); });
    root.appendChild(box);
    var nv = el('<div style="display:flex;gap:8px"><button id="pv">◀ Previous</button><button id="nx">Next ▶</button><button class="pri" id="sb" style="margin-left:auto">Submit exam</button></div>');
    root.appendChild(nv); nv.querySelector('#pv').disabled = S.i === 0; nv.querySelector('#nx').disabled = S.i === S.qs.length - 1;
    nv.querySelector('#pv').onclick = function () { S.i--; draw(); }; nv.querySelector('#nx').onclick = function () { S.i++; draw(); };
    nv.querySelector('#sb').onclick = function () { var un = S.qs.filter(function (x) { return x.pick == null; }).length; if (!un || confirm(un + ' question(s) unanswered. Submit anyway?')) submit(); };
  }
  function submit() {
    clearInterval(timerId); root.innerHTML = ''; var score = 0, by = {};
    S.qs.forEach(function (x) { var ok = x.pick != null && x.order[x.pick] === x.q.a; if (ok) score++; var b = by[x.q.t] || (by[x.q.t] = { r: 0, n: 0 }); b.n++; if (ok) b.r++; });
    var pct = Math.round(100 * score / S.qs.length);
    var h = '<div class="card"><h3>Final score: ' + score + ' / ' + S.qs.length + ' (' + pct + '%)</h3><h4>Topic-wise performance</h4>';
    Object.keys(by).sort().forEach(function (t) { var b = by[t], p = Math.round(100 * b.r / b.n); h += '<p style="margin:6px 0">' + t + ': ' + b.r + '/' + b.n + ' (' + p + '%)</p><div class="bar"><i style="width:' + p + '%"></i></div>'; });
    h += '</div><button class="pri" id="rt">Retake / new attempt</button><h3>Review</h3>'; root.appendChild(el(h)); root.querySelector('#rt').onclick = home;
    S.qs.forEach(function (x, k) {
      var q = x.q, ok = x.pick != null && x.order[x.pick] === q.a, box = el('<div class="ex-q"><b>' + (ok ? '✅ Correct' : x.pick == null ? '⚠️ Unanswered' : '❌ Incorrect') + '</b> · Q' + (k + 1) + ' <span class="tag">' + q.t + '</span><span class="tag">' + q.d + '</span><span class="tag">' + q.c + '</span><p>' + q.q + '</p></div>').firstChild;
      x.order.forEach(function (oi, pos) { var b = document.createElement('div'); b.className = 'opt ' + (oi === q.a ? 'good' : pos === x.pick ? 'wrong' : ''); b.style.padding = '6px 14px'; b.style.border = '1px solid var(--line)'; b.style.borderRadius = '8px'; b.innerHTML = String.fromCharCode(65 + pos) + '. ' + q.o[oi] + (oi === q.a ? ' ✔' : pos === x.pick ? ' ✘ (your answer)' : ''); box.appendChild(b); });
      box.appendChild(el('<p><b>Why correct:</b> ' + q.w + '</p><p><b>Why the others are wrong:</b> ' + q.x + '</p><p><b>Concept tested:</b> ' + q.k + '</p>'));
      root.appendChild(box);
    });
    root.scrollIntoView();
  }
  home();
})();
