'use client'

import { useEffect, useMemo, useState } from 'react'
import { Users, Activity, Mail, Brain, Calendar, Upload, FileText, Trash2, RefreshCw, Video, Search, X, CalendarClock } from 'lucide-react'
import { Lead, PIPELINE_STAGES } from '@/lib/crm/types'
import { StatusBadge, timeAgo, formatDateTime, api, STAGE_LABELS, Spinner, InfoTip, MultiSelect, Pagination, DurationSlider, TimeSlider, LeadLocalTime } from './shared'
import { istInstant, isoToIstParts } from '@/lib/crm/timezones'
import DocPreview from './DocPreview'
import { useCrm } from './CrmContext'

/* ---------------- Dashboard (real metrics only) ---------------- */

export function DashboardView({ leads, onGoLeads, onOpenLead }: { leads: Lead[]; onGoLeads: () => void; onOpenLead: (id: string) => void }) {
  const today = new Date().toDateString()
  const weekAgo = Date.now() - 7 * 86_400_000
  const metrics = [
    { label: "Today's new leads", value: leads.filter((l) => new Date(l.createdAt).toDateString() === today).length, icon: Users, color: 'text-blue-500' },
    { label: 'This week', value: leads.filter((l) => new Date(l.createdAt).getTime() >= weekAgo).length, icon: Calendar, color: 'text-indigo-500' },
    { label: 'Total leads', value: leads.length, icon: Users, color: 'text-gray-500' },
    { label: 'Active process', value: leads.filter((l) => l.processStatus === 'active').length, icon: Activity, color: 'text-green-500' },
    { label: 'Researched', value: leads.filter((l) => l.aiResearch).length, icon: Brain, color: 'text-purple-500' },
    { label: 'Emailed', value: leads.filter((l) => l.emailHistory.some((e) => e.status === 'sent')).length, icon: Mail, color: 'text-sky-500' },
  ]

  const recent = [...leads]
    .sort((a, b) => b.lastActivity.localeCompare(a.lastActivity))
    .slice(0, 8)

  return (
    <div className="p-3 sm:p-5 space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">{m.label}</span>
              <m.icon className={`w-4 h-4 ${m.color}`} />
            </div>
            <div className="text-2xl font-bold text-gray-900">{m.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline & revenue snapshot — real data only */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1.5">Pipeline funnel <InfoTip text="How many leads sit in each of the 5 journey stages. The ₹ value appears when deal values are set on leads (Overview → Edit)." /></h3>
          {(() => {
            const activeLeads = leads.filter((l) => !l.dumped)
            const max = Math.max(1, ...PIPELINE_STAGES.map((s) => activeLeads.filter((l) => l.stage === s).length))
            return (
              <div className="space-y-2">
                {PIPELINE_STAGES.map((s, i) => {
                  const inStage = activeLeads.filter((l) => l.stage === s)
                  const value = inStage.reduce((sum, l) => sum + (l.value || 0), 0)
                  return (
                    <div key={s} className="flex items-center gap-2 text-xs">
                      <span className="w-24 text-gray-500 shrink-0">{i + 1}. {STAGE_LABELS[s]}</span>
                      <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full flex items-center justify-end pr-1.5 text-[10px] text-white min-w-[1.25rem]" style={{ width: `${(inStage.length / max) * 100}%` }}>
                          {inStage.length}
                        </div>
                      </div>
                      {value > 0 && <span className="w-16 text-right text-gray-500 shrink-0">₹{(value / 1000).toFixed(0)}K</span>}
                    </div>
                  )
                })}
              </div>
            )
          })()}
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">Outcomes & outreach</h3>
          {(() => {
            const won = leads.filter((l) => l.status === 'won')
            const lost = leads.filter((l) => l.status === 'lost')
            const weekAgo = Date.now() - 7 * 86_400_000
            const emails7d = leads.reduce((n, l) => n + l.emailHistory.filter((e) => e.status === 'sent' && new Date(e.at).getTime() >= weekAgo).length, 0)
            const invites = leads.reduce((n, l) => n + l.followUps.length, 0)
            const wonValue = won.reduce((s, l) => s + (l.value || 0), 0)
            return (
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-green-50 rounded-lg p-3"><div className="text-xl font-bold text-green-700">{won.length}</div><div className="text-[11px] text-green-700">won{wonValue > 0 ? ` · ₹${(wonValue / 1000).toFixed(0)}K` : ''}</div></div>
                <div className="bg-red-50 rounded-lg p-3"><div className="text-xl font-bold text-red-600">{lost.length}</div><div className="text-[11px] text-red-600">lost</div></div>
                <div className="bg-sky-50 rounded-lg p-3"><div className="text-xl font-bold text-sky-700">{emails7d}</div><div className="text-[11px] text-sky-700">emails sent (7d)</div></div>
                <div className="bg-emerald-50 rounded-lg p-3"><div className="text-xl font-bold text-emerald-700">{invites}</div><div className="text-[11px] text-emerald-700">webinar/training invites</div></div>
              </div>
            )
          })()}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">Recent activity</h3>
          <button onClick={onGoLeads} className="text-xs text-blue-600 hover:underline">View all leads →</button>
        </div>
        <div className="divide-y divide-gray-100">
          {recent.length === 0 && <p className="px-5 py-10 text-center text-sm text-gray-400">No leads yet — upload your Excel from the Leads page.</p>}
          {recent.map((l) => (
            <button key={l.id} onClick={() => onOpenLead(l.id)} className="w-full px-5 py-3 flex items-center justify-between hover:bg-gray-50 text-left">
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900">{l.name} <span className="text-gray-400 font-normal">· {l.company || 'no company'}</span></div>
                <div className="text-xs text-gray-500 truncate">{l.activities[0]?.description || 'No activity'}</div>
              </div>
              <div className="text-xs text-gray-400 shrink-0 ml-4">{timeAgo(l.lastActivity)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------- Pipeline ---------------- */

export function PipelineView({ leads, onOpenLead }: { leads: Lead[]; onOpenLead: (id: string) => void }) {
  return (
    <div className="p-3 sm:p-5 overflow-x-auto">
      <div className="grid grid-cols-5 gap-4 min-w-[1000px]">
        {PIPELINE_STAGES.map((stage, idx) => {
          const stageLeads = leads.filter((l) => l.stage === stage)
          return (
            <div key={stage} className="bg-gray-100 rounded-lg p-3">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-sm font-semibold text-gray-700">{idx + 1}. {STAGE_LABELS[stage]}</span>
                <span className="text-xs bg-white rounded-full px-2 py-0.5 text-gray-500">{stageLeads.length}</span>
              </div>
              <div className="space-y-2 max-h-[65vh] overflow-y-auto">
                {stageLeads.map((l) => (
                  <button key={l.id} onClick={() => onOpenLead(l.id)} className="w-full bg-white rounded-lg p-3 text-left border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all">
                    <div className="text-sm font-medium text-gray-900 truncate">{l.name}</div>
                    <div className="text-xs text-gray-500 truncate">{l.company || '—'}</div>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap"><StatusBadge status={l.status} />
                      <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${l.owner ? 'bg-gray-100 text-gray-500' : 'bg-emerald-50 text-emerald-700'}`}>{l.owner ? l.owner.split('@')[0] : 'pool'}</span>
                    </div>
                  </button>
                ))}
                {stageLeads.length === 0 && <p className="text-xs text-gray-400 text-center py-6">Empty</p>}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ---------------- Inbox (whole CRM) ---------------- */

interface InboxMessage {
  id: string; from: string; fromName: string; subject: string; preview: string
  receivedAt: string; leadId: string; leadName: string; leadCompany: string
}

const INBOX_PER_PAGE = 10

export function InboxView({ onOpenLead }: { onOpenLead: (id: string) => void }) {
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [fromFilter, setFromFilter] = useState<string[]>([])
  const [page, setPage] = useState(1)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api<{ configured: boolean; messages: InboxMessage[]; note?: string; error?: string }>('/api/admin/leads/inbox')
      setMessages(res.messages || [])
      setNote(res.error || res.note || (!res.configured ? 'Inbound email is not configured.' : ''))
    } catch (e: any) { setNote(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // One entry per sender address — the multi-select filter for multi-email threads
  const senders = useMemo(() => {
    const map = new Map<string, string>()
    for (const m of messages) if (!map.has(m.from.toLowerCase())) map.set(m.from.toLowerCase(), m.leadName || m.fromName || m.from)
    return [...map.entries()].map(([value, name]) => ({ value, label: `${name} · ${value}` }))
  }, [messages])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return messages.filter((m) =>
      (fromFilter.length === 0 || fromFilter.includes(m.from.toLowerCase())) &&
      (!term || m.subject.toLowerCase().includes(term) || m.preview.toLowerCase().includes(term) ||
        m.from.toLowerCase().includes(term) || m.leadName.toLowerCase().includes(term) || (m.leadCompany || '').toLowerCase().includes(term))
    )
  }, [messages, search, fromFilter])

  const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / INBOX_PER_PAGE)))
  const pageMsgs = filtered.slice((safePage - 1) * INBOX_PER_PAGE, safePage * INBOX_PER_PAGE)

  return (
    <div className="p-3 sm:p-5 space-y-3 max-w-4xl">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">Replies from leads (admin@gennoor.com inbox) <InfoTip text="Emails received in the admin mailbox from any known lead address. Filter by sender when several people are writing in. Click one to open that lead's conversation and reply with AI." /></h3>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search subject, sender..."
              className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs w-48"
            />
          </div>
          <MultiSelect label="Email" options={senders} values={fromFilter} onChange={(v) => { setFromFilter(v); setPage(1) }} />
          <button onClick={load} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
        </div>
      </div>
      {note && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{note}</p>}
      {loading && <Spinner label="Checking inbox..." />}
      {!loading && filtered.length === 0 && !note && (
        <div className="bg-gray-50 rounded-lg p-10 text-center text-sm text-gray-400">{messages.length === 0 ? 'No replies from known leads yet.' : 'No emails match the current filters.'}</div>
      )}
      <div className="space-y-1.5">
        {pageMsgs.map((m) => (
          <button key={m.id} onClick={() => onOpenLead(m.leadId)} className="w-full text-left bg-white border border-gray-200 rounded-lg px-3 py-2.5 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-gray-900 truncate">{m.subject || '(no subject)'}</div>
              <div className="text-[11px] text-gray-400 shrink-0">{formatDateTime(m.receivedAt)}</div>
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5 truncate">{m.leadName} · {m.leadCompany || m.from}</div>
            <p className="text-xs text-gray-600 mt-1 line-clamp-1">{m.preview}</p>
          </button>
        ))}
      </div>
      <Pagination page={safePage} total={filtered.length} perPage={INBOX_PER_PAGE} onPage={setPage} />
    </div>
  )
}

/* ---------------- Scheduler (meetings + follow-ups) ---------------- */

interface Meeting { id: string; subject: string; start: string; end: string; attendees: string[]; joinUrl?: string; webLink?: string }
interface FollowUpRow { id: string; type: string; title: string; date: string; time: string; leadId: string; leadName: string; leadCompany: string; sentAt?: string }

export function SchedulerView({ onOpenLead }: { onOpenLead: (id: string) => void }) {
  const { notify, leads } = useCrm()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [followUps, setFollowUps] = useState<FollowUpRow[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Meeting | null>(null)
  const [busy, setBusy] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const [m, f] = await Promise.all([
        api<{ configured: boolean; meetings: Meeting[]; error?: string }>('/api/admin/leads/schedule-meeting'),
        api<{ followUps: FollowUpRow[] }>('/api/admin/leads/schedule-followup'),
      ])
      setMeetings(m.meetings || [])
      setFollowUps(f.followUps || [])
      setNote(m.error || (!m.configured ? 'Calendar is not configured — meetings unavailable.' : ''))
    } catch (e: any) { setNote(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-3 sm:p-5 grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Video className="w-4 h-4 text-blue-500" /> Upcoming meetings (next 30 days)</h3>
          <button onClick={load} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
        </div>
        {note && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{note}</p>}
        {loading && <Spinner label="Loading calendar..." />}
        {!loading && meetings.length === 0 && !note && <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">No upcoming meetings. Schedule one from a lead's page.</div>}
        {meetings.map((m) => (
          <div key={m.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-gray-900">{m.subject}</div>
              {m.joinUrl && <a href={m.joinUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-600 text-white rounded-lg px-2.5 py-1.5 hover:bg-blue-700 shrink-0">Join Teams</a>}
            </div>
            <div className="text-xs text-gray-500 mt-1">{formatDateTime(m.start)} → {formatDateTime(m.end)}</div>
            <div className="text-xs text-gray-400 mt-1 truncate">With: {m.attendees.join(', ') || '—'}</div>
            {/* Owner of the lead (or a manager) can move/cancel — server enforces */}
            <div className="flex items-center gap-1.5 mt-2">
              <button onClick={() => setEditing(m)} className="px-2.5 py-1 border border-gray-200 text-gray-600 text-[11px] rounded-lg hover:bg-gray-50 flex items-center gap-1">
                <CalendarClock className="w-3 h-3" /> Reschedule
              </button>
              <button
                onClick={async () => {
                  const comment = prompt(`Cancel "${m.subject}"?\nOptional message for the attendees (they get the cancellation by email):`)
                  if (comment === null) return
                  setBusy(m.id)
                  try {
                    await api(`/api/admin/leads/schedule-meeting?meetingId=${encodeURIComponent(m.id)}${comment ? `&comment=${encodeURIComponent(comment)}` : ''}`, { method: 'DELETE' })
                    notify('Meeting cancelled — attendees were emailed')
                    await load()
                  } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
                }}
                disabled={busy === m.id}
                className="px-2.5 py-1 border border-red-200 text-red-600 text-[11px] rounded-lg hover:bg-red-50 flex items-center gap-1 disabled:opacity-50"
              >
                <X className="w-3 h-3" /> {busy === m.id ? 'Cancelling…' : 'Cancel'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <RescheduleModal
          meeting={editing}
          lead={leads.find((l) => {
            const att = new Set(editing.attendees.map((a) => a.toLowerCase()))
            return [l.email, ...(l.altEmails || [])].some((e) => e && att.has(e.toLowerCase()))
          })}
          onClose={() => setEditing(null)}
          onDone={async () => { setEditing(null); notify('Meeting updated — attendees received the new invite'); await load() }}
          notify={notify}
        />
      )}

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-500" /> Webinar & training invites sent</h3>
        {followUps.length === 0 && <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">No follow-up invites yet.</div>}
        {followUps.map((f) => (
          <button key={`${f.leadId}-${f.id}`} onClick={() => onOpenLead(f.leadId)} className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-emerald-300 transition-all">
            <div className="text-sm font-medium text-gray-900">{f.type === 'webinar' ? '🎓 Webinar' : '📚 1-day training'}: {f.title}</div>
            <div className="text-xs text-gray-500 mt-1">{f.date} at {f.time} · {f.leadName} ({f.leadCompany || '—'})</div>
          </button>
        ))}
      </div>
    </div>
  )
}

// Reschedule an existing Teams meeting: new date/time + duration slider +
// message to attendees. Server allows the lead's owner or a manager.
function RescheduleModal({ meeting, lead, onClose, onDone, notify }: {
  meeting: Meeting
  lead?: Lead
  onClose: () => void
  onDone: () => Promise<void>
  notify: (m: string, e?: boolean) => void
}) {
  // Current start rendered as IST wall-clock — the picker always works in IST
  const istStart = isoToIstParts(meeting.start || new Date().toISOString())
  const [date, setDate] = useState(istStart.date)
  const [time, setTime] = useState(istStart.time)
  const [duration, setDuration] = useState(Math.max(15, Math.round((new Date(meeting.end).getTime() - new Date(meeting.start).getTime()) / 60_000) || 30))
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!date || !time) { notify('Pick a date and time', true); return }
    setSaving(true)
    try {
      await api('/api/admin/leads/schedule-meeting', {
        method: 'PATCH',
        body: JSON.stringify({ meetingId: meeting.id, start: istInstant(date, time).toISOString(), durationMinutes: duration, comment: comment.trim() || undefined }),
      })
      await onDone()
    } catch (e: any) { notify(e.message, true) } finally { setSaving(false) }
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md flex flex-col">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900">Reschedule meeting</h3>
            <p className="text-[11px] text-gray-500 truncate max-w-72">{meeting.subject}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5 text-gray-500" /></button>
        </div>
        <div className="p-5 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} title="Time in IST — or use the slider below" />
          </div>
          <TimeSlider value={time} onChange={setTime} label="New time (IST)" />
          <LeadLocalTime date={date} time={time} country={lead?.country} city={lead?.city} />
          <DurationSlider value={duration} onChange={setDuration} />
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className={inputCls} placeholder="Message to attendees (optional — included in the update email)" />
          <p className="text-[11px] text-gray-400">Everyone on the invite gets the updated meeting by email, so the change also shows up in the lead's conversation thread.</p>
        </div>
        <div className="px-5 py-3.5 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            <CalendarClock className="w-4 h-4" /> {saving ? 'Updating…' : 'Update & notify attendees'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Documents ---------------- */

interface Doc { name: string; size: number; lastModified: string }

export function DocumentsView({ canManage, notify }: { canManage: boolean; notify: (m: string, e?: boolean) => void }) {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [folder, setFolder] = useState<'manuals' | 'posters' | 'general'>('manuals')
  const [preview, setPreview] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api<{ documents: Doc[] }>('/api/admin/leads/documents').then((r) => setDocs(r.documents)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', folder)
      const res = await fetch('/api/admin/leads/documents', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      notify(`Uploaded ${data.name}`)
      load()
    } catch (err: any) { notify(err.message, true) } finally { setUploading(false); e.target.value = '' }
  }

  const remove = async (name: string) => {
    if (!confirm(`Delete ${name}?`)) return
    try {
      await api(`/api/admin/leads/documents?name=${encodeURIComponent(name)}`, { method: 'DELETE' })
      notify('Deleted')
      load()
    } catch (e: any) { notify(e.message, true) }
  }

  return (
    <div className="p-3 sm:p-5 max-w-3xl space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        Upload the <strong>2-page manuals</strong> (technical & non-technical) under <em>manuals</em>, and <strong>webinar posters</strong> under <em>posters</em>. These become attachable in the email composer and follow-up invites.
      </div>
      <div className="flex items-center gap-2">
        <select value={folder} onChange={(e) => setFolder(e.target.value as any)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm">
          <option value="manuals">manuals/ (2-page decks)</option>
          <option value="posters">posters/ (webinar posters)</option>
          <option value="general">general/</option>
        </select>
        <label className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg cursor-pointer hover:bg-blue-700 flex items-center gap-2">
          <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload file'}
          <input type="file" onChange={upload} className="hidden" disabled={uploading} />
        </label>
      </div>
      {loading && <Spinner label="Loading documents..." />}
      {!loading && docs.length === 0 && <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">No documents yet.</div>}
      <div className="space-y-2">
        {docs.map((d) => (
          <div key={d.name} className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <FileText className="w-4 h-4 text-gray-400 shrink-0" />
              <div className="min-w-0">
                <div className="text-sm text-gray-900 truncate">{d.name}</div>
                <div className="text-xs text-gray-400">{(d.size / 1024).toFixed(0)} KB · {formatDateTime(d.lastModified)}</div>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => setPreview(d.name)} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">Preview</button>
              <a href={`/api/admin/leads/documents/file?name=${encodeURIComponent(d.name)}&download=1`} className="px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 hover:bg-gray-50">Download</a>
              {canManage && (
                <button onClick={() => remove(d.name)} className="p-2 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
          </div>
        ))}
      </div>
      {preview && <DocPreview name={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
