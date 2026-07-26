'use client'

import { useCrm } from '@/components/crm/CrmContext'
import QueueView from '@/components/crm/QueueView'

export default function QueuePage() {
  const { leads } = useCrm()
  return <QueueView leads={leads} />
}
