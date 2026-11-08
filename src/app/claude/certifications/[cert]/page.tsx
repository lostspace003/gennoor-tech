import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CLAUDE_CERTS, getCert } from '@/data/claude-certifications'
import certMeta from '@/data/claude-cert-meta.json'
import CourseReader from '@/components/claude/course/CourseReader'
import type { ChapterMeta, FlowRef } from '@/components/claude/course/types'

/* One certification = one clean view: the course itself, read chapter by chapter from a
   horizontal lane at the top. The chapter bodies load from /cert-data/<slug>.json. */

type Meta = Record<string, { key: string; version: string; questions: number; trailer?: FlowRef | null; chapters: ChapterMeta[] }>
const META = certMeta as unknown as Meta

export function generateStaticParams() {
  return CLAUDE_CERTS.map(c => ({ cert: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ cert: string }> }): Promise<Metadata> {
  const { cert: slug } = await params
  const cert = getCert(slug)
  if (!cert) return {}
  return {
    title: `${cert.code} — ${cert.name}`,
    description: `${cert.tagline} Story-driven prep for the ${cert.name} exam: interactive chapters, step-through diagrams, and a ${cert.examFacts.questions}-question practice exam with discussion.`,
    alternates: { canonical: `https://gennoor.com/claude/certifications/${cert.slug}` },
  }
}

export default async function CertPage({ params }: { params: Promise<{ cert: string }> }) {
  const { cert: slug } = await params
  const cert = getCert(slug)
  const meta = META[slug]
  if (!cert || !meta) notFound()

  return (
    <main className="bg-white px-4 sm:px-6 lg:px-8 pb-16">
      <CourseReader cert={cert} chapters={meta.chapters} questionCount={meta.questions} trailer={meta.trailer ?? null} version={meta.version} />
    </main>
  )
}
