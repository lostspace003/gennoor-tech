'use client'

import { useEffect, useState } from 'react'
import { Check, Copy, ScrollText, X } from 'lucide-react'

export interface StepLog { label: string; output: string; usd?: number; status?: string }

const usd = (n: number) => `$${n < 1 ? n.toFixed(3) : n.toFixed(2)}`

function toText(title: string, steps: StepLog[]) {
  return `${title}\n\n` + steps.map((s, i) => `[${i + 1}] ${s.label}${s.usd ? ` (${usd(s.usd)})` : ''}${s.status && s.status !== 'done' ? ` [${s.status}]` : ''}\n${s.output || '(no output)'}`).join('\n\n---\n\n')
}

async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); return true } catch {
    const t = document.createElement('textarea'); t.value = text; document.body.appendChild(t); t.select()
    const ok = document.execCommand('copy'); t.remove(); return ok
  }
}

/** A button that opens the step-by-step log of an agent run in a pop-up, with copy buttons. */
export function StepLogButton({ steps, title, className }: { steps: StepLog[]; title?: string; className?: string }) {
  const [open, setOpen] = useState(false)
  if (!steps.length) return null
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className || 'inline-flex items-center gap-1 px-3 py-1.5 text-[13px] font-medium rounded-md border border-gray-200 bg-white hover:border-gray-400'}><ScrollText className="w-3.5 h-3.5" />Step logs</button>
      {open && <StepLogModal steps={steps} title={title} onClose={() => setOpen(false)} />}
    </>
  )
}

export default function StepLogModal({ steps, title = 'Step logs', onClose }: { steps: StepLog[]; title?: string; onClose: () => void }) {
  const [copied, setCopied] = useState('')
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k)
  }, [onClose])
  const doCopy = async (key: string, text: string) => { if (await copy(text)) { setCopied(key); setTimeout(() => setCopied(c => (c === key ? '' : c)), 1500) } }
  const btn = 'inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md border border-gray-200 bg-white hover:border-gray-400'
  return (
    <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[88vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <ScrollText className="w-4 h-4 text-gray-500" /><div className="text-sm font-semibold">{title}</div>
          <button onClick={() => doCopy('all', toText(title, steps))} className={`${btn} ml-auto`}>{copied === 'all' ? <><Check className="w-3.5 h-3.5 text-emerald-600" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy all</>}</button>
          <button onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-800"><X className="w-4 h-4" /></button>
        </div>
        <div className="overflow-y-auto p-4 space-y-4">
          {steps.map((s, i) => (
            <div key={i}>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-400 font-normal">{i + 1}.</span>{s.label}
                {s.usd ? <span className="text-xs text-gray-400 font-normal">{usd(s.usd)}</span> : null}
                {s.status === 'error' && <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-800">failed</span>}
                <button onClick={() => doCopy(String(i), `${s.label}\n${s.output}`)} className={`${btn} ml-auto`}>{copied === String(i) ? <><Check className="w-3.5 h-3.5 text-emerald-600" />Copied</> : <><Copy className="w-3.5 h-3.5" />Copy</>}</button>
              </div>
              <pre className="mt-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-100 rounded-md p-2.5 whitespace-pre-wrap break-words font-mono max-h-80 overflow-y-auto select-text">{s.output || '(no output)'}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
