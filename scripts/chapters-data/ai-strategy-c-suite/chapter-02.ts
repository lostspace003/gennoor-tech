import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiStrategyChapter02: Chapter = {
  courseId: 'ai-strategy-c-suite',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-building-the-ai-portfolio',
  title: 'Building the AI portfolio',
  subtitle: 'Diagnose, train, innovate, build, sustain — on one budget line.',
  slides: [
    // SLIDE 1 — Opening
    {
      title: 'Building the AI portfolio',
      iconKey: 'compass',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">Chapter 1 named the four patterns. This chapter is about the discipline that converts a portfolio shape into a budget line — one that survives a procurement review, a board challenge, and the inevitable internal politics.</p>`,
      narrationLead:
        "Welcome back. Chapter one named the four patterns. This chapter is about the discipline that converts a portfolio shape into a budget line. One that survives a procurement review. A board challenge. And the inevitable internal politics that show up the moment AI gets a budget line of its own.",
    },

    // SLIDE 2 — Five phases
    {
      title: 'The five phases of an AI portfolio',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · The lifecycle',
      bodyHtml: `<p>Every viable AI portfolio runs through the same five phases. Skip one, and you pay for it later — usually in the most expensive way possible.</p>`,
      narrationLead:
        "Every viable AI portfolio runs through the same five phases. And here's the part that surprises most executives. You can skip one — but you do pay for it later. And usually in the most expensive way possible. Here are the five.",
      steps: [
        {
          html: stepCard('compass', 'blue', '1 · Diagnose',
            "Stakeholder interviews, data inventory, current-state assessment. Output: a written readiness scorecard and a prioritised PoC shortlist. Cost: small. Skipping this is what produces the lab problem."),
          narration:
            "Phase one. Diagnose. Stakeholder interviews. Data inventory. A current-state assessment. The output is a written readiness scorecard and a prioritised proof-of-concept shortlist. The cost is small. And skipping this phase — that's exactly what produces the lab problem we talked about in chapter one.",
        },
        {
          html: stepCard('bookOpen', 'blue', '2 · Train',
            "The people layer. Tiered curriculum: foundational for the org, role-specific for power users, advanced for technical teams. The cheapest insurance policy you'll ever buy."),
          narration:
            "Phase two. Train. The people layer. A tiered curriculum. Foundational for the whole organisation. Role-specific for the power users. Advanced for the technical teams. Training is the cheapest insurance policy you will ever buy on an AI portfolio — and the one most often cut first when budgets tighten.",
        },
        {
          html: stepCard('lightbulb', 'amber', '3 · Innovate',
            "Three to five fixed-scope PoCs. Each with a budget, a timeline, a hypothesis, and a Go/No-Go criterion. This is where most value is proven — or disproven."),
          narration:
            "Phase three. Innovate. Three to five fixed-scope proofs of concept. Each with a budget. Each with a timeline. Each with a hypothesis, and a clear Go-Slash-No-Go criterion. This phase is where most of your AI value will actually be proven — or disproven. Embrace the no-gos. A clean no-go in week six saves you from a slow no-go in year two.",
        },
        {
          html: stepCard('rocket', 'amber', '4 · Build',
            "PoCs that earn Go become production builds. Engineering effort, integration, hardening, change management. Cost steps up — but so does the certainty."),
          narration:
            "Phase four. Build. The PoCs that earn a Go become production builds. Real engineering. Real integration. Hardening. Change management. The cost steps up significantly — but so does the certainty. You're no longer betting on whether it works. You're investing in scaling what already works.",
        },
        {
          html: stepCard('shield', 'green', '5 · Sustain',
            "After Go-Live, the work doesn't stop. Drift checks, governance, refresh cycles, model upgrades. Most consultancies disappear here. The good ones stay — on a retainer."),
          narration:
            "Phase five. Sustain. After Go-Live, the work doesn't stop. Drift checks. Governance reviews. Refresh cycles. Model upgrades as the platforms move. Most consultancies disappear at this exact moment. The good ones stay — on a retainer that's a fraction of the original build cost. If your AI partner doesn't have a sustain phase, you don't have an AI partner. You have a delivery vendor.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The pattern that compounds',
        "Diagnose → Train → Innovate → Build → Sustain. Five phases. One narrative. Sold to the board as <em>one programme</em> with optional entry and exit at each phase. Not five disconnected line items."),
      calloutNarration:
        "Here's the pattern that compounds. Diagnose, train, innovate, build, sustain. Five phases. One narrative. You sell it to the board as one programme — with optional entry and exit at each phase. Not five disconnected line items in five different budgets owned by five different people. One programme. One narrative.",
    },

    // SLIDE 3 — The economics
    {
      title: 'What this looks like on a budget line',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · Economics',
      bodyHtml: `<p>Concrete numbers — not promises. These are the bands enterprise programmes land in for a typical first 12 months. Your mileage varies by industry, regulator, and scope.</p>`,
      narrationLead:
        "Let me give you concrete numbers — not promises. These are the bands enterprise programmes land in for a typical first twelve months. Your mileage will vary by industry, regulator, and scope. But these are the ranges to anchor your thinking.",
      steps: [
        {
          html: stepCard('cog', 'blue', 'Diagnose',
            "Enterprise band: $25k–$80k. 2–4 weeks. Output is a written assessment, a maturity score across five pillars, and a prioritised PoC shortlist with price bands."),
          narration:
            "Diagnose. The enterprise band is twenty-five to eighty thousand dollars. Two to four weeks. The output is a written assessment, a maturity score across five pillars, and a prioritised PoC shortlist with price bands. If somebody quotes you more than a hundred thousand for a diagnose phase, ask hard questions.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Train',
            "Enterprise band per cohort: $25k–$120k. Depends on depth, days on site, and certification prep. Materials and recordings always included."),
          narration:
            "Train. Per cohort, the enterprise band is twenty-five to one hundred and twenty thousand. It depends on depth, on days delivered on-site, and on certification preparation. Materials and recordings should always be included. If they're not, that's a yellow flag.",
        },
        {
          html: stepCard('lightbulb', 'amber', 'Innovate (per PoC)',
            "Enterprise band: $40k–$280k per PoC. 4–10 weeks each. The wide range reflects whether the PoC is a standard pattern (lower) or industry-specific (higher)."),
          narration:
            "Innovate. Per proof of concept, the enterprise band is forty to two hundred and eighty thousand. Four to ten weeks each. The wide range reflects whether the PoC is a standard pattern — that's the lower end — or industry-specific. Loan origination, clinical documentation, citizen services — those land at the upper end.",
        },
        {
          html: stepCard('rocket', 'amber', 'Build (per programme)',
            "Enterprise build phase: $200k–$800k typical. Includes integration, hardening, security review, deployment, change management."),
          narration:
            "Build. The enterprise build phase typically lands at two hundred thousand to eight hundred thousand. This is the real engineering. Integration. Hardening. Security review. Deployment. Change management. This is where you stop spending tens of thousands and start spending hundreds of thousands — which is exactly why the diagnose and innovate phases matter so much. They're the gate.",
        },
        {
          html: stepCard('shield', 'green', 'Sustain (monthly retainer)',
            "$4k–$30k per month per system, depending on complexity and SLA. Below $4k, the retainer is theatre. Above $30k, you're paying for a build team — re-scope."),
          narration:
            "Sustain. Four to thirty thousand dollars per month, per system, depending on complexity and the service level you need. Below four thousand, the retainer is theatre — nobody can actually maintain a system on that. Above thirty thousand, you're paying for a build team. Re-scope. The right number sits in the middle.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'The 12-month enterprise band',
        "A credible enterprise AI portfolio — one diagnostic, training across 3 cohorts, 3 PoCs, 1 to production — lands roughly <strong>$500k–$1.5M in year one</strong>. That's the conversation. Anything dramatically below is under-resourced; dramatically above is over-engineered."),
      calloutNarration:
        "Here's the twelve-month enterprise band to anchor everything to. A credible AI portfolio — one diagnostic, training across three cohorts, three PoCs, one taken into production — lands roughly five hundred thousand to one and a half million dollars in year one. That's the conversation. Anything dramatically below — and you're under-resourced. Dramatically above — and you're over-engineered. Stay in the band.",
    },

    // SLIDE 4 — Sequencing
    {
      title: 'Sequencing — what to do first',
      iconKey: 'flag',
      eyebrow: 'Lesson 3 · Order of operations',
      bodyHtml: `<p>There is a wrong order. Most organisations attempt the wrong order. Here's the sequence that works.</p>`,
      narrationLead:
        "There is a wrong order to do this in. And here's the uncomfortable bit — most organisations attempt exactly the wrong order. So let me walk you through the sequence that actually works.",
      steps: [
        {
          html: stepCard('flag', 'green', 'Month 1 — Diagnose, then train the foundation',
            "Buy the diagnostic. Roll out foundational training across the whole org in parallel. Both are cheap. Both are insurance against everything that follows."),
          narration:
            "Month one. Buy the diagnostic. And in parallel, roll out foundational training across the whole organisation. Both are cheap. And both are insurance against everything that follows. Skip this and the rest of the programme drags — guaranteed.",
        },
        {
          html: stepCard('flag', 'amber', 'Months 2–4 — Run two PoCs in parallel',
            "Pick two pilots from your prioritised shortlist. Run them in parallel, not in series. You learn faster. You also identify your internal champions faster — which matters more than any technology choice."),
          narration:
            "Months two through four. Run two PoCs in parallel — not in series. Pick two from your prioritised shortlist. Running them in parallel does two things. You learn faster. And you identify your internal champions faster — which honestly matters more than any technology choice you'll make.",
        },
        {
          html: stepCard('flag', 'amber', 'Months 5–8 — Build the winner',
            "One PoC graduates to production. The other gets a clean No-Go. Build the winner properly — integration, hardening, the whole stack. Do not start a third PoC until this build is in flight."),
          narration:
            "Months five through eight. Build the winner. One of your PoCs graduates to production. The other gets a clean No-Go — and that's fine. Build the winner properly. Integration. Hardening. The whole stack. Don't start a third PoC until this build is in flight. Discipline matters here.",
        },
        {
          html: stepCard('flag', 'green', 'Months 9–12 — Sustain + scale to second wave',
            "Sustainment retainer kicks in for the Go-Live build. Second wave of PoCs starts — informed by what you've learned. The portfolio now has a heartbeat."),
          narration:
            "Months nine through twelve. The sustainment retainer kicks in for the Go-Live build. The second wave of PoCs starts. And critically — informed by what you've learned in waves one and two. The portfolio now has a heartbeat. It's no longer a project. It's a programme.",
        },
      ],
    },

    // SLIDE 5 — Takeaways
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Two anchors before chapter 3 — where we get into the unforgiving part: capital allocation.</p>`,
      narrationLead:
        "Two anchors to take with you. And then in chapter three, we get into the unforgiving part — capital allocation.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Diagnose-Train-Innovate-Build-Sustain is one programme',
            "Not five line items. One narrative, sold once, executed in sequence — with optional entry and exit at each phase."),
          narration:
            "One. Diagnose, train, innovate, build, sustain — is one programme. Not five line items. One narrative. Sold once. Executed in sequence. With optional entry and exit at each phase. That's how you defend it at the board.",
        },
        {
          html: stepCard('check', 'green', 'Two — The 12-month band is $500k–$1.5M',
            "If your year-one AI budget falls dramatically below or above this band, the portfolio shape is off. Adjust."),
          narration:
            "Two. The twelve-month band is five hundred thousand to one and a half million for a credible enterprise programme. If your year-one AI budget falls dramatically below or above this band, the portfolio shape is off. Adjust it before it gets harder to adjust.",
        },
      ],
      narrationTrail:
        "Next chapter — capital allocation. Where the money actually goes. See you there.",
    },
  ],
}
