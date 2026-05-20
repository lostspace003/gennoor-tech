import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const m365CopilotChapter01: Chapter = {
  courseId: 'm365-copilot-adoption',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-the-adoption-problem',
  title: 'The Copilot adoption problem',
  subtitle: 'Why most rollouts stall at 10% — and what separates the 70% adoption teams from the rest.',
  slides: [
    // SLIDE 1
    {
      title: 'The Copilot adoption problem',
      iconKey: 'alertTriangle',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">Microsoft 365 Copilot is one of the most ambitious enterprise software rollouts in a decade. It is also one of the most-stalled. Most organisations sit at 10–20% real adoption six months after launch. This course is for the IT and change leaders who want to land at 70%+ — and the playbook for getting there.</p>`,
      narrationLead:
        "Welcome to the course. This is for IT leaders, change managers, and anyone responsible for the Microsoft 365 Copilot rollout in their organisation. Copilot is one of the most ambitious enterprise software rollouts in a decade. It is also one of the most-stalled. Most organisations sit at ten to twenty percent real adoption six months after launch. The licenses are paid for. The capability is real. Nobody is using it. In the next few minutes, why that happens — and what the seventy percent adoption teams do differently.",
    },
    // SLIDE 2
    {
      title: 'Why most rollouts stall — three honest reasons',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 1 · The stall',
      bodyHtml: `<p>Three honest reasons most Copilot rollouts stall at 10–20%. None is about the technology. All three are about how the rollout was designed.</p>`,
      narrationLead:
        "Three honest reasons most Microsoft 365 Copilot rollouts stall at ten to twenty percent. None of the three is about the technology. The technology works. All three are about how the rollout was designed — and they're all preventable if you recognise them in advance.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Reason 1 — Blanket licensing instead of persona-based',
            "IT bought a license for every employee on the assumption that everyone would use it. They don't. The blanket license model produces a license drawer — paid capability, unused. Persona-based licensing produces adoption. We'll cover this in chapter two."),
          narration:
            "Reason one. Blanket licensing instead of persona-based. IT bought a Copilot license for every employee on the assumption that everyone would benefit equally. They don't. Different employees do different work — and Copilot's value depends heavily on what work the person actually does. The blanket licensing model produces a license drawer — paid capability that sits unused on most desks. Persona-based licensing — covered in chapter two — produces adoption. The economics are dramatically better.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Reason 2 — No persona-based prompt libraries',
            "Users open Copilot and see a blank box. They don't know what to ask. They try one or two generic prompts. They get generic answers. They stop. Without role-specific prompt libraries, adoption stalls within the first two weeks for most users."),
          narration:
            "Reason two. No persona-based prompt libraries. Users open Copilot for the first time and see a blank box. They don't know what to ask. They try one or two generic prompts. They get generic answers — okay but not transformative. They stop. Within two weeks they've stopped opening Copilot entirely. Without role-specific prompt libraries that show each user what their Copilot is for, adoption stalls. This is the most common failure mode by volume. We dedicate chapter four to it.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Reason 3 — No champion network, no office hours, no visible signal',
            "The tool was deployed. The team was emailed about it. Then silence. No champions, no office hours, no usage dashboard, no executive prompting people to share what's working. In the silence, people forget the tool exists. Active management is the difference."),
          narration:
            "Reason three. No champion network. No weekly office hours. No usage dashboard. No executive openly using Copilot and prompting their team to share what's working. The tool was deployed. The team was emailed about it. Then silence. In the silence, people forget the tool exists. Active management — visible, sustained, with named champions and weekly rhythm — is the difference between thirty percent adoption and seventy percent. Same technology. Same users. Different outcomes.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The 70% adoption pattern',
        "The teams that hit 70%+ adoption do all three together — persona-based licensing, role-specific prompt libraries, active champion-led management. Doing one or two isn't enough. The pattern compounds when all three are in place from day one."),
      calloutNarration:
        "The seventy percent adoption pattern. The teams that hit seventy percent or higher adoption do all three things together. Persona-based licensing. Role-specific prompt libraries. Active champion-led management. Doing one or two of these isn't enough. The pattern compounds when all three are in place from day one of the rollout. Most organisations skip one or two — usually because of timeline pressure to launch — and then wonder why adoption sits at twenty percent six months later. The shortcut at the start is what produces the stall later. Plan the full pattern. Don't shortcut.",
    },
    // SLIDE 3
    {
      title: 'What 70% adoption actually looks like',
      iconKey: 'check',
      eyebrow: 'Lesson 2 · The destination',
      bodyHtml: `<p>Concrete picture of what 70%+ adoption looks like in steady state. Use it as the operational target — and the recognisable signal that the rollout is working.</p>`,
      narrationLead:
        "Let me paint the concrete picture of what seventy percent or higher adoption looks like in steady state. Use it as the operational target. And as the recognisable signal that the rollout is working — versus the signs that say it's drifting.",
      steps: [
        {
          html: stepCard('check', 'green', 'Signal 1 — 70%+ of licensed users active weekly',
            "Not opened-once. Actively used in the last week. By month six, a healthy rollout has 70% of licensed users active weekly. Below 50% by month 6 — investigate. Below 30% — intervene."),
          narration:
            "Signal one. Seventy percent or higher of licensed users active weekly. Active means using Copilot for real work — not just opening it. By month six of a healthy rollout, seventy percent of licensed users are active in any given week. Below fifty percent by month six — investigate what's wrong. Below thirty percent — actively intervene. The benchmark isn't aspirational; it's what well-run rollouts achieve.",
        },
        {
          html: stepCard('check', 'blue', 'Signal 2 — 10+ prompts per active user per week',
            "Not 2 prompts. Not 3. Ten or more. The user has integrated Copilot into their workflow rather than treating it as a curiosity. Prompt volume per active user is the depth signal."),
          narration:
            "Signal two. Ten or more prompts per active user per week. Not two prompts. Not three. Ten or more. The user has integrated Copilot into their workflow rather than treating it as a curiosity. Prompt volume per active user is the depth signal. Active users with low prompt counts are dipping in. Active users with high prompt counts are working with Copilot. You want the second pattern.",
        },
        {
          html: stepCard('check', 'amber', 'Signal 3 — Users sharing prompts with each other',
            "The team is showing each other what works — in chat, in standups, in casual conversation. Prompt sharing is a leading indicator of sustained adoption. When it stops, adoption decays within a quarter."),
          narration:
            "Signal three. Users sharing prompts with each other. The team is showing each other what works — in team chat, in standups, in casual conversations at the coffee machine. Prompt sharing is a leading indicator of sustained adoption. When prompt sharing stops, adoption decays within a quarter. When it continues, adoption compounds. Watch this signal. It tells you what the dashboard alone can't.",
        },
        {
          html: stepCard('check', 'green', 'Signal 4 — Executive sponsor visibly uses it',
            "The COO or CIO references Copilot output in their own work — in front of the team, naturally. Not performative. Natural. Cultural signal that travels faster than any communication campaign."),
          narration:
            "Signal four. The executive sponsor visibly uses Copilot. The COO references the Copilot output they used to prep for the meeting. The CIO mentions a Copilot prompt that worked well. Not in a forced performative way — naturally, in their normal work. This cultural signal travels faster than any communication campaign IT can run. Senior leaders demonstrating use changes adoption at the team level within weeks. The opposite is also true — senior leaders not using it tells the team it's optional.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The three roles that determine the outcome',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · Who does what',
      bodyHtml: `<p>Three named roles. Together they own the rollout. Each one has different responsibilities — and each one needs to exist explicitly.</p>`,
      narrationLead:
        "Three named roles that together determine the outcome of the rollout. Each one has different responsibilities. Each one needs to exist explicitly — not blended into other roles. Name them at the start.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Role 1 — The IT/M365 admin lead',
            "Owns the technical deployment — licensing, sensitivity labels, DLP policies, tenant settings. The classical IT role. Necessary but not sufficient for adoption."),
          narration:
            "Role one. The IT and M365 admin lead. Owns the technical deployment. Licensing assignment. Sensitivity labels. Data loss prevention policies. Tenant settings. The classical IT role. Necessary but not sufficient for adoption. The IT admin can deploy Copilot perfectly and still have ten percent adoption six months later — because adoption isn't a technical problem.",
        },
        {
          html: stepCard('users', 'amber', 'Role 2 — The adoption / change manager',
            "Owns the human deployment — communications, training, champion network, office hours, usage dashboards. The role most often missing or underfunded. The single biggest determinant of adoption rate."),
          narration:
            "Role two. The adoption and change manager. Owns the human deployment. Communications. Training. The champion network. Weekly office hours. The usage dashboard for visibility. This is the role most often missing or critically underfunded in Copilot rollouts. It is also the single biggest determinant of adoption rate. Fund this role properly — typically a full-time person for a thousand-person rollout, scaled accordingly. Without this role, the rollout stalls. With it, the rollout compounds.",
        },
        {
          html: stepCard('users', 'green', 'Role 3 — The executive sponsor',
            "Names the team. Defends the budget. Visibly uses Copilot. Holds champions and managers accountable for adoption metrics. Not titled — committed. The sponsor's behaviour determines whether senior leaders take Copilot seriously."),
          narration:
            "Role three. The executive sponsor. Typically the COO, CIO, or chief digital officer. Names the rollout team. Defends the budget across financial cycles. Visibly uses Copilot themselves. Holds champions and the change manager accountable for adoption metrics on a quarterly basis. The sponsor isn't a titled position you fill — it's a committed behaviour you find. The sponsor's behaviour determines whether senior leaders across the organisation take Copilot adoption seriously. Without an active sponsor, the rollout drifts. With one, the rollout sustains.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 2 — licensing strategy.</p>`,
      narrationLead:
        "Three anchors before chapter two — licensing strategy.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three reasons rollouts stall',
            "Blanket licensing · no prompt libraries · no champion network. All three are preventable. The 70% adoption pattern requires all three fixed from day one."),
          narration:
            "One. Three reasons Copilot rollouts stall. Blanket licensing. No persona-based prompt libraries. No champion network and no weekly rhythm. All three are preventable. The seventy percent adoption pattern requires all three fixed from day one of the rollout — not as retrofits later.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four signals at 70% adoption',
            "70%+ weekly active · 10+ prompts per active user · users share prompts · executive sponsor visibly uses. Recognise the signals; they confirm the pattern is working."),
          narration:
            "Two. Four signals at seventy percent adoption. Seventy percent or higher weekly active users. Ten or more prompts per active user per week. Users actively sharing prompts with each other. The executive sponsor visibly using Copilot. Recognise the signals — they confirm the pattern is working. Their absence is the warning that something needs intervention.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three roles, named explicitly',
            "IT/M365 admin · adoption/change manager · executive sponsor. Name them at the start. The change manager is the most-often missing and most consequential."),
          narration:
            "Three. Three roles, named explicitly at the start. The IT and M365 admin lead. The adoption and change manager. The executive sponsor. The change manager role is the most-often missing and the most consequential. Fund it properly — typically full-time for a thousand-person rollout. Without that role, the rollout stalls regardless of how well the other two roles are filled.",
        },
      ],
      narrationTrail:
        "Chapter two — licensing strategy. Why persona-based beats blanket every time. See you there.",
    },
  ],
}
