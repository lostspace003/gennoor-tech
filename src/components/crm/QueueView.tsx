'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Reply, Hand, Send, Clock, UserPlus, ArrowRight, MessagesSquare, Flag } from 'lucide-react'
import { Lead, LEAD_STEPS, STEP_LABELS } from '@/lib/crm/types'
import { SEQUENCE, sequenceProgress, stepNumber } from '@/lib/crm/sequence'
import { QUIET_DAYS, needsYou, quietDays, todayLists } from '@/lib/crm/today'
import { timeAgo, api, StepStrip, useMinute } from './shared'
import { failedSeriesSend, lastSeriesSend, sendLine, sendState } from '@/lib/crm/delivery'
import { useCrm } from './CrmContext'
import SendStepModal from './SendStep'

const leadHref = (l: Lead, query = '') => `/crm/leads/${encodeURIComponent(l.id)}${query ? `?${query}` : ''}`

/**
 * Today: the whole job on one page, top to bottom.
 *   They replied        answer these first
 *   In conversation     Talking and Proposal: follow up the quiet ones
 *   New leads           pick some up
 *   Send                the next email of the series
 *   Series finished     no reply after the last email: close, or keep in touch by hand
 *   Waiting             nothing to do yet
 * The lists are worked out in lib/crm/today.ts, which the morning email uses too.
 * Every lead that needs someone sits in exactly one of them.
 */
export default function QueueView({ leads }: { leads: Lead[] }) {
  const { userEmail, isManager, reload, notify, ask, mailNote } = useCrm()
  const [sendTo, setSendTo] = useState<Lead[] | null>(null)
  const [everyone, setEveryone] = useState(false)
  const [busy, setBusy] = useState('')
  const me = userEmail.toLowerCase()

  const minute = useMinute()
  const t = useMemo(() => todayLists(leads, me, everyone), [leads, me, everyone])
  const total = needsYou(t)
  // Emails the email service has taken and not confirmed yet, on this desk: said plainly, so nobody wonders
  // whether a send worked (the owner did, on a day Microsoft's mail was slow)
  const { onItsWay, unconfirmed } = useMemo(() => {
    let onItsWay = 0
    const unconfirmed: Lead[] = []
    for (const l of leads) {
      if (l.dumped || !(everyone || !l.owner || l.owner.toLowerCase() === me)) continue
      const states = (l.emailHistory || []).map((e) => sendState(e))
      onItsWay += states.filter((s) => s === 'onItsWay').length
      if (states.includes('unconfirmed')) unconfirmed.push(l)
    }
    return { onItsWay, unconfirmed }
  }, [leads, me, everyone, minute]) // eslint-disable-line react-hooks/exhaustive-deps
  // Where every lead on this desk stands, in one row
  const counts = useMemo(() => {
    const mineOrAll = leads.filter((l) => !l.dumped && (everyone || !l.owner || l.owner.toLowerCase() === me))
    return Object.fromEntries(LEAD_STEPS.map((s) => [s, mineOrAll.filter((l) => l.status === s).length]))
  }, [leads, me, everyone])

  const act = async (key: string, work: () => Promise<void>, done: string) => {
    setBusy(key)
    try { await work(); await reload(); notify(done) } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }
  const pickUp = (ids: string[]) => act(`pick-${ids[0]}`, () => api('/api/admin/leads/claim', { method: 'POST', body: JSON.stringify({ leadIds: ids, action: 'claim' }) }), `${ids.length} lead${ids.length === 1 ? '' : 's'} picked up`)
  const noAnswer = (l: Lead) => act(`handled-${l.id}`, () => api('/api/admin/leads/inbox', { method: 'POST', body: JSON.stringify({ leadIds: [l.id], action: 'handled' }) }), 'Taken off the list')
  const close = async (list: Lead[]) => {
    const one = list.length === 1
    const go = await ask({
      title: one ? `Close ${list[0].name}?` : `Close these ${list.length} leads?`,
      text: 'They move to Closed and leave your lists. A closed lead can be moved back at any time, and you will still see it if they write again.',
      confirm: one ? 'Close lead' : `Close ${list.length} leads`,
    })
    if (go === null) return
    await act(`close-${list[0].id}`, async () => { for (const l of list) await api('/api/admin/leads', { method: 'PUT', body: JSON.stringify({ id: l.id, status: 'lost' }) }) }, one ? 'Closed' : `${list.length} leads closed`)
  }

  // Due emails grouped by which email it is, so one send covers one group
  const dueGroups = SEQUENCE.map((s) => ({ step: s, leads: t.due.filter((l) => sequenceProgress(l).next?.id === s.id) })).filter((g) => g.leads.length)
  const nothing = t.replies.length + t.talking.length + t.pool.length + t.toStart.length + t.due.length + t.noEmail.length + t.finished.length + t.waiting.length === 0
  const quiet = t.talking.filter((l) => quietDays(l) >= QUIET_DAYS).length

  // The email work of this desk in four numbers, beside the lists
  const desk = leads.filter((l) => !l.dumped && (everyone || !l.owner || l.owner.toLowerCase() === me))
  const weekAgo = Date.now() - 7 * 86_400_000
  const sentThisWeek = desk.reduce((n, l) => n + (l.emailHistory || []).filter((e) => e.status === 'sent' && Date.parse(e.at) >= weekAgo).length, 0)
  const didNotGo = desk.filter((l) => !!failedSeriesSend(l)).length
  const side: Array<[string, number, string]> = [
    ['Emails sent', sentThisWeek, 'in the last 7 days'],
    ['Due now', t.due.length + t.toStart.length, 'ready to send'],
    ['On its way', onItsWay, 'taken, not confirmed yet'],
    ['Did not go', didNotGo, 'to send again'],
  ]

  return (
    <div className="p-3 sm:p-5 xl:grid xl:grid-cols-[minmax(0,56rem)_16rem] xl:gap-5 xl:items-start">
    <div className="space-y-4 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {total === 0 ? 'Nothing needs you right now' : `${total} lead${total === 1 ? '' : 's'} need${total === 1 ? 's' : ''} you today`}
          </h2>
          <p className="text-xs text-gray-500">Work down the page: answer replies, follow up conversations, pick up new leads, send what is due.</p>
        </div>
        {isManager && (
          <label className="text-xs text-gray-600 flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" className="rounded" checked={everyone} onChange={(e) => setEveryone(e.target.checked)} /> Show everyone&apos;s leads
          </label>
        )}
      </div>

      {/* Where every lead stands, in one row. Each step opens the list of its leads. */}
      {leads.length > 0 && <StepStrip counts={counts} hrefFor={(s) => `/crm/leads?step=${s}${everyone ? '' : '&scope=mine'}`} />}

      {mailNote && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{mailNote} Replies from leads will not show here until this is put right.</p>}

      {/* Has what we sent really gone? */}
      {onItsWay > 0 && (
        <p className="text-xs bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-3 py-2 flex items-start gap-2">
          <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-500" />
          <span>
            {onItsWay === 1 ? 'One email is on its way.' : `${onItsWay} emails are on their way.`} The email service has taken {onItsWay === 1 ? 'it' : 'them'} and has not confirmed yet that {onItsWay === 1 ? 'it has' : 'they have'} gone.
            Nothing to do, and do not send {onItsWay === 1 ? 'it' : 'them'} again: each one changes to &quot;sent&quot; by itself, and your copy arrives in the admin mailbox at the same time.
          </span>
        </p>
      )}
      {unconfirmed.length > 0 && (
        <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">
          {unconfirmed.length === 1 ? 'One email was' : `${unconfirmed.length} emails were`} taken by the email service more than a day ago and never confirmed as gone:{' '}
          {unconfirmed.slice(0, 4).map((l, i) => (
            <span key={l.id}>{i > 0 && ', '}<Link href={leadHref(l, 'tab=emails')} className="underline font-medium">{l.name}</Link></span>
          ))}
          {unconfirmed.length > 4 ? ` and ${unconfirmed.length - 4} more` : ''}. Open the lead to send it again.
        </p>
      )}

      {leads.length === 0 ? (
        <div className="bg-raised border border-gray-200 rounded-xl p-8 text-center space-y-3">
          <p className="text-sm text-gray-600">No leads yet. Add your first ones to begin.</p>
          <Link href="/crm/leads" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
            <UserPlus className="w-4 h-4" /> Go to Leads
          </Link>
        </div>
      ) : nothing ? (
        <div className="bg-raised border border-gray-200 rounded-xl p-8 text-center space-y-3">
          <p className="text-sm text-gray-600">You hold no open leads at the moment. Pick some up from the Leads page, or add new ones.</p>
          <Link href="/crm/leads" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
            <UserPlus className="w-4 h-4" /> Go to Leads
          </Link>
        </div>
      ) : null}

      {/* They replied */}
      {t.replies.length > 0 && (
        <Section icon={Reply} tone="red" title="They replied" hint="Answer these first" count={t.replies.length}>
          {t.replies.map((l) => {
            const stop = l.reply?.kind === 'stop'
            return (
              <Row
                key={l.id} lead={l}
                sub={`${stop ? 'Asked us to stop. The emails have stopped. ' : ''}${l.reply?.preview ? `“${l.reply.preview.slice(0, 110)}” · ` : ''}${timeAgo(l.reply?.at || '').toLowerCase()}${l.owner ? '' : ' · unassigned'}`}
              >
                {stop ? (
                  <>
                    <Link href={leadHref(l, 'tab=emails')} className="px-2.5 py-1.5 text-gray-500 hover:text-gray-800 text-xs shrink-0">Read</Link>
                    <button onClick={() => close([l])} disabled={!!busy} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white text-xs rounded-lg shrink-0 disabled:opacity-50">Close lead</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => noAnswer(l)} disabled={!!busy} className="px-2.5 py-1.5 text-gray-500 hover:text-gray-800 text-xs shrink-0 disabled:opacity-50" title="Their message needs no answer: take it off this list">No reply needed</button>
                    <Link href={leadHref(l, 'tab=emails&reply=1')} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg flex items-center gap-1.5 shrink-0">
                      Read and reply <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </>
                )}
              </Row>
            )
          })}
        </Section>
      )}

      {/* In conversation */}
      {t.talking.length > 0 && (
        <Section icon={MessagesSquare} tone="blue" title="In conversation" hint={quiet ? `${quiet} quiet for ${QUIET_DAYS} days or more: follow up` : 'Talking, or with a proposal'} count={t.talking.length}>
          {t.talking.slice(0, 8).map((l) => {
            const days = quietDays(l)
            return (
              <Row key={l.id} lead={l} sub={`${STEP_LABELS[l.status]} · ${days === 0 ? 'in touch today' : `quiet for ${days} day${days === 1 ? '' : 's'}`}`} flag={days >= QUIET_DAYS ? 'follow up' : ''}>
                <Link href={leadHref(l, 'tab=emails&write=1')} className={`px-3 py-1.5 text-xs rounded-lg shrink-0 ${days >= QUIET_DAYS ? 'bg-primary-600 hover:bg-primary-700 text-white' : 'border border-primary-200 text-primary-700 hover:bg-primary-50'}`}>Follow up</Link>
              </Row>
            )
          })}
          {t.talking.length > 8 && <More text={`${t.talking.length - 8} more`} href={`/crm/leads?step=qualified${everyone ? '' : '&scope=mine'}`} />}
        </Section>
      )}

      {/* Unassigned */}
      {t.pool.length > 0 && (
        <Section
          icon={Hand} tone="green" title="New leads, not yet picked up" hint="Pick up the ones you will work" count={t.pool.length}
          action={<button onClick={() => pickUp(t.pool.slice(0, 25).map((l) => l.id))} disabled={!!busy} className="text-xs font-medium text-green-700 hover:underline disabled:opacity-50">Pick up {Math.min(25, t.pool.length)}</button>}
        >
          {t.pool.slice(0, 6).map((l) => (
            <Row key={l.id} lead={l} sub={[l.designation, l.country].filter(Boolean).join(' · ') || `added ${timeAgo(l.createdAt).toLowerCase()}`}>
              <button onClick={() => pickUp([l.id])} disabled={!!busy} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg flex items-center gap-1.5 shrink-0 disabled:opacity-50">
                <Hand className="w-3.5 h-3.5" /> Pick up
              </button>
            </Row>
          ))}
          {t.pool.length > 6 && <More text={`${t.pool.length - 6} more`} href="/crm/leads?scope=pool" />}
        </Section>
      )}

      {/* Send */}
      {t.toStart.length > 0 && (
        <Section
          icon={Send} tone="blue" title="Start the email series" hint={`Email 1 of ${SEQUENCE.length}: the introduction`} count={t.toStart.length}
          action={<button onClick={() => setSendTo(t.toStart)} className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded-lg">Review and send to all {t.toStart.length}</button>}
        >
          {t.toStart.slice(0, 6).map((l) => {
            // An email 1 that the email service could not send is due again, and the row says so
            const failed = failedSeriesSend(l)
            return (
              <Row key={l.id} lead={l} sub={failed ? `Email 1 did not go${failed.error ? `: ${failed.error}` : ''}. Send it again.` : l.email} flag={failed ? 'did not go' : ''}>
                <button onClick={() => setSendTo([l])} className="px-3 py-1.5 border border-primary-200 text-primary-700 hover:bg-primary-50 text-xs rounded-lg shrink-0">{failed ? 'Send again' : 'Send email 1'}</button>
              </Row>
            )
          })}
          {t.toStart.length > 6 && <More text={`${t.toStart.length - 6} more are included when you send to all`} />}
        </Section>
      )}

      {dueGroups.map((g) => (
        <Section
          key={g.step.id}
          icon={Send} tone="blue" title={`Email ${stepNumber(g.step.id)} is due: ${g.step.title}`} hint={g.step.purpose} count={g.leads.length}
          action={<button onClick={() => setSendTo(g.leads)} className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded-lg">Review and send to all {g.leads.length}</button>}
        >
          {g.leads.slice(0, 6).map((l) => (
            <Row key={l.id} lead={l} sub={`last email ${timeAgo(l.sequence?.sent[l.sequence.sent.length - 1]?.at || '').toLowerCase()}`}>
              <button onClick={() => setSendTo([l])} className="px-3 py-1.5 border border-primary-200 text-primary-700 hover:bg-primary-50 text-xs rounded-lg shrink-0">Send</button>
            </Row>
          ))}
          {g.leads.length > 6 && <More text={`${g.leads.length - 6} more are included when you send to all`} />}
        </Section>
      ))}

      {t.noEmail.length > 0 && (
        <Section icon={UserPlus} tone="amber" title="Missing an email address" hint="Add one, or reach them on LinkedIn" count={t.noEmail.length}>
          {t.noEmail.slice(0, 5).map((l) => (
            <Row key={l.id} lead={l} sub={l.linkedin ? 'has a LinkedIn profile' : 'no contact details yet'}>
              <Link href={leadHref(l)} className="px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs rounded-lg shrink-0">Open</Link>
            </Row>
          ))}
          {t.noEmail.length > 5 && <More text={`${t.noEmail.length - 5} more`} href="/crm/leads" />}
        </Section>
      )}

      {/* The series is over and they never wrote back */}
      {t.finished.length > 0 && (
        <Section
          icon={Flag} tone="gray" title="Series finished, no reply" hint="Close them, or keep in touch by hand" count={t.finished.length}
          action={t.finished.length > 1 ? <button onClick={() => close(t.finished)} disabled={!!busy} className="text-xs font-medium text-gray-700 hover:underline disabled:opacity-50">Close all {t.finished.length}</button> : undefined}
        >
          {t.finished.slice(0, 5).map((l) => (
            <Row key={l.id} lead={l} sub={l.sequence?.stopped ? `emails stopped: ${l.sequence.stopped.reason.toLowerCase()}` : `all ${SEQUENCE.length} emails sent, the last ${timeAgo(l.sequence?.sent[l.sequence.sent.length - 1]?.at || '').toLowerCase()}`}>
              <Link href={leadHref(l, 'tab=emails&write=1')} className="px-2.5 py-1.5 text-gray-500 hover:text-gray-800 text-xs shrink-0">Write</Link>
              <button onClick={() => close([l])} disabled={!!busy} className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs rounded-lg shrink-0 disabled:opacity-50">Close</button>
            </Row>
          ))}
          {t.finished.length > 5 && <More text={`${t.finished.length - 5} more are included when you close all`} />}
        </Section>
      )}

      {/* Waiting */}
      {t.waiting.length > 0 && (
        <Section icon={Clock} tone="gray" title="Waiting" hint="Emailed. The next email is not due yet." count={t.waiting.length}>
          {t.waiting.slice(0, 6).map((l) => {
            const p = sequenceProgress(l)
            const last = lastSeriesSend(l)
            return (
              <Row key={l.id} lead={l} sub={`${last ? `${sendLine(last)} · ` : ''}email ${stepNumber(p.next!.id)} in ${p.daysUntil} day${p.daysUntil === 1 ? '' : 's'}`}>
                <Link href={leadHref(l)} className="px-3 py-1.5 text-gray-500 hover:text-gray-800 text-xs shrink-0">View</Link>
              </Row>
            )
          })}
          {t.waiting.length > 6 && <More text={`${t.waiting.length - 6} more`} href={`/crm/leads?step=contacted${everyone ? '' : '&scope=mine'}`} />}
        </Section>
      )}

      {sendTo && (
        <SendStepModal
          leads={sendTo}
          notify={notify}
          onClose={() => setSendTo(null)}
          onSent={async () => { setSendTo(null); await reload() }}
        />
      )}
    </div>
    <aside className="mt-4 xl:mt-0 xl:sticky xl:top-4 rounded-xl border border-gray-200 bg-raised p-3.5 space-y-2.5">
      <h3 className="text-sm font-semibold text-gray-900">Your emails</h3>
      <div className="grid grid-cols-2 xl:grid-cols-1 gap-2">
        {side.map(([label, value, sub]) => (
          <div key={label} className="rounded-lg border border-gray-100 px-3 py-2">
            <div className="text-[11px] text-gray-500">{label}</div>
            <div className={`text-xl font-semibold tracking-tight ${label === 'Did not go' && value ? 'text-red-700' : 'text-gray-900'}`}>{value}</div>
            <div className="text-[11px] text-gray-400">{sub}</div>
          </div>
        ))}
      </div>
      <Link href="/crm/emails" className="inline-block text-xs font-medium text-primary-600 hover:underline">Open the email tracker</Link>
    </aside>
    </div>
  )
}

const TONES: Record<string, { border: string; bg: string; text: string }> = {
  red: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-700' },
  green: { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-700' },
  blue: { border: 'border-primary-200', bg: 'bg-primary-50', text: 'text-primary-700' },
  amber: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700' },
  gray: { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-600' },
}

function Section({ icon: Icon, tone, title, hint, count, action, children }: {
  icon: any; tone: string; title: string; hint: string; count: number; action?: React.ReactNode; children: React.ReactNode
}) {
  const t = TONES[tone]
  return (
    <section className={`rounded-xl border ${t.border} overflow-hidden bg-raised`}>
      <div className={`${t.bg} px-4 py-2.5 flex flex-wrap items-center justify-between gap-2`}>
        <div className="flex items-center gap-2 min-w-0">
          <Icon className={`w-4 h-4 shrink-0 ${t.text}`} />
          <h3 className={`text-sm font-semibold ${t.text}`}>{title}</h3>
          <span className={`text-xs font-semibold rounded-full bg-raised px-1.5 py-0.5 leading-none ${t.text}`}>{count}</span>
          <span className="text-xs text-gray-500 hidden sm:inline truncate">{hint}</span>
        </div>
        {action}
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </section>
  )
}

function Row({ lead, sub, flag, children }: { lead: Lead; sub: string; flag?: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5">
      <Link href={leadHref(lead)} className="min-w-0 flex-1 basis-56 hover:text-primary-700">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium text-gray-900 truncate">{lead.name} <span className="text-gray-400 font-normal">· {lead.company || 'no organization'}</span></span>
          {flag && <span className="shrink-0 text-[10.5px] font-semibold rounded-full bg-amber-100 text-amber-800 px-1.5 py-0.5">{flag}</span>}
        </div>
        <div className="text-xs text-gray-500 truncate">{sub}</div>
      </Link>
      <div className="flex items-center gap-1.5 ml-auto">{children}</div>
    </div>
  )
}

function More({ text, href }: { text: string; href?: string }) {
  return (
    <div className="px-4 py-2 text-xs text-gray-500 bg-gray-50">
      {href ? <Link href={href} className="hover:text-primary-600 hover:underline">{text}</Link> : text}
    </div>
  )
}
