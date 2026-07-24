'use client'

import { useState } from 'react'
import CompactLeadsTable from '@/components/admin/leads/CompactLeadsTable'
import {
  Users, Bot, Mail, Calendar, Upload,
  BarChart3, TrendingUp, Target, Clock
} from 'lucide-react'

export default function CompactLeadsPage() {
  const [showAIPanel, setShowAIPanel] = useState(false)

  const stats = [
    { label: 'Total Leads', value: '166', icon: Users, color: 'text-blue-600' },
    { label: 'Hot Leads', value: '24', icon: Target, color: 'text-red-600' },
    { label: 'Contacted', value: '47', icon: Mail, color: 'text-purple-600' },
    { label: 'Meetings', value: '5', icon: Calendar, color: 'text-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-[1600px] mx-auto px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-gradient-to-br from-purple-600 to-blue-600 rounded">
                <Users className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-base font-semibold text-gray-900">Lead Management Center</h1>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className="px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 flex items-center gap-1"
              >
                <Bot className="w-3 h-3" />
                AI Assistant
              </button>
              <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Campaign
              </button>
              <button className="px-3 py-1 border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-50 flex items-center gap-1">
                <Upload className="w-3 h-3" />
                Upload
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-3 py-3">
        {/* Compact Stats */}
        <div className="grid grid-cols-4 gap-2 mb-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded border border-gray-200 p-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-3">
          {/* Leads Table */}
          <div className={showAIPanel ? 'col-span-9' : 'col-span-12'}>
            <CompactLeadsTable />
          </div>

          {/* AI Panel */}
          {showAIPanel && (
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
                <div className="p-2 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-900">AI Assistant</span>
                    </div>
                    <button
                      onClick={() => setShowAIPanel(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-3 overflow-y-auto">
                  <div className="space-y-2">
                    <div className="bg-gray-100 rounded p-2 text-xs text-gray-700">
                      Hello! I can help you research companies, find contacts, and draft emails.
                    </div>
                  </div>
                </div>

                <div className="p-2 border-t border-gray-200">
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Ask about leads..."
                      className="flex-1 px-2 py-1 text-xs border border-gray-200 rounded focus:ring-1 focus:ring-purple-500"
                    />
                    <button className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}