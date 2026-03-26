'use client'

import { useEffect, useRef } from 'react'
import { Star, ExternalLink } from 'lucide-react'

const trustpilotReviews = [
  {
    name: 'Bhavesh Shah',
    rating: 5,
    title: 'Excellent Trainer',
    text: "I have been utilizing training services of Jalal for different courses on Microsoft and AI. He is an excellent trainer when it comes to delivering official training and bespoke courses on AI. I would highly recommend him.",
    date: '2026-03-25',
  },
  {
    name: 'Tech Bliss',
    rating: 5,
    title: 'It was truly an awesome learning experience',
    text: "It was truly an awesome learning experience throughout the training. The sessions were well-structured, clear, and very easy to follow. Real-world examples and practical explanations made the concepts much more relatable. Overall, it was highly engaging, informative, and added great value to my understanding.",
    date: '2026-03-25',
  },
]

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
              <svg viewBox="0 0 126 31" className="h-7 w-auto" fill="none">
                <path d="M33.4 0H0v30.9h33.4V0z" fill="#00b67a"/>
                <path d="M19.3 11.6h-5.8l-1.8-5.5-1.8 5.5H4.1l4.7 3.4-1.8 5.5 4.7-3.4 4.7 3.4-1.8-5.5 4.7-3.4z" fill="#fff"/>
                <path d="M15.4 17.1l-.4-1.3-4.7 3.4 5.1-2.1z" fill="#005128"/>
              </svg>
              <span className="text-white font-bold text-lg tracking-wide">Trustpilot</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-7 h-7 bg-[#00b67a] border border-white/30 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-white" />
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="divide-y divide-gray-100">
            {trustpilotReviews.map((review, i) => (
              <div key={i} className="px-6 py-5">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-[#00b67a] flex items-center justify-center text-white font-semibold text-sm">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{review.name}</p>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, j) => (
                        <Star key={j} className="w-3.5 h-3.5 text-[#00b67a] fill-[#00b67a]" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="font-semibold text-gray-900 text-sm mb-1">{review.title}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="px-6 py-6 bg-gray-50 text-center border-t border-gray-100">
            <a
              href="https://www.trustpilot.com/review/gennoor.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00b67a] text-white font-semibold rounded-xl hover:bg-[#009567] transition-colors shadow-md hover:shadow-lg"
            >
              <Star className="w-4 h-4 fill-white" />
              Leave a Review on Trustpilot
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                Takes 2 minutes
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                100% independent reviews
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                2000+ professionals trained
              </span>
            </div>

            {/* Trustpilot native widget fallback */}
            <div className="mt-4">
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
                <a href="https://www.trustpilot.com/review/gennoor.com" target="_blank" rel="noopener">
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
