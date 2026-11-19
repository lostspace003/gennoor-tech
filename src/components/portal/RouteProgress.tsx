'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * The thin bar at the very top while a page is opening.
 *
 * It starts the moment a link is pressed, not when the new page arrives (owner, 14 November 2026: "when I
 * click, I don't see any changes ... at least something should happen"). Until that day it began only after
 * the address had changed, so the whole wait showed nothing and a click looked dead. Now: a press on a link to
 * another page of the site starts the bar and it creeps while the page is fetched; when the address changes it
 * runs to the end and fades. If nothing arrives in fifteen seconds it gives up quietly.
 * It also tells the rest of the page, with the event "route:pending", which address was asked for, so a menu
 * can light the row that was pressed at once.
 */
export default function RouteProgress() {
  const pathname = usePathname()
  const barRef = useRef<HTMLDivElement>(null)
  const running = useRef(false)
  // The link that was pressed is marked until its page is here, so the press itself can be seen (globals.css)
  const pressed = useRef<HTMLAnchorElement | null>(null)
  const giveUp = useRef<number | null>(null)

  const finish = () => {
    const bar = barRef.current
    if (giveUp.current) { window.clearTimeout(giveUp.current); giveUp.current = null }
    if (!bar || !running.current) return
    running.current = false
    bar.style.transition = 'width 0.15s ease-in, opacity 0.3s ease 0.15s'
    bar.style.width = '100%'
    bar.style.opacity = '0'
    pressed.current?.removeAttribute('data-pending')
    pressed.current = null
    window.dispatchEvent(new CustomEvent('route:pending', { detail: '' }))
    window.setTimeout(() => { if (!running.current && barRef.current) { barRef.current.style.transition = 'none'; barRef.current.style.width = '0%' } }, 500)
  }

  useEffect(() => {
    const start = (to: string) => {
      const bar = barRef.current
      if (!bar) return
      running.current = true
      bar.style.transition = 'none'
      bar.style.opacity = '1'
      bar.style.width = '0%'
      void bar.offsetWidth
      // Quickly to a third, then slowly on: it keeps moving for as long as the page takes
      bar.style.transition = 'width 0.2s ease-out'
      bar.style.width = '35%'
      window.setTimeout(() => { if (running.current && barRef.current) { barRef.current.style.transition = 'width 8s cubic-bezier(0.1, 0.6, 0.3, 1)'; barRef.current.style.width = '92%' } }, 220)
      window.dispatchEvent(new CustomEvent('route:pending', { detail: to }))
      if (giveUp.current) window.clearTimeout(giveUp.current)
      giveUp.current = window.setTimeout(finish, 15_000)
    }
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      let url: URL
      try { url = new URL(a.href, window.location.href) } catch { return }
      if (url.origin !== window.location.origin) return
      // The same page (or only a place on it, or only its ?query): nothing to wait for. A change of the query
      // alone does not change the path, so the bar would never be told the page is there and crept on for 15 s.
      if (url.pathname === window.location.pathname) return
      pressed.current?.removeAttribute('data-pending')
      pressed.current = a
      a.setAttribute('data-pending', '1')
      start(url.pathname)
    }
    // Listened for on the way DOWN (capture): a Next.js <Link> cancels the browser's own click in its handler,
    // so on the way back up every press on a menu row looked "already handled" and the bar never started
    document.addEventListener('click', onClick, true)
    return () => { document.removeEventListener('click', onClick, true); if (giveUp.current) window.clearTimeout(giveUp.current) }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // The new page is here
  useEffect(() => { finish() }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[80] h-[3px] w-0 bg-primary-600 opacity-0"
    />
  )
}
