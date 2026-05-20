import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const m365CopilotChapter05: Chapter = {
  courseId: 'm365-copilot-adoption',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-governance-and-it',
  title: 'Governance and the IT conversation',
  subtitle: 'DLP, sensitivity labels, sharing posture — what IT needs in place before the rollout reaches scale.',
  slides: [
    {
      title: 'Governance and the IT conversation',
      iconKey: 'shield',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Copilot reads from your M365 tenant. That means it sees whatever the user can see — which means your data-loss-prevention posture, your sensitivity labels, and your sharing settings now matter more than they did before. In the next few minutes, what IT needs in place before scale — and how to land the conversation without slowing the rollout.</p>`,
      narrationLead:
        "Welcome to chapter five. Governance and the IT conversation. Copilot reads from your Microsoft 365 tenant — and surfaces what's in it. That means it sees whatever the user can see — which means your data-loss-prevention posture, your sensitivity labels, and your sharing settings now matter more than they did before Copilot. In the next few minutes, what IT needs in place before the rollout reaches scale, and how to land the IT conversation without slowing the broader rollout.",
    },
    {
      title: 'The three IT preparations Copilot makes urgent',
      iconKey: 'shield',
      eyebrow: 'Lesson 1 · Preparations',
      bodyHtml: `<p>Three IT preparations that move from “important” to “urgent” when Copilot deploys at scale. Address them before scale — not after.</p>`,
      narrationLead:
        "Three IT preparations that move from important to urgent when Copilot deploys at scale. Each one has always been important; Copilot raises the stakes. Address them before scale — not after. The cost of address-after is significantly higher than the cost of address-before.",
      steps: [
        {
          html: stepCard('shield', 'red', 'Preparation 1 — Sensitivity labels on all sensitive content',
            "Confidential. Highly confidential. Internal. Public. Apply the labels across the M365 estate. Copilot respects them — only surfacing content the user is licensed to see. Without labels, Copilot may surface to a user what their manager hadn't intended them to find."),
          narration:
            "Preparation one. Sensitivity labels applied across all sensitive content in your Microsoft 365 estate. Confidential. Highly confidential. Internal-only. Public. Apply the labels to documents, emails, and SharePoint sites. Copilot respects sensitivity labels — only surfacing content the user is legitimately licensed to see based on those labels. Without proper labelling, Copilot may surface to a user what their manager hadn't intended them to be able to find. The classical example — finance documents on a shared site the user technically has access to but was never expected to read in detail. Apply the labels first. Then deploy Copilot at scale.",
        },
        {
          html: stepCard('shield', 'amber', 'Preparation 2 — DLP policies tightened',
            "Data Loss Prevention policies that scan for sensitive content patterns — credit card numbers, ID numbers, salary figures, patient data. The policies operate before content surfaces in Copilot. Tighten them before the rollout reaches scale; the cost of tightening after a public incident is high."),
          narration:
            "Preparation two. Data Loss Prevention policies tightened. DLP policies scan for sensitive content patterns — credit card numbers, national ID numbers, salary figures, patient health data, anything else your organisation classifies as sensitive. The policies operate before content surfaces in Copilot. Tighten them before the rollout reaches scale. The cost of tightening DLP after a public incident — for example, someone finding their colleagues' salary information via Copilot — is much higher than the cost of tightening before. Do it preventively.",
        },
        {
          html: stepCard('shield', 'green', 'Preparation 3 — SharePoint over-sharing audit',
            "Most organisations have SharePoint sites set to “anyone in the company” access that were intended for a smaller group. Copilot surfaces from these sites. Audit and tighten over-shared sites before scale. The classical audit: any site with “anyone” access older than 2 years gets reviewed."),
          narration:
            "Preparation three. SharePoint over-sharing audit. Most organisations have legacy SharePoint sites set to anyone-in-the-company access that were originally intended for a much smaller group. The over-sharing has been benign because nobody was actively browsing. Copilot changes that — it surfaces content from these over-shared sites in response to natural-language queries. Audit and tighten over-shared sites before the rollout reaches scale. The classical audit pattern — any site with anyone-in-the-company access older than two years gets reviewed by the site owner or, if there's no active owner, archived to restrict access. This single audit catches most of the embarrassing-Copilot-surfacing scenarios.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The 30-day pre-scale preparation',
        "Before the broader rollout starts, run a 30-day IT preparation sprint. Sensitivity labels rolled out. DLP policies reviewed and tightened. SharePoint over-sharing audited and remediated. The sprint runs in parallel with the pilot. By the time the broader rollout starts, IT is ready."),
      calloutNarration:
        "The thirty-day pre-scale preparation. Before the broader rollout starts in earnest — typically during the pilot weeks plus a couple of weeks afterwards — run a thirty-day IT preparation sprint. Sensitivity labels rolled out across the M365 estate. DLP policies reviewed and tightened for the patterns relevant to your organisation. SharePoint over-sharing audited and remediated. The sprint runs in parallel with the chapter-three pilot. By the time the broader rollout starts in earnest, IT is ready. The IT team appreciates the sequencing — they get time to do the work properly rather than firefight after scale. The change manager appreciates it too — IT issues during the broader rollout would derail adoption.",
    },
    {
      title: 'The IT–change-manager working relationship',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · The relationship',
      bodyHtml: `<p>The IT lead and the change manager have to work as partners, not as silos. Three patterns that make the partnership work — and avoid the classical tension.</p>`,
      narrationLead:
        "The IT lead and the change manager have to work as partners — not as separate silos that occasionally fight over priorities. Three patterns that make the partnership work — and avoid the classical tension where IT wants to slow down for governance and the change manager wants to speed up for adoption.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Pattern 1 — Joint weekly review',
            "30 minutes a week. Both leads in the room. Review what IT is addressing, what the change manager is hearing from users, where the two intersect. Joint visibility prevents both surprise and territorial conflict."),
          narration:
            "Pattern one. Joint weekly review. Thirty minutes a week. Both the IT lead and the change manager in the room. They review what IT is currently addressing — DLP, sensitivity labels, the SharePoint audit, any specific user-raised issues. And what the change manager is hearing from users — adoption blockers, governance complaints, support patterns. Joint visibility into both sides prevents the surprise factor that creates territorial conflict. The weekly cadence is what builds the partnership. Without it, the two roles fragment.",
        },
        {
          html: stepCard('users', 'amber', 'Pattern 2 — Shared dashboard',
            "One dashboard that both teams see. Adoption metrics on one side. Governance metrics on the other. When governance is healthy and adoption is climbing, both teams are winning. When one is struggling, both teams have visibility — and can collaborate on the fix."),
          narration:
            "Pattern two. Shared dashboard. One dashboard that both teams look at. Adoption metrics on one side — active users, prompt volume, satisfaction. Governance metrics on the other side — DLP incidents, SharePoint sharing alerts, sensitivity-label coverage. When both halves are healthy, both teams are winning. When one is struggling, both teams have visibility and can collaborate on the fix. The shared dashboard prevents the dynamic where each team thinks the other is creating problems. Visibility produces alignment.",
        },
        {
          html: stepCard('users', 'green', 'Pattern 3 — Quarterly joint review with the sponsor',
            "Once a quarter, the IT lead, the change manager, and the executive sponsor review the rollout together. The sponsor sees adoption and governance side by side. The two teams present together. The presentation rhythm builds the joint accountability."),
          narration:
            "Pattern three. Quarterly joint review with the executive sponsor. Once a quarter, the IT lead, the change manager, and the sponsor review the rollout together. The sponsor sees adoption and governance side by side — not in separate meetings that have different framings. The two teams present together. They take questions together. The presentation rhythm builds joint accountability over time. Both teams understand that they succeed or struggle together — the rollout is one outcome, not two parallel ones.",
        },
      ],
    },
    {
      title: 'Three classical IT–rollout conflicts — and how to resolve',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Conflict patterns',
      bodyHtml: `<p>Three classical tensions between IT and the rollout team. Each one has a resolution pattern. Recognise the tension; apply the pattern.</p>`,
      narrationLead:
        "Three classical tensions between IT and the rollout team that show up in almost every Copilot rollout. Each one has a resolution pattern. Recognise the tension when it appears; apply the resolution.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Conflict 1 — “Slow down for governance” vs. “Speed up for adoption”',
            "Resolution: agree on the minimum governance posture before scale (the 3 preparations above), then commit to that being enough. Further governance work continues in parallel — it doesn't gate further adoption. Specificity in the agreement is what holds."),
          narration:
            "Conflict one. Slow down for governance versus speed up for adoption. The classical tension. Resolution — agree explicitly on the minimum governance posture required before the broader rollout reaches scale. That's the three preparations from earlier in this chapter. Commit to that being enough as the gate. Further governance work continues in parallel during the rollout — it doesn't gate further adoption. The specificity of the agreement is what holds when individual incidents try to revive the broader conflict. Document the agreement.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Conflict 2 — “We need to lock down sharing first” vs. “We need to scale now”',
            "Resolution: lock down the obvious over-sharing in the 30-day sprint. Accept that some smaller-scale over-sharing will surface during the rollout — and have a fast remediation process ready. Perfect is the enemy of shipped here."),
          narration:
            "Conflict two. We need to lock down sharing first versus we need to scale now. Resolution — lock down the obvious over-sharing during the thirty-day pre-scale sprint. The legacy sites with anyone-in-the-company access. The shared drives nobody owns. The specific high-risk locations. Accept that some smaller-scale over-sharing will surface during the broader rollout — and have a fast remediation process ready for those cases. Typically, a user reports an over-sharing surface; IT remediates within twenty-four hours; the change manager communicates the fix to the affected channel. Perfect is the enemy of shipped here. Ship with good-enough governance and remediate the long tail as it surfaces.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Conflict 3 — “Users are doing something they shouldn\'t” vs. “Users are doing what we trained them to do”',
            "Resolution: investigate jointly. Sometimes it's a user training gap; sometimes it's a policy gap. Don't escalate immediately to discipline — escalate to investigation. The joint investigation pattern protects users and surfaces real fixes."),
          narration:
            "Conflict three. Users are doing something they shouldn't versus users are doing what we trained them to do. The most heated conflict, and the one most often resolved badly. Resolution — investigate jointly. The IT lead and the change manager together review the specific case. Sometimes it's a user training gap that the prompt library and office hours need to close. Sometimes it's a policy gap — the policy genuinely didn't cover the scenario the user was in. Don't escalate immediately to discipline. Escalate to investigation. The joint-investigation pattern protects users from being punished for ambiguity, and it surfaces real fixes that improve the rollout. Use this pattern consistently.",
        },
      ],
    },
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 6 — measurement in steady state.</p>`,
      narrationLead:
        "Three anchors before chapter six — measurement in steady state.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three pre-scale preparations',
            "Sensitivity labels · DLP policies · SharePoint over-sharing audit. Run as a 30-day sprint in parallel with the pilot. By the time the broader rollout scales, IT is ready."),
          narration:
            "One. Three pre-scale preparations. Sensitivity labels applied to sensitive content. DLP policies reviewed and tightened. SharePoint over-sharing audited and remediated. Run as a thirty-day sprint in parallel with the chapter-three pilot. By the time the broader rollout scales, IT is ready. Without the sprint, the broader rollout produces governance fires that derail adoption.",
        },
        {
          html: stepCard('check', 'green', 'Two — IT–change-manager partnership patterns',
            "Joint weekly review · shared dashboard · quarterly review with sponsor. Visibility produces alignment. Without these patterns, the two roles fragment into territorial silos."),
          narration:
            "Two. IT–change-manager partnership patterns. Joint weekly review of governance and adoption together. Shared dashboard both teams look at. Quarterly review with the executive sponsor, with both teams presenting together. Visibility produces alignment over time. Without these patterns, the two roles fragment into territorial silos that hurt the rollout.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three classical conflicts, three resolution patterns',
            "Slow down vs. speed up · lock down vs. scale · users doing something they shouldn't. Each has a defensible resolution. Apply the patterns consistently."),
          narration:
            "Three. Three classical IT-rollout conflicts. Slow down for governance versus speed up for adoption — agree on minimum governance, commit it as enough. Lock down sharing first versus scale now — sprint the obvious; remediate the long tail. Users doing something they shouldn't — investigate jointly, escalate to investigation not discipline. Each conflict has a defensible resolution pattern. Apply the patterns consistently as conflicts arise.",
        },
      ],
      narrationTrail:
        "Chapter six — measurement in steady state. The metrics that hold across years. See you there.",
    },
  ],
}
