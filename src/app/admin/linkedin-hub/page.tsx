'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Copy, Check, Mail, Loader2, RefreshCw, Newspaper, Users, MessageSquare, Building2, Briefcase, UserCircle, Activity, LayoutGrid, ExternalLink, ShieldCheck, ChevronLeft, ChevronDown, Search } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'
import ProspectTable from '@/components/admin/ProspectTable'
import ProspectingPanel from '@/components/admin/ProspectingPanel'
import SplitPane from '@/components/admin/SplitPane'
import WarmSwitch from '@/components/admin/WarmSwitch'
import { DateRangeFilter, rangeBounds, rangeLabel, type DateRange } from '@/components/crm/shared'
import { GROUPS, TOOLS, FIELD_TIPS, STARTERS, type Field, type GroupKey, type ToolDef } from '@/lib/linkedin-catalog'
import { markdownToHtml, normalizeArg, resultCards, resultToMarkdown, type Card } from '@/lib/linkedin-hub-format'

type Tab = 'overview' | GroupKey | 'prospecting' | 'activity'
interface Status {
  service: 'up' | 'down' | 'not-configured' | 'checking'; detail?: string; session: any; ok?: boolean; sessionUnknown?: boolean; available?: string[]
  usage: { reads: number; readCap: number }; caps: { tool: string; label: string; cap: number; used: number }[]
  activity: { id: string; at: string; tool: string; label: string; kind: string; area: string; summary: string; ok: boolean; cached: boolean; ms: number; error?: string }[]
}
interface Result { tool: string; args: Record<string, any>; data: any; ok: boolean; cached?: boolean; at: number; ms?: number }

const ICONS: Record<Tab, any> = { overview: LayoutGrid, feed: Newspaper, people: Users, inbox: MessageSquare, companies: Building2, jobs: Briefcase, me: UserCircle, prospecting: Mail, activity: Activity }
const field = 'w-full text-sm border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-blue-500 bg-white'
const btn = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-md border border-gray-200 bg-white hover:border-gray-400 disabled:opacity-40'
const primary = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40'
const pretty = (k: string) => k.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())

/** Maps a LinkedIn link found in a result to the follow-up lookups or actions the hub can run for it. */
function linkActions(url: string): { label: string; tool: string; args: Record<string, any> }[] {
  const person = url.match(/\/in\/([^/?#]+)/)?.[1]
  if (person) return [{ label: 'Profile', tool: 'get_person_profile', args: { linkedin_username: decodeURIComponent(person) } }, { label: 'Message', tool: 'send_message', args: { linkedin_username: decodeURIComponent(person) } }, { label: 'Connect', tool: 'connect_with_person', args: { linkedin_username: decodeURIComponent(person) } }]
  const thread = url.match(/\/messaging\/thread\/([^/?#]+)/)?.[1]
  if (thread) return [{ label: 'Open', tool: 'get_conversation', args: { thread_id: thread } }, { label: 'Archive', tool: 'archive_conversation', args: { thread_id: thread } }]
  const job = url.match(/\/jobs\/view\/(\d+)/)?.[1] || url.match(/currentJobId=(\d+)/)?.[1]
  if (job) return [{ label: 'Details', tool: 'get_job_details', args: { job_id: job } }, { label: 'How to apply', tool: 'get_job_apply_url', args: { job_id: job } }]
  const company = url.match(/\/company\/([^/?#]+)/)?.[1]
  if (company) return [{ label: 'Company', tool: 'get_company_profile', args: { company_name: decodeURIComponent(company) } }, { label: 'People', tool: 'get_company_employees', args: { company_name: decodeURIComponent(company) } }]
  return []
}
const absolute = (u: string) => (u.startsWith('http') ? u : `https://www.linkedin.com${u.startsWith('/') ? '' : '/'}${u}`)

function collectRefs(v: any, out: { url: string; text?: string; kind?: string; context?: string }[] = []) {
  if (!v) return out
  if (Array.isArray(v)) v.forEach(x => (x && typeof x === 'object' && typeof x.url === 'string' ? out.push(x) : collectRefs(x, out)))
  else if (typeof v === 'object') Object.values(v).forEach(x => collectRefs(x, out))
  return out
}

function Fmt({ md }: { md: string }) {
  // Renders the same clean text that is copied and emailed, so what you see is what you get.
  const out: React.ReactNode[] = []
  let list: React.ReactNode[] = []
  const flush = () => { if (list.length) { out.push(<ul key={`u${out.length}`} className="list-disc pl-5 space-y-1 mb-3">{list}</ul>); list = [] } }
  const linkify = (t: string) => t.split(/(https?:\/\/[^\s]+)/g).map((p, i) => /^https?:/.test(p) ? <a key={i} href={p} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline break-all">{p}</a> : p)
  md.split('\n').forEach((raw, i) => {
    const l = raw.trimEnd()
    if (!l.trim()) { flush(); return }
    if (l.startsWith('# ')) { flush(); out.push(<h2 key={i} className="text-base font-semibold mb-1">{l.slice(2)}</h2>) }
    else if (l.startsWith('## ')) { flush(); out.push(<h3 key={i} className="text-[13px] font-semibold mt-4 mb-1.5 pb-1 border-b border-gray-200">{l.slice(3)}</h3>) }
    else if (/^#{3,4} /.test(l)) { flush(); out.push(<h4 key={i} className="text-xs font-semibold mt-3 mb-1 text-gray-600">{l.replace(/^#+ /, '')}</h4>) }
    else if (l.startsWith('- ')) list.push(<li key={i} className="break-words">{linkify(l.slice(2))}</li>)
    else if (l.startsWith('  ') && list.length) list.push(<span key={i} className="block text-xs text-gray-500 break-all list-none">{linkify(l.trim())}</span>)
    else { flush(); out.push(<p key={i} className={`mb-1.5 break-words ${/^_.+_$/.test(l) ? 'text-xs text-gray-500' : ''}`}>{linkify(l.replace(/^_(.+)_$/, '$1'))}</p>) }
  })
  flush()
  return <div className="text-[13px] leading-6 text-gray-800">{out}</div>
}

/** Search results as clean cards (or the people table), with a search box and a dropdown per facet on top. */
function CardsView({ cards }: { cards: Card[] }) {
  const [q, setQ] = useState('')
  const [pick, setPick] = useState<Record<string, string>>({})
  const [open, setOpen] = useState<Record<number, boolean>>({})
  useEffect(() => { setQ(''); setPick({}); setOpen({}) }, [cards])
  const facets = useMemo(() => {
    const keys = Array.from(new Set(cards.flatMap(c => Object.keys(c.facets))))
    return keys.map(k => {
      const n = new Map<string, number>()
      cards.forEach(c => { const v = c.facets[k]; if (v) n.set(v, (n.get(v) || 0) + 1) })
      return { k, opts: Array.from(n).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])) }
    }).filter(f => f.opts.length > 1 && f.opts.length < cards.length)
  }, [cards])
  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean)
    return cards.filter(c => {
      if (Object.entries(pick).some(([k, v]) => v && c.facets[k] !== v)) return false
      const hay = [c.title, c.sub, c.body, ...c.meta, ...(c.tags || [])].join(' ').toLowerCase()
      return words.every(w => hay.includes(w))
    })
  }, [cards, q, pick])
  const people = cards.some(c => c.person)
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
        <div className="relative flex-1 min-w-[180px]"><Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search within these results" className={`${field} pl-8`} /></div>
        {facets.map(f => (
          <select key={f.k} value={pick[f.k] || ''} onChange={e => setPick(p => ({ ...p, [f.k]: e.target.value }))} className={`${field} w-auto max-w-[200px]`}>
            <option value="">{f.k}: all</option>
            {f.opts.map(([v, n]) => <option key={v} value={v}>{v.length > 40 ? v.slice(0, 40) + '…' : v} ({n})</option>)}
          </select>
        ))}
        <span className="text-xs text-gray-500 ml-auto">{shown.length} of {cards.length}</span>
        {(q || Object.values(pick).some(Boolean)) && <button onClick={() => { setQ(''); setPick({}) }} className="text-xs text-gray-500 hover:text-gray-800">Clear</button>}
      </div>
      {people ? <ProspectTable rows={shown.map(c => ({ ...c.person!, linkedin: c.url }))} fileName="linkedin-people" /> : (
        <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
          {shown.map((c, i) => {
            const long = (c.body || '').length > 280
            return (
              <li key={i} className="rounded-lg border border-gray-200 bg-white p-3">
                <div className="flex items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="text-[14px] font-semibold text-gray-900 break-words">{c.url ? <a href={c.url} target="_blank" rel="noreferrer" className="hover:underline">{c.title}</a> : c.title}{c.badge && <span className="ml-1.5 text-xs font-normal text-gray-500">· {c.badge}</span>}</div>
                    {c.sub && <div className="text-xs text-gray-600 break-words line-clamp-2">{c.sub}</div>}
                    {c.meta.length > 0 && <div className="text-xs text-gray-500 mt-0.5">{c.meta.join(' · ')}</div>}
                  </div>
                  {c.url && <a href={c.url} target="_blank" rel="noreferrer" title="Open on LinkedIn" className="text-gray-400 hover:text-gray-600 shrink-0"><ExternalLink className="w-3.5 h-3.5" /></a>}
                </div>
                {c.body && <div className={`mt-2 text-[13px] leading-6 text-gray-800 whitespace-pre-line break-words ${long && !open[i] ? 'line-clamp-4' : ''}`}>{c.body}</div>}
                {long && <button onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))} className="text-xs text-blue-700 hover:underline mt-1">{open[i] ? 'Show less' : 'Show more'}</button>}
                {c.tags && c.tags.length > 0 && <div className="mt-2 flex flex-wrap gap-1">{c.tags.slice(0, 8).map(t => <button key={t} onClick={() => setQ(t)} className="text-[11px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 hover:bg-gray-200">{t}</button>)}</div>}
              </li>
            )
          })}
          {shown.length === 0 && <li className="p-6 text-sm text-gray-500 text-center">Nothing matches. Clear the filters to see all {cards.length}.</li>}
        </ul>
      )}
    </div>
  )
}

function ResultView({ r, label, onRun, busy }: { r: Result; label: string; onRun: (tool: string, args: Record<string, any>) => void; busy: boolean }) {
  const d = r.data
  const refs = useMemo(() => collectRefs(d?.references ?? (Array.isArray(d) ? d : undefined)), [d])
  const md = useMemo(() => resultToMarkdown(label, r.args, d), [label, r, d])
  const cards = useMemo(() => resultCards(d), [d])
  const [copied, setCopied] = useState(false)
  const [mailOpen, setMailOpen] = useState(false)
  const [to, setTo] = useState('')
  const [mail, setMail] = useState<{ state: 'idle' | 'sending' | 'sent' | 'error'; msg?: string }>({ state: 'idle' })
  useEffect(() => { try { setTo(localStorage.getItem('hub-email-to') || '') } catch { /* ignore */ } }, [])
  useEffect(() => { setMail({ state: 'idle' }); setCopied(false) }, [r])

  const flash = () => { setCopied(true); setTimeout(() => setCopied(false), 2000) }
  async function copy() {
    try {
      // Rich copy so pasting into Outlook, Gmail or Word keeps headings and bullets; plain text everywhere else.
      if (navigator.clipboard && 'ClipboardItem' in window) await navigator.clipboard.write([new ClipboardItem({ 'text/plain': new Blob([md], { type: 'text/plain' }), 'text/html': new Blob([markdownToHtml(md)], { type: 'text/html' }) })])
      else await navigator.clipboard.writeText(md)
      flash()
    } catch { try { await navigator.clipboard.writeText(md); flash() } catch { /* clipboard blocked */ } }
  }
  async function send(e: React.FormEvent) {
    e.preventDefault()
    setMail({ state: 'sending' })
    try {
      const res = await fetch('/api/admin/linkedin-hub/email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ to, subject: `LinkedIn: ${label}`, text: md }) })
      const j = await res.json().catch(() => ({}))
      if (!res.ok) { setMail({ state: 'error', msg: j.error || `Failed (${res.status})` }); return }
      try { localStorage.setItem('hub-email-to', to) } catch { /* ignore */ }
      setMail({ state: 'sent', msg: `Sent to ${to}` })
    } catch (err: any) { setMail({ state: 'error', msg: err?.message || 'Could not send' }) }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={copy} className={btn}>{copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}{copied ? 'Copied' : 'Copy'}</button>
        <button onClick={() => setMailOpen(o => !o)} className={btn}><Mail className="w-3.5 h-3.5" />Email this</button>
        <InfoTip text="Copy puts the neat version on your clipboard (headings and bullets stay when you paste into an email or document). Email this sends the same neat version to any address you type." />
      </div>
      {mailOpen && (
        <form onSubmit={send} className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2.5">
          <input type="email" required value={to} onChange={e => setTo(e.target.value)} placeholder="Email address to send to" className={`${field} max-w-xs`} />
          <button disabled={mail.state === 'sending'} className={primary}>{mail.state === 'sending' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Sending…</> : 'Send'}</button>
          {mail.msg && <span className={`text-xs ${mail.state === 'error' ? 'text-red-700' : 'text-emerald-700'}`}>{mail.msg}</span>}
        </form>
      )}
      {cards ? <CardsView cards={cards} /> : <div className="rounded-lg border border-gray-200 bg-white p-4 max-h-[70vh] overflow-y-auto"><Fmt md={md} /></div>}
      {refs.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white">
          <div className="px-3 py-1.5 text-xs font-semibold border-b border-gray-100 bg-gray-50 rounded-t-lg">Do more with these ({Math.min(refs.length, 120)})<InfoTip text="Shortcuts for each link found: read a profile, open a conversation, see job details and so on. Each press runs one more lookup." /></div>
          <ul className="divide-y divide-gray-100 max-h-[28rem] overflow-y-auto">
            {refs.slice(0, 120).map((x, i) => {
              const acts = linkActions(x.url)
              return (
                <li key={i} className="px-3 py-2 flex flex-wrap items-center gap-2">
                  <div className="min-w-0 flex-1"><div className="text-[13px] break-words">{x.text || x.url}</div>{x.context && <div className="text-xs text-gray-500 break-words line-clamp-2">{x.context}</div>}</div>
                  {acts.map(a => <button key={a.label} disabled={busy} onClick={() => onRun(a.tool, a.args)} className={btn}>{a.label}</button>)}
                  <a href={absolute(x.url)} target="_blank" rel="noreferrer" title="Open on LinkedIn" className="text-gray-400 hover:text-gray-500"><ExternalLink className="w-3.5 h-3.5" /></a>
                </li>
              )
            })}
          </ul>
        </section>
      )}
      <details className="text-xs text-gray-400"><summary className="cursor-pointer">Raw response</summary><pre className="mt-1 whitespace-pre-wrap break-words bg-gray-50 rounded p-2 max-h-64 overflow-y-auto">{JSON.stringify(d, null, 2)}</pre></details>
    </div>
  )
}

export default function LinkedInHubPage() {
  const [st, setSt] = useState<Status | null>(null)
  const [tab, setTab] = useState<Tab>('overview')
  const [toolName, setToolName] = useState('')
  const [vals, setVals] = useState<Record<string, any>>({})
  const [stack, setStack] = useState<Result[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirm, setConfirm] = useState<{ tool: ToolDef; args: Record<string, any> } | null>(null)
  // True once any lookup has succeeded, which proves the saved LinkedIn login works.
  const [verified, setVerified] = useState(false)
  const [aRange, setARange] = useState<DateRange | null>(null)
  const [aQ, setAQ] = useState('')
  const [aRes, setARes] = useState<'all' | 'ok' | 'fail'>('all')
  const [aPage, setAPage] = useState(0)

  const load = useCallback(async () => {
    // Open at once from the site's own records, then check the connector (it can take a while to wake up).
    const quick = await fetch('/api/admin/linkedin-hub/status?fast=1').catch(() => null)
    const q = quick ? await quick.json().catch(() => ({})) : {}
    if (!quick?.ok) { setError(q.error || `Could not load (${quick?.status ?? 'offline'})`); setSt(s => s || { service: 'down', session: null, usage: { reads: 0, readCap: 0 }, caps: [], activity: [], detail: 'the page could not load its data' }); return }
    setSt(s => ({ ...q, ...(s && s.service !== 'checking' ? { service: s.service, session: s.session, available: s.available, sessionUnknown: s.sessionUnknown, detail: s.detail } : {}) }))
    // The connector sleeps when idle, and waking it can outlast one check, so a slow first answer is retried a few times
    // before the page says it is unreachable.
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const r = await fetch('/api/admin/linkedin-hub/status', { signal: AbortSignal.timeout(60_000) })
        const j = await r.json().catch(() => ({}))
        if (r.ok && j.service !== 'down') { setSt(j); return }
        if (attempt === 2) { setSt(r.ok ? j : s => (s ? { ...s, service: 'down', detail: j.error || `status ${r.status}` } : s)); return }
      } catch {
        if (attempt === 2) { setSt(s => (s ? { ...s, service: 'down', detail: 'it did not answer in time' } : s)); return }
      }
      setSt(s => (s ? { ...s, service: 'checking' } : s)) // still waking up: keep saying so
      await new Promise(res => setTimeout(res, 8000))
    }
  }, [])
  useEffect(() => { load() }, [load])

  const group = GROUPS.find(g => g.key === tab)
  // Only offer what this connector build actually provides.
  const offered = (t: ToolDef) => !st?.available || st.available.includes(t.name)
  const tools = TOOLS.filter(t => t.group === tab && offered(t))
  const tool = TOOLS.find(t => t.name === toolName)
  const latest = stack[stack.length - 1]

  const pickTool = (t: ToolDef, args: Record<string, any> = {}) => {
    setToolName(t.name)
    setVals(Object.fromEntries(t.fields.map(f => [f.name, args[f.name] ?? f.def ?? (f.type === 'bool' ? false : '')])))
  }
  const go = (t: Tab) => { setTab(t); setStack([]); setError(''); const first = TOOLS.find(x => x.group === t && offered(x)); if (first) pickTool(first); else setToolName('') }

  async function run(name: string, args: Record<string, any>, o: { fresh?: boolean; confirmed?: boolean } = {}) {
    const def = TOOLS.find(t => t.name === name)!
    args = Object.fromEntries(Object.entries(args).map(([k, v]) => [k, normalizeArg(k, v)]))
    if (def.group !== tab && tab !== 'overview') setTab(def.group)
    if (tab === 'overview') setTab(def.group)
    pickTool(def, args)
    if (def.kind === 'action' && !o.confirmed) { setConfirm({ tool: def, args }); return }
    setBusy(true); setError('')
    try {
      const r = await fetch('/api/admin/linkedin-hub/call', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tool: name, args, fresh: o.fresh, confirm: o.confirmed }) })
      const j = await r.json().catch(() => ({}))
      if (!r.ok) setError(j.error || `Failed (${r.status})`)
      else { setStack(s => [...s, { tool: name, args, data: j.data, ok: j.ok !== false, cached: j.cached, at: Date.now(), ms: j.ms }]); if (j.ok !== false) setVerified(true) }
    } catch (e: any) { setError(e?.message || 'Request failed') }
    setBusy(false)
    load()
  }

  const sessionOk = verified || (!!st?.session && (st.session.session?.stored === true || st.session.session?.profile || st.session.authenticated === true))
  const unknown = !sessionOk && !!st?.sessionUnknown
  const svc = st?.service
  const AP = 25
  const aRows = (st?.activity || []).filter(a => {
    if (aRes !== 'all' && a.ok !== (aRes === 'ok')) return false
    if (aRange) { const b = rangeBounds(aRange), t = Date.parse(a.at); if (!(t >= b.fromMs && t <= b.toMs)) return false }
    const n = aQ.trim().toLowerCase()
    return !n || `${a.label} ${a.summary} ${a.area} ${a.error || ''}`.toLowerCase().includes(n)
  })
  const aPages = Math.max(1, Math.ceil(aRows.length / AP)), aAt = Math.min(aPage, aPages - 1)
  const tabs: Tab[] = ['overview', ...GROUPS.map(g => g.key), 'prospecting', 'activity']

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h1 className="text-xl font-semibold tracking-tight">LinkedIn hub<InfoTip text="Look things up and act on your LinkedIn account from the admin centre: feed, people, messages, companies and jobs. It works through your saved LinkedIn login, one careful request at a time. Publishing posts stays in the Social studio." /></h1>
        <div className="flex items-center gap-2 text-xs">
          {st && <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${svc === 'up' && sessionOk ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}><i className={`w-1.5 h-1.5 rounded-full ${svc === 'up' && sessionOk ? 'bg-emerald-500' : 'bg-amber-500'}`} />{svc === 'checking' ? 'Checking connector…' : svc === 'not-configured' ? 'Not set up' : svc === 'down' ? 'Service unreachable' : sessionOk ? 'Signed in to LinkedIn' : unknown ? 'Connector running' : 'Sign-in needed'}</span>}
          <WarmSwitch onChange={load} />
          <button onClick={load} className={btn}><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
        </div>
      </div>
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}

      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-4 text-sm">
        {tabs.map(t => { const I = ICONS[t]; return (
          <button key={t} onClick={() => go(t)} className={`inline-flex items-center gap-1.5 px-3 py-2 -mb-px border-b-2 whitespace-nowrap ${tab === t ? 'border-gray-800 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'}`}><I className="w-4 h-4" />{t === 'overview' ? 'Overview' : t === 'activity' ? 'Activity' : t === 'prospecting' ? 'Prospecting' : GROUPS.find(g => g.key === t)!.label}</button>
        ) })}
      </div>

      {!st ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : tab === 'overview' ? (
        <SplitPane id="hub-overview" initial={640} min={300}
          left={<div className="space-y-4">
            {unknown && svc === 'up' && <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm flex flex-wrap items-center gap-3"><span className="text-gray-700">The connector is running. Check that your LinkedIn sign-in is saved.</span><button onClick={() => run('get_my_profile', { sections: '' })} disabled={busy} className={primary}>Check sign-in</button></div>}
            {svc !== 'checking' && (svc !== 'up' || (!sessionOk && !unknown)) && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-2">
                <div className="font-semibold">{svc === 'not-configured' ? 'The LinkedIn connector is not set up yet' : svc === 'down' ? 'The LinkedIn connector is not responding' : 'Sign in to LinkedIn once'}</div>
                <p className="text-[13px]">{svc === 'not-configured' ? 'The connector service needs to be deployed and its address added to the site settings.' : svc === 'down' ? `The service did not answer${st.detail ? ` (${st.detail})` : ''}. It may be starting up; refresh in a minute.` : 'The connector keeps a saved LinkedIn login so it stays signed in between uses. It has none yet. A one-time sign-in opens a secure browser view where you type your own password. Nothing is typed or stored by this site.'}</p>
                {svc === 'up' && <p className="text-[13px]">Ask your developer to run <code className="px-1 rounded bg-amber-100">scripts/linkedin-mcp-login.ps1</code>, which prints a private sign-in link.</p>}
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-3">
              {GROUPS.map(g => { const I = ICONS[g.key]; return (
                <button key={g.key} onClick={() => go(g.key)} className="text-left rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-gray-400 hover:shadow transition">
                  <I className="w-5 h-5 text-gray-500 mb-2" /><div className="text-sm font-semibold">{g.label}</div><div className="text-[13px] text-gray-500 mt-0.5">{g.blurb}</div>
                </button>
              ) })}
            </div>
          </div>}
          right={<div className="space-y-3">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
              <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />Today's safety limits<InfoTip text="LinkedIn restricts accounts that look automated. These daily limits keep the hub within normal human use. They reset at midnight UTC." /></div>
              <Meter label="Lookups" used={st.usage.reads} cap={st.usage.readCap} />
              {st.caps.map(c => <Meter key={c.tool} label={c.label} used={c.used} cap={c.cap} />)}
              <div className="text-xs text-gray-400 mt-2">Requests run one at a time, a few seconds apart, and repeat lookups are served from a 10-minute cache.</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
              <div className="text-xs font-semibold mb-2">Recent</div>
              <ul className="space-y-1.5 max-h-64 overflow-y-auto">
                {st.activity.slice(0, 8).map(a => <li key={a.id} className="text-[13px] flex gap-2"><i className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${a.ok ? 'bg-emerald-500' : 'bg-red-500'}`} /><span className="break-words">{a.label}{a.summary ? ` · ${a.summary}` : ''}<span className="text-gray-400"> · {new Date(a.at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></span></li>)}
                {st.activity.length === 0 && <li className="text-[13px] text-gray-400">Nothing yet.</li>}
              </ul>
            </div>
          </div>} />
      ) : tab === 'prospecting' ? (
        <ProspectingPanel />
      ) : tab === 'activity' ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="p-2.5 border-b border-gray-100 flex flex-wrap items-center gap-x-3 gap-y-2">
            <input value={aQ} onChange={e => { setAQ(e.target.value); setAPage(0) }} placeholder="Search activity" className="text-[13px] border border-gray-200 rounded-md px-2.5 py-1.5 w-48 focus:outline-none focus:border-blue-500" />
            <span className="inline-flex flex-wrap items-center gap-1">
              <button type="button" onClick={() => { setARange(null); setAPage(0) }} className={`px-2.5 py-1 text-xs rounded-full border ${!aRange ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>All time</button>
              <DateRangeFilter value={aRange || { days: -1, from: '', to: '' }} onChange={r => { setARange(r); setAPage(0) }} />
            </span>
            <span className="flex gap-1 ml-auto">{(['all', 'ok', 'fail'] as const).map(k => <button key={k} onClick={() => { setARes(k); setAPage(0) }} className={`text-xs px-2 py-1 rounded-md border ${aRes === k ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>{k === 'all' ? 'All' : k === 'ok' ? 'Succeeded' : 'Failed'}</button>)}</span>
          </div>
          <div className="max-h-[60vh] overflow-auto"><table className="w-full text-[13px]">
            <thead className="sticky top-0 bg-gray-50 text-xs text-gray-500"><tr><th className="text-left px-3 py-1.5 font-medium">When</th><th className="text-left px-3 py-1.5 font-medium">What</th><th className="text-left px-3 py-1.5 font-medium">Type</th><th className="text-right px-3 py-1.5 font-medium">Result</th></tr></thead>
            <tbody>{aRows.slice(aAt * AP, aAt * AP + AP).map(a => <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-3 py-1.5 whitespace-nowrap text-gray-500">{new Date(a.at).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td><td className="px-3 py-1.5 break-words">{a.label}{a.summary ? ` · ${a.summary}` : ''}</td><td className="px-3 py-1.5"><span className={`text-xs px-1.5 py-0.5 rounded ${a.kind === 'action' ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-600'}`}>{a.kind === 'action' ? 'action' : 'lookup'}</span></td><td className={`px-3 py-1.5 text-right ${a.ok ? 'text-gray-500' : 'text-red-600'}`}>{a.ok ? (a.cached ? 'cached' : `${(a.ms / 1000).toFixed(1)}s`) : (a.error || 'failed')}</td></tr>)}</tbody>
          </table>{aRows.length === 0 && <div className="p-6 text-sm text-gray-500 text-center">Nothing{aRange ? ` in ${rangeLabel(aRange)}` : ''} matches.</div>}</div>
          {aRows.length > AP && <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 text-xs text-gray-500"><span>{aAt * AP + 1}–{Math.min(aRows.length, aAt * AP + AP)} of {aRows.length}</span><div className="flex items-center gap-1"><button disabled={aAt === 0} onClick={() => setAPage(aAt - 1)} className={btn}>Newer</button><span className="px-1">{aAt + 1}/{aPages}</span><button disabled={aAt >= aPages - 1} onClick={() => setAPage(aAt + 1)} className={btn}>Older</button></div></div>}
        </div>
      ) : (
        <SplitPane id="hub-tools" initial={340}
          left={<div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
            <div className="text-xs text-gray-500 mb-2">{group?.blurb}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">{tools.map(t => <button key={t.name} onClick={() => { pickTool(t); setStack([]) }} className={`px-3 py-1.5 text-[13px] rounded-full border ${toolName === t.name ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 bg-white hover:border-gray-400'}`}>{t.label}{t.kind === 'action' && <span className="ml-1 opacity-60">●</span>}</button>)}</div>
            {tool && (
              <form onSubmit={e => { e.preventDefault(); run(tool.name, vals) }} className="space-y-2">
                <div className="text-xs text-gray-500">{tool.help} Plain words are fine, no special format.{tool.kind === 'action' && <span className="text-gray-700"> This changes your account.</span>}</div>
                {STARTERS[tool.name] && <div><div className="text-xs text-gray-500 mb-1">Quick starts: click one, then Run<InfoTip text="Ready-made examples. Clicking one fills the form so you can see how it works, and you can change the words before running." /></div><div className="flex flex-wrap gap-1.5">{STARTERS[tool.name].map(x => <button type="button" key={x.label} onClick={() => pickTool(tool, x.args)} className="px-2.5 py-1 text-xs rounded-full border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100">{x.label}</button>)}</div></div>}
                {tool.fields.map(f => <FieldInput key={f.name} f={f} v={vals[f.name]} set={v => setVals(s => ({ ...s, [f.name]: v }))} />)}
                <button disabled={busy || st.service !== 'up'} className={`${primary} w-full justify-center`}>{busy ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Working…</> : tool.kind === 'action' ? 'Review & confirm…' : <><Search className="w-3.5 h-3.5" />Run</>}</button>
                {busy && <div className="text-xs text-gray-400">LinkedIn pages load slowly on purpose. This can take up to a minute.</div>}
              </form>
            )}
          </div>}
          right={<div className="min-w-0">
            {stack.length > 1 && <button onClick={() => setStack(s => s.slice(0, -1))} className={`${btn} mb-2`}><ChevronLeft className="w-3.5 h-3.5" />Back</button>}
            {!latest ? <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 text-sm text-gray-500 p-10 text-center">{busy ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Fill in the form and run it. Results appear here.'}</div> : (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                  <span className="font-semibold">{TOOLS.find(t => t.name === latest.tool)?.label}</span>
                  {latest.cached && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">from cache</span>}
                  {!latest.ok && <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-xs">LinkedIn reported a problem</span>}
                  <button disabled={busy} onClick={() => run(latest.tool, latest.args, { fresh: true })} className={`${btn} ml-auto`}><RefreshCw className="w-3 h-3" />Fetch fresh</button>
                </div>
                <ResultView r={latest} label={TOOLS.find(t => t.name === latest.tool)?.label || latest.tool} busy={busy} onRun={(t, a) => run(t, a)} />
              </div>
            )}
          </div>} />
      )}

      {confirm && (
        <div className="fixed inset-0 z-[10000] bg-black/40 flex items-center justify-center p-4" onClick={() => setConfirm(null)}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5" onClick={e => e.stopPropagation()}>
            <div className="text-base font-semibold mb-1">{confirm.tool.label}</div>
            <p className="text-[13px] text-gray-600 mb-3">This will change your LinkedIn account and cannot be taken back.</p>
            <dl className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-[13px] space-y-1.5 mb-3 max-h-48 overflow-y-auto">
              {confirm.tool.fields.filter(f => confirm.args[f.name]).map(f => <div key={f.name}><dt className="text-xs text-gray-500">{f.label}</dt><dd className="break-words whitespace-pre-wrap">{String(confirm.args[f.name])}</dd></div>)}
            </dl>
            {(() => { const c = st?.caps.find(x => x.tool === confirm.tool.name); return c ? <p className="text-xs text-gray-500 mb-3">{c.used} of {c.cap} used today. {c.cap - c.used} left.</p> : null })()}
            <div className="flex justify-end gap-2">
              <button onClick={() => setConfirm(null)} className={btn}>Cancel</button>
              <button onClick={() => { const c = confirm; setConfirm(null); run(c.tool.name, c.args, { confirmed: true }) }} className={primary}>Yes, do it</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Meter({ label, used, cap }: { label: string; used: number; cap: number }) {
  const pct = Math.min(100, (used / cap) * 100)
  return (
    <div className="mb-2"><div className="flex justify-between text-xs text-gray-600"><span>{label}</span><span>{used}/{cap}</span></div>
      <div className="h-1.5 rounded bg-gray-100"><div className={`h-1.5 rounded ${pct > 85 ? 'bg-red-500' : pct > 60 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} /></div></div>
  )
}

/** Tick-box dropdown. The value is the ticked options joined by commas, so it travels like any other text field. */
function MultiSelect({ f, v, set }: { f: Field; v: any; set: (v: any) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  const on = String(v || '').split(',').map(x => x.trim()).filter(Boolean)
  const toggle = (o: string) => set((on.includes(o) ? on.filter(x => x !== o) : [...on, o]).join(','))
  const names = on.map(x => f.options!.find(o => o.v === x)?.l.replace(/\s*\(.*\)$/, '') || x)
  return (
    <div ref={ref} className="relative mt-0.5">
      <button type="button" onClick={() => setOpen(o => !o)} className={`${field} text-left flex items-center justify-between gap-2`}>
        <span className={`truncate ${on.length ? 'text-gray-800' : 'text-gray-400'}`}>{on.length ? names.join(', ') : f.placeholder || 'Any'}</span><ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-64 overflow-y-auto py-1">
          {f.options!.map(o => <label key={o.v} className="flex items-start gap-2 px-2.5 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50 cursor-pointer"><input type="checkbox" className="mt-1" checked={on.includes(o.v)} onChange={() => toggle(o.v)} /><span>{o.l}</span></label>)}
          {on.length > 0 && <button type="button" onClick={() => set('')} className="w-full text-left px-2.5 py-1.5 text-xs text-gray-500 border-t border-gray-100 hover:bg-gray-50">Clear all</button>}
        </div>
      )}
    </div>
  )
}

function FieldInput({ f, v, set }: { f: Field; v: any; set: (v: any) => void }) {
  if (f.type === 'multi') return <div className="block text-xs text-gray-500">{f.label}{f.required && <span className="text-red-500"> *</span>}{FIELD_TIPS[f.name] && <InfoTip text={FIELD_TIPS[f.name]} />}<MultiSelect f={f} v={v} set={set} /></div>
  return (
    <label className="block text-xs text-gray-500">{f.label}{f.required && <span className="text-red-500"> *</span>}{FIELD_TIPS[f.name] && <InfoTip text={FIELD_TIPS[f.name]} />}
      {f.type === 'select' ? <select value={v} onChange={e => set(e.target.value)} className={`${field} mt-0.5`}>{f.options!.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
        : f.type === 'bool' ? <span className="flex items-center gap-2 mt-1 text-sm text-gray-700"><input type="checkbox" checked={!!v} onChange={e => set(e.target.checked)} />Yes</span>
        : f.type === 'textarea' ? <textarea value={v} rows={4} placeholder={f.placeholder} onChange={e => set(e.target.value)} className={`${field} mt-0.5`} />
        : <input type={f.type === 'number' ? 'number' : 'text'} value={v} placeholder={f.placeholder} onChange={e => set(e.target.value)} className={`${field} mt-0.5`} />}
    </label>
  )
}
