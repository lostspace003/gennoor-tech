import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiSalesChapter04: Chapter = {
  courseId: 'ai-for-sales-marketing',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-proposal-generation',
  title: 'Proposal generation',
  subtitle: 'A four-block template, three accuracy guardrails, and the question of where the saved time should go.',
  slides: [
    // SLIDE 1
    {
      title: 'Proposal generation',
      iconKey: 'zap',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Proposal generation is the highest-volume time-recovery win in revenue AI. Done well, a four-day proposal cycle becomes ninety minutes — without losing accuracy or brand voice. Three guardrails make the difference.</p>`,
      narrationLead:
        "Welcome to chapter four. Proposal generation. This is the highest-volume time-recovery win in revenue AI for most teams — proposals are written constantly, take significant rep time, and follow predictable structure. Done well, a four-day proposal cycle becomes a ninety-minute one — without losing accuracy, without losing brand voice, without losing the specifics that win the deal. The cycle-time math is real and the savings compound. Three guardrails make the difference between proposals that close and proposals that embarrass. Let me cover the template and the guardrails.",
    },
    // SLIDE 2
    {
      title: 'The four-block proposal template',
      iconKey: 'bookOpen',
      eyebrow: 'Lesson 1 · The template',
      bodyHtml: `<p>Four blocks. AI fills the boilerplate. The rep refines the specifics. Use this as the operating template — even if your industry's proposal needs more sections, the four core blocks stay.</p>`,
      narrationLead:
        "Four blocks. AI fills the boilerplate inside each block by pulling CRM context, previous successful proposals, and your product catalogue. The rep then refines the specifics that make this proposal land for this particular customer. Use this as the operating template — even if your industry requires more sections like security questionnaires or regional terms, the four core blocks stay constant.",
      steps: [
        {
          html: stepCard('alertTriangle', 'amber', 'Block 1 — Problem statement',
            "Two paragraphs. Restates the customer's problem in their own language — pulled from discovery call notes, RFP text, and the prospect's public posts. Tests whether the rep actually listened during discovery."),
          narration:
            "Block one. Problem statement. Two paragraphs. Restates the customer's specific problem in their own language. AI pulls this from the discovery call notes the rep summarised in chapter seven's workflow, from any RFP text the customer sent, from the prospect's public posts about the problem. The block is short but it does the most strategic work in the proposal. The customer reading it should think — yes, they heard us. Get this block wrong and the rest of the proposal can't recover the deal. It also tests whether the rep actually listened during discovery — because the AI can only produce a good problem statement if the discovery notes have real content in them.",
        },
        {
          html: stepCard('lightbulb', 'amber', 'Block 2 — Proposed solution',
            "Three to five components, each with one paragraph of detail and one of expected outcome. AI maps customer requirements to your product catalogue. Rep checks the mapping for the deal-specific edge cases."),
          narration:
            "Block two. Proposed solution. Three to five components, each with one paragraph of detail and one paragraph of expected outcome. AI maps customer requirements from block one to your product catalogue. It writes the descriptions in your standard product language. The rep then checks the mapping for the deal-specific edge cases — does this customer actually need component four, or are we adding it because the AI saw an adjacent customer needed it? The rep cuts anything that's not directly relevant. Length discipline matters. Solutions get longer when the rep is uncertain. Tighten until every component clearly belongs.",
        },
        {
          html: stepCard('check', 'amber', 'Block 3 — Proof — case studies and outcomes',
            "Two or three relevant case studies with quantified outcomes. AI selects from your case study library based on industry, segment, and use case match. Rep validates the choice — wrong case study hurts more than no case study."),
          narration:
            "Block three. Proof. Two or three relevant case studies with quantified outcomes. AI selects from your case study library based on industry match, customer segment match, and use case match. The rep validates the choice. Critical here — a wrong case study hurts more than no case study, because the prospect notices the mismatch and now distrusts the rest of the proposal. If the AI picks a financial services case study for a healthcare customer because both used component two, that's a deal-killer. Validate every case study before it ships. Three case studies is usually the maximum — beyond that, the proof block becomes performative and stops being credible.",
        },
        {
          html: stepCard('target', 'amber', 'Block 4 — Commercials and next steps',
            "Pricing summary, terms summary, recommended next steps with dates. AI pulls pricing from CPQ or pricebook. Rep adjusts for negotiated terms — this block must never have AI-imagined numbers in it."),
          narration:
            "Block four. Commercials and next steps. Pricing summary, terms summary, recommended next steps with concrete dates. AI pulls the pricing from your CPQ system or your standard pricebook. The rep adjusts for any negotiated terms. This block must never, ever have AI-imagined numbers in it. Pricing must come from the system of record. Terms must come from the legally-approved template. If the AI is allowed to invent pricing or terms, the proposal becomes a legal exposure, not a sales document. Guardrail two in the next slide covers exactly how to enforce this.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Three guardrails that keep proposals accurate',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · The guardrails',
      bodyHtml: `<p>Three guardrails. Without them, proposal generation is a brand and legal liability. With them, it is the highest-velocity productivity win revenue AI offers.</p>`,
      narrationLead:
        "Three guardrails. Without them, AI proposal generation is a brand and legal liability waiting to surface — usually in the email forward to procurement that compares your proposal across customers. With them, proposal generation is the highest-velocity productivity win revenue AI offers. The guardrails are not optional. Build them into the workflow from day one.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Guardrail 1 — CRM grounding, not free hallucination',
            "The AI must cite the source for every customer-specific claim — discovery note, RFP question, CRM field. No customer claim without a source. Hallucinated customer detail is the proposal-killer."),
          narration:
            "Guardrail one. CRM grounding, not free hallucination. The AI must cite the source for every customer-specific claim it makes — the discovery call note, the RFP question, the CRM field. No customer-specific claim makes it into the proposal without a source the rep can verify. Modern proposal AI tools support this — you configure the model to refuse to assert customer facts not present in the source documents. If your tool can't do this, get a different tool. Hallucinated customer detail is the single biggest proposal-killer. The prospect notices the one wrong fact and assumes the whole proposal is fiction.",
        },
        {
          html: stepCard('shield', 'green', 'Guardrail 2 — A claim register the AI is bound to',
            "Your legally-approved performance claims live in a register. The AI must use them verbatim or flag for legal review. No invented benchmarks. No inflated outcomes. This is the regulatory and brand guardrail."),
          narration:
            "Guardrail two. A claim register the AI is bound to. Your legally-approved performance claims — for example reduces support ticket volume by twenty-three percent on average — live in a controlled register, vetted by your legal and product marketing teams. The AI must use them verbatim or flag for legal review before sending. No invented benchmarks. No inflated outcomes. No AI-generated percentages that nobody can defend in a regulator audit or in a customer's procurement review. This is the regulatory and brand guardrail and it is non-negotiable in any regulated industry — and increasingly expected in any industry.",
        },
        {
          html: stepCard('shield', 'green', 'Guardrail 3 — Legal review gate for first-time terms',
            "Standard pricing and standard terms flow through. The first time a non-standard commercial term appears in a proposal, the proposal blocks until legal reviews. After review, the term enters the approved library."),
          narration:
            "Guardrail three. Legal review gate for first-time terms. Standard pricing and standard contractual terms — the ones already in your approved library — flow through the AI generator without friction. The first time a non-standard commercial term appears in a proposal — for example a custom discount tier, an unusual payment cadence, a one-off SLA — the proposal blocks until your legal team reviews and approves. After legal approves, the term enters the approved library and the next time it appears it flows through. This guardrail prevents the slow drift where reps add custom terms via AI assistance and the company ends up with five hundred quietly different contracts across customers — which is what happened to several large enterprises in 2024 and 2025. Build the gate.",
        },
      ],
      calloutHtml: calloutBlock('alertTriangle', 'warning', 'The guardrail that fails first',
        "Guardrail 1 — CRM grounding — fails first in most deployments. The vendor demos a tool with grounding 'available' but not configured by default. Verify it's actually configured before going live."),
      calloutNarration:
        "The guardrail that fails first in most deployments. Guardrail one — CRM grounding. The vendor demos a tool with grounding available in their feature list but not configured to be required by default in your tenant. The team starts using it without grounding because it's faster — and a quarter later, a proposal goes out with three customer specifics that were AI-hallucinated. Verify grounding is actually configured and actually enforced before the first proposal ships from the production workflow. This is the single highest-risk configuration miss in proposal AI tools.",
    },
    // SLIDE 4
    {
      title: 'Where the saved time should go',
      iconKey: 'rocket',
      eyebrow: 'Lesson 3 · The reinvestment',
      bodyHtml: `<p>Proposal cycle time drops from days to hours. The question nobody asks — where does the saved time go? If you don't answer it explicitly, the rep finds something to fill it with that isn't selling.</p>`,
      narrationLead:
        "Proposal cycle time drops from four days to ninety minutes when this works. That is real time recovered — typically eight to twelve hours per rep per week in proposal-heavy roles. The question nobody asks in the rollout meeting — where does that recovered time actually go? If you don't answer the question explicitly, the rep finds something to fill the time with that isn't selling. Three explicit reinvestments worth committing to.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Reinvestment 1 — Better discovery calls',
            "More time per discovery means fewer disqualifications mid-cycle, deeper problem statements in the next proposal, better case-study fit. Compounds the proposal quality. Highest-return reinvestment available."),
          narration:
            "Reinvestment one. Better discovery calls. Reps use the recovered hours to do longer, better-prepared discovery calls earlier in the cycle. Better discovery produces better problem statements in the next proposal — block one in the template — which closes deals at higher rates and reduces mid-cycle disqualifications. The reinvestment compounds the proposal quality directly. This is the highest-return reinvestment available to revenue teams using proposal AI well.",
        },
        {
          html: stepCard('compass', 'blue', 'Reinvestment 2 — Existing-customer expansion conversations',
            "Reps in many B2B businesses neglect expansion because the proposal cycle for new logos consumes the calendar. Recovered time goes to QBRs and expansion mapping with existing customers. Highest-NPS-impact reinvestment."),
          narration:
            "Reinvestment two. Existing-customer expansion conversations. Reps in many B2B businesses neglect expansion conversations because the proposal cycle for new logos consumes the calendar. The recovered time goes to quarterly business reviews with existing customers — done substantively instead of as a check-the-box meeting — and to mapping the expansion opportunities inside accounts already in your base. This is the highest-NPS-impact reinvestment because existing customers feel heard. It is also the highest-net-revenue-retention reinvestment for most companies.",
        },
        {
          html: stepCard('zap', 'blue', 'Reinvestment 3 — Coaching, not just selling',
            "Senior reps use recovered time to coach junior reps actively — through call reviews, deal strategy sessions, joint discovery. Team performance compounds. Hardest to implement; highest team-level return."),
          narration:
            "Reinvestment three. Coaching, not just selling. Senior reps use the recovered time to coach junior reps actively — through call reviews using the AI transcripts from chapter seven, through deal strategy sessions on real opportunities, through joint discovery calls where the senior rep teaches by demonstration. Team performance compounds in a way that single-rep productivity gains cannot match. This is the hardest reinvestment to implement because senior reps default to selling more themselves rather than coaching, but it has the highest team-level return — and it makes the team durable across rep turnover. Worth designing the comp plan to make coaching count.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter five — content production at scale, on brand.</p>`,
      narrationLead:
        "Three anchors before chapter five — content production at scale, on brand.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four blocks',
            "Problem statement · proposed solution · proof · commercials and next steps. AI fills the boilerplate. The rep refines deal-specific specifics. Length discipline matters in every block."),
          narration:
            "One. Four blocks. Problem statement in the customer's own language. Proposed solution mapped from requirements to your catalogue. Proof through two or three relevant case studies, with the rep validating the match. Commercials and next steps with concrete dates and system-sourced pricing. AI fills the boilerplate. The rep refines the deal-specific specifics. Length discipline matters in every block — solutions get verbose when reps are uncertain.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three guardrails',
            "CRM grounding (no hallucinated customer facts) · claim register (legally-approved performance claims only) · legal review gate for first-time non-standard terms. Non-negotiable in any regulated industry; expected in every industry."),
          narration:
            "Two. Three guardrails. CRM grounding — the AI cites the source for every customer-specific claim, no hallucinated customer facts. Claim register — performance claims come from a legally-approved register, no invented percentages. Legal review gate for the first appearance of any non-standard commercial term — after approval the term enters the library. Non-negotiable in regulated industries. Expected in every industry. Build them on day one.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three reinvestments',
            "Better discovery calls · existing-customer expansion · senior-rep coaching of juniors. Answer the where-does-the-time-go question explicitly, or the time gets absorbed into non-selling activity."),
          narration:
            "Three. Three explicit reinvestments for the recovered time. Better discovery calls — compounds proposal quality. Existing-customer expansion conversations — drives net revenue retention. Senior-rep coaching of juniors — compounds team performance and creates durability. Answer the where-does-the-time-go question explicitly when you roll out the tool. If you don't, the recovered time absorbs into administrative work and the productivity gain shows up in cycle time but not in pipeline.",
        },
      ],
      narrationTrail:
        "Chapter five — content production at scale, on brand. The brand voice anchor and the four brand risks nobody talks about until they bite. See you there.",
    },
  ],
}
