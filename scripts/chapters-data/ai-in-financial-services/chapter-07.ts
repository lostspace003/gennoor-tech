import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFinServChapter07: Chapter = {
  courseId: 'ai-in-financial-services',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-regulatory-and-sovereignty',
  title: 'Regulatory reporting and sovereignty',
  subtitle: 'The conversation your central bank is already having about your AI — and how to lead it.',
  slides: [
    // SLIDE 1
    {
      title: 'Regulatory reporting and sovereignty',
      iconKey: 'shield',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Your central bank is already having a conversation about your AI — whether or not you have heard it directly. The conversation accelerates in 2026 and 2027. In the next few minutes, what regulators expect, how to be prepared, and the sovereignty conversation that has moved from optional to mandatory.</p>`,
      narrationLead:
        "Welcome to chapter seven. Regulatory reporting and sovereignty. Your central bank — SAMA, CBUAE, RBI, the South African Reserve Bank, the Bank of Ghana — is already having a conversation about your AI. Whether or not you have heard it directly. The conversation accelerates through 2026 and 2027. In the next few minutes, what regulators expect. How to be prepared. And the sovereignty conversation that has moved from optional in 2024 to mandatory in 2026.",
    },
    // SLIDE 2
    {
      title: 'What regulators are actually asking',
      iconKey: 'search',
      eyebrow: 'Lesson 1 · The questions',
      bodyHtml: `<p>Five questions. Drawn from real regulator engagements across GCC, India, and Africa. If you can answer all five within ten minutes — your bank is ahead of most peers.</p>`,
      narrationLead:
        "Five questions regulators are actually asking. Drawn from real engagements across the GCC, India, and Africa over the last twenty-four months. If your bank can answer all five within ten minutes in a regulator meeting — without referring to a follow-up paper — you are meaningfully ahead of most peers in the same jurisdiction.",
      steps: [
        {
          html: stepCard('search', 'blue', '1 · What AI systems are you running, by tier?',
            "The inventory question. Same as for any board. Regulators want a one-page list — system, owner, risk tier, last review date. If you can't produce it, the rest of the conversation goes differently."),
          narration:
            "Question one. What AI systems are you running — listed by risk tier? The inventory question. Same as the board would ask. Regulators want a one-page list. System name. Accountable owner. Risk tier. Last review date. Last incident. If you cannot produce this list in the meeting, the rest of the regulator conversation goes in a different direction. Often a more expensive direction. Have the list ready. It's a basic deliverable.",
        },
        {
          html: stepCard('search', 'blue', '2 · How does your AI use map to existing risk frameworks?',
            "Model Risk Management. Operational Risk. Conduct Risk. The regulator expects your AI to be governed under frameworks you already operate — not as a separate parallel discipline. Map deliberately."),
          narration:
            "Question two. How does your AI use map to existing risk frameworks? Model Risk Management. Operational Risk. Conduct Risk. The regulator expects your AI to be governed under the frameworks you already operate — not as a separate parallel discipline that lives outside the established risk machinery. Map your AI controls into the existing frameworks deliberately. Use the same risk taxonomy. Use the same reporting cadences. This signals operational maturity. Reinventing the framework signals immaturity.",
        },
        {
          html: stepCard('search', 'amber', '3 · Where are your customer data and inference happening?',
            "The sovereignty question. Where is the inference running. Where is customer data going. Where is it being stored. Can the regulator see the data flow on a single page? Increasingly — yes is the expected answer."),
          narration:
            "Question three. Where are your customer data and your inference happening? The sovereignty question. Where is the inference layer running — what cloud, what region. Where is customer data going during a typical API call. Where is it being stored. Where are the model logs being kept. Can you show the data flow on a single page. Increasingly across the GCC, India, and African markets — yes is the expected answer. No is a meaningful gap. Build the diagram. Keep it current.",
        },
        {
          html: stepCard('search', 'red', '4 · How do you handle bias and adverse outcomes?',
            "The bias conversation. Outcome monitoring by group. Counterfactual testing. Override review. The regulator wants to see the discipline — not a sentiment that you take fairness seriously. Show the artefacts."),
          narration:
            "Question four. How do you handle bias and adverse outcomes? The bias conversation we covered in chapter four. The regulator wants to see outcome monitoring by protected group. Counterfactual fairness testing on retrains. Independent monthly review of human overrides. They want to see the discipline — the dashboards, the audit findings, the remediations. Not a sentiment that the bank takes fairness seriously. Show the artefacts. Sentiments don't satisfy this question. Artefacts do.",
        },
        {
          html: stepCard('search', 'green', '5 · What is your incident response posture for AI-specific issues?',
            "The tabletop question. When the model produces a wrong decision at scale, when bias surfaces, when data leaks through a vendor — what's the response. Tested in a tabletop in the last 12 months. With findings. This is now standard."),
          narration:
            "Question five. What is your incident response posture for AI-specific issues? The tabletop question. When the underwriting model produces systematically wrong decisions for a quarter before being noticed. When bias surfaces in a press article. When data leaks through a foundation model vendor. What is the response. Has it been tested in a tabletop exercise in the last twelve months. With written findings, and remediation actions tracked. This is now becoming a standard question. Run the tabletop. Document the findings. Bring them to the regulator meeting.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The sovereignty posture — three options, choose deliberately',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · Sovereignty',
      bodyHtml: `<p>Sovereignty is no longer a theoretical concern. Pick a deliberate posture. Document it. Defend it.</p>`,
      narrationLead:
        "Sovereignty is no longer a theoretical concern in BFSI AI. The choice of posture is a board-level question. Three legitimate postures. Pick deliberately. Document the choice. Be prepared to defend it.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Posture A — Sovereign cloud for regulated workloads',
            "All customer-data-touching AI runs on the sovereign cloud region your regulator has approved. Non-regulated workloads can use commercial cloud. Common posture for major GCC banks in 2026. Clear story, manageable cost premium."),
          narration:
            "Posture A. Sovereign cloud for all regulated workloads. All AI that touches customer data runs on the sovereign cloud region your regulator has explicitly approved — Azure UAE, Azure Saudi, Azure India Central, or equivalent. Non-regulated workloads can use commercial cloud. This is the common posture for most major GCC banks in 2026. It is a clear story. The cost premium over commercial cloud is real but manageable. The regulator conversation is straightforward.",
        },
        {
          html: stepCard('shield', 'amber', 'Posture B — Hybrid with PII tokenisation',
            "Sensitive PII tokenised before reaching commercial AI inference. The model sees structure, not the underlying customer data. The token mapping stays on-premise or sovereign. Allows access to frontier models while keeping PII bounded. Sophisticated — but increasingly viable."),
          narration:
            "Posture B. Hybrid with PII tokenisation. Sensitive personally-identifiable information is tokenised before it reaches the commercial AI inference layer. The model sees structure — the shape of the application, the relationship between fields, the pattern of the request — but not the underlying customer data itself. The token-to-value mapping stays on-premise or on sovereign infrastructure. This posture allows access to frontier models — typically more capable than what's available on sovereign cloud — while keeping PII bounded. Sophisticated. Increasingly viable. Some early adopters in the GCC and India are running it for specific high-value use cases.",
        },
        {
          html: stepCard('shield', 'green', 'Posture C — Full on-premise inference',
            "For the most sensitive jurisdictions or the most sensitive workloads. Open-source models running in your own data centre. Slower iteration on capabilities — but uncontested data residency. Some central banks now require this for specific workload types."),
          narration:
            "Posture C. Full on-premise inference. For the most sensitive jurisdictions — and for the most sensitive workload types within those jurisdictions. Open-source foundation models like Llama, Mistral, Qwen running in your own data centre. Slower iteration on capabilities compared to the frontier — because you upgrade models on your schedule, not the vendor's. But the data residency is uncontested. Some central banks are now explicitly requiring this posture for specific workload types. Government banking. Sovereign wealth fund operations. National security related lending. Have a plan for posture C even if your current workloads sit in A or B.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Document the posture choice formally',
        "The choice of sovereignty posture is a board-level decision. Document it formally. Update it annually. The board's signature on the posture is the artefact a regulator will eventually ask about. Have it ready."),
      calloutNarration:
        "The choice of sovereignty posture is a board-level decision. Not a CIO decision. Not a head-of-AI decision. A board-level decision. Document it formally in the AI governance charter from the boards course. Update it annually as your operating reality changes. The board's signature on the chosen posture is the artefact a regulator will eventually ask about — especially after any AI-related incident at any bank in your jurisdiction, when regulators tighten on all banks. Have the board signature ready. Producing it after the fact looks weak. Producing it on demand looks like the bank has its house in order.",
    },
    // SLIDE 4
    {
      title: 'Building the regulator relationship — three moves',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · The relationship',
      bodyHtml: `<p>Three moves that shift the regulator from being a periodic stressor to being a working stakeholder. None are expensive. All are underused.</p>`,
      narrationLead:
        "Three moves that shift the regulator from being a periodic stressor to being a working stakeholder in your AI programme. None of them are expensive. All of them are underused by most banks. Try at least the first two within ninety days.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Move 1 — Brief the regulator before each major deployment',
            "Not after. Not when required. Before. A simple email to the supervisor, with a one-page summary, two weeks before the launch. Almost no bank does this. Most regulators welcome it. The relationship transforms."),
          narration:
            "Move one. Brief the regulator before each major AI deployment. Not after. Not when required by regulation. Before. A simple email to your supervisor at the central bank — or a brief in-person meeting if your relationship supports it — with a one-page summary of what you are about to deploy. Two weeks before the launch. Almost no bank in the GCC, India, or Africa currently does this proactively. And almost every regulator I've heard from would welcome it. The relationship transforms. The next examination on AI-related issues is calmer. The next surprise — and there will be one — is met by a regulator who knew you were operating in this area, not surprised by it.",
        },
        {
          html: stepCard('users', 'amber', 'Move 2 — Volunteer for regulator-led pilots',
            "Most central banks now have AI-related pilots or sandboxes. Participate, even when not directly relevant. The visibility, the relationship, and the learning are worth the marginal effort."),
          narration:
            "Move two. Volunteer for regulator-led pilots or sandboxes. Most central banks now have AI-related pilots — fintech sandboxes, regulatory technology programmes, joint research initiatives. Participate, even when the specific pilot isn't directly relevant to your current priorities. The visibility, the relationship, and the operational learning are worth the marginal effort. The banks that participate are the banks the regulator turns to when they're shaping new guidance. The banks that don't participate find out about new guidance when it's published.",
        },
        {
          html: stepCard('users', 'green', 'Move 3 — Annual AI briefing to the supervisor — written',
            "Once a year, send the supervisor a five-page written briefing. The portfolio shape. The major changes. The incidents and remediations. The forward agenda. Almost no bank does this. The supervisor reads it gratefully — and remembers it at examination time."),
          narration:
            "Move three. Annual AI briefing to your supervisor, in writing. Once a year — typically before the annual examination cycle — send your supervisor a five-page written briefing. The portfolio shape. The major changes in the last year. The incidents and how they were remediated. The forward agenda for the next year. Almost no bank does this proactively. And almost every supervisor reads it gratefully — and remembers it positively at examination time. The cost is one document a year. The benefit compounds for years.",
        },
      ],
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
          html: stepCard('check', 'green', 'One — Five regulator questions, answered in ten minutes',
            "Inventory · framework mapping · sovereignty · bias · incident response. If your bank can answer all five crisply in a meeting, it is ahead of most peers."),
          narration:
            "One. Five regulator questions. Inventory by tier. Mapping to existing risk frameworks. Where data and inference happen. How bias and adverse outcomes are handled. Incident response posture, tested in tabletop. If your bank can answer all five crisply within a ten-minute meeting, it is meaningfully ahead of most peers in the same jurisdiction.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three sovereignty postures; the board chooses',
            "Sovereign cloud · hybrid with PII tokenisation · full on-premise. Document the choice. Board signs. Update annually. The artefact regulators will ask about."),
          narration:
            "Two. Three sovereignty postures. Sovereign cloud for regulated workloads. Hybrid with PII tokenisation. Full on-premise inference. The board chooses. Documents the choice formally. Updates it annually. The board signature on the posture is the artefact a regulator will eventually ask about. Have it ready before they ask.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three relationship moves',
            "Brief before each deployment · volunteer for sandboxes · annual written briefing. Almost no bank does these. All three transform the regulator relationship from stressor to stakeholder."),
          narration:
            "Three. Three relationship moves. Brief the regulator before each major deployment. Volunteer for regulator-led pilots and sandboxes. Send an annual written briefing to your supervisor before the examination cycle. Almost no bank does these proactively. All three transform the regulator relationship from periodic stressor to working stakeholder. Make at least one of them part of the next quarter's plan.",
        },
      ],
      narrationTrail:
        "Final chapter — your BFSI AI roadmap on one page. Where everything we've covered lands as something an executive committee can actually act on. See you there.",
    },
  ],
}
