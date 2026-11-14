import { escapeHtml } from '@/lib/escape-html'

// One email shell for every light email the site sends: the logo on a light band, the body on white, a light
// foot. It is light all the way down, like the site's day look.
//
// The owner (13 November 2026), about the navy band this shell used to open with (a small logo at the left of a
// wide dark strip, then a blue line): "looks very blank ... I don't like that black color or blue color ...
// When it comes to our logo, we can have it defined more appropriately." So: no dark band and no dark foot, in
// this shell or in any email that builds its own top (use emailTop() and emailFoot() there). The top is one
// picture, drawn by `node scripts/email-art/logo.mjs` in the brand's own lettering: email apps cannot draw the
// logo themselves (they remove SVG and have no brand fonts), and one picture looks the same in Outlook, in
// Gmail and on a phone.
const SITE = 'https://www.gennoor.com'
const HEADER = `${SITE}/email/header.png`
const FONT = "'Segoe UI',Arial,sans-serif"

/**
 * The top of a light email: the logo, in the middle of its light band. Under it, when the email has one, a
 * title and a line (what used to be written in white on a dark strip: "Your call is confirmed").
 */
export function emailTop(title?: string, line?: string): string {
  const head = `<a href="${SITE}" style="display:block;text-decoration:none"><img src="${HEADER}" alt="Gennoor Tech" width="620" style="display:block;border:0;width:100%;max-width:100%;height:auto"/></a>`
  if (!title) return head
  return `${head}<div style="padding:26px 28px 0;text-align:center;font-family:${FONT}">
    <h1 style="margin:0;font-size:23px;line-height:1.25;color:#0f172a;font-weight:800;letter-spacing:-0.01em">${title}</h1>
    ${line ? `<p style="margin:6px 0 0;font-size:14px;line-height:1.5;color:#64748b">${line}</p>` : ''}
  </div>`
}

/**
 * The foot of a light email: who it is from and how to reach us, in dark words on a light ground.
 * `emails` are the addresses to write to (info@ when none is given); `contactHtml` replaces the whole line.
 */
export function emailFoot(opts?: { name?: string; tagline?: string; emails?: string[]; contactHtml?: string; note?: string; unsubscribeUrl?: string }): string {
  const link = 'color:#2563EB;text-decoration:none'
  const contact = opts?.contactHtml || `${(opts?.emails?.length ? opts.emails : ['info@gennoor.com']).map((e) => `<a href="mailto:${e}" style="${link}">${e}</a>`).join(' · ')} · <a href="${SITE}" style="${link}">www.gennoor.com</a>`
  return `<div style="background:#f5f7fb;border-top:1px solid #e2e8f0;padding:20px 30px 22px;font-family:${FONT}">
    <p style="color:#0f172a;margin:0 0 2px;font-size:13.5px;font-weight:700">${escapeHtml(opts?.name || 'Gennoor Tech')}</p>
    <p style="color:#64748b;margin:0 0 8px;font-size:11px;letter-spacing:1.2px">${opts?.tagline || 'TRAIN · INNOVATE · BUILD'}</p>
    <p style="color:#475569;margin:0;font-size:12.5px;line-height:1.6">${contact}</p>
    <p style="color:#64748b;margin:8px 0 0;font-size:11px">${opts?.note || 'Gennoor Tech · Mumbai, India'}</p>
    ${opts?.unsubscribeUrl ? `<p style="color:#64748b;margin:10px 0 0;font-size:11px;line-height:1.5">You get this once a week because you asked for new posts by email on gennoor.com. <a href="${opts.unsubscribeUrl}" style="color:#475569;text-decoration:underline">Unsubscribe</a></p>` : ''}
  </div>`
}
const ICON = (name: string) => `${SITE}/email/icon-${name}.png`

export type EmailIcon = 'file' | 'play' | 'call' | 'calendar' | 'learn' | 'chat' | 'check' | 'team' | 'mail'

// ---- Building blocks (table based, so Outlook and Gmail render them the same) ----

/** Big greeting / title at the top of the body. */
export function emailTitle(title: string, lead?: string): string {
  return `<h1 style="margin:0 0 10px;font-size:25px;line-height:1.25;color:#0f172a;font-weight:800;letter-spacing:-0.01em">${title}</h1>${
    lead ? `<p style="margin:0 0 22px;font-size:16px;line-height:1.65;color:#475569">${lead}</p>` : '<div style="height:12px"></div>'
  }`
}

/** One strong call-to-action button (bulletproof: a padded table cell, not CSS on a link). */
export function emailButton(label: string, href: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:26px auto 8px"><tr>
    <td align="center" bgcolor="#2563EB" style="border-radius:10px;background:#2563EB">
      <a href="${href}" style="display:inline-block;padding:15px 38px;font-family:'Segoe UI',Arial,sans-serif;font-size:16px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px">${label}</a>
    </td></tr></table>`
}

/** Numbered steps: a blue disc with the number, a bold line and one short sentence. */
export function emailSteps(steps: { title: string; body?: string }[], heading?: string): string {
  return `${heading ? `<p style="margin:26px 0 12px;font-size:12px;font-weight:700;letter-spacing:1.6px;color:#64748b;text-transform:uppercase">${heading}</p>` : ''}
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${steps
    .map(
      (st, i) => `<tr>
      <td width="44" valign="top" style="padding:0 0 16px">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td width="32" height="32" align="center" valign="middle" bgcolor="#2563EB" style="background:#2563EB;border-radius:16px;color:#ffffff;font-size:15px;font-weight:700;font-family:'Segoe UI',Arial,sans-serif">${i + 1}</td></tr></table>
      </td>
      <td valign="top" style="padding:3px 0 16px;font-size:15px;line-height:1.55;color:#475569"><strong style="color:#0f172a;font-size:16px">${st.title}</strong>${st.body ? `<br/>${st.body}` : ''}</td>
    </tr>`
    )
    .join('')}</table>`
}

/** A highlighted note with an icon: the thing the reader should not miss (e.g. the attachment). */
export function emailCallout(icon: EmailIcon, title: string, body: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0;background:#f4f7ff;border:1px solid #dbe6ff;border-radius:12px"><tr>
    <td width="76" valign="top" style="padding:18px 0 18px 18px"><img src="${ICON(icon)}" width="48" height="48" alt="" style="display:block;border:0"/></td>
    <td valign="top" style="padding:18px 20px 18px 14px;font-size:15px;line-height:1.55;color:#475569"><strong style="color:#0f172a;font-size:16px">${title}</strong><br/>${body}</td>
  </tr></table>`
}

/** Icon rows: three or four short points, each with its own icon. */
export function emailIconRows(rows: { icon: EmailIcon; title: string; body: string }[]): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:6px 0 4px">${rows
    .map(
      (r) => `<tr>
      <td width="60" valign="top" style="padding:8px 0"><img src="${ICON(r.icon)}" width="44" height="44" alt="" style="display:block;border:0"/></td>
      <td valign="top" style="padding:8px 0 10px;font-size:15px;line-height:1.5;color:#475569"><strong style="color:#0f172a;font-size:16px">${r.title}</strong><br/>${r.body}</td>
    </tr>`
    )
    .join('')}</table>`
}

/** A tidy label / value card ("Your request"). Rows with no value disappear. */
export function emailDetails(title: string, rows: [string, string | undefined | null][]): string {
  const filled = rows.filter(([, v]) => v)
  if (!filled.length) return ''
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:22px 0;border:1px solid #e2e8f0;border-radius:12px">
    <tr><td colspan="2" style="padding:14px 18px 6px;font-size:12px;font-weight:700;letter-spacing:1.6px;color:#64748b;text-transform:uppercase">${title}</td></tr>
    ${filled
      .map(
        ([k, v], i) => `<tr>
      <td width="38%" valign="top" style="padding:9px 0 9px 18px;font-size:14px;color:#64748b;${i < filled.length - 1 ? 'border-bottom:1px solid #f1f5f9;' : ''}">${k}</td>
      <td valign="top" style="padding:9px 18px 9px 8px;font-size:14px;color:#0f172a;font-weight:600;${i < filled.length - 1 ? 'border-bottom:1px solid #f1f5f9;' : ''}">${escapeHtml(String(v))}</td>
    </tr>`
      )
      .join('')}
    <tr><td colspan="2" style="height:8px;line-height:8px;font-size:0">&nbsp;</td></tr>
  </table>`
}

/** Quiet contact line under the body. */
export function emailContact(opts?: { email?: string; phone?: boolean }): string {
  const email = opts?.email || 'info@gennoor.com'
  return `<p style="margin:26px 0 0;padding-top:18px;border-top:1px solid #e2e8f0;font-size:14px;line-height:1.7;color:#64748b">
    Questions? Write to <a href="mailto:${email}" style="color:#2563EB;text-decoration:none;font-weight:600">${email}</a>${
      opts?.phone === false ? '' : ` or WhatsApp <a href="https://wa.me/919326352241" style="color:#2563EB;text-decoration:none;font-weight:600">+91 93263 52241</a>`
    }.</p>`
}

export function emailShell(
  bodyHtml: string,
  opts?: {
    preheader?: string
    senderEmail?: string
    senderName?: string
    /**
     * CRM outreach: the team member who actually worked the lead. Their name,
     * direct number and own gennoor.com address replace the generic block, so
     * the lead knows exactly who to reply to or call back.
     */
    signature?: { name: string; email: string; phones?: string[] }
    /**
     * Marketing mail only. Renders the unsubscribe line in the footer; pair it
     * with `unsubscribeUrl` on sendEmail so the List-Unsubscribe headers match.
     * Never set on transactional mail (OTP, certificates, booking confirmations).
     */
    unsubscribeUrl?: string
  }
): string {
  const sig = opts?.signature
  // Contact line: the signer's own address first, admin@ always reachable.
  const sender = (sig?.email || opts?.senderEmail || '').trim().toLowerCase()
  const emails = [...new Set([sender, 'admin@gennoor.com'].filter(Boolean))]
  const displayName = sig?.name || opts?.senderName || 'Gennoor Tech'
  const link = 'color:#2563EB;text-decoration:none'
  const phoneHtml = (sig?.phones || [])
    .filter(Boolean)
    .map((p) => `<a href="tel:+${p.replace(/[^\d]/g, '')}" style="${link}">${escapeHtml(p)}</a> · `)
    .join('')
  const contactHtml = `${phoneHtml}${emails.map((e) => `<a href="mailto:${e}" style="${link}">${e}</a>`).join(' · ')} · <a href="${SITE}" style="${link}">www.gennoor.com</a>`
  // A table, not a div: old Outlook lays emails out with Word, which keeps a table to its width and lets a div run
  // the whole width of the window.
  return `
  <div style="background:#eef2f8;padding:24px 12px;margin:0">
    ${opts?.preheader ? `<div style="display:none;max-height:0;overflow:hidden">${escapeHtml(opts.preheader)}</div>` : ''}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="620" align="center" bgcolor="#ffffff" style="width:100%;max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;font-family:${FONT}">
      <tr><td style="padding:0">${emailTop()}</td></tr>
      <tr><td style="padding:32px 30px 30px;color:#374151;font-size:15px;line-height:1.7;font-family:${FONT}">
        ${bodyHtml}
      </td></tr>
      <tr><td style="padding:0">${emailFoot({ name: displayName, tagline: sig ? 'GENNOOR TECH · TRAIN · INNOVATE · BUILD' : 'TRAIN · INNOVATE · BUILD', contactHtml, unsubscribeUrl: opts?.unsubscribeUrl })}</td></tr>
    </table>
  </div>`
}

// Bare URLs in plain-text drafts become clickable links (runs on already
// escaped text, so `&` appears as `&amp;` — valid inside href too).
function linkifyUrls(escaped: string): string {
  return escaped.replace(/https?:\/\/[^\s<]+/g, (m) => {
    const url = m.replace(/[.,;:!?)]+$/, '')
    const trail = m.slice(url.length)
    return `<a href="${url}" style="color:#2563EB;text-decoration:underline">${url}</a>${trail}`
  })
}

// Plain-text body → clean paragraphs
export function textToHtml(bodyText: string): string {
  return linkifyUrls(escapeHtml(bodyText))
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;white-space:pre-line">${p}</p>`)
    .join('')
}

// Markdown (headings/bullets/bold) → presentable email HTML — used for the
// weekly GennoorCare business report so it never lands as raw markdown.
export function markdownToEmailHtml(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inList = false
  const closeList = () => { if (inList) { out.push('</ul>'); inList = false } }
  const inline = (s: string) =>
    escapeHtml(s)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#2563EB">$1</a>')
  for (const raw of lines) {
    const line = raw.trim()
    if (!line) { closeList(); continue }
    if (line.startsWith('# ')) { closeList(); out.push(`<h2 style="margin:0 0 6px;font-size:19px;color:#0f172a">${inline(line.slice(2))}</h2>`); continue }
    if (line.startsWith('## ')) { closeList(); out.push(`<h3 style="margin:18px 0 8px;font-size:15px;color:#0f172a;border-bottom:1px solid #e2e8f0;padding-bottom:5px">${inline(line.slice(3))}</h3>`); continue }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) { out.push('<ul style="margin:0 0 10px;padding-left:20px">'); inList = true }
      out.push(`<li style="margin:0 0 5px">${inline(line.replace(/^[-*]\s+/, ''))}</li>`)
      continue
    }
    closeList()
    out.push(`<p style="margin:0 0 10px">${inline(line)}</p>`)
  }
  closeList()
  return out.join('')
}
