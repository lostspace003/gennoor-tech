'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Mail, Users, Upload, FileText, Trash2, RefreshCw, Video, Search, X, CalendarClock, Eye } from 'lucide-react'
import { Lead } from '@/lib/crm/types'
import { timeAgo, formatDateTime, api, Spinner, InfoTip, MultiSelect, Pagination, DurationSlider, TimeSlider, LeadLocalTime, DateRangeFilter, DateRange, rangeBounds, rangeLabel } from './shared'
import { istInstant, isoToIstParts } from '@/lib/crm/timezones'
import DocPreview from './DocPreview'
import { useCrm } from './CrmContext'

/* ---------------- Inbox (whole CRM) ---------------- */

interface InboxMessage {
  id: string; from: string; fromName: string; subject: string; preview: string
  receivedAt: string; leadId: string; leadName: string; leadCompany: string
  mailboxes?: string[]
}

// "sales, jalalkhan" — compact usernames for the mailbox(es) a reply landed in
const mailboxNames = (m: InboxMessage) => (m.mailboxes || []).map((x) => x.split('@')[0]).join(', ')

const INBOX_PER_PAGE = 10

export function InboxView({ onOpenLead }: { onOpenLead: (id: string) => void }) {
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [fromFilter, setFromFilter] = useState<string[]>([])
  // Default "all time" so nothing silently disappears; presets narrow it down
  const [range, setRange] = useState<DateRange>({ days: 0, from: '', to: '' })
  const [grouped, setGrouped] = useState(false)
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

  // Which team mailbox(es) replies landed in — filter by team member
  const [mailboxFilter, setMailboxFilter] = useState<string[]>([])
  const mailboxOptions = useMemo(() => {
    const set = new Set<string>()
    for (const m of messages) for (const mb of m.mailboxes || []) set.add(mb.toLowerCase())
    return [...set].sort().map((mb) => ({ value: mb, label: mb.split('@')[0] }))
  }, [messages])

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    const { fromMs, toMs } = rangeBounds(range)
    return messages.filter((m) => {
      const t = new Date(m.receivedAt).getTime()
      return (fromFilter.length === 0 || fromFilter.includes(m.from.toLowerCase())) &&
        (mailboxFilter.length === 0 || (m.mailboxes || []).some((mb) => mailboxFilter.includes(mb.toLowerCase()))) &&
        t >= fromMs && t <= toMs &&
        (!term || m.subject.toLowerCase().includes(term) || m.preview.toLowerCase().includes(term) ||
          m.from.toLowerCase().includes(term) || m.leadName.toLowerCase().includes(term) || (m.leadCompany || '').toLowerCase().includes(term))
    })
  }, [messages, search, fromFilter, mailboxFilter, range])

  // Grouped view: one section per lead, newest thread first
  const groups = useMemo(() => {
    const map = new Map<string, { leadId: string; leadName: string; leadCompany: string; msgs: InboxMessage[] }>()
    for (const m of filtered) {
      const g = map.get(m.leadId) || { leadId: m.leadId, leadName: m.leadName, leadCompany: m.leadCompany, msgs: [] }
      g.msgs.push(m)
      map.set(m.leadId, g)
    }
    return [...map.values()].sort((a, b) => b.msgs[0].receivedAt.localeCompare(a.msgs[0].receivedAt))
  }, [filtered])

  const safePage = Math.min(page, Math.max(1, Math.ceil(filtered.length / INBOX_PER_PAGE)))
  const pageMsgs = filtered.slice((safePage - 1) * INBOX_PER_PAGE, safePage * INBOX_PER_PAGE)

  return (
    <div className="p-3 sm:p-5 space-y-3 max-w-6xl">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">Replies from leads (all team inboxes) <InfoTip text="Emails from any known lead address, swept across every team mailbox (sales@, admin@ and each member — outreach goes out as sales@ with the sender CC'd, so replies can land anywhere). Filter by date, sender, or which mailbox received it; group by lead for threads. Click one to open that lead's conversation and reply with AI." /></h3>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
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
          <MultiSelect label="Received in" options={mailboxOptions} values={mailboxFilter} onChange={(v) => { setMailboxFilter(v); setPage(1) }} />
          <button
            onClick={() => setGrouped((g) => !g)}
            title="Group messages by lead"
            className={`px-2.5 py-2 text-xs border rounded-lg flex items-center gap-1 ${grouped ? 'bg-primary-50 border-primary-300 text-primary-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            <Users className="w-3.5 h-3.5" /> By lead
          </button>
          <button onClick={load} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <DateRangeFilter
          value={range}
          onChange={(r) => { setRange(r); setPage(1) }}
          presets={[{ days: 1, label: 'Today' }, { days: 7, label: 'Week' }, { days: 30, label: 'Month' }]}
        />
        <span className="text-[11px] text-gray-400">{filtered.length} of {messages.length} replies · {rangeLabel(range)}</span>
      </div>
      {note && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{note}</p>}
      {loading && <Spinner label="Checking inbox..." />}
      {!loading && filtered.length === 0 && !note && (
        <div className="bg-gray-50 rounded-lg p-10 text-center text-sm text-gray-400">{messages.length === 0 ? 'No replies from known leads yet.' : 'No emails match the current filters.'}</div>
      )}
      {grouped ? (
        <div className="space-y-3">
          {groups.map((g) => (
            <div key={g.leadId} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => onOpenLead(g.leadId)} className="w-full text-left px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-2 hover:bg-gray-100">
                <span className="text-sm font-medium text-green-700 truncate">{g.leadName}{g.leadCompany ? ` · ${g.leadCompany}` : ''}</span>
                <span className="text-[11px] text-gray-400 shrink-0">{g.msgs.length} message{g.msgs.length === 1 ? '' : 's'} · open lead →</span>
              </button>
              <div className="divide-y divide-gray-50">
                {g.msgs.map((m) => (
                  <button key={m.id} onClick={() => onOpenLead(m.leadId)} className="w-full text-left px-3 py-2 hover:bg-gray-50">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-[13px] text-gray-900 truncate">{m.subject || '(no subject)'}</div>
                      <div className="text-[11px] text-gray-400 shrink-0 flex items-center gap-1.5">
                        {mailboxNames(m) && <span className="bg-primary-50 text-primary-600 rounded-full px-1.5 py-0.5" title="Team mailbox(es) this reply landed in">→ {mailboxNames(m)}</span>}
                        {formatDateTime(m.receivedAt)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{m.preview}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            {pageMsgs.map((m) => (
              <button key={m.id} onClick={() => onOpenLead(m.leadId)} className="w-full text-left bg-white border border-gray-200 rounded-lg px-3 py-2.5 hover:border-primary-300 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-900 truncate">{m.subject || '(no subject)'}</div>
                  <div className="text-[11px] text-gray-400 shrink-0">{formatDateTime(m.receivedAt)}</div>
                </div>
                <div className="text-[11px] mt-0.5 flex items-center gap-1.5 min-w-0">
                  <span className="text-green-700 truncate">{m.leadName} · {m.leadCompany || m.from}</span>
                  {mailboxNames(m) && <span className="bg-primary-50 text-primary-600 rounded-full px-1.5 py-0.5 shrink-0" title="Team mailbox(es) this reply landed in">→ {mailboxNames(m)}</span>}
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">{m.preview}</p>
              </button>
            ))}
          </div>
          <Pagination page={safePage} total={filtered.length} perPage={INBOX_PER_PAGE} onPage={setPage} />
        </>
      )}
    </div>
  )
}

/* ---------------- Meetings ---------------- */

interface Meeting { id: string; subject: string; start: string; end: string; attendees: string[]; joinUrl?: string; webLink?: string }

// Scheduler ranges look FORWARD (today → +N days), unlike the shared
// backward-looking rangeBounds used by logs/inbox/team.
function forwardBounds(r: DateRange): { fromMs: number; toMs: number } {
  if (r.days > 0) {
    const start = new Date(); start.setHours(0, 0, 0, 0)
    return { fromMs: start.getTime(), toMs: start.getTime() + r.days * 86_400_000 }
  }
  return rangeBounds(r)
}

function forwardLabel(r: DateRange): string {
  if (r.days === 1) return 'today'
  if (r.days > 0) return `next ${r.days} days`
  return rangeLabel(r)
}

// Day header for grouped lists: "Today", "Tomorrow", else "Wed, 30 Jul"
function dayHeading(iso: string): string {
  const d = new Date(iso)
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const diff = Math.floor((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - today.getTime()) / 86_400_000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff === -1) return 'Yesterday'
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function SchedulerView() {
  const { notify, leads } = useCrm()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Meeting | null>(null)
  const [busy, setBusy] = useState('')
  const [range, setRange] = useState<DateRange>({ days: 30, from: '', to: '' })

  const load = async () => {
    setLoading(true)
    try {
      const m = await api<{ configured: boolean; meetings: Meeting[]; error?: string }>('/api/admin/leads/schedule-meeting')
      setMeetings(m.meetings || [])
      setNote(m.error || (!m.configured ? 'Calendar is not configured — meetings unavailable.' : ''))
    } catch (e: any) { setNote(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  // Meetings inside the selected window, grouped by calendar day
  const { fromMs, toMs } = forwardBounds(range)
  const visibleMeetings = meetings
    .filter((m) => { const t = new Date(m.start).getTime(); return t >= fromMs && t <= toMs })
    .sort((a, b) => a.start.localeCompare(b.start))
  const meetingDays: Array<{ day: string; items: Meeting[] }> = []
  for (const m of visibleMeetings) {
    const day = dayHeading(m.start)
    const last = meetingDays[meetingDays.length - 1]
    if (last && last.day === day) last.items.push(m)
    else meetingDays.push({ day, items: [m] })
  }

  return (
    <div className="p-3 sm:p-5 max-w-3xl">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Video className="w-4 h-4 text-primary-500" /> Meetings ({forwardLabel(range)})</h3>
          <button onClick={load} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <DateRangeFilter
            value={range}
            onChange={setRange}
            presets={[{ days: 1, label: 'Today' }, { days: 7, label: 'Week' }, { days: 30, label: 'Month' }]}
            allowFuture
          />
          <span className="text-[11px] text-gray-400">{visibleMeetings.length} meeting{visibleMeetings.length === 1 ? '' : 's'}</span>
        </div>
        {note && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{note}</p>}
        {loading && <Spinner label="Loading calendar..." />}
        {!loading && visibleMeetings.length === 0 && !note && (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">
            {meetings.length === 0 ? "No upcoming meetings. Schedule one from a lead's page." : `No meetings ${forwardLabel(range)} — widen the range above.`}
          </div>
        )}
        {meetingDays.map((g) => (
          <div key={g.day} className="space-y-2">
            <div className="text-[11px] font-semibold text-gray-500 pt-1">{g.day} <span className="text-gray-300 normal-case">· {g.items.length}</span></div>
            {g.items.map((m) => (
              <div key={m.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-gray-900">{m.subject}</div>
                  {m.joinUrl && <a href={m.joinUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-primary-600 text-white rounded-lg px-2.5 py-1.5 hover:bg-primary-700 shrink-0">Join Teams</a>}
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

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent'
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
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2">
            <CalendarClock className="w-4 h-4" /> {saving ? 'Updating…' : 'Update & notify attendees'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Files ---------------- */

interface Doc { name: string; size: number; lastModified: string; metadata?: Record<string, string> }

// Shared files the team attaches to emails. Older generated proposals and
// one-off email attachments are not listed here.
const FILE_FOLDERS = [
  { key: 'manuals', label: 'Brochures and guides' },
  { key: 'posters', label: 'Posters' },
  { key: 'general', label: 'Other' },
] as const
type FolderKey = (typeof FILE_FOLDERS)[number]['key']

const folderOf = (name: string) => (name.includes('/') ? name.split('/')[0] : 'general')

export function DocumentsView({ canManage, notify }: { canManage: boolean; notify: (m: string, e?: boolean) => void }) {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [folder, setFolder] = useState<FolderKey>('manuals')
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api<{ documents: Doc[] }>('/api/admin/leads/documents').then((r) => setDocs(r.documents)).catch((e) => notify(e.message, true)).finally(() => setLoading(false))
  }
  useEffect(load, []) // eslint-disable-line react-hooks/exhaustive-deps

  const term = search.trim().toLowerCase()
  const shown = useMemo(
    () => docs
      .filter((d) => folderOf(d.name) === folder && (!term || d.name.toLowerCase().includes(term)))
      .sort((a, b) => b.lastModified.localeCompare(a.lastModified)),
    [docs, folder, term]
  )

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', folder)
      const res = await fetch('/api/admin/leads/documents', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      notify(`${file.name} uploaded`)
      load()
    } catch (err: any) { notify(err.message, true) } finally { setUploading(false) }
  }

  const remove = async (name: string) => {
    if (!confirm(`Delete ${name.split('/').pop()}? This cannot be undone.`)) return
    try {
      await api(`/api/admin/leads/documents?name=${encodeURIComponent(name)}`, { method: 'DELETE' })
      notify('File deleted')
      load()
    } catch (e: any) { notify(e.message, true) }
  }

  return (
    <div className="p-3 sm:p-5 space-y-3 max-w-4xl">
      <div className="flex flex-wrap items-center gap-2">
        {FILE_FOLDERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFolder(f.key)}
            className={`px-3 py-1.5 text-xs rounded-full border ${folder === f.key ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {f.label} ({docs.filter((d) => folderOf(d.name) === f.key).length})
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files" className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm w-44" />
        </div>
        <label className="px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 cursor-pointer flex items-center gap-1.5">
          <Upload className="w-4 h-4" /> {uploading ? 'Uploading…' : 'Upload'}
          <input type="file" onChange={upload} className="hidden" disabled={uploading} />
        </label>
      </div>

      <p className="text-xs text-gray-500">Files here can be attached when you write an email to a lead. The course catalogue is attached automatically to email 2 of the series.</p>

      {loading && <Spinner label="Loading files…" />}
      {!loading && shown.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">No files in this group yet. Press Upload to add one.</div>
      )}
      {shown.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
          {shown.map((d) => (
            <div key={d.name} className="px-4 py-2.5 flex items-center gap-3">
              <FileText className="w-5 h-5 text-gray-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-sm text-gray-900 truncate">{d.name.split('/').pop()}</div>
                <div className="text-[11px] text-gray-400">
                  {(d.size / 1024).toFixed(0)} KB · {formatDateTime(d.lastModified)}{d.metadata?.uploadedby ? ` · ${d.metadata.uploadedby.split('@')[0]}` : ''}
                </div>
              </div>
              <button onClick={() => setPreview(d.name)} className="p-2 hover:bg-gray-100 rounded-lg" title="Open" aria-label="Open"><Eye className="w-4 h-4 text-gray-500" /></button>
              {canManage && <button onClick={() => remove(d.name)} className="p-2 hover:bg-red-50 rounded-lg" title="Delete" aria-label="Delete"><Trash2 className="w-4 h-4 text-red-500" /></button>}
            </div>
          ))}
        </div>
      )}
      {preview && <DocPreview name={preview} onClose={() => setPreview(null)} />}
    </div>
  )
}
