import Link from 'next/link'

/**
 * Learning Studio has two ways to learn, always one click apart and always
 * centred, so the toggle never shifts between the two pages.
 *   Certifications & Projects - long hands-on courses taught on video
 *   AI Essentials           - short interactive courses (slides, audio, quiz)
 */
export const STUDIO_NAME = 'Certifications & Projects'
export const ESSENTIALS_NAME = 'AI Essentials'

const TABS = [
  { id: 'studio', href: '/studio', name: STUDIO_NAME, line: 'Hands-on courses, taught step by step' },
  { id: 'essentials', href: '/ai-academy', name: ESSENTIALS_NAME, line: 'Interactive courses you finish in an hour' },
] as const

export default function AcademySwitch({ active, dark = false }: { active?: 'studio' | 'essentials'; dark?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <p className={`font-heading text-[15px] font-semibold ${dark ? 'text-white' : 'text-gray-900'}`}>Learning Studio</p>
      <nav aria-label="Learning Studio" className={`inline-flex flex-col sm:flex-row gap-1.5 p-1.5 rounded-2xl ${dark ? 'bg-white/[0.06]' : 'bg-gray-100'}`}>
        {TABS.map(t => {
          const on = t.id === active
          return (
            <Link
              key={t.id}
              href={t.href}
              aria-current={on ? 'page' : undefined}
              className={`rounded-xl px-6 py-3 text-center sm:w-[280px] transition-all duration-200 ${
                on ? 'bg-raised shadow-[0_1px_3px_rgba(15,24,36,.12)]' : dark ? 'hover:bg-white/10' : 'hover:bg-white/60'
              }`}
            >
              <span className={`block text-[15px] font-semibold ${on ? 'text-gray-900' : dark ? 'text-white' : 'text-gray-800'}`}>{t.name}</span>
              <span className={`block text-[12.5px] mt-0.5 ${on || !dark ? 'text-gray-500' : 'text-[#a9b4c4]'}`}>{t.line}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
