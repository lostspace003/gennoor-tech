'use client'

import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { readAdminTheme, saveAdminTheme, showAdminTheme, type AdminTheme } from '@/lib/theme'

/**
 * The switch between the light and the dark look of the back office (the admin centre and the CRM).
 * Light is the default. The choice is kept in this browser and is separate from the public site's.
 *
 * `label` shows the words beside the icon (a row of a menu); without it, it is an icon button (a top bar).
 * What it will do is always in its name for a screen reader and in its tooltip.
 */
export default function AdminThemeSwitch({ label = false, className = '' }: { label?: boolean; className?: string }) {
  // The server cannot know the choice, so the first paint shows the light state and the real one follows at once
  const [theme, setTheme] = useState<AdminTheme>('light')
  useEffect(() => { setTheme(readAdminTheme()) }, [])

  const dark = theme === 'dark'
  const change = () => {
    const next: AdminTheme = dark ? 'light' : 'dark'
    setTheme(next)
    saveAdminTheme(next)
    showAdminTheme(next)
  }
  const says = dark ? 'Light look' : 'Dark look'
  const Icon = dark ? Sun : Moon

  return (
    <button type="button" onClick={change} aria-pressed={dark} aria-label={`Switch to the ${dark ? 'light' : 'dark'} look`} title={says} className={className}>
      <Icon className="w-[17px] h-[17px] shrink-0 text-gray-400" strokeWidth={1.7} aria-hidden="true" />
      {label && <span>{says}</span>}
    </button>
  )
}
