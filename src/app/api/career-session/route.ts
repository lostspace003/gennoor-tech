import { NextRequest, NextResponse } from 'next/server'
import { saveCareerSession, uploadResume } from '@/lib/azure-storage'

const RESUME_MAX_BYTES = 5 * 1024 * 1024
const RESUME_ALLOWED_EXT = new Set(['pdf', 'doc', 'docx', 'txt', 'rtf'])

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''

    // Handle multipart form (with resume file)
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const sessionId = formData.get('sessionId') as string
      const agentId = formData.get('agentId') as string
      const agentName = formData.get('agentName') as string
      const inputFields = JSON.parse(formData.get('inputFields') as string || '{}')
      const aiResults = JSON.parse(formData.get('aiResults') as string || '{}')
      const contactInfoRaw = formData.get('contactInfo') as string | null
      const contactInfo = contactInfoRaw ? JSON.parse(contactInfoRaw) : undefined
      const status = formData.get('status') as string || 'submitted'
      const file = formData.get('resume') as File | null

      let resumeBlobPath = ''
      let resumeFileName = ''

      if (file && file.size > 0) {
        if (file.size > RESUME_MAX_BYTES) {
          return NextResponse.json({ error: 'Resume must be 5 MB or smaller' }, { status: 400 })
        }
        const ext = (file.name.split('.').pop() || '').toLowerCase()
        if (!RESUME_ALLOWED_EXT.has(ext)) {
          return NextResponse.json(
            { error: 'Resume must be a PDF, Word document, or text file' },
            { status: 400 },
          )
        }
        // Strip path separators and odd characters so the filename can't
        // alter the blob path.
        resumeFileName = file.name.replace(/[^a-zA-Z0-9 ._-]+/g, '_')
        const buffer = Buffer.from(await file.arrayBuffer())
        const blobUrl = await uploadResume(sessionId, resumeFileName, buffer)
        resumeBlobPath = blobUrl || ''
      }

      await saveCareerSession({
        sessionId,
        agentId,
        agentName,
        inputFields,
        aiResults,
        resumeFileName,
        resumeBlobPath,
        contactInfo,
        status,
      })

      return NextResponse.json({ success: true, sessionId })
    }

    // Handle JSON (update with AI results)
    const data = await req.json()
    await saveCareerSession({
      sessionId: data.sessionId,
      agentId: data.agentId,
      agentName: data.agentName,
      inputFields: data.inputFields || {},
      aiResults: data.aiResults || {},
      resumeFileName: data.resumeFileName || '',
      resumeBlobPath: data.resumeBlobPath || '',
      contactInfo: data.contactInfo,
      status: data.status || 'completed',
    })

    return NextResponse.json({ success: true, sessionId: data.sessionId })
  } catch (error: any) {
    console.error('Career session save error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to save session' },
      { status: 500 }
    )
  }
}
