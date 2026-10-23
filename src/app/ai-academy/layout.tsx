import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Essentials - Free interactive AI courses',
  description: 'Free AI courses with a sign-in, for every role — technical, business, HR, or any domain. Interactive courses plus full video certification courses with labs and quizzes. No prior technical knowledge needed.',
  openGraph: {
    title: 'AI Essentials - Free interactive AI courses | Gennoor Tech',
    description: 'Free AI courses with a sign-in, for every role — technical, business, HR, or any domain. Interactive courses plus full video certification courses with labs and quizzes.',
    type: 'website',
  },
}

export default function AcademyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
