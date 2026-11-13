'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { courseNames, credentialTracks, monthYear, type Credential, type CredentialTrack } from '@/data/credentials'

/**
 * The credentials, year by year. Filter by area, tap one to see what it is and which Learning Studio
 * course it connects to. Kept quiet on purpose: small chips, no badges, no wall of logos.
 */
export default function CredentialTimeline({ items }: { items: Credential[] }) {
  const [track, setTrack] = useState<'all' | CredentialTrack>('all')
  const [open, setOpen] = useState<string | null>(null)

  const tracks = useMemo(() => {
    const present = new Set(items.map(i => i.track))
    return (Object.keys(credentialTracks) as CredentialTrack[]).filter(t => present.has(t))
  }, [items])

  const shown = useMemo(() => items.filter(i => track === 'all' || i.track === track), [items, track])
  const years = useMemo(() => {
    const m = new Map<string, Credential[]>()
    for (const c of [...shown].sort((a, b) => a.earned.localeCompare(b.earned))) {
      const y = c.earned.slice(0, 4)
      m.set(y, [...(m.get(y) || []), c])
    }
    return Array.from(m.entries())
  }, [shown])

  const count = (t: 'all' | CredentialTrack) => (t === 'all' ? items.length : items.filter(i => i.track === t).length)

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by area">
        {(['all', ...tracks] as const).map(t => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={track === t}
            onClick={() => { setTrack(t); setOpen(null) }}
            className={`px-3.5 py-1.5 rounded-full text-[13.5px] font-medium border transition-colors ${
              track === t ? 'bg-primary-600 border-primary-600 text-white' : 'bg-raised border-gray-300 text-gray-700 hover:border-gray-400'
            }`}
          >
            {t === 'all' ? 'All' : credentialTracks[t]} <span className={track === t ? 'text-white/75' : 'text-gray-400'}>{count(t)}</span>
          </button>
        ))}
      </div>

      <ol className="relative mt-10 ml-2 border-l border-gray-200 space-y-10">
        {years.map(([year, list]) => (
          <li key={year} className="relative pl-8">
            <span aria-hidden className="absolute -left-[7px] top-2 w-3.5 h-3.5 rounded-full bg-primary-600 ring-4 ring-white" />
            <div className="flex items-baseline gap-3">
              <h3 className="font-heading text-[22px] font-bold tracking-[-0.01em] text-gray-900">{year}</h3>
              <span className="text-[13px] text-gray-400 tabular-nums">{list.length} earned</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {list.map(c => {
                const active = open === c.code
                return (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setOpen(active ? null : c.code)}
                    aria-expanded={active}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[13.5px] transition-colors ${
                      active ? 'border-primary-600 bg-primary-50' : 'border-gray-200 bg-raised hover:border-gray-300'
                    }`}
                  >
                    <span className="font-semibold tabular-nums text-gray-900">{c.code}</span>
                    <span className="text-gray-500">{c.name}</span>
                    {c.level === 'Expert' && <span className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Expert</span>}
                  </button>
                )
              })}
            </div>
            {list.some(c => c.code === open) && (() => {
              const c = list.find(x => x.code === open)!
              return (
                <div className="mt-3 rounded-2xl bg-gray-50 px-5 py-4 text-[14.5px] leading-[1.55] text-gray-700">
                  <p className="font-semibold text-gray-900">
                    {c.issuer === 'GitHub' ? 'GitHub Certified' : 'Microsoft Certified'}: {c.name}{c.level === 'Expert' || c.level === 'Associate' ? ` ${c.level}` : ''}
                  </p>
                  <p className="text-gray-500 mt-0.5">Exam {c.code} · earned {monthYear(c.earned)}</p>
                  {c.courses && c.courses.length > 0 && (
                    <p className="mt-2">
                      {c.primaryFor?.length ? 'The exam the ' : 'Related to the '}
                      {c.courses.map((s, i) => (
                        <span key={s}>
                          {i > 0 && ' and '}
                          <Link href={`/studio/${s}`} className="text-primary-600 hover:underline">{courseNames[s] || s}</Link>
                        </span>
                      ))}
                      {c.primaryFor?.length ? ' prepares you for.' : '.'}
                    </p>
                  )}
                </div>
              )
            })()}
          </li>
        ))}
      </ol>
    </div>
  )
}
