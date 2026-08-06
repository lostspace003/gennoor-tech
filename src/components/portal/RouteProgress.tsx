'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Slim route-change progress bar — a 2px gradient strip pinned to the very top
 * of the viewport. On every pathname change it sweeps 0 → 80% quickly, then
 * completes to 100% and fades out. Pure CSS transitions driven by JS; no library.
 */
export default function RouteProgress() {
  const pathname = usePathname()
  const barRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    // Skip the initial page load — only animate on client-side navigations.
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    const bar = barRef.current
    if (!bar) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return

    // Reset instantly to 0 width, fully visible.
    bar.style.transition = 'none'
    bar.style.opacity = '1'
    bar.style.width = '0%'
    // Force a reflow so the reset applies before animating.
    void bar.offsetWidth

    // Sweep quickly to 80%…
    bar.style.transition = 'width 0.25s ease-out'
    bar.style.width = '80%'

    // …then complete and fade away.
    const complete = window.setTimeout(() => {
      bar.style.transition = 'width 0.15s ease-in, opacity 0.3s ease 0.15s'
      bar.style.width = '100%'
      bar.style.opacity = '0'
    }, 270)

    // Reset silently once hidden, ready for the next navigation.
    const cleanup = window.setTimeout(() => {
      bar.style.transition = 'none'
      bar.style.width = '0%'
    }, 800)

    return () => {
      window.clearTimeout(complete)
      window.clearTimeout(cleanup)
    }
  }, [pathname])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[2px]"
    >
      <div
        ref={barRef}
        className="h-full w-0 bg-primary-500 opacity-0"
      />
    </div>
  )
}
