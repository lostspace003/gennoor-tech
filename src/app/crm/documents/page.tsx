'use client'

import { useCrm } from '@/components/crm/CrmContext'
import { DocumentsView } from '@/components/crm/OtherViews'

export default function DocumentsPage() {
  const { isManager, notify } = useCrm()
  return <DocumentsView canManage={isManager} notify={notify} />
}
