'use client'

import { Suspense, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

function InterestRedirect() {
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

export default function InterestRedirectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Redirecting...</p></div>}>
      <InterestRedirect />
    </Suspense>
  )
}
