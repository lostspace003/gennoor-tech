/**
 * Claude Partner Network (Certified) placements. Wording and badge usage follow
 * Anthropic's Partner Announcement Kit (Certified) - see
 * tasks/Gennoor-CPN-Certified-Kit/cpn/PRESENTATION-GUIDE.md. Do not paraphrase
 * the tier line, recolor the badge, or add tier/ranking claims.
 */
const PROGRAM_URL = 'https://claude.com/partners'
const TIER_LINE = 'Gennoor is Certified in the Claude Partner Network.'
const BOILERPLATE =
  'The Claude Partner Network is how Anthropic works with the firms that put Claude into production for customers. The Services Track recognizes partners for building a certified delivery team, delivering Claude use cases for clients, and proving the work through public customer references. Partners advance through Certified, Select, Preferred, and Global Premier tiers.'

const ALT = 'Claude Partner Network - Certified'

function Badge({ kind, width }: { kind: 'horizontal' | 'vertical' | 'chip'; width: number }) {
  return (
    <a href={PROGRAM_URL} target="_blank" rel="noopener" className="inline-block leading-[0]" aria-label={ALT}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/cpn/cpn-certified-${kind}.svg`} width={width} alt={ALT} className="h-auto" />
    </a>
  )
}

/** Homepage trust strip - sits under the metrics, above "trusted by". */
export function ClaudePartnerStrip() {
  return (
    <section className="py-8 border-y border-[#e8e8ed] bg-white">
      <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center">
        <Badge kind="horizontal" width={200} />
        <p className="text-[15px] font-medium text-gray-800">{TIER_LINE}</p>
      </div>
    </section>
  )
}

/** About / Company - "Partnerships & credentials". */
export function ClaudePartnerSection() {
  return (
    <section id="claude-partner-network" className="py-10 lg:py-16 relative">
      <div className="section-divider absolute top-0 left-[10%] right-[10%]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-[170px_1fr] gap-8 items-center text-center sm:text-left">
          <div className="mx-auto"><Badge kind="vertical" width={150} /></div>
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-primary-400 mb-3">Partnerships &amp; credentials</p>
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-3">Claude Partner Network</h2>
            <p className="font-semibold text-gray-900 mb-3">{TIER_LINE}</p>
            <p className="text-gray-600 leading-relaxed mb-3">{BOILERPLATE}</p>
            <p className="text-gray-600 leading-relaxed">
              Our consultants hold Claude certifications and deliver Claude solutions for clients.{' '}
              <a href={PROGRAM_URL} target="_blank" rel="noopener" className="text-primary-600 hover:underline">Learn more about the program</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Footer, every page. */
export function ClaudePartnerFooterLine() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
      <Badge kind="horizontal" width={150} />
      <p className="text-xs text-[#6e6e73]">{TIER_LINE}</p>
    </div>
  )
}
