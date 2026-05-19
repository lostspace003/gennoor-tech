import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForFinanceChapter07: Chapter = {
  courseId: 'ai-for-finance-accounting',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-data-quality-conversation',
  title: 'The data quality conversation',
  subtitle: 'The unglamorous prerequisite — and the one that decides whether any of this delivers.',
  slides: [
    // SLIDE 1
    {
      title: 'The data quality conversation',
      iconKey: 'search',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Every previous chapter assumed clean data. Most finance teams don’t have it. In the next few minutes, the honest conversation about data quality — what to fix, what to live with, and the three patterns that block AI in finance the most.</p>`,
      narrationLead:
        "Welcome to chapter seven. The data quality conversation. The previous five chapters all quietly assumed that your data is in reasonable shape. Most finance teams' data isn't. So this is the honest conversation. What to fix. What to live with. And the three data patterns that block AI in finance more than any other.",
    },
    // SLIDE 2
    {
      title: 'The three patterns that block AI most',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 1 · The blockers',
      bodyHtml: `<p>Three patterns are the most common cause of finance AI projects underperforming. Each one is fixable — but only if named first.</p>`,
      narrationLead:
        "Three patterns are the most common cause of finance AI projects underperforming expectations. Each one is fixable. But each one has to be named first. Honest naming is the start of the fix.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Pattern 1 — Master data fragmentation',
            "Vendor IDs in ERP A. Vendor IDs in ERP B (different format). Vendor IDs in the procurement system (different again). No canonical mapping. Every AI project trips on this. Fix before scaling, not during."),
          narration:
            "Pattern one. Master data fragmentation. Vendor IDs in ERP system A. Vendor IDs in ERP system B in a different format. Vendor IDs in the procurement platform in yet another format. No canonical mapping between them. Customer master data, the same problem. Chart of accounts, the same. Every AI project in finance trips on this — and the trip costs weeks of debugging. Fix this layer before scaling the AI work. Not during. Not after. Before. A short master data project of two to three months pays back fifty times in subsequent AI deployment time.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Pattern 2 — Unstructured fields in the GL',
            "The journal entry description is a free-text field. Different controllers write it differently. AI tries to learn patterns from this and fails — because the patterns are author-specific, not transaction-specific. Standardise descriptions before applying AI."),
          narration:
            "Pattern two. Unstructured fields in the general ledger. The journal entry description is a free-text field. Different controllers write it differently. Some put the vendor name. Some put the invoice number. Some put a verbose explanation. Some leave it blank. AI tries to learn patterns from this and fails — because the patterns are author-specific, not transaction-specific. The fix is to standardise journal entry descriptions through guidelines and ERP defaults, before applying AI. This conversation is awkward — controllers are particular about their descriptions. Have it anyway.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Pattern 3 — History without consistency',
            "You have five years of data. But the chart of accounts changed three times in those five years. Reorganisations split entities. The data is technically there. It's not comparable. Plan for retrofitting — or accept a shorter usable history."),
          narration:
            "Pattern three. History without consistency. You have five years of data — technically. But the chart of accounts changed three times in those five years. Reorganisations split or merged entities. New business lines emerged. The data is there. It's not comparable across the full period. The honest options are two — invest in retrofitting historical data to a single consistent view (which is expensive but durable), or accept a shorter usable history of typically eighteen to twenty-four months (which limits some ML approaches). There's no third option that's both cheap and good. Pick deliberately. Don't pretend the data is clean when it isn't.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Honest naming is half the fix',
        "Most finance teams know they have these three patterns. They simply don't talk about them at AI project kickoff — because talking about them feels like admitting weakness. It isn't. Naming the data debt at kickoff is what allows you to plan around it."),
      calloutNarration:
        "Honest naming is half the fix. Most finance teams already know they have these three patterns. They simply don't talk about them at AI project kickoff — because talking about them feels like admitting weakness. It isn't. Naming the data debt at kickoff is exactly what allows you to plan around it. The teams that name it ship on time. The teams that don't ship six months late and present it as a discovery. Be the team that names it.",
    },
    // SLIDE 3
    {
      title: 'What to fix vs what to live with',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · Prioritisation',
      bodyHtml: `<p>You don’t fix all data quality issues before doing AI. You fix the ones that block the specific play you’re running. Here’s the matrix.</p>`,
      narrationLead:
        "You don't fix all data quality issues before doing AI work. That's an impossible bar. You fix the issues that specifically block the play you're running. The other issues — you live with, document, and address in time. Here's the matrix.",
      steps: [
        {
          html: stepCard('check', 'green', 'Fix before — Master data for the entities in scope',
            "Vendor and customer masters for the legal entities the AI play touches. Two-to-three month project. Pays back forever."),
          narration:
            "Fix before — master data for the entities in scope. Vendor masters. Customer masters. For the specific legal entities the AI play will touch. Not every entity in the group. Just the ones the play touches. Two to three months of project work. Pays back forever — every subsequent AI play in those entities benefits.",
        },
        {
          html: stepCard('check', 'blue', 'Fix in parallel — Standardised journal descriptions',
            "For the GL feeding the AI. Roll out new guidelines plus ERP defaults. Build the new pattern as the AI project runs — historical data stays as is."),
          narration:
            "Fix in parallel — standardised journal entry descriptions. For the general ledger feeding the AI play. Roll out new guidelines plus ERP defaults during the AI project. Build the new pattern going forward as the AI project runs. Historical data stays as it is. The AI model is trained on the cleaner forward-looking data. Over twelve months, you've shifted the pattern without trying to retrofit history.",
        },
        {
          html: stepCard('check', 'amber', 'Live with — History before the cleaning point',
            "If your master data was clean from a certain date, train the AI on data from that date forward. Document that history before that date is excluded. Audit will be fine with this — as long as it's documented."),
          narration:
            "Live with — history before the cleaning point. If your master data became consistent from a certain date — say, after the last ERP migration — train the AI on data from that date forward. Document explicitly that history before that date is excluded from the AI work. Internal audit and external audit will both be fine with this — as long as it's documented as a deliberate choice, not a hidden assumption. Hidden assumptions are what auditors don't like. Documented exclusions are normal.",
        },
        {
          html: stepCard('x', 'red', 'Skip — Trying to perfectly clean everything before starting AI',
            "There is no perfectly clean data in finance. The team that waits for it never starts. The team that starts with documented imperfections ships and learns. Start."),
          narration:
            "Skip — trying to perfectly clean everything before starting any AI work. There is no perfectly clean data set in any finance function. The team that waits for it never starts an AI programme. The team that starts with documented imperfections — and a plan to address them — ships, learns, and improves. Start. Document the gaps. Improve as you go. The alternative is a multi-year master data project that never produces any AI value. Don't be that team.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'A practical 90-day data quality sprint',
      iconKey: 'calendar',
      eyebrow: 'Lesson 3 · The 90-day plan',
      bodyHtml: `<p>A 90-day sprint that gets your finance data ready enough for the first two AI plays — document extraction and reconciliation.</p>`,
      narrationLead:
        "A practical ninety-day data quality sprint. This gets your finance data ready enough for the first two AI plays — document extraction and reconciliation. Not perfect. Ready enough. Three phases, thirty days each.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Days 1–30 — Inventory and assess',
            "List every system that produces finance data. Map every data flow into the GL. Score each input on consistency. Identify the top 3 data quality issues by impact. Output: a one-page assessment."),
          narration:
            "Days one through thirty. Inventory and assess. List every system that produces finance data — ERPs, procurement platforms, expense systems, bank feeds, payroll. Map every data flow into the general ledger. Score each input on consistency. Identify the top three data quality issues by their impact on the AI plays you're planning. The output is a one-page assessment. Most teams have never done this exercise — and find the result is sobering. Sobering is fine. Sobering is the start.",
        },
        {
          html: stepCard('calendar', 'blue', 'Days 31–60 — Master data clean-up on scoped entities',
            "Pick the entities the first AI play touches. Clean vendor and customer master in those entities. De-duplicate. Establish canonical IDs. A focused 30-day sprint owned by one senior accountant plus a data engineer."),
          narration:
            "Days thirty-one through sixty. Master data clean-up on scoped entities. Pick the legal entities the first AI play will touch — not every entity in the group. Clean the vendor and customer master data within those entities. De-duplicate. Establish canonical IDs. A focused thirty-day sprint owned by one senior accountant plus one data engineer. The team is small on purpose. Larger teams move slower on this kind of work. Two people with clear authority move fast.",
        },
        {
          html: stepCard('calendar', 'amber', 'Days 61–90 — Standardise descriptions and prepare data feeds',
            "Roll out the new journal description guidelines. Update ERP defaults. Build clean data feeds for the AI tools — versioned, quality-checked, refreshed automatically. By day 90, you're ready to start the AI build."),
          narration:
            "Days sixty-one through ninety. Standardise journal entry descriptions and prepare clean data feeds. Roll out the new journal description guidelines to controllers. Update ERP defaults so the new pattern becomes automatic. Build clean data feeds for the AI tools — versioned, quality-checked, refreshed automatically. By day ninety, you're genuinely ready to start the AI build. Document extraction begins. Reconciliation follows shortly after. The data quality work is done in the right place — before the AI, not during.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'A 90-day sprint pays back forever',
        "The team that runs this 90-day sprint at the start saves itself 6–9 months of AI project pain. Every subsequent AI play benefits. The data team also stops being the unsung hero — they become the visible enabler. Worth doing."),
      calloutNarration:
        "The team that runs this ninety-day sprint at the start saves itself six to nine months of AI project pain across the year. Every subsequent AI play benefits — document extraction, reconciliation, forecasting, anomaly detection. And as a bonus, the data team stops being the unsung hero blamed when projects slow down. They become the visible enabler whose work made the AI possible. The change in how the data team is seen inside the firm is, by itself, worth running the sprint. Recognition matters. Make sure it travels.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 7 · Takeaways',
      bodyHtml: `<p>Three anchors before the capstone.</p>`,
      narrationLead:
        "Three anchors before we land it in the capstone chapter.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Name the three blockers honestly',
            "Master data fragmentation · unstructured GL fields · history without consistency. Naming them at kickoff is half the fix."),
          narration:
            "One. Name the three blockers honestly at AI project kickoff. Master data fragmentation. Unstructured GL fields. History without consistency. Naming them is half the fix. The teams that name them ship on time.",
        },
        {
          html: stepCard('check', 'green', 'Two — Fix what blocks · live with what doesn\'t',
            "Don't try to perfectly clean everything before doing AI. The team that waits never starts. Fix scoped. Document. Improve as you go."),
          narration:
            "Two. Fix what blocks the play. Live with what doesn't. Don't try to perfectly clean everything before doing any AI work. The team that waits for clean data never starts. Fix scoped. Document the gaps. Improve as you go. That's the durable pattern.",
        },
        {
          html: stepCard('check', 'green', 'Three — Run the 90-day sprint',
            "Inventory · master data clean-up scoped · standardise and prepare feeds. By day 90 you're genuinely ready to build."),
          narration:
            "Three. Run the ninety-day sprint. Inventory in days one to thirty. Master data clean-up on scoped entities, days thirty-one to sixty. Standardise descriptions and prepare clean feeds, days sixty-one to ninety. By day ninety, you're genuinely ready to build. Not theoretically ready. Genuinely ready.",
        },
      ],
      narrationTrail:
        "Final chapter — your finance AI roadmap on one page. Where everything we've covered lands as something you can actually present at next month's leadership meeting. See you there.",
    },
  ],
}
