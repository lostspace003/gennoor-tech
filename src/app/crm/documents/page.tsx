'use client'

import { useCrm } from '@/components/crm/CrmContext'
import { DocumentsView } from '@/components/crm/OtherViews'

export default function DocumentsPage() {
  const { isManager, notify } = useCrm()
  // Full height so the filter rail and the list scroll independently
  return (
    <div className="h-full">
      <DocumentsView canManage={isManager} notify={notify} />
    </div>
  )
}
