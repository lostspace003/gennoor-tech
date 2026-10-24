import { escapeHtml } from '@/lib/escape-html'

// One professional email shell for every CRM/GennoorCare email. Real brand
// logo (PNG — email clients don't render SVG), navy header, clean footer.
// The bright dark-bg variant keeps the logo readable on the navy header.
const LOGO = 'https://www.gennoor.com/logos/gennoor-tech-horizontal-dark-bright_760x260_email-header.png'
const SITE = 'https://www.gennoor.com'
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
  const phoneHtml = (sig?.phones || [])
    .filter(Boolean)
    .map((p) => `<a href="tel:+${p.replace(/[^\d]/g, '')}" style="color:#93b4ff;text-decoration:none">${escapeHtml(p)}</a> · `)
    .join('')
  return `
  <div style="background:#f1f5f9;padding:24px 12px;margin:0">
    ${opts?.preheader ? `<div style="display:none;max-height:0;overflow:hidden">${escapeHtml(opts.preheader)}</div>` : ''}
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;font-family:'Segoe UI',Arial,sans-serif">
      <div style="background:#0C1426;padding:22px 28px;text-align:left">
        <a href="${SITE}"><img src="${LOGO}" alt="Gennoor Tech" width="190" style="display:block;border:0;max-width:190px"/></a>
      </div>
      <div style="height:4px;line-height:4px;font-size:0;background:#2563EB;background-image:linear-gradient(90deg,#2563EB 0%,#2563EB 82%,#F59E0B 82%,#F59E0B 100%)">&nbsp;</div>
      <div style="padding:34px 30px 30px;color:#374151;font-size:15px;line-height:1.7">
        ${bodyHtml}
      </div>
      <div style="background:#0C1426;padding:18px 28px">
        <p style="color:#ffffff;margin:0 0 2px;font-size:13px;font-weight:600">${escapeHtml(displayName)}</p>
        <p style="color:#A8C3EF;margin:0 0 8px;font-size:11px;letter-spacing:1px">${sig ? 'GENNOOR TECH · TRAIN · INNOVATE · BUILD' : 'TRAIN · INNOVATE · BUILD'}</p>
        <p style="color:#94a3b8;margin:0;font-size:12px">
          ${phoneHtml}${emails.map((e) => `<a href="mailto:${e}" style="color:#93b4ff;text-decoration:none">${e}</a>`).join(' · ')} ·
          <a href="${SITE}" style="color:#93b4ff;text-decoration:none">www.gennoor.com</a>
        </p>
        <p style="color:#64748b;margin:8px 0 0;font-size:11px">Gennoor Tech · Mumbai, India</p>
        ${
          opts?.unsubscribeUrl
            ? `<p style="color:#64748b;margin:10px 0 0;font-size:11px;line-height:1.5">
                 You are receiving this because you subscribed on gennoor.com.
                 <a href="${opts.unsubscribeUrl}" style="color:#94a3b8;text-decoration:underline">Unsubscribe</a>
               </p>`
            : ''
        }
      </div>
    </div>
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
