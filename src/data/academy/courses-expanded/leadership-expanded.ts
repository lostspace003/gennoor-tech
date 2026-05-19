import type { Course } from '../types'

// Leadership track — expanded catalog.
// Five executive briefs aimed at CDOs, CIOs, FP&A and PMO leads, audit committees,
// and procurement/VMO leaders. Style matches the original 13-course catalog:
// senior advisor speaking to senior peers, regional fluency, no buzzword theater.

export const leadershipExpanded: Course[] = [
  // ────────────────────────────────────────────────────────────────────
  // LEADERSHIP TRACK — AI Strategy for the CDO
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-strategy-for-cdo',
    title: 'AI Strategy for the CDO',
    subtitle:
      'A 55-minute strategic brief for Chief Data Officers — running AI and data strategy as one portfolio without losing either.',

    track: 'leadership',
    level: 'advanced',
    audience: ['executive', 'director'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['diagnose', 'sustain'],

    duration: '55 min',
    chapterCount: 7,
    format: ['reading', 'video'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Where the CDO mandate has expanded — data foundations, governance partnership, vendor sprawl, and the board KPIs nobody else can defend.',
    whoThisIsFor:
      'Chief Data Officers, Chief Data & Analytics Officers, heads of enterprise data, and senior data leaders now also accountable for AI strategy. Especially valuable for CDOs at BFSI, healthcare, telco, and large public-sector entities across the GCC and India who are being asked to run AI ambition without sacrificing the data-quality and lineage foundation the rest of the enterprise still depends on.',
    whatYoullLearn: [
      'How the CDO mandate has shifted with the AI portfolio sitting on top of it',
      'The data foundations AI actually needs — beyond the marketecture diagrams',
      'Governance partnership patterns with the CISO and CRO that don\'t fall apart in month 6',
      'How to prioritize investment across data plumbing, MDM, and AI platforms',
      'Vendor management when MDM, MLOps, and AI platform vendors all claim the same turf',
      'The 4 KPIs a CDO can credibly report to the board on AI value',
    ],
    chapters: [
      {
        number: 1,
        title: 'The CDO mandate in the AI era',
        duration: '8 min',
        objectives: [
          'Distinguish the pre-AI CDO scope from the expanded mandate',
          'Identify the 3 boundary fights every CDO is now having with CIO and CTO',
        ],
      },
      {
        number: 2,
        title: 'Data foundations that AI actually needs',
        duration: '9 min',
        objectives: [
          'Separate the data work that unblocks AI from the data work that doesn\'t',
          'Apply a "minimum viable data foundation" filter to your roadmap',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Governance partnership with CISO and CRO',
        duration: '8 min',
        objectives: [
          'Design a RACI for AI governance that holds across CDO, CISO, and CRO',
          'Pre-empt the 3 turf fights that derail AI governance committees',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Investment prioritization across data and AI',
        duration: '8 min',
        objectives: [
          'Sequence data-foundation and AI investments so neither starves',
          'Use a 3-horizon allocation framework defensible at finance committee',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Vendor management — MDM vs MLOps vs AI platforms',
        duration: '8 min',
        objectives: [
          'Map the overlapping claims of MDM, data catalog, MLOps, and AI platform vendors',
          'Avoid the 4-vendor stack that nobody can integrate',
        ],
      },
      {
        number: 6,
        title: 'KPIs the CDO reports to the board',
        duration: '7 min',
        objectives: [
          'Pick 4 KPIs that survive 12 months of board scrutiny',
          'Translate data quality and lineage into language directors act on',
        ],
        hasQuiz: true,
      },
      {
        number: 7,
        title: 'Capstone: Your CDO–CIO–CISO charter',
        duration: '7 min',
        objectives: [
          'Draft a 1-page joint charter you can take to your CEO',
          'Define the escalation pattern when data quality blocks an AI initiative',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 1,
    capstoneTitle: 'Your 1-Page CDO–CIO–CISO Joint Charter',
    references: [
      {
        title: 'NIST AI Risk Management Framework',
        source: 'National Institute of Standards and Technology',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'Saudi Vision 2030 — National Strategy for Data and AI',
        source: 'SDAIA, Kingdom of Saudi Arabia',
        url: 'https://www.sdaia.gov.sa/',
      },
      {
        title: 'McKinsey — The State of AI: How organizations are rewiring to capture value',
        source: 'McKinsey & Company',
        url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights',
      },
      {
        title: 'MIT Sloan Management Review — AI and the data stack',
        source: 'MIT Sloan',
        url: 'https://sloanreview.mit.edu/topic/artificial-intelligence/',
      },
    ],
    relatedCourseSlugs: [
      'ai-strategy-c-suite',
      'ai-strategy-for-cio',
      'ai-governance-risk-boards',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // LEADERSHIP TRACK — AI Strategy for the CIO
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-strategy-for-cio',
    title: 'AI Strategy for the CIO',
    subtitle:
      'A 55-minute brief for CIOs balancing AI inside a real technology portfolio — infra, build vs buy, talent, risk, and the board conversation.',

    track: 'leadership',
    level: 'advanced',
    audience: ['executive', 'director'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['diagnose', 'sustain'],

    duration: '55 min',
    chapterCount: 7,
    format: ['reading', 'video'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'AI is one workload competing for CIO attention. Six decisions that determine whether it stays additive or quietly eats your portfolio.',
    whoThisIsFor:
      'CIOs, deputy CIOs, heads of enterprise architecture, and senior IT leaders accountable for AI alongside ERP modernization, cloud migration, cybersecurity, and run-the-bank operations. Especially valuable for CIOs at large enterprises and public-sector bodies across the GCC, India, and Africa who are being asked to fund AI without backing off the rest of the IT plan that the CEO already signed.',
    whatYoullLearn: [
      'Where AI sits inside a real CIO portfolio — not the slide-deck version',
      'Infrastructure decisions across cloud, on-prem, sovereign cloud, and hybrid',
      'Build vs buy in AI — and the third option most pitches skip',
      'Talent strategy — insource, partner, or rotate, by capability',
      'Operational and risk considerations only the CIO can answer',
      'How to report AI honestly to a CEO and board already tracking 12 other programs',
    ],
    chapters: [
      {
        number: 1,
        title: 'AI\'s place in the CIO portfolio',
        duration: '8 min',
        objectives: [
          'Locate AI inside the run / grow / transform allocation',
          'Spot the 3 portfolio failures triggered by treating AI as a side program',
        ],
      },
      {
        number: 2,
        title: 'Infrastructure decisions — cloud, on-prem, hybrid',
        duration: '9 min',
        objectives: [
          'Apply a 5-criterion test across hyperscaler, sovereign cloud, and on-prem options',
          'Recognize when GCC data residency or India localization rules force the answer',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Build vs buy in AI',
        duration: '8 min',
        objectives: [
          'Decide build, buy, or compose with three concrete criteria',
          'Spot the "buy that turned into build" pattern before it hits your budget',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Talent strategy — insource vs partner',
        duration: '8 min',
        objectives: [
          'Pick the right talent model per AI capability (data, MLOps, prompt, governance)',
          'Avoid the SI dependency trap that kills 18-month sustainability',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Risk and operational considerations',
        duration: '8 min',
        objectives: [
          'Pre-empt the 4 ops risks unique to AI workloads at production scale',
          'Build the resiliency and BCDR posture for AI services',
        ],
      },
      {
        number: 6,
        title: 'Reporting AI to the CEO and board',
        duration: '7 min',
        objectives: [
          'Build a CIO board view that holds AI alongside the rest of IT honestly',
          'Apply the 3-metric structure that survives a full board cycle',
        ],
        hasQuiz: true,
      },
      {
        number: 7,
        title: 'Capstone: Your CIO AI portfolio view',
        duration: '7 min',
        objectives: [
          'Draft a 1-page CIO AI portfolio statement for your next executive committee',
          'Define the trade-offs you\'ll surface to the CEO before they\'re forced',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 1,
    capstoneTitle: 'Your 1-Page CIO AI Portfolio Statement',
    references: [
      {
        title: 'NIST AI Risk Management Framework',
        source: 'National Institute of Standards and Technology',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'Gartner — Top Strategic Technology Trends',
        source: 'Gartner',
        url: 'https://www.gartner.com/',
      },
      {
        title: 'EU AI Act — Final Text',
        source: 'European Parliament',
        url: 'https://artificialintelligenceact.eu/',
      },
      {
        title: 'SDAIA — National Strategy for Data and AI',
        source: 'Saudi Data and AI Authority',
        url: 'https://www.sdaia.gov.sa/',
      },
    ],
    relatedCourseSlugs: [
      'ai-strategy-c-suite',
      'ai-strategy-for-cdo',
      'ai-vendor-management',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // LEADERSHIP TRACK — AI ROI & Business Case Building
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-roi-business-case-building',
    title: 'AI ROI & Business Case Building',
    subtitle:
      'A 45-minute working session for FP&A, PMO, and strategy partners — building AI business cases your CFO actually signs.',

    track: 'leadership',
    level: 'intermediate',
    audience: ['manager', 'director', 'executive'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['diagnose'],

    duration: '45 min',
    chapterCount: 7,
    format: ['reading', 'video'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Most AI business cases over-promise productivity and under-cost change. Six chapters on building cases that survive the CFO.',
    whoThisIsFor:
      'FP&A business partners, PMO leads, transformation officers, strategy team members, and corporate development folks who get tapped to build the AI business case the CFO will challenge. Useful in regulated and capital-disciplined environments — banks, insurers, public-sector entities, large family groups across the GCC and India — where soft ROI claims don\'t survive the second review.',
    whatYoullLearn: [
      'The four ROI patterns — and where each one actually shows up in real P&Ls',
      'How to quantify productivity gains without the magical-thinking discount',
      'Full cost modeling — infra, licensing, people, change, and the tail',
      'Risk-adjusted returns and how to present them honestly',
      'Two business cases walked through end-to-end — one that ships, one that shouldn\'t',
      'The 6 ROI traps that quietly kill credibility on case #2 and #3',
    ],
    chapters: [
      {
        number: 1,
        title: 'The four ROI patterns recap',
        duration: '6 min',
        objectives: [
          'Anchor productivity, efficiency, growth, and risk-reduction ROI in concrete P&L lines',
          'Spot which pattern a sponsor is implicitly claiming before you start modeling',
        ],
      },
      {
        number: 2,
        title: 'Quantifying productivity gains realistically',
        duration: '7 min',
        objectives: [
          'Apply a defensible 3-step productivity quantification method',
          'Discount for adoption ramp, displacement reality, and "saved time that wasn\'t reinvested"',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Cost modeling — infra, license, people, change',
        duration: '8 min',
        objectives: [
          'Build a 4-layer cost model that captures the tail nobody scopes',
          'Spot the 3 cost categories vendors leave out of their TCO slides',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Risk-adjusted returns',
        duration: '7 min',
        objectives: [
          'Apply scenario-weighted NPV to AI initiatives without making it a math exercise',
          'Show downside and base-case in a single chart your CFO won\'t throw out',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Two sample business cases walked through',
        duration: '8 min',
        objectives: [
          'Walk through a contact-center AI assist case that survives finance review',
          'Walk through a "GenAI for sales" case that shouldn\'t — and learn why',
        ],
      },
      {
        number: 6,
        title: 'Common ROI traps and how to disarm them',
        duration: '5 min',
        objectives: [
          'Identify the 6 recurring ROI traps in AI business cases',
          'Build pre-mortem questions you ask the sponsor before modeling starts',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Capstone: Your AI business case template',
        duration: '4 min',
        objectives: [
          'Draft a 1-page business case structure for your next AI initiative',
          'Define the 3 assumptions you\'ll require the sponsor to sign',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 1-Page AI Business Case Template',
    references: [
      {
        title: 'McKinsey Global Survey — The state of AI',
        source: 'McKinsey & Company',
        url: 'https://www.mckinsey.com/capabilities/quantumblack/our-insights',
      },
      {
        title: 'MIT Sloan Management Review — AI and ROI',
        source: 'MIT Sloan',
        url: 'https://sloanreview.mit.edu/topic/artificial-intelligence/',
      },
      {
        title: 'Stanford HAI — AI Index Report',
        source: 'Stanford Institute for Human-Centered AI',
        url: 'https://hai.stanford.edu/',
      },
    ],
    relatedCourseSlugs: [
      'ai-strategy-c-suite',
      'ai-for-finance-accounting',
      'ai-vendor-management',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // LEADERSHIP TRACK — AI Risk for Audit Committees
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-risk-for-audit-committees',
    title: 'AI Risk for Audit Committees',
    subtitle:
      'A 45-minute working session for audit committee chairs and internal audit leaders — the questions that surface real AI risk.',

    track: 'leadership',
    level: 'intermediate',
    audience: ['board', 'executive', 'director'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['sustain'],

    duration: '45 min',
    chapterCount: 7,
    format: ['reading', 'video'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'AI risk doesn\'t fit cleanly into the existing risk universe — and most audit committees aren\'t asking the right questions yet.',
    whoThisIsFor:
      'Audit committee chairs, audit committee members, chief audit executives, and internal audit leaders. Especially valuable for committees overseeing BFSI, healthcare, public-sector, and listed entities across the GCC, India, and Africa where regulators are converging fast on AI assurance expectations and the existing risk universe wasn\'t built for model risk and bias risk.',
    prerequisites: ['ai-governance-risk-boards'],
    whatYoullLearn: [
      'Where AI sits inside the existing risk universe — and where it doesn\'t fit',
      'Inherent vs residual risk applied honestly to AI systems',
      'How to map AI risks onto your existing COSO / three-lines / control frameworks',
      'The audit committee questions that surface real risk vs. theater',
      'Independent assurance approaches — first, second, and third line',
      'How to report AI risk to the full board without inducing panic or sleep',
    ],
    chapters: [
      {
        number: 1,
        title: 'AI in the risk universe',
        duration: '7 min',
        objectives: [
          'Locate AI risk inside operational, compliance, strategic, and reputational categories',
          'Spot the 3 risks AI introduces that don\'t map cleanly to legacy buckets',
        ],
      },
      {
        number: 2,
        title: 'Inherent vs residual risk for AI systems',
        duration: '7 min',
        objectives: [
          'Apply inherent / residual risk thinking to a live AI use case',
          'Avoid the "controls assumed" anti-pattern in residual ratings',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Mapping AI to existing control frameworks',
        duration: '7 min',
        objectives: [
          'Map AI risks onto COSO ERM, three lines of defense, and ISO 31000',
          'Use NIST AI RMF Govern/Map/Measure/Manage to fill the AI-specific gaps',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'The audit committee questions that surface real risk',
        duration: '8 min',
        objectives: [
          'Apply a 9-question line of inquiry that exposes weak AI controls',
          'Distinguish answers that reflect maturity from answers that reflect rehearsal',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Independent assurance approaches',
        duration: '6 min',
        objectives: [
          'Decide which AI controls need first, second, or third-line assurance',
          'Set a 12-month internal audit AI plan that doesn\'t over-rotate',
        ],
      },
      {
        number: 6,
        title: 'Reporting AI risk to the full board',
        duration: '6 min',
        objectives: [
          'Build the 1-page AI risk view the full board will actually read',
          'Avoid the heatmap-as-theater trap',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Capstone: Your audit committee AI playbook',
        duration: '4 min',
        objectives: [
          'Draft the 9 questions your committee will ask at the next AI review',
          'Define the escalation path from internal audit findings to full-board action',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your Audit Committee AI Playbook',
    references: [
      {
        title: 'NIST AI Risk Management Framework',
        source: 'National Institute of Standards and Technology',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'IIA — Artificial Intelligence Auditing Framework',
        source: 'The Institute of Internal Auditors',
        url: 'https://www.theiia.org/',
      },
      {
        title: 'NACD — Director\'s Handbook on Cyber-Risk Oversight',
        source: 'National Association of Corporate Directors',
        url: 'https://www.nacdonline.org/',
      },
      {
        title: 'PCAOB — Considerations for Audits of AI in Financial Reporting',
        source: 'Public Company Accounting Oversight Board',
        url: 'https://pcaobus.org/',
      },
      {
        title: 'OECD AI Principles',
        source: 'OECD',
        url: 'https://oecd.ai/en/ai-principles',
      },
    ],
    relatedCourseSlugs: [
      'ai-governance-risk-boards',
      'ai-strategy-c-suite',
      'ai-vendor-management',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // LEADERSHIP TRACK — AI Vendor Management
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-vendor-management',
    title: 'AI Vendor Management',
    subtitle:
      'A 50-minute working session for procurement, VMOs, and IT sourcing — running AI vendors with the same discipline as any other critical supplier.',

    track: 'leadership',
    level: 'intermediate',
    audience: ['manager', 'director', 'executive'],
    industries: ['cross-industry'],
    stack: ['stack-agnostic'],
    pairedPhase: ['diagnose', 'sustain'],

    duration: '50 min',
    chapterCount: 7,
    format: ['reading', 'video'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Hyperscalers, ISVs, boutiques, and SI partners are all selling "AI." Six chapters on running them as suppliers, not as magic.',
    whoThisIsFor:
      'Chief procurement officers, vendor management office leads, IT sourcing leaders, category managers for technology, and contracts directors. Especially valuable for VMOs at BFSI, healthcare, telco, and large public-sector buyers across the GCC and India who now have AI sitting across half of their software renewals and need a consistent way to diligence, contract, and exit AI vendors.',
    whatYoullLearn: [
      'The AI vendor landscape — hyperscalers, ISVs, boutiques, SI partners, and where each one actually adds value',
      'A diligence checklist built for AI specifically — not the generic SaaS template',
      'Contract terms that matter — IP, data, model risk, sub-processors, training-use',
      'Performance SLAs that mean something for AI services (latency, accuracy, drift)',
      'Lock-in mitigation — open weights, data portability, prompt portability, escrow',
      'Vendor offboarding — the conversation nobody plans for and everyone needs',
    ],
    chapters: [
      {
        number: 1,
        title: 'The AI vendor landscape',
        duration: '8 min',
        objectives: [
          'Distinguish hyperscaler, ISV, boutique, and SI value propositions',
          'Recognize the 3 vendor archetypes most likely to over-promise on AI',
        ],
      },
      {
        number: 2,
        title: 'Diligence checklist for AI vendors',
        duration: '8 min',
        objectives: [
          'Apply a 12-item AI-specific diligence checklist before signing',
          'Spot the diligence answers that are red flags vs. routine',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Contract terms — IP, data, model risk, sub-processors',
        duration: '8 min',
        objectives: [
          'Negotiate the 6 AI-specific clauses most standard MSAs are missing',
          'Pin down sub-processor disclosure and training-data-use commitments',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Performance SLAs that mean something',
        duration: '7 min',
        objectives: [
          'Set SLAs across latency, availability, accuracy, and drift',
          'Avoid the "uptime-only SLA" trap that ignores model behavior',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Lock-in mitigation',
        duration: '7 min',
        objectives: [
          'Apply 4 lock-in tests — model, data, prompt, integration',
          'Use open weights, portability commitments, and escrow where they\'re realistic',
        ],
        hasExercise: true,
      },
      {
        number: 6,
        title: 'Vendor offboarding — the conversation nobody plans',
        duration: '6 min',
        objectives: [
          'Pre-write the offboarding plan at signing, not at termination',
          'Identify the 3 offboarding risks unique to AI (data deletion proof, model retention, retraining echoes)',
        ],
      },
      {
        number: 7,
        title: 'Capstone: Your AI vendor playbook',
        duration: '6 min',
        objectives: [
          'Draft a 1-page AI vendor diligence and contract playbook your category team can apply',
          'Define the tiering rule that decides which AI vendors get the full treatment',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 1-Page AI Vendor Playbook',
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
        title: 'Gartner — Sourcing and Vendor Management research',
        source: 'Gartner',
        url: 'https://www.gartner.com/',
      },
      {
        title: 'SAMA — Outsourcing Regulations',
        source: 'Saudi Central Bank',
        url: 'https://www.sama.gov.sa/',
      },
    ],
    relatedCourseSlugs: [
      'ai-strategy-for-cio',
      'ai-governance-risk-boards',
      'ai-risk-for-audit-committees',
    ],
  },
]
