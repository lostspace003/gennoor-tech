import { Layers, Coins, ShieldCheck } from 'lucide-react'

const pledges = [
  {
    icon: Layers,
    title: 'Stack-flexible',
    blurb:
      'We’re Microsoft-strong. We’re not Microsoft-locked. Open-source Llama on your own GPU, Azure OpenAI, AWS Bedrock, Google Vertex — we recommend based on your cost, sovereignty, and compliance needs, not our partnership margins.',
  },
  {
    icon: Coins,
    title: 'Economic',
    blurb:
      'Fixed-price by default for Diagnose, Train, and Innovate. Transparent cost breakdowns in every proposal. Optimization sprints inside every Build engagement. We price what we deliver — not what we estimate.',
  },
  {
    icon: ShieldCheck,
    title: 'Consistent',
    blurb:
      'Same five-phase journey for a 30-person SMB in Nairobi and a 30,000-person bank in Riyadh. Same deliverable shape. Same senior delivery on every engagement — no juniors substituted in.',
  },
]

interface ThreePledgesProps {
  /** Optional override for the section heading (default: "How we deliver differently.") */
  heading?: string
  /** Optional override for the section subhead */
  subhead?: string
  /** When true, render compact variant with smaller padding (for use lower on a page) */
  compact?: boolean
}

export default function ThreePledges({ heading, subhead, compact = false }: ThreePledgesProps) {
  return (
    <section className={`relative ${compact ? 'py-14 lg:py-16' : 'py-20 lg:py-24'}`}>
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center max-w-3xl mx-auto ${compact ? 'mb-10' : 'mb-14'}`}>
          <div className="inline-flex items-center rounded-full px-3 py-1 mb-4 text-xs font-semibold text-primary-600 bg-primary-50/80 border border-primary-100/60">
            The Three Pledges
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {heading ?? 'How we deliver differently.'}
          </h2>
          <p className="text-lg text-gray-500 leading-relaxed">
            {subhead ??
              'Three commitments that hold across every engagement — SMB or enterprise, cloud or on-premise, single agent or organization-wide rollout.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {pledges.map((pledge) => {
            const Icon = pledge.icon
            return (
              <div
                key={pledge.title}
                className="rounded-2xl p-7 glass-card glow-border transition-all duration-500 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center mb-5 shadow-lg shadow-primary-500/15">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pledge.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pledge.blurb}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
