import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const m365CopilotChapter02: Chapter = {
  courseId: 'm365-copilot-adoption',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-licensing-strategy',
  title: 'Licensing strategy',
  subtitle: 'Persona-based sizing — and the math that saves you 30–50% on year-1 spend without hurting adoption.',
  slides: [
    // SLIDE 1
    {
      title: 'Licensing strategy',
      iconKey: 'target',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">Most organisations over-buy Copilot licenses in year one. The blanket-license model burns 30–50% of the budget on seats that won’t produce value yet. Persona-based licensing is the correction — and it’s easier than the vendor sales team makes it sound.</p>`,
      narrationLead:
        "Welcome to chapter two. Licensing strategy. Most organisations over-buy Microsoft 365 Copilot licenses in year one. The blanket-license model — license everyone, sort it out later — burns thirty to fifty percent of the year-one budget on seats that won't produce value yet. Persona-based licensing is the correction. And it's actually easier to implement than the vendor sales team usually makes it sound. In the next few minutes, the three personas, the eighty-twenty pattern, and the math.",
    },
    // SLIDE 2
    {
      title: 'The three Copilot personas',
      iconKey: 'users',
      eyebrow: 'Lesson 1 · The personas',
      bodyHtml: `<p>Three personas explain Copilot value across the workforce. The persona mix determines the licensing strategy. Get the personas right and the licensing math follows.</p>`,
      narrationLead:
        "Three personas explain Copilot value across the workforce. The mix of these three in your specific organisation determines the right licensing strategy. Get the personas right and the licensing math follows. Get them wrong and you're either over-buying or starving the users who would actually benefit.",
      steps: [
        {
          html: stepCard('users', 'green', 'Persona 1 — Heavy users (20–25% of workforce)',
            "Knowledge workers whose day is mostly document, email, meeting, and data work. CFO, GC, senior managers, analysts, account executives, knowledge consultants. Copilot meaningfully reshapes their week. Highest ROI per license. Always license."),
          narration:
            "Persona one. Heavy users. Typically twenty to twenty-five percent of a knowledge-worker workforce. These are people whose day is mostly document work, email, meeting preparation, and data analysis. The CFO. The General Counsel. Senior managers. Financial analysts. Account executives. Knowledge consultants. Copilot meaningfully reshapes their week — five to ten hours saved per week is typical at maturity. Highest ROI per license, by a wide margin. Always license these users. They are the foundation of the adoption story.",
        },
        {
          html: stepCard('users', 'blue', 'Persona 2 — Moderate users (30–40% of workforce)',
            "Operational managers, project leads, sales reps, customer service team leads, HR business partners. Copilot helps — meaningfully but less dramatically than for heavy users. License about half of this segment in year one. Re-evaluate at 6 months."),
          narration:
            "Persona two. Moderate users. Thirty to forty percent of a typical knowledge-worker workforce. Operational managers. Project leads. Sales representatives. Customer service team leads. HR business partners. People who have meaningful document, email, and meeting work — but who also have substantial work that Copilot doesn't directly help with. Copilot helps these users meaningfully but less dramatically than the heavy persona. License about half of this segment in year one. Re-evaluate at six months — the moderate users who turn out to use Copilot intensively become heavy users in year two and get licensed.",
        },
        {
          html: stepCard('users', 'red', 'Persona 3 — Light users (35–45% of workforce)',
            "Frontline workers, field staff, deskless workers, operational staff with limited document/email work. Most don't need Copilot in year one. Defer licensing. Re-evaluate annually. Some will move into moderate persona as their work evolves; most won't."),
          narration:
            "Persona three. Light users. Thirty-five to forty-five percent of a typical workforce. Frontline workers. Field staff. Deskless workers. Operational staff with limited document and email work. Most of these users don't need Copilot in year one. Defer licensing. Re-evaluate annually — some will move into the moderate persona as their work evolves, particularly as your organisation digitises more frontline workflows. Most won't. And that's fine. Not licensing the light persona in year one is the single biggest budget saving available — and it has no negative impact on adoption metrics for the segments that matter.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The 80/20 on day one',
        "License the heavy persona fully (20–25% of workforce). License half of the moderate persona (15–20% of workforce). Defer the light persona. Result — you license roughly 35–45% of workforce on day one, not 100%. The math saves 30–50% of year-1 spend."),
      calloutNarration:
        "Here's the eighty-twenty for day one. License the heavy persona fully — twenty to twenty-five percent of the workforce. License half of the moderate persona — another fifteen to twenty percent. Defer the light persona entirely until evidence justifies it. The result — you license roughly thirty-five to forty-five percent of the workforce on day one, not one hundred percent. The math saves thirty to fifty percent of year-one license spend. And — critically — adoption metrics on the licensed users are dramatically better, because the people who got licenses are the people who genuinely benefit. Concentration improves adoption. The dilution of blanket licensing is what produces the ten-percent stall.",
    },
    // SLIDE 3
    {
      title: 'The year-1 math — concrete example',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · The math',
      bodyHtml: `<p>Two scenarios for a 1,000-person organisation. The numbers are public Microsoft list prices in 2026; adjust for your enterprise discount and your specific persona mix.</p>`,
      narrationLead:
        "Two scenarios for a thousand-person organisation. The numbers use public Microsoft list prices in 2026 — adjust for your enterprise discount and your specific persona mix. The point is the shape of the math, not the exact figures for your situation. The shape holds.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Scenario A — Blanket licensing',
            "1,000 licenses at ~$360/user/year = $360,000 annually. Realistic active usage at month 6: 200 users (20%). Cost per active user: $1,800/year. Expensive license drawer. The CFO conversation 6 months in is uncomfortable."),
          narration:
            "Scenario A. Blanket licensing. One thousand licenses at roughly three hundred and sixty dollars per user per year — that's three hundred and sixty thousand dollars annually for the license spend alone. Realistic active usage at month six — about two hundred users, twenty percent. The actual cost per active user works out to eighteen hundred dollars per year. Expensive license drawer. The CFO conversation at month six is uncomfortable — you've spent the budget and produced limited measurable value.",
        },
        {
          html: stepCard('check', 'green', 'Scenario B — Persona-based licensing',
            "400 licenses (200 heavy + 200 of moderate's 350) at ~$360 = $144,000 annually. Realistic active usage at month 6: 320 users (80% of licensed = good adoption). Cost per active user: $450/year. 4x better economics. The CFO conversation 6 months in is comfortable."),
          narration:
            "Scenario B. Persona-based licensing. Four hundred licenses — all two hundred heavy users plus two hundred of the three hundred and fifty moderate users — at three hundred and sixty dollars each. That's one hundred and forty-four thousand dollars annually. Realistic active usage at month six — about three hundred and twenty users, eighty percent of licensed. The cost per active user works out to about four hundred and fifty dollars per year. Four times better economics than blanket. And the CFO conversation at month six is dramatically more comfortable — you've spent less, produced more measurable value, and have a clear path to expanding.",
        },
        {
          html: stepCard('check', 'amber', 'The 18-month expansion',
            "At month 12–18, review the moderate users who weren't licensed. Some have moved into heavy-persona behaviour patterns. Add their licenses. Some haven't and you save the spend. Same logic with the light persona at month 18–24."),
          narration:
            "The eighteen-month expansion pattern. At month twelve to eighteen, you review the moderate users who weren't licensed in year one. Some of them have moved into heavy-persona behaviour patterns — they've digitised their work further, taken on more knowledge work, become candidates for licensing. Add their licenses then. Some haven't moved — and you save the spend. Same logic applies to the light persona at month eighteen to twenty-four. The licensing portfolio evolves with the workforce — it doesn't get committed all at once on day one.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three vendor pressures to resist',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Vendor pressure',
      bodyHtml: `<p>Microsoft’s sales motion pushes blanket licensing for understandable commercial reasons. Three specific pressures to recognise — and resist.</p>`,
      narrationLead:
        "Microsoft's sales motion will push your organisation toward blanket licensing for entirely understandable commercial reasons. Three specific pressures to recognise — and resist politely but firmly. The pressure isn't bad faith; it's the way enterprise software sales work. Your job is to make the case for the persona model that's right for your organisation.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Pressure 1 — “Everyone needs AI”',
            "The aspirational pitch. Everyone could benefit, eventually. But not equally in year 1. Persona-based licensing is staged investment — not denial of value. Frame it that way to the sponsor and the CFO."),
          narration:
            "Pressure one. Everyone needs AI — the aspirational pitch. Yes, everyone could benefit eventually. Yes, the pace of digitisation means even the light persona's role will shift over the next three to five years. But not equally in year one. Persona-based licensing isn't denying that everyone needs AI eventually. It is staging the investment to fund the people who benefit most first — and then expanding as adoption proves out. Frame it that way to your sponsor and to the CFO. Staged investment, not denial of value. The framing matters.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Pressure 2 — “Tier pricing is better with volume”',
            "Sometimes true. Often used to push past the right persona count. Run the math on your real persona mix; compare against the volume-discount blanket scenario. The volume discount rarely beats the persona discipline in year-1 ROI."),
          narration:
            "Pressure two. Tier pricing is better at higher volumes. Sometimes true — Microsoft does offer better per-license pricing at higher commitment volumes. The pressure is to push your commitment past the right persona count to hit a tier. Run the math on your specific persona mix. Compare against the volume-discounted blanket scenario. The volume discount rarely beats the persona discipline in year-one ROI. The economic case is almost always for persona-based licensing — even at slightly higher per-license pricing — because the concentration of value matters more than the per-unit discount.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Pressure 3 — “You\'ll lose competitive position”',
            "The implicit threat — competitors are deploying blanket and you'll fall behind. Most aren't actually getting more value from blanket; they're spending more for the same stall. Don't deploy faster than you can adopt. Adoption is the competitive position — not license count."),
          narration:
            "Pressure three. You'll lose competitive position by not licensing everyone. The implicit threat — competitors are deploying blanket and you'll fall behind. Here's the honest reality. Most competitors deploying blanket aren't actually getting more value from blanket licensing. They're spending more for the same stall. Adoption is the competitive position — not license count. The organisation hitting seventy percent adoption with persona-based licensing is competitively ahead of the organisation hitting twenty percent adoption with blanket licensing. By every metric that matters. Don't confuse spend with progress. They are very different.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 3 — pilot design.</p>`,
      narrationLead:
        "Three anchors before chapter three — pilot design.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three personas, license appropriately',
            "Heavy (20–25%): license fully. Moderate (30–40%): license half in year 1. Light (35–45%): defer. The mix saves 30–50% on year-1 spend."),
          narration:
            "One. Three personas. License appropriately. Heavy — twenty to twenty-five percent of the workforce — license fully. Moderate — thirty to forty percent — license about half in year one. Light — thirty-five to forty-five percent — defer entirely until evidence justifies it. The mix saves thirty to fifty percent on year-one license spend while improving the active-user metrics that matter.",
        },
        {
          html: stepCard('check', 'green', 'Two — The math: 4× better economics',
            "Persona-based: ~$450/year per active user. Blanket: ~$1,800/year per active user. The 4× ratio is real. The CFO sees it. Defend the persona discipline with the math."),
          narration:
            "Two. The math. Persona-based licensing produces roughly four hundred and fifty dollars per year per active user. Blanket licensing produces roughly eighteen hundred dollars per year per active user. A four-times ratio. The CFO sees this when it's presented honestly. Defend the persona discipline with the math, not with arguments. The numbers are the argument.",
        },
        {
          html: stepCard('check', 'green', 'Three — Resist three vendor pressures',
            "“Everyone needs AI” · “Tier pricing is better with volume” · “You'll lose competitive position”. Each has a defensible counter. Adoption — not license count — is the competitive position."),
          narration:
            "Three. Resist three vendor pressures. Everyone needs AI — frame persona-based as staged investment, not denial. Tier pricing is better with volume — run the math on your specific mix; the volume discount rarely beats the persona discipline. You'll lose competitive position — adoption is the competitive position, not license count. Each pressure has a defensible counter. Use them politely. The vendor relationship survives. So does your budget.",
        },
      ],
      narrationTrail:
        "Chapter three — pilot design for Copilot. The 4-week template adapted for persona-based rollouts. See you there.",
    },
  ],
}
