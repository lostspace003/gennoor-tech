import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CRM System — Gennoor Tech',
  robots: { index: false, follow: false },
}

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  // CRM pages don't need the main site layout (no newsletter/footer)
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}