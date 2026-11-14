'use client'

import { useEffect, useState } from 'react'
import { Paperclip } from 'lucide-react'
import { SEQUENCE, SEQUENCE_DAYS, type SequenceStep } from '@/lib/crm/sequence'
import { api, Spinner } from './shared'
import { useCrm } from './CrmContext'

interface Preview { subject: string; html: string; attachCatalogue: boolean }

/** The email series laid out as a plan: what goes out, when, and how it looks. */
export default function SequenceView() {
  const { notify, leads } = useCrm()
  const [active, setActive] = useState(SEQUENCE[0].id)
  const [preview, setPreview] = useState<Preview | null>(null)
  const [loading, setLoading] = useState(true)
  // The same email for a lead whose name or company we do not have: it is written without them
  const [bare, setBare] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    api<Preview>(`/api/admin/leads/sequence?step=${active}${bare ? '&sample=bare' : ''}`)
      .then((p) => { if (!cancelled) setPreview(p) })
      .catch((e) => { if (!cancelled) notify(e.message, true) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [active, bare]) // eslint-disable-line react-hooks/exhaustive-deps

  // Day each email goes out, counted from the first one
  let day = 0
  const plan = SEQUENCE.map((s) => { day += s.gapDays; return { step: s, day } })
  const phases = [...new Set(SEQUENCE.map((s) => s.phase))]
  const sentCount = (s: SequenceStep) => leads.filter((l) => l.sequence?.sent.some((x) => x.step === s.id)).length

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-[340px_1fr]">
      <div className="border-r border-gray-200 bg-surface overflow-y-auto p-3 sm:p-4 space-y-4">
        <div>
          <h2 className="text-base font-semibold text-gray-900">The email series</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {SEQUENCE.length} emails over about {Math.round(SEQUENCE_DAYS / 30)} months. Every lead gets the same ones, in this order unless you change it on that lead's Emails board. You send each one when it is due, or any of them sooner.
          </p>
        </div>
        {phases.map((phase) => (
          <div key={phase}>
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{phase}</div>
            <div className="space-y-1">
              {plan.filter((x) => x.step.phase === phase).map(({ step, day }) => {
                const n = SEQUENCE.indexOf(step) + 1
                return (
                  <button
                    key={step.id}
                    onClick={() => setActive(step.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${active === step.id ? 'border-primary-300 bg-primary-50' : 'border-transparent hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-medium ${active === step.id ? 'text-primary-800' : 'text-gray-900'}`}>{n}. {step.title}</span>
                      <span className="text-[11px] text-gray-400 whitespace-nowrap">day {day}</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">{step.purpose}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-2">
                      <span>sent to {sentCount(step)}</span>
                      {step.attachCatalogue && <span className="inline-flex items-center gap-0.5"><Paperclip className="w-3 h-3" /> catalogue</span>}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col min-h-[70vh] bg-gray-100">
        <div className="bg-surface border-b border-gray-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <div className="text-[11px] text-gray-400">
              {bare
                ? 'Subject, for a lead with no clear name and no company on file'
                : 'Subject, shown for a made-up lead (Priya at Acme Industries). Every lead gets their own name.'}
            </div>
            <div className="text-sm font-medium text-gray-900">{preview?.subject || '…'}</div>
          </div>
          <div className="flex gap-1 shrink-0" role="group" aria-label="Show the email">
            {([[false, 'With a name'], [true, 'Without a name']] as const).map(([value, label]) => (
              <button
                key={label}
                type="button"
                aria-pressed={bare === value}
                onClick={() => setBare(value)}
                className={`px-2.5 py-1 text-xs rounded-full border whitespace-nowrap ${bare === value ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 relative">
          {preview && <iframe title="Email preview" srcDoc={preview.html.replace('<head>', '<head><base target="_blank">')} sandbox="allow-popups allow-popups-to-escape-sandbox" className="absolute inset-0 w-full h-full border-0" />}
          {loading && <div className="absolute top-3 right-4 bg-surface/90 rounded-full px-2.5 py-1"><Spinner label="Loading" /></div>}
        </div>
      </div>
    </div>
  )
}
