'use client'

import { useRouter } from 'next/navigation'
import { useCrm } from '@/components/crm/CrmContext'
import { DashboardView } from '@/components/crm/OtherViews'

export default function DashboardPage() {
  const router = useRouter()
  const { leads } = useCrm()
  return (
    <DashboardView
      leads={leads}
      onGoLeads={() => router.push('/crm/leads')}
      onOpenLead={(id) => router.push(`/crm/leads/${encodeURIComponent(id)}`)}
    />
  )
}
