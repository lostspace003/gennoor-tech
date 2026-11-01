import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { agentFetch } from '@/lib/social/agent-service'
import { getDraft, getImage, saveMotion } from '@/lib/social/studio'
import { withDraftImage } from '@/lib/social/scene'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

const MOTIONS = ['zoom-in', 'zoom-out', 'pan-left', 'pan-right']

/**
 * "Animate an AI image": turns the draft's generated image into a short looping GIF with camera motion and an
 * optional caption. The scene refers to the picture as {ref: 'draft'}, so it stays small and editable; the image bytes
 * are filled in only when rendering. No AI model is called, so this is free.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const { id } = await params
  const d = await getDraft(id)
  if (!d) return NextResponse.json({ error: 'Not found.' }, { status: 404 })
  const img = d.hasImage ? await getImage(id) : null
  if (!img) return NextResponse.json({ error: 'Generate the image first, then animate it.' }, { status: 400 })

  const b = await req.json().catch(() => ({}))
  const motion = MOTIONS.includes(b.motion) ? b.motion : 'zoom-in'
  const seconds = Math.min(10, Math.max(3, Number(b.seconds) || 6))
  const caption = String(b.caption || '').trim().slice(0, 120)
  const scene = {
    width: 1080, height: 1080, fps: 15, duration: seconds,
    background: { from: '#0b1b3a', to: '#1d4ed8', angle: 135 },
    elements: [
      { type: 'image', ref: 'draft', motion },
      ...(caption ? [
        { type: 'shape', shape: 'rect', x: 0, y: 0.68, w: 1, h: 0.2, color: '#0b1b3a', in: { at: 0.4, dur: 0.6, anim: 'fade' } },
        { type: 'text', text: caption, x: 0.5, y: 0.78, size: 52, bold: true, color: '#ffffff', max_width: 0.86, in: { at: 0.6, dur: 0.7, anim: 'slide-up' } },
      ] : []),
    ],
  }
  try {
    const res = await agentFetch('/render', { scene: withDraftImage(scene, img) })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) return NextResponse.json({ error: j.detail || `Renderer returned ${res.status}.` }, { status: 502 })
    return NextResponse.json({ draft: await saveMotion(id, j, scene) })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Renderer unreachable.' }, { status: 502 })
  }
}
