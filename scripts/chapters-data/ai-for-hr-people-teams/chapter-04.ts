import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForHrChapter04: Chapter = {
  courseId: 'ai-for-hr-people-teams',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-policy-qa',
  title: 'Policy Q&A and employee help',
  subtitle: 'The lowest-risk, highest-value HR AI play. Where most HR teams should actually start.',
  slides: [
    // SLIDE 1
    {
      title: 'Policy Q&A and employee help',
      iconKey: 'bookOpen',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Policy Q&A is the lowest-risk, highest-value HR AI play. It’s where most HR teams should actually start — before recruiting AI, before onboarding copilots, before performance support. This chapter shows the pattern, the discipline, and the metrics.</p>`,
      narrationLead:
        "Welcome to chapter four. Policy Q and A and employee help. This is the lowest-risk, highest-value HR AI play. It is where most HR teams should actually start — before recruiting AI, before onboarding copilots, before performance support. The bias risk is low because answers come from your policies. The value is immediate because employees ask policy questions every day. In the next few minutes, the pattern, the discipline, and the metrics.",
    },
    // SLIDE 2
    {
      title: 'What employees actually ask — three categories',
      iconKey: 'search',
      eyebrow: 'Lesson 1 · The questions',
      bodyHtml: `<p>Three categories of policy questions cover roughly 80% of what employees ask HR. Knowing the categories shapes the corpus design.</p>`,
      narrationLead:
        "Three categories of policy questions cover roughly eighty percent of what employees ask HR every week. Knowing the three categories shapes how you build the policy corpus. Generic Q and A across all topics is harder to make work well than category-targeted Q and A. So know the categories first.",
      steps: [
        {
          html: stepCard('search', 'green', 'Category 1 — Benefits and money',
            "Health coverage. Parental leave. Expense limits. Bonus timing. Tuition reimbursement. Vehicle allowance. Pension. These are the questions employees ask most often — and the questions where they most need a clear answer with a citation."),
          narration:
            "Category one. Benefits and money. Health coverage details. Parental leave policy. Expense limits by role and country. Bonus timing and calculation. Tuition reimbursement rules. Vehicle allowance. Pension contributions. These are the questions employees ask most often, by volume. And the questions where they most need a clear, specific answer with a citation to the exact policy clause — because money matters and ambiguity erodes trust faster than anything else.",
        },
        {
          html: stepCard('search', 'blue', 'Category 2 — Time and leave',
            "Annual leave entitlement. Sick leave rules. Public holiday calendar. How to request leave. What happens when leave is denied. Religious leave. Carer's leave. The volume on these questions spikes seasonally — book the AI before the spike."),
          narration:
            "Category two. Time and leave. Annual leave entitlement. Sick leave rules. Public holiday calendar for the specific country. How to request leave. What happens when leave is denied. Religious leave. Carer's leave. The volume on these questions spikes seasonally — before public holidays, at year-end, around school holidays. Book the AI before the seasonal spike. Trying to deploy it during a spike is the wrong moment.",
        },
        {
          html: stepCard('search', 'amber', 'Category 3 — Conduct and process',
            "How to raise a concern. Grievance procedure. What's expected in performance reviews. The code of conduct on gifts, hospitality, conflicts. These questions are lower volume but higher stakes — the answers need to be precise and the escalation path obvious."),
          narration:
            "Category three. Conduct and process. How to raise a concern. The grievance procedure. What's expected in the performance review process. The code of conduct on gifts, hospitality, conflicts of interest. These questions are lower volume than benefits or leave — but the stakes are higher. The answers need to be precise. And the escalation path to a human — typically the HR business partner or the ethics line — needs to be obvious. The agent never tries to handle a grievance question entirely on its own.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Build the corpus by category',
        "Don't try to build one giant policy corpus all at once. Build by category. Benefits first — it's the highest volume. Then time and leave. Then conduct. Each one is a 2-week project. The team learns by category. The agent improves by category."),
      calloutNarration:
        "Build the corpus by category. Don't try to build one giant policy corpus covering everything at once. Build by category. Benefits first — it's the highest volume and lowest stakes. Then time and leave. Then conduct and process. Each category is roughly a two-week project for the HR team plus the engineering partner. The team learns the pattern category by category. The agent improves category by category. By month two, all three categories are live and the agent is consistently useful. Pacing matters here.",
    },
    // SLIDE 3
    {
      title: 'The corpus discipline — non-negotiable',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · Corpus discipline',
      bodyHtml: `<p>Same source-of-truth discipline as the boards course governance posture. The corpus is the trust model. Lock it down.</p>`,
      narrationLead:
        "The corpus is the trust model. If the corpus drifts, the answers drift, and the trust collapses. Same source-of-truth discipline as the governance posture we covered in the boards course. Lock the corpus down. Three rules.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Rule 1 — Only approved-policy documents',
            "The corpus is exactly the documents your HR policy committee has approved. No drafts. No team-specific addenda. No screenshots of slides. If it isn't in the formal policy library, it isn't in the corpus."),
          narration:
            "Rule one. Only approved-policy documents in the corpus. The corpus is exactly the documents your HR policy committee has formally approved. Not drafts. Not team-specific addenda someone wrote two years ago. Not screenshots of slides from an all-hands. Not the kind well-meaning explanations HR business partners have sent in emails. If it isn't in the formal policy library, it isn't in the corpus. This rule is uncomfortable to defend — there's always pressure to include the useful informal documents. Defend it anyway. The rule is what makes the answers defensible.",
        },
        {
          html: stepCard('shield', 'amber', 'Rule 2 — Citation on every answer',
            "Every answer carries a citation to the exact policy clause. If the agent cannot cite, the agent cannot answer — it escalates. Citation is the audit trail and the trust signal at once. Don't compromise on this."),
          narration:
            "Rule two. Citation on every answer. Every single answer the agent gives carries a citation to the exact policy clause that produced it. If the agent cannot cite a specific clause, the agent cannot give an answer. It escalates to a human. Citation is the audit trail — for compliance — and the trust signal — for the employee — at the same time. Don't compromise on this rule. The pressure to allow uncited answers will come from the vendor — citing better user experience. The pressure is wrong. Citation is the discipline.",
        },
        {
          html: stepCard('shield', 'green', 'Rule 3 — Quarterly corpus review with the policy committee',
            "Once a quarter, HR policy committee reviews the corpus against current policy. Outdated documents are removed. New policies are added. The review meeting is on the calendar permanently. Without it, the corpus rots in 18 months."),
          narration:
            "Rule three. Quarterly corpus review with the HR policy committee. Once a quarter, the policy committee reviews the corpus against current policy. Outdated documents are formally removed. New policies are added. Changed policies are updated. The review meeting is on the calendar permanently — it doesn't get cancelled. Without it, the corpus rots within eighteen months. Outdated policies start surfacing in answers. Employees notice. Trust drops. The eight quarterly meetings per year are the cheapest insurance policy you'll buy. Defend them.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The hidden value — what HR learns from the agent',
      iconKey: 'lightbulb',
      eyebrow: 'Lesson 3 · The feedback loop',
      bodyHtml: `<p>The biggest hidden benefit of HR policy Q&A isn’t the time saved. It’s what HR learns from the questions employees ask. Three insights that come for free.</p>`,
      narrationLead:
        "The biggest hidden benefit of HR policy Q and A isn't the time HR saves. It is what HR learns from the questions employees ask. Three insights that come for free, every week, once the system is running. Use them.",
      steps: [
        {
          html: stepCard('lightbulb', 'amber', 'Insight 1 — Where policy is ambiguous',
            "When the agent escalates because it can't find an answer, the question itself is the signal. Three repeated escalations on the same topic mean the policy is ambiguous — and your team has been quietly working around the ambiguity. Clarify the policy."),
          narration:
            "Insight one. Where policy is ambiguous. When the agent escalates because it can't find a clear answer in the corpus, the question itself is the signal. Three repeated escalations on the same topic — say, the boundary between business and personal travel expenses — mean the policy is ambiguous. And your team has been quietly working around that ambiguity for who knows how long. Clarify the policy. Update the corpus. The hundred employees who would have asked that question this year now get a clean answer.",
        },
        {
          html: stepCard('lightbulb', 'blue', 'Insight 2 — Which teams need extra HR attention',
            "Question volume by team tells you where the team's HR knowledge is thin. Often a new manager. Often a team that grew fast. Often a remote team. Send targeted training — informed by data, not by complaint."),
          narration:
            "Insight two. Which teams need extra HR attention. Question volume by team tells you where the team's HR knowledge is thin. Often a new manager who hasn't yet learned to point their team to the right policy. Often a team that grew fast through hiring. Often a remote team that didn't get the same in-person onboarding. Send targeted training — informed by the data from the agent, not by complaint volume. Proactive HR support, calibrated to real signal. This is genuinely new capability for most HR teams.",
        },
        {
          html: stepCard('lightbulb', 'green', 'Insight 3 — Where new policy is needed',
            "Repeated questions on topics your policy doesn't yet cover — flexible work, AI use, side projects, cross-border arrangements — tell you what policy you need to write next. Don't ignore the demand signal."),
          narration:
            "Insight three. Where new policy is needed. Repeated questions on topics your policy doesn't yet cover — flexible work arrangements, employee use of AI tools, side projects and moonlighting, cross-border remote work — tell you what new policy you need to write next. The agent surfaces the demand signal that previously took focus groups and surveys to discover. Don't ignore that signal. Write the policy. Update the corpus. The agent immediately starts answering the next hundred employees who ask.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 5 — L&D personalisation.</p>`,
      narrationLead:
        "Three anchors before chapter five — learning and development personalisation.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Build the corpus by category',
            "Benefits first. Then time and leave. Then conduct and process. Two-week sprints per category. The team learns. The agent improves. Pacing matters."),
          narration:
            "One. Build the corpus by category. Benefits first. Then time and leave. Then conduct and process. Two-week sprints per category. The team learns the pattern category by category. The agent improves category by category. Don't try to build one giant corpus all at once.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three corpus rules, non-negotiable',
            "Only approved-policy documents · citation on every answer · quarterly review with the policy committee. The corpus is the trust model. Lock it down."),
          narration:
            "Two. Three corpus rules, all non-negotiable. Only approved-policy documents in the corpus. Citation on every answer — if the agent can't cite, it escalates. Quarterly review with the HR policy committee. The corpus is the trust model. Lock it down. Defend the rules against the inevitable pressure to relax them.",
        },
        {
          html: stepCard('check', 'green', 'Three — Use the agent\'s questions to improve HR',
            "Where policy is ambiguous. Which teams need attention. Where new policy is needed. Three insights that come free, weekly. Most HR teams ignore the signal. Don't be one of them."),
          narration:
            "Three. Use the agent's escalations and question patterns to improve HR. Where policy is ambiguous and needs clarifying. Which teams need extra HR attention based on question volume. Where new policy is needed based on questions the corpus doesn't yet answer. Three insights that come free, every week, once the system is running. Most HR teams ignore the signal. Don't be one of them. The signal is the second-order value of the play.",
        },
      ],
      narrationTrail:
        "Chapter five — L and D personalisation. Where AI helps people learn what they actually need. See you there.",
    },
  ],
}
