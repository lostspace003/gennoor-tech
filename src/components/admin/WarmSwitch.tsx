'use client'

import { useCallback, useEffect, useState } from 'react'
import { Loader2, Power, X } from 'lucide-react'

interface Warm { state: { on: boolean; until?: string; startAt?: string }; awake: boolean; live: Record<string, number> | null; hours: number[]; detail: string }
const when = (iso?: string) => (iso ? new Date(iso).toLocaleString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' }) : '')

/**
 * Keeps the LinkedIn connector awake while you work (about 2 to 3 minutes to wake) and lets it sleep again afterwards,
 * automatically after the hours you pick. It only costs money while it is on.
 */
export default function WarmSwitch({ onChange }: { onChange?: () => void }) {
  const [w, setW] = useState<Warm | null>(null)
  const [open, setOpen] = useState(false)
  const [hours, setHours] = useState(4)
  const [at, setAt] = useState('') // datetime-local; empty = start now
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/linkedin-hub/warm').catch(() => null)
    if (r?.ok) setW(await r.json())
  }, [])
  useEffect(() => { load() }, [load])
  useEffect(() => { if (!open) return; const t = setInterval(load, 15_000); return () => clearInterval(t) }, [open, load])

  async function act(body: Record<string, unknown>) {
    setBusy(true); setErr('')
    const r = await fetch('/api/admin/linkedin-hub/warm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const j = await r.json().catch(() => ({}))
    setBusy(false)
    if (!r.ok) { setErr(j.error || 'Could not change it.'); return }
    setAt(''); await load(); onChange?.()
  }

  const on = !!w?.state.on, scheduled = !on && !!w?.state.startAt
  const label = on ? `Awake until ${when(w!.state.until)}` : scheduled ? `Starts ${when(w!.state.startAt)}` : 'Allowed to sleep'
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} aria-expanded={open} title="Keep the LinkedIn connector awake while you work" className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs ${on ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'}`}>
        <Power className="w-3 h-3" />{w ? label : 'Warm-up'}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-72 z-20 rounded-xl border border-gray-200 bg-white shadow-lg p-3 text-[13px] space-y-2.5">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <div className="font-semibold">Keep it awake while I work</div>
              <div className="text-xs text-gray-500 mt-0.5">The connector sleeps when idle, so the first lookup is slow. Awake it takes about 2 to 3 minutes to be ready, then it stays fast. Costs about ₹3 to ₹4 an hour, only while it is on.</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="text-gray-400 hover:text-gray-700"><X className="w-4 h-4" /></button>
          </div>
          {!w ? <Loader2 className="w-4 h-4 animate-spin text-gray-400" /> : (
            <>
              <div className={`text-xs rounded-md px-2 py-1.5 ${w.awake ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-50 text-gray-600'}`}>
                {w.detail ? `Could not read Azure: ${w.detail}` : w.awake ? 'Both services are set to stay awake.' : 'Both services are allowed to sleep when idle.'}
                {on && <> It goes back to sleep automatically at {when(w.state.until)}.</>}
                {scheduled && <> Scheduled to wake at {when(w.state.startAt)} and sleep at {when(w.state.until)}.</>}
              </div>
              {(on || scheduled || w.awake) ? (
                <button disabled={busy} onClick={() => act({ action: 'stop' })} className="w-full px-3 py-2 text-[13px] font-medium rounded-md border border-gray-300 bg-white hover:border-gray-500 disabled:opacity-50">{busy ? 'Working…' : scheduled ? 'Cancel the schedule' : 'Let it sleep now'}</button>
              ) : (
                <>
                  <div className="flex gap-1.5">
                    {w.hours.map(h => <button key={h} onClick={() => setHours(h)} className={`flex-1 px-2 py-1.5 text-xs rounded-md border ${hours === h ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 hover:border-gray-400'}`}>{h} hours</button>)}
                  </div>
                  <label className="block text-xs text-gray-600">Start at <span className="text-gray-400">(optional, empty = start now)</span>
                    <input type="datetime-local" value={at} min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} onChange={e => setAt(e.target.value)} className="mt-1 w-full text-sm border border-gray-200 rounded-md px-2.5 py-1.5" />
                  </label>
                  <button disabled={busy} onClick={() => act({ action: 'start', hours, startAt: at ? new Date(at).toISOString() : undefined })} className="w-full px-3 py-2 text-[13px] font-medium rounded-md bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50">{busy ? 'Working…' : at ? `Schedule ${hours} hours` : `Wake it for ${hours} hours`}</button>
                </>
              )}
            </>
          )}
          {err && <div className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-md px-2 py-1.5 break-words">{err}</div>}
        </div>
      )}
    </div>
  )
}
