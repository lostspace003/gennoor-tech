import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CRM System — Gennoor Tech',
  robots: { index: false, follow: false },
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  // CRM pages are completely isolated - no site navigation, newsletter, or footer
  return <>{children}</>
}