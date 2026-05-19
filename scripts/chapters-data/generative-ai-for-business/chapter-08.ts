import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const genAiBizChapter08: Chapter = {
  courseId: 'generative-ai-for-business',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your 90-day GenAI plan for managers',
  subtitle: 'Seven chapters down. One plan you can start on Monday.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your 90-day GenAI plan for managers',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In the previous seven chapters, we built a manager's view of generative AI. Now — one plan. 90 days. Specific enough to start on Monday. Concrete enough to defend to your sponsor next month.</p>`,
      narrationLead:
        "Welcome to the final chapter. The capstone. In the previous seven chapters, we built a manager's view of generative AI. Now we collapse it. One plan. Ninety days. Specific enough to start on Monday. Concrete enough to defend to your sponsor at next month's check-in. Here's what's on the plan.",
    },
    // SLIDE 2
    {
      title: 'The 90-day plan — three phases',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The plan',
      bodyHtml: `<p>Three phases, 30 days each. Each one with a specific deliverable. Each one designed to fund the next phase.</p>`,
      narrationLead:
        "Three phases. Thirty days each. Each one with a specific deliverable. Each one designed to fund the next phase. Use this template at your next manager planning meeting and you'll walk out with sponsor agreement to start. Specific. Decision-ready.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Days 1–30 — Discovery and one use case',
            "Five team interviews. Two days of shadowing. Half-day inbox review. Score five candidates with the five-question sheet. Pick one. By day 30, you have a signed scope document and a vendor selected."),
          narration:
            "Days one through thirty. Discovery and one use case picked. Five twenty-minute team interviews. Two days of shadowing different team members. Half a day reviewing the shared inbox. Score five candidate use cases with the five-question scoring sheet from chapter three. Pick one. By day thirty, you have a signed scope document. A vendor selected using the ninety-second filter and the five questions from chapter four. And your sponsor has agreed to fund the next thirty days. The first month is mostly thinking, asking, and choosing. That's appropriate. Don't rush it.",
        },
        {
          html: stepCard('calendar', 'blue', 'Days 31–60 — The four-week pilot',
            "Scope and sample (week 1). Build with vendor (week 2). Pilot live with 3–5 team members (week 3). Measure and decide (week 4). By day 60, you have a Yes, an Iterate, or a Stop — with the data to support it."),
          narration:
            "Days thirty-one through sixty. The four-week pilot from chapter five. Week one, scope and sample. Week two, build with the vendor. Week three, pilot live with three to five team members. Week four, measure and decide. By day sixty, you have a clear decision — Yes to scale, Iterate for another four weeks, or Stop and pivot. With the data to support whichever decision you reached. The decision is the deliverable. Not the demo.",
        },
        {
          html: stepCard('calendar', 'amber', 'Days 61–90 — Rollout or pivot',
            "If Yes — roll out to the team, with the three adoption disciplines from chapter 6 active from day one. If Iterate — defined further period, defined decision date. If Stop — pivot to the next candidate use case. The 90-day clock keeps you decisive."),
          narration:
            "Days sixty-one through ninety. Rollout or pivot. If the week four decision was Yes — roll out to the whole team. With the three adoption disciplines from chapter six active from day one. The prompt library. The weekly office hours. The visible usage dashboard. If the decision was Iterate — a defined further period, with a defined decision date at the end. Don't open-ended iterate. If the decision was Stop — pivot to the next candidate use case from your discovery shortlist. Don't disband the effort because one use case didn't work. Use the discovery work you already did. The ninety-day clock keeps you decisive across all three paths.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The 90-day clock matters',
        "Three months is the right horizon for a first AI plan. Long enough to do real work. Short enough that you can present results — not promises — at the next quarterly cycle. Longer plans drift. Shorter plans don't ship. 90 days fits both constraints."),
      calloutNarration:
        "The ninety-day clock matters. Three months is the right horizon for a first AI plan as a manager. Long enough to do real work — discovery, pilot, rollout decision. Short enough that you can present actual results — not promises — at your next quarterly cycle. Longer plans drift. Shorter plans don't ship anything meaningful. Ninety days fits both constraints. Build the plan around the ninety-day clock and the discipline keeps you honest with your team and with your sponsor.",
    },
    // SLIDE 3
    {
      title: 'The four conversations to have in week one',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Week one',
      bodyHtml: `<p>Four conversations in week one of the plan. Each one moves a decision or a relationship. Don’t put them off.</p>`,
      narrationLead:
        "Four conversations to have in week one of the ninety-day plan. Each one moves a decision or a relationship. Don't put them off. Putting them off is the most common reason ninety-day plans become hundred-and-twenty-day plans.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — With your team',
            "20 minutes at the team meeting. Explain the plan. Explain why. Ask for one volunteer to be the champion candidate. Set the expectation that nobody loses their job over this — and nobody gets in trouble for trying."),
          narration:
            "Conversation one. With your team. Twenty minutes at the team meeting in week one. Explain the ninety-day plan. Explain the reasoning behind it. Ask for one volunteer to be the champion candidate — the person who will own the role through the rollout. Set the expectation clearly that nobody loses their job over this initiative. And critically — that nobody gets in trouble for trying the tool and getting it wrong. The cultural framing matters. Get it right in this first meeting.",
        },
        {
          html: stepCard('users', 'amber', 'Conversation 2 — With your sponsor',
            "30 minutes to walk through the plan. Get explicit agreement on the budget for days 1-30 and the decision criteria for day 30. Don't ask for the full 90 days yet — fund phase by phase."),
          narration:
            "Conversation two. With your sponsor. Thirty minutes to walk through the ninety-day plan. Get explicit agreement on the budget for days one through thirty. And on the decision criteria your sponsor will use at day thirty to fund the next phase. Don't ask for the full ninety days of budget yet. Fund phase by phase. The discipline mirrors the phase-gated funding from the strategy course. It applies at the team level just as well as at the C-suite level.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 3 — With finance',
            "15 minutes — even informally. Walk them through the cost line, the ROI pattern you're using, the metrics you'll report. The CFO's team becoming an ally early is what protects budget at month six."),
          narration:
            "Conversation three. With finance. Fifteen minutes — even informally over coffee. Walk them through the cost line. The ROI pattern you're using and the math behind it. The metrics you'll report quarterly. The CFO's team becoming an ally to your AI initiative early is what protects the budget when finance is under pressure at month six. That happens. Plan for it by making finance an early ally.",
        },
        {
          html: stepCard('users', 'red', 'Conversation 4 — With IT and security',
            "30 minutes. Walk through which tool, which data, which residency. Surface the security concerns now — not at week four when you're trying to ship. IT becoming an ally early saves you a quarter of delay later."),
          narration:
            "Conversation four. With IT and security. Thirty minutes in week one. Walk through which specific tool you're piloting. Which data it will see. Where the inference happens — sovereign cloud, hybrid, or wherever. Surface the security concerns now — at week one, when there's time to address them. Not at week four, when you're trying to ship the pilot and IT raises an issue that takes a month to resolve. IT becoming an ally early saves you a quarter of delay later. The conversation costs thirty minutes. Take it.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'What comes next — beyond this course',
      iconKey: 'rocket',
      eyebrow: 'Lesson 3 · Onward',
      bodyHtml: `<p>This course gave you the manager's view. Three suggestions for what to look at next — each one pairs with where you are in the 90-day plan.</p>`,
      narrationLead:
        "This course gave you the manager's view of generative AI. Three suggestions for what to look at next. Each one pairs with where you'll be in your ninety-day plan.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', '1 · AI for [your function]',
            "Function-specific deep dives. AI for HR. AI for Finance. AI for Sales. AI for Customer Service. AI for Operations. AI for Legal. Pick the one closest to your team's work."),
          narration:
            "One. The function-specific courses in the academy. AI for HR and People Teams. AI for Finance and Accounting. AI for Sales and Marketing. AI for Customer Service and Support. AI for Operations and Supply Chain. AI for Legal, Risk, and Compliance. Pick the one closest to your team's work. The function-specific courses go deeper into the specific use cases, the specific metrics, and the specific patterns of failure that affect your specific function. The depth is worth the additional hour.",
        },
        {
          html: stepCard('bookOpen', 'amber', '2 · Microsoft 365 Copilot Adoption Playbook',
            "If your team is rolling out Copilot specifically, the Copilot adoption course extends the adoption playbook here into the specific licensing, persona design, and measurement patterns for M365."),
          narration:
            "Two. If your team is rolling out Microsoft 365 Copilot specifically — which many teams are — the Microsoft 365 Copilot Adoption Playbook course extends the adoption playbook from chapter six into the specific licensing strategy, persona-based prompt design, and measurement patterns that work for Copilot deployments. Useful for the second half of the ninety-day plan when you're in rollout phase.",
        },
        {
          html: stepCard('bookOpen', 'green', '3 · A 30-minute scoping call',
            "If you're ready to start the ninety-day plan with a partner — the most efficient next step is a thirty-minute call. We listen, ask three honest questions, and tell you whether we're the right partner. Even when the answer is no."),
          narration:
            "Three. If you're ready to start the ninety-day plan with a partner — the most efficient next step is a thirty-minute call. We listen. We ask three honest questions about your team, your existing tooling, and your sponsor's expectations. And we tell you whether we are the right partner for your specific situation. Even when the answer is no — and sometimes it is — the candour saves you weeks of evaluating partners who aren't a fit. That's the value of the conversation. Take it.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p class="lead">Generative AI for business is not a technology project. It’s a management project — with a technology layer underneath. The managers who win are the ones who lead the discovery, pick the right use case, ship the pilot decisively, and run the adoption with discipline.</p>
      <p>The work is the work. The technology will keep moving. The work stays.</p>
      <p>Thank you for spending the last hour with me.</p>`,
      narrationLead:
        "One final thought. Generative AI for business is not a technology project. It is a management project — with a technology layer underneath. The managers who win in this period are the ones who lead the discovery themselves. Pick the right use case for their team. Ship the pilot decisively at week four. And run the adoption with discipline across the rollout. The technology will keep moving — and faster, not slower, over the next three years. The management work stays. Lead the management work. Thank you for spending the last hour with me. Now go have the four conversations in week one. The plan starts there.",
    },
    // SLIDE 6
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'check',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>Three things to carry out of the whole course — into Monday morning.</p>`,
      narrationLead:
        "Three things to carry out of the whole course. Into Monday morning.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Lead the discovery yourself',
            "Don't let the vendor pick the use case. Score five candidates. Pick the right one for your team. The week of discovery saves a quarter of misdirected work."),
          narration:
            "One. Lead the discovery yourself. Don't let the vendor pick the use case for you. Score five candidates with the five-question scoring sheet. Pick the right one for your specific team. The week of discovery saves a quarter of misdirected work. It is the highest-leverage management activity in the whole ninety-day plan.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four weeks, decide, ship',
            "The pilot is a forcing function — not a research project. Decision at week 4. Don't drag. Don't let it become a hundred-day pilot."),
          narration:
            "Two. Four weeks, decide, ship. The pilot is a forcing function — not a research project. Decision at week four — Yes, Iterate, or Stop. Don't drag. Don't let your four-week pilot turn into a hundred-day pilot. The decision is the deliverable. Even Stop is a fine decision. Drift is what kills budgets.",
        },
        {
          html: stepCard('check', 'green', 'Three — Active management or no adoption',
            "Three adoption disciplines, a recognised champion, weekly office hours, visible dashboard. Active management is the difference between 70% adoption and 30%. That is the entire game in year one."),
          narration:
            "Three. Active management or no adoption. The three adoption disciplines from chapter six. A recognised and protected champion role. Weekly office hours. Visible usage dashboard. Active management is the difference between seventy percent adoption and thirty percent. That is the entire game in year one. The technology is solved. The management isn't. Be the manager who solves the management.",
        },
      ],
      narrationTrail:
        "Thank you. Truly. Take the ninety-day plan to your sponsor this week. We'll see you at the next decision point.",
    },
  ],
}
