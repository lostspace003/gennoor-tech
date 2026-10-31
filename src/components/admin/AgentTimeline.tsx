'use client'

import { Bot, Check, Loader2, X } from 'lucide-react'

export interface RunStep { agent: string; label: string; status: 'running' | 'done' | 'error'; output: string; live: string; usd: number }
export interface RunState { steps: RunStep[]; error: string; done: boolean }

const NAMES: Record<string, string> = { researcher: 'Research', writer: 'Write', designer: 'Design', packager: 'Package', reviewer: 'Review', renderer: 'Render' }
const ORDER = ['researcher', 'writer', 'designer', 'packager', 'reviewer', 'renderer']

/** Live view of an agent run: each agent, its status, and what it is producing right now. */
export default function AgentTimeline({ run, onClose, title = 'The AI team at work' }: { run: RunState; onClose: () => void; title?: string }) {
  const steps = [...run.steps].sort((a, b) => ORDER.indexOf(a.agent) - ORDER.indexOf(b.agent))
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold flex items-center gap-2"><Bot className="w-4 h-4 text-gray-500" />{title}</div>
        {(run.error || run.done) && <button onClick={onClose} className="text-xs text-gray-500 hover:text-gray-800">Close</button>}
      </div>
      {run.error && <div className="mb-3 rounded-md bg-red-50 border border-red-200 text-red-800 text-sm px-3 py-2">{run.error}</div>}
      {steps.length === 0 && !run.error && <div className="flex items-center gap-2 text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin" />Starting the team…</div>}
      <ol className="space-y-3">
        {steps.map(s => (
          <li key={s.agent} className="flex gap-3">
            <span className={`mt-0.5 w-6 h-6 shrink-0 rounded-full flex items-center justify-center text-white ${s.status === 'done' ? 'bg-emerald-500' : s.status === 'error' ? 'bg-red-500' : 'bg-gray-700'}`}>
              {s.status === 'done' ? <Check className="w-3.5 h-3.5" /> : s.status === 'error' ? <X className="w-3.5 h-3.5" /> : <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{NAMES[s.agent] || s.label}{s.status === 'done' && s.usd > 0 && <span className="ml-2 text-xs text-gray-400 font-normal">${s.usd.toFixed(3)}</span>}</div>
              <pre className="mt-1 text-xs text-gray-600 whitespace-pre-wrap break-words font-sans max-h-40 overflow-y-auto">{(s.status === 'running' ? s.live : s.output).slice(-900) || (s.status === 'running' ? 'Working…' : '')}</pre>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
