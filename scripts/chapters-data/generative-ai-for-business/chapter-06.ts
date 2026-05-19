import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const genAiBizChapter06: Chapter = {
  courseId: 'generative-ai-for-business',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-adoption-playbook',
  title: 'The adoption playbook',
  subtitle: 'How to take a pilot from week 4 to durable team behaviour in 90 days.',
  slides: [
    // SLIDE 1
    {
      title: 'The adoption playbook',
      iconKey: 'rocket',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">The pilot ended at week 4 with a Yes. Now what? Most teams declare victory and quietly let the tool drift back into license-drawer territory. This chapter is how to prevent that — and lock in the team behaviour change that makes the investment compound.</p>`,
      narrationLead:
        "Welcome to chapter six. The adoption playbook. The pilot ended at week four with a Yes decision. Scale to the whole team. Now what? Most teams at this point declare victory, send the announcement email, and quietly let the tool drift back into license-drawer territory within six months. This chapter is how to prevent that — and lock in the team behaviour change that makes the investment compound rather than evaporate.",
    },
    // SLIDE 2
    {
      title: 'The three adoption disciplines',
      iconKey: 'shield',
      eyebrow: 'Lesson 1 · Disciplines',
      bodyHtml: `<p>Three disciplines that take adoption from 30% to 70%+. Each one is cheap. Each one is underused. All three matter.</p>`,
      narrationLead:
        "Three disciplines that take adoption from the typical thirty percent to seventy percent or higher. Each one is cheap to implement. Each one is underused in most teams. All three matter — leaving any one out reduces effectiveness sharply.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Discipline 1 — Persona-based prompt libraries',
            "Different team members do different work. Generic prompts don't help any of them. Build 5–10 named prompts per role — saved, shared, named after the work they do. The librarian role usually doesn't need to be senior. The role does need to exist."),
          narration:
            "Discipline one. Persona-based prompt libraries. Different team members do different work. A generic shared prompt library doesn't help any of them — because they have to translate it into their context every time. Build five to ten named prompts per role — saved, shared, named after the actual work they do. The librarian role on your team — whoever maintains the prompts — usually doesn't need to be senior. They do need to be motivated. The role does need to exist as a defined responsibility. Without it, the libraries drift and adoption decays.",
        },
        {
          html: stepCard('shield', 'blue', 'Discipline 2 — Weekly office hours',
            "30 minutes a week. The team brings real use cases. You — or a champion — helps them work through the prompting in real time. Not a training. A working session. Three months of this and most teams cross 60% adoption naturally."),
          narration:
            "Discipline two. Weekly office hours. Thirty minutes a week. The team brings real use cases — emails they need to draft, tickets they need to summarise, data they need to extract. You or a designated champion helps them work through the prompting in real time. This is not a training. It's a working session. Three months of weekly office hours and most teams cross sixty percent adoption naturally — because they've seen the tool work on their specific problems, with their specific data. The cost is two hours of senior time a month. The benefit compounds for years.",
        },
        {
          html: stepCard('shield', 'amber', 'Discipline 3 — Weekly usage dashboard, visible to the team',
            "Per-person usage, anonymised at the team level, posted publicly. Teams self-correct. The team member at the bottom of the chart asks for help. The team member at the top shares prompts. Behaviour shifts without management intervention."),
          narration:
            "Discipline three. Weekly usage dashboard, visible to the team. Per-person usage, anonymised at the team level but posted publicly inside the team. Teams genuinely self-correct when they see this. The team member at the bottom of the usage chart asks for help. The team member at the top shares prompts. Behaviour shifts without management intervention. The discipline is light-touch but powerful. Just make sure the comparison is internal-only — not across departments — to avoid unintended competition between teams that do very different work.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'All three or none',
        "These three disciplines are most effective together. Library without office hours — prompts get stale. Office hours without dashboard — usage stagnates between sessions. Dashboard without library — pressure without support. Implement all three at once. The combined effect is what shifts adoption."),
      calloutNarration:
        "These three disciplines work most effectively together. Library without office hours — the prompts get stale because nobody updates them based on real usage. Office hours without dashboard — usage stagnates between sessions because nobody is tracking the cadence. Dashboard without library — pressure to use the tool without the support to use it well. Implement all three at once. The combined effect on adoption is significantly larger than the sum of the three individually. Don't pick one. Run all three from week one of the rollout.",
    },
    // SLIDE 3
    {
      title: 'The role of the champion — and how to pick one',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Champions',
      bodyHtml: `<p>Every team that hits 70%+ adoption has a champion. The role isn’t titled. The role doesn’t need budget. The role does need to be named — and protected.</p>`,
      narrationLead:
        "Every team I've watched hit seventy percent or higher adoption has a champion. The role isn't titled in the org chart. The role doesn't need its own budget line. But the role does need to be named — and the person in the role needs to be protected from being overloaded. Let me describe what to look for.",
      steps: [
        {
          html: stepCard('users', 'green', 'Who they are',
            "Someone the team already trusts — not necessarily senior. Curious about AI but not breathless about it. Generous with time. Often the team's unofficial problem-solver already. You don't appoint a champion — you recognise the one your team already has."),
          narration:
            "Who they are. Someone the team already trusts as a peer. Not necessarily senior — often a mid-level individual contributor. Curious about AI but not breathless about it. Generous with their time helping others. They are typically your team's unofficial problem-solver already. You don't appoint a champion through a job posting. You recognise the one your team already has — and you give them official permission to spend twenty percent of their week on the role.",
        },
        {
          html: stepCard('users', 'blue', 'What they do',
            "Maintain the prompt library. Lead the weekly office hours. Field the random questions that come up between sessions. Surface what's working — and what isn't — to you, weekly. The connective tissue of the adoption effort."),
          narration:
            "What they do. They maintain the prompt library. They lead the weekly office hours. They field the random questions that come up between sessions. And critically — they surface what's working and what isn't to you, the manager, on a weekly basis. They are the connective tissue of the adoption effort. Without them, the disciplines from the previous slide don't run themselves. With them, the disciplines run almost automatically. Invest in this person.",
        },
        {
          html: stepCard('users', 'amber', 'What they need from you',
            "20% of their week officially. Recognition publicly — at the next team meeting, in the next round of reviews. A small budget for tooling and conferences. Protection from being assigned to other initiatives that compete for their time. Treat the role like it matters — because it does."),
          narration:
            "What the champion needs from you, the manager. Twenty percent of their week officially — not informally, not in addition to a full workload. Public recognition at the next team meeting and in the next round of reviews. A small discretionary budget for tooling, training, and conferences — five to ten thousand dollars annually is usually enough. And protection from being assigned to other competing initiatives that would soak up their twenty percent. Treat the role like it matters — because it does. Champions burn out when their time is treated as a free resource. Treat it as a budgeted one.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'When adoption stalls — three diagnostic questions',
      iconKey: 'search',
      eyebrow: 'Lesson 3 · Diagnostics',
      bodyHtml: `<p>If adoption is below 40% at month three — something is off. Three diagnostic questions to identify what.</p>`,
      narrationLead:
        "If adoption is below forty percent at month three, something is off. Don't push harder on what isn't working. Diagnose first. Three diagnostic questions to identify what specifically is going wrong.",
      steps: [
        {
          html: stepCard('search', 'blue', '1 · Is the use case still right?',
            "Ask three team members directly — does this tool fit your work? If they hesitate or qualify the answer, the use case is wrong. Switch to a different use case rather than pushing harder on the wrong one."),
          narration:
            "Question one. Is the use case still right for your team? Ask three team members directly — in private — does this tool fit your actual work. If they hesitate or qualify the answer with we could use it for some things, the use case is wrong. Switch to a different use case based on what they actually do. Pushing harder on the wrong use case is the most common adoption failure pattern. Resist the urge to push. Diagnose instead.",
        },
        {
          html: stepCard('search', 'amber', '2 · Is the quality threshold being met?',
            "If the team experiences too many bad outputs early, they stop trusting the tool — even when it's working. Re-tune the prompts or escalate to the vendor. Get quality above 95% before pushing usage further."),
          narration:
            "Question two. Is the quality threshold being met consistently? If the team experiences too many bad outputs in the first few weeks, they stop trusting the tool — even when it eventually starts working better. Trust, once lost, is slow to rebuild. So re-tune the prompts. Escalate to the vendor if needed. Get the quality above ninety-five percent before pushing the team to use the tool more. Pushing usage of a low-quality tool is the second most common adoption failure pattern. Get the quality right first.",
        },
        {
          html: stepCard('search', 'red', '3 · Is the team protected from punishment for using the tool?',
            "If the team thinks using AI signals weakness — or worse, that the AI output will be blamed on them — they'll quietly stop. Make the safe space explicit and managed. The cultural signal matters more than the technical one."),
          narration:
            "Question three. Is the team protected from punishment for using the tool? This sounds dramatic — but it's the underappreciated diagnostic. If team members think that using AI signals weakness to senior colleagues — that real professionals don't need it — they will quietly stop using it in public. Or worse — if they think that AI-generated output will be specifically blamed on them when it's wrong, with no team-level responsibility shared, they stop using it for anything significant. Make the safe space explicit. Manage it consistently. The cultural signal matters more than the technical one. Teams that feel safe using AI use AI. Teams that don't, don't.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 7 — measuring success in steady state.</p>`,
      narrationLead:
        "Three anchors before we move to measuring success in steady state in chapter seven.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three adoption disciplines, all together',
            "Persona prompt libraries · weekly office hours · weekly usage dashboard. All three at once. The combined effect is the lift."),
          narration:
            "One. Three adoption disciplines. Persona-based prompt libraries. Weekly office hours. Weekly usage dashboard visible to the team. Implement all three from week one of the rollout. The combined effect is what lifts adoption from thirty percent to seventy percent. Skipping any one reduces the lift sharply.",
        },
        {
          html: stepCard('check', 'green', 'Two — Find the champion you already have',
            "Don't appoint — recognise. Give them 20% of their week officially, recognition publicly, and a small budget. Protect them. The role pays back for years."),
          narration:
            "Two. Find the champion your team already has. Don't appoint one through a posting. Recognise the person already doing informal versions of the role. Give them twenty percent of their week officially. Recognition at team meetings and in reviews. A small discretionary budget. And protection from being overloaded with competing assignments. The role pays back for years when treated seriously.",
        },
        {
          html: stepCard('check', 'green', 'Three — Diagnose stalls, don\'t push',
            "Below 40% at month 3 — wrong use case, quality issue, or cultural barrier. Diagnose all three. Don't push harder on what isn't working — switch what isn't right."),
          narration:
            "Three. Diagnose adoption stalls, don't push harder. Below forty percent at month three means something specific is off — wrong use case, quality issue, or cultural barrier to using AI publicly. Diagnose all three honestly. Don't push harder on what isn't working. Switch what isn't right. Pushing the wrong direction is what makes adoption efforts permanently fail rather than recover.",
        },
      ],
      narrationTrail:
        "Chapter seven — measuring success in steady state. The metrics that survive once the pilot is over. See you there.",
    },
  ],
}
