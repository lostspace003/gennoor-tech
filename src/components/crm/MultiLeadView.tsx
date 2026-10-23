'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, Users, PanelRightClose } from 'lucide-react'
import { useCrm } from './CrmContext'
import LeadWorkspace from './LeadWorkspace'
import { StatusBadge } from './shared'

// Several leads open at once, as tabs on one CRM page. The open set lives in
// the URL (?id=…&id=…) so a refresh, a back button or a shared link all restore
// the same desk. Crossing a tab drops that lead; crossing the page — or the
// last tab — lands back on My leads, per the rule that closing a multi-select
// always returns the user to their own leads.
export default function MultiLeadView() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { leads, loading, isManager, reload, notify } = useCrm()

  const ids = useMemo(() => {
    const raw = searchParams.getAll('id')
    // De-dupe but keep the order the user selected them in
    return [...new Set(raw.map((s) => { try { return decodeURIComponent(s) } catch { return s } }))]
  }, [searchParams])

  const [activeId, setActiveId] = useState<string>('')

  // Open leads, in URL order; ids that no longer resolve are shown as misses
  const open = ids.map((id) => ({ id, lead: leads.find((l) => l.id === id) }))
  const resolved = open.filter((o) => o.lead)
  const missing = open.filter((o) => !o.lead).length

  // Keep the active tab valid as tabs close or leads finish loading
  const resolvedKey = resolved.map((o) => o.id).join('|')
  useEffect(() => {
    const openIds = resolvedKey ? resolvedKey.split('|') : []
    if (openIds.length === 0) return
    if (!activeId || !openIds.includes(activeId)) setActiveId(openIds[0])
  }, [resolvedKey, activeId])

  const backToMine = () => router.push('/crm/leads?scope=mine')

  const closeTab = (id: string) => {
    const next = ids.filter((x) => x !== id)
    if (next.length === 0) { backToMine(); return }
    router.replace(`/crm/leads/multi?${next.map((x) => `id=${encodeURIComponent(x)}`).join('&')}`)
    if (activeId === id) setActiveId(next[0])
  }

  if (ids.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        No leads open.{' '}
        <button onClick={backToMine} className="text-primary-600 underline">Back to my leads</button>
      </div>
    )
  }

  if (loading && resolved.length === 0) {
    return <div className="p-8 text-center text-sm text-gray-500">Opening {ids.length} leads…</div>
  }

  if (resolved.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-gray-500">
        None of the {ids.length} selected leads could be found.{' '}
        <button onClick={backToMine} className="text-primary-600 underline">Back to my leads</button>
      </div>
    )
  }

  const active = resolved.find((o) => o.id === activeId)?.lead || resolved[0].lead!

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Tab strip — one chip per open lead, each closable */}
      <div className="border-b border-gray-200 bg-[#fafafa] px-2 sm:px-3 py-2 flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 shrink-0 pl-1">
          <Users className="w-3.5 h-3.5" /> {resolved.length} open
        </span>
        <div className="flex-1 flex items-center gap-1.5 overflow-x-auto min-w-0">
          {resolved.map(({ id, lead }) => {
            const isActive = id === active.id
            return (
              <span
                key={id}
                className={`group inline-flex items-center rounded-lg border text-xs whitespace-nowrap shrink-0 transition-colors ${
                  isActive ? 'bg-white border-gray-300 shadow-sm' : 'bg-transparent border-transparent hover:bg-white/70'
                }`}
              >
                <button
                  onClick={() => setActiveId(id)}
                  className={`pl-2.5 pr-1.5 py-1.5 flex items-center gap-1.5 max-w-[14rem] ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}
                  title={[lead!.name, lead!.company].filter(Boolean).join(' · ')}
                >
                  <span className="truncate">{lead!.name}</span>
                  <StatusBadge status={lead!.status} />
                </button>
                <button
                  onClick={() => closeTab(id)}
                  className="px-1.5 py-1.5 text-gray-400 hover:text-red-600 rounded-r-lg"
                  title={`Close ${lead!.name}`}
                  aria-label={`Close ${lead!.name}`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )
          })}
        </div>
        {missing > 0 && (
          <span className="text-[11px] text-amber-600 shrink-0" title="These leads were deleted or are no longer visible to you">
            {missing} unavailable
          </span>
        )}
        <button
          onClick={backToMine}
          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-gray-200 bg-white text-xs text-gray-600 rounded-lg hover:bg-gray-50"
          title="Close this view and go back to My leads"
        >
          <PanelRightClose className="w-3.5 h-3.5" /> Close all
        </button>
      </div>

      {/* The active lead — the same workspace as the single-lead page */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <LeadWorkspace
          key={active.id}
          lead={active}
          canManage={isManager}
          onClose={() => closeTab(active.id)}
          onReload={reload}
          notify={notify}
        />
      </div>
    </div>
  )
}
