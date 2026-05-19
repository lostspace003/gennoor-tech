import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForHrChapter07: Chapter = {
  courseId: 'ai-for-hr-people-teams',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-compliance-and-data',
  title: 'Compliance, data handling, and the works council',
  subtitle: 'The conversation that determines whether your HR AI portfolio is sustainable — or a slow-motion compliance incident.',
  slides: [
    // SLIDE 1
    {
      title: 'Compliance, data handling, and the works council',
      iconKey: 'shield',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Employee data is among the most sensitive data the firm holds. AI changes how that data flows. In the next few minutes, what employees and regulators actually require, the works council conversation framework, and the three patterns that keep HR AI sustainable.</p>`,
      narrationLead:
        "Welcome to chapter seven. Compliance, data handling, and the works council. Employee data is among the most sensitive data the firm holds. AI changes how that data flows — through systems, through vendors, sometimes across borders. In the next few minutes, what employees and regulators actually require. The works council conversation framework. And the three patterns that keep an HR AI portfolio sustainable rather than turning into a slow-motion compliance incident.",
    },
    // SLIDE 2
    {
      title: 'The data-handling rules specific to HR AI',
      iconKey: 'shield',
      eyebrow: 'Lesson 1 · Data rules',
      bodyHtml: `<p>Three rules specific to HR data in AI systems. Generic AI data handling isn’t enough — HR data has its own legal regime in most jurisdictions.</p>`,
      narrationLead:
        "Three rules specific to HR data in AI systems. Generic AI data handling — the rules that apply to your CRM or your support data — isn't enough. HR data has its own legal regime in most jurisdictions. GDPR's Article 22 in Europe. Specific national laws in the GCC. India's DPDPA with its employer carve-outs. Apply these three rules on top of generic AI data discipline.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Rule 1 — Purpose limitation',
            "Employee data collected for payroll can't be used for recruiting AI. Employee data collected for benefits administration can't be used for performance AI. Each use of HR data in AI needs its own explicit purpose — declared, consented where required, and bounded."),
          narration:
            "Rule one. Purpose limitation. Employee data collected for one purpose cannot be silently used for another. Payroll data collected to pay people cannot be used for recruiting AI without a new purpose declaration. Benefits administration data cannot be used for performance AI. Each use of HR data in an AI system needs its own explicit purpose. Declared to the employee. Consented where consent applies. And bounded — the system uses the data only for the declared purpose, not for adjacent ones. This rule is foundational. Every other compliance rule depends on getting this one right.",
        },
        {
          html: stepCard('shield', 'amber', 'Rule 2 — Automated decision rights',
            "GDPR Article 22 and equivalents in other jurisdictions: significant decisions can't be made by AI alone. Employees can require human review of any automated decision affecting them. The rule is binding — not optional. Design for it from day one."),
          narration:
            "Rule two. Automated decision rights. GDPR Article twenty-two in Europe. Equivalent provisions in other jurisdictions. Significant decisions affecting an employee cannot be made by AI alone. Employees have the right to request human review of any automated decision affecting them — promotions, performance ratings, terminations, significant compensation changes. The rule is binding, not optional. Design for it from day one. Build the human-review pathway. Test that it works. Communicate it to employees as part of any AI-touching HR process. Then the regulator question, when it comes, has an answer ready.",
        },
        {
          html: stepCard('shield', 'green', 'Rule 3 — Cross-border transfer',
            "Employee data in many countries cannot leave the country — or can only leave under specific safeguards. If the AI vendor's inference runs offshore, you have a cross-border transfer that needs legal grounding. The GCC and India are tightening on this; the EU has tightened already."),
          narration:
            "Rule three. Cross-border transfer. Employee data in many countries cannot leave the country — or can only leave under specific safeguards like standard contractual clauses, adequacy decisions, or binding corporate rules. If the AI vendor's inference runs offshore — typically in the US for major LLM vendors — you have a cross-border transfer that needs legal grounding. The GCC and India are tightening on this in 2026. The EU tightened years ago. Get the legal grounding in place before deployment. The sovereign cloud postures we covered in the BFSI course apply here too — they may be the right answer for high-risk HR AI workloads.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The DPIA is your friend',
        "A Data Protection Impact Assessment — required in many jurisdictions for high-risk processing — forces you to think through all three rules at design time. Don't treat the DPIA as a checkbox. Use it as the design framework. The DPIA written well becomes the regulator briefing document later."),
      calloutNarration:
        "The Data Protection Impact Assessment — the DPIA — is your friend. Required in many jurisdictions for high-risk processing, which HR AI almost always is. The DPIA forces you to think through all three data rules at design time. Don't treat it as a checkbox to complete after design. Use it as the design framework — the DPIA shapes the system before the system is built. The DPIA written well becomes the regulator briefing document later. Two birds. One assessment. Worth the discipline.",
    },
    // SLIDE 3
    {
      title: 'The works council conversation — how to do it well',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · The conversation',
      bodyHtml: `<p>Where formal employee representation exists, the conversation is required. Where it doesn’t exist formally, the conversation is still wise. Three principles that make the conversation productive.</p>`,
      narrationLead:
        "Where formal employee representation exists — works councils in Europe, equivalent bodies in many other markets — the conversation about HR AI is legally required. Where formal representation doesn't exist, the conversation is still wise — because the trust the conversation builds protects you later. Three principles that make the conversation productive rather than adversarial.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Principle 1 — Early, not at launch',
            "Bring the works council into the design conversation — not into the launch announcement. They have opinions, often well-informed ones. Those opinions improve the design. Surprised reps become opposition; consulted reps become partners. This is consistent across markets and across the years."),
          narration:
            "Principle one. Early — not at launch. Bring the works council into the design conversation, not into the launch announcement. They will have opinions. Often well-informed opinions, drawn from their experience advocating for employees. Those opinions improve the design. Sometimes they catch things the HR team missed. Sometimes they push back on a choice that turns out to be the right pushback. Surprised representatives become opposition that delays deployment by months. Consulted representatives often become partners who help carry the deployment with their constituencies. This pattern is consistent across markets and across the years.",
        },
        {
          html: stepCard('users', 'amber', 'Principle 2 — Substance over process',
            "Don't tick the consultation box. Share the actual design, the actual data flow, the actual bias monitoring. Treat the reps as informed peers. They notice the difference between substance and process — and they remember it next time."),
          narration:
            "Principle two. Substance over process. Don't tick the consultation box by sharing a high-level summary that hides the actual design. Share the actual design. The actual data flow. The actual bias monitoring framework. Treat the representatives as informed peers — many of them are more informed than HR teams expect. They notice immediately when the consultation is substantive versus procedural. And they remember it the next time. Substance once builds trust; process-only consultation poisons every future conversation. Invest in the first one.",
        },
        {
          html: stepCard('users', 'green', 'Principle 3 — Quarterly review post-launch',
            "Don't disappear after the launch consultation. Quarterly review of how the system is actually performing — outcomes by group, incidents, what's being adjusted. The relationship deepens. Trust compounds. Future deployments get easier."),
          narration:
            "Principle three. Quarterly review post-launch. Don't disappear after the launch consultation. A quarterly review of how the system is actually performing — outcomes by group, incidents that arose, what's been adjusted in response. This is the same rhythm as the BFSI bias monitoring review with the works council from chapter two. The relationship deepens. Trust compounds. And future HR AI deployments get easier — because the representatives have seen the discipline at work over multiple quarters. The first deployment is the hard one. The subsequent ones land into an established relationship.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three patterns that keep HR AI sustainable',
      iconKey: 'rocket',
      eyebrow: 'Lesson 3 · Sustainability',
      bodyHtml: `<p>Three patterns that keep an HR AI portfolio sustainable across multiple deployments, multiple years, and multiple incidents.</p>`,
      narrationLead:
        "Three patterns that keep an HR AI portfolio sustainable across multiple deployments, multiple years, and the incidents that will inevitably arise. None of the three is technical. All three are operational discipline. Set them up once. Defend them.",
      steps: [
        {
          html: stepCard('rocket', 'blue', 'Pattern 1 — Per-system DPIAs, kept current',
            "Each HR AI system has its own DPIA. Updated annually. Updated whenever the system materially changes. The DPIA file is the asset that survives team changes, vendor changes, and regulator examinations."),
          narration:
            "Pattern one. Per-system Data Protection Impact Assessments — kept current. Each HR AI system has its own DPIA. Not a generic HR-AI DPIA covering everything. A specific DPIA per system. Updated annually. Updated whenever the system materially changes — new use case, new data source, new vendor. The DPIA file is the asset that survives team changes, vendor changes, and regulator examinations. Treat it as a permanent record, maintained, not as a one-off compliance artefact. The discipline compounds.",
        },
        {
          html: stepCard('rocket', 'amber', 'Pattern 2 — Independent annual review',
            "Once a year, an independent party — internal audit or external — reviews the HR AI portfolio. Findings to the HR leadership, the audit committee, and the works council. Not optional. Builds the evidence trail year over year."),
          narration:
            "Pattern two. Independent annual review of the HR AI portfolio. Once a year, an independent party — internal audit or an external specialist — reviews the entire HR AI portfolio. Findings shared with the HR leadership, the audit committee, and the works council. This is not optional in any responsible HR AI programme. The review builds the evidence trail year over year — the trail that protects the HR function in any future investigation or examination. And the review surfaces drift early, before drift becomes a finding. Worth the modest cost.",
        },
        {
          html: stepCard('rocket', 'green', 'Pattern 3 — The HR AI charter, ratified',
            "Same gravity as the board AI charter from the governance course. The HR-specific AI charter — four plays, the three lines, the three filters — signed by the CHRO. Reviewed annually. The reference document that holds when leaders change."),
          narration:
            "Pattern three. The HR AI charter — formally ratified. Same gravity as the board AI governance charter from the governance and risk course. But specific to HR. The four plays HR will deploy. The three lines HR will not cross. The three filters at the HR AI investment committee. Signed by the Chief Human Resources Officer. Reviewed annually. The reference document that holds when leaders change, when vendors push, when internal pressure mounts. Without the charter, the discipline relies on individual memory. With the charter, the discipline is institutional. Build it. Ratify it. Defend it.",
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
          html: stepCard('check', 'green', 'One — Three HR data rules on top of generic AI rules',
            "Purpose limitation · automated decision rights · cross-border transfer. HR data has its own legal regime. Apply these three on top of generic AI data discipline."),
          narration:
            "One. Three HR data rules on top of generic AI data rules. Purpose limitation. Automated decision rights. Cross-border transfer. HR data has its own legal regime in most jurisdictions. Apply these three on top of whatever generic AI data discipline your firm already has. They are not optional. The DPIA is the design tool for thinking through all three at once.",
        },
        {
          html: stepCard('check', 'green', 'Two — Works council conversation: early, substantive, quarterly',
            "Early, not at launch. Substance, not process. Quarterly review post-launch. The relationship is the safeguard."),
          narration:
            "Two. Works council conversation. Early — at design time, not at launch. Substantive — share the actual design, not a summary. Quarterly review post-launch — the relationship deepens, trust compounds. Where formal representation exists, this is legally required. Where it doesn't exist formally, the conversation is still wise. The relationship is the safeguard.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three sustainability patterns',
            "Per-system DPIAs kept current · independent annual review · ratified HR AI charter. Not optional. Build them all."),
          narration:
            "Three. Three sustainability patterns. Per-system DPIAs, kept current. Independent annual review of the HR AI portfolio. A formally ratified HR AI charter. Not optional in any responsible HR AI programme. Build all three. They are what keep HR AI sustainable across multiple deployments, multiple years, and the incidents that will inevitably arise.",
        },
      ],
      narrationTrail:
        "Final chapter — your HR AI roadmap on one page. Where everything we've covered lands as something HR leadership can actually adopt. See you there.",
    },
  ],
}
