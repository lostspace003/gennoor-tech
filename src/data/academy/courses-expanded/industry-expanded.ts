import type { Course } from '../types'

// Industry track expansion + Applied case study — adds Government, Energy & Utilities,
// Retail & E-commerce, Education, and a deep banking multimodal RAG walk-through.

export const industryExpanded: Course[] = [
  // ────────────────────────────────────────────────────────────────────
  // INDUSTRY TRACK — Government & Public Sector
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-public-sector',
    title: 'AI in Government & Public Sector',
    subtitle:
      'Citizen services, case management, and procurement modernization — built around Vision 2030, Digital India, and data-sovereignty rails.',

    track: 'industry',
    level: 'intermediate',
    audience: ['executive', 'director', 'manager'],
    functions: ['strategy', 'it-engineering'],
    industries: ['government'],
    stack: ['microsoft', 'open-source', 'stack-agnostic'],
    pairedPhase: ['diagnose', 'innovate'],

    duration: '65 min',
    chapterCount: 8,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Citizen services, case management, and procurement — with sovereignty, public trust, and Vision 2030 alignment baked in.',
    whoThisIsFor:
      'Public-sector CIOs, government transformation leads, ministry-level technology officers, and senior advisors shaping national digital agendas. Especially valuable for officials operating under Vision 2030, Digital India, UAE National AI Strategy, or comparable regional programs — where AI ambition has to coexist with sovereignty, procurement law, and citizen-trust expectations.',
    whatYoullLearn: [
      'Citizen-service AI — multilingual chatbots and access at population scale',
      'Case-management automation across ministries and agencies',
      'Data sovereignty and residency — the architectural decisions that lock in trust',
      'Procurement modernization without breaking public-tender rules',
      'Aligning AI portfolios to Vision 2030, Digital India, and regional strategies',
      'A public-trust framework you can publish, not just file',
    ],
    chapters: [
      {
        number: 1,
        title: 'The government-AI fit map',
        duration: '8 min',
        objectives: [
          'Identify 7 high-fit AI use cases across federal, state, and municipal layers',
          'Recognize the 3 government use cases where AI consistently fails public scrutiny',
        ],
      },
      {
        number: 2,
        title: 'Citizen services — chatbots and multilingual access',
        duration: '9 min',
        objectives: [
          'Design citizen-facing agents that handle Arabic, Hindi, and regional languages without code-switch failure',
          'Build human-handoff patterns that protect vulnerable users',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Case management automation',
        duration: '8 min',
        objectives: [
          'Apply document AI to permits, applications, and grievances',
          'Maintain audit trails that survive parliamentary review',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Data sovereignty and residency',
        duration: '8 min',
        objectives: [
          'Map sovereignty obligations across GCC, India, and African jurisdictions',
          'Pick between sovereign cloud, hybrid, and on-prem deployment patterns',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Procurement modernization',
        duration: '8 min',
        objectives: [
          'Apply AI to tender evaluation without violating fair-competition rules',
          'Build transparency artefacts auditors and oversight bodies can verify',
        ],
      },
      {
        number: 6,
        title: 'Aligning to Vision 2030, Digital India, regional strategies',
        duration: '8 min',
        objectives: [
          'Map departmental AI portfolios to national strategy pillars',
          'Surface the 4 alignment signals that unlock central funding',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'The public-trust framework',
        duration: '8 min',
        objectives: [
          'Draft a public-trust charter covering transparency, redress, and human oversight',
          'Design citizen-facing AI disclosures that earn — not erode — confidence',
        ],
      },
      {
        number: 8,
        title: 'Capstone: Your ministry-level AI portfolio',
        duration: '8 min',
        objectives: [
          'Pick 3 use cases and sequence them across an 18-month delivery window',
          'Draft the sovereignty and public-trust appendix for cabinet review',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 18-Month Ministry AI Portfolio',
    references: [
      {
        title: 'Saudi Vision 2030 — National Strategy for Data and AI',
        source: 'SDAIA, Kingdom of Saudi Arabia',
        url: 'https://www.sdaia.gov.sa/',
      },
      {
        title: 'Saudi Vision 2030 — Official Programme',
        source: 'Vision 2030, Kingdom of Saudi Arabia',
        url: 'https://www.vision2030.gov.sa/',
      },
      {
        title: 'UAE National Strategy for Artificial Intelligence',
        source: 'UAE Government',
        url: 'https://ai.gov.ae/',
      },
      {
        title: 'Digital India Programme',
        source: 'Ministry of Electronics and IT, Government of India',
        url: 'https://www.digitalindia.gov.in/',
      },
      {
        title: 'World Bank — Digital Government and GovTech',
        source: 'World Bank',
        url: 'https://www.worldbank.org/en/topic/digitaldevelopment',
      },
    ],
    pairedPocs: ['poc-13-citizen-services-multilingual-agent'],
    relatedCourseSlugs: [
      'ai-strategy-c-suite',
      'ai-governance-risk-boards',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // INDUSTRY TRACK — Energy & Utilities
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-energy-utilities',
    title: 'AI in Energy & Utilities',
    subtitle:
      'Grid optimization, renewable forecasting, asset health, and customer engagement — with the regulatory reporting that comes with all of it.',

    track: 'industry',
    level: 'intermediate',
    audience: ['executive', 'director', 'manager', 'technical'],
    functions: ['operations', 'it-engineering'],
    industries: ['energy-utilities'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['diagnose', 'innovate'],

    duration: '60 min',
    chapterCount: 8,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Grid, renewables, assets, outages, and smart-meter customers — six AI patterns that ship inside a regulated utility.',
    whoThisIsFor:
      'Utility executives, energy company leaders, plant managers, and grid operations heads. Especially relevant for transmission and distribution utilities navigating renewable integration across GCC mega-projects, India’s state-level discoms, and African off-grid markets — where AI ambitions live alongside aging assets and demanding regulators.',
    whatYoullLearn: [
      'Grid optimization — where AI augments classical OR (and where it doesn’t)',
      'Renewable integration forecasting — solar, wind, and storage',
      'Predictive asset maintenance at scale — substations, transformers, turbines',
      'Outage prediction and response — beyond reactive ticketing',
      'Customer engagement — smart-meter analytics and demand response',
      'Compliance and regulatory reporting that satisfies both engineers and regulators',
    ],
    chapters: [
      {
        number: 1,
        title: 'The energy-AI fit map',
        duration: '8 min',
        objectives: [
          'Identify 7 use cases that ship inside generation, T&D, and retail utility businesses',
          'Apply the "OT data reliability" filter before scoping any pilot',
        ],
      },
      {
        number: 2,
        title: 'Grid optimization',
        duration: '8 min',
        objectives: [
          'Combine forecasting, optimization, and AI assistants for control-room workflows',
          'Design human-in-loop patterns that dispatchers actually use',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Renewable integration forecasting',
        duration: '8 min',
        objectives: [
          'Build solar and wind forecasts with realistic uncertainty bands',
          'Couple forecasts to storage dispatch and curtailment decisions',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Predictive asset maintenance at scale',
        duration: '8 min',
        objectives: [
          'Apply sensor + LLM patterns to transformers, turbines, and substations',
          'Move past pilot purgatory to fleet-wide deployment',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Outage prediction and response',
        duration: '7 min',
        objectives: [
          'Combine weather, asset, and grid telemetry for outage risk scoring',
          'Build response workflows that compress restoration time',
        ],
      },
      {
        number: 6,
        title: 'Customer engagement and demand response',
        duration: '7 min',
        objectives: [
          'Use smart-meter analytics for segmentation without surveilling households',
          'Design demand-response programs that customers opt into and stay in',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Compliance and regulatory reporting',
        duration: '7 min',
        objectives: [
          'Build LLM-assisted regulatory narratives that survive auditor review',
          'Maintain evidence chains across SCADA, ERP, and AI systems',
        ],
      },
      {
        number: 8,
        title: 'Capstone: Your utility AI portfolio',
        duration: '7 min',
        objectives: [
          'Pick 3 use cases sequenced across 12 months and 2 business units',
          'Draft the regulator-facing summary for the highest-priority initiative',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 12-Month Utility AI Portfolio',
    references: [
      {
        title: 'International Energy Agency — Digitalisation and Energy',
        source: 'IEA',
        url: 'https://www.iea.org/',
      },
      {
        title: 'IRENA — Innovation Landscape for Renewable Power',
        source: 'International Renewable Energy Agency',
        url: 'https://www.irena.org/',
      },
      {
        title: 'NREL — Grid Modernization Research',
        source: 'National Renewable Energy Laboratory',
        url: 'https://www.nrel.gov/',
      },
      {
        title: 'Microsoft Industry — Energy and Resources',
        source: 'Microsoft',
        url: 'https://www.microsoft.com/en-us/industry/',
      },
    ],
    pairedPocs: ['poc-12-predictive-maintenance'],
    relatedCourseSlugs: [
      'ai-in-manufacturing',
      'ai-for-operations-supply-chain',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // INDUSTRY TRACK — Retail & E-commerce
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-retail-ecommerce',
    title: 'AI in Retail & E-commerce',
    subtitle:
      'Personalization, SKU-level forecasting, visual merchandising, pricing, and inventory — with the creepy line clearly marked.',

    track: 'industry',
    level: 'intermediate',
    audience: ['executive', 'director', 'manager'],
    functions: ['sales', 'operations', 'customer-service'],
    industries: ['retail-ecommerce'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['diagnose', 'innovate'],

    duration: '55 min',
    chapterCount: 8,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Personalization, SKU forecasting, visual merchandising, pricing — seven retail AI patterns that move margin without burning customer trust.',
    whoThisIsFor:
      'Retail and e-commerce leaders — CEOs, COOs, CMOs, heads of digital, category directors, and supply-chain leads. Especially relevant for omnichannel retailers across GCC, India, and Africa managing high-SKU assortments, regional pricing dynamics, and customers who switch between physical and digital touchpoints without warning.',
    whatYoullLearn: [
      'Personalization tiers — light, medium, deep — and where the creepy line sits',
      'Demand forecasting at SKU level (not just category level)',
      'Visual merchandising AI — store layouts, planograms, and digital shelf',
      'Customer service at retail scale, across languages',
      'Pricing AI — dynamic, promotional, and competitor-aware',
      'Inventory localization across stores, dark stores, and marketplaces',
    ],
    chapters: [
      {
        number: 1,
        title: 'The retail-AI fit map',
        duration: '7 min',
        objectives: [
          'Identify 7 use cases that ship in modern retail and e-commerce',
          'Apply the "margin impact vs trust risk" matrix to each candidate',
        ],
      },
      {
        number: 2,
        title: 'Personalization without crossing the creepy line',
        duration: '8 min',
        objectives: [
          'Pick the right personalization tier for the surface and the segment',
          'Apply 3 design patterns that keep personalization on the right side of trust',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Demand forecasting at SKU level',
        duration: '7 min',
        objectives: [
          'Move from category-level to SKU-level forecasts that planners trust',
          'Handle long-tail SKUs and new-product introductions',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Visual merchandising AI',
        duration: '7 min',
        objectives: [
          'Apply vision AI to planogram compliance and store-floor analytics',
          'Use AI for digital-shelf merchandising on marketplaces',
        ],
      },
      {
        number: 5,
        title: 'Customer service at scale',
        duration: '6 min',
        objectives: [
          'Run multilingual, omnichannel customer service across chat, voice, and email',
          'Design escalation paths that protect CSAT during peak season',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Pricing AI',
        duration: '7 min',
        objectives: [
          'Use AI for dynamic, promotional, and competitor-aware pricing',
          'Avoid the 3 pricing AI patterns that damage long-term loyalty',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Inventory localization',
        duration: '6 min',
        objectives: [
          'Localize stocking across stores, dark stores, and 3P fulfilment nodes',
          'Couple inventory AI to last-mile delivery realities in your markets',
        ],
      },
      {
        number: 8,
        title: 'Capstone: Your retail AI roadmap',
        duration: '7 min',
        objectives: [
          'Pick 3 use cases sequenced across 2 quarters and 2 channels',
          'Define margin, CSAT, and stock-availability KPIs your CEO will track',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 2-Quarter Retail AI Roadmap',
    references: [
      {
        title: 'NRF — State of Retail and the Consumer',
        source: 'National Retail Federation',
        url: 'https://nrf.com/',
      },
      {
        title: 'Gartner — Retail Industry Insights',
        source: 'Gartner',
        url: 'https://www.gartner.com/',
      },
      {
        title: 'Microsoft Industry — Retail and Consumer Goods',
        source: 'Microsoft',
        url: 'https://www.microsoft.com/en-us/industry/',
      },
      {
        title: 'World Economic Forum — Future of Jobs Report',
        source: 'WEF',
        url: 'https://www.weforum.org/',
      },
    ],
    pairedPocs: ['poc-15-demand-forecasting'],
    relatedCourseSlugs: [
      'ai-for-sales-marketing',
      'ai-for-operations-supply-chain',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // INDUSTRY TRACK — Education
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-in-education',
    title: 'AI in Education',
    subtitle:
      'Personalized learning, campus operations, admissions, assessment, and academic integrity — with regional-language reality included.',

    track: 'industry',
    level: 'intermediate',
    audience: ['executive', 'director', 'manager'],
    functions: ['strategy', 'operations'],
    industries: ['education'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['diagnose', 'innovate'],

    duration: '55 min',
    chapterCount: 8,
    format: ['video', 'reading'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Personalized learning, campus operations, admissions, and assessment — with academic integrity and regional-language reality front and centre.',
    whoThisIsFor:
      'University administrators, EdTech leaders, school-network operators, and ministries of education shaping policy and procurement. Especially valuable for institutions across GCC, India, and Africa where the language of instruction, cost pressure, and assessment integrity collide — and where Arabic, Hindi, Swahili, and other regional languages must be first-class citizens, not afterthoughts.',
    whatYoullLearn: [
      'Personalized learning paths — where AI helps and where it overpromises',
      'Campus operations — admissions through alumni',
      'Admissions assistance — fair, multilingual, and audit-friendly',
      'Academic integrity in the AI era — detection vs assessment redesign',
      'Assessment AI — formative, summative, and adaptive',
      'Regional-language models for non-English instruction at scale',
    ],
    chapters: [
      {
        number: 1,
        title: 'The education-AI fit map',
        duration: '7 min',
        objectives: [
          'Identify 7 high-fit AI use cases across K-12, higher-ed, and lifelong learning',
          'Recognize the 3 patterns where AI consistently damages learning outcomes',
        ],
      },
      {
        number: 2,
        title: 'Personalized learning paths',
        duration: '8 min',
        objectives: [
          'Design adaptive learning sequences from existing curriculum content',
          'Avoid the "personalized busywork" anti-pattern',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Campus operations',
        duration: '7 min',
        objectives: [
          'Apply AI to scheduling, facilities, and student-success workflows',
          'Build dashboards your registrar and deans actually use',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Admissions assistance',
        duration: '7 min',
        objectives: [
          'Deploy multilingual admissions agents that handle complex programme questions',
          'Maintain fairness across applicant cohorts and bypass identity proxies',
        ],
      },
      {
        number: 5,
        title: 'Academic integrity in the AI era',
        duration: '7 min',
        objectives: [
          'Move past AI-detection arms races to assessment redesign',
          'Build integrity frameworks faculty and students will accept',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Assessment AI',
        duration: '7 min',
        objectives: [
          'Apply AI to formative feedback at scale, with teacher oversight',
          'Design summative assessment that resists prompt-injection cheating',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Regional language models for non-English instruction',
        duration: '6 min',
        objectives: [
          'Evaluate Arabic, Hindi, Swahili, and regional-language model quality for education',
          'Build fallback patterns for low-resource languages and dialects',
        ],
      },
      {
        number: 8,
        title: 'Capstone: Your institution AI portfolio',
        duration: '6 min',
        objectives: [
          'Pick 3 use cases sequenced across one academic cycle',
          'Draft the academic-integrity and language-access appendix for your senate',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your Academic-Cycle AI Portfolio',
    references: [
      {
        title: 'UNESCO — Digital Education and AI',
        source: 'UNESCO',
        url: 'https://www.unesco.org/en/digital-education',
      },
      {
        title: 'World Economic Forum — Future of Jobs Report',
        source: 'WEF',
        url: 'https://www.weforum.org/',
      },
      {
        title: 'Digital India Programme — Education Initiatives',
        source: 'Ministry of Electronics and IT, Government of India',
        url: 'https://www.digitalindia.gov.in/',
      },
      {
        title: 'Microsoft Industry — Education',
        source: 'Microsoft',
        url: 'https://www.microsoft.com/en-us/industry/',
      },
    ],
    relatedCourseSlugs: [
      'ai-foundations-for-everyone',
      'ai-strategy-c-suite',
      'ai-in-government-public-sector',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // APPLIED TRACK — Banking Multimodal RAG Case Study
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'banking-multimodal-rag-case-study',
    title: 'Case Study: Banking Multimodal RAG',
    subtitle:
      'Walk a real bank build end-to-end — Azure AI Search + Vision + GPT-4o, document cracking, hybrid retrieval, and an MRM submission that actually passes.',

    track: 'applied',
    level: 'advanced',
    audience: ['technical', 'director', 'manager'],
    functions: ['it-engineering', 'finance'],
    industries: ['financial-services'],
    stack: ['microsoft'],
    pairedPhase: ['innovate', 'build'],

    duration: '65 min',
    chapterCount: 9,
    format: ['video', 'reading', 'hands-on'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'A nine-chapter walk-through of a real bank multimodal RAG build — from document cracking to MRM submission, on Azure.',
    whoThisIsFor:
      'Technical leaders, ML engineers, and product managers learning by walking through a real bank multimodal RAG build. Especially valuable for teams who have shipped a text-only RAG and run head-first into the realities of charts, tables, scanned annexures, and regulator pre-checks — RBI in India, SAMA in the Gulf — and need to see a production-grade build cohere end-to-end on the Microsoft stack.',
    whatYoullLearn: [
      'Why pure text-RAG fails on financial documents — concretely, with examples',
      'A Stack Fit Assessment for Azure AI Search, Azure AI Vision, and GPT-4o',
      'Document cracking across text, tables, and charts in real annual reports',
      'Indexing and hybrid retrieval strategies at production scale',
      'An evaluation harness that lets the model risk team sleep at night',
      'How an MRM submission and regulator pre-check actually read',
    ],
    prerequisites: ['ai-in-financial-services', 'rag-architectures-foundations'],
    chapters: [
      {
        number: 1,
        title: 'The banking use case — why pure text-RAG fails on financial documents',
        duration: '7 min',
        objectives: [
          'Walk through the failure modes pure text-RAG hits on annual reports and disclosures',
          'Define the success criteria the bank actually negotiated with the business',
        ],
      },
      {
        number: 2,
        title: 'Stack Fit Assessment — Azure AI Search, Vision, GPT-4o',
        duration: '8 min',
        objectives: [
          'Map each capability to a concrete part of the retrieval and generation pipeline',
          'Justify hybrid search (vector + keyword + semantic ranker) for this workload',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Document cracking — text, tables, and charts',
        duration: '8 min',
        objectives: [
          'Crack scanned PDFs, embedded tables, and chart imagery into retrieval-ready chunks',
          'Preserve table semantics so the model can reason over rows and columns',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Indexing strategy',
        duration: '7 min',
        objectives: [
          'Design index schemas that carry chunk type, page, and source-document provenance',
          'Pick embedding models and chunk sizes that hold up across financial document classes',
        ],
        hasExercise: true,
      },
      {
        number: 5,
        title: 'Hybrid search at production scale',
        duration: '8 min',
        objectives: [
          'Tune hybrid search and semantic ranker for financial vocabulary',
          'Build re-ranking and citation surfacing the front-end can render trustworthy',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Evaluation harness',
        duration: '7 min',
        objectives: [
          'Design a labelled eval set across retrieval, grounding, and answer accuracy',
          'Wire continuous evaluation into the CI pipeline so regressions surface early',
        ],
      },
      {
        number: 7,
        title: 'Regulatory acceptance — RBI and SAMA pre-checks',
        duration: '7 min',
        objectives: [
          'Map the build to RBI and SAMA expectations on explainability and auditability',
          'Anticipate the 5 questions regional regulators consistently ask about RAG',
        ],
      },
      {
        number: 8,
        title: 'MRM submission',
        duration: '7 min',
        objectives: [
          'Structure a Model Risk Management submission that mirrors Basel-aligned expectations',
          'Document model lineage, eval results, and human-in-loop controls in a defensible pack',
        ],
        hasQuiz: true,
      },
      {
        number: 9,
        title: 'Capstone: Adapt the build to your bank',
        duration: '6 min',
        objectives: [
          'Translate the reference architecture to your bank’s document set and regulator',
          'Draft the first 30 days of your own multimodal RAG build plan',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 30-Day Multimodal RAG Build Plan',
    references: [
      {
        title: 'Azure AI Search Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/search/',
      },
      {
        title: 'Azure AI Vision Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/',
      },
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
        title: 'BCBS — Principles for the Sound Management of Operational Risk',
        source: 'Basel Committee on Banking Supervision',
        url: 'https://www.bis.org/bcbs/',
      },
    ],
    pairedPocs: ['poc-04-multimodal-rag-banking'],
    relatedCourseSlugs: [
      'ai-in-financial-services',
      'building-ai-agents-copilot-studio',
    ],
  },
]
