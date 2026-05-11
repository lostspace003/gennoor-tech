import type { Metadata } from 'next'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'AI Career Coach — Resume Review, Interview Prep & Skill Planning',
  description: 'Free AI-powered career coach for tech professionals. Get personalized resume feedback, interview practice, and skill roadmaps for AI, cloud, and data roles. Available 24/7.',
  keywords: ['AI career coach', 'tech resume review', 'AI interview prep', 'career planning AI', 'cloud career roadmap', 'free career coaching'],
  alternates: { canonical: 'https://gennoor.com/career-coach' },
  openGraph: {
    title: 'AI Career Coach — Resume Review, Interview Prep & Skill Planning | Gennoor Tech',
    description: 'Free AI-powered career coach: personalized resume feedback, interview practice, and skill roadmaps for tech professionals.',
    url: 'https://gennoor.com/career-coach',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Career Coach | Gennoor Tech',
    description: 'Free AI-powered career coach for tech professionals.',
  },
}

export default function CareerCoachLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Career Coach', url: 'https://gennoor.com/career-coach' },
      ]} />
      {children}
    </>
  )
}
