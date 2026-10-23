import { Metadata } from 'next'
import Link from 'next/link'
import {
  FileText,
  Video,
  CalendarDays,
  Wrench,
  FlaskConical,
  Activity,
  Sparkles,
  Calculator,
  BookOpen,
  Phone,
} from 'lucide-react'

/**
 * Resources hub — closes gap 2.1 in newinclusioncheck/README.md.
 *
 * The rail's "Resources" entry used to jump straight to /resources/blog, so
 * the six-tile hub from the design handoff (Resources.dc.html) had no route.
 * Everything here was already reachable; this page gives it a front door.
 */

export const metadata: Metadata = {
  title: 'Resources — Blog, Videos, Webinars & Tools | Gennoor Tech',
  description:
    'Everything we publish in one place: the AI blog, video library, live webinars and workshops, the PoC catalogue, readiness assessment, and free calculators.',
  alternates: { canonical: 'https://gennoor.com/resources' },
}

const tiles = [
  {
    title: 'Blog',
    description: 'Field notes on enterprise AI — what worked, what did not, and why.',
    href: '/resources/blog',
    icon: FileText,
    cta: 'Read the blog',
  },
  {
    title: 'Videos',
    description: 'Training excerpts, walkthroughs and full session recordings.',
    href: '/resources/videos',
    icon: Video,
    cta: 'Watch videos',
  },
  {
    title: 'Webinars',
    description: 'Free live sessions with Q&A, plus recordings when you cannot make it.',
    href: '/webinars',
    icon: CalendarDays,
    cta: 'See the schedule',
  },
  {
    title: 'Workshops',
    description: 'Hands-on days you leave with something built, not just notes.',
    href: '/workshops',
    icon: Wrench,
    cta: 'Browse workshops',
  },
  {
    title: 'PoC Catalog',
    description: 'Proof-of-concept builds you can commission and see running.',
    href: '/resources/pocs',
    icon: FlaskConical,
    cta: 'Explore PoCs',
  },
  {
    title: 'AI Readiness',
    description: 'A short assessment that scores where your organisation actually stands.',
    href: '/ai-readiness',
    icon: Activity,
    cta: 'Take the assessment',
  },
]

const guides = [
  { title: 'Agentic AI', href: '/resources/guides/agentic-ai' },
  { title: 'Enterprise AI Training', href: '/resources/guides/enterprise-ai-training' },
  { title: 'Microsoft Copilot Studio', href: '/resources/guides/microsoft-copilot-studio' },
  { title: 'AI Readiness Checklist', href: '/resources/guides/ai-readiness-checklist' },
  { title: 'AI-103 Azure AI Engineer', href: '/guides/ai-103-azure-ai-engineer' },
  { title: 'PL-300 Power BI Analyst', href: '/guides/pl-300-power-bi-analyst' },
  { title: 'MS-4004 Copilot for M365', href: '/guides/ms-4004-copilot-365' },
  { title: 'AI-102 (retiring June 2026)', href: '/guides/ai-102-azure-ai-engineer' },
]

const calculators = [
  {
    title: 'AI ROI Calculator',
    detail: 'Model the payback on an AI investment before you commit budget.',
    href: '/resources/calculators/ai-roi',
  },
  {
    title: 'Copilot Licensing Calculator',
    detail: 'Work out what Microsoft Copilot actually costs at your seat count.',
    href: '/resources/calculators/copilot-licensing',
  },
]

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ===== Hero ===== */}
      <section className="px-8 pt-20 lg:pt-[100px] pb-12 text-center">
        <div className="kicker mb-5">Resources</div>
        <h1 className="text-[clamp(40px,4.8vw,64px)] leading-[1.06] tracking-[-0.03em] font-bold text-gray-900">
          Everything we publish.
        </h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.45] text-[#6e6e73] max-w-[580px] mx-auto mt-5">
          Free to read, watch, and use — no gate, no sales call required.
        </p>
      </section>

      {/* ===== Six tiles ===== */}
      <section className="bg-[#f5f5f7] px-8 py-16">
        <div className="max-w-[1080px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tiles.map(tile => {
            const Icon = tile.icon
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="group bg-white border border-[#e8e8ed] rounded-2xl p-7 flex flex-col transition-shadow hover:shadow-[0_8px_28px_rgba(0,0,0,0.07)]"
              >
                <div className="w-11 h-11 rounded-xl bg-[#f5f5f7] flex items-center justify-center mb-5">
                  <Icon className="w-[22px] h-[22px] text-primary-600" />
                </div>
                <h2 className="text-[17px] font-bold tracking-[-0.01em] text-gray-900 mb-2">
                  {tile.title}
                </h2>
                <p className="text-[13.5px] leading-[1.5] text-[#6e6e73] flex-1">
                  {tile.description}
                </p>
                <span className="text-[12.5px] font-semibold text-primary-600 mt-5 group-hover:text-[#0077ed] transition-colors">
                  {tile.cta} ›
                </span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ===== Academy callout ===== */}
      <section className="px-8 py-16">
        <div className="max-w-[1080px] mx-auto bg-gray-900 rounded-3xl px-8 sm:px-12 py-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-5">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-[clamp(26px,2.6vw,34px)] leading-[1.15] tracking-[-0.02em] font-bold text-white">
            The Learning Studio is free.
          </h2>
          <p className="text-[15.5px] leading-[1.5] text-white/70 max-w-[520px] mx-auto mt-4 mb-7">
            Self-paced courses for executives, business functions, and engineers —
            with certificates you can actually claim.
          </p>
          <Link
            href="/studio"
            className="inline-flex items-center bg-white hover:bg-white/90 text-gray-900 text-[14px] font-semibold px-6 py-2.5 rounded-full transition-colors"
          >
            Browse the Academy
          </Link>
        </div>
      </section>

      {/* ===== Guides + calculators ===== */}
      <section className="bg-[#f5f5f7] px-8 py-16 pb-24">
        <div className="max-w-[1080px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Guides */}
          <div className="bg-white border border-[#e8e8ed] rounded-2xl overflow-hidden">
            <div className="px-6 pt-6 pb-3 flex items-center gap-2.5">
              <BookOpen className="w-[18px] h-[18px] text-primary-600" />
              <h2 className="text-[17px] font-bold tracking-[-0.01em] text-gray-900">
                Guides &amp; exam prep
              </h2>
            </div>
            <div>
              {guides.map((g, i) => (
                <Link
                  key={g.href}
                  href={g.href}
                  className={`flex items-baseline justify-between gap-4 px-6 py-[13px] hover:bg-[#fafafa] transition-colors ${
                    i < guides.length - 1 ? 'border-b border-[#f5f5f7]' : ''
                  }`}
                >
                  <span className="text-[13.5px] font-medium text-gray-900">{g.title}</span>
                  <span className="text-[12.5px] font-semibold text-primary-600 shrink-0">›</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Calculators + book a call */}
          <div className="flex flex-col gap-5">
            <div className="bg-white border border-[#e8e8ed] rounded-2xl overflow-hidden">
              <div className="px-6 pt-6 pb-3 flex items-center gap-2.5">
                <Calculator className="w-[18px] h-[18px] text-primary-600" />
                <h2 className="text-[17px] font-bold tracking-[-0.01em] text-gray-900">
                  Free calculators
                </h2>
              </div>
              <div>
                {calculators.map((c, i) => (
                  <Link
                    key={c.href}
                    href={c.href}
                    className={`block px-6 py-4 hover:bg-[#fafafa] transition-colors ${
                      i < calculators.length - 1 ? 'border-b border-[#f5f5f7]' : ''
                    }`}
                  >
                    <span className="text-[13.5px] font-semibold text-gray-900">{c.title}</span>
                    <span className="block text-[12.5px] text-[#86868b] mt-0.5">{c.detail}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#e8e8ed] rounded-2xl px-6 py-7 text-center">
              <div className="w-11 h-11 rounded-xl bg-[#f5f5f7] flex items-center justify-center mx-auto mb-4">
                <Phone className="w-[22px] h-[22px] text-primary-600" />
              </div>
              <p className="text-[15.5px] font-bold text-gray-900 mb-1.5">
                Rather just talk it through?
              </p>
              <p className="text-[13px] text-[#6e6e73] max-w-[340px] mx-auto mb-5">
                Book a free 30-minute discovery call — no pitch, just a look at
                where AI would actually help.
              </p>
              <Link href="/resources/calendar" className="pill-primary-sm">
                Book a call
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
