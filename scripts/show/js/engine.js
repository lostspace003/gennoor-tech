/*
  Puts the scenes on the stage and moves them.

  A scene is plain HTML. Anything with data-b="n" is a PIECE: it arrives on beat n.
    beat 0      arrives when the scene opens
    beat 1..    in the presentation: one mouse click each;  in a film: when its words are spoken
  How a piece arrives is data-fx (rise, fade, pop, wipe, left, right, drop, zoom); data-o staggers pieces of one beat.
  Inside a piece, .draw lines draw themselves, .grow bars grow, .type text types and .seq children pop one by one.
  data-loop keeps something moving for as long as the scene is on (spin, float, pulse, drift).
  data-film="0" is left out of films, data-deck="0" out of the presentation.

  ?mode=film  the page is a film: window.seek(seconds) draws that moment; build.mjs photographs every frame.
  ?mode=deck  every piece is shown finished; build.mjs cuts each one out for PowerPoint, which animates them.
*/
const Q = new URLSearchParams(location.search)
const MODE = Q.get('mode') || 'deck'
const show = window.SHOWS[Q.get('show') || 'overview']
const stage = document.getElementById('stage')
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const outCubic = (p) => 1 - Math.pow(1 - p, 3)
const outBack = (p) => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2) }
const inOut = (p) => (p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
const XF = 0.55      // seconds one scene takes to give way to the next
const STAGGER = 0.11

const only = Q.get('scene')
const scenes = show.scenes.filter((s) => (MODE === 'film' ? s.film !== false : s.deck !== false) && (!only || s.id === only))

for (const [k, s] of scenes.entries()) {
  const el = document.createElement('section')
  el.className = 'scene'
  el.id = `s-${s.id}`
  el.style.zIndex = k + 1
  el.innerHTML = `<div class="bg">${s.bg || ''}</div><div class="fg">${s.fg}</div>`
  stage.appendChild(el)
  el.querySelectorAll(MODE === 'film' ? '[data-film="0"]' : '[data-deck="0"]').forEach((n) => n.remove())
  s.el = el
  s.fgEl = el.querySelector('.fg')
  s.pieces = [...el.querySelectorAll('.fg [data-b]')].map((n, i) => {
    n.dataset.pid = `${s.id}-${i}`
    const mine = (sel) => [...n.querySelectorAll(sel)].filter((x) => x.closest('[data-b]') === n)
    const inner = []
    for (const x of mine('.draw')) { const len = x.getTotalLength(); x.style.strokeDasharray = len; inner.push({ kind: 'draw', el: x, len }) }
    for (const x of mine('.grow')) inner.push({ kind: 'grow', el: x, to: x.dataset.to || '100%' })
    for (const x of mine('.type')) inner.push({ kind: 'type', el: x, text: x.textContent })
    for (const x of mine('.seq')) [...x.children].forEach((c, j) => inner.push({ kind: 'pop', el: c, delay: (+x.dataset.delay || 0) + j * (+x.dataset.gap || 0.14) }))
    for (const it of inner) { it.delay = it.delay ?? +(it.el.dataset.delay || 0.2); it.dur = +(it.el.dataset.dur || 0.9) }
    return { el: n, id: n.dataset.pid, beat: +n.dataset.b, order: +(n.dataset.o || 0), fx: n.dataset.fx || 'rise', dur: +(n.dataset.dur || 0.75), tf: n.dataset.tf || '', inner, at: 0 }
  })
  s.loops = [...el.querySelectorAll('[data-loop]')].map((n, i) => ({ el: n, kind: n.dataset.loop, speed: +(n.dataset.speed || 2), amp: +(n.dataset.amp || 6), per: +(n.dataset.per || 5), i: +(n.dataset.i || i), tf: n.dataset.tf || '' }))
}

// ---------------------------------------------------------------- drawing one piece at one moment
function drawPiece(p, dt) {
  const st = p.el.style
  if (dt < 0) { st.opacity = 0; st.transform = p.tf; st.clipPath = ''; drawInner(p, -1); return }
  const x = clamp(dt / p.dur), e = outCubic(x)
  let op = e, tf = ''
  switch (p.fx) {
    case 'fade': break
    case 'pop': op = clamp(x * 2.4); tf = `scale(${0.8 + 0.2 * outBack(x)})`; break
    case 'zoom': tf = `scale(${1.12 - 0.12 * e})`; break
    case 'left': tf = `translateX(${(1 - e) * -46}px)`; break
    case 'right': tf = `translateX(${(1 - e) * 46}px)`; break
    case 'drop': tf = `translateY(${(1 - e) * -38}px)`; break
    case 'wipe': op = 1; st.clipPath = x < 1 ? `inset(-40px ${(1 - inOut(x)) * 100}% -40px -40px)` : ''; break
    case 'none': op = 1; break
    default: tf = `translateY(${(1 - e) * 26}px)`
  }
  st.opacity = op
  st.transform = `${tf} ${p.tf}`.trim()
  drawInner(p, dt)
}
function drawInner(p, dt) {
  for (const it of p.inner) {
    const x = dt < 0 ? 0 : clamp((dt - it.delay) / it.dur)
    if (it.kind === 'draw') it.el.style.strokeDashoffset = it.len * (1 - inOut(x))
    else if (it.kind === 'grow') it.el.style.width = `calc(${it.to} * ${outCubic(x)})`
    else if (it.kind === 'type') it.el.textContent = it.text.slice(0, Math.round(it.text.length * x))
    else if (it.kind === 'pop') { const y = dt < 0 ? 0 : clamp((dt - it.delay) / 0.5); it.el.style.opacity = clamp(y * 2.4); it.el.style.transform = `scale(${0.8 + 0.2 * outBack(y)})` }
  }
}
function drawLoop(l, t) {
  const st = l.el.style
  if (l.kind === 'spin') st.transform = `${l.tf} rotate(${(t * l.speed).toFixed(3)}deg)`
  else if (l.kind === 'float') st.transform = `${l.tf} translateY(${(Math.sin((t / l.per + l.i * 0.37) * Math.PI * 2) * l.amp).toFixed(2)}px)`
  else if (l.kind === 'pulse') st.transform = `${l.tf} scale(${(1 + Math.sin((t / l.per + l.i * 0.21) * Math.PI * 2) * 0.035).toFixed(4)})`
  else if (l.kind === 'drift') st.transform = `translate(${(Math.sin(t / 9 + l.i * 2.1) * 46).toFixed(1)}px, ${(Math.cos(t / 11 + l.i * 1.3) * 34).toFixed(1)}px)`
}

// ---------------------------------------------------------------- the presentation: everything finished, ready to be cut out
if (MODE === 'deck') {
  for (const s of scenes) { for (const p of s.pieces) drawPiece(p, 99); for (const l of s.loops) drawLoop(l, 0) }
  const only1 = (id) => scenes.forEach((s) => { s.el.style.display = s.id === id ? 'block' : 'none' })
  window.deck = () => scenes.map((s) => {
    only1(s.id)
    return {
      id: s.id, auto: s.auto || 0, notes: s.notes || '', title: s.title || s.id,
      pieces: s.pieces.map((p) => {
        const r = p.el.getBoundingClientRect(), pad = +(p.el.dataset.pad ?? 44)
        const x0 = Math.max(0, Math.floor(r.left - pad)), y0 = Math.max(0, Math.floor(r.top - pad))
        const x1 = Math.min(1280, Math.ceil(r.right + pad)), y1 = Math.min(720, Math.ceil(r.bottom + pad))
        return { id: p.id, x: x0, y: y0, w: x1 - x0, h: y1 - y0, beat: p.beat, order: p.order, fx: p.fx, href: p.el.dataset.href || '', alt: p.el.dataset.alt || p.el.innerText.replace(/\s+/g, ' ').trim().slice(0, 240), spin: p.el.dataset.spin ? +p.el.dataset.spin : 0 }
      }).filter((p) => p.w > 0 && p.h > 0),
    }
  })
  /** Show one piece alone on nothing, so it can be photographed with a see-through background. */
  window.isolate = (sceneId, pid) => {
    only1(sceneId)
    const s = scenes.find((x) => x.id === sceneId)
    s.el.querySelector('.bg').style.visibility = 'hidden'
    s.el.style.background = 'transparent'
    s.fgEl.style.visibility = 'hidden'
    for (const p of s.pieces) p.el.style.visibility = 'hidden'
    const me = s.pieces.find((p) => p.id === pid)
    me.el.style.visibility = 'visible'
  }
  /** Show a scene's ground alone (or, with pieces = true, the whole finished scene). */
  window.ground1 = (sceneId, pieces = false) => {
    only1(sceneId)
    const s = scenes.find((x) => x.id === sceneId)
    s.el.querySelector('.bg').style.visibility = 'visible'
    s.fgEl.style.visibility = pieces ? 'visible' : 'hidden'
    for (const p of s.pieces) p.el.style.visibility = pieces ? 'visible' : 'hidden'
  }
  document.documentElement.style.background = 'transparent'
  stage.style.background = 'transparent'
}

// ---------------------------------------------------------------- a film: when each beat happens, then seek(t)
if (MODE === 'film') {
  const lines = Object.fromEntries((ART.timing?.lines || []).map((l) => [l.id, l]))
  const norm = (w) => w.toLowerCase().replace(/[^a-z0-9]/g, '')
  /** When a word of a line is spoken. `what` is seconds after the line starts, a word, or [word, which one]. */
  const when = (line, what) => {
    if (typeof what === 'number') return line.start + what
    const [word, nth] = Array.isArray(what) ? what : [what, 1]
    const hits = line.words.filter((w) => norm(w.w).startsWith(norm(word)))
    const hit = hits[Math.min(nth, hits.length) - 1]
    if (!hit) console.warn(`"${word}" is not in line ${line.id}`)
    return hit ? hit.start : line.start
  }
  let prevEnd = 0
  for (const s of scenes) {
    const first = lines[s.cues?.[0]?.[0]]
    s.t0 = s === scenes[0] ? 0 : Math.max(prevEnd + 0.1, (first ? first.start : prevEnd) - 0.6)
    const beat = { 0: s.t0 + 0.12 }
    for (const [id, marks] of s.cues || []) {
      const line = lines[id]
      if (!line) continue
      for (const [b, what] of Object.entries(marks || {})) beat[b] = when(line, what) - 0.12
      prevEnd = Math.max(prevEnd, line.end)
    }
    let last = beat[0]
    for (const p of s.pieces) { if (beat[p.beat] === undefined) beat[p.beat] = last + 0.6; last = Math.max(last, beat[p.beat]); p.at = beat[p.beat] + p.order * STAGGER }
  }
  const total = ART.timing?.duration || prevEnd + 3
  scenes.forEach((s, i) => { s.t1 = i + 1 < scenes.length ? scenes[i + 1].t0 : total + 5 })

  // What is being said, written small at the foot of the picture: the film is understood with the sound off
  const cap = document.createElement('div')
  cap.id = 'cap'
  cap.style.cssText = 'position:absolute;left:0;right:0;bottom:30px;z-index:999;display:flex;justify-content:center;pointer-events:none'
  cap.innerHTML = '<span style="max-width:900px;padding:9px 20px;border-radius:14px;background:rgba(4,8,18,.66);border:1px solid rgba(255,255,255,.1);font:500 19px/1.35 var(--body);color:#eef3ff;text-align:center"></span>'
  if (Q.get('captions') !== '0') stage.appendChild(cap)
  const said = []
  for (const l of ART.timing?.lines || []) {
    let from = 0
    l.words.forEach((w, i) => {
      if (/[.?!]["')\]]*$/.test(w.w) || i === l.words.length - 1) {
        said.push({ text: l.words.slice(from, i + 1).map((x) => x.w).join(' '), start: l.words[from].start, end: w.end })
        from = i + 1
      }
    })
  }

  const fadeOut = show.fadeOut ?? 1.2
  window.DURATION = total
  window.seek = (t) => {
    for (const s of scenes) {
      const on = t >= s.t0 && t < s.t1 + XF
      s.el.style.display = on ? 'block' : 'none'
      if (!on) continue
      const inP = s === scenes[0] ? clamp(t / 0.7) : clamp((t - s.t0) / XF), outP = clamp((t - s.t1) / XF)
      s.el.style.opacity = outCubic(inP)
      // a slow push in for as long as the scene is on, and a little more as it leaves
      const life = clamp((t - s.t0) / (s.t1 - s.t0 + XF))
      s.fgEl.style.transform = `scale(${(1 + 0.022 * life + 0.035 * outCubic(outP)).toFixed(5)})`
      s.fgEl.style.opacity = 1 - outCubic(clamp(outP * 1.6))
      for (const p of s.pieces) drawPiece(p, t - p.at)
      for (const l of s.loops) drawLoop(l, t)
    }
    const now = said.find((c) => t >= c.start - 0.08 && t <= c.end + 0.35)
    cap.style.opacity = now ? clamp(Math.min((t - now.start + 0.08) / 0.18, (now.end + 0.35 - t) / 0.25)) : 0
    if (now) cap.firstChild.textContent = now.text
    // the last second fades to black
    stage.style.opacity = clamp((total - t) / fadeOut)
  }
  window.PLAN = scenes.map((s) => ({ id: s.id, t0: +s.t0.toFixed(2), t1: +s.t1.toFixed(2) }))
  window.seek(0)
}
