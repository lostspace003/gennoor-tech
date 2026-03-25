'use client'

import { useEffect, useRef } from 'react'
import { Star, ExternalLink } from 'lucide-react'

export default function TrustpilotWidget() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && (window as any).Trustpilot) {
      ;(window as any).Trustpilot.loadFromElement(ref.current, true)
    }
  }, [])

  return (
    <section className="py-10 lg:py-14">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Green header bar */}
          <div className="bg-[#00b67a] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Trustpilot star logo */}
              <svg viewBox="0 0 126 31" className="h-7 w-auto" fill="none">
                <path d="M33.4 0H0v30.9h33.4V0z" fill="#00b67a"/>
                <path d="M19.3 11.6h-5.8l-1.8-5.5-1.8 5.5H4.1l4.7 3.4-1.8 5.5 4.7-3.4 4.7 3.4-1.8-5.5 4.7-3.4z" fill="#fff"/>
                <path d="M15.4 17.1l-.4-1.3-4.7 3.4 5.1-2.1z" fill="#005128"/>
              </svg>
              <span className="text-white font-bold text-lg tracking-wide">Trustpilot</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-7 h-7 bg-[#dcdce6] flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              How was your experience with Gennoor Tech?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              We value your feedback! If you&apos;ve attended our AI training, workshops, or consulting sessions,
              please take a moment to share your experience. Your review helps other enterprises make informed decisions.
            </p>

            {/* CTA Button */}
            <a
              href="https://www.trustpilot.com/review/gennoor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00b67a] text-white font-semibold text-lg rounded-xl hover:bg-[#009567] transition-colors shadow-md hover:shadow-lg"
            >
              <Star className="w-5 h-5 fill-white" />
              Leave a Review on Trustpilot
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>

            {/* Trust signals */}
            <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Takes 2 minutes
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                100% independent reviews
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                2000+ professionals trained
              </span>
            </div>

            {/* Trustpilot native widget (hidden fallback for when reviews exist) */}
            <div className="mt-6">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
