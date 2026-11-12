import Link from 'next/link'
import { Zap } from 'lucide-react'
import { WEEKEND } from '@/data/ai-weekend'

/**
 * The AI Weekend, announced at the very top of the home page: what it is, when
 * it runs (the last weekend of every month), the price, and one button. In the
 * site's blue, with a bolt that flashes slowly so the eye finds it (it stays
 * still for people who ask their device for less motion). The exact dates are
 * on the AI Weekend page, where people register.
 */
export default function WeekendStrip() {
  return (
    <section className="px-4 sm:px-6 pt-12 lg:pt-4" aria-label={WEEKEND.name}>
      <style>{`
        @keyframes wk-flash { 0%, 62%, 100% { transform: scale(1); filter: none; } 68% { transform: scale(1.18); filter: drop-shadow(0 0 8px rgba(255,220,120,.95)); } 74% { transform: scale(.96); } 80% { transform: scale(1.12); filter: drop-shadow(0 0 6px rgba(255,220,120,.8)); } }
        @keyframes wk-sheen { 0%, 55% { transform: translateX(-120%); } 100% { transform: translateX(220%); } }
        @media (prefers-reduced-motion: no-preference) {
          .wk-bolt { animation: wk-flash 3.2s ease-in-out infinite; }
          .wk-strip::after { animation: wk-sheen 5s ease-in-out infinite; }
        }
        .wk-strip::after { content: ''; position: absolute; inset: 0; width: 40%; background: linear-gradient(105deg, transparent, rgba(255,255,255,.14), transparent); transform: translateX(-120%); pointer-events: none; }
      `}</style>
      <Link
        href="/ai-weekend"
        className="wk-strip group relative block max-w-[1180px] mx-auto overflow-hidden rounded-2xl bg-[#0071e3] text-white px-4 sm:px-6 lg:pr-[176px] py-3.5 transition-colors hover:bg-[#0077ed] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3]"
      >
        <span className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-2.5 shrink-0">
            <span className="wk-bolt flex items-center justify-center w-9 h-9 rounded-full bg-white/15">
              <Zap className="w-5 h-5 text-[#ffd666]" fill="#ffd666" strokeWidth={1.5} />
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11.5px] font-bold uppercase tracking-[0.1em]">Live · every month</span>
          </span>
          <span className="min-w-0 flex-1 basis-[280px]">
            <span className="block text-[17px] sm:text-[18px] font-semibold leading-snug">{WEEKEND.name}: {WEEKEND.tagline.charAt(0).toLowerCase() + WEEKEND.tagline.slice(1)}</span>
            <span className="block text-[13.5px] text-white/85 mt-0.5">
              Last weekend of every month · Saturday &amp; Sunday · live online ·{' '}
              <span className="font-semibold text-white">₹{WEEKEND.fee}</span> <s className="text-white/60">₹{WEEKEND.regularFee.toLocaleString('en-IN')}</s>
            </span>
          </span>
          <span className="shrink-0 rounded-full bg-white text-[#0058b0] text-[14px] font-semibold px-5 py-2 group-hover:bg-[#f0f7ff]">Reserve a seat ›</span>
        </span>
      </Link>
    </section>
  )
}
