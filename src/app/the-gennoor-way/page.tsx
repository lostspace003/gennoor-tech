import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Compass,
  GraduationCap,
  Lightbulb,
  Hammer,
  RefreshCcw,
  ArrowRight,
  Check,
  Rocket,
  Building2,
  TrendingDown,
} from 'lucide-react'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'
import ThreePledges from '@/components/ThreePledges'

export const metadata: Metadata = {
  title: 'The Gennoor Way — Enterprise AI Transformation Framework',
  description:
    'The five-phase methodology Gennoor Tech uses to deliver AI transformation: Diagnose, Train, Innovate, Build, Sustain. With timelines, price bands, entry points, and the Three Pledges that make us different.',
  keywords: [
    'AI transformation framework',
    'enterprise AI methodology',
    'AI adoption framework',
    'AI roadmap',
    'AI readiness assessment',
    'AI proof of concept',
    'AI sustainment',
    'The Gennoor Way',
  ],
  alternates: { canonical: 'https://gennoor.com/the-gennoor-way' },
  openGraph: {
    title: 'The Gennoor Way — Enterprise AI Transformation Framework',
    description:
      'Diagnose. Train. Innovate. Build. Sustain. The five-phase methodology behind every Gennoor engagement.',
    url: 'https://gennoor.com/the-gennoor-way',
  },
}

// ────────────────────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────────────────────

const phases = [
  {
    number: '01',
    slug: 'diagnose',
    name: 'Diagnose',
    icon: Compass,
    promise: 'Establish the truth about where your organization stands.',
    duration: '1–4 weeks',
    smbPrice: '$3k–$10k',
    enterprisePrice: '$25k–$80k',
    goal: 'Establish a credible, evidence-based starting point for AI transformation — so every subsequent investment has a defensible reason.',
    inputs: [
      'Executive interviews across 4–8 stakeholders',
      'Data inventory and data-quality scan',
      'Process maps for in-scope workflows',
      'Current tech stack and integration topology',
      'Regulatory and compliance posture',
      'Team skill snapshot',
    ],
    outputs: [
      'AI Readiness Score — five-dimension index (Strategy, Data, People, Tech, Governance)',
      'Use Case Backlog — 10–30 candidates scored by impact × feasibility',
      '12-month AI Roadmap',
      'Governance & Risk Charter',
      'Executive briefing deck and board-ready summary',
    ],
    boughtBy: 'Organizations that need a credible plan before they spend on AI — especially boards, audit committees, and CEOs about to allocate capital.',
  },
  {
    number: '02',
    slug: 'train',
    name: 'Train',
    icon: GraduationCap,
    promise: 'Raise your organization’s AI literacy ceiling and floor — at the same time.',
    duration: '2–8 weeks',
    smbPrice: '$5k–$20k per cohort',
    enterprisePrice: '$30k–$150k per program',
    goal: 'Build the skills, vocabulary, and confidence the org needs so that AI is adopted, not feared — and so the next phases have an informed audience.',
    inputs: [
      'Target audiences (executive / functional / technical / board)',
      'Business context, tools in use, current adoption maturity',
      'Real-world data scenarios (anonymized) for custom labs',
    ],
    outputs: [
      'C-Suite AI bootcamps — strategy, governance, ROI lens',
      'Functional cohorts — HR, Finance, Sales, Operations, Legal',
      'Technical guild track — prompt engineering, Copilot Studio, agent building, RAG',
      'Custom labs using your own data scenarios',
      'Post-training adoption playbook (this is the bridge to Phase 3)',
    ],
    boughtBy: 'Organizations that already have direction but need their people moving in it. Every cohort ends with a pilot-scoping session — that’s the trojan horse into Phase 3.',
  },
  {
    number: '03',
    slug: 'innovate',
    name: 'Innovate',
    icon: Lightbulb,
    promise: 'Turn the highest-value use case into a working PoC the team can touch.',
    duration: '4–8 weeks',
    smbPrice: '$15k–$40k',
    enterprisePrice: '$50k–$180k',
    goal: 'Take one use case from the backlog and ship a real, working prototype in your environment — not a slide deck, not a demo on our laptop.',
    inputs: [
      'Prioritized use case from the backlog',
      'Sample (or production) data',
      'Success criteria signed off by sponsor',
      'Stack Fit Assessment (cloud LLM vs open-source) — included',
    ],
    outputs: [
      'Working PoC running in your Azure / AWS / GCP / on-prem environment',
      'Architecture documentation and decision log',
      'Evaluation report — accuracy, latency, cost, user feedback',
      'Go / no-go business case for Phase 4',
      'Code transferred to your repository on day one',
    ],
    boughtBy: 'Teams ready to stop talking about AI and ship something. Fixed scope, fixed price — no "T&M PoCs" that drift.',
  },
  {
    number: '04',
    slug: 'build',
    name: 'Build',
    icon: Hammer,
    promise: 'Scale the PoC into a production system your team owns and operates.',
    duration: '8–20 weeks',
    smbPrice: '$30k–$100k',
    enterprisePrice: '$150k–$600k+',
    goal: 'Take what worked in Phase 3 and harden it into a system that runs at scale — with the operations team that will own it after we leave.',
    inputs: [
      'Validated PoC from Phase 3',
      'Production data access',
      'Integration requirements and SLA targets',
      'Your engineers shadowing from week one',
    ],
    outputs: [
      'Production deployment on your subscription',
      'CI/CD, monitoring, and evaluation harness',
      'Operations runbook and on-call playbook',
      'Adoption metrics dashboard',
      'Full knowledge transfer to client team — knowledge transfer is contractual, not optional',
    ],
    boughtBy: 'Organizations with a green-lit pilot ready to go live. We lead; your engineers take over by Go-Live.',
  },
  {
    number: '05',
    slug: 'sustain',
    name: 'Sustain',
    icon: RefreshCcw,
    promise: 'Keep the system — and the team — performant long after launch.',
    duration: 'Quarterly retainer · ongoing',
    smbPrice: '$2k–$6k/month',
    enterprisePrice: '$15k–$60k/month',
    goal: 'Make sure the AI system that went live in Phase 4 is still working — technically, economically, and organizationally — six months and six years from now.',
    inputs: [
      'Live system in production',
      'Ongoing use-case pipeline',
      'Model evaluation feedback',
    ],
    outputs: [
      'Quarterly health check — model drift, evaluation, governance refresh',
      'Cost & token spend audit with optimization recommendations',
      'Continuous L&D refresh for the operating team',
      'Annual strategy day — where the AI portfolio goes next year',
      'New use-case incubation pipeline (loops back to Phase 1 / 3)',
    ],
    boughtBy: 'Every Build-phase client should be a Sustain-phase client. This is the phase most consultancies skip — and the phase most AI projects die in.',
  },
]

const entryScenarios = [
  {
    icon: Rocket,
    title: 'Starting from zero',
    profile: 'You’ve heard about AI, you have budget, but you don’t know where to begin.',
    entry: 'Phase 1 · Diagnose',
    journey: 'Full five-phase journey, typically 9–18 months end-to-end.',
  },
  {
    icon: Building2,
    title: 'Strategy already done',
    profile: 'You have a roadmap (in-house or from a Big-4 firm) and you’re ready to execute.',
    entry: 'Phase 2 · Train  →  Phase 3 · Innovate',
    journey: 'Skip Diagnose, run a training cohort + a pilot in parallel. ~12 weeks to first working system.',
  },
  {
    icon: TrendingDown,
    title: 'Live model that’s drifting',
    profile: 'You shipped an AI system months ago. Adoption is sliding, costs are climbing, accuracy is degrading.',
    entry: 'Phase 5 · Sustain',
    journey: 'Quarterly health check + cost audit + L&D refresh. Often loops back into Phase 3 for the next use case.',
  },
]

const faqs = [
  {
    question: 'Do I have to start at Phase 1?',
    answer:
      'No. The Gennoor Way is a loop, not a waterfall. You can enter at any phase based on where your organization actually is. A bank with a roadmap can start at Train or Innovate. A team with a working PoC can start at Build. A live system that’s drifting can start at Sustain.',
  },
  {
    question: 'How is this different from what a Big-4 consultancy offers?',
    answer:
      'Three differences. First, we deliver the framework end-to-end — diagnostic to deployed agents to long-term sustainment — on one engagement. Big-4 firms typically split this across three different contracts. Second, we publish our price bands; Big-4 firms do not. Third, our delivery is senior-only — no analyst tier between you and the practitioner doing the work.',
  },
  {
    question: 'Who owns the IP — the code, the models, the prompts?',
    answer:
      'You do. Code is in your repositories from day one. Models, data, and prompts are client-owned. Our reusable frameworks (templates, evaluation harnesses, readiness scoring methodology) remain ours and are listed in the contract.',
  },
  {
    question: 'Can you work on AWS, GCP, or open-source — not just Microsoft?',
    answer:
      'Yes. Azure is our most-deployed stack because we’re Microsoft Certified Trainers, but we deliver on AWS Bedrock, Google Vertex AI, and self-hosted open-source (Llama, Mistral, Phi, Qwen). Every Innovate-phase engagement starts with a written Stack Fit Assessment comparing cloud LLM vs open-source, so the recommendation is yours, not ours.',
  },
  {
    question: 'Can you work air-gapped or on-premise for regulated workloads?',
    answer:
      'Yes. Open-source LLMs on private infrastructure — Ollama, vLLM, or Azure ML private endpoints — is one of our reference patterns. Common for government, defense, healthcare, and regulated finance clients who cannot send data to public APIs.',
  },
  {
    question: 'What happens if our team can’t take over after Build?',
    answer:
      'We extend hypercare and roll into a Sustain retainer. Knowledge transfer is contractual on every Build engagement, but if your team is unable to operate the system after handover, we stay. We have not yet had a client unable to take over — but the path is there if it ever happens.',
  },
  {
    question: 'How long does a typical full transformation take?',
    answer:
      'For an SMB starting at Phase 1, expect 6–9 months to ship the first production agent and another 3 months to scale to the next two use cases. For an enterprise, expect 12–24 months for the first wave of deployed systems, with Sustain running indefinitely as new use cases emerge.',
  },
  {
    question: 'Can we run our internal team and your team together?',
    answer:
      'Yes — this is our preferred model from Phase 4 onward. Co-build means we lead, your engineers shadow, and ownership transfers by Go-Live. We also work alongside existing SIs (Accenture, Wipro, TCS) as the AI specialist arm of broader transformations.',
  },
  {
    question: 'Where does the data sit?',
    answer:
      'In your environment. We build inside your Azure subscription, your AWS account, your on-prem infrastructure — never on Gennoor-owned infrastructure. The only exception is anonymized usage telemetry, which is opt-in.',
  },
  {
    question: 'Do you offer free starting points before we commit?',
    answer:
      'Yes. The 15-minute AI Readiness Diagnostic is free. Exploratory 30-minute calls are free. Free workshops run quarterly in GCC, India, and East Africa. We charge starting at the Diagnose-phase engagement.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────────────

export default function TheGennoorWayPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'The Gennoor Way', url: 'https://gennoor.com/the-gennoor-way' },
        ]}
      />
      <FAQJsonLd faqs={faqs} />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HERO                                                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              The Methodology
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              The <span className="gradient-text">Gennoor</span> Way
            </h1>
            <p className="font-heading text-base sm:text-lg font-semibold tracking-wide text-gray-700 mb-6">
              <span>Diagnose</span>
              <span className="text-amber-500">.</span>{' '}
              <span>Train</span>
              <span className="text-amber-500">.</span>{' '}
              <span>Innovate</span>
              <span className="text-amber-500">.</span>{' '}
              <span>Build</span>
              <span className="text-amber-500">.</span>{' '}
              <span>Sustain</span>
              <span className="text-amber-500">.</span>
            </p>
            <p className="text-lg sm:text-xl text-gray-500 mb-10 leading-relaxed max-w-3xl mx-auto">
              One partner. Five phases. Your AI transformation, end-to-end — diagnosed,
              trained, prototyped, built, and sustained by one team. Enter at any phase.
              Exit only when you choose to.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/ai-readiness"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all duration-300"
              >
                Run the 15-minute Diagnostic
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-gray-700 glass-card hover:border-primary-200 transition-all duration-300"
              >
                Talk to our team
              </Link>
            </div>
          </div>

          {/* Five-phase flow */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
              {phases.map((phase, i) => {
                const Icon = phase.icon
                return (
                  <a
                    key={phase.slug}
                    href={`#${phase.slug}`}
                    className="group block rounded-2xl p-5 glass-card glow-border transition-all duration-300 hover:-translate-y-1 relative"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold tracking-widest text-gray-300">
                        {phase.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/15 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{phase.name}</h3>
                    <p className="text-xs font-semibold text-primary-600 tracking-wide">
                      {phase.duration}
                    </p>
                    {i < phases.length - 1 && (
                      <div className="hidden lg:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 pointer-events-none">
                        <ArrowRight className="w-4 h-4 text-primary-300" />
                      </div>
                    )}
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* THE THREE PLEDGES                                                 */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <ThreePledges />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PHASE DEEP-DIVES                                                  */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              Phase Detail
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Five phases. One playbook each.
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              Goals, inputs, outputs, timelines, and price bands for every phase.
              Pick one, several, or all five.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            {phases.map((phase) => {
              const Icon = phase.icon
              return (
                <div
                  key={phase.slug}
                  id={phase.slug}
                  className="scroll-mt-24 rounded-3xl p-7 lg:p-10 glass-card glow-border"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-6 mb-8">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/15">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="text-xs font-bold tracking-widest text-gray-300">
                          PHASE {phase.number}
                        </span>
                        <span className="text-xs font-semibold text-primary-600">
                          {phase.duration}
                        </span>
                      </div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                        {phase.name}
                      </h3>
                      <p className="text-lg text-gray-600 leading-relaxed">
                        {phase.promise}
                      </p>
                    </div>
                  </div>

                  {/* Goal */}
                  <div className="mb-7">
                    <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                      Goal
                    </h4>
                    <p className="text-base text-gray-700 leading-relaxed">{phase.goal}</p>
                  </div>

                  {/* Inputs + Outputs grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mb-7">
                    <div>
                      <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                        Inputs we work with
                      </h4>
                      <ul className="space-y-2">
                        {phase.inputs.map((input) => (
                          <li
                            key={input}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <Check className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                            <span>{input}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                        Outputs you walk away with
                      </h4>
                      <ul className="space-y-2">
                        {phase.outputs.map((output) => (
                          <li
                            key={output}
                            className="flex items-start gap-2 text-sm text-gray-600"
                          >
                            <Check className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>{output}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Price band + Who buys */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-gray-100">
                    <div className="rounded-2xl p-5 bg-primary-50/50">
                      <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">
                        Price band
                      </h4>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">SMB</span>
                          <span className="font-semibold text-gray-900">{phase.smbPrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Enterprise</span>
                          <span className="font-semibold text-gray-900">
                            {phase.enterprisePrice}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="rounded-2xl p-5 bg-amber-50/50">
                      <h4 className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-3">
                        Who buys this alone
                      </h4>
                      <p className="text-sm text-gray-600 leading-relaxed">{phase.boughtBy}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ENTRY POINTS                                                      */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              Enter at Any Phase
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Which phase are you in?
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed">
              The Gennoor Way is a loop, not a waterfall. Three common starting points
              — most clients fit one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {entryScenarios.map((scenario) => {
              const Icon = scenario.icon
              return (
                <div
                  key={scenario.title}
                  className="rounded-2xl p-7 glass-card glow-border transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-5 shadow-lg shadow-primary-500/15">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{scenario.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    {scenario.profile}
                  </p>
                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1.5">
                      Recommended entry
                    </p>
                    <p className="text-sm font-semibold text-primary-600 mb-3">
                      {scenario.entry}
                    </p>
                    <p className="text-xs text-gray-500 leading-relaxed">{scenario.journey}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="text-center text-sm text-gray-500 mt-10">
            Not sure which fits?{' '}
            <Link
              href="/ai-readiness"
              className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
            >
              Run the 15-minute diagnostic →
            </Link>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FAQ                                                               */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-24 relative">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
                Frequently Asked
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Questions before you start.
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FINAL CTA                                                         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5">
            Ready to find your phase?
          </h2>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Start with the free 15-minute diagnostic, or book a 30-minute call with our
            team. Either way, you walk away knowing exactly where to start.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/ai-readiness"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:shadow-glow-blue transition-all duration-300"
            >
              Run the Diagnostic
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-gray-700 glass-card hover:border-primary-200 transition-all duration-300"
            >
              Book a 30-minute call
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
