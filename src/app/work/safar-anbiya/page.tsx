import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowLeft, ExternalLink } from 'lucide-react'
import InlineVideoPlayer from '@/components/InlineVideoPlayer'
import { BLOB_URL } from '@/lib/site-config'

const LIVE_URL = 'https://safar-anbiya.gennoor.com'

export const metadata: Metadata = {
  title: 'Safar Anbiya — A Gamified Kids’ Learning App We Built End-to-End',
  description:
    'How Gennoor Tech designed, built and shipped Safar Anbiya: a cinematic, installable kids’ app with 25 interactive prophet journeys, bilingual neural narration, real Qur’an recitation and a full Azure cloud backend.',
  keywords: [
    'product development case study',
    'kids learning app',
    'PWA development',
    'Next.js Azure app',
    'neural voice narration',
    'Gennoor Tech build',
  ],
  alternates: { canonical: 'https://gennoor.com/work/safar-anbiya' },
  openGraph: {
    title: 'Safar Anbiya — Journey of the Prophets',
    description:
      'A gamified Islamic learning journey for kids — 25 interactive prophet stories, bilingual neural narration, real Qur’an recitation, installable on any phone. Designed and shipped end-to-end by Gennoor Tech.',
    url: 'https://gennoor.com/work/safar-anbiya',
    images: ['/showcase/safar-anbiya/social-lockup.png'],
  },
}

const features = [
  {
    title: '25 prophets, 25 journeys',
    body: 'Each prophet gets a distinct night sky — its own palette, aurora wash and moon placement — so every stage feels different.',
  },
  {
    title: 'Cinematic storytelling',
    body: 'Continuous Ken Burns drift and per-scene cross-fades render each story beat like a moving illustration.',
  },
  {
    title: 'Bilingual narration',
    body: 'Pre-generated Azure Neural voices in English and Urdu, with live word-by-word highlighting synced to the audio.',
  },
  {
    title: 'The real ayah',
    body: 'Every prophet surfaces 3–4 authentic Qur’anic verses — Arabic text, qari recitation and spoken meaning from verified sources.',
  },
  {
    title: 'Gamification (Noor)',
    body: 'A level ladder, 1–3 star ratings, a badge gallery, a 🔥 daily streak, recap quizzes, confetti and WebAudio chimes.',
  },
  {
    title: 'Installable PWA',
    body: 'Offline-capable, full app manifest, home-screen install, app shortcuts and Edge side-panel docking.',
  },
]

const beats = [
  { img: '01-after-begin.png', label: 'Welcome', note: 'The lantern lights the path' },
  { img: '03-map.png', label: 'Journey map', note: 'All 25 prophets, one light-trail' },
  { img: 'beat1-arrive.png', label: 'Arrive', note: 'The prophet’s unique sky fades in' },
  { img: 'beat2-story.png', label: 'Story', note: 'Animated, narrated panels' },
  { img: 'beat3-decision.png', label: 'Decision', note: 'The child makes a moral choice' },
  { img: 'beat4-result.png', label: 'Result', note: 'The consequence is shown' },
  { img: 'beat5-modern.png', label: 'Today', note: '“What would you do now?”' },
  { img: 'beat6-ayah.png', label: 'Ayah', note: 'The real Qur’anic verse + recitation' },
  { img: 'beat7-quiz.png', label: 'Quiz', note: 'A short recap test' },
  { img: 'beat8b-reward-clean.png', label: 'Reward', note: 'Stars, Noor, badges, streak 🎉' },
]

const archLayers = [
  {
    title: 'Frontend · installable PWA',
    body: 'Next.js (App Router) + React 19. One rich client experience, content-driven from data modules (English, Roman-Urdu, and Qur’an verse sets), with local progress.',
    tags: ['Next.js 15', 'React 19', 'PWA / offline', 'PWABuilder (Android · iOS)'],
  },
  {
    title: 'Cloud backend · Azure',
    body: 'A swappable service layer (local ↔ Azure) so the same app runs on a laptop or in the cloud unchanged. Accounts, profiles and progress are server-side.',
    tags: ['Azure Web App (Node 22)', 'Azure SQL', 'Blob Storage', 'Communication Services (OTP)'],
  },
  {
    title: 'AI & media pipeline',
    body: 'Narration is pre-generated static audio (not live TTS): a build script calls Azure Speech and writes hashed MP3s + a manifest, so audio loads instantly and works offline. Avatars are generated per child.',
    tags: ['Azure Speech (neural)', 'gpt-image avatars', 'Content-hash audio cache', 'GitHub Actions CI/CD'],
  },
]

const palette = [
  { name: 'Twilight', hex: '#0C0820' },
  { name: 'Royal', hex: '#1A1140' },
  { name: 'Noor Gold', hex: '#F5C451' },
  { name: 'Amber', hex: '#F0A93A' },
  { name: 'Cream', hex: '#F4EEDE' },
  { name: 'Emerald', hex: '#2E9E6B' },
]

export default function SafarAnbiyaPage() {
  return (
    <main className="text-indigo-50" style={{ background: '#0C0820' }}>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #0C0820 0%, #1A1140 55%, #0C0820 100%)' }}
        />
        <div
          className="absolute inset-0 opacity-80"
          style={{
            background:
              'radial-gradient(55% 45% at 20% 18%, rgba(245,196,81,0.12) 0%, transparent 60%), radial-gradient(50% 40% at 82% 80%, rgba(46,158,107,0.10) 0%, transparent 60%)',
          }}
        />

        <div className="container relative z-10 mx-auto px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-indigo-200/70 transition-colors hover:text-amber-200"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Gennoor Tech
          </Link>

          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div className="lg:col-span-7">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold text-amber-200">
                Flagship build · designed &amp; shipped end-to-end
              </div>

              <div className="mb-4 flex items-center gap-4">
                <Image
                  src="/showcase/safar-anbiya/emblem.png"
                  alt="Safar Anbiya lantern emblem"
                  width={64}
                  height={64}
                  className="h-16 w-16 object-contain drop-shadow"
                />
                <h1 className="text-4xl font-black leading-tight text-white lg:text-5xl">
                  Safar Anbiya
                </h1>
              </div>
              <p className="mb-6 text-xl font-medium text-amber-200/90">Journey of the Prophets</p>

              <p className="mb-8 max-w-xl text-lg leading-relaxed text-indigo-100/80">
                Religious education for children is usually static — text to read or videos to watch
                passively, and kids disengage. We turned the lives of all 25 prophets into something a
                5–10 year old <em>chooses</em> to open, the way they open a game: story → a moral
                choice → the real Qur&rsquo;anic verse → a quiz → a reward, wrapped in a light-and-stars
                progress ladder.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={LIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-sm font-bold text-[#1A1140] shadow-lg shadow-amber-400/25 transition-all hover:bg-amber-300"
                >
                  Explore the live product
                  <ExternalLink className="h-4 w-4" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Have an idea? Let&rsquo;s build it
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Portrait walkthrough video */}
            <div className="lg:col-span-5">
              <div className="mx-auto max-w-[300px]">
                <div
                  className="rounded-[2rem] p-2"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(245,196,81,0.25)',
                    boxShadow: '0 30px 80px -30px rgba(245,196,81,0.35)',
                  }}
                >
                  <InlineVideoPlayer
                    videoSrc={`${BLOB_URL}/videos/safar-anbiya-full.mp4`}
                    posterSrc="/showcase/safar-anbiya/screenshot-phone.png"
                    aspectClass="aspect-[9/16]"
                    posterFit="cover"
                    rounded="rounded-[1.6rem]"
                    className="shadow-none"
                  />
                </div>
                <p className="mt-3 text-center text-xs text-amber-100/60">
                  🔊 Sound on — one full journey, start to finish (4:36)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What it does ───────────────────────────────────── */}
      <section className="border-t border-white/5 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">What it does</h2>
            <p className="mb-10 max-w-2xl text-indigo-100/70">
              Every prophet is played as a sequence of nine beats — a small, complete story arc with a
              lesson, a verse and a reward.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-amber-300/30"
                >
                  <h3 className="mb-2 font-semibold text-amber-200">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-indigo-100/70">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── The journey, beat by beat ──────────────────────── */}
      <section className="border-t border-white/5 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">The journey, beat by beat</h2>
            <p className="mb-10 max-w-2xl text-indigo-100/70">
              Real screens from the running app — the prophet Adam (AS), captured live, not mockups.
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {beats.map((b) => (
                <figure key={b.img} className="group">
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                    <Image
                      src={`/showcase/safar-anbiya/beats/${b.img}`}
                      alt={`${b.label} — ${b.note}`}
                      width={300}
                      height={650}
                      className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <figcaption className="mt-2.5 px-0.5">
                    <span className="text-sm font-semibold text-amber-200">{b.label}</span>
                    <span className="mt-0.5 block text-xs text-indigo-100/55">{b.note}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture ───────────────────────────────────── */}
      <section className="border-t border-white/5 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-3 text-2xl font-bold text-white lg:text-3xl">How it&rsquo;s built</h2>
            <p className="mb-10 max-w-2xl text-indigo-100/70">
              A single installable app on the front, a swappable Azure service layer behind it, and a
              pre-generated media pipeline that keeps narration instant and offline-ready.
            </p>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
              {archLayers.map((layer, i) => (
                <div
                  key={layer.title}
                  className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/15 text-sm font-bold text-amber-300">
                    {i + 1}
                  </div>
                  <h3 className="mb-2 font-semibold text-white">{layer.title}</h3>
                  <p className="mb-4 text-sm leading-relaxed text-indigo-100/70">{layer.body}</p>
                  <div className="flex flex-wrap gap-2">
                    {layer.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-indigo-100/80"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Brand palette */}
            <div className="mt-12">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-200/50">
                Brand — twilight navy &amp; gold
              </h3>
              <div className="flex flex-wrap gap-3">
                {palette.map((c) => (
                  <div key={c.name} className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <span className="h-6 w-6 rounded-md border border-white/20" style={{ background: c.hex }} />
                    <span className="text-xs">
                      <span className="block font-semibold text-white">{c.name}</span>
                      <span className="block font-mono text-[10px] text-indigo-100/50">{c.hex}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/5 py-20">
        <div
          className="absolute inset-0 opacity-90"
          style={{ background: 'radial-gradient(60% 80% at 50% 0%, rgba(245,196,81,0.12) 0%, transparent 60%)' }}
        />
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-3xl font-black text-white lg:text-4xl">
              Got an idea sitting in a doc?
            </h2>
            <p className="mb-8 text-lg text-indigo-100/75">
              This is what we do at Gennoor Tech — we partner with small and medium businesses to
              design, build and ship real products: web &amp; mobile apps, cloud backends and AI
              features, without the agency bloat or the year-long timeline.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 text-sm font-bold text-[#1A1140] shadow-lg shadow-amber-400/25 transition-all hover:bg-amber-300"
              >
                Let&rsquo;s make it real
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                See the full product
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
