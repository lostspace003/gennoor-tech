import type { Course } from './types'

// Initial Academy catalog — 5 courses spanning 4 of 6 tracks.
// More courses ship across 2026 per the Phase C cadence.

export const courses: Course[] = [
  // ────────────────────────────────────────────────────────────────────
  // FOUNDATIONS TRACK
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-foundations-for-everyone',
    title: 'AI Foundations for Everyone',
    subtitle:
      'A practical 55-minute guide for business teams — no code, no buzzwords, no hype.',

    track: 'foundations',
    level: 'foundational',
    audience: ['all-staff', 'individual-contributor', 'manager'],
    functions: undefined,
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['train'],

    duration: '55 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'The fastest way to get a non-technical team speaking the same AI vocabulary.',
    whoThisIsFor:
      'Everyone in the organization — from the front desk to the boardroom — who needs a working mental model of what AI is, what it isn\'t, and where it fits in modern work. Especially valuable for departments rolling out Copilot, ChatGPT Enterprise, or any GenAI tool, where uneven baseline understanding causes adoption to stall.',
    whatYoullLearn: [
      'What modern AI actually is (and isn\'t) — explained without jargon',
      'How Large Language Models work, in plain English',
      'Where AI fits in everyday work, with concrete role-by-role examples',
      'How to spot AI hype, AI risk, and AI marketing claims',
      'Three prompts you can try Monday morning — and how to know if they worked',
      'Where to go next, depending on your role',
    ],
    chapters: [
      {
        number: 1,
        title: 'What is AI? (Without the hype)',
        duration: '7 min',
        objectives: [
          'Distinguish between AI, machine learning, and generative AI',
          'Recognize three things AI is NOT',
        ],
      },
      {
        number: 2,
        title: 'How LLMs actually work',
        duration: '8 min',
        objectives: [
          'Build a working mental model of next-token prediction',
          'Understand why LLMs hallucinate — and what that means for your work',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Where AI fits in your work',
        duration: '7 min',
        objectives: [
          'Identify 5 AI-fit patterns: summarize, draft, classify, extract, transform',
          'Map those patterns to your daily workflow',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Privacy, risk, and the things to watch',
        duration: '7 min',
        objectives: [
          'Recognize what data should never go into a public AI tool',
          'Understand bias risk in 3 common business scenarios',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'How to evaluate AI claims (and tools)',
        duration: '6 min',
        objectives: [
          'Use a 5-question framework to assess any AI vendor pitch',
          'Spot 4 common AI marketing red flags',
        ],
      },
      {
        number: 6,
        title: 'Hands-on with Copilot',
        duration: '8 min',
        objectives: [
          'Run three Copilot prompts on your actual work',
          'Save and share prompts that produce useful output',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Building AI habits that stick',
        duration: '6 min',
        objectives: [
          'Design 3 weekly AI habits anchored to existing workflows',
          'Avoid the "tried it once, forgot" adoption trap',
        ],
      },
      {
        number: 8,
        title: 'Capstone: Your AI starter plan',
        duration: '6 min',
        objectives: [
          'Draft a 1-page personal AI plan for the next 30 days',
          'Identify your team\'s next collective step',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 3,
    capstoneTitle: 'Your 30-day Personal AI Plan',
    references: [
      {
        title: 'Microsoft Work Trend Index 2025 — Frontier Firms',
        source: 'Microsoft',
        url: 'https://www.microsoft.com/en-us/worklab/work-trend-index',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'National Institute of Standards and Technology',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
    ],
    relatedCourseSlugs: [
      'ai-for-hr-people-teams',
      'ai-for-finance-accounting',
      'ai-strategy-c-suite',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — HR
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-hr-people-teams',
    title: 'AI for HR & People Teams',
    subtitle:
      'A 60-minute deep dive on where AI actually helps HR — and where the bias and compliance traps live.',

    track: 'function',
    level: 'foundational',
    audience: ['individual-contributor', 'manager', 'director'],
    functions: ['hr'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate'],

    duration: '60 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Recruiting, onboarding, performance, policy Q&A — and the bias traps that come with each.',
    whoThisIsFor:
      'HR leaders, people-ops teams, L&D managers, and HR business partners. Especially valuable for HR teams under pressure to "do something with AI" but unsure where to start without exposing the organization to bias, compliance, or employee-trust risk.',
    whatYoullLearn: [
      'Where AI legitimately helps HR — recruiting, onboarding, policy Q&A, performance',
      'Where AI doesn\'t help HR — and why pushing it there backfires',
      'The 4 bias traps in AI-augmented hiring (with real-world examples)',
      'How to build an HR copilot that employees actually trust',
      'L&D personalization that goes beyond YouTube recommendation engines',
      'Data handling — what HR data can and cannot enter a Copilot prompt',
    ],
    chapters: [
      {
        number: 1,
        title: 'The HR-AI fit map',
        duration: '7 min',
        objectives: [
          'Identify 7 high-fit AI use cases in HR',
          'Recognize 4 use cases where AI is the wrong tool',
        ],
      },
      {
        number: 2,
        title: 'AI in recruiting — and the bias traps',
        duration: '8 min',
        objectives: [
          'Understand how bias enters resume-screening models',
          'Apply 3 mitigations before using AI in selection',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Onboarding copilots done right',
        duration: '8 min',
        objectives: [
          'Design an onboarding bot that answers 80% of day-1 questions',
          'Plan escalation paths to a human HRBP',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Performance & feedback — the careful zone',
        duration: '7 min',
        objectives: [
          'Use AI in feedback drafting without dehumanizing performance conversations',
          'Avoid the "AI wrote my manager\'s feedback" trust collapse',
        ],
      },
      {
        number: 5,
        title: 'L&D personalization with AI',
        duration: '8 min',
        objectives: [
          'Build adaptive learning paths from your existing content',
          'Measure learning outcomes beyond completion rates',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Policy Q&A bots',
        duration: '7 min',
        objectives: [
          'Design a policy chatbot that handles multilingual workforce',
          'Prevent the bot from inventing policies that don\'t exist',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Data handling — what HR can and cannot share',
        duration: '7 min',
        objectives: [
          'Classify HR data into 3 sensitivity tiers',
          'Apply DPDP / GDPR / regional rules to AI use in HR',
        ],
      },
      {
        number: 8,
        title: 'Capstone: Build your AI-in-HR pilot plan',
        duration: '8 min',
        objectives: [
          'Pick one HR use case and scope a 4-week pilot',
          'Define success criteria your CHRO can sign off on',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your AI-in-HR 4-Week Pilot Scope',
    references: [
      {
        title: 'EEOC Technical Assistance Document on AI in Employment',
        source: 'U.S. Equal Employment Opportunity Commission',
        url: 'https://www.eeoc.gov/laws/guidance/select-issues-assessing-adverse-impact-software-algorithms-and-artificial',
      },
      {
        title: 'EU AI Act — High-Risk Systems in Employment',
        source: 'European Commission',
        url: 'https://artificialintelligenceact.eu/',
      },
      {
        title: 'India DPDP Act 2023',
        source: 'Ministry of Electronics and IT, Government of India',
        url: 'https://www.meity.gov.in/data-protection-framework',
      },
    ],
    pairedPocs: ['poc-05-hr-onboarding-copilot'],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'ai-strategy-c-suite',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — FINANCE
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-finance-accounting',
    title: 'AI for Finance & Accounting',
    subtitle:
      'Where AI ships real value in finance — close, AP, audit, forecasting — without the data-quality dead-ends.',

    track: 'function',
    level: 'foundational',
    audience: ['individual-contributor', 'manager', 'director', 'executive'],
    functions: ['finance'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate'],

    duration: '65 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Close cycle, invoice extraction, forecasting, audit — and the data-quality conversation nobody else will have with you.',
    whoThisIsFor:
      'CFOs, controllers, FP&A leads, accountants, and audit partners. Especially valuable for finance teams who have been pitched 40 AI tools and need to know which ones actually work in regulated, audit-able environments.',
    whatYoullLearn: [
      'AI in close and consolidation — what speeds up, what doesn\'t',
      'Invoice & document AI — beyond the vendor demo',
      'Forecasting with AI — when to use ML vs. an LLM vs. neither',
      'Audit & anomaly detection — how to build evidence trails',
      'Tax & compliance copilots — the regional regulatory reality',
      'The data quality conversation — why most finance AI projects fail before they start',
    ],
    chapters: [
      {
        number: 1,
        title: 'The finance-AI fit map',
        duration: '8 min',
        objectives: [
          'Identify 6 high-ROI AI use cases in finance',
          'Apply the "auditable trail" test to AI candidates',
        ],
      },
      {
        number: 2,
        title: 'AI in close & consolidation',
        duration: '8 min',
        objectives: [
          'Identify which close tasks AI compresses (and which it can\'t)',
          'Design AI-assisted journal entry workflows that pass audit',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Invoice & document AI — past the vendor demo',
        duration: '9 min',
        objectives: [
          'Evaluate document-AI vendor claims',
          'Design a fallback path for the 10% of invoices that always fail',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Forecasting with AI: ML vs. LLM vs. neither',
        duration: '9 min',
        objectives: [
          'Pick the right tool: classical ML for forecasting, LLM for narrative',
          'Avoid the "ChatGPT forecasted my revenue" credibility loss',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Audit & anomaly detection',
        duration: '8 min',
        objectives: [
          'Use anomaly detection in transaction monitoring',
          'Build evidence trails that auditors accept',
        ],
      },
      {
        number: 6,
        title: 'Tax & compliance copilots',
        duration: '7 min',
        objectives: [
          'Use AI for tax research without violating professional standards',
          'Apply regional regulatory boundaries (India, GCC, EU)',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'The data quality conversation',
        duration: '8 min',
        objectives: [
          'Audit your data readiness before any AI initiative',
          'Spot the 3 data dead-ends that kill finance-AI projects',
        ],
      },
      {
        number: 8,
        title: 'Capstone: Your finance AI roadmap',
        duration: '8 min',
        objectives: [
          'Pick 2 high-ROI use cases for the next 2 quarters',
          'Draft an audit-friendly pilot scope for one of them',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your Finance AI 2-Quarter Roadmap',
    references: [
      {
        title: 'NIST AI Risk Management Framework — Financial Services Profile',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'IFAC — Practitioner\'s Guide to AI in Audit',
        source: 'International Federation of Accountants',
        url: 'https://www.ifac.org/',
      },
      {
        title: 'PCAOB — Use of AI in External Audits',
        source: 'Public Company Accounting Oversight Board',
        url: 'https://pcaobus.org/',
      },
    ],
    pairedPocs: ['poc-01-invoice-extraction', 'poc-08-finance-reconciliation'],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'ai-in-financial-services',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // LEADERSHIP TRACK
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-strategy-c-suite',
    title: 'AI Strategy for the C-Suite',
    subtitle:
      'A 50-minute strategic brief for CEOs, CDOs, CIOs — built for the questions your board is actually about to ask.',

    track: 'leadership',
    level: 'intermediate',
    audience: ['executive', 'board', 'director'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['diagnose', 'train'],

    duration: '50 min',
    chapterCount: 7,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'No code. No demos. The four ROI patterns, the governance frame, and the capital-allocation conversation that actually decides whether your AI strategy works.',
    whoThisIsFor:
      'CEOs, CIOs, CDOs, CSOs, COOs, CFOs, and board directors. Especially valuable for leaders preparing a 12–18 month AI plan they will be defending in front of a board, audit committee, or analyst call.',
    whatYoullLearn: [
      'Where AI value actually lives in an enterprise — the four ROI patterns',
      'How to build an AI portfolio you can defend to your board',
      'Capital allocation: opex vs capex, build vs buy, internal vs partner',
      'Governance — what your audit & risk teams need from you, in writing',
      'Talent & org design — CoE vs federated vs hub-and-spoke',
      'Board reporting — the 6-page format that travels',
    ],
    chapters: [
      {
        number: 1,
        title: 'The four ROI patterns in enterprise AI',
        duration: '8 min',
        objectives: [
          'Distinguish productivity, efficiency, growth, and risk-reduction ROI',
          'Spot which pattern your current AI initiatives are actually targeting',
        ],
      },
      {
        number: 2,
        title: 'Building the AI portfolio',
        duration: '7 min',
        objectives: [
          'Apply the impact × feasibility matrix to AI use cases',
          'Sequence a 3-wave portfolio over 18 months',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Capital allocation: build, buy, partner',
        duration: '8 min',
        objectives: [
          'Decide build vs buy with three concrete criteria',
          'Set partner governance for vendor engagements',
        ],
      },
      {
        number: 4,
        title: 'Governance — what audit & risk will ask',
        duration: '7 min',
        objectives: [
          'Pre-empt the seven questions every audit committee asks',
          'Draft an AI governance charter in one page',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Talent & org design',
        duration: '7 min',
        objectives: [
          'Choose between CoE, federated, and hub-and-spoke models',
          'Identify the 4 hires that unblock most enterprise AI work',
        ],
      },
      {
        number: 6,
        title: 'Sustaining momentum past launch',
        duration: '6 min',
        objectives: [
          'Avoid the year-2 "where did AI go?" collapse pattern',
          'Build a 90-day operational review cadence',
        ],
      },
      {
        number: 7,
        title: 'Capstone: Board pack draft',
        duration: '7 min',
        objectives: [
          'Outline a 6-page board pack for your next AI update',
          'Translate technical AI work into 3 board-level metrics',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 1,
    capstoneTitle: 'Your 6-Page Board Pack on AI',
    references: [
      {
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'McKinsey Global Survey on the State of AI',
        source: 'McKinsey & Company',
        url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights',
      },
      {
        title: 'Saudi Vision 2030 — National Strategy for Data and AI',
        source: 'SDAIA, Kingdom of Saudi Arabia',
        url: 'https://www.sdaia.gov.sa/en/SDAIA/about/Pages/AboutNationalStrategy.aspx',
      },
      {
        title: 'EU AI Act — Final Text',
        source: 'European Parliament',
        url: 'https://artificialintelligenceact.eu/',
      },
    ],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'ai-in-financial-services',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // INDUSTRY TRACK — BFSI
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-in-financial-services',
    title: 'AI in Financial Services',
    subtitle:
      'Where banks, NBFCs, and insurers ship real AI value — and how to stay inside RBI, SAMA, and ADGM lines.',

    track: 'industry',
    level: 'intermediate',
    audience: ['executive', 'director', 'manager', 'technical'],
    functions: ['strategy', 'finance', 'it-engineering'],
    industries: ['financial-services'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['diagnose', 'innovate'],

    duration: '70 min',
    chapterCount: 9,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Fraud, KYC, credit, claims, advisor copilots, regulatory reporting — six use cases that ship, with the regulatory lens included.',
    whoThisIsFor:
      'Banking, NBFC, insurance, and asset-management leaders building AI strategy in regulated environments. Especially valuable for institutions operating across GCC, India, or Africa where multiple regulators (RBI, SAMA, ADGM, SDAIA, sector-specific bodies) shape what is possible.',
    whatYoullLearn: [
      'Fraud detection — beyond rule engines, with explainable outputs',
      'KYC & AML — how AI compresses cycle time without violating audit trails',
      'Credit scoring — the bias and fairness conversation in regional contexts',
      'Claims processing — where AI ships in P&C and health insurance',
      'Advisor & RM copilots — Wealth, SME banking, branch operations',
      'Regulatory reporting — the LLM + tabular AI hybrid pattern',
    ],
    chapters: [
      {
        number: 1,
        title: 'The BFSI AI fit map',
        duration: '8 min',
        objectives: [
          'Identify 8 high-fit BFSI use cases',
          'Apply the "regulator-accept" test',
        ],
      },
      {
        number: 2,
        title: 'Fraud detection — beyond rule engines',
        duration: '9 min',
        objectives: [
          'Combine ML anomaly detection with LLM reasoning narratives',
          'Build case management workflows auditors will accept',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'KYC, AML, and onboarding',
        duration: '8 min',
        objectives: [
          'Compress KYC cycle time with document AI + human-in-loop',
          'Maintain audit trail across automated decisions',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Credit scoring — the fairness conversation',
        duration: '8 min',
        objectives: [
          'Spot fairness risks in credit scoring models',
          'Apply 3 mitigations relevant to GCC, India, Africa contexts',
        ],
      },
      {
        number: 5,
        title: 'Claims processing — P&C and health',
        duration: '8 min',
        objectives: [
          'Apply AI in claims triage without violating Treating Customers Fairly principles',
          'Design escalation patterns for high-stakes claims',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Advisor and RM copilots',
        duration: '7 min',
        objectives: [
          'Build wealth/SME RM copilots grounded in product catalog and policy',
          'Avoid the unsuitable-advice trap',
        ],
      },
      {
        number: 7,
        title: 'Regulatory reporting',
        duration: '8 min',
        objectives: [
          'Use LLM + tabular hybrid patterns for narrative reports',
          'Pass model risk management (MRM) review',
        ],
      },
      {
        number: 8,
        title: 'Regulatory landscape — RBI, SAMA, ADGM, SDAIA',
        duration: '7 min',
        objectives: [
          'Map AI obligations across major regional regulators',
          'Spot the convergent themes regulators are all moving toward',
        ],
        hasExercise: true,
      },
      {
        number: 9,
        title: 'Capstone: Your BFSI AI portfolio',
        duration: '7 min',
        objectives: [
          'Pick 3 use cases and sequence them across 12 months',
          'Draft the MRM submission outline for the highest-priority one',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 12-Month BFSI AI Portfolio',
    references: [
      {
        title: 'RBI — Working Group Report on Digital Lending',
        source: 'Reserve Bank of India',
        url: 'https://www.rbi.org.in/',
      },
      {
        title: 'SAMA — Cybersecurity Framework',
        source: 'Saudi Central Bank',
        url: 'https://www.sama.gov.sa/',
      },
      {
        title: 'FATF — AML/CFT Recommendations',
        source: 'Financial Action Task Force',
        url: 'https://www.fatf-gafi.org/',
      },
      {
        title: 'BCBS — Sound Practices on Operational Resilience',
        source: 'Basel Committee on Banking Supervision',
        url: 'https://www.bis.org/bcbs/',
      },
    ],
    pairedPocs: [
      'poc-04-multimodal-rag-banking',
      'poc-10-loan-origination-agent',
      'poc-16-anomaly-detection-fraud',
    ],
    relatedCourseSlugs: [
      'ai-strategy-c-suite',
      'ai-for-finance-accounting',
    ],
  },
]

// Helpers
export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug)
}

export function getRelatedCourses(slug: string, limit = 3): Course[] {
  const course = getCourseBySlug(slug)
  if (!course?.relatedCourseSlugs) return []
  return course.relatedCourseSlugs
    .map((s) => getCourseBySlug(s))
    .filter((c): c is Course => Boolean(c))
    .slice(0, limit)
}
