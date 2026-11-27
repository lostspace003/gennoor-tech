// Written out here (it is FORM_TOKEN of universities-types.ts) so that file can use this one without a circle
const FORM_TOKEN = '{{FORM_URL}}'

// The first email to a university, rewritten short (owner, 27 November 2026: "too much of theory for them to read it at
// first glance ... far better written, far better presented"). The words a person reads and edits are only these: the
// greeting, the opening that is about THEM (from the toolkit), one line on who we are, the offer, their own closing
// question and the sign-off. Who we are in detail, the courses and how the evaluation works are drawn as blocks by
// src/lib/crm/universities-email.ts, so nobody has to read a paragraph to see them.

export const INTRO = 'I lead Gennoor Tech, a team of Microsoft Certified Trainers and Claude-certified trainers. We help universities add hands-on AI courses to their certification and employability tracks.'
export const OFFER = `Before any commercial conversation, we would like your faculty to judge the training for themselves. Up to two representatives get complimentary full access to the courses they choose, here: ${FORM_TOKEN}`
export const SIGN = 'Warm regards,\nJalal Khan | Founder, Gennoor Tech | admin@gennoor.com'
const FALLBACK_QUESTION = 'Would you or a colleague be open to a brief 20-minute call next week?'

/**
 * Where the toolkit's opening spoke about us in the same sentence, or asked nothing of the people it named, the words are
 * written here, from what the toolkit says about them (27 November 2026).
 */
const OWN: Record<string, { hook?: string; ask?: string }> = {
  'GEN-004': { ask: 'Would you and Dr. Jenan Moosa Hasan be open to evaluating a course, and to a brief 20-minute call next week?' },
  'GEN-007': { hook: 'Your leadership across PES University\'s Center for Cloud Computing & Big Data (CCBD) and Centre for Data Sciences & Applied Machine Learning (CDSAML) is very close to the applied AI engineering work we do.', ask: 'Would you and Dr. Jayashree R be open to evaluating a course, and to a brief 20-minute call next week?' },
  'GEN-008': { ask: 'Would your team be open to exploring a co-branded SCAAI Agentic AI capstone and certification track, starting with a 20-minute call?' },
  'GEN-009': { ask: 'Would you or a colleague at IAIS or UJ Digital be open to a brief 20-minute call next week?' },
  'GEN-010': { ask: 'Would you and Dr. Fatuma Simba Ikuja be open to evaluating a course, and to a brief 20-minute call next week?' },
  'GEN-011': { hook: 'Congratulations on your appointment as Pioneer Director of UNILAG\'s AI-UniPod. Your recent remarks on building structured human infrastructure for AI, across both students and faculty, strongly resonated with us.', ask: 'Would you or a colleague at AI-UniPod or NITHub be open to a brief 20-minute call next week?' },
  'GEN-015': { hook: 'Given your background designing academic learning experiences with Microsoft and GitHub, and RMIT Online\'s expansion into Agentic AI Future Skills, I wanted to write to you directly.', ask: 'Would you or a colleague at RMIT Online be open to a brief 20-minute call next week?' },
  'GEN-016': { ask: 'Would you or a colleague at FEIT or UTS Open be open to a brief 20-minute call next week?' },
  'GEN-019': { hook: 'Congratulations on assuming the Deanship of SITLEARN this September. Its programming on moving from Generative AI to Agentic AI is very close to what we build.', ask: 'Would you or a colleague at SITLEARN or CoDE be open to a brief 20-minute call next week?' },
  'GEN-020': { ask: 'Would you and Dr. Chua Fang Fang be open to evaluating a course, and to a brief 20-minute call next week?' },
  'GEN-023': { ask: 'Would you or a colleague at BCIT Computing be open to a brief 20-minute call next week?' },
}

/** Marks a sentence that introduces Gennoor or sells, rather than speaking about the university. */
const ABOUT_US = /GENNOOR|Gennoor|13 Microsoft|Microsoft Certified Trainers|we help|We help|I am reaching out|our Learning Studio|white-label|complimentary|To make evaluating/

/** The sentences of a paragraph, kept whole (an abbreviation like "Dr." does not end one). */
function sentences(p: string): string[] {
  return p.replace(/\s+/g, ' ').trim().split(/(?<!\b(?:Dr|Prof|Eng|Mr|Mrs|Ms|St|No)\.)(?<!\b[A-Z]\.)(?<=[.!?])\s+(?=[A-Z[])/)
}

/**
 * The toolkit's email made short. `body` is the toolkit's (or the master's) text. What is about the university is kept
 * word for word; what was about us is replaced by INTRO and the blocks; the question they are asked is kept.
 */
export function shortFirstEmail(body: string, id = ''): string {
  const own = OWN[id] || {}
  const paras = body.replace(/\r\n?/g, '\n').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
  const greeting = /^dear\b/i.test(paras[0] || '') ? paras.shift() as string : 'Dear colleagues,'
  const signAt = paras.findIndex((p) => /^(warm|kind|best) regards|^regards|^sincerely/i.test(p))
  const middle = signAt >= 0 ? paras.slice(0, signAt) : paras
  // Their own question: the last paragraph that asks one, or its last sentence that does
  const qPara = [...middle].reverse().find((p) => /\?\s*$/.test(p))
  const question = qPara ? (sentences(qPara).reverse().find((s) => /\?$/.test(s)) || FALLBACK_QUESTION) : FALLBACK_QUESTION
  // Their opening: the sentences, before the first one about us, of the first paragraph that is not the question
  const hook: string[] = []
  for (const p of middle) {
    if (p === qPara || /^\d+\./.test(p)) continue
    for (const s of sentences(p)) {
      if (ABOUT_US.test(s) || /\?$/.test(s)) break
      hook.push(s)
    }
    if (hook.length) break
  }
  return [greeting, own.hook || hook.join(' ') || '[One sentence about their work]', INTRO, OFFER, own.ask || question, SIGN].join('\n\n')
}
