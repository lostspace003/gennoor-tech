// The gold "% off" marks for a course that carries an offer. Two shapes, used
// sparingly: a ribbon across the top right corner of a course picture, and a
// small pill beside a price. The slow shine lives in globals.css (.offer-shine).

const GOLD = 'linear-gradient(135deg, #a9790a 0%, #e8bd4a 26%, #fff1bd 48%, #e2b03c 66%, #a9790a 100%)'
const INK = '#3b2a00'

/**
 * A ribbon across the top right corner. The parent must be `relative`; give
 * `className` the parent's corner rounding (for example "rounded-tr-2xl").
 */
export function OfferRibbon({ percent, className = '' }: { percent: number; className?: string }) {
  return (
    <div className={`pointer-events-none absolute right-0 top-0 z-[5] h-[116px] w-[116px] overflow-hidden ${className}`}>
      <span
        className="offer-shine absolute right-[-44px] top-[24px] block w-[176px] rotate-45 overflow-hidden py-[5px] text-center text-[12.5px] font-extrabold uppercase tracking-[0.09em] shadow-[0_4px_12px_rgba(0,0,0,.35)]"
        style={{ background: GOLD, color: INK }}
      >
        {percent}% off
      </span>
    </div>
  )
}

/** A small gold pill: "50% off". */
export function OfferPill({ percent, className = '' }: { percent: number; className?: string }) {
  return (
    <span
      className={`offer-shine relative inline-flex items-center overflow-hidden whitespace-nowrap rounded-full px-2.5 py-[3px] text-[12px] font-extrabold uppercase tracking-[0.06em] ${className}`}
      style={{ background: GOLD, color: INK }}
    >
      {percent}% off
    </span>
  )
}
