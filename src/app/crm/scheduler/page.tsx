'use client'

import { useRouter } from 'next/navigation'
import { SchedulerView } from '@/components/crm/OtherViews'

export default function SchedulerPage() {
  const router = useRouter()
  return <SchedulerView onOpenLead={(id) => router.push(`/crm/leads/${encodeURIComponent(id)}`)} />
}
