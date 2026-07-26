'use client'

import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCrm } from '@/components/crm/CrmContext'
import LeadWorkspace from '@/components/crm/LeadWorkspace'

export default function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { leads, loading, isManager, reload, notify } = useCrm()

  const lead = leads.find((l) => l.id === decodeURIComponent(id))

  if (!lead) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        {loading ? 'Loading lead...' : (
          <>
            Lead not found.{' '}
            <button onClick={() => router.push('/crm/leads')} className="text-blue-600 underline">Back to leads</button>
          </>
        )}
      </div>
    )
  }

  return (
    <LeadWorkspace
      lead={lead}
      canManage={isManager}
      onClose={() => router.push('/crm/leads')}
      onReload={reload}
      notify={notify}
      initialTab={searchParams.get('tab') || undefined}
    />
  )
}
