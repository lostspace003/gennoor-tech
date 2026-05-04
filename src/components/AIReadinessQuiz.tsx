'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Zap, ArrowRight, CheckCircle2, Lightbulb, TrendingUp, Users, Target, Rocket } from 'lucide-react'

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
      'Train my team on AI tools',
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

interface PillarScore {
  name: string
  score: number
  icon: typeof Zap
  color: string
  barColor: string
}

interface QuickWin {
  title: string
  description: string
  timeframe: string
}

function calculatePillars(answers: Record<string, string>): PillarScore[] {
  const usageScore: Record<string, number> = {
    "We don't use AI yet": 15,
    'Some people use ChatGPT / Copilot on their own': 40,
    "We've tried a few AI tools for business": 65,
    'AI is part of our daily work': 90,
  }

  const trainingScore: Record<string, number> = {
    'No training at all': 15,
    'A few have self-learned': 35,
    "We've done some informal training": 60,
    'We have a proper AI training program': 90,
  }

  const challengeVisionScore: Record<string, number> = {
    "Don't know where to start": 20,
    "Team doesn't have the skills": 50,
    "Can't see clear ROI": 60,
    'Need help picking the right solution': 75,
  }

  const timelineScore: Record<string, number> = {
    'Just exploring': 25,
    'Within 3 months': 50,
    'Within 1 month': 75,
    'Immediately': 95,
  }

  const priorityVisionBonus: Record<string, number> = {
    'Train my team on AI tools': 10,
    'Build an AI solution for my business': 15,
    'Create an AI strategy with clear ROI': 20,
    'Automate repetitive work': 12,
  }

  const vision = Math.min(100, (challengeVisionScore[answers.challenge] ?? 40) + (priorityVisionBonus[answers.priority] ?? 0))
  const skills = trainingScore[answers.training] ?? 30
  const adoption = usageScore[answers.usage] ?? 20
  const action = timelineScore[answers.timeline] ?? 30

  return [
    { name: 'Vision & Strategy', score: vision, icon: Target, color: 'text-blue-600', barColor: 'bg-blue-500' },
    { name: 'Team Skills', score: skills, icon: Users, color: 'text-teal-600', barColor: 'bg-teal-500' },
    { name: 'AI Adoption', score: adoption, icon: TrendingUp, color: 'text-purple-600', barColor: 'bg-purple-500' },
    { name: 'Readiness to Act', score: action, icon: Rocket, color: 'text-orange-600', barColor: 'bg-orange-500' },
  ]
}

function getOverallScore(pillars: PillarScore[]): number {
  return Math.round(pillars.reduce((sum, p) => sum + p.score, 0) / pillars.length)
}

function getStrengthStatement(pillars: PillarScore[], answers: Record<string, string>): string {
  const strongest = [...pillars].sort((a, b) => b.score - a.score)[0]
  const size = answers.size || '1–10'

  const statements: Record<string, string> = {
    'Vision & Strategy': `You already have clarity on what you want from AI — that's ahead of most ${size}-person companies we've seen. Many businesses stall because they never define what AI should actually do for them. You've passed that barrier.`,
    'Team Skills': `Your team already has AI awareness — that's a real advantage. Most companies your size are starting from zero. Having people who've touched AI tools means you can move faster when you're ready to scale.`,
    'AI Adoption': `You're already using AI in some form — that puts you ahead. The gap between "thinking about AI" and "actually using it" is where most businesses get stuck. You've crossed it.`,
    'Readiness to Act': `Your urgency is a strength. Companies that move with intent — not panic — get 2-3x better outcomes from AI investments than those who wait and react to competitors.`,
  }

  return statements[strongest.name] || statements['Vision & Strategy']
}

function getQuickWin(pillars: PillarScore[], answers: Record<string, string>): QuickWin {
  const weakest = [...pillars].sort((a, b) => a.score - b.score)[0]

  const wins: Record<string, QuickWin> = {
    'Vision & Strategy': {
      title: 'Map your top 3 time drains',
      description: 'Ask each team member: "What task do you repeat most that doesn\'t need your judgment?" List the top 3. These are your AI starting points — not big projects, just the obvious friction.',
      timeframe: 'This week, 30 minutes',
    },
    'Team Skills': {
      title: 'Run a 1-hour AI exploration session',
      description: 'Pick one free AI tool (any chatbot or writing assistant). Spend 1 hour as a team trying it on a real work task. No training needed — just hands-on experimentation. Teams that try before they train adopt 3x faster.',
      timeframe: 'This week, 1 hour',
    },
    'AI Adoption': {
      title: 'Automate one small workflow',
      description: 'Pick your simplest repetitive task — email sorting, meeting summaries, data entry. Set up one AI automation for just that task. Start with one person, one workflow. Prove it works before expanding.',
      timeframe: 'Next 5 days',
    },
    'Readiness to Act': {
      title: 'Set a 30-day AI sprint goal',
      description: 'Define one measurable outcome: "Reduce time spent on [X] by 30%" or "Automate [Y] completely." Give it 30 days. A deadline turns interest into action — and gives you data to decide what\'s next.',
      timeframe: 'Set it today, run for 30 days',
    },
  }

  return wins[weakest.name] || wins['Vision & Strategy']
}

function getIndustryInsight(industry: string, answers: Record<string, string>): string {
  const size = answers.size || '1–10'
  const insights: Record<string, string> = {
    'IT & Software': `In tech, ${size}-person teams that adopt AI internally (not just for clients) ship 30-40% faster. The biggest unlock isn't building AI products — it's using AI to accelerate your existing development, testing, and documentation workflows.`,
    'Finance & Banking': `Financial services teams your size are seeing the fastest ROI from AI in three areas: automated document processing, client communication drafting, and compliance checking. Start where the paperwork is heaviest.`,
    'Healthcare': `Healthcare organizations your size benefit most from AI in scheduling optimization, patient communication, and administrative documentation. The key is starting with non-clinical workflows first — lower risk, faster wins, builds confidence.`,
    'Manufacturing': `Manufacturing companies your size get the quickest returns from AI-powered quality inspection, predictive maintenance alerts, and supply chain forecasting. Start with the data you already collect but don't fully use.`,
    'Retail & E-commerce': `Retail businesses your size see the fastest impact from AI in inventory forecasting, personalized customer messaging, and automated product descriptions. Start with the task your team spends the most hours on weekly.`,
    'Education': `Education organizations your size benefit most from AI in content creation, personalized learning paths, and administrative automation. The wins compound — one hour saved per teacher per day adds up to weeks of capacity annually.`,
    'Real Estate': `Real estate teams your size get the quickest ROI from AI in property description writing, lead qualification, and market analysis automation. Start with the task that's currently bottlenecking your closings.`,
    'Other': `Businesses your size across industries are seeing 20-35% time savings within 90 days of structured AI adoption. The key isn't the industry — it's starting with one workflow, proving value, then expanding deliberately.`,
  }

  return insights[industry] || insights['Other']
}

function getGapAdvice(pillars: PillarScore[]): { pillar: string; advice: string }[] {
  const sorted = [...pillars].sort((a, b) => a.score - b.score)
  const gaps = sorted.filter(p => p.score < 60).slice(0, 2)

  const advice: Record<string, string> = {
    'Vision & Strategy': "You know AI exists but haven't mapped it to your specific workflows yet. That's normal — most businesses skip this step and jump into tools. Spend time defining the problem before picking solutions.",
    'Team Skills': "Your team needs hands-on exposure, not courses. People learn AI by using it on real tasks, not watching videos. Create safe space to experiment — mistakes here cost nothing, but avoidance costs momentum.",
    'AI Adoption': "You're in the planning phase while others are testing. The risk isn't making a wrong choice — it's waiting so long that you're learning while competitors are optimizing. Start small, start now.",
    'Readiness to Act': "You're interested but not yet committed to a timeline. That's fine if you're genuinely in research mode — but know that AI capabilities are moving fast. The gap between you and early movers widens every quarter.",
  }

  return gaps.map(p => ({ pillar: p.name, advice: advice[p.name] || '' }))
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
    const pillars = calculatePillars(answers)
    try {
      await fetch('/api/ai-readiness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          answers,
          overallScore: getOverallScore(pillars),
          pillars: pillars.map(p => ({ name: p.name, score: p.score })),
        }),
      })
      setSubmitted(true)
    } catch {}
    setSubmitting(false)
  }

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
          Answer 7 quick questions. Get an honest readiness breakdown — where you're strong, where the gaps are, and one thing you can do this week.
        </p>
        <p className="text-gray-400 text-sm mb-8">No signup required. Takes 60 seconds.</p>
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

  if (showResult) {
    const pillars = calculatePillars(answers)
    const overall = getOverallScore(pillars)
    const strength = getStrengthStatement(pillars, answers)
    const quickWin = getQuickWin(pillars, answers)
    const industryInsight = getIndustryInsight(answers.industry || 'Other', answers)
    const gaps = getGapAdvice(pillars)

    const scoreLabel = overall >= 70 ? 'Strong' : overall >= 45 ? 'Building' : 'Early Stage'
    const scoreColor = overall >= 70 ? 'text-green-600' : overall >= 45 ? 'text-blue-600' : 'text-orange-600'
    const scoreBg = overall >= 70 ? 'bg-green-50 border-green-200' : overall >= 45 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'

    return (
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Overall Score */}
        <div className={`rounded-2xl border p-6 sm:p-8 text-center ${scoreBg}`}>
          <p className="text-sm font-medium text-gray-500 mb-2">Your AI Readiness Score</p>
          <div className={`text-5xl sm:text-6xl font-black ${scoreColor} mb-1`}>{overall}</div>
          <p className={`text-lg font-bold ${scoreColor}`}>{scoreLabel}</p>
        </div>

        {/* What you're doing right */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
            <h3 className="text-lg font-bold text-gray-900">What you're already doing right</h3>
          </div>
          <p className="text-gray-600 leading-relaxed ml-8">{strength}</p>
        </div>

        {/* Pillar Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-5">Your readiness breakdown</h3>
          <div className="space-y-5">
            {pillars.map((pillar) => (
              <div key={pillar.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <pillar.icon className={`w-4 h-4 ${pillar.color}`} />
                    <span className="text-sm font-semibold text-gray-700">{pillar.name}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{pillar.score}/100</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pillar.barColor} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${pillar.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Win */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900">Your #1 Quick Win</h3>
              <p className="text-xs text-amber-700 font-medium mt-0.5">{quickWin.timeframe}</p>
            </div>
          </div>
          <p className="text-gray-900 font-semibold mb-2 ml-8">{quickWin.title}</p>
          <p className="text-gray-600 leading-relaxed ml-8">{quickWin.description}</p>
        </div>

        {/* Gaps / Areas to focus */}
        {gaps.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Where to focus next</h3>
            <div className="space-y-4">
              {gaps.map((gap) => (
                <div key={gap.pillar} className="pl-4 border-l-3 border-gray-200">
                  <p className="text-sm font-semibold text-gray-800 mb-1">{gap.pillar}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{gap.advice}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Industry Insight */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8">
          <div className="flex items-start gap-3 mb-3">
            <TrendingUp className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" />
            <h3 className="text-lg font-bold text-gray-900">What we're seeing in {answers.industry || 'your industry'}</h3>
          </div>
          <p className="text-gray-600 leading-relaxed ml-8">{industryInsight}</p>
        </div>

        {/* How we can help — soft, genuine */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-3">How we fit in</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            We work with {answers.size || 'small'}-person teams to close exactly the gaps you're seeing above — whether that's getting your team comfortable with AI, building your first automation, or creating a roadmap that ties AI directly to revenue. No generic playbooks. We look at your specific situation and work alongside you.
          </p>
          <p className="text-gray-600 leading-relaxed">
            If you'd like to walk through these results together and talk about what makes sense for your business — that's what our free call is for. No pitch, just a conversation about your results.
          </p>
        </div>

        {/* Email capture */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-lg font-bold text-gray-900">Get your full report</h4>
              <p className="text-sm text-gray-500">We'll send a detailed breakdown you can share with your team — including your scores, quick win, and a 30-day starter roadmap.</p>
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
              <p className="text-green-800 font-medium">Done! Check your inbox — we'll send the full report shortly.</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center space-y-3 pb-4">
          <Link
            href="/resources/calendar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            Walk through my results — free 15-min call <ArrowRight className="w-4 h-4" />
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
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            Question {currentQ + 1} of {QUESTIONS.length}
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
    </div>
  )
}
