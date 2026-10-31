import { NextRequest, NextResponse } from 'next/server'
import * as XLSX from 'xlsx'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

/** Turns rows into a tidy Excel file: frozen bold header, sized columns, filters, and clickable email and LinkedIn cells. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const rows: Record<string, any>[] = (Array.isArray(b.rows) ? b.rows : []).slice(0, 5000)
  if (!rows.length) return NextResponse.json({ error: 'Nothing to export.' }, { status: 400 })
  const cols: { key: string; head: string; w: number }[] = [
    { key: 'name', head: 'Name', w: 26 }, { key: 'degree', head: 'Connection', w: 11 }, { key: 'title', head: 'Title', w: 40 }, { key: 'company', head: 'Company', w: 28 },
    { key: 'location', head: 'Location', w: 26 }, { key: 'email', head: 'Email', w: 34 }, { key: 'emailStatus', head: 'Email check', w: 12 }, { key: 'linkedin', head: 'LinkedIn', w: 38 }, { key: 'note', head: 'Note', w: 30 },
  ].filter(c => rows.some(r => r[c.key]))
  const ws = XLSX.utils.aoa_to_sheet([cols.map(c => c.head), ...rows.map(r => cols.map(c => String(r[c.key] ?? '')))])
  rows.forEach((r, i) => cols.forEach((c, j) => {
    const cell = ws[XLSX.utils.encode_cell({ r: i + 1, c: j })]
    if (!cell || !r[c.key]) return
    if (c.key === 'email') cell.l = { Target: `mailto:${r.email}` }
    if (c.key === 'linkedin' && /^https?:\/\//.test(String(r.linkedin))) cell.l = { Target: String(r.linkedin) }
  }))
  ws['!cols'] = cols.map(c => ({ wch: c.w }))
  ws['!autofilter'] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: rows.length, c: cols.length - 1 } }) }
  ws['!views'] = [{ state: 'frozen', ySplit: 1 }] as any
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Prospects')
  const buf: Buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const name = String(b.name || 'prospects').replace(/[^\w-]+/g, '-').slice(0, 40)
  return new NextResponse(buf as any, { headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'Content-Disposition': `attachment; filename="${name}-${new Date().toISOString().slice(0, 10)}.xlsx"` } })
}
