'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Theme } from '@/lib/theme'

/** Said when the pointer rests on the switch: why the look changes by itself, and how long a choice lasts. */
const HOW = 'The site follows your clock: light by day, dark in the evening and at night. A choice made here lasts until the next change.'

/**
 * Dark or light. Two labelled halves when there is room (the open menu), one round button
 * when there is not (the folded menu, the phone's top bar).
 *
 * The look follows the visitor's clock (src/lib/theme.ts), and the server cannot know their hour. So until
 * the page is in the browser neither half is lit and the round button is empty: nothing shows the wrong
 * look for a moment.
 */
export default function ThemeSwitch({ theme, onChange, compact = false, className }: { theme: Theme; onChange: (t: Theme) => void; compact?: boolean; className?: string }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])

  if (compact) {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    return (
      <button
        type="button"
        onClick={() => onChange(next)}
        aria-label={ready ? `Switch to the ${next} look` : 'Change the look of the site'}
        title={ready ? `Switch to the ${next} look. ${HOW}` : HOW}
        className={cn('inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors', className)}
      >
        {ready && (theme === 'dark' ? <Sun className="h-[17px] w-[17px]" strokeWidth={1.75} /> : <Moon className="h-[17px] w-[17px]" strokeWidth={1.75} />)}
      </button>
    )
  }
  return (
    <div role="group" aria-label="Look of the site" title={HOW} className={cn('grid grid-cols-2 gap-1 rounded-full border border-gray-200 bg-gray-100 p-1', className)}>
      {([['dark', 'Dark', Moon], ['light', 'Light', Sun]] as const).map(([value, label, Icon]) => {
        const on = ready && theme === value
        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={on}
            className={cn(
              'inline-flex items-center justify-center gap-1.5 rounded-full py-1.5 text-[12.5px] font-semibold transition-colors',
              on ? 'bg-raised text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900',
            )}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2} />{label}
          </button>
        )
      })}
    </div>
  )
}
