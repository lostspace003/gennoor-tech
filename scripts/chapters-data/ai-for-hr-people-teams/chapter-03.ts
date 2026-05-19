import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForHrChapter03: Chapter = {
  courseId: 'ai-for-hr-people-teams',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-onboarding-copilots',
  title: 'Onboarding copilots',
  subtitle: 'The play that gives HR the first 30 days back — without making new joiners feel processed.',
  slides: [
    // SLIDE 1
    {
      title: 'Onboarding copilots',
      iconKey: 'rocket',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">New joiners flood HR with policy questions for the first month. HR Business Partners become bottlenecks. The onboarding copilot pattern absorbs the routine 70% — without making the new joiner feel processed. In the next few minutes, what to build, how to keep it warm, and the metrics that protect employee experience.</p>`,
      narrationLead:
        "Welcome to chapter three. Onboarding copilots. New joiners flood HR with policy questions for the first thirty days. HR business partners become bottlenecks. The onboarding copilot pattern absorbs the routine seventy percent of those questions. The challenge is doing it without making the new joiner feel processed — like they're being handled by a system rather than welcomed by a team. In the next few minutes, what to build, how to keep it warm, and the metrics that protect employee experience while saving HR time.",
    },
    // SLIDE 2
    {
      title: 'The three components of a warm onboarding copilot',
      iconKey: 'users',
      eyebrow: 'Lesson 1 · The components',
      bodyHtml: `<p>Three components. Skip any one and the copilot feels cold — or stops working at the boundary of its scope.</p>`,
      narrationLead:
        "Three components in an onboarding copilot done well. Skip any one of them and the copilot either feels cold to new joiners, or breaks at the boundary of its scope. Both failures destroy adoption. Build all three from the start.",
      steps: [
        {
          html: stepCard('bookOpen', 'green', 'Component 1 — Policy + onboarding-task corpus',
            "All HR policies. The onboarding checklist by role. Benefits handbook. Code of conduct. The IT setup guide. The agent answers from this corpus, with citations. Locked down — same source-of-truth discipline as the policy Q&A play."),
          narration:
            "Component one. The policy plus onboarding-task corpus. All HR policies. The onboarding checklist by role and by location. Benefits handbook. Code of conduct. The IT setup guide for the first week. The agent answers from this corpus, with citations to the exact policy clause or checklist item. Locked down — same source-of-truth discipline as the policy Q and A play in the next chapter. The agent never answers from training data when the corpus is silent. It escalates.",
        },
        {
          html: stepCard('users', 'blue', 'Component 2 — Role and location awareness',
            "A new finance hire in Riyadh has different needs than a new sales hire in London. The copilot knows the role, the location, the start date, and the manager. Answers personalise to those four. Not generic broadcast — warm by being specific."),
          narration:
            "Component two. Role and location awareness. A new finance hire in Riyadh has different onboarding needs than a new sales hire in London. The copilot knows the role, the location, the start date, and the manager from the HR system. Answers personalise to those four facts. A question about expense policy returns the policy for the new joiner's specific country and role. A question about training mentions the role-specific learning path. The warmth comes from being specific to this person — not from emojis or breezy language. Specificity is the warmth.",
        },
        {
          html: stepCard('users', 'amber', 'Component 3 — Warm escalation to a named human',
            "When the agent can't answer — or when the new joiner asks something that needs judgement — escalation goes to a named human. Not “a member of the HR team will get back to you”. To “Sarah, your HR Business Partner, will get back to you by tomorrow”. The named human is what makes the copilot feel like part of HR — not a replacement for HR."),
          narration:
            "Component three. Warm escalation to a named human. When the agent can't answer — or when the new joiner asks something that needs judgement, like a question about flexible work arrangements or a sensitive personal matter — escalation goes to a named human. Not a generic — a member of the HR team will get back to you. To — Sarah, your HR Business Partner, will get back to you by tomorrow afternoon. The named human is what makes the copilot feel like part of HR. Not a replacement for HR. This single design choice is the difference between new joiners loving the copilot and quietly resenting it.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The “did this help?” signal',
        "After each interaction, the copilot asks — did this help? A simple thumbs up / thumbs down with optional comment. The signal trains the HR team on what's missing from the corpus. And it gives the new joiner a way to flag a bad experience without lodging a formal complaint."),
      calloutNarration:
        "Add this discipline. After each significant interaction, the copilot asks one simple question. Did this help? Thumbs up. Thumbs down. With an optional comment box. The signal trains the HR team weekly on what's missing from the corpus — what questions the corpus didn't answer well, what topics are confusing, what's drifted out of date. And the thumbs-down with a comment gives the new joiner a low-friction way to flag a bad experience without lodging a formal complaint. Most won't write a complaint. Most will tap a thumb. Capture the signal.",
    },
    // SLIDE 3
    {
      title: 'The first-30-days experience map',
      iconKey: 'calendar',
      eyebrow: 'Lesson 2 · The journey',
      bodyHtml: `<p>The copilot doesn’t replace the onboarding experience. It scaffolds it — with specific touchpoints over 30 days that build trust and reduce HR load.</p>`,
      narrationLead:
        "The onboarding copilot doesn't replace the onboarding experience your HR team has carefully designed. It scaffolds it — with specific touchpoints over thirty days that build trust with the new joiner and reduce load on HR business partners. Here's what the journey looks like.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Day 0 — Welcome before the first day',
            "Three days before start date, the copilot sends a personalised welcome. Manager name. First-day logistics. Three things to bring. A FAQ for anything they might ask before joining. The new joiner arrives feeling oriented — not anxious."),
          narration:
            "Day zero — three days before the start date. The copilot sends a personalised welcome message to the new joiner. Their manager's name. First-day logistics — where to go, when to arrive, what to expect. Three things to bring. A short FAQ for anything they might want to ask before joining. The new joiner arrives feeling oriented rather than anxious. This touchpoint, done well, predicts the entire first month's experience.",
        },
        {
          html: stepCard('calendar', 'blue', 'Days 1–7 — Available, not overwhelming',
            "The copilot is available for questions, but it doesn't push. The first week belongs to the manager and team. The copilot quietly handles policy questions when they come up — and only when they come up."),
          narration:
            "Days one through seven. The first week. The copilot is available for questions — but it doesn't push notifications or pop in. The first week belongs to the manager and the team. The copilot quietly handles policy questions when they come up — and only when they come up. The discipline of restraint matters. Over-engaging in the first week makes the copilot feel like a constant presence, which most new joiners find intrusive. Let the team build the relationship. The copilot supports — it doesn't compete.",
        },
        {
          html: stepCard('calendar', 'amber', 'Days 7–14 — Onboarding checklist nudges',
            "Mid-second-week, the copilot surfaces uncompleted onboarding tasks — IT setup, benefits enrolment, mandatory compliance training. One gentle nudge per task, then escalation if not done. The HR business partner doesn't have to chase manually."),
          narration:
            "Days seven through fourteen. Mid-second week. The copilot surfaces uncompleted onboarding tasks gently. IT setup. Benefits enrolment. Mandatory compliance training. Required documents that haven't been signed. One gentle nudge per task. Then escalation to the HR business partner if the task remains uncompleted after a defined window. The HR business partner doesn't have to chase manually. They handle exceptions. The system handles the routine.",
        },
        {
          html: stepCard('calendar', 'green', 'Days 14–30 — Manager and culture support',
            "Second half of the first month. The copilot answers questions about manager check-in cadence, culture norms, who-does-what across teams, where to find the small things — coffee, parking, the quiet rooms. The “invisible knowledge” that HR usually fields directly."),
          narration:
            "Days fourteen through thirty. The second half of the first month. The copilot answers questions about manager check-in cadence. Culture norms. Who does what across teams. And the invisible knowledge — where to find coffee, parking rules, the quiet rooms, who to ask about a particular project. This is the knowledge that HR usually fields directly, repeatedly, for every new joiner. The copilot absorbs the routine sixty to seventy percent of these questions. HR business partners focus on the genuinely individual conversations that need their judgement.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The metrics that protect employee experience',
      iconKey: 'target',
      eyebrow: 'Lesson 3 · Metrics',
      bodyHtml: `<p>Four metrics. Three are operational (HR’s view). One is experience-driven (the new joiner’s view). The fourth is the one most HR teams forget — and it’s the most important.</p>`,
      narrationLead:
        "Four metrics for the onboarding copilot. Three are operational — HR's view. One is experience-driven — the new joiner's view. The fourth is the one most HR teams forget. It is also the most important. Track all four.",
      steps: [
        {
          html: stepCard('target', 'blue', '1 · Adoption rate (operational)',
            "Percentage of new joiners who use the copilot in their first 30 days. Target — above 70% by week 2. Lower means new joiners aren't being told about the tool, or aren't seeing value when they try it."),
          narration:
            "Metric one. Adoption rate. Operational. Percentage of new joiners who use the copilot at least once in their first thirty days. Target — above seventy percent by week two of the first month. Lower numbers mean either new joiners aren't being told about the tool at first-day orientation, or they aren't seeing enough value when they try it once to come back. Both are diagnosable. Both are fixable.",
        },
        {
          html: stepCard('target', 'amber', '2 · HR time saved per new joiner (operational)',
            "Hours of HR business partner time saved per new joiner — calculated against the baseline before the copilot. Realistic target — 4–8 hours per new joiner. The number to defend to finance."),
          narration:
            "Metric two. HR time saved per new joiner. Operational. The hours of HR business partner time saved per new joiner — calculated honestly against the pre-copilot baseline. Realistic target — four to eight hours per new joiner. Multiplied by your monthly hiring volume, this is the number to defend to finance. It's also the number that funds the next HR AI initiative — if you defend it honestly and consistently.",
        },
        {
          html: stepCard('target', 'green', '3 · New joiner satisfaction at day 30 (experience)',
            "Anonymous survey at day 30 — did the copilot help, did it feel impersonal, did anything about it bother you. The qualitative answers are gold. Read them all, monthly."),
          narration:
            "Metric three. New joiner satisfaction at day thirty. Experience-driven. An anonymous survey at the end of the first month. Did the copilot help. Did it feel impersonal. Did anything about it bother you. Was it ever wrong in a way that affected you. The qualitative answers are gold for tuning the system. Read them all, monthly. Don't just look at the aggregate score — the individual comments tell you what the score is hiding.",
        },
        {
          html: stepCard('target', 'red', '4 · HR business partner satisfaction with the copilot',
            "The forgotten metric. Are your HR business partners glad the copilot exists — or quietly resentful? They're the ones the copilot most affects. Their buy-in determines whether the system thrives or quietly dies. Quarterly conversation. Take it seriously."),
          narration:
            "Metric four. HR business partner satisfaction with the copilot. The forgotten metric — and the most important. Are your HR business partners genuinely glad the copilot exists, because it frees them for higher-value work? Or are they quietly resentful, because it changed their role without consultation? They're the ones the copilot most affects. Their buy-in determines whether the system thrives or quietly dies through gentle non-cooperation. Have the quarterly conversation. Take it seriously. Adjust based on what they tell you. The HRBPs are not the obstacle — they are the partner.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'info', 'Watch the gap between metric 3 and metric 1',
        "If adoption is high (metric 1) but new joiner satisfaction is low (metric 3) — the copilot is being used because there's no alternative, not because it's good. That gap is a warning. Investigate."),
      calloutNarration:
        "Watch the gap between metric three and metric one. If adoption is high — most new joiners are using the copilot — but new joiner satisfaction is low, the copilot is being used because there's no alternative, not because it's good. That gap is a warning. It says the new joiner experience is being degraded while the operational metric looks fine. Investigate. Often the fix is making the warm escalation easier — so new joiners feel they can get to a human when they need to. The metric to optimise is satisfaction. Adoption is a means. Don't confuse them.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 4 — policy Q&A.</p>`,
      narrationLead:
        "Three anchors before chapter four — policy Q and A.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three components, including the named human',
            "Corpus · role and location awareness · warm escalation to a named human. The named human is what makes the copilot feel like part of HR — not a replacement."),
          narration:
            "One. Three components. The policy and onboarding-task corpus. Role and location awareness. Warm escalation to a named human. The named human is what makes the copilot feel like part of HR — not a replacement for HR. Don't skip the third component.",
        },
        {
          html: stepCard('check', 'green', 'Two — The 30-day journey, with restraint in week 1',
            "Day 0 welcome · week 1 available but not pushing · weeks 2–4 nudges + invisible knowledge. The restraint in week 1 is what makes the copilot feel welcome rather than overbearing."),
          narration:
            "Two. The thirty-day journey, with restraint in week one. Day zero personalised welcome. Week one available but not pushing notifications. Weeks two through four nudges on uncompleted tasks plus the invisible knowledge. The restraint in week one is what makes the copilot feel welcoming rather than overbearing. Get the rhythm right.",
        },
        {
          html: stepCard('check', 'green', 'Three — Four metrics, including HRBP satisfaction',
            "Adoption · time saved · new joiner satisfaction · HRBP satisfaction. The fourth is the forgotten one. Track all four. Watch the gap between adoption and satisfaction."),
          narration:
            "Three. Four metrics. Adoption rate. HR time saved per new joiner. New joiner satisfaction at day thirty. HR business partner satisfaction with the copilot. The fourth is the most forgotten and the most important. Track all four. Watch the gap between metric one and metric three — that gap is the warning signal that you're sacrificing experience for operations.",
        },
      ],
      narrationTrail:
        "Chapter four — policy Q and A. The play with the lowest bias risk and the highest immediate value. See you there.",
    },
  ],
}
