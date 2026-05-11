import { CheckCircle2 } from 'lucide-react'

interface KeyTakeawaysProps {
  takeaways?: string[]
  tldr?: string
}

export default function KeyTakeaways({ takeaways, tldr }: KeyTakeawaysProps) {
  const items = takeaways && takeaways.length > 0
    ? takeaways
    : tldr
      ? [tldr]
      : []

  if (items.length === 0) return null

  return (
    <aside
      className="mx-6 sm:mx-10 mt-8 rounded-2xl border overflow-hidden"
      style={{ borderColor: '#cfe5ff', backgroundColor: '#f0f7ff' }}
      aria-label="Key takeaways"
    >
      <div
        className="px-5 sm:px-6 py-3 flex items-center gap-2 border-b"
        style={{ borderColor: '#cfe5ff', backgroundColor: '#e0efff' }}
      >
        <CheckCircle2 className="w-4 h-4 text-primary-700" aria-hidden="true" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary-700 m-0">
          Key takeaways
        </h2>
      </div>

      <ul className="px-5 sm:px-6 py-4 space-y-2.5 list-none m-0">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2.5">
            <span
              className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#1d4ed8' }}
              aria-hidden="true"
            />
            <span className="text-gray-800 leading-relaxed text-[15px]">{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  )
}
