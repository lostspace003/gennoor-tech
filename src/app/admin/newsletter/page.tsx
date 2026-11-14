'use client'

import { useCallback, useEffect, useState } from 'react'
import { CalendarClock, Loader2, MailCheck, RefreshCw, Send, Users } from 'lucide-react'

interface Person { email: string; since: string; source: string }
interface Done { issue: string; slugs: string[]; sent: number; finishedAt: string; note?: string }
interface Data {
  people: Person[]
  signedUp: number
  waitingToConfirm: number
  stopped: number
  upcoming: { issue: string; goesAt: string; posts: { slug: string; title: string; date: string }[] }
  current: { issue: string; sent: number; waiting: number; startedAt: string } | null
  history: Done[]
  preview: { subject: string; html: string } | null
  limits: { perHour: number; perTick: number }
  setUp: boolean
}

const btn = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium rounded-md border border-gray-200 bg-raised hover:border-gray-400 disabled:opacity-40'
const primary = 'inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900 disabled:opacity-40'
const day = (iso: string) => (iso ? new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: iso.length === 10 ? 'UTC' : 'Asia/Kolkata' }) : '')
const dayTime = (iso: string) => new Date(iso).toLocaleString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' })

/** The weekly email of new posts: who gets it, what goes next, what has gone. */
export default function NewsletterPage() {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    setError('')
    const r = await fetch('/api/admin/newsletter').catch(() => null)
    const j = r ? await r.json().catch(() => ({})) : {}
    if (!r?.ok) { setError(j.error || `Could not load (${r?.status ?? 'offline'})`); return }
    setData(j)
  }, [])
  useEffect(() => { load() }, [load])

  async function test() {
    setBusy(true); setError(''); setNotice('')
    const r = await fetch('/api/admin/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'test' }) }).catch(() => null)
    const j = r ? await r.json().catch(() => ({})) : {}
    setBusy(false)
    if (!r?.ok) { setError(j.error || 'The test email could not be sent'); return }
    setNotice(`The email service has taken a test for ${j.to}. It goes to you only.`)
  }

  const tile = 'rounded-lg border border-gray-200 bg-raised px-4 py-3'
  return (
    <div className="p-4 sm:p-6 max-w-6xl space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Weekly email</h1>
          <p className="text-[13px] text-gray-500 mt-0.5 max-w-2xl">
            Someone types their address into &quot;Get new posts by email&quot; (at the foot of a page, on the blog, on every article) and presses the button in the email we send to confirm it. From then on they get one email a week, on Thursday at 10:00 India time, with the posts of that week. It goes by itself. A week with no new post sends nothing.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className={btn}><RefreshCw className="w-3.5 h-3.5" /> Refresh</button>
          <button onClick={test} disabled={busy || !data?.preview} className={primary} title="Sends the next email, as it stands, to you only">
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Send me a test
          </button>
        </div>
      </div>

      {error && <p className="text-[13px] bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2">{error}</p>}
      {notice && <p className="text-[13px] bg-green-50 border border-green-200 text-green-700 rounded-lg px-3 py-2">{notice}</p>}
      {!data && !error && <p className="text-[13px] text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Loading</p>}

      {data && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={tile}>
              <div className="text-[12px] text-gray-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Subscribed now</div>
              <div className="text-2xl font-semibold text-gray-900 tabular-nums mt-0.5">{data.people.length}</div>
              <div className="text-[12px] text-gray-500">{data.waitingToConfirm} still to press the button in their email, {data.stopped} asked to stop</div>
            </div>
            <div className={tile}>
              <div className="text-[12px] text-gray-500 flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5" /> {data.current ? 'Going out now' : 'Next email'}</div>
              <div className="text-[15px] font-semibold text-gray-900 mt-1">{data.current ? `${data.current.sent} sent, ${data.current.waiting} waiting` : dayTime(data.upcoming.goesAt)}</div>
              <div className="text-[12px] text-gray-500">{data.upcoming.posts.length ? `${data.upcoming.posts.length} post${data.upcoming.posts.length === 1 ? '' : 's'} in it so far` : 'No new post for it yet'}</div>
            </div>
            <div className={tile}>
              <div className="text-[12px] text-gray-500 flex items-center gap-1.5"><MailCheck className="w-3.5 h-3.5" /> Last email</div>
              <div className="text-[15px] font-semibold text-gray-900 mt-1">{data.history[0] ? `${day(data.history[0].issue)}: ${data.history[0].sent ? `sent to ${data.history[0].sent}` : data.history[0].note || 'nothing sent'}` : 'None yet'}</div>
              <div className="text-[12px] text-gray-500">At most {data.limits.perHour} an hour, so the site&apos;s other emails are never held up</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-5">
            <section className="rounded-lg border border-gray-200 bg-raised overflow-hidden">
              <div className="px-4 py-2.5 border-b border-gray-200">
                <h2 className="text-sm font-semibold text-gray-900">The next email, as it stands</h2>
                <p className="text-[12px] text-gray-500 truncate">{data.preview ? `Subject: ${data.preview.subject}` : 'It is drawn here as soon as a post is published in its week.'}</p>
              </div>
              {data.preview
                ? <iframe title="The next weekly email" srcDoc={data.preview.html.replace('<div', '<base target="_blank"><div')} sandbox="allow-popups allow-popups-to-escape-sandbox" className="w-full h-[640px] border-0 bg-gray-100" />
                : <div className="p-10 text-center text-[13px] text-gray-500">No new post yet for the week that ends on {day(data.upcoming.issue)}.</div>}
            </section>

            <div className="space-y-5 min-w-0">
              <section className="rounded-lg border border-gray-200 bg-raised">
                <h2 className="px-4 py-2.5 border-b border-gray-200 text-sm font-semibold text-gray-900">Who gets it ({data.people.length})</h2>
                {data.people.length === 0 && <p className="px-4 py-4 text-[13px] text-gray-500">Nobody yet. The box is at the foot of the blog and of every article.</p>}
                <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {data.people.slice(0, 200).map((p) => (
                    <li key={p.email} className="px-4 py-2">
                      <div className="text-[13px] text-gray-900 break-all">{p.email}</div>
                      <div className="text-[11.5px] text-gray-500">since {day(p.since)}{p.source ? `, from ${p.source}` : ''}</div>
                    </li>
                  ))}
                </ul>
                {data.people.length > 200 && <p className="px-4 py-2 text-[12px] text-gray-500 border-t border-gray-100">and {data.people.length - 200} more</p>}
              </section>

              <section className="rounded-lg border border-gray-200 bg-raised">
                <h2 className="px-4 py-2.5 border-b border-gray-200 text-sm font-semibold text-gray-900">What has gone</h2>
                {data.history.length === 0 && <p className="px-4 py-4 text-[13px] text-gray-500">Nothing yet. The first email goes on {day(data.upcoming.issue)}.</p>}
                <ul className="divide-y divide-gray-100">
                  {data.history.map((h) => (
                    <li key={h.issue} className="px-4 py-2 flex items-baseline justify-between gap-3">
                      <span className="text-[13px] text-gray-900">{day(h.issue)}</span>
                      <span className="text-[12px] text-gray-500 text-right">{h.sent ? `${h.slugs.length} post${h.slugs.length === 1 ? '' : 's'} to ${h.sent}` : h.note || 'nothing sent'}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
