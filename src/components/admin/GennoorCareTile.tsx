'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MessageCircle } from 'lucide-react'

// Compact GennoorCare usage pill for the admin header — managers only
// (the API 403s for others and the tile stays hidden).
export default function GennoorCareTile() {
  const router = useRouter()
  const [stats, setStats] = useState<{ total: number; leads: number } | null>(null)

  useEffect(() => {
    fetch('/api/admin/bot-insights?days=7')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) setStats({ total: d.total, leads: d.leads }) })
      .catch(() => {})
  }, [])

  if (!stats) return null

  return (
    <button
      onClick={() => router.push('/crm/botlog')}
      className="px-3 py-1.5 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-md hover:bg-green-100 transition-colors flex items-center gap-1.5"
      title="GennoorCare website bot — last 7 days. Click for conversations & weekly report."
    >
      <MessageCircle className="w-3.5 h-3.5" />
      GennoorCare: {stats.total} chats · {stats.leads} leads
    </button>
  )
}
