import { emailButton, emailShell, emailSteps } from './email-theme'
import { escapeHtml } from '@/lib/escape-html'
import { INTRO } from '@/data/university-email-copy'
import { UNI_COURSES, claudeCardAfter } from './universities-types'

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

/**
 * The whole email: the person's words as paragraphs, the Claude card after the first one that names Claude, a
 * "Choose your courses" button under the paragraph that holds the form's link, the usual light top and foot.
 * `formUrl` is the university's own link, made by `formLinkOf`. The CRM's preview and "Open as a page" draw this same HTML.
 */
export function campaignEmailHtml(text: string, signer: { name: string; email: string; phones?: string[] }, formUrl = ''): string {
  const paragraphs = text.split(/\n{2,}/)
  const introAt = paragraphs.findIndex((p) => p.trim() === INTRO)
  const at = introAt >= 0 ? introAt : claudeCardAfter(text)
  const formAt = formUrl ? paragraphs.findIndex((p) => p.includes(formUrl)) : -1
  const body = paragraphs.map((p, i) => paragraphHtml(p, i, paragraphs.length, formUrl)
    + (i === at ? (i === introAt ? credentialsHtml() : '') + partnerCardHtml() : '')
    + (i === formAt ? `${coursesHtml()}${evaluationStepsHtml()}${emailButton('Choose your courses', escapeHtml(formUrl))}<div style="height:22px;line-height:22px;font-size:0">&nbsp;</div>` : '')).join('')
  // Justified from tablet width up only: on a phone it opens gaps between words (docs/DESIGN.md, st-justify)
  const phones = '<style>@media only screen and (max-width:520px){.gj{text-align:left!important}}</style>'
  return phones + emailShell(body, {
    preheader: text.split('\n').find((l) => l.trim())?.slice(0, 90),
    signature: signer,
  })
}

// ---- The blocks that stand in for paragraphs: who we are, the courses, how it works ----

const FONT = "'Segoe UI',Arial,sans-serif"
const label = (t: string) => `<p style="margin:26px 0 12px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.5px;color:#64748b;text-transform:uppercase">${t}</p>`

/** Colours of a course's family: certification prep blue, projects violet, AI for every role green. */
const TRACK: Record<string, { ink: string; wash: string; line: string; name: string }> = {
  'Certification Prep': { ink: '#1d4ed8', wash: '#eef4ff', line: '#d6e4ff', name: 'Certification prep' },
  Project: { ink: '#6d28d9', wash: '#f4f0ff', line: '#e4dbff', name: 'Hands-on projects' },
  'Use Case': { ink: '#047857', wash: '#ecfdf5', line: '#cdeedd', name: 'AI for every role' },
}

/** Who we are, as three short lines with a mark each: what a reader takes in at a glance. */
function credentialsHtml(): string {
  const rows = [
    ['#1d4ed8', '#eef4ff', 'MCT', 'Microsoft Certified Trainers', 'Our team teaches Microsoft\'s official Azure, AI and Fabric curriculum.'],
    ['#b45309', '#fff7ed', 'AI', 'Claude-certified trainers', 'Certified on Anthropic\'s Claude, for agents and everyday AI work.'],
    ['#047857', '#ecfdf5', 'LMS', 'An AI-assisted Learning Studio', 'An AI assistant in every lesson. Available white-label for your university.'],
  ]
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:4px 0 14px">${rows.map(([ink, wash, mark, title, line]) => `<tr>
    <td width="52" valign="top" style="padding:6px 0"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="40" height="40" align="center" valign="middle" bgcolor="${wash}" style="background:${wash};border-radius:10px;font-family:${FONT};font-size:11px;font-weight:800;color:${ink}">${mark}</td></tr></table></td>
    <td valign="top" style="padding:7px 0 7px 4px;font-family:${FONT};font-size:14.5px;line-height:1.5;color:#475569"><strong style="color:#0f172a;font-size:15px">${title}</strong><br/>${line}</td>
  </tr>`).join('')}</table>`
}

/** The courses, grouped by family, each with its label tile, its name, one line on why, and its size. */
function coursesHtml(): string {
  const groups = Object.keys(TRACK).map((track) => ({ track, list: UNI_COURSES.filter((c) => c.track === track) }))
  const cards = groups.map(({ track, list }) => {
    const t = TRACK[track]
    return `<p style="margin:16px 0 8px;font-family:${FONT};font-size:13px;font-weight:700;color:${t.ink}">${t.name}</p>` + list.map((c) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 8px;border:1px solid ${t.line};border-radius:12px"><tr>
      <td width="78" valign="top" style="padding:14px 0 14px 14px"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="64" height="40" align="center" valign="middle" bgcolor="${t.wash}" style="background:${t.wash};border-radius:9px;font-family:${FONT};font-size:11px;font-weight:800;letter-spacing:0.4px;color:${t.ink}">${escapeHtml(c.code)}</td></tr></table></td>
      <td valign="top" style="padding:13px 16px 13px 10px;font-family:${FONT}"><strong style="display:block;font-size:15px;line-height:1.4;color:#0f172a">${escapeHtml(c.title.replace(/^AI-\d+:\s*/, ''))}</strong><span style="display:block;margin-top:3px;font-size:14px;line-height:1.5;color:#475569">${escapeHtml(c.why)}</span><span style="display:block;margin-top:5px;font-size:12.5px;color:#64748b">${c.level} · ${c.scope.replace(/\s*\((.+)\)/, ' · $1')}</span></td>
    </tr></table>`).join('')
  }).join('')
  return label('What your faculty can evaluate') + `<p style="margin:0 0 4px;font-family:${FONT};font-size:14.5px;line-height:1.6;color:#475569"><strong style="color:#0f172a">Why now:</strong> employers increasingly ask graduates for hands-on AI skills. Every course is built the same way: watch, practise, build, prove.</p>` + cards
}

function evaluationStepsHtml(): string {
  return emailSteps([
    { title: 'Choose the courses', body: 'A short form, about two minutes.' },
    { title: 'Full access within 24 hours', body: 'For up to two faculty or academic representatives.' },
    { title: 'A 20-minute debrief', body: 'Tell us what your faculty think. No obligation.' },
  ], 'How the evaluation works')
}

// The reading look of a campaign email (owner, 27 November 2026: "justified ... more easier to see on the eyes"):
// the greeting on its own, the body justified with room between lines, the sign-off left as written. A web address in
// the words is shown without its "https://" and the link stays whole.
const READ = "font-family:'Segoe UI',Arial,sans-serif;font-size:15.5px;line-height:1.75;color:#334155"
const SIGN_OFF = /^(warm regards|kind regards|best regards|regards|sincerely|thank you|thanks|best),?/i

function linked(escaped: string, formUrl: string): string {
  return escaped.replace(/https?:\/\/[^\s<]+/g, (m) => {
    const url = m.replace(/[.,;:!?)]+$/, '')
    // The form's own long link reads as words; the button under the paragraph carries it too
    const shown = formUrl && url === escapeHtml(formUrl) ? 'the evaluation form' : url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
    return `<a href="${url}" style="color:#2563EB;text-decoration:none;font-weight:600">${shown}</a>${m.slice(url.length)}`
  })
}

function paragraphHtml(p: string, i: number, total: number, formUrl: string): string {
  const text = linked(escapeHtml(p.trim()), formUrl)
  if (i === 0 && /^dear\b/i.test(p.trim())) return `<p style="${READ};margin:0 0 18px;color:#0f172a;font-size:16px">${text}</p>`
  if (i === total - 1 && SIGN_OFF.test(p.trim())) {
    // "Warm regards,\nJalal Khan | Founder & MCT, ... | admin@..." becomes one line each, the name in bold
    const [greeting, ...rest] = text.split('\n')
    const lines = rest.flatMap((l) => l.split(' | ')).map((l) => l.trim()).filter(Boolean)
    return `<p style="${READ};margin:24px 0 0">${greeting}${lines.map((l, j) => `<br/>${j === 0 ? `<strong style="color:#0f172a">${l}</strong>` : l}`).join('')}</p>`
  }
  return `<p class="gj" style="${READ};margin:0 0 16px;text-align:justify;white-space:pre-line">${text}</p>`
}

/** The email as a page of its own, to open in a tab: nothing on it can run, only its pictures load. */
export function campaignEmailPage(subject: string, html: string): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data:; style-src 'unsafe-inline'">
<title>${escapeHtml(subject)}</title></head><body style="margin:0;background:#eef2f8">${html}</body></html>`
}
