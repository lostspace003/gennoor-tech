'use client'

import { useEffect, useState } from 'react'
import { Download, Loader2, Mail, ExternalLink, UserPlus } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'

export interface ProspectRow { name: string; degree?: string; title?: string; company?: string; location?: string; linkedin?: string; group?: string }
type Found = { email?: string; emailStatus?: string; note?: string }

const btn = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md border border-gray-200 bg-raised hover:border-gray-400 disabled:opacity-40'
const CREDITS_PER_EMAIL = 2

/**
 * A table of people with clickable names and emails, a "find email" button per person (or for all), an Excel
 * download, and "Add to CRM" for the ticked rows. Emails cost prospecting credits, so nothing is looked up until a
 * button is pressed.
 */
export default function ProspectTable({ rows, fileName = 'prospects' }: { rows: ProspectRow[]; fileName?: string }) {
  const [found, setFound] = useState<Record<number, Found>>({})
  const [busy, setBusy] = useState<number | 'all' | null>(null)
  const [msg, setMsg] = useState('')
  const [xl, setXl] = useState(false)
  const [picked, setPicked] = useState<number[]>([])
  const [crm, setCrm] = useState<{ busy: boolean; note: string }>({ busy: false, note: '' })
  useEffect(() => { setFound({}); setMsg(''); setPicked([]); setCrm({ busy: false, note: '' }) }, [rows])

  // Ticked people become CRM leads (unassigned). Anyone already there is updated, not added twice.
  async function addToCrm() {
    setCrm({ busy: true, note: '' }); setMsg('')
    try {
      const leads = picked.map(i => ({ name: rows[i].name, company: rows[i].company || '', designation: rows[i].title || '', country: rows[i].location || '', linkedin: rows[i].linkedin || '', email: (found[i]?.email || '').toLowerCase(), source: 'LinkedIn hub' }))
      const r = await fetch('/api/admin/leads/bulk-upload', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ leads }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) { setMsg(j.error || `Could not add them (${r.status})`); setCrm({ busy: false, note: '' }); return }
      setCrm({ busy: false, note: `${j.added} added to the CRM${j.updated ? `, ${j.updated} already there` : ''}` })
      setPicked([])
    } catch (e: any) { setMsg(e?.message || 'Request failed'); setCrm({ busy: false, note: '' }) }
  }

  async function find(idx: number[]) {
    setBusy(idx.length === 1 ? idx[0] : 'all'); setMsg('')
    try {
      for (let s = 0; s < idx.length; s += 50) {
        const chunk = idx.slice(s, s + 50)
        const r = await fetch('/api/admin/prospecting/find-emails', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ people: chunk.map(i => ({ name: rows[i].name, company: rows[i].company, linkedin: rows[i].linkedin })) }) })
        const j = await r.json().catch(() => ({}))
        if (!r.ok) { setMsg(j.error || `Failed (${r.status})`); break }
        setFound(f => { const n = { ...f }; chunk.forEach((i, k) => { n[i] = j.rows?.[k] || {} }); return n })
        if (j.error) { setMsg(j.error); break }
      }
    } catch (e: any) { setMsg(e?.message || 'Request failed') }
    setBusy(null)
  }

  async function excel() {
    setXl(true)
    try {
      const r = await fetch('/api/admin/prospecting/export', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: fileName, rows: rows.map((p, i) => ({ ...p, ...found[i] })) }) })
      if (!r.ok) { setMsg((await r.json().catch(() => ({}))).error || 'Could not build the file.'); setXl(false); return }
      const url = URL.createObjectURL(await r.blob())
      const a = document.createElement('a')
      a.href = url; a.download = `${fileName}.xlsx`; a.click(); URL.revokeObjectURL(url)
    } catch (e: any) { setMsg(e?.message || 'Download failed') }
    setXl(false)
  }

  const pending = rows.map((_, i) => i).filter(i => !found[i]?.email && (rows[i].linkedin || rows[i].company))
  const groups = rows.some(r => r.group)
  const cols = rows.some(r => r.degree)
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={excel} disabled={xl || !rows.length} className={btn}>{xl ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}Download Excel</button>
        <button onClick={() => find(pending)} disabled={busy !== null || !pending.length} className={btn}>{busy === 'all' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Mail className="w-3.5 h-3.5" />}Find emails for all ({pending.length})</button>
        <button onClick={addToCrm} disabled={crm.busy || !picked.length} className={btn} title="Tick people in the list, then add them to the CRM as leads">{crm.busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <UserPlus className="w-3.5 h-3.5" />}Add to CRM{picked.length ? ` (${picked.length})` : ''}</button>
        <InfoTip text={`Looks each person up with your prospecting key. It costs about ${CREDITS_PER_EMAIL} credits per email found, so about ${pending.length * CREDITS_PER_EMAIL} for everyone below. People without a company or LinkedIn link cannot be matched. Nothing runs until you press a button.`} />
        {crm.note && <span className="text-xs text-emerald-700">{crm.note}. <a href="/crm/leads?scope=pool" className="underline">Open them</a></span>}
        {msg && <span className="text-xs text-red-700">{msg}</span>}
      </div>
      <div className="rounded-lg border border-gray-200 bg-raised overflow-auto max-h-[60vh]">
        <table className="w-full text-[13px]">
          <thead className="sticky top-0 bg-gray-50 text-xs text-gray-500"><tr>
            <th className="px-3 py-2 w-8"><input type="checkbox" aria-label="Select everyone" checked={rows.length > 0 && picked.length === rows.length} onChange={e => setPicked(e.target.checked ? rows.map((_, i) => i) : [])} /></th>
            <th className="text-left px-3 py-2 font-medium">Name</th>
            <th className="text-left px-3 py-2 font-medium">Title</th>
            <th className="text-left px-3 py-2 font-medium">Company</th>
            <th className="text-left px-3 py-2 font-medium">Location</th>
            <th className="text-left px-3 py-2 font-medium">Email</th>
          </tr></thead>
          <tbody>
            {rows.map((p, i) => {
              const f = found[i]
              return (
                <tr key={i} className="border-t border-gray-100 align-top hover:bg-gray-50">
                  <td className="px-3 py-2"><input type="checkbox" aria-label={`Select ${p.name}`} checked={picked.includes(i)} onChange={e => setPicked(x => (e.target.checked ? [...x, i] : x.filter(n => n !== i)))} /></td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {p.linkedin ? <a href={p.linkedin} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline inline-flex items-center gap-1">{p.name}<ExternalLink className="w-3 h-3 opacity-60" /></a> : <span className="font-medium text-gray-800">{p.name}</span>}
                    {cols && p.degree && <span className="ml-1.5 text-[11px] text-gray-400">{p.degree}</span>}
                    {groups && p.group && <div className="text-[11px] text-gray-400">{p.group}</div>}
                  </td>
                  <td className="px-3 py-2 text-gray-700 min-w-[10rem]">{p.title || <span className="text-gray-300">–</span>}</td>
                  <td className="px-3 py-2 text-gray-700 min-w-[8rem]">{p.company || <span className="text-gray-300">–</span>}</td>
                  <td className="px-3 py-2 text-gray-600 min-w-[8rem]">{p.location || <span className="text-gray-300">–</span>}</td>
                  <td className="px-3 py-2 min-w-[11rem]">
                    {f?.email ? <span><a href={`mailto:${f.email}`} className="text-blue-700 hover:underline break-all">{f.email}</a>{f.emailStatus && <span className={`ml-1.5 text-[11px] ${f.emailStatus === 'valid' ? 'text-emerald-600' : 'text-amber-600'}`}>{f.emailStatus.replace('_', ' ')}</span>}</span>
                      : f?.note ? <span className="text-xs text-gray-500">{f.note}</span>
                      : <button onClick={() => find([i])} disabled={busy !== null || !(p.linkedin || p.company)} title={p.linkedin || p.company ? 'Find this person’s work email' : 'Needs a company or LinkedIn link'} className="text-xs text-gray-600 hover:text-gray-900 underline decoration-dotted disabled:no-underline disabled:text-gray-300 inline-flex items-center gap-1">{busy === i && <Loader2 className="w-3 h-3 animate-spin" />}Find email</button>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
