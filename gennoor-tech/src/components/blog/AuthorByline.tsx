import Link from 'next/link'
import type { AuthorProfile } from '@/config/authors'

interface AuthorBylineProps {
  author: AuthorProfile
  date: string
  readTime: string
  variant?: 'hero' | 'inline'
}

export default function AuthorByline({ author, date, readTime, variant = 'hero' }: AuthorBylineProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <Avatar author={author} size={32} />
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{author.name}</p>
          <p className="text-xs text-gray-500 truncate">
            {formattedDate} · {readTime}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Avatar author={author} size={44} onDark />
      <div className="min-w-0">
        <p className="text-sm font-semibold" style={{ color: '#ffffff' }}>
          <Link
            href={author.links.about || '/about'}
            className="hover:underline"
          >
            {author.name}
          </Link>
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {author.credentials}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>
          {formattedDate} · {readTime}
        </p>
      </div>
    </div>
  )
}

function Avatar({ author, size, onDark = false }: { author: AuthorProfile; size: number; onDark?: boolean }) {
  if (author.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={author.photoUrl}
        alt={author.name}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }

  const fontSize = Math.round(size * 0.4)
  return (
    <div
      className="rounded-full bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        boxShadow: onDark ? '0 0 0 2px rgba(255,255,255,0.2)' : 'none',
      }}
      aria-label={author.name}
    >
      <span className="font-black text-white" style={{ fontSize }}>
        {author.initials}
      </span>
    </div>
  )
}
