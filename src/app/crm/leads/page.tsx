'use client'

import { useRouter } from 'next/navigation'
import { useCrm } from '@/components/crm/CrmContext'
import LeadsView from '@/components/crm/LeadsView'

export default function LeadsPage() {
  const router = useRouter()
  const { leads, isManager, reload, notify } = useCrm()
  return (
    <LeadsView
      leads={leads}
      canManage={isManager}
      onOpenLead={(id) => router.push(`/crm/leads/${encodeURIComponent(id)}`)}
      onReload={reload}
      notify={notify}
    />
  )
}
