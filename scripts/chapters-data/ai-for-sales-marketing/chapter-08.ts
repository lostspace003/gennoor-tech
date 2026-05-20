import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiSalesChapter08: Chapter = {
  courseId: 'ai-for-sales-marketing',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your 2-quarter sales AI portfolio',
  subtitle: 'Seven chapters down. One portfolio. Two quarters. The KPI scaffold that proves — or disproves — ROI.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your 2-quarter sales AI portfolio',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In seven chapters, we built the operating view of revenue AI. Now — one portfolio. Two quarters. Specific enough to start this week. Concrete enough to defend in the next CRO or CMO budget meeting.</p>`,
      narrationLead:
        "Welcome to chapter eight. The capstone. In the previous seven chapters, we built the operating view of revenue AI. Where AI fits in sales and marketing. Where it disappoints. The disciplined prospecting workflow. The two-layer scoring model. The proposal template and guardrails. The content production pipeline. The personalization tiers and the creepy line. The call AI four extractions and the coaching loop. Now we collapse all of it. One portfolio. Two quarters. Specific enough to start this week. Concrete enough to defend in the next chief revenue officer or chief marketing officer budget meeting. Here's what's on it.",
    },
    // SLIDE 2
    {
      title: 'The portfolio on one page — three plays, two quarters',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The portfolio',
      bodyHtml: `<p>Three plays. Sequenced across two quarters. Each play produces a measurable deliverable that funds the next play.</p>`,
      narrationLead:
        "Three plays sequenced across two quarters. Each play produces a measurable deliverable that funds the next play and proves the model to the executive sponsor. Don't try to deploy all six plays at once — teams that do underdeliver on each because the operating attention is too thin. Sequence deliberately. Use this as the template; adapt the sequence to your team's strengths.",
      steps: [
        {
          html: stepCard('calendar', 'blue', 'Quarter 1 — Play A: Pre-meeting research + Play B: Call AI',
            "Two plays, run in parallel, low brand risk, fast time-to-value. By end of Q1: every rep has AI-prepared briefs before every external call, and every call produces structured extractions in CRM. Two clear wins."),
          narration:
            "Quarter one. Two plays in parallel — both low brand risk, both fast time-to-value. Play A — pre-meeting research, the briefing workflow from chapter two that lands a two-paragraph account brief in the rep's inbox before every external call. Play B — call AI with the four extractions from chapter seven, plus the coaching loop set up by end of Q1. By end of quarter one, every rep has AI-prepared briefs before every external call, and every call produces structured extractions in CRM. Two clear, executive-visible wins. First-meeting quality improves measurably. CRM data quality improves measurably. The combined improvements fund quarter two.",
        },
        {
          html: stepCard('calendar', 'amber', 'Quarter 2 — Play C: Proposal generation',
            "One play. Higher complexity, requires the three guardrails. By end of Q2: proposal cycle time down from days to hours; recovered rep time reinvested into discovery and expansion calls. Biggest single productivity win."),
          narration:
            "Quarter two. One play, deliberately. Play C — proposal generation from chapter four with the three guardrails. Higher complexity than the quarter one plays — requires CRM grounding configuration, claim register, and legal-review gate set up before the first generated proposal ships. Worth the setup. By end of quarter two, proposal cycle time is down from days to hours per proposal. Recovered rep time reinvests into better discovery and existing-customer expansion conversations. This is the biggest single productivity win in the portfolio. It also enables the case for further investment in quarter three. Don't try to run lead scoring, content production, and personalization in the same window — those are quarter three through five plays. Hold the discipline.",
        },
        {
          html: stepCard('rocket', 'green', 'What\'s held out of the two quarters — and why',
            "Lead scoring · content production · deep-tier personalization. All are good plays. None fits in the first two quarters without thinning attention. Sequence them in Q3–Q5 after the foundation lands."),
          narration:
            "What's deliberately held out of the first two quarters and why. Lead scoring from chapter three — needs the CRM data quality gate cleared first, which is typically a quarter of preparation work. Content production from chapter five — needs the brand voice anchor and editorial pipeline set up, which is a marketing-side workstream that doesn't compete with the rep-side quarter one and quarter two plays. Deep-tier personalization from chapter six — needs both the call AI signal extraction running well and the prospect research workflow mature before it adds value. All three are good plays. None fits in the first two quarters without thinning operational attention. Sequence them in quarter three through quarter five after the foundation lands.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Why this sequence specifically',
        "Pre-meeting research and call AI are the highest-trust starting points — output is internal to the rep, brand risk is zero. They produce the data hygiene that makes lead scoring possible later. Foundation first."),
      calloutNarration:
        "Why this sequence specifically. Pre-meeting research and call AI are the highest-trust starting points because the AI output is internal to the rep — brand risk is essentially zero, no customer ever sees the AI output directly. They build organisational confidence in AI. They also produce the CRM data hygiene — particularly the call extractions filling activity logs and decision criteria — that makes lead scoring possible later. Foundation before optimisation. Sequence built around durability of the rollout, not around vendor enthusiasm. The vendor enthusiasm always pulls toward starting with the hardest play first.",
    },
    // SLIDE 3
    {
      title: 'The KPI scaffold — four numbers, two cadences',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · The KPIs',
      bodyHtml: `<p>Four numbers tell you whether the portfolio is working. Two cadences for review — one weekly, one quarterly. Get these wrong and ROI becomes a story; get them right and ROI becomes evidence.</p>`,
      narrationLead:
        "Four numbers tell you whether the AI portfolio is working — and tell the executive sponsor whether the investment is paying back. Two cadences for review — one weekly, one quarterly. Get the KPI scaffold wrong and ROI becomes a story you tell. Get it right and ROI becomes evidence you present.",
      steps: [
        {
          html: stepCard('target', 'blue', 'Number 1 — First-meeting-to-second-meeting conversion',
            "Pre-meeting research's main lift. Pre-rollout baseline, monthly trend after rollout. Healthy lift in 30–60 days is 15–25%. Below 10% — investigate the research quality, not the rep."),
          narration:
            "Number one. First-meeting to second-meeting conversion rate. This is pre-meeting research's primary lift. Establish the pre-rollout baseline carefully — the previous quarter's actual conversion rate. Track monthly trend after rollout. A healthy lift within thirty to sixty days is fifteen to twenty-five percent improvement on the baseline. Below ten percent lift after sixty days — investigate the research quality, not the rep performance. Most underperformance traces to briefs that aren't actually specific enough to be useful.",
        },
        {
          html: stepCard('target', 'blue', 'Number 2 — CRM activity logging coverage',
            "Call AI's main hygiene lift. Pre-rollout baseline (usually 30–50%). Healthy rollout reaches 85%+ within 60 days. Below 70% — verify the consent and tooling are landing in rep workflow correctly."),
          narration:
            "Number two. CRM activity logging coverage. This is call AI's primary hygiene lift. Pre-rollout baseline is typically thirty to fifty percent — high-activity reps logging less because they're busy, low-activity reps logging more because they have time. A healthy rollout reaches eighty-five percent or higher within sixty days. Below seventy percent at sixty days — verify the consent flow and the tooling are landing in the rep's actual workflow correctly. Often the failure is a friction point in how the rep approves the extracted notes — solve the friction.",
        },
        {
          html: stepCard('target', 'amber', 'Number 3 — Proposal cycle time',
            "Proposal generation's main lift. Pre-rollout baseline in working days. Healthy rollout cuts cycle time by 60–80% within 60 days of full deployment. Combined with proposal-to-close-rate which must not drop."),
          narration:
            "Number three. Proposal cycle time, measured in working days from request to send. This is proposal generation's primary lift. Establish the baseline. A healthy rollout cuts cycle time by sixty to eighty percent within sixty days of full deployment, with all three guardrails active. Important — pair this number with proposal-to-close rate, which must not drop. If cycle time falls and close rate also falls, the guardrails are insufficient or the rep isn't doing the refinement step. Both numbers together tell the real story — neither alone does.",
        },
        {
          html: stepCard('target', 'green', 'Number 4 — Pipeline produced per rep per quarter',
            "The outcome number. All three plays should contribute. Baseline first quarter post-rollout vs same period prior year. Healthy lift is 20–40% combined across the portfolio. This is the number the CFO cares about most."),
          narration:
            "Number four. Pipeline produced per rep per quarter. This is the outcome number — the one the chief financial officer cares about most, and the one the executive sponsor will hold the portfolio accountable to. All three plays in the portfolio should contribute to it. Baseline first quarter post-rollout against the same period prior year — not against last quarter, because seasonality matters. A healthy lift across the combined portfolio is twenty to forty percent on pipeline produced per rep. Below ten percent combined lift after two quarters — review what's not working. The diagnostic usually traces to one of the four operating disciplines slipping, not to the technology underperforming.",
        },
      ],
      calloutHtml: calloutBlock('calendar', 'tip', 'Two cadences',
        "Weekly — the team reviews the four numbers trending. Quarterly — the executive sponsor reviews the portfolio against baseline and decides whether to continue, expand, or contract. The cadences are the operating contract."),
      calloutNarration:
        "Two review cadences. Weekly — the revenue operations team reviews the four numbers' trends. Catches issues before they become quarterly disappointments. Quarterly — the executive sponsor reviews the portfolio against baseline and decides whether to continue at current investment, expand, or contract. The two cadences together are the operating contract that gives the portfolio credibility. Without them, the AI investment becomes a story the team tells at board meetings rather than a measurable operating asset. Schedule both cadences in calendars before the rollout starts.",
    },
    // SLIDE 4
    {
      title: 'Four conversations to schedule in week one',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · Week one',
      bodyHtml: `<p>Four conversations in the first week. Each one unlocks something the portfolio needs in order to ship. Don't skip any of them — and don't try to combine them.</p>`,
      narrationLead:
        "Four conversations to schedule in the first week. Each conversation unlocks something specific the portfolio needs in order to actually ship. Don't skip any of them. Don't try to combine them into one meeting — each conversation needs its own clean context and its own owner. Schedule them in calendars before you do anything else. The early discipline determines whether the portfolio actually lands.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — Executive sponsor',
            "CRO or CMO. Walks through the portfolio one-pager. Confirms two-quarter plan and budget. Names the rev ops lead. Commits to the quarterly review cadence in the calendar."),
          narration:
            "Conversation one. The executive sponsor — typically the chief revenue officer or chief marketing officer depending on portfolio weighting. You walk through the portfolio one-pager from slide two. You confirm the two-quarter plan, the budget, and the deliverables. You agree on the rev ops lead — the named operating owner. You commit the quarterly review cadence into the sponsor's calendar before leaving the room. This conversation determines whether the portfolio gets oxygen.",
        },
        {
          html: stepCard('cog', 'blue', 'Conversation 2 — Revenue operations lead',
            "Walks through the four KPIs and the baseline measurement. Agrees on the weekly cadence. Identifies the data dependencies — the source tags, the closed-lost discipline. Sets the prep-week scope."),
          narration:
            "Conversation two. The revenue operations lead. You walk through the four KPIs and how each one will be measured — including how the pre-rollout baseline will be established cleanly before any tool is deployed. You agree on the weekly review cadence and who attends. You identify the data dependencies — source tag coverage, closed-lost discipline, activity logging baseline — and decide what needs to land before quarter one play deployment. You set the prep-week scope. This conversation determines whether the measurement is credible enough that the sponsor takes the quarterly review seriously.",
        },
        {
          html: stepCard('shield', 'amber', 'Conversation 3 — Legal and information security',
            "Walks through call AI consent flow, retention windows, vendor procurement requirements, and the proposal-generation legal-review gate. Surfaces the friction points before deployment, not after. Critical for regulated industries."),
          narration:
            "Conversation three. Legal and information security. You walk through the call AI consent flow — the spoken consent script, the retention windows, the published trust page commitments. You walk through the vendor procurement requirements — data processing agreements, enterprise terms, data residency if you operate in regulated geographies. You walk through the proposal generation legal review gate — the first-time-non-standard-term trigger, the named legal reviewer. You surface friction points now, not after. This conversation is critical in regulated industries — financial services, healthcare, public sector — and useful in every industry.",
        },
        {
          html: stepCard('zap', 'green', 'Conversation 4 — Two pilot reps',
            "Pick two trusted reps — one senior, one mid-career. Walk them through the quarter-one plays. Get their honest reaction. Their feedback is the early signal on whether the workflow lands in rep reality."),
          narration:
            "Conversation four. Two pilot reps — selected deliberately. One senior rep who is respected on the team and pattern-matches as a credible voice. One mid-career rep who represents the modal rep the portfolio is for. You walk them through the quarter one plays — pre-meeting research and call AI — and explain what they'll experience in their actual workflow. You get their honest reaction. Their feedback is the earliest signal on whether the workflow lands in rep reality or only in the deck. Adjust the rollout based on their input before going broad. This conversation is the one most teams skip — and it is the one that distinguishes rollouts that land from rollouts that bounce off rep behaviour.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'lightbulb',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p>The revenue function is one of the highest-leverage places to deploy AI well — and one of the most visible places to get it wrong. Discipline matters more than enthusiasm.</p>`,
      narrationLead:
        "A final note before the takeaways. The revenue function is one of the highest-leverage places in any company to deploy AI well — productivity gains in revenue compound across pipeline, conversion, and customer expansion. It is also one of the most visible places to get AI wrong — the brand cost of an AI mistake in customer-facing revenue work is asymmetric. Discipline matters more than enthusiasm. Sequence carefully. Measure honestly. Hold the line on the human moment of judgment and the creepy line of personalization. The teams that hold the discipline produce the compounding return. The teams that chase the vendor demo produce the brand events. Same technology. Same market. Different outcomes. Choose discipline.",
    },
    // SLIDE 6
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>Three anchors. Then the course is yours.</p>`,
      narrationLead:
        "Three anchors. Then the course is yours.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — The portfolio is three plays over two quarters',
            "Q1 — Pre-meeting research + Call AI (parallel, low risk). Q2 — Proposal generation (single play, higher complexity). Holds lead scoring, content, and deep personalization for Q3–Q5. Sequence is the discipline."),
          narration:
            "One. The portfolio is three plays sequenced across two quarters. Quarter one — pre-meeting research and call AI in parallel, both low brand risk, both fast time-to-value, both producing the data hygiene that later plays depend on. Quarter two — proposal generation as a single play with the three guardrails fully in place before the first generated proposal ships. Holds lead scoring, content production, and deep personalization for quarter three through five. Sequence is the discipline that distinguishes durable rollouts from ones that fizzle. Hold it.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four numbers, two cadences',
            "First-meeting-to-second conversion · CRM activity logging coverage · proposal cycle time · pipeline per rep per quarter. Weekly with rev ops, quarterly with the sponsor. ROI as evidence, not story."),
          narration:
            "Two. Four numbers, two cadences. First-meeting-to-second-meeting conversion. CRM activity logging coverage. Proposal cycle time, paired with proposal-to-close rate which must not drop. Pipeline produced per rep per quarter as the outcome number the CFO cares about. Weekly review with revenue operations. Quarterly review with the executive sponsor. The cadences are the operating contract. They convert ROI from a story you tell into evidence you present.",
        },
        {
          html: stepCard('check', 'green', 'Three — Four conversations in week one',
            "Executive sponsor · revenue operations · legal and infosec · two pilot reps. Each unlocks something the portfolio needs. None can be combined. The week-one discipline determines whether the portfolio actually lands."),
          narration:
            "Three. Four conversations in week one. Executive sponsor confirms the plan, the budget, and the quarterly cadence. Revenue operations lead agrees the measurement and identifies the data dependencies. Legal and information security clear the consent, retention, and proposal-review gates. Two pilot reps give the honest early signal on whether the workflow lands in rep reality. Each conversation unlocks something the portfolio needs. None can be combined. The week-one discipline is what determines whether the portfolio actually ships or stays in the deck. Schedule them this week. That's the course. Build well.",
        },
      ],
      narrationTrail:
        "Thank you for completing AI for Sales and Marketing. The portfolio is yours. Now ship it.",
    },
  ],
}
