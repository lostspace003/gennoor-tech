/**
 * The University Partnership campaign (docs/CRM.md, section 15), checked on the toolkit's own data and on made-up
 * mail. No network, nothing is sent, nothing is saved.
 *   npx tsx scripts/universities-check.ts
 * It ends with ALL OK or says what is wrong.
 */
import { UNIVERSITY_SEED, MASTER_EMAIL } from '../src/data/university-partnership'
import {
  CAMPAIGN_CC, FORM_TOKEN, UNI_COURSES, applyFormAnswer, cleanFormAnswer, cleanUniPatch, claudeCardAfter, draftFromMaster, formLinkOf, replyOwner, salutation, universityFromSeed, unfilled, waitingForAnswer, whyNotReady, withForm,
  type University, type UniFormAnswer,
} from '../src/lib/crm/universities-types'
import { campaignStats, nextStep } from '../src/lib/crm/universities-stats'
import { campaignEmailHtml, campaignEmailPage, CPN_LINE } from '../src/lib/crm/universities-email'
import { templateEmail } from '../src/data/university-templates'
import { INTRO } from '../src/data/university-email-copy'
import { CAMPAIGNS, campaignOfId } from '../src/data/partnership-campaigns'
import { whyNotReady, FORM_TOKEN, isEmail } from '../src/lib/crm/universities-types'
import * as indU from '../src/data/partnerships/india-universities'
import * as mumC from '../src/data/partnerships/mumbai-colleges'
import * as punC from '../src/data/partnerships/pune-colleges'
import * as entE from '../src/data/partnerships/enterprise'
import * as midC from '../src/data/partnerships/mid-size-corporates'
import * as govS from '../src/data/partnerships/government-skilling'
const SEEDS: Record<string, { SEED: any[]; MASTER: any }> = { 'india-universities': indU, 'mumbai-colleges': mumC, 'pune-colleges': punC, enterprise: entE, 'mid-size-corporates': midC, 'government-skilling': govS }

let bad = 0
const is = (what: string, got: unknown, want: unknown) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) bad++
  console.log(`${ok ? 'ok  ' : 'BAD '} ${what}${ok ? '' : `: got ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`}`)
}
const part = (t: string) => console.log(`\n${t}`)
const DAY = 86_400_000
const KEY = '0123456789abcdef01234567'
const FORM = `https://www.gennoor.com/evaluate/${KEY}`

part('1. The toolkit is all in')
const all = UNIVERSITY_SEED.map((s) => ({ ...universityFromSeed(s, MASTER_EMAIL, '2026-11-27T00:00:00.000Z'), formKey: KEY }))
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
is('a university with no key yet has no form link, so it will not go', whyNotReady({ ...first, formKey: undefined }), 'This university has no form link yet. Press Refresh, and it is made.')
is('its own link is on our site, with its key', formLinkOf(first), FORM)
is('a key that is not ours makes no link', [formLinkOf({ formKey: '../x' }), formLinkOf({ formKey: 'ABCDEF0123456789abcdef01' })], ['', ''])
is('with the link, the first wave email is ready', whyNotReady(first), '')
is('the link takes the place of its token', withForm(`see ${FORM_TOKEN}`, FORM), `see ${FORM}`)
const wave2 = all.find((u) => u.id === 'GEN-012') as University
is('a second-wave email still has the sentence about THEIR work to write', unfilled(wave2.draft.body).some((s) => /Insert 1-sentence/.test(s)), true)
is('so it will not go', whyNotReady(wave2).startsWith('Still to write'), true)
is('the master\'s own form placeholder is the token', wave2.draft.body.includes(FORM_TOKEN), true)
is('nothing else of the master is left in brackets but the one sentence', unfilled(wave2.draft.body).length, 1)
is('a name: Prof. Ashraf Darwish', salutation('Prof. Ashraf Darwish'), 'Prof. Darwish')
is('a name: Eng. Dr. Julius Butime', salutation('Eng. Dr. Julius Butime'), 'Eng. Dr. Butime')
is('a name with no title: first name', salutation('Cheryl Middleton'), 'Cheryl')
is('the copy to Jalal and Yusuf is added when sending, not stored on the email', all.every((u) => u.draft.cc.every((e) => !CAMPAIGN_CC.includes(e))), true)

part('4. The Claude Partner Network card sits where Claude is first named')
const html = campaignEmailHtml(withForm(first.draft.body, FORM), { name: 'Jalal Khan', email: 'jalalkhan@gennoor.com' }, FORM)
is('the approved line is in the email, word for word', html.includes(CPN_LINE), true)
is('the badge is the one the site uses', html.includes('/email/cpn-certified-horizontal.png'), true)
is('the card is on the cream ground', html.includes('#f0eee6'), true)
is('the card comes once', html.split(CPN_LINE).length - 1, 1)
is('no Claude in the words, no card', claudeCardAfter('Dear Dr. X,\n\nHello.'), -1)
is('the form link is a button under its paragraph, once', [html.includes('Choose your courses'), html.split('Choose your courses').length - 1, html.includes(`href="${FORM}"`)], [true, 1, true])
is('no Google anywhere in the email', /google/i.test(html), false)
const page = campaignEmailPage('a <b>subject</b>', html)
is('the page of the email runs nothing and names its subject as text', [page.includes("default-src 'none'"), page.includes('<title>a &lt;b&gt;subject&lt;/b&gt;</title>')], [true, true])

part('4b. The first email is short, and says who we are properly (owner, 27 November 2026)')
const firsts = all.filter((u) => u.wave === 1)
is('no first email says "13 Microsoft Certified Trainers" any more', all.some((u) => /13 Microsoft Certified Trainers/.test(u.draft.body)), false)
is('every first email has the one line on who we are', all.every((u) => u.draft.body.includes(INTRO)), true)
is('every first-wave email has its own opening, nothing left to write', firsts.every((u) => !unfilled(u.draft.body).length), true)
is('every email ends with a question and the short sign-off', all.every((u) => /\?\n\nWarm regards,\nJalal Khan \| Founder, Gennoor Tech \| admin@gennoor\.com$/.test(u.draft.body)), true)
is('a first email is six paragraphs at most', all.every((u) => u.draft.body.split(/\n{2,}/).length <= 6), true)
is('the courses are seven labelled cards, each once', [...new Set(UNI_COURSES.map((c) => c.code))].every((code) => html.split(`>${code}</span>`).length - 1 === 1), true)
is('the credentials come once, the Claude line once', [html.split('Microsoft Certified Trainers</strong>').length - 1, html.split(CPN_LINE).length - 1], [1, 1])

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
is('a new university with a finished email: send it', nextStep(first, now)?.text, 'Read the email and send it.')
is('emailed ten days ago, no answer: write again, and it is urgent', [nextStep(psu, now)?.urgent, /No answer after 10 days/.test(nextStep(psu, now)?.text || '')], [true, true])
const replied: University = { ...psu, stage: 'replied', replies: [{ id: 'm1', at: '2026-11-22T09:00:00Z', from: 'occis@psu.edu.sa', fromName: 'CCIS', subject: 'Re', preview: 'Yes' }] }
is('they wrote and nobody has answered', waitingForAnswer(replied), true)
is('then the answer comes first', nextStep(replied, now)?.tab, 'email')
const evaluating: University = { ...bennett, stage: 'evaluating', evaluation: { courses: ['ai-103'], reps: [], requestedAt: '2026-11-22', grantedAt: '2026-11-23' } }
is('access given a week ago: ask for the call', /Ask for a 20-minute debrief call/.test(nextStep(evaluating, now)?.text || ''), true)
const partner: University = { ...first, stage: 'partner' }
is('a partner needs nothing from us', nextStep(partner, now), null)
const stats = campaignStats([{ ...replied, replies: [{ ...replied.replies[0], handled: true }] }, evaluating, partner, ...all.filter((u) => !['GEN-001', 'GEN-006', 'GEN-014'].includes(u.id))].slice(0, 27), now)
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

part('8. An answer to the evaluation form')
const good = { institution: 'Made Up University', place: 'Riyadh, Saudi Arabia', department: 'Computing', reps: [{ name: 'Dr. Ada Example', title: 'Dean', email: 'Ada@MUU.example' }, { name: '', title: '', email: '' }], courses: ['ai-103', 'rm -rf', 'ai-103'], areas: ['lms', 'nope'], walkthrough: 'call', notes: 'Line one\r\nline two', website: '' }
const ok = cleanFormAnswer(good)
is('a good answer is taken, an empty second person is left out', ok.ok && ok.answer.reps.length, 1)
is('the address is kept in lower case', ok.ok && ok.answer.reps[0].email, 'ada@muu.example')
is('a course or an area that is not ours is dropped, a repeat is one', ok.ok && [ok.answer.courses, ok.answer.areas], [['ai-103'], ['lms']])
is('no course chosen is refused', cleanFormAnswer({ ...good, courses: [] }).ok, false)
is('three people are refused', cleanFormAnswer({ ...good, reps: [good.reps[0], good.reps[0], good.reps[0]] }).ok, false)
is('an address with a line break is refused', cleanFormAnswer({ ...good, reps: [{ ...good.reps[0], email: 'a@x.edu\nbcc: b@y.com' }] }).ok, false)
is('a walkthrough that is not one of ours is nothing', (cleanFormAnswer({ ...good, walkthrough: 'free money' }) as any).answer.walkthrough, '')
is('the hidden field filled means a machine', (cleanFormAnswer({ ...good, website: 'http://spam.example' }) as any).machine, true)
is('a name is one line, cut to length', (cleanFormAnswer({ ...good, institution: 'A\nB' + 'x'.repeat(400) }) as any).answer.institution.length, 160)
const answer: UniFormAnswer = { id: 'a1b2c3d4e5f60718', at: '2026-11-28T09:00:00.000Z', uni: 'GEN-001', ...(ok as any).answer }
const answered = structuredClone(psu)
applyFormAnswer(answered, answer)
is('the answer is on the university, its courses and person on the evaluation', [answered.formAnswers?.length, answered.evaluation?.courses, answered.evaluation?.reps[0].email, answered.evaluation?.requestedAt], [1, ['ai-103'], 'ada@muu.example', '2026-11-28'])
is('an emailed university moves to Replied, never further', answered.stage, 'replied')
is('then the next step is to give access, and it is urgent', [nextStep(answered, now)?.tab, nextStep(answered, now)?.urgent], ['evaluation', true])
const granted = structuredClone(evaluating)
applyFormAnswer(granted, { ...answer, courses: ['ai-500'] })
is('once access is given, an answer does not change the evaluation or the stage', [granted.evaluation?.courses, granted.stage], [['ai-103'], 'evaluating'])
is('an answer counts as a reply on the dashboard', campaignStats([answered], now).funnel[2].count, 1)

part('9. The emails after the first one')
const fu = templateEmail('follow-up', psu)
is('the follow-up answers the first email and carries the form link', [fu.subject.startsWith('Re: '), fu.body.includes(FORM_TOKEN), fu.body.startsWith('Dear Dr. Alshara,')], [true, true, true])
const acc = templateEmail('access', { ...psu, evaluation: { courses: ['ai-103'], reps: [], requestedAt: '', grantedAt: '' } })
is('"access is ready" lists the courses and will not go before the sign-in is written', [acc.body.includes('AI-103: Build and Ship'), whyNotReady({ ...psu, draft: { ...psu.draft, ...acc } }).startsWith('Still to write')], [true, true])
const call = templateEmail('call', psu)
is('no price and nothing called free in any of them', /free|\$|₹|price/i.test([fu.body, acc.body, call.body].join(' ')), false)

part('10. A first email from the master')
const made = draftFromMaster({ name: 'Made Up University (MUU)', department: 'School of Computing', decisionMaker: 'Dr. Ada Example', officialEmail: '', contacts: [{ id: 'x', name: 'Dr. Ada Example', designation: 'Dean', email: 'ada@muu.example', emailNote: '', status: '', linkedin: '', phone: '', department: '', source: '', notes: '', order: 'Primary' }] }, MASTER_EMAIL)
is('the name and the university are put in', [made.body.startsWith('Dear Dr. Example,'), made.body.includes("Made Up University's branding"), made.body.includes('School of Computing')], [true, true, true])
is('it goes to the primary contact', made.to, ['ada@muu.example'])
void DAY

part('11. The other campaigns (New-Partnerships)')
for (const c of CAMPAIGNS.filter((x) => x.key !== 'universities')) {
  const m = SEEDS[c.key]
  const entries = (m.SEED as any[]).map((x) => ({ ...universityFromSeed(x, m.MASTER, '2026-11-27T00:00:00Z', c.audience), formKey: KEY }))
  is(`${c.label}: ${entries.length} entries, every id unique and on its own three letters`, entries.length > 0 && new Set(entries.map((e) => e.id)).size === entries.length && entries.every((e) => campaignOfId(e.id)?.key === c.key), true)
  is(`${c.label}: every address on an email is an address`, entries.every((e) => e.draft.to.every(isEmail) && e.draft.cc.every(isEmail)), true)
  is(`${c.label}: every first email carries the form's link`, entries.every((e) => e.draft.body.includes(FORM_TOKEN)), true)
  const ready = entries.filter((e) => !whyNotReady(e)).length
  console.log(`     ${ready} of ${entries.length} are ready to send as they stand; the rest wait for an address or a sentence`)
  const html = campaignEmailHtml(entries[0].draft.body, { name: 'Jalal Khan', email: 'jalalkhan@gennoor.com' }, FORM, c.audience)
  is(`${c.label}: the email speaks to ${c.audience === 'business' ? 'a team, not faculty' : 'faculty'}`, c.audience === 'business' ? html.includes('your team') && !html.includes('faculty') : html.includes('faculty'), true)
}

console.log(bad ? `\n${bad} WRONG` : '\nALL OK')
process.exit(bad ? 1 : 0)

