'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import LeadsHeader from '@/components/admin/leads/LeadsHeader'
import LeadsFilters from '@/components/admin/leads/LeadsFilters'
import LeadsStats from '@/components/admin/leads/LeadsStats'

// Dynamic import for client components
const LeadsTable = dynamic(() => import('@/components/admin/leads/LeadsTable'), {
  ssr: false,
  loading: () => <LeadsTableSkeleton />
})

const LeadsAIPanel = dynamic(() => import('@/components/admin/leads/LeadsAIPanel'), {
  ssr: false
})

function LeadsTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50">
            <div className="w-10 h-10 bg-gray-200 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
            <div className="h-6 bg-gray-200 rounded-full w-20" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LeadsPageV2() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      {/* Smooth gradient background */}
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-50/20 via-transparent to-purple-50/20 pointer-events-none" />

      <div className="relative">
        {/* Header with navigation */}
        <LeadsHeader />

        {/* Main Content Area */}
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats Cards */}
          <Suspense fallback={<div className="h-24" />}>
            <LeadsStats />
          </Suspense>

          {/* Filters Bar */}
          <LeadsFilters />

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-6 mt-6">
            {/* Leads Table/Cards */}
            <div className="col-span-12 lg:col-span-8">
              <LeadsTable />
            </div>

            {/* AI Assistant Panel */}
            <div className="col-span-12 lg:col-span-4">
              <LeadsAIPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}