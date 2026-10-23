'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2, RefreshCw, UploadCloud } from 'lucide-react'
import { ALL_PLATFORMS, DOMAINS, KINDS, LEVELS, TOPICS } from '@/lib/lms-taxonomy'

interface Row {
  slug: string
  code: string
  title: string
  stats: { sections: number; lectures: number; quizzes: number }
  published: boolean
  vendor: string
  kind: string
  level: string
  topics: string[]
  domains: string[]
  copy: { total: number; success: number; pending: number; failed: number; missing: number } | null
}

function Checks({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset className="mt-4">
      <legend className="text-sm font-semibold text-gray-800 mb-2">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(o => {
          const on = value.includes(o)
          return (
            <button
              key={o}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(on ? value.filter(x => x !== o) : [...value, o])}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${on ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-900'}`}
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
  const [tag, setTag] = useState<{ vendor: string; kind: string; level: string; topics: string[]; domains: string[] }>({ vendor: '', kind: '', level: '', topics: [], domains: [] })
  const [tagMsg, setTagMsg] = useState('')
  const [assetSlug, setAssetSlug] = useState('')
  const [assetKind, setAssetKind] = useState<'promo' | 'thumbnail'>('promo')
  const [assetUrl, setAssetUrl] = useState('')
  const [assetMsg, setAssetMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [assetBusy, setAssetBusy] = useState(false)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/lms/courses', { cache: 'no-store' })
    if (r.ok) setRows((await r.json()).courses)
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
      const r = await fetch('/api/admin/lms/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sasUrl, slug: slug || undefined, vendor: vendor || undefined, kind: kind || undefined, topics: impTopics.length ? impTopics : undefined, domains: impDomains }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Import failed')
      setMsg({
        ok: true,
        text: `${d.title}: ${d.stats.lectures} lectures, ${d.stats.quizzes} quizzes. ${d.copy.started} files copying, ${d.copy.skipped} already there${d.copy.failed.length ? `, ${d.copy.failed.length} failed to start` : ''}. Saved as a draft - publish it when the copy finishes.`,
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

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-800">‹ Admin</Link>
      <h1 className="text-2xl font-bold text-gray-900 mt-3">Learning Studio - video courses</h1>
      <p className="text-gray-600 mt-1">
        Paste a container SAS URL and the course is imported: its curriculum, quizzes, videos, captions and PDFs are copied into the LMS storage. The SAS is used for the import only and is not saved.
      </p>

      <section className="mt-8 rounded-2xl border border-gray-200 p-6 bg-white">
        <label className="block text-sm font-semibold text-gray-800 mb-1">Container SAS URL</label>
        <textarea
          value={sasUrl}
          onChange={e => setSasUrl(e.target.value)}
          rows={3}
          placeholder="https://<account>.blob.core.windows.net/<container>?sp=rl&st=...&sig=..."
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono"
        />
        <p className="text-xs text-gray-500 mt-1">Needs read + list permission on the container. The container must hold the course's "Upload package/course.json".</p>
        <label className="block text-sm font-semibold text-gray-800 mt-4 mb-1">Course slug (optional)</label>
        <input
          value={slug}
          onChange={e => setSlug(e.target.value)}
          placeholder="defaults to the container name, e.g. ai-103"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <label className="text-sm font-semibold text-gray-800">Company
            <select value={vendor} onChange={e => setVendor(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal">
              <option value="">Detect from the course title</option>
              {ALL_PLATFORMS.map(v => <option key={v}>{v}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold text-gray-800">Type
            <select value={kind} onChange={e => setKind(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-normal">
              <option value="">Detect from the course title</option>
              {KINDS.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}
            </select>
          </label>
        </div>
        <Checks label="Topics (blank = detect from the course)" options={TOPICS} value={impTopics} onChange={setImpTopics} />
        <Checks label="Domains (the lines of work it applies to)" options={DOMAINS} value={impDomains} onChange={setImpDomains} />
        <p className="text-xs text-gray-500 mt-2">The course image and a promo video are picked up automatically when the package has them.</p>
        <button
          type="button"
          onClick={importCourse}
          disabled={busy || !sasUrl.trim()}
          className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full disabled:opacity-50"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
          {busy ? 'Importing - this can take a minute…' : 'Import course'}
        </button>
        {msg && <p className={`mt-4 text-sm ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{msg.text}</p>}
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Add a promo video or thumbnail</h2>
        <p className="text-sm text-gray-500 mt-1">The promo plays automatically when someone opens the course. Paste the SAS URL of the single file.</p>
        <div className="grid sm:grid-cols-2 gap-4 mt-4">
          <select value={assetSlug} onChange={e => setAssetSlug(e.target.value)} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="">Choose a course</option>
            {rows.map(r => <option key={r.slug} value={r.slug}>{r.code}</option>)}
          </select>
          <select value={assetKind} onChange={e => setAssetKind(e.target.value as 'promo' | 'thumbnail')} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="promo">Promo video (.mp4)</option>
            <option value="thumbnail">Thumbnail image</option>
          </select>
        </div>
        <textarea value={assetUrl} onChange={e => setAssetUrl(e.target.value)} rows={2} placeholder="https://<account>.blob.core.windows.net/<container>/<file>?sp=r&st=...&sig=..." className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono" />
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
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full disabled:opacity-50"
        >
          {assetBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
          {assetBusy ? 'Copying…' : 'Save to course'}
        </button>
        {assetMsg && <p className={`mt-3 text-sm ${assetMsg.ok ? 'text-emerald-700' : 'text-red-600'}`}>{assetMsg.text}</p>}
      </section>

      <section className="mt-8 rounded-2xl border border-gray-200 p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Edit how a course is filed</h2>
        <p className="text-sm text-gray-500 mt-1">Company, type, level, topics and domains decide where the course appears in the Learning Studio filters.</p>
        <select
          value={tagSlug}
          onChange={e => {
            setTagSlug(e.target.value)
            const row = rows.find(x => x.slug === e.target.value)
            if (row) setTag({ vendor: row.vendor, kind: row.kind, level: row.level, topics: row.topics, domains: row.domains })
            setTagMsg('')
          }}
          className="mt-4 rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">Choose a course</option>
          {rows.map(x => <option key={x.slug} value={x.slug}>{x.code}</option>)}
        </select>
        {tagSlug && (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mt-4">
              <select value={tag.vendor} onChange={e => setTag({ ...tag, vendor: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">{ALL_PLATFORMS.map(v => <option key={v}>{v}</option>)}</select>
              <select value={tag.kind} onChange={e => setTag({ ...tag, kind: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">{KINDS.map(k => <option key={k.id} value={k.id}>{k.label}</option>)}</select>
              <select value={tag.level} onChange={e => setTag({ ...tag, level: e.target.value })} className="rounded-lg border border-gray-300 px-3 py-2 text-sm">{LEVELS.map(l => <option key={l}>{l}</option>)}</select>
            </div>
            <Checks label="Topics" options={TOPICS} value={tag.topics} onChange={v => setTag({ ...tag, topics: v })} />
            <Checks label="Domains" options={DOMAINS} value={tag.domains} onChange={v => setTag({ ...tag, domains: v })} />
            <button
              type="button"
              onClick={async () => {
                const res = await fetch('/api/admin/lms/meta', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: tagSlug, ...tag }) })
                setTagMsg(res.ok ? 'Saved. The filters now use these tags.' : 'Could not save.')
                load()
              }}
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-full"
            >
              Save tags
            </button>
            {tagMsg && <p className="mt-3 text-sm text-emerald-700">{tagMsg}</p>}
          </>
        )}
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Courses</h2>
          <button type="button" onClick={load} className="text-sm text-gray-500 hover:text-gray-800 inline-flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
        </div>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-2xl bg-white">
          {rows.map(r => {
            const done = r.copy ? r.copy.success === r.copy.total : false
            return (
              <div key={r.slug} className="p-5 flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900">{r.code} · {r.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {r.stats.lectures} lectures · {r.stats.quizzes} quizzes ·{' '}
                    {r.copy
                      ? done
                        ? `all ${r.copy.total} files in storage`
                        : `${r.copy.success}/${r.copy.total} files copied${r.copy.pending ? `, ${r.copy.pending} copying` : ''}${r.copy.failed ? `, ${r.copy.failed} failed` : ''}${r.copy.missing ? `, ${r.copy.missing} not started` : ''}`
                      : 'storage status unavailable'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${r.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {r.published ? 'Published' : 'Draft'}
                  </span>
                  <button
                    type="button"
                    disabled={!r.published && !done}
                    onClick={() => publish(r, !r.published)}
                    title={!r.published && !done ? 'Wait until every file has copied' : ''}
                    className="text-sm font-semibold px-4 py-1.5 rounded-full border border-gray-300 hover:border-gray-900 disabled:opacity-40"
                  >
                    {r.published ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
              </div>
            )
          })}
          {rows.length === 0 && <div className="p-6 text-sm text-gray-500">No courses yet.</div>}
        </div>
      </section>
    </main>
  )
}
