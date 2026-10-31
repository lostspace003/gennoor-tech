'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Loader2, Sparkles, PenLine, Linkedin, ArrowUpRight } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'
import { ListToolbar, useListView } from '@/components/admin/ListControls'

interface Ev { at: string; area: 'social' | 'blog' | 'linkedin'; title: string; detail: string; href?: string }
const AREAS = { social: { label: 'Social studio', icon: Sparkles, tone: 'bg-gray-100 text-gray-700' }, blog: { label: 'Blog studio', icon: PenLine, tone: 'bg-gray-100 text-gray-700' }, linkedin: { label: 'LinkedIn hub', icon: Linkedin, tone: 'bg-gray-100 text-gray-700' } } as const
const GAP_MS = 45 * 60 * 1000

interface Session { start: number; end: number; events: Ev[] }

export default function SessionsPage() {
  const [events, setEvents] = useState<Ev[] | null>(null)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | Ev['area']>('all')

  useEffect(() => {
    fetch('/api/admin/sessions').then(async r => { const j = await r.json().catch(() => ({})); if (!r.ok) setError(j.error || `Failed (${r.status})`); else setEvents(j.events || []) }).catch(() => setError('Could not load. Check your connection and refresh.'))
  }, [])

  const byArea = useMemo(() => (events || []).filter(e => filter === 'all' || e.area === filter), [events, filter])
  const v = useListView(byArea, { date: e => e.at, text: e => `${e.title} ${e.detail}`, pageSize: 1000 })
  // A session is a run of activity with no gap longer than 45 minutes; sessions are grouped by day.
  const allDays = useMemo(() => {
    const list = v.filtered
    const sessions: Session[] = []
    for (const e of list) {
      const t = Date.parse(e.at)
      const last = sessions[sessions.length - 1]
      if (last && last.start - t <= GAP_MS) { last.events.push(e); last.start = t } else sessions.push({ start: t, end: t, events: [e] })
    }
    const byDay = new Map<string, Session[]>()
    for (const s of sessions) { const k = new Date(s.end).toDateString(); byDay.set(k, [...(byDay.get(k) || []), s]) }
    return [...byDay.entries()]
  }, [v.filtered])
  const DAYS = 5
  const [dp, setDp] = useState(0)
  useEffect(() => { setDp(0) }, [filter, v.q, v.range])
  const dpages = Math.max(1, Math.ceil(allDays.length / DAYS)), dat = Math.min(dp, dpages - 1)
  const days = allDays.slice(dat * DAYS, dat * DAYS + DAYS)

  const time = (t: number) => new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="max-w-4xl p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h1 className="text-xl font-semibold tracking-tight">Sessions<InfoTip text="Everything you did in the Social studio, Blog studio and LinkedIn hub, grouped into work sessions (activity with no gap longer than 45 minutes). Click an item to pick up where you left off." /></h1>
        <div className="flex gap-1.5 text-xs">
          {(['all', 'social', 'blog', 'linkedin'] as const).map(k => <button key={k} onClick={() => setFilter(k)} className={`px-2.5 py-1 rounded-full border ${filter === k ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 bg-white hover:border-gray-400'}`}>{k === 'all' ? 'Everything' : AREAS[k].label}</button>)}
        </div>
      </div>
      <ListToolbar v={v} noun="event" />
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {!events && !error && <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}
      {events && allDays.length === 0 && <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 text-sm text-gray-500 p-10 text-center">Nothing here yet. Work in the studios and it will show up.</div>}
      <div className="space-y-6">
        {days.map(([day, sessions]) => (
          <section key={day}>
            <div className="text-xs font-semibold text-gray-500 mb-2">{new Date(day).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</div>
            <div className="space-y-3">
              {sessions.map(s => {
                const areas = [...new Set(s.events.map(e => e.area))]
                return (
                  <div key={s.end} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2 text-xs">
                      <span className="font-medium">{time(s.start)}{s.start !== s.end && ` – ${time(s.end)}`}</span>
                      <span className="text-gray-400">{s.events.length} item{s.events.length === 1 ? '' : 's'}</span>
                      <span className="ml-auto flex gap-1">{areas.map(a => <span key={a} className={`px-1.5 py-0.5 rounded text-xs ${AREAS[a].tone}`}>{AREAS[a].label}</span>)}</span>
                    </div>
                    <ul className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                      {s.events.map((e, i) => {
                        const A = AREAS[e.area].icon
                        const row = (
                          <div className="flex items-start gap-2.5 px-3 py-2 hover:bg-gray-50">
                            <span className={`mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center ${AREAS[e.area].tone}`}><A className="w-3.5 h-3.5" /></span>
                            <div className="min-w-0 flex-1"><div className="text-[13px] break-words">{e.title}</div><div className="text-xs text-gray-500 break-words">{time(Date.parse(e.at))} · {e.detail}</div></div>
                            {e.href && <ArrowUpRight className="w-3.5 h-3.5 text-gray-300 mt-1 shrink-0" />}
                          </div>
                        )
                        return <li key={i}>{e.href ? <Link href={e.href}>{row}</Link> : row}</li>
                      })}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
      {allDays.length > DAYS && (
        <div className="flex items-center justify-between pt-4 text-xs text-gray-500">
          <span>Days {dat * DAYS + 1}–{Math.min(allDays.length, dat * DAYS + DAYS)} of {allDays.length}</span>
          <div className="flex items-center gap-1"><button disabled={dat === 0} onClick={() => setDp(dat - 1)} className="px-2.5 py-1 rounded border border-gray-200 bg-white disabled:opacity-30">Newer</button><span className="px-1.5">{dat + 1}/{dpages}</span><button disabled={dat >= dpages - 1} onClick={() => setDp(dat + 1)} className="px-2.5 py-1 rounded border border-gray-200 bg-white disabled:opacity-30">Older</button></div>
        </div>
      )}
    </div>
  )
}
