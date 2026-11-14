/**
 * Paid customers, with made-up people. Nothing is read from the real records.
 *   npx tsx scripts/customers-check.ts
 */
import { groupCustomers, markCustomers, CUSTOMER_REASON, type PaidRow } from '../src/lib/crm/customers'
import { sequenceProgress } from '../src/lib/crm/sequence'
import type { Lead } from '../src/lib/crm/types'

const lead = (n: number, over: Record<string, unknown> = {}): Lead => ({ id: `l${n}`, name: `Person ${n}`, email: `person${n}@example.com`, company: `Company ${n}`, owner: '', status: 'new', activities: [], emailHistory: [], ...over } as unknown as Lead)
const rows: PaidRow[] = [
  { email: 'Person1@Example.com', name: 'Person 1', what: 'A course', type: 'Course', amount: 849, currency: 'INR', at: '2026-11-01T10:00:00Z' },
  { email: 'person1@example.com', name: 'Person 1', what: 'AI Weekend 2026-11', type: 'AI Weekend', amount: 499, currency: 'INR', at: '2026-11-10T10:00:00Z' },
  { email: 'other@example.com', name: 'Person 2', what: 'AI Weekend 2026-11', type: 'AI Weekend', amount: 9.99, currency: 'USD', at: '2026-11-12T10:00:00Z' },
  { email: 'stranger@example.com', name: 'Stranger', what: 'A course', type: 'Course', amount: 19.99, currency: 'USD', at: '2026-11-05T10:00:00Z' },
]
const leads = [lead(1), lead(2, { altEmails: ['other@example.com'] }), lead(3), lead(4, { sequence: { sent: [], stopped: { at: 'x', by: 'a@b', reason: 'They asked' } } })]

let bad = 0
const is = (what: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'BAD '} ${what}${ok ? '' : `: got ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`}`)
}

is('leads marked the first time', markCustomers(leads, rows), 2)
is('a lead found by their second address', !!leads[1].customer, true)
is('someone who has not paid is left alone', [leads[2].customer, leads[2].sequence], [undefined, undefined])
is('the series is stopped with the reason', leads[0].sequence?.stopped?.reason, CUSTOMER_REASON)
is('no next email for a customer', sequenceProgress(leads[0]).next, null)
is('nothing changes the second time', markCustomers(leads, rows), 0)
delete leads[0].sequence!.stopped
is('a series started again by hand stays started', [markCustomers(leads, rows), leads[0].sequence?.stopped], [0, undefined])
const list = groupCustomers(rows, leads)
is('one row a person', list.length, 3)
is('newest payment first', list[0].email, 'other@example.com')
const one = list.find((c) => c.email === 'person1@example.com')!
is('two payments added up, whatever the capitals', [one.payments.length, one.inr, one.usd, one.leadId], [2, 1348, 0, 'l1'])
is('a customer who is not a lead', list.find((c) => c.email === 'stranger@example.com')?.leadId, undefined)
console.log(bad ? `${bad} wrong` : 'all right')
process.exit(bad ? 1 : 0)
