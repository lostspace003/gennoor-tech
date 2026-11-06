import type { Metadata } from 'next'
import Link from 'next/link'
import { CLAUDE_CERTS, PREP_HUB_URL } from '@/data/claude-certifications'
import CertResume from '@/components/claude/CertResume'

export const metadata: Metadata = {
  title: 'Claude Certification Prep — Gennoor Tech',
  description:
    'Story-driven preparation for all four official Anthropic Claude certifications: Associate Foundations, Developer Foundations, Architect Foundations and Architect Professional. Interactive courses, animations, and full-length practice exams.',
  alternates: { canonical: 'https://gennoor.com/claude/certifications' },
}

// Quick self-routing: match the visitor's role to a certification.
const PATHS = [
  { who: 'I use Claude at work', detail: 'Analysts, ops, HR, marketing — no coding', slug: 'associate-foundations', code: 'CCAS-F' },
  { who: 'I build with the API', detail: 'Developers shipping Claude features', slug: 'developer-foundations', code: 'CCDV-F' },
  { who: 'I design agent systems', detail: 'Architects on the Claude Agent SDK', slug: 'architect-foundations', code: 'CCAR-F' },
  { who: 'I govern AI at scale', detail: 'Principal architects in the enterprise', slug: 'architect-professional', code: 'CCAR-P' },
]

export default function ClaudeCertificationsPage() {
  return (
    <main className="bg-white">
      {/* ===== Hero ===== */}
      <section className="hero-backdrop px-6 pt-16 lg:pt-[90px] pb-14 text-center">
        <p className="kicker">Claude certification prep</p>
        <h1 className="display-hero max-w-[860px] mx-auto mt-4">Get Claude certified.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[680px] mx-auto mt-6">
          Four official Anthropic certifications. Four courses, each told as one story you follow from
          first chapter to exam day — with animations, worked examples, and a full-length practice exam.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-9">
          <a href={PREP_HUB_URL} className="pill-primary">Open the exam prep hub</a>
          <Link href="#choose" className="link-arrow">Find your certification ›</Link>
        </div>
      </section>

      {/* ===== Which one is for you ===== */}
      <section id="choose" className="bg-[#f5f5f7] px-6 py-16 lg:py-[80px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center">Which certification is for you?</h2>
          <p className="lede text-center mt-3.5 max-w-[620px] mx-auto">
            Pick the sentence that sounds like you. Different backgrounds, different paths — each course
            assumes nothing beyond its audience.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
            {PATHS.map(p => (
              <Link
                key={p.slug}
                href={`/claude/certifications/${p.slug}`}
                className="rounded-[18px] bg-white border border-[#e2e5ec] p-6 flex flex-col hover:border-[#0071e3] hover:shadow-sm transition"
              >
                <span className="text-[11px] font-mono font-bold tracking-[0.12em] text-[#0071e3]">{p.code}</span>
                <span className="font-heading text-[17px] font-bold text-gray-900 mt-2">{p.who}</span>
                <span className="text-[13.5px] text-[#6e6e73] mt-1.5 flex-1">{p.detail}</span>
                <span className="link-arrow !text-[14px] mt-4">This is me ›</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== The four courses ===== */}
      <section className="bg-white px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-3">One course, one story.</h2>
          <p className="lede text-center max-w-[640px] mx-auto mb-12">
            Every course follows a single storyline, so the concepts arrive the way they do at work —
            as the next problem to solve. The first two chapters of every course are free; one free
            sign-in (an email code, no password) unlocks everything, saves your progress and scores,
            and works across all of Gennoor.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {CLAUDE_CERTS.map(cert => (
              <div key={cert.slug} className="rounded-[20px] border border-[#e8e8ed] p-7 flex flex-col">
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="text-[11px] font-mono font-bold tracking-[0.12em] px-2.5 py-1 rounded-full text-white"
                    style={{ background: cert.accent }}
                  >
                    {cert.code}
                  </span>
                  <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-[0.1em]">{cert.level}</span>
                </div>
                <h3 className="font-heading text-[20px] font-bold text-gray-900 mt-4">{cert.name}</h3>
                <p className="text-[15px] leading-[1.55] text-[#6e6e73] mt-1.5">{cert.tagline}</p>
                <p className="text-[13.5px] leading-[1.6] text-[#86868b] mt-3 flex-1">
                  <span className="font-semibold text-[#545458]">The story:</span> {cert.storyline.arc}
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-1 text-[12.5px] text-[#86868b] mt-4 pt-4 border-t border-[#f0f0f3]">
                  <span><b className="text-[#545458]">{cert.examFacts.questions}</b> practice questions</span>
                  <span>{cert.examFacts.time}</span>
                  <span>{cert.audience}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-5">
                  <CertResume guideKey={cert.guideKey} guideUrl={cert.guideUrl} className="pill-primary-sm" />
                  <Link href={`/claude/certifications/${cert.slug}`} className="link-arrow !text-[14.5px]">
                    Course details ›
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Prep hub band ===== */}
      <section className="bg-[#f5f5f7] px-6 py-16 lg:py-[80px]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="display-section">One hub. Four full-length practice exams.</h2>
          <p className="lede mt-3.5 max-w-[640px] mx-auto">
            Blueprints, "if you see X, choose Y" decision matrices, reference code patterns, and the
            complete practice banks for all four exams — with instant grading and rationale on every question.
          </p>
          <div className="mt-9">
            <a href={PREP_HUB_URL} className="pill-primary">Open the exam prep hub</a>
          </div>
        </div>
      </section>

      {/* ===== Beyond the exam ===== */}
      <section className="bg-white px-6 py-16 lg:py-[90px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-section text-center mb-12">After the badge, the real work.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-[18px] border border-[#e8e8ed] p-7 text-center">
              <h3 className="font-heading text-[18px] font-bold text-gray-900">Learn by use case</h3>
              <p className="text-[14.5px] leading-[1.55] text-[#6e6e73] mt-2">
                Claude courses in the Learning Studio, organised by the problems people face at work.
              </p>
              <Link href="/studio?company=Claude" className="link-arrow !text-[14.5px] mt-4 inline-block">Claude courses ›</Link>
            </div>
            <div className="rounded-[18px] border border-[#e8e8ed] p-7 text-center">
              <h3 className="font-heading text-[18px] font-bold text-gray-900">Train your team</h3>
              <p className="text-[14.5px] leading-[1.55] text-[#6e6e73] mt-2">
                Live, instructor-led Claude training built around your team&apos;s actual processes.
              </p>
              <Link href="/training" className="link-arrow !text-[14.5px] mt-4 inline-block">Custom training ›</Link>
            </div>
            <div className="rounded-[18px] border border-[#e8e8ed] p-7 text-center">
              <h3 className="font-heading text-[18px] font-bold text-gray-900">Build a POC</h3>
              <p className="text-[14.5px] leading-[1.55] text-[#6e6e73] mt-2">
                Have a workflow in mind? We build working proof-of-concepts with Claude.
              </p>
              <Link href="/automation" className="link-arrow !text-[14.5px] mt-4 inline-block">POC projects ›</Link>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/contact" className="pill-primary">Talk to us</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
