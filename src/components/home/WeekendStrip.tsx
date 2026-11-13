import Link from 'next/link'
import { Zap } from 'lucide-react'
import { WEEKEND } from '@/data/ai-weekend'
import { Ico } from '@/components/stage/Ico'

/**
 * The AI Weekend, announced at the very top of the home page: what it is, when it runs
 * (the last weekend of every month), the price, and one button. Gold, because gold on
 * this site marks what is live and should not be missed; the bolt pulses slowly so the
 * eye finds it (it stays still for people who ask their device for less motion).
 * The exact dates are on the AI Weekend page, where people register.
 */
export default function WeekendStrip() {
  return (
    <section className="px-4 sm:px-6 pt-12 lg:pt-4" aria-label={WEEKEND.name}>
      <Link
        href="/ai-weekend"
        className="stage st-card st-solid st-gold group relative block max-w-[1180px] mx-auto overflow-hidden !rounded-2xl px-4 sm:px-5 lg:pr-[176px] py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffc24b]"
      >
        {/* a warm light behind the left end, where the bolt is */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-[46%]" style={{ background: 'radial-gradient(120% 160% at 0% 50%, rgba(255,170,46,.26), transparent 70%)' }} />
        <span className="relative flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-3 shrink-0">
            <span className="st-pulse inline-flex"><Ico icon={Zap} tone="gold" round size={40} /></span>
            <span className="rounded-full bg-[#ffc24b]/15 border border-[#ffc24b]/40 px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-[0.1em] text-[#ffd06b]">Live · every month</span>
          </span>
          <span className="min-w-0 flex-1 basis-[280px]">
            <span className="block text-[16.5px] sm:text-[17.5px] font-semibold leading-snug text-white">{WEEKEND.name}: {WEEKEND.tagline.charAt(0).toLowerCase() + WEEKEND.tagline.slice(1)}</span>
            <span className="block text-[13.5px] text-white/75 mt-0.5">
              Last weekend of every month · Saturday &amp; Sunday · live online ·{' '}
              <span className="font-semibold text-white">₹{WEEKEND.fee}</span> <s className="text-white/50">₹{WEEKEND.regularFee.toLocaleString('en-IN')}</s>
            </span>
          </span>
          <span className="st-pill st-gold st-sm shrink-0">Reserve a seat ›</span>
        </span>
      </Link>
    </section>
  )
}
