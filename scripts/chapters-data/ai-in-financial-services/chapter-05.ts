import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFinServChapter05: Chapter = {
  courseId: 'ai-in-financial-services',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-claims-and-operations',
  title: 'Claims and operations AI',
  subtitle: 'The patterns that quietly compound across the back office — insurance claims, trade finance, ops services.',
  slides: [
    // SLIDE 1
    {
      title: 'Claims and operations AI',
      iconKey: 'cog',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Claims processing and back-office operations don’t produce dramatic board slides. They produce something the CFO loves — unit cost reduction that compounds quarter after quarter. In the next few minutes, three plays that work, the build patterns, and the discipline that keeps savings durable.</p>`,
      narrationLead:
        "Welcome to chapter five. Claims and operations AI. These patterns don't produce dramatic board slides like fraud reduction or underwriting speed. They produce something the CFO genuinely loves — unit cost reduction that compounds quarter after quarter. Boring. Durable. Funded for a decade. In the next few minutes, three plays that work, the build patterns, and the discipline that keeps the savings durable rather than evaporating in eighteen months.",
    },
    // SLIDE 2
    {
      title: 'Three operations plays that work',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · The plays',
      bodyHtml: `<p>Three plays. Each one is mature. Each one ships in four to ten weeks. Each one has visible unit cost reduction that survives a CFO review.</p>`,
      narrationLead:
        "Three operations plays. Each one is mature technology. Each one ships in four to ten weeks for a first pilot. Each one has visible unit cost reduction that survives a CFO review at the next planning cycle. Here they are.",
      steps: [
        {
          html: stepCard('cog', 'green', 'Play 1 — Claims processing AI (insurance)',
            "Document AI for claim forms, photos, repair quotes, medical records. Auto-triage by claim type and severity. Auto-pay for low-value clean cases. Escalate the rest. Cuts claims handling time by 50–70%. Insurance is the canonical use case."),
          narration:
            "Play one. Claims processing AI in insurance. Document AI for claim forms, photos, repair quotes, medical records. Auto-triage by claim type and severity. Auto-pay for low-value clean cases — typically motor claims under a certain threshold, with clear evidence. Escalate the rest. Cuts claims handling time by fifty to seventy percent for the auto-paid segment. The customer experience benefit is what insurance carriers usually advertise. The operating cost benefit is what the CFO actually pays for. Both are real.",
        },
        {
          html: stepCard('cog', 'blue', 'Play 2 — Trade finance document AI',
            "Letters of credit, bills of lading, certificates of origin. The most paper-intensive corner of BFSI. Extract structured data, cross-check against trade rules, flag exceptions. Cuts cycle time and reduces the operational risk that has historically plagued trade finance."),
          narration:
            "Play two. Trade finance document AI. Letters of credit. Bills of lading. Certificates of origin. Commercial invoices. The most paper-intensive corner of BFSI — and historically the most operationally risky. AI extracts structured data, cross-checks against trade rules and sanctions, flags discrepancies for human review. Cuts cycle time substantially. And reduces the operational risk that has plagued trade finance for decades — clerical errors that lead to delayed shipments, contested payments, or compliance breaches. The mid-cap and large corporate banking franchise often makes this play priority one.",
        },
        {
          html: stepCard('cog', 'amber', 'Play 3 — Operations service copilots',
            "An agent grounded on your operations playbook helps service-ops staff resolve customer issues — failed payments, card disputes, account queries — without escalation to specialist teams. First-call resolution rate goes up. Average handle time goes down. The unit economics shift quietly."),
          narration:
            "Play three. Operations service copilots. An agent grounded on your operations playbook helps the service operations team resolve customer issues without escalation to specialist teams. Failed payments. Card disputes. Account queries. Statement reconciliation. The copilot pulls together the customer context, the relevant procedures, and proposes the resolution. First-call resolution rate goes up. Average handle time goes down. The unit economics of the customer service operation shift quietly — and durably.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Why these three?',
        "Each one has clean inputs (documents, customer interactions), bounded outputs (a decision, an extraction, a resolution), and a clear human escalation path. The shape that makes the play durable. Other ops use cases without this shape — vendor management, internal HR, marketing automation — work less reliably."),
      calloutNarration:
        "Here's why these three plays work consistently. Each one has clean inputs — documents, customer interactions, structured forms. Each one has bounded outputs — a triage decision, a structured extraction, a customer resolution. And each one has a clear human escalation path for the cases the AI can't close. That shape is what makes the play durable. Other operations use cases without this shape — vendor management, internal HR processes, marketing automation — work less reliably in regulated BFSI. Stick to the shape. The plays that don't fit it fail more often than they succeed.",
    },
    // SLIDE 3
    {
      title: 'The build pattern — common across the three',
      iconKey: 'rocket',
      eyebrow: 'Lesson 2 · The build',
      bodyHtml: `<p>All three plays share roughly the same build pattern. Four phases. Eight to twelve weeks from kickoff to first measurable benefit. Predictable when scoped well.</p>`,
      narrationLead:
        "All three plays share roughly the same build pattern. Four phases. Eight to twelve weeks from kickoff to first measurable benefit — depending on integration complexity. Predictable when scoped well. Here are the four phases.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Phase 1 — Scope and sample (weeks 1–2)',
            "Collect 200 representative cases. Map the existing workflow. Identify the integration points and the human-escalation criteria. Define success metrics — typically processing time, error rate, unit cost."),
          narration:
            "Phase one. Scope and sample. Weeks one and two. Collect roughly two hundred representative cases from the production workflow you're targeting. Map the existing workflow step by step. Identify the integration points with the core banking or insurance platform. Define the human escalation criteria explicitly — what counts as a case the AI must escalate. Define success metrics — typically processing time, error rate, and unit cost. This phase is short but determines everything downstream. Rush it at your peril.",
        },
        {
          html: stepCard('calendar', 'blue', 'Phase 2 — Build and tune (weeks 3–6)',
            "Stand up the document AI or the agent. Iterate against the sample set. By end of week 6, the system should be hitting target accuracy on the sample. If not — the scope needs revisiting, not the build."),
          narration:
            "Phase two. Build and tune. Weeks three through six. Stand up the document AI pipeline, or the agent for service ops. Iterate against the sample set. By end of week six, the system should be hitting target accuracy on the sample. If it's not, the scope needs revisiting — usually a sub-segment of cases is more variable than the sampling captured. Going back to scope at week six is the right call. Pushing through a build that's under-performing on the sample is the wrong call.",
        },
        {
          html: stepCard('calendar', 'amber', 'Phase 3 — Integration and pilot (weeks 7–10)',
            "Wire into the production systems. Read-only first. Then write-back behind a feature flag. Pilot live with one team or one geographic region. Daily standups for week 1, weekly for the rest of the phase."),
          narration:
            "Phase three. Integration and pilot. Weeks seven through ten. Wire the system into the production banking or insurance platform. Read-only first, so the AI can be observed in production without acting. Then write-back behind a feature flag, rolled out to one team or one geographic region. Daily stand-ups for the first week of the pilot — to catch the inevitable edge cases. Weekly stand-ups for the rest of the phase. The pilot ends only when metrics have held for two consecutive weeks. Don't expand prematurely.",
        },
        {
          html: stepCard('calendar', 'green', 'Phase 4 — Scale and lock in the rhythm (weeks 11–12+)',
            "Expand to remaining teams or regions. Lock in the weekly accuracy review, the quarterly audit, and the new-pattern playbook. The rhythm is what keeps the benefit alive beyond month 18."),
          narration:
            "Phase four. Scale and lock in the operational rhythm. Weeks eleven and twelve and onward. Expand to the remaining teams or geographic regions. Lock in the weekly accuracy review meeting. The quarterly audit sample. The new-pattern playbook for when a previously unseen case type appears. This rhythm is what keeps the benefit alive beyond month eighteen — which is when most operations AI deployments quietly lose thirty percent of their benefit due to drift and atrophy. The rhythm is the prevention. Build it now.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The number to defend at the next board meeting',
      iconKey: 'target',
      eyebrow: 'Lesson 3 · Metrics',
      bodyHtml: `<p>For each play, one number to defend. Not three. One. The CFO reads one number. The board remembers one number. Pick the right one.</p>`,
      narrationLead:
        "For each play, one number to defend at the next board meeting. Not three. One. The CFO reads one number. The board remembers one number from the operations AI update. Pick the right one. Here are the three numbers for the three plays.",
      steps: [
        {
          html: stepCard('target', 'green', 'Claims — straight-through-processing rate',
            "What % of claims pay automatically without human intervention. Year-1 target: 30–45% on motor, 25–35% on health, 15–25% on commercial. The single number that captures the play's value."),
          narration:
            "Claims processing. The number is straight-through-processing rate. What percentage of claims pay automatically — without any human intervention. Year-one realistic targets — thirty to forty-five percent on motor claims. Twenty-five to thirty-five percent on health claims. Fifteen to twenty-five percent on commercial. This single number captures the play's economic value. Higher straight-through rate equals lower handling cost per claim. The board understands it without needing finance to translate.",
        },
        {
          html: stepCard('target', 'blue', 'Trade finance — cycle time on standard LCs',
            "From receipt of documents to approval — for standard letter-of-credit transactions. Year-1 target: cut from days to hours. Easy to track. Easy to defend. The trade-banking franchise will quote it for years."),
          narration:
            "Trade finance. The number is cycle time on standard letters of credit. From document receipt to approval — for standard, well-documented LC transactions. Year-one realistic target — cut from days to hours. Easy to track. Easy to defend. The trade-banking franchise will quote this number for years afterwards. Customers, particularly mid-cap corporate clients, will choose your bank over a competitor based on this number. The competitive value is real, not just the operational value.",
        },
        {
          html: stepCard('target', 'amber', 'Operations service — first-call resolution rate',
            "% of customer service interactions resolved on the first call, without escalation. Year-1 lift: 10–18 percentage points typically. Direct customer satisfaction impact. Direct operating cost impact. The two-for-one number."),
          narration:
            "Operations service copilots. The number is first-call resolution rate. The percentage of customer service interactions resolved on the first call without escalation to a specialist team. Year-one realistic lift — ten to eighteen percentage points compared to the pre-AI baseline. This is the two-for-one number. It captures customer satisfaction impact directly. And it captures operating cost impact directly. Both audiences — the customer experience team and the CFO — care about the same number. That alignment is rare and useful.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 6 — customer and advisor copilots.</p>`,
      narrationLead:
        "Three anchors before we move to customer and advisor copilots in chapter six.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three plays with the same shape',
            "Claims · trade finance documents · operations service. Clean inputs · bounded outputs · clear human escalation. The shape is the durability."),
          narration:
            "One. Three plays with the same operational shape. Claims processing. Trade finance documents. Operations service copilots. Each one has clean inputs, bounded outputs, and a clear human escalation path. The shape is what makes the plays durable. Don't reach for plays that don't have the shape.",
        },
        {
          html: stepCard('check', 'green', 'Two — 4 phases · 8–12 weeks',
            "Scope and sample → build and tune → integrate and pilot → scale and lock the rhythm. Predictable when scoped well. Rushing scope is what makes timelines slip."),
          narration:
            "Two. Four phases. Eight to twelve weeks from kickoff to first measurable benefit. Scope and sample. Build and tune. Integrate and pilot. Scale and lock the operational rhythm. Predictable when scoped well. The phase that gets rushed most often is the first one — and rushing it is what makes downstream timelines slip. Spend the time in scoping.",
        },
        {
          html: stepCard('check', 'green', 'Three — One number per play',
            "Straight-through rate · cycle time · first-call resolution. The CFO reads one number. The board remembers one. Pick the right one — and defend it consistently."),
          narration:
            "Three. One number per play, defended consistently. Straight-through processing rate for claims. Cycle time on standard LCs for trade finance. First-call resolution rate for operations service. The CFO reads one number. The board remembers one number. Pick the right one — and defend the same definition quarter after quarter. Inconsistent definitions lose budget.",
        },
      ],
      narrationTrail:
        "Chapter six — customer and advisor copilots. Where AI starts to change the customer-facing surface of the bank. See you there.",
    },
  ],
}
