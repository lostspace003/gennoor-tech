import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Corporate AI Training — Azure AI, Copilot Studio & Power Platform',
  description: 'Expert-led corporate AI training programs: executive bootcamps and technical workshops on Azure AI, Microsoft Copilot Studio, Power Platform, and Agentic AI. 80+ programs, customized for your team.',
  keywords: ['corporate AI training', 'Azure AI training', 'Copilot Studio training', 'Microsoft AI bootcamp', 'Power Platform training', 'enterprise AI workshop'],
  alternates: { canonical: 'https://gennoor.com/services/training' },
  openGraph: {
    title: 'Corporate AI Training Programs | Gennoor Tech',
    description: 'Expert-led corporate AI training: Azure AI, Copilot Studio, Power Platform bootcamps and workshops.',
    url: 'https://gennoor.com/services/training',
  },
}

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return children
}
