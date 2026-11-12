import { escapeHtml } from '@/lib/escape-html'

// The look of the CRM email series: a dark briefing. One hook line, one
// sentence, one moving picture, three icon tiles, one button.
//
// Email apps decide what is possible here:
//  - Gmail and Outlook remove SVG, CSS animation and video players. So the icons
//    are PNG, the motion is animated GIF, and a "video" is a moving preview that
//    opens the page where the real one plays with sound.
//  - Old Outlook on Windows lays pages out with Word. Everything is therefore a
//    table with its colour in a bgcolor attribute, and it shows only the first
//    frame of a GIF (each picture's first frame is the finished picture).
// The pictures are drawn by scripts/email-art (see build.mjs there).

const SITE = 'https://www.gennoor.com'
const ART = `${SITE}/email/brief`
const LOGO = `${SITE}/logos/gennoor-tech-horizontal-dark-bright_760x260_email-header.png`
const FONT = "'Segoe UI',Arial,sans-serif"

export const BRIEF = {
  // card is the logo picture's own background colour, so the logo sits on it without a visible box
  page: '#060b16', card: '#0c1426', panel: '#16233f', line: '#24365c',
  text: '#f2f6fc', body: '#c9d6ea', muted: '#8fa3c2', blue: '#5aa9f3', button: '#0a7cff', gold: '#f5b83d',
}
const C = BRIEF

export type BriefIcon =
  | 'play' | 'labs' | 'certificate' | 'assistant' | 'catalogue' | 'work' | 'voice' | 'doubts' | 'learn' | 'trainer'
  | 'project' | 'module' | 'result' | 'open' | 'quiz' | 'team' | 'automation' | 'calendar' | 'person' | 'stop'
export type BriefPicture = 'video' | 'courses' | 'custom' | 'time' | 'claude' | 'build' | 'chat' | 'platform'

const icon = (name: BriefIcon, size = 44) => `<img src="${ART}/icon-${name}.png" width="${size}" height="${size}" alt="" style="display:block;border:0"/>`

/** The small gold label, the hook, and one sentence under it. */
export function briefHead(kicker: string, title: string, lead: string): string {
  return `<p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:2px;color:${C.gold};text-transform:uppercase">${kicker}</p>
  <h1 style="margin:0 0 12px;font-size:30px;line-height:1.18;color:${C.text};font-weight:800;letter-spacing:-0.02em">${title}</h1>
  <p style="margin:0 0 22px;font-size:17px;line-height:1.55;color:${C.body}">${lead}</p>`
}

/** The moving picture. The whole picture is a link; `alt` says what it shows for readers with images off. */
export function briefPicture(name: BriefPicture, alt: string, href: string): string {
  return `<a href="${href}" style="display:block;text-decoration:none"><img src="${ART}/${name}.gif" width="544" alt="${escapeHtml(alt)}" style="display:block;width:100%;max-width:544px;height:auto;border:0;border-radius:14px;color:${C.body};font-size:14px;line-height:1.5"/></a>`
}

/** Three tiles side by side: an icon, two or three words, and a few more under them. */
export function briefTiles(tiles: { icon: BriefIcon; title: string; line: string }[]): string {
  const width = Math.floor(100 / tiles.length)
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0 4px"><tr>${tiles
    .map(
      (t) => `<td width="${width}%" valign="top" style="padding:0 8px 0 0">
        ${icon(t.icon)}
        <p style="margin:10px 0 2px;font-size:15px;line-height:1.3;font-weight:700;color:${C.text}">${t.title}</p>
        <p style="margin:0;font-size:13px;line-height:1.4;color:${C.muted}">${t.line}</p>
      </td>`
    )
    .join('')}</tr></table>`
}

/** Rows that each go somewhere: an icon, a title, a few words, and an arrow. */
export function briefLinks(rows: { icon: BriefIcon; title: string; line: string; href: string }[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:18px 0 0">${rows
    .map(
      (r) => `<tr><td style="padding:0 0 10px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${C.panel}" style="background:${C.panel};border:1px solid ${C.line};border-radius:14px"><tr>
          <td width="68" valign="middle" style="padding:12px 0 12px 14px">${icon(r.icon)}</td>
          <td valign="middle" style="padding:12px 8px 12px 0">
            <a href="${r.href}" style="text-decoration:none;font-size:16px;line-height:1.3;font-weight:700;color:${C.text}">${r.title}</a>
            <p style="margin:2px 0 0;font-size:13px;line-height:1.4;color:${C.muted}">${r.line}</p>
          </td>
          <td width="44" align="right" valign="middle" style="padding:12px 16px 12px 0"><a href="${r.href}" style="text-decoration:none;font-size:20px;font-weight:700;color:${C.blue}">&rarr;</a></td>
        </tr></table>
      </td></tr>`
    )
    .join('')}</table>`
}

/** The one button of the email. */
export function briefButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 6px"><tr>
    <td align="center" bgcolor="${C.button}" style="border-radius:999px;background:${C.button}">
      <a href="${href}" style="display:inline-block;padding:15px 34px;font-family:${FONT};font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:999px">${label} &rarr;</a>
    </td></tr></table>`
}

/** One quiet line, for the thing that did not fit a tile. */
export const briefLine = (html: string) => `<p style="margin:16px 0 0;font-size:14.5px;line-height:1.55;color:${C.muted}">${html}</p>`
export const briefLink = (label: string, href: string) => `<a href="${href}" style="color:${C.blue};font-weight:600;text-decoration:none">${label}</a>`

/** A gold-edged strip for the thing not to miss, such as the attachment. */
export function briefStrip(name: BriefIcon, html: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1c1a12" style="margin:16px 0 0;background:#1c1a12;border:1px solid #6b5320;border-radius:14px"><tr>
    <td width="68" valign="middle" style="padding:12px 0 12px 14px">${icon(name)}</td>
    <td valign="middle" style="padding:12px 16px 12px 0;font-size:14.5px;line-height:1.45;color:${C.body}">${html}</td>
  </tr></table>`
}

/** Big answers the reader can tap; each opens a ready-made reply. */
export function briefChoices(choices: { icon: BriefIcon; title: string; line: string; href: string }[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:6px 0 0">${choices
    .map(
      (c) => `<tr><td style="padding:0 0 10px">
        <a href="${c.href}" style="display:block;text-decoration:none">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${C.panel}" style="background:${C.panel};border:1px solid ${C.line};border-radius:14px"><tr>
          <td width="68" valign="middle" style="padding:14px 0 14px 14px">${icon(c.icon)}</td>
          <td valign="middle" style="padding:14px 16px 14px 0">
            <span style="display:block;font-size:17px;line-height:1.3;font-weight:700;color:${C.text}">${c.title}</span>
            <span style="display:block;margin-top:2px;font-size:13.5px;line-height:1.4;color:${C.muted}">${c.line}</span>
          </td>
        </tr></table></a>
      </td></tr>`
    )
    .join('')}</table>`
}

/** A personal line from the sender, shown above everything else. */
export const briefNote = (text: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 22px"><tr>
    <td width="3" bgcolor="${C.gold}" style="background:${C.gold};font-size:0;line-height:0">&nbsp;</td>
    <td style="padding:4px 0 4px 14px;font-size:16px;line-height:1.55;color:${C.text};white-space:pre-line">${escapeHtml(text)}</td>
  </tr></table>`

/** The whole email: logo, the body, who it is from, and how to stop it. */
export function briefShell(bodyHtml: string, opts: { preheader: string; signature: { name: string; email: string; phones?: string[] } }): string {
  const sig = opts.signature
  const emails = [...new Set([sig.email.trim().toLowerCase(), 'admin@gennoor.com'].filter(Boolean))]
  const phones = (sig.phones || []).filter(Boolean).map((p) => `<a href="tel:+${p.replace(/[^\d]/g, '')}" style="color:${C.blue};text-decoration:none">${escapeHtml(p)}</a> &middot; `).join('')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><meta name="color-scheme" content="dark"/><meta name="supported-color-schemes" content="dark"/></head>
<body style="margin:0;padding:0;background:${C.page}" bgcolor="${C.page}">
<div style="display:none;max-height:0;overflow:hidden;color:${C.page}">${escapeHtml(opts.preheader)}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="${C.page}" style="background:${C.page}"><tr><td align="center" style="padding:24px 10px">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="${C.card}" style="width:100%;max-width:600px;background:${C.card};border:1px solid ${C.line};border-radius:20px;font-family:${FONT}">
    <tr><td style="padding:24px 28px 0"><a href="${SITE}"><img src="${LOGO}" alt="Gennoor Tech" width="150" style="display:block;border:0;max-width:150px"/></a></td></tr>
    <tr><td style="padding:26px 28px 30px;font-family:${FONT}">${bodyHtml}</td></tr>
    <tr><td style="padding:20px 28px 24px;border-top:1px solid ${C.line};font-family:${FONT}">
      <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:${C.text}">${escapeHtml(sig.name)}</p>
      <p style="margin:0 0 8px;font-size:11px;letter-spacing:1.4px;color:${C.muted}">GENNOOR TECH &middot; TRAIN &middot; INNOVATE &middot; BUILD</p>
      <p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted}">${phones}${emails.map((e) => `<a href="mailto:${e}" style="color:${C.blue};text-decoration:none">${e}</a>`).join(' &middot; ')} &middot; <a href="${SITE}" style="color:${C.blue};text-decoration:none">www.gennoor.com</a></p>
      <p style="margin:14px 0 0;font-size:12.5px;line-height:1.5;color:#6f84a6">Not useful? Reply with the word stop and I will not write again.</p>
    </td></tr>
  </table>
</td></tr></table>
</body></html>`
}
