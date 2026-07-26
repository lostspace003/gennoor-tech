'use client'

import Link from 'next/link'
import { Users, Brain, Mail, Calendar, Activity, ShieldAlert } from 'lucide-react'
import { Lead, LeadActivity } from '@/lib/crm/types'
import { formatDateTime, timeAgo } from './shared'

interface MemberStats {
  email: string
  today: number
  week: number
  researched: number
  emails: number
  followups: number
  owned: number
  lastActivity?: LeadActivity & { leadId: string; leadName: string }
  recent: Array<LeadActivity & { leadId: string; leadName: string }>
}

// Manager-only visibility: what every team member is doing, computed from
// the activity trail on every lead.
export default function TeamView({ leads, isManager }: { leads: Lead[]; isManager: boolean }) {
  if (!isManager) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <p className="text-sm text-gray-600">The Team view is available to managers only (admin, Jalal, Yusuf).</p>
      </div>
    )
  }

  const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0)
  const weekAgo = Date.now() - 7 * 86_400_000
  const members = new Map<string, MemberStats>()

  const get = (email: string): MemberStats => {
    if (!members.has(email)) {
      members.set(email, { email, today: 0, week: 0, researched: 0, emails: 0, followups: 0, owned: 0, recent: [] })
    }
    return members.get(email)!
  }

  for (const lead of leads) {
    if (lead.owner) get(lead.owner.toLowerCase()).owned++
    for (const a of lead.activities) {
      const m = get(a.by.toLowerCase())
      const t = new Date(a.at).getTime()
      if (t >= dayStart.getTime()) m.today++
      if (t >= weekAgo) m.week++
      if (a.type === 'research') m.researched++
      if (a.type === 'email') m.emails++
      if (a.type === 'followup') m.followups++
      const entry = { ...a, leadId: lead.id, leadName: lead.name }
      if (!m.lastActivity || a.at > m.lastActivity.at) m.lastActivity = entry
      if (m.recent.length < 30) m.recent.push(entry)
    }
  }

  const rows = [...members.values()]
    .filter((m) => m.email.includes('@'))
    .sort((a, b) => b.week - a.week)
  for (const m of rows) m.recent.sort((a, b) => b.at.localeCompare(a.at))

  return (
    <div className="p-3 sm:p-5 space-y-4 max-w-5xl">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-500" />
        <h2 className="text-base font-semibold text-gray-900">Team activity</h2>
        <span className="text-xs text-gray-400">computed from every action recorded on leads</span>
      </div>

      {rows.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-10 text-center text-sm text-gray-400">No activity yet — it appears here as the team works leads.</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {rows.map((m) => (
          <div key={m.email} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-gray-900 truncate">{m.email.split('@')[0]}</div>
                <div className="text-[11px] text-gray-400 truncate">
                  {m.lastActivity ? <>last: {m.lastActivity.description} · {timeAgo(m.lastActivity.at)}</> : 'no activity'}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500 shrink-0">
                <span title="actions today" className="font-semibold text-gray-800">{m.today} today</span>
                <span title="actions this week">{m.week} / wk</span>
              </div>
            </div>
            <div className="px-4 py-2.5 grid grid-cols-4 gap-2 text-center border-b border-gray-100">
              <Stat icon={Users} label="owned" value={m.owned} />
              <Stat icon={Brain} label="research" value={m.researched} />
              <Stat icon={Mail} label="emails" value={m.emails} />
              <Stat icon={Calendar} label="invites" value={m.followups} />
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
              {m.recent.slice(0, 10).map((a, i) => (
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
