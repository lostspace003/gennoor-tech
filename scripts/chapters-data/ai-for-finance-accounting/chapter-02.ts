import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForFinanceChapter02: Chapter = {
  courseId: 'ai-for-finance-accounting',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-invoice-and-document-ai',
  title: 'Invoice & document AI',
  subtitle: 'The fastest measurable win in any finance function. Four weeks to first value.',
  slides: [
    // SLIDE 1
    {
      title: 'Invoice & document AI',
      iconKey: 'bookOpen',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">The most boring AI use case in finance is also the most reliable. Four weeks to first value. Sixty to eighty percent reduction in manual data entry on day one. In the next few minutes, what to build, how to build it, and the operational rhythm that makes it stick.</p>`,
      narrationLead:
        "Welcome to chapter two. Invoice and document AI. The most boring AI use case in finance — and also the most reliable. Four weeks to first value. Sixty to eighty percent reduction in manual data entry on day one. There is no other finance AI play with that risk-adjusted return. Let me walk you through what to build, how to build it, and the operational rhythm that makes the benefit stick over time.",
    },
    // SLIDE 2
    {
      title: 'What the play actually delivers',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · The deliverables',
      bodyHtml: `<p>Three concrete deliverables. The third one is the one most teams forget — and the one that turns a project into a programme.</p>`,
      narrationLead:
        "Three concrete deliverables come out of a document extraction project. The first two are obvious. The third is the one most teams forget — and it's also the one that turns a project into a sustained programme.",
      steps: [
        {
          html: stepCard('cog', 'green', '1 · Extraction model',
            "Reads invoices, receipts, statements, contracts. Handles tables. Multi-language. Returns structured JSON with confidence scores per field. Built on Azure Document Intelligence or equivalent. Customised on your document samples."),
          narration:
            "Deliverable one. The extraction model itself. Reads invoices. Receipts. Bank statements. Contracts. Handles complex tables. Multi-language — important in GCC and African operations. Returns structured JSON with confidence scores per field. Typically built on Azure Document Intelligence or an equivalent platform. Then customised on a sample of your actual documents — fifty to two hundred typical invoices, depending on the variety. That customisation is what takes the model from seventy percent accurate to ninety-five percent accurate.",
        },
        {
          html: stepCard('check', 'blue', '2 · LLM verification layer',
            "For every extracted field, a second-pass LLM cross-checks the value against the source image and the context. Low-confidence fields are routed to a human queue. The pattern that takes accuracy from 95% to operationally usable."),
          narration:
            "Deliverable two. The LLM verification layer. For every field the extraction model produces, a second pass — using an LLM — cross-checks the value against the source image and the document context. The same value extracted from two different places in the document must agree. Low-confidence fields are routed to a human review queue. This is the pattern that takes accuracy from ninety-five percent — which sounds good but isn't operationally usable — to ninety-eight or ninety-nine percent. Which is the threshold at which finance teams trust the output enough to stop double-checking it manually.",
        },
        {
          html: stepCard('shield', 'amber', '3 · ERP write-back with audit trail',
            "The forgotten deliverable. Without ERP write-back, you've replaced manual entry with semi-manual review. With it, the loop is closed — the document arrives, the entry posts, the audit trail records everything. Integration with SAP, D365, Oracle, NetSuite is the work."),
          narration:
            "Deliverable three. ERP write-back with a full audit trail. This is the one most teams forget. Without ERP write-back, you've replaced manual entry with semi-manual review — somebody is still typing the numbers into the ERP, they just have an AI suggestion next to the box. The benefit is real but limited. With write-back, the loop is closed. The document arrives. The entry posts. The audit trail records everything — who extracted, who verified, who approved. The integration work with SAP, D365, Oracle, or NetSuite is where the real engineering effort goes. Budget for it.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'A pattern that compounds',
        "The same extraction-plus-verification-plus-write-back pattern works for almost any document type. Once you build it for invoices, expanding to receipts, contracts, statements, and KYC documents is incremental. The first build is the expensive one."),
      calloutNarration:
        "Here's the pattern that compounds. The same extraction-plus-verification-plus-write-back architecture works for almost any document type. Once you've built it for invoices, expanding to receipts is incremental. Then statements. Then contracts. Then KYC documents for the bank or insurer. Each new document type is twenty to thirty percent of the cost of the first one. The first build is the expensive one. The fifth is essentially free. Pick your first document type carefully — and design the architecture so the next four come cheaply.",
    },
    // SLIDE 3
    {
      title: 'The four-week build plan',
      iconKey: 'calendar',
      eyebrow: 'Lesson 2 · How to build it',
      bodyHtml: `<p>A typical four-week build. Adjust the numbers to your scale, but the shape is consistent across most finance teams.</p>`,
      narrationLead:
        "Here's the typical four-week build plan. The numbers will adjust to your scale — but the shape is consistent across most finance teams. If your vendor or partner proposes something dramatically longer for the first build, ask why.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Week 1 — Sample and scope',
            "Collect 100–200 sample documents covering the variation in your AP volume. Map ERP fields. Define success metrics — typically accuracy %, cycle time, AP clerk hours."),
          narration:
            "Week one. Sample and scope. Collect one hundred to two hundred sample documents that cover the realistic variation in your AP volume. Different vendors, different formats, different languages. Map the ERP fields that the entries will write into. Define success metrics — typically extraction accuracy by field, cycle time from arrival to posted, and AP clerk hours saved per week. The sampling work is unglamorous. It also determines whether the build succeeds.",
        },
        {
          html: stepCard('calendar', 'blue', 'Week 2 — Build and tune',
            "Stand up the extraction model. Run against the sample. Iterate on the lowest-confidence field types. By end of week 2, accuracy should hit 95% on the sample."),
          narration:
            "Week two. Build and tune. Stand up the extraction model. Run it against the sample set. Iterate on the field types that come back with the lowest confidence — typically PO numbers, tax codes, and line-item detail. By end of week two, accuracy on the sample set should hit around ninety-five percent. If it doesn't, the sample probably underestimated the variation. Expand the sample and iterate one more week.",
        },
        {
          html: stepCard('calendar', 'amber', 'Week 3 — Verification + ERP integration',
            "Wire in the LLM verification layer. Build the human-review queue UI. Integrate with the ERP — read-only first, then write-back behind a feature flag."),
          narration:
            "Week three. Verification and ERP integration. Wire in the LLM verification layer for each extracted field. Build the human-review queue UI — a simple list of low-confidence documents with the extracted values pre-populated. Integrate with the ERP. Critical pattern — read-only first, then write-back behind a feature flag. So you can roll out write-back to one AP clerk's queue before you roll it out to twenty. The first write-back to production must be witnessed by a senior controller. No exceptions.",
        },
        {
          html: stepCard('calendar', 'green', 'Week 4 — Pilot live + measure',
            "Pilot in production for one AP team or one entity. Daily standups for the first week. Weekly review for the next month. Measure against the success metrics from week 1."),
          narration:
            "Week four. Pilot live and measure. Pilot in production for one AP team or one legal entity. Daily standups for the first week — to catch the inevitable edge cases. Weekly review for the next month. Measure relentlessly against the success metrics you defined in week one. Don't expand to the next team until the pilot has hit the metrics for two consecutive weeks. The temptation to scale before stability is real. Resist it.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The operational rhythm that makes it stick',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · Steady state',
      bodyHtml: `<p>Most document-AI deployments lose 30% of their benefit within 18 months — not because the model breaks, but because the operational rhythm dies. Three disciplines prevent that.</p>`,
      narrationLead:
        "Most document AI deployments lose roughly thirty percent of their benefit within eighteen months. Not because the model breaks. Because the operational rhythm dies. Three disciplines prevent that.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Discipline 1 — Weekly accuracy dashboard',
            "Field-level accuracy plotted weekly. When a number trends down, somebody investigates the same week — not the next quarter. Catches drift early."),
          narration:
            "Discipline one. The weekly accuracy dashboard. Field-level extraction accuracy plotted weekly. When a number trends down — and one will, eventually, because vendors change their invoice formats or you onboard a new supplier with unusual layouts — somebody investigates the same week. Not the next quarter when somebody finally notices. Catching drift early is what keeps the benefit alive.",
        },
        {
          html: stepCard('shield', 'amber', 'Discipline 2 — Quarterly sample audit',
            "Once a quarter, internal audit pulls 50 random documents and spot-checks the AI's output. Findings feed back into model tuning. Audit becomes an ally — not a gate."),
          narration:
            "Discipline two. Quarterly sample audit. Once a quarter, internal audit pulls fifty random documents from the production stream and spot-checks the AI's output against the source. Findings feed back into model tuning. This discipline does three things at once. It catches the slow drift. It makes internal audit an ally rather than a gate — they're seeing the controls work in real time. And it produces the audit evidence regulators will eventually ask for. Worth the half day per quarter.",
        },
        {
          html: stepCard('shield', 'green', 'Discipline 3 — New-document playbook',
            "When a new supplier or new document type appears, the AP team follows a 4-step playbook to add it to the model without breaking anything. The playbook lives in the team wiki — not in somebody's head."),
          narration:
            "Discipline three. The new-document playbook. When a new supplier appears with an unusual invoice format — or a new document type comes online — the AP team follows a four-step playbook to add it to the model. Sample the variation. Test against the existing model. Tune if needed. Deploy behind a feature flag. The playbook lives in the team wiki — not in the senior accountant's head. So when the senior accountant moves on, the discipline doesn't move with them.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'The number to defend',
        "<strong>Net hours saved per AP clerk per week</strong> is the single number to defend at the board meeting. Track it from week one. Year-one savings of 12–18 hours per AP clerk per week is typical."),
      calloutNarration:
        "Here's the number to defend at the board meeting. Net hours saved per AP clerk per week. Track it from week one of the pilot. Year-one savings of twelve to eighteen hours per AP clerk per week is typical for a well-run document AI deployment. Multiply by the team size and the fully-loaded cost, and you have the operating saving. Communicate it consistently. The CFO defending this number to the CEO needs to be the same person every quarter, with the same definition every quarter. Drift in the definition is what kills budget for the next play.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 3 — the reconciliation agent.</p>`,
      narrationLead:
        "Three anchors before chapter three — where we get into the reconciliation agent.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three deliverables, not one',
            "Extraction model · LLM verification · ERP write-back with audit. Skipping the third one halves the benefit."),
          narration:
            "One. Three deliverables, not one. The extraction model. The LLM verification layer. And the ERP write-back with full audit trail. Skipping the third one halves the benefit and turns the project into a partial win.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four weeks, in shape',
            "Sample → build → integrate → pilot. If the proposal takes much longer than 4 weeks for the first build, ask why."),
          narration:
            "Two. Four weeks, in shape. Sample. Build. Integrate. Pilot. If the partner or vendor proposes much longer than four weeks for the first build, ask hard questions about why. The technology is mature. Long timelines are usually a scoping problem, not a technical one.",
        },
        {
          html: stepCard('check', 'green', 'Three — The benefit dies without the rhythm',
            "Weekly accuracy · quarterly audit · new-document playbook. Three disciplines. Without them, 30% of the benefit walks out the door in 18 months."),
          narration:
            "Three. The benefit dies without the operational rhythm. Weekly accuracy dashboard. Quarterly sample audit. New-document playbook. Three disciplines. Without them, roughly thirty percent of the benefit walks out the door within eighteen months. With them, the benefit compounds. Build the rhythm at the start of the project — not after the first drop in accuracy.",
        },
      ],
      narrationTrail:
        "Chapter three — the reconciliation agent. The play that gets the controller back their weekends. See you there.",
    },
  ],
}
