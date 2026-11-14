'use client'

import { weekendFee } from '@/data/ai-weekend'
import { money } from '@/lib/money'
import { useIndia } from '@/hooks/useIndia'

/**
 * The AI Weekend's fee in the visitor's own money: rupees in India, dollars everywhere else, never both.
 * `part` is the fee people pay, or the regular price shown crossed out beside it. Nothing is drawn until the
 * browser has said where the visitor is; `before` is put in front of the amount when it appears
 * ("Reserve my seat" becomes "Reserve my seat · ₹499").
 */
export default function WeekendFee({ part = 'fee', before = '' }: { part?: 'fee' | 'regular'; before?: string }) {
  const india = useIndia()
  if (india === null) return null
  const f = weekendFee(india)
  return <>{before}{money(part === 'fee' ? f.fee : f.regular, f.currency)}</>
}
