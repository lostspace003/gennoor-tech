import { randomBytes } from 'crypto'
import { hhmmToMinutes, isWeekend, localParts, zonedToUtc } from './time'
import type { Config, DayPlan, Slot, State, TargetKey, TargetState, TopicIdea } from './types'

// The autopilot engine. Pure orchestration over injected dependencies, so every safeguard can be tested without
// touching LinkedIn or a model. `tick` is called every ~15 minutes by a scheduled job and is safe to call twice.
export interface Deps {
  now(): Date
  load(): Promise<State>
  save(s: State): Promise<void>
  research(ctx: { date: string; weekend: boolean; cfg: Config; recent: string[] }): Promise<TopicIdea[]>
  generate(ctx: { slot: Slot; cfg: Config; notes: string[] }): Promise<{ draftId: string; text: string; verdict: 'pass' | 'revise'; notes: string[]; variant?: string }>
  /** null when the draft was deleted. publishedAs lists targets it was already posted to (by hand or by us). */
  draft(id: string): Promise<{ text: string; publishedAs: TargetKey[] } | null>
  approve(id: string): Promise<void>
  publish(id: string, target: TargetKey, opts: { commentary?: string; reshareOf?: string }): Promise<{ urn: string }>
  tokens(): Promise<Record<TargetKey, { ok: boolean; days: number }>>
  alert(subject: string, html: string, dedupeKey: string): Promise<void>
  sleep(ms: number): Promise<void>
}

const TARGETS: TargetKey[] = ['organization', 'member']
const STUCK_MS = 10 * 60_000
const iso = (d: Date) => d.toISOString()

export async function withRetry<T>(fn: () => Promise<T>, o: { tries?: number; baseMs?: number; sleep: (ms: number) => Promise<void>; retryable?: (e: any) => boolean }): Promise<T> {
  const tries = o.tries ?? 3
  let last: any
  for (let i = 0; i < tries; i++) {
    try { return await fn() } catch (e: any) {
      last = e
      const retry = o.retryable ? o.retryable(e) : true
      if (!retry || i === tries - 1) break
      await o.sleep((o.baseMs ?? 2000) * 2 ** i + Math.floor(Math.random() * 500))
    }
  }
  throw last
}

/** Errors worth retrying: rate limits, server errors, timeouts and network problems. Validation errors are not. */
export const isTransient = (e: any) => /429|5\d\d|timeout|timed out|ECONN|ETIMEDOUT|fetch failed|network|rate limit|temporar|overloaded|busy/i.test(String(e?.message || e))

const words = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3))
export function similar(a: string, b: string) {
  const x = words(a), y = words(b)
  if (!x.size || !y.size) return 0
  let n = 0
  x.forEach(w => { if (y.has(w)) n++ })
  return n / (x.size + y.size - n)
}

/** Hard screen: the first configured keyword the text contains, or null. Deliberately plain and conservative. */
export function mentionsAvoided(text: string, keywords: string[]): string | null {
  const t = text.toLowerCase()
  // Matches at the START of a word, so "election" catches "elections" but not "selection", and "politic" catches "political".
  return keywords.map(k => k.trim().toLowerCase()).filter(Boolean).find(k => new RegExp(`(^|[^a-z0-9])${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(t)) ?? null
}

/** The day's slot times from config: validated for spacing and the daily cap. */
export function slotsFor(date: string, cfg: Config): { at: Date; kind: Slot['kind']; weekend: boolean }[] {
  const weekend = isWeekend(new Date(`${date}T00:00:00Z`).getUTCDay())
  const list = [...(weekend ? cfg.weekendSlots : cfg.weekdaySlots)].sort((a, b) => hhmmToMinutes(a.time) - hhmmToMinutes(b.time))
  const out: { at: Date; kind: Slot['kind']; weekend: boolean }[] = []
  for (const s of list) {
    const at = zonedToUtc(date, s.time, cfg.tz)
    const prev = out[out.length - 1]
    if (prev && (at.getTime() - prev.at.getTime()) / 60000 < cfg.minGapMinutes) continue
    out.push({ at, kind: s.kind, weekend })
    if (out.length >= cfg.dailyMax) break
  }
  return out
}

function note(s: State, now: Date, msg: string) {
  s.log.push({ at: iso(now), msg })
  if (s.log.length > 300) s.log = s.log.slice(-300)
}

const html = (s: string) => s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!)

export async function tick(d: Deps, opts: { force?: boolean } = {}): Promise<string[]> {
  const out: string[] = []
  const now = d.now()
  const s = await d.load()
  const cfg = s.config
  if (!cfg.enabled && !opts.force) return ['autopilot is off']

  // One tick at a time. A lease that expires on its own so a crash cannot block the schedule forever.
  if (s.lock && Date.parse(s.lock.until) > now.getTime()) return ['another tick is running']
  const me = randomBytes(4).toString('hex')
  s.lock = { until: iso(new Date(now.getTime() + 14 * 60_000)), by: me }
  await d.save(s)
  // Storage has no compare-and-swap, so after a short pause confirm the lock is still ours. Two ticks that started at
  // the same instant cannot both pass this check, so a slot is never published twice.
  await d.sleep(1200 + Math.floor(Math.random() * 800))
  if ((await d.load()).lock?.by !== me) return ['another tick won the lock']

  try {
    const { date: today, minutes: nowMin, dow } = localParts(now, cfg.tz)
    // One email per problem per day: the dedupe record lives in the same state this tick saves.
    const alertOnce = async (subject: string, body: string, key: string) => {
      if (s.alerted[key] === today) return
      s.alerted[key] = today
      for (const k of Object.keys(s.alerted)) if (s.alerted[k] < localParts(new Date(now.getTime() - 7 * 86_400_000), cfg.tz).date) delete s.alerted[k]
      await d.alert(subject, body, key)
    }
    s.lastTick = iso(now)

    // 1. Plan today: research the day's topics once the research time has passed.
    let day = s.days[today]
    if (!day && nowMin >= hhmmToMinutes(cfg.researchTime)) {
      day = s.days[today] = { date: today, researchAttempts: 0, slots: [] }
    }
    if (day && !day.researchedAt && day.researchAttempts < 4) {
      day.researchAttempts++
      const weekend = isWeekend(dow)
      try {
        const recent = s.history.filter(h => Date.parse(h.at) > now.getTime() - 30 * 86_400_000).map(h => h.title)
        const planned = slotsFor(today, cfg)
        let ideas = await d.research({ date: today, weekend, cfg, recent })
        ideas = ideas.filter(i => i.title && !recent.some(r => similar(r, i.title) > 0.55))
        ideas = ideas.filter((i, k) => ideas.findIndex(j => similar(j.title, i.title) > 0.55) === k)
        if (ideas.length < planned.length) throw new Error(`Only ${ideas.length} fresh topics found for ${planned.length} slots`)
        day.slots = planned.map((p, k): Slot => ({
          id: `${today}-${k + 1}`, date: today, at: iso(p.at), kind: p.kind, weekend: p.weekend, topic: ideas[k],
          status: 'planned', genAttempts: 0, regens: 0, updatedAt: iso(now),
          targets: Object.fromEntries(TARGETS.filter(t => cfg.targets[t]).map(t => [t, { status: 'pending', at: iso(new Date(p.at.getTime() + (t === 'member' ? cfg.staggerMinutes * 60_000 : 0))), attempts: 0 } as TargetState])),
        }))
        day.researchedAt = iso(now)
        day.researchError = undefined
        s.history.push(...day.slots.map(sl => ({ at: iso(now), title: sl.topic!.title })))
        s.history = s.history.slice(-200)
        note(s, now, `Planned ${day.slots.length} slots for ${today}`)
        out.push(`planned ${day.slots.length} slots`)
      } catch (e: any) {
        day.researchError = String(e?.message || e).slice(0, 300)
        out.push(`research failed (${day.researchAttempts}/4): ${day.researchError}`)
        if (day.researchAttempts >= 4) await alertOnce('Autopilot could not plan today', `<p>Research failed 4 times for ${today}: ${html(day.researchError)}</p><p>Nothing will be posted automatically today. You can post manually from the Social studio.</p>`, `research-${today}`)
      }
    }
    if (!day) { await d.save(s); return [...out, 'before research time'] }

    // 2. Each slot: manual takeover, drafting, quality gate, publishing.
    const tok = await d.tokens().catch(() => null)
    for (const slot of day.slots) {
      if (slot.status === 'done' || slot.status === 'skipped') continue
      const slotAt = Date.parse(slot.at)

      // 2a. Did the editor already post it? Then that target is theirs and we step aside.
      if (slot.draftId) {
        const dr = await d.draft(slot.draftId)
        if (!dr) { slot.status = 'skipped'; slot.reason = 'draft was deleted'; for (const t of TARGETS) { const ts = slot.targets[t]; if (ts && ts.status === 'pending') { ts.status = 'skipped'; ts.reason = 'draft deleted' } } continue }
        for (const t of TARGETS) {
          const ts = slot.targets[t]
          if (ts && ts.status === 'pending' && dr.publishedAs.includes(t)) { ts.status = 'manual'; ts.reason = 'you posted it'; out.push(`${slot.id}: ${t} posted by you, skipping`) }
        }
      }

      // 2b. Draft ahead of time, with the quality gate.
      if (slot.status === 'planned' && !slot.manual && now.getTime() >= slotAt - cfg.draftLeadMinutes * 60_000) {
        if (now.getTime() > slotAt + cfg.missedGraceMinutes * 60_000) { slot.status = 'skipped'; slot.reason = 'missed its window before it was ready'; continue }
        slot.status = 'drafting'
        const notes: string[] = []
        let result: Awaited<ReturnType<Deps['generate']>> | null = null
        try {
          for (let r = 0; r <= cfg.maxRegens; r++) {
            result = await withRetry(() => d.generate({ slot, cfg, notes }), { tries: 3, baseMs: 4000, sleep: d.sleep, retryable: isTransient })
            const hit = mentionsAvoided(result.text, cfg.avoidKeywords)
            if (hit) { notes.push(`The post touches a topic we never post about (${hit}). Remove it.`); slot.regens = r + 1; result = { ...result, verdict: 'revise', notes: [...result.notes, `avoided topic: ${hit}`] }; continue }
            if (result.verdict === 'pass') break
            notes.push(...result.notes.slice(0, 4))
            slot.regens = r + 1
          }
        } catch (e: any) {
          slot.genAttempts++
          slot.status = 'planned'
          slot.reason = `drafting failed: ${String(e?.message || e).slice(0, 200)}`
          out.push(`${slot.id}: ${slot.reason}`)
          if (slot.genAttempts >= 4) {
            slot.status = 'held'
            await alertOnce(`Autopilot could not write the ${slot.kind} for ${new Date(slot.at).toUTCString()}`, `<p>Drafting failed ${slot.genAttempts} times: ${html(slot.reason)}</p><p>"${html(slot.topic?.title || '')}" will not be posted automatically.</p>`, `gen-${slot.id}`)
          }
          continue
        }
        if (!result) continue
        slot.draftId = result.draftId
        slot.variant = result.variant
        if (result.verdict === 'pass' && !mentionsAvoided(result.text, cfg.avoidKeywords)) {
          await d.approve(result.draftId)
          slot.status = 'ready'; slot.reason = undefined
          out.push(`${slot.id}: draft ready`)
        } else {
          slot.status = 'held'; slot.reason = `did not pass the quality check after ${slot.regens} rewrites: ${result.notes.slice(0, 2).join(' | ').slice(0, 300)}`
          for (const t of TARGETS) { const ts = slot.targets[t]; if (ts && ts.status === 'pending') ts.status = 'held' }
          await alertOnce('Autopilot held a post for your review', `<p>"${html(slot.topic?.title || '')}" did not pass the quality check and was <b>not</b> posted.</p><p>${html(slot.reason)}</p><p>Open the Autopilot page to release, edit or discard it.</p>`, `held-${slot.id}`)
          out.push(`${slot.id}: held by quality gate`)
        }
      }

      // 2c. Publish each target when its time comes.
      if (slot.status === 'ready' && !slot.manual && cfg.mode === 'auto' && slot.draftId) {
        for (const t of TARGETS) {
          const ts = slot.targets[t]
          if (!ts || ts.status !== 'pending' && ts.status !== 'publishing') continue
          const due = Date.parse(ts.at)
          if (now.getTime() < due) continue
          if (ts.status === 'publishing') {
            // A previous tick died mid-publish. We cannot know whether LinkedIn accepted it, so never retry blindly.
            if (now.getTime() - Date.parse(slot.updatedAt) > STUCK_MS) {
              ts.status = 'held'; ts.reason = 'outcome unknown after an interruption: check LinkedIn before posting again'
              await alertOnce('Autopilot needs you to check LinkedIn', `<p>A post to ${t} was interrupted and may or may not have gone out. Please check LinkedIn, then mark it on the Autopilot page.</p>`, `stuck-${slot.id}-${t}`)
            }
            continue
          }
          // The profile reposts the company page post, so it waits for that post to exist (or fails over to its own post).
          const orgTs = slot.targets.organization
          const reshare = (cfg.profileMode ?? 'reshare') === 'reshare'
          const reshareOf = t === 'member' && reshare && orgTs?.status === 'done' ? orgTs.urn : undefined
          if (t === 'member' && reshare && orgTs && ['pending', 'publishing'].includes(orgTs.status) && now.getTime() - due < cfg.missedGraceMinutes * 60_000 / 2) continue
          if (now.getTime() - due > cfg.missedGraceMinutes * 60_000) { ts.status = 'skipped'; ts.reason = 'missed its window, so it was not posted late'; out.push(`${slot.id}: ${t} missed window`); continue }
          if (!tok || !tok[t].ok) {
            ts.reason = `LinkedIn ${t === 'organization' ? 'company page' : 'profile'} connection has expired or is missing`
            await alertOnce('Autopilot cannot post: reconnect LinkedIn', `<p>The ${t === 'organization' ? 'company page' : 'profile'} LinkedIn token is expired or missing, so scheduled posts are not going out. Reconnect on the LinkedIn page.</p>`, `token-${t}-${today}`)
            continue
          }
          // Re-check right before sending: the editor may have posted it a moment ago.
          const fresh = await d.draft(slot.draftId)
          if (fresh?.publishedAs.includes(t)) { ts.status = 'manual'; ts.reason = 'you posted it'; continue }
          ts.status = 'publishing'; slot.updatedAt = iso(now)
          await d.save(s) // record intent first, so an interruption is detectable and never double-posts
          try {
            const commentary = t === 'member' && slot.variant ? slot.variant : undefined
            const res = await withRetry(() => d.publish(slot.draftId!, t, { commentary, reshareOf }), { tries: 3, baseMs: 5000, sleep: d.sleep, retryable: isTransient })
            ts.status = 'done'; ts.urn = res.urn; ts.doneAt = iso(d.now()); ts.reason = undefined
            note(s, now, `Published ${slot.id} to ${t}`)
            out.push(`${slot.id}: published to ${t}`)
          } catch (e: any) {
            ts.attempts++
            ts.status = ts.attempts >= 3 ? 'held' : 'pending'
            ts.reason = String(e?.message || e).slice(0, 250)
            out.push(`${slot.id}: ${t} publish failed (${ts.attempts}/3): ${ts.reason}`)
            if (ts.status === 'held') await alertOnce('Autopilot could not publish a post', `<p>Posting to ${t} failed ${ts.attempts} times: ${html(ts.reason)}</p><p>Topic: ${html(slot.topic?.title || '')}</p>`, `pub-${slot.id}-${t}`)
          }
          await d.save(s)
        }
      }

      // 2d. Close the slot once every target is settled.
      const ts = Object.values(slot.targets) as TargetState[]
      if (slot.status === 'ready' && ts.length && ts.every(x => ['done', 'manual', 'skipped', 'failed', 'held'].includes(x.status))) slot.status = ts.some(x => x.status === 'held') ? 'held' : 'done'
      slot.updatedAt = iso(now)
    }

    // 3. Token expiry warning: LinkedIn tokens cannot renew themselves.
    if (tok) for (const t of TARGETS) if (cfg.targets[t] && tok[t].ok && tok[t].days <= 7) await alertOnce('LinkedIn connection expires soon', `<p>The ${t === 'organization' ? 'company page' : 'profile'} LinkedIn token expires in ${tok[t].days} day(s). Reconnect on the LinkedIn page or scheduled posts will stop.</p>`, `expiry-${t}-${today}`)

    // 4. Morning digest.
    if (!day.digestSent && day.slots.length && nowMin >= hhmmToMinutes(cfg.digestTime)) {
      day.digestSent = true
      const rows = day.slots.map(sl => `<li>${new Date(sl.at).toLocaleTimeString('en-IN', { timeZone: cfg.tz, hour: '2-digit', minute: '2-digit' })} · ${sl.kind} · ${html(sl.topic?.title || '')} <i>(${sl.status}${sl.reason ? `: ${html(sl.reason)}` : ''})</i></li>`).join('')
      await alertOnce(`Today's LinkedIn plan (${cfg.mode === 'auto' ? 'auto-publish on' : 'review only'})`, `<p>These are queued for ${today}. Open the Autopilot page to edit, post early or skip any of them. Anything you post yourself is skipped automatically.</p><ul>${rows}</ul>`, `digest-${today}`)
    }
    return out.length ? out : ['nothing to do']
  } finally {
    s.lock = undefined
    s.lastTickNote = out.join('; ').slice(0, 300)
    await d.save(s)
  }
}

// ---- Editor actions from the admin page -------------------------------------------------------------------------
export type Action = 'skip' | 'manual' | 'resume' | 'release' | 'retry' | 'post-now'
export function applyAction(s: State, slotId: string, action: Action, now: Date): string {
  const slot = Object.values(s.days).flatMap(d => d.slots).find(x => x.id === slotId)
  if (!slot) throw new Error('Slot not found.')
  const targets = Object.values(slot.targets) as TargetState[]
  if (action === 'skip') { slot.status = 'skipped'; slot.reason = 'skipped by you'; for (const t of targets) if (['pending', 'held'].includes(t.status)) { t.status = 'skipped'; t.reason = 'skipped by you' } }
  if (action === 'manual') {
    // Taking over settles the slot: nothing here needs the editor any more, so no "needs you" badge and no reopening later.
    slot.manual = true; slot.status = 'done'; slot.reason = 'handled by you'
    for (const t of targets) if (['pending', 'held', 'failed'].includes(t.status)) { t.status = 'manual'; t.reason = 'you are handling this one' }
  }
  if (action === 'resume') {
    // Handing back puts the slot in the queue again. Targets that were handed over become pending; the usual
    // missed-window rule still stops anything from posting late.
    slot.manual = false; slot.reason = undefined
    if (slot.status === 'done' && targets.every(t => t.status === 'manual' && t.reason === 'you are handling this one')) {
      slot.status = slot.draftId ? 'ready' : 'planned'; slot.genAttempts = 0
      for (const t of targets) { t.status = 'pending'; t.attempts = 0; t.reason = undefined; t.at = iso(now) }
    }
  }
  if (action === 'release' || action === 'retry') {
    if (!slot.draftId) { slot.status = 'planned'; slot.genAttempts = 0; slot.reason = undefined }
    else { slot.status = 'ready'; slot.reason = undefined; for (const t of targets) if (t.status === 'held' || t.status === 'failed') { t.status = 'pending'; t.attempts = 0; t.reason = undefined; t.at = iso(now) } }
  }
  if (action === 'post-now') {
    if (!slot.draftId) throw new Error('This slot has no draft yet.')
    slot.manual = false; slot.status = 'ready'
    let k = 0
    for (const key of TARGETS) { const t = slot.targets[key]; if (t && ['pending', 'held', 'failed'].includes(t.status)) { t.status = 'pending'; t.attempts = 0; t.reason = undefined; t.at = iso(new Date(now.getTime() + k++ * 5 * 60_000)) } }
  }
  slot.updatedAt = iso(now)
  return slot.status
}
