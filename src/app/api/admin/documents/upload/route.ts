import { NextRequest, NextResponse } from 'next/server'
import { BlobServiceClient } from '@azure/storage-blob'
import { auth } from '@/lib/auth'

// Use existing storage account
const connectionString = `DefaultEndpointsProtocol=https;AccountName=stgennoortech;AccountKey=${process.env.AZURE_STORAGE_KEY};EndpointSuffix=core.windows.net`
const containerName = 'crm-documents'

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const leadId = formData.get('leadId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Create blob service client
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    const containerClient = blobServiceClient.getContainerClient(containerName)

    // Create container if it doesn't exist
    await containerClient.createIfNotExists({ access: 'blob' })

    // Generate unique filename
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name}`
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // Upload file
    await blockBlobClient.uploadData(Buffer.from(buffer), {
      blobHTTPHeaders: { blobContentType: file.type }
    })

    // Return file info
    return NextResponse.json({
      id: `doc-${timestamp}`,
      name: file.name,
      type: file.type.includes('pdf') ? 'pdf' : 'document',
      url: blockBlobClient.url,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      leadId: leadId || null
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}