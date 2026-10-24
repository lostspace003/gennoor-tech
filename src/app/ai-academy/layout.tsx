import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Essentials - Interactive AI courses',
  description: 'AI courses for every role — technical, business, HR, or any domain. Interactive courses plus full video certification courses with labs and quizzes. No prior technical knowledge needed.',
  openGraph: {
    title: 'AI Essentials - Interactive AI courses | Gennoor Tech',
    description: 'AI courses for every role — technical, business, HR, or any domain. Interactive courses plus full video certification courses with labs and quizzes.',
    type: 'website',
  },
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
