import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFinServChapter08: Chapter = {
  courseId: 'ai-in-financial-services',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your BFSI AI roadmap on one page',
  subtitle: 'Seven chapters down. Now we land it as a one-pager an executive committee can act on this quarter.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your BFSI AI roadmap on one page',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In the previous seven chapters, we built a complete BFSI view of AI. Now — one roadmap. One page. Something you can put in front of your executive committee, your board, and your regulator. Same page. One conversation.</p>`,
      narrationLead:
        "Welcome to the final chapter. The capstone. In the previous seven chapters, we built a complete BFSI view of AI. The four patterns. Fraud and AML. KYC and onboarding. Credit and underwriting. Operations. Customer copilots. Regulatory and sovereignty. Now we collapse it. One roadmap. One page. Something you can put in front of your executive committee, your board, and your central bank supervisor. Same page across all three audiences. Here's what's on it.",
    },
    // SLIDE 2
    {
      title: 'The BFSI AI roadmap — one page',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The template',
      bodyHtml: `<p>Six sections. Each one specific enough to defend in an executive committee — and concrete enough to bring to the regulator without rework.</p>`,
      narrationLead:
        "Six sections. Each one specific enough to defend in an executive committee meeting. Each one concrete enough to take to the regulator in its current form, without rework. Here are the six.",
      steps: [
        {
          html: stepCard('compass', 'green', '1 · The pattern sequence',
            "“Year 1: fraud/AML uplift + KYC stack. Year 2: underwriting modernisation. Year 3: customer-facing copilot pilot.” Three-year horizon. Specific. Defensible to the board."),
          narration:
            "Section one. The pattern sequence. Year one — fraud and AML uplift, plus the KYC and onboarding stack. Year two — underwriting modernisation. Year three — customer-facing copilot pilot. Three-year horizon. Specific. Defensible to the board as a multi-year programme — not as a series of quarterly experiments. The sequence signals seriousness, and gives the executive committee a story they can tell upward and outward.",
        },
        {
          html: stepCard('shield', 'blue', '2 · The sovereignty posture',
            "“All customer-data-touching AI on Azure [UAE/Saudi/India] sovereign cloud. PII tokenisation hybrid posture for institutional banking. Full on-premise option scoped for sovereign workloads.” Board-signed. Reviewed annually."),
          narration:
            "Section two. The sovereignty posture. All customer-data-touching AI on the sovereign cloud region your regulator has approved — Azure UAE, Azure Saudi, Azure India Central, or equivalent. A PII tokenisation hybrid posture for institutional banking workloads where frontier capability is genuinely needed. A full on-premise option scoped — meaning designed and prepared — for sovereign workload types like government banking. Board-signed. Reviewed annually. The artefact a regulator will eventually ask for.",
        },
        {
          html: stepCard('check', 'amber', '3 · The governance overlay per pattern',
            "MRM compliance for risk/AML and underwriting. Independent challenger models. Investigator-time audit trails. Bias monitoring. Explainability standards. Pattern-by-pattern — not a generic AI policy."),
          narration:
            "Section three. The governance overlay — pattern by pattern. Model Risk Management compliance for the risk, AML, and underwriting patterns. Independent challenger models in shadow for high-tier deployments. Investigator-time audit trails on AML alerts. Outcome bias monitoring by protected group on underwriting. Plain-language explainability standards on credit decisions. Pattern by pattern — not a generic AI policy that says we take governance seriously. Specific. Defensible.",
        },
        {
          html: stepCard('users', 'green', '4 · The team and partner mix',
            "Hub: senior MRM expert + lead AI engineer + governance lead. Spokes: one named owner per pattern. Partner: senior implementation partner for first 18 months. Backstop: existing risk and operations bandwidth recalibrated."),
          narration:
            "Section four. The team and partner mix. Hub — a senior Model Risk Management expert, a lead AI engineer, a governance lead. Spokes — one named owner per pattern, sitting in the relevant business function. Partner — a senior implementation partner for the first eighteen months while internal capability builds. Backstop — existing risk and operations bandwidth recalibrated where the AI changes the workload. The team behind the roadmap is visible on the page. The roadmap names the people who will execute it.",
        },
        {
          html: stepCard('target', 'red', '5 · The metrics commitment',
            "Per pattern: one defendable number. Fraud — false-positive reduction %. KYC — P95 time-to-decision. Underwriting — adverse-outcome bias variance. Operations — straight-through %. Reported quarterly to the audit committee."),
          narration:
            "Section five. The metrics commitment — one defendable number per pattern. Fraud — false-positive reduction percentage. KYC — P-ninety-five time to decision. Underwriting — adverse-outcome bias variance across groups. Operations — straight-through processing rate. Reported quarterly to the audit committee. Trended over four quarters, not just snapshot. These are the numbers the executive committee will be asked about by the board — and the board will be asked about by the regulator. Make them visible. Make them honest.",
        },
        {
          html: stepCard('shield', 'blue', '6 · The regulator engagement plan',
            "Pre-deployment briefings on major launches. Participation in central bank sandboxes. Annual written briefing to the supervisor. Tabletop incident response exercise once a year, with findings shared. The relationship as a deliverable."),
          narration:
            "Section six. The regulator engagement plan. Pre-deployment briefings on major launches. Active participation in the central bank's sandboxes and pilots. Annual written briefing to your supervisor before each examination cycle. Tabletop incident response exercise once a year, with findings written down and shared. The regulator relationship treated as a deliverable on the roadmap — not as a stressor between examinations. This section, more than any other, signals operational maturity. It's also the section most banks omit.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Ratify the roadmap formally',
        "The one-pager is the operating commitment. Once the executive committee approves, it goes into the bank's permanent records. Amendments require formal review. That gravity is what protects the roadmap from drift over three years."),
      calloutNarration:
        "Important. The one-pager is the operating commitment of the BFSI AI programme. Once the executive committee approves, it goes into the bank's permanent records — alongside the risk appetite statement, the strategic plan, the capital plan. Amendments to it require formal review at the executive committee. That gravity is what protects the roadmap from drift across the three-year horizon. Without that gravity, the roadmap slowly turns back into a deck. And then into nothing. Ratify it formally. The gravity protects you.",
    },
    // SLIDE 3
    {
      title: 'The three conversations to unlock',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Adoption',
      bodyHtml: `<p>The roadmap exists to unlock three specific conversations. Each one a calendar meeting. Each one moves a decision or a budget.</p>`,
      narrationLead:
        "The roadmap exists to unlock three specific conversations. Each one should be on your calendar within the next thirty days. Each one moves a decision or a budget — none of them is a status update.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — With the executive committee',
            "Here's the three-year sequence. Here's the year-1 investment band. Here's the metrics commitment. The committee signs off — and the head of AI carries the signed roadmap into the next phase."),
          narration:
            "Conversation one. With the executive committee. Here's the three-year pattern sequence. Here's the year-one investment band. Here's the metrics commitment per pattern. The committee signs off — and the head of AI carries the signed roadmap into the next phase. Decision ready. Not a follow-up paper. The CEO will respect that posture. Walk in to that meeting with the page in hand and the conversation prepared.",
        },
        {
          html: stepCard('users', 'amber', 'Conversation 2 — With the chief risk officer',
            "Walk through the governance overlay per pattern. MRM compliance, challenger models, audit trails, bias monitoring. The CRO either agrees this is sufficient — or names what to add. Either outcome moves the programme forward."),
          narration:
            "Conversation two. With the chief risk officer. Walk through the governance overlay pattern by pattern. Model Risk Management compliance for the regulated patterns. Independent challenger models. Investigator audit trails. Outcome bias monitoring. Explainability standards. The CRO either agrees this is sufficient — or names what to add. Either outcome moves the programme forward. Without this conversation, you deploy AI under governance the CRO hasn't endorsed. That's a difficult position when the next incident or examination arrives.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 3 — With your central bank supervisor',
            "A 30-minute informal briefing. The roadmap. The sovereignty posture. The bank's posture on bias and explainability. Almost no bank does this. The supervisor remembers it at examination time. Try it."),
          narration:
            "Conversation three. With your central bank supervisor. A thirty-minute informal briefing. The roadmap. The sovereignty posture. The bank's posture on bias and explainability. Almost no bank does this proactively. The supervisor remembers it. Particularly at examination time when other banks are scrambling and you are calm. Try it. The marginal cost is one meeting. The compounding benefit is significant.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'What comes next — beyond this course',
      iconKey: 'rocket',
      eyebrow: 'Lesson 3 · Onward',
      bodyHtml: `<p>This course gave you the BFSI executive view. Three suggestions for what to look at next — each one pairs with a specific decision in the next 90 days.</p>`,
      narrationLead:
        "This course gave you the BFSI executive view of AI. Three suggestions for what to look at next. Each one pairs with a specific decision in the next ninety days.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', '1 · AI Governance & Risk for Boards',
            "If you present to a board or audit committee, the boards course extends what we covered into the full board-level playbook. The one-page board pack template alone is worth the time."),
          narration:
            "One. If you regularly present to a board or audit committee — which most BFSI executives at the senior level do — the AI Governance and Risk for Boards course extends what we covered into the full board-level governance playbook. The one-page board pack template alone is worth the time. The bias monitoring and incident response chapters add depth you'll want on a calm day, not in the middle of a crisis.",
        },
        {
          html: stepCard('bookOpen', 'amber', '2 · AI Strategy for the C-Suite',
            "If you sit at the C-suite — CEO, CIO, CDO — or report directly to it, the strategy course extends what we covered into portfolio-level capital allocation and the C-suite operating frame."),
          narration:
            "Two. If you sit at the C-suite — CEO, CIO, CDO — or report directly to it, the AI Strategy for the C-Suite course extends the BFSI view into portfolio-level capital allocation and the C-suite operating frame. It covers the question of how AI investment sits within the broader strategic plan and the board governance posture. Useful when the BFSI AI roadmap needs to be defended at the executive committee level alongside other strategic investments.",
        },
        {
          html: stepCard('bookOpen', 'green', '3 · A 30-minute scoping call',
            "If you're ready to convert this roadmap into a phased programme — the most efficient next step is a 30-minute call. We listen, ask three honest questions, and tell you whether we're the right partner. Even if the answer is no."),
          narration:
            "Three. If you're ready to convert this roadmap into an actual phased programme — the most efficient next step is a thirty-minute call. We listen. We ask three honest questions about your regulator landscape, your existing risk infrastructure, and your year-one priorities. And we tell you whether we are the right partner for your specific situation. Even when the answer is no — and sometimes it is — the candour saves you weeks of evaluating partners who aren't a fit. That's the value of the conversation. Take it.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p class="lead">BFSI AI, done well, is invisible. The fraud caught before it propagates. The KYC that takes thirty minutes. The underwriting that explains itself in plain language. The bank that hands the regulator the answer to the next question before it’s been asked.</p>
      <p>The discipline is the work. The technology will keep moving. The disciplines stay.</p>
      <p>Thank you for spending the last hour with me.</p>`,
      narrationLead:
        "One final thought. BFSI AI, done well, is invisible. The fraud caught before it propagates. The KYC that takes thirty minutes instead of three days. The underwriting decision that explains itself in plain language. The bank that hands the regulator the answer to the next question before it has been asked. That is the product of good BFSI AI. And it is the product of banks that named the discipline early — sovereignty, governance, bias, the regulator relationship. The discipline is the work. The technology will keep moving — and faster, not slower, over the next three years. The disciplines stay. Thank you for spending the last hour with me. Now go put the roadmap on the next executive committee agenda. And brief your supervisor before the next deployment.",
    },
    // SLIDE 6
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'check',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>Three things to carry out of the whole course — into your next executive committee meeting.</p>`,
      narrationLead:
        "Three things to carry out of the whole course — into your next executive committee meeting.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four patterns, sequenced over three years',
            "Risk/AML + KYC year 1. Underwriting year 2. Customer-facing copilots year 3. Skip the fifth pattern (intranet chat) until later."),
          narration:
            "One. Four BFSI AI patterns, sequenced over three years. Risk and AML plus KYC in year one. Underwriting modernisation in year two. Customer-facing copilots in year three. Skip the fifth pattern — generative chat over the intranet — until the four real patterns are live. The sequence is the discipline.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three filters at the investment committee',
            "Explainability fit · audit-trail discipline · data sovereignty. Run on every proposal. No exceptions."),
          narration:
            "Two. Three filters at the investment committee on every AI proposal. Explainability fit. Audit-trail discipline. Data residency and sovereignty. Run them every time. No exceptions. The filters keep the BFSI AI portfolio shippable in a regulated environment.",
        },
        {
          html: stepCard('check', 'green', 'Three — Treat the regulator as a stakeholder',
            "Brief before each deployment · participate in sandboxes · annual written briefing. The relationship transforms when you treat the regulator as a partner rather than a stressor."),
          narration:
            "Three. Treat the regulator as a stakeholder — not as an examination event. Brief before each major deployment. Participate in central bank sandboxes. Send an annual written briefing to your supervisor. The relationship transforms when the regulator is treated as a partner — and the next examination on AI is meaningfully calmer than it would otherwise be.",
        },
      ],
      narrationTrail:
        "Thank you. Truly. Take the roadmap to your next executive committee this month. We'll see you at the next decision point.",
    },
  ],
}
