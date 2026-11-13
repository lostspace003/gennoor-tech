/**
 * The rules of the CRM that must not break, checked with made-up leads and made-up mail.
 *
 *   npx tsx scripts/crm-check.ts          must end with ALL OK
 *
 * It reads no store and no mailbox and sends nothing: it runs the pure functions that decide what a reply does
 * to a lead (src/lib/crm/replies.ts), what the Today page lists (src/lib/crm/today.ts) and how many emails may
 * still go this hour. Run it before any pull request that touches src/lib/crm.
 * Every name and address in it is invented.
 */
import { applyReplies, HOURLY_SEND_LIMIT, isAutoReply, kindOf, needsAnswer, ownWords, sendRoom, wantsStop, type Received } from '@/lib/crm/replies'
import { needsYou, QUIET_DAYS, quietDays, todayLists } from '@/lib/crm/today'
import { SEQUENCE } from '@/lib/crm/sequence'
import { newLead, type Lead } from '@/lib/crm/types'

let failed = 0
const ok = (name: string, pass: boolean, detail = '') => { console.log(`${pass ? 'ok  ' : 'FAIL'} ${name}${detail ? `  (${detail})` : ''}`); if (!pass) failed++ }

const NOW = Date.parse('2026-11-13T10:00:00Z')
const ago = (days: number, hours = 0) => new Date(NOW - days * 86_400_000 - hours * 3_600_000).toISOString()
const ME = 'yusufchaudhary@gennoor.com'

/** A lead who has been sent the first `sent` emails of the series, the last one `lastDays` days ago. */
function lead(id: string, o: { status?: Lead['status']; owner?: string; email?: string; sent?: number; lastDays?: number; dumped?: boolean } = {}): Lead {
  const l = newLead({ id, name: `Person ${id}`, company: `Company ${id}`, email: o.email === undefined ? `${id}@example.com` : o.email, owner: o.owner === undefined ? ME : o.owner, status: o.status || 'new' }, ME)
  const n = o.sent || 0
  if (n) {
    l.sequence = { sent: SEQUENCE.slice(0, n).map((s, i) => ({ step: s.id, at: ago((o.lastDays ?? 1) + (n - 1 - i) * 5), by: ME })) }
    l.emailHistory = l.sequence.sent.map((x) => ({ at: x.at, by: ME, to: l.email, subject: 'Series', status: 'sent' as const, step: x.step })).reverse()
    if (l.status === 'new') l.status = 'contacted'
  }
  if (o.dumped) l.dumped = { at: ago(1), by: ME, reason: 'test' }
  l.lastActivity = n ? l.sequence!.sent[n - 1].at : ago(20)
  l.createdAt = ago(30)
  return l
}
const mail = (from: string, subject: string, preview: string, days: number, hours = 0): Received => ({ id: `${from}-${days}-${hours}`, from, subject, preview, receivedAt: ago(days, hours) })

// ---- 1. Reading a reply
const QUOTED = 'Thanks, this looks interesting. Can we talk on Tuesday?\r\n\r\nOn Mon, 9 Nov 2026 at 10:02, Gennoor Tech <sales@gennoor.com> wrote:\r\n> Not useful? Reply with the word stop and I will not write again.'
ok('own words end where the quoted email begins', ownWords(QUOTED) === 'Thanks, this looks interesting. Can we talk on Tuesday?', ownWords(QUOTED))
ok('a real reply that quotes our "stop" line is not a request to stop', !wantsStop({ subject: 'Re: Lessons your team can watch today', preview: QUOTED }))
ok('the same on one flattened line', !wantsStop({ subject: 'Re: Sample courses', preview: 'Sounds good, send me dates. On Mon, 9 Nov 2026 at 10:02 Gennoor Tech wrote: Not useful? Reply with the word stop and I will not write again.' }))
const STOPS: Array<[string, string]> = [['stop', 'stop'], ['Re: Sample courses and our full catalogue', 'STOP'], ['Re: A training programme', 'Stop.\n\nRegards,\nA. Person'], ['Re: Checking in', 'please stop, thanks'], ['Re: x', 'Please unsubscribe me from this list.'], ['Re: x', 'Kindly remove me from your mailing list'], ['Re: x', 'We are not interested. Do not email again.'], ['Re: x', "Don't contact me again"], ['unsubscribe', '']]
ok('every way of asking us to stop is understood', STOPS.every(([subject, preview]) => wantsStop({ subject, preview })), STOPS.filter(([subject, preview]) => !wantsStop({ subject, preview })).map((x) => x[1]).join(' | ') || `${STOPS.length} tried`)
const NOT_STOPS: Array<[string, string]> = [['Re: x', 'Can you stop by our office next week?'], ['Re: x', 'We cannot stop production for training, is it self-paced?'], ['Re: x', 'Interested. Please send the catalogue.'], ['Re: x', 'Who should I contact about pricing?']]
ok('ordinary sentences with "stop" or "contact" in them are not', NOT_STOPS.every(([subject, preview]) => !wantsStop({ subject, preview })), NOT_STOPS.filter(([subject, preview]) => wantsStop({ subject, preview })).map((x) => x[1]).join(' | ') || 'none mistaken')
const AUTOS: Array<[string, string, string]> = [['a@example.com', 'Automatic reply: Lessons your team can watch today', 'I am out of the office until Monday.'], ['mailer-daemon@example.com', 'Undeliverable: Sample courses', 'Delivery has failed'], ['a@example.com', 'Accepted: Gennoor Tech and Company: introduction', ''], ['a@example.com', 'Out of Office', 'Back on the 20th'], ['a@example.com', 'Re: Sample courses', "I'm on leave till 20 November with limited access to email."]]
ok('out of office, delivery failures and meeting answers are automatic', AUTOS.every(([from, subject, preview]) => isAutoReply({ from, subject, preview }) && kindOf({ from, subject, preview }) === 'auto'), AUTOS.filter(([from, subject, preview]) => !isAutoReply({ from, subject, preview })).map((x) => x[1]).join(' | ') || `${AUTOS.length} tried`)
ok('a real reply is a reply', kindOf({ from: 'a@example.com', subject: 'Re: Sample courses', preview: 'Yes, please call me.' }) === 'reply')

// ---- 2. What a reply does to the lead
{
  const a = lead('a', { sent: 3, lastDays: 2 }), b = lead('b', { sent: 9, lastDays: 3 }), c = lead('c', { sent: 2, lastDays: 2 }), d = lead('d', { sent: 2, lastDays: 2 }), e = lead('e', { status: 'lost', sent: 4, lastDays: 20 }), f = lead('f', { sent: 2, lastDays: 2 })
  const leads = [a, b, c, d, e, f]
  const received = [
    mail('a@example.com', 'Re: A training programme built around Company a', 'Interested. Can we talk next week?', 1),
    mail('b@example.com', 'stop', 'stop', 1),
    mail('c@example.com', 'Re: Sample courses', 'Please remove me from this list.', 1),
    mail('d@example.com', 'Automatic reply: Sample courses', 'I am out of the office.', 1),
    mail('e@example.com', 'Re: Checking in', 'Actually, we do have budget now. Call me.', 1),
    mail('stranger@example.com', 'Hello', 'Not a lead', 1),
    mail('f@example.com', 'Re: Sample courses', 'Send me the catalogue please', 1),
  ]
  const changes = applyReplies(leads, received, { 'f@example.com': ago(0, 20) }, new Date(NOW).toISOString())
  ok('a real reply moves Emailing to Talking and waits for an answer', a.status === 'qualified' && needsAnswer(a) && a.reply?.kind === 'reply')
  ok('the ready-made "stop" closes the lead, stops the series and needs no answer', b.status === 'lost' && !!b.sequence?.stopped && !needsAnswer(b))
  ok('"please remove me" stops the series, keeps the step, and is shown to a person', c.status === 'contacted' && !!c.sequence?.stopped && needsAnswer(c) && c.reply?.kind === 'stop')
  ok('an automatic reply changes nothing', d.status === 'contacted' && !d.reply)
  ok('a closed lead who writes back is shown, and stays Closed until a person decides', e.status === 'lost' && needsAnswer(e))
  ok('a reply answered from Outlook counts as answered', f.status === 'qualified' && !needsAnswer(f) && f.reply?.handledBy === 'mailbox')
  ok('each change is reported once', changes.length === 6 && changes.filter((x) => x.what === 'replied').length === 3, changes.map((x) => x.what).join(', '))
  ok('running it again with the same mail changes nothing', applyReplies(leads, received, { 'f@example.com': ago(0, 20) }).length === 0)
  ok('a history line was written for the reply', a.activities[0].description.startsWith('They replied'))

  // Answering clears it; a newer reply brings it back
  a.emailHistory.unshift({ at: ago(0, 2), by: ME, to: a.email, subject: 'Re: yes', status: 'sent' })
  ok('once we write back, the lead no longer waits', !needsAnswer(a))
  applyReplies(leads, [...received, mail('a@example.com', 'Re: yes', 'Tuesday at 3 works.', 0, 1)], {})
  ok('a newer reply puts them back on the list', needsAnswer(a) && a.reply?.preview === 'Tuesday at 3 works.')
  a.reply!.handledAt = ago(0, 0)
  ok('"No reply needed" takes them off again', !needsAnswer(a))
}

// ---- 3. Today's lists
{
  const replied = lead('r', { sent: 2, lastDays: 3 }); replied.reply = { at: ago(1), subject: 'Re: x', preview: 'Yes please', kind: 'reply' }; replied.status = 'qualified'
  const quiet = lead('q', { status: 'qualified', sent: 2, lastDays: 9 })
  const fresh = lead('t', { status: 'proposal', sent: 2, lastDays: 1 })
  const pool = lead('p', { owner: '' })
  const start = lead('s')
  const due = lead('u', { sent: 1, lastDays: 6 })           // email 2 is due after 4 days
  const wait = lead('w', { sent: 1, lastDays: 1 })
  const noEmail = lead('n', { email: '' })
  const done = lead('x', { sent: 9, lastDays: 30 })
  const stopped = lead('y', { sent: 3, lastDays: 10 }); stopped.sequence!.stopped = { at: ago(2), by: ME, reason: 'Now talking by phone' }
  const won = lead('z', { status: 'won', sent: 5, lastDays: 3 })
  const archived = lead('v', { sent: 1, lastDays: 9, dumped: true })
  const other = lead('o', { owner: 'someone@gennoor.com', sent: 1, lastDays: 9 })
  const all = [replied, quiet, fresh, pool, start, due, wait, noEmail, done, stopped, won, archived, other]
  const t = todayLists(all, ME, false, NOW)
  const ids = (list: Lead[]) => list.map((l) => l.id).join(',')
  ok('replies', ids(t.replies) === 'r', ids(t.replies))
  ok('in conversation, quietest first', ids(t.talking) === 'q,t' && quietDays(quiet, NOW) >= QUIET_DAYS, ids(t.talking))
  ok('new leads to pick up', ids(t.pool) === 'p', ids(t.pool))
  ok('to start', ids(t.toStart) === 's', ids(t.toStart))
  ok('due', ids(t.due) === 'u', ids(t.due))
  ok('waiting', ids(t.waiting) === 'w', ids(t.waiting))
  ok('missing an email address', ids(t.noEmail) === 'n', ids(t.noEmail))
  ok('series finished or stopped with no reply', ids(t.finished) === 'x,y', ids(t.finished))
  const listed = [...t.replies, ...t.talking, ...t.pool, ...t.toStart, ...t.due, ...t.waiting, ...t.noEmail, ...t.finished]
  ok('every open lead on this desk is in exactly one list', listed.length === new Set(listed.map((l) => l.id)).size && listed.length === 10, `${listed.length} listed`)
  ok('customers, archived leads and other people\'s leads are in none', !listed.some((l) => ['z', 'v', 'o'].includes(l.id)))
  ok('"need you today" counts replies, quiet conversations and emails to send', needsYou(t, NOW) === 4, String(needsYou(t, NOW)))
  ok('a manager looking at everyone sees the other person\'s lead too', todayLists(all, ME, true, NOW).due.some((l) => l.id === 'o'))
  ok('someone who only has leads in Talking is not told "no leads yet"', todayLists([quiet], ME, false, NOW).talking.length === 1)
}

// ---- 4. The hour's limit
{
  const busy = lead('h')
  busy.emailHistory = Array.from({ length: 58 }, (_, i) => ({ at: new Date(NOW - (i + 1) * 60_000).toISOString(), by: ME, to: 'x@example.com', subject: 's', status: 'sent' as const }))
  const old = lead('k'); old.emailHistory = [{ at: ago(0, 2), by: ME, to: 'x@example.com', subject: 's', status: 'sent' }, { at: new Date(NOW - 60_000).toISOString(), by: ME, to: 'x@example.com', subject: 's', status: 'failed' }]
  ok(`after 58 sends in the hour, ${HOURLY_SEND_LIMIT - 58} may still go`, sendRoom([busy, old], NOW) === HOURLY_SEND_LIMIT - 58, String(sendRoom([busy, old], NOW)))
  ok('emails older than an hour and failed sends are not counted', sendRoom([old], NOW) === HOURLY_SEND_LIMIT)
  busy.emailHistory.push(...Array.from({ length: 10 }, () => ({ at: new Date(NOW - 30_000).toISOString(), by: ME, to: 'x@example.com', subject: 's', status: 'sent' as const })))
  ok('never below nothing', sendRoom([busy], NOW) === 0)
}

console.log(failed ? `\n${failed} CHECK(S) FAILED` : '\nALL OK')
process.exit(failed ? 1 : 0)
