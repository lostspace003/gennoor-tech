import Link from 'next/link'
import { Users, Hammer, MessageCircle, ArrowRight, BookOpen } from 'lucide-react'
import type { Course } from '@/data/academy/types'

interface EnablementMomentProps {
  /** The course this Enablement Moment lives on */
  course: Course
  /** Related courses (optional) — rendered as "keep learning" links */
  relatedCourses?: Course[]
}

/**
 * The single commercial moment in every Academy course.
 * Surfaces three concrete next steps + a no-commit "keep learning" path.
 * Tone: gentle, specific, never pushy.
 */
export default function EnablementMoment({ course, relatedCourses }: EnablementMomentProps) {
  return (
    <section className="py-16 lg:py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Headline */}
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-3">
              You finished the course. Now what?
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              From course to outcome.
            </h2>
            <p className="text-base text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Reading this course is step one. The next step is applying it where you work.
              Here&apos;s how Gennoor helps — without the deck, without the pitch.
            </p>
          </div>

          {/* Three CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {/* Workshop for team */}
            <Link
              href="/solutions/for-smb#s4"
              className="group rounded-2xl p-6 glass-card glow-border transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/15">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Run this for your team
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">
                A 2-day workshop or virtual cohort for up to 25 of your people, with
                exercises run on your data and a 30-day adoption plan.
              </p>
              <p className="text-xs text-gray-400 mb-3">
                From $5k · 2 weeks · function-specific
              </p>
              <div className="inline-flex items-center text-primary-600 font-semibold text-sm group-hover:text-primary-700 transition-colors">
                <span>Talk to us about a workshop</span>
                <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Apply with pilot */}
            <Link
              href="/solutions/for-smb#s3"
              className="group rounded-2xl p-6 glass-card glow-border transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/15">
                <Hammer className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Apply this to your data
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">
                A 4–6 week pilot that takes what you learned and ships a working system
                inside your environment. Fixed scope, fixed price, code transferred day one.
              </p>
              <p className="text-xs text-gray-400 mb-3">
                From $25k · 6 weeks · production-grade
              </p>
              <div className="inline-flex items-center text-primary-600 font-semibold text-sm group-hover:text-primary-700 transition-colors">
                <span>Scope a pilot</span>
                <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Just talk */}
            <Link
              href="/contact"
              className="group rounded-2xl p-6 glass-card glow-border transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/15">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                Just want to talk?
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">
                Free 30-minute call. No deck, no pitch. We listen to your situation and tell
                you honestly what makes sense — even if it isn&apos;t us.
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Free · no commitment · 30 minutes
              </p>
              <div className="inline-flex items-center text-primary-600 font-semibold text-sm group-hover:text-primary-700 transition-colors">
                <span>Book a call</span>
                <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>

          {/* Keep learning */}
          {relatedCourses && relatedCourses.length > 0 && (
            <div className="rounded-2xl p-6 lg:p-7 glass-card">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary-500" />
                <h3 className="text-base font-bold text-gray-900">
                  Or just keep learning. We recommend next:
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {relatedCourses.map((rc) => (
                  <Link
                    key={rc.slug}
                    href={`/academy/courses/${rc.slug}`}
                    className="group rounded-xl p-4 border border-gray-100 hover:border-primary-200 transition-all duration-300"
                  >
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                      {rc.track}
                    </p>
                    <p className="text-sm font-semibold text-gray-900 leading-snug mb-1.5 group-hover:text-primary-600 transition-colors">
                      {rc.title}
                    </p>
                    <p className="text-xs text-gray-500">{rc.duration}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Honest note about scope */}
          <p className="text-center text-xs text-gray-400 mt-8">
            Just finished &laquo;{course.title}&raquo;. Want this to go further at your
            organization?
          </p>
        </div>
      </div>
    </section>
  )
}
