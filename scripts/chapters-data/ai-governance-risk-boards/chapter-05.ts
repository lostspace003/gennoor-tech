import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiGovernanceBoardsChapter05: Chapter = {
  courseId: 'ai-governance-risk-boards',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-vendor-risk',
  title: 'Vendor and third-party AI risk',
  subtitle: 'Most of your AI runs on someone else’s model. That changes what governance looks like.',
  slides: [
    // SLIDE 1
    {
      title: 'Vendor and third-party AI risk',
      iconKey: 'alertTriangle',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Most of your AI in 2026 runs on someone else’s foundation model. That single fact changes what governance looks like — and most boards are under-engaging on the implications. In the next few minutes, the five vendor risks specifically a board should track.</p>`,
      narrationLead:
        "Welcome to chapter five. Vendor and third-party AI risk. Most of your AI today runs on somebody else's foundation model. OpenAI. Anthropic. Microsoft. Google. Or an open-source model deployed on a cloud you don't run. That single fact changes what governance looks like — and most boards are under-engaging on the implications. So in the next few minutes, the five vendor risks specifically a board should be tracking.",
    },
    // SLIDE 2
    {
      title: 'Five vendor risks — and what they look like',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 1 · The risks',
      bodyHtml: `<p>Five risks that did not exist for boards five years ago. They exist now. Each one needs a specific contract clause or a specific operational control.</p>`,
      narrationLead:
        "Five risks that didn't really exist for boards five years ago. They exist now. Each one needs a specific contract clause or a specific operational control. Recognise them.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Risk 1 — Terms-of-service change',
            "Major vendors update terms multiple times a year. Data handling, model deprecation, geographic availability. The change can be material — and silent."),
          narration:
            "Risk one. Terms-of-service change. Major model vendors update their terms multiple times a year. Sometimes more often. Data handling provisions change. Models get deprecated with relatively short notice. Geographic availability shifts. The change can be material — and from your perspective, silent. You find out when somebody on your team notices the new fine print. Or when a customer complaint surfaces the difference. By that point, your governance posture has already drifted.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Risk 2 — Model deprecation',
            "The model version you certified, audited, and embedded into a production workflow is retired by the vendor with 6 months' notice. Your replacement work — re-certification, re-evaluation — wasn't in the budget."),
          narration:
            "Risk two. Model deprecation. The specific model version you certified — the one your audit committee approved, the one you tested for bias, the one you embedded into a production workflow — is retired by the vendor with maybe six months' notice. Sometimes less. Your replacement work — re-certification, re-evaluation, re-deployment, re-training of users — was almost certainly not in this year's budget. This is now a real risk for any board with material AI in production.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Risk 3 — Concentration risk',
            "70%+ of your AI capability runs on one vendor's API. That vendor has bargaining power on price, terms, and exit. A board should know its concentration ratio."),
          narration:
            "Risk three. Concentration risk. When seventy percent or more of your AI capability runs through one vendor's API — and that's increasingly common — that vendor has bargaining power on price. On terms. On exit. A board should know its concentration ratio. And should make a deliberate choice about whether to mitigate it, or accept it. Concentration isn't automatically bad. Hidden concentration is.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Risk 4 — Data leakage through the vendor',
            "Even when contracts say data is not used to train models, prompt content sometimes leaks into vendor logs, debug systems, or, in worst cases, training pipelines. Worth a quarterly audit clause."),
          narration:
            "Risk four. Data leakage through the vendor. Even when contracts say your data is not used to train models, prompt content sometimes leaks into vendor logs. Into debugging systems. In worst cases, into training pipelines via systems the vendor didn't realise were sampling enterprise data. This is worth a contractual audit clause. Quarterly, if your data sensitivity is high. The clause exists in many enterprise contracts already. If yours doesn't, raise it.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Risk 5 — Vendor going out of business or being acquired',
            "AI vendors are a young industry. Some will fail. Some will be acquired by larger players whose terms differ. Your continuity plan needs to assume both possibilities."),
          narration:
            "Risk five. The vendor going out of business — or being acquired. AI is still a young industry. Some vendors will fail. Some will be acquired by larger players whose terms and pricing differ. Your continuity plan needs to assume both possibilities. What happens to your data if the vendor closes? What happens to your contracts if the vendor is acquired by a competitor of yours? These are not abstract questions. They are board-level continuity questions.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The mitigation set',
        "Diversification (secondary vendor on standby), strong contract terms (data handling, exit, audit, price protection), abstraction layer (don't hard-code one vendor's API into your code), and quarterly vendor risk review. That's the mitigation set."),
      calloutNarration:
        "Here's the mitigation set. Diversification — a secondary vendor on standby for high-tier use cases. Strong contract terms — data handling, exit, audit, price protection. An abstraction layer — your engineers don't hard-code one vendor's API directly into production code, so a vendor switch is days, not months. And a quarterly vendor risk review. Those four together turn vendor risk from existential to manageable. None of them is technical. All of them are policy decisions a board can require.",
    },
    // SLIDE 3
    {
      title: 'The vendor contract clauses that matter',
      iconKey: 'check',
      eyebrow: 'Lesson 2 · Contract terms',
      bodyHtml: `<p>You don't need to read the contract. But you need to know these clauses exist — and ask the GC to confirm them annually.</p>`,
      narrationLead:
        "You don't need to read the actual contract. But you need to know these clauses exist — and ask the General Counsel to confirm them annually. Six clauses.",
      steps: [
        {
          html: stepCard('check', 'blue', '1 · Data handling certification',
            "Vendor certifies that your data is not used to train models. Certified at signing, recertified annually. With the right to audit."),
          narration:
            "Clause one. Data handling certification. The vendor certifies in writing that your data is not used to train their models. Certified at signing. Recertified annually. With the right for you to audit. This clause exists in most enterprise contracts. If yours doesn't, get it added.",
        },
        {
          html: stepCard('check', 'blue', '2 · Model versioning notice',
            "When a model you're using is being deprecated, vendor gives you specific written notice — minimum 12 months, ideally 18 — with named replacement options."),
          narration:
            "Clause two. Model versioning notice. When a model you're actively using is being deprecated, the vendor must give you specific written notice. Minimum twelve months. Ideally eighteen. With named replacement options. This clause is younger than the data handling one. Negotiate for it now while you have leverage — before you're three years into a deep integration that you can't easily exit.",
        },
        {
          html: stepCard('check', 'amber', '3 · Geographic / residency commitment',
            "If you need EU data residency, GCC residency, or sovereign residency, the contract names the regions where data is processed — and commits to those staying available."),
          narration:
            "Clause three. Geographic and residency commitment. If you need EU data residency. GCC residency. Sovereign residency for government contracts. The contract names the specific regions where data is processed — and commits to those staying available. This used to be in cloud contracts but not in AI contracts. The major vendors are now adding it. Insist on it for high-tier workloads.",
        },
        {
          html: stepCard('check', 'amber', '4 · Exit clause with data return',
            "On exit, your data is returned in a usable format within 30 days. Then deleted with certification. Sounds basic. Often missing from AI contracts."),
          narration:
            "Clause four. Exit clause with data return. On exit, your data is returned in a usable format within thirty days. Then deleted with written certification of deletion. Sounds basic. And it is — but it is often missing from AI vendor contracts. Cloud contracts have had this for fifteen years. AI contracts are catching up. Make sure yours has it.",
        },
        {
          html: stepCard('check', 'red', '5 · Incident notification',
            "Any data breach, model malfunction, or unauthorised access — vendor notifies you within 72 hours. Aligns with most data protection laws."),
          narration:
            "Clause five. Incident notification. Any data breach, model malfunction, or unauthorised access — the vendor notifies you within seventy-two hours. This aligns with most data protection laws — GDPR, the UAE law, the Saudi law. The vendor cannot quietly resolve an incident without telling you, when your data was involved. Insist on this clause. It's becoming standard.",
        },
        {
          html: stepCard('check', 'green', '6 · Price protection',
            "Pricing for your committed usage volumes is locked for a defined term — typically 2–3 years. Without this, AI vendor pricing can shift materially mid-contract."),
          narration:
            "Clause six. Price protection. Pricing for your committed usage volumes is locked for a defined contract term — typically two to three years. Without this clause, AI vendor pricing can shift materially mid-contract. Some have, recently. Price protection is essential for any material AI commitment — and it's something the General Counsel can negotiate without difficulty if it's raised early enough in the contract process.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'A specific board question to ask',
      iconKey: 'search',
      eyebrow: 'Lesson 3 · The question',
      bodyHtml: `<p>One question. Ask it at the next audit committee. It surfaces vendor risk faster than any policy review.</p>`,
      narrationLead:
        "One question. Take it to your next audit committee. It will surface vendor risk faster than any policy review.",
      steps: [
        {
          html: stepCard('search', 'blue', 'The question',
            "“For our top three AI vendors — what are our commitments, what are theirs, and what happens to our production systems if any one of them is unavailable for 30 days?”"),
          narration:
            "Here's the question. For our top three AI vendors — what are our commitments, what are theirs, and what happens to our production systems if any one of them is unavailable for thirty days? Listen carefully to the answer. If management can't name the three vendors crisply, the inventory isn't being maintained. If they can't summarise the commitments, the contracts aren't being read. If they can't describe what happens in a thirty-day outage, the continuity planning hasn't been done. Any one of those three gaps is a material governance finding.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'The good answer',
            "Vendor names known. Commitments summarised in plain English. Continuity plan described — usually involves the abstraction layer, the standby secondary vendor, and a sustainment retainer. Confident but not glib."),
          narration:
            "The good answer sounds like this. Vendor names known immediately — no shuffling through papers. Commitments summarised in plain English, not vendor marketing. The continuity plan described concretely — typically involves the abstraction layer we discussed, a standby secondary vendor for high-tier workloads, and a sustainment retainer with the right partner. Confident but not glib. If management gives this answer, you are in good shape.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'The yellow-flag answer',
            "“We have strong relationships with all three vendors.” Translation: there is no continuity plan. Probe further. Specifically ask about contract clauses and abstraction."),
          narration:
            "The yellow-flag answer sounds like this. We have strong relationships with all three vendors. Translation — there is no continuity plan. The relationship is the substitute for the plan. That is not enough at the scale most enterprise AI is now operating at. Probe further. Specifically ask about contract clauses and the abstraction layer. If those answers are also vague, you've found the governance gap. Now you can fix it.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Two anchors before chapter 6 — incident response.</p>`,
      narrationLead:
        "Two anchors before we get to incident response in chapter six.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Five vendor risks, named',
            "Terms change · model deprecation · concentration · data leakage · vendor closure or acquisition. Each needs a control."),
          narration:
            "One. Five vendor risks. Terms-of-service change. Model deprecation. Concentration. Data leakage. Vendor closure or acquisition. Each one needs a specific control — a contract clause, an operational practice, or both.",
        },
        {
          html: stepCard('check', 'green', 'Two — Six clauses to confirm annually',
            "Data handling · model versioning notice · residency · exit · incident notification · price protection. The GC confirms these once a year — minimum."),
          narration:
            "Two. Six clauses. Data handling certification. Model versioning notice. Geographic residency. Exit with data return. Incident notification. Price protection. The General Counsel confirms these are in your top vendor contracts once a year — minimum. Twice a year for the highest-tier vendors.",
        },
      ],
      narrationTrail:
        "Chapter six — incident response. The drill you hope you never need but cannot skip. See you there.",
    },
  ],
}
