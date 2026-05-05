'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowRight, ChevronLeft, Mail, Lock, Send, Zap, Check, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, ExternalLink } from 'lucide-react'
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

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

const TOOLS_QUESTION: Record<string, { id: string; question: string; subtext: string; options: { label: string }[] }> = {
  employee: {
    id: 'current-tools',
    question: 'What does your daily work environment look like?',
    subtext: 'We\'ll recommend AI that plugs directly into what you already use.',
    options: [
      { label: 'Microsoft ecosystem — Outlook, Teams, SharePoint, Excel, Power Platform' },
      { label: 'Google Workspace — Gmail, Docs, Sheets, Meet, Drive' },
      { label: 'Slack + Atlassian (Jira, Confluence) or Notion + Linear' },
      { label: 'Salesforce, HubSpot, SAP, Oracle, or other enterprise platforms' },
    ],
  },
  freelancer: {
    id: 'current-tools',
    question: 'What\'s your primary toolkit right now?',
    subtext: 'We\'ll build AI recommendations around your actual workflow.',
    options: [
      { label: 'Figma, Adobe Creative Cloud, Canva, or design-heavy tools' },
      { label: 'Notion, Google Docs, Calendly, Loom — productivity-first' },
      { label: 'VS Code, Cursor, GitHub, Vercel — code and ship' },
      { label: 'WordPress, Mailchimp, Buffer, SEMrush — content & marketing' },
    ],
  },
  startup: {
    id: 'current-tools',
    question: 'What\'s powering your startup right now?',
    subtext: 'We\'ll recommend AI that fits your stage and stack.',
    options: [
      { label: 'GitHub + Vercel/Railway + Cursor or VS Code — shipping fast' },
      { label: 'AWS / Azure / GCP + custom backend + CI/CD pipelines' },
      { label: 'No-code/low-code — Bubble, Retool, Zapier, Airtable, Make' },
      { label: 'Notion + Slack + Sheets — lean ops, figuring things out' },
    ],
  },
  'business-owner': {
    id: 'current-tools',
    question: 'What systems does your business run on today?',
    subtext: 'AI works best when it extends what you already have.',
    options: [
      { label: 'Microsoft 365 — Word, Excel, Outlook, Teams across the company' },
      { label: 'CRM + Finance tools — Zoho, Tally, Salesforce, HubSpot, QuickBooks' },
      { label: 'ERP / industry-specific — SAP, Oracle, custom software, POS systems' },
      { label: 'Mostly WhatsApp, spreadsheets, phone calls — limited digital tools' },
    ],
  },
  student: {
    id: 'current-tools',
    question: 'What do you use day-to-day for your studies and projects?',
    subtext: 'We\'ll suggest AI that accelerates your learning, not replaces it.',
    options: [
      { label: 'Google Docs, Slides, Scholar — research and assignments' },
      { label: 'VS Code, Python, Jupyter Notebooks, GitHub — coding projects' },
      { label: 'Notion, Obsidian, Anki — notes, organization, revision' },
      { label: 'Figma, Canva, Premiere Pro — design and creative work' },
    ],
  },
}

const AI_ACCESS_QUESTION: Record<string, { id: string; question: string; subtext: string; options: { label: string }[] }> = {
  employee: {
    id: 'approved-ai',
    question: 'Which AI tools does your organization provide or allow?',
    subtext: 'We\'ll build on what you have access to — not recommend what IT will block.',
    options: [
      { label: 'Microsoft Copilot — M365 Copilot, Copilot Studio, or GitHub Copilot' },
      { label: 'ChatGPT Enterprise/Team or OpenAI API access' },
      { label: 'Claude for Work, Claude Desktop, or Anthropic API' },
      { label: 'None officially — some people use free tools on their own' },
    ],
  },
  freelancer: {
    id: 'approved-ai',
    question: 'What AI tools are you already paying for or using regularly?',
    subtext: 'So we build on your investment, not duplicate it.',
    options: [
      { label: 'ChatGPT Plus ($20/mo) or Claude Pro ($20/mo) for general work' },
      { label: 'Cursor, GitHub Copilot, or Claude Code for development' },
      { label: 'Midjourney, Runway, Descript, or Adobe Firefly for creative' },
      { label: 'Nothing paid yet — using free tiers or haven\'t started' },
    ],
  },
  startup: {
    id: 'approved-ai',
    question: 'What AI have you already integrated into your product or ops?',
    subtext: 'We\'ll layer new recommendations on your existing AI investment.',
    options: [
      { label: 'OpenAI API, Azure OpenAI, or Anthropic API in our product' },
      { label: 'Claude Code, Cursor, or Copilot for faster development' },
      { label: 'Notion AI, ChatGPT Team, or Perplexity for internal ops' },
      { label: 'Haven\'t integrated AI yet — still evaluating' },
    ],
  },
  'business-owner': {
    id: 'approved-ai',
    question: 'Has your business started using any AI tools?',
    subtext: 'Helps us know your starting point — no judgment either way.',
    options: [
      { label: 'Microsoft Copilot across Office, Teams, or Power Platform' },
      { label: 'ChatGPT, Claude, or Perplexity for emails, research, writing' },
      { label: 'AI features inside our CRM, ERP, or industry software' },
      { label: 'Not yet — we haven\'t explored AI in any serious way' },
    ],
  },
  student: {
    id: 'approved-ai',
    question: 'Which AI tools are part of your learning routine?',
    subtext: 'We\'ll help you level up from wherever you are now.',
    options: [
      { label: 'ChatGPT or Claude — for research, assignments, explanations' },
      { label: 'GitHub Copilot, Cursor, or Claude Code — for coding projects' },
      { label: 'Perplexity, NotebookLM, or Gamma — for research & presentations' },
      { label: 'Haven\'t used AI tools seriously — mostly manual work' },
    ],
  },
}

const COMMON_QUESTIONS = [
  {
    id: 'tool-priority',
    question: 'When choosing an AI tool, what matters most to you?',
    subtext: 'This shapes whether we recommend free, premium, or enterprise-grade tools.',
    options: [
      { label: 'Price first — free or cheapest option that gets the job done' },
      { label: 'Usability — easy to learn, polished interface, minimal setup' },
      { label: 'Comprehensiveness — one powerful tool that covers many use cases' },
      { label: 'Low ongoing cost — predictable pricing, no surprise API/token bills' },
    ],
  },
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

interface BlueprintSlide {
  id: number
  type: string
  title: string
  narration: string
  content: any
  audio?: string
}

interface BlueprintReport {
  score: number
  headline: string
  summary: string
  dimensions: Record<string, number>
  dimensionInsights?: Record<string, string>
  skillGap: { skill: string; current: number; required: number; priority?: string }[]
  strengths?: string[]
  weaknesses?: string[]
  tools: { name: string; url?: string; purpose: string; timeSaved: string; difficulty: string; cost?: string }[]
  roadmap: { phase1: { title: string; goal?: string; milestones: string[]; tools?: string[] }; phase2: { title: string; goal?: string; milestones: string[]; tools?: string[] }; phase3: { title: string; goal?: string; milestones: string[]; tools?: string[] } }
  roi: { hoursSavedPerWeek: number; productivityIncrease: string; annualValue: string; breakEvenWeeks: number; explanation?: string }
  risks: { type: string; severity: string; description: string; mitigation?: string }[]
  industryContext?: string
  references?: { url: string; title: string }[]
  slides?: BlueprintSlide[]
  agentsUsed?: string[]
}

type Step = 'email' | 'otp' | 'role' | 'category' | 'subcategory' | 'questions' | 'open-ended' | 'generating' | 'gen-error' | 'report'

const AGENT_STEPS = [
  'Agent 1: Searching the web for your industry data (Bing)...',
  'Pulling real-time AI adoption stats and tool URLs...',
  'Agent 2: Analyzing your answers against 6 readiness dimensions...',
  'Identifying your skill gaps and scoring your profile...',
  'Agent 3: Building your personalized strategy and roadmap...',
  'Finding AI tools specific to your role with live links...',
  'Calculating ROI projections and risk assessment...',
  'Agent 4: Writing detailed narration for your presentation...',
  'Crafting consultant-style insights for each slide...',
  'Generating voice narration (Azure Speech)...',
  'Assembling your multi-slide report...',
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
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({})
  const [showCustomInput, setShowCustomInput] = useState<string | null>(null)
  const [report, setReport] = useState<BlueprintReport | null>(null)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)
  const [agentStep, setAgentStep] = useState(0)
  const [emailingReport, setEmailingReport] = useState(false)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackHover, setFeedbackHover] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState('')
  const [orgInterest, setOrgInterest] = useState<'yes' | 'no' | 'maybe' | ''>('')
  const [isLocked, setIsLocked] = useState(false)
  const reportRef = useRef<HTMLDivElement>(null)

  // Slide player state
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioMuted, setAudioMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const questions = [
    ...(ROLE_QUESTIONS[role] || []),
    ...(TOOLS_QUESTION[role] ? [TOOLS_QUESTION[role]] : []),
    ...(AI_ACCESS_QUESTION[role] ? [AI_ACCESS_QUESTION[role]] : []),
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

  // Agent progress animation — longer intervals to feel substantial
  useEffect(() => {
    if (step !== 'generating') return
    if (agentStep >= AGENT_STEPS.length) return
    const timer = setTimeout(() => setAgentStep(s => s + 1), 6000)
    return () => clearTimeout(timer)
  }, [step, agentStep])

  // Auto-play slide audio when slide changes (must be at top level, not inside conditional)
  useEffect(() => {
    if (step !== 'report' || !isPlaying || !report?.slides) return
    const slide = report.slides[currentSlide]
    if (!slide?.audio || audioMuted || !audioRef.current) return
    audioRef.current.src = `data:audio/mp3;base64,${slide.audio}`
    audioRef.current.play().catch(() => {})
  }, [currentSlide, isPlaying, step, audioMuted, report])

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
    const customText = customInputs[q.id]
    const finalAnswer = customText ? `${option} | Custom: ${customText}` : option
    const newAnswers = { ...answers, [q.id]: finalAnswer }
    setAnswers(newAnswers)
    setShowCustomInput(null)
    if (currentQ < totalQuestions - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 250)
    } else {
      setStep('open-ended')
    }
  }

  function handleCustomSubmit() {
    const q = questions[currentQ]
    const customText = customInputs[q.id]
    if (!customText?.trim()) return
    const newAnswers = { ...answers, [q.id]: `Custom: ${customText.trim()}` }
    setAnswers(newAnswers)
    setShowCustomInput(null)
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

  async function handleFeedbackAndEmail() {
    if (feedbackRating === 0 || !orgInterest) return
    setEmailingReport(true)

    // 1. Save feedback with org interest
    fetch('/api/ai-readiness/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, rating: feedbackRating, comment: feedbackComment, reportType: 'blueprint', action: 'feedback', orgInterest }),
    }).catch(() => {})

    // 2. Generate PDF and email it
    try {
      const { generateDeepDivePDF, pdfToBase64 } = await import('@/lib/generate-report-pdf')
      const mockPresentation = {
        score: report!.score,
        headline: report!.headline,
        slides: (report!.slides || []).map((s, i) => ({
          id: i, title: s.title, type: 'custom', narration: s.narration || '', content: { text: s.narration || '' },
        })),
      }
      const doc = generateDeepDivePDF(mockPresentation, name, email)
      const pdfBase64 = pdfToBase64(doc)
      await fetch('/api/ai-readiness/email-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, pdfBase64, reportType: 'blueprint', orgInterest, role, category, subcategory }),
      })
    } catch (err) {
      console.error('Email report error:', err)
    }

    setFeedbackSubmitted(true)
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
    setCustomInputs({})
    setShowCustomInput(null)
    setOpenEnded('')
    setReport(null)
    setError('')
    setAgentStep(0)
    setOtpTimer(0)
    setFeedbackSubmitted(false)
    setFeedbackRating(0)
    setFeedbackComment('')
    setOrgInterest('')
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

  // ─── QUESTIONS ───────────────���───────────────────────────
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

          {/* Custom text input option */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            {showCustomInput === q.id ? (
              <div className="space-y-2.5">
                <textarea
                  value={customInputs[q.id] || ''}
                  onChange={(e) => setCustomInputs({ ...customInputs, [q.id]: e.target.value })}
                  placeholder="Type your own answer here..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button onClick={handleCustomSubmit} disabled={!customInputs[q.id]?.trim()} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-40">
                    Submit
                  </button>
                  <button onClick={() => setShowCustomInput(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowCustomInput(q.id)} className="text-sm text-gray-400 hover:text-primary-600 transition-colors flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold">+</span>
                None of these fit? Add your own response
              </button>
            )}
          </div>

          {currentQ > 0 && (
            <button onClick={() => setCurrentQ(currentQ - 1)} className="flex items-center gap-1 mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors">
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
        <h3 className="text-xl font-bold text-gray-900 mb-2">3 AI Agents are building your blueprint</h3>
        <p className="text-sm text-gray-500 mb-8">Researching your industry, analyzing gaps, and crafting your personalized roadmap...</p>
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
        <p className="text-gray-400 text-xs mt-8">Multi-agent research + voice generation takes 45-90 seconds — worth the wait</p>
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
    const slides = report.slides || []
    const slide = slides[currentSlide]
    const progressPct = slides.length > 0 ? ((currentSlide + 1) / slides.length) * 100 : 0

    function handleAudioEnd() {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        if (currentSlide < slides.length - 1) setCurrentSlide(s => s + 1)
        else setIsPlaying(false)
      }, 1500)
    }

    function goNext() { if (currentSlide < slides.length - 1) setCurrentSlide(s => s + 1) }
    function goPrev() { if (currentSlide > 0) setCurrentSlide(s => s - 1) }

    return (
      <div className="max-w-5xl mx-auto" ref={reportRef}>
        <audio ref={audioRef} onEnded={handleAudioEnd} />

        {/* Agent badges */}
        {report.agentsUsed && report.agentsUsed.length > 0 && (
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            {report.agentsUsed.map((agent, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 border border-primary-100 rounded-full text-xs font-medium text-primary-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> {agent}
              </span>
            ))}
          </div>
        )}

        {/* Player container */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
            <span className="text-xs font-medium text-gray-500">AI Readiness Blueprint — {name || email}</span>
            <span className="text-xs font-medium text-gray-400">{currentSlide + 1} / {slides.length}</span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-gray-100">
            <div className="h-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-700 ease-in-out" style={{ width: `${progressPct}%` }} />
          </div>

          {/* Slide content */}
          <div className="min-h-[480px] p-8 sm:p-10 flex flex-col justify-center transition-opacity duration-500 ease-in-out" key={currentSlide} style={{ animation: 'slideIn 0.5s ease-out' }}>
            {slide?.type === 'score' && (
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">Your AI Readiness Score</p>
                <div className={`text-7xl font-black mb-3 ${report.score >= 70 ? 'text-green-600' : report.score >= 45 ? 'text-primary-600' : 'text-orange-600'}`}>{slide.content.score}</div>
                <p className="text-2xl font-bold text-gray-900 mb-2">{slide.content.headline}</p>
                <p className="text-gray-600">{slide.content.verdict}</p>
                <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
                  <span>{ROLE_OPTIONS.find(r => r.id === role)?.label}</span>
                  <span>•</span>
                  <span>{category}{subcategory ? ` → ${subcategory}` : ''}</span>
                </div>
              </div>
            )}

            {slide?.type === 'dimensions' && (
              <div className="w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Readiness Dimensions</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 12, fill: '#475569' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                        <Radar name="Score" dataKey="score" stroke={RADAR_COLORS[1]} fill={RADAR_COLORS[0]} fillOpacity={0.3} strokeWidth={2} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  {slide.content.insights && (
                    <div className="space-y-3">
                      {Object.entries(slide.content.insights as Record<string, string>).map(([key, insight]) => (
                        <div key={key} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                          <span className="text-xs font-bold text-primary-600 min-w-[90px]">{DIMENSION_LABELS[key] || key}</span>
                          <span className="text-sm text-gray-600 text-justify">{insight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {slide?.type === 'skillgap' && (
              <div className="w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Skill Gap Analysis</h3>
                <div style={{ height: `${Math.max(320, (skillGapData.length || 6) * 48)}px` }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillGapData} layout="vertical" margin={{ left: 20, right: 30, top: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                      <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} tickCount={6} />
                      <YAxis dataKey="skill" type="category" width={130} tick={{ fontSize: 12, fill: '#374151' }} interval={0} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                      <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }} />
                      <Bar dataKey="current" name="Your Level" fill={GAP_COLORS.current} radius={[0, 6, 6, 0]} barSize={16} />
                      <Bar dataKey="required" name="Required" fill={GAP_COLORS.required} radius={[0, 6, 6, 0]} barSize={16} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {slide.content.strengths?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {slide.content.strengths.map((s: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">{s}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {slide?.type === 'industry' && (
              <div className="max-w-3xl mx-auto">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4 mx-auto">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Industry Context</h3>
                <p className="text-gray-700 text-base leading-relaxed text-justify">{slide.content.industryContext}</p>
                <p className="text-xs text-gray-400 mt-5 text-center italic">Source: Live web research via Bing Search</p>
              </div>
            )}

            {slide?.type === 'tools' && (
              <div className="w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-5 text-center">Recommended AI Tools</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                  {(slide.content.tools || []).map((tool: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-primary-200 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-sm font-bold">{i + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900 text-sm">{tool.name}</span>
                          {tool.url && (
                            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700"><ExternalLink className="w-3.5 h-3.5" /></a>
                          )}
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${tool.difficulty === 'Easy' ? 'bg-green-50 text-green-700' : tool.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>{tool.difficulty}</span>
                          {tool.cost && <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">{tool.cost}</span>}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{tool.purpose}</p>
                        <p className="text-xs text-primary-600 font-medium mt-1">Saves ~{tool.timeSaved}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slide?.type === 'roadmap' && (
              <div className="w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">90-Day Implementation Roadmap</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  {['phase1', 'phase2', 'phase3'].map((phase, pi) => {
                    const p = slide.content.roadmap?.[phase]
                    if (!p) return null
                    const bgColors = ['bg-blue-50 border-blue-100', 'bg-primary-50 border-primary-100', 'bg-green-50 border-green-100']
                    const dotColors = ['bg-blue-500', 'bg-primary-500', 'bg-green-500']
                    return (
                      <div key={phase} className={`rounded-xl p-5 border ${bgColors[pi]}`}>
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-3 h-3 rounded-full ${dotColors[pi]}`} />
                          <h4 className="text-sm font-bold text-gray-900">{p.title}</h4>
                        </div>
                        {p.goal && <p className="text-xs text-primary-700 font-medium mb-3">{p.goal}</p>}
                        <ul className="space-y-2">
                          {p.milestones?.map((m: string, mi: number) => (
                            <li key={mi} className="text-xs text-gray-700 flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" /><span className="text-justify">{m}</span></li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {slide?.type === 'roi' && (
              <div className="w-full text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-6">ROI Projection</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                    <div className="text-3xl font-black text-green-600">{slide.content.roi?.hoursSavedPerWeek || 0}h</div>
                    <div className="text-xs text-gray-600 mt-1">Hours Saved / Week</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                    <div className="text-3xl font-black text-green-600">{slide.content.roi?.productivityIncrease || '0%'}</div>
                    <div className="text-xs text-gray-600 mt-1">Productivity Boost</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                    <div className="text-3xl font-black text-green-600">{slide.content.roi?.annualValue || '$0'}</div>
                    <div className="text-xs text-gray-600 mt-1">Annual Value</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                    <div className="text-3xl font-black text-green-600">{slide.content.roi?.breakEvenWeeks || 0}w</div>
                    <div className="text-xs text-gray-600 mt-1">Break Even</div>
                  </div>
                </div>
                {slide.content.roi?.explanation && (
                  <p className="text-sm text-gray-500 italic text-justify max-w-2xl mx-auto">{slide.content.roi.explanation}</p>
                )}
              </div>
            )}

            {slide?.type === 'risks' && (
              <div className="w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-5 text-center">Risks of Inaction</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {(slide.content.risks || []).map((risk: any, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold flex-shrink-0 ${risk.severity === 'High' ? 'bg-red-100 text-red-700' : risk.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{risk.severity}</span>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{risk.type}</div>
                        <div className="text-xs text-gray-600 mt-1 text-justify">{risk.description}</div>
                        {risk.mitigation && <div className="text-xs text-green-700 mt-2 font-medium">→ {risk.mitigation}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {slide?.type === 'references' && (
              <div className="w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">Sources & References</h3>
                <p className="text-sm text-gray-500 text-center mb-5">All recommendations backed by live Bing Search research. Click to explore.</p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
                  {(slide.content.references || []).map((ref: any, i: number) => (
                    <a key={i} href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-primary-50 rounded-xl border border-gray-100 hover:border-primary-200 transition-all group">
                      <span className="w-6 h-6 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center flex-shrink-0 text-xs font-bold">{i + 1}</span>
                      <span className="flex-1 text-sm text-gray-700 group-hover:text-primary-700 truncate">{ref.title}</span>
                      <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 flex-shrink-0" />
                    </a>
                  ))}
                </div>
                {(!slide.content.references || slide.content.references.length === 0) && (
                  <p className="text-center text-sm text-gray-400">No external sources were cited in this report.</p>
                )}
              </div>
            )}
          </div>

          {/* Narration text */}
          <div className="px-8 sm:px-10 pb-5 border-t border-gray-50 pt-4 bg-gradient-to-b from-gray-50/50 to-transparent">
            <p className="text-sm text-gray-600 italic text-justify leading-relaxed">&ldquo;{slide?.narration}&rdquo;</p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button onClick={goPrev} disabled={currentSlide === 0} className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors">
                <SkipBack className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={() => setIsPlaying(!isPlaying)} className="p-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white transition-colors">
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button onClick={goNext} disabled={currentSlide >= slides.length - 1} className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-30 transition-colors">
                <SkipForward className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <button onClick={() => setAudioMuted(!audioMuted)} className="p-2 rounded-lg hover:bg-gray-200 transition-colors">
              {audioMuted ? <VolumeX className="w-4 h-4 text-gray-400" /> : <Volume2 className="w-4 h-4 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Feedback + Report Delivery (compulsory) */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
          {!feedbackSubmitted ? (
            <>
              <h3 className="font-bold text-gray-900 mb-1 text-center text-lg">Get your PDF report</h3>
              <p className="text-sm text-gray-500 text-center mb-6">Share your feedback and we&apos;ll email your complete blueprint as a PDF.</p>

              {/* Star rating */}
              <div className="flex items-center justify-center gap-1 mb-5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    onMouseEnter={() => setFeedbackHover(star)}
                    onMouseLeave={() => setFeedbackHover(0)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <svg className={`w-8 h-8 transition-colors ${star <= (feedbackHover || feedbackRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`} viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  </button>
                ))}
                {feedbackRating > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    {['', 'Needs work', 'Fair', 'Good', 'Great', 'Excellent'][feedbackRating]}
                  </span>
                )}
              </div>

              {/* Comment */}
              <textarea
                placeholder="Any feedback or suggestions? (optional)"
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400 mb-5"
              />

              {/* Org interest consent */}
              <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-5 border border-primary-100 mb-5">
                <p className="text-sm font-semibold text-gray-900 mb-1">Interested in AI readiness for your team or organization?</p>
                <p className="text-xs text-gray-500 mb-4">We can build a custom assessment on your organization&apos;s data, run AI training workshops, or set up AI tools for your team.</p>
                <div className="flex flex-wrap gap-2">
                  {([
                    { val: 'yes' as const, label: 'Yes, let\'s explore this' },
                    { val: 'maybe' as const, label: 'Maybe later' },
                    { val: 'no' as const, label: 'Not right now' },
                  ]).map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setOrgInterest(opt.val)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${orgInterest === opt.val ? 'bg-primary-600 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-300'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleFeedbackAndEmail}
                disabled={feedbackRating === 0 || !orgInterest || emailingReport}
                className="w-full py-3.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-xl transition-all disabled:opacity-40 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {emailingReport ? 'Sending your report...' : 'Submit & Send Report to Email'}
              </button>
              {feedbackRating === 0 && <p className="text-xs text-gray-400 text-center mt-2">Please rate your experience to continue</p>}
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <Check className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Report sent to your email!</h3>
              <p className="text-sm text-gray-500 mb-6">Check {email} for your AI Readiness Blueprint PDF.</p>
              {orgInterest === 'yes' && (
                <div className="bg-primary-50 border border-primary-100 rounded-xl p-4 mb-5">
                  <p className="text-sm text-primary-800">We&apos;ll reach out shortly about building an AI readiness assessment for your organization. Looking forward to it!</p>
                </div>
              )}
              <a href="/resources/calendar" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors">
                Book a free 15-min call <ArrowRight className="w-4 h-4" />
              </a>
              <div className="mt-4">
                <button onClick={handleReset} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Retake assessment</button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}
