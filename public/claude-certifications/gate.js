/* CertGate: sign-in gate, progress sync and discussion for the Claude certification
   guides and prep hub.

   Rules:
   - The first TWO chapters (guide mode) / first two section views (hub mode) are free.
   - Everything beyond requires signing in — the site's email-OTP flow, which also
     creates the account. One account works across the whole site (same
     learner-session cookie), so signing in here signs you in everywhere.
   - When signed in, chapter progress syncs to /api/learner/progress so the learner
     can continue on any device, and a Discussion panel lets them comment
     (reading comments is open; posting requires sign-in). */
(function () {
  var GK = window.GUIDE_KEY || 'claude-cert';
  var TITLE = window.GUIDE_TITLE || 'this study guide';
  var MODE = window.GATE_MODE || 'guide'; // 'guide' (chapter-based) | 'hub' (interaction-based)
  var COURSE_ID = 'claude-cert-' + GK;
  var FREE_CHAPTERS = 2;  // guide mode: first two chapters are free
  var FREE_TICKS = 2;     // hub mode: first two section/track switches are free
  var auth = null;        // null = unknown, false = anonymous, {email,name} = signed in
  var authReady = [];     // callbacks waiting for the session check
  var gateEl = null;
  var locked = false;

  function store(k, v) { try { if (v === undefined) return JSON.parse(localStorage.getItem(k)); localStorage.setItem(k, JSON.stringify(v)); } catch (e) { return null; } }
  function api(path, body) {
    return fetch(path, body ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) } : undefined)
      .then(function (r) { return r.json().then(function (j) { j.__ok = r.ok; return j; }); });
  }
  function whenAuthKnown(fn) { if (auth !== null) fn(); else authReady.push(fn); }
  function escText(s) { var d = document.createElement('div'); d.textContent = String(s == null ? '' : s); return d.innerHTML; }

  /* ---------- styles ---------- */
  var css = '' +
    '.cg-backdrop{position:fixed;inset:0;background:rgba(15,15,20,.6);backdrop-filter:blur(5px);z-index:9000;display:flex;align-items:center;justify-content:center;padding:16px}' +
    '.cg-card{background:#fff;color:#1d1d1f;max-width:440px;width:100%;border-radius:20px;padding:28px;box-shadow:0 24px 70px rgba(0,0,0,.35);font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
    '.cg-card h3{margin:0 0 8px;font-size:21px;letter-spacing:-.02em}' +
    '.cg-card p{margin:0 0 14px;font-size:14.5px;line-height:1.5;color:#545458}' +
    '.cg-card input{width:100%;box-sizing:border-box;padding:11px 14px;border:1px solid #d2d2d7;border-radius:12px;font-size:15px;margin-bottom:10px;background:#fff;color:#1d1d1f}' +
    '.cg-btn{display:block;width:100%;box-sizing:border-box;padding:12px 18px;border:0;border-radius:980px;background:#0071e3;color:#fff;font-size:15px;font-weight:600;cursor:pointer;margin-bottom:8px}' +
    '.cg-btn:hover{background:#0077ed}.cg-btn:disabled{opacity:.6;cursor:default}' +
    '.cg-sub{display:block;width:100%;background:none;border:0;color:#6e6e73;font-size:13.5px;cursor:pointer;padding:8px;text-decoration:underline}' +
    '.cg-err{color:#c0392b;font-size:13px;margin:-4px 0 10px;min-height:16px}' +
    '.cg-badge{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#0071e3;margin-bottom:10px}' +
    '.cg-free{font-size:12px;color:#86868b;margin-top:2px}' +
    '.cg-chip{position:fixed;top:10px;right:12px;z-index:8000;background:#fff;border:1px solid #d2d2d7;border-radius:980px;padding:7px 14px;font-size:12.5px;font-weight:600;color:#1d1d1f;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.12);font-family:system-ui,sans-serif}' +
    '.cg-chip:hover{border-color:#0071e3;color:#0071e3}' +
    '.cg-toast{position:fixed;bottom:18px;left:50%;transform:translateX(-50%);z-index:8500;background:#1d1d1f;color:#fff;border-radius:14px;padding:12px 18px;font-size:13.5px;box-shadow:0 10px 30px rgba(0,0,0,.3);font-family:system-ui,sans-serif;display:flex;gap:12px;align-items:center;max-width:92vw}' +
    '.cg-toast a{color:#6db2ff;font-weight:600;text-decoration:none;white-space:nowrap}' +
    '.cg-toast button{background:none;border:0;color:#8e8e93;cursor:pointer;font-size:15px}' +
    /* discussion */
    '.cg-disc-btn{position:fixed;bottom:18px;right:16px;z-index:7900;background:#1d1d1f;color:#fff;border:0;border-radius:980px;padding:10px 16px;font-size:13px;font-weight:600;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.28);font-family:system-ui,sans-serif;display:flex;align-items:center;gap:7px}' +
    '.cg-disc-btn:hover{background:#333}' +
    '.cg-disc{position:fixed;bottom:66px;right:16px;z-index:7950;width:min(360px,92vw);max-height:min(480px,70vh);background:#fff;border:1px solid #e0e0e5;border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.3);font-family:system-ui,sans-serif;display:flex;flex-direction:column;overflow:hidden;color:#1d1d1f}' +
    '.cg-disc header{padding:13px 16px;border-bottom:1px solid #eee;display:flex;justify-content:space-between;align-items:center}' +
    '.cg-disc header b{font-size:14px}' +
    '.cg-disc header small{display:block;font-size:11px;color:#86868b;font-weight:400}' +
    '.cg-disc header button{background:none;border:0;font-size:15px;color:#86868b;cursor:pointer}' +
    '.cg-disc-list{flex:1;overflow-y:auto;padding:12px 16px;display:flex;flex-direction:column;gap:10px}' +
    '.cg-cmt{background:#f5f5f7;border-radius:12px;padding:9px 12px}' +
    '.cg-cmt b{font-size:12.5px}.cg-cmt time{font-size:10.5px;color:#86868b;margin-left:6px}' +
    '.cg-cmt p{margin:3px 0 0;font-size:13px;line-height:1.45;color:#3a3a3f;word-break:break-word;white-space:pre-wrap}' +
    '.cg-disc-form{border-top:1px solid #eee;padding:10px 12px;display:flex;gap:8px;align-items:flex-end}' +
    '.cg-disc-form textarea{flex:1;border:1px solid #d2d2d7;border-radius:12px;padding:8px 11px;font-size:13px;font-family:inherit;resize:none;min-height:38px;max-height:110px;background:#fff;color:#1d1d1f}' +
    '.cg-disc-form button{border:0;border-radius:980px;background:#0071e3;color:#fff;font-size:12.5px;font-weight:600;padding:9px 14px;cursor:pointer}' +
    '.cg-disc-empty{font-size:12.5px;color:#86868b;text-align:center;padding:14px 6px}' +
    '@media(prefers-color-scheme:dark){' +
    '.cg-disc{background:#1c1c1f;border-color:#3a3a3f;color:#f0f0f3}.cg-disc header{border-color:#333}' +
    '.cg-cmt{background:#2a2a2e}.cg-cmt p{color:#d6d6db}' +
    '.cg-disc-form{border-color:#333}.cg-disc-form textarea{background:#2a2a2e;border-color:#444;color:#f0f0f3}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------- sign-in modal ---------- */
  function showGate(lockMode) {
    // lockMode true = content is locked behind the gate (no close); false = voluntary sign-in (closable)
    if (gateEl) { gateEl.remove(); gateEl = null; }
    if (auth) return;
    locked = !!lockMode;
    var wrap = document.createElement('div'); wrap.className = 'cg-backdrop'; gateEl = wrap;
    var lead = locked
      ? '<p>You’ve read the free chapters of ' + TITLE + '. <b>Sign in free</b> to unlock the rest — it takes one email code, no password, and creates your Gennoor account if you don’t have one.</p>' +
        '<p class="cg-free">Your progress, exam scores and comments are saved, and the same account signs you in across all of Gennoor — courses, Learning Studio and the prep hub.</p>'
      : '<p>Sign in free with your email to save progress, keep exam scores, join discussions and continue on any device. One account works across all of Gennoor.</p>';
    wrap.innerHTML =
      '<div class="cg-card" role="dialog" aria-modal="true">' +
      '<span class="cg-badge">✦ Gennoor · Claude certification prep</span>' +
      '<h3>' + (locked ? 'Unlock the full course' : 'Sign in to Gennoor') + '</h3>' + lead +
      '<div id="cg-step"></div></div>';
    document.body.appendChild(wrap);
    var step = wrap.querySelector('#cg-step');

    function close() { wrap.remove(); gateEl = null; }

    function stepEmail() {
      step.innerHTML = '<input id="cg-email" type="email" placeholder="you@company.com" autocomplete="email">' +
        '<input id="cg-name" type="text" placeholder="Your name (optional)" autocomplete="name">' +
        '<div class="cg-err" id="cg-err"></div>' +
        '<button class="cg-btn" id="cg-send">Email me a sign-in code</button>' +
        (locked
          ? '<button class="cg-sub" id="cg-back-free">◂ Back to the free chapters</button>'
          : '<button class="cg-sub" id="cg-close">Not now</button>');
      var back = step.querySelector('#cg-back-free');
      if (back) back.onclick = function () { close(); goToFree(); };
      var cl = step.querySelector('#cg-close');
      if (cl) cl.onclick = close;
      step.querySelector('#cg-send').onclick = function () {
        var email = step.querySelector('#cg-email').value.trim();
        var name = step.querySelector('#cg-name').value.trim();
        var err = step.querySelector('#cg-err');
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'Please enter a valid email address.'; return; }
        this.disabled = true; this.textContent = 'Sending…';
        api('/api/send-otp', { email: email }).then(function (j) {
          if (j.__ok) stepCode(email, name);
          else { err.textContent = j.error || 'Could not send the code. Try again.'; var b = step.querySelector('#cg-send'); if (b) { b.disabled = false; b.textContent = 'Email me a sign-in code'; } }
        });
      };
    }
    function stepCode(email, name) {
      step.innerHTML = '<p style="margin-bottom:10px">We sent a 6-digit code to <b>' + escText(email) + '</b>.</p>' +
        '<input id="cg-code" inputmode="numeric" maxlength="6" placeholder="6-digit code" style="letter-spacing:.4em;text-align:center;font-size:18px">' +
        '<div class="cg-err" id="cg-err"></div>' +
        '<button class="cg-btn" id="cg-verify">Verify &amp; sign in</button>' +
        '<button class="cg-sub" id="cg-back">Use a different email</button>';
      step.querySelector('#cg-back').onclick = stepEmail;
      step.querySelector('#cg-verify').onclick = function () {
        var code = step.querySelector('#cg-code').value.trim();
        var err = step.querySelector('#cg-err');
        if (code.length !== 6) { err.textContent = 'Enter the 6-digit code from the email.'; return; }
        this.disabled = true; this.textContent = 'Verifying…';
        api('/api/verify-otp', { email: email, otp: code }).then(function (j) {
          if (!j.__ok) { err.textContent = j.error || 'Invalid code.'; var b = step.querySelector('#cg-verify'); if (b) { b.disabled = false; b.textContent = 'Verify & sign in'; } return; }
          api('/api/learner/login-otp', { email: email, name: name }).then(function (k) {
            if (k.__ok) { auth = { email: k.email, name: k.name }; close(); onSignedIn(); }
            else { err.textContent = k.error || 'Sign-in failed.'; var b2 = step.querySelector('#cg-verify'); if (b2) b2.disabled = false; }
          });
        });
      };
      step.querySelector('#cg-code').focus();
    }
    stepEmail();
  }

  function onSignedIn() {
    locked = false;
    renderChip();
    unhideContent();
    if (MODE === 'guide') { pushProgress(); pullProgress(); }
    if (discOpen) loadComments();
  }

  /* ---------- locking (guide mode) ---------- */
  function chapterIndex(id) {
    if (!window.CHAPTERS) return 0;
    for (var i = 0; i < window.CHAPTERS.length; i++) if (window.CHAPTERS[i].id === id) return i;
    return 0;
  }
  function currentChapter() {
    var id = (location.hash || '#').slice(1);
    if (id && window.CHAPTERS && window.CHAPTERS.some(function (c) { return c.id === id; })) return id;
    return window.CHAPTERS && window.CHAPTERS[0] ? window.CHAPTERS[0].id : '';
  }
  function goToFree() {
    if (MODE === 'guide' && window.CHAPTERS && window.CHAPTERS.length) {
      location.hash = window.CHAPTERS[Math.min(FREE_CHAPTERS - 1, window.CHAPTERS.length - 1)].id;
    }
    unhideContent();
  }
  function hideContent() { var m = document.getElementById('main'); if (m) m.style.visibility = 'hidden'; }
  function unhideContent() { var m = document.getElementById('main'); if (m) m.style.visibility = ''; }

  function enforceGuideGate() {
    if (MODE !== 'guide' || !window.CHAPTERS) return;
    var idx = chapterIndex(currentChapter());
    whenAuthKnown(function () {
      if (auth) return;
      if (idx >= FREE_CHAPTERS) { hideContent(); showGate(true); }
      else { unhideContent(); if (locked && gateEl) { gateEl.remove(); gateEl = null; locked = false; } }
    });
  }

  /* ---------- hub mode gate ---------- */
  var hubTicks = 0;
  function hubInteraction() {
    hubTicks++;
    whenAuthKnown(function () {
      if (!auth && hubTicks > FREE_TICKS && !gateEl) showGate(true);
    });
  }

  /* ---------- persistent chip ---------- */
  var chip;
  function renderChip() {
    if (chip) chip.remove();
    chip = document.createElement('button'); chip.className = 'cg-chip';
    if (MODE === 'hub') chip.style.top = '74px'; // below the hub's own sticky header
    if (auth) { chip.textContent = '✓ ' + (auth.name || auth.email); chip.title = 'Signed in — progress is saved. Open your dashboard.'; chip.onclick = function () { location.href = '/academy/dashboard'; }; }
    else { chip.textContent = 'Sign in'; chip.onclick = function () { showGate(false); }; }
    document.body.appendChild(chip);
  }

  /* ---------- progress sync (guide mode) ---------- */
  function markSeen() {
    if (MODE !== 'guide' || !window.CHAPTERS) return;
    var seen = store(GK + '.seen') || {}; var id = currentChapter(); if (!id) return;
    if (!seen[id]) { seen[id] = Date.now(); store(GK + '.seen', seen); }
    pushProgress(id);
  }
  function pushProgress(chapterId) {
    if (!auth || MODE !== 'guide' || !window.CHAPTERS) return;
    var done = store(GK + '.done') || {};
    var total = window.CHAPTERS.filter(function (c) { return !c.nocheck; }).length;
    var cnt = window.CHAPTERS.filter(function (c) { return !c.nocheck && done[c.id]; }).length;
    var cur = chapterId || currentChapter();
    api('/api/learner/progress', {
      courseId: COURSE_ID, chapterId: cur,
      currentSlide: chapterIndex(cur) + 1,
      totalSlides: window.CHAPTERS.length,
      completionPercent: total ? Math.round(100 * cnt / total) : 0,
      completed: total > 0 && cnt === total
    }).catch(function () { });
  }
  function pullProgress() {
    if (!auth || MODE !== 'guide') return;
    fetch('/api/learner/progress?courseId=' + encodeURIComponent(COURSE_ID)).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
      if (!j || !j.chapters) return;
      var last = null, lastTs = 0;
      Object.keys(j.chapters).forEach(function (cid) {
        var e = j.chapters[cid]; var ts = Date.parse(e.timestamp || e.Timestamp || 0) || 0;
        if (ts >= lastTs) { lastTs = ts; last = cid; }
      });
      if (last && last !== currentChapter() && window.CHAPTERS.some(function (c) { return c.id === last; })) {
        var ch = window.CHAPTERS.filter(function (c) { return c.id === last; })[0];
        var t = document.createElement('div'); t.className = 'cg-toast';
        t.innerHTML = '<span>Welcome back! You were on “' + ch.title + '”.</span><a href="#' + last + '">Continue ▸</a><button aria-label="Dismiss">✕</button>';
        t.querySelector('a').onclick = function () { t.remove(); };
        t.querySelector('button').onclick = function () { t.remove(); };
        document.body.appendChild(t);
        setTimeout(function () { if (t.parentNode) t.remove(); }, 15000);
      }
    }).catch(function () { });
  }

  /* ---------- discussion (comments) ---------- */
  var discOpen = false, discEl = null, discBtn = null;
  function topicId() {
    if (MODE === 'guide') return GK + '/' + (currentChapter() || 'general');
    var t = null;
    try { t = JSON.parse(localStorage.getItem('prephub.track')); } catch (e) { }
    return 'prep-hub/' + (t || 'general');
  }
  function topicLabel() {
    if (MODE === 'guide' && window.CHAPTERS) {
      var ch = window.CHAPTERS.filter(function (c) { return c.id === currentChapter(); })[0];
      return ch ? ch.title : 'this guide';
    }
    return 'this track';
  }
  function renderDiscButton() {
    if (discBtn) return;
    discBtn = document.createElement('button'); discBtn.className = 'cg-disc-btn';
    discBtn.innerHTML = '💬 Discussion';
    discBtn.onclick = function () { discOpen ? closeDisc() : openDisc(); };
    document.body.appendChild(discBtn);
  }
  function closeDisc() { discOpen = false; if (discEl) { discEl.remove(); discEl = null; } }
  function openDisc() {
    discOpen = true;
    if (discEl) discEl.remove();
    discEl = document.createElement('div'); discEl.className = 'cg-disc';
    discEl.innerHTML =
      '<header><div><b>Discussion</b><small id="cg-disc-topic"></small></div><button aria-label="Close">✕</button></header>' +
      '<div class="cg-disc-list" id="cg-disc-list"><div class="cg-disc-empty">Loading…</div></div>' +
      '<div class="cg-disc-form" id="cg-disc-form"></div>';
    discEl.querySelector('header button').onclick = closeDisc;
    document.body.appendChild(discEl);
    loadComments();
  }
  function loadComments() {
    if (!discEl) return;
    var topic = topicId();
    discEl.querySelector('#cg-disc-topic').textContent = topicLabel();
    var list = discEl.querySelector('#cg-disc-list');
    fetch('/api/cert-comments?topic=' + encodeURIComponent(topic)).then(function (r) { return r.ok ? r.json() : []; }).then(function (cs) {
      if (!discEl) return;
      if (!cs.length) list.innerHTML = '<div class="cg-disc-empty">No comments yet — start the discussion.</div>';
      else list.innerHTML = cs.map(function (c) {
        var when = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '';
        return '<div class="cg-cmt"><b>' + escText(c.authorName) + '</b><time>' + when + '</time><p>' + escText(c.content) + '</p></div>';
      }).join('');
      list.scrollTop = list.scrollHeight;
    }).catch(function () { list.innerHTML = '<div class="cg-disc-empty">Could not load comments.</div>'; });
    renderDiscForm();
  }
  function renderDiscForm() {
    if (!discEl) return;
    var form = discEl.querySelector('#cg-disc-form');
    whenAuthKnown(function () {
      if (!discEl) return;
      if (!auth) {
        form.innerHTML = '<button style="flex:1" id="cg-disc-signin">Sign in to comment</button>';
        form.querySelector('#cg-disc-signin').onclick = function () { showGate(false); };
        return;
      }
      form.innerHTML = '<textarea id="cg-disc-text" maxlength="2000" placeholder="Ask a question or share a tip…"></textarea><button id="cg-disc-send">Post</button>';
      form.querySelector('#cg-disc-send').onclick = function () {
        var ta = form.querySelector('#cg-disc-text');
        var text = ta.value.trim(); if (!text) return;
        this.disabled = true;
        api('/api/cert-comments', { topic: topicId(), content: text }).then(function (j) {
          var btn = form.querySelector('#cg-disc-send'); if (btn) btn.disabled = false;
          if (j.__ok) { ta.value = ''; loadComments(); }
          else alertErr(j.error || 'Could not post the comment.');
        });
      };
    });
  }
  function alertErr(msg) {
    var t = document.createElement('div'); t.className = 'cg-toast'; t.innerHTML = '<span>' + escText(msg) + '</span>';
    document.body.appendChild(t); setTimeout(function () { t.remove(); }, 3500);
  }

  /* ---------- wire up ---------- */
  function init() {
    fetch('/api/learner/session').then(function (r) { return r.json(); }).then(function (j) {
      auth = (j && j.authenticated) ? { email: j.email, name: j.name } : false;
      renderChip();
      authReady.forEach(function (f) { f(); }); authReady = [];
      if (auth && MODE === 'guide') pullProgress();
    }).catch(function () {
      auth = false; renderChip();
      authReady.forEach(function (f) { f(); }); authReady = [];
    });

    renderDiscButton();

    if (MODE === 'guide') {
      window.addEventListener('hashchange', function () {
        setTimeout(function () { enforceGuideGate(); markSeen(); if (discOpen) loadComments(); }, 250);
      });
      setTimeout(function () { enforceGuideGate(); markSeen(); }, 900);
      document.addEventListener('change', function (e) {
        if (e.target && e.target.getAttribute && e.target.getAttribute('data-done')) setTimeout(function () { pushProgress(); }, 100);
      });
    } else {
      window.CertGateHubTick = hubInteraction;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.CertGate = { show: function () { showGate(false); } };
})();
