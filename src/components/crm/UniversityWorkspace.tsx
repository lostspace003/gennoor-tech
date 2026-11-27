'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { AlertTriangle, ArrowLeft, ArrowRight, Check, ExternalLink, Mail, Send } from 'lucide-react'
import {
  CAMPAIGN_CC, CAMPAIGN_FROM, UNI_COURSES, UNI_STAGES, UNI_STAGE_HINTS, UNI_STAGE_LABELS, claudeCardAfter, waitingForAnswer, whyNotReady, withForm,
  type University, type UniStage,
} from '@/lib/crm/universities-types'
import { nextStep, daysSinceFirstEmail } from '@/lib/crm/universities-stats'
import { CPN_BADGE_URL, CPN_LINE } from '@/lib/crm/universities-email'
import { sendHint, sendState } from '@/lib/crm/delivery'
import { useCrm } from './CrmContext'
import { api, formatDateTime } from './shared'
import { STAGE_PILL, VERIFY_PILL, splitList, webHref } from './university-shared'

/**
 * One university, managed on its own page (docs/CRM.md, section 15): where it stands and the one thing to do next,
 * its email, who works there, the evaluation access, the call and the notes, each saved on the university itself.
 * The dashboard (UniversitiesView) shows all of them together; this page is for the one in front of you.
 */

type PanelTab = 'email' | 'overview' | 'contacts' | 'evaluation' | 'activity'
const isTab = (v: string | null): v is PanelTab => v === 'email' || v === 'overview' || v === 'contacts' || v === 'evaluation' || v === 'activity'

export default function UniversityWorkspace({ id }: { id: string }) {
  const { notify, ask } = useCrm()
  const search = useSearchParams()
  const asked = search.get('tab')
  const [unis, setUnis] = useState<University[] | null>(null)
  const [formUrl, setFormUrl] = useState('')
  const [error, setError] = useState('')
  const [tab, setTab] = useState<PanelTab>(isTab(asked) ? asked : 'email')

  const load = useCallback(async () => {
    try {
      const d = await api<{ settings: { formUrl: string }; universities: University[] }>('/api/admin/universities', { cache: 'no-store' })
      setUnis(d.universities); setFormUrl(d.settings.formUrl); setError('')
    } catch (e: any) { setError(e.message) }
  }, [])
  useEffect(() => { load() }, [load])

  if (error && !unis) return <div className="p-6"><p className="rounded-lg bg-red-50 text-red-700 text-sm px-3 py-2">{error}</p></div>
  if (!unis) return <p className="p-6 text-sm text-gray-500">Reading the university…</p>
  const list = [...unis].sort((a, b) => a.wave - b.wave || a.id.localeCompare(b.id))
  const at = list.findIndex((x) => x.id === id)
  const u = list[at]
  if (!u) return <div className="p-6"><p className="text-sm text-gray-700">That university is not in the list.</p><Link href="/crm/universities" className="text-primary-700 text-sm font-medium hover:underline">Back to the universities</Link></div>
  const prev = list[at - 1], next = list[at + 1]
  const step = nextStep(u, formUrl)
  const days = daysSinceFirstEmail(u)

  const replace = (n: University) => setUnis((l) => (l || []).map((x) => (x.id === n.id ? n : x)))
  const patch: Patcher = async (p, done) => {
    try {
      const r = await api<{ university: University }>('/api/admin/universities', { method: 'PATCH', body: JSON.stringify({ id: u.id, patch: p }) })
      replace(r.university); if (done) notify(done)
      return true
    } catch (e: any) { notify(e.message, true); return false }
  }
  const moveTo = async (s: UniStage) => {
    if (s === u.stage) return
    if (s === 'closed') {
      const why = await ask({ title: `Close ${u.name}?`, text: 'Say why, so it is remembered. You can move it back later.', input: { placeholder: 'For example: they have their own provider', required: true }, confirm: 'Close', danger: true })
      if (why === null) return
      await patch({ stage: 'closed', closedReason: why }, 'Closed')
      return
    }
    await patch({ stage: s }, `Moved to ${UNI_STAGE_LABELS[s]}`)
  }
  const handled = async () => {
    try { const r = await api<{ university: University }>('/api/admin/universities', { method: 'POST', body: JSON.stringify({ action: 'handled', id: u.id }) }); replace(r.university) }
    catch (e: any) { notify(e.message, true) }
  }

  const TABS: Array<[PanelTab, string]> = [['email', 'Email'], ['overview', 'Overview'], ['contacts', `Contacts (${u.contacts.length})`], ['evaluation', 'Evaluation'], ['activity', 'Activity']]
  return (
    <div className="p-4 sm:p-6 max-w-4xl">
      <div className="flex items-center justify-between gap-3 text-sm">
        <Link href="/crm/universities" className="inline-flex items-center gap-1 text-primary-700 font-medium hover:underline"><ArrowLeft className="w-4 h-4" />All universities</Link>
        <span className="flex items-center gap-1">
          {prev ? <Link href={`/crm/universities/${prev.id}`} title={prev.name} className="p-1.5 rounded-lg hover:bg-gray-50" aria-label={`Previous: ${prev.name}`}><ArrowLeft className="w-4 h-4 text-gray-600" /></Link> : null}
          <span className="text-xs text-gray-500">{at + 1} of {list.length}</span>
          {next ? <Link href={`/crm/universities/${next.id}`} title={next.name} className="p-1.5 rounded-lg hover:bg-gray-50" aria-label={`Next: ${next.name}`}><ArrowRight className="w-4 h-4 text-gray-600" /></Link> : null}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-gray-900">{u.name}</h1>
          <p className="text-sm text-gray-500">{u.country}{u.city ? ` · ${u.city}` : ''} · {u.priority} priority · Wave {u.wave}{days !== null ? ` · first email ${days === 0 ? 'today' : `${days} day${days === 1 ? '' : 's'} ago`}` : ''}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 ${STAGE_PILL[u.stage]}`}>{UNI_STAGE_LABELS[u.stage]}</span>
          <label className="sr-only" htmlFor="uni-stage">Stage</label>
          <select id="uni-stage" value={u.stage} onChange={(e) => moveTo(e.target.value as UniStage)} title={UNI_STAGE_HINTS[u.stage]} className="rounded-lg border border-gray-300 bg-raised px-2.5 py-1.5 text-sm text-gray-900">
            {UNI_STAGES.map((s) => <option key={s} value={s}>{UNI_STAGE_LABELS[s]}</option>)}
          </select>
        </div>
      </div>
      {u.stage === 'closed' && u.closedReason && <p className="mt-2 text-sm text-gray-600">Closed because: {u.closedReason}</p>}

      {/* The one thing to do next */}
      {step && (
        <div className={`mt-4 rounded-xl border px-4 py-3 flex flex-wrap items-center justify-between gap-3 ${step.urgent ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-raised'}`}>
          <div><p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Next</p><p className="text-sm text-gray-900">{step.text}</p></div>
          <button type="button" onClick={() => setTab(step.tab)} className="rounded-lg border border-gray-300 bg-surface px-3 py-1.5 text-sm font-semibold text-gray-900 hover:border-gray-400">Go there</button>
        </div>
      )}

      {waitingForAnswer(u) && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-semibold text-red-700">They wrote back</p>
          {u.replies.filter((r) => !r.handled).slice(0, 3).map((r) => (
            <p key={r.id} className="mt-1 text-sm text-gray-800"><span className="font-medium">{r.fromName || r.from}</span> · {formatDateTime(r.at)}<br /><span className="text-gray-600">{r.subject} — {r.preview}</span></p>
          ))}
          <p className="mt-2 text-xs text-gray-600">Answer from Outlook, then:</p>
          <button type="button" onClick={handled} className="mt-1 rounded-lg border border-red-200 bg-raised px-3 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">No reply needed</button>
        </div>
      )}

      <div className="mt-5 flex gap-1 border-b border-gray-200 overflow-x-auto" role="tablist">
        {TABS.map(([k, label]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)}
            className={`px-3 py-2 text-sm font-medium whitespace-nowrap -mb-px border-b-2 ${tab === k ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>{label}</button>
        ))}
      </div>

      <div className="mt-4 rounded-xl border border-gray-200 bg-surface p-4 sm:p-5">
        {tab === 'email' && <EmailTab key={u.updatedAt} u={u} formUrl={formUrl} patch={patch} onSent={load} ask={ask} notify={notify} />}
        {tab === 'overview' && <OverviewTab u={u} patch={patch} />}
        {tab === 'contacts' && <ContactsTab u={u} patch={patch} setTab={setTab} />}
        {tab === 'evaluation' && <EvaluationTab u={u} patch={patch} />}
        {tab === 'activity' && (
          <ul className="space-y-2">
            {u.activities.map((a, i) => <li key={i} className="text-sm text-gray-700"><span className="text-xs text-gray-500">{formatDateTime(a.at)} · {a.by.split('@')[0]}</span><br />{a.description}</li>)}
            {!u.activities.length && <li className="text-sm text-gray-500">Nothing has happened yet.</li>}
          </ul>
        )}
      </div>
    </div>
  )
}

type Patcher = (p: Record<string, unknown>, done?: string) => Promise<boolean>

function EmailTab({ u, formUrl, patch, onSent, ask, notify }: { u: University; formUrl: string; patch: Patcher; onSent: () => Promise<void>; ask: ReturnType<typeof useCrm>['ask']; notify: (m: string, e?: boolean) => void }) {
  const [subject, setSubject] = useState(u.draft.subject)
  const [body, setBody] = useState(u.draft.body)
  const [to, setTo] = useState(u.draft.to.join(', '))
  const [cc, setCc] = useState(u.draft.cc.join(', '))
  const [preview, setPreview] = useState(false)
  const [busy, setBusy] = useState(false)
  const dirty = subject !== u.draft.subject || body !== u.draft.body || to !== u.draft.to.join(', ') || cc !== u.draft.cc.join(', ')
  const draft = { subject, body, to: splitList(to), cc: splitList(cc) }
  const problem = whyNotReady({ draft: { ...u.draft, ...draft } }, formUrl)
  const gone = u.emails.some((e) => e.status === 'sent')
  const shownBody = withForm(body, formUrl)

  const save = async () => { setBusy(true); const ok = await patch({ draft }, 'The email is saved'); setBusy(false); return ok }
  const send = async () => {
    if (problem) { notify(problem, true); return }
    const again = gone
    const okAsk = await ask({
      title: again ? 'Send another email?' : `Send this to ${u.name}?`,
      text: `Through Outlook, from ${CAMPAIGN_FROM} to ${draft.to.join(', ')}. ${[...new Set([...CAMPAIGN_CC, ...draft.cc])].join(' and ')} will be in copy. A real email goes out.`,
      confirm: 'Send',
    })
    if (okAsk === null) return
    setBusy(true)
    try {
      if (dirty && !(await save())) return
      const r = await api<{ message: string; done: boolean }>('/api/admin/universities/send', { method: 'POST', body: JSON.stringify({ id: u.id, again }) })
      notify(r.done ? r.message : `${r.message}. It is on its way: the CRM will say "sent" once the email service confirms it.`)
      await onSent()
    } catch (e: any) { notify(e.message, true); await onSent() } finally { setBusy(false) }
  }

  return (
    <div>
      {draft.to.length === 0 && <p className="mb-3 rounded-lg bg-amber-50 text-amber-800 text-sm px-3 py-2">There is no address for this university yet ({u.officialEmail || 'none published'}). Find one under Contacts and add it to To.</p>}
      <div className="grid gap-3">
        <div className="text-sm"><span className="text-xs font-medium text-gray-500 block mb-1">From</span><span className="text-gray-900">Jalal Khan · {CAMPAIGN_FROM} · through Outlook</span></div>
        <label className="text-sm"><span className="text-xs font-medium text-gray-500 block mb-1">To{u.draft.toLabel ? ` · ${u.draft.toLabel}` : ''}</span>
          <input value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm text-gray-900" /></label>
        <label className="text-sm"><span className="text-xs font-medium text-gray-500 block mb-1">Cc · {CAMPAIGN_CC.join(' and ')} are always added</span>
          <input value={cc} onChange={(e) => setCc(e.target.value)} placeholder="Others to copy" className="w-full rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400" /></label>
        <label className="text-sm"><span className="text-xs font-medium text-gray-500 block mb-1">Subject</span>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm text-gray-900" /></label>
        <div className="text-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">Email</span>
            <button type="button" onClick={() => setPreview((p) => !p)} className="text-xs font-medium text-primary-700 hover:underline">{preview ? 'Edit' : 'See it as they will'}</button>
          </div>
          {preview ? <Preview text={shownBody} /> : (
            <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={18} className="w-full rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm leading-relaxed text-gray-900" />
          )}
        </div>
      </div>

      {problem ? <p className="mt-3 flex items-start gap-1.5 text-sm text-amber-700"><AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />{problem}</p> : <p className="mt-3 flex items-center gap-1.5 text-sm text-green-700"><Check className="w-4 h-4" />Ready to send.</p>}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={save} disabled={!dirty || busy} className="rounded-lg border border-gray-300 bg-raised px-4 py-2 text-sm font-semibold text-gray-900 hover:border-gray-400 disabled:opacity-50">Save</button>
        <button type="button" onClick={send} disabled={busy || !!problem} className="inline-flex items-center gap-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 text-sm font-semibold disabled:opacity-50"><Send className="w-4 h-4" />{gone ? 'Send another' : 'Send'}</button>
      </div>

      {u.emails.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900">Sent</h3>
          <ul className="mt-2 space-y-2">
            {u.emails.map((e, i) => {
              const state = e.status === 'failed' ? 'failed' : sendState(e)
              return (
                <li key={i} className="rounded-lg border border-gray-200 px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2"><span className="font-medium text-gray-900 truncate">{e.subject}</span>
                    <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0 ${state === 'sent' ? 'bg-green-50 text-green-700' : state === 'failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{state === 'sent' ? 'Sent' : state === 'failed' ? 'Did not go' : state === 'onItsWay' ? 'On its way' : 'Not confirmed'}</span></div>
                  <p className="text-xs text-gray-500">{formatDateTime(e.at)} · {e.by.split('@')[0]} · to {e.to}</p>
                  <p className="text-xs text-gray-500">{sendHint({ at: e.at, state, error: e.error })}</p>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

/** The email as it will look: paragraphs in a white sheet, the Claude Partner Network card under the first that names Claude. */
function Preview({ text }: { text: string }) {
  const paragraphs = text.split(/\n{2,}/)
  const at = claudeCardAfter(text)
  return (
    <div className="rounded-lg border border-gray-200 bg-[#fff] px-5 py-4 text-[14px] leading-relaxed text-[#1e293b]">
      {paragraphs.map((p, i) => (
        <div key={i}>
          <p className="mb-3.5 whitespace-pre-line">{p}</p>
          {i === at && (
            <div className="mb-4 inline-flex flex-wrap items-center rounded-xl bg-[#f0eee6] pr-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={CPN_BADGE_URL} width={150} alt="Claude Partner Network - Certified" className="h-auto" />
              <span className="text-sm font-semibold text-[#141413]">{CPN_LINE}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function OverviewTab({ u, patch }: { u: University; patch: Patcher }) {
  const [notes, setNotes] = useState(u.notes)
  const [callOn, setCallOn] = useState(u.callOn)
  const rows: Array<[string, string, string?]> = [
    ['Type', u.type], ['Department', u.department, u.departmentUrl], ['Website', u.website, u.website], ['Phone', u.phone], ['Recommended offering', u.offering],
    ['Why they fit', u.evidence], ['Idea for the opening line', u.hook], ['Where this was checked', u.sourceUrl, u.sourceUrl],
  ]
  return (
    <div>
      <dl className="space-y-2.5 text-sm">
        {rows.filter(([, v]) => v).map(([k, v, href]) => (
          <div key={k}><dt className="text-xs font-medium text-gray-500">{k}</dt>
            <dd className="text-gray-900">{href && webHref(href) ? <a href={webHref(href)} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline inline-flex items-center gap-1">{v}<ExternalLink className="w-3 h-3" /></a> : v}</dd></div>
        ))}
      </dl>
      <div className="mt-5 grid gap-3">
        <label className="text-sm"><span className="text-xs font-medium text-gray-500 block mb-1">Date of the call</span>
          <span className="flex gap-2"><input type="date" value={callOn} onChange={(e) => setCallOn(e.target.value)} className="rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm text-gray-900" />
            <button type="button" onClick={() => patch({ callOn }, 'Saved')} disabled={callOn === u.callOn} className="rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm font-semibold disabled:opacity-50">Save</button></span></label>
        <label className="text-sm"><span className="text-xs font-medium text-gray-500 block mb-1">Notes</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} className="w-full rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm text-gray-900" /></label>
        <div><button type="button" onClick={() => patch({ notes }, 'Notes saved')} disabled={notes === u.notes} className="rounded-lg border border-gray-300 bg-raised px-4 py-2 text-sm font-semibold text-gray-900 disabled:opacity-50">Save notes</button></div>
      </div>
    </div>
  )
}

function ContactsTab({ u, patch, setTab }: { u: University; patch: Patcher; setTab: (t: PanelTab) => void }) {
  const addTo = async (email: string) => {
    if (u.draft.to.includes(email)) return
    if (await patch({ draft: { subject: u.draft.subject, body: u.draft.body, to: [...u.draft.to, email], cc: u.draft.cc } }, 'Added to the email')) setTab('email')
  }
  return (
    <ul className="space-y-3">
      {u.contacts.map((c) => (
        <li key={c.id} className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0"><p className="font-medium text-gray-900">{c.name}</p><p className="text-xs text-gray-500">{c.designation}{c.order ? ` · ${c.order}` : ''}</p></div>
            <span className={`text-[11px] font-semibold rounded-full px-2 py-0.5 shrink-0 ${VERIFY_PILL[c.status] || 'bg-gray-100 text-gray-600'}`}>{c.status || 'Not checked'}</span>
          </div>
          <div className="mt-1.5 text-xs text-gray-600 space-y-0.5">
            {c.email ? <p className="flex flex-wrap items-center gap-2"><Mail className="w-3.5 h-3.5" />{c.email}<button type="button" onClick={() => addTo(c.email)} disabled={u.draft.to.includes(c.email)} className="text-primary-700 font-medium hover:underline disabled:text-gray-400 disabled:no-underline">{u.draft.to.includes(c.email) ? 'In the email' : 'Add to the email'}</button></p> : <p className="text-amber-700">No address published{c.emailNote ? `: ${c.emailNote}` : ''}</p>}
            {c.phone && <p>{c.phone}</p>}
            {c.department && <p>{c.department}</p>}
            <p className="flex flex-wrap gap-3">
              {webHref(c.linkedin) && <a href={webHref(c.linkedin)} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline">LinkedIn</a>}
              {webHref(c.source) && <a href={webHref(c.source)} target="_blank" rel="noopener noreferrer" className="text-primary-700 hover:underline">Where it was found</a>}
            </p>
            {c.notes && <p className="text-gray-500">{c.notes}</p>}
          </div>
        </li>
      ))}
      {!u.contacts.length && <li className="text-sm text-gray-500">No contacts are listed.</li>}
    </ul>
  )
}

function EvaluationTab({ u, patch }: { u: University; patch: Patcher }) {
  const ev = u.evaluation
  const [courses, setCourses] = useState<string[]>(ev?.courses || [])
  const [reps, setReps] = useState<Array<{ name: string; email: string }>>([...(ev?.reps || []), { name: '', email: '' }, { name: '', email: '' }].slice(0, 2))
  const [requestedAt, setRequestedAt] = useState(ev?.requestedAt || '')
  const [grantedAt, setGrantedAt] = useState(ev?.grantedAt || '')
  const toggle = (id: string) => setCourses((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  const save = async () => {
    const evaluation = { courses, reps: reps.filter((r) => r.email.trim() || r.name.trim()), requestedAt, grantedAt }
    const p: Record<string, unknown> = { evaluation }
    // Access given moves a university that was still at the start to Evaluating
    if (grantedAt && ['new', 'emailed', 'replied'].includes(u.stage)) p.stage = 'evaluating'
    await patch(p, 'The evaluation is saved')
  }
  return (
    <div>
      <p className="text-sm text-gray-600">When the university has chosen courses in the form, give its faculty access in the Learning Studio, then write it down here. Login details go to them within 24 hours; a debrief call follows five to seven days later.</p>
      <fieldset className="mt-4">
        <legend className="text-xs font-medium text-gray-500 mb-1">Courses chosen</legend>
        <div className="space-y-1.5">
          {UNI_COURSES.map((c) => (
            <label key={c.id} className="flex items-start gap-2 text-sm text-gray-900"><input type="checkbox" checked={courses.includes(c.id)} onChange={() => toggle(c.id)} className="mt-1" /><span>{c.title}<span className="block text-xs text-gray-500">{c.track} · {c.level} · {c.scope}</span></span></label>
          ))}
        </div>
      </fieldset>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        {reps.map((r, i) => (
          <div key={i} className="rounded-lg border border-gray-200 p-3 text-sm space-y-2">
            <p className="text-xs font-medium text-gray-500">Representative {i + 1}{i === 1 ? ' (optional)' : ''}</p>
            <input value={r.name} onChange={(e) => setReps((l) => l.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} placeholder="Name" aria-label={`Representative ${i + 1} name`} className="w-full rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm text-gray-900" />
            <input value={r.email} onChange={(e) => setReps((l) => l.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)))} placeholder="Email" aria-label={`Representative ${i + 1} email`} className="w-full rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm text-gray-900" />
          </div>
        ))}
      </div>
      <div className="mt-4 grid sm:grid-cols-2 gap-3">
        <label className="text-sm"><span className="text-xs font-medium text-gray-500 block mb-1">Form answered on</span><input type="date" value={requestedAt} onChange={(e) => setRequestedAt(e.target.value)} className="rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm text-gray-900" /></label>
        <label className="text-sm"><span className="text-xs font-medium text-gray-500 block mb-1">Access given on</span><input type="date" value={grantedAt} onChange={(e) => setGrantedAt(e.target.value)} className="rounded-lg border border-gray-300 bg-raised px-3 py-2 text-sm text-gray-900" /></label>
      </div>
      <button type="button" onClick={save} className="mt-4 rounded-lg bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 text-sm font-semibold">Save</button>
    </div>
  )
}

