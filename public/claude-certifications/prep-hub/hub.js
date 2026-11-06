/* Claude Certification Prep Hub engine.
   Data comes from data.js (window.EXAM_DATA: blueprint/matrix/code content per track)
   and banks.js (window.CERT_BANKS: the full practice question banks).
   Quiz UX: paginated pages of 10, professional collapsible question cards (open by
   default), per-question Check answer with rationale, progress persisted locally. */
(function () {
  'use strict';

  var TRACKS = window.EXAM_DATA;
  var BANKS = window.CERT_BANKS || {};
  var SLUGS = {
    'ccas-f': 'associate-foundations',
    'ccdv-f': 'developer-foundations',
    'ccar-f': 'architect-foundations',
    'ccar-p': 'architect-professional',
  };
  var PAGE_SIZE = 10;

  /* ---------- persistence (only prephub.* keys, never clear foreign state) ---------- */
  function store(k, v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem('prephub.' + k));
      localStorage.setItem('prephub.' + k, JSON.stringify(v));
    } catch (e) { return null; }
  }

  var currentTrack = store('track') || 'ccas-f';
  if (!TRACKS[currentTrack]) currentTrack = 'ccas-f';
  var currentSection = 'blueprint';
  var matrixSearch = '';
  var matrixCat = 'ALL';
  var quizState = store('quiz') || {}; // {qid: {sel:[], sub:bool, ok:bool}}
  var quizPage = {};                   // per-track current page (session only)
  var collapsed = {};                  // per-question collapsed flag (session only)

  function saveQuiz() { store('quiz', quizState); }
  function tick() { if (window.CertGateHubTick) window.CertGateHubTick(); }

  function bank(trackId) { return BANKS[trackId] || []; }
  function trackScore(trackId) {
    var qs = bank(trackId), c = 0, done = 0;
    qs.forEach(function (q) {
      var s = quizState[q.id];
      if (s && s.sub) { done++; if (s.ok) c++; }
    });
    return { correct: c, answered: done, total: qs.length };
  }

  /* ---------- shell ---------- */
  function switchTrack(id) {
    currentTrack = id; store('track', id);
    matrixSearch = ''; matrixCat = 'ALL';
    toggleDrawer(false);
    renderAll();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    tick();
  }
  function switchSection(id) {
    currentSection = id;
    renderTabs(); renderSection();
    tick();
  }
  function renderAll() { renderDrawer(); renderPills(); renderHero(); renderTabs(); renderSection(); renderGlobalScore(); }

  function toggleDrawer(force) {
    var d = document.getElementById('sidebarDrawer'), b = document.getElementById('drawerBackdrop');
    var open = !d.classList.contains('-translate-x-full');
    var next = typeof force === 'boolean' ? force : !open;
    if (next) { b.classList.remove('hidden'); setTimeout(function () { b.classList.remove('opacity-0'); }, 10); d.classList.remove('-translate-x-full'); }
    else { b.classList.add('opacity-0'); d.classList.add('-translate-x-full'); setTimeout(function () { b.classList.add('hidden'); }, 250); }
  }
  function toggleTheme() {
    var dark = document.documentElement.classList.toggle('dark');
    store('theme', dark ? 'dark' : 'light');
    var icon = document.getElementById('themeIcon');
    icon.className = dark ? 'ph ph-sun text-xl text-amber-400' : 'ph ph-moon text-xl text-slate-700';
  }
  (function initTheme() {
    var t = store('theme');
    if (t === 'light') document.documentElement.classList.remove('dark');
    if (t === 'dark') document.documentElement.classList.add('dark');
  })();

  function showToast(msg) {
    var box = document.getElementById('toastBox');
    document.getElementById('toastMessage').textContent = msg;
    box.classList.remove('hidden');
    setTimeout(function () { box.classList.add('hidden'); }, 2400);
  }

  /* ---------- drawer + pills + hero ---------- */
  function renderDrawer() {
    var el = document.getElementById('drawerTrackList');
    document.getElementById('activeTrackSubtitle').textContent =
      TRACKS[currentTrack].title + ' · ' + bank(currentTrack).length + '-question practice bank';
    el.innerHTML = Object.keys(TRACKS).map(function (id) {
      var t = TRACKS[id], sel = id === currentTrack, sc = trackScore(id);
      return '<button onclick="HUB.switchTrack(\'' + id + '\')" class="w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 ' +
        (sel ? 'bg-claude-500/10 border-claude-500 text-slate-900 dark:text-white shadow-sm'
             : 'bg-stone-50/70 dark:bg-slate-800/40 border-stone-200 dark:border-slate-800 hover:border-claude-400/50 text-slate-600 dark:text-slate-300') + '">' +
        '<div class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ' + (sel ? 'bg-claude-500 text-white' : 'bg-stone-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300') + '">' +
        '<i class="ph-fill ' + t.icon + ' text-xl"></i></div>' +
        '<div class="flex-1 min-w-0">' +
        '<div class="flex items-center justify-between gap-2">' +
        '<span class="text-[11px] font-mono uppercase tracking-wider text-claude-500 font-semibold">' + t.code + '</span>' +
        '<span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-stone-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300">' + sc.correct + '/' + sc.total + '</span></div>' +
        '<h3 class="font-bold text-sm mt-0.5">' + t.title + '</h3>' +
        '<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">' + t.role + '</p></div></button>';
    }).join('');
    var sc = overallScore();
    var bar = document.getElementById('drawerProgressBar');
    if (bar) bar.style.width = (sc.total ? Math.round(100 * sc.answered / sc.total) : 0) + '%';
  }
  function renderPills() {
    Object.keys(TRACKS).forEach(function (id) {
      var p = document.getElementById('topPill-' + id); if (!p) return;
      p.className = 'top-pill px-3 py-1.5 rounded-lg text-xs font-semibold transition ' +
        (id === currentTrack ? 'bg-claude-500 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:bg-stone-200/70 dark:hover:bg-slate-700/60');
    });
  }
  function renderHero() {
    var t = TRACKS[currentTrack], n = bank(currentTrack).length;
    document.getElementById('trackHero').innerHTML =
      '<div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">' +
      '<div class="space-y-3 max-w-3xl">' +
      '<div class="flex flex-wrap items-center gap-2">' +
      '<span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold uppercase bg-claude-500 text-white">' + t.code + '</span>' +
      '<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-stone-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300">' + t.level + '</span>' +
      '<span class="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">Full practice bank · ' + n + ' questions</span></div>' +
      '<h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight">' + t.title + '</h2>' +
      '<p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">' + t.summary + '</p>' +
      '<div class="flex flex-wrap gap-2.5 pt-1">' +
      '<a href="/claude/certifications/' + SLUGS[currentTrack] + '" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-claude-500 hover:bg-claude-600 text-white transition">Open the full course ▸</a>' +
      '<a href="/claude-certifications/' + SLUGS[currentTrack] + '" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 hover:border-claude-500/60 transition">Interactive study guide</a></div></div>' +
      '<div class="grid grid-cols-2 gap-3 shrink-0">' +
      t.stats.map(function (s) {
        return '<div class="p-3.5 rounded-xl bg-white/80 dark:bg-slate-800/70 border border-stone-200/90 dark:border-slate-700/70">' +
          '<div class="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">' + s.label + '</div>' +
          '<div class="text-sm font-bold mt-1 text-slate-800 dark:text-slate-100">' + s.value + '</div></div>';
      }).join('') + '</div></div>';
  }
  function renderTabs() {
    ['blueprint', 'matrix', 'code', 'quiz'].forEach(function (tab) {
      var b = document.getElementById('secBtn-' + tab); if (!b) return;
      b.className = 'sec-tab flex items-center justify-center sm:justify-start gap-2.5 px-4 py-3 rounded-xl font-semibold text-xs sm:text-sm border transition ' +
        (tab === currentSection ? 'bg-claude-500 text-white border-claude-500 shadow-md shadow-claude-500/20'
          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-stone-200 dark:border-slate-800 hover:border-claude-500/40');
    });
  }

  /* ---------- sections ---------- */
  function renderSection() {
    var vp = document.getElementById('sectionViewport'), t = TRACKS[currentTrack];
    if (currentSection === 'blueprint') vp.innerHTML = renderBlueprint(t);
    else if (currentSection === 'matrix') vp.innerHTML = renderMatrix(t);
    else if (currentSection === 'code') vp.innerHTML = renderCode(t);
    else vp.innerHTML = renderQuiz();
    vp.classList.remove('animate-fade-in'); void vp.offsetWidth; vp.classList.add('animate-fade-in');
  }

  function renderBlueprint(t) {
    return '<div class="space-y-6">' +
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2"><div>' +
      '<h3 class="text-lg font-bold flex items-center gap-2"><i class="ph-fill ph-compass text-claude-500 text-xl"></i><span>What the ' + t.code + ' exam asks</span></h3>' +
      '<p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Tested domains, weighting, and the high-yield takeaways.</p></div>' +
      '<button onclick="HUB.switchSection(\'matrix\')" class="self-start sm:self-auto text-xs font-semibold text-claude-500 hover:underline flex items-center gap-1"><span>Jump to the decision matrix</span><i class="ph ph-arrow-right"></i></button></div>' +
      '<div class="grid grid-cols-1 gap-5">' +
      t.domains.map(function (d) {
        return '<div class="rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">' +
          '<div class="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-stone-100 dark:border-slate-800">' +
          '<div class="flex items-center gap-3"><div class="w-10 h-10 rounded-xl bg-claude-500/15 text-claude-500 flex items-center justify-center"><i class="ph-fill ' + d.icon + ' text-xl"></i></div>' +
          '<h4 class="font-bold text-base sm:text-lg">' + d.title + '</h4></div>' +
          '<span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-claude-500/15 text-claude-500 border border-claude-500/30">Weight: ' + d.weight + '</span></div>' +
          '<ul class="space-y-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">' +
          d.points.map(function (p) { return '<li class="flex items-start gap-2.5"><i class="ph-fill ph-check-circle text-emerald-500 text-base mt-1 shrink-0"></i><span>' + p + '</span></li>'; }).join('') +
          '</ul></div>';
      }).join('') + '</div></div>';
  }

  function matrixRows(t) {
    return t.decisionMatrix.filter(function (r) {
      var okCat = matrixCat === 'ALL' || r.category === matrixCat;
      var q = matrixSearch.toLowerCase().trim();
      var okQ = !q || r.trigger.toLowerCase().indexOf(q) >= 0 || r.action.toLowerCase().indexOf(q) >= 0 || r.category.toLowerCase().indexOf(q) >= 0;
      return okCat && okQ;
    });
  }
  function matrixCardsHtml(rows) {
    if (!rows.length) return '<div class="col-span-2 p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-slate-500">No matching patterns. Clear the search to see everything.</div>';
    return rows.map(function (r) {
      return '<div class="rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-5 flex flex-col justify-between gap-3 shadow-sm">' +
        '<div><div class="flex items-center justify-between gap-2 mb-2">' +
        '<span class="text-[11px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-stone-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-semibold">' + r.category + '</span>' +
        '<span class="text-xs text-slate-400 font-mono">IF YOU SEE ↓</span></div>' +
        '<p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-snug">“' + r.trigger + '”</p></div>' +
        '<div class="pt-3 border-t border-stone-100 dark:border-slate-800/80">' +
        '<div class="text-[11px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold mb-1 flex items-center gap-1"><i class="ph-fill ph-arrow-elbow-down-right"></i> THE ANSWER PATTERN</div>' +
        '<p class="text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 font-medium leading-relaxed">' + r.action + '</p></div></div>';
    }).join('');
  }
  function renderMatrix(t) {
    var cats = ['ALL'];
    t.decisionMatrix.forEach(function (r) { if (cats.indexOf(r.category) < 0) cats.push(r.category); });
    return '<div class="space-y-5">' +
      '<div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-stone-200 dark:border-slate-800"><div>' +
      '<h3 class="text-lg font-bold flex items-center gap-2"><i class="ph-fill ph-lightning text-amber-500 text-xl"></i><span>Decision matrix — “if you see X, choose Y”</span></h3>' +
      '<p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Pattern-matching guide from question stems to the right answer family.</p></div>' +
      '<div class="relative w-full md:w-80"><i class="ph ph-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>' +
      '<input type="text" value="' + matrixSearch.replace(/"/g, '&quot;') + '" oninput="HUB.matrixSearch(this.value)" placeholder="Search scenarios (e.g. HIPAA, JSON, hooks)…" class="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 focus:outline-none focus:border-claude-500"/></div></div>' +
      '<div class="flex flex-wrap items-center gap-2">' +
      cats.map(function (c) {
        return '<button onclick="HUB.matrixCat(\'' + c.replace(/'/g, "\\'") + '\')" class="px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ' +
          (matrixCat === c ? 'bg-claude-500 text-white border-claude-500' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-stone-200 dark:border-slate-800 hover:border-claude-500/40') + '">' + c + '</button>';
      }).join('') + '</div>' +
      '<div id="matrixResultsList" class="grid grid-cols-1 md:grid-cols-2 gap-4">' + matrixCardsHtml(matrixRows(t)) + '</div></div>';
  }

  function renderCode(t) {
    return '<div class="space-y-6"><div>' +
      '<h3 class="text-lg font-bold flex items-center gap-2"><i class="ph-fill ph-code-block text-claude-500 text-xl"></i><span>Reference code &amp; configuration patterns</span></h3>' +
      '<p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Copyable blueprints reflecting the rules this track tests.</p></div>' +
      '<div class="space-y-6">' +
      t.codePatterns.map(function (cp, i) {
        return '<div class="rounded-2xl overflow-hidden border border-stone-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">' +
          '<div class="p-4 sm:p-5 border-b border-stone-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3"><div>' +
          '<div class="flex items-center gap-2"><span class="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-claude-500/15 text-claude-500">' + cp.tag + '</span>' +
          '<span class="text-xs font-mono uppercase text-slate-400">' + cp.lang + '</span></div>' +
          '<h4 class="font-bold text-base mt-1">' + cp.title + '</h4>' +
          '<p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">' + cp.description + '</p></div>' +
          '<button onclick="HUB.copyCode(' + i + ')" class="px-3.5 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-claude-500 hover:text-white dark:bg-slate-800 dark:hover:bg-claude-500 text-slate-700 dark:text-slate-200 border border-stone-200 dark:border-slate-700 transition flex items-center gap-1.5"><i class="ph ph-copy text-sm"></i><span>Copy</span></button></div>' +
          '<pre id="codeBlock-' + i + '" class="p-4 sm:p-5 bg-slate-950 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed">' + escapeHtml(cp.code) + '</pre></div>';
      }).join('') + '</div></div>';
  }
  function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function copyCode(i) {
    var el = document.getElementById('codeBlock-' + i); if (!el) return;
    var ta = document.createElement('textarea'); ta.value = el.innerText; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast('Code copied to clipboard'); } catch (e) { showToast('Press Ctrl+C to copy'); }
    document.body.removeChild(ta);
  }

  /* ---------- quiz: paginated, professional, collapsible ---------- */
  function page() { return quizPage[currentTrack] || 0; }
  function pageCount() { return Math.max(1, Math.ceil(bank(currentTrack).length / PAGE_SIZE)); }

  function renderQuiz() {
    var qs = bank(currentTrack), t = TRACKS[currentTrack], sc = trackScore(currentTrack);
    if (!qs.length) return '<div class="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-slate-500">The practice bank is loading… refresh if this persists.</div>';
    var p = page(), pages = pageCount();
    var start = p * PAGE_SIZE, slice = qs.slice(start, start + PAGE_SIZE);
    var pct = sc.total ? Math.round(100 * sc.answered / sc.total) : 0;
    return '<div class="space-y-5">' +
      // header: progress + reset
      '<div class="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">' +
      '<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div>' +
      '<h3 class="text-lg font-bold flex items-center gap-2"><i class="ph-fill ph-exam text-claude-500 text-xl"></i><span>Practice exam — ' + t.code + '</span></h3>' +
      '<p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400">' + qs.length + ' original practice questions in pages of ' + PAGE_SIZE + '. Answer, then <b>Check answer</b> for the rationale. Your progress stays on this device.</p></div>' +
      '<div class="flex items-center gap-3 self-start sm:self-auto">' +
      '<div class="px-4 py-2 rounded-xl bg-claude-500/10 border border-claude-500/30 text-claude-500 font-bold text-sm whitespace-nowrap">' + sc.correct + ' / ' + sc.answered + ' correct</div>' +
      '<button onclick="HUB.resetTrack()" class="text-xs text-rose-500 hover:underline font-medium whitespace-nowrap">Reset track</button></div></div>' +
      '<div class="mt-3 w-full h-1.5 rounded-full bg-stone-200 dark:bg-slate-800 overflow-hidden"><div class="h-full bg-gradient-to-r from-claude-500 to-emerald-500 transition-all" style="width:' + pct + '%"></div></div>' +
      '<p class="text-[11px] text-slate-400 mt-1.5">' + sc.answered + ' of ' + sc.total + ' answered</p></div>' +
      pagerHtml(p, pages) +
      '<div class="space-y-4">' + slice.map(function (q, i) { return '<div id="qc-' + q.id + '">' + questionCard(q, start + i) + '</div>'; }).join('') + '</div>' +
      pagerHtml(p, pages) +
      '</div>';
  }

  function pagerHtml(p, pages) {
    if (pages <= 1) return '';
    var around = [];
    for (var i = 0; i < pages; i++) around.push(i);
    return '<div class="flex flex-wrap items-center justify-center gap-1.5">' +
      '<button ' + (p === 0 ? 'disabled class="opacity-40 ' : 'onclick="HUB.quizGo(' + (p - 1) + ')" class="hover:border-claude-500/60 ') +
      'px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition">◀ Prev</button>' +
      around.map(function (i) {
        var pageQs = bank(currentTrack).slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
        var done = pageQs.every(function (q) { return quizState[q.id] && quizState[q.id].sub; });
        return '<button onclick="HUB.quizGo(' + i + ')" class="w-9 h-9 rounded-lg text-xs font-bold border transition ' +
          (i === p ? 'bg-claude-500 text-white border-claude-500'
            : done ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-stone-200 dark:border-slate-800 hover:border-claude-500/60') + '">' + (i + 1) + '</button>';
      }).join('') +
      '<button ' + (p >= pages - 1 ? 'disabled class="opacity-40 ' : 'onclick="HUB.quizGo(' + (p + 1) + ')" class="hover:border-claude-500/60 ') +
      'px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 transition">Next ▶</button></div>';
  }

  function questionCard(q, idx) {
    var s = quizState[q.id] || { sel: [], sub: false, ok: false };
    var isMulti = q.type === 'multi';
    var isCollapsed = !!collapsed[q.id];
    var border = s.sub ? (s.ok ? 'border-emerald-500/60' : 'border-rose-500/60') : 'border-stone-200 dark:border-slate-800';
    var head =
      '<button onclick="HUB.toggleQ(\'' + q.id + '\')" class="w-full flex items-center justify-between gap-3 text-left" aria-expanded="' + (!isCollapsed) + '">' +
      '<div class="flex items-center gap-2.5 flex-wrap">' +
      '<span class="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-stone-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Q' + (idx + 1) + '</span>' +
      '<span class="text-xs font-semibold px-2.5 py-0.5 rounded-full ' + (isMulti ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30' : 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30') + '">' + (isMulti ? 'Select ' + q.correct.length : 'Single choice') + '</span>' +
      (s.sub ? '<span class="text-xs font-bold ' + (s.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400') + '">' + (s.ok ? '✓ Correct' : '✗ Incorrect') + '</span>' : '') +
      '</div>' +
      '<i class="ph ph-caret-' + (isCollapsed ? 'down' : 'up') + ' text-lg text-slate-400 shrink-0"></i></button>' +
      (isCollapsed ? '<p class="text-xs text-slate-400 mt-2 truncate">' + q.stem.split('\n')[0] + '</p>' : '');
    if (isCollapsed) {
      return '<div class="rounded-2xl bg-white dark:bg-slate-900 border ' + border + ' p-4 sm:p-5 shadow-sm transition">' + head + '</div>';
    }
    var body =
      '<p class="text-sm sm:text-[15px] font-semibold text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed mt-4 mb-4">' + q.stem + '</p>' +
      '<div class="space-y-2.5">' +
      q.options.map(function (opt, oi) {
        var sel = s.sel.indexOf(oi) >= 0, right = q.correct.indexOf(oi) >= 0;
        var style = 'bg-stone-50 dark:bg-slate-800/60 border-stone-200 dark:border-slate-700/80 hover:border-claude-500/50';
        if (s.sub) {
          if (right) style = 'bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-medium';
          else if (sel) style = 'bg-rose-500/15 border-rose-500 text-rose-950 dark:text-rose-200';
          else style = 'bg-stone-50 dark:bg-slate-800/40 border-stone-200 dark:border-slate-800 opacity-80';
        } else if (sel) style = 'bg-claude-500/15 border-claude-500 text-slate-900 dark:text-white font-medium';
        return '<button onclick="HUB.pick(\'' + q.id + '\',' + oi + ')" ' + (s.sub ? 'disabled' : '') +
          ' class="w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition flex items-start gap-3 ' + style + '">' +
          '<span class="mt-0.5 w-5 h-5 rounded-' + (isMulti ? 'md' : 'full') + ' border flex items-center justify-center shrink-0 text-[10px] font-bold ' + (sel ? 'border-claude-500 bg-claude-500 text-white' : 'border-slate-400 text-slate-400') + '">' + String.fromCharCode(65 + oi) + '</span>' +
          '<span class="flex-1 leading-relaxed">' + opt + (s.sub && right ? ' <b>✔</b>' : '') + '</span></button>';
      }).join('') + '</div>' +
      '<div class="mt-4 pt-4 border-t border-stone-100 dark:border-slate-800">' +
      (!s.sub
        ? '<button onclick="HUB.check(\'' + q.id + '\')" class="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-claude-500 hover:bg-claude-600 text-white shadow-sm transition">Check answer</button>'
        : '<div class="space-y-3"><div class="flex items-center justify-between">' +
          '<span class="text-xs sm:text-sm font-bold flex items-center gap-1.5 ' + (s.ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400') + '">' +
          '<i class="ph-fill ' + (s.ok ? 'ph-check-circle' : 'ph-x-circle') + ' text-lg"></i>' + (s.ok ? 'Correct' : 'Incorrect — read the rationale below') + '</span>' +
          '<button onclick="HUB.retry(\'' + q.id + '\')" class="text-xs text-slate-400 hover:text-claude-500 underline">Retry</button></div>' +
          '<div class="p-3.5 rounded-xl bg-stone-100 dark:bg-slate-800/90 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"><b class="text-slate-900 dark:text-white">Why:</b> ' + q.explanation + '</div></div>') +
      '</div>';
    return '<div class="rounded-2xl bg-white dark:bg-slate-900 border ' + border + ' p-4 sm:p-6 shadow-sm transition">' + head + body + '</div>';
  }

  function redrawCard(qid) {
    var holder = document.getElementById('qc-' + qid); if (!holder) return;
    var qs = bank(currentTrack);
    var idx = -1, q = null;
    qs.forEach(function (x, i) { if (x.id === qid) { idx = i; q = x; } });
    if (q) holder.innerHTML = questionCard(q, idx);
  }

  function findQ(qid) {
    var qs = bank(currentTrack);
    for (var i = 0; i < qs.length; i++) if (qs[i].id === qid) return qs[i];
    return null;
  }
  function pick(qid, oi) {
    var q = findQ(qid); if (!q) return;
    var s = quizState[qid] || { sel: [], sub: false, ok: false };
    if (s.sub) return;
    if (q.type === 'multi') {
      var at = s.sel.indexOf(oi);
      if (at >= 0) s.sel.splice(at, 1); else s.sel.push(oi);
    } else s.sel = [oi];
    quizState[qid] = s; redrawCard(qid);
  }
  function check(qid) {
    var q = findQ(qid); if (!q) return;
    var s = quizState[qid] || { sel: [], sub: false, ok: false };
    if (!s.sel.length) { showToast('Select an answer first.'); return; }
    var a = s.sel.slice().sort().join(','), b = q.correct.slice().sort().join(',');
    s.sub = true; s.ok = a === b; quizState[qid] = s;
    saveQuiz(); redrawCard(qid); renderGlobalScore(); renderDrawer();
    tick();
  }
  function retry(qid) { delete quizState[qid]; saveQuiz(); redrawCard(qid); renderGlobalScore(); renderDrawer(); }
  function toggleQ(qid) { collapsed[qid] = !collapsed[qid]; redrawCard(qid); }
  function quizGo(p) {
    quizPage[currentTrack] = Math.max(0, Math.min(pageCount() - 1, p));
    renderSection();
    var vp = document.getElementById('sectionViewport');
    if (vp) vp.scrollIntoView({ behavior: 'smooth', block: 'start' });
    tick();
  }
  function resetTrack() {
    if (!confirm('Reset your answers for this track?')) return;
    bank(currentTrack).forEach(function (q) { delete quizState[q.id]; });
    saveQuiz(); renderSection(); renderDrawer(); renderGlobalScore();
    showToast('Track progress reset.');
  }
  function resetAll() {
    if (!confirm('Reset your answers for ALL four tracks?')) return;
    quizState = {}; saveQuiz(); renderAll();
    showToast('All practice progress reset.');
  }

  function overallScore() {
    var c = 0, a = 0, n = 0;
    Object.keys(TRACKS).forEach(function (id) { var s = trackScore(id); c += s.correct; a += s.answered; n += s.total; });
    return { correct: c, answered: a, total: n };
  }
  function renderGlobalScore() {
    var s = overallScore();
    var el = document.getElementById('globalScoreBadge');
    if (el) el.textContent = s.correct + ' / ' + s.answered;
  }

  /* ---------- search in matrix (live) ---------- */
  function setMatrixSearch(v) {
    matrixSearch = v;
    var list = document.getElementById('matrixResultsList');
    if (list) list.innerHTML = matrixCardsHtml(matrixRows(TRACKS[currentTrack]));
  }
  function setMatrixCat(c) { matrixCat = c; renderSection(); }

  /* ---------- public API ---------- */
  window.HUB = {
    switchTrack: switchTrack, switchSection: switchSection,
    toggleDrawer: toggleDrawer, toggleTheme: toggleTheme,
    matrixSearch: setMatrixSearch, matrixCat: setMatrixCat,
    copyCode: copyCode,
    pick: pick, check: check, retry: retry, toggleQ: toggleQ, quizGo: quizGo,
    resetTrack: resetTrack, resetAll: resetAll,
  };

  renderAll();
})();
