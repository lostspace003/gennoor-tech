'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, ExternalLink, Loader2, Megaphone, Pencil, Power, RotateCcw, Send, SkipForward, Undo2 } from 'lucide-react'

/**
 * Admin -> Film campaign: the LinkedIn posts that go out with the two films.
 * Each one is posted from the founder's profile, then reposted by the company page with a short
 * line of its own. Everything here is read from /api/admin/campaign; the plan and the words are in
 * src/lib/promo-campaign.ts and src/data/linkedin-campaign-*.ts.
 */

type Target = 'member' | 'organization'
interface Run { status: 'done' | 'failed' | 'missed'; at: string; attempts: number; urn?: string; error?: string; commentError?: string }
interface Item {
  key: string; id: string; film: 'weekend' | 'overview'; shape: 'tall' | 'wide'; date: string; time: string
  slot: 'morning' | 'afternoon' | 'evening'; weekendDay: boolean; text: string; share: string
  preview: string; sharePreview: string; link: string; skip: boolean; edited: boolean
}
interface Data {
  enabled: boolean; today: string; start: string; cycle: number; cycleStart: string; nextCycleStart: string; cycleDays: number
  items: Item[]; runs: Record<string, Partial<Record<Target, Run>>>; log: { at: string; msg: string }[]; lastTick?: string
  health: Record<Target, { connected: boolean; days: number | null }>
}

const FILM = { weekend: 'AI Weekend film', overview: 'What we do film' } as const
const FILM_TONE = { weekend: 'bg-amber-50 text-amber-800', overview: 'bg-blue-50 text-blue-700' } as const
const WHO = { member: 'Profile', organization: 'Company page' } as const
const VIDEO: Record<Item['film'], Record<Item['shape'], string>> = {
  weekend: { wide: '/videos/gennoor-ai-weekend.mp4', tall: '/media/videos/gennoor-ai-weekend-reel.mp4' },
  overview: { wide: '/videos/gennoor-what-we-do.mp4', tall: '/media/videos/gennoor-what-we-do-reel.mp4' },
}
const day = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' })
const hook = (text: string) => text.split('\n')[0].replace(/\*\*/g, '')
/** The post as LinkedIn shows it, near enough: the bold marks taken off, since this page cannot show LinkedIn's bold letters. */
const shown = (text: string) => text.replace(/\*\*/g, '')

export default function CampaignPage() {
  const [data, setData] = useState<Data | null>(null)
  const [busy, setBusy] = useState('')
  const [error, setError] = useState('')
  const [open, setOpen] = useState<string | null>(null)
  const [edit, setEdit] = useState<{ key: string; text: string; share: string } | null>(null)
  const [ask, setAsk] = useState<string | null>(null)
  const [show, setShow] = useState<'next' | 'sent' | 'all'>('next')
  const [film, setFilm] = useState<'both' | 'weekend' | 'overview'>('both')

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/campaign')
    if (r.ok) setData(await r.json())
    else setError('The campaign could not be read.')
  }, [])
  useEffect(() => { load(); const t = setInterval(load, 60_000); return () => clearInterval(t) }, [load])

  async function call(method: 'POST' | 'PATCH', body: object, key: string) {
    setBusy(key); setError('')
    const r = await fetch('/api/admin/campaign', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const j = await r.json().catch(() => ({}))
    setBusy('')
    if (!r.ok || j.ok === false) setError(j.error || (j.errors || []).join(' · ') || 'Something went wrong.')
    await load()
  }

  const sentOf = useCallback((d: Data, key: string) => d.runs[key]?.member?.status === 'done', [])
  const list = useMemo(() => {
    if (!data) return []
    return data.items.filter((i) => {
      if (film !== 'both' && i.film !== film) return false
      if (show === 'sent') return sentOf(data, i.key)
      if (show === 'next') return !sentOf(data, i.key) && i.date >= data.today
      return true
    })
  }, [data, film, show, sentOf])

  if (!data) return <div className="p-5 text-sm text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" />Reading the campaign…</div>

  const sent = data.items.filter((i) => sentOf(data, i.key)).length
  const reposted = data.items.filter((i) => data.runs[i.key]?.organization?.status === 'done').length
  const nextUp = data.items.find((i) => !sentOf(data, i.key) && !i.skip && i.date >= data.today)
  const chip = (on: boolean) => `px-2.5 py-1 rounded-full text-xs font-medium border ${on ? 'bg-primary-600 text-white border-primary-600' : 'bg-raised text-gray-700 border-gray-200 hover:border-gray-300'}`

  return (
    <div className="w-full p-4 lg:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Megaphone className="w-5 h-5 text-gray-500" />
        <h1 className="text-lg font-semibold text-gray-900">Film campaign on LinkedIn</h1>
        <button
          onClick={() => call('PATCH', { enabled: !data.enabled }, 'power')}
          className={`ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium ${data.enabled ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          {busy === 'power' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Power className="w-4 h-4" />}{data.enabled ? 'On' : 'Paused'}
        </button>
      </div>
      <p className="mt-1 text-sm text-gray-600 max-w-[900px]">
        The AI Weekend film goes out every second day, at a different time each time (morning, afternoon, evening). The film &ldquo;What we do&rdquo;
        goes out twice a week on the other days. Each post goes out from your profile first; about half an hour later the company page reposts it
        with a short line of its own. The link is added as the first comment.
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {[
          ['Next to go out', nextUp ? `${day(nextUp.date)}, ${nextUp.time}` : 'Nothing', nextUp ? FILM[nextUp.film] : 'This cycle is finished'],
          ['Sent from the profile', `${sent} of ${data.items.length}`, 'in this cycle'],
          ['Reposted by the page', `${reposted} of ${sent}`, 'of those sent'],
          ['This cycle', `${day(data.cycleStart)} to ${day(new Date(Date.parse(`${data.nextCycleStart}T00:00:00Z`) - 86_400_000).toISOString().slice(0, 10))}`, `Then it starts again on ${day(data.nextCycleStart)}`],
        ].map(([label, value, line]) => (
          <div key={label} className="rounded-xl border border-gray-200 bg-raised px-3.5 py-3">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="mt-0.5 text-base font-semibold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{line}</div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        {(['member', 'organization'] as const).map((t) => {
          const h = data.health[t]
          const bad = !h.connected || (h.days ?? 0) < 1
          return <span key={t} className={`px-2 py-0.5 rounded ${bad ? 'bg-red-50 text-red-700' : (h.days ?? 99) < 14 ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>{WHO[t]}: {h.connected ? `signed in, ${h.days} days left` : 'not connected'}</span>
        })}
        {data.lastTick && <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600">last looked at {new Date(data.lastTick).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>}
        {data.today < data.start && <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700">starts on {day(data.start)}</span>}
        <span className="ml-auto flex flex-wrap items-center gap-1.5">
          {([['next', 'Coming up'], ['sent', 'Sent'], ['all', 'Whole cycle']] as const).map(([k, label]) => <button key={k} onClick={() => setShow(k)} className={chip(show === k)}>{label}</button>)}
          <span className="mx-1 h-4 w-px bg-gray-200" />
          {([['both', 'Both films'], ['weekend', 'AI Weekend'], ['overview', 'What we do']] as const).map(([k, label]) => <button key={k} onClick={() => setFilm(k)} className={chip(film === k)}>{label}</button>)}
        </span>
      </div>
      {error && <div className="mt-2 text-sm text-red-700 break-words">{error}</div>}

      <div className="mt-3 rounded-xl border border-gray-200 bg-raised divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
        {list.length === 0 && <div className="p-4 text-sm text-gray-500">Nothing here.</div>}
        {list.map((i) => {
          const runs = data.runs[i.key] || {}
          const isOpen = open === i.key
          const isSent = sentOf(data, i.key)
          return (
            <div key={i.key} className={`p-3 ${i.skip ? 'opacity-50' : ''}`}>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className={`w-[104px] shrink-0 font-medium ${i.date === data.today ? 'text-green-700' : 'text-gray-900'}`}>{day(i.date)}</span>
                <span className="w-[126px] shrink-0 whitespace-nowrap text-gray-600">{i.time} <span className="text-gray-400">{i.slot}</span></span>
                <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${FILM_TONE[i.film]}`}>{FILM[i.film]}</span>
                {i.weekendDay && <span className="px-1.5 py-0.5 rounded text-xs bg-violet-50 text-violet-700">weekend voice</span>}
                <button onClick={() => setOpen(isOpen ? null : i.key)} className="min-w-0 flex-1 basis-[260px] text-left font-medium text-gray-900 hover:underline break-words">{hook(i.preview)}</button>
                {i.edited && <span className="text-xs text-gray-400">edited</span>}
                {i.skip && <span className="text-xs text-gray-500">left out</span>}
                <span className="ml-auto flex flex-wrap items-center gap-1.5">
                  {(['member', 'organization'] as const).map((t) => {
                    const r = runs[t]
                    const tone = !r ? 'bg-gray-100 text-gray-500' : r.status === 'done' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    const label = !r ? (t === 'member' ? 'to post' : 'to repost') : r.status === 'done' ? (t === 'member' ? 'posted' : 'reposted') : r.status
                    return r?.urn
                      ? <a key={t} href={`https://www.linkedin.com/feed/update/${r.urn}`} target="_blank" rel="noreferrer" className={`px-1.5 py-0.5 rounded text-xs inline-flex items-center gap-1 ${tone}`}>{WHO[t]} {label}<ExternalLink className="w-3 h-3" /></a>
                      : <span key={t} title={r?.error} className={`px-1.5 py-0.5 rounded text-xs ${tone}`}>{WHO[t]} {label}</span>
                  })}
                  {!isSent && (
                    ask === i.key ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-700">
                        Post it now?
                        <button onClick={async () => { setAsk(null); await call('POST', { key: i.key, action: 'post-now' }, `now${i.key}`) }} className="px-2 py-1 rounded bg-primary-600 text-white">Yes, post</button>
                        <button onClick={() => setAsk(null)} className="px-2 py-1 rounded border border-gray-300">No</button>
                      </span>
                    ) : (
                      <>
                        <button title="Post now" aria-label="Post now" onClick={() => setAsk(i.key)} className="p-1.5 rounded hover:bg-gray-100">{busy === `now${i.key}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</button>
                        <button title={i.skip ? 'Put back' : 'Leave this one out'} aria-label={i.skip ? 'Put back' : 'Leave this one out'} onClick={() => call('POST', { key: i.key, action: i.skip ? 'unskip' : 'skip' }, `skip${i.key}`)} className="p-1.5 rounded hover:bg-gray-100">{i.skip ? <RotateCcw className="w-4 h-4" /> : <SkipForward className="w-4 h-4" />}</button>
                        <button title="Change the words" aria-label="Change the words" onClick={() => { setOpen(i.key); setEdit({ key: i.key, text: i.text, share: i.share }) }} className="p-1.5 rounded hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                      </>
                    )
                  )}
                </span>
              </div>

              {isOpen && (
                <div className={`mt-3 grid gap-4 ${i.shape === 'tall' ? 'lg:grid-cols-[220px_1fr]' : 'lg:grid-cols-[minmax(0,400px)_1fr]'}`}>
                  <div>
                    <video src={VIDEO[i.film][i.shape]} controls muted playsInline preload="metadata" className="w-full rounded-lg border border-gray-200 bg-black" />
                    <div className="mt-1 text-xs text-gray-500">{i.shape === 'tall' ? 'The tall film (reads best on a phone)' : 'The wide film'}</div>
                  </div>
                  {edit?.key === i.key ? (
                    <div className="min-w-0">
                      <label className="block text-xs font-medium text-gray-700">Your post. The first line, between two pairs of stars, is the bold opening. {'{when}'} and {'{dates}'} become the next AI Weekend dates.</label>
                      <textarea value={edit.text} onChange={(e) => setEdit({ ...edit, text: e.target.value })} rows={14} className="mt-1 w-full rounded-lg border border-gray-300 bg-raised p-2 text-sm font-mono text-gray-900" />
                      <label className="mt-2 block text-xs font-medium text-gray-700">The short line the company page adds when it reposts</label>
                      <textarea value={edit.share} onChange={(e) => setEdit({ ...edit, share: e.target.value })} rows={2} className="mt-1 w-full rounded-lg border border-gray-300 bg-raised p-2 text-sm text-gray-900" />
                      <p className="mt-1 text-xs text-gray-500">Changed words are kept for every time this post comes round. No price, and nothing called &ldquo;free&rdquo;.</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button onClick={async () => { await call('POST', { key: i.key, action: 'text', text: edit.text, share: edit.share }, `text${i.key}`); setEdit(null) }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-sm">{busy === `text${i.key}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}Save</button>
                        {i.edited && <button onClick={async () => { await call('POST', { key: i.key, action: 'reset' }, `reset${i.key}`); setEdit(null) }} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-800"><Undo2 className="w-4 h-4" />Back to the written words</button>}
                        <button onClick={() => setEdit(null)} className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-800">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="min-w-0 space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-gray-500">Your post, as it goes out</div>
                        <pre className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-900 font-sans max-h-80 overflow-auto">{shown(i.preview)}</pre>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500">First comment, from your profile</div>
                        <div className="mt-1 text-sm text-gray-800 break-all">{i.film === 'weekend' ? 'Reserve your seat for the AI Weekend: ' : 'See it on the website: '}{i.link}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500">The company page, when it reposts</div>
                        <div className="mt-1 text-sm text-gray-800 break-words">{i.sharePreview}</div>
                      </div>
                      {(runs.member?.error || runs.organization?.error || runs.member?.commentError) && (
                        <div className="text-xs text-red-700 break-words">{[runs.member?.error && `Profile: ${runs.member.error}`, runs.member?.commentError && `Link comment: ${runs.member.commentError}`, runs.organization?.error && `Company page: ${runs.organization.error}`].filter(Boolean).join(' · ')}</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {data.log.length > 0 && (
        <details className="mt-3 text-xs text-gray-600">
          <summary className="cursor-pointer">What it has done</summary>
          <ul className="mt-1 space-y-0.5">{data.log.map((l, k) => <li key={k}><span className="text-gray-400">{new Date(l.at).toLocaleString('en-GB')}</span> {l.msg}</li>)}</ul>
        </details>
      )}
    </div>
  )
}
