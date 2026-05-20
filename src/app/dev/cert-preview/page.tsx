import { notFound } from 'next/navigation'
import Link from 'next/link'
import { courses } from '@/config/courses'

export const dynamic = 'force-dynamic'

export default function CertPreviewIndex() {
  if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_DEV_ROUTES) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cert overlay preview</h1>
        <p className="text-sm text-gray-500 mb-6">
          Dev-only: eyeball the celebration overlay per course theme. Each course
          renders the overlay with its own primary/deep gradient, sparkles, themed
          CTA button. Switch state to loading / success / error inside each
          preview.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {courses.map(course => {
            const themeSwatch = course.theme
              ? { background: `linear-gradient(135deg, ${course.theme.primary} 0%, ${course.theme.primaryDeep} 100%)` }
              : { background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' }
            return (
              <Link
                key={course.id}
                href={`/dev/cert-preview/${course.id}`}
                className="bg-white rounded-xl p-4 ring-1 ring-gray-200 hover:ring-primary-300 hover:shadow-md transition-all flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-lg flex-shrink-0" style={themeSwatch} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-gray-900 truncate">{course.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {course.theme?.primary || 'default theme'} · {course.totalChapters} chapters
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Dev-only route.</strong> Not visible in production unless
            ENABLE_DEV_ROUTES is set. No real cert IDs are involved — preview
            uses sample data only.
          </p>
        </div>
      </div>
    </main>
  )
}
