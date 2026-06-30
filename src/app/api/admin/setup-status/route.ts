import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { authorized } = await verifyAdmin(request)
    if (!authorized) return unauthorizedResponse()

    // Check which environment variables and services are configured
    const checks = {
      // Admin Secret
      adminSecret: {
        label: 'Admin Secret',
        description: 'Protects admin API endpoints and dashboard access',
        configured: !!process.env.ADMIN_SECRET,
        guide: 'Guide-Admin-Secret-Setup.md',
      },

      // Google Analytics 4
      ga4MeasurementId: {
        label: 'Google Analytics 4',
        description: 'Tracks page views, user behavior, and conversions',
        configured: !!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        value: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '',
        guide: 'Guide-GA4-Verify.md',
      },

      // Google Search Console (verified via sitemap)
      sitemap: {
        label: 'Sitemap (for Search Console)',
        description: 'XML sitemap at /sitemap.xml for Google indexing',
        configured: true, // always true since sitemap.ts exists
        value: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/sitemap.xml`,
        guide: 'Guide-Google-Search-Console-Verify.md',
      },

      // Azure Storage
      azureStorage: {
        label: 'Azure Table Storage',
        description: 'Stores page views, comments, and enquiries',
        configured: !!process.env.AZURE_STORAGE_CONNECTION_STRING,
      },

      // Azure App Insights
      appInsights: {
        label: 'Azure Application Insights',
        description: 'Server-side telemetry, performance monitoring',
        configured: !!process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
      },

      // Azure Communication Services Email
      smtp: {
        label: 'Azure Communication Services Email',
        description: 'Sends enquiry confirmations and admin notifications via Azure Communication Services',
        configured: !!process.env.AZURE_COMMUNICATION_CONNECTION_STRING,
        value: process.env.EMAIL_FROM_TRAINING || 'training@gennoor.com',
      },

      // Azure OpenAI
      azureOpenAI: {
        label: 'Azure OpenAI (GPT-4o)',
        description: 'Powers AI field extraction in career coach',
        configured: !!(process.env.AZURE_OPENAI_ENDPOINT && process.env.AZURE_OPENAI_API_KEY),
        value: process.env.AZURE_OPENAI_DEPLOYMENT || '',
      },

      // Site URL
      siteUrl: {
        label: 'Site URL',
        description: 'Public-facing URL used in emails and sitemaps',
        configured: !!process.env.NEXT_PUBLIC_SITE_URL,
        value: process.env.NEXT_PUBLIC_SITE_URL || '',
      },

      // Blob storage URL
      blobUrl: {
        label: 'Blob Storage URL',
        description: 'Public path for media files (PDFs, images)',
        configured: !!process.env.NEXT_PUBLIC_BLOB_URL,
        value: process.env.NEXT_PUBLIC_BLOB_URL || '',
      },
    }

    // Determine environment
    const env = process.env.NODE_ENV || 'unknown'
    const isAzure = !!process.env.WEBSITE_INSTANCE_ID || !!process.env.WEBSITE_NODE_DEFAULT_VERSION
    let platform = 'Local'
    if (isAzure) platform = 'Azure'

    const totalChecks = Object.keys(checks).length
    const configuredCount = Object.values(checks).filter(c => c.configured).length

    return NextResponse.json({
      environment: env,
      platform,
      totalChecks,
      configuredCount,
      checks,
    })
  } catch (error) {
    console.error('Setup status error:', error)
    return NextResponse.json({ error: 'Failed to check setup' }, { status: 500 })
  }
}
