import { pageMeta } from '@/lib/seo'
import EvaluateForm from '@/components/evaluate/EvaluateForm'

export const metadata = pageMeta({
  title: 'University course evaluation',
  description: 'Universities can request complimentary full access to Gennoor Learning Studio courses for up to two faculty representatives.',
  path: '/evaluate',
  noindex: true,
})

export default function EvaluatePage() {
  return <EvaluateForm prefill={null} />
}
