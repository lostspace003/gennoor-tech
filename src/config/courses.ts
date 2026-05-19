export interface Chapter {
  id: string
  slug: string
  number: number
  title: string
  description: string
  htmlFile: string
  estimatedMinutes: number
  isFree?: boolean
  isMockExam?: boolean
  audioFile?: string
  audioDir?: string
  transcriptFile?: string
}

export interface CourseTheme {
  primary: string
  primaryDeep: string
  accent: string
  accentLight: string
  navy: string
  cyan: string
  tint: string
}

export interface Course {
  id: string
  title: string
  shortTitle: string
  description: string
  longDescription: string
  thumbnail: string
  level: string
  duration: string
  certification: string
  chapters: Chapter[]
  totalChapters: number
  tags: string[]
  badge: 'FREE' | 'PREMIUM'
  theme?: CourseTheme
}

export const courses: Course[] = [
  {
    id: 'ab-100',
    title: 'AB-100: Architecting Agentic AI Business Solutions',
    shortTitle: 'AB-100',
    description: 'Self-paced course for the Microsoft AB-100 certification. Master agentic AI architecture with Copilot Studio, Azure AI Foundry, and Dynamics 365.',
    longDescription: 'A comprehensive 13-chapter course covering everything you need to architect agentic AI business solutions — from analyzing business requirements and developing AI strategy to designing solutions, orchestrating prebuilt agents, and managing governance. Includes a 50-question mock exam matching the real AB-100 format.',
    thumbnail: '/courses/ab-100/thumbnail.png',
    level: 'Advanced',
    duration: '~20 hours',
    certification: 'Microsoft AB-100',
    totalChapters: 13,
    tags: ['Microsoft', 'Azure AI', 'Copilot Studio', 'Agentic AI', 'Dynamics 365'],
    badge: 'FREE',
    chapters: [
      {
        id: 'chapter-00',
        slug: 'course-introduction',
        number: 0,
        title: 'Course Introduction',
        description: 'How the course runs, what to expect, and how to get the most out of it',
        htmlFile: '/courses/ab-100/chapters/chapter-00-introduction.html',
        estimatedMinutes: 15,
        isFree: true,
        audioDir: '/courses/ab-100/audio/chapter-00',
      },
      {
        id: 'chapter-01',
        slug: 'introduction-to-agentic-ai',
        number: 1,
        title: 'Introduction to Agentic AI',
        description: 'The architect role, agentic AI fundamentals, and the solution landscape',
        htmlFile: '/courses/ab-100/chapters/chapter-01-introduction.html',
        estimatedMinutes: 90,
        audioDir: '/courses/ab-100/audio/chapter-01',
      },
      {
        id: 'chapter-02',
        slug: 'analyze-business-requirements',
        number: 2,
        title: 'Analyze Business Requirements',
        description: 'Grounding, data architecture, and translating business needs into AI specs',
        htmlFile: '/courses/ab-100/chapters/chapter-02-analyze.html',
        estimatedMinutes: 100,
        audioDir: '/courses/ab-100/audio/chapter-02',
      },
      {
        id: 'chapter-03',
        slug: 'develop-ai-strategy',
        number: 3,
        title: 'Develop AI Strategy',
        description: 'Cloud Adoption Framework, agent types, and solution design rules',
        htmlFile: '/courses/ab-100/chapters/chapter-03-strategy.html',
        estimatedMinutes: 120,
        audioDir: '/courses/ab-100/audio/chapter-03',
      },
      {
        id: 'chapter-04',
        slug: 'return-on-ai-investment',
        number: 4,
        title: 'Return on AI Investment',
        description: 'TCO analysis, model router patterns, and ROI modeling',
        htmlFile: '/courses/ab-100/chapters/chapter-04-roi.html',
        estimatedMinutes: 100,
        audioDir: '/courses/ab-100/audio/chapter-04',
      },
      {
        id: 'chapter-05',
        slug: 'design-ai-solutions',
        number: 5,
        title: 'Design AI Solutions',
        description: 'Responsible AI, Copilot Studio, Azure AI Foundry, and solution design patterns',
        htmlFile: '/courses/ab-100/chapters/chapter-05-design.html',
        estimatedMinutes: 120,
        audioDir: '/courses/ab-100/audio/chapter-05',
      },
      {
        id: 'chapter-06',
        slug: 'design-extensibility',
        number: 6,
        title: 'Design Extensibility',
        description: 'Connectors, plugins, MCP, Computer Use, and extending agent capabilities',
        htmlFile: '/courses/ab-100/chapters/chapter-06-extensibility.html',
        estimatedMinutes: 100,
        audioDir: '/courses/ab-100/audio/chapter-06',
      },
      {
        id: 'chapter-07',
        slug: 'orchestrate-prebuilt-agents',
        number: 7,
        title: 'Orchestrate Prebuilt Agents',
        description: 'Dynamics 365 capability map and prebuilt agent orchestration',
        htmlFile: '/courses/ab-100/chapters/chapter-07-orchestrate.html',
        estimatedMinutes: 110,
        audioDir: '/courses/ab-100/audio/chapter-07',
      },
      {
        id: 'chapter-08',
        slug: 'analyze-monitor-tune',
        number: 8,
        title: 'Analyze, Monitor, Tune',
        description: 'Telemetry, feedback loops, and continuous AI solution improvement',
        htmlFile: '/courses/ab-100/chapters/chapter-08-monitor.html',
        estimatedMinutes: 110,
        audioDir: '/courses/ab-100/audio/chapter-08',
      },
      {
        id: 'chapter-09',
        slug: 'manage-testing',
        number: 9,
        title: 'Manage Testing',
        description: 'Prompt validation, multi-app E2E testing, and quality assurance',
        htmlFile: '/courses/ab-100/chapters/chapter-09-testing.html',
        estimatedMinutes: 100,
        audioDir: '/courses/ab-100/audio/chapter-09',
      },
      {
        id: 'chapter-10',
        slug: 'alm-for-ai-solutions',
        number: 10,
        title: 'ALM for AI Solutions',
        description: 'Application lifecycle management, data ALM, and custom model ALM',
        htmlFile: '/courses/ab-100/chapters/chapter-10-alm.html',
        estimatedMinutes: 110,
        audioDir: '/courses/ab-100/audio/chapter-10',
      },
      {
        id: 'chapter-11',
        slug: 'rai-security-governance',
        number: 11,
        title: 'RAI, Security & Governance',
        description: 'Responsible AI, security patterns, governance, risk, and compliance',
        htmlFile: '/courses/ab-100/chapters/chapter-11-governance.html',
        estimatedMinutes: 120,
        audioDir: '/courses/ab-100/audio/chapter-11',
      },
      {
        id: 'chapter-12',
        slug: 'final-revision',
        number: 12,
        title: 'Final Revision',
        description: 'Cross-cutting frameworks, common pitfalls, and exam preparation',
        htmlFile: '/courses/ab-100/chapters/chapter-12-revision.html',
        estimatedMinutes: 80,
        audioDir: '/courses/ab-100/audio/chapter-12',
      },
      {
        id: 'mock-exam',
        slug: 'mock-exam',
        number: 99,
        title: 'Mock Exam',
        description: '50 questions, 120 minutes, 700/1000 pass score. MCQ, hotspot, drag-drop, multi-select.',
        htmlFile: '/courses/ab-100/mock-exam/mock-exam.html',
        estimatedMinutes: 120,
        isMockExam: true,
      },
    ],
  },
  {
    id: 'ai-foundations',
    title: 'AI Foundations for Everyone',
    shortTitle: 'AI Foundations',
    description:
      'A practical 55-minute foundations course for business teams — no code, no buzzwords, no hype.',
    longDescription:
      'The fastest way to get a non-technical team speaking the same AI vocabulary. Covers what AI is and isn\'t, how LLMs actually work, where AI fits in everyday work, the privacy and bias risks to watch, how to evaluate AI claims, hands-on Copilot prompts, and habit-building that sticks. Every chapter ends with key takeaways and chapter 8 finishes with a 1-page capstone plan.',
    thumbnail: '/courses/ai-foundations/thumbnail.png',
    level: 'Foundational',
    duration: '~55 min',
    certification: 'No',
    totalChapters: 8,
    tags: ['Foundations', 'GenAI', 'Copilot', 'Non-technical'],
    badge: 'FREE',
    theme: {
      primary:     '#0F766E',
      primaryDeep: '#0E6058',
      accent:      '#D97706',
      accentLight: '#FCD34D',
      navy:        '#134E4A',
      cyan:        '#5EEAD4',
      tint:        '#F0FDFA',
    },
    chapters: [
      {
        id: 'chapter-01',
        slug: 'chapter-01-what-is-ai',
        number: 1,
        title: 'What is AI? (Without the hype)',
        description: 'AI/ML/GenAI distinctions, three things AI is NOT, and why 2022 was the inflection point.',
        htmlFile: '/courses/ai-foundations/chapters/chapter-01-what-is-ai.html',
        estimatedMinutes: 7,
        isFree: true,
        audioDir: '/courses/ai-foundations/audio/chapter-01',
      },
      {
        id: 'chapter-02',
        slug: 'chapter-02-how-llms-work',
        number: 2,
        title: 'How LLMs actually work',
        description: 'Next-token prediction explained — the one mental model that separates confident AI users from confused ones.',
        htmlFile: '/courses/ai-foundations/chapters/chapter-02-how-llms-work.html',
        estimatedMinutes: 8,
        isFree: true,
        audioDir: '/courses/ai-foundations/audio/chapter-02',
      },
      {
        id: 'chapter-03',
        slug: 'chapter-03-where-ai-fits',
        number: 3,
        title: 'Where AI fits in your work',
        description: 'The 5 AI-fit patterns (Summarize · Draft · Classify · Extract · Transform) with concrete examples per function.',
        htmlFile: '/courses/ai-foundations/chapters/chapter-03-where-ai-fits.html',
        estimatedMinutes: 7,
        audioDir: '/courses/ai-foundations/audio/chapter-03',
      },
      {
        id: 'chapter-04',
        slug: 'chapter-04-privacy-risk',
        number: 4,
        title: 'Privacy, risk, and the things to watch',
        description: 'What data should never enter a public AI tool, three real bias scenarios, and the 4 questions to ask before deploying.',
        htmlFile: '/courses/ai-foundations/chapters/chapter-04-privacy-risk.html',
        estimatedMinutes: 7,
        audioDir: '/courses/ai-foundations/audio/chapter-04',
      },
      {
        id: 'chapter-05',
        slug: 'chapter-05-evaluating-ai-claims',
        number: 5,
        title: 'How to evaluate AI claims (and tools)',
        description: 'The 5-question vendor framework and 4 red flags to walk away from. Cuts through hype in 90 seconds.',
        htmlFile: '/courses/ai-foundations/chapters/chapter-05-evaluating-ai-claims.html',
        estimatedMinutes: 6,
        audioDir: '/courses/ai-foundations/audio/chapter-05',
      },
      {
        id: 'chapter-06',
        slug: 'chapter-06-hands-on-copilot',
        number: 6,
        title: 'Hands-on with Copilot',
        description: 'Three practical prompts you can run today: summarize emails, draft hard emails, extract action items. Plus how to save the prompts that work.',
        htmlFile: '/courses/ai-foundations/chapters/chapter-06-hands-on-copilot.html',
        estimatedMinutes: 8,
        audioDir: '/courses/ai-foundations/audio/chapter-06',
      },
      {
        id: 'chapter-07',
        slug: 'chapter-07-ai-habits-that-stick',
        number: 7,
        title: 'Building AI habits that stick',
        description: 'The habit-anchoring formula — and why adoption fails through forgetting, not bad technology.',
        htmlFile: '/courses/ai-foundations/chapters/chapter-07-ai-habits-that-stick.html',
        estimatedMinutes: 6,
        audioDir: '/courses/ai-foundations/audio/chapter-07',
      },
      {
        id: 'chapter-08',
        slug: 'chapter-08-capstone',
        number: 8,
        title: 'Capstone — Your AI starter plan',
        description: 'Bring it all together into a 1-page personal AI plan for the next 30 days. The course outro.',
        htmlFile: '/courses/ai-foundations/chapters/chapter-08-capstone.html',
        estimatedMinutes: 6,
        audioDir: '/courses/ai-foundations/audio/chapter-08',
      },
    ],
  },
]

export function getCourseById(id: string): Course | undefined {
  return courses.find(c => c.id === id)
}

export function getChapterBySlug(courseId: string, slug: string): Chapter | undefined {
  const course = getCourseById(courseId)
  return course?.chapters.find(ch => ch.slug === slug)
}

export function getAdjacentChapters(courseId: string, slug: string): { prev: Chapter | null; next: Chapter | null } {
  const course = getCourseById(courseId)
  if (!course) return { prev: null, next: null }
  const idx = course.chapters.findIndex(ch => ch.slug === slug)
  return {
    prev: idx > 0 ? course.chapters[idx - 1] : null,
    next: idx < course.chapters.length - 1 ? course.chapters[idx + 1] : null,
  }
}
