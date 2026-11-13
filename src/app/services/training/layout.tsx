import { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import { ServiceJsonLd, BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

// The pages under this one (a programme, a curriculum) write their own: see their generateMetadata.
export const metadata: Metadata = pageMeta({
  forLayout: true,
  title: 'AI training programs for organizations',
  description: 'Instructor-led AI training programs for organizations: bootcamps and courses on Claude, Azure AI, Copilot Studio and more, adapted to your team.',
  keywords: ['AI training', 'Claude training', 'Azure AI training', 'Copilot Studio training', 'AI bootcamp'],
  path: '/services/training',
  image: 'programs',
})

const trainingFaqs = [
  { question: 'What training formats does Gennoor Tech offer?', answer: 'We offer on-site classroom training, live virtual instructor-led sessions, and hybrid formats. All programs include hands-on labs, real-world case studies, and post-training support materials.' },
  { question: 'How are training programs customized for our team?', answer: 'Every program is tailored to your industry, tech stack, and team skill level. We conduct a pre-training assessment to understand your goals and design the curriculum around your specific use cases and data.' },
  { question: 'What is the minimum batch size?', answer: 'We recommend a minimum of 5 participants to ensure interactive group exercises. Maximum batch size is typically 15-20 to maintain personalized attention. For larger groups, we run multiple parallel batches.' },
  { question: 'Do you provide certification preparation as part of training?', answer: 'Yes, many of our bootcamps and courses include preparation for Microsoft, AWS, Google Cloud and GitHub exams.' },
  { question: 'What is the typical duration of a training program?', answer: 'Executive bootcamps run 2-3 days. Technical workshops are 3-5 days. Deep-dive courses can extend to 2 weeks. We also offer ongoing mentoring programs for teams implementing AI projects post-training.' },
]

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceJsonLd
        name="AI training programs"
        description="Instructor-led AI training programs for organizations, adapted to your team."
        url="https://gennoor.com/services/training"
      />
      <BreadcrumbJsonLd items={[
        { name: 'Home', url: 'https://gennoor.com' },
        { name: 'Training', url: 'https://gennoor.com/training' },
        { name: 'Training', url: 'https://gennoor.com/services/training' },
      ]} />
      <FAQJsonLd faqs={trainingFaqs} />
      {children}
    </>
  )
}
