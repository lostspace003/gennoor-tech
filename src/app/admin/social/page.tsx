'use client'

import { ResizeGrid } from '@/components/admin/SplitPane'
import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, Hand, Sparkles, ImageIcon, Check, Send, Trash2, Save, RotateCcw, Paperclip, Link2, FileText, X, Pencil, Bot, Film, Download, ChevronDown, Maximize2, Clock } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'
import DraftList, { Fold, type DraftRow } from '@/components/admin/DraftList'
import RefBox, { type Ref } from '@/components/admin/RefBox'
import AgentTimeline, { type RunStep } from '@/components/admin/AgentTimeline'
import { StepLogButton } from '@/components/admin/StepLogModal'
import CarouselPanel from '@/components/admin/CarouselPanel'

interface Draft {
  id: string; kind?: 'post' | 'poll'; poll?: { question: string; options: string[]; duration: string }; topic: string; status: 'draft' | 'approved' | 'published'; text: string; imagePrompt: string; hasImage: boolean
  createdAt: string; published: { as: string; at: string }[]
  scheduled?: { at: string; as: ('member' | 'organization')[]; media: string; state: 'pending' | 'publishing' | 'failed'; tries: number; error?: string }
  references?: Ref[]; publishedText?: string
  motion?: { scene: Record<string, unknown>; seconds: number }
  trace?: { agent: string; label: string; output: string; usd: number }[]
  review?: { verdict: string; notes: string[] }
}

const usd = (n: number) => `$${n < 1 ? n.toFixed(3) : n.toFixed(2)}`
interface Task { id: string; at: string; kind: 'post' | 'poll' | 'motion'; manual?: boolean; draftId?: string; topic?: { title: string; angle: string; vendor?: string; heat?: number; sources: { title: string; url: string }[] } }
const KIND_LABEL = { post: 'Post', poll: 'Poll', motion: 'Post' }
/** Where a slot you took over stands, read from its Social Studio draft. */
function taskState(t: Task, drafts: Draft[] | null): { label: string; tone: string; todo: boolean } {
  if (!t.draftId) return { label: 'to write', tone: 'bg-amber-100 text-amber-800', todo: true }
  const d = drafts?.find(x => x.id === t.draftId)
  if (!d) return { label: 'draft missing', tone: 'bg-gray-100 text-gray-600', todo: false }
  if (d.status === 'published') return { label: 'posted', tone: 'bg-emerald-100 text-emerald-800', todo: false }
  if (d.scheduled) return { label: 'scheduled', tone: 'bg-blue-100 text-blue-800', todo: false }
  return d.status === 'approved' ? { label: 'to post', tone: 'bg-amber-100 text-amber-800', todo: true } : { label: 'to approve', tone: 'bg-amber-100 text-amber-800', todo: true }
}
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
  const [kind, setKind] = useState<'post' | 'poll' | 'webinar' | 'carousel'>('post')
  const [wb, setWb] = useState({ title: '', when: '', link: 'https://www.gennoor.com/webinars', startsAt: '', endsAt: '' })
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [imgV, setImgV] = useState(0)
  const [rev, setRev] = useState('')
  const [pendingRefs, setPendingRefs] = useState<Ref[]>([])
  const [refUrl, setRefUrl] = useState('')
  const [zoom, setZoom] = useState<{ id: string; kind: 'image' | 'motion' } | null>(null)
  const [anim, setAnim] = useState({ motion: 'zoom-in', seconds: 6, caption: '' })
  const [postMedia, setPostMedia] = useState<'gif' | 'still'>('gif')
  const [team, setTeam] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  const [when, setWhen] = useState('') // datetime-local value; empty = post now
  const [teamOut, setTeamOut] = useState<'post' | 'motion'>('post')
  const [run, setRun] = useState<{ steps: RunStep[]; error: string; done: boolean } | null>(null)
  const [sceneText, setSceneText] = useState('')
  const [sceneFor, setSceneFor] = useState('')
  const [imgRev, setImgRev] = useState('')
  // Autopilot slots you said you'd handle: they live here until you write and post them.
  const [tasks, setTasks] = useState<Task[]>([])
  const [task, setTask] = useState('')

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/social')
    if (!r.ok) { setError(`Could not load (${r.status})`); return }
    const j = await r.json()
    setDrafts(j.drafts)
    if (j.spend) setSpend(j.spend)
  }, [])
  useEffect(() => { load() }, [load])
  const loadTasks = useCallback(async () => {
    const from = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)
    const r = await fetch(`/api/admin/autopilot?from=${from}`).catch(() => null)
    if (!r?.ok) return
    const j = await r.json()
    setTasks((j.days as { slots: Task[] }[]).flatMap(d => d.slots).filter(x => x.manual && x.topic).sort((a, b) => b.at.localeCompare(a.at)))
  }, [])
  useEffect(() => { loadTasks() }, [loadTasks])
  async function removeTask(slotId: string, title: string) {
    if (!confirm(`Remove "${title}" from this list? A draft already written for it stays in your drafts.`)) return
    const r = await fetch('/api/admin/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'remove', slotId }) })
    if (!r.ok) { const j = await r.json().catch(() => ({})); setError(j.error || 'Could not remove it.'); return }
    if (task === slotId) setTask('')
    setNotice('Removed.'); await loadTasks()
  }
  async function linkTask(slotId: string, draftId: string) {
    const r = await fetch('/api/admin/autopilot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'link', slotId, draftId }) })
    if (!r.ok) { const j = await r.json().catch(() => ({})); setError(`The draft was saved, but could not be tied to the autopilot slot: ${j.error || r.status}`) }
    await loadTasks(); setTask('')
  }
  // "Resume" links from the Sessions page and the autopilot open a specific draft.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search)
    if (q.get('draft')) setSel(q.get('draft')!)
    // "Open in Social Studio" from an autopilot slot you took over.
    if (q.get('task')) setTask(q.get('task')!)
  }, [])

  const cur = drafts?.find(d => d.id === sel)
  const curTask = tasks.find(t => t.id === task && !t.draftId)
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

  async function create(over?: { topic: string; brief: string; kind: 'post' | 'poll'; slotId: string }) {
    const topic_ = over?.topic ?? topic, brief_ = over?.brief ?? brief, kind_ = over?.kind ?? kind
    const withRefs = (b: Record<string, unknown>, refIds: string[]) => ({ ...b, refIds })
    const j = await call('create', '/api/admin/social', json(withRefs(kind === 'webinar'
      ? { topic: `Webinar announcement: ${wb.title}`, brief: `Invite people to register for a free webinar. Title: ${wb.title}. When: ${wb.when}. Registration link (include it in the post): ${wb.link}. ${brief}`.trim(), kind: 'post' }
      : { topic: topic_, brief: brief_, kind: kind_ }, over ? [] : pendingRefs.map(r => r.id))))
    if (j.draft) {
      if (!over) { setTopic(''); setBrief(''); setPendingRefs([]) }
      await load(); setSel(j.draft.id)
      if (over) await linkTask(over.slotId, j.draft.id)
    }
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
  async function runTeam(over?: { topic: string; brief: string; mode: 'post' | 'motion'; slotId: string }) {
    const startedAt = Date.now()
    const body = over ? { topic: over.topic, brief: over.brief } : kind === 'webinar'
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
      const res = await fetch('/api/admin/social/agent', json({ ...body, mode: over?.mode ?? teamOut, refIds: over ? [] : pendingRefs.map(r => r.id) }))
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
            if (!over) { setTopic(''); setBrief(''); setPendingRefs([]) }
            if (over) await linkTask(over.slotId, ev.draftId)
            try { await load() } catch { /* the list refreshes by itself shortly */ }
            setSel(ev.draftId); setRun(null)
            setNotice(`The team finished${ev.review?.verdict === 'revise' ? ' and the reviewer suggests changes' : ''}. Review the draft below.`)
          }
        }
      }
    } catch (e: any) {
      // The connection can drop after the team has finished and saved the draft; look for it before reporting a failure.
      const id = await recoverDraft(startedAt)
      if (id && over) await linkTask(over.slotId, id)
      if (id) { setSel(id); setRun(null); setNotice('The connection dropped, but your draft was saved. Review it below.') }
      else setRun(r => (r ? { ...r, error: `${e?.message || 'The agent run failed.'} If you do not see the draft in the list on the left within a minute, run it again.` } : r))
    }
    setBusy('')
    setRun(r => (r ? { ...r, done: true } : r))
  }
  async function recoverDraft(since: number): Promise<string | null> {
    for (let i = 0; i < 10; i++) {
      try {
        const r = await fetch('/api/admin/social')
        if (r.ok) {
          const j = await r.json()
          const hit = (j.drafts as Draft[]).find(d => Date.parse(d.createdAt) >= since - 10_000)
          if (hit) { setDrafts(j.drafts); if (j.spend) setSpend(j.spend); return hit.id }
        }
      } catch { /* try again */ }
      await new Promise(r => setTimeout(r, 6000))
    }
    return null
  }
  async function formatPost() {
    if (!cur) return
    await save()
    const j = await call('format', `/api/admin/social/${cur.id}/format`, { method: 'POST' })
    if (j.draft) { patchLocal(cur.id, j.draft); setNotice('Formatted for LinkedIn: bold opening line, short paragraphs, tidy bullets and hashtags.') }
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
  async function uploadImage(file: File | undefined) {
    if (!cur || !file) return
    const fd = new FormData(); fd.append('file', file)
    const j = await call('image', `/api/admin/social/${cur.id}/image`, { method: 'PUT', body: fd })
    if (j.draft) { patchLocal(cur.id, j.draft); setImgV(v => v + 1); setNotice('Your image is attached with the Gennoor logo strip.') }
  }
  async function publish(as: ('member' | 'organization')[], mode: 'new' | 'update' = 'new') {
    if (!cur) return
    await save()
    const scheduleAt = when && mode === 'new' ? new Date(when).toISOString() : undefined
    const j = await call('publish', `/api/admin/social/${cur.id}/publish`, json({ as, mode, scheduleAt, republish: cur.published.length > 0, media: cur.motion ? postMedia : 'still' }))
    if (j.scheduled) { setNotice(`Scheduled for ${new Date(j.scheduled.at).toLocaleString()}. It posts itself then.`); setWhen('') }
    if (j.done?.length) setNotice(`Posted (${j.done.join(', ')}).`)
    if (j.updated?.length) setNotice(`Live post updated (${j.updated.join(', ')}).`)
    load()
  }
  async function cancelSchedule() {
    if (!cur) return
    await call('publish', `/api/admin/social/${cur.id}/publish`, json({ cancelSchedule: true }))
    setNotice('Schedule cancelled.'); load()
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
    <div className="w-full h-full flex flex-col p-4 lg:p-5">
      <div className="shrink-0 flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold tracking-tight">Social studio<InfoTip text="Draft, revise, illustrate and review a post exactly as it will appear, then approve and publish. Nothing goes to LinkedIn until you approve and click Post." /></h1>
        <div className="flex flex-wrap items-center gap-3 text-sm"><span title="Estimated Azure AI spend on this studio (drafts, revisions, images)" className="px-2.5 py-1 rounded-full bg-gray-100 text-xs text-gray-700">This month <b>{usd(spend.month)}</b> · All time <b>{usd(spend.total)}</b></span><Link href="/admin/linkedin" className="text-gray-600 hover:underline">LinkedIn connection</Link></div>
      </div>
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}

      {/* Workspace: drafts | post | tools. Each pane scrolls on its own, so the post and its actions never get lost off screen. */}
      <ResizeGrid id="social-main" initial={300} className="flex-1 min-h-0">
        {/* Left: new draft + list */}
        <div className="space-y-3 min-h-0 lg:overflow-y-auto lg:pr-1">
          <Fold title="New post" icon={<Sparkles className="w-3.5 h-3.5 text-gray-500" />} open={newOpen || (!!drafts && drafts.length === 0)} onToggle={() => setNewOpen(o => !o)}>
            <div className="flex items-center gap-1.5 mb-2 text-xs">
              {(['post', 'poll', 'webinar', 'carousel'] as const).map(k => (
                <button key={k} onClick={() => setKind(k)} className={`px-2.5 py-1 rounded-md border ${kind === k ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 hover:border-gray-400'}`}>{k === 'post' ? 'Post + image' : k === 'poll' ? 'Poll' : k === 'webinar' ? 'Webinar' : 'Carousel'}</button>
              ))}
              <InfoTip text="Post + image: text with an AI illustration. Poll: a native LinkedIn poll with a short intro. Webinar: type the title, date and link and the AI writes the announcement. Carousel: swipeable card PDF written from a topic or web page." />
            </div>
            {kind === 'carousel' && <CarouselPanel />}
            <div className={kind === 'carousel' ? 'hidden' : undefined}>
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
                  </div>
                )}
              </div>
            )}
            <button disabled={(kind === 'webinar' ? !wb.title.trim() || !wb.when.trim() : !topic.trim()) || !!busy} onClick={() => (team && kind !== 'poll' ? runTeam() : create())} className={`${primary} w-full justify-center`}>
              {team && kind !== 'poll' ? <Bot className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}{busy === 'create' ? 'Writing…' : busy === 'team' ? 'Team working…' : team && kind !== 'poll' ? 'Run the team' : 'Draft with AI'}
            </button>
            </div>
          </Fold>
          {tasks.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold mb-2"><Hand className="w-3.5 h-3.5 text-gray-500" />Handled by you<span className="font-normal text-gray-500">· {tasks.filter(t => taskState(t, drafts).todo).length} to do</span><InfoTip text="Autopilot posts you said you'd handle. Click one to see what it is about and write it. The autopilot never posts these." /></div>
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {tasks.map(t => { const st = taskState(t, drafts); return (
                  <div key={t.id} className="relative">
                  <button onClick={() => { setError(''); setNotice(''); if (t.draftId) { setSel(t.draftId); setTask('') } else { setSel(''); setTask(t.id) } }}
                    className={`w-full text-left rounded-md border px-2.5 py-2 ${(t.draftId ? sel === t.draftId : task === t.id) ? 'border-gray-800 bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                    <div className="text-[13px] font-medium leading-snug line-clamp-2">{t.topic!.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-gray-500">
                      <span className={`px-1.5 py-0.5 rounded ${st.tone}`}>{st.label}</span>
                      <span>{KIND_LABEL[t.kind]} · {new Date(t.at).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </button>
                  <button title="Remove from this list" onClick={() => removeTask(t.id, t.topic!.title)} className="absolute top-1.5 right-1.5 p-1 rounded text-gray-400 hover:text-red-700 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                ) })}
              </div>
            </div>
          )}
          {!drafts ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
            <DraftList noun="post" selectedId={sel} onSelect={id => { setSel(id); setTask(''); setNotice(''); setError('') }}
              filters={[{ key: 'draft', label: 'Drafts' }, { key: 'approved', label: 'Approved' }, { key: 'scheduled', label: 'Scheduled' }, { key: 'published', label: 'Published' }]}
              rows={drafts.map((d): DraftRow => ({
                id: d.id, title: d.topic, date: d.createdAt,
                group: d.scheduled && d.status !== 'published' ? 'scheduled' : d.status,
                badge: d.scheduled ? { label: d.scheduled.state === 'failed' ? 'schedule failed' : `scheduled ${new Date(d.scheduled.at).toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`, tone: d.scheduled.state === 'failed' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800' } : { label: d.status, tone: BADGE[d.status] },
                meta: [d.kind === 'poll' ? 'poll' : 'post', new Date(d.createdAt).toLocaleDateString()], right: usd(spend.byDraft[d.id] || 0),
              }))} />
          )}
        </div>

        {/* Right: composer */}
        {run ? <AgentTimeline run={run} onClose={() => setRun(null)} /> : !cur && curTask ? (
          <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 lg:overflow-y-auto">
            <div className="flex items-center gap-2 text-xs text-gray-500"><Hand className="w-3.5 h-3.5" />Autopilot slot you are handling · {KIND_LABEL[curTask.kind]} · {new Date(curTask.at).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
            <h2 className="text-lg font-semibold leading-snug">{curTask.topic!.title}</h2>
            {curTask.topic!.vendor && <div className="text-xs text-gray-500">{curTask.topic!.vendor}{curTask.topic!.heat ? ` · buzz ${curTask.topic!.heat}/10` : ''}</div>}
            {curTask.topic!.angle && <div><div className="text-xs font-semibold text-gray-500 mb-1">Planned angle</div><p className="text-sm text-gray-700">{curTask.topic!.angle}</p></div>}
            {(curTask.topic!.sources || []).length > 0 && <div><div className="text-xs font-semibold text-gray-500 mb-1">Sources</div><ul className="space-y-1">{curTask.topic!.sources.map(x => <li key={x.url}><a href={x.url} target="_blank" rel="noreferrer" className="text-sm text-blue-700 hover:underline break-words">{x.title || x.url}</a></li>)}</ul></div>}
            <div className="rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-900 p-3">Nothing is written yet. Write it here, then approve and post it like any other draft. The autopilot will not post this one.</div>
            <button disabled={!!busy} className={primary} onClick={() => {
              const t = curTask
              const brief_ = [t.topic!.angle, ...(t.topic!.sources || []).slice(0, 3).map(x => x.url)].filter(Boolean).join('\n')
              if (t.kind === 'poll') create({ topic: t.topic!.title, brief: brief_, kind: 'poll', slotId: t.id })
              else runTeam({ topic: t.topic!.title, brief: brief_, mode: 'post', slotId: t.id })
            }}>{busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}{curTask.kind === 'poll' ? 'Write the poll' : 'Write it with AI'}</button>
          </div>
        ) : !cur ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white/50 text-sm text-gray-500 p-10 text-center">Pick a draft on the left, or give the agent a topic.</div>
        ) : (
          <div className="flex flex-col gap-3 min-h-0">
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

            <ResizeGrid id="social-post" fixed="second" initial={360} breakpoint={1280} className="flex-1 min-h-0">
              {/* LinkedIn-style card, edited in place */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 min-h-0 xl:overflow-y-auto">
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
                      ? <button type="button" onClick={() => setZoom({ id: cur.id, kind: 'motion' })} className="relative block w-full group cursor-zoom-in" title="Click to enlarge"><img src={`/api/admin/social/${cur.id}/motion?v=${imgV}`} alt="" className="rounded-lg w-full border border-gray-100" /><span className="absolute top-2 right-2 rounded-md bg-black/60 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 className="w-3.5 h-3.5" /></span></button>
                      : cur.hasImage
                      /* eslint-disable-next-line @next/next/no-img-element */
                      ? <button type="button" onClick={() => setZoom({ id: cur.id, kind: 'image' })} className="relative block w-full group cursor-zoom-in" title="Click to enlarge"><img src={`/api/admin/social/${cur.id}/image?v=${imgV}`} alt="" className="rounded-lg w-full border border-gray-100" /><span className="absolute top-2 right-2 rounded-md bg-black/60 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 className="w-3.5 h-3.5" /></span></button>
                      : <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-500 py-12 text-center">No image yet. Use "Generate image" on the right.</div>}
                  </div>
                )}
                <div className="mt-3 pt-2 border-t border-gray-100 flex gap-5 text-[13px] text-gray-500"><span>👍 Like</span><span>💬 Comment</span><span>🔁 Repost</span><span>✈️ Send</span></div>
              </div>

              {/* Tools: the action bar is pinned at the top, the rest scrolls beneath it */}
              <div className="flex flex-col gap-3 min-h-0 xl:overflow-y-auto xl:pr-1">
                {!locked && (
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-3">
                    <div className="text-xs font-semibold mb-2 flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-gray-500" />Revise the {cur.kind === 'poll' ? 'poll' : 'post'} with AI<InfoTip text="Tell the AI what to change. It rewrites the draft and sends it back to Draft status so you re-approve." /></div>
                    <button disabled={!!busy || !cur.text.trim()} onClick={formatPost} className={`${btn} w-full justify-center mb-2`} title="Bold opening line, short paragraphs, quiet bullets, a light bulb at most, and a tidy hashtag line. Also applied automatically when the post is published.">{busy === 'format' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Formatting…</> : <><FileText className="w-3.5 h-3.5" />Format for LinkedIn</>}</button>
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
                      <label className={`${btn} w-full justify-center mt-2 cursor-pointer`}><Paperclip className="w-3.5 h-3.5" />Upload your own image<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => { uploadImage(e.target.files?.[0]); e.target.value = '' }} /></label>
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
                    </div>
                    <div className="text-xs text-gray-400 mt-1.5">Edit the scene, then Re-render. Free: no AI call. LinkedIn posts the GIF. To change it with AI, use Revise.</div>
                  </div>
                )}
                {(cur.trace?.length || cur.review) && (
                  <details className="rounded-xl border border-gray-200 bg-white shadow-sm p-3 group">
                    <summary className="text-xs font-semibold cursor-pointer flex items-center gap-1.5 list-none"><Bot className="w-3.5 h-3.5 text-gray-500" />How this was made{cur.review && <span className={`ml-1 px-1.5 py-0.5 rounded text-xs ${cur.review.verdict === 'pass' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>{cur.review.verdict === 'pass' ? 'review passed' : 'review: changes suggested'}</span>}<ChevronDown className="w-3.5 h-3.5 ml-auto text-gray-400 group-open:rotate-180 transition-transform" /></summary>
                    {cur.review?.notes?.length ? <ul className="mt-2 space-y-1 text-xs text-gray-700 list-disc pl-4">{cur.review.notes.map((n, i) => <li key={i} className="break-words">{n}</li>)}</ul> : null}
                    {cur.review?.verdict === 'revise' && !locked && <button disabled={!!busy} onClick={() => revise(`Apply the reviewer's notes: ${cur.review!.notes.join(' ')}`, 'post')} className={`${btn} mt-2`}><Sparkles className="w-3.5 h-3.5" />Apply reviewer notes</button>}
                    {cur.trace?.length ? <div className="mt-2"><StepLogButton steps={cur.trace} title={`Step logs: ${cur.topic}`} /></div> : null}
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
                <div className="order-first sticky top-0 z-10 rounded-xl border border-gray-200 bg-white shadow-sm p-3 space-y-2">
                  {cur.motion && (
                    <div className="flex items-center gap-2 text-xs pb-2 border-b border-gray-100">
                      <span className="text-gray-500">Post to LinkedIn as</span>
                      <div className="flex rounded-md border border-gray-200 overflow-hidden">
                        {([['gif', 'GIF'], ['still', cur.hasImage ? 'Still image' : 'No media']] as const).map(([v, l]) => (
                          <button key={v} onClick={() => setPostMedia(v)} className={`px-2.5 py-1 ${postMedia === v ? 'bg-gray-800 text-white' : 'bg-white hover:bg-gray-50'}`}>{l}</button>
                        ))}
                      </div>
                      <InfoTip text="GIF plays silently in the feed. Still posts the AI image or text only." />
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
                  {cur.scheduled && cur.status !== 'published' && (
                    <div className={`rounded-lg border p-2.5 text-xs ${cur.scheduled.state === 'failed' ? 'border-red-200 bg-red-50 text-red-800' : 'border-blue-200 bg-blue-50 text-blue-900'}`}>
                      <div className="font-medium">{cur.scheduled.state === 'failed' ? 'Scheduled post did not go out' : `Scheduled for ${new Date(cur.scheduled.at).toLocaleString([], { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}`} · {cur.scheduled.as.map(a => a === 'member' ? 'profile' : 'page').join(' + ')}</div>
                      {cur.scheduled.error && <div className="mt-0.5 break-words">{cur.scheduled.error}</div>}
                      <button disabled={!!busy} onClick={cancelSchedule} className={`${btn} mt-2`}>{cur.scheduled.state === 'failed' ? 'Clear' : 'Cancel schedule'}</button>
                    </div>
                  )}
                  {cur.status === 'approved' && !cur.scheduled && (
                    <div className="pt-2 border-t border-gray-100 space-y-2">
                      <label className="block text-xs text-gray-600">Post at <span className="text-gray-400">(optional, leave empty to post now)</span>
                        <input type="datetime-local" value={when} min={new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)} onChange={e => setWhen(e.target.value)} className={`${field} mt-1`} />
                      </label>
                      <div className="flex gap-2">
                        <button disabled={!!busy} onClick={() => publish(['member'])} className={`${primary} flex-1 justify-center`}>{when ? <Clock className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}{busy === 'publish' ? (when ? 'Scheduling…' : 'Posting…') : when ? 'Schedule as me' : 'Post as me'}</button>
                        <button disabled={!!busy} onClick={() => publish(['organization'])} className={`${primary} flex-1 justify-center`}>{when ? 'Schedule to page' : 'Post to page'}</button>
                        {when && <button disabled={!!busy} onClick={() => publish(['organization', 'member'])} className={`${btn} justify-center`} title="Page and profile at the same time">Both</button>}
                      </div>
                    </div>
                  )}
                  {cur.status === 'draft' && <div className="text-xs text-gray-500">Approve the draft to unlock posting to LinkedIn.</div>}
                  {cur.published.length > 0 && <div className="text-xs text-emerald-700">Posted: {cur.published.map(p => p.as).join(', ')}</div>}
                </div>
              </div>
            </ResizeGrid>
          </div>
        )}
      </ResizeGrid>

      {zoom && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setZoom(null)} role="dialog" aria-modal="true">
          <div className="relative max-w-[min(92vw,900px)] max-h-[92vh] flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={zoom.kind === 'motion' ? `/api/admin/social/${zoom.id}/motion?v=${imgV}` : `/api/admin/social/${zoom.id}/image?v=${imgV}`} alt="" className="rounded-lg max-h-[80vh] max-w-full object-contain bg-black" />
            <div className="flex items-center gap-2">
              <a href={zoom.kind === 'motion' ? `/api/admin/social/${zoom.id}/motion?download=1` : `/api/admin/social/${zoom.id}/image`} download className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-white/30 text-white hover:bg-white/10"><Download className="w-3.5 h-3.5" />Download</a>
            </div>
            <button onClick={() => setZoom(null)} aria-label="Close" className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-gray-800 shadow flex items-center justify-center"><X className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  )
}
