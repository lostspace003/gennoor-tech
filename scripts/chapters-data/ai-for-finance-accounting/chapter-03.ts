import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForFinanceChapter03: Chapter = {
  courseId: 'ai-for-finance-accounting',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-reconciliation-agent',
  title: 'The reconciliation agent',
  subtitle: 'Month-end close from five days to two — without firing the controller.',
  slides: [
    // SLIDE 1
    {
      title: 'The reconciliation agent',
      iconKey: 'users',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">If document AI is the most reliable finance win, the reconciliation agent is the most visible one — because the controller stops working weekends. In the next few minutes, what the agent does, how it integrates with your close calendar, and the controls that keep auditors comfortable.</p>`,
      narrationLead:
        "Welcome to chapter three. The reconciliation agent. If document AI is the most reliable finance win, the reconciliation agent is the most visible one — because the controller stops working weekends. And visibility matters when you're building credibility for the next plays. In the next few minutes, what the agent actually does, how it slots into your close calendar, and the controls that keep your auditors comfortable through the change.",
    },
    // SLIDE 2
    {
      title: 'What a reconciliation agent does',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · The capability',
      bodyHtml: `<p>Three responsibilities — each one mappable to a current pain point in your close.</p>`,
      narrationLead:
        "A reconciliation agent has three responsibilities. Each one maps to a current pain point in your close. Let me walk through them — and where each one fits in your existing process.",
      steps: [
        {
          html: stepCard('search', 'green', '1 · Ingest and normalise',
            "Bank statements, GL extracts, AP/AR sub-ledgers, intercompany feeds. Different formats, different periods, different timestamps — all normalised into a canonical reconciliation view. The unglamorous work that makes everything else possible."),
          narration:
            "One. Ingest and normalise. Bank statements. GL extracts. AP and AR sub-ledger feeds. Intercompany flows. Different formats. Different periods. Different timestamps. The agent normalises all of these into a single canonical reconciliation view. This is the unglamorous work. It's also the work that makes everything else possible — and the work most off-the-shelf tools do poorly when applied to your specific data shape. Custom work pays off here.",
        },
        {
          html: stepCard('search', 'blue', '2 · Match and surface mismatches',
            "Auto-matching at the transaction level using a combination of rules and learned patterns. What can't match gets surfaced — with the most likely explanation and proposed remediation already attached. Saves the controller from being a detective."),
          narration:
            "Two. Match and surface mismatches. The agent auto-matches transactions using a combination of explicit rules — the standard accounting matches everybody uses — and learned patterns from the controller's own historical decisions. What doesn't match gets surfaced. And here's where the agent earns its keep — it surfaces the mismatch with the most likely explanation already attached. And the proposed remediation. The controller stops being a detective for routine cases. The detective work is reserved for the genuinely unusual.",
        },
        {
          html: stepCard('check', 'amber', '3 · Propose journal entries with audit trail',
            "For approved matches and accepted remediations, the agent drafts the journal entry. The controller approves with one click. Every action is logged — what the agent proposed, what the human approved, what reasoning was used."),
          narration:
            "Three. Propose journal entries — with full audit trail. For approved matches and accepted remediations, the agent drafts the journal entry in your ERP format. The controller approves with one click. Or modifies, then approves. Or rejects with a written reason. Every action is logged — what the agent proposed, what the human approved, what reasoning was used. The audit trail is not optional. It's what makes the deployment defensible to your external auditor and to internal audit.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The control discipline',
        "Material journal entries — typically above a threshold like $10k or $50k — always require human approval, never auto-post. Below the threshold can auto-post with the human reviewing the daily exception report. This split is what makes auditors comfortable."),
      calloutNarration:
        "Here's the control discipline that makes auditors comfortable. Material journal entries — typically above a threshold the controller sets, say ten thousand or fifty thousand dollars — always require human approval. They never auto-post, regardless of the agent's confidence. Below the threshold, entries can auto-post with the human reviewing a daily exception report. That split is what every external auditor will want to see. Set it explicitly. Document it. Review it annually. The threshold often moves down as confidence in the agent grows — that's normal — but it doesn't move down without explicit controller sign-off.",
    },
    // SLIDE 3
    {
      title: 'How it integrates with the close calendar',
      iconKey: 'calendar',
      eyebrow: 'Lesson 2 · The close',
      bodyHtml: `<p>The reconciliation agent doesn’t replace your close — it compresses it. Here’s where it fits in a typical close calendar.</p>`,
      narrationLead:
        "The reconciliation agent doesn't replace your close — it compresses it. Let me show you where it fits in a typical close calendar. Then you can see, concretely, where the days come back.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Day 1 — Cut-off and feeds open',
            "The agent pulls bank statements, GL extracts, AP/AR positions automatically. The controller doesn't manually start each feed — everything is running by 9am day 1."),
          narration:
            "Day one. Cut-off and feeds open. The agent automatically pulls bank statements. GL extracts. AP and AR positions. The controller doesn't manually start each data feed any more — everything is running by nine in the morning on day one. This sounds small. In practice, it removes the first chunk of the close day, which historically was just data preparation.",
        },
        {
          html: stepCard('calendar', 'blue', 'Day 1 afternoon — First-pass match',
            "By end of day 1, 70–85% of transactions are auto-matched. The exception list — 15–30% — is ready for the controller. This used to take 2 days."),
          narration:
            "Day one afternoon. First-pass matching is complete. By end of day one, seventy to eighty-five percent of transactions are auto-matched. The exception list — fifteen to thirty percent of transactions — is ready and prioritised for the controller. Historically, this work took two days. Now it's done by Friday afternoon of week one. That single shift is where most of the day savings come from.",
        },
        {
          html: stepCard('calendar', 'amber', 'Day 2 — Controller works the exception list',
            "The agent walks the controller through each exception with proposed explanation and remediation. Controller approves, modifies, or rejects. End-of-day 2, 95%+ of transactions are reconciled."),
          narration:
            "Day two. The controller works the exception list. The agent walks the controller through each exception — proposed explanation and proposed remediation already attached. The controller approves, modifies, or rejects. By end of day two, ninety-five percent or more of transactions are reconciled. The remaining five percent are the genuinely unusual items that always required senior judgement anyway. The controller spends day two on the work that needed her — not on data preparation.",
        },
        {
          html: stepCard('calendar', 'green', 'Day 3 — Material journal review + sign-off',
            "Material entries above threshold go through senior controller and CFO review. Audit trail captures everything. Close signed off end of day 3 — instead of day 5."),
          narration:
            "Day three. Material journal review and sign-off. The material entries that were above the threshold go through senior controller and CFO review. The audit trail captures everything — what the agent proposed, what was approved, who approved, with what reasoning. Close is signed off by end of day three. Instead of end of day five. Two days back, every month. That's the visible benefit the CFO presents to the board.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'What can go wrong — and how to prevent it',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Failure modes',
      bodyHtml: `<p>Three failure modes specific to reconciliation agents. Each one preventable — if you know to watch for it.</p>`,
      narrationLead:
        "Three failure modes specific to reconciliation agents. Each one preventable — if you know to watch for it during the build and the first six months in production.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Failure 1 — Over-trust on auto-match',
            "The agent quietly auto-matches a category it shouldn't. The controller stops checking. Six months later, a misclassification has been compounding into the wrong account. Prevent with sampling — even auto-matched items get spot-checked."),
          narration:
            "Failure one. Over-trust on auto-match. The agent quietly starts auto-matching a category it shouldn't be — usually because a new transaction pattern emerged that the rules didn't anticipate. The controller stops checking that category because previous quarters worked. Six months later, a misclassification has been compounding into the wrong account. Prevent it with sampling. Even auto-matched items get spot-checked — typically two percent of auto-matched transactions, monthly, picked randomly. The sampling work is a few hours per month. The cost of not doing it is a restated quarter.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 2 — The new-process gap',
            "Your firm starts a new business line, a new entity, a new ERP module. The agent hasn't been trained on it. Reconciliation quietly degrades. Prevent with a forced agent review whenever the chart of accounts or the entity structure changes."),
          narration:
            "Failure two. The new-process gap. Your firm launches a new business line. Adds an entity. Activates a new ERP module. The agent hasn't been trained on it — and reconciliation for that area quietly degrades while everything else looks fine. Prevent it with a forced agent review whenever the chart of accounts or the entity structure changes. The trigger is procedural — the new entity setup ticket includes an item that says, update the reconciliation agent. Add it to your finance procedures. Without that, the gap is invisible until somebody finds the misstatement.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Failure 3 — Skill atrophy',
            "Your AP team forgets how to reconcile manually. The agent goes down for two days. The team can't operate. Prevent by rotating one full manual close per quarter — even if the agent is working. Keeps the muscle alive."),
          narration:
            "Failure three. Skill atrophy. Your AP and accounting team forgets how to reconcile manually because they haven't had to in a year. Then the agent goes down for two days — maybe a vendor outage, maybe an ERP upgrade. The team genuinely cannot operate. Prevent it with a rotation. One full manual close per quarter — performed by the team, with the agent on but its outputs hidden from them. They re-do the close manually as a drill. It costs a day of their time. It keeps the muscle alive. Internal audit will love this practice. And so will your CFO the first time the agent has a real outage.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 4 — forecasting with AI.</p>`,
      narrationLead:
        "Three anchors before we move to forecasting with AI in chapter four.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three responsibilities · one architecture',
            "Ingest and normalise · match and surface mismatches · propose journal entries with audit trail. The architecture is the same across most ERPs."),
          narration:
            "One. Three responsibilities — one architecture. Ingest and normalise. Match and surface mismatches. Propose journal entries with full audit trail. The architecture is the same across most ERPs. The customisation is in the data feeds and the threshold rules.",
        },
        {
          html: stepCard('check', 'green', 'Two — The material-entry threshold is the control',
            "Above the threshold, always human approval. Below, auto-post with daily exception review. Set explicit. Document. Review annually."),
          narration:
            "Two. The material-entry threshold is the control discipline that makes the deployment defensible. Above the threshold, always human approval. Below, auto-post with daily exception review. Set the threshold explicitly. Document it. Review it annually with the audit committee and the external auditor.",
        },
        {
          html: stepCard('check', 'green', 'Three — Two days back, every month',
            "The visible benefit. Defend the number consistently — same definition, same person reporting. It funds the next play."),
          narration:
            "Three. Two days back, every month. That's the visible benefit. Defend the number consistently — same definition, same person reporting, same audience. It funds the next AI play in finance. Inconsistent reporting on the win is what loses the next budget cycle.",
        },
      ],
      narrationTrail:
        "Chapter four — forecasting with AI. Where ML beats Excel, and where it doesn't. See you there.",
    },
  ],
}
