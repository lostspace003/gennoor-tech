'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowRight, ChevronLeft, Zap, Mail, Lock, Volume2, VolumeX, Play, Pause, SkipForward, SkipBack, Download, Send, Check } from 'lucide-react'

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
      { label: 'I\'m a student', desc: 'Learning, upskilling, or exploring career paths' },
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
    id: 'learning',
    question: 'How do you usually pick up new tools or skills?',
    subtext: 'This tells us how to recommend next steps.',
    options: [
      { label: 'YouTube videos and free tutorials', desc: '' },
      { label: 'I need structured courses or workshops', desc: '' },
      { label: 'I learn by doing — just give me access and I\'ll figure it out', desc: '' },
      { label: 'I learn best with a mentor or coach', desc: '' },
    ],
  },
  {
    id: 'blockers',
    question: 'What\'s really stopping you from using AI more?',
    subtext: 'The real blocker, not the polite one.',
    options: [
      { label: 'I don\'t know what\'s actually possible', desc: '' },
      { label: 'I\'ve tried tools but couldn\'t make them stick', desc: '' },
      { label: 'My company/team isn\'t ready for it', desc: '' },
      { label: 'I\'m worried about doing it wrong or wasting money', desc: '' },
      { label: 'Nothing — I just need the right push', desc: '' },
    ],
  },
  {
    id: 'investment',
    question: 'What would success look like for you in 90 days?',
    subtext: 'Dream a little.',
    options: [
      { label: 'Save 5-10 hours per week on repetitive work', desc: '' },
      { label: 'Launch something new that I\'ve been stuck on', desc: '' },
      { label: 'Get my team actually using AI day-to-day', desc: '' },
      { label: 'Have a clear AI strategy with ROI I can measure', desc: '' },
      { label: 'Just feel confident that I\'m not falling behind', desc: '' },
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
      { label: 'Learn something new / upskill', desc: '' },
      { label: 'Just breathe. Less stress.', desc: '' },
    ],
  },
]

interface Slide {
  id: number
  title: string
  type: string
  narration: string
  content: any
  audio?: string
}

interface Presentation {
  score: number
  headline: string
  slides: Slide[]
}

type Step = 'email' | 'otp' | 'quiz' | 'generating' | 'presentation'

const AGENT_STEPS = [
  'Analyzing your responses...',
  'Building your readiness profile...',
  'Generating personalized insights...',
  'Creating your presentation slides...',
  'Recording voice narration...',
  'Assembling your report...',
]

export default function AIReadinessQuizV2() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [presentation, setPresentation] = useState<Presentation | null>(null)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [emailingReport, setEmailingReport] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // Agent progress
  const [agentStep, setAgentStep] = useState(0)

  // Presentation player
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioMuted, setAudioMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // OTP countdown timer
  useEffect(() => {
    if (otpTimer <= 0) return
    const interval = setInterval(() => setOtpTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [otpTimer])

  // Agent progress animation
  useEffect(() => {
    if (step !== 'generating') return
    if (agentStep >= AGENT_STEPS.length) return
    const timer = setTimeout(() => setAgentStep(s => s + 1), 2500)
    return () => clearTimeout(timer)
  }, [step, agentStep])

  // Auto-advance slides when audio ends
  const handleAudioEnd = useCallback(() => {
    if (!presentation) return
    if (currentSlide < presentation.slides.length - 1) {
      timerRef.current = setTimeout(() => {
        setCurrentSlide(s => s + 1)
      }, 1000)
    } else {
      setIsPlaying(false)
    }
  }, [presentation, currentSlide])

  // Play audio for current slide
  useEffect(() => {
    if (!presentation || !isPlaying) return
    const slide = presentation.slides[currentSlide]
    if (slide?.audio && audioRef.current) {
      audioRef.current.src = `data:audio/mp3;base64,${slide.audio}`
      if (!audioMuted) audioRef.current.play().catch(() => {})
    }
  }, [currentSlide, isPlaying, presentation, audioMuted])

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
    } catch (err: any) { setError(err.message) }
    setSending(false)
  }

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
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
    } catch (err: any) { setError(err.message) }
    setSending(false)
  }

  function handleSelect(option: string) {
    const q = QUESTIONS[currentQ]
    const newAnswers = { ...answers, [q.id]: option }
    setAnswers(newAnswers)
    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 250)
    } else {
      generatePresentation(newAnswers)
    }
  }

  async function generatePresentation(finalAnswers: Record<string, string>) {
    setStep('generating')
    setAgentStep(0)
    try {
      const res = await fetch('/api/ai-readiness-v2/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, answers: finalAnswers }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Generation failed')
      setPresentation(data.presentation)
      setCurrentSlide(0)
      setStep('presentation')
    } catch (err: any) {
      setError(err.message)
      setStep('quiz')
    }
  }

  function startPresentation() {
    setIsPlaying(true)
    setCurrentSlide(0)
  }

  function togglePlay() {
    if (isPlaying) {
      setIsPlaying(false)
      audioRef.current?.pause()
      if (timerRef.current) clearTimeout(timerRef.current)
    } else {
      setIsPlaying(true)
    }
  }

  function nextSlide() {
    if (!presentation) return
    audioRef.current?.pause()
    if (timerRef.current) clearTimeout(timerRef.current)
    if (currentSlide < presentation.slides.length - 1) setCurrentSlide(s => s + 1)
  }

  function prevSlide() {
    audioRef.current?.pause()
    if (timerRef.current) clearTimeout(timerRef.current)
    if (currentSlide > 0) setCurrentSlide(s => s - 1)
  }

  function handleReset() {
    setStep('email')
    setCurrentQ(0)
    setAnswers({})
    setPresentation(null)
    setIsPlaying(false)
    setCurrentSlide(0)
    setError('')
    setAgentStep(0)
    setOtpTimer(0)
    setEmailSent(false)
  }

  async function handleDownloadReport() {
    if (!presentation) return
    setDownloadingPdf(true)
    try {
      const { generateDeepDivePDF, downloadPDF } = await import('@/lib/generate-report-pdf')
      const doc = generateDeepDivePDF(presentation, name, email)
      downloadPDF(doc, `AI-Readiness-Deep-Dive-${name || 'Report'}.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    }
    setDownloadingPdf(false)
  }

  async function handleEmailReport() {
    if (!presentation) return
    setEmailingReport(true)
    try {
      const { generateDeepDivePDF, pdfToBase64 } = await import('@/lib/generate-report-pdf')
      const doc = generateDeepDivePDF(presentation, name, email)
      const pdfBase64 = pdfToBase64(doc)

      const res = await fetch('/api/ai-readiness/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, pdfBase64, reportType: 'deep-dive' }),
      })
      if (!res.ok) throw new Error('Failed to send email')
      setEmailSent(true)
    } catch (err) {
      console.error('Email report error:', err)
    }
    setEmailingReport(false)
  }

  const progress = (currentQ / QUESTIONS.length) * 100

  // ─── EMAIL ───────────────────────────────────────────────
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
            <input type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400" />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400" autoFocus />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button onClick={handleSendOTP} disabled={sending || !email.trim()} className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {sending ? 'Sending...' : <><ArrowRight className="w-4 h-4" /> Send verification code</>}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">No spam. Code expires in 5 minutes.</p>
        </div>
      </div>
    )
  }

  // ─── OTP ─────────────────────────────────────────────────
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
            <input type="text" placeholder="6-digit code" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} onKeyDown={(e) => e.key === 'Enter' && handleVerifyOTP()} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-center text-2xl font-mono tracking-[0.5em] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400" autoFocus maxLength={6} />
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
            <button onClick={handleVerifyOTP} disabled={sending || otp.length < 6 || otpTimer <= 0} className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
              {sending ? 'Verifying...' : 'Verify & Start'}
            </button>
          </div>
          <div className="flex items-center justify-between mt-3">
            <button onClick={() => { setStep('email'); setOtp(''); setError(''); setOtpTimer(0) }} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Use a different email</button>
            {otpTimer <= 0 && (
              <button onClick={handleSendOTP} disabled={sending} className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">Resend code</button>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ─── GENERATING (Agent Working) ──────────────────────────
  if (step === 'generating') {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-accent-400 border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          <div className="absolute inset-6 rounded-full border-4 border-purple-400 border-l-transparent animate-spin [animation-duration:2s]" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-6">AI Agents building your report</h3>
        <div className="space-y-3 text-left max-w-sm mx-auto">
          {AGENT_STEPS.map((label, i) => (
            <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${i <= agentStep ? 'opacity-100' : 'opacity-30'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                i < agentStep ? 'bg-green-500' : i === agentStep ? 'bg-primary-500 animate-pulse' : 'bg-gray-200'
              }`}>
                {i < agentStep ? (
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <div className={`w-2 h-2 rounded-full ${i === agentStep ? 'bg-white' : 'bg-gray-400'}`} />
                )}
              </div>
              <span className={`text-sm ${i < agentStep ? 'text-green-700 font-medium' : i === agentStep ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-gray-400 text-xs mt-8">Don't close this page — takes about 15 seconds</p>
      </div>
    )
  }

  // ─── PRESENTATION PLAYER ─────────────────────────────────
  if (step === 'presentation' && presentation) {
    const slide = presentation.slides[currentSlide]
    const progressPct = ((currentSlide + 1) / presentation.slides.length) * 100

    return (
      <div className="max-w-3xl mx-auto">
        <audio ref={audioRef} onEnded={handleAudioEnd} />

        {/* Player container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500">AI Readiness Report — {name || email}</span>
            <span className="text-xs font-medium text-gray-400">{currentSlide + 1} / {presentation.slides.length}</span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
          </div>

          {/* Slide content */}
          <div className="min-h-[400px] p-8 flex flex-col justify-center animate-fade-in" key={currentSlide}>
            {slide?.type === 'score' && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">Your AI Readiness Score</p>
                <div className="text-7xl font-black text-primary-600 mb-3">{slide.content.score}</div>
                <p className="text-2xl font-bold text-gray-900 mb-2">{slide.content.headline}</p>
                <p className="text-gray-600">{slide.content.verdict}</p>
              </div>
            )}

            {slide?.type === 'strength' && (
              <div className="max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">What you're doing right</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{slide.content.statement}</p>
              </div>
            )}

            {slide?.type === 'reality' && (
              <div className="max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">The uncomfortable truth</h3>
                <p className="text-gray-700 text-lg mb-4">{slide.content.truth}</p>
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 font-semibold">You're losing ~{slide.content.timeWasted} to work AI could handle.</p>
                  <p className="text-red-600 text-sm mt-1">{slide.content.impact}</p>
                </div>
              </div>
            )}

            {slide?.type === 'pillars' && (
              <div className="max-w-xl mx-auto w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Your readiness breakdown</h3>
                <div className="space-y-5">
                  {slide.content.pillars?.map((p: any) => (
                    <div key={p.name}>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-semibold text-gray-700">{p.name}</span>
                        <span className="text-sm font-bold text-gray-900">{p.score}</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-1000" style={{ width: `${p.score}%` }} />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{p.insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slide?.type === 'monday' && (
              <div className="max-w-2xl mx-auto w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-5">Your Monday: Now vs. With AI</h3>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="bg-gray-50 rounded-xl p-5">
                    <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-3">Now</p>
                    {slide.content.before?.map((b: string, i: number) => (
                      <p key={i} className="text-sm text-gray-600 mb-2 flex items-start gap-2"><span className="text-red-400">•</span>{b}</p>
                    ))}
                  </div>
                  <div className="bg-primary-50/50 rounded-xl p-5">
                    <p className="text-xs font-bold text-primary-500 uppercase tracking-wide mb-3">With AI</p>
                    {slide.content.after?.map((a: string, i: number) => (
                      <p key={i} className="text-sm text-gray-700 mb-2 flex items-start gap-2"><span className="text-primary-500">•</span>{a}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {slide?.type === 'quickwin' && (
              <div className="max-w-xl mx-auto">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Your #1 Quick Win</h3>
                <p className="text-xs text-amber-600 font-medium mb-4">{slide.content.timeframe}</p>
                <p className="text-lg font-semibold text-gray-900 mb-4">{slide.content.title}</p>
                <ol className="space-y-3">
                  {slide.content.steps?.map((s: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
                {slide.content.result && <p className="mt-4 text-amber-700 font-medium">→ {slide.content.result}</p>}
              </div>
            )}

            {slide?.type === 'plan' && (
              <div className="max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-5">Your 30-day starter plan</h3>
                <div className="space-y-4">
                  {slide.content.weeks?.map((w: any, i: number) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-20 flex-shrink-0">
                        <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">{w.period}</span>
                      </div>
                      <p className="text-gray-700">{w.action}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slide?.type === 'cta' && (
              <div className="max-w-xl mx-auto text-center">
                <p className="text-gray-700 text-lg leading-relaxed mb-4">{slide.content.industryInsight}</p>
                <p className="text-gray-500 italic mb-6">{slide.content.peerComparison}</p>
                <div className="bg-primary-50 border border-primary-200 rounded-xl p-6">
                  <p className="text-gray-800 font-medium mb-4">{slide.content.cta}</p>
                  <a href="/resources/calendar" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
                    Book a free 15-min call <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}

            {/* Fallback for unknown types */}
            {!['score', 'strength', 'reality', 'pillars', 'monday', 'quickwin', 'plan', 'cta'].includes(slide?.type || '') && slide && (
              <div className="max-w-xl mx-auto">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{slide.title}</h3>
                <p className="text-gray-600">{slide.narration}</p>
              </div>
            )}
          </div>

          {/* Controls bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button onClick={prevSlide} className="p-2 hover:bg-gray-200 rounded-full transition-colors" disabled={currentSlide === 0}>
                <SkipBack className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={togglePlay} className="p-2.5 bg-primary-600 hover:bg-primary-700 rounded-full transition-colors">
                {isPlaying ? <Pause className="w-4 h-4 text-white" /> : <Play className="w-4 h-4 text-white ml-0.5" />}
              </button>
              <button onClick={nextSlide} className="p-2 hover:bg-gray-200 rounded-full transition-colors" disabled={currentSlide === presentation.slides.length - 1}>
                <SkipForward className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={() => setAudioMuted(!audioMuted)} className="p-2 hover:bg-gray-200 rounded-full transition-colors ml-1">
                {audioMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-gray-600" />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleDownloadReport} disabled={downloadingPdf} className="p-2 hover:bg-gray-200 rounded-full transition-colors" title="Download Report">
                <Download className={`w-4 h-4 ${downloadingPdf ? 'text-gray-300 animate-pulse' : 'text-gray-600'}`} />
              </button>
              <button onClick={handleEmailReport} disabled={emailingReport || emailSent} className="p-2 hover:bg-gray-200 rounded-full transition-colors" title="Send on Email">
                {emailSent ? <Check className="w-4 h-4 text-green-500" /> : <Send className={`w-4 h-4 ${emailingReport ? 'text-gray-300 animate-pulse' : 'text-gray-600'}`} />}
              </button>
            </div>
          </div>
        </div>

        {/* Narration subtitle */}
        {isPlaying && slide && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500 italic leading-relaxed max-w-xl mx-auto">{slide.narration}</p>
          </div>
        )}

        {/* Below player actions */}
        <div className="mt-8 space-y-4">
          {!isPlaying && currentSlide === 0 && (
            <div className="text-center">
              <button onClick={startPresentation} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all shadow-lg">
                <Play className="w-4 h-4" /> Play my report
              </button>
            </div>
          )}
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
                emailSent ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              {emailSent ? 'Sent to your email!' : emailingReport ? 'Sending...' : 'Send on Email'}
            </button>
          </div>
          <div className="text-center">
            <button onClick={handleReset} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Retake assessment
            </button>
          </div>
        </div>

        <style jsx>{`
          @keyframes fade-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          .animate-fade-in { animation: fade-in 0.5s ease-out; }
        `}</style>
      </div>
    )
  }

  // ─── QUIZ ────────────────────────────────────────────────
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">Question {currentQ + 1} of {QUESTIONS.length}</span>
          <span className="text-sm font-medium text-primary-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{QUESTIONS[currentQ].question}</h3>
        {QUESTIONS[currentQ].subtext && <p className="text-sm text-gray-500 mb-5">{QUESTIONS[currentQ].subtext}</p>}
        <div className="space-y-2.5">
          {QUESTIONS[currentQ].options.map((option) => {
            const isSelected = answers[QUESTIONS[currentQ].id] === option.label
            return (
              <button key={option.label} onClick={() => handleSelect(option.label)} className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-gray-150 bg-white hover:border-primary-200 hover:bg-primary-50/50'}`}>
                <span className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>{option.label}</span>
                {option.desc && <span className="block text-xs text-gray-400 mt-0.5">{option.desc}</span>}
              </button>
            )
          })}
        </div>
        {currentQ > 0 && (
          <button onClick={() => setCurrentQ(currentQ - 1)} className="flex items-center gap-1 mt-5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        )}
        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  )
}
