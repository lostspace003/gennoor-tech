'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getSession, getVisitor, isInternalClient, send } from '@/lib/track-client'

/**
 * Micro-interactions: scroll depth on /guides/*, clicks on high-intent CTAs, and enquiry forms that are
 * started but left. Marks a CTA by text or by data-track="label". Renders nothing.
 */
const CTA_TEXT = /book\s*(a\s*)?(free\s*)?(expert\s*)?(call|consult)|download\s+(the\s+)?(syllabus|brochure|catalog)|schedule|get\s+started|talk\s+to|enquire|enroll/i
const MILESTONES = [25, 50, 75, 100]

function emit(type: string, page: string, meta: Record<string, unknown>) {
  send('/api/track-event', { type, page, visitorId: getVisitor().id, sessionId: getSession().id, meta })
}

export default function BehaviorTracker() {
  const pathname = usePathname()

  // Scroll depth, once per milestone per page view
  useEffect(() => {
    if (isInternalClient() || !pathname.startsWith('/guides/')) return
    const seen = new Set<number>()
    let ticking = false
    const check = () => {
      ticking = false
      // Background tabs do not scroll, and hidden tabs are not engagement
      if (document.hidden) return
      const el = document.documentElement
      const max = el.scrollHeight - window.innerHeight
      const pct = max <= 0 ? 100 : Math.min(100, Math.round((window.scrollY / max) * 100))
      for (const m of MILESTONES) {
        if (pct >= m && !seen.has(m)) { seen.add(m); emit('scroll_depth', pathname, { depth: m }) }
      }
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(check) } }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  // CTA clicks (delegated: one listener, no per-button wiring)
  useEffect(() => {
    if (isInternalClient()) return
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('a,button,[data-track]') as HTMLElement | null
      if (!el) return
      const label = (el.getAttribute('data-track') || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80)
      const href = (el as HTMLAnchorElement).href || ''
      const isCalendar = /\/resources\/calendar|calendly|\/book/i.test(href)
      if (!el.hasAttribute('data-track') && !CTA_TEXT.test(label) && !isCalendar) return
      emit('cta_click', location.pathname, { label, target_url: href.slice(0, 300) })
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [pathname])

  // Form abandonment: a field was touched, the form never submitted, the page is being left
  useEffect(() => {
    if (isInternalClient()) return
    let form: HTMLFormElement | null = null
    let lastField = ''
    let submitted = false
    const onFocus = (e: FocusEvent) => {
      const t = e.target as HTMLElement | null
      if (!t || !/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return
      const f = t.closest('form')
      if (!f) return
      form = f
      // field name only, never what was typed
      lastField = (t as HTMLInputElement).name || t.id || t.tagName.toLowerCase()
    }
    const onSubmit = () => { submitted = true }
    const leave = () => {
      if (form && lastField && !submitted) {
        emit('form_abandon', location.pathname, { last_field: lastField, form: form.getAttribute('data-form') || form.id || form.getAttribute('action') || '' })
        lastField = ''
      }
    }
    const onVisibility = () => { if (document.visibilityState === 'hidden') leave() }
    document.addEventListener('focusin', onFocus)
    document.addEventListener('submit', onSubmit, true)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('pagehide', leave)
    return () => {
      document.removeEventListener('focusin', onFocus)
      document.removeEventListener('submit', onSubmit, true)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pagehide', leave)
      leave() // client-side route change away from the form
    }
  }, [pathname])

  return null
}
