import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { downloadDocument, getDocumentSasUrl } from '@/lib/crm/documents'

// Streams a document from the CRM library for inline preview or download.
export async function GET(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const name = req.nextUrl.searchParams.get('name')
  if (!name || name.includes('..')) return NextResponse.json({ error: 'name required' }, { status: 400 })

  try {
    // ?sas=1 → short-lived public URL for the Office web viewer (docx/xlsx/pptx)
    if (req.nextUrl.searchParams.get('sas') === '1') {
      const url = await getDocumentSasUrl(name, 10)
      return NextResponse.json({ url })
    }

    const doc = await downloadDocument(name)
    if (!doc) return NextResponse.json({ error: 'Document not found' }, { status: 404 })

    const download = req.nextUrl.searchParams.get('download') === '1'
    const filename = name.split('/').pop() || 'document'
    return new NextResponse(new Uint8Array(doc.content), {
      headers: {
        'Content-Type': doc.contentType,
        'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${filename.replace(/"/g, '')}"`,
        'Cache-Control': 'private, max-age=300',
      },
    })
  } catch (error) {
    console.error('Document file error:', error)
    return NextResponse.json({ error: 'Failed to load document' }, { status: 500 })
  }
}
