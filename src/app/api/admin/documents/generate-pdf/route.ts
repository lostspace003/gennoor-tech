import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { PDFGenerator } from '@/lib/pdf-generator'
import { BlobServiceClient } from '@azure/storage-blob'

const connectionString = `DefaultEndpointsProtocol=https;AccountName=stgennoortech;AccountKey=${process.env.AZURE_STORAGE_KEY};EndpointSuffix=core.windows.net`

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { type, leadId, lead } = await request.json()

    // Generate PDF
    const generator = new PDFGenerator()
    const pdfBlob = await generator.generateDeck(type, lead)

    // Upload to Azure Storage
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient('crm-documents')
    await containerClient.createIfNotExists({ access: 'blob' })

    const fileName = `${type}-deck-${Date.now()}.pdf`
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)

    // Convert blob to buffer
    const buffer = await pdfBlob.arrayBuffer()
    await blockBlobClient.uploadData(Buffer.from(buffer), {
      blobHTTPHeaders: { blobContentType: 'application/pdf' }
    })

    // Return as downloadable file
    const headers = new Headers()
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Disposition', `attachment; filename="${type}-deck.pdf"`)

    return new NextResponse(pdfBlob, { headers })

  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 })
  }
}