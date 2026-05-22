'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Trophy, Sparkles, Award, Star, ArrowRight, MessageSquare, ExternalLink, Loader2, GraduationCap, Phone, Gauge, Compass } from 'lucide-react'
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
 * Step state machine — NEW ORDER (feedback first, then cert, then offer):
 *  - 'rating'    → 1-5 star feedback (shown immediately, while cert issues in background)
 *  - 'submitting'→ POST in flight to /api/learner/courses/[id]/feedback
 *  - 'issuing'   → feedback submitted, cert still landing (parent's loading prop)
 *  - 'cert'      → cert is shown, learner can View & share / Add to LinkedIn
 *  - 'offer'     → "What we offer next" — 4 cards (Academy, Book a call, AI Readiness, How we operate)
 */
type Step = 'rating' | 'submitting' | 'issuing' | 'cert' | 'offer'

export default function CourseCompletionOverlay({
  course,
  learnerName,
  loading,
  certId,
  error,
  onClose,
}: Props) {
  const theme = course?.theme
  const themedBg = theme
    ? { background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDeep} 100%)` }
    : undefined
  const themedAccentText = theme ? { color: theme.primaryDeep } : undefined
  const themedAccentBg = theme ? { backgroundColor: theme.tint } : undefined

  // Default step is 'rating' — feedback first per learner-completion redesign.
  // Submitting feedback transitions to cert reveal (waits on parent's loading
  // until certId arrives), then learner advances to the offer popup.
  const [step, setStep] = useState<Step>('rating')
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [comments, setComments] = useState('')
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  // After feedback: if cert is still issuing, show 'issuing'; once landed, show 'cert'.
  // Before feedback: stay in whatever rating/submitting state the user is in.
  const currentStep: Step = (() => {
    if (step === 'rating' || step === 'submitting') return step
    if (feedbackSubmitted && loading) return 'issuing'
    if (feedbackSubmitted && certId) return step === 'offer' ? 'offer' : 'cert'
    return step
  })()

  async function submitFeedback() {
    if (!course?.id) return
    if (rating < 1 || rating > 5) {
      setSubmitError('Please pick a rating between 1 and 5.')
      return
    }
    setSubmitError(null)
    setStep('submitting')

    // Feedback endpoint requires a cert to key on. Cert issuance runs in parallel
    // (kicked off by the parent ChapterViewer when the celebration triggered).
    // For super-fast learners, cert may not have landed yet — retry on 403 a
    // couple of times before surfacing the error.
    const attempt = async (): Promise<Response> =>
      fetch(`/api/learner/courses/${course.id}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, comments: comments.trim() || undefined }),
      })

    try {
      let res = await attempt()
      let tries = 0
      while (res.status === 403 && tries < 3) {
        await new Promise(r => setTimeout(r, 1500))
        res = await attempt()
        tries++
      }
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error((j as { error?: string }).error || 'Something went wrong submitting feedback.')
      }
      setFeedbackSubmitted(true)
      setStep(certId ? 'cert' : 'issuing')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Network error — try again in a moment.'
      setSubmitError(msg)
      setStep('rating')
    }
  }

  const offerCards = [
    {
      icon: GraduationCap,
      title: 'More Gennoor Academy courses',
      blurb: 'Continue the curriculum — 20+ courses, all free, citation-rigorous.',
      href: '/ai-academy',
      cta: 'Browse courses',
    },
    {
      icon: Phone,
      title: 'Book a working session',
      blurb: 'A 30-minute call to apply this to your team or org. No pitch.',
      href: '/contact#book',
      cta: 'Book a call',
    },
    {
      icon: Gauge,
      title: 'AI Readiness assessment',
      blurb: 'Diagnose where your organisation actually stands — 12 questions, 8 minutes.',
      href: '/ai-readiness',
      cta: 'Take the assessment',
    },
    {
      icon: Compass,
      title: 'How we operate',
      blurb: 'See how we deliver — the engagement model, deliverables, timeline.',
      href: '/how-we-operate',
      cta: 'See the model',
    },
  ]

  const isOfferStep = currentStep === 'offer'
  const modalMaxWidth = isOfferStep ? 'max-w-2xl' : 'max-w-lg'

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white rounded-3xl shadow-2xl ${modalMaxWidth} w-full overflow-hidden max-h-[92vh] overflow-y-auto`}>
        {/* Themed celebration header */}
        <div className="relative px-6 sm:px-8 py-8 text-center overflow-hidden" style={themedBg}>
          <div className="absolute top-4 left-6 text-white/30"><Sparkles className="w-5 h-5" /></div>
          <div className="absolute top-8 right-10 text-white/40"><Sparkles className="w-4 h-4" /></div>
          <div className="absolute bottom-6 right-6 text-white/30"><Sparkles className="w-6 h-6" /></div>
          <div className="absolute bottom-10 left-10 text-white/40"><Sparkles className="w-3 h-3" /></div>

          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Trophy className="w-8 h-8 text-white" strokeWidth={2} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-white/80 mb-2">
              Course Complete
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-heading mb-1">
              Congratulations{learnerName ? `, ${learnerName.split(' ')[0]}` : ''}!
            </h2>
            <p className="text-white/85 text-sm">
              You finished <span className="font-bold">{course?.title || 'the course'}</span>.
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">

          {/* STEP 1 · rating (feedback first) */}
          {(currentStep === 'rating' || currentStep === 'submitting') && (
            <>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">
                Step 1 of 3 · Quick feedback
              </p>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
                How would you score it, honestly?
              </h3>
              <p className="text-sm text-gray-500 text-center mb-5">
                1 = waste of time · 5 = changed how I work
              </p>

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
                    Submit &amp; reveal certificate
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center mt-3">
                Your certificate is being prepared in the background.
              </p>
            </>
          )}

          {/* STEP 2 · issuing — feedback submitted, cert still landing */}
          {currentStep === 'issuing' && (
            <div className="text-center py-8">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
                Step 2 of 3 · Issuing certificate
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                <Award className="w-5 h-5 animate-pulse" style={themedAccentText} />
                Generating your credential and PDF…
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Usually 3-5 seconds. Don&apos;t close this window.
              </p>
            </div>
          )}

          {/* STEP 2 · cert reveal — feedback submitted + cert landed */}
          {currentStep === 'cert' && certId && (
            <>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">
                Step 2 of 3 · Your certificate
              </p>
              <div className="rounded-xl ring-1 ring-gray-200 p-4 mb-5 text-center" style={themedAccentBg}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  Credential ID
                </p>
                <p className="font-mono font-bold text-gray-900 text-sm break-all">{certId}</p>
              </div>

              <Link
                href={`/verify/${certId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                style={themedBg}
              >
                <Award className="w-4 h-4" />
                View &amp; download certificate
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </Link>
              <p className="text-xs text-gray-400 text-center mt-2 mb-5">
                Download the PDF, add to LinkedIn, or share the public verification link from there.
              </p>

              <button
                onClick={() => setStep('offer')}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white ring-1 ring-gray-200 hover:ring-gray-300 text-gray-900 text-sm font-semibold rounded-xl transition-all duration-200"
              >
                What we offer next
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {/* STEP 3 · offer popup — 4 cards */}
          {currentStep === 'offer' && (
            <>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 text-center">
                Step 3 of 3 · Where to next
              </p>
              <h3 className="text-lg font-bold text-gray-900 text-center mb-1">
                What we offer you
              </h3>
              <p className="text-sm text-gray-500 text-center mb-6">
                Pick what fits where you are now.
              </p>

              <div className="grid sm:grid-cols-2 gap-3 mb-2">
                {offerCards.map(c => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className="group flex flex-col gap-2 p-4 rounded-xl ring-1 ring-gray-200 hover:ring-gray-300 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 bg-white"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={themedAccentBg}>
                        <c.icon className="w-4.5 h-4.5" style={themedAccentText} strokeWidth={2.2} />
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 leading-tight">{c.title}</h4>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{c.blurb}</p>
                    <div className="text-xs font-semibold inline-flex items-center gap-1 mt-1" style={themedAccentText}>
                      {c.cta}
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {!loading && error && !certId && feedbackSubmitted && (
            <div className="text-center py-4">
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <p className="text-xs text-gray-500">
                Your feedback + completion are saved — refresh in a moment to retry the cert.
              </p>
            </div>
          )}

          {/* Quiet close — never during submit */}
          {currentStep !== 'submitting' && currentStep !== 'issuing' && (
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
