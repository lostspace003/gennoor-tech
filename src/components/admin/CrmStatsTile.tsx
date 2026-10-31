'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Zap } from 'lucide-react'

// Compact CRM pulse for the admin header (admin/yusuf see it; the
// API 401s for anyone else and the tile stays hidden).
export default function CrmStatsTile() {
  const router = useRouter()
  const { data: session } = useSession()
  const isManager = ['admin@gennoor.com', 'yusufchaudhary@gennoor.com'].includes(session?.user?.email?.toLowerCase() || '')
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

  if (!stats || !isManager) return null

  return (
    <button
      onClick={() => router.push('/crm/queue')}
      className="px-3.5 py-2 text-[13px] font-medium bg-primary-50 text-primary-700 border border-primary-200 rounded-md hover:bg-primary-100 transition-colors flex items-center gap-1.5"
      title="CRM work queue — click to open"
    >
      <Zap className="w-3.5 h-3.5" />
      CRM: {stats.pool} in pool · {stats.action} need action
    </button>
  )
}
