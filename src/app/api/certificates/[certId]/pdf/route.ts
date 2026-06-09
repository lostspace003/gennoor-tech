import { NextRequest, NextResponse } from 'next/server'
import { getCertificate, downloadCertificatePdf } from '@/lib/certificates'
import { rateLimit, clientIp } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ certId: string }> }
) {
  const { certId } = await params

  // Cert IDs are guessable in principle — throttle per IP so they can't be
  // enumerated for recipient names/emails.
  if (!rateLimit(`cert-pdf:${clientIp(req.headers)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  if (!certId || !/^[A-Z0-9-]{4,80}$/i.test(certId)) {
    return NextResponse.json({ error: 'Invalid certificate ID' }, { status: 400 })
  }

  try {
    const cert = await getCertificate(certId)
    if (!cert || !cert.pdfBlobPath) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
    }

    const pdf = await downloadCertificatePdf(cert.pdfBlobPath)
    if (!pdf) {
      return NextResponse.json({ error: 'Certificate file not found' }, { status: 404 })
    }

    const safeName = cert.recipientName.replace(/[^a-zA-Z0-9 _-]+/g, '').replace(/\s+/g, '_')
    const filename = `Gennoor_Tech_Certificate_${safeName || cert.certId}.pdf`

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': String(pdf.length),
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
      },
    })
  } catch (err) {
    console.error('Certificate PDF API error:', err)
    return NextResponse.json({ error: 'Failed to retrieve certificate' }, { status: 500 })
  }
}
