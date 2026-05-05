'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight, ChevronLeft, Mail, Lock, Download, Send, Zap, Check } from 'lucide-react'
import FeedbackModal from '@/components/FeedbackModal'

// ─── Role → Category → Subcategory mapping ────────────────
const ROLE_OPTIONS = [
  { id: 'employee', label: 'I work in a company', desc: 'Employee, manager, or team lead' },
  { id: 'freelancer', label: 'I\'m a freelancer', desc: 'Solo consultant or independent professional' },
  { id: 'startup', label: 'I\'m building a startup', desc: 'Founding team, early-stage company' },
  { id: 'business-owner', label: 'I run a business', desc: 'Owner or decision-maker, established company' },
  { id: 'student', label: 'I\'m a student', desc: 'Learning, upskilling, or exploring career paths' },
]

const CATEGORIES: Record<string, { label: string; subcategories?: string[] }[]> = {
  employee: [
    { label: 'Tech & Software', subcategories: ['Engineering', 'Product', 'QA/Testing', 'DevOps', 'Data/Analytics'] },
    { label: 'Finance & Banking', subcategories: ['Risk & Compliance', 'Trading', 'Operations', 'Wealth Management'] },
    { label: 'Healthcare', subcategories: ['Clinical', 'Administration', 'Research', 'Pharma'] },
    { label: 'Manufacturing', subcategories: ['Production', 'Supply Chain', 'Quality', 'R&D'] },
    { label: 'Retail & E-commerce', subcategories: ['Marketing', 'Operations', 'Merchandising', 'Customer Experience'] },
    { label: 'Professional Services', subcategories: ['Consulting', 'Legal', 'Accounting', 'HR'] },
    { label: 'Government & Public Sector', subcategories: ['Administration', 'Policy', 'IT Services', 'Defense'] },
    { label: 'Other' },
  ],
  freelancer: [
    { label: 'Content & Marketing', subcategories: ['Writing', 'Social Media', 'SEO', 'Video'] },
    { label: 'Design & Creative', subcategories: ['UI/UX', 'Graphic Design', 'Motion', 'Branding'] },
    { label: 'Development & Tech', subcategories: ['Web Dev', 'Mobile', 'AI/ML', 'DevOps'] },
    { label: 'Consulting & Strategy', subcategories: ['Business', 'Management', 'Finance', 'HR'] },
    { label: 'Education & Coaching', subcategories: ['Training', 'Tutoring', 'Career Coaching'] },
    { label: 'Other' },
  ],
  startup: [
    { label: 'SaaS & Software', subcategories: ['B2B', 'B2C', 'Developer Tools', 'AI/ML'] },
    { label: 'Fintech', subcategories: ['Payments', 'Lending', 'InsurTech', 'WealthTech'] },
    { label: 'HealthTech', subcategories: ['Digital Health', 'MedTech', 'BioTech'] },
    { label: 'E-commerce & D2C', subcategories: ['Marketplace', 'Brand', 'Logistics'] },
    { label: 'EdTech', subcategories: ['K-12', 'Higher Ed', 'Corporate Learning'] },
    { label: 'DeepTech & Hardware', subcategories: ['Robotics', 'IoT', 'CleanTech'] },
    { label: 'Other' },
  ],
  'business-owner': [
    { label: 'Retail & Consumer', subcategories: ['Physical Stores', 'E-commerce', 'F&B', 'Services'] },
    { label: 'Manufacturing & Industrial', subcategories: ['Production', 'Supply Chain', 'Distribution'] },
    { label: 'Professional Services', subcategories: ['Agency', 'Consultancy', 'Legal', 'Accounting'] },
    { label: 'Healthcare & Wellness', subcategories: ['Clinics', 'Diagnostics', 'Wellness', 'Pharma'] },
    { label: 'Construction & Real Estate', subcategories: ['Development', 'Brokerage', 'Property Management'] },
    { label: 'Education & Training', subcategories: ['Schools', 'Training Centers', 'Coaching'] },
    { label: 'Other' },
  ],
  student: [
    { label: 'Engineering & Tech', subcategories: ['Computer Science', 'Electrical', 'Mechanical', 'Civil'] },
    { label: 'Business & Management', subcategories: ['MBA', 'Finance', 'Marketing', 'HR'] },
    { label: 'Sciences', subcategories: ['Data Science', 'Life Sciences', 'Physics', 'Chemistry'] },
    { label: 'Design & Arts', subcategories: ['UI/UX', 'Graphic Design', 'Film', 'Architecture'] },
    { label: 'Medicine & Health', subcategories: ['MBBS', 'Nursing', 'Public Health', 'Pharmacy'] },
    { label: 'Law & Social Sciences', subcategories: ['Law', 'Psychology', 'Sociology', 'Economics'] },
    { label: 'Other' },
  ],
}

// ─── Dynamic questions by role ─────────────────────────────
const ROLE_QUESTIONS: Record<string, { id: string; question: string; subtext?: string; options: { label: string; desc?: string }[] }[]> = {
  employee: [
    { id: 'daily', question: 'What does your typical workday look like?', subtext: 'Help us understand your workflow.', options: [
      { label: 'Mostly meetings, emails, and coordination' },
      { label: 'Deep work — reports, analysis, or development' },
      { label: 'Client-facing — calls, presentations, demos' },
      { label: 'Mix of everything — no two days are the same' },
    ]},
    { id: 'team-ai', question: 'How does your team currently use AI?', options: [
      { label: 'We don\'t — it hasn\'t come up seriously' },
      { label: 'A few individuals use ChatGPT or Copilot on their own' },
      { label: 'We have some approved tools but adoption is patchy' },
      { label: 'It\'s integrated into our workflows and processes' },
    ]},
    { id: 'bottleneck', question: 'What slows your team down the most?', options: [
      { label: 'Waiting for approvals and decisions' },
      { label: 'Repetitive manual tasks nobody wants to own' },
      { label: 'Finding information across 10 different systems' },
      { label: 'Context switching between too many tools' },
    ]},
    { id: 'decision', question: 'When it comes to adopting new tools, who decides?', options: [
      { label: 'I decide for myself — nobody checks' },
      { label: 'My manager approves, usually says yes' },
      { label: 'IT/procurement has to approve — takes weeks' },
      { label: 'There\'s a formal evaluation process' },
    ]},
    { id: 'ambition', question: 'What would make the biggest difference in your role?', options: [
      { label: 'Automating the tasks I hate doing' },
      { label: 'Getting insights from data I already have' },
      { label: 'Being able to create content 10x faster' },
      { label: 'Having an AI assistant that knows our company' },
    ]},
  ],
  freelancer: [
    { id: 'clients', question: 'How many active clients do you typically handle?', options: [
      { label: '1-2 — deep engagement with each' },
      { label: '3-5 — juggling multiple projects' },
      { label: '6-10 — volume-based work' },
      { label: '10+ — productized or template-based' },
    ]},
    { id: 'bottleneck', question: 'What takes the most time that isn\'t billable?', options: [
      { label: 'Proposals, invoicing, and admin' },
      { label: 'Client communication and follow-ups' },
      { label: 'Research before starting projects' },
      { label: 'Marketing myself and finding leads' },
    ]},
    { id: 'tools', question: 'Which AI tools are you already using?', options: [
      { label: 'None — curious but haven\'t started' },
      { label: 'ChatGPT for ideas and drafts' },
      { label: 'Multiple tools — Copilot, Midjourney, etc.' },
      { label: 'I\'ve built custom workflows with AI' },
    ]},
    { id: 'pricing', question: 'Has AI affected how you price your work?', options: [
      { label: 'No — I charge the same as before' },
      { label: 'I\'m worried it will drive prices down' },
      { label: 'I charge more because I deliver faster' },
      { label: 'I\'m shifting to value-based pricing' },
    ]},
    { id: 'growth', question: 'What\'s your biggest growth goal right now?', options: [
      { label: 'Earn more without working more hours' },
      { label: 'Build a personal brand that attracts clients' },
      { label: 'Productize my service into something scalable' },
      { label: 'Transition from freelancing to an agency/startup' },
    ]},
  ],
  startup: [
    { id: 'stage', question: 'What stage are you at?', options: [
      { label: 'Idea stage — validating the concept' },
      { label: 'MVP — building or just launched' },
      { label: 'Early traction — first paying customers' },
      { label: 'Scaling — product-market fit found' },
    ]},
    { id: 'team', question: 'How big is your team?', options: [
      { label: 'Just me (solo founder)' },
      { label: '2-5 people' },
      { label: '6-20 people' },
      { label: '20+ people' },
    ]},
    { id: 'ai-product', question: 'Is AI part of your product or just operations?', options: [
      { label: 'AI IS our product — it\'s core to what we sell' },
      { label: 'We use AI features to enhance our product' },
      { label: 'Only for internal operations (marketing, support)' },
      { label: 'We haven\'t integrated AI anywhere yet' },
    ]},
    { id: 'bottleneck', question: 'What\'s your biggest constraint right now?', options: [
      { label: 'Technical — building fast enough' },
      { label: 'Commercial — getting customers and revenue' },
      { label: 'Talent — can\'t hire the right people' },
      { label: 'Capital — need funding to scale' },
    ]},
    { id: 'compete', question: 'How are competitors using AI?', options: [
      { label: 'No idea — haven\'t looked into it' },
      { label: 'They\'re behind — this is our advantage' },
      { label: 'Same level as us — it\'s a race' },
      { label: 'They\'re ahead — we need to catch up' },
    ]},
  ],
  'business-owner': [
    { id: 'team-size', question: 'How many people work in your business?', options: [
      { label: '1-10 — small team, everyone wears multiple hats' },
      { label: '11-50 — departments forming, some structure' },
      { label: '51-200 — established operations and processes' },
      { label: '200+ — enterprise-level complexity' },
    ]},
    { id: 'processes', question: 'How would you describe your operations?', options: [
      { label: 'Manual — spreadsheets, email, and willpower' },
      { label: 'Some systems in place but lots of gaps' },
      { label: 'Well-organized with ERP/CRM but not AI-enabled' },
      { label: 'Already using automation and AI in operations' },
    ]},
    { id: 'priority', question: 'Where would AI make the biggest impact for you?', options: [
      { label: 'Customer service and support' },
      { label: 'Sales and marketing automation' },
      { label: 'Operations and supply chain' },
      { label: 'Decision-making and business intelligence' },
    ]},
    { id: 'budget', question: 'What\'s your comfort level investing in AI?', options: [
      { label: 'Want to start with free/low-cost tools' },
      { label: 'Can invest if ROI is clear within 3 months' },
      { label: 'Have budget allocated for digital transformation' },
      { label: 'Ready to invest significantly for competitive edge' },
    ]},
    { id: 'concern', question: 'What concerns you most about AI adoption?', options: [
      { label: 'My team won\'t adopt it — resistance to change' },
      { label: 'Data privacy and security risks' },
      { label: 'Choosing the wrong tools and wasting money' },
      { label: 'Being left behind if I don\'t act soon' },
    ]},
  ],
  student: [
    { id: 'year', question: 'Where are you in your academic journey?', options: [
      { label: 'Undergraduate — early years' },
      { label: 'Undergraduate — final year' },
      { label: 'Postgraduate / Masters' },
      { label: 'Self-learning / bootcamp / certification' },
    ]},
    { id: 'usage', question: 'How do you currently use AI in your studies?', options: [
      { label: 'I don\'t — still doing everything manually' },
      { label: 'ChatGPT for research and explanations' },
      { label: 'Multiple AI tools — coding, writing, presentations' },
      { label: 'I\'m building projects with AI/ML' },
    ]},
    { id: 'career', question: 'What\'s your career goal?', options: [
      { label: 'Get a great job at a top company' },
      { label: 'Start my own business or freelance' },
      { label: 'Go into research or academia' },
      { label: 'Still figuring it out' },
    ]},
    { id: 'skill-gap', question: 'What AI skill would give you the biggest edge?', options: [
      { label: 'Prompt engineering — getting better outputs' },
      { label: 'Building AI applications (coding, APIs)' },
      { label: 'Understanding AI strategy for business' },
      { label: 'Data analysis and visualization with AI' },
    ]},
    { id: 'time', question: 'How much time can you invest in learning AI?', options: [
      { label: '30 min/day — squeeze it in between classes' },
      { label: '1-2 hours/day — serious about this' },
      { label: 'Weekends only — packed schedule' },
      { label: 'Full-time focus right now' },
    ]},
  ],
}

// Common final questions for everyone
const COMMON_QUESTIONS = [
  {
    id: 'ai-confidence',
    question: 'How confident are you about AI\'s role in your future?',
    subtext: 'Not what you think you should say — how you actually feel.',
    options: [
      { label: 'Anxious — it feels overwhelming and I\'m falling behind' },
      { label: 'Cautiously optimistic — I see the potential but need guidance' },
      { label: 'Excited — I want to go all in' },
      { label: 'Skeptical — I\'ll believe it when I see real results' },
    ],
  },
  {
    id: 'success-metric',
    question: 'How would you measure success with AI in 6 months?',
    options: [
      { label: 'Saving 10+ hours per week on repetitive tasks' },
      { label: 'Generating measurable revenue or cost savings' },
      { label: 'Being seen as the AI expert in my space' },
      { label: 'Having a clear, executable AI strategy' },
    ],
  },
]

interface BlueprintReport {
  score: number
  headline: string
  summary: string
  sections: { title: string; content: string }[]
  charts: string[]
  narrationAudio: string
}

type Step = 'email' | 'otp' | 'role' | 'category' | 'subcategory' | 'questions' | 'open-ended' | 'generating' | 'gen-error' | 'report'

const AGENT_STEPS = [
  'Analyzing your profile and responses...',
  'Building your role-specific readiness model...',
  'Running AI adoption benchmark analysis...',
  'Generating custom visualizations...',
  'Creating your implementation roadmap...',
  'Calculating ROI projections...',
  'Building your personalized blueprint...',
  'Recording voice summary...',
  'Finalizing your report...',
]

export default function AIReadinessBlueprint() {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [role, setRole] = useState('')
  const [category, setCategory] = useState('')
  const [subcategory, setSubcategory] = useState('')
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [openEnded, setOpenEnded] = useState('')
  const [report, setReport] = useState<BlueprintReport | null>(null)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [agentStep, setAgentStep] = useState(0)
  const [downloadingPdf, setDownloadingPdf] = useState(false)
  const [emailingReport, setEmailingReport] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [feedbackAction, setFeedbackAction] = useState<'download' | 'email' | null>(null)
  const reportRef = useRef<HTMLDivElement>(null)

  const questions = [
    ...(ROLE_QUESTIONS[role] || []),
    ...COMMON_QUESTIONS,
  ]
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? (currentQ / totalQuestions) * 100 : 0

  // OTP countdown
  useEffect(() => {
    if (otpTimer <= 0) return
    const interval = setInterval(() => setOtpTimer(t => t - 1), 1000)
    return () => clearInterval(interval)
  }, [otpTimer])

  // Agent progress animation
  useEffect(() => {
    if (step !== 'generating') return
    if (agentStep >= AGENT_STEPS.length) return
    const timer = setTimeout(() => setAgentStep(s => s + 1), 7000)
    return () => clearTimeout(timer)
  }, [step, agentStep])

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
    } catch (err: any) { setError(err.message) }
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
      setStep('role')
    } catch (err: any) { setError(err.message) }
    setSending(false)
  }

  function handleRoleSelect(roleId: string) {
    setRole(roleId)
    setCategory('')
    setSubcategory('')
    setAnswers({})
    setCurrentQ(0)
    setTimeout(() => setStep('category'), 200)
  }

  function handleCategorySelect(cat: string) {
    setCategory(cat)
    setSubcategory('')
    const catDef = CATEGORIES[role]?.find(c => c.label === cat)
    if (catDef?.subcategories?.length) {
      setTimeout(() => setStep('subcategory'), 200)
    } else {
      setTimeout(() => setStep('questions'), 200)
    }
  }

  function handleSubcategorySelect(sub: string) {
    setSubcategory(sub)
    setTimeout(() => setStep('questions'), 200)
  }

  function handleAnswerSelect(option: string) {
    const q = questions[currentQ]
    const newAnswers = { ...answers, [q.id]: option }
    setAnswers(newAnswers)
    if (currentQ < totalQuestions - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 250)
    } else {
      setStep('open-ended')
    }
  }

  async function handleSubmitBlueprint() {
    setError('')
    setStep('generating')
    setAgentStep(0)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 150000)
      const res = await fetch('/api/ai-readiness/blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role, category, subcategory, answers, openEnded }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Blueprint generation failed')
      setReport(data.blueprint)
      setStep('report')
    } catch (err: any) {
      const msg = err.name === 'AbortError'
        ? 'Generation took too long. Please try again.'
        : (err.message || 'Blueprint generation failed')
      setError(msg)
      setStep('gen-error')
    }
  }

  async function submitFeedback(rating: number, comment: string) {
    fetch('/api/ai-readiness/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, rating, comment, reportType: 'blueprint', action: feedbackAction }),
    }).catch(() => {})
  }

  async function handleFeedbackSubmit(rating: number, comment: string) {
    const action = feedbackAction
    setFeedbackAction(null)
    submitFeedback(rating, comment)
    if (action === 'download') doDownloadReport()
    if (action === 'email') doEmailReport()
  }

  async function doDownloadReport() {
    if (!report) return
    setDownloadingPdf(true)
    try {
      const { generateDeepDivePDF, downloadPDF } = await import('@/lib/generate-report-pdf')
      const mockPresentation = {
        score: report.score,
        headline: report.headline,
        slides: report.sections.map((s, i) => ({
          id: i, title: s.title, type: 'custom', narration: '', content: { text: s.content },
        })),
      }
      const doc = generateDeepDivePDF(mockPresentation, name, email)
      downloadPDF(doc, `AI-Blueprint-${name || 'Report'}.pdf`)
    } catch (err) {
      console.error('PDF generation error:', err)
    }
    setDownloadingPdf(false)
  }

  async function doEmailReport() {
    if (!report) return
    setEmailingReport(true)
    try {
      const { generateDeepDivePDF, pdfToBase64 } = await import('@/lib/generate-report-pdf')
      const mockPresentation = {
        score: report.score,
        headline: report.headline,
        slides: report.sections.map((s, i) => ({
          id: i, title: s.title, type: 'custom', narration: '', content: { text: s.content },
        })),
      }
      const doc = generateDeepDivePDF(mockPresentation, name, email)
      const pdfBase64 = pdfToBase64(doc)
      const res = await fetch('/api/ai-readiness/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, pdfBase64, reportType: 'blueprint' }),
      })
      if (!res.ok) throw new Error('Failed to send email')
      setEmailSent(true)
    } catch (err) {
      console.error('Email report error:', err)
    }
    setEmailingReport(false)
  }

  function handleReset() {
    setStep('email')
    setRole('')
    setCategory('')
    setSubcategory('')
    setCurrentQ(0)
    setAnswers({})
    setOpenEnded('')
    setReport(null)
    setError('')
    setAgentStep(0)
    setOtpTimer(0)
    setEmailSent(false)
  }

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
              <p className="text-sm text-gray-500">Your blueprint will be sent here</p>
            </div>
          </div>
          <div className="space-y-3">
            <input type="text" placeholder="Your name (optional)" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400" />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendOTP()} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400" autoFocus />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button onClick={handleSendOTP} disabled={sending || !email.trim()} className="w-full py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {sending ? 'Sending...' : <><ArrowRight className="w-4 h-4" /> Send verification code</>}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">No spam. Code expires in 3 minutes.</p>
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
                <p className="text-sm text-gray-500">Code expires in <span className={`font-mono font-bold ${otpTimer <= 30 ? 'text-red-500' : 'text-primary-600'}`}>{formatTimer(otpTimer)}</span></p>
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
            {otpTimer <= 0 && <button onClick={handleSendOTP} disabled={sending} className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">Resend code</button>}
          </div>
        </div>
      </div>
    )
  }

  // ─── ROLE SELECTION ──────────────────────────────────────
  if (step === 'role') {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">First — who are you?</h3>
          <p className="text-sm text-gray-500">This shapes your entire assessment and recommendations.</p>
        </div>
        <div className="space-y-2.5">
          {ROLE_OPTIONS.map((r) => (
            <button key={r.id} onClick={() => handleRoleSelect(r.id)} className="w-full text-left px-5 py-4 rounded-xl border-2 border-gray-150 bg-white hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200">
              <span className="text-sm font-semibold text-gray-800">{r.label}</span>
              <span className="block text-xs text-gray-400 mt-0.5">{r.desc}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ─── CATEGORY SELECTION ──────────────────────────────────
  if (step === 'category') {
    const cats = CATEGORIES[role] || []
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">What space are you in?</h3>
          <p className="text-sm text-gray-500">So we can ground advice in your reality.</p>
        </div>
        <div className="space-y-2.5">
          {cats.map((c) => (
            <button key={c.label} onClick={() => handleCategorySelect(c.label)} className="w-full text-left px-5 py-3.5 rounded-xl border-2 border-gray-150 bg-white hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200">
              <span className="text-sm font-medium text-gray-700">{c.label}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setStep('role')} className="flex items-center gap-1 mt-5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>
    )
  }

  // ─── SUBCATEGORY SELECTION ───────────────────────────────
  if (step === 'subcategory') {
    const catDef = CATEGORIES[role]?.find(c => c.label === category)
    const subs = catDef?.subcategories || []
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-1">Can you narrow it down?</h3>
          <p className="text-sm text-gray-500">{category} — pick your area or skip.</p>
        </div>
        <div className="space-y-2.5">
          {subs.map((s) => (
            <button key={s} onClick={() => handleSubcategorySelect(s)} className="w-full text-left px-5 py-3.5 rounded-xl border-2 border-gray-150 bg-white hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-200">
              <span className="text-sm font-medium text-gray-700">{s}</span>
            </button>
          ))}
          <button onClick={() => { setSubcategory(''); setStep('questions') }} className="w-full text-left px-5 py-3.5 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200">
            <span className="text-sm text-gray-500">Skip — just use {category}</span>
          </button>
        </div>
        <button onClick={() => setStep('category')} className="flex items-center gap-1 mt-5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>
    )
  }

  // ─── QUESTIONS ───────────────────────────────────────────
  if (step === 'questions' && questions.length > 0) {
    const q = questions[currentQ]
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Question {currentQ + 1} of {totalQuestions}</span>
            <span className="text-sm font-medium text-primary-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{q.question}</h3>
          {q.subtext && <p className="text-sm text-gray-500 mb-5">{q.subtext}</p>}
          {!q.subtext && <div className="mb-5" />}
          <div className="space-y-2.5">
            {q.options.map((option) => {
              const isSelected = answers[q.id] === option.label
              return (
                <button key={option.label} onClick={() => handleAnswerSelect(option.label)} className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'border-primary-500 bg-primary-50 shadow-sm' : 'border-gray-150 bg-white hover:border-primary-200 hover:bg-primary-50/50'}`}>
                  <span className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>{option.label}</span>
                  {'desc' in option && option.desc && <span className="block text-xs text-gray-400 mt-0.5">{option.desc}</span>}
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

  // ─── OPEN-ENDED ──────────────────────────────────────────
  if (step === 'open-ended') {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Anything else we should know?</h3>
          <p className="text-sm text-gray-500 mb-5">Specific challenges, goals, or context that would help us give better advice. This is optional but makes your blueprint much more useful.</p>
          <textarea
            placeholder="e.g., We're a 30-person marketing agency trying to reduce time on client reporting by 50%..."
            value={openEnded}
            onChange={(e) => setOpenEnded(e.target.value)}
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
            autoFocus
          />
          <div className="flex items-center justify-between mt-5">
            <button onClick={() => { setStep('questions'); setCurrentQ(totalQuestions - 1) }} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={handleSubmitBlueprint} className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
              Generate my Blueprint <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─── GENERATING ──────────────────────────────────────────
  if (step === 'generating') {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-primary-500 border-t-transparent animate-spin" />
          <div className="absolute inset-3 rounded-full border-4 border-accent-400 border-b-transparent animate-spin [animation-direction:reverse] [animation-duration:1.5s]" />
          <div className="absolute inset-6 rounded-full border-4 border-purple-400 border-l-transparent animate-spin [animation-duration:2s]" />
          <div className="absolute inset-9 rounded-full border-4 border-amber-400 border-r-transparent animate-spin [animation-direction:reverse] [animation-duration:2.5s]" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">AI Agents building your blueprint</h3>
        <p className="text-sm text-gray-500 mb-8">Code Interpreter is generating custom visualizations for you...</p>
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
        <p className="text-gray-400 text-xs mt-8">This takes about 60-90 seconds — hang tight</p>
      </div>
    )
  }

  // ─── GENERATION ERROR ────────────────────────────────────
  if (step === 'gen-error') {
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Generation didn&apos;t complete</h3>
        <p className="text-sm text-gray-500 mb-2">{error || 'Something went wrong while generating your blueprint.'}</p>
        <p className="text-xs text-gray-400 mb-8">The AI agent may have timed out. Your answers are saved — just hit retry.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => { setError(''); setStep('open-ended') }} className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
            Edit Answers
          </button>
          <button onClick={handleSubmitBlueprint} className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl">
            <Zap className="w-4 h-4" /> Retry Generation
          </button>
        </div>
      </div>
    )
  }

  // ─── REPORT ──────────────────────────────────────────────
  if (step === 'report' && report) {
    const scoreColor = report.score >= 70 ? 'text-green-600' : report.score >= 45 ? 'text-blue-600' : 'text-orange-600'

    return (
      <div className="max-w-3xl mx-auto space-y-6" ref={reportRef}>
        {feedbackAction && (
          <FeedbackModal onSubmit={handleFeedbackSubmit} onClose={() => setFeedbackAction(null)} />
        )}

        {/* Score header */}
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-2xl border border-primary-200 p-8 text-center">
          <p className="text-sm font-medium text-gray-500 mb-2">Your AI Readiness Blueprint Score</p>
          <div className={`text-7xl font-black ${scoreColor} mb-3`}>{report.score}</div>
          <p className="text-2xl font-bold text-gray-900 mb-2">{report.headline}</p>
          <p className="text-gray-600 max-w-xl mx-auto">{report.summary}</p>
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
            <span>{ROLE_OPTIONS.find(r => r.id === role)?.label}</span>
            <span>•</span>
            <span>{category}{subcategory ? ` → ${subcategory}` : ''}</span>
          </div>
        </div>

        {/* Charts */}
        {report.charts && report.charts.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Your custom visualizations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {report.charts.map((chart, i) => (
                <div key={i} className="rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                  <img src={`data:image/png;base64,${chart}`} alt={`Chart ${i + 1}`} className="w-full" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sections */}
        {report.sections.map((section, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-3">{section.title}</h3>
            <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{section.content}</div>
          </div>
        ))}

        {/* Audio narration */}
        {report.narrationAudio && (
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
            <audio controls src={`data:audio/mp3;base64,${report.narrationAudio}`} className="w-full" />
          </div>
        )}

        {/* Download & Email */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h3 className="font-bold text-gray-900 mb-4 text-center">Get your blueprint</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => setFeedbackAction('download')} disabled={downloadingPdf} className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all disabled:opacity-50">
              <Download className="w-4 h-4" />
              {downloadingPdf ? 'Generating PDF...' : 'Download Report'}
            </button>
            <button onClick={() => setFeedbackAction('email')} disabled={emailingReport || emailSent} className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-xl transition-all disabled:opacity-50 ${emailSent ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-primary-600 hover:bg-primary-700 text-white'}`}>
              <Send className="w-4 h-4" />
              {emailSent ? 'Sent to your email!' : emailingReport ? 'Sending...' : 'Send on Email'}
            </button>
          </div>
        </div>

        {/* CTA + Reset */}
        <div className="text-center space-y-4 py-6">
          <p className="text-gray-600 text-sm">Want to walk through your blueprint with an AI expert?</p>
          <a href="/resources/calendar" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
            Book a free 15-min call <ArrowRight className="w-4 h-4" />
          </a>
          <div>
            <button onClick={handleReset} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Retake assessment</button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
