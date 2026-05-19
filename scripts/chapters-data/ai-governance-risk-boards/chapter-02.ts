import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiGovernanceBoardsChapter02: Chapter = {
  courseId: 'ai-governance-risk-boards',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-frameworks-landscape',
  title: 'The framework landscape',
  subtitle: 'NIST, ISO 42001, the EU AI Act, the GCC frameworks — what each one expects of a board.',
  slides: [
    // SLIDE 1
    {
      title: 'The framework landscape',
      iconKey: 'bookOpen',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">Four frameworks shape AI governance for most boards in 2026: NIST AI RMF, ISO/IEC 42001, the EU AI Act, and the emerging GCC frameworks. In the next few minutes, what each one actually expects — and the parts a board specifically should understand.</p>`,
      narrationLead:
        "Welcome to chapter two. The framework landscape. There are roughly four frameworks that shape AI governance for most boards in 2026. NIST AI Risk Management Framework. ISO forty-two-thousand-and-one. The EU AI Act. And the emerging GCC frameworks — the UAE, Saudi, Qatar all moving in different directions. We'll walk through what each one expects. And specifically, the parts a board director should understand — not the engineer-level detail, but enough to ask the right questions.",
    },
    // SLIDE 2
    {
      title: 'The four frameworks — at a glance',
      iconKey: 'bookOpen',
      eyebrow: 'Lesson 1 · The four',
      bodyHtml: `<p>None of these frameworks contradict each other. They emphasise different angles. A board that understands all four can hold management to the right standard regardless of jurisdiction.</p>`,
      narrationLead:
        "None of these four frameworks contradict each other. They emphasise different angles. A board that understands all four can hold management to the right standard regardless of jurisdiction — and that's the value of spending fifteen minutes here. Here they are.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'NIST AI RMF (US, voluntary)',
            "Risk-based. Four functions: Govern, Map, Measure, Manage. Voluntary, but in the US it's becoming the de-facto standard. The framework most likely referenced if a US regulator (SEC, OCC, FDA) examines AI use."),
          narration:
            "NIST AI RMF. United States. Voluntary. Risk-based. Four functions — govern, map, measure, manage. Voluntary technically — but in practice it is becoming the de-facto standard in the US. It's the framework most likely referenced if a US regulator examines your AI use. SEC for public companies. OCC for banks. FDA for healthcare. If you operate in the US, your management should be able to map your controls to the NIST functions.",
        },
        {
          html: stepCard('shield', 'blue', 'ISO/IEC 42001 (international, certifiable)',
            "A management-system standard — like ISO 27001 for security, but for AI. Certifiable. Becoming the procurement requirement for large customers. Expect to be asked for certification within 24 months."),
          narration:
            "ISO forty-two-thousand-and-one. International. Certifiable. It is a management-system standard — think of it as the ISO twenty-seven-thousand-and-one for AI. Like the security one. The important point for boards — it is becoming the procurement requirement for large enterprise customers and government tenders. Expect to be asked for ISO forty-two-thousand-and-one certification within twenty-four months. If you sell to large customers and you don't have a path to certification today, you have a procurement risk forming. Quietly.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'EU AI Act (EU, mandatory, phased in)',
            "Risk-tier law. Prohibited uses, high-risk uses, limited-risk uses, minimal-risk uses. Each tier has obligations. High-risk obligations include conformity assessment, human oversight, robustness. Fines up to 7% of global revenue. Phased in through 2026–2027."),
          narration:
            "The EU AI Act. European Union. Mandatory law. Phased in through twenty twenty-six and twenty twenty-seven. The law tiers AI use into four categories. Prohibited. High-risk. Limited-risk. Minimal-risk. Each tier has obligations — and the high-risk obligations include conformity assessment, human oversight, robustness testing, and continuous post-market monitoring. The fines are real. Up to seven percent of global revenue for the worst breaches. If you operate in the EU — or sell into the EU — this is the framework that has actual teeth. Don't treat it as voluntary. It isn't.",
        },
        {
          html: stepCard('shield', 'green', 'GCC frameworks (emerging, jurisdiction-by-jurisdiction)',
            "UAE national AI strategy + sector regulations (DIFC AI ethics, ADGM). Saudi SDAIA AI ethics + NCA guidance. Qatar QFC. Each is sector- and use-case-specific. Best practice: meet ISO 42001 + monitor the local regulator quarterly."),
          narration:
            "And the GCC frameworks. Emerging. Jurisdiction by jurisdiction. The UAE has a national AI strategy plus sector-specific guidance — DIFC AI ethics, ADGM, the federal data protection law. Saudi Arabia has SDAIA ethics plus NCA guidance on AI use in regulated sectors. Qatar has the QFC framework. Each is moving — sometimes faster than expected. Best practice for boards operating in the GCC is to meet ISO forty-two-thousand-and-one at the operational level, and monitor the local regulator quarterly for sector-specific updates. The local regulators are watching what the EU does, and adapting selectively.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'The pragmatic posture',
        "Stand up to ISO 42001 internally. Map your controls to NIST for US examinations. Treat the EU AI Act as binding if you operate in or sell into the EU. Monitor local GCC regulators quarterly. That posture covers most boards."),
      calloutNarration:
        "Here's the pragmatic posture for most boards. Stand up to ISO forty-two-thousand-and-one internally — even if you don't certify immediately, the management-system shape is right. Map your controls to NIST for US examinations. Treat the EU AI Act as binding if you operate in or sell into the EU — because functionally, it is. And monitor the GCC regulators quarterly through your legal team. That single posture covers most boards. Don't try to perfectly comply with all four — they overlap enough that meeting ISO forty-two-thousand-and-one well gets you eighty percent of the way to each.",
    },
    // SLIDE 3
    {
      title: 'Mapping a board agenda to ISO 42001',
      iconKey: 'compass',
      eyebrow: 'Lesson 2 · Practical mapping',
      bodyHtml: `<p>ISO 42001 is the framework most board agendas will end up mapping to. Five clauses translate directly into board-level oversight items.</p>`,
      narrationLead:
        "ISO forty-two-thousand-and-one is the framework most board agendas will end up mapping to. Let me show you the five clauses that translate directly into board-level oversight items. These are the ones to put on your audit committee calendar.",
      steps: [
        {
          html: stepCard('compass', 'blue', 'Clause 4 — Context of the organisation',
            "Where AI sits in the organisation's strategy and risk appetite. The board signs off on this. Not the head of AI."),
          narration:
            "Clause four. Context of the organisation. Where AI sits in the organisation's strategy and the risk appetite the board has set. This is signed off by the board — not delegated to the head of AI. The risk appetite for AI is a board-level judgement. Make sure your minutes show the conversation happening.",
        },
        {
          html: stepCard('compass', 'blue', 'Clause 5 — Leadership and commitment',
            "Named accountability. Documented policy. Resource allocation. Board-level visibility. The bones of the management system."),
          narration:
            "Clause five. Leadership and commitment. Named accountability — somebody specific is accountable for AI governance, with their name on it. Documented AI policy. Resource allocation that matches the policy. Board-level visibility into the system. These are the bones of the management system. The board's role is to ensure they exist — not to write them.",
        },
        {
          html: stepCard('compass', 'amber', 'Clause 6 — Planning (risk identification)',
            "The risk register specifically for AI. Updated. Reviewed. Owned. The board sees a slice of this each quarter."),
          narration:
            "Clause six. Planning. The risk register, specifically for AI. Updated. Reviewed. Owned by named people. The board sees a slice of this register each quarter — not the whole thing, but the high-tier items and any new entries. This is where the inventory question from chapter one lives in the framework.",
        },
        {
          html: stepCard('compass', 'amber', 'Clause 8 — Operations (the controls themselves)',
            "Implemented controls. Tested. Logged. This is the part most boards never see in detail — but should sample once a year, with the head of internal audit walking through one specific system end-to-end."),
          narration:
            "Clause eight. Operations. The controls themselves. Implemented. Tested. Logged. This is the part most boards never see in operational detail — and that's appropriate. But the audit committee should sample once a year. Head of internal audit walks the committee through one specific system end to end. What it does, how it's controlled, what the audit trail looks like. The committee learns something. And so does internal audit.",
        },
        {
          html: stepCard('compass', 'green', 'Clause 9 — Performance evaluation',
            "Measurement against the risk appetite. KPIs. Incidents. This is the quarterly reporting the board actually receives. The format is in chapter 4."),
          narration:
            "Clause nine. Performance evaluation. Measurement against the risk appetite that was set in clause four. KPIs. Incidents. Continuous improvement actions. This is the quarterly reporting the board actually receives. We'll cover the exact reporting format in chapter four — for now, recognise that clause nine is where your board reporting fits into the ISO framework.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Where boards typically lag the framework',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Watch-outs',
      bodyHtml: `<p>Three patterns I see when boards say they're “aligned” with a framework — and they're not.</p>`,
      narrationLead:
        "Three patterns I see when boards tell me they're aligned with a framework. And they're not — they just haven't realised it yet. Watch for these.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Lag 1 — Policy without practice',
            "The AI policy was approved by the board two years ago. Nobody has reviewed it since. Practice has drifted. Policy needs an annual review — minimum."),
          narration:
            "Lag one. Policy without practice. The AI policy was approved by the board, two years ago, when AI was barely a topic. Nobody has reviewed it since. Meanwhile, practice has drifted significantly. The policy needs an annual review — minimum. And in a fast-moving area like AI, twice a year is closer to right. Put it on the calendar.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Lag 2 — Inventory without classification',
            "The inventory exists. The risk classification doesn't. So management cannot prioritise, and the board sees a list of fifty AI systems treated identically. Push for tiering — even rough tiering is better than none."),
          narration:
            "Lag two. Inventory without classification. The inventory exists. But the risk classification doesn't. So management cannot prioritise. And the board sees a list of fifty AI systems, all treated identically. Push for tiering — even rough tiering, three tiers, is better than no tiering. Refinement comes later. Get the first cut on the page.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Lag 3 — No measurement of the framework itself',
            "Management says, we're aligned with ISO 42001. But there's no internal audit programme actually testing whether the controls work. Independence absent. Ask for it."),
          narration:
            "Lag three. No measurement of the framework itself. Management says, we are aligned with ISO forty-two-thousand-and-one. But there is no internal audit programme actually testing whether the controls work. Independence is absent. Ask for it. Internal audit should be testing AI controls the same way it tests any other operational control. If they aren't yet, that's a conversation to have with the head of internal audit — and with the audit committee chair.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 3 — risk taxonomy.</p>`,
      narrationLead:
        "Three anchors before we move into risk taxonomy in chapter three.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — ISO 42001 is the practical anchor',
            "Stand up to ISO 42001 internally. Map to NIST for US. Treat the EU AI Act as binding if you sell into the EU. Monitor GCC quarterly."),
          narration:
            "One. ISO forty-two-thousand-and-one is the practical anchor. Stand up internally to that framework. Map your controls to NIST when US examiners are looking. Treat the EU AI Act as binding if you sell into the EU. Monitor GCC regulators quarterly. That covers most boards.",
        },
        {
          html: stepCard('check', 'green', 'Two — Five ISO clauses for the board agenda',
            "Clauses 4, 5, 6, 8 sample, and 9. That's the calendar. Put it on the audit committee calendar today."),
          narration:
            "Two. Five ISO clauses for the board agenda. Clause four — context and risk appetite. Clause five — leadership. Clause six — risk register. A sample of clause eight — actual operations. And clause nine — performance evaluation. Put those five on the audit committee calendar today.",
        },
        {
          html: stepCard('check', 'green', 'Three — Internal audit must test the controls',
            "If internal audit isn't testing AI controls today, that's the next conversation with the audit committee chair. Frameworks without internal audit are documentation, not governance."),
          narration:
            "Three. Internal audit must test the controls — not just review the policies. If internal audit is not testing AI controls today, that is the next conversation to have with the audit committee chair. Frameworks without internal audit are documentation, not governance.",
        },
      ],
      narrationTrail:
        "Chapter three — the AI risk taxonomy. The categories of risk a board needs to think in terms of. See you there.",
    },
  ],
}
