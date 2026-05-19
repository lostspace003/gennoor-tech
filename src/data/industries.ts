import { pocs } from './pocs'

export interface Industry {
  slug: string
  name: string
  shortName: string
  tagline: string
  hero: string
  whyNow: string
  problems: { title: string; detail: string }[]
  pocIds: string[]
  flagshipCourse?: string
  region?: string
}

export const industries: Industry[] = [
  {
    slug: 'bfsi',
    name: 'BFSI',
    shortName: 'Banking, Financial Services & Insurance',
    tagline: 'AI for banks, insurers, and capital-markets — built for regulators, not demo days.',
    hero: 'Underwriting agents, fraud detection, multimodal RAG over financial PDFs, loan origination — deployed in environments where audit, sovereignty, and explainability are non-negotiable.',
    whyNow:
      'GCC and Africa regulators are issuing AI guidance faster than most banks can absorb. We help BFSI clients move first — with the governance evidence to defend the move.',
    problems: [
      {
        title: 'Manual underwriting bleeds applications',
        detail: 'Retail loan drop-off peaks in the first 24 hours of a manual workflow. Multi-agent underwriting reclaims that window.',
      },
      {
        title: 'Fraud hides inside normal volume',
        detail: 'By the time exception reports catch it, the loss is booked. Real-time anomaly + LLM reasoning closes the gap.',
      },
      {
        title: 'Financial PDFs break pure-text RAG',
        detail: 'Tables, charts, and precise numbers need multimodal pipelines — or you ship confident wrong answers to relationship managers.',
      },
    ],
    pocIds: ['loan-origination-agent', 'anomaly-fraud-engine', 'multimodal-rag-banking', 'invoice-receipt-extraction'],
    flagshipCourse: 'AI in Financial Services',
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    shortName: 'Healthcare & Life Sciences',
    tagline: 'Clinical AI that respects clinician time, patient consent, and regulator scrutiny.',
    hero: 'Ambient documentation, clinical RAG, PHI-safe deployments. We work inside hospital governance frameworks — never around them.',
    whyNow:
      'Physician burnout from EHR work is a measurable patient-safety risk. Ambient documentation has crossed the credibility line — the question is how to deploy it without leaking PHI.',
    problems: [
      {
        title: 'Two hours a day on the EHR',
        detail: 'Documentation crowds out patient time and drives turnover. Ambient capture + structured note generation gives that time back.',
      },
      {
        title: 'PHI restricts public-cloud LLMs',
        detail: 'Standard SaaS AI is off-limits for protected data. We deploy with confidential computing or on-prem inference where required.',
      },
      {
        title: 'Clinical RAG must show its work',
        detail: 'A clinician will not trust an answer without a citation. Every retrieval surfaces source guidelines and timestamps.',
      },
    ],
    pocIds: ['clinical-documentation-assistant', 'enterprise-rag-knowledge-search', 'procurement-vendor-intelligence'],
    flagshipCourse: 'AI in Healthcare',
  },
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    shortName: 'Manufacturing & Industrial',
    tagline: 'AI on the plant floor — predictive maintenance, demand forecasting, agent-assisted operations.',
    hero: 'Time-series anomaly detection that doesn’t cry wolf. LLM-narrated maintenance recommendations that plant engineers actually act on. Demand forecasts that survive contact with the weekly sales meeting.',
    whyNow:
      'Unplanned downtime now costs more than a maintenance budget. The data exists in SCADA and IoT Hub — what’s missing is the layer that turns it into decisions.',
    problems: [
      {
        title: 'Downtime > maintenance budget',
        detail: 'Reactive maintenance is the most expensive maintenance. Predictive maintenance with closed-loop feedback loops changes the math.',
      },
      {
        title: 'Excel-based S&OP',
        detail: 'Forecasts are stale within a week and never trusted. ML + LLM-narrated what-ifs rebuild trust in the number.',
      },
      {
        title: 'Procurement silos hide consolidation',
        detail: 'Spend data is scattered. A procurement agent surfaces consolidation candidates without rebuilding the ERP.',
      },
    ],
    pocIds: ['predictive-maintenance-agent', 'demand-forecasting-engine', 'procurement-vendor-intelligence', 'invoice-receipt-extraction'],
    flagshipCourse: 'AI in Manufacturing',
  },
  {
    slug: 'government',
    name: 'Government',
    shortName: 'Government & Public Sector',
    tagline: 'Multilingual citizen services, sovereign deployments, full audit trails.',
    hero: 'Citizen-facing AI in English, Arabic, Hindi, and Swahili — running on Azure Government, on-premise, or air-gapped depending on what the procurement officer signed off on.',
    whyNow:
      'Public-sector AI is moving from pilot to policy. The early movers are setting the templates the rest of the region will follow.',
    problems: [
      {
        title: 'Call centers overwhelmed by multilingual demand',
        detail: 'Voice + chat agents that handle the routine 70% free human agents for the complex 30%.',
      },
      {
        title: 'Policy documents are unsearchable',
        detail: 'Citizens give up before they find the right form. RAG over policy docs returns cited answers in seconds.',
      },
      {
        title: 'Sovereignty + audit constraints',
        detail: 'Off-the-shelf SaaS LLMs are non-starters. We deploy with full audit logging and the inference layer of your choice.',
      },
    ],
    pocIds: ['citizen-services-multilingual', 'enterprise-rag-knowledge-search'],
    flagshipCourse: 'AI in Government & Public Sector',
  },
  {
    slug: 'energy',
    name: 'Energy',
    shortName: 'Energy & Utilities',
    tagline: 'Predictive maintenance for the grid and the field. Agentic procurement for capex programs.',
    hero: 'From upstream operations to downstream retail — anomaly detection, asset performance, and contract-aware procurement built for the timescales utilities actually operate on.',
    whyNow:
      'Capex programs are too big and too long to manage by spreadsheet. AI surfaces risk early, before it becomes a board-meeting agenda item.',
    problems: [
      {
        title: 'Asset-performance signals get lost',
        detail: 'SCADA tells you something’s wrong; nobody tells you what to do about it. LLM-narrated recommendations close that loop.',
      },
      {
        title: 'Capex contracts are unwieldy',
        detail: 'A procurement-intelligence agent reads them, flags risks, and surfaces renegotiation triggers.',
      },
      {
        title: 'Field-tech knowledge walks out the door',
        detail: 'Senior engineers retire faster than juniors can be trained. RAG over field-service logs keeps the institutional memory accessible.',
      },
    ],
    pocIds: ['predictive-maintenance-agent', 'procurement-vendor-intelligence', 'enterprise-rag-knowledge-search'],
    flagshipCourse: 'AI in Manufacturing',
  },
  {
    slug: 'retail',
    name: 'Retail',
    shortName: 'Retail & E-commerce',
    tagline: 'Demand forecasts that survive promo weeks. Multilingual support that scales without headcount.',
    hero: 'AI for omnichannel retail — forecasting, fraud, multilingual support agents — built for the operating reality of GCC, India, and African markets.',
    whyNow:
      'Margin compression and demand volatility have moved AI from “nice to have” to a defensive necessity. The retailers who built capability in the last cycle won the last cycle.',
    problems: [
      {
        title: 'Forecasts can’t handle promotion volatility',
        detail: 'Standard methods underestimate promo lift and overestimate baseline. ML pipelines tuned per category outperform.',
      },
      {
        title: 'Support volume grows faster than headcount',
        detail: 'Multilingual voice + text agents absorb tier-1 questions and route everything else with full context.',
      },
      {
        title: 'Card-not-present fraud hides in normal volume',
        detail: 'Real-time anomaly detection with case management gives the fraud team back its evenings.',
      },
    ],
    pocIds: ['demand-forecasting-engine', 'multilingual-support-agent', 'anomaly-fraud-engine'],
    flagshipCourse: 'AI for Sales & Marketing',
  },
  {
    slug: 'education',
    name: 'Education',
    shortName: 'Education & EdTech',
    tagline: 'Personalized learning that goes deeper than recommendations. Operational AI that gives teachers their time back.',
    hero: 'Adaptive paths for learners, cohort intelligence for teachers, operational copilots for registrars and admissions — deployed inside the policy and privacy posture education requires.',
    whyNow:
      'EdTech personalization has plateaued at content recommendation. The next layer — diagnosing a learner’s actual gap and generating practice — is where retention is won.',
    problems: [
      {
        title: 'Personalization stops at content suggestions',
        detail: 'Real personalization observes behavior, identifies gaps, and generates customized practice — not just “you might like this video.”',
      },
      {
        title: 'Teacher time on admin',
        detail: 'Lesson plans, parent comms, progress reports. A teacher copilot reclaims those hours for the classroom.',
      },
      {
        title: 'Student data privacy',
        detail: 'Education is a regulated data category. We deploy with the privacy controls institutions are required to defend.',
      },
    ],
    pocIds: ['personalized-learning-path', 'enterprise-rag-knowledge-search', 'meeting-intelligence-tracker'],
    flagshipCourse: 'AI in Education',
  },
]

export const getIndustryBySlug = (slug: string) => industries.find(i => i.slug === slug)
export const getPoCsForIndustry = (industry: Industry) =>
  industry.pocIds.map(id => pocs.find(p => p.id === id)).filter((p): p is NonNullable<typeof p> => Boolean(p))
