import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Academy - Free AI Courses for Everyone',
  description: 'Free AI courses for every role — technical, business, HR, or any domain. Self-paced learning with interactive slides, mock exams, and audio narration. No prior technical knowledge needed.',
  openGraph: {
    title: 'AI Academy - Free AI Courses for Everyone | Gennoor Tech',
    description: 'Free AI courses for every role — technical, business, HR, or any domain. Self-paced learning with interactive slides, mock exams, and audio narration.',
    type: 'website',
  },
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
