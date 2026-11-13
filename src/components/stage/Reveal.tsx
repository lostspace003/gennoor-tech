'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Holds back the arrival of what is inside it until it is on screen.
 *
 * Inside, give things the class st-rise, st-fade, st-pop, st-left or st-right, and
 * style={{ '--i': n }} to make them arrive in turn. At the top of a page they need no
 * Reveal: there the same classes play when the page loads. Bars (st-grow) and drawn
 * lines (st-draw) wait in the same way.
 *
 * Use it for one picture or one group that is worth watching arrive, not around every
 * section: a page where everything slides in reads as a template.
 */
export default function Reveal({ children, className, as: Tag = 'div' }: { children: ReactNode; className?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setSeen(true); io.disconnect() } },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return <Tag ref={ref} className={cn('st-reveal', seen && 'st-in', className)}>{children}</Tag>
}
