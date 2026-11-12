import Link from 'next/link'
import { CalendarDays, Clock, Video, Zap } from 'lucide-react'
import { WEEKEND, timeLabel } from '@/data/ai-weekend'
import films from '@/data/films.json'
import FilmPlayer from './FilmPlayer'

/**
 * The AI Weekend on the home page: its one-minute film, when it runs and one button.
 * A dark panel with a warm light, so it reads as an event and not as one more section.
 * It says "the last weekend of every month", which stays true; the exact dates are on
 * the AI Weekend page. The price comes from the same place that page reads it.
 */
export default function WeekendFilm() {
  const film = films.weekend
  const facts = [
    [CalendarDays, 'When', 'Last weekend of every month'],
    [Clock, 'Days', `Saturday & Sunday · ${timeLabel()}`],
    [Video, 'Where', WEEKEND.mode],
  ] as const
  return (
    <section className="px-4 sm:px-6 pb-8 lg:pb-10" aria-labelledby="weekend-film">
      <div className="relative max-w-[1180px] mx-auto overflow-hidden rounded-[28px] bg-[#060914] text-white">
        <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(720px 380px at 8% 0%, rgba(255,170,46,.24), transparent 65%), radial-gradient(760px 460px at 100% 100%, rgba(34,110,255,.38), transparent 65%)' }} />
        <div className="relative grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)] gap-6 lg:gap-9 items-center p-4 sm:p-6 lg:p-8">
          <FilmPlayer tone="gold" src={film.src} poster={film.poster} title={film.title} transcript={film.transcript} seconds={film.seconds} />
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#ffd666]">
              <Zap className="h-3.5 w-3.5" fill="#ffd666" strokeWidth={1.5} /> Live · every month
            </p>
            <h2 id="weekend-film" className="font-heading text-[clamp(28px,3vw,40px)] font-bold leading-[1.08] tracking-[-0.025em] !text-white mt-3">{WEEKEND.name}</h2>
            <p className="text-[17px] leading-[1.5] text-white/75 mt-2.5">{WEEKEND.tagline}. Six working demos, built live in front of you, and the complete kit to repeat them.</p>
            <dl className="mt-5 space-y-2.5">
              {facts.map(([Icon, label, value]) => (
                <div key={label} className="flex items-start gap-3 text-[15px]">
                  <Icon className="h-[18px] w-[18px] mt-0.5 shrink-0 text-[#ffd666]" />
                  <dt className="w-[74px] shrink-0 text-white/55">{label}</dt>
                  <dd className="font-semibold text-white">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/ai-weekend#register" className="inline-flex items-center rounded-full bg-[#ffc24b] px-6 py-3 text-[15px] font-bold text-[#2a1a00] transition-colors hover:bg-[#ffd06b]">
                Reserve a seat · ₹{WEEKEND.fee}
              </Link>
              <Link href="/ai-weekend" className="text-[15px] font-semibold text-white underline underline-offset-4 hover:text-[#ffd666]">See the two days ›</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
