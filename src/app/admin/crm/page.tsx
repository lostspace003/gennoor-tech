'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import GennoorBot from '@/components/GennoorBot/GennoorBot'
import {
  LayoutGrid, Users, Building2, Mail, Calendar, Phone,
  Search, Filter, Plus, MoreVertical, Star, TrendingUp,
  Clock, CheckCircle, AlertCircle, ArrowRight, X,
  FileText, Target, Briefcase, DollarSign, Activity,
  MessageSquare, Settings, ChevronDown, Eye, Edit,
  Trash2, Send, Archive, Tag, MapPin, Globe, Linkedin
} from 'lucide-react'

type ViewMode = 'dashboard' | 'leads' | 'companies' | 'pipeline' | 'activities' | 'campaigns'
type LeadView = 'list' | 'detail' | 'edit'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  designation: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  value: number
  score: number
  lastActivity: string
  nextAction: string
  owner: string
  source: string
  tags: string[]
}

export default function CRMPage() {
  const { data: session } = useSession()
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard')
  const [leadView, setLeadView] = useState<LeadView>('list')
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Professional mock data
  const mockLeads: Lead[] = Array.from({ length: 50 }, (_, i) => ({
    id: `CRM-${String(i + 1).padStart(5, '0')}`,
    name: `${['John', 'Sarah', 'Mike', 'Emma', 'David'][i % 5]} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'][i % 5]}`,
    email: `contact${i + 1}@${['techcorp', 'innovate', 'digital', 'global', 'enterprise'][i % 5]}.com`,
    phone: `+91 98${String(76543210 + i).substring(0, 8)}`,
    company: `${['Tech', 'Digital', 'Global', 'Prime', 'Elite'][i % 5]} ${['Solutions', 'Systems', 'Innovations', 'Enterprises', 'Group'][i % 5]}`,
    designation: ['CEO', 'CTO', 'VP Sales', 'Director', 'Manager'][i % 5],
    status: ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'][i % 7] as any,
    value: (i + 1) * 50000,
    score: 60 + (i % 40),
    lastActivity: `${i + 1} days ago`,
    nextAction: ['Call', 'Email', 'Meeting', 'Proposal', 'Follow-up'][i % 5],
    owner: ['You', 'Jalal Khan', 'Yusuf'][i % 3],
    source: ['Website', 'LinkedIn', 'Referral', 'Event', 'Cold Call'][i % 5],
    tags: [['Hot', 'Enterprise'], ['Urgent'], ['Follow-up'], ['Decision Maker'], ['Budget Approved']][i % 5]
  }))

  const filteredLeads = mockLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'leads', label: 'Leads', icon: Users, count: 166 },
    { id: 'companies', label: 'Companies', icon: Building2, count: 45 },
    { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
    { id: 'activities', label: 'Activities', icon: Activity },
    { id: 'campaigns', label: 'Campaigns', icon: Mail },
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
              <div className="text-xs text-gray-500">Professional Edition</div>
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
                {item.count && (
                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {session?.user?.email?.split('@')[0]}
              </div>
              <div className="text-xs text-gray-500">Administrator</div>
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
                {currentView === 'activities' && 'Activities'}
                {currentView === 'campaigns' && 'Campaigns'}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {session?.user?.email === 'admin@gennoor.com' && (
                <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Upload Leads
                </button>
              )}
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Total Leads</span>
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">166</div>
                  <div className="text-xs text-green-600 mt-1">+12% this month</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Pipeline Value</span>
                    <DollarSign className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">₹2.4M</div>
                  <div className="text-xs text-green-600 mt-1">+8% this month</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Conversion Rate</span>
                    <TrendingUp className="w-4 h-4 text-gray-400" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">24%</div>
                  <div className="text-xs text-green-600 mt-1">+3% this month</div>
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
              <div className="grid grid-cols-4 gap-4">
                <button className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                  <Mail className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="text-sm font-medium text-gray-900">Send Campaign</div>
                </button>
                <button className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all">
                  <Calendar className="w-8 h-8 text-purple-600 mb-3" />
                  <div className="text-sm font-medium text-gray-900">Schedule Meeting</div>
                </button>
                <button className="bg-white p-6 rounded-lg border border-gray-200 hover:border-green-300 hover:shadow-sm transition-all">
                  <FileText className="w-8 h-8 text-green-600 mb-3" />
                  <div className="text-sm font-medium text-gray-900">Create Proposal</div>
                </button>
                <button className="bg-white p-6 rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all">
                  <Target className="w-8 h-8 text-orange-600 mb-3" />
                  <div className="text-sm font-medium text-gray-900">AI Research</div>
                </button>
              </div>
            </div>
          )}

          {/* Leads View */}
          {currentView === 'leads' && leadView === 'list' && (
            <div>
              {/* Filters Bar */}
              <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search leads..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                  </button>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>All Status</option>
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                  </select>
                  <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
                    <option>All Owners</option>
                    <option>Me</option>
                    <option>Jalal Khan</option>
                    <option>Yusuf</option>
                  </select>
                </div>
              </div>

              {/* Leads Table */}
              <div className="bg-white">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredLeads.slice(0, 10).map((lead) => (
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
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ₹{(lead.value / 1000).toFixed(0)}K
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-yellow-400 to-green-500 h-2 rounded-full"
                                style={{ width: `${lead.score}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{lead.score}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{lead.owner}</td>
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
                              onClick={() => alert(`Edit ${lead.name}`)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Edit Lead"
                            >
                              <Edit className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => alert(`More actions for ${lead.name}`)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="More Options"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                      Send Email
                    </button>
                    <button className="px-4 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">
                      Schedule Meeting
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
                      </div>
                    </div>

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
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Phone className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Call completed</p>
                        <p className="text-xs text-gray-500">Yesterday</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">Meeting scheduled</p>
                        <p className="text-xs text-gray-500">3 days ago</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GennoorBot */}
      <GennoorBot />
    </div>
  )
}