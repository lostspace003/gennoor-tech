import { pageMeta } from '@/lib/seo'
import EvaluateForm, { type EvaluatePrefill } from '@/components/evaluate/EvaluateForm'
import { universityByFormKey } from '@/lib/crm/universities-store'
import { FORM_KEY } from '@/lib/crm/universities-types'

export const dynamic = 'force-dynamic'

export const metadata = pageMeta({
  title: 'University course evaluation',
  description: 'Universities can request complimentary full access to Gennoor Learning Studio courses for up to two faculty representatives.',
  path: '/evaluate',
  noindex: true,
})

/** A university's own link: its name and department are filled in, and its answer lands on its page in the CRM. */
export default async function EvaluateForUniversity({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  let prefill: EvaluatePrefill | null = null
  if (FORM_KEY.test(key)) {
    const u = await universityByFormKey(key).catch(() => null)
    if (u) prefill = { key, institution: u.name, place: [u.country, u.city].filter(Boolean).join(', '), department: u.department }
  }
  // An unknown key shows the general form: nothing tells a stranger which keys exist.
  return <EvaluateForm prefill={prefill} />
}
