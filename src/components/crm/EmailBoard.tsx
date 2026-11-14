'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import DOMPurify from 'dompurify'
import {
  AlertTriangle, Ban, CalendarDays, Check, ChevronDown, ChevronUp, CircleDashed, Clock, GripVertical,
  Inbox, Mail, Paperclip, PenLine, Play, RefreshCw, Reply, Send, X,
} from 'lucide-react'
import type { EmailRecord, Lead } from '@/lib/crm/types'
import { SEQUENCE, orderFor, sequenceProgress, stepById, stepNumber } from '@/lib/crm/sequence'
import { needsAnswer } from '@/lib/crm/replies'
import { sendHint, sendState, seriesRecord, span, type SendState } from '@/lib/crm/delivery'
import { shortName } from '@/lib/crm/users'
import { api, formatDateTime, timeAgo, Spinner } from './shared'

/**
 * The Emails tab of one lead, as a board (owner, 14 November 2026: "I'll drag into the canvas and then I'll
 * say send. It will show me all the information in the canvas ... I hover over it, it will tell me the
 * timeline, when was it sent. I can click on it, it will show a pop-up what was being sent").
 *
 *   left    the emails that can go: the nine of the series, or the AI Weekend campaign. Any of them can be
 *           sent next. Drag one onto another to change the order for this lead.
 *   right   the tray ("drag an email here to send it": the real email is shown, then Send), and under it
 *           everything sent and received, newest first. Hover says when; a click opens what was sent.
 *
 * A finger cannot drag, so every card also works by pressing it, and the order has arrows.
 * Nothing here sends by itself: an email goes when a person presses Send.
 */

export interface InboundMessage { id: string; from: string; subject: string; preview: string; body: string; receivedAt: string; mailboxes?: string[] }
type Notify = (msg: string, isError?: boolean) => void
type Campaign = 'series' | 'weekend'
/** An email put on the tray: a step of the series, or one of the AI Weekend campaign. */
interface Staged { campaign: Campaign; id: string }
interface WeekendInfo { cohort: { id: string; label: string; closes: string }; registered: boolean; emails: { kind: string; title: string; when: string }[]; had: Record<string, string>; titles: Record<string, string> }
interface Preview { subject: string; html: string; attachCatalogue?: boolean }
type Show = 'all' | 'series' | 'weekend' | 'written' | 'replies'
export interface Item { key: string; kind: 'series' | 'weekend' | 'written' | 'reply'; at: string; title: string; subject: string; state?: SendState; record?: EmailRecord; message?: InboundMessage }

interface Props {
  lead: Lead
  canWork: boolean
  notify: Notify
  onReload: () => Promise<void>
  inbound: InboundMessage[]
  inboundNote: string
  loading: boolean
  onCheckReplies: () => void
  /** Open the window for an email written by hand (a reply when a message is given). */
  onWrite: (replyTo?: InboundMessage | null) => void
  /** The window that reviews and sends the next email of the series, with the name it opens with: the way it was always sent. */
  onReview: () => void
  onStop: () => void
  onResume: () => void
  onAgain: (step: string) => void
  onNoAnswerNeeded: () => void
  onCloseLead: () => void
  /** An email to put on the tray at once ("samples", or "weekend:invite"): the email tracker links here with it. */
  stageFirst?: string
}

const STATE: Record<SendState, { word: string; chip: string }> = {
  sent: { word: 'sent', chip: 'bg-green-50 text-green-700' },
  onItsWay: { word: 'on its way', chip: 'bg-gray-100 text-gray-700' },
  unconfirmed: { word: 'not confirmed', chip: 'bg-amber-50 text-amber-800' },
  failed: { word: 'did not go', chip: 'bg-red-50 text-red-700' },
}

function StateIcon({ state, next }: { state: SendState | null; next?: boolean }) {
  return state === 'sent' ? <Check className="w-4 h-4 text-green-600" />
    : state === 'onItsWay' ? <Clock className="w-4 h-4 text-gray-500" />
    : state === 'unconfirmed' ? <AlertTriangle className="w-4 h-4 text-amber-600" />
    : state === 'failed' ? <AlertTriangle className="w-4 h-4 text-red-600" />
    : <CircleDashed className={`w-4 h-4 ${next ? 'text-primary-600' : 'text-gray-300'}`} />
}

/** The whole story of one email we sent, in a sentence or two: what a card says when the pointer rests on it. */
function story(e: EmailRecord): string {
  const state = sendState(e)
  const confirmed = e.confirmedAt ? ` Confirmed ${formatDateTime(e.confirmedAt)}${e.confirmedBy === 'copy' ? ', when our own copy arrived' : ' by the email service'}.` : ''
  return `${sendHint({ at: e.at, state, error: e.error })}${state === 'sent' ? confirmed : ''} Sent by ${shortName(e.by)}.`
}

export default function EmailBoard(p: Props) {
  const { lead, canWork, notify, onReload, inbound } = p
  const progress = sequenceProgress(lead)
  const waiting = needsAnswer(lead)
  const stoppedForThem = !!lead.sequence?.stopped || lead.reply?.kind === 'stop'

  const [campaign, setCampaign] = useState<Campaign>('series')
  const [staged, setStaged] = useState<Staged | null>(null)
  const [note, setNote] = useState('')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [previewing, setPreviewing] = useState(false)
  const [sending, setSending] = useState(false)
  const [open, setOpen] = useState<Item | null>(null)
  const [show, setShow] = useState<Show>('all')
  const [weekend, setWeekend] = useState<WeekendInfo | null>(null)
  const [weekendNote, setWeekendNote] = useState('')
  // The order of the emails not sent yet, while a move is being saved (so the list does not jump back for a second)
  const [moved, setMoved] = useState<string[] | null>(null)
  // What is being dragged, readable at once by whatever it is dropped on; the two states only draw it
  const drag = useRef<Staged | null>(null)
  const [dragKey, setDragKey] = useState('')
  const [over, setOver] = useState('')
  const tray = useRef<HTMLDivElement>(null)

  const loadWeekend = useCallback(async () => {
    try {
      setWeekend(await api<WeekendInfo>(`/api/admin/leads/weekend?leadId=${encodeURIComponent(lead.id)}`))
      setWeekendNote('')
    } catch (e: any) { setWeekendNote(e.message) }
  }, [lead.id])
  useEffect(() => { loadWeekend() }, [loadWeekend])

  // ---- the series, in this lead's own order
  const steps = orderFor(lead)
  const sentIds = progress.sentIds
  const unsentSaved = steps.filter((s) => !sentIds.includes(s.id)).map((s) => s.id)
  const unsent = moved && moved.length === unsentSaved.length ? moved : unsentSaved
  const shownSteps = [...steps.filter((s) => sentIds.includes(s.id)), ...unsent.map((id) => stepById(id)!)]
  useEffect(() => { setMoved(null) }, [lead.sequence?.order?.join(), sentIds.join()]) // eslint-disable-line react-hooks/exhaustive-deps
  const stateOfStep = (step: string): SendState => { const r = seriesRecord(lead, step); return r ? sendState(r) : 'sent' }
  const gone = sentIds.filter((id) => stateOfStep(id) === 'sent').length
  const onWay = sentIds.filter((id) => stateOfStep(id) === 'onItsWay').length
  const unsure = sentIds.filter((id) => stateOfStep(id) === 'unconfirmed').length

  /** Put one email where another stands, among those not sent yet, and keep that order for this lead. */
  const move = async (from: string, to: string | undefined) => {
    if (!to || from === to || !unsent.includes(from) || !unsent.includes(to)) return
    const next = unsent.filter((id) => id !== from)
    const at = next.indexOf(to)
    next.splice(unsent.indexOf(from) < unsent.indexOf(to) ? at + 1 : at, 0, from)
    setMoved(next)
    try {
      await api('/api/admin/leads/sequence', { method: 'PATCH', body: JSON.stringify({ leadIds: [lead.id], action: 'order', order: next }) })
      await onReload()
    } catch (e: any) { setMoved(null); notify(e.message, true) }
  }

  // ---- the tray
  const stage = (s: Staged) => {
    if (!canWork || !lead.email) return
    setStaged(s); setNote(''); setCampaign(s.campaign)
    // On a phone the tray is far below the list: bring it into view
    setTimeout(() => tray.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60)
  }
  const stagedOnce = useRef(false)
  useEffect(() => {
    if (stagedOnce.current || !p.stageFirst || !canWork || !lead.email) return
    stagedOnce.current = true
    const [a, b] = p.stageFirst.split(':')
    if (a === 'weekend' && b) setStaged({ campaign: 'weekend', id: b }), setCampaign('weekend')
    else if (stepById(a) && !sentIds.includes(a)) setStaged({ campaign: 'series', id: a })
  }, [p.stageFirst, canWork, lead.email]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!staged) { setPreview(null); return }
    let off = false
    setPreviewing(true)
    const url = staged.campaign === 'series'
      ? `/api/admin/leads/sequence?step=${staged.id}&leadId=${encodeURIComponent(lead.id)}&note=${encodeURIComponent(note)}`
      : `/api/admin/leads/weekend?leadId=${encodeURIComponent(lead.id)}&kind=${staged.id}`
    const timer = setTimeout(() => {
      api<Preview>(url).then((r) => { if (!off) setPreview(r) }).catch((e) => { if (!off) notify(e.message, true) }).finally(() => { if (!off) setPreviewing(false) })
    }, note ? 400 : 0)
    return () => { off = true; clearTimeout(timer) }
  }, [staged?.campaign, staged?.id, note, lead.id, lead.greeting, lead.name]) // eslint-disable-line react-hooks/exhaustive-deps

  const send = async () => {
    if (!staged || sending) return
    setSending(true)
    try {
      if (staged.campaign === 'series') {
        const res = await api<{ sent: number; onItsWay?: number; skipped?: string[]; errors?: string[] }>('/api/admin/leads/sequence', { method: 'POST', body: JSON.stringify({ leadIds: [lead.id], step: staged.id, note }) })
        const n = stepNumber(staged.id)
        if (res.sent > 0) notify(res.onItsWay ? `Email ${n} is on its way: the email service has it, and the board says "sent" once it confirms.` : `Email ${n} sent`)
        else notify([...(res.errors || []), ...(res.skipped || [])][0] || 'Nothing was sent', true)
      } else {
        const res = await api<{ onItsWay: boolean; title: string }>('/api/admin/leads/weekend', { method: 'POST', body: JSON.stringify({ leadId: lead.id, kind: staged.id, again: !!weekend?.had[staged.id] }) })
        notify(res.onItsWay ? `"${res.title}" is on its way: the email service has it, and the board says "sent" once it confirms.` : `"${res.title}" sent`)
      }
      setStaged(null); setNote('')
      await onReload()
      loadWeekend()
    } catch (e: any) { notify(e.message, true) } finally { setSending(false) }
  }

  // ---- dragging
  const startDrag = (s: Staged) => (ev: React.DragEvent) => {
    drag.current = s
    setDragKey(`${s.campaign}:${s.id}`)
    ev.dataTransfer.effectAllowed = 'move'
    try { ev.dataTransfer.setData('text/plain', `${s.campaign}:${s.id}`) } catch { /* some browsers refuse; the ref carries it */ }
  }
  const endDrag = () => { drag.current = null; setDragKey(''); setOver('') }
  const dropOn = (target: 'tray' | string) => (ev: React.DragEvent) => {
    ev.preventDefault()
    const d = drag.current
    endDrag()
    if (!d) return
    if (target === 'tray') stage(d)
    else if (d.campaign === 'series') move(d.id, target)
  }
  const allow = (target: string) => (ev: React.DragEvent) => { if (drag.current) { ev.preventDefault(); if (over !== target) setOver(target) } }

  // ---- everything sent and received
  const items: Item[] = [
    ...(lead.emailHistory || []).map((e, i): Item => ({
      key: `e${i}-${e.at}`,
      kind: e.step ? 'series' : e.weekend ? 'weekend' : 'written',
      at: e.at,
      title: e.step ? `Email ${stepNumber(e.step)} · ${stepById(e.step)?.title || 'Email series'}` : e.weekend ? `AI Weekend · ${weekend?.titles?.[e.weekend.kind] || 'campaign email'}` : 'Written by hand',
      subject: e.subject,
      state: sendState(e),
      record: e,
    })),
    ...inbound.map((m): Item => ({ key: `r-${m.id}`, kind: 'reply', at: m.receivedAt, title: `Reply from ${m.from}`, subject: m.subject, message: m })),
  ].sort((a, b) => b.at.localeCompare(a.at))
  const count = (k: Show) => (k === 'all' ? items.length : items.filter((i) => (k === 'replies' ? i.kind === 'reply' : i.kind === k)).length)
  const shown = items.filter((i) => show === 'all' || (show === 'replies' ? i.kind === 'reply' : i.kind === show))
  const lastSent = items.find((i) => i.kind !== 'reply' && i.state !== 'failed')

  const hadWeekend = weekend ? weekend.emails.filter((e) => weekend.had[e.kind]).length : 0
  const stagedStep = staged?.campaign === 'series' ? stepById(staged.id) : null
  const stagedTitle = staged ? (stagedStep ? `Email ${stepNumber(staged.id)} of ${SEQUENCE.length} · ${stagedStep.title}` : `AI Weekend · ${weekend?.titles?.[staged.id] || 'campaign email'}`) : ''
  const outOfTurn = !!stagedStep && progress.next?.id !== stagedStep.id

  return (
    <div className="p-3 sm:p-5 max-w-6xl space-y-3">
      {/* The lead's emails at a glance; each tile is also a way in */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        <Tile on={campaign === 'series'} onClick={() => setCampaign('series')} label="Email series" icon={Mail}
          value={`${gone} of ${SEQUENCE.length} sent`}
          sub={progress.stopped ? 'stopped' : progress.finished ? 'all sent' : progress.next ? (progress.due ? `email ${stepNumber(progress.next.id)} is due now` : `email ${stepNumber(progress.next.id)} due in ${progress.daysUntil} day${progress.daysUntil === 1 ? '' : 's'}`) : ''}
          warn={onWay ? `${onWay} on its way` : unsure ? `${unsure} not confirmed` : ''} />
        <Tile on={campaign === 'weekend'} onClick={() => setCampaign('weekend')} label="AI Weekend" icon={CalendarDays}
          value={weekend ? `${hadWeekend} of ${weekend.emails.length} sent` : '…'}
          sub={weekend ? (weekend.registered ? 'registered for this weekend' : weekend.cohort.label) : weekendNote ? 'could not load' : ''} />
        <Tile on={show === 'replies'} onClick={() => setShow(show === 'replies' ? 'all' : 'replies')} label="Replies" icon={Inbox}
          value={`${inbound.length}`}
          sub={waiting ? '' : lead.reply ? `last one ${timeAgo(lead.reply.at).toLowerCase()}` : 'none yet'}
          warn={waiting ? (lead.reply?.kind === 'stop' ? 'asked us to stop' : 'waiting for your answer') : ''} />
        <Tile onClick={() => lastSent && setOpen(lastSent)} label="Last email" icon={Send}
          value={lastSent ? timeAgo(lastSent.at) : 'none yet'}
          sub={lastSent ? lastSent.title : 'start with the first email of the series'} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[330px_1fr] gap-4 lg:gap-5 items-start">
        {/* ---------------- left: the emails that can go ---------------- */}
        <div className="space-y-2.5 min-w-0">
          <div className="flex rounded-lg border border-gray-200 bg-gray-50 p-0.5 text-sm">
            {([['series', 'Email series'], ['weekend', 'AI Weekend']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setCampaign(id)} className={`flex-1 px-3 py-1.5 rounded-md font-medium ${campaign === id ? 'bg-raised text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>{label}</button>
            ))}
          </div>

          {!lead.email ? (
            <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">This lead has no email address. Add one on the Details tab, or reach them on the LinkedIn tab.</p>
          ) : campaign === 'series' ? (
            <>
              {progress.stopped ? (
                <div className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 space-y-1.5">
                  <div className="text-gray-700">Stopped: {lead.sequence?.stopped?.reason}</div>
                  {canWork && <button onClick={p.onResume} className="text-primary-600 hover:underline flex items-center gap-1"><Play className="w-3 h-3" /> Resume the series</button>}
                </div>
              ) : progress.finished ? (
                <p className="text-xs bg-green-50 border border-green-200 text-green-800 rounded-lg px-3 py-2">All {SEQUENCE.length} emails have been sent. Write to them directly from here on.</p>
              ) : canWork ? (
                <p className="text-[11.5px] leading-snug text-gray-500 px-0.5">Drag an email onto the board to send it, or onto another email to change the order. Pressing an email does the same.</p>
              ) : null}

              {(lead.status === 'qualified' || lead.status === 'proposal') && !progress.stopped && !progress.finished && (
                <p className="text-[11px] text-gray-500 px-0.5">You are in conversation with this lead, so the series is not on your Today list. Send an email of it only if it helps.</p>
              )}

              <ol className="space-y-1">
                {shownSteps.map((s) => {
                  const sent = lead.sequence?.sent.find((x) => x.step === s.id)
                  const record = seriesRecord(lead, s.id)
                  const state: SendState | null = sent ? (record ? sendState(record) : 'sent') : record?.status === 'failed' ? 'failed' : null
                  const isNext = !progress.stopped && progress.next?.id === s.id
                  const n = stepNumber(s.id)
                  const meta = sent && state === 'sent' ? `sent ${timeAgo(sent.at).toLowerCase()} by ${shortName(sent.by)}`
                    : sent && state === 'onItsWay' ? `on its way for ${span(sent.at)}: not confirmed yet`
                    : sent && state === 'unconfirmed' ? `handed over ${span(sent.at)} ago and never confirmed as gone`
                    : state === 'failed' ? `did not go${record?.error ? `: ${record.error}` : ''}`
                    : isNext ? (progress.due ? 'next · due now' : `next · due in ${progress.daysUntil} day${progress.daysUntil === 1 ? '' : 's'}`)
                    : s.purpose

                  // An email that has gone (or is on its way): a quiet row; pressing it opens what was sent
                  if (sent) {
                    const item = record ? items.find((i) => i.record === record) : undefined
                    return (
                      <li key={s.id}>
                        <button onClick={() => item && setOpen(item)} title={record ? story(record) : undefined} className="w-full flex gap-2.5 px-2.5 py-1.5 rounded-lg text-left hover:bg-gray-50">
                          <span className="mt-0.5 shrink-0"><StateIcon state={state} /></span>
                          <span className="min-w-0">
                            <span className="block text-sm text-gray-500">{n}. {s.title}</span>
                            <span className={`block text-[11px] ${state === 'unconfirmed' ? 'text-amber-700' : 'text-gray-400'}`}>{meta}</span>
                          </span>
                        </button>
                        {state === 'unconfirmed' && canWork && <button onClick={() => p.onAgain(s.id)} className="ml-9 text-[11px] font-medium text-amber-800 underline">Send it again</button>}
                      </li>
                    )
                  }

                  // An email that can still go: a card to drag, press, or move
                  const key = `series:${s.id}`
                  const at = unsent.indexOf(s.id)
                  const movable = canWork && !progress.stopped
                  return (
                    <li key={s.id} draggable={movable} onDragStart={startDrag({ campaign: 'series', id: s.id })} onDragEnd={endDrag} onDragOver={allow(s.id)} onDrop={dropOn(s.id)}
                      className={`flex items-stretch rounded-lg border bg-raised ${staged?.campaign === 'series' && staged.id === s.id ? 'border-primary-600' : over === s.id && dragKey.startsWith('series:') && dragKey !== key ? 'border-primary-600 bg-primary-50' : isNext ? 'border-primary-200' : 'border-gray-200'} ${dragKey === key ? 'opacity-40' : ''}`}>
                      {movable && <span className="flex items-center pl-1 text-gray-300 cursor-grab" aria-hidden="true"><GripVertical className="w-4 h-4" /></span>}
                      <button onClick={() => stage({ campaign: 'series', id: s.id })} disabled={!movable} title={movable ? 'Put this email on the board, to read it and send it' : undefined} className="min-w-0 flex-1 flex gap-2 px-2 py-2 text-left disabled:cursor-default">
                        <span className="mt-0.5 shrink-0"><StateIcon state={state} next={isNext} /></span>
                        <span className="min-w-0">
                          <span className={`block text-sm ${isNext ? 'text-primary-800 font-medium' : 'text-gray-800'}`}>{n}. {s.title}</span>
                          <span className={`block text-[11px] truncate ${state === 'failed' ? 'text-red-700' : isNext ? 'text-primary-700' : 'text-gray-400'}`} title={meta}>{meta}</span>
                        </span>
                      </button>
                      {movable && (
                        <span className="flex flex-col justify-center pr-0.5">
                          <button onClick={() => move(s.id, unsent[at - 1])} disabled={at <= 0} aria-label={`Move "${s.title}" up`} title="Send it sooner" className="p-0.5 rounded text-gray-400 hover:text-gray-900 disabled:opacity-25"><ChevronUp className="w-4 h-4" /></button>
                          <button onClick={() => move(s.id, unsent[at + 1])} disabled={at === unsent.length - 1} aria-label={`Move "${s.title}" down`} title="Send it later" className="p-0.5 rounded text-gray-400 hover:text-gray-900 disabled:opacity-25"><ChevronDown className="w-4 h-4" /></button>
                        </span>
                      )}
                    </li>
                  )
                })}
              </ol>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                {canWork && progress.next && !progress.stopped && (
                  <button onClick={p.onReview} className="text-xs text-primary-600 hover:underline" title="The window that shows the next email with the name it opens with, as before">Review the next email in a window</button>
                )}
                {!progress.stopped && !progress.finished && canWork && (
                  <button onClick={p.onStop} className="text-xs text-gray-400 hover:text-red-600 flex items-center gap-1"><Ban className="w-3 h-3" /> Stop the emails for this lead</button>
                )}
              </div>
            </>
          ) : (
            <>
              {!weekend ? (weekendNote ? <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{weekendNote}</p> : <Spinner label="Loading…" />) : (
                <>
                  <p className="text-[11.5px] leading-snug text-gray-500 px-0.5">For the weekend of <span className="text-gray-800 font-medium">{weekend.cohort.label}</span>. Registration closes on {weekend.cohort.closes}.</p>
                  {weekend.registered ? (
                    <p className="text-xs bg-green-50 border border-green-200 text-green-800 rounded-lg px-3 py-2">They are registered for this weekend, so the campaign has done its work. What follows (how to pay, the reminder, the joining link) is sent from the AI Weekend page.</p>
                  ) : stoppedForThem ? (
                    <p className="text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-2">The emails for this lead were stopped, so nothing of the campaign is sent to them.</p>
                  ) : null}
                  <ol className="space-y-1">
                    {weekend.emails.map((e) => {
                      const hadAt = weekend.had[e.kind]
                      const record = (lead.emailHistory || []).find((r) => r.weekend?.kind === e.kind && r.weekend.cohort === weekend.cohort.id)
                      const state: SendState | null = record ? sendState(record) : hadAt ? 'sent' : null
                      const item = record ? items.find((i) => i.record === record) : undefined
                      const key = `weekend:${e.kind}`
                      const can = canWork && !weekend.registered && !stoppedForThem
                      if (state && state !== 'failed') {
                        return (
                          <li key={e.kind}>
                            <button onClick={() => item && setOpen(item)} title={record ? story(record) : undefined} className="w-full flex gap-2.5 px-2.5 py-1.5 rounded-lg text-left hover:bg-gray-50">
                              <span className="mt-0.5 shrink-0"><StateIcon state={state} /></span>
                              <span className="min-w-0">
                                <span className="block text-sm text-gray-500">{e.title}</span>
                                <span className="block text-[11px] text-gray-400">{state === 'sent' ? `sent ${timeAgo(record?.at || hadAt).toLowerCase()}` : state === 'onItsWay' ? `on its way for ${span(record!.at)}: not confirmed yet` : 'handed over and never confirmed as gone'}</span>
                              </span>
                            </button>
                          </li>
                        )
                      }
                      return (
                        <li key={e.kind} draggable={can} onDragStart={startDrag({ campaign: 'weekend', id: e.kind })} onDragEnd={endDrag}
                          className={`flex items-stretch rounded-lg border bg-raised ${staged?.campaign === 'weekend' && staged.id === e.kind ? 'border-primary-600' : 'border-gray-200'} ${dragKey === key ? 'opacity-40' : ''}`}>
                          {can && <span className="flex items-center pl-1 text-gray-300 cursor-grab" aria-hidden="true"><GripVertical className="w-4 h-4" /></span>}
                          <button onClick={() => stage({ campaign: 'weekend', id: e.kind })} disabled={!can} title={can ? 'Put this email on the board, to read it and send it' : undefined} className="min-w-0 flex-1 flex gap-2 px-2 py-2 text-left disabled:cursor-default">
                            <span className="mt-0.5 shrink-0"><StateIcon state={state} /></span>
                            <span className="min-w-0">
                              <span className="block text-sm text-gray-800">{e.title}</span>
                              <span className={`block text-[11px] truncate ${state === 'failed' ? 'text-red-700' : 'text-gray-400'}`} title={e.when}>{state === 'failed' ? 'did not go: it can be sent again' : e.when}</span>
                            </span>
                          </button>
                        </li>
                      )
                    })}
                  </ol>
                  <a href="/admin/weekend" target="_blank" rel="noreferrer" className="inline-block text-xs text-primary-600 hover:underline">Open the AI Weekend page (send to many, change the order)</a>
                </>
              )}
            </>
          )}
        </div>

        {/* ---------------- right: the board ---------------- */}
        <div className="space-y-3 min-w-0">
          {waiting && lead.reply && (
            <div className={`rounded-lg border px-3.5 py-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 ${lead.reply.kind === 'stop' ? 'border-gray-300 bg-gray-50' : 'border-red-200 bg-red-50'}`}>
              <div className="min-w-0 flex-1 basis-64">
                <div className={`text-sm font-semibold ${lead.reply.kind === 'stop' ? 'text-gray-800' : 'text-red-800'}`}>
                  {lead.reply.kind === 'stop' ? `${lead.name} asked us to stop. The email series has stopped.` : `${lead.name} replied ${timeAgo(lead.reply.at).toLowerCase()} and is waiting for an answer.`}
                </div>
                {lead.reply.preview && <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">“{lead.reply.preview}”</p>}
              </div>
              {canWork && (
                <div className="flex items-center gap-2">
                  <button onClick={p.onNoAnswerNeeded} className="text-xs text-gray-600 hover:text-gray-900">No reply needed</button>
                  {lead.reply.kind === 'stop'
                    ? <button onClick={p.onCloseLead} className="px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg hover:bg-gray-900">Close lead</button>
                    : <button onClick={() => p.onWrite(inbound[0] || null)} disabled={!lead.email} className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 flex items-center gap-1.5 disabled:opacity-50"><Reply className="w-3.5 h-3.5" /> Reply</button>}
                </div>
              )}
            </div>
          )}

          {/* The tray: an email dropped here is shown as it will arrive, and goes when Send is pressed */}
          <div ref={tray} onDragOver={allow('tray')} onDragLeave={() => over === 'tray' && setOver('')} onDrop={dropOn('tray')} aria-label="The email to send"
            className={`rounded-xl border-2 transition-colors ${staged ? 'border-primary-600 bg-raised' : over === 'tray' ? 'border-dashed border-primary-600 bg-primary-50' : 'border-dashed border-gray-300 bg-gray-50'}`}>
            {!staged ? (
              <div className="px-4 py-6 text-center">
                <div className="text-sm font-medium text-gray-700">{dragKey ? 'Drop it here' : 'Drag an email here to send it'}</div>
                <div className="text-xs text-gray-500 mt-0.5">You see the email exactly as it will arrive. Nothing goes until you press Send.</div>
              </div>
            ) : (
              <div className="p-3.5 space-y-2.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-primary-700">{stagedTitle}</div>
                    <div className="text-[15px] font-semibold text-gray-900 break-words">{preview?.subject || '…'}</div>
                    <div className="text-xs text-gray-500 break-words">To {lead.email} · from {staged.campaign === 'series' ? 'sales@gennoor.com · a copy goes to admin@gennoor.com and to you' : 'webinar@gennoor.com'}</div>
                    {preview?.attachCatalogue && <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5"><Paperclip className="w-3 h-3" /> Gennoor-Tech-Catalog.xlsx is attached</div>}
                  </div>
                  <button onClick={() => { setStaged(null); setNote('') }} className="p-1.5 rounded hover:bg-gray-100 shrink-0" aria-label="Take this email off the board" title="Take it off the board"><X className="w-4 h-4 text-gray-500" /></button>
                </div>
                {outOfTurn && <p className="text-[11.5px] text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">This is not the next email in the order. It goes now, and the others keep their order.</p>}
                {waiting && <p className="text-[11.5px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">They replied and are waiting for an answer. Answer first (or mark it as needing no reply): until then this is not sent.</p>}
                <div className="relative rounded-lg border border-gray-200 bg-gray-100 overflow-hidden">
                  {preview ? <iframe title="The email as it will arrive" srcDoc={preview.html.replace('<head>', '<head><base target="_blank">')} sandbox="allow-popups allow-popups-to-escape-sandbox" className="w-full h-[420px] border-0" /> : <div className="h-[420px]" />}
                  {previewing && <div className="absolute top-2 right-3 bg-surface/90 rounded-full px-2.5 py-1"><Spinner label="Loading" /></div>}
                </div>
                {staged.campaign === 'series' && (
                  <input value={note} onChange={(e) => setNote(e.target.value.slice(0, 600))} placeholder="Add a personal line at the top (optional)" aria-label="A personal line at the top of the email"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-raised focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <button onClick={send} disabled={sending || !preview || waiting} className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2">
                    <Send className="w-4 h-4" /> {sending ? 'Sending…' : 'Send now'}
                  </button>
                  <button onClick={() => { setStaged(null); setNote('') }} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Not now</button>
                </div>
              </div>
            )}
          </div>

          {/* Everything sent and received */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-sm font-medium text-gray-500 mr-1">Sent and received</h3>
              {([['all', 'All'], ['series', 'Series'], ['weekend', 'AI Weekend'], ['written', 'By hand'], ['replies', 'Replies']] as const).map(([id, label]) => (count(id) > 0 || id === 'all') && (
                <button key={id} onClick={() => setShow(id)} className={`px-2.5 py-1 text-xs rounded-full border ${show === id ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{label} {count(id)}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={p.onCheckReplies} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" title="Check for replies" aria-label="Check for replies"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
              {canWork && (
                <button onClick={() => p.onWrite(null)} disabled={!lead.email} className="px-3 py-2 border border-gray-300 text-gray-800 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50">
                  <PenLine className="w-4 h-4" /> Write an email
                </button>
              )}
            </div>
          </div>
          {p.inboundNote && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{p.inboundNote}</p>}
          {p.loading && items.length === 0 && <Spinner label="Loading…" />}
          {!p.loading && items.length === 0 && <div className="bg-gray-50 rounded-lg p-6 text-center text-sm text-gray-400">Nothing sent yet. Drag the first email of the series onto the board.</div>}
          {items.length > 0 && shown.length === 0 && <div className="bg-gray-50 rounded-lg p-5 text-center text-sm text-gray-400">Nothing of this kind yet.</div>}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
            {shown.map((item) => {
              const reply = item.kind === 'reply'
              return (
                <div key={item.key} role="button" tabIndex={0} onClick={() => setOpen(item)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(item) } }}
                  title={item.record ? story(item.record) : `Received ${formatDateTime(item.at)}`}
                  className={`group rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${reply ? 'border-green-200 bg-green-50 hover:border-green-400' : 'border-gray-200 bg-raised hover:border-gray-400'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-gray-500 truncate">{item.title}</div>
                      <div className="text-sm font-medium text-gray-900 truncate">{item.subject || '(no subject)'}</div>
                    </div>
                    {item.state && <span className={`shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-full ${STATE[item.state].chip}`}>{STATE[item.state].word}</span>}
                    {reply && canWork && <button onClick={(e) => { e.stopPropagation(); p.onWrite(item.message!) }} className="shrink-0 px-2.5 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 flex items-center gap-1"><Reply className="w-3 h-3" /> Reply</button>}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-1">{reply ? 'Received' : item.state === 'failed' ? 'Tried' : 'Sent'} {formatDateTime(item.at)}{item.record ? ` · by ${shortName(item.record.by)}` : ''}{item.record?.confirmedAt && item.state === 'sent' ? ` · confirmed ${span(item.record.at, Date.parse(item.record.confirmedAt))} later` : ''}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {open && <EmailPopup item={open} lead={lead} canWork={canWork} onClose={() => setOpen(null)} onAgain={(step) => { setOpen(null); p.onAgain(step) }} onReply={(m) => { setOpen(null); p.onWrite(m) }} />}
    </div>
  )
}

/** One number about this lead's emails. Pressing it shows the matching part of the board. */
function Tile({ label, value, sub, warn, icon: Icon, on, onClick }: { label: string; value: string; sub?: string; warn?: string; icon: any; on?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`text-left rounded-xl border bg-raised px-3 py-2 min-w-0 ${on ? 'border-gray-800' : 'border-gray-200 hover:border-gray-400'}`}>
      <div className="flex items-center gap-1.5 text-[11px] text-gray-500"><Icon className="w-3.5 h-3.5" />{label}</div>
      <div className="text-[15px] font-semibold text-gray-900 truncate">{value}</div>
      {warn ? <div className="text-[11px] font-medium text-amber-700 truncate">{warn}</div> : <div className="text-[11px] text-gray-500 truncate">{sub || ' '}</div>}
    </button>
  )
}

/** What was sent (or received), in a window of its own. Closed by its button, by Escape, or by pressing outside it. */
export function EmailPopup({ item, lead, canWork, onClose, onAgain, onReply }: { item: Item; lead: Lead; canWork: boolean; onClose: () => void; onAgain: (step: string) => void; onReply: (m: InboundMessage) => void }) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', key)
    return () => window.removeEventListener('keydown', key)
  }, [onClose])
  const e = item.record
  const m = item.message
  const html = m && /<[a-z][\s\S]*>/i.test(m.body || '') ? m.body : ''
  const text = e ? e.body || '' : m ? (m.body || m.preview).replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s{3,}/g, '\n').trim() : ''
  const rows: [string, string][] = e
    ? [
      ['To', e.to],
      ...(e.cc?.length ? [['Copy to', e.cc.join(', ')] as [string, string]] : []),
      [item.state === 'failed' ? 'Tried' : 'Sent', `${formatDateTime(e.at)} by ${shortName(e.by)}`],
      ['What became of it', item.state === 'sent' ? (e.confirmedAt ? `It has gone. Confirmed ${formatDateTime(e.confirmedAt)}${e.confirmedBy === 'copy' ? ', when our own copy arrived' : ' by the email service'}.` : 'It has gone.') : sendHint({ at: e.at, state: item.state!, error: e.error })],
    ]
    : [['From', m?.from || ''], ['Received', formatDateTime(item.at)]]
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={item.subject || item.title} className="bg-raised rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={(ev) => ev.stopPropagation()}>
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-start justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <div className="text-[11px] font-medium text-gray-500">{item.title}</div>
            <h3 className="text-base font-semibold text-gray-900 break-words">{item.subject || '(no subject)'}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded shrink-0" aria-label="Close"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="px-5 py-4 overflow-y-auto space-y-3">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
            {rows.map(([k, v]) => (
              <div key={k} className="contents"><dt className="text-gray-500 whitespace-nowrap">{k}</dt><dd className={`break-words ${k === 'What became of it' && item.state === 'failed' ? 'text-red-700' : k === 'What became of it' && item.state === 'unconfirmed' ? 'text-amber-700' : 'text-gray-900'}`}>{v}</dd></div>
            ))}
          </dl>
          {html ? (
            <div className="email-html-body text-sm text-gray-700 break-words bg-raised rounded-lg border border-gray-200 p-3"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html, { FORBID_TAGS: ['style', 'form', 'input'], FORBID_ATTR: ['onerror', 'onclick'] }) }} />
          ) : text ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-sm text-gray-800 whitespace-pre-line break-words">{text}</p>
            </div>
          ) : <p className="text-sm text-gray-400">The words of this email were not kept.</p>}
          {e && (e.step || e.weekend) && <p className="text-[11px] text-gray-400">These are the words that were sent to {lead.name || 'this lead'}. The pictures and the layout of the email are not kept with it.</p>}
        </div>
        <div className="px-5 py-3 border-t border-gray-200 flex flex-wrap justify-end gap-2 shrink-0">
          {e?.step && item.state === 'unconfirmed' && canWork && <button onClick={() => onAgain(e.step!)} className="px-4 py-2 border border-amber-300 text-amber-800 rounded-lg text-sm hover:bg-amber-50">Send it again</button>}
          {m && canWork && <button onClick={() => onReply(m)} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center gap-1.5"><Reply className="w-4 h-4" /> Reply</button>}
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Close</button>
        </div>
      </div>
    </div>
  )
}
