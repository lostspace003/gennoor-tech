import { notFound } from 'next/navigation'
import Link from 'next/link'
import { courses } from '@/config/courses'
import CertPreviewClient from './CertPreviewClient'

export const dynamic = 'force-dynamic'

/**
 * Dev-only preview route. Renders the celebration overlay in isolation with
 * sample cert data so theme/contrast/layout can be eyeballed per course
 * without grinding through the full learner flow.
 *
 * Gated to non-production environments. Access via:
 *   /dev/cert-preview/m365-copilot-adoption
 *   /dev/cert-preview/ai-foundations
 *   /dev/cert-preview/ab-100   (no theme — falls back to default)
 */
export default async function CertPreviewPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_DEV_ROUTES) {
    notFound()
  }

  const { courseId } = await params
  const course = courses.find(c => c.id === courseId)
  if (!course) notFound()

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dev/cert-preview" className="text-sm text-primary-600 hover:underline">
            ← Back to course list
          </Link>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cert overlay preview</h1>
        <p className="text-sm text-gray-500 mb-2">
          <span className="font-semibold">{course.title}</span> — theme: {course.theme?.primary || 'default'}
        </p>
        <p className="text-xs text-gray-400 mb-6">
          Three states cycle below: loading → success → error. Use this to eyeball contrast on dark themes, sparkle placement, button readability.
        </p>

        <CertPreviewClient course={course} />
      </div>
    </main>
  )
}
