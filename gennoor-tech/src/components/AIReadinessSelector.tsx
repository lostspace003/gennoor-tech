'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Zap, Sparkles, ArrowLeft, Shield, FileText } from 'lucide-react'

const AIReadinessQuiz = dynamic(() => import('@/components/AIReadinessQuiz'), { ssr: false })
const AIReadinessQuizV2 = dynamic(() => import('@/components/AIReadinessQuizV2'), { ssr: false })
const AIReadinessBlueprint = dynamic(() => import('@/components/AIReadinessBlueprint'), { ssr: false })

type AssessmentMode = 'quick' | 'deep' | 'blueprint' | null

export default function AIReadinessSelector() {
  const [selectedMode, setSelectedMode] = useState<AssessmentMode>(null)

  if (selectedMode) {
    return (
      <div className="animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <button
            onClick={() => setSelectedMode(null)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Choose a different assessment
          </button>
        </div>
        {selectedMode === 'quick' && <AIReadinessQuiz />}
        {selectedMode === 'deep' && <AIReadinessQuizV2 />}
        {selectedMode === 'blueprint' && <AIReadinessBlueprint />}
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {/* Heading */}
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
          How AI-Ready Are You, Really?
        </h2>
        <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
          Pick the format that fits your schedule. Both give you actionable insights.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
        {/* Quick Scan Card */}
        <button
          onClick={() => setSelectedMode('quick')}
          className="group relative flex flex-col items-start rounded-2xl bg-white border border-gray-200 p-7 sm:p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-100/40 hover:border-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          {/* Gradient border glow on hover */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary-400 via-primary-300 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-[1px]" />
          <div className="absolute inset-0 rounded-2xl bg-white" />

          <div className="relative z-10 flex flex-col items-start w-full">
            {/* Icon + Badge row */}
            <div className="flex items-center justify-between w-full mb-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                ~30 sec
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-200">
              Quick Scan
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed text-gray-500">
              7 targeted questions. Get an instant AI readiness score with personalized insights in under 30 seconds.
            </p>

            {/* CTA hint */}
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Start Quick Scan
              <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </button>

        {/* Deep Dive Card */}
        <button
          onClick={() => setSelectedMode('deep')}
          className="group relative flex flex-col items-start rounded-2xl bg-white border border-gray-200 p-7 sm:p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-100/40 hover:border-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          {/* Gradient border glow on hover */}
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary-400 via-primary-300 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-[1px]" />
          <div className="absolute inset-0 rounded-2xl bg-white" />

          <div className="relative z-10 flex flex-col items-start w-full">
            {/* Icon + Badge row */}
            <div className="flex items-center justify-between w-full mb-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors duration-300">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                ~2 min
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-200">
              Deep Dive
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed text-gray-500">
              10 scenario-based questions. Get an animated presentation with voice narration — like having a personal AI consultant.
            </p>

            {/* CTA hint */}
            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Start Deep Dive
              <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </button>
        {/* Custom Blueprint Card */}
        <button
          onClick={() => setSelectedMode('blueprint')}
          className="group relative flex flex-col items-start rounded-2xl bg-white border border-gray-200 p-7 sm:p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-100/40 hover:border-primary-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-primary-400 via-primary-300 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-[1px]" />
          <div className="absolute inset-0 rounded-2xl bg-white" />

          <div className="relative z-10 flex flex-col items-start w-full">
            <div className="flex items-center justify-between w-full mb-5">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors duration-300">
                <FileText className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                ~5 min
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-200">
              Custom Blueprint
            </h3>

            <p className="text-sm leading-relaxed text-gray-500">
              Role-specific diagnostic with AI-generated visualizations, implementation roadmap, and executive-ready report.
            </p>

            <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
              Start Blueprint
              <span aria-hidden="true">&rarr;</span>
            </span>
          </div>
        </button>
      </div>

      {/* Privacy note */}
      <p className="mt-8 sm:mt-10 text-center text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-1.5">
        <Shield className="w-3.5 h-3.5" />
        All assessments are free. Your report is private.
      </p>
    </div>
  )
}
