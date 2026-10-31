'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Power, Play, SkipForward, Hand, RotateCcw, Send, ExternalLink, Settings2, ChevronDown, FileText, BarChart3, Film, Check } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'
import { DateRangeFilter, daysAgoYMD, todayYMD, type DateRange } from '@/components/crm/shared'

type Kind = 'post' | 'poll' | 'motion'
interface SlotCfg { time: string; kind: Kind }
interface Config {
  enabled: boolean; mode: 'auto' | 'review'; tz: string; weekdaySlots: SlotCfg[]; weekendSlots: SlotCfg[]; targets: { organization: boolean; member: boolean }
  staggerMinutes: number; researchTime: string; digestTime: string; draftLeadMinutes: number; missedGraceMinutes: number
  topics: string[]; avoid: string[]; avoidKeywords: string[]; weekendTheme: string; alertEmail: string; dailyMax: number; minGapMinutes: number; maxRegens: number
}
interface Target { status: string; at: string; attempts: number; urn?: string; reason?: string }
interface Slot { id: string; date: string; at: string; kind: Kind; weekend: boolean; topic?: { title: string; angle: string; hook?: string; vendor?: string; heat?: number; sources: { title: string; url: string }[] }; draftId?: string; status: string; reason?: string; manual?: boolean; regens: number; targets: Partial<Record<'organization' | 'member', Target>> }
interface Day { date: string; slots: Slot[]; researchError?: string; researchAttempts: number }
interface Data {
  config: Config; days: Day[]; previews: Record<string, { text: string; hasImage: boolean; motion: boolean; poll?: { question: string; options: string[] } }>
  log: { at: string; msg: string }[]; lastTick?: string; lastTickNote?: string
  health: { agentService: boolean; member: { connected: boolean; days: number | null }; organization: { connected: boolean; days: number | null } }
}

const STATUS: Record<string, { label: string; tone: string }> = {
  planned: { label: 'Planned', tone: 'bg-gray-100 text-gray-700' }, drafting: { label: 'Writing', tone: 'bg-gray-100 text-gray-700' },
  ready: { label: 'Ready', tone: 'bg-gray-100 text-gray-700' }, done: { label: 'Posted', tone: 'bg-emerald-100 text-emerald-800' },
  held: { label: 'Needs you', tone: 'bg-amber-100 text-amber-800' }, skipped: { label: 'Skipped', tone: 'bg-gray-100 text-gray-500' },
}
const TARGET: Record<string, string> = { pending: 'queued', publishing: 'posting…', done: 'posted', manual: 'posted by you', skipped: 'skipped', failed: 'failed', held: 'needs you' }
const KIND = { post: { l: 'Post + image', i: FileText }, poll: { l: 'Poll', i: BarChart3 }, motion: { l: 'Motion graphic', i: Film } }
const field = 'w-full text-sm border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-blue-500 bg-white'

export default function AutopilotPage() {
  const [d, setD] = useState<Data | null>(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [cfg, setCfg] = useState<Config | null>(null)
  const [dirty, setDirty] = useState(false)
  const [open, setOpen] = useState<string>('')
  const [range, setRange] = useState<DateRange>({ days: 7, from: '', to: '' })
  const [hist, setHist] = useState('all')
  const [histPage, setHistPage] = useState(0)

  const load = useCallback(async () => {
    const from = range.days > 0 ? daysAgoYMD(range.days) : range.from, to = range.days > 0 ? todayYMD() : range.to
    const r = await fetch(`/api/admin/autopilot?${new URLSearchParams({ ...(from ? { from } : {}), ...(to ? { to } : {}) })}`)
    const j = await r.json().catch(() => ({}))
    if (!r.ok) { setError(j.error || `Could not load (${r.status})`); return }
    setD(j); setCfg(c => (c && dirty ? c : j.config))
  }, [dirty, range])
  useEffect(() => { load(); const t = setInterval(load, 30_000); return () => clearInterval(t) }, [load])

  async function patch(body: Partial<Config>, msg?: string) {
    setBusy('save'); setError('')
    const r = await fetch('/api/admin/autopilot', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok) { setError(j.error || 'Could not save.'); return false }
    setDirty(false); if (msg) setNotice(msg); await load(); return true
  }
  async function act(action: string, slotId?: string) {
    setBusy(`${action}${slotId || ''}`); setError(''); setNotice('')
    const r = await fetch('/api/admin/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, slotId }) })
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok) { setError(j.error || 'Failed.'); return }
    if (j.result) setNotice(`Checked: ${j.result.join(' · ')}`)
    await load()
  }
  async function toggle() {
    if (!d) return
    if (!d.config.enabled && !confirm(`Turn the autopilot ON?\n\nIt will research topics, write ${d.config.dailyMax} posts a day and publish them to ${[d.config.targets.organization && 'your company page', d.config.targets.member && 'your profile'].filter(Boolean).join(' and ')} at the times below, without asking you first. Anything you post yourself is skipped. You can switch it off at any time.`)) return
    await patch({ enabled: !d.config.enabled }, d.config.enabled ? 'Autopilot is off. Nothing more will be posted.' : 'Autopilot is on. The next check will plan today.')
  }
  const set = (p: Partial<Config>) => { setCfg(c => (c ? { ...c, ...p } : c)); setDirty(true) }

  if (!d || !cfg) return <div className="p-6">{error ? <div className="rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div> : <Loader2 className="w-5 h-5 animate-spin text-gray-400" />}</div>

  const on = d.config.enabled
  const time = (iso: string) => new Date(iso).toLocaleTimeString('en-IN', { timeZone: d.config.tz, hour: '2-digit', minute: '2-digit', hour12: true })
  const dayLabel = (s: string) => new Date(`${s}T00:00:00`).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' })
  const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: d.config.tz })
  const today = d.days.find(x => x.date === todayKey)
  const later = d.days.filter(x => x.date !== todayKey)
  const pill = (ok: boolean, text: string) => <span className={`inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${ok ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}><i className={`w-1.5 h-1.5 rounded-full ${ok ? 'bg-emerald-500' : 'bg-amber-500'}`} />{text}</span>
  const btn = 'inline-flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium rounded-md border border-gray-200 bg-white hover:border-gray-400 disabled:opacity-40'

  const SlotCard = ({ s }: { s: Slot }) => {
    const K = KIND[s.kind].i, p = s.draftId ? d.previews[s.draftId] : undefined, st = STATUS[s.status] || STATUS.planned
    const isOpen = open === s.id
    return (
      <div className={`rounded-xl border bg-white shadow-sm p-3 ${s.status === 'held' ? 'border-amber-300' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-sm">{time(s.at)}</span>
          <span className="inline-flex items-center gap-1 text-gray-500"><K className="w-3.5 h-3.5" />{KIND[s.kind].l}</span>
          {s.manual && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 text-xs">you are handling it</span>}
          <span className={`ml-auto px-2 py-0.5 rounded text-xs ${st.tone}`}>{st.label}</span>
        </div>
        <div className="mt-1.5 text-[13px] font-medium leading-snug">{s.topic?.title}</div>
        {s.topic?.vendor && <div className="text-xs text-gray-400 mt-0.5">{s.topic.vendor}{s.topic.heat ? ` · buzz ${s.topic.heat}/10` : ''}</div>}
        {s.reason && <div className="mt-1.5 text-xs text-amber-700 break-words">{s.reason}</div>}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(['organization', 'member'] as const).map(t => s.targets[t] && (
            <span key={t} title={s.targets[t]!.reason} className={`text-xs px-1.5 py-0.5 rounded border ${s.targets[t]!.status === 'done' || s.targets[t]!.status === 'manual' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : s.targets[t]!.status === 'held' || s.targets[t]!.status === 'failed' ? 'border-amber-200 text-amber-700 bg-amber-50' : 'border-gray-200 text-gray-600'}`}>
              {t === 'organization' ? 'Page' : 'Profile'} · {TARGET[s.targets[t]!.status]}{['pending', 'publishing'].includes(s.targets[t]!.status) ? ` ${time(s.targets[t]!.at)}` : ''}
            </span>
          ))}
        </div>
        {p && (
          <div className="mt-2">
            <button onClick={() => setOpen(isOpen ? '' : s.id)} className="text-xs text-blue-700 inline-flex items-center gap-1">{isOpen ? 'Hide' : 'Read'} the post<ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} /></button>
            {isOpen && <div className="mt-1.5 text-[13px] text-gray-700 whitespace-pre-wrap break-words max-h-52 overflow-y-auto rounded-md bg-gray-50 border border-gray-100 p-2">{p.text}{p.poll && `\n\n📊 ${p.poll.question}\n${p.poll.options.map(o => `• ${o}`).join('\n')}`}</div>}
          </div>
        )}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {s.draftId && <Link href={`/admin/social?draft=${s.draftId}`} className={btn}><ExternalLink className="w-3 h-3" />Open &amp; edit</Link>}
          {s.draftId && !['done', 'skipped'].includes(s.status) && <button disabled={!!busy} onClick={() => act('post-now', s.id)} className={btn}><Send className="w-3 h-3" />Post now</button>}
          {s.status === 'held' && <button disabled={!!busy} onClick={() => act('release', s.id)} className={btn}><Check className="w-3 h-3" />Release</button>}
          {!['done', 'skipped'].includes(s.status) && !s.manual && <button disabled={!!busy} onClick={() => act('manual', s.id)} className={btn} title="The autopilot will not touch this slot"><Hand className="w-3 h-3" />I'll handle it</button>}
          {s.manual && <button disabled={!!busy} onClick={() => act('resume', s.id)} className={btn}><RotateCcw className="w-3 h-3" />Hand back</button>}
          {!['done', 'skipped'].includes(s.status) && <button disabled={!!busy} onClick={() => act('skip', s.id)} className={btn}><SkipForward className="w-3 h-3" />Skip</button>}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold tracking-tight">LinkedIn autopilot<InfoTip text="Researches what the industry is talking about, writes four posts a day across Microsoft, Google, AWS and the wider AI world, and publishes them at audience-friendly times. Anything you post yourself first is skipped automatically." /></h1>
      </div>
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}

      <div className={`rounded-xl border p-4 mb-4 shadow-sm ${on ? 'border-emerald-200 bg-emerald-50/50' : 'border-gray-200 bg-white'}`}>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={toggle} disabled={!!busy} className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold ${on ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-800 text-white hover:bg-gray-900'}`}><Power className="w-4 h-4" />{on ? 'Autopilot is ON' : 'Turn autopilot on'}</button>
          <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs bg-white">
            {([['auto', 'Auto-publish'], ['review', 'Review only']] as const).map(([k, l]) => <button key={k} onClick={() => patch({ mode: k }, k === 'review' ? 'Review-only: drafts are prepared but never published.' : 'Auto-publish on.')} className={`px-3 py-2 ${d.config.mode === k ? 'bg-gray-800 text-white' : 'hover:bg-gray-50'}`}>{l}</button>)}
          </div>
          <InfoTip text="Auto-publish posts by itself at each slot. Review only writes the posts and waits, so nothing goes out unless you post it." />
          <div className="ml-auto flex flex-wrap gap-1.5">
            {pill(d.health.agentService, d.health.agentService ? 'AI team connected' : 'AI team not configured')}
            {d.config.targets.organization && pill(d.health.organization.connected && (d.health.organization.days ?? 0) > 0, d.health.organization.connected ? `Page token ${d.health.organization.days}d` : 'Page not connected')}
            {d.config.targets.member && pill(d.health.member.connected && (d.health.member.days ?? 0) > 0, d.health.member.connected ? `Profile token ${d.health.member.days}d` : 'Profile not connected')}
          </div>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <span>{on ? `${d.config.dailyMax} posts a day, every day · ${d.config.tz}` : 'Nothing is posted while this is off.'}</span>
          <span>Last check: {d.lastTick ? `${time(d.lastTick)} (${d.lastTickNote || 'idle'})` : 'never'}</span>
          <button disabled={!!busy || !on} onClick={() => act('tick')} className={`${btn} ml-auto`}>{busy === 'tick' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}Check now</button>
        </div>
      </div>

      <h2 className="text-sm font-semibold mb-2">Today · {dayLabel(todayKey)}</h2>
      {today?.researchError && <div className="mb-2 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-xs px-3 py-2">Planning problem (attempt {today.researchAttempts} of 4): {today.researchError}</div>}
      {!today || !today.slots.length ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 text-sm text-gray-500 p-8 text-center mb-4">{on ? `Today's plan is made after ${d.config.researchTime} (${d.config.tz}). The next check will pick it up.` : 'Turn the autopilot on and today\'s four posts will appear here.'}</div>
      ) : <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">{today.slots.map(s => <SlotCard key={s.id} s={s} />)}</div>}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm mb-4">
        <div className="px-3 py-2.5 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-gray-100">
          <h2 className="text-sm font-semibold">History</h2>
          <DateRangeFilter value={range} onChange={r => { setRange(r); setHistPage(0) }} presets={[{ days: 7, label: 'Week' }, { days: 30, label: 'Month' }, { days: 90, label: '3 months' }]} />
          <div className="flex flex-wrap gap-1 ml-auto">
            {([['all', 'All'], ['done', 'Posted'], ['held', 'Needs you'], ['skipped', 'Skipped']] as const).map(([k, l]) => {
              const n = later.reduce((a, day) => a + day.slots.filter(sl => k === 'all' || sl.status === k).length, 0)
              return <button key={k} onClick={() => { setHist(k); setHistPage(0) }} className={`text-xs px-2 py-1 rounded-md border ${hist === k ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{l} <span className={hist === k ? 'text-gray-300' : 'text-gray-400'}>{n}</span></button>
            })}
          </div>
        </div>
        {(() => {
          const dayList = later.map(day => ({ ...day, slots: day.slots.filter(sl => hist === 'all' || sl.status === hist) })).filter(day => day.slots.length)
          const PER = 4, pages = Math.max(1, Math.ceil(dayList.length / PER)), pg = Math.min(histPage, pages - 1)
          if (!dayList.length) return <div className="p-6 text-sm text-gray-500 text-center">Nothing in this period{hist !== 'all' ? ' with that status' : ''}.</div>
          return (
            <div className="p-3 space-y-4">
              {dayList.slice(pg * PER, pg * PER + PER).map(day => <div key={day.date}><div className="text-xs text-gray-500 mb-1.5">{dayLabel(day.date)} · {day.slots.length} post{day.slots.length === 1 ? '' : 's'}</div><div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3">{day.slots.map(s => <SlotCard key={s.id} s={s} />)}</div></div>)}
              {dayList.length > PER && (
                <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
                  <span>Days {pg * PER + 1}–{Math.min(dayList.length, pg * PER + PER)} of {dayList.length}</span>
                  <div className="flex items-center gap-1"><button disabled={pg === 0} onClick={() => setHistPage(pg - 1)} className={btn}>Newer</button><span className="px-1">{pg + 1}/{pages}</span><button disabled={pg >= pages - 1} onClick={() => setHistPage(pg + 1)} className={btn}>Older</button></div>
                </div>
              )}
            </div>
          )
        })()}
      </div>

      <details className="rounded-xl border border-gray-200 bg-white shadow-sm mb-4 group" open={dirty}>
        <summary className="px-4 py-3 text-sm font-semibold cursor-pointer list-none flex items-center gap-2"><Settings2 className="w-4 h-4 text-gray-500" />Settings<span className="text-xs font-normal text-gray-400">times, topics, rules</span><ChevronDown className="w-4 h-4 ml-auto text-gray-400 group-open:rotate-180 transition-transform" /></summary>
        <div className="px-4 pb-4 grid lg:grid-cols-2 gap-5 border-t border-gray-100 pt-4">
          {(['weekdaySlots', 'weekendSlots'] as const).map(k => (
            <div key={k}>
              <div className="text-xs font-semibold mb-1.5">{k === 'weekdaySlots' ? 'Weekday times (Mon to Fri)' : 'Weekend times (Sat and Sun)'}<InfoTip text="When each post goes out, in the time zone below. Four times that catch India's morning and lunch, the Gulf and Europe in the afternoon, and the US East Coast morning." /></div>
              <div className="space-y-1.5">{cfg[k].map((s, i) => (
                <div key={i} className="flex gap-2"><input type="time" value={s.time} onChange={e => set({ [k]: cfg[k].map((x, j) => (j === i ? { ...x, time: e.target.value } : x)) })} className={`${field} w-32`} />
                  <select value={s.kind} onChange={e => set({ [k]: cfg[k].map((x, j) => (j === i ? { ...x, kind: e.target.value as Kind } : x)) })} className={field}><option value="post">Post + image</option><option value="poll">Poll</option><option value="motion">Motion graphic</option></select></div>
              ))}</div>
            </div>
          ))}
          <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
            <label>Time zone<input value={cfg.tz} onChange={e => set({ tz: e.target.value })} className={field} /></label>
            <label>Alert email<input value={cfg.alertEmail} onChange={e => set({ alertEmail: e.target.value })} className={field} /></label>
            <label>Research at<input type="time" value={cfg.researchTime} onChange={e => set({ researchTime: e.target.value })} className={field} /></label>
            <label>Morning summary email at<input type="time" value={cfg.digestTime} onChange={e => set({ digestTime: e.target.value })} className={field} /></label>
            <label>Profile post follows page by (min)<input type="number" value={cfg.staggerMinutes} onChange={e => set({ staggerMinutes: Number(e.target.value) })} className={field} /></label>
            <label>Skip a post if later than (min)<input type="number" value={cfg.missedGraceMinutes} onChange={e => set({ missedGraceMinutes: Number(e.target.value) })} className={field} /></label>
            <label className="flex items-center gap-2 col-span-1 text-xs text-gray-700"><input type="checkbox" checked={cfg.targets.organization} onChange={e => set({ targets: { ...cfg.targets, organization: e.target.checked } })} />Post to the company page</label>
            <label className="flex items-center gap-2 col-span-1 text-xs text-gray-700"><input type="checkbox" checked={cfg.targets.member} onChange={e => set({ targets: { ...cfg.targets, member: e.target.checked } })} />Post to my profile</label>
          </div>
          <div className="space-y-3">
            <label className="block text-xs text-gray-500">Topic areas (one per line)<textarea rows={7} value={cfg.topics.join('\n')} onChange={e => set({ topics: e.target.value.split('\n') })} className={field} /></label>
            <label className="block text-xs text-gray-500">Weekend flavour<textarea rows={3} value={cfg.weekendTheme} onChange={e => set({ weekendTheme: e.target.value })} className={field} /></label>
          </div>
          <div className="space-y-3">
            <label className="block text-xs text-gray-500">Never post about (one per line)<textarea rows={5} value={cfg.avoid.join('\n')} onChange={e => set({ avoid: e.target.value.split('\n') })} className={field} /></label>
            <label className="block text-xs text-gray-500">Hard stop words: a draft containing any is held for you<InfoTip text="Plain words or word stems, for example 'election' or 'layoff'. Checked on every draft whatever the AI reviewer said." /><textarea rows={3} value={cfg.avoidKeywords.join(', ')} onChange={e => set({ avoidKeywords: e.target.value.split(',') })} className={field} /></label>
          </div>
          <div className="lg:col-span-2 flex items-center gap-2">
            <button disabled={!dirty || busy === 'save'} onClick={() => patch({ ...cfg, topics: cfg.topics.map(x => x.trim()).filter(Boolean), avoid: cfg.avoid.map(x => x.trim()).filter(Boolean), avoidKeywords: cfg.avoidKeywords.map(x => x.trim()).filter(Boolean) }, 'Settings saved. They apply to the next plan.')} className="px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40">{busy === 'save' ? 'Saving…' : 'Save settings'}</button>
            {dirty && <button onClick={() => { setCfg(d.config); setDirty(false) }} className={btn}>Discard</button>}
            <span className="text-xs text-gray-400">Changes apply to plans made after saving; today's slots keep their times.</span>
          </div>
        </div>
      </details>

      <details className="rounded-xl border border-gray-200 bg-white shadow-sm group">
        <summary className="px-4 py-3 text-sm font-semibold cursor-pointer list-none flex items-center gap-2">Activity log<ChevronDown className="w-4 h-4 ml-auto text-gray-400 group-open:rotate-180 transition-transform" /></summary>
        <ul className="px-4 pb-3 text-[13px] text-gray-600 space-y-1 max-h-64 overflow-y-auto border-t border-gray-100 pt-2">
          {d.log.length === 0 && <li className="text-gray-400">Nothing yet.</li>}
          {d.log.map((l, i) => <li key={i}><span className="text-gray-400">{new Date(l.at).toLocaleString('en-IN', { timeZone: d.config.tz, day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span> · {l.msg}</li>)}
        </ul>
      </details>
    </div>
  )
}
