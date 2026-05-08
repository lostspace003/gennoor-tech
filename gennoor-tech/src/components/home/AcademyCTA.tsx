import Link from 'next/link'
import { ArrowRight, BookOpen, Headphones, Award, Play } from 'lucide-react'

export default function AcademyCTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0C1426] via-[#132040] to-[#0d3b66]" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left — Text */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary-400/15 rounded-full mb-5">
                <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
                <span className="text-secondary-400 text-xs font-bold tracking-wider uppercase">100% Free</span>
              </div>

              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                Start Your AI Journey{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-secondary-400">
                  Today
                </span>
              </h2>
              <p className="text-lg text-white/70 mb-8 max-w-lg">
                Free, self-paced courses with audio narration — learn enterprise AI architecture
                and prepare for Microsoft certifications at your own pace.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="/ai-academy"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-lg hover:from-accent-600 hover:to-accent-700 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40 transition-all group"
                >
                  <Play className="w-4 h-4" />
                  Start Learning Free
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/ai-academy/ab-100"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-white/80 font-medium border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                >
                  View Course Details
                </Link>
              </div>

              <p className="text-xs text-white/40">
                No credit card required • No login needed to start • Progress saved automatically
              </p>
            </div>

            {/* Right — Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: BookOpen, label: '100% Self-Paced', desc: 'No schedules, no deadlines — learn on your own time, at your own speed', color: 'from-blue-500 to-blue-600' },
                { icon: Headphones, label: 'Built-in Audio', desc: 'Every chapter has narration so you can listen while you follow along', color: 'from-teal-500 to-teal-600' },
                { icon: Award, label: 'Cross-Device Sync', desc: 'Sign in once and pick up right where you left off on any device', color: 'from-amber-500 to-amber-600' },
                { icon: Play, label: 'Free Forever', desc: 'No paywalls, no upsells — full courses completely free, always', color: 'from-purple-500 to-purple-600' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-1">{item.label}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
