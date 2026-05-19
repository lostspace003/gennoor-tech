import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const genAiBizChapter07: Chapter = {
  courseId: 'generative-ai-for-business',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-measuring-success',
  title: 'Measuring success in steady state',
  subtitle: 'The metrics that survive once the pilot is over — and the rhythm that keeps them honest.',
  slides: [
    // SLIDE 1
    {
      title: 'Measuring success in steady state',
      iconKey: 'target',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">The pilot metrics worked because they were intense. The steady-state metrics need to work because they're sustainable. In the next few minutes, the four numbers to report, the cadence, and the conversation those numbers unlock with finance.</p>`,
      narrationLead:
        "Welcome to chapter seven. Measuring success in steady state. The pilot metrics worked because they were intense — daily check-ins, weekly reviews, three named metrics. The steady-state metrics need to work because they're sustainable. Reported with less effort. Defensible across quarters. In the next few minutes, the four numbers to report, the right cadence, and the conversation those numbers unlock with finance.",
    },
    // SLIDE 2
    {
      title: 'The four steady-state numbers',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · The numbers',
      bodyHtml: `<p>Four numbers. Trended over quarters — not snapshot. Reported monthly to the team, quarterly to the sponsor.</p>`,
      narrationLead:
        "Four numbers. Trended over quarters — not as a snapshot. Reported monthly to the team. Quarterly to your sponsor and to finance. Together they tell the story of whether the investment is compounding or evaporating.",
      steps: [
        {
          html: stepCard('target', 'blue', '1 · Active weekly users',
            "Percentage of licensed users who used the tool last week. The single most important steady-state metric. Below 50% — investigate. Below 30% — intervene."),
          narration:
            "Number one. Active weekly users. The percentage of licensed users who actually used the tool last week — not last month, last week. The single most important steady-state metric. Below fifty percent — investigate why. Below thirty percent — actively intervene. Above seventy percent — the team has internalised the tool. Above eighty percent — you have a genuinely high-adoption team and the investment is compounding. This number is the heartbeat of the deployment.",
        },
        {
          html: stepCard('target', 'green', '2 · Hours saved per active user per week',
            "Reported by the team — self-assessed, but with a clear methodology. Realistic year-1 target: 3–6 hours per active user per week. Track honestly. Self-reported numbers above 8 hours are usually optimism."),
          narration:
            "Number two. Hours saved per active user per week. Reported by the team — self-assessed, but with a clear shared methodology that the team and finance agreed on at the start. Realistic year-one targets are three to six hours per active user per week. Track honestly. Self-reported numbers above eight hours are usually optimism rather than reality. The CFO knows this — present numbers in the realistic band and the conversation goes well. Inflate them and you lose the next budget cycle.",
        },
        {
          html: stepCard('target', 'amber', '3 · Prompts saved and shared',
            "How many prompts are in the team library? How many are being added per month? A growing library is a sign of compounding capability. A static library is a sign of plateau."),
          narration:
            "Number three. Prompts saved and shared in the team library. How many prompts are in the library now. How many are being added per month. A growing library is a sign that the team is compounding capability — finding new uses, sharing them with each other, building shared muscle. A static library — one that hasn't added prompts in two months — is a sign of plateau. The team has stopped learning. Investigate. Restart the office hours. Reinvigorate the champion role.",
        },
        {
          html: stepCard('target', 'red', '4 · Net Promoter Score from the team',
            "Quarterly, anonymous. “Would you recommend this tool to a peer in another team?” Above +30 — strong. 0 to +30 — fine. Below 0 — the team is unhappy and you need to know why."),
          narration:
            "Number four. Net Promoter Score from the team itself. Quarterly. Anonymous. One question — would you recommend this tool to a peer in another team in our organisation. Above plus thirty is strong — the team is genuinely advocating. Zero to plus thirty is fine — the team uses the tool but isn't actively recommending. Below zero is a problem — the team is unhappy and you need to know why before the unhappiness becomes attrition or quiet sabotage. The NPS catches things the other three numbers miss.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Four numbers · one page · trended',
        "All four numbers on one page. Trended over the last four quarters. Sent to the sponsor and finance one week before the quarterly review. The review is for decisions — not for reading numbers aloud. Same discipline as the board pack in the strategy course."),
      calloutNarration:
        "Discipline. All four numbers on one page. Trended over the last four quarters. Sent to your sponsor and to finance one week before the quarterly review meeting. The review meeting is for decisions — not for reading the numbers aloud. This is the same discipline as the board pack from the strategy course — just at the team level. The discipline travels up and down. A team that reports this way to the sponsor is preparing for the sponsor to one day report up using the same shape. Habits propagate.",
    },
    // SLIDE 3
    {
      title: 'The cadence — monthly internal, quarterly external',
      iconKey: 'calendar',
      eyebrow: 'Lesson 2 · Cadence',
      bodyHtml: `<p>Two cadences. Different audiences. Different formats. Don’t conflate them — and don’t skip either one.</p>`,
      narrationLead:
        "Two cadences. Different audiences. Different formats. Don't conflate them — and don't skip either one. They do different jobs.",
      steps: [
        {
          html: stepCard('calendar', 'blue', 'Monthly — internal team review',
            "20 minutes at the start of the monthly team meeting. The four numbers, with light commentary. The champion presents. The team sees their own data. Self-correction happens naturally."),
          narration:
            "Monthly. Internal team review. Twenty minutes at the start of the monthly team meeting. The four numbers, with light commentary from the champion. The team sees their own data — what they're collectively producing, where they're plateauing. Self-correction happens naturally when the team owns the data. Don't make this a manager-led performance review. Make it a team-led operational review. The framing matters.",
        },
        {
          html: stepCard('calendar', 'amber', 'Quarterly — external sponsor review',
            "30 minutes with the sponsor and finance. Same one-page numbers. Plus three narrative paragraphs — what changed, what we learned, the ask for the next quarter. Decisions made in the meeting, not after."),
          narration:
            "Quarterly. External sponsor and finance review. Thirty minutes with your sponsor and your finance partner. Same one-page numbers — submitted a week ahead, not read aloud in the meeting. Plus three short narrative paragraphs. What changed in the last quarter. What we learned. The ask for the next quarter. Decisions made in the meeting itself — not deferred to a follow-up paper. This is the discipline that keeps the investment funded across cycles. Skip this meeting or weaken the narrative, and the next budget conversation goes differently.",
        },
        {
          html: stepCard('calendar', 'green', 'Annually — the renewal conversation',
            "Once a year, a longer meeting — typically before the budget cycle. The full year in numbers. The asks for the next year — additional licenses, expanded use cases, deeper integration. Specific. Funded. Owned."),
          narration:
            "Annually. The renewal conversation. Once a year — typically held in the month before the budget cycle starts. A longer meeting. The full year of numbers in trend. The asks for the next year — additional licenses, expanded use cases, deeper integration with other systems. Specific. Funded. Owned by a named person. This is the meeting that decides whether the team's AI investment scales, holds, or shrinks. Prepare for it months in advance. The data builds the case. The discipline builds the credibility.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The two conversations these metrics unlock',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · Conversations',
      bodyHtml: `<p>The metrics aren’t the goal. They’re the proof that funds two specific conversations.</p>`,
      narrationLead:
        "The metrics aren't the goal. The metrics are the proof that funds two specific conversations with two specific audiences. Both conversations move budget. Both conversations decide whether the team's AI capability compounds across years.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — With finance',
            "“Here are the hours saved across the team in the last year. Here's what that's worth at fully-loaded cost. Here's the budget we're asking for next year — and what it would add.” Specific. Defensible. Honest."),
          narration:
            "Conversation one. With finance. Here are the hours saved across the team in the last year — based on the agreed methodology. Here's what that's worth at fully-loaded cost. Here's the budget we're asking for next year — and here's what that budget would specifically add. Specific. Defensible. Honest. Finance partners respond well to this kind of framing — it gives them the math they need to defend the budget to the CFO. Make their job easy and they advocate for you.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 2 — With your sponsor about scale',
            "“The team is at 75% adoption and 5 hours saved per user. We're ready to scale this beyond our team — either to similar teams, or to a deeper use case. Here's the proposal.” The metrics earn you the right to scope the next phase."),
          narration:
            "Conversation two. With your sponsor — specifically about scale. The team is at seventy-five percent adoption. Hours saved per user is at five hours per week. We're ready to scale this beyond our team. Either to similar teams in the organisation. Or to a deeper use case within our own team. Here's the proposal. The metrics earn you the right to scope the next phase. Without the metrics, you'd be pitching a vision. With them, you're presenting a track record. The conversation is fundamentally different.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 7 · Takeaways',
      bodyHtml: `<p>Three anchors before the capstone.</p>`,
      narrationLead:
        "Three anchors before we land it in the capstone chapter.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four numbers, on one page, trended',
            "Active weekly users · hours saved · prompts in library · team NPS. Trended over four quarters. The single page is the discipline."),
          narration:
            "One. Four numbers, on one page, trended over four quarters. Active weekly users. Hours saved per active user per week. Prompts in the team library. Team NPS quarterly. The single page is the discipline. Sent a week before the quarterly review. The review is for decisions.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three cadences, different audiences',
            "Monthly internal · quarterly sponsor + finance · annual renewal. Don't conflate them. Don't skip them."),
          narration:
            "Two. Three cadences. Monthly internal team review for self-correction. Quarterly sponsor and finance review for funding the next quarter. Annual renewal conversation for funding the next year. Don't conflate them — they do different jobs. Don't skip any one — each one's absence is felt later.",
        },
        {
          html: stepCard('check', 'green', 'Three — The metrics fund the next conversation',
            "Finance conversation about value · sponsor conversation about scale. Both need the same metrics. Both decide whether the capability compounds."),
          narration:
            "Three. The metrics fund the next conversation. The finance conversation about value delivered. The sponsor conversation about scale to the next phase. Both conversations need the same metrics. Both conversations decide whether the team's AI capability compounds across years — or quietly evaporates. The metrics matter because the conversations matter.",
        },
      ],
      narrationTrail:
        "Final chapter — your 90-day GenAI plan for managers. Where everything we've covered lands as something you can start on Monday. See you there.",
    },
  ],
}
