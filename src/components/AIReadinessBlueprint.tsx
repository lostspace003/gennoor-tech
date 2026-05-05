'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowRight, ChevronLeft, Mail, Lock, Download, Send, Zap, Check } from 'lucide-react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts'
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
      { label: '3-5 — balanced portfolio' },
      { label: '6-10 — high volume, fast turnaround' },
      { label: '10+ — running a one-person agency' },
    ]},
    { id: 'time-sink', question: 'Where does most of your non-billable time go?', options: [
      { label: 'Finding and pitching new clients' },
      { label: 'Admin — invoices, contracts, scheduling' },
      { label: 'Revisions and client communication' },
      { label: 'Learning new skills to stay competitive' },
    ]},
    { id: 'ai-use', question: 'How do you currently use AI in your work?', options: [
      { label: 'I don\'t — haven\'t found the right fit' },
      { label: 'ChatGPT for brainstorming or drafts' },
      { label: 'AI tools specific to my craft (Midjourney, Cursor, etc.)' },
      { label: 'It\'s core to my workflow — I couldn\'t go back' },
    ]},
    { id: 'pricing', question: 'How has AI affected your pricing?', options: [
      { label: 'Clients expect lower prices because "AI can do it"' },
      { label: 'No change yet but I see it coming' },
      { label: 'I charge more because I deliver faster with AI' },
      { label: 'I\'ve pivoted to services AI can\'t replace' },
    ]},
    { id: 'future', question: 'What\'s your biggest concern about AI as a freelancer?', options: [
      { label: 'Clients replacing me with AI tools directly' },
      { label: 'Competing with AI-augmented freelancers who are faster' },
      { label: 'Not knowing which tools are worth investing time in' },
      { label: 'Quality — AI output isn\'t good enough for my standards' },
    ]},
  ],
  startup: [
    { id: 'stage', question: 'What stage is your startup at?', options: [
      { label: 'Idea / pre-product' },
      { label: 'MVP / early traction' },
      { label: 'Product-market fit / scaling' },
      { label: 'Growth stage / raising Series A+' },
    ]},
    { id: 'team-size', question: 'How big is your team?', options: [
      { label: 'Just me (solo founder)' },
      { label: '2-5 people' },
      { label: '6-20 people' },
      { label: '20+ people' },
    ]},
    { id: 'ai-in-product', question: 'How central is AI to your product?', options: [
      { label: 'AI IS the product — it\'s our core tech' },
      { label: 'AI enhances our product (features, recommendations)' },
      { label: 'We use AI internally but the product isn\'t AI-based' },
      { label: 'We haven\'t incorporated AI yet' },
    ]},
    { id: 'challenge', question: 'What\'s your biggest operational challenge?', options: [
      { label: 'Moving fast with limited resources' },
      { label: 'Hiring and retaining talent' },
      { label: 'Customer acquisition and growth' },
      { label: 'Building reliable systems that scale' },
    ]},
    { id: 'ai-ops', question: 'Where could AI help your startup most right now?', options: [
      { label: 'Automating repetitive ops (support, onboarding, reporting)' },
      { label: 'Generating content and marketing faster' },
      { label: 'Building and shipping product features faster' },
      { label: 'Making better decisions with data we already have' },
    ]},
  ],
  'business-owner': [
    { id: 'biz-size', question: 'How many employees does your business have?', options: [
      { label: '1-10 (small business)' },
      { label: '11-50 (growing business)' },
      { label: '51-200 (mid-size)' },
      { label: '200+ (large organization)' },
    ]},
    { id: 'digital', question: 'How digitized are your core operations?', options: [
      { label: 'Mostly manual — paper, spreadsheets, phone calls' },
      { label: 'Some systems in place but lots of manual work remains' },
      { label: 'Good digital foundation — CRM, ERP, or cloud tools' },
      { label: 'Highly digital — automated workflows, real-time dashboards' },
    ]},
    { id: 'ai-status', question: 'What\'s your current relationship with AI?', options: [
      { label: 'Curious but haven\'t started — not sure where to begin' },
      { label: 'Tried a few things (ChatGPT, chatbots) — mixed results' },
      { label: 'Piloting AI in specific areas' },
      { label: 'AI is already part of how we operate' },
    ]},
    { id: 'priority', question: 'What would you most want AI to solve?', options: [
      { label: 'Reducing operational costs and inefficiencies' },
      { label: 'Improving customer experience and retention' },
      { label: 'Generating more leads and revenue' },
      { label: 'Making better strategic decisions faster' },
    ]},
    { id: 'barrier', question: 'What\'s the biggest barrier to adopting AI in your business?', options: [
      { label: 'Don\'t know what\'s possible or where to start' },
      { label: 'Budget — unsure about ROI' },
      { label: 'Team doesn\'t have the skills' },
      { label: 'Data is messy, scattered, or not digitized' },
    ]},
  ],
  student: [
    { id: 'level', question: 'Where are you in your education?', options: [
      { label: 'Undergraduate (1st-2nd year)' },
      { label: 'Undergraduate (3rd-4th year)' },
      { label: 'Postgraduate / Masters' },
      { label: 'PhD or research-focused' },
    ]},
    { id: 'ai-exposure', question: 'How much have you explored AI?', options: [
      { label: 'Just heard about it — haven\'t really used it' },
      { label: 'Use ChatGPT for assignments and research' },
      { label: 'Took a course or built a small project with AI' },
      { label: 'Building with AI regularly — it\'s a core skill for me' },
    ]},
    { id: 'goal', question: 'What\'s your primary career goal?', options: [
      { label: 'Get hired at a top company' },
      { label: 'Build my own startup or freelance career' },
      { label: 'Go into research or academia' },
      { label: 'Still figuring it out' },
    ]},
    { id: 'concern', question: 'What worries you most about AI and your career?', options: [
      { label: 'Jobs in my field might not exist by the time I graduate' },
      { label: 'I\'m not learning the right skills' },
      { label: 'AI makes everything easier — how do I stand out?' },
      { label: 'I\'m not worried — AI creates more opportunities' },
    ]},
    { id: 'learn', question: 'How do you prefer to learn new tech skills?', options: [
      { label: 'Online courses and tutorials' },
      { label: 'Building projects — learn by doing' },
      { label: 'University courses and structured programs' },
      { label: 'Community — hackathons, meetups, open source' },
    ]},
  ],
}

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
      { label: 'Saving X hours per week on repetitive tasks' },
      { label: 'Delivering noticeably better quality work' },
      { label: 'Being seen as the AI-savvy person in my circle' },
      { label: 'Having a clear roadmap I\'m actually following' },
    ],
  },
]

interface BlueprintReport {
  score: number
  headline: string
  summary: string
  dimensions: Record<string, number>
  skillGap: { skill: string; current: number; required: number }[]
  sections: { title: string; content: string; type: string }[]
  tools: { name: string; purpose: string; timeSaved: string; difficulty: string }[]
  roadmap: { phase1: { title: string; milestones: string[] }; phase2: { title: string; milestones: string[] }; phase3: { title: string; milestones: string[] } }
  roi: { hoursSavedPerWeek: number; productivityIncrease: string; annualValue: string; breakEvenWeeks: number }
  risks: { type: string; severity: string; description: string }[]
  narrationAudio?: string | null
}

type Step = 'email' | 'otp' | 'role' | 'category' | 'subcategory' | 'questions' | 'open-ended' | 'generating' | 'gen-error' | 'report'

const AGENT_STEPS = [
  'Analyzing your profile and responses...',
  'Building your role-specific readiness model...',
  'Running AI adoption benchmark analysis...',
  'Scoring your readiness dimensions...',
  'Creating your implementation roadmap...',
  'Calculating ROI projections...',
  'Finalizing your blueprint...',
]

const DIMENSION_LABELS: Record<string, string> = {
  aiKnowledge: 'AI Knowledge',
  technicalSkills: 'Technical Skills',
  strategicThinking: 'Strategic Thinking',
  adaptability: 'Adaptability',
  toolProficiency: 'Tool Proficiency',
  dataLiteracy: 'Data Literacy',
}

const RADAR_COLORS = ['#6366f1', '#818cf8']
const GAP_COLORS = { current: '#6366f1', required: '#22c55e' }

interface BlueprintProps {
  onLock?: () => void
  onUnlock?: () => void
}

export default function AIReadinessBlueprint({ onLock, onUnlock }: BlueprintProps) {
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
  const [isLocked, setIsLocked] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  const questions = [
    ...(ROLE_QUESTIONS[role] || []),
    ...COMMON_QUESTIONS,
  ]
  const totalQuestions = questions.length
  const progress = totalQuestions > 0 ? (currentQ / totalQuestions) * 100 : 0

  const lockSession = useCallback(() => {
    if (!isLocked) {
      setIsLocked(true)
      onLock?.()
    }
  }, [isLocked, onLock])

  // Lock after OTP verification (step moves past 'otp')
  useEffect(() => {
    if (step !== 'email' && step !== 'otp' && !isLocked) {
      lockSession()
    }
  }, [step, isLocked, lockSession])

  // Warn on page refresh/close when locked
  useEffect(() => {
    if (!isLocked) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isLocked])

  // Warn on tab switch when locked
  useEffect(() => {
    if (!isLocked || step === 'report') return
    const handler = () => {
      if (document.hidden) {
        // we don't block tab switch but the beforeunload handles close
      }
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [isLocked, step])

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
    const timer = setTimeout(() => setAgentStep(s => s + 1), 4000)
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
      const timeout = setTimeout(() => controller.abort(), 90000)
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
    setIsLocked(false)
    onUnlock?.()
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

  // ─── Recharts data transforms ─────────────────────────────
  const radarData = report?.dimensions
    ? Object.entries(report.dimensions).map(([key, val]) => ({
        dimension: DIMENSION_LABELS[key] || key,
        score: val,
        fullMark: 100,
      }))
    : []

  const skillGapData = report?.skillGap || []

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
        <h3 className="text-xl font-bold text-gray-900 mb-2">AI is building your blueprint</h3>
        <p className="text-sm text-gray-500 mb-8">Analyzing your responses and generating personalized insights...</p>
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
        <p className="text-gray-400 text-xs mt-8">This takes about 15-30 seconds — hang tight</p>
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
        <p className="text-xs text-gray-400 mb-8">Your answers are saved — just hit retry.</p>
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

        {/* Radar Chart — Readiness Dimensions */}
        {radarData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-1">Readiness Dimensions</h3>
            <p className="text-xs text-gray-400 mb-4">Your score across 6 key AI readiness areas</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="75%">
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#64748b' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                  <Radar name="Your Score" dataKey="score" stroke={RADAR_COLORS[1]} fill={RADAR_COLORS[0]} fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Skill Gap Chart */}
        {skillGapData.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-1">Skill Gap Analysis</h3>
            <p className="text-xs text-gray-400 mb-4">Current level vs. what&apos;s needed for your role</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillGapData} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis dataKey="skill" type="category" width={100} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="current" name="Current Level" fill={GAP_COLORS.current} radius={[0, 4, 4, 0]} barSize={14} />
                  <Bar dataKey="required" name="Required Level" fill={GAP_COLORS.required} radius={[0, 4, 4, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
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

        {/* Tools Table */}
        {report.tools.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Recommended AI Tools</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700">Tool</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700">Purpose</th>
                    <th className="text-left py-2 pr-4 font-semibold text-gray-700">Time Saved</th>
                    <th className="text-left py-2 font-semibold text-gray-700">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {report.tools.map((tool, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="py-2.5 pr-4 font-medium text-gray-900">{tool.name}</td>
                      <td className="py-2.5 pr-4 text-gray-600">{tool.purpose}</td>
                      <td className="py-2.5 pr-4 text-primary-600 font-medium">{tool.timeSaved}</td>
                      <td className="py-2.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          tool.difficulty === 'Easy' ? 'bg-green-50 text-green-700' :
                          tool.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' :
                          'bg-red-50 text-red-700'
                        }`}>{tool.difficulty}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ROI Card */}
        {report.roi && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Estimated ROI</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-black text-green-600">{report.roi.hoursSavedPerWeek}h</div>
                <div className="text-xs text-gray-500 mt-1">Saved / Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-green-600">{report.roi.productivityIncrease}</div>
                <div className="text-xs text-gray-500 mt-1">Productivity Boost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-green-600">{report.roi.annualValue}</div>
                <div className="text-xs text-gray-500 mt-1">Annual Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-black text-green-600">{report.roi.breakEvenWeeks}w</div>
                <div className="text-xs text-gray-500 mt-1">Break Even</div>
              </div>
            </div>
          </div>
        )}

        {/* Risks */}
        {report.risks.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h3 className="font-bold text-gray-900 mb-4">Risk Assessment</h3>
            <div className="space-y-3">
              {report.risks.map((risk, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 mt-0.5 ${
                    risk.severity === 'High' ? 'bg-red-100 text-red-700' :
                    risk.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>{risk.severity}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{risk.type}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{risk.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
