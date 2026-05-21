'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trophy, Sparkles, Award, Star, ArrowRight, MessageSquare, ExternalLink, Loader2, Linkedin } from 'lucide-react'
import type { Course } from '@/config/courses'

interface Props {
  course: Course | undefined
  learnerName?: string
  loading: boolean
  certId: string | null
  error: string | null
  onClose: () => void
}

/**
 * Step state machine:
 *  - 'issuing'   → cert is being created (parent's `loading` prop is true)
 *  - 'cert'      → cert is shown, learner can View & share / Add to LinkedIn
 *  - 'rating'    → feedback form (1-5 stars + optional comments). No audio.
 *  - 'submitting'→ POST in flight to /api/learner/courses/[id]/feedback
 *  - 'done'      → redirect to /academy/next-steps
 */
type Step = 'issuing' | 'cert' | 'rating' | 'submitting' | 'done'

const NEXT_STEPS_HREF = '/academy/next-steps'

export default function CourseCompletionOverlay({
  course,
  learnerName,
  loading,
  certId,
  error,
  onClose,
}: Props) {
  const router = useRouter()
  const theme = course?.theme
  const themedBg = theme
    ? { background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDeep} 100%)` }
    : undefined
  const themedAccentText = theme ? { color: theme.primaryDeep } : undefined

  const [step, setStep] = useState<Step>('cert')
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [comments, setComments] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Parent owns the cert-issuing state. Once cert lands, we move to 'cert' view.
  const currentStep: Step = loading ? 'issuing' : step

  async function submitFeedback() {
    if (!course?.id || !certId) return
    if (rating < 1 || rating > 5) {
      setSubmitError('Please pick a rating between 1 and 5.')
      return
    }
    setSubmitError(null)
    setStep('submitting')
    try {
      const res = await fetch(`/api/learner/courses/${course.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comments: comments.trim() || undefined }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error((j as { error?: string }).error || 'Something went wrong submitting feedback.')
      }
      setStep('done')
      // Brief pause so the user sees the confirmation, then redirect.
      setTimeout(() => router.push(NEXT_STEPS_HREF), 700)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Network error — try again in a moment.'
      setSubmitError(msg)
      setStep('rating')
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Themed celebration header */}
        <div className="relative px-6 sm:px-8 py-10 text-center overflow-hidden" style={themedBg}>
          {/* Decorative sparkles */}
          <div className="absolute top-4 left-6 text-white/30"><Sparkles className="w-5 h-5" /></div>
          <div className="absolute top-8 right-10 text-white/40"><Sparkles className="w-4 h-4" /></div>
          <div className="absolute bottom-6 right-6 text-white/30"><Sparkles className="w-6 h-6" /></div>
          <div className="absolute bottom-10 left-10 text-white/40"><Sparkles className="w-3 h-3" /></div>

          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Trophy className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-2">
              Course Complete
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading mb-2">
              Congratulations{learnerName ? `, ${learnerName.split(' ')[0]}` : ''}!
            </h2>
            <p className="text-white/90 text-sm">
              You finished <span className="font-bold">{course?.title || 'the course'}</span>.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">

          {currentStep === 'issuing' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <Award className="w-4 h-4 animate-pulse" style={themedAccentText} />
                Issuing your certificate…
              </div>
            </div>
          )}

          {currentStep === 'cert' && certId && (
            <>
              <div className="bg-gray-50 rounded-xl ring-1 ring-gray-200 p-4 mb-5 text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  Credential ID
                </p>
                <p className="font-mono font-bold text-gray-900 text-sm break-all">{certId}</p>
              </div>

              <Link
                href={`/verify/${certId}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                style={themedBg}
              >
                <Award className="w-4 h-4" />
                View &amp; share your certificate
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </Link>
              <p className="text-xs text-gray-400 text-center mt-2 mb-5">
                Download the PDF, add to LinkedIn, or share the public verification link from there.
              </p>

              <div className="border-t border-gray-100 pt-5">
                <button
                  onClick={() => setStep('rating')}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white ring-1 ring-gray-200 hover:ring-gray-300 text-gray-900 text-sm font-semibold rounded-xl transition-all duration-200"
                >
                  <Star className="w-4 h-4 text-amber-500" />
                  Rate this course
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">
                  One minute. Optional comments. Then we&apos;ll show you a couple of next steps.
                </p>
              </div>
            </>
          )}

          {(currentStep === 'rating' || currentStep === 'submitting') && (
            <>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">
                Rate this course
              </p>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
                How would you score it, honestly?
              </h3>
              <p className="text-sm text-gray-500 text-center mb-5">
                1 = waste of time · 5 = changed how I work
              </p>

              {/* Stars */}
              <div className="flex items-center justify-center gap-2 mb-6">
                {[1, 2, 3, 4, 5].map(n => {
                  const filled = (hoverRating || rating) >= n
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-label={`Rate ${n} out of 5`}
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={currentStep === 'submitting'}
                    >
                      <Star
                        className={`w-9 h-9 transition-colors ${
                          filled ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                        }`}
                        strokeWidth={1.5}
                      />
                    </button>
                  )
                })}
              </div>

              {/* Optional comments */}
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
                <span className="inline-flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Any comments? <span className="font-normal normal-case tracking-normal text-gray-400">(optional)</span>
                </span>
              </label>
              <textarea
                value={comments}
                onChange={e => setComments(e.target.value)}
                placeholder="What worked, what didn't, what should we change? Honest is helpful."
                rows={3}
                maxLength={4000}
                disabled={currentStep === 'submitting'}
                className="w-full text-sm text-gray-900 placeholder:text-gray-400 bg-gray-50 ring-1 ring-gray-200 rounded-xl px-4 py-3 mb-1 focus:outline-none focus:ring-2 focus:ring-gray-400 disabled:opacity-60"
              />
              <p className="text-xs text-gray-400 text-right mb-5">{comments.length} / 4000</p>

              {submitError && (
                <div className="text-sm text-red-600 bg-red-50 ring-1 ring-red-200 rounded-lg px-4 py-2 mb-4 text-center">
                  {submitError}
                </div>
              )}

              <button
                onClick={submitFeedback}
                disabled={currentStep === 'submitting' || rating < 1}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                style={themedBg}
              >
                {currentStep === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    Submit &amp; see next steps
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <button
                onClick={() => setStep('cert')}
                disabled={currentStep === 'submitting'}
                className="w-full text-xs text-gray-500 hover:text-gray-700 mt-3 transition-colors disabled:opacity-50"
              >
                ← Back to your certificate
              </button>
            </>
          )}

          {currentStep === 'done' && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 text-sm text-gray-700 font-semibold mb-2">
                <Linkedin className="w-4 h-4 text-emerald-600" />
                Thanks — recorded.
              </div>
              <p className="text-xs text-gray-500">
                Redirecting you to your next-steps page…
              </p>
            </div>
          )}

          {!loading && error && !certId && (
            <div className="text-center py-4">
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <p className="text-xs text-gray-500">
                Your completion is saved — try refreshing this page in a moment.
              </p>
            </div>
          )}

          {/* Quiet close link — only visible when we're NOT mid-submit */}
          {currentStep !== 'submitting' && currentStep !== 'done' && (
            <button
              onClick={onClose}
              className="w-full text-sm text-gray-500 hover:text-gray-700 mt-4 transition-colors"
            >
              Close — I&apos;ll come back to this
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
