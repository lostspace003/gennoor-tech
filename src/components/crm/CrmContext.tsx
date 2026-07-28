'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Lead } from '@/lib/crm/types'

interface CrmContextValue {
  leads: Lead[]
  loading: boolean
  loadError: string
  reload: () => Promise<void>
  notify: (msg: string, isError?: boolean) => void
  isAdmin: boolean
  isManager: boolean
  userEmail: string
}

// Mirrors CRM_MANAGERS in src/lib/crm/access.ts (API is the enforcer;
// this only controls what the UI offers).
const MANAGERS = ['admin@gennoor.com', 'yusufchaudhary@gennoor.com']

const CrmContext = createContext<CrmContextValue | null>(null)

export function useCrm(): CrmContextValue {
  const ctx = useContext(CrmContext)
  if (!ctx) throw new Error('useCrm must be used inside CrmProvider')
  return ctx
}

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [toast, setToast] = useState<{ msg: string; isError: boolean } | null>(null)

  const notify = useCallback((msg: string, isError = false) => {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), isError ? 7000 : 4000)
  }, [])

  const reload = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/leads')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load leads')
      setLeads(data.leads || [])
      setLoadError('')
    } catch (e: any) {
      setLoadError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'authenticated') reload()
  }, [status, reload])

  return (
    <CrmContext.Provider
      value={{
        leads,
        loading,
        loadError,
        reload,
        notify,
        isAdmin: session?.user?.email === 'admin@gennoor.com',
        isManager: MANAGERS.includes(session?.user?.email?.toLowerCase() || ''),
        userEmail: session?.user?.email || '',
      }}
    >
      {children}
      {toast && (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[70] px-4 py-2.5 rounded-lg shadow-lg text-sm text-white max-w-[92vw] ${toast.isError ? 'bg-red-600' : 'bg-gray-900'}`}>
          {toast.msg}
        </div>
      )}
    </CrmContext.Provider>
  )
}
