import {
  BookOpen, Compass, Layers, Wrench, Puzzle, Workflow, Sparkles, ShieldCheck, Lock, KeyRound, Database, Server, Cpu,
  CodeXml, Terminal, GitBranch, Bot, Users, MessageSquare, FileText, ClipboardList, Target, Gauge, Coins, Scale, Eye,
  Search, Repeat, ListChecks, Lightbulb, GraduationCap, Trophy, Flag, Map, Route, Rocket, Activity, TriangleAlert, Brain,
  Boxes, Network, Plug, Timer, BadgeCheck, Scissors, Calculator, FolderKanban, Link2, History, Stethoscope, Building2,
  ChartLine, Radar, Siren, type LucideIcon,
} from 'lucide-react'

/** Chapter icons the enrichment step may choose from (names kept stable for the JSON). */
export const CHAPTER_ICONS: Record<string, LucideIcon> = {
  BookOpen, Compass, Layers, Wrench, Puzzle, Workflow, Sparkles, ShieldCheck, Lock, KeyRound, Database, Server, Cpu,
  Code2: CodeXml, CodeXml, Terminal, GitBranch, Bot, Users, MessageSquare, FileText, ClipboardList, Target, Gauge, Coins,
  Scale, Eye, Search, Repeat, ListChecks, Lightbulb, GraduationCap, Trophy, Flag, Map, Route, Rocket, Activity,
  AlertTriangle: TriangleAlert, TriangleAlert, Brain, Boxes, Network, Plug, Timer, BadgeCheck, Scissors, Calculator,
  FolderKanban, Link2, History, Stethoscope, Building2, LineChart: ChartLine, ChartLine, Radar, Siren, Fingerprint: KeyRound,
}

const KIND_DEFAULT: Record<string, LucideIcon> = {
  intro: Compass,
  story: BookOpen,
  playbook: ListChecks,
  cheatsheet: ClipboardList,
  exam: GraduationCap,
  next: Rocket,
  refs: Link2,
}

export function chapterIcon(name: string | null | undefined, kind: string): LucideIcon {
  if (name && CHAPTER_ICONS[name]) return CHAPTER_ICONS[name]
  return KIND_DEFAULT[kind] || BookOpen
}
