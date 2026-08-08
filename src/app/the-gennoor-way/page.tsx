import type { Metadata } from 'next'
import Link from 'next/link'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

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

/**
 * The Gennoor Way in the Apple idiom, per the redesign handoff: display
 * hero with the phase strip, five white phase cards on the #f5f5f7 panel,
 * the six principles, and the "Phase one takes 15 minutes." CTA. The deep
 * playbook content (goals, inputs, price bands, who-buys), entry scenarios,
 * and the full FAQ (with FAQ JSON-LD) all survive.
 */

// ────────────────────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────────────────────

const phases = [
  {
    number: '01',
    slug: 'diagnose',
    name: 'Diagnose',
    duration: '1–4 weeks',
    intro:
      'Before anything is built or bought, we measure where you actually stand — data, people, infrastructure, and governance.',
    deliverables: ['AI Readiness Score', 'Use-case backlog, ranked by ROI', '12-month roadmap', 'Governance charter'],
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
    boughtBy:
      'Organizations that need a credible plan before they spend on AI — especially boards, audit committees, and CEOs about to allocate capital.',
  },
  {
    number: '02',
    slug: 'train',
    name: 'Train',
    duration: '2–8 weeks',
    intro:
      'Adoption fails on people, not models. We train every layer of the organization with custom curricula built on your data.',
    deliverables: ['C-suite strategy sessions', 'Functional cohorts (HR, finance, sales)', 'Technical bootcamps', 'Prompt libraries per role'],
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
    boughtBy:
      'Organizations that already have direction but need their people moving in it. Every cohort ends with a pilot-scoping session — that’s the trojan horse into Phase 3.',
  },
  {
    number: '03',
    slug: 'innovate',
    name: 'Innovate',
    duration: '4–8 weeks',
    intro:
      'One high-value use case becomes a working PoC in your environment — with evaluation criteria agreed before we write code.',
    deliverables: ['Working PoC in your tenant', 'Fixed scope and price', 'Evaluation report', 'Go / no-go recommendation'],
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
    boughtBy:
      'Teams ready to stop talking about AI and ship something. Fixed scope, fixed price — no "T&M PoCs" that drift.',
  },
  {
    number: '04',
    slug: 'build',
    name: 'Build',
    duration: '8–20 weeks',
    intro:
      'The PoC that earned it goes to production — with the MLOps, security review, and knowledge transfer to make it stick.',
    deliverables: ['Production deployment', 'MLOps and monitoring', 'Security & compliance review', 'Handover to your team'],
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
    boughtBy:
      'Organizations with a green-lit pilot ready to go live. We lead; your engineers take over by Go-Live.',
  },
  {
    number: '05',
    slug: 'sustain',
    name: 'Sustain',
    duration: 'Ongoing',
    intro:
      'AI systems drift and costs creep. We stay on a light retainer to keep what we built healthy — and find what to build next.',
    deliverables: ['Quarterly health checks', 'Cost audits', 'Continuous L&D', 'Expansion roadmap'],
    smbPrice: '$2k–$6k/month',
    enterprisePrice: '$15k–$60k/month',
    goal: 'Make sure the AI system that went live in Phase 4 is still working — technically, economically, and organizationally — six months and six years from now.',
    inputs: ['Live system in production', 'Ongoing use-case pipeline', 'Model evaluation feedback'],
    outputs: [
      'Quarterly health check — model drift, evaluation, governance refresh',
      'Cost & token spend audit with optimization recommendations',
      'Continuous L&D refresh for the operating team',
      'Annual strategy day — where the AI portfolio goes next year',
      'New use-case incubation pipeline (loops back to Phase 1 / 3)',
    ],
    boughtBy:
      'Every Build-phase client should be a Sustain-phase client. This is the phase most consultancies skip — and the phase most AI projects die in.',
  },
]

const principles = [
  { title: 'Fixed price, fixed scope', body: 'Every phase is priced before it starts. No time-and-materials drift.' },
  { title: 'Senior-only delivery', body: 'The person who scopes your engagement is the person who delivers it.' },
  { title: 'Your environment, your IP', body: 'We build in your tenant. Everything we make is yours when we leave.' },
  { title: 'Evaluation before enthusiasm', body: 'PoCs ship with agreed success criteria — and an honest go / no-go.' },
  { title: 'Start at any phase', body: 'Already trained? Skip to Innovate. Already have a PoC? Start at Build.' },
  { title: 'Exit ramps everywhere', body: 'Every phase ends with a deliverable that stands alone. Leave whenever.' },
]

const entryScenarios = [
  {
    title: 'Starting from zero',
    profile: 'You’ve heard about AI, you have budget, but you don’t know where to begin.',
    entry: 'Phase 1 · Diagnose',
    journey: 'Full five-phase journey, typically 9–18 months end-to-end.',
  },
  {
    title: 'Strategy already done',
    profile: 'You have a roadmap (in-house or from a Big-4 firm) and you’re ready to execute.',
    entry: 'Phase 2 · Train  →  Phase 3 · Innovate',
    journey: 'Skip Diagnose, run a training cohort + a pilot in parallel. ~12 weeks to first working system.',
  },
  {
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

      <main className="min-h-screen bg-white">
        {/* ===== Hero ===== */}
        <section className="px-8 pt-20 lg:pt-[110px] pb-20 text-center">
          <div className="kicker mb-5">The Gennoor Way</div>
          <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900 max-w-[800px] mx-auto">
            Five phases. One methodology.
          </h1>
          <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[600px] mx-auto mt-[22px]">
            Every engagement — a $3k readiness kit or a $350k transformation —
            runs the same disciplined arc. Start at any phase.
          </p>
          <p className="text-[15px] font-semibold text-gray-900 tracking-[0.02em] mt-9">
            Diagnose&nbsp; →&nbsp; Train&nbsp; →&nbsp; Innovate&nbsp; →&nbsp; Build&nbsp; →&nbsp; Sustain
          </p>
        </section>

        {/* ===== Phases ===== */}
        <section className="bg-[#f5f5f7] px-8 py-20">
          <div className="max-w-[920px] mx-auto flex flex-col gap-4">
            {phases.map(phase => (
              <div
                key={phase.slug}
                id={phase.slug}
                className="scroll-mt-16 bg-white rounded-3xl px-7 py-8 lg:px-11 lg:py-10 grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6 md:gap-9"
              >
                {/* Number + duration */}
                <div>
                  <div className="text-[44px] font-bold tracking-[-0.03em] leading-none text-[#d2d2d7]">
                    {phase.number}
                  </div>
                  <div className="text-[13px] font-semibold text-primary-600 mt-2.5">{phase.duration}</div>
                </div>

                {/* Body */}
                <div>
                  <h2 className="text-[26px] font-bold tracking-[-0.02em] text-gray-900 mb-2">{phase.name}</h2>
                  <p className="text-[15px] leading-[1.55] text-[#6e6e73] mb-[18px]">{phase.intro}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                    {phase.deliverables.map(d => (
                      <div key={d} className="text-[13.5px] text-gray-900 flex gap-2">
                        <span className="text-primary-600 font-bold">›</span>
                        {d}
                      </div>
                    ))}
                  </div>

                  {/* Full playbook — the deep content, kept behind a quiet toggle */}
                  <details className="group mt-5 border-t border-[#f0f0f2] pt-4">
                    <summary className="cursor-pointer list-none text-[13px] font-semibold text-primary-600 hover:text-[#0077ed]">
                      <span className="group-open:hidden">Full playbook ›</span>
                      <span className="hidden group-open:inline">Hide playbook</span>
                    </summary>
                    <div className="mt-4 space-y-4">
                      <p className="text-[13.5px] leading-[1.6] text-[#6e6e73]">{phase.goal}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#86868b] mb-2">
                            Inputs we work with
                          </p>
                          <ul className="space-y-1.5">
                            {phase.inputs.map(input => (
                              <li key={input} className="text-[13px] text-[#6e6e73] flex gap-2">
                                <span className="text-[#d2d2d7]">·</span>
                                {input}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#86868b] mb-2">
                            Outputs you walk away with
                          </p>
                          <ul className="space-y-1.5">
                            {phase.outputs.map(output => (
                              <li key={output} className="text-[13px] text-[#6e6e73] flex gap-2">
                                <span className="text-[#d2d2d7]">·</span>
                                {output}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-x-8 gap-y-2 border-t border-[#f0f0f2] pt-3.5 text-[13px]">
                        <div>
                          <span className="text-[#86868b]">SMB </span>
                          <span className="font-semibold text-gray-900">{phase.smbPrice}</span>
                        </div>
                        <div>
                          <span className="text-[#86868b]">Enterprise </span>
                          <span className="font-semibold text-gray-900">{phase.enterprisePrice}</span>
                        </div>
                      </div>
                      <p className="text-[13px] leading-[1.6] text-[#6e6e73]">
                        <span className="font-semibold text-gray-900">Who buys this alone: </span>
                        {phase.boughtBy}
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== Principles ===== */}
        <section className="px-8 py-16 lg:py-24">
          <div className="max-w-[1080px] mx-auto">
            <h2 className="display-section text-center mb-14">How we keep it honest.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-12">
              {principles.map(p => (
                <div key={p.title}>
                  <div className="text-[16px] font-bold text-gray-900 mb-1.5">{p.title}</div>
                  <div className="text-sm leading-[1.55] text-[#6e6e73]">{p.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Entry points ===== */}
        <section className="bg-[#f5f5f7] px-8 py-16 lg:py-24">
          <div className="max-w-[1080px] mx-auto">
            <h2 className="display-card text-center mb-3">Which phase are you in?</h2>
            <p className="text-[18px] text-[#6e6e73] text-center mb-12">
              The Gennoor Way is a loop, not a waterfall. Three common starting points.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {entryScenarios.map(scenario => (
                <div key={scenario.title} className="bg-white border border-[#e8e8ed] rounded-[18px] px-6 py-7 flex flex-col">
                  <h3 className="text-[17px] font-bold text-gray-900 mb-2">{scenario.title}</h3>
                  <p className="text-[13.5px] leading-[1.55] text-[#6e6e73] mb-5">{scenario.profile}</p>
                  <div className="border-t border-[#f0f0f2] pt-3.5 mt-auto">
                    <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[#86868b] mb-1">
                      Recommended entry
                    </p>
                    <p className="text-[13.5px] font-semibold text-primary-600 mb-2">{scenario.entry}</p>
                    <p className="text-xs leading-[1.55] text-[#6e6e73]">{scenario.journey}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-[#6e6e73] mt-9">
              Not sure which fits?{' '}
              <Link href="/ai-readiness" className="text-primary-600 font-medium hover:text-[#0077ed]">
                Run the 15-minute diagnostic ›
              </Link>
            </p>
          </div>
        </section>

        {/* ===== FAQ ===== */}
        <section className="px-8 py-16 lg:py-24">
          <div className="max-w-[720px] mx-auto">
            <h2 className="display-card text-center mb-12">Questions before you start.</h2>
            <div className="border-t border-[#e8e8ed]">
              {faqs.map(faq => (
                <details key={faq.question} className="group border-b border-[#e8e8ed] py-5">
                  <summary className="relative cursor-pointer list-none pr-8 text-[16px] font-semibold text-gray-900">
                    {faq.question}
                  </summary>
                  <p className="text-sm text-[#6e6e73] mt-3 leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="bg-[#f5f5f7] px-8 py-[90px] text-center">
          <h2 className="display-section">Phase one takes 15 minutes.</h2>
          <p className="text-[18px] text-[#6e6e73] mt-3 mb-7 max-w-[460px] mx-auto">
            The diagnostic is where every engagement begins.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center">
            <Link href="/ai-readiness" className="pill-primary-sm">
              Run the diagnostic
            </Link>
            <Link href="/contact" className="text-[15px] font-medium text-primary-600 hover:text-[#0077ed]">
              Book a call ›
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}
