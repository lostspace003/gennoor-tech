'use client'

import { use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCrm } from '@/components/crm/CrmContext'
import LeadWorkspace from '@/components/crm/LeadWorkspace'

export default function LeadPage({ params }: { params: Promise<{ id: string[] }> }) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { leads, loading, isManager, reload, notify } = useCrm()

  // Lead ids can contain slashes (linkedin.com/in/...). Encoded links arrive
  // as one segment; older unencoded links arrive split — rejoin either way.
  const leadId = (Array.isArray(id) ? id : [id])
    .map((s) => { try { return decodeURIComponent(s) } catch { return s } })
    .join('/')
  const lead = leads.find((l) => l.id === leadId)

  if (!lead) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        {loading ? 'Loading lead...' : (
          <>
            Lead not found.{' '}
            <button onClick={() => router.push('/crm/leads')} className="text-primary-600 underline">Back to leads</button>
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
