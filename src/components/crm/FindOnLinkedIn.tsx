'use client'

import { useEffect, useState } from 'react'
import { X, Search, Linkedin, UserPlus } from 'lucide-react'
import { toolByName } from '@/lib/linkedin-catalog'
import { api, Spinner } from './shared'

interface Person { name: string; title: string; company: string; location: string; degree: string; linkedin: string; inCrm: boolean }
interface Usage { configured: boolean; lookups?: { used: number; cap: number } }

const PLACES = toolByName('search_people')?.fields.find((f) => f.name === 'location')?.options || []

/**
 * Search LinkedIn for people and add the ones you tick as leads.
 * Runs through the LinkedIn hub's saved sign-in and counts against its daily
 * lookups, so the account stays inside safe limits.
 */
export default function FindOnLinkedIn({ onClose, onAdded, notify }: {
  onClose: () => void
  onAdded: () => Promise<void>
  notify: (msg: string, isError?: boolean) => void
}) {
  const [keywords, setKeywords] = useState('')
  const [company, setCompany] = useState('')
  const [place, setPlace] = useState('')
  const [people, setPeople] = useState<Person[] | null>(null)
  const [picked, setPicked] = useState<string[]>([])
  const [busy, setBusy] = useState('')
  const [usage, setUsage] = useState<Usage | null>(null)

  const loadUsage = () => api<Usage>('/api/admin/leads/linkedin').then(setUsage).catch(() => setUsage({ configured: false }))
  useEffect(() => { loadUsage() }, [])

  const key = (p: Person) => p.linkedin || `${p.name}|${p.company}`

  const search = async () => {
    if (!keywords.trim()) { notify('Type a role or keyword, for example "Head of Learning"', true); return }
    setBusy('search')
    setPeople(null)
    setPicked([])
    try {
      const res = await api<{ people: Person[] }>('/api/admin/leads/linkedin', {
        method: 'POST', body: JSON.stringify({ action: 'search', keywords, company, location: place }),
      })
      setPeople(res.people)
      loadUsage()
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const add = async () => {
    const chosen = (people || []).filter((p) => picked.includes(key(p)))
    if (!chosen.length) return
    setBusy('add')
    try {
      const res = await api<{ added: number; updated: number }>('/api/admin/leads/bulk-upload', {
        method: 'POST',
        body: JSON.stringify({
          leads: chosen.map((p) => ({ name: p.name, company: p.company, designation: p.title, country: p.location, linkedin: p.linkedin, source: 'LinkedIn search' })),
        }),
      })
      notify(`${res.added} lead${res.added === 1 ? '' : 's'} added${res.updated ? `, ${res.updated} already here` : ''}. They are in Unassigned.`)
      setPeople((list) => (list || []).map((p) => (picked.includes(key(p)) ? { ...p, inCrm: true } : p)))
      setPicked([])
      await onAdded()
    } catch (e: any) { notify(e.message, true) } finally { setBusy('') }
  }

  const cls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent'
  const selectable = (people || []).filter((p) => !p.inCrm)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-raised rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2"><Linkedin className="w-4 h-4 text-primary-600" /> Find leads on LinkedIn</h3>
            <p className="text-xs text-gray-500">
              Search, tick the people you want, add them as leads.
              {usage?.lookups && ` ${usage.lookups.used} of ${usage.lookups.cap} searches used today.`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded" aria-label="Close"><X className="w-5 h-5 text-gray-500" /></button>
        </div>

        {usage && !usage.configured ? (
          <div className="p-8 text-sm text-gray-600 text-center">The LinkedIn service is not connected on this site. Check it in the LinkedIn hub.</div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-100 grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_1fr_auto] gap-2 shrink-0">
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} className={cls} placeholder="Role or keyword, e.g. Head of Learning" autoFocus />
              <input value={company} onChange={(e) => setCompany(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && search()} className={cls} placeholder="Organization (optional)" />
              <select value={place} onChange={(e) => setPlace(e.target.value)} className={cls}>
                <option value="">Any country</option>
                {PLACES.map((o) => <option key={o.v} value={o.v}>{o.l.replace(/\s*\(.*\)$/, '')}</option>)}
              </select>
              <button onClick={search} disabled={busy === 'search'} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-1.5">
                <Search className="w-4 h-4" /> Search
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[12rem]">
              {busy === 'search' && <div className="p-8 text-center"><Spinner label="Searching LinkedIn. This can take up to a minute." /></div>}
              {!busy && people === null && (
                <div className="p-8 text-center text-sm text-gray-400">Results appear here. Each search uses one of the day&apos;s lookups.</div>
              )}
              {people && people.length === 0 && <div className="p-8 text-center text-sm text-gray-500">No people found. Try a broader keyword.</div>}
              {people && people.length > 0 && (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 w-10">
                        <input
                          type="checkbox" className="rounded" aria-label="Select all"
                          checked={selectable.length > 0 && selectable.every((p) => picked.includes(key(p)))}
                          onChange={(e) => setPicked(e.target.checked ? selectable.map(key) : [])}
                        />
                      </th>
                      {['Person', 'Organization', 'Place'].map((h) => <th key={h} className="px-3 py-2 text-left text-xs font-medium text-gray-500">{h}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {people.map((p) => (
                      <tr key={key(p)} className={p.inCrm ? 'opacity-50' : 'hover:bg-gray-50'}>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox" className="rounded" disabled={p.inCrm} aria-label={`Select ${p.name}`}
                            checked={picked.includes(key(p))}
                            onChange={(e) => setPicked(e.target.checked ? [...picked, key(p)] : picked.filter((k) => k !== key(p)))}
                          />
                        </td>
                        <td className="px-3 py-2 max-w-[260px]">
                          <div className="font-medium text-gray-900 truncate">
                            {p.linkedin ? <a href={p.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary-600 hover:underline">{p.name}</a> : p.name}
                            {p.degree && <span className="ml-1.5 text-[10px] text-gray-400 font-normal">{p.degree}</span>}
                          </div>
                          <div className="text-xs text-gray-500 truncate">{p.title}</div>
                        </td>
                        <td className="px-3 py-2 text-gray-700 max-w-[200px] truncate">{p.company || <span className="text-gray-300">not shown</span>}</td>
                        <td className="px-3 py-2 text-xs text-gray-500">{p.inCrm ? <span className="text-green-700">already a lead</span> : p.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="px-5 py-3.5 border-t border-gray-200 flex items-center justify-between gap-3 shrink-0">
              <p className="text-[11px] text-gray-400">LinkedIn does not show email addresses. Reach these leads with Connect and Message on the lead page, or add an email when you have one.</p>
              <button onClick={add} disabled={!picked.length || busy === 'add'} className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-1.5 shrink-0">
                <UserPlus className="w-4 h-4" /> {busy === 'add' ? 'Adding…' : `Add ${picked.length || ''} as leads`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
