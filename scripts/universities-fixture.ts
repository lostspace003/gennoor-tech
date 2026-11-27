/**
 * Made-up state of the University Partnership campaign, to look at its screens without a real email or a real reply.
 *   npx tsx scripts/universities-fixture.ts <file.json>
 * Then, with `next dev` running:
 *   FIXTURE=<file.json> node scripts/contrast-check.mjs --back-office crm/universities crm/universities/GEN-001
 * The file is shaped for contrast-check.mjs: { "/api/admin/universities": { settings, universities, hour } }.
 * Nothing is sent and nothing is saved; no real person is in it (the toolkit's own public office addresses are the
 * only addresses, and the "replies" are invented).
 */
import { writeFileSync } from 'fs'
import { UNIVERSITY_SEED, MASTER_EMAIL } from '../src/data/university-partnership'
import { applyFormAnswer, universityFromSeed, type University, type UniFormAnswer } from '../src/lib/crm/universities-types'

const out = process.argv[2]
if (!out) { console.log('Name the file to write, for example: npx tsx scripts/universities-fixture.ts C:/temp/universities.json'); process.exit(1) }

const ago = (days: number, hour = 9) => new Date(Date.now() - days * 86_400_000 + (hour - 12) * 3_600_000).toISOString()
const unis = UNIVERSITY_SEED.map((s, i) => ({ ...universityFromSeed(s, MASTER_EMAIL, ago(0)), formKey: i.toString(16).padStart(24, '0') }))
const by = (id: string) => unis.find((u) => u.id === id) as University
const send = (u: University, days: number) => {
  const at = ago(days)
  u.emails.unshift({ at, by: 'jalalkhan@gennoor.com', to: u.draft.to.join(', '), cc: ['jalalkhan@gennoor.com', 'yusufchaudhary@gennoor.com'], subject: u.draft.subject, status: 'sent', kind: 'first', confirmedAt: at, confirmedBy: 'service' })
  if (u.stage === 'new') u.stage = 'emailed'
  u.activities.unshift({ at, by: 'jalalkhan@gennoor.com', type: 'email', description: `Email sent: ${u.draft.subject}` })
}
// Eleven of the fifteen first-wave emails have gone, over nine days
;['GEN-001', 'GEN-002', 'GEN-003', 'GEN-004', 'GEN-006', 'GEN-007', 'GEN-008', 'GEN-009', 'GEN-010', 'GEN-011', 'GEN-015'].forEach((id, i) => send(by(id), 9 - Math.floor(i * 0.8)))
// A reply, nobody has answered it
const ud = by('GEN-002'); ud.stage = 'replied'
ud.replies.unshift({ id: 'm-1', at: ago(5), from: 'ced@ud.ac.ae', fromName: 'CED Office', subject: 'Re: Turnkey Microsoft AI & Claude Micro-Credentials', preview: 'Thank you for reaching out. We would like to look at AI Strategy for the C-Suite.' })
// Evaluating, access given six days ago
const udst = by('GEN-003'); udst.stage = 'evaluating'
udst.replies.unshift({ id: 'm-2', at: ago(7), from: 'wagdi.alrawagfeh@udst.edu.qa', fromName: 'Wagdi AlRawagfeh', subject: 'Re: Partnering on UDST CCIT', preview: 'Please send us access to AI-103 and AI-500.', handled: true })
udst.evaluation = { courses: ['ai-103', 'ai-500'], reps: [{ name: 'Wagdi AlRawagfeh', email: 'wagdi.alrawagfeh@udst.edu.qa' }], requestedAt: ago(6).slice(0, 10), grantedAt: ago(6).slice(0, 10) }
// A call booked for next week
const ahlia = by('GEN-004'); ahlia.stage = 'call'; ahlia.callOn = new Date(Date.now() + 6 * 86_400_000).toISOString().slice(0, 10)
ahlia.replies.unshift({ id: 'm-3', at: ago(7), from: 'adarwish@ahlia.edu.bh', fromName: 'Prof. Ashraf Darwish', subject: 'Re: Agentic AI Capstones', preview: 'Happy to talk next week.', handled: true })
ahlia.evaluation = { courses: ['ai-500', 'agents-business'], reps: [], requestedAt: ago(8).slice(0, 10), grantedAt: ago(8).slice(0, 10) }
// A partner
const bennett = by('GEN-006'); bennett.stage = 'partner'
bennett.replies.unshift({ id: 'm-4', at: ago(8), from: 'abhay.bansal@bennett.edu.in', fromName: 'Abhay Bansal', subject: 'Re: Production Agentic AI', preview: 'Yes, let us pilot.', handled: true })
bennett.evaluation = { courses: ['ai-103'], reps: [], requestedAt: ago(8).slice(0, 10), grantedAt: ago(8).slice(0, 10) }
// One that did not go, and one closed
const lagos = by('GEN-011'); lagos.emails = [{ ...lagos.emails[0], status: 'failed', confirmedAt: undefined, error: 'The mailbox is full' }]; lagos.stage = 'new'
const mec = by('GEN-005'); mec.stage = 'closed'; mec.closedReason = 'They have their own provider'

// Who works which: the pretend person signed in is admin@
;['GEN-001', 'GEN-002', 'GEN-003', 'GEN-004'].forEach((id) => { by(id).owner = 'admin@gennoor.com' })
;['GEN-006', 'GEN-007'].forEach((id) => { by(id).owner = 'yusufchaudhary@gennoor.com' })
// A form answer through Prince Sultan University's own link, and one through the general link (made-up people)
const answer = (uni: string, institution: string): UniFormAnswer => ({ id: uni ? 'a1b2c3d4e5f60718' : 'f0e1d2c3b4a59687', at: ago(1), uni, institution, place: 'Riyadh, Saudi Arabia', department: 'College of Computer and Information Sciences', reps: [{ name: 'Dr. Ada Example', title: 'Associate Professor', email: 'ada.example@psu.example' }], courses: ['ai-103', 'agents-business'], areas: ['capstones', 'lms'], walkthrough: 'call', notes: 'A cohort of about 40 students in the spring term.' })
applyFormAnswer(by('GEN-001'), answer('GEN-001', 'Prince Sultan University'))
const unmatched = [{ ...answer('', 'Example Institute of Technology'), reps: [{ name: 'Sam Example', title: 'Head of Digital Learning', email: 'sam@eit.example' }] }]

writeFileSync(out, JSON.stringify({ '/api/admin/universities': { universities: unis, unmatched, hour: { used: 11, limit: 60 } } }))
console.log(`written: ${out}`)
