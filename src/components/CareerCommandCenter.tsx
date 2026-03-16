'use client'

import { useState, useRef, useEffect } from 'react'

const CAREER_API_URL = process.env.NEXT_PUBLIC_CAREER_API_URL || 'https://ca-gennoor-career.kindbeach-fe39b6f0.centralindia.azurecontainerapps.io'

interface AgentStep {
  agent: string
  status: 'pending' | 'running' | 'complete'
  output?: string
}

interface PlanData {
  intent: string
  summary: string
  plan: { agent: string; order: number; task: string }[]
}

const AGENT_LABELS: Record<string, { label: string; icon: string }> = {
  profile_optimizer: { label: 'Profile Optimizer', icon: '👤' },
  career_strategist: { label: 'Career Strategist', icon: '🎯' },
  interview_coach: { label: 'Interview Coach', icon: '🎤' },
  content_generator: { label: 'Content Generator', icon: '✍️' },
  skill_navigator: { label: 'Skill Navigator', icon: '🧭' },
}

export default function CareerCommandCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [plan, setPlan] = useState<PlanData | null>(null)
  const [agentSteps, setAgentSteps] = useState<AgentStep[]>([])
  const [finalOutput, setFinalOutput] = useState('')
  const [error, setError] = useState('')
  const [showPulse, setShowPulse] = useState(true)
  const outputRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [agentSteps, finalOutput])

  // Hide pulse after first interaction
  useEffect(() => {
    const timer = setTimeout(() => setShowPulse(false), 15000)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async () => {
    if (!input.trim() || input.trim().length < 10) return

    setIsLoading(true)
    setError('')
    setPlan(null)
    setAgentSteps([])
    setFinalOutput('')

    try {
      const response = await fetch(`${CAREER_API_URL}/api/v1/orchestrate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_input: input }),
      })

      if (!response.ok) throw new Error(`API error: ${response.status}`)
      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
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
              const planData = data.data
              setPlan(planData)
              setAgentSteps(
                planData.plan.map((s: any) => ({
                  agent: s.agent,
                  status: 'pending' as const,
                }))
              )
            } else if (data.type === 'agent_progress') {
              setAgentSteps((prev) =>
                prev.map((s) =>
                  s.agent === data.agent ? { ...s, status: 'running' } : s
                )
              )
            } else if (data.type === 'agent_complete') {
              setAgentSteps((prev) =>
                prev.map((s) =>
                  s.agent === data.agent
                    ? { ...s, status: 'complete', output: data.final_output }
                    : s
                )
              )
              // Keep the latest agent's output as final
              if (data.final_output) {
                setFinalOutput(data.final_output)
              }
            } else if (data.type === 'error') {
              setError(data.message)
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Career Command Center')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setInput('')
    setPlan(null)
    setAgentSteps([])
    setFinalOutput('')
    setError('')
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setShowPulse(false) }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 px-5 py-3 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary-600/30"
        aria-label="Open Career Command Center"
      >
        {showPulse && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary-400 opacity-75" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-secondary-500" />
          </span>
        )}
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          )}
        </svg>
        <span className="text-sm font-semibold">
          {isOpen ? 'Close' : 'AI Career Coach'}
        </span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 flex h-[520px] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl sm:w-[420px]">
          {/* Header */}
          <div className="gradient-primary px-4 py-3 text-white">
            <h3 className="text-base font-bold">Career Command Center</h3>
            <p className="text-xs text-white/80">AI-powered career guidance by Gennoor Tech</p>
          </div>

          {/* Output Area */}
          <div ref={outputRef} className="flex-1 overflow-y-auto p-4 text-sm">
            {!plan && !error && !isLoading && (
              <div className="space-y-3 text-dark-500">
                <p className="font-medium text-dark-700">What can I help you with?</p>
                <div className="space-y-2">
                  {[
                    'Optimize my LinkedIn profile for a Product Manager role',
                    'Plan my career transition from developer to AI engineer',
                    'Prepare me for a senior data scientist interview at Google',
                    'Create a LinkedIn content strategy for thought leadership',
                    'Build a 12-week learning roadmap to become a cloud architect',
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => setInput(suggestion)}
                      className="block w-full rounded-lg border border-gray-200 px-3 py-2 text-left text-xs text-dark-600 transition-colors hover:border-primary-300 hover:bg-primary-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
                {error}
              </div>
            )}

            {plan && (
              <div className="space-y-3">
                <div className="rounded-lg bg-primary-50 p-3">
                  <p className="text-xs font-medium text-primary-800">{plan.summary}</p>
                </div>

                {/* Agent Progress */}
                <div className="space-y-2">
                  {agentSteps.map((step) => {
                    const info = AGENT_LABELS[step.agent] || { label: step.agent, icon: '🤖' }
                    return (
                      <div
                        key={step.agent}
                        className={`flex items-center gap-2 rounded-lg border p-2 text-xs transition-all ${
                          step.status === 'complete'
                            ? 'border-green-200 bg-green-50'
                            : step.status === 'running'
                            ? 'border-primary-200 bg-primary-50'
                            : 'border-gray-100 bg-gray-50'
                        }`}
                      >
                        <span>{info.icon}</span>
                        <span className="flex-1 font-medium">{info.label}</span>
                        {step.status === 'running' && (
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary-600 border-t-transparent" />
                        )}
                        {step.status === 'complete' && (
                          <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Final Output */}
                {finalOutput && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <p className="mb-1 text-xs font-semibold text-dark-700">Result</p>
                    <div className="prose prose-xs max-h-48 overflow-y-auto text-xs text-dark-600 whitespace-pre-wrap">
                      {finalOutput.length > 2000 ? finalOutput.slice(0, 2000) + '\n\n... [Full report available in detailed view]' : finalOutput}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-3">
            {plan && !isLoading && (
              <button
                onClick={handleReset}
                className="mb-2 w-full rounded-lg bg-gray-100 py-1.5 text-xs font-medium text-dark-600 transition-colors hover:bg-gray-200"
              >
                Start New Analysis
              </button>
            )}
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSubmit()
                  }
                }}
                placeholder="Paste your resume, LinkedIn URL, or describe your career goal..."
                className="flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-dark-700 placeholder-dark-400 outline-none transition-colors focus:border-primary-400 focus:ring-1 focus:ring-primary-400"
                rows={2}
                disabled={isLoading}
              />
              <button
                onClick={handleSubmit}
                disabled={isLoading || input.trim().length < 10}
                className="self-end rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-primary-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent inline-block" />
                ) : (
                  'Go'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
