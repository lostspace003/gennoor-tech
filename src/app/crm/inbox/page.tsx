'use client'

import { useRouter } from 'next/navigation'
import { InboxView } from '@/components/crm/OtherViews'

export default function InboxPage() {
  const router = useRouter()
  // A message opens its lead on the Emails tab; one still waiting for an answer opens the reply window too
  return <InboxView onOpenLead={(id, reply) => router.push(`/crm/leads/${encodeURIComponent(id)}?tab=emails${reply ? '&reply=1' : ''}`)} />
}
