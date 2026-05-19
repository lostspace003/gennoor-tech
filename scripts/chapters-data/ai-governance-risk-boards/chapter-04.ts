import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiGovernanceBoardsChapter04: Chapter = {
  courseId: 'ai-governance-risk-boards',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-reporting-and-metrics',
  title: 'Reporting & metrics',
  subtitle: 'The one-page quarterly board pack — what should be on it, and what should not.',
  slides: [
    // SLIDE 1
    {
      title: 'Reporting & metrics',
      iconKey: 'flag',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Board reporting on AI is still being figured out across most enterprises. The good news: there is a shape that works. One page. Eight numbers. Four narratives. Submitted a week ahead. Discussion in the room is for decisions — not for reading numbers aloud.</p>`,
      narrationLead:
        "Welcome to chapter four. Reporting and metrics. Board reporting on AI is still being figured out across most enterprises — and a lot of boards quietly suspect they're not getting the right information. The good news — there is a shape that works. One page. Eight numbers. Four narratives. Submitted a week ahead. The discussion in the room is for decisions — not for reading numbers aloud. Let me show you exactly what should be on that page.",
    },
    // SLIDE 2
    {
      title: 'The eight numbers — by risk category',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · Metrics',
      bodyHtml: `<p>One number per category from chapter 3 — plus two on the programme itself. Eight in total. Trended over four quarters.</p>`,
      narrationLead:
        "Eight numbers. One number per risk category from chapter three. Plus two on the AI programme itself. Trended over four quarters — so the board sees direction, not just a snapshot. Here are the eight.",
      steps: [
        {
          html: stepCard('target', 'blue', '1 · Inventory count + tier mix',
            "How many AI systems · % high-tier · % medium · % low. The breathing chart of the AI estate."),
          narration:
            "Number one. Inventory count plus the tier mix. How many AI systems are in use. What percentage are high-tier. What percentage medium-tier. What percentage low-tier. This is the breathing chart of the AI estate. The board sees the shape — and notices when it changes.",
        },
        {
          html: stepCard('target', 'blue', '2 · Model accuracy / drift status',
            "For high-tier systems only — accuracy versus baseline, % within threshold, % flagged for retraining. Two-line summary."),
          narration:
            "Number two. Model accuracy and drift status. For high-tier systems only — the board doesn't need to see every model. Accuracy versus baseline. Percentage within threshold. Percentage flagged for retraining. Two lines of summary text per high-tier system. That's it.",
        },
        {
          html: stepCard('target', 'amber', '3 · Bias / fairness status',
            "For high-tier systems — a fairness score per protected/proxy group, quarter-on-quarter trend. Anything red gets a callout."),
          narration:
            "Number three. Bias and fairness status. For high-tier systems — a fairness score per protected or proxy group, quarter on quarter. Anything in the red gets a callout with a remediation status next to it. The board does not need to see green systems in detail. They need to see red and amber clearly, with named accountability.",
        },
        {
          html: stepCard('target', 'amber', '4 · Data incidents',
            "Number of data incidents related to AI in the quarter. Severity. Resolution. Lessons captured. A zero is investigated — not celebrated."),
          narration:
            "Number four. Data incidents related to AI in the quarter. Number. Severity. Resolution status. Lessons captured. And here's an important nuance — a zero is investigated, not celebrated. Most organisations have at least one minor AI data incident per quarter once you look for them properly. A reported zero usually means under-reporting, not perfect operations. The board can usefully challenge zero.",
        },
        {
          html: stepCard('target', 'red', '5 · Vendor concentration risk',
            "% of AI spend on top one vendor · top three vendors. Concentration ratio. Exit risk per high-tier vendor."),
          narration:
            "Number five. Vendor concentration risk. Percentage of AI spend on the top one vendor. Percentage on the top three. A simple concentration ratio. Plus exit risk per high-tier vendor — what happens if vendor X is unavailable for thirty days. If concentration creeps above seventy percent in your top vendor, that's a board-level conversation about whether to mitigate.",
        },
        {
          html: stepCard('target', 'green', '6 · Human oversight intervention rate',
            "For high-tier systems with human-in-the-loop — what % of decisions had human override last quarter. Trended."),
          narration:
            "Number six. Human oversight intervention rate. For high-tier systems with human in the loop — what percentage of decisions had a human override last quarter. Trended over time. A falling rate that you can attribute to genuine model improvement is good news. A falling rate that has no model improvement attached is the operational risk we discussed in chapter three — the humans are quietly disengaging.",
        },
        {
          html: stepCard('target', 'green', '7 · Adoption / utilisation',
            "% of licensed users actively using the AI tools last week. The programme is only valuable if it's used. Most boards skip this one — they shouldn't."),
          narration:
            "Number seven. Adoption and utilisation. Percentage of licensed users actively using the AI tools last week. The whole programme is only valuable if the tools are used. Most boards skip this metric — they shouldn't. Low adoption is a board issue. It means money is being spent on capability that isn't generating value. And it's often the cheapest failure to fix.",
        },
        {
          html: stepCard('target', 'blue', '8 · Incident response readiness',
            "Days since the last tabletop exercise. % of high-tier systems with a tested incident playbook. The readiness number."),
          narration:
            "Number eight. Incident response readiness. Days since the last tabletop exercise. Percentage of high-tier systems with a tested incident playbook. The readiness number. If days since tabletop exceeds three hundred and sixty-five, that's a board-level intervention. Run one. The tabletop is cheap. The incident is not.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Trend more than count',
        "The eight numbers told once are noise. The eight numbers trended over four quarters are signal. Insist on the trend view. The single quarter view is the consultant's slide — the trend is yours."),
      calloutNarration:
        "Insist on the trend view, not the single quarter view. The eight numbers told once are noise. The eight numbers trended over four quarters are signal. The single-quarter view is what a consultant produces. The four-quarter trend is what a board uses to govern. Push for the trend. It will reveal slow drifts that no single quarter ever shows.",
    },
    // SLIDE 3
    {
      title: 'The four narratives',
      iconKey: 'bookOpen',
      eyebrow: 'Lesson 2 · Narratives',
      bodyHtml: `<p>Numbers without narrative is noise. Four short narratives turn the dashboard into a conversation.</p>`,
      narrationLead:
        "Numbers without narrative is noise. Four short narratives — three sentences each, maximum — turn the dashboard into a conversation. Here they are.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', 'Narrative 1 — What changed since last quarter',
            "Three sentences. New systems added to inventory. Tier reclassifications. Vendor changes. Major incidents. Plain language."),
          narration:
            "Narrative one. What changed since last quarter. Three sentences. New systems added to the inventory. Any tier reclassifications. Vendor changes. Major incidents and their outcomes. Plain language. No acronyms. A board director should be able to read it on the train and feel current on the AI estate.",
        },
        {
          html: stepCard('bookOpen', 'amber', 'Narrative 2 — Where we paid attention this quarter',
            "What the team specifically watched. Why. What they found. This narrative reveals whether governance is active or passive."),
          narration:
            "Narrative two. Where we paid attention this quarter. What the governance team specifically watched. Why they chose those targets. What they found. This narrative is where you tell whether governance is active — meaning making conscious decisions about where to look — or passive — meaning just reporting whatever the dashboards spit out. Push for active.",
        },
        {
          html: stepCard('bookOpen', 'red', 'Narrative 3 — What’s on the watchlist',
            "Three to five items the team is monitoring closely — that haven't yet become formal risks but might. The early-warning section."),
          narration:
            "Narrative three. What's on the watchlist. Three to five items the team is monitoring closely. Items that have not yet become formal risks — but might. This is the early-warning section. It's also the place where governance proves its worth between incidents. A watchlist that catches things before they become incidents is the entire point of a governance function.",
        },
        {
          html: stepCard('bookOpen', 'green', 'Narrative 4 — Asks for the board',
            "What does management need from the board this quarter? A decision. A policy ratification. An escalation. Specific. Decision-ready."),
          narration:
            "Narrative four. Asks for the board. What does management need from the board this quarter? A decision. A policy ratification. An escalation to full board from the committee. Specific. Decision-ready. The asks should be small — but specific. A meeting where the asks slot are blank, quarter after quarter, suggests governance has become a reporting ritual rather than a decision forum. Surface the asks.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'What does not belong on the page',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · The discipline of absence',
      bodyHtml: `<p>Equally important — what to keep off the page. Three things crowd out the signal.</p>`,
      narrationLead:
        "Equally important — what should not be on the board pack. Three things that crowd out the signal. If they appear, push back.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Don’t —technical model details',
            "The board does not need transformer architecture diagrams, prompt examples, or evaluation harness specifics. If it appears, somebody is performing expertise rather than reporting governance."),
          narration:
            "One. Technical model details. The board does not need transformer architecture diagrams. Or prompt examples. Or details of the evaluation harness. If this material appears in a governance report, somebody is performing expertise — rather than reporting on governance. The board's job is to ensure the system exists and works. Not to evaluate the engineering. Politely ask for it to come out.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Don’t —adoption screenshots',
            "Three slides of Copilot screenshots tell you nothing about the governance posture. They're padding. Replace them with the one adoption number from the dashboard."),
          narration:
            "Two. Adoption screenshots. Three slides of Microsoft Copilot screenshots tell the board nothing about the governance posture. They are padding. Often well-intentioned padding, intended to make the story concrete. Replace them with the one adoption number on the dashboard. The screenshots can live in an appendix the board never reads.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Don’t —vendor logos and roadmap slides',
            "If your board pack carries OpenAI / Anthropic / Microsoft logos and roadmap timelines, you're reading a vendor pitch — not your governance posture. Insist on a vendor-neutral pack."),
          narration:
            "Three. Vendor logos and roadmap slides. If your board pack carries OpenAI, Anthropic, Microsoft, or Google logos prominently — with their roadmap timelines — you are reading a vendor pitch, not your own governance posture. Insist on a vendor-neutral pack. The vendor relationship is fine. It just doesn't belong on the page where the board makes decisions about your risk.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 5 — vendor risk.</p>`,
      narrationLead:
        "Three anchors before we move to vendor risk in chapter five.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — One page, eight numbers, four narratives',
            "Trended over four quarters. Submitted a week before. Discussion is for decisions."),
          narration:
            "One. One page. Eight numbers. Four narratives. Trended over four quarters. Submitted a week before the meeting. The discussion in the room is for decisions — not for reading the numbers aloud.",
        },
        {
          html: stepCard('check', 'green', 'Two — Discipline of absence',
            "Keep technical detail off the page. Keep adoption screenshots off. Keep vendor logos off. The blank space is the discipline."),
          narration:
            "Two. The discipline of absence. Keep technical detail off the page. Keep adoption screenshots off. Keep vendor logos off. The blank space is itself the discipline.",
        },
        {
          html: stepCard('check', 'green', 'Three — Watchlist is the early-warning section',
            "Three to five items. Not yet risks. Watching. Governance proves its worth between incidents."),
          narration:
            "Three. The watchlist is the early-warning section. Three to five items. Not yet formal risks. Just being watched. Governance proves its worth between incidents — and the watchlist is where that proof shows up.",
        },
      ],
      narrationTrail:
        "Chapter five — vendor and third-party AI risk. The part most boards under-engage on. See you there.",
    },
  ],
}
