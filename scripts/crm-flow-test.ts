// Checks for the CRM's lead flow: the email series, the lead sheet, and the
// clean-up of older stored leads.
//
//   npx tsx scripts/crm-flow-test.ts
//   npx tsx scripts/crm-flow-test.ts --out <folder>   also writes each email as an .html file to look at
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { newLead, normalizeLead, LEAD_STEPS } from '../src/lib/crm/types'
import { SEQUENCE, SEQUENCE_DAYS, sequenceProgress, isOpen, fillTokens, LINKEDIN_CONNECT_NOTE } from '../src/lib/crm/sequence'
import { buildStepEmail } from '../src/lib/crm/sequence-emails'
import { mapHeaders, rowToLead, LEAD_COLUMNS } from '../src/lib/crm/import'
import { CRM_USERS, CRM_MANAGERS } from '../src/lib/crm/users'
import { teamMember } from '../src/lib/crm/team'
import { WEEKEND_EMAILS, buildWeekendEmail, buildPaidEmail } from '../src/lib/weekend-emails'
import { hmacHex, validPaymentSignature, validWebhookSignature } from '../src/lib/razorpay'
import { previewIds, isPreview, PREVIEW_MAX, DEFAULT_PRICE, formatUsd, formatInr } from '../src/lib/lms-access'
import { WEEKEND, nextCohort, cohortById, weekendFee, closedNote } from '../src/data/ai-weekend'

let pass = 0, fail = 0
const ok = (c: boolean, n: string) => { c ? pass++ : (fail++, console.log('  FAIL:', n)); if (c) console.log('  ok  :', n) }
const DAY = 86_400_000

// ---- People
ok(!CRM_USERS.some((u) => /aditya|zaid|deepanshu/.test(u)), 'Aditya, Zaid and Deepanshu no longer have access')
ok(CRM_MANAGERS.every((m) => CRM_USERS.includes(m)), 'every manager is also a user')

// ---- The series as a plan
ok(SEQUENCE[0].gapDays === 0, 'the first email is due at once')
ok(new Set(SEQUENCE.map((s) => s.id)).size === SEQUENCE.length, 'step ids are unique')
ok(SEQUENCE_DAYS >= 90 && SEQUENCE_DAYS <= 125, `the series runs three to four months (${SEQUENCE_DAYS} days)`)
ok(SEQUENCE.slice(0, 3).reduce((n, s) => n + s.gapDays, 0) <= 14, 'the first three emails go out within two weeks')

// ---- Progress through the series
const lead = newLead({ name: 'Priya Sharma', company: 'Acme Industries', email: 'priya@example.com' }, 'tester@gennoor.com')
const now = Date.parse('2026-11-12T06:00:00Z')
let p = sequenceProgress(lead, now)
ok(p.next?.id === 'intro' && p.due, 'a new lead is ready for email 1')

lead.sequence = { sent: [{ step: 'intro', at: new Date(now).toISOString(), by: 'tester@gennoor.com' }] }
p = sequenceProgress(lead, now + DAY)
ok(p.next?.id === 'samples' && !p.due && p.daysUntil === 3, 'email 2 is not due the day after email 1 (3 days to go)')
p = sequenceProgress(lead, now + 4 * DAY)
ok(p.due, 'email 2 is due four days after email 1')

lead.sequence.stopped = { at: new Date(now).toISOString(), by: 'tester@gennoor.com', reason: 'asked us to stop' }
p = sequenceProgress(lead, now + 30 * DAY)
ok(p.stopped && p.next === null && !p.due, 'a stopped series never becomes due')

const done = newLead({ name: 'Done Lead', email: 'd@example.com' }, 'tester@gennoor.com')
done.sequence = { sent: SEQUENCE.map((s) => ({ step: s.id, at: new Date(now).toISOString(), by: 'tester@gennoor.com' })) }
ok(sequenceProgress(done, now + 400 * DAY).finished, 'after the last email the series is finished')

// ---- Older stored leads
const old: any = newLead({ name: 'Old Lead' }, 'x@gennoor.com')
old.status = 'negotiation'; old.owner = 'zaid@gennoor.com'; old.processStatus = 'paused'
normalizeLead(old, CRM_USERS)
ok(old.status === 'proposal', "'negotiation' folds into Proposal")
ok(old.owner === '', 'a lead held by someone without access returns to unassigned')
ok(!!old.dumped && old.processStatus === 'active', 'a paused lead becomes archived (restorable)')
ok(!isOpen(old), 'an archived lead is not in play')
ok(LEAD_STEPS.length === 6, 'there are six steps, on one axis')

// ---- The lead sheet
const headers = ['Full Name', 'E-mail', 'Company', 'Job Title', 'Mobile', 'Country', 'Favourite colour']
const map = mapHeaders(headers)
ok(map.Name === 'Full Name' && map.Email === 'E-mail' && map.Organization === 'Company' && map.Designation === 'Job Title' && map.Phone === 'Mobile', 'common heading names are recognised')
const row = rowToLead({ 'Full Name': ' Asha Rao ', 'E-mail': 'ASHA@Example.com', Company: 'Rao & Co', 'Job Title': 'NA', Mobile: '', Country: 'India', 'Favourite colour': 'blue' }, map)
ok(row?.name === 'Asha Rao' && row.email === 'asha@example.com' && row.company === 'Rao & Co', 'a row becomes a lead, email lower-cased')
ok(!row?.designation && !('Favourite colour' in (row as object)), '"NA" counts as blank and unknown columns are ignored')
ok(rowToLead({ 'Full Name': '', 'E-mail': 'x@example.com' }, map) === null, 'a row without a name is skipped')
ok(rowToLead({ 'First Name': 'Sam', 'Last Name': 'Lee' }, mapHeaders(['First Name', 'Last Name']))?.name === 'Sam Lee', 'first name + last name columns are joined')
ok(LEAD_COLUMNS.length === 8 && LEAD_COLUMNS[0] === 'Name', 'the sheet has eight columns, Name first')

// ---- The emails
const signer = teamMember('yusufchaudhary@gennoor.com')
const outIdx = process.argv.indexOf('--out')
const outDir = outIdx > -1 ? process.argv[outIdx + 1] : ''
if (outDir) mkdirSync(outDir, { recursive: true })

for (const [i, step] of SEQUENCE.entries()) {
  const mail = buildStepEmail(step.id, lead, signer)
  const html = mail.html
  const bodyText = html.replace(/<[^>]+>/g, ' ')
  const label = `email ${i + 1} (${step.id})`
  ok(!/\{firstName\}|\{company\}|undefined|\[object/.test(mail.subject + html), `${label}: no unfilled placeholders`)
  ok(html.includes('Priya') || mail.subject.includes('Priya') || html.includes('Acme Industries'), `${label}: is addressed to the lead`)
  ok(!/₹|\bINR\b|\bUSD\b|\$\s?\d|\bRs\.?\s?\d/.test(bodyText), `${label}: quotes no price`)
  ok(!/Anthropic partner|certified by Anthropic|Anthropic-certified|official partner|leading|world-class|cutting-edge/i.test(bodyText), `${label}: no banned partner or hype wording`)
  ok(/reply with the word stop/i.test(bodyText), `${label}: tells the reader how to stop the emails`)
  ok((html.match(/href="https:\/\/www\.gennoor\.com\/[^"]*"|href="https:\/\/claude\.com\/partners"/g) || []).length >= 1, `${label}: has a link to act on`)
  ok(mail.text.length > 80 && !/<[a-z]/i.test(mail.text), `${label}: has a plain-text version`)
  ok(html.includes('Yusuf Chaudhary'), `${label}: is signed by the sender`)
  if (outDir) writeFileSync(path.join(outDir, `${String(i + 1).padStart(2, '0')}-${step.id}.html`), `<!doctype html><meta charset="utf-8"><title>${mail.subject}</title>${html}`)
}

const claude = buildStepEmail('claude', lead, signer).html
ok(claude.includes('Gennoor is Certified in the Claude Partner Network.'), 'the Claude email carries the approved partner line, word for word')
ok(claude.includes('cpn-certified-horizontal.png') && claude.includes('https://claude.com/partners'), 'the badge is the PNG and links to claude.com/partners')

const noted = buildStepEmail('intro', lead, signer, 'Good to meet you <b>at the summit</b>.')
ok(noted.html.includes('Good to meet you &lt;b&gt;at the summit&lt;/b&gt;.'), 'a personal note is shown and cannot inject HTML')
const hostile = buildStepEmail('custom', { name: '<script>x</script> Bob', company: '<img src=x>' }, signer).html
ok(!hostile.includes('<script>') && !hostile.includes('<img src=x>'), 'a lead name or organization cannot inject HTML')
// The rule since 13 November 2026 (src/lib/crm/greeting.ts): a lead with no clear name is written to without one.
// Never a stand-in such as "there", and no comma left hanging where the name or the company would have been.
const nameless = buildStepEmail('intro', { name: '', company: '' }, signer)
ok(nameless.text.trimStart().startsWith('Hello,') && !/Hello there/i.test(nameless.html) && nameless.subject === 'Lessons your team can watch today', 'a lead with no name is greeted sensibly')

ok(fillTokens(LINKEDIN_CONNECT_NOTE, lead).length <= 300, 'the LinkedIn connection note fits the 300-character limit')

// ---- The AI Weekend: its dates and its own emails
const nov = nextCohort(new Date('2026-11-12T06:00:00Z'))
ok(nov.saturday === '2026-11-28' && nov.sunday === '2026-11-29', 'the November 2026 weekend is the 28th and 29th')
ok(nextCohort(new Date('2026-11-27T04:29:00Z')).id === '2026-11' && nextCohort(new Date('2026-11-27T04:30:00Z')).id === '2026-12', 'registration closes one day before: from Friday 10:00 India time the page is on the next month')
ok(cohortById('2027-01')?.saturday === '2027-01-30', 'the last weekend is found in any month (January 2027: 30th and 31st)')
ok(closedNote(new Date('2026-11-27T04:00:00Z')) === '' && closedNote(new Date('2026-11-30T03:00:00Z')) === '', 'no note before registration closes, nor after the weekend is over')
ok(/28 and 29 November 2026\) has closed/.test(closedNote(new Date('2026-11-27T06:00:00Z'))) && /next one: 26 and 27 December 2026/.test(closedNote(new Date('2026-11-28T08:00:00Z'))), 'on the closed days the visitor is told this month is closed and the seat is for the next weekend', closedNote(new Date('2026-11-27T06:00:00Z')))
ok(WEEKEND.fee === 499 && WEEKEND.regularFee === 1999, 'the fee is 499 against a regular 1,999')
for (const [i, info] of WEEKEND_EMAILS.entries()) {
  const mail = buildWeekendEmail(info.kind, { name: 'Priya <b>Sharma</b>' }, nov, { joinUrl: 'https://teams.example/join', payment: 'Pay by UPI to gennoor@upi\n<script>x</script>', kitUrl: 'https://example.com/kit' })
  const text = mail.html.replace(/<[^>]+>/g, ' ')
  ok(text.includes('28 and 29 November 2026') || info.kind === 'kit', `weekend email "${info.kind}": carries the dates`)
  ok(!mail.html.includes('<script>') && !/undefined|\[object/.test(mail.subject + mail.html), `weekend email "${info.kind}": safe and complete`)
  if (outDir) writeFileSync(path.join(outDir, `weekend-${i + 1}-${info.kind}.html`), `<!doctype html><meta charset="utf-8"><title>${mail.subject}</title>${mail.html}`)
}
ok(buildWeekendEmail('join', {}, nov, { joinUrl: 'https://teams.example/join' }).html.includes('href="https://teams.example/join"'), 'the joining email links to the saved Teams link')
ok(WEEKEND.feeUsd === 9.99 && weekendFee(false).currency === 'USD' && weekendFee(true).fee === 499, 'outside India the fee is 9.99 dollars; in India 499 rupees')
ok(!/[₹$]\s?\d/.test(buildWeekendEmail('invite', {}, nov).html), 'the invitation names no amount (it goes to people in India and abroad)')
ok(buildWeekendEmail('payment', { name: 'A', fee: 9.99, currency: 'USD' }, nov, {}, undefined, 'https://x.example/pay').html.includes('$9.99') && !buildWeekendEmail('payment', { name: 'A', fee: 9.99, currency: 'USD' }, nov, {}, undefined, 'https://x.example/pay').html.includes('₹'), 'someone abroad is asked for dollars only')
ok(buildWeekendEmail('payment', { name: 'A', fee: 499, currency: 'INR' }, nov, {}, undefined, 'https://x.example/pay').html.includes('₹499') && !/\$\d/.test(buildWeekendEmail('payment', { name: 'A', fee: 499 }, nov, {}, undefined, 'https://x.example/pay').html), 'someone in India is asked for rupees only')

// ---- Online payment: only a correctly signed payment or webhook is believed
const secret = 'test_secret_123'
const goodSig = hmacHex(secret, 'order_ABC|pay_XYZ')
ok(validPaymentSignature('order_ABC', 'pay_XYZ', goodSig, secret), 'a payment with the right signature is accepted')
ok(!validPaymentSignature('order_ABC', 'pay_OTHER', goodSig, secret), 'the same signature on a different payment is refused')
ok(!validPaymentSignature('order_OTHER', 'pay_XYZ', goodSig, secret), 'the same signature on a different order is refused')
ok(!validPaymentSignature('order_ABC', 'pay_XYZ', goodSig, 'wrong_secret'), 'a signature made with another secret is refused')
ok(!validPaymentSignature('order_ABC', 'pay_XYZ', '', secret) && !validPaymentSignature('order_ABC', 'pay_XYZ', goodSig, ''), 'a missing signature or a missing secret is refused')
const hook = JSON.stringify({ event: 'payment.captured', payload: { payment: { entity: { id: 'pay_XYZ', order_id: 'order_ABC' } } } })
ok(validWebhookSignature(hook, hmacHex('whsec', hook), 'whsec'), 'a webhook signed by Razorpay is accepted')
ok(!validWebhookSignature(hook + ' ', hmacHex('whsec', hook), 'whsec'), 'a webhook whose body was altered is refused')
ok(!validWebhookSignature(hook, hmacHex('whsec', hook), ''), 'webhooks are refused when no webhook secret is set')
const withLink = buildWeekendEmail('payment', { name: 'Priya' }, nov, {}, 'webinar@gennoor.com', 'https://www.gennoor.com/ai-weekend?pay=WK-1&t=abc')
ok(withLink.html.includes('Pay ₹499 now') && withLink.html.includes('pay=WK-1'), 'the payment email carries the person\'s own Pay now link when online payment is on')
ok(buildPaidEmail({ name: 'Priya', fee: 499 }, nov, 'pay_XYZ').html.includes('pay_XYZ'), 'the receipt shows the payment reference')

// ---- Course previews: a few lessons open to everyone, never more than six
const lesson = (id: string, preview: boolean) => ({ id, type: 'lecture' as const, kind: 'lecture', title: id, description: '', preview, video: '', caption: null, resources: [] })
const quiz = (id: string) => ({ id, type: 'quiz' as const, title: id, description: '', questionCount: 5, passPercent: 70 })
const courseOf = (items: any[]) => ({ sections: [{ title: 'One', items }] }) as any
ok(previewIds(courseOf([lesson('a', true), lesson('b', false), lesson('c', true)])).join() === 'a,c', 'the lessons marked as previews are the previews')
ok(previewIds(courseOf(Array.from({ length: 10 }, (_, i) => lesson(`l${i}`, true)))).length === PREVIEW_MAX && PREVIEW_MAX === 6, 'a course that marks too many still gets only six previews')
const unmarked = { slug: 'demo-course', sections: [{ title: 'One', items: [quiz('q'), ...Array.from({ length: 40 }, (_, i) => lesson(`l${i}`, false))] }] } as any
const drawn = previewIds(unmarked)
ok(drawn.length === 6 && drawn[0] === 'l0' && !drawn.includes('q'), 'a course that marks none gets six previews: its first lesson and five drawn from the rest, never a quiz')
ok(previewIds(unmarked).join() === drawn.join(), 'the six are the same every time, so reloading cannot reveal other lessons')
ok(previewIds({ ...unmarked, slug: 'another-course' }).join() !== drawn.join(), 'a different course draws a different six')
ok(drawn.some((id) => Number(id.slice(1)) > 10), 'the draw reaches beyond the first few lessons')
ok(previewIds(courseOf([lesson('a', false), lesson('b', false)])).join() === 'a,b', 'a course with six lessons or fewer shows them all as previews')
ok(isPreview(courseOf([lesson('a', true), lesson('b', false)]), 'a') && !isPreview(courseOf([lesson('a', true), lesson('b', false)]), 'b'), 'a lesson outside the previews is not open')
ok(DEFAULT_PRICE.usd === 19.99 && DEFAULT_PRICE.inr === 849, 'the standard course price is 19.99 dollars, or 849 rupees in India')
ok(formatUsd(9.99) === '$9.99' && formatInr(849) === '₹849', 'prices are written the usual way')

console.log(`\n${pass} passed, ${fail} failed`)
if (outDir) console.log(`Emails written to ${outDir}`)
process.exit(fail ? 1 : 0)
