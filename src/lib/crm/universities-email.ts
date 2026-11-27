import { emailShell, textToHtml } from './email-theme'
import { claudeCardAfter } from './universities-types'

// The email of the University Partnership campaign, in the site's own email look (./email-theme.ts). The words are
// the person's, as written and saved; this only dresses them. Where the email first talks about Claude, the Claude
// Partner Network badge and the approved line sit on their cream card, as on the site (src/components/ClaudePartner.tsx):
// the line is used word for word and the badge is never recoloured (docs/CRM.md, section 15).

const SITE = 'https://www.gennoor.com'
export const CPN_BADGE_URL = `${SITE}/email/cpn-certified-horizontal.png`
export const CPN_LINE = 'Gennoor is Certified in the Claude Partner Network.'

export function partnerCardHtml(): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:2px 0 18px"><tr>
    <td bgcolor="#f0eee6" style="background:#f0eee6;border-radius:12px;padding:0">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
        <td valign="middle" style="padding:0"><a href="https://claude.com/partners"><img src="${CPN_BADGE_URL}" width="150" alt="Claude Partner Network - Certified" style="display:block;border:0"/></a></td>
        <td valign="middle" style="padding:0 18px 0 6px;font-family:'Segoe UI',Arial,sans-serif;font-size:14px;line-height:1.45;font-weight:600;color:#141413">${CPN_LINE}</td>
      </tr></table>
    </td></tr></table>`
}

/** The whole email: the person's words as paragraphs, the Claude card after the first one that names Claude, the usual top and foot. */
export function campaignEmailHtml(text: string, signer: { name: string; email: string; phones?: string[] }): string {
  const paragraphs = text.split(/\n{2,}/)
  const at = claudeCardAfter(text)
  const body = paragraphs.map((p, i) => textToHtml(p) + (i === at ? partnerCardHtml() : '')).join('')
  return emailShell(body, {
    preheader: text.split('\n').find((l) => l.trim())?.slice(0, 90),
    signature: signer,
  })
}
