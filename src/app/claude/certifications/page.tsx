import type { Metadata } from 'next'
import Link from 'next/link'
import { CLAUDE_CERTS } from '@/data/claude-certifications'
import certMeta from '@/data/claude-cert-meta.json'
import CertResume from '@/components/claude/CertResume'

export const metadata: Metadata = {
  title: 'Claude Certification Prep',
  description:
    'Story-driven preparation for all four official Anthropic Claude certifications: Associate Foundations, Developer Foundations, Architect Foundations and Architect Professional. Interactive chapters, step-through diagrams, and practice exams with discussion.',
  alternates: { canonical: 'https://gennoor.com/claude/certifications' },
}

type Meta = Record<string, { questions: number; chapters: { kind: string }[] }>
const META = certMeta as unknown as Meta

// Quick self-routing: match the visitor's role to a certification.
const PATHS = [
  { who: 'I use Claude at work', detail: 'Analysts, ops, HR, marketing — no coding', slug: 'associate-foundations' },
  { who: 'I build with the API', detail: 'Developers shipping Claude features', slug: 'developer-foundations' },
  { who: 'I design agent systems', detail: 'Architects on the Claude Agent SDK', slug: 'architect-foundations' },
  { who: 'I govern AI at scale', detail: 'Principal architects in the enterprise', slug: 'architect-professional' },
]

export default function ClaudeCertificationsPage() {
  return (
    <main className="bg-raised">
      {/* ===== Hero: compact, left-anchored ===== */}
      <section className="hero-backdrop px-4 sm:px-6 lg:px-8 pt-6 lg:pt-8 pb-8">
        <div className="max-w-[1080px]">
          <p className="kicker">Claude certification prep</p>
          <h1 className="display-card mt-2">Get Claude certified.</h1>
          <p className="text-[16px] leading-[1.5] text-gray-500 max-w-[640px] mt-3">
            Four official Anthropic certifications. Four courses, each told as one story you follow from the
            first chapter to exam day: step-through diagrams, worked examples, knowledge checks, and a practice
            exam with a discussion thread under every question.
          </p>
          <div className="flex flex-wrap gap-2.5 mt-5">
            {PATHS.map(p => {
              const cert = CLAUDE_CERTS.find(c => c.slug === p.slug)!
              return (
                <Link
                  key={p.slug}
                  href={`/claude/certifications/${p.slug}`}
                  className="group inline-flex items-center gap-3 rounded-full bg-raised border border-gray-300 pl-1.5 pr-4 py-1.5 hover:border-primary-600 transition"
                >
                  <span className="text-[10.5px] font-mono font-bold tracking-[0.12em] text-white px-2.5 py-1 rounded-full" style={{ background: cert.accent }}>{cert.code}</span>
                  <span className="text-[13.5px] font-semibold text-gray-900">{p.who}</span>
                  <span className="text-[12px] text-gray-400 hidden sm:inline">· {p.detail}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== The four courses ===== */}
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-10 lg:py-8">
        <div className="max-w-[1080px]">
          <h2 className="font-heading text-[22px] font-bold tracking-[-0.02em] text-gray-900">One course, one story.</h2>
          <p className="text-[14.5px] text-gray-500 max-w-[680px] mt-1.5">
            Every course follows a single storyline, so the concepts arrive the way they do at work — as the next
            problem to solve. The first chapters are free; one free sign-in (an email code, no password) unlocks the
            rest, saves your progress and exam scores, and works across all of Gennoor.
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {CLAUDE_CERTS.map(cert => {
              const m = META[cert.slug]
              const stories = m ? m.chapters.filter(c => c.kind === 'story').length : 0
              return (
                <div key={cert.slug} className="rounded-[18px] bg-raised border border-gray-200 p-5 lg:p-6 flex flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[11px] font-mono font-bold tracking-[0.12em] px-2.5 py-1 rounded-full text-white" style={{ background: cert.accent }}>{cert.code}</span>
                    <span className="text-[11.5px] font-semibold text-gray-400 uppercase tracking-[0.1em]">{cert.level}</span>
                  </div>
                  <h3 className="font-heading text-[18px] font-bold text-gray-900 mt-3 leading-snug">{cert.name}</h3>
                  <p className="text-[14px] leading-[1.5] text-gray-500 mt-1">{cert.tagline}</p>
                  <p className="text-[13px] leading-[1.55] text-gray-400 mt-2.5 flex-1">
                    <span className="font-semibold text-gray-600">The story:</span> {cert.storyline.arc}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-gray-400 mt-3 pt-3 border-t border-gray-100">
                    <span><b className="text-gray-600">{stories}</b> story chapters</span>
                    <span><b className="text-gray-600">{m ? m.questions : cert.examFacts.questions}</b> practice questions</span>
                    <span>{cert.audience}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-4">
                    <CertResume guideKey={cert.guideKey} guideUrl={cert.guideUrl} className="pill-primary-sm !py-2.5 !px-5 !text-[14px]" />
                    <Link href={`${cert.guideUrl}#exam`} className="link-arrow !text-[14px]">Practice exam ›</Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ===== Beyond the exam ===== */}
      <section className="bg-raised px-4 sm:px-6 lg:px-8 py-10 lg:py-8">
        <div className="max-w-[1080px]">
          <h2 className="font-heading text-[22px] font-bold tracking-[-0.02em] text-gray-900 mb-5">After the badge, the real work.</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: 'Learn by use case', p: 'Claude courses in the Learning Studio, organised by the problems people face at work.', href: '/studio?company=Claude', l: 'Claude courses ›' },
              { t: 'Train your team', p: 'Live, instructor-led Claude training built around your team’s actual processes.', href: '/training', l: 'Custom training ›' },
              { t: 'Build a POC', p: 'Have a workflow in mind? We build working proof-of-concepts with Claude.', href: '/automation', l: 'POC projects ›' },
            ].map(x => (
              <div key={x.t} className="rounded-[16px] border border-gray-200 p-5">
                <h3 className="font-heading text-[16.5px] font-bold text-gray-900">{x.t}</h3>
                <p className="text-[14px] leading-[1.5] text-gray-500 mt-1.5">{x.p}</p>
                <Link href={x.href} className="link-arrow !text-[14px] mt-3 inline-block">{x.l}</Link>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/contact" className="pill-primary-sm">Talk to us</Link>
          </div>
        </div>
      </section>
    </main>
  )
}
