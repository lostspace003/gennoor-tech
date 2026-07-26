'use client'

import { useEffect } from 'react'

// Material-style click ripple on every button/button-like element, site-wide.
// One document-level listener; the ink span is appended to the pressed element
// and removed when its animation ends. Opt out with data-no-ripple.
export default function RippleProvider() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return
      const target = (e.target as HTMLElement)?.closest?.(
        'button, [role="button"], .btn, a.btn-primary, a.btn-secondary, a.btn-outline'
      ) as HTMLElement | null
      if (!target || target.closest('[data-no-ripple]')) return

      const rect = target.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height) * 2
      const ink = document.createElement('span')
      ink.className = 'ripple-ink'
      ink.style.width = ink.style.height = `${size}px`
      ink.style.left = `${e.clientX - rect.left - size / 2}px`
      ink.style.top = `${e.clientY - rect.top - size / 2}px`

      const style = getComputedStyle(target)
      if (style.position === 'static') target.classList.add('ripple-host-pos')
      target.classList.add('ripple-host')
      ink.addEventListener('animationend', () => {
        ink.remove()
        // Drop the transient clipping/positioning once the last ink is gone
        if (!target.querySelector('.ripple-ink')) {
          target.classList.remove('ripple-host', 'ripple-host-pos')
        }
      })
      target.appendChild(ink)
    }

    document.addEventListener('pointerdown', onPointerDown, { passive: true })
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return null
}
