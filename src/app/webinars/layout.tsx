import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

// The page itself is drawn in the browser ('use client'), which cannot carry a title: it is written here.
export const metadata: Metadata = pageMeta({
  title: 'Webinars and expert sessions',
  description: 'Live webinars and expert sessions from Gennoor Tech. See what is coming up, register for a session, and look back at past ones.',
  path: '/webinars',
  image: 'webinars',
})

export default function WebinarsLayout({ children }: { children: React.ReactNode }) {
  return children
}
