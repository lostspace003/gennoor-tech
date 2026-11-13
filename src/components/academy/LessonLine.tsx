import { Check, FlaskConical, HelpCircle, Lock, MonitorPlay, Play, PlayCircle } from 'lucide-react'
import { KIND_COLOR, type LmsKind } from '@/lib/lms-kind'

const ICON = { lecture: Play, lab: FlaskConical, demo: MonitorPlay, quiz: HelpCircle } as const
const WORD: Record<LmsKind, string> = { lecture: 'Lesson', lab: 'Lab', demo: 'Demo', quiz: 'Quiz' }

/**
 * One lesson in a module's list: what kind it is (a small tile in the colour of its kind),
 * its name, how long it runs, and where it stands for this visitor. It only draws the line:
 * the link or button around it carries the class `group/line`, so the line lights up with it.
 */
export function LessonLine({ title, kind, minutes, state = 'open' }: {
  title: string
  kind: LmsKind
  minutes?: number
  /** open: can be opened. preview: plays for anyone. locked: in the full course. done: finished by this learner. */
  state?: 'open' | 'preview' | 'locked' | 'done'
}) {
  const Icon = ICON[kind]
  return (
    <span className={`flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors group-hover/line:bg-gray-50 group-focus-visible/line:bg-gray-50 ${state === 'locked' ? 'text-gray-500' : 'text-gray-800'}`}>
      <span
        className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
        style={{ background: `${KIND_COLOR[kind]}26`, color: KIND_COLOR[kind], opacity: state === 'locked' ? 0.75 : 1 }}
        title={WORD[kind]}
      >
        <Icon className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 text-[15px] leading-snug">{title}</span>
      {minutes ? <span className="shrink-0 text-[12.5px] tabular-nums text-gray-400">{minutes} min</span> : kind === 'quiz' ? <span className="shrink-0 text-[12.5px] text-gray-400">Quiz</span> : null}
      {state === 'preview' && (
        <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-primary-50 px-2.5 py-1 text-[12px] font-semibold text-primary-700">
          <PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />Preview
        </span>
      )}
      {state === 'locked' && <Lock className="h-3.5 w-3.5 shrink-0 text-gray-400" aria-label="In the full course" />}
      {state === 'done' && <Check className="h-4 w-4 shrink-0 text-emerald-600" strokeWidth={2.5} aria-label="Done" />}
    </span>
  )
}
