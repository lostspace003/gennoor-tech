import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFinServChapter06: Chapter = {
  courseId: 'ai-in-financial-services',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-customer-and-advisor-copilots',
  title: 'Customer and advisor copilots',
  subtitle: 'Where AI starts to change the customer-facing surface — and the controls that come with it.',
  slides: [
    // SLIDE 1
    {
      title: 'Customer and advisor copilots',
      iconKey: 'users',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">Customer copilots and advisor copilots are the most visible AI in your bank. They are what customers see. And they are what regulators most aggressively scrutinise. In the next few minutes, the three patterns that work — and the boundaries that protect both customer and bank.</p>`,
      narrationLead:
        "Welcome to chapter six. Customer and advisor copilots. These are the most visible AI in your bank. They are what customers see when they interact with your digital channels or your relationship managers. And they are what regulators most aggressively scrutinise — because every customer interaction has potential for advice, mis-selling, or breach of suitability. In the next few minutes, the three patterns that work. The boundaries that protect customer and bank. And the controls that make the regulator conversation manageable.",
    },
    // SLIDE 2
    {
      title: 'The three patterns — and what each one is for',
      iconKey: 'users',
      eyebrow: 'Lesson 1 · The patterns',
      bodyHtml: `<p>Three distinct copilot patterns. Each one targets a different customer-facing role and has a different regulatory boundary.</p>`,
      narrationLead:
        "Three distinct copilot patterns in BFSI. Each one targets a different customer-facing role. Each one has a different regulatory boundary. Confusing them — building one when you meant another — is one of the most common mistakes in this area. So let me be specific about each.",
      steps: [
        {
          html: stepCard('users', 'green', 'Pattern 1 — Relationship-manager copilot',
            "Internal-facing. Pulls together customer portfolio, recent interactions, product opportunities. The RM uses it to prepare for meetings. The customer never sees the AI output directly. Lowest regulatory boundary — because the human still authors all customer-facing communications."),
          narration:
            "Pattern one. The relationship manager copilot. This is internal-facing. The AI pulls together the customer's portfolio. Recent interactions. Open service issues. Product opportunities the RM should be aware of for the next conversation. The RM uses the output to prepare for meetings. Critically — the customer never sees the AI's output directly. Everything the customer reads or hears comes through the human RM. This has the lowest regulatory boundary of the three patterns — because the human still authors all customer-facing communications.",
        },
        {
          html: stepCard('users', 'blue', 'Pattern 2 — Wealth advisor research copilot',
            "Helps wealth advisors research products and prepare investment proposals — grounded on the firm's own approved product set. The customer sees the output indirectly, through the advisor. Suitability rules apply. Higher regulatory boundary."),
          narration:
            "Pattern two. The wealth advisor research copilot. Helps wealth advisors research products and prepare investment proposals — grounded specifically on the firm's own approved product set. Not on the wider universe of products available globally. The customer sees the output indirectly, through the advisor's presentation. But suitability rules apply to the proposal itself — was this product appropriate for this customer's risk profile, time horizon, and stated objectives. The regulatory boundary is higher than pattern one. The grounding on your firm's product set is what makes the boundary defensible.",
        },
        {
          html: stepCard('users', 'red', 'Pattern 3 — Customer-facing chat agent',
            "The agent talks to the customer directly. Account queries, basic transactions, product information. Highest regulatory boundary — because the AI is now speaking to the customer. Suitability, fair-dealing, complaints, advice boundary — all in scope. Treat carefully."),
          narration:
            "Pattern three. The customer-facing chat agent. The agent talks to the customer directly through your app, your website, or your contact channels. Account queries. Basic transactions. Product information. The highest regulatory boundary of the three. Because the AI is now speaking to the customer in your bank's voice. Suitability rules apply. Fair-dealing rules apply. Complaints procedures apply. The boundary between information and advice is now front and centre. Treat this pattern carefully. It is the most powerful — and the most demanding.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Sequence the patterns',
        "Most banks should sequence — pattern 1 first, pattern 2 second, pattern 3 third. Each pattern earns the capability to do the next. Pattern 3 deployed first, without the discipline learned in patterns 1 and 2, is where most customer-AI incidents originate."),
      calloutNarration:
        "Sequence the patterns deliberately. Most banks should run pattern one first — the relationship manager copilot. Pattern two second — the wealth advisor research copilot. Pattern three third — the customer-facing chat agent. Each pattern earns the operational capability and the governance maturity to do the next. Pattern three deployed first, without the discipline learned in patterns one and two, is where most customer-AI incidents originate. The temptation to skip to pattern three — because it's the most visible — is real. The cost of skipping ahead is significant. Don't.",
    },
    // SLIDE 3
    {
      title: 'The boundaries — information vs advice',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · The advice line',
      bodyHtml: `<p>The line between information and advice is the line that determines what your copilot can do — and what it must escalate to a licensed human.</p>`,
      narrationLead:
        "The line between information and advice is the line that determines what your copilot can legally do — and what it must escalate to a licensed human. The line is jurisdiction-specific. But the pattern of how to draw it is consistent. Three categories.",
      steps: [
        {
          html: stepCard('check', 'green', 'Category A — Information (the copilot can do this)',
            "Account balance. Transaction history. Fee structures. Product features as described in your published collateral. Branch locations. Hours. No suitability or recommendation. Pure information."),
          narration:
            "Category A. Pure information. The copilot can do this. Account balance. Transaction history. Fee structures. Product features as described in your published collateral. Branch locations. Hours. None of this is advice. None of this is a recommendation. It is the equivalent of what a teller answers without thinking. The copilot can answer freely — with appropriate identity verification.",
        },
        {
          html: stepCard('check', 'amber', 'Category B — Education (the copilot can do this, with care)',
            "General concepts — what an ISA is, how compound interest works, what diversification means. Not personalised. Cite the source. Don't recommend. Don't compare to the customer's own situation. Use guarded language."),
          narration:
            "Category B. Education. The copilot can do this with care. General concepts — what a savings account is. How compound interest works. What diversification means in general investing terms. Not personalised. Cite the source — typically your bank's own published educational content. Don't recommend. Don't compare to the customer's own specific situation. Use guarded language. This is the category that lets a bank add genuine value to a customer interaction without crossing into advice.",
        },
        {
          html: stepCard('x', 'red', 'Category C — Advice (escalate — no exceptions)',
            "“Should I invest in fund X?” “Is this product right for me?” “Should I refinance?” All escalate to a licensed human. The copilot is explicit about why — and routes the conversation to the right channel. Customers respect honesty here."),
          narration:
            "Category C. Advice. The copilot escalates — no exceptions. Should I invest in fund X. Is this product right for me. Should I refinance my mortgage. Should I take this insurance product. All escalate to a licensed human. The copilot is explicit about why it is escalating — not vague. It says, in plain language, that this is a question that requires a licensed advisor, and routes the conversation to the right channel. Customers respect this honesty. Pretending the AI can answer is what destroys trust — and triggers regulator action.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'The escalation script',
        "The exact words the copilot uses when escalating to a human matter. Have your compliance team write the script — not the AI vendor. Test it. Update it. The escalation is the conversation that protects the bank."),
      calloutNarration:
        "The exact words the copilot uses when escalating to a human matter — far more than people realise. Have your compliance team write the escalation script, not the AI vendor. Test it on real customer scenarios. Update it as products change. The escalation is the conversation that protects the bank from advice-line breaches. The vendor's default script will be optimised for completion rate. Your compliance team's script will be optimised for legal defensibility. Pick the latter. The completion rate gain isn't worth the breach.",
    },
    // SLIDE 4
    {
      title: 'Three failure modes to design around',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Failure modes',
      bodyHtml: `<p>Three failure modes that have caused real regulator interventions at real banks. Each one is preventable by design.</p>`,
      narrationLead:
        "Three failure modes that have caused real regulator interventions at real banks in the last twenty-four months. Each one is preventable by design. Address them at deployment.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Failure 1 — Hallucinated product details',
            "The customer asks about a fee structure. The copilot invents one that sounds plausible but is wrong. The customer makes a decision on the wrong information. Prevent — copilot only answers from the verified product database, never from training data."),
          narration:
            "Failure one. Hallucinated product details. The customer asks about a fee structure. The copilot invents one that sounds plausible but is wrong. The customer makes a financial decision on the wrong information. The remediation, once discovered, is expensive — and can include customer compensation and regulator reporting. Prevent it by design — the copilot only answers from your verified product database, never from its own training data. If the database doesn't have the answer, the copilot escalates. The honest no — let me get the right answer for you — is always better than a confident wrong yes.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 2 — Cross-jurisdiction confusion',
            "The customer in India asks about a product feature. The copilot answers based on the UK version of that product. Wrong information delivered with confidence. Prevent — customer jurisdiction is established at session start; the copilot operates within that jurisdiction's product set."),
          narration:
            "Failure two. Cross-jurisdiction confusion. The customer in India asks about a product feature. The copilot answers based on the UK version of that product — because the training data the underlying model saw was UK-heavy. The customer gets wrong information delivered with confidence. Prevent it by design. Establish the customer's jurisdiction at session start. The copilot operates strictly within that jurisdiction's product set. If a question can't be answered within that scope, it escalates. Don't let the underlying model's bias toward English-speaking, Western data drive what the copilot says to your local customers.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 3 — Complaint that was never escalated',
            "The customer expresses dissatisfaction during a conversation. The copilot resolves the immediate question — but never logs the complaint. By the time the customer escalates externally, the bank has no record of the original complaint. Prevent — sentiment detection routes any complaint signal to the formal complaints process, automatically."),
          narration:
            "Failure three. A complaint that was never escalated. The customer expresses dissatisfaction during the conversation with the copilot. Maybe a tone of frustration. Maybe an explicit grievance. The copilot resolves the immediate transaction the customer asked about — and never logs the complaint as a formal complaint. By the time the customer escalates externally — to the ombudsman, the regulator, or social media — the bank has no internal record of the original complaint. The regulator will ask how that happened. Prevent it by design. Sentiment detection on every conversation routes any complaint signal into the formal complaints process automatically. Even if the immediate question was resolved.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 7 — regulatory reporting and the sovereignty question.</p>`,
      narrationLead:
        "Three anchors before chapter seven — where we move to regulatory reporting and the sovereignty question.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three patterns; sequence deliberately',
            "RM copilot → wealth advisor copilot → customer-facing chat agent. Each pattern earns the next. Don't start with pattern 3."),
          narration:
            "One. Three customer-facing AI patterns. Sequence them deliberately. RM copilot first. Wealth advisor research copilot second. Customer-facing chat agent third. Each pattern earns the operational and governance capability needed for the next. Don't start with pattern three.",
        },
        {
          html: stepCard('check', 'green', 'Two — Information, education, advice',
            "Three categories. The copilot does the first two. The third — always escalate. Have compliance write the escalation script — not the vendor."),
          narration:
            "Two. Three content categories. Information — the copilot does freely. Education — the copilot does with care, with citations, in guarded language. Advice — the copilot always escalates to a licensed human. Have your compliance team write the exact escalation script. Not the vendor.",
        },
        {
          html: stepCard('check', 'green', 'Three — Design around the three failure modes',
            "Hallucinated products · cross-jurisdiction confusion · unrecorded complaints. Each one preventable at deployment. Don't discover them through a regulator letter."),
          narration:
            "Three. Design around the three failure modes. Hallucinated product details — prevent with strict grounding on a verified product database. Cross-jurisdiction confusion — establish jurisdiction at session start. Unrecorded complaints — sentiment detection routes complaint signals into the formal process automatically. Each one preventable at deployment. Don't let the regulator be the one to discover them on your behalf.",
        },
      ],
      narrationTrail:
        "Chapter seven — regulatory reporting and the sovereignty question. The conversation your central bank is already having about your AI. See you there.",
    },
  ],
}
