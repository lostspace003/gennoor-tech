import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFinServChapter04: Chapter = {
  courseId: 'ai-in-financial-services',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-credit-and-underwriting',
  title: 'Credit scoring and underwriting',
  subtitle: 'Where AI moves from operations into a regulated decision — and the controls that come with it.',
  slides: [
    // SLIDE 1
    {
      title: 'Credit scoring and underwriting',
      iconKey: 'shield',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Credit scoring and underwriting is where AI in BFSI crosses from operations into a regulated decision. The decision affects a customer’s life. The regulator wants to know how it’s made. The auditor wants the evidence. In the next few minutes, the patterns that survive examination.</p>`,
      narrationLead:
        "Welcome to chapter four. Credit scoring and underwriting. This is where AI in BFSI crosses from operations into a genuinely regulated decision. Every approval and every decline affects a customer's life — and a regulator's expectation. The regulator wants to know how the decision is made. The auditor wants the evidence trail. The customer wants the answer in plain language. In the next few minutes, the patterns that survive examination — and how to deploy them without crossing the explainability line.",
    },
    // SLIDE 2
    {
      title: 'Three deployment patterns — choose deliberately',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · Deployment patterns',
      bodyHtml: `<p>Three legitimate deployment patterns. Each has different explainability expectations and different regulator conversations. The wrong choice surfaces later — under examination.</p>`,
      narrationLead:
        "Three legitimate deployment patterns for AI in underwriting. Each has different explainability expectations. Each has a different regulator conversation. The wrong choice for your jurisdiction surfaces later — usually under examination, when the cost of changing the choice is much higher. So pick deliberately.",
      steps: [
        {
          html: stepCard('search', 'green', 'Pattern A — AI as decision support, human approves',
            "The AI scores, ranks, and surfaces evidence. The underwriter makes the decision. The simplest regulatory posture — because the human is accountable. Speeds the underwriter without removing them. Good for relationship lending and commercial."),
          narration:
            "Pattern A. AI as decision support. The AI scores. Ranks. Surfaces the relevant evidence. But the underwriter makes the actual decision. This is the simplest regulatory posture — because the human is the accountable decision-maker. The AI speeds the underwriter without removing them. This pattern works well for relationship lending, commercial credit, and any segment where customer context matters more than transaction volume. The trade-off is throughput — you still need the underwriter team.",
        },
        {
          html: stepCard('search', 'blue', 'Pattern B — AI auto-decides at the easy end, human at the rest',
            "Clear approvals and clear declines auto-process. Anything in the middle band routes to a human underwriter. The model card declares the threshold. The threshold is reviewed quarterly with risk and compliance. The pattern most retail banks use."),
          narration:
            "Pattern B. AI auto-decides at the easy end, human at the rest. Clear approvals — strong scores, clean profile, low risk — auto-process. Clear declines — failed screening, insufficient income, prior fraud flags — auto-process. Anything in the middle band routes to a human underwriter. The model card declares the threshold for what counts as the easy end. The threshold is reviewed quarterly with risk and compliance. This is the pattern most retail banks are using in 2026. It captures most of the throughput benefit while leaving the judgement calls with humans.",
        },
        {
          html: stepCard('search', 'amber', 'Pattern C — Full AI decisioning with right of review',
            "The AI decides; the customer has a clear right to request human review. Used in unsecured retail with low value-at-risk. Requires explainability that holds for any individual case — typically SHAP-based per-decision rationale. Mature governance required."),
          narration:
            "Pattern C. Full AI decisioning with a clear customer right of review. The AI decides — approve or decline — and the customer has a clearly communicated right to request a human review of their case. Used in unsecured retail credit at low value-at-risk. Requires explainability that holds for any individual decision — typically SHAP-based per-decision rationale, or equivalent. This pattern requires mature governance. Don't reach for it as your first deployment. It is the destination, not the starting point.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Most jurisdictions favour pattern B',
        "GCC, India, most of Africa — the regulator preference is currently pattern B. Pattern A is the safer starting position. Pattern C requires more mature governance than most banks have at first deployment. Sequence accordingly."),
      calloutNarration:
        "Here's the regulator landscape as of 2026. GCC. India. Most of Africa. The current regulator preference is pattern B — AI auto-decides at the easy end, with a human at the difficult middle band. Pattern A is the safer starting position if your AI deployment is new. Pattern C requires more mature governance than most banks have at first deployment — and it is harder to defend in early examinations. Sequence accordingly. Start at pattern A or B. Move to C only when the governance machinery is genuinely in place. Not before. The penalty for moving too fast here is significant.",
    },
    // SLIDE 3
    {
      title: 'Explainability — the non-negotiable',
      iconKey: 'search',
      eyebrow: 'Lesson 2 · Explainability',
      bodyHtml: `<p>If the AI cannot explain a specific decision to a specific customer in plain language, the AI cannot be in production. Three implementations of explainability.</p>`,
      narrationLead:
        "If the AI cannot explain a specific decision to a specific customer in plain language, the AI cannot be in production. Full stop. This is the line. Three implementations of explainability that meet regulator expectations in 2026.",
      steps: [
        {
          html: stepCard('check', 'blue', 'Implementation 1 — Inherently interpretable models',
            "Logistic regression, gradient boosting with feature importance, scorecards. The model is interpretable by its structure. The simplest path to explainability — and often more than accurate enough for credit decisions."),
          narration:
            "Implementation one. Inherently interpretable models. Logistic regression. Gradient boosting with feature importance. Traditional scorecards. The model is interpretable simply by its structure — you can read off which features drove the decision. This is the simplest path to explainability. And here's the underrated point — these models are often more than accurate enough for credit decisions. The marginal accuracy gain from a deep neural network is usually small. The interpretability loss is large. Start with interpretable models. Justify any move away from them.",
        },
        {
          html: stepCard('check', 'amber', 'Implementation 2 — Post-hoc SHAP explanations',
            "For non-interpretable models, SHAP values produce per-decision explanations. Every approval and decline carries its top-3 contributing factors. Audited annually. Defensible — but heavier infrastructure than interpretable models."),
          narration:
            "Implementation two. Post-hoc SHAP explanations on a non-interpretable model. For models where you genuinely need the additional capability — say, gradient boosting with hundreds of features — SHAP values produce per-decision explanations. Every approval and every decline carries its top three contributing factors. The infrastructure is heavier than for interpretable models. The audit work is more substantial. But the pattern is defensible — provided you audit the SHAP framework annually and document its assumptions.",
        },
        {
          html: stepCard('check', 'green', 'Implementation 3 — Customer-facing explanation in plain language',
            "Whichever model and method — the customer gets the answer in plain language. Not statistical jargon. Not feature names. Plain language that a customer-service rep can read aloud. This is the surface most regulators actually examine."),
          narration:
            "Implementation three. Customer-facing explanation in plain language. Whichever underlying model and whichever explainability method — the customer gets the answer in plain language. Not statistical jargon. Not feature names from the model. Plain English, plain Arabic, plain Hindi — that a customer service representative can read aloud over the phone. This is the surface most regulators actually examine. A perfect SHAP explanation that the customer service team can't translate into a sentence is, from a regulator's perspective, no explanation at all. Treat the customer-facing translation as a first-class deliverable.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Bias monitoring — the conversation regulators will have eventually',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Bias',
      bodyHtml: `<p>The bias conversation will come. Better to have the monitoring framework in place before a regulator letter than to invent one in response to it.</p>`,
      narrationLead:
        "The bias conversation will come. To your bank. To your insurer. The only question is whether it comes before you have the monitoring framework, or after. Banks that build the framework first weather the conversation in a few quarters. Banks that build it in reaction take eighteen months and pay reputational cost. Three components of a defensible framework.",
      steps: [
        {
          html: stepCard('shield', 'blue', '1 · Outcome monitoring by protected group',
            "Approval rate, decline rate, average score — broken down by protected and proxy groups (gender, region, age band, nationality where lawful). Reviewed quarterly. The basic infrastructure — and missing in surprisingly many banks."),
          narration:
            "Component one. Outcome monitoring by protected group. Approval rate. Decline rate. Average score. Broken down by protected and proxy groups — gender, region, age band, nationality where lawful to track. Reviewed quarterly with risk and compliance. This is the basic infrastructure of bias monitoring. And it is missing — or only partially implemented — in surprisingly many banks today. Build it for every AI-touched credit product. Don't wait for a regulator letter to surface the gap.",
        },
        {
          html: stepCard('shield', 'amber', '2 · Counterfactual fairness testing',
            "Hold all features constant except the protected attribute. Does the model produce a different decision? If yes — the model has learned the protected attribute through proxies. Re-train. This testing happens quarterly, after every retrain, and on demand."),
          narration:
            "Component two. Counterfactual fairness testing. Hold all features constant except for the protected attribute. Does the model produce a different decision when the protected attribute changes? If the answer is yes — the model has learned the protected attribute through proxies, even if the protected attribute itself is not in the model. Re-train, or remove the proxy features. This testing happens quarterly. After every model retrain. And on demand when a regulator question or internal audit query surfaces. It is also the part that most vendors will tell you their tool can do — and that, in practice, often requires more bespoke work.",
        },
        {
          html: stepCard('shield', 'red', '3 · Human override pattern review',
            "When underwriters override AI decisions — track the patterns. Are overrides systematically benefiting one group? That pattern, undetected, becomes the bias story in the press. Independent review of overrides, monthly."),
          narration:
            "Component three. Human override pattern review. When underwriters override the AI's decision — in either direction — track the patterns. Are overrides systematically benefiting one group and disadvantaging another? Even with the AI controlled for bias, the human override layer can quietly reintroduce it. That pattern, undetected, becomes the bias story when a journalist or researcher analyses your portfolio. Independent monthly review of overrides — by someone outside the underwriting team. Often, that's internal audit or risk. The review is uncomfortable. It is also the safeguard.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'The right tone in the bias conversation',
        "Banks that have the bias monitoring infrastructure tend to have <em>shorter</em> regulator conversations on this topic — because the regulator sees the discipline already in place. The bias conversation isn't avoided. It's calibrated."),
      calloutNarration:
        "Here's the right tone in the bias conversation. Banks that have the bias monitoring infrastructure tend to have shorter conversations with regulators about bias — because the regulator can see the discipline already in place. They ask the questions. The bank can show the evidence. The conversation ends in a quarter, not in a multi-year remediation programme. The bias conversation isn't avoided by deploying AI carefully. It's calibrated. The work compounds. Build it once, defend it forever.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 5 — claims and operations.</p>`,
      narrationLead:
        "Three anchors before we move to claims and operations in chapter five.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three deployment patterns; favour B',
            "Decision support · auto-easy-with-human-middle · full AI with right of review. Most banks start at A, move to B. Reserve C for mature governance."),
          narration:
            "One. Three deployment patterns. Pattern A is decision support with human approval. Pattern B is auto-decide at the easy end with human at the middle. Pattern C is full AI with right of customer review. Most banks start at A and move to B. Reserve C for mature governance — it is the destination, not the starting point.",
        },
        {
          html: stepCard('check', 'green', 'Two — Plain language explanation is the surface that matters',
            "Behind SHAP or interpretable model — translate to plain language the customer service team can read aloud. That is what the regulator actually examines."),
          narration:
            "Two. Plain language explanation is the surface that matters most. Behind the SHAP values or the interpretable model — translate into plain language that a customer service rep can read aloud over the phone. That is what the regulator actually examines. Treat it as a first-class deliverable.",
        },
        {
          html: stepCard('check', 'green', 'Three — Bias monitoring before the letter',
            "Outcome monitoring · counterfactual fairness · override pattern review. Build before the regulator letter, not after. The conversation is shorter when the discipline is in place."),
          narration:
            "Three. Bias monitoring before the regulator letter. Outcome monitoring by protected group. Counterfactual fairness testing. Override pattern review monthly by an independent party. Build the infrastructure before the regulator letter, not in response to it. The conversation is meaningfully shorter when the discipline is already in place.",
        },
      ],
      narrationTrail:
        "Chapter five — claims processing and operations AI. The patterns that quietly compound across the back office. See you there.",
    },
  ],
}
