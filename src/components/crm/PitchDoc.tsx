'use client'

import { useState } from 'react'
import { X, FileText, Lock, Sparkles, Send, Download, RefreshCw } from 'lucide-react'
import { Lead } from '@/lib/crm/types'
import { api, formatDateTime, Spinner, InfoTip } from './shared'

// One-page client proposal: generated from research + copilot discussion,
// refined by instruction, version-controlled (v1 — date, time), locked when
// final. Deliberately not a sales flyer — it states the client's need and what
// we'd do about it. The locked version powers the AI email draft; docx/pdf
// downloads and a copy in the Documents library (pitches/) come with each one.

interface Props {
  lead: Lead
  editable: boolean
  onClose: () => void
  onReload: () => Promise<void>
  notify: (msg: string, isError?: boolean) => void
  onGoEmail: () => void
}

export default function PitchDocModal({ lead, editable, onClose, onReload, notify, onGoEmail }: Props) {
  const versions = lead.pitchVersions || []
  const lockedV = lead.pitchLockedV
  const [selectedV, setSelectedV] = useState<number>(versions.length ? versions[versions.length - 1].v : 0)
  const [instruction, setInstruction] = useState('')
  const [busy, setBusy] = useState('')

  const selected = versions.find((x) => x.v === selectedV) || versions[versions.length - 1]

  const run = async (body: Record<string, unknown>, kind: string, doneMsg: (r: any) => string) => {
    setBusy(kind)
    try {
      const r = await api<any>('/api/admin/leads/pitch-doc', { method: 'POST', body: JSON.stringify({ leadId: lead.id, ...body }) })
      await onReload()
      if (r.version) setSelectedV(r.version.v)
      notify(doneMsg(r))
      if (r.warning) notify(r.warning, true)
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const generate = () => run({ action: 'generate' }, 'generate', (r) => `Proposal v${r.version.v} ready`)
  const refine = () => {
    const text = instruction.trim()
    if (!text || busy) return
    setInstruction('')
    run({ action: 'refine', v: selected?.v, instruction: text }, 'refine', (r) => `Refined into v${r.version.v}`)
  }
  const lock = () => selected && run({ action: 'lock', v: selected.v }, 'lock', () => `v${selected.v} locked — it now powers the email draft`)

  // Minimal MD render, same dialect the doc is generated in
  const renderBold = (s: string) => s.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
    /^\*\*[^*]+\*\*$/.test(part) ? <strong key={j} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong> : part
  )
  const renderMd = (md: string) => md.split('\n').map((line, i) => {
    if (line.startsWith('# ')) return <h2 key={i} className="text-lg font-bold text-primary-700 mb-1">{line.slice(2)}</h2>
    if (/^\*[^*].*\*$/.test(line.trim())) return <p key={i} className="text-xs italic text-gray-400 border-b border-gray-100 pb-2 mb-2">{line.trim().slice(1, -1)}</p>
    if (line.startsWith('## ')) return <h3 key={i} className="text-[13px] font-semibold text-primary-700 mt-4 mb-1">{line.slice(3)}</h3>
    if (line.startsWith('- ') || line.startsWith('* ')) return <li key={i} className="text-sm text-gray-700 ml-4 list-disc">{renderBold(line.slice(2))}</li>
    if (!line.trim()) return <div key={i} className="h-1.5" />
    return <p key={i} className="text-sm text-gray-700">{renderBold(line)}</p>
  })

  const dl = (format: 'docx' | 'pdf') =>
    `/api/admin/leads/pitch-doc?leadId=${encodeURIComponent(lead.id)}&v=${selected?.v || ''}&format=${format}`

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-2 flex-wrap shrink-0">
          <FileText className="w-4 h-4 text-primary-600" />
          <h3 className="text-base font-semibold text-gray-900">One-page proposal — {lead.company || lead.name}</h3>
          <InfoTip text="The client-facing proposal on one page — their need and what we'd do about it, not a sales flyer. Generate it from the research, refine it by telling the copilot what to change (each change = a new version), and Lock the version you'll send. The locked version drives the AI email draft; every version is also saved as docx + PDF in Sales Library, filed under this lead." />
          {versions.length > 0 && (
            <select
              value={selected?.v}
              onChange={(e) => setSelectedV(Number(e.target.value))}
              className="ml-auto text-xs border border-gray-300 rounded-lg px-2 py-1.5 bg-white text-gray-800"
            >
              {[...versions].reverse().map((x) => (
                <option key={x.v} value={x.v}>
                  v{x.v} — {formatDateTime(x.at)}{x.v === lockedV ? ' · LOCKED' : ''}
                </option>
              ))}
            </select>
          )}
          <button onClick={onClose} className="p-1.5 rounded hover:bg-gray-100 text-gray-400 shrink-0"><X className="w-4 h-4" /></button>
        </div>

        {/* Document */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-4 sm:p-6">
          {versions.length === 0 ? (
            <div className="max-w-md mx-auto text-center mt-16 space-y-4">
              <FileText className="w-10 h-10 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-500">
                No proposal yet. Generate a one-page, client-ready proposal from the research{lead.researchChat.length ? ' and your copilot discussion' : ''}.
              </p>
              {editable ? (
                <button onClick={generate} disabled={!!busy} className="px-4 py-2.5 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 inline-flex items-center gap-2 disabled:opacity-50">
                  <Sparkles className="w-4 h-4" /> {busy === 'generate' ? 'Writing the one-pager...' : 'Generate one-page proposal'}
                </button>
              ) : (
                <p className="text-xs text-amber-700">Read-only — the owner (or a manager) generates the pitch.</p>
              )}
              {!lead.aiResearch && <p className="text-[11px] text-gray-400">Tip: run AI research first — the pitch gets much sharper.</p>}
            </div>
          ) : selected && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto p-6 sm:p-8">
              {renderMd(selected.content)}
              <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] text-gray-400">
                  v{selected.v} · {selected.by.split('@')[0]} · {formatDateTime(selected.at)}
                  {selected.instruction ? ` · “${selected.instruction.slice(0, 60)}”` : ''}
                </span>
                {selected.v === lockedV && (
                  <span className="inline-flex items-center gap-1 text-[11px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5">
                    <Lock className="w-3 h-3" /> Locked final
                  </span>
                )}
              </div>
            </div>
          )}
          {busy === 'refine' && <div className="max-w-2xl mx-auto mt-3"><Spinner label="Copilot is revising the document..." /></div>}
          {busy === 'generate' && versions.length > 0 && <div className="max-w-2xl mx-auto mt-3"><Spinner label="Writing a fresh version..." /></div>}
        </div>

        {/* Actions */}
        {versions.length > 0 && (
          <div className="border-t border-gray-200 shrink-0">
            {editable && (
              <div className="px-4 pt-3 flex gap-2">
                <input
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && refine()}
                  placeholder='Tell the copilot what to change — "shorter", "lead with the POC", "mention their Elm acquisition"...'
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <button onClick={refine} disabled={!!busy || !instruction.trim()} className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 text-sm inline-flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Refine → v{versions[versions.length - 1].v + 1}
                </button>
              </div>
            )}
            <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
              {editable && (
                <button onClick={generate} disabled={!!busy} title="Write a fresh version from the research (keeps history)" className="px-2.5 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50 inline-flex items-center gap-1.5 disabled:opacity-50">
                  <RefreshCw className="w-3.5 h-3.5" /> New from research
                </button>
              )}
              <a href={dl('docx')} className="px-2.5 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50 inline-flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> .docx
              </a>
              <a href={dl('pdf')} className="px-2.5 py-1.5 border border-gray-200 text-gray-600 text-xs rounded-lg hover:bg-gray-50 inline-flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> .pdf
              </a>
              <span className="text-[10px] text-gray-400 hidden sm:inline">also in Sales Library, filed under this lead</span>
              <div className="ml-auto flex items-center gap-2">
                {editable && selected && selected.v !== lockedV && (
                  <button onClick={lock} disabled={!!busy} className="px-3 py-1.5 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 inline-flex items-center gap-1.5 disabled:opacity-50">
                    <Lock className="w-3.5 h-3.5" /> {busy === 'lock' ? 'Locking...' : `Lock v${selected.v} as final`}
                  </button>
                )}
                <button
                  onClick={() => { onClose(); onGoEmail() }}
                  disabled={!lockedV}
                  title={lockedV ? 'The AI email draft is built from the locked proposal' : 'Lock a version first — the email draft is built from it'}
                  className="px-3 py-1.5 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  Use in email <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            {lockedV && selected && selected.v !== lockedV && (
              <p className="px-4 pb-2 text-[11px] text-amber-600">v{lockedV} is the locked final — you're viewing v{selected.v}. Lock this one to make it the proposal.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
