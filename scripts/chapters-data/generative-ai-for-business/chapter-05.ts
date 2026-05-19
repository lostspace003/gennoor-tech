import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const genAiBizChapter05: Chapter = {
  courseId: 'generative-ai-for-business',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-pilot-design',
  title: 'Pilot design',
  subtitle: 'The four-week template that ships something measurable — and the four common pilot mistakes to avoid.',
  slides: [
    // SLIDE 1
    {
      title: 'Pilot design',
      iconKey: 'rocket',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">A good pilot ships something measurable in four weeks. A bad pilot drags into a quarter, produces a demo nobody uses, and loses you the next budget cycle. In the next few minutes, the template that ships — and the four mistakes that derail it.</p>`,
      narrationLead:
        "Welcome to chapter five. Pilot design. A good pilot ships something measurable in four weeks. A bad pilot drags into a quarter, produces a beautiful demo that nobody uses, and quietly loses you the next budget cycle. The difference between the two outcomes is mostly the pilot design — not the technology, not the vendor, not the team. The design. In the next few minutes, the template that ships, and the four mistakes that derail it.",
    },
    // SLIDE 2
    {
      title: 'The four-week pilot template',
      iconKey: 'calendar',
      eyebrow: 'Lesson 1 · The template',
      bodyHtml: `<p>Four weeks. Four phases. Each one with a specific deliverable. Adjust to your scale, but keep the shape.</p>`,
      narrationLead:
        "Four weeks. Four phases. Each one with a specific deliverable. Adjust the numbers to your specific scale — but keep the shape. The shape is what makes the pilot ship. Skip a phase and the pilot slips.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Week 1 — Scope and sample',
            "Define the use case crisply — one sentence. Collect 50 representative work items the AI will handle. Define success metrics with the team. By Friday, the scope document is signed and the sample is ready."),
          narration:
            "Week one. Scope and sample. Define the use case crisply, in one sentence everyone on the team can repeat. Collect fifty representative work items the AI will actually handle in the pilot — fifty emails to summarise, fifty invoices to extract, fifty support tickets to classify. Define success metrics together with the team — typically a quality threshold plus a time-saved figure. By the end of Friday, the scope document is signed by you and your sponsor. The sample is ready. Without this week, everything downstream slips.",
        },
        {
          html: stepCard('calendar', 'blue', 'Week 2 — Build with the vendor',
            "Vendor configures the tool against your sample. You and 1–2 team members review the output. Iterate three or four times. By Friday, the tool is producing acceptable output on 80%+ of the sample."),
          narration:
            "Week two. Build with the vendor. The vendor configures the tool against your sample set. You and one or two team members review the output together. Iterate three or four times — adjusting prompts, adding context, refining categories. By the end of Friday, the tool should be producing acceptable output on eighty percent or more of the sample. If it isn't, the scope from week one was off — and the right move is to revisit scope, not to push the build harder. That's a difficult conversation. Have it anyway.",
        },
        {
          html: stepCard('calendar', 'amber', 'Week 3 — Pilot live with 3–5 team members',
            "Three to five team members use the tool on real work. Daily 15-minute check-ins. Capture what works, what doesn't, what the team would change. Adjust based on real usage — not just the sample."),
          narration:
            "Week three. Pilot live with three to five team members. They use the tool on real work — not the sample. Daily fifteen-minute check-ins to capture what works, what doesn't, what the team would change. This week is where the real learning happens. The sample tells you the tool can work. The live pilot tells you whether it works for your team specifically — with their habits, their context, their edge cases. Listen carefully. Adjust based on real usage, not on what the sample suggested.",
        },
        {
          html: stepCard('calendar', 'green', 'Week 4 — Measure and decide',
            "Quantitative — time saved, quality score, error rate. Qualitative — would the team use this if we ended the pilot? Decision: scale to whole team, iterate, or pivot. Don't drag the pilot. The decision matters more than the comfort."),
          narration:
            "Week four. Measure and decide. Quantitative measurements — time saved per task, quality score against your defined threshold, error rate. Qualitative — would the team use this voluntarily if you ended the pilot today. The qualitative answer is often more important than the quantitative one. Then decide. Scale to the whole team. Iterate for another two to four weeks. Or pivot to a different use case. The decision is the deliverable of week four. Don't drag the pilot into week eight because you're uncomfortable deciding. The decision matters more than the comfort.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The pilot is a forcing function',
        "The pilot exists to force a decision at week 4 — scale, iterate, or stop. Pilots that drag into quarter 2 are not pilots. They are unfunded research projects. Decide on schedule, every time."),
      calloutNarration:
        "Underline this. The pilot exists to force a decision at the end of week four. Scale to the whole team. Iterate for a defined further period. Or stop. Pilots that drag into quarter two are not pilots any more. They are unfunded research projects — and they erode your team's credibility quietly. Decide on schedule. Every time. Even when the decision is, the technology isn't ready, let's stop. That decision is fine. The drag is what kills the next initiative.",
    },
    // SLIDE 3
    {
      title: 'The pilot success metrics — pick three',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · Metrics',
      bodyHtml: `<p>Three metrics, no more. Defined before the pilot starts. Measured during. Reviewed at decision time. Three is the right number — five is theatre.</p>`,
      narrationLead:
        "Three metrics for the pilot, no more. Defined before the pilot starts. Measured during. Reviewed at decision time. Three is the right number. Five is theatre. The team won't remember five. They'll remember three. So will your sponsor.",
      steps: [
        {
          html: stepCard('target', 'blue', '1 · Quality (the threshold)',
            "Output quality at or above the defined threshold — typically 95% acceptable to the team without rework. This is the floor. Below it, the rest of the metrics don't matter."),
          narration:
            "Metric one. Quality. Output quality at or above the threshold you defined in week one. Typically ninety-five percent of the output is acceptable to the team without significant rework. This is the floor. Below it, none of the rest of the metrics matter — because if the team has to rework the output anyway, there's no time saved and no error reduction. Get quality above the threshold first. Then the other metrics matter.",
        },
        {
          html: stepCard('target', 'green', '2 · Time saved (the operational benefit)',
            "Minutes saved per task — measured against the pre-pilot baseline. Realistic year-1 numbers — drafting tools save 30–50%, summarisers save 50–70%, extraction saves 70–85%. Track honestly."),
          narration:
            "Metric two. Time saved. Minutes saved per task, measured against the pre-pilot baseline. The realistic year-one numbers — drafting tools save thirty to fifty percent of the time. Summarisation tools save fifty to seventy percent. Extraction tools save seventy to eighty-five percent. Track honestly. Numbers above these bands are usually self-reported optimism. Numbers below mean the tool isn't fitting the task well — investigate before scaling.",
        },
        {
          html: stepCard('target', 'amber', '3 · Voluntary usage (the trust signal)',
            "Would the team use this voluntarily if you stopped the pilot? Ask each team member directly at the end of week 3. If 4 out of 5 say yes, scale. If 2 out of 5 — investigate. If 1 out of 5 — stop."),
          narration:
            "Metric three. Voluntary usage — the trust signal. Would the team use this tool voluntarily if you stopped the pilot today? Ask each pilot team member directly at the end of week three. Specifically — not as a group, where social pressure shapes the answer. In private. If four out of five team members say yes, scale. If two out of five — investigate what's going wrong before scaling. If only one out of five — stop. This metric catches things the quantitative metrics miss. The team's quiet vote is often more accurate than the numbers.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Four pilot mistakes that derail',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Mistakes',
      bodyHtml: `<p>Four pilot mistakes I see consistently. Each one extends the pilot by a month and reduces the chance of a Yes decision at the end. Avoid them.</p>`,
      narrationLead:
        "Four pilot mistakes I see consistently across teams. Each one extends the pilot by a month and reduces the chance of a Yes decision at the end. Recognise them. Steer around them.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Mistake 1 — Too many people in the pilot',
            "Three to five is the right size. Beyond that, communication overhead drowns the iteration speed. Twenty-person pilots are not pilots; they're early rollouts that haven't earned the right to scale."),
          narration:
            "Mistake one. Too many people in the pilot. Three to five is the right size. Beyond that, communication overhead drowns the iteration speed. Twenty-person pilots are not pilots. They are early rollouts that haven't yet earned the right to scale. Keep the pilot small. The learning is faster. The decision is cleaner. The scale happens after the pilot — not during it.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Mistake 2 — No baseline measurement',
            "If you didn't measure how long the task currently takes before the pilot, you can't claim time saved at the end. Take 30 minutes of week 1 to measure the baseline. It's the cheapest insurance policy in the pilot."),
          narration:
            "Mistake two. No baseline measurement. If you didn't measure how long the task currently takes — without AI — before the pilot starts, you cannot honestly claim time saved at the end. The CFO will catch this. The honest answer is unknown rather than fictional. Avoid the situation. Take thirty minutes in week one to measure the baseline with two or three team members. It is the cheapest insurance policy in the entire pilot.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Mistake 3 — Pilot leadership in addition to day job',
            "If the pilot lead is also doing their normal job at 100%, the pilot underperforms — usually by 30–40%. Give the pilot lead 20% of their week for the four weeks. Not zero. Not negotiable."),
          narration:
            "Mistake three. Pilot leadership in addition to the day job. If the person leading the pilot is also doing their normal full job at one hundred percent capacity, the pilot underperforms — usually by thirty to forty percent. The pilot needs roughly twenty percent of their week for four weeks. Not zero. Not negotiable. If you can't free up that twenty percent, delay the pilot. Don't run a half-resourced pilot. The result is half-resourced learning — and a difficult decision at week four because the data is muddy.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Mistake 4 — No sponsor for the decision',
            "Pilots that end in indecision are pilots without a clear sponsor. Name the sponsor in week 1. Brief them at week 2 mid-point. Present the week-4 decision to them, with a clear ask. Decisions need owners."),
          narration:
            "Mistake four. No sponsor for the decision at the end. Pilots that end in indecision are usually pilots without a clear executive sponsor for the decision. Name the sponsor in week one. Brief them at the week two mid-point so they're prepared. Present the week-four decision to them with a clear ask — scale, iterate, or stop. Decisions need owners. Without an owner, the pilot becomes a status update that nobody acts on. Don't let that happen. The sponsor's signature on the decision is the artefact that funds the next stage.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 6 — the adoption playbook.</p>`,
      narrationLead:
        "Three anchors before we move to the adoption playbook in chapter six.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four weeks, four phases',
            "Scope · build · pilot live · measure and decide. Decision at week 4 is the deliverable. Don't drag into quarter 2."),
          narration:
            "One. Four weeks, four phases. Scope and sample. Build with the vendor. Pilot live with three to five team members. Measure and decide. The decision at week four is the deliverable. Don't drag the pilot into quarter two because you're uncomfortable deciding.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three metrics, not five',
            "Quality · time saved · voluntary usage. Three is what the team remembers. Five is theatre."),
          narration:
            "Two. Three metrics, not five. Quality against the defined threshold. Time saved against the baseline. Voluntary usage — would the team use this if you stopped today. Three is what the team and the sponsor will remember. Five is theatre and dilutes the signal.",
        },
        {
          html: stepCard('check', 'green', 'Three — Avoid the four mistakes',
            "Too many people · no baseline · unfunded lead · no sponsor. Each one costs a month. All four are preventable."),
          narration:
            "Three. Avoid the four mistakes. Too many people in the pilot. No baseline measurement. Pilot lead also doing their full day job. No sponsor for the decision. Each one costs a month of pilot time. All four are preventable at design time. Prevent them. The pilot ships.",
        },
      ],
      narrationTrail:
        "Chapter six — the adoption playbook. How to make the pilot stick after it ships. See you there.",
    },
  ],
}
