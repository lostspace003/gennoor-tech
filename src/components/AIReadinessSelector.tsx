'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ArrowLeft, Shield } from 'lucide-react'

const AIReadinessQuizV2 = dynamic(() => import('@/components/AIReadinessQuizV2'), { ssr: false })
const AIReadinessBlueprint = dynamic(() => import('@/components/AIReadinessBlueprint'), { ssr: false })

/**
 * AI Readiness landing in the Apple idiom, per the redesign handoff.
 * The two assessment engines (Quick Scan quiz, Deep Dive blueprint) and the
 * lock / exit-confirmation flow are untouched — only the chrome around them
 * is restyled.
 */

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
        <div className="max-w-[1080px] mx-auto px-8 pt-6 pb-2">
          <button
            onClick={handleBack}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#6e6e73] hover:text-primary-600 transition-colors duration-200"
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
            <div className="relative bg-white rounded-3xl w-full max-w-sm p-7 text-center animate-fade-in border border-[#e8e8ed]">
              <h3 className="text-lg font-bold text-gray-900 mb-1.5">Leave assessment?</h3>
              <p className="text-sm text-[#6e6e73] mb-6">
                All your progress and answers will be lost. You&apos;ll need to start over.
              </p>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 pill-secondary !text-[13px]"
                >
                  Stay
                </button>
                <button
                  onClick={confirmExit}
                  className="flex-1 inline-flex items-center justify-center text-[13px] font-semibold text-white bg-[#c0392b] hover:bg-[#9b2c21] px-5 py-2.5 rounded-full transition-colors"
                >
                  Leave &amp; lose progress
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
        <div className="max-w-[1080px] mx-auto px-8 pt-6 pb-2">
          <button
            onClick={() => setStarted(false)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[#6e6e73] hover:text-primary-600 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            Back
          </button>
        </div>

        <div className="px-8 py-12">
          <div className="text-center mb-12">
            <h2 className="display-card">Choose your assessment.</h2>
            <p className="lede mt-3 max-w-[520px] mx-auto">
              Pick the format that fits your schedule. Both give you actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-[760px] mx-auto">
            <button
              onClick={() => setSelectedMode('deep')}
              className="bg-white border border-[#e8e8ed] hover:border-primary-600 rounded-[18px] p-8 text-left transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#86868b]">
                  Quick Scan
                </span>
                <span className="text-[11px] font-semibold text-primary-600">~2 min</span>
              </div>
              <h3 className="text-[19px] font-bold text-gray-900 mb-2">
                Ten questions, narrated report.
              </h3>
              <p className="text-[13.5px] leading-[1.55] text-[#6e6e73]">
                Scenario-based questions. Get an animated presentation with voice
                narration — like having a personal AI consultant.
              </p>
              <span className="mt-5 inline-block text-[13px] font-semibold text-primary-600 group-hover:text-[#0077ed]">
                Start Quick Scan ›
              </span>
            </button>

            <button
              onClick={() => setSelectedMode('blueprint')}
              className="bg-white border border-[#e8e8ed] hover:border-primary-600 rounded-[18px] p-8 text-left transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#86868b]">
                  Deep Dive
                </span>
                <span className="text-[11px] font-semibold text-primary-600">~5 min</span>
              </div>
              <h3 className="text-[19px] font-bold text-gray-900 mb-2">
                Role-specific blueprint.
              </h3>
              <p className="text-[13.5px] leading-[1.55] text-[#6e6e73]">
                Role-specific diagnostic with AI-generated visualizations, an
                implementation roadmap, and an executive-ready report.
              </p>
              <span className="mt-5 inline-block text-[13px] font-semibold text-primary-600 group-hover:text-[#0077ed]">
                Start Deep Dive ›
              </span>
            </button>
          </div>

          <p className="mt-9 text-center text-[13px] text-[#86868b] flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            All assessments are free. Your report is private.
          </p>
        </div>
      </div>
    )
  }

  // ─── Hero landing view ──────────────────────────────────
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="bg-white px-8 pt-20 lg:pt-[100px] pb-14 text-center">
        <div className="kicker mb-5">AI Readiness Diagnostic</div>
        <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900 max-w-[720px] mx-auto">
          Know where you stand.
        </h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[560px] mx-auto mt-5">
          A personalized readiness score, actionable insights, and voice
          narration — free, in minutes. The full diagnostic takes 15 minutes
          with our team.
        </p>
        <div className="mt-8">
          <button onClick={() => setStarted(true)} className="pill-primary">
            Let&rsquo;s get started
          </button>
        </div>
        <p className="mt-5 text-[13px] text-[#86868b] flex items-center justify-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Free forever. Your data stays private.
        </p>
      </section>

      {/* Sample score preview */}
      <section className="bg-[#f5f5f7] px-8 py-16">
        <div className="max-w-[680px] mx-auto bg-white rounded-3xl px-9 py-11 sm:px-12">
          <div className="text-center mb-8">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#86868b] mb-4">
              Your score
            </p>
            <div className="text-[76px] font-bold tracking-[-0.04em] leading-none text-primary-600">
              73<span className="text-[30px] font-semibold text-[#86868b]">/100</span>
            </div>
          </div>
          <div className="space-y-3 max-w-[420px] mx-auto">
            {[
              { label: 'Mindset', width: '82%' },
              { label: 'Skills', width: '65%' },
              { label: 'Workflow', width: '58%' },
              { label: 'Readiness', width: '74%' },
            ].map(({ label, width }) => (
              <div key={label} className="flex items-center gap-3.5">
                <span className="text-xs text-[#6e6e73] font-medium w-20 text-right">{label}</span>
                <div className="flex-1 h-1.5 bg-[#f0f0f2] rounded-[3px] overflow-hidden">
                  <div className="h-full bg-primary-600 rounded-[3px]" style={{ width }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center mt-7 text-xs text-[#86868b]">Sample report preview</p>
        </div>
      </section>

      {/* What you get — the free formats */}
      <section className="bg-white px-8 py-16 lg:py-24">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-card text-center mb-3">What you get.</h2>
          <p className="text-[18px] text-[#6e6e73] text-center mb-12">
            Two assessment formats, one goal — making you AI-ready.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#e8e8ed] border border-[#e8e8ed] rounded-[18px] overflow-hidden max-w-[760px] mx-auto">
            {[
              {
                title: 'Quick Scan',
                time: '~2 min',
                desc: '10 scenario-based questions, animated presentation with slide-by-slide voice.',
              },
              {
                title: 'Deep Dive',
                time: '~5 min',
                desc: 'Role-specific assessment with interactive charts, 90-day roadmap, and ROI projection.',
              },
            ].map(({ title, time, desc }) => (
              <div key={title} className="bg-white px-7 py-8">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[16px] font-bold text-gray-900">{title}</h3>
                  <span className="text-[11px] font-semibold text-primary-600">{time}</span>
                </div>
                <p className="text-[13.5px] leading-[1.55] text-[#6e6e73]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => setStarted(true)} className="pill-primary-sm">
              Get started now
            </button>
          </div>
        </div>
      </section>

      {/* The full diagnostic — the paid Phase-1 engagement */}
      <section className="bg-[#f5f5f7] px-8 py-16 lg:py-24">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-card text-center mb-3">The full diagnostic.</h2>
          <p className="text-[18px] text-[#6e6e73] text-center mb-14">
            Phase 1 of the Gennoor Way — 1–4 weeks, fixed price, from $3k.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#e8e8ed] border border-[#e8e8ed] rounded-[18px] overflow-hidden">
            {[
              { title: 'Readiness score', body: 'Data, people, infrastructure, and governance — measured, not guessed.' },
              { title: 'Use-case backlog', body: 'Ranked by ROI and feasibility, with the first three scoped.' },
              { title: '12-month roadmap', body: 'Phased plan your board can approve — budget bands included.' },
              { title: 'Governance charter', body: 'Who decides what, model risk policy, and data boundaries.' },
            ].map(cell => (
              <div key={cell.title} className="bg-white px-[26px] py-[30px]">
                <div className="text-[16px] font-bold text-gray-900 mb-2">{cell.title}</div>
                <div className="text-[13.5px] leading-[1.55] text-[#6e6e73]">{cell.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
