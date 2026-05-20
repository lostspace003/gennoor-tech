import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiCsChapter01: Chapter = {
  courseId: 'ai-for-customer-service-support',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-fit-map',
  title: 'The CS-AI fit map',
  subtitle: 'Three patterns that ship — agent assist, scoped bots, knowledge AI · two that backfire · one principle that decides where to start.',
  slides: [
    // SLIDE 1
    {
      title: 'The CS-AI fit map',
      iconKey: 'compass',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">Customer service is where AI productivity gains can be huge — and where customer trust can collapse fastest. The fit map decides which AI patterns ship value and which produce the CSAT drop that costs you your renewal cycle.</p>`,
      narrationLead:
        "Welcome to AI for Customer Service and Support. This course is for CX leaders, support managers, contact-centre operators, and the rev ops teams who own customer-facing service across phone, chat, and email. Customer service is where AI productivity gains can be huge — handle time down, first-contact resolution up, agent ramp time down. It is also where customer trust collapses fastest when AI is deployed badly. CSAT drops in support translate directly into churn next quarter. The fit map in this chapter decides which AI patterns ship value and which produce the CSAT drop. Three patterns that ship. Two that backfire. One principle for every vendor pitch.",
    },
    // SLIDE 2
    {
      title: 'Three patterns that consistently ship value',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · The wins',
      bodyHtml: `<p>Three patterns deploy reliably across industries when the operating discipline is in place. Each is covered in depth in a later chapter — this is the inventory.</p>`,
      narrationLead:
        "Three patterns deploy reliably across industries and across contact-volume sizes when the operating discipline is in place. Each pattern is covered in a later chapter — this slide is the inventory. The pattern across all three. AI assists the agent or grounds the customer in your own knowledge — AI never replaces the moment of judgment where the customer needs a human to actually solve.",
      steps: [
        {
          html: stepCard('users', 'green', 'Pattern 1 — Agent assist (highest ROI)',
            "AI listens to the call or reads the chat. Suggests next response. Pulls policy answers. Drafts the case summary. Agent handle time drops 25–40%. CSAT rises because answers are more accurate. Chapter two."),
          narration:
            "Pattern one. Agent assist. The highest-ROI customer service AI deployment for almost every team. AI listens to the call or reads the live chat. It suggests the next response. It pulls the relevant policy answer from the knowledge base. It drafts the case summary at wrap-up. The agent stays in control — they accept, edit, or override every suggestion. Handle time drops typically twenty-five to forty percent. CSAT rises because the agent's answers are more accurate and more consistent across the team. Customer satisfaction with the rep also rises because the rep sounds more confident. Start here. Chapter two covers it.",
        },
        {
          html: stepCard('zap', 'green', 'Pattern 2 — Scoped tier-1 deflection bots',
            "Narrowly-scoped bot handles password resets, order status, return initiation, simple account changes. Clean handoff when scope is exceeded. Deflection 30–50% on the in-scope intents. CSAT can rise if scope is right."),
          narration:
            "Pattern two. Scoped tier-1 deflection bots. Critical word — scoped. The bot handles a small, well-defined set of high-volume intents — password resets, order status checks, return initiation, simple account changes — and it has a clean handoff when the scope is exceeded. Deflection on the in-scope intents lands typically thirty to fifty percent. CSAT can actually rise rather than fall, because customers prefer self-service for routine tasks. The danger is unscoped bots — bots that try to handle anything — which is the first anti-pattern in the next slide. Chapter three covers scoped bots and the clean-handoff design.",
        },
        {
          html: stepCard('bookOpen', 'green', 'Pattern 3 — Grounded knowledge AI (RAG)',
            "AI answers customer questions from your actual knowledge base — with citations. Hallucination risk drops sharply when grounding is enforced. Works in both customer-facing self-serve and agent-facing answer surfaces. Chapter five."),
          narration:
            "Pattern three. Grounded knowledge AI — usually some form of retrieval-augmented generation, or RAG. The AI answers customer questions from your actual knowledge base content, with explicit citations back to the source articles. Hallucination risk drops sharply when grounding is enforced — the AI is constrained to your content and refuses to answer outside it. Works in two surfaces — customer-facing self-serve search on your help centre, and agent-facing answer suggestions during live conversations. The two surfaces share the same underlying knowledge base, which means improvements compound across both. Chapter five covers it, including the hallucinated-policy failure mode that's bitten several large brands publicly.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Two patterns that consistently backfire',
      iconKey: 'x',
      eyebrow: 'Lesson 2 · The disappointments',
      bodyHtml: `<p>Two CS-AI patterns are pitched constantly and consistently backfire. Name them. Don't fund them. Redirect the budget to the three that work.</p>`,
      narrationLead:
        "Two customer service AI patterns are pitched constantly — by AI vendors, by analyst firms, by your competitors looking for cost reduction headlines. Both consistently backfire when actually deployed at scale. Name them. Don't fund them. Redirect the budget to the three patterns that work. The pattern across both disappointments — both try to remove the human from the moment the customer needs a human most.",
      steps: [
        {
          html: stepCard('x', 'red', 'Disappointment 1 — Unscoped general-purpose bot',
            "The bot promises to handle everything. It can't. Customers spend 4 messages getting nowhere then demand a human — angrier than if they'd reached one in the first place. CSAT drops 15–25 points. Repeat-contact rate doubles."),
          narration:
            "Disappointment one. The unscoped general-purpose bot. The vendor pitches a single AI that handles any customer intent. The deployment proves the bot can't handle anything outside its actual training. Customers spend three or four messages getting nowhere — then demand a human, angrier than if they'd reached one in the first place. CSAT drops fifteen to twenty-five points across the in-scope contact mix. Repeat-contact rate roughly doubles because the bot interaction doesn't resolve the issue. Cost per contact rises rather than falls when you measure end-to-end. The unscoped bot is the single biggest CS-AI brand event of the last two years for several large consumer brands. Don't fund it.",
        },
        {
          html: stepCard('x', 'red', 'Disappointment 2 — AI-only escalation routing without rep judgment',
            "AI decides which contacts route to senior agents. Without rep judgment in the loop, the model misroutes 20–30% of cases — exactly the high-emotion cases that needed senior help. Senior agents handle the wrong cases; junior agents handle the explosive ones."),
          narration:
            "Disappointment two. AI-only escalation routing without rep judgment in the loop. The pitch — AI decides which contacts route to senior agents based on signal complexity. The reality once deployed — the model misroutes twenty to thirty percent of cases, and the misrouted ones are systematically the high-emotion cases that most needed a senior agent. The signal the AI used to score complexity wasn't a signal for emotional weight. Senior agents handle the cases that don't need them. Junior agents face the explosive cases that were exactly the ones to escalate. CSAT collapses in the high-emotion tail, which is exactly the tail that drives churn. Use AI to surface escalation signals to a supervisor. Let the supervisor route. Don't let the AI route autonomously.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The pattern across the two',
        "Both replace human judgment instead of augmenting it — in moments where the customer specifically needs human judgment. Same principle as chapter one of the Sales AI course. Augment, don't replace."),
      calloutNarration:
        "The pattern across both disappointments. Both replace human judgment in moments where the customer specifically needs human judgment. The unscoped bot replaces the agent for issues that require interpretation. The autonomous escalation router replaces the supervisor for routing decisions that require emotional intelligence. Same principle as the sales AI course. Augment human judgment. Don't replace it. The principle is the same across every customer-facing AI deployment. The cost of breaking it is asymmetric — small productivity gain, large customer trust event.",
    },
    // SLIDE 4
    {
      title: 'The principle for every vendor pitch',
      iconKey: 'compass',
      eyebrow: 'Lesson 3 · The principle',
      bodyHtml: `<p>One principle decides which CS-AI vendor pitches you take seriously and which you decline in ten seconds. Tape it to the wall.</p>`,
      narrationLead:
        "One principle decides which CS-AI vendor pitches you take seriously and which you decline in ten seconds. Tape it somewhere visible in your office. Apply it as the first filter on every demo, every analyst recommendation, every internal pitch from your own team chasing the productivity headline.",
      steps: [
        {
          html: stepCard('compass', 'amber', 'The principle',
            "AI handles volume — humans handle judgment. The bot resets passwords; the agent resolves the angry customer. Get the line right and AI compounds. Get it wrong and customers leave."),
          narration:
            "The principle. AI handles volume. Humans handle judgment. The bot resets passwords for the hundred thousand routine requests where the customer just needs the task done. The agent resolves the angry customer where the customer needs someone who can interpret, empathise, and commit on behalf of the company. Get the line between volume and judgment right — AI compounds. Get the line wrong — customers leave, often quietly, with the brand cost showing up in retention metrics two quarters later when it's too late to attribute.",
        },
        {
          html: stepCard('check', 'green', 'How to apply it to new vendor pitches',
            "Ask one question. Does this AI take over the moment where a customer needs a human's interpretation, empathy, or commitment? If yes — pass. If no — evaluate normally. The principle eliminates 50–70% of pitches in 10 seconds."),
          narration:
            "How to apply the principle in vendor evaluation. Ask one question. Does this AI take over the moment where a customer needs a human's interpretation, empathy, or commitment? If yes — pass on the pitch, regardless of the demo quality. If no — evaluate normally on integration, total cost, deployment timeline, and team fit. The principle eliminates fifty to seventy percent of CS-AI pitches in ten seconds. That's the correct rejection rate for the current vendor market.",
        },
        {
          html: stepCard('shield', 'amber', 'Why customers can tell',
            "Customers in 2026 can detect AI in support interactions with high accuracy. AI handling routine requests gets a small CSAT boost. AI handling emotional or complex requests gets a large CSAT penalty. The asymmetry is consistent across industries."),
          narration:
            "Why customers can tell — and why this matters more in 2026 than in 2024. Customers can now detect AI in support interactions with high accuracy. AI handling clearly routine requests like a password reset gets a small CSAT boost — customers prefer self-service for routine things. AI handling emotional or complex requests gets a large CSAT penalty — customers feel they were palmed off to a bot when they needed a person. The asymmetry is consistent across industries. The same AI can lift CSAT in one context and crater it in another. The principle is what tells you which context you're in.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter two — agent assist done right.</p>`,
      narrationLead:
        "Three anchors before chapter two — agent assist done right.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three patterns that ship',
            "Agent assist (start here) · scoped tier-1 deflection bots · grounded knowledge AI with citations. Each is covered in depth in chapters two through five."),
          narration:
            "One. Three customer service AI patterns that consistently ship value. Agent assist — the highest-ROI starting point for almost every team. Scoped tier-1 deflection bots with clean handoff when scope is exceeded. Grounded knowledge AI with explicit citations, deployed in both customer self-serve and agent-facing surfaces. Chapters two, three, and five cover each in detail.",
        },
        {
          html: stepCard('check', 'green', 'Two — Two that backfire',
            "Unscoped general-purpose bot · AI-only autonomous escalation routing. Both replace human judgment exactly where customers need it most. Don't fund them, regardless of the demo quality."),
          narration:
            "Two. Two patterns that consistently backfire. The unscoped general-purpose bot — drops CSAT, doubles repeat-contact rate, raises cost per contact. AI-only autonomous escalation routing — misroutes high-emotion cases systematically, cratering CSAT in the tail that drives churn. Both replace human judgment exactly where customers need it most. Don't fund them regardless of the demo quality.",
        },
        {
          html: stepCard('check', 'green', 'Three — One principle',
            "AI handles volume; humans handle judgment. Apply it to every vendor pitch as the first filter — it eliminates 50–70% in 10 seconds. Customers can tell the difference; CSAT shows it."),
          narration:
            "Three. One principle for every CS-AI vendor pitch. AI handles volume. Humans handle judgment. Apply it as the first filter — it eliminates fifty to seventy percent of pitches in ten seconds, which is the correct rejection rate for the current vendor market. Customers in 2026 can detect AI in support interactions and react asymmetrically — small CSAT boost on routine handling, large CSAT penalty on emotional or complex handling. The principle is what tells you which context the AI is operating in.",
        },
      ],
      narrationTrail:
        "Chapter two — agent assist done right. The component stack, the three anti-patterns to avoid, and the rollout rhythm. See you there.",
    },
  ],
}
