import { NextRequest, NextResponse } from 'next/server'
import { findLmsItem, isLabFilesZip, signBlobUrl } from '@/lib/lms'
import { noStore, requireEnrolled } from '@/lib/lms-guard'

// A short-lived link to one attached document of a lecture.
export async function GET(req: NextRequest) {
  const gate = await requireEnrolled(req.nextUrl.searchParams.get('slug'))
  if (gate instanceof NextResponse) return gate
  const item = findLmsItem(gate.course, req.nextUrl.searchParams.get('item') || '')
  if (!item || item.type !== 'lecture') return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const res = item.resources.find(r => r.name === req.nextUrl.searchParams.get('name'))
  if (!res || !(/\.pdf$/i.test(res.name) || isLabFilesZip(res.name))) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const zip = /\.zip$/i.test(res.name)
  const asDownload = zip || req.nextUrl.searchParams.get('download') === '1'
  const url = signBlobUrl(gate.course.container, res.blob, 15, asDownload ? { inline: false, filename: res.name } : { inline: true, contentType: 'application/pdf' })
  return NextResponse.json({ url, download: asDownload }, { headers: noStore })
}
