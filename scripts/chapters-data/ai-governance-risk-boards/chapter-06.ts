import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiGovernanceBoardsChapter06: Chapter = {
  courseId: 'ai-governance-risk-boards',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-incident-response',
  title: 'Incident response',
  subtitle: 'When AI misbehaves — and what the next 24 hours look like.',
  slides: [
    // SLIDE 1
    {
      title: 'Incident response',
      iconKey: 'alertTriangle',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">AI systems will misbehave. The question is not whether — it's whether your organisation can detect, contain, and disclose well when it happens. In the next few minutes, the anatomy of an AI incident, the four-phase response, and the board's specific role.</p>`,
      narrationLead:
        "Welcome to chapter six. Incident response. AI systems will misbehave. The question is not whether — it's whether your organisation can detect, contain, and disclose well when it happens. In the next few minutes, the anatomy of an AI incident. The four-phase response. And critically — the board's specific role, which is different from the role you might play in a cyber incident.",
    },
    // SLIDE 2
    {
      title: 'What an AI incident actually looks like',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 1 · The shape',
      bodyHtml: `<p>Five common shapes. Some are loud — others are quiet, slow, and discovered late. The quiet ones cause more damage.</p>`,
      narrationLead:
        "Five common shapes for an AI incident. Some are loud — discovered the day they happen. Others are quiet, slow, discovered weeks or months later. And the quiet ones tend to cause more damage by the time they surface. Recognise the shapes.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Shape 1 — Hallucination at scale',
            "Loud. The model invents facts confidently, the team distributes them widely before catching it. Common in legal, financial, and clinical use cases."),
          narration:
            "Shape one. Hallucination at scale. This is loud. The model invents facts confidently. Someone on the team distributes the output widely — to customers, to regulators, to the press — before catching it. Common in legal use cases. Financial use cases. Clinical use cases. The kind of incident that produces an apology email by Friday afternoon. Often discovered same-day, which is the good news.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Shape 2 — Bias surfaced publicly',
            "Quiet until loud. Bias is producing systematically different outcomes for months. A journalist or researcher documents it. Now it's a reputational crisis."),
          narration:
            "Shape two. Bias surfaced publicly. Quiet until it's very loud. Bias has been producing systematically different outcomes for months — sometimes years. A journalist documents it. A researcher publishes the finding. Now it's a reputational crisis with significantly less time to respond. And the bias was technically present the entire time — you just hadn't been measuring outcomes by group. This is the shape that the bias monitoring discussion from chapter three prevents.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Shape 3 — Data leakage',
            "Quiet. Prompt content shows up in vendor logs, in another customer's outputs, or in training data — months later. Often surfaced by a third party, not internally."),
          narration:
            "Shape three. Data leakage. Quiet. Prompt content from your organisation shows up in vendor logs. Sometimes in another customer's outputs. Sometimes, in worst-case scenarios, in training data months later. Often surfaced by a third party — a security researcher, another customer, sometimes a regulator — rather than by your own monitoring. The remediation work is significant. The reputational impact depends on the disclosure quality.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Shape 4 — Wrong decision at scale',
            "A high-tier agent (loan, claim, hiring) makes a systematically wrong decision for a quarter before someone catches the pattern. Affected customers need restitution."),
          narration:
            "Shape four. Wrong decision at scale. A high-tier agent — handling loans, insurance claims, hiring, citizen services — makes a systematically wrong decision for a quarter or more before somebody catches the pattern. Affected customers need restitution. The regulator usually finds out. The financial exposure can be material. This is the shape that human oversight intervention monitoring catches early — when it's done well.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Shape 5 — Prompt injection / adversarial misuse',
            "External actor crafts inputs that make an AI system do something it wasn't designed to do — exfiltrate data, generate harmful content, bypass controls. Discovered quickly when external; quietly when internal."),
          narration:
            "Shape five. Prompt injection or adversarial misuse. An external actor — or an internal actor — crafts inputs that make an AI system do something it wasn't designed to do. Exfiltrate data. Generate harmful content. Bypass safety controls. When this happens externally, it's usually discovered quickly. When it happens internally, by an employee testing limits, it tends to surface quietly through audit logs — if you're looking. If you're not looking, it doesn't surface until much later.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The four-phase incident response',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · The playbook',
      bodyHtml: `<p>Four phases. Each with a clear owner. Each with a clear time horizon. Boards do not run incident response — but boards verify the structure exists.</p>`,
      narrationLead:
        "Four phases. Each with a clear owner. Each with a clear time horizon. Boards do not run incident response — but boards verify that the structure exists, and review the after-action report. Here are the four.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Phase 1 · Detect (hours)',
            "Monitoring + alerts catch the incident. Or a customer report, an internal flag, a regulator letter triggers the response. The clock starts at detection — not at occurrence."),
          narration:
            "Phase one. Detect. Hours. Monitoring and alerts catch the incident — that's the best case. Or a customer report comes in. An internal team member flags something. A regulator letter arrives. The clock starts at detection — not at the moment the incident actually began. So your detection time directly affects every downstream window, including any statutory disclosure timer. Invest in detection. It's the cheapest hour of the response.",
        },
        {
          html: stepCard('shield', 'blue', 'Phase 2 · Contain (24–72 hours)',
            "Take affected systems offline or behind human review. Preserve evidence. Notify the named incident response team. The 72-hour clock for many regulator disclosures starts here — sometimes at detection."),
          narration:
            "Phase two. Contain. Twenty-four to seventy-two hours. Take affected systems offline — or behind mandatory human review. Preserve evidence — logs, prompts, model outputs, audit trails. Notify the named incident response team. Note — the seventy-two-hour clock for many regulator disclosures starts either at detection or at containment, depending on jurisdiction. Your General Counsel needs to know which clock is running and when.",
        },
        {
          html: stepCard('shield', 'amber', 'Phase 3 · Disclose (72 hours to 30 days)',
            "Disclosure to regulators, affected customers, and — if material — the market. Done by people trained for it: GC, comms, CEO. Not by the engineering team."),
          narration:
            "Phase three. Disclose. Seventy-two hours to thirty days, depending on jurisdiction and incident type. Disclosure to regulators. To affected customers. And — if material to a public company — to the market. Done by people trained for crisis disclosure. General Counsel. Communications head. CEO. Not by the engineering team, however knowledgeable they may be about the technical details. Crisis disclosure is its own skill. Use the right people.",
        },
        {
          html: stepCard('shield', 'green', 'Phase 4 · Remediate and review (30 days–6 months)',
            "Root cause analysis. Controls fixed. Lessons captured. Independent post-incident review delivered to the audit committee. This is the phase boards actually see — and where governance learns."),
          narration:
            "Phase four. Remediate and review. Thirty days to six months. Root cause analysis. Controls fixed. Lessons captured systematically. And critically — an independent post-incident review delivered to the audit committee. This is the phase that boards actually see in detail. And this is where the governance function learns. The temptation to skip this phase, once the crisis has passed, is enormous. Resist it. The boards that get better are the boards that insist on a written, independent post-incident review every single time.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The independence of the post-incident review',
        "The team that built the system should not author the post-incident review on the system. Use internal audit — or a senior person from a different function. Independence is what makes the review useful."),
      calloutNarration:
        "Underline this. The team that built the system should not author the post-incident review on that system. Use internal audit. Or a senior person from a different function — risk, legal, or even a different business unit. Independence is what makes the review useful to a board. Anything less ends up reading like a defence of the original work. Insist on independence, particularly for high-tier incidents.",
    },
    // SLIDE 4
    {
      title: 'The board\'s specific role — five things only the board does',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · Board role',
      bodyHtml: `<p>The board does not run the incident response. But there are five specific actions only the board can take — and missing any of them leaves the organisation exposed.</p>`,
      narrationLead:
        "The board does not run the incident response. Management does. But there are five specific actions that only the board can take. Missing any of them leaves the organisation exposed — and individual directors exposed personally. Here they are.",
      steps: [
        {
          html: stepCard('users', 'blue', '1 · Ensure the playbook is tested before the incident',
            "Annual tabletop. Findings written down. Remediation tracked. If the audit committee hasn't seen this, the board's first incident will be unrehearsed."),
          narration:
            "One. Ensure the playbook is actually tested before the first real incident. Annual tabletop. Findings written down. Remediation tracked. If the audit committee has not seen tabletop findings in the last year, the board's first real incident will be unrehearsed. That's preventable — and the board is the body that prevents it, by putting the tabletop on the calendar.",
        },
        {
          html: stepCard('users', 'amber', '2 · Decide whether to disclose voluntarily — when not legally required',
            "Some incidents fall below the legal disclosure threshold but above the ethical one. Voluntary disclosure is a board-level decision. It cannot be delegated."),
          narration:
            "Two. Decide whether to disclose voluntarily — when not strictly legally required. Some incidents fall below the legal disclosure threshold but above the ethical one. Voluntary disclosure is a board-level decision, not an executive one. Management may have a view. They may have a strong view. But the call is yours. This is where directors sometimes feel the weight of the role most clearly.",
        },
        {
          html: stepCard('users', 'red', '3 · Review the post-incident report and approve remediation',
            "The independent post-incident report goes to the audit committee. The committee reviews it, approves remediation actions, and tracks them to completion."),
          narration:
            "Three. Review the post-incident report and formally approve remediation. The independent post-incident report goes to the audit committee. The committee reviews it, approves remediation actions, and tracks them through to completion. This isn't a rubber-stamp role. Read the report. Ask the hard questions. Approve the remediation. Track the closure dates.",
        },
        {
          html: stepCard('users', 'amber', '4 · Determine accountability — calibrated to severity',
            "For material incidents, determine whether individual accountability is required — and what form it takes. This is uncomfortable. It is also the board's job."),
          narration:
            "Four. Determine accountability — calibrated to the severity of the incident. For material incidents, determine whether individual accountability is required — and what form it takes. This is uncomfortable. Sometimes accountability means changes in role. Sometimes a written censure. Sometimes more. This is the part of the board's role that no one teaches in director training — and it is the board's job nonetheless. Don't outsource it to management. They cannot do it well, because they're the ones being held to account.",
        },
        {
          html: stepCard('users', 'green', '5 · Update the framework after the incident',
            "Update the AI risk appetite, the policy, the tiering rule — informed by what the incident revealed. The institution learns. The next incident is different — because the framework has changed."),
          narration:
            "Five. Update the framework after the incident. Update the AI risk appetite. The AI policy. The tiering rule. Informed by what the incident actually revealed. The institution learns. And critically, the next incident is different — because the framework that allowed the first one has been changed. This is the action that separates governance from theatre. A board that doesn't update its framework after a material incident is governing on autopilot.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 7 — the board\'s own AI competence.</p>`,
      narrationLead:
        "Three anchors before chapter seven — which is about the board itself, and the question of board competence on AI.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Detect · contain · disclose · remediate',
            "Four phases. Time-boxed. Owned. Tested annually through a tabletop. If the tabletop hasn't happened, that's the first board action."),
          narration:
            "One. The four phases. Detect. Contain. Disclose. Remediate. Time-boxed. Owned. Tested annually through a tabletop exercise. If the tabletop has not happened in the last twelve months, the first board action is to put it on the calendar.",
        },
        {
          html: stepCard('check', 'green', 'Two — Independent post-incident review',
            "Never authored by the team that built the system. Internal audit. Or a senior person from a different function. Always."),
          narration:
            "Two. Independent post-incident review. Never authored by the team that built the system. Internal audit. Or a senior person from a different function. Always. The independence is what makes the review useful — and it's what the board signs off as evidence of due diligence.",
        },
        {
          html: stepCard('check', 'green', 'Three — Five board-only actions',
            "Insist on tabletop · decide voluntary disclosure · review report · determine accountability · update the framework. None can be delegated."),
          narration:
            "Three. Five board-only actions. Insist on the tabletop. Decide voluntary disclosure. Review the post-incident report. Determine individual accountability where warranted. Update the framework after the incident. None of these can be delegated to management. They are the board's specific role in AI incident response.",
        },
      ],
      narrationTrail:
        "Chapter seven — the board's own AI competence. A topic boards usually avoid. We won't. See you there.",
    },
  ],
}
