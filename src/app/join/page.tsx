import type { Metadata } from 'next'
import JoinForm from '@/components/join/JoinForm'

export const metadata: Metadata = {
  title: 'Work with us — Gennoor Tech',
  description: 'Trainers, engineers and others who want to work with Gennoor Tech, freelance or full-time. Send a short note and your resume.',
  alternates: { canonical: 'https://gennoor.com/join' },
}

export default function JoinPage() {
  return (
    <main className="bg-white">
      <section className="hero-backdrop px-6 pt-16 lg:pt-[100px] pb-10 text-center">
        <h1 className="display-hero max-w-[820px] mx-auto">Join Gennoor.</h1>
        <p className="text-[clamp(18px,1.8vw,22px)] leading-[1.5] text-[#6e6e73] max-w-[600px] mx-auto mt-6">
          We work with trainers and engineers, freelance or full-time. Tell us a little about you and send your resume.
        </p>
      </section>
      <section className="bg-[#f5f5f7] px-6 py-16">
        <div className="max-w-[720px] mx-auto bg-white rounded-3xl p-7 sm:p-10">
          <JoinForm />
        </div>
      </section>
    </main>
  )
}
