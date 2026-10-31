import { randomBytes } from 'crypto'
import { hhmmToMinutes, localParts } from '@/lib/autopilot/time'
import { isTransient, mentionsAvoided, similar, withRetry } from '@/lib/autopilot/engine'
import type { TopicIdea } from '@/lib/autopilot/types'

// Daily blog autopilot: research a topic, write the post, review it (revising up to twice when the reviewer asks),
// approve it, and send it down the publishing flow (pull request -> merge -> live -> LinkedIn) with nobody in the loop.
// If the post still does not pass after its revisions, it is held for you instead of being published.
export interface BlogAutoConfig {
  enabled: boolean
  /** Local time of day the day's article is started. */
  time: string
  tz: string
  perDay: number
  autoMerge: boolean
  shareToLinkedIn: boolean
  maxRevisions: number
}
export const DEFAULT_BLOG_AUTO: BlogAutoConfig = { enabled: true, time: '06:30', tz: 'Asia/Kolkata', perDay: 1, autoMerge: true, shareToLinkedIn: true, maxRevisions: 2 }

export interface Run {
  n: number
  status: 'pending' | 'submitted' | 'held' | 'failed'
  step: 'topic' | 'draft' | 'review' | 'submit'
  attempts: number
  topic?: TopicIdea
  draftId?: string
  revisions: number
  notes: string[]
  reason?: string
  at?: string
}
export interface AutoState {
  config: BlogAutoConfig
  days: Record<string, { date: string; runs: Run[] }>
  history: { at: string; title: string }[]
  lock?: { until: string; by: string }
  lastTick?: string
  log: { at: string; msg: string }[]
}
export const emptyAutoState = (): AutoState => ({ config: DEFAULT_BLOG_AUTO, days: {}, history: [], log: [] })

export interface AutoDeps {
  now(): Date
  load(): Promise<AutoState>
  save(s: AutoState): Promise<void>
  sleep(ms: number): Promise<void>
  research(ctx: { date: string; recent: string[] }): Promise<TopicIdea[]>
  /** Titles of articles already on the site or in progress, so topics are not repeated. */
  published(): Promise<string[]>
  avoidKeywords(): Promise<string[]>
  generate(topic: TopicIdea): Promise<{ draftId: string; review: { verdict: string; notes: string[] } }>
  review(draftId: string): Promise<{ verdict: string; notes: string[] }>
  revise(draftId: string, notes: string[]): Promise<void>
  text(draftId: string): Promise<string>
  submit(draftId: string, opts: { autoMerge: boolean; shareToLinkedIn: boolean }): Promise<void>
  alert(subject: string, html: string, key: string): Promise<void>
}

const MAX_ATTEMPTS = 3
const iso = (d: Date) => d.toISOString()
const esc = (s: string) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)

export async function blogAutoTick(d: AutoDeps, opts: { force?: boolean } = {}): Promise<string[]> {
  const out: string[] = []
  const now = d.now()
  const s = await d.load()
  const cfg = s.config
  if (!cfg.enabled && !opts.force) return ['blog autopilot is off']
  if (s.lock && Date.parse(s.lock.until) > now.getTime()) return ['another run is in progress']
  const me = randomBytes(4).toString('hex')
  s.lock = { until: iso(new Date(now.getTime() + 20 * 60_000)), by: me }
  await d.save(s)
  await d.sleep(1200 + Math.floor(Math.random() * 800))
  if ((await d.load()).lock?.by !== me) return ['another run won the lock']

  try {
    const { date: today, minutes } = localParts(now, cfg.tz)
    s.lastTick = iso(now)
    if (minutes < hhmmToMinutes(cfg.time) && !opts.force) { return ['before the daily start time'] }
    let day = s.days[today]
    if (!day) {
      day = s.days[today] = { date: today, runs: Array.from({ length: Math.max(1, cfg.perDay) }, (_, i): Run => ({ n: i + 1, status: 'pending', step: 'topic', attempts: 0, revisions: 0, notes: [] })) }
    }
    const run = day.runs.find(r => r.status === 'pending')
    if (!run) return ['today is done']

    const fail = async (why: string) => {
      run.attempts++
      run.reason = why.slice(0, 300)
      out.push(`run ${run.n}: ${run.reason} (attempt ${run.attempts}/${MAX_ATTEMPTS})`)
      if (run.attempts >= MAX_ATTEMPTS) {
        run.status = 'failed'
        await d.alert('The daily blog autopilot could not finish', `<p>Today's article could not be completed after ${MAX_ATTEMPTS} attempts: ${esc(run.reason)}.</p><p>Nothing was published. You can write one in the Blog studio, or it will try again tomorrow.</p>`, `blogauto-fail-${today}-${run.n}`)
      }
      await d.save(s)
    }
    const hold = async (why: string) => {
      run.status = 'held'; run.reason = why
      out.push(`run ${run.n}: held (${why})`)
      await d.alert('A blog draft was held for your review', `<p>The daily blog autopilot wrote "${esc(run.topic?.title || '')}" but did <b>not</b> publish it: ${esc(why)}.</p><p>Open the Blog studio to edit, approve or delete the draft.</p>`, `blogauto-held-${today}-${run.n}`)
      await d.save(s)
    }

    try {
      // 1. Topic
      if (run.step === 'topic') {
        const published = await d.published()
        const recent = [...published, ...s.history.filter(h => Date.parse(h.at) > now.getTime() - 60 * 86_400_000).map(h => h.title)]
        const keywords = await d.avoidKeywords()
        const ideas = await withRetry(() => d.research({ date: today, recent }), { tries: 3, baseMs: 4000, sleep: d.sleep, retryable: isTransient })
        const pick = ideas.find(i => i.title && !recent.some(r => similar(r, i.title) > 0.5) && !mentionsAvoided(`${i.title} ${i.angle}`, keywords))
        if (!pick) { await fail('No fresh topic found today'); return out }
        run.topic = pick; run.step = 'draft'
        await d.save(s)
        out.push(`run ${run.n}: topic "${pick.title}"`)
      }

      // 2. Draft
      if (run.step === 'draft' && run.topic) {
        const r = await withRetry(() => d.generate(run.topic!), { tries: 3, baseMs: 5000, sleep: d.sleep, retryable: isTransient })
        run.draftId = r.draftId
        run.notes = r.review.verdict === 'pass' ? [] : r.review.notes
        run.step = r.review.verdict === 'pass' ? 'submit' : 'review'
        await d.save(s)
        out.push(`run ${run.n}: draft written, review ${r.review.verdict}`)
      }

      // 3. Review: revise and re-review, up to the limit
      if (run.step === 'review' && run.draftId) {
        let passed = false
        while (run.revisions < cfg.maxRevisions) {
          await withRetry(() => d.revise(run.draftId!, run.notes), { tries: 3, baseMs: 5000, sleep: d.sleep, retryable: isTransient })
          run.revisions++
          const r = await withRetry(() => d.review(run.draftId!), { tries: 3, baseMs: 4000, sleep: d.sleep, retryable: isTransient })
          out.push(`run ${run.n}: revision ${run.revisions}, review ${r.verdict}`)
          if (r.verdict === 'pass') { passed = true; break }
          run.notes = r.notes
          await d.save(s)
        }
        if (!passed) { await hold(`it did not pass review after ${run.revisions} revision${run.revisions === 1 ? '' : 's'}: ${run.notes.slice(0, 2).join(' | ').slice(0, 250)}`); return out }
        run.step = 'submit'
        await d.save(s)
      }

      // 4. Final screen, then approve and publish
      if (run.step === 'submit' && run.draftId) {
        const body = await d.text(run.draftId)
        const hit = mentionsAvoided(body, await d.avoidKeywords())
        if (hit) { await hold(`it mentions "${hit}", which is on the never-post list`); return out }
        await d.submit(run.draftId, { autoMerge: cfg.autoMerge, shareToLinkedIn: cfg.shareToLinkedIn })
        run.status = 'submitted'; run.reason = undefined; run.at = iso(d.now())
        s.history.push({ at: iso(now), title: run.topic?.title || '' }); s.history = s.history.slice(-200)
        s.log.push({ at: iso(now), msg: `Published "${run.topic?.title}" through the pipeline` }); s.log = s.log.slice(-100)
        await d.save(s)
        out.push(`run ${run.n}: approved and sent to the website`)
      }
    } catch (e: any) { await fail(String(e?.message || e)) }
    return out.length ? out : ['nothing to do']
  } finally {
    s.lock = undefined
    await d.save(s)
  }
}
