import { NextRequest, NextResponse } from 'next/server'
import { requireCrmUser } from '@/lib/crm/access'
import { listDocuments, uploadDocument, deleteDocument } from '@/lib/crm/documents'

// Document library: 2-page manuals (manuals/...), webinar posters (posters/...),
// and any other attachments used in outreach.
export async function GET() {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const documents = await listDocuments()
    return NextResponse.json({ documents })
  } catch (error) {
    console.error('List documents error:', error)
    return NextResponse.json({ error: 'Failed to list documents' }, { status: 500 })
  }
}

const MAX_SIZE = 15 * 1024 * 1024 // 15 MB

export async function POST(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const folder = String(form.get('folder') || 'general')
    if (!file) return NextResponse.json({ error: 'file is required' }, { status: 400 })
    if (file.size > MAX_SIZE) return NextResponse.json({ error: 'File too large (max 15 MB)' }, { status: 400 })
    if (!['manuals', 'posters', 'general'].includes(folder)) {
      return NextResponse.json({ error: 'folder must be manuals, posters or general' }, { status: 400 })
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._ -]/g, '_')
    const blobName = `${folder}/${safeName}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await uploadDocument(blobName, buffer, file.type || 'application/octet-stream')

    return NextResponse.json({ success: true, name: blobName })
  } catch (error) {
    console.error('Upload document error:', error)
    return NextResponse.json({ error: 'Failed to upload document' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const user = await requireCrmUser()
  if (!user?.isManager) return NextResponse.json({ error: 'Only managers can delete documents' }, { status: 403 })

  try {
    const name = req.nextUrl.searchParams.get('name')
    if (!name) return NextResponse.json({ error: 'name required' }, { status: 400 })
    await deleteDocument(name)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
  }
}
