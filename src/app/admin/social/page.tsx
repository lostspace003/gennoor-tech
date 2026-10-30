'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

interface Draft {
  id: string; topic: string; status: 'draft' | 'approved' | 'published'; text: string; imagePrompt: string; hasImage: boolean
  createdAt: string; published: { as: string; at: string }[]
}

const BADGE = { draft: 'bg-amber-100 text-amber-800', approved: 'bg-blue-100 text-blue-800', published: 'bg-emerald-100 text-emerald-800' }

export default function SocialStudioPage() {
  const [drafts, setDrafts] = useState<Draft[] | null>(null)
  const [sel, setSel] = useState('')
  const [topic, setTopic] = useState('')
  const [brief, setBrief] = useState('')
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
    const j = await call('create', '/api/admin/social', json({ topic, brief }))
    if (j.draft) { setTopic(''); setBrief(''); await load(); setSel(j.draft.id) }
  }
  async function save(status?: 'draft' | 'approved') {
    if (!cur) return
    const j = await call('save', `/api/admin/social/${cur.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: cur.text, imagePrompt: cur.imagePrompt, ...(status ? { status } : {}) }) })
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
        <h1 className="text-xl font-semibold">Social studio</h1>
        <div className="flex gap-4 text-sm"><Link href="/admin/linkedin" className="text-gray-600 hover:underline">LinkedIn connection</Link><Link href="/admin" className="text-gray-600 hover:underline">← Admin</Link></div>
      </div>
      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}

      <div className="grid md:grid-cols-[300px_1fr] gap-5">
        <div>
          <div className="rounded-lg border border-gray-200 bg-white p-3 mb-3">
            <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic, e.g. Claude Code for finance teams" className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 mb-2" />
            <textarea value={brief} onChange={e => setBrief(e.target.value)} placeholder="Notes for the agent (optional)" rows={2} className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 mb-2" />
            <button disabled={!topic.trim() || !!busy} onClick={create} className="w-full px-3 py-1.5 text-xs font-medium bg-gray-700 text-white rounded-md disabled:opacity-40">
              {busy === 'create' ? 'Writing…' : 'Draft with AI'}
            </button>
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
              <label className="text-xs font-medium text-gray-600">Post text ({cur.text.length}/3000)</label>
              <textarea disabled={locked} value={cur.text} onChange={e => patchLocal(cur.id, { text: e.target.value })} rows={11} className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 mt-1" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600">Image prompt</label>
              <textarea disabled={locked} value={cur.imagePrompt} onChange={e => patchLocal(cur.id, { imagePrompt: e.target.value })} rows={3} className="w-full text-sm border border-gray-200 rounded-md px-2 py-1.5 mt-1" />
              <button disabled={locked || !!busy || !cur.imagePrompt.trim()} onClick={image} className={`${btn} mt-2`}>{busy === 'image' ? 'Generating…' : cur.hasImage ? 'Regenerate image' : 'Generate image'}</button>
            </div>
            {cur.hasImage && /* eslint-disable-next-line @next/next/no-img-element */ <img src={`/api/admin/social/${cur.id}/image?v=${imgV}`} alt="" className="rounded-md border border-gray-200 max-h-80" />}

            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <button disabled={locked || !!busy} onClick={() => save()} className={btn}>Save</button>
              {cur.status === 'draft' && <button disabled={!!busy || !cur.text.trim()} onClick={() => save('approved')} className={btn}>Approve</button>}
              {cur.status === 'approved' && <button disabled={!!busy} onClick={() => save('draft')} className={btn}>Back to draft</button>}
              <span className="flex-1" />
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
