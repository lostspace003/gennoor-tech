import type { Metadata } from 'next'
import CopilotLicensingClient from './CopilotLicensingClient'

export const metadata: Metadata = {
  title: 'Microsoft 365 Copilot Licensing Calculator — Right-Size Before You Commit',
  description:
    'Don’t buy a Copilot license for every employee. This calculator estimates the right per-persona licensing mix, year-1 cost, and the adoption-pilot spend that protects the licensing investment.',
  keywords: ['Microsoft 365 Copilot licensing', 'Copilot license calculator', 'Copilot rollout cost', 'M365 Copilot ROI'],
  alternates: { canonical: 'https://gennoor.com/resources/calculators/copilot-licensing' },
  openGraph: {
    title: 'Copilot Licensing Calculator — Gennoor Tech',
    description: 'Right-size your M365 Copilot rollout before you commit budget.',
    url: 'https://gennoor.com/resources/calculators/copilot-licensing',
  },
}

export default function CopilotLicensingPage() {
  return <CopilotLicensingClient />
}
