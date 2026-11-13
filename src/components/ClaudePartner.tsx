/**
 * Claude Partner Network (Certified) placements. Wording and badge usage follow
 * Anthropic's Partner Announcement Kit (Certified) - see
 * tasks/Gennoor-CPN-Certified-Kit/cpn/PRESENTATION-GUIDE.md. Do not paraphrase
 * the tier line, recolor the badge, or add tier/ranking claims.
 */
export const PROGRAM_URL = 'https://claude.com/partners'
export const TIER_LINE = 'Gennoor is Certified in the Claude Partner Network.'
export const BOILERPLATE =
  'The Claude Partner Network is how Anthropic works with the firms that put Claude into production for customers. The Services Track recognizes partners for building a certified delivery team, delivering Claude use cases for clients, and proving the work through public customer references. Partners advance through Certified, Select, Preferred, and Global Premier tiers.'

const ALT = 'Claude Partner Network - Certified'

function Badge({ kind, width }: { kind: 'horizontal' | 'vertical' | 'chip'; width: number }) {
  return (
    <span className="inline-block leading-[0] overflow-hidden rounded-[inherit]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/cpn/cpn-certified-${kind}.svg`} width={width} alt={ALT} className="h-auto" />
    </span>
  )
}

/** Homepage trust strip - sits under the metrics, above "trusted by". */
export function ClaudePartnerStrip() {
  return (
    <section className="py-8 border-y border-gray-200 bg-surface">
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
          </div>
        </div>
      </div>
    </section>
  )
}

/** Footer, every page. */
export function ClaudePartnerFooterLine() {
  return (
    <div className="mt-8 flex justify-center">
      <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-[12px] bg-[#f0eee6] pl-0 pr-5 py-0">
        <Badge kind="horizontal" width={130} />
        <p className="text-xs font-medium text-[#141413]">{TIER_LINE}</p>
      </div>
    </div>
  )
}

/** Partner line at the top of every inner page: a clear pill, centred above the page. */
export function ClaudePartnerBar() {
  return (
    <div className="flex justify-center px-4 pt-14 lg:pt-5 pb-1">
      <div className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-[14px] bg-[#f0eee6] pl-0 pr-5 py-0 shadow-[0_2px_10px_rgba(20,20,19,0.07)]">
        <Badge kind="horizontal" width={150} />
        <p className="text-[14.5px] font-semibold text-[#141413]">{TIER_LINE}</p>
      </div>
    </div>
  )
}

/** The badge and the approved line as one small card, to sit above a headline. It does not centre itself. */
export function ClaudePartnerInline() {
  return (
    <a href={PROGRAM_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3.5 text-left">
      <span className="shrink-0 rounded-[12px] bg-[#f0eee6] leading-[0] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] transition-transform group-hover:-translate-y-0.5">
        <Badge kind="horizontal" width={132} />
      </span>
      <span className="max-w-[210px] text-[13.5px] font-medium leading-[1.4] text-gray-600">{TIER_LINE}</span>
    </a>
  )
}

/** Hero block: badge and the approved line, centred, directly under the headline. */
export function ClaudePartnerHero() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Badge kind="horizontal" width={300} />
      <p className="text-[16px] font-medium text-gray-800">{TIER_LINE}</p>
    </div>
  )
}
