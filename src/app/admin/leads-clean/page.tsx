'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import GennoorBot from '@/components/GennoorBot/GennoorBot'
import {
  Users, Search, Filter, Sparkles, Mail,
  ChevronRight, Upload, Check, ArrowRight,
  Building2, User, Target, Send
} from 'lucide-react'

type ViewMode = 'overview' | 'select' | 'research' | 'action'

export default function LeadsCleanPage() {
  const { data: session } = useSession()
  const [currentView, setCurrentView] = useState<ViewMode>('overview')
  const [selectedLeads, setSelectedLeads] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  // Mock data for demo
  const mockLeads = Array.from({ length: 20 }, (_, i) => ({
    id: `lead-${i + 1}`,
    name: `Contact ${i + 1}`,
    email: `contact${i + 1}@company.com`,
    company: `Company ${Math.floor(i / 3) + 1}`,
    status: ['new', 'contacted', 'replied'][i % 3],
    priority: ['high', 'medium', 'low'][i % 3]
  }))

  const filteredLeads = mockLeads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const steps = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'select', label: 'Select Leads', icon: Target },
    { id: 'research', label: 'Research', icon: Sparkles },
    { id: 'action', label: 'Take Action', icon: Send }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Lead Intelligence</h1>
              <p className="text-sm text-gray-500">Simple. Clear. Powerful.</p>
            </div>
            <div className="text-sm text-gray-600">
              Welcome, {session?.user?.email?.split('@')[0]}
            </div>
          </div>
        </div>
      </header>

      {/* Step Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentView === step.id
              const isCompleted = steps.findIndex(s => s.id === currentView) > index

              return (
                <div key={step.id} className="flex items-center">
                  <button
                    onClick={() => setCurrentView(step.id as ViewMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : isCompleted
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{step.label}</span>
                    {isCompleted && <Check className="w-3 h-3" />}
                  </button>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Overview */}
        {currentView === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Welcome to Your Lead Center
              </h2>
              <p className="text-gray-600 mb-8">
                Manage your 166 leads with a simple, clear workflow
              </p>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-blue-600">166</div>
                  <div className="text-sm text-gray-600">Total Leads</div>
                </div>
                <div className="bg-green-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-green-600">24</div>
                  <div className="text-sm text-gray-600">Hot Leads</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-purple-600">5</div>
                  <div className="text-sm text-gray-600">Meetings</div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setCurrentView('select')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Start Managing Leads
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload Excel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Select Leads */}
        {currentView === 'select' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 1: Select Leads to Work With
              </h2>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex gap-2 mb-6">
                <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200">
                  Hot Leads
                </button>
                <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200">
                  New Leads
                </button>
                <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200">
                  Follow-up Today
                </button>
              </div>

              {/* Simple Lead List */}
              <div className="space-y-2 mb-6">
                {filteredLeads.slice(0, 10).map(lead => (
                  <label
                    key={lead.id}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
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
                      className="mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-600">{lead.company} • {lead.email}</div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      lead.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : lead.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {lead.priority}
                    </span>
                  </label>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {selectedLeads.length} leads selected
                </div>
                <button
                  onClick={() => setCurrentView('research')}
                  disabled={selectedLeads.length === 0}
                  className={`px-6 py-2 rounded-lg flex items-center gap-2 ${
                    selectedLeads.length > 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next: Research
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Research */}
        {currentView === 'research' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 2: Research Selected Leads
              </h2>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-700">
                  Researching {selectedLeads.length} selected leads...
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button className="p-6 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <Sparkles className="w-8 h-8 text-purple-600 mb-3" />
                  <div className="font-medium text-gray-900">AI Research</div>
                  <div className="text-sm text-gray-600 mt-1">Auto-research companies</div>
                </button>

                <button className="p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <User className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="font-medium text-gray-900">Find Contacts</div>
                  <div className="text-sm text-gray-600 mt-1">Discover decision makers</div>
                </button>

                <button className="p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <Building2 className="w-8 h-8 text-green-600 mb-3" />
                  <div className="font-medium text-gray-900">Company Info</div>
                  <div className="text-sm text-gray-600 mt-1">Size, revenue, tech stack</div>
                </button>

                <button className="p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                  <Target className="w-8 h-8 text-orange-600 mb-3" />
                  <div className="font-medium text-gray-900">Opportunities</div>
                  <div className="text-sm text-gray-600 mt-1">Identify pain points</div>
                </button>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setCurrentView('action')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  Next: Take Action
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Take Action */}
        {currentView === 'action' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 3: Take Action on Leads
              </h2>

              <div className="grid grid-cols-3 gap-4">
                <button className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition-all border border-blue-200">
                  <Mail className="w-8 h-8 text-blue-600 mb-3" />
                  <div className="font-medium text-gray-900">Send Email</div>
                  <div className="text-sm text-gray-600 mt-1">AI-drafted campaigns</div>
                </button>

                <button className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all border border-green-200">
                  <Send className="w-8 h-8 text-green-600 mb-3" />
                  <div className="font-medium text-gray-900">Schedule Meeting</div>
                  <div className="text-sm text-gray-600 mt-1">Book calendar slots</div>
                </button>

                <button className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all border border-purple-200">
                  <Target className="w-8 h-8 text-purple-600 mb-3" />
                  <div className="font-medium text-gray-900">Create Proposal</div>
                  <div className="text-sm text-gray-600 mt-1">Generate custom offers</div>
                </button>
              </div>

              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">Ready to execute!</div>
                    <div className="text-sm text-green-700">
                      {selectedLeads.length} leads researched and ready for action
                    </div>
                  </div>
                </div>
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