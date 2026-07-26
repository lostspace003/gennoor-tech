'use client'

import Link from 'next/link'
import { Brain, Lock, Send, Clock, PauseCircle, CheckCircle2, ArrowRight } from 'lucide-react'
import { Lead } from '@/lib/crm/types'
import { timeAgo } from './shared'

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
export function buildQueue(leads: Lead[]): { buckets: Bucket[]; paused: Lead[]; stopped: Lead[]; done: Lead[] } {
  const active = leads.filter((l) => l.processStatus === 'active' && !['won', 'lost'].includes(l.status))
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
    paused: leads.filter((l) => l.processStatus === 'paused'),
    stopped: leads.filter((l) => l.processStatus === 'stopped'),
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
  const { buckets, paused, stopped } = buildQueue(leads)
  const actionable = buckets.slice(0, 4).reduce((n, b) => n + b.leads.length, 0)

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-5xl">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900">Work queue</h2>
        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1">
          {actionable} lead{actionable === 1 ? '' : 's'} need action
        </span>
        {(paused.length > 0 || stopped.length > 0) && (
          <span className="text-xs text-gray-400">{paused.length} paused · {stopped.length} stopped</span>
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
