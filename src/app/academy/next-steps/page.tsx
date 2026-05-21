import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Users,
  Compass,
  Briefcase,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'You finished a course — what next? | Gennoor Academy',
  description:
    'Three concrete next steps after completing a Gennoor Academy course. Whether you need a workforce-wide rollout, a training partner for ongoing programs, or an executive AI strategy workshop — pick the one that fits and book a call.',
  robots: { index: false, follow: false }, // private learner destination
};

const options = [
  {
    id: 'rollout',
    icon: Users,
    eyebrow: 'For L&D leaders, HR, CHRO',
    title: 'Roll this out to my whole organization',
    pitch:
      'You just finished a course your team would benefit from too. We deploy AI literacy across the workforce — cohorts, manager dashboards, branded certs, and a re-baseline diagnostic at 8 weeks. The operational machinery that turns a library into a measurable adoption curve.',
    bullets: [
      '16-week program · 4 phases',
      'Pricing per-completed-learner, not per-licence',
      'LinkedIn-verifiable credentials per learner',
      'Manager dashboards for completion + intervention',
    ],
    primaryCta: { label: 'See how we operate', href: '/services/training-rollout' },
    secondaryCta: { label: 'Book an intro call', href: '/contact#book' },
    accent: 'from-orange-50 to-amber-50',
    accentRing: 'ring-orange-200 hover:ring-orange-400',
    accentText: 'text-orange-700',
  },
  {
    id: 'training',
    icon: Briefcase,
    eyebrow: 'For ongoing partnerships',
    title: 'Set up a long-term training partnership',
    pitch:
      'You need more than one course — AI training is now a continuous capability for your team. We become your in-house AI L&D team — running cohorts across functions (HR, Marketing, Sales, Ops, Finance, IT, Legal), refreshing content quarterly, and reporting outcomes upward to your C-suite.',
    bullets: [
      'Multi-course curriculum across functions',
      'Region-specific delivery (IN · GCC · SEA · EU · US)',
      'Quarterly content refresh on regulation + tooling',
      'Custom function-extension modules on request',
    ],
    primaryCta: { label: 'See training services', href: '/services/training' },
    secondaryCta: { label: 'Book an intro call', href: '/contact#book' },
    accent: 'from-slate-50 to-gray-50',
    accentRing: 'ring-slate-200 hover:ring-slate-400',
    accentText: 'text-slate-700',
  },
  {
    id: 'strategy',
    icon: Compass,
    eyebrow: 'For C-suite + IT leaders',
    title: 'Set the AI strategy first — then train',
    pitch:
      'You realised the bigger question is "what should we use AI for", not "how do we use AI". The Enterprise AI Roadmap Workshop is a one-day intensive that gives you a prioritised use-case portfolio, a 90-day action plan, and a business-case framework you can take to the board.',
    bullets: [
      '1-day intensive · 6–12 participants',
      'AI readiness assessment across 5 dimensions',
      '10–15 prioritised use cases scored for your org',
      '90-day action plan + board-ready business case',
    ],
    primaryCta: { label: 'See the workshop', href: '/services/enterprise-ai-roadmap-workshop' },
    secondaryCta: { label: 'Book a strategy call', href: '/contact#book' },
    accent: 'from-indigo-50 to-blue-50',
    accentRing: 'ring-indigo-200 hover:ring-indigo-400',
    accentText: 'text-indigo-700',
  },
];

export default function NextStepsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50/30">
      {/* Hero */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold tracking-widest uppercase mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            You just finished a course
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            What's the next move — for <em className="text-orange-600 not-italic">you and your team</em>?
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Three concrete ways Gennoor can help, depending on where you sit. Pick the one
            that fits — each takes you to a real page about how we operate, with a way to book
            a 30-minute intro call. No sales funnel. Just the right next step.
          </p>
        </div>
      </section>

      {/* Options grid */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {options.map(opt => {
              const Icon = opt.icon;
              return (
                <article
                  key={opt.id}
                  className={`bg-gradient-to-br ${opt.accent} rounded-2xl ring-1 ${opt.accentRing} p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <Icon className={`w-6 h-6 ${opt.accentText}`} />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${opt.accentText} font-mono`}>
                      {opt.eyebrow}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{opt.title}</h2>
                  <p className="text-gray-700 text-sm leading-relaxed mb-6">{opt.pitch}</p>

                  <ul className="space-y-2 mb-8 flex-grow">
                    {opt.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className={`w-4 h-4 ${opt.accentText} flex-shrink-0 mt-0.5`} />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 mt-auto">
                    <Link
                      href={opt.primaryCta.href}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      {opt.primaryCta.label}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href={opt.secondaryCta.href}
                      className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/70 hover:bg-white text-gray-900 text-sm font-semibold rounded-lg ring-1 ring-gray-200 transition-all duration-200`}
                    >
                      {opt.secondaryCta.label}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="text-center mt-16">
            <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
              Not ready for any of these yet? That's fine. The course you just finished stays in your
              account — come back to refresh it anytime, or
              {' '}
              <Link href="/academy" className="text-orange-600 hover:text-orange-700 font-semibold underline">
                browse other courses in the academy
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
