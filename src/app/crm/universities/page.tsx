import { redirect } from 'next/navigation'

// The university campaign now lives under Partnerships; this keeps the old address working.
export default function OldUniversitiesPage() {
  redirect('/crm/partnerships/universities')
}
