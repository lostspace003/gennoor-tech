import { getLeads, mutateLeads } from './store'
import { graphConfigured, listOwnCopies } from './graph'
import { applyDelivery, COPY_EARLY_MS, matchCopies, pendingSends, type DeliveryChange, type Finding } from './delivery'
import { emailSendState } from '@/lib/email-service'

/**
 * Turns "on its way" into "sent" (or "failed"). Server only; the rules are in ./delivery.ts.
 *
 * The CRM hands an email to the email service and the service answers "taken". Usually it has finished within
 * two seconds; when Microsoft's mail is slow (13 November 2026) it has not, and for hours nobody could tell
 * whether an email had gone. This looks for proof, in two places:
 *
 *  1. Our own copy. Every outreach email is copied to the admin mailbox. When the copy has arrived, the email
 *     has left the service, the lead's copy with it. Reading the mailbox costs nothing and is tried first.
 *  2. The email service itself, for an email it gave a number to: "finished", "failed" or "still in the queue".
 *     Azure allows the whole site about 200 questions an hour, and each send already uses up to two, so this
 *     asks a few at a time and goes round all the waiting emails (MAX_ASKS every ASK_GAP_MS: about 36 an hour).
 *
 * It runs with the reply check (./reply-sync.ts): from the heartbeat every 15 minutes, and every three minutes
 * while someone has the CRM open. It reads the store once, and writes only when something was learned.
 */

const ASK_GAP_MS = 10 * 60_000
const MAX_ASKS = 6
let lastAskRound = 0
/** When each email was last asked about, so the questions go round all of them. Lives as long as the server does. */
const askedAt = new Map<string, number>()

const keyOf = (p: { leadId: string; at: string }) => `${p.leadId}|${p.at}`

/** Looks for proof for every email still waiting, and writes what it learns. Says what changed. */
export async function confirmSends(): Promise<DeliveryChange[]> {
  const pending = pendingSends(await getLeads())
  if (!pending.length) return []
  const findings: Finding[] = []

  if (graphConfigured()) {
    try {
      const oldest = pending.reduce((a, p) => (p.at < a ? p.at : a), pending[0].at)
      findings.push(...matchCopies(pending, await listOwnCopies(new Date(Date.parse(oldest) - COPY_EARLY_MS).toISOString())))
    } catch (e: any) {
      // Microsoft answering slowly is not news here: the next look tries again
      console.error(`Copy check failed: ${String(e?.message || e).slice(0, 140)}`)
    }
  }

  const found = new Set(findings.map(keyOf))
  const toAsk = pending
    .filter((p) => p.op && !found.has(keyOf(p)))
    .sort((a, b) => (askedAt.get(keyOf(a)) || 0) - (askedAt.get(keyOf(b)) || 0) || a.at.localeCompare(b.at))
  if (toAsk.length && Date.now() - lastAskRound >= ASK_GAP_MS) {
    lastAskRound = Date.now()
    for (const p of toAsk.slice(0, MAX_ASKS)) {
      askedAt.set(keyOf(p), Date.now())
      const answer = await emailSendState(p.op!)
      if (answer.state === 'sent') findings.push({ leadId: p.leadId, at: p.at, confirmedAt: new Date().toISOString(), by: 'service' })
      else if (answer.state === 'failed') findings.push({ leadId: p.leadId, at: p.at, failed: answer.error || 'the email service could not send it' })
    }
    if (askedAt.size > 2000) askedAt.clear()
  }

  if (!findings.length) return []
  return mutateLeads((stored) => applyDelivery(stored, findings))
}
