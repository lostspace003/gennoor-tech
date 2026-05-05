'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function InterestRedirectPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const option = searchParams.get('option') || ''
    const email = searchParams.get('email') || ''
    const name = searchParams.get('name') || ''
    const params = new URLSearchParams({ topic: 'ai-readiness', option, email, name })
    router.replace(`/resources/calendar?${params.toString()}`)
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Redirecting to booking...</p>
    </div>
  )
}
