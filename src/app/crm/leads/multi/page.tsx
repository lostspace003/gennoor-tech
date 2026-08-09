'use client'

import { Suspense } from 'react'
import MultiLeadView from '@/components/crm/MultiLeadView'

// Multi-lead workspace: /crm/leads/multi?id=…&id=… — a page inside the CRM
// (not a modal, not a new browser tab) holding several leads side by side as
// closable tabs. Closing the last one, or Close all, returns to My leads.
//
// This static segment sits beside the [...id] catch-all; Next.js matches the
// static route first, so a lead can never be shadowed by it.
export default function MultiLeadPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-500">Opening leads…</div>}>
      <MultiLeadView />
    </Suspense>
  )
}
