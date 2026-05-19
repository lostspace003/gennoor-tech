import type { Metadata } from 'next'
import PoCCatalogClient from './PoCCatalogClient'

export const metadata: Metadata = {
  title: '18 PoC blueprints — Gennoor Tech Resources',
  description:
    '18 production-ready AI PoC blueprints we deliver in 4–8 weeks. Fixed scope, fixed price, code transferred. Plus a Custom Build track for anything beyond the catalog.',
  keywords: [
    'AI PoC catalog',
    'enterprise AI PoCs',
    'AI proof of concept',
    'agentic AI PoCs',
    'RAG PoC',
    'Copilot Studio PoC',
    'custom AI build',
  ],
  alternates: { canonical: 'https://gennoor.com/resources/pocs' },
  openGraph: {
    title: '18 PoC blueprints — Gennoor Tech',
    description: 'Pick one. We deliver it in your environment in 4–8 weeks.',
    url: 'https://gennoor.com/resources/pocs',
  },
}

export default function PoCCatalogPage() {
  return <PoCCatalogClient />
}
