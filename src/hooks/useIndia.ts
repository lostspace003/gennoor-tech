'use client'

import { useEffect, useState } from 'react'
import { looksLikeIndia } from '@/lib/money'

/**
 * Is the visitor in India? `null` until the page is running in their browser: the server cannot know, and a
 * price drawn before we know would show rupees to someone abroad (or dollars to someone in India) for a moment.
 * So a price waits for this, and then shows one currency only. See src/lib/money.ts.
 */
export function useIndia(): boolean | null {
  const [india, setIndia] = useState<boolean | null>(null)
  useEffect(() => setIndia(looksLikeIndia()), [])
  return india
}
