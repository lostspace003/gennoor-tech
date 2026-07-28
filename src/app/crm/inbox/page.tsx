'use client'

import { useRouter } from 'next/navigation'
import { InboxView } from '@/components/crm/OtherViews'

export default function InboxPage() {
  const router = useRouter()
  return <InboxView onOpenLead={(id) => router.push(`/crm/leads/${encodeURIComponent(id)}`)} />
}
