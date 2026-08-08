'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { Search, Upload, Download, Trash2, Brain, Mail, X, Hand, Undo2, Archive, UserPlus, Sparkles } from 'lucide-react'
import { Lead, LeadStatus, PipelineStage, ProcessStatus, PIPELINE_STAGES, COMPANY_SIZES, BUSINESS_FUNCTIONS, LEAD_INTERESTS, DECISION_ROLES } from '@/lib/crm/types'
import { StatusBadge, StageBar, timeAgo, api, STAGE_LABELS, Spinner, InfoTip, MultiSelect, PriorityBadge, normPriority } from './shared'
import { useCrm } from './CrmContext'

const CRM_TEAM = ['admin@gennoor.com', 'jalalkhan@gennoor.com', 'yusufchaudhary@gennoor.com', 'aditya@gennoor.com', 'deepanshu@gennoor.com', 'zaid@gennoor.com', 'sales@gennoor.com']

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
    companySize: pick('Company Size', 'Size', 'Org Size'),
    businessFunction: pick('Function', 'Business Function', 'Department'),
    interest: pick('Interest', 'Interested In', 'Requirement'),
    decisionRole: pick('Decision Role', 'Role Type', 'Buying Role'),
    sector: pick('Sector / Segment', 'Sector', 'Segment', 'Industry'),
    region: pick('Region'),
    country: pick('Country'),
    city: pick('City'),
    notes: pick('Notes', 'Comments', 'Remarks'),
  }
}

export default function LeadsView({ leads, canManage, onOpenLead, onReload, notify }: Props) {
  const { userEmail, isManager } = useCrm()
  const [poolFilter, setPoolFilter] = useState<'all' | 'pool' | 'mine' | 'dumped'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [processFilter, setProcessFilter] = useState<string[]>([])
  const [stageFilter, setStageFilter] = useState<string[]>([])
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [sizeFilter, setSizeFilter] = useState<string[]>([])
  const [functionFilter, setFunctionFilter] = useState<string[]>([])
  const [interestFilter, setInterestFilter] = useState<string[]>([])
  const [roleFilter, setRoleFilter] = useState<string[]>([])
  const [sourceFilter, setSourceFilter] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [selected, setSelected] = useState<string[]>([])
  const [busy, setBusy] = useState('')
  const [upload, setUpload] = useState<ParsedUpload | null>(null)
  const [adding, setAdding] = useState(false)

  // The shell header's "New lead" shortcut deep-links here as /crm/leads?new=1
  // — open the add-lead modal once and clean the URL so refreshes don't reopen it.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('new') === '1') {
      setAdding(true)
      params.delete('new')
      const qs = params.toString()
      window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''))
    }
  }, [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetPage = () => setPage(1)

  // Stage is workable straight from the list for pool leads, own leads, or any lead if manager.
  const canSetStage = (lead: Lead) => !lead.dumped && (isManager || !lead.owner || lead.owner.toLowerCase() === userEmail.toLowerCase())
  const setStage = async (leadId: string, s: PipelineStage) => {
    try {
      await api('/api/admin/leads/update-stage', { method: 'POST', body: JSON.stringify({ leadId, stage: s }) })
      await onReload()
      notify(`Stage set to ${STAGE_LABELS[s]}`)
    } catch (e: any) { notify(e.message, true) }
  }

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
    if (dateFilter === 'custom') {
      const from = dateFrom ? new Date(dateFrom).getTime() : 0
      const to = dateTo ? new Date(dateTo).getTime() + 86_400_000 : Infinity
      result = result.filter((l) => {
        const t = new Date(l.createdAt || l.lastActivity).getTime()
        return t >= from && t < to
      })
    } else if (dateFilter !== 'all') {
      const now = new Date()
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const cutoff = dateFilter === 'today' ? dayStart : dateFilter === 'week' ? dayStart - 6 * 86_400_000 : dayStart - 29 * 86_400_000
      result = result.filter((l) => new Date(l.createdAt || l.lastActivity).getTime() >= cutoff)
    }
    if (processFilter.length) result = result.filter((l) => processFilter.includes(l.processStatus))
    if (stageFilter.length) result = result.filter((l) => stageFilter.includes(l.stage))
    if (statusFilter.length) result = result.filter((l) => statusFilter.includes(l.status))
    if (priorityFilter.length) result = result.filter((l) => priorityFilter.includes(normPriority(l.priority) || 'none'))
    if (sizeFilter.length) result = result.filter((l) => sizeFilter.includes(l.companySize || 'none'))
    if (functionFilter.length) result = result.filter((l) => functionFilter.includes(l.businessFunction || 'none'))
    if (interestFilter.length) result = result.filter((l) => interestFilter.includes(l.interest || 'none'))
    if (roleFilter.length) result = result.filter((l) => roleFilter.includes(l.decisionRole || 'none'))
    if (sourceFilter.length) result = result.filter((l) => sourceFilter.includes(l.source || 'none'))
    return result
  }, [leads, searchTerm, dateFilter, dateFrom, dateTo, processFilter, stageFilter, statusFilter, priorityFilter, sizeFilter, functionFilter, interestFilter, roleFilter, sourceFilter, poolFilter, userEmail])

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

  // Multi-format import: spreadsheets parse locally (AI maps unfamiliar
  // columns); PDF/DOCX extract text server-side; MD/TXT read directly —
  // then AI pulls structured leads out of the text. Everything lands in
  // one preview before anything is saved.
  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length === 0) return
    const valid: Partial<Lead>[] = []
    const warnings: string[] = []
    let skipped = 0

    const extractFromText = async (text: string, label: string) => {
      setBusy('aimap')
      notify(`Extracting leads from ${label} with AI...`)
      const res = await api<{ leads: any[]; truncated: boolean }>('/api/admin/leads/extract-leads', {
        method: 'POST',
        body: JSON.stringify({ text }),
      })
      if (res.truncated) warnings.push(`${label}: very long document — only the first ~44k characters were scanned`)
      for (const l of res.leads) {
        if (!l.name) continue
        valid.push({
          name: String(l.name), email: String(l.email || '').toLowerCase(), phone: String(l.phone || ''),
          company: String(l.company || ''), designation: String(l.designation || ''),
          linkedin: String(l.linkedin || ''), website: String(l.website || ''),
          country: String(l.country || ''), city: String(l.city || ''), notes: String(l.notes || ''),
        })
      }
      warnings.unshift(`${label}: AI extracted ${res.leads.length} lead(s) — review before importing`)
    }

    try {
      for (const file of files) {
        const ext = (file.name.split('.').pop() || '').toLowerCase()
        if (['md', 'txt'].includes(ext)) {
          await extractFromText(await file.text(), file.name)
        } else if (['pdf', 'docx'].includes(ext)) {
          setBusy('aimap')
          const form = new FormData()
          form.append('file', file)
          const r = await fetch('/api/admin/leads/extract-file', { method: 'POST', body: form })
          const d = await r.json()
          if (!r.ok) { warnings.unshift(`${file.name}: ${d.error}`); continue }
          await extractFromText(d.text, file.name)
        } else if (['xlsx', 'xls', 'csv'].includes(ext)) {
          await parseSpreadsheet(file, valid, warnings, (n) => { skipped += n })
        } else {
          warnings.unshift(`${file.name}: unsupported format .${ext} (use xlsx, csv, pdf, docx, md or txt)`)
        }
      }
      // De-dupe across everything parsed in this upload (email, else name+company)
      const seen = new Set<string>()
      const deduped = valid.filter((l) => {
        const key = l.email ? `e:${l.email}` : `nc:${(l.name || '').toLowerCase()}|${(l.company || '').toLowerCase()}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      if (deduped.length < valid.length) warnings.unshift(`${valid.length - deduped.length} duplicate row(s) removed within this upload`)
      setUpload({ valid: deduped, warnings: warnings.slice(0, 50), skipped })
    } catch (e: any) {
      notify(e.message || 'Import failed', true)
    } finally {
      setBusy('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const parseSpreadsheet = (file: File, valid: Partial<Lead>[], warnings: string[], addSkipped: (n: number) => void) =>
    new Promise<void>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error(`Could not read ${file.name}`))
    reader.onload = async (e) => {
      try {
        const workbook = XLSX.read(new Uint8Array(e.target?.result as ArrayBuffer), { type: 'array' })
        let skipped = 0

        for (const sheetName of workbook.SheetNames) {
          if (/instructions|read me|pivot|summary|dashboard/i.test(sheetName)) continue
          const grid = XLSX.utils.sheet_to_json<any[]>(workbook.Sheets[sheetName], { header: 1, defval: '' })
          if (grid.length === 0) continue

          // Header row = first row with 3+ text cells (handles files with title rows above)
          const headerIdx = grid.findIndex((r) => r.filter((c) => typeof c === 'string' && c.trim()).length >= 3)
          if (headerIdx === -1) continue
          const rows = XLSX.utils.sheet_to_json<Record<string, any>>(workbook.Sheets[sheetName], { defval: '', range: headerIdx })
          const dataRows = rows.filter((r) => Object.values(r).some((v) => String(v).trim()))
          if (dataRows.length === 0) continue

          // Pass 1: template/known-alias mapping
          let leadsFromSheet = dataRows.map((row) => rowToLead(row))
          const hitRate = leadsFromSheet.filter(Boolean).length / dataRows.length

          // Pass 2: sheet doesn't look like our template — ask AI to map columns
          if (hitRate < 0.5) {
            setBusy('aimap')
            notify(`"${sheetName}" doesn't match the template — asking AI to map the columns...`)
            try {
              const headers = Object.keys(dataRows[0])
              const res = await api<{ mapping: Record<string, string | null>; note: string; confidence: string }>(
                '/api/admin/leads/map-columns',
                { method: 'POST', body: JSON.stringify({ headers, samples: dataRows.slice(0, 3).map((r) => headers.map((h) => r[h])) }) }
              )
              const m = res.mapping
              const pick = (row: Record<string, any>, field: string) => {
                const src = m[field]
                const v = src ? String(row[src] ?? '').trim() : ''
                return v.toUpperCase() === 'NA' ? '' : v
              }
              leadsFromSheet = dataRows.map((row) => {
                const name = pick(row, 'Name')
                if (!name) return null
                return {
                  name,
                  email: pick(row, 'Email').toLowerCase(),
                  phone: pick(row, 'Phone'),
                  company: pick(row, 'Company'),
                  designation: pick(row, 'Designation'),
                  linkedin: pick(row, 'LinkedIn'),
                  website: pick(row, 'Website'),
                  priority: pick(row, 'Priority'),
                  leadType: pick(row, 'Lead Type'),
                  companySize: pick(row, 'Company Size'),
                  businessFunction: pick(row, 'Function'),
                  interest: pick(row, 'Interest'),
                  decisionRole: pick(row, 'Decision Role'),
                  sector: pick(row, 'Sector / Segment'),
                  region: pick(row, 'Region'),
                  country: pick(row, 'Country'),
                  city: pick(row, 'City'),
                  notes: pick(row, 'Notes'),
                } as Partial<Lead>
              })
              const used = Object.entries(m).filter(([, v]) => v).map(([f, v]) => `${v}→${f}`).join(', ')
              warnings.unshift(`${sheetName}: AI-mapped columns (${res.confidence} confidence): ${used}${res.note ? ` · ${res.note}` : ''}`)
            } catch (err: any) {
              warnings.unshift(`${sheetName}: AI mapping failed (${err.message}) — rows imported only where standard columns matched`)
            } finally {
              setBusy('')
            }
          }

          leadsFromSheet.forEach((lead, i) => {
            if (!lead) {
              skipped++
              if (warnings.length < 50) warnings.push(`${sheetName} row ${headerIdx + i + 2}: no Name — skipped`)
              return
            }
            if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
              warnings.push(`${sheetName} row ${headerIdx + i + 2}: "${lead.email}" doesn't look like an email — kept as-is`)
            }
            valid.push(lead)
          })
        }
        addSkipped(skipped)
        resolve()
      } catch {
        reject(new Error(`Could not read ${file.name}. Save it as .xlsx/.csv and try again.`))
      }
    }
    reader.readAsArrayBuffer(file)
  })

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
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select value={dateFilter} onChange={(e) => { setDateFilter(e.target.value as any); resetPage() }} className="text-sm border border-gray-200 rounded-lg px-2 py-2 text-gray-700">
            <option value="all">All time</option>
            <option value="today">Added today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="custom">Custom dates…</option>
          </select>
          {dateFilter === 'custom' && (
            <span className="flex items-center gap-1">
              <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); resetPage() }} className="text-xs border border-gray-200 rounded-lg px-2 py-2 text-gray-700" title="From date" />
              <span className="text-xs text-gray-400">→</span>
              <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); resetPage() }} className="text-xs border border-gray-200 rounded-lg px-2 py-2 text-gray-700" title="To date" />
            </span>
          )}
          <MultiSelect
            label="Priority"
            options={[{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }, { value: 'none', label: 'Not set' }]}
            values={priorityFilter}
            onChange={(v) => { setPriorityFilter(v); resetPage() }}
          />
          <MultiSelect
            label="Stage"
            options={PIPELINE_STAGES.map((s, i) => ({ value: s, label: `${i + 1}. ${STAGE_LABELS[s]}` }))}
            values={stageFilter}
            onChange={(v) => { setStageFilter(v); resetPage() }}
          />
          <MultiSelect
            label="Status"
            options={(['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as LeadStatus[]).map((s) => ({ value: s, label: s[0].toUpperCase() + s.slice(1) }))}
            values={statusFilter}
            onChange={(v) => { setStatusFilter(v); resetPage() }}
          />
          <MultiSelect
            label="Process"
            options={[{ value: 'active', label: 'Active' }, { value: 'paused', label: 'Paused' }, { value: 'stopped', label: 'Stopped' }]}
            values={processFilter}
            onChange={(v) => { setProcessFilter(v); resetPage() }}
          />
          <MultiSelect
            label="Size"
            options={[...COMPANY_SIZES.map((s) => ({ value: s, label: s })), { value: 'none', label: 'Not set' }]}
            values={sizeFilter}
            onChange={(v) => { setSizeFilter(v); resetPage() }}
          />
          <MultiSelect
            label="Function"
            options={[...BUSINESS_FUNCTIONS.map((s) => ({ value: s, label: s })), { value: 'none', label: 'Not set' }]}
            values={functionFilter}
            onChange={(v) => { setFunctionFilter(v); resetPage() }}
          />
          <MultiSelect
            label="Interest"
            options={[...LEAD_INTERESTS.map((s) => ({ value: s, label: s })), { value: 'none', label: 'Not set' }]}
            values={interestFilter}
            onChange={(v) => { setInterestFilter(v); resetPage() }}
          />
          <MultiSelect
            label="Role"
            options={[...DECISION_ROLES.map((s) => ({ value: s, label: s })), { value: 'none', label: 'Not set' }]}
            values={roleFilter}
            onChange={(v) => { setRoleFilter(v); resetPage() }}
          />
          <MultiSelect
            label="Source"
            options={[...new Set(leads.map((l) => l.source).filter(Boolean))].sort().map((s) => ({ value: s, label: s }))}
            values={sourceFilter}
            onChange={(v) => { setSourceFilter(v); resetPage() }}
          />
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setAdding(true)}
              className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 flex items-center gap-2"
              title="Add a single lead manually — it will be saved under your name"
            >
              <UserPlus className="w-4 h-4" /> Add lead
            </button>
            {canManage && (
              <button
                onClick={async () => {
                  // Empty-only: leads with a priority are never touched. Scope with the
                  // date filter (today/week/month/custom) or a manual selection.
                  const scope = selected.length ? filtered.filter((l) => selected.includes(l.id)) : filtered
                  const targets = scope.filter((l) => !(l.priority || '').trim()).map((l) => l.id)
                  if (targets.length === 0) { notify('Nothing to score — every lead in scope already has a priority', true); return }
                  setBusy('prioritize')
                  try {
                    const res = await api<{ updated: number }>('/api/admin/leads/prioritize', { method: 'POST', body: JSON.stringify({ leadIds: targets.slice(0, 60) }) })
                    await onReload()
                    notify(`AI set priority on ${res.updated} lead(s) — existing priorities untouched`)
                  } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
                }}
                disabled={busy === 'prioritize'}
                className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2 disabled:opacity-50"
                title="AI fills ONLY empty priorities. Scope it with the date filter (today / week / month / custom dates) or by selecting leads."
              >
                <Sparkles className="w-4 h-4" /> {busy === 'prioritize' ? 'Prioritizing…' : `AI priority${(() => { const scope = selected.length ? filtered.filter((l) => selected.includes(l.id)) : filtered; const n = scope.filter((l) => !(l.priority || '').trim()).length; return n ? ` (${n} empty)` : '' })()}`}
              </button>
            )}
            <button
              onClick={() => {
                const rows = filtered.map((l) => ({
                  Name: l.name, Email: l.email, Phone: l.phone, Company: l.company,
                  Designation: l.designation, LinkedIn: l.linkedin, Website: l.website,
                  Priority: l.priority, 'Lead Type': l.leadType,
                  'Company Size': l.companySize || '', Function: l.businessFunction || '',
                  Interest: l.interest || '', 'Decision Role': l.decisionRole || '',
                  'Sector / Segment': l.sector,
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
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv,.pdf,.docx,.md,.txt" multiple onChange={handleFile} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} disabled={busy === 'aimap'} className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-60" title="Excel, CSV, PDF, Word, Markdown or text — multiple files at once. AI maps or extracts what doesn't match the template.">
                  <Upload className="w-4 h-4" /> {busy === 'aimap' ? 'AI processing...' : 'Import leads'}
                </button>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Pool scope chips */}
          <div className="flex items-center gap-1.5">
            <InfoTip text="All active = every working lead. Pool = unclaimed, anyone can pick up. My leads = claimed by you (locked to you until released). Dumped = parked as vague/duplicate, restorable." />
            {([
              ['all', `All active (${leads.filter((l) => !l.dumped).length})`],
              ['pool', `Pool — pick up (${leads.filter((l) => !l.dumped && !l.owner).length})`],
              ['mine', `My leads (${leads.filter((l) => !l.dumped && l.owner?.toLowerCase() === userEmail.toLowerCase()).length})`],
              ['dumped', `Dumped (${leads.filter((l) => l.dumped).length})`],
            ] as Array<[typeof poolFilter, string]>).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setPoolFilter(key); resetPage(); setSelected([]) }}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${poolFilter === key ? (key === 'dumped' ? 'bg-gray-700 text-white border-gray-700' : 'bg-primary-600 text-white border-primary-600') : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
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
        <div className="bg-primary-50 px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm text-primary-700 font-medium flex items-center gap-1.5">{selected.length} selected
            <InfoTip text="Pick up = claim for yourself. Release = back to the pool. Dump = park as vague/duplicate (with reason). Start/Pause/Stop = outreach process. Assign & Delete are manager-only." />
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {/* Pool actions */}
            {poolFilter === 'dumped' ? (
              <button onClick={() => poolAction('restore')} disabled={!!busy} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center gap-1.5 disabled:opacity-50">
                <Undo2 className="w-3.5 h-3.5" /> Restore to pool
              </button>
            ) : (
              <>
                <button onClick={() => poolAction('claim')} disabled={!!busy} className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded hover:bg-primary-700 flex items-center gap-1.5 disabled:opacity-50">
                  <Hand className="w-3.5 h-3.5" /> Pick up
                </button>
                <button onClick={() => poolAction('release')} disabled={!!busy} className="px-3 py-1.5 border border-primary-300 text-primary-700 text-xs rounded hover:bg-primary-50 flex items-center gap-1.5 disabled:opacity-50">
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
                    className="px-2 py-1.5 border border-gray-300 text-gray-700 text-xs rounded bg-white disabled:opacity-50"
                  >
                    <option value="" disabled>Assign to…</option>
                    {CRM_TEAM.map((u) => <option key={u} value={u}>{u.split('@')[0]}</option>)}
                  </select>
                )}
              </>
            )}
            <div className="flex items-center rounded overflow-hidden border border-gray-200">
              <button onClick={() => setProcess('active')} disabled={!!busy} className="px-3 py-1.5 bg-green-600 text-white text-xs hover:bg-green-700 disabled:opacity-50">Start</button>
              <button onClick={() => setProcess('paused')} disabled={!!busy} className="px-3 py-1.5 bg-amber-500 text-white text-xs hover:bg-amber-600 disabled:opacity-50">Pause</button>
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size · Function</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Interest</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Research</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageLeads.length === 0 && (
              <tr>
                <td colSpan={12} className="px-6 py-16 text-center text-gray-400 text-sm">
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
                <td className="px-4 py-3"><PriorityBadge priority={lead.priority} /></td>
                <td className="px-4 py-3 text-xs">
                  <div className="text-gray-700">{lead.companySize || <span className="text-gray-300">—</span>}</div>
                  <div className="text-gray-400">{lead.businessFunction || ''}</div>
                </td>
                <td className="px-4 py-3 text-xs">
                  <div className="text-gray-700">{lead.interest || <span className="text-gray-300">—</span>}</div>
                  <div className="text-gray-400">{lead.decisionRole || ''}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{lead.company || '—'}</div>
                  <div className="text-xs text-gray-500">{lead.designation}</div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {[lead.city, lead.country].filter(Boolean).join(', ') || lead.region || '—'}
                </td>
                <td className="px-4 py-3"><StageBar stage={lead.stage} onSelect={canSetStage(lead) ? (s) => setStage(lead.id, s) : undefined} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <StatusBadge status={lead.status} />
                    {lead.processStatus !== 'active' && (
                      <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${lead.processStatus === 'paused' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`} title={`Process ${lead.processStatus}`}>{lead.processStatus}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {lead.dumped ? (
                    <span className="text-[11px] bg-gray-200 text-gray-600 rounded-full px-2 py-0.5" title={lead.dumped.reason}>dumped</span>
                  ) : lead.owner ? (
                    <span className={`text-[11px] rounded-full px-2 py-0.5 ${lead.owner.toLowerCase() === userEmail.toLowerCase() ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-gray-100 text-gray-600'}`}>
                      {lead.owner.toLowerCase() === userEmail.toLowerCase() ? 'me' : lead.owner.split('@')[0]}
                    </span>
                  ) : (
                    <span className="text-[11px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5">pool</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 text-xs">
                    {lead.aiResearch ? <span className="inline-flex items-center gap-1 text-gray-600"><Brain className="w-3.5 h-3.5" /> done</span> : <span className="text-gray-400">—</span>}
                    {lead.emailHistory.length > 0 && <span className="inline-flex items-center gap-1 text-primary-600"><Mail className="w-3.5 h-3.5" /> {lead.emailHistory.length}</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  <div>{timeAgo(lead.lastActivity)}</div>
                  {lead.activities?.[0] && <div className="text-[10px] text-gray-400 truncate max-w-[110px]" title={lead.activities[0].description}>{lead.activities[0].type}</div>}
                </td>
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
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded text-sm ${safePage === p ? 'bg-primary-600 text-white' : 'border border-gray-200 hover:bg-gray-50'}`}>
                  {p}
                </button>
              )
            })}
            <button onClick={() => setPage(Math.min(totalPages, safePage + 1))} disabled={safePage === totalPages} className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Manual add-lead modal — anyone can add; the lead is saved under their name */}
      {adding && (
        <AddLeadModal
          userEmail={userEmail}
          onClose={() => setAdding(false)}
          onAdded={async () => { setAdding(false); await onReload() }}
          notify={notify}
        />
      )}

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
              <button onClick={confirmImport} disabled={busy === 'import' || upload.valid.length === 0} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm disabled:opacity-50">
                {busy === 'import' ? <Spinner label="Importing..." /> : `Import ${upload.valid.length} lead(s)`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Single-lead manual entry. The creator becomes the owner by default so the
// lead lands in "My leads"; managers can release it to the pool or reassign.
function AddLeadModal({ userEmail, onClose, onAdded, notify }: {
  userEmail: string
  onClose: () => void
  onAdded: () => Promise<void>
  notify: (msg: string, isError?: boolean) => void
}) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company: '', designation: '',
    priority: '', companySize: '', businessFunction: '', interest: '', decisionRole: '',
    sector: '', country: '', city: '', linkedin: '', website: '', notes: '',
  })
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))
  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent'

  const save = async () => {
    if (!form.name.trim()) { notify('Name is required', true); return }
    setSaving(true)
    try {
      await api('/api/admin/leads', {
        method: 'POST',
        body: JSON.stringify({ ...form, email: form.email.trim().toLowerCase(), owner: userEmail, source: 'manual' }),
      })
      notify(`Lead "${form.name.trim()}" added under your name`)
      await onAdded()
    } catch (e: any) { notify(e.message, true) } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-xl max-h-[88vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Add lead manually</h3>
            <p className="text-[11px] text-gray-500">Saved under <span className="font-medium">{userEmail.split('@')[0]}</span> — a manager can release it to the pool or reassign it.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-5 overflow-y-auto space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input value={form.name} onChange={set('name')} className={inputCls} placeholder="Name *" autoFocus />
            <select value={form.priority} onChange={set('priority')} className={inputCls}>
              <option value="">Priority — not set</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select value={form.companySize} onChange={set('companySize')} className={inputCls}>
              <option value="">Company size — not set</option>
              {COMPANY_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={form.businessFunction} onChange={set('businessFunction')} className={inputCls}>
              <option value="">Function — not set</option>
              {BUSINESS_FUNCTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={form.interest} onChange={set('interest')} className={inputCls}>
              <option value="">Interest — not set</option>
              {LEAD_INTERESTS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={form.decisionRole} onChange={set('decisionRole')} className={inputCls}>
              <option value="">Decision role — not set</option>
              {DECISION_ROLES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input value={form.email} onChange={set('email')} className={inputCls} placeholder="Email" type="email" />
            <input value={form.phone} onChange={set('phone')} className={inputCls} placeholder="Phone" />
            <input value={form.company} onChange={set('company')} className={inputCls} placeholder="Company" />
            <input value={form.designation} onChange={set('designation')} className={inputCls} placeholder="Designation" />
            <input value={form.sector} onChange={set('sector')} className={inputCls} placeholder="Sector / segment" />
            <input value={form.country} onChange={set('country')} className={inputCls} placeholder="Country" />
            <input value={form.city} onChange={set('city')} className={inputCls} placeholder="City" />
            <input value={form.linkedin} onChange={set('linkedin')} className={inputCls} placeholder="LinkedIn URL" />
          </div>
          <input value={form.website} onChange={set('website')} className={inputCls} placeholder="Company website" />
          <textarea value={form.notes} onChange={set('notes')} rows={3} className={inputCls} placeholder="Notes (context, where you met them, what they need...)" />
        </div>
        <div className="px-5 py-3.5 border-t border-gray-200 flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.name.trim()} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2">
            <UserPlus className="w-4 h-4" /> {saving ? 'Saving…' : 'Add lead'}
          </button>
        </div>
      </div>
    </div>
  )
}
