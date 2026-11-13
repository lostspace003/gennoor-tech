/**
 * What would the reply check do right now? Reads the real mailboxes and the real leads, and changes NOTHING.
 *
 *   npx tsx --env-file=.env.local scripts/crm-replies-preview.ts
 *
 * It asks Microsoft for the recent mail exactly as the CRM does (src/lib/crm/graph.ts), runs the rules on a COPY
 * of the leads (src/lib/crm/replies.ts) and prints counts only: no name, no address, no word of any message.
 * Use it to see that the mailboxes can be read, and what the next real run would change, before or after a
 * change to the reply rules.
 */
import { getLeads } from '@/lib/crm/store'
import { graphConfigured, listRecentReceived, listRecentSentTo } from '@/lib/crm/graph'
import { applyReplies, kindOf, needsAnswer } from '@/lib/crm/replies'
import { todayLists } from '@/lib/crm/today'

async function main() {
  if (!graphConfigured()) { console.log('Reading mail is not set up in this environment (the three MS_GRAPH settings).'); process.exit(1) }
  const leads = await getLeads()
  const addresses = new Set<string>()
  for (const l of leads) for (const a of [l.email, ...(l.altEmails || [])]) if (a) addresses.add(a.trim().toLowerCase())
  console.log(`${leads.length} leads, ${addresses.size} addresses on file; ${leads.filter((l) => l.reply).length} leads already carry a reply record`)

  const started = Date.now()
  const mail = await listRecentReceived()
  const received = mail.messages
  console.log(`inboxes read in ${Math.round((Date.now() - started) / 100) / 10} s: ${received.length} messages from outside in the last 45 days${mail.unread ? `; ${mail.unread} mailbox(es) could NOT be read this time` : ''}`)
  const fromLeads = received.filter((m) => addresses.has(m.from))
  const kinds = { reply: 0, stop: 0, auto: 0 }
  for (const m of fromLeads) kinds[kindOf(m)]++
  console.log(`from leads: ${fromLeads.length} (${kinds.reply} real replies, ${kinds.stop} asking to stop, ${kinds.auto} automatic), from ${new Set(fromLeads.map((m) => m.from)).size} different leads`)
  const newest = fromLeads[0]?.receivedAt, oldest = fromLeads[fromLeads.length - 1]?.receivedAt
  if (newest) console.log(`newest ${newest.slice(0, 10)}, oldest ${oldest?.slice(0, 10)}`)

  const sent = await listRecentSentTo()
  console.log(`sent items read: ${Object.keys(sent).length} outside addresses written to in 45 days, ${Object.keys(sent).filter((a) => addresses.has(a)).length} of them leads`)

  const copy = structuredClone(leads)
  const changes = applyReplies(copy, fromLeads, sent)
  const count = (what: string) => changes.filter((c) => c.what === what).length
  console.log(`\na run now would: note a reply on ${count('replied')} leads, stop the series for ${count('stopped')}, close ${count('closed')} (the ready-made "Not for us"), mark ${count('answered')} as already answered from a mailbox`)
  const before = (s: string) => leads.filter((l) => !l.dumped && l.status === s).length
  const after = (s: string) => copy.filter((l) => !l.dumped && l.status === s).length
  console.log(`steps before -> after: New ${before('new')} -> ${after('new')}, Emailing ${before('contacted')} -> ${after('contacted')}, Talking ${before('qualified')} -> ${after('qualified')}, Proposal ${before('proposal')} -> ${after('proposal')}, Customer ${before('won')} -> ${after('won')}, Closed ${before('lost')} -> ${after('lost')}`)
  console.log(`waiting for an answer afterwards: ${copy.filter((l) => needsAnswer(l)).length} leads`)
  const t = todayLists(copy, '', true)
  console.log(`Today (everyone) afterwards: replies ${t.replies.length}, in conversation ${t.talking.length}, to pick up ${t.pool.length}, to start ${t.toStart.length}, due ${t.due.length}, no address ${t.noEmail.length}, series finished ${t.finished.length}, waiting ${t.waiting.length}`)
  console.log(`a second run on the result would change ${applyReplies(copy, fromLeads, sent).length} (must be 0)`)
  console.log('\nnothing was written')
}
main().catch((e) => { console.error(`could not read: ${String(e?.message || e).slice(0, 300)}`); process.exit(1) })
