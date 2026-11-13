import { NextRequest } from 'next/server'
import { briefWithIconRule } from '@/lib/blog-icon'
import { verifyAdmin, unauthorizedResponse } from '@/lib/admin-auth'
import { agentFetch } from '@/lib/social/agent-service'
import { READER_CHECK, articleRules } from '@/lib/writing-rules'
import { createBlogDraft, dateLabel, taxonomy } from '@/lib/blog-studio'
import { getRefs } from '@/lib/social/references'
import { readBlob, recordSpend } from '@/lib/social/studio'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

/** Runs the blog agent team (research, write, package, review), streams each step, and saves the result as a draft. */
export async function POST(req: NextRequest) {
  const { authorized } = await verifyAdmin(req)
  if (!authorized) return unauthorizedResponse()
  const b = await req.json().catch(() => ({}))
  const topic = String(b.topic || '').trim()
  if (topic.length < 3) return Response.json({ error: 'Give the agents a topic.' }, { status: 400 })

  const refs = await getRefs(Array.isArray(b.refIds) ? b.refIds.map(String) : [])
  const texts: string[] = []
  for (const r of refs.filter(r => r.kind !== 'image')) {
    const raw = await readBlob(`social/refs/${r.id}.json`)
    if (raw) texts.push(`--- ${r.name} ---\n${JSON.parse(raw.toString('utf-8')).text}`)
  }
  const t = taxonomy()
  const today = new Date().toISOString().slice(0, 10)
  const context = { date: today, dateLabel: dateLabel(today), categories: t.categories.map(c => c.name), tags: t.tags.slice(0, 150).map(x => x.name), posts: t.posts.slice(0, 60) }

  let upstream: Response
  try {
    upstream = await agentFetch('/blog', { topic, brief: briefWithIconRule(String(b.brief || '').slice(0, 10_000)), references: texts.join('\n\n').slice(0, 38_000), context, rules: articleRules(), review_rules: READER_CHECK }, req.signal)
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Agent service unreachable.' }, { status: 502 })
  }
  if (!upstream.ok || !upstream.body) return Response.json({ error: `Agent service returned ${upstream.status}.` }, { status: 502 })

  const enc = new TextEncoder(), dec = new TextDecoder()
  const trace: { agent: string; label: string; output: string; usd: number }[] = []
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
          const draft = await createBlogDraft(topic, ev, trace)
          for (const s of spend) await recordSpend(`blog-${draft.id}`, s.label, s.usd, s.tokens)
          send({ type: 'result', draftId: draft.id, review: ev.review, usd: ev.usd })
          return
        }
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
