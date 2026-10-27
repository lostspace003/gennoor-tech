'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getAttribution, getSession, getVisitor, isInternalClient, send } from '@/lib/track-client'

export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    if (isInternalClient()) return
    const visitor = getVisitor()
    const session = getSession()
    const { first, last } = getAttribution()

    send('/api/log-pageview', {
      page: pathname,
      url: window.location.href,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent || '',
      timestamp: new Date().toISOString(),
      visitorId: visitor.id,
      sessionId: session.id,
      isNewVisitor: visitor.isNew,
      isNewSession: session.isNew,
      firstTouch: first,
      lastTouch: last,
    })
  }, [pathname])

  return null
}
