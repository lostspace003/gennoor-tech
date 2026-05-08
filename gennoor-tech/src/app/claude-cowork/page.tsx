import { Metadata } from 'next'
import { Sparkles, Clock, Users, Monitor, Lock } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Claude Cowork — Free Workshop | Gennoor Tech',
  description: 'A free 4-hour live workshop on Claude Cowork. Learn how to ship work like an operator. Registration is now closed.',
}

const topics = [
  'Chat vs Cowork — when to use what',
  'Build reports, briefs & dashboards in minutes',
  'Automate repetitive tasks with Claude',
  'Integrations — Slack, Google Drive, GitHub & more',
  'Real-world workflows for every role',
  'Prompt engineering for operators',
  'Claude for teams — collaboration patterns',
  'Live Q&A with the instructor',
]

export default function ClaudeCoworkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F1729] via-[#1B2845] to-[#0F1729]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#FFD23F] rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FF6B35] rounded-full blur-[150px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 text-sm font-bold px-4 py-2 rounded-full mb-6 border border-red-500/30">
              <Lock className="w-4 h-4" />
              Registration Closed
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight">
              Claude <span className="text-[#FFD23F]">Cowork</span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/80 font-medium mb-6">
              Stop drowning in busywork.<br className="hidden sm:block" />
              Ship work like an operator.
            </p>

            <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
              A free 4-hour live workshop — sit back, watch demos, and see how Claude Cowork transforms the way you work.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {[
                { icon: Clock, label: '4 hours intensive' },
                { icon: Monitor, label: '8 live topics' },
                { icon: Users, label: '1000 seats' },
              ].map(pill => (
                <div key={pill.label} className="flex items-center gap-2 bg-white/10 text-white/80 px-4 py-2 rounded-full text-sm font-medium">
                  <pill.icon className="w-4 h-4 text-[#FFD23F]" />
                  {pill.label}
                </div>
              ))}
            </div>

            {/* Instructor */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <img
                src="/assets/jalal-portrait.jpeg"
                alt="Jalal Khan"
                className="w-16 h-20 rounded-xl object-cover"
                style={{ objectPosition: '50% 20%', boxShadow: '0 4px 16px rgba(0,0,0,.3)' }}
              />
              <div className="text-left">
                <p className="text-white font-bold">Jalal Khan</p>
                <p className="text-[#FFD23F] text-sm font-semibold">Microsoft Certified Trainer</p>
                <p className="text-white/50 text-xs">14+ years | 6 countries | 80+ programs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">What You&apos;ll Learn</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {topics.map((topic, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4"
              >
                <Sparkles className="w-4 h-4 text-[#FFD23F] mt-0.5 shrink-0" />
                <span className="text-white/80 text-sm">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration Closed Form */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-lg mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Greyed-out form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 select-none" aria-disabled="true">
              <h3 className="text-xl font-bold text-white/30 mb-6 text-center">Registration Form</h3>

              <div className="space-y-4">
                {['Full Name', 'Email', 'Country', 'Time Zone', 'Role / Designation', 'Company'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-white/20 mb-1">{field}</label>
                    <div className="w-full h-10 bg-white/5 rounded-lg border border-white/10 cursor-not-allowed" />
                  </div>
                ))}

                <div>
                  <label className="block text-sm font-medium text-white/20 mb-1">Biggest workflow challenge</label>
                  <div className="w-full h-24 bg-white/5 rounded-lg border border-white/10 cursor-not-allowed" />
                </div>

                <button
                  disabled
                  className="w-full py-3 bg-white/10 text-white/30 font-bold rounded-full cursor-not-allowed text-sm"
                >
                  Registration Closed
                </button>
              </div>
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl">
              <div className="text-center px-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Registration Closed</h3>
                <p className="text-white/60 text-sm mb-6">
                  All 1,000 seats have been filled. Thank you for the overwhelming response!
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#FF6B35] hover:bg-[#e55a25] text-white font-bold rounded-full transition-colors text-sm"
                >
                  Contact Us for Future Events
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
