import { Users, Clock, CalendarDays, SlidersHorizontal } from 'lucide-react'

/** Short pointers under a course promo. Duration comes from the table of contents (1 day = 8 hours). */
export default function LiveTrainerPointers({ days, hours }: { days: number; hours: number }) {
  const items = [
    { icon: Users, text: 'Instructor-led training: Online or Destination' },
    { icon: Clock, text: `${days} ${days === 1 ? 'day' : 'days'} · ${hours} hours` },
    { icon: CalendarDays, text: 'Starts in about 3 weeks' },
    { icon: SlidersHorizontal, text: 'Flexible and customizable' },
  ]
  return (
    <ul className="flex flex-wrap gap-2.5">
      {items.map(({ icon: Icon, text }) => (
        <li key={text} className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-raised px-4 py-2 text-[14px] text-gray-700">
          <Icon className="w-4 h-4 text-primary-600" aria-hidden />{text}
        </li>
      ))}
    </ul>
  )
}
