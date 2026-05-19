import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiStrategyChapter08: Chapter = {
  courseId: 'ai-strategy-c-suite',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your AI strategy on one page',
  subtitle: 'Seven chapters down — now we land it as one page you can actually use on Monday.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your AI strategy on one page',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In the previous seven chapters, we built a complete C-suite view of an AI programme. Now we collapse it — to one page you can put in front of your CEO, your CFO, your board, and your own leadership team. Same page. One conversation.</p>`,
      narrationLead:
        "Welcome to the final chapter. The capstone. In the previous seven chapters, we built a complete C-suite view of an AI programme. Now — we collapse it. To one page. One page that you can put in front of your CEO. Your CFO. Your board. Your own leadership team. Same page. One conversation across everybody. Here's what's on it.",
    },
    // SLIDE 2
    {
      title: 'The one-page AI strategy',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The template',
      bodyHtml: `<p>One page. Five sections. Anyone in the C-suite can read it in two minutes — and challenge it in five.</p>`,
      narrationLead:
        "One page. Five sections. Anyone in the C-suite can read it in two minutes — and challenge it in five. Here are the five sections.",
      steps: [
        {
          html: stepCard('compass', 'blue', '1 · The portfolio shape',
            "“We are running an AI portfolio with this allocation: X% productivity lift, Y% process automation, Z% agent-led, W% exploration. Year-one investment band: $A–$B. Sustainment reserve: 20%.”"),
          narration:
            "Section one. The portfolio shape. We are running an AI portfolio with this allocation. X percent productivity lift. Y percent process automation. Z percent agent-led. W percent exploration. Year-one investment band — A to B dollars. Sustainment reserve — twenty percent. Three sentences. The portfolio shape, anchored.",
        },
        {
          html: stepCard('rocket', 'amber', '2 · The 12-month sequence',
            "“Month 1: diagnostic + foundational training. Months 2–4: two PoCs in parallel. Months 5–8: build the winner. Months 9–12: sustainment + second wave.”"),
          narration:
            "Section two. The twelve-month sequence. Month one. Diagnostic and foundational training. Months two through four. Two proofs of concept running in parallel. Months five through eight. Build the winner. Months nine through twelve. Sustainment plus the second wave. Four lines. The cadence of the programme, visible on one page.",
        },
        {
          html: stepCard('users', 'green', '3 · The team',
            "“Hub: head of AI, lead engineer, governance lead. Spokes: one per BU. Year-one sourcing: 20% hire, 40% partner, 40% borrow. Year-three target: 50% hire, 20% partner, 30% borrow.”"),
          narration:
            "Section three. The team. The hub — head of AI, lead engineer, governance lead. The spokes — one per business unit. Year-one sourcing mix — twenty percent hire, forty percent partner, forty percent borrow. Year-three target — fifty hire, twenty partner, thirty borrow. The team shape, with its evolution.",
        },
        {
          html: stepCard('shield', 'blue', '4 · The governance posture',
            "“Inventory live. Tiering rule published. Controls proportional to tier. Incident response tested. Independent reporting line into [risk / legal / audit committee].”"),
          narration:
            "Section four. The governance posture. Inventory live. Tiering rule published. Controls proportional to tier. Incident response tested. Independent reporting line — into risk, legal, or the audit committee, depending on your firm. Five short statements. Each one defensible. Each one auditable.",
        },
        {
          html: stepCard('target', 'amber', '5 · The four numbers',
            "“Spend vs outcomes target: >60%. Active adoption target: >50% productivity / >70% agents. Incidents reported quarterly with tier and resolution. Forward pipeline updated quarterly.”"),
          narration:
            "Section five. The four numbers from chapter seven. Spend versus outcomes target — above sixty percent. Active adoption target — above fifty percent for productivity tools, above seventy percent for agents. Incidents reported quarterly with tier and resolution. Forward pipeline updated quarterly. That's the entire scoreboard.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Pin it on the wall',
        "The one-pager isn't a strategy document. It's an operating contract. Pin it on the wall behind your desk. When somebody walks in with an AI proposal, hold their proposal up against it. If it doesn't fit, ask why."),
      calloutNarration:
        "Here's how the one-pager actually gets used. It isn't a strategy document. It's an operating contract. Pin it on the wall behind your desk. When somebody walks in with an AI proposal, hold their proposal up against this page. If the proposal doesn't fit — into the portfolio shape, into the sequence, into the team, into the governance, into the four numbers — ask them why. That single discipline filters out about seventy percent of proposals that would otherwise eat your year. Use it.",
    },
    // SLIDE 3
    {
      title: 'The leadership team conversation',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · The conversation',
      bodyHtml: `<p>You also have your own leadership team to align. Use the same one-pager. Three questions to drive the conversation — they tell you whether the team is aligned.</p>`,
      narrationLead:
        "You also have your own leadership team to align. Use the same one-pager. Three questions to drive the conversation. The answers tell you whether your team is aligned — or whether you've got more work to do before the next board meeting.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Question 1 — to the CFO',
            "“Do you feel this portfolio shape is fundable, with our growth assumptions and our cost of capital?” If the CFO is uncomfortable, you have a CFO problem before you have an AI problem."),
          narration:
            "Question one. To the CFO. Do you feel this portfolio shape is fundable — given our growth assumptions and our cost of capital? If the CFO is uncomfortable here, you have a CFO problem before you have an AI problem. Address the CFO conversation first. Otherwise, every quarterly review becomes a fight you didn't plan for.",
        },
        {
          html: stepCard('search', 'amber', 'Question 2 — to the COO',
            "“Can your business units absorb this sequence, with the adoption work I'm asking for?” If the COO can't see how the business units absorb it, the sequence is wrong — not the COO."),
          narration:
            "Question two. To the COO. Can your business units absorb this sequence — with the adoption work I'm asking for? If the COO cannot see how the business units absorb it, the sequence is wrong — not the COO. Adjust the sequence. The COO is closer to the floor than the strategy is. Trust the floor.",
        },
        {
          html: stepCard('search', 'green', 'Question 3 — to the GC / risk leader',
            "“Does this governance posture survive an external examination today?” If not, fix the posture before scaling the portfolio. The order matters."),
          narration:
            "Question three. To the General Counsel — or your senior risk leader. Does this governance posture survive an external examination today? Not in six months. Today. If not, fix the posture before scaling the portfolio further. The order matters here. Building more on top of weak governance multiplies the eventual remediation cost. Fix the foundation first.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'What comes next — beyond the strategy course',
      iconKey: 'rocket',
      eyebrow: 'Lesson 3 · Onward',
      bodyHtml: `<p>This course gave you the executive view. There's more in the library — and most of it pairs with a specific decision you'll have to make in the next 12 months.</p>`,
      narrationLead:
        "This course gave you the executive view. There's more in the library. And most of it pairs with a specific decision you'll have to make in the next twelve months. Three things to consider next.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', '1 · AI Governance & Risk for Boards',
            "If you have board responsibilities or report to a board, the next course extends chapter 5 into the full audit-committee playbook. The board pack template alone is worth the time."),
          narration:
            "One. If you have board responsibilities, or if you report to a board, the next course in this library — AI Governance and Risk for Boards — extends chapter five into the full audit-committee playbook. The board pack template alone is worth the time.",
        },
        {
          html: stepCard('bookOpen', 'amber', '2 · AI ROI & Business Case Building',
            "For the financial discipline behind chapter 3 — how to write the actual business case that funds your portfolio. Templates, the four ROI patterns, the common traps."),
          narration:
            "Two. AI ROI and Business Case Building. This is for the financial discipline behind chapter three. How to write the actual business case that funds your portfolio. Templates. The four ROI patterns. The common traps. If your CFO conversation isn't yet aligned, this course is the bridge.",
        },
        {
          html: stepCard('bookOpen', 'green', '3 · A 30-minute scoping call',
            "If you're ready to convert this one-pager into an actual programme — phase one, phase two, the team, the partner — the most efficient next step is a 30-minute call. We listen, ask three honest questions, and tell you whether we're the right partner. Even if the answer is no."),
          narration:
            "Three. If you're ready to convert this one-pager into an actual programme — phase one, phase two, the team, the partner — the most efficient next step is a thirty-minute call. We listen. We ask three honest questions. And we tell you whether we're the right partner for your specific situation. Even if the answer is no — and sometimes it is. That candour is the point.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p class="lead">In two or three years, AI will be infrastructure. The C-suites that figured this out early — that built the portfolios, the disciplines, the governance, the cadence — will be the ones running their organisations from a calmer place than their peers.</p>
      <p>The discipline outranks the technology. Every time.</p>
      <p>Thank you for spending the last few hours with me.</p>`,
      narrationLead:
        "And one final thought to close this out. In two or three years, AI will be infrastructure. Like electricity. Like the cloud. You'll stop calling it AI — you'll just call it the system. The C-suites that figured this out early — that built the portfolios, the disciplines, the governance, the cadence — will be the ones running their organisations from a calmer place than their peers. Not from a more dramatic place. From a calmer place. The discipline outranks the technology. Every single time. Thank you for spending the last few hours with me. Now go put the one-pager on your wall. And start with the diagnostic.",
    },
    // SLIDE 6 — Key takeaways
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'check',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>The three things to carry out of this whole course — into your next strategy meeting.</p>`,
      narrationLead:
        "Three things to carry out of the whole course. Into your very next strategy meeting.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Patterns, not projects',
            "Every AI proposal must name its pattern and its math. Without those two, it's not ready for capital. Apply this filter from Monday."),
          narration:
            "One. Patterns, not projects. Every AI proposal must name the pattern it sits in, and the math that pattern uses. Without those two, it isn't ready for capital. Apply that filter from Monday onwards.",
        },
        {
          html: stepCard('check', 'green', 'Two — Portfolio shape, not deck',
            "70/20/10 across maturity. 20% sustainment reserve. Phase-gated capital. That's the shape. Defend it."),
          narration:
            "Two. Portfolio shape — not deck. Seventy, twenty, ten across maturity. Twenty percent sustainment reserve. Phase-gated capital. That's the shape. Defend it at the CFO conversation. Defend it at the board.",
        },
        {
          html: stepCard('check', 'green', 'Three — Discipline outranks technology',
            "The five phases. The four numbers. The four narratives. The cadence by audience. None of these are about the technology. All of them are about whether the programme will still be alive in year three."),
          narration:
            "Three. Discipline outranks technology. The five phases. The four numbers. The four narratives. The cadence by audience. None of these are about the AI itself. All of them are about whether your AI programme will still be alive in year three. Build the discipline. The technology takes care of itself.",
        },
      ],
      narrationTrail:
        "Thank you. Truly. Go build the portfolio. We'll see you at the next decision point.",
    },
  ],
}
