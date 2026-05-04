'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronLeft, Zap, BookOpen, Rocket, ArrowRight, CheckCircle2 } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'industry',
    question: 'What industry are you in?',
    options: [
      'IT & Software',
      'Finance & Banking',
      'Healthcare',
      'Manufacturing',
      'Retail & E-commerce',
      'Education',
      'Real Estate',
      'Other',
    ],
  },
  {
    id: 'size',
    question: 'How many people work in your company?',
    options: ['1–10', '11–50', '51–200', '200+'],
  },
  {
    id: 'usage',
    question: 'How does your team currently use AI?',
    options: [
      "We don't use AI yet",
      'Some people use ChatGPT / Copilot on their own',
      "We've tried a few AI tools for business",
      'AI is part of our daily work',
    ],
  },
  {
    id: 'training',
    question: 'Are your employees trained on AI tools?',
    options: [
      'No training at all',
      'A few have self-learned',
      "We've done some informal training",
      'We have a proper AI training program',
    ],
  },
  {
    id: 'challenge',
    question: "What's your biggest challenge with AI?",
    options: [
      "Don't know where to start",
      "Team doesn't have the skills",
      "Can't see clear ROI",
      'Need help picking the right solution',
    ],
  },
  {
    id: 'priority',
    question: 'What matters most to you right now?',
    options: [
      'Train my team on AI & Microsoft tools',
      'Build an AI solution for my business',
      'Create an AI strategy with clear ROI',
      'Automate repetitive work',
    ],
  },
  {
    id: 'timeline',
    question: 'How soon do you want to take action?',
    options: ['Just exploring', 'Within 3 months', 'Within 1 month', 'Immediately'],
  },
]

const INDUSTRY_INSIGHTS: Record<string, string> = {
  'IT & Software': 'In IT, AI can accelerate development cycles, automate testing, and enable smarter DevOps — teams that adopt AI tools early ship 40% faster.',
  'Finance & Banking': 'In finance, AI is transforming fraud detection, risk assessment, and customer service — early adopters are seeing 30-50% efficiency gains in operations.',
  'Healthcare': 'In healthcare, AI is revolutionizing patient scheduling, diagnostics support, and administrative workflows — reducing manual work by up to 40%.',
  'Manufacturing': 'In manufacturing, AI-driven predictive maintenance and quality control are cutting downtime by 25-30% and reducing defect rates significantly.',
  'Retail & E-commerce': 'In retail, AI powers personalized recommendations, inventory optimization, and customer insights — leading to 15-25% revenue uplift.',
  'Education': 'In education, AI is enabling personalized learning paths, automated assessments, and administrative efficiency — freeing up educators to focus on teaching.',
  'Real Estate': 'In real estate, AI is transforming property valuation, lead scoring, and market analysis — helping teams close deals 30% faster.',
  'Other': 'Across industries, companies that strategically adopt AI are seeing 20-40% productivity gains and stronger competitive positioning.',
}

type Profile = 'explorer' | 'builder' | 'scaler'

interface ProfileData {
  title: string
  tagline: string
  icon: typeof Zap
  color: string
  bgColor: string
  borderColor: string
  recommendations: { title: string; description: string; href: string }[]
  roi: string
}

const PROFILES: Record<Profile, ProfileData> = {
  explorer: {
    title: 'Explorer',
    tagline: 'Your team has a big opportunity ahead.',
    icon: BookOpen,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    recommendations: [
      { title: 'AI Fundamentals Training', description: 'Get your team confident with AI tools like Copilot and Azure AI.', href: '/services/training' },
      { title: 'AI Strategy Session', description: 'A 1-on-1 session to identify quick wins for your business.', href: '/services/ai-strategy' },
      { title: 'Microsoft 365 Copilot Workshop', description: 'Hands-on training to boost daily productivity with AI.', href: '/services/training/ms-4004' },
    ],
    roi: 'Companies your size typically see 20-30% time savings within 3 months of starting AI training.',
  },
  builder: {
    title: 'Builder',
    tagline: "You're ready to see real results from AI.",
    icon: Rocket,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    recommendations: [
      { title: 'AI Strategy with ROI Roadmap', description: 'A clear plan showing exactly where AI will save money and time.', href: '/services/ai-strategy' },
      { title: 'POC Development', description: "Build a working AI proof-of-concept for your specific business need.", href: '/services/poc-development' },
      { title: 'Team Upskilling Program', description: 'Close the skills gap with hands-on Microsoft AI certification training.', href: '/services/training' },
    ],
    roi: 'Businesses at your stage typically achieve 3-5x ROI within 6 months of implementing their first AI solution.',
  },
  scaler: {
    title: 'Scaler',
    tagline: 'Time to go bigger with AI.',
    icon: Zap,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    recommendations: [
      { title: 'Agentic AI Solutions', description: 'Build intelligent agents that handle complex workflows autonomously.', href: '/services/agentic-ai' },
      { title: 'Advanced AI Integration', description: 'Embed AI deeply into your operations for maximum impact.', href: '/services/poc-development' },
      { title: 'AI Leadership Training', description: 'Equip your leaders to drive AI strategy and measure ROI effectively.', href: '/services/training' },
    ],
    roi: 'Companies scaling AI see 40-60% operational efficiency gains and significantly stronger market positioning.',
  },
}

function getProfile(answers: Record<string, string>): Profile {
  let score = 0

  const usageScores: Record<string, number> = {
    "We don't use AI yet": 0,
    'Some people use ChatGPT / Copilot on their own': 1,
    "We've tried a few AI tools for business": 2,
    'AI is part of our daily work': 3,
  }

  const trainingScores: Record<string, number> = {
    'No training at all': 0,
    'A few have self-learned': 1,
    "We've done some informal training": 2,
    'We have a proper AI training program': 3,
  }

  const timelineScores: Record<string, number> = {
    'Just exploring': 0,
    'Within 3 months': 1,
    'Within 1 month': 2,
    'Immediately': 3,
  }

  score += usageScores[answers.usage] ?? 0
  score += trainingScores[answers.training] ?? 0
  score += timelineScores[answers.timeline] ?? 0

  if (score <= 3) return 'explorer'
  if (score <= 6) return 'builder'
  return 'scaler'
}

export default function AIReadinessQuiz() {
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showResult, setShowResult] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [started, setStarted] = useState(false)

  function handleSelect(option: string) {
    const q = QUESTIONS[currentQ]
    const newAnswers = { ...answers, [q.id]: option }
    setAnswers(newAnswers)

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 200)
    } else {
      setTimeout(() => setShowResult(true), 300)
    }
  }

  function handleBack() {
    if (currentQ > 0) setCurrentQ(currentQ - 1)
  }

  function handleReset() {
    setCurrentQ(0)
    setAnswers({})
    setShowResult(false)
    setEmail('')
    setName('')
    setSubmitted(false)
    setStarted(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmitting(true)
    try {
      await fetch('/api/ai-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, answers, profile: getProfile(answers) }),
      })
      setSubmitted(true)
    } catch {}
    setSubmitting(false)
  }

  const profile = showResult ? PROFILES[getProfile(answers)] : null
  const industry = answers.industry || 'Other'
  const progress = ((currentQ + (showResult ? 1 : 0)) / QUESTIONS.length) * 100

  if (!started) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 mb-6">
          <Zap className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
          How AI-Ready Is Your Business?
        </h2>
        <p className="text-gray-600 text-lg mb-3 max-w-lg mx-auto">
          Answer 7 quick questions and get a personalized AI readiness profile with tailored recommendations for your industry.
        </p>
        <p className="text-gray-400 text-sm mb-8">Takes about 60 seconds</p>
        <button
          onClick={() => setStarted(true)}
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-base font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Start Assessment <ArrowRight className="w-5 h-5" />
        </button>
        <div className="mt-10 grid grid-cols-3 gap-6 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl font-black text-primary-600">7</div>
            <div className="text-xs text-gray-500 mt-1">Questions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-primary-600">60s</div>
            <div className="text-xs text-gray-500 mt-1">To complete</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-primary-600">Free</div>
            <div className="text-xs text-gray-500 mt-1">Always</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            {showResult ? 'Complete' : `Question ${currentQ + 1} of ${QUESTIONS.length}`}
          </span>
          <span className="text-sm font-medium text-primary-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {!showResult ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">{QUESTIONS[currentQ].question}</h3>

          <div className="space-y-3">
            {QUESTIONS[currentQ].options.map((option) => {
              const isSelected = answers[QUESTIONS[currentQ].id] === option
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base font-medium ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                      : 'border-gray-150 bg-white text-gray-700 hover:border-primary-200 hover:bg-primary-50/50'
                  }`}
                >
                  {option}
                </button>
              )
            })}
          </div>

          {currentQ > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-1 mt-5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}
        </div>
      ) : profile && (
        <div className="space-y-6">
          {/* Profile result */}
          <div className={`${profile.bgColor} rounded-2xl border ${profile.borderColor} p-6 sm:p-8`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-xl ${profile.bgColor} flex items-center justify-center`}>
                <profile.icon className={`w-6 h-6 ${profile.color}`} />
              </div>
              <span className={`text-lg font-bold ${profile.color}`}>You're an AI {profile.title}</span>
            </div>
            <p className="text-gray-800 font-semibold text-xl mb-3">{profile.tagline}</p>
            <p className="text-gray-600 text-base leading-relaxed">{INDUSTRY_INSIGHTS[industry]}</p>
          </div>

          {/* Recommendations */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Recommended for you</h4>
            <div className="space-y-3">
              {profile.recommendations.map((rec) => (
                <Link
                  key={rec.title}
                  href={rec.href}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200 group"
                >
                  <ChevronRight className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <div>
                    <p className="font-semibold text-gray-900">{rec.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{rec.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ROI */}
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6">
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-800">Expected impact: </span>
              {profile.roi}
            </p>
          </div>

          {/* Email capture */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900">Get your personalized report</h4>
                <p className="text-sm text-gray-500">We'll send a detailed breakdown with action steps tailored to your business.</p>
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {submitting ? 'Sending...' : <><ArrowRight className="w-4 h-4" /> Send My Report</>}
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                <p className="text-green-800 font-medium">Report sent! We'll be in touch soon.</p>
              </div>
            )}
          </div>

          {/* Book a call + retake */}
          <div className="text-center space-y-3 pb-4">
            <Link
              href="/resources/calendar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
            >
              Book a Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <div>
              <button
                onClick={handleReset}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Retake assessment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
