'use client'

import { useState, useEffect, useCallback } from 'react'

interface LearnerSession {
  email: string
  name: string
  provider: 'otp' | 'google' | 'microsoft'
}

export function useLearnerAuth() {
  const [session, setSession] = useState<LearnerSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/learner/session')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.authenticated) setSession(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const logout = useCallback(async () => {
    await fetch('/api/learner/logout', { method: 'POST' })
    setSession(null)
  }, [])

  const refreshSession = useCallback(async () => {
    const res = await fetch('/api/learner/session')
    if (res.ok) {
      const data = await res.json()
      if (data?.authenticated) {
        setSession(data)
        return data
      }
    }
    return null
  }, [])

  return { session, loading, logout, refreshSession, isLoggedIn: !!session }
}
