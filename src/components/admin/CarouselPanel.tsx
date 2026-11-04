'use client'

import { useState } from 'react'
import { Loader2, Download, Send, Clock } from 'lucide-react'

interface Plan { title: string; caption: string; slides: { title: string; body?: string; bullets?: string[] }[] }

const field = 'w-full rounded-md border border-gray-200 px-3 py-2 text-sm'
const btn = 'inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] rounded-md border border-gray-200 bg-white disabled:opacity-40 hover:border-gray-400'

/** Card carousel (swipeable PDF): topic or web page in, cards + caption out, then download, post or schedule. */
export default function CarouselPanel() {
  const [topic, setTopic] = useState('')
  const [url, setUrl] = useState('')
  const [plan, setPlan] = useState<Plan | null>(null)
  const [at, setAt] = useState('')
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [upCaption, setUpCaption] = useState('')

  async function uploadPost(as: 'organization' | 'member') {
    if (!file) return
    setBusy('up' + as); setError(''); setNotice('')
    const fd = new FormData()
    fd.append('file', file); fd.append('title', file.name.replace(/\.pdf$/i, '')); fd.append('caption', upCaption); fd.append('as', as)
    if (at) fd.append('at', new Date(at).toISOString())
    const r = await fetch('/api/admin/linkedin/carousel', { method: 'POST', body: fd })
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok) { setError(j.error || 'Upload failed.'); return }
    setNotice(j.scheduled ? `Scheduled for ${new Date(j.scheduled).toLocaleString()}.` : 'Your PDF was posted to LinkedIn.')
    setFile(null); setUpCaption('')
  }

  async function run(action: 'plan' | 'pdf' | 'publish', as?: 'organization' | 'member') {
    setBusy(action + (as || '')); setError(''); setNotice('')
    const r = await fetch('/api/admin/linkedin/carousel', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, topic, url, plan, as, ...(action === 'publish' && at ? { at: new Date(at).toISOString() } : {}) }),
    })
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok) { setError(j.error || 'Something went wrong.'); return }
    if (action === 'plan') setPlan(j.plan)
    else if (action === 'pdf') { const a = document.createElement('a'); a.href = `data:application/pdf;base64,${j.pdf}`; a.download = 'carousel.pdf'; a.click() }
    else setNotice(j.scheduled ? `Scheduled for ${new Date(j.scheduled).toLocaleString()}.` : 'Carousel posted to LinkedIn.')
  }

  return (
    <div className="space-y-2">
      {error && <div className="rounded-md bg-red-50 border border-red-200 text-red-800 text-xs px-2.5 py-1.5">{error}</div>}
      {notice && <div className="rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-2.5 py-1.5">{notice}</div>}
      <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic, e.g. 5 controls every AI agent needs" className={field} />
      <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Optional: a web page to base the cards on" className={field} />
      <button disabled={!!busy || (!topic.trim() && !url.trim())} onClick={() => run('plan')} className="w-full inline-flex justify-center items-center gap-1.5 px-3 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md disabled:opacity-40">
        {busy === 'plan' ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Writing the cards…</> : 'Write the cards'}
      </button>
      {plan && (
        <div className="pt-1">
          <ol className="list-decimal pl-5 space-y-0.5 text-[13px]">{plan.slides.map((s, i) => <li key={i}>{s.title}</li>)}</ol>
          <textarea value={plan.caption} onChange={e => setPlan({ ...plan, caption: e.target.value })} rows={4} className={`${field} mt-2`} />
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-600"><Clock className="w-3.5 h-3.5" />Schedule (optional)
            <input type="datetime-local" value={at} onChange={e => setAt(e.target.value)} className="rounded-md border border-gray-200 px-2 py-1" /></div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button disabled={!!busy} onClick={() => run('pdf')} className={btn}><Download className="w-3.5 h-3.5" />PDF</button>
            <button disabled={!!busy} onClick={() => run('publish', 'organization')} className={btn}><Send className="w-3.5 h-3.5" />{at ? 'Schedule on page' : 'Post to page'}</button>
            <button disabled={!!busy} onClick={() => run('publish', 'member')} className={btn}><Send className="w-3.5 h-3.5" />{at ? 'Schedule as me' : 'Post as me'}</button>
          </div>
        </div>
      )}
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
        <div className="text-xs font-semibold text-gray-600">Or post your own carousel PDF</div>
        <label className={`${btn} cursor-pointer w-full justify-center`}>{file ? file.name : 'Choose a PDF (up to 25 MB)'}
          <input type="file" accept="application/pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} /></label>
        {file && <>
          <textarea value={upCaption} onChange={e => setUpCaption(e.target.value)} rows={3} placeholder="Caption for the post" className={field} />
          <div className="flex items-center gap-2 text-xs text-gray-600"><Clock className="w-3.5 h-3.5" />Schedule (optional)
            <input type="datetime-local" value={at} onChange={e => setAt(e.target.value)} className="rounded-md border border-gray-200 px-2 py-1" /></div>
          <div className="flex flex-wrap gap-2">
            <button disabled={!!busy} onClick={() => uploadPost('organization')} className={btn}>{busy === 'uporganization' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}{at ? 'Schedule on page' : 'Post to page'}</button>
            <button disabled={!!busy} onClick={() => uploadPost('member')} className={btn}>{busy === 'upmember' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}{at ? 'Schedule as me' : 'Post as me'}</button>
          </div>
        </>}
      </div>
    </div>
  )
}
