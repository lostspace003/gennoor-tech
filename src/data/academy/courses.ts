import type { Course } from './types'
import { foundationsExpanded } from './courses-expanded/foundations-expanded'
import { functionExpanded } from './courses-expanded/function-expanded'
import { leadershipExpanded } from './courses-expanded/leadership-expanded'
import { industryExpanded } from './courses-expanded/industry-expanded'
import { builderExpanded } from './courses-expanded/builder-expanded'

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
  // FUNCTION TRACK — Sales
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-sales-marketing',
    title: 'AI for Sales & Marketing',
    subtitle:
      'Where AI ships real value in sales and marketing — prospecting, scoring, proposals, personalization — and where the brand risk lives.',

    track: 'function',
    level: 'foundational',
    audience: ['individual-contributor', 'manager', 'director'],
    functions: ['sales'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate'],

    duration: '55 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Prospecting, lead scoring, proposal generation, content production — with the brand and compliance traps clearly named.',
    whoThisIsFor:
      'CROs, CMOs, sales ops, demand gen, and revenue operations leaders. Especially useful for teams already on Salesforce, HubSpot, or Microsoft Sales Copilot who want to move from "we have AI" to measurable productivity gains.',
    whatYoullLearn: [
      'AI in prospecting — beyond "automate the SDR"',
      'Lead scoring with AI — and the data quality reality',
      'Proposal generation — fast, branded, on-message',
      'Content production at scale (without losing your brand)',
      'Personalization that doesn\'t cross the creepy line',
      'Sales call AI — what to do with transcripts and signals',
    ],
    chapters: [
      {
        number: 1,
        title: 'The sales-AI fit map',
        duration: '7 min',
        objectives: [
          'Identify 7 high-fit AI use cases in sales and marketing',
          'Spot the 3 use cases where AI consistently disappoints',
        ],
      },
      {
        number: 2,
        title: 'AI in prospecting',
        duration: '7 min',
        objectives: [
          'Use AI for ICP refinement and account research',
          'Avoid the "AI-spam" outbound trap that kills response rates',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Lead scoring with AI',
        duration: '7 min',
        objectives: [
          'Combine ML scoring with LLM-driven signal extraction',
          'Audit your CRM data quality before scoring',
        ],
      },
      {
        number: 4,
        title: 'Proposal generation',
        duration: '7 min',
        objectives: [
          'Build branded proposal templates with CRM context',
          'Set guardrails so generated proposals stay on-message',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Content production — at scale, on brand',
        duration: '7 min',
        objectives: [
          'Use AI for first drafts without losing voice',
          'Spot the 4 brand risks of generative content',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Personalization that works',
        duration: '7 min',
        objectives: [
          'Apply personalization tiers from light to deep',
          'Stay on the right side of the creepy line',
        ],
      },
      {
        number: 7,
        title: 'Sales call AI — transcripts to action',
        duration: '6 min',
        objectives: [
          'Use call AI to extract next steps and risk signals',
          'Build feedback loops that improve rep coaching',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone: Your sales AI portfolio',
        duration: '7 min',
        objectives: [
          'Pick 3 use cases, sequence them across 2 quarters',
          'Define KPIs that prove (or disprove) ROI',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 2-Quarter Sales AI Portfolio',
    references: [
      {
        title: 'State of Sales — Salesforce Research',
        source: 'Salesforce',
        url: 'https://www.salesforce.com/resources/research-reports/state-of-sales/',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
      {
        title: 'HubSpot State of AI in Marketing',
        source: 'HubSpot Research',
        url: 'https://www.hubspot.com/state-of-marketing',
      },
    ],
    pairedPocs: ['poc-06-sales-proposal-generator'],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'ai-for-customer-service-support',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — Customer Service
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-customer-service-support',
    title: 'AI for Customer Service & Support',
    subtitle:
      'A 50-minute deep dive on where AI helps support (and where it backfires) — agent assist, bots, voice, escalation, frontline adoption.',

    track: 'function',
    level: 'foundational',
    audience: ['individual-contributor', 'manager', 'director'],
    functions: ['customer-service'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate'],

    duration: '50 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Agent assist vs full bots, multilingual support, sentiment + escalation — with the customer-trust risks named clearly.',
    whoThisIsFor:
      'CX leaders, support managers, and ops teams running customer service across phone, chat, and email. Especially useful for teams considering bot deployments at scale and concerned about CSAT impact.',
    whatYoullLearn: [
      'Agent assist vs full bots — when each pattern fits',
      'Multilingual support at production scale',
      'Knowledge base AI that doesn\'t hallucinate policies',
      'Sentiment & escalation logic that frontline teams trust',
      'Voice support AI — beyond IVR',
      'Adoption with frontline teams (the part that decides success)',
    ],
    chapters: [
      {
        number: 1,
        title: 'The CS-AI fit map',
        duration: '7 min',
        objectives: [
          'Pick the right pattern: assist, bot, or no AI',
          'Map AI candidates to your contact-volume curve',
        ],
      },
      {
        number: 2,
        title: 'Agent assist done right',
        duration: '7 min',
        objectives: [
          'Design suggested-response patterns that reps actually use',
          'Avoid the 3 agent-assist anti-patterns',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Full bots — when and how',
        duration: '7 min',
        objectives: [
          'Choose the deflection patterns that improve (not degrade) CSAT',
          'Design clean human-handoff so customers don\'t repeat themselves',
        ],
      },
      {
        number: 4,
        title: 'Multilingual support at scale',
        duration: '6 min',
        objectives: [
          'Architect for the languages your customers actually use',
          'Handle code-switching common in GCC, India, Africa',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Knowledge base AI — without hallucinated policies',
        duration: '7 min',
        objectives: [
          'Ground answers in the actual KB, not the model\'s memory',
          'Build citation patterns customers can verify',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Sentiment, escalation, frontline trust',
        duration: '6 min',
        objectives: [
          'Use sentiment signals without surveilling reps',
          'Build escalation logic teams actually rely on',
        ],
      },
      {
        number: 7,
        title: 'Voice support AI',
        duration: '5 min',
        objectives: [
          'Move beyond IVR to natural-voice flows',
          'Spot the latency and accent gotchas in production',
        ],
      },
      {
        number: 8,
        title: 'Capstone: Your CS AI rollout plan',
        duration: '5 min',
        objectives: [
          'Pick one pattern to pilot in 4 weeks',
          'Define CSAT, deflection, and AHT targets',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 1,
    capstoneTitle: 'Your 4-Week CS AI Pilot Plan',
    references: [
      {
        title: 'Gartner — CX in the Age of AI',
        source: 'Gartner Research',
        url: 'https://www.gartner.com/en/customer-service-support',
      },
      {
        title: 'Microsoft Customer Service in the Era of AI',
        source: 'Microsoft',
        url: 'https://www.microsoft.com/en-us/dynamics-365/blog/business-leader/category/customer-service/',
      },
      {
        title: 'McKinsey — Customer Operations and AI',
        source: 'McKinsey & Company',
        url: 'https://www.mckinsey.com/capabilities/operations/our-insights',
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
      'Demand forecasting, procurement, logistics, predictive maintenance — what ships, what doesn\'t, and how to scope a credible pilot.',

    track: 'function',
    level: 'foundational',
    audience: ['individual-contributor', 'manager', 'director', 'executive'],
    functions: ['operations'],
    industries: ['cross-industry', 'manufacturing', 'retail-ecommerce'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate'],

    duration: '60 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Operations is where AI either creates compounding savings or burns budget. Six use cases that ship, with their data-readiness reality.',
    whoThisIsFor:
      'COOs, supply chain directors, operations leaders, plant managers, and logistics heads. Especially useful for teams managing complex, multi-node operations across GCC, India, and Africa.',
    whatYoullLearn: [
      'Demand forecasting — ML vs LLM vs neither',
      'Procurement automation — invoice, vendor, contract',
      'Logistics optimization — what AI does well (and what it doesn\'t)',
      'Predictive maintenance — beyond the vendor pitch',
      'Inventory intelligence and supplier risk',
      'End-to-end visibility — the data-quality reality',
    ],
    chapters: [
      {
        number: 1,
        title: 'The ops-AI fit map',
        duration: '8 min',
        objectives: [
          'Identify 7 high-ROI AI use cases in operations',
          'Apply the "data ready / process stable" filter',
        ],
      },
      {
        number: 2,
        title: 'Demand forecasting with AI',
        duration: '8 min',
        objectives: [
          'Pick classical ML, LLM, or neither for your forecasting need',
          'Build forecasts your ops team will actually use',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Procurement automation',
        duration: '7 min',
        objectives: [
          'Apply document AI to invoices, contracts, and POs',
          'Build human-in-loop workflows that pass audit',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Logistics optimization',
        duration: '7 min',
        objectives: [
          'Use AI where classical OR fails (and recognize when not to)',
          'Apply route optimization with real-world disruptions',
        ],
      },
      {
        number: 5,
        title: 'Predictive maintenance',
        duration: '8 min',
        objectives: [
          'Combine sensor data with LLM narratives for plant engineers',
          'Spot the 3 PdM vendor-pitch traps',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Inventory intelligence',
        duration: '7 min',
        objectives: [
          'Apply AI to stock-outs and overstock simultaneously',
          'Surface insights in formats that match your ops cadence',
        ],
      },
      {
        number: 7,
        title: 'Supplier risk and end-to-end visibility',
        duration: '7 min',
        objectives: [
          'Use AI to monitor supplier signals from news + financial data',
          'Build dashboards your ops committee will trust',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone: Your ops AI roadmap',
        duration: '8 min',
        objectives: [
          'Pick 2 use cases, sequence them across 2 quarters',
          'Define operations KPIs (not AI metrics)',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 2-Quarter Operations AI Roadmap',
    references: [
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

    duration: '60 min',
    chapterCount: 8,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Clinical documentation, patient journey AI, imaging awareness, hospital ops — with PHI handling and FDA/regulator posture made explicit.',
    whoThisIsFor:
      'Hospital administrators, CMIOs, CIOs, and digital health leaders. Especially relevant for healthcare systems across GCC, India, and Africa balancing AI ambition with regulatory and ethical responsibility.',
    whatYoullLearn: [
      'Clinical documentation AI — ambient voice and beyond',
      'Patient journey AI — triage, scheduling, follow-up',
      'Imaging AI — what to know without becoming a radiologist',
      'Pharmacy & inventory — under-rated AI wins',
      'Hospital operations — bed management, staffing, throughput',
      'PHI handling and regulatory posture across regions',
    ],
    chapters: [
      {
        number: 1,
        title: 'The healthcare-AI fit map',
        duration: '8 min',
        objectives: [
          'Identify 8 use cases that ship in hospital operations',
          'Recognize 3 where AI is the wrong tool',
        ],
      },
      {
        number: 2,
        title: 'Clinical documentation AI',
        duration: '8 min',
        objectives: [
          'Apply ambient voice to clinical notes safely',
          'Build clinician trust through edit-and-approve workflows',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Patient journey AI',
        duration: '7 min',
        objectives: [
          'Use AI in triage and scheduling without removing human judgment',
          'Design follow-up flows that improve outcomes, not annoy',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Imaging AI — what admins need to know',
        duration: '7 min',
        objectives: [
          'Evaluate imaging AI vendor claims',
          'Understand FDA/CDSCO regulatory posture for SaMD',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Pharmacy and inventory',
        duration: '6 min',
        objectives: [
          'Apply AI to drug-drug interaction and stocking',
          'Reduce stock-outs in critical categories',
        ],
      },
      {
        number: 6,
        title: 'Hospital operations',
        duration: '7 min',
        objectives: [
          'Use AI for bed management and staffing predictions',
          'Build throughput dashboards your COO trusts',
        ],
      },
      {
        number: 7,
        title: 'PHI handling and regulatory posture',
        duration: '8 min',
        objectives: [
          'Classify PHI handling across cloud, hybrid, and on-prem patterns',
          'Map regulatory obligations across India, GCC, US, EU',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone: Your hospital AI portfolio',
        duration: '9 min',
        objectives: [
          'Pick 3 use cases sequenced over 12 months',
          'Draft the governance pack your board needs to approve them',
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
      'Predictive maintenance, quality vision, process optimization, supply chain — beyond the demo, into the plant.',

    track: 'industry',
    level: 'intermediate',
    audience: ['executive', 'director', 'manager', 'technical'],
    functions: ['operations', 'it-engineering'],
    industries: ['manufacturing'],
    stack: ['microsoft', 'open-source', 'stack-agnostic'],
    pairedPhase: ['diagnose', 'innovate'],

    duration: '55 min',
    chapterCount: 7,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Plants don\'t tolerate vendor demos. Six manufacturing-AI use cases that actually survive the shop floor.',
    whoThisIsFor:
      'Plant managers, VPs of manufacturing, operations directors, and industrial engineering leaders. Especially useful for mid-sized manufacturers in India and GCC industrializing rapidly.',
    whatYoullLearn: [
      'Predictive maintenance done right (and the failure modes)',
      'Quality vision — beyond the camera demo',
      'Process optimization with AI assistance',
      'Supply chain integration at the plant level',
      'Safety AI — augmenting human attention',
      'Digital twin — pragmatic, not aspirational',
    ],
    chapters: [
      {
        number: 1,
        title: 'The manufacturing-AI fit map',
        duration: '8 min',
        objectives: [
          'Identify 6 use cases that ship in plant environments',
          'Apply the "data reliability" and "OT/IT bridge" filter',
        ],
      },
      {
        number: 2,
        title: 'Predictive maintenance',
        duration: '8 min',
        objectives: [
          'Combine vibration/temperature data with LLM narratives',
          'Spot the 3 PdM project killers before kickoff',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Quality vision AI',
        duration: '8 min',
        objectives: [
          'Architect vision systems that handle messy real-world conditions',
          'Build feedback loops that improve with operator labels',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Process optimization',
        duration: '7 min',
        objectives: [
          'Use AI to surface non-obvious process improvements',
          'Avoid overfitting to historical bad practices',
        ],
      },
      {
        number: 5,
        title: 'Supply chain at the plant',
        duration: '7 min',
        objectives: [
          'Connect AI forecasting to actual production planning',
          'Handle supplier disruptions in real-time',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Safety AI and digital twin',
        duration: '7 min',
        objectives: [
          'Augment human safety attention with AI without over-relying',
          'Use digital twin pragmatically (not as a 5-year megaproject)',
        ],
      },
      {
        number: 7,
        title: 'Capstone: Your plant AI roadmap',
        duration: '10 min',
        objectives: [
          'Pick 2 plant-floor use cases for the next 12 months',
          'Define OEE and quality KPIs that prove ROI',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 1,
    capstoneTitle: 'Your 12-Month Plant AI Roadmap',
    references: [
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
        title: 'World Economic Forum — Lighthouse Network',
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
  // BUILDER TRACK — Copilot Studio
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'building-ai-agents-copilot-studio',
    title: 'Building AI Agents with Copilot Studio',
    subtitle:
      'From topic-based bots to agent flows — Copilot Studio architecture, plugins, MCP integration, Dataverse grounding, deployment & governance.',

    track: 'builder',
    level: 'intermediate',
    audience: ['technical'],
    functions: ['it-engineering'],
    industries: ['cross-industry'],
    stack: ['microsoft'],
    pairedPhase: ['innovate', 'build'],

    duration: '70 min',
    chapterCount: 9,
    format: ['video', 'hands-on', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Power Platform developers and citizen developers: build agents that actually ship to production — with governance built in from chapter one.',
    whoThisIsFor:
      'Power Platform developers, citizen developers, solution architects, and admins responsible for the Copilot Studio footprint in their organization. Useful whether you\'re building your first agent or your fiftieth.',
    whatYoullLearn: [
      'Copilot Studio architecture — what runs where',
      'Topic design vs generative answers — when to use each',
      'Plugin and connector patterns at production scale',
      'Agents, agent flows, and the new orchestration model',
      'MCP (Model Context Protocol) integration patterns',
      'Dataverse grounding, deployment, and governance',
    ],
    chapters: [
      {
        number: 1,
        title: 'Copilot Studio architecture',
        duration: '7 min',
        objectives: [
          'Map the components: topics, generative answers, agents, plugins, connectors',
          'Understand where each component runs and what it touches',
        ],
      },
      {
        number: 2,
        title: 'Topic design vs generative answers',
        duration: '8 min',
        objectives: [
          'Pick the right pattern for each user intent',
          'Avoid the topic-explosion anti-pattern',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Plugins and connectors',
        duration: '8 min',
        objectives: [
          'Wire Copilot Studio into custom APIs cleanly',
          'Handle authentication, errors, and rate limits',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Agents and agent flows',
        duration: '8 min',
        objectives: [
          'Design multi-turn agent flows with state',
          'Apply orchestration patterns that scale',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'MCP integration',
        duration: '7 min',
        objectives: [
          'Use Model Context Protocol to expose data to agents',
          'Apply MCP security and scope patterns',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Dataverse grounding',
        duration: '8 min',
        objectives: [
          'Ground agents in Dataverse for enterprise data scenarios',
          'Apply RLS (row-level security) correctly',
        ],
      },
      {
        number: 7,
        title: 'Deployment and environments',
        duration: '7 min',
        objectives: [
          'Promote agents across dev/test/prod environments',
          'Use ALM patterns for Copilot Studio',
        ],
      },
      {
        number: 8,
        title: 'Governance and monitoring',
        duration: '8 min',
        objectives: [
          'Apply tenant-wide governance for Copilot Studio sprawl',
          'Set up usage monitoring and cost alerts',
        ],
        hasQuiz: true,
      },
      {
        number: 9,
        title: 'Capstone: Ship a production-grade agent',
        duration: '9 min',
        objectives: [
          'Design and document a real agent for your environment',
          'Pass the governance checklist before deployment',
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
      'ai-for-hr-people-teams',
    ],
  },
]

// ────────────────────────────────────────────────────────────────────
// INTERACTIVE COURSES — web-rendered experiences brought into the catalog
// ────────────────────────────────────────────────────────────────────
const interactiveCourses: Course[] = [
  {
    slug: 'ab-100-architecting-agentic-ai',
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
