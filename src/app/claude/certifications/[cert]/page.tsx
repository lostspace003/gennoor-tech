import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CLAUDE_CERTS, getCert } from '@/data/claude-certifications'
import CertResume from '@/components/claude/CertResume'

/* One certification = one clean view: the story, the map, the exam facts,
   and two actions (start the course / practice exam). Nothing else. */

export function generateStaticParams() {
  return CLAUDE_CERTS.map(c => ({ cert: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ cert: string }> }): Promise<Metadata> {
  const { cert: slug } = await params
  const cert = getCert(slug)
  if (!cert) return {}
  return {
    title: `${cert.code} — ${cert.name} | Gennoor Tech`,
    description: `${cert.tagline} Story-driven prep for the ${cert.name} exam: interactive course, animations, and a full ${cert.examFacts.questions}-question practice exam.`,
    alternates: { canonical: `https://gennoor.com/claude/certifications/${cert.slug}` },
  }
}

export default async function CertPage({ params }: { params: Promise<{ cert: string }> }) {
  const { cert: slug } = await params
  const cert = getCert(slug)
  if (!cert) notFound()

  const others = CLAUDE_CERTS.filter(c => c.slug !== cert.slug)

  return (
    <main className="bg-white">
      {/* ===== Hero: what this is, who it's for, start now ===== */}
      <section className="hero-backdrop px-6 pt-14 lg:pt-[80px] pb-12">
        <div className="max-w-[880px] mx-auto text-center">
          <div className="flex items-center justify-center gap-2.5">
            <span
              className="text-[11px] font-mono font-bold tracking-[0.12em] px-2.5 py-1 rounded-full text-white"
              style={{ background: cert.accent }}
            >
              {cert.code}
            </span>
            <span className="text-[12px] font-semibold text-[#86868b] uppercase tracking-[0.1em]">{cert.level}</span>
          </div>
          <h1 className="display-card max-w-[760px] mx-auto mt-5">{cert.name}.</h1>
          <p className="lede mt-4 max-w-[620px] mx-auto">{cert.tagline}</p>
          <p className="text-[14.5px] leading-[1.65] text-[#6e6e73] max-w-[640px] mx-auto mt-4">{cert.whoItsFor}</p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-8">
            <CertResume guideKey={cert.guideKey} guideUrl={cert.guideUrl} />
            <a href={cert.prepHubUrl} className="link-arrow">Practice exam in the prep hub ›</a>
          </div>
          <p className="text-[12.5px] text-[#86868b] mt-4">
            The first two chapters are free. One free sign-in (an email code, no password) unlocks the full
            course, saves your progress and exam scores, and lets you join the discussion — the same account
            works everywhere on Gennoor.
          </p>
        </div>
      </section>

      {/* ===== The story ===== */}
      <section className="bg-[#f5f5f7] px-6 py-14 lg:py-[70px]">
        <div className="max-w-[880px] mx-auto">
          <div className="rounded-[20px] bg-white border border-[#e2e5ec] p-7 lg:p-9">
            <p className="kicker">The storyline</p>
            <h2 className="font-heading text-[clamp(20px,2.2vw,26px)] font-bold tracking-[-0.02em] text-gray-900 mt-3">
              {cert.storyline.protagonist}
            </h2>
            <p className="text-[15.5px] leading-[1.65] text-[#545458] mt-3">{cert.storyline.arc}</p>
          </div>

          {/* The course map: numbered storyline stops */}
          <h2 className="display-card text-center mt-14 mb-8">The journey, stop by stop.</h2>
          <ol className="space-y-3">
            {cert.journey.map((j, i) => (
              <li key={j.stop} className="rounded-[16px] bg-white border border-[#e8e8ed] p-5 flex items-start gap-4">
                <span
                  className="w-8 h-8 rounded-full text-white text-[13px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: cert.accent }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-heading text-[16px] font-bold text-gray-900">{j.stop}</p>
                  <p className="text-[14px] leading-[1.55] text-[#6e6e73] mt-0.5">{j.learn}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Exam at a glance ===== */}
      <section className="bg-white px-6 py-14 lg:py-[70px]">
        <div className="max-w-[880px] mx-auto">
          <h2 className="display-card text-center mb-8">The exam, at a glance.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            {[
              { label: 'Practice questions', value: String(cert.examFacts.questions) },
              { label: 'Question formats', value: cert.examFacts.formats },
              { label: 'What it tests', value: cert.examFacts.passingStyle },
              { label: 'Sitting time', value: cert.examFacts.time },
            ].map(f => (
              <div key={f.label} className="rounded-[16px] bg-[#fafafb] border border-[#e8e8ed] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#86868b]">{f.label}</p>
                <p className="text-[14.5px] font-semibold text-gray-900 mt-1.5 leading-snug">{f.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 rounded-[16px] border border-[#e8e8ed] p-6">
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#86868b] mb-4">Domains &amp; weighting</p>
            <ul className="space-y-3">
              {cert.domains.map(d => (
                <li key={d.title} className="flex items-center gap-4">
                  <span className="text-[14.5px] text-[#3a3a3f] flex-1 min-w-0">{d.title}</span>
                  <span className="text-[12.5px] font-mono font-bold text-[#545458] shrink-0">{d.weight}</span>
                  <span className="hidden sm:block w-28 h-1.5 rounded-full bg-[#eef0f4] overflow-hidden shrink-0">
                    <span className="block h-full rounded-full" style={{ width: d.weight, background: cert.accent }} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mt-10">
            <CertResume guideKey={cert.guideKey} guideUrl={cert.guideUrl} />
            <a href={cert.prepHubUrl} className="link-arrow">Open the exam prep hub ›</a>
          </div>
        </div>
      </section>

      {/* ===== Other certifications + next steps ===== */}
      <section className="bg-[#f5f5f7] px-6 py-14 lg:py-[70px]">
        <div className="max-w-[1080px] mx-auto">
          <h2 className="display-card text-center mb-8">The other certifications.</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {others.map(o => (
              <Link
                key={o.slug}
                href={`/claude/certifications/${o.slug}`}
                className="rounded-[16px] bg-white border border-[#e2e5ec] p-5 hover:border-[#0071e3] transition"
              >
                <span className="text-[11px] font-mono font-bold tracking-[0.12em]" style={{ color: o.accent }}>{o.code}</span>
                <p className="font-heading text-[15.5px] font-bold text-gray-900 mt-1.5 leading-snug">{o.name}</p>
                <p className="text-[13px] text-[#6e6e73] mt-1">{o.tagline}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="lede max-w-[560px] mx-auto">
              Preparing a whole team, or want Claude working inside your own processes?
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-7 justify-center items-center mt-6">
              <Link href="/training" className="link-arrow">Custom team training ›</Link>
              <Link href="/studio?company=Claude" className="link-arrow">Claude courses in the Studio ›</Link>
              <Link href="/automation" className="link-arrow">Build a POC with us ›</Link>
              <Link href="/contact" className="pill-primary-sm">Talk to us</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
