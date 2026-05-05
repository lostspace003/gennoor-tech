'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowRight, ChevronLeft, Zap, Mail, Lock, Volume2, VolumeX, Target, Users, Workflow, Rocket, Clock, Lightbulb, TrendingUp, AlertTriangle, Calendar, Download, Send } from 'lucide-react'

const QUESTIONS = [
  {
    id: 'persona',
    question: 'First — who are you?',
    subtext: 'This shapes everything we show you.',
    options: [
      { label: 'I work in a company', desc: 'Employee, manager, or team lead' },
      { label: 'I\'m a freelancer', desc: 'Solo consultant or independent professional' },
      { label: 'I\'m building a startup', desc: 'Small team, building something new' },
      { label: 'I run a business', desc: 'Owner or decision-maker, 10+ people' },
    ],
  },
  {
    id: 'industry',
    question: 'What space are you in?',
    subtext: 'So we can ground advice in your reality.',
    options: [
      { label: 'Tech & Software', desc: '' },
      { label: 'Finance & Banking', desc: '' },
      { label: 'Healthcare', desc: '' },
      { label: 'Manufacturing', desc: '' },
      { label: 'Retail & E-commerce', desc: '' },
      { label: 'Education & Training', desc: '' },
      { label: 'Professional Services', desc: 'Consulting, legal, marketing, etc.' },
      { label: 'Other', desc: '' },
    ],
  },
  {
    id: 'monday',
    question: 'It\'s Monday 9 AM. You have 47 emails, 3 deadlines, and a meeting in 2 hours.',
    subtext: 'What actually happens?',
    options: [
      { label: 'I start sorting through everything manually', desc: 'No systems, pure willpower' },
      { label: 'I use some shortcuts but mostly handle it myself', desc: 'A few tools here and there' },
      { label: 'I have tools that auto-sort and prep key stuff', desc: 'Some automation in place' },
      { label: 'Half of it is handled before I open my laptop', desc: 'AI/automation doing the heavy lifting' },
    ],
  },
  {
    id: 'competitor',
    question: 'Someone in your space just delivered in 2 weeks what would take you 2 months.',
    subtext: 'Honest reaction?',
    options: [
      { label: '"That\'s not realistic — they must be cutting corners"', desc: '' },
      { label: '"I need to figure out how they did that"', desc: '' },
      { label: '"I know how — I just haven\'t set it up yet"', desc: '' },
      { label: '"We\'re already moving at that speed"', desc: '' },
    ],
  },
  {
    id: 'timeDrain',
    question: 'What eats the most of your time that honestly doesn\'t need your brain?',
    subtext: 'The thing you\'d eliminate first.',
    options: [
      { label: 'Writing emails, proposals, and reports from scratch', desc: '' },
      { label: 'Searching for information across files and tools', desc: '' },
      { label: 'Data entry — copying between systems', desc: '' },
      { label: 'Scheduling, follow-ups, admin coordination', desc: '' },
    ],
  },
  {
    id: 'skillLevel',
    question: 'If I handed you an AI tool right now — what happens?',
    subtext: 'Be honest. No judgment.',
    options: [
      { label: 'I\'d stare at it — no idea where to start', desc: '' },
      { label: 'I\'d try the basics but probably give up after an hour', desc: '' },
      { label: 'I\'d get it working for 1-2 tasks within a day', desc: '' },
      { label: 'Already using several — show me something new', desc: '' },
    ],
  },
  {
    id: 'extraTime',
    question: 'If AI gave you back 2 hours every single day — what would you actually do?',
    subtext: 'The real answer, not the "right" one.',
    options: [
      { label: 'Focus on strategy and growth', desc: '' },
      { label: 'Take on more clients or projects', desc: '' },
      { label: 'Finally do that thing I\'ve been postponing', desc: '' },
      { label: 'Just breathe. Less stress.', desc: '' },
    ],
  },
]

interface Report {
  headline: string
  score: number
  verdict: string
  strengthStatement: string
  realityCheck: string
  timeWasted: string
  pillars: { name: string; score: number; insight: string }[]
  quickWin: { title: string; steps: string[]; timeframe: string; expectedResult: string }
  mondayBefore: string[]
  mondayAfter: string[]
  industryInsight: string
  peerComparison: string
  thirtyDayPlan: string[]
  voiceSummary: string
}

type Step = 'email' | 'otp' | 'quiz' | 'loading' | 'results'

const PILLAR_ICONS: Record<string, typeof Zap> = {
  'Mindset': Target,
  'Skills': Users,
  'Workflow': Workflow,
  'Readiness': Rocket,
}

const PILLAR_COLORS: Record<string, { text: string; bar: string }> = {
  'Mindset': { text: 'text-blue-600', bar: 'bg-blue-500' },
  'Skills': { text: 'text-teal-600', bar: 'bg-teal-500' },
  'Workflow': { text: 'text-purple-600', bar: 'bg-purple-500' },
  'Readiness': { text: 'text-orange-600', bar: 'bg-orange-500' },
}

export default function AIReadinessQuiz() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [report, setReport] = useState<Report | null>(null)
  const [audioSrc, setAudioSrc] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [revealIndex, setRevealIndex] = useState(0)
  const [otpTimer, setOtpTimer] = useState(0)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [emailingReport, setEmailingReport] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return
    const interval = setInterval(() => setOtpTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [otpTimer])

  // Animate results reveal
  useEffect(() => {
    if (step !== 'results' || !report) return
    if (revealIndex >= 8) return
    const timer = setTimeout(() => setRevealIndex(i => i + 1), 400)
    return () => clearTimeout(timer)
  }, [step, report, revealIndex])

  // Auto-play audio when results load
  useEffect(() => {
    if (audioSrc && step === 'results' && audioRef.current) {
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }, [audioSrc, step])

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play().catch(() => {})
    }
    setIsPlaying(!isPlaying)
  }, [isPlaying])

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  async function handleSendOTP() {
    if (!email.trim()) return
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send code')
      setOtpTimer(180)
      setStep('otp')
    } catch (err: any) {
      setError(err.message)
    }
    setSending(false)
  }

  async function handleVerifyOTP() {
    if (!otp.trim()) return
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Verification failed')
      setStep('quiz')
    } catch (err: any) {
      setError(err.message)
    }
    setSending(false)
  }

  function handleSelect(option: string) {
    const q = QUESTIONS[currentQ]
    const newAnswers = { ...answers, [q.id]: option }
    setAnswers(newAnswers)

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 250)
    } else {
      generateResults(newAnswers)
    }
  }

  async function generateResults(finalAnswers: Record<string, string>) {
    setStep('loading')
    try {
      const res = await fetch('/api/ai-readiness/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, answers: finalAnswers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate report')

      setReport(data.report)
      if (data.audio) {
        setAudioSrc(`data:audio/mp3;base64,${data.audio}`)
      }
      setRevealIndex(0)
      setStep('results')
    } catch (err: any) {
      setError(err.message)
      setStep('quiz')
    }
  }

  async function handleDownloadReport() {
    if (!report) return
    setDownloadingPdf(true)
    try {
      const { generateQuickScanPDF, downloadPDF } = await import('@/lib/generate-report-pdf')
      const doc = generateQuickScanPDF(report, name, email)
      downloadPDF(doc, `AI-Readiness-Report-${name || 'Report'}.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    }
    setDownloadingPdf(false)
  }

  async function handleEmailReport() {
    if (!report) return
    setEmailingReport(true)
    try {
      const { generateQuickScanPDF, pdfToBase64 } = await import('@/lib/generate-report-pdf')
      const doc = generateQuickScanPDF(report, name, email)
      const pdfBase64 = pdfToBase64(doc)

      const res = await fetch('/api/ai-readiness/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, pdfBase64, reportType: 'quick-scan' }),
      })
      if (!res.ok) throw new Error('Failed to send email')
      setEmailSent(true)
    } catch (err) {
      console.error('Email report error:', err)
    }
    setEmailingReport(false)
  }

  function handleBack() {
    if (currentQ > 0) setCurrentQ(currentQ - 1)
  }

  function handleReset() {
    setStep('email')
    setCurrentQ(0)
    setAnswers({})
    setReport(null)
    setAudioSrc(null)
    setIsPlaying(false)
    setRevealIndex(0)
    setError('')
    setOtpTimer(0)
    setEmailSent(false)
  }

  const progress = (currentQ / QUESTIONS.length) * 100

  // ─── Email Entry ─────────────────────────────────────────
  if (step === 'email') {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Verify your email</h3>
              <p className="text-sm text-gray-500">Your report will be sent here</p>
            </div>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
              autoFocus
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={handleSendOTP}
              disabled={sending || !email.trim()}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {sending ? 'Sending...' : <><ArrowRight className="w-4 h-4" /> Send verification code</>}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">No spam. Code expires in 3 minutes.</p>
        </div>
      </div>
    )
  }

  // ─── OTP Verification ────────────────────────────────────
  if (step === 'otp') {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Enter verification code</h3>
              <p className="text-sm text-gray-500">Sent to {email}</p>
            </div>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-center text-2xl font-mono tracking-[0.5em] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
              autoFocus
              maxLength={6}
            />
            {/* OTP Timer */}
            <div className="text-center">
              {otpTimer > 0 ? (
                <p className="text-sm text-gray-500">
                  Code expires in <span className={`font-mono font-bold ${otpTimer <= 30 ? 'text-red-500' : 'text-primary-600'}`}>{formatTimer(otpTimer)}</span>
                </p>
              ) : (
                <p className="text-sm text-red-500 font-medium">Code expired</p>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              onClick={handleVerifyOTP}
              disabled={sending || otp.length < 6 || otpTimer <= 0}
              className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              {sending ? 'Verifying...' : 'Verify & Start'}
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => { setStep('email'); setOtp(''); setError(''); setOtpTimer(0) }}
              className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Use a different email
            </button>
            {otpTimer <= 0 && (
              <button
                onClick={handleSendOTP}
                disabled={sending}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Resend code
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ─── Loading ─────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="max-w-md mx-auto py-20 text-center">
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-accent-400 border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">AI is analyzing your answers</h3>
        <p className="text-gray-500 text-sm">Generating your personalized report with voice narration...</p>
        <p className="text-gray-400 text-xs mt-4">Takes about 10 seconds</p>
      </div>
    )
  }

  // ─── Results ─────────────────────────────────────────────
  if (step === 'results' && report) {
    const scoreColor = report.score >= 70 ? 'text-green-600' : report.score >= 45 ? 'text-blue-600' : 'text-orange-600'
    const scoreBg = report.score >= 70 ? 'from-green-50 to-emerald-50 border-green-200' : report.score >= 45 ? 'from-blue-50 to-indigo-50 border-blue-200' : 'from-orange-50 to-amber-50 border-orange-200'

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        {audioSrc && (
          <audio ref={audioRef} src={audioSrc} onEnded={() => setIsPlaying(false)} />
        )}

        {/* Score + Headline */}
        <div className={`relative rounded-2xl border bg-gradient-to-br ${scoreBg} p-6 sm:p-8 text-center transition-all duration-700 ${revealIndex >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {audioSrc && (
            <button
              onClick={toggleAudio}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
            >
              {isPlaying ? <Volume2 className="w-4 h-4 text-primary-600 animate-pulse" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
            </button>
          )}
          <p className="text-sm font-medium text-gray-500 mb-2">Your AI Readiness Score</p>
          <div className={`text-6xl sm:text-7xl font-black ${scoreColor} mb-2`}>{report.score}</div>
          <p className="text-xl font-bold text-gray-900 mb-1">{report.headline}</p>
          <p className="text-gray-600">{report.verdict}</p>
        </div>

        {/* Strength */}
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition-all duration-700 ${revealIndex >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">What you're doing right</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{report.strengthStatement}</p>
            </div>
          </div>
        </div>

        {/* Reality Check */}
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition-all duration-700 ${revealIndex >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">The uncomfortable truth</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{report.realityCheck}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 px-4 py-2.5 bg-red-50 rounded-xl">
            <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-700">You're losing approximately {report.timeWasted} to work AI could handle.</p>
          </div>
        </div>

        {/* Pillars */}
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition-all duration-700 ${revealIndex >= 3 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h3 className="font-bold text-gray-900 mb-5">Your readiness breakdown</h3>
          <div className="space-y-4">
            {report.pillars.map((pillar) => {
              const Icon = PILLAR_ICONS[pillar.name] || Target
              const colors = PILLAR_COLORS[pillar.name] || { text: 'text-gray-600', bar: 'bg-gray-500' }
              return (
                <div key={pillar.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${colors.text}`} />
                      <span className="text-sm font-semibold text-gray-700">{pillar.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{pillar.score}</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors.bar} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: revealIndex >= 3 ? `${pillar.score}%` : '0%' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{pillar.insight}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Monday Before vs After */}
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition-all duration-700 ${revealIndex >= 4 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h3 className="font-bold text-gray-900 mb-4">Your Monday: Now vs. With AI</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Now</p>
              <ul className="space-y-2">
                {report.mondayBefore.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-red-400 mt-0.5">•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary-50/50 rounded-xl p-4">
              <p className="text-xs font-bold text-primary-500 uppercase tracking-wide mb-2">With AI</p>
              <ul className="space-y-2">
                {report.mondayAfter.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-primary-500 mt-0.5">•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Win */}
        <div className={`bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 transition-all duration-700 ${revealIndex >= 5 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-start gap-3 mb-3">
            <Lightbulb className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-gray-900">Your #1 Quick Win</h3>
              <p className="text-xs text-amber-700 font-medium">{report.quickWin.timeframe}</p>
            </div>
          </div>
          <p className="text-gray-900 font-semibold mb-3 ml-8">{report.quickWin.title}</p>
          <ol className="space-y-2 ml-8">
            {report.quickWin.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
          {report.quickWin.expectedResult && (
            <p className="mt-3 ml-8 text-sm text-amber-800 font-medium">→ {report.quickWin.expectedResult}</p>
          )}
        </div>

        {/* 30-Day Plan */}
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition-all duration-700 ${revealIndex >= 6 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-start gap-3 mb-4">
            <Calendar className="w-5 h-5 text-primary-600 flex-shrink-0" />
            <h3 className="font-bold text-gray-900">Your 30-day starter plan</h3>
          </div>
          <div className="space-y-3 ml-8">
            {report.thirtyDayPlan.map((item, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />
                <p className="text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Industry + Peer */}
        <div className={`bg-gray-50 rounded-2xl border border-gray-200 p-6 transition-all duration-700 ${revealIndex >= 7 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-gray-700 text-sm leading-relaxed mb-3">{report.industryInsight}</p>
          <p className="text-gray-500 text-sm italic">{report.peerComparison}</p>
        </div>

        {/* Download & Email Report */}
        <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 transition-all duration-700 ${revealIndex >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <h3 className="font-bold text-gray-900 mb-4 text-center">Get your report</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadReport}
              disabled={downloadingPdf}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloadingPdf ? 'Generating PDF...' : 'Download Report'}
            </button>
            <button
              onClick={handleEmailReport}
              disabled={emailingReport || emailSent}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all disabled:opacity-50 ${
                emailSent
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              {emailSent ? 'Sent to your email!' : emailingReport ? 'Sending...' : 'Send on Email'}
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center space-y-4 py-6 transition-all duration-700 ${revealIndex >= 8 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <p className="text-gray-600 text-sm">Want to discuss these results and figure out your next move?</p>
          <a
            href="/resources/calendar"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
          >
            Walk through my results — free 15-min call <ArrowRight className="w-4 h-4" />
          </a>
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

  // ─── Quiz Questions ──────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Question {currentQ + 1} of {QUESTIONS.length}</span>
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
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{QUESTIONS[currentQ].question}</h3>
        {QUESTIONS[currentQ].subtext && (
          <p className="text-sm text-gray-500 mb-5">{QUESTIONS[currentQ].subtext}</p>
        )}

        <div className="space-y-2.5">
          {QUESTIONS[currentQ].options.map((option) => {
            const isSelected = answers[QUESTIONS[currentQ].id] === option.label
            return (
              <button
                key={option.label}
                onClick={() => handleSelect(option.label)}
                className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50 shadow-sm'
                    : 'border-gray-150 bg-white hover:border-primary-200 hover:bg-primary-50/50'
                }`}
              >
                <span className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                {option.desc && (
                  <span className="block text-xs text-gray-400 mt-0.5">{option.desc}</span>
                )}
              </button>
            )
          })}
        </div>

        {currentQ > 0 && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 mt-5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  )
}
