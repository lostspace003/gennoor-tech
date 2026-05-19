import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiGovernanceBoardsChapter01: Chapter = {
  courseId: 'ai-governance-risk-boards',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-what-boards-should-ask',
  title: 'What boards should ask about AI',
  subtitle: 'Five questions that separate a governing board from a spectating one.',
  slides: [
    // SLIDE 1
    {
      title: 'What boards should ask about AI',
      iconKey: 'shield',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">Most boards are still figuring out how to govern AI. There is no inherited playbook. In the next few minutes, the five questions that should appear on every audit committee agenda — and the answers a board is entitled to expect.</p>`,
      narrationLead:
        "Welcome to the course. This is for board directors, audit committee chairs, and senior independent directors. We're going to spend roughly forty-five minutes building you a working playbook on AI governance. Not theory. Not regulator-speak. The actual questions you need to ask, the artefacts you should expect to see, and the moves that protect both your organisation and your personal director duty. Let's start with the five questions.",
    },
    // SLIDE 2
    {
      title: 'The five questions every board should ask',
      iconKey: 'search',
      eyebrow: 'Lesson 1 · The questions',
      bodyHtml: `<p>These five questions are the minimum. They appear in some form in every emerging AI governance framework — NIST, ISO 42001, the EU AI Act, the GCC equivalents. If your management cannot answer them clearly, you have a governance gap.</p>`,
      narrationLead:
        "Five questions. The minimum. They appear in some form in every emerging AI governance framework. NIST in the US. ISO forty-two-thousand-and-one. The EU AI Act. The GCC equivalents that are now being drafted. If your management team cannot answer these five questions clearly — within the meeting, without a follow-up paper — you have a governance gap. Let's walk through them.",
      steps: [
        {
          html: stepCard('search', 'blue', '1 · What AI systems are in use, and who owns each?',
            "The inventory question. The first thing any examiner will ask. If management cannot produce a one-page inventory with risk tier and accountable owner, the rest of the conversation is theoretical."),
          narration:
            "Question one. What AI systems are in use across the organisation today — and who owns each one? This is the inventory question. It is the very first thing any examiner — internal auditor, external auditor, regulator — will ask. If management cannot produce a one-page inventory, with the risk tier and the accountable owner per row, the rest of the conversation is theoretical. You have an AI capability you cannot see. And by extension, cannot govern.",
        },
        {
          html: stepCard('target', 'blue', '2 · How are they classified by risk?',
            "Not every AI system is the same. A drafting assistant is not a credit decisioning agent. You expect a tiering rule — published internally, applied consistently, reviewed annually."),
          narration:
            "Question two. How are these AI systems classified by risk? You're looking for a tiering rule. Published internally. Applied consistently. Reviewed annually. Not every AI system is the same. A drafting assistant for marketing copy is not the same governance question as a credit decisioning agent. You should expect the executive answering this question to have a written tiering rule — and to be able to defend why each system sits in its tier.",
        },
        {
          html: stepCard('check', 'amber', '3 · What controls are in place — and are they proportional?',
            "Audit logs, content safety, human-in-the-loop on high-tier decisions, bias testing. The expectation is that controls scale with risk tier — over-controlling kills innovation, under-controlling kills the firm."),
          narration:
            "Question three. What controls are in place — and are they proportional? Audit logs. Content safety filters. Human in the loop on high-tier decisions. Bias testing on outcomes. Data residency. Vendor due diligence. You're listening for the word proportional. Controls should scale with the risk tier. Over-controlling kills innovation in low-risk areas. Under-controlling kills the firm in high-risk areas. Both extremes are real governance failures.",
        },
        {
          html: stepCard('alertTriangle', 'red', '4 · What\'s our worst-case scenario, and what would we do?',
            "The incident response question. You want to see a written playbook — tested through a tabletop in the last twelve months, with documented findings. A board that has not seen this is not yet governing."),
          narration:
            "Question four. What is our worst-case scenario — and what would we actually do if it happened? This is the incident response question. You're looking for a written playbook. Tested through a tabletop exercise in the last twelve months. With documented findings from that tabletop, and evidence of remediation. A board that has not seen the tabletop findings is not yet governing AI. It's hoping nothing goes wrong. Hope is not a governance posture.",
        },
        {
          html: stepCard('shield', 'green', '5 · Who is independently overseeing this?',
            "Governance owned by the build team is not governance. You expect an independent reporting line — into risk, legal, or the audit committee directly. The independence is non-negotiable."),
          narration:
            "Question five. Who is independently overseeing this work? Governance owned by the team that builds AI is not governance — it's convenience. You expect to see an independent reporting line. Into risk. Into legal. Or directly into the audit committee itself. The independence is non-negotiable. Where independence has been compromised — and it sometimes is, quietly — you will see it in the governance reporting eventually. Usually after an incident.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'How to use the five questions',
        "Put these five on the standing audit committee agenda. Once a quarter, the executive answering the questions changes — head of AI one quarter, the GC the next, the COO after that. Cross-validation by rotation. It works."),
      calloutNarration:
        "Here's how the best boards actually use these five questions. They go on the standing audit committee agenda. And once a quarter, the executive answering the questions changes. Head of AI one quarter. The General Counsel the next. The COO the quarter after. You get cross-validation by rotation. If three executives give three different answers to the same question, you have surfaced a governance problem you would not otherwise have seen. The technique works. Use it.",
    },
    // SLIDE 3
    {
      title: 'Three failure modes — recognise them early',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · Pitfalls',
      bodyHtml: `<p>Boards typically realise they have a governance problem after the fact. Three patterns to recognise <em>before</em> the incident.</p>`,
      narrationLead:
        "Three failure modes. Most boards realise they have an AI governance problem after the fact — usually after an incident, a regulatory letter, or an audit finding. Here are three patterns to recognise before the incident. So you can intervene early.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Failure 1 — Management cannot produce the inventory',
            "If the answer to question one takes more than five minutes to assemble, the underlying discipline isn't there. Don't accept a follow-up paper. Push for it now."),
          narration:
            "Failure one. Management cannot produce the inventory. If the answer to question one takes more than five minutes to assemble, the underlying discipline simply isn't there. Don't accept a follow-up paper at the next meeting. Push for the inventory to be produced within thirty days. And then verify that it covers shadow AI — the Copilot tenants nobody documented, the ChatGPT licenses bought on corporate cards, the Power Apps somebody built on the side. That's where the real risk lives.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 2 — “We follow framework X”',
            "A framework is not a control. NIST is not a control. ISO 42001 is not a control. The framework is the map; the controls are the territory. Ask what's actually implemented — not what's referenced."),
          narration:
            "Failure two. Management says, we follow NIST — or we follow ISO forty-two-thousand-and-one. A framework is not a control. NIST is not a control. ISO is not a control. The framework is the map. The controls are the territory. Ask what is actually implemented — not what is referenced. A surprising number of governance presentations confuse the two. Until an examiner asks, can we see the audit log for system X — and the answer is, we'll get back to you.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 3 — Governance reports authored by the build team',
            "When the team building AI also writes the governance report on AI, the report tells you the story management wants you to hear. Insist that governance reporting comes through an independent line — risk, legal, internal audit."),
          narration:
            "Failure three. The governance report is authored by the team building AI. When the team building AI also writes the report on AI to the board, the report tells you the story management wants you to hear. Not necessarily the story you need to hear. Insist that the governance report flows through an independent line. Risk. Legal. Internal audit. The build team may contribute the data — but the framing and the assessment come from somebody whose career does not depend on the AI programme succeeding.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Two anchors before chapter 2 — the framework landscape.</p>`,
      narrationLead:
        "Two anchors before we move into the framework landscape in chapter two.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — The five questions, every meeting',
            "Inventory · tiering · controls · incident scenario · independent oversight. On the standing agenda. Rotating presenter."),
          narration:
            "One. The five questions, every meeting. Inventory. Tiering. Controls. Incident scenario. Independent oversight. On the standing agenda. Rotating which executive presents. Cross-validation by rotation. That alone catches most governance problems early.",
        },
        {
          html: stepCard('check', 'green', 'Two — Framework is not the control',
            "“We follow NIST” is not an answer. “Here is the audit log for system X” is an answer. Push for the artefact, not the reference."),
          narration:
            "Two. The framework is not the control. We follow NIST is not an answer to a governance question. Here is the audit log for system X is an answer. Push for the artefact. Not the reference.",
        },
      ],
      narrationTrail:
        "Next chapter — the framework landscape itself. So when management says we follow NIST, you know what they should be doing to back it up. See you there.",
    },
  ],
}
