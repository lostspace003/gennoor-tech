'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Sparkles, ImageIcon, Check, Send, Trash2, Save, RotateCcw, Paperclip, Link2, FileText, X, Pencil, Bot, Film, Download, ChevronDown, Maximize2 } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'
import RefBox, { type Ref } from '@/components/admin/RefBox'
import AgentTimeline, { type RunStep } from '@/components/admin/AgentTimeline'

interface Draft {
  id: string; kind?: 'post' | 'poll'; poll?: { question: string; options: string[]; duration: string }; topic: string; status: 'draft' | 'approved' | 'published'; text: string; imagePrompt: string; hasImage: boolean
  createdAt: string; published: { as: string; at: string }[]
  references?: Ref[]; publishedText?: string
  motion?: { scene: Record<string, unknown>; seconds: number; hasMp4: boolean }
  trace?: { agent: string; label: string; output: string; usd: number }[]
  review?: { verdict: string; notes: string[] }
}

const usd = (n: number) => `$${n < 1 ? n.toFixed(3) : n.toFixed(2)}`
const BADGE = { draft: 'bg-amber-100 text-amber-800', approved: 'bg-gray-100 text-gray-700', published: 'bg-emerald-100 text-emerald-800' }
const POST_CHIPS = ['Make it shorter', 'Stronger first line', 'More practical, less salesy', 'Add a clear call to action', 'Rewrite the hashtags', 'More formal tone']
const IMAGE_CHIPS = ['Simpler composition', 'Brighter colours', 'More abstract', 'Show people collaborating']
const field = 'w-full text-sm border border-gray-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 bg-white'

export default function SocialStudioPage() {
  const [drafts, setDrafts] = useState<Draft[] | null>(null)
  const [spend, setSpend] = useState<{ total: number; month: number; byDraft: Record<string, number>; entries: { draftId: string; at: string; label: string; usd: number }[] }>({ total: 0, month: 0, byDraft: {}, entries: [] })
  const [sel, setSel] = useState('')
  const [topic, setTopic] = useState('')
  const [brief, setBrief] = useState('')
  const [kind, setKind] = useState<'post' | 'poll' | 'webinar'>('post')
  const [wb, setWb] = useState({ title: '', when: '', link: 'https://www.gennoor.com/webinars', startsAt: '', endsAt: '' })
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [imgV, setImgV] = useState(0)
  const [rev, setRev] = useState('')
  const [pendingRefs, setPendingRefs] = useState<Ref[]>([])
  const [refUrl, setRefUrl] = useState('')
  const [zoom, setZoom] = useState<{ id: string; kind: 'image' | 'motion'; hasMp4: boolean } | null>(null)
  const [zoomVideo, setZoomVideo] = useState(false)
  const [anim, setAnim] = useState({ motion: 'zoom-in', seconds: 6, caption: '' })
  const [postMedia, setPostMedia] = useState<'gif' | 'video' | 'still'>('gif')
  const [team, setTeam] = useState(false)
  const [teamOut, setTeamOut] = useState<'post' | 'motion'>('post')
  const [run, setRun] = useState<{ steps: RunStep[]; error: string; done: boolean } | null>(null)
  const [sceneText, setSceneText] = useState('')
  const [sceneFor, setSceneFor] = useState('')
  const [imgRev, setImgRev] = useState('')

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/social')
    if (!r.ok) { setError(`Could not load (${r.status})`); return }
    const j = await r.json()
    setDrafts(j.drafts)
    if (j.spend) setSpend(j.spend)
  }, [])
  useEffect(() => { load() }, [load])
  // "Resume" links from the Sessions page and the autopilot open a specific draft.
  useEffect(() => { const q = new URLSearchParams(window.location.search).get('draft'); if (q) setSel(q) }, [])

  const cur = drafts?.find(d => d.id === sel)
  const patchLocal = (id: string, p: Partial<Draft>) => setDrafts(ds => ds && ds.map(d => (d.id === id ? { ...d, ...p } : d)))

  async function call(label: string, url: string, init?: RequestInit) {
    setBusy(label); setError(''); setNotice('')
    const r = await fetch(url, init)
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (['create', 'revise', 'image'].includes(label)) load()
    if (!r.ok && !j.done?.length) setError(j.errors?.join(' · ') || j.error || `Failed (${r.status})`)
    else if (j.errors?.length) setError(j.errors.join(' · '))
    return j
  }
  const json = (body: unknown): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

  async function create() {
    const withRefs = (b: Record<string, unknown>, refIds: string[]) => ({ ...b, refIds })
    const j = await call('create', '/api/admin/social', json(withRefs(kind === 'webinar'
      ? { topic: `Webinar announcement: ${wb.title}`, brief: `Invite people to register for a free webinar. Title: ${wb.title}. When: ${wb.when}. Registration link (include it in the post): ${wb.link}. ${brief}`.trim(), kind: 'post' }
      : { topic, brief, kind }, pendingRefs.map(r => r.id))))
    if (j.draft) { setTopic(''); setBrief(''); setPendingRefs([]); await load(); setSel(j.draft.id) }
  }
  async function addRef(src: { file?: File; url?: string }, attach: boolean) {
    setBusy('ref'); setError('')
    const init: RequestInit = src.file
      ? { method: 'POST', body: (() => { const f = new FormData(); f.append('file', src.file!); if (attach && cur) f.append('draftId', cur.id); return f })() }
      : json({ url: src.url, ...(attach && cur ? { draftId: cur.id } : {}) })
    const r = await fetch('/api/admin/social/references', init)
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok) { setError(j.error || `Could not add reference (${r.status})`); return }
    if (attach && j.draft && cur) patchLocal(cur.id, { references: j.draft.references })
    else if (j.ref) setPendingRefs(p => [...p, j.ref])
    setRefUrl('')
  }
  async function removeRef(id: string) {
    if (!cur) return
    const j = await call('save', `/api/admin/social/${cur.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ removeRef: id }) })
    if (j.draft) patchLocal(cur.id, { references: j.draft.references || [] })
  }
  async function runTeam() {
    const body = kind === 'webinar'
      ? { topic: `Webinar announcement: ${wb.title}`, brief: `Invite people to register for a free webinar. Title: ${wb.title}. When: ${wb.when}. Registration link (include it in the post): ${wb.link}. ${brief}`.trim() }
      : { topic, brief }
    setBusy('team'); setError(''); setNotice(''); setSel('')
    setRun({ steps: [], error: '', done: false })
    const upd = (agent: string, label: string, f: (s: RunStep) => Partial<RunStep>) => setRun(r => {
      if (!r) return r
      const i = r.steps.findIndex(s => s.agent === agent)
      const base: RunStep = i >= 0 ? r.steps[i] : { agent, label, status: 'running', output: '', live: '', usd: 0 }
      const next = { ...base, ...f(base) }
      return { ...r, steps: i >= 0 ? r.steps.map((s, k) => (k === i ? next : s)) : [...r.steps, next] }
    })
    try {
      const res = await fetch('/api/admin/social/agent', json({ ...body, mode: teamOut, refIds: pendingRefs.map(r => r.id) }))
      if (!res.ok || !res.body) { const j = await res.json().catch(() => ({})); throw new Error(j.error || `Failed (${res.status})`) }
      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = ''
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
            setTopic(''); setBrief(''); setPendingRefs([])
            await load(); setSel(ev.draftId); setRun(null)
            setNotice(`The team finished${ev.review?.verdict === 'revise' ? ' and the reviewer suggests changes' : ''}. Review the draft below.`)
          }
        }
      }
    } catch (e: any) {
      setRun(r => (r ? { ...r, error: e?.message || 'The agent run failed.' } : r))
    }
    setBusy('')
    setRun(r => (r ? { ...r, done: true } : r))
  }
  async function animate() {
    if (!cur) return
    await save()
    const j = await call('animate', `/api/admin/social/${cur.id}/animate`, json(anim))
    if (j.draft) { patchLocal(cur.id, j.draft); setImgV(v => v + 1); setNotice('Image animated. Click the preview to see it full size.') }
  }
  async function rerender() {
    if (!cur) return
    let scene
    try { scene = JSON.parse(sceneText) } catch { setError('The scene is not valid JSON.'); return }
    const j = await call('rerender', `/api/admin/social/${cur.id}/motion`, json({ scene }))
    if (j.draft) { patchLocal(cur.id, j.draft); setImgV(v => v + 1); setNotice('Motion graphic re-rendered.') }
  }
  async function createEvent() {
    const j = await call('event', '/api/admin/linkedin/event', json({ title: wb.title, url: wb.link, startsAt: new Date(wb.startsAt).toISOString(), endsAt: new Date(wb.endsAt).toISOString(), description: `${wb.when}` }))
    if (j.ok) setNotice(`LinkedIn Event created (id ${j.eventId}).`)
  }
  async function save(status?: 'draft' | 'approved') {
    if (!cur) return
    const j = await call('save', `/api/admin/social/${cur.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: cur.text, imagePrompt: cur.imagePrompt, poll: cur.poll, ...(status ? { status } : {}) }) })
    if (j.draft) { patchLocal(cur.id, j.draft); setNotice(status === 'approved' ? 'Approved. Ready to post.' : 'Saved.') }
  }
  async function revise(instruction: string, target: 'post' | 'image') {
    if (!cur || !instruction.trim()) return
    await save()
    const j = await call('revise', `/api/admin/social/${cur.id}/revise`, json({ instruction, target }))
    if (j.draft) {
      patchLocal(cur.id, j.draft)
      if (target === 'image') { setImgRev(''); setNotice('Image prompt revised. Press Regenerate image to see it.') }
      else { setRev(''); setNotice('Revised. Review the preview, then approve.') }
    }
  }
  async function image() {
    if (!cur) return
    await save()
    const j = await call('image', `/api/admin/social/${cur.id}/image`, { method: 'POST' })
    if (j.draft) { patchLocal(cur.id, j.draft); setImgV(v => v + 1) }
  }
  async function publish(as: ('member' | 'organization')[], mode: 'new' | 'update' = 'new') {
    if (!cur) return
    await save()
    const j = await call('publish', `/api/admin/social/${cur.id}/publish`, json({ as, mode, republish: cur.published.length > 0, media: cur.motion ? postMedia : 'still' }))
    if (j.done?.length) setNotice(`Posted (${j.done.join(', ')}).`)
    if (j.updated?.length) setNotice(`Live post updated (${j.updated.join(', ')}).`)
    load()
  }
  async function remove() {
    if (!cur || !confirm('Delete this draft?')) return
    await call('delete', `/api/admin/social/${cur.id}`, { method: 'DELETE' })
    setSel(''); load()
  }

  const locked = false
  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoom(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [zoom])
  const published = cur?.status === 'published'
  const edited = !!cur && published && cur.text !== (cur.publishedText ?? cur.text)
  const btn = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-md border border-gray-200 bg-white hover:border-gray-400 disabled:opacity-40'
  const primary = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40'
  const chip = 'px-2 py-1 text-xs rounded-full border border-gray-200 bg-white text-gray-700 hover:border-gray-500 hover:text-gray-900 disabled:opacity-40'
  const step = cur ? (cur.status === 'draft' ? 1 : cur.status === 'approved' ? 2 : 3) : 0

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-lg font-semibold">Social studio<InfoTip text="Draft, revise, illustrate and review a post exactly as it will appear, then approve and publish. Nothing goes to LinkedIn until you approve and click Post." /></h1>
        <div className="flex flex-wrap items-center gap-3 text-sm"><span title="Estimated Azure AI spend on this studio (drafts, revisions, images)" className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-700">This month <b>{usd(spend.month)}</b> · All time <b>{usd(spend.total)}</b></span><Link href="/admin/linkedin" className="text-gray-600 hover:underline">LinkedIn connection</Link><Link href="/admin" className="text-gray-600 hover:underline">← Admin</Link></div>
      </div>
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}

      <div className="grid lg:grid-cols-[270px_1fr] gap-4 items-start">
        {/* Left: new draft + list */}
        <div className="space-y-3">
          <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2 text-xs">
              {(['post', 'poll', 'webinar'] as const).map(k => (
                <button key={k} onClick={() => setKind(k)} className={`px-2.5 py-1 rounded-md border ${kind === k ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 hover:border-gray-400'}`}>{k === 'post' ? 'Post + image' : k === 'poll' ? 'Poll' : 'Webinar'}</button>
              ))}
              <InfoTip text="Post + image: text with an AI illustration. Poll: a native LinkedIn poll with a short intro. Webinar: type the title, date and link and the AI writes the announcement." />
            </div>
            {kind === 'webinar' ? (
              <div className="space-y-2 mb-2">
                <input value={wb.title} onChange={e => setWb({ ...wb, title: e.target.value })} placeholder="Webinar title" className={field} />
                <input value={wb.when} onChange={e => setWb({ ...wb, when: e.target.value })} placeholder="When, e.g. Sat 15 Nov, 7 PM IST" className={field} />
                <input value={wb.link} onChange={e => setWb({ ...wb, link: e.target.value })} placeholder="Registration link" className={field} />
                <div className="text-xs text-gray-500 pt-1">LinkedIn Event (optional)<InfoTip text="Also creates an official LinkedIn Event on the Gennoor page that points to your registration link. Needs the company page connected through the second LinkedIn app. Times use your browser's timezone." /></div>
                <input type="datetime-local" value={wb.startsAt} onChange={e => setWb({ ...wb, startsAt: e.target.value })} className={field} />
                <input type="datetime-local" value={wb.endsAt} onChange={e => setWb({ ...wb, endsAt: e.target.value })} className={field} />
                <button disabled={!wb.title.trim() || !wb.startsAt || !wb.endsAt || !!busy} onClick={createEvent} className={`${btn} w-full justify-center`}>{busy === 'event' ? 'Creating…' : 'Create LinkedIn Event'}</button>
              </div>
            ) : (
              <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic, e.g. Claude Code for finance teams" className={`${field} mb-2`} />
            )}
            <textarea value={brief} onChange={e => setBrief(e.target.value)} placeholder="Notes for the agent (optional)" rows={2} className={`${field} mb-2`} />
            <RefBox refs={pendingRefs} busy={busy === 'ref'} url={refUrl} setUrl={setRefUrl} onUrl={() => addRef({ url: refUrl }, false)} onFile={f => addRef({ file: f }, false)} onRemove={id => setPendingRefs(p => p.filter(r => r.id !== id))} />
            {kind !== 'poll' && (
              <div className="mb-2 rounded-lg border border-gray-200 bg-gray-50 p-2">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer"><input type="checkbox" checked={team} onChange={e => setTeam(e.target.checked)} /><Bot className="w-3.5 h-3.5 text-gray-500" />Use the AI agent team<InfoTip text="Four agents work in order and you watch each step: Research reads your references, Write drafts the post, Design plans the visual, Review checks the draft. Powered by the Microsoft Agent Framework." /></label>
                {team && (
                  <div className="flex gap-1.5 mt-2 text-xs">
                    <button onClick={() => setTeamOut('post')} className={`flex-1 px-2 py-1 rounded-md border ${teamOut === 'post' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 bg-white'}`}>Post + image</button>
                    <button onClick={() => setTeamOut('motion')} className={`flex-1 px-2 py-1 rounded-md border inline-flex items-center justify-center gap-1 ${teamOut === 'motion' ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 bg-white'}`}><Film className="w-3 h-3" />Motion graphic</button>
                  </div>
                )}
              </div>
            )}
            <button disabled={(kind === 'webinar' ? !wb.title.trim() || !wb.when.trim() : !topic.trim()) || !!busy} onClick={team && kind !== 'poll' ? runTeam : create} className={`${primary} w-full justify-center`}>
              {team && kind !== 'poll' ? <Bot className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}{busy === 'create' ? 'Writing…' : busy === 'team' ? 'Team working…' : team && kind !== 'poll' ? 'Run the team' : 'Draft with AI'}
            </button>
          </div>
          {!drafts ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
            <ul className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden shadow-sm">
              {drafts.length === 0 && <li className="p-3 text-sm text-gray-500">No drafts yet.</li>}
              {drafts.map(d => (
                <li key={d.id}>
                  <button onClick={() => { setSel(d.id); setNotice(''); setError('') }} className={`w-full text-left px-3 py-2 hover:bg-gray-50 border-l-2 ${sel === d.id ? 'bg-gray-100 border-gray-800' : 'border-transparent'}`}>
                    <div className="text-[13px] font-medium truncate">{d.topic}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${BADGE[d.status]}`}>{d.status}</span>
                      <span className="text-xs text-gray-400">{d.kind === 'poll' ? 'poll' : 'post'} · {new Date(d.createdAt).toLocaleDateString()}</span>
                      <span className="text-xs text-gray-500 ml-auto">{usd(spend.byDraft[d.id] || 0)}</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: composer */}
        {run ? <AgentTimeline run={run} onClose={() => setRun(null)} /> : !cur ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 text-sm text-gray-500 p-10 text-center">Pick a draft on the left, or give the agent a topic.</div>
        ) : (
          <div className="space-y-3">
            {/* progress */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {['Draft & revise', 'Approve', 'Published'].map((l, i) => (
                <div key={l} className="flex items-center gap-2">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold ${step > i + 1 || (step === 3 && i === 2) ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-500'}`}>{step > i + 1 ? <Check className="w-3 h-3" /> : i + 1}</span>
                  <span className={step === i + 1 ? 'text-gray-900 font-medium' : ''}>{l}</span>
                  {i < 2 && <span className="w-8 h-px bg-gray-300" />}
                </div>
              ))}
            </div>

            <div className="grid xl:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start">
              {/* LinkedIn-style card, edited in place */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-11 h-11 rounded-full bg-gray-800 text-white text-lg font-bold flex items-center justify-center">G</div>
                  <div className="leading-tight"><div className="text-sm font-semibold">Gennoor Tech</div><div className="text-xs text-gray-500">Enterprise AI &amp; Microsoft training · Just now · 🌐</div></div>
                  <span className={`ml-auto text-xs px-2 py-0.5 rounded ${BADGE[cur.status]}`}>{cur.status}</span>
                </div>
                <textarea disabled={locked} value={cur.text} onChange={e => patchLocal(cur.id, { text: e.target.value })} rows={Math.min(24, Math.max(8, cur.text.split('\n').length + Math.ceil(cur.text.length / 90)))}
                  className="w-full text-[14px] leading-relaxed text-gray-900 border border-transparent hover:border-gray-200 focus:border-blue-400 focus:outline-none rounded-md p-1.5 -mx-1.5 resize-y bg-transparent" />
                <div className="text-xs text-gray-400 text-right">{cur.text.length}/3000 · click the text to edit it directly</div>

                {cur.kind === 'poll' && cur.poll && (
                  <div className="mt-3 rounded-lg border border-gray-200 p-3 space-y-2">
                    <input disabled={locked} value={cur.poll.question} maxLength={140} onChange={e => patchLocal(cur.id, { poll: { ...cur.poll!, question: e.target.value } })} className={`${field} font-semibold`} />
                    {cur.poll.options.map((o, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input disabled={locked} value={o} maxLength={30} placeholder={`Option ${i + 1}`} onChange={e => patchLocal(cur.id, { poll: { ...cur.poll!, options: cur.poll!.options.map((x, j) => (j === i ? e.target.value : x)) } })} className={`${field} rounded-full text-center text-blue-700 border-blue-400`} />
                        {!locked && cur.poll!.options.length > 2 && <button title="Remove option" onClick={() => patchLocal(cur.id, { poll: { ...cur.poll!, options: cur.poll!.options.filter((_, j) => j !== i) } })} className="text-gray-400 hover:text-red-600 text-sm">✕</button>}
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-xs pt-1">
                      {cur.poll.options.length < 4 && !locked && <button className={btn} onClick={() => patchLocal(cur.id, { poll: { ...cur.poll!, options: [...cur.poll!.options, ''] } })}>+ Add option</button>}
                      <select disabled={locked} value={cur.poll.duration} onChange={e => patchLocal(cur.id, { poll: { ...cur.poll!, duration: e.target.value } })} className="border border-gray-200 rounded-md px-2 py-1.5 bg-white">
                        <option value="ONE_DAY">Poll lasts 1 day</option><option value="THREE_DAYS">Poll lasts 3 days</option><option value="SEVEN_DAYS">Poll lasts 7 days</option><option value="FOURTEEN_DAYS">Poll lasts 14 days</option>
                      </select>
                      <InfoTip text="Question up to 140 characters, 2 to 4 options of up to 30 characters each." />
                    </div>
                  </div>
                )}

                {cur.kind !== 'poll' && (
                  <div className="mt-3">
                    {cur.motion
                      /* eslint-disable-next-line @next/next/no-img-element */
                      ? <button type="button" onClick={() => { setZoomVideo(false); setZoom({ id: cur.id, kind: 'motion', hasMp4: cur.motion!.hasMp4 }) }} className="relative block w-full group cursor-zoom-in" title="Click to enlarge"><img src={`/api/admin/social/${cur.id}/motion?v=${imgV}`} alt="" className="rounded-lg w-full border border-gray-100" /><span className="absolute top-2 right-2 rounded-md bg-black/60 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 className="w-3.5 h-3.5" /></span></button>
                      : cur.hasImage
                      /* eslint-disable-next-line @next/next/no-img-element */
                      ? <button type="button" onClick={() => setZoom({ id: cur.id, kind: 'image', hasMp4: false })} className="relative block w-full group cursor-zoom-in" title="Click to enlarge"><img src={`/api/admin/social/${cur.id}/image?v=${imgV}`} alt="" className="rounded-lg w-full border border-gray-100" /><span className="absolute top-2 right-2 rounded-md bg-black/60 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 className="w-3.5 h-3.5" /></span></button>
                      : <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500 py-12 text-center">No image yet. Use "Generate image" on the right.</div>}
                  </div>
                )}
                <div className="mt-3 pt-2 border-t border-gray-100 flex gap-5 text-[13px] text-gray-500"><span>👍 Like</span><span>💬 Comment</span><span>🔁 Repost</span><span>✈️ Send</span></div>
              </div>

              {/* Control panel */}
              <div className="space-y-3">
                {!locked && (
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
                    <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-gray-500" />Revise the {cur.kind === 'poll' ? 'poll' : 'post'} with AI<InfoTip text="Tell the AI what to change. It rewrites the draft and sends it back to Draft status so you re-approve." /></div>
                    <div className="flex flex-wrap gap-1.5 mb-2">{POST_CHIPS.map(c => <button key={c} disabled={!!busy} onClick={() => revise(c, 'post')} className={chip}>{c}</button>)}</div>
                    <textarea value={rev} onChange={e => setRev(e.target.value)} rows={3} placeholder="Or type your own change, e.g. mention the 15 Nov date in the first line" className={field} />
                    <button disabled={!rev.trim() || !!busy} onClick={() => revise(rev, 'post')} className={`${primary} w-full justify-center mt-2`}>{busy === 'revise' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Revising…</> : 'Revise with AI'}</button>
                  </div>
                )}

                {cur.kind !== 'poll' && (
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
                    <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5 text-gray-500" />Image<InfoTip text="The instruction sent to the image model (gpt-image-2). Edit it, or ask the AI to adjust it, then Regenerate. Images are text-free by design." /></div>
                    <textarea disabled={locked} value={cur.imagePrompt} onChange={e => patchLocal(cur.id, { imagePrompt: e.target.value })} rows={4} className={`${field} text-xs`} />
                    {!locked && <>
                      <div className="flex flex-wrap gap-1.5 mt-2">{IMAGE_CHIPS.map(c => <button key={c} disabled={!!busy} onClick={() => revise(c, 'image')} className={chip}>{c}</button>)}</div>
                      <div className="flex gap-2 mt-2">
                        <input value={imgRev} onChange={e => setImgRev(e.target.value)} placeholder="Change the image idea…" className={field} />
                        <button disabled={!imgRev.trim() || !!busy} onClick={() => revise(imgRev, 'image')} className={btn}>Apply</button>
                      </div>
                      <button disabled={!!busy || !cur.imagePrompt.trim()} onClick={image} className={`${primary} w-full justify-center mt-2`}>{busy === 'image' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating…</> : cur.hasImage ? <><RotateCcw className="w-3.5 h-3.5" />Regenerate image</> : 'Generate image'}</button>
                      {cur.hasImage && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="text-xs font-semibold mb-1.5 flex items-center gap-1.5"><Film className="w-3.5 h-3.5 text-gray-500" />Animate this image<InfoTip text="Turns the picture into a short looping GIF and MP4 with slow camera motion and an optional caption. Free: no AI call." /></div>
                          <div className="flex gap-1.5">
                            <select value={anim.motion} onChange={e => setAnim({ ...anim, motion: e.target.value })} className="flex-1 min-w-0 text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white">
                              <option value="zoom-in">Slow zoom in</option><option value="zoom-out">Slow zoom out</option><option value="pan-left">Pan left</option><option value="pan-right">Pan right</option>
                            </select>
                            <select value={anim.seconds} onChange={e => setAnim({ ...anim, seconds: Number(e.target.value) })} className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white">
                              {[4, 6, 8, 10].map(s => <option key={s} value={s}>{s}s</option>)}
                            </select>
                          </div>
                          <input value={anim.caption} onChange={e => setAnim({ ...anim, caption: e.target.value })} maxLength={120} placeholder="Caption on the animation (optional)" className="w-full text-xs border border-gray-200 rounded-md px-2 py-1.5 mt-1.5" />
                          <button disabled={!!busy} onClick={animate} className={`${btn} w-full justify-center mt-1.5`}>{busy === 'animate' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Rendering…</> : cur.motion ? 'Re-animate' : 'Animate image'}</button>
                        </div>
                      )}
                    </>}
                  </div>
                )}

                {cur.motion && (
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
                    <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Film className="w-3.5 h-3.5 text-gray-500" />Motion graphic<span className="font-normal text-gray-400">{cur.motion.seconds}s loop</span></div>
                    <textarea value={sceneFor === cur.id ? sceneText : JSON.stringify(cur.motion.scene, null, 1)} onFocus={() => { if (sceneFor !== cur.id) { setSceneFor(cur.id); setSceneText(JSON.stringify(cur.motion!.scene, null, 1)) } }} onChange={e => { setSceneFor(cur.id); setSceneText(e.target.value) }} rows={8} spellCheck={false} className={`${field} font-mono text-xs`} />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <button disabled={!!busy || sceneFor !== cur.id} onClick={rerender} className={primary}>{busy === 'rerender' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Rendering…</> : 'Re-render'}</button>
                      <a href={`/api/admin/social/${cur.id}/motion?type=gif&download=1`} className={btn}><Download className="w-3.5 h-3.5" />GIF</a>
                      {cur.motion.hasMp4 && <a href={`/api/admin/social/${cur.id}/motion?type=mp4&download=1`} className={btn}><Download className="w-3.5 h-3.5" />MP4</a>}
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5">Edit the scene, then Re-render. Free: no AI call. LinkedIn posts the GIF. To change it with AI, use Revise.</div>
                  </div>
                )}
                {(cur.trace?.length || cur.review) && (
                  <details className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 group">
                    <summary className="text-xs font-semibold cursor-pointer flex items-center gap-1.5 list-none"><Bot className="w-3.5 h-3.5 text-gray-500" />How this was made{cur.review && <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${cur.review.verdict === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{cur.review.verdict === 'pass' ? 'review passed' : 'review: changes suggested'}</span>}<ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-open:rotate-180 transition-transform" /></summary>
                    {cur.review?.notes?.length ? <ul className="mt-2 space-y-1 text-xs text-gray-700 list-disc pl-4">{cur.review.notes.map((n, i) => <li key={i} className="break-words">{n}</li>)}</ul> : null}
                    {cur.review?.verdict === 'revise' && !locked && <button disabled={!!busy} onClick={() => revise(`Apply the reviewer's notes: ${cur.review!.notes.join(' ')}`, 'post')} className={`${btn} mt-2`}><Sparkles className="w-3.5 h-3.5" />Apply reviewer notes</button>}
                    <div className="mt-2 space-y-2 max-h-72 overflow-y-auto">
                      {cur.trace?.map((s, i) => (
                        <div key={i} className="text-xs"><div className="font-medium text-gray-700">{s.label} <span className="text-gray-400 font-normal">{usd(s.usd)}</span></div><pre className="whitespace-pre-wrap break-words text-gray-500 font-sans">{s.output.slice(0, 700)}</pre></div>
                      ))}
                    </div>
                  </details>
                )}
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
                  <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5 text-gray-500" />Reference material<InfoTip text="Links, documents and images the AI uses as the factual basis when it writes or revises this post and when it designs the image." /></div>
                  <RefBox refs={cur.references || []} busy={busy === 'ref'} url={refUrl} setUrl={setRefUrl} onUrl={() => addRef({ url: refUrl }, true)} onFile={f => addRef({ file: f }, true)} onRemove={removeRef} />
                </div>
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
                  <div className="text-xs font-semibold mb-1.5 flex items-center justify-between">Cost of this draft<span className="text-sm">{usd(spend.byDraft[cur.id] || 0)}</span></div>
                  <ul className="text-xs text-gray-500 space-y-0.5 max-h-28 overflow-y-auto">
                    {spend.entries.filter(e => e.draftId === cur.id).map((e, i) => <li key={i} className="flex justify-between"><span>{e.label}</span><span>{usd(e.usd)}</span></li>)}
                  </ul>
                  <div className="text-xs text-gray-400 mt-1">Estimate in USD from token usage and image count.</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 space-y-2">
                  {cur.motion && (
                    <div className="flex items-center gap-2 text-xs pb-2 border-b border-gray-100">
                      <span className="text-gray-500">Post to LinkedIn as</span>
                      <div className="flex rounded-md border border-gray-200 overflow-hidden">
                        {([['gif', 'GIF'], ['video', 'Video (MP4)'], ['still', cur.hasImage ? 'Still image' : 'No media']] as const).map(([v, l]) => (
                          <button key={v} disabled={v === 'video' && !cur.motion?.hasMp4} onClick={() => setPostMedia(v)} className={`px-2.5 py-1 disabled:opacity-40 ${postMedia === v ? 'bg-gray-800 text-white' : 'bg-white hover:bg-gray-50'}`}>{l}</button>
                        ))}
                      </div>
                      <InfoTip text="GIF plays silently in the feed. Video (MP4) is uploaded through LinkedIn's video API and can take a minute to process. Still posts the AI image or text only." />
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <button disabled={locked || !!busy} onClick={() => save()} className={btn}><Save className="w-3.5 h-3.5" />Save</button>
                    {cur.status === 'draft' && <button disabled={!!busy || !cur.text.trim()} onClick={() => save('approved')} className={btn}><Check className="w-3.5 h-3.5" />Approve</button>}
                    {cur.status === 'approved' && <button disabled={!!busy} onClick={() => save('draft')} className={btn}>Back to draft</button>}
                    <InfoTip text="Draft = still being edited. Approved = reviewed and ready. Published = on LinkedIn; you can still edit and update or re-post it." />
                    <button disabled={!!busy} onClick={remove} className={`${btn} text-red-700 ml-auto`}><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  {published && (
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <div className="text-xs text-gray-600 flex items-center gap-1.5"><Pencil className="w-3 h-3" />{edited ? 'Edited since it was published. Update the live post or post it again.' : 'Published. You can still edit it, then update the live post or post again.'}</div>
                      <div className="flex gap-2">
                        {cur.published.some(p => p.as === 'member') && <button disabled={!!busy || !edited} onClick={() => publish(['member'], 'update')} className={`${primary} flex-1 justify-center`}>Update my post</button>}
                        {cur.published.some(p => p.as === 'organization') && <button disabled={!!busy || !edited} onClick={() => publish(['organization'], 'update')} className={`${primary} flex-1 justify-center`}>Update page post</button>}
                      </div>
                      <div className="flex gap-2">
                        <button disabled={!!busy} onClick={() => publish(['member'], 'new')} className={`${btn} flex-1 justify-center`}>Post again as me</button>
                        <button disabled={!!busy} onClick={() => publish(['organization'], 'new')} className={`${btn} flex-1 justify-center`}>Post again to page</button>
                      </div>
                      <div className="text-xs text-gray-400">LinkedIn only lets the text of a live post change. To change the image or poll, post again.</div>
                    </div>
                  )}
                  {cur.status === 'approved' && (
                    <div className="flex gap-2 pt-2 border-t border-gray-100">
                      <button disabled={!!busy} onClick={() => publish(['member'])} className={`${primary} flex-1 justify-center`}><Send className="w-3.5 h-3.5" />{busy === 'publish' ? 'Posting…' : 'Post as me'}</button>
                      <button disabled={!!busy} onClick={() => publish(['organization'])} className={`${primary} flex-1 justify-center`}>Post to page</button>
                    </div>
                  )}
                  {cur.status === 'draft' && <div className="text-xs text-gray-500">Approve the draft to unlock posting to LinkedIn.</div>}
                  {cur.published.length > 0 && <div className="text-xs text-emerald-700">Posted: {cur.published.map(p => p.as).join(', ')}</div>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {zoom && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setZoom(null)} role="dialog" aria-modal="true">
          <div className="relative max-w-[min(92vw,900px)] max-h-[92vh] flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            {zoom.kind === 'motion' && zoomVideo
              ? <video src={`/api/admin/social/${zoom.id}/motion?type=mp4&v=${imgV}`} autoPlay loop muted playsInline controls className="rounded-lg max-h-[80vh] max-w-full bg-black" />
              /* eslint-disable-next-line @next/next/no-img-element */
              : <img src={zoom.kind === 'motion' ? `/api/admin/social/${zoom.id}/motion?v=${imgV}` : `/api/admin/social/${zoom.id}/image?v=${imgV}`} alt="" className="rounded-lg max-h-[80vh] max-w-full object-contain bg-black" />}
            <div className="flex items-center gap-2">
              {zoom.kind === 'motion' && zoom.hasMp4 && (
                <div className="flex rounded-md overflow-hidden border border-white/30 text-xs">
                  <button onClick={() => setZoomVideo(false)} className={`px-3 py-1.5 ${!zoomVideo ? 'bg-white text-gray-900' : 'text-white'}`}>GIF</button>
                  <button onClick={() => setZoomVideo(true)} className={`px-3 py-1.5 ${zoomVideo ? 'bg-white text-gray-900' : 'text-white'}`}>MP4</button>
                </div>
              )}
              <a href={zoom.kind === 'motion' ? `/api/admin/social/${zoom.id}/motion?type=${zoomVideo ? 'mp4' : 'gif'}&download=1` : `/api/admin/social/${zoom.id}/image`} download className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-white/30 text-white hover:bg-white/10"><Download className="w-3.5 h-3.5" />Download</a>
            </div>
            <button onClick={() => setZoom(null)} aria-label="Close" className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 shadow flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  )
}
