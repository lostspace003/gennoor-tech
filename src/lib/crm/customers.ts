import type { Lead } from './types'

/**
 * Paid customers: everyone who has paid for a course or for an AI Weekend (owner, 14 November 2026: "if someone
 * has done the payment ... he should be treated separately ... we need not send them all this promotional
 * emails ... their information should also be available in a separate space").
 *
 * Two things follow from a payment:
 *  1. the person is listed on the CRM's "Paid customers" page, with what they bought;
 *  2. the two promotional emails stop for them: the email series and the AI Weekend campaign. Their lead is
 *     marked `customer` and the series is stopped with the reason below, which every send already respects.
 *     The emails that belong to what they bought (payment received, the joining link, the kit) still go.
 *
 * This file is pure, so scripts/customers-check.ts can run it with made-up people. The reading of the real
 * records is in customers-live.ts.
 */

export const CUSTOMER_REASON = 'Paid customer: promotional emails are not sent'

export interface PaidRow { email: string; name: string; what: string; type: 'Course' | 'AI Weekend'; amount: number; currency: 'INR' | 'USD'; at: string }

export interface Customer {
  email: string
  name: string
  payments: PaidRow[]
  /** The first and the latest payment. */
  since: string
  last: string
  inr: number
  usd: number
  /** Their lead in the CRM, when there is one. */
  leadId?: string
  company?: string
  owner?: string
}

const key = (e?: string) => (e || '').trim().toLowerCase()
const addresses = (l: Lead) => [l.email, ...(l.altEmails || [])].map(key).filter(Boolean)

/** One row for each person, newest payment first. */
export function groupCustomers(rows: PaidRow[], leads: Lead[]): Customer[] {
  const byEmail = new Map<string, Customer>()
  for (const r of [...rows].sort((a, b) => a.at.localeCompare(b.at))) {
    const email = key(r.email)
    if (!email) continue
    const c = byEmail.get(email) || { email, name: r.name || email, payments: [], since: r.at, last: r.at, inr: 0, usd: 0 }
    c.payments.push(r)
    c.last = r.at
    if (r.name) c.name = r.name
    if (r.currency === 'USD') c.usd += r.amount; else c.inr += r.amount
    byEmail.set(email, c)
  }
  for (const l of leads) for (const a of addresses(l)) {
    const c = byEmail.get(a)
    if (c && !c.leadId) { c.leadId = l.id; c.company = l.company || ''; c.owner = l.owner || '' }
  }
  return [...byEmail.values()].sort((a, b) => b.last.localeCompare(a.last))
}

/**
 * Marks the leads who have paid, and stops the email series for them. Changes `leads` in place and answers how
 * many were changed. A lead already marked is left alone, so a person who starts the series again by hand for
 * a customer is not overruled the next minute.
 */
export function markCustomers(leads: Lead[], rows: PaidRow[], now = new Date().toISOString()): number {
  const paid = new Map<string, PaidRow[]>()
  for (const r of rows) { const e = key(r.email); if (e) paid.set(e, [...(paid.get(e) || []), r]) }
  let changed = 0
  for (const l of leads) {
    if (l.customer) continue
    const mine = addresses(l).flatMap((a) => paid.get(a) || [])
    if (!mine.length) continue
    l.customer = { since: mine.map((m) => m.at).sort()[0], at: now }
    l.sequence = l.sequence || { sent: [] }
    if (!l.sequence.stopped) l.sequence.stopped = { at: now, by: 'system', reason: CUSTOMER_REASON }
    changed++
  }
  return changed
}
