import Link from 'next/link'
import { Layers } from 'lucide-react'
import LearnerAccountMenu from './LearnerAccountMenu'

/**
 * Slim bar at the top of every Learning Studio page: where you are, and your
 * account (sign in, or your name with sign out). Same bar everywhere, so the
 * pages line up and sign-in is always in the same place.
 */
export default function AcademyBar({ section }: { section: string }) {
  return (
    <div className="bg-primary-50 border-b border-primary-100/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-center gap-2 sm:gap-4">
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-600">
              <Layers className="w-3.5 h-3.5 text-primary-500" />
              <span>
                <strong className="text-gray-900">{section}</strong> · part of <strong className="text-gray-900">Learning Studio</strong>
              </span>
            </div>
          </div>
          <nav aria-label="Learning Studio" className="shrink-0 inline-flex rounded-lg bg-white/70 p-0.5 text-xs font-semibold">
            {[['Courses', '/studio', section !== 'Community'], ['Community', '/community', section === 'Community']].map(([label, href, on]) => (
              <Link key={String(label)} href={String(href)} aria-current={on ? 'page' : undefined}
                className={`px-3 py-1 rounded-md transition-colors ${on ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
                {String(label)}
              </Link>
            ))}
          </nav>
          <LearnerAccountMenu className="shrink-0" />
        </div>
      </div>
    </div>
  )
}
