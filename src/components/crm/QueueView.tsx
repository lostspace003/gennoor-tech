'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Reply, Hand, Send, Clock, UserPlus, ArrowRight } from 'lucide-react'
import { Lead } from '@/lib/crm/types'
import { SEQUENCE, sequenceProgress, isOpen, stepNumber } from '@/lib/crm/sequence'
import { timeAgo, api } from './shared'
import { useCrm } from './CrmContext'
import SendStepModal from './SendStep'

const leadHref = (l: Lead, tab?: string) => `/crm/leads/${encodeURIComponent(l.id)}${tab ? `?tab=${tab}` : ''}`

/**
 * Today: the whole job on one page, top to bottom.
 *   1. Replies            answer these first
 *   2. Unassigned leads   pick some up
 *   3. Send today         the next email of the series is due
 *   4. Waiting            nothing to do yet
 * Every lead that is being worked sits in exactly one of these.
 */
export default function QueueView({ leads }: { leads: Lead[] }) {
  const { userEmail, isManager, reload, notify } = useCrm()
  const [replied, setReplied] = useState<Lead[]>([])
  const [sendTo, setSendTo] = useState<Lead[] | null>(null)
  const [everyone, setEveryone] = useState(false)
  const me = userEmail.toLowerCase()

  // A lead whose latest reply is newer than our last email needs an answer
  useEffect(() => {
    fetch('/api/admin/leads/inbox')
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data.messages)) return
        const latest = new Map<string, string>()
        for (const m of data.messages) {
          if (m.leadId && (!latest.has(m.leadId) || m.receivedAt > latest.get(m.leadId)!)) latest.set(m.leadId, m.receivedAt)
        }
        setReplied(leads.filter((l) => {
          const rec = latest.get(l.id)
          if (!rec || l.dumped) return false
          return rec > (l.emailHistory.find((e) => e.status === 'sent')?.at || '')
        }))
      })
      .catch(() => {})
  }, [leads])

  const { pool, mine, toStart, due, waiting, noEmail } = useMemo(() => {
    const open = leads.filter(isOpen)
    const pool = open.filter((l) => !l.owner)
    const mine = open.filter((l) => l.owner && (everyone || l.owner.toLowerCase() === me))
    const inSeries = mine.filter((l) => l.status === 'new' || l.status === 'contacted')
    const noEmail = inSeries.filter((l) => !l.email)
    const withEmail = inSeries.filter((l) => l.email)
    const toStart: Lead[] = []
    const due: Lead[] = []
    const waiting: Lead[] = []
    for (const l of withEmail) {
      const p = sequenceProgress(l)
      if (p.stopped || !p.next) continue
      if (p.sentIds.length === 0) toStart.push(l)
      else if (p.due) due.push(l)
      else waiting.push(l)
    }
    return { pool, mine, toStart, due, waiting, noEmail }
  }, [leads, me, everyone])

  const myReplies = replied.filter((l) => everyone || !l.owner || l.owner.toLowerCase() === me)

  const pickUp = async (ids: string[]) => {
    try {
      await api('/api/admin/leads/claim', { method: 'POST', body: JSON.stringify({ leadIds: ids, action: 'claim' }) })
      await reload()
      notify(`${ids.length} lead${ids.length === 1 ? '' : 's'} picked up`)
    } catch (e: any) { notify(e.message, true) }
  }

  // Due emails grouped by which email it is, so one send covers one group
  const dueGroups = SEQUENCE.map((s) => ({ step: s, leads: due.filter((l) => sequenceProgress(l).next?.id === s.id) })).filter((g) => g.leads.length)

  const nothing = myReplies.length + pool.length + toStart.length + due.length + waiting.length + noEmail.length === 0

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-gray-900">
            {myReplies.length + toStart.length + due.length === 0 ? 'Nothing to send right now' : `${myReplies.length + toStart.length + due.length} lead${myReplies.length + toStart.length + due.length === 1 ? '' : 's'} need you today`}
          </h2>
          <p className="text-xs text-gray-500">Work down the page: answer replies, pick up new leads, send what is due.</p>
        </div>
        {isManager && (
          <label className="text-xs text-gray-600 flex items-center gap-1.5 cursor-pointer">
            <input type="checkbox" className="rounded" checked={everyone} onChange={(e) => setEveryone(e.target.checked)} /> Show everyone&apos;s leads
          </label>
        )}
      </div>

      {nothing && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center space-y-3">
          <p className="text-sm text-gray-600">No leads yet. Add your first ones to begin.</p>
          <Link href="/crm/leads" className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700">
            <UserPlus className="w-4 h-4" /> Go to Leads
          </Link>
        </div>
      )}

      {/* 1. Replies */}
      {myReplies.length > 0 && (
        <Section n={1} icon={Reply} tone="red" title="They replied" hint="Answer these first" count={myReplies.length}>
          {myReplies.map((l) => (
            <Row key={l.id} lead={l} sub={l.owner ? l.owner.split('@')[0] : 'unassigned'}>
              <Link href={leadHref(l, 'emails')} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg flex items-center gap-1.5 shrink-0">
                Read and reply <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Row>
          ))}
        </Section>
      )}

      {/* 2. Unassigned */}
      {pool.length > 0 && (
        <Section
          n={2} icon={Hand} tone="green" title="New leads, not yet picked up" hint="Pick up the ones you will work" count={pool.length}
          action={<button onClick={() => pickUp(pool.slice(0, 25).map((l) => l.id))} className="text-xs font-medium text-green-700 hover:underline">Pick up {Math.min(25, pool.length)}</button>}
        >
          {pool.slice(0, 6).map((l) => (
            <Row key={l.id} lead={l} sub={[l.designation, l.country].filter(Boolean).join(' · ') || `added ${timeAgo(l.createdAt)}`}>
              <button onClick={() => pickUp([l.id])} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg flex items-center gap-1.5 shrink-0">
                <Hand className="w-3.5 h-3.5" /> Pick up
              </button>
            </Row>
          ))}
          {pool.length > 6 && <More text={`${pool.length - 6} more`} href="/crm/leads?scope=pool" />}
        </Section>
      )}

      {/* 3. Send today */}
      {toStart.length > 0 && (
        <Section
          n={3} icon={Send} tone="blue" title="Start the email series" hint={`Email 1 of ${SEQUENCE.length}: the introduction`} count={toStart.length}
          action={<button onClick={() => setSendTo(toStart)} className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded-lg">Review and send to all {toStart.length}</button>}
        >
          {toStart.slice(0, 6).map((l) => (
            <Row key={l.id} lead={l} sub={l.email}>
              <button onClick={() => setSendTo([l])} className="px-3 py-1.5 border border-primary-200 text-primary-700 hover:bg-primary-50 text-xs rounded-lg shrink-0">Send email 1</button>
            </Row>
          ))}
          {toStart.length > 6 && <More text={`${toStart.length - 6} more are included when you send to all`} />}
        </Section>
      )}

      {dueGroups.map((g) => (
        <Section
          key={g.step.id}
          n={3} icon={Send} tone="blue" title={`Email ${stepNumber(g.step.id)} is due: ${g.step.title}`} hint={g.step.purpose} count={g.leads.length}
          action={<button onClick={() => setSendTo(g.leads)} className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs rounded-lg">Review and send to all {g.leads.length}</button>}
        >
          {g.leads.slice(0, 6).map((l) => (
            <Row key={l.id} lead={l} sub={`last email ${timeAgo(l.sequence?.sent[l.sequence.sent.length - 1]?.at || '')}`}>
              <button onClick={() => setSendTo([l])} className="px-3 py-1.5 border border-primary-200 text-primary-700 hover:bg-primary-50 text-xs rounded-lg shrink-0">Send</button>
            </Row>
          ))}
          {g.leads.length > 6 && <More text={`${g.leads.length - 6} more are included when you send to all`} />}
        </Section>
      ))}

      {noEmail.length > 0 && (
        <Section n={3} icon={UserPlus} tone="amber" title="Missing an email address" hint="Add one, or reach them on LinkedIn" count={noEmail.length}>
          {noEmail.slice(0, 5).map((l) => (
            <Row key={l.id} lead={l} sub={l.linkedin ? 'has a LinkedIn profile' : 'no contact details yet'}>
              <Link href={leadHref(l)} className="px-3 py-1.5 border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs rounded-lg shrink-0">Open</Link>
            </Row>
          ))}
          {noEmail.length > 5 && <More text={`${noEmail.length - 5} more`} href="/crm/leads" />}
        </Section>
      )}

      {/* 4. Waiting */}
      {waiting.length > 0 && (
        <Section n={4} icon={Clock} tone="gray" title="Waiting" hint="Sent. The next email is not due yet." count={waiting.length}>
          {waiting
            .slice()
            .sort((a, b) => sequenceProgress(a).daysUntil - sequenceProgress(b).daysUntil)
            .slice(0, 6)
            .map((l) => {
              const p = sequenceProgress(l)
              return (
                <Row key={l.id} lead={l} sub={`email ${stepNumber(p.next!.id)} in ${p.daysUntil} day${p.daysUntil === 1 ? '' : 's'}`}>
                  <Link href={leadHref(l)} className="px-3 py-1.5 text-gray-500 hover:text-gray-800 text-xs shrink-0">View</Link>
                </Row>
              )
            })}
          {waiting.length > 6 && <More text={`${waiting.length - 6} more`} href="/crm/leads" />}
        </Section>
      )}

      {mine.length > 0 && (
        <p className="text-[11px] text-gray-400 pt-1">
          {mine.filter((l) => l.status === 'qualified').length} talking · {mine.filter((l) => l.status === 'proposal').length} with a proposal. Those are worked from the lead page, not the email series.
        </p>
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
  )
}

const TONES: Record<string, { border: string; bg: string; text: string }> = {
  red: { border: 'border-red-200', bg: 'bg-red-50', text: 'text-red-700' },
  green: { border: 'border-green-200', bg: 'bg-green-50', text: 'text-green-700' },
  blue: { border: 'border-primary-200', bg: 'bg-primary-50', text: 'text-primary-700' },
  amber: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700' },
  gray: { border: 'border-gray-200', bg: 'bg-gray-50', text: 'text-gray-600' },
}

function Section({ n, icon: Icon, tone, title, hint, count, action, children }: {
  n: number; icon: any; tone: string; title: string; hint: string; count: number; action?: React.ReactNode; children: React.ReactNode
}) {
  const t = TONES[tone]
  return (
    <div className={`rounded-xl border ${t.border} overflow-hidden bg-white`}>
      <div className={`${t.bg} px-4 py-2.5 flex flex-wrap items-center justify-between gap-2`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-5 h-5 rounded-full bg-white text-[11px] font-bold flex items-center justify-center shrink-0 ${t.text}`}>{n}</span>
          <Icon className={`w-4 h-4 shrink-0 ${t.text}`} />
          <span className={`text-sm font-semibold ${t.text}`}>{title}</span>
          <span className="text-xs text-gray-500 hidden sm:inline truncate">{hint}</span>
        </div>
        <div className="flex items-center gap-3">
          {action}
          <span className={`text-xs font-semibold ${t.text}`}>{count}</span>
        </div>
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  )
}

function Row({ lead, sub, children }: { lead: Lead; sub: string; children: React.ReactNode }) {
  return (
    <div className="px-4 py-2.5 flex items-center justify-between gap-3">
      <Link href={leadHref(lead)} className="min-w-0 hover:text-primary-700">
        <div className="text-sm font-medium text-gray-900 truncate">{lead.name} <span className="text-gray-400 font-normal">· {lead.company || 'no organization'}</span></div>
        <div className="text-xs text-gray-400 truncate">{sub}</div>
      </Link>
      {children}
    </div>
  )
}

function More({ text, href }: { text: string; href?: string }) {
  return (
    <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50">
      {href ? <Link href={href} className="hover:text-primary-600 hover:underline">{text}</Link> : text}
    </div>
  )
}
