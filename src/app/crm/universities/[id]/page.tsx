import { redirect } from 'next/navigation'
import { entryPath } from '@/data/partnership-campaigns'

export default async function OldUniversityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  redirect(/^[A-Z]{3}-\d{3}$/.test(id) ? entryPath(id) : '/crm/partnerships/universities')
}
