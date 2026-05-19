import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiStrategyChapter07: Chapter = {
  courseId: 'ai-strategy-c-suite',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-board-reporting',
  title: 'Board reporting',
  subtitle: 'What to say, how often, and with what evidence — without becoming the AI bore.',
  slides: [
    // SLIDE 1
    {
      title: 'Board reporting',
      iconKey: 'flag',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Boards now expect AI on the agenda — but only directors close to AI know what they actually want to hear. The rest are quietly hoping you'll arrive prepared. This chapter gives you the four numbers, the four narratives, and the cadence that makes boards trust the programme.</p>`,
      narrationLead:
        "Welcome to chapter seven. Board reporting. Most boards now expect AI on the agenda. But only the directors who happen to be close to AI know what they actually want to hear. The rest are quietly hoping that you, the executive sponsor, will arrive prepared. So this chapter gives you the four numbers, the four narratives, and the cadence that makes boards trust the programme. Trust — that's the actual product of good board reporting.",
    },
    // SLIDE 2
    {
      title: 'The four numbers that matter',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · Metrics',
      bodyHtml: `<p>Boards do not want fifty AI metrics. They want four. Pick these four. Defend them. Report them every quarter.</p>`,
      narrationLead:
        "Boards do not want fifty AI metrics. They want four. The right four — picked deliberately and defended consistently — are worth more than a dashboard of fifty. Here are the four.",
      steps: [
        {
          html: stepCard('target', 'blue', '1 · Portfolio spend versus outcomes',
            "Of last quarter's AI spend, what percentage has measurable, defensible business outcomes attached? Target: above 60%. Below 50%: alarm bell."),
          narration:
            "Number one. Portfolio spend versus outcomes. Of last quarter's AI spend, what percentage has a measurable, defensible business outcome attached. Target — above sixty percent. Below fifty percent is an alarm bell. The board wants this number. They want the trend. They do not want excuses for why it's not measurable.",
        },
        {
          html: stepCard('users', 'amber', '2 · Active adoption (across licenced users)',
            "Of licenced users, what percentage actually used the AI tools last week? Target: above 50% for productivity tools, above 70% for embedded agents. Anything below 30% triggers a review."),
          narration:
            "Number two. Active adoption — across licenced users. Of the people who have been given licences, what percentage actually used the AI tools last week. Target — above fifty percent for productivity tools. Above seventy percent for embedded agents. Anything below thirty percent triggers a board-level review. Because at that point, you're paying for licences that aren't being used.",
        },
        {
          html: stepCard('shield', 'green', '3 · Incidents and how they were handled',
            "Number of incidents in the quarter. Their tier. Time to detect, time to contain, lessons captured. A board wants to see this — and respects the firm that reports them honestly, not the firm that claims zero."),
          narration:
            "Number three. Incidents — and how they were handled. The number in the quarter. Their tier. Time to detect. Time to contain. Lessons captured. Now — a board wants to see this number. And they respect the firm that reports incidents honestly far more than the firm that claims zero. Zero is suspicious. One or two well-handled incidents demonstrate that your incident response actually works.",
        },
        {
          html: stepCard('rocket', 'blue', '4 · Forward pipeline',
            "PoCs in flight (with budget, hypothesis, Go/No-Go date). Builds in flight (with milestones). Sustainment retainers active. The board sees the heartbeat — not just the past."),
          narration:
            "Number four. Forward pipeline. Proofs of concept in flight — with budget, hypothesis, and the Go-Slash-No-Go date. Builds in flight — with milestones. Sustainment retainers active. The board sees the heartbeat of the programme. Not just the past quarter's outcomes — but where the next quarter's outcomes are coming from. That's what builds confidence.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'A single page is enough',
        "The four numbers fit on one page — with their three-quarter trend. Send the page to the board pack one week before the meeting. The discussion in the room is then about decisions, not about numbers."),
      calloutNarration:
        "Here's the practical advice. The four numbers fit on one page — with their three-quarter trend. Send the page to the board pack one week before the meeting. The discussion in the room is then about decisions — not about numbers. That distinction is everything. Decisions are what a board is for. Reading numbers aloud is what kills board attention.",
    },
    // SLIDE 3
    {
      title: 'The four narratives — what to actually say',
      iconKey: 'bookOpen',
      eyebrow: 'Lesson 2 · Narratives',
      bodyHtml: `<p>Numbers without narrative is noise. Four narratives, one per number, that make the data mean something.</p>`,
      narrationLead:
        "Numbers without narrative is noise. So you pair each of the four numbers with a short narrative. Two sentences. Maximum. Here are the four narratives — one per number.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', 'Narrative 1 — The outcomes story',
            "“Last quarter, X of the Y dollars we spent on AI was attached to a measurable outcome. The outcomes were [name them in plain English]. The Z% that wasn't attached — here's why, and here's what we're doing.”"),
          narration:
            "Narrative one. The outcomes story. Last quarter, X of the Y dollars we spent on AI was attached to a measurable outcome. The outcomes were — and then you name them in plain English. Loan processing time down by twenty-eight percent. Month-end close from five days to two days. The Z percent that wasn't attached — here's why, and here's what we're doing about it. Two sentences. Direct.",
        },
        {
          html: stepCard('bookOpen', 'amber', 'Narrative 2 — The adoption story',
            "“We have X licences active. Y% are in regular use. The teams ahead of the curve are [name them]. The teams behind are [name them], and here's what we're trialling to lift them.”"),
          narration:
            "Narrative two. The adoption story. We have X licences active. Y percent are in regular use. The teams ahead of the curve are — and you name them. Sales operations. Finance. The teams behind are — and you name them honestly. Customer service in the southern region. Procurement. And here's what we're trialling to lift them. Specific. Honest. Action-oriented.",
        },
        {
          html: stepCard('bookOpen', 'green', 'Narrative 3 — The incidents story',
            "“We had X incidents last quarter — Y high-tier, Z medium-tier. Each was contained within our SLA. Lessons captured were [name two]. The independent tabletop in Q[N] surfaced [findings] — here's what we changed.”"),
          narration:
            "Narrative three. The incidents story. We had X incidents last quarter. Y high-tier. Z medium-tier. Each was contained within our service level agreement. Lessons captured were — and you name two. The independent tabletop in this quarter or last quarter surfaced these findings — and here's what we changed as a result. Board members love this narrative when it's honest. They become uneasy when it's silent.",
        },
        {
          html: stepCard('bookOpen', 'blue', 'Narrative 4 — The pipeline story',
            "“We have X PoCs in flight, Y builds underway, Z sustainment retainers active. Our biggest bet this quarter is [name it]. Our biggest risk this quarter is [name it]. Here's the next decision point — and the date.”"),
          narration:
            "Narrative four. The pipeline story. We have X proofs of concept in flight. Y builds underway. Z sustainment retainers active. Our biggest bet this quarter is — and you name it. Our biggest risk this quarter is — and you name it. Here's the next decision point — and the specific date by which we need a decision. This narrative leaves the board with no doubt about where you're going next. And about where they need to pay attention.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The cadence',
      iconKey: 'calendar',
      eyebrow: 'Lesson 3 · Rhythm',
      bodyHtml: `<p>Three different audiences. Three different cadences. Don't conflate them — each one matters in its own right.</p>`,
      narrationLead:
        "Three different audiences. Three different cadences. Don't conflate them. Each one matters on its own. Here are the three.",
      steps: [
        {
          html: stepCard('calendar', 'blue', 'Weekly — the executive sponsor',
            "Fifteen minutes. Adoption metrics + the week's blockers. Just the sponsor and the head of AI. The point is fast course-correction, not formal reporting."),
          narration:
            "Weekly. The executive sponsor. Fifteen minutes. Adoption metrics. The week's blockers. Just the sponsor and the head of AI. The point of this meeting is fast course-correction — not formal reporting. Treat it like a stand-up, not a steering committee. Keep it short. Keep it useful.",
        },
        {
          html: stepCard('calendar', 'amber', 'Monthly — the standing forum',
            "Forty-five minutes. The four roles from chapter 4: head of AI, sponsor, lead engineer, governance lead. Reviews adoption, inventory, incidents, next wave. Boring is the goal."),
          narration:
            "Monthly. The standing forum from chapter four. Forty-five minutes. The four roles. Head of AI. Sponsor. Lead engineer. Governance lead. Reviews adoption. The inventory. Any incidents. And the next wave of work. Boring is the explicit goal. Boring meetings mean a healthy programme.",
        },
        {
          html: stepCard('calendar', 'green', 'Quarterly — the board',
            "One page. Four numbers. Four narratives. Submitted a week before the meeting. The meeting is for decisions — not for explanations. Time in the room: 20 minutes maximum."),
          narration:
            "Quarterly. The board. One page. Four numbers. Four narratives. Submitted to the board pack one week before the meeting. The actual meeting is for decisions — not for explanations. Time in the room — twenty minutes maximum. If the board needs longer, you didn't write the one-pager well. Go back, edit it, send it back.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'The 18-month renewal',
        "Once every 18 months — separate from the quarterly cadence — the full mandate renewal from chapter 6. Three slides. Honest. Decisive. Signed budget at the end."),
      calloutNarration:
        "And once every eighteen months — separate from the quarterly cadence — the full mandate renewal from chapter six. Three slides. Honest. Decisive. Walk out with a signed budget at the end. Not an approval to come back later.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 7 · Takeaways',
      bodyHtml: `<p>Three anchors before the capstone.</p>`,
      narrationLead:
        "Three anchors before we land this in the capstone chapter.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four numbers, four narratives, one page',
            "Spend vs outcomes · adoption · incidents · pipeline. One page. Three-quarter trend. Submitted before the meeting."),
          narration:
            "One. Four numbers, four narratives, one page. Spend versus outcomes. Adoption. Incidents. Pipeline. One page. Three-quarter trend. Submitted before the meeting — never read aloud in the meeting.",
        },
        {
          html: stepCard('check', 'green', 'Two — Honesty outranks polish',
            "Report incidents. Report under-performing units by name. Report the asks. Boards reward honesty — and notice silence."),
          narration:
            "Two. Honesty outranks polish. Report incidents. Report under-performing units by name. Report the asks plainly. Boards reward honesty — and they notice silence. The silence is what eventually triggers the difficult question you didn't want to answer.",
        },
        {
          html: stepCard('check', 'green', 'Three — Cadence by audience',
            "Weekly for the sponsor. Monthly for the forum. Quarterly for the board. Every 18 months for mandate renewal. Don't conflate them."),
          narration:
            "Three. Cadence by audience. Weekly for the sponsor. Monthly for the forum. Quarterly for the board. Every eighteen months for the mandate renewal. Don't conflate them. Each one does a specific job — and skipping any one is felt later.",
        },
      ],
      narrationTrail:
        "Final chapter — your AI strategy on one page. Where everything we've covered lands as something you can actually use on Monday. See you there.",
    },
  ],
}
