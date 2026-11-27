import { emailButton, emailShell } from './email-theme'
import { escapeHtml } from '@/lib/escape-html'
import { INTRO, INTRO_BUSINESS } from '@/data/university-email-copy'
import type { Audience } from '@/data/partnership-campaigns'
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
        <td valign="middle" style="padding:0"><img src="${CPN_BADGE_URL}" width="150" alt="Claude Partner Network - Certified" style="display:block;border:0"/></td>
        <td valign="middle" style="padding:0 18px 0 6px;font-family:'Segoe UI',Arial,sans-serif;font-size:14px;line-height:1.45;font-weight:600;color:#141413">${CPN_LINE}</td>
      </tr></table>
    </td></tr></table>`
}

/**
 * The whole email: the person's words as paragraphs, the Claude card after the first one that names Claude, a
 * "Choose your courses" button under the paragraph that holds the form's link, the usual light top and foot.
 * `formUrl` is the university's own link, made by `formLinkOf`. The CRM's preview and "Open as a page" draw this same HTML.
 */
export function campaignEmailHtml(text: string, signer: { name: string; email: string; phones?: string[] }, formUrl = '', audience: Audience = 'academic'): string {
  const biz = audience === 'business'
  const paragraphs = text.split(/\n{2,}/)
  const introAt = paragraphs.findIndex((p) => p.trim() === INTRO || p.trim() === INTRO_BUSINESS)
  const at = introAt >= 0 ? introAt : claudeCardAfter(text)
  const formAt = formUrl ? paragraphs.findIndex((p) => p.includes(formUrl)) : -1
  const body = paragraphs.map((p, i) => paragraphHtml(p, i, paragraphs.length, formUrl)
    + (i === at ? (i === introAt ? credentialsHtml(biz) : '') + partnerCardHtml() : '')
    + (i === formAt ? `${coursesHtml(biz)}${evaluationStepsHtml(biz)}${emailButton('Choose your courses', escapeHtml(formUrl))}<div style="height:22px;line-height:22px;font-size:0">&nbsp;</div>` : '')).join('')
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

/** The drawn line icons of our emails (scripts/email-art/icons-png.mjs): one calm line on one soft wash. */
const ICON = (name: string) => `${SITE}/email/line/${name}.png`
const iconCell = (name: string, size = 44) => `<img src="${ICON(name)}" width="${size}" height="${size}" alt="" style="display:block;border:0"/>`
const COURSE_ICON: Record<string, string> = {
  'ai-103': 'course-ai-103', 'ai-500': 'course-ai-500', 'agent-ops': 'course-agents', 'build-real-time-ai-on-microsoft-fabric': 'course-fabric',
  'ai-foundations': 'course-foundations', 'ai-governance-risk-and-boards': 'course-governance', 'ai-strategy-for-the-c-suite': 'course-strategy',
}
const TRACK_NAME: Record<string, string> = { 'Certification Prep': 'Certification prep', Project: 'Hands-on projects', 'Use Case': 'AI for every role' }
const INK = '#1b2540'
const INK3 = '#6b7790'

/** Who we are, as three short lines with a mark each: what a reader takes in at a glance. */
function credentialsHtml(biz = false): string {
  const rows = [
    ['microsoft', 'Microsoft Certified Trainers', 'Microsoft\'s official Azure, AI, Copilot and Fabric curriculum.'],
    ['claude', 'Claude-certified trainers', 'Certified on Anthropic\'s Claude, for agents and everyday AI work.'],
    ['assistant', 'An AI-assisted Learning Studio', 'An AI assistant in every lesson. Available white-label for your ' + (biz ? 'organisation' : 'university') + '.'],
  ]
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:6px 0 16px">${rows.map(([icon, title, line]) => `<tr>
    <td width="56" valign="middle" style="padding:5px 0">${iconCell(icon)}</td>
    <td valign="middle" style="padding:5px 0 5px 6px;font-family:${FONT};font-size:14px;line-height:1.5;color:${INK3}"><strong style="color:${INK};font-size:15px">${title}</strong><br/>${line}</td>
  </tr>`).join('')}</table>`
}

/** The courses, grouped by family: a drawn icon, the name and its code, one line on why, and its size. */
function coursesHtml(biz = false): string {
  const tracks = Object.keys(TRACK_NAME)
  const cards = tracks.map((track) => {
    const list = UNI_COURSES.filter((c) => c.track === track)
    return `<p style="margin:16px 0 6px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${INK3}">${TRACK_NAME[track]}</p>` + list.map((c) => `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 8px;border:1px solid #e6ebf3;border-radius:14px"><tr>
      <td width="64" valign="top" style="padding:12px 0 12px 12px"><a href="${SITE}/studio/${encodeURIComponent(c.slug)}">${iconCell(COURSE_ICON[c.id] || 'course-ai-103')}</a></td>
      <td valign="top" style="padding:12px 16px 12px 8px;font-family:${FONT}"><a href="${SITE}/studio/${encodeURIComponent(c.slug)}" style="display:block;font-size:15px;line-height:1.35;color:${INK};font-weight:700;text-decoration:none">${escapeHtml(c.title.replace(/^AI-\d+:\s*/, ''))} &rsaquo;</a><span style="display:block;margin-top:3px;font-size:14px;line-height:1.5;color:#3b4760">${escapeHtml(c.why)}</span><span style="display:block;margin-top:6px;font-size:12px;color:${INK3}"><span style="display:inline-block;padding:1px 7px;border-radius:6px;background:#f1f4f9;color:#3b4760;font-weight:700;letter-spacing:0.3px">${escapeHtml(c.code)}</span>&nbsp; ${c.level} · ${c.scope.replace(/\s*\((.+)\)/, ' · $1')}</span></td>
    </tr></table>`).join('')
  }).join('')
  return label(biz ? 'What your team can evaluate' : 'What your faculty can evaluate') + `<p style="margin:0 0 4px;font-family:${FONT};font-size:14.5px;line-height:1.6;color:#3b4760"><strong style="color:${INK}">Why now:</strong> ' + (biz ? 'teams that practise AI on real work move faster than teams that only watch it.' : 'employers increasingly ask graduates for hands-on AI skills.') + ' Every course is built the same way: watch, practise, build, prove.</p>` + cards
}

/** How the evaluation works: three steps, each with its drawn icon. */
function evaluationStepsHtml(biz = false): string {
  const steps = [
    ['step-choose', 'Choose the courses', 'A short form, about two minutes.'],
    ['step-access', 'Full access within 24 hours', biz ? 'For up to two people from your team.' : 'For up to two faculty or academic representatives.'],
    ['step-debrief', 'A 20-minute debrief', biz ? 'Tell us what your team thinks. No obligation.' : 'Tell us what your faculty think. No obligation.'],
  ]
  return label('How the evaluation works') + `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${steps.map(([icon, title, line]) => `<tr>
    <td width="56" valign="middle" style="padding:5px 0">${iconCell(icon)}</td>
    <td valign="middle" style="padding:5px 0 5px 6px;font-family:${FONT};font-size:14px;line-height:1.5;color:${INK3}"><strong style="color:${INK};font-size:15px">${title}</strong><br/>${line}</td>
  </tr>`).join('')}</table>`
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
