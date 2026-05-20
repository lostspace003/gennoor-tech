import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const m365CopilotChapter07: Chapter = {
  courseId: 'm365-copilot-adoption',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-scaling',
  title: 'Scaling and the second wave',
  subtitle: 'How to expand beyond the initial 400 licenses — without losing what made the first wave work.',
  slides: [
    {
      title: 'Scaling and the second wave',
      iconKey: 'rocket',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">The first wave landed. 400 users active. The board is asking when this scales to the broader workforce. The temptation is to blanket-license everyone now. Resist. The second wave needs the same discipline as the first — applied to a different population.</p>`,
      narrationLead:
        "Welcome to chapter seven. Scaling and the second wave. The first wave landed. Four hundred licensed users, seventy percent active weekly, demonstrable hours saved. The board is asking when this scales to the broader workforce. The CFO is asking the same question — but with a different intent. The temptation is to blanket-license everyone now. Resist. The second wave needs the same discipline as the first — just applied to a different population. In the next few minutes, when to move, how to move, and the three traps the second wave most often falls into.",
    },
    {
      title: 'When the second wave is ready — three signals',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · Readiness',
      bodyHtml: `<p>Three signals that say the first wave has earned the right to expand. If any one is missing, the second wave is premature.</p>`,
      narrationLead:
        "Three signals that say the first wave has earned the right to expand into the second wave. If any one of the three is missing, the second wave is premature. Wait. The cost of a premature second wave is significant — it dilutes the first wave's momentum and produces the stall pattern across both populations.",
      steps: [
        {
          html: stepCard('check', 'green', 'Signal 1 — First wave at 70%+ active for 3 consecutive months',
            "Not a single month. Three months in a row. Sustained adoption proves the rollout pattern works — not just that the initial enthusiasm landed. Below this bar, the second wave imports first-wave drift."),
          narration:
            "Signal one. First-wave active usage at seventy percent or higher for three consecutive months. Not a single month. Three months in a row. Sustained adoption proves the rollout pattern actually works — not just that the initial enthusiasm of the launch landed. Below this bar, expanding to a second wave imports the first wave's drift into the new population. Wait until the bar is met.",
        },
        {
          html: stepCard('check', 'blue', 'Signal 2 — Champion network resilient — at least 2 in each priority function',
            "Single-champion functions are fragile. When the champion leaves, that function stalls. The second wave needs functions to have backup. Recruit second champions during the first wave's steady state — before expansion."),
          narration:
            "Signal two. The champion network is resilient. At least two active champions in each priority function. Single-champion functions are fragile — when that one champion leaves the role or the company, the function stalls. The second wave needs functions to have backup champions in place. Recruit second champions during the first wave's steady state. Brief them. Get them ready before the expansion starts. Don't try to recruit and train champions during the expansion itself; you're already busy.",
        },
        {
          html: stepCard('check', 'amber', 'Signal 3 — Economic case for year 1 documented and defended',
            "The CFO has seen the year-1 numbers, has signed off that they're credible, and is ready to fund the expansion. The signed economic case is the artefact. Without it, the second wave funding is shakier than it appears."),
          narration:
            "Signal three. The economic case for year one is documented and defended to the CFO. The CFO has seen the numbers — hours saved, adoption rate, sustainment cost. Has signed off that the numbers are credible. And is ready to fund the expansion based on the demonstrated economics, not on hope. The signed economic case is the artefact that proves this signal. Without it, the second wave funding may look approved but is shakier than it appears — and the first sceptical question can unwind it. Get the signed case before you start the second wave.",
        },
      ],
    },
    {
      title: 'The second-wave deployment pattern',
      iconKey: 'flag',
      eyebrow: 'Lesson 2 · The pattern',
      bodyHtml: `<p>Four moves for the second wave. Each one preserves what made the first wave work; each one adapts to the new population.</p>`,
      narrationLead:
        "Four moves for the second wave deployment. Each move preserves what made the first wave work. Each move adapts to the new population — typically the moderate persona, broadened, and the early-graduating light persona.",
      steps: [
        {
          html: stepCard('flag', 'green', 'Move 1 — Repeat the persona discipline at higher scale',
            "Re-assess persona mix. Some moderate-persona users have moved into heavy patterns; license them. Some light-persona users have moved into moderate patterns; license about half. Persona discipline still applies."),
          narration:
            "Move one. Repeat the persona discipline at higher scale. Re-assess the persona mix of the broader workforce based on twelve months of operational data and the digitisation that has happened since year one. Some users in the moderate persona have moved into heavy-persona behaviour patterns; license them now in the second wave. Some users in the light persona have moved into moderate patterns as their work evolved; license about half of them. The persona discipline still applies. Don't relax it because the first wave succeeded — the discipline is what makes the second wave succeed.",
        },
        {
          html: stepCard('flag', 'blue', 'Move 2 — Champions in the new functions trained by first-wave champions',
            "The first-wave champions train the new champions in their respective functions. Peer-to-peer; not IT-delivered. The transfer of knowledge is more authentic and sticks better. The first-wave champions become senior champions — the role evolves."),
          narration:
            "Move two. Champions in the newly added functions get trained by first-wave champions, not by IT. Peer-to-peer training in champion role. The transfer of knowledge — what works, what doesn't, what the role actually involves — is more authentic when first-wave champions train it. And it sticks better. The first-wave champions become senior champions during this transfer — the role evolves. They like the recognition. The new champions get an authentic preview. Two benefits from one pattern.",
        },
        {
          html: stepCard('flag', 'amber', 'Move 3 — Prompt library refresh for the new personas',
            "The first-wave library was tuned for the original heavy + half-moderate population. The second wave adds new roles. Refresh the library to include their use cases. Don't expect the existing library to fit unchanged."),
          narration:
            "Move three. Prompt library refresh for the new personas joining in the second wave. The first-wave library was tuned for the original heavy persona plus half of the moderate persona. The second wave adds new roles — typically more of the moderate persona, plus the early-graduating light persona users. Refresh the library to include their specific use cases. Don't expect the existing library to fit the new roles unchanged. The refresh is a two-to-three-week project; the impact on second-wave adoption is significant.",
        },
        {
          html: stepCard('flag', 'green', 'Move 4 — Phased rollout, not all-at-once',
            "Roll the second wave in three phases across 12 weeks — not in a single launch event. Each phase brings in 200–400 users. The phased pattern lets the change manager handle the volume; the pattern lets early phases inform later ones."),
          narration:
            "Move four. Phased rollout — not all at once. Roll the second wave in three phases across twelve weeks. Each phase brings in two hundred to four hundred new users. The phased pattern lets the change manager handle the volume of new users without dropping the operational rhythm. And it lets each earlier phase inform the next — if phase one surfaces an issue in a specific function, phase two can address it before that function reaches scale. The temptation to do a single big-bang second wave is strong; resist it. Phased is steadier, and produces better adoption.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The second wave is not the third wave',
        "The second wave brings in moderate persona at full coverage and some early-graduating light persona. The third wave — typically year-2 onwards — addresses the remaining light persona deliberately and slowly, based on evidence. Don't conflate them. The mistake compresses risk."),
      calloutNarration:
        "Important. The second wave is not the third wave. The second wave brings in moderate persona at fuller coverage and some early-graduating light persona users — those whose work has clearly digitised. The third wave — typically year two onwards — addresses the remaining light persona deliberately and slowly, based on per-user evidence of their work having shifted. Don't conflate the two waves. The temptation is to do them as one big push because the political momentum is there. The mistake compresses risk and dilutes the persona discipline. Keep the third wave for later. The light persona doesn't go away; the timing matters.",
    },
    {
      title: 'Three second-wave traps',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Traps',
      bodyHtml: `<p>Three traps the second wave most often falls into. Each one preventable. Each one wastes a quarter of momentum.</p>`,
      narrationLead:
        "Three traps the second wave most often falls into. Each one is preventable. Each one wastes a quarter of momentum if it lands. Recognise them in advance.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Trap 1 — Relaxing the persona discipline because the CFO is now enthusiastic',
            "The first wave's success makes the CFO supportive. Suddenly there's pressure to license everyone. Resist. The persona math still holds for the new population. Apply it; defend it with the same calmness as in year 1."),
          narration:
            "Trap one. Relaxing the persona discipline because the CFO is now enthusiastic. The first wave's success has made the CFO supportive. Suddenly the pressure to license everyone in the second wave is internal rather than external. It is harder to push back against your own CFO's enthusiasm than against a vendor's. But the persona math still holds for the new population. Apply it. Defend it with the same calmness as you did in year one. The CFO will respect the discipline once the conversation happens.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 2 — First-wave champions burning out from training new champions',
            "First-wave champions are now expected to support the second wave on top of their day jobs and original champion role. Without explicit recognition and recalibration of their other workload, they burn out. Protect them; their continuity protects everything."),
          narration:
            "Trap two. First-wave champions burning out from training the second-wave champions. First-wave champions are now expected to support the second wave on top of their existing day jobs and their original champion role. Without explicit recognition of the additional time, and without recalibration of their other workload, they burn out within six to nine months of the second wave starting. Protect them. Their continuity protects the entire programme. Sometimes this means temporary backfill in their day job; sometimes it means a formal title change or compensation adjustment. Defend the champions.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Trap 3 — Treating the broader rollout like a one-time event',
            "Second wave launches; then leadership stops paying attention because the rollout “happened”. Adoption decays in the new population without sustained management. Sustained attention is the work — for both waves, indefinitely."),
          narration:
            "Trap three. Treating the broader rollout like a one-time event that's now finished. Second wave launches successfully. Then leadership stops paying attention because the rollout — in their view — happened. Three months later, adoption in the new population is decaying. The same disciplines that produced first-wave success are needed for second-wave sustainment — and for third-wave sustainment after that. Sustained attention is the work. Indefinitely. Not just at launches. The Copilot programme doesn't have a finish line; it has a steady state that requires ongoing investment.",
        },
      ],
    },
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 7 · Takeaways',
      bodyHtml: `<p>Three anchors before the capstone.</p>`,
      narrationLead:
        "Three anchors before we land it in the capstone chapter.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three readiness signals',
            "70%+ active for 3 months · resilient champion network · signed economic case. All three. Below the bar — wait."),
          narration:
            "One. Three readiness signals before the second wave starts. Seventy percent or higher active usage for three consecutive months. Resilient champion network with at least two champions per priority function. Signed economic case from the CFO. All three. Below the bar on any one — wait. The cost of a premature second wave is significant.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four moves for the second wave',
            "Repeat persona discipline · peer-to-peer champion training · prompt library refresh · phased rollout. Each move preserves the first-wave pattern."),
          narration:
            "Two. Four moves for the second wave deployment. Repeat the persona discipline at higher scale. First-wave champions train second-wave champions peer-to-peer. Prompt library refreshed for the new personas. Phased rollout across twelve weeks, not single big-bang launch. Each move preserves what made the first wave work.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three second-wave traps',
            "Relaxing persona discipline · first-wave champion burnout · treating the rollout as a one-time event. Each preventable. Each costs a quarter of momentum."),
          narration:
            "Three. Three second-wave traps to avoid. Relaxing the persona discipline because the CFO is now enthusiastic. First-wave champion burnout from supporting the second wave on top of their existing role. Treating the broader rollout as a one-time event that's now finished. Each one preventable. Each one costs a quarter of momentum if it lands. Watch for them.",
        },
      ],
      narrationTrail:
        "Final chapter — your 90-day Copilot rollout plan. Where everything we've covered lands as something you can put in front of executive leadership this week. See you there.",
    },
  ],
}
