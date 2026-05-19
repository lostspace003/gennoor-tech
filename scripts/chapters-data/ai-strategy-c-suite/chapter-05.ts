import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiStrategyChapter05: Chapter = {
  courseId: 'ai-strategy-c-suite',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-governance',
  title: 'Governance',
  subtitle: 'The conversation your regulator is going to have with you — and how to be ready.',
  slides: [
    // SLIDE 1
    {
      title: 'Governance',
      iconKey: 'shield',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Two years ago, AI governance was a slide. Today it's an audit item, a regulator brief, and — in some jurisdictions — a board-level statutory duty. In the next few minutes, the four pillars of an AI governance posture that survives external scrutiny.</p>`,
      narrationLead:
        "Welcome to chapter five. Governance. Two years ago, AI governance was a slide at the back of the strategy deck. Today, it's an audit item. It's a regulator brief. And in some jurisdictions, it's a board-level statutory duty. So in the next few minutes, the four pillars of an AI governance posture that survives external scrutiny — not just the kind that survives internal politics.",
    },
    // SLIDE 2
    {
      title: 'The four pillars',
      iconKey: 'shield',
      eyebrow: 'Lesson 1 · The framework',
      bodyHtml: `<p>Different jurisdictions use different language — NIST, EU AI Act, GCC frameworks, ISO 42001. But they all converge on the same four pillars. Stand these up, and you map cleanly to any of the major frameworks.</p>`,
      narrationLead:
        "Different jurisdictions use different language. NIST in the US. The EU AI Act. The emerging GCC frameworks. ISO forty-two-thousand-and-one. But they all converge on the same four pillars. Stand these four up in your organisation, and you'll map cleanly to any of the major frameworks. Here they are.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Pillar 1 — Inventory',
            "You cannot govern what you cannot see. A live inventory of every AI system in use, who owns it, what data it touches, what risk tier it sits in. The first thing a regulator asks for. The first thing most firms can't produce."),
          narration:
            "Pillar one. Inventory. You cannot govern what you cannot see. So you build a live inventory of every AI system in use across the organisation. Who owns it. What data it touches. What risk tier it sits in. This is the very first thing a regulator asks for in an examination. And it's the very first thing most firms cannot produce. Build it. Maintain it. Treat it as a board-level asset.",
        },
        {
          html: stepCard('target', 'blue', 'Pillar 2 — Risk classification',
            "Every AI system gets a tier — low, medium, high. The tier drives the controls. A drafting assistant is not a credit decisioning agent. The tiering rule is published. The exceptions are escalated. The tier is reviewed annually."),
          narration:
            "Pillar two. Risk classification. Every AI system in your inventory gets a tier. Low, medium, high. The tier drives the level of controls applied. A drafting assistant is not the same as a credit decisioning agent — and your governance should not treat them the same. The tiering rule is published internally. Exceptions get escalated. The tier is reviewed annually — because the regulations change, and so does the use of each system.",
        },
        {
          html: stepCard('check', 'amber', 'Pillar 3 — Controls (proportional to tier)',
            "Audit logs. Content safety filters. Human-in-the-loop on high-tier decisions. Data residency. Vendor due diligence. Model card. Bias testing. Choose controls that match the tier — over-controlling kills innovation; under-controlling kills the firm."),
          narration:
            "Pillar three. Controls — proportional to tier. Audit logs. Content safety filters. Human-in-the-loop on high-tier decisions. Data residency requirements. Vendor due diligence. A model card for each system. Bias testing. The discipline is to choose controls that match the tier. Over-controlling kills innovation. Under-controlling kills the firm. Both extremes are real failures. Calibrate carefully.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Pillar 4 — Incident response',
            "When an AI system misbehaves — and it will — what happens in the next 30 minutes? In the next 24 hours? The playbook exists. The people are trained. The disclosure path is clear. Run a tabletop exercise once a year."),
          narration:
            "Pillar four. Incident response. When an AI system misbehaves — and it will — what happens in the next thirty minutes? In the next twenty-four hours? The playbook exists in writing. The people are trained. The disclosure path to regulators, to customers, to the board — that path is clear. You run a tabletop exercise once a year. You find the gaps. You close them. This is the pillar that most firms only stand up after their first AI incident. Stand it up before.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'A board-ready statement',
        "If you cannot say to your board — <em>“We have an inventory, a tiering rule, controls calibrated to tier, and a tested incident response playbook”</em> — you do not yet have AI governance. You have AI risk."),
      calloutNarration:
        "Here's a board-ready statement to aim for. If you cannot say to your board — we have an inventory, a tiering rule, controls calibrated to tier, and a tested incident response playbook — you do not yet have AI governance. You have AI risk. The distinction matters. Boards understand it. Regulators expect it. Build toward it.",
    },
    // SLIDE 3
    {
      title: 'The three questions your board will ask',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Board readiness',
      bodyHtml: `<p>Audit committees are starting to put AI on the agenda. Three questions you will be asked. Answer them in advance.</p>`,
      narrationLead:
        "Audit committees and full boards are starting to put AI on the agenda — independent of any other technology topic. Three questions you will be asked. So you answer them in advance.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Q1 — “What AI systems are in use today, and who owns each?”',
            "Your answer: the live inventory, available on a single page, with risk tier and owner per row. If you can't produce it in the meeting, the meeting goes a different way."),
          narration:
            "Question one. What AI systems are in use today, and who owns each one? Your answer is the live inventory — available on a single page, with the risk tier and owner per row. If you cannot produce this document in the actual meeting, the meeting goes a very different direction. So have it ready.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Q2 — “What’s the worst that could happen, and what would we do?”',
            "Your answer: top three risk scenarios per high-tier system, the controls in place to prevent each, and the response playbook if any of the controls fail. Written. Tested. Updated quarterly."),
          narration:
            "Question two. What's the worst that could happen — and what would we do? Your answer is the top three risk scenarios per high-tier system. The controls in place to prevent each. And the response playbook if any of the controls fail. Written down. Tested in a tabletop. Updated quarterly. That's the level of preparedness expected — and the level you should want, regardless of what's expected.",
        },
        {
          html: stepCard('shield', 'green', 'Q3 — “How do we know our AI is fair, accurate, and not leaking data?”',
            "Your answer: bias testing on outcomes (not just on training data), accuracy monitoring with thresholds, and a data-handling certification per system. Quarterly board update — one slide per high-tier system."),
          narration:
            "Question three. How do we know our AI is fair, accurate, and not leaking data? Your answer is bias testing on outcomes — not just on training data, because that's where the actual fairness shows up. Accuracy monitoring with thresholds. And a data-handling certification per system. A quarterly board update — one slide per high-tier system — keeps everybody calibrated, including you.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Common governance failure modes',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Watch-outs',
      bodyHtml: `<p>Three failure modes I've seen repeatedly. Each one looks like governance from the outside — but isn't.</p>`,
      narrationLead:
        "Three failure modes I've seen repeatedly across enterprises trying to stand up AI governance. Each one looks like governance from the outside. None of them is. Watch for them.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Failure 1 — Governance owned by the build team',
            "When the team that builds AI also owns the controls on AI, governance collapses into convenience. Governance must have an independent reporting line."),
          narration:
            "Failure one. Governance owned by the build team. When the team that builds AI also owns the controls on AI, governance collapses into convenience. The team will not block its own work. Governance must have an independent reporting line — usually into risk, into legal, or directly to the audit committee. Not into the team running the programme.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 2 — Documentation without testing',
            "The policy document exists. The playbook exists. The inventory exists. But nobody has ever run a tabletop. Nobody has ever tested an incident scenario. Documentation alone is not governance — it's filing."),
          narration:
            "Failure two. Documentation without testing. The policy document exists. The playbook exists. The inventory exists. But nobody has actually run a tabletop. Nobody has tested an incident scenario. Documentation alone is not governance — it's filing. The first time you find out the playbook doesn't work cannot be during a real incident.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 3 — Over-governance that strangles innovation',
            "Six-month review cycles for low-tier AI. A committee of fifteen people approving prompt libraries. Innovation goes underground — shadow AI grows. The over-governed firm and the under-governed firm have the same problem: ungoverned AI."),
          narration:
            "Failure three. Over-governance that strangles innovation. Six-month review cycles for low-tier AI use cases. A committee of fifteen people approving prompt libraries. When governance is too heavy, innovation goes underground. Shadow AI grows. And here's the paradox — the over-governed firm and the under-governed firm end up with exactly the same problem. Ungoverned AI. So calibrate. Tiered controls. Proportional review. That's the answer.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Two anchors before chapter 6 — sustaining momentum past the pilot.</p>`,
      narrationLead:
        "Two anchors before we get to sustaining momentum in chapter six.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Inventory, tiering, controls, response',
            "Four pillars. Stand them up in this order — inventory first. You cannot govern what you cannot see."),
          narration:
            "One. Inventory. Tiering. Controls. Response. Four pillars. Stand them up in this order — inventory first. Because, again, you cannot govern what you cannot see.",
        },
        {
          html: stepCard('check', 'green', 'Two — Independence is non-negotiable',
            "Governance cannot live inside the build team. Independent reporting line. Tabletop exercises. Annual review at board level."),
          narration:
            "Two. Independence is non-negotiable. Governance cannot live inside the build team. Independent reporting line. Tested through tabletop exercises. Reviewed annually at board level. That's the structure.",
        },
      ],
      narrationTrail:
        "Next chapter — sustaining momentum. The part where most AI programmes quietly stall in year two. We avoid that. See you there.",
    },
  ],
}
