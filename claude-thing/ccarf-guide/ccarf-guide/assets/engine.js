/* Time-based SVG animation engine. Independent controls per widget; nothing autoplays. */
(function () {
  var NS = 'http://www.w3.org/2000/svg', STEP_MS = 5000, EDGE_FRAC = 0.45, W = 136;
  function s(tag, a, p) { var e = document.createElementNS(NS, tag); for (var k in a || {}) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function h(tag, cls, txt, p) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; if (p) p.appendChild(e); return e; }
  function wrap(t, max) { // wrap at spaces; a single long token is shrunk instead (returns [lines, fontScale])
    var words = String(t).split(' '), lines = [''], sc = 1;
    words.forEach(function (w) { var l = lines[lines.length - 1]; if (!l) lines[lines.length - 1] = w; else if ((l + ' ' + w).length <= max) lines[lines.length - 1] = l + ' ' + w; else lines.push(w); });
    lines.forEach(function (l) { if (l.length > max) sc = Math.min(sc, max / l.length); });
    return [lines.slice(0, 2), Math.max(sc, 0.74)];
  }
  function clip(a, b) { // point on b's rectangle boundary toward a
    var dx = a.x - b.x, dy = a.y - b.y, t = Math.min(dx ? (b.w / 2 + 3) / Math.abs(dx) : 1e9, dy ? (b.h / 2 + 3) / Math.abs(dy) : 1e9);
    return { x: b.x + dx * t, y: b.y + dy * t };
  }
  function partial(pts, f) { // polyline up to fraction f of its length
    var L = 0, i, seg = []; for (i = 1; i < pts.length; i++) { seg.push(Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)); L += seg[i - 1]; }
    var want = L * f, out = [pts[0]], acc = 0;
    for (i = 0; i < seg.length; i++) { if (acc + seg[i] >= want) { var r = seg[i] ? (want - acc) / seg[i] : 0; out.push({ x: pts[i].x + (pts[i + 1].x - pts[i].x) * r, y: pts[i].y + (pts[i + 1].y - pts[i].y) * r }); return out; } out.push(pts[i + 1]); acc += seg[i]; }
    return out;
  }
  function pathD(pts) { return pts.map(function (p, i) { return (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }).join(' '); }
  function split(text) { // banner title / body from a step caption
    var i = text.indexOf(':'); if (i > 0 && i < 42) return [text.slice(0, i), text.slice(i + 1).trim()];
    var m = /[;.,]/.exec(text.slice(0, 62)); if (m && m.index > 12) return [text.slice(0, m.index), text];
    return [text.split(' ').slice(0, 6).join(' '), text];
  }
  window.splitStep = split;
  window.Anim = {
    mount: function (host, spec) {
      var N = {}, steps = spec.steps, last = steps.length - 1, TOTAL = steps.length * STEP_MS, overview = !!spec.overview, fresh = !overview;
      spec.nodes.forEach(function (n) { N[n.id] = n; n.w = W; n.lw = wrap(n.label, 17); n.sw = n.sub ? wrap(n.sub, 23) : [[], 1]; n.h = Math.max(56, 26 + 16 * n.lw[0].length + (n.sub ? 4 + 13 * n.sw[0].length : 0)); });
      var order = {}, c = 0; steps.forEach(function (st) { (st.on || []).forEach(function (id) { if (!(id in order)) order[id] = ++c; }); });
      var T = overview ? TOTAL - 1 : 0, playing = false, prev = 0, raf = 0;
      host.classList.add('anim');
      var vb = spec.vb || [900, 300];
      var svg = s('svg', { viewBox: '0 0 ' + vb[0] + ' ' + vb[1], role: 'img', 'aria-label': spec.title }); host.appendChild(svg);
      var edges = {}, nodes = {}, bdg = {};
      (spec.edges || []).forEach(function (e) {
        var A = N[e[0]], B = N[e[1]], g = s('g', {}, svg), pts, lab;
        if (e[3]) { // routed edge: down, across, back up (used when a straight line would cross other nodes)
          var yb = Math.max(A.y + A.h / 2, B.y + B.h / 2) + e[3]; pts = [{ x: A.x, y: A.y + A.h / 2 + 3 }, { x: A.x, y: yb }, { x: B.x, y: yb }, { x: B.x, y: B.y + B.h / 2 + 3 }]; lab = { x: (A.x + B.x) / 2, y: yb + 15 };
        } else {
          var p1 = clip(B, A), p2 = clip(A, B);
          if (spec.edges.some(function (r) { return r[0] === e[1] && r[1] === e[0] && !r[3]; })) { var L = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1, ox = -(p2.y - p1.y) / L * 12, oy = (p2.x - p1.x) / L * 12; p1 = { x: p1.x + ox, y: p1.y + oy }; p2 = { x: p2.x + ox, y: p2.y + oy }; }
          pts = [p1, p2]; lab = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 - 8 };
        }
        var line = s('path', { class: 'edge', d: pathD(pts) }, g), n2 = pts.length, q = pts[n2 - 1], r0 = pts[n2 - 2], ang = Math.atan2(q.y - r0.y, q.x - r0.x);
        var ar = s('polygon', { class: 'arrow', points: [[0, 0], [-11, -5.5], [-11, 5.5]].map(function (v) { return (q.x + v[0] * Math.cos(ang) - v[1] * Math.sin(ang)) + ',' + (q.y + v[0] * Math.sin(ang) + v[1] * Math.cos(ang)); }).join(' ') }, g);
        if (e[2]) { var tx = s('text', { class: 'elab', x: lab.x, y: lab.y }, g); tx.textContent = e[2]; }
        edges[e[0] + '>' + e[1]] = { line: line, ar: ar, pts: pts };
      });
      var dot = s('circle', { class: 'dot', r: 8, cx: -20, cy: -20 }, svg);
      spec.nodes.forEach(function (n) {
        var g = s('g', { class: 'node' }, svg); s('rect', { x: n.x - n.w / 2, y: n.y - n.h / 2, width: n.w, height: n.h, rx: 12 }, g);
        var lh = 16, tot = lh * n.lw[0].length + (n.sub ? 4 + 13 * n.sw[0].length : 0), y0 = n.y - tot / 2;
        n.lw[0].forEach(function (ln, i) { var l = s('text', { x: n.x, y: y0 + 12 + i * lh, style: 'font-size:' + (13 * n.lw[1]).toFixed(1) + 'px' }, g); l.textContent = ln; });
        n.sw[0].forEach(function (ln, i) { var u = s('text', { class: 'sub', x: n.x, y: y0 + lh * n.lw[0].length + 4 + 10 + i * 13, style: 'font-size:' + (11 * n.sw[1]).toFixed(1) + 'px' }, g); u.textContent = ln; });
        nodes[n.id] = g;
        if (order[n.id]) { var b = s('g', { class: 'bdg' }, svg); s('circle', { cx: n.x + n.w / 2 - 4, cy: n.y - n.h / 2 + 4, r: 10 }, b); var bt = s('text', { x: n.x + n.w / 2 - 4, y: n.y - n.h / 2 + 8 }, b); bt.textContent = order[n.id]; bdg[n.id] = b; }
      });
      var ctl = h('div', 'ctl', null, host);
      var bPlay = h('button', 'pri', '▶ Play', ctl), bPause = h('button', '', '❚❚ Pause', ctl), bRe = h('button', '', '↺ Replay', ctl), bB5 = h('button', '', '⏪ 5s', ctl), bF5 = h('button', '', '5s ⏩', ctl), bBack = h('button', '', '◀ Step', ctl), bFwd = h('button', '', 'Step ▶', ctl), cnt = h('span', '', '', ctl);
      var ban = h('div', 'banner', null, host), circ = h('div', 'circ', '', ban), bt = h('div', 'bt', null, ban), kick = h('small', '', '', bt), bh = h('h4', 'bh', '', bt), bp = h('p', 'bp', '', bt);
      var segs = h('div', 'segs', null, ban), sg = steps.map(function (st, i) { var x = h('i', '', null, segs); x.title = 'Go to step ' + (i + 1); x.onclick = function () { stop(); fresh = false; overview = false; T = (i + 1) * STEP_MS - 1; draw(); }; return x; });
      function pos() { var i = Math.min(last, Math.floor(T / STEP_MS)); return { i: i, t: Math.min(1, (T - i * STEP_MS) / STEP_MS) }; }
      function draw() {
        var p = pos(), idx = fresh ? -1 : p.i, t = p.t, seenN = {}, seenE = {}, cur = {}, i;
        var eCol = {}; for (i = 0; i <= idx; i++) { (steps[i].on || []).forEach(function (n) { seenN[n] = 1; }); if (steps[i].edge && (i < idx || t >= EDGE_FRAC)) { seenE[steps[i].edge.join('>')] = 1; eCol[steps[i].edge.join('>')] = (i + 1) % 6; } }
        if (idx >= 0) (steps[idx].on || []).forEach(function (n) { cur[n] = 1; });
        if (overview) { for (var k in nodes) seenN[k] = 1; for (var q in edges) { seenE[q] = 1; eCol[q] = 1; } }
        for (var id in nodes) { nodes[id].setAttribute('class', 'node k' + ((order[id] || 1) % 6) + (seenN[id] ? ' seen' : '') + (cur[id] && !overview ? ' active' : '')); if (bdg[id]) bdg[id].setAttribute('class', 'bdg k' + ((order[id] || 1) % 6) + (seenN[id] ? ' seen' : '')); }
        for (var key in edges) { var E = edges[key], on = !!seenE[key]; E.line.setAttribute('class', 'edge k' + (eCol[key] || 0) + (on ? ' seen' : '')); E.ar.setAttribute('class', 'arrow k' + (eCol[key] || 0) + (on ? ' seen' : '')); E.line.setAttribute('d', pathD(E.pts)); }
        dot.setAttribute('cx', -20);
        if (idx >= 0 && !overview && steps[idx].edge && t < EDGE_FRAC) {
          var E2 = edges[steps[idx].edge.join('>')];
          if (E2) { var pp = partial(E2.pts, t / EDGE_FRAC), end = pp[pp.length - 1]; dot.setAttribute('cx', end.x); dot.setAttribute('cy', end.y); E2.line.setAttribute('class', 'edge k' + ((idx + 1) % 6) + ' seen'); E2.line.setAttribute('d', pathD(pp)); }
        }
        var sp = idx >= 0 ? split(steps[idx].text) : null; ban.className = 'banner k' + (idx < 0 || overview ? 0 : (idx + 1) % 6);
        circ.textContent = overview ? '◎' : idx < 0 ? '▶' : idx + 1;
        kick.textContent = overview ? 'OVERVIEW · ALL COMPONENTS' : idx < 0 ? 'READY' : 'STEP ' + (idx + 1) + ' OF ' + steps.length;
        bh.textContent = overview ? spec.title : idx < 0 ? spec.title : sp[0]; bp.textContent = overview ? 'Press Play to follow the flow one step at a time.' : idx < 0 ? 'Press Play (or Step ▶) and follow the gold dot.' : sp[1].charAt(0).toUpperCase() + sp[1].slice(1);
        sg.forEach(function (x, j) { x.className = (overview || j <= idx) ? 'on' : ''; });
        cnt.textContent = fresh ? '0:00' : Math.floor(T / 1000) + 's / ' + Math.round(TOTAL / 1000) + 's';
        bPlay.disabled = playing; bPause.disabled = !playing;
      }
      function tick(now) { if (!playing) return; T += now - prev; prev = now; if (T >= TOTAL - 1) { T = TOTAL - 1; playing = false; } draw(); if (playing) raf = requestAnimationFrame(tick); }
      function stop() { playing = false; cancelAnimationFrame(raf); }
      function play() { if (overview || T >= TOTAL - 1) { T = 0; } overview = false; fresh = false; playing = true; prev = performance.now(); raf = requestAnimationFrame(tick); draw(); }
      function seek(ms) { stop(); overview = false; if (fresh) T = 0; fresh = false; T = Math.max(0, Math.min(TOTAL - 1, T + ms)); draw(); }
      bPlay.onclick = play; bPause.onclick = function () { stop(); draw(); };
      bRe.onclick = function () { stop(); T = 0; play(); };
      bB5.onclick = function () { seek(-5000); }; bF5.onclick = function () { seek(5000); };
      bFwd.onclick = function () { stop(); var i = overview || fresh ? 0 : Math.min(last, pos().i + 1); overview = false; fresh = false; T = (i + 1) * STEP_MS - 1; draw(); };
      bBack.onclick = function () { stop(); var i = overview ? last - 1 : Math.max(0, pos().i - 1); overview = false; fresh = false; T = (i + 1) * STEP_MS - 1; draw(); };
      draw();
    }
  };
})();
