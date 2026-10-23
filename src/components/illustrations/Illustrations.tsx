/**
 * Small illustrations for the marketing pages. Hand-drawn SVG: one palette (ink, accent blue,
 * a touch of amber, soft tints), one stroke weight, quiet motion. Motion classes live in
 * globals.css under "illustrations" and are switched off for prefers-reduced-motion.
 */
const INK = '#1d1d1f'
const BLUE = '#0071e3'
const TINT = '#eaf2fd'
const AMBER = '#f5a524'
const GREY = '#d2d2d7'

interface Props { className?: string; title: string }

function Frame({ className, title, children }: Props & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={title} xmlns="http://www.w3.org/2000/svg">
      <title>{title}</title>
      <circle cx="60" cy="60" r="52" fill={TINT} />
      {children}
    </svg>
  )
}

const stroke = { stroke: INK, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

/** Live training: a board in front of a small group. */
export function TrainingIllustration({ className, title = 'A trainer teaching a small group' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <rect x="26" y="28" width="68" height="40" rx="5" fill="#fff" {...stroke} />
      <g className="ill-bars">
        <rect x="36" y="52" width="8" height="10" rx="1.5" fill={BLUE} opacity="0.35" />
        <rect x="50" y="44" width="8" height="18" rx="1.5" fill={BLUE} opacity="0.6" />
        <rect x="64" y="36" width="8" height="26" rx="1.5" fill={BLUE} />
      </g>
      <path d="M80 40l3 3 6-6" fill="none" {...stroke} stroke={BLUE} className="ill-tick" />
      <circle cx="40" cy="88" r="7" fill="#fff" {...stroke} />
      <path d="M30 108c0-6 4-10 10-10s10 4 10 10" fill="none" {...stroke} />
      <circle cx="60" cy="86" r="7" fill={BLUE} stroke={INK} strokeWidth="2.4" />
      <path d="M50 108c0-6 4-10 10-10s10 4 10 10" fill="none" {...stroke} />
      <circle cx="80" cy="88" r="7" fill="#fff" {...stroke} />
      <path d="M70 108c0-6 4-10 10-10s10 4 10 10" fill="none" {...stroke} />
      <circle cx="94" cy="30" r="3" fill={AMBER} className="ill-pulse" />
    </Frame>
  )
}

/** Automation: input, a working step, output, with a pulse moving along the line. */
export function AutomationIllustration({ className, title = 'A process automated from input to result' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <path d="M32 60h56" stroke={GREY} strokeWidth="2.4" strokeLinecap="round" />
      <circle r="4" cy="60" fill={BLUE} className="ill-travel" />
      <rect x="18" y="46" width="26" height="28" rx="6" fill="#fff" {...stroke} />
      <path d="M25 56h12M25 62h12M25 68h7" fill="none" {...stroke} strokeWidth="2" />
      <circle cx="60" cy="60" r="14" fill="#fff" {...stroke} />
      <g className="ill-spin">
        <circle cx="60" cy="60" r="5" fill={BLUE} />
        <path d="M60 49v4M60 67v4M49 60h4M67 60h4" fill="none" {...stroke} strokeWidth="2.4" />
      </g>
      <rect x="76" y="46" width="26" height="28" rx="6" fill="#fff" {...stroke} />
      <path d="M84 60l5 5 8-9" fill="none" {...stroke} stroke={BLUE} strokeWidth="2.8" />
      <circle cx="98" cy="38" r="3" fill={AMBER} className="ill-pulse" />
    </Frame>
  )
}

/** Learning platform: a screen with a lesson, progress and a certificate ribbon. */
export function PlatformIllustration({ className, title = 'A course on screen with progress and a certificate' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <rect x="22" y="30" width="76" height="52" rx="6" fill="#fff" {...stroke} />
      <path d="M44 90h32" fill="none" {...stroke} />
      <path d="M60 82v8" fill="none" {...stroke} />
      <circle cx="52" cy="52" r="11" fill={BLUE} />
      <path d="M49 47l9 5-9 5z" fill="#fff" />
      <path d="M70 46h20M70 53h14" stroke={GREY} strokeWidth="2.4" strokeLinecap="round" />
      <rect x="32" y="70" width="56" height="5" rx="2.5" fill={GREY} />
      <rect x="32" y="70" width="56" height="5" rx="2.5" fill={BLUE} className="ill-progress" />
      <g className="ill-float">
        <circle cx="92" cy="30" r="9" fill={AMBER} stroke={INK} strokeWidth="2.4" />
        <path d="M88 39l-2 10 6-3 6 3-2-10" fill="#fff" {...stroke} strokeWidth="2" />
      </g>
    </Frame>
  )
}

/** Step 1: we talk. */
export function TalkIllustration({ className, title = 'Two people talking' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <g className="ill-bubble-a">
        <path d="M24 34h44a6 6 0 0 1 6 6v18a6 6 0 0 1-6 6H44l-10 9v-9h-10a6 6 0 0 1-6-6V40a6 6 0 0 1 6-6z" transform="translate(0 -2)" fill="#fff" {...stroke} />
        <path d="M30 46h28M30 54h18" fill="none" {...stroke} strokeWidth="2" />
      </g>
      <g className="ill-bubble-b">
        <path d="M52 66h44a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6h-6v9l-10-9H52a6 6 0 0 1-6-6V72a6 6 0 0 1 6-6z" fill={BLUE} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
        <circle cx="62" cy="79" r="2.4" fill="#fff" /><circle cx="72" cy="79" r="2.4" fill="#fff" /><circle cx="82" cy="79" r="2.4" fill="#fff" />
      </g>
    </Frame>
  )
}

/** Step 2: we write it down. */
export function ScopeIllustration({ className, title = 'A written scope' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <path d="M38 26h30l16 16v50a4 4 0 0 1-4 4H38a4 4 0 0 1-4-4V30a4 4 0 0 1 4-4z" fill="#fff" {...stroke} />
      <path d="M68 26v16h16" fill="none" {...stroke} />
      <path d="M44 56h28" stroke={GREY} strokeWidth="2.6" strokeLinecap="round" className="ill-line l1" />
      <path d="M44 66h28" stroke={GREY} strokeWidth="2.6" strokeLinecap="round" className="ill-line l2" />
      <path d="M44 76h18" stroke={GREY} strokeWidth="2.6" strokeLinecap="round" className="ill-line l3" />
      <path d="M44 56h12" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" className="ill-line l1" />
      <path d="M44 66h20" stroke={BLUE} strokeWidth="2.6" strokeLinecap="round" className="ill-line l2" />
      <circle cx="88" cy="88" r="9" fill={AMBER} stroke={INK} strokeWidth="2.4" />
      <path d="M84 88l3 3 5-6" fill="none" {...stroke} strokeWidth="2.2" />
    </Frame>
  )
}

/** Step 3: we deliver. */
export function DeliverIllustration({ className, title = 'Work being delivered' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <path d="M24 90h72" fill="none" {...stroke} />
      <rect x="30" y="68" width="14" height="22" rx="2" fill="#fff" {...stroke} />
      <rect x="53" y="54" width="14" height="36" rx="2" fill="#fff" {...stroke} />
      <rect x="76" y="38" width="14" height="52" rx="2" fill={BLUE} stroke={INK} strokeWidth="2.4" className="ill-rise" />
      <path d="M32 54l20-12 14 6 22-20" fill="none" {...stroke} stroke={BLUE} />
      <path d="M92 28h-8M92 28v8" fill="none" {...stroke} stroke={BLUE} />
    </Frame>
  )
}

/** Step 4: we hand over. */
export function HandoverIllustration({ className, title = 'Work handed over to your team' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <circle cx="34" cy="60" r="12" fill="#fff" {...stroke} />
      <circle cx="86" cy="60" r="12" fill={BLUE} stroke={INK} strokeWidth="2.4" />
      <path d="M46 60h28" stroke={GREY} strokeWidth="2.4" strokeLinecap="round" />
      <g className="ill-pass">
        <rect x="52" y="52" width="16" height="16" rx="4" fill={AMBER} stroke={INK} strokeWidth="2.4" />
      </g>
      <path d="M80 60l4 4 7-8" fill="none" {...stroke} stroke="#fff" strokeWidth="2.6" />
    </Frame>
  )
}

/** Claude: a conversation with a spark. */
export function ClaudeIllustration({ className, title = 'A conversation with Claude' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <path d="M30 32h60a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H58l-14 12V76H30a6 6 0 0 1-6-6V38a6 6 0 0 1 6-6z" fill="#fff" {...stroke} />
      <g className="ill-spin">
        <path d="M60 40v24M48 52h24M51.5 43.5l17 17M68.5 43.5l-17 17" fill="none" stroke={BLUE} strokeWidth="3" strokeLinecap="round" />
      </g>
      <circle cx="94" cy="28" r="3" fill={AMBER} className="ill-pulse" />
    </Frame>
  )
}

/** Microsoft AI: cloud with a circuit core. */
export function CloudAiIllustration({ className, title = 'AI services in the cloud' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <path d="M38 80a14 14 0 0 1-2-27.8A20 20 0 0 1 75 48a16 16 0 0 1 5 32z" fill="#fff" {...stroke} />
      <rect x="49" y="52" width="22" height="20" rx="4" fill={BLUE} stroke={INK} strokeWidth="2.4" />
      <path d="M54 46v6M66 46v6M54 72v6M66 72v6M43 58h6M43 66h6M71 58h6M71 66h6" fill="none" {...stroke} strokeWidth="2" />
      <circle cx="60" cy="62" r="3" fill="#fff" className="ill-pulse" />
    </Frame>
  )
}

/** A smaller team. */
export function SmallTeamIllustration({ className, title = 'A small team' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <circle cx="46" cy="50" r="10" fill="#fff" {...stroke} />
      <path d="M30 86c0-10 7-16 16-16s16 6 16 16" fill="none" {...stroke} />
      <circle cx="76" cy="54" r="10" fill={BLUE} stroke={INK} strokeWidth="2.4" />
      <path d="M60 90c0-10 7-16 16-16s16 6 16 16" fill="none" {...stroke} />
      <circle cx="90" cy="32" r="3" fill={AMBER} className="ill-pulse" />
    </Frame>
  )
}

/** A larger organization: several teams. */
export function OrgIllustration({ className, title = 'Several teams in one organization' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <rect x="48" y="26" width="24" height="20" rx="5" fill={BLUE} stroke={INK} strokeWidth="2.4" />
      <path d="M60 46v12M30 58h60M30 58v10M60 58v10M90 58v10" fill="none" {...stroke} />
      <rect x="20" y="68" width="20" height="18" rx="5" fill="#fff" {...stroke} />
      <rect x="50" y="68" width="20" height="18" rx="5" fill="#fff" {...stroke} />
      <rect x="80" y="68" width="20" height="18" rx="5" fill="#fff" {...stroke} />
      <circle cx="98" cy="30" r="3" fill={AMBER} className="ill-pulse" />
    </Frame>
  )
}

/** Real examples: documents under a magnifier. */
export function ExamplesIllustration({ className, title = 'Testing on your own examples' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <rect x="26" y="30" width="44" height="56" rx="5" fill="#fff" {...stroke} />
      <path d="M34 44h28M34 54h28M34 64h16" fill="none" stroke={GREY} strokeWidth="2.6" strokeLinecap="round" />
      <g className="ill-float">
        <circle cx="76" cy="66" r="14" fill="#fff" fillOpacity="0.85" stroke={INK} strokeWidth="2.4" />
        <path d="M86 77l12 12" fill="none" {...stroke} strokeWidth="3.2" />
        <path d="M70 66l4 4 8-9" fill="none" {...stroke} stroke={BLUE} strokeWidth="2.6" />
      </g>
    </Frame>
  )
}

/** Honest about worth: a balance. */
export function BalanceIllustration({ className, title = 'Weighing whether a process is worth automating' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <path d="M60 30v54M44 88h32" fill="none" {...stroke} />
      <g className="ill-float">
        <path d="M32 44h56" fill="none" {...stroke} />
        <path d="M32 44l-8 20h16z" fill="#fff" {...stroke} />
        <path d="M88 44l-8 20h16z" fill={BLUE} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
      </g>
      <circle cx="60" cy="30" r="4" fill={AMBER} stroke={INK} strokeWidth="2.2" />
    </Frame>
  )
}

/** Not overpromising: a shield with a check, people stay in charge. */
export function ShieldIllustration({ className, title = 'Checked, with people in charge' }: Partial<Props>) {
  return (
    <Frame className={className} title={title}>
      <path d="M60 26l26 10v20c0 18-11 30-26 38-15-8-26-20-26-38V36z" fill="#fff" {...stroke} />
      <path d="M48 58l9 9 16-18" fill="none" {...stroke} stroke={BLUE} strokeWidth="3.2" className="ill-tick" />
    </Frame>
  )
}
