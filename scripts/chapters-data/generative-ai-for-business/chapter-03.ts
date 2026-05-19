import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const genAiBizChapter03: Chapter = {
  courseId: 'generative-ai-for-business',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-use-case-discovery',
  title: 'Use case discovery',
  subtitle: 'How to find the right use case in your team — without a six-month consulting study.',
  slides: [
    // SLIDE 1
    {
      title: 'Use case discovery',
      iconKey: 'search',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">Most teams pick the wrong AI use case to start. Not because the technology is unclear — because the discovery is rushed or skipped. In the next few minutes, the discovery method that takes a week and produces a use case that ships in eight more.</p>`,
      narrationLead:
        "Welcome to chapter three. Use case discovery. Most teams pick the wrong AI use case to start with. Not because the technology is unclear — because the discovery work is rushed or skipped entirely. The vendor walks in. The vendor proposes a use case based on what they sell. The team accepts it. Six months later, it isn't working and nobody quite knows why. In the next few minutes, the discovery method that takes a week of your time and produces a use case that actually ships in the eight weeks after.",
    },
    // SLIDE 2
    {
      title: 'The five-question scoring sheet',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · Scoring',
      bodyHtml: `<p>Five questions. Score every candidate use case across the five. The highest total goes first. The lowest doesn’t get funded. Simple. Defendable.</p>`,
      narrationLead:
        "Five questions. Score every candidate use case in your team across these five. The highest total score goes first. The lowest doesn't get funded. Simple. Defendable. Use this sheet in your next planning meeting.",
      steps: [
        {
          html: stepCard('search', 'blue', '1 · How often does this work happen?',
            "Daily, weekly, monthly, quarterly. Daily wins. AI value compounds when the use case repeats — the team gets fluent, the prompts get sharper, the output stays consistent."),
          narration:
            "Question one. How often does this work happen? Daily. Weekly. Monthly. Quarterly. Daily wins. Because AI value compounds when the use case repeats. The team gets fluent in the prompt patterns. The prompts get sharper. The output stays consistent. A use case that only happens twice a quarter is worth less than one that happens twice a day — even if the per-instance benefit is higher. Frequency multiplies value.",
        },
        {
          html: stepCard('search', 'blue', '2 · How long does it currently take?',
            "Less than 15 minutes — usually not worth automating. 15 minutes to 2 hours — sweet spot for many drafting/summarising use cases. Over half a day — bigger projects, bigger payoff, longer timelines."),
          narration:
            "Question two. How long does the work currently take? Less than fifteen minutes per instance — usually not worth automating because the overhead of using the AI eats the benefit. Fifteen minutes to two hours — the sweet spot for most drafting and summarising use cases. Over half a day per instance — bigger projects, bigger payoff, but also longer build timelines and more complexity. Pick the right duration band for your first use case. Most teams should start in the fifteen-minute to two-hour band.",
        },
        {
          html: stepCard('search', 'amber', '3 · Is the input mostly text or structured data?',
            "Mostly text — drafting, summarising, classifying. Generative AI strength. Mostly structured data — calculations, forecasts, comparisons. Use spreadsheets or ML, not generative AI. Mixed — possible but more complex."),
          narration:
            "Question three. Is the input to the work mostly text — or mostly structured data? Mostly text means drafting, summarising, classifying. That's generative AI's strength. Mostly structured data means calculations, forecasts, comparisons — that's a spreadsheet's job or a machine learning model's job, not a generative AI job. Mixed input is possible but more complex. For your first use case, pick text-heavy. Save the mixed ones for later.",
        },
        {
          html: stepCard('search', 'amber', '4 · How clear is “good” for this work?',
            "Crystal clear — the team can spot a good output instantly. Then AI works well. Subjective — different people would judge it differently. Then AI works less well and verification is harder. Pick the clear ones first."),
          narration:
            "Question four. How clear is good for this work? Crystal clear means the team can spot a good output instantly — without debate. The AI works well here, because verification is fast. Subjective means different people would judge the same output differently. The AI works less well here, because verification is harder and the team disagrees on what to accept. Pick the crystal-clear use cases first. The subjective ones come later, once the team is fluent.",
        },
        {
          html: stepCard('search', 'green', '5 · How tolerant of imperfection is the team?',
            "First-draft quality is fine — AI accelerates dramatically. Production-quality required first time — slower, more rigorous, but still possible. Zero tolerance for errors — AI is wrong here; use it as a checker, not as the producer."),
          narration:
            "Question five. How tolerant of imperfection is the team? First-draft quality is fine, with a human review before anything goes out — AI accelerates dramatically. The team can move quickly. Production-quality required on first output — slower deployment, more rigorous verification, but still possible. Zero tolerance for errors — for example, anything that auto-publishes to a customer without human review — AI is the wrong choice. Use it as a checker, not as the producer. Calibrate the use case to the tolerance honestly.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Score 5 candidates · pick top 2',
        "Don't pick the first candidate that comes to mind. Score five — typically taking a week of asking team members what would help. Pick the top two. Run them in parallel. Most teams that do this hit value in 8 weeks. Most teams that skip it hit nothing in 6 months."),
      calloutNarration:
        "Don't pick the first candidate use case that comes to mind. Score five candidates. Typically that takes a week of asking team members what would help. Then pick the top two. Run them in parallel. Most teams that do this discovery work hit measurable value in eight weeks. Most teams that skip it hit nothing in six months. The discovery work is unglamorous. It is also the difference between an AI initiative that ships and one that doesn't. Don't skip it.",
    },
    // SLIDE 3
    {
      title: 'How to actually find candidates — three methods',
      iconKey: 'compass',
      eyebrow: 'Lesson 2 · Methods',
      bodyHtml: `<p>Three methods to find candidate use cases inside your team. Use all three — they surface different candidates.</p>`,
      narrationLead:
        "Three methods to find candidate use cases inside your team. Use all three. They surface different kinds of candidates — and missing any one of the three usually means missing your highest-value use case.",
      steps: [
        {
          html: stepCard('compass', 'green', 'Method 1 — Ask the team',
            "Five 20-minute conversations with team members. Ask: “What part of your week takes the most time but feels routine?” The honest answers identify candidates faster than any consultant exercise."),
          narration:
            "Method one. Ask the team. Five twenty-minute conversations with individual team members. Ask one specific question. What part of your week takes the most time but feels routine? Not what they want to automate — what feels routine to them. The honest answers identify candidates faster than any consultant exercise would. People know what wastes their time. They will tell you when asked in private. Just ask.",
        },
        {
          html: stepCard('compass', 'blue', 'Method 2 — Watch the team',
            "Two days of shadowing the team — even just an hour a day. You'll see candidates the team didn't name because they don't notice them any more. The repeated patterns that have become invisible to insiders."),
          narration:
            "Method two. Watch the team. Two days of shadowing — even just an hour a day, sitting next to different team members. You will see candidates the team didn't name in the interviews — because they no longer notice the work. The repeated patterns that have become invisible to insiders. Common examples — the way customer emails get categorised. The recurring spreadsheet manipulation before every meeting. The note-taking that gets thrown away after meetings because nobody indexed it. These are gold. The team can't see them. You can.",
        },
        {
          html: stepCard('compass', 'amber', 'Method 3 — Look at the inbox',
            "Half a day reviewing the team's shared inbox — or your own. Repeated question types from customers, repeated requests from other teams, repeated escalations. These tell you what to build a copilot or RAG system around."),
          narration:
            "Method three. Look at the inbox. Spend half a day reviewing the team's shared inbox — or your own inbox of internal requests. Look for repeated question types from customers. Repeated requests from other teams. Repeated escalations that should have been resolved at tier one. These patterns tell you what to build a copilot or a knowledge-base agent around. They are the highest-leverage use cases because they intercept the routine question at the source — and they typically improve customer experience at the same time as freeing team time.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three discovery mistakes to avoid',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Mistakes',
      bodyHtml: `<p>Three mistakes I see repeatedly during use case discovery. Each one wastes 2–3 months. Avoid them.</p>`,
      narrationLead:
        "Three mistakes I see repeatedly during use case discovery. Each one wastes two to three months. Avoid them.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Mistake 1 — Letting the vendor pick the use case',
            "The vendor will pick what they sell. That may or may not be your highest-value use case. Lead the discovery. Bring the vendor in once you've scored candidates and picked one — not before."),
          narration:
            "Mistake one. Letting the vendor pick the use case. The vendor will pick what they sell. That may or may not be your highest-value use case. Most of the time, it isn't. Lead the discovery yourself. Score the candidates with your team. Pick one. Then bring the vendor in to help you ship the one you picked. Not before. The order matters.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Mistake 2 — Picking the most exciting use case',
            "The use case that gets people talking in the kitchen is usually the highest-risk one. The use case that ships in eight weeks is usually a boring one. Pick boring. Pretty demos don't fund the next initiative."),
          narration:
            "Mistake two. Picking the most exciting use case as the first one. The use case that gets people talking in the kitchen is usually the highest-risk one. The use case that ships in eight weeks is usually a boring one — invoice processing, meeting summaries, the standard recurring report. Pick boring for the first one. Pretty demos don't fund the next initiative. Shipped wins do. Pick the win, not the demo.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Mistake 3 — Skipping the team interviews',
            "Some managers think they already know what their team needs. They often don't. The team has been quietly working around the same five irritations for two years. Twenty-minute conversations reveal them. Don't skip the step that takes a week to save a quarter."),
          narration:
            "Mistake three. Skipping the team interviews. Some managers think they already know what their team needs. They often don't. The team has been quietly working around the same five irritations for two years — and they've stopped mentioning them because nobody asked. Twenty-minute one-to-one conversations reveal these irritations quickly. Don't skip the step that takes a week of your time to save a quarter of misdirected work. The interviews are the highest-leverage management activity in the whole discovery phase.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 4 — vendor evaluation.</p>`,
      narrationLead:
        "Three anchors before chapter four — vendor evaluation.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Five questions, scored across candidates',
            "Frequency · duration · text vs data · clarity of good · tolerance of imperfection. Score 5 candidates. Pick top 2."),
          narration:
            "One. Five questions, scored across candidates. Frequency of the work. Current duration. Whether the input is text or structured data. How clear good looks. The team's tolerance of imperfection. Score five candidate use cases. Pick the top two. Run them in parallel.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three discovery methods, use all three',
            "Ask the team · watch the team · look at the inbox. Each surfaces different candidates. Don't pick favourites among the methods."),
          narration:
            "Two. Three discovery methods. Ask the team in private one-to-ones. Watch the team for two days. Look at the shared inbox for half a day. Each method surfaces a different kind of candidate. Use all three — and don't pick favourites among the methods. The highest-value candidate is often the one only one of the three methods would have found.",
        },
        {
          html: stepCard('check', 'green', 'Three — Discovery is the highest-leverage week of your year',
            "A week of discovery saves a quarter of misdirected work. Don't skip it. Don't outsource it. Don't let the vendor lead it."),
          narration:
            "Three. Discovery is the highest-leverage week of your year on this initiative. A week of discovery work saves a quarter of misdirected execution work. Don't skip it. Don't outsource it. Don't let the vendor lead it. Lead it yourself, with your team, using these methods.",
        },
      ],
      narrationTrail:
        "Chapter four — vendor evaluation. How to cut through the noise in 90 seconds. See you there.",
    },
  ],
}
