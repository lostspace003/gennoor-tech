/* Interactive mock exam. Questions are original practice items, not real exam content.
   Supports single-answer (q.a = index) and multi-select (q.a = [indices]) with any option count. */
(function () {
  var root = document.getElementById('exam-root'); if (!root) return;
  var ALL = window.QUESTIONS, S = null, timerId = 0;
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function el(h) { var d = document.createElement('div'); d.innerHTML = h; return d; }
  function fmt(s) { var m = Math.floor(s / 60), x = s % 60; return (m < 10 ? '0' : '') + m + ':' + (x < 10 ? '0' : '') + x; }
  function isMulti(q) { return Array.isArray(q.a); }
  function answered(x) { return isMulti(x.q) ? x.pick.length > 0 : x.pick != null; }
  function correct(x) {
    if (!answered(x)) return false;
    if (!isMulti(x.q)) return x.order[x.pick] === x.q.a;
    var chosen = x.pick.map(function (p) { return x.order[p]; }).sort();
    var want = x.q.a.slice().sort();
    return chosen.length === want.length && chosen.every(function (v, i) { return v === want[i]; });
  }

  function home() {
    clearInterval(timerId); root.innerHTML = '';
    var topics = {}; ALL.forEach(function (q) { topics[q.t] = (topics[q.t] || 0) + 1; });
    var opts = '<option value="' + ALL.length + '">All (' + ALL.length + ')</option>';
    if (ALL.length > 50) opts += '<option value="50">50</option>';
    if (ALL.length > 25) opts += '<option value="25">25</option>';
    root.appendChild(el('<div class="card"><p><b>' + ALL.length + ' original practice questions</b> (beginner / intermediate / advanced). Order and answer positions are randomized each attempt. Correct answers are hidden until you submit. These are <u>not</u> real or leaked exam questions.</p><p>Question count: <select id="ex-n">' + opts + '</select> &nbsp; Time: 1.5 min per question.</p><button class="pri" id="ex-go">Start exam</button></div>'));
    document.getElementById('ex-go').onclick = function () { start(parseInt(document.getElementById('ex-n').value, 10)); };
  }
  function start(n) {
    var qs = shuffle(ALL).slice(0, n).map(function (q) {
      var order = shuffle(q.o.map(function (_, i) { return i; }));
      return { q: q, order: order, pick: isMulti(q) ? [] : null };
    });
    S = { qs: qs, i: 0, left: Math.round(n * 90), done: false };
    timerId = setInterval(function () { S.left--; var t = document.getElementById('timer'); if (t) t.textContent = fmt(Math.max(0, S.left)); if (S.left <= 0) submit(); }, 1000);
    draw();
  }
  function draw() {
    root.innerHTML = ''; var cur = S.qs[S.i], q = cur.q, multi = isMulti(q);
    var top = el('<div style="display:flex;justify-content:space-between;align-items:center"><b>Question ' + (S.i + 1) + ' of ' + S.qs.length + '</b><span id="timer">' + fmt(S.left) + '</span></div>'); root.appendChild(top);
    var pal = el('<div class="pal"></div>').firstChild;
    S.qs.forEach(function (x, k) { var b = document.createElement('button'); b.textContent = k + 1; b.className = (answered(x) ? 'ans ' : '') + (k === S.i ? 'cur' : ''); b.onclick = function () { S.i = k; draw(); }; pal.appendChild(b); });
    root.appendChild(pal);
    var selTag = multi ? '<span class="tag">Select ' + q.a.length + '</span>' : '';
    var box = el('<div class="ex-q"><span class="tag">' + q.t + '</span><span class="tag">' + q.d + '</span><span class="tag">' + q.c + '</span>' + selTag + '<p>' + q.q + '</p></div>').firstChild;
    cur.order.forEach(function (oi, pos) {
      var sel = multi ? cur.pick.indexOf(pos) >= 0 : cur.pick === pos;
      var b = document.createElement('button'); b.className = 'opt' + (sel ? ' sel' : ''); b.innerHTML = String.fromCharCode(65 + pos) + '. ' + q.o[oi];
      b.onclick = function () {
        if (multi) { var ix = cur.pick.indexOf(pos); if (ix >= 0) cur.pick.splice(ix, 1); else cur.pick.push(pos); }
        else cur.pick = pos;
        draw();
      };
      box.appendChild(b);
    });
    root.appendChild(box);
    var nv = el('<div style="display:flex;gap:8px"><button id="pv">◀ Previous</button><button id="nx">Next ▶</button><button class="pri" id="sb" style="margin-left:auto">Submit exam</button></div>');
    root.appendChild(nv); nv.querySelector('#pv').disabled = S.i === 0; nv.querySelector('#nx').disabled = S.i === S.qs.length - 1;
    nv.querySelector('#pv').onclick = function () { S.i--; draw(); }; nv.querySelector('#nx').onclick = function () { S.i++; draw(); };
    nv.querySelector('#sb').onclick = function () { var un = S.qs.filter(function (x) { return !answered(x); }).length; if (!un || confirm(un + ' question(s) unanswered. Submit anyway?')) submit(); };
  }
  function submit() {
    clearInterval(timerId); root.innerHTML = ''; var score = 0, by = {};
    S.qs.forEach(function (x) { var ok = correct(x); if (ok) score++; var b = by[x.q.t] || (by[x.q.t] = { r: 0, n: 0 }); b.n++; if (ok) b.r++; });
    var pct = Math.round(100 * score / S.qs.length);
    var h = '<div class="card"><h3>Final score: ' + score + ' / ' + S.qs.length + ' (' + pct + '%)</h3><h4>Topic-wise performance</h4>';
    Object.keys(by).sort().forEach(function (t) { var b = by[t], p = Math.round(100 * b.r / b.n); h += '<p style="margin:6px 0">' + t + ': ' + b.r + '/' + b.n + ' (' + p + '%)</p><div class="bar"><i style="width:' + p + '%"></i></div>'; });
    h += '</div><button class="pri" id="rt">Retake / new attempt</button><h3>Review</h3>'; root.appendChild(el(h)); root.querySelector('#rt').onclick = home;
    S.qs.forEach(function (x, k) {
      var q = x.q, multi = isMulti(q), ok = correct(x);
      var box = el('<div class="ex-q"><b>' + (ok ? '✅ Correct' : !answered(x) ? '⚠️ Unanswered' : '❌ Incorrect') + '</b> · Q' + (k + 1) + ' <span class="tag">' + q.t + '</span><span class="tag">' + q.d + '</span><span class="tag">' + q.c + '</span><p>' + q.q + '</p></div>').firstChild;
      x.order.forEach(function (oi, pos) {
        var isAns = multi ? q.a.indexOf(oi) >= 0 : oi === q.a;
        var picked = multi ? x.pick.indexOf(pos) >= 0 : pos === x.pick;
        var b = document.createElement('div'); b.className = 'opt ' + (isAns ? 'good' : picked ? 'wrong' : ''); b.style.padding = '6px 14px'; b.style.border = '1px solid var(--line)'; b.style.borderRadius = '8px';
        b.innerHTML = String.fromCharCode(65 + pos) + '. ' + q.o[oi] + (isAns ? ' ✔' : picked ? ' ✘ (your answer)' : '');
        box.appendChild(b);
      });
      box.appendChild(el('<p><b>Why correct:</b> ' + q.w + '</p><p><b>Why the others are wrong:</b> ' + q.x + '</p><p><b>Concept tested:</b> ' + q.k + '</p>'));
      root.appendChild(box);
    });
    root.scrollIntoView();
  }
  home();
})();
