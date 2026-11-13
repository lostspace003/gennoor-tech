import Link from 'next/link'
import { CalendarDays, Clock, Video, Zap } from 'lucide-react'
import { WEEKEND, timeLabel } from '@/data/ai-weekend'
import films from '@/data/films.json'
import FilmPlayer from './FilmPlayer'
import Ground from '@/components/stage/Ground'
import { Ico } from '@/components/stage/Ico'

/**
 * The AI Weekend on the home page: its one-minute film, when it runs and one button.
 * A panel with a warm light, so it reads as an event and not as one more section.
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
      <Ground as="div" glow="gold" mx={30} my={50} className="max-w-[1180px] mx-auto rounded-[28px] border border-white/10">
        <div className="relative grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)] gap-6 lg:gap-9 items-center p-4 sm:p-6 lg:p-8">
          <FilmPlayer tone="gold" src={film.src} poster={film.poster} title={film.title} transcript={film.transcript} seconds={film.seconds} />
          <div>
            <p className="inline-flex items-center gap-2.5">
              <Ico icon={Zap} tone="gold" round size={34} />
              <span className="st-kicker">Live · every month</span>
            </p>
            <h2 id="weekend-film" className="font-heading text-[clamp(28px,3vw,40px)] font-bold leading-[1.08] tracking-[-0.025em] !text-white mt-3.5">{WEEKEND.name}</h2>
            <p className="text-[17px] leading-[1.5] text-white/75 mt-2.5">{WEEKEND.tagline}. Six working demos, built live in front of you, and the complete kit to repeat them.</p>
            <dl className="mt-5 space-y-2.5">
              {facts.map(([Icon, label, value]) => (
                <div key={label} className="flex items-start gap-3 text-[15px]">
                  <Icon className="h-[18px] w-[18px] mt-0.5 shrink-0 text-[#ffd666]" />
                  <dt className="w-[58px] shrink-0 text-white/55">{label}</dt>
                  <dd className="font-semibold text-white">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <Link href="/ai-weekend#register" className="st-pill st-gold">Reserve a seat · ₹{WEEKEND.fee}</Link>
              <Link href="/ai-weekend" className="st-link text-[15px]">See the two days ›</Link>
            </div>
          </div>
        </div>
      </Ground>
    </section>
  )
}
