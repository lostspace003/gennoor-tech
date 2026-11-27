import { emailButton, emailShell, textToHtml } from './email-theme'
import { CATALOGUE_PDF_URL } from './catalogue-email'

// "Introduce Gennoor": the general first email for any lead (owner, 27 November 2026: "a generic template ... it should
// not start with about the organization because we don't know about them ... we can add a lead and directly send this").
// The words are the person's (they read and change them); the blocks below them show who we are and what we do, in
// the drawn style of everything we send. Every row is a link to its page. The Claude Partner card links nowhere.

const SITE = 'https://www.gennoor.com'
const FONT = "'Segoe UI',Arial,sans-serif"
const INK = '#1b2540'
const INK3 = '#6b7790'
const ICON = (name: string) => `${SITE}/email/line/${name}.png`
const CPN_BADGE = `${SITE}/email/cpn-certified-horizontal.png`
const CPN_LINE = 'Gennoor is Certified in the Claude Partner Network.'

export const INTRO_SUBJECT = 'AI training that ends with something working'
export function introBody(firstName: string): string {
  return `Dear ${firstName || 'there'},\n\nI lead Gennoor Tech, a team of Microsoft Certified Trainers and Claude-certified trainers. We help organisations learn AI on their own work, so every course ends with something that runs.\n\nBelow is what we do, on one page. Every item is a link.\n\nWould a 20-minute call next week be useful, to see which of these fits your team?`
}

const label = (t: string) => `<p style="margin:24px 0 10px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.4px;color:${INK3};text-transform:uppercase">${t}</p>`
const row = (icon: string, title: string, line: string, href?: string) => `<tr>
  <td width="56" valign="middle" style="padding:5px 0"><img src="${ICON(icon)}" width="44" height="44" alt="" style="display:block;border:0"/></td>
  <td valign="middle" style="padding:5px 0 5px 6px;font-family:${FONT};font-size:14px;line-height:1.5;color:${INK3}">${href ? `<a href="${href}" style="color:${INK};font-size:15px;font-weight:700;text-decoration:none">${title} &rsaquo;</a>` : `<strong style="color:${INK};font-size:15px">${title}</strong>`}<br/>${line}</td>
</tr>`
const rows = (r: string) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${r}</table>`

export function introBlocksHtml(): string {
  const who = rows(row('microsoft', 'Microsoft Certified Trainers', 'Microsoft\'s official Azure, AI, Copilot and Fabric curriculum.')
    + row('claude', 'Claude-certified trainers', 'Agents and everyday AI work with Claude.')
    + row('assistant', 'An AI assistant in every lesson', 'Questions answered while people learn.'))
  const card = `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:10px 0 0"><tr><td bgcolor="#f0eee6" style="background:#f0eee6;border-radius:12px;padding:0"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
    <td valign="middle" style="padding:0"><img src="${CPN_BADGE}" width="140" alt="Claude Partner Network - Certified" style="display:block;border:0"/></td>
    <td valign="middle" style="padding:0 16px 0 6px;font-family:${FONT};font-size:13.5px;font-weight:600;color:#141413">${CPN_LINE}</td></tr></table></td></tr></table>`
  const ready = rows(row('offer-studio', 'Learning Studio', '7 video courses with labs, quizzes and a certificate.', `${SITE}/studio`)
    + row('offer-essentials', 'AI Essentials', '48 interactive courses, about an hour each, for every role.', `${SITE}/ai-academy`)
    + row('offer-claude-certs', 'Claude certification prep', 'A guide and a practice exam for all 4 Claude certifications.', `${SITE}/claude/certifications`)
    + row('offer-weekend', 'Gennoor AI Weekend', 'The last weekend of every month, Saturday &amp; Sunday: seven working demos, live.', `${SITE}/ai-weekend`))
  const built = rows(row('offer-training', 'Training built on your work', 'Your tools, your files, your examples. Online or at your office.', `${SITE}/training`)
    + row('offer-automation', 'Claude automation courses', '16 courses, each on one job a team does every week.', `${SITE}/claude`)
    + row('offer-platform', 'Your own learning platform', 'Your courses and your name on it, in the cloud or on your premises.', `${SITE}/contact`)
    + row('offer-prototype', 'A prototype first', 'One use case built and tested on your own examples.', `${SITE}/automation`))
  return label('Who we are') + who + card + label('Ready to use') + ready + label('Made ready for you') + built
    + emailButton('Book a 20-minute call', `${SITE}/contact`)
    + `<p style="margin:12px 0 0;text-align:center;font-family:${FONT};font-size:13.5px"><a href="${CATALOGUE_PDF_URL}" style="color:#2563EB;font-weight:600;text-decoration:none">The one-page catalogue (PDF) &rsaquo;</a></p>`
}

/** The whole email: the person's words, then the blocks, then the signer's foot. */
export function introEmailHtml(body: string, signer: { name: string; email: string; phones?: string[] }): string {
  return emailShell(textToHtml(body) + introBlocksHtml(), { preheader: body.split('\n').find((l) => l.trim() && !/^dear\b/i.test(l))?.slice(0, 90), signature: signer })
}
