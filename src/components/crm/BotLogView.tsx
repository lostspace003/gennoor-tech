'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, FileText, RefreshCw, Send, Mail, ShieldAlert, Sparkles, Globe } from 'lucide-react'
import { formatDateTime, Spinner, CopyMsg, api } from './shared'

interface LogEntry { at: string; sessionId: string; q: string; a: string; links: string[]; cached?: boolean; leadCaptured?: boolean }

// Manager view of the public GennoorCare bot: raw conversations, the weekly
// AI business report (MD), interactive Q&A over it, and one-click forward
// to the team by email.
export default function BotLogView({ isManager, notify }: { isManager: boolean; notify: (m: string, e?: boolean) => void }) {
  const [tab, setTab] = useState<'report' | 'conversations' | 'index'>('report')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stats, setStats] = useState({ total: 0, leads: 0 })
  const [report, setReport] = useState('')
  const [busy, setBusy] = useState('')
  const [chat, setChat] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [question, setQuestion] = useState('')
  const [recipients, setRecipients] = useState('')
  const [indexInfo, setIndexInfo] = useState<any>(null)

  useEffect(() => {
    if (!isManager) return
    api<{ logs: LogEntry[]; total: number; leads: number }>('/api/admin/bot-insights?days=7')
      .then((r) => { setLogs(r.logs); setStats({ total: r.total, leads: r.leads }) })
      .catch((e) => notify(e.message, true))
    api('/api/admin/site-index').then(setIndexInfo).catch(() => {})
  }, [isManager]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isManager) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto mb-3" />
        <p className="text-sm text-gray-600">GennoorCare logs are available to managers only.</p>
      </div>
    )
  }

  const generate = async () => {
    setBusy('report')
    try {
      const r = await api<{ report: string }>('/api/admin/bot-insights', { method: 'POST', body: JSON.stringify({ action: 'report' }) })
      setReport(r.report)
      setChat([])
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const askReport = async () => {
    const q = question.trim()
    if (!q || busy) return
    setQuestion('')
    setChat((c) => [...c, { role: 'user', content: q }])
    setBusy('chat')
    try {
      const r = await api<{ reply: string }>('/api/admin/bot-insights', { method: 'POST', body: JSON.stringify({ action: 'chat', report, question: q }) })
      setChat((c) => [...c, { role: 'assistant', content: r.reply }])
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const emailReport = async () => {
    const to = recipients.split(',').map((s) => s.trim()).filter(Boolean)
    if (to.length === 0) { notify('Add at least one recipient email', true); return }
    setBusy('email')
    try {
      const r = await api<{ success: boolean; error?: string }>('/api/admin/bot-insights', { method: 'POST', body: JSON.stringify({ action: 'email', report, recipients: to }) })
      if (r.success) notify(`Report emailed to ${to.join(', ')}`)
      else notify(r.error || 'Email failed', true)
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const reindex = async () => {
    setBusy('index')
    notify('Reindexing the website — this takes a few minutes...')
    try {
      const r = await api<any>('/api/admin/site-index', { method: 'POST', body: '{}' })
      setIndexInfo({ indexed: true, pages: r.pages, chunks: r.chunks, updatedAt: new Date().toISOString() })
      notify(`Indexed ${r.pages} pages (${r.changedPages} changed, ${r.embedded} chunks embedded)`)
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  // Minimal MD render: #/##/- lines styled, rest as text
  const renderMd = (md: string) => md.split('\n').map((line, i) => {
    if (line.startsWith('# ')) return <h2 key={i} className="text-base font-bold text-gray-900 mt-1 mb-2">{line.slice(2)}</h2>
    if (line.startsWith('## ')) return <h3 key={i} className="text-sm font-semibold text-gray-800 mt-4 mb-1.5">{line.slice(3)}</h3>
    if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="text-sm text-gray-700 ml-4 list-disc">{line.slice(2).replace(/\*\*/g, '')}</li>
    if (!line.trim()) return <div key={i} className="h-1.5" />
    return <p key={i} className="text-sm text-gray-700">{line.replace(/\*\*/g, '')}</p>
  })

  return (
    <div className="p-3 sm:p-5 max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-blue-500" /> GennoorCare — website bot</h2>
        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1">{stats.total} conversations (7d)</span>
        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1">{stats.leads} leads captured</span>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-200">
        {([['report', 'Weekly report', FileText], ['conversations', 'Conversations', MessageCircle], ['index', 'Knowledge index', Globe]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-3 py-2 text-sm font-medium border-b-2 flex items-center gap-1.5 ${tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'report' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={generate} disabled={busy === 'report'} className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50">
              <Sparkles className="w-4 h-4" /> {busy === 'report' ? 'Analyzing the week...' : report ? 'Regenerate report' : 'Generate weekly business report'}
            </button>
            {report && <CopyMsg text={report} />}
          </div>

          {report && (
            <>
              <div className="bg-white border border-gray-200 rounded-xl p-5">{renderMd(report)}</div>

              {/* Forward to team */}
              <div className="flex flex-wrap items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2.5">
                <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                <input value={recipients} onChange={(e) => setRecipients(e.target.value)} placeholder="team emails, comma-separated" className="flex-1 min-w-48 px-3 py-1.5 border border-gray-200 rounded-lg text-xs" />
                <button onClick={emailReport} disabled={busy === 'email'} className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {busy === 'email' ? 'Sending...' : 'Forward to team'}
                </button>
              </div>

              {/* Interact with the report */}
              <div className="border border-gray-200 rounded-xl">
                <div className="px-3.5 py-2.5 border-b border-gray-100 text-xs font-medium text-gray-500">Ask questions about this report</div>
                <div className="p-3.5 space-y-2 max-h-64 overflow-y-auto">
                  {chat.length === 0 && <p className="text-xs text-gray-400">e.g. “which sector asked most about POCs?” · “draft a plan to close the top gap”</p>}
                  {chat.map((m, i) => (
                    <div key={i} className={`max-w-[88%] rounded-lg px-3 py-2 text-sm whitespace-pre-line break-words ${m.role === 'user' ? 'ml-auto bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                      {m.content}
                      <CopyMsg text={m.content} light={m.role === 'user'} />
                    </div>
                  ))}
                  {busy === 'chat' && <Spinner label="Thinking..." />}
                </div>
                <div className="p-2.5 border-t border-gray-100 flex gap-2">
                  <input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && askReport()} placeholder="Ask the analyst..." className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
                  <button onClick={askReport} disabled={!!busy || !question.trim()} className="px-3 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"><Send className="w-4 h-4" /></button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {tab === 'conversations' && (
        <div className="space-y-2">
          {logs.length === 0 && <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">No conversations yet — they appear as visitors talk to GennoorCare on the website.</div>}
          {logs.map((l, i) => (
            <div key={i} className={`rounded-lg border p-3 ${l.leadCaptured ? 'border-emerald-300 bg-emerald-50' : l.q === '[feedback]' ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white'}`}>
              <div className="text-xs text-gray-400 mb-1">{formatDateTime(l.at)} · session {l.sessionId.slice(0, 6)}{l.cached ? ' · cached' : ''}{l.leadCaptured ? ' · 🟢 LEAD' : ''}</div>
              <div className="text-sm text-gray-900 break-words"><span className="font-medium">Q:</span> {l.q}</div>
              <div className="text-sm text-gray-600 break-words mt-1"><span className="font-medium">A:</span> {l.a.slice(0, 400)}{l.a.length > 400 ? '…' : ''}</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'index' && (
        <div className="space-y-3 max-w-lg">
          <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-700 space-y-1">
            {indexInfo?.indexed ? (
              <>
                <div><strong>{indexInfo.pages}</strong> pages · <strong>{indexInfo.chunks}</strong> knowledge chunks</div>
                <div className="text-xs text-gray-400">last indexed {formatDateTime(indexInfo.updatedAt)}</div>
              </>
            ) : (
              <div className="text-amber-700">The website hasn't been indexed yet — GennoorCare can't answer until the first index run.</div>
            )}
          </div>
          <button onClick={reindex} disabled={busy === 'index'} className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50">
            <RefreshCw className={`w-4 h-4 ${busy === 'index' ? 'animate-spin' : ''}`} /> {busy === 'index' ? 'Indexing (takes a few minutes)...' : 'Reindex website now'}
          </button>
          <p className="text-xs text-gray-400">Automatic reindex runs on the 1st of every month; only changed pages are re-embedded. Use this button after publishing important new content.</p>
        </div>
      )}
    </div>
  )
}
