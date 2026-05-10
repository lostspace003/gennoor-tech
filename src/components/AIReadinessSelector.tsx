'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Sparkles, ArrowLeft, Shield, FileText, ArrowRight, Play, Mic, BarChart3, Target, Clock } from 'lucide-react'

const AIReadinessQuizV2 = dynamic(() => import('@/components/AIReadinessQuizV2'), { ssr: false })
const AIReadinessBlueprint = dynamic(() => import('@/components/AIReadinessBlueprint'), { ssr: false })

type AssessmentMode = 'deep' | 'blueprint' | null

export default function AIReadinessSelector() {
  const [started, setStarted] = useState(false)
  const [selectedMode, setSelectedMode] = useState<AssessmentMode>(null)
  const [locked, setLocked] = useState(false)
  const [showExitConfirm, setShowExitConfirm] = useState(false)

  function handleBack() {
    if (locked) {
      setShowExitConfirm(true)
    } else {
      setSelectedMode(null)
    }
  }

  function confirmExit() {
    setShowExitConfirm(false)
    setLocked(false)
    setSelectedMode(null)
  }

  // ─── Active assessment view ─────────────────────────────
  if (selectedMode) {
    return (
      <div className="animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Choose a different assessment
          </button>
        </div>
        {selectedMode === 'deep' && <AIReadinessQuizV2 onLock={() => setLocked(true)} onUnlock={() => setLocked(false)} />}
        {selectedMode === 'blueprint' && <AIReadinessBlueprint onLock={() => setLocked(true)} onUnlock={() => setLocked(false)} />}

        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowExitConfirm(false)} />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-fade-in">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Leave assessment?</h3>
              <p className="text-sm text-gray-500 mb-5">All your progress and answers will be lost. You&apos;ll need to start over.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowExitConfirm(false)} className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Stay
                </button>
                <button onClick={confirmExit} className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
                  Leave &amp; Lose Progress
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // ─── Assessment cards view ──────────────────────────────
  if (started) {
    return (
      <div className="animate-fade-in">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <button
            onClick={() => setStarted(false)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back
          </button>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Heading */}
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              Choose Your Assessment
            </h2>
            <p className="mt-3 text-base sm:text-lg text-gray-500 max-w-xl mx-auto">
              Pick the format that fits your schedule. All give you actionable insights.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-3xl mx-auto">
            {/* Deep Dive Card */}
            <button
              onClick={() => setSelectedMode('deep')}
              className="glass-card glow-border group relative flex flex-col items-start p-7 sm:p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
              <div className="relative z-10 flex flex-col items-start w-full">
                <div className="flex items-center justify-between w-full mb-5">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 text-primary-600 group-hover:bg-primary-100 transition-colors duration-300">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                    ~2 min
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors duration-200">
                  Quick Scan
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  10 scenario-based questions. Get an animated presentation with voice narration — like having a personal AI consultant.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Start Quick Scan <span aria-hidden="true">&rarr;</span>
                </span>
              </div>
            </button>

            {/* Custom Blueprint Card */}
            <button
              onClick={() => setSelectedMode('blueprint')}
              className="glass-card glow-border group relative flex flex-col items-start p-7 sm:p-8 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            >
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
                  Deep Dive
                </h3>
                <p className="text-sm leading-relaxed text-gray-500">
                  Role-specific diagnostic with AI-generated visualizations, implementation roadmap, and executive-ready report.
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Start Deep Dive <span aria-hidden="true">&rarr;</span>
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
      </div>
    )
  }

  // ─── Hero landing view (thumbnail-inspired) ─────────────
  return (
    <div className="animate-fade-in">
      {/* Hero section */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Text content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <span className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">AI Readiness Assessment</span>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-6">
                <span className="text-gray-900">How </span>
                <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-blue-600 bg-clip-text text-transparent">AI-Ready</span>
                <br className="hidden sm:block" />
                <span className="text-gray-900"> Are You, </span>
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">Really?</span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 mb-8 leading-relaxed">
                Get your <span className="text-gray-900 font-semibold">personalized AI readiness report</span> with score, actionable insights, and voice narration.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
                {[
                  { icon: Target, label: 'Personalized Score' },
                  { icon: Mic, label: 'Voice Narration' },
                  { icon: BarChart3, label: 'Custom Charts' },
                  { icon: Clock, label: 'Under 5 min' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label} className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-full px-4 py-2 shadow-sm">
                    <Icon className="w-4 h-4 text-primary-600" />
                    <span className="text-sm text-gray-700 font-medium">{label}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => setStarted(true)}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-700 text-white text-lg font-bold rounded-xl hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5"
              >
                <Play className="w-5 h-5 fill-current" />
                Let&apos;s Get Started
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <p className="mt-4 text-sm text-gray-500 flex items-center justify-center lg:justify-start gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                Free forever. Your data stays private.
              </p>
            </div>

            {/* Right — Score card preview */}
            <div className="flex justify-center lg:justify-end">
              <div className="glass-card w-full max-w-[380px] rounded-3xl p-8 sm:p-10 relative">
                {/* Subtle gradient accent on top edge */}
                <div className="absolute top-0 left-8 right-8 h-1 rounded-b-full bg-gradient-to-r from-primary-500 via-blue-500 to-accent-500" />

                <div className="text-center mb-8">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-[2px] mb-3">Your Score</p>
                  <div className="text-8xl sm:text-9xl font-black bg-gradient-to-b from-green-500 to-green-700 bg-clip-text text-transparent leading-none mb-2">73</div>
                  <p className="text-lg text-gray-500 font-semibold">out of 100</p>
                </div>

                {/* Dimension bars */}
                <div className="space-y-3">
                  {[
                    { label: 'Mindset', width: '82%', color: 'from-primary-500 to-primary-400' },
                    { label: 'Skills', width: '65%', color: 'from-blue-500 to-blue-400' },
                    { label: 'Workflow', width: '58%', color: 'from-green-500 to-green-400' },
                    { label: 'Readiness', width: '74%', color: 'from-amber-500 to-amber-400' },
                  ].map(({ label, width, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 font-medium w-20 text-right">{label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${color} rounded-full`} style={{ width }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sample label */}
                <p className="text-center mt-6 text-xs text-gray-400 italic">Sample report preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* What You Get */}
      <section className="bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">What You Get</h2>
            <p className="mt-2 text-gray-500">Two assessment formats, one goal — making you AI-ready.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              {
                icon: Sparkles,
                title: 'Quick Scan',
                time: '2 min',
                desc: '10 scenario-based questions, animated presentation with slide-by-slide voice.',
              },
              {
                icon: FileText,
                title: 'Deep Dive',
                time: '5 min',
                desc: 'Role-specific assessment with interactive charts, 90-day roadmap, and ROI projection.',
              },
            ].map(({ icon: Icon, title, time, desc }) => (
              <div key={title} className="glass-card text-center p-6 transition-all duration-300 hover:shadow-lg">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
                <span className="inline-flex text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full mb-3">{time}</span>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* Second CTA */}
          <div className="text-center mt-10">
            <button
              onClick={() => setStarted(true)}
              className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold rounded-xl hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-0.5"
            >
              Get Started Now
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
