import { NextRequest, NextResponse } from 'next/server'
import { TableClient } from '@azure/data-tables'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { authorized } = await verifyAdmin(request)
    if (!authorized) return unauthorizedResponse()

    const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING
    if (!connStr) return NextResponse.json({ summary: {}, scoreDist: [], recentReports: [], feedback: [] })

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - 90)
    const cutoffStr = cutoff.toISOString().slice(0, 10)

    const reports: any[] = []
    try {
      const client = TableClient.fromConnectionString(connStr, 'AIReadinessReports')
      for await (const entity of client.listEntities({
        queryOptions: { filter: `PartitionKey ge '${cutoffStr}'` },
      })) {
        reports.push({
          date: entity.partitionKey,
          email: entity.email || '',
          name: entity.name || '',
          reportType: entity.reportType || '',
          action: entity.action || 'generate',
          overallScore: entity.overallScore || 0,
          headline: entity.headline || '',
          generatedAt: entity.generatedAt || entity.timestamp || '',
        })
      }
    } catch (err: any) {
      if (!err?.message?.includes('TableNotFound') && err?.statusCode !== 404) throw err
    }

    const blueprints: any[] = []
    try {
      const client = TableClient.fromConnectionString(connStr, 'AIReadinessBlueprints')
      for await (const entity of client.listEntities({
        queryOptions: { filter: `PartitionKey ge '${cutoffStr}'` },
      })) {
        blueprints.push({
          date: entity.partitionKey,
          email: entity.email || '',
          name: entity.name || '',
          reportType: 'blueprint',
          role: entity.role || '',
          category: entity.category || '',
          subcategory: entity.subcategory || '',
          overallScore: entity.overallScore || 0,
          headline: entity.headline || '',
          agentsUsed: entity.agentsUsed || '',
          referencesCount: entity.referencesCount || 0,
          generatedAt: entity.generatedAt || entity.timestamp || '',
        })
      }
    } catch (err: any) {
      if (!err?.message?.includes('TableNotFound') && err?.statusCode !== 404) throw err
    }

    const feedback: any[] = []
    try {
      const client = TableClient.fromConnectionString(connStr, 'AIReadinessFeedback')
      for await (const entity of client.listEntities({
        queryOptions: { filter: `PartitionKey ge '${cutoffStr}'` },
      })) {
        feedback.push({
          date: entity.partitionKey,
          email: entity.email || '',
          name: entity.name || '',
          rating: entity.rating || 0,
          comment: entity.comment || '',
          reportType: entity.reportType || '',
          action: entity.action || '',
          orgInterest: entity.orgInterest || '',
          submittedAt: entity.submittedAt || entity.timestamp || '',
        })
      }
    } catch (err: any) {
      if (!err?.message?.includes('TableNotFound') && err?.statusCode !== 404) throw err
    }

    const generations = reports.filter(r => r.action === 'generate' || r.action === '')
    const quickScans = generations.filter(r => r.reportType === 'quick-scan').length
    const deepDives = generations.filter(r => r.reportType === 'deep-dive').length
    const emailsSent = reports.filter(r => r.action === 'email-sent').length
    const downloads = reports.filter(r => r.action === 'pdf-download').length

    const allScored = [...generations, ...blueprints].filter(r => r.overallScore > 0)
    const scoreDist = Array.from({ length: 10 }, (_, i) => ({
      name: `${i * 10}-${i * 10 + 9}`,
      value: allScored.filter(r => r.overallScore >= i * 10 && r.overallScore < (i + 1) * 10).length,
    }))

    const avgRating = feedback.length > 0
      ? parseFloat((feedback.reduce((sum, f) => sum + (f.rating || 0), 0) / feedback.length).toFixed(1))
      : 0

    const orgLeads = feedback.filter(f => f.orgInterest === 'yes').length

    return NextResponse.json({
      summary: {
        totalGenerations: generations.length + blueprints.length,
        quickScans,
        deepDives,
        blueprints: blueprints.length,
        emailsSent,
        downloads,
        avgRating,
        totalFeedback: feedback.length,
        orgLeads,
      },
      scoreDist,
      recentReports: [...generations, ...blueprints]
        .sort((a, b) => (b.generatedAt || '').localeCompare(a.generatedAt || ''))
        .slice(0, 50),
      feedback: feedback.sort((a, b) => (b.submittedAt || '').localeCompare(a.submittedAt || '')).slice(0, 30),
    })
  } catch (error) {
    console.error('AI Readiness admin error:', error)
    return NextResponse.json({ error: 'Failed to fetch AI readiness data' }, { status: 500 })
  }
}
