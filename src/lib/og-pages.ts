import {
  BadgeCheck, BookOpen, Building2, CalendarDays, ClipboardCheck, FlaskConical, GraduationCap, Hammer, Handshake, Lightbulb, MessageSquare,
  Presentation, Sparkles, Users, Video, Workflow, Zap, BarChart3, Bot, Cloud,
} from 'lucide-react'
import type { OgCard } from '@/lib/og-card'
import { DEMO_WORD, WEEKEND } from '@/data/ai-weekend'

/**
 * The share picture of each fixed page: what a link to it shows on LinkedIn, WhatsApp or X.
 * The address is /og/<key> (src/app/og/[key]); a page names its key in `pageMeta` (src/lib/seo.ts).
 *
 * The words follow the house rules: plain and true, no prices, nothing called "free",
 * and the Claude Partner line word for word.
 */
export const OG_PAGES: Record<string, OgCard> = {
  site: {
    kicker: 'AI training and automation, from Mumbai',
    title: 'Practical AI and cloud knowledge',
    line: 'Certification courses, real projects, live training for teams, and automation.',
    foot: 'gennoor.com',
    icon: Sparkles, tone: 'blue',
    beside: [{ icon: GraduationCap, tone: 'violet' }, { icon: Workflow, tone: 'cyan' }],
  },
  'ai-weekend': {
    kicker: 'The last weekend of every month, Saturday & Sunday',
    title: `${WEEKEND.name}: ${WEEKEND.tagline.charAt(0).toLowerCase()}${WEEKEND.tagline.slice(1)}`,
    line: `Live online with an industry expert. ${DEMO_WORD.charAt(0).toUpperCase()}${DEMO_WORD.slice(1)} demos built live, and the kit to repeat them yourself.`,
    foot: 'gennoor.com/ai-weekend',
    icon: Zap, tone: 'gold',
    beside: [{ icon: Bot, tone: 'green' }, { icon: Hammer, tone: 'violet' }],
  },
  training: {
    kicker: 'Training for organizations',
    title: 'Live AI training for teams',
    line: 'Claude, Microsoft AI and custom automation courses, built around the work your team does.',
    foot: 'gennoor.com/training',
    icon: GraduationCap, tone: 'violet',
    beside: [{ icon: 'spark', tone: 'claude' }, { icon: Users, tone: 'blue' }],
  },
  automation: {
    kicker: 'Automation we build',
    title: 'AI automation, one process at a time',
    line: 'We write down what we will and will not do before we start.',
    foot: 'gennoor.com/automation',
    icon: Workflow, tone: 'cyan',
    beside: [{ icon: Bot, tone: 'green' }, { icon: ClipboardCheck, tone: 'blue' }],
  },
  claude: {
    kicker: 'Claude',
    title: 'Claude training and automation for teams',
    line: 'Gennoor is Certified in the Claude Partner Network.',
    foot: 'gennoor.com/claude',
    icon: 'spark', tone: 'claude',
    beside: [{ icon: GraduationCap, tone: 'violet' }, { icon: Workflow, tone: 'cyan' }],
  },
  'claude-certifications': {
    kicker: 'Claude certification prep',
    title: 'Prepare for the four Claude certifications',
    line: 'Interactive chapters, step-through diagrams and practice exams with discussion.',
    foot: 'gennoor.com/claude/certifications',
    icon: 'spark', tone: 'claude',
    beside: [{ icon: BookOpen, tone: 'blue' }, { icon: ClipboardCheck, tone: 'rose' }],
  },
  studio: {
    kicker: 'Learning Studio',
    title: 'Certification and project courses, hands-on',
    line: 'Labs run on camera, quizzes check you as you go, and your progress follows you to any device.',
    foot: 'gennoor.com/studio',
    icon: BookOpen, tone: 'blue',
    beside: [{ icon: FlaskConical, tone: 'violet' }, { icon: BadgeCheck, tone: 'gold' }],
  },
  'ai-essentials': {
    kicker: 'AI Essentials',
    title: 'Interactive AI courses for every role',
    line: 'Technical, business, HR or any domain. No prior technical knowledge needed.',
    foot: 'gennoor.com/ai-academy',
    icon: Lightbulb, tone: 'blue',
    beside: [{ icon: Users, tone: 'cyan' }, { icon: ClipboardCheck, tone: 'rose' }],
  },
  blog: {
    kicker: 'Field notes',
    title: 'Practical notes on AI, written plainly',
    foot: 'gennoor.com/resources/blog',
    icon: BookOpen, tone: 'violet',
    beside: [{ icon: Bot, tone: 'green' }, { icon: Cloud, tone: 'blue' }],
  },
  webinars: {
    kicker: 'Webinars and expert sessions',
    title: 'Learn live',
    line: 'Live sessions and expert talks from Gennoor Tech.',
    foot: 'gennoor.com/webinars',
    icon: Video, tone: 'blue',
    beside: [{ icon: Presentation, tone: 'violet' }, { icon: MessageSquare, tone: 'green' }],
  },
  workshops: {
    kicker: 'Workshops',
    title: 'Hands-on live sessions on AI tools and workflows',
    foot: 'gennoor.com/workshops',
    icon: Hammer, tone: 'violet',
    beside: [{ icon: 'spark', tone: 'claude' }, { icon: Video, tone: 'blue' }],
  },
  programs: {
    kicker: 'Training programs',
    title: 'Instructor-led AI training programs for organizations',
    line: 'Bootcamps and courses on Claude, Azure AI, Copilot Studio and more, adapted to your team.',
    foot: 'gennoor.com/services/training',
    icon: Presentation, tone: 'violet',
    beside: [{ icon: Cloud, tone: 'blue' }, { icon: Users, tone: 'cyan' }],
  },
  certifications: {
    kicker: 'Certification preparation',
    title: 'Prepare for Microsoft and GitHub certifications',
    line: 'Hands-on labs, practice exams and guidance from a Microsoft Certified Trainer.',
    foot: 'gennoor.com/services/certifications',
    icon: BadgeCheck, tone: 'gold',
    beside: [{ icon: FlaskConical, tone: 'violet' }, { icon: ClipboardCheck, tone: 'rose' }],
  },
  guides: {
    kicker: 'Study guide',
    title: 'Certification study guides',
    line: 'What the exam covers, the skills measured, and how to prepare.',
    foot: 'gennoor.com/guides',
    icon: BookOpen, tone: 'blue',
    beside: [{ icon: BadgeCheck, tone: 'gold' }, { icon: BarChart3, tone: 'cyan' }],
  },
  about: {
    kicker: 'About Gennoor Tech',
    title: 'Practical AI and cloud knowledge, from Mumbai',
    line: 'Certification courses, real projects and interactive learning.',
    foot: 'gennoor.com/about',
    icon: Building2, tone: 'blue',
    beside: [{ icon: GraduationCap, tone: 'violet' }, { icon: BadgeCheck, tone: 'gold' }],
  },
  contact: {
    kicker: 'Contact',
    title: 'Write to us or book a call',
    line: 'Gennoor Tech, Mumbai, India.',
    foot: 'gennoor.com/contact',
    icon: MessageSquare, tone: 'green',
    beside: [{ icon: CalendarDays, tone: 'blue' }, { icon: Users, tone: 'violet' }],
  },
  call: {
    kicker: 'Book a call',
    title: 'Pick a time for a discovery call',
    line: 'Thirty minutes with Gennoor Tech, at a date and time that suits you.',
    foot: 'gennoor.com/resources/calendar',
    icon: CalendarDays, tone: 'green',
    beside: [{ icon: MessageSquare, tone: 'blue' }, { icon: Users, tone: 'violet' }],
  },
  join: {
    kicker: 'Work with us',
    title: 'Trainers and engineers, freelance or full-time',
    foot: 'gennoor.com/join',
    icon: Handshake, tone: 'green',
    beside: [{ icon: GraduationCap, tone: 'violet' }, { icon: Workflow, tone: 'cyan' }],
  },
}

export type OgKey = keyof typeof OG_PAGES
