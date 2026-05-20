/**
 * Course catalog content — branded PDF generation source.
 *
 * Each entry produces a single ~6–10 page branded PDF that follows the spec
 * in docs/transformation/05-courses-plan.md: cover, inside-front-cover,
 * outcomes, table of contents, module detail with enablement sidebar, back
 * cover with next-steps.
 *
 * For interactive courses already shipped under /ai-academy/, the module
 * structure mirrors the actual chapters. For courses still in planning, the
 * structure follows the brief in 05-courses-plan.md.
 */

export type Track =
  | 'foundations'
  | 'function'
  | 'leadership'
  | 'industry'
  | 'builder'

export interface CourseModule {
  number: string // e.g., "01"
  title: string
  topics: string[]
}

export interface EnablementPhase {
  phase: 'Diagnose' | 'Train' | 'Innovate' | 'Build' | 'Sustain'
  action: string
}

export interface CoursePdf {
  slug: string
  title: string
  subtitle: string
  track: Track
  trackLabel: string
  audience: string
  duration: string
  pages: number // approximate
  requirements?: string
  outcomes: string[]
  modules: CourseModule[]
  enablementNote: string // single sentence (legacy, used in older marketing PDFs)
  pilotPriceBand?: string
  pilotTimeline?: string
  // Domain-centric "How we support AI Enablement" — rendered on the viewer page
  aiEnablementSummary?: string // 2-3 sentences specific to this domain
  aiEnablementPhases?: EnablementPhase[] // 5-phase journey, one line per phase
}

const STANDARD_ENABLEMENT_PRICE = '$12k–30k SMB · $40k–120k Enterprise'
const STANDARD_ENABLEMENT_TIMELINE = '4 weeks, fixed scope'

// =====================================================================
// TRACK 1 — FOUNDATIONS
// =====================================================================

export const aiFoundationsForEveryone: CoursePdf = {
  slug: 'ai-foundations-for-everyone',
  title: 'AI Foundations for Everyone',
  subtitle: 'Build org-wide AI literacy so Copilot, ChatGPT and Gemini actually get used.',
  track: 'foundations',
  trackLabel: 'Foundations',
  audience:
    'All employees across functions and seniority — front-line staff, back-office, new joiners, plus HR/L&D and internal comms teams responsible for org-wide AI rollout. No technical background assumed. Designed for cohorts of 20-40 attendees from one organisation, mixing executive assistants, finance clerks, sales reps, branch staff, engineers and managers in the same room.',
  duration: '2 days (16 hours)',
  pages: 48,
  requirements:
    'Attendees should bring a work laptop with their company-issued Microsoft 365, Google Workspace, ChatGPT Enterprise or equivalent account already provisioned and signed in. Comfort with basic Office/Workspace apps (Word, Excel, Outlook, Teams or Docs, Sheets, Gmail, Meet) is expected. No coding, statistics or prior AI exposure required. Attendees should arrive with two real work tasks they currently dislike doing — these become practice material in labs.',
  outcomes: [
    'Define LLM, prompt, context window, hallucination, grounding and agent in plain language, and explain to a colleague which tool fits which task',
    'Write a structured prompt using a role-task-context-format template and refine it through at least three iterations to reach usable output',
    'Complete five real work tasks (meeting summary, draft email, policy lookup, data explanation, status update) using the organisation\'s licensed AI tool, judged against a rubric',
    'Identify three categories of work the attendee should NOT send to public AI (regulated customer data, unreleased financials, identifiable HR records) and apply the company\'s acceptable-use policy',
    'Produce a personal 30-day AI habit plan listing five repeatable workflows the attendee will move to AI, with weekly time-saved targets',
    'Pass a 20-question literacy check covering EU AI Act Article 4 awareness, prompt hygiene, data classification and tool selection at 80% or above',
  ],
  modules: [
    {
      number: '01',
      title: 'What AI actually is in 2026 (and what it isn\'t)',
      topics: [
        'LLMs in 60 seconds — tokens, prediction, training cut-offs and why GPT-5, Gemini 2.5, Claude Sonnet 4.5 sometimes don\'t know',
        'The 2026 enterprise stack: Microsoft 365 Copilot, ChatGPT Business/Enterprise, Gemini for Workspace, Claude for Enterprise — what each is licensed for',
        'Hallucinations, confident wrong answers, and why "looks right" is the dangerous failure mode',
        'Generative vs predictive vs agentic AI in everyday language',
        'Live demo: same prompt, three tools, three answers — group discussion',
      ],
    },
    {
      number: '02',
      title: 'Your AI tools at work — a guided tour',
      topics: [
        'Logging in: Copilot in Word/Excel/Outlook/Teams, Gemini side panel in Gmail/Docs/Sheets, ChatGPT Business workspace, Claude Projects',
        'Where the data goes: tenant boundaries, why "your prompts don\'t train the model" holds in enterprise SKUs',
        'Connectors and grounding: SharePoint, OneDrive, Drive, Confluence — how the assistant sees your files',
        'When to use mobile vs desktop vs embedded vs browser',
        'The three places people get confused: free vs paid, personal vs work account, web search on vs off',
      ],
    },
    {
      number: '03',
      title: 'Prompting as a workplace skill',
      topics: [
        'The R-T-C-F frame: Role, Task, Context, Format',
        'Showing not telling: giving examples, attaching the source document, pasting the template',
        'Iteration discipline: how to refine a bad answer instead of restarting',
        'Long prompts vs short prompts: when each works',
        '12 prompt patterns every employee should own (summarise, translate, compare, explain like, draft, critique, extract, rewrite tone, fill table, classify, brainstorm, plan)',
      ],
    },
    {
      number: '04',
      title: 'Lab — five real tasks, end to end',
      topics: [
        'Lab 1: turn a 40-minute Teams/Meet recording into an action-item summary',
        'Lab 2: draft a customer reply from a complaint email plus a policy PDF',
        'Lab 3: explain a confusing Excel/Sheets report to a non-finance colleague',
        'Lab 4: pull three insights from a 30-page PDF report you\'ve never read',
        'Lab 5: rewrite a meandering Slack/Teams message into a 3-bullet update',
        'Peer review using a 5-point output rubric',
      ],
    },
    {
      number: '05',
      title: 'What NOT to put into AI — data, privacy, policy',
      topics: [
        'Three buckets: public, internal, restricted — worked examples for your industry',
        'EU AI Act Article 4 (in force Feb 2025) and what "sufficient AI literacy" means for your job',
        'Regional rules: Saudi PDPL, UAE PDPL, India DPDP, Kenya DPA — what changes for cross-border prompts',
        'Shadow AI: why pasting client data into the free ChatGPT app is the #1 incident pattern',
        'Red flags: deepfake voice calls, prompt injection in email, fake invoices generated by AI',
      ],
    },
    {
      number: '06',
      title: 'Bias, errors and human judgment',
      topics: [
        'Where models go wrong: dates, numbers, citations, names, recent events',
        'Bias in hiring screens, credit scoring, customer triage — and the human-in-the-loop fix',
        'The "trust but verify" habit: three verification moves (check the source, recompute, ask a colleague)',
        'Confidence calibration: spotting "this sounds great but is fabricated"',
        'Group exercise: find the error in six AI-generated work artefacts',
      ],
    },
    {
      number: '07',
      title: 'Building the daily habit',
      topics: [
        'The 3-2-1 rule: 3 tasks you always start in AI, 2 you sometimes do, 1 you never do',
        'Saved prompts, custom GPTs, Gems, Projects: how to stop retyping',
        'Sharing prompts with your team without leaking IP',
        'When AI slows you down — recognising when not to use it',
        'Personal 30-day plan worksheet',
      ],
    },
    {
      number: '08',
      title: 'Capstone and certification',
      topics: [
        'Capstone: each attendee delivers one fully AI-assisted work artefact (report, brief, plan) created live, with prompt trail attached',
        '20-question literacy assessment',
        'Group debrief: what we\'ll do differently Monday morning',
        'Sign-off on the company acceptable-use acknowledgement',
        'Issuance of Gennoor Tech AI Foundations badge',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Copilot Kickstart pilot — we train a small team on your data and ship a working prompt library across one department in four weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
  aiEnablementSummary:
    'Gennoor Tech runs AI literacy rollouts as organisational change programs, not training events — we handle Copilot, ChatGPT and Gemini cohort delivery in Arabic, English and Hindi across GCC, East Africa and South Asia, with on-the-ground delivery in Riyadh, Dubai, Lagos, Nairobi, Karachi and Bangalore. We help L&D teams escape the documented 36% Copilot activation trap by pairing licensed seats with structured cohort training, internal champions and a usage-tracking dashboard. We benchmark to EU AI Act Article 4 and the GCC equivalents so legal sign-off is part of the rollout, not an afterthought.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'License-utilisation audit across your Copilot, ChatGPT and Gemini estate, gap-mapped against EU AI Act Article 4 obligations and your local data-protection law.' },
    { phase: 'Train', action: 'Multi-cohort, multi-lingual literacy waves stratified by function — front-line, knowledge worker, manager, executive — delivered in person or hybrid.' },
    { phase: 'Innovate', action: 'Internal prompt library plus a department-by-department use-case backlog scored on effort, value and data sensitivity.' },
    { phase: 'Build', action: 'Custom GPTs, Copilot agents, Gemini Gems and Claude Projects deployed against the top 10 backlog items, with usage telemetry wired in.' },
    { phase: 'Sustain', action: 'Quarterly literacy refresh, champions network, EU AI Act Article 4 evidence file and a dashboard tying license cost to hours saved.' },
  ],
}

export const genAiForBusiness: CoursePdf = {
  slug: 'generative-ai-for-business',
  title: 'Generative AI for Business',
  subtitle: 'Equip managers to scope, sponsor and ship GenAI use cases that actually pay back.',
  track: 'foundations',
  trackLabel: 'Foundations',
  audience:
    'Mid-level and senior managers, team leads, business analysts, transformation leads, product owners and function heads in finance, operations, marketing, HR, supply chain and customer service. Typically directors, AVPs, senior managers and high-potential managers identified for AI sponsorship roles. Cohorts of 15-25, ideally mixing functions from the same enterprise.',
  duration: '2 days (16 hours)',
  pages: 44,
  requirements:
    'Attendees bring 3+ years of management or business-analyst experience, accountability for a team or budget line, and one real candidate AI use case from their own function. Comfort reading vendor proposals, process maps and a simple ROI model is expected. Hands-on AI usage helpful but not mandatory.',
  outcomes: [
    'Write a one-page GenAI use-case brief covering business problem, baseline metric, target uplift, data sources, risk class and decision rights',
    'Score five candidate use cases on a 2×2 of value vs feasibility and defend the prioritisation to a steering committee',
    'Run a structured vendor evaluation against a 25-criterion scorecard covering data residency, model choice, fine-tuning, audit logs, exit clauses and pricing model',
    'Build a 90-day pilot plan with success metrics, kill criteria, change-management plan and a P&L view of cost vs benefit',
    'Draft an internal AI policy memo aligned to EU AI Act risk tiers and your local regulator (SDAIA, UAE AI Office, India MeitY)',
    'Lead a 30-minute structured workshop with their own team to surface five new AI use cases using the methods practised in class',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 GenAI landscape for a business owner',
      topics: [
        'Foundation models vs apps vs agents vs copilots — what the buyer needs to know',
        'Microsoft, OpenAI, Google, Anthropic, Meta, Mistral, Cohere, G42, Inception (Falcon), Sarvam — who fits where',
        'Reading the market: McKinsey/BCG/Gartner 2026 numbers — what\'s real vs press release',
        'The 35.8% Copilot activation reality and why most enterprise pilots stall',
        'Costs in 2026: per-seat $25-40, per-token, per-agent — translating to your P&L',
      ],
    },
    {
      number: '02',
      title: 'Sourcing use cases that pay back',
      topics: [
        'Where value actually lands: deflection, summarisation, drafting, classification, retrieval, decisioning, agentic workflows',
        'The "5 jobs in your function" exercise — turning roles into prompts',
        'Anti-patterns: replatforming chatbots, "let\'s do a hackathon", AI for AI\'s sake',
        'Use-case canvas: problem, data, baseline, target, risk, owner',
        'Workshop: each attendee produces 5 candidate use cases from their function',
      ],
    },
    {
      number: '03',
      title: 'Prompting and tool literacy for managers',
      topics: [
        'Enough hands-on to be dangerous: ChatGPT Business, Copilot, Gemini, Claude, NotebookLM, Perplexity Enterprise',
        'Custom GPTs, Copilot agents, Gemini Gems, Claude Projects — what a manager can build without IT',
        'Grounding on your own documents: SharePoint, Drive, Confluence, S3',
        'Prompt patterns for managers: synthesise, critique, plan, decide, communicate',
        'Lab — build one functioning custom assistant on your domain documents',
      ],
    },
    {
      number: '04',
      title: 'Vendor evaluation and buy-vs-build',
      topics: [
        'The 25-criterion scorecard: model choice, data residency, fine-tuning, RAG, agents, SSO, audit, SLA, exit',
        'Buy vs build vs configure: when to use Copilot Studio, vertical SaaS, or call a partner',
        'Regional vendor scan: G42, Mozn, Lucidya, Tasheel, Tarjama, Sarvam, Yellow.ai — when local beats global',
        'Red flags in proposals: vague accuracy claims, no eval methodology, no exit plan, opaque pricing',
        'Negotiation levers: per-seat caps, pilot pricing, success fees, IP ownership',
      ],
    },
    {
      number: '05',
      title: 'Lab — pilot design from idea to charter',
      topics: [
        'Pick one use case per attendee',
        'Define baseline metric (today\'s number) and target (90-day number)',
        'Map data sources, owners, refresh cadence and access rights',
        'Write kill criteria — the conditions under which you stop',
        'Draft a 1-page pilot charter and pitch it to the room (peer critique)',
      ],
    },
    {
      number: '06',
      title: 'Risk, regulation and responsible deployment',
      topics: [
        'EU AI Act risk tiers (unacceptable / high / limited / minimal) and how to classify your use case',
        'Article 4 (AI literacy) and Articles 9-15 (high-risk obligations) — manager\'s view',
        'Regional layers: SDAIA AI Ethics Principles (KSA), UAE AI Charter, India MeitY advisories, Nigeria NDPC',
        'Bias, fairness and dignity-of-decision: where humans must stay in the loop',
        'Working with legal, security, privacy and audit — getting to "yes" faster',
      ],
    },
    {
      number: '07',
      title: 'Adoption, change and measurement',
      topics: [
        'Five things that kill a pilot: no owner, no metric, no champion, no integration, no comms',
        'Building a function-level adoption plan: champions, office hours, prompt library, internal showcase',
        'Measuring what matters: usage, quality, time saved, decision quality, satisfaction, ROI',
        'Telling the story: a 1-slide pilot report your CEO actually reads',
        'When to scale, when to retire, when to rebuild',
      ],
    },
    {
      number: '08',
      title: 'Capstone — defend your pilot to a mock steering committee',
      topics: [
        'Each attendee presents: problem, use case, pilot design, vendor choice, risk class, P&L view, 90-day plan',
        'Faculty + peer panel scores against published rubric',
        'Group synthesis: top 5 cross-functional opportunities for the cohort\'s enterprise',
        'Personal 90-day commitment: what gets sponsored, by when, with whom',
        'Gennoor Tech GenAI for Business certification',
      ],
    },
  ],
  enablementNote:
    'Pairs with our GenAI Discovery sprint — a senior consultant works with your leadership team to land a prioritised roadmap with three pilot specs in two weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
  aiEnablementSummary:
    'Gennoor Tech operates as the GenAI program-management partner for mid-size and large enterprises across the GCC, Africa and South Asia — we sit between your steering committee, your vendors and your operating teams, running the cadence that turns pilots into deployed agents. Our domain is the business case itself: scoring use cases, negotiating vendor terms in your jurisdiction, and building the manager community that keeps adoption above 60%. We bring playbooks from real 2025-2026 rollouts in banking, retail, telco, manufacturing, healthcare and public sector in your region.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Function-by-function use-case discovery, ROI baselining, vendor-spend and license-utilisation audit, and a regulator gap map (EU AI Act, SDAIA, UAE AIO, MeitY, NDPC).' },
    { phase: 'Train', action: 'Manager cohorts (this course), executive briefings, and steering-committee enablement so sponsors can ask better questions.' },
    { phase: 'Innovate', action: 'A scored backlog of 30-50 use cases, top 10 chartered with kill criteria, vendor shortlists and pilot budgets.' },
    { phase: 'Build', action: 'Pilot execution support — prompt design, RAG plumbing, integrations, eval harnesses — to a 90-day go/no-go.' },
    { phase: 'Sustain', action: 'Adoption telemetry, quarterly use-case refresh, vendor renewal advisory and a manager community of practice tied to KPI dashboards.' },
  ],
}

export const aiLiteracyNonTech: CoursePdf = {
  slug: 'ai-literacy-non-technical',
  title: 'AI Literacy for Non-Technical Teams',
  subtitle: 'Function-specific GenAI fluency for HR, marketing, sales, ops and service ICs.',
  track: 'foundations',
  trackLabel: 'Foundations',
  audience:
    'Individual contributors and team leads in HR, Talent and L&D; Marketing, content and brand; Sales, inside sales and key accounts; Operations, supply chain and procurement; Customer service, contact centre and field service. Cohort size 15-30 grouped by function (one HR cohort, one Marketing cohort, etc.) so labs and prompt libraries are role-specific.',
  duration: '2 days (16 hours)',
  pages: 40,
  requirements:
    'Two or more years in their function, day-to-day ownership of recurring deliverables (job descriptions, campaign briefs, account plans, supplier RFQs, ticket responses), and a corporate AI license (Copilot, ChatGPT Business, Gemini, Claude). Attendees bring three real work artefacts from the last month — a job ad, campaign brief, account plan, supplier email, ticket — to use as practice material. No coding, statistics or prior prompting experience required.',
  outcomes: [
    'Build a 20-prompt personal library tuned to the attendee\'s specific role with example outputs and quality notes',
    'Cut time-to-first-draft on three recurring deliverables in their function by at least 50% measured against a baseline timed in module 1',
    'Use AI for one core decision-support task (candidate shortlisting, campaign read, account prioritisation, supplier risk, ticket triage) with documented human-in-the-loop checks',
    'Apply a function-specific bias/risk checklist (hiring fairness for HR, brand-voice integrity for marketing, claims accuracy for service) to every AI output before it leaves their hands',
    'Coach one teammate through a 30-minute prompting walkthrough using the trainer-of-trainer kit issued at the end of the course',
    'Pass a function-specific scenario assessment with 80%+, including identifying the right tool, the right data class and the right verification step for 10 realistic situations',
  ],
  modules: [
    {
      number: '01',
      title: 'Where AI lands in your function (function-specific opener)',
      topics: [
        'The 10 most common tasks in your role and which ones AI helps with today',
        'Baseline timing exercise: stopwatch three of your weekly deliverables — we\'ll re-measure on day 2',
        'Tool map for your function: which of Copilot, ChatGPT, Gemini, Claude, NotebookLM, Perplexity fits which task',
        'Function-specific demos: HR (JD + screening), Marketing (brief + variants), Sales (account + outreach), Ops (supplier scan), Service (ticket triage)',
        'Honest limits: where AI still costs you time',
      ],
    },
    {
      number: '02',
      title: 'Prompting as a workplace skill, your function\'s edition',
      topics: [
        'R-T-C-F template adapted with function-specific examples',
        'Showing the model your style: voice samples, past artefacts, brand guidelines, JD bank, account playbook',
        'Iteration discipline: 3-turn refinement vs starting over',
        'Saved prompts, custom GPTs, Gems, Projects — building your personal AI toolkit',
        '12 prompt patterns tuned to your function (HR: rewrite-for-inclusion; Marketing: localise-for-market; Sales: research-the-account; Ops: compare-suppliers; Service: explain-to-customer)',
      ],
    },
    {
      number: '03',
      title: 'Function deep-dive A — core deliverables',
      topics: [
        'HR: job ads, interview guides, competency frameworks, onboarding plans, policy explanations',
        'Marketing: briefs, headlines, social variants, SEO outlines, customer-voice rewriting',
        'Sales: account research, discovery questions, follow-up emails, mutual action plans, objection handling',
        'Ops: SOP drafts, supplier outreach, RFQ comparisons, risk memos, dashboard narration',
        'Service: ticket triage, KB drafts, complaint responses, escalation summaries, root-cause notes',
      ],
    },
    {
      number: '04',
      title: 'Lab — real artefacts, real timings',
      topics: [
        'Pick three artefacts you brought to class',
        'Recreate each end-to-end with AI in a structured 45-minute slot',
        'Quality check using the function rubric',
        'Time saved vs baseline measured in module 1 and logged',
        'Peer review and prompt swap',
      ],
    },
    {
      number: '05',
      title: 'Function deep-dive B — analysis and decisions',
      topics: [
        'HR: people-data Q&A with NotebookLM/Copilot, exit-interview themes, headcount narrative, learning needs analysis',
        'Marketing: campaign performance read, audience research synthesis, competitor scan, content-gap analysis',
        'Sales: pipeline health, win/loss synthesis, account whitespace, forecast narrative',
        'Ops: supplier risk scan, cycle-time analysis, exception-report explanation, capacity scenarios',
        'Service: ticket-cluster analysis, CSAT/NPS theming, agent-coaching insights, deflection opportunities',
      ],
    },
    {
      number: '06',
      title: 'Bias, accuracy and what NOT to ship',
      topics: [
        'Function-specific failure modes: HR (discriminatory phrasing, fabricated candidate detail); Marketing (hallucinated stats, brand-voice drift); Sales (made-up contacts, fake quotes); Ops (wrong unit conversions); Service (incorrect policy, false promises)',
        'Data class rules for your function: PII, customer data, financials, supplier confidentiality, employee records',
        'EU AI Act Article 4 and your local regulator in one slide for your function',
        'The "two verification moves" your function must always do',
        '6-artefact spot-the-error drill (function-specific)',
      ],
    },
    {
      number: '07',
      title: 'Working with your team and your manager',
      topics: [
        'Sharing prompts without leaking IP: team prompt library, shared custom GPTs/Gems',
        'Disclosing AI assistance: when to flag, when it\'s irrelevant',
        'Trainer-of-trainer micro-skill: walk a teammate through a prompt in 5 minutes',
        'Pitching one new AI workflow to your manager (1-pager template)',
        'Building your "10 prompts to try Monday" personal list',
      ],
    },
    {
      number: '08',
      title: 'Capstone and certification',
      topics: [
        'Function-specific scenario assessment (10 cases, 80% pass)',
        'Final timed deliverable: produce a complete role-specific artefact (JD bundle / campaign brief / account plan / supplier RFQ / complaint resolution) live in class with prompt trail',
        'Coach a partner for 30 minutes using your prompt library and TOT kit',
        'Submit your 20-prompt personal library',
        'Issuance of Gennoor Tech AI Literacy badge with function specialisation',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Team Workshop Day — half-day on-site session where we work alongside your team on their actual files for the rest of the week.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '1-day workshop + 2 weeks coaching',
  aiEnablementSummary:
    'Gennoor Tech designs function-specific AI literacy programs — separate tracks for HR, Marketing, Sales, Operations and Service — because we have seen one-size-fits-all rollouts stall at the documented 35.8% activation rate. Our regional advantage is concrete: Arabic, English and Hindi delivery; prompt libraries tuned to GCC and South Asian business norms (Hijri dates, Arabic name handling, GCC labor law phrasing, India GST formats, KSA Zakat references); and trainer-of-trainer kits that build internal champions in each function. We measure success in time-saved per deliverable per role, not seats activated.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Function-level workflow audit, baseline timing of recurring deliverables, license-utilisation snapshot, and a heatmap of high-value AI tasks per role.' },
    { phase: 'Train', action: 'Function-segmented cohorts (this course) with prompt libraries, custom GPTs/Gems and trainer-of-trainer kits in the languages your team works in.' },
    { phase: 'Innovate', action: 'Per-function prompt and assistant backlog co-built with your top performers, sourced from real artefacts and real bottlenecks.' },
    { phase: 'Build', action: 'Deployed custom GPTs, Copilot agents, Gemini Gems and Claude Projects per function, plus a shared internal prompt library with usage telemetry.' },
    { phase: 'Sustain', action: 'Quarterly prompt-library refresh, champions-of-practice forums per function, productivity dashboards tied to deliverable-level baselines and a yearly literacy recert.' },
  ],
}

// =====================================================================
// TRACK 2 — BY FUNCTION
// =====================================================================

export const aiForHr: CoursePdf = {
  slug: 'ai-for-hr-people-teams',
  title: 'AI for HR & People Teams',
  subtitle: 'Deploy AI across hiring, talent and people ops without tripping EU AI Act Annex III.',
  track: 'function',
  trackLabel: 'By Function',
  audience:
    'HR directors, CHROs, L&D managers, talent acquisition leads, HR business partners, people analytics managers, HRIS owners and reward leaders in organisations of 500+ employees. Mid-to-senior practitioners who own a hiring pipeline, a learning roadmap or a workforce planning model — not HR generalists looking for an AI overview.',
  duration: '2 days (16 hours)',
  pages: 56,
  requirements:
    'Attendees should be running at least one HRIS or ATS in production (Workday, SuccessFactors, HiBob, BambooHR, SAP, Oracle HCM or equivalent), have visibility into current hiring funnel metrics and attrition data, and understand their organisation\'s data-residency obligations. Bring a live job requisition, a real attrition dashboard and one workflow you suspect AI could compress — these become working artefacts across the two days. No coding required; familiarity with prompts and basic spreadsheet logic is enough.',
  outcomes: [
    'Produce a documented AI use-case shortlist for HR with a scored risk classification against EU AI Act Annex III, NIST AI RMF GOVERN/MAP/MEASURE/MANAGE functions and your local labour regulator\'s stance',
    'Draft a vendor evaluation rubric covering Workday Illuminate, Eightfold, Phenom, Beamery, HiBob Galileo, Microsoft Viva and at least one regional vendor, scored against bias-audit evidence and data-residency posture',
    'Rebuild one end-to-end recruitment funnel (sourcing → screening → interview → offer) with AI-assisted steps, human-in-the-loop checkpoints and candidate disclosure language that meets Article 26 deployer duties',
    'Configure a working internal-mobility/skills-inference experiment in Eightfold, Gloat or Workday Skills Cloud using your own job architecture as input',
    'Write a bias-monitoring plan covering four-fifths rule testing, intersectional slicing, drift triggers and the documentation pack a works council or labour inspectorate would expect',
    'Publish an AI-in-HR governance charter (RACI, escalation, audit trail retention, candidate appeal mechanism) signed off by legal, IT and HR leadership',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 HR AI stack — what actually shipped',
      topics: [
        'Workday Illuminate agents (Sep 2025) for recruiting, onboarding, performance, succession',
        'Eightfold AI-Interviewer and Candidate Concierge — high-volume hiring in 2026',
        'Phenom (post-acquisition), Beamery, Gloat, Reejig — talent-intelligence backbone comparison',
        'HiBob Galileo + Josh Bersin Co. integrations; ServiceNow Now Assist for HR',
        'Microsoft Viva, Copilot for HR scenarios, SAP Joule for SuccessFactors',
        'The "agentic HR" pattern: where agents replace SDR-style HR tasks vs assist',
      ],
    },
    {
      number: '02',
      title: 'Regulatory reality — EU AI Act, local labour law, works councils',
      topics: [
        'Annex III high-risk categories: recruitment, selection, promotion, termination, task allocation',
        'August 2, 2026 enforcement vs Digital Omnibus delay proposal (Nov 2025) — plan for the earlier date',
        'Article 26 deployer obligations: FRIA, logging, human oversight, candidate transparency',
        'Prohibited practices already in force (Feb 2025): emotion recognition and biometric categorisation at work',
        'GDPR Art. 22 automated-decision rules and how they layer on top of the AI Act',
        'GCC, KSA PDPL, UAE, India DPDP, Kenya DPA — regional data-residency implications for HR vendors',
      ],
    },
    {
      number: '03',
      title: 'Sourcing, screening, and the bias problem that won\'t go away',
      topics: [
        'How modern resume parsers actually rank — embedding similarity vs explicit skills extraction',
        'Disparate impact testing: four-fifths rule, statistical parity, equal opportunity difference',
        'Adverse impact case law lessons: Workday class action, iTutorGroup, HireVue retirement of facial analysis',
        'NIST AI RMF MEASURE function applied to a real hiring model',
        'Vendor bias-audit documentation: what to demand before signing',
        'Setting bias drift triggers and the "stop the model" decision rights',
      ],
    },
    {
      number: '04',
      title: 'Lab — rebuilding a hiring funnel end-to-end',
      topics: [
        'Take your live requisition through an AI-assisted funnel',
        'Job-ad generation: gender-coded language detection, accessibility, inclusive phrasing',
        'Sourcing agent configuration (Eightfold/Beamery/LinkedIn Recruiter AI) with guardrails',
        'Structured interview design with AI-generated probes the panel can override',
        'Candidate disclosure copy: drafting Article 26-compliant notices in plain language',
        'Output: a documented funnel with HITL checkpoints and an audit log spec',
      ],
    },
    {
      number: '05',
      title: 'Internal mobility, skills inference and the talent marketplace',
      topics: [
        'Skills ontologies: Workday Skills Cloud, Lightcast Open Skills, ESCO — picking a backbone',
        'Skill inference from work product (emails, projects, code commits) — where it crosses into surveillance',
        'Internal marketplaces in practice: Gloat, Fuel50, Eightfold mobility',
        'Career pathing and AI-generated development plans that managers actually trust',
        'Retention modeling: predictive attrition without becoming a watch list',
        'Workforce planning agents and scenario modelling for restructures',
      ],
    },
    {
      number: '06',
      title: 'Learning, performance and manager copilots',
      topics: [
        'AI-generated learning paths: Cornerstone, Docebo, LinkedIn Learning Coach, Sana, Arist',
        'Performance review AI: calibration support vs auto-rating (the line you don\'t cross)',
        'Manager copilots in Viva, Workday, HiBob — coaching prompts, 1:1 prep, feedback summarisation',
        'Continuous listening: Glint/Viva, Culture Amp, Qualtrics with generative themes',
        'Comp planning and pay-equity AI — Syndio, Trusaic, PayAnalytics',
        'The "always-on coach" debate and worker representative pushback',
      ],
    },
    {
      number: '07',
      title: 'Governance, audit and telling the works council',
      topics: [
        'Building the AI-in-HR governance charter: RACI, model inventory, FRIA template',
        'Audit trail requirements: what to log, retention windows, who can read it',
        'Candidate appeal and human review pathways that are real, not theatre',
        'Vendor SLAs for bias re-testing, model updates, incident notification',
        'Communicating with works councils, unions and employee reps before deployment, not after',
        'NIST AI RMF + ISO/IEC 42001 alignment for a defensible compliance posture',
      ],
    },
    {
      number: '08',
      title: 'Capstone — AI-in-HR operating plan',
      topics: [
        'Teams present a 12-month AI-in-HR roadmap for their own organisation',
        'Includes: use-case shortlist with risk scores, vendor recommendation with evidence, funnel redesign, governance charter, change-management plan, kill-switch policy',
        'Peer review against a published rubric (compliance, business impact, fairness, feasibility)',
        'Deliverable: a board-ready 15-page operating plan + one-page exec summary each team takes home',
      ],
    },
  ],
  enablementNote:
    'Pairs with our HR Onboarding Copilot pilot — we wire a working onboarding agent into your tenant in four weeks, integrated with your existing HRIS.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
  aiEnablementSummary:
    'Gennoor Tech runs AI-in-HR programs that respect the regulatory weight HR carries — EU AI Act Annex III, GDPR Art. 22, GCC PDPL regimes and the works-council reality across European subsidiaries of GCC and African enterprises. We pair vendor-neutral architecture work (Workday, SuccessFactors, HiBob, Eightfold, Phenom) with bias-audit engineering and labour-counsel coordination, so HR teams move on hiring, mobility and learning AI without becoming the test case. Our delivery model is bilingual (English/Arabic, English/French) and built for organisations operating across multiple labour jurisdictions at once.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Map your HR funnel, vendor footprint and Annex III exposure into a single risk-and-opportunity heatmap.' },
    { phase: 'Train', action: 'Certify recruiters, HRBPs and people-analytics teams on prompt craft, bias testing and candidate-disclosure language for your jurisdictions.' },
    { phase: 'Innovate', action: 'Run 6-week pilots on sourcing agents, skills inference or manager copilots with measurable funnel and retention KPIs.' },
    { phase: 'Build', action: 'Wire vendor agents into your HRIS with a model registry, FRIA pack, bias-monitoring dashboard and works-council-ready documentation.' },
    { phase: 'Sustain', action: 'Operate a quarterly bias re-test cadence, drift-alert response runbook and an AI-in-HR governance council that actually meets.' },
  ],
}

export const aiForFinance: CoursePdf = {
  slug: 'ai-for-finance-accounting',
  title: 'AI for Finance & Accounting',
  subtitle: 'The 2026 finance AI landscape, deployed — Copilot for Finance, Big Four agent fleets, document AI, audit-grade controls.',
  track: 'function',
  trackLabel: 'By Function',
  audience: 'CFOs, controllers, FP&A leaders, AP/AR managers, internal audit, tax, treasury — practising finance professionals who own a process and a budget',
  duration: '2 days (16 hours)',
  pages: 60,
  requirements:
    'Attendees should be practising finance professionals with working knowledge of their organisation\'s chart of accounts, close calendar, and primary ERP. Bring a laptop with access to Excel and, if available, your Microsoft 365 Copilot or ERP sandbox tenant. No coding or data-science background is assumed; we will not teach accounting fundamentals.',
  outcomes: [
    'Map at least 12 concrete AI use cases across the finance value chain (record-to-report, procure-to-pay, order-to-cash, FP&A, tax, audit) to your organisation\'s current process pain points and rank them by deployability in the next 90 days',
    'Operate Finance in Microsoft 365 Copilot (Financial Reconciliation GA October 2025; Variance Analysis preview) hands-on against a sample dataset, and define the data-prep prerequisites needed in your own tenant',
    'Build an AI-readiness scorecard for your finance data — chart-of-accounts hygiene, master data, sub-ledger reconciliation, source-system API access — and identify the top three blockers to deployment',
    'Apply an audit-grade control framework (SOX ITGC, model documentation, human-in-the-loop checkpoints, evidence trail) to any AI workflow you intend to put into production',
    'Classify your candidate AI use cases against the EU AI Act Annex III high-risk list, PCAOB 2026 inspection focus areas, and ISA 240 (Revised) fraud-risk expectations effective 15 December 2026',
    'Draft a 12-month finance-AI deployment roadmap with budget, vendor shortlist, governance committee, success metrics, and explicit kill-criteria for failing pilots',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 finance AI landscape',
      topics: [
        'Vendor map: Finance in Microsoft 365 Copilot (GA Oct 2025), SAP Joule Studio (GA Q1 2026), Workday Illuminate, Oracle AI for ERP, Dynamics 365 Finance agents',
        'Big Four agent fleets in production: EY.ai (1,000+ agents → 100,000 by 2028), PwC Agent OS + GL.ai for journal-entry review, KPMG Workbench with Microsoft, Deloitte Zora AI',
        'What ships today vs what is still demo — the honest delta (Bain: 94% of CFOs expect benefit, 71% have not yet deployed)',
        'Four reference architectures: copilot pattern, agent pattern, embedded-ERP pattern, RPA-replacement pattern',
        'Cost model: per-seat M365 Copilot pricing, agent consumption pricing, ERP-bundled AI, build vs buy decision frame',
      ],
    },
    {
      number: '02',
      title: 'Document AI and procure-to-pay',
      topics: [
        'Invoice capture and PO-matching at scale: Tipalti (196 countries / 120 currencies), Ramp Bill Pay (4 AI agents, 99% OCR), Brex, Stampli, SAP Concur',
        'Touchless AP economics — throughput, exception rates, fraud-screening, duplicate detection, and the unit-cost shift from $5–15 to under $1 per invoice',
        'Vendor master cleansing, supplier onboarding and beneficial-ownership verification with AI',
        'Expense AI: receipt parsing, policy enforcement, T&E anomaly detection',
        'Lab — process a 50-invoice batch through a sandbox AP agent end-to-end, including the exception path',
      ],
    },
    {
      number: '03',
      title: 'Close, consolidation, reconciliation',
      topics: [
        'Microsoft Copilot for Finance Financial Reconciliation (GA Oct 2025) — setup, templates, Dataverse install, supported source systems',
        'Intercompany matching, sub-ledger to GL ties, FX revaluation with AI assist',
        'Automated journal-entry generation and narrative commentary — the PwC GL.ai pattern (and where it still needs human review)',
        'BlackLine, Trintech, FloQast AI features versus the Microsoft-native approach — when to use which',
        'Close-cycle KPIs: days-to-close before/after, error rates, manual-touch ratio, percentage of accounts auto-reconciled',
        'Lab — run a multi-entity reconciliation in Copilot for Finance against sample data',
      ],
    },
    {
      number: '04',
      title: 'FP&A, forecasting, variance analysis',
      topics: [
        'When ML beats LLM, when LLM beats ML, when neither beats a planner with a spreadsheet — a decision frame',
        'Driver-based planning with Copilot Variance Analysis (preview), Anaplan AI, Pigment, Workday Adaptive',
        'Narrative generation for board decks — the hallucination failure mode (recent research: arXiv 2512.03107 on info-theoretic detection cutting hallucination 92%) and how to ground outputs in your numbers',
        'Scenario modelling, rolling forecasts, and sensitivity analysis at conversational speed',
        'Lab — generate a variance-analysis executive summary on a budget-vs-actual dataset, then deliberately break it to study failure modes',
      ],
    },
    {
      number: '05',
      title: 'Audit, anomaly detection, controls',
      topics: [
        'Full-population testing with MindBridge (deployed inside KPMG audit), Datricks, AppZen — moving past sample-based testing',
        'ISA 240 (Revised), effective for periods beginning on/after 15 December 2026 — what the data-driven fraud lens means for your control environment',
        'PCAOB 2026 inspection priorities: AI use in audits, professional scepticism erosion, model documentation expectations',
        'SOX implications when AI becomes an ITGC: change-management, evidence preservation, segregation-of-duties for prompts and agents',
        'Lab — anomaly-detection walkthrough on a journal-entry dataset, then defend your findings to a notional external auditor',
      ],
    },
    {
      number: '06',
      title: 'Tax, compliance, technical accounting',
      topics: [
        'Tax research and provision copilots: Thomson Reuters CoCounsel Tax, Bloomberg Tax AI, EY Tax agents',
        'Lease, revenue, impairment automation — Trullion for ASC 842, ASC 606, IFRS 16 from unstructured contracts, emails, PDFs',
        'E-invoicing mandates (ViDA, Peppol, LATAM) and AI-assisted compliance reporting',
        'Regulator-grade explainability: how to defend an AI-derived tax position or technical accounting conclusion',
        'Workpaper automation and audit-trail preservation across model versions',
      ],
    },
    {
      number: '07',
      title: 'Governance, risk, the regulator',
      topics: [
        'EU AI Act Annex III high-risk classifications effective 2 August 2026 — credit scoring, creditworthiness assessment, insurance risk pricing',
        'EU AI Act Articles 9–15 obligations in detail: risk management, data governance, logging, human oversight, transparency (penalties up to €15M or 3% of global turnover)',
        'Model risk management for finance AI: SR 11-7 lineage applied, model cards, challenger models, periodic re-validation',
        'Data lineage, prompt logging, and the "explainable to an external auditor" bar',
        'Building a finance-AI governance committee: charter, RACI, kill-switch criteria, escalation paths',
        'Workshop — classify five candidate use cases against EU AI Act Annex III and PCAOB inspection expectations',
      ],
    },
    {
      number: '08',
      title: 'Roadmap, ROI, change management',
      topics: [
        'Data-readiness scorecard: COA hygiene, master data, sub-ledger health, ERP API access — score your organisation',
        'Pilot design that survives contact with reality: success metrics, kill criteria, sponsor model, time-boxing',
        'Talent and the controller\'s office: what to upskill, what to hire, what to outsource — role-by-role',
        'Vendor evaluation rubric: lock-in risk, audit-trail quality, SOC 2 / ISO 42001 posture, exit clauses, data-residency',
        '30-60-90 day deployment plan template — what week 1 looks like, what month 3 looks like',
        'Capstone — each attendee presents a one-page finance-AI roadmap with budget, vendor shortlist, and three measurable Q1 wins',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Finance AI deployment engagement — Copilot for Finance + AP document AI deployed in your ERP in eight weeks, with audit-grade controls signed off by your external auditor.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–10 weeks',
  aiEnablementSummary:
    'Gennoor Tech helps finance leaders across GCC, Africa and South Asia move from "we evaluated Copilot for Finance" to "it\'s deployed, audit-grade, and our external auditor signed off". We pair Copilot for Finance, SAP Joule, Workday Illuminate and Big Four agent-pattern deployments with SOX-ITGC engineering, model risk documentation aligned to SR 11-7, and EU AI Act / PCAOB / ISA 240 (Revised) classification — so finance AI moves through controls instead of around them.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Data-readiness scorecard across chart-of-accounts hygiene, master data, sub-ledger health, ERP API access plus EU AI Act Annex III and PCAOB-2026 inspection-priority gap map.' },
    { phase: 'Train', action: 'Certify CFO office, controllership, FP&A, AP/AR, internal audit and tax on Copilot for Finance, audit-grade prompt practice and explainability obligations.' },
    { phase: 'Innovate', action: 'Pilot Financial Reconciliation (Copilot for Finance), invoice document AI (Tipalti/Ramp/Stampli) or two-layer forecasting with measurable cycle-time and accuracy KPIs.' },
    { phase: 'Build', action: 'Productionise inside D365 Finance, SAP, NetSuite or Oracle ERP with three-tier human-in-loop, audit posture (confidence-scored extractions, source-linked transactions), and signed model controls.' },
    { phase: 'Sustain', action: 'Monthly accuracy and bias review, quarterly external-auditor-ready evidence pack, governance committee cadence and continuous regulator-watch (EU AI Act, PCAOB, ISA 240).' },
  ],
}

export const aiForSalesMarketing: CoursePdf = {
  slug: 'ai-for-sales-marketing',
  title: 'AI for Sales & Marketing',
  subtitle: 'Rebuild the revenue motion around AI agents without joining the spam graveyard.',
  track: 'function',
  trackLabel: 'By Function',
  audience:
    'CROs, CMOs, VPs of sales, sales-ops and revenue-ops leaders, demand-gen directors, sales enablement leaders, ABM program owners, SDR/BDR managers in B2B organisations of 100+ revenue staff. Practitioners who own a number, a forecast or a pipeline review — not field reps.',
  duration: '2 days (16 hours)',
  pages: 52,
  requirements:
    'Attendees should bring last-quarter pipeline data, current cold-outbound response rates, their MAP/CRM stack details (Salesforce, HubSpot, Dynamics 365, Marketo, Pardot, Eloqua) and at least one ABM target account list. Familiarity with funnel math, attribution disputes and forecast cadence is assumed. No coding required; SQL or basic CRM admin literacy is helpful for the lab modules. Each team should arrive with one revenue motion they want to redesign (outbound SDR, inbound MQL handoff, expansion, renewal, partner) — this becomes the capstone artefact.',
  outcomes: [
    'Produce a current-state revenue stack audit covering Microsoft Sales Copilot, Salesforce Agentforce 360, HubSpot Breeze, Gong, Clari, 6sense, Apollo and Common Room with a documented build-vs-buy recommendation',
    'Rebuild one end-to-end revenue motion (outbound or expansion) with named AI agents, human escalation triggers and reply-rate guardrails calibrated to the 2026 inbox reality',
    'Stand up a working Agentforce SDR or Microsoft Sales Agent pilot scoped to one segment, one geo, one product, with success metrics agreed by sales, marketing and ops',
    'Draft a content/personalisation operating model that produces volume without triggering Gmail/Yahoo sender-reputation penalties or the "AI slop" pattern collapsing reply rates',
    'Build a forecast and deal-inspection cadence using Clari, Gong or Salesforce Revenue Intelligence with AI-surfaced risk signals the CRO can defend',
    'Publish a sales/marketing AI governance brief: data sharing across CDP and CRM, sender authentication, customer disclosure where required, kill-switch for agent misbehaviour',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 revenue stack — what actually shipped',
      topics: [
        'Salesforce Agentforce 360 (GA Oct 13 2025) — Sales Cloud rebranded as Agentforce Sales',
        'Microsoft 365 Copilot for Sales Wave 2 (Oct 2025–Mar 2026): Sales Agent, Sales Chat, Outlook/Teams integration',
        'HubSpot Breeze agents, Breeze Intelligence, and the SMB/mid-market shift',
        'Gong, Clari, Chorus — conversation intelligence and revenue intelligence convergence',
        '6sense, Demandbase, ZoomInfo Copilot, Apollo, Common Room — signal-based GTM stack',
        'Specialist layer: Regie.ai, Lavender, Clay, Smartlead, Instantly — what\'s still useful, what\'s harmful',
      ],
    },
    {
      number: '02',
      title: 'The cold outbound collapse and the new math',
      topics: [
        'The data: reply rates from ~8.5% (2019) to 3-5% (2026); 95% of cold emails get zero reply',
        'Why volume-first AI outbound destroyed itself: Lavender\'s 13× degradation on speed-over-personalisation',
        'Google/Yahoo bulk sender requirements (Feb 2024 + ongoing tightening through 2025)',
        'Domain warming, sender reputation, list hygiene as table stakes — not optional',
        'The "signal-based" alternative: 6sense intent, Common Room dark-funnel, G2 buyer-intent',
        'What a 2026 outbound motion actually looks like — fewer touches, deeper context, agent-assisted human send',
      ],
    },
    {
      number: '03',
      title: 'Agentforce Sales, Microsoft Sales Agent and the SDR role question',
      topics: [
        'Agentforce SDR Agent: research, multichannel outreach, meeting booking — and where it fails',
        'Microsoft Sales Agent for the SDR function across territories, products, languages',
        'Slack workspace agents (Agentforce in Slack) and the workflow shift for AEs',
        'Partner Cloud agents — channel sales agentified',
        'The honest conversation: what happens to your SDR team in 18 months, and what they become',
        'Comp plan, ramp and quota implications of agent-assisted vs agent-led pipeline',
      ],
    },
    {
      number: '04',
      title: 'Lab — rebuilding one revenue motion',
      topics: [
        'Each team takes a real motion (outbound, expansion, renewal, partner) and rebuilds it',
        'Identify the agents (research, drafting, scheduling, scoring) and the human checkpoints',
        'Scoring: AI-assisted lead scoring vs predictive — Salesforce Einstein, 6sense, HubSpot scoring',
        'Personalisation at scale without the slop pattern — what "context" looks like to a buyer',
        'Reply-rate guardrails: minimum signal threshold before send, max touches per quarter',
        'Output: a documented motion with named agents, KPIs and a 30/60/90 rollout plan',
      ],
    },
    {
      number: '05',
      title: 'Conversation intelligence and deal inspection',
      topics: [
        'Gong, Chorus, Clari Copilot — what they actually surface and what\'s noise',
        'Risk signals that hold up in QBR: single-threading, ghost periods, late-stage scope creep',
        'Coaching at scale: Second Nature, Hyperbound, Quantified — AI role-play reps actually use',
        'Forecast accuracy: AI-assisted commit vs human gut — when each wins',
        'MEDDPICC/Command of the Message scoring with AI-extracted signals',
        'The trust problem: when reps disable recording, your model is blind',
      ],
    },
    {
      number: '06',
      title: 'Marketing AI — content, personalisation, brand risk',
      topics: [
        'AI content production: Jasper, Writer, Typeface, Adobe GenStudio, Canva Magic Studio',
        'Brand-safe generation — style guides, fact grounding, legal review workflow',
        'Personalisation platforms with generative layers — Mutiny, Optimizely Opal, Adobe AEP agents',
        'ABM execution with Demandbase/6sense AI orchestration',
        'Programmatic and creative AI risk: copyright, voice cloning, deepfake disclosure rules',
        'Measurement: MMM resurgence, last-click death, AI-attributed influence',
      ],
    },
    {
      number: '07',
      title: 'Data, CDP and governance for an AI revenue org',
      topics: [
        'The CDP–CRM–MAP convergence: Salesforce Data Cloud, Microsoft Customer Insights, HubSpot Smart CRM',
        'Identity resolution and the cookie/MAID collapse — what 2026 actually requires',
        'Sender authentication: SPF, DKIM, DMARC enforcement and one-click unsubscribe (RFC 8058)',
        'AI customer-facing disclosure: where legally required (EU AI Act Art. 50), where smart',
        'Data sharing across sales, marketing, success — RBAC, PII handling, third-party agent access',
        'Kill-switch design: when an agent goes off-brand or off-policy, who stops it',
      ],
    },
    {
      number: '08',
      title: 'Capstone — revenue AI operating plan',
      topics: [
        'Teams present the redesigned motion with full economic model',
        'Includes: stack decision, agent inventory, human roles, reply-rate guardrails, forecast cadence, content engine, governance brief',
        'Peer review against rubric (reply-rate realism, CAC defensibility, brand safety, scale)',
        'Deliverable: a board-ready GTM AI plan + 90-day execution checklist',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Sales Proposal Generator pilot — branded, CRM-grounded proposal generation deployed in your CRM in four weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
  aiEnablementSummary:
    'Gennoor Tech designs revenue motions for GCC, African and South Asian B2B organisations facing a saturated inbox and shrinking SDR ROI — the exact conditions that broke volume-first AI outbound through 2025. We build with Salesforce Agentforce, Microsoft Sales Copilot, HubSpot Breeze and the signal-based stack (6sense, Common Room, Clay), then layer Arabic/French/Hindi-Tamil content engineering for regional markets where most vendor templates fall apart. Pilots ship with reply-rate guardrails, sender-reputation hygiene and forecast-accuracy benchmarks the CRO can defend at the board.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Audit your pipeline math, sender reputation, CRM data quality and current AI tools against 2026 reply-rate reality.' },
    { phase: 'Train', action: 'Certify SDRs, AEs, marketers and ops on agent operation, signal-based selling and content engineering for your regional markets.' },
    { phase: 'Innovate', action: 'Pilot Agentforce Sales, Microsoft Sales Agent or 6sense orchestration on one motion with named guardrails and KPI gates.' },
    { phase: 'Build', action: 'Productionise the motion with CDP/CRM wiring, sender authentication, brand-safe content workflow and kill-switch policy.' },
    { phase: 'Sustain', action: 'Run quarterly motion reviews, reply-rate drift alerts and AE coaching cycles driven by conversation-intelligence signals.' },
  ],
}

export const aiForCustomerService: CoursePdf = {
  slug: 'ai-for-customer-service-support',
  title: 'AI for Customer Service & Support',
  subtitle: 'Deploy CX agents that hold CSAT, handle Arabic and Swahili, and don\'t hallucinate policy.',
  track: 'function',
  trackLabel: 'By Function',
  audience:
    'CX directors, VPs of customer support, contact-centre operators, support operations leads, knowledge-management owners, voice-of-customer analysts and CS-platform admins running Zendesk, Salesforce Service Cloud, Dynamics 365 Customer Service, Intercom, Genesys or Five9. Senior practitioners owning a queue, a CSAT target or a deflection KPI.',
  duration: '2 days (16 hours)',
  pages: 52,
  requirements:
    'Bring last-quarter ticket volume, current AHT/FCR/CSAT/deflection numbers, language-mix breakdown for your support queues, your top 20 intents and a sample of escalations that went wrong. Familiarity with your CCaaS platform\'s admin console is required for lab modules. No coding needed, but knowledge-base structure literacy (article taxonomy, metadata) matters.',
  outcomes: [
    'Produce an intent-level deflection-vs-CSAT map for your top 20 ticket types, with an AI-vs-human routing decision for each scored against Zendesk CX 2026 benchmarks',
    'Stand up a scoped tier-1 bot pilot in Zendesk AI Agents, Intercom Fin, Ada, Forethought or Dynamics 365 Service Agent with knowledge grounding and a hard escape hatch',
    'Build a multilingual support architecture handling Arabic/English code-switching, Tamil/Sinhala, Swahili and French/English with disclosure language that meets EU AI Act Article 50',
    'Configure an agent-assist layer (Salesforce Agentforce Service, Dynamics 365 Copilot, Zendesk Copilot) with knowledge-grounded responses, automated wrap-up and QA scoring',
    'Publish a hallucination-prevention playbook: knowledge governance, source-of-truth hierarchy, "I don\'t know" thresholds and post-incident review process',
    'Draft the CX AI governance brief: customer disclosure, escalation paths, sentiment-based routing rules, recording/transcription consent and the frontline-team trust contract',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 CX AI stack — what actually shipped',
      topics: [
        'Dynamics 365 Customer Service: Service Agent (preview), Customer Assist Agent, Quality Assurance Agent, Service Operations Agent; voice agents in Copilot Studio (GA Apr 2026)',
        'Salesforce Agentforce 360 for Service — agent-assist + autonomous resolution + voice',
        'Zendesk AI Agents (post-Ultimate acquisition) and Zendesk Copilot',
        'Intercom Fin 3 — resolution rate claims vs what benchmarks actually show',
        'Ada, Forethought, Kustomer, Front — the focused-platform tier',
        'CCaaS-side AI: Genesys Cloud AI, NICE Enlighten, Five9 Genius, Talkdesk Autopilot',
      ],
    },
    {
      number: '02',
      title: 'Deflection math and the CSAT trap',
      topics: [
        'Industry benchmarks: 25-45% deflection for first-year programs; CSAT 4.10/5 average for AI-handled',
        'Where AI wins: password reset (4.41), refund status (4.32) — structured, intent-clear',
        'Where AI breaks: complaint handling (3.34), billing disputes (3.61) — sentiment-heavy',
        '"Deflection" as a vanity metric — what containment, resolution and abandonment actually mean',
        'The 80% deflection claims: how vendors count vs how to count honestly',
        'Building an intent-level scorecard you can present to the COO',
      ],
    },
    {
      number: '03',
      title: 'Scoped bots, agent assist and the architecture choice',
      topics: [
        'The fork: tier-1 autonomous bot for narrow intents vs agent-assist for everything else',
        'Hybrid patterns: bot triages, drafts, suggests; human approves and sends',
        'Voice agents in 2026: real-time voice in Dynamics 365, Genesys, Five9 — latency and quality reality',
        'Escalation design: when, how, with what context payload',
        'The "I don\'t know" pattern — calibrated refusal vs hallucinated confidence',
        'The frontline trust contract: agents must trust the AI suggestion or they\'ll route around it',
      ],
    },
    {
      number: '04',
      title: 'Multilingual reality — Arabic, Swahili, Tamil and code-switching',
      topics: [
        'Arabic dialect mix (MSA, Gulf, Levantine, Egyptian, Maghrebi) — what most vendors get wrong',
        'Code-switching: Arabic-English in GCC, Tamil-English in Sri Lanka and Tamil Nadu, Swahili-English in East Africa',
        'Diacritisation, transliteration, RTL handling in transcripts and KB articles',
        'Vendor reality check: which platforms handle code-switching well in 2026',
        'Building a multilingual knowledge base: master-language strategy, controlled translation, glossary governance',
        'Cultural register: when the bot\'s tone offends — formality in Arabic and Swahili contexts',
      ],
    },
    {
      number: '05',
      title: 'Knowledge AI without hallucinated policy',
      topics: [
        'RAG architectures for support: vector + keyword + metadata filtering',
        'Source-of-truth hierarchy: policy DB > KB > historical ticket > model knowledge — never the last',
        'Knowledge governance: ownership, freshness SLA, deprecation, version control',
        'Grounding evaluation: how to test for invented refund policies, fake SLA promises, made-up product specs',
        'The Air Canada case and other policy-hallucination case law — legal exposure of "the bot said so"',
        'Continuous evaluation: nightly synthetic eval suite, weekly human spot-check',
      ],
    },
    {
      number: '06',
      title: 'Lab — building a scoped tier-1 bot pilot',
      topics: [
        'Choose Zendesk AI Agents / Intercom Fin / Dynamics 365 Service Agent / Forethought',
        'Scope: 3-5 intents, one language pair, one channel',
        'Knowledge grounding setup, escape-hatch configuration, escalation context payload',
        'Test cases: happy path, edge case, hostile customer, policy-trap question',
        'Measurement plan: containment, AHT, CSAT, escalation quality',
        'Output: a working pilot config + go/no-go criteria for production',
      ],
    },
    {
      number: '07',
      title: 'Sentiment, QA and the frontline team',
      topics: [
        'Sentiment-based routing and the false-positive cost',
        'AI QA at 100% coverage: NICE Enlighten, Observe.AI, Salesforce QA Agent — and what reps think',
        'Wrap-up automation: Copilot in Dynamics 365 Customer Service, Agentforce wrap, Zendesk auto-summarise',
        'Coaching loops: surfacing reps\' actual wins, not just gaps',
        'Workforce management AI: Verint, Calabrio — forecasting and scheduling under agent-assisted volume',
        'The frontline conversation: change management when handle time targets shift',
      ],
    },
    {
      number: '08',
      title: 'Governance, disclosure and capstone',
      topics: [
        'EU AI Act Article 50: customer disclosure of AI interaction — what language, what channel',
        'GDPR + regional rules: recording consent, transcript storage, PII redaction in prompts',
        'Incident playbook: when the bot misquotes policy, who notifies whom, in what window',
        'Capstone: teams present full CX AI operating plan — stack choice, intent map, multilingual approach, knowledge governance, pilot scope, KPIs, disclosure language, governance brief',
        'Peer review against rubric (CSAT defensibility, hallucination control, frontline trust, regulatory fit)',
        'Deliverable: a 90-day execution plan + first-week kick-off checklist',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Multilingual Customer Support Agent pilot — we deploy agent assist + scoped tier-1 deflection in your contact centre in four weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
  aiEnablementSummary:
    'Gennoor Tech runs CX AI programs for GCC, African and South Asian contact centres where the multilingual reality (Arabic dialects with English code-switch, Swahili-English, Tamil-Sinhala, French-Arabic) breaks most US-trained vendor models out of the box. We integrate Dynamics 365 Customer Service, Salesforce Agentforce Service, Zendesk AI Agents and Intercom Fin with regional language tuning, dialect-aware knowledge bases and Article 50 disclosure flows. Our delivery includes frontline change management so agent-assist actually gets used instead of bypassed.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Map your intent mix, language reality, knowledge-base health and current deflection vs CSAT against 2026 benchmarks.' },
    { phase: 'Train', action: 'Certify CX leaders, supervisors, KB owners and frontline reps on agent-assist workflows, hallucination spotting and escalation discipline.' },
    { phase: 'Innovate', action: 'Pilot a scoped tier-1 bot or agent-assist layer on 3-5 intents with multilingual handling and a hard escape hatch.' },
    { phase: 'Build', action: 'Productionise with knowledge governance, grounding evaluation, voice/chat integration, disclosure flows and frontline coaching loops.' },
    { phase: 'Sustain', action: 'Run weekly hallucination spot-checks, monthly intent-map reviews and quarterly multilingual model re-evaluations.' },
  ],
}

export const aiForOps: CoursePdf = {
  slug: 'ai-for-operations-supply-chain',
  title: 'AI for Operations & Supply Chain',
  subtitle: 'Apply AI to forecasting, procurement, logistics and supplier risk without breaking your S&OP.',
  track: 'function',
  trackLabel: 'By Function',
  audience:
    'COOs, supply chain directors, plant managers, logistics and warehousing heads, procurement and category leaders, S&OP managers, demand and supply planners stepping into AI-augmented roles across GCC, Africa and South Asia operations.',
  duration: '2 days (16 hours)',
  pages: 60,
  requirements:
    'Participants should have 3+ years in an operations, planning, procurement or logistics role and a working understanding of their company\'s S&OP cycle, ERP backbone (SAP, Oracle, Dynamics 365 or equivalent) and core supply chain KPIs such as forecast accuracy, OTIF, inventory turns and landed cost. No coding or data science required, but comfort reading dashboards in Power BI or Tableau and familiarity with at least one planning tool (SAP IBP, Kinaxis, o9, Blue Yonder or Anaplan) is recommended. Bring a recent disrupted-SKU or supplier incident from your own operation to use in the labs.',
  outcomes: [
    'Decide when ML, LLM or classical OR is the right tool for a given operations problem, with a documented decision matrix',
    'Improve baseline demand forecast accuracy on a chosen SKU family by 5-15% WAPE through structured ML augmentation and external signals',
    'Stand up a procurement document-AI workflow that extracts terms, prices and incoterms from supplier PDFs with reviewable confidence scores',
    'Build a supplier risk dashboard that fuses news, financial, climate and tier-2 visibility signals into a weekly risk register',
    'Run an AI-augmented S&OP scenario for a Red Sea-style disruption, with reroute, cost and inventory implications quantified',
    'Define a 90-day plan for predictive maintenance or inventory intelligence in one site, including data readiness and ROI gating',
  ],
  modules: [
    {
      number: '01',
      title: 'Operations AI landscape and the 2024-2026 disruption decade',
      topics: [
        'Red Sea diversion, Suez throughput collapse, Cape of Good Hope rerouting and what it taught planners',
        'Taiwan semiconductor concentration, Panama drought, August 2025 US reciprocal tariffs (up to 41%) and nearshoring economics',
        'When AI helps and when it hurts: cost of forecast accuracy vs cost of agility',
        'Mapping AI use cases across plan, source, make, deliver, return',
        'Gartner 2025/2026 Magic Quadrant view: Kinaxis, o9, SAP IBP, Blue Yonder, Anaplan positioning',
        'Setting the course capstone: a disruption scenario from a participant\'s own operation',
      ],
    },
    {
      number: '02',
      title: 'Demand forecasting with ML and LLM signal',
      topics: [
        'Time-series structure: trend, seasonality, promotion lift, cannibalisation, intermittent demand',
        'Hierarchical forecasting (SKU-location-channel) and reconciliation traps',
        'Boosting baselines with gradient-boosted trees and external signals (weather, FX, oil, Ramadan calendar, GCC public holidays)',
        'LLM-extracted demand signals: sales call notes, distributor WhatsApp logs, social listening',
        'Forecast accuracy metrics done right: WAPE for portfolios, MASE for intermittent SKUs, why MAPE lies',
        'Demo in SAP IBP and o9 Solutions: configuring an ML demand sensing layer',
      ],
    },
    {
      number: '03',
      title: 'Procurement document AI and supplier onboarding',
      topics: [
        'Anatomy of a procurement document stack: RFQs, quotes, MSAs, POs, invoices, certificates of origin',
        'Extraction patterns with Azure Document Intelligence, Google Document AI and SAP Joule for procurement',
        'Three-way match automation and tolerance design',
        'LLM-assisted clause review on supplier MSAs: incoterms, price escalation, force majeure, ESG clauses',
        'Catalogue normalisation and spend taxonomy enrichment with LLMs',
        'Human-in-loop design: who approves, what gets sampled, what gets blocked',
      ],
    },
    {
      number: '04',
      title: 'Logistics optimisation — AI as OR amplifier',
      topics: [
        'Why OR (MILP, VRP, CP-SAT) still wins on routing, slotting and load planning',
        'Where ML genuinely helps: ETA prediction, dwell time, demurrage risk, port congestion forecasting',
        'LLM as planner copilot: scenario narration, exception triage, what-if questioning over an OR model',
        'Last-mile in Africa and South Asia: address normalisation, informal addresses, two-wheeler routing',
        'Visibility platforms: project44, FourKites, Shippeo integration patterns',
        'Carbon and cost co-optimisation: scope 3 reporting embedded in route choice',
      ],
    },
    {
      number: '05',
      title: 'Predictive maintenance and plant-floor intelligence',
      topics: [
        'Failure modes that PdM actually catches vs vibration-monitoring marketing',
        'Data prerequisites: tag density, sample rate, labelled failures, MES integration',
        'Anomaly detection vs RUL (remaining useful life) modelling',
        'Microsoft Dynamics 365 Supply Chain Management Asset Management and Azure IoT integration patterns',
        'Edge vs cloud inference for plants in GCC, Africa and South Asia (connectivity realities)',
        'ROI framing: avoided downtime, parts savings, safety incidents and the honesty test',
      ],
    },
    {
      number: '06',
      title: 'Inventory intelligence and multi-echelon optimisation',
      topics: [
        'Service-level vs fill-rate vs cycle service-level and why finance often misreads them',
        'MEIO concepts and where AI helps set safety stock dynamically',
        'Slow-mover, dead-stock and obsolescence detection with ML',
        'Allocation and pre-build under tariff and lead-time volatility',
        'Blue Yonder Luminate, o9 inventory optimiser, Kinaxis MEIO walkthroughs',
        'Working capital narrative for the CFO: cash unlocked per percentage-point service improvement',
      ],
    },
    {
      number: '07',
      title: 'Supplier and tier-2 risk — news, financial, climate, geopolitical signals',
      topics: [
        'Building a supplier risk taxonomy: financial distress, ESG, sanctions, cyber, climate, geopolitical',
        'Mapping tier-2 and tier-3 dependencies (Interos, Everstream, Resilinc, Sayari patterns)',
        'LLM news triage at scale: signal extraction, deduplication, severity scoring',
        'Financial-distress signals from public filings, credit reports and trade payment data',
        'Climate risk overlays: flood, heat, water stress on supplier sites',
        'Sanctions and export-control screening in a GCC and South Asia context',
      ],
    },
    {
      number: '08',
      title: 'Lab and capstone — AI-augmented S&OP disruption scenario',
      topics: [
        'Lab 1: demand forecast uplift on a participant SKU family using a provided ML baseline notebook',
        'Lab 2: procurement document extraction on a real supplier MSA pack with confidence-score review',
        'Lab 3: supplier risk dashboard build from news + financial + weather feeds',
        'Capstone: present a Red Sea-style scenario for your own operation with reroute cost, inventory hedge and S&OP decision narrative',
        'Tool stack used: SAP IBP, Kinaxis Maestro, o9, Microsoft Dynamics 365 Supply Chain, Power BI, Azure OpenAI',
        'Deliverable: one-page S&OP brief plus a 90-day AI adoption roadmap for one node of your supply chain',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Forecasting Custom Build + Predictive Maintenance pilot — two parallel 6-week tracks landing both plays in production.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–10 weeks',
  aiEnablementSummary:
    'Gennoor Tech embeds with operations and supply chain teams across GCC manufacturing, African logistics corridors and South Asian sourcing hubs to turn AI from pilot theatre into measurable planning uplift. We pair planners with engineers on their own SAP IBP, Kinaxis, o9 or Dynamics 365 instances, and we own the unglamorous data plumbing (master data, tag taxonomies, supplier hierarchies) without which no AI initiative survives the second S&OP cycle.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Audit forecast accuracy by SKU tier, supplier risk blind spots and the real data quality of your ERP and MES.' },
    { phase: 'Train', action: 'Upskill planners, buyers and plant managers on AI-augmented S&OP, procurement document review and supplier risk reading.' },
    { phase: 'Innovate', action: 'Co-design two or three high-value use cases (demand sensing, PdM, MEIO, supplier risk) against current disruption patterns.' },
    { phase: 'Build', action: 'Ship production workflows inside SAP IBP, Kinaxis, o9, Blue Yonder or Dynamics 365 with human-in-loop guardrails and audit trails.' },
    { phase: 'Sustain', action: 'Run monthly accuracy reviews, model drift checks and an annual disruption-readiness exercise tied to S&OP governance.' },
  ],
}

export const aiForLegal: CoursePdf = {
  slug: 'ai-for-legal-risk-compliance',
  title: 'AI for Legal, Risk & Compliance',
  subtitle: 'Deploy legal AI with paralegal-in-loop discipline, audit trails and EU AI Act readiness.',
  track: 'function',
  trackLabel: 'By Function',
  audience:
    'General counsel, deputy GCs, heads of compliance, MLROs, legal operations leaders, contract managers, in-house counsel, risk and internal audit leaders and DPOs in regulated industries across GCC, Africa and South Asia.',
  duration: '2 days (16 hours)',
  pages: 56,
  requirements:
    'Participants should be qualified legal, compliance, risk or legal-ops professionals with at least three years of in-house or law-firm experience. Working familiarity with your organisation\'s contract lifecycle, key regulators (DFSA, ADGM FSRA, SAMA, SCA, CMA, RBI, SEBI, SARB, NCA, plus EU GDPR and AI Act exposure) and at least one CLM or document management system is expected. Bring a redacted recent contract, a regulatory horizon-scan output and one AI use case your function is currently evaluating.',
  outcomes: [
    'Map your function\'s AI use cases against ABA Formal Opinion 512 duties and the EU AI Act risk tiers, including Annex III triggers',
    'Run a paralegal-in-loop contract review pilot on a real playbook with measurable cycle-time and quality KPIs',
    'Stand up a multi-jurisdiction regulatory monitoring workflow covering at least three GCC, EU and South Asian regulators',
    'Build a defensible audit trail and hallucination-mitigation protocol for any AI tool the function uses with privileged content',
    'Score and tier AI vendors using a structured legal, security, IP and confidentiality due-diligence framework',
    'Produce a board-ready AI policy for the legal and compliance function with role-based access, training and incident response',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2025-2026 legal AI landscape and the ethics backbone',
      topics: [
        'Wolters Kluwer 2026 Future Ready Lawyer: 92% AI use, 76% in-house weekly GenAI adoption, where time is actually saved',
        'ABA Formal Opinion 512 (29 July 2024): competence, confidentiality, communication, candor, supervision, fees',
        'Why boilerplate engagement-letter consent fails Opinion 512 and what informed consent looks like',
        'Bar guidance beyond ABA: California, Florida, New York, Law Society of England and Wales, DIFC Courts notes',
        'Mapping the function: contracts, advisory, litigation support, regulatory, IP, employment',
        'Setting the course capstone: a real workflow your team will pilot',
      ],
    },
    {
      number: '02',
      title: 'Tooling — Harvey, CoCounsel, Hebbia, Spellbook, Ironclad, Diligent, Protege',
      topics: [
        'Thomson Reuters CoCounsel Legal (August 2025 agentic upgrade) grounded in Westlaw and Practical Law',
        'LexisNexis Protege and the 2025 Harvey-LexisNexis content partnership',
        'Hebbia for cross-document research and diligence workrooms',
        'Spellbook and Harvey for drafting and negotiation',
        'Ironclad, Sirion, Icertis, Docusign IAM CLM: 2025 Gartner Magic Quadrant leaders and where they differ',
        'Diligent for board, ESG and entity governance AI',
      ],
    },
    {
      number: '03',
      title: 'Contract review with paralegal-in-loop discipline',
      topics: [
        'Playbook-first design: clause taxonomy, fallback positions, escalation rules',
        'First-pass AI review vs paralegal review vs partner sign-off: who owns what',
        'Measuring quality: precision and recall on clause classification, not just speed',
        'Privacy, IP and confidentiality posture for third-party CLM AI',
        'Negotiation copilots for the other side\'s paper: redlining, position memos, risk heatmaps',
        'Lab walkthrough in Ironclad and Spellbook on a redacted MSA',
      ],
    },
    {
      number: '04',
      title: 'Multi-jurisdiction regulatory monitoring (GCC, EU, India, Africa)',
      topics: [
        'GCC regulators: DFSA, ADGM FSRA, SAMA, SCA, CMA Kuwait, CMA KSA, QFCRA, CBB',
        'India: RBI, SEBI, IRDAI, MeitY DPDP Act 2023 implementation',
        'EU: AI Act, GDPR, DORA, DSA, NIS2 horizon scanning',
        'Africa: SARB, FSCA, CBN, CBK plus AU data protection trends',
        'LLM-assisted horizon scanning: source curation, deduplication, materiality scoring, lawyer sign-off',
        'Building a weekly regulator brief that survives audit',
      ],
    },
    {
      number: '05',
      title: 'EU AI Act, Annex III and the August 2026 high-risk deadline',
      topics: [
        'Risk tiers: prohibited, high-risk, limited, minimal, plus GPAI obligations',
        'Annex III categories touching legal and compliance: justice and law enforcement, employment, access to essential services, biometric identification',
        'Provider vs deployer obligations and where most in-house teams actually sit',
        'Conformity assessment, technical documentation, post-market monitoring, EU database registration',
        'Penalty exposure (up to €15M or 3% turnover for Annex III breaches) and Digital Omnibus uncertainty',
        'Practical compliance roadmap to 2 August 2026 for non-EU companies serving EU users',
      ],
    },
    {
      number: '06',
      title: 'Hallucination risk, privilege, audit trail and IP posture',
      topics: [
        'Why hallucinations happen and the citation-integrity tests that catch them',
        'Privilege preservation in tools that learn from prompts',
        'Confidentiality engineering: tenant isolation, model training opt-outs, BYOK, region pinning',
        'IP posture: training data, output ownership, indemnities (Microsoft Copilot Copyright Commitment, OpenAI Copyright Shield, Anthropic terms)',
        'Audit trail by design: prompt logging, model version capture, reviewer attestation',
        'Incident response: the Mata v Avianca and Park v Kim playbooks of what not to do',
      ],
    },
    {
      number: '07',
      title: 'Vendor governance and third-party AI risk',
      topics: [
        'Legal AI vendor due-diligence framework: security, IP, data residency, sub-processors, model lineage',
        'Contract terms that matter: training opt-out, IP indemnity, deletion rights, audit rights',
        'Tier-1 vs tier-2 vendor controls and the shadow-AI problem',
        'DORA-style operational resilience requirements applied to AI vendors',
        'Continuous monitoring: SOC 2 Type II, ISO 42001, NIST AI RMF alignment',
        'Building the function\'s AI register and updating it quarterly',
      ],
    },
    {
      number: '08',
      title: 'Lab and capstone — function-wide AI policy and pilot',
      topics: [
        'Lab 1: run a contract review pilot on a provided NDA and MSA pack; measure precision, recall, cycle time',
        'Lab 2: configure a regulatory horizon-scan covering DFSA, SAMA and RBI updates with materiality scoring',
        'Lab 3: score one real AI vendor your function is evaluating against the governance framework',
        'Capstone: present a board-ready AI policy for your legal and compliance function plus one pilot use case with KPIs',
        'Tool stack used: Harvey, CoCounsel, Hebbia, Spellbook, Ironclad, Diligent, Microsoft Purview, Azure OpenAI',
        'Deliverable: AI policy, pilot charter, vendor scorecard, 90-day rollout plan',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Compliance Copilot pilot — domain-grounded compliance assistant deployed against your specific regulatory corpus in five weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
  aiEnablementSummary:
    'Gennoor Tech helps general counsel and compliance leaders across GCC, Africa and South Asia move AI from individual lawyer hacks to function-wide capability without breaching ABA Formal Opinion 512 duties or EU AI Act obligations. We co-author the playbooks, vendor scorecards and audit trails that regulators and partners now expect, and we keep the human accountability line bright while AI does the heavy reading.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Inventory AI shadow use, jurisdictional exposure and the workflows where lawyer time actually leaks.' },
    { phase: 'Train', action: 'Equip lawyers, paralegals and compliance officers on ethical AI use, Opinion 512 duties and EU AI Act obligations.' },
    { phase: 'Innovate', action: 'Pilot two or three workflows (contract review, horizon scanning, vendor diligence) with measurable quality and cycle KPIs.' },
    { phase: 'Build', action: 'Operationalise inside Ironclad, CoCounsel, Harvey or Spellbook with privilege-safe configurations and audit trails.' },
    { phase: 'Sustain', action: 'Maintain an AI register, quarterly vendor reviews and a function-level AI policy that survives regulator scrutiny.' },
  ],
}

// =====================================================================
// TRACK 3 — LEADERSHIP
// =====================================================================

export const aiStrategyCsuite: CoursePdf = {
  slug: 'ai-strategy-c-suite',
  title: 'AI Strategy for the C-Suite',
  subtitle: 'The C-suite playbook for capital, portfolio and org decisions in the AI era.',
  track: 'leadership',
  trackLabel: 'Leadership',
  audience:
    'CEOs, CIOs, CDOs, CSOs, COOs and EVP-level operating leaders in Fortune 500s, GCC national champions and large family conglomerates across MENA and South Asia.',
  duration: '2 days (16 hours)',
  pages: 44,
  requirements:
    'Designed for sitting C-suite executives and their direct reports who are accountable for enterprise-level AI investment, value capture and transformation outcomes. Bring at least one live AI initiative, a draft AI portfolio view or a capex/opex envelope under discussion. Pre-reads: McKinsey 2025 State of AI, BCG Build for the Future 2025 (the 5% / 60% value-gap data) and the participant\'s own organisation\'s last two AI status updates to the executive committee. No technical prerequisites; comfort reading P&L, capital plans and operating model diagrams is assumed.',
  outcomes: [
    'Map your enterprise into the four AI value pools (cost-out, revenue-up, risk-down, capacity-unlock) and rank 8-12 candidate initiatives by EBIT contribution and confidence',
    'Approve a three-horizon AI portfolio (run/grow/transform) with explicit capital envelopes, kill criteria and a 70/20/10 spend logic',
    'Choose an operating-model archetype (hub, hub-and-spoke, federated, embedded) and assign accountable executive owners with named decision rights',
    'Set five board-grade KPIs that distinguish real value from pilot theatre, including a unit-economics line for token, GPU and human-in-the-loop cost',
    'Issue a one-page AI governance mandate covering risk appetite, model approval gates and red lines aligned to ISO 42001, NIST AI RMF and the EU AI Act 2026 enforcement window',
    'Build a 24-month value-capture roadmap with named sponsors, milestone-linked funding releases and a year-2-to-year-3 momentum plan',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 CEO context — what AI actually changes',
      topics: [
        'The 5% / 60% value gap and why most AI spend produces no EBIT',
        'From use cases to workflow redesign: McKinsey\'s rewiring finding',
        'Agentic AI, GPAI models and what shifts in the next 18 months',
        'Sovereign AI, GCC national champion plays and India Stack adjacencies',
        'What the CEO must personally decide vs delegate',
      ],
    },
    {
      number: '02',
      title: 'Where AI value lives in your business',
      topics: [
        'The four value pools and how to size each at enterprise level',
        'Process intensity x decision density: a heatmap method',
        'Industry teardowns: BFSI, telco, energy, retail, conglomerate holdings',
        'Distinguishing productivity theatre from realised cost-out',
        'Working session: rank 8 candidate value pools for your enterprise',
      ],
    },
    {
      number: '03',
      title: 'Building the AI portfolio',
      topics: [
        'Three-horizon view: run-the-bank, grow-the-bank, change-the-bank',
        '70/20/10 capital logic and the case for portfolio over pet projects',
        'Stage-gates, kill criteria and the "fewer, bigger, faster" rule from BCG value creators',
        'Make-buy-partner: foundation models, vertical SaaS, hyperscaler stacks',
        'Working session: draft your two-year AI portfolio on one page',
      ],
    },
    {
      number: '04',
      title: 'Capital allocation and unit economics',
      topics: [
        'Capex vs opex in the GenAI era: GPUs, tokens, data, talent',
        'FinOps for AI: token economics, model routing, RAG vs fine-tune cost curves',
        'Hurdle rates, risk-adjusted NPV and treating models as depreciating assets',
        'Funding the platform vs funding the use case',
        'The CFO conversation: what to bring, what to defend',
      ],
    },
    {
      number: '05',
      title: 'Talent, org design and the operating model',
      topics: [
        'Five operating-model archetypes and when each wins',
        'The AI leadership stack: CAIO, CDO, CIO, Chief Risk — who owns what',
        'Building vs renting talent in GCC, India and Africa labour markets',
        'Workforce redesign: BCG\'s 2026 workforce transformation findings',
        'Change capacity as the binding constraint, not technology',
      ],
    },
    {
      number: '06',
      title: 'Governance, risk and the regulator',
      topics: [
        'NIST AI RMF, ISO 42001, EU AI Act 2026 timeline — the C-suite digest',
        'GCC frameworks: SDAIA principles, UAE AI Charter, DIFC and ADGM angles',
        'India DPDPA, MeitY AI advisory and cross-border data realities',
        'Risk appetite statement: what your board needs to see',
        'Three lines of defence for AI and where they break',
      ],
    },
    {
      number: '07',
      title: 'Sustaining momentum past year two',
      topics: [
        'The post-pilot trough: why year-2 stalls and how value creators escape it',
        'Reinvestment loops, value-capture compounding and platform leverage',
        'Mergers, divestitures and AI-driven business model change',
        'Building learning velocity: dashboards, post-mortems, scaled patterns',
        'Culture signals the CEO must send personally',
      ],
    },
    {
      number: '08',
      title: 'The board conversation and your first 90 days',
      topics: [
        'The five numbers, three narratives format for board AI updates',
        'Aligning audit, risk and tech committees on AI oversight',
        'Handling activist questions on AI spend, ethics and competitive position',
        'Personal C-suite operating rhythm for AI (cadences, forums, decisions)',
        'Commitment session: each participant publishes a 90-day action list',
      ],
    },
  ],
  enablementNote:
    'Pairs with our AI Strategy Workshop — two-day on-site session with the C-suite landing a 24-month portfolio and the first three pilot specs.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '2-day workshop + 2 weeks follow-up',
  aiEnablementSummary:
    'Gennoor Tech\'s AI Enablement practice supports C-suite teams across GCC, Africa and South Asia from portfolio shaping through board reporting. We bring sector-specific value-pool benchmarks, an AI portfolio scoring model calibrated to regional labour and regulatory realities, and embedded operators who can sit alongside your CAIO or CIO for 90-180 days to turn the boardroom decisions from this course into live capital releases.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'AI value diagnostic across business units, identifying the top 10 EBIT opportunities and benchmarking AI maturity against BCG\'s 41 capabilities for regional peers.' },
    { phase: 'Train', action: 'Executive committee and direct-reports labs on portfolio design, capital allocation and operating-model trade-offs, with sector simulations for BFSI, energy, telco and conglomerate holdings.' },
    { phase: 'Innovate', action: 'Rapid value-pool prototypes (8-12 weeks) co-built with your teams to prove unit economics before capital is committed at scale.' },
    { phase: 'Build', action: 'Stand up an AI portfolio office, FinOps for AI tooling, governance mandate and three-lines-of-defence architecture aligned to ISO 42001 and local regulators.' },
    { phase: 'Sustain', action: 'Quarterly portfolio reviews, board-grade KPI packs and a CEO-level cadence that protects momentum through year two and beyond.' },
  ],
}

export const aiGovernanceBoards: CoursePdf = {
  slug: 'ai-governance-risk-boards',
  title: 'AI Governance & Risk for Boards',
  subtitle: 'What directors must ask, oversee and disclose as AI reshapes fiduciary duty.',
  track: 'leadership',
  trackLabel: 'Leadership',
  audience:
    'Board directors, audit committee chairs, risk committee chairs, technology committee members, non-executive directors and company secretaries of listed companies, regulated financial institutions, healthcare groups and large privately-held conglomerates across GCC, Africa and South Asia.',
  duration: '2 days (16 hours)',
  pages: 36,
  requirements:
    'For serving directors and senior board advisors who already understand fiduciary duty, audit and risk oversight, and who now need a director-grade view of AI. No technical background required; bring your latest AI-related management report, the board\'s current risk appetite statement and any AI-specific charter wording. Pre-reads: NACD 2025 Director Essentials on AI Governance, ISO 42001:2023 clauses 4-10 executive summary, NIST AI RMF 1.1 core functions and the EU AI Act high-risk obligations summary.',
  outcomes: [
    'State the board\'s standard of care for AI oversight and where it differs from cyber, model-risk and data oversight',
    'Apply a six-category AI risk taxonomy (model, data, security, third-party, regulatory, reputational/societal) to your own enterprise',
    'Frame eight numbers and four narratives every AI management report to the board must contain',
    'Approve or amend an AI risk appetite statement aligned to ISO 42001, NIST AI RMF and EU AI Act 2026 enforcement milestones',
    'Evaluate third-party and GPAI vendor risk using a director-level due-diligence checklist',
    'Run an AI-incident response tabletop and confirm escalation, disclosure and chair-of-board obligations',
  ],
  modules: [
    {
      number: '01',
      title: 'The director\'s mandate in the AI era',
      topics: [
        'From cyber-oversight to AI-oversight: what\'s analogous, what\'s new',
        'Duty of care under AI: foreseeability, monitoring, informed consent of the board',
        '2025-2026 director-liability signals: Air Canada, Klarna, recent SEC and FCA enforcement themes',
        'Where AI sits on the board agenda: full board, audit, risk, tech or new AI committee',
        'The board\'s own AI competence — declared, assessed, refreshed',
      ],
    },
    {
      number: '02',
      title: 'The framework landscape directors must reference',
      topics: [
        'NIST AI RMF 1.1: govern, map, measure, manage — in director language',
        'ISO 42001:2023 AI Management System: what certification actually proves',
        'EU AI Act: prohibited, high-risk and GPAI obligations through 2 August 2026 and beyond',
        'GCC: SDAIA AI Ethics Principles, UAE AI Charter, ADGM and DIFC guidance',
        'India DPDPA, MeitY advisories; Africa: Nigeria NDPR, South Africa POPIA, Kenya DPA',
      ],
    },
    {
      number: '03',
      title: 'The six-category AI risk taxonomy',
      topics: [
        'Model risk: hallucination, drift, bias, explainability — linking to SR 11-7 thinking',
        'Data risk: provenance, residency, IP leakage, training-data liability',
        'Security risk: prompt injection, model theft, adversarial inputs, agent abuse',
        'Third-party and supply-chain risk in the GPAI era',
        'Regulatory and reputational/societal risk, including AI-content disclosure',
      ],
    },
    {
      number: '04',
      title: 'Board reporting — eight numbers and four narratives',
      topics: [
        'The eight numbers: deployed-model count, high-risk count, incident count, model-risk losses, AI-related opex, value realised, training coverage, third-party concentration',
        'The four narratives: strategy alignment, top three risks, regulator readiness, talent and culture',
        'Designing a one-page AI scorecard the board can defend externally',
        'Red, amber, green thresholds tied to risk appetite',
        'Working session: redraft your current AI management report',
      ],
    },
    {
      number: '05',
      title: 'Third-party and vendor AI risk',
      topics: [
        'The GPAI provider question: who is your model\'s manufacturer',
        'Contractual must-haves: indemnity, audit rights, model-card warranties, exit',
        'Concentration risk in hyperscaler and foundation-model providers',
        'Open-source model use — board-level questions about provenance and licence',
        'Director-level vendor due-diligence checklist',
      ],
    },
    {
      number: '06',
      title: 'AI incidents and crisis response',
      topics: [
        'What counts as an AI incident; disclosure thresholds under SEC, EU, GCC rules',
        'The first 24, 72 and 168 hours: board, regulator, customer, market',
        'Tabletop exercise: a customer-facing agent gives unlawful advice',
        'Communications, regulator engagement and director privilege',
        'Post-incident review and lessons embedded back into risk appetite',
      ],
    },
    {
      number: '07',
      title: 'Sector deep-dives for regulated boards',
      topics: [
        'Banking and insurance: model risk management, SR 11-7, BCBS, CBUAE, SAMA guidance',
        'Healthcare and life sciences: clinical AI, medical-device classification, patient safety',
        'Energy, utilities and critical infrastructure: safety cases and operational AI',
        'Public sector and sovereign-AI joint ventures in GCC and India',
        'Family-owned conglomerates: governance across listed and unlisted subsidiaries',
      ],
    },
    {
      number: '08',
      title: 'The board\'s own AI competence and forward agenda',
      topics: [
        'Skills matrix: AI literacy as a stated director competency',
        'Independent advisors, external assurance and second-line reviews',
        'Director continuing education obligations under NACD, AICD, GCC guidance',
        'Twelve-month board AI agenda template',
        'Personal commitments: each director publishes their oversight focus',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Board AI Briefing — pre-board prep session walking through the framework, the questions, and your live AI portfolio against the taxonomy.',
  pilotPriceBand: '$15k–$40k briefing engagement',
  pilotTimeline: '2 weeks',
  aiEnablementSummary:
    'Gennoor Tech\'s Board AI Enablement service equips directors and company secretaries to chair AI oversight with confidence. We provide independent AI assurance reviews, board-pack templates calibrated to GCC, African and South Asian regulators, and on-call advisory for committee chairs during AI incidents, audits and ISO 42001 certification cycles.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Independent board-level AI maturity and risk review, mapped to NIST AI RMF, ISO 42001 and your home regulator\'s expectations.' },
    { phase: 'Train', action: 'Director education programme including AI literacy, framework primers, sector deep-dives and chair-of-committee masterclasses.' },
    { phase: 'Innovate', action: 'Pilot new board reporting formats, the eight-numbers scorecard and AI-incident tabletop exercises with named directors.' },
    { phase: 'Build', action: 'Standing AI committee charter, risk-appetite statement, third-party AI due-diligence templates and an audit-ready evidence pack.' },
    { phase: 'Sustain', action: 'Quarterly director briefings on regulator moves, incident benchmarks and emerging risks; annual board AI effectiveness review.' },
  ],
}

export const aiRoiBusinessCase: CoursePdf = {
  slug: 'ai-roi-business-case',
  title: 'AI ROI & Business Case Building',
  subtitle: 'Build defensible AI business cases that survive CFO and audit-committee challenge.',
  track: 'leadership',
  trackLabel: 'Leadership',
  audience:
    'CFOs and finance business partners, heads of PMO and value-realisation offices, AI and digital programme directors, internal-audit AI leads, investment-committee secretaries and authors of capex/opex submissions for AI initiatives in BFSI, manufacturing, healthcare, energy and conglomerate corporate centres.',
  duration: '2 days (16 hours)',
  pages: 44,
  requirements:
    'For finance, PMO and programme leaders who already build and defend investment cases and now need an AI-specific lens. Bring a current AI business case (any stage), the organisation\'s hurdle rate and capital approval template, and a recent FinOps or cloud cost report if available. Pre-reads: Bain 2025 AI ROI survey summary, FinOps Foundation "FinOps for AI" overview, SR 11-7 model risk management principles (US Fed) and MIT CSAIL recent work on GenAI productivity measurement.',
  outcomes: [
    'Classify any AI initiative into one of four ROI patterns (cost takeout, revenue uplift, risk reduction, capacity unlock) and apply the right valuation logic',
    'Quantify productivity gains using realisation factors, not vendor-quoted "time saved", and survive CFO challenge on the numbers',
    'Build a full AI TCO model including tokens, GPUs, data, MLOps, human-in-the-loop and decommissioning',
    'Risk-adjust AI returns using probability-weighted scenarios, model-risk reserves and sensitivity to model-price deflation',
    'Present an investment-committee-grade business case with explicit assumptions, kill criteria and value-realisation plan',
    'Answer the twelve CFO challenge questions that kill weak AI business cases',
  ],
  modules: [
    {
      number: '01',
      title: 'Why most AI business cases fail',
      topics: [
        'Vanity metrics vs realised P&L: the Bain and BCG evidence',
        'The pilot-to-production value leak and where it shows up in the P&L',
        '"AI exceptionalism" — and why your standard capital framework still applies',
        'The four ROI patterns: a one-page taxonomy',
        'Diagnostic: score three live cases from the room',
      ],
    },
    {
      number: '02',
      title: 'Pattern 1 — Cost takeout',
      topics: [
        'Activity-based costing for AI-displaced work',
        'Realisation factors: gross hours saved vs net cost out',
        'Headcount, span-of-control and non-replacement economics',
        'Case study: shared-services GenAI in a GCC bank',
        'Common traps and how audit will test them',
      ],
    },
    {
      number: '03',
      title: 'Pattern 2 — Revenue uplift',
      topics: [
        'Conversion, retention, cross-sell and price-realisation levers',
        'Counterfactual design: control groups, holdouts, geo-experiments',
        'Attribution in agent-mediated journeys',
        'Case study: AI-driven underwriting in MENA insurance',
        'Why marketing-attributed AI revenue is rarely board-credible',
      ],
    },
    {
      number: '04',
      title: 'Pattern 3 — Risk reduction',
      topics: [
        'Quantifying avoided loss: fraud, AML, model risk, operational risk',
        'Using SR 11-7 thinking to value model-risk controls',
        'Insurance, capital relief and regulatory-capital interactions',
        'Case study: AI-augmented AML in a South Asian bank',
        'When risk reduction is a hygiene investment, not a ROI investment',
      ],
    },
    {
      number: '05',
      title: 'Pattern 4 — Capacity unlock',
      topics: [
        'From "save time" to "do more with the same team"',
        'Throughput economics and the bottleneck question',
        'Capacity-unlock to revenue or cost: closing the loop',
        'Case study: AI-assisted clinicians in a private hospital group',
        'The CFO test: where does the freed capacity actually land',
      ],
    },
    {
      number: '06',
      title: 'AI TCO and FinOps',
      topics: [
        'Token, GPU, inference, fine-tuning and RAG cost stacks',
        'Build vs buy vs hyperscaler-managed: TCO over three years',
        'Hidden costs: data labelling, evals, red-teaming, model refresh',
        'FinOps for AI: unit economics, chargeback, anomaly detection',
        'Sensitivity: what happens when model prices fall 50% or rise 30%',
      ],
    },
    {
      number: '07',
      title: 'Risk-adjusted returns and the audit-grade case',
      topics: [
        'Probability-weighted NPV and decision-tree scenarios',
        'Model-risk reserves and contingency in AI capex',
        'Realisation curves and the staged-funding contract',
        'Documentation standards an auditor and regulator will accept',
        'Sample full business case walk-through: BFSI, manufacturing, healthcare',
      ],
    },
    {
      number: '08',
      title: 'Defending the case and running value capture',
      topics: [
        'The twelve CFO challenge questions answered',
        'Investment-committee theatre: chair, sponsor, dissenter roles',
        'Value-realisation office: cadence, governance and unlock criteria',
        'Post-implementation review and benefits attestation',
        'Working session: each participant defends their case to a mock committee',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Business Case Workshop — two-day session with your Finance and PMO teams building your top-three AI cases against the template.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '2-day workshop + 2 weeks',
  aiEnablementSummary:
    'Gennoor Tech\'s AI ROI practice partners with CFOs, PMOs and investment committees to build, challenge and realise AI business cases. We bring sector-calibrated benchmarks for BFSI, manufacturing, healthcare and energy across GCC, Africa and South Asia, FinOps for AI tooling and value-realisation operators who stay engaged until the benefits hit the audited P&L.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Portfolio-level review of current AI business cases, benefits leakage and FinOps cost baselines against regional peer benchmarks.' },
    { phase: 'Train', action: 'CFO-office and PMO labs on the four ROI patterns, realisation factors, AI TCO modelling and audit-grade documentation.' },
    { phase: 'Innovate', action: 'Co-build two or three exemplar AI business cases end-to-end, including counterfactual design and risk-adjusted scenarios.' },
    { phase: 'Build', action: 'Stand up the value-realisation office, FinOps for AI controls, stage-gated funding model and benefits attestation cadence.' },
    { phase: 'Sustain', action: 'Quarterly value reviews with the CFO and audit committee, benchmark refresh and continuous improvement of the AI investment playbook.' },
  ],
}

// =====================================================================
// TRACK 4 — INDUSTRY
// =====================================================================

export const aiFinancialServices: CoursePdf = {
  slug: 'ai-in-financial-services',
  title: 'AI in Financial Services',
  subtitle: 'Production AI for banks, insurers and capital markets under RBI, SAMA, DFSA, EU AI Act.',
  track: 'industry',
  trackLabel: 'By Industry',
  audience:
    'BFSI leaders across India, GCC and Africa — bank CIOs/CTOs, heads of risk and compliance, chief data officers, fraud and AML heads, retail and SME banking heads, insurance digital leaders, capital markets COOs, payments and embedded finance product owners, RegTech/innovation leads at banks, NBFCs, takaful operators, asset managers and payment service providers.',
  duration: '2 days (16 hours)',
  pages: 64,
  requirements:
    'Working knowledge of core banking, lending, payments or insurance operations plus a basic grasp of model risk, KYC/AML obligations and the data your institution actually owns. No coding required, but bring one real use case (fraud, KYC, credit, claims, advisor copilot or RegTech) you want to ship in the next two quarters and the names of your core platform vendors, cloud provider and primary regulator(s) so labs map to live regulatory exposure.',
  outcomes: [
    'Classify any BFSI AI use case against EU AI Act Annex III, RBI FREE-AI Sutras (Aug 2025), SAMA AI Principles and Bank of England SS1/23 — and decide build, buy or block',
    'Stand up a model risk framework (inventory, tiering, validation, monitoring) aligned to SS1/23 and DFSA AI Survey 2025 expectations, including human-override on consequential decisions',
    'Design fraud + AML stacks combining streaming scoring (FICO Falcon, NICE Actimize, ComplyAdvantage) with LLM narrative explanations, sized to sub-200ms decisioning like HDFC\'s UPI flow',
    'Deploy advisor and contact-centre copilots using Microsoft Cloud for Financial Services, Azure OpenAI and Genesys with grounding, retrieval and policy-aligned guardrails — avoiding the Air Canada / Klarna failure pattern',
    'Build an Annex III-grade credit-scoring conformity dossier (data lineage, bias testing, documentation, deployer logs) ready for the 2 August 2026 EU deadline, applied also to RBI and SAMA reporting',
    'Run a 90-day RegTech automation programme (regulatory reporting, SAR drafting, complaints, open banking consent) with measurable cost, cycle-time and capture-rate KPIs',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 BFSI AI landscape and regulatory map',
      topics: [
        'Where banks actually shipped in 2025: HDFC sub-200ms scoring, ICICI EFRM, Emirates NBD + Microsoft + Genesys, Saudi National Bank and Al Rajhi enterprise GenAI, Absa Agentforce',
        'Annex III high-risk: credit scoring in, fraud detection out — and what that flip means for procurement',
        'RBI FREE-AI 7 Sutras, 6 pillars, 26 recommendations (Aug 13 2025) translated into board asks',
        'SAMA AI Principles, SDAIA, DFSA AI Risk regulatory college (May 2025), ADGM Enabling Tech Guidelines',
        'MAS FEAT principles and Bank of England SS1/23 (in force May 2024) — the new global baseline',
        'Regional readiness self-scoring against six pillars',
      ],
    },
    {
      number: '02',
      title: 'Model risk, governance and the Chief AI Officer mandate',
      topics: [
        'SS1/23 four principles: governance, inventory, development/validation, ongoing assessment',
        'Building the model inventory: tiering, owners, deployer vs provider duties under the EU AI Act',
        'Bias, drift, fairness and explainability for credit and pricing models — what regulators actually request',
        'Quarterly board AI report template (RBI-FREE AI style) and named CAIO/CDO accountability',
        'AI sandbox design: ground-truth datasets, red-team prompts, prod-blocking gates',
        'Lab: write a one-page model risk memo for a real internal use case against SS1/23',
      ],
    },
    {
      number: '03',
      title: 'Fraud, AML and financial crime AI',
      topics: [
        'Streaming + graph + LLM stacks: FICO Falcon, NICE Actimize, ComplyAdvantage, SAS, Featurespace',
        'Real-time scoring patterns (UPI, card, FAST, IPS, instant payments) with sub-second SLAs',
        'SAR/STR narrative drafting and quality control with LLMs (analyst-in-the-loop)',
        'Sanctions screening, adverse media, PEP — using ComplyAdvantage and similar against RBI/SAMA/FATF lists',
        'Mule account, APP fraud and synthetic identity detection',
        'Lab: design a fraud + AML reference architecture for a GCC retail bank and map controls to FATF + SAMA',
      ],
    },
    {
      number: '04',
      title: 'KYC, onboarding and customer identity',
      topics: [
        'Digital onboarding stacks: liveness, document AI, video KYC under RBI master directions and SAMA eKYC',
        'Perpetual KYC and risk re-scoring with model monitoring',
        'Vendor landscape: Onfido/Entrust, IDfy, Jumio, Microsoft Entra Verified ID',
        'Privacy and data residency: India DPDP Act, KSA PDPL, UAE PDPL, POPIA — and what they mean for foundation-model calls',
        'Account opening copilots and SME onboarding (Absa-style sub-5-minute account flows)',
        'Lab: KYC journey rebuild — current vs AI-accelerated, with regulator-facing audit trail',
      ],
    },
    {
      number: '05',
      title: 'Credit decisioning, pricing and Annex III compliance',
      topics: [
        'Building credit scorecards with ML + LLM feature narratives — and where the line is for natural-person scoring',
        'Annex III conformity assessment artefacts: data governance, technical documentation, logging, human oversight',
        'Alternative data (bank statement parsing, GST/PAYE, telco, Plaid open banking) with bias controls',
        'Embedded lending, BNPL and SME credit — Vise-style portfolio personalisation',
        'Pricing fairness, redlining, protected attributes across EU, India, GCC, Africa',
        'Lab: build an Annex III dossier outline for one credit product',
      ],
    },
    {
      number: '06',
      title: 'Advisor, contact centre and wealth copilots',
      topics: [
        'Microsoft Cloud for Financial Services, Azure OpenAI, Dynamics 365, Copilot Studio reference architectures',
        'Relationship-manager copilots (Absa pattern), wealth advisor copilots (Morgan Stanley / Vise pattern)',
        'Contact centre AI: Genesys + Amazon Polly / Azure Speech (Emirates NBD pattern), call summarisation, QA',
        'Guardrails: grounding, citations, refusal, supervisor handoff — designed against Air Canada and Klarna failure modes',
        'Multilingual coverage for GCC + Africa + South Asia (Arabic, Hindi, Swahili, isiZulu, Tagalog)',
        'Lab: design and storyboard an RM copilot, including escalation, logging and complaints handling',
      ],
    },
    {
      number: '07',
      title: 'Claims, underwriting and insurance AI',
      topics: [
        'Claims triage and FNOL automation (motor, health, travel, SME) — straight-through processing targets',
        'Underwriting copilots: medical underwriting summarisation, commercial-lines submission triage',
        'Fraud rings in insurance — graph + image AI for staged accidents and inflated repairs',
        'Takaful and IFRS 17 reporting acceleration with AI',
        'Reg posture: IRDAI India, SAMA Insurance Authority, CBUAE, FSCA South Africa',
        'Lab: redesign a motor claims journey with AI from FNOL to settlement, with regulator audit pack',
      ],
    },
    {
      number: '08',
      title: 'RegTech, open banking, embedded finance and 90-day roadmap',
      topics: [
        'Regulatory reporting AI: SARs, suspicious activity, regulatory returns, complaints (CRT-style)',
        'Open banking + embedded finance: Plaid, Account Aggregator (India), SAMA Open Banking Framework, UAE Open Finance',
        'Agentic patterns in BFSI: where to put humans in the loop (Absa\'s stance on critical decisioning)',
        'Vendor due diligence and concentration risk on foundation-model providers',
        'Capability uplift: who needs prompt skills, who needs governance training, who needs neither',
        'Lab: write a 90-day BFSI AI roadmap with budget, KPIs, regulator touchpoints and exec sponsor',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Loan Origination Agent pilot + Multimodal RAG for Banking — both in production within eight weeks against your regulator posture.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–10 weeks',
  aiEnablementSummary:
    'Gennoor Tech AI Enablement helps BFSI clients across India, GCC and Africa move from PoC to regulator-defensible production. We bring reference architectures for Microsoft Cloud for Financial Services, model-risk artefacts mapped to SS1/23, RBI FREE-AI and SAMA AI Principles, and shipped patterns from fraud, KYC, credit, claims and contact-centre programmes. We work alongside your CRO, CIO and Compliance — not around them.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: '4-week BFSI AI readiness audit covering use-case portfolio, model inventory, data residency, regulator exposure (RBI/SAMA/DFSA/CBUAE/FSCA), vendor concentration and skills gap.' },
    { phase: 'Train', action: 'Role-based learning paths for board, CRO, CCO, model validators, RMs and contact-centre supervisors — anchored in real institution case studies (HDFC, Emirates NBD, Absa, SNB).' },
    { phase: 'Innovate', action: 'Sandbox-led ideation against the six FREE-AI pillars; shortlist 5-8 use cases scored on regulator risk, ROI and time-to-impact.' },
    { phase: 'Build', action: 'Co-engineering pods deploy one production use case in 12 weeks with model risk artefacts, SS1/23-aligned validation and full audit trail, on your cloud of record.' },
    { phase: 'Sustain', action: 'AI Operations service: monitoring, drift, bias, complaints feedback loop, quarterly board pack, and continuous mapping to RBI, SAMA, DFSA, EU AI Act updates.' },
  ],
}

export const aiHealthcare: CoursePdf = {
  slug: 'ai-in-healthcare',
  title: 'AI in Healthcare',
  subtitle: 'Clinical AI from ambient scribe to imaging triage under FDA, EU AI Act, CDSCO, SDAIA.',
  track: 'industry',
  trackLabel: 'By Industry',
  audience:
    'Hospital CEOs and COOs, CMIOs and CMOs, hospital CIOs and CTOs, chief nursing informatics officers, digital health and transformation leaders, heads of radiology and pathology, pharmacy directors, quality and patient-safety leaders, health insurer and ministry-of-health digital leads across GCC, Africa and South Asia.',
  duration: '2 days (16 hours)',
  pages: 60,
  requirements:
    'Active involvement in clinical operations, hospital IT, digital health or health-system strategy. Familiarity with your EHR (Epic, Cerner/Oracle Health, Meditech, Bahmni, locally built), basic clinical workflow vocabulary and your jurisdiction\'s data-protection regime (HIPAA, GDPR, DPDP, KSA PDPL, UAE PDPL, POPIA). Bring one painful workflow (documentation burden, ED throughput, imaging backlog, discharge follow-up, prior auth, pharmacy) you want measurable improvement on within 6 months.',
  outcomes: [
    'Map any clinical AI use case to the right risk tier across FDA AI/ML SaMD TPLC (Jan 2025) + PCCP (Aug 2025), EU MDR + AI Act, India CDSCO Draft Guidance on Medical Device Software (Oct 21 2025) and SDAIA + MoH KSA guidance',
    'Deploy ambient documentation (Microsoft Dragon Copilot, Abridge, Suki, Augmedix) with measured minutes-saved-per-encounter, documentation quality and burnout deltas',
    'Stand up a PHI-sovereign 4-tier deployment pattern (on-prem, sovereign cloud, regional cloud, hyperscaler) and pick the right tier per use case and regulator',
    'Run a radiologist-first imaging AI programme (Aidoc, RapidAI, Annalise.ai) covering triage, worklist prioritisation, peer review and FDA-clearance hygiene',
    'Launch a safe patient-facing voice agent programme (Hippocratic AI pattern) for post-discharge follow-up, medication adherence and chronic care, with clinician escalation rules',
    'Build a hospital-grade AI governance committee, model inventory and incident-response playbook compatible with EU AI Act high-risk obligations and ISO 42001',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 clinical AI landscape and regulator map',
      topics: [
        'Where it actually shipped: Microsoft Dragon Copilot at 600+ orgs, 100,000+ clinicians, 3M+ monthly encounters (March 2025); Aidoc at ~2,000 hospitals; Hippocratic AI at UHS, University Hospitals, WellSpan',
        'Microsoft Cloud for Healthcare reference architecture in 2026',
        'Regulator stack: FDA AI/ML Action Plan, FDA Final PCCP Guidance (Aug 2025), EU MDR + AI Act high-risk health, India CDSCO SaMD Draft Guidance (Oct 21 2025), SDAIA + KSA MoH, UAE DoH/MoHAP, Singapore HSA AI-MD',
        'PHI sovereignty: 4 deployment tiers, residency rules (HIPAA, GDPR, DPDP, PDPL KSA/UAE, POPIA)',
        'Mistakes already made: chatbot liability (Air Canada style applied to triage), unsafe self-diagnosis advice, deskilling',
        'Self-scoring: where is our health system on the clinical AI maturity curve?',
      ],
    },
    {
      number: '02',
      title: 'Ambient clinical documentation — from pilot to enterprise',
      topics: [
        'Vendor landscape: Microsoft Dragon Copilot, Nuance/DAX legacy, Abridge, Suki, Augmedix, DeepScribe, Tortus',
        'Epic embedding (DAX Copilot GA in Epic), Oracle Health, Meditech integration patterns',
        'Measurement: 5+ minutes saved per encounter, 70% burnout reduction, 77% documentation quality uplift — and how to measure those locally',
        'Specialty considerations: primary care vs ED vs OB/GYN vs oncology vs paediatrics',
        'Consent, recording, multilingual coverage (Arabic, Hindi, Swahili, French for Francophone Africa)',
        'Lab: build a 12-week ambient-scribe rollout plan for one specialty with consent, training and KPI design',
      ],
    },
    {
      number: '03',
      title: 'Patient journey, triage and voice agents',
      topics: [
        'Hippocratic AI deployment patterns: UHS Summerlin and Texoma Medical Center post-discharge calls scoring 9.0/10',
        'Patient-facing voice agents: pre-visit prep, post-discharge follow-up, medication adherence, chronic care',
        'Symptom checkers and self-triage — what FDA, MHRA and CDSCO actually permit',
        'Escalation rules and the line AI must not cross (red-flag symptoms, mental-health crisis, paediatrics)',
        'Microsoft Cloud for Healthcare patient engagement, Salesforce Health Cloud Einstein',
        'Lab: design a post-discharge voice-agent script + escalation matrix for CHF and post-op orthopaedics',
      ],
    },
    {
      number: '04',
      title: 'Imaging, pathology and diagnostic AI',
      topics: [
        'Aidoc aiOS, RapidAI, Annalise.ai, Lunit, Qure.ai (especially active in India + Africa), Paige pathology',
        'Worklist triage vs CAD vs autonomous read — and why radiologist-first is non-negotiable',
        'FDA clearance landscape: 1000+ AI/ML-enabled devices, CDSCO Class C licensing for imaging AI',
        'Peer review, audit, second-read workflows and continuous learning under PCCP',
        'PACS/RIS integration, fairness across skin tones, scanner vendors, paediatric vs adult datasets',
        'Lab: build a radiology AI procurement scorecard — FDA/CDSCO status, integration, validation, sunset plan',
      ],
    },
    {
      number: '05',
      title: 'Pharmacy, operations and revenue-cycle AI',
      topics: [
        'Hospital operations: bed management, ED throughput, OR scheduling, staffing copilots',
        'Pharmacy: medication reconciliation, interaction checks, oncology dosing, antimicrobial stewardship',
        'Revenue cycle: coding (Microsoft Solventum/3M, Codametrix), prior authorisation, denials, claims appeals',
        'Supply chain and equipment maintenance — borrowing predictive-maintenance patterns from manufacturing',
        'KPIs that matter to the CFO: LOS, ALOS, denial rate, days in AR, no-show rate',
        'Lab: pick one ops use case and write a CFO-grade business case with sensitivity analysis',
      ],
    },
    {
      number: '06',
      title: 'PHI sovereignty, cloud and architecture',
      topics: [
        'The 4-tier deployment model: on-prem GPU pod, sovereign cloud, regional cloud, hyperscaler — pick by use case',
        'Azure OpenAI in Healthcare, Google Vertex AI, AWS HealthLake — what each region offers (KSA, UAE, India, South Africa)',
        'De-identification, synthetic data, federated learning for cross-site model improvement',
        'EHR integration: FHIR, HL7v2, SMART on FHIR, USCDI v4, India\'s ABDM',
        'Vendor due diligence: BAA equivalents, sub-processors, data-residency attestations',
        'Lab: map 5 of your use cases to the right deployment tier with explicit residency and consent rationale',
      ],
    },
    {
      number: '07',
      title: 'Governance, safety and the hospital AI committee',
      topics: [
        'AI governance committee charter: clinical, IT, legal, ethics, patient representative, CMIO chair',
        'Model inventory, intended use, validation, monitoring, sunset — the lifecycle artefacts FDA TPLC + PCCP expect',
        'Bias testing across age, gender, ethnicity, language, payer; equity audits',
        'Incident response: AI-related near-miss reporting, root cause, regulator notification (FDA MDR, MHRA, CDSCO)',
        'ISO 42001 hospital adoption pattern and links to ISO 27001 + Joint Commission / CBAHI / NABH',
        'Lab: write your AI governance committee charter and first 90-day backlog',
      ],
    },
    {
      number: '08',
      title: 'Workforce, change and the 6-month roadmap',
      topics: [
        'Clinician change: champions, super-users, time-of-day rollout, opt-out paths',
        'Nursing AI: documentation, vitals narration, discharge education, sepsis early warning',
        'Resident, fellow and student training — when to teach with AI, when to teach without',
        'Patient communication and equity: who gets the human, who gets the bot, informed consent',
        'Region-specific workforce considerations: GCC clinical migration, Africa task-shifting, South Asia volume pressure',
        'Lab: write a 6-month executable roadmap with three named use cases, owners, KPIs and budget',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Clinical Documentation Assistant pilot — ambient capture + signed-by-physician workflow deployed in one ward in six weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–8 weeks',
  aiEnablementSummary:
    'Gennoor Tech AI Enablement partners with hospitals, health systems, payers and ministries across GCC, Africa and South Asia to deploy clinical AI safely. We bring shipped reference patterns for ambient scribe, imaging triage, patient voice agents and revenue-cycle AI, mapped to FDA TPLC + PCCP, EU AI Act, India CDSCO and SDAIA/MoH guidance — with PHI residency designed in, not bolted on.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: '6-week clinical AI baseline: workflow shadowing, documentation-burden measurement, EHR readiness, PHI residency posture, regulator gap analysis (FDA/EU/CDSCO/SDAIA).' },
    { phase: 'Train', action: 'Role-based curricula for CMIO, CNIO, department chairs, residents, nursing leads, IT and compliance — using your own anonymised cases, not generic slides.' },
    { phase: 'Innovate', action: 'Sandboxed clinical pilots (ambient scribe, imaging triage, post-discharge voice) with measurable patient-safety and clinician-burnout KPIs locked before kickoff.' },
    { phase: 'Build', action: 'Production deployment with full SaMD/PCCP-style artefacts, FHIR integration, governance committee enablement and incident-response runbooks live from day one.' },
    { phase: 'Sustain', action: 'Ongoing model monitoring, equity audits, regulator-update watch (FDA, MHRA, CDSCO, SDAIA, EU AI Act) and a quarterly clinical-outcomes review with your CMIO.' },
  ],
}

export const aiManufacturing: CoursePdf = {
  slug: 'ai-in-manufacturing',
  title: 'AI in Manufacturing',
  subtitle: 'OT-grade AI for predictive maintenance, vision quality, safety and digital twins.',
  track: 'industry',
  trackLabel: 'By Industry',
  audience:
    'Plant managers, VPs and directors of manufacturing, plant operations and engineering directors, OT/ICS engineers, controls and automation leads, industrial engineering and CI/Lean leaders, quality directors, EHS leaders, plant CIOs and supply-chain ops leaders in discrete, process and hybrid manufacturing across GCC industrial cities, African industrial corridors and South Asian export hubs.',
  duration: '2 days (16 hours)',
  pages: 60,
  requirements:
    'Direct responsibility for plant performance, OT systems, quality, safety or industrial engineering at one or more sites. Working familiarity with your control stack (Siemens, Rockwell, Schneider, ABB, Emerson, Honeywell), SCADA/MES/historian (Aveva, GE Proficy, Ignition, OSIsoft PI) and your ISO 9001 / ISO 27001 / IEC 62443 posture. Bring one site, one line and one chronic problem (downtime, scrap, energy, safety, changeover) you want a measurable answer to.',
  outcomes: [
    'Translate any plant problem into the right industrial AI pattern (predictive maintenance, vision quality, process optimisation, safety, digital twin) and price it against true ROI, not vendor slideware',
    'Deploy predictive maintenance with sensor + LLM narrative explanations using Siemens Industrial Copilot, Schneider EcoStruxure Foresight, GE Digital Predix, Rockwell FactoryTalk and Azure Industrial IoT — and measure MTBF, MTTR and unplanned downtime deltas',
    'Stand up a closed-loop vision-quality programme (Cognex VisionPro Deep Learning, Rockwell FactoryTalk Analytics VisionAI, Landing AI) with an operator-in-the-loop labelling pipeline',
    'Apply OT/IT bridge controls (IEC 62443 zones and conduits, ISO 27001, NIST CSF) so industrial AI never weakens the line, the OEE or the safety case',
    'Build an AI management system aligned to ISO 42001 (Dec 2023, scaling adoption through 2025-26), interlocked with ISO 9001 and ISO 45001, ready for customer and Lighthouse-style audits',
    'Replicate WEF Global Lighthouse Network outcomes locally — 41% defect reduction, 28% energy reduction, 44% cycle-time cuts — at one named line in six months',
  ],
  modules: [
    {
      number: '01',
      title: 'Industrial AI in 2026 — what actually shipped',
      topics: [
        'WEF Global Lighthouse Network 2025: 201 sites, 50% of top use cases now AI/GenAI-enabled, 41% defect cut, 28% energy cut, 44% cycle-time cut',
        'Siemens Industrial Copilot at 100+ companies (Schaeffler, thyssenkrupp, Siemens Erlangen); 120,000+ engineers',
        'Schneider EcoStruxure Foresight; Rockwell FactoryTalk Analytics VisionAI; GE Digital; Aveva',
        'Microsoft Azure Industrial IoT, Azure Arc-enabled data services, OPC UA standardisation',
        'Industry 4.0 to 5.0 framing — human-centric, resilient, sustainable manufacturing',
        'Self-scoring: plant AI maturity against Lighthouse use-case patterns',
      ],
    },
    {
      number: '02',
      title: 'OT/IT bridge, cybersecurity and the safety case',
      topics: [
        'Purdue model in 2026 and where AI workloads actually sit (Level 2-3, edge, DMZ, cloud)',
        'IEC 62443 zones and conduits, ISO 27001, NIST CSF, NIS2 echoes in GCC/Africa',
        'The line nobody crosses: AI must never silently override an interlock, an E-stop or a permit-to-work',
        'Edge vs cloud inference: latency, determinism, fail-safe defaults',
        'OT data engineering: historian, unified namespace, MQTT Sparkplug B',
        'Lab: draw your plant\'s Purdue diagram with AI workloads, security zones and fail-safe defaults',
      ],
    },
    {
      number: '03',
      title: 'Predictive maintenance — sensor + LLM narrative',
      topics: [
        'Vibration, current, thermal, acoustic, oil — and what each actually predicts',
        'Reference stacks: Siemens Industrial Copilot Maintenance, Schneider EcoStruxure Foresight, GE Digital APM, Aveva PI System + ML, Azure IoT + Azure ML',
        'LLM narratives over alerts: not "bearing 3 anomaly" but "X-bearing showing early outer-race wear, schedule with Y SKU within 14 days"',
        'Failure-mode taxonomy reused from FMEA — AI doesn\'t replace reliability engineering, it amplifies it',
        'Holcim, thyssenkrupp and Eaton Changzhou case patterns',
        'Lab: pick one critical asset, design the sensor + model + narrative + workorder loop end-to-end',
      ],
    },
    {
      number: '04',
      title: 'Vision-quality AI with the operator in the loop',
      topics: [
        'Cognex VisionPro Deep Learning, Rockwell FactoryTalk Analytics VisionAI, Landing AI, Keyence, Basler-based stacks',
        'Defect detection vs classification vs measurement — different problems, different data',
        'The operator labelling loop: how line operators become the labelling team, and why that is the differentiator',
        'Closed-loop quality control with Logix PLCs, ASEM IPC, OPC UA — Rockwell-style integration',
        'ISO 9001 + CAPA: how AI findings feed nonconformance and corrective action',
        'Lab: design a vision-AI pilot for one defect type with data plan, labelling cadence and rollback criteria',
      ],
    },
    {
      number: '05',
      title: 'Process optimisation, energy and sustainability',
      topics: [
        'Soft sensors and APC augmentation in process plants (cement, chemicals, F&B, pharma)',
        'Energy and scope 1+2 reduction (Lighthouse cohort sees 30-50% Scope 1+2 cuts) — AI for boilers, compressors, HVAC, kilns',
        'Yield, throughput and OEE uplift — and why "AI improved OEE" without baselining is fraud',
        'Schedule optimisation, changeover reduction and bottleneck breakouts',
        'Carbon accounting integration (CBAM, KSA Vision 2030 sustainability, India BRSR)',
        'Lab: build a 90-day energy-AI business case with baseline, hypothesis, intervention and measurement plan',
      ],
    },
    {
      number: '06',
      title: 'Safety AI and the line nobody crosses',
      topics: [
        'Vision-based PPE, exclusion-zone, ergonomic and near-miss detection (Intenseye, Protex AI, Siemens, AWS Lookout)',
        'OSHA AI safety guidance, ISO 45001 integration, GCC HSE expectations, India DISH',
        'What AI may flag, recommend, alert — and what only a human or interlock may stop',
        'Worker consent, surveillance ethics, union and works-council engagement (especially in EU-headquartered MNCs)',
        'Incident learning loops — AI as the memory of the plant',
        'Lab: write a safety-AI deployment policy that union reps and your EHS lead would actually sign',
      ],
    },
    {
      number: '07',
      title: 'Digital twin, simulation and supply chain integration',
      topics: [
        'Pragmatic digital twin: asset twin, line twin, plant twin — never start with "factory twin"',
        'Siemens Xcelerator, NVIDIA Omniverse, Aveva, Dassault 3DEXPERIENCE, Microsoft Azure Digital Twins',
        'Simulation-led design and what-if analysis under demand volatility, tariffs and supply shocks',
        'Plant-floor to S&OP: how shop-floor signals improve supply plans (and vice versa)',
        'Where digital twins fail: data drift, model decay, ownership ambiguity between IT, OT and engineering',
        'Lab: scope one digital-twin slice you could deliver in 90 days (not 3 years) with a clear ROI gate',
      ],
    },
    {
      number: '08',
      title: 'ISO 42001, ISO 9001 interlock and the 6-month site plan',
      topics: [
        'ISO 42001 AIMS structure: policy, roles, AI impact assessment, supplier oversight, monitoring',
        'Interlocking ISO 42001 with ISO 9001 (quality), ISO 27001 (security), IEC 62443 (OT security), ISO 45001 (safety)',
        'Skills: who learns what — operators, supervisors, controls engineers, plant managers, plant CIOs',
        'Vendor risk: hyperscaler, copilot vendor, model vendor, integrator — and how to avoid lock-in on the plant floor',
        'Lighthouse-style governance: weekly cadence, monthly steering, quarterly board pack',
        'Lab: write a 6-month site AI plan with named use cases, owners, KPIs, ISO 42001 controls and exec sponsor',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Predictive Maintenance pilot — sensor + narrative deployment on one critical equipment in eight weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–8 weeks',
  aiEnablementSummary:
    'Gennoor Tech AI Enablement helps manufacturers across GCC industrial zones, African industrial corridors and South Asian export hubs move from PoC to Lighthouse-grade outcomes. We bring shipped patterns for predictive maintenance, vision quality, energy and safety AI on Siemens, Schneider, Rockwell, GE and Microsoft Azure Industrial IoT — engineered into your OT stack, not bolted on, and audited against ISO 42001, ISO 9001 and IEC 62443.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: '4-week site diagnostic: asset criticality, OT data readiness (historian, MQTT, OPC UA), OEE baseline, defect Pareto, energy profile, ISO 9001/27001/45001 gap.' },
    { phase: 'Train', action: 'Layered learning for operators (labelling + alerts), supervisors (workorders + RCA), engineers (model lifecycle) and plant leadership (ROI + governance) using your own assets.' },
    { phase: 'Innovate', action: '2-day site workshop to prioritise 3-5 use cases against Lighthouse-style scoring (defects, energy, cycle time, safety, throughput) with go/no-go thresholds.' },
    { phase: 'Build', action: '90-day production pilot on one line with sensor + model + narrative + workorder + closed-loop integration, IEC 62443-zoned, fail-safe defaults verified.' },
    { phase: 'Sustain', action: 'ISO 42001-aligned AI management system, drift and bias monitoring, monthly site review, multi-site replication playbook and yearly readiness against WEF Lighthouse criteria.' },
  ],
}

export const aiGovernment: CoursePdf = {
  slug: 'ai-in-government',
  title: 'AI in Government & Public Sector',
  subtitle: 'Build sovereign, citizen-grade AI services that pass regulator and public-trust scrutiny.',
  track: 'industry',
  trackLabel: 'By Industry',
  audience:
    'Public sector CIOs, ministry of digital transformation officials, GovTech programme directors, central bank and regulator technology leads, smart-city programme owners, public sector transformation consultants across GCC (Saudi NTP, UAE Government Experience, Oman Vision 2040), India (MeitY, state IT secretariats, NIC) and Africa (Nigeria NITDA, Kenya Ministry of ICT, Rwanda MINICT, South Africa DCDT).',
  duration: '2 days (16 hours)',
  pages: 60,
  requirements:
    'Sitting decision-makers or senior advisors inside a public entity with at least one live or planned AI use case (chatbot, case management, fraud, eligibility, or document automation). A working understanding of cloud procurement, data-classification regimes and at least one national digital identity stack (UAE Pass, Nafath/Absher, DigiLocker, Smart Africa Trust Alliance) is expected. No coding background required, but bring a real ministry or agency challenge to the labs.',
  outcomes: [
    'Map any candidate citizen-service use case to SDAIA AI Ethics Principles (2023, updated 2025) and UAE Charter for the Development and Use of AI, classifying risk before procurement',
    'Produce a sovereign deployment pattern (data residency, key custody, model-hosting topology) that satisfies the Saudi Cloud Computing Regulatory Framework Level C / UAE Information Assurance Standards / India DPDPA data localisation rules',
    'Design a FOI-grade explainability layer for a case-management copilot, including decision logs, citation back to source documents and citizen appeal pathway',
    'Stand up a multilingual citizen channel (Arabic dialect + MSA, Swahili, Tamil, Bengali) with code-switching handling and a cultural-safety eval set',
    'Run a public-sector AI procurement using SDAIA\'s AI Adoption Framework and India AI Governance Guidelines (Nov 2025), including model cards, third-party audit clauses and exit rights',
    'Operationalise a public-trust framework: bias audits, citizen feedback loop, parliamentary/cabinet reporting cadence and an incident-disclosure protocol aligned with EU AI Act Annex III obligations for entities serving EU residents',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 sovereign AI landscape for governments',
      topics: [
        'Vision 2030, UAE Centennial 2071, IndiaAI Mission, Smart Africa AI Blueprint side-by-side',
        'SDAIA, DGA, UAE AI Office, MeitY, NITDA: who owns what',
        'National compute (HUMAIN, G42/Core42, Yotta Shakti, Cassava) and what that changes for ministries',
        'Sovereign-cloud reality: Microsoft Cloud for Sovereignty in KSA/UAE, Oracle Sovereign Cloud, AWS European Sovereign Cloud as a reference pattern',
        'The five public-trust failure modes from 2024-2026 (Dutch toeslagenaffaire, Robodebt, UK PIP) and what they teach',
      ],
    },
    {
      number: '02',
      title: 'Regulators, ethics and the rule book you cannot ignore',
      topics: [
        'SDAIA Principles and Controls for AI Ethics: integrity, accountability, transparency, social benefit',
        'UAE Charter for the Development and Use of AI (12 principles) and the CEO-for-AI mandate',
        'India AI Governance Guidelines (Nov 2025): seven principles, AIGG, AISI, techno-legal approach',
        'DPDPA implementing rules (Nov 2025, compliance May 2027), Saudi PDPL, UAE Federal Decree-Law 45 of 2021',
        'EU AI Act Annex III high-risk use cases relevant to public services and extraterritorial reach',
        'Singapore Model AI Governance Framework v2 and Nigeria National AI Strategy as cross-reference models',
      ],
    },
    {
      number: '03',
      title: 'Sovereign data and model architecture patterns',
      topics: [
        'Data classification: open, internal, confidential, top-secret — what each allows',
        'Three reference topologies: in-country sovereign region, government-only landing zone, hybrid air-gapped inference',
        'Key custody (HSM, BYOK, HYOK) and the SDAIA Level C / TDRA UAE-IA mapping',
        'Foundation model choice: GPT-4.1/5 on Azure Government parity, Claude in AWS GovCloud-equivalent, ALLaM, Falcon, Sarvam, Jais, Inkuba — when each is defensible',
        'Retrieval over sovereign corpora: ministry document lakes, DigiLocker, ESTA-equivalent citizen records',
        'Logging, audit trail and the "show your work" requirement for inspectors-general',
      ],
    },
    {
      number: '04',
      title: 'Citizen services and case-management copilots',
      topics: [
        'From chatbot to copilot: triage, drafting, eligibility pre-check, citizen letter generation',
        'FOI-grade explainability: citation to source clause, version of policy used, human approver of record',
        'Worked architecture: Saudi Absher-style case routing with a Claude/GPT case-summary co-author and a confidence threshold for human escalation',
        'Eligibility AI without the Robodebt pattern: deterministic rule layer + LLM explainer, never the other way around',
        'Appeal pathway design and the "right to a human reviewer" baked into the UX',
      ],
    },
    {
      number: '05',
      title: 'Multilingual delivery for real GCC, Africa and South Asia citizens',
      topics: [
        'Modern Standard Arabic vs Gulf, Najdi, Egyptian, Maghrebi: where models still break',
        'Swahili (Kenya, Tanzania), Hausa, Amharic, Yoruba: data scarcity and Cassava/InstaDeep efforts',
        'Tamil, Bengali, Hindi, Telugu: BharatGen, AI4Bharat IndicTrans3, Sarvam-1',
        'Code-switching reality: Arabic-English, Hindi-English, Swahili-English in the same citizen utterance',
        'Building a cultural-safety eval set: honour, family, religion, gender; failure cases by region',
        'Voice and accessibility for low-literacy users (IVR + LLM + TTS in dialect)',
      ],
    },
    {
      number: '06',
      title: 'Procurement, vendor risk and contracting AI in government',
      topics: [
        'SDAIA AI Adoption Framework: AI offices in 23 KSA entities and what they request from vendors',
        'Standard clauses: model lineage disclosure, training-data attestations, red-team evidence, exit and portability',
        'Pilot-to-scale gate criteria, success metrics and sunset triggers',
        'Working with hyperscalers and sovereign partners (G42/Core42, HUMAIN, Yotta, Cassava, MainOne)',
        'Avoiding lock-in: open-weight fallback strategy and prompt portability',
        'Lab: rewrite a real RFP from a participant ministry against SDAIA + DPDPA criteria',
      ],
    },
    {
      number: '07',
      title: 'Identity, integration and the digital public infrastructure stack',
      topics: [
        'UAE Pass, Nafath, Absher, DigiLocker, eSignet, Smart Africa Trust Alliance: integration patterns',
        'Aadhaar / National ID consent flows under DPDPA notice-and-consent',
        'Cross-border data flows: GCC adequacy, India SCC analogue, AU Malabo Convention',
        'Government-to-government data sharing with an LLM in the middle',
        'DPI + AI: India Stack lessons (UPI, ONDC, DEPA) applied to ministry workflows',
      ],
    },
    {
      number: '08',
      title: 'Public trust, evaluation and the audit you will face',
      topics: [
        'Standing up a bias and fairness audit cadence (red team, blue team, parliamentary committee)',
        'Citizen feedback loop: complaint channel, ombudsman integration, public dashboard',
        'Incident classification and disclosure: when to notify SDAIA, DGA, CERT-In, NITDA',
        'Annual AI register, model cards and the public version vs the classified version',
        'Capstone lab: each participant defends a sovereign deployment plan to a mock ministerial review panel',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Citizen Services Copilot pilot — multilingual government chatbot deployed against a real service in six weeks under sovereignty constraints.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–8 weeks',
  aiEnablementSummary:
    'Gennoor Tech AI Enablement helps GCC, African and South Asian public entities turn national AI strategies into deployed citizen services without breaching SDAIA, DGA, DPDPA or UAE Charter obligations. We bring sovereign architecture patterns validated on Microsoft Cloud for Sovereignty, Core42, HUMAIN and Yotta, plus a public-trust playbook tested against EU AI Act Annex III. Our delivery is bilingual end-to-end (Arabic/English, Hindi/English, French/English, Swahili/English) with cultural-safety evaluation built in.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Map your ministry\'s portfolio against SDAIA Principles, UAE Charter or India AI Governance Guidelines; classify each use case by risk tier and data sensitivity; produce a sovereign-readiness scorecard.' },
    { phase: 'Train', action: 'Upskill the CEO-for-AI, Responsible AI Officer and ministry AI office on regulator-aligned patterns; certify a core team on sovereign deployment and FOI-grade explainability.' },
    { phase: 'Innovate', action: 'Run citizen-journey discovery sprints, prioritise three to five copilot use cases with measurable trust and throughput gains, prototype in a sandboxed sovereign environment.' },
    { phase: 'Build', action: 'Deliver the production copilot on Microsoft Cloud for Sovereignty, Core42 or in-country government cloud, integrated with UAE Pass, Nafath, DigiLocker or Smart Africa identity rails, with full audit logging.' },
    { phase: 'Sustain', action: 'Run quarterly fairness and bias audits, maintain the AI register, train the next cohort of civil servants and report against Vision 2030 / UAE 2031 / IndiaAI Mission KPIs.' },
  ],
}

export const aiEducation: CoursePdf = {
  slug: 'ai-in-education',
  title: 'AI in Education',
  subtitle: 'Deliver adaptive learning, faculty copilots and integrity-safe assessment across schools, universities and EdTechs.',
  track: 'industry',
  trackLabel: 'By Industry',
  audience:
    'University vice-chancellors, deans, CIOs of higher-education institutions, EdTech founders and product leaders, K-12 superintendents, ministry of education programme directors, NEP 2020 / Saudi Education 2030 / UAE Education Strategy implementation teams, learning-design heads, and faculty-development chairs across India (UGC, AICTE, CBSE, state boards), GCC (MoE KSA, MoE UAE, ADEK, Etec) and Africa (Kenya MOE, Nigeria FME, South Africa DBE).',
  duration: '2 days (16 hours)',
  pages: 56,
  requirements:
    'Decision-makers (or directly empowered programme owners) inside an education provider with at least one stated ambition — adaptive learning, faculty workload reduction, learner support, or assessment reform. Familiarity with your institution\'s LMS (Canvas, Moodle, Blackboard, Open edX, NPTEL/SWAYAM, or proprietary) and SIS is helpful. Bring an anonymised cohort dataset and one assessment artefact (rubric, exam paper, project brief) to the labs.',
  outcomes: [
    'Architect a personalised learning loop using a foundation-model tutor (Claude, GPT-4.1/5, Gemini, AI4Bharat Sarvam-1) plus a learning-record store, with explicit human-in-the-loop checkpoints',
    'Map use cases against the UNESCO AI Competency Frameworks for Students and Teachers (2024), Singapore EduTech AI Guidelines, NEP 2020 and the UAE School AI Charter',
    'Redesign three assessment types (exam, essay, project) so they remain valid and authentic when learners have unlimited model access — and explain what AI-detection tools can and cannot do',
    'Operationalise an EdTech procurement checklist covering FERPA / GDPR / DPDPA / POPIA, vendor model-training opt-out, child-data safeguards, and accessibility (WCAG 2.2 + EN 301 549)',
    'Deploy a multilingual tutor (Arabic, Hindi, Tamil, Swahili, Yoruba, Bahasa) using IndicTrans3, Sarvam-1, ALLaM, Jais, Inkuba or Falcon, with a cultural-and-religious safety eval',
    'Stand up an institutional AI policy: a faculty contract on appropriate use, an academic-integrity protocol, a learner consent flow, and a quarterly impact review',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 AI-in-education landscape',
      topics: [
        'From Khanmigo, Coursera Coach and Duolingo Max to faculty copilots in your LMS',
        'Generative AI inside Canvas, Moodle 5, Blackboard Ultra, Google Classroom, Microsoft Education',
        'India: NEP 2020 + DIKSHA + Sarvam-1 + AI4Bharat + IIT Bombay Vyom + UGC AI guidelines (Sep 2025)',
        'GCC: Saudi NTP education pillar, UAE School AI Charter (Mar 2025), KHDA AI-positive schools',
        'Africa: Kenya DigiSchool, Rwanda Smart Classrooms, Nigeria National Education Data System',
        'What works after two years of evidence (Stanford CRAFT, Carnegie LearnLab, OECD AI-in-Ed 2025 report)',
      ],
    },
    {
      number: '02',
      title: 'Adaptive learning and the personalised tutor pattern',
      topics: [
        'Reference architecture: tutor LLM + skill model + learning-record store + nudge engine',
        'The Bloom 2-sigma question revisited with 2026 evidence',
        'Diagnostic, formative and adaptive paths — and where each breaks',
        'Worked example: building a NEET / SAT / Tawjihi prep copilot with a tight syllabus retrieval layer',
        'Avoiding the dependency trap: scaffolding withdrawal protocols',
        'Lab: prototype a tutor for a single topic from a participant\'s curriculum',
      ],
    },
    {
      number: '03',
      title: 'Faculty copilots and campus operations',
      topics: [
        'Lesson-plan and rubric drafting, OBE alignment, NEP 2020 / NEP-style learning-outcome mapping',
        'Workload reduction: feedback first-draft, grading triage, syllabus modernisation',
        'Admissions and student-success copilots (UCAS-style, CommonApp, KUCCPS, Mawhiba scholarship)',
        'Scheduling, timetabling and facilities AI; ABC LMS / SLCM integrations',
        'Faculty-development programme design: certifying staff before they teach with AI',
      ],
    },
    {
      number: '04',
      title: 'Academic integrity and authentic assessment',
      topics: [
        'Why AI-detection tools (GPTZero, Turnitin AI, Originality.ai) have unacceptable false-positive rates in 2026',
        'Redesigning three assessment archetypes (exam, essay, project) for the AI era',
        'Oral defences, viva voce, process portfolios, in-class supervised assessment',
        'The "AI-resistant by design" vs "AI-permissible with disclosure" continuum',
        'Drafting an academic-integrity policy that faculty, students and parents can sign',
      ],
    },
    {
      number: '05',
      title: 'Multilingual and culturally-grounded delivery',
      topics: [
        'Hindi, Tamil, Bengali, Marathi, Telugu, Kannada via AI4Bharat IndicTrans3 and Sarvam-1',
        'Arabic (MSA + dialects) via ALLaM, Jais, Falcon and Mistral Arabic variants',
        'Swahili, Yoruba, Amharic via Inkuba, AfroLLaMA, Lelapa',
        'Code-switching reality in Indian, GCC and African classrooms',
        'Religious-and-cultural safety eval sets (Islamic, Hindu, Christian, secular contexts)',
        'Accessibility: WCAG 2.2 AA, EN 301 549, and learners with disabilities',
      ],
    },
    {
      number: '06',
      title: 'Data protection, child safety and EdTech procurement',
      topics: [
        'DPDPA child-data provisions (under-18 verifiable parental consent), FERPA, COPPA, GDPR Art 8',
        'Saudi PDPL, UAE FDL 45/2021, POPIA, Nigeria NDPA — the matrix for cross-border EdTech',
        'Vendor due diligence: model-training opt-out, deletion SLA, region pinning, audit clauses',
        'Open-source and open-weight models for sovereignty (Sarvam, Falcon, ALLaM, Gemma)',
        'Lab: rewrite a participant institution\'s EdTech RFP against this checklist',
      ],
    },
    {
      number: '07',
      title: 'Measuring learning impact (not vanity metrics)',
      topics: [
        'Outcomes that count: mastery growth, retention, equity gap, time-to-competence, employability',
        'A/B and stepped-wedge designs for AI tutor rollouts',
        'NEP 2020 PARAKH alignment, OECD PISA AI literacy assessment items (Dec 2025)',
        'Faculty satisfaction, learner agency, parent trust — measuring the soft outcomes',
        'Quarterly impact review template aligned with UNESCO AI Competency Framework',
      ],
    },
    {
      number: '08',
      title: 'Institutional AI policy and capstone',
      topics: [
        'Drafting the faculty AI contract, learner code of conduct, parent communication',
        'AI committee charter — who chairs, who decides, who reports',
        'Incident response: misuse, hallucination harm, data leak, exam-integrity breach',
        'Capstone: each participant presents a one-year sequenced AI roadmap for their institution',
        'Peer review against UNESCO Framework and DPDPA / FERPA / GDPR criteria',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Education Tutoring Assistant pilot — adaptive learning copilot for one course / one cohort in six weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–8 weeks',
  aiEnablementSummary:
    'Gennoor Tech AI Enablement helps universities, K-12 networks, ministries and EdTechs deploy classroom-grade AI without sacrificing integrity, child safety or pedagogy. We bring tutor-architecture patterns, faculty-copilot deployments and assessment-redesign playbooks tested across NEP 2020, UAE School AI Charter and UNESCO AI Competency Frameworks. Our delivery is multilingual end-to-end (Arabic, Hindi, Tamil, Bengali, Swahili, English) with cultural-safety evaluation built in.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Audit your institution\'s curriculum, LMS, SIS, learner data and faculty readiness; classify candidate use cases by impact and risk; produce an AI-in-education readiness scorecard.' },
    { phase: 'Train', action: 'Upskill faculty, learning designers and academic leadership on tutor patterns, prompt craft, assessment redesign and integrity protocols; certify a core cohort.' },
    { phase: 'Innovate', action: 'Run cohort-level discovery sprints, prioritise two to three high-impact copilots (tutor, faculty workload, admissions, learner success), prototype with real cohort data.' },
    { phase: 'Build', action: 'Deliver production copilots integrated with your LMS / SIS, with multilingual support, accessibility and child-data safeguards built in, plus a full impact-measurement layer.' },
    { phase: 'Sustain', action: 'Run quarterly impact reviews against UNESCO and ministry KPIs, refresh faculty certification, manage your AI policy, and scale wins to the next cohort or campus.' },
  ],
}

// =====================================================================
// TRACK 5 — BUILDER
// =====================================================================

export const promptEngineering: CoursePdf = {
  slug: 'prompt-engineering-practitioners',
  title: 'Prompt Engineering for Practitioners',
  subtitle: 'Build production-grade prompts with structured outputs, tool use, eval harnesses and Claude 4 / GPT-5 patterns.',
  track: 'builder',
  trackLabel: 'Builder',
  audience:
    'Software engineers, AI engineers, ML engineers, applied data scientists, analytics engineers, technical PMs and senior power users shipping LLM features into production. Strongest fit for teams who have moved past prototypes and are now answering questions about reliability, eval, cost and regression — and who want a vendor-neutral grounding across Claude 4.5/4.7, GPT-5, Gemini 2.5 Pro and the open Llama 4 / Qwen 3 stack.',
  duration: '2 days (16 hours)',
  pages: 52,
  requirements:
    'Working fluency in Python or TypeScript and an LLM API key (Anthropic, OpenAI, Azure OpenAI, Vertex or Bedrock). Bring an existing prompt or feature you want to harden — even a buggy one — plus a small representative dataset (50–200 examples). Familiarity with Git and basic CI is assumed; deep ML background is not.',
  outcomes: [
    'Apply the 2026 Anthropic and OpenAI prompting playbooks (constitutional grounding, XML structuring, prefilling, role priming) and explain why each works',
    'Design prompts that return reliable structured outputs using JSON mode, OpenAI Structured Outputs, Anthropic tool-use schemas and Pydantic / Zod validation',
    'Implement safe tool use and agentic loops with explicit budgeted steps, deterministic guards and failure-mode handling',
    'Build a regression-grade eval harness (golden set, LLM-as-judge, deterministic asserts) wired into CI with Promptfoo, Inspect AI or Braintrust',
    'Version prompts as code with semantic versioning, A/B rollout, shadow comparison and one-click rollback',
    'Optimise token spend and latency using prompt caching (Anthropic), context caching (Gemini), batching and small-to-large routing without losing quality',
  ],
  modules: [
    {
      number: '01',
      title: 'Foundations — what changed in 2025-2026',
      topics: [
        'Frontier model map: Claude 4.5/4.7 (Opus/Sonnet/Haiku), GPT-5, Gemini 2.5 Pro/Flash, Llama 4 Scout/Maverick, Qwen 3',
        'Reasoning models (o3, Claude Opus thinking, Gemini Thinking) and when latency/cost flips',
        'Native multimodal: image, audio, video, code interpreter, computer use',
        'Why "prompt engineering is dying" is wrong — and where it has actually moved (eval and context)',
      ],
    },
    {
      number: '02',
      title: 'The core prompting toolkit',
      topics: [
        'Anthropic 2026 patterns: role, task, context, examples, format, constraints — and XML tags for separation',
        'OpenAI 2026 patterns: developer messages, instruction hierarchy, response_format, reasoning_effort',
        'Few-shot, chain-of-thought, self-ask, plan-then-execute, ReAct — what each costs and when each pays',
        'Prefilling assistant turns, output stubbing, and forced JSON',
        'Anti-patterns: instruction drift, prompt bloat, "trust me bro" reasoning',
      ],
    },
    {
      number: '03',
      title: 'Structured outputs that don\'t break',
      topics: [
        'OpenAI Structured Outputs (strict mode), Anthropic tool_use JSON schema, Gemini responseSchema',
        'Pydantic v2 / Zod / Outlines / Instructor — wrapping the LLM in a typed interface',
        'Constrained decoding vs post-hoc validation — trade-offs',
        'Recovery patterns: schema-repair retry, JSON-mode fallback, partial parse',
        'Lab: convert a brittle string-parse pipeline into a typed-output service with 0 parse errors over 1k samples',
      ],
    },
    {
      number: '04',
      title: 'Tool use, function calling and lightweight agents',
      topics: [
        'Tool-schema design: naming, descriptions, parameter contracts that actually get called correctly',
        'Anthropic parallel tool use, OpenAI parallel function calling, Gemini function calling',
        'Bounded agentic loops: max_steps, hard timeouts, cost budgets, deterministic checkpoints',
        'MCP (Model Context Protocol) servers as a portability layer for tools',
        'Lab: build a research-and-summarise agent with two tools, a 5-step budget and a safety guard',
      ],
    },
    {
      number: '05',
      title: 'Context engineering and retrieval',
      topics: [
        'Why context engineering matters more than clever wording in 2026',
        'Long-context realities (200k–2M) and the lost-in-the-middle effect',
        'Retrieval that actually helps: chunking, hybrid (BM25 + dense), reranking with Cohere Rerank 3.5 / bge-reranker',
        'Anthropic Contextual Retrieval (Sep 2024) and the 49% reduction in retrieval failure',
        'Prompt caching (Anthropic) and context caching (Gemini): when to use, what they cost',
      ],
    },
    {
      number: '06',
      title: 'Evaluation as a first-class engineering activity',
      topics: [
        'Building a golden set: 50 / 200 / 1000 example tiers, labelling protocol, inter-rater agreement',
        'Deterministic asserts (exact-match, schema-valid, contains, regex)',
        'LLM-as-judge with rubric prompts, position bias mitigation and judge calibration',
        'Promptfoo, Inspect AI, Braintrust, LangSmith — picking the right harness',
        'Wiring evals into CI: regression gates, score deltas, flake detection',
      ],
    },
    {
      number: '07',
      title: 'Prompt versioning, A/B testing and observability',
      topics: [
        'Prompts as code: SemVer, monorepo layouts, code review for prompt diffs',
        'Shadow traffic, A/B rollout, multi-armed bandit prompt selection',
        'Tracing with LangSmith / Helicone / Langfuse / Arize Phoenix',
        'Hallucination, refusal-rate and drift dashboards',
        'Rollback patterns and prompt-incident response',
      ],
    },
    {
      number: '08',
      title: 'Cost, latency, safety and capstone',
      topics: [
        'Small-to-large routing (Haiku → Sonnet → Opus, Flash → Pro), distillation, batching',
        'Streaming, partial responses, speculative decoding implications',
        'Red-teaming prompts: prompt injection, jailbreaks, sensitive-content evals',
        'Guardrails: Llama Guard 3, NeMo Guardrails, Anthropic\'s safety hierarchy',
        'Capstone: harden one participant prompt — eval harness in CI, structured output, cost-tier routing',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Prompt Engineering Workshop — three-day developer bootcamp using your actual application as the working dataset.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '3-day workshop + 2 weeks',
  aiEnablementSummary:
    'Gennoor Tech AI Enablement takes engineering teams from prompt-tinkering to shipped, observable, regression-tested LLM features. We bring vendor-neutral patterns proven across Claude, GPT and Gemini, plus the eval-and-rollout infrastructure your platform team can actually maintain. Expect prompts that survive model upgrades, structured outputs that don\'t break parsers, and a cost curve you can defend in finance review.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Audit your live prompts, traces and incidents; identify the top three reliability, cost and latency risks; benchmark current outputs against a baseline golden set.' },
    { phase: 'Train', action: 'Run this 2-day Practitioner course for your engineers, then certify two leads on the eval-and-deploy workflow so the practice survives beyond delivery.' },
    { phase: 'Innovate', action: 'Prototype three improved prompt-and-pipeline patterns (structured output, tool use, retrieval) against your real traffic and pick the winner on hard metrics.' },
    { phase: 'Build', action: 'Ship the winning patterns into production with prompt-as-code, CI eval gates, tracing and prompt caching; integrate with your existing platform stack.' },
    { phase: 'Sustain', action: 'Stand up the weekly eval review, drift dashboard and incident playbook; coach your team through the first three model upgrades so quality and cost stay in your favour.' },
  ],
}

export const copilotStudio: CoursePdf = {
  slug: 'building-ai-agents-copilot-studio',
  title: 'Building AI Agents with Copilot Studio',
  subtitle: 'Design, ship and govern enterprise-grade agents with Copilot Studio, Dataverse, MCP and the agent ALM stack.',
  track: 'builder',
  trackLabel: 'Builder',
  audience:
    'Power Platform makers, solution architects, Copilot Studio admins, Dynamics 365 functional leads, Microsoft 365 architects and CoE managers who are accountable for the agents being built across their tenant. Equally relevant for citizen developers stepping up to production responsibilities and for ISVs building agents on top of Copilot Studio for customers.',
  duration: '2 days (16 hours)',
  pages: 64,
  requirements:
    'Microsoft 365 tenant with Copilot Studio licence (trial is fine), Power Platform environment, and access to a Dataverse table you can experiment against. Familiarity with Power Automate, basic JSON and at least one custom connector or REST API is helpful. Bring a real agent ambition from your organisation — agents that exist only as PowerPoint won\'t survive the labs.',
  outcomes: [
    'Make the three architectural decisions (deployment surface, knowledge boundary, escalation model) explicitly before any topic is built',
    'Apply the four-question framework that decides topics vs generative answers per intent — and justify the hybrid pattern that nearly every production agent converges to',
    'Deploy plugins, connectors and MCP servers using the four-component auth model (user, service, OBO, managed identity) and survive the three documented production failure modes',
    'Ground agents in Dataverse with row-level security, field-level security, hierarchical access and the cross-role test pattern',
    'Run ALM across Dev → Test → Prod environments using Power Platform Pipelines, managed solutions and Git source control',
    'Pass the 12-item production-gate checklist (DLP, sensitivity labels, audit, eval, telemetry, support runbook) before the agent is exposed to any end user',
  ],
  modules: [
    {
      number: '01',
      title: 'Copilot Studio architecture in 2026',
      topics: [
        'The six components: orchestrator, generative AI layer, topics, knowledge, actions, channels',
        'How Microsoft 365 Copilot agents, Copilot Studio agents and Azure AI Foundry agents relate (post-Ignite 2025)',
        'Deep reasoning, planner-driven agents and the autonomous-agent surface (GA Apr 2025)',
        'Three architectural decisions you must make on day one',
        'Governance touchpoints from day one: tenant settings, DLP, environment strategy',
      ],
    },
    {
      number: '02',
      title: 'Topics, generative answers and the hybrid pattern',
      topics: [
        'When determinism wins (compliance, transactions, controlled UX) and when generative wins (long tail, FAQ, drafting)',
        'Four-question framework per intent: bounded? auditable? variable? deterministic?',
        'The topic-explosion anti-pattern that kills maintainability',
        'Generative orchestration: how the planner picks topics, actions and knowledge',
        'Slot filling, entities, adaptive cards and the modern conversation design',
      ],
    },
    {
      number: '03',
      title: 'Actions, plugins, connectors and APIs at production scale',
      topics: [
        'Power Automate flows vs custom connectors vs HTTP actions — when to pick each',
        'Four-component auth model: user delegated, service principal, on-behalf-of, managed identity',
        'Custom connectors, OpenAPI specs and AAD-secured APIs',
        'Three production failure modes (rate limit, auth drift, payload bloat) and how to instrument for them',
        'Lab: wire a Copilot Studio agent to a participant-owned API with OBO auth',
      ],
    },
    {
      number: '04',
      title: 'Knowledge sources, MCP and Dataverse grounding',
      topics: [
        'Knowledge source types: SharePoint, public web, Dataverse, upload, external connectors (Graph)',
        'Retrieval quality: file scope, citation behaviour, freshness and dedup',
        'Model Context Protocol (MCP) servers in Copilot Studio (preview → GA 2026) and per-agent scope-down',
        'Dataverse grounding with row-level security, field-level security, hierarchical security',
        'The cross-role test pattern: does the agent leak data when a low-privilege user asks?',
      ],
    },
    {
      number: '05',
      title: 'Autonomous and multi-agent patterns',
      topics: [
        'Autonomous triggers (events, schedules, message arrivals) and the agent-as-service pattern',
        'Multi-agent orchestration: a supervisor agent calling specialist agents',
        'Agent-to-agent (A2A) and the MCP-as-tool pattern',
        'When to stay on Copilot Studio and when to graduate to Azure AI Foundry',
        'Worked example: a procurement copilot with a deterministic policy sub-agent',
      ],
    },
    {
      number: '06',
      title: 'ALM, environments and Power Platform Pipelines',
      topics: [
        'Three-environment promotion path (Dev → Test → Prod), with sandbox per developer',
        'Managed vs unmanaged solutions and the three solution rules',
        'Power Platform Pipelines (GA) and Azure DevOps / GitHub Actions integration',
        'Git source control for Copilot Studio (preview) and review workflows',
        'Connection references, environment variables and the secrets you must never check in',
      ],
    },
    {
      number: '07',
      title: 'Governance, security, DLP and monitoring',
      topics: [
        'Tenant-wide DLP policies and the three governance layers (CoE, environment, agent)',
        'Sensitivity labels, customer-managed keys and EU Data Boundary considerations',
        'Audit logs in Microsoft Purview and the agent-activity report',
        'Five monitoring signals: handoff rate, deflection rate, fallback rate, latency, cost',
        'Eval-in-Copilot-Studio and external eval with Promptflow / Inspect AI',
      ],
    },
    {
      number: '08',
      title: 'Capstone — ship a production-grade agent',
      topics: [
        'Three-section design document (problem, architecture, governance) every agent needs',
        '12-item production-gate checklist',
        'Support runbook: who owns incidents, how rollbacks work, how feedback flows back',
        'Four conversations to have Monday: with IT, with the data owner, with the line-of-business sponsor, with security',
        'Capstone: each participant ships their agent into the Test environment with all gates passed',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Copilot Studio Production Pilot — design + build + ship one production-grade agent through your governance gates in five weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
  aiEnablementSummary:
    'Gennoor Tech AI Enablement turns Copilot Studio licences into shipped agents that pass enterprise security, ALM and audit gates. We bring reference architectures for Dataverse-grounded, MCP-connected, autonomous agents, plus the Power Platform CoE patterns that keep your estate sane as agents multiply. Our delivery is hands-on inside your tenant — no demo orgs, no slideware.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Audit your tenant: existing environments, DLP, identity, data residency, the agent backlog and the maker community; surface the top three risks and quick-win agents.' },
    { phase: 'Train', action: 'Run this 2-day course for makers and admins, then certify a lead architect and a CoE owner on the governance-and-ALM workflow.' },
    { phase: 'Innovate', action: 'Co-design two to three flagship agents with their data owners, prototype them in a dev environment, validate against real business KPIs.' },
    { phase: 'Build', action: 'Ship the flagship agents through Dev → Test → Prod with Dataverse grounding, MCP tools, custom connectors, monitoring and a support runbook.' },
    { phase: 'Sustain', action: 'Stand up the Copilot Studio CoE: governance cadence, agent inventory, monthly health review, maker upskilling pipeline and the eval-and-incident playbook.' },
  ],
}

export const m365Copilot: CoursePdf = {
  slug: 'm365-copilot-adoption',
  title: 'Microsoft 365 Copilot Adoption Playbook',
  subtitle: 'Drive 60%+ active usage with persona-based licensing, prompt libraries and a 90-day rollout that funds itself.',
  track: 'builder',
  trackLabel: 'Builder',
  audience:
    'CIOs, IT directors, modern-workplace leads, M365 admins, change managers, HR-IT partners and digital-adoption owners running Copilot rollouts above 250 seats. Equally relevant for Microsoft partners and managed-service providers running rollouts for customers.',
  duration: '2 days (16 hours)',
  pages: 56,
  requirements:
    'Active Microsoft 365 tenant (E3/E5 or Business Premium) and a current or imminent Copilot for Microsoft 365 commitment. Bring your existing licensing inventory, your top three target personas, and (if possible) a SharePoint audit summary. No technical pre-reqs — this is a programme-leadership course, not a development course.',
  outcomes: [
    'Name the three reasons most Copilot rollouts stall at 10–20% active usage — none of which are about the technology',
    'Run persona-based licensing math that protects 30–50% of year-1 spend without slowing the rollout',
    'Execute the 4-week pilot template that produces the Week-4 readout your CFO will fund the wider rollout on',
    'Build persona-based prompt libraries — the single asset that turns Copilot from novelty into habit',
    'Operate the IT prep sprint (sensitivity labels, DLP, SharePoint oversharing audit, Restricted SharePoint Search)',
    'Defend a 90-day rollout plan and the steady-state operating model to the executive sponsor next week',
  ],
  modules: [
    {
      number: '01',
      title: 'The 2026 Copilot adoption reality',
      topics: [
        'What Copilot is in 2026: M365 Copilot, Copilot Chat (free), Copilot Pages, Copilot Studio agents, Researcher and Analyst',
        'The three honest reasons rollouts stall: oversharing, no persona work, no measurement',
        'What 60%+ weekly active usage actually looks like vs the 10–20% that haunts most tenants',
        'Three roles that determine the outcome: executive sponsor, persona champion, IT prep lead',
        'Microsoft Copilot Dashboard, Viva Insights for Copilot and Copilot Analytics — what each shows',
      ],
    },
    {
      number: '02',
      title: 'Licensing strategy and the persona-based ROI case',
      topics: [
        'Copilot SKUs in 2026: M365 Copilot ($30/user/mo), Copilot Chat metered, agent consumption pricing',
        'Persona sizing: heavy-document, communication-heavy, analyst, frontline — and who genuinely needs what',
        'The 30–50% year-1 spend protection you get from honest persona work',
        'Building the ROI case finance will accept: hours saved, error reduction, cycle-time, cost-of-quality',
        'How to push back on vendor blanket-license pressure with data',
      ],
    },
    {
      number: '03',
      title: 'The 30-day IT prep sprint',
      topics: [
        'SharePoint and OneDrive oversharing audit using SharePoint Advanced Management',
        'Sensitivity labels (Purview Information Protection) and the Copilot exclusion behaviour',
        'DLP for Copilot prompts and outputs',
        'Restricted SharePoint Search, Restricted Content Discovery and oversharing remediation',
        'Audit logs, Purview eDiscovery for Copilot interactions, Customer Lockbox',
        'Lab: run a real SharePoint advanced-management report against a participant tenant',
      ],
    },
    {
      number: '04',
      title: 'The 4-week pilot template that funds the rollout',
      topics: [
        'Week 1 — persona-based licence assignment, baseline measurement, prompt-library v0',
        'Week 2 — guided learning, persona champions, weekly office hours',
        'Week 3 — workflow integration with the top three apps each persona uses',
        'Week 4 — readout: usage by persona, hours-saved survey, qualitative wins, board-grade slide',
        'Three Copilot-specific pilot mistakes (random sampling, no champion, missing IT prep)',
        'Lab: draft the participant\'s own Week-4 readout deck',
      ],
    },
    {
      number: '05',
      title: 'Persona-based prompt libraries — the asset that makes Copilot stick',
      topics: [
        'Structure: anchor prompts (universal) + role prompts (persona-specific) + workflow prompts (task-specific)',
        'Where content actually comes from: champion interviews, top-task discovery, real artefacts',
        'Three governance rules: review cycle, ownership, sensitivity classification',
        'Distribution: SharePoint hub, Copilot Pages, Viva Learning, Lookbook',
        'How to keep the library alive after launch — the monthly refresh rhythm',
      ],
    },
    {
      number: '06',
      title: 'Change management, training and the persona champion network',
      topics: [
        'The champion network: ratio, selection, recognition, time allocation',
        'Skills-based learning paths via Viva Learning and Microsoft Learn',
        'Live, async and just-in-time training mix — and what works for which persona',
        'Manager enablement: the conversation a people-manager has with their team in Week 2',
        'Three classical conflicts: privacy vs measurement, autonomy vs guardrails, speed vs governance',
      ],
    },
    {
      number: '07',
      title: 'Steady-state operations, measurement and the second wave',
      topics: [
        'Four steady-state numbers: monthly active users, weekly engaged users, hours saved per active, satisfaction',
        'Reporting cadences: weekly ops, monthly steering, quarterly board',
        'Three early-warning signals: usage decay, champion attrition, support-ticket spike',
        'Agents and Copilot Studio in the second wave: prioritising the first three department agents',
        'Three scaling traps and the readiness signals that mean you can move',
      ],
    },
    {
      number: '08',
      title: 'Capstone — your 90-day rollout plan',
      topics: [
        'Three 30-day phases × three deliverables each',
        'The four conversations you have in week one (sponsor, IT, security, persona champions)',
        'What comes after launch: agents, Copilot Pages, Copilot Studio extensions',
        'Risk register and the decision log',
        'Capstone: each participant defends their rollout plan to a mock executive review',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Copilot Kickstart engagement — persona-based licensing, prompt library, and pilot launched together in four weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
  aiEnablementSummary:
    'Gennoor Tech AI Enablement turns your M365 Copilot investment into a measurable productivity gain. We bring the persona-based licensing model, IT prep sprint and prompt-library playbook that move tenants from 10% novelty usage to sustained 60%+ active engagement. Our delivery is hands-on inside your tenant, with finance-grade ROI evidence at the end of the pilot.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Audit your tenant for oversharing risk, run persona modelling against your headcount, baseline current Copilot usage and benchmark the ROI case finance will accept.' },
    { phase: 'Train', action: 'Run this 2-day playbook for IT, change and persona champions, then certify a lead programme owner on the steady-state operating model.' },
    { phase: 'Innovate', action: 'Run the 4-week pilot with three personas in parallel, build the v1 prompt library and deliver the Week-4 readout that secures full-rollout funding.' },
    { phase: 'Build', action: 'Execute the 90-day rollout: SharePoint oversharing remediation, sensitivity labels, DLP, persona champions, training, prompt library distribution and measurement.' },
    { phase: 'Sustain', action: 'Stand up the monthly steering cadence, prompt-library refresh, champion network rhythm and the second-wave agent backlog inside Copilot Studio.' },
  ],
}

export const claudeCodeDevelopers: CoursePdf = {
  slug: 'claude-code-for-developers',
  title: 'Claude Code for Developers',
  subtitle: 'Master agentic coding, CLAUDE.md context engineering, the Claude API, MCP and production-grade Claude apps.',
  track: 'builder',
  trackLabel: 'Builder',
  audience:
    'Software engineers, senior developers, ML and AI engineers, platform engineers and engineering leads who are shipping (or about to ship) features built on Claude. Equally valuable for tech-lead developers evaluating Claude Code against Cursor, Cline, Aider, Continue, Devin and Codex, and for staff engineers responsible for the team-wide rollout and governance of agentic coding inside their organisation.',
  duration: '2 days (16 hours)',
  pages: 64,
  requirements: 'Claude Pro/Team subscription · Anthropic API key with credits · Node.js 22+ and Python 3.11+ · VS Code or JetBrains · Claude Code installed via npm · Git, GitHub CLI, Docker · a real codebase you are allowed to experiment on',
  outcomes: [
    'Use Claude Code for writing, debugging, refactoring, and reviewing code in real projects',
    'Execute multi-file agentic coding tasks across large codebases',
    'Build working applications using Claude API with tool use, RAG, and structured outputs',
    'Design and deploy agentic workflows connected to external systems via MCP',
    'Evaluate, test, and ship AI solutions to production with proper guardrails',
  ],
  modules: [
    { number: '01', title: 'Setup and configuration', topics: ['Installing Claude Code via npm', 'API keys · model selection · project settings', 'VS Code and terminal workflows', 'How Claude Code reads your codebase'] },
    { number: '02', title: 'Core coding workflows', topics: ['Writing features from natural language', 'Debugging — describe the problem, let Claude investigate', 'Refactoring with context-aware suggestions', 'Code review patterns'] },
    { number: '03', title: 'Agentic coding', topics: ['Plan, execute, iterate', 'Multi-step tasks across files', 'Large codebases', 'Running terminal commands', 'When to let it run vs step in'] },
    { number: '04', title: 'Project context with CLAUDE.md', topics: ['What CLAUDE.md is and why it matters', 'Writing effective project context and constraints', 'Encoding standards, architecture decisions, team conventions', 'Keeping it updated'] },
    { number: '05', title: 'Testing and quality', topics: ['Generating unit, integration, e2e tests', 'TDD with Claude Code', 'Security auditing and vulnerability scanning', 'Performance analysis'] },
    { number: '06', title: 'Documentation and team workflows', topics: ['Generating and maintaining docs', 'Onboarding new developers faster', 'Code review workflows within a team', 'Cost awareness — token usage'] },
    { number: '07', title: 'Claude API fundamentals', topics: ['API setup — keys, SDKs, auth', 'Messages API — roles, models, tokens, pricing', 'System prompts — controlling behavior', 'Tool use and function calling', 'Structured outputs'] },
    { number: '08', title: 'RAG — Retrieval-Augmented Generation', topics: ['When you need it', 'Document chunking strategies', 'Vector databases — setup and querying', 'Chatbot over company documents end-to-end', 'Handling edge cases — no results · conflicts · hallucinations'] },
    { number: '09', title: 'Agentic architecture', topics: ['Planning · tool use · iteration', 'Multi-step task execution', 'Memory and state management', 'Human-in-loop checkpoints'] },
    { number: '10', title: 'MCP protocol and integrations', topics: ['What MCP is and the problem it solves', 'Connecting to databases · GitHub · Jira · CI/CD', 'Building a custom MCP server', 'Combining multiple MCP servers'] },
    { number: '11', title: 'Guardrails, evaluation, testing', topics: ['Preventing hallucinations in production', 'Eval datasets and test suites', 'Red-teaming — finding failure modes', 'Input validation · output filtering · content moderation'] },
    { number: '12', title: 'Production deployment', topics: ['Monitoring and logging', 'Cost optimization — caching · model selection · token management', 'Scaling considerations', 'Maintenance and iteration'] },
  ],
  enablementNote:
    'Pairs with our Claude Cowork Workshop (24 hours hands-on) — your team ships a real Claude-powered application across three days under senior guidance.',
  pilotPriceBand: 'Bootcamp from $15k (5 developers) · custom pricing for larger cohorts',
  pilotTimeline: '3-day intensive · or 6-week part-time',
  aiEnablementSummary:
    'Gennoor Tech AI Enablement takes engineering teams from "we tried Claude Code once" to a measured, governed, team-wide agentic coding practice. We bring the CLAUDE.md context patterns, MCP integrations and CI eval gates that make Claude-built features production-defensible. Our delivery is hands-on inside your codebase, paired with a senior Anthropic-fluent engineer.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Audit your codebase, CI, testing posture, secrets handling and current developer workflow; baseline cycle-time and quality metrics; pick the three highest-leverage Claude Code use cases.' },
    { phase: 'Train', action: 'Run this 2-day Claude Code course for engineers, then certify a tech-lead group on agentic-coding governance, prompt patterns and the CLAUDE.md operating model.' },
    { phase: 'Innovate', action: 'Co-build two to three flagship features end-to-end (one greenfield, one refactor, one integration) using Claude Code + MCP, with full eval and observability from day one.' },
    { phase: 'Build', action: 'Productise the patterns into your team\'s standard workflow: CLAUDE.md hierarchy, MCP server inventory, eval-in-CI, cost dashboards and the secure-by-default agent configuration.' },
    { phase: 'Sustain', action: 'Run the monthly engineering review on Claude usage, cost, defect-rate and developer satisfaction; refresh CLAUDE.md as the codebase evolves; coach the team through model upgrades.' },
  ],
}

export const mlForecasting: CoursePdf = {
  slug: 'ml-forecasting-for-business',
  title: 'Machine Learning & Forecasting for Business',
  subtitle: 'Build forecasting and classical-ML models that planners trust — and know when an LLM is the wrong answer.',
  track: 'builder',
  trackLabel: 'Builder',
  audience:
    'Analytics leaders, BI managers, demand and supply-chain planners, finance modellers, revenue-ops leads and data-science generalists who own forecasts and decisions that get made on numbers — not on chat. Equally valuable for engineering managers and architects who keep being asked "can\'t we just use an LLM for this?" and need a defensible answer.',
  duration: '2 days (16 hours)',
  pages: 60,
  requirements:
    'Working knowledge of Python (pandas, scikit-learn basics) or strong SQL plus an Excel modelling background. A free Azure subscription and a small business dataset (demand, sales, churn or finance) you can bring to the labs. No prior ML deployment experience required, but participants should understand their organisation\'s decision cadence (weekly forecasts, monthly close, daily replenishment, etc.).',
  outcomes: [
    'Apply the four-question filter (data shape, decision cadence, explainability, cost) to decide ML vs LLM vs statistics vs spreadsheet — and produce a written justification per use case',
    'Build a demand or revenue forecast using ARIMA, Prophet, ETS, lightgbm and Nixtla TimeGPT / Amazon Chronos, and explain why one wins for your data',
    'Operate Azure Machine Learning (workspaces, compute, datasets, AutoML, designer, pipelines, registered models) end-to-end',
    'Evaluate models honestly with WAPE, MAPE, sMAPE, MASE, pinball loss and bias detection — and explain the trap each hides',
    'Deploy a model with MLOps appropriate to scale: managed online endpoints, batch endpoints, MLflow, model registry, drift monitoring',
    'Diagnose the three production failure modes (data drift, concept drift, label leakage) and write the rollback runbook before launch',
  ],
  modules: [
    {
      number: '01',
      title: 'When to use ML vs LLM vs statistics vs nothing',
      topics: [
        'Four-question filter: shape of data, cadence of decision, explainability bar, cost-to-serve',
        'When a spreadsheet, an ARIMA or a SQL median actually beats ML',
        'Where LLMs win (long-tail text, document understanding, generation) and where they fail (regression, ranked decisions, tabular)',
        'Foundation models for time series: Nixtla TimeGPT, Amazon Chronos, Google TimesFM, Salesforce Moirai — what works in 2026',
        'Lab: classify five participant use cases against the filter',
      ],
    },
    {
      number: '02',
      title: 'Forecasting fundamentals',
      topics: [
        'Time-series structure: level, trend, seasonality, residual, exogenous regressors',
        'Classical methods that still win: ETS, ARIMA, Theta, Croston for intermittent',
        'Prophet and NeuralProphet — strengths, gotchas, calibration',
        'Hierarchical forecasting and reconciliation (Nixtla MLForecast, StatsForecast)',
        'Probabilistic forecasts and prediction intervals — why point forecasts mislead planners',
      ],
    },
    {
      number: '03',
      title: 'Tabular ML for the everyday business problem',
      topics: [
        'Classification, regression, ranking, propensity, survival — and the right metric per shape',
        'lightgbm, xgboost, catboost — when each wins and how to tune without overfitting',
        'Feature engineering that earns its keep (lags, rolling stats, encoders, target encoding pitfalls)',
        'Imbalanced classes, calibration, threshold selection for business action',
        'Causal vs predictive — and why your "lift" estimate is wrong without DoWhy / CausalML',
      ],
    },
    {
      number: '04',
      title: 'Azure Machine Learning end-to-end',
      topics: [
        'Workspace, compute clusters, environments and datasets',
        'AutoML for forecasting and classification — what to trust, what to overrule',
        'Designer pipelines vs SDK v2 vs prompt-flow — choosing the right surface',
        'Responsible AI dashboard: fairness, error analysis, explainability (SHAP)',
        'Lab: build a forecasting pipeline from CSV to registered model in one afternoon',
      ],
    },
    {
      number: '05',
      title: 'Honest evaluation and the business sign-off',
      topics: [
        'MAPE, WAPE, sMAPE, MASE, RMSE, pinball loss — and what each hides',
        'Backtesting with expanding-window and rolling-origin cross-validation',
        'Champion-challenger and shadow-mode evaluation against the current process (often Excel)',
        'Translating model error into business consequence (stock-out vs over-stock, false-positive vs false-negative cost)',
        'Writing the evaluation memo your CFO will actually read',
      ],
    },
    {
      number: '06',
      title: 'MLOps at the scale you actually have',
      topics: [
        'MLflow, model registry, semantic versioning of models',
        'Managed online endpoints, batch endpoints, scheduled pipelines, event triggers',
        'CI/CD for ML with GitHub Actions / Azure DevOps and Azure ML CLI v2',
        'Data drift, concept drift, performance drift — monitoring with Azure ML data drift detectors and Evidently',
        'Cost-to-serve: GPU vs CPU vs serverless inference, batch vs real-time',
      ],
    },
    {
      number: '07',
      title: 'The three production failure modes',
      topics: [
        'Data drift: schema change, distribution shift, upstream outage',
        'Concept drift: the world changed, the model didn\'t (post-2024 demand patterns, post-rate-cycle credit risk)',
        'Label leakage and the offline-online gap',
        'Rollback runbook, model retraining cadence, the human-in-the-loop override',
      ],
    },
    {
      number: '08',
      title: 'Capstone — your ML decision and deployment plan',
      topics: [
        'Each participant brings one real problem and writes the decision memo',
        'Build a baseline (statistical) + a classical-ML + a foundation-model time-series forecast',
        'Compare on WAPE, latency, cost and explainability',
        'Defend the recommendation to a mock business sponsor',
        'Plan the 90-day path from notebook to production with the right MLOps tier',
      ],
    },
  ],
  enablementNote:
    'Pairs with our Custom ML Build — if your team needs more than reading this, our engineers build the model with you in 6–10 weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–10 weeks',
  aiEnablementSummary:
    'Gennoor Tech AI Enablement helps analytics-and-finance teams build forecasts and tabular ML models that actually get used in planning meetings. We bring the Azure ML reference architecture, classical-and-foundation-model time-series patterns and the evaluation discipline that earns sign-off from finance and operations. Our delivery is hands-on against your data, with an MLOps tier matched to your real scale.',
  aiEnablementPhases: [
    { phase: 'Diagnose', action: 'Audit your current forecasts and decision processes; classify use cases against the ML / LLM / statistics filter; baseline accuracy of the existing process (often Excel).' },
    { phase: 'Train', action: 'Run this 2-day course for analytics, planning and engineering, then certify a lead modeller and an MLOps owner on the Azure ML workflow.' },
    { phase: 'Innovate', action: 'Build baseline + classical-ML + foundation-model time-series candidates against your real data; pick the winner on WAPE, latency, cost and explainability.' },
    { phase: 'Build', action: 'Productionise the chosen model on Azure ML with the right MLOps tier (batch endpoint, online endpoint, scheduled pipeline), drift monitoring and a rollback runbook.' },
    { phase: 'Sustain', action: 'Stand up the monthly model-health review, retraining cadence and human-in-the-loop override; coach the planning team through the first three drift incidents.' },
  ],
}

// =====================================================================
// CATALOG INDEX
// =====================================================================

export const allCoursePdfs: CoursePdf[] = [
  // Track 1 — Foundations
  aiFoundationsForEveryone,
  genAiForBusiness,
  aiLiteracyNonTech,
  // Track 2 — By Function
  aiForHr,
  aiForFinance,
  aiForSalesMarketing,
  aiForCustomerService,
  aiForOps,
  aiForLegal,
  // Track 3 — Leadership
  aiStrategyCsuite,
  aiGovernanceBoards,
  aiRoiBusinessCase,
  // Track 4 — Industry
  aiFinancialServices,
  aiHealthcare,
  aiManufacturing,
  aiGovernment,
  aiEducation,
  // Track 5 — Builder
  promptEngineering,
  copilotStudio,
  m365Copilot,
  claudeCodeDevelopers,
  mlForecasting,
]

export function getCoursePdfBySlug(slug: string): CoursePdf | undefined {
  return allCoursePdfs.find(c => c.slug === slug)
}
