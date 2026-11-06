'use client'

import { useCallback, useEffect, useState } from 'react'
import type { Auth } from './types'

/** The site-wide learner session (learner-session cookie). null = still checking. */
export function useLearner() {
  const [auth, setAuth] = useState<Auth>(null)
  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/learner/session', { cache: 'no-store' })
      const j = await r.json().catch(() => null)
      setAuth(j && j.authenticated ? { email: j.email, name: j.name } : false)
    } catch {
      setAuth(false)
    }
  }, [])
  useEffect(() => { refresh() }, [refresh])
  return { auth, refresh }
}

export function store<T>(key: string): T | null
export function store<T>(key: string, value: T): void
export function store<T>(key: string, value?: T): T | null | void {
  try {
    if (value === undefined) {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : null
    }
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    return null
  }
}
