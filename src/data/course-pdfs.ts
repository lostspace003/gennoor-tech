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
  enablementNote: string // single sentence about the paired engagement
  pilotPriceBand?: string // e.g., "$12k-30k SMB / $40k-120k Enterprise"
  pilotTimeline?: string // e.g., "4 weeks, fixed scope"
}

const STANDARD_ENABLEMENT_PRICE = '$12k–30k SMB · $40k–120k Enterprise'
const STANDARD_ENABLEMENT_TIMELINE = '4 weeks, fixed scope'

// =====================================================================
// TRACK 1 — FOUNDATIONS
// =====================================================================

export const aiFoundationsForEveryone: CoursePdf = {
  slug: 'ai-foundations-for-everyone',
  title: 'AI Foundations for Everyone',
  subtitle: 'The vocabulary, the realistic capabilities, and where AI fits in your everyday work.',
  track: 'foundations',
  trackLabel: 'Foundations',
  audience: 'All employees, including non-technical staff and new joiners',
  duration: '~60 min self-paced read',
  pages: 48,
  outcomes: [
    'Speak the same AI vocabulary as your most technical colleagues — without becoming one',
    'Explain in plain English how LLMs actually work, where they fail, and why',
    'Identify five places AI helps in your specific role, this week',
    'Evaluate AI vendor claims using a four-question filter — separate signal from hype',
    'Run your first three Copilot prompts on your own work, confidently',
  ],
  modules: [
    { number: '01', title: 'What AI is and isn\'t', topics: ['The vocabulary you need (no jargon)', 'AI vs ML vs LLM vs Agent — clear distinctions', 'Three honest things AI can\'t do today'] },
    { number: '02', title: 'How LLMs work — in plain English', topics: ['Pattern matching at scale, not magic', 'Why hallucinations happen', 'Context windows, tokens, costs explained simply'] },
    { number: '03', title: 'Where AI fits in everyday work', topics: ['Five universal use cases across roles', 'When NOT to use AI', 'The 80/20 of personal productivity gains'] },
    { number: '04', title: 'Privacy, ethics, and what to share', topics: ['What stays in the model, what leaves your org', 'The three things you never paste into a chatbot', 'Your company\'s AI policy translated'] },
    { number: '05', title: 'Evaluating AI claims', topics: ['The four questions to ask any AI demo', 'Spotting cherry-picked examples', 'Where consultants overpromise'] },
    { number: '06', title: 'Hands-on with Copilot', topics: ['Your first three prompts on real work', 'The "explain it back to me" trick', 'When to verify vs trust'] },
    { number: '07', title: 'Where to go next', topics: ['A 30-day learning sprint', 'Internal community building', 'Career resilience in the AI era'] },
  ],
  enablementNote:
    'Pairs with our Copilot Kickstart pilot — we train a small team on your data and ship a working prompt library across one department in four weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
}

export const genAiForBusiness: CoursePdf = {
  slug: 'generative-ai-for-business',
  title: 'Generative AI for Business',
  subtitle: 'GenAI without the code — how managers run a credible internal AI conversation.',
  track: 'foundations',
  trackLabel: 'Foundations',
  audience: 'Managers, team leads, business analysts',
  duration: '~50 min self-paced read',
  pages: 40,
  outcomes: [
    'Frame GenAI value in P&L terms — not feature lists',
    'Run a structured use-case discovery workshop with your team',
    'Build a one-page business case using the four ROI patterns',
    'Evaluate three competing vendors using a fixed scorecard',
    'Sequence a pilot that the CFO will actually fund',
  ],
  modules: [
    { number: '01', title: 'GenAI explained without code', topics: ['Capability spectrum: text, image, code, multimodal', 'What makes a problem GenAI-shaped', 'Two-by-two of AI vs human judgment'] },
    { number: '02', title: 'The ROI conversation', topics: ['Four ROI patterns that consistently work', 'Avoiding vanity metrics', 'Quantifying productivity gains honestly'] },
    { number: '03', title: 'Use case discovery', topics: ['The five-question filter', 'Workshop template (90 min)', 'Prioritizing high-value vs high-feasibility'] },
    { number: '04', title: 'Vendor evaluation', topics: ['The scorecard (12 criteria)', 'Reference checks that surface real problems', 'Pricing models compared'] },
    { number: '05', title: 'Pilot design', topics: ['The 4-week pilot template', 'Success metrics agreed upfront', 'Sunset criteria — when to kill a pilot'] },
    { number: '06', title: 'Adoption playbook', topics: ['Why most GenAI pilots stall', 'Three change-management plays that work', 'Measuring sustained adoption past month-three'] },
  ],
  enablementNote:
    'Pairs with our GenAI Discovery sprint — a senior consultant works with your leadership team to land a prioritized roadmap with three pilot specs in two weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
}

export const aiLiteracyNonTech: CoursePdf = {
  slug: 'ai-literacy-non-technical',
  title: 'AI Literacy for Non-Technical Teams',
  subtitle: 'For HR, Marketing, Sales, Ops — your specific work, your specific wins.',
  track: 'foundations',
  trackLabel: 'Foundations',
  audience: 'Individual contributors in HR, Marketing, Sales, Operations',
  duration: '~45 min self-paced read',
  pages: 36,
  outcomes: [
    'Demystify five AI buzzwords your boss uses in meetings',
    'Develop prompting as a transferable workplace skill',
    'Identify three AI helpers specific to your function — today',
    'Recognize four risks before they become incidents',
    'Walk into Monday with 10 prompts to try',
  ],
  modules: [
    { number: '01', title: 'Demystifying AI for non-technical work', topics: ['Five buzzwords decoded', 'What "the AI did this" actually means', 'Where your judgment still matters most'] },
    { number: '02', title: 'Prompting as a skill', topics: ['Five-part prompt structure', 'Iteration, not one-shot', 'The role and context trick'] },
    { number: '03', title: 'Where AI helps you specifically', topics: ['Function-specific AI assists', 'Personal productivity vs team productivity', 'When asking AI is faster than asking a colleague'] },
    { number: '04', title: 'The risks you should know', topics: ['Confidentiality and what stays internal', 'Hallucination patterns to spot', 'When to escalate to IT'] },
    { number: '05', title: '10 prompts to try Monday morning', topics: ['Email drafting templates', 'Meeting summary patterns', 'Research and synthesis prompts'] },
  ],
  enablementNote:
    'Pairs with our Team Workshop Day — half-day on-site session where we work alongside your team on their actual files for the rest of the week.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '1-day workshop + 2 weeks coaching',
}

// =====================================================================
// TRACK 2 — BY FUNCTION
// =====================================================================

export const aiForHr: CoursePdf = {
  slug: 'ai-for-hr-people-teams',
  title: 'AI for HR & People Teams',
  subtitle: 'Where AI helps HR — and where bias and compliance traps make it dangerous.',
  track: 'function',
  trackLabel: 'By Function',
  audience: 'HR leaders, L&D managers, people operations, HR business partners',
  duration: '~65 min self-paced read',
  pages: 56,
  outcomes: [
    'Name four HR AI plays sequenced over 18 months + the fifth pattern HR should refuse',
    'Run four-component bias monitoring on AI-assisted recruiting',
    'Deploy onboarding copilots with three integrity disciplines',
    'Hold the line on policy Q&A — where AI helps, where it doesn\'t',
    'Build the works council framework that protects deployment and people',
  ],
  modules: [
    { number: '01', title: 'Where AI fits in HR', topics: ['Four HR AI plays + the fifth to refuse', 'The bias-trap framing', 'Sequencing across 18 months'] },
    { number: '02', title: 'Recruiting AI', topics: ['Three helps · three non-uses', 'Four-component bias monitoring', 'Vendor evaluation specifically for HR'] },
    { number: '03', title: 'Onboarding copilots', topics: ['Three components + 30-day journey', 'Four success metrics', 'Three integrity disciplines'] },
    { number: '04', title: 'Policy Q&A — three categories', topics: ['Corpus discipline (what\'s in, what\'s out)', 'Hidden value to HR itself', 'Citation patterns'] },
    { number: '05', title: 'L&D personalisation', topics: ['Three components', 'Three bias risks', 'Three honest metrics'] },
    { number: '06', title: 'Performance and feedback', topics: ['Three legitimate helps', 'Three lines HR doesn\'t cross', 'The feedback loop that actually compounds'] },
    { number: '07', title: 'Compliance, data, works council', topics: ['Three rules · three principles · three sustainability patterns', 'Works council framework', 'When legal must be in the room'] },
    { number: '08', title: 'Capstone — Your HR AI roadmap', topics: ['Six-section one-page roadmap', 'Three executive conversations to unlock', 'KPI scaffold'] },
  ],
  enablementNote:
    'Pairs with our HR Onboarding Copilot pilot — we wire a working onboarding agent into your tenant in four weeks, integrated with your existing HRIS.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
}

export const aiForFinance: CoursePdf = {
  slug: 'ai-for-finance-accounting',
  title: 'AI for Finance & Accounting',
  subtitle: 'Close, consolidation, invoice, forecasting, audit — where AI ships and where data quality stops it cold.',
  track: 'function',
  trackLabel: 'By Function',
  audience: 'CFOs, controllers, FP&A leaders, accountants',
  duration: '~70 min self-paced read',
  pages: 60,
  outcomes: [
    'Run AI inside the financial close without breaking control posture',
    'Deploy invoice and document AI with a three-tier human-in-loop',
    'Build two-layer forecasting (ML + LLM signal) that planners actually use',
    'Apply AI to audit and anomaly detection — without replacing judgment',
    'Pass the data-quality gate before any AI deployment',
  ],
  modules: [
    { number: '01', title: 'The Finance AI fit map', topics: ['Six plays that ship · three that disappoint', 'The data-stable filter', 'Where AI replaces vs augments'] },
    { number: '02', title: 'Close and consolidation AI', topics: ['Three close-cycle accelerators', 'Anomaly detection patterns', 'Control posture preserved'] },
    { number: '03', title: 'Invoice and document AI', topics: ['Three doc types that ship · one that overpromises', 'Three-tier human-in-loop', 'Four-component audit posture'] },
    { number: '04', title: 'Forecasting with AI', topics: ['Two-layer model (ML on history + LLM on unstructured signal)', 'Four-check data-readiness gate', 'Three-component planner handoff'] },
    { number: '05', title: 'Audit and anomaly detection', topics: ['Where statistical methods still beat AI', 'The hybrid pattern that compounds', 'Explainability that auditors accept'] },
    { number: '06', title: 'Tax and compliance copilots', topics: ['Three boring use cases that work', 'Three to deliberately skip', 'Regulatory posture for AI in tax'] },
    { number: '07', title: 'Risk management', topics: ['Three risks AI improves', 'Three risks AI introduces', 'The board-ready risk dashboard'] },
    { number: '08', title: 'Capstone — Your Finance AI roadmap', topics: ['Two-quarter sequenced plan', 'Operational KPIs (not AI metrics)', 'Four conversations Monday'] },
  ],
  enablementNote:
    'Pairs with our Invoice Extraction pilot + Forecasting Custom Build — we deploy document AI in your ERP and stand up the two-layer forecasting model in eight weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
}

export const aiForSalesMarketing: CoursePdf = {
  slug: 'ai-for-sales-marketing',
  title: 'AI for Sales & Marketing',
  subtitle: 'Six plays that ship value · three that consistently disappoint · the AI-spam math collapsing the industry.',
  track: 'function',
  trackLabel: 'By Function',
  audience: 'CROs, CMOs, sales ops, demand gen, revenue operations',
  duration: '~65 min self-paced read',
  pages: 52,
  outcomes: [
    'Apply the one principle that filters 60% of AI vendor pitches in 10 seconds',
    'Run the disciplined prospecting workflow that doubles response rate vs AI-spam',
    'Deploy two-layer lead scoring with the six-check CRM data quality gate',
    'Generate proposals with three guardrails (CRM grounding · claim register · legal-review gate)',
    'Hold the creepy line on personalization — relevant beats clever, every time',
  ],
  modules: [
    { number: '01', title: 'The revenue-AI fit map', topics: ['Six plays that ship · three that disappoint', 'AI augments judgment, never replaces', 'Vendor-pitch filter'] },
    { number: '02', title: 'AI in prospecting', topics: ['Three useful uses · the AI-spam math', 'Disciplined 3-component workflow', 'Why response rates collapse 2.5% → 0.4%'] },
    { number: '03', title: 'Lead scoring with AI', topics: ['Two scoring layers (ML + LLM signal)', 'Six-check CRM data quality gate', 'Three-band score-to-action split'] },
    { number: '04', title: 'Proposal generation', topics: ['Four-block template', 'Three guardrails (grounding, claim register, legal-review)', 'Where the recovered time should go'] },
    { number: '05', title: 'Content production — at scale, on brand', topics: ['Brand voice anchor (style guide as system prompt + edit passes + quarterly audit)', 'Four brand risks', 'Three-stage content pipeline'] },
    { number: '06', title: 'Personalization that works', topics: ['Three tiers (light, middle, deep)', 'Three creepy-line categories', 'Relevant beats clever'] },
    { number: '07', title: 'Sales call AI', topics: ['Four extractions per call', 'Three-stage coaching loop', 'Four-component privacy posture'] },
    { number: '08', title: 'Capstone — 2-quarter sales AI portfolio', topics: ['Three plays sequenced', 'Four KPIs · two cadences', 'Four conversations Monday'] },
  ],
  enablementNote:
    'Pairs with our Sales Proposal Generator pilot — branded, CRM-grounded proposal generation deployed in your CRM in four weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
}

export const aiForCustomerService: CoursePdf = {
  slug: 'ai-for-customer-service-support',
  title: 'AI for Customer Service & Support',
  subtitle: 'Three patterns that ship · two that drop CSAT 15–25 points · the support-not-surveillance line.',
  track: 'function',
  trackLabel: 'By Function',
  audience: 'CX leaders, contact-centre operators, support managers',
  duration: '~65 min self-paced read',
  pages: 48,
  outcomes: [
    'Apply the principle — AI handles volume, humans handle judgment — to every vendor pitch',
    'Deploy four-component agent assist with the six-week rollout rhythm',
    'Scope tier-1 deflection bots (intent inventory · 3 scope rules · clean handoff)',
    'Architect multilingual support that handles code-switching at scale',
    'Hold the line: AI never has final say on safety / escalation actions',
  ],
  modules: [
    { number: '01', title: 'The CS-AI fit map', topics: ['Three patterns that ship · two that backfire', 'The principle (volume vs judgment)', 'Vendor-pitch test in 10 seconds'] },
    { number: '02', title: 'Agent assist done right', topics: ['Four-component stack', 'Three anti-patterns the agents will tell you about', 'Six-week rollout rhythm'] },
    { number: '03', title: 'Scoped tier-1 deflection bots', topics: ['Intent inventory test (top 10 = 60%+?)', 'Three scope rules (whitelist · turn cap · emotional escalation exit)', 'Clean-handoff design'] },
    { number: '04', title: 'Multilingual support at scale', topics: ['Language reality vs vendor specs', 'Code-switching production patterns', 'Three production gotchas (latency · accent · cultural calendar)'] },
    { number: '05', title: 'Knowledge AI — without hallucinated policies', topics: ['Three grounding disciplines', 'KB-quality gate (atomic articles + same-day versioning + audit)', 'Three citation patterns'] },
    { number: '06', title: 'Sentiment, escalation, frontline trust', topics: ['Three support-not-surveillance principles', 'Escalation logic teams rely on', 'Three team-trust signals'] },
    { number: '07', title: 'Voice support AI', topics: ['Three voice plays', 'Three production gotchas (latency · accent · interruption)', 'Three-component disclosure'] },
    { number: '08', title: 'Capstone — 4-week CS AI pilot plan', topics: ['One play deeply', 'KPI scaffold (4 numbers · 2 cadences)', 'Four conversations Monday'] },
  ],
  enablementNote:
    'Pairs with our Multilingual Customer Support Agent pilot — we deploy agent assist + scoped tier-1 deflection in your contact centre in four weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
}

export const aiForOps: CoursePdf = {
  slug: 'ai-for-operations-supply-chain',
  title: 'AI for Operations & Supply Chain',
  subtitle: 'Six plays that ship · three pitches that disappoint · the data-stable filter that sequences your roadmap.',
  track: 'function',
  trackLabel: 'By Function',
  audience: 'COOs, supply chain directors, plant managers, logistics heads',
  duration: '~70 min self-paced read',
  pages: 56,
  outcomes: [
    'Run the data-stable filter (data ready · process stable) per play before any AI investment',
    'Deploy two-layer demand forecasting with the four-check data-readiness gate',
    'Run procurement document AI with the three-tier human-in-loop + four-component audit posture',
    'Frame AI as the OR amplifier — never the OR replacement — in logistics',
    'Ingest five supplier risk signal sources and run the four-phase response cadence',
  ],
  modules: [
    { number: '01', title: 'The ops-AI fit map', topics: ['Six plays that ship · three pitches that disappoint', 'Data-stable filter', 'Sequence over 2-4 quarters'] },
    { number: '02', title: 'Demand forecasting with AI', topics: ['Two-layer model (ML + LLM signal)', 'Four-check data-readiness gate', 'Planner handoff that lands adoption'] },
    { number: '03', title: 'Procurement document AI', topics: ['Three doc types that ship · contracts overpromise', 'Three-tier human-in-loop', 'Four-component audit posture'] },
    { number: '04', title: 'Logistics optimisation', topics: ['AI amplifies OR — never replaces it', 'Three plays that ship', 'Three situations to NOT deploy'] },
    { number: '05', title: 'Predictive maintenance', topics: ['Sensor-plus-narrative pattern (never sensor-only)', 'Three vendor traps', 'CMMS handoff'] },
    { number: '06', title: 'Inventory intelligence', topics: ['Stock-outs and overstock as the same problem', 'Four velocity tiers · differentiated safety stock', 'Cadence-matched action formats'] },
    { number: '07', title: 'Supplier risk + visibility', topics: ['Five signal sources (news · financial · trade · climate · tier-2)', 'Dashboard discipline', 'Four-phase response cadence'] },
    { number: '08', title: 'Capstone — 2-quarter ops AI roadmap', topics: ['Procurement Q1 · forecasting Q2', 'Operational KPIs not AI metrics', 'Four conversations Monday'] },
  ],
  enablementNote:
    'Pairs with our Forecasting Custom Build + Predictive Maintenance pilot — two parallel 6-week tracks landing both plays in production.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–10 weeks',
}

export const aiForLegal: CoursePdf = {
  slug: 'ai-for-legal-risk-compliance',
  title: 'AI for Legal, Risk & Compliance',
  subtitle: 'Contract review · regulatory monitoring · compliance copilots — with hallucination risk surfaced honestly.',
  track: 'function',
  trackLabel: 'By Function',
  audience: 'General Counsels, compliance officers, risk leaders',
  duration: '~60 min self-paced read',
  pages: 52,
  outcomes: [
    'Apply contract review AI with paralegal-in-loop pattern that preserves privilege',
    'Set up regulatory monitoring that flags only what matters across jurisdictions',
    'Deploy compliance copilots without inheriting hallucination risk',
    'Protect IP and confidentiality across vendor and model layers',
    'Govern AI vendors using a five-clause contract template',
  ],
  modules: [
    { number: '01', title: 'Contract review AI', topics: ['Three contract categories where AI ships', 'The paralegal-in-loop pattern', 'Privilege preservation across vendor layers'] },
    { number: '02', title: 'Regulatory monitoring', topics: ['Multi-jurisdictional signal extraction', 'Noise vs signal filters', 'When AI alerts, when humans decide'] },
    { number: '03', title: 'Compliance copilots', topics: ['Three copilot patterns that ship', 'Three that consistently fail', 'Audit-ready posture'] },
    { number: '04', title: 'IP and confidentiality', topics: ['What goes to the model, what stays', 'Training data leak risk', 'Vendor-tier IP protections'] },
    { number: '05', title: 'Audit trail and hallucination risk', topics: ['The retrieval-only architecture', 'Citation discipline', 'Three categories that compound liability'] },
    { number: '06', title: 'Vendor governance', topics: ['Five contract clauses non-negotiable', 'Re-evaluation cadence', 'Exit clauses for AI vendors'] },
  ],
  enablementNote:
    'Pairs with our Compliance Copilot pilot — domain-grounded compliance assistant deployed against your specific regulatory corpus in five weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
}

// =====================================================================
// TRACK 3 — LEADERSHIP
// =====================================================================

export const aiStrategyCsuite: CoursePdf = {
  slug: 'ai-strategy-c-suite',
  title: 'AI Strategy for the C-Suite',
  subtitle: 'Where AI value lives · how to allocate capital · the seven board conversations.',
  track: 'leadership',
  trackLabel: 'Leadership',
  audience: 'CEOs, CIOs, CDOs, CSOs',
  duration: '~50 min self-paced read',
  pages: 44,
  outcomes: [
    'Identify where AI value actually lives in your business (and where it doesn\'t)',
    'Build the AI portfolio across efficiency · revenue · risk · talent',
    'Allocate capital using the four ROI patterns',
    'Redesign org and talent for the AI era — without a hiring freeze',
    'Brief your board with a one-page AI portfolio document',
  ],
  modules: [
    { number: '01', title: 'Where AI value lives', topics: ['Four value pools', 'The classic value-trap', 'Where AI is overpromised in 2026'] },
    { number: '02', title: 'Building the AI portfolio', topics: ['Four-quadrant prioritization', 'Sequence for compounding returns', 'When to stop a portfolio play'] },
    { number: '03', title: 'Capital allocation', topics: ['Annual vs quarterly capital cycles', 'OpEx vs CapEx for AI', 'When to outsource vs build'] },
    { number: '04', title: 'Talent and org design', topics: ['Roles AI changes most', 'Hiring for AI literacy', 'AI fluency for senior leaders'] },
    { number: '05', title: 'Governance', topics: ['Light vs heavy governance', 'Where the COO and CRO meet', 'Three controls boards expect now'] },
    { number: '06', title: 'Sustaining momentum', topics: ['Why most AI programs stall in year two', 'The yearly review structure', 'Renewal vs reinvention'] },
    { number: '07', title: 'Capstone — Board reporting', topics: ['One-page AI portfolio doc', 'Seven board conversations to schedule', 'KPIs that survive scrutiny'] },
  ],
  enablementNote:
    'Pairs with our AI Strategy Workshop — two-day on-site session with the C-suite landing a 24-month portfolio and the first three pilot specs.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '2-day workshop + 2 weeks follow-up',
}

export const aiGovernanceBoards: CoursePdf = {
  slug: 'ai-governance-risk-boards',
  title: 'AI Governance & Risk for Boards',
  subtitle: 'What boards should ask, what to require, and how to report on AI risk without becoming technical.',
  track: 'leadership',
  trackLabel: 'Leadership',
  audience: 'Board directors, audit committee chairs, risk committee chairs',
  duration: '~50 min self-paced read',
  pages: 32,
  outcomes: [
    'Carry five questions into the next audit committee meeting',
    'Anchor on ISO 42001 internally · map to NIST, EU AI Act, GCC frameworks',
    'Apply the six-category AI risk taxonomy with one sharp question per category',
    'Read a one-page AI board pack: 8 numbers · 4 narratives',
    'Ratify a one-page AI governance charter the next time the board sits',
  ],
  modules: [
    { number: '01', title: 'What boards should ask', topics: ['Five questions for every audit committee', 'Three governance failures before the incident'] },
    { number: '02', title: 'The framework landscape', topics: ['NIST · ISO 42001 · EU AI Act · GCC', 'How they map to one another', 'Five ISO 42001 clauses translated to board agenda'] },
    { number: '03', title: 'AI risk taxonomy', topics: ['Six categories with owners and controls', 'One sharp board question per category'] },
    { number: '04', title: 'Reporting and metrics', topics: ['Eight-number quarterly board pack', 'What does NOT belong on the board page'] },
    { number: '05', title: 'Vendor and third-party risk', topics: ['Five vendor risks unique to foundation models', 'Six contract clauses non-negotiable'] },
    { number: '06', title: 'Incident response', topics: ['Four-phase response framework', 'Five board-only actions'] },
    { number: '07', title: 'The board\'s own AI competence', topics: ['Why AI is now material to director duty', 'Four moves to build competence — without becoming engineers'] },
    { number: '08', title: 'Capstone — Your AI governance charter', topics: ['Five-section ratifiable charter', 'Three-meeting adoption sequence (audit · full board · ratify)'] },
  ],
  enablementNote:
    'Pairs with our Board AI Briefing — pre-board prep session walking through the framework, the questions, and your live AI portfolio against the taxonomy.',
  pilotPriceBand: '$15k–$40k briefing engagement',
  pilotTimeline: '2 weeks',
}

export const aiRoiBusinessCase: CoursePdf = {
  slug: 'ai-roi-business-case',
  title: 'AI ROI & Business Case Building',
  subtitle: 'Four ROI patterns · honest cost modeling · risk-adjusted returns · CFO-ready cases.',
  track: 'leadership',
  trackLabel: 'Leadership',
  audience: 'Finance partners, PMOs, business case authors, CFOs',
  duration: '~55 min self-paced read',
  pages: 40,
  outcomes: [
    'Apply the four ROI patterns to any AI investment proposal',
    'Quantify productivity gains without inflating them',
    'Build cost models that survive CFO scrutiny (TCO, FinOps, hidden costs)',
    'Calculate risk-adjusted returns including reputational and regulatory tails',
    'Draft business cases using a one-page template tested in three industries',
  ],
  modules: [
    { number: '01', title: 'The four ROI patterns', topics: ['Cost takeout · revenue uplift · risk reduction · capacity unlock', 'When each applies', 'Combining patterns without double-counting'] },
    { number: '02', title: 'Quantifying productivity gains', topics: ['Time-saved fallacies', 'Time-recovered to value conversion', 'Calibration against past automation programs'] },
    { number: '03', title: 'Cost modeling', topics: ['TCO including hidden costs', 'FinOps for AI workloads', 'Cost-attribution by use case'] },
    { number: '04', title: 'Risk-adjusted returns', topics: ['Tail risk quantification', 'Reputational and regulatory loss scenarios', 'Sensitivity analysis'] },
    { number: '05', title: 'Sample business cases', topics: ['Three worked examples (BFSI · Manufacturing · Healthcare)', 'Common ROI traps illustrated', 'CFO challenge questions and answers'] },
    { number: '06', title: 'Capstone — Your business case template', topics: ['One-page format', 'Backing-detail appendix', 'Review-cycle checklist'] },
  ],
  enablementNote:
    'Pairs with our Business Case Workshop — two-day session with your Finance and PMO teams building your top-three AI cases against the template.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '2-day workshop + 2 weeks',
}

// =====================================================================
// TRACK 4 — INDUSTRY
// =====================================================================

export const aiFinancialServices: CoursePdf = {
  slug: 'ai-in-financial-services',
  title: 'AI in Financial Services',
  subtitle: 'Fraud, KYC/AML, credit scoring, claims, advisor copilots — under regulator-aware rails.',
  track: 'industry',
  trackLabel: 'By Industry',
  audience: 'BFSI leaders — banks, insurance, capital markets, payments',
  duration: '~70 min self-paced read',
  pages: 60,
  outcomes: [
    'Deploy fraud detection that beats classical rules without breaking explainability',
    'Run KYC/AML AI within regulator expectations across India, GCC, and EU',
    'Apply AI to credit scoring with bias monitoring built in',
    'Stand up claims processing copilots with adjuster judgment preserved',
    'Build advisor copilots that pass the suitability test',
  ],
  modules: [
    { number: '01', title: 'Fraud detection AI', topics: ['ML + LLM signal layering', 'Explainability for examiners', 'False-positive cost discipline'] },
    { number: '02', title: 'KYC / AML', topics: ['Document AI for onboarding', 'Watchlist screening at scale', 'Regulator-aware deployment'] },
    { number: '03', title: 'Credit scoring', topics: ['Where AI improves scorecards · where it doesn\'t', 'Four-component bias monitoring', 'Adverse action notices that hold up'] },
    { number: '04', title: 'Claims processing', topics: ['Document AI for claims', 'Fraud signal layered into claims', 'Adjuster-in-loop discipline'] },
    { number: '05', title: 'Advisor copilots', topics: ['Wealth and retail advisor patterns', 'Suitability and recommendation framework', 'Audit trail for advice'] },
    { number: '06', title: 'Regulatory reporting', topics: ['AI in RegTech', 'Cross-jurisdiction patterns (RBI · MAS · DFSA · FCA)', 'Generated reports that auditors trust'] },
    { number: '07', title: 'Open banking and embedded AI', topics: ['API + LLM integration patterns', 'Consent-first design', 'Cross-bank intelligence safely'] },
    { number: '08', title: 'Capstone — BFSI AI portfolio', topics: ['Sequenced 24-month plan', 'Regulator engagement strategy', 'Three executive conversations'] },
  ],
  enablementNote:
    'Pairs with our Loan Origination Agent pilot + Multimodal RAG for Banking — both in production within eight weeks against your regulator posture.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–10 weeks',
}

export const aiHealthcare: CoursePdf = {
  slug: 'ai-in-healthcare',
  title: 'AI in Healthcare',
  subtitle: 'Four healthcare AI plays · the one line we don\'t cross · PHI patterns · clinical governance.',
  track: 'industry',
  trackLabel: 'By Industry',
  audience: 'Hospital administrators, chief medical informatics officers, hospital CIOs',
  duration: '~65 min self-paced read',
  pages: 56,
  outcomes: [
    'Name the four healthcare AI plays + the careful fifth (clinical decision support)',
    'Defend the line — AI never makes the final clinical decision',
    'Deploy clinical documentation AI with three integrity disciplines',
    'Build patient journey copilots with red-flag threshold catalogue + warmth-by-design',
    'Govern PHI across three deployment patterns with six healthcare contract clauses',
  ],
  modules: [
    { number: '01', title: 'Where AI fits in healthcare', topics: ['Four plays + the careful fifth', 'The one line we don\'t cross', 'Three traps'] },
    { number: '02', title: 'Clinical documentation AI', topics: ['Three components incl. selective ambient capture', 'Physician-sign discipline', 'Three integrity disciplines'] },
    { number: '03', title: 'Patient journey copilots', topics: ['Four touchpoints + red-flag thresholds', 'Warmth-by-design', 'Three failure modes'] },
    { number: '04', title: 'Imaging AI — with the radiologist', topics: ['Three maturity categories', 'Radiologist-first workflow', 'Four imaging vendor questions'] },
    { number: '05', title: 'Operations and pharmacy AI', topics: ['Three funding plays', 'Four-phase build pattern', 'Honest financial numbers'] },
    { number: '06', title: 'PHI and data sovereignty', topics: ['Three deployment patterns', 'Minimum-necessary discipline', 'Six healthcare contract clauses'] },
    { number: '07', title: 'Regulator posture and clinical governance', topics: ['FDA SaMD · EU MDR · GCC frameworks', 'Three governance responsibilities', 'Three regulator moves'] },
    { number: '08', title: 'Capstone — Hospital AI roadmap', topics: ['Six-section one-page roadmap', 'Three quarter-1 conversations', 'Medical staff committee playbook'] },
  ],
  enablementNote:
    'Pairs with our Clinical Documentation Assistant pilot — ambient capture + signed-by-physician workflow deployed in one ward in six weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–8 weeks',
}

export const aiManufacturing: CoursePdf = {
  slug: 'ai-in-manufacturing',
  title: 'AI in Manufacturing',
  subtitle: 'Six plant-floor plays that ship · three pitches that disappoint on the shop floor · the OT/IT bridge filter.',
  track: 'industry',
  trackLabel: 'By Industry',
  audience: 'Plant managers, VPs of manufacturing, plant operations directors',
  duration: '~70 min self-paced read',
  pages: 56,
  outcomes: [
    'Apply the OT/IT bridge filter (data accessible · data quality usable · culture supports)',
    'Deploy predictive maintenance with sensor-plus-narrative pattern',
    'Run quality vision AI with three-stage operator labelling loop',
    'Build process optimisation with operator-led experiments + three overfitting guards',
    'Hold the line: AI never has final say on safety actions (charter required)',
  ],
  modules: [
    { number: '01', title: 'The manufacturing-AI fit map', topics: ['Six plant-floor plays that ship · three pitches that disappoint', 'OT/IT bridge filter'] },
    { number: '02', title: 'Predictive maintenance for plants', topics: ['Three sensor coverage decisions', 'Narrative layer the engineer acts on', 'Three project killers'] },
    { number: '03', title: 'Quality vision AI', topics: ['Three messy-real-world challenges (lighting · drift · novel defects)', 'Three-stage operator labelling loop', 'False-confidence year-2 failure mode'] },
    { number: '04', title: 'Process optimisation with AI', topics: ['Three signals (multi-parameter interactions · drift · best-shift patterns)', 'Operator-led experiment design', 'Three overfitting guards'] },
    { number: '05', title: 'Plant-floor supply chain integration', topics: ['Three signal flows', 'Three re-planning cadences', 'Three failure modes'] },
    { number: '06', title: 'Safety AI', topics: ['Three use cases (PPE · near-miss · ergonomic)', 'Three failure modes specific to safety', 'The line nobody crosses · safety AI charter'] },
    { number: '07', title: 'Digital twin — pragmatic, not megaproject', topics: ['Three targeted twins that ship in 4–6 months', 'Three megaproject traps', 'Three discipline rules'] },
    { number: '08', title: 'Capstone — 12-month plant AI roadmap', topics: ['Q1 PdM + quality vision', 'Q2–Q4 ranging plays', 'OEE + quality KPIs (not AI metrics)'] },
  ],
  enablementNote:
    'Pairs with our Predictive Maintenance pilot — sensor + narrative deployment on one critical equipment in eight weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–8 weeks',
}

export const aiGovernment: CoursePdf = {
  slug: 'ai-in-government',
  title: 'AI in Government & Public Sector',
  subtitle: 'Citizen services · case management · data sovereignty · multilingual · GCC Vision alignment.',
  track: 'industry',
  trackLabel: 'By Industry',
  audience: 'Public sector CIOs, transformation leads, ministry of digital transformation',
  duration: '~65 min self-paced read',
  pages: 56,
  outcomes: [
    'Deploy citizen-services AI under public-trust framework',
    'Run case management copilots with explainability sufficient for FOI requests',
    'Architect for data sovereignty across cloud and on-prem',
    'Handle multilingual delivery in Arabic, English, Swahili, Tamil, and beyond',
    'Align AI investments with GCC Vision 2030 / national digital strategies',
  ],
  modules: [
    { number: '01', title: 'Citizen services AI', topics: ['Where AI improves service delivery · where it doesn\'t', 'Trust signals citizens look for', 'Multi-channel architecture'] },
    { number: '02', title: 'Case management', topics: ['Caseworker copilots · not replacement', 'FOI-grade explainability', 'Three caseload patterns'] },
    { number: '03', title: 'Data sovereignty', topics: ['Cloud · sovereign cloud · on-prem patterns', 'Cross-border data restrictions', 'Vendor posture under sovereignty laws'] },
    { number: '04', title: 'Multilingual delivery at scale', topics: ['Languages your citizens actually use', 'Code-switching production reality', 'Dialect register matching'] },
    { number: '05', title: 'Procurement of AI in government', topics: ['Six contract clauses unique to public sector', 'Vendor lock-in mitigation', 'Audit posture from RFP forward'] },
    { number: '06', title: 'GCC Vision alignment', topics: ['Mapping AI investments to Vision 2030 / national strategies', 'Reporting framework', 'Cross-ministry coordination'] },
    { number: '07', title: 'Public-trust framework', topics: ['Transparency commitments', 'Citizen feedback loop', 'Incident response with public communication'] },
  ],
  enablementNote:
    'Pairs with our Citizen Services Copilot pilot — multilingual government chatbot deployed against a real service in six weeks under sovereignty constraints.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–8 weeks',
}

export const aiEducation: CoursePdf = {
  slug: 'ai-in-education',
  title: 'AI in Education',
  subtitle: 'Personalized learning · campus operations · academic integrity · regional language models.',
  track: 'industry',
  trackLabel: 'By Industry',
  audience: 'University administrators, EdTech leaders, ministry of education staff',
  duration: '~60 min self-paced read',
  pages: 48,
  outcomes: [
    'Deploy personalized learning AI without replacing teacher judgment',
    'Run campus operations AI (admissions · scheduling · facilities)',
    'Handle academic integrity in the AI era — assessment redesign',
    'Apply assessment AI that surfaces struggle, not just grades',
    'Use regional language models for non-English instruction',
  ],
  modules: [
    { number: '01', title: 'Personalized learning', topics: ['Where adaptive learning ships value', 'Three traps in personalized AI', 'Teacher-in-loop design'] },
    { number: '02', title: 'Campus operations', topics: ['Admissions copilots', 'Scheduling and timetabling', 'Facilities and maintenance AI'] },
    { number: '03', title: 'Academic integrity', topics: ['Assessment redesign for the AI era', 'AI detection tools (what they actually do)', 'Policy frameworks that work'] },
    { number: '04', title: 'Assessment AI', topics: ['Beyond multiple choice', 'Surface struggle patterns', 'Equity in automated grading'] },
    { number: '05', title: 'Regional language models', topics: ['Arabic · Tamil · Swahili · Bengali instruction', 'Code-switching for bilingual classrooms', 'Building tutoring assistants in low-resource languages'] },
    { number: '06', title: 'Capstone — Your education AI plan', topics: ['One-year sequenced roadmap', 'Teacher engagement strategy', 'Parent communication template'] },
  ],
  enablementNote:
    'Pairs with our Education Tutoring Assistant pilot — adaptive learning copilot for one course / one cohort in six weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–8 weeks',
}

// =====================================================================
// TRACK 5 — BUILDER
// =====================================================================

export const promptEngineering: CoursePdf = {
  slug: 'prompt-engineering-practitioners',
  title: 'Prompt Engineering for Practitioners',
  subtitle: 'Principles · structured outputs · function calling · evaluation · prompt versioning.',
  track: 'builder',
  trackLabel: 'Builder',
  audience: 'Developers, analysts, power users building with LLMs',
  duration: '~55 min self-paced read',
  pages: 44,
  requirements: 'Working knowledge of one programming language + an LLM API key (OpenAI · Anthropic · Azure OpenAI)',
  outcomes: [
    'Apply five prompting principles that consistently improve output quality',
    'Get reliable structured outputs (JSON · XML · typed responses) from LLMs',
    'Use function calling and tool use safely',
    'Build chain-of-thought patterns that don\'t hide failures',
    'Stand up an evaluation harness for prompt regressions',
  ],
  modules: [
    { number: '01', title: 'Prompting principles', topics: ['Specificity · constraints · examples · iteration · separation of concerns', 'Common anti-patterns'] },
    { number: '02', title: 'Structured outputs', topics: ['JSON mode and limitations', 'Schema validation post-LLM', 'Recovery from malformed outputs'] },
    { number: '03', title: 'Function calling and tool use', topics: ['Defining tools well', 'Tool selection accuracy', 'Tool-use evaluation'] },
    { number: '04', title: 'Chain-of-thought', topics: ['When it helps · when it hurts', 'Hidden CoT vs visible', 'Chain-of-verification'] },
    { number: '05', title: 'Evaluation', topics: ['Golden set construction', 'Automated eval patterns', 'Human-in-loop calibration'] },
    { number: '06', title: 'Prompt versioning', topics: ['Treating prompts as code', 'A/B testing prompts', 'Rollback patterns'] },
  ],
  enablementNote:
    'Pairs with our Prompt Engineering Workshop — three-day developer bootcamp using your actual application as the working dataset.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '3-day workshop + 2 weeks',
}

export const copilotStudio: CoursePdf = {
  slug: 'building-ai-agents-copilot-studio',
  title: 'Building AI Agents with Copilot Studio',
  subtitle: 'Architecture · topics vs generative · plugins · agents · MCP · Dataverse · ALM · governance.',
  track: 'builder',
  trackLabel: 'Builder',
  audience: 'Power Platform developers, citizen developers, solution architects, Copilot Studio admins',
  duration: '~75 min self-paced read',
  pages: 60,
  requirements: 'Microsoft 365 + Power Platform tenant access. Familiarity with Power Automate is helpful but not required.',
  outcomes: [
    'Make three architectural decisions explicitly at the start of every agent',
    'Apply the four-question framework for topics vs generative answers',
    'Deploy plugins with the four-component auth model + three failure-mode patterns',
    'Ground agents in Dataverse with RLS + field-level security + cross-role test',
    'Pass the 12-item production-gate checklist before deployment',
  ],
  modules: [
    { number: '01', title: 'Copilot Studio architecture', topics: ['Six components and where each runs', 'Three architectural decisions at the start', 'Governance touchpoints from day one'] },
    { number: '02', title: 'Topics vs generative answers', topics: ['Four-question framework per intent', 'The topic-explosion anti-pattern', 'The hybrid pattern most production agents converge to'] },
    { number: '03', title: 'Plugins and connectors at production scale', topics: ['Three connector patterns', 'Four-component auth model', 'Three production failure modes'] },
    { number: '04', title: 'Agents and agent flows', topics: ['Three differences (state, reasoning, tool composition)', 'Three orchestration patterns', 'State isolation under concurrent load'] },
    { number: '05', title: 'Knowledge sources, MCP, Dataverse', topics: ['Three knowledge source types', 'MCP integration with per-agent scope-down', 'Dataverse RLS + field-level security'] },
    { number: '06', title: 'Deployment, ALM, environments', topics: ['Three-environment promotion path', 'Three solution rules', 'Three pipeline patterns matched to scale'] },
    { number: '07', title: 'Governance and monitoring at scale', topics: ['Three governance layers', 'Five monitoring signals', 'Three estate-management rhythms'] },
    { number: '08', title: 'Capstone — Production-grade agent', topics: ['Three-section design document', '12-item production-gate checklist', 'Four conversations Monday'] },
  ],
  enablementNote:
    'Pairs with our Copilot Studio Production Pilot — design + build + ship one production-grade agent through your governance gates in five weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
}

export const m365Copilot: CoursePdf = {
  slug: 'm365-copilot-adoption',
  title: 'Microsoft 365 Copilot Adoption Playbook',
  subtitle: 'Persona-based licensing · 4-week pilot template · prompt libraries · governance · 90-day rollout plan.',
  track: 'builder',
  trackLabel: 'Builder',
  audience: 'IT leaders, change managers, modern-workplace owners',
  duration: '~70 min self-paced read',
  pages: 40,
  outcomes: [
    'Name three reasons most Copilot rollouts stall at 10–20% — none about technology',
    'Run persona-based licensing math that saves 30–50% on year-1 spend',
    'Execute the 4-week pilot template that funds the wider rollout',
    'Build persona-based prompt libraries — the asset that makes Copilot stick',
    'Defend the 90-day rollout plan to the executive sponsor next week',
  ],
  modules: [
    { number: '01', title: 'The Copilot adoption problem', topics: ['Three honest reasons rollouts stall', 'What 70% adoption actually looks like', 'Three roles that determine the outcome'] },
    { number: '02', title: 'Licensing strategy', topics: ['Persona-based sizing (3 personas)', 'Year-1 spend cut of 30–50%', 'How to push back on vendor blanket-license pressure'] },
    { number: '03', title: 'Pilot design for Copilot', topics: ['4-week pilot template', 'Three Copilot-specific mistakes', 'Week-4 presentation that funds the rollout'] },
    { number: '04', title: 'Persona-based prompt libraries', topics: ['Structure (anchor + role + workflow prompts)', 'Where content comes from', 'Three governance rules'] },
    { number: '05', title: 'Governance and the IT conversation', topics: ['30-day IT prep sprint (sensitivity labels · DLP · SharePoint audit)', 'IT–change-manager working relationship', 'Three classical conflicts resolved'] },
    { number: '06', title: 'Measurement in steady state', topics: ['Four steady-state numbers', 'Three reporting cadences', 'Three early-warning signals'] },
    { number: '07', title: 'Scaling and the second wave', topics: ['Three readiness signals', 'Second-wave deployment pattern', 'Three traps'] },
    { number: '08', title: 'Capstone — 90-day Copilot rollout plan', topics: ['Three 30-day phases · three deliverables', 'Four conversations week one', 'What comes after launch'] },
  ],
  enablementNote:
    'Pairs with our Copilot Kickstart engagement — persona-based licensing, prompt library, and pilot launched together in four weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: STANDARD_ENABLEMENT_TIMELINE,
}

export const claudeCodeDevelopers: CoursePdf = {
  slug: 'claude-code-for-developers',
  title: 'Claude Code for Developers',
  subtitle: 'Agentic coding · CLAUDE.md context · Claude API · RAG · MCP · production deployment.',
  track: 'builder',
  trackLabel: 'Builder',
  audience: 'Software engineers, ML engineers, AI application developers',
  duration: '~24 hours hands-on (bootcamp format) · or ~80 min self-paced read of this catalog brief',
  pages: 60,
  requirements: 'Claude Pro/Team subscription · Anthropic API key with credits · Node.js + Python 3.10+ · VS Code · Claude Code installed via npm · Git · Docker',
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
}

export const mlForecasting: CoursePdf = {
  slug: 'ml-forecasting-for-business',
  title: 'Machine Learning & Forecasting for Business',
  subtitle: 'When to use ML vs LLM · forecasting fundamentals · Azure ML basics · the data reality.',
  track: 'builder',
  trackLabel: 'Builder',
  audience: 'Analysts, BI leaders, ops planners, finance modelers',
  duration: '~65 min self-paced read',
  pages: 52,
  outcomes: [
    'Apply the four-question filter: ML vs LLM vs neither',
    'Build forecasting models that operations planners actually use',
    'Use Azure ML to stand up a working pipeline in one week',
    'Evaluate models honestly (MAPE, WAPE, sMAPE — and the trap each hides)',
    'Deploy ML in production with MLOps appropriate to your scale',
  ],
  modules: [
    { number: '01', title: 'When to use ML vs LLM vs neither', topics: ['Four-question filter', 'Three problem shapes', 'When statistical methods beat both'] },
    { number: '02', title: 'Forecasting fundamentals', topics: ['Time-series structure (level · trend · seasonality · residual)', 'Classical methods (ARIMA · Prophet · ETS)', 'When to introduce ML'] },
    { number: '03', title: 'Azure ML basics', topics: ['Workspace setup', 'Compute and dataset patterns', 'AutoML and when to use it · when to skip'] },
    { number: '04', title: 'Model evaluation', topics: ['Beyond MAPE — WAPE, sMAPE, bias detection', 'Holdout strategy', 'When the model is wrong in production'] },
    { number: '05', title: 'MLOps for your scale', topics: ['Model versioning', 'Deployment patterns (batch vs real-time)', 'Monitoring drift'] },
    { number: '06', title: 'Deploying ML in production', topics: ['The path from notebook to production', 'Three failure modes specific to ML', 'Maintenance economics'] },
    { number: '07', title: 'The data reality', topics: ['Data quality vs model complexity trade-off', 'Three data fixes that beat new models', 'When to spend on data, when on modeling'] },
  ],
  enablementNote:
    'Pairs with our Custom ML Build — if your team needs more than reading this, our engineers build the model with you in 6–10 weeks.',
  pilotPriceBand: STANDARD_ENABLEMENT_PRICE,
  pilotTimeline: '6–10 weeks',
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
