import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForFinanceChapter05: Chapter = {
  courseId: 'ai-for-finance-accounting',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-anomaly-audit-fraud',
  title: 'Anomaly, audit, and fraud',
  subtitle: 'The play that takes finance from reactive to proactive — without breaking your controls.',
  slides: [
    // SLIDE 1
    {
      title: 'Anomaly, audit, and fraud',
      iconKey: 'shield',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">The highest-risk finance AI play. Done well, it pays the highest return — losses caught early, audit hours saved, controls strengthened. Done poorly, it erodes trust faster than any other deployment. In the next few minutes, how to do it well.</p>`,
      narrationLead:
        "Welcome to chapter five. Anomaly detection, audit, and fraud. The highest-risk finance AI play. Done well, it pays the highest return — losses caught early, audit hours saved, controls visibly strengthened. Done poorly, it erodes trust faster than any other deployment. So in the next few minutes, how to do it well. The deployment pattern, the audit collaboration, and the failure modes specific to this play.",
    },
    // SLIDE 2
    {
      title: 'What anomaly AI in finance actually does',
      iconKey: 'search',
      eyebrow: 'Lesson 1 · The capability',
      bodyHtml: `<p>Three layers — and they’re not the same. Many vendors blur them. Be specific about which layer you’re buying.</p>`,
      narrationLead:
        "There are three layers of anomaly AI in finance. They're not the same. Many vendors blur them — be specific about which layer you're actually buying, because each one needs different controls.",
      steps: [
        {
          html: stepCard('search', 'green', 'Layer 1 — Rule-based exception detection',
            "Classical: thresholds, ratios, segregation-of-duties violations. The accounting-system layer that's been there for years. AI doesn't replace this — it sits on top of it. Don't let a vendor sell you AI as a replacement for working rules."),
          narration:
            "Layer one. Rule-based exception detection. Classical accounting controls. Thresholds. Ratios. Segregation-of-duties violations. This is the layer that's been in your ERP for years. AI doesn't replace this layer — it sits on top of it. Don't let a vendor sell you AI as a replacement for working rule-based controls. The rules are the foundation. AI adds another floor — it doesn't tear down the existing one.",
        },
        {
          html: stepCard('search', 'blue', 'Layer 2 — Statistical anomaly detection',
            "Pattern deviation. A transaction unlike anything in this account's history. A vendor paid at an unusual time. A journal posted from an unusual location. Statistical AI, no LLM needed. The unglamorous workhorse of the anomaly play."),
          narration:
            "Layer two. Statistical anomaly detection. Pattern deviation from historical norms. A transaction unlike anything in this account's history. A vendor paid at an unusual time of month. A journal entry posted from an unusual user account or geography. This layer uses statistical AI — no LLM needed. It's the unglamorous workhorse of the anomaly play. Most of the genuine value lives here. The flashy demos live in layer three. The actual catches happen at layer two.",
        },
        {
          html: stepCard('search', 'red', 'Layer 3 — LLM-reasoning overlay',
            "For anomalies that pass the statistical filter, an LLM reads the context and proposes an explanation. Helps the investigator triage faster. Beautiful demos. Real benefit only after layers 1 and 2 are clean. Don't start here."),
          narration:
            "Layer three. The LLM reasoning overlay. For anomalies that pass through the statistical filter — meaning, they are actually unusual — an LLM reads the surrounding context. The vendor history. Related transactions. The user's typical patterns. And proposes an explanation. The investigator triages faster because they're not starting from a blank screen. Beautiful demos live here. Real benefit only after layers one and two are clean. Don't start with this layer — it amplifies whatever quality the lower layers produce. If they produce noise, you'll get articulate noise.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'A common mistake',
        "Vendors often pitch layer 3 as the differentiator. The honest truth — layer 2 is where 80% of the value lives. Layer 3 is operational polish. Buy in the order 1 → 2 → 3, not 3 → 2 → 1."),
      calloutNarration:
        "A common mistake worth naming. Vendors often pitch layer three — the LLM reasoning overlay — as the differentiator. The honest truth is that layer two — statistical anomaly detection — is where eighty percent of the value lives. Layer three is operational polish on top of layer two. Buy in the order one then two then three. Not the reverse. The vendor's incentive is to sell you the most expensive layer first. Your incentive is to deploy the layer that catches the most real issues first. Those incentives don't align by default. Hold the line.",
    },
    // SLIDE 3
    {
      title: 'How internal audit becomes your ally',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · The audit relationship',
      bodyHtml: `<p>This is the only finance AI play where internal audit can be your strongest ally — if you bring them in early. Three moves to make them an ally instead of a gate.</p>`,
      narrationLead:
        "This is the only finance AI play where internal audit can genuinely be your strongest ally — if you bring them in early. Three moves to make audit an ally instead of a gate. Treat them as partners, not as a checkpoint to satisfy.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Move 1 — Bring audit into scoping',
            "In week 1 of the project. Internal audit knows where the controls have weak spots — better than the finance team often does. The AI scope improves dramatically when they're at the design table."),
          narration:
            "Move one. Bring internal audit into the scoping conversation in week one of the project — not in week ten when you need their sign-off. Internal audit knows where your controls have weak spots, often better than the finance team does. They've seen the issues across multiple quarters and entities. When they're at the design table, the AI scope improves dramatically. The scope they would have rejected at week ten becomes the scope they help design at week one. Same end state. Much less friction.",
        },
        {
          html: stepCard('users', 'amber', 'Move 2 — Give them a dashboard',
            "Once live, internal audit gets a read-only dashboard of every anomaly the AI surfaced, every decision the team made on each. They can drill into any item, any time. Transparency builds trust faster than any policy document."),
          narration:
            "Move two. Once the system is live, give internal audit a read-only dashboard of every anomaly the AI has surfaced. Every decision the finance team made on each one. They can drill into any item, any time, without asking. Transparency builds trust with audit faster than any policy document ever will. And it removes the dynamic where audit has to ask, can I see — and finance has to produce. The information just lives in their dashboard, always.",
        },
        {
          html: stepCard('users', 'green', 'Move 3 — Joint quarterly tuning review',
            "Once a quarter, finance and internal audit sit together for one hour. Review the anomaly trends. Tune the thresholds. Add new patterns. Both teams own the system after this meeting — not just finance."),
          narration:
            "Move three. Joint quarterly tuning review. Once a quarter, finance and internal audit sit together for one hour. Review the anomaly trends. Tune the detection thresholds. Add new patterns. Both teams own the system after this meeting — not just finance. This shared ownership is what makes the AI defensible during an external audit. The internal auditor can say honestly that they've been involved in the tuning since day one. That's the strongest possible position to be in.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The two failure modes to plan for',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Failure modes',
      bodyHtml: `<p>Two failure modes are specific to this play. They’re symmetric — and they both kill the deployment.</p>`,
      narrationLead:
        "Two failure modes specific to this play. They're symmetric — and both of them kill the deployment, just from opposite directions.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Failure 1 — Alert fatigue',
            "Too many false positives. The team stops investigating because most are noise. The next real anomaly hides in the noise. Prevent by tuning aggressively early — and accepting that some real anomalies will be missed initially. Better than alert fatigue."),
          narration:
            "Failure one. Alert fatigue. Too many false positives. The team stops investigating in detail because most alerts are noise. And the next real anomaly hides comfortably inside that noise. Prevent it by tuning aggressively in the first three months — accepting that some real anomalies will be missed initially. That's a difficult conversation with audit. But missing a few real anomalies in month two — while you tune the system — is better than burning your team out and having them miss everything in month six. Discuss the trade-off honestly upfront.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 2 — Alert avoidance',
            "Opposite failure. The team avoids investigating uncomfortable alerts — particularly when they point at senior people, important vendors, or close-to-the-line judgement calls. Prevent by routing high-stakes anomalies to a different team than the day-to-day investigator."),
          narration:
            "Failure two. Alert avoidance. The opposite failure. The team avoids investigating uncomfortable alerts. Particularly the ones that point at senior people. Important vendors. Or close-to-the-line judgement calls. This is harder to detect — because no alarms ring. The alerts just quietly stop being closed out. Prevent it by routing high-stakes anomalies — typically those involving senior management, related parties, or close-call judgements — to a different investigator than the day-to-day one. Often this is internal audit, not finance. The escalation path needs to exist before the awkward alert appears. Not after.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'The metric that matters',
        "Track <em>investigation rate</em> on high-tier alerts — what % were investigated and closed within their SLA. If it drops below 90%, something is wrong with either the tool (fatigue) or the team (avoidance). Investigate."),
      calloutNarration:
        "Here's the single metric to track. Investigation rate on high-tier alerts. What percentage were investigated and closed out within their target service level — typically within seven days for medium alerts, forty-eight hours for high alerts. If this rate drops below ninety percent, something is wrong. Either with the tool, which is creating fatigue. Or with the team, which is avoiding the uncomfortable alerts. Investigate which one. Both are real failures. Both are fixable — but only if you notice. The investigation rate is the noticing.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 6 — tax and compliance copilots.</p>`,
      narrationLead:
        "Three anchors before we get to tax and compliance copilots in chapter six.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three layers, in order',
            "Rules → statistical → LLM reasoning. Vendors pitch layer 3 first. Layer 2 is where the value lives. Buy in order."),
          narration:
            "One. Three layers — in the right order. Rule-based detection. Statistical anomaly. LLM reasoning overlay. Vendors pitch layer three first. Layer two is where eighty percent of the value lives. Buy in order — one, then two, then three.",
        },
        {
          html: stepCard('check', 'green', 'Two — Internal audit is the ally',
            "Bring them in week one. Give them a dashboard. Run joint quarterly tuning. The relationship is the most important control."),
          narration:
            "Two. Internal audit is the ally — not the gate. Bring them in week one. Give them a read-only dashboard. Run joint quarterly tuning reviews. The relationship is, by itself, the most important control in this entire play.",
        },
        {
          html: stepCard('check', 'green', 'Three — Track investigation rate weekly',
            "Below 90% = fatigue or avoidance. Both kill the deployment. Notice early."),
          narration:
            "Three. Track investigation rate weekly. Below ninety percent means either fatigue or avoidance. Both kill the deployment. Notice early. Address it. Don't let it slide for a quarter and then try to recover the system — by then, the credibility is gone.",
        },
      ],
      narrationTrail:
        "Chapter six — tax and compliance copilots. The play that quietly saves the legal team time. See you there.",
    },
  ],
}
