import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const m365CopilotChapter06: Chapter = {
  courseId: 'm365-copilot-adoption',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-measurement',
  title: 'Measurement in steady state',
  subtitle: 'Four numbers, three cadences — the metrics that fund renewal and detect drift before it becomes attrition.',
  slides: [
    {
      title: 'Measurement in steady state',
      iconKey: 'target',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">The pilot metrics were intense. Steady-state metrics need to be sustainable. In the next few minutes, four numbers, three cadences, and the early-warning signals that distinguish a healthy rollout from one drifting toward stall.</p>`,
      narrationLead:
        "Welcome to chapter six. Measurement in steady state. The pilot metrics from chapter three were intense — daily check-ins, weekly reviews, three named metrics. The steady-state metrics need to be sustainable. Reportable with less effort. Defensible across renewal cycles. In the next few minutes, four numbers, three cadences, and the early-warning signals that distinguish a healthy rollout from one drifting toward stall.",
    },
    {
      title: 'The four steady-state numbers',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · The four',
      bodyHtml: `<p>Four numbers. Three quantitative, one qualitative. Tracked weekly internally; reported monthly to the sponsor; presented quarterly to leadership.</p>`,
      narrationLead:
        "Four numbers in steady state. Three quantitative, one qualitative. Tracked weekly internally by the change manager. Reported monthly to the sponsor in a one-page summary. Presented quarterly to broader leadership and finance. The numbers are the heartbeat of the rollout — and the basis of the renewal case.",
      steps: [
        {
          html: stepCard('target', 'blue', '1 · Weekly active users (% of licensed)',
            "Percentage of licensed users active in the last week. The single most important metric. Target — above 70% in steady state for the heavy persona. Below 50% — investigate. Below 30% — intervene."),
          narration:
            "Number one. Weekly active users. Percentage of licensed users active in the last week. The single most important Copilot metric. Target — above seventy percent in steady state for the heavy persona, where you concentrated your licensing. Below fifty percent — investigate the cause. Below thirty percent — actively intervene with refreshed prompt libraries, executive prompting, or champion outreach. This number is the heartbeat. Watch it weekly.",
        },
        {
          html: stepCard('target', 'green', '2 · Prompts per active user per week',
            "Depth signal — beyond just opening the tool. Target — 10+ prompts per active user per week. Below 5 means users are dipping in, not integrating. The trend matters more than the snapshot."),
          narration:
            "Number two. Prompts per active user per week. The depth signal — beyond just opening the tool. Target — ten or more prompts per active user per week. Below five means users are dipping in but not integrating Copilot into their workflow. The trend over weeks matters more than any single snapshot. Falling prompts-per-active-user — even with stable active user count — is a leading indicator of disengagement. Watch the trend.",
        },
        {
          html: stepCard('target', 'amber', '3 · Hours saved per active user per week (self-reported)',
            "Quarterly self-reported survey. Target — 3–6 hours per active user per week in steady state. Track honestly; numbers above 8 are usually optimism. The number that funds renewal."),
          narration:
            "Number three. Hours saved per active user per week. Self-reported. Quarterly anonymous survey. Target — three to six hours per active user per week in steady state. Track honestly. Self-reported numbers above eight hours per week are usually optimism — defending them at the CFO renewal conversation is hard. The realistic band is the number that funds renewal because it's defensible. Inflated numbers come back to haunt the renewal cycle.",
        },
        {
          html: stepCard('target', 'red', '4 · Team Net Promoter Score (NPS)',
            "Quarterly anonymous. “Would you recommend this tool to a peer in another team in our organisation?” Above +30 — strong. 0 to +30 — fine. Below 0 — the team is unhappy and you need to know why. The qualitative signal."),
          narration:
            "Number four. Team Net Promoter Score. Quarterly anonymous survey of all licensed users. One question — would you recommend Copilot to a peer in another team in our organisation? Above plus thirty — strong, the team is actively advocating. Zero to plus thirty — fine, the team uses but doesn't promote. Below zero — the team is unhappy and you need to know why before it becomes attrition or quiet sabotage of the rollout. The qualitative signal catches things the quantitative metrics miss. Track it.",
        },
      ],
    },
    {
      title: 'The three reporting cadences',
      iconKey: 'calendar',
      eyebrow: 'Lesson 2 · Cadences',
      bodyHtml: `<p>Three cadences. Different audiences. Different formats. Don’t skip any one — each one does a job the others can’t do.</p>`,
      narrationLead:
        "Three cadences. Different audiences. Different formats. Don't conflate them and don't skip any one. Each one does a job the others can't.",
      steps: [
        {
          html: stepCard('calendar', 'green', 'Weekly — internal change-manager dashboard',
            "The change manager looks at the four numbers every Monday. 15 minutes. Spot the trends; identify what needs intervention this week. Internal — not shared widely."),
          narration:
            "Weekly. Internal change-manager dashboard. The change manager looks at the four numbers every Monday morning. Fifteen minutes. Spots the trends across the previous week. Identifies what needs intervention this specific week — declining active users in a particular team, dropping prompt counts in a function, an NPS dip. Internal to the change manager and the IT lead — not shared widely. The weekly cadence is operational.",
        },
        {
          html: stepCard('calendar', 'blue', 'Monthly — one-page sponsor report',
            "Four numbers + three short narratives (what changed, what's working, what's the ask). One page. Sent to the sponsor; reviewed in a 20-minute meeting. The monthly rhythm is what keeps the sponsor engaged and accountable."),
          narration:
            "Monthly. One-page sponsor report. Four numbers — trended over four weeks. Three short narrative paragraphs. What changed in the last month. What's working that should be amplified. What's the ask for the sponsor — typically a request to use Copilot visibly in a specific upcoming meeting, or to message a function the change manager is struggling to engage. One page. Sent to the sponsor and reviewed in a twenty-minute meeting. The monthly rhythm keeps the sponsor engaged and accountable.",
        },
        {
          html: stepCard('calendar', 'amber', 'Quarterly — leadership and finance review',
            "Two pages. Four numbers trended over four quarters. The economic case — hours saved × loaded cost, against the licensing spend. The forward asks. Presented jointly by IT and change manager with sponsor. The quarterly review is the renewal-funding rhythm."),
          narration:
            "Quarterly. Leadership and finance review. Two pages. The four numbers trended over four quarters — not a snapshot. The economic case — hours saved multiplied by fully-loaded cost, against the licensing spend. The forward asks for the next quarter. Presented jointly by the IT lead and the change manager, with the executive sponsor present. The quarterly review is the renewal-funding rhythm. It is also where finance and broader leadership stay close enough to the rollout to defend it when the next budget conversation happens.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The annual renewal preparation',
        "Once a year — typically two months before the M365 license renewal — assemble the full year's data. Four numbers trended over twelve months. Economic case for the year. Persona-mix evolution (who moved from moderate to heavy). The annual story is what defends — or expands — the next year's commitment."),
      calloutNarration:
        "The annual renewal preparation. Once a year — typically two months before your Microsoft 365 license renewal — assemble the full year of rollout data. Four numbers trended over twelve months, not just the most recent quarter. Economic case for the full year — total hours saved, against total spend. Persona-mix evolution — who moved from the moderate persona into the heavy persona and got their license added in year two, and who didn't and saved the spend. This annual story is what defends the rollout at the renewal conversation. Or expands it. The preparation is two weeks of work; the impact on the next year's commitment is significant. Don't skip it.",
    },
    {
      title: 'Three early-warning signals',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Early warnings',
      bodyHtml: `<p>Three signals that say the rollout is drifting before the topline numbers reflect it. Catch them early; intervention is cheaper than recovery.</p>`,
      narrationLead:
        "Three early-warning signals that say the rollout is drifting before the topline numbers reflect the drift. Catch the signals early. Intervention at the early-warning stage is dramatically cheaper than recovery after the topline metrics have fallen.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Signal 1 — Prompt-sharing in Teams channels declining',
            "Pilot users and early adopters used to share prompts in the Copilot channel. Now they share once a week, then once a month. Active usage may still look fine; depth and trust are declining. Intervention — refresh office hours; surface new prompts from the champion network."),
          narration:
            "Signal one. Prompt-sharing in Teams channels declining. The pilot users and early adopters used to share prompts in the Copilot channel multiple times a week. Now they share once a week. Then once a month. Active usage may still look fine on the dashboard. Depth and community trust are declining. By the time the topline active-user number falls, you've lost three or four months of momentum. Intervention — refresh the office hours format. Surface new prompts from the champion network. Have the executive sponsor share a prompt that worked. Restart the community signal before the metrics fall.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Signal 2 — Office hours attendance declining',
            "Office hours used to have 8–10 people; now it's 2–3. Users either think they don't need help (good case) or have given up (bad case). Investigate which. Often the format needs refreshing rather than the attendance fixing."),
          narration:
            "Signal two. Office hours attendance declining. Office hours used to attract eight to ten people regularly. Now it's two or three. Two scenarios are possible. Good — users genuinely don't need help any more because they've internalised the tool. Bad — users have given up on Copilot and don't come because they're not actively trying to use it. Investigate which scenario you're in. Often the right intervention is refreshing the format — turning office hours into a thirty-minute lunch-and-learn with a guest function each week, rather than open Q and A. The relationship matters; the format adjusts.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Signal 3 — Champion-network attrition',
            "Champions in a function leave the company, or leave the champion role. Without replacement, that function quietly disengages. Track champion attrition explicitly; recruit replacements before the function loses momentum."),
          narration:
            "Signal three. Champion-network attrition. Champions in a particular function leave the company, change roles, or quietly disengage from the champion responsibility. Without replacement, that function gradually loses its visible advocate — and quietly disengages from the Copilot rollout. The function's metrics decline slowly. Track champion attrition explicitly. When a champion role becomes vacant, recruit a replacement before the function loses momentum — within two weeks ideally, never more than a month. The champion role is structural; treat its continuity as such.",
        },
      ],
    },
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 7 — scaling beyond the initial wave.</p>`,
      narrationLead:
        "Three anchors before chapter seven — scaling beyond the initial wave.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four numbers',
            "Weekly active users · prompts per active user · hours saved · team NPS. Three quantitative, one qualitative. Track all four; don't substitute."),
          narration:
            "One. Four numbers. Weekly active users. Prompts per active user. Hours saved per active user per week — self-reported quarterly. Team NPS. Three quantitative and one qualitative. Track all four. Don't substitute one for the others; each captures something the others don't.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three cadences',
            "Weekly internal dashboard · monthly one-page sponsor report · quarterly leadership and finance review. The annual renewal preparation builds on the quarterly rhythm."),
          narration:
            "Two. Three cadences. Weekly internal change-manager dashboard, fifteen minutes. Monthly one-page sponsor report, twenty-minute review. Quarterly leadership and finance review, two pages. Don't conflate them. Each does a job the others can't. The annual renewal preparation builds on the quarterly rhythm.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three early-warning signals',
            "Prompt-sharing declining · office hours attendance declining · champion attrition unreplaced. Catch the signals early; intervention is cheaper than recovery."),
          narration:
            "Three. Three early-warning signals. Prompt-sharing in Teams declining. Office hours attendance declining without clear explanation. Champion-network attrition that's not being replaced. Catch the signals early. Intervention at this stage is cheaper than recovery after the topline metrics have fallen. Watch for these three specifically.",
        },
      ],
      narrationTrail:
        "Chapter seven — scaling beyond the initial wave. How to expand without losing what made the first wave work. See you there.",
    },
  ],
}
