'use client'

import { useRouter } from 'next/navigation'
import { useCrm } from '@/components/crm/CrmContext'
import { PipelineView } from '@/components/crm/OtherViews'

export default function PipelinePage() {
  const router = useRouter()
  const { leads } = useCrm()
  return <PipelineView leads={leads} onOpenLead={(id) => router.push(`/crm/leads/${encodeURIComponent(id)}`)} />
}
