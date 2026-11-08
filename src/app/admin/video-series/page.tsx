'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, Power, Send, SkipForward, RotateCcw, Pencil, Check, ExternalLink, Film } from 'lucide-react'

interface Item { id: string; date: string; time: string; code: string; course: string; topic: string; title: string; text: string; comment?: string; url: string; skip: boolean; edited: boolean }
interface Run { status: 'done' | 'failed' | 'missed'; at: string; attempts: number; urn?: string; error?: string }
interface Data {
  enabled: boolean; items: Item[]; runs: Record<string, Partial<Record<'organization' | 'member', Run>>>; log: { at: string; msg: string }[]; lastTick?: string
  health: { member: { connected: boolean; days: number | null }; organization: { connected: boolean; days: number | null } }
}

const CODE_TONE: Record<string, string> = { 'CCAS-F': 'bg-orange-50 text-orange-700', 'CCDV-F': 'bg-blue-50 text-blue-700', 'CCAR-F': 'bg-teal-50 text-teal-700', 'CCAR-P': 'bg-violet-50 text-violet-700' }
const TARGET = { organization: 'Company page', member: 'Profile' } as const
const todayIST = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata' }).format(new Date())
const fmtDate = (d: string) => new Date(d + 'T00:00:00Z').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })

export default function VideoSeriesPage() {
  const [data, setData] = useState<Data | null>(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [edit, setEdit] = useState<{ id: string; text: string } | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [showPast, setShowPast] = useState(false)

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/video-series')
    if (r.ok) setData(await r.json())
    else setError('Could not load the series.')
  }, [])
  useEffect(() => { load(); const t = setInterval(load, 60_000); return () => clearInterval(t) }, [load])

  async function call(method: 'POST' | 'PATCH', body: object, key: string) {
    setBusy(key); setError('')
    const r = await fetch('/api/admin/video-series', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok || j.ok === false) setError(j.error || (j.errors || []).join(' · ') || 'Something went wrong.')
    await load()
  }

  if (!data) return <div className="p-5 text-sm text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Loading…</div>

  const today = todayIST()
  const list = data.items.filter(i => showPast || i.date >= today || !isPosted(data, i.id))
  const done = data.items.filter(i => isPosted(data, i.id)).length

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Film className="w-5 h-5 text-gray-500" />
        <h1 className="text-lg font-semibold">Claude cert video series</h1>
        <span className="text-xs text-gray-500">One narrated flow video a day at 10:00 IST · company page + profile · {done} of {data.items.length} posted</span>
        <button
          onClick={() => call('PATCH', { enabled: !data.enabled }, 'power')}
          className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${data.enabled ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {busy === 'power' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}{data.enabled ? 'On' : 'Paused'}
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2 text-xs">
        {(['organization', 'member'] as const).map(t => {
          const h = data.health[t]
          const bad = !h.connected || (h.days ?? 0) < 1
          return <span key={t} className={`px-2 py-0.5 rounded ${bad ? 'bg-red-50 text-red-700' : (h.days ?? 99) < 14 ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{TARGET[t]}: {h.connected ? `token ${h.days} days left` : 'not connected'}</span>
        })}
        {data.lastTick && <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">last check {new Date(data.lastTick).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>}
        <label className="ml-auto inline-flex items-center gap-1.5 text-gray-600"><input type="checkbox" checked={showPast} onChange={e => setShowPast(e.target.checked)} />Show posted</label>
      </div>
      {error && <div className="mt-2 text-sm text-red-700 break-words">{error}</div>}

      <div className="mt-3 rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
        {list.map(i => {
          const runs = data.runs[i.id] || {}
          const isOpen = open === i.id
          return (
            <div key={i.id} className={`p-3 ${i.skip ? 'opacity-50' : ''}`}>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className={`w-24 shrink-0 font-medium ${i.date === today ? 'text-green-700' : ''}`}>{fmtDate(i.date)}</span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${CODE_TONE[i.code] || 'bg-gray-100'}`}>{i.code}</span>
                <button onClick={() => setOpen(isOpen ? null : i.id)} className="font-medium text-left hover:underline min-w-0 truncate">{i.topic}</button>
                {i.edited && <span className="text-xs text-gray-400">edited</span>}
                <span className="ml-auto flex flex-wrap items-center gap-1.5">
                  {(['organization', 'member'] as const).map(t => {
                    const r = runs[t]
                    const tone = !r ? 'bg-gray-100 text-gray-500' : r.status === 'done' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    const label = !r ? 'scheduled' : r.status === 'done' ? 'posted' : r.status
                    return r?.urn
                      ? <a key={t} href={`https://www.linkedin.com/feed/update/${r.urn}`} target="_blank" rel="noreferrer" className={`px-1.5 py-0.5 rounded text-xs inline-flex items-center gap-1 ${tone}`}>{TARGET[t]} {label}<ExternalLink className="w-3 h-3" /></a>
                      : <span key={t} title={r?.error} className={`px-1.5 py-0.5 rounded text-xs ${tone}`}>{TARGET[t]} {label}</span>
                  })}
                  {!isPosted(data, i.id) && <>
                    <button title="Post now" onClick={() => call('POST', { id: i.id, action: 'post-now' }, 'now' + i.id)} className="p-1 rounded hover:bg-gray-100">{busy === 'now' + i.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button>
                    <button title={i.skip ? 'Put back' : 'Skip'} onClick={() => call('POST', { id: i.id, action: i.skip ? 'unskip' : 'skip' }, 'skip' + i.id)} className="p-1 rounded hover:bg-gray-100">{i.skip ? <RotateCcw className="w-4 h-4" /> : <SkipForward className="w-4 h-4" />}</button>
                    <button title="Edit post" onClick={() => { setOpen(i.id); setEdit({ id: i.id, text: i.text }) }} className="p-1 rounded hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                  </>}
                </span>
              </div>
              {isOpen && (
                <div className="mt-2 grid gap-3 lg:grid-cols-[minmax(0,420px)_1fr]">
                  <video src={`/media/cert-flows/${i.id}.mp4`} controls muted playsInline preload="metadata" className="w-full rounded-lg border border-gray-200" />
                  {edit?.id === i.id ? (
                    <div>
                      <textarea value={edit.text} onChange={e => setEdit({ id: i.id, text: e.target.value })} rows={14} className="w-full rounded-lg border border-gray-300 p-2 text-sm font-mono" />
                      <div className="mt-1.5 flex gap-2">
                        <button onClick={async () => { await call('POST', { id: i.id, action: 'text', text: edit.text }, 'text' + i.id); setEdit(null) }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm">{busy === 'text' + i.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}Save</button>
                        <button onClick={() => setEdit(null)} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm">Cancel</button>
                      </div>
                    </div>
                  ) : <div><pre className="whitespace-pre-wrap break-words text-sm text-gray-800 font-sans max-h-80 overflow-auto">{i.text}</pre>{i.comment && <div className="mt-2 text-xs text-gray-600 break-words"><span className="font-semibold">First comment:</span> {i.comment}</div>}</div>}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {data.log.length > 0 && (
        <details className="mt-3 text-xs text-gray-600">
          <summary className="cursor-pointer">Activity</summary>
          <ul className="mt-1 space-y-0.5">{data.log.map((l, k) => <li key={k}><span className="text-gray-400">{new Date(l.at).toLocaleString('en-GB')}</span> {l.msg}</li>)}</ul>
        </details>
      )}
    </div>
  )
}

function isPosted(d: Data, id: string) { const r = d.runs[id] || {}; return r.organization?.status === 'done' && r.member?.status === 'done' }
