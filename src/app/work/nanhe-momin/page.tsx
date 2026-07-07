import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { Noto_Nastaliq_Urdu } from 'next/font/google'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'
import { BLOB_URL } from '@/lib/site-config'

const nastaliq = Noto_Nastaliq_Urdu({ subsets: ['arabic'], weight: '400' })

export const metadata: Metadata = {
  title: 'Nanhe Momin — An Animated Seerah Series Produced End-to-End by AI',
  description:
    'How Gennoor Tech produced Nanhe Momin: an animated Seerah series for kids in natural Hindi-Urdu, where screenplay, animation, voices, lipsync and quality checks all come from one automated AI pipeline.',
  keywords: [
    'AI video production',
    'AI animation pipeline',
    'kids animated series',
    'automated content production',
    'text to video pipeline',
    'Gennoor Tech build',
  ],
  alternates: { canonical: 'https://gennoor.com/work/nanhe-momin' },
  openGraph: {
    title: 'Nanhe Momin — ننھے مومن',
    description:
      'An animated Seerah series for kids, produced end-to-end by an AI pipeline — six little cousins living the Prophet’s ﷺ lessons, in the Hindi-Urdu kids actually speak. Watch Episode 1.',
    url: 'https://gennoor.com/work/nanhe-momin',
    images: ['/showcase/nanhe-momin/poster.jpg'],
  },
}

const promises = [
  {
    title: 'Authentic sources',
    body: 'Every lesson is retold from the Seerah with its reference shown on screen — nothing invented. Episode 1 cites Seerah Ibn Hisham and Sahih al-Bukhari 6094.',
  },
  {
    title: 'Their own language',
    body: 'Natural Hindi-Urdu the way children actually speak it — बैट, not बल्ला — so nothing needs translating for a 4–10 year old.',
  },
  {
    title: 'End-to-end AI production',
    body: 'Screenplay, animation, voices, lipsync and quality checks — one automated pipeline. The only human input is a one-line theme.',
  },
]

const stills = [
  { img: 'salam.jpg', alt: 'Maaz waves salam to Huzaifa in the courtyard', label: 'The salam' },
  { img: 'bat.jpg', alt: 'Maaz proudly shows his new cricket bat', label: 'The new bat' },
  { img: 'swing.jpg', alt: 'Huzaifa swings the bat with all his might', label: 'One wild swing' },
  { img: 'bush.jpg', alt: 'Huzaifa hides the broken bat while Hana watches', label: 'The hiding place' },
  { img: 'lesson.jpg', alt: 'Saad gently tells the Seerah story', label: 'Saad’s story' },
  { img: 'friends.jpg', alt: 'All six cousins together at golden hour', label: 'Truth wins' },
]

const pipeline = [
  {
    title: 'Story & screenplay',
    body: 'A one-line theme goes in — “the reward of truthfulness”. The pipeline researches the authentic Seerah reference, then writes a full episode screenplay around the six cousins: scenes, dialogue and the lesson beat.',
  },
  {
    title: 'Animation & voices',
    body: 'Every scene is generated as animation with consistent characters, then voiced in natural, child-friendly Hindi-Urdu and lipsynced — no studio, no voice actors, no animators.',
  },
  {
    title: 'Quality checks & assembly',
    body: 'Automated checks review continuity, audio sync and the on-screen source citation before the episode is assembled and rendered as a finished video.',
  },
]

const palette = [
  { name: 'Dawn', hex: '#FBEED3' },
  { name: 'Gold', hex: '#D99A28' },
  { name: 'Dome', hex: '#17694A' },
  { name: 'Clay', hex: '#9C5B33' },
  { name: 'Night', hex: '#131B38' },
  { name: 'Cream', hex: '#FFF9EC' },
]

export default function NanheMominPage() {
  return (
    <main style={{ background: '#FBEED3', color: '#3A2A10' }}>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(120% 90% at 50% -20%, #FFE9B8 0%, #FBEED3 55%, #F3D9A4 100%)',
          }}
        />

        <div className="container relative z-10 mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#6B5636] transition-colors hover:text-[#17694A]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Gennoor Tech
          </Link>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-5">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#17694A]/30 bg-[#17694A]/10 px-3 py-1 text-xs font-semibold text-[#0F4A34]">
                Proof of concept · produced end-to-end by AI
              </div>

              <h1 className="mb-2">
                <span
                  dir="rtl"
                  className={`${nastaliq.className} block text-5xl leading-[1.9] text-[#9C5B33] lg:text-6xl`}
                >
                  ننھے مومن
                </span>
                <span className="mt-1 block text-2xl font-black uppercase tracking-[0.35em] text-[#0F4A34] lg:text-3xl">
                  Nanhe Momin
                </span>
              </h1>

              <p className="mb-8 max-w-xl text-lg leading-relaxed text-[#6B5636]">
                An animated Seerah series for kids — six little cousins living the Prophet&rsquo;s ﷺ
                lessons, in the Hindi-Urdu kids actually speak. Screenplay, animation, voices,
                lipsync and quality checks all come from one automated AI pipeline: a one-line
                theme goes in, a finished episode comes out.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/contact"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#17694A] px-5 py-3 text-sm font-bold text-[#FFF9EC] shadow-lg shadow-[#17694A]/25 transition-all hover:bg-[#0F4A34]"
                >
                  Have an idea? Let&rsquo;s build it
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {['Episode 01', '3 minutes', 'हिन्दी-उर्दू', 'Ages 4–10'].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border border-[#17694A]/50 bg-white/60 px-3 py-1 text-xs font-semibold text-[#0F4A34]"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            {/* Episode 1 video */}
            <div className="lg:col-span-7">
              <div
                className="rounded-3xl p-3"
                style={{
                  background: '#FFF9EC',
                  boxShadow: '0 12px 30px rgba(90,58,10,.22), 0 3px 8px rgba(90,58,10,.14)',
                }}
              >
                <InlineVideoPlayer
                  videoSrc={`${BLOB_URL}/videos/nanhe-momin-ep01.mp4`}
                  posterSrc="/showcase/nanhe-momin/poster.jpg"
                  rounded="rounded-2xl"
                  className="shadow-none"
                />
              </div>
              <p className="mt-3 text-center text-xs text-[#6B5636]">
                🔊 Sound on — Episode 1, complete (3 min)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Episode 01 ─────────────────────────────────────── */}
      <section className="border-t border-[#3A2A10]/10 py-16 lg:py-20" style={{ background: '#FFF9EC' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.28em] text-[#17694A]">
              Episode 01
            </p>
            <h2 className="mb-3 text-2xl font-bold text-[#3A2A10] lg:text-3xl">
              सच्चाई का इनाम <span className="text-[#9C5B33]">· The Reward of Truthfulness</span>
            </h2>
            <p className="mb-4 max-w-2xl text-[#6B5636]">
              Huzaifa breaks his cousin&rsquo;s brand-new cricket bat — and hides it. Then Saad
              tells him why the whole of Makkah called the Prophet ﷺ{' '}
              <strong>As-Sadiq, the Truthful</strong>, even before prophethood.
            </p>
            <span className="inline-block rounded-full bg-[#17694A] px-4 py-1 text-sm font-semibold text-[#FFF9EC]">
              Seerah Ibn Hisham · Sahih al-Bukhari 6094
            </span>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {stills.map((s) => (
                <figure key={s.img} className="group">
                  <div className="overflow-hidden rounded-2xl border border-[#3A2A10]/10 bg-white shadow-sm">
                    <Image
                      src={`/showcase/nanhe-momin/stills/${s.img}`}
                      alt={s.alt}
                      width={640}
                      height={360}
                      className="aspect-video h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-2 text-center text-sm font-semibold text-[#6B5636]">
                    {s.label}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What the PoC demonstrates ──────────────────────── */}
      <section className="border-t border-[#3A2A10]/10 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-3 text-2xl font-bold text-[#3A2A10] lg:text-3xl">
              What this proof of concept demonstrates
            </h2>
            <p className="mb-10 max-w-2xl text-[#6B5636]">
              A children&rsquo;s series that would normally need a writers&rsquo; room, a studio and
              a dubbing cast — produced by one pipeline, without compromising on the source
              material.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {promises.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border-t-4 border-[#D99A28] bg-[#FFF9EC] p-5 shadow-sm"
                >
                  <h3 className="mb-2 font-semibold text-[#3A2A10]">{p.title}</h3>
                  <p className="text-sm leading-relaxed text-[#6B5636]">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it's made ──────────────────────────────────── */}
      <section className="border-t border-[#3A2A10]/10 py-16 lg:py-20" style={{ background: '#FFF9EC' }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-3 text-2xl font-bold text-[#3A2A10] lg:text-3xl">
              How it&rsquo;s made
            </h2>
            <p className="mb-10 max-w-2xl text-[#6B5636]">
              One automated pipeline, one theme line in — a finished, cited, lipsynced episode out.
            </p>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {pipeline.map((step, i) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-[#3A2A10]/10 bg-white p-6 shadow-sm"
                >
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-[#D99A28]/20 text-sm font-bold text-[#9C5B33]">
                    {i + 1}
                  </div>
                  <h3 className="mb-2 font-semibold text-[#3A2A10]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#6B5636]">{step.body}</p>
                </div>
              ))}
            </div>

            {/* Brand palette */}
            <div className="mt-12">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#6B5636]">
                Brand — golden morning &amp; dome green
              </h3>
              <div className="flex flex-wrap gap-3">
                {palette.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-2.5 rounded-xl border border-[#3A2A10]/10 bg-white px-3 py-2 shadow-sm"
                  >
                    <span
                      className="h-6 w-6 rounded-md border border-[#3A2A10]/20"
                      style={{ background: c.hex }}
                    />
                    <span className="text-xs">
                      <span className="block font-semibold text-[#3A2A10]">{c.name}</span>
                      <span className="block font-mono text-[10px] text-[#6B5636]">{c.hex}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA (night) ────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 text-center" style={{ background: '#131B38' }}>
        <div className="absolute inset-0 opacity-35">
          <Image
            src="/showcase/nanhe-momin/night.jpg"
            alt=""
            fill
            className="object-cover"
            aria-hidden="true"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-black text-[#F3E9D2] lg:text-4xl">
              Got a content idea sitting in a doc?
            </h2>
            <p className="mb-8 text-lg text-[#C9BD9F]">
              This is what we do at Gennoor Tech — we design and ship real products and AI
              pipelines end-to-end: web &amp; mobile apps, cloud backends, and automated media
              production like this one.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#E8B54A] px-6 py-3.5 text-sm font-bold text-[#131B38] shadow-lg shadow-[#E8B54A]/25 transition-all hover:bg-[#D99A28]"
              >
                Let&rsquo;s make it real
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/work/safar-anbiya"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                See our flagship build
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-10 border-t border-[#F3E9D2]/25 pt-5 text-sm text-[#A99F86]">
              Episode 2 — coming soon, insha&rsquo;Allah.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
