'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Two panels side by side with a draggable divider (stacked on small screens). The left width is remembered per `id`.
 * Content in both panels reflows as the divider moves because widths are plain CSS, not fixed pixels.
 */
export default function SplitPane({ id, left, right, min = 220, initial = 340 }: { id: string; left: ReactNode; right: ReactNode; min?: number; initial?: number }) {
  const [w, setW] = useState(initial)
  const [wide, setWide] = useState(true)
  const box = useRef<HTMLDivElement>(null)
  const key = `split:${id}`

  useEffect(() => {
    try { const v = Number(localStorage.getItem(key)); if (v >= min) setW(v) } catch { /* storage unavailable */ }
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setWide(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [key, min])

  const drag = (e: React.PointerEvent) => {
    e.preventDefault()
    const el = box.current; if (!el) return
    const move = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect()
      setW(Math.round(Math.min(Math.max(min, ev.clientX - r.left), r.width - min - 12)))
    }
    const up = () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up)
      document.body.style.userSelect = ''
      setW(cur => { try { localStorage.setItem(key, String(cur)) } catch { /* ignore */ } return cur })
    }
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }
  const nudge = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setW(x => Math.max(min, x - 24))
    if (e.key === 'ArrowRight') setW(x => x + 24)
  }

  return (
    <div ref={box} className="flex flex-col lg:flex-row gap-4 lg:gap-0 items-start">
      <div className="w-full lg:shrink-0 min-w-0" style={wide ? { width: w } : undefined}>{left}</div>
      <div
        role="separator" aria-orientation="vertical" tabIndex={0} title="Drag to resize" onPointerDown={drag} onKeyDown={nudge}
        className="hidden lg:flex self-stretch w-3 mx-0.5 shrink-0 cursor-col-resize items-center justify-center group focus:outline-none"
      ><span className="w-1 h-10 rounded bg-gray-300 group-hover:bg-blue-500 group-focus:bg-blue-500" /></div>
      <div className="w-full min-w-0 lg:flex-1">{right}</div>
    </div>
  )
}

/**
 * Drop-in for a two-child CSS grid: keeps the page's own height/overflow behaviour, adds a draggable divider.
 * `fixed` says which child has the pixel width; the other takes the rest. Needs `breakpoint` px of room to go side by side.
 */
export function ResizeGrid({ id, fixed = 'first', initial, min = 220, breakpoint = 1024, className = '', children }: { id: string; fixed?: 'first' | 'second'; initial: number; min?: number; breakpoint?: number; className?: string; children: [ReactNode, ReactNode] }) {
  const [w, setW] = useState(initial)
  const [wide, setWide] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const key = `split:${id}`
  useEffect(() => {
    try { const v = Number(localStorage.getItem(key)); if (v >= min) setW(v) } catch { /* storage unavailable */ }
    const mq = window.matchMedia(`(min-width: ${breakpoint}px)`)
    const on = () => setWide(mq.matches)
    on(); mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [key, min, breakpoint])
  const drag = (e: React.PointerEvent) => {
    e.preventDefault()
    const el = box.current; if (!el) return
    const move = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const px = fixed === 'first' ? ev.clientX - r.left : r.right - ev.clientX
      setW(Math.round(Math.min(Math.max(min, px), r.width - min - 16)))
    }
    const up = () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up)
      document.body.style.userSelect = ''
      setW(cur => { try { localStorage.setItem(key, String(cur)) } catch { /* ignore */ } return cur })
    }
    document.body.style.userSelect = 'none'
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up)
  }
  const nudge = (e: React.KeyboardEvent) => {
    const d = e.key === 'ArrowLeft' ? -24 : e.key === 'ArrowRight' ? 24 : 0
    if (d) setW(x => Math.max(min, x + (fixed === 'first' ? d : -d)))
  }
  const cols = fixed === 'first' ? `${w}px 16px minmax(0,1fr)` : `minmax(0,1fr) 16px ${w}px`
  return (
    <div ref={box} className={`${wide ? '' : 'grid gap-4'} ${className}`} style={wide ? { display: 'grid', gridTemplateColumns: cols } : undefined}>
      {children[0]}
      {wide && <div role="separator" aria-orientation="vertical" tabIndex={0} title="Drag to resize" onPointerDown={drag} onKeyDown={nudge} className="flex cursor-col-resize items-center justify-center group focus:outline-none"><span className="w-1 h-10 rounded bg-gray-300 group-hover:bg-blue-500 group-focus:bg-blue-500" /></div>}
      {children[1]}
    </div>
  )
}
