'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import InfoTip from '@/components/admin/InfoTip'
import CarouselPanel from '@/components/admin/CarouselPanel'
import { ListToolbar, Pager, useListView } from '@/components/admin/ListControls'

interface Share { urn: string; as: 'member' | 'organization'; at: string }
interface Status {
  configured: boolean; connected: boolean; expired: boolean; expiresAt: string | null; daysLeft: number; expiringSoon: boolean; orgDaysLeft: number | null
  memberName: string; orgName: string; canPostAsOrg: boolean
  posts: { slug: string; title: string; date: string; shares: Share[] }[]
}

interface Ads { configured: boolean; connected: boolean; expired: boolean; expiresAt: string | null; accountId: string; conversions: string[]; lastSyncAt: string | null; leadsImported: number }

interface CPlan { title: string; caption: string; slides: { title: string; body?: string; bullets?: string[] }[] }

export default function LinkedInPage() {
  const [cTopic, setCTopic] = useState('')
  const [cUrl, setCUrl] = useState('')
  const [plan, setPlan] = useState<CPlan | null>(null)
  const [cAt, setCAt] = useState('')
  const [jobs, setJobs] = useState<{ id: string; kind: string; at: string; as: string; title: string; state: string; error?: string; urn?: string }[]>([])
  const [delUrl, setDelUrl] = useState('')
  const loadJobs = useCallback(async () => { const r = await fetch('/api/admin/linkedin/queue').catch(() => null); if (r?.ok) setJobs((await r.json()).jobs) }, [])
  async function jobAction(action: 'cancel' | 'delete' | 'deleteUrn', id?: string) {
    if (action !== 'cancel' && !confirm('Delete this post from LinkedIn? This cannot be undone.')) return
    setBusy(`j-${id || 'url'}`); setError(''); setNotice('')
    const r = await fetch('/api/admin/linkedin/queue', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, id, urn: delUrl, as: 'organization' }) })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) setError(j.error || 'Failed'); else { setNotice(action === 'cancel' ? 'Schedule removed.' : 'Post deleted from LinkedIn.'); setDelUrl('') }
    setBusy(''); loadJobs()
  }
  useEffect(() => { loadJobs() }, [loadJobs])
  async function carousel(action: 'plan' | 'pdf' | 'publish', as?: 'organization' | 'member') {
    setBusy(`c-${action}`); setError(''); setNotice('')
    const r = await fetch('/api/admin/linkedin/carousel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, topic: cTopic, url: cUrl, plan, as, ...(action === 'publish' && cAt ? { at: new Date(cAt).toISOString() } : {}) }) })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) setError(j.error || 'Failed')
    else if (action === 'plan') setPlan(j.plan)
    else if (action === 'pdf') { const a = document.createElement('a'); a.href = `data:application/pdf;base64,${j.pdf}`; a.download = 'carousel.pdf'; a.click() }
    else setNotice(j.scheduled ? `Carousel scheduled for ${new Date(j.scheduled).toLocaleString()}.` : 'Carousel posted to LinkedIn.')
    setBusy(''); loadJobs()
  }
  const [ads, setAds] = useState<Ads | null>(null)
  const [s, setS] = useState<Status | null>(null)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState('')
  const vp = useListView(s?.posts ?? [], { date: p => p.date, text: p => p.title, pageSize: 10 })

  const load = useCallback(async () => {
    const r = await fetch('/api/admin/linkedin').catch(() => null)
    if (!r || !r.ok) { setError(`Could not load (${r?.status ?? 'offline'})`); return }
    setS(await r.json())
    const a = await fetch('/api/admin/linkedin/ads').catch(() => null)
    if (a?.ok) setAds(await a.json())
  }, [])

  async function adsAction(action: 'sync' | 'rules') {
    setBusy(action); setError(''); setNotice('')
    const r = await fetch('/api/admin/linkedin/ads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) })
    const j = await r.json().catch(() => ({}))
    if (!r.ok) setError(j.error || 'Failed')
    else setNotice(action === 'sync' ? `Lead Gen sync done: ${j.imported} new of ${j.scanned} checked.` : 'Conversion rules are ready on the ad account.')
    setBusy('')
    load()
  }
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
    <div className="max-w-3xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-xl font-semibold tracking-tight">LinkedIn publishing<InfoTip text="Share Gennoor blog posts on LinkedIn through the official LinkedIn developer API. Connect once, then post with one click." /></h1>
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

          {s.orgDaysLeft !== null && s.orgDaysLeft <= 10 && (
            <div className="mb-3 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-sm px-3 py-2">
              {s.orgDaysLeft < 0 ? 'The company page login has expired.' : `The company page login expires in ${s.orgDaysLeft} day${s.orgDaysLeft === 1 ? '' : 's'}.`} Use "Connect + company page" to renew it, or page posts stop.
            </div>
          )}
          <div className="rounded-lg border border-gray-200 bg-white p-3 mb-4 text-sm">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-3">
              <span>{dot(s.connected)}{s.connected ? `Connected as ${s.memberName || 'member'}` : 'Not connected'}<InfoTip text="Whether the site holds a valid LinkedIn login token for you. It lets the site post on your behalf; it never sees your password." /></span>
              {s.connected && <span>{dot(s.canPostAsOrg)}{s.canPostAsOrg ? `Page: ${s.orgName}` : 'Company page not linked'}<InfoTip text="Posting as the Gennoor company page needs LinkedIn's Community Management API, which must be approved on the LinkedIn app first. Until then only 'Post as me' works." /></span>}
              {s.expiresAt && s.connected && <span className="text-gray-500">Token valid until {new Date(s.expiresAt).toLocaleDateString()}<InfoTip text="LinkedIn logins last about 60 days and cannot renew themselves. Click Reconnect before this date, or posting stops." /></span>}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a href="/api/linkedin/connect" className="px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900">{s.connected ? 'Reconnect (member)' : 'Connect LinkedIn'}</a><InfoTip text="Opens LinkedIn so you can approve the app. Grants permission to post as you (Share on LinkedIn)." />
              <a href="/api/linkedin/connect?org=1" className="px-3.5 py-2 text-[13px] font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:border-gray-400">Connect + company page</a><InfoTip text="Also asks for company-page permissions. LinkedIn will refuse this until the Community Management API is approved for the app." />
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3 mb-4 text-sm">
            <div className="font-medium mb-2">Carousel PDF<InfoTip text="The agent turns a topic or a web page into swipeable cards, or you upload your own PDF. Download it, post it now, or schedule it." /></div>
            <CarouselPanel />
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-3 mb-4 text-sm">
            <div className="font-medium mb-2">Scheduled &amp; posted<InfoTip text="Carousels and event posts you scheduled or published from here. Delete removes the post from LinkedIn." /></div>
            {jobs.length === 0 ? <div className="text-gray-500">Nothing yet.</div> : (
              <ul className="divide-y divide-gray-100">{jobs.filter(j => j.state !== 'deleted').slice(0, 12).map(j => (
                <li key={j.id} className="py-1.5 flex items-center gap-2">
                  <div className="min-w-0 flex-1"><div className="truncate text-[13px]">{j.title}</div><div className="text-xs text-gray-500">{j.kind} · {j.as} · {j.state === 'pending' ? `goes out ${new Date(j.at).toLocaleString()}` : j.state}{j.error ? ` · ${j.error}` : ''}</div></div>
                  {j.state === 'done' && j.urn && <button disabled={!!busy} onClick={() => jobAction('delete', j.id)} className="px-2.5 py-1 text-xs rounded-md border border-red-200 text-red-700 disabled:opacity-40">Delete</button>}
                  {(j.state === 'pending' || j.state === 'failed') && <button disabled={!!busy} onClick={() => jobAction('cancel', j.id)} className="px-2.5 py-1 text-xs rounded-md border border-gray-200 disabled:opacity-40">Remove</button>}
                </li>))}</ul>
            )}
            <div className="flex gap-2 mt-3">
              <input value={delUrl} onChange={e => setDelUrl(e.target.value)} placeholder="Delete any company-page post: paste its LinkedIn link" className="flex-1 rounded-md border border-gray-200 px-3 py-2 text-[13px]" />
              <button disabled={!!busy || !delUrl} onClick={() => jobAction('deleteUrn')} className="px-3 py-2 text-[13px] rounded-md border border-red-200 text-red-700 disabled:opacity-40">Delete</button>
            </div>
          </div>

          {ads && (
            <div className="rounded-lg border border-gray-200 bg-white p-3 mb-4 text-sm">
              <div className="font-medium mb-2">Lead Gen + Conversions (LinkedIn ads)<InfoTip text="Lead Gen Form answers are pulled into the CRM every 15 minutes. When a lead becomes Qualified or Won, or a call is booked, LinkedIn is told so its ads can learn what works." /></div>
              {!ads.configured ? (
                <div className="text-amber-900 space-y-1.5">
                  <div className="font-medium">One-time setup: add the app&apos;s Client Secret</div>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Open the app&apos;s <a className="underline" href="https://www.linkedin.com/developers/apps/265066422/auth" target="_blank" rel="noreferrer">Auth tab on LinkedIn Developers</a> (signed in as the app owner).</li>
                    <li>Under <b>Application credentials</b>, click <b>Show</b> next to <b>Primary Client Secret</b> and copy it. Never paste it in chat or email.</li>
                    <li>Open <a className="underline" href="https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites" target="_blank" rel="noreferrer">App Services in the Azure portal</a> &rarr; <b>gennoor-tech</b> &rarr; <b>Settings &rarr; Environment variables</b> &rarr; <b>App settings</b> &rarr; <b>Add</b>.</li>
                    <li>Name <code>LINKEDIN_ADS_CLIENT_SECRET</code>, value the secret. Confirm <code>LINKEDIN_ADS_CLIENT_ID</code> is <code>7795edhe1wtsd1</code>. Click <b>Apply</b> and wait for the restart.</li>
                    <li>Reload this page, press <b>Connect ads</b>, then <b>Create conversion rules</b> and <b>Sync leads now</b>.</li>
                  </ol>
                  <div className="text-xs">Or in a terminal: <code>az webapp config appsettings set -g rg-gennoor-tech -n gennoor-tech --settings LINKEDIN_ADS_CLIENT_SECRET=&lt;secret&gt;</code>. Leads only arrive once the ad account has a payment method (<a className="underline" href="https://www.linkedin.com/campaignmanager/accounts" target="_blank" rel="noreferrer">Campaign Manager</a>).</div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-3">
                    <span>{dot(ads.connected)}{ads.connected ? 'Connected' : ads.expired ? 'Login expired' : 'Not connected'}</span>
                    <span className="text-gray-500">Ad account {ads.accountId || 'not set'}</span>
                    <span className="text-gray-500">{ads.leadsImported} leads imported{ads.lastSyncAt ? `, last sync ${new Date(ads.lastSyncAt).toLocaleString()}` : ''}</span>
                    <span className="text-gray-500">{ads.conversions.length}/3 conversion rules</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href="/api/linkedin/connect?ads=1" className="px-3.5 py-2 text-[13px] font-medium bg-gray-800 text-white rounded-md hover:bg-gray-900">{ads.connected ? 'Reconnect ads' : 'Connect ads'}</a>
                    <button disabled={!ads.connected || !!busy} onClick={() => adsAction('sync')} className="px-3.5 py-2 text-[13px] rounded-md border border-gray-200 bg-white disabled:opacity-40 hover:border-gray-400">{busy === 'sync' ? '…' : 'Sync leads now'}</button>
                    <button disabled={!ads.connected || !!busy} onClick={() => adsAction('rules')} className="px-3.5 py-2 text-[13px] rounded-md border border-gray-200 bg-white disabled:opacity-40 hover:border-gray-400">{busy === 'rules' ? '…' : 'Create conversion rules'}</button>
                  </div>
                </>
              )}
            </div>
          )}

          <ListToolbar v={vp} noun="post" />
          <ul className="divide-y divide-gray-100 rounded-lg border border-gray-200 bg-white">
            {vp.rows.map(p => {
              const sharedMember = p.shares.some(x => x.as === 'member')
              const sharedOrg = p.shares.some(x => x.as === 'organization')
              return (
                <li key={p.slug} className="px-3 py-2 flex items-center gap-2 hover:bg-gray-50">
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium truncate">{p.title}</div>
                    <div className="text-xs text-gray-500">{p.date}{sharedMember && <span className="ml-2 text-emerald-700">✓ shared by you</span>}{sharedOrg && <span className="ml-2 text-emerald-700">✓ shared on page</span>}</div>
                  </div>
                  <button disabled={!s.connected || !!busy || sharedMember} onClick={() => share(p.slug, ['member'])}
                    className="px-3 py-1.5 text-[13px] rounded-md border border-gray-200 bg-white whitespace-nowrap disabled:opacity-40 hover:border-gray-400">
                    {busy === p.slug ? '…' : 'Post as me'}
                  </button>
                  <button disabled={!s.canPostAsOrg || !!busy || sharedOrg} onClick={() => share(p.slug, ['organization'])}
                    className="px-3 py-1.5 text-[13px] rounded-md border border-gray-200 bg-white whitespace-nowrap disabled:opacity-40 hover:border-gray-400">
                    Post to page
                  </button>
                </li>
              )
            })}
          </ul>
          <Pager v={vp} />
        </>
      )}
    </div>
  )
}
