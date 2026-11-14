'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import { Search, Upload, Download, Trash2, X, Hand, Undo2, Archive, UserPlus, Send, Linkedin, Mail, Check, Clock, AlertTriangle } from 'lucide-react'
import { Lead, LEAD_STEPS, STEP_LABELS, isAutoSource } from '@/lib/crm/types'
import { LEAD_COLUMNS, mapHeaders, rowToLead, looksLikeEmail, leadToRow } from '@/lib/crm/import'
import { sequenceProgress, stepNumber } from '@/lib/crm/sequence'
import { CRM_USERS, shortName } from '@/lib/crm/users'
import { SeriesDots, StatusBadge, StepStrip, timeAgo, api, Spinner, MultiSelect, Pagination, useMinute } from './shared'
import { needsAnswer } from '@/lib/crm/replies'
import { failedSeriesSend, lastSeriesSend, sendHint, sendLine, type SeriesSend } from '@/lib/crm/delivery'
import { useCrm } from './CrmContext'
import SendStepModal from './SendStep'
import FindOnLinkedIn from './FindOnLinkedIn'

const PER_PAGE = 25
type Scope = 'all' | 'replied' | 'pool' | 'mine' | 'site' | 'archived'

interface Props {
  leads: Lead[]
  canManage: boolean
  onOpenLead: (id: string) => void
  onReload: () => Promise<void>
  notify: (msg: string, isError?: boolean) => void
}

interface ParsedUpload { rows: Partial<Lead>[]; notes: string[]; skipped: number; file: string }

const SEND_ICON = { sent: Check, onItsWay: Clock, unconfirmed: AlertTriangle, failed: AlertTriangle } as const
const SEND_TONE = { sent: 'text-gray-700', onItsWay: 'text-gray-700', unconfirmed: 'text-amber-700', failed: 'text-red-700' } as const

/**
 * The series for one lead, in two short lines: what has happened to the last email ("Email 1 on its way",
 * "Email 1 sent · 3 hours ago") and what comes next ("Email 2 in 4 days", "Email 2 is due").
 * The first line used to be missing: the list said only "Email 2 in 4d", and nothing said email 1 had gone.
 */
export function seriesLines(lead: Lead, now = Date.now()): { last?: SeriesSend; next: string; due: boolean } {
  if (lead.status !== 'new' && lead.status !== 'contacted') return { next: '', due: false }
  const p = sequenceProgress(lead, now)
  const last = failedSeriesSend(lead) || lastSeriesSend(lead, now) || undefined
  if (p.stopped) return { last, next: 'Emails stopped', due: false }
  if (p.finished) return { last, next: 'Series finished', due: false }
  if (!lead.email) return { next: 'No email address', due: false }
  const n = stepNumber(p.next!.id)
  if (last?.state === 'failed') return { last, next: `Send email ${n} again`, due: true }
  if (p.sentIds.length === 0) return { next: 'Ready for email 1', due: true }
  return { last, next: p.due ? `Email ${n} is due` : `Email ${n} in ${p.daysUntil} day${p.daysUntil === 1 ? '' : 's'}`, due: p.due }
}

export default function LeadsView({ leads, canManage, onOpenLead, onReload, notify }: Props) {
  const { userEmail, ask } = useCrm()
  const me = userEmail.toLowerCase()
  const [scope, setScope] = useState<Scope>('all')
  const [search, setSearch] = useState('')
  const [orgFilter, setOrgFilter] = useState<string[]>([])
  const [stepFilter, setStepFilter] = useState<string[]>([])
  const [ownerFilter, setOwnerFilter] = useState<string[]>([])
  const [sourceFilter, setSourceFilter] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string[]>([])
  const [busy, setBusy] = useState('')
  const [upload, setUpload] = useState<ParsedUpload | null>(null)
  const [adding, setAdding] = useState(false)
  const [finding, setFinding] = useState(false)
  const [sendTo, setSendTo] = useState<Lead[] | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  // "On its way · 12 min" must stay true while the page is open
  useMinute()

  // Deep links, used once then cleaned from the address bar:
  //   ?new=1        open the Add lead window
  //   ?scope=pool   show unassigned leads (also mine, replied, site, archived)
  //   ?step=qualified   show the leads at one step
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    let touched = false
    if (params.get('new') === '1') { setAdding(true); params.delete('new'); touched = true }
    const s = params.get('scope')
    if (s === 'pool' || s === 'mine' || s === 'site' || s === 'archived' || s === 'replied') { setScope(s); params.delete('scope'); touched = true }
    const step = params.get('step')
    if (step && (LEAD_STEPS as string[]).includes(step)) { setStepFilter([step]); params.delete('step'); touched = true }
    if (touched) {
      const qs = params.toString()
      window.history.replaceState(null, '', window.location.pathname + (qs ? `?${qs}` : ''))
    }
  }, [])

  const live = useMemo(() => leads.filter((l) => !l.dumped), [leads])
  const counts = {
    all: live.length,
    // They wrote to us and nobody has answered yet
    replied: live.filter((l) => needsAnswer(l)).length,
    pool: live.filter((l) => !l.owner).length,
    mine: live.filter((l) => l.owner?.toLowerCase() === me).length,
    // Added by the site itself: people who sent a form, or bought, finished or reviewed a course
    site: live.filter((l) => isAutoSource(l.source)).length,
    archived: leads.length - live.length,
  }

  // Organizations, most leads first, for the filter
  const orgs = useMemo(() => {
    const tally = new Map<string, number>()
    for (const l of live) {
      const name = l.company?.trim()
      if (name) tally.set(name, (tally.get(name) || 0) + 1)
    }
    return [...tally.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [live])

  // Where leads came from, most common first, for the filter
  const sources = useMemo(() => {
    const tally = new Map<string, number>()
    for (const l of live) { const s = l.source?.trim() || 'Not recorded'; tally.set(s, (tally.get(s) || 0) + 1) }
    return [...tally.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
  }, [live])

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    let out = scope === 'archived' ? leads.filter((l) => l.dumped) : live
    if (scope === 'pool') out = out.filter((l) => !l.owner)
    if (scope === 'replied') out = out.filter((l) => needsAnswer(l))
    if (scope === 'mine') out = out.filter((l) => l.owner?.toLowerCase() === me)
    if (scope === 'site') out = out.filter((l) => isAutoSource(l.source))
    if (sourceFilter.length) out = out.filter((l) => sourceFilter.includes(l.source?.trim() || 'Not recorded'))
    if (term) out = out.filter((l) => [l.name, l.company, l.email, l.designation, l.country].some((v) => (v || '').toLowerCase().includes(term)))
    if (orgFilter.length) out = out.filter((l) => orgFilter.includes(l.company?.trim() || ''))
    if (stepFilter.length) out = out.filter((l) => stepFilter.includes(l.status))
    if (ownerFilter.length) out = out.filter((l) => ownerFilter.includes(l.owner ? l.owner.toLowerCase() : 'pool'))
    return out
  }, [leads, live, scope, search, orgFilter, stepFilter, ownerFilter, sourceFilter, me])

  // The row of steps counts the leads the other choices leave, before the step itself is chosen
  const stepCounts = useMemo(() => {
    const term = search.trim().toLowerCase()
    let out = scope === 'archived' ? leads.filter((l) => l.dumped) : live
    if (scope === 'pool') out = out.filter((l) => !l.owner)
    if (scope === 'replied') out = out.filter((l) => needsAnswer(l))
    if (scope === 'mine') out = out.filter((l) => l.owner?.toLowerCase() === me)
    if (scope === 'site') out = out.filter((l) => isAutoSource(l.source))
    if (sourceFilter.length) out = out.filter((l) => sourceFilter.includes(l.source?.trim() || 'Not recorded'))
    if (term) out = out.filter((l) => [l.name, l.company, l.email, l.designation, l.country].some((v) => (v || '').toLowerCase().includes(term)))
    if (orgFilter.length) out = out.filter((l) => orgFilter.includes(l.company?.trim() || ''))
    if (ownerFilter.length) out = out.filter((l) => ownerFilter.includes(l.owner ? l.owner.toLowerCase() : 'pool'))
    return Object.fromEntries(LEAD_STEPS.map((st) => [st, out.filter((l) => l.status === st).length]))
  }, [leads, live, scope, search, orgFilter, ownerFilter, sourceFilter, me])

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, pages)
  const pageLeads = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)
  const chosen = leads.filter((l) => selected.includes(l.id))
  const filtersOn = !!(search || orgFilter.length || stepFilter.length || ownerFilter.length || sourceFilter.length)
  const reset = () => { setPage(1); setSelected([]) }

  const hold = async (action: 'claim' | 'release' | 'dump' | 'restore' | 'assign', assignee?: string) => {
    if (!selected.length) return
    let reason: string | undefined
    if (action === 'dump') {
      const why = await ask({ title: `Archive ${selected.length} lead${selected.length === 1 ? '' : 's'}?`, text: 'Archived leads leave every list. They can be restored from the Archived view.', input: { label: 'Why? (kept on the lead)', placeholder: 'For example: wrong fit, duplicate, no response', required: true }, confirm: 'Archive' })
      if (why === null) return
      reason = why
    }
    setBusy(action)
    try {
      const res = await api<{ done: number; skipped: string[] }>('/api/admin/leads/claim', {
        method: 'POST', body: JSON.stringify({ leadIds: selected, action, reason, assignee }),
      })
      await onReload()
      const what = action === 'claim' ? 'picked up' : action === 'release' ? 'released' : action === 'dump' ? 'archived' : action === 'restore' ? 'restored' : `given to ${shortName(assignee)}`
      notify(`${res.done} lead${res.done === 1 ? '' : 's'} ${what}${res.skipped?.length ? `. Skipped: ${res.skipped.slice(0, 2).join('; ')}` : ''}`, res.done === 0)
      setSelected([])
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const remove = async () => {
    if (!selected.length) return
    if ((await ask({ title: `Delete ${selected.length} lead${selected.length === 1 ? '' : 's'} for good?`, text: 'Their details, emails and history are removed. This cannot be undone. To keep them out of the way without losing anything, archive them instead.', confirm: 'Delete for good', danger: true })) === null) return
    setBusy('delete')
    try {
      await api(`/api/admin/leads?${selected.map((id) => `id=${encodeURIComponent(id)}`).join('&')}`, { method: 'DELETE' })
      await onReload()
      notify(`Deleted ${selected.length} lead(s)`)
      setSelected([])
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  // Read the sheet in the browser. No guessing: headings are matched against
  // the lead sheet's columns and their common names; anything else is ignored.
  const readFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (fileRef.current) fileRef.current.value = ''
    if (!file) return
    try {
      const workbook = XLSX.read(new Uint8Array(await file.arrayBuffer()), { type: 'array' })
      const rows: Partial<Lead>[] = []
      const notes: string[] = []
      let skipped = 0
      for (const sheetName of workbook.SheetNames) {
        if (/how to use|instructions|read ?me/i.test(sheetName)) continue
        const sheet = workbook.Sheets[sheetName]
        const grid = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' })
        // The heading row is the first one that names a column we know
        const headerIdx = grid.findIndex((r) => Object.keys(mapHeaders(r.map(String))).length >= 1 && r.filter((c) => String(c).trim()).length >= 2)
        if (headerIdx === -1) { if (grid.length) notes.push(`Sheet "${sheetName}": no recognisable headings, skipped`); continue }
        const data = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '', range: headerIdx })
        const map = mapHeaders(Object.keys(data[0] || {}))
        const missing = (['Email', 'Organization'] as const).filter((c) => !map[c])
        if (missing.length) notes.push(`Sheet "${sheetName}": no ${missing.join(' or ')} column found`)
        for (const row of data) {
          if (!Object.values(row).some((v) => String(v).trim())) continue
          const lead = rowToLead(row, map)
          if (!lead) { skipped++; continue }
          if (lead.email && !looksLikeEmail(lead.email)) notes.push(`${lead.name}: "${lead.email}" does not look like an email address`)
          rows.push(lead)
        }
      }
      // One row per person within the file (by email, else name + organization)
      const seen = new Set<string>()
      const unique = rows.filter((l) => {
        const key = l.email ? `e:${l.email}` : `n:${(l.name || '').toLowerCase()}|${(l.company || '').toLowerCase()}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      if (unique.length < rows.length) notes.unshift(`${rows.length - unique.length} repeated row(s) in the file were merged`)
      setUpload({ rows: unique, notes: notes.slice(0, 30), skipped, file: file.name })
    } catch {
      notify(`Could not read ${file.name}. Save it as .xlsx or .csv and try again.`, true)
    }
  }

  const confirmImport = async () => {
    if (!upload?.rows.length) return
    setBusy('import')
    try {
      const res = await api<{ added: number; updated: number }>('/api/admin/leads/bulk-upload', { method: 'POST', body: JSON.stringify({ leads: upload.rows }) })
      await onReload()
      notify(`${res.added} new lead${res.added === 1 ? '' : 's'} added${res.updated ? `, ${res.updated} already here and updated` : ''}`)
      setUpload(null)
      setScope('pool')
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const exportLeads = () => {
    const rows = filtered.map((l) => ({
      ...leadToRow(l),
      Step: STEP_LABELS[l.status],
      'Emails sent': l.sequence?.sent.length || 0,
      Owner: l.owner ? shortName(l.owner) : '',
      'Last activity': l.lastActivity?.slice(0, 10),
    }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(rows), 'Leads')
    XLSX.writeFile(wb, `gennoor-leads-${new Date().toISOString().slice(0, 10)}.xlsx`)
    notify(`Exported ${rows.length} lead(s)`)
  }

  return (
    <div>
      {/* Add leads + find them */}
      <div className="bg-raised border-b border-gray-200 px-3 sm:px-4 py-2.5 space-y-2.5">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-52 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); reset() }}
              placeholder="Search name, organization or email"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <MultiSelect label="Organization" options={orgs.slice(0, 200).map(([name, n]) => ({ value: name, label: `${name} (${n})` }))} values={orgFilter} onChange={(v) => { setOrgFilter(v); reset() }} />
          <MultiSelect label="Owner" options={[{ value: 'pool', label: 'Unassigned' }, ...CRM_USERS.map((u) => ({ value: u, label: shortName(u) }))]} values={ownerFilter} onChange={(v) => { setOwnerFilter(v); reset() }} />
          <MultiSelect label="Came from" options={sources.map(([name, n]) => ({ value: name, label: `${name} (${n})` }))} values={sourceFilter} onChange={(v) => { setSourceFilter(v); reset() }} />
          {filtersOn && (
            <button onClick={() => { setSearch(''); setOrgFilter([]); setStepFilter([]); setOwnerFilter([]); setSourceFilter([]); reset() }} className="text-xs text-primary-600 hover:underline">Clear filters</button>
          )}
          <div className="ml-auto flex flex-wrap items-center gap-2">
            <button onClick={() => setAdding(true)} className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4" /> Add lead
            </button>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={readFile} className="hidden" />
            <button onClick={() => fileRef.current?.click()} className="px-3 py-2 border border-gray-300 text-gray-800 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-1.5" title="Upload an Excel or CSV lead sheet">
              <Upload className="w-4 h-4" /> Import
            </button>
            <button onClick={() => setFinding(true)} className="px-3 py-2 border border-gray-300 text-gray-800 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-1.5" title="Search LinkedIn and add people as leads">
              <Linkedin className="w-4 h-4" /> Find on LinkedIn
            </button>
            <a href="/api/admin/template" className="px-2 py-2 text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1" title="Download the empty lead sheet to fill in">
              <Download className="w-3.5 h-3.5" /> Lead sheet
            </a>
            <button onClick={exportLeads} className="px-2 py-2 text-xs text-gray-500 hover:text-primary-600 flex items-center gap-1" title="Download the leads shown below as Excel">
              <Download className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {([
              ['all', `All (${counts.all})`],
              ['replied', `Needs an answer (${counts.replied})`],
              ['pool', `Unassigned (${counts.pool})`],
              ['mine', `Mine (${counts.mine})`],
              ['site', `From the website (${counts.site})`],
              ['archived', `Archived (${counts.archived})`],
            ] as Array<[Scope, string]>).map(([key, label]) => (
              <button
                key={key}
                onClick={() => { setScope(key); reset() }}
                className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${scope === key ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500">{filtered.length} lead{filtered.length === 1 ? '' : 's'}</div>
        </div>
        {/* Where they stand, in one row. Press a step to see only its leads; press it again to see all. */}
        {scope !== 'archived' && (
          <StepStrip counts={stepCounts} active={stepFilter} onPick={(st) => { setStepFilter(stepFilter.includes(st) ? stepFilter.filter((x) => x !== st) : [...stepFilter, st]); reset() }} />
        )}
      </div>

      {/* What to do with the ticked leads */}
      {selected.length > 0 && (
        <div className="bg-primary-50 px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 sticky top-0 z-20">
          <span className="text-sm text-primary-700 font-medium mr-1">{selected.length} selected</span>
          {scope === 'archived' ? (
            <button onClick={() => hold('restore')} disabled={!!busy} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 flex items-center gap-1.5 disabled:opacity-50">
              <Undo2 className="w-3.5 h-3.5" /> Restore
            </button>
          ) : (
            <>
              <button onClick={() => setSendTo(chosen)} disabled={!!busy} className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 flex items-center gap-1.5 disabled:opacity-50">
                <Send className="w-3.5 h-3.5" /> Send next email
              </button>
              <button onClick={() => hold('claim')} disabled={!!busy} className="px-3 py-1.5 border border-primary-300 bg-raised text-primary-700 text-xs rounded-lg hover:bg-primary-50 flex items-center gap-1.5 disabled:opacity-50">
                <Hand className="w-3.5 h-3.5" /> Pick up
              </button>
              <button onClick={() => hold('release')} disabled={!!busy} className="px-3 py-1.5 border border-gray-300 bg-raised text-gray-700 text-xs rounded-lg hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50">
                <Undo2 className="w-3.5 h-3.5" /> Release
              </button>
              {canManage && (
                <select
                  defaultValue=""
                  onChange={(e) => { if (e.target.value) { hold('assign', e.target.value); e.target.value = '' } }}
                  disabled={!!busy}
                  className="px-2 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-lg bg-raised disabled:opacity-50"
                >
                  <option value="" disabled>Give to…</option>
                  {CRM_USERS.map((u) => <option key={u} value={u}>{shortName(u)}</option>)}
                </select>
              )}
              <button onClick={() => hold('dump')} disabled={!!busy} className="px-3 py-1.5 border border-gray-300 bg-raised text-gray-700 text-xs rounded-lg hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50">
                <Archive className="w-3.5 h-3.5" /> Archive
              </button>
            </>
          )}
          {canManage && (
            <button onClick={remove} disabled={!!busy} className="px-3 py-1.5 text-red-600 text-xs rounded-lg hover:bg-red-50 flex items-center gap-1.5 disabled:opacity-50">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          )}
          <button onClick={() => setSelected([])} className="ml-auto text-xs text-gray-500 hover:text-gray-800">Clear</button>
        </div>
      )}

      {/* The list */}
      <div className="bg-raised overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-2.5 text-left w-10">
                <input
                  type="checkbox"
                  className="rounded"
                  aria-label="Select all on this page"
                  checked={pageLeads.length > 0 && pageLeads.every((l) => selected.includes(l.id))}
                  onChange={(e) => setSelected(e.target.checked ? [...new Set([...selected, ...pageLeads.map((l) => l.id)])] : selected.filter((id) => !pageLeads.some((l) => l.id === id)))}
                />
              </th>
              {['Lead', 'Organization', 'Step', 'Email series', 'Owner'].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pageLeads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-14 text-center text-sm text-gray-400">
                  {leads.length === 0
                    ? 'No leads yet. Press Add lead, Import a lead sheet, or Find on LinkedIn.'
                    : 'No leads match. Clear the filters to see more.'}
                </td>
              </tr>
            )}
            {pageLeads.map((lead) => {
              const series = seriesLines(lead)
              const LastIcon = series.last ? SEND_ICON[series.last.state] : Mail
              return (
                <tr key={lead.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => onOpenLead(lead.id)}>
                  <td className="px-4 py-2.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      className="rounded"
                      aria-label={`Select ${lead.name}`}
                      checked={selected.includes(lead.id)}
                      onChange={(e) => setSelected(e.target.checked ? [...selected, lead.id] : selected.filter((id) => id !== lead.id))}
                    />
                  </td>
                  <td className="px-4 py-2.5 max-w-[240px]">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {lead.name}
                      {needsAnswer(lead) && <span className={`ml-2 align-middle text-[10.5px] font-semibold rounded-full px-1.5 py-0.5 ${lead.reply?.kind === 'stop' ? 'bg-gray-200 text-gray-700' : 'bg-red-100 text-red-700'}`}>{lead.reply?.kind === 'stop' ? 'asked to stop' : 'replied'}</span>}
                    </div>
                    <div className="text-xs text-gray-500 truncate">{lead.email || <span className="text-amber-600">no email</span>}</div>
                  </td>
                  <td className="px-4 py-2.5 max-w-[240px]">
                    <div className="text-sm text-gray-900 truncate">{lead.company || <span className="text-gray-300">not set</span>}</div>
                    <div className="text-xs text-gray-500 truncate">{[lead.designation, lead.country, isAutoSource(lead.source) ? lead.source : ''].filter(Boolean).join(' · ')}</div>
                  </td>
                  <td className="px-4 py-2.5">
                    {lead.dumped ? <span className="text-[11px] bg-gray-200 text-gray-600 rounded-full px-2 py-0.5" title={lead.dumped.reason}>Archived</span> : <StatusBadge status={lead.status} />}
                  </td>
                  <td className="px-4 py-2.5 whitespace-nowrap">
                    {series.last || series.next ? (
                      <>
                        <div className="mb-1"><SeriesDots lead={lead} /></div>
                        {/* What has happened to the last email, then what comes next */}
                        {series.last && (
                          <div className={`text-xs flex items-center gap-1 ${SEND_TONE[series.last.state]}`} title={sendHint(series.last)}>
                            <LastIcon className={`w-3 h-3 shrink-0 ${series.last.state === 'sent' ? 'text-green-600' : ''}`} /> {sendLine(series.last)}
                          </div>
                        )}
                        {series.next && (
                          <div className={`text-xs flex items-center gap-1 ${series.due ? 'text-primary-700 font-medium' : 'text-gray-500'}`}>
                            {!series.last && <Mail className="w-3 h-3 shrink-0" />}<span className={series.last ? 'pl-4' : ''}>{series.next}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">{timeAgo(lead.lastActivity)}</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5">
                    {lead.owner ? (
                      <span className={`text-[11px] rounded-full px-2 py-0.5 ${lead.owner.toLowerCase() === me ? 'bg-primary-100 text-primary-700 font-medium' : 'bg-gray-100 text-gray-600'}`}>
                        {lead.owner.toLowerCase() === me ? 'me' : shortName(lead.owner)}
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-400">unassigned</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="px-3 sm:px-4 py-2.5 border-t border-gray-200">
          <Pagination page={safePage} total={filtered.length} perPage={PER_PAGE} onPage={setPage} />
        </div>
      </div>

      {adding && <AddLeadModal userEmail={userEmail} onClose={() => setAdding(false)} onAdded={async () => { setAdding(false); await onReload() }} notify={notify} />}

      {finding && <FindOnLinkedIn onClose={() => setFinding(false)} onAdded={async () => { await onReload() }} notify={notify} />}

      {sendTo && <SendStepModal leads={sendTo} notify={notify} onClose={() => setSendTo(null)} onSent={async () => { setSendTo(null); setSelected([]); await onReload() }} />}

      {/* Check the sheet before anything is saved */}
      {upload && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-raised rounded-xl w-full max-w-3xl max-h-[88vh] flex flex-col">
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">Check before importing</h3>
                <p className="text-xs text-gray-500">{upload.file} · {upload.rows.length} lead{upload.rows.length === 1 ? '' : 's'} found{upload.skipped ? ` · ${upload.skipped} row(s) without a name skipped` : ''}</p>
              </div>
              <button onClick={() => setUpload(null)} className="p-2 hover:bg-gray-100 rounded" aria-label="Close"><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="px-5 py-4 overflow-y-auto flex-1 space-y-3">
              {upload.rows.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No leads were found. The sheet needs a <strong>Name</strong> column. <a href="/api/admin/template" className="text-primary-600 underline">Download the lead sheet</a> and copy your leads into it.
                </p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>{['Name', 'Email', 'Organization', 'Designation', 'Country'].map((h) => <th key={h} className="px-3 py-2 text-left font-medium text-gray-500">{h}</th>)}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {upload.rows.slice(0, 8).map((l, i) => (
                        <tr key={i}>
                          <td className="px-3 py-1.5 text-gray-900">{l.name}</td>
                          <td className="px-3 py-1.5 text-gray-600">{l.email || <span className="text-amber-600">blank</span>}</td>
                          <td className="px-3 py-1.5 text-gray-600">{l.company || <span className="text-amber-600">blank</span>}</td>
                          <td className="px-3 py-1.5 text-gray-600">{l.designation}</td>
                          <td className="px-3 py-1.5 text-gray-600">{l.country}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {upload.rows.length > 8 && <div className="px-3 py-1.5 text-[11px] text-gray-400 bg-gray-50">and {upload.rows.length - 8} more</div>}
                </div>
              )}
              {upload.notes.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1 max-h-36 overflow-y-auto">
                  {upload.notes.map((w, i) => <div key={i}>{w}</div>)}
                </div>
              )}
              <p className="text-xs text-gray-500">
                New leads arrive unassigned. Anyone already in the CRM (same email, or same name and organization) is updated, never added twice, and blank cells do not erase anything.
              </p>
            </div>
            <div className="px-5 py-3.5 border-t border-gray-200 flex justify-end gap-2">
              <button onClick={() => setUpload(null)} className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={confirmImport} disabled={busy === 'import' || upload.rows.length === 0} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm disabled:opacity-50">
                {busy === 'import' ? <Spinner label="Importing…" /> : `Import ${upload.rows.length} lead${upload.rows.length === 1 ? '' : 's'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// One lead, typed in. Saved under the person who adds it.
function AddLeadModal({ userEmail, onClose, onAdded, notify }: {
  userEmail: string
  onClose: () => void
  onAdded: () => Promise<void>
  notify: (msg: string, isError?: boolean) => void
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', designation: '', country: '', linkedin: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const cls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent'

  const save = async () => {
    if (!form.name.trim()) { notify('Name is required', true); return }
    setSaving(true)
    try {
      await api('/api/admin/leads', { method: 'POST', body: JSON.stringify({ ...form, name: form.name.trim(), email: form.email.trim().toLowerCase(), owner: userEmail, source: 'Added by hand' }) })
      notify(`${form.name.trim()} added to your leads`)
      await onAdded()
    } catch (e: any) { notify(e.message, true) } finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-raised rounded-xl w-full max-w-lg max-h-[88vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h3 className="text-base font-semibold text-gray-900">Add a lead</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded" aria-label="Close"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-5 overflow-y-auto space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <input value={form.name} onChange={set('name')} className={cls} placeholder="Name (required)" autoFocus />
            <input value={form.company} onChange={set('company')} className={cls} placeholder="Organization" />
            <input value={form.email} onChange={set('email')} className={cls} placeholder="Email" type="email" />
            <input value={form.phone} onChange={set('phone')} className={cls} placeholder="Phone" />
            <input value={form.designation} onChange={set('designation')} className={cls} placeholder="Designation" />
            <input value={form.country} onChange={set('country')} className={cls} placeholder="Country" />
          </div>
          <input value={form.linkedin} onChange={set('linkedin')} className={cls} placeholder="LinkedIn profile link" />
          <textarea value={form.notes} onChange={set('notes')} rows={3} className={cls} placeholder="Notes: where you met, what they need" />
          <p className="text-[11px] text-gray-400">These are the same {LEAD_COLUMNS.length} fields as the lead sheet. Only the name is required.</p>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-200 flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving || !form.name.trim()} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50">
            {saving ? 'Saving…' : 'Add lead'}
          </button>
        </div>
      </div>
    </div>
  )
}
