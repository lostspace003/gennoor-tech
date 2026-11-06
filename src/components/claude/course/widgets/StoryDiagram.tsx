'use client'

/**
 * Step-through SVG diagram ("workflow animation"). A time-based player: Play / Pause / Replay / step,
 * a gold dot travels the active edge, nodes light up as the story reaches them, and a banner explains
 * each step. Plays once automatically when it scrolls into view (unless the visitor prefers reduced motion).
 */
import { useEffect, useRef } from 'react'
import type { AnimSpec } from '../types'

const NS = 'http://www.w3.org/2000/svg'
const STEP_MS = 4200
const EDGE_FRAC = 0.45
const W = 136

type Pt = { x: number; y: number }
type NodeBox = { id: string; label: string; sub?: string; x: number; y: number; w: number; h: number; lw: [string[], number]; sw: [string[], number] }

function s(tag: string, a: Record<string, string | number>, p?: Element): SVGElement {
  const e = document.createElementNS(NS, tag)
  for (const k in a) e.setAttribute(k, String(a[k]))
  if (p) p.appendChild(e)
  return e
}
function h(tag: string, cls: string, txt: string | null, p?: Element): HTMLElement {
  const e = document.createElement(tag)
  if (cls) e.className = cls
  if (txt != null) e.textContent = txt
  if (p) p.appendChild(e)
  return e
}
function wrap(t: string, max: number): [string[], number] {
  const words = String(t).split(' ')
  const lines = ['']
  let sc = 1
  words.forEach(w => {
    const l = lines[lines.length - 1]
    if (!l) lines[lines.length - 1] = w
    else if ((l + ' ' + w).length <= max) lines[lines.length - 1] = l + ' ' + w
    else lines.push(w)
  })
  lines.forEach(l => { if (l.length > max) sc = Math.min(sc, max / l.length) })
  return [lines.slice(0, 2), Math.max(sc, 0.74)]
}
function clip(a: Pt, b: NodeBox): Pt {
  const dx = a.x - b.x, dy = a.y - b.y
  const t = Math.min(dx ? (b.w / 2 + 3) / Math.abs(dx) : 1e9, dy ? (b.h / 2 + 3) / Math.abs(dy) : 1e9)
  return { x: b.x + dx * t, y: b.y + dy * t }
}
function partial(pts: Pt[], f: number): Pt[] {
  let L = 0
  const seg: number[] = []
  for (let i = 1; i < pts.length; i++) { seg.push(Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)); L += seg[i - 1] }
  const want = L * f
  const out = [pts[0]]
  let acc = 0
  for (let i = 0; i < seg.length; i++) {
    if (acc + seg[i] >= want) {
      const r = seg[i] ? (want - acc) / seg[i] : 0
      out.push({ x: pts[i].x + (pts[i + 1].x - pts[i].x) * r, y: pts[i].y + (pts[i + 1].y - pts[i].y) * r })
      return out
    }
    out.push(pts[i + 1]); acc += seg[i]
  }
  return out
}
function pathD(pts: Pt[]): string { return pts.map((p, i) => (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1)).join(' ') }
function split(text: string): [string, string] {
  const i = text.indexOf(':')
  if (i > 0 && i < 42) return [text.slice(0, i), text.slice(i + 1).trim()]
  const m = /[;.,]/.exec(text.slice(0, 62))
  if (m && m.index > 12) return [text.slice(0, m.index), text]
  return [text.split(' ').slice(0, 6).join(' '), text]
}

function mount(host: HTMLElement, spec: AnimSpec) {
  const N: Record<string, NodeBox> = {}
  const steps = spec.steps, last = steps.length - 1, TOTAL = steps.length * STEP_MS
  let overview = !!spec.overview, fresh = !overview
  spec.nodes.forEach(n => {
    const lw = wrap(n.label, 17), sw: [string[], number] = n.sub ? wrap(n.sub, 23) : [[], 1]
    N[n.id] = { ...n, w: W, lw, sw, h: Math.max(56, 26 + 16 * lw[0].length + (n.sub ? 4 + 13 * sw[0].length : 0)) }
  })
  const order: Record<string, number> = {}
  let c = 0
  steps.forEach(st => { (st.on || []).forEach(id => { if (!(id in order)) order[id] = ++c }) })
  let T = overview ? TOTAL - 1 : 0, playing = false, prev = 0, raf = 0
  host.classList.add('anim')
  const vb = spec.vb || [900, 300]
  const svg = s('svg', { viewBox: '0 0 ' + vb[0] + ' ' + vb[1], role: 'img', 'aria-label': spec.title }, host)
  const edges: Record<string, { line: SVGElement; ar: SVGElement; pts: Pt[] }> = {}
  const nodes: Record<string, SVGElement> = {}
  const bdg: Record<string, SVGElement> = {}
  ;(spec.edges || []).forEach(e => {
    const A = N[e[0] as string], B = N[e[1] as string]
    if (!A || !B) return
    const g = s('g', {}, svg)
    let pts: Pt[], lab: Pt
    if (e[3]) {
      const yb = Math.max(A.y + A.h / 2, B.y + B.h / 2) + (e[3] as number)
      pts = [{ x: A.x, y: A.y + A.h / 2 + 3 }, { x: A.x, y: yb }, { x: B.x, y: yb }, { x: B.x, y: B.y + B.h / 2 + 3 }]
      lab = { x: (A.x + B.x) / 2, y: yb + 15 }
    } else {
      let p1 = clip(B, A), p2 = clip(A, B)
      if (spec.edges.some(r => r[0] === e[1] && r[1] === e[0] && !r[3])) {
        const L = Math.hypot(p2.x - p1.x, p2.y - p1.y) || 1, ox = -(p2.y - p1.y) / L * 12, oy = (p2.x - p1.x) / L * 12
        p1 = { x: p1.x + ox, y: p1.y + oy }; p2 = { x: p2.x + ox, y: p2.y + oy }
      }
      pts = [p1, p2]; lab = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 - 8 }
    }
    const line = s('path', { class: 'edge', d: pathD(pts) }, g)
    const n2 = pts.length, q = pts[n2 - 1], r0 = pts[n2 - 2], ang = Math.atan2(q.y - r0.y, q.x - r0.x)
    const ar = s('polygon', { class: 'arrow', points: [[0, 0], [-11, -5.5], [-11, 5.5]].map(v => (q.x + v[0] * Math.cos(ang) - v[1] * Math.sin(ang)) + ',' + (q.y + v[0] * Math.sin(ang) + v[1] * Math.cos(ang))).join(' ') }, g)
    if (e[2]) { const tx = s('text', { class: 'elab', x: lab.x, y: lab.y }, g); tx.textContent = String(e[2]) }
    edges[e[0] + '>' + e[1]] = { line, ar, pts }
  })
  const dot = s('circle', { class: 'dot', r: 8, cx: -20, cy: -20 }, svg)
  spec.nodes.forEach(nn => {
    const n = N[nn.id]
    const g = s('g', { class: 'node' }, svg)
    s('rect', { x: n.x - n.w / 2, y: n.y - n.h / 2, width: n.w, height: n.h, rx: 12 }, g)
    const lh = 16, tot = lh * n.lw[0].length + (n.sub ? 4 + 13 * n.sw[0].length : 0), y0 = n.y - tot / 2
    n.lw[0].forEach((ln, i) => { const l = s('text', { x: n.x, y: y0 + 12 + i * lh, style: 'font-size:' + (13 * n.lw[1]).toFixed(1) + 'px' }, g); l.textContent = ln })
    n.sw[0].forEach((ln, i) => { const u = s('text', { class: 'sub', x: n.x, y: y0 + lh * n.lw[0].length + 4 + 10 + i * 13, style: 'font-size:' + (11 * n.sw[1]).toFixed(1) + 'px' }, g); u.textContent = ln })
    nodes[n.id] = g
    if (order[n.id]) {
      const b = s('g', { class: 'bdg' }, svg)
      s('circle', { cx: n.x + n.w / 2 - 4, cy: n.y - n.h / 2 + 4, r: 10 }, b)
      const bt = s('text', { x: n.x + n.w / 2 - 4, y: n.y - n.h / 2 + 8 }, b)
      bt.textContent = String(order[n.id]); bdg[n.id] = b
    }
  })
  const ctl = h('div', 'ctl', null, host)
  const bPlay = h('button', 'pri', '▶ Play', ctl) as HTMLButtonElement
  const bPause = h('button', '', '❚❚ Pause', ctl) as HTMLButtonElement
  const bRe = h('button', '', '↺ Replay', ctl) as HTMLButtonElement
  const bBack = h('button', '', '◀ Step', ctl) as HTMLButtonElement
  const bFwd = h('button', '', 'Step ▶', ctl) as HTMLButtonElement
  const cnt = h('span', '', '', ctl)
  const ban = h('div', 'banner', null, host), circ = h('div', 'circ', '', ban), bt = h('div', 'bt', null, ban)
  const kick = h('small', '', '', bt), bh = h('h4', 'bh', '', bt), bp = h('p', 'bp', '', bt)
  const segs = h('div', 'segs', null, ban)
  const sg = steps.map((_st, i) => {
    const x = h('i', '', null, segs); x.title = 'Go to step ' + (i + 1)
    x.onclick = () => { stop(); fresh = false; overview = false; T = (i + 1) * STEP_MS - 1; draw() }
    return x
  })
  function pos() { const i = Math.min(last, Math.floor(T / STEP_MS)); return { i, t: Math.min(1, (T - i * STEP_MS) / STEP_MS) } }
  function edgeKey(e: string[] | string[][]): string[] {
    // a step may light one edge ['a','b'] or several [['a','o'],['b','o']]
    if (!e || !e.length) return []
    if (Array.isArray(e[0])) return (e as string[][]).map(x => x.join('>'))
    return [(e as string[]).join('>')]
  }
  function draw() {
    const p = pos(), idx = fresh ? -1 : p.i, t = p.t
    const seenN: Record<string, 1> = {}, seenE: Record<string, 1> = {}, cur: Record<string, 1> = {}, eCol: Record<string, number> = {}
    for (let i = 0; i <= idx; i++) {
      ;(steps[i].on || []).forEach(n => { seenN[n] = 1 })
      if (steps[i].edge && (i < idx || t >= EDGE_FRAC)) edgeKey(steps[i].edge as string[]).forEach(k => { seenE[k] = 1; eCol[k] = (i + 1) % 6 })
    }
    if (idx >= 0) (steps[idx].on || []).forEach(n => { cur[n] = 1 })
    if (overview) { for (const k in nodes) seenN[k] = 1; for (const q in edges) { seenE[q] = 1; eCol[q] = 1 } }
    for (const id in nodes) {
      nodes[id].setAttribute('class', 'node k' + ((order[id] || 1) % 6) + (seenN[id] ? ' seen' : '') + (cur[id] && !overview ? ' active' : ''))
      if (bdg[id]) bdg[id].setAttribute('class', 'bdg k' + ((order[id] || 1) % 6) + (seenN[id] ? ' seen' : ''))
    }
    for (const key in edges) {
      const E = edges[key], on = !!seenE[key]
      E.line.setAttribute('class', 'edge k' + (eCol[key] || 0) + (on ? ' seen' : ''))
      E.ar.setAttribute('class', 'arrow k' + (eCol[key] || 0) + (on ? ' seen' : ''))
      E.line.setAttribute('d', pathD(E.pts))
    }
    dot.setAttribute('cx', '-20')
    if (idx >= 0 && !overview && steps[idx].edge && t < EDGE_FRAC) {
      const keys = edgeKey(steps[idx].edge as string[])
      keys.forEach((k, j) => {
        const E2 = edges[k]
        if (!E2) return
        const pp = partial(E2.pts, t / EDGE_FRAC), end = pp[pp.length - 1]
        if (j === 0) { dot.setAttribute('cx', String(end.x)); dot.setAttribute('cy', String(end.y)) }
        E2.line.setAttribute('class', 'edge k' + ((idx + 1) % 6) + ' seen'); E2.line.setAttribute('d', pathD(pp))
      })
    }
    const sp = idx >= 0 ? split(steps[idx].text) : null
    ban.className = 'banner k' + (idx < 0 || overview ? 0 : (idx + 1) % 6)
    circ.textContent = overview ? '◎' : idx < 0 ? '▶' : String(idx + 1)
    kick.textContent = overview ? 'OVERVIEW · ALL COMPONENTS' : idx < 0 ? 'READY' : 'STEP ' + (idx + 1) + ' OF ' + steps.length
    bh.textContent = overview ? spec.title : idx < 0 ? spec.title : sp![0]
    bp.textContent = overview ? 'Press Play to follow the flow one step at a time.' : idx < 0 ? 'Press Play (or Step ▶) and follow the gold dot.' : sp![1].charAt(0).toUpperCase() + sp![1].slice(1)
    sg.forEach((x, j) => { x.className = overview || j <= idx ? 'on' : '' })
    cnt.textContent = fresh ? '' : Math.floor(T / 1000) + 's / ' + Math.round(TOTAL / 1000) + 's'
    bPlay.disabled = playing; bPause.disabled = !playing
  }
  function tick(now: number) {
    if (!playing) return
    T += now - prev; prev = now
    if (T >= TOTAL - 1) { T = TOTAL - 1; playing = false }
    draw()
    if (playing) raf = requestAnimationFrame(tick)
  }
  function stop() { playing = false; cancelAnimationFrame(raf) }
  function play() {
    if (overview || T >= TOTAL - 1) T = 0
    overview = false; fresh = false; playing = true; prev = performance.now(); raf = requestAnimationFrame(tick); draw()
  }
  bPlay.onclick = play
  bPause.onclick = () => { stop(); draw() }
  bRe.onclick = () => { stop(); T = 0; play() }
  bFwd.onclick = () => { stop(); const i = overview || fresh ? 0 : Math.min(last, pos().i + 1); overview = false; fresh = false; T = (i + 1) * STEP_MS - 1; draw() }
  bBack.onclick = () => { stop(); const i = overview ? last - 1 : Math.max(0, pos().i - 1); overview = false; fresh = false; T = (i + 1) * STEP_MS - 1; draw() }
  draw()
  return { play, stop, isFresh: () => fresh }
}

export default function StoryDiagram({ spec }: { spec: AnimSpec }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const host = ref.current
    if (!host) return
    host.innerHTML = ''
    host.className = ''
    const ctl = mount(host, spec)
    const reduce = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let io: IntersectionObserver | null = null
    if (!reduce && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(entries => {
        if (entries.some(e => e.isIntersecting && e.intersectionRatio >= 0.5) && ctl.isFresh()) {
          ctl.play()
          io?.disconnect()
        }
      }, { threshold: [0.5] })
      io.observe(host)
    }
    return () => { ctl.stop(); io?.disconnect(); host.innerHTML = '' }
  }, [spec])
  return <div ref={ref} />
}
