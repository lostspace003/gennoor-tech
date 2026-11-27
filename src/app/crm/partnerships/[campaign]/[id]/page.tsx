'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import UniversityWorkspace from '@/components/crm/UniversityWorkspace'
import { campaignByKey, campaignOfId } from '@/data/partnership-campaigns'
import { isAdminUser } from '@/lib/crm/users'

// One entry of a campaign, on its own page. The same people as the list may open it, and the id must belong to the campaign in the address.
export default function PartnershipEntryPage() {
  const { data: session } = useSession()
  const params = useParams<{ campaign: string; id: string }>()
  if (!isAdminUser(session?.user?.email)) return <p className="p-6 text-sm text-gray-600">This page is for the administrators of the CRM.</p>
  const id = String(params?.id || '')
  const campaign = campaignByKey(params?.campaign)
  if (!campaign || campaignOfId(id)?.key !== campaign.key) return <p className="p-6 text-sm text-gray-600">That page does not exist.</p>
  return <Suspense fallback={<p className="p-6 text-sm text-gray-500">Reading…</p>}><UniversityWorkspace id={id} /></Suspense>
}
