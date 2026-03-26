import { Metadata } from 'next'
import { ServiceJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

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

const trainingFaqs = [
  { question: 'What training formats does Gennoor Tech offer?', answer: 'We offer on-site classroom training, live virtual instructor-led sessions, and hybrid formats. All programs include hands-on labs, real-world case studies, and post-training support materials.' },
  { question: 'How are training programs customized for our team?', answer: 'Every program is tailored to your industry, tech stack, and team skill level. We conduct a pre-training assessment to understand your goals and design the curriculum around your specific use cases and data.' },
  { question: 'What is the minimum batch size for corporate training?', answer: 'We recommend a minimum of 5 participants for corporate training to ensure interactive group exercises. Maximum batch size is typically 15-20 to maintain personalized attention. For larger groups, we run multiple parallel batches.' },
  { question: 'Do you provide certification preparation as part of training?', answer: 'Yes, many of our bootcamps and courses include certification preparation for Microsoft, AWS, Google Cloud, and GitHub exams. Our trainer holds 16+ active certifications with a 98% student pass rate.' },
  { question: 'Which industries do you serve with AI training?', answer: 'We serve financial services, insurance, healthcare, manufacturing, oil & gas, telecom, government, and technology sectors. Our clients include Fortune 500 companies like Boeing, Saudi Aramco, HDFC Bank, Siemens, and EY.' },
  { question: 'What is the typical duration of a training program?', answer: 'Executive bootcamps run 2-3 days. Technical workshops are 3-5 days. Deep-dive courses can extend to 2 weeks. We also offer ongoing mentoring programs for teams implementing AI projects post-training.' },
]

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceJsonLd
        name="Corporate AI Training"
        description="Expert-led corporate AI training programs: executive bootcamps and technical workshops on Azure AI, Microsoft Copilot Studio, Power Platform, and Agentic AI. 80+ programs, customized for your team."
        url="https://gennoor.com/services/training"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Services', url: 'https://gennoor.com/services' },
        { name: 'Training', url: 'https://gennoor.com/services/training' },
      ]} />
      <FAQJsonLd faqs={trainingFaqs} />
      {children}
    </>
  )
}
