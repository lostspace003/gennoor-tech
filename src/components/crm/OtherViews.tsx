'use client'

import { useEffect, useMemo, useState } from 'react'
import { Users, Activity, Mail, Brain, Calendar, Upload, FileText, Trash2, RefreshCw, Video, Search, X, CalendarClock, MessageSquare, Eye, LayoutGrid, List } from 'lucide-react'
import { Lead, LeadStatus, PipelineStage, PIPELINE_STAGES } from '@/lib/crm/types'
import { StatusBadge, timeAgo, formatDateTime, api, STAGE_LABELS, Spinner, InfoTip, MultiSelect, Pagination, DurationSlider, TimeSlider, LeadLocalTime, DateRangeFilter, DateRange, rangeBounds, rangeLabel } from './shared'
import { istInstant, isoToIstParts } from '@/lib/crm/timezones'
import DocPreview from './DocPreview'
import { useCrm } from './CrmContext'

/* ---------------- Dashboard (real metrics only) ---------------- */

export function DashboardView({ leads, onGoLeads, onOpenLead }: { leads: Lead[]; onGoLeads: () => void; onOpenLead: (id: string) => void }) {
  const today = new Date().toDateString()
  const weekAgo = Date.now() - 7 * 86_400_000
  const metrics = [
    { label: "Today's new leads", value: leads.filter((l) => new Date(l.createdAt).toDateString() === today).length, icon: Users, color: 'text-blue-500' },
    { label: 'This week', value: leads.filter((l) => new Date(l.createdAt).getTime() >= weekAgo).length, icon: Calendar, color: 'text-indigo-500' },
    { label: 'Total leads', value: leads.length, icon: Users, color: 'text-gray-500' },
    { label: 'Active process', value: leads.filter((l) => l.processStatus === 'active').length, icon: Activity, color: 'text-green-500' },
    { label: 'Researched', value: leads.filter((l) => l.aiResearch).length, icon: Brain, color: 'text-purple-500' },
    { label: 'Emailed', value: leads.filter((l) => l.emailHistory.some((e) => e.status === 'sent')).length, icon: Mail, color: 'text-sky-500' },
  ]

  const recent = [...leads]
    .sort((a, b) => b.lastActivity.localeCompare(a.lastActivity))
    .slice(0, 8)

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{m.label}</span>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline & revenue snapshot — real data only */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">Pipeline funnel <InfoTip text="How many leads sit in each of the 5 journey stages. The ₹ value appears when deal values are set on leads (Overview → Edit)." /></h3>
          {(() => {
            const activeLeads = leads.filter((l) => !l.dumped)
            const max = Math.max(1, ...PIPELINE_STAGES.map((s) => activeLeads.filter((l) => l.stage === s).length))
            return (
              <div className="space-y-2">
                {PIPELINE_STAGES.map((s, i) => {
                  const inStage = activeLeads.filter((l) => l.stage === s)
                  const value = inStage.reduce((sum, l) => sum + (l.value || 0), 0)
                  return (
                    <div key={s} className="flex items-center gap-2 text-xs">
                      <span className="w-24 text-gray-500 shrink-0">{i + 1}. {STAGE_LABELS[s]}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-1.5 text-[10px] text-white min-w-[1.25rem]" style={{ width: `${(inStage.length / max) * 100}%` }}>
                          {inStage.length}
                        </div>
                      </div>
                      {value > 0 && <span className="w-16 text-right text-gray-500 shrink-0">₹{(value / 1000).toFixed(0)}K</span>}
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Outcomes & outreach</h3>
          {(() => {
            const won = leads.filter((l) => l.status === 'won')
            const lost = leads.filter((l) => l.status === 'lost')
            const weekAgo = Date.now() - 7 * 86_400_000
            const emails7d = leads.reduce((n, l) => n + l.emailHistory.filter((e) => e.status === 'sent' && new Date(e.at).getTime() >= weekAgo).length, 0)
            const invites = leads.reduce((n, l) => n + l.followUps.length, 0)
            const wonValue = won.reduce((s, l) => s + (l.value || 0), 0)
            return (
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-green-50 rounded-lg p-3"><div className="text-xl font-bold text-green-700">{won.length}</div><div className="text-[11px] text-green-700">won{wonValue > 0 ? ` · ₹${(wonValue / 1000).toFixed(0)}K` : ''}</div></div>
                <div className="bg-red-50 rounded-lg p-3"><div className="text-xl font-bold text-red-600">{lost.length}</div><div className="text-[11px] text-red-600">lost</div></div>
                <div className="bg-sky-50 rounded-lg p-3"><div className="text-xl font-bold text-sky-700">{emails7d}</div><div className="text-[11px] text-sky-700">emails sent (7d)</div></div>
                <div className="bg-emerald-50 rounded-lg p-3"><div className="text-xl font-bold text-emerald-700">{invites}</div><div className="text-[11px] text-emerald-700">webinar/training invites</div></div>
              </div>
            )
          })()}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Recent activity</h3>
          <button onClick={onGoLeads} className="text-xs text-blue-600 hover:underline">View all leads →</button>
        </div>
        <div className="divide-y divide-gray-100">
          {recent.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-400">No leads yet — upload your Excel from the Leads page.</p>}
          {recent.map((l) => (
            <button key={l.id} onClick={() => onOpenLead(l.id)} className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 text-left">
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900">{l.name} <span className="text-gray-400 font-normal">· {l.company || 'no company'}</span></div>
                <div className="text-xs text-gray-500 truncate">{l.activities[0]?.description || 'No activity'}</div>
              </div>
              <div className="text-xs text-gray-400 shrink-0 ml-4">{timeAgo(l.lastActivity)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Pipeline ---------------- */

// Board model: everyone's default board is the leads THEY picked. The dropdown
// switches to a teammate's board (or the unclaimed pool) one at a time —
// visible to all, but editable only on your own board (managers: any board).
const LIST_PER_PAGE = 15

export function PipelineView({ leads, onOpenLead }: { leads: Lead[]; onOpenLead: (id: string) => void }) {
  const { userEmail, isManager, reload, notify } = useCrm()
  const me = userEmail.toLowerCase()
  const [board, setBoard] = useState<'mine' | 'pool' | string>('mine')
  const [view, setView] = useState<'board' | 'list'>('board')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  // Stage focus: click a stage chip to zoom into just that column / rows
  const [stageFocus, setStageFocus] = useState<PipelineStage | null>(null)
  const [listPage, setListPage] = useState(1)
  const [dragId, setDragId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<PipelineStage | null>(null)
  const [busy, setBusy] = useState(false)
  const [commentLeadId, setCommentLeadId] = useState<string | null>(null)

  const active = useMemo(() => leads.filter((l) => !l.dumped), [leads])
  const owners = useMemo(() => {
    const set = new Set<string>()
    active.forEach((l) => { if (l.owner) set.add(l.owner.toLowerCase()) })
    set.delete(me)
    return [...set].sort()
  }, [active, me])

  const allBoardLeads = active.filter((l) =>
    board === 'mine' ? (l.owner || '').toLowerCase() === me
    : board === 'pool' ? !l.owner
    : (l.owner || '').toLowerCase() === board
  )
  const term = search.trim().toLowerCase()
  const boardLeads = allBoardLeads.filter((l) =>
    (!term || l.name.toLowerCase().includes(term) || (l.company || '').toLowerCase().includes(term)) &&
    (statusFilter.length === 0 || statusFilter.includes(l.status))
  )
  const editable = board === 'mine' || isManager
  const boardName = board === 'mine' ? 'My board' : board === 'pool' ? 'Pool' : `${board.split('@')[0]}'s board`
  const filtering = !!term || statusFilter.length > 0

  const moveStage = async (leadId: string, stage: PipelineStage) => {
    const lead = leads.find((l) => l.id === leadId)
    if (!lead || lead.stage === stage || busy) return
    setBusy(true)
    try {
      await api('/api/admin/leads/update-stage', { method: 'POST', body: JSON.stringify({ leadId, stage }) })
      await reload()
      notify(`${lead.name} → ${STAGE_LABELS[stage]}`)
    } catch (e: any) { notify(e.message, true) } finally { setBusy(false) }
  }

  const commentLead = commentLeadId ? leads.find((l) => l.id === commentLeadId) : undefined
  const visibleStages = stageFocus ? [stageFocus] : PIPELINE_STAGES

  // List view: focused stage first, then pipeline order, then most recent activity
  const listLeads = boardLeads
    .filter((l) => !stageFocus || l.stage === stageFocus)
    .sort((a, b) => PIPELINE_STAGES.indexOf(a.stage) - PIPELINE_STAGES.indexOf(b.stage) || b.lastActivity.localeCompare(a.lastActivity))
  const safeListPage = Math.min(listPage, Math.max(1, Math.ceil(listLeads.length / LIST_PER_PAGE)))
  const pageListLeads = listLeads.slice((safeListPage - 1) * LIST_PER_PAGE, safeListPage * LIST_PER_PAGE)

  return (
    <div className="p-3 sm:p-5">
      <div className="flex items-center gap-2 flex-wrap mb-3">
        <select
          value={board}
          onChange={(e) => { setBoard(e.target.value); setStageFocus(null); setListPage(1) }}
          className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-800"
        >
          <option value="mine">My board ({active.filter((l) => (l.owner || '').toLowerCase() === me).length})</option>
          <option value="pool">Pool — unclaimed ({active.filter((l) => !l.owner).length})</option>
          {owners.map((o) => (
            <option key={o} value={o}>{o.split('@')[0]}&apos;s board ({active.filter((l) => (l.owner || '').toLowerCase() === o).length})</option>
          ))}
        </select>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setListPage(1) }}
            placeholder="Search name, company..."
            className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs w-44"
          />
        </div>
        <MultiSelect
          label="Status"
          options={(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as LeadStatus[]).map((s) => ({ value: s, label: s }))}
          values={statusFilter}
          onChange={(v) => { setStatusFilter(v); setListPage(1) }}
        />
        {/* Board = drag between columns; List = compact rows for big pools */}
        <div className="inline-flex border border-gray-200 rounded-lg overflow-hidden">
          {([['board', LayoutGrid, 'Board'], ['list', List, 'List']] as const).map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => setView(id)}
              title={`${label} view`}
              className={`px-2.5 py-1.5 text-xs flex items-center gap-1 ${view === id ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
        {editable ? (
          <span className="text-xs text-gray-400 hidden md:inline">{view === 'board' ? 'Drag cards between stages · 💬 comments' : 'Change stage from the dropdown · 💬 comments'}</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-1">
            <Eye className="w-3 h-3" /> Viewing {boardName} — read-only
          </span>
        )}
      </div>

      {/* What's on the plate: total + per-stage chips (click to zoom into one stage) */}
      <div className="flex items-center gap-1.5 flex-wrap mb-4">
        <button
          onClick={() => setStageFocus(null)}
          className={`text-xs rounded-full px-2.5 py-1 border ${!stageFocus ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          {boardName}: {boardLeads.length}{filtering ? ` of ${allBoardLeads.length}` : ''} lead{boardLeads.length === 1 ? '' : 's'}
        </button>
        {PIPELINE_STAGES.map((s, i) => {
          const n = boardLeads.filter((l) => l.stage === s).length
          return (
            <button
              key={s}
              onClick={() => { setStageFocus(stageFocus === s ? null : s); setListPage(1) }}
              title={stageFocus === s ? 'Show all stages' : `Focus on ${STAGE_LABELS[s]}`}
              className={`text-xs rounded-full px-2.5 py-1 border ${stageFocus === s ? 'bg-blue-600 text-white border-blue-600' : n ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-gray-100 text-gray-300'}`}
            >
              {i + 1}. {STAGE_LABELS[s]} · {n}
            </button>
          )
        })}
      </div>

      {view === 'board' ? (
        <div className="overflow-x-auto">
          <div className={`grid gap-4 ${stageFocus ? 'grid-cols-1 max-w-xl' : 'grid-cols-5 min-w-[1000px]'}`}>
            {visibleStages.map((stage) => {
              const idx = PIPELINE_STAGES.indexOf(stage)
              const stageLeads = boardLeads.filter((l) => l.stage === stage)
              return (
                <div
                  key={stage}
                  className={`bg-gray-100 rounded-lg p-3 transition-colors ${overStage === stage && dragId ? 'bg-blue-50 ring-2 ring-blue-300' : ''}`}
                  onDragOver={(e) => { if (editable && dragId) { e.preventDefault(); setOverStage(stage) } }}
                  onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
                  onDrop={(e) => { e.preventDefault(); setOverStage(null); if (dragId) { moveStage(dragId, stage); setDragId(null) } }}
                >
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <span className="text-sm font-semibold text-gray-700">{idx + 1}. {STAGE_LABELS[stage]}</span>
                    <span className="text-xs bg-white rounded-full px-2 py-0.5 text-gray-500">{stageLeads.length}</span>
                  </div>
                  <div className="space-y-1.5 max-h-[58vh] overflow-y-auto">
                    {stageLeads.map((l) => {
                      const comments = l.activities.filter((a) => a.type === 'note').length
                      return (
                        <div
                          key={l.id}
                          draggable={editable}
                          onDragStart={(e) => { setDragId(l.id); e.dataTransfer.effectAllowed = 'move' }}
                          onDragEnd={() => { setDragId(null); setOverStage(null) }}
                          onClick={() => onOpenLead(l.id)}
                          className={`bg-white rounded-lg px-2.5 py-2 border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer ${editable ? 'active:cursor-grabbing' : ''} ${dragId === l.id ? 'opacity-40' : ''}`}
                        >
                          <div className="text-[13px] font-medium text-gray-900 truncate leading-tight">{l.name}</div>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[11px] text-gray-500 truncate">{l.company || '—'}</span>
                            <StatusBadge status={l.status} />
                            <button
                              onClick={(e) => { e.stopPropagation(); setCommentLeadId(l.id) }}
                              title={editable ? 'View / add comments' : 'View comments'}
                              className="ml-auto inline-flex items-center gap-0.5 text-[10px] rounded-full px-1.5 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-100 shrink-0"
                            >
                              <MessageSquare className="w-3 h-3" />{comments > 0 ? comments : ''}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                    {stageLeads.length === 0 && <p className="text-xs text-gray-400 text-center py-6">Empty</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-gray-500 uppercase text-[10px] border-b border-gray-100">
                <th className="px-4 py-2">Lead</th>
                <th className="px-3 py-2">Stage</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Owner</th>
                <th className="px-3 py-2">💬</th>
                <th className="px-3 py-2">Last activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pageListLeads.map((l) => {
                const comments = l.activities.filter((a) => a.type === 'note').length
                return (
                  <tr key={l.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onOpenLead(l.id)}>
                    <td className="px-4 py-2">
                      <div className="text-[13px] font-medium text-gray-900">{l.name}</div>
                      <div className="text-[11px] text-gray-400">{l.company || '—'}</div>
                    </td>
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      {editable ? (
                        <select
                          value={l.stage}
                          onChange={(e) => moveStage(l.id, e.target.value as PipelineStage)}
                          className="text-xs border border-gray-200 rounded-lg px-1.5 py-1 bg-white text-gray-700"
                        >
                          {PIPELINE_STAGES.map((s, i) => <option key={s} value={s}>{i + 1}. {STAGE_LABELS[s]}</option>)}
                        </select>
                      ) : (
                        <span className="text-gray-600">{PIPELINE_STAGES.indexOf(l.stage) + 1}. {STAGE_LABELS[l.stage]}</span>
                      )}
                    </td>
                    <td className="px-3 py-2"><StatusBadge status={l.status} /></td>
                    <td className="px-3 py-2 text-gray-500">{l.owner ? l.owner.split('@')[0] : <span className="text-emerald-600">pool</span>}</td>
                    <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setCommentLeadId(l.id)}
                        className="inline-flex items-center gap-0.5 text-[10px] rounded-full px-1.5 py-0.5 bg-blue-50 text-blue-600 hover:bg-blue-100"
                      >
                        <MessageSquare className="w-3 h-3" />{comments > 0 ? comments : ''}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-gray-400">{timeAgo(l.lastActivity)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {listLeads.length === 0 && <p className="text-sm text-gray-400 text-center py-8">Nothing matches the current filters.</p>}
          <div className="px-4 pb-3">
            <Pagination page={safeListPage} total={listLeads.length} perPage={LIST_PER_PAGE} onPage={setListPage} />
          </div>
        </div>
      )}
      {boardLeads.length === 0 && !filtering && (
        <p className="text-sm text-gray-400 text-center mt-6">
          {board === 'mine' ? 'You haven’t picked any leads yet — claim them from the pool in the Leads view.' : 'No leads on this board.'}
        </p>
      )}
      {commentLead && (
        <LeadCommentsModal
          lead={commentLead}
          editable={editable}
          onClose={() => setCommentLeadId(null)}
          onReload={reload}
          notify={notify}
        />
      )}
      <WorkAnalysis leads={active} me={me} isManager={isManager} />
    </div>
  )
}

// Comment thread for a pipeline card. Leads move between stages, so every
// comment carries the stage it was made in (older comments predate stage
// stamping and show without one).
function LeadCommentsModal({ lead, editable, onClose, onReload, notify }: {
  lead: Lead; editable: boolean; onClose: () => void; onReload: () => Promise<void>; notify: (msg: string, isError?: boolean) => void
}) {
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)
  const notes = lead.activities.filter((a) => a.type === 'note')

  const send = async () => {
    const note = text.trim()
    if (!note || saving) return
    setSaving(true)
    try {
      await api('/api/admin/leads/add-note', { method: 'POST', body: JSON.stringify({ leadId: lead.id, note }) })
      setText('')
      await onReload()
      notify('Comment added')
    } catch (e: any) { notify(e.message, true) } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{lead.name}{lead.company ? ` · ${lead.company}` : ''}</div>
            <div className="text-[11px] text-gray-400">Currently in {STAGE_LABELS[lead.stage]}</div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400 shrink-0"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {notes.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No comments yet.</p>}
          {notes.map((a, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-sm text-gray-800 whitespace-pre-line break-words">{a.description}</p>
              <div className="mt-1.5 flex items-center gap-1.5 flex-wrap text-[11px] text-gray-400">
                {a.stage && <span className="bg-blue-50 text-blue-600 rounded-full px-1.5 py-0.5">in {STAGE_LABELS[a.stage]}</span>}
                <span>{a.by.split('@')[0]}</span>
                <span>· {formatDateTime(a.at)}</span>
              </div>
            </div>
          ))}
        </div>
        {editable ? (
          <div className="px-4 py-3 border-t border-gray-100 flex gap-1.5">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send() }}
              placeholder={`Comment — logged in ${STAGE_LABELS[lead.stage]}`}
              className="flex-1 text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={send} disabled={!text.trim() || saving} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {saving ? '…' : 'Send'}
            </button>
          </div>
        ) : (
          <p className="px-4 py-3 border-t border-gray-100 text-[11px] text-gray-400">Read-only — comments can be added on your own board (managers: any board).</p>
        )}
      </div>
    </div>
  )
}

// Work analysis under the pipeline: managers see every member's numbers,
// everyone else sees the same table with just their own row.
function WorkAnalysis({ leads, me, isManager }: { leads: Lead[]; me: string; isManager: boolean }) {
  const members = useMemo(() => {
    if (!isManager) return [me]
    const set = new Set<string>([me])
    for (const l of leads) {
      if (l.owner) set.add(l.owner.toLowerCase())
      for (const a of l.activities) if (a.by?.includes('@')) set.add(a.by.toLowerCase())
    }
    return [...set]
  }, [leads, me, isManager])

  const rows = useMemo(() => members.map((m) => {
    const held = leads.filter((l) => (l.owner || '').toLowerCase() === m)
    const acts = leads.flatMap((l) => l.activities.filter((a) => a.by?.toLowerCase() === m))
    const emails = leads.reduce((n, l) => n + l.emailHistory.filter((e) => e.status === 'sent' && e.by?.toLowerCase() === m).length, 0)
    const last = acts.reduce((max, a) => (a.at > max ? a.at : max), '')
    return {
      member: m,
      held: held.length,
      stages: PIPELINE_STAGES.map((s) => held.filter((l) => l.stage === s).length),
      won: held.filter((l) => l.status === 'won').length,
      lost: held.filter((l) => l.status === 'lost').length,
      emails,
      meetings: acts.filter((a) => a.type === 'followup').length,
      comments: acts.filter((a) => a.type === 'note').length,
      moves: acts.filter((a) => a.type === 'stage').length,
      last,
    }
  }).sort((a, b) => b.held - a.held || b.emails - a.emails), [members, leads])

  return (
    <div className="mt-6 bg-white rounded-lg border border-gray-200">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-1.5">
        <h3 className="text-sm font-semibold text-gray-800">{isManager ? 'Team work analysis' : 'My work analysis'}</h3>
        <InfoTip text="Leads held per stage plus what each person has actually done — emails sent, meetings/invites, stage moves and comments are counted from the activity trail." />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-gray-500 uppercase text-[10px]">
              <th className="px-4 py-2">Member</th>
              <th className="px-3 py-2">Leads</th>
              {PIPELINE_STAGES.map((s, i) => <th key={s} className="px-2 py-2" title={STAGE_LABELS[s]}>{i + 1}</th>)}
              <th className="px-3 py-2 text-green-700">Won</th>
              <th className="px-3 py-2 text-red-600">Lost</th>
              <th className="px-3 py-2">Emails</th>
              <th className="px-3 py-2">Meetings</th>
              <th className="px-3 py-2">Moves</th>
              <th className="px-3 py-2">Comments</th>
              <th className="px-3 py-2">Last active</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r) => (
              <tr key={r.member} className={r.member === me ? 'bg-blue-50/50' : ''}>
                <td className="px-4 py-2 font-medium text-gray-800">{r.member === me ? `${r.member.split('@')[0]} (you)` : r.member.split('@')[0]}</td>
                <td className="px-3 py-2 font-semibold text-gray-900">{r.held}</td>
                {r.stages.map((n, i) => <td key={i} className={`px-2 py-2 ${n ? 'text-gray-800' : 'text-gray-300'}`}>{n}</td>)}
                <td className="px-3 py-2 text-green-700">{r.won || <span className="text-gray-300">0</span>}</td>
                <td className="px-3 py-2 text-red-600">{r.lost || <span className="text-gray-300">0</span>}</td>
                <td className="px-3 py-2">{r.emails}</td>
                <td className="px-3 py-2">{r.meetings}</td>
                <td className="px-3 py-2">{r.moves}</td>
                <td className="px-3 py-2">{r.comments}</td>
                <td className="px-3 py-2 text-gray-500">{r.last ? timeAgo(r.last) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ---------------- Inbox (whole CRM) ---------------- */

interface InboxMessage {
  id: string; from: string; fromName: string; subject: string; preview: string
  receivedAt: string; leadId: string; leadName: string; leadCompany: string
}

const INBOX_PER_PAGE = 10

export function InboxView({ onOpenLead }: { onOpenLead: (id: string) => void }) {
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [fromFilter, setFromFilter] = useState<string[]>([])
  // Default "all time" so nothing silently disappears; presets narrow it down
  const [range, setRange] = useState<DateRange>({ days: 0, from: '', to: '' })
  const [grouped, setGrouped] = useState(false)
  const [page, setPage] = useState(1)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api<{ configured: boolean; messages: InboxMessage[]; note?: string; error?: string }>('/api/admin/leads/inbox')
      setMessages(res.messages || [])
      setNote(res.error || res.note || (!res.configured ? 'Inbound email is not configured.' : ''))
    } catch (e: any) { setNote(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // One entry per sender address — the multi-select filter for multi-email threads
  const senders = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of messages) if (!map.has(m.from.toLowerCase())) map.set(m.from.toLowerCase(), m.leadName || m.fromName || m.from)
    return [...map.entries()].map(([value, name]) => ({ value, label: `${name} · ${value}` }))
  }, [messages])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    const { fromMs, toMs } = rangeBounds(range)
    return messages.filter((m) => {
      const t = new Date(m.receivedAt).getTime()
      return (fromFilter.length === 0 || fromFilter.includes(m.from.toLowerCase())) &&
        t >= fromMs && t <= toMs &&
        (!term || m.subject.toLowerCase().includes(term) || m.preview.toLowerCase().includes(term) ||
          m.from.toLowerCase().includes(term) || m.leadName.toLowerCase().includes(term) || (m.leadCompany || '').toLowerCase().includes(term))
    })
  }, [messages, search, fromFilter, range])

  // Grouped view: one section per lead, newest thread first
  const groups = useMemo(() => {
    const map = new Map<string, { leadId: string; leadName: string; leadCompany: string; msgs: InboxMessage[] }>()
    for (const m of filtered) {
      const g = map.get(m.leadId) || { leadId: m.leadId, leadName: m.leadName, leadCompany: m.leadCompany, msgs: [] }
      g.msgs.push(m)
      map.set(m.leadId, g)
    }
    return [...map.values()].sort((a, b) => b.msgs[0].receivedAt.localeCompare(a.msgs[0].receivedAt))
  }, [filtered])

  const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / INBOX_PER_PAGE)))
  const pageMsgs = filtered.slice((safePage - 1) * INBOX_PER_PAGE, safePage * INBOX_PER_PAGE)

  return (
    <div className="p-3 sm:p-5 space-y-3 max-w-4xl">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">Replies from leads (sales@ + admin@ inboxes) <InfoTip text="Emails received in the sales@ and admin@ mailboxes from any known lead address (outreach goes out as sales@gennoor.com). Narrow by date, sender or search; group by lead when several threads are running. Click one to open that lead's conversation and reply with AI." /></h3>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search subject, sender..."
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs w-48"
            />
          </div>
          <MultiSelect label="Email" options={senders} values={fromFilter} onChange={(v) => { setFromFilter(v); setPage(1) }} />
          <button
            onClick={() => setGrouped((g) => !g)}
            title="Group messages by lead"
            className={`px-2.5 py-2 text-xs border rounded-lg flex items-center gap-1 ${grouped ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <Users className="w-3.5 h-3.5" /> By lead
          </button>
          <button onClick={load} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <DateRangeFilter
          value={range}
          onChange={(r) => { setRange(r); setPage(1) }}
          presets={[{ days: 1, label: 'Today' }, { days: 7, label: 'Week' }, { days: 30, label: 'Month' }]}
        />
        <span className="text-[11px] text-gray-400">{filtered.length} of {messages.length} replies · {rangeLabel(range)}</span>
      </div>
      {note && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{note}</p>}
      {loading && <Spinner label="Checking inbox..." />}
      {!loading && filtered.length === 0 && !note && (
        <div className="bg-gray-50 rounded-lg p-10 text-center text-sm text-gray-400">{messages.length === 0 ? 'No replies from known leads yet.' : 'No emails match the current filters.'}</div>
      )}
      {grouped ? (
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.leadId} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => onOpenLead(g.leadId)} className="w-full text-left px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2 hover:bg-gray-100">
                <span className="text-sm font-medium text-emerald-700 truncate">{g.leadName}{g.leadCompany ? ` · ${g.leadCompany}` : ''}</span>
                <span className="text-[11px] text-gray-400 shrink-0">{g.msgs.length} message{g.msgs.length === 1 ? '' : 's'} · open lead →</span>
              </button>
              <div className="divide-y divide-gray-50">
                {g.msgs.map((m) => (
                  <button key={m.id} onClick={() => onOpenLead(m.leadId)} className="w-full text-left px-3 py-2 hover:bg-gray-50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[13px] text-gray-900 truncate">{m.subject || '(no subject)'}</div>
                      <div className="text-[11px] text-gray-400 shrink-0">{formatDateTime(m.receivedAt)}</div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{m.preview}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            {pageMsgs.map((m) => (
              <button key={m.id} onClick={() => onOpenLead(m.leadId)} className="w-full text-left bg-white border border-gray-200 rounded-lg px-3 py-2.5 hover:border-blue-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-900 truncate">{m.subject || '(no subject)'}</div>
                  <div className="text-[11px] text-gray-400 shrink-0">{formatDateTime(m.receivedAt)}</div>
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5 truncate">{m.leadName} · {m.leadCompany || m.from}</div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">{m.preview}</p>
              </button>
            ))}
          </div>
          <Pagination page={safePage} total={filtered.length} perPage={INBOX_PER_PAGE} onPage={setPage} />
        </>
      )}
    </div>
  )
}

/* ---------------- Scheduler (meetings + follow-ups) ---------------- */

interface Meeting { id: string; subject: string; start: string; end: string; attendees: string[]; joinUrl?: string; webLink?: string }
interface FollowUpRow { id: string; type: string; title: string; date: string; time: string; leadId: string; leadName: string; leadCompany: string; sentAt?: string }

// Scheduler ranges look FORWARD (today → +N days), unlike the shared
// backward-looking rangeBounds used by logs/inbox/team.
function forwardBounds(r: DateRange): { fromMs: number; toMs: number } {
  if (r.days > 0) {
    const start = new Date(); start.setHours(0, 0, 0, 0)
    return { fromMs: start.getTime(), toMs: start.getTime() + r.days * 86_400_000 }
  }
  return rangeBounds(r)
}

function forwardLabel(r: DateRange): string {
  if (r.days === 1) return 'today'
  if (r.days > 0) return `next ${r.days} days`
  return rangeLabel(r)
}

// Day header for grouped lists: "Today", "Tomorrow", else "Wed, 30 Jul"
function dayHeading(iso: string): string {
  const d = new Date(iso)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const diff = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - today.getTime()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function SchedulerView({ onOpenLead }: { onOpenLead: (id: string) => void }) {
  const { notify, leads } = useCrm()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [followUps, setFollowUps] = useState<FollowUpRow[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Meeting | null>(null)
  const [busy, setBusy] = useState('')
  const [range, setRange] = useState<DateRange>({ days: 30, from: '', to: '' })
  const [showPastInvites, setShowPastInvites] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const [m, f] = await Promise.all([
        api<{ configured: boolean; meetings: Meeting[]; error?: string }>('/api/admin/leads/schedule-meeting'),
        api<{ followUps: FollowUpRow[] }>('/api/admin/leads/schedule-followup'),
      ])
      setMeetings(m.meetings || [])
      setFollowUps(f.followUps || [])
      setNote(m.error || (!m.configured ? 'Calendar is not configured — meetings unavailable.' : ''))
    } catch (e: any) { setNote(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // Meetings inside the selected window, grouped by calendar day
  const { fromMs, toMs } = forwardBounds(range)
  const visibleMeetings = meetings
    .filter((m) => { const t = new Date(m.start).getTime(); return t >= fromMs && t <= toMs })
    .sort((a, b) => a.start.localeCompare(b.start))
  const meetingDays: Array<{ day: string; items: Meeting[] }> = []
  for (const m of visibleMeetings) {
    const day = dayHeading(m.start)
    const last = meetingDays[meetingDays.length - 1]
    if (last && last.day === day) last.items.push(m)
    else meetingDays.push({ day, items: [m] })
  }

  const todayYmd = new Date().toISOString().slice(0, 10)
  const upcomingInvites = followUps.filter((f) => f.date >= todayYmd).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
  const pastInvites = followUps.filter((f) => f.date < todayYmd).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="p-3 sm:p-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Video className="w-4 h-4 text-blue-500" /> Meetings ({forwardLabel(range)})</h3>
          <button onClick={load} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DateRangeFilter
            value={range}
            onChange={setRange}
            presets={[{ days: 1, label: 'Today' }, { days: 7, label: 'Week' }, { days: 30, label: 'Month' }]}
            allowFuture
          />
          <span className="text-[11px] text-gray-400">{visibleMeetings.length} meeting{visibleMeetings.length === 1 ? '' : 's'}</span>
        </div>
        {note && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{note}</p>}
        {loading && <Spinner label="Loading calendar..." />}
        {!loading && visibleMeetings.length === 0 && !note && (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">
            {meetings.length === 0 ? "No upcoming meetings. Schedule one from a lead's page." : `No meetings ${forwardLabel(range)} — widen the range above.`}
          </div>
        )}
        {meetingDays.map((g) => (
          <div key={g.day} className="space-y-2">
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide pt-1">{g.day} <span className="text-gray-300 normal-case">· {g.items.length}</span></div>
            {g.items.map((m) => (
              <div key={m.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-900">{m.subject}</div>
                  {m.joinUrl && <a href={m.joinUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-600 text-white rounded-lg px-2.5 py-1.5 hover:bg-blue-700 shrink-0">Join Teams</a>}
                </div>
                <div className="text-xs text-gray-500 mt-1">{formatDateTime(m.start)} → {formatDateTime(m.end)}</div>
                <div className="text-xs text-gray-400 mt-1 truncate">With: {m.attendees.join(', ') || '—'}</div>
                {/* Owner of the lead (or a manager) can move/cancel — server enforces */}
                <div className="flex items-center gap-1.5 mt-2">
                  <button onClick={() => setEditing(m)} className="px-2.5 py-1 border border-gray-200 text-gray-600 text-[11px] rounded-lg hover:bg-gray-50 flex items-center gap-1">
                    <CalendarClock className="w-3 h-3" /> Reschedule
                  </button>
                  <button
                    onClick={async () => {
                      const comment = prompt(`Cancel "${m.subject}"?\nOptional message for the attendees (they get the cancellation by email):`)
                      if (comment === null) return
                      setBusy(m.id)
                      try {
                        await api(`/api/admin/leads/schedule-meeting?meetingId=${encodeURIComponent(m.id)}${comment ? `&comment=${encodeURIComponent(comment)}` : ''}`, { method: 'DELETE' })
                        notify('Meeting cancelled — attendees were emailed')
                        await load()
                      } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
                    }}
                    disabled={busy === m.id}
                    className="px-2.5 py-1 border border-red-200 text-red-600 text-[11px] rounded-lg hover:bg-red-50 flex items-center gap-1 disabled:opacity-50"
                  >
                    <X className="w-3 h-3" /> {busy === m.id ? 'Cancelling…' : 'Cancel'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {editing && (
        <RescheduleModal
          meeting={editing}
          lead={leads.find((l) => {
            const att = new Set(editing.attendees.map((a) => a.toLowerCase()))
            return [l.email, ...(l.altEmails || [])].some((e) => e && att.has(e.toLowerCase()))
          })}
          onClose={() => setEditing(null)}
          onDone={async () => { setEditing(null); notify('Meeting updated — attendees received the new invite'); await load() }}
          notify={notify}
        />
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-500" /> Webinar & training invites sent</h3>
        {followUps.length === 0 && <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">No follow-up invites yet.</div>}
        {upcomingInvites.length > 0 && (
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Upcoming <span className="text-gray-300 normal-case">· {upcomingInvites.length}</span></div>
        )}
        {upcomingInvites.map((f) => (
          <button key={`${f.leadId}-${f.id}`} onClick={() => onOpenLead(f.leadId)} className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-all">
            <div className="text-sm font-medium text-gray-900">{f.type === 'webinar' ? '🎓 Webinar' : '📚 1-day training'}: {f.title}</div>
            <div className="text-xs text-gray-500 mt-1">{dayHeading(`${f.date}T00:00:00`)} · {f.date} at {f.time} · {f.leadName} ({f.leadCompany || '—'})</div>
          </button>
        ))}
        {pastInvites.length > 0 && (
          <button
            onClick={() => setShowPastInvites((s) => !s)}
            className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1 hover:text-gray-700"
          >
            Past <span className="text-gray-300 normal-case">· {pastInvites.length}</span> <span className="text-gray-300">{showPastInvites ? '▴' : '▾'}</span>
          </button>
        )}
        {showPastInvites && pastInvites.map((f) => (
          <button key={`${f.leadId}-${f.id}`} onClick={() => onOpenLead(f.leadId)} className="w-full text-left bg-white border border-gray-100 rounded-lg p-3 hover:border-emerald-300 transition-all opacity-70">
            <div className="text-[13px] text-gray-700">{f.type === 'webinar' ? '🎓 Webinar' : '📚 1-day training'}: {f.title}</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{f.date} at {f.time} · {f.leadName} ({f.leadCompany || '—'})</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Reschedule an existing Teams meeting: new date/time + duration slider +
// message to attendees. Server allows the lead's owner or a manager.
function RescheduleModal({ meeting, lead, onClose, onDone, notify }: {
  meeting: Meeting
  lead?: Lead
  onClose: () => void
  onDone: () => Promise<void>
  notify: (m: string, e?: boolean) => void
}) {
  // Current start rendered as IST wall-clock — the picker always works in IST
  const istStart = isoToIstParts(meeting.start || new Date().toISOString())
  const [date, setDate] = useState(istStart.date)
  const [time, setTime] = useState(istStart.time)
  const [duration, setDuration] = useState(Math.max(15, Math.round((new Date(meeting.end).getTime() - new Date(meeting.start).getTime()) / 60_000) || 30))
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!date || !time) { notify('Pick a date and time', true); return }
    setSaving(true)
    try {
      await api('/api/admin/leads/schedule-meeting', {
        method: 'PATCH',
        body: JSON.stringify({ meetingId: meeting.id, start: istInstant(date, time).toISOString(), durationMinutes: duration, comment: comment.trim() || undefined }),
      })
      await onDone()
    } catch (e: any) { notify(e.message, true) } finally { setSaving(false) }
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md flex flex-col">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Reschedule meeting</h3>
            <p className="text-[11px] text-gray-500 truncate max-w-72">{meeting.subject}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} title="Time in IST — or use the slider below" />
          </div>
          <TimeSlider value={time} onChange={setTime} label="New time (IST)" />
          <LeadLocalTime date={date} time={time} country={lead?.country} city={lead?.city} />
          <DurationSlider value={duration} onChange={setDuration} />
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className={inputCls} placeholder="Message to attendees (optional — included in the update email)" />
          <p className="text-[11px] text-gray-400">Everyone on the invite gets the updated meeting by email, so the change also shows up in the lead's conversation thread.</p>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            <CalendarClock className="w-4 h-4" /> {saving ? 'Updating…' : 'Update & notify attendees'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Documents ---------------- */

interface Doc { name: string; size: number; lastModified: string }

// Folder chips for the library. pitches/ is generated by the pitch-doc flow
// (one docx + pdf per locked/created version); email-attachments/ are one-off
// composer uploads that normally clean themselves up after sending.
const DOC_FOLDERS = [
  { key: 'manuals', label: 'Manuals' },
  { key: 'posters', label: 'Posters' },
  { key: 'pitches', label: 'Pitches' },
  { key: 'general', label: 'General' },
  { key: 'email-attachments', label: 'Email one-offs' },
] as const

export function DocumentsView({ canManage, notify }: { canManage: boolean; notify: (m: string, e?: boolean) => void }) {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [folder, setFolder] = useState<'manuals' | 'posters' | 'general'>('manuals')
  const [preview, setPreview] = useState<string | null>(null)
  const [folderFilter, setFolderFilter] = useState<string>('')
  const [search, setSearch] = useState('')

  const load = () => {
    setLoading(true)
    api<{ documents: Doc[] }>('/api/admin/leads/documents').then((r) => setDocs(r.documents)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const folderOf = (name: string) => (name.includes('/') ? name.split('/')[0] : 'general')
  const term = search.trim().toLowerCase()
  const visibleDocs = docs.filter((d) =>
    (!folderFilter || folderOf(d.name) === folderFilter) &&
    (!term || d.name.toLowerCase().includes(term))
  )

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', folder)
      const res = await fetch('/api/admin/leads/documents', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      notify(`Uploaded ${data.name}`)
      load()
    } catch (err: any) { notify(err.message, true) } finally { setUploading(false); e.target.value = '' }
  }

  const remove = async (name: string) => {
    if (!confirm(`Delete ${name}?`)) return
    try {
      await api(`/api/admin/leads/documents?name=${encodeURIComponent(name)}`, { method: 'DELETE' })
      notify('Deleted')
      load()
    } catch (e: any) { notify(e.message, true) }
  }

  return (
    <div className="p-3 sm:p-5 max-w-3xl space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        Upload the <strong>2-page manuals</strong> (technical & non-technical) under <em>manuals</em>, and <strong>webinar posters</strong> under <em>posters</em>. These become attachable in the email composer and follow-up invites. <strong>Pitches</strong> are generated automatically from each lead's pitch doc (docx + PDF per version); <strong>email one-offs</strong> are composer uploads that clean themselves up after sending.
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <select value={folder} onChange={(e) => setFolder(e.target.value as any)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="manuals">manuals/ (2-page decks)</option>
          <option value="posters">posters/ (webinar posters)</option>
          <option value="general">general/</option>
        </select>
        <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2">
          <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload file'}
          <input type="file" onChange={upload} className="hidden" disabled={uploading} />
        </label>
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs w-44"
          />
        </div>
      </div>

      {/* Folder chips with live counts */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => setFolderFilter('')}
          className={`text-xs rounded-full px-2.5 py-1 border ${!folderFilter ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          All · {docs.length}
        </button>
        {DOC_FOLDERS.map((f) => {
          const n = docs.filter((d) => folderOf(d.name) === f.key).length
          return (
            <button
              key={f.key}
              onClick={() => setFolderFilter(folderFilter === f.key ? '' : f.key)}
              className={`text-xs rounded-full px-2.5 py-1 border ${folderFilter === f.key ? 'bg-blue-600 text-white border-blue-600' : n ? 'border-gray-200 text-gray-700 hover:bg-gray-50' : 'border-gray-100 text-gray-300'}`}
            >
              {f.label} · {n}
            </button>
          )
        })}
      </div>

      {loading && <Spinner label="Loading documents..." />}
      {!loading && visibleDocs.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">
          {docs.length === 0 ? 'No documents yet.' : 'Nothing matches the current filters.'}
        </div>
      )}
      <div className="space-y-2">
        {visibleDocs.map((d) => (
          <div key={d.name} className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className={`w-4 h-4 shrink-0 ${folderOf(d.name) === 'pitches' ? 'text-green-500' : 'text-gray-400'}`} />
              <div className="min-w-0">
                <div className="text-sm text-gray-900 truncate">{d.name.split('/').pop()}</div>
                <div className="text-xs text-gray-400">
                  <span className="bg-gray-100 rounded-full px-1.5 py-0.5 mr-1.5">{folderOf(d.name)}</span>
                  {(d.size / 1024).toFixed(0)} KB · {formatDateTime(d.lastModified)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setPreview(d.name)} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">Preview</button>
              <a href={`/api/admin/leads/documents/file?name=${encodeURIComponent(d.name)}&download=1`} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">Download</a>
              {(canManage || d.name.startsWith('email-attachments/')) && (
                <button onClick={() => remove(d.name)} className="p-2 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          </div>
        ))}
      </div>
      {preview && <DocPreview name={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
