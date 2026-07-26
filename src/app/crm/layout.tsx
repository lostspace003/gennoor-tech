import type { Metadata, Viewport } from 'next'
import CrmShell from './shell'

export const metadata: Metadata = {
  title: 'Gennoor CRM',
  robots: { index: false, follow: false },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  return <CrmShell>{children}</CrmShell>
}
