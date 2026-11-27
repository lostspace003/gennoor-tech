'use client'

import { useSession } from 'next-auth/react'
import UniversitiesView from '@/components/crm/UniversitiesView'
import { isAdminUser } from '@/lib/crm/users'

// The University Partnership campaign: its own place in the CRM, for the people who may open the whole back office.
export default function UniversitiesPage() {
  const { data: session } = useSession()
  if (!isAdminUser(session?.user?.email)) {
    return <p className="p-6 text-sm text-gray-600">This page is for the administrators of the CRM.</p>
  }
  return <UniversitiesView />
}
