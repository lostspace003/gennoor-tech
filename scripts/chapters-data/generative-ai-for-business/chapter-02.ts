import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const genAiBizChapter02: Chapter = {
  courseId: 'generative-ai-for-business',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-the-roi-conversation',
  title: 'The ROI conversation',
  subtitle: 'The math your CFO will eventually ask you to defend.',
  slides: [
    // SLIDE 1
    {
      title: 'The ROI conversation',
      iconKey: 'target',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">Every AI initiative needs an ROI conversation. Sometimes you have it before you start. Often you have it six months in, when finance asks where the money went. Either way — knowing the four ROI patterns, the inputs that matter, and the conservative honest math protects your credibility.</p>`,
      narrationLead:
        "Welcome to chapter two. The ROI conversation. Every AI initiative needs one. Sometimes you have it before you start. Often you have it six months in, when finance asks where the money went. Either way — knowing the four ROI patterns, the inputs that matter, and how to present conservative honest math is what protects your credibility as a manager funding AI work. In the next few minutes, the playbook.",
    },
    // SLIDE 2
    {
      title: 'The four ROI patterns',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · ROI patterns',
      bodyHtml: `<p>Four patterns. Most AI ROI claims you’ll hear are one of these four — sometimes mixed. Know which pattern your initiative falls into and the math becomes clear.</p>`,
      narrationLead:
        "Four ROI patterns. Almost every AI ROI claim you'll hear is one of these four — sometimes mixed. Knowing which pattern your specific initiative falls into makes the math clear. Knowing which pattern a vendor's pitch is using makes the pitch evaluable.",
      steps: [
        {
          html: stepCard('zap', 'green', 'Pattern 1 — Time saved',
            "Hours per person per week, multiplied by fully-loaded cost. The simplest ROI math. Works for drafting tools, summarisers, Copilot rollouts. The number is real — but only when adoption is real."),
          narration:
            "Pattern one. Time saved. Hours per person per week, multiplied by fully-loaded cost per hour. The simplest ROI math. It works for drafting tools, summarisers, Microsoft Copilot rollouts — anything that compresses how long routine work takes. The number is genuinely real — but only when adoption is genuinely real. A team that has the license and never opens it produces zero time saved. So this pattern's honesty is gated on adoption tracking. Adoption rate goes on the same slide as time saved. Always.",
        },
        {
          html: stepCard('cog', 'blue', 'Pattern 2 — Throughput increased',
            "More cases processed per person per day. Works for document extraction, claim triage, customer service tier one. The math is per-case unit cost going down. Easier to defend than time-saved because it's directly observable in operational data."),
          narration:
            "Pattern two. Throughput increased. More cases processed per person per day — or per shift, or per week. Works for document extraction, insurance claim triage, customer service tier one, and similar operational processes. The math is per-case unit cost going down. This pattern is easier to defend than time saved — because throughput is directly observable in operational systems. You don't need to trust self-reported time savings. You can see the production numbers. Pick this pattern when you have a process with clear unit volume.",
        },
        {
          html: stepCard('search', 'amber', 'Pattern 3 — Errors avoided',
            "Fewer mistakes that would have cost money — missed renewals, misclassified items, missed fraud. Hardest to defend because you're measuring something that didn't happen. Track baseline rates carefully and use external benchmarks where you can."),
          narration:
            "Pattern three. Errors avoided. Fewer mistakes that would have cost money. Missed contract renewals. Misclassified items. Missed fraud signals. This pattern is the hardest to defend — because you're measuring something that didn't happen. The CFO has every right to ask, prove the errors would have happened without AI. So track baseline error rates carefully before deployment. Use external benchmarks from your industry where you can. And present this pattern with conservative bands — under-claim rather than over-claim. The credibility you save is your own.",
        },
        {
          html: stepCard('rocket', 'green', 'Pattern 4 — New work that wasn\'t possible before',
            "Whole categories of work the team couldn't do before because they were too expensive. Personalised customer communications at scale. Multi-language support in markets you weren't serving. This is the most exciting pattern — and the slowest to materialise. Plan for year 2+, not year 1."),
          narration:
            "Pattern four. New work that wasn't possible before. Whole categories of work the team simply couldn't take on because they were too expensive at small unit volumes. Personalised customer communications at scale. Multi-language support in markets you weren't previously serving. Custom proposals for small accounts. This is the most exciting pattern — and the slowest to materialise. It typically shows up in year two or beyond. Don't pitch this pattern as your year-one ROI. It rarely materialises that fast. Pitch it as the strategic optionality you're building toward. Realistic expectations win credibility.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Use one pattern per pitch',
        "Don't blend the four patterns in a single ROI slide — it confuses the CFO and gives them four things to challenge. Pick the primary pattern for your initiative and lead with it. Mention the others as upside, not as core math."),
      calloutNarration:
        "An important presentation discipline. Don't blend the four patterns in a single ROI slide. It confuses the CFO. And it gives them four things to challenge — when they only needed one to push back on the whole proposal. Pick the primary ROI pattern for your specific initiative and lead with it. Mention the others as upside or as forward-looking opportunities — not as part of the core math. This single discipline raises the pass rate of AI proposals at investment committee meetings significantly. Try it.",
    },
    // SLIDE 3
    {
      title: 'The conservative ROI presentation',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · Honest math',
      bodyHtml: `<p>Three numbers. Show all three. Conservative wins long-term credibility. Aspirational wins one funding cycle — and loses the next.</p>`,
      narrationLead:
        "Three numbers to show on every ROI slide. Show all three. Conservative wins long-term credibility. Aspirational wins one funding cycle and loses the next. Here are the three.",
      steps: [
        {
          html: stepCard('check', 'green', 'Number 1 — The conservative scenario',
            "Realistic adoption (50–60% by month 6). Realistic per-user savings. Sustainment cost included. This is the number the CFO will believe. If the conservative is positive, your initiative funds itself."),
          narration:
            "Number one. The conservative scenario. Realistic adoption — typically fifty to sixty percent of licensed users by month six. Realistic per-user savings — not the vendor's brochure number, your own observed pilot number. And critically, sustainment cost included as an ongoing line. This is the number your CFO will actually believe. If the conservative scenario is positive, your initiative funds itself. If the conservative scenario barely breaks even — the initiative is marginal. Be honest about which.",
        },
        {
          html: stepCard('check', 'blue', 'Number 2 — The likely scenario',
            "Standard adoption (70%), standard savings, sustainment included. This is the middle bet. Present it alongside the conservative so the CFO sees the range — not just the floor or the ceiling."),
          narration:
            "Number two. The likely scenario. Standard adoption around seventy percent. Standard observed savings. Sustainment included. This is the middle bet. The most probable outcome based on what similar deployments have produced. Present it alongside the conservative scenario so the CFO sees the range — not just the floor of conservative, not just the ceiling of best case. The range is what builds credibility. Single-point estimates do not.",
        },
        {
          html: stepCard('check', 'amber', 'Number 3 — The aspirational scenario',
            "What's possible if adoption hits 85%+, use cases compound, and the team starts using AI for work they weren't planning. Present it last. Label it clearly. It's the upside — not the commitment."),
          narration:
            "Number three. The aspirational scenario. What's possible if adoption hits eighty-five percent or higher. If the team starts using AI for work that wasn't in the original scope. If a second wave of use cases compounds onto the first. Present it last. Label it clearly as aspirational. It's the upside story — it's not the commitment you're making. Many managers present aspirational as their core number — and then disappoint the CFO at month six. Don't be that manager. Lead with conservative. Let aspirational be a pleasant surprise rather than a missed commitment.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The five hidden costs that wreck the math',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Hidden costs',
      bodyHtml: `<p>Five costs that often don’t appear in the vendor’s ROI calculator — but always appear in your actual budget. Add them up front; defend the math at month six.</p>`,
      narrationLead:
        "Five costs that often don't appear in the vendor's ROI calculator. They always appear in your actual budget — usually at month six, just before the CFO asks why the numbers don't match. Add them upfront. Defend the math at month six because you already disclosed them at month zero.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', '1 · Sustainment / retainer',
            "After launch, somebody maintains the tool — answering questions, updating prompts, watching adoption. Typically 15–25% of year-1 spend, recurring. Often forgotten in the vendor's slide. Always real."),
          narration:
            "Cost one. Sustainment and retainer. After launch, somebody maintains the tool. Answering questions from the team. Updating prompt libraries as the work changes. Watching adoption. Investigating drops. This typically lands at fifteen to twenty-five percent of year-one spend, recurring annually. Often forgotten in the vendor's ROI slide. Always real in the actual P-and-L. Add it from day one.",
        },
        {
          html: stepCard('alertTriangle', 'red', '2 · Training and change management',
            "The licenses are cheap. The training to make the team use them well is not. Budget specifically for training — and for the time the team spends not doing their day job while they learn."),
          narration:
            "Cost two. Training and change management. The licenses themselves are cheap. The training that makes the team actually use them well is not. Budget specifically for training time. And for the time the team spends not doing their day job while they're learning. The second one is the hidden cost — and the one most managers under-estimate. A team of twenty losing a day each on training is twenty days of work the rest of the organisation isn't getting from your team that week. Add it to the math.",
        },
        {
          html: stepCard('alertTriangle', 'red', '3 · IT and security overhead',
            "Every new AI tool needs IT review, security assessment, data classification, vendor onboarding. Add a quarter of IT and security headcount cost for any meaningful deployment. Underestimated by vendor calculators that show the tool cost only."),
          narration:
            "Cost three. IT and security overhead. Every new AI tool needs IT review. Security assessment. Data classification. Vendor onboarding. Sometimes a procurement review on top of all of that. For any meaningful AI deployment in a corporate environment, add roughly a quarter of an IT or security headcount cost to your math. Underestimated by vendor calculators that show only the tool cost. It is real work, done by real people, that comes out of someone's budget.",
        },
        {
          html: stepCard('alertTriangle', 'red', '4 · Productivity drag during transition',
            "For the first 2–3 months, the team is slower while they learn. Their hourly cost is still being paid; their hourly output is down 10–15%. Real, temporary, and often invisible in the post-hoc accounting. Plan for it."),
          narration:
            "Cost four. Productivity drag during the transition. For the first two to three months, the team is slower while they learn. Their hourly cost is still being paid. Their hourly output is down ten to fifteen percent compared to before the change. This is real. It is temporary. And it is often invisible in the post-hoc accounting because the team eventually catches up and exceeds. But during the transition, the cost is in your budget — just not on a line item that anybody named. Plan for it. Disclose it. Don't get caught at month three when the CFO sees the dip.",
        },
        {
          html: stepCard('alertTriangle', 'red', '5 · Tool sprawl across the team',
            "If different parts of your team start using different AI tools — three drafting tools, two summarisers, one transcription — you're paying for capability four times. Centralise the tooling decision early. The annual saving is rarely under $30k for a mid-sized team."),
          narration:
            "Cost five. Tool sprawl across the team. If different parts of your team start using different AI tools — three different drafting tools, two summarisers, one transcription tool — you're paying for the same capability multiple times. And the team is fragmenting on which prompt patterns to share with each other. Centralise the tooling decision early. The annual saving from doing this well is rarely under thirty thousand dollars for a mid-sized team. And the operational benefit — shared prompts, shared learnings — is significant.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 3 — use case discovery in your team.</p>`,
      narrationLead:
        "Three anchors before chapter three — where we move to use case discovery within your team.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Pick one ROI pattern, lead with it',
            "Time saved, throughput, errors avoided, new work. Pick the right one for your initiative. Don't blend in a single slide."),
          narration:
            "One. Pick one ROI pattern and lead with it. Time saved. Throughput. Errors avoided. New work. The four patterns. Pick the right one for your specific initiative and lead with it. Don't blend the four in a single ROI slide — it confuses the CFO and weakens the case.",
        },
        {
          html: stepCard('check', 'green', 'Two — Show three scenarios, lead with conservative',
            "Conservative · likely · aspirational. The range builds credibility. The single-point estimate doesn't. Aspirational is the upside — not the commitment."),
          narration:
            "Two. Show three scenarios. Conservative, likely, aspirational. Lead with conservative. The range builds credibility — single-point estimates do not. Aspirational is the upside story, not the commitment. Don't get caught presenting aspirational as the commitment and missing it at month six.",
        },
        {
          html: stepCard('check', 'green', 'Three — Add the five hidden costs upfront',
            "Sustainment · training · IT/security · transition drag · tool sprawl. Disclose at month zero. Then defend the numbers at month six because you already disclosed them."),
          narration:
            "Three. Add the five hidden costs upfront in your initial business case. Sustainment. Training. IT and security overhead. Productivity drag during transition. Tool sprawl. Disclose them at month zero. Then defend your numbers at month six because you already disclosed them. The manager who surprises the CFO at month six loses budget for the next initiative. The manager who told them at month zero keeps the budget.",
        },
      ],
      narrationTrail:
        "Chapter three — finding the right use case in your team. The discovery work that determines everything downstream. See you there.",
    },
  ],
}
