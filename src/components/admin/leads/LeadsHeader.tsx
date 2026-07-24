'use client'

import { useState } from 'react'
import {
  Users, Upload, Download, Info, ChevronLeft,
  LayoutGrid, List, Columns3, Settings,
  Home, Target, Mail, Calendar, BarChart3
} from 'lucide-react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function LeadsHeader() {
  const { data: session } = useSession()
  const [showGuide, setShowGuide] = useState(false)

  return (
    <>
      {/* Top Navigation Bar - Compact */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-[1600px] mx-auto">
          {/* Primary Nav - Compact */}
          <div className="px-3 h-12 flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-6">
              <Link href="/admin" className="flex items-center gap-2 group">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:shadow-lg transition-all">
                  <Home className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-600 hidden sm:block">Admin</span>
              </Link>

              <div className="h-6 w-px bg-gray-200" />

              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-gradient-to-br from-purple-500 to-purple-600 rounded">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-gray-900">Lead Intelligence Hub</h1>
                  <p className="text-xs text-gray-500 hidden sm:block">AI-Powered CRM</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Info Guide Button */}
              <button
                onClick={() => setShowGuide(!showGuide)}
                className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors group"
                title="Quick Guide"
              >
                <Info className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                {showGuide && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-50">
                    <h3 className="font-semibold text-gray-900 mb-3">Quick Navigation Guide</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex gap-2">
                        <div className="w-1 bg-blue-500 rounded" />
                        <div>
                          <p className="font-medium text-gray-700">Upload Leads</p>
                          <p className="text-gray-500 text-xs">Excel/CSV with flexible schema - missing fields get NA</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1 bg-purple-500 rounded" />
                        <div>
                          <p className="font-medium text-gray-700">AI Research</p>
                          <p className="text-gray-500 text-xs">Click sparkle icon to auto-research any lead</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1 bg-green-500 rounded" />
                        <div>
                          <p className="font-medium text-gray-700">Email Campaign</p>
                          <p className="text-gray-500 text-xs">Select leads → Compose → AI drafts personalized emails</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1 bg-orange-500 rounded" />
                        <div>
                          <p className="font-medium text-gray-700">Column Management</p>
                          <p className="text-gray-500 text-xs">Click settings to show/hide columns as needed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </button>

              <div className="h-6 w-px bg-gray-200" />

              {/* User Info */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {session?.user?.email?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm text-gray-600 hidden sm:block">
                  {session?.user?.email?.split('@')[0]}
                </span>
              </div>

              <button
                onClick={() => signOut()}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="px-4 sm:px-6 lg:px-8 border-t border-gray-100">
            <nav className="flex items-center gap-1 -mb-px h-12">
              <Link href="/admin/leads-v2" className="flex items-center gap-2 px-4 py-2 border-b-2 border-blue-500 text-blue-600">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">Pipeline</span>
              </Link>
              <Link href="/admin/leads-v2/campaigns" className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all">
                <Mail className="w-4 h-4" />
                <span className="text-sm font-medium">Campaigns</span>
              </Link>
              <Link href="/admin/leads-v2/calendar" className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Calendar</span>
              </Link>
              <Link href="/admin/leads-v2/analytics" className="flex items-center gap-2 px-4 py-2 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-all">
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Analytics</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}