import { Metadata } from 'next'
import { ServiceJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

export const metadata: Metadata = {
  title: 'Certification Preparation — Microsoft AI, Power BI & GitHub',
  description: 'Structured certification preparation for Azure AI-103 (replaces AI-102 on 2026-06-30), PL-300 Power BI, MS-4004 Copilot, GitHub certifications and more. Hands-on labs, practice exams, and expert guidance from a Microsoft Certified Trainer.',
  keywords: ['Microsoft certification prep', 'AI-103 training', 'AI-103 Azure AI Engineer', 'PL-300 preparation', 'Azure certification course', 'Microsoft exam prep'],
  alternates: { canonical: 'https://gennoor.com/services/certifications' },
  openGraph: {
    title: 'Certification Preparation — Microsoft AI, Power BI & GitHub | Gennoor Tech',
    description: 'Structured Microsoft certification prep with hands-on labs and expert guidance.',
    url: 'https://gennoor.com/services/certifications',
  },
}

const certFaqs = [
  { question: 'What certifications does Gennoor Tech offer preparation for?', answer: 'We offer preparation for Microsoft (Azure AI, Power BI, Copilot, Power Platform, Agentic AI), AWS (Cloud Practitioner, AI Practitioner, ML Engineer), Google Cloud (Cloud Digital Leader, ML Engineer, Data Engineer), and GitHub (Foundations, Actions, Copilot, Advanced Security) certifications.' },
  { question: 'What is your student pass rate for certification exams?', answer: 'Our students achieve a 98% pass rate across all certification exams. This is driven by hands-on labs, practice exams aligned with real exam patterns, and personalized guidance from a trainer who holds 16+ active certifications.' },
  { question: 'Do you offer online certification training?', answer: 'Yes, we offer live virtual instructor-led certification preparation sessions. These include the same hands-on labs, practice exams, and Q&A sessions as our on-site programs. Recordings are available for review.' },
  { question: 'How long is a typical certification preparation program?', answer: 'Fundamentals certifications typically require 2-3 days of preparation. Associate-level certifications need 3-5 days. Expert and specialty certifications may require 5-10 days depending on prior experience.' },
  { question: 'Do you provide practice exams and lab environments?', answer: 'Yes, every certification program includes practice exams modeled on real exam questions, hands-on lab environments for practical experience, study guides, and post-training access to revision materials.' },
]

export default function CertificationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceJsonLd
        name="Certification Exam Preparation"
        description="Structured certification preparation for Microsoft, AWS, Google Cloud, and GitHub exams. Hands-on labs, practice exams, and expert guidance from a Microsoft Certified Trainer with 16+ active certifications and 98% pass rate."
        url="https://gennoor.com/services/certifications"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Services', url: 'https://gennoor.com/services' },
        { name: 'Certifications', url: 'https://gennoor.com/services/certifications' },
      ]} />
      <FAQJsonLd faqs={certFaqs} />
      {children}
    </>
  )
}
