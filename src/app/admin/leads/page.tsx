'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Search, Filter, Mail, Calendar, Phone, Globe, Linkedin,
  MessageCircle, FileText, Eye, Edit2, Save, Send,
  RefreshCw, ChevronRight, X, Check, AlertCircle,
  Building2, MapPin, Users, Briefcase, TrendingUp,
  Bot, Sparkles, Clock, Star, Archive, Trash2,
  ChevronDown, ExternalLink, Download, Upload,
  Video, BookOpen, GraduationCap, Target, Zap,
  CheckCircle2, XCircle, Info, MoreVertical,
  Activity, BarChart3, PieChart, Settings
} from 'lucide-react'
import { format } from 'date-fns'

// Types
interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company: string
  designation?: string
  industry?: string
  location?: string
  website?: string
  linkedin?: string
  source: string
  status: 'new' | 'researched' | 'contacted' | 'replied' | 'meeting' | 'proposal' | 'won' | 'lost'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  tags: string[]
  notes?: string
  lastContact?: Date
  nextFollowUp?: Date
  createdAt: Date
  updatedAt: Date
  assignedTo?: string
  conversations?: Conversation[]
  researchData?: ResearchData
  score?: number
}

interface Conversation {
  id: string
  type: 'email' | 'call' | 'meeting' | 'note'
  direction: 'inbound' | 'outbound'
  subject?: string
  content: string
  attachments?: string[]
  timestamp: Date
  from: string
  to: string[]
  cc?: string[]
}

interface ResearchData {
  companySize?: string
  revenue?: string
  technologies?: string[]
  recentNews?: string[]
  painPoints?: string[]
  opportunities?: string[]
  competitors?: string[]
  keyPeople?: { name: string; role: string; linkedin?: string }[]
  lastUpdated: Date
}

interface EmailTemplate {
  subject: string
  body: string
  attachments?: string[]
}

export default function LeadsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban'>('list')
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [chatInput, setChatInput] = useState('')
  const [isResearching, setIsResearching] = useState(false)
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [emailDraft, setEmailDraft] = useState<EmailTemplate>({ subject: '', body: '' })
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auth check
  useEffect(() => {
    if (status === 'loading') return
    if (!session || !['admin@gennoor.com', 'yusufchaudhary@gennoor.com', 'jalalkhan@gennoor.com'].includes(session.user?.email || '')) {
      router.push('/admin/login')
    }
  }, [session, status, router])

  // Load leads
  useEffect(() => {
    fetchLeads()
  }, [])

  // Filter leads
  useEffect(() => {
    let filtered = [...leads]

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(lead => lead.priority === priorityFilter)
    }

    if (assigneeFilter !== 'all') {
      filtered = filtered.filter(lead => lead.assignedTo === assigneeFilter)
    }

    setFilteredLeads(filtered)
  }, [leads, searchTerm, statusFilter, priorityFilter, assigneeFilter])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads')
      const data = await res.json()
      setLeads(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching leads:', error)
      setLoading(false)
    }
  }

  const handleResearchLead = async (leadId: string) => {
    setIsResearching(true)
    try {
      const res = await fetch('/api/admin/leads/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId })
      })
      const data = await res.json()

      // Update lead with research data
      setLeads(prev => prev.map(lead =>
        lead.id === leadId ? { ...lead, researchData: data } : lead
      ))

      // Add to chat
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: `Research completed for ${data.company}. Found ${data.keyPeople?.length || 0} key contacts, ${data.technologies?.length || 0} technologies used, and ${data.opportunities?.length || 0} opportunities identified.`
      }])
    } catch (error) {
      console.error('Error researching lead:', error)
    } finally {
      setIsResearching(false)
    }
  }

  const handleSendEmail = async () => {
    if (!selectedLeads.length || !emailDraft.subject || !emailDraft.body) return

    try {
      const res = await fetch('/api/admin/leads/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: selectedLeads,
          template: emailDraft,
          sender: session?.user?.email
        })
      })

      if (res.ok) {
        setShowEmailComposer(false)
        setEmailDraft({ subject: '', body: '' })
        setSelectedLeads([])
        fetchLeads()
      }
    } catch (error) {
      console.error('Error sending email:', error)
    }
  }

  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return

    const userMessage = { role: 'user', content: chatInput }
    setChatMessages(prev => [...prev, userMessage])
    setChatInput('')

    try {
      const res = await fetch('/api/admin/leads/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, userMessage],
          leadId: selectedLead?.id
        })
      })

      const data = await res.json()
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }])

      // Apply updates if suggested
      if (data.updates) {
        setLeads(prev => prev.map(lead =>
          lead.id === selectedLead?.id ? { ...lead, ...data.updates } : lead
        ))
      }
    } catch (error) {
      console.error('Error in chat:', error)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-slate-100 text-slate-700',
      researched: 'bg-blue-100 text-blue-700',
      contacted: 'bg-purple-100 text-purple-700',
      replied: 'bg-green-100 text-green-700',
      meeting: 'bg-yellow-100 text-yellow-700',
      proposal: 'bg-orange-100 text-orange-700',
      won: 'bg-emerald-100 text-emerald-700',
      lost: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <Zap className="w-4 h-4 text-red-500" />
      case 'high': return <TrendingUp className="w-4 h-4 text-orange-500" />
      case 'medium': return <Activity className="w-4 h-4 text-yellow-500" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-slate-600">Loading leads...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Lead Management Center
              </h1>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Users className="w-4 h-4" />
                <span>{filteredLeads.length} leads</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowChatbot(!showChatbot)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                AI Assistant
              </button>

              <button
                onClick={() => setShowEmailComposer(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Compose Campaign
              </button>

              <button
                onClick={fetchLeads}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leads by name, company, email, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="researched">Researched</option>
              <option value="contacted">Contacted</option>
              <option value="replied">Replied</option>
              <option value="meeting">Meeting</option>
              <option value="proposal">Proposal</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'} transition-all`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'} transition-all`}
              >
                <PieChart className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded ${viewMode === 'kanban' ? 'bg-white shadow-sm' : 'hover:bg-slate-200'} transition-all`}
              >
                <Target className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-6 pb-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Leads List/Grid/Kanban */}
          <div className={showChatbot ? 'col-span-8' : 'col-span-12'}>
            {viewMode === 'list' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeads(filteredLeads.map(l => l.id))
                            } else {
                              setSelectedLeads([])
                            }
                          }}
                          className="rounded"
                        />
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Company</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Priority</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Last Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Score</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, index) => (
                      <tr key={lead.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedLeads([...selectedLeads, lead.id])
                              } else {
                                setSelectedLeads(selectedLeads.filter(id => id !== lead.id))
                              }
                            }}
                            className="rounded"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                              {lead.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{lead.name}</div>
                              <div className="text-sm text-slate-500">{lead.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="font-medium text-slate-900">{lead.company}</div>
                            {lead.designation && <div className="text-sm text-slate-500">{lead.designation}</div>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {getPriorityIcon(lead.priority)}
                            <span className="text-sm text-slate-600">{lead.priority}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm text-slate-600">
                            {lead.lastContact ? format(new Date(lead.lastContact), 'MMM dd, yyyy') : 'Never'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < (lead.score || 0) / 20 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                            >
                              <Eye className="w-4 h-4 text-slate-600" />
                            </button>
                            <button
                              onClick={() => handleResearchLead(lead.id)}
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                            >
                              <Sparkles className="w-4 h-4 text-purple-600" />
                            </button>
                            <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                              <Mail className="w-4 h-4 text-blue-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {viewMode === 'kanban' && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {['new', 'researched', 'contacted', 'replied', 'meeting', 'proposal'].map(status => (
                  <div key={status} className="min-w-[320px] bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium text-slate-900 capitalize">{status}</h3>
                      <span className="text-sm text-slate-500">
                        {filteredLeads.filter(l => l.status === status).length}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {filteredLeads.filter(l => l.status === status).map(lead => (
                        <div
                          key={lead.id}
                          className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-medium text-slate-900">{lead.name}</div>
                              <div className="text-sm text-slate-600">{lead.company}</div>
                            </div>
                            {getPriorityIcon(lead.priority)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                          {lead.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {lead.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Chatbot Sidebar */}
          {showChatbot && (
            <div className="col-span-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-[600px] flex flex-col">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <h3 className="font-medium text-slate-900">AI Research Assistant</h3>
                  </div>
                  <button
                    onClick={() => setShowChatbot(false)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-800'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isResearching && (
                    <div className="flex justify-start">
                      <div className="bg-slate-100 text-slate-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Researching lead information...
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="p-4 border-t border-slate-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
                      placeholder="Ask about leads, research companies, or get insights..."
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <button
                      onClick={handleChatSubmit}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors">
                      Research company
                    </button>
                    <button className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors">
                      Find contacts
                    </button>
                    <button className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors">
                      Suggest pitch
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{selectedLead.name}</h2>
                <p className="text-slate-600">{selectedLead.company} • {selectedLead.designation}</p>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">{selectedLead.email}</span>
                    </div>
                    {selectedLead.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{selectedLead.phone}</span>
                      </div>
                    )}
                    {selectedLead.linkedin && (
                      <div className="flex items-center gap-2 text-sm">
                        <Linkedin className="w-4 h-4 text-slate-400" />
                        <a href={selectedLead.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                    {selectedLead.location && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600">{selectedLead.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900">Lead Status</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedLead.status)}`}>
                        {selectedLead.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Priority:</span>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(selectedLead.priority)}
                        <span className="text-sm">{selectedLead.priority}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">Score:</span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < (selectedLead.score || 0) / 20 ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Research Data */}
              {selectedLead.researchData && (
                <div className="space-y-3">
                  <h3 className="font-medium text-slate-900">Research Insights</h3>
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 space-y-3">
                    {selectedLead.researchData.companySize && (
                      <div>
                        <span className="text-sm font-medium text-slate-700">Company Size:</span>
                        <span className="text-sm text-slate-600 ml-2">{selectedLead.researchData.companySize}</span>
                      </div>
                    )}
                    {selectedLead.researchData.technologies && selectedLead.researchData.technologies.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-slate-700">Technologies:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {selectedLead.researchData.technologies.map(tech => (
                            <span key={tech} className="px-2 py-0.5 bg-white text-purple-700 text-xs rounded border border-purple-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedLead.researchData.opportunities && selectedLead.researchData.opportunities.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-slate-700">Opportunities:</span>
                        <ul className="mt-1 space-y-1">
                          {selectedLead.researchData.opportunities.map((opp, i) => (
                            <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleResearchLead(selectedLead.id)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Research Company
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Send Email
                </button>
                <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Schedule Meeting
                </button>
                <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Offer Webinar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Composer Modal */}
      {showEmailComposer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-slate-900">Compose Campaign Email</h2>
              <button
                onClick={() => setShowEmailComposer(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Recipients</label>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <p className="text-sm text-slate-600">{selectedLeads.length} leads selected</p>
                  <p className="text-xs text-slate-500 mt-1">All emails will be sent from {session?.user?.email} with CC to admin@gennoor.com</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={emailDraft.subject}
                  onChange={(e) => setEmailDraft({ ...emailDraft, subject: e.target.value })}
                  placeholder="Transform Your Team with Gennoor's AI & Cloud Training"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Content</label>
                <textarea
                  value={emailDraft.body}
                  onChange={(e) => setEmailDraft({ ...emailDraft, body: e.target.value })}
                  rows={12}
                  placeholder="Dear [Name],

I hope this message finds you well. I'm reaching out from Gennoor Tech to share an exciting opportunity for [Company].

We're offering a complimentary 1-day webinar for your team on AI & Cloud Technologies...

Our expertise includes:
• Microsoft Azure & AI Solutions
• AWS Cloud Architecture
• Google Cloud Platform
• Custom Training Programs

I'd love to schedule a brief 15-minute call to understand your team's specific needs.

Best regards,
[Your Name]
Gennoor Tech"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Attachments</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">One-pager capability document will be attached automatically</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSendEmail}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Campaign
                </button>
                <button className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                  Save as Draft
                </button>
                <button className="px-6 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 transition-all flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}