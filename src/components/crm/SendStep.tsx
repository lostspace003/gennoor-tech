'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, Send, Paperclip } from 'lucide-react'
import { Lead } from '@/lib/crm/types'
import { SEQUENCE, sequenceProgress, stepById, stepNumber } from '@/lib/crm/sequence'
import { companyOf, greetingOf, tidyGreeting } from '@/lib/crm/greeting'
import { api, Spinner } from './shared'
import { useCrm } from './CrmContext'

interface Preview { subject: string; html: string; attachCatalogue: boolean }

/** One lead and the name their emails will open with. Clearing it sends the email without a name. */
function NameRow({ lead, value, onSave }: { lead: Lead; value: string; onSave: (text: string) => void }) {
  const [text, setText] = useState(value)
  useEffect(() => { setText(value) }, [value])
  const commit = () => { const tidy = tidyGreeting(text); setText(tidy); if (tidy !== value) onSave(tidy) }
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1">
        <div className="truncate text-gray-800">{lead.name || lead.email}</div>
        <div className="truncate text-[11px] text-gray-400">{companyOf(lead) || 'no company on file'}</div>
      </div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
        placeholder="no name"
        aria-label={`Name used to greet ${lead.name || lead.email}`}
        className={`w-24 shrink-0 px-2 py-1 border rounded-md text-xs focus:ring-2 focus:ring-primary-500 focus:border-transparent ${text ? 'border-gray-200' : 'border-amber-300 bg-amber-50'}`}
      />
    </div>
  )
}

/**
 * Review and send the next email of the series to one or many leads.
 * Each lead gets ITS next email, so a mixed selection is fine: the tabs at the
 * top show one preview per email that is about to go out.
 */
export default function SendStepModal({ leads, onClose, onSent, notify }: {
  leads: Lead[]
  onClose: () => void
  onSent: () => Promise<void>
  notify: (msg: string, isError?: boolean) => void
}) {
  // Who gets what, and who is left out (and why)
  const { groups, skipped } = useMemo(() => {
    const groups = new Map<string, Lead[]>()
    const skipped: string[] = []
    for (const l of leads) {
      const p = sequenceProgress(l)
      if (!l.email) { skipped.push(`${l.name}: no email address`); continue }
      if (p.stopped) { skipped.push(`${l.name}: emails stopped`); continue }
      if (!p.next) { skipped.push(`${l.name}: series finished`); continue }
      groups.set(p.next.id, [...(groups.get(p.next.id) || []), l])
    }
    return { groups, skipped }
  }, [leads])

  const stepIds = SEQUENCE.map((s) => s.id).filter((id) => groups.has(id))
  const [active, setActive] = useState(stepIds[0] || '')
  const [note, setNote] = useState('')
  const [preview, setPreview] = useState<Preview | null>(null)
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  // Names corrected in this window. They are saved on the lead at once, so every later email uses them too.
  const [names, setNames] = useState<Record<string, string>>({})
  const [saved, setSaved] = useState(0)
  const nameOf = (l: Lead) => (l.id in names ? names[l.id] : greetingOf(l))
  const saveName = async (lead: Lead, text: string) => {
    try {
      await api('/api/admin/leads', { method: 'PUT', body: JSON.stringify({ id: lead.id, greeting: text }) })
      setNames((n) => ({ ...n, [lead.id]: text }))
      setSaved((n) => n + 1)
    } catch (e: any) { notify(e.message, true) }
  }

  const total = [...groups.values()].reduce((n, g) => n + g.length, 0)
  // Who gets a copy: the admin mailbox always, and the person sending
  const { realEmail } = useCrm()
  const copied = realEmail && realEmail.toLowerCase() !== 'admin@gennoor.com' ? `admin@gennoor.com and ${realEmail.toLowerCase()}` : 'admin@gennoor.com'
  const sample = groups.get(active)?.[0]

  // The preview is the real email for the first lead in the group, note included
  useEffect(() => {
    if (!active || !sample) return
    let cancelled = false
    setLoading(true)
    const timer = setTimeout(() => {
      api<Preview>(`/api/admin/leads/sequence?step=${active}&leadId=${encodeURIComponent(sample.id)}&note=${encodeURIComponent(note)}`)
        .then((p) => { if (!cancelled) setPreview(p) })
        .catch((e) => { if (!cancelled) notify(e.message, true) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, note ? 400 : 0)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [active, sample?.id, note, saved]) // eslint-disable-line react-hooks/exhaustive-deps

  const send = async () => {
    setSending(true)
    try {
      const ids = [...groups.values()].flat().map((l) => l.id)
      let sent = 0
      const problems: string[] = []
      // 50 at a time is the server's limit
      for (let i = 0; i < ids.length; i += 50) {
        const res = await api<{ sent: number; errors: string[]; skipped: string[] }>('/api/admin/leads/sequence', {
          method: 'POST',
          body: JSON.stringify({ leadIds: ids.slice(i, i + 50), note }),
        })
        sent += res.sent
        problems.push(...(res.errors || []), ...(res.skipped || []))
      }
      notify(`Sent ${sent} email${sent === 1 ? '' : 's'}${problems.length ? `. ${problems.length} not sent: ${problems.slice(0, 2).join('; ')}` : ''}`, sent === 0)
      await onSent()
    } catch (e: any) { notify(e.message, true) } finally { setSending(false) }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl w-full max-w-4xl h-[92vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900">Review and send</h3>
            <p className="text-xs text-gray-500 truncate">
              {total} lead{total === 1 ? '' : 's'} · from sales@gennoor.com · copy (CC) to {copied}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded" aria-label="Close"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {total === 0 ? (
          <div className="flex-1 p-8 text-center text-sm text-gray-500 space-y-2">
            <p>None of the selected leads can be emailed right now.</p>
            {skipped.slice(0, 8).map((s) => <p key={s} className="text-xs text-gray-400">{s}</p>)}
          </div>
        ) : (
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_280px]">
            {/* The email, exactly as it will arrive */}
            <div className="flex flex-col min-h-0 border-r border-gray-100">
              {stepIds.length > 1 && (
                <div className="flex gap-1 px-4 pt-3 overflow-x-auto shrink-0">
                  {stepIds.map((id) => (
                    <button key={id} onClick={() => setActive(id)} className={`px-3 py-1.5 text-xs rounded-full border whitespace-nowrap ${active === id ? 'bg-primary-600 text-white border-primary-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                      Email {stepNumber(id)} · {groups.get(id)!.length}
                    </button>
                  ))}
                </div>
              )}
              <div className="px-4 py-2.5 shrink-0">
                <div className="text-[11px] text-gray-400">Email {stepNumber(active)} of {SEQUENCE.length} · {stepById(active)?.title}{sample ? ` · shown as ${sample.name} will see it` : ''}</div>
                <div className="text-sm font-medium text-gray-900 truncate">{preview?.subject || '…'}</div>
                {preview?.attachCatalogue && (
                  <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5"><Paperclip className="w-3 h-3" /> Gennoor-Tech-Catalog.xlsx is attached</div>
                )}
              </div>
              <div className="flex-1 min-h-0 bg-gray-100 relative">
                {preview && <iframe title="Email preview" srcDoc={preview.html.replace('<head>', '<head><base target="_blank">')} sandbox="allow-popups allow-popups-to-escape-sandbox" className="w-full h-full border-0" />}
                {loading && <div className="absolute top-2 right-3 bg-white/90 rounded-full px-2.5 py-1"><Spinner label="Updating" /></div>}
              </div>
            </div>

            {/* The only things to decide */}
            <div className="p-4 flex flex-col gap-3 overflow-y-auto">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Add a personal line (optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 600))}
                  rows={5}
                  placeholder="For example: Good to meet you at the summit last week."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <p className="text-[11px] text-gray-400 mt-1">Shown at the top of the email, for everyone in this send.</p>
              </div>
              <div className="text-xs text-gray-600">
                <div className="font-medium text-gray-700">Going to, and the name each email opens with</div>
                <p className="text-[11px] text-gray-400 mt-0.5 mb-1.5">Correct a name or clear it. It is kept on the lead for every email. With no name, the email is written without one.</p>
                <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                  {/* Leads with no clear name come first, so they are seen */}
                  {[...groups.values()].flat().sort((a, b) => Number(!!nameOf(a)) - Number(!!nameOf(b))).slice(0, 40).map((l) => (
                    <NameRow key={l.id} lead={l} value={nameOf(l)} onSave={(text) => saveName(l, text)} />
                  ))}
                  {total > 40 && <div className="text-gray-400">and {total - 40} more, greeted by the same rule</div>}
                </div>
              </div>
              {skipped.length > 0 && (
                <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-2 space-y-0.5">
                  <div className="font-medium">{skipped.length} left out</div>
                  {skipped.slice(0, 5).map((s) => <div key={s}>{s}</div>)}
                </div>
              )}
              <div className="mt-auto flex flex-col gap-2">
                <button onClick={send} disabled={sending || !preview} className="w-full px-4 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  <Send className="w-4 h-4" /> {sending ? 'Sending…' : `Send to ${total} lead${total === 1 ? '' : 's'}`}
                </button>
                <button onClick={onClose} className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
