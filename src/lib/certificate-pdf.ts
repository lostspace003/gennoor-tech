import PDFDocument from 'pdfkit'
import type { Certificate } from './certificates'
import { courses as configCourses } from '@/config/courses'

/**
 * Generate a branded PDF for a course-completion or workshop certificate.
 *
 * Layout: landscape A4 (842 x 595pt). Navy header band carrying recipient
 * name + course title, amber/gold accents, body with credential details,
 * footer with verify URL. Academy certs use the course's own theme color
 * for the header band; workshop certs use the default Gennoor navy.
 *
 * Pure pdfkit — no browser, no native deps beyond what's already in
 * package.json. Returns the final PDF as a single Buffer.
 */
export async function generateCertificatePdf(cert: Certificate): Promise<Buffer> {
  // Look up the course (if academy) for the themed header band
  const isAcademy = cert.certId.toUpperCase().startsWith('GNR-ACAD-')
  const course = isAcademy ? configCourses.find(c => c.id === cert.workshopSlug) : undefined
  const theme = course?.theme

  // Color palette — default Gennoor brand colors; override header band when course theme is present
  const navy = theme?.navy || '#1B2845'
  const primary = theme?.primary || '#1B2845'
  const primaryDeep = theme?.primaryDeep || '#2A3960'
  const amber = '#FFD23F'
  const orange = '#FF6B35'
  const cream = '#FFF8F0'
  const text = '#1B2845'
  const muted = '#5C6784'

  const doc = new PDFDocument({
    size: 'A4',
    layout: 'landscape',
    margin: 0,
    info: {
      Title: `Certificate of Completion — ${cert.recipientName}`,
      Author: 'Gennoor Tech',
      Subject: cert.workshopTitle,
      Keywords: `certificate, ${cert.workshopSlug}, ${isAcademy ? 'gennoor academy' : 'gennoor tech'}`,
    },
  })

  const chunks: Buffer[] = []
  doc.on('data', chunk => chunks.push(chunk as Buffer))

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    // Page dimensions (A4 landscape)
    const W = 842
    const H = 595

    // Outer border — subtle cream frame
    doc.rect(0, 0, W, H).fill(cream)

    // Header band — themed gradient effect (two-tone fill since pdfkit gradients are awkward)
    const headerH = 220
    doc.rect(0, 0, W, headerH).fill(navy)
    // Subtle inner band for depth
    if (theme) {
      doc.rect(0, headerH - 8, W, 8).fill(primary)
      doc.rect(0, headerH - 4, W, 4).fill(amber)
    } else {
      doc.rect(0, headerH - 4, W, 4).fill(amber)
    }

    // Decorative corner accents — amber dots
    const dot = (cx: number, cy: number, r: number, c: string) => {
      doc.circle(cx, cy, r).fill(c)
    }
    dot(50, 50, 6, amber)
    dot(70, 50, 4, orange)
    dot(W - 50, 50, 6, amber)
    dot(W - 70, 50, 4, orange)

    // Header content — eyebrow + recipient name + workshop title
    doc.fillColor(amber)
      .font('Helvetica-Bold')
      .fontSize(11)
      .text(
        isAcademy ? 'GENNOOR ACADEMY · CERTIFICATE OF COMPLETION' : 'GENNOOR TECH · CERTIFICATE OF COMPLETION',
        60,
        58,
        { width: W - 120, align: 'center', characterSpacing: 2 },
      )

    doc.fillColor('#FFFFFFCC')
      .font('Helvetica')
      .fontSize(11)
      .text('THIS IS TO CERTIFY THAT', 60, 95, { width: W - 120, align: 'center', characterSpacing: 3 })

    doc.fillColor('#FFFFFF')
      .font('Helvetica-Bold')
      .fontSize(36)
      .text(cert.recipientName, 60, 115, { width: W - 120, align: 'center' })

    doc.fillColor('#FFFFFFCC')
      .font('Helvetica')
      .fontSize(11)
      .text('has successfully completed the', 60, 165, { width: W - 120, align: 'center' })

    doc.fillColor(amber)
      .font('Helvetica-Bold')
      .fontSize(18)
      .text(cert.workshopTitle, 60, 184, { width: W - 120, align: 'center' })

    // Body — credential details (2x2 grid of fact blocks)
    const bodyTop = headerH + 30
    const colW = (W - 160) / 2

    const factBlock = (x: number, y: number, label: string, value: string, sub?: string) => {
      doc.fillColor(muted).font('Helvetica-Bold').fontSize(8)
        .text(label.toUpperCase(), x, y, { characterSpacing: 1.5 })
      doc.fillColor(text).font('Helvetica-Bold').fontSize(13)
        .text(value, x, y + 14, { width: colW - 10 })
      if (sub) {
        doc.fillColor(muted).font('Helvetica').fontSize(9)
          .text(sub, x, y + 32, { width: colW - 10 })
      }
    }

    const formatDate = (iso: string) => {
      if (!iso) return ''
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return iso
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    }

    const formatDuration = (minutes: number) => {
      if (!minutes || minutes < 1) return ''
      const h = Math.floor(minutes / 60)
      const m = minutes % 60
      if (h && m) return `${h}h ${m}m`
      if (h) return `${h}h`
      return `${m}m`
    }

    const durationLabel = formatDuration(cert.durationMinutes)

    // Top-left: Issue date
    factBlock(80, bodyTop, 'Issue Date', formatDate(cert.workshopDate), durationLabel ? `Duration: ${durationLabel}` : undefined)
    // Top-right: Credential ID
    factBlock(W / 2 + 20, bodyTop, 'Credential ID', cert.certId)
    // Bottom-left: Issued By
    factBlock(80, bodyTop + 70, 'Issued By', cert.issuerName, 'gennoor.com')
    // Bottom-right: Verification
    factBlock(
      W / 2 + 20,
      bodyTop + 70,
      'Status',
      'Verified & Active',
      isAcademy ? 'Self-paced · Gennoor Academy' : (cert.trainerName ? `Trainer: ${cert.trainerName}` : undefined),
    )

    // Footer — verify URL band
    const footerH = 70
    const footerY = H - footerH
    doc.rect(0, footerY, W, footerH).fill(cream)
    // Top hairline
    doc.rect(0, footerY, W, 1).fill('#e6dfd4')

    doc.fillColor(muted).font('Helvetica').fontSize(8)
      .text('VERIFY THIS CREDENTIAL', 60, footerY + 16, { characterSpacing: 1.5 })
    doc.fillColor(text).font('Helvetica-Bold').fontSize(11)
      .text(cert.verifyUrl, 60, footerY + 32, { width: W / 2 - 40 })

    // Right side — issuer signature line
    doc.fillColor(muted).font('Helvetica').fontSize(8)
      .text('ISSUED BY', W - 280, footerY + 16, { characterSpacing: 1.5, width: 220, align: 'right' })
    doc.fillColor(primaryDeep).font('Helvetica-Bold').fontSize(13)
      .text(cert.issuerName, W - 280, footerY + 30, { width: 220, align: 'right' })

    doc.end()
  })
}
