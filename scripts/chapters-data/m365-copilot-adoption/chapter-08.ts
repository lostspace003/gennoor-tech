import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const m365CopilotChapter08: Chapter = {
  courseId: 'm365-copilot-adoption',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your 90-day Copilot rollout plan',
  subtitle: 'Seven chapters down. One page for executive leadership this week.',
  slides: [
    {
      title: 'Capstone — Your 90-day Copilot rollout plan',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In the previous seven chapters, we built an IT and change-manager view of Microsoft 365 Copilot rollout. Now — one plan. 90 days. Specific enough to start Monday; concrete enough to defend to the executive sponsor next week.</p>`,
      narrationLead:
        "Welcome to the final chapter. The capstone. In the previous seven chapters, we built the IT and change-manager view of Microsoft 365 Copilot rollout. Now we collapse it. One plan. Ninety days. Specific enough to start on Monday. Concrete enough to defend to your executive sponsor in next week's meeting. Here's what's on it.",
    },
    {
      title: 'The 90-day plan — three phases',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The plan',
      bodyHtml: `<p>Three phases. 30 days each. Each phase produces a specific deliverable that funds the next phase.</p>`,
      narrationLead:
        "Three phases. Thirty days each. Each phase produces a specific deliverable that funds the next phase. Use this as the template for the executive sponsor conversation. Don't reinvent the structure; the structure is what makes the rollout work.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Days 1–30 — Persona work, pre-scale IT prep, pilot recruitment',
            "Define the persona mix. Recruit 20 pilot users across 3–4 functions. Start the 30-day IT preparation sprint (sensitivity labels, DLP, SharePoint audit). Brief the executive sponsor. By day 30, ready to launch the pilot."),
          narration:
            "Days one through thirty. Persona work, pre-scale IT preparation, pilot recruitment. Define the persona mix for your organisation based on a realistic survey of work patterns. Recruit twenty pilot users across three or four functions in the heavy persona. Start the thirty-day IT preparation sprint — sensitivity labels, DLP policies, SharePoint over-sharing audit — in parallel. Brief the executive sponsor with the persona case and the pilot plan. By day thirty, you're ready to launch the pilot in earnest.",
        },
        {
          html: stepCard('calendar', 'blue', 'Days 31–60 — The 4-week pilot',
            "Run the chapter-3 pilot template. Twenty heavy-persona users. Daily check-ins. Persona-based prompts. By day 60 — pilot week 4 complete; three-slide presentation ready; week-4 decision meeting scheduled with sponsor and CFO."),
          narration:
            "Days thirty-one through sixty. The four-week pilot from chapter three. Twenty heavy-persona users. Daily check-ins in the Teams channel. Persona-based prompts trained hands-on. By day sixty — which is pilot week four complete — you have the three-slide week-four presentation ready, with the numbers, the qualitative wins, and the specific ask. The decision meeting with the sponsor and CFO is on the calendar. Decision-ready.",
        },
        {
          html: stepCard('calendar', 'amber', 'Days 61–90 — Broader rollout launch',
            "Sign-off received. License the broader heavy + half-moderate population (typically 400 users for a 1,000-person org). Launch the prompt library with the 5×5 grid. Stand up champions, office hours, and the usage dashboard. By day 90, the broader rollout is live; the steady-state rhythm has started."),
          narration:
            "Days sixty-one through ninety. The broader rollout launch. The sign-off from the week-four decision meeting is in hand. License the broader population — typically four hundred users for a thousand-person organisation, covering the full heavy persona plus half of the moderate persona. Launch the prompt library with the five-by-five grid from chapter four. Stand up the champion network — at least two champions per priority function. Start the weekly office hours. Build the usage dashboard. By day ninety, the broader rollout is live and the steady-state rhythm has begun. The first month of steady state starts here.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Phased — not big-bang',
        "Each 30-day phase has a specific decision gate at the end. Don't skip the decision gates because the previous phase went well; the gates are what keep the programme defensible and let you adjust if needed."),
      calloutNarration:
        "Phased. Not big-bang. Each thirty-day phase has a specific decision gate at the end. Day thirty — are we ready to launch the pilot. Day sixty — does the pilot's evidence justify the broader rollout. Day ninety — is the broader rollout sustaining or stalling. Don't skip the decision gates because the previous phase went well. The gates are what keep the programme defensible to the CFO across the ninety days. And they're what let you adjust the plan if a phase surfaces something unexpected. The phased structure is the discipline.",
    },
    {
      title: 'Four conversations to have in week one',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Week-one conversations',
      bodyHtml: `<p>Four conversations to schedule in the first week. Each one moves a decision or a relationship. Putting them off is the most common reason 90-day plans become 120-day plans.</p>`,
      narrationLead:
        "Four conversations to schedule in the first week of the ninety-day plan. Each one moves a decision or a relationship. Putting them off is the most common reason ninety-day plans become one-hundred-and-twenty-day plans. Don't.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — With the executive sponsor',
            "45 minutes. Walk through the persona case, the 90-day plan, the budget. Get explicit sign-off on the 30-day persona + pilot recruitment phase. Don't ask for the full 90-day commitment yet — fund phase by phase."),
          narration:
            "Conversation one. With the executive sponsor. Forty-five minutes. Walk through the persona case from chapter two. The ninety-day plan from this chapter. The budget. Get explicit sign-off on the first thirty-day phase — persona work, IT preparation sprint, pilot recruitment. Don't ask for the full ninety-day commitment yet — fund phase by phase, with explicit decision gates. The sponsor will appreciate the discipline. So will the CFO when they hear about it indirectly.",
        },
        {
          html: stepCard('users', 'amber', 'Conversation 2 — With the IT lead',
            "30 minutes. Walk through the 30-day IT preparation sprint. Get the IT lead's commitment to the sprint work. Agree the joint weekly review pattern from chapter 5. The relationship starts here."),
          narration:
            "Conversation two. With the IT lead. Thirty minutes. Walk through the thirty-day IT preparation sprint — sensitivity labels, DLP policies, SharePoint audit. Get the IT lead's commitment to the sprint work. Agree the joint weekly review pattern from chapter five — thirty minutes a week, both leads in the room. The partnership starts in this conversation. Get it right early. The rest of the rollout depends on the partnership working.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 3 — With the change manager (if recruiting)',
            "If you don't already have one — recruit. 50% of the week for the first 90 days minimum; full-time from day 90 onwards. Brief them on the 90-day plan. They become your operational partner."),
          narration:
            "Conversation three. With the change manager. If you don't already have one — recruit. Fifty percent of their week for the first ninety days minimum, with the role evolving to full-time from day ninety onwards as the broader rollout sustains. Brief the change manager fully on the ninety-day plan. They become your operational partner across the rollout. Without a dedicated change manager, you become the change manager — and you have a day job. The role exists for good reasons; fill it.",
        },
        {
          html: stepCard('users', 'red', 'Conversation 4 — With finance',
            "20 minutes. Walk through the persona math, the year-1 cost estimate, the expected hours-saved value. Get finance aligned on the metrics they'll see in the quarterly review. Finance as ally early — protects budget at month 6."),
          narration:
            "Conversation four. With finance. Twenty minutes informal. Walk through the persona math, the year-one cost estimate, the expected hours-saved value at maturity. Get finance aligned on the specific metrics they'll see in the quarterly review. Finance as ally early is what protects the budget when other priorities compete at month six. The conversation costs twenty minutes; the benefit compounds for the entire programme. Take it.",
        },
      ],
    },
    {
      title: 'What comes next — beyond this course',
      iconKey: 'rocket',
      eyebrow: 'Lesson 3 · Onward',
      bodyHtml: `<p>This course gave you the Copilot adoption playbook. Three suggestions for what to look at next.</p>`,
      narrationLead:
        "This course gave you the Microsoft 365 Copilot adoption playbook. Three suggestions for what to look at next.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', '1 · AI for [your function]',
            "Function-specific deep dives complement the Copilot rollout. AI for HR. AI for Finance. AI for Sales. AI for Customer Service. Pick the one closest to your team's work; the function-specific patterns travel directly."),
          narration:
            "One. The function-specific deep dive courses in the academy. AI for HR. AI for Finance. AI for Sales. AI for Customer Service. AI for Operations. AI for Legal. Pick the one closest to your team's work. The function-specific patterns travel directly into the prompt library and the use-case discovery work for that function. They complement the generic Copilot adoption playbook with the depth specific to one function.",
        },
        {
          html: stepCard('bookOpen', 'amber', '2 · Building AI Agents with Copilot Studio',
            "If you're moving beyond out-of-the-box Copilot into building custom agents, the Copilot Studio course extends the rollout playbook into the agent-development discipline. Particularly relevant for IT teams supporting business-led agent building."),
          narration:
            "Two. Building AI Agents with Copilot Studio. If you're moving beyond out-of-the-box Microsoft 365 Copilot into building custom agents with Copilot Studio — which most organisations do in year two — the Building AI Agents course extends the rollout playbook into the agent-development discipline. Particularly relevant for IT teams supporting business-led agent building, which is the model most organisations land on.",
        },
        {
          html: stepCard('bookOpen', 'green', '3 · A 30-minute scoping call',
            "If you're ready to start the 90-day plan with a partner — the most efficient next step is a 30-minute call. We listen, ask three honest questions about your tenant and your team, and tell you whether we're the right partner."),
          narration:
            "Three. If you're ready to start the ninety-day plan with a partner — the most efficient next step is a thirty-minute call. We listen. We ask three honest questions about your M365 tenant state, your team's readiness, and your sponsor's expectations. And we tell you whether we are the right partner for your specific situation. Take the call. Even when the answer is no — and sometimes it is — the candour saves you weeks.",
        },
      ],
    },
    {
      title: 'A final note',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p class="lead">Microsoft 365 Copilot, deployed well, is invisible to the user once it’s working. They draft faster. They prep for meetings without dread. They get to inbox-zero earlier. They don’t see Copilot as a separate tool any more; they just see their work being easier. That is the destination.</p>
      <p>Active management is the work. The technology will keep moving. The work stays.</p>
      <p>Thank you for spending the last hour with me.</p>`,
      narrationLead:
        "One final thought. Microsoft 365 Copilot, deployed well, is invisible to the user once it's working. They draft documents faster. They prep for meetings without dread. They get to inbox-zero earlier in the day. They don't experience Copilot as a separate tool any more; they just experience their work being easier. That is the destination. Active management is the work that gets you there. The technology will keep moving — and faster, not slower, over the next three years. The active management work stays. Lead it. Thank you for spending the last hour with me. Now go have the four conversations in week one.",
    },
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'check',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>Three things to carry out of the whole course — into Monday morning.</p>`,
      narrationLead:
        "Three things to carry out of the whole course. Into Monday morning.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Persona-based licensing, not blanket',
            "Heavy: full. Moderate: half in year 1. Light: defer. Saves 30–50% on year-1 spend; produces 4× better economics per active user."),
          narration:
            "One. Persona-based licensing, not blanket. Heavy persona — license fully. Moderate persona — license half in year one. Light persona — defer until evidence justifies. Saves thirty to fifty percent on year-one spend. Produces four times better economics per active user. The CFO sees both. The discipline is what funds the rest of the programme.",
        },
        {
          html: stepCard('check', 'green', 'Two — Active management, all three together',
            "Persona-based prompt libraries · champion network with office hours · visible usage dashboard. All three at once. The 70% adoption pattern depends on all three."),
          narration:
            "Two. Active management, all three components together. Persona-based prompt libraries hosted in M365 itself. Champion network with weekly office hours. Visible usage dashboard. All three at once — not pick-and-choose. The seventy-percent adoption pattern depends on all three working together. Skipping any one drops adoption substantially.",
        },
        {
          html: stepCard('check', 'green', 'Three — Phased, with decision gates',
            "Days 1–30 · 31–60 · 61–90. Each phase has a specific deliverable. Each phase has a decision gate at the end. Don't skip the gates."),
          narration:
            "Three. Phased — with decision gates. Days one through thirty for persona work, IT prep, pilot recruitment. Days thirty-one through sixty for the four-week pilot. Days sixty-one through ninety for the broader rollout launch. Each phase has a specific deliverable. Each phase has an explicit decision gate at the end. Don't skip the gates because the previous phase went well. The discipline is what keeps the rollout defensible.",
        },
      ],
      narrationTrail:
        "Thank you. Truly. Take the ninety-day plan to your sponsor this week. We'll see you at the next decision point.",
    },
  ],
}
