'use client'

import { useEffect, useState } from 'react'
import { Users, Activity, Mail, Brain, Calendar, Upload, FileText, Trash2, RefreshCw, Video } from 'lucide-react'
import { Lead, PIPELINE_STAGES } from '@/lib/crm/types'
import { StatusBadge, timeAgo, formatDateTime, api, STAGE_LABELS, Spinner } from './shared'

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
    <div className="p-6 space-y-6">
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
    <div className="p-6 overflow-x-auto">
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
                    <div className="mt-1.5 flex items-center gap-2"><StatusBadge status={l.status} /></div>
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

export function InboxView({ onOpenLead }: { onOpenLead: (id: string) => void }) {
  const [messages, setMessages] = useState<InboxMessage[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api<{ configured: boolean; messages: InboxMessage[]; note?: string; error?: string }>('/api/admin/leads/inbox')
      setMessages(res.messages || [])
      setNote(res.error || res.note || (!res.configured ? 'Inbound email is not configured.' : ''))
    } catch (e: any) { setNote(e.message) } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-6 space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800">Replies from leads (admin@gennoor.com inbox)</h3>
        <button onClick={load} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
      </div>
      {note && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{note}</p>}
      {loading && <Spinner label="Checking inbox..." />}
      {!loading && messages.length === 0 && !note && (
        <div className="bg-gray-50 rounded-lg p-10 text-center text-sm text-gray-400">No replies from known leads yet.</div>
      )}
      <div className="space-y-2">
        {messages.map((m) => (
          <button key={m.id} onClick={() => onOpenLead(m.leadId)} className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all">
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm font-medium text-gray-900 truncate">{m.subject || '(no subject)'}</div>
              <div className="text-xs text-gray-400 shrink-0">{formatDateTime(m.receivedAt)}</div>
            </div>
            <div className="text-xs text-emerald-700 mt-0.5">{m.leadName} · {m.leadCompany || m.from}</div>
            <p className="text-sm text-gray-600 mt-1.5 line-clamp-2">{m.preview}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ---------------- Scheduler (meetings + follow-ups) ---------------- */

interface Meeting { id: string; subject: string; start: string; end: string; attendees: string[]; joinUrl?: string; webLink?: string }
interface FollowUpRow { id: string; type: string; title: string; date: string; time: string; leadId: string; leadName: string; leadCompany: string; sentAt?: string }

export function SchedulerView({ onOpenLead }: { onOpenLead: (id: string) => void }) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [followUps, setFollowUps] = useState<FollowUpRow[]>([])
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(true)

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
    <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
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
          </div>
        ))}
      </div>

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

/* ---------------- Documents ---------------- */

interface Doc { name: string; size: number; lastModified: string }

export function DocumentsView({ isAdmin, notify }: { isAdmin: boolean; notify: (m: string, e?: boolean) => void }) {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [folder, setFolder] = useState<'manuals' | 'posters' | 'general'>('manuals')

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
    <div className="p-6 max-w-3xl space-y-4">
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
            {isAdmin && (
              <button onClick={() => remove(d.name)} className="p-2 hover:bg-red-50 rounded text-red-500"><Trash2 className="w-4 h-4" /></button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
