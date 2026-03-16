'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'

const API = process.env.NEXT_PUBLIC_CAREER_API_URL || 'https://ca-gennoor-career.kindbeach-fe39b6f0.centralindia.azurecontainerapps.io'

// ── Agent Config ────────────────────────────────────────────────────────

interface Field { key: string; label: string; placeholder: string; type: string; rows?: number; required?: boolean }
interface AgentConfig { id: string; name: string; short: string; desc: string; icon: string; color: string; steps: string[]; fields: Field[] }

const AGENTS: Record<string, AgentConfig> = {
  profile_optimizer: {
    id: 'profile_optimizer',
    name: 'Profile Optimizer',
    short: 'Profile',
    desc: 'Audit & rewrite your LinkedIn profile for maximum impact',
    icon: '👤',
    color: 'teal',
    steps: ['Section Audit', 'Gap Analysis', 'AI Rewrite', 'Final Package'],
    fields: [
      { key: 'headline', label: 'LinkedIn Headline', placeholder: 'e.g., Senior Software Engineer | Cloud Architecture | Azure Expert', type: 'text', required: true },
      { key: 'about', label: 'About / Summary', placeholder: 'Paste your LinkedIn About section here...', type: 'textarea', rows: 4, required: true },
      { key: 'experience', label: 'Experience', placeholder: 'Paste your work experience (roles, companies, key achievements)...', type: 'textarea', rows: 5, required: true },
      { key: 'skills', label: 'Skills & Endorsements', placeholder: 'List your top skills (e.g., Python, Azure, Machine Learning)...', type: 'text', required: true },
      { key: 'target_role', label: 'Target Role', placeholder: 'What role are you targeting?', type: 'text' },
    ],
  },
  career_strategist: {
    id: 'career_strategist',
    name: 'Career Strategist',
    short: 'Career',
    desc: 'Skill gap analysis, target roles & 30-60-90 day action plan',
    icon: '🎯',
    color: 'blue',
    steps: ['Resume Parsing', 'Skill Gap Mapping', 'Target Roles', 'Action Plan'],
    fields: [
      { key: 'current_role', label: 'Current Role & Title', placeholder: 'e.g., Data Analyst at TCS, 3 years experience', type: 'text', required: true },
      { key: 'skills', label: 'Current Skills', placeholder: 'List your technical and soft skills...', type: 'textarea', rows: 3, required: true },
      { key: 'certifications', label: 'Certifications', placeholder: 'e.g., AWS Solutions Architect, PMP...', type: 'text' },
      { key: 'target_goal', label: 'Career Goal / Target Role', placeholder: 'Where do you want to be?', type: 'textarea', rows: 2, required: true },
      { key: 'achievements', label: 'Key Achievements', placeholder: 'Notable accomplishments or metrics...', type: 'textarea', rows: 3 },
    ],
  },
  interview_coach: {
    id: 'interview_coach',
    name: 'Interview Coach',
    short: 'Interview',
    desc: 'Mock interviews, tailored questions & performance scorecards',
    icon: '🎤',
    color: 'orange',
    steps: ['JD Analysis', 'Question Generation', 'Mock Interview', 'Scorecard'],
    fields: [
      { key: 'job_description', label: 'Job Description', placeholder: 'Paste the complete job description here...', type: 'textarea', rows: 5, required: true },
      { key: 'resume', label: 'Your Resume / Profile', placeholder: 'Paste your resume or key experience...', type: 'textarea', rows: 4, required: true },
      { key: 'company', label: 'Company Name', placeholder: 'e.g., Microsoft, Google...', type: 'text' },
      { key: 'interview_type', label: 'Interview Type', placeholder: 'e.g., Technical, Behavioral, System Design...', type: 'text' },
    ],
  },
  content_generator: {
    id: 'content_generator',
    name: 'Content Generator',
    short: 'Content',
    desc: 'LinkedIn posts, content pillars & 30-day publishing calendar',
    icon: '✍️',
    color: 'amber',
    steps: ['Audience Mapping', 'Content Pillars', 'Post Drafting', '30-Day Calendar'],
    fields: [
      { key: 'expertise', label: 'Your Expertise Area', placeholder: 'e.g., AI Consulting, Cloud Architecture...', type: 'text', required: true },
      { key: 'audience', label: 'Target Audience', placeholder: 'Who are you writing for?', type: 'textarea', rows: 2, required: true },
      { key: 'tone', label: 'Preferred Tone', placeholder: 'e.g., Professional, Conversational, Thought-leadership...', type: 'text' },
      { key: 'topics', label: 'Key Topics / Themes', placeholder: 'What topics do you want to cover?', type: 'textarea', rows: 3, required: true },
    ],
  },
  skill_navigator: {
    id: 'skill_navigator',
    name: 'Skill Navigator',
    short: 'Skills',
    desc: 'Learning paths, free resources & 12-week upskilling roadmap',
    icon: '🧭',
    color: 'pink',
    steps: ['Skill Inventory', 'Dream Role Fit', 'Resource Curation', '12-Week Plan'],
    fields: [
      { key: 'current_skills', label: 'Current Skills', placeholder: 'e.g., Python, SQL, basic ML, Power BI...', type: 'textarea', rows: 3, required: true },
      { key: 'dream_role', label: 'Dream Role', placeholder: 'e.g., Azure AI Solutions Architect...', type: 'text', required: true },
      { key: 'experience_level', label: 'Experience Level', placeholder: 'e.g., 2 years in data analytics, fresher in ML...', type: 'text', required: true },
      { key: 'time_commitment', label: 'Weekly Time Available', placeholder: 'e.g., 10 hours/week, weekends only...', type: 'text' },
    ],
  },
}

const COLORS: Record<string, { bg: string; border: string; text: string; light: string; bar: string }> = {
  teal:   { bg: 'bg-teal-50',   border: 'border-teal-200',   text: 'text-teal-700',   light: 'bg-teal-100',   bar: 'bg-teal-500' },
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-200',   text: 'text-blue-700',   light: 'bg-blue-100',   bar: 'bg-blue-500' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', light: 'bg-orange-100', bar: 'bg-orange-500' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-200',  text: 'text-amber-700',  light: 'bg-amber-100',  bar: 'bg-amber-500' },
  pink:   { bg: 'bg-pink-50',   border: 'border-pink-200',   text: 'text-pink-700',   light: 'bg-pink-100',   bar: 'bg-pink-500' },
}

// ── Document Extraction (LLM-powered) ───────────────────────────────────

function generateSessionId() {
  return `cs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

// ── Page Component ──────────────────────────────────────────────────────

export default function CareerCoachPage() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [fields, setFields] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'streaming' | 'complete' | 'error'>('idle')
  const [plan, setPlan] = useState<any>(null)
  const [agentProgress, setAgentProgress] = useState<Record<string, { currentStep: number; stepStatus: string }>>({})
  const [results, setResults] = useState<Record<string, string>>({})
  const [activeResultTab, setActiveResultTab] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Upload state
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file')
  const [isExtracting, setIsExtracting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [showAutoFillReview, setShowAutoFillReview] = useState(false)
  const [autoFilledKeys, setAutoFilledKeys] = useState<string[]>([])
  const [showLinkedInTip, setShowLinkedInTip] = useState(false)

  // Validation & review
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [showReviewModal, setShowReviewModal] = useState(false)

  // Session
  const [sessionId] = useState(generateSessionId)

  const agent = selectedAgent ? AGENTS[selectedAgent] : null
  const c = agent ? COLORS[agent.color] : null

  // Timer
  useEffect(() => {
    if (status === 'streaming') {
      const start = Date.now()
      timerRef.current = setInterval(() => setElapsed((Date.now() - start) / 1000), 100)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
  }, [status])

  // Scroll to results
  useEffect(() => {
    if (Object.keys(results).length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [Object.keys(results).length])

  // Save AI results to Azure when complete
  useEffect(() => {
    if (status === 'complete' && Object.keys(results).length > 0 && agent) {
      saveSessionToAzure('completed', results)
    }
  }, [status])

  const handleFieldChange = (key: string, value: string) => {
    setFields(p => ({ ...p, [key]: value }))
    setValidationErrors(prev => prev.filter(k => k !== key))
  }

  const buildInput = () => {
    if (!agent) return ''
    return agent.fields.filter(f => fields[f.key]?.trim()).map(f => `${f.label}:\n${fields[f.key].trim()}`).join('\n\n')
  }

  const getRequiredFields = () => agent ? agent.fields.filter(f => f.required) : []
  const getMissingRequired = () => getRequiredFields().filter(f => !fields[f.key]?.trim()).map(f => f.key)

  const reset = () => {
    setFields({})
    setStatus('idle')
    setPlan(null)
    setAgentProgress({})
    setResults({})
    setActiveResultTab(null)
    setError('')
    setElapsed(0)
    setUploadedFile(null)
    setUploadedFileName('')
    setUrlInput('')
    setUploadMode('file')
    setIsExtracting(false)
    setIsAnalyzing(false)
    setShowAutoFillReview(false)
    setShowLinkedInTip(false)
    setAutoFilledKeys([])
    setValidationErrors([])
    setShowReviewModal(false)
  }

  // ── Azure Storage ─────────────────────────────────────────────────────

  const saveSessionToAzure = async (sessionStatus: string, aiResults?: Record<string, string>) => {
    if (!agent) return
    try {
      const formData = new FormData()
      formData.append('sessionId', sessionId)
      formData.append('agentId', agent.id)
      formData.append('agentName', agent.name)
      formData.append('inputFields', JSON.stringify(fields))
      formData.append('aiResults', JSON.stringify(aiResults || {}))
      formData.append('status', sessionStatus)
      if (uploadedFile) {
        formData.append('resume', uploadedFile)
      }

      await fetch('/api/career-session', { method: 'POST', body: formData })
    } catch (err) {
      console.error('Failed to save session:', err)
    }
  }

  // ── Document Upload ───────────────────────────────────────────────────

  const handleFileUpload = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'txt'].includes(ext || '')) {
      setError('Please upload a PDF or TXT file.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB.')
      return
    }

    setIsExtracting(true)
    setIsAnalyzing(false)
    setError('')
    setUploadedFileName(file.name)
    setUploadedFile(file)

    try {
      // Step 1: Extract raw text from file
      let text = ''
      if (ext === 'txt') {
        text = await file.text()
      } else {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/extract-text', { method: 'POST', body: formData })
        const raw = await res.text()
        let data: any
        try {
          data = JSON.parse(raw)
        } catch {
          throw new Error('Server returned an invalid response. Try a smaller file or paste text manually.')
        }
        if (!res.ok) throw new Error(data.error || 'Extraction failed')
        if (!data.text?.trim()) throw new Error('No text could be extracted. Try pasting text directly.')
        text = data.text
      }

      // Step 2: Send to LLM for intelligent field extraction
      setIsExtracting(false)
      setIsAnalyzing(true)

      if (!selectedAgent || !agent || !text.trim()) {
        throw new Error('No agent selected or empty text.')
      }

      const fieldDefs = agent.fields.map(f => ({
        key: f.key,
        label: f.label,
        required: !!f.required,
        type: f.type,
      }))

      const extractRes = await fetch('/api/extract-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, fields: fieldDefs, agentName: agent.name }),
      })

      const extractRaw = await extractRes.text()
      let extractData: any
      try {
        extractData = JSON.parse(extractRaw)
      } catch {
        throw new Error('AI returned an invalid response. Please try again or fill the form manually.')
      }
      if (!extractRes.ok) throw new Error(extractData.error || 'AI extraction failed')

      const filled: Record<string, string> = extractData.fields || {}
      const filledKeys = Object.keys(filled)

      if (filledKeys.length === 0) {
        // Fallback: put raw text in the first textarea field
        const firstTextarea = agent.fields.find(f => f.type === 'textarea')
        if (firstTextarea) {
          setFields(prev => ({ ...prev, [firstTextarea.key]: text.slice(0, 4000) }))
          setAutoFilledKeys([firstTextarea.key])
        }
      } else {
        setFields(prev => ({ ...prev, ...filled }))
        setAutoFilledKeys(filledKeys)
      }
      setShowAutoFillReview(true)
    } catch (err: any) {
      setError(err.message || 'Failed to extract text from document')
      setUploadedFileName('')
      setUploadedFile(null)
    } finally {
      setIsExtracting(false)
      setIsAnalyzing(false)
    }
  }

  const handleUrlExtract = async () => {
    const url = urlInput.trim()
    if (!url) { setError('Please enter a URL.'); return }
    try { new URL(url) } catch { setError('Please enter a valid URL (e.g., https://github.com/username).'); return }

    if (/linkedin\.com/i.test(url)) {
      setError('LinkedIn blocks direct scraping. Please export your LinkedIn profile as PDF and upload it instead.')
      setShowLinkedInTip(true)
      return
    }

    setIsExtracting(true)
    setIsAnalyzing(false)
    setError('')
    setUploadedFileName(url)

    try {
      const res = await fetch('/api/extract-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const raw = await res.text()
      let data: any
      try { data = JSON.parse(raw) } catch { throw new Error('Server returned an invalid response.') }
      if (!res.ok) throw new Error(data.error || 'URL extraction failed')
      if (!data.text?.trim()) throw new Error('No text could be extracted from this URL.')

      // Send extracted text to LLM
      setIsExtracting(false)
      setIsAnalyzing(true)

      if (!selectedAgent || !agent) throw new Error('No agent selected.')

      const fieldDefs = agent.fields.map(f => ({
        key: f.key, label: f.label, required: !!f.required, type: f.type,
      }))

      const extractRes = await fetch('/api/extract-fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: data.text, fields: fieldDefs, agentName: agent.name }),
      })
      const extractRaw = await extractRes.text()
      let extractData: any
      try { extractData = JSON.parse(extractRaw) } catch { throw new Error('AI returned an invalid response.') }
      if (!extractRes.ok) throw new Error(extractData.error || 'AI extraction failed')

      const filled: Record<string, string> = extractData.fields || {}
      const filledKeys = Object.keys(filled)

      if (filledKeys.length === 0) {
        const firstTextarea = agent.fields.find(f => f.type === 'textarea')
        if (firstTextarea) {
          setFields(prev => ({ ...prev, [firstTextarea.key]: data.text.slice(0, 4000) }))
          setAutoFilledKeys([firstTextarea.key])
        }
      } else {
        setFields(prev => ({ ...prev, ...filled }))
        setAutoFilledKeys(filledKeys)
      }
      setShowAutoFillReview(true)
    } catch (err: any) {
      setError(err.message || 'Failed to extract from URL')
      setUploadedFileName('')
    } finally {
      setIsExtracting(false)
      setIsAnalyzing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  // ── Submit Flow ───────────────────────────────────────────────────────

  const trySubmit = () => {
    const missing = getMissingRequired()
    if (missing.length > 0) {
      setValidationErrors(missing)
      const el = document.getElementById(`field-${missing[0]}`)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setShowReviewModal(true)
  }

  const confirmSubmit = useCallback(async () => {
    setShowReviewModal(false)
    const input = buildInput()
    if (!input.trim() || status === 'streaming') return

    // Save inputs to Azure before running
    saveSessionToAzure('submitted')

    setStatus('streaming')
    setError('')
    setPlan(null)
    setAgentProgress({})
    setResults({})
    setActiveResultTab(null)

    try {
      const res = await fetch(`${API}/api/v1/orchestrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: input }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)
      if (!res.body) throw new Error('No response stream')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))

            if (data.type === 'plan') {
              setPlan(data.data)
            } else if (data.type === 'agent_progress') {
              setAgentProgress(prev => ({
                ...prev,
                [data.agent]: {
                  ...prev[data.agent],
                  currentStep: data.step || (prev[data.agent]?.currentStep || 0),
                  stepStatus: data.status,
                },
              }))
            } else if (data.type === 'agent_complete') {
              setAgentProgress(prev => ({
                ...prev,
                [data.agent]: { ...prev[data.agent], stepStatus: 'complete', currentStep: 99 },
              }))
              if (data.final_output) {
                setResults(prev => ({ ...prev, [data.agent]: data.final_output }))
                setActiveResultTab(prev => prev || data.agent)
              }
            } else if (data.type === 'complete') {
              setStatus('complete')
            } else if (data.type === 'error') {
              setError(data.message)
              setStatus('error')
            }
          } catch { /* skip */ }
        }
      }
      setStatus(prev => prev === 'streaming' ? 'complete' : prev)
    } catch (err: any) {
      setError(err.message)
      setStatus('error')
    }
  }, [fields, agent, status, sessionId, uploadedFile])

  const handleCopy = async () => {
    if (!activeResultTab || !results[activeResultTab]) return
    await navigator.clipboard.writeText(results[activeResultTab])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fmt = (s: number) => s < 60 ? `${s.toFixed(1)}s` : `${Math.floor(s / 60)}m ${(s % 60).toFixed(0)}s`

  // ── Agent Selector ──────────────────────────────────────────────────

  if (!selectedAgent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 mb-4">
              Powered by LangGraph + GPT-4o
            </div>
            <h1 className="text-4xl font-bold text-dark-800 mb-3">Career Command Center</h1>
            <p className="text-lg text-dark-500 max-w-2xl mx-auto">
              5 AI agents working together to transform your career. Choose an agent below or let the orchestrator chain the right ones for your goal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {Object.values(AGENTS).map(a => {
              const ac = COLORS[a.color]
              return (
                <button
                  key={a.id}
                  onClick={() => { setSelectedAgent(a.id); reset() }}
                  className={`group text-left rounded-xl border-2 ${ac.border} ${ac.bg} p-6 transition-all hover:shadow-lg hover:scale-[1.02]`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{a.icon}</span>
                    <h3 className={`text-lg font-bold ${ac.text}`}>{a.name}</h3>
                  </div>
                  <p className="text-sm text-dark-500 mb-4">{a.desc}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {a.steps.map(s => (
                      <span key={s} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ac.light} ${ac.text}`}>{s}</span>
                    ))}
                  </div>
                </button>
              )
            })}

            <button
              onClick={() => { setSelectedAgent('career_strategist'); reset() }}
              className="text-left rounded-xl border-2 border-primary-300 bg-gradient-to-br from-primary-50 to-accent-50 p-6 transition-all hover:shadow-lg hover:scale-[1.02] md:col-span-2 lg:col-span-1"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">⚡</span>
                <h3 className="text-lg font-bold text-primary-700">Full Career Package</h3>
              </div>
              <p className="text-sm text-dark-500 mb-4">
                The AI orchestrator analyzes your input and chains multiple agents together for a comprehensive career transformation plan.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['Auto-detect Intent', 'Chain Agents', 'Cross-reference Results'].map(s => (
                  <span key={s} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">{s}</span>
                ))}
              </div>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Workspace ───────────────────────────────────────────────────────

  const activeAgents = plan?.plan?.map((s: any) => s.agent) || [selectedAgent]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => { setSelectedAgent(null); reset() }} className="rounded-lg border border-gray-200 p-2 text-dark-500 hover:bg-gray-100 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{agent!.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-dark-800">{agent!.name}</h2>
              <p className="text-sm text-dark-400">{agent!.desc}</p>
            </div>
          </div>
          {status === 'streaming' && (
            <span className="ml-auto text-sm font-mono text-dark-400 tabular-nums">{fmt(elapsed)}</span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Upload + Input + Results */}
          <div className="lg:col-span-2 space-y-6">

            {/* Step 1: Document Upload / URL */}
            {status === 'idle' && !showAutoFillReview && (
              <div className="rounded-xl border-2 border-dashed border-gray-300 bg-white overflow-hidden transition-colors">
                {/* Mode Tabs */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                  <button
                    onClick={() => setUploadMode('file')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors ${uploadMode === 'file' ? 'text-primary-700 bg-white border-b-2 border-primary-500' : 'text-dark-400 hover:text-dark-600'}`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    Upload File
                  </button>
                  <button
                    onClick={() => setUploadMode('url')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold transition-colors ${uploadMode === 'url' ? 'text-primary-700 bg-white border-b-2 border-primary-500' : 'text-dark-400 hover:text-dark-600'}`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    Paste URL
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt"
                  className="hidden"
                  onChange={e => { if (e.target.files?.[0]) handleFileUpload(e.target.files[0]) }}
                />

                {/* Loading State */}
                {(isExtracting || isAnalyzing) ? (
                  <div className="flex flex-col items-center gap-3 py-8">
                    <span className="h-8 w-8 animate-spin rounded-full border-3 border-primary-600 border-t-transparent" />
                    <p className="text-sm font-medium text-dark-600">
                      {isAnalyzing ? '🤖 AI is analyzing your document and filling fields...' : `Extracting text from ${uploadedFileName}...`}
                    </p>
                    {isAnalyzing && <p className="text-xs text-dark-400">This may take a few seconds</p>}
                  </div>

                /* Success State */
                ) : uploadedFileName && !urlInput ? (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <div className="flex items-center gap-2 text-green-700">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm font-semibold">{uploadedFileName} — extracted successfully</span>
                    </div>
                    <button onClick={() => fileInputRef.current?.click()} className="text-xs text-primary-600 hover:underline">Upload a different file</button>
                  </div>

                /* File Upload Mode */
                ) : uploadMode === 'file' ? (
                  <div
                    onDragOver={e => e.preventDefault()}
                    onDrop={handleDrop}
                    className="flex flex-col items-center gap-3 py-6 px-4 hover:bg-primary-50/30 transition-colors"
                  >
                    <div className="rounded-full bg-primary-100 p-3">
                      <svg className="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-dark-700">
                        {selectedAgent === 'profile_optimizer' ? 'Upload your LinkedIn Profile PDF' : 'Upload your resume or document'}
                      </p>
                      <p className="text-xs text-dark-400 mt-1">
                        {selectedAgent === 'profile_optimizer'
                          ? 'LinkedIn PDF recommended for best results'
                          : 'PDF or TXT — AI will auto-fill the form for you'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
                      >
                        Choose File
                      </button>
                      {selectedAgent === 'profile_optimizer' && (
                        <button
                          onClick={() => setShowLinkedInTip(true)}
                          className="relative rounded-full w-7 h-7 flex items-center justify-center bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors text-xs font-bold"
                          title="How to export LinkedIn PDF"
                        >
                          i
                        </button>
                      )}
                    </div>
                    <p className="text-[10px] text-dark-300">or drag & drop here • skip to fill manually</p>
                  </div>

                /* URL Mode */
                ) : (
                  <div className="flex flex-col gap-4 py-6 px-6">
                    <div className="text-center">
                      <p className="text-sm font-semibold text-dark-700">Paste a URL to extract information</p>
                      <p className="text-xs text-dark-400 mt-1">Works with GitHub profiles, portfolios, job postings & more</p>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={e => setUrlInput(e.target.value)}
                        placeholder="https://github.com/username or https://..."
                        className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-dark-700 placeholder-dark-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none"
                        onKeyDown={e => { if (e.key === 'Enter') handleUrlExtract() }}
                      />
                      <button
                        onClick={handleUrlExtract}
                        className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors whitespace-nowrap"
                      >
                        Extract
                      </button>
                    </div>
                    <div className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 p-3">
                      <svg className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                      <p className="text-xs text-amber-700">
                        <span className="font-semibold">LinkedIn URLs won't work</span> — LinkedIn blocks automated access. Use LinkedIn's built-in "Save to PDF" feature instead.
                        {' '}<button onClick={() => setShowLinkedInTip(true)} className="text-amber-800 underline font-semibold hover:text-amber-900">See how</button>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Input Form */}
            {!showAutoFillReview && (
              <div className={`rounded-xl border ${c!.border} ${c!.bg} p-6`}>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-sm font-semibold text-dark-600">Fill in your details</h3>
                  <span className="text-[10px] text-dark-400">(<span className="text-red-500">*</span> = required)</span>
                </div>
                <div className="space-y-4">
                  {agent!.fields.map(field => {
                    const hasError = validationErrors.includes(field.key)
                    const wasAutoFilled = autoFilledKeys.includes(field.key)
                    return (
                      <div key={field.key} id={`field-${field.key}`}>
                        <label className="block text-sm font-medium text-dark-600 mb-1.5">
                          {field.label}
                          {field.required && <span className="text-red-500 ml-0.5">*</span>}
                          {wasAutoFilled && fields[field.key]?.trim() && (
                            <span className="ml-2 text-[10px] font-normal text-green-600 bg-green-50 px-1.5 py-0.5 rounded">auto-filled</span>
                          )}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            value={fields[field.key] || ''}
                            onChange={e => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            rows={field.rows || 3}
                            className={`w-full rounded-lg border ${hasError ? 'border-red-400 ring-1 ring-red-300 bg-red-50' : 'border-gray-300 bg-white'} px-3 py-2 text-sm text-dark-700 placeholder-dark-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none resize-none transition-all`}
                            disabled={status === 'streaming'}
                          />
                        ) : (
                          <input
                            type="text"
                            value={fields[field.key] || ''}
                            onChange={e => handleFieldChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className={`w-full rounded-lg border ${hasError ? 'border-red-400 ring-1 ring-red-300 bg-red-50' : 'border-gray-300 bg-white'} px-3 py-2 text-sm text-dark-700 placeholder-dark-300 focus:border-primary-400 focus:ring-1 focus:ring-primary-400 outline-none transition-all`}
                            disabled={status === 'streaming'}
                          />
                        )}
                        {hasError && (
                          <p className="text-xs text-red-500 mt-1">This field is required</p>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                  <span className="text-xs text-dark-400">
                    {Object.values(fields).reduce((s, v) => s + (v?.length || 0), 0)} characters
                  </span>
                  <div className="flex items-center gap-3">
                    {(status === 'complete' || status === 'error') && (
                      <button onClick={reset} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-dark-600 hover:bg-gray-100 transition-colors">
                        Reset
                      </button>
                    )}
                    <button
                      onClick={trySubmit}
                      disabled={status === 'streaming'}
                      className="rounded-lg bg-primary-600 px-6 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      {status === 'streaming' ? (
                        <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Processing...</>
                      ) : (
                        <><svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Run Agent</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700"><span className="font-semibold">Error:</span> {error}</p>
              </div>
            )}

            {/* Execution Plan */}
            {plan && (
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
                <h4 className="text-sm font-semibold text-primary-700 mb-2">Execution Plan</h4>
                <p className="text-xs text-dark-500 mb-3">{plan.summary}</p>
                <div className="flex flex-wrap gap-2">
                  {(plan.plan || []).map((step: any, i: number) => {
                    const a = AGENTS[step.agent]
                    if (!a) return null
                    const ac = COLORS[a.color]
                    return (
                      <span key={i} className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${ac.light} ${ac.text}`}>
                        <span className="opacity-60">{step.order}.</span> {a.icon} {a.short}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Results */}
            {Object.keys(results).length > 0 && (
              <>
                {expanded && <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setExpanded(false)} />}
                <div ref={resultsRef} className={`rounded-xl border border-gray-200 shadow-sm overflow-hidden ${expanded ? 'fixed inset-4 z-50 bg-white flex flex-col' : 'bg-white'}`}>

                  {Object.keys(results).length > 1 && (
                    <div className="flex items-center gap-1 px-4 pt-3 border-b border-gray-100 overflow-x-auto bg-white">
                      {Object.keys(results).map(id => {
                        const a = AGENTS[id]
                        if (!a) return null
                        const ac = COLORS[a.color]
                        const isActive = activeResultTab === id
                        return (
                          <button key={id} onClick={() => setActiveResultTab(id)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all ${isActive ? `${ac.light} ${ac.text} border-b-2 ${ac.border}` : 'text-dark-400 hover:text-dark-600 hover:bg-gray-50'}`}>
                            {a.icon} {a.short}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-white">
                    <h3 className="text-sm font-semibold text-dark-700">
                      {AGENTS[activeResultTab || '']?.name || 'Agent'} Results
                    </h3>
                    <div className="flex items-center gap-2">
                      <button onClick={handleCopy} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-dark-500 hover:bg-gray-50 transition-colors">
                        {copied ? '✓ Copied!' : 'Copy'}
                      </button>
                      <button onClick={() => setExpanded(!expanded)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-dark-500 hover:bg-gray-50 transition-colors">
                        {expanded ? 'Exit Fullscreen' : 'Expand'}
                      </button>
                    </div>
                  </div>

                  <div className={`p-5 bg-white ${expanded ? 'flex-1 overflow-y-auto' : 'max-h-[70vh] overflow-y-auto'}`}>
                    <div className="prose prose-sm max-w-none prose-headings:text-dark-800 prose-p:text-dark-600 prose-li:text-dark-600 prose-strong:text-dark-700 prose-a:text-primary-600">
                      <ReactMarkdown>{results[activeResultTab || ''] || 'No results yet.'}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: Agent Progress Panels */}
          <div className="space-y-4">
            {activeAgents.map((id: string) => {
              const a = AGENTS[id]
              if (!a) return null
              const ac = COLORS[a.color]
              const prog = agentProgress[id]
              const isAllDone = prog?.stepStatus === 'complete'
              const isRunning = prog?.stepStatus === 'running'

              return (
                <div key={id} className={`rounded-xl border ${ac.border} overflow-hidden bg-white shadow-sm`}>
                  <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{a.icon}</span>
                      <div>
                        <h4 className="text-sm font-semibold text-dark-700">{a.name}</h4>
                        <p className="text-[10px] text-dark-400 font-mono">
                          {isAllDone ? `completed in ${fmt(elapsed)}` : isRunning ? 'running...' : 'pending'}
                        </p>
                      </div>
                    </div>
                    {isAllDone && <span className="text-xs text-green-600 font-medium">Done</span>}
                    {isRunning && <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />}
                  </div>

                  <div className="divide-y divide-gray-50">
                    {a.steps.map((stepName, idx) => {
                      const stepNum = idx + 1
                      const isDone = isAllDone || (prog && prog.currentStep > stepNum)
                      const isActive = isRunning && prog?.currentStep === stepNum

                      return (
                        <div key={idx} className={`flex items-center gap-3 px-4 py-2.5 ${isActive ? 'bg-primary-50/50' : ''}`}>
                          <div className="w-5 flex items-center justify-center">
                            {isDone ? (
                              <div className={`w-4 h-4 rounded-full ${ac.bar} flex items-center justify-center`}>
                                <svg className="h-2.5 w-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </div>
                            ) : isActive ? (
                              <span className={`h-3.5 w-3.5 animate-spin rounded-full border-2 ${ac.border} border-t-transparent`} />
                            ) : (
                              <div className="w-3 h-3 rounded-full border border-gray-200 bg-gray-50" />
                            )}
                          </div>
                          <span className={`text-xs ${isDone ? 'text-dark-600' : isActive ? 'text-dark-800 font-medium' : 'text-dark-300'}`}>
                            {stepName}
                          </span>
                          {isActive && <span className={`ml-auto text-[10px] ${ac.text} font-medium`}>running</span>}
                        </div>
                      )
                    })}
                  </div>

                  <div className="px-4 py-2 border-t border-gray-100">
                    <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${isAllDone ? 'bg-green-500' : ac.bar}`}
                        style={{ width: `${isAllDone ? 100 : isRunning ? Math.max(25, ((prog?.currentStep || 1) / a.steps.length) * 100 - 15) : 0}%` }} />
                    </div>
                  </div>
                </div>
              )
            })}

            {status === 'idle' && (
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h4 className="text-xs font-semibold text-dark-400 uppercase tracking-wider mb-3">Tips for best results</h4>
                <ul className="space-y-2 text-xs text-dark-500">
                  {['Upload your resume to auto-fill fields instantly', 'Fill in all required fields marked with *', 'Include specific skills, years of experience, and metrics', 'Be specific about your target role or career goal'].map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${c!.bar} mt-1.5 flex-shrink-0`} />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Auto-Fill Review Popup */}
      {showAutoFillReview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-green-50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-green-100 p-2">
                  <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <h3 className="text-base font-bold text-green-800">Document Processed Successfully</h3>
                  <p className="text-xs text-green-600">{autoFilledKeys.length} field{autoFilledKeys.length !== 1 ? 's' : ''} auto-filled from your document</p>
                </div>
              </div>
              <button
                onClick={() => setShowAutoFillReview(false)}
                className="rounded-full p-1.5 text-green-500 hover:bg-green-100 transition-colors"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="px-6 py-4 max-h-[50vh] overflow-y-auto space-y-3">
              {agent!.fields.map(field => {
                const val = fields[field.key]?.trim()
                const wasFilled = autoFilledKeys.includes(field.key)
                const isMissing = field.required && !val
                return (
                  <div key={field.key} className={`rounded-lg p-3 ${isMissing ? 'bg-red-50 border border-red-200' : wasFilled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-dark-600">
                        {field.label}
                        {field.required && <span className="text-red-500 ml-0.5">*</span>}
                      </p>
                      {wasFilled && val && <span className="text-[10px] text-green-600 font-medium">auto-filled</span>}
                      {isMissing && <span className="text-[10px] text-red-600 font-medium">needs input</span>}
                      {!wasFilled && !isMissing && !val && <span className="text-[10px] text-dark-400">optional</span>}
                    </div>
                    {val ? (
                      <p className="text-xs text-dark-600 line-clamp-3 whitespace-pre-wrap">{val}</p>
                    ) : (
                      <p className="text-xs text-dark-300 italic">{isMissing ? 'Required — please fill manually' : 'Empty (optional)'}</p>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              {getMissingRequired().length > 0 && (
                <p className="text-xs text-amber-700 mb-3 font-medium">
                  {getMissingRequired().length} required field{getMissingRequired().length !== 1 ? 's' : ''} still need your input. Please review and complete the form.
                </p>
              )}
              <button
                onClick={() => setShowAutoFillReview(false)}
                className="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 transition-colors"
              >
                Review & Complete Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Before Submit Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowReviewModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-dark-800">Review before submitting</h3>
              <button onClick={() => setShowReviewModal(false)} className="rounded-full p-1.5 text-dark-400 hover:bg-gray-100 transition-colors">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="px-6 py-4 max-h-[60vh] overflow-y-auto space-y-3">
              {agent!.fields.map(field => {
                const val = fields[field.key]?.trim()
                if (!val) return null
                return (
                  <div key={field.key}>
                    <p className="text-xs font-semibold text-dark-500">{field.label}</p>
                    <p className="text-sm text-dark-700 mt-0.5 whitespace-pre-wrap line-clamp-4">{val}</p>
                  </div>
                )
              })}
            </div>
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-xs text-dark-400">Please confirm your inputs are correct</p>
              <div className="flex items-center gap-3">
                <button onClick={() => setShowReviewModal(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-dark-600 hover:bg-gray-100 transition-colors">
                  Edit
                </button>
                <button onClick={confirmSubmit} className="rounded-lg bg-primary-600 px-5 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition-colors flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  Confirm & Run
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LinkedIn PDF Export Tip Modal */}
      {showLinkedInTip && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowLinkedInTip(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-slideUp">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-blue-50">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-blue-100 p-2">
                  <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </div>
                <h3 className="text-base font-bold text-blue-800">How to Export LinkedIn Profile as PDF</h3>
              </div>
              <button
                onClick={() => setShowLinkedInTip(false)}
                className="rounded-full p-1.5 text-blue-500 hover:bg-blue-100 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">1</span>
                <p className="text-sm text-dark-600">Go to <span className="font-semibold">linkedin.com</span> and open <span className="font-semibold">your profile page</span></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">2</span>
                <p className="text-sm text-dark-600">Click the <span className="font-semibold">"More"</span> button (three dots <span className="font-mono bg-gray-100 px-1 rounded">...</span>) below your profile photo</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">3</span>
                <p className="text-sm text-dark-600">Select <span className="font-semibold">"Save to PDF"</span> from the dropdown menu</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">4</span>
                <p className="text-sm text-dark-600">A PDF of your full profile will download — <span className="font-semibold">upload it here</span> and our AI will extract all your information</p>
              </div>

              <div className="rounded-lg bg-green-50 border border-green-200 p-3 mt-2">
                <p className="text-xs text-green-700">
                  <span className="font-semibold">Why LinkedIn PDF?</span> It contains your complete profile — headline, about, experience, skills, education, certifications — all in a structured format that our AI can read perfectly.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => { setShowLinkedInTip(false); setUploadMode('file'); fileInputRef.current?.click() }}
                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Got it — Upload LinkedIn PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
