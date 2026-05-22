/**
 * Per-course `learningOutcomes` — the structured "What you'll learn" bullets
 * shown on each course detail page. Kept in a side-file so courses.ts stays
 * readable; auto-merged into the courses array at module load.
 *
 * Each entry: 6-8 outcome lines, tight, outcome-language ("Read the…", "Draw
 * the line…", "Walk out with…"), no fluff. If a course is missing here, its
 * detail page falls back to the cleaned-up paragraph rendering of
 * longDescription only.
 */

export const COURSE_OUTCOMES: Record<string, string[]> = {
  // ─── AB-100: Microsoft Cert Prep ─────────────────────────────────────────
  'ab-100': [
    'Master the Microsoft AB-100 exam objectives — agentic AI architecture, Copilot Studio, Azure AI Foundry, Dynamics 365 integration',
    'Analyse business requirements and translate them into agentic AI solution designs — the architect\'s decision framework',
    'Develop AI strategy with executive sponsors — capability mapping, capacity planning, capital allocation',
    'Design solutions with the right pattern — topic vs generative, plugin vs agent, when to extend vs orchestrate',
    'Orchestrate prebuilt agents (Sales, Service, Finance) and custom agents in one coherent business workflow',
    'Manage governance at scale — environment strategy, ALM pipelines, monitoring signals, quality gates',
    'Sit a 50-question mock exam that mirrors the real AB-100 format and difficulty',
  ],

  // ─── Phase 2 rewrites (Courses 11-20) ────────────────────────────────────
  'ai-foundations': [
    'A working mental model of what current AI actually does — and the boundary where it stops being reliable',
    'How LLMs really work in plain English — tokens, training, next-token prediction, why hallucinations happen, retrieval grounding',
    'The 5 use categories that consistently ship (drafting · summarising · translating · classifying · code) and the 3 that don\'t',
    'How to evaluate any AI claim — Tetlock calibration > confidence, the 3 questions for any vendor productivity number',
    '5 hands-on prompt patterns: role+task+format+constraints+examples, outline-first, verify-the-citation, rewrite-for-audience, critique-my-draft',
    'The privacy + bias awareness anchored on real cases — Mata v. Avianca, Air Canada Moffatt, Bloomberg resume study',
    'A 2-week starter plan with the use-it-Monday habit and 4 trust trip-wires you don\'t cross',
  ],

  'ai-strategy-c-suite': [
    'A clear-eyed view of the AI strategy landscape — Stanford AI Index, McKinsey 71% gen-AI use, the trough of disillusionment',
    'The CEO-grade portfolio shape — 6 plays that move the P&L, 3 that disappoint, stage-gates that kill bad bets early',
    'Capital discipline for AI investment — where the money actually returns vs where it goes to die',
    'Talent design for the AI era — build/buy/borrow, the role architecture, the AI fluency build for the existing org',
    'The governance posture C-suites have to defend — EU AI Act, NIST AI RMF, ISO 42001, sector overlays',
    'Momentum past year 1 — the patterns that compound vs the patterns that decay after the first headline',
    '4 trust trip-wires every CEO needs in writing — the boundaries you do not cross regardless of pressure',
  ],

  'ai-governance-risk-boards': [
    'A working knowledge of the AI governance regulatory stack — EU AI Act, NIST AI RMF, ISO 42001 + sector overlays',
    'The risk classification framework you can defend to regulators, auditors, and litigation',
    'A risk register pattern that\'s real, not a checkbox — with the NIST 4 functions controls embedded',
    'The vendor posture — what to demand in writing from every AI vendor before signing',
    '4 board resolutions every regulated company should pass — wording sourced from real precedent',
    'The 10 board questions for every AI initiative — the diligence script directors can use today',
    'Incident response for AI — the playbook for the day something goes wrong publicly',
    'A governance charter template — the document that makes oversight real',
  ],

  'ai-for-finance-accounting': [
    'The 5 finance AI plays that ship in production — forecasting · narratives · close acceleration · variance · NPI analysis',
    'The audit-trail discipline that keeps AI-augmented numbers defensible to external auditors and PCAOB',
    'How to navigate the IFRS 18 + SOX + Big-4 audit landscape with AI in the workflow',
    'Where AI plugs into AP/AR/treasury/tax — what works, what disappoints, what crosses the auditability line',
    'The 3-tier human-in-the-loop framework for AI-assisted journal entries and reconciliations',
    'The hard line on AI-prepared financials — what\'s in scope, what isn\'t, how to document human review',
    'Standards landscape: NIST AI RMF + Big-4 guidance + IFRS + PCAOB — the posture you defend',
  ],

  'ai-in-financial-services': [
    'A regulator-aware map of AI in BFSI — credit, fraud/AML/KYC, insurance, capital markets, customer-facing',
    'The fair-lending playbook — CFPB + DOJ + ECOA, adverse-action notices, fairness monitoring across protected classes',
    'AML + KYC + transaction monitoring with AI — what regulators approve vs what gets MRA-ed',
    'Insurance pricing and claims with AI — the disclosure requirements, the explainability bar, the trip-wires',
    'SR 11-7 model risk management applied to LLMs — validation, monitoring, recertification',
    'EU AI Act + FCA Consumer Duty + RBI master direction — the multi-jurisdictional posture',
    'The audit-defense posture — explainability, lineage, fairness audits, override logs that survive litigation',
  ],

  'generative-ai-for-business': [
    'A grounded view of generative AI — drafting, summarising, transforming — and where it stops being reliable',
    'The 4 skills that separate AI-leveraged leaders from spectators — framing, evaluating, piloting, measuring',
    'How to frame use cases that survive contact with reality — the use-case fit map',
    'How to evaluate vendors — the questions that separate signal from pitch',
    'How to run pilots that scale — stage-gates, success criteria, the kill-bad-bets discipline',
    'How to measure outcomes — outcome metrics not AI metrics, the executive narrative that holds up',
    'A 2-quarter portfolio plan defensible to the board — with the trust trip-wires built in',
  ],

  'ai-for-hr-people-teams': [
    'A clear-eyed map of AI in HR — sourcing · screening · learning · retention · internal mobility',
    'The compliance posture — EEOC + DOJ joint guidance, GDPR Art 22, NYC Local Law 144, Mobley v. Workday',
    '4 bias mitigations for AI-assisted screening that actually work in audit',
    'Structured interview design that uses AI for prep — not for decisions',
    'The 3 lines we do not cross — no AI ratings, no AI stack ranking, no flight-risk prediction',
    'Onboarding + L&D patterns that compound — where AI multiplies impact vs where it gets in the way',
    'The candidate-experience design that turns AI use into recruiting strength, not a creepy-line cross',
    'A bias-audit discipline that\'s an operating practice — not just an annual checkbox',
  ],

  'm365-copilot-adoption': [
    'A real read of M365 Copilot — what ships at $30/user/month, where it delivers, and the 30-40% active-user gap problem',
    'The 5 anchor use cases — Word · Excel · PowerPoint · Outlook · Teams — and where the boundary is',
    'The 3 licensing patterns and the worked business case — active-user fraction is the critical variable',
    'The IT-admin foundation — tenant isolation, Microsoft Graph, Purview DLP, Defender for Cloud Apps',
    'The compliance posture — EU AI Act + HIPAA BAA + DPDPA + UK FCA Consumer Duty in writing',
    'The 3 change-management moves that close the active-user gap — champions, office hours, visible tracking',
    'When to extend with Copilot Studio (and when not to) — the 3 categories that justify it',
    'A 3-phase rollout plan (pilot · scale · embed) with 4 trust trip-wires and an interactive Markdown builder',
  ],

  'ai-for-sales-marketing': [
    'Andy Grove\'s output framing applied to revenue AI — augment human judgement, don\'t replace it',
    '6 plays that consistently ship value — prospecting, lead scoring, proposals, content, personalisation, call AI',
    '3 plays that consistently disappoint — fully automated cold outreach, AI agents closing deals, deal-level price optimisation',
    'The disciplined prospecting workflow — Google + Yahoo Feb 2024 rules, the AI-spam math, the 4-step pattern that beats spam',
    'The two-layer lead scoring (ML predictive + LLM signal) with the GDPR Art 22 boundary',
    'The 4-block proposal template with 3 guardrails — CRM grounding, claim register, legal-review gate',
    'The 3 creepy-line categories you don\'t cross — health/distress, surveillance detail, inferred protected characteristics',
    'Call AI with 4 extractions + the 2-2-2 weekly coaching loop that drops new-rep ramp 30-50%',
  ],

  // ─── Older catalog (existing courses) ────────────────────────────────────
  'ai-for-customer-service-support': [
    'The 3 CS-AI patterns that ship in production — agent-assist, scoped deflection bots, hybrid',
    'The 2 patterns that backfire — full bot deflection without escalation, AI-only triage',
    'The disciplined agent-assist stack that drops AHT without breaking quality',
    'The scoped-deflection-bot design — narrow scope, clear escalation, fast handoff',
    'A 4-week pilot plan with the KPIs that actually prove value (CSAT, FCR, deflection, AHT)',
    'The Air Canada Moffatt boundary — anything the AI says is a representation by your company',
    'The disclosure + escalation discipline — EU AI Act Article 50, when to reveal AI, when to hand to human',
    'The quality-monitoring loop — shadow QA, drift detection, the 5 metrics that matter weekly',
  ],

  'ai-for-operations-supply-chain': [
    '6 operations AI plays that consistently produce measurable savings — forecasting, procurement docs, logistics, predictive maintenance, inventory, supplier risk',
    '3 pitches that consistently disappoint — named explicitly so the budget redirects',
    'The data-stable filter that decides which plays to start with in your specific operation',
    'The two-layer demand forecasting model — what beats the median MAPE trap',
    'The 3-tier procurement human-in-the-loop with audit posture',
    'The AI-amplifying-OR framing for logistics — where AI augments operational research, not replaces it',
    'The dynamic safety stock approach that solves stock-outs and overstock together',
    'A 2-quarter roadmap with operational KPIs (procurement capacity, service level, working capital) — not AI metrics',
  ],

  'ai-in-manufacturing': [
    '6 plant-floor plays that ship — predictive maintenance, vision quality, energy, scheduling, safety, throughput',
    '3 pitches that disappoint — and the OT/IT bridge filter that separates them',
    'How to design the OT/IT bridge that makes AI on the shop floor possible',
    'The digital-twin reality applied honestly — what works, what\'s marketing, what breaks at production scale',
    'The ISA-95 stack as the deployment frame — where AI plugs in safely vs where it threatens uptime',
    'A 12-month plant roadmap with OEE and quality KPIs as the success measure',
    'The trust trip-wires — worker safety, equipment integrity, regulatory disclosure',
  ],

  'building-ai-agents-copilot-studio': [
    'The 6 components of the Copilot Studio stack — and the 3 architectural decisions made deliberately at the start',
    'The 4-question framework for topic vs generative answers — avoid the topic-explosion anti-pattern most teams hit by topic 20',
    'Plugins + connectors at production scale — the 4-component auth model and 3 production failure modes',
    'Agents + agent flows with state isolation tested under concurrent load — not just in single-user demos',
    'Knowledge sources at scale — SharePoint, files, web, MCP, Dataverse with row-level security',
    'Deployment through 3 environments with managed solutions and pipelines that scale across the estate',
    'Governance with 3 layers — tenant, environment, per-agent — plus the 5 monitoring signals you watch',
    'The 12-item production-readiness checklist and 4 week-one conversations to schedule with stakeholders',
  ],

  'ai-literacy-non-technical-teams': [
    'A working AI vocabulary — terms you can defend in a meeting, no jargon, no fear',
    'Where AI actually helps day-to-day for HR, Marketing, Sales, and Ops — concrete plays per function',
    'The 3 risks every non-technical employee should know — hallucinations, bias, data-handling',
    'The "augment-don\'t-replace" reflex — when to lean in, when to skip it',
    'How to draft, review, and refine AI output without losing the judgement that makes you good at your job',
    'The data-handling discipline — what you can paste into a public AI tool and what you absolutely cannot',
    'Practical Monday-morning moves that compound into team-level fluency over a quarter',
  ],

  'prompting-mastery': [
    'Structured outputs that survive downstream parsing — JSON, XML, tables, citations',
    'Chain-of-thought prompting — when it helps, when it harms, how to constrain it',
    'Few-shot patterns that lift accuracy without bloating tokens',
    'How to build and curate a prompt library — the habits that compound over months',
    'Evaluation framework — how to know your prompt is good without running 1000 trials manually',
    'Cost + latency awareness — when to use which model, the 3-axis tradeoff (quality, cost, speed)',
    'Power-user tactics — temperature, system prompts, response shaping, error recovery',
  ],

  'working-with-copilots': [
    'How M365 Copilot, GitHub Copilot, and ChatGPT Enterprise differ in strength and weakness',
    'When to lean in on a Copilot — the use cases where it materially compresses time',
    'When to skip it — the patterns that look like Copilot work but aren\'t',
    'The data-handling rules per Copilot — tenant, project, public — and what each surfaces',
    'The review discipline for Copilot output — speed-of-draft is not speed-of-ship',
    'Practical habits per workflow — coding, writing, analysis, meetings — that make Copilot multiplicative',
    'How to evangelise inside your team without becoming the AI tax-collector',
  ],

  'evaluating-ai-output': [
    'How to spot hallucinations fast — the textual signals AI invents vs verifies',
    'How to check sources in 30 seconds — the verification routine that scales',
    'The 3-pass review pattern — facts, voice, audience',
    'How to build a quality bar that your team can apply uniformly — not just the senior reviewer',
    'When to ask the AI to critique its own output — and when that\'s circular',
    'The verification habit pattern — paired with one tool, daily, until it\'s muscle memory',
    'A 2-week practice plan that turns "AI output" into "trusted draft"',
  ],

  'recruiting-ai-in-practice': [
    'AI in sourcing — what works at scale (boolean expansion, intent signals) and what doesn\'t (mass outreach)',
    'AI in screening — with EEOC + EU AI Act guardrails baked in from day 1',
    'AI in interviewing — prep, not decisions; structured questions, calibrated scoring',
    'The Mobley v. Workday boundary — automated decisions on protected classes',
    'NYC Local Law 144 + Illinois AIVIA + EU AI Act high-risk classification for hiring AI',
    'The candidate-experience design that uses AI without crossing the creepy line',
    'The bias-audit cadence that protects the org legally and ethically',
    'A 90-day recruiting-AI rollout playbook with the trust trip-wires in writing',
  ],

  'revops-automation-with-ai': [
    'AI-augmented forecasting — what beats spreadsheet sandbagging at the Friday call',
    'Pipeline hygiene with AI — surfacing stalled deals, missing fields, decision-maker silence',
    'Territory + account scoring — two-layer ML + LLM with the data quality gate',
    'Narrative generation for QBRs and exec updates — grounded, not invented',
    'Data hygiene + entity resolution — the foundation that makes everything else work',
    'Compensation modelling with AI — scenario planning, what-if exploration without breaking trust',
    'The RevOps tooling stack — what to buy, what to build, what to consolidate',
    'A 2-quarter rollout grounded in 2025-26 vendor evidence — not pitch deck claims',
  ],

  'ai-for-legal-compliance': [
    'A clear-eyed read of the legal-AI landscape — what survived the Mata fallout, what didn\'t',
    'The hallucination tax — how to budget for verification time honestly, not optimistically',
    'Contract review with AI — first-pass redlining, clause extraction, risk flagging at scale',
    'DPIA + FRIA workflows — the AI-assisted patterns that hold up at audit',
    'The 4-jurisdiction posture — EU AI Act, US sector regulation, UK ICO, India DPDPA in one framework',
    'Privilege + confidentiality discipline — what you can put into an AI tool and what kills the privilege',
    'A quality framework with the verification log — defensible to the bar association',
    'A 2-quarter rollout that delivers measurable hours back without losing the practice\'s standards',
  ],

  'ai-augmented-month-end-close': [
    'AI-generated variance narratives — grounded in GL, drafted in seconds, reviewed by humans',
    'Accrual proposals from AI — the 3-tier review framework that auditors approve',
    'Reconciliation copilots — bank, intercompany, AP/AR — with the audit trail discipline',
    'Journal entry AI — auto-draft + human approve + log everything for SOX',
    'SOX audit trail design — the format external auditors and PCAOB inspectors want to see',
    'The quality framework — accuracy, completeness, timeliness — with the controls that prove it',
    'A 2-quarter rollout that compresses close timeline 1-2 days without losing control',
  ],

  'demand-forecasting-in-practice': [
    'The honest landscape — M5 Forecasting Competition reality, where AI beats classical and where it doesn\'t',
    'Accuracy and the MAPE trap — why FVA (Forecast Value Add) is the metric that matters',
    'Model choice — when classical wins, when ML wins, when LLM-augmented wins',
    'Demand sensing in practice — Coca-Cola / Unilever / Carrefour cases, 20-40% promo-week lift',
    'Promotional + event uplifts — clean promo calendar + LightGBM uplift model + cannibalisation',
    'New product introduction — P&G analog-product approach, ML does the math, judgement picks the analogs',
    'S&OP integration — narrative + accountability, FVA analysis, the quote-or-cut rule against LLM hallucination',
    'A 2-quarter rollout with 4 trust trip-wires — no unexplainable model, no unrecorded override, no unsourced AI narrative, no set-and-forget',
  ],

  'building-trusted-support-bots': [
    'The honest CS-AI landscape — Zendesk CX Trends 84%, Klarna up-then-down lesson, Salesforce Agentforce reality',
    'Containment vs deflection vs resolution math — the cost stack from McKinsey ($9-14 human vs $1.50-3 autonomous)',
    'Knowledge grounding — Air Canada Moffatt precedent, NYC MyCity lesson, the retrieval-or-don\'t-build rule',
    'The 5 escalation triggers — Gallup CSAT-decline #1, warm-handoff design, the Chevy Tahoe $1 lesson',
    'Conversational design + disclosure — EU AI Act Article 50 (Aug 2 2026), DPD haiku case, 6 design rules',
    'Voice support AI — Talkdesk 25% inbound, sub-900ms latency, assist vs autonomous architectures',
    'Quality monitoring — Forrester #3 failure mode, the 27-point gap, shadow QA + 5 metrics',
    'A 2-quarter rollout with 4 trust trip-wires and the through-line: AI for volume, humans for value',
  ],
}
