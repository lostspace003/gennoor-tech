/* Chapter 1: Discovery & Business Value */
chapter('ch1', '1. Discovery & Business Value', 'core',
  '<p><b>Board meeting, Week 1.</b> The CFO presents a slide: "AI initiative budget: $2.4M over 12 months. Expected: measurable ROI across clinical operations, claims processing, and customer service. Your first task: run discovery workshops with each business unit and produce an architecture proposal that passes the governance review board."</p>' +
  '<p>You have eight weeks to surface requirements, evaluate architectures, and justify the investment. Here is what you must master.</p>' +

  concept('1.1 Structured discovery and requirements gathering', {
    what: 'Discovery is the disciplined process of surfacing business goals, technical constraints, compliance requirements, and measurable success criteria <i>before</i> designing a solution. It produces the input that architects use to make defensible trade-offs.',
    why: 'Enterprise AI projects fail when solutions are built before the problem is understood. Discovery prevents misalignment: a chatbot optimized for speed when accuracy was the real priority, or a deployment that ignores a hard HIPAA constraint discovered two weeks before launch.',
    how: 'Facilitated stakeholder workshops elicit latency tolerance, accuracy thresholds, compliance regimes, budget ceilings, and failure scenarios. The architect documents explicit success criteria (e.g., "p95 latency under 800ms at 5,000 req/day") and constraint hierarchies (e.g., "HIPAA compliance is non-negotiable; cost is flexible").',
    analogy: 'Imagine designing a bridge. Discovery is the geotechnical survey: soil composition, water table depth, seismic risk. You cannot pick steel vs. concrete until you know what the ground will support.',
    example: 'At Meridian, the clinical documentation team states: "We need sub-3-second responses during patient consultations, and we cannot store PHI in any system without a signed BAA." These two constraints immediately eliminate several candidate architectures.',
    arch: 'Discovery feeds into the Architecture Decision Record (ADR) process: workshops produce requirements; ADRs document how specific designs satisfy (or fail) those requirements, which alternatives were considered, and what trade-offs were accepted.',
    when: 'Run discovery <i>first</i>, before prototyping, before vendor selection, before committing budget to a specific model tier. Defer detailed implementation until success criteria are documented and signed off.',
    exam: 'Questions ask which activities belong in discovery (workshops, constraint documentation, success-criteria definition) versus later phases (dashboard tuning, implementation, promotion). Trap: conflating "building a quick prototype" with discovery—prototyping <i>validates</i> a hypothesis formed during discovery, it does not replace the requirements-gathering phase.'
  }) +
  anim('d_discovery') +

  concept('1.2 Functional vs. non-functional requirements', {
    what: '<b>Functional requirements</b> describe <i>what</i> the system must do (classify tickets, extract invoice fields, draft responses). <b>Non-functional requirements</b> specify <i>how well</i> it must do it (p95 latency, accuracy threshold, compliance posture, cost ceiling).',
    why: 'Exam questions test whether you recognize the difference. A requirement like "must respond under 800ms at p95" is non-functional (a quality attribute), not functional (a behavior). Missing non-functional requirements leads to systems that work but fail to meet operational, cost, or compliance SLAs.',
    how: 'During discovery, separate stakeholder requests into two lists: (1) Functional: "The system must route tickets into these 12 categories." (2) Non-functional: "Categorization must achieve 95% accuracy; p99 latency under 1.5s; must support 10,000 tickets/day without degradation."',
    example: 'Meridian\'s claims unit says: (Functional) "Extract claim number, provider ID, service date, billed amount from scanned PDFs." (Non-functional) "Process 50,000 claims/day; accuracy ≥98%; cost under $0.03/claim; maintain audit trail for 7 years."',
    exam: 'Typical trap: calling a latency SLA a functional requirement. Remember: functional = the <i>task</i>; non-functional = the <i>quality bar, performance target, or operational constraint</i>.'
  }) +
  tbl(['Requirement type', 'Characteristics', 'Examples'], [
    ['Functional', 'Describes system behavior and outputs', 'Classify support tickets; extract structured fields from invoices; generate draft email responses; route requests to specialist teams'],
    ['Non-functional', 'Describes quality attributes, constraints, and operational SLAs', 'p95 latency &lt;800ms; accuracy ≥95%; cost &lt;$0.10/request; HIPAA-compliant storage; audit retention for 7 years; support 10k concurrent users']]) +

  concept('1.3 Business value pillars', {
    what: 'A structured framework for categorizing and quantifying AI deployment outcomes across five dimensions: <b>Efficiency</b> (higher throughput per person-hour), <b>Productivity</b> (better output quality or reduced rework), <b>Transformation</b> (workforce redeployment to higher-value work), <b>Solution Cost</b> (per-transaction API/infrastructure spend), and <b>Performance SLA</b> (latency, uptime, accuracy targets).',
    why: 'Enterprise AI investments require board-level justification. The value-pillar framework translates technical capabilities into business outcomes executives can evaluate and prioritize. It also exposes trade-offs: a design that cuts solution cost by 50% but violates the performance SLA is not viable.',
    how: 'Map each stakeholder statement to its pillar: "We process 3× more orders per person per day" → Efficiency. "We redeployed staff from data entry to strategic vendor analysis" → Transformation. "API costs are 40% over budget" → Solution Cost. "Latency averages 12s against our 3s SLA" → Performance SLA. Evaluate architectures by whether they improve the prioritized pillars without regressing mandatory ones.',
    analogy: 'Think of the pillars as a balanced scorecard for AI. Just as a company optimizes profit, growth, and customer satisfaction simultaneously (with trade-offs), an AI architecture optimizes efficiency, cost, and SLA compliance—but must honor the hierarchy (e.g., SLA compliance before cost reduction).',
    example: 'Meridian\'s customer operations unit reports: Efficiency pillar = 2.8× more inquiries handled per agent per shift. Transformation pillar = agents shifted from answering FAQs to resolving complex escalations. Solution Cost pillar = per-inquiry cost rose from $0.02 (manual) to $0.09 (Claude-assisted). Performance SLA pillar = p95 response time 1.2s (within the 3s SLA). The cost increase is justified by efficiency and transformation gains.',
    exam: 'Questions present four statements and ask which pillar each maps to (question 61). Common traps: confusing Efficiency (throughput) with Productivity (quality), or Solution Cost (API spend) with Performance SLA (latency). Memorize the five pillars and their distinct definitions.'
  }) +
  tbl(['Pillar', 'Definition', 'Example metric'], [
    ['Efficiency', 'Higher throughput per person-hour or resource unit', '3× more purchase orders processed per FTE per day'],
    ['Productivity', 'Better output quality, fewer errors, less rework', 'Escalation rate drops from 18% to 6%; first-contact resolution up 22%'],
    ['Transformation', 'Workforce redeployment from low-value to strategic tasks', 'Staff shifted from manual data entry to vendor negotiation and analytics'],
    ['Solution Cost', 'Per-transaction or per-request API and infrastructure spend', 'API cost per claim: $0.08 (target: $0.05); monthly Azure spend: $12k'],
    ['Performance SLA', 'Latency, uptime, accuracy, and other technical quality targets', 'p95 latency: 1.2s (SLA: 3s); accuracy: 96% (target: 95%); uptime: 99.7%']]) +
  examNote('Expect one question asking you to classify four statements into their pillars. Read carefully: "processes 3× more X per person" = Efficiency; "staff redeployed to strategic work" = Transformation; "per-transaction cost over budget" = Solution Cost; "latency against SLA" = Performance SLA.') +

  concept('1.4 SLA elimination as a gating criterion', {
    what: 'When a mandatory Service-Level Agreement (latency, accuracy, compliance) is stated upfront, any candidate architecture that fails to meet that SLA must be <b>eliminated immediately</b>, before evaluating cost, convenience, or incremental quality gains. SLA compliance is a <i>gate</i>, not a trade-off variable.',
    why: 'In regulated or mission-critical environments, violating an SLA can mean regulatory penalties, patient harm, or contractual breach. Optimizing cost or quality <i>after</i> violating an SLA is architectural malpractice. The exam tests whether you recognize that SLA constraints override optimization goals.',
    how: '(1) Read the question stem for mandatory SLAs (e.g., "responses must be under 3 seconds," "HIPAA compliance required"). (2) Eliminate any option that violates the SLA, no matter how attractive its other attributes. (3) Among survivors, compare cost, complexity, and quality.',
    analogy: 'An elevator must support 2,000 lbs safely (the SLA). A design that costs 30% less but supports only 1,500 lbs is not a trade-off to evaluate—it is disqualified. You optimize aesthetics and energy efficiency <i>among</i> designs that meet the weight limit.',
    example: 'Question 9 (from the bank): Architecture X scores higher on quality but averages 4.2s per response; Architecture Y scores slightly lower but averages 2.1s. The clinical SLA mandates sub-3s responses. Architecture X is eliminated on SLA grounds—its quality advantage is irrelevant. You then evaluate Architecture Y against the efficiency and solution-cost pillars.',
    when: 'Apply SLA elimination whenever the question explicitly states a hard constraint (compliance regime, latency target, accuracy floor, budget ceiling). If the question says "nice to have" or "preferred," it is an optimization variable, not a gate.',
    exam: 'Trap: selecting an answer that offers a "better" result (lower cost, higher quality) while silently violating a stated SLA. The correct answer acknowledges the SLA violation <i>in the reasoning</i>: "Architecture X must be eliminated because it exceeds the 3-second SLA; Architecture Y meets the SLA and should then be evaluated on cost and efficiency."'
  }) +
  anim('d_sla_gate') +

  concept('1.5 Architecture Decision Records (ADRs)', {
    what: 'An ADR is a lightweight document capturing <i>one</i> significant architectural decision: what was decided, why, what alternatives were considered, and what trade-offs were accepted. It is the durable record that future teams use to understand past choices.',
    why: 'Six months after a decision, the people who made it may be gone, the Slack thread is buried, and the meeting notes are vague. ADRs preserve the <i>context and rationale</i> so the next architect understands not just <i>what</i> was chosen but <i>why</i> the rejected alternatives did not fit.',
    how: 'Template: (1) Title and date. (2) Context: the problem and constraints. (3) Decision: what was chosen. (4) Alternatives considered: the other options and why they were rejected. (5) Consequences: the trade-offs accepted (e.g., "We chose Haiku for speed; accepted: lower reasoning quality on edge cases"). Store ADRs in version control alongside code.',
    example: 'Meridian ADR-07: "Use Claude Enterprise + BAA + ZDR for claims processing. Context: Claims contain PHI; HIPAA compliance is mandatory. Decision: Enterprise tier with signed BAA and Zero Data Retention. Alternatives: (A) Claude Pro—rejected, no BAA. (B) Self-hosted OSS model—rejected, accuracy 12 points lower. Consequences: Higher per-token cost ($0.12 vs $0.08) accepted for compliance."',
    exam: 'Question 16 tests whether you recognize that an ADR missing its alternatives/trade-offs section is <i>incomplete</i>. The correct response is to ask the author to add those sections before publishing, not to approve it as-is or defer them to a follow-up.'
  }) +

  '<h3>1.6 Discovery outputs and stakeholder alignment</h3>' +
  '<p>At the end of discovery, you deliver three artifacts to the governance board:</p>' +
  '<ol><li><b>Requirements document</b> – functional requirements, non-functional requirements (SLAs, accuracy, cost), compliance constraints (HIPAA/SOC2/PCI), and explicitly stated priorities (e.g., "Accuracy first; cost flexible within ±20%").</li><li><b>Success criteria</b> – measurable thresholds that gate production deployment (e.g., "≥95% classification accuracy on the test set; p95 latency &lt;800ms; cost &lt;$0.10/request").</li><li><b>Stakeholder register</b> – who owns each business unit, who approves architecture decisions, who signs off compliance, who gets notified at phase gates.</li></ol>' +
  examNote('Questions on continuity (question 25) test whether you carry forward the evaluation framework and stakeholder register across phases, or whether you lock early decisions immutably (wrong—architectures evolve). Best practices: maintain the stakeholder register and notify at gates; capture lessons learned and surface them as inputs to the next phase; carry forward the evaluation dataset to measure progress.') +

  kc('ch1'));
