import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const m365CopilotChapter03: Chapter = {
  courseId: 'm365-copilot-adoption',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-pilot-design',
  title: 'Pilot design for Copilot',
  subtitle: 'The 4-week template adapted for persona-based rollouts — and how to make the pilot fund the wider rollout.',
  slides: [
    {
      title: 'Pilot design for Copilot',
      iconKey: 'rocket',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">The Copilot pilot has one job — produce evidence that funds the broader rollout. Done well, it produces undeniable numbers in four weeks. Done badly, it produces lukewarm anecdotes and no funding decision. In the next few minutes, the template that ships.</p>`,
      narrationLead:
        "Welcome to chapter three. Pilot design for Microsoft 365 Copilot. The Copilot pilot has one job — produce evidence that funds the broader rollout. Done well, it produces undeniable numbers within four weeks. Done badly, it produces lukewarm anecdotes and a CFO who says — let's wait six months. In the next few minutes, the four-week template that ships, the three pilot mistakes to avoid, and the metrics that earn the next budget conversation.",
    },
    {
      title: 'The 4-week Copilot pilot template',
      iconKey: 'calendar',
      eyebrow: 'Lesson 1 · The template',
      bodyHtml: `<p>Four weeks. Four phases. Same shape as the generic AI pilot — but with specifics that make it work for Copilot.</p>`,
      narrationLead:
        "Four weeks. Four phases. Same overall shape as the generic AI pilot from the Generative AI for Business course — but with specifics that make it work for Microsoft 365 Copilot in particular. Use this template; don't reinvent.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Week 1 — Pick 20 pilot users, baseline their work',
            "Pick 20 users — all from the heavy persona, drawn from 3–4 different functions for variety. Measure their pre-Copilot baseline — hours spent on document, email, meeting work. By Friday, the baseline is documented."),
          narration:
            "Week one. Pick twenty pilot users. All from the heavy persona. Drawn from three or four different functions for variety — finance, legal, marketing, executive support, for example. Measure their pre-Copilot baseline. Hours spent on document work. Email volume. Meeting preparation time. By Friday of week one, the baseline is documented for all twenty users. This is the most-skipped phase — and the phase that determines whether your week-four numbers are defensible or anecdotal.",
        },
        {
          html: stepCard('calendar', 'blue', 'Week 2 — Provision + persona-based prompts',
            "Provision Copilot licenses. Train each pilot user with 5–10 prompts specific to their role. Set up the dashboard. Set up the daily Teams channel for sharing what works. The training is hands-on, not video — adoption depends on it."),
          narration:
            "Week two. Provision Copilot licenses for the twenty pilot users. Train each pilot user — in person or via live session — with five to ten prompts specific to their actual role. Not generic prompts. Role-specific. Set up the usage dashboard for the pilot. Set up a daily Teams channel where the pilot users share what works. The training is hands-on, not pre-recorded video — adoption rate among pilot users depends critically on this distinction. Live training; immediate practice on real work.",
        },
        {
          html: stepCard('calendar', 'amber', 'Week 3 — Use in real work + daily check-ins',
            "Pilot users use Copilot on real work. 15-minute daily check-in in the Teams channel — what worked, what didn't, what to share. Capture the prompts that earn excited reactions; they become the library. Adjust based on real usage."),
          narration:
            "Week three. Pilot users use Copilot on their actual real work. Not exercises. Real work. Fifteen-minute daily check-in in the Teams channel — what worked today, what didn't, what to share with the others. Capture the prompts that earn excited reactions from pilot users — those prompts become the foundation of the role-specific library for the broader rollout. Adjust the deployment based on what real usage surfaces. The daily check-in rhythm is what makes the pilot improve through the week rather than just running.",
        },
        {
          html: stepCard('calendar', 'green', 'Week 4 — Measure, present, fund the rollout',
            "Compare pilot users' week-4 work patterns against their week-1 baseline. Document hours saved, qualitative wins, and the prompt library that emerged. Present to the sponsor and CFO. Get sign-off on the broader rollout — with specific scope and budget. The pilot's product is the decision."),
          narration:
            "Week four. Measure. Present. Fund the broader rollout. Compare each pilot user's week-four work patterns against their week-one baseline. Document hours saved per user per week. The qualitative wins — the meeting that went better, the proposal that landed, the email that was less work. And the prompt library that emerged from the daily check-ins. Present all of it to the sponsor and the CFO at end of week four. Get sign-off on the broader rollout with specific scope and budget. The pilot's product is the decision — not the pretty deck. Walk in decision-ready; walk out with the sign-off.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The 20-user pilot is the right size',
        "Smaller than 20 — sample is too thin to defend. Larger than 30 — the daily rhythm breaks. Twenty is right. Pick deliberately across functions. Resist the pressure to expand the pilot scope during the four weeks; expansion comes after the funding decision."),
      calloutNarration:
        "The twenty-user pilot is the right size. Smaller than twenty — the sample is too thin to defend statistically and qualitatively to a CFO. Larger than thirty — the daily check-in rhythm breaks down and the change manager can't keep up. Twenty is right. Pick deliberately across functions for variety. And resist the pressure that will inevitably come during the four weeks to expand the pilot scope. Expansion comes after the funding decision at week four — not during the four weeks. Keep the pilot disciplined; the broader rollout depends on it.",
    },
    {
      title: 'Three pilot mistakes specific to Copilot',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · Mistakes',
      bodyHtml: `<p>Three pilot mistakes specific to Copilot rollouts. Each one has derailed real pilots. Recognise them at design time.</p>`,
      narrationLead:
        "Three pilot mistakes specific to Microsoft 365 Copilot rollouts. Each one has derailed real pilots at real organisations. Recognise them at design time and steer around them.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Mistake 1 — All pilot users from one function',
            "Pilot users all from finance, or all from marketing. The week-4 results don't generalise — the broader rollout will be different. Spread across 3–4 functions in the heavy persona; the variety produces defensible learning."),
          narration:
            "Mistake one. Pilot users all from one function. All twenty pilots from finance. Or all from marketing. The week-four results don't generalise across the organisation — the broader rollout will look different from the pilot, and the CFO will rightly question the extrapolation. Spread the twenty pilot users across three or four functions in the heavy persona. The variety produces defensible learning. The downside is slightly slower coordination during the four weeks; the upside is the rollout funding decision is much more credible.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Mistake 2 — No baseline measurement',
            "We touched on this in the generic pilot chapter. Worth repeating because it's the most common Copilot pilot mistake. Without a baseline, the week-4 numbers are unverifiable. Take 30 minutes per pilot user in week 1 to measure their baseline."),
          narration:
            "Mistake two. No baseline measurement. We touched on this in the generic pilot chapter in the GenAI for Business course. Worth repeating here because it's the most common Copilot pilot mistake by volume. Without a baseline of how the pilot users worked before Copilot, the week-four numbers are unverifiable to the CFO. Take thirty minutes per pilot user in week one to document their baseline. It's the cheapest insurance policy in the entire rollout. Don't skip it.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Mistake 3 — Pilot leadership in addition to day job',
            "The change manager running the pilot still has their full day job. The daily check-ins suffer. The prompt library doesn't get captured. The week-4 presentation is rushed. Give the pilot leader 50% of their week for the four weeks. Not optional."),
          narration:
            "Mistake three. Pilot leadership in addition to the day job. The change manager running the pilot is also expected to do their full normal job at one hundred percent. The daily check-ins suffer. The prompt library doesn't get captured. The week-four presentation gets rushed. Give the pilot leader fifty percent of their week for the four weeks. Not optional. Without that allocation, the pilot under-delivers, and the rollout starts behind. Most organisations under-resource the pilot leader and then wonder why the broader rollout struggles. Fund the role properly; the pilot ships properly.",
        },
      ],
    },
    {
      title: 'The week-4 presentation that funds the rollout',
      iconKey: 'flag',
      eyebrow: 'Lesson 3 · The presentation',
      bodyHtml: `<p>Three slides. One ask. Decision-ready.</p>`,
      narrationLead:
        "The week-four presentation that funds the broader rollout. Three slides. One specific ask. Decision-ready. Don't walk in with twelve slides; the CFO won't read them. Walk in with three slides that defend the decision they need to make.",
      steps: [
        {
          html: stepCard('flag', 'green', 'Slide 1 — The numbers',
            "Hours saved per pilot user per week (against baseline). Active usage rate. Prompt count per active user. Trended over the four weeks. Honest. Conservative. Defensible."),
          narration:
            "Slide one. The numbers. Hours saved per pilot user per week — measured against the baseline from week one. Active usage rate across the twenty pilots. Prompt count per active user. All trended over the four weeks of the pilot. Honest numbers. Conservative bands. Defensible to any follow-up question the CFO might ask. Don't inflate. The credibility you build with honest numbers funds three more pilots in the next two years. Inflated numbers fund nothing — the next conversation gets quietly harder.",
        },
        {
          html: stepCard('flag', 'blue', 'Slide 2 — The qualitative wins',
            "Three to five concrete stories. The proposal that got drafted in 20 minutes instead of 2 hours. The meeting that went better because of the prep summary. The email that was easier to write because of the draft. Specific. Named. Authentic."),
          narration:
            "Slide two. The qualitative wins. Three to five concrete stories from pilot users. The proposal that got drafted in twenty minutes instead of two hours. The meeting that went better because the user had a Copilot-prepared summary of the prior conversations. The email that was easier to write because the draft was already there. Specific. Named — with the pilot user's permission. Authentic. The qualitative wins balance the quantitative numbers. CFOs respond to both. They respond best when both align.",
        },
        {
          html: stepCard('flag', 'amber', 'Slide 3 — The ask',
            "Specific scope (e.g., 400 licenses across heavy + half of moderate persona). Specific budget. Specific timeline (90-day rollout to the full scope). Specific milestones the CFO can verify. One ask. Decision-ready."),
          narration:
            "Slide three. The ask. Specific scope — for example, four hundred licenses across all heavy persona users plus half of the moderate persona. Specific budget — based on the persona math from chapter two. Specific timeline — typically a ninety-day rollout to the full scope. Specific milestones the CFO can verify at thirty, sixty, and ninety days. One ask. Decision-ready. Walk in with this slide and your sponsor present; walk out with the sign-off. The whole pilot was designed to produce this conversation. Don't deflect it into a follow-up paper.",
        },
      ],
    },
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 4 — prompt libraries.</p>`,
      narrationLead:
        "Three anchors before chapter four — prompt libraries.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — 20 users · 4 weeks · daily rhythm',
            "Twenty heavy-persona users across 3–4 functions. Four weeks. Daily check-ins in a Teams channel. The shape that produces defensible learning."),
          narration:
            "One. Twenty users, four weeks, daily rhythm. Heavy-persona users across three or four functions. Four weeks. Daily fifteen-minute check-ins in a dedicated Teams channel. The shape that produces defensible learning — and the prompt library for the broader rollout.",
        },
        {
          html: stepCard('check', 'green', 'Two — Avoid three mistakes',
            "All-one-function · no baseline · pilot lead in addition to day job. Each preventable. Each costs the pilot meaningfully."),
          narration:
            "Two. Avoid the three pilot mistakes. All pilot users from one function. No baseline measurement. Pilot leader doing the role in addition to a full day job. Each one preventable. Each one costs the pilot meaningfully — and through the pilot, costs the rollout.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three-slide presentation, decision-ready',
            "Numbers · qualitative wins · the specific ask. Walk in with sponsor; walk out with sign-off. The pilot's product is the decision."),
          narration:
            "Three. Three-slide week-four presentation. Decision-ready. The numbers — honest and trended. The qualitative wins — specific, authentic. The ask — scope, budget, timeline, milestones. Walk in with the executive sponsor present. Walk out with the rollout sign-off. The pilot's product is the funding decision — not a beautiful deck nobody acts on.",
        },
      ],
      narrationTrail:
        "Chapter four — persona-based prompt libraries. The asset that makes adoption stick at the broader rollout. See you there.",
    },
  ],
}
