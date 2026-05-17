import { NextRequest, NextResponse } from 'next/server'
import { getCertificate, downloadCertificatePdf } from '@/lib/certificates'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ certId: string }> }
) {
  const { certId } = await params

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

    return new NextResponse(pdf, {
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
