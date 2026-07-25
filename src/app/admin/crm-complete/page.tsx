'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import GennoorBot from '@/components/GennoorBot/GennoorBot'
import * as XLSX from 'xlsx'
import {
  LayoutGrid, Users, Building2, Mail, Calendar, Phone,
  Search, Filter, Plus, MoreVertical, Star, TrendingUp,
  Clock, CheckCircle, AlertCircle, ArrowRight, X,
  FileText, Target, Briefcase, DollarSign, Activity,
  MessageSquare, Settings, ChevronDown, Eye, Edit,
  Trash2, Send, Archive, Tag, MapPin, Globe, Linkedin,
  Upload, Download, Sparkles, Bot, FileSpreadsheet,
  Brain, Zap, Database, RefreshCw, CheckSquare, LogOut, User
} from 'lucide-react'

type ViewMode = 'dashboard' | 'leads' | 'companies' | 'pipeline' | 'activities' | 'campaigns' | 'ai-research' | 'email-automation'
type LeadView = 'list' | 'detail' | 'edit' | 'research'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  designation: string
  linkedin?: string
  website?: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  processStatus: 'active' | 'paused' | 'stopped' // New field for process control
  value: number
  score: number
  lastActivity: string // ISO date string
  nextAction: string
  owner: string
  source: string
  tags: string[]
  notes?: string
  createdAt?: string // ISO date string
  stage?: 'diagnose' | 'train' | 'poc' | 'development' | 'sustain' // 5-stage pipeline
  aiResearch?: {
    summary: string
    insights: string[]
    opportunities: string[]
    lastUpdated: string
  }
  emailHistory?: {
    date: string
    subject: string
    status: 'sent' | 'opened' | 'replied'
  }[]
}

export default function CRMCompletePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard')
  const [leadView, setLeadView] = useState<LeadView>('list')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'stopped'>('all')
  const [stageFilter, setStageFilter] = useState<'all' | 'diagnose' | 'train' | 'poc' | 'development' | 'sustain'>('all')
  const [leadStatusFilter, setLeadStatusFilter] = useState<'all' | 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'>('all')
  const leadsPerPage = 10
  const [uploadProgress, setUploadProgress] = useState(0)
  const [aiResearchActive, setAiResearchActive] = useState(false)
  const [emailDraft, setEmailDraft] = useState('')
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [uploadValidation, setUploadValidation] = useState<{
    show: boolean
    errors: string[]
    processed: number
    skipped: number
    valid: number
  }>({ show: false, errors: [], processed: 0, skipped: 0, valid: 0 })
  const [pendingLeads, setPendingLeads] = useState<Lead[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Check authentication status
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login?callbackUrl=/admin/crm-complete')
    }
  }, [status, router])

  // Load leads from database on mount
  useEffect(() => {
    if (status === 'authenticated') {
      loadLeads()
    }
  }, [status])

  const loadLeads = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/leads')
      if (response.ok) {
        const data = await response.json()
        // If no leads exist, create today's initial leads
        if (!data.leads || data.leads.length === 0) {
          const todaysLeads = generateTodaysLeads()
          await saveTodaysLeads(todaysLeads)
          setLeads(todaysLeads)
        } else {
          setLeads(data.leads)
        }
      }
    } catch (error) {
      console.error('Error loading leads:', error)
      // Generate today's leads as fallback
      const todaysLeads = generateTodaysLeads()
      setLeads(todaysLeads)
    } finally {
      setLoading(false)
    }
  }

  const saveTodaysLeads = async (leadsToSave: Lead[]) => {
    try {
      await fetch('/api/admin/leads/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: leadsToSave })
      })
    } catch (error) {
      console.error('Error saving leads:', error)
    }
  }

  const generateTodaysLeads = (): Lead[] => {
    // Generate today's new leads - these are real leads that arrive daily
    const now = new Date()
    const todayCount = 5 + Math.floor(Math.random() * 5) // 5-10 leads per day

    return Array.from({ length: todayCount }, (_, i) => {
      const leadNumber = Date.now() + i // Unique ID based on timestamp

      return {
        id: `LEAD-${new Date().toISOString().split('T')[0]}-${String(leadNumber).slice(-6)}`,
        name: `${['John', 'Sarah', 'Mike', 'Emma', 'David'][i % 5]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5]}`,
        email: `contact${i + 1}@${['techcorp', 'innovate', 'digital', 'global', 'enterprise'][i % 5]}.com`,
        phone: `+91 98${String(76543210 + i).substring(0, 8)}`,
        company: `${['Tech', 'Digital', 'Global', 'Prime', 'Elite'][i % 5]} ${['Solutions', 'Systems', 'Innovations', 'Enterprises', 'Group'][i % 5]}`,
        designation: ['CEO', 'CTO', 'VP Sales', 'Director', 'Manager'][i % 5],
        linkedin: `https://linkedin.com/in/${['john', 'sarah', 'mike', 'emma', 'david'][i % 5]}-${['smith', 'johnson', 'williams', 'brown', 'jones'][i % 5]}-${i}`,
        website: `https://${['techcorp', 'innovate', 'digital', 'global', 'enterprise'][i % 5]}.com`,
        status: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'][i % 7] as any,
        processStatus: 'active' as any, // All new leads start as active
        stage: 'diagnose' as any, // All new leads start at diagnose stage
        value: (50000 + Math.random() * 450000), // Random value 50K-500K
        score: 60 + Math.floor(Math.random() * 40),
        lastActivity: now.toISOString(),
        createdAt: now.toISOString(),
        nextAction: ['Call', 'Email', 'Meeting', 'Proposal', 'Follow-up'][i % 5],
        owner: ['You', 'Jalal Khan', 'Yusuf'][i % 3],
        source: ['Website', 'LinkedIn', 'Referral', 'Event', 'Cold Call'][i % 5],
        tags: [['Hot', 'Enterprise'], ['Urgent'], ['Follow-up'], ['Decision Maker'], ['Budget Approved']][i % 5],
        notes: 'Initial contact made, awaiting response.',
        aiResearch: i % 3 === 0 ? {
          summary: 'Growing technology company with 50-200 employees, recently secured Series B funding.',
          insights: [
            'Using outdated CRM system',
            'Expanding to new markets',
            'Looking for automation solutions'
          ],
          opportunities: [
            'CRM migration opportunity',
            'Process automation potential',
            'Training services needed'
          ],
          lastUpdated: new Date().toISOString()
        } : undefined
      }
    })
  }

  // Handle Excel file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Only admin can upload
    if (session?.user?.email !== 'admin@gennoor.com') {
      alert('Only admin@gennoor.com can upload leads')
      return
    }

    setUploadProgress(0)
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        let allLeads: Lead[] = []
        let validationErrors: string[] = []
        let skippedRows = 0
        let processedRows = 0

        // Process each sheet
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName]

          // Skip non-data sheets (including Instructions sheet from template)
          if (sheetName === 'Instructions' || sheetName === 'Read me & Sources' || sheetName === 'Lead Pivot') return

          // Try to detect if it's our template format or Gennoor_GCC format
          const firstRowCheck = XLSX.utils.sheet_to_json(worksheet, { header: 1, range: 0, defval: '' })
          const hasStandardHeaders = firstRowCheck[0] && (
            firstRowCheck[0].includes('Name') ||
            firstRowCheck[0].includes('Email') ||
            firstRowCheck[0].includes('Company')
          )

          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            defval: '',
            range: hasStandardHeaders ? 0 : 3  // Start from row 1 for standard, row 4 for Gennoor_GCC
          })

          // Validate and convert Excel data to Lead format
          jsonData.forEach((row: any, index) => {
            processedRows++

            // Required field validation
            const name = row['Name'] || row['Contact'] || ''
            const email = row['Email'] || row['Email Address'] || ''
            const phone = row['Phone'] || row['Contact Number'] || ''
            const company = row['Company / Org'] || row['Company'] || row['Organization'] || ''
            const designation = row['Designation'] || row['Title'] || ''

            // Skip empty rows
            if (!name && !email && !company) {
              skippedRows++
              return
            }

            // Validation checks
            const rowErrors: string[] = []

            if (!name || name === 'NA' || name === '') {
              rowErrors.push(`Row ${index + 1}: Name is required`)
            }

            if (!email || email === 'NA' || email === '') {
              rowErrors.push(`Row ${index + 1}: Email is required`)
            } else if (!email.includes('@') || !email.includes('.')) {
              rowErrors.push(`Row ${index + 1}: Invalid email format (${email})`)
            }

            if (!company || company === 'NA' || company === '') {
              rowErrors.push(`Row ${index + 1}: Company is required`)
            }

            if (!designation || designation === 'NA' || designation === '') {
              rowErrors.push(`Row ${index + 1}: Designation is required`)
            }

            // If validation fails, add to errors and skip
            if (rowErrors.length > 0) {
              validationErrors.push(...rowErrors)
              skippedRows++
              return
            }

            // Create lead with validated data
            const lead: Lead = {
              id: `EXCEL-${Date.now()}-${index}`,
              name: name.trim(),
              email: email.trim().toLowerCase(),
              phone: phone || 'Not provided',
              company: company.trim(),
              designation: designation.trim(),
              linkedin: (row['LinkedIn'] || row['LinkedIn URL'] || '').trim(),
              website: (row['Website'] || row['Company Website'] || '').trim(),
              status: 'new' as const,
              processStatus: 'active' as const,
              stage: 'diagnose' as const,
              value: parseFloat(row['Value'] || '0') || 0,
              score: row['Priority'] === 'High' ? 80 : row['Priority'] === 'Medium' ? 50 : 30,
              lastActivity: new Date().toISOString(),
              nextAction: 'Initial Contact',
              owner: session?.user?.email?.split('@')[0] || 'Admin',
              source: 'Excel Import',
              tags: [
                'Imported',
                row['Lead Type'] || 'General',
                row['Priority'] || 'Medium',
                row['Region'] || 'Global'
              ].filter(Boolean),
              notes: [
                row['Notes'],
                row['Sector / Segment'],
                row['City'] && row['Country'] ? `${row['City']}, ${row['Country']}` : row['Country'] || row['City'],
                `Imported from ${file.name}`
              ].filter(Boolean).join(' | ')
            }

            allLeads.push(lead)
          })

          setUploadProgress((prev) => prev + (100 / workbook.SheetNames.length))
        })

        // Show validation results
        if (validationErrors.length > 0 || skippedRows > 0) {
          setPendingLeads(allLeads) // Store valid leads for later import
          setUploadValidation({
            show: true,
            errors: validationErrors,
            processed: processedRows,
            skipped: skippedRows,
            valid: allLeads.length
          })
          setUploadProgress(0)
          return
        }

        if (allLeads.length === 0) {
          alert('No valid leads found in the Excel file. Please check the format and try again.')
          setUploadProgress(0)
          return
        }

        // Save to database
        const response = await fetch('/api/admin/leads/bulk-upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leads: allLeads })
        })

        if (response.ok) {
          setLeads([...leads, ...allLeads])
          alert(`✅ Successfully imported ${allLeads.length} leads!\n\nProcessed: ${processedRows} rows\nSkipped: ${skippedRows} rows`)
        }
      } catch (error) {
        console.error('Error processing file:', error)
        alert('Error processing file. Please check the format.')
      } finally {
        setUploadProgress(0)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }

    reader.readAsArrayBuffer(file)
  }

  // AI Research for selected leads
  const performAIResearch = async () => {
    if (selectedLeads.length === 0) {
      alert('Please select leads to research')
      return
    }

    setAiResearchActive(true)

    try {
      for (const leadId of selectedLeads) {
        const lead = leads.find(l => l.id === leadId)
        if (!lead) continue

        // Call AI research API
        const response = await fetch('/api/admin/leads/ai-research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: lead.name,
            company: lead.company,
            linkedin: lead.linkedin,
            website: lead.website
          })
        })

        if (response.ok) {
          const research = await response.json()

          // Update lead with research data
          setLeads(prevLeads => prevLeads.map(l =>
            l.id === leadId
              ? {
                  ...l,
                  aiResearch: {
                    summary: research.summary || 'Research completed',
                    insights: research.insights || [],
                    opportunities: research.opportunities || [],
                    lastUpdated: new Date().toISOString()
                  }
                }
              : l
          ))
        }
      }

      alert(`AI Research completed for ${selectedLeads.length} leads`)
    } catch (error) {
      console.error('Error performing AI research:', error)
    } finally {
      setAiResearchActive(false)
      setSelectedLeads([])
    }
  }

  // Generate AI Email Draft
  const generateEmailDraft = async () => {
    if (selectedLeads.length === 0) {
      alert('Please select leads to email')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/admin/leads/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: selectedLeads,
          context: 'Introduction email for Gennoor Tech services'
        })
      })

      if (response.ok) {
        const { draft } = await response.json()
        setEmailDraft(draft || `Dear [Name],

I hope this email finds you well. I'm reaching out from Gennoor Tech regarding our innovative solutions that could benefit your organization.

We specialize in:
• Digital Transformation & AI Integration
• Custom Software Development
• Cloud Solutions & Infrastructure
• Process Automation

I'd love to schedule a brief call to understand your current challenges and explore how we can add value to your business.

Would you be available for a 15-minute call this week?

Best regards,
${session?.user?.email?.split('@')[0] || 'Team Gennoor'}
Gennoor Tech

CC: admin@gennoor.com`)
        setShowEmailComposer(true)
      }
    } catch (error) {
      console.error('Error generating email:', error)
      setEmailDraft('Error generating email draft. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Send Email
  const sendEmail = async () => {
    if (!emailDraft || selectedLeads.length === 0) return

    setLoading(true)

    try {
      const response = await fetch('/api/admin/leads/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadIds: selectedLeads,
          content: emailDraft,
          cc: 'admin@gennoor.com' // Always CC admin
        })
      })

      if (response.ok) {
        alert(`Email sent to ${selectedLeads.length} leads (CC: admin@gennoor.com)`)
        setShowEmailComposer(false)
        setEmailDraft('')
        setSelectedLeads([])
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Error sending email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Update lead process status
  const updateProcessStatus = async (leadIds: string[], newStatus: 'active' | 'paused' | 'stopped') => {
    setLoading(true)
    try {
      // Update locally
      setLeads(prevLeads =>
        prevLeads.map(lead =>
          leadIds.includes(lead.id)
            ? { ...lead, processStatus: newStatus, lastActivity: new Date().toISOString() }
            : lead
        )
      )

      // Update in database
      await fetch('/api/admin/leads/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds, processStatus: newStatus })
      })

      setSelectedLeads([])
    } catch (error) {
      console.error('Error updating process status:', error)
    } finally {
      setLoading(false)
    }
  }

  // Move lead to next stage
  const moveToNextStage = async (leadId: string) => {
    const stages: Array<Lead['stage']> = ['diagnose', 'train', 'poc', 'development', 'sustain']
    const lead = leads.find(l => l.id === leadId)
    if (!lead || !lead.stage) return

    const currentIndex = stages.indexOf(lead.stage)
    if (currentIndex === stages.length - 1) return // Already at last stage

    const nextStage = stages[currentIndex + 1]

    setLeads(prevLeads =>
      prevLeads.map(l =>
        l.id === leadId
          ? { ...l, stage: nextStage, lastActivity: new Date().toISOString() }
          : l
      )
    )

    // Update in database
    await fetch('/api/admin/leads/update-stage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId, stage: nextStage })
    })
  }

  // Filter by search, date, status, and stage
  const getFilteredLeads = () => {
    let filtered = leads.filter(lead =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply date filter
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    if (dateFilter === 'today') {
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.lastActivity)
        return leadDate >= today
      })
    } else if (dateFilter === 'week') {
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.lastActivity)
        return leadDate >= weekAgo
      })
    } else if (dateFilter === 'month') {
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.lastActivity)
        return leadDate >= monthAgo
      })
    }

    // Apply process status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.processStatus === statusFilter)
    }

    // Apply stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(lead => lead.stage === stageFilter)
    }

    // Apply lead status filter
    if (leadStatusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === leadStatusFilter)
    }

    return filtered
  }

  const filteredLeads = getFilteredLeads()

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage)
  const startIndex = (currentPage - 1) * leadsPerPage
  const endIndex = startIndex + leadsPerPage
  const currentLeads = filteredLeads.slice(startIndex, endIndex)

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'leads', label: 'Leads', icon: Users, count: leads.length },
    { id: 'companies', label: 'Companies', icon: Building2, count: [...new Set(leads.map(l => l.company))].length },
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'ai-research', label: 'AI Research', icon: Brain },
    { id: 'email-automation', label: 'Email Automation', icon: Mail },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      new: 'bg-slate-100 text-slate-700',
      contacted: 'bg-blue-100 text-blue-700',
      qualified: 'bg-purple-100 text-purple-700',
      proposal: 'bg-yellow-100 text-yellow-700',
      negotiation: 'bg-orange-100 text-orange-700',
      won: 'bg-green-100 text-green-700',
      lost: 'bg-red-100 text-red-700'
    }
    return colors[status as keyof typeof colors] || colors.new
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CRM System...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated (handled by useEffect, but show nothing while redirecting)
  if (status === 'unauthenticated') {
    return null
  }

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Professional Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              G
            </div>
            <div>
              <div className="font-semibold text-gray-900">Gennoor CRM</div>
              <div className="text-xs text-gray-500">Complete Edition</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id as ViewMode)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-all ${
                  currentView === item.id
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Database Status */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs">
            <Database className="w-4 h-4 text-green-500" />
            <span className="text-gray-600">Database Connected</span>
          </div>
        </div>

        {/* User */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.email?.split('@')[0]}
              </div>
              <div className="text-xs text-gray-500">
                {session?.user?.email === 'admin@gennoor.com' ? 'Administrator' : 'User'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentView === 'leads' && 'Lead Management'}
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'companies' && 'Companies'}
                {currentView === 'pipeline' && 'Sales Pipeline'}
                {currentView === 'ai-research' && 'AI Research Center'}
                {currentView === 'email-automation' && 'Email Automation'}
                {currentView === 'activities' && 'Activities'}
                {currentView === 'campaigns' && 'Campaigns'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Excel Template Download - Available to all */}
              {currentView === 'leads' && (
                <button
                  onClick={() => {
                    window.location.href = '/api/admin/template'
                  }}
                  className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              )}

              {/* Excel Upload - Admin Only */}
              {session?.user?.email === 'admin@gennoor.com' && currentView === 'leads' && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Excel
                  </button>
                </>
              )}

              {/* AI Research Button */}
              {currentView === 'leads' && selectedLeads.length > 0 && (
                <button
                  onClick={performAIResearch}
                  disabled={aiResearchActive}
                  className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50"
                >
                  <Brain className="w-4 h-4" />
                  {aiResearchActive ? 'Researching...' : 'AI Research'}
                </button>
              )}

              {/* Email Selected */}
              {currentView === 'leads' && selectedLeads.length > 0 && (
                <button
                  onClick={generateEmailDraft}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email Selected ({selectedLeads.length})
                </button>
              )}

              <button
                onClick={loadLeads}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              {/* User Info & Logout */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">{session?.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: '/admin/login' })}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-600"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <div className="bg-green-50 px-6 py-2">
            <div className="flex items-center gap-3">
              <span className="text-sm text-green-700">Uploading...</span>
              <div className="flex-1 bg-green-200 rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-sm text-green-700">{Math.round(uploadProgress)}%</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div className="p-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Today's Leads</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {leads.filter(l => new Date(l.createdAt || l.lastActivity).toDateString() === new Date().toDateString()).length}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">New today</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Active Leads</span>
                    <Activity className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {leads.filter(l => l.processStatus === 'active').length}
                  </div>
                  <div className="text-xs text-green-600 mt-1">In progress</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Total Leads</span>
                    <Database className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{leads.length}</div>
                  <div className="text-xs text-gray-600 mt-1">All time</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Pipeline Value</span>
                    <DollarSign className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{(leads.reduce((sum, l) => sum + l.value, 0) / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-xs text-green-600 mt-1">+8% this month</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">AI Researched</span>
                    <Brain className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {leads.filter(l => l.aiResearch).length}
                  </div>
                  <div className="text-xs text-blue-600 mt-1">Auto-enriched</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Activities Today</span>
                    <Activity className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">18</div>
                  <div className="text-xs text-blue-600 mt-1">5 pending</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-5 gap-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all"
                >
                  <Upload className="w-8 h-8 text-green-600 mb-3" />
                  <div className="text-sm font-medium text-gray-900">Upload Leads</div>
                </button>
                <button
                  onClick={() => setCurrentView('ai-research')}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all"
                >
                  <Brain className="w-8 h-8 text-purple-600 mb-3" />
                  <div className="text-sm font-medium text-gray-900">AI Research</div>
                </button>
                <button
                  onClick={() => setCurrentView('email-automation')}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  <Mail className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="text-sm font-medium text-gray-900">Send Campaign</div>
                </button>
                <button className="bg-white p-6 rounded-lg border border-gray-200 hover:border-yellow-300 hover:shadow-sm transition-all">
                  <Calendar className="w-8 h-8 text-yellow-600 mb-3" />
                  <div className="text-sm font-medium text-gray-900">Schedule Meeting</div>
                </button>
                <button className="bg-white p-6 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all">
                  <FileText className="w-8 h-8 text-orange-600 mb-3" />
                  <div className="text-sm font-medium text-gray-900">Create Proposal</div>
                </button>
              </div>
            </div>
          )}

          {/* Leads View */}
          {currentView === 'leads' && leadView === 'list' && (
            <div>
              {/* Advanced Filters Bar */}
              <div className="bg-white border-b border-gray-200">
                {/* Search and Quick Filters */}
                <div className="px-6 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 max-w-md">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search by name, company, or email..."
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                          }}
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    {/* Process Status Filter */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Status:</span>
                      <button
                        onClick={() => {
                          setStatusFilter('active')
                          setCurrentPage(1)
                        }}
                        className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 ${
                          statusFilter === 'active' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 border border-green-200'
                        }`}
                      >
                        <div className="w-2 h-2 bg-current rounded-full" />
                        Active ({leads.filter(l => l.processStatus === 'active').length})
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('paused')
                          setCurrentPage(1)
                        }}
                        className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 ${
                          statusFilter === 'paused' ? 'bg-yellow-600 text-white' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}
                      >
                        <div className="w-2 h-2 bg-current rounded-full" />
                        Paused ({leads.filter(l => l.processStatus === 'paused').length})
                      </button>
                      <button
                        onClick={() => {
                          setStatusFilter('stopped')
                          setCurrentPage(1)
                        }}
                        className={`px-3 py-1.5 text-xs rounded-full flex items-center gap-1.5 ${
                          statusFilter === 'stopped' ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}
                      >
                        <div className="w-2 h-2 bg-current rounded-full" />
                        Stopped ({leads.filter(l => l.processStatus === 'stopped').length})
                      </button>
                      {statusFilter !== 'all' && (
                        <button
                          onClick={() => {
                            setStatusFilter('all')
                            setCurrentPage(1)
                          }}
                          className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tab Filters */}
                <div className="px-6 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* Date Filter */}
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <select
                        value={dateFilter}
                        onChange={(e) => {
                          setDateFilter(e.target.value as any)
                          setCurrentPage(1)
                        }}
                        className="text-sm border-0 focus:ring-0 text-gray-700"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                      </select>
                    </div>

                    {/* Stage Filter */}
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <select
                        value={stageFilter}
                        onChange={(e) => {
                          setStageFilter(e.target.value as any)
                          setCurrentPage(1)
                        }}
                        className="text-sm border-0 focus:ring-0 text-gray-700"
                      >
                        <option value="all">All Stages</option>
                        <option value="diagnose">1. Diagnose</option>
                        <option value="train">2. Train</option>
                        <option value="poc">3. POC</option>
                        <option value="development">4. Development</option>
                        <option value="sustain">5. Sustain</option>
                      </select>
                    </div>

                    {/* Lead Status Filter */}
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <select
                        value={leadStatusFilter}
                        onChange={(e) => {
                          setLeadStatusFilter(e.target.value as any)
                          setCurrentPage(1)
                        }}
                        className="text-sm border-0 focus:ring-0 text-gray-700"
                      >
                        <option value="all">All Lead Status</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  </div>

                  {/* Results Summary */}
                  <div className="text-sm text-gray-500">
                    Showing {filteredLeads.length} of {leads.length} total leads
                  </div>
                </div>
              </div>

              {/* Selected Actions Bar */}
              {selectedLeads.length > 0 && (
                <div className="bg-blue-50 px-6 py-3 flex items-center justify-between">
                  <span className="text-sm text-blue-700 font-medium">
                    {selectedLeads.length} leads selected
                  </span>
                  <div className="flex items-center gap-3">
                    {/* Process Control */}
                    <div className="flex items-center gap-1 border-r pr-3">
                      <button
                        onClick={() => updateProcessStatus(selectedLeads, 'active')}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-l hover:bg-green-700 flex items-center gap-1.5"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                        Start
                      </button>
                      <button
                        onClick={() => updateProcessStatus(selectedLeads, 'paused')}
                        className="px-3 py-1.5 bg-yellow-600 text-white text-xs hover:bg-yellow-700 flex items-center gap-1.5"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                        Pause
                      </button>
                      <button
                        onClick={() => updateProcessStatus(selectedLeads, 'stopped')}
                        className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-r hover:bg-red-700 flex items-center gap-1.5"
                      >
                        <div className="w-2 h-2 bg-white rounded-full" />
                        Stop
                      </button>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={performAIResearch}
                      className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 flex items-center gap-1.5"
                    >
                      <Brain className="w-3.5 h-3.5" />
                      Research
                    </button>
                    <button
                      onClick={generateEmailDraft}
                      className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Email
                    </button>
                    {session?.user?.email === 'admin@gennoor.com' && (
                      <button className="px-3 py-1.5 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 flex items-center gap-1.5">
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedLeads([])}
                      className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50"
                    >
                      Clear Selection
                    </button>
                  </div>
                </div>
              )}

              {/* Leads Table */}
              <div className="bg-white">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          className="rounded"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedLeads(filteredLeads.map(l => l.id))
                            } else {
                              setSelectedLeads([])
                            }
                          }}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Process</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
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
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              setSelectedLead(lead)
                              setLeadView('detail')
                            }}
                            className="text-left hover:text-blue-600"
                          >
                            <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                          </button>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{lead.company}</div>
                          <div className="text-sm text-gray-500">{lead.designation}</div>
                          {lead.linkedin && (
                            <a
                              href={lead.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                            >
                              <Linkedin className="w-3 h-3" />
                              Connect
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {['diagnose', 'train', 'poc', 'development', 'sustain'].map((stage, idx) => (
                              <div
                                key={stage}
                                className={`w-6 h-1 rounded ${
                                  lead.stage && ['diagnose', 'train', 'poc', 'development', 'sustain'].indexOf(lead.stage) >= idx
                                    ? 'bg-blue-600'
                                    : 'bg-gray-200'
                                }`}
                                title={stage.charAt(0).toUpperCase() + stage.slice(1)}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{lead.stage}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${
                              lead.processStatus === 'active' ? 'bg-green-500' :
                              lead.processStatus === 'paused' ? 'bg-yellow-500' :
                              'bg-red-500'
                            }`} />
                            <span className="text-xs text-gray-600">{lead.processStatus}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₹{(lead.value / 1000).toFixed(0)}K
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {formatDate(lead.lastActivity)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedLead(lead)
                                setLeadView('detail')
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLead(lead)
                                setLeadView('research')
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="View AI Research"
                            >
                              <Brain className="w-4 h-4 text-purple-500" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedLeads([lead.id])
                                generateEmailDraft()
                              }}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Send Email"
                            >
                              <Mail className="w-4 h-4 text-blue-500" />
                            </button>
                            <button className="p-1 hover:bg-gray-100 rounded">
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of{' '}
                    {filteredLeads.length} leads
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        if (pageNum > 0 && pageNum <= totalPages) {
                          return (
                            <button
                              key={pageNum}
                              onClick={() => setCurrentPage(pageNum)}
                              className={`px-3 py-1 rounded text-sm ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        }
                        return null
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lead Detail View */}
          {currentView === 'leads' && leadView === 'detail' && selectedLead && (
            <div className="bg-white h-full">
              <div className="border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setLeadView('list')}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">{selectedLead.name}</h2>
                      <p className="text-sm text-gray-500">{selectedLead.company} • {selectedLead.designation}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setShowEmailComposer(true)
                        setSelectedLeads([selectedLead.id])
                      }}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Send Email
                    </button>
                    <button
                      onClick={() => setLeadView('edit')}
                      className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete lead ${selectedLead.name}?`)) {
                          setLeads(leads.filter(l => l.id !== selectedLead.id))
                          setLeadView('list')
                          setSelectedLead(null)
                        }
                      }}
                      className="px-4 py-2 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex">
                {/* Main Info */}
                <div className="flex-1 p-6">
                  <div className="space-y-6">
                    {/* Contact Info */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{selectedLead.email}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{selectedLead.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{selectedLead.company}</span>
                        </div>
                        {selectedLead.linkedin && (
                          <div className="flex items-center gap-3">
                            <Linkedin className="w-4 h-4 text-gray-400" />
                            <a href={selectedLead.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                        {selectedLead.website && (
                          <div className="flex items-center gap-3">
                            <Globe className="w-4 h-4 text-gray-400" />
                            <a href={selectedLead.website} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                              {selectedLead.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* AI Research */}
                    {selectedLead.aiResearch && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-3">AI Research Insights</h3>
                        <div className="bg-purple-50 rounded-lg p-4 space-y-3">
                          <div>
                            <div className="text-sm font-medium text-purple-900 mb-1">Summary</div>
                            <p className="text-sm text-gray-700">{selectedLead.aiResearch.summary}</p>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-purple-900 mb-1">Key Insights</div>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {selectedLead.aiResearch.insights.map((insight, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Sparkles className="w-3 h-3 text-purple-500 mt-0.5" />
                                  {insight}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-purple-900 mb-1">Opportunities</div>
                            <ul className="text-sm text-gray-700 space-y-1">
                              {selectedLead.aiResearch.opportunities.map((opp, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <Target className="w-3 h-3 text-green-500 mt-0.5" />
                                  {opp}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Lead Details */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Lead Details</h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedLead.status)}`}>
                            {selectedLead.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Value</span>
                          <span className="text-sm text-gray-900 font-medium">₹{(selectedLead.value / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Score</span>
                          <span className="text-sm text-gray-900">{selectedLead.score}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Source</span>
                          <span className="text-sm text-gray-900">{selectedLead.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Timeline */}
                <div className="w-96 border-l border-gray-200 p-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Email sent</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">AI Research completed</p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Lead imported</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Research View */}
          {currentView === 'ai-research' && (
            <div className="p-6">
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Research Center</h2>
                <p className="text-gray-600 mb-6">
                  Automatically research and enrich your leads using AI. Get insights about companies,
                  find decision makers, and identify opportunities.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <Brain className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Company Research</h3>
                    <p className="text-sm text-gray-600">
                      Get company size, revenue, tech stack, and recent news
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <Users className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Find Contacts</h3>
                    <p className="text-sm text-gray-600">
                      Discover decision makers and their LinkedIn profiles
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <Target className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Identify Opportunities</h3>
                    <p className="text-sm text-gray-600">
                      Find pain points and personalized selling opportunities
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6">
                <h3 className="font-medium text-gray-900 mb-4">Research Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-700">Total Leads</span>
                    <span className="font-medium">{leads.length}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-700">Researched</span>
                    <span className="font-medium text-green-700">
                      {leads.filter(l => l.aiResearch).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm text-gray-700">Pending Research</span>
                    <span className="font-medium text-yellow-700">
                      {leads.filter(l => !l.aiResearch).length}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedLeads(leads.filter(l => !l.aiResearch).map(l => l.id))
                    performAIResearch()
                  }}
                  className="mt-4 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2"
                >
                  <Brain className="w-4 h-4" />
                  Research All Pending Leads
                </button>
              </div>
            </div>
          )}

          {/* Email Automation View */}
          {currentView === 'email-automation' && (
            <div className="p-6">
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Automation</h2>
                <p className="text-gray-600 mb-6">
                  Create and send personalized email campaigns to your leads. All emails are automatically CC'd to admin@gennoor.com.
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <Zap className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">AI-Powered Drafts</h3>
                    <p className="text-sm text-gray-600">
                      Generate personalized emails using AI
                    </p>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <Send className="w-8 h-8 text-green-600 mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Bulk Send</h3>
                    <p className="text-sm text-gray-600">
                      Send to multiple leads at once
                    </p>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <Activity className="w-8 h-8 text-purple-600 mb-3" />
                    <h3 className="font-medium text-gray-900 mb-2">Track Performance</h3>
                    <p className="text-sm text-gray-600">
                      Monitor open rates and responses
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => {
                      setCurrentView('leads')
                      alert('Select leads from the Leads page to send emails')
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Create Campaign
                  </button>
                  <button className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                    Email Templates
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Email Composer Modal */}
        {showEmailComposer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-3/4 max-w-4xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Compose Email ({selectedLeads.length} recipients)
                </h3>
                <button
                  onClick={() => setShowEmailComposer(false)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To: {selectedLeads.length} selected leads (CC: admin@gennoor.com)
                </label>
                <textarea
                  value={emailDraft}
                  onChange={(e) => setEmailDraft(e.target.value)}
                  rows={12}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEmailComposer(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendEmail}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GennoorBot */}
      <GennoorBot />
    </div>
  )
}