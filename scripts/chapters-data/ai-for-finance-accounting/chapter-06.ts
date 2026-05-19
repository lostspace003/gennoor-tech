import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForFinanceChapter06: Chapter = {
  courseId: 'ai-for-finance-accounting',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-tax-and-compliance-copilots',
  title: 'Tax & compliance copilots',
  subtitle: 'The quiet finance AI play that saves the legal team a quarter of their year.',
  slides: [
    // SLIDE 1
    {
      title: 'Tax & compliance copilots',
      iconKey: 'shield',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">Tax and compliance copilots don’t produce dramatic ROI numbers. They produce something better — they give the senior tax lead and the GC their time back. The boring AI play that compounds across years.</p>`,
      narrationLead:
        "Welcome to chapter six. Tax and compliance copilots. This play doesn't produce dramatic ROI numbers in a board deck. It produces something arguably more valuable. It gives the senior tax lead and the General Counsel their time back. Quietly. Compounding across years. So this chapter is shorter — but the play is more important than its drama-free demos suggest.",
    },
    // SLIDE 2
    {
      title: 'Three high-value use cases',
      iconKey: 'bookOpen',
      eyebrow: 'Lesson 1 · The use cases',
      bodyHtml: `<p>Three uses where the ROI math holds up consistently. Skip the trendy ones — these three are the proven ground.</p>`,
      narrationLead:
        "Three use cases where the ROI math actually holds up consistently in tax and compliance. Skip the trendy ones — chat with the tax code, generative tax memos. These three are the proven ground.",
      steps: [
        {
          html: stepCard('bookOpen', 'green', '1 · Tax document classification',
            "VAT invoices, withholding certificates, transfer-pricing documentation. The team currently sorts these manually into ERP categories. AI classifies on receipt — flags exceptions. Saves 60-80% of routine sorting time."),
          narration:
            "Use case one. Tax document classification. VAT invoices. Withholding certificates. Transfer-pricing documentation. Country-by-country reporting items. The tax team currently sorts these documents manually into ERP categories — usually by the most junior person on the team. AI classifies on receipt. Flags the genuinely ambiguous items for human judgement. Saves sixty to eighty percent of the routine sorting time. The senior tax lead spends that recovered time on the work that needs them.",
        },
        {
          html: stepCard('bookOpen', 'blue', '2 · Regulatory change monitoring',
            "Tax regulations change constantly across the jurisdictions you operate in. An AI agent watches the official sources, summarises changes, and flags items relevant to your specific posture. Saves the GC's office hours per week — and catches more than the manual review."),
          narration:
            "Use case two. Regulatory change monitoring. Tax regulations and compliance requirements change constantly across the jurisdictions you operate in. GCC, EU, US, Africa — each is moving on its own clock. An AI agent watches the official sources daily. Summarises changes. Flags items specifically relevant to your firm's posture — the entities you operate in, the activities you run, the size bands you fall into. Saves the General Counsel's office hours per week. And catches more than the manual review does, simply because the agent doesn't take holidays.",
        },
        {
          html: stepCard('bookOpen', 'amber', '3 · Compliance Q&A grounded on your policies',
            "Employees ask the agent compliance questions — gifts, conflicts, expense limits, data handling. The agent answers from your policy corpus with citations. Escalates anything outside the policy. Frees compliance officers for the genuinely hard cases."),
          narration:
            "Use case three. Compliance Q and A grounded on your policies. Employees ask the agent compliance questions all day. Can I accept this gift? Is this a conflict? What's my expense limit for client meals in this country? How do I handle this data type? The agent answers from your policy corpus — with citations to the exact policy clause. Escalates anything genuinely outside the policy to a human compliance officer. Frees the compliance officers for the genuinely hard cases. And, critically, gives every employee the same answer to the same question. Consistency is a control.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Why these three?',
        "Each one has clean inputs (documents, regulations, policy text), bounded outputs (a category, a summary, a cited answer), and human escalation built in. That's the shape of a tax/compliance use case that ships and stays shipped."),
      calloutNarration:
        "Here's why these three use cases consistently work. Each one has clean inputs — documents, regulations, policy text. Each one has bounded outputs — a category, a summary, a cited answer. And each one has human escalation built in for anything outside scope. That's the shape of a tax or compliance AI use case that ships, and stays shipped. Use cases without that shape — generative tax memos that compose original tax positions, AI that proposes the actual tax filing — they fail or they create risk. The boring three above are the durable wins. Stay boring.",
    },
    // SLIDE 3
    {
      title: 'The build — and the governance overlay',
      iconKey: 'cog',
      eyebrow: 'Lesson 2 · Build and governance',
      bodyHtml: `<p>All three use cases share the same build pattern. The governance overlay is what distinguishes tax/compliance AI from operational AI — the audit committee will read this output.</p>`,
      narrationLead:
        "All three use cases share roughly the same build pattern — Copilot Studio or equivalent agent, grounded on the right document corpus, with escalation rules. So the build isn't the interesting part. The governance overlay is what distinguishes tax and compliance AI from operational AI — because the audit committee will actually read the output of this work. Three governance items.",
      steps: [
        {
          html: stepCard('shield', 'blue', '1 · Source-of-truth lockdown',
            "The corpus the agent reads is the same corpus your policy committee approved. Period. No employee can add documents to it. Changes go through formal policy update. This sounds bureaucratic. It is the entire trust model."),
          narration:
            "One. Source-of-truth lockdown. The corpus the agent reads is exactly the same corpus your policy committee has approved. Period. No employee — including senior employees — can add documents to it informally. Any change goes through your formal policy update process. This sounds bureaucratic. It is the entire trust model. If the corpus drifts, the agent's answers drift, and your audit defence collapses. Lock it down. Document the lockdown.",
        },
        {
          html: stepCard('shield', 'amber', '2 · Citation on every answer',
            "Every answer the agent gives carries a citation to the exact policy clause used. No exceptions. If the agent can't cite, the agent can't answer — escalate to human. Citation is what makes the answer auditable."),
          narration:
            "Two. Citation on every answer. Every answer the agent gives carries a citation to the exact policy clause that produced it. No exceptions. If the agent cannot cite a specific clause, the agent cannot give an answer. It escalates to a human compliance officer. Citation is what makes the answer auditable — and what allows the employee to read the policy themselves and confirm. Don't let convenience override this rule.",
        },
        {
          html: stepCard('shield', 'green', '3 · Quarterly review of edge cases',
            "Once a quarter, the compliance and tax leads review the questions where the agent escalated, where the answer was overridden, or where the user pushed back. These edge cases tell you where the policy itself is ambiguous — and worth clarifying."),
          narration:
            "Three. Quarterly review of edge cases. Once a quarter, the compliance lead and the senior tax lead review the questions where the agent escalated. Where the answer was overridden by a human. Where the user pushed back on the agent's answer. These edge cases tell you where your policy itself is ambiguous — and worth clarifying with an update. This is a hidden benefit of the play. The AI surfaces policy gaps that nobody knew were there. The policy improves over time, just because the AI is asking questions of it constantly.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'What to deliberately NOT do',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Boundaries',
      bodyHtml: `<p>Three things vendors will try to sell you in this space. Three things you say no to — politely, repeatedly.</p>`,
      narrationLead:
        "Three things vendors will try to sell you in the tax and compliance AI space. Three things you say no to — politely, but repeatedly. Each one looks attractive in a demo. Each one introduces risk that outweighs its benefit.",
      steps: [
        {
          html: stepCard('x', 'red', 'Don\'t — AI-generated tax positions',
            "An AI that writes a tax memo or proposes a tax position from scratch. The risk is novel positions that look plausible but are wrong. Tax positions remain a human authorship discipline. AI can support — never originate."),
          narration:
            "One. AI-generated tax positions. An AI that writes a tax memo from scratch. Or proposes a tax position the firm should take. The risk is novel positions that look plausible — beautifully argued, even — but turn out to be wrong. Tax positions remain a human authorship discipline. AI can support the research. AI can flag relevant precedents. AI cannot originate the position. Don't let a vendor cross that line, however confident their demo.",
        },
        {
          html: stepCard('x', 'red', 'Don\'t — Auto-filing without human sign-off',
            "Final tax filings always carry a human signature. No exceptions. The agent can prepare. A senior tax lead signs. The accountability stays human — because the legal accountability is human."),
          narration:
            "Two. Auto-filing without human sign-off. Final tax filings always carry a human signature. Always. No exceptions. The agent can prepare the filing. A senior tax lead reviews and signs. The accountability stays human — because the legal accountability is also human. If anything goes wrong in a filing, the regulator looks for the signer. There needs to be one.",
        },
        {
          html: stepCard('x', 'red', 'Don\'t — Compliance Q&A on questions outside your policy corpus',
            "If your policy doesn't cover the question, the agent says so and escalates. Don't let the agent answer from general training data — that produces confident-sounding answers that aren't your policy."),
          narration:
            "Three. Compliance Q and A on questions outside your policy corpus. If the question isn't covered by your policy, the agent says so honestly and escalates to a human compliance officer. Don't let the agent answer from its general training data when your policy is silent — that produces confident-sounding answers that aren't actually your policy. They're somebody else's policy, or a generic best practice. The employee thinks they got an answer. They didn't. They got a hallucination dressed in your colours. The honest no — I don't know, let me escalate — is better.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Two anchors before chapter 7 — the data quality conversation.</p>`,
      narrationLead:
        "Two anchors before we get to the data quality conversation in chapter seven.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three boring use cases',
            "Document classification · regulatory monitoring · compliance Q&A. Each one bounded, citable, escalatable. The shape is the discipline."),
          narration:
            "One. Three boring use cases. Tax document classification. Regulatory change monitoring. Compliance Q and A on your policies. Each one bounded, citable, escalatable. The shape is the discipline. Use cases that don't fit this shape — like generative tax memos — they fail or they create risk.",
        },
        {
          html: stepCard('check', 'green', 'Two — Source-of-truth lockdown + citation + edge-case review',
            "Three governance items. Without them, the play creates risk faster than it creates value. With them, the play compounds across years."),
          narration:
            "Two. Three governance items. Source-of-truth lockdown. Citation on every answer. Quarterly edge-case review. Without all three, the play creates risk faster than it creates value. With them, the play compounds across years — and your policy itself improves as a side effect.",
        },
      ],
      narrationTrail:
        "Chapter seven — the data quality conversation. The unglamorous prerequisite that decides whether any of the previous chapters actually deliver. See you there.",
    },
  ],
}
