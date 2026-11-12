import type { Metadata } from 'next'
import { CalendarDays, Clock, Video, Check, Hammer, Award, ShieldCheck, Package } from 'lucide-react'
import { WEEKEND, DAYS, FOR_YOU, INCLUDED, HOW_YOU_LEARN, KIT, TOOLS, FAQS, nextCohort, timeLabel } from '@/data/ai-weekend'
import RegisterForm, { StickyRegister } from './RegisterForm'
import { getRegistrations } from '@/lib/weekend'
import { razorpayConfigured } from '@/lib/razorpay'
import FilmPlayer from '@/components/home/FilmPlayer'
import films from '@/data/films.json'

// The dates roll forward and the seat count moves, so the page is rebuilt every few minutes.
export const revalidate = 300

export const metadata: Metadata = {
  title: `${WEEKEND.name}: ${WEEKEND.tagline}`,
  description: `A live two-day workshop on the last weekend of every month. Eight hours with a trainer, six demos built live, and the full kit to repeat them yourself. ₹${WEEKEND.fee}.`,
  alternates: { canonical: 'https://www.gennoor.com/ai-weekend' },
  openGraph: {
    title: `${WEEKEND.name}: ${WEEKEND.tagline}`,
    description: `Live, last weekend of every month. Eight hours, six demos, and the full kit to repeat them. ₹${WEEKEND.fee}.`,
    url: 'https://www.gennoor.com/ai-weekend',
    type: 'website',
  },
}

const wrap = 'mx-auto w-full max-w-6xl px-4 sm:px-6'

const rupees = (n: number) => `₹${n.toLocaleString('en-IN')}`

export default async function AiWeekendPage() {
  const cohort = nextCohort()
  const time = timeLabel()
  // The real number of people registered for this weekend. If storage cannot be read, show no count rather than a guess.
  const taken = await getRegistrations().then((rows) => rows.filter((r) => r.cohort === cohort.id && r.payment !== 'refunded').length).catch(() => null)
  const left = taken === null ? null : Math.max(0, WEEKEND.seats - taken)
  const full = left === 0
  // Online payment is on once the Razorpay keys are set; until then people reserve and pay later
  const online = razorpayConfigured()
  const ribbon = `Limited cohort of ${WEEKEND.seats} · ${cohort.label} · ${rupees(WEEKEND.fee)} instead of ${rupees(WEEKEND.regularFee)}`

  return (
    <main className="bg-[#fbfaf7] text-gray-900 pb-28">
      {/* Moving ribbon: the three facts people look for first */}
      <div className="bg-[#0C1426] text-white text-xs sm:text-[13px] font-medium overflow-hidden" aria-label={ribbon}>
        <div className="weekend-ribbon flex whitespace-nowrap py-2" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="px-8 shrink-0">{ribbon} <span className="text-amber-400">●</span></span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <section className={`${wrap} pt-5 sm:pt-8`}>
        <div className="relative overflow-hidden rounded-3xl bg-[#0C1426] text-white">
          <div className="absolute inset-0 opacity-90" style={{ background: 'radial-gradient(900px 420px at 88% 10%, rgba(37,99,235,0.75), transparent 60%), radial-gradient(600px 380px at 70% 110%, rgba(245,158,11,0.35), transparent 60%)' }} />
          <div className="relative grid lg:grid-cols-[1.15fr_1fr] gap-8 p-6 sm:p-10 lg:p-12">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" /> Live · last weekend of every month
              </div>
              <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight leading-[1.08] text-white">{WEEKEND.name}</h1>
              <p className="mt-2 text-xl sm:text-2xl font-semibold text-amber-300">{WEEKEND.tagline}</p>
              <p className="mt-4 max-w-xl text-[15px] sm:text-base leading-relaxed text-white/80">
                Two mornings, eight hours, six working demos. Watch Claude set up for real work, a weekly task automated, and an agent built from nothing. Then take the full kit and do it yourself. No coding background needed.
              </p>
              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <Fact icon={CalendarDays} label="Dates" value={cohort.label} />
                <Fact icon={Clock} label="Each day" value={time} />
                <Fact icon={Video} label="Where" value={WEEKEND.mode} />
              </dl>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <a href="#register" className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-7 py-3.5 text-base font-bold text-[#0C1426] hover:bg-amber-300 transition-colors">
                  {full ? 'Join the next cohort' : `Reserve my seat · ${rupees(WEEKEND.fee)}`}
                </a>
                <div className="text-sm leading-tight">
                  <div><s className="text-white/55">{rupees(WEEKEND.regularFee)}</s> <span className="font-semibold text-white">{rupees(WEEKEND.fee)}</span> <span className="text-white/70">for this cohort</span></div>
                  {left !== null && <div className="mt-1 font-semibold text-amber-300">{full ? 'This cohort is full' : `${left} of ${WEEKEND.seats} seats left`}</div>}
                </div>
              </div>
            </div>

            {/* The weekend at a glance */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.07] backdrop-blur p-5 sm:p-6 self-start">
              <div className="text-xs font-semibold uppercase tracking-widest text-white/60">The weekend at a glance</div>
              <ol className="mt-4 space-y-4">
                {DAYS.map((d) => (
                  <li key={d.label}>
                    <div className="text-[13px] font-semibold text-amber-300">{d.label}</div>
                    <div className="text-base font-semibold leading-snug text-white">{d.title}</div>
                    <ul className="mt-2 space-y-1.5">
                      {d.projects.map((p) => (
                        <li key={p.name} className="flex gap-2 text-sm text-white/80"><Hammer className="w-3.5 h-3.5 mt-1 shrink-0 text-white/50" />{p.name}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* The weekend in one minute: the film says what is built on each day */}
      <section className={`${wrap} mt-6`} aria-label="The weekend in one minute">
        <div className="mx-auto max-w-4xl">
          <FilmPlayer tone="gold" src={films.weekend.src} poster={films.weekend.poster} title={films.weekend.title} transcript={films.weekend.transcript} seconds={films.weekend.seconds} />
        </div>
      </section>

      {/* Numbers that are simply true about the format */}
      <section className={`${wrap} mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3`}>
        {[
          ['8 hours', 'live with the trainer'],
          ['6 demos', 'built live, step by step'],
          ['2 days', 'Saturday and Sunday'],
          ['1 kit', 'to repeat it all yourself'],
        ].map(([big, small]) => (
          <div key={big} className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="text-3xl font-bold tracking-tight text-[#0C1426]">{big}</div>
            <div className="mt-1 text-sm text-gray-500">{small}</div>
          </div>
        ))}
      </section>

      {/* Is this for you */}
      <section className={`${wrap} mt-8`}>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">This is for people who</h2>
        <div className="mt-6 rounded-3xl bg-[#0C1426] text-white p-6 sm:p-8 grid sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:divide-x lg:divide-white/10">
          {FOR_YOU.map((f, i) => (
            <div key={f.title} className={i ? 'lg:pl-6' : ''}>
              <div className="text-base font-semibold">{f.title}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-white/70">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The two days */}
      <section className={`${wrap} mt-10`}>
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Your two days</h2>
          <p className="mt-2 text-gray-500">Six demos. Two live sessions. One kit to repeat them all.</p>
        </div>
        <div className="mt-8 grid lg:grid-cols-2 gap-5">
          {DAYS.map((d, i) => (
            <article key={d.label} className="relative overflow-hidden rounded-3xl bg-[#0C1426] text-white p-6 sm:p-8">
              <div className="absolute inset-0 opacity-80" style={{ background: i === 0 ? 'radial-gradient(520px 300px at 100% 0%, rgba(245,158,11,0.45), transparent 62%)' : 'radial-gradient(520px 300px at 100% 0%, rgba(37,99,235,0.7), transparent 62%)' }} />
              <div className="relative">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-white/70">
                  <span>{d.label}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-2 py-0.5"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />Live</span>
                  <span>{time}</span>
                </div>
                <h3 className="mt-3 text-2xl font-bold leading-snug text-white">{d.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-white/75">{d.summary}</p>

                <div className="mt-5 text-sm font-semibold">What you see built</div>
                <ul className="mt-2 space-y-3">
                  {d.projects.map((p) => (
                    <li key={p.name} className="flex gap-3">
                      <Check className="w-4 h-4 mt-1 shrink-0 text-amber-300" />
                      <span><span className="block font-semibold">{p.name}</span><span className="block text-sm text-white/65">{p.result}</span></span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 text-sm font-semibold">How the four hours go</div>
                <ol className="mt-2 grid sm:grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-white/75">
                  {d.agenda.map((a, n) => <li key={a} className="flex gap-2"><span className="text-white/40 tabular-nums">{n + 1}.</span>{a}</li>)}
                </ol>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* What you will use */}
      <section className={`${wrap} mt-10`}>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">What you will work with</h2>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TOOLS.map((t) => (
            <div key={t} className="rounded-2xl bg-[#0C1426] text-white text-center font-semibold px-3 py-6 text-[15px]">{t}</div>
          ))}
        </div>
      </section>

      {/* Who teaches it */}
      <section className={`${wrap} mt-10`}>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 grid md:grid-cols-[auto_1fr] gap-6 items-center">
          <div className="w-24 h-24 rounded-2xl bg-[#0C1426] text-amber-300 flex items-center justify-center text-3xl font-bold" aria-hidden="true">
            {WEEKEND.trainer.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">Your trainer</div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">{WEEKEND.trainer.name}</h2>
            <div className="text-sm text-gray-500">{WEEKEND.trainer.role}</div>
            <p className="mt-3 text-[15px] leading-relaxed text-gray-700">{WEEKEND.trainer.line}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <a href="https://claude.com/partners" target="_blank" rel="noopener noreferrer"><img src="/cpn/cpn-certified-horizontal.svg" alt="Claude Partner Network - Certified" width={170} height={54} /></a>
              <span className="text-sm text-gray-600">Gennoor is Certified in the Claude Partner Network.</span>
            </div>
          </div>
        </div>
      </section>

      {/* How the weekend teaches */}
      <section className={`${wrap} mt-10`}>
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">How you learn</h2>
          <p className="mt-2 text-gray-500">First you see it done. Then you get everything you need to do it yourself.</p>
        </div>
        <ol className="mt-8 grid md:grid-cols-3 gap-4">
          {HOW_YOU_LEARN.map((s, i) => (
            <li key={s.title} className="rounded-3xl border border-gray-200 bg-white p-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0C1426] text-sm font-bold text-amber-300">{i + 1}</div>
              <h3 className="mt-4 text-xl font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-3xl bg-[#0C1426] text-white p-6 sm:p-7 flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="flex items-center gap-3 shrink-0">
            <Package className="w-8 h-8 text-amber-300" />
            <div>
              <div className="text-lg font-bold leading-tight">The kit</div>
              <div className="text-sm text-white/65">Sent after the weekend</div>
            </div>
          </div>
          <ul className="flex flex-wrap gap-2">
            {KIT.map((k) => <li key={k} className="rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm">{k}</li>)}
          </ul>
        </div>
      </section>

      {/* Price and the form */}
      <section id="register" className={`${wrap} mt-10 scroll-mt-6`}>
        <div className="rounded-3xl bg-[#f3efe6] p-5 sm:p-8 grid lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Reserve your seat</h2>
            <p className="mt-2 text-gray-600">{cohort.label} · {time}</p>
            <div className="mt-5 inline-flex items-center rounded-full bg-[#0C1426] px-3 py-1 text-xs font-semibold text-amber-300">Limited cohort · {WEEKEND.seats} seats</div>
            <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <s className="text-2xl font-semibold text-gray-400" aria-label={`Regular price ${rupees(WEEKEND.regularFee)}`}>{rupees(WEEKEND.regularFee)}</s>
              <span className="text-5xl font-bold tracking-tight text-[#0C1426]">{rupees(WEEKEND.fee)}</span>
              <span className="text-sm text-gray-500">for both days</span>
            </div>
            {left !== null && taken !== null && (
              <div className="mt-4 max-w-sm">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-900">{full ? 'This cohort is full' : `${left} seats left`}</span>
                  <span className="text-gray-500">{taken} of {WEEKEND.seats} taken</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-white" role="progressbar" aria-valuemin={0} aria-valuemax={WEEKEND.seats} aria-valuenow={taken} aria-label="Seats taken">
                  <div className="h-2 rounded-full bg-amber-500" style={{ width: `${Math.min(100, (taken / WEEKEND.seats) * 100)}%` }} />
                </div>
              </div>
            )}
            <ul className="mt-6 space-y-3">
              {INCLUDED.map((x) => (
                <li key={x} className="flex gap-3 text-[15px] text-gray-800"><Check className="w-4 h-4 mt-1 shrink-0 text-green-600" />{x}</li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-sm font-semibold text-gray-900">How it works</div>
              <ol className="mt-2.5 space-y-2.5">
                {HOW_YOU_LEARN.map((s, i) => (
                  <li key={s.title} className="flex gap-3 text-sm">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0C1426] text-[11px] font-bold text-amber-300">{i + 1}</span>
                    <span><span className="font-semibold text-gray-900">{s.title}.</span> <span className="text-gray-600">{s.text}</span></span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-3 flex gap-3 rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
              <ShieldCheck className="w-5 h-5 shrink-0 text-green-600" />
              <span>{online ? 'Pay securely by UPI, card or net banking. Your seat is confirmed the moment the payment goes through, and a receipt is emailed to you.' : 'Reserve now, pay after. We email you the payment details and confirm your seat once the fee is received.'}</span>
            </div>
          </div>
          <div className="rounded-2xl bg-white border border-gray-200 p-5 sm:p-6">
            <RegisterForm cohortLabel={cohort.label} fee={WEEKEND.fee} full={full} online={online} />
          </div>
        </div>
      </section>

      {/* Certificate */}
      <section className={`${wrap} mt-10`}>
        <div className="rounded-3xl border border-gray-200 bg-white p-6 sm:p-8 flex flex-col sm:flex-row gap-5 sm:items-center">
          <Award className="w-10 h-10 shrink-0 text-amber-500" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight">A certificate of attendance</h2>
            <p className="mt-1.5 text-[15px] text-gray-600">It goes to people who attend both days. Attendance is checked, so it is not sent to everyone who signed up.</p>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className={`${wrap} mt-10 grid lg:grid-cols-[1fr_2fr] gap-6`}>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Questions people ask</h2>
        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {FAQS.map((f) => (f.q === 'How do I pay?' && online ? { ...f, a: 'Fill in the form and the payment window opens: UPI, card or net banking, handled by Razorpay. Your seat is confirmed the moment the payment goes through. If you close the window, the email we send has a Pay now button.' } : f)).map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-semibold [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="text-2xl font-light text-gray-400 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </summary>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <StickyRegister fee={WEEKEND.fee} regularFee={WEEKEND.regularFee} note={left === null ? cohort.label : full ? 'This cohort is full' : `${left} seats left · ${cohort.label}`} />

      <style>{`
        .weekend-ribbon { animation: weekend-ribbon 38s linear infinite; width: max-content; }
        @keyframes weekend-ribbon { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @media (prefers-reduced-motion: reduce) { .weekend-ribbon { animation: none } }
      `}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'EducationEvent',
            name: `${WEEKEND.name}: ${WEEKEND.tagline}`,
            startDate: `${cohort.saturday}T${WEEKEND.startTime}:00+05:30`,
            endDate: `${cohort.sunday}T${WEEKEND.endTime}:00+05:30`,
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            location: { '@type': 'VirtualLocation', url: 'https://www.gennoor.com/ai-weekend' },
            organizer: { '@type': 'Organization', name: 'Gennoor Tech', url: 'https://www.gennoor.com' },
            offers: { '@type': 'Offer', price: WEEKEND.fee, priceCurrency: 'INR', url: 'https://www.gennoor.com/ai-weekend', availability: 'https://schema.org/InStock' },
          }),
        }}
      />
    </main>
  )
}

function Fact({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex gap-2.5">
      <Icon className="w-4 h-4 mt-0.5 shrink-0 text-white/60" />
      <div>
        <dt className="text-xs text-white/60">{label}</dt>
        <dd className="font-semibold leading-snug">{value}</dd>
      </div>
    </div>
  )
}
