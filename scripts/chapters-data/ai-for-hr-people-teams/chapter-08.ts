import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForHrChapter08: Chapter = {
  courseId: 'ai-for-hr-people-teams',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your HR AI roadmap on one page',
  subtitle: 'Seven chapters down. One page HR leadership can actually adopt at the next meeting.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your HR AI roadmap on one page',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In the previous seven chapters, we built an HR-leader view of AI. Now — one roadmap. One page. Something HR leadership can adopt at the next monthly meeting, defend at the board, and brief to the works council in the same form.</p>`,
      narrationLead:
        "Welcome to the final chapter. The capstone. In the previous seven chapters, we built an HR-leader view of AI. Now we collapse it. One roadmap. One page. Something HR leadership can adopt at the next monthly meeting. Defend at the board. And brief to the works council in the same form. Three audiences. One page. Here's what's on it.",
    },
    // SLIDE 2
    {
      title: 'The HR AI roadmap — one page',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The template',
      bodyHtml: `<p>Six sections. Each one specific enough to defend; concrete enough to act on.</p>`,
      narrationLead:
        "Six sections. Each one specific enough to defend. Each one concrete enough for HR leadership to act on. Use this template at your next monthly HR leadership meeting — you'll walk out with a signed roadmap if it's well-prepared.",
      steps: [
        {
          html: stepCard('compass', 'green', '1 · The play sequence over 18 months',
            "“Quarter 1: policy Q&A. Q2: onboarding copilots. Q3–Q4: L&D personalisation. Q5–Q6: recruiting AI with full bias-monitoring discipline.” Specific. Sequenced. Defensible."),
          narration:
            "Section one. The play sequence over eighteen months. Quarter one — policy Q and A and employee help. Quarter two — onboarding copilots. Quarters three and four — L and D personalisation. Quarters five and six — recruiting AI, with the full bias-monitoring discipline from chapter two. Specific. Sequenced. Defensible. This shape — eighteen months across four plays — is what most HR leadership teams should commit to. Faster sequences usually cut corners on bias monitoring. Slower sequences usually drift.",
        },
        {
          html: stepCard('compass', 'red', '2 · The three lines we don\'t cross',
            "No AI ratings. No AI stack ranking. No flight-risk prediction. Documented in the HR AI charter. Defended when vendors and internal pressure push."),
          narration:
            "Section two. The three lines we don't cross. No AI-generated performance ratings. No AI-driven stack ranking. No flight-risk prediction of who will quit. Documented in the HR AI charter. Defended when vendors push, when peer firms announce deployments, when the CFO presses for more productivity. The lines are the lines. Naming them on the roadmap signals discipline.",
        },
        {
          html: stepCard('compass', 'amber', '3 · The bias monitoring framework — per system',
            "Outcome monitoring by group, monthly. Pre-deployment audit by independent party. Candidate or employee notification + recourse where applicable. Quarterly review with the works council or equivalent. Per system — not blanket."),
          narration:
            "Section three. The bias monitoring framework — per system. Outcome monitoring by protected group, reviewed monthly with HR business partners and DE and I. Pre-deployment audit by an independent party. Candidate or employee notification plus tested recourse path where applicable. Quarterly review with the works council or equivalent. Per system — not blanket. Different HR AI systems have different bias risks. Apply the framework specifically to each.",
        },
        {
          html: stepCard('compass', 'blue', '4 · The compliance posture',
            "Per-system DPIAs, kept current. Cross-border transfer grounded legally. Automated decision rights honoured. Sovereign deployment where required. Independent annual review. The artefact regulators and auditors will ask about."),
          narration:
            "Section four. The compliance posture. Per-system Data Protection Impact Assessments, kept current and reviewed annually. Cross-border data transfer grounded legally — through SCCs, BCRs, or sovereign deployment. Automated decision rights honoured with a tested human-review pathway. Independent annual review of the portfolio. This section is the artefact that regulators, internal auditors, and external auditors will ask about. Make it visible on the roadmap.",
        },
        {
          html: stepCard('compass', 'green', '5 · The works council / employee rep engagement',
            "Pre-design briefing for every new HR AI system. Quarterly post-launch review of outcomes and incidents. The relationship treated as a deliverable on the roadmap — not as a checkbox."),
          narration:
            "Section five. The works council and employee representative engagement. Pre-design briefing for every new HR AI system. Quarterly post-launch review of outcomes, incidents, and adjustments. The relationship treated as a deliverable on the roadmap — not as a compliance checkbox. This section is what most HR roadmaps omit. Adding it explicitly signals that HR leadership is treating the relationship as strategic, not as procedural. The signal matters.",
        },
        {
          html: stepCard('users', 'amber', '6 · The team and capability mix',
            "Hub: senior HR AI lead + governance specialist + DE&I partner. Spokes: one named owner per play. Partner: senior implementation partner for first 12 months. Recognition for the champion roles in each spoke."),
          narration:
            "Section six. The team and capability mix. The hub — a senior HR AI lead, a governance specialist, and a DE and I partner working closely with the AI deployments. The spokes — one named owner per play, sitting in the relevant HR function. Partner — a senior implementation partner for the first twelve months while internal capability builds. And recognition for the champion roles in each spoke, with twenty percent of their week officially allocated. The team behind the roadmap is visible on the page. That visibility matters for accountability.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Ratify it through HR leadership',
        "The one-pager becomes the HR AI charter — same gravity as the board AI charter. Ratified by HR leadership at a formal meeting. In the permanent file. Amended only by formal vote. The gravity is what protects it from drift across the eighteen-month horizon."),
      calloutNarration:
        "Ratify the one-pager through HR leadership. It becomes the HR AI charter — same gravity as the board AI governance charter we covered earlier. Formally ratified at an HR leadership meeting. In the permanent HR file. Amended only by formal vote at a future leadership meeting. The gravity is what protects the roadmap from drift across the eighteen-month horizon. And the gravity is what makes the works council, the audit committee, and the regulator take it seriously when they see it. Ratify it formally.",
    },
    // SLIDE 3
    {
      title: 'The three conversations to unlock in week one',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Conversations',
      bodyHtml: `<p>The roadmap exists to unlock three conversations. Each one on the calendar within the first month. Each one moves a decision or a relationship.</p>`,
      narrationLead:
        "The roadmap exists to unlock three conversations. Each one should be on the calendar within the first month of ratifying the roadmap. Each one moves a decision or a relationship.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — With the CHRO',
            "30-minute sign-off on the 18-month sequence + the three lines we don't cross. The CHRO carries the lines to peer CHROs at the next industry meeting — and they hold."),
          narration:
            "Conversation one. With the Chief Human Resources Officer. Thirty-minute sign-off on the eighteen-month play sequence and the three lines you will not cross. The CHRO carries the lines forward — to peer CHROs at industry meetings, to the CFO when vendors pitch, to the board when AI questions arise. The CHRO ratifying the lines is what makes them stick across pressure points throughout the eighteen months. Without that sign-off, the lines move whenever someone senior pushes. With it, they hold.",
        },
        {
          html: stepCard('users', 'amber', 'Conversation 2 — With the works council / employee reps',
            "60-minute briefing on the full roadmap. The plays. The lines. The bias monitoring. The compliance posture. The quarterly review cadence we're committing to. Surprised reps become opposition; consulted reps become partners."),
          narration:
            "Conversation two. With the works council or equivalent employee representatives. Sixty-minute briefing on the full roadmap. The plays you'll deploy and in what order. The three lines you won't cross. The bias monitoring framework. The compliance posture. The quarterly review cadence you're committing to. Surprised reps become opposition. Consulted reps become partners. This sixty-minute investment, done well, makes the entire eighteen-month plan dramatically easier to execute.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 3 — With the audit committee',
            "20-minute briefing — typically through the next quarterly audit committee meeting. Same one-pager. Plus the compliance posture in more detail. Boards remember this. Subsequent AI questions land into an established relationship."),
          narration:
            "Conversation three. With the audit committee. Typically through the next quarterly audit committee meeting — a twenty-minute slot. Same one-pager. Plus the compliance posture in slightly more detail than the other audiences need. Boards remember the briefing — and subsequent AI questions land into an established relationship rather than a cold conversation. The investment compounds. Particularly when the next HR AI incident at a peer firm hits the news and your board's first question is — what is our posture. You've already answered.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'What comes next — beyond this course',
      iconKey: 'rocket',
      eyebrow: 'Lesson 3 · Onward',
      bodyHtml: `<p>This course gave you the HR-leader view. Three suggestions for what to look at next — each one pairs with where you are in the roadmap.</p>`,
      narrationLead:
        "This course gave you the HR-leader view of AI. Three suggestions for what to look at next. Each one pairs with where you are in the roadmap.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', '1 · AI Governance & Risk for Boards',
            "If you present to a board or audit committee — which most CHROs do — the boards course extends the compliance and bias-monitoring chapters here into the full board-level playbook. Useful for the audit committee briefing."),
          narration:
            "One. If you present to a board or audit committee — which most Chief Human Resources Officers do — the AI Governance and Risk for Boards course extends the compliance and bias-monitoring chapters here into the full board-level playbook. The board pack template. The audit committee question framework. Useful preparation for the third conversation in this chapter's week-one set.",
        },
        {
          html: stepCard('bookOpen', 'amber', '2 · Generative AI for Business',
            "If your HR managers and L&D leads are themselves learning to use GenAI in their day-to-day work, the GenAI for Business course is the right place for them. The ROI conversation and adoption playbook chapters in particular travel directly."),
          narration:
            "Two. If your HR managers and L and D leads are themselves learning to use generative AI in their day-to-day work — drafting communications, summarising employee feedback, preparing for difficult conversations — the Generative AI for Business course is the right place for them. The ROI conversation chapter and the adoption playbook chapter in particular travel directly to HR teams. Worth recommending to your direct reports.",
        },
        {
          html: stepCard('bookOpen', 'green', '3 · A 30-minute scoping call',
            "If you're ready to convert this roadmap into a real eighteen-month programme — the most efficient next step is a thirty-minute call. We listen, ask three honest questions about your team and your representation landscape, and tell you whether we're the right partner."),
          narration:
            "Three. If you're ready to convert this roadmap into an actual eighteen-month programme — the most efficient next step is a thirty-minute call. We listen. We ask three honest questions about your HR team, your representation landscape, and your current AI maturity. And we tell you whether we are the right partner for your specific situation. Even when the answer is no — and sometimes it is — the candour saves you weeks of evaluating partners who aren't a fit. Take the call.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p class="lead">HR AI, done well, is invisible to most employees most of the time. They get clear answers to policy questions. They have warmer onboarding. They get learning that fits where they’re actually going. They never see the AI explicitly — they see HR caring about them more, with less friction. That is the product.</p>
      <p>The discipline is the work. The technology will keep moving. The disciplines stay.</p>
      <p>Thank you for spending the last hour with me.</p>`,
      narrationLead:
        "One final thought. HR AI, done well, is invisible to most employees most of the time. They get clear answers to policy questions, with citations they can verify. They have warmer onboarding because their new joiner experience was scaffolded by an agent that knew their role and location. They get learning recommendations that fit where they're actually going, not where their job title suggests they are. They never see the AI explicitly — they see HR caring about them more, with less friction. That is the product of HR AI done well. The discipline is the work. The technology will keep moving — and faster, not slower, over the next three years. The disciplines stay. Thank you for spending the last hour with me. Now go ratify the roadmap. And brief the works council in week one.",
    },
    // SLIDE 6
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'check',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>Three things to carry out of the whole course — into your next HR leadership meeting.</p>`,
      narrationLead:
        "Three things to carry out of the whole course. Into your next HR leadership meeting.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Sequence four plays over 18 months',
            "Policy Q&A → onboarding → L&D → recruiting. Build capability and credibility in the right order. Recruiting earns the right to be deployed."),
          narration:
            "One. Sequence four plays over eighteen months. Policy Q and A. Onboarding copilots. L and D personalisation. Recruiting AI with the full bias-monitoring discipline. Build capability and credibility in the right order. Recruiting earns the right to be deployed — it isn't the starting point.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three lines, defended consistently',
            "No AI ratings. No AI stack ranking. No flight-risk prediction. Ratified in the charter. Defended when vendors and internal pressure push."),
          narration:
            "Two. Three lines, defended consistently. No AI-generated performance ratings. No AI-driven stack ranking. No flight-risk prediction. Ratified in the HR AI charter. Defended when vendors push, when peer firms announce, when internal pressure mounts. The lines are the lines. Discipline is what makes them hold.",
        },
        {
          html: stepCard('check', 'green', 'Three — Works council early, substantive, quarterly',
            "Bring representatives in at design time. Share substance — not summaries. Quarterly review post-launch. The relationship is the safeguard. Build it deliberately."),
          narration:
            "Three. Works council early, substantive, quarterly. Bring representatives in at design time — not at launch. Share the actual substance — not high-level summaries. Quarterly review post-launch. The relationship is the safeguard for the entire HR AI portfolio. Build it deliberately. The investment compounds across years.",
        },
      ],
      narrationTrail:
        "Thank you. Truly. Take the roadmap to HR leadership this week. We'll see you at the next decision point.",
    },
  ],
}
