'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, RefreshCw, Newspaper, Users, MessageSquare, Building2, Briefcase, UserCircle, Activity, LayoutGrid, ExternalLink, ShieldCheck, ChevronLeft, Search } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'
import { GROUPS, TOOLS, type Field, type GroupKey, type ToolDef } from '@/lib/linkedin-catalog'

type Tab = 'overview' | GroupKey | 'activity'
interface Status {
  service: 'up' | 'down' | 'not-configured'; detail?: string; session: any; ok?: boolean; sessionUnknown?: boolean; available?: string[]
  usage: { reads: number; readCap: number }; caps: { tool: string; label: string; cap: number; used: number }[]
  activity: { id: string; at: string; tool: string; label: string; kind: string; area: string; summary: string; ok: boolean; cached: boolean; ms: number; error?: string }[]
}
interface Result { tool: string; args: Record<string, any>; data: any; ok: boolean; cached?: boolean; at: number; ms?: number }

const ICONS: Record<Tab, any> = { overview: LayoutGrid, feed: Newspaper, people: Users, inbox: MessageSquare, companies: Building2, jobs: Briefcase, me: UserCircle, activity: Activity }
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

function ResultView({ r, onRun, busy }: { r: Result; onRun: (tool: string, args: Record<string, any>) => void; busy: boolean }) {
  const d = r.data
  const sections: Record<string, string> = d && typeof d.sections === 'object' && !Array.isArray(d.sections) ? d.sections : {}
  const refs = useMemo(() => collectRefs(d?.references ?? (Array.isArray(d) ? d : undefined)), [d])
  const rest = d && typeof d === 'object' ? Object.fromEntries(Object.entries(d).filter(([k]) => !['sections', 'references'].includes(k))) : {}
  const scalars = Object.entries(rest).filter(([, v]) => ['string', 'number', 'boolean'].includes(typeof v))
  const [more, setMore] = useState<Record<string, boolean>>({})
  if (typeof d === 'string' || d?.text) return <pre className="whitespace-pre-wrap break-words text-[13px] font-sans text-gray-700">{typeof d === 'string' ? d : d.text}</pre>
  return (
    <div className="space-y-3">
      {scalars.length > 0 && <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">{scalars.map(([k, v]) => <span key={k}><b className="font-medium text-gray-600">{pretty(k)}:</b> {typeof v === 'string' && /^https?:/.test(v) ? <a href={v} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline">{v.slice(0, 60)}</a> : String(v).slice(0, 120)}</span>)}</div>}
      {Object.entries(sections).map(([k, text]) => text ? (
        <section key={k} className="rounded-lg border border-gray-200 bg-white">
          <div className="px-3 py-1.5 text-xs font-semibold border-b border-gray-100 bg-gray-50 rounded-t-lg">{pretty(k)}</div>
          <pre className="px-3 py-2 whitespace-pre-wrap break-words text-[13px] leading-6 font-sans text-gray-700">{more[k] || String(text).length < 1600 ? String(text) : `${String(text).slice(0, 1600)}…`}</pre>
          {String(text).length >= 1600 && <button onClick={() => setMore(m => ({ ...m, [k]: !m[k] }))} className="px-3 pb-2 text-xs text-blue-700">{more[k] ? 'Show less' : 'Show all'}</button>}
        </section>
      ) : null)}
      {refs.length > 0 && (
        <section className="rounded-lg border border-gray-200 bg-white">
          <div className="px-3 py-1.5 text-xs font-semibold border-b border-gray-100 bg-gray-50 rounded-t-lg">Links found ({refs.length})</div>
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
      {!Object.keys(sections).length && !refs.length && <pre className="whitespace-pre-wrap break-words text-[13px] text-gray-600 bg-gray-50 rounded-lg p-3 max-h-96 overflow-y-auto">{JSON.stringify(d, null, 2)}</pre>}
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

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/linkedin-hub/status')
    const j = await r.json().catch(() => ({}))
    if (!r.ok) { setError(j.error || `Could not load (${r.status})`); return }
    setSt(j)
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
  const tabs: Tab[] = ['overview', ...GROUPS.map(g => g.key), 'activity']

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h1 className="text-xl font-semibold tracking-tight">LinkedIn hub<InfoTip text="Look things up and act on your LinkedIn account from the admin centre: feed, people, messages, companies and jobs. It works through your saved LinkedIn login, one careful request at a time. Publishing posts stays in the Social studio." /></h1>
        <div className="flex items-center gap-2 text-xs">
          {st && <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${svc === 'up' && sessionOk ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-amber-200 bg-amber-50 text-amber-800'}`}><i className={`w-1.5 h-1.5 rounded-full ${svc === 'up' && sessionOk ? 'bg-emerald-500' : 'bg-amber-500'}`} />{svc === 'not-configured' ? 'Not set up' : svc === 'down' ? 'Service unreachable' : sessionOk ? 'Signed in to LinkedIn' : unknown ? 'Connector running' : 'Sign-in needed'}</span>}
          <button onClick={load} className={btn}><RefreshCw className="w-3.5 h-3.5" />Refresh</button>
        </div>
      </div>
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}

      <div className="flex gap-1 overflow-x-auto border-b border-gray-200 mb-4 text-sm">
        {tabs.map(t => { const I = ICONS[t]; return (
          <button key={t} onClick={() => go(t)} className={`inline-flex items-center gap-1.5 px-3 py-2 -mb-px border-b-2 whitespace-nowrap ${tab === t ? 'border-gray-800 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'}`}><I className="w-4 h-4" />{t === 'overview' ? 'Overview' : t === 'activity' ? 'Activity' : GROUPS.find(g => g.key === t)!.label}</button>
        ) })}
      </div>

      {!st ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : tab === 'overview' ? (
        <div className="grid lg:grid-cols-[1fr_340px] gap-4 items-start">
          <div className="space-y-4">
            {unknown && svc === 'up' && <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm flex flex-wrap items-center gap-3"><span className="text-gray-700">The connector is running. Check that your LinkedIn sign-in is saved.</span><button onClick={() => run('get_my_profile', { sections: '' })} disabled={busy} className={primary}>Check sign-in</button></div>}
            {(svc !== 'up' || (!sessionOk && !unknown)) && (
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
          </div>
          <div className="space-y-3">
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
          </div>
        </div>
      ) : tab === 'activity' ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="max-h-[70vh] overflow-auto"><table className="w-full text-[13px]">
            <thead className="sticky top-0 bg-gray-50 text-xs text-gray-500"><tr><th className="text-left px-3 py-1.5 font-medium">When</th><th className="text-left px-3 py-1.5 font-medium">What</th><th className="text-left px-3 py-1.5 font-medium">Type</th><th className="text-right px-3 py-1.5 font-medium">Result</th></tr></thead>
            <tbody>{st.activity.map(a => <tr key={a.id} className="border-t border-gray-100 hover:bg-gray-50"><td className="px-3 py-1.5 whitespace-nowrap text-gray-500">{new Date(a.at).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</td><td className="px-3 py-1.5 break-words">{a.label}{a.summary ? ` · ${a.summary}` : ''}</td><td className="px-3 py-1.5"><span className={`text-xs px-1.5 py-0.5 rounded ${a.kind === 'action' ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-600'}`}>{a.kind === 'action' ? 'action' : 'lookup'}</span></td><td className={`px-3 py-1.5 text-right ${a.ok ? 'text-gray-500' : 'text-red-600'}`}>{a.ok ? (a.cached ? 'cached' : `${(a.ms / 1000).toFixed(1)}s`) : (a.error || 'failed')}</td></tr>)}</tbody>
          </table></div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[320px_1fr] gap-4 items-start">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
            <div className="text-xs text-gray-500 mb-2">{group?.blurb}</div>
            <div className="flex flex-wrap gap-1.5 mb-3">{tools.map(t => <button key={t.name} onClick={() => { pickTool(t); setStack([]) }} className={`px-3 py-1.5 text-[13px] rounded-full border ${toolName === t.name ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 bg-white hover:border-gray-400'}`}>{t.label}{t.kind === 'action' && <span className="ml-1 opacity-60">●</span>}</button>)}</div>
            {tool && (
              <form onSubmit={e => { e.preventDefault(); run(tool.name, vals) }} className="space-y-2">
                <div className="text-xs text-gray-500">{tool.help}{tool.kind === 'action' && <span className="text-gray-700"> This changes your account.</span>}</div>
                {tool.fields.map(f => <FieldInput key={f.name} f={f} v={vals[f.name]} set={v => setVals(s => ({ ...s, [f.name]: v }))} />)}
                <button disabled={busy || st.service !== 'up'} className={`${primary} w-full justify-center`}>{busy ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Working…</> : tool.kind === 'action' ? 'Review & confirm…' : <><Search className="w-3.5 h-3.5" />Run</>}</button>
                {busy && <div className="text-xs text-gray-400">LinkedIn pages load slowly on purpose. This can take up to a minute.</div>}
              </form>
            )}
          </div>
          <div className="min-w-0">
            {stack.length > 1 && <button onClick={() => setStack(s => s.slice(0, -1))} className={`${btn} mb-2`}><ChevronLeft className="w-3.5 h-3.5" />Back</button>}
            {!latest ? <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 text-sm text-gray-500 p-10 text-center">{busy ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Fill in the form and run it. Results appear here.'}</div> : (
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
                <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                  <span className="font-semibold">{TOOLS.find(t => t.name === latest.tool)?.label}</span>
                  {latest.cached && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">from cache</span>}
                  {!latest.ok && <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-xs">LinkedIn reported a problem</span>}
                  <button disabled={busy} onClick={() => run(latest.tool, latest.args, { fresh: true })} className={`${btn} ml-auto`}><RefreshCw className="w-3 h-3" />Fetch fresh</button>
                </div>
                <ResultView r={latest} busy={busy} onRun={(t, a) => run(t, a)} />
              </div>
            )}
          </div>
        </div>
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

function FieldInput({ f, v, set }: { f: Field; v: any; set: (v: any) => void }) {
  return (
    <label className="block text-xs text-gray-500">{f.label}{f.required && <span className="text-red-500"> *</span>}
      {f.type === 'select' ? <select value={v} onChange={e => set(e.target.value)} className={`${field} mt-0.5`}>{f.options!.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}</select>
        : f.type === 'bool' ? <span className="flex items-center gap-2 mt-1 text-sm text-gray-700"><input type="checkbox" checked={!!v} onChange={e => set(e.target.checked)} />Yes</span>
        : f.type === 'textarea' ? <textarea value={v} rows={4} placeholder={f.placeholder} onChange={e => set(e.target.value)} className={`${field} mt-0.5`} />
        : <input type={f.type === 'number' ? 'number' : 'text'} value={v} placeholder={f.placeholder} onChange={e => set(e.target.value)} className={`${field} mt-0.5`} />}
    </label>
  )
}
