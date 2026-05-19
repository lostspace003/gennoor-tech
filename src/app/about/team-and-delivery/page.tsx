import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Users,
  Compass,
  GraduationCap,
  Hammer,
  Cog,
  Megaphone,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  Clock,
  Calendar,
  Activity,
  Layers,
  TrendingUp,
  Heart,
  AlertTriangle,
  Award,
  CheckCircle2,
} from 'lucide-react'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Team & Delivery Model — Gennoor Tech',
  description:
    'How Gennoor Tech delivers. Senior-only, capacity-limited model. Seven-role mix, weekly demo cadence, contractual knowledge transfer, and the continuity model that protects your engagement.',
  keywords: [
    'Gennoor Tech team',
    'AI consultant delivery model',
    'senior AI practitioner',
    'AI consultant capacity',
    'AI consultant knowledge transfer',
    'boutique AI consultancy',
    'AI engagement cadence',
  ],
  alternates: { canonical: 'https://gennoor.com/about/team-and-delivery' },
  openGraph: {
    title: 'Team & Delivery Model — Gennoor Tech',
    description:
      'Senior-only, capacity-limited delivery. Seven roles, weekly demo cadence, contractual knowledge transfer.',
    url: 'https://gennoor.com/about/team-and-delivery',
  },
}

// ────────────────────────────────────────────────────────────────────────────
// ROLE MIX
// ────────────────────────────────────────────────────────────────────────────

const roles = [
  {
    role: 'Engagement Lead',
    icon: Briefcase,
    seniority: 'Senior · 12+ years',
    responsibility:
      'Owns the relationship end-to-end. Accountable for scope, timeline, quality, and the steering committee. The single name on every status email.',
    presentIn: 'Every engagement, every phase',
    typicalProfile:
      'Microsoft Certified Trainer with multi-program delivery experience across regulated industries. Comfortable in CIO/CDO rooms and on engineering Slack channels alike.',
  },
  {
    role: 'Solutions Architect',
    icon: Compass,
    seniority: 'Senior · 10+ years',
    responsibility:
      'Designs the technical approach. Signs off on the Stack Fit Assessment. Owns architecture decisions and the trade-off log. Reviews every architectural change.',
    presentIn: 'Phase 1 (Diagnose) · Phase 3 (Innovate) · Phase 4 (Build)',
    typicalProfile:
      'Azure AI Engineer or equivalent certifications, plus deep AI/ML and integration experience. Has shipped at least three production AI systems through full lifecycle.',
  },
  {
    role: 'Senior Trainer / Coach',
    icon: GraduationCap,
    seniority: 'Senior · 10+ years',
    responsibility:
      'Delivers training content (executive, functional, technical). Runs adoption sessions. Coaches receiving teams through Sustain.',
    presentIn: 'Phase 2 (Train) · Phase 5 (Sustain)',
    typicalProfile:
      'Microsoft Certified Trainer (MCT). Has trained C-suite cohorts at Fortune 500 scale. Skilled at translating between executive and technical audiences.',
  },
  {
    role: 'PoC Engineer',
    icon: Hammer,
    seniority: 'Senior · 8+ years',
    responsibility:
      'Builds the pilot. Pairs with the Solutions Architect on architecture, owns the delivery of the working PoC. Demos every Friday.',
    presentIn: 'Phase 3 (Innovate)',
    typicalProfile:
      'Strong full-stack engineer with AI specialization (RAG, agents, evaluation). Ships fast, demos confidently, documents as they go.',
  },
  {
    role: 'Production Engineer',
    icon: Cog,
    seniority: 'Senior · 8+ years',
    responsibility:
      'Scales the pilot. Sets up CI/CD, observability, MLOps. Co-builds with your engineering team to ensure knowledge transfer is real.',
    presentIn: 'Phase 4 (Build)',
    typicalProfile:
      'Production-grade DevOps and MLOps experience. Comfortable in your cloud environment (Azure / AWS / GCP) and on-prem patterns alike.',
  },
  {
    role: 'Adoption Lead',
    icon: Megaphone,
    seniority: 'Senior · 8+ years',
    responsibility:
      'Drives change management. Measures adoption. Designs the rollout pattern from pilot to organization-wide. The bridge between technology and people.',
    presentIn: 'Phase 4 (Build) · Phase 5 (Sustain)',
    typicalProfile:
      'Background in L&D or change management, layered with AI/Copilot product expertise. Has run org-wide rollouts at 500+ user scale.',
  },
  {
    role: 'Governance Analyst',
    icon: ShieldCheck,
    seniority: 'Senior · 8+ years',
    responsibility:
      'Risk, compliance, and evaluation. Owns the governance charter, the evaluation harness, and the audit-readiness pack.',
    presentIn: 'Phase 1 (Diagnose) · Phase 5 (Sustain) · cross-cutting through Phase 3 & 4',
    typicalProfile:
      'AI risk and compliance specialization. Familiar with NIST AI RMF, EU AI Act, OWASP for LLMs, and regional rules (PDPL / DPDP / GDPR).',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// OPERATING CADENCE
// ────────────────────────────────────────────────────────────────────────────

const cadence = [
  {
    rhythm: 'Daily',
    activity: 'Async Slack channel · response within 24 hours, usually faster.',
    icon: Activity,
  },
  {
    rhythm: 'Weekly · Monday',
    activity:
      'Written status update to sponsors — what shipped last week, what ships this week, what is at risk.',
    icon: Clock,
  },
  {
    rhythm: 'Weekly · Friday',
    activity:
      'Live demo of work-in-progress. Mandatory. No engagement goes more than 5 working days without a demo — this is the rule.',
    icon: TrendingUp,
  },
  {
    rhythm: 'Fortnightly',
    activity:
      'Steering committee for enterprise engagements (E3 onward). Executive-level review of progress, risks, decisions needed.',
    icon: Users,
  },
  {
    rhythm: 'Phase gate',
    activity:
      'Written sign-off before moving from one Gennoor Way phase to the next. No phase starts without explicit approval of the prior phase\'s deliverables.',
    icon: CheckCircle2,
  },
  {
    rhythm: 'Quarterly (Sustain)',
    activity:
      'Full health check across all deployed systems. Written report with prioritized action list.',
    icon: Calendar,
  },
  {
    rhythm: 'Annually (Sustain)',
    activity:
      'Strategy day for the next 12 months — portfolio expansion, retirement decisions, budget alignment, capability gaps.',
    icon: Award,
  },
]

// ────────────────────────────────────────────────────────────────────────────
// CONTINUITY PROTECTIONS
// ────────────────────────────────────────────────────────────────────────────

const continuity = [
  {
    title: 'Your code lives in your repositories',
    detail:
      'Every commit goes to your GitHub / Azure DevOps / GitLab from day one. We do not maintain "client-X-private" repositories. If we vanished tomorrow, your code is still there, still operable, still yours.',
  },
  {
    title: 'Your cloud accounts are yours',
    detail:
      'We build in your Azure subscription, AWS account, GCP project, or on-prem infra. Credentials are your IAM\'s problem, not ours. Off-boarding is a credential revocation, not a data migration.',
  },
  {
    title: 'Documentation handed over at every phase gate',
    detail:
      'You hold the design documents, decision logs, evaluation reports, operations runbooks, and training materials at each phase gate — not in a deliverables-at-the-end model.',
  },
  {
    title: 'Knowledge transfer is contractual',
    detail:
      'Every Build (Phase 4) engagement carries an explicit KT clause. By Go-Live, your engineering team has merged code, run a deployment, and resolved an incident — without us in the room.',
  },
  {
    title: 'Senior partner network for surge',
    detail:
      'For larger engagements requiring additional capacity, we work with a vetted network of senior partner practitioners under back-to-back NDAs. Surge capacity does not change the seniority bar.',
  },
  {
    title: 'No proprietary lock-in',
    detail:
      'Our reusable frameworks (methodology, evaluation harnesses, course templates) are non-confidential and re-implementable. You can fork them. We don\'t hide value in tooling that locks you in.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// FAQ
// ────────────────────────────────────────────────────────────────────────────

const teamFaqs = [
  {
    question: 'How many active engagements does Gennoor run at once?',
    answer:
      'We cap active engagements per quarter to maintain the senior-only standard. Typical limit: 3–5 active engagements at any one time depending on phase mix (Diagnose engagements are shorter, Build engagements run longer). For E4 Transformation Programs in the $300k+ range, we are transparent about start-date availability at scoping; we do not over-commit.',
  },
  {
    question: 'Who specifically will be on my engagement?',
    answer:
      'The Engagement Lead is named in the SOW. The supporting roles (Solutions Architect, Senior Trainer, PoC Engineer, etc.) are named in the kickoff document within the first week. You meet every practitioner who will touch your engagement before they start work.',
  },
  {
    question: 'What if my Engagement Lead is unavailable mid-engagement?',
    answer:
      'Engagement Leads have a designated backup named at kickoff — typically the Solutions Architect or another senior practitioner who has been in the engagement from week one. The backup has working context, attends key reviews, and can step in without re-orientation. Lead transitions (planned or otherwise) are handled with written notification and a 2-week overlap where possible.',
  },
  {
    question: 'Do you subcontract any of the work?',
    answer:
      'Sometimes, but with strict boundaries. For specialized capacity (e.g., a deep MLOps engineer for one workstream, a regional language specialist), we work with a vetted senior partner network under back-to-back NDAs. Every subcontracted practitioner meets the same seniority bar as our core team. We never use junior staff augmentation. Subcontractors are disclosed to you before they join the engagement.',
  },
  {
    question: 'How do you scale for very large programs (E4 Transformation, E6 CoE)?',
    answer:
      'Larger programs are delivered with a small senior team — typically 3–6 practitioners (Lead + Architect + Trainer + Engineers + Adoption + Governance) — coordinated through the Engagement Lead. The team scales by adding seniors, never by adding analysts. For programs requiring more than 8 active practitioners, we partner with system integrators as the AI specialist arm of a broader delivery.',
  },
  {
    question: 'Is the founder always involved?',
    answer:
      'For SMB engagements (S1–S5) and Phase 1 Strategic Diagnostics, the founder is typically the Engagement Lead. For multi-quarter enterprise programs, the founder may be the executive sponsor with another senior practitioner as Engagement Lead. The founder remains accountable to every client and is reachable for any client at any time.',
  },
  {
    question: 'What are your hiring standards?',
    answer:
      'Two hard requirements: (1) Senior — minimum 8 years of professional experience, mostly in AI / ML / cloud / enterprise software delivery; (2) Certified or equivalent — Microsoft Certified Trainer status, or equivalent vendor certifications, or a verified track record of senior delivery in AI for the role we are hiring for. We hire slowly. We do not hire to grow the headcount.',
  },
  {
    question: 'How does engagement capacity affect my start date?',
    answer:
      'Honestly. At scoping, we tell you when we can start. For Strategic Diagnostics (E1) and most SMB packages, start is typically within 2–3 weeks. For E3 Pilots, 2–6 weeks. For E4 Transformation Programs, 4–10 weeks depending on the queue. If your timeline is urgent and we cannot meet it, we say so — and we recommend partner firms when relevant.',
  },
  {
    question: 'What happens to my engagement if Gennoor goes out of business?',
    answer:
      'Three protections built in by design: (1) Your code, models, prompts are in your repositories from day one — you can operate without us. (2) Your cloud accounts and credentials are yours — we have no access after off-boarding. (3) Your documentation is handed over at every phase gate — no critical knowledge lives only in our heads. Practically: if we disappeared tomorrow, your AI system would keep running, and you could engage another firm to extend it.',
  },
  {
    question: 'Can we negotiate exclusivity for our region or industry?',
    answer:
      'Not as a hard rule, but as a soft commitment. For large, multi-quarter engagements, we sometimes agree to non-compete clauses for direct competitors within a defined region or sector for the engagement duration. The clause has to be reasonable and not constrain our practice broadly — we serve multiple clients across BFSI, healthcare, public sector, and others, and that diversity is part of what makes our team good.',
  },
  {
    question: 'How do you handle handover when the engagement ends?',
    answer:
      'Per the contractual KT clause: by Go-Live (Phase 4) or scope completion (any phase), your team has the artifacts, the runbook, the credentials, and the practice to operate independently. Off-boarding includes: credential revocation within 5 working days, final documentation pack, exit retrospective with written recommendations, and (optional) a 4-week hypercare extension. After hypercare, the relationship continues through Sustain (Phase 5) if you elect it; otherwise we are out of your environment.',
  },
  {
    question: 'How do you grow without compromising the senior-only model?',
    answer:
      'Slowly, deliberately, and with a hard floor on seniority. Our growth path is: (1) Build a small core team of 4–8 seniors (not 40 mid-levels). (2) Use a partner network for surge. (3) When we grow, we add seniors only — no analyst tier ever. The reason we cap engagements per quarter today is exactly because growth at the wrong tier would dilute the model. We would rather turn engagements down than under-deliver on senior delivery.',
  },
]

// ────────────────────────────────────────────────────────────────────────────
// PAGE
// ────────────────────────────────────────────────────────────────────────────

export default function TeamAndDeliveryPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://gennoor.com' },
          { name: 'About', url: 'https://gennoor.com/about' },
          { name: 'Team & Delivery', url: 'https://gennoor.com/about/team-and-delivery' },
        ]}
      />
      <FAQJsonLd faqs={teamFaqs} />

      {/* HERO */}
      <section className="relative py-14 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 bg-gradient-mesh" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full px-3 py-1 mb-5 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
              <Users className="w-3 h-3 mr-1.5" />
              Who actually delivers, and how
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-5 leading-[1.1]">
              Senior-only delivery.
              <br />
              <span className="gradient-text">Capacity-limited by design.</span>
            </h1>
            <p className="text-lg text-gray-500 mb-6 leading-relaxed max-w-3xl">
              Every practitioner on your engagement is a senior — 8+ years minimum, mostly
              certified, all with shipped-to-production track records. We have no analyst tier,
              no offshore back-bench, and no surprise junior staffing changes. We turn
              engagements down rather than break this rule.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <Award className="w-4 h-4 text-primary-500" />
                Microsoft Certified Trainers across the senior team
              </span>
              <span className="text-gray-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-primary-500" />
                Weekly demo rhythm, no engagement silent for &gt;5 working days
              </span>
            </div>
          </div>

          {/* On-page TOC */}
          <nav className="mt-12 max-w-4xl mx-auto rounded-2xl p-5 glass-card">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
              On this page
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-1.5 text-sm">
              {[
                ['1. The senior-only model', 'model'],
                ['2. The seven roles', 'roles'],
                ['3. Operating cadence', 'cadence'],
                ['4. Demo culture', 'demo-culture'],
                ['5. Knowledge transfer', 'knowledge-transfer'],
                ['6. Engagement capacity', 'capacity'],
                ['7. Continuity & resilience', 'continuity'],
                ['8. Founder', 'founder'],
                ['9. FAQ', 'faq'],
              ].map(([label, anchor]) => (
                <li key={anchor}>
                  <a
                    href={`#${anchor}`}
                    className="text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </section>

      {/* 1. THE MODEL */}
      <Section id="model" eyebrow="01 · The Model" title="Why senior-only, and why capped.">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          <div className="rounded-2xl p-7 glass-card">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-gray-900">The Big-4 pyramid</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Partner sells the engagement. Manager runs the team. Senior analysts and
              analysts do 80–90% of the actual work. The bill rate is senior; the delivery is
              not.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              This model works for large undifferentiated projects. It does not work for AI —
              where the wrong prompt, the wrong evaluation, or the wrong governance gap costs
              more to fix than to do right the first time.
            </p>
          </div>
          <div className="rounded-2xl p-7 glass-card glow-border">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-primary-500" />
              <h3 className="text-base font-bold text-gray-900">The Gennoor model</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Every line of code, every workshop slide, every architecture decision, every
              evaluation report touched by a practitioner with 8+ years of senior experience.
              No analyst tier. No offshore back-bench. No surprise junior staffing.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              The trade-off: we cap active engagements per quarter. That is the cost of this
              model — and the reason it works.
            </p>
          </div>
        </div>

        <div className="rounded-2xl p-7 mt-6 max-w-6xl bg-primary-50/40 border border-primary-100/50">
          <p className="text-sm font-bold tracking-widest text-primary-600 uppercase mb-2">
            The hard floor
          </p>
          <p className="text-base text-gray-700 leading-relaxed">
            <strong>Minimum 8 years of professional experience.</strong> Microsoft Certified
            Trainer or equivalent vendor certifications. Verified production track record in
            the role being staffed. We have turned away engagements rather than break this.
            We will continue to.
          </p>
        </div>
      </Section>

      {/* 2. ROLES */}
      <Section
        id="roles"
        eyebrow="02 · The Seven Roles"
        title="Who shows up on your engagement."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          Engagements are delivered through a defined role mix. Not every role appears on
          every engagement — a 4-week SMB pilot looks different from a 16-week enterprise
          build. The mix is scoped to the engagement at kickoff and disclosed in the SOW.
        </p>
        <div className="space-y-4 max-w-6xl">
          {roles.map((r) => {
            const Icon = r.icon
            return (
              <div key={r.role} className="rounded-2xl p-6 glass-card">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/15">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-base font-bold text-gray-900 leading-tight">
                        {r.role}
                      </h3>
                    </div>
                    <p className="text-xs font-bold tracking-widest text-amber-700 uppercase">
                      {r.seniority}
                    </p>
                  </div>
                  <div className="lg:col-span-5">
                    <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                      What they do
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{r.responsibility}</p>
                  </div>
                  <div className="lg:col-span-4">
                    <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                      Present in
                    </h4>
                    <p className="text-sm font-semibold text-primary-600 mb-3 leading-relaxed">
                      {r.presentIn}
                    </p>
                    <h4 className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">
                      Typical profile
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">{r.typicalProfile}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* 3. CADENCE */}
      <Section
        id="cadence"
        eyebrow="03 · Operating Cadence"
        title="The rhythm every engagement runs on."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          Every engagement, regardless of phase or scope, follows the same operating rhythm.
          This is what kills the "60-day silence then a bad surprise" pattern that plagues
          most consulting engagements.
        </p>
        <div className="space-y-3 max-w-6xl">
          {cadence.map((c) => {
            const Icon = c.icon
            return (
              <div
                key={c.rhythm}
                className="rounded-2xl p-5 glass-card flex flex-col sm:flex-row sm:items-start gap-4"
              >
                <div className="flex items-center gap-3 sm:w-56 flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/15">
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-900">{c.rhythm}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed flex-1">{c.activity}</p>
              </div>
            )
          })}
        </div>
      </Section>

      {/* 4. DEMO CULTURE */}
      <Section
        id="demo-culture"
        eyebrow="04 · Demo Culture"
        title="The five-day rule."
      >
        <div className="rounded-3xl p-7 lg:p-10 glass-card max-w-5xl glow-border">
          <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-5 leading-tight">
            <span className="text-amber-500">No engagement</span> goes more than{' '}
            <span className="gradient-text">five working days</span> without a demo of
            something.
          </p>
          <p className="text-base text-gray-600 leading-relaxed mb-5">
            Even at week one. Even if it&apos;s a clickable mockup. Even if it&apos;s a 5-minute
            walkthrough of an architecture decision and what we&apos;re trying with it.
          </p>
          <p className="text-base text-gray-600 leading-relaxed mb-5">
            The rule is not "demo when there is something to demo." It is "demo every week,
            regardless." If a week passes without anything worth showing, the engagement has
            already gone wrong and we surface that — instead of running silent for another
            three weeks until the bad news lands at once.
          </p>
          <p className="text-sm font-semibold text-primary-600">
            This is the single most important operational rule at Gennoor.
          </p>
        </div>
      </Section>

      {/* 5. KNOWLEDGE TRANSFER */}
      <Section
        id="knowledge-transfer"
        eyebrow="05 · Knowledge Transfer"
        title="Co-build, not handover."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          The classic "we built it, here are the keys, good luck" model fails for AI
          engagements. Our approach: your team is in the build from week one, and Knowledge
          Transfer is contractual — not a final-week milestone.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-6xl">
          <div className="rounded-2xl p-6 glass-card">
            <Heart className="w-6 h-6 text-primary-500 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Pair from day one
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your engineers shadow ours from the first commit. We pair on architectural
              decisions, code reviews, and incident response. They learn the system by
              building it with us, not by reading about it after.
            </p>
          </div>
          <div className="rounded-2xl p-6 glass-card">
            <CheckCircle2 className="w-6 h-6 text-primary-500 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Three measurable checkpoints
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              By Go-Live, your team has: (1) merged code into production, (2) executed a
              deployment, (3) resolved an incident — without us in the room. These are
              checkpoints in the contract, not aspirations.
            </p>
          </div>
          <div className="rounded-2xl p-6 glass-card">
            <Layers className="w-6 h-6 text-primary-500 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Runbook + on-call rotation
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The operations runbook is owned by your team. By the end of hypercare, your
              on-call rotation includes the system, your engineers have practiced on-call
              scenarios with us, and you can resolve a Sev-2 without escalating.
            </p>
          </div>
          <div className="rounded-2xl p-6 glass-card">
            <GraduationCap className="w-6 h-6 text-primary-500 mb-3" />
            <h3 className="text-base font-bold text-gray-900 mb-2">
              Training built into the schedule
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Phase 2 (Train) runs in parallel with Phase 3 and Phase 4 for the receiving
              team. Your engineers, your operations folks, your business sponsors all get
              role-specific training timed to where they enter the system.
            </p>
          </div>
        </div>
      </Section>

      {/* 6. CAPACITY */}
      <Section
        id="capacity"
        eyebrow="06 · Engagement Capacity"
        title="What we will (and will not) take on."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl">
          <div className="rounded-2xl p-6 glass-card">
            <h3 className="text-base font-bold text-gray-900 mb-3">Active engagement cap</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              We typically run 3–5 active engagements at once, scaled by phase mix. SMB
              packages (S1–S5) and Strategic Diagnostics (E1) run shorter; E3 Pilots and E4
              Transformation Programs are longer and tie up more senior capacity.
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              At scoping, we tell you our next available start date — honestly, including
              when we are queued out.
            </p>
          </div>
          <div className="rounded-2xl p-6 glass-card">
            <h3 className="text-base font-bold text-gray-900 mb-3">When we say no</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              We turn engagements down when: (a) the senior bench is full and an urgent start
              date cannot be met; (b) the scope is unrealistic for the budget; (c) the
              engagement is a poor fit for our model (e.g., pure staff augmentation, or
              fixed-bid managed services).
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              When we turn an engagement down, we recommend partner firms where possible.
            </p>
          </div>
        </div>
      </Section>

      {/* 7. CONTINUITY */}
      <Section
        id="continuity"
        eyebrow="07 · Continuity &amp; Resilience"
        title="The protections built in by design."
      >
        <p className="text-base text-gray-600 leading-relaxed mb-8 max-w-4xl">
          The procurement question, often unasked but always present:{' '}
          <em>what happens if Gennoor disappears tomorrow?</em> Six structural protections.
        </p>
        <div className="space-y-3 max-w-6xl">
          {continuity.map((c) => (
            <div key={c.title} className="rounded-2xl p-5 glass-card">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">{c.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl p-6 max-w-6xl bg-amber-50/40 border border-amber-100/50">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="text-gray-900">Bottom line:</strong> If Gennoor Tech vanished
            tomorrow, your AI system keeps running, your code is still yours, your team can
            operate it, and you can engage another firm to extend it. The protections are
            not promises — they are structural defaults baked into how every engagement is
            set up.
          </p>
        </div>
      </Section>

      {/* 8. FOUNDER */}
      <Section
        id="founder"
        eyebrow="08 · The Founder"
        title="Who leads delivery today."
      >
        <div className="rounded-3xl p-7 lg:p-10 glass-card glow-border max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7 items-start">
            <div className="md:col-span-1">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src="/assets/jalal-portrait.jpeg"
                  alt="Jalal Ahmed Khan, Founder of Gennoor Tech"
                  className="w-full h-full object-cover object-[50%_20%]"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-2">
                Founder &amp; Lead Practitioner
              </p>
              <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                Jalal Ahmed Khan
              </h3>
              <p className="text-base text-gray-600 leading-relaxed mb-5">
                Microsoft Certified Trainer with 16 active certifications. 14+ years of
                enterprise AI experience across Fortune 500 clients including Microsoft, IBM,
                EY, Boeing, Saudi Aramco, HDFC Bank, Siemens, and Bank of Tanzania. 50+
                C-suite leaders trained across 6+ countries.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                On SMB engagements and Phase 1 Strategic Diagnostics, Jalal is typically the
                Engagement Lead. On multi-quarter enterprise programs, he may be the
                executive sponsor with another senior practitioner as Engagement Lead.
                Reachable for any client at any time.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/about/founder"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  Read full biography
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-gray-300">·</span>
                <Link
                  href="/about/certifications"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                >
                  See all 16 certifications
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 9. FAQ */}
      <Section
        id="faq"
        eyebrow="09 · FAQ"
        title="Questions about the team and how we deliver."
      >
        <div className="space-y-3 max-w-4xl">
          {teamFaqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-2xl p-5 glass-card transition-all duration-300"
            >
              <summary className="flex justify-between items-start gap-4 cursor-pointer list-none">
                <h3 className="text-sm font-semibold text-gray-900">{faq.question}</h3>
                <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-0.5 transition-transform duration-300 group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* FINAL CTA */}
      <section className="py-20 lg:py-24 relative overflow-hidden">
        <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
        <div className="absolute inset-0 bg-gradient-mesh opacity-50" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-5">
              Ready to talk about a specific engagement?
            </h2>
            <p className="text-base text-gray-500 mb-8 leading-relaxed max-w-3xl mx-auto">
              A 30-minute scoping conversation tells you whether we&apos;re the right fit, when
              we can start, and which roles your engagement will need. The corresponding
              procurement reference is on our{' '}
              <Link
                href="/about/trust-and-security"
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                Trust &amp; Security page
              </Link>
              .
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
                href="/about/trust-and-security"
                className="inline-flex items-center justify-center px-7 py-3.5 text-sm font-semibold rounded-xl text-gray-700 glass-card hover:border-primary-200 transition-all duration-300"
              >
                Read Trust &amp; Security
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

// ────────────────────────────────────────────────────────────────────────────
// Section wrapper
// ────────────────────────────────────────────────────────────────────────────

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 py-16 lg:py-20 relative">
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-3">
            {eyebrow}
          </p>
          <h2
            className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {children}
        </div>
      </div>
    </section>
  )
}
