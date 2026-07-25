'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CRMRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/crm/dashboard')
  }, [router])

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Loading CRM...</p>
      </div>
    </div>
  )
}