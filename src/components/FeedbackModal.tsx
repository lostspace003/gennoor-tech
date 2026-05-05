'use client'

import { useState } from 'react'
import { X, Star } from 'lucide-react'

interface FeedbackModalProps {
  onSubmit: (rating: number, comment: string) => void
  onClose: () => void
}

export default function FeedbackModal({ onSubmit, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0)
  const [hoveredStar, setHoveredStar] = useState(0)
  const [comment, setComment] = useState('')

  function handleSubmit() {
    if (rating === 0) return
    onSubmit(rating, comment)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 sm:p-8 animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-1">How was your experience?</h3>
        <p className="text-sm text-gray-500 mb-5">Quick feedback before we send your report.</p>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 transition-colors ${
                  star <= (hoveredStar || rating)
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-gray-200'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-sm text-gray-500">
              {['', 'Needs work', 'Fair', 'Good', 'Great', 'Excellent'][rating]}
            </span>
          )}
        </div>

        {/* Comment */}
        <textarea
          placeholder="Any suggestions to improve? (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 mb-4"
        />

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={rating === 0}
          className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all disabled:opacity-40"
        >
          Submit & Continue
        </button>
      </div>

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </div>
  )
}
