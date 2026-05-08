import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Academy - Free Courses',
  description: 'Free, self-paced courses to master enterprise AI architecture. Start with the Microsoft AB-100 certification course — 13 chapters, mock exam, and audio narration included.',
  openGraph: {
    title: 'AI Academy - Free Courses | Gennoor Tech',
    description: 'Free, self-paced courses to master enterprise AI architecture. 13 chapters + mock exam for Microsoft AB-100 certification.',
    type: 'website',
  },
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
