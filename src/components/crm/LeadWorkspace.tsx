'use client'

import { useEffect, useState } from 'react'
import {
  X, Mail, Phone, Building2, Linkedin, Globe, Brain, Send, Sparkles,
  Calendar, Trash2, CheckCircle, MessageSquare, Lock, RefreshCw, Paperclip, Reply,
} from 'lucide-react'
import { Lead, ChatMessage, PIPELINE_STAGES } from '@/lib/crm/types'
import { StatusBadge, ProcessDot, StageBar, api, formatDateTime, Spinner, STAGE_LABELS } from './shared'
import { useCrm } from './CrmContext'

type Tab = 'overview' | 'research' | 'email' | 'schedule'

interface InboundMessage {
  id: string
  from: string
  subject: string
  preview: string
  body: string
  receivedAt: string
}

interface CrmDocument { name: string; size: number }

interface Props {
  lead: Lead
  canManage: boolean
  onClose: () => void
  onReload: () => Promise<void>
  notify: (msg: string, isError?: boolean) => void
  initialTab?: string
}

export default function LeadWorkspace({ lead, canManage, onClose, onReload, notify, initialTab }: Props) {
  const validTab = (t?: string): Tab => (['overview', 'research', 'email', 'schedule'].includes(t || '') ? (t as Tab) : 'overview')
  const [tab, setTab] = useState<Tab>(validTab(initialTab))
  const { userEmail, isManager } = useCrm()
  const [poolBusy, setPoolBusy] = useState(false)

  useEffect(() => setTab(validTab(initialTab)), [lead.id, initialTab]) // eslint-disable-line react-hooks/exhaustive-deps

  const isMine = lead.owner?.toLowerCase() === userEmail.toLowerCase()
  const workable = isManager || !lead.owner || isMine

  const poolAction = async (action: 'claim' | 'release' | 'dump' | 'restore') => {
    let reason: string | undefined
    if (action === 'dump') {
      reason = prompt('Why dump this lead? (e.g. vague, duplicate, wrong fit)') || undefined
      if (reason === undefined) return
    }
    setPoolBusy(true)
    try {
      await api('/api/admin/leads/claim', { method: 'POST', body: JSON.stringify({ leadIds: [lead.id], action, reason }) })
      await onReload()
      notify(action === 'claim' ? 'Lead picked up — it’s yours' : action === 'release' ? 'Released to pool' : action === 'dump' ? 'Lead dumped' : 'Restored to pool')
    } catch (e: any) { notify(e.message, true) } finally { setPoolBusy(false) }
  }

  return (
    <div className="bg-white h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-3 sm:px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-y-2 gap-x-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg shrink-0" title="Back to list">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 break-words">{lead.name}</h2>
                <StatusBadge status={lead.status} />
                <ProcessDot status={lead.processStatus} />
              </div>
              <p className="text-xs sm:text-sm text-gray-500 break-words">{[lead.company, lead.designation].filter(Boolean).join(' • ') || 'No company info yet'}</p>
            </div>
          </div>
          {/* Pool controls */}
          <div className="flex items-center gap-1.5">
            {lead.dumped ? (
              <>
                <span className="text-[11px] bg-gray-200 text-gray-600 rounded-full px-2 py-1" title={lead.dumped.reason}>Dumped: {lead.dumped.reason.slice(0, 30)}</span>
                <button onClick={() => poolAction('restore')} disabled={poolBusy} className="px-2.5 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 disabled:opacity-50">Restore</button>
              </>
            ) : !lead.owner ? (
              <>
                <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2 py-1">In pool</span>
                <button onClick={() => poolAction('claim')} disabled={poolBusy} className="px-2.5 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50">Pick up</button>
                <button onClick={() => poolAction('dump')} disabled={poolBusy} className="px-2.5 py-1.5 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-100 disabled:opacity-50">Dump</button>
              </>
            ) : isMine || isManager ? (
              <>
                <span className="text-[11px] bg-blue-100 text-blue-700 rounded-full px-2 py-1">{isMine ? 'My lead' : `Owner: ${lead.owner.split('@')[0]}`}</span>
                <button onClick={() => poolAction('release')} disabled={poolBusy} className="px-2.5 py-1.5 border border-blue-300 text-blue-700 text-xs rounded-lg hover:bg-blue-50 disabled:opacity-50">Release</button>
                <button onClick={() => poolAction('dump')} disabled={poolBusy} className="px-2.5 py-1.5 border border-gray-300 text-gray-600 text-xs rounded-lg hover:bg-gray-100 disabled:opacity-50">Dump</button>
              </>
            ) : (
              <span className="text-[11px] bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2 py-1">Owned by {lead.owner.split('@')[0]} — read-only for you</span>
            )}
          </div>
          <StageBar
            stage={lead.stage}
            onSelect={async (s) => {
              try {
                await api('/api/admin/leads/update-stage', { method: 'POST', body: JSON.stringify({ leadId: lead.id, stage: s }) })
                await onReload()
                notify(`Stage set to ${STAGE_LABELS[s]}`)
              } catch (e: any) { notify(e.message, true) }
            }}
          />
        </div>
        {/* Tabs — horizontally scrollable on small screens */}
        <div className="flex items-center gap-1 mt-3 -mb-3 overflow-x-auto">
          {([
            ['overview', 'Overview', CheckCircle],
            ['research', 'Research Copilot', Brain],
            ['email', 'Emails', Mail],
            ['schedule', 'Meetings & Follow-ups', Calendar],
          ] as Array<[Tab, string, any]>).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-3 py-2 text-sm font-medium border-b-2 flex items-center gap-1.5 whitespace-nowrap transition-colors ${tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'overview' && <OverviewTab lead={lead} canManage={canManage} onReload={onReload} onClose={onClose} notify={notify} />}
        {tab === 'research' && <ResearchTab lead={lead} onReload={onReload} notify={notify} onGoEmail={() => setTab('email')} />}
        {tab === 'email' && <EmailTab lead={lead} onReload={onReload} notify={notify} onSchedule={() => setTab('schedule')} />}
        {tab === 'schedule' && <ScheduleTab lead={lead} onReload={onReload} notify={notify} />}
      </div>
    </div>
  )
}

/* ---------------- Overview ---------------- */

function OverviewTab({ lead, canManage, onReload, onClose, notify }: { lead: Lead; canManage: boolean; onReload: () => Promise<void>; onClose: () => void; notify: Props['notify'] }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<Partial<Lead>>({})
  const [saving, setSaving] = useState(false)

  const startEdit = () => {
    setForm({
      name: lead.name, email: lead.email, phone: lead.phone, company: lead.company,
      designation: lead.designation, linkedin: lead.linkedin, website: lead.website,
      sector: lead.sector, region: lead.region, country: lead.country, city: lead.city,
      priority: lead.priority, leadType: lead.leadType, notes: lead.notes, status: lead.status,
    })
    setEditing(true)
  }

  const save = async () => {
    setSaving(true)
    try {
      await api('/api/admin/leads', { method: 'PUT', body: JSON.stringify({ id: lead.id, ...form }) })
      await onReload()
      setEditing(false)
      notify('Lead updated')
    } catch (e: any) { notify(e.message, true) } finally { setSaving(false) }
  }

  const remove = async () => {
    if (!confirm(`Delete lead ${lead.name}? This cannot be undone.`)) return
    try {
      await api(`/api/admin/leads?id=${encodeURIComponent(lead.id)}`, { method: 'DELETE' })
      await onReload()
      notify('Lead deleted')
      onClose()
    } catch (e: any) { notify(e.message, true) }
  }

  const field = (label: string, key: keyof Lead, type = 'text') => (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={(form[key] as string) || ''}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  )

  return (
    <div className="p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      <div className="lg:col-span-2 space-y-5 break-words min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
          <div className="flex gap-2">
            {!editing && <button onClick={startEdit} className="px-3 py-1.5 border border-gray-200 text-sm rounded-lg hover:bg-gray-50">Edit</button>}
            {canManage && !editing && (
              <button onClick={remove} className="px-3 py-1.5 border border-red-200 text-red-600 text-sm rounded-lg hover:bg-red-50 flex items-center gap-1.5">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            )}
          </div>
        </div>

        {editing ? (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {field('Name', 'name')}
              {field('Email', 'email', 'email')}
              {field('Phone', 'phone')}
              {field('Company', 'company')}
              {field('Designation', 'designation')}
              {field('LinkedIn URL', 'linkedin')}
              {field('Website', 'website')}
              {field('Sector', 'sector')}
              {field('Region', 'region')}
              {field('Country', 'country')}
              {field('City', 'city')}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Lead status</label>
                <select value={(form.status as string) || 'new'} onChange={(e) => setForm({ ...form, status: e.target.value as Lead['status'] })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  {['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Notes</label>
              <textarea value={(form.notes as string) || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setEditing(false)} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <InfoRow icon={Mail} value={lead.email} placeholder="No email — add one to enable outreach" />
            <InfoRow icon={Phone} value={lead.phone} placeholder="No phone" />
            <InfoRow icon={Building2} value={[lead.company, lead.sector].filter(Boolean).join(' · ')} placeholder="No company" />
            <InfoRow icon={Globe} value={[lead.city, lead.country, lead.region].filter(Boolean).join(', ')} placeholder="No location" />
            {lead.linkedin ? (
              <a href={lead.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-blue-600 hover:underline">
                <Linkedin className="w-4 h-4 text-gray-400" /> LinkedIn profile — connect
              </a>
            ) : <InfoRow icon={Linkedin} value="" placeholder="No LinkedIn" />}
            {lead.website ? (
              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-blue-600 hover:underline">
                <Globe className="w-4 h-4 text-gray-400" /> {lead.website}
              </a>
            ) : <InfoRow icon={Globe} value="" placeholder="No website" />}
          </div>
        )}

        {lead.notes && !editing && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
            <p className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line break-words">{lead.notes}</p>
          </div>
        )}

        {lead.finalizedPitch && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2 flex items-center gap-2"><Lock className="w-4 h-4 text-green-600" /> Finalized pitch</h3>
            <p className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-line break-words">{lead.finalizedPitch}</p>
          </div>
        )}
      </div>

      {/* Activity timeline — real data only */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">Activity</h3>
        <div className="space-y-3 max-h-[32rem] overflow-y-auto pr-2">
          {lead.activities.length === 0 && <p className="text-sm text-gray-400">No activity yet.</p>}
          {lead.activities.map((a, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-blue-400 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-gray-800">{a.description}</p>
                <p className="text-xs text-gray-400">{formatDateTime(a.at)} · {a.by.split('@')[0]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, value, placeholder }: { icon: any; value: string; placeholder: string }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <Icon className="w-4 h-4 text-gray-400 shrink-0" />
      {value ? <span className="text-gray-900 truncate">{value}</span> : <span className="text-gray-400">{placeholder}</span>}
    </div>
  )
}

/* ---------------- Research Copilot ---------------- */

function ResearchTab({ lead, onReload, notify, onGoEmail }: { lead: Lead; onReload: () => Promise<void>; notify: Props['notify']; onGoEmail: () => void }) {
  const [running, setRunning] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chat, setChat] = useState<ChatMessage[]>(lead.researchChat)
  const [chatting, setChatting] = useState(false)
  const [finalizing, setFinalizing] = useState(false)

  useEffect(() => setChat(lead.researchChat), [lead.id, lead.researchChat])

  const runResearch = async () => {
    setRunning(true)
    try {
      await api('/api/admin/leads/ai-research', { method: 'POST', body: JSON.stringify({ leadId: lead.id }) })
      await onReload()
      notify('Research completed')
    } catch (e: any) { notify(e.message, true) } finally { setRunning(false) }
  }

  const sendChat = async () => {
    const message = chatInput.trim()
    if (!message || chatting) return
    setChatInput('')
    setChat((c) => [...c, { role: 'user', content: message }])
    setChatting(true)
    try {
      const res = await api<{ reply: string; chat: ChatMessage[] }>('/api/admin/leads/research-chat', {
        method: 'POST',
        body: JSON.stringify({ leadId: lead.id, message }),
      })
      setChat(res.chat)
    } catch (e: any) {
      notify(e.message, true)
      setChat((c) => c.slice(0, -1))
    } finally { setChatting(false) }
  }

  const finalize = async () => {
    setFinalizing(true)
    try {
      await api('/api/admin/leads/research-chat', { method: 'POST', body: JSON.stringify({ leadId: lead.id, mode: 'finalize' }) })
      await onReload()
      notify('Pitch finalized — view it on the Overview tab and use it in the email draft')
    } catch (e: any) { notify(e.message, true) } finally { setFinalizing(false) }
  }

  return (
    <div className="p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Research results — scrolls within its own panel on desktop */}
      <div className="space-y-4 break-words lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto lg:pr-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500">AI Research</h3>
          <button onClick={runResearch} disabled={running} className="px-3 py-1.5 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50">
            {running ? <Spinner /> : <Brain className="w-4 h-4" />}
            {lead.aiResearch ? 'Re-run research' : 'Run research'}
          </button>
        </div>
        {!lead.aiResearch && !running && (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">
            Run research to profile this lead: what they likely need, tech vs non-tech, and which Gennoor offerings fit.
          </div>
        )}
        {lead.aiResearch && (
          <div className="bg-purple-50 rounded-lg p-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${lead.aiResearch.techOrNonTech === 'technical' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                {lead.aiResearch.techOrNonTech}
              </span>
              <span className="text-xs text-gray-500">updated {formatDateTime(lead.aiResearch.lastUpdated)}</span>
            </div>
            <Section title="Summary"><p>{lead.aiResearch.summary}</p></Section>
            <Section title="Insights">
              <ul className="space-y-1">{lead.aiResearch.insights.map((x, i) => <li key={i} className="flex gap-2"><Sparkles className="w-3.5 h-3.5 text-purple-500 mt-0.5 shrink-0" />{x}</li>)}</ul>
            </Section>
            <Section title="What to pitch">
              <ul className="space-y-1">{lead.aiResearch.opportunities.map((x, i) => <li key={i} className="flex gap-2"><CheckCircle className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" />{x}</li>)}</ul>
            </Section>
            <Section title="Recommended approach"><p>{lead.aiResearch.approach}</p></Section>
          </div>
        )}
        {lead.finalizedPitch && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 text-sm font-medium text-green-800"><Lock className="w-4 h-4" /> Finalized pitch (locked)</div>
              <button onClick={onGoEmail} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 flex items-center gap-1.5 shrink-0">
                Continue to email <Send className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-line break-words">{lead.finalizedPitch}</p>
            <p className="text-xs text-green-700 mt-2">Next step: draft the email — the AI draft is built from this brief.</p>
          </div>
        )}
      </div>

      {/* Discussion + finalize */}
      <div className="flex flex-col h-[70dvh] lg:h-[calc(100dvh-12rem)] border border-gray-200 rounded-lg">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 flex items-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" /> Discuss with copilot</span>
          <button onClick={finalize} disabled={finalizing || chat.length === 0} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 flex items-center gap-1.5 disabled:opacity-50" title={chat.length === 0 ? 'Chat first, then finalize' : 'Lock the final pitch content'}>
            <Lock className="w-3.5 h-3.5" /> {finalizing ? 'Finalizing...' : 'Finalize pitch'}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {chat.length === 0 && (
            <p className="text-sm text-gray-400 text-center mt-8">
              Discuss the research here — e.g. &quot;what angle works for a bank?&quot; or &quot;they're non-technical, what do we lead with?&quot;. Then hit <strong>Finalize pitch</strong>.
            </p>
          )}
          {chat.map((m, i) => (
            <div key={i} className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-line break-words ${m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
              {m.content}
            </div>
          ))}
          {chatting && <Spinner label="Thinking..." />}
        </div>
        <div className="p-3 border-t border-gray-100 flex gap-2">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendChat()}
            placeholder="Ask the copilot about this lead..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button onClick={sendChat} disabled={chatting || !chatInput.trim()} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-semibold text-purple-900 uppercase mb-1">{title}</div>
      <div className="text-sm text-gray-700">{children}</div>
    </div>
  )
}

/* ---------------- Email (thread + AI composer) ---------------- */

function EmailTab({ lead, onReload, notify, onSchedule }: { lead: Lead; onReload: () => Promise<void>; notify: Props['notify']; onSchedule: () => void }) {
  const [inbound, setInbound] = useState<InboundMessage[]>([])
  const [inboundNote, setInboundNote] = useState('')
  const [loadingInbox, setLoadingInbox] = useState(true)
  const [composing, setComposing] = useState(false)
  const [replyTo, setReplyTo] = useState<InboundMessage | null>(null)
  const [preset, setPreset] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  const loadInbox = async () => {
    setLoadingInbox(true)
    try {
      const res = await api<{ configured: boolean; messages: InboundMessage[]; note?: string; error?: string }>(`/api/admin/leads/inbox?leadId=${encodeURIComponent(lead.id)}`)
      setInbound(res.messages || [])
      setInboundNote(res.error || res.note || (!res.configured ? 'Inbound email not configured' : ''))
    } catch (e: any) {
      setInboundNote(e.message)
    } finally { setLoadingInbox(false) }
  }

  useEffect(() => { loadInbox() }, [lead.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Merge sent + received into one thread, newest first
  const thread = [
    ...lead.emailHistory.map((e) => ({
      kind: 'sent' as const, at: e.at, subject: e.subject,
      detail: `to ${e.to}${e.cc?.length ? ` · cc ${e.cc.join(', ')}` : ''}`,
      status: e.status, body: e.body || '',
    })),
    ...inbound.map((m) => ({
      kind: 'received' as const, at: m.receivedAt, subject: m.subject,
      detail: `from ${m.from}`, status: 'received',
      body: (m.body || m.preview).replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s{3,}/g, '\n').trim(),
      raw: m,
    })),
  ].sort((a, b) => b.at.localeCompare(a.at))

  return (
    <div className="p-3 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-gray-500">Conversation with {lead.name}</h3>
        <div className="flex gap-2">
          <button onClick={loadInbox} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50" title="Refresh replies"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
          <button onClick={onSchedule} className="px-3 py-2 border border-gray-200 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2"><Calendar className="w-4 h-4" /> Schedule meet</button>
          <button
            onClick={() => { setReplyTo(null); setPreset(''); setComposing(true) }}
            disabled={!lead.email}
            title={lead.email ? '' : 'Add an email address first (Overview → Edit)'}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
          >
            <Mail className="w-4 h-4" /> New email
          </button>
        </div>
      </div>

      {inboundNote && <p className="text-xs bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2">{inboundNote}</p>}

      {!lead.email && (
        <FindEmailPanel lead={lead} onReload={onReload} notify={notify} />
      )}

      <div className="space-y-2">
        {loadingInbox && thread.length === 0 && <Spinner label="Loading conversation..." />}
        {!loadingInbox && thread.length === 0 && lead.email && (
          <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">No emails yet. Draft the first outreach with the AI composer.</div>
        )}
        {thread.map((item, i) => (
          <div key={i} className={`rounded-lg border p-3 ${item.kind === 'received' ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-white'}`}>
            <div className="flex items-center justify-between gap-3">
              <button className="min-w-0 text-left flex-1" onClick={() => setExpanded(expanded === i ? null : i)} title={expanded === i ? 'Collapse' : 'Expand'}>
                <div className="text-sm font-medium text-gray-900 truncate">{item.subject || '(no subject)'}</div>
                <div className="text-xs text-gray-500">{item.kind === 'received' ? '↩ Received' : '↗ Sent'} {item.detail} · {formatDateTime(item.at)}{item.status === 'failed' ? ' · FAILED' : ''}</div>
              </button>
              {item.kind === 'received' && (
                <button onClick={() => { setReplyTo((item as any).raw); setPreset(''); setComposing(true) }} className="px-2.5 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700 flex items-center gap-1.5 shrink-0">
                  <Reply className="w-3.5 h-3.5" /> Reply with AI
                </button>
              )}
              {item.kind === 'sent' && item.status !== 'failed' && (
                <button
                  onClick={() => {
                    setReplyTo(null)
                    setPreset(`Write a brief follow-up to the previous email "${item.subject}" sent on ${item.at.slice(0, 10)}. Do not repeat its content — reference it lightly, add one new useful angle, and re-offer the free webinar or 1-day training.`)
                    setComposing(true)
                  }}
                  className="px-2.5 py-1.5 border border-blue-200 text-blue-600 text-xs rounded-lg hover:bg-blue-50 flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Follow up with AI
                </button>
              )}
            </div>
            {item.body && (
              <p className={`text-sm text-gray-600 mt-2 break-words whitespace-pre-line ${expanded === i ? '' : 'line-clamp-2'}`}>{item.body}</p>
            )}
            {item.body && (
              <button onClick={() => setExpanded(expanded === i ? null : i)} className="text-[11px] text-blue-600 hover:underline mt-1">
                {expanded === i ? 'Collapse' : 'Read full'}
              </button>
            )}
          </div>
        ))}
      </div>

      {composing && (
        <EmailComposer
          lead={lead}
          replyTo={replyTo}
          preset={preset}
          onClose={() => setComposing(false)}
          onSent={async () => { setComposing(false); await onReload(); await loadInbox() }}
          notify={notify}
        />
      )}
    </div>
  )
}

// AI email finder — pattern-based suggestions for leads without an address.
// Honest by design: candidates are labeled as guesses; delivery verifies.
function FindEmailPanel({ lead, onReload, notify }: { lead: Lead; onReload: () => Promise<void>; notify: Props['notify'] }) {
  const [candidates, setCandidates] = useState<Array<{ email: string; confidence: string; reason: string }>>([])
  const [note, setNote] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [busy, setBusy] = useState('')

  const find = async () => {
    setBusy('find')
    try {
      const res = await api<{ candidates: any[]; note: string }>('/api/admin/leads/find-email', {
        method: 'POST', body: JSON.stringify({ leadId: lead.id }),
      })
      setCandidates(res.candidates)
      setNote(res.note)
      setPicked(res.candidates.length ? [res.candidates[0].email] : [])
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const save = async () => {
    if (picked.length === 0) return
    setBusy('save')
    try {
      await api('/api/admin/leads/find-email', { method: 'POST', body: JSON.stringify({ leadId: lead.id, save: picked }) })
      await onReload()
      notify(`Saved ${picked.length} email(s) — first one is now the primary address`)
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-purple-900 font-medium flex items-center gap-2"><Sparkles className="w-4 h-4" /> No email address for this lead</div>
        <button onClick={find} disabled={busy === 'find'} className="px-3 py-1.5 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 disabled:opacity-50">
          {busy === 'find' ? 'Searching patterns...' : candidates.length ? 'Search again' : 'Find email with AI'}
        </button>
      </div>
      {candidates.length > 0 && (
        <>
          <div className="space-y-1.5">
            {candidates.map((c) => (
              <label key={c.email} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-lg px-3 py-2 cursor-pointer hover:border-purple-300">
                <input
                  type="checkbox"
                  checked={picked.includes(c.email)}
                  onChange={(e) => setPicked(e.target.checked ? [...picked, c.email] : picked.filter((x) => x !== c.email))}
                  className="rounded"
                />
                <span className="text-sm text-gray-900 font-mono break-all">{c.email}</span>
                <span className={`ml-auto text-[10px] rounded-full px-2 py-0.5 shrink-0 ${c.confidence === 'high' ? 'bg-green-100 text-green-700' : c.confidence === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>{c.confidence}</span>
              </label>
            ))}
          </div>
          <p className="text-[11px] text-purple-700">{note}</p>
          <button onClick={save} disabled={busy === 'save' || picked.length === 0} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50">
            {busy === 'save' ? 'Saving...' : `Save ${picked.length} selected (first = primary)`}
          </button>
        </>
      )}
      {candidates.length === 0 && (
        <p className="text-xs text-purple-700">The AI suggests likely addresses from the person's name and company domain. You pick which to keep — a LinkedIn message asking for their email is still the most reliable route.</p>
      )}
    </div>
  )
}

function EmailComposer({ lead, replyTo, preset, onClose, onSent, notify }: { lead: Lead; replyTo: InboundMessage | null; preset?: string; onClose: () => void; onSent: () => Promise<void>; notify: Props['notify'] }) {
  const [subject, setSubject] = useState(replyTo ? (replyTo.subject.startsWith('Re:') ? replyTo.subject : `Re: ${replyTo.subject}`) : '')
  const [body, setBody] = useState('')
  const [chatLog, setChatLog] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [instruction, setInstruction] = useState('')
  const [busy, setBusy] = useState('')
  const [finalized, setFinalized] = useState(false)
  const [docs, setDocs] = useState<CrmDocument[]>([])
  const [attach, setAttach] = useState<string[]>([])
  const [extraTo, setExtraTo] = useState((lead.altEmails || []).join(', '))
  const [extraCc, setExtraCc] = useState('')
  const [bcc, setBcc] = useState('')

  useEffect(() => {
    api<{ documents: CrmDocument[] }>('/api/admin/leads/documents').then((r) => setDocs(r.documents)).catch(() => {})
    // Follow-up preset: auto-draft immediately so the user lands on a ready draft
    if (preset) aiDraft(preset)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const aiDraft = async (extraInstructions?: string) => {
    setBusy('draft')
    try {
      const instructions = replyTo
        ? `Reply to this inbound email from the lead:\n${replyTo.body?.replace(/<[^>]+>/g, ' ').slice(0, 2500) || replyTo.preview}`
        : extraInstructions || preset || undefined
      const res = await api<{ subject: string; body: string; source: string }>('/api/admin/leads/generate-email', {
        method: 'POST',
        body: JSON.stringify({ leadId: lead.id, instructions }),
      })
      setSubject(res.subject)
      setBody(res.body)
      setFinalized(false)
      setChatLog((c) => [...c, { role: 'assistant', content: res.source === 'ai' ? 'Draft generated from research + finalized pitch.' : 'AI unavailable — honest template draft loaded.' }])
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const refine = async () => {
    const message = instruction.trim()
    if (!message || busy) return
    setInstruction('')
    setChatLog((c) => [...c, { role: 'user', content: message }])
    setBusy('refine')
    try {
      const res = await api<{ reply: string; subject: string; body: string }>('/api/admin/leads/email-chat', {
        method: 'POST',
        body: JSON.stringify({ leadId: lead.id, subject, body, message, replyTo: replyTo?.preview }),
      })
      setSubject(res.subject)
      setBody(res.body)
      setFinalized(false)
      setChatLog((c) => [...c, { role: 'assistant', content: res.reply }])
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const finalize = async () => {
    setBusy('finalize')
    try {
      const res = await api<{ subject: string; body: string }>('/api/admin/leads/email-chat', {
        method: 'POST',
        body: JSON.stringify({ leadId: lead.id, subject, body, mode: 'finalize', replyTo: replyTo?.preview }),
      })
      setSubject(res.subject)
      setBody(res.body)
      setFinalized(true)
      setChatLog((c) => [...c, { role: 'assistant', content: 'Final copy ready. Review below, then send.' }])
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const send = async () => {
    if (!subject.trim() || !body.trim()) { notify('Subject and body are required', true); return }
    setBusy('send')
    try {
      const res = await api<{ sent: number; message: string; errors: string[] }>('/api/admin/leads/send-email', {
        method: 'POST',
        body: JSON.stringify({
          leadIds: [lead.id],
          subject,
          body,
          attachBlobs: attach,
          extraTo: extraTo.split(',').map((s) => s.trim()).filter(Boolean),
          extraCc: extraCc.split(',').map((s) => s.trim()).filter(Boolean),
          bcc: bcc.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      })
      if (res.sent > 0) { notify(res.message); await onSent() } else { notify(res.errors?.join('; ') || 'Send failed', true) }
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl h-[88vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{replyTo ? `Reply to ${lead.name}` : `Email ${lead.name}`}</h3>
            <p className="text-xs text-gray-500">To: {lead.email} · CC: admin@gennoor.com (always)</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 overflow-y-auto lg:overflow-visible">
          {/* Draft editor */}
          <div className="lg:col-span-3 p-5 flex flex-col gap-3 min-h-0 border-r border-gray-100">
            <div className="flex gap-2">
              <button onClick={() => aiDraft()} disabled={!!busy} className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50">
                <Sparkles className="w-4 h-4" /> {busy === 'draft' ? 'Drafting...' : body ? 'Redraft with AI' : 'AI draft'}
              </button>
              <button onClick={finalize} disabled={!!busy || !body} className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50">
                <Lock className="w-4 h-4" /> {busy === 'finalize' ? 'Polishing...' : 'Final copy'}
              </button>
              {finalized && <span className="self-center text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-2.5 py-1">Final — review &amp; send</span>}
            </div>
            <input value={subject} onChange={(e) => { setSubject(e.target.value); setFinalized(false) }} placeholder="Subject" className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium" />
            <textarea value={body} onChange={(e) => { setBody(e.target.value); setFinalized(false) }} placeholder="Write the email, or click AI draft..." className="flex-1 min-h-40 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none font-mono" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input value={extraTo} onChange={(e) => setExtraTo(e.target.value)} placeholder="More To: (comma-separated)" className="px-3 py-2 border border-gray-200 rounded-lg text-xs" />
              <input value={extraCc} onChange={(e) => setExtraCc(e.target.value)} placeholder="CC: (admin@ always added)" className="px-3 py-2 border border-gray-200 rounded-lg text-xs" />
              <input value={bcc} onChange={(e) => setBcc(e.target.value)} placeholder="BCC: (optional)" className="px-3 py-2 border border-gray-200 rounded-lg text-xs" />
            </div>
            {docs.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-2.5 max-h-28 overflow-y-auto">
                <div className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-1.5"><Paperclip className="w-3.5 h-3.5" /> Attach from document library</div>
                <div className="flex flex-wrap gap-1.5">
                  {docs.map((d) => (
                    <button
                      key={d.name}
                      onClick={() => setAttach(attach.includes(d.name) ? attach.filter((n) => n !== d.name) : [...attach, d.name])}
                      className={`px-2 py-1 rounded text-xs border ${attach.includes(d.name) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                    >
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              <button onClick={send} disabled={!!busy || !subject || !body} className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
                <Send className="w-4 h-4" /> {busy === 'send' ? 'Sending...' : 'Send email'}
              </button>
            </div>
          </div>

          {/* AI refine chat */}
          <div className="lg:col-span-2 flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-gray-100 text-sm font-medium text-gray-700 flex items-center gap-2 shrink-0">
              <MessageSquare className="w-4 h-4 text-purple-500" /> Refine with copilot
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 min-h-0">
              {chatLog.length === 0 && (
                <p className="text-xs text-gray-400 text-center mt-6">Tell the copilot how to change the draft — &quot;shorter&quot;, &quot;more formal&quot;, &quot;lead with the webinar&quot;, &quot;mention their fintech focus&quot;...</p>
              )}
              {chatLog.map((m, i) => (
                <div key={i} className={`max-w-[90%] rounded-lg px-3 py-2 text-xs whitespace-pre-line ${m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}>{m.content}</div>
              ))}
              {busy === 'refine' && <Spinner label="Revising..." />}
            </div>
            <div className="p-3 border-t border-gray-100 flex gap-2 shrink-0">
              <input
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && refine()}
                placeholder="Instruction for the copilot..."
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
              <button onClick={refine} disabled={!!busy || !instruction.trim()} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"><Send className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Meetings & Follow-ups ---------------- */

function ScheduleTab({ lead, onReload, notify }: { lead: Lead; onReload: () => Promise<void>; notify: Props['notify'] }) {
  const [meetForm, setMeetForm] = useState({ subject: `Gennoor Tech <> ${lead.company || lead.name} — discovery call`, date: '', time: '', duration: 30, agenda: '', extra: '' })
  const [fuForm, setFuForm] = useState({ type: 'webinar' as 'webinar' | 'training', title: '', date: '', time: '', notes: '', posterBlob: '' })
  const [posters, setPosters] = useState<CrmDocument[]>([])
  const [busy, setBusy] = useState('')
  const [uploadingPoster, setUploadingPoster] = useState(false)

  useEffect(() => {
    api<{ documents: CrmDocument[] }>('/api/admin/leads/documents')
      .then((r) => setPosters(r.documents.filter((d) => d.name.startsWith('posters/'))))
      .catch(() => {})
  }, [])

  const scheduleMeeting = async () => {
    if (!meetForm.date || !meetForm.time) { notify('Pick a date and time', true); return }
    setBusy('meet')
    try {
      const start = new Date(`${meetForm.date}T${meetForm.time}`).toISOString()
      const res = await api<{ meeting: { joinUrl?: string } }>('/api/admin/leads/schedule-meeting', {
        method: 'POST',
        body: JSON.stringify({
          leadId: lead.id,
          subject: meetForm.subject,
          start,
          durationMinutes: meetForm.duration,
          agenda: meetForm.agenda,
          extraAttendees: meetForm.extra.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      })
      await onReload()
      notify(`Teams meeting scheduled — invite sent to ${lead.email}${res.meeting.joinUrl ? '' : ''}`)
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const uploadPoster = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingPoster(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'posters')
      const res = await fetch('/api/admin/leads/documents', { method: 'POST', body: form })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setPosters((p) => [{ name: data.name, size: file.size }, ...p.filter((x) => x.name !== data.name)])
      setFuForm((f) => ({ ...f, posterBlob: data.name }))
      notify('Poster uploaded')
    } catch (err: any) { notify(err.message, true) } finally { setUploadingPoster(false); e.target.value = '' }
  }

  const sendFollowUp = async () => {
    if (!fuForm.title || !fuForm.date || !fuForm.time) { notify('Title, date and time are required', true); return }
    setBusy('followup')
    try {
      await api('/api/admin/leads/schedule-followup', { method: 'POST', body: JSON.stringify({ leadId: lead.id, ...fuForm }) })
      await onReload()
      notify(`${fuForm.type === 'webinar' ? 'Webinar' : 'Training'} invite sent to ${lead.email}`)
      setFuForm({ type: 'webinar', title: '', date: '', time: '', notes: '', posterBlob: '' })
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'

  return (
    <div className="p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Teams meeting */}
      <div className="border border-gray-200 rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-500" /> Schedule Teams meeting</h3>
        {!lead.email && <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">This lead has no email — add one on the Overview tab first.</p>}
        <input value={meetForm.subject} onChange={(e) => setMeetForm({ ...meetForm, subject: e.target.value })} className={inputCls} placeholder="Meeting subject" />
        <div className="grid grid-cols-3 gap-2">
          <input type="date" value={meetForm.date} onChange={(e) => setMeetForm({ ...meetForm, date: e.target.value })} className={inputCls} />
          <input type="time" value={meetForm.time} onChange={(e) => setMeetForm({ ...meetForm, time: e.target.value })} className={inputCls} />
          <select value={meetForm.duration} onChange={(e) => setMeetForm({ ...meetForm, duration: Number(e.target.value) })} className={inputCls}>
            <option value={15}>15 min</option><option value={30}>30 min</option><option value={45}>45 min</option><option value={60}>1 hour</option><option value={120}>2 hours</option>
          </select>
        </div>
        <input value={meetForm.extra} onChange={(e) => setMeetForm({ ...meetForm, extra: e.target.value })} className={inputCls} placeholder="More attendees (comma-separated emails, optional)" />
        <textarea value={meetForm.agenda} onChange={(e) => setMeetForm({ ...meetForm, agenda: e.target.value })} rows={2} className={inputCls} placeholder="Agenda (optional)" />
        <button onClick={scheduleMeeting} disabled={busy === 'meet' || !lead.email} className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
          {busy === 'meet' ? 'Scheduling...' : `Schedule & invite ${lead.email || ''}`}
        </button>
        <p className="text-xs text-gray-400">Creates a Teams meeting on the admin@gennoor.com calendar; the lead (and extra attendees) get the invite. It appears in the Scheduler view.</p>
      </div>

      {/* Follow-up invites */}
      <div className="border border-gray-200 rounded-lg p-5 space-y-3">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-500" /> Send follow-up invite</h3>
        <div className="flex gap-2">
          <button onClick={() => setFuForm({ ...fuForm, type: 'webinar' })} className={`flex-1 px-3 py-2 rounded-lg text-sm border ${fuForm.type === 'webinar' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-600'}`}>1st: Free 2-hour webinar</button>
          <button onClick={() => setFuForm({ ...fuForm, type: 'training' })} className={`flex-1 px-3 py-2 rounded-lg text-sm border ${fuForm.type === 'training' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-600'}`}>2nd: Free 1-day training</button>
        </div>
        <input value={fuForm.title} onChange={(e) => setFuForm({ ...fuForm, title: e.target.value })} className={inputCls} placeholder={fuForm.type === 'webinar' ? 'Webinar topic (as per their need)' : 'Training title'} />
        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={fuForm.date} onChange={(e) => setFuForm({ ...fuForm, date: e.target.value })} className={inputCls} />
          <input type="time" value={fuForm.time} onChange={(e) => setFuForm({ ...fuForm, time: e.target.value })} className={inputCls} />
        </div>
        <textarea value={fuForm.notes} onChange={(e) => setFuForm({ ...fuForm, notes: e.target.value })} rows={2} className={inputCls} placeholder="Extra details for the invite (optional)" />
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <select value={fuForm.posterBlob} onChange={(e) => setFuForm({ ...fuForm, posterBlob: e.target.value })} className={`${inputCls} flex-1`}>
              <option value="">No poster attachment</option>
              {posters.map((p) => <option key={p.name} value={p.name}>{p.name.replace('posters/', '')}</option>)}
            </select>
            <label className="px-3 py-2 border border-gray-200 rounded-lg text-xs cursor-pointer hover:bg-gray-50 whitespace-nowrap">
              {uploadingPoster ? 'Uploading...' : 'Upload poster'}
              <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={uploadPoster} className="hidden" disabled={uploadingPoster} />
            </label>
          </div>
        </div>
        <button onClick={sendFollowUp} disabled={busy === 'followup' || !lead.email} className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50">
          {busy === 'followup' ? 'Sending...' : 'Send invite (CC admin@gennoor.com)'}
        </button>

        {lead.followUps.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 mb-2">Previous follow-ups</div>
            <div className="space-y-1.5">
              {lead.followUps.map((f) => (
                <div key={f.id} className="text-xs text-gray-600 flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  {f.type === 'webinar' ? 'Webinar' : 'Training'}: {f.title} — {f.date} {f.time}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
