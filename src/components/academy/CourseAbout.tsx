import { Check } from 'lucide-react'
import type { AboutBlock, AboutItem } from '@/lib/lms-about'
import { leadAndRest, moduleLabel } from '@/lib/lms-about'
import { buildPointsFor } from '@/data/lms/build-points'
import { KIND_COLOR } from '@/lib/lms-kind'

interface Counts { hours: number; lecture: number; lab: number; demo: number; quiz: number }

/** The factory's lesson rhythm, drawn instead of described. */
const FLOW = [
  { name: 'Story', note: 'A short chapter sets up the problem', color: KIND_COLOR.lecture },
  { name: 'Concept', note: 'Built up on screen as a diagram', color: KIND_COLOR.lecture },
  { name: 'Code', note: 'Real code with the current SDK names', color: KIND_COLOR.lecture },
  { name: 'Lab', note: 'Every step run on camera', color: KIND_COLOR.lab },
  { name: 'Demo', note: 'The same idea in the portal', color: KIND_COLOR.demo },
]

/** One tone a step, in the order the tiles are used on the site. */
const TONES = ['', 't-violet', 't-cyan', 't-green', 't-gold', 't-rose'] as const

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="font-heading text-[23px] font-bold tracking-[-0.015em] text-gray-900 mt-11 mb-5 first:mt-0">{children}</h3>
}

function Flow() {
  return (
    <ol className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {FLOW.map((s, i) => (
        <li key={s.name} className="relative rounded-xl bg-gray-50 px-4 pt-5 pb-4">
          <span className="absolute left-0 right-0 top-0 h-1.5 rounded-t-xl" style={{ background: s.color }} />
          <p className="font-semibold text-gray-900 text-[15px]">{s.name}</p>
          <p className="text-[13px] leading-snug text-gray-500 mt-1.5">{s.note}</p>
          {i < FLOW.length - 1 && <span aria-hidden className="hidden sm:block absolute -right-[10px] top-1/2 -translate-y-1/2 text-gray-400 z-10">›</span>}
        </li>
      ))}
    </ol>
  )
}

function Tiles({ c }: { c: Counts }) {
  const tiles = [
    c.hours ? { v: `${c.hours}`, l: 'hours of video', color: 'rgb(var(--gray-900))' } : null,
    c.lecture ? { v: c.lecture, l: 'lectures', color: KIND_COLOR.lecture } : null,
    c.lab ? { v: c.lab, l: 'lab videos', color: KIND_COLOR.lab } : null,
    c.demo ? { v: c.demo, l: 'portal demos', color: KIND_COLOR.demo } : null,
    c.quiz ? { v: c.quiz, l: 'quizzes', color: KIND_COLOR.quiz } : null,
  ].filter(Boolean) as { v: string | number; l: string; color: string }[]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-7">
      {tiles.map(t => (
        <div key={t.l} className="st-card !rounded-2xl px-4 py-4">
          <span className="block w-6 h-1 rounded-full mb-3" style={{ background: t.color }} />
          <p className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 tabular-nums leading-none">{t.v}</p>
          <p className="text-[13.5px] text-gray-500 mt-2">{t.l}</p>
        </div>
      ))}
    </div>
  )
}

/**
 * A list of named parts, drawn as a path: a numbered tile for each part, joined by a line,
 * with the name, the one line that says what it is, and its points beside it. Used for
 * "What you build" and for any other list whose items have names.
 */
function Path({ items, slug }: { items: AboutItem[]; slug: string }) {
  return (
    <ol className="relative">
      {items.map((it, i) => {
        const { number, name } = moduleLabel(it.label || '')
        const curated = it.points?.length ? null : buildPointsFor(slug, it.label, it.text)
        const points = it.points?.length ? it.points : curated?.points || []
        const split = leadAndRest(it.text)
        // With points, the sentence they were cut from is not repeated: only its first line, when it has one of its own
        const lead = points.length ? (it.points?.length ? split.lead : curated?.lead || '') : split.rest ? split.lead : ''
        const body = points.length ? (it.points?.length ? split.rest : '') : split.rest || split.lead
        const last = i === items.length - 1
        return (
          <li key={it.label || i} className="relative grid grid-cols-[40px_minmax(0,1fr)] sm:grid-cols-[44px_minmax(0,1fr)] gap-x-4 sm:gap-x-5 pb-5 last:pb-0">
            {/* The line that joins this part to the next: it starts under the tile (4 + 40, or 4 + 44) and runs down its middle */}
            {!last && <span aria-hidden className="absolute left-[19px] sm:left-[21px] top-11 sm:top-12 bottom-0 w-[2px] rounded-full bg-gray-200" />}
            <span className={`st-ico ${TONES[i % TONES.length]} relative z-[1] mt-1 [--s:40px] sm:[--s:44px]`} aria-hidden="true">
              <b>{number || i + 1}</b>
            </span>
            <div className="st-card !rounded-2xl px-5 py-4 sm:px-6 sm:py-5 min-w-0">
              {number && <p className="text-[12.5px] font-semibold text-gray-500">Module {number}</p>}
              <h4 className="font-heading text-[18.5px] font-semibold leading-snug tracking-[-0.01em] text-gray-900">{name}</h4>
              {lead && <p className="mt-1.5 text-[16px] leading-[1.5] font-medium text-gray-900">{lead}</p>}
              {body && <p className="mt-2 text-[15.5px] leading-[1.7] text-gray-700 st-justify">{body}</p>}
              {points.length > 0 && (
                <ul className={`mt-3 grid gap-x-7 gap-y-2 ${points.length > 2 ? 'sm:grid-cols-2' : ''}`}>
                  {points.map(p => (
                    <li key={p} className="flex items-start gap-2.5 text-[15px] leading-[1.45] text-gray-700">
                      <span className="st-tick mt-[3px] scale-90" aria-hidden="true" />
                      <span className="min-w-0">{p}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default function CourseAbout({ blocks, counts, slug }: { blocks: AboutBlock[]; counts: Counts; slug: string }) {
  let heading = ''
  return (
    <div>
      {blocks.map((b, i) => {
        if (b.t === 'lead') {
          return <p key={i} className="text-[22px] leading-[1.45] font-semibold tracking-[-0.01em] text-gray-900 mb-6 max-w-[40em]">{b.text}</p>
        }
        if (b.t === 'h') {
          heading = b.text
          return <Sub key={i}>{b.text}</Sub>
        }
        if (b.t === 'p') {
          return (
            <div key={i}>
              {/^how .* works/i.test(heading) && blocks[i - 1]?.t === 'h' && <Flow />}
              <p className="text-[16.5px] leading-[1.75] text-gray-700 mb-4 st-justify">{b.text}</p>
            </div>
          )
        }
        const labelled = b.items.every(it => it.label)
        const isGet = /what you get/i.test(heading)
        return (
          <div key={i}>
            {isGet && <Tiles c={counts} />}
            {labelled ? (
              <Path items={b.items} slug={slug} />
            ) : (
              <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-3.5">
                {b.items.map(it => (
                  <li key={it.text} className="flex gap-3 text-[15.5px] leading-[1.55] text-gray-700">
                    <Check className="w-[18px] h-[18px] shrink-0 mt-[3px] text-primary-600" strokeWidth={2.5} />
                    <span className="min-w-0">{it.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
