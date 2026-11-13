'use client'

import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Theme } from '@/lib/theme'

/**
 * Dark or light. Two labelled halves when there is room (the open menu), one round button
 * when there is not (the folded menu, the phone's top bar).
 */
export default function ThemeSwitch({ theme, onChange, compact = false, className }: { theme: Theme; onChange: (t: Theme) => void; compact?: boolean; className?: string }) {
  if (compact) {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    return (
      <button
        type="button"
        onClick={() => onChange(next)}
        aria-label={`Switch to the ${next} look`}
        title={`Switch to the ${next} look`}
        className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors', className)}
      >
        {theme === 'dark' ? <Sun className="h-[17px] w-[17px]" strokeWidth={1.75} /> : <Moon className="h-[17px] w-[17px]" strokeWidth={1.75} />}
      </button>
    )
  }
  return (
    <div role="group" aria-label="Look of the site" className={cn('grid grid-cols-2 gap-1 rounded-full border border-gray-200 bg-gray-100 p-1', className)}>
      {([['dark', 'Dark', Moon], ['light', 'Light', Sun]] as const).map(([value, label, Icon]) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-pressed={theme === value}
          className={cn(
            'inline-flex items-center justify-center gap-1.5 rounded-full py-1.5 text-[12.5px] font-semibold transition-colors',
            theme === value ? 'bg-raised text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900',
          )}
        >
          <Icon className="h-3.5 w-3.5" strokeWidth={2} />{label}
        </button>
      ))}
    </div>
  )
}
