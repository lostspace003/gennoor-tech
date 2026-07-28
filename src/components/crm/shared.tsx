'use client'

import { useState } from 'react'
import { Lead, LeadStatus, PipelineStage, PIPELINE_STAGES } from '@/lib/crm/types'
import { IST, istInstant, leadTimeZone, formatInZone } from '@/lib/crm/timezones'

export const STAGE_LABELS: Record<PipelineStage, string> = {
  diagnose: 'Diagnose',
  train: 'Train',
  poc: 'POC',
  development: 'Development',
  sustain: 'Sustain',
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-slate-100 text-slate-700',
  contacted: 'bg-blue-100 text-blue-700',
  qualified: 'bg-purple-100 text-purple-700',
  proposal: 'bg-yellow-100 text-yellow-700',
  negotiation: 'bg-orange-100 text-orange-700',
  won: 'bg-green-100 text-green-700',
  lost: 'bg-red-100 text-red-700',
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${STATUS_COLORS[status] || STATUS_COLORS.new}`}>
      {status}
    </span>
  )
}

export function ProcessDot({ status }: { status: Lead['processStatus'] }) {
  const color = status === 'active' ? 'bg-green-500' : status === 'paused' ? 'bg-yellow-500' : 'bg-red-500'
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${color}`} />
      <span className="text-xs text-gray-600 capitalize">{status}</span>
    </span>
  )
}

export function StageBar({ stage, onSelect }: { stage: PipelineStage; onSelect?: (s: PipelineStage) => void }) {
  const currentIdx = PIPELINE_STAGES.indexOf(stage)
  return (
    <div className="flex items-center gap-2">
      <div className="flex w-20 h-2 rounded-full overflow-hidden bg-gray-100" role="progressbar" aria-label={`Stage ${currentIdx + 1} of 5`}>
        {PIPELINE_STAGES.map((s, idx) => (
          <button
            key={s}
            type="button"
            disabled={!onSelect}
            onClick={(e) => { e.stopPropagation(); onSelect?.(s) }}
            className={`flex-1 transition-colors ${idx <= currentIdx ? 'bg-blue-600' : 'bg-gray-200'} ${idx > 0 ? 'border-l border-white' : ''} ${onSelect ? 'hover:bg-blue-400 cursor-pointer' : 'cursor-default'}`}
            title={`${idx + 1}. ${STAGE_LABELS[s]}${onSelect ? ' — click to set' : ''}`}
          />
        ))}
      </div>
      <span className="text-xs text-gray-600 whitespace-nowrap"><span className="font-semibold text-gray-800">{currentIdx + 1}/5</span> {STAGE_LABELS[stage]}</span>
    </div>
  )
}

export function timeAgo(dateString: string): string {
  if (!dateString) return '—'
  const date = new Date(dateString)
  const diffMs = Date.now() - date.getTime()
  const days = Math.floor(diffMs / 86_400_000)
  if (days <= 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export function formatDateTime(iso: string): string {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })
  } catch {
    return iso
  }
}

// Small typed fetch helper: throws with the server's error message so every
// component surfaces real failures instead of silently pretending success.
export async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)
  return data as T
}

// Small ⓘ helper — one-tap plain-language explanation of a panel/option
export function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex align-middle">
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); setOpen((o) => !o) }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        aria-label="What is this?"
        className="w-4 h-4 rounded-full border border-gray-300 text-gray-400 hover:text-blue-600 hover:border-blue-400 text-[10px] leading-none inline-flex items-center justify-center italic shrink-0"
      >i</button>
      {open && (
        <span className="absolute z-[80] top-5 left-1/2 -translate-x-1/2 w-60 bg-gray-900 text-white text-[11px] rounded-lg px-3 py-2 shadow-xl leading-relaxed normal-case font-normal text-left">
          {text}
        </span>
      )}
    </span>
  )
}

// Tiny copy affordance for chat messages and AI outputs
export function CopyMsg({ text, light }: { text: string; light?: boolean }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        })
      }}
      className={`mt-1 block text-[10px] ${light ? 'text-blue-100 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
      title="Copy message"
    >
      {copied ? '✓ copied' : 'copy'}
    </button>
  )
}

// Slider for picking a duration — snaps to sensible stops, big readable value
export function DurationSlider({ value, onChange, stops = [15, 30, 45, 60, 90, 120], label = 'Duration' }: {
  value: number; onChange: (minutes: number) => void; stops?: number[]; label?: string
}) {
  const idx = Math.max(0, stops.indexOf(value) === -1 ? stops.findIndex((s) => s >= value) : stops.indexOf(value))
  const fmt = (m: number) => (m < 60 ? `${m} min` : m % 60 === 0 ? `${m / 60} hr${m > 60 ? 's' : ''}` : `${Math.floor(m / 60)}h ${m % 60}m`)
  return (
    <div className="px-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">{fmt(stops[idx] ?? value)}</span>
      </div>
      <input
        type="range"
        min={0}
        max={stops.length - 1}
        step={1}
        value={idx}
        onChange={(e) => onChange(stops[Number(e.target.value)])}
        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        aria-label={label}
      />
      <div className="flex justify-between mt-0.5">
        {stops.map((s) => <span key={s} className="text-[10px] text-gray-400">{s < 60 ? s : `${s / 60}h`}</span>)}
      </div>
    </div>
  )
}

// Slider for picking a time of day in IST — 15-min steps, syncs with any
// native time input holding the same "HH:MM" value.
export function TimeSlider({ value, onChange, label = 'Time (IST)', step = 15 }: {
  value: string; onChange: (hhmm: string) => void; label?: string; step?: number
}) {
  const mins = /^\d{2}:\d{2}$/.test(value) ? Number(value.slice(0, 2)) * 60 + Number(value.slice(3, 5)) : 10 * 60
  const toHHMM = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`
  const fmt = (m: number) => {
    const h = Math.floor(m / 60), mm = m % 60
    return `${h % 12 || 12}:${String(mm).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
  }
  return (
    <div className="px-1">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5">{fmt(mins)} IST</span>
      </div>
      <input
        type="range"
        min={0}
        max={1440 - step}
        step={step}
        value={mins - (mins % step)}
        onChange={(e) => onChange(toHHMM(Number(e.target.value)))}
        className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
        aria-label={label}
      />
      <div className="flex justify-between mt-0.5 text-[10px] text-gray-400">
        <span>12 AM</span><span>6 AM</span><span>12 PM</span><span>6 PM</span><span>12 AM</span>
      </div>
    </div>
  )
}

// Live preview of the selected IST slot in the lead's own time zone, resolved
// from their country/city. Shown under every schedule picker so the team sees
// the conversion before anything is sent.
export function LeadLocalTime({ date, time, country, city, who = 'Lead' }: {
  date: string; time: string; country?: string; city?: string; who?: string
}) {
  if (!date || !time) return null
  const tz = leadTimeZone(country, city)
  if (!tz) {
    return country ? (
      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        Couldn&apos;t map &quot;{country}&quot; to a time zone — the invite will show IST only.
      </p>
    ) : (
      <p className="text-[11px] text-gray-400 px-1">{who} has no country set — the invite will show IST only.</p>
    )
  }
  const instant = istInstant(date, time)
  if (isNaN(instant.getTime())) return null
  if (tz === IST) {
    return <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">{who} is in the same time zone (IST) — no conversion needed.</p>
  }
  return (
    <p className="text-[11px] text-blue-800 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
      {who}&apos;s local time{country ? ` (${country})` : ''}: <strong>{formatInZone(instant, tz)}</strong>
    </p>
  )
}

// Numbered pagination (1 2 3 …) shared by every long CRM list
export function Pagination({ page, total, perPage, onPage }: { page: number; total: number; perPage: number; onPage: (p: number) => void }) {
  const pages = Math.max(1, Math.ceil(total / perPage))
  if (pages <= 1) return null
  // Window of page numbers around the current page, always with first/last
  const nums = Array.from(new Set([1, pages, page - 1, page, page + 1].filter((p) => p >= 1 && p <= pages))).sort((a, b) => a - b)
  return (
    <div className="flex items-center justify-between gap-2 pt-1">
      <span className="text-[11px] text-gray-400">{(page - 1) * perPage + 1}–{Math.min(page * perPage, total)} of {total}</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onPage(page - 1)} disabled={page <= 1} className="px-2 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">‹</button>
        {nums.map((n, i) => (
          <span key={n} className="flex items-center gap-1">
            {i > 0 && n - nums[i - 1] > 1 && <span className="text-xs text-gray-300 px-0.5">…</span>}
            <button
              onClick={() => onPage(n)}
              className={`min-w-[1.75rem] px-2 py-1 text-xs rounded-lg border ${n === page ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              {n}
            </button>
          </span>
        ))}
        <button onClick={() => onPage(page + 1)} disabled={page >= pages} className="px-2 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40">›</button>
      </div>
    </div>
  )
}

// Compact multi-select filter: button shows "Label · n", opens a checkbox list.
// Empty selection = no filter (all).
export function MultiSelect({ label, options, values, onChange }: {
  label: string
  options: Array<{ value: string; label: string }>
  values: string[]
  onChange: (values: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const toggle = (v: string) => onChange(values.includes(v) ? values.filter((x) => x !== v) : [...values, v])
  return (
    <span className="relative inline-flex" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false) }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`text-sm border rounded-lg px-2.5 py-2 flex items-center gap-1.5 ${values.length ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
      >
        {label}{values.length > 0 && <span className="text-[10px] bg-blue-600 text-white rounded-full px-1.5 py-0.5 leading-none">{values.length}</span>}
        <span className="text-gray-400 text-[10px]">▾</span>
      </button>
      {open && (
        <span className="absolute z-[70] top-full mt-1 left-0 min-w-44 bg-white border border-gray-200 rounded-lg shadow-xl p-1.5 space-y-0.5">
          {options.map((o) => (
            <label key={o.value} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer text-sm text-gray-700 whitespace-nowrap">
              <input type="checkbox" className="rounded" checked={values.includes(o.value)} onChange={() => toggle(o.value)} />
              {o.label}
            </label>
          ))}
          {values.length > 0 && (
            <button type="button" onClick={() => onChange([])} className="w-full text-left px-2 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-md">Clear ({values.length})</button>
          )}
        </span>
      )}
    </span>
  )
}

// Lead priority helpers — free-text priority normalised to three buckets
export function normPriority(p: string | undefined): 'high' | 'medium' | 'low' | '' {
  const v = (p || '').trim().toLowerCase()
  if (!v) return ''
  if (v.startsWith('h') || v === '1' || v === 'p1' || v.includes('urgent')) return 'high'
  if (v.startsWith('m') || v === '2' || v === 'p2') return 'medium'
  if (v.startsWith('l') || v === '3' || v === 'p3') return 'low'
  return 'medium'
}

export function PriorityBadge({ priority }: { priority: string | undefined }) {
  const p = normPriority(priority)
  if (!p) return <span className="text-[11px] text-gray-300">—</span>
  const cls = p === 'high' ? 'bg-red-50 text-red-700 border-red-200' : p === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-50 text-slate-600 border-slate-200'
  return <span className={`text-[11px] border rounded-full px-2 py-0.5 capitalize ${cls}`}>{p}</span>
}

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-gray-500">
      <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      {label}
    </span>
  )
}
