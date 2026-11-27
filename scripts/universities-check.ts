/**
 * The University Partnership campaign (docs/CRM.md, section 15), checked on the toolkit's own data and on made-up
 * mail. No network, nothing is sent, nothing is saved.
 *   npx tsx scripts/universities-check.ts
 * It ends with ALL OK or says what is wrong.
 */
import { UNIVERSITY_SEED, MASTER_EMAIL } from '../src/data/university-partnership'
import {
  CAMPAIGN_CC, FORM_TOKEN, cleanUniPatch, claudeCardAfter, draftFromMaster, replyOwner, salutation, universityFromSeed, unfilled, waitingForAnswer, whyNotReady, withForm,
  type University,
} from '../src/lib/crm/universities-types'
import { campaignStats, nextStep } from '../src/lib/crm/universities-stats'
import { campaignEmailHtml, CPN_LINE } from '../src/lib/crm/universities-email'

let bad = 0
const is = (what: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'BAD '} ${what}${ok ? '' : `: got ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`}`)
}
const part = (t: string) => console.log(`\n${t}`)
const DAY = 86_400_000
const FORM = 'https://docs.google.com/forms/d/e/made-up/viewform'

part('1. The toolkit is all in')
const all = UNIVERSITY_SEED.map((s) => universityFromSeed(s, MASTER_EMAIL, '2026-11-27T00:00:00.000Z'))
is('27 universities', all.length, 27)
is('55 contacts', all.reduce((n, u) => n + u.contacts.length, 0), 55)
is('15 in the first wave, 12 in the second', [all.filter((u) => u.wave === 1).length, all.filter((u) => u.wave === 2).length], [15, 12])
is('every id is GEN- and three digits', all.every((u) => /^GEN-\d{3}$/.test(u.id)), true)
is('the 15 first emails came from the console', UNIVERSITY_SEED.filter((s) => s.draft).length, 15)

part('2. What is written is true to the owner\'s words (27 November 2026)')
const text = all.map((u) => `${u.draft.subject}\n${u.draft.body}`).join('\n')
is('nobody is called a "Certified Services Partner"', /Certified Services Partner/i.test(text), false)
is('the Claude line is not paraphrased in the words (the card carries it)', /Anthropic Claude Partner Network/i.test(text), false)
is('EY is named only with what Gennoor did for them', all.every((u) => !/\bEY\b/.test(u.draft.body) || /Agentic AI for Power Platform/.test(u.draft.body)), true)
is('Microsoft ANZ and the universities are "my own" work, never "Gennoor"s', /Gennoor (has|have) (delivered|trained) (for )?(Microsoft|King Saud|Taibah|MCIT|Tech Mahindra|Bank of Tanzania)/i.test(text), false)
is('no EY APAC', /APAC/.test(text), false)

part('3. An email is not ready until it is finished')
const first = all.find((u) => u.id === 'GEN-001') as University
is('the form link is needed first', whyNotReady(first, ''), 'The evaluation form\'s link is not set. Paste it under Setup first.')
is('with the link, the first wave email is ready', whyNotReady(first, FORM), '')
is('the link takes the place of its token', withForm(`see ${FORM_TOKEN}`, FORM), `see ${FORM}`)
const wave2 = all.find((u) => u.id === 'GEN-012') as University
is('a second-wave email still has the sentence about THEIR work to write', unfilled(wave2.draft.body).some((s) => /Insert 1-sentence/.test(s)), true)
is('so it will not go', whyNotReady(wave2, FORM).startsWith('Still to write'), true)
is('the master\'s own form placeholder is the token', wave2.draft.body.includes(FORM_TOKEN), true)
is('nothing else of the master is left in brackets but the one sentence', unfilled(wave2.draft.body).length, 1)
is('a name: Prof. Ashraf Darwish', salutation('Prof. Ashraf Darwish'), 'Prof. Darwish')
is('a name: Eng. Dr. Julius Butime', salutation('Eng. Dr. Julius Butime'), 'Eng. Dr. Butime')
is('a name with no title: first name', salutation('Cheryl Middleton'), 'Cheryl')
is('the copy to Jalal and Yusuf is added when sending, not stored on the email', all.every((u) => u.draft.cc.every((e) => !CAMPAIGN_CC.includes(e))), true)

part('4. The Claude Partner Network card sits where Claude is first named')
const html = campaignEmailHtml(withForm(first.draft.body, FORM), { name: 'Jalal Khan', email: 'jalalkhan@gennoor.com' })
is('the approved line is in the email, word for word', html.includes(CPN_LINE), true)
is('the badge is the one the site uses', html.includes('/email/cpn-certified-horizontal.png'), true)
is('the card is on the cream ground', html.includes('#f0eee6'), true)
is('the card comes once', html.split(CPN_LINE).length - 1, 1)
is('no Claude in the words, no card', claudeCardAfter('Dear Dr. X,\n\nHello.'), -1)

part('5. What a person may change')
is('an unknown field is dropped', cleanUniPatch({ notes: 'a', emails: [], id: 'GEN-099', replies: [] }), { ok: true, patch: { notes: 'a' } })
is('a stage that does not exist is refused', cleanUniPatch({ stage: 'won' }).ok, false)
is('an address with a line break is refused', cleanUniPatch({ draft: { subject: 's', body: 'b', to: ['a@x.edu\nbcc: b@y.com'], cc: [] } }).ok, false)
is('a list of eleven recipients is refused', cleanUniPatch({ draft: { subject: 's', body: 'b', to: Array.from({ length: 11 }, (_, i) => `a${i}@x.edu`), cc: [] } }).ok, false)
is('a subject is one line', (cleanUniPatch({ draft: { subject: 'one\ntwo', body: 'b', to: ['a@x.edu'], cc: [] } }) as any).patch.draft.subject, 'one two')
is('a course that is not on the list is dropped', (cleanUniPatch({ evaluation: { courses: ['ai-103', 'rm -rf'], reps: [], requestedAt: '', grantedAt: '' } }) as any).patch.evaluation.courses, ['ai-103'])
is('three representatives are refused', cleanUniPatch({ evaluation: { courses: [], reps: [{ email: 'a@x.edu' }, { email: 'b@x.edu' }, { email: 'c@x.edu' }], requestedAt: '', grantedAt: '' } }).ok, false)
is('a date must be a date', cleanUniPatch({ callOn: 'next week' }).ok, false)

part('6. A reply finds its university')
const sent = (u: University, at: string): University => ({ ...u, stage: 'emailed', emails: [{ at, by: 'a@gennoor.com', to: u.draft.to.join(', '), subject: 's', status: 'sent', kind: 'first', confirmedAt: at }] })
const t0 = '2026-11-20T10:00:00.000Z'
const psu = sent(all.find((u) => u.id === 'GEN-001') as University, t0)
const bennett = sent(all.find((u) => u.id === 'GEN-006') as University, t0)
const world = [psu, bennett, all.find((u) => u.id === 'GEN-002') as University]
is('the dean writes back', replyOwner({ from: 'OCCIS@psu.edu.sa', subject: 'Re: Expanding', receivedAt: '2026-11-21T08:00:00Z' }, world)?.id, 'GEN-001')
is('a colleague from the same university', replyOwner({ from: 'someone.else@psu.edu.sa', subject: 'Hello', receivedAt: '2026-11-21T08:00:00Z' }, world)?.id, 'GEN-001')
is('mail from before our email belongs to nobody', replyOwner({ from: 'occis@psu.edu.sa', subject: 'Old', receivedAt: '2026-11-01T08:00:00Z' }, world), null)
is('an out of office is not a reply', replyOwner({ from: 'occis@psu.edu.sa', subject: 'Automatic reply: away', receivedAt: '2026-11-21T08:00:00Z' }, world), null)
is('a university we have not emailed owns nothing yet', replyOwner({ from: 'ced@ud.ac.ae', subject: 'Hi', receivedAt: '2026-11-21T08:00:00Z' }, world), null)
is('a stranger is nobody', replyOwner({ from: 'x@elsewhere.example', subject: 'Hi', receivedAt: '2026-11-21T08:00:00Z' }, world), null)
const gmailUni = { ...psu, contacts: [{ ...psu.contacts[0], email: 'dean@gmail.com' }], draft: { ...psu.draft, to: ['dean@gmail.com'] } }
is('a free webmail domain is never enough by itself', replyOwner({ from: 'someone.else@gmail.com', subject: 'Hi', receivedAt: '2026-11-21T08:00:00Z' }, [gmailUni]), null)

part('7. What to do next, and how the whole campaign is moving')
const now = Date.parse('2026-11-30T12:00:00Z')
is('a new university with a finished email: send it', nextStep(first, FORM, now)?.text, 'Read the email and send it.')
is('emailed ten days ago, no answer: write again, and it is urgent', [nextStep(psu, FORM, now)?.urgent, /No answer after 10 days/.test(nextStep(psu, FORM, now)?.text || '')], [true, true])
const replied: University = { ...psu, stage: 'replied', replies: [{ id: 'm1', at: '2026-11-22T09:00:00Z', from: 'occis@psu.edu.sa', fromName: 'CCIS', subject: 'Re', preview: 'Yes' }] }
is('they wrote and nobody has answered', waitingForAnswer(replied), true)
is('then the answer comes first', nextStep(replied, FORM, now)?.tab, 'email')
const evaluating: University = { ...bennett, stage: 'evaluating', evaluation: { courses: ['ai-103'], reps: [], requestedAt: '2026-11-22', grantedAt: '2026-11-23' } }
is('access given a week ago: ask for the call', /Ask for a 20-minute debrief call/.test(nextStep(evaluating, FORM, now)?.text || ''), true)
const partner: University = { ...first, stage: 'partner' }
is('a partner needs nothing from us', nextStep(partner, FORM, now), null)
const stats = campaignStats([{ ...replied, replies: [{ ...replied.replies[0], handled: true }] }, evaluating, partner, ...all.filter((u) => !['GEN-001', 'GEN-006', 'GEN-014'].includes(u.id))].slice(0, 27), FORM, now)
is('the stages add up to the universities', Object.values(stats.stages).reduce((n, c) => n + c, 0), stats.total)
is('the funnel never grows going down', stats.funnel.every((f, i) => i === 0 || f.count <= stats.funnel[i - 1].count + 1), true)
is('two emails went: the funnel and the count agree', [stats.emailsSent, stats.funnel[1].count >= 1], [2, true])
is('median days to a first reply, from 20 November to 22 November', stats.medianReplyDays, 2)
is('a day for each of the last 14 days', stats.perDay.length, 14)
is('the days run up to today', stats.perDay[13].day, '2026-11-30')
is('the reply rate is a share of those emailed', stats.replyRate, Math.round((stats.replied / stats.funnel[1].count) * 100))
is('the courses chosen are counted', stats.coursesChosen, [{ id: 'ai-103', title: 'AI-103: Build and Ship AI Agents on Microsoft Azure', count: 1 }])
is('the regions add up to the universities', stats.byRegion.reduce((n, r) => n + r.total, 0), stats.total)
is('the waves add up to the universities', stats.byWave.reduce((n, r) => n + r.total, 0), stats.total)

part('8. A first email from the master')
const made = draftFromMaster({ name: 'Made Up University (MUU)', department: 'School of Computing', decisionMaker: 'Dr. Ada Example', officialEmail: '', contacts: [{ id: 'x', name: 'Dr. Ada Example', designation: 'Dean', email: 'ada@muu.example', emailNote: '', status: '', linkedin: '', phone: '', department: '', source: '', notes: '', order: 'Primary' }] }, MASTER_EMAIL)
is('the name and the university are put in', [made.body.startsWith('Dear Dr. Example,'), made.body.includes("Made Up University's branding"), made.body.includes('School of Computing')], [true, true, true])
is('it goes to the primary contact', made.to, ['ada@muu.example'])
void DAY

console.log(bad ? `\n${bad} WRONG` : '\nALL OK')
process.exit(bad ? 1 : 0)
