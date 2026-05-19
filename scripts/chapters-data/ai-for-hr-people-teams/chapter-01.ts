import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForHrChapter01: Chapter = {
  courseId: 'ai-for-hr-people-teams',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-where-ai-fits-in-hr',
  title: 'Where AI fits in HR',
  subtitle: 'Four plays that respect people. One that doesn’t. And the bias-trap framing that decides which is which.',
  slides: [
    // SLIDE 1
    {
      title: 'Where AI fits in HR',
      iconKey: 'compass',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">This course is for HR leaders, L&D heads, and people operations leads. AI in HR is uniquely high-stakes — because every system touches people, careers, and trust. In the next few minutes, the four AI plays that work in HR — and the one that quietly destroys credibility.</p>`,
      narrationLead:
        "Welcome to the course. This is for HR leaders, learning and development heads, and people operations leads. AI in HR is uniquely high-stakes — because every system you deploy touches people. Their careers. Their compensation. Their sense of being treated fairly. In the next few minutes, the four AI plays that work in HR. The one that quietly destroys credibility. And the bias-trap framing that decides which is which. Let's begin.",
    },
    // SLIDE 2
    {
      title: 'The four HR AI plays — and the people lens on each',
      iconKey: 'users',
      eyebrow: 'Lesson 1 · The plays',
      bodyHtml: `<p>Four plays. Each one anchors a specific HR pain point. Each one has a different bias risk and a different conversation with works councils, employee representatives, or HR business partners.</p>`,
      narrationLead:
        "Four plays. Each one anchors a specific HR pain point. Each one has a different bias risk profile. And each one has a different conversation with works councils, employee representatives, or HR business partners. Get the right play in the right order — and HR is a leader in the AI conversation. Get the order wrong, and HR is firefighting bias complaints by month six.",
      steps: [
        {
          html: stepCard('bookOpen', 'green', 'Play 1 — Policy Q&A and employee help',
            "RAG over your HR policy corpus. Employees ask gifts, leave, benefits, expense questions; the agent answers with citations. Lowest bias risk because answers are grounded in published policy. The play to start with."),
          narration:
            "Play one. Policy Q and A and employee help. RAG — retrieval-augmented generation — over your HR policy corpus. Employees ask questions about gifts, leave, benefits, expense limits, parental policy. The agent answers grounded in your published policy, with citations to the exact clause. This play has the lowest bias risk of the four — because the answers come from your own policy, not from a model's training data or judgement. It's the play HR should start with. Highest value, lowest risk. Don't skip ahead of it.",
        },
        {
          html: stepCard('users', 'blue', 'Play 2 — Onboarding copilots',
            "Day-1-to-30 onboarding agent grounded on policies plus role-specific checklists. New joiners stop bombarding HR with the same questions. HR business partners get their first month back."),
          narration:
            "Play two. Onboarding copilots. A day-one to day-thirty onboarding agent grounded on your HR policies plus role-specific onboarding checklists. New joiners stop bombarding HR with the same questions in the first month. HR business partners get their first month back to focus on the actual onboarding conversations — culture, expectations, manager check-ins. This play has medium bias risk — primarily around how the agent communicates with diverse new joiners. Test it across demographics before scaling.",
        },
        {
          html: stepCard('bookOpen', 'amber', 'Play 3 — L&D personalisation',
            "Skill assessment, learning path generation, content recommendation based on the employee's actual role and gaps. The play that L&D teams reach for most enthusiastically. Higher bias risk because the model is inferring what each person should learn."),
          narration:
            "Play three. Learning and development personalisation. Skill assessment. Learning path generation. Content recommendation based on the employee's actual role and identified gaps. This is the play L&D teams reach for most enthusiastically — and rightly so, because the personalisation is genuinely useful. The bias risk is higher, though. The model is inferring what each person should learn — and inferences can encode patterns that disadvantage specific groups. Outcome monitoring by group matters here from day one. We'll come back to this in chapter five.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Play 4 — Recruiting AI',
            "Resume screening, interview scheduling, even interview question generation. Highest-stakes HR AI play. The bias risks are real, documented, and regulated. Approach with the most discipline — or risk a public incident."),
          narration:
            "Play four. Recruiting AI. Resume screening. Interview scheduling. Even interview question generation. This is the highest-stakes HR AI play. The bias risks are real, documented, and increasingly regulated. New York City has enforcement on it. The EU AI Act classifies most recruitment AI as high-risk. Approach this play with the most discipline — or risk a public incident. We dedicate the next chapter to it specifically. For now, recognise that recruiting AI is in its own risk category. Don't deploy it on the same operational rhythm as the other three.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Sequence the plays — start with policy Q&A',
        "Most HR teams should sequence — policy Q&A first, onboarding second, L&D third, recruiting fourth (and only with the full bias-monitoring discipline in place). The sequence builds capability and credibility in the right order."),
      calloutNarration:
        "Sequence the plays deliberately. Most HR teams should run policy Q and A first. Onboarding copilots second. L and D personalisation third. Recruiting AI fourth — and only with the full bias-monitoring discipline we'll cover in chapter two. The sequence builds operational capability and HR credibility in the right order. Teams that start with recruiting AI — because it's the most visible — often hit incidents in the first quarter that set back the whole HR AI agenda by a year. Don't be that team. Start with the lowest-risk play and earn the right to do the higher-risk ones.",
    },
    // SLIDE 3
    {
      title: 'The fifth pattern HR should refuse',
      iconKey: 'x',
      eyebrow: 'Lesson 2 · The refusal',
      bodyHtml: `<p>One specific HR AI pattern is being sold widely. HR should refuse it — politely, but clearly.</p>`,
      narrationLead:
        "One specific HR AI pattern is being sold widely right now. And HR should refuse it — politely, but clearly. Let me name it specifically, so you can recognise the pitch when it comes.",
      steps: [
        {
          html: stepCard('x', 'red', 'The pattern — AI-led performance evaluation',
            "AI systems that read manager feedback, peer feedback, performance data — and produce a recommended rating or ranking for each employee. The technology exists. The bias risks are severe. The legal exposure is real. Don't let this into your performance process."),
          narration:
            "The pattern is AI-led performance evaluation. AI systems that read manager feedback, peer feedback, performance data — and produce a recommended rating, or a ranking, for each employee. The technology exists. The vendor pitches sound compelling. The bias risks are severe — gender bias, age bias, name-and-accent bias have all been documented in production systems. The legal exposure is real in multiple jurisdictions. Don't let this pattern into your performance process. Politely refuse the pitch, every time. AI can help managers write better feedback. AI cannot fairly rate the people on a team. That stays human. Always.",
        },
        {
          html: stepCard('check', 'green', 'What to do instead',
            "AI to help managers write feedback faster and more clearly. AI to detect language patterns in feedback that may reflect bias — surfacing them for the manager to review. AI to identify themes across peer feedback. Human-authored ratings, with AI-assisted preparation. The line is the line."),
          narration:
            "What to do instead. AI to help managers write feedback faster and more clearly — drafting based on bullet points the manager provides. AI to detect language patterns in feedback that may reflect bias — surfacing them for the manager to review and adjust. AI to identify themes across peer feedback for the manager's reading. Then human-authored ratings, with AI-assisted preparation. The line is the line. AI supports the human's judgement on performance. AI doesn't replace it. The vendors who blur the line are the ones to politely decline. Specificity here protects everyone.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three traps that HR teams walk into',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Traps',
      bodyHtml: `<p>Three traps I see HR leaders fall into when deploying AI. Each one costs a quarter of recovery work. Recognise them in advance.</p>`,
      narrationLead:
        "Three traps I see HR leaders fall into when deploying AI. Each one costs a quarter of recovery work — sometimes more. Recognise them in advance.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Trap 1 — Treating AI as a productivity tool only',
            "AI in HR isn't just about HR's productivity. Every HR AI system touches employees — and therefore touches their experience of working at the firm. Treat the employee experience as a primary metric, not a side effect."),
          narration:
            "Trap one. Treating AI in HR as a productivity tool only. AI in HR isn't just about HR team productivity. Every HR AI system touches employees — and therefore touches their experience of working at the firm. An AI policy Q and A that gives confusing answers makes employees feel less supported. An onboarding copilot that doesn't understand a question makes new joiners feel less welcome. Treat the employee experience as a primary metric from day one — not as a side effect of the productivity gain.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 2 — Skipping the works council / employee rep conversation',
            "In Europe, the GCC, and other jurisdictions, formal employee representation has explicit rights to be consulted on workplace AI. Don't surprise them. Brief them early. Surprised reps become opposition; consulted reps become partners."),
          narration:
            "Trap two. Skipping the works council or employee representative conversation. In Europe, parts of the GCC, and an increasing number of other jurisdictions, formal employee representation has explicit legal rights to be consulted on workplace AI deployment. Don't surprise them with a launched system. Brief them early — at design time, not at launch. Surprised representatives become opposition that delays deployment by months. Consulted representatives often become partners who help refine the design. The conversation costs a few hours. The cost of skipping it is much higher.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 3 — Blanket bias monitoring rather than per-system',
            "Different HR AI systems have different bias risks. Generic bias monitoring across the HR AI portfolio misses the specific issues in each system. Monitor per-system. Same framework, applied carefully to each."),
          narration:
            "Trap three. Blanket bias monitoring rather than per-system bias monitoring. Different HR AI systems have different bias risks. The risks in your policy Q and A are different from the risks in your recruiting AI. Generic bias monitoring across the HR AI portfolio misses the specific issues in each system. Apply the same framework — outcome monitoring by group, counterfactual testing, override review — to each system specifically. The work is more rigorous. The findings are more actionable. The audit defence is stronger.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 2 — recruiting AI and the bias-trap framing in detail.</p>`,
      narrationLead:
        "Three anchors before we get into recruiting AI in detail in chapter two.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four plays, sequenced',
            "Policy Q&A → onboarding → L&D personalisation → recruiting. Build capability and credibility in the right order. Recruiting earns the right to be deployed."),
          narration:
            "One. Four plays, sequenced deliberately. Policy Q and A first. Onboarding copilots second. L and D personalisation third. Recruiting AI fourth — and only after the bias-monitoring discipline is genuinely in place. Build capability and credibility in the right order. Recruiting earns the right to be deployed; it isn't the starting point.",
        },
        {
          html: stepCard('check', 'green', 'Two — Refuse AI-led performance ratings',
            "AI helps the manager write feedback. AI doesn't rate the team. The line is the line. Vendors who blur it get a polite decline."),
          narration:
            "Two. Refuse AI-led performance ratings. AI helps the manager write feedback faster and better. AI doesn't rate the people on the team. The line is the line. Vendors who blur it — promising AI ratings, AI rankings, AI calibration — get a polite decline. Every time.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three traps to avoid',
            "Treating AI as productivity-only · skipping works council · blanket bias monitoring. Each one preventable by design. Don't discover them after deployment."),
          narration:
            "Three. Three traps to avoid. Treating AI as a productivity tool only — when it's actually an employee experience tool. Skipping the works council conversation. Applying blanket bias monitoring instead of per-system. Each one preventable by design. Don't discover any of them after deployment.",
        },
      ],
      narrationTrail:
        "Chapter two — recruiting AI. The highest-stakes HR AI play, with the bias-monitoring discipline that protects everyone. See you there.",
    },
  ],
}
