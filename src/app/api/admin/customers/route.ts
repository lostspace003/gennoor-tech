import { NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { listCustomers, syncCustomersIfDue } from '@/lib/crm/customers-live'

export const dynamic = 'force-dynamic'

/** Everyone who has paid for a course or an AI Weekend, for the CRM's "Paid customers" page. */
export async function GET() {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    await syncCustomersIfDue(true)
    return NextResponse.json({ customers: await listCustomers() })
  } catch (e) {
    console.error('customers failed', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'The paid customers could not be read' }, { status: 500 })
  }
}
