'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertTriangle, Check, Copy, Download, ExternalLink, FileSpreadsheet, GraduationCap, Mail, RefreshCw, Search, Send, X } from 'lucide-react'
import {
  CAMPAIGN_FROM, UNI_COURSES, UNI_STAGES, UNI_STAGE_HINTS, UNI_STAGE_LABELS, waitingForAnswer, whyNotReady,
  type University, type UniStage, type UniFormAnswer,
} from '@/lib/crm/universities-types'
import { entryPath, type Campaign } from '@/data/partnership-campaigns'
import { CPN_BADGE_URL, CPN_LINE } from '@/lib/crm/universities-email'
import { COUNTRY_NOTES } from '@/data/university-markets'
import { teamMember } from '@/lib/crm/team'
import { STAGE_DOT, STAGE_PILL, emailWord } from './university-shared'
import UniversityDashboard from './UniversityDashboard'
import AnswerBody from './UniversityAnswer'
import { useCrm } from './CrmContext'
import { Hint, api, formatDateTime, timeAgo } from './shared'

/**
 * The University Partnership campaign (docs/CRM.md, section 15): 27 universities, their 55 contacts, the first email
 * to each, the evaluation access, the call and the partnership, closed end to end on one page. It is apart from the
 * leads on purpose: nothing here is in Today, the email series or the evening report.
 */

type Tab = 'dashboard' | 'universities' | 'answers' | 'emails' | 'setup'
interface Hour { used: number; limit: number }

const cap = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

export default function UniversitiesView({ campaign }: { campaign: Campaign }) {
  const One = cap(campaign.one), Many = cap(campaign.many)
  const { notify, userEmail } = useCrm()
  const router = useRouter()
  const [who, setWho] = useState<'' | 'mine' | 'free'>('')
  const [unis, setUnis] = useState<University[] | null>(null)
  const [unmatched, setUnmatched] = useState<UniFormAnswer[]>([])
  const [hour, setHour] = useState<Hour>({ used: 0, limit: 60 })
  const [error, setError] = useState('')
  const [tab, setTab] = useState<Tab>('dashboard')
  const [stage, setStage] = useState<UniStage | ''>('')
  const [region, setRegion] = useState('')
  const [wave, setWave] = useState<'' | '1' | '2'>('')
  const [q, setQ] = useState('')
  const [checking, setChecking] = useState(false)
  const [mailNote, setMailNote] = useState('')

  const load = useCallback(async () => {
    try {
      const d = await api<{ universities: University[]; unmatched: UniFormAnswer[]; hour: Hour }>(`/api/admin/universities?c=${campaign.key}`, { cache: 'no-store' })
      setUnis(d.universities); setUnmatched(d.unmatched || []); setHour(d.hour); setError('')
    } catch (e: any) { setError(e.message) }
  }, [campaign.key])

  /** Has it gone, and did anyone write back? Asked when the page opens and when "Check now" is pressed. */
  const check = useCallback(async (loud: boolean) => {
    setChecking(true)
    try {
      const r = await api<{ confirmed: number; failed: number; replies: number; note: string }>('/api/admin/universities/check', { method: 'POST', body: JSON.stringify({ campaign: campaign.key }) })
      setMailNote(r.note)
      if (r.confirmed || r.failed || r.replies) await load()
      if (loud) notify(r.replies ? `${r.replies} new repl${r.replies === 1 ? 'y' : 'ies'}` : 'Nothing new')
    } catch (e: any) { if (loud) notify(e.message, true) } finally { setChecking(false) }
  }, [load, notify, campaign.key])

  useEffect(() => { load().then(() => check(false)) }, [load, check])
  // While the page is open, look again every five minutes
  useEffect(() => { const t = setInterval(() => check(false), 5 * 60_000); return () => clearInterval(t) }, [check])

  const all = unis || []
  const counts = Object.fromEntries(UNI_STAGES.map((s) => [s, all.filter((u) => u.stage === s).length])) as Record<UniStage, number>
  const regions = [...new Set(all.map((u) => u.region))].sort()
  const waiting = all.filter(waitingForAnswer).length
  const answerCount = all.reduce((n, u) => n + (u.formAnswers?.length || 0), 0) + unmatched.length
  const shown = useMemo(() => {
    const t = q.trim().toLowerCase()
    return all
      .filter((u) => (!stage || u.stage === stage) && (!region || u.region === region) && (!wave || String(u.wave) === wave)
        && (!who || (who === 'mine' ? u.owner === userEmail : !u.owner))
        && (!t || `${u.name} ${u.country} ${u.city} ${u.decisionMaker} ${u.contacts.map((c) => c.name).join(' ')}`.toLowerCase().includes(t)))
      // Those who wrote to us first, then the first wave in its own order
      .sort((a, b) => Number(waitingForAnswer(b)) - Number(waitingForAnswer(a)) || a.wave - b.wave || a.id.localeCompare(b.id))
  }, [all, stage, region, wave, q, who, userEmail])


  if (error && !unis) return <div className="p-6"><p className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</p></div>
  if (!unis) return <p className="p-6 text-sm text-gray-500">Reading…</p>

  return (
    <div className="p-4 sm:p-6 max-w-7xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><GraduationCap className="w-5 h-5 text-primary-600" />{campaign.label}</h1>
          <p className="mt-1 text-sm text-gray-600 max-w-2xl">{all.length} {campaign.many}. {campaign.blurb} Every email goes through Outlook from {CAMPAIGN_FROM} with Jalal and Yusuf in copy. Nothing goes by itself: you read it and press Send.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500" title="The CRM shares one allowance of emails an hour with the whole site">{hour.used} of {hour.limit} emails this hour</span>
          <button type="button" onClick={() => check(true)} disabled={checking} className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-gray-400 bg-raised text-xs font-semibold text-gray-900 px-3 py-1.5 rounded-full disabled:opacity-60">
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />Check replies
          </button>
        </div>
      </div>
      {mailNote && <p className="mt-3 rounded-lg bg-amber-50 text-amber-800 text-sm px-3 py-2">{mailNote}</p>}

      {/* Where every university stands, in one row. Pressing one filters the list; pressing it again shows all. */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label={`${Many} at each stage`}>
        {UNI_STAGES.map((s) => {
          const on = stage === s
          return (
            <Hint key={s} text={UNI_STAGE_HINTS[s]} className="flex flex-1 min-w-[6rem]">
              <button type="button" aria-pressed={on} onClick={() => { setStage(on ? '' : s); setTab('universities') }}
                className={`w-full rounded-lg border px-3 py-2 text-left transition-colors ${on ? 'border-primary-400 bg-primary-50' : 'border-gray-200 bg-raised hover:border-primary-300'}`}>
                <span className="flex items-center gap-1.5 text-[11px] text-gray-500"><span className={`w-1.5 h-1.5 rounded-full ${STAGE_DOT[s]}`} />{UNI_STAGE_LABELS[s]}</span>
                <span className="block text-lg font-semibold leading-tight text-gray-900 tabular-nums">{counts[s]}</span>
              </button>
            </Hint>
          )
        })}
      </div>
      {unmatched.length > 0 && <p className="mt-3 text-sm text-amber-800 font-medium">{unmatched.length} form answer{unmatched.length === 1 ? '' : 's'} came through the general link. <button type="button" onClick={() => setTab('answers')} className="underline">Put {unmatched.length === 1 ? 'it' : 'them'} where {unmatched.length === 1 ? 'it belongs' : 'they belong'}</button>.</p>}
      {waiting > 0 && <p className="mt-3 text-sm text-red-700 font-medium">{waiting} {waiting === 1 ? campaign.one : campaign.many} {waiting === 1 ? 'has' : 'have'} written back and {waiting === 1 ? 'is' : 'are'} waiting for your answer.</p>}

      <div className="mt-5 flex gap-1 border-b border-gray-200 overflow-x-auto" role="tablist">
        {([['dashboard', 'Dashboard'], ['universities', Many], ['answers', `Form answers${answerCount ? ` (${answerCount})` : ''}`], ['emails', 'Emails'], ['setup', 'Setup']] as Array<[Tab, string]>).map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`px-3.5 py-2 text-sm font-medium whitespace-nowrap -mb-px border-b-2 ${tab === k ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>{label}</button>
        ))}
      </div>

      {tab === 'dashboard' && <UniversityDashboard unis={all} unmatched={unmatched.length} one={campaign.one} />}

      {tab === 'answers' && <AnswersTab unis={all} unmatched={unmatched} onChanged={load} />}

      {tab === 'universities' && (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-surface px-3 py-2 w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`${One}, place, person`} aria-label={`Search ${campaign.many}`} className="w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400" />
            </label>
            <select value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Region" className="rounded-lg border border-gray-200 bg-surface px-3 py-2 text-sm text-gray-900">
              <option value="">Every region</option>
              {regions.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <select value={wave} onChange={(e) => setWave(e.target.value as '' | '1' | '2')} aria-label="Wave" className="rounded-lg border border-gray-200 bg-surface px-3 py-2 text-sm text-gray-900">
              <option value="">Both waves</option>
              <option value="1">Wave 1 · high priority</option>
              <option value="2">Wave 2 · the rest</option>
            </select>
            <select value={who} onChange={(e) => setWho(e.target.value as '' | 'mine' | 'free')} aria-label="Who works it" className="rounded-lg border border-gray-200 bg-surface px-3 py-2 text-sm text-gray-900">
              <option value="">Everyone's</option>
              <option value="mine">Mine</option>
              <option value="free">Not picked up yet</option>
            </select>
            <span className="text-xs text-gray-500">{shown.length} of {all.length}</span>
          </div>
          <div className="mt-3 overflow-x-auto rounded-xl border border-gray-200 bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                  <th className="px-4 py-2.5 font-medium">{One}</th>
                  <th className="px-4 py-2.5 font-medium">Main contact</th>
                  <th className="px-4 py-2.5 font-medium">Worked by</th>
                  <th className="px-4 py-2.5 font-medium">Stage</th>
                  <th className="px-4 py-2.5 font-medium">First email</th>
                  <th className="px-4 py-2.5 font-medium">Last change</th>
                </tr>
              </thead>
              <tbody>
                {shown.map((u) => {
                  const w = emailWord(u)
                  return (
                    <tr key={u.id} onClick={() => router.push(entryPath(u.id))} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer align-top">
                      <td className="px-4 py-2.5 max-w-[280px]">
                        <Link href={entryPath(u.id)} onClick={(e) => e.stopPropagation()} className="font-medium text-gray-900 hover:text-primary-700">{u.name}</Link>
                        <div className="text-xs text-gray-500">{u.country}{u.city ? ` · ${u.city}` : ''} · <span className={u.wave === 1 ? 'text-primary-700 font-medium' : ''}>Wave {u.wave}</span></div>
                      </td>
                      <td className="px-4 py-2.5 max-w-[240px]">
                        <div className="text-gray-900 truncate">{u.decisionMaker}</div>
                        <div className="text-xs text-gray-500 truncate">{u.designation}</div>
                      </td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-sm">{u.owner ? <span className="text-gray-900">{u.owner === userEmail ? 'You' : teamMember(u.owner).name}</span> : <span className="text-gray-500">Nobody yet</span>}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap"><span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${STAGE_PILL[u.stage]}`}>{UNI_STAGE_LABELS[u.stage]}</span></td>
                      <td className="px-4 py-2.5 whitespace-nowrap"><span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${w.tone}`}>{w.word}</span></td>
                      <td className="px-4 py-2.5 whitespace-nowrap text-xs text-gray-500">{timeAgo(u.updatedAt)}</td>
                    </tr>
                  )
                })}
                {!shown.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">Nothing matches.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'emails' && (
        <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-surface">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                <th className="px-4 py-2.5 font-medium">{One}</th>
                <th className="px-4 py-2.5 font-medium">To</th>
                <th className="px-4 py-2.5 font-medium">Subject</th>
                <th className="px-4 py-2.5 font-medium">State</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {[...all].sort((a, b) => a.wave - b.wave || a.id.localeCompare(b.id)).map((u) => {
                const w = emailWord(u)
                const why = whyNotReady(u)
                return (
                  <tr key={u.id} className="border-b border-gray-100 last:border-0 align-top">
                    <td className="px-4 py-2.5 max-w-[240px]"><div className="font-medium text-gray-900 truncate">{u.name}</div><div className="text-xs text-gray-500">Wave {u.wave} · {u.country}</div></td>
                    <td className="px-4 py-2.5 max-w-[220px] text-xs text-gray-700 break-words">{u.draft.to.join(', ') || <span className="text-gray-400">no address yet</span>}</td>
                    <td className="px-4 py-2.5 max-w-[320px] text-gray-700"><span className="line-clamp-2">{u.draft.subject}</span>{why && !u.emails.length && <span className="block text-xs text-amber-700 mt-0.5">{why}</span>}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap"><span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${w.tone}`}>{w.word}</span></td>
                    <td className="px-4 py-2.5 text-right"><Link href={entryPath(u.id)} className="text-primary-700 text-sm font-medium hover:underline">Open</Link></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'setup' && <SetupTab campaign={campaign} />}

    </div>
  )
}

// ---------------------------------------------------------------------------------------------------------------

/** Every answer to the evaluation form, newest first. One that came through the general link is put on its university here. */
function AnswersTab({ unis, unmatched, onChanged }: { unis: University[]; unmatched: UniFormAnswer[]; onChanged: () => Promise<void> }) {
  const { notify } = useCrm()
  const [pick, setPick] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState('')
  const rows = [
    ...unmatched.map((a) => ({ a, u: null as University | null })),
    ...unis.flatMap((u) => (u.formAnswers || []).map((a) => ({ a, u }))),
  ].sort((x, y) => Number(!x.u) === Number(!y.u) ? y.a.at.localeCompare(x.a.at) : Number(!y.u) - Number(!x.u))
  const attach = async (answer: string) => {
    const id = pick[answer]
    if (!id) { notify('Choose which one first', true); return }
    setBusy(answer)
    try { await api('/api/admin/universities', { method: 'POST', body: JSON.stringify({ action: 'attach', id, answer }) }); notify('The answer is on its page now'); await onChanged() }
    catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }
  if (!rows.length) return <p className="mt-6 text-sm text-gray-600">Nobody has answered the form yet. An answer shows here and on its own page the moment it is sent.</p>
  return (
    <ul className="mt-4 grid gap-3 lg:grid-cols-2">
      {rows.map(({ a, u }) => (
        <li key={a.id} className={`rounded-xl border bg-surface p-4 ${u ? 'border-gray-200' : 'border-amber-300'}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              {u ? <Link href={`${entryPath(u.id)}?tab=evaluation`} className="font-semibold text-gray-900 hover:text-primary-700">{u.name}</Link> : <span className="font-semibold text-gray-900">{a.institution}</span>}
              <p className="text-xs text-gray-500">{formatDateTime(a.at)} · {u ? 'through its own link' : 'through the general link'}</p>
            </div>
            {u && <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${STAGE_PILL[u.stage]}`}>{UNI_STAGE_LABELS[u.stage]}</span>}
          </div>
          <AnswerBody a={a} />
          {!u && (
            <div className="mt-3 flex flex-wrap gap-2">
              <select value={pick[a.id] || ''} onChange={(e) => setPick((p) => ({ ...p, [a.id]: e.target.value }))} aria-label="Where this answer belongs" className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-raised px-3 py-1.5 text-sm text-gray-900">
                <option value="">Which one is it?</option>
                {unis.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>
              <button type="button" onClick={() => attach(a.id)} disabled={busy === a.id} className="rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold px-3 py-1.5 disabled:opacity-50">Put it there</button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

function SetupTab({ campaign }: { campaign: Campaign }) {
  const { notify } = useCrm()
  const general = 'https://www.gennoor.com/evaluate'
  const copy = async () => { try { await navigator.clipboard.writeText(general); notify('The general link is copied') } catch { notify(general) } }
  const countries = campaign.key === 'universities' ? COUNTRY_NOTES.filter((c) => c.country !== 'Total Global') : []
  return (
    <div className="mt-4 grid lg:grid-cols-2 gap-4">
      <section className="rounded-xl border border-gray-200 bg-surface p-4">
        <h2 className="text-sm font-semibold text-gray-900">The evaluation form</h2>
        <p className="mt-1 text-sm text-gray-600">Our own page on gennoor.com, in the Gennoor look. Every {campaign.one} has its own link to it, put into its emails by itself: the form opens with its name filled in, and the answer lands on its page here, with the courses on its evaluation. You are told by email at admin@, with Jalal and Yusuf in copy.</p>
        <p className="mt-2 text-sm text-gray-600">The general link is for anyone else (a colleague the email was forwarded to). Its answers wait under Form answers until you say which {campaign.one} they belong to.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href="/evaluate" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-raised px-3 py-1.5 text-sm font-medium text-gray-900 hover:border-gray-400"><ExternalLink className="w-4 h-4" />Open the form</a>
          <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-raised px-3 py-1.5 text-sm font-medium text-gray-900 hover:border-gray-400"><Copy className="w-4 h-4" />Copy the general link</button>
          <a href={`/api/admin/universities/export?c=${campaign.key}`} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-raised px-3 py-1.5 text-sm font-medium text-gray-900 hover:border-gray-400"><FileSpreadsheet className="w-4 h-4" />Everything in Excel</a>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-surface p-4">
        <h2 className="text-sm font-semibold text-gray-900">How a {campaign.one} is closed, step by step</h2>
        <ol className="mt-2 space-y-2.5 text-sm text-gray-600">
          {[
            ['Email', 'Open the {campaign.one}, read the email, press Send. It goes through Outlook from admin@gennoor.com, with Jalal and Yusuf in copy, and carries its own form link. No answer after five days: start from "Follow-up".'],
            ['Reply', 'When someone writes back, it turns to Replied and shows at the top. Answer from Outlook, then press "No reply needed".'],
            ['Evaluation', 'They choose courses in the form, and their answer fills in the evaluation by itself. Give them access in the Learning Studio, put the date on the evaluation, and send "Access is ready" within 24 hours.'],
            ['Debrief call', 'Five to seven days later, send "Ask for the call", then book it from its Overview: it makes the Teams meeting and invites everyone.'],
            ['Pilot', 'A student cohort pilot, or a white-label LMS sandbox.'],
            ['Partner or closed', 'Set the stage. Closing asks for a reason, so it is remembered.'],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-3"><span className="w-6 h-6 shrink-0 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center">{i + 1}</span><span><strong className="text-gray-900">{t}.</strong> {d}</span></li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-gray-200 bg-surface p-4">
        <h2 className="text-sm font-semibold text-gray-900">The courses they may evaluate</h2>
        <ul className="mt-2 divide-y divide-gray-100 text-sm">
          {UNI_COURSES.map((c) => (
            <li key={c.id} className="py-1.5 flex justify-between gap-3"><span className="text-gray-900">{c.title}</span><span className="text-xs text-gray-500 whitespace-nowrap">{c.track} · {c.level} · {c.scope}</span></li>
          ))}
        </ul>
      </section>

      {countries.length > 0 && <section className="rounded-xl border border-gray-200 bg-surface p-4">
        <h2 className="text-sm font-semibold text-gray-900">Markets</h2>
        <div className="mt-2 max-h-72 overflow-y-auto">
          <table className="w-full text-sm">
            <tbody>
              {countries.map((c) => (
                <tr key={c.country} className="border-b border-gray-100 last:border-0 align-top">
                  <td className="py-1.5 pr-3 text-gray-900 whitespace-nowrap">{c.country}</td>
                  <td className="py-1.5 pr-3 text-xs text-gray-500 whitespace-nowrap">{c.tier.replace(/^Tier (\d).*/, 'Tier $1')}</td>
                  <td className="py-1.5 text-xs text-gray-600">{c.entry}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>}
    </div>
  )
}
