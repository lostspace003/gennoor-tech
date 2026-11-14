'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Users, Linkedin, Mail, StickyNote, Activity, ShieldAlert } from 'lucide-react'
import { Lead, LeadActivity } from '@/lib/crm/types'
import { CRM_USERS } from '@/lib/crm/users'
import { formatDateTime, timeAgo, DateRangeFilter, DateRange, rangeBounds, rangeLabel } from './shared'

interface MemberStats {
  email: string
  today: number
  inRange: number
  emails: number
  linkedin: number
  notes: number
  owned: number
  lastActivity?: LeadActivity & { leadId: string; leadName: string }
  recent: Array<LeadActivity & { leadId: string; leadName: string }>
}

// Manager-only visibility: what every team member is doing, computed from
// the activity trail on every lead. All counters (except leads owned, which
// is a point-in-time fact) respect the selected date range.
export default function TeamView({ leads, isManager }: { leads: Lead[]; isManager: boolean }) {
  const [range, setRange] = useState<DateRange>({ days: 7, from: '', to: '' })

  const rows = useMemo(() => {
    const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0)
    const { fromMs, toMs } = rangeBounds(range)
    const members = new Map<string, MemberStats>()

    const get = (email: string): MemberStats => {
      if (!members.has(email)) {
        members.set(email, { email, today: 0, inRange: 0, emails: 0, linkedin: 0, notes: 0, owned: 0, recent: [] })
      }
      return members.get(email)!
    }

    // The team is the people who can sign in today (src/lib/crm/users.ts), each with a card even before they
    // have done anything. Someone whose access was removed is not shown, although what they did stays in each
    // lead's history. (Before 14 November 2026 the page listed anyone who had ever acted on a lead: two people
    // who had left were shown, and a new colleague with no actions yet was not.)
    const team = CRM_USERS.map((e) => e.toLowerCase())
    for (const email of team) get(email)

    for (const lead of leads) {
      if (lead.owner) get(lead.owner.toLowerCase()).owned++
      for (const a of lead.activities) {
        const m = get(a.by.toLowerCase())
        const t = new Date(a.at).getTime()
        const entry = { ...a, leadId: lead.id, leadName: lead.name }
        if (!m.lastActivity || a.at > m.lastActivity.at) m.lastActivity = entry
        if (t >= dayStart.getTime()) m.today++
        if (t < fromMs || t > toMs) continue
        m.inRange++
        if (a.type === 'email') m.emails++
        if (a.type === 'linkedin') m.linkedin++
        if (a.type === 'note') m.notes++
        if (m.recent.length < 50) m.recent.push(entry)
      }
    }

    const out = [...members.values()]
      .filter((m) => team.includes(m.email))
      .sort((a, b) => b.inRange - a.inRange || b.owned - a.owned)
    for (const m of out) m.recent.sort((a, b) => b.at.localeCompare(a.at))
    return out
  }, [leads, range])

  if (!isManager) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <p className="text-sm text-gray-600">The Team page is for managers.</p>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-5xl">
      <div className="flex items-center gap-2 flex-wrap">
        <Users className="w-4 h-4 text-primary-500" />
        <h2 className="text-base font-semibold text-gray-900">Team activity</h2>
        <span className="text-xs text-gray-400">from what each person did on their leads</span>
        <div className="ml-auto">
          <DateRangeFilter
            value={range}
            onChange={setRange}
            presets={[{ days: 1, label: 'Today' }, { days: 7, label: 'Week' }, { days: 30, label: 'Month' }]}
          />
        </div>
      </div>

      {rows.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-10 text-center text-sm text-gray-400">No activity yet — it appears here as the team works leads.</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rows.map((m) => (
          <div key={m.email} className="bg-raised border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{m.email.split('@')[0]}</div>
                <div className="text-[11px] text-gray-400 truncate">
                  {m.lastActivity ? <>last: {m.lastActivity.description} · {timeAgo(m.lastActivity.at)}</> : 'no activity'}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
                <span title="actions today" className="font-semibold text-gray-800">{m.today} today</span>
                <span title={`actions ${rangeLabel(range)}`}>{m.inRange} / {rangeLabel(range)}</span>
              </div>
            </div>
            <div className="px-4 py-2.5 grid grid-cols-4 gap-2 text-center border-b border-gray-100">
              <Stat icon={Users} label="leads held" value={m.owned} />
              <Stat icon={Mail} label="emails" value={m.emails} />
              <Stat icon={Linkedin} label="LinkedIn" value={m.linkedin} />
              <Stat icon={StickyNote} label="notes" value={m.notes} />
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
              {m.recent.length === 0 && <p className="px-4 py-3 text-xs text-gray-400">No actions {rangeLabel(range)}.</p>}
              {m.recent.slice(0, 15).map((a, i) => (
                <Link key={i} href={`/crm/leads/${encodeURIComponent(a.leadId)}`} className="px-4 py-2 flex items-start gap-2 hover:bg-gray-50 block">
                  <Activity className="w-3.5 h-3.5 text-gray-300 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-700 break-words">{a.description} <span className="text-gray-400">· {a.leadName}</span></div>
                    <div className="text-[10px] text-gray-400">{formatDateTime(a.at)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: number }) {
  return (
    <div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
      <div className="text-[10px] text-gray-400 flex items-center justify-center gap-1"><Icon className="w-3 h-3" />{label}</div>
    </div>
  )
}
