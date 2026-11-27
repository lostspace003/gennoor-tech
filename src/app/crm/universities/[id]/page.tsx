'use client'

import { Suspense } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import UniversityWorkspace from '@/components/crm/UniversityWorkspace'
import { isAdminUser } from '@/lib/crm/users'

// One university, on its own page. The same people as the list may open it.
export default function UniversityPage() {
  const { data: session } = useSession()
  const params = useParams<{ id: string }>()
  if (!isAdminUser(session?.user?.email)) return <p className="p-6 text-sm text-gray-600">This page is for the administrators of the CRM.</p>
  const id = String(params?.id || '')
  if (!/^GEN-\d{3}$/.test(id)) return <p className="p-6 text-sm text-gray-600">That university does not exist.</p>
  return <Suspense fallback={<p className="p-6 text-sm text-gray-500">Reading the university…</p>}><UniversityWorkspace id={id} /></Suspense>
}
