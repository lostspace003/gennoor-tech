'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

interface Info { name: string; state: string; confirmed: boolean; current: string; proposed: string; message: string; teamsUrl: string }

function Respond() {
  const sp = useSearchParams()
  const id = sp.get('id') || '', token = sp.get('t') || ''
  const [info, setInfo] = useState<Info | null>(null)
  const [bad, setBad] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState<{ state: 'accepted' | 'declined'; when?: string; teamsUrl?: string } | null>(null)

  useEffect(() => {
    fetch(`/api/tech-call/respond?id=${encodeURIComponent(id)}&t=${encodeURIComponent(token)}`)
      .then(async r => (r.ok ? setInfo(await r.json()) : setBad(true)))
      .catch(() => setBad(true))
  }, [id, token])

  const answer = async (action: 'yes' | 'no') => {
    setBusy(true); setError('')
    const r = await fetch('/api/tech-call/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, token, action }) })
    const d = await r.json().catch(() => ({}))
    setBusy(false)
    if (!r.ok) { setError(d.error || 'Something went wrong. Please try again.'); return }
    setDone({ state: d.state, when: d.when, teamsUrl: d.teamsUrl })
  }

  const card = 'bg-raised border border-gray-200 rounded-2xl p-6 sm:p-8'
  let body
  if (bad) body = <p className="text-gray-700">This link is not valid. Please use the link in your latest email from Gennoor Tech.</p>
  else if (!info) body = <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
  else if (done?.state === 'accepted') {
    body = (<>
      <h1 className="font-heading text-2xl font-bold text-gray-900">Your call is confirmed</h1>
      <p className="mt-3 text-gray-700">New time: <strong>{done.when}</strong>. An updated invite and a confirmation email are on their way.</p>
      {done.teamsUrl && <a href={done.teamsUrl} className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium">Join on Microsoft Teams</a>}
    </>)
  } else if (done?.state === 'declined' || info.state === 'declined') {
    body = (<>
      <h1 className="font-heading text-2xl font-bold text-gray-900">Thank you for letting us know</h1>
      <p className="mt-3 text-gray-700">We have told our team. {info.confirmed ? 'Your current time stays as it is.' : 'Your request stays open.'} You can also pick a time that suits you.</p>
      <Link href="/training" className="inline-block mt-5 text-sm text-primary-600">Request another time ›</Link>
    </>)
  } else if (info.state === 'accepted') {
    body = (<>
      <h1 className="font-heading text-2xl font-bold text-gray-900">Already confirmed</h1>
      <p className="mt-3 text-gray-700">Your call is set for <strong>{info.current}</strong>.</p>
      {info.teamsUrl && <a href={info.teamsUrl} className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium">Join on Microsoft Teams</a>}
    </>)
  } else if (info.state !== 'awaiting') {
    body = <p className="text-gray-700">This suggestion is no longer open. Please check your latest email from Gennoor Tech.</p>
  } else {
    body = (<>
      <h1 className="font-heading text-2xl font-bold text-gray-900">Hi {info.name}, can we move your call?</h1>
      {info.message && <p className="mt-4 p-3 rounded-xl bg-gray-50 text-gray-700 whitespace-pre-wrap">{info.message}</p>}
      <dl className="mt-4 text-sm space-y-1">
        <div><dt className="inline text-gray-500">{info.confirmed ? 'Current time: ' : 'You asked for: '}</dt><dd className="inline">{info.current}</dd></div>
        <div><dt className="inline text-gray-500">Suggested time: </dt><dd className="inline font-semibold text-gray-900">{info.proposed}</dd></div>
      </dl>
      {error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}
      <div className="flex flex-wrap gap-3 mt-6">
        <button disabled={busy} onClick={() => answer('yes')} className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50">{busy ? 'Working…' : 'Yes, confirm the new time'}</button>
        <button disabled={busy} onClick={() => answer('no')} className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">No, this does not work</button>
      </div>
      <p className="mt-4 text-xs text-gray-500">Times are shown in your local time zone. After you confirm, you get an updated invite with the Teams link.</p>
    </>)
  }

  return <main className="max-w-xl mx-auto px-4 sm:px-6 py-10"><div className={card}>{body}</div></main>
}

export default function TechCallRespondPage() {
  return <Suspense fallback={null}><Respond /></Suspense>
}
