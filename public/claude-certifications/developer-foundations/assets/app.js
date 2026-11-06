/* Shell: renders chapters, nav, search, progress, code highlight/copy, knowledge checks. */
(function () {
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  window.esc = esc;
  var KW = /\b(import|from|as|async|await|def|class|return|if|elif|else|for|in|with|try|except|raise|None|True|False|and|or|not|lambda|yield|pass)\b/g;
  function hl(src) {
    var out = '', re = /(#[^\n]*)|("""[\s\S]*?"""|'[^'\n]*'|"[^"\n]*")|(@\w+)|(\b\d+\.?\d*\b)|([\s\S])/g, m;
    var buf = '';
    function flush() { if (buf) { out += esc(buf).replace(KW, '<span class="k">$1</span>'); buf = ''; } }
    while ((m = re.exec(src))) {
      if (m[1]) { flush(); out += '<span class="c">' + esc(m[1]) + '</span>'; }
      else if (m[2]) { flush(); out += '<span class="s">' + esc(m[2]) + '</span>'; }
      else if (m[3]) { flush(); out += '<span class="d">' + esc(m[3]) + '</span>'; }
      else if (m[4]) { flush(); out += '<span class="n">' + m[4] + '</span>'; }
      else buf += m[5];
    }
    flush(); return out;
  }
  function copy(text, btn) {
    function ok() { btn.textContent = 'Copied ✓'; setTimeout(function () { btn.textContent = 'Copy'; }, 1500); }
    if (navigator.clipboard && window.isSecureContext !== false) { navigator.clipboard.writeText(text).then(ok, fallback); } else fallback();
    function fallback() { var ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); ok(); } catch (e) { btn.textContent = 'Press Ctrl+C'; } document.body.removeChild(ta); }
  }
  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }

  var main = document.getElementById('main'), nav = document.getElementById('nav');
  var GK = window.GUIDE_KEY || 'ccarf';
  var done = store(GK + '.done') || {};

  window.CHAPTERS.forEach(function (c) {
    var sec = document.createElement('section'); sec.className = 'chap'; sec.id = c.id;
    sec.innerHTML = '<h2>' + c.title + '</h2>' + (c.tag ? '<span class="tag ' + c.tag + '">' + (c.tag === 'core' ? 'Core exam topic' : 'Supplementary (beyond core objectives)') + '</span>' : '') + c.html +
      (c.nocheck ? '' : '<p><label><input type="checkbox" data-done="' + c.id + '"> Mark this chapter complete</label></p>');
    main.appendChild(sec);
    var a = document.createElement('a'); a.href = '#' + c.id; a.id = 'n-' + c.id; a.innerHTML = c.title + '<span class="d"></span>'; nav.appendChild(a);
  });

  document.querySelectorAll('pre code.py').forEach(function (c) {
    var raw = c.textContent; c.innerHTML = window.PyHL(raw);
    var b = document.createElement('button'); b.className = 'cp'; b.textContent = 'Copy'; b.onclick = function () { copy(raw, b); };
    c.parentNode.appendChild(b);
  });
  document.querySelectorAll('[data-player]').forEach(function (d) { window.CodePlayer.mount(d, d.getAttribute('data-player')); });
  document.querySelectorAll('[data-anim]').forEach(function (d) { var sp = window.ANIMS[d.getAttribute('data-anim')]; if (sp) window.Anim.mount(d, sp); else d.textContent = 'missing animation ' + d.getAttribute('data-anim'); });
  document.querySelectorAll('[data-kc]').forEach(function (d) {
    var id = d.getAttribute('data-kc'), qs = window.KC[id] || [];
    qs.forEach(function (q, i) {
      var det = document.createElement('details'), sm = document.createElement('summary');
      sm.innerHTML = '<span class="tag">' + q.t + '</span> Q' + (i + 1) + '. ' + q.q; det.appendChild(sm);
      var body = document.createElement('div');
      if (q.o) { body.innerHTML = '<ul>' + q.o.map(function (o, j) { return '<li>' + String.fromCharCode(65 + j) + '. ' + o + '</li>'; }).join('') + '</ul>'; }
      var ans = document.createElement('details'); ans.innerHTML = '<summary>Show answer &amp; explanation</summary><div><b>' + q.a + '</b><br>' + q.e + '</div>';
      body.appendChild(ans); det.appendChild(body); d.appendChild(det);
    });
  });

  function refresh() {
    var n = 0; window.CHAPTERS.forEach(function (c) { if (done[c.id]) n++; var el = document.querySelector('#n-' + c.id + ' .d'); if (el) el.textContent = done[c.id] ? '✓' : ''; });
    var total = window.CHAPTERS.filter(function (c) { return !c.nocheck; }).length, cnt = window.CHAPTERS.filter(function (c) { return !c.nocheck && done[c.id]; }).length;
    document.querySelector('#bar i').style.width = (100 * cnt / total) + '%'; document.getElementById('plabel').textContent = cnt + ' / ' + total + ' chapters complete';
  }
  document.querySelectorAll('[data-done]').forEach(function (cb) { var id = cb.getAttribute('data-done'); cb.checked = !!done[id]; cb.onchange = function () { done[id] = cb.checked; store(GK + '.done', done); refresh(); }; });
  refresh();

  // Search: matches section text, lists chapters with a snippet.
  var idx = window.CHAPTERS.map(function (c) { return { id: c.id, title: c.title, text: document.getElementById(c.id).textContent }; });
  var qi = document.getElementById('q'), res = document.getElementById('res');
  qi.oninput = function () {
    var v = qi.value.trim().toLowerCase(); res.innerHTML = ''; if (v.length < 2) return;
    idx.forEach(function (c) {
      var i = c.text.toLowerCase().indexOf(v); if (i < 0) return;
      var a = document.createElement('a'); a.href = '#' + c.id; a.innerHTML = '<b>' + c.title + '</b><br><small>…' + esc(c.text.slice(Math.max(0, i - 30), i + 60)) + '…</small>'; res.appendChild(a);
    });
    if (!res.children.length) res.textContent = 'No matches.';
  };
  // Pages: one chapter visible at a time, driven by the URL hash.
  var secs = Array.prototype.slice.call(document.querySelectorAll('section.chap'));
  secs.forEach(function (sec, k) {
    var pg = document.createElement('div'); pg.className = 'pager';
    var pv = document.createElement('button'), nx = document.createElement('button');
    pv.textContent = k ? '◀ ' + window.CHAPTERS[k - 1].title : ''; nx.textContent = k < secs.length - 1 ? window.CHAPTERS[k + 1].title + ' ▶' : '';
    pv.style.visibility = k ? 'visible' : 'hidden'; nx.style.visibility = k < secs.length - 1 ? 'visible' : 'hidden';
    pv.onclick = function () { location.hash = secs[k - 1].id; }; nx.onclick = function () { location.hash = secs[k + 1].id; };
    pg.appendChild(pv); pg.appendChild(nx); sec.appendChild(pg);
  });
  function showPage() {
    var id = location.hash.slice(1), cur = secs.filter(function (x) { return x.id === id; })[0] || secs[0];
    secs.forEach(function (x) { x.classList.toggle('active', x === cur); });
    document.querySelectorAll('#nav a').forEach(function (a) { a.classList.toggle('on', a.id === 'n-' + cur.id); });
    window.scrollTo(0, 0); if (window.innerWidth <= 900) document.body.classList.add('side-closed');
  }
  window.addEventListener('hashchange', showPage);
  var menu = document.getElementById('menu');
  if (window.innerWidth <= 900) document.body.classList.add('side-closed');
  menu.onclick = function () { document.body.classList.toggle('side-closed'); };
  res.onclick = function () { qi.value = ''; res.innerHTML = ''; };
  document.getElementById('theme').onclick = function () { var r = document.documentElement, dark = getComputedStyle(r).getPropertyValue('--bg').trim() === '#17161a'; r.setAttribute('data-theme', dark ? 'light' : 'dark'); };
  showPage();
})();
