import { Check } from 'lucide-react'
import type { AboutBlock } from '@/lib/lms-about'
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

function Sub({ children }: { children: React.ReactNode }) {
  return <h3 className="font-heading text-[22px] font-bold tracking-[-0.015em] text-gray-900 mt-8 mb-5 first:mt-0">{children}</h3>
}

function Flow() {
  return (
    <ol className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
      {FLOW.map((s, i) => (
        <li key={s.name} className="relative rounded-xl bg-[#f5f6f8] px-4 pt-5 pb-4">
          <span className="absolute left-0 right-0 top-0 h-1.5 rounded-t-xl" style={{ background: s.color }} />
          <p className="font-semibold text-gray-900 text-[15px]">{s.name}</p>
          <p className="text-[12.5px] leading-snug text-[#6e6e73] mt-1.5">{s.note}</p>
          {i < FLOW.length - 1 && <span aria-hidden className="hidden sm:block absolute -right-[10px] top-1/2 -translate-y-1/2 text-[#b4bac6] z-10">›</span>}
        </li>
      ))}
    </ol>
  )
}

function Tiles({ c }: { c: Counts }) {
  const tiles = [
    c.hours ? { v: `${c.hours}`, l: 'hours of video', color: '#0f1824' } : null,
    c.lecture ? { v: c.lecture, l: 'lectures', color: KIND_COLOR.lecture } : null,
    c.lab ? { v: c.lab, l: 'lab videos', color: KIND_COLOR.lab } : null,
    c.demo ? { v: c.demo, l: 'portal demos', color: KIND_COLOR.demo } : null,
    c.quiz ? { v: c.quiz, l: 'quizzes', color: KIND_COLOR.quiz } : null,
  ].filter(Boolean) as { v: string | number; l: string; color: string }[]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-7">
      {tiles.map(t => (
        <div key={t.l} className="rounded-xl border border-[#e8e8ed] px-4 py-4">
          <span className="block w-6 h-1 rounded-full mb-3" style={{ background: t.color }} />
          <p className="text-[28px] font-bold tracking-[-0.02em] text-gray-900 tabular-nums leading-none">{t.v}</p>
          <p className="text-[13px] text-[#6e6e73] mt-2">{t.l}</p>
        </div>
      ))}
    </div>
  )
}

export default function CourseAbout({ blocks, counts }: { blocks: AboutBlock[]; counts: Counts }) {
  let heading = ''
  return (
    <div className="max-w-[760px]">
      {blocks.map((b, i) => {
        if (b.t === 'lead') {
          return <p key={i} className="text-[22px] leading-[1.45] font-semibold tracking-[-0.01em] text-gray-900 mb-6">{b.text}</p>
        }
        if (b.t === 'h') {
          heading = b.text
          return <Sub key={i}>{b.text}</Sub>
        }
        if (b.t === 'p') {
          return (
            <div key={i}>
              {/^how .* works/i.test(heading) && blocks[i - 1]?.t === 'h' && <Flow />}
              <p className="text-[16px] leading-[1.75] text-[#3a3a3f] mb-4 max-w-[68ch]">{b.text}</p>
            </div>
          )
        }
        const labelled = b.items.every(it => it.label)
        const isGet = /what you get/i.test(heading)
        return (
          <div key={i}>
            {isGet && <Tiles c={counts} />}
            {labelled ? (
              <ul className="grid sm:grid-cols-2 gap-4">
                {b.items.map(it => (
                  <li key={it.label} className="rounded-2xl border border-[#e8e8ed] bg-white p-5">
                    <p className="font-semibold text-gray-900 text-[16px] leading-snug">{it.label}</p>
                    <p className="text-[14.5px] leading-[1.6] text-[#4a4a50] mt-2">{it.text}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3">
                {b.items.map(it => (
                  <li key={it.text} className="flex gap-3 text-[15.5px] leading-[1.55] text-[#3a3a3f]">
                    <Check className="w-[18px] h-[18px] shrink-0 mt-[3px] text-primary-600" strokeWidth={2.5} />
                    {it.text}
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
