'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Loader2, Sparkles, Check, Save, Trash2, Download, GitPullRequest, Plus, X, Bot, ChevronDown, ExternalLink, Paperclip } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'
import RefBox, { type Ref } from '@/components/admin/RefBox'
import AgentTimeline, { type RunState } from '@/components/admin/AgentTimeline'

interface Meta {
  title: string; slug: string; excerpt: string; tldr: string
  keyTakeaways: string[]; faqs: { question: string; answer: string }[]; references: { title: string; url: string; source: string }[]
  category: string; tags: string[]; hashtags: string[]; readTime: string; coverColor: string; icon: string; date: string
}
interface Draft {
  id: string; topic: string; status: 'draft' | 'approved' | 'submitted'; meta: Meta; body: string
  review?: { verdict: string; notes: string[] }; trace?: { agent: string; label: string; output: string; usd: number }[]
  pr?: { url: string; number: number; branch: string }; createdAt: string
}
interface Tax { categories: { name: string; count: number }[]; tags: { name: string; count: number }[]; posts: { slug: string; title: string }[] }

const BADGE = { draft: 'bg-amber-100 text-amber-800', approved: 'bg-gray-100 text-gray-700', submitted: 'bg-emerald-100 text-emerald-800' }
const LABEL = { draft: 'draft', approved: 'approved', submitted: 'in review (PR)' }
const CHIPS = ['Tighten it: cut 15% without losing facts', 'Stronger opening paragraph', 'Add a practical example', 'Sharper "what to do next" section', 'Improve the FAQs', 'Make the tone more direct']
const field = 'w-full text-sm border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white'
const usd = (n: number) => `$${n < 1 ? n.toFixed(3) : n.toFixed(2)}`
const words = (html: string) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length

export default function BlogStudioPage() {
  const [drafts, setDrafts] = useState<Draft[] | null>(null)
  const [tax, setTax] = useState<Tax>({ categories: [], tags: [], posts: [] })
  const [spend, setSpend] = useState<Record<string, number>>({})
  const [githubReady, setGithubReady] = useState(false)
  const [sel, setSel] = useState('')
  const [topic, setTopic] = useState('')
  const [brief, setBrief] = useState('')
  const [refs, setRefs] = useState<Ref[]>([])
  const [refUrl, setRefUrl] = useState('')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [run, setRun] = useState<RunState | null>(null)
  const [tab, setTab] = useState<'preview' | 'html' | 'qa'>('preview')
  const [rev, setRev] = useState('')
  const [revPart, setRevPart] = useState<'all' | 'body' | 'meta'>('all')
  const [newTag, setNewTag] = useState('')
  const [newCat, setNewCat] = useState(false)

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/blog')
    if (!r.ok) { setError(`Could not load (${r.status})`); return }
    const j = await r.json()
    setDrafts(j.drafts); setTax(j.taxonomy); setSpend(j.spend || {}); setGithubReady(!!j.githubReady)
  }, [])
  useEffect(() => { load() }, [load])
  // "Resume" links from the Sessions page and the autopilot open a specific draft.
  useEffect(() => { const q = new URLSearchParams(window.location.search).get('draft'); if (q) setSel(q) }, [])

  const cur = drafts?.find(d => d.id === sel)
  const locked = cur?.status === 'submitted'
  const patchLocal = (id: string, f: (d: Draft) => Draft) => setDrafts(ds => ds && ds.map(d => (d.id === id ? f(d) : d)))
  const setMeta = (p: Partial<Meta>) => cur && patchLocal(cur.id, d => ({ ...d, meta: { ...d.meta, ...p } }))
  const json = (body: unknown): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

  async function call(label: string, url: string, init?: RequestInit) {
    setBusy(label); setError(''); setNotice('')
    const r = await fetch(url, init)
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok) setError(j.error || `Failed (${r.status})`)
    return { ok: r.ok, ...j }
  }

  async function addRef(src: { file?: File; url?: string }) {
    setBusy('ref'); setError('')
    const init: RequestInit = src.file ? { method: 'POST', body: (() => { const f = new FormData(); f.append('file', src.file!); return f })() } : json({ url: src.url })
    const r = await fetch('/api/admin/social/references', init)
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok) { setError(j.error || 'Could not add that reference.'); return }
    setRefs(p => [...p, j.ref]); setRefUrl('')
  }

  async function runTeam() {
    setBusy('team'); setError(''); setNotice(''); setSel('')
    setRun({ steps: [], error: '', done: false })
    const upd = (agent: string, label: string, f: (s: RunState['steps'][number]) => Partial<RunState['steps'][number]>) => setRun(r => {
      if (!r) return r
      const i = r.steps.findIndex(s => s.agent === agent)
      const base = i >= 0 ? r.steps[i] : { agent, label, status: 'running' as const, output: '', live: '', usd: 0 }
      const next = { ...base, ...f(base) }
      return { ...r, steps: i >= 0 ? r.steps.map((s, k) => (k === i ? next : s)) : [...r.steps, next] }
    })
    try {
      const res = await fetch('/api/admin/blog/agent', json({ topic, brief, refIds: refs.map(r => r.id) }))
      if (!res.ok || !res.body) { const j = await res.json().catch(() => ({})); throw new Error(j.error || `Failed (${res.status})`) }
      const reader = res.body.getReader(), dec = new TextDecoder()
      let buf = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        buf += dec.decode(value, { stream: true })
        const lines = buf.split('\n'); buf = lines.pop() || ''
        for (const line of lines) {
          if (!line.trim()) continue
          const ev = JSON.parse(line)
          if (ev.type === 'step') upd(ev.agent, ev.label, s => ({ status: ev.status, ...(ev.status === 'done' || ev.status === 'error' ? { output: ev.output || s.live, usd: ev.usd || 0 } : {}) }))
          else if (ev.type === 'delta') upd(ev.agent, ev.agent, s => ({ live: s.live + ev.text }))
          else if (ev.type === 'error') throw new Error(ev.message)
          else if (ev.type === 'result') {
            setTopic(''); setBrief(''); setRefs([])
            await load(); setSel(ev.draftId); setRun(null); setTab('preview')
            setNotice(`The team finished${ev.review?.verdict === 'revise' ? ' and the reviewer suggests changes' : ''}. Review it below, edit anything, then approve.`)
          }
        }
      }
    } catch (e: any) {
      setRun(r => (r ? { ...r, error: e?.message || 'The agent run failed.' } : r))
    }
    setBusy('')
    setRun(r => (r ? { ...r, done: true } : r))
  }

  async function save(status?: 'draft' | 'approved') {
    if (!cur) return
    const j = await call('save', `/api/admin/blog/${cur.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ body: cur.body, meta: cur.meta, ...(status ? { status } : {}) }) })
    if (j.draft) { patchLocal(cur.id, () => j.draft); setNotice(status === 'approved' ? 'Approved. You can publish it now.' : 'Saved.') }
    return j.draft as Draft | undefined
  }
  async function revise(instruction: string) {
    if (!cur || !instruction.trim()) return
    await save()
    const j = await call('revise', `/api/admin/blog/${cur.id}/revise`, json({ instruction, part: revPart }))
    if (j.draft) { patchLocal(cur.id, () => j.draft); setRev(''); setNotice('Revised. Review the preview, then approve.') }
    load()
  }
  async function publish() {
    if (!cur) return
    const saved = await save('approved')
    if (!saved) return
    const j = await call('publish', `/api/admin/blog/${cur.id}/publish`, { method: 'POST' })
    if (j.draft) { patchLocal(cur.id, () => j.draft); setNotice('Pull request opened. Merge it on GitHub to publish the post.') }
  }
  async function remove() {
    if (!cur || !confirm('Delete this draft?')) return
    await call('delete', `/api/admin/blog/${cur.id}`, { method: 'DELETE' })
    setSel(''); load()
  }

  const addTag = (t: string) => { const v = t.trim(); if (v && cur && !cur.meta.tags.includes(v)) setMeta({ tags: [...cur.meta.tags, v] }); setNewTag('') }
  const suggestions = useMemo(() => tax.tags.filter(t => cur && !cur.meta.tags.includes(t.name)).slice(0, 14), [tax, cur])
  const missing = cur ? [!cur.meta.title.trim() && 'title', !cur.meta.excerpt.trim() && 'excerpt', !cur.meta.tldr.trim() && 'TL;DR', !cur.body.trim() && 'article', !cur.meta.tags.length && 'a tag', !cur.meta.faqs.length && 'an FAQ'].filter(Boolean) as string[] : []
  const primary = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40'
  const btn = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-md border border-gray-200 bg-white hover:border-gray-400 disabled:opacity-40'
  const chip = 'px-2 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700 hover:border-gray-500 hover:text-gray-900 disabled:opacity-40'
  const step = cur ? (cur.status === 'draft' ? 1 : cur.status === 'approved' ? 2 : 3) : 0
  const isNewCat = !!cur && !tax.categories.some(c => c.name === cur.meta.category)

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold tracking-tight">Blog studio<InfoTip text="An AI team researches, writes, tags and reviews a post in the blog's exact format. You edit everything, approve it, and publishing opens a GitHub pull request; merging it puts the post live." /></h1>
        <span className="text-xs text-gray-500">{drafts ? `${drafts.length} draft${drafts.length === 1 ? '' : 's'} · ${tax.posts.length} published posts` : ''}</span>
      </div>
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}

      <div className="grid lg:grid-cols-[270px_1fr] gap-4 items-start">
        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Bot className="w-3.5 h-3.5 text-gray-500" />New article</div>
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic, e.g. MCP gateways for enterprise AI agents" className={`${field} mb-2`} />
            <textarea value={brief} onChange={e => setBrief(e.target.value)} placeholder="Angle, audience, must-include points (optional)" rows={3} className={`${field} mb-2`} />
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Paperclip className="w-3 h-3" />Sources<InfoTip text="Paste news or documentation links, or attach PDFs and notes. The agents only cite URLs that appear in your sources, so add the primary ones." /></div>
            <RefBox refs={refs} busy={busy === 'ref'} url={refUrl} setUrl={setRefUrl} onUrl={() => addRef({ url: refUrl })} onFile={f => addRef({ file: f })} onRemove={id => setRefs(p => p.filter(r => r.id !== id))} />
            <button disabled={topic.trim().length < 3 || !!busy} onClick={runTeam} className={`${primary} w-full justify-center`}><Sparkles className="w-3.5 h-3.5" />{busy === 'team' ? 'Team working…' : 'Write with the AI team'}</button>
            <div className="text-xs text-gray-400 mt-1.5">Takes about a minute and costs roughly $0.08.</div>
          </div>
          {!drafts ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
            <ul className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden shadow-sm max-h-[60vh] overflow-y-auto">
              {drafts.length === 0 && <li className="p-3 text-sm text-gray-500">No drafts yet.</li>}
              {drafts.map(d => (
                <li key={d.id}>
                  <button onClick={() => { setSel(d.id); setRun(null); setNotice(''); setError('') }} className={`w-full text-left px-3 py-2 hover:bg-gray-50 border-l-2 ${sel === d.id ? 'bg-gray-100 border-gray-800' : 'border-transparent'}`}>
                    <div className="text-[13px] font-medium line-clamp-2">{d.meta.title}</div>
                    <div className="flex items-center gap-2 mt-0.5"><span className={`text-xs px-1.5 py-0.5 rounded ${BADGE[d.status]}`}>{LABEL[d.status]}</span><span className="text-xs text-gray-400">{d.meta.category}</span><span className="text-xs text-gray-500 ml-auto">{usd(spend[d.id] || 0)}</span></div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {run ? <AgentTimeline run={run} onClose={() => setRun(null)} title="The blog team at work" /> : !cur ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 text-sm text-gray-500 p-10 text-center">Pick a draft on the left, or give the team a topic.</div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {['Draft & edit', 'Approve', 'Pull request'].map((l, i) => (
                <div key={l} className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${step > i + 1 || (step === 3 && i === 2) ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-500'}`}>{step > i + 1 ? <Check className="w-3 h-3" /> : i + 1}</span>
                  <span className={step === i + 1 ? 'text-gray-900 font-medium' : ''}>{l}</span>
                  {i < 2 && <span className="w-8 h-px bg-gray-300" />}
                </div>
              ))}
            </div>

            <div className="grid xl:grid-cols-[minmax(0,1fr)_330px] gap-4 items-start">
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-4 pt-4">
                  <input disabled={locked} value={cur.meta.title} onChange={e => setMeta({ title: e.target.value })} className="w-full text-xl font-bold tracking-tight border border-transparent hover:border-gray-200 focus:border-blue-400 focus:outline-none rounded-md px-1.5 py-1 -mx-1.5" />
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-gray-100">{cur.meta.category}</span><span>{words(cur.body).toLocaleString()} words · {cur.meta.readTime}</span><span>/resources/blog/{cur.meta.slug}</span>
                  </div>
                </div>
                <div className="flex gap-1 px-4 mt-3 border-b border-gray-100 text-xs">
                  {([['preview', 'Preview'], ['html', 'Edit HTML'], ['qa', 'Takeaways, FAQs & sources']] as const).map(([k, l]) => (
                    <button key={k} onClick={() => setTab(k)} className={`px-3 py-2 -mb-px border-b-2 ${tab === k ? 'border-gray-800 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>{l}</button>
                  ))}
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto">
                  {tab === 'preview' && (
                    <article className="max-w-2xl text-[15px] leading-7 text-gray-800 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-7 [&_h2]:mb-2 [&_h3]:font-semibold [&_h3]:mt-5 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_a]:text-blue-700 [&_a]:underline [&_strong]:text-gray-900">
                      <p className="!mt-0 text-gray-600 border-l-4 border-gray-300 pl-3 italic">{cur.meta.tldr}</p>
                      <div dangerouslySetInnerHTML={{ __html: cur.body }} />
                    </article>
                  )}
                  {tab === 'html' && <textarea disabled={locked} value={cur.body} onChange={e => patchLocal(cur.id, d => ({ ...d, body: e.target.value }))} rows={28} spellCheck={false} className={`${field} font-mono text-[13px] leading-5`} />}
                  {tab === 'qa' && (
                    <div className="space-y-5 text-sm">
                      <section><div className="text-xs font-semibold mb-1.5">Key takeaways</div>
                        {cur.meta.keyTakeaways.map((k, i) => (
                          <div key={i} className="flex gap-1.5 mb-1.5"><textarea disabled={locked} value={k} rows={2} onChange={e => setMeta({ keyTakeaways: cur.meta.keyTakeaways.map((x, j) => (j === i ? e.target.value : x)) })} className={field} /><button disabled={locked} onClick={() => setMeta({ keyTakeaways: cur.meta.keyTakeaways.filter((_, j) => j !== i) })} className="text-gray-400 hover:text-red-600"><X className="w-4 h-4" /></button></div>
                        ))}
                        <button disabled={locked} onClick={() => setMeta({ keyTakeaways: [...cur.meta.keyTakeaways, ''] })} className={btn}><Plus className="w-3.5 h-3.5" />Add takeaway</button></section>
                      <section><div className="text-xs font-semibold mb-1.5">FAQs</div>
                        {cur.meta.faqs.map((f, i) => (
                          <div key={i} className="rounded-md border border-gray-200 p-2 mb-2 space-y-1.5">
                            <div className="flex gap-1.5"><input disabled={locked} value={f.question} onChange={e => setMeta({ faqs: cur.meta.faqs.map((x, j) => (j === i ? { ...x, question: e.target.value } : x)) })} className={`${field} font-medium`} /><button disabled={locked} onClick={() => setMeta({ faqs: cur.meta.faqs.filter((_, j) => j !== i) })} className="text-gray-400 hover:text-red-600"><X className="w-4 h-4" /></button></div>
                            <textarea disabled={locked} value={f.answer} rows={3} onChange={e => setMeta({ faqs: cur.meta.faqs.map((x, j) => (j === i ? { ...x, answer: e.target.value } : x)) })} className={field} />
                          </div>
                        ))}
                        <button disabled={locked} onClick={() => setMeta({ faqs: [...cur.meta.faqs, { question: '', answer: '' }] })} className={btn}><Plus className="w-3.5 h-3.5" />Add FAQ</button></section>
                      <section><div className="text-xs font-semibold mb-1.5">Sources<InfoTip text="Only real links. The AI is told to cite only URLs from your sources, but check each one before publishing." /></div>
                        {cur.meta.references.map((r, i) => (
                          <div key={i} className="grid grid-cols-[1fr_auto] gap-1.5 mb-2">
                            <div className="space-y-1"><input disabled={locked} value={r.title} placeholder="Title" onChange={e => setMeta({ references: cur.meta.references.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} className={field} />
                              <div className="flex gap-1.5"><input disabled={locked} value={r.url} placeholder="https://…" onChange={e => setMeta({ references: cur.meta.references.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)) })} className={`${field} font-mono text-xs`} /><input disabled={locked} value={r.source} placeholder="Publisher · date" onChange={e => setMeta({ references: cur.meta.references.map((x, j) => (j === i ? { ...x, source: e.target.value } : x)) })} className={field} /></div></div>
                            <div className="flex flex-col gap-1">{/^https?:/.test(r.url) && <a href={r.url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-500" title="Open"><ExternalLink className="w-4 h-4" /></a>}<button disabled={locked} onClick={() => setMeta({ references: cur.meta.references.filter((_, j) => j !== i) })} className="text-gray-400 hover:text-red-600"><X className="w-4 h-4" /></button></div>
                          </div>
                        ))}
                        <button disabled={locked} onClick={() => setMeta({ references: [...cur.meta.references, { title: '', url: '', source: '' }] })} className={btn}><Plus className="w-3.5 h-3.5" />Add source</button></section>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {!locked && (
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
                    <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-gray-500" />Revise with AI</div>
                    <div className="flex gap-1 mb-2 text-xs">
                      {([['all', 'Everything'], ['body', 'Article only'], ['meta', 'Summary, FAQs, tags']] as const).map(([k, l]) => <button key={k} onClick={() => setRevPart(k)} className={`px-2 py-1 rounded-md border ${revPart === k ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 bg-white'}`}>{l}</button>)}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mb-2">{CHIPS.map(c => <button key={c} disabled={!!busy} onClick={() => revise(c)} className={chip}>{c.replace(/:.*/, '')}</button>)}</div>
                    <textarea value={rev} onChange={e => setRev(e.target.value)} rows={3} placeholder="Or say exactly what to change" className={field} />
                    <button disabled={!rev.trim() || !!busy} onClick={() => revise(rev)} className={`${primary} w-full justify-center mt-2`}>{busy === 'revise' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Revising…</> : 'Revise'}</button>
                  </div>
                )}

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 space-y-3">
                  <div>
                    <div className="text-xs font-semibold mb-1">Category<InfoTip text="Pick one of the site's existing categories, or add a new one. A new category appears on the blog filter once the post is live." /></div>
                    {newCat || isNewCat ? (
                      <div className="flex gap-1.5"><input disabled={locked} value={cur.meta.category} onChange={e => setMeta({ category: e.target.value })} placeholder="New category" className={field} /><button disabled={locked} onClick={() => { setNewCat(false); setMeta({ category: tax.categories[0]?.name || '' }) }} className={btn}>Existing</button></div>
                    ) : (
                      <select disabled={locked} value={cur.meta.category} onChange={e => e.target.value === '__new' ? (setNewCat(true), setMeta({ category: '' })) : setMeta({ category: e.target.value })} className={field}>
                        {tax.categories.map(c => <option key={c.name} value={c.name}>{c.name} ({c.count})</option>)}
                        <option value="__new">+ New category…</option>
                      </select>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-1">Tags</div>
                    <div className="flex flex-wrap gap-1.5 mb-1.5">
                      {cur.meta.tags.map(t => <span key={t} className="inline-flex items-center gap-1 text-xs rounded-full bg-gray-100 text-gray-700 border border-gray-200 pl-2 pr-1 py-0.5">{t}{!locked && <button onClick={() => setMeta({ tags: cur.meta.tags.filter(x => x !== t) })} aria-label={`Remove ${t}`}><X className="w-3 h-3" /></button>}</span>)}
                    </div>
                    {!locked && <>
                      <div className="flex gap-1.5"><input value={newTag} onChange={e => setNewTag(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(newTag) } }} placeholder="Add or create a tag" className={field} /><button disabled={!newTag.trim()} onClick={() => addTag(newTag)} className={btn}>Add</button></div>
                      <div className="flex flex-wrap gap-1 mt-1.5">{suggestions.map(t => <button key={t.name} onClick={() => addTag(t.name)} className="text-xs px-1.5 py-0.5 rounded border border-gray-200 text-gray-600 hover:border-gray-500 hover:text-gray-900">+ {t.name}</button>)}</div>
                    </>}
                  </div>
                  <details className="group">
                    <summary className="text-xs font-semibold cursor-pointer list-none flex items-center gap-1">Details<ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-open:rotate-180 transition-transform" /></summary>
                    <div className="space-y-2 mt-2">
                      <label className="block text-xs text-gray-500">Slug<input disabled={locked} value={cur.meta.slug} onChange={e => setMeta({ slug: e.target.value })} className={`${field} font-mono text-xs`} /></label>
                      <label className="block text-xs text-gray-500">Excerpt<textarea disabled={locked} value={cur.meta.excerpt} rows={3} onChange={e => setMeta({ excerpt: e.target.value })} className={field} /></label>
                      <label className="block text-xs text-gray-500">TL;DR<textarea disabled={locked} value={cur.meta.tldr} rows={3} onChange={e => setMeta({ tldr: e.target.value })} className={field} /></label>
                      <label className="block text-xs text-gray-500">Hashtags (comma separated)<input disabled={locked} value={cur.meta.hashtags.join(', ')} onChange={e => setMeta({ hashtags: e.target.value.split(',').map(x => x.trim()).filter(Boolean) })} className={field} /></label>
                      <div className="grid grid-cols-3 gap-2">
                        <label className="block text-xs text-gray-500">Date<input disabled={locked} type="date" value={cur.meta.date} onChange={e => setMeta({ date: e.target.value })} className={field} /></label>
                        <label className="block text-xs text-gray-500">Colour<input disabled={locked} type="color" value={cur.meta.coverColor} onChange={e => setMeta({ coverColor: e.target.value })} className="w-full h-[34px] border border-gray-200 rounded-md bg-white" /></label>
                        <label className="block text-xs text-gray-500">Icon<input disabled={locked} value={cur.meta.icon} onChange={e => setMeta({ icon: e.target.value })} className={`${field} text-center`} /></label>
                      </div>
                    </div>
                  </details>
                </div>

                {(cur.review || cur.trace?.length) && (
                  <details className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 group" open={cur.review?.verdict === 'revise'}>
                    <summary className="text-xs font-semibold cursor-pointer list-none flex items-center gap-1.5"><Bot className="w-3.5 h-3.5 text-gray-500" />Editorial review{cur.review && <span className={`px-1.5 py-0.5 rounded text-xs ${cur.review.verdict === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{cur.review.verdict === 'pass' ? 'passed' : 'changes suggested'}</span>}<ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-open:rotate-180 transition-transform" /></summary>
                    {cur.review?.notes?.length ? <ul className="mt-2 space-y-1 text-xs text-gray-700 list-disc pl-4">{cur.review.notes.map((n, i) => <li key={i} className="break-words">{n}</li>)}</ul> : null}
                    {cur.review?.verdict === 'revise' && !locked && <button disabled={!!busy} onClick={() => revise(`Apply the reviewer's notes: ${cur.review!.notes.join(' ')}`)} className={`${btn} mt-2`}><Sparkles className="w-3.5 h-3.5" />Apply reviewer notes</button>}
                  </details>
                )}

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 space-y-2">
                  {cur.status !== 'submitted' && missing.length > 0 && <div className="text-xs text-amber-700">Still needed: {missing.join(', ')}.</div>}
                  <div className="flex flex-wrap items-center gap-2">
                    <button disabled={locked || !!busy} onClick={() => save()} className={btn}><Save className="w-3.5 h-3.5" />Save</button>
                    {cur.status === 'draft' && <button disabled={!!busy || missing.length > 0} onClick={() => save('approved')} className={btn}><Check className="w-3.5 h-3.5" />Approve</button>}
                    {cur.status === 'approved' && <button disabled={!!busy} onClick={() => save('draft')} className={btn}>Back to draft</button>}
                    <a href={`/api/admin/blog/${cur.id}/export`} className={btn} title="Download the post as a .ts file"><Download className="w-3.5 h-3.5" />Export</a>
                    <button disabled={!!busy} onClick={remove} className={`${btn} text-red-700 ml-auto`}><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {cur.status !== 'submitted' && (
                    <button disabled={!!busy || missing.length > 0} onClick={publish} className={`${primary} w-full justify-center`}><GitPullRequest className="w-3.5 h-3.5" />{busy === 'publish' ? 'Opening pull request…' : 'Approve & open pull request'}</button>
                  )}
                  {cur.status !== 'submitted' && !githubReady && <div className="text-xs text-gray-400">GitHub isn't connected yet (GITHUB_TOKEN). Until it is, use Export and add the file to the repo.</div>}
                  {cur.pr && <a href={cur.pr.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs text-emerald-700 hover:underline"><GitPullRequest className="w-3.5 h-3.5" />Pull request #{cur.pr.number} is open. Merge it to publish.<ExternalLink className="w-3 h-3" /></a>}
                  <div className="text-xs text-gray-400">AI cost for this post: {usd(spend[cur.id] || 0)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
