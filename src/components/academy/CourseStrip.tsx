import { KIND_COLOR, KIND_LABEL, kindOf, type LmsKind } from '@/lib/lms-kind'

interface StripItem { id: string; type: string; kind?: string; durationSec?: number }
interface StripSection { items: StripItem[] }

// Height of a bar, as a share of the strip: the longer the video, the taller the bar. Lengths are
// compared with the longest lesson of the whole course and eased (square root) so a 40 second demo is
// still visible next to a 25 minute lecture. A quiz has no video and gets one fixed, lower height.
const MIN_SHARE = 0.14
const QUIZ_SHARE = 0.34

export function longestLesson(sections: StripSection[]): number {
  let max = 0
  for (const s of sections) for (const i of s.items) if (i.type !== 'quiz') max = Math.max(max, i.durationSec || 0)
  return max
}

function shareOf(i: StripItem, max: number): number {
  if (i.type === 'quiz') return QUIZ_SHARE
  if (!max || !i.durationSec) return 1
  return MIN_SHARE + (1 - MIN_SHARE) * Math.sqrt(Math.min(i.durationSec, max) / max)
}

/**
 * The shape of a course: one thin bar per lesson, grouped by module, coloured by what the lesson is and
 * as tall as its video is long. With `done`, finished lessons are solid and the rest stay faint, so the
 * same strip doubles as a progress bar. `maxSeconds` is the longest lesson of the whole course; pass it
 * when drawing a single module so its bars are on the same scale as the full strip.
 */
export function CourseStrip({
  sections,
  done,
  height = 40,
  animate = false,
  maxSeconds,
}: {
  sections: StripSection[]
  done?: Record<string, boolean>
  height?: number
  animate?: boolean
  maxSeconds?: number
}) {
  const max = maxSeconds ?? longestLesson(sections)
  return (
    <>
      {animate && (
        <style>{`
          @keyframes lms-rise { from { transform: scaleY(0.15); opacity: 0 } to { transform: scaleY(1); opacity: 1 } }
          .lms-strip-anim { transform-origin: bottom; animation: lms-rise .7s cubic-bezier(.2,.7,.2,1) both }
          @media (prefers-reduced-motion: reduce) { .lms-strip-anim { animation: none } }
        `}</style>
      )}
      <div className="flex items-end w-full" style={{ height, gap: Math.max(3, height / 8) }} role="img" aria-label="Course map: one bar per lesson, as tall as the lesson is long">
        {sections.map((s, si) => (
          <div
            key={si}
            className={`flex items-end h-full min-w-[2px] ${animate ? 'lms-strip-anim' : ''}`}
            style={{ flex: s.items.length, gap: 1, animationDelay: animate ? `${si * 45}ms` : undefined }}
          >
            {s.items.map(i => {
              const kind = kindOf(i)
              const isDone = done ? !!done[i.id] : true
              return (
                <span
                  key={i.id}
                  className="flex-1 min-w-0 rounded-[1px]"
                  style={{
                    height: `${Math.round(shareOf(i, max) * 100)}%`,
                    background: KIND_COLOR[kind],
                    opacity: isDone ? 1 : 0.22,
                  }}
                />
              )
            })}
          </div>
        ))}
      </div>
    </>
  )
}

export function StripLegend({ sections, dark = false }: { sections: StripSection[]; dark?: boolean }) {
  const counts: Partial<Record<LmsKind, number>> = {}
  for (const s of sections) for (const i of s.items) counts[kindOf(i)] = (counts[kindOf(i)] || 0) + 1
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 text-[13px] ${dark ? 'text-[#a9b4c4]' : 'text-[#6e6e73]'}`}>
      {(Object.keys(KIND_LABEL) as LmsKind[]).filter(k => counts[k]).map(k => (
        <li key={k} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-[2px]" style={{ background: KIND_COLOR[k] }} />
          <span className="tabular-nums">{counts[k]}</span> {KIND_LABEL[k].toLowerCase()}
        </li>
      ))}
    </ul>
  )
}
