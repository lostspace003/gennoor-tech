'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

// Site-wide circular page transition: on an internal link click a circle grows from the click point and
// covers the page, the route changes underneath, then the circle shrinks back to reveal the new page.
// Honours prefers-reduced-motion. Opt a link out with data-no-transition.
const COVER = 220
const REVEAL = 320

export default function CircleTransition() {
  const router = useRouter()
  const path = usePathname()
  const veil = useRef<HTMLDivElement>(null)
  const origin = useRef<[number, number]>([0, 0])
  const waiting = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const radius = () => `${Math.hypot(window.innerWidth, window.innerHeight)}px`
  const clip = (r: string) => `circle(${r} at ${origin.current[0]}px ${origin.current[1]}px)`

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as HTMLElement | null)?.closest?.('a') as HTMLAnchorElement | null
      if (!a || !a.href || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-transition')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return
      // The admin centre has its own quiet fade; a full-screen wipe there only slows people down.
      if (url.pathname.startsWith('/admin') || window.location.pathname.startsWith('/admin')) return
      const el = veil.current
      if (!el) return
      e.preventDefault()
      origin.current = [e.clientX, e.clientY]
      waiting.current = true
      el.style.visibility = 'visible'
      el.animate([{ clipPath: clip('0px') }, { clipPath: clip(radius()) }], { duration: COVER, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' })
      setTimeout(() => router.push(url.pathname + url.search + url.hash), COVER - 40)
      // Never leave the page covered if navigation stalls or fails.
      timer.current = setTimeout(() => reveal(), 4000)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  function reveal() {
    const el = veil.current
    if (!el || !waiting.current) return
    waiting.current = false
    clearTimeout(timer.current)
    const a = el.animate([{ clipPath: clip(radius()) }, { clipPath: clip('0px') }], { duration: REVEAL, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' })
    a.onfinish = () => { el.style.visibility = 'hidden' }
  }

  useEffect(() => { if (waiting.current) setTimeout(reveal, 60) }, [path])

  return <div ref={veil} aria-hidden style={{ visibility: 'hidden', clipPath: 'circle(0px at 0 0)' }} className="fixed inset-0 z-[9999] pointer-events-none bg-[#f5f5f7]" />
}
