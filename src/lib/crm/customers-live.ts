import { getLeads, mutateLeads } from './store'
import { listPurchases } from '@/lib/lms-access'
import { getRegistrations } from '@/lib/weekend'
import { groupCustomers, markCustomers, type Customer, type PaidRow } from './customers'

/** Every payment on record: courses, and AI Weekend registrations that are paid (a refund is not a payment). */
export async function paidRows(): Promise<PaidRow[]> {
  const [purchases, registrations] = await Promise.all([listPurchases(), getRegistrations()])
  return [
    ...purchases.map((p): PaidRow => ({ email: p.email, name: p.name, what: p.courseTitle, type: 'Course', amount: p.amount, currency: p.currency, at: p.at })),
    ...registrations.filter((r) => r.payment === 'paid').map((r): PaidRow => ({ email: r.email, name: r.name, what: `AI Weekend ${r.cohort}`, type: 'AI Weekend', amount: r.fee, currency: r.currency || 'INR', at: r.paidAt || r.at })),
  ]
}

/** The addresses of everyone who has paid: no promotional email goes to them. */
export async function paidAddresses(): Promise<Set<string>> {
  return new Set((await paidRows()).map((r) => r.email.trim().toLowerCase()).filter(Boolean))
}

export async function listCustomers(): Promise<Customer[]> {
  const [rows, leads] = await Promise.all([paidRows(), getLeads()])
  return groupCustomers(rows, leads)
}

let lookedAt = 0
/** Marks the leads who have paid (see markCustomers). At most once every two minutes; the store is written only when someone new has paid. */
export async function syncCustomersIfDue(force = false): Promise<void> {
  if (!force && Date.now() - lookedAt < 120_000) return
  lookedAt = Date.now()
  try {
    const rows = await paidRows()
    if (!rows.length) return
    // A look without writing first: most times nobody new has paid
    if (!markCustomers(structuredClone(await getLeads()), rows)) return
    await mutateLeads((leads) => markCustomers(leads, rows))
  } catch (e) {
    console.error('customers: could not mark paid leads', e instanceof Error ? e.message : e)
  }
}
