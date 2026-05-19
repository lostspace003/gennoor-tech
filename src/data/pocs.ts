export type PoCCategory =
  | 'Documents & Knowledge'
  | 'Agents'
  | 'Industry-Specific'
  | 'Analytics & Forecasting'
  | 'Productivity & Adoption'

export interface PriceBand {
  smb?: string
  enterprise: string
}

export interface PoC {
  id: string
  title: string
  category: PoCCategory
  phaseTag: 'Phase 3 — Build' | 'Phase 2 — Train' | 'Phase 1 — Diagnose' | 'Phase 4 — Sustain'
  problem: string
  build: string[]
  industries: string[]
  functions?: string[]
  timeline: string
  priceBand: PriceBand
  sustainmentBand: string
  pairedCourseId?: string
  pairedCourseTitle?: string
  technologies: string[]
  architecture?: string
  metrics?: { label: string; value: string }[]
  githubUrl?: string
  note?: string
}

export const pocs: PoC[] = [
  // ─── Documents & Knowledge ───
  {
    id: 'invoice-receipt-extraction',
    title: 'Invoice & Receipt AI Extraction',
    category: 'Documents & Knowledge',
    phaseTag: 'Phase 3 — Build',
    problem: 'AP teams hand-key thousands of invoices a month with errors and lag — month-end close drags by days.',
    build: [
      'Document AI ingestion with table, signature, and multi-language extraction',
      'LLM verification layer to flag mismatches and request human review on low-confidence fields',
      'ERP write-back integration (SAP, D365, Oracle) with audit trail',
    ],
    industries: ['BFSI', 'Manufacturing', 'Retail'],
    functions: ['Finance'],
    timeline: '4 weeks',
    priceBand: { smb: '$15k–$25k', enterprise: '$50k–$120k' },
    sustainmentBand: '$2k–$8k / mo',
    pairedCourseId: 'ai-for-finance-accounting',
    pairedCourseTitle: 'AI for Finance & Accounting',
    technologies: ['Azure AI Document Intelligence', 'GPT-4o', 'Logic Apps', 'Azure Functions'],
  },
  {
    id: 'contract-legal-review',
    title: 'Contract & Legal Document Review',
    category: 'Documents & Knowledge',
    phaseTag: 'Phase 3 — Build',
    problem: 'Legal teams spend hours redlining standard contracts against playbooks that exist only in senior counsel’s head.',
    build: [
      'Clause extraction and classification across NDA, MSA, SOW, vendor templates',
      'Risk flagging against a configurable playbook with severity scoring',
      'Side-by-side comparison view with suggested fallback language',
    ],
    industries: ['Legal Services', 'BFSI', 'Real Estate'],
    functions: ['Legal'],
    timeline: '6 weeks',
    priceBand: { smb: '$20k–$35k', enterprise: '$60k–$150k' },
    sustainmentBand: '$3k–$10k / mo',
    pairedCourseId: 'ai-for-legal-risk-compliance',
    pairedCourseTitle: 'AI for Legal, Risk & Compliance',
    technologies: ['Azure AI Language', 'GPT-4o', 'Cosmos DB', 'M365 add-in'],
  },
  {
    id: 'enterprise-rag-knowledge-search',
    title: 'Enterprise RAG / Knowledge Search',
    category: 'Documents & Knowledge',
    phaseTag: 'Phase 3 — Build',
    problem: 'Employees can’t find policies, SOPs, or technical docs scattered across SharePoint, Confluence, and shared drives.',
    build: [
      'Hybrid search (keyword + vector + semantic ranking) over the enterprise corpus',
      'Citation-backed answers with click-through to source documents',
      'Document-level access control honoring existing AD/Entra group permissions',
    ],
    industries: ['All'],
    functions: ['HR', 'Operations', 'Customer Service'],
    timeline: '6 weeks',
    priceBand: { smb: '$25k–$45k', enterprise: '$80k–$200k' },
    sustainmentBand: '$4k–$15k / mo',
    pairedCourseId: 'prompt-engineering-practitioners',
    pairedCourseTitle: 'Prompt Engineering for Practitioners',
    technologies: ['Azure AI Search', 'GPT-4o', 'text-embedding-3-large', 'Cosmos DB', 'Entra ID'],
  },
  {
    id: 'multimodal-rag-banking',
    title: 'Multimodal RAG for Financial Documents',
    category: 'Documents & Knowledge',
    phaseTag: 'Phase 3 — Build',
    problem: 'Financial PDFs contain tables, charts, and precise numbers that pure text-RAG misses — answers come back confidently wrong.',
    build: [
      'Two-stage pipeline: text extraction + image extraction with semantic chunking that preserves table context',
      'Hybrid search combining keyword precision (SWIFT, IBAN, dates) with semantic similarity',
      'GPT-4o multimodal answers with page-number citations and inline figure references',
    ],
    industries: ['BFSI', 'Audit', 'Consulting'],
    functions: ['Finance'],
    timeline: '6–8 weeks',
    priceBand: { enterprise: '$90k–$220k' },
    sustainmentBand: '$5k–$18k / mo',
    pairedCourseId: 'ai-in-financial-services',
    pairedCourseTitle: 'AI in Financial Services',
    technologies: ['Azure AI Search', 'Azure AI Vision', 'GPT-4o', 'Hybrid Search', 'Python'],
    githubUrl: 'https://github.com/lostspace003/multimodal-rag-banking',
    metrics: [
      { label: 'Text Accuracy', value: '94.2%' },
      { label: 'Chart Understanding', value: '91.8%' },
      { label: 'Citation Coverage', value: '100%' },
      { label: 'Query Latency', value: '2.1s' },
    ],
    note: 'Reference architecture from prior banking work — code transferable to client tenant.',
  },

  // ─── Agents ───
  {
    id: 'hr-onboarding-copilot',
    title: 'HR Onboarding Copilot',
    category: 'Agents',
    phaseTag: 'Phase 3 — Build',
    problem: 'New joiners flood HR with policy questions; HR becomes the bottleneck for the first 30 days.',
    build: [
      'Copilot Studio agent grounded on policy docs, benefits, and onboarding tasks',
      'Per-role task checklist with calendar reminders and manager nudges',
      'Escalation to HR Business Partner on out-of-scope or sensitive queries',
    ],
    industries: ['All'],
    functions: ['HR'],
    timeline: '4 weeks',
    priceBand: { smb: '$12k–$25k', enterprise: '$40k–$100k' },
    sustainmentBand: '$2k–$6k / mo',
    pairedCourseId: 'ai-for-hr-people-teams',
    pairedCourseTitle: 'AI for HR & People Teams',
    technologies: ['Copilot Studio', 'M365 Copilot', 'SharePoint', 'Teams'],
  },
  {
    id: 'sales-proposal-generator',
    title: 'Sales Proposal Generator',
    category: 'Agents',
    phaseTag: 'Phase 3 — Build',
    problem: 'Sales reps spend half a day assembling proposals from scattered templates, pricing sheets, and stale case studies.',
    build: [
      'Prompt-driven proposal builder with brand templates and approved asset library',
      'CRM context injection (account, deal stage, prior touchpoints) from Dynamics or Salesforce',
      'Versioning and approval workflow with redline tracking',
    ],
    industries: ['B2B (all sectors)'],
    functions: ['Sales'],
    timeline: '4–6 weeks',
    priceBand: { smb: '$15k–$30k', enterprise: '$45k–$110k' },
    sustainmentBand: '$2k–$7k / mo',
    pairedCourseId: 'ai-for-sales-marketing',
    pairedCourseTitle: 'AI for Sales & Marketing',
    technologies: ['GPT-4o', 'Dynamics 365', 'M365 Copilot', 'Power Automate'],
  },
  {
    id: 'multilingual-support-agent',
    title: 'Multilingual Customer Support Agent',
    category: 'Agents',
    phaseTag: 'Phase 3 — Build',
    problem: 'Support volume is scaling faster than headcount; non-English markets are under-served and CSAT is sliding.',
    build: [
      'Voice + text support agent with intent routing and warm handoff to human agents',
      'RAG over the knowledge base with fluency in English, Arabic, Hindi, and Swahili',
      'Real-time sentiment + escalation triggers visible to the team lead dashboard',
    ],
    industries: ['Telecom', 'Retail', 'BFSI'],
    functions: ['Customer Service'],
    timeline: '6–8 weeks',
    priceBand: { smb: '$25k–$50k', enterprise: '$80k–$200k' },
    sustainmentBand: '$5k–$18k / mo',
    pairedCourseId: 'ai-for-customer-service',
    pairedCourseTitle: 'AI for Customer Service & Support',
    technologies: ['Azure AI Speech', 'GPT-4o', 'Copilot Studio', 'Azure AI Search'],
  },
  {
    id: 'finance-reconciliation-agent',
    title: 'Finance Reconciliation Agent',
    category: 'Agents',
    phaseTag: 'Phase 3 — Build',
    problem: 'Month-end close is clogged by manual reconciliation across bank statements, GL, AP/AR — finance owns the weekend.',
    build: [
      'Ingest bank statements, general ledger, and AP/AR sub-ledgers into a unified canonical view',
      'Mismatch detection with proposed journal entries for review',
      'Human-in-the-loop approval with full audit trail back to source documents',
    ],
    industries: ['All'],
    functions: ['Finance'],
    timeline: '6 weeks',
    priceBand: { smb: '$25k–$40k', enterprise: '$70k–$160k' },
    sustainmentBand: '$4k–$12k / mo',
    pairedCourseId: 'ai-for-finance-accounting',
    pairedCourseTitle: 'AI for Finance & Accounting',
    technologies: ['Azure OpenAI', 'Azure Functions', 'Cosmos DB', 'Power BI'],
  },
  {
    id: 'procurement-vendor-intelligence',
    title: 'Procurement & Vendor Intelligence Agent',
    category: 'Agents',
    phaseTag: 'Phase 3 — Build',
    problem: 'Procurement can’t compare vendors, contracts, and pricing across siloed systems — consolidation opportunities go unseen.',
    build: [
      'Ingest vendor docs, contracts, and spend data; build a normalized vendor profile',
      'Consolidation recommendations with realized-savings projections',
      'Renewal risk flags (auto-escalation clauses, terminating SLAs, single-source exposure)',
    ],
    industries: ['Manufacturing', 'Energy', 'Healthcare'],
    functions: ['Operations'],
    timeline: '6 weeks',
    priceBand: { enterprise: '$60k–$140k' },
    sustainmentBand: '$4k–$12k / mo',
    pairedCourseId: 'ai-for-operations-supply-chain',
    pairedCourseTitle: 'AI for Operations & Supply Chain',
    technologies: ['Azure OpenAI', 'Azure AI Document Intelligence', 'Fabric', 'Power BI'],
  },

  // ─── Industry-Specific ───
  {
    id: 'loan-origination-agent',
    title: 'Loan Origination Agent (BFSI)',
    category: 'Industry-Specific',
    phaseTag: 'Phase 3 — Build',
    problem: 'Retail loan applications take days to underwrite manually — drop-off is highest in the first 24 hours.',
    build: [
      'Multi-agent system: KYC verification, income parsing, risk scoring, decisioning aid',
      'Document generation for sanction letters, schedules, and customer comms',
      'Underwriter-in-the-loop dashboard with override audit and rationale capture',
    ],
    industries: ['Retail Banks', 'NBFCs'],
    functions: ['Operations', 'Customer Service'],
    timeline: '8 weeks',
    priceBand: { enterprise: '$120k–$280k' },
    sustainmentBand: '$8k–$25k / mo',
    pairedCourseId: 'ai-in-financial-services',
    pairedCourseTitle: 'AI in Financial Services',
    technologies: ['Azure OpenAI', 'Copilot Studio', 'LangGraph', 'Azure SQL', 'Azure ML'],
  },
  {
    id: 'clinical-documentation-assistant',
    title: 'Clinical Documentation Assistant (Healthcare)',
    category: 'Industry-Specific',
    phaseTag: 'Phase 3 — Build',
    problem: 'Physicians spend ~2 hours a day on EHR documentation — burnout and quality both suffer.',
    build: [
      'Ambient voice capture during patient encounters with consent flow',
      'Structured note generation (SOAP, problem-oriented) with EHR write-back',
      'PHI-safe deployment with audit logging and on-prem inference option',
    ],
    industries: ['Hospitals', 'Clinics'],
    functions: ['Operations'],
    timeline: '8 weeks',
    priceBand: { enterprise: '$100k–$240k' },
    sustainmentBand: '$6k–$20k / mo',
    pairedCourseId: 'ai-in-healthcare',
    pairedCourseTitle: 'AI in Healthcare',
    technologies: ['Azure AI Speech', 'GPT-4o', 'FHIR APIs', 'Azure Confidential Computing'],
    note: 'Requires hospital governance sign-off and clinician training; regulatory caveats explicit on per-PoC page.',
  },
  {
    id: 'predictive-maintenance-agent',
    title: 'Predictive Maintenance Agent (Manufacturing)',
    category: 'Industry-Specific',
    phaseTag: 'Phase 3 — Build',
    problem: 'Unplanned downtime on the line costs more in a quarter than the maintenance team’s entire annual budget.',
    build: [
      'Time-series ingestion from SCADA / OPC UA / IoT Hub with anomaly detection',
      'LLM-narrated maintenance recommendations routed to plant engineers',
      'Closed-loop feedback to refine thresholds and reduce false positives',
    ],
    industries: ['Manufacturing', 'Energy'],
    functions: ['Operations'],
    timeline: '8–10 weeks',
    priceBand: { enterprise: '$100k–$250k' },
    sustainmentBand: '$6k–$20k / mo',
    pairedCourseId: 'ai-in-manufacturing',
    pairedCourseTitle: 'AI in Manufacturing',
    technologies: ['Azure IoT Hub', 'Azure ML', 'Anomaly Detector', 'Power BI', 'GPT-4o'],
  },
  {
    id: 'citizen-services-multilingual',
    title: 'Citizen Services Multilingual Agent (Government)',
    category: 'Industry-Specific',
    phaseTag: 'Phase 3 — Build',
    problem: 'Citizen calls to government services overwhelm contact centers; multilingual demand outpaces staffing.',
    build: [
      'Voice + chat agent grounded on official policy and service documentation',
      'Case-handoff to human agents with full transcript and structured case fields',
      'Sovereign deployment option (Azure Government / on-premise) with full audit trail',
    ],
    industries: ['Government', 'Municipalities'],
    functions: ['Customer Service'],
    timeline: '10 weeks',
    priceBand: { enterprise: '$150k–$350k' },
    sustainmentBand: '$10k–$30k / mo',
    pairedCourseId: 'ai-in-government',
    pairedCourseTitle: 'AI in Government & Public Sector',
    technologies: ['Azure AI Speech', 'GPT-4o', 'Copilot Studio', 'Azure AI Content Safety'],
  },
  {
    id: 'personalized-learning-path',
    title: 'Personalized Learning Path Agent (Education)',
    category: 'Industry-Specific',
    phaseTag: 'Phase 3 — Build',
    problem: 'EdTech platforms struggle to personalize beyond surface-level recommendations — engagement drops after week 3.',
    build: [
      'Behavioral observation across content, quiz, and time-on-task signals',
      'Gap analysis and dynamically generated practice problems with explanations',
      'Teacher dashboard for cohort-level insights and intervention prompts',
    ],
    industries: ['EdTech', 'Universities', 'Ministries of Education'],
    functions: ['Operations'],
    timeline: '6–8 weeks',
    priceBand: { smb: '$30k–$60k', enterprise: '$80k–$180k' },
    sustainmentBand: '$4k–$15k / mo',
    pairedCourseId: 'ai-in-education',
    pairedCourseTitle: 'AI in Education',
    technologies: ['Azure OpenAI', 'Azure ML', 'Cosmos DB', 'Power BI'],
  },

  // ─── Analytics & Forecasting ───
  {
    id: 'demand-forecasting-engine',
    title: 'Demand Forecasting Engine',
    category: 'Analytics & Forecasting',
    phaseTag: 'Phase 3 — Build',
    problem: 'Sales and operations planning runs on Excel — forecasts are stale within a week and never trusted.',
    build: [
      'Time-series + ML forecasting pipeline on Azure ML with weekly retrain',
      'Power BI surfacing with confidence intervals and segment drill-down',
      'Natural-language what-if interface for scenario planning',
    ],
    industries: ['Retail', 'Manufacturing', 'Supply Chain'],
    functions: ['Operations', 'Finance'],
    timeline: '8 weeks',
    priceBand: { smb: '$30k–$55k', enterprise: '$90k–$200k' },
    sustainmentBand: '$5k–$18k / mo',
    pairedCourseId: 'ml-forecasting-business',
    pairedCourseTitle: 'Machine Learning & Forecasting for Business',
    technologies: ['Azure ML', 'Prophet / DeepAR', 'Power BI', 'GPT-4o'],
  },
  {
    id: 'anomaly-fraud-engine',
    title: 'Anomaly Detection / Fraud Engine',
    category: 'Analytics & Forecasting',
    phaseTag: 'Phase 3 — Build',
    problem: 'Fraud and suspicious transactions hide inside normal volume — by the time they surface, the loss is booked.',
    build: [
      'Real-time anomaly detection combining classical ML with LLM reasoning for context',
      'Case management dashboard with investigator workflow and feedback loop',
      'Existing reference architecture from prior CV/fraud work — code transferable',
    ],
    industries: ['BFSI', 'E-commerce', 'Insurance'],
    functions: ['Finance', 'Operations'],
    timeline: '8 weeks',
    priceBand: { enterprise: '$100k–$240k' },
    sustainmentBand: '$7k–$25k / mo',
    pairedCourseId: 'ai-in-financial-services',
    pairedCourseTitle: 'AI in Financial Services',
    technologies: ['Azure ML', 'Anomaly Detector', 'GPT-4o', 'OpenCV', 'Python'],
    githubUrl: 'https://github.com/lostspace003/cv-ocr-banking-pipeline',
    metrics: [
      { label: 'Signature Match', value: '96.3%' },
      { label: 'Forgery Detection', value: '93.7%' },
      { label: 'MICR Accuracy', value: '98.9%' },
    ],
  },

  // ─── Productivity & Adoption ───
  {
    id: 'm365-copilot-rollout',
    title: 'Microsoft 365 Copilot Rollout (Adoption Pilot)',
    category: 'Productivity & Adoption',
    phaseTag: 'Phase 2 — Train',
    problem: 'The licenses are paid for, but adoption is stuck at 10% and finance is asking why.',
    build: [
      'Licensing and persona strategy: who gets Copilot, why, and what success looks like',
      'Persona-based prompt libraries delivered as M365 add-ins',
      'Adoption metrics dashboard with weekly executive read-out',
    ],
    industries: ['All'],
    functions: ['HR', 'Operations'],
    timeline: '4 weeks',
    priceBand: { smb: '$12k–$22k', enterprise: '$40k–$90k' },
    sustainmentBand: '$3k–$10k / mo',
    pairedCourseId: 'm365-copilot-adoption',
    pairedCourseTitle: 'Microsoft 365 Copilot Adoption Playbook',
    technologies: ['M365 Copilot', 'Power BI', 'Viva Insights', 'SharePoint'],
  },
  {
    id: 'meeting-intelligence-tracker',
    title: 'Meeting Intelligence & Action Tracker',
    category: 'Productivity & Adoption',
    phaseTag: 'Phase 3 — Build',
    problem: 'Decisions made in meetings get lost; action items never get followed up — execution drifts.',
    build: [
      'Transcript ingestion from Teams / Zoom with speaker attribution',
      'Decision and action extraction with owner and due-date inference',
      'CRM and project-tool sync (Dynamics, Asana, Planner) plus a weekly digest agent',
    ],
    industries: ['All'],
    functions: ['Operations', 'Sales'],
    timeline: '4–6 weeks',
    priceBand: { smb: '$15k–$28k', enterprise: '$45k–$110k' },
    sustainmentBand: '$2k–$8k / mo',
    pairedCourseId: 'ai-for-operations-supply-chain',
    pairedCourseTitle: 'AI for Operations & Supply Chain',
    technologies: ['Azure AI Speech', 'GPT-4o', 'Power Automate', 'Microsoft Graph'],
  },
]

export const customBuildExamples = [
  {
    title: 'Custom ML model for credit scoring',
    detail: 'Built on the client’s data, deployed on their Azure ML workspace, with explainability dashboards and model card.',
  },
  {
    title: 'Custom analytics platform',
    detail: 'Semantic layer, dashboards, and natural-language query over the client’s data warehouse (Snowflake / Fabric / Synapse).',
  },
  {
    title: 'Custom domain forecast engine',
    detail: 'Domain-specific forecasts — cement output, hospitality occupancy, hospital admissions — with what-if scenarios.',
  },
  {
    title: 'Custom data pipeline + AI layer',
    detail: 'End-to-end MLOps: ingestion → cleaning → feature store → model serving → monitoring.',
  },
  {
    title: 'Custom multi-agent system',
    detail: 'Beyond Copilot Studio — LangGraph, Semantic Kernel, or CrewAI orchestration with custom tools and memory.',
  },
  {
    title: 'Custom on-premise / sovereign deployment',
    detail: 'For regulated clients who can’t use public cloud LLMs. Ollama + private models + air-gapped option.',
  },
]

export const getPoCById = (id: string) => pocs.find(p => p.id === id)
export const getPoCsByCategory = (category: PoCCategory) => pocs.filter(p => p.category === category)
export const getPoCsByIndustry = (industry: string) =>
  pocs.filter(p => p.industries.some(i => i.toLowerCase() === industry.toLowerCase() || i === 'All'))
export const getPoCsByFunction = (fn: string) =>
  pocs.filter(p => p.functions?.some(f => f.toLowerCase() === fn.toLowerCase()))
