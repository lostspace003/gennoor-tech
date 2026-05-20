import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiOpsChapter03: Chapter = {
  courseId: 'ai-for-operations-supply-chain',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-procurement-automation',
  title: 'Procurement document AI',
  subtitle: 'The three document types · the three-tier human-in-loop · the audit posture that passes external review.',
  slides: [
    // SLIDE 1
    {
      title: 'Procurement document AI',
      iconKey: 'bookOpen',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">Procurement is the operations function with the most predictable AI win — high document volume, structured outputs, clear audit requirements. Done well, 90% of routine documents automate cleanly. Done badly, you fail your next external audit. Three components decide which path.</p>`,
      narrationLead:
        "Welcome to chapter three. Procurement document AI. Procurement is the operations function with the most predictable AI win available — high document volume, structured outputs, clear audit requirements, well-understood processes. Done well, ninety percent of routine documents automate cleanly and the procurement team capacity redirects to vendor strategy and negotiation. Done badly, you fail your next external audit and you've moved invisible inaccuracy into your accounting system. Three components decide which path you're on. The three document types where AI ships, the three-tier human-in-loop pattern, and the audit posture that passes external review without rework.",
    },
    // SLIDE 2
    {
      title: 'Three document types where AI ships reliably',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · The documents',
      bodyHtml: `<p>Three document types where document AI consistently delivers — and one fourth where it consistently overpromises. Know the difference; budget accordingly.</p>`,
      narrationLead:
        "Three document types where procurement document AI consistently delivers measurable value. One fourth document type where it consistently overpromises and disappoints. Know the difference. Budget accordingly. The three that work share a structural pattern — bounded vocabulary, predictable layouts, clear extraction targets. The fourth that doesn't work shares the opposite — unbounded vocabulary, variable layouts, judgment-heavy extraction targets.",
      steps: [
        {
          html: stepCard('check', 'green', 'Document 1 — Invoices',
            "Highest volume, most structured, most predictable. AI extracts vendor, PO match, line items, tax, totals, payment terms. 90%+ automation rate after tuning. Start here — fastest payback, lowest risk."),
          narration:
            "Document one. Invoices. The highest volume, most structured, and most predictable document type in procurement. AI extracts vendor identity, purchase order match, line items with quantities and prices, tax breakdown, totals, payment terms. Ninety percent automation rate is achievable after tuning to your vendor mix and language coverage. Start here. Fastest payback because the volume is high. Lowest brand risk because the output is internal — your accounting team sees it before anything goes to the vendor. Most procurement document AI vendors are optimised primarily for invoices because they're the highest-value extraction target across customers.",
        },
        {
          html: stepCard('check', 'green', 'Document 2 — Purchase orders',
            "Standardised structure, smaller volume than invoices but more strategic. AI extracts terms, delivery requirements, special clauses. Catches deviation from your standard PO template early — before vendors lock terms you didn\'t intend."),
          narration:
            "Document two. Purchase orders. Standardised structure across your business. Smaller volume than invoices but more strategically important because each PO is the contract instance for the transaction. AI extracts terms, delivery requirements, special clauses, vendor commitments. Critically, it catches deviation from your standard PO template — when a vendor returns a signed PO with modified terms — early in the process before those terms lock in. Without document AI, modified terms often pass through procurement and are discovered months later by accounts payable when invoicing doesn't match. The early-catch capability is the strategic value of PO document AI, beyond the time saving.",
        },
        {
          html: stepCard('check', 'green', 'Document 3 — Vendor master setup documents',
            "Tax certificates, banking details, insurance certificates, regulatory compliance documents. AI extracts and validates against your vendor master data. Catches inconsistencies before a vendor goes active in your ERP — preventing payment errors and compliance gaps."),
          narration:
            "Document three. Vendor master setup documents. The bundle of documents new vendors submit during onboarding — tax certificates, banking details, insurance certificates, regulatory compliance documents, beneficial ownership disclosures. AI extracts the data and validates against your vendor master data structure. Catches inconsistencies before a vendor goes active in your ERP — for example, the tax ID doesn't match the bank account jurisdiction, or the insurance certificate expired three months ago. Preventing these issues at onboarding saves significant downstream cost in payment errors, compliance gaps, and the manual cleanup work that follows when issues are caught months later.",
        },
        {
          html: stepCard('x', 'red', 'The fourth — Contracts',
            "AI for contract extraction overpromises. Contracts have variable structure, judgment-heavy interpretation, legal weight that requires human review. Use AI to summarise contracts and flag clauses for legal — never to autonomously interpret terms."),
          narration:
            "The fourth document type — contracts. This is the one AI vendors will pitch most aggressively in 2026 and consistently overpromises. Contracts have variable structure, judgment-heavy interpretation of clauses, and legal weight that requires human review by counsel for any meaningful term. The pitch — AI autonomously extracts contract terms into your contract management system. The reality — the extraction has enough errors on non-standard clauses that legal review can't be skipped, and once legal review is required for every contract anyway, the AI extraction barely saves time. Use AI to summarise contracts for procurement leadership and to flag specific clause categories for legal attention. Don't expect autonomous contract extraction to deliver. Position it as legal-team productivity, not procurement automation.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The three-tier human-in-loop pattern',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · The tiers',
      bodyHtml: `<p>Three review tiers. AI handles the high-volume bottom tier autonomously; humans handle the strategic top tier deliberately; the middle tier is where most teams design the workflow wrong.</p>`,
      narrationLead:
        "Three review tiers in the human-in-loop pattern. AI handles the high-volume bottom tier autonomously after extraction. Humans handle the strategic top tier deliberately with full document review. The middle tier is where most teams design the workflow wrong — either by routing everything to humans, which gives back the productivity gain, or by automating without review, which fails the audit. Three tiers, configured deliberately, lands the value.",
      steps: [
        {
          html: stepCard('flag', 'green', 'Tier 1 — Auto-process (60–70% of documents)',
            "High AI confidence on extraction + matches existing PO + amount under threshold + standard vendor. Auto-processes into ERP with audit-logged confidence scores. Procurement team never touches it. Highest volume tier."),
          narration:
            "Tier one. Auto-process. The bottom tier — typically sixty to seventy percent of documents — that meets all four conditions. High AI confidence on every extracted field. Matches an existing purchase order without exception. Total amount under your auto-process threshold — typically a few thousand dollars depending on your business. Standard vendor with established history. Documents meeting all four conditions auto-process into the ERP with the AI confidence scores and source document captured in the audit log. The procurement team never touches them. This is the highest-volume tier and the tier where the bulk of the time savings come from. Configure the four conditions tightly; tighten further if the audit posture surfaces issues.",
        },
        {
          html: stepCard('flag', 'amber', 'Tier 2 — Light review (25–35% of documents)',
            "AI extracted, but one of the four conditions failed — slightly lower confidence, partial PO match, amount above threshold, or non-standard vendor. Procurement reviews on a focused screen in 30–60 seconds. Approves, edits, or rejects. The middle tier needs the right interface."),
          narration:
            "Tier two. Light review. The middle tier — typically twenty-five to thirty-five percent of documents — where AI extracted the data correctly but one of the four auto-process conditions failed. Slightly lower confidence score on a field. Partial PO match needing human resolution. Amount above the auto-process threshold. Non-standard vendor that needs the procurement check. Procurement team reviews on a focused review screen in thirty to sixty seconds per document. They approve, edit specific fields, or reject. The interface matters intensely here. A bad interface adds friction and procurement reverts to manual processing. A good interface — purpose-built for the light-review tier — preserves the time savings while applying the appropriate human judgment.",
        },
        {
          html: stepCard('flag', 'red', 'Tier 3 — Full review (5–10% of documents)',
            "High-value, novel vendor, complex line items, or contract attachments. Procurement reviews the full document with AI extraction as a starting point. Time per document similar to manual — but procurement gets to focus attention on documents that actually need it."),
          narration:
            "Tier three. Full review. The strategic top tier — typically five to ten percent of documents — where the document genuinely requires full human attention. High-value transactions above the strategic threshold. Novel vendor with no history. Complex line items requiring procurement interpretation. Contract attachments accompanying the document. Procurement reviews the full document with AI's extraction as a starting point. Time per document is similar to fully manual processing — but procurement gets to focus their attention on the documents that actually need it, rather than spending equal time on routine invoices and strategic contracts. The capacity redirect to where judgment matters is the strategic value of the tiered architecture.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Where most teams design it wrong',
        "Routing too much to tier 3 — out of caution — gives back most of the productivity gain. Routing too little to tier 3 — out of efficiency push — fails the audit. Tune the four conditions for tier 1 quarterly based on actual error rates in production."),
      calloutNarration:
        "Where most teams design the tiering wrong. Two failure modes in opposite directions. Routing too much to tier three out of caution about errors — gives back most of the productivity gain the architecture was designed to deliver. Routing too little to tier three out of efficiency pressure from leadership — produces errors that surface in audits or in vendor payment disputes. Tune the four conditions for tier one quarterly based on actual error rates discovered in production. The first quarter, run conservative thresholds; auto-process only the most confident clear cases. Loosen thresholds as the production data confirms accuracy is holding. The tier-one share grows over time as the system proves itself. Don't try to hit sixty to seventy percent auto-process in month one.",
    },
    // SLIDE 4
    {
      title: 'The audit posture that passes external review',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · The audit',
      bodyHtml: `<p>Four components in the audit posture. External auditors are now asking AI-specific questions; the documentation needs to be ready. Build the posture before the first audit, not during.</p>`,
      narrationLead:
        "Four components in the audit posture for procurement document AI. External auditors — including Big Four firms and regulatory examiners in regulated industries — are now asking AI-specific questions in routine procurement audits. The documentation needs to be ready when they ask. Build the posture before the first audit, not during the audit. Building during the audit produces rework and findings that take a year to clear. The four components are straightforward to set up upfront and difficult to retrofit.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Component 1 — Confidence scores logged per extraction',
            "Every field the AI extracted carries its confidence score in the audit log. Auditors can sample documents and verify the score correlates with accuracy. Sample-based testing scales — auditors can verify a system without reviewing every transaction."),
          narration:
            "Component one. Confidence scores logged per extraction field. Every field the AI extracted from every document carries its confidence score in the audit log alongside the extracted value. Auditors can sample documents from production and verify that high-confidence scores correlate with actual accuracy at the field level. Sample-based testing scales for auditors — they can verify the AI system is working correctly without reviewing every individual transaction. Without confidence scores in the log, auditors require manual review of larger samples and findings rates rise. With confidence scores, audit time drops and findings shrink. The configuration is straightforward; verify your vendor's logging meets this standard before launch.",
        },
        {
          html: stepCard('shield', 'green', 'Component 2 — Source document linked to every transaction',
            "Every ERP transaction created by AI extraction links back to the source document image or PDF. Auditors can trace any transaction to its source in two clicks. Standard requirement under SOX, IFRS, and most regulatory frameworks."),
          narration:
            "Component two. Source document linked to every transaction. Every ERP transaction created by AI extraction links back to the source document image or PDF, retrievable in two clicks by the auditor. Standard requirement under SOX in the US, IFRS internationally, and most regulatory frameworks for financial reporting. Procurement document AI vendors generally support this — verify your specific implementation actually configures it. The failure mode is when the source documents are stored in one system and the ERP transactions in another and the linking is by foreign key that broke during a migration. Test the link by sampling random transactions and clicking through to source documents. If it works for ten random samples, it generally works overall.",
        },
        {
          html: stepCard('shield', 'green', 'Component 3 — Documented model controls',
            "Written policy describes: which model is in use, when it was last validated, how confidence thresholds were set, who owns model retraining, how exceptions are handled. Two pages, signed by procurement and IT. Auditors expect this now."),
          narration:
            "Component three. Documented model controls. A written policy — two pages, signed by procurement leadership and IT — that describes which AI model is in production use, when it was last validated, how the confidence thresholds for the tier-one auto-process gate were set, who owns model retraining and on what cadence, how exceptions and errors are handled and tracked. External auditors expect this documentation now in routine procurement audits. The documentation doesn't need to be sophisticated — two pages of clear policy signed by the right owners is sufficient. The documentation not existing is the issue auditors flag. Write it before launch.",
        },
        {
          html: stepCard('shield', 'green', 'Component 4 — Error tracking and remediation log',
            "Errors that surface — extractions that were wrong, transactions that needed correction — are logged with root cause and remediation action. Annual review surfaces patterns that need model retraining or threshold adjustment. The continuous improvement evidence."),
          narration:
            "Component four. Error tracking and remediation log. Errors that surface in production — extractions that were wrong, transactions that needed correction, vendor payment issues traceable to AI errors — are logged with root cause and remediation action. Reviewed annually by procurement and IT together. Patterns surfacing in the log inform model retraining priorities and confidence threshold adjustments. The error log is the continuous improvement evidence auditors look for to confirm the AI system is being actively managed rather than running on autopilot. Without the log, auditors can't verify the management posture. With it, they can. Set up the logging on day one of production; don't add it later when an audit asks.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter four — logistics optimisation.</p>`,
      narrationLead:
        "Three anchors before chapter four — logistics optimisation.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three document types that ship',
            "Invoices · purchase orders · vendor master setup documents. Contracts is the fourth where AI overpromises — use it for summarisation and clause flagging, not autonomous extraction."),
          narration:
            "One. Three document types where procurement AI ships reliably. Invoices — highest volume, start here, fastest payback. Purchase orders — strategic catch capability for deviating terms. Vendor master setup documents — prevents downstream payment errors and compliance gaps by validating at onboarding. Contracts is the fourth type AI vendors will pitch most aggressively and where it consistently overpromises; use AI for contract summarisation and clause flagging for legal review, not for autonomous extraction of binding terms.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three-tier human-in-loop',
            "Auto-process (60–70%) · light review (25–35%) · full review (5–10%). Tune the four auto-process conditions quarterly based on actual error rates. First-quarter conservative; loosen as the system proves itself."),
          narration:
            "Two. Three-tier human-in-loop pattern. Auto-process tier — sixty to seventy percent of documents — meets all four conditions and flows to ERP with audit log entry. Light review tier — twenty-five to thirty-five percent — procurement reviews on a focused screen in thirty to sixty seconds per document. Full review tier — five to ten percent — strategic documents get full attention with AI extraction as starting point. Tune the four auto-process conditions quarterly based on actual error rates surfacing in production. First quarter run conservative thresholds; loosen as the system proves itself.",
        },
        {
          html: stepCard('check', 'green', 'Three — Four audit posture components',
            "Confidence scores logged · source document linked to every transaction · documented model controls (2-page signed policy) · error tracking and remediation log. Build before first audit, not during."),
          narration:
            "Three. Four audit posture components. Confidence scores logged per extraction field so auditors can sample-test accuracy at scale. Source document linked to every ERP transaction so auditors can trace transactions in two clicks. Documented model controls in a two-page signed policy covering model in use, validation history, threshold setting rationale, retraining ownership, exception handling. Error tracking and remediation log with annual pattern review. Build all four before the first external audit, not during. Building during an audit produces rework and findings that take a year to clear.",
        },
      ],
      narrationTrail:
        "Chapter four — logistics optimisation. Where AI complements operations research and where it doesn't. See you there.",
    },
  ],
}
