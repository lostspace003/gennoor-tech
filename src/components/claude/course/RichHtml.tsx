'use client'

/** Authored HTML rendered through the notebook upgrade (no interactive widgets). */
import { useLayoutEffect, useRef } from 'react'
import { upgradeContent } from './upgradeContent'

export default function RichHtml({ html, className }: { html: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.innerHTML = html
    upgradeContent(el)
  }, [html])
  return <div ref={ref} className={className ?? 'cc-prose'} />
}
