'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Bot, Send, X, Sparkles, RefreshCw,
  Building2, User, Globe, Mail, Phone,
  Linkedin, Target, TrendingUp, FileText,
  CheckCircle, AlertCircle, Info, Edit2,
  Save, Copy, Download, MessageCircle,
  ChevronDown, ChevronUp
} from 'lucide-react'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    leadId?: string
    action?: string
    updates?: any
  }
}

interface ResearchResult {
  company: string
  website?: string
  employees?: string
  revenue?: string
  industry?: string
  technologies?: string[]
  painPoints?: string[]
  opportunities?: string[]
  keyContacts?: {
    name: string
    role: string
    linkedin?: string
    email?: string
  }[]
  recentNews?: string[]
  fundingInfo?: string
  competitors?: string[]
}

export default function LeadsAIPanel() {
  const [isExpanded, setIsExpanded] = useState(true)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Research Assistant powered by Foundry. I can help you research companies, find contacts, draft personalized emails, and suggest strategies. How can I assist you today?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedLead, setSelectedLead] = useState<any>(null)
  const [showEmailDraft, setShowEmailDraft] = useState(false)
  const [emailDraft, setEmailDraft] = useState('')
  const [researchResults, setResearchResults] = useState<ResearchResult | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { label: 'Research Company', icon: Building2, action: 'research' },
    { label: 'Find Contacts', icon: User, action: 'contacts' },
    { label: 'Draft Email', icon: Mail, action: 'email' },
    { label: 'Suggest Strategy', icon: Target, action: 'strategy' },
  ]

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsProcessing(true)

    try {
      // Call Foundry AI API
      const response = await fetch('/api/admin/leads/foundry-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: inputValue,
          context: {
            selectedLead,
            previousMessages: messages.slice(-5)
          }
        })
      })

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        metadata: data.metadata
      }

      setMessages(prev => [...prev, assistantMessage])

      // Handle specific actions
      if (data.researchResult) {
        setResearchResults(data.researchResult)
      }
      if (data.emailDraft) {
        setEmailDraft(data.emailDraft)
        setShowEmailDraft(true)
      }
    } catch (error) {
      console.error('Error processing message:', error)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      }])
    } finally {
      setIsProcessing(false)
    }
  }

  const handleQuickAction = (action: string) => {
    const prompts: Record<string, string> = {
      research: 'Research the selected company and provide insights on their business, technology stack, and potential opportunities.',
      contacts: 'Find key decision makers and their contact information for the selected company.',
      email: 'Draft a personalized outreach email offering our AI & Cloud training services, including a free webinar offer.',
      strategy: 'Suggest the best approach to engage with this lead based on their company profile and industry.'
    }

    setInputValue(prompts[action] || '')
    handleSendMessage()
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Show toast notification
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-240px)]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">Foundry AI Assistant</h3>
              <p className="text-xs text-gray-500">Powered by Advanced Research AI</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/50 rounded transition-colors"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-600" /> : <ChevronUp className="w-4 h-4 text-gray-600" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Quick Actions */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => {
                const Icon = action.icon
                return (
                  <button
                    key={action.action}
                    onClick={() => handleQuickAction(action.action)}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 hover:text-purple-700 transition-all flex items-center gap-1.5"
                  >
                    <Icon className="w-3 h-3" />
                    {action.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-gray-50/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                } rounded-xl px-4 py-3 shadow-sm`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-purple-100' : 'text-gray-400'
                  }`}>
                    {format(message.timestamp, 'h:mm a')}
                  </p>
                </div>
              </div>
            ))}

            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                    <span className="text-sm text-gray-600">Researching with Foundry AI...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Research Results Card */}
            {researchResults && (
              <div className="bg-white border border-purple-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Research Results: {researchResults.company}
                  </h4>
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(researchResults, null, 2))}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3 text-sm">
                  {researchResults.industry && (
                    <div>
                      <span className="font-medium text-gray-700">Industry:</span>
                      <span className="ml-2 text-gray-600">{researchResults.industry}</span>
                    </div>
                  )}

                  {researchResults.employees && (
                    <div>
                      <span className="font-medium text-gray-700">Company Size:</span>
                      <span className="ml-2 text-gray-600">{researchResults.employees} employees</span>
                    </div>
                  )}

                  {researchResults.technologies && researchResults.technologies.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Technologies:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {researchResults.technologies.map((tech, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {researchResults.opportunities && researchResults.opportunities.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Opportunities:</span>
                      <ul className="mt-1 space-y-1">
                        {researchResults.opportunities.map((opp, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-600">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-0.5" />
                            <span className="text-xs">{opp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {researchResults.keyContacts && researchResults.keyContacts.length > 0 && (
                    <div>
                      <span className="font-medium text-gray-700">Key Contacts:</span>
                      <div className="mt-1 space-y-2">
                        {researchResults.keyContacts.map((contact, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                            <User className="w-3 h-3 text-gray-400" />
                            <span className="font-medium">{contact.name}</span>
                            <span className="text-gray-400">•</span>
                            <span>{contact.role}</span>
                            {contact.linkedin && (
                              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                                <Linkedin className="w-3 h-3 text-blue-600" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                    Save to Lead
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    Generate Email
                  </button>
                </div>
              </div>
            )}

            {/* Email Draft Card */}
            {showEmailDraft && emailDraft && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-600" />
                    Email Draft
                  </h4>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setShowEmailDraft(false)}
                      className="p-1 hover:bg-white/50 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-3 mb-3">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans">{emailDraft}</pre>
                </div>

                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1">
                    <Send className="w-3 h-3" />
                    Send Now
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1">
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => copyToClipboard(emailDraft)}
                    className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="px-4 py-3 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="Ask about companies, contacts, or strategies..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                disabled={isProcessing}
              />
              <button
                onClick={handleSendMessage}
                disabled={isProcessing || !inputValue.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isProcessing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Info className="w-3 h-3" />
                <span>Powered by Foundry Agent</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Auto-saves research</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function format(date: Date, formatStr: string): string {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  const formattedHours = hours % 12 || 12
  const formattedMinutes = minutes.toString().padStart(2, '0')
  return `${formattedHours}:${formattedMinutes} ${ampm}`
}