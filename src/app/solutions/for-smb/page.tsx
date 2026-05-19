import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Rocket,
  Compass,
  GraduationCap,
  Hammer,
  RefreshCcw,
  ArrowRight,
  Check,
  X,
  Clock,
  Zap,
  MessageCircle,
  Target,
  Calendar,
  Activity,
  Users,
  AlertCircle,
} from 'lucide-react'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'
import ThreePledges from '@/components/ThreePledges'

export const metadata: Metadata = {
  title: 'AI Solutions for SMB & Growing Businesses — Fixed-Price AI Pilots from $3k',
  description:
    'Ship your first AI pilot in 6 weeks. Five productized AI packages from $3k for 10–250 person businesses. Fixed price, fixed scope, code transferred day one. Built in GCC, India, Africa.',
  keywords: [
    'AI for SMB',
    'AI for small business',
    'AI consultant SMB',
    'fixed-price AI pilot',
    'Microsoft Copilot SMB adoption',
    'AI readiness kit',
    'small business AI implementation',
    'AI pilot 6 weeks',
    'Copilot Kickstart',
    'Single Agent Build SMB',
  ],
  alternates: { canonical: 'https://gennoor.com/solutions/for-smb' },
  openGraph: {
    title: 'AI Solutions for SMB — Fixed-Price Packages from $3k',
    description: 'Ship your first AI pilot in 6 weeks. Fixed price. Fixed scope. Code transferred day one.',
    url: 'https://gennoor.com/solutions/for-smb',
  },
}

// ────────────────────────────────────────────────────────────────────────────
// PACKAGE DATA — deep, content-rich
// ────────────────────────────────────────────────────────────────────────────

const packages = [
  {
    code: 'S1',
    name: 'AI Readiness Kit',
    icon: Compass,
    phase: 'Phase 1 · Diagnose',
    price: '$3k–$5k',
    duration: '1 week',
    promise: 'A defensible 12-month AI plan your leadership team can act on.',
    problem:
      'You\'ve heard the AI hype for two years. Vendors are calling. Your team is asking. Your competitors are posting on LinkedIn. But you don\'t know where AI actually fits in your business — or worse, you\'re about to spend six figures on the wrong project.',
    delivers: [
      {
        title: 'AI Readiness Score',
        detail:
          'Five-dimension index: Strategy, Data, People, Tech, Governance. Scored 1–5 per dimension with evidence. Tells you where you\'re strong and where you\'d break.',
      },
      {
        title: 'Use Case Backlog',
        detail:
          '15–25 candidate use cases scored by impact × feasibility. Each one has a 2-line description, an ROI hypothesis, and a feasibility note (data ready? regulatory clear? buy-in likely?).',
      },
      {
        title: '12-Month Roadmap',
        detail:
          'Three sequenced waves of work over 12 months. Each wave has a goal, a budget cap, and a measurable success criterion.',
      },
      {
        title: 'Governance & Risk Starter',
        detail:
          'A one-page AI use policy your team can adopt today, plus a list of the 5 questions your board should ask about every AI initiative.',
      },
      {
        title: '60-minute executive readout',
        detail:
          'Live walkthrough of all of the above with you and up to 3 of your leadership team. Recording provided.',
      },
    ],
    timeline: [
      { day: 'Day 1', task: 'Kickoff + 4–6 stakeholder interviews (90 min each)' },
      { day: 'Day 2–3', task: 'Data inventory, tech stack audit, process mapping for in-scope workflows' },
      { day: 'Day 4', task: 'Use case generation workshop + scoring' },
      { day: 'Day 5', task: 'Roadmap drafting + readout deck preparation' },
      { day: 'Day 6', task: 'Roadmap delivery + 60-min readout call + Q&A' },
    ],
    successLooks: [
      'Leadership team aligned on which 3 use cases to pursue and in what order',
      '70% of common board questions about AI answered preemptively',
      'A written budget cap and ROI hypothesis for each wave',
      'Zero "let\'s come back and discuss" items left open',
    ],
    realExample:
      '60-person logistics firm in Mumbai — walked in with "we want AI". Walked out with a 3-pillar plan: customer service agent (Q1, $40k cap), invoice extraction (Q2, $30k cap), demand forecasting (Q3, $80k cap). Total program: $150k over 9 months — vs the $400k a tier-2 SI had quoted them for an open-ended "transformation."',
    notIncluded: [
      'Implementation of any use case (that\'s S3)',
      'Hiring or org-design recommendations (different engagement)',
      'Deep technical architecture documents (right-sized for the roadmap, not a build)',
    ],
    pairsWith: 'S2 if Microsoft 365 already in use · S3 if a specific use case is already chosen · S4 to build team literacy in parallel',
  },
  {
    code: 'S2',
    name: 'Copilot Kickstart',
    icon: Zap,
    phase: 'Phase 2 · Train + Phase 3 · Innovate',
    price: '$10k–$15k',
    duration: '4 weeks',
    promise:
      'Stop paying for Microsoft 365 Copilot licenses your team isn\'t using. Get a measurable pilot adoption in 4 weeks.',
    problem:
      'You bought Microsoft 365 Copilot licenses at $30 per user per month. Six months in, fewer than 15% of your team uses it daily. Finance is asking if you should cancel. The honest answer is: the licenses are fine — the rollout was wrong.',
    delivers: [
      {
        title: 'Licensing audit & right-sizing',
        detail:
          'Who actually needs Copilot, who needs Copilot Pro, who shouldn\'t have a license at all. Often saves 10–25% of license spend immediately.',
      },
      {
        title: 'Persona-based prompt libraries (3 roles)',
        detail:
          'Curated, tested prompts for three roles you pick — typically Finance, Sales, HR, Ops, or Customer Service. Each prompt has a use case, an expected output, and a "common mistake" note.',
      },
      {
        title: '2-day live workshop (up to 15 people)',
        detail:
          'On-site or virtual. Day 1 covers foundations + hands-on prompting with your data. Day 2 is role-specific workflows + commitments to specific weekly habits.',
      },
      {
        title: '3-week shadowing pilot',
        detail:
          'One team uses Copilot daily; we shadow, run twice-weekly prompt clinics, and tune what isn\'t working. This is the part that creates the adoption habit.',
      },
      {
        title: 'Adoption metrics dashboard (Power BI)',
        detail:
          'Daily-active-users by role, time-saved estimates, prompt-success rate, and a "where does the org stand" leaderboard. Yours to keep and run after we leave.',
      },
      {
        title: '30-day post-pilot adoption playbook',
        detail:
          'Step-by-step plan to roll the pilot pattern out to the rest of the org. Includes templates, talking points, and the metrics to watch.',
      },
    ],
    timeline: [
      { day: 'Week 1', task: 'License audit · persona discovery · prompt library creation · pilot team selection' },
      { day: 'Week 2', task: '2-day workshop · daily Copilot habits assigned · dashboard goes live' },
      { day: 'Week 3', task: 'Pilot team shadowing · 2× weekly prompt clinics · friction logging' },
      { day: 'Week 4', task: 'Metrics review · adoption playbook delivered · go-broad recommendation' },
    ],
    successLooks: [
      '60%+ daily active usage in pilot team within 4 weeks',
      'At least 4 hours/week of demonstrable time saved per pilot user',
      'A replicable adoption playbook (not just "we did Copilot training")',
      'Finance can see the ROI numbers on Copilot licenses by week 6',
    ],
    realExample:
      '85-person accounting firm in Riyadh — Copilot usage was 12% before engagement. After 4-week Kickstart: 71% daily-active in pilot team, 4.2 hours/week saved per accountant on routine drafting (engagement letters, client emails, audit narratives). Copilot license ROI crossed positive in week 6. Rolled out to the rest of the firm in month 3.',
    notIncluded: [
      'Custom Copilot Studio agents — that\'s S3',
      'Org-wide rollout execution — separate engagement after pilot succeeds',
      'GitHub Copilot adoption (developer-team Copilot is a different play)',
    ],
    pairsWith: 'S5 SMB Sustain — to lock in the adoption gains beyond the 4-week pilot · S4 if other teams need parallel training',
  },
  {
    code: 'S3',
    name: 'Single Agent Build',
    icon: Hammer,
    phase: 'Phase 3 · Innovate',
    price: '$25k–$40k',
    duration: '6 weeks',
    promise:
      'One AI agent. Built end-to-end in your environment. Code transferred day one. Yours forever.',
    problem:
      'You\'ve identified a specific use case — an HR onboarding bot, an invoice extraction system, a customer support agent, a sales proposal generator. You don\'t want a 6-month consulting engagement. You want it built, deployed, and working in 6 weeks. With code you own.',
    delivers: [
      {
        title: '1-week scoping + Stack Fit Assessment',
        detail:
          'Written 3-page Stack Fit Assessment comparing cloud LLM (Azure OpenAI / AWS Bedrock) vs self-hosted open-source (Llama / Mistral). Cost per 1M tokens, latency, sovereignty, fine-tuning needs. You choose; we build.',
      },
      {
        title: '4 weeks of build with weekly demos',
        detail:
          'Every Friday: a live demo of the working system as it is that week. No 60-day silences. No last-minute surprises. You see the agent take shape.',
      },
      {
        title: 'Deployment in your environment',
        detail:
          'Runs on your Azure subscription / AWS account / on-premise infra. We do not host. Your data stays where your regulator expects it to stay.',
      },
      {
        title: 'Code in your repository on day one',
        detail:
          'GitHub / Azure DevOps / GitLab — your repo, your IP, your control. Not a "deliverable handover at the end."',
      },
      {
        title: 'Operations runbook + evaluation harness',
        detail:
          'How to operate it Monday morning. How to test it before each release. How to monitor accuracy and cost drift over time.',
      },
      {
        title: '1-week handover + 2-week hypercare',
        detail:
          'After Go-Live, two weeks of always-on support while your team takes over. Not optional, included in price.',
      },
    ],
    timeline: [
      { day: 'Week 1', task: 'Discovery · Stack Fit Assessment · scope + acceptance criteria signed off' },
      { day: 'Week 2', task: 'Architecture + first working slice (mockup → demo by Friday)' },
      { day: 'Week 3', task: 'Core capability build + integration with your tools' },
      { day: 'Week 4', task: 'Evaluation harness + accuracy tuning + user-feedback sessions' },
      { day: 'Week 5', task: 'Hardening · monitoring · runbook · UAT' },
      { day: 'Week 6', task: 'Go-Live · handover · hypercare begins' },
    ],
    successLooks: [
      'A working agent your users can use Monday morning',
      '85%+ accuracy on a representative test set you sign off on',
      'Under 2-second average response time',
      'Cost per query inside the budget set at week 1',
      'Your team can deploy a code change without us by end of hypercare',
    ],
    realExample:
      '120-person Bangalore healthcare-adjacent company — HR onboarding copilot. Six weeks scope-to-live. Built on Azure OpenAI + Copilot Studio + Dataverse for policy retrieval. Result: new joiners had 80% of their day-1 questions answered by the bot before reaching HR. HR team\'s onboarding workload dropped from ~6 hours/joiner to ~1.5 hours/joiner. Cost: $32k. Recurring cost: ~$280/month including LLM tokens.',
    notIncluded: [
      'Org-wide rollout to 5+ teams in this engagement (next engagement, or extends scope)',
      'Integration into more than 2 external systems (extends scope and price)',
      'Multi-language support beyond English + one regional language (extends scope)',
      'Retraining beyond initial release (covered in S5 Sustain)',
    ],
    pairsWith: 'S5 SMB Sustain — strongly recommended for any production agent · S4 if the receiving team needs upskilling',
  },
  {
    code: 'S4',
    name: 'Team AI Upskill',
    icon: GraduationCap,
    phase: 'Phase 2 · Train',
    price: '$5k–$12k',
    duration: '2 weeks + 30-day reinforcement',
    promise: 'A whole team functional with AI workflows in their actual day-to-day work, in two weeks.',
    problem:
      'Your team has watched the YouTube videos. They\'ve heard about ChatGPT. They might even have a personal account. But their actual work — the spreadsheets, the emails, the proposals, the reports — has not changed. The skill is sitting outside the workflow.',
    delivers: [
      {
        title: 'Function-specific curriculum',
        detail:
          'Pick one: Finance · Sales · HR · Marketing · Operations · Customer Service. The workshop is built around the workflows of that function — not a generic "AI 101".',
      },
      {
        title: '2-day intensive OR 4 half-day virtual sessions',
        detail:
          'Up to 25 people. Live, hands-on, with your data (anonymized). Every exercise produces an artifact the participant takes back to their job.',
      },
      {
        title: 'Branded PDF course pre-read',
        detail:
          'A 40–50 page company-branded course PDF sent to participants 5 days before the workshop. Reduces hand-holding in the room; raises the ceiling of what we cover.',
      },
      {
        title: 'Curated prompt library for your tools',
        detail:
          'Built around what your team actually uses — Microsoft 365, Google Workspace, your CRM, your finance tool. Not "100 generic prompts."',
      },
      {
        title: '30-day reinforcement plan',
        detail:
          'Weekly 30-minute team check-ins post-workshop. Each week has a theme, a measurable habit, and a friction-log review. This is what makes the workshop stick.',
      },
    ],
    timeline: [
      { day: 'Day -5', task: 'Pre-read PDF sent · pre-survey · platform setup' },
      { day: 'Day 1', task: 'Foundations · hands-on prompting · your-data exercises' },
      { day: 'Day 2', task: 'Function-specific workflows · workflow integration · weekly-habit commitments' },
      { day: 'Week 1–4', task: '30-min weekly check-in · friction log · habit reinforcement' },
    ],
    successLooks: [
      'Every participant has 3–5 daily AI workflows by week 4',
      'Measurable time-saved per participant (typically 4–8 hours/week)',
      'A team-owned prompt library that keeps growing post-workshop',
      'A noticeable shift in how the team talks about AI in standups',
    ],
    realExample:
      '40-person sales team at a Mumbai SaaS company — Function: Sales. By week 4 of reinforcement: 32 of 40 reps using AI for outreach personalization daily. Average 6 hours/week saved per rep. The team\'s outbound email response rate moved from 4.1% to 6.8% — partly attributable to better personalization at scale.',
    notIncluded: [
      'Building custom tools or agents (that\'s S3)',
      'Licensing strategy across the org (that\'s S2)',
      'Teams larger than 25 in a single session (we run multiple cohorts)',
    ],
    pairsWith: 'S2 if the team uses Microsoft 365 · S3 if a tool need emerges from the workshop · runs alongside S1 nicely',
  },
  {
    code: 'S5',
    name: 'SMB Sustain',
    icon: RefreshCcw,
    phase: 'Phase 5 · Sustain',
    price: '$2k–$4k/month',
    duration: 'Ongoing retainer',
    promise: 'Your AI system still working — technically, economically, and organizationally — twelve months from now.',
    problem:
      'You deployed an AI system 6 months ago. It\'s still running — you think. Costs have crept up 30%. Nobody has checked accuracy since launch. Two users complained quietly last week. You need an adult in the room, but you don\'t need (or want) a full-time MLOps engineer.',
    delivers: [
      {
        title: 'Quarterly Health Check (1 day)',
        detail:
          'Model evaluation on a refreshed test set. Cost & token audit. Adoption metrics review. Security & governance refresh. Output: a written Health Report with a prioritized action list.',
      },
      {
        title: 'Monthly Office Hours (2 hours)',
        detail:
          'Book any topic. Why is accuracy slipping on Tuesdays? Why is the bill higher this month? Should we move from GPT-4o to GPT-4o-mini? Why is one team using it more than another? We answer.',
      },
      {
        title: 'Always-on async Slack channel',
        detail:
          'Drop a question, get a response within 24 hours (usually faster). Not 9-to-5 specific timezone — your team gets answers when they need them.',
      },
      {
        title: 'Cost Optimization Recommendations',
        detail:
          'Every quarter we audit token spend. Often the savings cover the retainer cost — caching, model right-sizing, prompt compression, batching are the usual wins.',
      },
      {
        title: 'Annual Strategy Day',
        detail:
          'A full day every year, in person or virtual, planning the next 12 months of AI work. Where does the portfolio expand? What use cases retire? What does the team need to learn next?',
      },
      {
        title: 'Incident response (24-hour SLA)',
        detail:
          'If something breaks badly, we respond within 24 hours. Not an MSP-grade on-call — but a senior expert within a day, every time.',
      },
    ],
    timeline: [
      { day: 'Month 1', task: 'Baseline health check · cost audit · stakeholder interviews' },
      { day: 'Monthly', task: '2-hour office hours · async support across the month' },
      { day: 'Quarterly', task: 'Full health check + written report + action plan' },
      { day: 'Annually', task: 'Strategy day for the next 12 months' },
    ],
    successLooks: [
      'Performance metrics flat or improving quarter over quarter',
      'Cost trending down (or, if growing, growing slower than usage)',
      'Team confidence in the system increasing — measured in surveys',
      'You\'re sleeping better at night',
    ],
    realExample:
      'Bangalore fintech, $3k/month SMB Sustain — caught a 40% Q2 cost spike from un-cached duplicate queries in the customer-service agent. Implemented a Redis-cache layer that paid back the retainer 10x for the year. Total saved: $18k/year on a $36k/year retainer.',
    notIncluded: [
      'Net-new use cases (those trigger a new S3 engagement)',
      '24/7 on-call (we\'re not a managed-services provider)',
      'Building new agents (Sustain is for existing systems)',
    ],
    pairsWith: 'Any prior package — automatic next step after S2 or S3 deployment',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// DECISION HELPER
// ────────────────────────────────────────────────────────────────────────────

const decisionPaths = [
  {
    if: "We don't know where AI fits in our business.",
    then: 'Start with S1 · AI Readiness Kit',
    note: 'One week, $3k–$5k, you walk away with a 12-month plan.',
  },
  {
    if: 'We have Microsoft 365 Copilot licenses but adoption is stuck.',
    then: 'Start with S2 · Copilot Kickstart',
    note: 'Four weeks, $10k–$15k, measurable adoption in a pilot team.',
  },
  {
    if: 'We know exactly what we want to build (HR bot, invoice AI, support agent…).',
    then: 'Start with S3 · Single Agent Build',
    note: 'Six weeks, $25k–$40k, working agent shipped to your environment.',
  },
  {
    if: 'Our team needs to actually use AI in their daily work.',
    then: 'Start with S4 · Team AI Upskill',
    note: 'Two weeks + 30-day reinforcement, $5k–$12k, function-specific.',
  },
  {
    if: 'We already have something live and want to keep it working.',
    then: 'Start with S5 · SMB Sustain',
    note: '$2k–$4k/month — quarterly health checks + monthly office hours.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// HOW WE WORK
// ────────────────────────────────────────────────────────────────────────────

const howWeWork = [
  {
    icon: MessageCircle,
    title: 'Reach out any way you want',
    description:
      'WhatsApp, email, contact form, LinkedIn. Most SMB conversations start over WhatsApp because that\'s faster for both of us.',
  },
  {
    icon: Calendar,
    title: '30-minute discovery call (free)',
    description:
      'We listen. You describe the situation. We tell you which package fits — or honestly say AI isn\'t the right answer for this problem yet.',
  },
  {
    icon: Target,
    title: 'Written proposal in 5 working days',
    description:
      'Fixed scope. Fixed price. Fixed timeline. No PowerPoint deck — a clear written proposal in plain English. No hidden costs.',
  },
  {
    icon: Activity,
    title: 'Weekly demos. Friday at 4pm.',
    description:
      'Every engagement runs on a weekly demo rhythm. No 60-day silences. You see the work as it\'s built, every Friday.',
  },
  {
    icon: Users,
    title: 'Senior delivery, every time',
    description:
      'No analyst tier between you and the practitioner. The senior expert who scoped your engagement is the same person you talk to in week 4.',
  },
  {
    icon: RefreshCcw,
    title: 'Handover, then optional Sustain',
    description:
      'At Go-Live, your team takes the keys. The code is yours. The Sustain retainer is optional — but most clients take it because we\'ve already saved them more than it costs.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// FAQ — pro-level depth
// ────────────────────────────────────────────────────────────────────────────

const smbFaqs = [
  {
    question: 'Will this work for a 30-person business?',
    answer:
      'Yes. Most of our SMB engagements are with 15–200 person companies. The packages are sized for businesses without a dedicated AI/ML team and without 6-figure budgets to burn. The smallest engagement we\'ve delivered was for a 12-person consultancy.',
  },
  {
    question: 'Do we need an Azure account, technical team, or in-house engineers?',
    answer:
      'Not in advance. We help you stand up the right infrastructure as part of the engagement — typically Azure (most common because of Microsoft 365 alignment), but also AWS, GCP, or self-hosted open-source where it makes sense. A non-technical owner-operator can sponsor and run the project; we handle the technical execution. Your team\'s involvement is mostly business-side: stakeholder interviews, data access, UAT.',
  },
  {
    question: 'What if we don\'t know which package to choose?',
    answer:
      'Start with S1 (AI Readiness Kit) at $3k. In one week you walk away with a written recommendation on which package fits your situation and how to sequence what comes next. Or use the decision tree above — most SMBs find their answer within 30 seconds of reading it.',
  },
  {
    question: 'Are the prices final, or starting points?',
    answer:
      'Bands, not point prices. For 90% of engagements within typical scope, you fall in the band. For unusual scope — regulated industries, multi-language requirements, multi-system integration — we send a written quote within 5 working days of the discovery call. Whatever the number, it\'s fixed before we start; we do not run T&M engagements for SMB.',
  },
  {
    question: 'Can we pay in installments?',
    answer:
      'Yes. Default schedule is 40% on signing, 40% mid-engagement, 20% on handover. For longer engagements (>6 weeks), we sometimes split into 4 instalments. We accept wire transfer, UPI (India), card (international), and for Indian businesses we issue GST-compliant invoices.',
  },
  {
    question: 'Who actually delivers the work — is it the founder, or someone you hand off to?',
    answer:
      'The senior practitioner who scoped your engagement is the senior practitioner who delivers it. There is no junior tier. Where the engagement is large enough to warrant a 2-person team, the senior remains the lead and you talk to them throughout. This is the explicit reason we cap active engagements per quarter — quality over quantity.',
  },
  {
    question: 'Do you work with businesses outside India and GCC?',
    answer:
      'Yes. We deliver remotely worldwide. Strongest on-the-ground presence in India, Saudi Arabia, UAE, East Africa (Tanzania, Kenya), and Southeast Asia. We have served remote clients in the US, UK, Germany, and Singapore. Remote engagements run identically — Friday demos, weekly status, async Slack — just with different timezones for live sessions.',
  },
  {
    question: 'Do you work with open-source LLMs, or only Microsoft?',
    answer:
      'Both, and we recommend based on your situation, not our economics. Many SMB engagements use Microsoft 365 Copilot or Azure OpenAI because the licensing is already in place and the integration is smooth. For cost-sensitive workloads (high query volume) or sovereignty-sensitive workloads (regulated data), we deploy open-source models — Llama, Mistral, Phi, Qwen — on your own infrastructure via Ollama or vLLM. Every Single Agent Build (S3) starts with a written Stack Fit Assessment so the recommendation is yours.',
  },
  {
    question: 'What if our use case isn\'t in your standard list?',
    answer:
      'The packages cover the patterns we ship most often. If your need is bespoke — a custom ML model, a forecasting engine, an analytics platform, an air-gapped deployment, a domain-specific agent — we scope it as a custom build after a 30-minute call. Typical custom builds run $25k–$80k for SMB scope; we deliver them on the same fixed-price model as the standard packages.',
  },
  {
    question: 'What happens if the pilot doesn\'t work?',
    answer:
      'It depends on what "doesn\'t work" means. If we shipped the agreed scope and it works technically but doesn\'t deliver business value, we hold a written retrospective and recommend next steps — sometimes that\'s reframing the use case, sometimes it\'s sunsetting the pilot. If we missed the agreed scope, we keep working until we hit it; that\'s in the contract. We\'ve had zero engagements miss scope so far, but the protection is in writing.',
  },
  {
    question: 'Who owns the code, models, and prompts?',
    answer:
      'You do, on day one. Code lives in your repository (GitHub / Azure DevOps / GitLab) from the first commit. Models and fine-tuned weights are yours. Prompts are yours. Our reusable internal frameworks (evaluation harnesses, scoring methodologies, course content) remain ours and are explicitly listed in the engagement contract as non-confidential reusable IP.',
  },
  {
    question: 'How do you handle our data?',
    answer:
      'We do not store client data on our infrastructure. Data lives in your environment — your Azure subscription, your AWS account, your on-prem. During the engagement we access it through your tenant with your access controls; after the engagement we lose that access. Anonymized usage telemetry (e.g., aggregated prompt-volume metrics) is opt-in and never includes content. NDA mutually signed before any data conversation.',
  },
  {
    question: 'Can we cancel mid-engagement?',
    answer:
      'Yes. The contract is per phase, not per program. If at any phase gate you decide not to continue, you walk away with everything delivered up to that gate. We do not lock SMB clients into multi-quarter retainers.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────────────

export default function ForSMBPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'Solutions', url: 'https://gennoor.com/solutions' },
          { name: 'For SMB', url: 'https://gennoor.com/solutions/for-smb' },
        ]}
      />
      <FAQJsonLd faqs={smbFaqs} />

      {/* HERO */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-amber-700 bg-amber-50/80 border border-amber-100/60">
              <Rocket className="w-3 h-3 mr-1.5" />
              For SMB &amp; Growing Businesses · 10–250 employees
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Ship your first AI pilot in <span className="gradient-text">6 weeks</span>.
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 mb-8 leading-relaxed max-w-3xl mx-auto">
              Five productized AI packages from $3k. Fixed price. Fixed scope. Code transferred
              day one. Built in your environment, owned by your team — no 6-figure consulting
              bill, no 60-page deck, no analyst tier between you and the senior expert doing
              the work.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all duration-300"
              >
                Book a 30-minute call
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-gray-700 glass-card hover:border-primary-200 transition-all duration-300"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Message on WhatsApp
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary-500" /> Fixed price
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary-500" /> Code transferred day one
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary-500" /> Cloud or open-source
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary-500" /> Proposal in 5 days
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary-500" /> Senior delivery
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DECISION HELPER */}
      <section className="py-16 lg:py-20 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              30-Second Decision Helper
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Not sure which package fits?
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Pick the line that sounds most like your situation. That&apos;s where to start.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {decisionPaths.map((path) => (
              <div
                key={path.if}
                className="rounded-2xl p-5 glass-card glow-border transition-all duration-300 hover:-translate-y-0.5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
              >
                <div className="md:col-span-5">
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    If
                  </p>
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed">
                    {path.if}
                  </p>
                </div>
                <div className="hidden md:flex md:col-span-1 justify-center">
                  <ArrowRight className="w-5 h-5 text-primary-400" />
                </div>
                <div className="md:col-span-6">
                  <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Then
                  </p>
                  <p className="text-base font-bold text-primary-600 mb-1">{path.then}</p>
                  <p className="text-xs text-gray-500">{path.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PACKAGES — DEEP */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              The Five Packages — In Detail
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What you actually get.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Each package is one phase of{' '}
              <Link
                href="/the-gennoor-way"
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                the Gennoor Way
              </Link>
              , sized and priced for SMB scope. Every package shows the problem we solve,
              what we deliver, week-by-week, what success looks like, a real example, what&apos;s
              not included, and what pairs well next.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-10">
            {packages.map((pkg) => {
              const Icon = pkg.icon
              return (
                <article
                  key={pkg.code}
                  id={pkg.code.toLowerCase()}
                  className="scroll-mt-24 rounded-3xl p-7 lg:p-10 glass-card glow-border"
                >
                  {/* HEADER */}
                  <header className="flex flex-col lg:flex-row lg:items-start gap-6 mb-8 pb-8 border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/15 flex-shrink-0">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-widest text-gray-400">
                          {pkg.code}
                        </p>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                          {pkg.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex-1 lg:text-right">
                      <p className="text-xs font-semibold text-primary-600 mb-2">{pkg.phase}</p>
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-gray-900 bg-primary-50/80 border border-primary-100/60 rounded-lg">
                          <Clock className="w-3 h-3" /> {pkg.duration}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-1 text-xs font-bold text-amber-700 bg-amber-50/80 border border-amber-100/60 rounded-lg">
                          {pkg.price}
                        </span>
                      </div>
                      <p className="text-base text-gray-600 leading-relaxed mt-3 italic">
                        {pkg.promise}
                      </p>
                    </div>
                  </header>

                  {/* PROBLEM */}
                  <div className="mb-8">
                    <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                      The problem we solve
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">{pkg.problem}</p>
                  </div>

                  {/* DELIVERS — detailed */}
                  <div className="mb-8">
                    <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">
                      What we deliver
                    </h4>
                    <div className="space-y-3">
                      {pkg.delivers.map((d) => (
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

                  {/* TIMELINE + SUCCESS — two cols */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-8">
                    <div>
                      <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                        Week-by-week
                      </h4>
                      <ul className="space-y-2">
                        {pkg.timeline.map((t) => (
                          <li
                            key={t.day}
                            className="flex items-start gap-3 text-sm text-gray-600"
                          >
                            <span className="font-semibold text-primary-600 min-w-[80px] flex-shrink-0">
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
                        {pkg.successLooks.map((s) => (
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
                        Real example
                      </h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed italic">
                      {pkg.realExample}
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
                        {pkg.notIncluded.map((n) => (
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
                      <p className="text-xs text-gray-600 leading-relaxed">{pkg.pairsWith}</p>
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
        heading="The same delivery promise, at SMB scale."
        subhead="Boutique speed and fairness — without the Big-4 rate card."
      />

      {/* HOW WE WORK */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              How We Work
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              From hello to handover, six steps.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              The same operating rhythm runs across every SMB engagement — clear, predictable,
              and built around weekly demos so nothing surprises you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {howWeWork.map((step, i) => {
              const Icon = step.icon
              return (
                <div
                  key={step.title}
                  className="rounded-2xl p-6 glass-card glow-border relative transition-all duration-500 hover:-translate-y-1"
                >
                  <span className="absolute top-4 right-5 text-2xl font-black text-gray-100">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-4 shadow-lg shadow-primary-500/15">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 pr-10">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* PACKAGE COMPARISON */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              At a Glance
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              All five packages, side by side.
            </h2>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full text-sm rounded-2xl overflow-hidden glass-card">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Package
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Phase
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Duration
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Price band
                  </th>
                  <th className="text-left px-5 py-4 text-xs font-bold tracking-widest text-gray-400 uppercase">
                    Best when
                  </th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg) => (
                  <tr
                    key={pkg.code}
                    className="border-b border-gray-50 last:border-0 hover:bg-primary-50/20 transition-colors"
                  >
                    <td className="px-5 py-4">
                      <a
                        href={`#${pkg.code.toLowerCase()}`}
                        className="font-bold text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {pkg.code} · {pkg.name}
                      </a>
                    </td>
                    <td className="px-5 py-4 text-xs text-primary-600 font-semibold whitespace-nowrap">
                      {pkg.phase.replace('Phase ', 'P').replace(' · ', ': ')}
                    </td>
                    <td className="px-5 py-4 text-gray-600 whitespace-nowrap">{pkg.duration}</td>
                    <td className="px-5 py-4 font-bold text-amber-700 whitespace-nowrap">
                      {pkg.price}
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-xs leading-relaxed">
                      {pkg.promise}
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
                Honest Questions
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What SMB owners actually ask us.
              </h2>
              <p className="text-base text-gray-500 leading-relaxed">
                The questions you have before you spend money. Honest answers — including the
                ones consultants typically don&apos;t volunteer.
              </p>
            </div>
            <div className="space-y-4">
              {smbFaqs.map((faq) => (
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
            Ready to start small and ship fast?
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Drop us a WhatsApp message or book a 30-minute call. Tell us your situation
            and we&apos;ll tell you which package fits — or honestly say if AI isn&apos;t the right
            answer for this problem yet. Either way, the conversation is free and useful.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all duration-300"
            >
              Book a 30-minute call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <a
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-gray-700 glass-card hover:border-primary-200 transition-all duration-300"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
