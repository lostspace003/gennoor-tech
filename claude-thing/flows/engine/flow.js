/* Flow engine: renders a "what happens" animation for one concept as a 1280x720 SVG, driven purely by time.
   window.Flow.load(spec) builds the scene; window.Flow.seek(ms) draws the frame for that instant; window.Flow.duration (ms).
   Deterministic by design so the renderer can capture frame by frame.

   Spec (authored per chapter in claude-thing/flows/specs/<slug>/<chapterId>.json):
   {
     "title": "...", "kicker": "...", "accent": "#c4713c",
     "actors": [{ "id": "maya", "icon": "user", "label": "Maya", "sub": "ops analyst", "slot": "L" }, ...]   // 2–5; slots L C R TL TC TR BL BC BR
     "steps": [{
        "caption": "≤ 90 chars, what happens in this beat",
        "focus": ["maya"],                                                            // actors to highlight
        "send":  { "from": "maya", "to": "claude", "icon": "file-spreadsheet", "label": "expenses.xlsx" },   // item that travels
        "reply": { "from": "claude", "to": "maya", "icon": "hash", "label": "$44,287" },                      // second travel, after send
        "callout": { "at": "claude", "text": "≤ 48 chars" },                          // bubble above an actor for this step
        "badge":   { "at": "maya", "kind": "check" | "cross" | "warn", "text": "verified" },   // persists
        "state":   { "at": "sandbox", "text": "running…" }                            // small status under an actor, persists until changed
     }]
   } */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var W = 1280, H = 720;
  var SLOTS = { L: [230, 372], C: [640, 372], R: [1050, 372], TL: [420, 212], TC: [640, 212], TR: [860, 212], BL: [420, 532], BC: [640, 532], BR: [860, 532],
    L2: [230, 232], L3: [230, 512], R2: [1050, 232], R3: [1050, 512] };
  var AW = 190, AH = 124;
  var TRAVEL = 900, POP = 220, FADE = 260, HOLD_END = 1500;
  var COLORS = ['#4f7fd6', '#3f9c8f', '#8068c9', '#b8892a', '#c76b6b', '#5aa070'];
  var TINTS = ['#eef3fc', '#e8f5f2', '#f1eefa', '#fbf5e6', '#fbefee', '#ecf6ef'];
  var INK = '#1d1d1f', SOFT = '#545458', QUIET = '#86868b', LINE = '#d2d2d7', PANEL = '#f5f5f7';

  function s(tag, a, p) { var e = document.createElementNS(NS, tag); for (var k in a || {}) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function txt(x, y, str, a, p) { var e = s('text', Object.assign({ x: x, y: y }, a), p); e.textContent = str; return e; }
  function ease(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function wrap(str, max) {
    var words = String(str || '').split(/\s+/), lines = [''];
    words.forEach(function (w) { var l = lines[lines.length - 1]; if (!l) lines[lines.length - 1] = w; else if ((l + ' ' + w).length <= max) lines[lines.length - 1] = l + ' ' + w; else lines.push(w); });
    return lines;
  }
  function icon(name, size, color, p, x, y, sw) {
    var node = window.FLOW_ICONS && window.FLOW_ICONS[name];
    var g = s('g', { transform: 'translate(' + (x - size / 2) + ' ' + (y - size / 2) + ') scale(' + (size / 24) + ')', fill: 'none', stroke: color, 'stroke-width': sw || 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
    if (!node) { s('circle', { cx: 12, cy: 12, r: 9 }, g); return g; }
    node.forEach(function (n) { s(n[0], n[1], g); });
    return g;
  }

  var svg, spec, actors = {}, steps = [], layers = {}, travels = [], callouts = [], badges = [], states = [], edges = {}, caption, capLines, stepCircle, segs = [];
  var duration = 0;

  function build(sp) {
    spec = sp;
    svg = document.getElementById('stage');
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    actors = {}; steps = []; layers = {}; travels = []; callouts = []; badges = []; states = []; edges = {}; segs = [];
    var accent = sp.accent || '#0071e3';
    var defs = s('defs', {}, svg);

    // background + header
    s('rect', { x: 0, y: 0, width: W, height: H, fill: '#fff' }, svg);
    var dots = s('pattern', { id: 'dots', width: 28, height: 28, patternUnits: 'userSpaceOnUse' }, defs);
    s('circle', { cx: 2, cy: 2, r: 1, fill: '#eaeaef' }, dots);
    s('rect', { x: 0, y: 84, width: W, height: 512, fill: 'url(#dots)' }, svg);
    txt(56, 40, (sp.kicker || '').toUpperCase(), { fill: accent, 'font-size': 14, 'font-weight': 700, 'letter-spacing': 2.2 }, svg);
    txt(56, 70, sp.title || '', { fill: INK, 'font-size': 27, 'font-weight': 700, 'letter-spacing': -0.5 }, svg);
    var brand = s('g', {}, svg);
    s('image', { href: 'gennoor-logo.svg', x: 1224 - 146, y: 20, width: 146, height: 50, preserveAspectRatio: 'xMaxYMid meet' }, brand);
    if (sp.code) txt(1224, 78, sp.code + ' · certification prep', { fill: QUIET, 'font-size': 11.5, 'font-weight': 700, 'text-anchor': 'end', 'letter-spacing': 1.2 }, brand);

    layers.edges = s('g', {}, svg);
    layers.actors = s('g', {}, svg);
    layers.items = s('g', {}, svg);
    layers.ui = s('g', {}, svg);

    // actors
    (sp.actors || []).forEach(function (a, i) {
      var pos = SLOTS[a.slot] || SLOTS.C;
      var g = s('g', { transform: 'translate(' + (pos[0] - AW / 2) + ' ' + (pos[1] - AH / 2) + ')' }, layers.actors);
      var halo = s('rect', { x: -7, y: -7, width: AW + 14, height: AH + 14, rx: 27, fill: accent, opacity: 0 }, g);
      s('rect', { x: 0, y: 5, width: AW, height: AH, rx: 20, fill: '#1d1d1f', opacity: 0.06 }, g);
      var card = s('rect', { x: 0, y: 0, width: AW, height: AH, rx: 20, fill: '#fff', stroke: LINE, 'stroke-width': 1.5 }, g);
      var ring = s('circle', { cx: AW / 2, cy: 40, r: 26, fill: TINTS[i % 6] }, g);
      var ic = icon(a.icon || 'user', 28, COLORS[i % 6], g, AW / 2, 40, 2);
      txt(AW / 2, 89, a.label || a.id, { fill: INK, 'font-size': 17, 'font-weight': 650, 'text-anchor': 'middle' }, g);
      var sub = txt(AW / 2, 108, a.sub || '', { fill: QUIET, 'font-size': 12.5, 'text-anchor': 'middle' }, g);
      var state = txt(AW / 2, AH + 22, '', { fill: SOFT, 'font-size': 12.5, 'font-style': 'italic', 'text-anchor': 'middle' }, g);
      actors[a.id] = { x: pos[0], y: pos[1], g: g, card: card, halo: halo, ring: ring, icon: ic, color: COLORS[i % 6], tint: TINTS[i % 6], state: state, sub: sub, i: i };
    });

    // timeline
    var t = 0;
    (sp.steps || []).forEach(function (st, i) {
      var travelsN = (st.send ? 1 : 0) + (st.reply ? 1 : 0);
      var words = String(st.caption || '').split(/\s+/).length;
      var dur = clamp(1150 + TRAVEL * travelsN + 80 * words + (st.callout ? 450 : 0), 2200, 4800);
      var S = { i: i, start: t, end: t + dur, st: st, color: COLORS[i % 6], tint: TINTS[i % 6] };
      steps.push(S);
      var at = t + 300;
      if (st.send && actors[st.send.from] && actors[st.send.to]) { travels.push(mkTravel(st.send, at, S)); at += TRAVEL; }
      if (st.reply && actors[st.reply.from] && actors[st.reply.to]) { travels.push(mkTravel(st.reply, at, S)); at += TRAVEL; }
      if (st.callout && actors[st.callout.at]) callouts.push(mkCallout(st.callout, Math.min(at, S.end - 900), S));
      if (st.badge && actors[st.badge.at]) badges.push(mkBadge(st.badge, Math.min(at, S.end - 700), S));
      if (st.state && actors[st.state.at]) states.push({ at: Math.min(at, S.end - 500), actor: st.state.at, text: st.state.text });
      t += dur;
    });
    duration = t + HOLD_END;
    window.Flow.duration = duration;

    // caption bar
    var bar = s('g', {}, layers.ui);
    s('rect', { x: 40, y: 608, width: W - 80, height: 92, rx: 20, fill: PANEL }, bar);
    stepCircle = s('g', {}, bar);
    s('circle', { cx: 86, cy: 654, r: 22, fill: accent }, stepCircle);
    stepCircle.t = txt(86, 661, '1', { fill: '#fff', 'font-size': 18, 'font-weight': 700, 'text-anchor': 'middle' }, stepCircle);
    caption = s('g', {}, bar);
    capLines = [txt(126, 646, '', { fill: INK, 'font-size': 21, 'font-weight': 600 }, caption), txt(126, 674, '', { fill: INK, 'font-size': 21, 'font-weight': 600 }, caption)];
    var segW = (W - 80 - 48) / Math.max(1, steps.length);
    steps.forEach(function (S, i) { segs.push(s('rect', { x: 64 + i * segW + 3, y: 692, width: segW - 6, height: 4, rx: 2, fill: '#e0e0e5' }, bar)); });
  }

  function mkTravel(tr, at, S) {
    var A = actors[tr.from], B = actors[tr.to];
    var key = tr.from + '>' + tr.to, rkey = tr.to + '>' + tr.from;
    if (!edges[key] && !edges[rkey]) {
      var e = s('path', { d: edgePath(A, B), fill: 'none', stroke: LINE, 'stroke-width': 2, 'stroke-dasharray': '6 7', opacity: 0 }, layers.edges);
      edges[key] = { el: e, at: at };
    } else { var ex = edges[key] || edges[rkey]; if (at < ex.at) ex.at = at; }
    var label = tr.label || '';
    var lw = Math.max(74, 42 + label.length * 8.2);
    var g = s('g', { opacity: 0 }, layers.items);
    s('rect', { x: -lw / 2, y: -17, width: lw, height: 40, rx: 20, fill: '#1d1d1f', opacity: 0.08 }, g);
    s('rect', { x: -lw / 2, y: -20, width: lw, height: 40, rx: 20, fill: '#fff', stroke: S.color, 'stroke-width': 2 }, g);
    icon(tr.icon || 'file-text', 18, S.color, g, -lw / 2 + 21, 0, 2.2);
    txt(-lw / 2 + 38, 5, label, { fill: INK, 'font-size': 14, 'font-weight': 600 }, g);
    var pulse = s('circle', { cx: B.x, cy: B.y, r: 0, fill: 'none', stroke: S.color, 'stroke-width': 3, opacity: 0 }, layers.items);
    return { g: g, A: A, B: B, at: at, pulse: pulse, color: S.color };
  }
  function edgePath(A, B) {
    var p1 = clipPt(B, A), p2 = clipPt(A, B);
    var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2, dx = p2.x - p1.x, dy = p2.y - p1.y, L = Math.hypot(dx, dy) || 1;
    var cx = mx - dy / L * 34, cy = my + dx / L * 34;
    return 'M' + p1.x + ' ' + p1.y + ' Q' + cx + ' ' + cy + ' ' + p2.x + ' ' + p2.y;
  }
  function clipPt(from, to) { // point on `to` card border facing `from`
    var dx = from.x - to.x, dy = from.y - to.y;
    var t = Math.min(dx ? (AW / 2 + 6) / Math.abs(dx) : 1e9, dy ? (AH / 2 + 6) / Math.abs(dy) : 1e9);
    return { x: to.x + dx * t, y: to.y + dy * t };
  }
  function bezier(A, B, f) {
    var p1 = clipPt(B, A), p2 = clipPt(A, B);
    var mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2, dx = p2.x - p1.x, dy = p2.y - p1.y, L = Math.hypot(dx, dy) || 1;
    var cx = mx - dy / L * 34, cy = my + dx / L * 34;
    var u = 1 - f;
    return { x: u * u * p1.x + 2 * u * f * cx + f * f * p2.x, y: u * u * p1.y + 2 * u * f * cy + f * f * p2.y };
  }
  function mkCallout(c, at, S) {
    var A = actors[c.at];
    var lines = wrap(c.text, 30), lw = Math.min(330, Math.max(140, Math.max.apply(null, lines.map(function (l) { return l.length; })) * 9.4 + 34));
    var lh = 22, bh = lines.length * lh + 22;
    var above = A.y > 300;
    var bx = clamp(A.x - lw / 2, 24, W - lw - 24), by = above ? A.y - AH / 2 - bh - 22 : A.y + AH / 2 + 30;
    var g = s('g', { opacity: 0 }, layers.items);
    s('rect', { x: bx, y: by, width: lw, height: bh, rx: 14, fill: '#1d1d1f' }, g);
    var tipY = above ? by + bh : by, tipX = clamp(A.x, bx + 24, bx + lw - 24);
    s('path', { d: above ? 'M' + (tipX - 9) + ' ' + tipY + ' L' + tipX + ' ' + (tipY + 10) + ' L' + (tipX + 9) + ' ' + tipY + ' Z' : 'M' + (tipX - 9) + ' ' + tipY + ' L' + tipX + ' ' + (tipY - 10) + ' L' + (tipX + 9) + ' ' + tipY + ' Z', fill: '#1d1d1f' }, g);
    lines.forEach(function (l, i) { txt(bx + 17, by + 18 + i * lh + 6, l, { fill: '#fff', 'font-size': 15, 'font-weight': 600 }, g); });
    return { g: g, at: at, end: S.end + 200, cx: A.x, cy: above ? by + bh : by };
  }
  function mkBadge(b, at, S) {
    var A = actors[b.at];
    var col = b.kind === 'cross' ? '#c0392b' : b.kind === 'warn' ? '#9a6700' : '#1d8348';
    var bg = b.kind === 'cross' ? '#fbe7e5' : b.kind === 'warn' ? '#f5eeda' : '#e4efe8';
    var text = b.text || '';
    var bw = Math.max(34, 36 + text.length * 7.6);
    var g = s('g', { opacity: 0 }, layers.items);
    var bx = A.x + AW / 2 - bw + 14, by = A.y - AH / 2 - 14;
    s('rect', { x: bx, y: by, width: bw, height: 28, rx: 14, fill: bg, stroke: col, 'stroke-width': 1.5 }, g);
    icon(b.kind === 'cross' ? 'x' : b.kind === 'warn' ? 'triangle-alert' : 'check', 15, col, g, bx + 16, by + 14, 2.6);
    txt(bx + 28, by + 19, text, { fill: col, 'font-size': 13, 'font-weight': 700 }, g);
    return { g: g, at: at, cx: bx + bw / 2, cy: by + 14 };
  }

  function seek(T) {
    T = clamp(T, 0, duration);
    var cur = steps[steps.length - 1];
    for (var i = 0; i < steps.length; i++) if (T < steps[i].end) { cur = steps[i]; break; }
    var accent = spec.accent || '#0071e3';
    // actors: focus
    var focus = {}; (cur.st.focus || []).forEach(function (id) { focus[id] = 1; });
    travels.forEach(function (tr) { if (T >= tr.at && T < tr.at + TRAVEL + 300) { focus[tr.A === undefined ? '' : ''] = 0; } });
    Object.keys(actors).forEach(function (id) {
      var a = actors[id], on = !!focus[id];
      a.card.setAttribute('stroke', on ? accent : LINE);
      a.card.setAttribute('stroke-width', on ? 3 : 1.5);
      a.halo.setAttribute('opacity', on ? 0.14 : 0);
      a.g.setAttribute('opacity', Object.keys(focus).length && !on ? 0.82 : 1);
    });
    // edges appear at their first travel
    Object.keys(edges).forEach(function (k) { var e = edges[k]; e.el.setAttribute('opacity', T >= e.at ? clamp((T - e.at) / 400, 0, 1) * 0.9 : 0); });
    // travels
    travels.forEach(function (tr) {
      var f = (T - tr.at) / TRAVEL;
      if (f < 0 || f > 1.25) { tr.g.setAttribute('opacity', 0); tr.pulse.setAttribute('opacity', 0); return; }
      if (f <= 1) {
        var p = bezier(tr.A, tr.B, ease(f));
        tr.g.setAttribute('transform', 'translate(' + p.x + ' ' + p.y + ')');
        tr.g.setAttribute('opacity', f < 0.08 ? f / 0.08 : f > 0.94 ? (1 - f) / 0.06 : 1);
        tr.pulse.setAttribute('opacity', 0);
      } else {
        tr.g.setAttribute('opacity', 0);
        var q = (f - 1) / 0.25;
        tr.pulse.setAttribute('r', 20 + q * 52); tr.pulse.setAttribute('opacity', (1 - q) * 0.9);
      }
      // receiver lights up while the item arrives
      if (f > 0.85 && f < 1.25) { tr.B.card.setAttribute('stroke', tr.color); tr.B.card.setAttribute('stroke-width', 3); }
      if (f >= 0 && f < 0.25) { tr.A.card.setAttribute('stroke', tr.color); tr.A.card.setAttribute('stroke-width', 3); }
    });
    // callouts (pop in, stay for the step, fade out)
    callouts.forEach(function (c) {
      var vis = T >= c.at && T < c.end;
      if (!vis) { c.g.setAttribute('opacity', 0); return; }
      var p = clamp((T - c.at) / POP, 0, 1), o = T > c.end - FADE ? clamp((c.end - T) / FADE, 0, 1) : 1;
      var sc = 0.85 + 0.15 * ease(p);
      c.g.setAttribute('opacity', o * p);
      c.g.setAttribute('transform', 'translate(' + c.cx + ' ' + c.cy + ') scale(' + sc + ') translate(' + (-c.cx) + ' ' + (-c.cy) + ')');
    });
    // badges persist
    badges.forEach(function (b) {
      if (T < b.at) { b.g.setAttribute('opacity', 0); return; }
      var p = clamp((T - b.at) / POP, 0, 1), sc = 0.6 + 0.4 * ease(p);
      b.g.setAttribute('opacity', p);
      b.g.setAttribute('transform', 'translate(' + b.cx + ' ' + b.cy + ') scale(' + sc + ') translate(' + (-b.cx) + ' ' + (-b.cy) + ')');
    });
    // states persist until replaced
    var cur_state = {};
    states.forEach(function (st) { if (T >= st.at) cur_state[st.actor] = st.text; });
    Object.keys(actors).forEach(function (id) { actors[id].state.textContent = cur_state[id] || ''; });
    // caption + progress
    var lines = wrap(cur.st.caption, 74);
    capLines[0].textContent = lines[0] || '';
    capLines[1].textContent = lines[1] || '';
    if (lines.length < 2) { capLines[0].setAttribute('y', 661); } else { capLines[0].setAttribute('y', 646); }
    var cp = clamp((T - cur.start) / FADE, 0, 1);
    caption.setAttribute('opacity', cp);
    caption.setAttribute('transform', 'translate(0 ' + ((1 - cp) * 6) + ')');
    stepCircle.t.textContent = String(cur.i + 1);
    stepCircle.firstChild.setAttribute('fill', cur.color);
    segs.forEach(function (sg, i) { sg.setAttribute('fill', i < cur.i ? cur.color : i === cur.i ? cur.color : '#e0e0e5'); sg.setAttribute('opacity', i < cur.i ? 0.55 : i === cur.i ? 1 : 1); });
  }

  window.Flow = { load: build, seek: seek, duration: 0 };
})();
