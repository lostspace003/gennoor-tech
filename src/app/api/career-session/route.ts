import { NextRequest, NextResponse } from 'next/server'
import { saveCareerSession, uploadResume } from '@/lib/azure-storage'

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
      const status = formData.get('status') as string || 'submitted'
      const file = formData.get('resume') as File | null

      let resumeBlobPath = ''
      let resumeFileName = ''

      if (file && file.size > 0) {
        resumeFileName = file.name
        const buffer = Buffer.from(await file.arrayBuffer())
        const blobUrl = await uploadResume(sessionId, file.name, buffer)
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
