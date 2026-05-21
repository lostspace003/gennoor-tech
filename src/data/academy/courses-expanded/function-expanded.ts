import type { Course } from '../types'

// Function-track expansion — six deeper, role-specific courses that build on the
// foundational function courses. Each pairs to a Gennoor PoC or follows directly
// from a foundational sibling.

export const functionExpanded: Course[] = [
  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — Legal & Compliance (foundational)
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-for-legal-compliance',
    title: 'AI for Legal & Compliance',
    subtitle:
      'A 55-minute working brief for in-house counsel — where AI helps legal teams, where the privilege and hallucination traps live, and how to govern outside-vendor AI.',

    track: 'function',
    level: 'foundational',
    audience: ['individual-contributor', 'manager', 'director'],
    functions: ['legal-compliance'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate'],

    duration: '55 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Contract review, regulatory monitoring, compliance copilots — with the privilege, hallucination, and vendor-governance traps named clearly.',
    whoThisIsFor:
      'General Counsels, compliance officers, and contract managers — plus paralegals and legal ops leaders building the playbook their teams will actually follow. Especially useful for in-house legal departments under pressure to "use AI" while protecting privilege, handling regulated data across GCC, India, and Africa, and answering audit-committee questions on AI risk.',
    whatYoullLearn: [
      'Where AI legitimately helps legal — and where it shouldn\'t go near privileged matters',
      'Contract review AI — beyond clause extraction, into negotiation support',
      'Regulatory monitoring across multi-jurisdiction operations',
      'How to design a compliance copilot lawyers will actually trust',
      'Hallucination risk in legal contexts — concrete mitigations',
      'Vendor governance — vetting outside-counsel and SaaS AI offerings',
    ],
    chapters: [
      {
        number: 1,
        title: 'The legal-AI fit map',
        duration: '7 min',
        objectives: [
          'Identify 6 high-fit AI use cases inside a legal department',
          'Recognize 3 areas where AI is the wrong tool for legal work',
        ],
      },
      {
        number: 2,
        title: 'Contract review AI',
        duration: '8 min',
        objectives: [
          'Apply AI to first-pass review, clause comparison, and playbook checks',
          'Design human-in-loop workflows that protect drafting quality',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Regulatory monitoring',
        duration: '7 min',
        objectives: [
          'Build an AI feed that tracks regulator updates across jurisdictions',
          'Avoid the "ChatGPT says the rule is" credibility trap',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Compliance copilots',
        duration: '7 min',
        objectives: [
          'Design a policy Q&A copilot grounded in your actual code of conduct',
          'Build escalation paths to a human compliance officer',
        ],
      },
      {
        number: 5,
        title: 'IP & confidentiality — using AI safely with privileged matters',
        duration: '7 min',
        objectives: [
          'Classify legal data into 3 confidentiality tiers',
          'Apply tenant, model, and prompt-level controls that preserve privilege',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Hallucination risk in legal contexts',
        duration: '6 min',
        objectives: [
          'Spot the 4 hallucination patterns that have shown up in court filings',
          'Build verification workflows your team will not skip under deadline',
        ],
      },
      {
        number: 7,
        title: 'Vendor governance for legal departments',
        duration: '7 min',
        objectives: [
          'Vet outside-counsel and SaaS AI offerings with a 6-point checklist',
          'Negotiate AI clauses into engagement letters and SaaS contracts',
        ],
        hasExercise: true,
      },
      {
        number: 8,
        title: 'Capstone: Your legal AI playbook',
        duration: '6 min',
        objectives: [
          'Draft a 1-page AI use policy for your legal team',
          'Pick one use case and scope a 4-week pilot the GC will sign off on',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 1-Page Legal AI Playbook',
    references: [
      {
        title: 'EU AI Act — Final Text',
        source: 'European Parliament',
        url: 'https://artificialintelligenceact.eu/',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'National Institute of Standards and Technology',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'India DPDP Act 2023',
        source: 'Ministry of Electronics and IT, Government of India',
        url: 'https://www.meity.gov.in/data-protection-framework',
      },
      {
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
    ],
    pairedPocs: ['poc-02-contract-legal-review'],
    relatedCourseSlugs: [
      'ai-governance-risk-boards',
      'ai-foundations-for-everyone',
      'ai-strategy-c-suite',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — HR (intermediate)
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'recruiting-ai-in-practice',
    title: 'Recruiting AI in Practice',
    subtitle:
      'A 55-minute intermediate course for recruiters and TA leaders — sourcing, screening, interviewing, offer — with EEOC and EU AI Act guardrails baked in.',

    track: 'function',
    level: 'intermediate',
    audience: ['individual-contributor', 'manager', 'director'],
    functions: ['hr'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate'],

    duration: '55 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-21',
    interactiveUrl: '/ai-academy/recruiting-ai-in-practice',

    hookSentence:
      'For TA teams past the foundations course — the full hiring funnel with AI, and the bias and compliance posture that keeps you out of trouble.',
    whoThisIsFor:
      'Recruiters, talent acquisition managers, HR operations leads, and people-tech owners who have completed the AI for HR foundations course and now need to actually ship AI across the hiring funnel. Especially useful for teams hiring at scale across GCC, India, and Africa where EEOC, EU AI Act, and regional employment rules all apply at once.',
    prerequisites: ['ai-for-hr-people-teams'],
    whatYoullLearn: [
      'Sourcing automation — beyond Boolean and into intent-driven outreach',
      'Resume screening — the 4 bias mitigations every TA team should adopt',
      'Interview prep with AI — for the interviewer, not just the candidate',
      'Candidate experience copilots that lift NPS without removing humans',
      'Offer and onboarding AI — where the funnel still leaks',
      'Workforce planning AI — and the compliance posture for high-risk hiring',
    ],
    chapters: [
      {
        number: 1,
        title: 'Sourcing automation',
        duration: '7 min',
        objectives: [
          'Move from keyword search to intent-driven sourcing with AI',
          'Avoid the "AI-spam" outreach pattern that destroys employer brand',
        ],
      },
      {
        number: 2,
        title: 'Resume screening — and the 4 bias mitigations',
        duration: '8 min',
        objectives: [
          'Apply the 4 bias mitigations: blind data, calibrated thresholds, audit logs, human override',
          'Spot disparate-impact patterns in your existing screening flow',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Interview prep with AI',
        duration: '7 min',
        objectives: [
          'Use AI to generate structured-interview scorecards aligned to the role',
          'Coach interviewers on consistent rubric application',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Candidate experience copilots',
        duration: '7 min',
        objectives: [
          'Design a candidate-facing copilot that answers 80% of FAQs',
          'Build escalation paths that protect candidate trust',
        ],
      },
      {
        number: 5,
        title: 'Offer & onboarding AI',
        duration: '6 min',
        objectives: [
          'Apply AI to offer letter drafting with compensation guardrails',
          'Personalize onboarding without falling into surveillance patterns',
        ],
        hasQuiz: true,
      },
      {
        number: 6,
        title: 'Workforce planning AI',
        duration: '7 min',
        objectives: [
          'Use AI for scenario planning across hiring, attrition, and skill gaps',
          'Avoid overfitting to historical patterns that no longer hold',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Compliance posture — EEOC, EU AI Act high-risk',
        duration: '7 min',
        objectives: [
          'Map your hiring AI stack against EU AI Act high-risk requirements',
          'Pre-empt the EEOC adverse-impact analysis your audit team will ask for',
        ],
        hasQuiz: true,
      },
      {
        number: 8,
        title: 'Making it stick: your funnel-wide AI rollout',
        duration: '6 min',
        objectives: [
          'Pick 3 funnel stages and sequence AI deployment across 2 quarters',
          'Lock in the bias-audit cadence your CHRO will sign off on',
        ],
      },
    ],
    exerciseCount: 2,
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
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'India DPDP Act 2023',
        source: 'Ministry of Electronics and IT, Government of India',
        url: 'https://www.meity.gov.in/data-protection-framework',
      },
    ],
    relatedCourseSlugs: [
      'ai-for-hr-people-teams',
      'ai-foundations-for-everyone',
      'ai-governance-risk-boards',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — Finance (intermediate)
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'ai-augmented-month-end-close',
    title: 'AI-Augmented Month-End Close',
    subtitle:
      'A 55-minute intermediate course for controllers and FP&A leads — where AI compresses the close, where it doesn\'t, and what auditors will accept.',

    track: 'function',
    level: 'intermediate',
    audience: ['individual-contributor', 'manager', 'director'],
    functions: ['finance'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate'],

    duration: '55 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Reconciliation, journal entries, variance narratives, audit trails — the close compressed without the audit headaches.',
    whoThisIsFor:
      'Controllers, FP&A leads, accountants, and shared-services finance teams who have completed the AI for Finance foundations course and now want to actually compress their close cycle. Especially useful for finance teams running multi-entity, multi-currency close across India, GCC, and Africa under IFRS or US GAAP.',
    prerequisites: ['ai-for-finance-accounting'],
    whatYoullLearn: [
      'Where AI ships real day-count compression in the close — and where it doesn\'t',
      'AI-assisted reconciliation across high-volume accounts',
      'Journal entry support with audit-friendly trails',
      'Variance narrative generation that survives FP&A review',
      'Audit-friendly documentation patterns auditors actually accept',
      'Handling the cost-spike close month — where AI helps most',
    ],
    chapters: [
      {
        number: 1,
        title: 'The close process today and AI fit',
        duration: '7 min',
        objectives: [
          'Map your close timeline and identify the 5 highest-leverage AI insertion points',
          'Spot the close tasks AI legitimately can\'t compress',
        ],
      },
      {
        number: 2,
        title: 'AI assists in reconciliation',
        duration: '8 min',
        objectives: [
          'Apply AI to bank, intercompany, and AR/AP reconciliation at scale',
          'Design exception workflows that route only true anomalies to humans',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Journal entry support and audit trails',
        duration: '7 min',
        objectives: [
          'Use AI to draft and classify journal entries with full provenance',
          'Build audit trails that satisfy IFRS and US GAAP documentation requirements',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Variance narrative generation',
        duration: '7 min',
        objectives: [
          'Generate first-draft variance narratives grounded in actuals and budget',
          'Avoid the "AI invented a reason" credibility loss with the CFO',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Audit-friendly documentation',
        duration: '7 min',
        objectives: [
          'Apply the IFAC and PCAOB guidance on AI use in audit-relevant work',
          'Build documentation patterns external auditors will accept',
        ],
      },
      {
        number: 6,
        title: 'Handling the cost-spike close month',
        duration: '6 min',
        objectives: [
          'Use AI to triage the close month with unusual cost movements',
          'Surface insights the controller can defend at the audit committee',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Continuous improvement of close AI',
        duration: '7 min',
        objectives: [
          'Measure cycle-time, exception-rate, and audit-finding KPIs month over month',
          'Avoid the "we shipped AI then never tuned it" plateau',
        ],
      },
      {
        number: 8,
        title: 'Capstone: Your close-cycle AI rollout',
        duration: '6 min',
        objectives: [
          'Pick 2 close steps to AI-augment in the next quarter',
          'Define the audit-evidence package for both before go-live',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your Quarterly Close-Cycle AI Rollout',
    references: [
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
      {
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
      {
        title: 'Microsoft Dynamics 365 Finance — Copilot for Finance',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/dynamics365/finance/',
      },
    ],
    pairedPocs: ['poc-08-finance-reconciliation'],
    relatedCourseSlugs: [
      'ai-for-finance-accounting',
      'ai-in-financial-services',
      'ai-foundations-for-everyone',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — Sales / RevOps (intermediate)
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'revops-automation-with-ai',
    title: 'RevOps Automation with AI',
    subtitle:
      'A 60-minute intermediate course for revenue and sales ops leaders — forecast accuracy, pipeline hygiene, territory design, compensation — with the tooling-stack decision included.',

    track: 'function',
    level: 'intermediate',
    audience: ['individual-contributor', 'manager', 'director'],
    functions: ['sales'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['train', 'innovate'],

    duration: '60 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-22',
    interactiveUrl: '/ai-academy/revops-automation-with-ai',

    hookSentence:
      'Where AI lifts forecast accuracy and pipeline hygiene without breaking the rep experience — and the tooling decisions that decide your next 24 months.',
    whoThisIsFor:
      'Revenue operations, sales operations, and GTM systems leaders who have completed the AI for Sales & Marketing foundations course. Especially useful for RevOps teams running Salesforce, HubSpot, or Microsoft Sales Copilot at scale across multiple regions and product lines.',
    prerequisites: ['ai-for-sales-marketing'],
    whatYoullLearn: [
      'Forecast accuracy with AI — where ML beats heuristic roll-up',
      'Pipeline hygiene automation — without rep revolt',
      'Territory and account optimization with AI signals',
      'Sales analytics narratives the CRO will actually read',
      'GTM data cleanup — the unglamorous AI win',
      'AI-augmented compensation modeling and tooling-stack decisions',
    ],
    chapters: [
      {
        number: 1,
        title: 'Forecast accuracy with AI',
        duration: '8 min',
        objectives: [
          'Apply ML forecasting on top of CRM data with calibrated confidence intervals',
          'Spot the 3 forecast-AI failure patterns that erode CRO trust',
        ],
        hasQuiz: true,
      },
      {
        number: 2,
        title: 'Pipeline hygiene automation',
        duration: '7 min',
        objectives: [
          'Automate stale-deal detection, stage validation, and field completeness',
          'Design hygiene nudges reps act on instead of dismiss',
        ],
        hasExercise: true,
      },
      {
        number: 3,
        title: 'Territory and account optimization',
        duration: '8 min',
        objectives: [
          'Use AI signals (firmographic, intent, engagement) to score territories',
          'Rebalance accounts without disrupting in-flight deals',
        ],
      },
      {
        number: 4,
        title: 'Sales analytics narratives',
        duration: '7 min',
        objectives: [
          'Generate weekly QBR-ready narratives grounded in CRM + activity data',
          'Avoid the "AI invented a deal trend" credibility loss',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'GTM data cleanup',
        duration: '7 min',
        objectives: [
          'Apply AI to dedup, enrich, and reclassify the messiest CRM data',
          'Build a continuous-cleanup loop instead of annual data projects',
        ],
      },
      {
        number: 6,
        title: 'AI-augmented compensation modeling',
        duration: '8 min',
        objectives: [
          'Model comp-plan changes with AI scenario tools before rollout',
          'Stress-test plans for unintended behavior incentives',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Tooling stack decisions',
        duration: '8 min',
        objectives: [
          'Decide Salesforce Einstein vs HubSpot Breeze vs Microsoft Sales Copilot vs build',
          'Avoid the multi-tool AI sprawl that kills RevOps team velocity',
        ],
      },
      {
        number: 8,
        title: 'Making it stick: your RevOps AI roadmap',
        duration: '7 min',
        objectives: [
          'Pick 3 use cases sequenced across 2 quarters',
          'Lock in the data quality bar before any of them ship',
        ],
      },
    ],
    exerciseCount: 2,
    references: [
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
        title: 'Gartner — Sales and Revenue Operations Research',
        source: 'Gartner',
        url: 'https://www.gartner.com/en/sales',
      },
      {
        title: 'Microsoft Sales Copilot Documentation',
        source: 'Microsoft Learn',
        url: 'https://learn.microsoft.com/en-us/microsoft-sales-copilot/',
      },
    ],
    relatedCourseSlugs: [
      'ai-for-sales-marketing',
      'ai-foundations-for-everyone',
      'ai-strategy-c-suite',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — Customer Service (intermediate)
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'building-trusted-support-bots',
    title: 'Building Trusted Support Bots',
    subtitle:
      'A 60-minute intermediate course for CX leaders and technical CX PMs — the four dimensions of bot trust, multilingual nuance, voice handling, and measurement.',

    track: 'function',
    level: 'intermediate',
    audience: ['manager', 'director', 'technical'],
    functions: ['customer-service'],
    industries: ['cross-industry'],
    stack: ['microsoft', 'stack-agnostic'],
    pairedPhase: ['innovate', 'build'],

    duration: '60 min',
    chapterCount: 9,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'Bots fail when customers don\'t trust them. The four dimensions of trust, the multilingual reality, and how to measure trust over time.',
    whoThisIsFor:
      'CX leaders, CX product managers, conversational AI architects, and senior support managers responsible for the actual bot footprint customers interact with. Especially useful for teams building support across English, Arabic, Hindi, Swahili, and other languages where translation alone is not enough.',
    prerequisites: ['ai-for-customer-service-support'],
    whatYoullLearn: [
      'The 4 dimensions of bot trust — competence, transparency, escalation, consistency',
      'Knowledge grounding architecture that prevents policy hallucination',
      'Tone calibration across customer segments',
      'Escalation logic that respects users (and doesn\'t loop them)',
      'Multilingual nuance for Arabic, Hindi, Swahili, and code-switching',
      'Voice handling, continuous improvement, and measuring trust over time',
    ],
    chapters: [
      {
        number: 1,
        title: 'The 4 dimensions of bot trust',
        duration: '7 min',
        objectives: [
          'Map your current bot against competence, transparency, escalation, consistency',
          'Identify the dimension your CSAT trend is currently hurt by',
        ],
      },
      {
        number: 2,
        title: 'Knowledge grounding architecture',
        duration: '8 min',
        objectives: [
          'Design a RAG architecture grounded in your real KB and policy library',
          'Build citation patterns customers can verify in-conversation',
        ],
        hasQuiz: true,
      },
      {
        number: 3,
        title: 'Tone calibration',
        duration: '6 min',
        objectives: [
          'Tune bot tone across consumer, SMB, and enterprise segments',
          'Avoid the corporate-robot vs over-friendly extremes',
        ],
        hasExercise: true,
      },
      {
        number: 4,
        title: 'Escalation logic that respects users',
        duration: '7 min',
        objectives: [
          'Design escalation that does not force customers to repeat themselves',
          'Build proactive escalation when bot confidence drops',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Multilingual nuance — Arabic, Hindi, Swahili',
        duration: '7 min',
        objectives: [
          'Handle right-to-left rendering, dialect variance, and Hinglish/Arabizi',
          'Spot the 3 multilingual failure modes that translation alone never fixes',
        ],
        hasExercise: true,
      },
      {
        number: 6,
        title: 'Voice handling',
        duration: '6 min',
        objectives: [
          'Architect voice bots that handle accent variance and latency budgets',
          'Design barge-in and silence handling that feels human',
        ],
      },
      {
        number: 7,
        title: 'Continuous improvement loops',
        duration: '7 min',
        objectives: [
          'Set up a weekly conversation-review cadence that ships improvements',
          'Use customer signals to retrain grounding and intents',
        ],
      },
      {
        number: 8,
        title: 'Measuring trust over time',
        duration: '6 min',
        objectives: [
          'Define a trust composite: CSAT, deflection, resolution, repeat-contact',
          'Build a dashboard your CX leadership can defend at the board',
        ],
        hasQuiz: true,
      },
      {
        number: 9,
        title: 'Capstone: Your trusted-bot rollout plan',
        duration: '6 min',
        objectives: [
          'Audit your current bot against the trust framework',
          'Pick the top 3 changes to ship in the next 90 days',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your 90-Day Trusted-Bot Rollout Plan',
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
        title: 'OWASP Top 10 for LLM Applications',
        source: 'OWASP Foundation',
        url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
    ],
    pairedPocs: ['poc-07-multilingual-customer-support-agent'],
    relatedCourseSlugs: [
      'ai-for-customer-service-support',
      'building-ai-agents-copilot-studio',
      'ai-foundations-for-everyone',
    ],
  },

  // ────────────────────────────────────────────────────────────────────
  // FUNCTION TRACK — Operations (intermediate)
  // ────────────────────────────────────────────────────────────────────
  {
    slug: 'demand-forecasting-in-practice',
    title: 'Demand Forecasting in Practice',
    subtitle:
      'A 65-minute intermediate course for ops practitioners actually building forecasting — model choice, evaluation methodology, S&OP integration, and the production failure modes.',

    track: 'function',
    level: 'intermediate',
    audience: ['individual-contributor', 'manager', 'director', 'technical'],
    functions: ['operations'],
    industries: ['retail-ecommerce', 'manufacturing', 'cross-industry'],
    stack: ['microsoft', 'open-source', 'stack-agnostic'],
    pairedPhase: ['innovate', 'build'],

    duration: '65 min',
    chapterCount: 8,
    format: ['video', 'reading', 'interactive'],

    status: 'available',
    lastUpdated: '2026-05-19',

    hookSentence:
      'For the ops analysts actually building forecasts — the model choice, the evaluation rigor, the S&OP integration, and what fails first in production.',
    whoThisIsFor:
      'Operations practitioners, demand planners, supply chain analysts, and technical product owners actually responsible for building and running forecasting in production. Especially useful for teams operating across retail, e-commerce, and manufacturing in India, GCC, Africa, and SEA where promotion-driven and Ramadan/festive-cycle volatility breaks naive models.',
    prerequisites: ['ai-for-operations-supply-chain'],
    whatYoullLearn: [
      'Forecasting theory in 10 minutes — what matters in practice',
      'Data prep reality — the part that consumes 60% of project time',
      'Choosing the model — ARIMA, Prophet, ML ensembles, LLM-based',
      'Evaluation methodology — MAPE, sMAPE, WAPE, and which to trust when',
      'Integration into the S&OP cadence and continuous retraining',
      'Common production failures — and how to spot them before customers do',
    ],
    chapters: [
      {
        number: 1,
        title: 'Forecasting theory in 10 minutes',
        duration: '10 min',
        objectives: [
          'Distinguish trend, seasonality, level, and exogenous drivers in your series',
          'Recognize when a forecasting problem is actually a different problem',
        ],
      },
      {
        number: 2,
        title: 'Data prep reality',
        duration: '8 min',
        objectives: [
          'Handle stock-outs, promotions, and price-change effects in history',
          'Build feature stores that don\'t leak target signal',
        ],
        hasExercise: true,
      },
      {
        number: 3,
        title: 'Choosing the model — ARIMA, Prophet, ML ensembles, LLM-based',
        duration: '9 min',
        objectives: [
          'Pick the right model class for your data volume, horizon, and SKU count',
          'Spot the 3 cases where LLM-based forecasting is genuinely the right tool',
        ],
        hasQuiz: true,
      },
      {
        number: 4,
        title: 'Evaluation methodology — MAPE, sMAPE, WAPE',
        duration: '8 min',
        objectives: [
          'Choose the right error metric for intermittent demand and high-volume SKUs',
          'Design backtests that match the actual forecast cadence',
        ],
        hasQuiz: true,
      },
      {
        number: 5,
        title: 'Integration into S&OP cadence',
        duration: '8 min',
        objectives: [
          'Land the forecast in your monthly S&OP rhythm without breaking it',
          'Translate forecast confidence into inventory and capacity decisions',
        ],
      },
      {
        number: 6,
        title: 'Continuous retraining',
        duration: '7 min',
        objectives: [
          'Decide retrain cadence per SKU class with drift detection',
          'Avoid the "we trained once and forgot" silent-decay pattern',
        ],
        hasExercise: true,
      },
      {
        number: 7,
        title: 'Common production failures',
        duration: '8 min',
        objectives: [
          'Recognize the 5 production failures: leakage, drift, promo blindness, regime change, schema breaks',
          'Build monitoring that surfaces them before the demand planner does',
        ],
        hasQuiz: true,
      },
      {
        number: 8,
        title: 'Capstone: Your forecasting build plan',
        duration: '7 min',
        objectives: [
          'Pick a real SKU subset and design the end-to-end forecasting pipeline',
          'Define accuracy targets, retrain cadence, and S&OP handoff before code',
        ],
        isCapstone: true,
      },
    ],
    exerciseCount: 2,
    capstoneTitle: 'Your End-to-End Forecasting Build Plan',
    references: [
      {
        title: 'MIT Center for Transportation & Logistics — AI in SCM',
        source: 'MIT CTL',
        url: 'https://ctl.mit.edu/',
      },
      {
        title: 'McKinsey — Operations and Supply Chain Insights',
        source: 'McKinsey & Company',
        url: 'https://www.mckinsey.com/capabilities/operations/our-insights',
      },
      {
        title: 'Gartner — Supply Chain Top Trends',
        source: 'Gartner Research',
        url: 'https://www.gartner.com/en/supply-chain',
      },
      {
        title: 'NIST AI Risk Management Framework',
        source: 'NIST',
        url: 'https://www.nist.gov/itl/ai-risk-management-framework',
      },
    ],
    pairedPocs: ['poc-15-demand-forecasting'],
    relatedCourseSlugs: [
      'ai-for-operations-supply-chain',
      'ai-in-manufacturing',
      'ai-foundations-for-everyone',
    ],
  },
]
