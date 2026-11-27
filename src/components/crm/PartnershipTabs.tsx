'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Handshake } from 'lucide-react'
import { CAMPAIGNS } from '@/data/partnership-campaigns'

/** The sub-tabs of Partnerships: one for each campaign. The tab of the one being looked at is marked. */
export default function PartnershipTabs() {
  const pathname = usePathname() || ''
  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-5 max-w-7xl">
      <p className="flex items-center gap-2 text-xs font-semibold tracking-wide uppercase text-gray-500"><Handshake className="w-4 h-4 text-primary-600" />Partnerships</p>
      <nav aria-label="Partnership campaigns" className="mt-2 flex gap-1 overflow-x-auto border-b border-gray-200">
        {CAMPAIGNS.map((c) => {
          const on = pathname === `/crm/partnerships/${c.key}` || pathname.startsWith(`/crm/partnerships/${c.key}/`)
          return (
            <Link key={c.key} href={`/crm/partnerships/${c.key}`} aria-current={on ? 'page' : undefined}
              className={`px-3.5 py-2 text-sm font-semibold whitespace-nowrap -mb-px border-b-2 ${on ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-600 hover:text-gray-900'}`}>{c.label}</Link>
          )
        })}
      </nav>
    </div>
  )
}
