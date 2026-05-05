'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Brain, Target } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AIReadinessCTA() {
  const [score, setScore] = useState(0)

  useEffect(() => {
    const target = 73
    const duration = 2000
    const step = target / (duration / 30)
    let current = 0
    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setScore(target)
        clearInterval(timer)
      } else {
        setScore(Math.floor(current))
      }
    }, 30)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700/50 shadow-2xl">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center p-8 sm:p-10 lg:p-12">
            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 mb-5">
                <Zap className="w-3.5 h-3.5 text-primary-400" />
                <span className="text-xs font-semibold text-primary-300 uppercase tracking-wide">Free AI Assessment</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight">
                How AI-Ready Are You?
              </h2>
              <p className="text-gray-300 text-base sm:text-lg max-w-xl mb-6 leading-relaxed">
                3 AI agents research your industry, analyze your skills, and build a personalized blueprint — with voice narration, tool recommendations, and a 90-day roadmap. Takes 2 minutes.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  href="/ai-readiness"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  Check Your AI Readiness <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-xs text-gray-400">No signup needed • Results in 60 seconds</span>
              </div>

              <div className="flex items-center gap-6 mt-7 pt-6 border-t border-gray-700/50">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary-400" />
                  <span className="text-xs text-gray-400">Multi-Agent AI Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-accent-400" />
                  <span className="text-xs text-gray-400">Personalized Roadmap</span>
                </div>
              </div>
            </div>

            {/* Right — Animated Score Preview */}
            <div className="hidden lg:flex flex-col items-center justify-center">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#374151" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke="url(#scoreGradient)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${(score / 100) * 327} 327`}
                    className="transition-all duration-100"
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-white">{score}</span>
                  <span className="text-xs text-gray-400 mt-0.5">/ 100</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">Sample score visualization</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
