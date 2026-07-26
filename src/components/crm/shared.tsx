'use client'

import { Lead, LeadStatus, PipelineStage, PIPELINE_STAGES } from '@/lib/crm/types'

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
    <div className="flex items-center gap-1">
      {PIPELINE_STAGES.map((s, idx) => (
        <button
          key={s}
          type="button"
          disabled={!onSelect}
          onClick={() => onSelect?.(s)}
          className={`h-1.5 w-6 rounded transition-colors ${idx <= currentIdx ? 'bg-blue-600' : 'bg-gray-200'} ${onSelect ? 'hover:bg-blue-400 cursor-pointer' : 'cursor-default'}`}
          title={STAGE_LABELS[s]}
        />
      ))}
      <span className="ml-1.5 text-xs text-gray-500">{STAGE_LABELS[stage]}</span>
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

export function Spinner({ label }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-gray-500">
      <span className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      {label}
    </span>
  )
}
