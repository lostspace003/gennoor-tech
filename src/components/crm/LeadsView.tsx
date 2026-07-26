'use client'

import { useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { Search, Upload, Download, Trash2, Brain, Mail, X, Hand, Undo2, Archive, UserPlus } from 'lucide-react'
import { Lead, LeadStatus, PipelineStage, ProcessStatus, PIPELINE_STAGES } from '@/lib/crm/types'
import { StatusBadge, ProcessDot, StageBar, timeAgo, api, STAGE_LABELS, Spinner } from './shared'
import { useCrm } from './CrmContext'

const CRM_TEAM = ['admin@gennoor.com', 'jalalkhan@gennoor.com', 'yusufchaudhary@gennoor.com', 'contact@gennoor.com', 'contacts@gennoor.com']

const PAGE_SIZES = [10, 25, 50, 100]

interface Props {
  leads: Lead[]
  canManage: boolean
  onOpenLead: (id: string) => void
  onReload: () => Promise<void>
  notify: (msg: string, isError?: boolean) => void
}

interface ParsedUpload {
  valid: Partial<Lead>[]
  warnings: string[]
  skipped: number
}

// Map a spreadsheet row to a lead. Only Name is required; blanks are fine.
function rowToLead(row: Record<string, any>): Partial<Lead> | null {
  const pick = (...keys: string[]) => {
    for (const k of keys) {
      const v = row[k]
      if (v !== undefined && v !== null && String(v).trim() && String(v).trim().toUpperCase() !== 'NA') {
        return String(v).trim()
      }
    }
    return ''
  }
  const name = pick('Name', 'Contact', 'Contact Name', 'Full Name')
  if (!name) return null
  return {
    name,
    email: pick('Email', 'Email Address', 'E-mail').toLowerCase(),
    phone: pick('Phone', 'Contact Number', 'Mobile', 'Phone Number'),
    company: pick('Company', 'Company / Org', 'Organization', 'Org'),
    designation: pick('Designation', 'Title', 'Role'),
    linkedin: pick('LinkedIn', 'LinkedIn URL', 'Linkedin'),
    website: pick('Website', 'Company Website'),
    priority: pick('Priority'),
    leadType: pick('Lead Type', 'Type'),
    sector: pick('Sector / Segment', 'Sector', 'Segment', 'Industry'),
    region: pick('Region'),
    country: pick('Country'),
    city: pick('City'),
    notes: pick('Notes', 'Comments', 'Remarks'),
  }
}

export default function LeadsView({ leads, canManage, onOpenLead, onReload, notify }: Props) {
  const { userEmail } = useCrm()
  const [poolFilter, setPoolFilter] = useState<'all' | 'pool' | 'mine' | 'dumped'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [processFilter, setProcessFilter] = useState<'all' | ProcessStatus>('all')
  const [stageFilter, setStageFilter] = useState<'all' | PipelineStage>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selected, setSelected] = useState<string[]>([])
  const [busy, setBusy] = useState('')
  const [upload, setUpload] = useState<ParsedUpload | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetPage = () => setPage(1)

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase()
    let result = leads
    // Ownership scope: dumped leads only show in their own tab
    if (poolFilter === 'dumped') result = result.filter((l) => l.dumped)
    else {
      result = result.filter((l) => !l.dumped)
      if (poolFilter === 'pool') result = result.filter((l) => !l.owner)
      if (poolFilter === 'mine') result = result.filter((l) => l.owner?.toLowerCase() === userEmail.toLowerCase())
    }
    result = result.filter(
      (l) =>
        !term ||
        l.name.toLowerCase().includes(term) ||
        l.company.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term) ||
        l.sector.toLowerCase().includes(term) ||
        l.country.toLowerCase().includes(term)
    )
    if (dateFilter !== 'all') {
      const now = new Date()
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const cutoff = dateFilter === 'today' ? dayStart : dateFilter === 'week' ? dayStart - 6 * 86_400_000 : dayStart - 29 * 86_400_000
      result = result.filter((l) => new Date(l.createdAt || l.lastActivity).getTime() >= cutoff)
    }
    if (processFilter !== 'all') result = result.filter((l) => l.processStatus === processFilter)
    if (stageFilter !== 'all') result = result.filter((l) => l.stage === stageFilter)
    if (statusFilter !== 'all') result = result.filter((l) => l.status === statusFilter)
    return result
  }, [leads, searchTerm, dateFilter, processFilter, stageFilter, statusFilter, poolFilter, userEmail])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages)
  const pageLeads = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

  const poolAction = async (action: 'claim' | 'release' | 'dump' | 'restore' | 'assign', assignee?: string) => {
    if (selected.length === 0) return
    let reason: string | undefined
    if (action === 'dump') {
      reason = prompt('Why dump these leads? (e.g. vague, duplicate, wrong fit)') || undefined
      if (reason === undefined) return
    }
    setBusy(action)
    try {
      const res = await api<{ done: number; skipped: string[] }>('/api/admin/leads/claim', {
        method: 'POST',
        body: JSON.stringify({ leadIds: selected, action, reason, assignee }),
      })
      await onReload()
      const skippedNote = res.skipped?.length ? ` · skipped: ${res.skipped.slice(0, 3).join('; ')}${res.skipped.length > 3 ? '…' : ''}` : ''
      notify(`${res.done} lead(s) ${action === 'claim' ? 'picked up' : action === 'release' ? 'released to pool' : action === 'dump' ? 'dumped' : action === 'restore' ? 'restored' : `assigned to ${assignee?.split('@')[0]}`}${skippedNote}`, res.done === 0)
      setSelected([])
    } catch (e: any) {
      notify(e.message, true)
    } finally {
      setBusy('')
    }
  }

  const setProcess = async (status: ProcessStatus) => {
    if (selected.length === 0) return
    setBusy('process')
    try {
      await api('/api/admin/leads/update-status', {
        method: 'POST',
        body: JSON.stringify({ leadIds: selected, processStatus: status }),
      })
      await onReload()
      notify(`${selected.length} lead(s) ${status === 'active' ? 'started' : status}`)
      setSelected([])
    } catch (e: any) {
      notify(e.message, true)
    } finally {
      setBusy('')
    }
  }

  const deleteSelected = async () => {
    if (selected.length === 0) return
    if (!confirm(`Delete ${selected.length} lead(s)? This cannot be undone.`)) return
    setBusy('delete')
    try {
      const params = selected.map((id) => `id=${encodeURIComponent(id)}`).join('&')
      await api(`/api/admin/leads?${params}`, { method: 'DELETE' })
      await onReload()
      notify(`Deleted ${selected.length} lead(s)`)
      setSelected([])
    } catch (e: any) {
      notify(e.message, true)
    } finally {
      setBusy('')
    }
  }

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(new Uint8Array(e.target?.result as ArrayBuffer), { type: 'array' })
        const valid: Partial<Lead>[] = []
        const warnings: string[] = []
        let skipped = 0
        for (const sheetName of workbook.SheetNames) {
          if (/instructions|read me|pivot/i.test(sheetName)) continue
          const rows = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName], { defval: '' })
          rows.forEach((row, i) => {
            const lead = rowToLead(row)
            if (!lead) {
              if (Object.values(row).some((v) => String(v).trim())) {
                skipped++
                warnings.push(`${sheetName} row ${i + 2}: no Name — skipped`)
              }
              return
            }
            if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
              warnings.push(`${sheetName} row ${i + 2}: "${lead.email}" doesn't look like an email — kept as-is`)
            }
            valid.push(lead)
          })
        }
        setUpload({ valid, warnings: warnings.slice(0, 50), skipped })
      } catch {
        notify('Could not read that file. Save it as .xlsx and try again.', true)
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsArrayBuffer(file)
  }

  const confirmImport = async () => {
    if (!upload || upload.valid.length === 0) return
    setBusy('import')
    try {
      const result = await api<{ added: number; updated: number }>('/api/admin/leads/bulk-upload', {
        method: 'POST',
        body: JSON.stringify({ leads: upload.valid }),
      })
      await onReload()
      notify(`Imported ${result.added} new lead(s)${result.updated ? `, refreshed ${result.updated}` : ''}`)
      setUpload(null)
    } catch (e: any) {
      notify(e.message, true)
    } finally {
      setBusy('')
    }
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="bg-white border-b border-gray-200 px-3 sm:px-4 py-2.5 space-y-2.5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-64 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search name, company, email, sector, country..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); resetPage() }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value as any); resetPage() }} className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-700">
            <option value="all">All time</option>
            <option value="today">Added today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
          <select value={stageFilter} onChange={(e) => { setStageFilter(e.target.value as any); resetPage() }} className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-700">
            <option value="all">All stages</option>
            {PIPELINE_STAGES.map((s, i) => <option key={s} value={s}>{i + 1}. {STAGE_LABELS[s]}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as any); resetPage() }} className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-700">
            <option value="all">All lead status</option>
            {(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as LeadStatus[]).map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
          <select value={processFilter} onChange={(e) => { setProcessFilter(e.target.value as any); resetPage() }} className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-700">
            <option value="all">All process</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="stopped">Stopped</option>
          </select>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                const rows = filtered.map((l) => ({
                  Name: l.name, Email: l.email, Phone: l.phone, Company: l.company,
                  Designation: l.designation, LinkedIn: l.linkedin, Website: l.website,
                  Priority: l.priority, 'Lead Type': l.leadType, 'Sector / Segment': l.sector,
                  Region: l.region, Country: l.country, City: l.city,
                  Stage: l.stage, Status: l.status, Process: l.processStatus,
                  Owner: l.owner || 'pool', 'Value (INR)': l.value || '',
                  'Emails Sent': l.emailHistory.filter((e) => e.status === 'sent').length,
                  'Last Activity': l.lastActivity?.slice(0, 10), Notes: l.notes,
                }))
                const wb = XLSX.utils.book_new()
                XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Leads')
                XLSX.writeFile(wb, `gennoor-leads-${new Date().toISOString().slice(0, 10)}.xlsx`)
                notify(`Exported ${rows.length} lead(s)`)
              }}
              className="px-3 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2"
              title="Download the currently filtered leads as Excel"
            >
              <Download className="w-4 h-4" /> Export ({filtered.length})
            </button>
            <a href="/api/admin/template" className="px-3 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2">
              <Download className="w-4 h-4" /> Template
            </a>
            {canManage && (
              <>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={handleFile} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Excel
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Pool scope chips */}
          <div className="flex items-center gap-1.5">
            {([
              ['all', `All active (${leads.filter((l) => !l.dumped).length})`],
              ['pool', `Pool — pick up (${leads.filter((l) => !l.dumped && !l.owner).length})`],
              ['mine', `My leads (${leads.filter((l) => !l.dumped && l.owner?.toLowerCase() === userEmail.toLowerCase()).length})`],
              ['dumped', `Dumped (${leads.filter((l) => l.dumped).length})`],
            ] as Array<[typeof poolFilter, string]>).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setPoolFilter(key); resetPage(); setSelected([]) }}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${poolFilter === key ? (key === 'dumped' ? 'bg-gray-700 text-white border-gray-700' : 'bg-blue-600 text-white border-blue-600') : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500">Showing {filtered.length} of {leads.length} leads</div>
        </div>
      </div>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="bg-blue-50 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-blue-700 font-medium">{selected.length} selected</span>
          <div className="flex flex-wrap items-center gap-2">
            {/* Pool actions */}
            {poolFilter === 'dumped' ? (
              <button onClick={() => poolAction('restore')} disabled={!!busy} className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded hover:bg-emerald-700 flex items-center gap-1.5 disabled:opacity-50">
                <Undo2 className="w-3.5 h-3.5" /> Restore to pool
              </button>
            ) : (
              <>
                <button onClick={() => poolAction('claim')} disabled={!!busy} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 flex items-center gap-1.5 disabled:opacity-50">
                  <Hand className="w-3.5 h-3.5" /> Pick up
                </button>
                <button onClick={() => poolAction('release')} disabled={!!busy} className="px-3 py-1.5 border border-blue-300 text-blue-700 text-xs rounded hover:bg-blue-50 flex items-center gap-1.5 disabled:opacity-50">
                  <Undo2 className="w-3.5 h-3.5" /> Release
                </button>
                <button onClick={() => poolAction('dump')} disabled={!!busy} className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-100 flex items-center gap-1.5 disabled:opacity-50">
                  <Archive className="w-3.5 h-3.5" /> Dump
                </button>
                {canManage && (
                  <select
                    defaultValue=""
                    onChange={(e) => { if (e.target.value) { poolAction('assign', e.target.value); e.target.value = '' } }}
                    disabled={!!busy}
                    className="px-2 py-1.5 border border-purple-300 text-purple-700 text-xs rounded bg-white disabled:opacity-50"
                  >
                    <option value="" disabled>Assign to…</option>
                    {CRM_TEAM.map((u) => <option key={u} value={u}>{u.split('@')[0]}</option>)}
                  </select>
                )}
              </>
            )}
            <div className="flex items-center rounded overflow-hidden border border-gray-200">
              <button onClick={() => setProcess('active')} disabled={!!busy} className="px-3 py-1.5 bg-green-600 text-white text-xs hover:bg-green-700 disabled:opacity-50">Start</button>
              <button onClick={() => setProcess('paused')} disabled={!!busy} className="px-3 py-1.5 bg-yellow-500 text-white text-xs hover:bg-yellow-600 disabled:opacity-50">Pause</button>
              <button onClick={() => setProcess('stopped')} disabled={!!busy} className="px-3 py-1.5 bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-50">Stop</button>
            </div>
            {canManage && (
              <button onClick={deleteSelected} disabled={!!busy} className="px-3 py-1.5 bg-gray-700 text-white text-xs rounded hover:bg-gray-800 flex items-center gap-1.5 disabled:opacity-50">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            )}
            <button onClick={() => setSelected([])} className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left w-10">
                <input
                  type="checkbox"
                  className="rounded"
                  checked={pageLeads.length > 0 && pageLeads.every((l) => selected.includes(l.id))}
                  onChange={(e) => setSelected(e.target.checked ? [...new Set([...selected, ...pageLeads.map((l) => l.id)])] : selected.filter((id) => !pageLeads.some((l) => l.id === id)))}
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Lead</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Process</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Research</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageLeads.length === 0 && (
              <tr>
                <td colSpan={10} className="px-6 py-16 text-center text-gray-400 text-sm">
                  {leads.length === 0 ? 'No leads yet. Download the template, fill it, and upload it here.' : 'No leads match the current filters.'}
                </td>
              </tr>
            )}
            {pageLeads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onOpenLead(lead.id)}>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={selected.includes(lead.id)}
                    onChange={(e) => setSelected(e.target.checked ? [...selected, lead.id] : selected.filter((id) => id !== lead.id))}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                  <div className="text-xs text-gray-500">{lead.email || <span className="text-amber-500">no email</span>}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{lead.company || '—'}</div>
                  <div className="text-xs text-gray-500">{lead.designation}</div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {[lead.city, lead.country].filter(Boolean).join(', ') || lead.region || '—'}
                </td>
                <td className="px-4 py-3"><StageBar stage={lead.stage} /></td>
                <td className="px-4 py-3"><StatusBadge status={lead.status} /></td>
                <td className="px-4 py-3">
                  {lead.dumped ? (
                    <span className="text-[11px] bg-gray-200 text-gray-600 rounded-full px-2 py-0.5" title={lead.dumped.reason}>dumped</span>
                  ) : lead.owner ? (
                    <span className={`text-[11px] rounded-full px-2 py-0.5 ${lead.owner.toLowerCase() === userEmail.toLowerCase() ? 'bg-blue-100 text-blue-700 font-medium' : 'bg-gray-100 text-gray-600'}`}>
                      {lead.owner.toLowerCase() === userEmail.toLowerCase() ? 'me' : lead.owner.split('@')[0]}
                    </span>
                  ) : (
                    <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-0.5">pool</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-xs">
                    {lead.aiResearch ? <span className="inline-flex items-center gap-1 text-purple-600"><Brain className="w-3.5 h-3.5" /> done</span> : <span className="text-gray-400">—</span>}
                    {lead.emailHistory.length > 0 && <span className="inline-flex items-center gap-1 text-blue-600"><Mail className="w-3.5 h-3.5" /> {lead.emailHistory.length}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">{timeAgo(lead.lastActivity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-3 sm:px-4 py-2.5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>
              {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} of {filtered.length}
            </span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); resetPage() }} className="border border-gray-200 rounded px-1.5 py-1 text-xs">
              {PAGE_SIZES.map((n) => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, safePage - 1))} disabled={safePage === 1} className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-40 hover:bg-gray-50">Prev</button>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let p: number
              if (totalPages <= 7) p = i + 1
              else if (safePage <= 4) p = i + 1
              else if (safePage >= totalPages - 3) p = totalPages - 6 + i
              else p = safePage - 3 + i
              return (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded text-sm ${safePage === p ? 'bg-blue-600 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>
                  {p}
                </button>
              )
            })}
            <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages} className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Upload preview modal */}
      {upload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Import preview</h3>
              <button onClick={() => setUpload(null)} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="px-6 py-4 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-green-50 rounded-lg p-3"><div className="text-2xl font-bold text-green-700">{upload.valid.length}</div><div className="text-xs text-green-700">ready to import</div></div>
                <div className="bg-amber-50 rounded-lg p-3"><div className="text-2xl font-bold text-amber-700">{upload.warnings.length}</div><div className="text-xs text-amber-700">warnings</div></div>
                <div className="bg-red-50 rounded-lg p-3"><div className="text-2xl font-bold text-red-700">{upload.skipped}</div><div className="text-xs text-red-700">skipped (no name)</div></div>
              </div>
              <p className="text-xs text-gray-500">Only a Name is required — blank fields are fine and can be completed later. Existing leads (same email, or same name + company) are refreshed, never duplicated.</p>
              {upload.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1 max-h-40 overflow-y-auto">
                  {upload.warnings.map((w, i) => <div key={i}>{w}</div>)}
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setUpload(null)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={confirmImport} disabled={busy === 'import' || upload.valid.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50">
                {busy === 'import' ? <Spinner label="Importing..." /> : `Import ${upload.valid.length} lead(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
