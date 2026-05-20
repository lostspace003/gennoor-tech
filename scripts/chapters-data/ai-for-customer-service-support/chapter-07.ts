import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiCsChapter07: Chapter = {
  courseId: 'ai-for-customer-service-support',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-voice-ai',
  title: 'Voice support AI',
  subtitle: 'Three voice plays that ship · the latency and accent gotchas · the disclosure customers now expect.',
  slides: [
    // SLIDE 1
    {
      title: 'Voice support AI',
      iconKey: 'zap',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Voice AI in support has matured rapidly — but voice deployments still fail at higher rates than chat deployments because voice is harder. Three plays that ship reliably. The latency and accent gotchas that surface only at scale. The disclosure customers now expect.</p>`,
      narrationLead:
        "Welcome to chapter seven. Voice support AI. Voice AI in customer support has matured rapidly across 2025 and 2026 — speech recognition is meaningfully better, voice synthesis is dramatically more natural, and end-to-end latency is approaching usable for live conversations. Even so, voice deployments still fail at notably higher rates than chat deployments because voice is fundamentally harder — latency is more visible, accent variation matters more, recovery from errors is socially harder. Three voice plays that ship reliably. The latency and accent gotchas that show up only at production scale. And the disclosure customers now expect at the start of every voice AI interaction.",
    },
    // SLIDE 2
    {
      title: 'Three voice plays that ship reliably',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · The plays',
      bodyHtml: `<p>Three voice plays that consistently work when scoped well. Don't try to ship a general voice agent before these are mature. Each is a stepping stone.</p>`,
      narrationLead:
        "Three voice plays that consistently work when scoped well. Each is a stepping stone — start with the simplest, prove the deployment, then expand. Don't try to ship a general voice agent that handles arbitrary customer voice interactions until these three are mature in your contact centre. The general voice agent is the voice equivalent of the unscoped bot from chapter three — same failure pattern, worse customer experience because voice failures land harder than chat failures.",
      steps: [
        {
          html: stepCard('check', 'green', 'Play 1 — IVR replacement with natural-language routing',
            "Customer says what they need; the system routes to the right queue or self-service flow. Replaces 'press 1 for billing' menus. CSAT lifts because customers reach the right place faster. Single-turn deployment — much easier than multi-turn voice."),
          narration:
            "Play one. IVR replacement with natural-language routing. The customer says what they need in their own words — for example, I want to update my address — and the system routes them to the right queue or to the right self-service flow. Replaces the press one for billing, press two for technical support menus that nobody likes. CSAT lifts immediately because customers reach the right place faster. Critically, this is a single-turn deployment — the AI only has to handle one customer utterance per call. Single-turn voice is much easier than multi-turn voice. Start here. Most contact centres can ship this play within a quarter and see immediate CSAT improvement.",
        },
        {
          html: stepCard('check', 'green', 'Play 2 — Structured data capture',
            "Customer reads an order number or account number; voice AI captures it accurately. Replaces the manual 'can you read that back' loop that wastes agent time. Best deployment shape for voice AI in 2026 — high accuracy on structured data, no judgment required."),
          narration:
            "Play two. Structured data capture. Customer reads an order number, account number, postcode, or other structured identifier; voice AI captures it accurately and routes the conversation. Replaces the manual can you read that back loop where agents spend time confirming digits — wasted minutes per call across the contact centre. This is the best deployment shape for voice AI in 2026 — voice models have high accuracy on structured data because the vocabulary is constrained, no judgment is required from the AI, and the customer's experience is — the system understood me — which is the right CSAT signal. Deploy this play early in voice rollout.",
        },
        {
          html: stepCard('check', 'green', 'Play 3 — Wait-time voice assistant',
            "While customer is in queue, voice AI confirms what they\'re calling about, surfaces relevant self-serve articles, captures basic information so the agent has context. CSAT lift comes from making wait time feel productive — and from agents starting with the customer\'s situation already understood."),
          narration:
            "Play three. Wait-time voice assistant. While the customer is waiting in queue for a human agent, voice AI engages them — confirms what they're calling about, surfaces relevant self-serve articles by text message if the call can be deflected, captures basic information so the human agent has context when the call connects. CSAT lift comes from two sources. Making the wait time feel productive rather than wasted. And the human agent starting the conversation with the customer's situation already understood — same handoff principle as the bot-to-human handoff in chapter three. Don't make the customer repeat themselves. This play has high ROI and lower failure risk than direct voice agents because human agents complete the resolution; voice AI only assists.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The latency and accent gotchas',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · The gotchas',
      bodyHtml: `<p>Three production gotchas specific to voice. They are voice's reasons voice rollouts fail more often than chat rollouts. Architect for them in advance.</p>`,
      narrationLead:
        "Three production gotchas specific to voice. They are the reasons voice rollouts fail more often than chat rollouts at the same maturity level. Each one has a specific architectural mitigation. Apply the mitigations during build, not during the post-launch firefighting that follows discovering the gotchas in production.",
      steps: [
        {
          html: stepCard('alertTriangle', 'amber', 'Gotcha 1 — End-to-end latency over 1.5 seconds breaks conversation',
            "Speech recognition + LLM inference + voice synthesis + audio transport. Goal — under 1.5 seconds total. Over that, the conversation feels broken; customers talk over the AI; rapport collapses. Aggressive optimisation across the stack is non-negotiable."),
          narration:
            "Gotcha one. End-to-end latency over one and a half seconds breaks the conversation. End-to-end latency is the sum of speech recognition time, large language model inference time, voice synthesis time, and audio transport time. The goal is under one and a half seconds from when the customer stops speaking to when the AI starts speaking. Over that threshold, the conversation feels broken — customers talk over the AI, the AI talks over customers, conversational rapport collapses, and customers conclude the system is malfunctioning even when it's actually answering correctly. Aggressive optimisation across the entire stack is non-negotiable for voice deployments. Use streaming speech recognition, smaller fast-inference models for routing decisions, faster voice synthesis providers. Test latency under realistic network conditions, not just on a development LAN.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Gotcha 2 — Accent recognition failures (revisited)',
            "Touched in chapter four. In voice specifically, accent recognition failures are immediate and visible. Test recognition rate on your actual customer accents before launch — Indian English, Nigerian English, Singapore English. Below 95% — choose region-specific models or scope down."),
          narration:
            "Gotcha two. Accent recognition failures. We touched on this in chapter four on multilingual. In voice specifically, accent recognition failures are immediate and visible — the customer says something, the AI clearly didn't understand, the customer repeats themselves, and the conversation has already failed within ten seconds. Test recognition rate on your actual customer accent distribution before launch — Indian English, Nigerian English, Singapore English, Filipino English, and any regional accents specific to your markets. Below ninety-five percent recognition rate on a representative accent — choose region-specific voice models trained on that accent variant, or scope the voice deployment to intents where accent variation matters less, like structured data capture. Don't deploy general voice AI to a customer base with strong regional accents without verifying recognition rate.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Gotcha 3 — Interruption handling',
            "Customers interrupt AI mid-sentence — natural conversation behaviour. If the AI keeps talking over the customer, the conversation breaks. The AI must detect interruption and yield. Many production voice deployments don't do this correctly out of the box."),
          narration:
            "Gotcha three. Interruption handling. Customers naturally interrupt voice AI mid-sentence — it's normal conversational behaviour for humans. When the AI keeps talking over the customer because it doesn't detect the interruption, the conversation breaks fast. The AI must detect customer interruption in real time and immediately yield — stop speaking, listen, respond to what the customer just said. Many production voice deployments don't handle interruption correctly out of the box — the vendor demo always shows clean turn-taking, and production reality is messier. Test interruption handling explicitly during the pilot. The voice deployment that doesn't handle interruption gracefully feels artificial and customers reject it quickly. The voice deployment that handles interruption naturally feels like talking to a competent agent and customers accept it.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The pilot to run before broad launch',
        "Recruit 30 real customers across your accent spectrum. Have them complete realistic interactions. Score on latency-perceived, accent-recognised, interruption-handled, overall naturalness. Below 4/5 average — fix before launch."),
      calloutNarration:
        "The pilot to run before broad launch of any voice AI deployment. Recruit thirty real customers across your accent spectrum — your actual customer base, not employees of your company. Have them complete realistic interactions in the voice AI system. Score the interactions on four dimensions. Latency-perceived as conversational. Accent-recognised correctly. Interruption-handled gracefully. Overall naturalness rating. Below four out of five average on any dimension — fix the issue before launching to broader customer volume. Voice failures land harder than chat failures and are more visible socially — customers tell their networks about bad voice AI experiences in ways they don't tell about bad chat experiences. The pilot investment is small relative to the brand cost of a botched voice launch.",
    },
    // SLIDE 4
    {
      title: 'The disclosure customers expect',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · The disclosure',
      bodyHtml: `<p>Customers now expect explicit disclosure at the start of voice AI interactions. Three components in a good disclosure. The disclosure is now an emerging legal requirement in several jurisdictions — and a trust win even where it's not yet required.</p>`,
      narrationLead:
        "Customers now expect explicit disclosure at the start of voice AI interactions. The expectation has shifted rapidly in 2025 and 2026 — partly driven by EU AI Act requirements, partly by California and other state-level voice AI disclosure laws, partly by customer experience expectations regardless of regulation. Three components in a good disclosure. The disclosure is now an emerging legal requirement in several jurisdictions — and a trust win even in jurisdictions where it's not yet required by law.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Component 1 — Identify as AI in the first sentence',
            "Open with — 'Hello, you've reached AI assistant for ABC company.' Customers know they're talking to AI from the start. No discovery moment later. Trust signal that customers now actively look for; absence is a negative signal."),
          narration:
            "Component one. Identify as AI in the first sentence of the conversation. Open with a phrase like — hello, you've reached the AI assistant for ABC Company, how can I help you. Customers know they're talking to AI from the start of the call. No awkward discovery moment three turns in when the customer realises the agent isn't human and feels they were deceived. This is now a trust signal customers actively look for — its absence reads as deceptive even when the legal letter doesn't yet require disclosure. The teams that disclose proactively in 2026 win the CSAT comparison against teams that don't disclose, by meaningful margins.",
        },
        {
          html: stepCard('shield', 'green', 'Component 2 — Offer the human option explicitly',
            "Within the first 15 seconds, the AI offers — 'You can ask to speak to a human agent at any time.' Saying it builds trust; the customer feels they\'re in control. Most customers continue with AI; the option's existence is the trust signal."),
          narration:
            "Component two. Offer the human option explicitly within the first fifteen seconds of the call. The AI says — you can ask to speak to a human agent at any time during this call. Saying it explicitly builds trust because the customer feels they're in control of the channel choice. In practice, most customers continue with the AI rather than asking for a human — the option's existence is the trust signal, not the option's exercise. The teams that don't offer this explicitly find customers either disconnecting at higher rates or escalating in tone faster because they feel trapped with the AI. Offer the option. Train the AI to honour requests for human handoff immediately when asked.",
        },
        {
          html: stepCard('shield', 'green', 'Component 3 — Recording and AI-processing disclosure',
            "Standard call-recording disclosure plus explicit mention of AI processing — 'this call is recorded and processed by AI for service quality.' Now required in several jurisdictions. Reading it routinely makes it not awkward. Skipping creates legal exposure on top of brand exposure."),
          narration:
            "Component three. Recording and AI-processing disclosure. Standard call-recording disclosure combined with explicit mention of AI processing — for example, this call is recorded and processed by AI for service quality. This is now required in several jurisdictions — California, parts of the EU under the AI Act, and increasingly other US states. Reading it routinely as part of the call opening makes it not awkward and not draw special attention from customers. Skipping it creates legal exposure on top of brand exposure when a customer later questions whether they consented. Build it into the standard voice AI opening across all deployments. The cost of including it is essentially zero; the cost of omitting it is asymmetric.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 7 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter eight — the capstone.</p>`,
      narrationLead:
        "Three anchors before chapter eight — the capstone, your 4-week CS AI pilot plan.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three voice plays that ship',
            "IVR replacement with natural-language routing · structured data capture · wait-time voice assistant. Start with single-turn deployments. Don't ship a general voice agent before these three are mature."),
          narration:
            "One. Three voice plays that ship reliably. IVR replacement with natural-language routing — single-turn deployment, immediate CSAT lift, easiest starting point. Structured data capture — high voice AI accuracy on constrained vocabulary, replaces the read-back loop, high ROI. Wait-time voice assistant — engages queued customers, captures context for the human agent, low failure risk because human agent completes the resolution. Master these three before attempting a general voice agent. The general voice agent before these are mature is the same failure pattern as the unscoped chat bot.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three production gotchas',
            "End-to-end latency under 1.5 seconds · accent recognition tested before launch · interruption handling that yields gracefully. All three need explicit architectural mitigation, not discovery in production."),
          narration:
            "Two. Three production gotchas specific to voice. End-to-end latency under one and a half seconds — sum of speech recognition, model inference, voice synthesis, audio transport. Test under realistic network conditions, not just LAN. Accent recognition tested at ninety-five percent or higher on your actual customer base — Indian English, Nigerian English, Singapore English, regional variants you serve. Choose region-specific models or scope down if recognition rate is below threshold. Interruption handling that yields gracefully when customer talks mid-AI-sentence — test explicitly in pilot, many production deployments don't handle this out of the box.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three-component disclosure',
            "Identify as AI in the first sentence · offer the human option explicitly within 15 seconds · recording and AI-processing disclosure. Now emerging legal requirement in several jurisdictions; trust win everywhere."),
          narration:
            "Three. Three-component disclosure customers now expect at the start of voice AI interactions. Identify as AI in the first sentence — no awkward discovery moment three turns in. Offer the human option explicitly within fifteen seconds — most customers continue with AI but the offer is the trust signal. Recording and AI-processing disclosure as part of the standard call opening — now legal requirement in California, parts of the EU, and emerging in other US states. Read it routinely so it doesn't draw attention. Skipping creates legal exposure on top of brand exposure. Build the disclosure into every voice deployment.",
        },
      ],
      narrationTrail:
        "Chapter eight — the capstone. Your 4-week CS AI pilot plan, three KPIs that prove value, and four conversations for week one. See you there.",
    },
  ],
}
