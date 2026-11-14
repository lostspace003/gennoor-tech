'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, Mail, Phone, Building2, Linkedin, Globe, Send, Sparkles, Calendar, Trash2,
  User, Paperclip, X,
} from 'lucide-react'
import { Lead, LeadStatus, STEP_LABELS, STEP_HINTS } from '@/lib/crm/types'
import { SEQUENCE, sequenceProgress, stepNumber, fillTokens, LINKEDIN_CONNECT_NOTE, LINKEDIN_FIRST_MESSAGE } from '@/lib/crm/sequence'
import { lastContactAt, needsAnswer } from '@/lib/crm/replies'
import { istInstant } from '@/lib/crm/timezones'
import { shortName } from '@/lib/crm/users'
import { StepSelect, api, formatDateTime, timeAgo, DurationSlider, TimeSlider, LeadLocalTime } from './shared'
import { useCrm } from './CrmContext'
import SendStepModal from './SendStep'
import EmailBoard, { type InboundMessage } from './EmailBoard'

type Tab = 'details' | 'emails' | 'linkedin' | 'meeting'
const TABS: Array<[Tab, string, any]> = [
  ['details', 'Details', User],
  ['emails', 'Emails', Mail],
  ['linkedin', 'LinkedIn', Linkedin],
  ['meeting', 'Meeting', Calendar],
]
// Older links used other tab names; send them somewhere sensible
const TAB_ALIASES: Record<string, Tab> = { overview: 'details', research: 'details', email: 'emails', schedule: 'meeting' }

const externalUrl = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`)
const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent'

type Notify = (msg: string, isError?: boolean) => void

interface Props {
  lead: Lead
  canManage: boolean
  onClose: () => void
  onReload: () => Promise<void>
  notify: Notify
  initialTab?: string
  /** They came from Today to answer a reply, or to write a follow-up: the right window opens by itself. */
  intent?: 'reply' | 'write'
  /** An email to put on the Emails board at once (the email tracker links here with it). */
  stage?: string
}

export default function LeadWorkspace({ lead, canManage, onClose, onReload, notify, initialTab, intent, stage }: Props) {
  const pickTab = (t?: string): Tab => (TABS.some(([id]) => id === t) ? (t as Tab) : TAB_ALIASES[t || ''] || 'details')
  const [tab, setTab] = useState<Tab>(pickTab(initialTab))
  const { userEmail, isManager, ask } = useCrm()
  const [busy, setBusy] = useState(false)

  useEffect(() => setTab(pickTab(initialTab)), [lead.id, initialTab]) // eslint-disable-line react-hooks/exhaustive-deps

  const isMine = lead.owner?.toLowerCase() === userEmail.toLowerCase()
  const canWork = isManager || !lead.owner || isMine

  const setStep = async (status: LeadStatus) => {
    if (status === lead.status) return
    try {
      await api('/api/admin/leads', { method: 'PUT', body: JSON.stringify({ id: lead.id, status }) })
      await onReload()
      notify(`Moved to ${STEP_LABELS[status]}`)
    } catch (e: any) { notify(e.message, true) }
  }

  const hold = async (action: 'claim' | 'release' | 'dump' | 'restore') => {
    let reason: string | undefined
    if (action === 'dump') {
      const why = await ask({ title: `Archive ${lead.name}?`, text: 'An archived lead leaves every list. It can be restored at any time.', input: { label: 'Why? (kept on the lead)', placeholder: 'For example: wrong fit, duplicate, no response', required: true }, confirm: 'Archive' })
      if (why === null) return
      reason = why
    }
    setBusy(true)
    try {
      await api('/api/admin/leads/claim', { method: 'POST', body: JSON.stringify({ leadIds: [lead.id], action, reason }) })
      await onReload()
      notify(action === 'claim' ? 'Picked up. This lead is yours.' : action === 'release' ? 'Released' : action === 'dump' ? 'Archived' : 'Restored')
    } catch (e: any) { notify(e.message, true) } finally { setBusy(false) }
  }

  return (
    <div className="bg-surface h-full flex flex-col">
      <div className="border-b border-gray-200 px-3 sm:px-5 pt-3">
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg shrink-0" title="Back to leads" aria-label="Back to leads">
              <ArrowLeft className="w-5 h-5 text-gray-500" />
            </button>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{lead.name}</h2>
              <p className="text-xs sm:text-sm text-gray-500 break-words">{[lead.company, lead.designation].filter(Boolean).join(' · ') || 'No organization yet'}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Who holds it */}
            {lead.dumped ? (
              <>
                <span className="text-[11px] bg-gray-200 text-gray-600 rounded-full px-2 py-1" title={lead.dumped.reason}>Archived: {lead.dumped.reason.slice(0, 32)}</span>
                <button onClick={() => hold('restore')} disabled={busy} className="px-2.5 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50">Restore</button>
              </>
            ) : !lead.owner ? (
              <button onClick={() => hold('claim')} disabled={busy} className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 disabled:opacity-50">Pick up this lead</button>
            ) : canWork ? (
              <>
                <span className="text-[11px] bg-primary-50 text-primary-700 rounded-full px-2 py-1">{isMine ? 'Your lead' : `Held by ${shortName(lead.owner)}`}</span>
                <button onClick={() => hold('release')} disabled={busy} className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-50">Release</button>
              </>
            ) : (
              <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-1">Held by {shortName(lead.owner)}. You can view only.</span>
            )}
            {!lead.dumped && canWork && <button onClick={() => hold('dump')} disabled={busy} className="text-xs text-gray-500 hover:text-gray-800 disabled:opacity-50">Archive</button>}
            {/* Where it stands: the one control that moves a lead */}
            {!lead.dumped && (
              <label className="flex items-center gap-1.5 text-xs text-gray-500" title={STEP_HINTS[lead.status]}>
                Step
                <StepSelect value={lead.status} onChange={setStep} disabled={!canWork} />
              </label>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2.5 overflow-x-auto">
          {TABS.map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-3 py-2 text-sm font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${tab === id ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab !== 'emails' && <div className="px-3 sm:px-5 pt-3 sm:pt-5 max-w-6xl"><LeadGlance lead={lead} onEmails={() => setTab('emails')} /></div>}
        {tab === 'details' && <DetailsTab lead={lead} canManage={canManage} canWork={canWork} onReload={onReload} onClose={onClose} notify={notify} />}
        {tab === 'emails' && <EmailsTab lead={lead} canWork={canWork} onReload={onReload} notify={notify} intent={intent} stage={stage} />}
        {tab === 'linkedin' && <LinkedInTab lead={lead} canWork={canWork} onReload={onReload} notify={notify} onEdit={() => setTab('details')} />}
        {tab === 'meeting' && <MeetingTab lead={lead} canWork={canWork} onReload={onReload} notify={notify} />}
      </div>
    </div>
  )
}

/* ---------------- Details ---------------- */

const DETAIL_FIELDS: Array<[keyof Lead, string, string?]> = [
  ['name', 'Name'], ['company', 'Organization'], ['email', 'Email', 'email'], ['phone', 'Phone'],
  ['designation', 'Designation'], ['country', 'Country'], ['linkedin', 'LinkedIn profile link'], ['website', 'Website'],
]

/**
 * The lead at a glance: where they stand and what to do next. The same four tiles sit at the top of the
 * Details, LinkedIn and Meeting tabs (the Emails board has its own four), so the page never opens on a blank.
 */
function LeadGlance({ lead, onEmails }: { lead: Lead; onEmails: () => void }) {
  // The lead at a glance, in the same four tiles as the Emails board: where they stand and what to do next
  const progress = sequenceProgress(lead)
  const waiting = needsAnswer(lead)
  const contact = lastContactAt(lead)
  const todo = waiting ? (lead.reply?.kind === 'stop' ? 'They asked us to stop' : 'Answer their reply')
    : !lead.email ? 'Add an email address'
    : progress.stopped ? 'Emails are stopped'
    : progress.finished ? 'Write to them directly'
    : progress.next ? (progress.due ? `Send email ${stepNumber(progress.next.id)}` : `Email ${stepNumber(progress.next.id)} in ${progress.daysUntil} day${progress.daysUntil === 1 ? '' : 's'}`) : 'Nothing due'
  const glance: Array<[string, string, string, boolean]> = [
    ['Step', STEP_LABELS[lead.status], STEP_HINTS[lead.status] || '', false],
    ['Next thing to do', todo, waiting || progress.due ? 'open the Emails board' : '', true],
    ['Email series', `${progress.sentIds.length} of ${SEQUENCE.length} sent`, progress.stopped ? 'stopped' : progress.finished ? 'all sent' : 'open the Emails board', true],
    ['Last contact', contact ? timeAgo(contact) : 'none yet', lead.reply ? `they last wrote ${timeAgo(lead.reply.at).toLowerCase()}` : 'no reply yet', false],
  ]
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {glance.map(([label, value, sub, link]) => {
        const body = (
          <>
            <div className="text-[11px] text-gray-500">{label}</div>
            <div className={`text-[15px] font-semibold truncate ${label === 'Next thing to do' && (waiting || progress.due) ? 'text-primary-700' : 'text-gray-900'}`}>{value}</div>
            <div className="text-[11px] text-gray-500 truncate" title={sub}>{sub || ' '}</div>
          </>
        )
        return link
          ? <button key={label} onClick={onEmails} className="text-left rounded-xl border border-gray-200 bg-raised px-3 py-2 min-w-0 hover:border-gray-400">{body}</button>
          : <div key={label} className="rounded-xl border border-gray-200 bg-raised px-3 py-2 min-w-0">{body}</div>
      })}
    </div>
  )
}

function DetailsTab({ lead, canManage, canWork, onReload, onClose, notify }: { lead: Lead; canManage: boolean; canWork: boolean; onReload: () => Promise<void>; onClose: () => void; notify: Notify }) {
  const { ask } = useCrm()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const startEdit = () => {
    setForm(Object.fromEntries([...DETAIL_FIELDS.map(([k]) => [k, String(lead[k] || '')]), ['notes', lead.notes || '']]))
    setEditing(true)
  }

  const save = async () => {
    if (!form.name?.trim()) { notify('Name is required', true); return }
    setSaving(true)
    try {
      await api('/api/admin/leads', { method: 'PUT', body: JSON.stringify({ id: lead.id, ...form, email: (form.email || '').trim().toLowerCase() }) })
      await onReload()
      setEditing(false)
      notify('Saved')
    } catch (e: any) { notify(e.message, true) } finally { setSaving(false) }
  }

  const remove = async () => {
    if ((await ask({ title: `Delete ${lead.name} for good?`, text: 'Their details, emails and history are removed. This cannot be undone. To keep them out of the way without losing anything, archive them instead.', confirm: 'Delete for good', danger: true })) === null) return
    try {
      await api(`/api/admin/leads?id=${encodeURIComponent(lead.id)}`, { method: 'DELETE' })
      await onReload()
      notify('Lead deleted')
      onClose()
    } catch (e: any) { notify(e.message, true) }
  }

  return (
    <div className="p-3 sm:p-5 max-w-6xl space-y-3">
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      <div className="lg:col-span-2 space-y-4 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Contact</h3>
          {!editing && canWork && (
            <div className="flex gap-2">
              <button onClick={startEdit} className="px-3 py-1.5 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">Edit</button>
              {canManage && (
                <button onClick={remove} className="px-2.5 py-1.5 text-red-600 text-sm rounded-lg hover:bg-red-50 flex items-center gap-1.5" title="Delete this lead">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {editing ? (
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DETAIL_FIELDS.map(([key, label, type]) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input type={type || 'text'} value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className={inputCls} />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Notes</label>
              <textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className={inputCls} />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-surface">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-gray-200 bg-raised p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <InfoRow icon={Mail} value={lead.email} href={lead.email ? `mailto:${lead.email}` : ''} placeholder="No email. Add one to start the email series." />
              <InfoRow icon={Phone} value={lead.phone} href={lead.phone ? `tel:${lead.phone.replace(/[^\d+]/g, '')}` : ''} placeholder="No phone" />
              <InfoRow icon={Building2} value={[lead.company, lead.designation].filter(Boolean).join(' · ')} placeholder="No organization" />
              <InfoRow icon={Globe} value={[lead.city, lead.country].filter(Boolean).join(', ')} placeholder="No country" />
              <InfoRow icon={Linkedin} value={lead.linkedin ? 'LinkedIn profile' : ''} href={lead.linkedin ? externalUrl(lead.linkedin) : ''} placeholder="No LinkedIn profile" />
              <InfoRow icon={Globe} value={lead.website} href={lead.website ? externalUrl(lead.website) : ''} placeholder="No website" />
            </div>
            <div className="text-xs text-gray-400 flex flex-wrap gap-x-4 gap-y-1">
              <span>Source: {lead.source || 'not recorded'}</span>
              <span>Added {lead.createdAt ? formatDateTime(lead.createdAt) : ''}</span>
            </div>
            {lead.notes && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1.5">Notes</h3>
                <p className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line break-words">{lead.notes}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="text-sm font-medium text-gray-500 mb-2">History</h3>
        {canWork && <NoteInput leadId={lead.id} onReload={onReload} notify={notify} />}
        <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-2">
          {lead.activities.length === 0 && <p className="text-sm text-gray-400">Nothing yet.</p>}
          {lead.activities.map((a, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-primary-600 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-800 break-words">{a.description}</p>
                <p className="text-xs text-gray-400">{formatDateTime(a.at)} · {shortName(a.by)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

function NoteInput({ leadId, onReload, notify }: { leadId: string; onReload: () => Promise<void>; notify: Notify }) {
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const save = async () => {
    const text = note.trim()
    if (!text || saving) return
    setSaving(true)
    try {
      await api('/api/admin/leads/add-note', { method: 'POST', body: JSON.stringify({ leadId, note: text }) })
      setNote('')
      await onReload()
    } catch (e: any) { notify(e.message, true) } finally { setSaving(false) }
  }
  return (
    <div className="flex gap-1.5 mb-3">
      <input value={note} onChange={(e) => setNote(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && save()} placeholder="Add a note: a call, what they said…" className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
      <button onClick={save} disabled={saving || !note.trim()} className="px-2.5 py-1.5 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-900 disabled:opacity-40">{saving ? '…' : 'Add'}</button>
    </div>
  )
}

function InfoRow({ icon: Icon, value, href, placeholder }: { icon: any; value: string; href?: string; placeholder: string }) {
  return (
    <div className="flex items-center gap-3 text-sm min-w-0">
      <Icon className="w-4 h-4 text-gray-400 shrink-0" />
      {!value ? <span className="text-gray-400">{placeholder}</span>
        : href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-primary-600 hover:underline truncate">{value}</a>
        : <span className="text-gray-900 truncate">{value}</span>}
    </div>
  )
}

/* ---------------- Emails: the series, then the conversation ---------------- */

function EmailsTab({ lead, canWork, onReload, notify, intent, stage }: { lead: Lead; canWork: boolean; onReload: () => Promise<void>; notify: Notify; intent?: 'reply' | 'write'; stage?: string }) {
  const { ask } = useCrm()
  const [opened, setOpened] = useState(false)
  const [inbound, setInbound] = useState<InboundMessage[]>([])
  const [inboundNote, setInboundNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [composing, setComposing] = useState<{ replyTo: InboundMessage | null } | null>(null)

  const loadInbox = async () => {
    setLoading(true)
    try {
      const res = await api<{ configured: boolean; messages: InboundMessage[]; note?: string; error?: string }>(`/api/admin/leads/inbox?leadId=${encodeURIComponent(lead.id)}`)
      setInbound(res.messages || [])
      setInboundNote(res.error || res.note || '')
    } catch (e: any) { setInboundNote(e.message) } finally { setLoading(false) }
  }
  useEffect(() => { loadInbox() }, [lead.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const stopOrResume = async (action: 'stop' | 'resume') => {
    let reason = ''
    if (action === 'stop') {
      const r = await ask({ title: `Stop the email series for ${lead.name}?`, text: 'No more emails of the series will be offered for this lead. You can still write to them yourself, and resume the series later.', input: { label: 'Why? (kept on the lead)', placeholder: 'For example: asked us to stop, now talking by phone' }, confirm: 'Stop the emails' })
      if (r === null) return
      reason = r
    }
    try {
      await api('/api/admin/leads/sequence', { method: 'PATCH', body: JSON.stringify({ leadIds: [lead.id], action, reason }) })
      await onReload()
      notify(action === 'stop' ? 'Email series stopped for this lead' : 'Email series resumed')
    } catch (e: any) { notify(e.message, true) }
  }

  // They came here to answer or to follow up: open the right window once, when the mail has been read
  useEffect(() => {
    if (opened || loading || !canWork || !lead.email || !intent) return
    setOpened(true)
    if (intent === 'reply') setComposing({ replyTo: inbound[0] || null })
    else setComposing({ replyTo: null })
  }, [intent, loading, opened, canWork, lead.email, inbound])

  const noAnswerNeeded = async () => {
    try {
      await api('/api/admin/leads/inbox', { method: 'POST', body: JSON.stringify({ leadIds: [lead.id], action: 'handled' }) })
      await onReload()
      notify('Taken off the list of replies to answer')
    } catch (e: any) { notify(e.message, true) }
  }
  const closeLead = async () => {
    if ((await ask({ title: `Close ${lead.name}?`, text: 'The lead moves to Closed and leaves your lists. It can be moved back at any time.', confirm: 'Close lead' })) === null) return
    try {
      await api('/api/admin/leads', { method: 'PUT', body: JSON.stringify({ id: lead.id, status: 'lost' }) })
      await onReload()
      notify('Closed')
    } catch (e: any) { notify(e.message, true) }
  }

  // An email of the series that nothing confirmed for a day: a person may make it due again
  const again = async (step: string) => {
    const go = await ask({ title: `Send email ${stepNumber(step)} again?`, text: 'The email service took this email more than a day ago and never confirmed that it had gone. If it did reach them after all, they will receive it twice.', confirm: 'Make it due again' })
    if (go === null) return
    try {
      await api('/api/admin/leads/sequence', { method: 'PATCH', body: JSON.stringify({ leadIds: [lead.id], action: 'again', step }) })
      await onReload()
      notify(`Email ${stepNumber(step)} is due again. Drag it onto the board to send it.`)
    } catch (e: any) { notify(e.message, true) }
  }

  // The board draws everything; this keeps the windows that open over it (components/crm/EmailBoard.tsx)
  return (
    <>
      <EmailBoard
        lead={lead} canWork={canWork} notify={notify} onReload={onReload}
        inbound={inbound} inboundNote={inboundNote} loading={loading} onCheckReplies={loadInbox}
        onWrite={(replyTo) => setComposing({ replyTo: replyTo || null })}
        onReview={() => setSending(true)}
        onStop={() => stopOrResume('stop')} onResume={() => stopOrResume('resume')}
        onAgain={again} onNoAnswerNeeded={noAnswerNeeded} onCloseLead={closeLead}
        stageFirst={stage}
      />
      {sending && <SendStepModal leads={[lead]} notify={notify} onClose={() => setSending(false)} onSent={async () => { setSending(false); await onReload() }} />}
      {composing && (
        <EmailComposer lead={lead} replyTo={composing.replyTo} notify={notify} onClose={() => setComposing(null)} onSent={async () => { setComposing(null); await onReload(); await loadInbox() }} />
      )}
    </>
  )
}

// A one-off email outside the series: a reply, or anything specific to this lead.
function EmailComposer({ lead, replyTo, onClose, onSent, notify }: { lead: Lead; replyTo: InboundMessage | null; onClose: () => void; onSent: () => Promise<void>; notify: Notify }) {
  const [subject, setSubject] = useState(replyTo ? (/^re:/i.test(replyTo.subject) ? replyTo.subject : `Re: ${replyTo.subject}`) : '')
  const [body, setBody] = useState('')
  const [ask, setAsk] = useState('')
  const [cc, setCc] = useState('')
  const [busy, setBusy] = useState('')
  const [files, setFiles] = useState<string[]>([])
  const typedOnce = useRef(false)

  // A reply opens with a first draft already on its way: the person reads, corrects and sends. Anything typed
  // while it is being written is kept (the draft then does not replace it).
  useEffect(() => { if (replyTo) draft(true) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const draft = async (auto = false) => {
    setBusy('draft')
    try {
      const context = replyTo ? `Reply to this email from the lead:\n${(replyTo.body || replyTo.preview).replace(/<[^>]+>/g, ' ').slice(0, 2500)}` : ''
      const instructions = [context, ask.trim() && `What to say: ${ask.trim()}`].filter(Boolean).join('\n\n') || undefined
      const res = await api<{ subject: string; body: string; source: string }>('/api/admin/leads/generate-email', { method: 'POST', body: JSON.stringify({ leadId: lead.id, instructions, reply: !!replyTo }) })
      if (auto && typedOnce.current) return
      if (!replyTo || !subject) setSubject(res.subject)
      setBody(res.body)
      if (res.source !== 'ai') notify('The writing assistant is not available, so a plain draft was loaded. Write your answer where it says so before sending.', true)
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const attachFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy('upload')
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'email-attachments')
      form.append('leadId', lead.id)
      form.append('leadName', lead.name)
      form.append('company', lead.company || '')
      const res = await fetch('/api/admin/leads/documents', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setFiles((f) => [...new Set([...f, data.name as string])])
    } catch (err: any) { notify(err.message, true) } finally { setBusy('') }
  }

  const removeFile = (name: string) => {
    setFiles((f) => f.filter((n) => n !== name))
    api(`/api/admin/leads/documents?name=${encodeURIComponent(name)}`, { method: 'DELETE' }).catch(() => {})
  }

  const send = async () => {
    if (!subject.trim() || !body.trim()) { notify('Add a subject and a message', true); return }
    setBusy('send')
    try {
      const res = await api<{ sent: number; message: string; errors: string[] }>('/api/admin/leads/send-email', {
        method: 'POST',
        body: JSON.stringify({ leadIds: [lead.id], subject, body, attachBlobs: files, extraCc: cc.split(',').map((s) => s.trim()).filter(Boolean) }),
      })
      if (res.sent > 0) {
        // One-off uploads travelled with the email; they do not belong in the shared files
        for (const name of files) api(`/api/admin/leads/documents?name=${encodeURIComponent(name)}`, { method: 'DELETE' }).catch(() => {})
        notify('Email sent')
        await onSent()
      } else notify(res.errors?.join('; ') || 'The email could not be sent', true)
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-raised rounded-xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900">{replyTo ? `Reply to ${lead.name}` : `Email ${lead.name}`}</h3>
            <p className="text-xs text-gray-500 truncate">To {lead.email} · from sales@gennoor.com · a copy goes to you</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded" aria-label="Close"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-3 overflow-y-auto">
          <div className="flex gap-2">
            <input value={ask} onChange={(e) => setAsk(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && draft()} className={inputCls} placeholder={replyTo ? 'Optional: what should the reply say?' : 'Optional: what is this email about?'} />
            <button onClick={() => draft()} disabled={!!busy} className="px-3 py-2 border border-gray-300 text-gray-800 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50">
              <Sparkles className="w-4 h-4" /> {busy === 'draft' ? 'Writing…' : body ? 'Write again' : 'Write a draft'}
            </button>
          </div>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className={`${inputCls} font-medium`} />
          <textarea value={body} onChange={(e) => { typedOnce.current = true; setBody(e.target.value) }} rows={12} placeholder={busy === 'draft' ? 'Writing a first draft from their message…' : 'Write your message, or press Write a draft and edit what comes back.'} className={inputCls} />
          {replyTo && <p className="text-[11px] text-gray-500">The draft is written by the assistant from their message. Read it, correct it, then send: nothing goes out by itself.</p>}
          <input value={cc} onChange={(e) => setCc(e.target.value)} placeholder="Copy others (comma-separated emails, optional)" className={`${inputCls} text-xs`} />
          <div className="flex flex-wrap items-center gap-2">
            <label className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs cursor-pointer hover:bg-gray-50 flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5" /> {busy === 'upload' ? 'Uploading…' : 'Attach a file'}
              <input type="file" onChange={attachFile} className="hidden" disabled={!!busy} />
            </label>
            {files.map((name) => (
              <span key={name} className="inline-flex items-center gap-1 text-xs bg-primary-50 text-primary-700 rounded-full pl-2.5 pr-1 py-1">
                {name.split('/').pop()}
                <button onClick={() => removeFile(name)} className="p-0.5 hover:bg-primary-100 rounded-full" aria-label="Remove attachment"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-200 flex justify-end gap-2 shrink-0">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={send} disabled={!!busy || !subject || !body} className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 flex items-center gap-2 disabled:opacity-50">
            <Send className="w-4 h-4" /> {busy === 'send' ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- LinkedIn ---------------- */

interface LiUsage { configured: boolean; connects?: { used: number; cap: number }; messages?: { used: number; cap: number } }

function LinkedInTab({ lead, canWork, onReload, notify, onEdit }: { lead: Lead; canWork: boolean; onReload: () => Promise<void>; notify: Notify; onEdit: () => void }) {
  const { ask: confirmFirst } = useCrm()
  const [note, setNote] = useState(fillTokens(LINKEDIN_CONNECT_NOTE, lead))
  const [message, setMessage] = useState(fillTokens(LINKEDIN_FIRST_MESSAGE, lead))
  const [busy, setBusy] = useState('')
  const [usage, setUsage] = useState<LiUsage | null>(null)
  const touches = lead.linkedinTouches || []
  const connected = touches.some((t) => t.kind === 'connect')

  const loadUsage = () => api<LiUsage>('/api/admin/leads/linkedin').then(setUsage).catch(() => setUsage({ configured: false }))
  useEffect(() => { loadUsage() }, [])
  useEffect(() => { setNote(fillTokens(LINKEDIN_CONNECT_NOTE, lead)); setMessage(fillTokens(LINKEDIN_FIRST_MESSAGE, lead)) }, [lead.id]) // eslint-disable-line react-hooks/exhaustive-deps

  const act = async (action: 'connect' | 'message') => {
    const text = action === 'connect' ? note : message
    if ((await confirmFirst(action === 'connect' ? { title: `Send a connection request to ${lead.name}?`, text: 'It goes out from the company LinkedIn sign-in, with the note you see.', confirm: 'Send the request' } : { title: `Send this LinkedIn message to ${lead.name}?`, text: 'It goes out from the company LinkedIn sign-in.', confirm: 'Send the message' })) === null) return
    setBusy(action)
    try {
      await api('/api/admin/leads/linkedin', { method: 'POST', body: JSON.stringify({ action, leadId: lead.id, text }) })
      await onReload()
      loadUsage()
      notify(action === 'connect' ? 'Connection request sent' : 'LinkedIn message sent')
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  if (!lead.linkedin) {
    return (
      <div className="p-3 sm:p-5 max-w-xl">
        <div className="rounded-xl border border-gray-200 bg-raised p-5 text-sm text-gray-600 space-y-3">
          <p className="font-medium text-gray-900">No LinkedIn profile yet</p>
          <p>Add the link to their profile and this tab offers the connection note and the first message, ready to send.</p>
          <button onClick={onEdit} className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">Add it on the Details tab</button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <a href={externalUrl(lead.linkedin)} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline flex items-center gap-1.5"><Linkedin className="w-4 h-4" /> Open {lead.name}&apos;s profile</a>
        {usage?.configured && usage.connects && usage.messages && (
          <span className="text-xs text-gray-500">Today: {usage.connects.used} of {usage.connects.cap} connection requests · {usage.messages.used} of {usage.messages.cap} messages</span>
        )}
      </div>

      {usage && !usage.configured && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">The LinkedIn service is not connected on this site. Check it in the LinkedIn hub.</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4 space-y-2.5">
          <h3 className="text-sm font-semibold text-gray-800">1. Connect</h3>
          <p className="text-xs text-gray-500">A message can only reach someone you are connected to, so this comes first.</p>
          <textarea value={note} onChange={(e) => setNote(e.target.value.slice(0, 300))} rows={5} className={inputCls} />
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400">{note.length} of 300 characters</span>
            <button onClick={() => act('connect')} disabled={!canWork || !!busy || !usage?.configured} className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {busy === 'connect' ? 'Sending…' : connected ? 'Send again' : 'Send connection request'}
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4 space-y-2.5">
          <h3 className="text-sm font-semibold text-gray-800">2. Message</h3>
          <p className="text-xs text-gray-500">Send this once they have accepted. Edit it to fit the person.</p>
          <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 3000))} rows={5} className={inputCls} />
          <div className="flex justify-end">
            <button onClick={() => act('message')} disabled={!canWork || !!busy || !message.trim() || !usage?.configured} className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50">
              {busy === 'message' ? 'Sending…' : 'Send message'}
            </button>
          </div>
        </div>
      </div>

      {touches.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Sent on LinkedIn</h3>
          <div className="space-y-2">
            {touches.map((t, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-3">
                <div className="text-xs text-gray-500">{t.kind === 'connect' ? 'Connection request' : 'Message'} · {formatDateTime(t.at)} · {shortName(t.by)}</div>
                {t.text && <p className="text-sm text-gray-700 mt-1 whitespace-pre-line break-words">{t.text}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-[11px] text-gray-400">Each request and message is sent one at a time by a person, inside daily limits, to keep the LinkedIn account in good standing. Replies arrive in LinkedIn itself and in the LinkedIn hub.</p>
    </div>
  )
}

/* ---------------- Meeting ---------------- */

function MeetingTab({ lead, canWork, onReload, notify }: { lead: Lead; canWork: boolean; onReload: () => Promise<void>; notify: Notify }) {
  const [form, setForm] = useState({ subject: `Gennoor Tech and ${lead.company || lead.name}: introduction`, date: '', time: '10:00', duration: 30, agenda: '', extra: '' })
  const [busy, setBusy] = useState(false)

  const schedule = async () => {
    if (!form.date || !form.time) { notify('Pick a date and a time', true); return }
    setBusy(true)
    try {
      // The time picked is India time; anchor it so no browser or server zone can shift it
      const start = istInstant(form.date, form.time).toISOString()
      await api('/api/admin/leads/schedule-meeting', {
        method: 'POST',
        body: JSON.stringify({
          leadId: lead.id, subject: form.subject, start, durationMinutes: form.duration, agenda: form.agenda,
          extraAttendees: form.extra.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      })
      // A booked call means the conversation has started
      if (lead.status === 'new' || lead.status === 'contacted') {
        await api('/api/admin/leads', { method: 'PUT', body: JSON.stringify({ id: lead.id, status: 'qualified' }) }).catch(() => {})
      }
      await onReload()
      notify(`Teams meeting booked. The invitation went to ${lead.email}.`)
    } catch (e: any) { notify(e.message, true) } finally { setBusy(false) }
  }

  return (
    <div className="p-3 sm:p-5 max-w-6xl grid grid-cols-1 lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] gap-4 lg:gap-6 items-start">
      <div className="rounded-xl border border-gray-200 bg-raised p-5 space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-primary-500" /> Book a Teams meeting</h3>
        {!lead.email && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">This lead has no email address, so an invitation cannot be sent. Add one on the Details tab.</p>}
        <input value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputCls} placeholder="Meeting title" />
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputCls} aria-label="Date" />
          <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className={inputCls} aria-label="Time, India time" />
        </div>
        <TimeSlider value={form.time} onChange={(time) => setForm({ ...form, time })} label="Time (India)" />
        <LeadLocalTime date={form.date} time={form.time} country={lead.country} city={lead.city} />
        <DurationSlider value={form.duration} onChange={(duration) => setForm({ ...form, duration })} />
        <input value={form.extra} onChange={(e) => setForm({ ...form, extra: e.target.value })} className={inputCls} placeholder="Invite others too (comma-separated emails, optional)" />
        <textarea value={form.agenda} onChange={(e) => setForm({ ...form, agenda: e.target.value })} rows={2} className={inputCls} placeholder="What the call is about (optional)" />
        <button onClick={schedule} disabled={busy || !lead.email || !canWork} className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50">
          {busy ? 'Booking…' : 'Book and send the invitation'}
        </button>
        <p className="text-xs text-gray-400">The meeting is created in Teams and the lead receives the invitation by email. It then appears on the Meetings page, where it can be moved or cancelled.</p>
      </div>
      <aside className="rounded-xl border border-gray-200 bg-raised p-5 space-y-3 text-sm">
        <h3 className="text-sm font-semibold text-gray-800">Before the call</h3>
        <dl className="space-y-2">
          <div><dt className="text-[11px] text-gray-500">Last email we sent</dt><dd className="text-gray-900 break-words">{lead.emailHistory.find((e) => e.status === 'sent')?.subject || 'None yet'}</dd></div>
          <div><dt className="text-[11px] text-gray-500">What they last wrote</dt><dd className="text-gray-900 break-words">{lead.reply?.preview ? `“${lead.reply.preview}”` : 'They have not written yet'}</dd></div>
          <div><dt className="text-[11px] text-gray-500">Where they are</dt><dd className="text-gray-900">{[lead.city, lead.country].filter(Boolean).join(', ') || 'Not recorded'}</dd></div>
          {lead.notes && <div><dt className="text-[11px] text-gray-500">Your notes</dt><dd className="text-gray-900 whitespace-pre-line break-words line-clamp-6">{lead.notes}</dd></div>}
        </dl>
        <a href="/crm/playbook" className="inline-block text-xs text-primary-600 hover:underline">Open the call guide</a>
      </aside>
    </div>
  )
}
