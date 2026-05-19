import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2,
  Compass,
  GraduationCap,
  Lightbulb,
  Hammer,
  RefreshCcw,
  Network,
  ArrowRight,
  Check,
  X,
  Clock,
  Target,
  Activity,
  AlertCircle,
  ShieldCheck,
  FileText,
  Globe,
  Layers,
  Users,
} from 'lucide-react'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'
import ThreePledges from '@/components/ThreePledges'

export const metadata: Metadata = {
  title: 'Enterprise AI Transformation Programs — From Diagnostic to Sustained Adoption',
  description:
    'Enterprise AI transformation partner for organizations 250+ employees. Six engagement models from Strategic Diagnostic to AI Center of Excellence. Procurement-ready, governance-grade, senior delivery across GCC, India, Africa.',
  keywords: [
    'enterprise AI consulting',
    'AI transformation partner',
    'AI Center of Excellence',
    'enterprise AI strategy',
    'AI Vision 2030',
    'AI governance enterprise',
    'AI MSA procurement',
    'multi-quarter AI program',
    'enterprise Copilot rollout',
    'AI roadmap board',
  ],
  alternates: { canonical: 'https://gennoor.com/solutions/for-enterprise' },
  openGraph: {
    title: 'Enterprise AI Transformation — From Diagnostic to Sustained Adoption',
    description: 'Six engagement models for enterprise AI transformation. Procurement-ready, governance-grade, senior delivery.',
    url: 'https://gennoor.com/solutions/for-enterprise',
  },
}

// ────────────────────────────────────────────────────────────────────────────
// ENGAGEMENT MODELS — deep
// ────────────────────────────────────────────────────────────────────────────

const engagements = [
  {
    code: 'E1',
    name: 'Strategic AI Diagnostic',
    icon: Compass,
    phase: 'Phase 1 · Diagnose',
    price: '$25k–$80k',
    duration: '4 weeks',
    promise:
      'A board-ready AI transformation plan grounded in your organization, not benchmarks from someone else\'s industry.',
    problem:
      'Your board is asking about AI strategy. Your CIO has six vendor decks on their desk. Two business units have already started shadow-IT pilots. Procurement wants a master vendor. Audit wants a governance framework. You need a single, credible, defensible plan that aligns the org — and you need it before next quarter\'s board meeting.',
    delivers: [
      {
        title: 'Executive & operating-team interview synthesis',
        detail:
          '15–25 structured interviews across C-suite, function heads, IT leadership, audit/risk, and two business-unit operating teams. Output is a confidential synthesis of where the organization stands — not the polite version.',
      },
      {
        title: 'AI Readiness Index — 5 dimensions, scored',
        detail:
          'Strategy, Data, People, Tech, Governance — each scored 1–5 with evidence and benchmarked against peer organizations in your sector and region (GCC, India, Africa anonymized peer set).',
      },
      {
        title: 'Use Case Backlog — 30+ candidates, scored',
        detail:
          'Sourced from interviews, your strategy documents, and our reference patterns. Each scored on impact × feasibility × regulatory risk × time-to-value. Output is a quadrant chart your board will recognize.',
      },
      {
        title: '18-Month AI Roadmap with capital plan',
        detail:
          'Three waves of work over 18 months. Each wave has scoped use cases, budget envelope, FTE requirement, vendor decision, and success criteria. Designed to flow directly into your annual planning cycle.',
      },
      {
        title: 'AI Governance & Risk Charter',
        detail:
          'A 12–20 page charter covering: ethical use principles, role-based approvals, vendor governance, data-handling rules, incident response, audit trail. Aligned with NIST AI RMF, EU AI Act, and regional regulations (Saudi PDPL, India DPDP, UAE PDPL).',
      },
      {
        title: 'Executive Briefing Deck + Board Pack',
        detail:
          'Two artifacts. The briefing deck is for your leadership team. The board pack is a 6–8 page document designed to fit your board\'s reading rhythm — no animations, no walls of text, just the 7 questions a board needs answered.',
      },
      {
        title: 'On-site executive offsite facilitation (optional)',
        detail:
          'One-day strategy offsite, facilitated by us, to align your top team behind the roadmap. Off-the-record working sessions with a neutral facilitator who knows the AI domain.',
      },
    ],
    timeline: [
      { day: 'Week 1', task: 'Kickoff · stakeholder mapping · 8–12 interviews · data + tech inventory begins' },
      { day: 'Week 2', task: 'Remaining interviews · regulatory posture · current vendor inventory · use case generation' },
      { day: 'Week 3', task: 'Use case scoring workshop · roadmap drafting · governance charter draft' },
      { day: 'Week 4', task: 'Board pack drafting · executive readout · optional offsite · final delivery' },
    ],
    successLooks: [
      'CEO and CIO aligned on a single, written 18-month plan',
      'Board signs off on the AI capital allocation in one cycle',
      'Audit and Risk have a governance charter to assess vendors against',
      'Shadow-IT pilots either folded into the plan or shut down with reason given',
    ],
    realExample:
      'Ministry-level public sector body in the Kingdom of Saudi Arabia — 50+ senior executives. 10-day intensive program blending strategic diagnostic with Vision 2030 alignment. Outputs included AI Governance Charter, organizational AI maturity benchmark across participating bodies, AI Value Maps identifying quick wins and long-term impact, and a network of Saudi AI leaders. (Public-sector reference available under NDA in scoping conversation.)',
    notIncluded: [
      'Implementation of any use case (E3 onward)',
      'Vendor RFP execution (separate engagement)',
      'Org-design or hiring (different consulting scope)',
      'Data migration or platform consolidation (architecture work, separate)',
    ],
    pairsWith: 'E2 Executive & Functional Bootcamps — run in parallel to build literacy while strategy is being set · E3 Strategic Pilot — runs immediately after to demonstrate the roadmap is real',
  },
  {
    code: 'E2',
    name: 'Executive & Functional Bootcamps',
    icon: GraduationCap,
    phase: 'Phase 2 · Train',
    price: '$30k–$150k per program',
    duration: '3–10 days · multi-cohort',
    promise:
      'An AI-literate organization across levels — boards, executives, function leads, technical guilds — speaking the same language about strategy, risk, and ROI.',
    problem:
      'Your strategy is set, but the org isn\'t ready to execute. The board doesn\'t know what to ask about AI. The CEO is briefing analysts using buzzwords. Function heads are conflating Copilot with AGI. Your technical team is excited but uncoordinated. AI literacy is the bottleneck — and generic e-learning hasn\'t fixed it.',
    delivers: [
      {
        title: 'C-Suite & Board AI Bootcamp (3–5 days)',
        detail:
          'For CEOs, COOs, CFOs, CHROs, CDOs, and board directors. Strategy, governance, ROI, M&A under AI, talent & org design, board-level reporting. No code. Heavy on scenarios from peer organizations in your sector. Often run as a 5-day offsite.',
      },
      {
        title: 'Functional Cohorts (5–10 days each)',
        detail:
          'Separate tracks for HR, Finance, Sales/CX, Operations, Legal/Risk, IT/Engineering. Each track is built around the workflows of that function with custom labs using your data scenarios (anonymized). Cohort sizes 15–25 per track.',
      },
      {
        title: 'Technical Guild Track (5–10 days)',
        detail:
          'For your AI/ML engineering team and citizen developers. Topics: prompt engineering, agent design, RAG architecture, Copilot Studio, evaluation, MLOps. Hands-on labs on your stack of choice — Azure OpenAI, AWS Bedrock, Google Vertex, or open-source.',
      },
      {
        title: 'Custom curriculum with your data',
        detail:
          'Every cohort runs labs on anonymized scenarios from your actual operations — not generic "imagine a retail company" cases. We co-author the curriculum with one of your operating teams.',
      },
      {
        title: 'Post-bootcamp adoption playbooks per cohort',
        detail:
          'Each cohort leaves with a 30-90 day adoption plan, role-specific habit tracking, and a "phase 3 pilot scoping" session — every bootcamp ends with at least one named use case ready for E3 Strategic Pilot.',
      },
      {
        title: 'Microsoft & ecosystem partner engagement',
        detail:
          'Where relevant and welcome, we facilitate panels and demos with Microsoft, Microsoft Arabia, AWS, or industry guest speakers. Especially valuable for board and C-suite cohorts.',
      },
    ],
    timeline: [
      { day: 'Weeks 1–2', task: 'Curriculum customization · stakeholder onboarding · cohort selection · pre-reads' },
      { day: 'Weeks 3–4', task: 'C-Suite bootcamp delivery (3–5 days) · board engagement' },
      { day: 'Weeks 5–8', task: 'Functional cohorts in parallel · weekly progress with sponsors' },
      { day: 'Weeks 9–10', task: 'Technical guild track · pilot scoping sessions · 30/60/90 plan handover' },
    ],
    successLooks: [
      'Board members ask sharper questions about AI by week 4',
      'C-suite uses the same vocabulary as the technical team within 8 weeks',
      'Each function has a written 30-90 day adoption plan owned by an internal champion',
      'At least 3 pilots are scoped and ready to enter E3 by end of program',
    ],
    realExample:
      'MCIT, Kingdom of Saudi Arabia — 10-day AI Leadership Mastery program for 50+ senior executives across multiple ministries. Two weeks blending strategy with applied innovation. Executives left with actionable AI roadmaps for their organizations, organizational AI Governance Charters, and AI Value Maps identifying quick wins. Strategies aligned with Saudi Vision 2030 and national AI initiatives. (Named case study available on /case-studies.)',
    notIncluded: [
      'Building any production system (E3 onward)',
      'Ongoing L&D outside the bootcamp window (covered in E5 Sustain)',
      'Certification exam delivery (we prepare you; certifications are taken with the vendor directly)',
    ],
    pairsWith: 'E1 Strategic Diagnostic — bootcamp insights feed the roadmap, and vice versa · E3 Strategic Pilot — pilots scoped during bootcamp cohorts enter E3 directly',
  },
  {
    code: 'E3',
    name: 'Strategic Pilot',
    icon: Lightbulb,
    phase: 'Phase 3 · Innovate',
    price: '$50k–$180k',
    duration: '6–8 weeks',
    promise:
      'A working AI capability deployed inside your enterprise environment, evaluated under your governance, with a written go/no-go business case for scale.',
    problem:
      'You\'ve approved the use case. The vendor demos look great. But you\'ve been burned before — pilots that worked on the vendor\'s laptop but never made it to production because of data, integration, governance, or just plain politics. You want this pilot to be production-grade from day one.',
    delivers: [
      {
        title: 'Production-grade architecture from day one',
        detail:
          'Not a demo. Built on enterprise patterns — RBAC, secrets management, audit logging, observability, cost monitoring. Designed to scale; not designed to throw away.',
      },
      {
        title: 'Stack Fit Assessment (written, defensible)',
        detail:
          'Cloud LLM (Azure OpenAI, AWS Bedrock, Google Vertex) vs self-hosted open-source (Llama, Mistral, Phi). Cost per 1M tokens at projected scale. Latency targets. Sovereignty. Fine-tuning option. We deliver the assessment; you choose the path.',
      },
      {
        title: 'Multi-team coordination',
        detail:
          'Pilots typically involve 3–6 internal teams: business sponsor, IT, security, data team, end-users, audit. We run weekly steering committees and provide a single point of accountability across all of them.',
      },
      {
        title: 'Compliance & Risk pre-review',
        detail:
          'Before week 4, the pilot has been reviewed by your compliance and risk teams against the governance charter (delivered in E1 or shared at kickoff). Findings logged. Issues resolved before user testing.',
      },
      {
        title: 'Working system + evaluation harness',
        detail:
          'A working pilot in your environment that 25–100 users can interact with. Plus a continuously-running evaluation harness measuring accuracy, latency, cost, and user satisfaction.',
      },
      {
        title: 'Go/no-go business case for Phase 4',
        detail:
          'A 10–15 page business case at the end of the pilot. Quantified ROI, scaling assumptions, risk register, FTE and infra requirements at full scale. Designed for your investment committee, not for a sales pitch.',
      },
      {
        title: 'Code in your repository · IP yours',
        detail:
          'Every commit is in your repository from day one. We do not host. Your team has read access throughout, write access from week 4.',
      },
    ],
    timeline: [
      { day: 'Week 1', task: 'Kickoff · stakeholder alignment · Stack Fit · scope + acceptance criteria · governance pre-check' },
      { day: 'Week 2', task: 'Architecture sign-off · first slice (mockup → demo Friday) · data access workflow' },
      { day: 'Week 3', task: 'Core capability build · integration with 1–2 enterprise systems · evaluation harness up' },
      { day: 'Week 4', task: 'Compliance review · risk register · expanded user-feedback group' },
      { day: 'Week 5', task: 'Hardening · UAT · cost optimization sprint · stakeholder demo' },
      { day: 'Week 6', task: 'Final tuning · business case drafting · go/no-go readout · phase gate' },
      { day: 'Weeks 7–8', task: '(Optional extension for complex integrations or multi-team UAT)' },
    ],
    successLooks: [
      'A working pilot used by real internal users — not a vendor demo',
      'Compliance and Risk sign off without "but" attached',
      'Accuracy and cost metrics inside the targets defined at week 1',
      'A go/no-go business case approved by your investment committee',
      'Internal team can deploy a code change without us by end of pilot',
    ],
    realExample:
      'Tier-1 retail bank in India — multimodal RAG system for financial documents (banking transactions including SWIFT, IBAN, dates that pure vector search misses, plus charts that needed visual interpretation). 8-week pilot on Azure AI Search + Azure AI Vision + GPT-4o. Outcomes: 94.2% text accuracy, 91.8% chart understanding, 100% citation coverage, 2.1s average query speed. Business case approved for Phase 4 scale-out to 5 additional document categories.',
    notIncluded: [
      'Production scale-out to >100 users in this engagement (E4)',
      'Integration with more than 3 enterprise systems (extends scope)',
      'New use cases beyond the one scoped at kickoff (extends scope or new E3)',
      'Custom procurement processes for vendor onboarding (separate vendor mgmt scope)',
    ],
    pairsWith: 'E4 Transformation Program — the natural next step if pilot business case approves · E2 Functional Bootcamp — runs in parallel to prepare the receiving team',
  },
  {
    code: 'E4',
    name: 'Transformation Program',
    icon: Hammer,
    phase: 'Phase 4 · Build',
    price: '$150k–$600k+',
    duration: '9–20 weeks',
    promise:
      'A scaled, governed, production-grade AI capability owned and operated by your internal team — with a transition plan that is contractually obligated, not aspirational.',
    problem:
      'You have a pilot that works. Now you need it deployed at enterprise scale — across thousands of users, integrated into 5+ enterprise systems, monitored by SRE, governed by audit, and ultimately owned and operated by your internal team. And you cannot afford the typical SI pattern where the partner builds it and never leaves.',
    delivers: [
      {
        title: 'Production deployment on your subscription',
        detail:
          'Multi-environment (dev / staging / prod) on your Azure / AWS / GCP subscription. Infrastructure-as-code (Terraform / Bicep / CloudFormation). Network and identity in your topology, governed by your CISO.',
      },
      {
        title: 'CI/CD, MLOps, observability',
        detail:
          'Automated build/test/deploy pipelines. Model evaluation harness running on every release. Application Insights / DataDog / your observability stack integrated. Alerting tied to your existing on-call.',
      },
      {
        title: 'Co-build with your engineering team',
        detail:
          'Knowledge transfer is contractual, not optional. From week 1, your engineers shadow and pair on every commit. By Go-Live, your team has merged code, run a deployment, and resolved an incident — without us in the room.',
      },
      {
        title: 'Adoption & change management',
        detail:
          'A dedicated change-management workstream: communications plan, training cohorts, internal champion programs, adoption dashboards, executive reporting. Especially critical for org-wide rollouts.',
      },
      {
        title: 'Multi-team coordination & steering',
        detail:
          'Weekly steering committee. Fortnightly executive update. Quarterly board update if scope warrants. Single point of accountability across IT, security, data, business sponsor, and your operating teams.',
      },
      {
        title: 'Operations runbook + on-call handover',
        detail:
          'Written operations runbook owned by your team. Sample incidents resolved jointly. Your on-call rota updated to include this system. We extend hypercare for 4 weeks post Go-Live.',
      },
      {
        title: 'Adoption Metrics Dashboard',
        detail:
          'Power BI or your analytics stack. Daily active users, success rate by use case, cost per interaction, satisfaction scores. The system the business sponsor uses to report ROI quarterly.',
      },
    ],
    timeline: [
      { day: 'Weeks 1–2', task: 'Detailed solution architecture · environment provisioning · security & identity setup · change-management kickoff' },
      { day: 'Weeks 3–6', task: 'Core build · integration with enterprise systems · client-team co-build · weekly demos' },
      { day: 'Weeks 7–10', task: 'Hardening · scale testing · UAT cohorts · governance compliance verification' },
      { day: 'Weeks 11–14', task: 'Phased rollout (departments / regions / business units) · adoption tracking · iteration' },
      { day: 'Weeks 15–18', task: 'Full deployment · knowledge transfer verification · runbook finalization' },
      { day: 'Weeks 19–20', task: 'Go-Live · 4-week hypercare begins · sustained-state transition to client team' },
    ],
    successLooks: [
      'System operating in production with target SLAs met for 30+ days',
      'Internal team has resolved at least 3 production incidents without us',
      'Adoption metrics dashboard showing sustained usage curve, not a launch-spike',
      'Cost per interaction inside the budget envelope set at E3',
      'Business sponsor reporting quarterly ROI to leadership using the dashboard',
    ],
    realExample:
      'East African central bank — 10-day AI Agents Implementation program for digital innovation team, followed by a multi-quarter co-build for AI agents in banking automation (multi-agent systems with blockchain integration for clearing). Knowledge transfer was contractual; internal team took full ownership of operations within 4 months. (Anonymized for confidentiality; named reference under NDA.)',
    notIncluded: [
      'Ongoing operations beyond hypercare (covered by E5 Sustain)',
      'Brand-new use cases beyond the scaled pilot (new E3 → E4 cycle)',
      'Custom hardware or air-gapped infrastructure procurement (we deliver on what you provide)',
      'Custom enterprise app development outside the AI surface (separate engineering scope)',
    ],
    pairsWith: 'E5 Enterprise Sustain — strongly recommended, contracted at Go-Live · E6 AI CoE — natural next step when the org wants to standardize AI capability internally',
  },
  {
    code: 'E5',
    name: 'Enterprise Sustain',
    icon: RefreshCcw,
    phase: 'Phase 5 · Sustain',
    price: '$15k–$60k/month',
    duration: 'Annual contract · quarterly cadence',
    promise:
      'Every system you deployed still performing — technically, economically, organizationally — through model evolution, regulatory shifts, and organizational change.',
    problem:
      'You\'ve scaled three AI systems to production. Models are drifting. Token spend has tripled. Two regulations changed last quarter. Your AI champion just left for a competitor. And the next board meeting is asking what happens if your vendor disappears. You need a senior partner in the room — not 24/7 managed services, but the right expertise at the right cadence.',
    delivers: [
      {
        title: 'Quarterly Health Check per system (1–3 days each)',
        detail:
          'Model evaluation on a refreshed test set. Drift analysis. Cost & token audit. Security & governance refresh. Output: written Health Report with prioritized action list and executive summary.',
      },
      {
        title: 'Monthly steering review',
        detail:
          'Senior practitioner in your steering room every month. AI portfolio status, risk review, vendor performance review, upcoming use case pipeline. Designed to fit your existing governance rhythm.',
      },
      {
        title: 'Continuous L&D refresh',
        detail:
          'Quarterly micro-learning drops for each cohort trained in E2. New techniques (e.g., new model releases, new agent patterns). Plus refresher workshops for new joiners in critical functions.',
      },
      {
        title: 'Annual Strategy Day',
        detail:
          'One full day per year — in person or virtual — planning the next 12 months of AI work. AI portfolio expansion, retirement decisions, budget alignment, capability gap analysis.',
      },
      {
        title: 'New Use Case Incubation Pipeline',
        detail:
          'Continuous pipeline of new use cases identified, scored, and triaged. Use cases that pass triage move into new E3 Strategic Pilot engagements (priced separately from the retainer).',
      },
      {
        title: 'Regulatory & Compliance Refresh',
        detail:
          'Quarterly review of regulatory changes (EU AI Act, NIST AI RMF, regional rules — Saudi PDPL, India DPDP, UAE PDPL). Update of governance charter as needed. Annual audit-readiness pack.',
      },
      {
        title: 'Vendor & Cost Optimization Review',
        detail:
          'Quarterly audit of LLM vendor mix, model selection, caching strategy, prompt compression, batch opportunities. Typical savings cover 30–60% of the retainer cost in year one.',
      },
      {
        title: 'Incident response (4-hour SLA for sev-1)',
        detail:
          'Senior practitioner reachable within 4 hours for severity-1 incidents. Not a 24/7 MSP — a senior expert within hours, every time.',
      },
    ],
    timeline: [
      { day: 'Month 1', task: 'Baseline assessment across all deployed systems · stakeholder mapping · retainer rhythm setup' },
      { day: 'Monthly', task: 'Steering review · async support · ad-hoc consultation' },
      { day: 'Quarterly', task: 'Full health check per system · written report · regulatory refresh · cost audit' },
      { day: 'Annually', task: 'Strategy day · capability gap analysis · next-year budget planning support' },
    ],
    successLooks: [
      'Performance metrics across all systems flat or improving year over year',
      'Total AI cost trending down as a % of value delivered',
      'Zero regulatory non-compliance findings in audits',
      'New use case pipeline producing 2–4 new E3 Pilots per year',
      'Internal AI champion turnover does not cause capability loss',
    ],
    realExample:
      'Multi-business-unit conglomerate in GCC — $42k/month Enterprise Sustain across 4 deployed AI systems. In year one: caught a $180k/year token-spend optimization opportunity (model right-sizing + caching), led the response to a regional regulatory update, retrained two functional cohorts after their original champions moved internally.',
    notIncluded: [
      'Building new use cases (handled through new E3 engagements)',
      '24/7 on-call / managed services (not an MSP)',
      'Long-form custom development sprints (handled through E3 / E4)',
    ],
    pairsWith: 'Contracted at every E4 Go-Live · Often combined with E6 AI CoE as the operating engine',
  },
  {
    code: 'E6',
    name: 'AI Center of Excellence (CoE) Setup',
    icon: Network,
    phase: 'Cross-Phase · Capability Building',
    price: '$80k–$250k',
    duration: '12–20 weeks',
    promise:
      'A functioning internal AI Center of Excellence your organization owns and operates — charter, operating model, tooling, governance, and the first 90 days of operating cadence.',
    problem:
      'You\'ve done 2–3 AI projects with external partners. Each was good. Each was disconnected. There\'s no shared platform, no shared governance, no shared talent pool, no shared learning. The next 10 projects can\'t look like the last 3. You need an internal capability that compounds — and you need it stood up correctly, once.',
    delivers: [
      {
        title: 'CoE Charter & Operating Model',
        detail:
          'Written charter: mission, scope, decision rights, funding model, success metrics. Operating model: hub-and-spoke vs federated vs hybrid, with explicit interfaces to business units, IT, audit, and procurement.',
      },
      {
        title: 'Role Design & Hiring Profiles',
        detail:
          '6–12 role definitions: CoE lead, solutions architect, ML engineer, MLOps engineer, governance lead, adoption lead, AI program manager. Each with hiring profile, market salary band (region-adjusted), interview rubric.',
      },
      {
        title: 'Tooling & Platform Setup',
        detail:
          'Shared platform: LLM gateway, vector store, evaluation harness, prompt management, observability, governance dashboard. Built on your stack (Azure ML / SageMaker / Vertex / open-source).',
      },
      {
        title: 'Governance Framework Operationalized',
        detail:
          'The governance charter from E1 made operational: intake workflow, risk classification, ethics review board structure, vendor management, model registry. All wired to your existing GRC processes.',
      },
      {
        title: 'Use Case Intake & Prioritization Engine',
        detail:
          'A repeatable process for collecting use cases from business units, scoring them, triaging through the CoE, and feeding qualified candidates into pilot engagements.',
      },
      {
        title: 'Internal Enablement Engine',
        detail:
          'Reusable internal training (built from our courses), prompt library, pattern library, internal blog, monthly community of practice meetings. The components that turn one-off training into sustained capability.',
      },
      {
        title: '90-Day Operating Cadence with us embedded',
        detail:
          'For 90 days post-launch, we sit in the CoE as senior practitioners. Pair with your CoE lead. Co-run the first intake cycles. Coach through the first governance escalations. Then we transition out.',
      },
    ],
    timeline: [
      { day: 'Weeks 1–3', task: 'Charter co-authoring · operating model design · stakeholder alignment · funding model' },
      { day: 'Weeks 4–8', task: 'Tooling & platform build · governance operationalization · role hiring kicked off' },
      { day: 'Weeks 9–12', task: 'CoE soft launch · first intake cycles · pattern library populated' },
      { day: 'Weeks 13–20', task: 'Full operating cadence · we coach in-room · transition to client ownership · 90-day review' },
    ],
    successLooks: [
      'CoE is processing 5–15 use case intakes per quarter by Go-Live',
      'Average time from idea to scoped pilot is under 6 weeks',
      'Internal pattern library and prompt library are net-additive each quarter',
      'CoE lead is reporting to executive committee with confidence',
      'External AI vendor spend is trending down as internal capability grows',
    ],
    realExample:
      'Multi-bank financial services group, GCC — 16-week AI CoE setup covering charter, platform on Azure ML, governance integration with existing GRC, and 90-day in-room coaching. By month 6 post-launch the CoE was running an active use case backlog of 24 candidates across the group, had standardized vendor SLAs across 3 AI vendors, and had reduced external pilot scoping time from ~8 weeks to ~4 weeks.',
    notIncluded: [
      'Hiring of the CoE team (we design the roles; you hire)',
      'Direct delivery of use cases through the CoE (those are E3/E4)',
      'Ongoing operating support beyond the 90-day embed (covered in E5)',
    ],
    pairsWith: 'Most effective after at least one E3+E4 cycle has demonstrated AI value · E5 Sustain typically wraps around the CoE for the first 12–18 months',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// PROCUREMENT-READY MATERIALS
// ────────────────────────────────────────────────────────────────────────────

const procurementItems = [
  {
    icon: FileText,
    title: 'NDA & MSA templates',
    description:
      'Mutual NDA template available before any data conversation. Standard MSA + per-engagement SOW model. We work with your legal templates too — exchange takes 5–10 working days typically.',
  },
  {
    icon: ShieldCheck,
    title: 'Data residency & sovereignty',
    description:
      'Data stays in your environment — your subscription, your tenant, your region. We do not store client data. Compliance with regional rules: Saudi PDPL, India DPDP, UAE PDPL, GDPR awareness. Air-gapped / on-prem patterns available.',
  },
  {
    icon: Globe,
    title: 'Regional presence & invoicing',
    description:
      'Gennoor Tech Private Limited (India) for INR invoicing and GST-compliant billing. International invoicing supported. On-the-ground delivery experience: India, Saudi Arabia, UAE, Tanzania, Kenya, Singapore.',
  },
  {
    icon: Layers,
    title: 'Vendor & sub-processor list',
    description:
      'Transparent list of sub-processors (Azure, GitHub, etc.) provided on request. Security questionnaires (CAIQ-style, ISO27001-aligned controls) answered within 5–10 working days.',
  },
  {
    icon: Users,
    title: 'References & introductions',
    description:
      'Named client references available after initial scoping conversation. Reference calls offered for engagements over $100k. Reference clients across BFSI, public sector, energy, and manufacturing in GCC, India, and East Africa.',
  },
  {
    icon: Activity,
    title: 'IP ownership & code custody',
    description:
      'All code, models, fine-tuned weights, and prompts are client-owned. Code in your repository from day one. Our reusable frameworks (templates, evaluation harnesses, methodology) remain ours and are listed in the SOW as reusable IP.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// FAQ — pro-level, procurement-friendly
// ────────────────────────────────────────────────────────────────────────────

const enterpriseFaqs = [
  {
    question: 'How do you compare to a Big-4 transformation engagement?',
    answer:
      'Three structural differences. (1) Senior delivery — the practitioner you scope with is the practitioner who delivers; there is no analyst tier between the work and the senior expert. (2) End-to-end on one engagement — diagnostic, training, pilot, build, and sustain on one contract; Big-4 firms typically split this across separate scopes with different teams. (3) Transparent price bands — we publish ranges on the website and lock fixed price in writing before kickoff for Diagnose/Train/Innovate. Most clients see total program cost 40–60% lower than Big-4 quotes for equivalent scope, with comparable or stronger outcomes.',
  },
  {
    question: 'Can you work alongside our existing SI partner (Accenture, Wipro, TCS, Infosys)?',
    answer:
      'Yes — this is a common arrangement. We act as the AI specialist arm of a broader transformation led by your SI. We co-design with their architects, hand off operations to their managed-services team if relevant, and respect the existing engagement boundaries. We have run several such joint engagements in BFSI and public sector.',
  },
  {
    question: 'Do you accept our enterprise MSA and procurement process?',
    answer:
      'Yes. We work with client-provided MSA templates regularly. Standard cycle is 2–4 weeks of legal exchange, which we begin in parallel with scoping. We carry standard enterprise terms — IP assignment, IP indemnification, data protection schedule, security schedule, regional compliance attestations. Our preferred SOW format is fixed-price per phase with clear acceptance criteria.',
  },
  {
    question: 'Can you work air-gapped or in our private cloud / on-prem environment?',
    answer:
      'Yes. Open-source LLMs (Llama, Mistral, Phi, Qwen) on private infrastructure — via Ollama, vLLM, or Azure ML private endpoints — is one of our reference patterns. Common for government, defense, healthcare, and regulated finance workloads. We have delivered air-gapped pilots and full production builds in such environments.',
  },
  {
    question: 'Who actually delivers — and do you have the bench depth for a multi-quarter program?',
    answer:
      'Engagements are led by senior practitioners (Microsoft Certified Trainers, 14+ years experience). For larger programs (E4 Transformation Program, E6 CoE), the lead is paired with a small team of mid-senior practitioners. We cap active engagements per quarter to maintain quality — for E4-scale engagements with >$300k value, we are transparent about start-date availability. Our model is senior-only delivery, capacity-limited; not a high-velocity staff augmentation shop.',
  },
  {
    question: 'How do you handle regulated industries — banking, healthcare, government?',
    answer:
      'We have delivered into all three. Approach: (1) regulatory posture is part of the E1 Diagnostic — we map your obligations before scoping any pilot. (2) Compliance review is built into every E3 Pilot at week 4 — explicit gate, not a checkbox. (3) For healthcare and government, we default to private-deployment patterns and PHI/PII isolation. (4) For BFSI, we align with regional regulators (RBI for India, SAMA for Saudi, ADGM for UAE) and integrate with your existing model risk management process where applicable.',
  },
  {
    question: 'What is your model risk management (MRM) approach for regulated clients?',
    answer:
      'We integrate with your existing MRM framework rather than imposing our own. Practically: every production AI model produced under our engagement is documented in your model registry, tested under your validation regime, and re-validated on the cadence your MRM dictates. Our Sustain phase (E5) includes quarterly evaluation against fresh test sets and an updated model documentation pack ready for MRM submission.',
  },
  {
    question: 'How do you price multi-region or multi-business-unit programs?',
    answer:
      'For programs spanning multiple regions or BUs, we price per business unit / per region with shared platform components priced once (CoE setup, governance, central platform). This avoids the "one big number" approach where it\'s impossible to attribute value. Each BU sees a clear engagement scope with its own success criteria and timeline.',
  },
  {
    question: 'What if our internal team can\'t take over the system post-Build?',
    answer:
      'Knowledge transfer is contractual on every E4 engagement, and the design assumes your team takes over at Go-Live. If your team is not ready, we extend hypercare (built into the contract). If for any reason your team remains unable to operate, we roll into an E5 Sustain retainer with extended operational coverage (uncommon but possible). The framework is designed so this never becomes a surprise — week-4 readiness checkpoints flag risks early.',
  },
  {
    question: 'How do you handle vendor lock-in concerns — are we married to your stack?',
    answer:
      'No. Three protections built into every engagement: (1) Code lives in your repositories from day one; you can fork and continue without us. (2) Stack choices are written and justified in the Stack Fit Assessment — you can move from Azure to AWS or to open-source later with documented migration paths. (3) Our reusable frameworks (evaluation harnesses, methodology, course content) are non-confidential and re-implementable; we don\'t hide value in proprietary lock-in.',
  },
  {
    question: 'Do you provide audit-ready documentation for governance review?',
    answer:
      'Yes. Every engagement produces a documentation pack designed for audit and risk review: architecture documentation, decision log, vendor selection rationale, evaluation reports, risk register, governance charter compliance map, training records, and post-deployment metrics. Format compatible with your audit team\'s expectations (we have worked with Big-4 auditors, internal audit teams, and regulators directly).',
  },
  {
    question: 'How do board-level conversations and reporting work?',
    answer:
      'For engagements that warrant it (E4 Transformation Programs, E6 CoE setups, multi-program retainers), we provide board-ready reporting on a quarterly cadence. The format is short (6–8 pages), executive in tone, and matches your board\'s existing reading rhythm. We can also brief your board directly at request — typically once per program at a major milestone.',
  },
  {
    question: 'What does success look like at the program level — how do we know it worked?',
    answer:
      'Three lenses we report on: (1) Operational — systems running, SLAs met, adoption sustained, costs inside envelope. (2) Capability — internal team can operate, hire, and govern; CoE intake pipeline is healthy. (3) Strategic — measurable business impact (revenue, cost, risk, NPS) tied to the original use case ROI hypothesis. We report against these from the first quarterly review onward; nothing is left to interpretation at year-end.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────────────

export default function ForEnterprisePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Solutions', url: 'https://gennoor.com/solutions' },
          { name: 'For Enterprise', url: 'https://gennoor.com/solutions/for-enterprise' },
        ]}
      />
      <FAQJsonLd faqs={enterpriseFaqs} />

      {/* HERO */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-700 bg-primary-50/80 border border-primary-100/60">
              <Building2 className="w-3 h-3 mr-1.5" />
              For Enterprises · 250+ employees · GCC · India · Africa · APAC
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Transformation programs that <span className="gradient-text">survive</span> the org chart.
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mb-8 leading-relaxed max-w-3xl mx-auto">
              Multi-quarter AI transformation programs for organizations 250+ in size — with
              executive sponsorship, governance, procurement-ready terms, and senior
              Microsoft-certified delivery in your region. Six engagement models from
              Strategic Diagnostic to AI Center of Excellence, on one contract or staged
              over years.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all duration-300"
              >
                Request a scoping conversation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/case-studies"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-gray-700 glass-card hover:border-primary-200 transition-all duration-300"
              >
                See client case studies
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary-500" /> MSA-ready
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary-500" /> Senior delivery
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary-500" /> Stack-flexible
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary-500" /> Regional fluency
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary-500" /> Governance-grade
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* THE ENGAGEMENT MODELS — DEEP */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              Six Engagement Models — In Detail
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Programs that match how enterprises actually buy.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Each engagement is one phase (or a cross-phase capability) of{' '}
              <Link
                href="/the-gennoor-way"
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                the Gennoor Way
              </Link>
              , priced and scoped for enterprise complexity. Run them sequentially, in
              parallel, or combined.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-10">
            {engagements.map((eng) => {
              const Icon = eng.icon
              return (
                <article
                  key={eng.code}
                  id={eng.code.toLowerCase()}
                  className="scroll-mt-24 rounded-3xl p-7 lg:p-10 glass-card glow-border"
                >
                  {/* HEADER */}
                  <header className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/15 flex-shrink-0">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-widest text-gray-400">
                          {eng.code}
                        </p>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                          {eng.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex-1 lg:text-right">
                      <p className="text-xs font-semibold text-primary-600 mb-2">{eng.phase}</p>
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-900 bg-primary-50/80 border border-primary-100/60 rounded-lg">
                          <Clock className="w-3 h-3" /> {eng.duration}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-primary-700 bg-primary-50/80 border border-primary-100/60 rounded-lg">
                          {eng.price}
                        </span>
                      </div>
                      <p className="text-base text-gray-600 leading-relaxed mt-3 italic">
                        {eng.promise}
                      </p>
                    </div>
                  </header>

                  {/* PROBLEM */}
                  <div className="mb-8">
                    <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                      The problem we solve
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">{eng.problem}</p>
                  </div>

                  {/* DELIVERS */}
                  <div className="mb-8">
                    <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
                      What we deliver
                    </h4>
                    <div className="space-y-3">
                      {eng.delivers.map((d) => (
                        <div key={d.title} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-semibold text-gray-900 mb-1">
                              {d.title}
                            </p>
                            <p className="text-sm text-gray-600 leading-relaxed">{d.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* TIMELINE + SUCCESS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-8">
                    <div>
                      <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                        Timeline
                      </h4>
                      <ul className="space-y-2">
                        {eng.timeline.map((t) => (
                          <li
                            key={t.day}
                            className="flex items-start gap-3 text-sm text-gray-600"
                          >
                            <span className="font-semibold text-primary-600 min-w-[100px] flex-shrink-0">
                              {t.day}
                            </span>
                            <span className="leading-relaxed">{t.task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                        What success looks like
                      </h4>
                      <ul className="space-y-2">
                        {eng.successLooks.map((s) => (
                          <li
                            key={s}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <Target className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* REAL EXAMPLE */}
                  <div className="rounded-2xl p-5 bg-primary-50/40 mb-8 border border-primary-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-primary-600" />
                      <h4 className="text-xs font-bold tracking-widest text-primary-600 uppercase">
                        Reference engagement
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      {eng.realExample}
                    </p>
                  </div>

                  {/* NOT INCLUDED + PAIRS WITH */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-gray-100">
                    <div className="rounded-2xl p-5 bg-gray-50/60">
                      <div className="flex items-center gap-2 mb-3">
                        <AlertCircle className="w-4 h-4 text-gray-500" />
                        <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase">
                          Not included
                        </h4>
                      </div>
                      <ul className="space-y-1.5">
                        {eng.notIncluded.map((n) => (
                          <li
                            key={n}
                            className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed"
                          >
                            <X className="w-3 h-3 text-gray-400 flex-shrink-0 mt-1" />
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-2xl p-5 bg-amber-50/40">
                      <div className="flex items-center gap-2 mb-3">
                        <ArrowRight className="w-4 h-4 text-amber-600" />
                        <h4 className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                          Pairs well with
                        </h4>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">{eng.pairsWith}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* THREE PLEDGES */}
      <ThreePledges
        heading="Three commitments that close enterprise procurement faster."
        subhead="Why CIOs, CDOs, and procurement teams move from RFP to contract with us in weeks, not quarters."
      />

      {/* PROCUREMENT-FRIENDLY */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              Procurement-Ready
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              The materials your procurement team will ask for.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              We design every engagement to clear procurement, legal, security, and audit
              review without surprises. Here&apos;s what we bring to that conversation by default.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {procurementItems.map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="rounded-2xl p-6 glass-card glow-border transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/15">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>

          <p className="text-center text-sm text-gray-500 mt-10">
            More detail —{' '}
            <Link
              href="/about/trust-and-security"
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Trust &amp; Security overview →
            </Link>
          </p>
        </div>
      </section>

      {/* ENGAGEMENT COMPARISON TABLE */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              At a Glance
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              All six engagement models, side by side.
            </h2>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full text-sm rounded-2xl overflow-hidden glass-card">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Engagement
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Phase
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Duration
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Investment band
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Best when
                  </th>
                </tr>
              </thead>
              <tbody>
                {engagements.map((eng) => (
                  <tr
                    key={eng.code}
                    className="border-b border-gray-50 last:border-0 hover:bg-primary-50/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <a
                        href={`#${eng.code.toLowerCase()}`}
                        className="font-bold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {eng.code} · {eng.name}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-xs text-primary-600 font-semibold whitespace-nowrap">
                      {eng.phase
                        .replace('Phase ', 'P')
                        .replace(' · ', ': ')
                        .replace('Cross-Phase', 'X-Phase')}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{eng.duration}</td>
                    <td className="px-5 py-4 font-bold text-primary-700 whitespace-nowrap">
                      {eng.price}
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs leading-relaxed">
                      {eng.promise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
                Procurement &amp; Program Questions
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                The questions enterprise buyers ask.
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                Procurement, governance, regulatory, and program-level questions — answered
                with the directness your legal and risk teams expect.
              </p>
            </div>
            <div className="space-y-4">
              {enterpriseFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl p-6 glass-card transition-all duration-300"
                >
                  <summary className="flex justify-between items-start gap-4 cursor-pointer list-none">
                    <h3 className="text-base font-semibold text-gray-900">{faq.question}</h3>
                    <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1 transition-transform duration-300 group-open:rotate-90" />
                  </summary>
                  <p className="mt-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5">
            Ready for a scoping conversation?
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Most enterprise engagements begin with a 60-minute exploratory call with your
            CIO/CDO sponsor — no deck, no pitch. We listen, we ask the awkward questions, and
            within five working days we send a written one-pager on what we&apos;d propose.
            That&apos;s when the procurement conversation starts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all duration-300"
            >
              Request a scoping call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-gray-700 glass-card hover:border-primary-200 transition-all duration-300"
            >
              See client case studies
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
