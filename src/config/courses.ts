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
  // ──────────────────────────────────────────────────────────────────────
  // AI STRATEGY FOR THE C-SUITE
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'ai-strategy-c-suite',
    title: 'AI Strategy for the C-Suite',
    shortTitle: 'AI Strategy',
    description:
      'A 60-minute strategic brief for CEOs, CIOs, CDOs and board directors — built for the questions your board is actually about to ask.',
    longDescription:
      'No code. No demos. The four AI value patterns. The portfolio shape that compounds. Capital allocation with three rules. Talent and organisation design. Governance the regulators will accept. Sustaining momentum past year one. Board reporting on one page. And a capstone that collapses the whole course into an operating one-pager you can pin behind your desk on Monday.',
    thumbnail: '/courses/ai-strategy-c-suite/thumbnail.png',
    level: 'Intermediate',
    duration: '~60 min',
    certification: 'No',
    totalChapters: 8,
    tags: ['Leadership', 'Strategy', 'C-Suite', 'Board', 'Governance'],
    badge: 'FREE',
    theme: {
      primary:     '#1E40AF',
      primaryDeep: '#1E3A8A',
      accent:      '#F59E0B',
      accentLight: '#FCD34D',
      navy:        '#0B1220',
      cyan:        '#60A5FA',
      tint:        '#EFF6FF',
    },
    chapters: [
      {
        id: 'chapter-01',
        slug: 'chapter-01-where-ai-value-lives',
        number: 1,
        title: 'Where AI value lives',
        description: 'The four AI value patterns — productivity lift, process automation, agent-led work, and the one that drains capital quietly. Plus the portfolio-shape test.',
        htmlFile: '/courses/ai-strategy-c-suite/chapters/chapter-01-where-ai-value-lives.html',
        estimatedMinutes: 7,
        isFree: true,
        audioDir: '/courses/ai-strategy-c-suite/audio/chapter-01',
      },
      {
        id: 'chapter-02',
        slug: 'chapter-02-building-the-ai-portfolio',
        number: 2,
        title: 'Building the AI portfolio',
        description: 'Diagnose-Train-Innovate-Build-Sustain as one programme. The 12-month enterprise band: $500k–$1.5M.',
        htmlFile: '/courses/ai-strategy-c-suite/chapters/chapter-02-building-the-ai-portfolio.html',
        estimatedMinutes: 8,
        isFree: true,
        audioDir: '/courses/ai-strategy-c-suite/audio/chapter-02',
      },
      {
        id: 'chapter-03',
        slug: 'chapter-03-capital-allocation',
        number: 3,
        title: 'Capital allocation',
        description: 'Three rules: phase-gated funding, 70/20/10, 20% sustainment reserve. Build, buy, or partner — one filter decides.',
        htmlFile: '/courses/ai-strategy-c-suite/chapters/chapter-03-capital-allocation.html',
        estimatedMinutes: 8,
        audioDir: '/courses/ai-strategy-c-suite/audio/chapter-03',
      },
      {
        id: 'chapter-04',
        slug: 'chapter-04-talent-and-org-design',
        number: 4,
        title: 'Talent & org design',
        description: 'CoE vs federated vs hub-and-spoke. The five roles you need by year two. The 20/40/40 year-one sourcing mix.',
        htmlFile: '/courses/ai-strategy-c-suite/chapters/chapter-04-talent-and-org-design.html',
        estimatedMinutes: 8,
        audioDir: '/courses/ai-strategy-c-suite/audio/chapter-04',
      },
      {
        id: 'chapter-05',
        slug: 'chapter-05-governance',
        number: 5,
        title: 'Governance',
        description: 'Inventory, tiering, controls, response. The three questions your board will ask — and how to answer them.',
        htmlFile: '/courses/ai-strategy-c-suite/chapters/chapter-05-governance.html',
        estimatedMinutes: 8,
        audioDir: '/courses/ai-strategy-c-suite/audio/chapter-05',
      },
      {
        id: 'chapter-06',
        slug: 'chapter-06-sustaining-momentum',
        number: 6,
        title: 'Sustaining momentum',
        description: 'The year-two stall pattern — and the three disciplines that prevent it. 18-month mandate renewal in three slides.',
        htmlFile: '/courses/ai-strategy-c-suite/chapters/chapter-06-sustaining-momentum.html',
        estimatedMinutes: 7,
        audioDir: '/courses/ai-strategy-c-suite/audio/chapter-06',
      },
      {
        id: 'chapter-07',
        slug: 'chapter-07-board-reporting',
        number: 7,
        title: 'Board reporting',
        description: 'Four numbers, four narratives, one page. Cadence by audience — weekly sponsor, monthly forum, quarterly board.',
        htmlFile: '/courses/ai-strategy-c-suite/chapters/chapter-07-board-reporting.html',
        estimatedMinutes: 7,
        audioDir: '/courses/ai-strategy-c-suite/audio/chapter-07',
      },
      {
        id: 'chapter-08',
        slug: 'chapter-08-capstone',
        number: 8,
        title: 'Capstone — Your AI strategy on one page',
        description: 'Five sections. Anyone in the C-suite reads it in two minutes. The conversation script for CFO, COO, and GC alignment.',
        htmlFile: '/courses/ai-strategy-c-suite/chapters/chapter-08-capstone.html',
        estimatedMinutes: 7,
        audioDir: '/courses/ai-strategy-c-suite/audio/chapter-08',
      },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────
  // AI GOVERNANCE & RISK FOR BOARDS
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'ai-governance-risk-boards',
    title: 'AI Governance & Risk for Boards',
    shortTitle: 'AI Governance',
    description:
      'A 55-minute brief for board directors and audit committee chairs — what to ask, what to require, what to report, and how to discharge director duty on AI.',
    longDescription:
      'No code. No demos. The five audit-committee questions. The framework landscape (NIST, ISO 42001, EU AI Act, GCC). The six-category risk taxonomy. The one-page board pack with eight numbers and four narratives. Vendor risk and the six contract clauses. The four-phase incident response. The board\'s own AI competence. And a one-page governance charter your board can formally adopt at the next meeting.',
    thumbnail: '/courses/ai-governance-risk-boards/thumbnail.png',
    level: 'Intermediate',
    duration: '~55 min',
    certification: 'No',
    totalChapters: 8,
    tags: ['Governance', 'Board', 'Risk', 'Compliance', 'Audit Committee'],
    badge: 'FREE',
    theme: {
      primary:     '#475569',
      primaryDeep: '#334155',
      accent:      '#B45309',
      accentLight: '#F59E0B',
      navy:        '#0F172A',
      cyan:        '#64748B',
      tint:        '#F1F5F9',
    },
    chapters: [
      {
        id: 'chapter-01',
        slug: 'chapter-01-what-boards-should-ask',
        number: 1,
        title: 'What boards should ask about AI',
        description: 'The five questions every audit committee agenda should carry — and three failure modes to recognise before the incident.',
        htmlFile: '/courses/ai-governance-risk-boards/chapters/chapter-01-what-boards-should-ask.html',
        estimatedMinutes: 7,
        isFree: true,
        audioDir: '/courses/ai-governance-risk-boards/audio/chapter-01',
      },
      {
        id: 'chapter-02',
        slug: 'chapter-02-frameworks-landscape',
        number: 2,
        title: 'The framework landscape',
        description: 'NIST · ISO 42001 · EU AI Act · GCC frameworks — what each expects, and five ISO clauses for the board agenda.',
        htmlFile: '/courses/ai-governance-risk-boards/chapters/chapter-02-frameworks-landscape.html',
        estimatedMinutes: 8,
        isFree: true,
        audioDir: '/courses/ai-governance-risk-boards/audio/chapter-02',
      },
      {
        id: 'chapter-03',
        slug: 'chapter-03-risk-taxonomy',
        number: 3,
        title: 'The AI risk taxonomy',
        description: 'Six categories: model · bias · data · vendor · operational · reputational. One sharp question per category.',
        htmlFile: '/courses/ai-governance-risk-boards/chapters/chapter-03-risk-taxonomy.html',
        estimatedMinutes: 8,
        audioDir: '/courses/ai-governance-risk-boards/audio/chapter-03',
      },
      {
        id: 'chapter-04',
        slug: 'chapter-04-reporting-and-metrics',
        number: 4,
        title: 'Reporting & metrics',
        description: 'One page. Eight numbers. Four narratives. Trended over four quarters. The discipline of absence.',
        htmlFile: '/courses/ai-governance-risk-boards/chapters/chapter-04-reporting-and-metrics.html',
        estimatedMinutes: 7,
        audioDir: '/courses/ai-governance-risk-boards/audio/chapter-04',
      },
      {
        id: 'chapter-05',
        slug: 'chapter-05-vendor-risk',
        number: 5,
        title: 'Vendor and third-party AI risk',
        description: 'Five vendor risks. Six contract clauses to confirm annually. The board question that surfaces gaps fastest.',
        htmlFile: '/courses/ai-governance-risk-boards/chapters/chapter-05-vendor-risk.html',
        estimatedMinutes: 7,
        audioDir: '/courses/ai-governance-risk-boards/audio/chapter-05',
      },
      {
        id: 'chapter-06',
        slug: 'chapter-06-incident-response',
        number: 6,
        title: 'Incident response',
        description: 'Five incident shapes — loud and quiet. The four-phase response. Five board-only actions only the board can take.',
        htmlFile: '/courses/ai-governance-risk-boards/chapters/chapter-06-incident-response.html',
        estimatedMinutes: 7,
        audioDir: '/courses/ai-governance-risk-boards/audio/chapter-06',
      },
      {
        id: 'chapter-07',
        slug: 'chapter-07-board-competence',
        number: 7,
        title: 'The board\'s own AI competence',
        description: 'Why AI is now material to director duty. Four moves to build board competence — without becoming engineers.',
        htmlFile: '/courses/ai-governance-risk-boards/chapters/chapter-07-board-competence.html',
        estimatedMinutes: 6,
        audioDir: '/courses/ai-governance-risk-boards/audio/chapter-07',
      },
      {
        id: 'chapter-08',
        slug: 'chapter-08-capstone',
        number: 8,
        title: 'Capstone — Your AI governance charter on one page',
        description: 'Five sections. One page. Formally ratifiable. The three-meeting adoption sequence: audit committee, full board, ratify.',
        htmlFile: '/courses/ai-governance-risk-boards/chapters/chapter-08-capstone.html',
        estimatedMinutes: 5,
        audioDir: '/courses/ai-governance-risk-boards/audio/chapter-08',
      },
    ],
  },
  // ──────────────────────────────────────────────────────────────────────
  // AI FOR FINANCE & ACCOUNTING
  // ──────────────────────────────────────────────────────────────────────
  {
    id: 'ai-for-finance-accounting',
    title: 'AI for Finance & Accounting',
    shortTitle: 'AI for Finance',
    description:
      'A 65-minute play-by-play for CFOs, controllers, and FP&A leads — four AI plays that pay, the 90-day data sprint that makes them work, and the operating roadmap to put in front of your audit committee.',
    longDescription:
      'No theory. The four AI plays for finance — document extraction, reconciliation, forecasting, anomaly — sequenced in the right order. The four-week build plan for invoice AI. The reconciliation agent that takes the close from five days to two. When ML beats Excel and when it doesn\'t. Anomaly detection with internal audit as your ally. Tax and compliance copilots without crossing the lines. The 90-day data sprint. And a one-page finance AI roadmap your CFO and audit committee can sign.',
    thumbnail: '/courses/ai-for-finance-accounting/thumbnail.png',
    level: 'Intermediate',
    duration: '~65 min',
    certification: 'No',
    totalChapters: 8,
    tags: ['Finance', 'Accounting', 'Close', 'Forecasting', 'Audit'],
    badge: 'FREE',
    theme: {
      primary:     '#047857',
      primaryDeep: '#065F46',
      accent:      '#D97706',
      accentLight: '#FCD34D',
      navy:        '#022C22',
      cyan:        '#34D399',
      tint:        '#ECFDF5',
    },
    chapters: [
      {
        id: 'chapter-01',
        slug: 'chapter-01-where-ai-fits-in-finance',
        number: 1,
        title: 'Where AI fits in finance',
        description: 'Four plays that pay (document extraction · reconciliation · forecasting · anomaly). One that wastes time. The sequence and three traps.',
        htmlFile: '/courses/ai-for-finance-accounting/chapters/chapter-01-where-ai-fits-in-finance.html',
        estimatedMinutes: 8,
        isFree: true,
        audioDir: '/courses/ai-for-finance-accounting/audio/chapter-01',
      },
      {
        id: 'chapter-02',
        slug: 'chapter-02-invoice-and-document-ai',
        number: 2,
        title: 'Invoice & document AI',
        description: 'Three deliverables — extraction, LLM verification, ERP write-back. Four-week build plan. Three disciplines that keep the benefit alive.',
        htmlFile: '/courses/ai-for-finance-accounting/chapters/chapter-02-invoice-and-document-ai.html',
        estimatedMinutes: 9,
        isFree: true,
        audioDir: '/courses/ai-for-finance-accounting/audio/chapter-02',
      },
      {
        id: 'chapter-03',
        slug: 'chapter-03-reconciliation-agent',
        number: 3,
        title: 'The reconciliation agent',
        description: 'Ingest · match · propose journal entries. The 3-day close calendar. The material-entry threshold that keeps auditors comfortable.',
        htmlFile: '/courses/ai-for-finance-accounting/chapters/chapter-03-reconciliation-agent.html',
        estimatedMinutes: 8,
        audioDir: '/courses/ai-for-finance-accounting/audio/chapter-03',
      },
      {
        id: 'chapter-04',
        slug: 'chapter-04-forecasting-with-ai',
        number: 4,
        title: 'Forecasting with AI',
        description: 'Five conditions: when ML beats Excel and when it doesn\'t. Confidence intervals, not points. Three-item governance overlay.',
        htmlFile: '/courses/ai-for-finance-accounting/chapters/chapter-04-forecasting-with-ai.html',
        estimatedMinutes: 9,
        audioDir: '/courses/ai-for-finance-accounting/audio/chapter-04',
      },
      {
        id: 'chapter-05',
        slug: 'chapter-05-anomaly-audit-fraud',
        number: 5,
        title: 'Anomaly, audit, and fraud',
        description: 'Three layers in order (rules → statistical → LLM reasoning). Internal audit as ally — the dashboard, the joint review. Investigation-rate weekly.',
        htmlFile: '/courses/ai-for-finance-accounting/chapters/chapter-05-anomaly-audit-fraud.html',
        estimatedMinutes: 8,
        audioDir: '/courses/ai-for-finance-accounting/audio/chapter-05',
      },
      {
        id: 'chapter-06',
        slug: 'chapter-06-tax-and-compliance-copilots',
        number: 6,
        title: 'Tax & compliance copilots',
        description: 'Three boring use cases that work. Three to deliberately skip. Source-of-truth lockdown · citation · quarterly edge-case review.',
        htmlFile: '/courses/ai-for-finance-accounting/chapters/chapter-06-tax-and-compliance-copilots.html',
        estimatedMinutes: 7,
        audioDir: '/courses/ai-for-finance-accounting/audio/chapter-06',
      },
      {
        id: 'chapter-07',
        slug: 'chapter-07-data-quality-conversation',
        number: 7,
        title: 'The data quality conversation',
        description: 'Three blockers (master data fragmentation · unstructured GL · history without consistency). The 90-day data sprint.',
        htmlFile: '/courses/ai-for-finance-accounting/chapters/chapter-07-data-quality-conversation.html',
        estimatedMinutes: 8,
        audioDir: '/courses/ai-for-finance-accounting/audio/chapter-07',
      },
      {
        id: 'chapter-08',
        slug: 'chapter-08-capstone',
        number: 8,
        title: 'Capstone — Your finance AI roadmap on one page',
        description: 'Five sections: play sequence · data investment · economic case · governance posture · team & partner mix. Three conversations: CFO, internal audit, audit committee.',
        htmlFile: '/courses/ai-for-finance-accounting/chapters/chapter-08-capstone.html',
        estimatedMinutes: 8,
        audioDir: '/courses/ai-for-finance-accounting/audio/chapter-08',
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
