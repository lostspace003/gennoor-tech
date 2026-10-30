'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'

interface Draft {
  id: string; kind?: 'post' | 'poll'; poll?: { question: string; options: string[]; duration: string }; topic: string; status: 'draft' | 'approved' | 'published'; text: string; imagePrompt: string; hasImage: boolean
  createdAt: string; published: { as: string; at: string }[]
}

const BADGE = { draft: 'bg-amber-100 text-amber-800', approved: 'bg-blue-100 text-blue-800', published: 'bg-emerald-100 text-emerald-800' }

export default function SocialStudioPage() {
  const [drafts, setDrafts] = useState<Draft[] | null>(null)
  const [sel, setSel] = useState('')
  const [topic, setTopic] = useState('')
  const [brief, setBrief] = useState('')
  const [kind, setKind] = useState<'post' | 'poll'>('post')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [imgV, setImgV] = useState(0)

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/social')
    if (!r.ok) { setError(`Could not load (${r.status})`); return }
    setDrafts((await r.json()).drafts)
  }, [])
  useEffect(() => { load() }, [load])

  const cur = drafts?.find(d => d.id === sel)
  const patchLocal = (id: string, p: Partial<Draft>) => setDrafts(ds => ds && ds.map(d => (d.id === id ? { ...d, ...p } : d)))

  async function call(label: string, url: string, init?: RequestInit) {
    setBusy(label); setError(''); setNotice('')
    const r = await fetch(url, init)
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok && !j.done?.length) setError(j.errors?.join(' · ') || j.error || `Failed (${r.status})`)
    else if (j.errors?.length) setError(j.errors.join(' · '))
    return j
  }
  const json = (body: unknown): RequestInit => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

  async function create() {
    const j = await call('create', '/api/admin/social', json({ topic, brief, kind }))
    if (j.draft) { setTopic(''); setBrief(''); await load(); setSel(j.draft.id) }
  }
  async function save(status?: 'draft' | 'approved') {
    if (!cur) return
    const j = await call('save', `/api/admin/social/${cur.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: cur.text, imagePrompt: cur.imagePrompt, poll: cur.poll, ...(status ? { status } : {}) }) })
    if (j.draft) { patchLocal(cur.id, j.draft); setNotice(status === 'approved' ? 'Approved.' : 'Saved.') }
  }
  async function image() {
    if (!cur) return
    await save()
    const j = await call('image', `/api/admin/social/${cur.id}/image`, { method: 'POST' })
    if (j.draft) { patchLocal(cur.id, j.draft); setImgV(v => v + 1) }
  }
  async function publish(as: ('member' | 'organization')[]) {
    if (!cur) return
    const j = await call('publish', `/api/admin/social/${cur.id}/publish`, json({ as }))
    if (j.done?.length) setNotice(`Posted (${j.done.join(', ')}).`)
    load()
  }
  async function remove() {
    if (!cur || !confirm('Delete this draft?')) return
    await call('delete', `/api/admin/social/${cur.id}`, { method: 'DELETE' })
    setSel(''); load()
  }

  const locked = cur?.status === 'published'
  const btn = 'px-3 py-1.5 text-xs font-medium rounded-md border border-gray-200 hover:border-gray-400 disabled:opacity-40'

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Social studio<InfoTip text="Write, illustrate, review and publish posts. AI drafts them using your Azure AI Foundry models; nothing is posted until you approve and click Post." /></h1>
        <div className="flex gap-4 text-sm"><Link href="/admin/linkedin" className="text-gray-600 hover:underline">LinkedIn connection</Link><Link href="/admin" className="text-gray-600 hover:underline">← Admin</Link></div>
      </div>
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}

      <div className="grid md:grid-cols-[300px_1fr] gap-5">
        <div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 mb-3">
            <div className="flex items-center gap-2 mb-2 text-xs">
              {(['post', 'poll'] as const).map(k => (
                <button key={k} onClick={() => setKind(k)} className={`px-2.5 py-1 rounded-md border ${kind === k ? 'bg-gray-700 text-white border-gray-700' : 'border-gray-200'}`}>{k === 'post' ? 'Post + image' : 'Poll'}</button>
              ))}
              <InfoTip text="Post + image: text with an AI illustration. Poll: a native LinkedIn poll (question, 2 to 4 options, 1 to 14 days) with a short intro." />
            </div>
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic, e.g. Claude Code for finance teams" className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 mb-2" />
            <textarea value={brief} onChange={e => setBrief(e.target.value)} placeholder="Notes for the agent (optional)" rows={2} className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 mb-2" />
            <button disabled={!topic.trim() || !!busy} onClick={create} className="w-full px-3 py-1.5 text-xs font-medium bg-gray-700 text-white rounded-md disabled:opacity-40">
              {busy === 'create' ? 'Writing…' : 'Draft with AI'}
            </button>
            <div className="text-[11px] text-gray-500 mt-1">Topic and notes<InfoTip text="The topic is what the post is about. Notes are optional guidance such as audience, angle or a fact to include. The AI writes a first draft only; you edit it." /></div>
          </div>
          {!drafts ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
            <ul className="rounded-lg border border-gray-200 bg-white divide-y divide-gray-100">
              {drafts.length === 0 && <li className="p-3 text-sm text-gray-500">No drafts yet.</li>}
              {drafts.map(d => (
                <li key={d.id}>
                  <button onClick={() => { setSel(d.id); setNotice(''); setError('') }} className={`w-full text-left p-3 ${sel === d.id ? 'bg-gray-50' : ''}`}>
                    <div className="text-sm font-medium truncate">{d.topic}</div>
                    <span className={`text-[11px] px-1.5 py-0.5 rounded ${BADGE[d.status]}`}>{d.status}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {!cur ? <div className="text-sm text-gray-500 p-6">Pick a draft, or give the agent a topic.</div> : (
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600">Post text ({cur.text.length}/3000)<InfoTip text="The exact text that will go on LinkedIn. LinkedIn allows up to 3000 characters. Edit freely, then Save." /></label>
              <textarea disabled={locked} value={cur.text} onChange={e => patchLocal(cur.id, { text: e.target.value })} rows={11} className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 mt-1" />
            </div>
            {cur.kind === 'poll' && cur.poll && (
              <div className="rounded-md border border-gray-200 p-3 space-y-2">
                <label className="text-xs font-medium text-gray-600">Poll question ({cur.poll.question.length}/140)<InfoTip text="Shown above the options. LinkedIn allows up to 140 characters." /></label>
                <input disabled={locked} value={cur.poll.question} onChange={e => patchLocal(cur.id, { poll: { ...cur.poll!, question: e.target.value } })} className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5" />
                {cur.poll.options.map((o, i) => (
                  <input key={i} disabled={locked} value={o} maxLength={30} placeholder={`Option ${i + 1}`} onChange={e => patchLocal(cur.id, { poll: { ...cur.poll!, options: cur.poll!.options.map((x, j) => (j === i ? e.target.value : x)) } })} className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5" />
                ))}
                <div className="flex items-center gap-2 text-xs">
                  {cur.poll.options.length < 4 && !locked && <button className={btn} onClick={() => patchLocal(cur.id, { poll: { ...cur.poll!, options: [...cur.poll!.options, ''] } })}>Add option</button>}
                  <select disabled={locked} value={cur.poll.duration} onChange={e => patchLocal(cur.id, { poll: { ...cur.poll!, duration: e.target.value } })} className="border border-gray-200 rounded-md px-2 py-1.5">
                    <option value="ONE_DAY">1 day</option><option value="THREE_DAYS">3 days</option><option value="SEVEN_DAYS">7 days</option><option value="FOURTEEN_DAYS">14 days</option>
                  </select>
                  <InfoTip text="How long people can vote. Each option is limited to 30 characters; LinkedIn needs 2 to 4 options." />
                </div>
              </div>
            )}
            {cur.kind !== 'poll' && <div>
              <label className="text-xs font-medium text-gray-600">Image prompt<InfoTip text="The instruction sent to the image model (gpt-image-2). Change it and press Regenerate to get a different picture. Images are text-free by design so nothing is misspelled." /></label>
              <textarea disabled={locked} value={cur.imagePrompt} onChange={e => patchLocal(cur.id, { imagePrompt: e.target.value })} rows={3} className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 mt-1" />
              <button disabled={locked || !!busy || !cur.imagePrompt.trim()} onClick={image} className={`${btn} mt-2`}>{busy === 'image' ? 'Generating…' : cur.hasImage ? 'Regenerate image' : 'Generate image'}</button>
            </div>}
            {cur.kind !== 'poll' && cur.hasImage && /* eslint-disable-next-line @next/next/no-img-element */ <img src={`/api/admin/social/${cur.id}/image?v=${imgV}`} alt="" className="rounded-md border border-gray-200 max-h-80" />}

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <button disabled={locked || !!busy} onClick={() => save()} className={btn}>Save</button>
              {cur.status === 'draft' && <><button disabled={!!busy || !cur.text.trim()} onClick={() => save('approved')} className={btn}>Approve</button><InfoTip text="Marks the draft as reviewed. Posting is only possible after approval. You can send it back to draft." /></>}
              {cur.status === 'approved' && <button disabled={!!busy} onClick={() => save('draft')} className={btn}>Back to draft</button>}
              <span className="flex-1" /><InfoTip text="Draft = still being edited. Approved = reviewed and ready. Published = already on LinkedIn and locked. Post as me uses your profile; Post to page needs the company-page connection." />
              {cur.status === 'approved' && <>
                <button disabled={!!busy} onClick={() => publish(['member'])} className="px-3 py-1.5 text-xs font-medium bg-gray-700 text-white rounded-md disabled:opacity-40">{busy === 'publish' ? 'Posting…' : 'Post as me'}</button>
                <button disabled={!!busy} onClick={() => publish(['organization'])} className="px-3 py-1.5 text-xs font-medium bg-gray-700 text-white rounded-md disabled:opacity-40">Post to page</button>
              </>}
              {cur.published.length > 0 && <span className="text-xs text-gray-500">Posted: {cur.published.map(p => p.as).join(', ')}</span>}
              <button disabled={!!busy} onClick={remove} className={`${btn} text-red-700`}>Delete</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
