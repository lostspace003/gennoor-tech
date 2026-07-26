import { escapeHtml } from '@/lib/escape-html'

// One professional email shell for every CRM/GennoorCare email. Real brand
// logo (PNG — email clients don't render SVG), navy header, clean footer.
const LOGO = 'https://www.gennoor.com/logos/gennoor-tech-horizontal-white_760x260_website-header.png'
const SITE = 'https://www.gennoor.com'

export function emailShell(bodyHtml: string, opts?: { preheader?: string }): string {
  return `
  <div style="background:#f1f5f9;padding:24px 12px;margin:0">
    ${opts?.preheader ? `<div style="display:none;max-height:0;overflow:hidden">${escapeHtml(opts.preheader)}</div>` : ''}
    <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;font-family:'Segoe UI',Arial,sans-serif">
      <div style="background:#0C1426;padding:22px 28px;text-align:left">
        <a href="${SITE}"><img src="${LOGO}" alt="Gennoor Tech" width="190" style="display:block;border:0;max-width:190px"/></a>
      </div>
      <div style="padding:30px 28px;color:#374151;font-size:15px;line-height:1.7">
        ${bodyHtml}
      </div>
      <div style="background:#0C1426;padding:16px 28px">
        <p style="color:#94a3b8;margin:0;font-size:12px">
          <a href="mailto:admin@gennoor.com" style="color:#93b4ff;text-decoration:none">admin@gennoor.com</a> ·
          <a href="https://wa.me/919326352241" style="color:#93b4ff;text-decoration:none">+91 9326352241</a> ·
          <a href="${SITE}" style="color:#93b4ff;text-decoration:none">www.gennoor.com</a>
        </p>
      </div>
    </div>
  </div>`
}

// Plain-text body → clean paragraphs
export function textToHtml(bodyText: string): string {
  return escapeHtml(bodyText)
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
