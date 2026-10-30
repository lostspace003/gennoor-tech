'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

interface Share { urn: string; as: 'member' | 'organization'; at: string }
interface Status {
  configured: boolean; connected: boolean; expired: boolean; expiresAt: string | null; daysLeft: number; expiringSoon: boolean
  memberName: string; orgName: string; canPostAsOrg: boolean
  posts: { slug: string; title: string; date: string; shares: Share[] }[]
}

export default function LinkedInPage() {
  const [s, setS] = useState<Status | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/linkedin')
    if (!r.ok) { setError(`Could not load (${r.status})`); return }
    setS(await r.json())
  }, [])
  useEffect(() => {
    load()
    const p = new URLSearchParams(window.location.search)
    if (p.get('error')) setError(p.get('error') || '')
    if (p.get('connected')) setNotice('LinkedIn connected.')
  }, [load])

  async function share(slug: string, as: ('member' | 'organization')[]) {
    setBusy(slug); setError(''); setNotice('')
    const r = await fetch('/api/admin/linkedin', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug, as }) })
    const j = await r.json().catch(() => ({}))
    if (j.done?.length) setNotice(`Posted (${j.done.join(', ')}).`)
    if (j.errors?.length) setError(j.errors.join(' · '))
    else if (!r.ok && j.error) setError(j.error)
    setBusy('')
    load()
  }

  const dot = (on: boolean) => <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${on ? 'bg-emerald-500' : 'bg-gray-300'}`} />

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">LinkedIn publishing</h1>
        <Link href="/admin" className="text-sm text-gray-600 hover:underline">← Admin</Link>
      </div>

      {error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{error}</div>}
      {notice && <div className="mb-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-3 py-2">{notice}</div>}

      {!s ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
        <>
          {!s.configured && (
            <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-sm px-3 py-2">
              Set <code>LINKEDIN_CLIENT_ID</code> and <code>LINKEDIN_CLIENT_SECRET</code> in the App Service settings first.
            </div>
          )}
          {(s.expired || s.expiringSoon) && (s.connected || s.expired) && (
            <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-sm px-3 py-2">
              {s.expired ? 'The LinkedIn token has expired.' : `The LinkedIn token expires in ${s.daysLeft} day${s.daysLeft === 1 ? '' : 's'}.`} Reconnect to keep posting.
            </div>
          )}

          <div className="rounded-lg border border-gray-200 bg-white p-4 mb-5 text-sm">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-3">
              <span>{dot(s.connected)}{s.connected ? `Connected as ${s.memberName || 'member'}` : 'Not connected'}</span>
              {s.connected && <span>{dot(s.canPostAsOrg)}{s.canPostAsOrg ? `Page: ${s.orgName}` : 'Company page not linked'}</span>}
              {s.expiresAt && s.connected && <span className="text-gray-500">Token valid until {new Date(s.expiresAt).toLocaleDateString()}</span>}
            </div>
            <div className="flex gap-2">
              <a href="/api/linkedin/connect" className="px-3 py-1.5 text-xs font-medium bg-gray-700 text-white rounded-md">{s.connected ? 'Reconnect (member)' : 'Connect LinkedIn'}</a>
              <a href="/api/linkedin/connect?org=1" className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:border-gray-400">Connect + company page</a>
            </div>
          </div>

          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            {s.posts.map(p => {
              const sharedMember = p.shares.some(x => x.as === 'member')
              const sharedOrg = p.shares.some(x => x.as === 'organization')
              return (
                <li key={p.slug} className="p-3 flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{p.title}</div>
                    <div className="text-xs text-gray-500">{p.date}{sharedMember && ' · shared by you'}{sharedOrg && ' · shared on page'}</div>
                  </div>
                  <button disabled={!s.connected || !!busy || sharedMember} onClick={() => share(p.slug, ['member'])}
                    className="px-2.5 py-1 text-xs rounded-md border border-gray-200 disabled:opacity-40 hover:border-gray-400">
                    {busy === p.slug ? '…' : 'Post as me'}
                  </button>
                  <button disabled={!s.canPostAsOrg || !!busy || sharedOrg} onClick={() => share(p.slug, ['organization'])}
                    className="px-2.5 py-1 text-xs rounded-md border border-gray-200 disabled:opacity-40 hover:border-gray-400">
                    Post to page
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
