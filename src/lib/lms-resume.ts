import type { LmsCourse, LmsItem, LmsProgressEntry } from '@/lib/lms'

/**
 * Where a learner is in a course. Pure data: used by the course page (the
 * "welcome back" panel) and by the learn page (the resume screen), so both
 * always agree.
 *
 *   start    nothing watched yet
 *   resume   something watched: continue at `item` (and `positionSec` into it)
 *   complete every lesson is done
 */
export interface ResumePoint {
  kind: 'start' | 'resume' | 'complete'
  item: LmsItem
  first: LmsItem
  positionSec: number
  percent: number
  doneCount: number
  total: number
}

export function resumePoint(course: LmsCourse, progress: Record<string, LmsProgressEntry>): ResumePoint {
  const items = course.sections.flatMap(s => s.items)
  const doneCount = items.filter(i => progress[i.id]?.done).length
  const percent = Math.round((doneCount / items.length) * 100)
  const base = { first: items[0], percent, doneCount, total: items.length }

  const touched = items
    .map((item, n) => ({ item, n, at: progress[item.id]?.updatedAt || '' }))
    .filter(x => x.at)
    .sort((a, b) => b.at.localeCompare(a.at))[0]
  if (!touched) return { ...base, kind: 'start', item: items[0], positionSec: 0 }
  if (doneCount === items.length) return { ...base, kind: 'complete', item: items[0], positionSec: 0 }

  // The last lesson touched; when it is finished, the next one that is not.
  let item = touched.item
  if (progress[item.id]?.done) item = items.slice(touched.n + 1).find(i => !progress[i.id]?.done) ?? items.find(i => !progress[i.id]?.done) ?? item
  return { ...base, kind: 'resume', item, positionSec: progress[item.id]?.done ? 0 : progress[item.id]?.positionSec ?? 0 }
}

export function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}` : `${m}:${String(r).padStart(2, '0')}`
}
