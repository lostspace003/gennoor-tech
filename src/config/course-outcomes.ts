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

  'ai-strategy-for-cio': [
    'AI as one workload in the run-grow-transform portfolio, not bolted on — and the three portfolio failures from treating AI as a side program',
    'Five-criterion infrastructure test across hyperscaler, sovereign, on-prem, and hybrid — with regional forcing factors that override',
    'Build vs buy vs compose with three concrete criteria — and the "buy that turned into build" pattern spotted via the consulting-to-license ratio',
    'Talent strategy differentiated per capability bucket — and the SI dependency trap with the knowledge-transfer contractual fix',
    'Four operational risks unique to AI and BCDR including vendor outage failover plus graceful degradation that\'s actually tested',
    'A three-metric board reporting structure that holds AI alongside ERP, cloud, and security with the same calibration',
    'A four-rhythm operating cadence with three cross-functional partners (CDO, CISO, CFO) and a delegation framework that prevents CIO-as-bottleneck',
    'A one-page CIO AI portfolio statement + 4 trust trip-wires + interactive portfolio builder',
  ],

  'ai-strategy-for-cdo': [
    'The CDO mandate doubled when AI landed — headcount rarely did. Three boundary fights with the CIO, CTO, and CISO, and three resolution patterns that work',
    'A minimum-viable-data-foundation filter that separates the data work that unblocks AI from the data work that doesn\'t',
    'A three-pillar RACI with the CISO and CRO that holds past month six — with one R per pillar to prevent the committee-freezes-and-shadow-AI-begins pattern',
    'Three-horizon investment allocation with CFO-defensible framing — neither data starves AI nor AI starves data',
    'Vendor management across four overlapping categories — and the 4-vendor trap with the working 2-3-strategic-vendor pattern',
    'Four board KPIs that survive 12 months of director scrutiny — and four activity metrics to retire',
    'A three-tier delegation model + four-rhythm operating cadence that keeps the CDO from becoming the bottleneck',
    'A one-page CDO-CIO-CISO joint charter + 4 trust trip-wires + interactive charter builder',
  ],

  'ai-vendor-management': [
    'The four AI vendor archetypes (hyperscalers, ISVs, boutiques, SI partners) and the three most likely to over-promise',
    '12-item AI-specific diligence checklist across 4 categories with five red-flag answers and a three-tier rule that scales without watering down',
    'Six AI-specific contract clauses standard MSAs miss — including the training-data trap and regulator-driven extras for BFSI, healthcare, and EU AI Act',
    'Performance SLAs across four dimensions (availability, latency, accuracy, drift) with remedies including termination right — not just service credits',
    'Four lock-in tests (model, data, prompt, integration) with realistic mitigations and the four anti-patterns that don\'t work',
    'Five signal sources with a four-phase response cadence and three audit rhythms (quarterly, annual, pre-renewal)',
    'Pre-written offboarding plans addressing the three AI-specific exit risks (data deletion proof, model retention, retraining echoes)',
    'A one-page AI vendor playbook + 4 trust trip-wires + interactive playbook builder for the category team',
  ],

  'ai-decision-making': [
    'AI is a decision input, not the decision — three modes (AI-as-input, AI-assisted, AI-as-decider) and the drift toward delegation that grows with better models',
    'The cognitive offloading risk grounded in Kahneman\'s System 1 / System 2 — why better models suppress critique and the two countermeasures that keep reasoning engaged',
    'Three override signals (context, recency, regional) and the deference trap that hides overrides — with the override-documentation discipline',
    'The 80/20 verification rule with three filters (reversibility, stakes, context) and three categories that need 100% verification',
    'Team-level decision norms that survive tool churn — categorisation, pre-commitment, override docs — with a 3-stage onboarding pattern',
    'Scenario planning with AI without the false-confidence trap — the 4-step discipline that mixes AI breadth with your judgement',
    'Three drift types (deference, verification, model) and the quarterly decision audit that catches them — with model-drift canonical-prompts check',
    'A one-page AI decision charter + 4 trust trip-wires + interactive charter builder for the team',
  ],

  'open-source-llms-for-enterprise': [
    'Open-source isn\'t free — it\'s a different cost curve. Three real reasons (sovereignty + residency, cost at scale, roadmap control) and 3 cases hosted API still wins',
    'Four model families compared (Llama, Mistral, Phi, Qwen) with the license traps that catch teams and the size discipline that resists "bigger is better"',
    'Self-hosting with Ollama vs vLLM vs TGI vs Azure ML — the gap between demo-grade benchmarks and production-grade concurrency',
    'Fine-tuning approaches (LoRA · QLoRA · full) and the "try retrieval first" discipline — when fine-tuning is the wrong shortcut',
    '5-component TCO with honest breakeven math — real breakeven is 20-50M tokens/day, not the headline GPU price',
    'Three sovereign deployment tiers and what regulators + CISOs actually accept across India, GCC, US, EU',
    'Operational discipline across model upgrades, security patches, and 3-layer observability (GPU · model · request)',
    'A 4-section decision pack + 4 trust trip-wires + interactive decision-pack builder for the steering committee',
  ],

  'azure-ai-foundry-essentials': [
    'The Foundry 3-layer architecture (hub · project · connections) and when raw Azure OpenAI beats Foundry — premature consolidation is overhead, late is rework',
    'Model catalog navigation across 4 families (Azure OpenAI · open-weight · partner · custom) and 3 deployment types — picked on YOUR eval set, not vendor benchmarks',
    'Identity done right: managed identity + Key Vault + private endpoints — making the wrong way harder than the right way',
    'The 4 built-in Foundry evaluators (groundedness · relevance · coherence · safety) and the 3-pattern custom evaluator workflow',
    'Deployment-type fit: serverless ≤5M tokens/month · PTU ≥10M · managed compute for open-weight · batch for async',
    'Cost monitoring across Azure Monitor + Cost Management + Foundry dashboards, with 3 alerts that fire before invoice day',
    'The 20-item production-readiness checklist with 3 disqualifiers nobody crosses (no managed identity · no eval flow · no rollback path)',
    '4-section production sign-off pack + 4 trust trip-wires + interactive sign-off builder for the platform team',
  ],

  'mlops-for-llms': [
    'Five differences that make LLMOps its own discipline — non-determinism, generative outputs, third-party black boxes, per-request cost variability, adversarial users',
    '3-tier production evaluation (light + targeted + gold sampling), LLM-as-judge done right (different family, structured rubric, human on disagreement), PII discipline',
    'Three distinct drift types — input, output, behavioral — with regression-set replay to catch silent vendor model updates',
    'Four cost optimization patterns (compress + cache + route + smaller-plus-retrieval) and three anti-patterns that break quality or correctness',
    'One-artifact versioning (prompt + model + eval) with shadow/canary/feature-flag rollouts and 60-second rollback as a tested capability',
    'OpenTelemetry GenAI semantic conventions + MLflow vs LangSmith for trace search, replay, and eval linking',
    'Four incident types (quality, drift, abuse, vendor outage) with 5-question triage and the eval-case-it post-mortem that produces durable regression tests',
    '5-section LLMOps runbook + 4 trust trip-wires + interactive runbook builder for the platform team',
  ],

  'rag-architectures-foundations': [
    'When RAG fits — large/changing KB · citations + grounding · long-tail facts — and 3 cases when it\'s the wrong architecture',
    'Embeddings as dense vectors — what they encode well (topic, paraphrase, semantic relations) and miss (IDs, negation, numerics, recency)',
    '4 vector stores compared — pgvector, Pinecone, Azure AI Search, Weaviate — with the scale guide and cost traps to avoid',
    'Hybrid search (BM25 + vector + semantic ranking) with RRF/weighted/cascade fusion — where retrieval quality actually lives',
    '3 re-ranker types and the cost-quality curve — first 50 candidates lift 15-25%; beyond that, diminishing returns',
    'Evaluation in two layers — retrieval (hit rate, MRR, recall@k) vs answer (RAGAS: groundedness, faithfulness, relevance) — never conflated',
    '6 production failure modes (bad chunking, query intent mismatch, OOD queries, context overflow, metadata blind spots, stale knowledge) + targeted fixes',
    '5-component production architecture + 4 trust trip-wires + interactive architecture-decision-record builder',
  ],

  'ai-in-education': [
    'The 6 plays that ship in education today — AI literacy, tutoring, educator support, integrity, equity, privacy',
    'The 3 anti-plays that harm — AI replacing teachers, surveillance-heavy AI, autonomous high-stakes grading',
    'The pedagogy-first filter — does this serve a learning objective, or did the vendor say it would help?',
    'AI literacy as a discipline — 4 components at age-appropriate sequencing from elementary through higher ed',
    'The supplement-not-substitute discipline for AI tutoring + the grading line for educator AI',
    '3-tier academic integrity model — prohibited · permitted with disclosure · required — labelled per assessment',
    'FERPA · COPPA · GDPR posture + the 3 vendor contract essentials + child-safety guardrails',
    '12-month school/institution rollout with 4 trust trip-wires + interactive design-doc builder',
  ],

  'ai-roi-business-case-building': [
    'The 6-component business case framework finance respects — problem · benefits · costs · risks · financial metric · stakeholders',
    'The 4 fail modes of typical AI business cases — and the 30%-haircut test that catches the optimistic ones',
    'The 7 cost buckets (with the year-2 cost surprise) most cases miss — including the often-skipped internal team time',
    'The 5 AI-specific risks every case must name + sensitivity analysis on 3-5 variables — the discipline finance respects',
    'NPV, IRR, payback — which one for which stakeholder + how to get hurdle + discount rates from finance up front',
    'The 4 CFO questions you must answer in 3 minutes — payback · worst case · derailment · month-12 success',
    'The 4-quarter ROI realisation cadence that earns the next case credibility — baseline · activity · outcome · annual',
    'A 2-week disciplined build cadence + 5 trust trip-wires + interactive design-doc builder',
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

  // ─── Next-10 batch (Courses 21-30) ────────────────────────────────────────
  'ai-readiness-assessment-deep-dive': [
    'Apply Tetlock calibration to AI readiness — honest scoring beats green dashboards every time',
    'Score 5 readiness dimensions independently — data · talent · governance · infrastructure · leadership commitment',
    'Diagnose 3 stall patterns — pilot-permanent-pilot, data-not-there, governance-afterthought',
    'Administer the 12-question diagnostic with 3 honest scoring rules — specifically not aspirationally, evidence-anchored, amber/red is normal',
    'Read your 3-band result — operationalising · building · foundations — and know the next-move for each',
    '4 trust trip-wires that protect against confidence theatre — no green without evidence, no sponsorship without budget, no permanent pilots, no governance afterthought',
    'Walk out with a 12-month roadmap and the conversation to take to your CEO with your honest score in hand',
    'Grounded in NIST AI RMF 1.0, EU AI Act 2024/1689, ISO/IEC 42001:2023, and Andy Grove\'s leverage framing',
  ],

  'enterprise-data-foundations-for-ai': [
    'Most AI projects fail at the data step — recognise the pattern and stop it',
    '5 pillars of data foundations — quality · lineage · governance · privacy · platform — scored independently',
    '3 anti-patterns that waste budgets — buy platform without fixing data, ocean-boil cleanup projects, disconnected data team',
    'Apply the DAMA-DMBOK quality framework with 4 dimensions (accuracy · completeness · freshness · consistency)',
    'Build defensible lineage — EU AI Act Art 15 + NIST AI RMF + GDPR Art 30 traceability',
    'Choose the right architecture — lakehouse + federated-with-central-platform is durable for most enterprises',
    'Adopt the data product pattern — 3-5x AI team speed when data is published as curated, versioned, owned products',
    '18-month rollout with 4 trust trip-wires you don\'t cross, plus an interactive builder for your CDO/CIO conversation',
  ],

  'ai-program-management-pmo': [
    'Make AI a portfolio you manage — not pilots you accumulate',
    'Build healthy pyramid shape — 10-15 pilots · 3-5 scaled · 1-2 embedded (most enterprises have inverted funnels)',
    'Run stage-gate discipline with explicit kill criteria — 60-80% pilot-to-scale kill rate is healthy',
    '4 vendor contract pillars — training data rights · update transparency · sunset · liability allocation',
    'Manage model lifecycle with 4 retraining triggers + a single source-of-truth registry',
    'Run the ops handoff with 4 artifacts (runbook · model card · dashboard · escalation tree) and a shadow period',
    '5 PMO roles + honest sizing — underfunding the PMO is the single most common false economy',
    '90-day bootstrap roadmap with 4 trust trip-wires and an interactive Markdown builder for your CIO',
  ],

  'ai-talent-strategy': [
    'AI talent is the bottleneck — not the technology. The economics are asymmetric',
    'Match capability to source — build / buy / borrow framework with 3 signals each',
    '5 core roles + 3 emerging — ML engineer · data scientist · MLOps · AI PM · AI lead, plus governance/prompt/ethicist',
    'Hire in a tight market — convert internal engineers, hire at senior-not-principal, source from adjacent fields',
    'Retain through interesting work + access + path + competitive comp — in that order',
    'The AI fluency build is the leverage — 5-10x payback vs hiring 1 senior engineer',
    'Pick the right org model — hub-and-spoke beats pure central or pure federated for 500+ organisations',
    '12-month talent roadmap with 4 trust trip-wires and an interactive builder for your CHRO or CEO',
  ],

  'ai-for-energy-utilities': [
    'AI must augment operational reliability, not threaten it — grid stability and worker safety are non-negotiable',
    '5 high-value plays — demand forecasting · grid management · generation optimisation · predictive maintenance · customer ops',
    'Keep operator-in-the-loop on grid management — NERC + FERC + PUC oversight makes it non-negotiable',
    'Run renewables forecasting and battery dispatch optimisation — where AI directly impacts revenue at scale',
    'Use AI to extend asset inspection intervals — never to eliminate them (OSHA + worker safety)',
    'Hold the customer disconnection line — AI flags, humans decide',
    'Treat OT + IT + AI cybersecurity as one problem — 4 attack vectors, 3 defensive patterns',
    '18-month rollout with 4 trust trip-wires and an interactive builder for your CIO, COO, or board',
  ],

  'ai-for-retail-ecommerce': [
    'AI scales fast in retail but breaks brand fast — trust costs more to rebuild than to maintain',
    '5 plays that ship — merchandising · pricing within guardrails · personalisation with the creepy line drawn · fulfilment + inventory · returns + fraud',
    '3 anti-plays to kill — fully automated dynamic pricing, surveillance personalisation, AI-only customer service',
    'Achieve top-quartile SKU-store forecasting (<20% MAPE) with hierarchical models and clean promo data',
    'Draw the pricing guardrails — exclude essentials in emergencies, avoid the personalised-list-price trap',
    'Run 3 personalisation tiers with the creepy line drawn explicitly — health, surveillance, inferred protected characteristics',
    'Protect brand voice with style-guide-as-system-prompt, 2 human edits, quarterly fingerprint audit, plus EU AI Act Art 50 disclosure',
    '12-month roadmap with 4 trust trip-wires and an interactive builder for your CEO, CDO, or CMO',
  ],

  'ai-for-cybersecurity-soc': [
    'AI is an analyst force multiplier — not an analyst replacement',
    '5 SOC plays — alert triage · detection augmentation · investigation · threat intel · automation',
    '3 anti-plays — fully autonomous response, AI-only detection, AI as substitute for SOC maturity',
    'Run alert triage with shadow review on suppressed alerts — false-negative rate is the truth indicator',
    'Layered detection retained — signatures + rules + AI augmentation (never AI alone)',
    'Apply verification discipline to AI threat intel — Mata cross-domain (hallucinated attribution is real)',
    'Limit autonomous response to narrow reversible scenarios — broader requires human-in-the-loop',
    'Defend AI\'s own attack surface — 4 attack vectors, 4 defensive patterns, including model behaviour monitoring',
  ],

  'ai-for-public-sector': [
    'In government, AI must serve the public and be accountable to it — citizens cannot easily switch suppliers',
    '5 public-sector plays — service delivery · case work augmentation · fraud detection · intelligent search · translation + accessibility',
    '3 fail patterns — algorithmic decisions affecting rights without human review, chatbot misrepresentation, opaque high-stakes AI',
    'Hold the case-worker decision boundary — AI prepares, humans decide on rights',
    'Apply bias-audit discipline to fraud detection across protected categories before deployment',
    'Verify AI-cited sources before acting (Mata cross-domain) and enforce access controls in AI search',
    'Maintain a public AI inventory with impact assessments and named accountable officials — OMB M-24-10 + EU AI Act + UK ATRS',
    '18-month roadmap with 4 trust trip-wires that protect due process and citizen trust',
  ],

  'ai-in-pharma-life-sciences': [
    'AI accelerates discovery and operations within GxP guardrails — patient safety + data integrity + regulatory accountability are non-negotiable',
    '5 plays — discovery · trial operations · regulatory submission · pharmacovigilance + RWE · commercial + medical affairs',
    'Honestly read the AI discovery disappointment pattern — AI accelerates early stages, not guarantees clinical success',
    'Keep investigator + medical monitor accountable under GCP — AI assists, humans decide',
    'Apply citation discipline to AI-drafted regulatory content — every citation verified (Mata cross-domain), Part 11 audit trail',
    'Preserve medical review on PV — qualified safety physician\'s causality assessment cannot be replaced by AI',
    'Run AI promotional content through MLR — off-label suggestions and unsourced claims are enforcement targets',
    'Validate AI in GxP contexts — 4 validation components and audit-ready documentation before deployment',
  ],

  'ai-product-management': [
    'AI products are evaluated like products — not like models. Users care about their job, not your benchmarks',
    '5 capabilities for AI PMs — JTBD framing · eval harnesses · telemetry · guardrails · honest communication',
    '3 anti-patterns to avoid — chasing benchmarks, shipping without eval + telemetry, adding AI to features that worked fine without it',
    'Frame each AI feature with the 3-part frame — user job · success criterion · failure modes — in 3 sentences',
    'Build eval harnesses across 3 categories — task-specific, quality + safety, production telemetry — refreshed monthly',
    'Use the acceptance rate metric as your primary AI product signal, with privacy-reviewed telemetry',
    'Refusal as feature — narrow products that do their job well beat broad products that do many jobs poorly',
    'Model unit economics before launch (inference is not free) and adopt an honest communication posture (Air Canada cross-domain)',
  ],
}
