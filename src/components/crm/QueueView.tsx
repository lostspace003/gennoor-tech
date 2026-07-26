'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Brain, Lock, Send, Clock, PauseCircle, CheckCircle2, ArrowRight, Hand, Reply } from 'lucide-react'
import { Lead } from '@/lib/crm/types'
import { timeAgo, InfoTip } from './shared'
import { useCrm } from './CrmContext'

const FOLLOW_UP_AFTER_DAYS = 5

interface Bucket {
  key: string
  title: string
  hint: string
  icon: any
  accent: string
  cta: string
  tab: 'research' | 'email' | 'schedule'
  leads: Lead[]
}

function lastSentAt(l: Lead): string | null {
  const sent = l.emailHistory.filter((e) => e.status === 'sent')
  return sent.length ? sent[0].at : null
}

// The propelling flow: every active lead lands in exactly one bucket, in
// pipeline order, each with a single obvious next action.
export function buildQueue(leads: Lead[], mine?: string): { buckets: Bucket[]; pool: Lead[]; paused: Lead[]; stopped: Lead[]; done: Lead[] } {
  const workable = leads.filter((l) => !l.dumped && l.processStatus === 'active' && !['won', 'lost'].includes(l.status))
  const pool = workable.filter((l) => !l.owner)
  // Personal queue: your claimed leads. Managers pass mine=undefined to see all claimed work.
  const active = workable.filter((l) => l.owner && (!mine || l.owner.toLowerCase() === mine.toLowerCase()))
  const now = Date.now()

  const needsResearch = active.filter((l) => !l.aiResearch)
  const needsPitch = active.filter((l) => l.aiResearch && !l.finalizedPitch)
  const needsEmail = active.filter((l) => l.finalizedPitch && !lastSentAt(l))
  const followUpDue = active.filter((l) => {
    const at = lastSentAt(l)
    return at && now - new Date(at).getTime() > FOLLOW_UP_AFTER_DAYS * 86_400_000
  })
  const waiting = active.filter((l) => {
    const at = lastSentAt(l)
    return at && now - new Date(at).getTime() <= FOLLOW_UP_AFTER_DAYS * 86_400_000
  })

  const buckets: Bucket[] = [
    { key: 'research', title: '1 · Research', hint: 'New leads — run AI research and discuss the angle', icon: Brain, accent: 'purple', cta: 'Research', tab: 'research', leads: needsResearch },
    { key: 'pitch', title: '2 · Finalize pitch', hint: 'Research done — lock the pitch brief', icon: Lock, accent: 'indigo', cta: 'Finalize', tab: 'research', leads: needsPitch },
    { key: 'email', title: '3 · First email', hint: 'Pitch locked — draft, review and send', icon: Send, accent: 'blue', cta: 'Draft email', tab: 'email', leads: needsEmail },
    { key: 'followup', title: `4 · Follow up (${FOLLOW_UP_AFTER_DAYS}+ days quiet)`, hint: 'No reply — send the webinar / training follow-up', icon: Clock, accent: 'amber', cta: 'Follow up', tab: 'schedule', leads: followUpDue },
    { key: 'waiting', title: 'Recently contacted', hint: 'Email sent — give them a few days', icon: CheckCircle2, accent: 'emerald', cta: 'View', tab: 'email', leads: waiting },
  ]

  return {
    buckets,
    pool,
    paused: leads.filter((l) => !l.dumped && l.processStatus === 'paused'),
    stopped: leads.filter((l) => !l.dumped && l.processStatus === 'stopped'),
    done: leads.filter((l) => ['won', 'lost'].includes(l.status)),
  }
}

const ACCENTS: Record<string, { border: string; bg: string; text: string; btn: string }> = {
  purple: { border: 'border-purple-200', bg: 'bg-purple-50', text: 'text-purple-700', btn: 'bg-purple-600 hover:bg-purple-700' },
  indigo: { border: 'border-indigo-200', bg: 'bg-indigo-50', text: 'text-indigo-700', btn: 'bg-indigo-600 hover:bg-indigo-700' },
  blue: { border: 'border-blue-200', bg: 'bg-blue-50', text: 'text-blue-700', btn: 'bg-blue-600 hover:bg-blue-700' },
  amber: { border: 'border-amber-200', bg: 'bg-amber-50', text: 'text-amber-700', btn: 'bg-amber-600 hover:bg-amber-700' },
  emerald: { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-700', btn: 'bg-emerald-600 hover:bg-emerald-700' },
}

export default function QueueView({ leads }: { leads: Lead[] }) {
  const { userEmail, isManager, reload, notify } = useCrm()
  const [replied, setReplied] = useState<Lead[]>([])

  // Reply-aware: a lead whose inbound message is newer than our last sent
  // email jumps to the top — that's the hottest work in the CRM.
  useEffect(() => {
    fetch('/api/admin/leads/inbox')
      .then((r) => r.json())
      .then((data) => {
        if (!Array.isArray(data.messages)) return
        const byLead = new Map<string, string>()
        for (const m of data.messages) {
          if (m.leadId && (!byLead.has(m.leadId) || m.receivedAt > byLead.get(m.leadId)!)) byLead.set(m.leadId, m.receivedAt)
        }
        setReplied(
          leads.filter((l) => {
            const rec = byLead.get(l.id)
            if (!rec || l.dumped) return false
            const sent = l.emailHistory.find((e) => e.status === 'sent')?.at || ''
            return rec > sent
          })
        )
      })
      .catch(() => {})
  }, [leads])

  // Managers see the whole team's queue; members see their own claimed work
  const { buckets, pool, paused, stopped } = buildQueue(leads, isManager ? undefined : userEmail)
  const actionable = buckets.slice(0, 4).reduce((n, b) => n + b.leads.length, 0) + replied.length

  const pickUp = async (id: string) => {
    try {
      const res = await fetch('/api/admin/leads/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadIds: [id], action: 'claim' }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Claim failed')
      await reload()
      notify('Picked up — it’s in your queue now')
    } catch (e: any) { notify(e.message, true) }
  }

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-5xl">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-1.5">{isManager ? 'Team work queue' : 'My work queue'}
          <InfoTip text="Every lead sits in exactly one bucket with its next action: pick up from Pool → Research → Finalize pitch → send First email → Follow up after 5 quiet days. Replies always jump to the top." />
        </h2>
        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1">
          {actionable} lead{actionable === 1 ? '' : 's'} need action
        </span>
        {(paused.length > 0 || stopped.length > 0) && (
          <span className="text-xs text-gray-400">{paused.length} paused · {stopped.length} stopped</span>
        )}
      </div>

      {/* Replies — hottest bucket, always on top */}
      {replied.length > 0 && (
        <div className="rounded-xl border border-rose-300 overflow-hidden">
          <div className="bg-rose-50 px-4 py-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Reply className="w-4 h-4 text-rose-600 shrink-0" />
              <span className="text-sm font-semibold text-rose-700">Reply received — act now</span>
            </div>
            <span className="text-xs font-medium text-rose-700">{replied.length}</span>
          </div>
          <div className="divide-y divide-gray-100 bg-white">
            {replied.map((l) => (
              <div key={l.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{l.name} <span className="text-gray-400 font-normal">· {l.company || '—'}</span></div>
                  <div className="text-xs text-gray-400">{l.owner ? l.owner.split('@')[0] : 'pool'}</div>
                </div>
                <Link href={`/crm/leads/${encodeURIComponent(l.id)}?tab=email`} className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs rounded-lg flex items-center gap-1.5 shrink-0">
                  Open reply <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pool — pick up new work */}
      <div className="rounded-xl border border-emerald-200 overflow-hidden">
        <div className="bg-emerald-50 px-4 py-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Hand className="w-4 h-4 text-emerald-700 shrink-0" />
            <span className="text-sm font-semibold text-emerald-700">Pool — unclaimed leads</span>
            <span className="text-xs text-gray-500 hidden sm:inline truncate">— pick one up to start working it</span>
          </div>
          <span className="text-xs font-medium text-emerald-700">{pool.length}</span>
        </div>
        {pool.length > 0 && (
          <div className="divide-y divide-gray-100 bg-white">
            {pool.slice(0, 6).map((l) => (
              <div key={l.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <Link href={`/crm/leads/${encodeURIComponent(l.id)}`} className="min-w-0 hover:text-blue-700">
                  <div className="text-sm font-medium text-gray-900 truncate">{l.name} <span className="text-gray-400 font-normal">· {l.company || '—'}</span></div>
                  <div className="text-xs text-gray-400">{l.priority && `${l.priority} priority · `}{[l.country, l.sector].filter(Boolean).join(' · ') || timeAgo(l.createdAt)}</div>
                </Link>
                <button onClick={() => pickUp(l.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg flex items-center gap-1.5 shrink-0">
                  <Hand className="w-3.5 h-3.5" /> Pick up
                </button>
              </div>
            ))}
            {pool.length > 6 && <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50">+ {pool.length - 6} more in the pool — see Leads → Pool</div>}
          </div>
        )}
      </div>

      {buckets.map((b) => {
        const a = ACCENTS[b.accent]
        return (
          <div key={b.key} className={`rounded-xl border ${a.border} overflow-hidden`}>
            <div className={`${a.bg} px-4 py-2.5 flex items-center justify-between gap-2`}>
              <div className="flex items-center gap-2 min-w-0">
                <b.icon className={`w-4 h-4 ${a.text} shrink-0`} />
                <span className={`text-sm font-semibold ${a.text}`}>{b.title}</span>
                <span className="text-xs text-gray-500 hidden sm:inline truncate">— {b.hint}</span>
              </div>
              <span className={`text-xs font-medium ${a.text}`}>{b.leads.length}</span>
            </div>
            {b.leads.length > 0 && (
              <div className="divide-y divide-gray-100 bg-white">
                {b.leads.slice(0, 8).map((l) => (
                  <div key={l.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">{l.name} <span className="text-gray-400 font-normal">· {l.company || '—'}</span></div>
                      <div className="text-xs text-gray-400">{l.priority && `${l.priority} priority · `}{timeAgo(l.lastActivity)} · {l.owner.split('@')[0]}</div>
                    </div>
                    <Link
                      href={`/crm/leads/${encodeURIComponent(l.id)}?tab=${b.tab}`}
                      className={`px-3 py-1.5 ${a.btn} text-white text-xs rounded-lg flex items-center gap-1.5 shrink-0`}
                    >
                      {b.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
                {b.leads.length > 8 && (
                  <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50">+ {b.leads.length - 8} more — open Leads and filter</div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {(paused.length > 0 || stopped.length > 0) && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-2 text-xs text-gray-500">
          <PauseCircle className="w-4 h-4" />
          {paused.length} paused and {stopped.length} stopped leads are excluded — restart them from the Leads page (select → Start).
        </div>
      )}
    </div>
  )
}
