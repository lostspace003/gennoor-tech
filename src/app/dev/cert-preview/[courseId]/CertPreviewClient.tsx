'use client'

import { useState } from 'react'
import type { Course } from '@/config/courses'
import CourseCompletionOverlay from '@/components/academy/CourseCompletionOverlay'

type Mode = 'loading' | 'success' | 'error'

const SAMPLE_CERT_ID = 'GNR-ACAD-PREVIEW-2026-A3F4B7C2'
const SAMPLE_LEARNER = 'Alex Thompson'
const SAMPLE_ERROR = 'Could not issue certificate. Your completion is saved — refresh the page in a moment to retry.'

export default function CertPreviewClient({ course }: { course: Course }) {
  const [mode, setMode] = useState<Mode>('success')
  const [show, setShow] = useState(true)

  return (
    <>
      <div className="bg-white rounded-xl p-4 ring-1 ring-gray-200 mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preview state</p>
        <div className="flex gap-2">
          {(['loading', 'success', 'error'] as const).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setShow(true) }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all ${
                mode === m
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-primary-300 hover:text-primary-700'
              }`}
            >
              {m}
            </button>
          ))}
          {!show && (
            <button
              onClick={() => setShow(true)}
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200 ring-1 ring-amber-300"
            >
              Re-open overlay
            </button>
          )}
        </div>
      </div>

      {show && (
        <CourseCompletionOverlay
          course={course}
          learnerName={SAMPLE_LEARNER}
          loading={mode === 'loading'}
          certId={mode === 'success' ? SAMPLE_CERT_ID : null}
          error={mode === 'error' ? SAMPLE_ERROR : null}
          onClose={() => setShow(false)}
        />
      )}
    </>
  )
}
