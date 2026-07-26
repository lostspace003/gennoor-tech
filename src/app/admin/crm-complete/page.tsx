'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  LayoutGrid, Users, TrendingUp, Inbox, Calendar, FolderOpen,
  LogOut, RefreshCw, User, AlertCircle,
} from 'lucide-react'
import { Lead } from '@/lib/crm/types'
import LeadsView from './components/LeadsView'
import LeadWorkspace from './components/LeadWorkspace'
import CrmCopilot from './components/CrmCopilot'
import { DashboardView, PipelineView, InboxView, SchedulerView, DocumentsView } from './components/OtherViews'

type View = 'dashboard' | 'leads' | 'pipeline' | 'inbox' | 'scheduler' | 'documents'

const NAV: Array<{ id: View; label: string; icon: any }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
  { id: 'leads', label: 'Leads', icon: Users },
  { id: 'pipeline', label: 'Pipeline', icon: TrendingUp },
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'scheduler', label: 'Scheduler', icon: Calendar },
  { id: 'documents', label: 'Documents', icon: FolderOpen },
]

export default function CRMPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [view, setView] = useState<View>('dashboard')
  const [leads, setLeads] = useState<Lead[]>([])
  const [openLeadId, setOpenLeadId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [toast, setToast] = useState<{ msg: string; isError: boolean } | null>(null)

  const isAdmin = session?.user?.email === 'admin@gennoor.com'

  const notify = useCallback((msg: string, isError = false) => {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), isError ? 7000 : 4000)
  }, [])

  const loadLeads = useCallback(async () => {
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
    if (status === 'unauthenticated') {
      router.push('/admin/login?callbackUrl=/admin/crm-complete')
    }
    if (status === 'authenticated') loadLeads()
  }, [status, router, loadLeads])

  const openLead = useMemo(
    () => (openLeadId ? leads.find((l) => l.id === openLeadId) || null : null),
    [openLeadId, leads]
  )

  if (status === 'loading') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading Gennoor CRM...</p>
        </div>
      </div>
    )
  }
  if (status === 'unauthenticated') return null

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logos/gennoor-tech-compact-dark.svg" alt="Gennoor Tech" className="h-9 w-auto" />
          <div className="text-[10px] text-gray-400 tracking-[0.2em] mt-1.5">TRAIN. INNOVATE. BUILD.</div>
        </div>

        <nav className="flex-1 p-3">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => { setView(item.id); setOpenLeadId(null) }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg mb-1 transition-all ${view === item.id && !openLeadId ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <span className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </span>
              {item.id === 'leads' && <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{leads.length}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{session?.user?.email?.split('@')[0]}</div>
              <div className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Team member'}</div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <h1 className="text-lg font-semibold text-gray-900">
            {openLead ? 'Lead Workspace' : NAV.find((n) => n.id === view)?.label}
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={() => { setLoading(true); loadLeads().then(() => notify('Refreshed')) }} className="p-2 hover:bg-gray-100 rounded-lg" title="Refresh data">
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error banner — honest failure, never fake data */}
        {loadError && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 flex items-center gap-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Could not load leads: {loadError}
            <button onClick={() => { setLoading(true); loadLeads() }} className="underline ml-1">Retry</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {loading && leads.length === 0 && !loadError ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">Loading leads...</div>
          ) : openLead ? (
            <LeadWorkspace
              lead={openLead}
              isAdmin={isAdmin}
              onClose={() => setOpenLeadId(null)}
              onReload={loadLeads}
              notify={notify}
            />
          ) : (
            <>
              {view === 'dashboard' && <DashboardView leads={leads} onGoLeads={() => setView('leads')} onOpenLead={setOpenLeadId} />}
              {view === 'leads' && <LeadsView leads={leads} isAdmin={isAdmin} onOpenLead={setOpenLeadId} onReload={loadLeads} notify={notify} />}
              {view === 'pipeline' && <PipelineView leads={leads} onOpenLead={setOpenLeadId} />}
              {view === 'inbox' && <InboxView onOpenLead={(id) => { setOpenLeadId(id) }} />}
              {view === 'scheduler' && <SchedulerView onOpenLead={setOpenLeadId} />}
              {view === 'documents' && <DocumentsView isAdmin={isAdmin} notify={notify} />}
            </>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2.5 rounded-lg shadow-lg text-sm text-white ${toast.isError ? 'bg-red-600' : 'bg-gray-900'}`}>
          {toast.msg}
        </div>
      )}

      {/* GennoorBot CRM copilot */}
      <CrmCopilot />
    </div>
  )
}
