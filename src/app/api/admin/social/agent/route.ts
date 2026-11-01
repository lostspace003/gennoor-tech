import { NextRequest } from 'next/server'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { agentFetch } from '@/lib/social/agent-service'
import { createAgentDraft, recordSpend, type TraceStep } from '@/lib/social/studio'
import { getRefs } from '@/lib/social/references'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/**
 * Runs the agent team (research, write, design, review, render) and streams each step to the browser as NDJSON.
 * The final result is saved as a normal draft, so it can be edited, approved and published like any other.
 */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const topic = String(b.topic || '').trim()
  if (topic.length < 3) return Response.json({ error: 'Give the agents a topic.' }, { status: 400 })
  const mode = b.mode === 'motion' ? 'motion' : 'post'
  const refs = await getRefs(Array.isArray(b.refIds) ? b.refIds.map(String) : [])

  // Reference text for the service: only the extracted text blobs are read here (images are not sent to the agents).
  const { readBlob } = await import('@/lib/social/studio')
  const texts: string[] = []
  for (const r of refs.filter(r => r.kind !== 'image')) {
    const raw = await readBlob(`social/refs/${r.id}.json`)
    if (raw) texts.push(`--- ${r.name} ---\n${JSON.parse(raw.toString('utf-8')).text}`)
  }

  let upstream: Response
  try {
    upstream = await agentFetch('/run', { topic, brief: String(b.brief || ''), references: texts.join('\n\n').slice(0, 38_000), mode }, req.signal)
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Agent service unreachable.' }, { status: 502 })
  }
  if (!upstream.ok || !upstream.body) return Response.json({ error: `Agent service returned ${upstream.status}.` }, { status: 502 })

  const enc = new TextEncoder()
  const dec = new TextDecoder()
  const trace: TraceStep[] = []
  const spend: { label: string; usd: number; tokens?: number }[] = []
  let pending = ''

  const out = new ReadableStream({
    async start(ctrl) {
      const send = (o: unknown) => ctrl.enqueue(enc.encode(JSON.stringify(o) + '\n'))
      // A tiny heartbeat every few seconds, so no proxy or browser ever sees a long silence while a step is thinking.
      const beat = setInterval(() => { try { send({ type: 'ping' }) } catch { /* the browser has gone */ } }, 8000)
      const handle = async (line: string) => {
        if (!line.trim()) return
        const ev = JSON.parse(line)
        if (ev.type === 'step' && ev.status === 'done') {
          trace.push({ agent: ev.agent, label: ev.label, output: String(ev.output || '').slice(0, 12000), usd: ev.usd || 0 })
          if (ev.usd) spend.push({ label: `${ev.label} agent`, usd: ev.usd, tokens: ev.tokens })
        }
        if (ev.type === 'result') {
          const draft = await createAgentDraft(topic, ev, trace, refs)
          for (const s of spend) await recordSpend(draft.id, s.label, s.usd, s.tokens)
          send({ type: 'result', draftId: draft.id, review: ev.review, usd: ev.usd })
          return
        }
        if (ev.type === 'delta') { send({ type: 'delta', agent: ev.agent, text: ev.text }); return }
        send(ev)
      }
      try {
        const reader = upstream.body!.getReader()
        for (;;) {
          const { done, value } = await reader.read()
          if (done) break
          pending += dec.decode(value, { stream: true })
          const lines = pending.split('\n')
          pending = lines.pop() || ''
          for (const l of lines) await handle(l)
        }
        if (pending.trim()) await handle(pending)
      } catch (e: any) {
        send({ type: 'error', message: e?.message || 'Stream failed' })
      } finally {
        clearInterval(beat)
        try { ctrl.close() } catch { /* already closed */ }
      }
    },
  })
  return new Response(out, { headers: { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-store' } })
}
