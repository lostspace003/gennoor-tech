import {
  saveCertificate,
  findCertificateByRecipient,
  generateCertId,
  buildVerifyUrl,
  uploadCertificatePdf,
  type Certificate,
} from '@/lib/certificates'
import { generateCertificatePdf } from '@/lib/certificate-pdf'
import { courses as configCourses } from '@/config/courses'
import { courses as academyCourses } from '@/data/academy/courses'

export interface IssueCourseCertResult {
  cert: Certificate
  verifyUrl: string
  alreadyIssued: boolean
  pdfReady: boolean
}

/**
 * Session-independent academy certificate issuance.
 *
 * Shared by:
 *  - /api/learner/courses/[courseId]/issue-cert  (legacy logged-in flow)
 *  - /api/learner/courses/[courseId]/claim-cert  (no-login OTP claim flow)
 *
 * Issuance is idempotent — if a certificate already exists for this
 * recipient (email) + courseId pair, the existing certificate is returned
 * with `alreadyIssued: true`.
 *
 * Completion gating and auth are the CALLER's responsibility — this function
 * only builds, generates, and persists the credential.
 */
export async function issueCourseCertificate(
  courseId: string,
  recipient: { email: string; name: string },
): Promise<IssueCourseCertResult> {
  const course = configCourses.find(c => c.id === courseId)
  if (!course) {
    throw new Error(`Course not found: ${courseId}`)
  }

  // Idempotent — return existing cert if already issued
  const existing = await findCertificateByRecipient(courseId, recipient.email)
  if (existing) {
    return {
      cert: existing,
      verifyUrl: buildVerifyUrl(existing.certId),
      alreadyIssued: true,
      pdfReady: !!existing.pdfBlobPath,
    }
  }

  // Compute course details for the cert
  const academyMeta = academyCourses.find(a => a.slug === courseId)
  const totalMinutes = course.chapters.reduce((sum, ch) => sum + (ch.estimatedMinutes || 0), 0)
  const now = new Date()
  const issueDateIso = now.toISOString()

  const certId = generateCertId(courseId, now.getUTCFullYear())
  const certPayload = {
    certId,
    recipientName: recipient.name,
    recipientEmail: recipient.email,
    workshopSlug: courseId,
    workshopTitle: course.title,
    workshopSubtitle: academyMeta?.subtitle || course.description,
    workshopDate: issueDateIso,
    issueDate: issueDateIso,
    durationMinutes: totalMinutes,
    trainerName: 'Gennoor Academy',
    issuerName: 'Gennoor Tech',
    issuerDomain: 'gennoor.com',
    pdfBlobPath: '',
    verifyUrl: buildVerifyUrl(certId),
  }

  // Generate + upload PDF before the save (so the cert row exists even if
  // PDF generation fails — verify page degrades gracefully).
  let pdfBlobPath = ''
  try {
    const pdfBuffer = await generateCertificatePdf({
      ...certPayload,
      status: 'issued',
      createdAt: issueDateIso,
    })
    pdfBlobPath = await uploadCertificatePdf(certId, pdfBuffer)
  } catch (err) {
    console.error('[issue-course-cert] PDF generation failed', { certId, courseId, err })
    // Continue — cert is still issued as a web credential; PDF can be regenerated later.
  }

  const cert = await saveCertificate({
    ...certPayload,
    pdfBlobPath,
  })

  return {
    cert,
    verifyUrl: buildVerifyUrl(certId),
    alreadyIssued: false,
    pdfReady: !!pdfBlobPath,
  }
}
