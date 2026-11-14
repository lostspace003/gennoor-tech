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
 *
 * While a CHANGE is being made (a send, a save, a delete: anything that is not just reading), the page is held:
 * nothing else can be pressed until it has finished (owner: "when there is a refresh, that means some action
 * is being taken ... let that action complete, and we should be holding on to that action"). Reading is never
 * held, so a slow list does not lock the screen. The hold lets go by itself after HOLD_AT_MOST_MS, so a
 * request that never answers cannot freeze the page.
 * One circle only: the browser's own "busy" pointer is not switched on as well.
 *
 * The hold lasts until the page SHOWS the change, not only until the server has taken it (owner, 14 November
 * 2026, moving a lead from New to Emailed: "it should lock the screen until it is shifted from one option to
 * another. That is not there"). A page saves, then reads its list again; the hold used to let go between the
 * two, so for a few seconds the old step was on screen and everything could be pressed. Now the reading that
 * follows a change is held too (for FOLLOW_AT_MOST_MS at the longest).
 * Choosing from a drop-down list counts as an action as well: a browser's own list sends no pointer event to
 * the page, so a choice made slowly was not seen as something a person did, and nothing was held at all.
 */
const HOLD_AT_MOST_MS = 20_000
const FOLLOW_AT_MOST_MS = 10_000
const FOLLOW_WITHIN_MS = 300
const SHOW_AFTER_MS = 250
const CLICK_WINDOW_MS = 4000

export default function BusyPointer() {
  const [busy, setBusy] = useState(false)
  const [held, setHeld] = useState(false)
  const dot = useRef<HTMLDivElement>(null)
  const at = useRef({ x: -100, y: -100, seen: false })

  useEffect(() => {
    let active = 0
    let writes = 0
    let letGo: ReturnType<typeof setTimeout> | null = null
    let lastAct = 0
    const hold = () => { writes++; setHeld(true); if (letGo) clearTimeout(letGo); letGo = setTimeout(() => { writes = 0; setHeld(false) }, HOLD_AT_MOST_MS) }
    const release = () => { writes = Math.max(0, writes - 1); if (writes === 0) { if (letGo) { clearTimeout(letGo); letGo = null } setHeld(false) } }
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
      // A request made while a change is being held belongs to that change: the page reading its list again
      const follows = ours && writes > 0
      const shown = ours && (follows || Date.now() - lastAct < CLICK_WINDOW_MS)
      if (!shown) return real(...args)
      const method = String((args[1] as RequestInit | undefined)?.method || (args[0] instanceof Request ? args[0].method : 'GET')).toUpperCase()
      const change = method !== 'GET' && method !== 'HEAD'
      start()
      if (change) {
        hold()
        // Let go a moment after the answer, so the reading the page starts next is caught by the hold
        try { return await real(...args) } finally { end(); setTimeout(release, FOLLOW_WITHIN_MS) }
      }
      if (follows) {
        hold()
        let over = false
        const off = () => { if (!over) { over = true; release() } }
        const cap = setTimeout(off, FOLLOW_AT_MOST_MS)
        try { return await real(...args) } finally { end(); clearTimeout(cap); off() }
      }
      try { return await real(...args) } finally { end() }
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', acted, true)
    window.addEventListener('keydown', acted, true)
    window.addEventListener('change', acted, true)
    return () => {
      window.fetch = real
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', acted, true)
      window.removeEventListener('keydown', acted, true)
      window.removeEventListener('change', acted, true)
      if (timer) clearTimeout(timer)
      if (letGo) clearTimeout(letGo)
    }
  }, [])

  if (!busy && !held) return null
  return (
    <>
    {held && <div className="fixed inset-0 z-[190] cursor-wait" aria-hidden="true" onClickCapture={(e) => { e.preventDefault(); e.stopPropagation() }} />}
    {busy && <div ref={dot} role="status" aria-label="Working" className={`pointer-events-none fixed z-[200] ${at.current.seen ? 'left-0 top-0' : 'right-4 top-16'}`}>
      <span className="block h-5 w-5 rounded-full border-2 border-gray-300 border-t-primary-600 animate-spin motion-reduce:animate-none bg-raised/80 shadow-sm" />
    </div>}
    </>
  )
}
