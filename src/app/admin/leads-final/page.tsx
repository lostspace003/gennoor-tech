'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import GennoorBot from '@/components/GennoorBot/GennoorBot'
import CompactLeadsTable from '@/components/admin/leads/CompactLeadsTable'
import {
  Users, Upload, Download, Filter, BarChart3,
  Target, Mail, Calendar, TrendingUp, Home
} from 'lucide-react'
import Link from 'next/link'

export default function LeadsFinalPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Auth check
  useEffect(() => {
    if (status === 'loading') return
    const authorizedEmails = [
      'admin@gennoor.com',
      'contact@gennoor.com',
      'yusufchaudhary@gennoor.com',
      'jalalkhan@gennoor.com'
    ]
    if (!session || !authorizedEmails.includes(session.user?.email || '')) {
      router.push('/admin/login')
    }
  }, [session, status, router])

  const stats = [
    { label: 'Total Leads', value: '166', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Hot Leads', value: '24', icon: Target, color: 'from-red-500 to-red-600' },
    { label: 'Emails Sent', value: '47', icon: Mail, color: 'from-purple-500 to-purple-600' },
    { label: 'Meetings', value: '5', icon: Calendar, color: 'from-green-500 to-green-600' },
  ]

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Clean, Compact Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between">
            {/* Left: Navigation */}
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Home className="w-4 h-4 text-gray-600" />
              </Link>
              <div className="h-5 w-px bg-gray-300" />
              <h1 className="text-base font-semibold text-gray-900">Lead Management</h1>
              <span className="text-xs text-gray-500">Powered by AI</span>
            </div>

            {/* Right: User & Actions */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">
                {session?.user?.email?.split('@')[0]}
              </span>
              <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Upload Excel
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Compact Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
                  </div>
                  <div className={`p-2 bg-gradient-to-br ${stat.color} rounded-lg`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Leads Table */}
        <CompactLeadsTable />
      </div>

      {/* GennoorBot - Always Available */}
      <GennoorBot />
    </div>
  )
}