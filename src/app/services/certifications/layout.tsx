import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Certification Preparation — Microsoft AI, Power BI & GitHub',
  description: 'Structured certification preparation for Azure AI-102, PL-300 Power BI, MS-4004 Copilot, GitHub certifications and more. Hands-on labs, practice exams, and expert guidance from a Microsoft Certified Trainer.',
  keywords: ['Microsoft certification prep', 'AI-102 training', 'PL-300 preparation', 'Azure certification course', 'Microsoft exam prep'],
  alternates: { canonical: 'https://gennoor.com/services/certifications' },
  openGraph: {
    title: 'Certification Preparation — Microsoft AI, Power BI & GitHub | Gennoor Tech',
    description: 'Structured Microsoft certification prep with hands-on labs and expert guidance.',
    url: 'https://gennoor.com/services/certifications',
  },
}

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
  return children
}
