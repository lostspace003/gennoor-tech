import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFinServChapter01: Chapter = {
  courseId: 'ai-in-financial-services',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-where-bfsi-ai-value-lives',
  title: 'Where BFSI AI value lives',
  subtitle: 'Four patterns that pay in regulated finance. One that quietly does not.',
  slides: [
    // SLIDE 1
    {
      title: 'Where BFSI AI value lives',
      iconKey: 'compass',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">This course is for BFSI executives, risk officers, and senior heads of function. In the next few minutes, the four AI patterns that actually pay in a regulated bank — and the one that quietly does not. Built for the GCC, Indian NBFC, and African bank reality. Not for an unregulated startup deck.</p>`,
      narrationLead:
        "Welcome to the course. This is for BFSI executives. Risk officers. Senior heads of function. People who carry both an AI agenda and a regulator obligation at the same time. We're going to spend roughly an hour walking through where AI value actually lives in a regulated bank or insurer. Four patterns that pay. One that quietly does not. The framework is built for the reality of the GCC, the Indian NBFC market, and African banking — not for an unregulated startup pitch deck. Let's begin.",
    },
    // SLIDE 2
    {
      title: 'The four BFSI AI patterns',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · The patterns',
      bodyHtml: `<p>Four patterns. Each anchors a specific operating problem. Each pays differently. And each has a different regulator conversation attached.</p>`,
      narrationLead:
        "Four patterns. Each one anchors a specific operating problem inside a bank or insurer. Each one pays differently. And critically — each one has a different regulator conversation attached. Get the conversations clear, and the rollout becomes manageable. Confuse them, and the rollout stalls. Here are the four.",
      steps: [
        {
          html: stepCard('shield', 'red', 'Pattern 1 — Risk and compliance AI',
            "Fraud detection. AML transaction monitoring. KYC document automation. Sanctions screening uplift. Pays in <em>losses prevented</em> and <em>false-positive reduction</em>. The regulator conversation is heavy — but they want this done well, not avoided."),
          narration:
            "Pattern one. Risk and compliance AI. Fraud detection. AML transaction monitoring. KYC document automation. Sanctions screening uplift. The math is losses prevented, plus false-positive reduction. The regulator conversation here is heavy — but it's important to recognise something. Your regulator actually wants this done well. They don't want it avoided. They want better fraud detection, fewer false positives clogging the SAR pipeline, faster KYC for legitimate customers. Frame the conversation as how — not whether.",
        },
        {
          html: stepCard('search', 'blue', 'Pattern 2 — Underwriting and credit AI',
            "Loan origination agents. Credit scoring models. Insurance underwriting copilots. Pays in <em>application-to-decision speed</em> and <em>portfolio-quality improvement</em>. The regulator conversation centres on explainability and bias."),
          narration:
            "Pattern two. Underwriting and credit AI. Loan origination agents. Credit scoring models. Insurance underwriting copilots. The math is application-to-decision speed — which directly affects customer acquisition — plus portfolio quality improvement. The regulator conversation centres on two things. Explainability — can the bank explain why this applicant was approved or declined? And bias — is the model treating protected groups consistently? Both are addressable. Neither is optional.",
        },
        {
          html: stepCard('users', 'amber', 'Pattern 3 — Customer and advisor copilots',
            "Relationship-manager copilots. Wealth advisor research assistants. Claims handler agents. Pays in <em>productive customer time</em> and <em>service consistency</em>. The regulator conversation is about advice quality and data residency."),
          narration:
            "Pattern three. Customer and advisor copilots. Relationship-manager copilots that surface portfolio context and prepare meetings. Wealth advisor research assistants that ground responses in your firm's own product set. Claims handler agents in insurance. The math is productive customer time — how much of an advisor's day is spent in front of customers rather than preparing for them. Plus service consistency. The regulator conversation is about advice quality and data residency. Especially in the GCC and Indian markets, the data residency question is now louder than the advice quality one. Plan for it.",
        },
        {
          html: stepCard('bookOpen', 'green', 'Pattern 4 — Operations and back-office AI',
            "Document processing in trade finance. Reconciliation in operations. Multimodal RAG over financial PDFs for institutional clients. Pays in <em>unit cost reduction</em>. The regulator conversation is the lightest — but the audit-trail discipline still applies."),
          narration:
            "Pattern four. Operations and back-office AI. Document processing in trade finance. Reconciliation in operations. Multimodal RAG over financial PDFs for institutional banking clients. The math is unit cost reduction in the back office. The regulator conversation here is the lightest of the four — but the audit trail discipline still applies. Banks don't get to skip audit trails because the use case is internal. The same evidence standards apply.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The fifth pattern to skip',
        "Generative chat over the bank's intranet. Pretty demos. Almost no measurable value — because the questions employees actually need to ask aren't usually answerable from the intranet. Fund only after the four real patterns are deployed."),
      calloutNarration:
        "The fifth pattern is the one to recognise — and skip until later. Generative chat over the bank's intranet or internal wiki. Pretty demos. Almost no measurable BFSI value — because the questions bank employees actually need to ask aren't typically answerable from the intranet alone. They need policy, customer context, regulatory text, and historical decisions stitched together. The chat-over-intranet pattern doesn't deliver that. Fund it only after the four real patterns are in production. Don't let a vendor lead with this and call it BFSI transformation. It isn't.",
    },
    // SLIDE 3
    {
      title: 'The sector-specific filter',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · Filters',
      bodyHtml: `<p>Three filters every BFSI AI proposal must pass. If a proposal cannot pass all three, it is not yet ready for capital.</p>`,
      narrationLead:
        "Three filters every BFSI AI proposal must pass. If a proposal cannot pass all three, it is not yet ready for capital — regardless of how impressive the demo is. Take these into your next AI investment committee.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Filter 1 — Explainability fit',
            "Can the bank explain a single decision to a customer, an auditor, or a regulator? If no — the use case is at most a research project. Production demands explainability that holds up under examination."),
          narration:
            "Filter one. Explainability fit. Can the bank explain a single decision the AI made — to a customer, to internal audit, to the regulator — within a reasonable time. If the answer is no, the use case is at most a research project. Not a production deployment. Production demands explainability that holds up under examination. This filter alone disqualifies many vendor demos. Apply it ruthlessly.",
        },
        {
          html: stepCard('shield', 'amber', 'Filter 2 — Audit-trail discipline',
            "Every input, every model output, every human override — logged. Retrievable years later when the examiner asks. If the proposal doesn't show this, the proposal hasn't been seriously scoped."),
          narration:
            "Filter two. Audit-trail discipline. Every input the model received. Every output it produced. Every human override on the output. Logged. Retrievable years later when the examiner asks about a specific case. If the proposal doesn't explicitly show this discipline in its design, the proposal hasn't been seriously scoped for a regulated environment. Send it back. The vendor will produce it. They just often don't lead with it.",
        },
        {
          html: stepCard('shield', 'green', 'Filter 3 — Data residency and sovereignty',
            "Where is the model running? Where is the data going during inference? Can the inference be moved on-shore or to a sovereign cloud if regulators require? Without a clear answer, the proposal cannot ship in most BFSI jurisdictions."),
          narration:
            "Filter three. Data residency and sovereignty. Where is the model actually running. Where is the customer data going during inference. Can the inference be moved on-shore — or to a sovereign cloud — if and when regulators require it. Without clear answers, the proposal cannot ship in most BFSI jurisdictions. SAMA, MAS, RBI, the Indian RBI, the South African Reserve Bank — they are all sharpening this question. Address it at design time. Retrofitting residency after deployment is expensive and painful.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'The three filters in practice',
        "Run the three filters on every AI proposal at the investment committee. If management cannot answer all three crisply in the meeting, the proposal returns for re-scoping. This is not bureaucracy — it is the discipline that keeps your AI portfolio shippable in a regulated environment."),
      calloutNarration:
        "Run the three filters on every AI proposal at the investment committee. Explainability fit. Audit-trail discipline. Data residency and sovereignty. If management cannot answer all three crisply within the meeting — not in a follow-up paper — the proposal returns for re-scoping. This is not bureaucracy. It is the discipline that keeps your AI portfolio shippable in a regulated environment. Without it, you deploy capability you cannot defend. Apply the filters at the start.",
    },
    // SLIDE 4
    {
      title: 'Three traps BFSI teams walk into',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Pitfalls',
      bodyHtml: `<p>Three patterns specific to BFSI AI deployment. Recognise them — and prevent them.</p>`,
      narrationLead:
        "Three traps specific to BFSI AI deployment. Each one has cost a real bank a real quarter of recovery work. Recognise them. Prevent them at design time.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Trap 1 — Treating the regulator as the enemy',
            "Banks that bring the regulator in early — even informally — face less friction than banks that bring them in late. Treat the regulator as a stakeholder, not a gate. Almost every major BFSI AI deployment has been smoother when the regulator was briefed before the news did."),
          narration:
            "Trap one. Treating the regulator as the enemy. Or worse — treating the regulator as someone to surprise. Banks that bring the regulator into the conversation early — even informally — face dramatically less friction than banks that bring them in only when required to. Treat the regulator as a stakeholder, not a gate. Almost every major BFSI AI deployment has been smoother when the regulator was briefed before the news outlets were. Build that habit.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 2 — Single-vendor lock-in for AI inference',
            "If 70% of your BFSI AI runs on one vendor's foundation model, you have a concentration risk regulators will eventually ask about. Diversify inference across at least two providers — especially for high-tier use cases."),
          narration:
            "Trap two. Single-vendor lock-in for AI inference. If seventy percent of your BFSI AI capability runs on one vendor's foundation model — typically OpenAI through Azure, or Anthropic, or Google — you have a concentration risk that regulators will eventually ask about. Diversify inference across at least two providers, especially for high-tier use cases like underwriting and AML. The abstraction layer that allows you to swap providers is cheap to build at the start and expensive to retrofit later.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 3 — Skipping the model-bias conversation',
            "It will come up. Better to have the bias-monitoring framework in place at deployment than to invent one in response to a regulator letter or a journalist story. Build outcome-bias monitoring from day one — not from incident one."),
          narration:
            "Trap three. Skipping the model-bias conversation at deployment. It will come up — either through a regulator letter, an internal audit finding, or, in the worst case, a journalist story. Better to have the bias monitoring framework in place at deployment than to invent one in response to a crisis. Build outcome-bias monitoring from day one. Not from incident one. The data infrastructure to do this is the same infrastructure you need for the regulator conversation. Build it once.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 2 — fraud detection and AML.</p>`,
      narrationLead:
        "Three anchors before we move into fraud detection and AML in chapter two.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four patterns + a fifth to skip',
            "Risk and compliance · underwriting · advisor copilots · operations. Skip generative chat over the intranet until later. Sequence the four deliberately."),
          narration:
            "One. Four patterns plus a fifth to skip. Risk and compliance. Underwriting and credit. Customer and advisor copilots. Operations and back-office. Skip generative chat over the intranet until the four real patterns are in production. Sequence the four deliberately.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three filters at investment committee',
            "Explainability fit · audit-trail discipline · data residency and sovereignty. Run them on every proposal. No exceptions."),
          narration:
            "Two. Three filters at the investment committee. Explainability fit. Audit-trail discipline. Data residency and sovereignty. Run them on every AI proposal. No exceptions. If management can't answer all three in the meeting, the proposal returns for re-scoping.",
        },
        {
          html: stepCard('check', 'green', 'Three — The regulator is a stakeholder',
            "Brief them early. Diversify your inference. Build bias monitoring from day one. The patterns that protect the BFSI AI programme from incident reaction."),
          narration:
            "Three. The regulator is a stakeholder — not an enemy. Brief them early. Diversify your inference across at least two providers for high-tier use cases. Build outcome-bias monitoring from day one. Those three patterns together protect the BFSI AI programme from being shaped by incident reaction instead of by intent.",
        },
      ],
      narrationTrail:
        "Chapter two — fraud detection and AML. The pattern most BFSI AI programmes anchor on first. See you there.",
    },
  ],
}
