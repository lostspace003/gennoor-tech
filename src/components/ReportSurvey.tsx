'use client'

import { useState } from 'react'
import { Star, Send, Check, ArrowRight, Loader2 } from 'lucide-react'

interface ReportSurveyProps {
  email: string
  name: string
  reportType: 'quick-scan' | 'deep-dive' | 'blueprint'
  role?: string
  category?: string
  subcategory?: string
}

const ORG_OPTIONS = [
  { val: 'yes', label: "Yes, let's explore" },
  { val: 'maybe', label: 'Maybe later' },
  { val: 'no', label: 'Not now' },
] as const

export default function ReportSurvey({ email, name, reportType, role, category, subcategory }: ReportSurveyProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [orgInterest, setOrgInterest] = useState<'yes' | 'maybe' | 'no' | ''>('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (rating === 0 || !orgInterest) return
    setSubmitting(true)

    try {
      await fetch('/api/ai-readiness/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, rating, comment, reportType, action: 'survey', orgInterest }),
      })

      if (orgInterest === 'yes') {
        await fetch('/api/ai-readiness/org-interest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, reportType, role, category, subcategory }),
        }).catch(() => {})
      }
    } catch {
      // Non-blocking
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 text-center animate-fade-in">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
          <Check className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Thank you for your feedback!</h3>
        <p className="text-sm text-gray-500 mb-4">Your insights help us improve this tool for everyone.</p>
        {orgInterest === 'yes' && (
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 text-sm text-primary-800">
            Our team will reach out within 24 hours to schedule a discovery call.
          </div>
        )}
        <div className="mt-6">
          <a
            href="/resources/calendar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            Book a free 15-min call <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
      <h3 className="text-lg font-bold text-gray-900 text-center mb-1">How was your experience?</h3>
      <p className="text-sm text-gray-500 text-center mb-6">Quick feedback helps us improve.</p>

      {/* Star rating */}
      <div className="flex justify-center gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1 transition-transform hover:scale-110"
          >
            <svg
              className={`w-8 h-8 transition-colors ${star <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        ))}
      </div>
      {rating > 0 && (
        <p className="text-xs text-center text-gray-500 mb-4">
          {['', 'Needs work', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
        </p>
      )}

      {/* Comment */}
      <textarea
        placeholder="Any feedback or suggestions? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 mb-5"
      />

      {/* Org interest */}
      <div className="mb-5">
        <p className="text-sm font-semibold text-gray-700 text-center mb-3">
          Would you like this enabled for your organization?
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {ORG_OPTIONS.map((opt) => (
            <button
              key={opt.val}
              onClick={() => setOrgInterest(opt.val)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                orgInterest === opt.val
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={rating === 0 || !orgInterest || submitting}
        className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
        ) : (
          <><Send className="w-4 h-4" /> Submit Feedback</>
        )}
      </button>
      {rating === 0 && <p className="text-xs text-gray-400 text-center mt-2">Please rate your experience to continue</p>}
    </div>
  )
}
