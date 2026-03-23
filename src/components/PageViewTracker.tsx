'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function PageViewTracker() {
  const pathname = usePathname()

  useEffect(() => {
    const payload = {
      page: pathname,
      url: window.location.href,
      referrer: document.referrer || '',
      userAgent: navigator.userAgent || '',
      ip: '',
      country: '',
      city: '',
      timestamp: new Date().toISOString(),
    }

    fetch('/api/log-pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently ignore tracking errors
    })
  }, [pathname])

  return null
}
