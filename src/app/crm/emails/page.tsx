'use client'

import { useEffect, useState } from 'react'
import { LayoutGrid, Mail } from 'lucide-react'
import SequenceView from '@/components/crm/SequenceView'
import EmailTracker from '@/components/crm/EmailTracker'

type Tab = 'tracker' | 'emails'

/** Emails: who has had which email (the tracker), and the emails themselves (the plan and how each one looks). */
export default function EmailsPage() {
  const [tab, setTab] = useState<Tab>('tracker')
  // A link may ask for the plan directly: /crm/emails?view=emails
  useEffect(() => { if (new URLSearchParams(window.location.search).get('view') === 'emails') setTab('emails') }, [])
  return (
    <div className="h-full flex flex-col">
      <div className="flex gap-1 border-b border-gray-200 px-3 sm:px-4 text-sm shrink-0">
        {([['tracker', 'Tracker', LayoutGrid], ['emails', 'The emails', Mail]] as const).map(([id, label, Icon]) => (
          <button key={id} onClick={() => setTab(id)} className={`inline-flex items-center gap-1.5 px-3 py-2 -mb-px border-b-2 ${tab === id ? 'border-primary-600 text-primary-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-800'}`}><Icon className="w-4 h-4" />{label}</button>
        ))}
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto">{tab === 'tracker' ? <EmailTracker /> : <SequenceView />}</div>
    </div>
  )
}
