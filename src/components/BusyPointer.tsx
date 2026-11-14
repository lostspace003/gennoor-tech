'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A small turning circle beside the pointer while something a person pressed is still working (owner,
 * 14 November 2026: "can we have that mouse click and then a circle button when something is processing ...
 * nicely animated in short, in simple"). It says "wait, this is working", so nobody presses twice or leaves
 * the screen in the middle of a send.
 *
 * It watches the requests the page makes to its own server. Only requests that begin just after a click or a
 * key are shown: the checks the page makes by itself in the background (the mailbox, every few minutes) are
 * not. It appears after a short moment, so a quick answer does not flicker. On a touch screen, where there is
 * no pointer, the circle sits at the top right instead.
 */
const SHOW_AFTER_MS = 250
const CLICK_WINDOW_MS = 4000

export default function BusyPointer() {
  const [busy, setBusy] = useState(false)
  const dot = useRef<HTMLDivElement>(null)
  const at = useRef({ x: -100, y: -100, seen: false })

  useEffect(() => {
    let active = 0
    let lastAct = 0
    let timer: ReturnType<typeof setTimeout> | null = null
    const place = () => { if (dot.current && at.current.seen) dot.current.style.transform = `translate(${at.current.x + 14}px, ${at.current.y + 14}px)` }
    const move = (e: PointerEvent) => { if (e.pointerType === 'mouse') { at.current = { x: e.clientX, y: e.clientY, seen: true }; place() } }
    const acted = () => { lastAct = Date.now() }
    const start = () => { active++; if (!timer) timer = setTimeout(() => { timer = null; if (active > 0) { setBusy(true); requestAnimationFrame(place) } }, SHOW_AFTER_MS) }
    const end = () => { active = Math.max(0, active - 1); if (active === 0) { if (timer) { clearTimeout(timer); timer = null } setBusy(false) } }

    const real = window.fetch
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof URL ? args[0].pathname : (args[0] as Request).url
      const ours = /^\/api\/|^https?:\/\/[^/]+\/api\//.test(url) && !/\/api\/auth\//.test(url)
      const shown = ours && Date.now() - lastAct < CLICK_WINDOW_MS
      if (!shown) return real(...args)
      start()
      try { return await real(...args) } finally { end() }
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', acted, true)
    window.addEventListener('keydown', acted, true)
    return () => {
      window.fetch = real
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', acted, true)
      window.removeEventListener('keydown', acted, true)
      if (timer) clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    document.documentElement.style.cursor = busy ? 'progress' : ''
    return () => { document.documentElement.style.cursor = '' }
  }, [busy])

  if (!busy) return null
  return (
    <div ref={dot} role="status" aria-label="Working" className={`pointer-events-none fixed z-[200] ${at.current.seen ? 'left-0 top-0' : 'right-4 top-16'}`}>
      <span className="block h-5 w-5 rounded-full border-2 border-gray-300 border-t-primary-600 animate-spin motion-reduce:animate-none bg-raised/80 shadow-sm" />
    </div>
  )
}
