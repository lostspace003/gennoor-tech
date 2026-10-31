import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { agentFetch } from '@/lib/social/agent-service'
import { getDraft, getImage, getMotion, saveMotion } from '@/lib/social/studio'
import { withDraftImage } from '@/lib/social/scene'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

/** Serves the motion graphic (?type=gif | mp4) for preview and download. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const type = req.nextUrl.searchParams.get('type') === 'mp4' ? 'mp4' : 'gif'
  const buf = await getMotion((await params).id, type)
  if (!buf) return new NextResponse(null, { status: 404 })
  return new NextResponse(new Uint8Array(buf), {
    headers: {
      'Content-Type': type === 'mp4' ? 'video/mp4' : 'image/gif', 'Cache-Control': 'private, no-store',
      ...(req.nextUrl.searchParams.get('download') ? { 'Content-Disposition': `attachment; filename="gennoor-motion.${type}"` } : {}),
    },
  })
}

/** Re-renders the motion graphic from an edited scene spec. No model is called, so it costs nothing. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  if (!(await getDraft(id))) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const b = await req.json().catch(() => ({}))
  if (!b.scene || typeof b.scene !== 'object') return NextResponse.json({ error: 'Send the scene to render.' }, { status: 400 })
  try {
    const img = await getImage(id)
    const res = await agentFetch('/render', { scene: img ? withDraftImage(b.scene, img) : b.scene, mp4: true })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) return NextResponse.json({ error: j.detail || `Renderer returned ${res.status}.` }, { status: 502 })
    return NextResponse.json({ draft: await saveMotion(id, j, b.scene) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Renderer unreachable.' }, { status: 502 })
  }
}
