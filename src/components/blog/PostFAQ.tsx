'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FAQItem {
  question: string
  answer: string
}

interface PostFAQProps {
  faqs?: FAQItem[]
}

export default function PostFAQ({ faqs }: PostFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faqs || faqs.length === 0) return null

  return (
    <section
      className="px-6 sm:px-10 py-10"
      style={{ borderTop: '1px solid #f3f4f6', backgroundColor: '#ffffff' }}
      aria-label="Frequently asked questions"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
        Frequently asked questions
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Quick answers to the most common questions about this topic.
      </p>

      <div className="space-y-3">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <div
              key={i}
              className="rounded-xl border overflow-hidden transition-colors"
              style={{
                borderColor: isOpen ? '#cfe5ff' : '#e5e7eb',
                backgroundColor: isOpen ? '#f8fbff' : '#ffffff',
              }}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
              >
                <span className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-gray-500 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 -mt-1">
                  <p className="text-[15px] text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
