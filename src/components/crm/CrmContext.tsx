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
  /**
   * The email every view scopes to — "My leads", the work queue, the
   * dashboard. Normally the signed-in user; while viewing as a colleague it
   * becomes theirs, which is what makes the whole CRM show their desk.
   */
  userEmail: string
  /** The actual signed-in account. Permissions always derive from this. */
  realEmail: string
  /** Colleague being observed, '' when off. Managers only. */
  viewAs: string
  setViewAs: (email: string) => void
}

/** Whose desk a manager can look at. Mirrors CRM_USERS in ./access.ts. */
export const CRM_TEAM_EMAILS = [
  'admin@gennoor.com',
  'jalalkhan@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'aditya@gennoor.com',
  'deepanshu@gennoor.com',
  'zaid@gennoor.com',
  'sales@gennoor.com',
]

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
  const [viewAs, setViewAs] = useState('')

  const realEmail = session?.user?.email || ''
  const isAdmin = realEmail === 'admin@gennoor.com'
  const isManager = MANAGERS.includes(realEmail.toLowerCase())

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
        isAdmin,
        isManager,
        // Views scope to the observed colleague when a manager is looking at
        // someone's desk; permissions above always come from the real account.
        userEmail: isManager && viewAs ? viewAs : realEmail,
        realEmail,
        viewAs: isManager ? viewAs : '',
        setViewAs: (email: string) => setViewAs(isManager ? email : ''),
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
