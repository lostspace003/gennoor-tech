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
    }).catch((err) => {
      console.error('PageView tracking failed:', err)
    })
  }, [pathname])

  return null
}
