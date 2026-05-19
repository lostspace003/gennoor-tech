import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForHrChapter02: Chapter = {
  courseId: 'ai-for-hr-people-teams',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-recruiting-ai',
  title: 'Recruiting AI — done responsibly',
  subtitle: 'Where AI helps recruiting work better — and the bias-trap discipline that keeps it defensible.',
  slides: [
    // SLIDE 1
    {
      title: 'Recruiting AI — done responsibly',
      iconKey: 'shield',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">Recruiting AI is the highest-stakes HR AI play. Done well — it gets the right candidates in front of hiring managers faster, with less bias than the manual process it replaces. Done badly — it’s the news story that ends a year of HR work.</p>`,
      narrationLead:
        "Welcome to chapter two. Recruiting AI — done responsibly. This is the highest-stakes HR AI play. Done well, it gets the right candidates in front of hiring managers faster — and often with less bias than the manual screening process it replaces. Done badly, it's the news story that ends a year of HR work and triggers a regulator letter. The difference is the discipline. In the next few minutes, where AI genuinely helps recruiting, what to deliberately not let AI do, and the bias-monitoring framework that makes the deployment defensible.",
    },
    // SLIDE 2
    {
      title: 'Three places where AI helps recruiting',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · The plays',
      bodyHtml: `<p>Three uses that consistently help recruiting work better. Each one is defensible. Each one needs the monitoring framework underneath.</p>`,
      narrationLead:
        "Three places where AI genuinely helps recruiting work better. Each one is defensible to regulators and to candidates. Each one needs the monitoring framework underneath — which we'll get to in the next lesson.",
      steps: [
        {
          html: stepCard('check', 'green', 'Help 1 — Sourcing reach and language',
            "AI helps recruiters reach more relevant candidates — by drafting outreach in plain, inclusive language and by surfacing candidates in adjacent profiles a recruiter might miss. The recruiter still decides who to contact."),
          narration:
            "Help one. Sourcing reach and language. AI helps recruiters reach more relevant candidates. By drafting outreach messages in plain, inclusive language — avoiding gendered or culturally narrow phrasing that subtly screens out qualified applicants. By surfacing candidates in adjacent professional profiles that the recruiter might miss in a manual search. The recruiter still decides who to contact. The AI broadens the pool — the human still chooses from it.",
        },
        {
          html: stepCard('check', 'blue', 'Help 2 — Resume screening (with strict guardrails)',
            "AI ranks resumes against the job description — but only against criteria the hiring manager explicitly approved. Sensitive attributes (name, gender, age, photo, address) are removed before ranking. Top 20% goes to human review; nothing is auto-rejected at scale."),
          narration:
            "Help two. Resume screening — with strict guardrails. AI ranks resumes against the job description, but only against criteria the hiring manager explicitly approved at intake. Sensitive attributes are removed before ranking — name, gender, age, photo, address, university affiliations that signal demographics. The top twenty percent of the ranked pool goes to human review. And critically — nothing is auto-rejected at scale. Auto-rejection is where most recruiting AI incidents originate. The AI ranks. Humans choose. That's the line.",
        },
        {
          html: stepCard('check', 'amber', 'Help 3 — Interview scheduling and logistics',
            "The boring, valuable use. AI handles the calendar coordination, the reminders, the rescheduling. Frees recruiters for the parts that actually need human warmth. Almost no bias risk — and significant time savings."),
          narration:
            "Help three. Interview scheduling and logistics. The boring, valuable use of AI in recruiting. AI handles the calendar coordination across multiple interviewers. The reminders to candidates and panel members. The rescheduling when something inevitably moves. This frees recruiters for the parts of their job that actually need human warmth — the relationship building with candidates, the post-interview debriefs with hiring managers. Almost no bias risk in this use. And significant time savings. Don't underestimate the impact of getting recruiters out of calendar Tetris.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Three explicit non-uses',
        "Don't let AI auto-reject candidates at scale. Don't let AI assess “culture fit” without human override on every case. Don't let AI assign interviewer ratings — humans rate, humans decide. Three lines that protect everyone."),
      calloutNarration:
        "Three explicit non-uses to write into your policy. Don't let AI auto-reject candidates at scale — auto-rejection is where most documented recruiting AI bias incidents originate. Don't let AI assess culture fit without human override on every single case — culture-fit AI has produced some of the most discriminatory outputs in the entire field. And don't let AI assign interviewer ratings or rankings — humans rate, humans decide. Three lines. Write them into the HR policy alongside the deployment. Defend them when vendors push. The discipline is what makes the deployment survive scrutiny.",
    },
    // SLIDE 3
    {
      title: 'The bias-monitoring framework — non-negotiable',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · Monitoring',
      bodyHtml: `<p>Four monitoring components. None optional. Together they form the framework that makes recruiting AI defensible — to regulators, to candidates, and to the next news cycle.</p>`,
      narrationLead:
        "Four monitoring components. None of them is optional in any responsible recruiting AI deployment. Together they form the framework that makes the deployment defensible to regulators, to candidates, and to the next news cycle. Implement all four from day one — not as a retrofit later.",
      steps: [
        {
          html: stepCard('shield', 'blue', '1 · Outcome monitoring by protected group',
            "Track the funnel — application, shortlist, interview, offer, hire — by protected and proxy attributes (gender, age band, nationality where lawful). Disparities trigger investigation, not silent acceptance. Reviewed monthly with HR business partners."),
          narration:
            "Component one. Outcome monitoring by protected group. Track the recruitment funnel — application, shortlist, interview, offer, hire — broken down by protected and proxy attributes. Gender. Age band. Nationality where lawful to track. Disparities at any funnel stage trigger investigation — not silent acceptance. Reviewed monthly with HR business partners. This is the basic infrastructure. And the regulator's first question. Have it operational before going live.",
        },
        {
          html: stepCard('shield', 'amber', '2 · Pre-deployment audit by an independent team',
            "Before the AI goes live, an independent team — internal audit or external — tests the system for bias against a held-out evaluation set. Findings documented. Issues remediated. The audit report goes in the HR governance file. Required in NYC. Becoming standard elsewhere."),
          narration:
            "Component two. Pre-deployment audit by an independent team. Before the recruiting AI goes live, an independent team — internal audit, external consultancy, or a regulator-approved auditor — tests the system for bias against a held-out evaluation set. Findings documented. Issues remediated before deployment. The audit report goes into the HR governance file. This is now required by law in New York City. Becoming standard expectation elsewhere — the EU AI Act, parts of the GCC. Do it whether or not your jurisdiction currently requires it.",
        },
        {
          html: stepCard('shield', 'red', '3 · Candidate notification and recourse',
            "Candidates are told AI is part of the screening process. They have a right to request human review of any AI-influenced decision. The notification language is reviewed by legal. The recourse pathway is tested before launch."),
          narration:
            "Component three. Candidate notification and recourse. Candidates are told, in plain language, that AI is part of the screening process. They have a clear right to request human review of any AI-influenced decision about their candidacy. The notification language is reviewed by your legal team — not by the vendor. The recourse pathway is tested before launch — meaning somebody actually requests human review and sees how the process works end to end. Don't deploy a recourse path you haven't tested.",
        },
        {
          html: stepCard('shield', 'green', '4 · Quarterly review with the works council / employee reps',
            "Once a quarter, the outcomes data goes to the works council or employee representatives. They ask questions. You answer. Findings inform the next quarter's tuning. The relationship is the safeguard — not an annual surprise."),
          narration:
            "Component four. Quarterly review with the works council or equivalent employee representatives. Once a quarter, the funnel outcomes data goes to the representatives. They ask questions. You answer. Findings inform the next quarter's tuning of the system. The relationship — built quarter by quarter — is the safeguard. Not an annual surprise meeting where the data has piled up and everybody is defensive. Build the rhythm. The recruiting AI deployment becomes calmer. So does the rest of the HR AI portfolio.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'When something goes wrong — the response',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Response',
      bodyHtml: `<p>Something will go wrong eventually. A candidate will complain. A pattern will surface. The response — practised in advance — determines whether it becomes an incident or a footnote.</p>`,
      narrationLead:
        "Something will go wrong with the recruiting AI eventually. A candidate will complain. A pattern will surface in the monitoring. A journalist will analyse a sample. The response — practised in advance, not invented in the moment — determines whether the event becomes an incident or a footnote. Three steps.",
      steps: [
        {
          html: stepCard('alertTriangle', 'amber', 'Step 1 — Acknowledge fast and stop the bleeding',
            "Within 24 hours, acknowledge the issue internally and pause the affected use of AI. Don't continue producing more cases while investigating. The pause is uncomfortable. It is also the right thing to do."),
          narration:
            "Step one. Acknowledge fast and stop the bleeding. Within twenty-four hours of becoming aware of the issue, acknowledge it internally and pause the affected use of the recruiting AI. Don't continue producing more cases while you investigate. The pause is uncomfortable — recruiting teams need to operate. It is also the right thing to do. And it is the action that, in retrospect, looks responsible rather than negligent. Practice this step in a tabletop exercise once a year so it's familiar when it's needed.",
        },
        {
          html: stepCard('check', 'blue', 'Step 2 — Investigate independently, document honestly',
            "Internal audit or an independent team investigates. The investigation isn't run by the team that owns the AI — independence is the discipline. The findings are documented honestly, including the parts that are uncomfortable."),
          narration:
            "Step two. Investigate independently. Document honestly. The investigation is run by internal audit or an equivalent independent team — not by the recruiting team that owns the AI. Independence is the discipline that gives the findings credibility. The findings are documented honestly, including the parts that are uncomfortable for the team. The honest internal record is what protects you in any external review. The sanitised internal record is what looks worst, later. Be honest internally.",
        },
        {
          html: stepCard('shield', 'green', 'Step 3 — Communicate proportionately, fix the root cause, brief representatives',
            "Tell affected candidates. Brief the works council. Fix the root cause — not just the symptom. If material, brief the regulator before they hear from someone else. Then resume — with the new safeguards visible."),
          narration:
            "Step three. Communicate proportionately. Fix the root cause. Brief representatives. Tell affected candidates what happened and what you're doing about it. Brief the works council in detail. Fix the root cause — not just the immediate symptom. If the issue is material — affecting a significant number of candidates or a clearly protected group — brief the regulator before they hear from someone else. Then resume the AI deployment, with the new safeguards visible to everyone. The response is the test. The teams that pass it grow more credible. The teams that fail it lose the next budget cycle, the next hiring season, and sometimes the head of HR.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 3 — onboarding copilots.</p>`,
      narrationLead:
        "Three anchors before chapter three — onboarding copilots.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three helps, three non-uses',
            "Help with sourcing, screening (with guardrails), and scheduling. Don't auto-reject, don't assess culture fit, don't rate interviewers. Write the lines into policy."),
          narration:
            "One. Three helps and three non-uses. AI helps with sourcing language. With resume screening behind strict guardrails. With interview scheduling. AI doesn't auto-reject candidates at scale. Doesn't assess culture fit without human override. Doesn't assign ratings or rankings. Write those non-uses into the HR policy. Defend them.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four monitoring components, all non-negotiable',
            "Outcome monitoring · pre-deployment audit · candidate notification + recourse · quarterly review with reps. All four. From day one. The framework that protects everyone."),
          narration:
            "Two. Four monitoring components. Outcome monitoring by protected group, reviewed monthly. Pre-deployment audit by an independent team. Candidate notification and a tested recourse path. Quarterly review with works council or employee representatives. All four. From day one. The framework is what protects everyone — candidates, the firm, the regulator relationship, and HR itself.",
        },
        {
          html: stepCard('check', 'green', 'Three — Practice the incident response in a tabletop',
            "Acknowledge fast · investigate independently · communicate, fix root cause, brief reps. Practise it before you need it. Calm in the actual incident is what credibility looks like."),
          narration:
            "Three. Practise the incident response in a tabletop exercise — at least once a year. Acknowledge fast. Investigate independently. Communicate, fix the root cause, brief representatives. Calm execution during the actual incident is what credibility looks like. And calm execution is what comes from practice. Don't try to invent the response on the day it's needed.",
        },
      ],
      narrationTrail:
        "Chapter three — onboarding copilots. The play where HR gets the first thirty days back. See you there.",
    },
  ],
}
