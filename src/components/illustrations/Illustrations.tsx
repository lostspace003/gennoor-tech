/**
 * The small pictures on the marketing pages. Each is an icon tile from the stage kit
 * (src/components/stage/Ico.tsx): the same glass tile the films and the presentation use.
 * They were line drawings on a pale disc; the names and props are unchanged, so pages
 * that use them did not have to change.
 *
 * Size comes from the className (w-[104px] h-[104px] ...). The title is read by screen readers.
 * For a new page, use <Ico> directly and choose the icon and the tone for what it stands for.
 */
import {
  BookOpen, Building2, ClipboardCheck, CloudCog, Ear, FileText, FlaskConical, Handshake, MonitorPlay,
  Presentation, Rocket, Scale, ShieldCheck, Users, Video, Workflow, type LucideIcon,
} from 'lucide-react'
import { Ico, SparkIco, type Tone } from '@/components/stage/Ico'
import { cn } from '@/lib/utils'

interface Props { className?: string; title?: string }

const tile = (icon: LucideIcon, tone: Tone, fallback: string) =>
  function Illustration({ className, title = fallback }: Props) {
    return (
      <span className={cn('block', className)} role="img" aria-label={title}>
        <Ico icon={icon} tone={tone} fill />
      </span>
    )
  }

/** Live training: a trainer in front of a group. */
export const TrainingIllustration = tile(Presentation, 'gold', 'A trainer teaching a small group')
/** Automation: a process running from input to result. */
export const AutomationIllustration = tile(Workflow, 'green', 'A process automated from input to result')
/** A course on screen. */
export const PlatformIllustration = tile(MonitorPlay, 'blue', 'A course on screen with progress and a certificate')
/** Listening first. */
export const TalkIllustration = tile(Ear, 'blue', 'Two people talking')
/** What is agreed in writing. */
export const ScopeIllustration = tile(FileText, 'violet', 'A written scope')
export const DeliverIllustration = tile(Rocket, 'green', 'Work being delivered')
export const HandoverIllustration = tile(Handshake, 'green', 'Work handed over to your team')
export const CloudAiIllustration = tile(CloudCog, 'blue', 'AI services in the cloud')
export const SmallTeamIllustration = tile(Users, 'blue', 'A small team')
export const OrgIllustration = tile(Building2, 'violet', 'Several teams in one organization')
export const ExamplesIllustration = tile(FlaskConical, 'violet', 'Testing on your own examples')
export const BalanceIllustration = tile(Scale, 'rose', 'Weighing whether a process is worth automating')
export const ShieldIllustration = tile(ShieldCheck, 'green', 'Checked, with people in charge')
export const ExamPrepIllustration = tile(ClipboardCheck, 'gold', 'An exam sheet with answers ticked and a pass badge')
export const WebinarIllustration = tile(Video, 'rose', 'An expert speaking live to an audience online')
export const BlogIllustration = tile(BookOpen, 'violet', 'An article being written')

/** Claude: the spark. */
export function ClaudeIllustration({ className, title = 'A conversation with Claude' }: Props) {
  return (
    <span className={cn('block', className)} role="img" aria-label={title}>
      <SparkIco className="st-ico-fill" />
    </span>
  )
}
