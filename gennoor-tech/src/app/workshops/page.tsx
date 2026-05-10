import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Users, Monitor, ArrowRight, Lock, Sparkles, CheckCircle, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Workshops — Free Hands-on AI Sessions | Gennoor Tech',
  description: 'Free, hands-on AI workshops led by Microsoft Certified Trainer Jalal Khan. Join live sessions on Claude, Azure AI, Copilot Studio, and more.',
}

type WorkshopStatus = 'completed' | 'coming_soon' | 'closed'

const workshops: { title: string; description: string; href: string; status: WorkshopStatus; duration: string; seats: string; topics: number; instructor: string; gradient: string; accent: string }[] = [
  {
    title: 'Claude for Productivity',
    description: '73 registered, 32 attended, 8 hands-on modules, 4.9★ Trustpilot rating. A successful free workshop on Claude Cowork — from basics to Excel, PowerPoint & Chrome integrations.',
    href: '/workshops/claude-cowork',
    status: 'completed',
    duration: '4h 17m',
    seats: '32 attended',
    topics: 8,
    instructor: 'Jalal Khan',
    gradient: 'from-[#1B2845] to-[#2d4a7a]',
    accent: '#FFD23F',
  },
  {
    title: 'Azure AI Agents Bootcamp',
    description: 'Build production-ready AI agents using Azure AI Foundry, Semantic Kernel, and LangGraph. From single agents to multi-agent orchestration.',
    href: '#',
    status: 'coming_soon',
    duration: 'TBD',
    seats: 'TBD',
    topics: 0,
    instructor: 'Jalal Khan',
    gradient: 'from-blue-900 to-blue-700',
    accent: '#60a5fa',
  },
  {
    title: 'Copilot Studio Masterclass',
    description: 'Build enterprise copilots with Microsoft Copilot Studio — from no-code chatbots to advanced plugins and integrations with M365.',
    href: '#',
    status: 'coming_soon',
    duration: 'TBD',
    seats: 'TBD',
    topics: 0,
    instructor: 'Jalal Khan',
    gradient: 'from-purple-900 to-purple-700',
    accent: '#c084fc',
  },
]

export default function WorkshopsPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0C1426] via-[#111b33] to-[#0d3b66]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-white/70 mb-6 border border-white/10"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <span className="w-1.5 h-1.5 bg-secondary-400 rounded-full animate-pulse" />
              Free Workshops — No Cost, No Upsell
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Workshops
            </h1>
            <p className="text-lg sm:text-xl text-white/50 leading-relaxed max-w-2xl mx-auto">
              Free, hands-on live sessions on AI tools and workflows.
              Watch demos, learn real-world applications, and level up — no matter your role.
            </p>
          </div>
        </div>
      </section>

      {/* Workshop Cards */}
      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {workshops.map((workshop) => (
                <div
                  key={workshop.title}
                  className={`group relative rounded-2xl overflow-hidden transition-all duration-500 glass-card glow-border ${
                    workshop.status === 'coming_soon' ? 'opacity-75' : ''
                  }`}
                >
                  {/* Gradient Header */}
                  <div className={`relative h-44 bg-gradient-to-br ${workshop.gradient} p-6 flex flex-col justify-between`}>
                    <div className="flex items-start justify-between">
                      {(() => {
                        const status: WorkshopStatus = workshop.status
                        if (status === 'completed') return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                            <CheckCircle className="w-3 h-3" />
                            Completed
                          </span>
                        )
                        if (status === 'closed') return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold bg-red-500/20 text-red-300 rounded-full border border-red-500/30 uppercase tracking-wider">
                            <Lock className="w-3 h-3" />
                            Registration Closed
                          </span>
                        )
                        return (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold bg-white/10 text-white/70 rounded-full uppercase tracking-wider">
                            <Sparkles className="w-3 h-3" />
                            Coming Soon
                          </span>
                        )
                      })()}
                    </div>
                    <h3 className="text-white font-heading font-bold text-xl leading-tight">
                      {workshop.title}
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">
                      {workshop.description}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="w-3.5 h-3.5 text-primary-500" />
                        <span>{workshop.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Users className="w-3.5 h-3.5 text-primary-500" />
                        <span>{workshop.seats} seats</span>
                      </div>
                      {workshop.topics > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Monitor className="w-3.5 h-3.5 text-primary-500" />
                          <span>{workshop.topics} live topics</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-5 text-[11px] text-gray-400">
                      <img
                        src="/assets/jalal-portrait.jpeg"
                        alt={workshop.instructor}
                        className="w-5 h-5 rounded-full object-cover"
                        style={{ objectPosition: '50% 20%' }}
                      />
                      <span>{workshop.instructor} — Microsoft Certified Trainer</span>
                    </div>

                    <div className="pt-4 border-t border-gray-100/60">
                      {(() => {
                        const status: WorkshopStatus = workshop.status
                        if (status === 'completed') return (
                          <Link
                            href={workshop.href}
                            className="flex items-center justify-between text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors"
                          >
                            <span className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              View Recap — 4.9★
                            </span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        )
                        if (status === 'closed') return (
                          <Link
                            href={workshop.href}
                            className="flex items-center justify-between text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors"
                          >
                            View Details
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          </Link>
                        )
                        return (
                          <span className="flex items-center justify-between text-sm font-medium text-gray-400">
                            Announcement Coming Soon
                            <Sparkles className="w-4 h-4" />
                          </span>
                        )
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
