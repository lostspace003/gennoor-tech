import type { Metadata } from 'next'
import Link from 'next/link'
import { getCertificationsByCategory } from '@/data/certifications'
import { credentials, credentialsAsOf, learnStats, monthYear, transcriptUrl } from '@/data/credentials'
import { BLOB_URL } from '@/lib/site-config'
import CertificationCards from '@/components/certifications/CertificationCards'
import CredentialTimeline from '@/components/certifications/CredentialTimeline'
import MCTCertificateButton from '@/components/certifications/MCTCertificateButton'

export const metadata: Metadata = {
  title: 'Credentials — Gennoor Tech',
  description: `The credentials behind the courses: ${credentials.length} active Microsoft and GitHub certifications and Microsoft Certified Trainer status, verified on Microsoft Learn.`,
  alternates: { canonical: 'https://gennoor.com/about/certifications' },
}

const BACKGROUND = [
  { when: 'Before 2021', what: 'Ten years teaching engineering, then a move into enterprise AI and cloud training.' },
  { when: 'Since 2021', what: 'Training and programs for teams on Azure, AI and DevOps, including government and financial-sector programs.' },
  { when: `Since ${learnStats.mctSince}`, what: 'Microsoft Certified Trainer: official Microsoft AI, data and DevOps courses delivered through Microsoft Learning Partners.' },
  { when: '2026', what: 'Gennoor Learning Studio, and Gennoor is Certified in the Claude Partner Network.' },
]

export default function CredentialsPage() {
  const other = getCertificationsByCategory('AI CERTs')
  const stats = [
    { value: String(credentials.length), label: 'active certifications' },
    { value: String(learnStats.examsPassed), label: 'exams passed' },
    { value: `${learnStats.learningHours}+`, label: 'learning hours' },
    { value: `${learnStats.mctSince}`, label: 'Microsoft Certified Trainer since' },
  ]

  return (
    <main className="bg-white">
      <section className="hero-backdrop px-6 pt-8 lg:pt-10 pb-8 text-center">
        <h1 className="display-hero max-w-[820px] mx-auto">The credentials behind the courses.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[640px] mx-auto mt-6">
          Every course is built and taught by a practitioner who sits the same exams, and holds the certification a course prepares you for.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 sm:gap-[22px] justify-center items-center mt-8">
          <a href={transcriptUrl} target="_blank" rel="noopener noreferrer" className="pill-primary">Verify on Microsoft Learn</a>
          <MCTCertificateButton pdfUrl={`${BLOB_URL}/certificates/0-mct-certifcate.pdf`} />
        </div>
      </section>

      <section className="px-6 pb-14">
        <dl className="max-w-[900px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="rounded-[18px] bg-[#f5f5f7] px-5 py-6 text-center">
              <dt className="font-heading text-[34px] font-bold tracking-[-0.02em] text-gray-900 tabular-nums">{s.value}</dt>
              <dd className="text-[13.5px] text-[#6e6e73] mt-1 leading-snug">{s.label}</dd>
            </div>
          ))}
        </dl>
        <p className="text-center text-[13px] text-[#86868b] mt-4">
          Read from the Microsoft Learn transcript on {monthYear(credentialsAsOf)}. The transcript is the source of truth; role-based certifications renew every year.
        </p>
      </section>

      <section className="px-6 pb-20 lg:pb-[100px]">
        <div className="max-w-[900px] mx-auto">
          <h2 className="display-section text-center mb-10">Year by year.</h2>
          <CredentialTimeline items={credentials} />
        </div>
      </section>

      <section className="bg-[#f5f5f7] px-6 py-10 lg:py-14">
        <div className="max-w-[900px] mx-auto">
          <h2 className="display-section text-center mb-10">Instructor background.</h2>
          <ol className="space-y-5">
            {BACKGROUND.map(b => (
              <li key={b.when} className="grid sm:grid-cols-[150px_1fr] gap-1 sm:gap-6 items-baseline">
                <span className="font-heading text-[17px] font-bold text-gray-900">{b.when}</span>
                <span className="text-[16px] leading-[1.55] text-[#3a3a3f]">{b.what}</span>
              </li>
            ))}
          </ol>
          <p className="text-[14px] text-[#6e6e73] mt-8">
            Lead instructor: Jalal Khan, founder of Gennoor Tech. <Link href="/about" className="text-primary-600 hover:underline">About Gennoor ›</Link>
          </p>
        </div>
      </section>

      {other.length > 0 && (
        <section className="px-6 py-10 lg:py-14">
          <div className="max-w-[900px] mx-auto">
            <h2 className="display-section text-center mb-3">Other credentials.</h2>
            <p className="text-center text-[15px] text-[#6e6e73] mb-10">Not on the Microsoft transcript. Each has its own certificate.</p>
            <CertificationCards certs={other} category="AI CERTs" categoryColor="bg-gray-400" />
          </div>
        </section>
      )}
    </main>
  )
}
