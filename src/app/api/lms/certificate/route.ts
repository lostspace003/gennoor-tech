import { NextRequest, NextResponse } from 'next/server'
import { buildPdfDownloadUrl, buildVerifyUrl, findCertificateByRecipient } from '@/lib/certificates'
import { flattenItems, getLmsProgress } from '@/lib/lms'
import { issueLmsCertificate } from '@/lib/issue-lms-cert'
import { noStore, requireEnrolled } from '@/lib/lms-guard'

export const dynamic = 'force-dynamic'

// The certificate this learner already holds for the course, if any.
export async function GET(req: NextRequest) {
  const gate = await requireEnrolled(req.nextUrl.searchParams.get('slug'))
  if (gate instanceof NextResponse) return gate
  const cert = await findCertificateByRecipient(gate.course.slug, gate.learner.email)
  return NextResponse.json(
    cert ? { issued: true, verifyUrl: buildVerifyUrl(cert.certId), pdfUrl: buildPdfDownloadUrl(cert.certId) } : { issued: false },
    { headers: noStore },
  )
}

// Issue it once every lesson is done and every quiz is passed - checked here, not in the browser.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const gate = await requireEnrolled(body.slug ?? null)
  if (gate instanceof NextResponse) return gate

  const progress = await getLmsProgress(gate.learner.email, gate.course.slug)
  const items = flattenItems(gate.course)
  const open = items.filter(i => !progress[i.id]?.done)
  if (open.length > 0) {
    return NextResponse.json(
      { error: 'Finish every lesson and pass every quiz to get your certificate.', remaining: open.length },
      { status: 403, headers: noStore },
    )
  }

  const r = await issueLmsCertificate(gate.course, { email: gate.learner.email, name: gate.learner.name })
  return NextResponse.json({ issued: true, alreadyIssued: r.alreadyIssued, verifyUrl: r.verifyUrl, pdfUrl: r.pdfUrl }, { headers: noStore })
}
