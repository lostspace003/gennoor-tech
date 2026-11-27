import type { Audience } from '@/data/partnership-campaigns'
import { FORM_TOKEN, UNI_COURSES, salutation, type University } from '@/lib/crm/universities-types'

// The emails of the campaign after the first one, in the order they are needed (docs/CRM.md, section 15). Each is a
// starting point: it is put into the editor, read, changed if need be, and sent by a person. A part only a person can
// write stays in square brackets, and the email will not go while it does.

export type TemplateId = 'follow-up' | 'access' | 'call'
export const TEMPLATES: Array<{ id: TemplateId; label: string; when: string }> = [
  { id: 'follow-up', label: 'Follow-up', when: 'No answer after five days' },
  { id: 'access', label: 'Access is ready', when: 'Access has been given' },
  { id: 'call', label: 'Ask for the call', when: 'Five to seven days after access' },
]

const SIGN = 'Warm regards,\nJalal Khan | Founder & MCT, GENNOOR TECH PRIVATE LIMITED | admin@gennoor.com'

/** "Dear Dr. Alshara," as the first email has it, or from the primary contact. */
function greeting(u: University): string {
  const fromDraft = /^Dear ([^,\n]{2,80}),/.exec(u.draft.body.trim())?.[1]
  const name = fromDraft || salutation((u.contacts.find((c) => /^primary/i.test(c.order)) || u.contacts[0])?.name || u.decisionMaker)
  return `Dear ${name || 'colleagues'},`
}

const shortName = (u: University) => u.name.replace(/\s*\([^)]*\)\s*$/, '')
const firstSubject = (u: University) => (u.emails.find((e) => e.kind === 'first')?.subject || u.draft.subject).replace(/^(re:\s*)+/i, '')
const courseList = (u: University) => (u.evaluation?.courses || []).map((id) => `- ${UNI_COURSES.find((c) => c.id === id)?.title || id}`).join('\n')

export function templateEmail(id: TemplateId, u: University, audience: Audience = 'academic'): { subject: string; body: string } {
  const hello = greeting(u)
  const who = audience === 'business' ? 'team' : 'faculty'
  if (id === 'follow-up') {
    return {
      subject: `Re: ${firstSubject(u)}`,
      body: `${hello}\n\nI wanted to follow up on my email about a complimentary course evaluation for ${shortName(u)}.\n\nYour ${who} can choose one or more courses from our Learning Studio here: ${FORM_TOKEN}. Up to two ${audience === 'business' ? 'people' : 'representatives'} get full access, and we send the sign-in details within 24 hours.\n\nIf someone else at ${shortName(u)} looks after this, I would be grateful if you could point me to them.\n\n${SIGN}`,
    }
  }
  if (id === 'access') {
    const list = courseList(u)
    return {
      subject: `Your Gennoor Learning Studio access is ready`,
      body: `${hello}\n\nThank you for choosing the courses to evaluate. Full access is now ready for:\n\n${list || '[The courses]'}\n\n[How to sign in: the address, and what they receive]\n\nTake the time you need. In about a week, I would welcome a 20-minute call to hear what your ${who} think.\n\n${SIGN}`,
    }
  }
  return {
    subject: `A short call about the courses your ${who} reviewed`,
    body: `${hello}\n\nI hope the courses have been useful to your ${who} so far.\n\nCould we have a 20-minute call to hear their view, and to talk about what would suit ${shortName(u)}, ${audience === 'business' ? 'such as role-based training, a custom automation course or a white-label academy for your people' : 'such as certification tracks, capstone projects or a white-label LMS for your students'}? Please suggest a time that works for you, or reply with a few options.\n\n${SIGN}`,
  }
}
