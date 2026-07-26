'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'

// Compact CRM pulse for the admin header (admin/jalal/yusuf see it; the
// API 401s for anyone else and the tile stays hidden).
export default function CrmStatsTile() {
  const router = useRouter()
  const [stats, setStats] = useState<{ pool: number; action: number } | null>(null)

  useEffect(() => {
    fetch('/api/admin/leads')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.leads) return
        const active = d.leads.filter((l: any) => !l.dumped && l.processStatus === 'active' && !['won', 'lost'].includes(l.status))
        const pool = active.filter((l: any) => !l.owner).length
        const lastSent = (l: any) => l.emailHistory?.find((e: any) => e.status === 'sent')?.at
        const action = active.filter((l: any) => l.owner && (
          !l.aiResearch || (l.aiResearch && !l.finalizedPitch) || (l.finalizedPitch && !lastSent(l)) ||
          (lastSent(l) && Date.now() - new Date(lastSent(l)).getTime() > 5 * 86_400_000)
        )).length
        setStats({ pool, action })
      })
      .catch(() => {})
  }, [])

  if (!stats) return null

  return (
    <button
      onClick={() => router.push('/crm/queue')}
      className="px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors flex items-center gap-1.5"
      title="CRM work queue — click to open"
    >
      <Zap className="w-3.5 h-3.5" />
      CRM: {stats.pool} in pool · {stats.action} need action
    </button>
  )
}
