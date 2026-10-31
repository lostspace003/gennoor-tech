'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, Plus, Trash2, KeyRound, CheckCircle2 } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'
import ProspectTable, { type ProspectRow } from '@/components/admin/ProspectTable'

interface KeyInfo { fixed?: boolean; id: string; label: string; last4: string; active: boolean; ok: boolean; remaining?: number; allocated?: number; plan?: string; error?: string }
const field = 'w-full text-sm border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-blue-500 bg-white'
const btn = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-md border border-gray-200 bg-white hover:border-gray-400 disabled:opacity-40'
const primary = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40'

/** One line per person: "Name, Company", or just a LinkedIn profile link. */
function parseList(t: string): ProspectRow[] {
  return t.split('\n').map(l => l.trim()).filter(Boolean).map(l => {
    if (/linkedin\.com\/in\//i.test(l)) { const u = l.match(/https?:\/\/\S+/)?.[0] || `https://${l.replace(/^.*?(www\.)?linkedin\.com/i, 'www.linkedin.com')}`; return { name: l.replace(u, '').replace(/[,;|-]+\s*$/, '').trim() || u.replace(/^.*\/in\//, '').replace(/[/?#].*$/, ''), linkedin: u } }
    const [name, ...rest] = l.split(/\s*[,;|\t]\s*/)
    return { name: name.trim(), company: rest.join(' ').trim() || undefined }
  })
}

export default function ProspectingPanel() {
  const [keys, setKeys] = useState<KeyInfo[] | null>(null)
  const [label, setLabel] = useState('')
  const [key, setKey] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [confirmDel, setConfirmDel] = useState('')
  const [text, setText] = useState('')
  const [rows, setRows] = useState<ProspectRow[]>([])

  const apply = (j: any) => { if (j.keys) setKeys(j.keys); else if (j.error) setErr(j.error) }
  const load = useCallback(async () => { try { apply(await (await fetch('/api/admin/prospecting/keys')).json()) } catch { setErr('Could not reach the server.') } }, [])
  useEffect(() => { load() }, [load])

  async function act(body: Record<string, string>) {
    setBusy(true); setErr('')
    try {
      const r = await fetch('/api/admin/prospecting/keys', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) setErr(j.error || `Failed (${r.status})`); else { apply(j); if (body.action === 'add') { setKey(''); setLabel('') } }
    } catch (e: any) { setErr(e?.message || 'Request failed') }
    setBusy(false); setConfirmDel('')
  }

  return (
    <div className="grid lg:grid-cols-[360px_1fr] gap-4">
      <div className="space-y-3">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
          <div className="text-sm font-semibold flex items-center gap-1.5 mb-2"><KeyRound className="w-4 h-4 text-gray-500" />Prospecting keys<InfoTip text="Paste your Vibe Prospecting (Explorium) API key and it connects at once. Add several: the one marked In use runs first, and if it runs out of credits the next one takes over by itself. Keys are stored encrypted and never shown again, only the last 4 characters." /></div>
          {keys === null ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : keys.length === 0 ? <div className="text-[13px] text-gray-500 mb-2">No key yet. Add one below to start finding emails.</div> : (
            <ul className="space-y-2 mb-3">
              {keys.map(k => (
                <li key={k.id} className={`rounded-lg border p-2.5 text-[13px] ${k.active ? 'border-emerald-300 bg-emerald-50/50' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{k.label} <span className="text-gray-400 font-normal">···{k.last4}</span></span>
                    {k.active && <span className="inline-flex items-center gap-1 text-xs text-emerald-700 shrink-0"><CheckCircle2 className="w-3.5 h-3.5" />In use</span>}
                  </div>
                  <div className={`text-xs mt-0.5 ${k.ok ? 'text-gray-600' : 'text-red-700'}`}>{k.ok ? `${k.remaining ?? '?'} of ${k.allocated ?? '?'} credits left${k.plan ? ` · ${k.plan}` : ''}` : k.error}</div>
                  <div className="flex gap-2 mt-2">
                    {!k.active && <button disabled={busy} onClick={() => act({ action: 'activate', id: k.id })} className={btn}>Use this one</button>}
                    {k.fixed ? <span className="text-xs text-gray-400 self-center">Set in the site settings</span> : confirmDel === k.id ? <button disabled={busy} onClick={() => act({ action: 'remove', id: k.id })} className={`${btn} text-red-700 border-red-200`}>Yes, remove</button> : <button disabled={busy} onClick={() => setConfirmDel(k.id)} className={btn}><Trash2 className="w-3.5 h-3.5" />Remove</button>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <form onSubmit={e => { e.preventDefault(); act({ action: 'add', label, key }) }} className="space-y-2 border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-500">Add or replace a key</div>
            <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Name (for example Account 2)" className={field} />
            <input value={key} onChange={e => setKey(e.target.value)} type="password" autoComplete="off" placeholder="Paste the API key" className={field} />
            <button disabled={busy || key.trim().length < 8} className={`${primary} w-full justify-center`}>{busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}Add and connect</button>
            {err && <div className="text-xs text-red-700">{err}</div>}
          </form>
        </div>
      </div>
      <div className="space-y-3">
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 space-y-2">
          <div className="text-sm font-semibold">Find emails for a list<InfoTip text="One person per line. Write Name, Company (for example Jane Smith, Infosys) or paste a LinkedIn profile link. Then press Show list, and use Find emails." /></div>
          <textarea value={text} onChange={e => setText(e.target.value)} rows={5} placeholder={'Jane Smith, Infosys\nhttps://www.linkedin.com/in/someone'} className={field} />
          <button onClick={() => setRows(parseList(text))} disabled={!text.trim()} className={primary}>Show list</button>
        </div>
        {rows.length > 0 && <ProspectTable rows={rows} fileName="prospects" />}
      </div>
    </div>
  )
}
