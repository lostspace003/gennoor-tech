'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Zap } from 'lucide-react'
import { isCrmManager } from '@/lib/crm/users'
import { isOpen, sequenceProgress } from '@/lib/crm/sequence'

// Compact CRM pulse for the admin header, shown to managers.
export default function CrmStatsTile() {
  const router = useRouter()
  const { data: session } = useSession()
  const isManager = isCrmManager(session?.user?.email)
  const [stats, setStats] = useState<{ pool: number; action: number } | null>(null)

  useEffect(() => {
    fetch('/api/admin/leads')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.leads) return
        const open = d.leads.filter(isOpen)
        const pool = open.filter((l: any) => !l.owner).length
        // An email of the series is ready to go: the first one, or the next one now due
        const action = open.filter((l: any) => l.owner && l.email && ['new', 'contacted'].includes(l.status) && sequenceProgress(l).due).length
        setStats({ pool, action })
      })
      .catch(() => {})
  }, [])

  if (!stats || !isManager) return null

  return (
    <button
      onClick={() => router.push('/crm/queue')}
      className="px-3.5 py-2 text-[13px] font-medium bg-primary-50 text-primary-700 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors flex items-center gap-1.5"
      title="Open the CRM"
    >
      <Zap className="w-3.5 h-3.5" />
      CRM: {stats.pool} unassigned · {stats.action} emails due
    </button>
  )
}
