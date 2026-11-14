import type { CSSProperties } from 'react'
import { FilePenLine, Inbox, ListFilter, Table2, Timer, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Ico } from './Ico'
import Reveal from './Reveal'

/** One process, drawn twice in the same place: first done by hand (grey), then running by itself (in colour). */
const STEPS = [
  { icon: Inbox, tone: 'blue', label: ['Requests', 'arrive'] },
  { icon: ListFilter, tone: 'violet', label: ['Sort and', 'label them'] },
  { icon: FilePenLine, tone: 'green', label: ['Draft', 'the reply'] },
  { icon: Table2, tone: 'gold', label: ['Update', 'the sheet'] },
] as const
const turn = (i: number) => ({ '--i': i }) as CSSProperties

/**
 * The picture of automation used in the film and the presentation: a process a team runs
 * every week. When it comes on screen the four steps are grey; then a line joins them,
 * each takes its colour, and the note under them changes from "done by hand" to "runs
 * when they ask", with a person still checking.
 */
export default function ProcessFlow({ className, caption = 'One process your team runs · every week' }: { className?: string; caption?: string }) {
  return (
    <Reveal className={cn('st-win [--s:clamp(46px,13vw,84px)] sm:[--s:clamp(60px,8vw,84px)]', className)}>
      <div className="st-win-bar"><b /><b /><b /><span>{caption}</span></div>
      <div
        className="relative px-3 sm:px-6 pt-6 pb-5 sm:pb-6"
        role="img"
        aria-label="Four steps of a weekly process: requests arrive, sort and label them, draft the reply, update the sheet. First done by hand, then running by themselves with a person checking the result."
      >
        {/* the line that joins the steps once they run by themselves */}
        <div className="st-grow absolute left-[12.5%] right-[12.5%] h-1" style={{ top: 'calc(1.5rem + var(--s) / 2 - 2px)', ...turn(3) }} aria-hidden="true">
          <i className="block h-full rounded-full" style={{ background: 'linear-gradient(90deg,#3d94ff,#8f7dff 34%,#3ed598 68%,#ffc24b)', boxShadow: '0 0 14px rgba(120,200,255,.9)' }} />
        </div>
        <div className="relative grid grid-cols-4 gap-1 sm:gap-2" aria-hidden="true">
          {STEPS.map((s, i) => (
            <div key={s.label[0]} className="flex flex-col items-center text-center">
              <span className="relative inline-flex">
                <Ico icon={s.icon} tone="ink" />
                <span className="st-pop absolute inset-0 inline-flex" style={turn(i + 5)}><Ico icon={s.icon} tone={s.tone} /></span>
                <span className="st-pop absolute -right-2 -top-2 inline-flex" style={turn(i + 7)}><Ico icon={Zap} tone="gold" round style={{ width: 'calc(var(--s) * 0.38)', height: 'calc(var(--s) * 0.38)' }} /></span>
              </span>
              <span className="mt-3 text-[12.5px] sm:text-[15px] font-semibold leading-tight text-gray-600">{s.label[0]}<br />{s.label[1]}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 grid" aria-hidden="true">
          <div className="col-start-1 row-start-1 flex min-h-14 items-center gap-3 rounded-2xl border border-[color:var(--st-card-line)] bg-[color:var(--st-chip)] px-3.5 sm:px-4">
            <Ico icon={Timer} tone="ink" size={34} />
            <span className="text-[14.5px] sm:text-[16.5px] font-semibold text-gray-600">Done by hand, every week</span>
          </div>
          {/* st-run follows the look: deep green on the stage, a light green tint on the day look. Its ground was
              a fixed dark green here, and the words (which do follow the look) were dark on dark by day. */}
          <div
            className="st-pop st-run col-start-1 row-start-1 flex min-h-14 flex-wrap items-center gap-x-2.5 gap-y-1.5 sm:gap-x-3 rounded-2xl px-3 py-2 sm:px-4"
            style={turn(12)}
          >
            <Ico icon={Zap} tone="gold" round size={34} />
            <span className="flex-1 basis-[150px] text-[14px] sm:text-[16.5px] font-semibold leading-tight text-gray-900">Now it runs when they ask</span>
            <span className="sm:ml-auto inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[color:var(--st-card-line)] bg-[color:var(--st-chip)] px-2.5 py-1 text-[12px] sm:text-[13px] font-semibold text-gray-900">
              <i className="h-2 w-2 rounded-full bg-[#3ed598]" style={{ boxShadow: '0 0 10px #3ed598' }} />A person checks
            </span>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
