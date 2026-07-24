import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { BlobServiceClient } from '@azure/storage-blob'
import * as XLSX from 'xlsx'
import { sql } from '@vercel/postgres'
import fs from 'fs/promises'
import path from 'path'

// Azure Storage configuration
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING!
const containerName = 'leads-data'

// Authorized emails
const AUTHORIZED_EMAILS = [
  'admin@gennoor.com',
  'contact@gennoor.com',
  'yusufchaudhary@gennoor.com',
  'jalalkhan@gennoor.com'
]

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !AUTHORIZED_EMAILS.includes(session.user?.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Try to load from Azure Storage first
    if (connectionString) {
      try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
        const containerClient = blobServiceClient.getContainerClient(containerName)

        // List all Excel files
        const blobs = []
        for await (const blob of containerClient.listBlobsFlat()) {
          if (blob.name.endsWith('.xlsx') || blob.name.endsWith('.xls')) {
            blobs.push(blob.name)
          }
        }

        if (blobs.length > 0) {
          // Download the most recent file
          const blobName = blobs[blobs.length - 1]
          const blobClient = containerClient.getBlobClient(blobName)
          const downloadBlockBlobResponse = await blobClient.download(0)
          const buffer = await streamToBuffer(downloadBlockBlobResponse.readableStreamBody!)

          // Parse Excel
          const workbook = XLSX.read(buffer, { type: 'buffer' })
          const sheets = []
          let allLeads = []

          for (const sheetName of workbook.SheetNames) {
            const worksheet = workbook.Sheets[sheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: 'NA' })

            const processedData = jsonData.map((row: any, index: number) => ({
              id: `${sheetName}-${index}`,
              ...normalizeLeadData(row)
            }))

            sheets.push({
              name: sheetName,
              data: processedData
            })

            if (sheetName === workbook.SheetNames[0]) {
              allLeads = processedData
            }
          }

          return NextResponse.json({
            leads: allLeads,
            sheets: sheets.length > 1 ? sheets : [],
            source: 'azure'
          })
        }
      } catch (azureError) {
        console.log('Azure Storage not configured or error:', azureError)
      }
    }

    // Fallback to local file
    try {
      const filePath = path.join(process.cwd(), 'gennoor-outreach', 'Gennoor_GCC_and_Institute_Contacts.xlsx')
      const fileBuffer = await fs.readFile(filePath)

      const workbook = XLSX.read(fileBuffer, { type: 'buffer' })
      const sheets = []
      let allLeads = []

      for (const sheetName of workbook.SheetNames) {
        const worksheet = workbook.Sheets[sheetName]
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: 'NA' })

        const processedData = jsonData.map((row: any, index: number) => ({
          id: `${sheetName}-${index}`,
          ...normalizeLeadData(row)
        }))

        sheets.push({
          name: sheetName,
          data: processedData
        })

        if (sheetName === workbook.SheetNames[0]) {
          allLeads = processedData
        }
      }

      return NextResponse.json({
        leads: allLeads,
        sheets: sheets.length > 1 ? sheets : [],
        source: 'local'
      })

    } catch (localError) {
      console.error('Error loading local Excel:', localError)

      // Return empty state
      return NextResponse.json({
        leads: [],
        sheets: [],
        source: 'none'
      })
    }

  } catch (error) {
    console.error('Error loading Excel data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !AUTHORIZED_EMAILS.includes(session.user?.email || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Read file buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Parse Excel
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const processedSheets = []
    const allLeads = []

    for (const sheetName of workbook.SheetNames) {
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: 'NA' })

      const processedData = jsonData.map((row: any) => normalizeLeadData(row))
      processedSheets.push({
        name: sheetName,
        data: processedData,
        count: processedData.length
      })

      // Store in database
      for (const lead of processedData) {
        try {
          const result = await sql`
            INSERT INTO leads (
              name, email, phone, company, designation, industry,
              location, website, linkedin, source, status, priority,
              tags, notes, assigned_to, score, created_by, sheet_name
            ) VALUES (
              ${lead.Name}, ${lead.Email}, ${lead.Phone}, ${lead.Company},
              ${lead.Designation}, ${lead.Industry}, ${lead.Location},
              ${lead.Website}, ${lead.LinkedIn}, ${lead.Source || 'excel'},
              ${lead.Status || 'new'}, ${lead.Priority || 'medium'},
              ${JSON.stringify(lead.Tags ? lead.Tags.split(',').map((t: string) => t.trim()) : [])},
              ${lead.Notes}, ${lead.AssignedTo || session.user?.email},
              ${lead.Score || 50}, ${session.user?.email}, ${sheetName}
            ) ON CONFLICT (email) DO UPDATE SET
              name = EXCLUDED.name,
              company = EXCLUDED.company,
              updated_at = CURRENT_TIMESTAMP
            RETURNING *
          `
          allLeads.push(result.rows[0])
        } catch (dbError) {
          console.error('Error inserting lead:', dbError)
        }
      }
    }

    // Save to Azure Storage if configured
    if (connectionString) {
      try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
        const containerClient = blobServiceClient.getContainerClient(containerName)

        // Create container if it doesn't exist
        await containerClient.createIfNotExists({ access: 'blob' })

        // Upload file with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const blobName = `uploads/${timestamp}_${file.name}`
        const blockBlobClient = containerClient.getBlockBlobClient(blobName)

        await blockBlobClient.upload(buffer, buffer.length, {
          blobHTTPHeaders: {
            blobContentType: file.type
          },
          metadata: {
            uploadedBy: session.user?.email || '',
            uploadedAt: new Date().toISOString()
          }
        })
      } catch (azureError) {
        console.error('Error uploading to Azure:', azureError)
      }
    }

    // Trigger reindexing
    fetch(process.env.INDEXER_SERVICE_URL + '/index', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'excel_upload' })
    }).catch(console.error)

    return NextResponse.json({
      success: true,
      sheets: processedSheets,
      totalLeads: allLeads.length,
      message: `Successfully processed ${allLeads.length} leads from ${processedSheets.length} sheets`
    })

  } catch (error) {
    console.error('Error processing Excel file:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper function to normalize lead data
function normalizeLeadData(row: any): any {
  // Map common variations of column names
  const mappings: Record<string, string[]> = {
    Name: ['name', 'Name', 'Contact', 'contact', 'Full Name', 'full_name'],
    Email: ['email', 'Email', 'E-mail', 'e-mail', 'EmailAddress', 'email_address'],
    Phone: ['phone', 'Phone', 'Mobile', 'mobile', 'Contact Number', 'contact_number'],
    Company: ['company', 'Company', 'Organization', 'organization', 'Company Name', 'company_name'],
    Designation: ['designation', 'Designation', 'Title', 'title', 'Position', 'position', 'Role', 'role'],
    Industry: ['industry', 'Industry', 'Sector', 'sector', 'Domain', 'domain'],
    Location: ['location', 'Location', 'City', 'city', 'Address', 'address', 'Region', 'region'],
    Website: ['website', 'Website', 'URL', 'url', 'Web', 'web', 'Site', 'site'],
    LinkedIn: ['linkedin', 'LinkedIn', 'Linkedin', 'LinkedInURL', 'linkedin_url'],
    Source: ['source', 'Source', 'Lead Source', 'lead_source'],
    Status: ['status', 'Status', 'Lead Status', 'lead_status'],
    Priority: ['priority', 'Priority', 'Importance', 'importance'],
    Tags: ['tags', 'Tags', 'Labels', 'labels', 'Categories', 'categories'],
    Notes: ['notes', 'Notes', 'Comments', 'comments', 'Remarks', 'remarks'],
    Score: ['score', 'Score', 'Rating', 'rating', 'Rank', 'rank'],
  }

  const normalized: any = {}

  // Map fields using the mappings
  for (const [targetField, possibleNames] of Object.entries(mappings)) {
    for (const possibleName of possibleNames) {
      if (row[possibleName] !== undefined) {
        normalized[targetField] = row[possibleName]
        break
      }
    }
    // Set to 'NA' if not found and not a special field
    if (normalized[targetField] === undefined && !['Score', 'Tags', 'Notes'].includes(targetField)) {
      normalized[targetField] = 'NA'
    }
  }

  // Include any other fields that aren't mapped
  for (const [key, value] of Object.entries(row)) {
    if (!Object.values(mappings).flat().includes(key)) {
      normalized[key] = value
    }
  }

  return normalized
}

// Helper function to convert stream to buffer
async function streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    readableStream.on('data', (data) => {
      chunks.push(data instanceof Buffer ? data : Buffer.from(data))
    })
    readableStream.on('end', () => {
      resolve(Buffer.concat(chunks))
    })
    readableStream.on('error', reject)
  })
}