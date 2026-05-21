import { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle,
  Clock,
  Users,
  Target,
  ArrowRight,
  Award,
  Briefcase,
  FileCheck,
  Lightbulb,
  TrendingUp,
  GraduationCap,
  BarChart3,
  Building2,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import PageHero from '@/components/shared/PageHero';
import PageCTA from '@/components/shared/PageCTA';

export const metadata: Metadata = {
  title: 'AI Literacy Rollout for Organizations — How We Operate | Gennoor Tech',
  description:
    'How Gennoor deploys AI literacy training across an organization at scale. Cohorts, completion tracking, manager dashboards, branded certificates, and a measurable adoption curve — not just a course library.',
  keywords: [
    'AI literacy training',
    'enterprise AI training',
    'corporate AI rollout',
    'AI workforce training',
    'Copilot adoption training',
    'AI training cohort',
    'L&D AI program',
    'change management AI',
  ],
  openGraph: {
    title: 'AI Literacy Rollout for Organizations — How We Operate',
    description:
      'How Gennoor deploys AI literacy training across an organization at scale. Cohorts, completion tracking, manager dashboards, and a measurable adoption curve.',
    url: 'https://gennoor.com/services/training-rollout',
    siteName: 'Gennoor Tech',
    type: 'website',
  },
};

const phases = [
  {
    icon: Target,
    name: 'Phase 1 · Calibrate',
    duration: 'Week 1',
    title: 'Baseline read on where your workforce actually is',
    description:
      "We start by understanding what your teams already know — and where they're stuck. A short diagnostic survey (5–7 min) goes to a representative sample across functions. We come back with a heat-map of AI literacy across HR, Marketing, Sales, Operations, IT, and Finance. This is the data that shapes everything that follows. Most organizations are surprised by the result — usually in a useful way.",
  },
  {
    icon: GraduationCap,
    name: 'Phase 2 · Pilot cohort',
    duration: 'Weeks 2–4',
    title: 'A 30–50 person cohort runs the foundations course',
    description:
      "Hand-picked across functions. They take the AI Literacy foundations course at their own pace, with a 30-minute weekly live office hour we run for them. Each completes the Monday-moment exercise from each chapter on real work. We track engagement, completion, and the qualitative signal — what's landing, what isn't, what they're asking that the course doesn't yet answer.",
  },
  {
    icon: Users,
    name: 'Phase 3 · Scale to the workforce',
    duration: 'Weeks 5–12',
    title: 'Roll out to the wider organization with the rough edges sanded',
    description:
      "Once the pilot tells us what works in your context, we open enrollment to the broader workforce. Each learner gets a dedicated learner account, can resume across devices, sees their progress, and ends with a credential they can put on LinkedIn. Manager dashboards show team-level completion, time-to-complete, and (with the learner's consent) the qualitative feedback they left. This is the part that turns a course library into a measurable adoption curve.",
  },
  {
    icon: BarChart3,
    name: 'Phase 4 · Measure the change',
    duration: 'Weeks 8–16',
    title: 'Did this actually move anything at your desks?',
    description:
      "Eight weeks after a cohort completes, we re-run the diagnostic. Compare to baseline. We share an executive read-out covering: completion rates by function, self-reported adoption patterns, the prompts learners kept using (a leading indicator), and the AI use cases that surfaced from the workforce — bottom-up — that you didn't know existed. This is also when we know which adjacent skills to invest in next.",
  },
];

const whatYouGet = [
  {
    icon: GraduationCap,
    title: 'Branded learner experience',
    description:
      'Your logo on the certificate. Your company name in the issuing-organization line on LinkedIn. The verification URL lives on your tenant if you want — or on ours, your call. Learners are not made to feel like they\'re on someone else\'s platform.',
  },
  {
    icon: ShieldCheck,
    title: 'LinkedIn add-to-profile + public verification',
    description:
      'Every completion produces a verifiable credential. The "Add to LinkedIn" flow pre-fills the certification entry (title, issuer, dates, credential URL, credential ID) the same way Coursera and AWS Training do. The public verify URL works for recruiters and internal HR audits alike.',
  },
  {
    icon: BarChart3,
    title: 'Manager + L&D dashboards',
    description:
      'Real-time completion-rate visibility by team and function. Stalled learners surfaced before they drop off (the week-one trap is real — we tell you who hit it on Wednesday so you can intervene Thursday).',
  },
  {
    icon: FileCheck,
    title: 'Re-baseline at the 8-week mark',
    description:
      'We do not leave the data uncollected. The diagnostic re-runs. The executive read-out lands on your CHRO\'s desk with the deltas, the surprising findings, and three concrete recommendations for what to fund next.',
  },
  {
    icon: Lightbulb,
    title: 'Course content kept current',
    description:
      'The named regulations, the named incidents, the vendor pricing — all updated quarterly. EU AI Act Article 4 enforcement dates, NYC Local Law 144 penalty changes, new EEOC rulings. Learners get the current version automatically.',
  },
  {
    icon: Building2,
    title: 'Region-specific delivery if needed',
    description:
      'Most clients want a region-neutral trainer voice. Some want a localised one — Hindi for India operations, Arabic for GCC, or industry-specific (healthcare, financial services). We accommodate at the cohort level without forking the curriculum.',
  },
];

const fitSignals = [
  {
    title: 'You have 200+ employees who would benefit',
    description:
      'Below 100 it\'s usually fine to send them through the free self-paced version. The rollout machinery (cohorts, dashboards, re-baseline) starts paying for itself around the 200-mark.',
  },
  {
    title: 'You\'ve given out Copilot or ChatGPT Enterprise licences and adoption stalled',
    description:
      'This is the most common reason organizations talk to us. 24% of Copilot pilots ever scale past 20% of workers (Gartner). The licence isn\'t the problem. Literacy is. We fix the literacy.',
  },
  {
    title: 'Your L&D team is small and asked for help',
    description:
      'We do not replace your L&D function — we plug into it. The team gets a turnkey curriculum, a learner platform, and reporting they can present upward. We handle the AI-specific lift.',
  },
  {
    title: 'You have a compliance reason to formalise AI training',
    description:
      'EU AI Act Article 4 obliges employers to ensure "sufficient AI literacy" among staff dealing with AI systems — applicable since 2 February 2025, enforcement from 3 August 2026. If you operate in the EU, this is no longer optional.',
  },
];

const faqData = [
  {
    question: 'How long does a typical rollout take?',
    answer:
      'From kickoff to a representative cohort completing: 4 weeks. From kickoff to full-workforce enrollment open: 8 weeks. From kickoff to first re-baseline executive read-out: 16 weeks. That timeline assumes a 500–2,000-person workforce. Larger workforces get phased by function or geography to keep the operational load reasonable.',
  },
  {
    question: 'What does pricing look like?',
    answer:
      'Pricing is per-completed-learner, not per-licence. That means you only pay for people who actually finished a chapter. There is a small platform fee that covers the dashboards, the cert infrastructure, and the re-baseline diagnostic. We share a quote within 48 hours of an intro call — we ask for headcount, region, and any specific regulatory requirements (EU AI Act, etc.) and we send a written estimate.',
  },
  {
    question: 'Can we co-brand or use our own LMS?',
    answer:
      'Yes to co-branding (your logo on the cert, your name as issuing organization). For LMS integration: we support SCORM export of the chapter HTML if you want to host inside your LMS, but you lose the dashboards and the LinkedIn add-to-profile flow. Most clients choose to host on our platform and pipe completion events into their LMS via webhook.',
  },
  {
    question: 'What if a function we care about (Legal, Procurement, R&D) isn\'t covered by the foundations course?',
    answer:
      'The foundations course covers HR, Marketing, Sales, Operations explicitly. For other functions, we extend with function-specific chapters following the same teaching shape. We have a queue of function-extension modules (Legal, Procurement, IT/Security, Finance, R&D, Customer Service). If yours is not yet built, we will scope a build with you — typically 4 weeks to author and ship one function-extension.',
  },
  {
    question: 'How do you handle data privacy across the cohort?',
    answer:
      'Learner data (name, email, progress, feedback) lives in your tenant if you require it — Azure region of your choice. Default is our private tenant in EU North or Central India (your choice at kickoff). We never train any model on learner-submitted content. Manager dashboards aggregate; individual feedback is shown to managers only with the learner\'s explicit consent setting.',
  },
  {
    question: 'Who delivers this?',
    answer:
      "I am Jalal Ahmed Khan — Microsoft Certified Trainer, 12+ years deploying AI and enablement programs across enterprises. The course itself is delivered asynchronously. The pilot office hours, the executive read-outs, and the strategic conversations are with me directly. Cohort administration and L&D support is handled by the Gennoor team.",
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Corporate AI Literacy Rollout',
  provider: {
    '@type': 'Organization',
    name: 'Gennoor Tech',
    url: 'https://gennoor.com',
  },
  name: 'AI Literacy Rollout for Organizations',
  description:
    'Deploy AI literacy training across the workforce at scale. Cohorts, completion tracking, manager dashboards, LinkedIn-shareable certificates, and a re-baseline diagnostic at 8 weeks.',
  areaServed: ['IN', 'AE', 'SA', 'KW', 'QA', 'OM', 'BH', 'SG', 'MY', 'GB', 'US'],
};

export default function TrainingRolloutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />

      <PageHero
        eyebrow="Rollout · Organization-Wide"
        breadcrumbs={[
          { label: 'Services', href: '/services' },
          { label: 'AI Literacy Rollout' },
        ]}
        title="How we deploy AI literacy across your workforce — at scale"
        description="A 16-week program that takes AI literacy from a course on someone's screen to a measurable adoption curve across your organization. Cohorts, dashboards, branded certificates, re-baseline diagnostic — the operational machinery that turns a library into actual workforce change."
        meta={[
          { icon: Calendar, label: '16-week program' },
          { icon: Users, label: '200+ learners' },
          { icon: Award, label: 'LinkedIn-verifiable certs' },
          { icon: BarChart3, label: 'Manager dashboards' },
        ]}
        ctas={[
          { label: 'Book an intro call', href: '/contact#book' },
          { label: 'Back to all services', href: '/services', variant: 'ghost' },
        ]}
      />

      {/* The reframe */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">A course library is not a rollout</h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Most organizations that buy AI training buy a content library — a few hundred videos, a
            handful of certifications, and a hope that adoption follows. Completion rates land
            somewhere between 8% and 22%. The library is fine. The mechanism that turns it into
            workforce change is what's missing.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            We run the mechanism. The foundations course is the content; the rollout program is the
            operational scaffolding around it — cohorts that hold each other accountable, manager
            dashboards that surface stalled learners on Wednesday so you can intervene Thursday,
            credentials that survive a job change, and a re-baseline diagnostic at the 8-week mark
            that tells you whether anything actually moved. <strong>That is what this page is
            about.</strong>
          </p>
        </div>
      </section>

      {/* The 4-phase program */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">The 4-phase program</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl">
            One 16-week arc. Each phase has clear deliverables, named owners, and a checkpoint where
            we re-decide whether to continue, expand, or stop. No black-box engagement.
          </p>

          <div className="space-y-6">
            {phases.map((phase, index) => {
              const Icon = phase.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-8 shadow-sm ring-1 ring-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary-50 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{phase.name}</h3>
                        <span className="text-sm font-mono uppercase tracking-wider text-primary-600 font-semibold">
                          {phase.duration}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900 mb-3">{phase.title}</p>
                      <p className="text-gray-600 leading-relaxed">{phase.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What you actually get</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl">
            Concrete deliverables — not just access to a course. Every item below is in scope
            from week 1.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {whatYouGet.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 ring-1 ring-gray-100">
                  <Icon className="w-8 h-8 text-primary-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fit signals */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Is this the right fit?</h2>
          <p className="text-lg text-gray-600 mb-10">
            We are not the right partner for every organization. Below are the signals that say
            we probably are — and one signal that says we might not be (yet).
          </p>

          <div className="space-y-4">
            {fitSignals.map((signal, index) => (
              <div key={index} className="bg-white rounded-xl p-6 ring-1 ring-gray-100 flex gap-4">
                <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">{signal.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{signal.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Where we are probably not the right call (yet)</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you have under 100 employees, the free self-paced course is almost certainly enough
              — the rollout machinery is overkill at that scale. If you need a function-specific
              course we have not yet authored (e.g. Legal-specific, R&D-specific), the timeline
              extends by 4 weeks to ship that extension. Tell us at intro; we will be honest about
              fit on the first call.
            </p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">Frequently asked questions</h2>

          <div className="space-y-6">
            {faqData.map((item, index) => (
              <div key={index} className="border border-gray-100 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                <p className="text-gray-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <PageCTA
        eyebrow="Next step"
        title="Book a 30-minute intro call"
        description="We talk through your workforce size, your existing licences (Copilot, ChatGPT, Gemini), the regions you operate in, and where adoption is currently stalling. By the end of the call you have a written estimate within 48 hours."
        ctas={[
          { label: 'Book the intro call', href: '/contact#book' },
          { label: 'View our other services', href: '/services', variant: 'ghost' },
        ]}
        footnote="Pricing is per-completed-learner, not per-licence."
      />
    </>
  );
}
