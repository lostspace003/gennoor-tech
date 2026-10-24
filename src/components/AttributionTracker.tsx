'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Remembers where a visitor came from (the campaign tag in the link, the site that sent them, the page they
 * landed on) and attaches it to every enquiry they send later, so each form shows what led to it.
 * Nothing is shown to the visitor and no extra fields are added to any form.
 *   campaign links:  gennoor.com/studio?src=linkedin-walkthrough   (also utm_source, utm_medium, utm_campaign)
 */
const KEY = 'gnr-attribution'
const ENQUIRY_ENDPOINTS = /\/api\/(contact-enquiry|custom-training|book-expert-call|training-enquiry|certification-enquiry|webinar-register|claude-cowork-register|join|newsletter-subscribe)(\?|$)/

interface Attribution { src?: string; medium?: string; campaign?: string; referrer?: string; landing?: string; at?: string }

function read(): Attribution {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

function capture() {
  try {
    const q = new URLSearchParams(window.location.search)
    const src = q.get('src') || q.get('utm_source') || ''
    const stored = read()
    // A new campaign tag replaces the old one; otherwise keep the first-touch details of this visitor.
    if (src) {
      localStorage.setItem(KEY, JSON.stringify({
        src: src.slice(0, 80),
        medium: (q.get('utm_medium') || '').slice(0, 80),
        campaign: (q.get('utm_campaign') || '').slice(0, 80),
        referrer: document.referrer ? new URL(document.referrer).hostname : stored.referrer || '',
        landing: window.location.pathname,
        at: new Date().toISOString(),
      }))
    } else if (!stored.landing) {
      let ref = ''
      try { ref = document.referrer ? new URL(document.referrer).hostname : '' } catch { /* ignore */ }
      if (ref === window.location.hostname) ref = ''
      localStorage.setItem(KEY, JSON.stringify({ referrer: ref, landing: window.location.pathname, at: new Date().toISOString() }))
    }
  } catch { /* private mode: no attribution, forms still work */ }
}

export default function AttributionTracker() {
  const pathname = usePathname()

  useEffect(() => {
    capture()
    const w = window as unknown as { __gnrAttr?: boolean }
    if (w.__gnrAttr) return
    w.__gnrAttr = true
    const original = window.fetch.bind(window)
    window.fetch = (input, init) => {
      try {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.pathname : (input as Request).url
        if (init?.method?.toUpperCase() === 'POST' && ENQUIRY_ENDPOINTS.test(url)) {
          const a = read()
          const payload = { ...a, page: window.location.pathname + window.location.search.replace(/[?&](src|utm_[a-z]+)=[^&]*/g, '') }
          const headers = new Headers(init.headers)
          headers.set('x-gnr-attr', encodeURIComponent(JSON.stringify(payload)))
          return original(input, { ...init, headers })
        }
      } catch { /* never block a form */ }
      return original(input, init)
    }
  }, [])

  // a campaign tag on a later page of the same visit
  useEffect(() => { capture() }, [pathname])

  return null
}
