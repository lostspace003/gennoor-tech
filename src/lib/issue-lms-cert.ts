import {
  saveCertificate,
  findCertificateByRecipient,
  generateCertId,
  buildVerifyUrl,
  buildPdfDownloadUrl,
  uploadCertificatePdf,
  type Certificate,
} from '@/lib/certificates'
import { generateCertificatePdf } from '@/lib/certificate-pdf'
import type { LmsCourse } from '@/lib/lms'

export interface IssueLmsCertResult {
  cert: Certificate
  verifyUrl: string
  pdfUrl: string
  alreadyIssued: boolean
}

/**
 * Gennoor Tech certificate of completion for a Labs course - the same
 * credential, verify page and PDF as the interactive courses, issued by
 * Gennoor (never by the vendor). Idempotent per learner + course. The caller
 * checks that the course is really complete.
 */
export async function issueLmsCertificate(course: LmsCourse, recipient: { email: string; name: string }): Promise<IssueLmsCertResult> {
  const existing = await findCertificateByRecipient(course.slug, recipient.email)
  if (existing) {
    return { cert: existing, verifyUrl: buildVerifyUrl(existing.certId), pdfUrl: buildPdfDownloadUrl(existing.certId), alreadyIssued: true }
  }

  let seconds = 0
  for (const s of course.sections) for (const i of s.items) if (i.type === 'lecture') seconds += i.durationSec || 0

  const now = new Date()
  const iso = now.toISOString()
  const certId = generateCertId(course.slug, now.getUTCFullYear())
  const payload = {
    certId,
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    workshopSlug: course.slug,
    workshopTitle: course.title,
    workshopSubtitle: course.subtitle,
    workshopDate: iso,
    issueDate: iso,
    durationMinutes: Math.round(seconds / 60),
    trainerName: 'Gennoor Academy',
    issuerName: 'Gennoor Tech',
    issuerDomain: 'gennoor.com',
    pdfBlobPath: '',
    verifyUrl: buildVerifyUrl(certId),
  }

  let pdfBlobPath = ''
  try {
    const pdf = await generateCertificatePdf({ ...payload, status: 'issued', createdAt: iso })
    pdfBlobPath = await uploadCertificatePdf(certId, pdf)
  } catch (err) {
    console.error('[issue-lms-cert] PDF generation failed', { certId, slug: course.slug, err })
  }

  const cert = await saveCertificate({ ...payload, pdfBlobPath })
  return { cert, verifyUrl: buildVerifyUrl(certId), pdfUrl: buildPdfDownloadUrl(certId), alreadyIssued: false }
}
