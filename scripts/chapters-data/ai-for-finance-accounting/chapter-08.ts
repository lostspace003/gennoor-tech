import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForFinanceChapter08: Chapter = {
  courseId: 'ai-for-finance-accounting',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your finance AI roadmap on one page',
  subtitle: 'Seven chapters down. Now we land it as a one-pager you can present at next month\'s leadership meeting.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your finance AI roadmap on one page',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In the previous seven chapters, we built a complete finance-function view of AI. Now — one roadmap. One page. Something you can put in front of your CFO, your COO, and your audit committee. Same page. One conversation.</p>`,
      narrationLead:
        "Welcome to the final chapter. The capstone. In the previous seven chapters, we built a complete finance-function view of AI. Now we collapse it. One roadmap. One page. Something you can put in front of your CFO. Your COO. Your audit committee. Same page. One conversation across all three audiences. Here's what's on it.",
    },
    // SLIDE 2
    {
      title: 'The finance AI roadmap — one page',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The template',
      bodyHtml: `<p>Five sections. Each one specific enough to defend in a leadership meeting — and concrete enough to drive operational planning.</p>`,
      narrationLead:
        "Five sections. Each one specific enough to defend in a leadership meeting. Each one concrete enough to drive operational planning. Here are the five.",
      steps: [
        {
          html: stepCard('compass', 'green', '1 · The play sequence',
            "“Year 1: document extraction (Q1) → reconciliation (Q2-Q3). Year 2: forecasting (Q1-Q2) → anomaly/audit (Q3-Q4).” Specific. Time-boxed. The CFO can defend it as a multi-year commitment, not a quarterly experiment."),
          narration:
            "Section one. The play sequence. Year one — document extraction in quarter one, reconciliation in quarters two and three. Year two — forecasting in quarters one and two, anomaly and audit in quarters three and four. Specific. Time-boxed. The CFO can defend this as a multi-year commitment to the board — not as a series of quarterly experiments. The shape signals seriousness.",
        },
        {
          html: stepCard('search', 'blue', '2 · The data quality investment',
            "“90-day sprint in Q1, ahead of document extraction. Inventory + master data clean-up scoped + standardised descriptions. Owned by [name].” The work that makes everything else possible — visible, named, owned."),
          narration:
            "Section two. The data quality investment. A ninety-day sprint in quarter one — ahead of the document extraction work. Inventory. Master data clean-up on scoped entities. Standardised journal descriptions. Owned by a specific named person. This section makes visible the unglamorous work that makes everything else possible. Named. Owned. Funded. It signals to the data team that they are not invisible enablers — they are visibly the foundation.",
        },
        {
          html: stepCard('check', 'amber', '3 · The economic case',
            "“Year-1 investment: $X. Year-1 hard saving: $Y (AP hours, close days). Year-1 soft saving: $Z (FP&A time, controller weekends). Payback: N months.” Honest numbers. Conservative bands. No vendor math."),
          narration:
            "Section three. The economic case. Year-one investment in specific dollars. Year-one hard saving in specific dollars — AP hours, close cycle days. Year-one soft saving — FP and A time, controller weekends, audit hours. Payback period in months. Honest numbers. Conservative bands. No vendor math. The CFO and the audit committee respect honest numbers more than they respect aspirational numbers. Conservative wins long-term credibility.",
        },
        {
          html: stepCard('shield', 'blue', '4 · The governance posture',
            "“Material-entry threshold for auto-post. Internal audit dashboard for anomaly. Quarterly tuning review. Model card and version log per ML model.” The audit committee asks; you have the answer ready."),
          narration:
            "Section four. The governance posture. Material-entry threshold for auto-post in the reconciliation play. Internal audit read-only dashboard for the anomaly play. Quarterly tuning review with internal audit. Model card and version log per ML model in forecasting. The audit committee will ask about each of these. Having the answer ready — on the one-pager — is the difference between a calm conversation and a defensive one.",
        },
        {
          html: stepCard('users', 'green', '5 · The team and partner mix',
            "“Internal: 1 senior accountant + 1 data engineer (full-time). Partner: senior implementation for first 12 months. Backstop: existing FP&A bandwidth recalibrated.” The team behind the roadmap — visible."),
          narration:
            "Section five. The team and partner mix. Internal — typically one senior accountant plus one data engineer, full-time on the AI work. Partner — a senior implementation partner for the first twelve months, while internal capability builds. Backstop — existing FP and A bandwidth recalibrated to take on some of the forecasting work as it matures. The team behind the roadmap is visible on the page. The roadmap isn't an abstract plan — it's a plan that names the people who will execute it. Visibility matters for accountability.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Five sections, one page, durable',
        "This one-pager is not a marketing document. It's the operating commitment. Once leadership signs off, it goes in the finance leadership team's permanent files. Amended only by formal review. That gravity is what protects it from drift."),
      calloutNarration:
        "This one-pager is not a marketing document. It's the operating commitment. Once leadership signs off, it goes in the finance leadership team's permanent files. Amendments to it require a formal review at the leadership meeting. That gravity — that formality — is what protects the roadmap from drifting as priorities shift. Without that gravity, the roadmap slowly turns back into a deck. And then into nothing. Ratify it formally.",
    },
    // SLIDE 3
    {
      title: 'The three conversations the one-pager unlocks',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Adoption',
      bodyHtml: `<p>The roadmap exists to enable three specific conversations. Each one is a meeting on your calendar — and each one moves a budget or a decision.</p>`,
      narrationLead:
        "The roadmap exists to enable three specific conversations. Each one is a meeting that should be on your calendar within the next thirty days. Each one moves a budget or a decision. Without the meetings, the roadmap is paper.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — With the CFO',
            "“Here's the play sequence, here's the economic case, here's the team I need. The ninety-day sprint starts on date X — with your sign-off today.” Direct. Concrete. Decision-ready."),
          narration:
            "Conversation one. With the CFO. Here's the play sequence. Here's the economic case. Here's the team I need. The ninety-day data sprint starts on a specific date — with your sign-off today, not a follow-up paper next month. Direct. Concrete. Decision-ready. CFOs respond well to decision-ready proposals. They respond poorly to ones that ask for permission to come back with more detail. Walk in to this meeting decision-ready.",
        },
        {
          html: stepCard('users', 'amber', 'Conversation 2 — With internal audit',
            "“Here's the governance posture for each play. We want you as a partner in scoping, not a gate at the end. Can we walk through your concerns now — and design the controls together?”"),
          narration:
            "Conversation two. With internal audit. Here's the governance posture for each play. Specifically — the material threshold for the reconciliation play, the dashboard for the anomaly play, the model cards for forecasting. We want you as a partner in scoping the work, not as a gate at the end. Can we walk through your concerns now — and design the controls together? This conversation, held early, removes ninety percent of the friction that audit normally introduces late. Held late, the same conversation costs months.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 3 — With the audit committee (quarterly)',
            "Quarterly progress against the roadmap. Two slides. Numbers vs commitment. Governance items reviewed. Asks for the committee. Boring is exactly the goal."),
          narration:
            "Conversation three. With the audit committee. Quarterly. Two slides. Numbers versus your roadmap commitment. Governance items reviewed — what changed, what new controls were deployed, what was tested. Asks for the committee, if any. Boring is exactly the goal. Boring means the programme is operating. Drama means something has gone wrong. Aim for boring. The audit committee will be grateful — and will fund the next year.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'What comes next — beyond this course',
      iconKey: 'rocket',
      eyebrow: 'Lesson 3 · Onward',
      bodyHtml: `<p>This course gave you the finance-function view. Three suggestions for what to look at next — each one pairs with a specific decision in the next 90 days.</p>`,
      narrationLead:
        "This course gave you the finance-function view of AI. Three suggestions for what to look at next. Each one pairs with a specific decision you'll need to take in the next ninety days.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', '1 · AI Strategy for the C-Suite',
            "If you sit at the executive table — CFO or finance VP reporting to the C-suite — the strategy course extends what we covered into the broader portfolio view. Useful for the CFO conversation in particular."),
          narration:
            "One. If you sit at the executive table — CFO, or a finance VP reporting to the C-suite — the AI Strategy for the C-Suite course extends what we covered into the broader portfolio view. Where AI value lives across the whole enterprise, not just in finance. Capital allocation at the portfolio level. Useful for the CFO conversation in particular, where finance AI sits inside a wider story.",
        },
        {
          html: stepCard('bookOpen', 'amber', '2 · AI Governance & Risk for Boards',
            "If you present to an audit committee, the boards course extends chapter 5 here into the full board-level playbook. The board pack template alone is worth the time."),
          narration:
            "Two. If you present regularly to an audit committee, the AI Governance and Risk for Boards course extends chapter five here into the full board-level governance playbook. The one-page board pack template alone is worth the time. Most CFOs will eventually need to brief their audit committee on AI. This is the course that prepares the briefing.",
        },
        {
          html: stepCard('bookOpen', 'green', '3 · A 30-minute scoping call',
            "If you're ready to convert this roadmap into a real ninety-day sprint — the most efficient next step is a thirty-minute call. We listen, ask three honest questions, and tell you whether we're the right partner. Even if the answer is no."),
          narration:
            "Three. If you're ready to convert this roadmap into a real ninety-day sprint — the most efficient next step is a thirty-minute call. We listen. We ask three honest questions about your data, your team, and your CFO's priorities. And we tell you whether we're the right partner for your specific situation. Even when the answer is no, the candour saves you weeks of evaluating partners who aren't a fit. That's the value of the conversation. Take it.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p class="lead">Finance AI, done well, is invisible. The close that doesn’t slip. The exception that gets caught at week one. The forecast that survives the next planning meeting. That is the product of good finance AI — and it is the product of finance teams that named the data debt, sequenced the plays, and brought audit in as an ally.</p>
      <p>The discipline is the work. The technology will keep moving. The disciplines stay.</p>
      <p>Thank you for spending the last hour with me.</p>`,
      narrationLead:
        "One final thought. Finance AI, done well, is invisible. The close that doesn't slip a day. The exception that gets caught at week one of the quarter instead of after year-end. The forecast that survives contact with the next planning meeting. That is the product of good finance AI. And it is the product of finance teams that named the data debt honestly. Sequenced the plays in the right order. Brought audit in as an ally, not as a gate. The discipline is the work. The technology will keep moving — and faster, not slower, over the next three years. The disciplines stay. Thank you for spending the last hour with me. Now go put the roadmap in front of your CFO. And start with the ninety-day data sprint.",
    },
    // SLIDE 6
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'check',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>Three things to carry out of the whole course — into your next finance leadership meeting.</p>`,
      narrationLead:
        "Three things to carry out of the whole course. Into your next finance leadership meeting.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Sequence the four plays in order',
            "Document extraction → reconciliation → forecasting → anomaly. Start boring. Earn the right to do interesting. Don't reverse the order."),
          narration:
            "One. Sequence the four plays in the right order. Document extraction. Reconciliation. Forecasting. Anomaly. Start boring. Earn the right to do interesting. Don't reverse the order — vendors will try to convince you to start with the flashy plays. Don't.",
        },
        {
          html: stepCard('check', 'green', 'Two — Run the 90-day data sprint first',
            "Inventory · master data clean-up scoped · standardise descriptions. Without this, the AI plays underperform. With it, they compound."),
          narration:
            "Two. Run the ninety-day data sprint first. Inventory. Master data clean-up on scoped entities. Standardise descriptions and prepare clean feeds. Without this sprint, the AI plays underperform expectations. With it, they compound across years.",
        },
        {
          html: stepCard('check', 'green', 'Three — Bring audit in as an ally',
            "Week one of every play. They know where the controls have weak spots. They become your strongest partner — when treated as one."),
          narration:
            "Three. Bring internal audit in as an ally — not as a gate. Week one of every play. They know where your controls have weak spots — often better than the finance team does. They become your strongest partner when treated as one. Treat them as one.",
        },
      ],
      narrationTrail:
        "Thank you. Truly. Take the roadmap to your CFO this week. We'll see you at the next decision point.",
    },
  ],
}
