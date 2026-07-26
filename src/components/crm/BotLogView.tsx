'use client'

import { useEffect, useMemo, useState } from 'react'
import { MessageCircle, FileText, RefreshCw, Send, Mail, ShieldAlert, Sparkles, Globe, Search } from 'lucide-react'
import { formatDateTime, Spinner, CopyMsg, api, MultiSelect, Pagination } from './shared'

interface LogEntry { at: string; sessionId: string; q: string; a: string; links: string[]; cached?: boolean; leadCaptured?: boolean }

// Manager view of the public GennoorCare bot: raw conversations, the weekly
// AI business report (MD), interactive Q&A over it, and one-click forward
// to the team by email.
const LOGS_PER_PAGE = 10
const RANGES = [
  { days: 7, label: 'Week' },
  { days: 14, label: '2 weeks' },
  { days: 30, label: 'Month' },
] as const

export default function BotLogView({ isManager, notify }: { isManager: boolean; notify: (m: string, e?: boolean) => void }) {
  const [tab, setTab] = useState<'report' | 'conversations' | 'index'>('report')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [stats, setStats] = useState({ total: 0, leads: 0 })
  const [days, setDays] = useState<number>(7)
  const [report, setReport] = useState('')
  const [reportDays, setReportDays] = useState(0)
  const [busy, setBusy] = useState('')
  const [chat, setChat] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [question, setQuestion] = useState('')
  const [recipients, setRecipients] = useState('')
  const [indexInfo, setIndexInfo] = useState<any>(null)
  // Conversations tab: filters + numbered pages so long weeks stay compact
  const [logSearch, setLogSearch] = useState('')
  const [logType, setLogType] = useState<string[]>([])
  const [logPage, setLogPage] = useState(1)
  const [expandedLog, setExpandedLog] = useState<number | null>(null)

  useEffect(() => {
    if (!isManager) return
    api<{ logs: LogEntry[]; total: number; leads: number }>(`/api/admin/bot-insights?days=${days}`)
      .then((r) => { setLogs(r.logs); setStats({ total: r.total, leads: r.leads }); setLogPage(1); setExpandedLog(null) })
      .catch((e) => notify(e.message, true))
  }, [isManager, days]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isManager) return
    api('/api/admin/site-index').then(setIndexInfo).catch(() => {})
  }, [isManager]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredLogs = useMemo(() => {
    const term = logSearch.toLowerCase()
    return logs.filter((l) => {
      const kind = l.leadCaptured ? 'lead' : l.q === '[feedback]' ? 'feedback' : 'chat'
      if (logType.length && !logType.includes(kind)) return false
      return !term || l.q.toLowerCase().includes(term) || l.a.toLowerCase().includes(term)
    })
  }, [logs, logSearch, logType])

  const safeLogPage = Math.min(logPage, Math.max(1, Math.ceil(filteredLogs.length / LOGS_PER_PAGE)))
  const pageLogs = filteredLogs.slice((safeLogPage - 1) * LOGS_PER_PAGE, safeLogPage * LOGS_PER_PAGE)

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
      const r = await api<{ report: string }>('/api/admin/bot-insights', { method: 'POST', body: JSON.stringify({ action: 'report', days }) })
      setReport(r.report)
      setReportDays(days)
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
    try {
      await api('/api/admin/site-index', { method: 'POST', body: '{}' })
      notify('Indexing started — it runs in the background for a few minutes')
      // Poll status until the job settles
      const poll = setInterval(async () => {
        try {
          const info = await api<any>('/api/admin/site-index')
          setIndexInfo(info)
          if (info.job?.state === 'done') {
            clearInterval(poll)
            setBusy('')
            notify(`Indexed ${info.job.result.pages} pages (${info.job.result.changedPages} changed, ${info.job.result.embedded} chunks embedded)`)
          } else if (info.job?.state === 'error') {
            clearInterval(poll)
            setBusy('')
            notify(`Indexing failed: ${info.job.error}`, true)
          }
        } catch { /* keep polling */ }
      }, 8000)
    } catch (e: any) {
      notify(e.message, true)
      setBusy('')
    }
  }

  // Minimal MD render: #/##/- lines styled, **bold** kept bold
  const renderBold = (s: string) => s.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
    /^\*\*[^*]+\*\*$/.test(part) ? <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong> : part
  )
  const renderMd = (md: string) => md.split('\n').map((line, i) => {
    if (line.startsWith('# ')) return <h2 key={i} className="text-base font-bold text-gray-900 mt-1 mb-2">{line.slice(2)}</h2>
    if (line.startsWith('## ')) return <h3 key={i} className="text-sm font-semibold text-gray-800 mt-4 mb-1.5">{line.slice(3)}</h3>
    if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="text-sm text-gray-700 ml-4 list-disc">{renderBold(line.slice(2))}</li>
    if (!line.trim()) return <div key={i} className="h-1.5" />
    return <p key={i} className="text-sm text-gray-700">{renderBold(line)}</p>
  })

  return (
    <div className="p-3 sm:p-5 max-w-4xl space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2"><MessageCircle className="w-4 h-4 text-blue-500" /> GennoorCare — website bot</h2>
        <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-2.5 py-1">{stats.total} conversations ({days}d)</span>
        <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-2.5 py-1">{stats.leads} leads captured</span>
        {/* Range applies to both the data below and the generated report */}
        <div className="ml-auto flex items-center gap-1">
          {RANGES.map((r) => (
            <button
              key={r.days}
              onClick={() => setDays(r.days)}
              className={`px-2.5 py-1 text-xs rounded-full border ${days === r.days ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-gray-200">
        {([['report', 'Report', FileText], ['conversations', 'Conversations', MessageCircle], ['index', 'Knowledge index', Globe]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-3 py-2 text-sm font-medium border-b-2 flex items-center gap-1.5 ${tab === id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === 'report' && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={generate} disabled={busy === 'report'} className="px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50">
              <Sparkles className="w-4 h-4" /> {busy === 'report' ? `Analyzing the last ${days} days...` : report ? `Regenerate (last ${days} days)` : `Generate business report — last ${days} days`}
            </button>
            {report && reportDays > 0 && <span className="text-[11px] text-gray-400">covers the last {reportDays} days{reportDays !== days ? ` — switch above and regenerate for ${days}d` : ''}</span>}
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
          {/* Filters: search + type multi-select keep long ranges scannable */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={logSearch}
                onChange={(e) => { setLogSearch(e.target.value); setLogPage(1) }}
                placeholder="Search questions & answers..."
                className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs w-56"
              />
            </div>
            <MultiSelect
              label="Type"
              options={[{ value: 'lead', label: '🟢 Lead captured' }, { value: 'feedback', label: 'Feedback' }, { value: 'chat', label: 'Regular chat' }]}
              values={logType}
              onChange={(v) => { setLogType(v); setLogPage(1) }}
            />
            <span className="text-[11px] text-gray-400 ml-auto">{filteredLogs.length} of {logs.length} conversations</span>
          </div>

          {filteredLogs.length === 0 && <div className="bg-gray-50 rounded-lg p-8 text-center text-sm text-gray-400">{logs.length === 0 ? 'No conversations yet — they appear as visitors talk to GennoorCare on the website.' : 'Nothing matches the current filters.'}</div>}

          {/* Compact rows: one line collapsed, click to expand the full Q&A */}
          {pageLogs.map((l, i) => {
            const idx = (safeLogPage - 1) * LOGS_PER_PAGE + i
            const open = expandedLog === idx
            return (
              <div key={idx} className={`rounded-lg border ${l.leadCaptured ? 'border-emerald-300 bg-emerald-50' : l.q === '[feedback]' ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-white'}`}>
                <button onClick={() => setExpandedLog(open ? null : idx)} className="w-full text-left px-3 py-2 flex items-center gap-2">
                  <span className="text-[11px] text-gray-400 shrink-0">{formatDateTime(l.at)}</span>
                  {l.leadCaptured && <span className="text-[10px] bg-emerald-600 text-white rounded-full px-1.5 py-0.5 shrink-0">LEAD</span>}
                  <span className={`text-sm text-gray-900 min-w-0 ${open ? 'break-words' : 'truncate'}`}>{l.q}</span>
                  <span className="text-gray-300 text-xs ml-auto shrink-0">{open ? '▴' : '▾'}</span>
                </button>
                {open && (
                  <div className="px-3 pb-2.5 space-y-1 border-t border-black/5 pt-2">
                    <div className="text-[11px] text-gray-400">session {l.sessionId.slice(0, 6)}{l.cached ? ' · cached' : ''}</div>
                    <div className="text-sm text-gray-900 break-words"><span className="font-medium">Q:</span> {l.q}</div>
                    <div className="text-sm text-gray-600 break-words"><span className="font-medium">A:</span> {l.a}</div>
                  </div>
                )}
              </div>
            )
          })}
          <Pagination page={safeLogPage} total={filteredLogs.length} perPage={LOGS_PER_PAGE} onPage={(p) => { setLogPage(p); setExpandedLog(null) }} />
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
            {indexInfo?.job?.state === 'running' && (
              <div className="text-xs text-blue-600 flex items-center gap-1.5"><RefreshCw className="w-3 h-3 animate-spin" /> {indexInfo.job.progress || 'indexing...'}</div>
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
