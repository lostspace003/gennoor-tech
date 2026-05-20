'use client'

import Link from 'next/link'
import { Trophy, Sparkles, Award } from 'lucide-react'
import type { Course } from '@/config/courses'

interface Props {
  course: Course | undefined
  learnerName?: string
  loading: boolean
  certId: string | null
  error: string | null
  onClose: () => void
}

export default function CourseCompletionOverlay({
  course,
  learnerName,
  loading,
  certId,
  error,
  onClose,
}: Props) {
  const theme = course?.theme
  const themedBg = theme ? { background: `linear-gradient(135deg, ${theme.primary} 0%, ${theme.primaryDeep} 100%)` } : undefined
  const themedAccentText = theme ? { color: theme.primaryDeep } : undefined

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Themed celebration header */}
        <div className="relative px-6 sm:px-8 py-10 text-center overflow-hidden" style={themedBg}>
          {/* Decorative sparkles */}
          <div className="absolute top-4 left-6 text-white/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="absolute top-8 right-10 text-white/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="absolute bottom-6 right-6 text-white/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="absolute bottom-10 left-10 text-white/40">
            <Sparkles className="w-3 h-3" />
          </div>

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
          {loading && (
            <div className="text-center py-6">
              <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                <Award className="w-4 h-4 animate-pulse" style={themedAccentText} />
                Issuing your certificate…
              </div>
            </div>
          )}

          {!loading && certId && (
            <>
              <div className="bg-gray-50 rounded-xl ring-1 ring-gray-200 p-4 mb-5 text-center">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
                  Credential ID
                </p>
                <p className="font-mono font-bold text-gray-900 text-sm break-all">
                  {certId}
                </p>
              </div>
              <Link
                href={`/verify/${certId}`}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
                style={themedBg}
              >
                <Award className="w-4 h-4" />
                View &amp; share your certificate
              </Link>
              <p className="text-xs text-gray-400 text-center mt-3">
                Add to LinkedIn, share publicly, or download the PDF.
              </p>
            </>
          )}

          {!loading && error && !certId && (
            <div className="text-center py-4">
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <p className="text-xs text-gray-500">
                Your completion is saved — try refreshing this page in a moment.
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full text-sm text-gray-500 hover:text-gray-700 mt-4 transition-colors"
          >
            Continue exploring
          </button>
        </div>
      </div>
    </div>
  )
}
