import type { Course } from './types'
import { foundationsExpanded } from './courses-expanded/foundations-expanded'
import { functionExpanded } from './courses-expanded/function-expanded'
import { leadershipExpanded } from './courses-expanded/leadership-expanded'
import { industryExpanded } from './courses-expanded/industry-expanded'
import { builderExpanded } from './courses-expanded/builder-expanded'
import { missingRealCourses } from './courses-expanded/missing-real-courses'

// Gennoor Academy catalog — full course library, organized across 6 tracks.
// `baseCourses` are the original 13 scaffolds.
// Each `*-expanded` import adds courses to its track.
// `interactiveCourses` includes web-rendered experiences (AB-100) brought under the
// unified Academy taxonomy while still served by the legacy /ai-academy routes.

const baseCourses: Course[] = [
  // ────────────────────────────────────────────────────────────────────
  // FOUNDATIONS TRACK
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-foundations',
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
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    interactiveUrl: '/ai-academy/ai-foundations',

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
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    interactiveUrl: '/ai-academy/ai-for-hr-people-teams',

    hookSentence:
      'Four HR AI plays sequenced over 18 months. Three lines we don\'t cross. The bias-monitoring discipline. The works council framework. Built for HR leaders who want to be early on AI — and disciplined about it.',
    whoThisIsFor:
      'HR leaders, people-ops teams, L&D managers, and HR business partners. Especially valuable for HR teams under pressure to do something with AI — but unsure how to deploy it without exposing the organisation to bias, compliance, or employee-trust risk.',
    whatYoullLearn: [
      'Where AI fits in HR — four plays sequenced, plus the fifth pattern HR should refuse',
      'Recruiting AI — three helps, three non-uses, four-component bias monitoring',
      'Onboarding copilots — three components + the 30-day journey + four metrics',
      'Policy Q&A — three categories, corpus discipline, hidden value to HR itself',
      'L&D personalisation — three components, three bias risks, three honest metrics',
      'Performance and feedback — three legitimate helps + three lines we don\'t cross',
      'Compliance, data handling, works council — three rules, three principles, three sustainability patterns',
      'Your HR AI roadmap on one page — six sections, three conversations to unlock',
    ],
    chapters: [
      {
        number: 1,
        title: 'Where AI fits in HR',
        duration: '7 min',
        objectives: [
          'Name the four HR AI plays + the fifth pattern HR should refuse',
          'Apply the bias-trap framing to every HR AI proposal',
        ],
      },
      {
        number: 2,
        title: 'Recruiting AI — done responsibly',
        duration: '8 min',
        objectives: [
          'Use AI for sourcing, screening (with guardrails), and scheduling — refuse auto-rejection, culture-fit AI, and interviewer ratings',
          'Stand up the four-component bias monitoring framework from day one',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Onboarding copilots',
        duration: '8 min',
        objectives: [
          'Build the three components — corpus, role/location awareness, warm escalation to a named human',
          'Track four metrics — including HRBP satisfaction, the forgotten one',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Policy Q&A and employee help',
        duration: '8 min',
        objectives: [
          'Build the corpus by category and lock down source-of-truth + citation',
          'Use the agent\'s escalations to improve HR — clarify policy, target training, surface new-policy needs',
        ],
      },
      {
        number: 5,
        title: 'L&D personalisation',
        duration: '8 min',
        objectives: [
          'Build the three components — skill inventory from real work, gap analysis to where they\'re going, recommendation with rationale and override',
          'Monitor three L&D-specific bias risks and track three honest metrics',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Performance, feedback, and the line we don\'t cross',
        duration: '8 min',
        objectives: [
          'Deploy the three legitimate helps where the manager\'s judgement is the output',
          'Refuse AI ratings, AI stack ranking, and flight-risk prediction — and defend the lines against pressure',
        ],
      },
      {
        number: 7,
        title: 'Compliance, data handling, and the works council',
        duration: '7 min',
        objectives: [
          'Apply three HR-specific data rules: purpose limitation, automated decision rights, cross-border transfer',
          'Run the works council conversation early, substantively, and quarterly post-launch',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone — Your HR AI roadmap on one page',
        duration: '6 min',
        objectives: [
          'Collapse the course into a six-section, eighteen-month operating roadmap',
          'Unlock three conversations in week one: CHRO, works council, audit committee',
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
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    interactiveUrl: '/ai-academy/ai-for-finance-accounting',

    hookSentence:
      'Four plays that pay. One that wastes time. The 90-day data sprint that decides whether the rest works. Built for CFOs, controllers, and FP&A leads who want AI to show up in EBITDA — not just in the strategy deck.',
    whoThisIsFor:
      'CFOs, controllers, FP&A leads, accountants, and audit partners. Especially valuable for finance teams who have been pitched 40 AI tools and need to know which ones actually work in regulated, audit-able environments.',
    whatYoullLearn: [
      'The four AI plays for finance — and the one to skip',
      'Invoice & document AI — the four-week build plan with operational rhythm',
      'The reconciliation agent — close from five days to two without firing the controller',
      'Forecasting with AI — when ML beats Excel, when Excel still wins, and the governance overlay',
      'Anomaly, audit, and fraud — three layers, internal audit as ally, the two failure modes',
      'Tax & compliance copilots — three boring use cases that work, three to deliberately skip',
      'The data quality conversation — three blockers, what to fix, and the 90-day sprint',
      'Your finance AI roadmap on one page — five sections, three conversations to unlock',
    ],
    chapters: [
      {
        number: 1,
        title: 'Where AI fits in finance',
        duration: '8 min',
        objectives: [
          'Name the four AI plays for finance — and the fifth that wastes time',
          'Sequence the plays in the right order; spot the three traps',
        ],
      },
      {
        number: 2,
        title: 'Invoice & document AI',
        duration: '9 min',
        objectives: [
          'Build the three deliverables — extraction, LLM verification, ERP write-back',
          'Run the four-week build and lock in the operational rhythm',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'The reconciliation agent',
        duration: '8 min',
        objectives: [
          'Map the agent into your close calendar to recover two days a month',
          'Set the material-entry threshold that keeps auditors comfortable',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Forecasting with AI',
        duration: '9 min',
        objectives: [
          'Score the five conditions: when ML beats Excel, when Excel wins',
          'Stand up forecasts with confidence intervals + the three-item governance overlay',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Anomaly, audit, and fraud',
        duration: '8 min',
        objectives: [
          'Buy the three layers in order: rules → statistical → LLM reasoning',
          'Make internal audit an ally; track investigation rate weekly',
        ],
      },
      {
        number: 6,
        title: 'Tax & compliance copilots',
        duration: '7 min',
        objectives: [
          'Run the three boring use cases that work — and deliberately not the three that don\'t',
          'Lock the source-of-truth, enforce citation, review edge cases quarterly',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'The data quality conversation',
        duration: '8 min',
        objectives: [
          'Name the three blockers: master data, unstructured GL, history without consistency',
          'Run the 90-day data sprint that pays back fifty times in AI deployment time',
        ],
      },
      {
        number: 8,
        title: 'Capstone — Your finance AI roadmap on one page',
        duration: '8 min',
        objectives: [
          'Collapse the course into a five-section operating roadmap',
          'Unlock the three conversations: CFO, internal audit, audit committee',
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

    duration: '60 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    interactiveUrl: '/ai-academy/ai-strategy-c-suite',

    hookSentence:
      'No code. No demos. The four AI value patterns, the portfolio shape, capital allocation, governance and the board cadence — taught the way a peer would brief you.',
    whoThisIsFor:
      'CEOs, CIOs, CDOs, CSOs, COOs, CFOs, and board directors. Especially valuable for leaders preparing a 12–18 month AI plan they will be defending in front of a board, audit committee, or analyst call.',
    whatYoullLearn: [
      'Where AI value actually lives — the four patterns that pay and the one that doesn\'t',
      'How to build a defensible AI portfolio (the diagnose-train-innovate-build-sustain shape)',
      'Capital allocation — phase-gated funding, 70/20/10, sustainment reserve',
      'Talent & org design — hub-and-spoke vs CoE vs federated, the five roles by year 2',
      'Governance — the four pillars regulators look for, and the three questions your board will ask',
      'Sustaining momentum — three disciplines that prevent the year-2 stall',
      'Board reporting — four numbers, four narratives, one page, three cadences',
      'Your AI strategy on one page — the capstone template',
    ],
    chapters: [
      {
        number: 1,
        title: 'Where AI value lives',
        duration: '7 min',
        objectives: [
          'Distinguish the four AI value patterns: productivity, process, agent-led, theatre',
          'Apply a portfolio-shape test to any AI proposal',
        ],
      },
      {
        number: 2,
        title: 'Building the AI portfolio',
        duration: '8 min',
        objectives: [
          'Sell AI as one programme (Diagnose-Train-Innovate-Build-Sustain), not five line items',
          'Anchor a 12-month enterprise band ($500k–$1.5M)',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Capital allocation',
        duration: '8 min',
        objectives: [
          'Apply the three rules: phase-gated funding, 70/20/10, 20% sustainment reserve',
          'Decide build vs buy vs partner with one filter — strategic uniqueness',
        ],
      },
      {
        number: 4,
        title: 'Talent & org design',
        duration: '8 min',
        objectives: [
          'Pick between CoE, federated, and hub-and-spoke deliberately',
          'Map the five roles needed by year 2 and the 20/40/40 year-1 sourcing mix',
        ],
      },
      {
        number: 5,
        title: 'Governance',
        duration: '8 min',
        objectives: [
          'Stand up the four pillars: inventory, tiering, controls, response',
          'Answer the three questions any board will ask about AI',
        ],
        hasExercise: true,
      },
      {
        number: 6,
        title: 'Sustaining momentum',
        duration: '7 min',
        objectives: [
          'Recognise the year-2 stall pattern before it happens',
          'Implement three disciplines: sustainment retainer day 1, adoption metrics weekly, standing forum monthly',
        ],
      },
      {
        number: 7,
        title: 'Board reporting',
        duration: '7 min',
        objectives: [
          'Use the four numbers + four narratives on one page',
          'Match cadence to audience: weekly sponsor, monthly forum, quarterly board',
        ],
      },
      {
        number: 8,
        title: 'Capstone — Your AI strategy on one page',
        duration: '7 min',
        objectives: [
          'Collapse the entire course into one operating one-pager',
          'Run the leadership-team conversation with three calibration questions',
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

    duration: '65 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    interactiveUrl: '/ai-academy/ai-in-financial-services',

    hookSentence:
      'Four patterns that pay in regulated finance. The three filters every proposal must pass. The sovereignty posture your board signs. Built for the GCC, Indian NBFC, and African bank reality — not a startup deck.',
    whoThisIsFor:
      'Banking, NBFC, insurance, and asset-management executives, risk officers, and senior heads of function. Especially valuable for institutions operating across GCC, India, or Africa where multiple regulators (RBI, SAMA, ADGM, CBUAE, SDAIA) shape what is possible.',
    whatYoullLearn: [
      'Where BFSI AI value lives — four patterns + three filters at the investment committee',
      'Fraud and AML — three layers in order, the AML officer conversation, three governance items',
      'KYC and onboarding — the four-component stack, P95 time-to-decision, sovereignty postures',
      'Credit scoring and underwriting — three deployment patterns, plain-language explainability, bias monitoring',
      'Claims and operations — three plays, build pattern, the one number to defend',
      'Customer and advisor copilots — three patterns sequenced, the information/education/advice boundary',
      'Regulatory reporting and sovereignty — five regulator questions, three sovereignty postures, three relationship moves',
      'Your BFSI AI roadmap on one page — six sections, three conversations to unlock',
    ],
    chapters: [
      {
        number: 1,
        title: 'Where BFSI AI value lives',
        duration: '8 min',
        objectives: [
          'Name the four BFSI AI patterns + the fifth to skip',
          'Run the three filters (explainability · audit trail · sovereignty) at the investment committee',
        ],
      },
      {
        number: 2,
        title: 'Fraud detection and AML',
        duration: '8 min',
        objectives: [
          'Buy the three layers in order — rules → statistical/ML → LLM reasoning',
          'Run the AML-officer conversation before vendor selection',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'KYC and onboarding',
        duration: '9 min',
        objectives: [
          'Build the four-component stack: document AI, identity + liveness, screening, underwriter copilot',
          'Choose a sovereignty posture deliberately — sovereign cloud, hybrid, or on-premise',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Credit scoring and underwriting',
        duration: '8 min',
        objectives: [
          'Choose between the three deployment patterns; favour B in most jurisdictions',
          'Stand up plain-language explainability and outcome bias monitoring',
        ],
      },
      {
        number: 5,
        title: 'Claims and operations AI',
        duration: '8 min',
        objectives: [
          'Run the three operations plays: claims · trade finance · service copilots',
          'Defend one number per play at the board',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Customer and advisor copilots',
        duration: '7 min',
        objectives: [
          'Sequence the three patterns — RM copilot, wealth research, customer-facing chat',
          'Apply the information / education / advice boundary with compliance-written escalation script',
        ],
      },
      {
        number: 7,
        title: 'Regulatory reporting and sovereignty',
        duration: '8 min',
        objectives: [
          'Answer the five regulator questions in ten minutes',
          'Make three regulator-relationship moves in the next 90 days',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone — Your BFSI AI roadmap on one page',
        duration: '7 min',
        objectives: [
          'Collapse the course into a six-section operating roadmap',
          'Unlock three conversations: executive committee, chief risk officer, central bank supervisor',
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

  // ────────────────────────────────────────────────────────────────────
  // FOUNDATIONS TRACK — Course 6
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'generative-ai-for-business',
    title: 'Generative AI for Business',
    subtitle:
      'A 45-minute brief for managers running internal AI conversations — without the buzzwords, without the code.',

    track: 'foundations',
    level: 'foundational',
    audience: ['manager', 'director'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['diagnose', 'train'],

    duration: '60 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    interactiveUrl: '/ai-academy/generative-ai-for-business',

    hookSentence:
      'A manager\'s playbook for generative AI — discovery, pilot, vendor selection, adoption, metrics. Built so a team lead can walk into the next planning meeting with a 90-day plan instead of a vendor pitch.',
    whoThisIsFor:
      'Team leads, mid-level managers, and directors who are being asked by their bosses, their teams, or both to do something with GenAI — and want to come back with a defensible plan instead of a vendor pitch.',
    whatYoullLearn: [
      'GenAI explained without code — the three changes that matter to managers',
      'The four ROI patterns and how to present three honest scenarios',
      'Use case discovery in your team — the 5-question scoring sheet + 3 methods',
      'Vendor evaluation — the 90-second filter + 5 questions for vendors that pass',
      'Pilot design — the 4-week template with 3 metrics, decision at week 4',
      'Adoption playbook — 3 disciplines, champion role, diagnosing stalls',
      'Measuring success — 4 steady-state numbers + 3-cadence reporting rhythm',
      'Your 90-day GenAI plan — 3 phases + 4 conversations to have in week 1',
    ],
    chapters: [
      {
        number: 1,
        title: 'GenAI explained without code',
        duration: '7 min',
        objectives: [
          'Name the three changes that actually matter to managers',
          'Apply the “junior team member” mental model to your team',
        ],
      },
      {
        number: 2,
        title: 'The ROI conversation',
        duration: '8 min',
        objectives: [
          'Pick the right ROI pattern (time saved, throughput, errors avoided, new work)',
          'Present three scenarios (conservative · likely · aspirational) with five hidden costs disclosed',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Use case discovery',
        duration: '8 min',
        objectives: [
          'Score 5 candidates with the 5-question sheet, pick top 2',
          'Use all 3 discovery methods: ask the team, watch the team, look at the inbox',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Vendor evaluation',
        duration: '7 min',
        objectives: [
          'Apply the 90-second filter to eliminate 60% of vendors',
          'Use the 5 questions for vendors that pass and score them on the same sheet',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Pilot design',
        duration: '8 min',
        objectives: [
          'Run the 4-week template — scope, build, pilot, decide',
          'Avoid the four pilot mistakes (too many people, no baseline, unfunded lead, no sponsor)',
        ],
      },
      {
        number: 6,
        title: 'The adoption playbook',
        duration: '8 min',
        objectives: [
          'Implement three adoption disciplines together — library, office hours, dashboard',
          'Recognise and protect the team champion role',
        ],
      },
      {
        number: 7,
        title: 'Measuring success in steady state',
        duration: '7 min',
        objectives: [
          'Track the four steady-state numbers on one page, trended over four quarters',
          'Run the three-cadence rhythm: monthly internal, quarterly sponsor, annual renewal',
        ],
      },
      {
        number: 8,
        title: 'Capstone — Your 90-day GenAI plan for managers',
        duration: '7 min',
        objectives: [
          'Collapse the course into a 3-phase, 90-day operating plan',
          'Schedule the four week-1 conversations: team, sponsor, finance, IT/security',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 1,
    capstoneTitle: 'Your 1-Page Internal GenAI Brief',
    references: [
      {
        title: 'The State of AI in Early 2024 — McKinsey Global Survey',
        source: 'McKinsey & Company',
        url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai',
      },
      {
        title: 'Microsoft Work Trend Index — Frontier Firms',
        source: 'Microsoft',
        url: 'https://www.microsoft.com/en-us/worklab/work-trend-index',
      },
      {
        title: 'MIT Sloan Management Review — AI strategy briefs',
        source: 'MIT Sloan',
        url: 'https://sloanreview.mit.edu/topic/artificial-intelligence/',
      },
    ],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'ai-strategy-c-suite',
      'ai-for-finance-accounting',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — Sales & Marketing
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-sales-marketing',
    title: 'AI for Sales & Marketing',
    subtitle:
      'A 65-minute playbook for revenue leaders — six AI plays that ship, three that disappoint, and a 2-quarter portfolio with the KPIs that prove ROI.',

    track: 'function',
    level: 'intermediate',
    audience: ['director', 'manager', 'individual-contributor'],
    functions: ['sales'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate', 'sustain'],

    duration: '65 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-20',

    interactiveUrl: '/ai-academy/ai-for-sales-marketing',

    hookSentence:
      'Six revenue AI plays that ship value sequenced over two quarters — and three that consistently disappoint, named explicitly so the budget redirects. The disciplined workflow that doubles response rates against the AI-spam pattern collapsing the industry.',
    whoThisIsFor:
      'Chief revenue officers, chief marketing officers, sales ops, demand gen, marketing ops, and revenue operations leaders. Especially useful for teams already on Salesforce, HubSpot, or Microsoft Sales Copilot who want to move from "we have AI" to measurable productivity gains — without the brand events that mark teams who chased the vendor demo.',
    whatYoullLearn: [
      'The revenue-AI fit map — six plays that ship, three that disappoint, one principle for every vendor pitch',
      'AI in prospecting — three useful uses + the AI-spam math + the disciplined workflow',
      'Lead scoring with AI — two scoring layers + the six-check CRM data quality gate + three-band score-to-action',
      'Proposal generation — the four-block template + three guardrails + where the recovered time should go',
      'Content production at scale — the brand voice anchor + four brand risks + the three-stage pipeline',
      'Personalization that works — three tiers + the creepy line you don\'t cross + relevant beats clever',
      'Sales call AI — four extractions per call + the three-stage coaching loop + the privacy posture customers expect',
      'Your 2-quarter portfolio on one page — three plays sequenced + four KPIs + four week-one conversations',
    ],
    chapters: [
      {
        number: 1,
        title: 'The revenue-AI fit map',
        duration: '8 min',
        objectives: [
          'Name the six revenue AI plays that ship value + the three that disappoint',
          'Apply the principle — AI augments judgment, never replaces it — to every vendor pitch',
        ],
      },
      {
        number: 2,
        title: 'AI in prospecting',
        duration: '9 min',
        objectives: [
          'Deploy three useful uses: ICP refinement, pre-meeting research, signal-based triggers',
          'Avoid the AI-spam trap with the disciplined three-component workflow',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Lead scoring with AI',
        duration: '9 min',
        objectives: [
          'Combine ML predictive scoring with LLM behavioural signal extraction',
          'Pass the six-check CRM data quality gate before any deployment',
        ],
      },
      {
        number: 4,
        title: 'Proposal generation',
        duration: '9 min',
        objectives: [
          'Run the four-block template with three guardrails — CRM grounding, claim register, legal-review gate',
          'Reinvest the recovered time into discovery, expansion, and coaching — not into admin',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Content production — at scale, on brand',
        duration: '8 min',
        objectives: [
          'Stand up the brand voice anchor — style guide as system prompt, two human edits, quarterly fingerprint audit',
          'Build the three-stage pipeline that catches all four brand risks pre-publication',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Personalization that works',
        duration: '8 min',
        objectives: [
          'Choose the right personalization tier per channel — light, middle, or deep',
          'Hold the creepy line on inferred personal life, broker-sourced internal signals, and protected attributes',
        ],
      },
      {
        number: 7,
        title: 'Sales call AI — transcripts to action',
        duration: '9 min',
        objectives: [
          'Configure four extractions per call and aggregate them into the strategic signal',
          'Run the three-stage coaching loop that drops new-rep ramp time 30–50%',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone — Your 2-quarter sales AI portfolio',
        duration: '7 min',
        objectives: [
          'Collapse the course into a three-play, two-quarter portfolio with sequencing discipline',
          'Schedule four week-one conversations: executive sponsor, rev ops, legal/infosec, two pilot reps',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 2-Quarter Sales AI Portfolio',
    references: [
      {
        title: 'Microsoft Sales Copilot — Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/microsoft-sales-copilot/',
      },
      {
        title: 'State of Sales — Salesforce Research',
        source: 'Salesforce',
        url: 'https://www.salesforce.com/resources/research-reports/state-of-sales/',
      },
      {
        title: 'HubSpot State of AI in Marketing',
        source: 'HubSpot Research',
        url: 'https://www.hubspot.com/state-of-marketing',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
    ],
    pairedPocs: ['poc-06-sales-proposal-generator'],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'ai-for-customer-service-support',
      'm365-copilot-adoption',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — Customer Service & Support
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-customer-service-support',
    title: 'AI for Customer Service & Support',
    subtitle:
      'A 65-minute playbook for CX leaders — three patterns that ship, two that backfire, the support-not-surveillance line, and a 4-week pilot with the KPIs that prove value.',

    track: 'function',
    level: 'intermediate',
    audience: ['director', 'manager', 'individual-contributor'],
    functions: ['customer-service'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate', 'sustain'],

    duration: '65 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-20',

    interactiveUrl: '/ai-academy/ai-for-customer-service-support',

    hookSentence:
      'Three CS-AI patterns that ship — and two that drop CSAT 15–25 points, named explicitly. Plus the support-not-surveillance line on sentiment AI that decides whether the team leans in.',
    whoThisIsFor:
      'CX leaders, contact-centre operators, support managers, and ops teams running customer service across phone, chat, and email. Especially useful for teams considering bot deployments at scale and concerned about CSAT impact — and for teams whose previous AI rollout fractured frontline-agent trust.',
    whatYoullLearn: [
      'The CS-AI fit map — three patterns that ship, two that backfire, one principle for every pitch',
      'Agent assist — the four-component stack + three anti-patterns + six-week rollout rhythm',
      'Scoped deflection bots — intent inventory + three scope rules + clean-handoff design',
      'Multilingual support — language reality + code-switching + production gotchas at scale',
      'Knowledge AI — three grounding disciplines + KB-quality gate + citation patterns',
      'Sentiment + escalation — the support-not-surveillance line + escalation logic teams rely on',
      'Voice support AI — three plays + latency/accent gotchas + the disclosure customers expect',
      'Your 4-week pilot plan — one play deeply + KPI scaffold + four conversations Monday',
    ],
    chapters: [
      {
        number: 1,
        title: 'The CS-AI fit map',
        duration: '8 min',
        objectives: [
          'Name the three CS-AI patterns that ship + the two that consistently backfire',
          'Apply the principle — AI handles volume, humans handle judgment — to every vendor pitch',
        ],
      },
      {
        number: 2,
        title: 'Agent assist done right',
        duration: '9 min',
        objectives: [
          'Deploy all four components: suggested response, knowledge surfacing, real-time coaching, auto case summary',
          'Avoid the three anti-patterns and hold the six-week rollout rhythm',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Scoped tier-1 deflection bots',
        duration: '9 min',
        objectives: [
          'Run the intent inventory; refuse deflection bots if top 10 intents are under 60% of volume',
          'Build whitelist + 3-turn cap + emotional-escalation exit + clean-handoff design',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Multilingual support at scale',
        duration: '9 min',
        objectives: [
          'Measure actual language distribution; tier languages by deployment depth',
          'Handle code-switching, dialect register, and the three production gotchas at scale',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Knowledge base AI — without hallucinated policies',
        duration: '9 min',
        objectives: [
          'Enforce the three grounding disciplines — retrieval-only, mandatory citations, refusal patterns',
          'Pass the KB-quality gate before deploying — atomic articles, same-day versioning, quarterly audit',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Sentiment, escalation, and frontline trust',
        duration: '9 min',
        objectives: [
          'Commit to three support-not-surveillance principles in writing before deploying sentiment AI',
          'Send the right team-trust signal — adjusted-on-feedback, coaching-not-punishment, no AI-driven terminations',
        ],
      },
      {
        number: 7,
        title: 'Voice support AI',
        duration: '8 min',
        objectives: [
          'Ship three voice plays — IVR replacement, structured data capture, wait-time assistant',
          'Architect for latency under 1.5s, accent recognition, interruption handling, and disclosure',
        ],
      },
      {
        number: 8,
        title: 'Capstone — Your 4-week CS AI pilot plan',
        duration: '7 min',
        objectives: [
          'Run one play deeply for four weeks with daily standup and clean baseline',
          'Schedule four week-one conversations: executive sponsor, supervisor, infosec/legal, two pilot agents',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 4-Week CS AI Pilot Plan',
    references: [
      {
        title: 'Microsoft Dynamics 365 Customer Service — Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/dynamics365/customer-service/',
      },
      {
        title: 'Gartner — CX in the Age of AI',
        source: 'Gartner Research',
        url: 'https://www.gartner.com/en/customer-service-support',
      },
      {
        title: 'McKinsey — Customer Operations and AI',
        source: 'McKinsey & Company',
        url: 'https://www.mckinsey.com/capabilities/operations/our-insights',
      },
      {
        title: 'EU AI Act — Final Text (incl. transparency/disclosure obligations)',
        source: 'European Parliament',
        url: 'https://artificialintelligenceact.eu/',
      },
    ],
    pairedPocs: ['poc-07-multilingual-customer-support-agent'],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'ai-for-sales-marketing',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — Operations & Supply Chain
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-operations-supply-chain',
    title: 'AI for Operations & Supply Chain',
    subtitle:
      'A 70-minute playbook for COOs and supply chain leaders — six plays that ship, three pitches that disappoint, and a 2-quarter roadmap with operational KPIs (not AI metrics).',

    track: 'function',
    level: 'intermediate',
    audience: ['executive', 'director', 'manager'],
    functions: ['operations'],
    industries: ['cross-industry', 'manufacturing', 'retail-ecommerce'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate', 'sustain'],

    duration: '70 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-20',

    interactiveUrl: '/ai-academy/ai-for-operations-supply-chain',

    hookSentence:
      'Six operations AI plays that ship — and three pitches that consistently disappoint, named explicitly. The data-stable filter sequences your roadmap and the AI-amplifying-OR framing keeps logistics honest.',
    whoThisIsFor:
      'Chief operating officers, supply chain directors, plant managers, logistics heads, and procurement leaders. Especially useful for teams managing complex multi-node operations across GCC, India, and Africa — and for any operation considering AI investment beyond pilot stage.',
    whatYoullLearn: [
      'The ops-AI fit map — six plays that ship, three pitches that disappoint, the data-stable filter',
      'Demand forecasting — two-layer model (ML + LLM signal) + four-check data-readiness gate + handoff design',
      'Procurement document AI — three doc types + three-tier human-in-loop + audit posture for external review',
      'Logistics optimisation — AI amplifies OR (never replaces) + three plays + when NOT to deploy',
      'Predictive maintenance — sensor-plus-narrative + three vendor traps + CMMS handoff',
      'Inventory intelligence — stock-outs and overstock as the same problem + four velocity tiers + cadence-matched formats',
      'Supplier risk + visibility — five signal sources + dashboard discipline + four-phase response',
      'Your 2-quarter ops roadmap — procurement Q1, forecasting Q2, operational KPIs not AI metrics',
    ],
    chapters: [
      {
        number: 1,
        title: 'The ops-AI fit map',
        duration: '9 min',
        objectives: [
          'Name the six plays that ship + the three pitches that disappoint',
          'Apply the data-stable filter (data ready + process stable) to sequence your specific roadmap',
        ],
      },
      {
        number: 2,
        title: 'Demand forecasting with AI',
        duration: '10 min',
        objectives: [
          'Deploy the two-layer model: ML on structured history + LLM on unstructured signal',
          'Pass the four-check data-readiness gate and design the planner handoff for adoption',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Procurement document AI',
        duration: '10 min',
        objectives: [
          'Configure the three-tier human-in-loop (auto-process · light review · full review)',
          'Build the four-component audit posture that passes external review without rework',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Logistics optimisation',
        duration: '9 min',
        objectives: [
          'Frame AI as the OR amplifier — never the OR replacement',
          'Ship three logistics plays and recognise the three situations to NOT deploy yet',
        ],
      },
      {
        number: 5,
        title: 'Predictive maintenance',
        duration: '9 min',
        objectives: [
          'Build the sensor-plus-narrative pattern (never sensor-only)',
          'Refuse the three vendor traps and configure the CMMS handoff',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Inventory intelligence',
        duration: '9 min',
        objectives: [
          'Treat stock-outs and overstock as the same problem; differentiate safety stock by SKU velocity tier',
          'Match action formats to operational cadence — daily for fast movers, weekly for steady, monthly for strategic',
        ],
      },
      {
        number: 7,
        title: 'Supplier risk and end-to-end visibility',
        duration: '9 min',
        objectives: [
          'Ingest five signal sources — news, financial, regulatory/trade, climate, tier-2 supplier visibility',
          'Run the four-phase response cadence from signal arrival through close-out and pattern review',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone — Your 2-quarter operations AI roadmap',
        duration: '8 min',
        objectives: [
          'Sequence procurement document AI Q1, demand forecasting + safety stock Q2; hold the rest for Q3–Q5',
          'Track operational KPIs (capacity, service level, working capital, team satisfaction) — not AI metrics',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 2-Quarter Operations AI Roadmap',
    references: [
      {
        title: 'Microsoft Dynamics 365 Supply Chain Management — Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/dynamics365/supply-chain/',
      },
      {
        title: 'Gartner — Supply Chain Top Trends',
        source: 'Gartner Research',
        url: 'https://www.gartner.com/en/supply-chain',
      },
      {
        title: 'MIT Center for Transportation & Logistics — AI in SCM',
        source: 'MIT CTL',
        url: 'https://ctl.mit.edu/',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
    ],
    pairedPocs: [
      'poc-09-procurement-vendor-intelligence',
      'poc-12-predictive-maintenance',
      'poc-15-demand-forecasting',
    ],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'ai-in-manufacturing',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // INDUSTRY TRACK — Healthcare
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-in-healthcare',
    title: 'AI in Healthcare',
    subtitle:
      'Where hospitals and clinics ship real AI value — clinical documentation, patient journey, operations — and how to stay inside HIPAA-equivalent rails.',

    track: 'industry',
    level: 'intermediate',
    audience: ['executive', 'director', 'manager', 'technical'],
    functions: ['operations', 'it-engineering'],
    industries: ['healthcare'],
    stack: ['microsoft', 'open-source', 'stack-agnostic'],
    pairedPhase: ['diagnose', 'innovate', 'sustain'],

    duration: '65 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    interactiveUrl: '/ai-academy/ai-in-healthcare',

    hookSentence:
      'Four healthcare AI plays sequenced over 24 months, the one line we don\'t cross, PHI patterns, and the clinical-governance discipline that protects everyone. Built for the regulated reality of FDA, EU MDR, and GCC frameworks.',
    whoThisIsFor:
      'Hospital administrators, chief medical informatics officers, hospital CIOs and digital health leaders. Especially relevant for healthcare systems across GCC, India, and Africa balancing AI ambition with regulator and ethical responsibility.',
    whatYoullLearn: [
      'Where AI fits in healthcare — four plays + the one line we don\'t cross',
      'Clinical documentation AI — three components, integrity disciplines, chart-integrity audit',
      'Patient journey copilots — four touchpoints + red-flag thresholds + warmth design',
      'Imaging AI — three maturity categories + radiologist-first workflow + four vendor questions',
      'Operations and pharmacy — three plays that fund the portfolio + four-phase build pattern',
      'PHI and sovereignty — three deployment patterns + minimum-necessary + six contract clauses',
      'Regulator posture — design to the strictest common denominator + three relationship moves',
      'Your hospital AI roadmap on one page — six sections + three quarter-1 conversations',
    ],
    chapters: [
      {
        number: 1,
        title: 'Where AI fits in healthcare',
        duration: '8 min',
        objectives: [
          'Name the four healthcare AI plays + the careful fifth (clinical decision support)',
          'Defend the line — AI never makes the final clinical decision',
        ],
      },
      {
        number: 2,
        title: 'Clinical documentation AI',
        duration: '9 min',
        objectives: [
          'Build the three components incl. selective ambient capture and physician-sign discipline',
          'Stand up three integrity disciplines: audit trail, hallucination guardrails, discrepancy surfacing',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Patient journey copilots',
        duration: '8 min',
        objectives: [
          'Deploy four touchpoints with formal red-flag threshold catalogue',
          'Design for warmth — acknowledge the human moment, offer the human option, name the clinical team',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Imaging AI — with the radiologist',
        duration: '8 min',
        objectives: [
          'Score deployments against three maturity categories; refuse category-3 pitches',
          'Run radiologist-first workflow with disagreement rationale and quarterly review',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Operations and pharmacy AI',
        duration: '8 min',
        objectives: [
          'Run three operations plays that fund the portfolio (bed management, pharmacy, coding)',
          'Apply the four-phase build pattern and track honest financial numbers',
        ],
      },
      {
        number: 6,
        title: 'PHI and data sovereignty',
        duration: '8 min',
        objectives: [
          'Choose between three PHI deployment patterns — per system, not blanket',
          'Apply minimum-necessary discipline and confirm six healthcare-specific contract clauses',
        ],
      },
      {
        number: 7,
        title: 'Regulator posture and clinical governance',
        duration: '7 min',
        objectives: [
          'Design to the strictest common denominator across FDA SaMD, EU MDR, GCC frameworks',
          'Make three regulator-relationship moves; equip clinical governance with three explicit responsibilities',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone — Your hospital AI roadmap on one page',
        duration: '6 min',
        objectives: [
          'Collapse the course into a six-section, 24-month operating roadmap',
          'Unlock three quarter-1 conversations: medical staff committee, regulator, board clinical committee',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 12-Month Hospital AI Portfolio',
    references: [
      {
        title: 'WHO — Ethics and Governance of AI for Health',
        source: 'World Health Organization',
        url: 'https://www.who.int/publications/i/item/9789240029200',
      },
      {
        title: 'FDA — Software as a Medical Device (SaMD)',
        source: 'U.S. Food and Drug Administration',
        url: 'https://www.fda.gov/medical-devices/software-medical-device-samd',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'India CDSCO — Medical Device Rules',
        source: 'Central Drugs Standard Control Organization, India',
        url: 'https://cdsco.gov.in/opencms/opencms/en/Medical-Device-Diagnostics/Medical-Device-Diagnostics/',
      },
    ],
    pairedPocs: ['poc-11-clinical-documentation-assistant'],
    relatedCourseSlugs: [
      'ai-strategy-c-suite',
      'ai-governance-risk-boards',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // INDUSTRY TRACK — Manufacturing
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-in-manufacturing',
    title: 'AI in Manufacturing',
    subtitle:
      'A 70-minute playbook for plant managers and VPs of manufacturing — six shop-floor plays that ship, three pitches that disappoint, and a 12-month roadmap with OEE and quality KPIs (not AI metrics).',

    track: 'industry',
    level: 'intermediate',
    audience: ['executive', 'director', 'manager', 'technical'],
    functions: ['operations', 'it-engineering'],
    industries: ['manufacturing'],
    stack: ['microsoft', 'open-source', 'stack-agnostic'],
    pairedPhase: ['diagnose', 'innovate', 'sustain'],

    duration: '70 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-20',

    interactiveUrl: '/ai-academy/ai-in-manufacturing',

    hookSentence:
      'Plants don\'t tolerate vendor demos. Six manufacturing-AI plays that survive the shop floor — and three pitches that consistently fail, named explicitly. Plus the OT/IT bridge filter that sequences your roadmap.',
    whoThisIsFor:
      'Plant managers, VPs of manufacturing, operations directors, plant engineering leaders, and the OT engineers who run the production floor. Especially useful for mid-sized manufacturers in India and GCC industrialising rapidly — and for any plant evaluating AI investment beyond pilot stage.',
    whatYoullLearn: [
      'The manufacturing-AI fit map — six plays that ship, three pitches that disappoint, the OT/IT bridge filter',
      'Predictive maintenance — sensor coverage decisions + the narrative layer + three project killers',
      'Quality vision AI — three messy-real-world challenges + operator labelling loop + false-confidence discipline',
      'Process optimisation — three AI signals + operator-led experiments + three overfitting guards',
      'Plant-floor supply chain integration — three signal flows + re-planning cadences + three failure modes',
      'Safety AI — three use cases + three safety-specific failures + the line nobody crosses',
      'Digital twin — three targeted twins that ship in 4–6 months + three megaproject traps to refuse',
      'Your 12-month plant AI roadmap — two plays Q1 + ranging in Q2–Q4 + OEE and quality KPIs',
    ],
    chapters: [
      {
        number: 1,
        title: 'The manufacturing-AI fit map',
        duration: '9 min',
        objectives: [
          'Name the six plays that ship + the three pitches that disappoint on the shop floor',
          'Apply the OT/IT bridge filter (data accessible, data quality usable, culture supports AI)',
        ],
      },
      {
        number: 2,
        title: 'Predictive maintenance for plants',
        duration: '10 min',
        objectives: [
          'Make three sensor coverage decisions and build the narrative layer for the maintenance engineer',
          'Anticipate and prevent the three project killers most plants hit during deployment',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Quality vision AI',
        duration: '10 min',
        objectives: [
          'Design around the three messy-real-world challenges (lighting, drift, novel defects)',
          'Run the three-stage operator labelling loop and hold the false-confidence discipline',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Process optimisation with AI',
        duration: '9 min',
        objectives: [
          'Surface the three signals that produce non-obvious improvements (interactions, drift, best-shift)',
          'Run operator-led experiments with statistical rigor and avoid the overfitting trap',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Plant-floor supply chain integration',
        duration: '9 min',
        objectives: [
          'Wire three signal flows into production scheduling (demand, material/supplier, equipment)',
          'Run the three re-planning cadences and prevent the three integration failure modes',
        ],
      },
      {
        number: 6,
        title: 'Safety AI — augmenting human attention',
        duration: '9 min',
        objectives: [
          'Deploy three safety AI use cases (PPE, near-miss, ergonomic) with the support-not-surveillance framing',
          'Hold the line — AI never has final say on safety actions — via written safety AI charter',
        ],
      },
      {
        number: 7,
        title: 'Digital twin — pragmatic, not megaproject',
        duration: '9 min',
        objectives: [
          'Build three targeted twins that ship in 4–6 months (critical equipment, bottleneck, operator training)',
          'Refuse the three megaproject traps via three discipline rules',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone — Your 12-month plant AI roadmap',
        duration: '8 min',
        objectives: [
          'Sequence PdM + quality vision in Q1; range process optimisation, supply chain, safety AI across Q2–Q4',
          'Track OEE, unplanned downtime, defect escape rate, team engagement — not AI metrics',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 12-Month Plant AI Roadmap',
    references: [
      {
        title: 'Microsoft Dynamics 365 Manufacturing — Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/dynamics365/supply-chain/cost-management/manufacturing',
      },
      {
        title: 'ISO/IEC 22989 — AI Concepts and Terminology',
        source: 'International Organization for Standardization',
        url: 'https://www.iso.org/standard/74296.html',
      },
      {
        title: 'McKinsey — The State of AI in Manufacturing',
        source: 'McKinsey & Company',
        url: 'https://www.mckinsey.com/industries/advanced-electronics/our-insights',
      },
      {
        title: 'World Economic Forum — Global Lighthouse Network',
        source: 'WEF',
        url: 'https://www.weforum.org/projects/global-lighthouse-network/',
      },
    ],
    pairedPocs: ['poc-12-predictive-maintenance'],
    relatedCourseSlugs: [
      'ai-for-operations-supply-chain',
      'ai-strategy-c-suite',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // LEADERSHIP TRACK — Governance & Risk for Boards
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-governance-risk-boards',
    title: 'AI Governance & Risk for Boards',
    subtitle:
      'A 40-minute brief for board directors — what to ask, what to require, and how to report on AI risk without becoming a technical expert.',

    track: 'leadership',
    level: 'intermediate',
    audience: ['board', 'executive'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['diagnose', 'sustain'],

    duration: '55 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    interactiveUrl: '/ai-academy/ai-governance-risk-boards',

    hookSentence:
      'No code. Eight chapters. The five questions, the four frameworks, the six risks, the eight numbers, the four-phase incident response — and a one-page board charter you can adopt at the next meeting.',
    whoThisIsFor:
      'Board directors, audit committee members, risk committee chairs, and non-executive directors. Especially valuable for boards across BFSI, healthcare, public sector, and any regulated industry where AI is now a material risk.',
    whatYoullLearn: [
      'The five questions every audit committee agenda should carry',
      'The framework landscape — NIST, ISO 42001, EU AI Act, GCC frameworks — and what each expects of a board',
      'The six-category AI risk taxonomy — and the one sharp question per category',
      'Board reporting on AI — one page, eight numbers, four narratives',
      'Vendor and third-party AI risk — five risks, six contract clauses',
      'Incident response — four phases, and the five board-only actions',
      'The board\'s own AI competence — and the director-duty implications',
      'Your AI governance charter on one page — formally ratifiable',
    ],
    chapters: [
      {
        number: 1,
        title: 'What boards should ask about AI',
        duration: '7 min',
        objectives: [
          'Carry the five questions into the next audit committee meeting',
          'Recognise three governance failure modes before the incident',
        ],
      },
      {
        number: 2,
        title: 'The framework landscape',
        duration: '8 min',
        objectives: [
          'Anchor on ISO 42001 internally; map to NIST, EU AI Act, GCC',
          'Translate five ISO 42001 clauses into board agenda items',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'The AI risk taxonomy',
        duration: '8 min',
        objectives: [
          'Name six AI risk categories with their owners and controls',
          'Apply one sharp board question per category',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Reporting & metrics',
        duration: '7 min',
        objectives: [
          'Define the one-page quarterly board pack: 8 numbers, 4 narratives',
          'Recognise what does not belong on the board page',
        ],
      },
      {
        number: 5,
        title: 'Vendor and third-party AI risk',
        duration: '7 min',
        objectives: [
          'Identify the five vendor risks unique to foundation-model dependence',
          'Confirm six contract clauses are in place with top AI vendors',
        ],
      },
      {
        number: 6,
        title: 'Incident response',
        duration: '7 min',
        objectives: [
          'Recognise five incident shapes — loud and quiet',
          'Run the four-phase response, with five board-only actions',
        ],
      },
      {
        number: 7,
        title: 'The board\'s own AI competence',
        duration: '6 min',
        objectives: [
          'Map why AI is now material to director duty',
          'Make four moves to build board competence — without becoming engineers',
        ],
      },
      {
        number: 8,
        title: 'Capstone — Your AI governance charter on one page',
        duration: '5 min',
        objectives: [
          'Collapse the entire course into a five-section, board-ratifiable charter',
          'Run the three-meeting adoption sequence: audit committee, full board, ratify',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 1,
    capstoneTitle: 'Your 1-Page Board AI Governance Charter',
    references: [
      {
        title: 'NIST AI Risk Management Framework',
        source: 'National Institute of Standards and Technology',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'EU AI Act — Final Text',
        source: 'European Parliament',
        url: 'https://artificialintelligenceact.eu/',
      },
      {
        title: 'OECD AI Principles',
        source: 'OECD',
        url: 'https://oecd.ai/en/ai-principles',
      },
      {
        title: 'NACD — Director\'s Handbook on Cyber Risk Oversight',
        source: 'National Association of Corporate Directors',
        url: 'https://www.nacdonline.org/',
      },
    ],
    relatedCourseSlugs: [
      'ai-strategy-c-suite',
      'ai-in-financial-services',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — Microsoft 365 Copilot Adoption
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'm365-copilot-adoption',
    title: 'Microsoft 365 Copilot Adoption Playbook',
    subtitle:
      'A 70-minute playbook for IT and change leaders — persona-based licensing, the 4-week pilot template, prompt libraries, governance, measurement, and the 90-day rollout plan that lands at 70%+ adoption.',

    track: 'function',
    level: 'intermediate',
    audience: ['director', 'manager', 'technical'],
    functions: ['it-engineering'],
    industries: ['cross-industry'],
    stack: ['microsoft'],
    pairedPhase: ['train', 'innovate', 'sustain'],

    duration: '70 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-20',

    interactiveUrl: '/ai-academy/m365-copilot-adoption',

    hookSentence:
      'Most Copilot rollouts stall at 10–20% six months in. This is the honest IT/change playbook for landing at 70%+ — persona licensing, 4-week pilot, prompt libraries, governance, measurement, and the 90-day plan.',
    whoThisIsFor:
      'IT leaders, change managers, modern-workplace owners, and the digital-adoption teams responsible for landing Microsoft 365 Copilot at scale. Especially relevant for organisations sitting on paid licenses with low actual usage — and for IT teams about to make a $1–10M Copilot commitment they need to defend at renewal.',
    whatYoullLearn: [
      'Why most Copilot rollouts stall at 10–20% — three honest reasons, none of them technology',
      'Persona-based licensing math — four personas, the year-1 spend cut, how to push back on blanket-license pressure',
      'The 4-week pilot template — week-by-week activities, exit criteria, and how the pilot funds the wider rollout',
      'Persona-based prompt libraries — structure, content sourcing, governance — the asset that makes Copilot stick',
      'Governance and the IT conversation — DLP, sensitivity labels, sharing posture, SharePoint hygiene before scale',
      'Measurement in steady state — four numbers, three cadences, what fund renewal and detect drift',
      'Scaling and the second wave — how to expand without losing what made the first wave work',
      'Your 90-day Copilot rollout plan on one page — three phases, three deliverables, executive-sponsor ready',
    ],
    chapters: [
      {
        number: 1,
        title: 'The Copilot adoption problem',
        duration: '8 min',
        objectives: [
          'Name the three honest reasons most Copilot rollouts stall — none of them about technology',
          'Distinguish what IT owns from what change management owns — and why the split decides the outcome',
        ],
      },
      {
        number: 2,
        title: 'Licensing strategy',
        duration: '9 min',
        objectives: [
          'Run persona-based sizing across four personas with adoption probability per persona',
          'Defend the math against vendor blanket-license pressure — save 30–50% of year-1 spend',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Pilot design for Copilot',
        duration: '9 min',
        objectives: [
          'Run the 4-week pilot template — week-by-week activities and exit criteria',
          'Build the executive-sponsor presentation that turns the pilot into funded rollout',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Persona-based prompt libraries',
        duration: '9 min',
        objectives: [
          'Build the role-specific prompt library that makes Copilot stick after week two',
          'Apply content-sourcing and governance disciplines so the library stays current and trusted',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Governance and the IT conversation',
        duration: '9 min',
        objectives: [
          'Run the 30-day IT preparation sprint — DLP, sensitivity labels, sharing posture, SharePoint audit',
          'Have the IT-funding conversation that protects the rollout from a late-stage data-exposure incident',
        ],
      },
      {
        number: 6,
        title: 'Measurement in steady state',
        duration: '8 min',
        objectives: [
          'Track four numbers, three cadences — the steady-state Copilot health dashboard',
          'Detect drift early — silent license churn, persona attrition, prompt-library staleness',
        ],
      },
      {
        number: 7,
        title: 'Scaling and the second wave',
        duration: '8 min',
        objectives: [
          'Expand beyond the initial 400 licenses without losing what made wave one work',
          'Build the champion network as the scaling infrastructure for waves three through five',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone — Your 90-day Copilot rollout plan',
        duration: '6 min',
        objectives: [
          'Collapse the course into a three-phase, 90-day rollout plan with one deliverable per phase',
          'Schedule the three quarter-1 conversations: executive sponsor, IT director, change-management lead',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 90-Day Copilot Rollout Plan',
    references: [
      {
        title: 'Microsoft 365 Copilot — Adoption Hub',
        source: 'Microsoft Adoption',
        url: 'https://adoption.microsoft.com/en-us/copilot/',
      },
      {
        title: 'Microsoft 365 Copilot — Setup & Configuration',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/',
      },
      {
        title: 'Data, Privacy, and Security for Microsoft 365 Copilot',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-privacy',
      },
      {
        title: 'Microsoft Purview — Information Protection (Sensitivity Labels)',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/purview/information-protection',
      },
    ],
    pairedPocs: ['poc-17-microsoft-365-copilot-rollout'],
    relatedCourseSlugs: [
      'building-ai-agents-copilot-studio',
      'ai-foundations-for-everyone',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // BUILDER TRACK — Copilot Studio
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'building-ai-agents-copilot-studio',
    title: 'Building AI Agents with Copilot Studio',
    subtitle:
      'A 75-minute production-readiness course — architecture, topics vs generative, plugins, agents, knowledge + MCP + Dataverse, ALM, and governance at scale.',

    track: 'builder',
    level: 'intermediate',
    audience: ['technical'],
    functions: ['it-engineering'],
    industries: ['cross-industry'],
    stack: ['microsoft'],
    pairedPhase: ['innovate', 'build', 'sustain'],

    duration: '75 min',
    chapterCount: 8,
    format: ['interactive', 'video', 'hands-on'],

    status: 'available',
    lastUpdated: '2026-05-20',

    interactiveUrl: '/ai-academy/building-ai-agents-copilot-studio',

    hookSentence:
      'Power Platform builders: build agents that actually ship to production — three architectural decisions made deliberately, governance built in from chapter one, and the 12-item production-gate checklist that gets the agent through review.',
    whoThisIsFor:
      'Power Platform developers, citizen developers, solution architects, and admins responsible for the Copilot Studio footprint in their organisation. Useful whether you\'re building your first agent or your fiftieth — and essential for teams scaling beyond five agents where governance discipline becomes the determinant of program success.',
    whatYoullLearn: [
      'Copilot Studio architecture — six components and the three architectural decisions at the start',
      'Topic design vs generative answers — four-question framework + the topic-explosion anti-pattern',
      'Plugins and connectors at production scale — auth model + three production failure modes',
      'Agents and agent flows — three orchestration patterns + state isolation under concurrent load',
      'Knowledge sources, MCP, and Dataverse grounding with row-level security and cross-role test',
      'Deployment with three environments + managed solutions + pipelines matched to scale',
      'Governance and monitoring at scale — three layers + five signals + three estate rhythms',
      'Your production-grade agent — three-section design + 12-item gate checklist + four conversations',
    ],
    chapters: [
      {
        number: 1,
        title: 'Copilot Studio architecture',
        duration: '10 min',
        objectives: [
          'Map the six components and where each runs (topics, generative, plugins, agents, knowledge, governance)',
          'Make the three architectural decisions at the start of every agent explicitly',
        ],
      },
      {
        number: 2,
        title: 'Topic design vs generative answers',
        duration: '9 min',
        objectives: [
          'Apply the four-question framework per intent (determinism, actions, finite space, variation)',
          'Recognise the topic-explosion anti-pattern early and converge to the hybrid pattern',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Plugins and connectors at production scale',
        duration: '10 min',
        objectives: [
          'Choose between first-party, certified third-party, and custom connectors deliberately',
          'Deploy the four-component auth model and three production failure-mode patterns',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Agents and agent flows',
        duration: '10 min',
        objectives: [
          'Match the orchestration pattern (Q&A, transactional, research) to the actual problem class',
          'Pass the concurrent-user state isolation test before launch',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Knowledge sources, MCP, and Dataverse grounding',
        duration: '10 min',
        objectives: [
          'Combine SharePoint, files, web, and MCP sources matched to content\'s natural home',
          'Configure Dataverse RLS, field-level security, and pass the three-role cross-test before launch',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Deployment, ALM, and environments',
        duration: '9 min',
        objectives: [
          'Run the three-environment promotion path (dev/test/prod) with managed solutions in test and prod',
          'Pick the right pipeline pattern (Power Platform Pipelines, Azure DevOps, GitHub Actions) for your scale',
        ],
      },
      {
        number: 7,
        title: 'Governance and monitoring at scale',
        duration: '10 min',
        objectives: [
          'Configure all three governance layers (tenant, environment, per-agent) explicitly',
          'Monitor the five signals (usage, recognition, action success, cost, feedback) with the three rhythms',
        ],
      },
      {
        number: 8,
        title: 'Capstone — Your production-grade Copilot Studio agent',
        duration: '8 min',
        objectives: [
          'Write the three-section agent design document and self-pass the 12-item production-gate checklist',
          'Schedule the four week-one conversations (business owner, architect, infosec, two intended users)',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your Production-Grade Copilot Studio Agent',
    references: [
      {
        title: 'Microsoft Copilot Studio Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/',
      },
      {
        title: 'Power Platform ALM Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/power-platform/alm/',
      },
      {
        title: 'Model Context Protocol Specification',
        source: 'Anthropic',
        url: 'https://modelcontextprotocol.io/',
      },
      {
        title: 'Dataverse Security Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/power-apps/maker/data-platform/wp-security-cds',
      },
    ],
    pairedPocs: ['poc-05-hr-onboarding-copilot', 'poc-17-microsoft-365-copilot-rollout'],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'm365-copilot-adoption',
      'ab-100-architecting-agentic-ai',
    ],
  },
]

// ────────────────────────────────────────────────────────────────────
// INTERACTIVE COURSES — web-rendered experiences brought into the catalog
// ────────────────────────────────────────────────────────────────────
const interactiveCourses: Course[] = [
  {
    slug: 'ab-100',
    title: 'AB-100: Architecting Agentic AI Business Solutions',
    subtitle:
      'The flagship interactive course — Microsoft AB-100 certification prep with chapter-by-chapter web experience, audio narration, and a 50-question mock exam.',

    track: 'builder',
    level: 'advanced',
    audience: ['technical', 'director'],
    functions: ['it-engineering', 'strategy'],
    industries: ['cross-industry'],
    stack: ['microsoft'],
    pairedPhase: ['train', 'build'],

    duration: '~20 hours',
    chapterCount: 13,
    format: ['interactive', 'reading', 'video'],

    status: 'available',
    lastUpdated: '2026-05-19',

    interactiveUrl: '/ai-academy/ab-100',

    hookSentence:
      'Microsoft AB-100 certification prep — interactive web experience covering business analysis, AI strategy, design, extensibility, orchestration, monitoring, and governance.',
    whoThisIsFor:
      'AI Solution Architects, senior engineers, Microsoft partners, and Microsoft Certified Trainer candidates preparing for the AB-100 exam. Especially valuable for practitioners building agentic AI solutions on the Microsoft stack — Copilot Studio, Azure AI Foundry, Dynamics 365.',
    whatYoullLearn: [
      'Analyze business requirements and ground AI solutions in real data architecture',
      'Develop an AI strategy aligned with the Cloud Adoption Framework',
      'Design responsible AI solutions across Copilot Studio and Azure AI Foundry',
      'Orchestrate prebuilt agents across Dynamics 365 and the broader Microsoft stack',
      'Apply ALM, testing, monitoring, and governance to production AI systems',
      'Pass the AB-100 exam — 50 questions, 120 minutes, 700/1000 to pass',
    ],
    chapters: [
      {
        number: 1,
        title: 'Introduction to Agentic AI',
        duration: '90 min',
        objectives: [
          'Define the AI Solution Architect role and its scope',
          'Map the agentic AI solution landscape across the Microsoft platform',
        ],
      },
      {
        number: 2,
        title: 'Analyze Business Requirements',
        duration: '100 min',
        objectives: [
          'Translate business needs into AI specifications',
          'Apply grounding and data architecture patterns to scope solutions',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Develop AI Strategy',
        duration: '120 min',
        objectives: [
          'Apply the Cloud Adoption Framework to AI strategy decisions',
          'Choose between agent types and solution design rules',
        ],
        hasQuiz: true,
      },
      {
        number: 4,
        title: 'Return on AI Investment',
        duration: '100 min',
        objectives: [
          'Model TCO across model router and inference patterns',
          'Construct a defensible ROI case for AI initiatives',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Design AI Solutions',
        duration: '120 min',
        objectives: [
          'Apply Responsible AI principles across Copilot Studio and Azure AI Foundry',
          'Select solution design patterns appropriate to use case requirements',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Design Extensibility',
        duration: '100 min',
        objectives: [
          'Extend agent capabilities with connectors, plugins, and MCP',
          'Apply Computer Use patterns where appropriate',
        ],
      },
      {
        number: 7,
        title: 'Orchestrate Prebuilt Agents',
        duration: '110 min',
        objectives: [
          'Map Dynamics 365 prebuilt agent capabilities to business needs',
          'Orchestrate multiple prebuilt agents across solution boundaries',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Analyze, Monitor, Tune',
        duration: '110 min',
        objectives: [
          'Design telemetry and feedback loops for AI solutions',
          'Continuously improve solutions through evaluation and tuning',
        ],
      },
      {
        number: 9,
        title: 'Manage Testing',
        duration: '100 min',
        objectives: [
          'Apply prompt validation and multi-app E2E testing',
          'Build a quality assurance plan for agentic systems',
        ],
        hasQuiz: true,
      },
      {
        number: 10,
        title: 'ALM for AI Solutions',
        duration: '110 min',
        objectives: [
          'Apply application lifecycle management across environments',
          'Manage data ALM and custom model ALM at scale',
        ],
      },
      {
        number: 11,
        title: 'RAI, Security &amp; Governance',
        duration: '120 min',
        objectives: [
          'Implement Responsible AI controls across the lifecycle',
          'Apply security patterns and govern risk and compliance',
        ],
        hasQuiz: true,
      },
      {
        number: 12,
        title: 'Final Revision',
        duration: '80 min',
        objectives: [
          'Synthesize cross-cutting frameworks for the exam',
          'Recognize common pitfalls and exam-day patterns',
        ],
      },
      {
        number: 13,
        title: 'Capstone: AB-100 Mock Exam',
        duration: '120 min',
        objectives: [
          'Sit a full 50-question mock exam matching the real format',
          'Identify weak areas and revise targeted topics before the real exam',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'AB-100 Mock Exam — 50 questions, 120 minutes, 700/1000 to pass',
    references: [
      {
        title: 'AB-100: Architecting Agentic AI Business Solutions (exam page)',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/ab-100/',
      },
      {
        title: 'Microsoft Copilot Studio Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/microsoft-copilot-studio/',
      },
      {
        title: 'Azure AI Foundry Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/ai-studio/',
      },
      {
        title: 'Microsoft Cloud Adoption Framework',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/',
      },
      {
        title: 'Responsible AI at Microsoft',
        source: 'Microsoft',
        url: 'https://www.microsoft.com/en-us/ai/responsible-ai',
      },
    ],
    relatedCourseSlugs: [
      'building-ai-agents-copilot-studio',
      'azure-ai-foundry-essentials',
      'mlops-for-llms',
    ],
  },
]

// ────────────────────────────────────────────────────────────────────
// EXPORTED CATALOG — combined across base + 5 expansion tracks + interactive
// ────────────────────────────────────────────────────────────────────
export const courses: Course[] = [
  ...baseCourses,
  ...foundationsExpanded,
  ...functionExpanded,
  ...leadershipExpanded,
  ...industryExpanded,
  ...builderExpanded,
  ...missingRealCourses,
  ...interactiveCourses,
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
