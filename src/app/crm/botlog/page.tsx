'use client'

import { useCrm } from '@/components/crm/CrmContext'
import BotLogView from '@/components/crm/BotLogView'

export default function BotLogPage() {
  const { isManager, notify } = useCrm()
  return <BotLogView isManager={isManager} notify={notify} />
}
