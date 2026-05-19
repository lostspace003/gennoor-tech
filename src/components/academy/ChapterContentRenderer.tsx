import { Info, AlertTriangle, Lightbulb, Zap } from 'lucide-react'
import type { ContentBlock } from '@/data/academy/chapter-content/types'

interface ChapterContentRendererProps {
  blocks: ContentBlock[]
}

/**
 * Renders chapter content blocks as semantic HTML with consistent typography.
 * Some block content (list items, paragraphs in HR notes) contains light HTML
 * (<strong>, <em>) — rendered via dangerouslySetInnerHTML since the source
 * is hand-authored editorial content, not user input.
 */
export default function ChapterContentRenderer({ blocks }: ChapterContentRendererProps) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => (
        <BlockView key={i} block={block} />
      ))}
    </div>
  )
}

function BlockView({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'h2':
      return (
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight pt-4">
          {block.text}
        </h2>
      )
    case 'h3':
      return (
        <h3 className="text-lg lg:text-xl font-bold text-gray-900 leading-tight pt-2">
          {block.text}
        </h3>
      )
    case 'p':
      return (
        <p
          className="text-base text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: block.text }}
        />
      )
    case 'list': {
      const ListTag = block.ordered ? 'ol' : 'ul'
      return (
        <ListTag
          className={`space-y-2 pl-5 ${block.ordered ? 'list-decimal' : 'list-disc'}`}
        >
          {block.items.map((item, i) => (
            <li
              key={i}
              className="text-base text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: item }}
            />
          ))}
        </ListTag>
      )
    }
    case 'callout':
      return <Callout variant={block.variant} title={block.title} text={block.text} />
    case 'example':
      return (
        <div className="rounded-2xl p-5 bg-primary-50/40 border border-primary-100/60">
          {block.title && (
            <p className="text-xs font-bold tracking-widest text-primary-600 uppercase mb-2">
              {block.title}
            </p>
          )}
          <p
            className="text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: block.text }}
          />
        </div>
      )
    case 'quote':
      return (
        <blockquote className="border-l-4 border-amber-400 pl-5 py-2 italic text-gray-700">
          <p className="text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: block.text }} />
          {block.attribution && (
            <footer className="mt-2 text-sm text-gray-500 not-italic">— {block.attribution}</footer>
          )}
        </blockquote>
      )
  }
}

function Callout({
  variant,
  title,
  text,
}: {
  variant: 'info' | 'warning' | 'action' | 'tip'
  title?: string
  text: string
}) {
  const variants = {
    info: {
      bg: 'bg-primary-50/60',
      border: 'border-primary-200/60',
      icon: Info,
      iconColor: 'text-primary-600',
      titleColor: 'text-primary-700',
    },
    warning: {
      bg: 'bg-red-50/50',
      border: 'border-red-200/60',
      icon: AlertTriangle,
      iconColor: 'text-red-600',
      titleColor: 'text-red-700',
    },
    action: {
      bg: 'bg-amber-50/60',
      border: 'border-amber-200/60',
      icon: Zap,
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-700',
    },
    tip: {
      bg: 'bg-emerald-50/50',
      border: 'border-emerald-200/60',
      icon: Lightbulb,
      iconColor: 'text-emerald-600',
      titleColor: 'text-emerald-700',
    },
  }
  const v = variants[variant]
  const Icon = v.icon
  return (
    <div className={`rounded-2xl p-5 border ${v.bg} ${v.border}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${v.iconColor}`} />
        <div className="flex-grow">
          {title && (
            <p className={`text-xs font-bold tracking-widest uppercase mb-1 ${v.titleColor}`}>
              {title}
            </p>
          )}
          <p
            className="text-sm text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </div>
      </div>
    </div>
  )
}
