'use client'

/**
 * Code player: a runnable example "types itself" line by line while a card explains each block,
 * then "runs" and reveals the real captured output. One clock drives Play / Pause / Replay / seek / scrub.
 */
import { useEffect, useRef } from 'react'
import { pyHighlight, escapeHtml as esc } from '@/lib/pyhl'
import type { Annotation, Example } from '../types'

interface Props {
  name: string
  example: Example
  annotation?: Annotation
  outnotes?: [string, string][]
}

function el(tag: string, cls: string, html: string | null, p?: Element): HTMLElement {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (html != null) e.innerHTML = html
  if (p) p.appendChild(e)
  return e
}
const HEAD: [string, string, string] = ['import os, asyncio', 'A fake key, a real flow', 'These lines set a <b>mock</b> API key and the model id. Even the offline mock refuses to start without a key shaped like <code>sk-ant-…</code>, exactly like production would. Swap in your real key later and nothing else changes.']
function sentences(t: string) { return t.split(/(?<=[.!?])\s+(?=[A-Z<"'(])/).filter(Boolean) }
function xcard(n: number, total: number, c: { title: string; text: string }, lines: string, now: boolean, idx: number) {
  const ss = sentences(c.text), title = c.title.replace(/^[^\w<]+/, '')
  let h = '<div class="xc k' + ((idx + 1) % 6) + (now ? ' now' : '') + '" data-i="' + idx + '"><small>STEP ' + n + ' OF ' + total + (lines ? ' · LINES ' + lines : '') + '</small><h5>' + title + '</h5><p>' + ss[0] + '</p>'
  if (ss.length > 1) h += '<ul>' + ss.slice(1).map(x => '<li>' + x + '</li>').join('') + '</ul>'
  return h + '</div>'
}
function build(X: Example, A: Annotation) {
  const lines = X.code.replace(/\n+$/, '').split('\n')
  const pairs: { i: number; card: { title: string; text: string } }[] = []
  let from = 0
  const used: Record<number, 1> = {}
  ;[HEAD].concat(A.a).forEach(a => {
    let i = from
    while (i < lines.length && lines[i].indexOf(a[0]) < 0) i++
    if (i >= lines.length) { i = 0; while (i < lines.length && (lines[i].indexOf(a[0]) < 0 || used[i])) i++ }
    if (i >= lines.length || used[i]) return
    used[i] = 1; pairs.push({ i, card: { title: a[1], text: a[2] } }); from = i + 1
  })
  pairs.sort((x, y) => x.i - y.i)
  const starts = pairs.map(p => p.i), cards = pairs.map(p => p.card)
  const ls: number[] = [], le: number[] = [], cardStart: number[] = []
  let t = 600, ai = 0
  lines.forEach((ln, i) => {
    if (starts[ai] === i) { cardStart[ai] = t; ai++ }
    const d = ln.trim() ? Math.min(1400, Math.max(350, ln.length * 26)) : 120
    ls[i] = t; le[i] = t + d; t += d
    const nextStart = starts[ai]
    if (nextStart === i + 1 || i === lines.length - 1) { const c = cards[ai - 1]; if (c) t += 2600 + c.text.replace(/<[^>]+>/g, '').split(' ').length * 110 }
  })
  const runAt = t, outLines = X.out.split('\n'), outStart = runAt + 1200
  const total = outStart + outLines.length * 420 + 3500
  return { lines, starts, cards, ls, le, cardStart, runAt, outLines, outStart, total, outNote: A.out || 'That is the real output captured from running this exact file.' }
}

function mount(host: HTMLElement, name: string, X: Example, A: Annotation, ON: [string, string][]) {
  const M = build(X, A)
  let T = 0, playing = false, prev = 0, raf = 0, speed = 0.75, fresh = true, lastKey = ''
  host.classList.add('cp-wrap')
  const top = el('div', 'cp-top', '<b>examples/' + esc(name) + '.py</b>', host)
  const bP = el('button', 'pri', '▶ Play', top) as HTMLButtonElement, bPa = el('button', '', '❚❚ Pause', top) as HTMLButtonElement, bR = el('button', '', '↺ Replay', top) as HTMLButtonElement
  const bB = el('button', '', '⏪ 5s', top) as HTMLButtonElement, bF = el('button', '', '5s ⏩', top) as HTMLButtonElement
  const sel = el('select', '', '<option value="0.5">0.5× (relaxed)</option><option value="0.75" selected>0.75×</option><option value="1">1×</option><option value="2">2×</option>', top) as HTMLSelectElement
  const body = el('div', 'cp-body', '', host), pre = el('pre', 'cp-code', '', body), side = el('div', 'cp-side', '', body), feed = el('div', 'cp-feed', '', side), out = el('pre', 'cp-out', '', side)
  const bar = el('div', 'cp-bar', '', host), rng = el('input', '', '', bar) as HTMLInputElement, lab = el('span', '', '0:00', bar)
  rng.type = 'range'; rng.min = '0'; rng.max = String(M.total); rng.value = '0'; rng.title = 'Scrub'
  function draw() {
    let html = '', shown = 0
    const n = M.lines.length
    for (let i = 0; i < n; i++) if (T >= M.ls[i]) shown = i + 1
    let ci = 0
    for (let i = 0; i < M.starts.length; i++) if (!fresh && T >= M.cardStart[i]) ci = i
    const a0 = M.starts[ci], a1 = (M.starts[ci + 1] === undefined ? n : M.starts[ci + 1]) - 1
    for (let i = 0; i < shown; i++) {
      const full = M.lines[i], p = Math.max(0, Math.min(1, (T - M.ls[i]) / (M.le[i] - M.ls[i]))), part = full.slice(0, Math.round(full.length * p))
      html += '<span class="cp-line' + (i >= a0 && i <= a1 && T < M.runAt ? ' cur' : '') + '"><i>' + (i + 1) + '</i>' + pyHighlight(part) + (p < 1 ? '<span class="cp-caret"></span>' : '') + '</span>'
    }
    if (fresh) html = '<span class="cp-line cur"><i> </i><span class="t-com"># press Play — the code will write itself…</span><span class="cp-caret"></span></span>'
    pre.innerHTML = html
    if (playing && T < M.runAt) pre.scrollTop = pre.scrollHeight
    const running = T >= M.runAt
    let key: string, h2 = ''
    if (fresh) {
      key = 'f'
      h2 = '<div class="xc now"><small>READY</small><h5>Watch this code write itself</h5><p>Each block of code gets its own explanation.</p><ul><li>Steps stack up here; scroll up to revisit earlier ones.</li><li>Click a step to jump to that moment.</li><li>Use ⏪ 5s / 5s ⏩ or drag the bar to skip.</li></ul></div>'
    } else {
      let notes: [string, string][] = []
      if (running && T >= M.outStart) {
        const kk = Math.max(0, Math.min(M.outLines.length, Math.floor((T - M.outStart) / 420) + 1))
        const seenTxt = M.outLines.slice(0, kk).join('\n')
        notes = ON.filter(x => seenTxt.indexOf(x[0]) >= 0)
      }
      key = ci + (running ? 'r' + (T >= M.outStart ? 'o' + notes.length : 'w') : '')
      if (key !== lastKey) {
        for (let q = 0; q <= ci; q++) {
          const e = (M.starts[q + 1] === undefined ? n : M.starts[q + 1]) - 1
          if (M.cards[q]) h2 += xcard(q + 1, M.cards.length, M.cards[q], (M.starts[q] + 1) + '–' + (e + 1), q === ci && !running, q)
        }
        if (running) h2 += '<div class="xc now"><small>RESULT · CAPTURED FROM A REAL RUN</small><h5>' + (T >= M.outStart ? 'What the run printed' : 'Running ' + esc(name) + '.py…') + '</h5><p>' + (T >= M.outStart ? M.outNote : 'The agent loop is executing against the mock SDK.') + '</p>' + (notes.length ? '<small style="margin-top:8px">HOW TO READ THE OUTPUT</small><ul>' + notes.map(x => '<li><code>' + esc(x[0]) + '</code> ' + esc(x[1]) + '</li>').join('') + '</ul>' : '') + '</div>'
      }
    }
    if (key !== lastKey) { lastKey = key; feed.innerHTML = h2; feed.scrollTop = feed.scrollHeight }
    if (running) {
      const k = Math.max(0, Math.min(M.outLines.length, Math.floor((T - M.outStart) / 420) + 1))
      out.className = 'cp-out on'
      out.innerHTML = '<span style="color:var(--cc-blue)">$ python ' + esc(name) + '.py</span>\n' + (T >= M.outStart ? esc(M.outLines.slice(0, k).join('\n')) : '')
    } else out.className = 'cp-out'
    rng.value = String(T); lab.textContent = Math.floor(T / 1000) + 's / ' + Math.round(M.total / 1000) + 's'
    bP.disabled = playing; bPa.disabled = !playing
  }
  function tick(now: number) { if (!playing) return; T += (now - prev) * speed; prev = now; if (T >= M.total) { T = M.total; playing = false } draw(); if (playing) raf = requestAnimationFrame(tick) }
  function stop() { playing = false; cancelAnimationFrame(raf) }
  function play() { if (T >= M.total) T = 0; fresh = false; playing = true; prev = performance.now(); raf = requestAnimationFrame(tick); draw() }
  function seek(ms: number) { stop(); fresh = false; T = Math.max(0, Math.min(M.total, T + ms)); draw() }
  bP.onclick = play; bPa.onclick = () => { stop(); draw() }; bR.onclick = () => { stop(); T = 0; play() }
  bB.onclick = () => seek(-5000); bF.onclick = () => seek(5000)
  feed.onclick = e => { const x = (e.target as HTMLElement).closest('.xc') as HTMLElement | null; if (!x || x.getAttribute('data-i') === null) return; const i = +x.getAttribute('data-i')!; stop(); fresh = false; T = M.cardStart[i]; lastKey = ''; draw() }
  sel.onchange = () => { speed = parseFloat(sel.value) }
  rng.oninput = () => { stop(); fresh = false; T = parseFloat(rng.value); draw() }
  draw()
  return { stop }
}

export default function CodePlayer({ name, example, annotation, outnotes }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = ref.current
    if (!host) return
    host.innerHTML = ''
    host.className = ''
    const ctl = mount(host, name, example, annotation || { a: [], out: '' }, outnotes || [])
    return () => { ctl.stop(); host.innerHTML = '' }
  }, [name, example, annotation, outnotes])
  return <div ref={ref} />
}
