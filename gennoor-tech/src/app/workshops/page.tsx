import { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Users, Monitor, ArrowRight, Lock, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Workshops — Free Hands-on AI Sessions | Gennoor Tech',
  description: 'Free, hands-on AI workshops led by Microsoft Certified Trainer Jalal Khan. Join live sessions on Claude, Azure AI, Copilot Studio, and more.',
}

const workshops = [
  {
    title: 'Claude Cowork',
    description: 'Stop drowning in busywork. Ship work like an operator. A free 4-hour live workshop covering Chat vs Cowork, reports, integrations, and real-world workflows.',
    href: '/claude-cowork',
    status: 'closed' as const,
    duration: '4 hours',
    seats: '1,000',
    topics: 8,
    instructor: 'Jalal Khan',
    gradient: 'from-[#1B2845] to-[#2d4a7a]',
    accent: '#FFD23F',
  },
  {
    title: 'Azure AI Agents Bootcamp',
    description: 'Build production-ready AI agents using Azure AI Foundry, Semantic Kernel, and LangGraph. From single agents to multi-agent orchestration.',
    href: '#',
    status: 'coming_soon' as const,
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
    status: 'coming_soon' as const,
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
      <section className="relative bg-gradient-to-br from-[#0C1426] via-[#1E3A8A] to-accent-700 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-40" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-sm text-white/90 mb-6">
              <span className="w-2 h-2 bg-secondary-400 rounded-full animate-pulse" />
              Free Workshops — No Cost, No Upsell
            </div>
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Workshops
            </h1>
            <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-2xl mx-auto">
              Free, hands-on live sessions on AI tools and workflows.
              Watch demos, learn real-world applications, and level up — no matter your role.
            </p>
          </div>
        </div>
      </section>

      {/* Workshop Cards */}
      <section className="section-padding bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workshops.map((workshop) => (
                <div
                  key={workshop.title}
                  className={`group relative bg-white rounded-2xl shadow-md overflow-hidden ring-1 ring-gray-100 ${
                    workshop.status === 'coming_soon' ? 'opacity-80' : 'hover:shadow-xl hover:-translate-y-1'
                  } transition-all duration-300`}
                >
                  {/* Gradient Header */}
                  <div className={`relative h-44 bg-gradient-to-br ${workshop.gradient} p-6 flex flex-col justify-between`}>
                    <div className="flex items-start justify-between">
                      {workshop.status === 'closed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
                          <Lock className="w-3 h-3" />
                          Registration Closed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold bg-white/15 text-white/80 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-heading font-bold text-xl leading-tight">
                      {workshop.title}
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {workshop.description}
                    </p>

                    {/* Meta */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 text-primary-500" />
                        <span>{workshop.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Users className="w-4 h-4 text-primary-500" />
                        <span>{workshop.seats} seats</span>
                      </div>
                      {workshop.topics > 0 && (
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Monitor className="w-4 h-4 text-primary-500" />
                          <span>{workshop.topics} live topics</span>
                        </div>
                      )}
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-2 mb-5 text-xs text-gray-400">
                      <img
                        src="/assets/jalal-portrait.jpeg"
                        alt={workshop.instructor}
                        className="w-6 h-6 rounded-full object-cover"
                        style={{ objectPosition: '50% 20%' }}
                      />
                      <span>{workshop.instructor} — Microsoft Certified Trainer</span>
                    </div>

                    {/* CTA */}
                    <div className="pt-4 border-t border-gray-100">
                      {workshop.status === 'closed' ? (
                        <Link
                          href={workshop.href}
                          className="flex items-center justify-between text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors"
                        >
                          View Details
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ) : (
                        <span className="flex items-center justify-between text-sm font-medium text-gray-400">
                          Announcement Coming Soon
                          <Sparkles className="w-4 h-4" />
                        </span>
                      )}
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
