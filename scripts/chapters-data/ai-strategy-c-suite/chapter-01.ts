import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiStrategyChapter01: Chapter = {
  courseId: 'ai-strategy-c-suite',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-where-ai-value-lives',
  title: 'Where AI value lives',
  subtitle: 'Four patterns that pay — and the noise that doesn’t.',
  slides: [
    // SLIDE 1 — Opening
    {
      title: 'Where AI value lives',
      iconKey: 'compass',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">Most AI portfolios fail not because the technology was wrong — but because the C-suite funded the wrong pattern. In the next few minutes, we cut every AI initiative into four families. Three pay. One drains capital quietly.</p>`,
      narrationLead:
        "Welcome to chapter one. We're going to talk about where AI value actually lives — at the level a board cares about. Here's the uncomfortable truth. Most AI portfolios don't fail because the technology was wrong. They fail because the C-suite funded the wrong pattern. So in the next few minutes, we'll cut every AI initiative into four families. Three of them pay. One of them drains capital — quietly — until somebody notices in year three. Let's begin.",
    },

    // SLIDE 2 — The four patterns
    {
      title: 'The four AI value patterns',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · Taxonomy',
      bodyHtml: `<p>Every AI use case in your organisation falls into one of four shapes. The math, the buying motion, and the risk profile of each one are different — and a strategy that treats them the same is the strategy that fails.</p>`,
      narrationLead:
        "Let me give you a framework you can use the moment you leave this. Every AI use case in your organisation — and I mean every one — falls into one of four shapes. The math is different. The buying motion is different. The risk profile is different. A strategy that treats them the same is the strategy that fails. Here are the four.",
      steps: [
        {
          html: stepCard('zap', 'green', 'Pattern 1 — Productivity lift',
            "Employees do the same work, faster. Microsoft 365 Copilot, GitHub Copilot, drafting tools. Pays in <em>hours saved per person per week</em>. Low risk. Demands adoption — not technology."),
          narration:
            "Pattern one. Productivity lift. Your employees do the same work, but they do it faster. Microsoft 365 Copilot. GitHub Copilot. Drafting tools. The math here is simple — hours saved per person per week, multiplied by fully-loaded cost. The risk is low. The technology is mature. What it actually demands is adoption — not more technology.",
        },
        {
          html: stepCard('cog', 'blue', 'Pattern 2 — Process automation',
            "A specific business process — invoice extraction, contract review, reconciliation — moves from human-keyed to AI-assisted. Pays in <em>cycle time and error rate</em>. Medium risk. Demands data plumbing."),
          narration:
            "Pattern two. Process automation. A specific business process — invoice extraction, contract review, month-end reconciliation — moves from being human-keyed to AI-assisted. The math here is cycle time and error rate. The risk is medium. What it demands is data plumbing — getting the right systems talking to each other.",
        },
        {
          html: stepCard('users', 'amber', 'Pattern 3 — Agent-led work',
            "Multi-step work — loan origination, support tier-one, citizen services — handled end-to-end by an agent with human escalation. Pays in <em>variable cost per transaction</em>. Higher risk. Demands governance."),
          narration:
            "Pattern three. Agent-led work. This is the new one. Multi-step work that used to require humans throughout — loan origination, support tier-one, citizen services — now handled end-to-end by an agent. Humans only get involved on escalation. The math is variable cost per transaction. The risk is higher — and what it demands more than anything is governance.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Pattern 4 — Strategic theatre',
            "The lab, the chief AI officer with no budget, the press release. Pays in <em>nothing</em> — but soaks up calendar time and dilutes the other three patterns. Beware."),
          narration:
            "And pattern four. Strategic theatre. This is the lab. The chief AI officer with no budget. The press release. The cute demo at the all-hands. It pays in absolutely nothing — but it soaks up calendar time and dilutes the credibility of the other three patterns. The biggest AI risk for most C-suites isn't a runaway model. It's funding too much of pattern four.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'A simple test',
        "If you cannot point to <em>which of the four patterns</em> a proposal sits in — and the math the proposal uses — the proposal is not yet ready for capital."),
      calloutNarration:
        "Here's a simple test you can apply today. If a proposal lands on your desk and you cannot point to which of the four patterns it sits in — and the math that proposal uses — the proposal is not yet ready for capital. Send it back. That's not bureaucracy. That's the discipline that separates the AI programmes that compound from the ones that disappear.",
    },

    // SLIDE 3 — The portfolio shape
    {
      title: 'A healthy AI portfolio — by shape',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · Allocation',
      bodyHtml: `<p>You don't need every AI use case. You need the <em>right shape</em> of portfolio. Here's what we see at the firms that are actually getting value — measured in cash, not headlines.</p>`,
      narrationLead:
        "Let's talk about the shape of a healthy AI portfolio. You don't need every AI use case. You need the right shape. Here's what we see at the firms that are actually getting value — measured in cash, not in headlines.",
      steps: [
        {
          html: stepCard('check', 'green', 'About 50% — productivity lift',
            "Get the easy wins. Copilot rollout, drafting tools, transcription. These compound across the org without much risk."),
          narration:
            "Roughly fifty percent of the portfolio in productivity lift. That's the easy wins. Copilot rollout. Drafting tools. Meeting transcription. These compound across the organisation without much risk — and they fund the conversation about the patterns above them.",
        },
        {
          html: stepCard('check', 'blue', 'About 30% — process automation',
            "Two or three named processes per business unit. Each with a fixed budget, a sustainment plan, and a Go/No-Go review at the end of the pilot."),
          narration:
            "Roughly thirty percent in process automation. Two or three named processes per business unit. Each with a fixed budget. Each with a sustainment plan. Each with a Go-Slash-No-Go review at the end of the pilot. Not before. Not after. At the end of the pilot.",
        },
        {
          html: stepCard('check', 'amber', 'About 15% — agent-led work',
            "One ambitious agent program per year. Done right, this becomes the headline. Done wrong, this becomes a cautionary tale."),
          narration:
            "Around fifteen percent in agent-led work. One ambitious agent programme per year. Done right, this becomes your headline. Done wrong, this becomes a cautionary tale at next year's board meeting. So pick carefully — but do pick one.",
        },
        {
          html: stepCard('x', 'red', '5% — exploration (not theatre)',
            "A small, capped budget for genuine exploration. Capped is the operative word. If exploration exceeds 5% of your AI budget, something is wrong."),
          narration:
            "And the last five percent. Genuine exploration. Not theatre — exploration. A small, capped budget. Capped is the operative word here. If exploration exceeds five percent of your AI budget, something is wrong with the discipline.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'The number that matters',
        "Not <em>“how much are we spending on AI”</em>. The number is: <strong>how much of our AI spend in the last 12 months has a measurable, defensible business outcome attached</strong>. If the answer is below 60%, the portfolio is mis-shaped."),
      calloutNarration:
        "The number that matters at your next board meeting isn't how much you're spending on AI. The number is — how much of our AI spend in the last twelve months has a measurable, defensible business outcome attached. If the answer is below sixty percent, your portfolio is mis-shaped. And mis-shaped portfolios don't fix themselves. You fix them.",
    },

    // SLIDE 4 — Common traps
    {
      title: 'Three traps the C-suite walks into',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Pitfalls',
      bodyHtml: `<p>I've now seen these three patterns play out across enough boards that I can predict them — sometimes from the first sentence of the proposal. Watch for them.</p>`,
      narrationLead:
        "Before we close, three traps. I've seen these now across enough boards that I can predict them — sometimes from the first sentence of the proposal. So you watch for them.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Trap one — “We need an AI strategy”',
            "No, you need an AI <em>portfolio</em>. A strategy is a deck. A portfolio is a P&L item. Push for the portfolio, not the deck."),
          narration:
            "Trap one. Someone says — we need an AI strategy. No. You need an AI portfolio. A strategy is a deck. A portfolio is a P-and-L item. So push for the portfolio. Not the deck.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap two — “Let’s build it ourselves”',
            "On greenfield platforms, maybe. On commodity layers like document extraction or transcription, you're paying engineers to rebuild what's already in market. Buy the boring layer. Build only what's strategic."),
          narration:
            "Trap two. Someone says — let's build it ourselves. On a greenfield platform, maybe. But on the commodity layers — document extraction, transcription, vector search — you're paying engineers to rebuild what's already in the market. Buy the boring layer. Build only what is genuinely strategic.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap three — “We hired a CAIO, we’re set”',
            "Without authority over capital, headcount, and process owners, a Chief AI Officer is a coordinator with a title. Authority before title — every time."),
          narration:
            "Trap three. Someone says — we hired a Chief AI Officer, we're set. Without authority over capital, headcount, and process owners, a CAIO is a coordinator with a title. Authority before title — every single time. The title's not the lever. The capital is.",
        },
      ],
    },

    // SLIDE 5 — Takeaways
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>The two ideas to carry into the rest of the course — and into your next strategy session.</p>`,
      narrationLead:
        "Let's land this. Two ideas to carry forward into the rest of the course — and into your very next strategy session.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — patterns before projects',
            "Demand that every AI proposal name the pattern it sits in, and the math that pattern uses."),
          narration:
            "One. Patterns before projects. Demand that every AI proposal — without exception — name the pattern it sits in, and name the math that pattern uses. If they can't, they're not ready.",
        },
        {
          html: stepCard('check', 'green', 'Two — portfolios before strategy',
            "An AI strategy without a portfolio shape is theatre. A portfolio with the right shape is a P&L item — and an asset."),
          narration:
            "Two. Portfolios before strategy. An AI strategy that doesn't come with a portfolio shape is theatre. A portfolio with the right shape isn't a strategy slide — it's a P-and-L item. And eventually, an asset on the balance sheet.",
        },
      ],
      narrationTrail:
        "In the next chapter, we go one level deeper — into the discipline of actually building that portfolio. See you there.",
    },
  ],
}
