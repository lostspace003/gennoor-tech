'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Lead } from '@/lib/crm/types'
import { CRM_USERS, CRM_ADMIN, isCrmManager } from '@/lib/crm/users'

/** A question put to the person in a small window of the page (never the browser's own grey pop-up). */
export interface AskOptions {
  title: string
  /** One or two lines under the title. */
  text?: string
  /** Ask for a line of text as well. */
  input?: { placeholder?: string; required?: boolean; initial?: string; label?: string }
  /** The word on the button that goes ahead. */
  confirm?: string
  /** A step that cannot be taken back: the button is red. */
  danger?: boolean
}

interface CrmContextValue {
  leads: Lead[]
  loading: boolean
  loadError: string
  reload: () => Promise<void>
  notify: (msg: string, isError?: boolean) => void
  /**
   * Asks before doing something. Gives back what was typed ('' when nothing was asked for), or null when
   * the person pressed Cancel.
   */
  ask: (options: AskOptions) => Promise<string | null>
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
  /** Why the mailboxes could not be read, in plain words; '' when they could. */
  mailNote: string
}

/** Everyone with CRM access (the list lives in lib/crm/users.ts). */
export const CRM_TEAM_EMAILS = CRM_USERS

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
  const [mailNote, setMailNote] = useState('')
  const [question, setQuestion] = useState<(AskOptions & { answer: (value: string | null) => void }) | null>(null)
  const [typed, setTyped] = useState('')
  const field = useRef<HTMLInputElement>(null)

  const realEmail = session?.user?.email || ''
  const isAdmin = realEmail.toLowerCase() === CRM_ADMIN
  const isManager = isCrmManager(realEmail)

  const notify = useCallback((msg: string, isError = false) => {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), isError ? 7000 : 4000)
  }, [])

  const ask = useCallback((options: AskOptions) => new Promise<string | null>((resolve) => {
    setTyped(options.input?.initial || '')
    setQuestion({ ...options, answer: resolve })
  }), [])
  const close = (value: string | null) => { question?.answer(value); setQuestion(null) }
  useEffect(() => { if (question?.input) field.current?.focus() }, [question])

  const reload = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/leads')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'The leads could not be loaded')
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

  // The mailboxes are looked at when the CRM opens and every three minutes while it is open. A reply moves its
  // lead to Talking on the server (lib/crm/replies.ts); when that happened, the leads are loaded again so every
  // list on screen is right. (The server also looks every 15 minutes with nobody here.)
  useEffect(() => {
    if (status !== 'authenticated') return
    let stopped = false
    const check = async () => {
      if (document.hidden) return
      try {
        const res = await fetch('/api/admin/leads/inbox')
        const data = await res.json()
        if (stopped || !res.ok) return
        setMailNote(data.error || data.note || '')
        if (data.changed > 0) await reload()
      } catch { /* a missed look is made up three minutes later */ }
    }
    check()
    const timer = setInterval(check, 180_000)
    return () => { stopped = true; clearInterval(timer) }
  }, [status, reload])

  const canGo = !question?.input?.required || typed.trim().length > 0

  return (
    <CrmContext.Provider
      value={{
        leads,
        loading,
        loadError,
        reload,
        notify,
        ask,
        isAdmin,
        isManager,
        // Views scope to the observed colleague when a manager is looking at
        // someone's desk; permissions above always come from the real account.
        userEmail: isManager && viewAs ? viewAs : realEmail,
        realEmail,
        viewAs: isManager ? viewAs : '',
        setViewAs: (email: string) => setViewAs(isManager ? email : ''),
        mailNote,
      }}
    >
      {children}
      {question && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="crm-ask-title" onKeyDown={(e) => { if (e.key === 'Escape') close(null) }}>
          <form
            className="w-full max-w-md rounded-xl bg-white shadow-xl"
            onSubmit={(e) => { e.preventDefault(); if (canGo) close(question.input ? typed.trim() : '') }}
          >
            <div className="px-5 pt-5 pb-4 space-y-2">
              <h3 id="crm-ask-title" className="text-base font-semibold text-gray-900">{question.title}</h3>
              {question.text && <p className="text-sm text-gray-600 whitespace-pre-line">{question.text}</p>}
              {question.input && (
                <div className="pt-1">
                  {question.input.label && <label htmlFor="crm-ask-field" className="block text-xs text-gray-500 mb-1">{question.input.label}</label>}
                  <input
                    id="crm-ask-field"
                    ref={field}
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    placeholder={question.input.placeholder}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
            <div className="px-5 py-3.5 border-t border-gray-200 flex justify-end gap-2">
              <button type="button" onClick={() => close(null)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button
                type="submit"
                disabled={!canGo}
                autoFocus={!question.input}
                className={`px-4 py-2 rounded-lg text-sm text-white disabled:opacity-50 ${question.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-600 hover:bg-primary-700'}`}
              >
                {question.confirm || 'OK'}
              </button>
            </div>
          </form>
        </div>
      )}
      {toast && (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-[90] px-4 py-2.5 rounded-lg shadow-lg text-sm text-white max-w-[92vw] ${toast.isError ? 'bg-red-600' : 'bg-gray-900'}`}>
          {toast.msg}
        </div>
      )}
    </CrmContext.Provider>
  )
}
