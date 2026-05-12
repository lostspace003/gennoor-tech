import { ExternalLink } from 'lucide-react'
import type { Reference } from '@/data/blog-posts'

interface ReferencesProps {
  references?: Reference[]
}

export default function References({ references }: ReferencesProps) {
  if (!references || references.length === 0) return null

  return (
    <section
      className="px-6 sm:px-10 py-10"
      style={{ borderTop: '1px solid #f3f4f6', backgroundColor: '#fafafa' }}
      aria-label="References and further reading"
    >
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
        References & further reading
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Authoritative sources cited in this article and recommended for deeper exploration.
      </p>

      <ol className="list-none m-0 p-0 space-y-3">
        {references.map((ref, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="shrink-0 mt-1 inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold"
              style={{ backgroundColor: '#e0efff', color: '#1d4ed8' }}
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className="flex-1 min-w-0">
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-1.5 text-[15px] font-semibold text-primary-700 hover:text-primary-800 hover:underline leading-snug break-words"
              >
                <span>{ref.title}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 mt-1 opacity-60" aria-hidden="true" />
              </a>
              <div className="text-xs text-gray-500 mt-0.5">{ref.source}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
