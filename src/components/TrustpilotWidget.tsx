'use client'

import { useEffect, useRef } from 'react'

export default function TrustpilotWidget() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && (window as any).Trustpilot) {
      ;(window as any).Trustpilot.loadFromElement(ref.current, true)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id="56278e9abfbbba0bdcd568bc"
      data-businessunit-id="69c36ea88db35bd56c6412f8"
      data-style-height="52px"
      data-style-width="100%"
      data-token="be1c0575-6b24-43fb-beae-5efb4c8cf788"
    >
      <a
        href="https://www.trustpilot.com/review/gennoor.com"
        target="_blank"
        rel="noopener"
      >
        Trustpilot
      </a>
    </div>
  )
}
