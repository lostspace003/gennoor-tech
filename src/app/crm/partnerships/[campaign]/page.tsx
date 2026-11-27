'use client'

import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import UniversitiesView from '@/components/crm/UniversitiesView'
import { campaignByKey } from '@/data/partnership-campaigns'
import { isAdminUser } from '@/lib/crm/users'

// One partnership campaign, for the people who may open the whole back office. The key in the address is one of ours or nothing.
export default function PartnershipPage() {
  const { data: session } = useSession()
  const params = useParams<{ campaign: string }>()
  if (!isAdminUser(session?.user?.email)) return <p className="p-6 text-sm text-gray-600">This page is for the administrators of the CRM.</p>
  const campaign = campaignByKey(params?.campaign)
  if (!campaign) return <p className="p-6 text-sm text-gray-600">That campaign does not exist.</p>
  return <UniversitiesView key={campaign.key} campaign={campaign} />
}
