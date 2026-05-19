import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiStrategyChapter06: Chapter = {
  courseId: 'ai-strategy-c-suite',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-sustaining-momentum',
  title: 'Sustaining momentum',
  subtitle: 'Past the pilot, into the year — the discipline that compounds.',
  slides: [
    // SLIDE 1
    {
      title: 'Sustaining momentum',
      iconKey: 'rocket',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">Year one of an AI programme is the celebration year. Year two is the year most programmes quietly stall — and the C-suite that funded it gets quieter at strategy meetings. This chapter is how to avoid that.</p>`,
      narrationLead:
        "Welcome to chapter six. Sustaining momentum. Year one of an AI programme is the celebration year. Press release. Pilot demo. Board update. Year two — year two is the year most programmes quietly stall. And the C-suite that proudly funded year one gets noticeably quieter at strategy meetings. This chapter is how to avoid that. Three disciplines.",
    },
    // SLIDE 2
    {
      title: 'The year-two stall — why it happens',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 1 · The pattern',
      bodyHtml: `<p>The year-two stall has a specific anatomy. Recognise it. Then you can prevent it.</p>`,
      narrationLead:
        "The year-two stall has a specific anatomy. Once you recognise the shape, you can prevent it. Here's how it typically unfolds.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Pattern — the pilot worked, but production is hard',
            "The pilot ran on a clean dataset, in a sandbox, with three power users. Production runs on dirty data, across business units, with reluctant adopters. Three months in, the engineers are spending more time fighting integration than building new things."),
          narration:
            "First — the pilot worked, but production is hard. The pilot ran on a clean dataset, in a sandbox, with three power users who loved it. Production runs on dirty data, across multiple business units, with reluctant adopters. Three months in, your engineers are spending more time fighting integration issues than building anything new. The energy drains. Quietly.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Pattern — the sustainment cost is real, and surprising',
            "Year-one budget was for the build. Year-two budget needs to also cover the sustainment. If sustainment wasn't reserved (rule three from chapter 3), the new innovation budget gets robbed to pay for last year's maintenance."),
          narration:
            "Second — the sustainment cost is real, and surprising. Your year-one budget was for the build. Your year-two budget now needs to cover both the new builds and the sustainment of last year's builds. If you didn't reserve twenty percent for sustainment — and that was rule three from chapter three — then your new innovation budget gets robbed to pay for last year's maintenance. Innovation slows. Visibility drops. Stall.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Pattern — the team that built it has moved on',
            "Senior engineers love building, not maintaining. By month nine, the team that built the year-one system is restless. By month fourteen, they've moved to year-two projects. The year-one system is now owned by people who didn't build it. Resilience drops fast."),
          narration:
            "Third — the team that built it has moved on. Senior engineers love building. They don't love maintaining. By month nine, the team that built the year-one system is restless. By month fourteen, they've moved to year-two projects. Your year-one system is now owned by people who didn't build it. Resilience drops fast. So does the will to debug things at midnight.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Three disciplines that prevent the stall',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · Prevention',
      bodyHtml: `<p>Three disciplines, each set up in year one, that prevent the year-two stall. Each one is cheap individually. The cost of not having them is high.</p>`,
      narrationLead:
        "Three disciplines. Each set up in year one. Each one prevents a specific failure mode in year two. Each one is cheap. The cost of not having them is very high.",
      steps: [
        {
          html: stepCard('check', 'blue', 'Discipline 1 — Sustainment retainer from day one',
            "Lock in the sustainment retainer the day you sign the build. With the same team. Same SLA. Same point of contact. The handover from build to sustain is then a paragraph, not a project."),
          narration:
            "Discipline one. Sustainment retainer from day one. The day you sign the build contract — that same day — lock in the sustainment retainer. Same team. Same service level. Same point of contact. The handover from build to sustain is then a paragraph in the contract, not a separate project. This single change prevents most of the year-two stall.",
        },
        {
          html: stepCard('check', 'amber', 'Discipline 2 — Adoption metrics on the executive dashboard',
            "Active usage, prompts per active user, time saved per user, escalation rate. If these aren't on a dashboard the COO sees weekly, adoption is invisible — and invisible adoption shrinks. Visible adoption grows."),
          narration:
            "Discipline two. Adoption metrics on the executive dashboard. Active usage. Prompts per active user. Time saved per user. Escalation rate. If these aren't on a dashboard that the COO sees weekly, adoption is invisible. And invisible adoption shrinks — because nothing visible matters by default, and nothing invisible matters at all. Visible adoption grows. Make it visible.",
        },
        {
          html: stepCard('check', 'green', 'Discipline 3 — A standing forum',
            "Monthly, 45 minutes, four people: head of AI, sponsor exec, lead engineer, governance lead. The forum reviews adoption, the inventory, incidents, and the next wave of PoCs. It is boring. It is the most important meeting in the AI calendar."),
          narration:
            "Discipline three. A standing forum. Monthly. Forty-five minutes. Four people in the room — head of AI, the sponsor executive, the lead engineer, the governance lead. The forum reviews adoption. The inventory. Any incidents. And the next wave of proofs of concept. The forum is boring. Boring is exactly what you want. Because boring means the programme is operating — not in crisis. This is the most important meeting in your AI calendar. Defend it from being cancelled.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The compounding effect',
        "These three disciplines together turn year two from a stall into a step-up. By year three, the programme is running on its own rhythm. By year five, AI is no longer a programme — it's how the organisation operates."),
      calloutNarration:
        "The compounding effect of these three disciplines is real. Together, they turn year two from a stall into a step-up. By year three, the programme is running on its own rhythm — the meetings are routine, the funding cadence is set, the adoption is observable. By year five, AI is no longer a programme. It's how the organisation operates. That's the destination. These disciplines are how you get there.",
    },
    // SLIDE 4
    {
      title: 'Renewing the mandate — every 18 months',
      iconKey: 'flag',
      eyebrow: 'Lesson 3 · Renewal',
      bodyHtml: `<p>An AI mandate is not granted once and held forever. Every eighteen months, you renew it — at the board, with evidence, on the same template each time.</p>`,
      narrationLead:
        "An AI mandate is not granted once and held forever. Every eighteen months, you renew it. At the board. With evidence. On the same template each time. Three slides — that's the right size for the renewal narrative.",
      steps: [
        {
          html: stepCard('flag', 'blue', 'Slide 1 — What we said we would do',
            "Last 18 months: the goals, the budget, the portfolio shape. Honest about what you said — not what you wished you'd said."),
          narration:
            "Slide one. What we said we would do. Last eighteen months — the goals, the budget, the portfolio shape we committed to. Honest about what you said. Not what you wish you'd said. The board has the original deck — pretending otherwise erodes trust faster than missing a number.",
        },
        {
          html: stepCard('flag', 'amber', 'Slide 2 — What actually happened',
            "Outcomes against goals. Cash flows against budget. Adoption against forecast. Incidents and how they were handled. The honest scorecard."),
          narration:
            "Slide two. What actually happened. Outcomes against goals. Cash flows against budget. Adoption against forecast. Incidents and how they were handled. The honest scorecard. Where you outperformed, say so plainly. Where you underperformed, name it and explain it. The board respects honesty here more than spin — and they notice the difference.",
        },
        {
          html: stepCard('flag', 'green', 'Slide 3 — The next 18 months',
            "Revised portfolio shape, informed by what you learned. The asks: capital, headcount, scope expansion or contraction. A specific renewal request. A signed budget — not an approval to come back later."),
          narration:
            "Slide three. The next eighteen months. The revised portfolio shape — informed by what you learned in the previous eighteen months. The asks. Capital. Headcount. Scope expansion or contraction. And a specific renewal request. Walk out of that meeting with a signed budget for the next phase — not an approval to come back later with a more detailed paper. Boards reward decisiveness. Don't ask for permission to ask later.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 7 — board reporting.</p>`,
      narrationLead:
        "Three anchors before we move to board reporting in chapter seven.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Sustainment retainer signed day one',
            "Don't separate the build contract from the sustainment retainer. Sign both together. With the same team."),
          narration:
            "One. Sustainment retainer signed day one. Don't separate the build contract from the sustainment retainer. Sign both at the same time. With the same team. That single discipline prevents most year-two stalls.",
        },
        {
          html: stepCard('check', 'green', 'Two — Adoption metrics visible weekly',
            "Active usage, prompts per active user, time saved, escalation rate. On the executive dashboard. Invisible adoption shrinks; visible adoption grows."),
          narration:
            "Two. Adoption metrics visible weekly. Four numbers. Active usage. Prompts per active user. Time saved. Escalation rate. On the executive dashboard. Invisible adoption shrinks. Visible adoption grows. Make it visible.",
        },
        {
          html: stepCard('check', 'green', 'Three — Renew the mandate every 18 months',
            "Same three-slide template. Honest. Decisive. A signed budget at the end — not a follow-up paper."),
          narration:
            "Three. Renew the mandate every eighteen months. Same three-slide template. Honest. Decisive. And walk out with a signed budget for the next phase — not a follow-up paper.",
        },
      ],
      narrationTrail:
        "Chapter seven — what to say to your board. Specifically. With what evidence. See you there.",
    },
  ],
}
