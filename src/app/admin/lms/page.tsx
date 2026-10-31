'use client'

import { useCallback, useEffect, useState } from 'react'
import { ChevronRight, Loader2, RefreshCw, UploadCloud } from 'lucide-react'
import { EMPTY_CUSTOM, TRACKS, mergedOptions, type CustomTaxonomy, type Facet } from '@/lib/lms-taxonomy'

interface Row {
  slug: string
  code: string
  title: string
  stats: { sections: number; lectures: number; quizzes: number }
  published: boolean
  protected?: boolean
  vendor: string
  kind: string
  level: string
  topics: string[]
  domains: string[]
  track: string
  builtIn?: boolean
  lessons?: { id: string; title: string; section: string }[]
  copy: { total: number; success: number; pending: number; failed: number; missing: number } | null
}

/** "+ Add new" box for one filter: creates a custom value, saves it, and hands the new value back. */
function AddNew({ facet, noun, onAdded }: { facet: Facet; noun: string; onAdded: (name: string, id: string, custom: CustomTaxonomy) => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<{ ok: boolean; text: string } | null>(null)
  const add = async () => {
    setBusy(true)
    setNote(null)
    try {
      const r = await fetch('/api/admin/lms/taxonomy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ facet, name }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'Could not add it.')
      setNote({ ok: true, text: `Added "${d.name}". It is now in this list, and in the public filters once a course uses it.` })
      setName('')
      onAdded(d.name, d.id, d.custom)
    } catch (e: any) {
      setNote({ ok: false, text: e.message })
    } finally {
      setBusy(false)
    }
  }
  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="mt-2 text-xs font-semibold text-gray-700 underline underline-offset-2 hover:text-primary">
        + Add new {noun}
      </button>
    )
  }
  const example = facet === 'vendor' ? 'Databricks' : facet === 'topic' ? 'Data Engineering' : facet === 'domain' ? 'Telecom' : facet === 'level' ? 'Advanced' : 'Workshop'
  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim() && !busy) { e.preventDefault(); add() } }}
          maxLength={40}
          aria-label={`New ${noun} name`}
          placeholder={`New ${noun}, e.g. ${example}`}
          className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
        />
        <button type="button" onClick={add} disabled={busy || !name.trim()} className="px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md disabled:opacity-50">{busy ? 'Adding…' : 'Add'}</button>
        <button type="button" onClick={() => { setOpen(false); setNote(null) }} className="text-xs text-gray-500 hover:text-gray-800">Close</button>
      </div>
      {note && <p role="status" className={`mt-1 text-xs break-words ${note.ok ? 'text-emerald-700' : 'text-red-600'}`}>{note.text}</p>}
    </div>
  )
}

function Checks({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset className="mt-4">
      <legend className="text-xs font-semibold text-gray-800 mb-2">{label}</legend>
      <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
        {options.map(o => {
          const on = value.includes(o)
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter(x => x !== o) : [...value, o])}
              className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${on ? 'bg-primary/10 text-primary border-primary' : 'bg-white text-gray-700 border-gray-300 hover:border-primary'}`}
            >
              {o}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default function AdminLmsPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [sasUrl, setSasUrl] = useState('')
  const [slug, setSlug] = useState('')
  const [vendor, setVendor] = useState('')
  const [kind, setKind] = useState('')
  const [impTopics, setImpTopics] = useState<string[]>([])
  const [impDomains, setImpDomains] = useState<string[]>([])
  const [tagSlug, setTagSlug] = useState('')
  const [tag, setTag] = useState<{ vendor: string; kind: string; level: string; topics: string[]; domains: string[]; track: string }>({ vendor: '', kind: '', level: '', topics: [], domains: [], track: '' })
  const [tagMsg, setTagMsg] = useState('')
  const [assetSlug, setAssetSlug] = useState('')
  const [assetKind, setAssetKind] = useState<'promo' | 'thumbnail'>('promo')
  const [assetUrl, setAssetUrl] = useState('')
  const [assetMsg, setAssetMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [assetBusy, setAssetBusy] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [custom, setCustom] = useState<CustomTaxonomy>(EMPTY_CUSTOM)
  const opts = mergedOptions(custom)
  const [lessonSlug, setLessonSlug] = useState('')
  const [lessonId, setLessonId] = useState('')
  const [lessonTitle, setLessonTitle] = useState('')
  const [lessonMsg, setLessonMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/lms/courses', { cache: 'no-store' })
    if (r.ok) setRows((await r.json()).courses)
  }, [])

  useEffect(() => {
    fetch('/api/admin/lms/taxonomy', { cache: 'no-store' }).then(r => (r.ok ? r.json() : null)).then(d => d && setCustom(d.custom)).catch(() => {})
  }, [])

  useEffect(() => {
    load()
    const t = setInterval(load, 15_000)
    return () => clearInterval(t)
  }, [load])

  const importCourse = async () => {
    setBusy(true)
    setMsg(null)
    try {
      // Big courses are thousands of small files: keep calling until nothing is left to start.
      let d: any
      for (let round = 1; round <= 200; round++) {
        const r = await fetch('/api/admin/lms/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sasUrl, slug: slug || undefined, vendor: vendor || undefined, kind: kind || undefined, topics: impTopics.length ? impTopics : undefined, domains: impDomains }),
        })
        d = await r.json()
        if (!r.ok) throw new Error(d.error || 'Import failed')
        setMsg({ ok: true, text: `Copying ${d.title}… ${d.remaining > 0 ? `${d.remaining} files still to start` : 'all files started'}` })
        if (!d.remaining) break
      }
      setMsg({
        ok: true,
        text: `${d.title}: ${d.stats.lectures} lectures, ${d.stats.quizzes} quizzes, ${d.files} files. ${d.protected ? 'Video is encrypted.' : 'Older package: video is NOT encrypted - rebuild it with the Studio package tool.'} Saved as a draft - publish it when every file shows as copied.`,
      })
      setSasUrl('')
      load()
    } catch (e: any) {
      setMsg({ ok: false, text: e.message })
    } finally {
      setBusy(false)
    }
  }

  const publish = async (row: Row, published: boolean) => {
    await fetch('/api/admin/lms/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: row.slug, published }),
    })
    load()
  }

  const remove = async (row: Row) => {
    const typed = window.prompt(
      `Delete "${row.title}" for good?\n\nThis removes it from the Learning Studio and the site search. Its files stay in blob storage, and learner accounts, enrollments and certificates stay.\n\nType ${row.slug} to confirm.`,
    )
    if (typed === null) return
    const res = await fetch('/api/admin/lms/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: row.slug, confirm: typed.trim() }),
    })
    const body = await res.json().catch(() => ({}))
    setMsg(res.ok ? { ok: true, text: `Deleted ${row.title}.` } : { ok: false, text: body.error || 'Could not delete.' })
    load()
  }

  return (
    <div className="w-full p-4 lg:p-5">
      <h1 className="text-lg font-semibold text-gray-900">Learning Studio courses</h1>
      <p className="text-xs text-gray-500 mt-0.5">Publish or unpublish a course, add a new one, or change how it is filed.</p>
      <section className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-900">Courses</h2>
          <button type="button" onClick={load} className="text-xs text-gray-600 hover:text-gray-900 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
        </div>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl bg-white shadow-sm max-h-[28rem] overflow-y-auto">
          {rows.map(r => {
            const done = r.copy ? r.copy.success === r.copy.total : false
            return (
              <div key={r.slug} className="px-4 py-3 flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900 break-words">{r.code} · {r.title}{r.protected ? '' : ' (video not encrypted)'}</div>
                  <div className="text-xs text-gray-500 mt-0.5 break-words">
                    {r.stats.lectures} lectures · {r.stats.quizzes} quizzes ·{' '}
                    {r.copy
                      ? done
                        ? `all ${r.copy.total} files in storage`
                        : `${r.copy.success}/${r.copy.total} files copied${r.copy.pending ? `, ${r.copy.pending} copying` : ''}${r.copy.failed ? `, ${r.copy.failed} failed` : ''}${r.copy.missing ? `, ${r.copy.missing} not started` : ''}`
                      : 'storage status unavailable'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.published ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {r.published ? 'Published' : 'Draft'}
                  </span>
                  <button
                    type="button"
                    disabled={!r.published && !done}
                    onClick={() => publish(r, !r.published)}
                    title={!r.published && !done ? 'Wait until every file has copied' : ''}
                    className="text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40"
                  >
                    {r.published ? 'Unpublish' : 'Publish'}
                  </button>
                  {!r.builtIn && (
                    <button
                      type="button"
                      onClick={() => remove(r)}
                      className="text-xs font-medium px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )
          })}
          {rows.length === 0 && <div className="p-4 text-xs text-gray-500">No courses yet.</div>}
        </div>
      </section>

      <details className="mt-4 group rounded-xl border border-gray-200 bg-white shadow-sm">
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between after:!content-none [&::-webkit-details-marker]:hidden">
          <span><span className="block text-sm font-semibold text-gray-900">Add a new course</span><span className="block text-xs text-gray-500 mt-0.5">Paste the container link of a finished course package.</span></span>
          <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90" aria-hidden />
        </summary>
        <div className="px-4 pb-4 pt-1">

        <textarea
          value={sasUrl}
          onChange={e => setSasUrl(e.target.value)}
          rows={3}
          placeholder="https://<account>.blob.core.windows.net/<container>?sp=rl&st=...&sig=..."
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">Needs read + list permission on the container. The container must hold the course's "Upload package/course.json".</p>
        <label className="block text-xs font-semibold text-gray-800 mt-4 mb-1">Course slug (optional)</label>
        <input
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder="defaults to the container name, e.g. ai-103"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
        />
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <label className="text-xs font-semibold text-gray-800">Company
            <select value={vendor} onChange={e => setVendor(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-normal">
              <option value="">Detect from the course title</option>
              {opts.vendors.map(v => <option key={v}>{v}</option>)}
            </select>
            <AddNew facet="vendor" noun="company" onAdded={(n, _id, c) => { setCustom(c); setVendor(n) }} />
          </label>
          <label className="text-xs font-semibold text-gray-800">Type
            <select value={kind} onChange={e => setKind(e.target.value)} className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-normal">
              <option value="">Detect from the course title</option>
              {opts.kinds.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
            </select>
            <AddNew facet="kind" noun="type" onAdded={(_n, id, c) => { setCustom(c); setKind(id) }} />
          </label>
        </div>
        <Checks label="Topics (blank = detect from the course)" options={opts.topics} value={impTopics} onChange={setImpTopics} />
        <AddNew facet="topic" noun="topic" onAdded={(n, _id, c) => { setCustom(c); setImpTopics(v => [...v, n]) }} />
        <Checks label="Domains (the lines of work it applies to)" options={opts.domains} value={impDomains} onChange={setImpDomains} />
        <AddNew facet="domain" noun="domain" onAdded={(n, _id, c) => { setCustom(c); setImpDomains(v => [...v, n]) }} />
        <p className="text-xs text-gray-500 mt-2">The course image and a promo video are picked up automatically when the package has them.</p>
        <button
          type="button"
          onClick={importCourse}
          disabled={busy || !sasUrl.trim()}
          className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
          {busy ? 'Importing - this can take a minute…' : 'Import course'}
        </button>
        {msg && <p className={`mt-4 text-xs break-words ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg.text}</p>}
        </div>
      </details>

      <details className="mt-4 group rounded-xl border border-gray-200 bg-white shadow-sm">
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between after:!content-none [&::-webkit-details-marker]:hidden">
          <span><span className="block text-sm font-semibold text-gray-900">Add a promo video or thumbnail</span><span className="block text-xs text-gray-500 mt-0.5">Plays automatically when someone opens the course.</span></span>
          <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90" aria-hidden />
        </summary>
        <div className="px-4 pb-4 pt-1">

        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <select value={assetSlug} onChange={e => setAssetSlug(e.target.value)} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">
            <option value="">Choose a course</option>
            {rows.map(r => <option key={r.slug} value={r.slug}>{r.code}</option>)}
          </select>
          <select value={assetKind} onChange={e => setAssetKind(e.target.value as 'promo' | 'thumbnail')} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">
            <option value="promo">Promo video (.mp4)</option>
            <option value="thumbnail">Thumbnail image</option>
          </select>
        </div>
        <textarea value={assetUrl} onChange={e => setAssetUrl(e.target.value)} rows={2} placeholder="https://<account>.blob.core.windows.net/<container>/<file>?sp=r&st=...&sig=..." className="mt-4 w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-mono" />
        <button
          type="button"
          disabled={assetBusy || !assetSlug || !assetUrl.trim()}
          onClick={async () => {
            setAssetBusy(true)
            setAssetMsg(null)
            try {
              const r = await fetch('/api/admin/lms/asset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: assetSlug, kind: assetKind, sasUrl: assetUrl }) })
              const d = await r.json()
              if (!r.ok) throw new Error(d.error || 'Upload failed')
              setAssetMsg({ ok: true, text: `Saved. The ${assetKind} is live on the ${assetSlug.toUpperCase()} page.` })
              setAssetUrl('')
            } catch (e: any) {
              setAssetMsg({ ok: false, text: e.message })
            } finally {
              setAssetBusy(false)
            }
          }}
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md disabled:opacity-50"
        >
          {assetBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
          {assetBusy ? 'Copying…' : 'Save to course'}
        </button>
        {assetMsg && <p className={`mt-3 text-xs ${assetMsg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{assetMsg.text}</p>}
        </div>
      </details>

      <details className="mt-4 group rounded-xl border border-gray-200 bg-white shadow-sm">
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between after:!content-none [&::-webkit-details-marker]:hidden">
          <span><span className="block text-sm font-semibold text-gray-900">Change how a course is filed</span><span className="block text-xs text-gray-500 mt-0.5">Company, type, level, topics and domains decide where it shows in the filters.</span></span>
          <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90" aria-hidden />
        </summary>
        <div className="px-4 pb-4 pt-1">

        <select
          value={tagSlug}
          onChange={e => {
            setTagSlug(e.target.value)
            const row = rows.find(x => x.slug === e.target.value)
            if (row) setTag({ vendor: row.vendor, kind: row.kind, level: row.level, topics: row.topics, domains: row.domains, track: row.track })
            setTagMsg('')
          }}
          className="mt-4 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
        >
          <option value="">Choose a course</option>
          {rows.map(x => <option key={x.slug} value={x.slug}>{x.code}</option>)}
        </select>
        {tagSlug && (
          <>
            <div className="grid sm:grid-cols-4 gap-4 mt-4">
              <div>
                <select aria-label="Company" value={tag.vendor} onChange={e => setTag({ ...tag, vendor: e.target.value })} className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">{opts.vendors.map(v => <option key={v}>{v}</option>)}</select>
                <AddNew facet="vendor" noun="company" onAdded={(n, _id, c) => { setCustom(c); setTag(t => ({ ...t, vendor: n })) }} />
              </div>
              <div>
                <select aria-label="Type" value={tag.kind} onChange={e => setTag({ ...tag, kind: e.target.value })} className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">{opts.kinds.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}</select>
                <AddNew facet="kind" noun="type" onAdded={(_n, id, c) => { setCustom(c); setTag(t => ({ ...t, kind: id })) }} />
              </div>
              <div>
                <select aria-label="Level" value={tag.level} onChange={e => setTag({ ...tag, level: e.target.value })} className="w-full rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">{opts.levels.map(l => <option key={l}>{l}</option>)}</select>
                <AddNew facet="level" noun="level" onAdded={(n, _id, c) => { setCustom(c); setTag(t => ({ ...t, level: n })) }} />
              </div>
              <select value={tag.track} onChange={e => setTag({ ...tag, track: e.target.value })} className="self-start rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm" aria-label="Track (short courses)">
                <option value="">No track</option>
                {TRACKS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </div>
            <Checks label="Topics" options={opts.topics} value={tag.topics} onChange={v => setTag({ ...tag, topics: v })} />
            <AddNew facet="topic" noun="topic" onAdded={(n, _id, c) => { setCustom(c); setTag(t => ({ ...t, topics: [...t.topics, n] })) }} />
            <Checks label="Domains" options={opts.domains} value={tag.domains} onChange={v => setTag({ ...tag, domains: v })} />
            <AddNew facet="domain" noun="domain" onAdded={(n, _id, c) => { setCustom(c); setTag(t => ({ ...t, domains: [...t.domains, n] })) }} />
            <p className="mt-3 text-xs text-gray-500">A new value is saved at once and selected here. It shows in the public filters after you press Save tags on a course that uses it.</p>
            <button
              type="button"
              onClick={async () => {
                const res = await fetch('/api/admin/lms/meta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: tagSlug, ...tag }) })
                setTagMsg(res.ok ? 'Saved. The filters now use these tags.' : 'Could not save.')
                load()
              }}
              className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md"
            >
              Save tags
            </button>
            {tagMsg && <p className="mt-3 text-xs text-emerald-700">{tagMsg}</p>}
          </>
        )}
        </div>
      </details>

      <details className="mt-4 group rounded-xl border border-gray-200 bg-white shadow-sm">
        <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between after:!content-none [&::-webkit-details-marker]:hidden">
          <span><span className="block text-sm font-semibold text-gray-900">Rename a lesson</span><span className="block text-xs text-gray-500 mt-0.5">Fix a lesson or quiz title without importing the course again.</span></span>
          <ChevronRight className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-90" aria-hidden />
        </summary>
        <div className="px-4 pb-4 pt-1">
          <div className="grid sm:grid-cols-2 gap-4 mt-4">
            <select aria-label="Course" value={lessonSlug} onChange={e => { setLessonSlug(e.target.value); setLessonId(''); setLessonTitle(''); setLessonMsg(null) }} className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm">
              <option value="">Choose a course</option>
              {rows.map(x => <option key={x.slug} value={x.slug}>{x.code}</option>)}
            </select>
            <select
              aria-label="Lesson"
              value={lessonId}
              disabled={!lessonSlug}
              onChange={e => { setLessonId(e.target.value); setLessonTitle(rows.find(x => x.slug === lessonSlug)?.lessons?.find(l => l.id === e.target.value)?.title || ''); setLessonMsg(null) }}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm min-w-0"
            >
              <option value="">Choose a lesson</option>
              {(rows.find(x => x.slug === lessonSlug)?.lessons || []).map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
            </select>
          </div>
          {lessonId && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <input value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} maxLength={140} aria-label="New lesson title" className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm" />
              <button
                type="button"
                disabled={!lessonTitle.trim()}
                onClick={async () => {
                  const res = await fetch('/api/admin/lms/lesson', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: lessonSlug, itemId: lessonId, title: lessonTitle }) })
                  const d = await res.json().catch(() => ({}))
                  setLessonMsg(res.ok ? { ok: true, text: `Renamed to "${d.title}".` } : { ok: false, text: d.error || 'Could not rename.' })
                  load()
                }}
                className="px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded-md disabled:opacity-50"
              >
                Save title
              </button>
            </div>
          )}
          {lessonMsg && <p role="status" className={`mt-3 text-xs ${lessonMsg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{lessonMsg.text}</p>}
        </div>
      </details>

    </div>
  )
}
