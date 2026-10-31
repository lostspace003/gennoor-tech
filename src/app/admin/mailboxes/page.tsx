'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import type { MailboxInfo } from '@/lib/mailboxes'

type Row = MailboxInfo & { status: 'ok' | 'missing' | 'error' | 'unknown'; total?: number; unread?: number }

const GROUPS: { key: MailboxInfo['group']; title: string; note: string }[] = [
  { key: 'Site', title: 'Used by the website', note: 'The site sends from these or tells visitors to write to them.' },
  { key: 'Team', title: 'Team mailboxes', note: 'Personal mailboxes. Not used by the site.' },
  { key: 'Spare', title: 'Ready, not used yet', note: 'These exist. Nothing sends from them. Each has a note on how to start using it.' },
]

const USE_LABEL: Record<string, string> = { sends: 'Sends', receives: 'Receives', copy: 'Gets a copy', ready: 'Ready' }

export default function MailboxesPage() {
  const [rows, setRows] = useState<Row[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/mailboxes').then(r => r.ok ? r.json() : Promise.reject(new Error(String(r.status))))
      .then(d => setRows(d.mailboxes)).catch(e => setError(`Could not load (${e.message})`))
  }, [])

  return (
    <div className="w-full p-4 lg:p-5">
      <h1 className="text-xl font-semibold tracking-tight text-gray-900">Mailboxes</h1>
      <p className="text-sm text-gray-500 mt-0.5">Every Gennoor mailbox, what the site does with it, and whether it exists in Microsoft 365 right now.</p>

      {error && <p className="mt-4 text-sm text-red-700 bg-red-100 rounded-md px-3 py-2">{error}</p>}
      {!rows && !error && <p className="mt-4 text-sm text-gray-500 flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Checking Microsoft 365…</p>}

      {rows && GROUPS.map(g => (
        <section key={g.key} className="mt-6">
          <h2 className="text-base font-semibold text-gray-900">{g.title}</h2>
          <p className="text-sm text-gray-500 mb-3">{g.note}</p>
          <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl shadow-sm bg-white">
            {rows.filter(r => r.group === g.key).map(r => (
              <div key={r.address} className="p-4">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-medium text-gray-900 break-all">{r.address}</span>
                  <span className="text-sm text-gray-500">{r.purpose}</span>
                  <span className="ml-auto flex flex-wrap items-center gap-2 text-xs">
                    {r.uses.map(u => <span key={u} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{USE_LABEL[u]}</span>)}
                    {r.status === 'ok' && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Active{typeof r.unread === 'number' ? ` · ${r.unread} unread` : ''}</span>}
                    {r.status === 'missing' && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800">Not found</span>}
                    {r.status === 'error' && <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Could not check</span>}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1 break-words">{r.usedFor}</p>
                {r.connect && <p className="text-sm text-primary-700 mt-1 break-words"><strong>To use it:</strong> {r.connect}</p>}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
