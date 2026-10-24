import Link from 'next/link'
import { credentialsForCourse, monthYear, transcriptUrl } from '@/data/credentials'

/**
 * "Taught by" on a course page, with the credentials that matter for THIS course behind one small tap.
 * Quiet by design: one line, a native disclosure, a link to the proof.
 */
export default function InstructorCredentials({ slug, instructor }: { slug: string; instructor: string }) {
  const { primary, related } = credentialsForCourse(slug)
  return (
    <details className="group px-1 text-[13.5px] text-[#6e6e73]">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        Taught by Jalal Khan, {instructor}.{' '}
        <span className="text-primary-600 group-open:hidden">Credentials ›</span>
        <span className="text-primary-600 hidden group-open:inline">Hide ‹</span>
      </summary>
      <div className="mt-3 space-y-2 leading-[1.55]">
        {primary && (
          <p className="text-[#3a3a3f]">
            Holds the <strong className="font-semibold text-gray-900">{primary.code}</strong> certification this course prepares you for
            ({primary.name}, earned {monthYear(primary.earned)}).
          </p>
        )}
        {related.length > 0 && (
          <p>Also: {related.map(c => `${c.code} ${c.name}`).join(' · ')}.</p>
        )}
        <p className="flex flex-wrap gap-x-4 gap-y-1">
          <a href={transcriptUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">Verify on Microsoft Learn ›</a>
          <Link href="/about/certifications" className="text-primary-600 hover:underline">All credentials ›</Link>
        </p>
      </div>
    </details>
  )
}
