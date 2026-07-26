'use client'

import { useCrm } from '@/components/crm/CrmContext'
import TeamView from '@/components/crm/TeamView'

export default function TeamPage() {
  const { leads, isManager } = useCrm()
  return <TeamView leads={leads} isManager={isManager} />
}
