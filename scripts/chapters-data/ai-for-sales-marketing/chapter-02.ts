import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiSalesChapter02: Chapter = {
  courseId: 'ai-for-sales-marketing',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-prospecting',
  title: 'AI in prospecting',
  subtitle: 'Three useful prospecting uses — and the AI-spam trap that is collapsing response rates across the industry.',
  slides: [
    // SLIDE 1
    {
      title: 'AI in prospecting',
      iconKey: 'search',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">Prospecting is where AI in revenue has produced the loudest wins and the loudest disasters. Three uses that work. One trap that is collapsing response rates. The disciplined workflow that combines them.</p>`,
      narrationLead:
        "Welcome to chapter two. AI in prospecting. Prospecting is where AI in revenue has produced both the loudest productivity wins and the loudest brand disasters in the last two years. Three prospecting uses that consistently work. One trap that is collapsing response rates across entire industries right now. And the disciplined workflow that uses AI's strength without triggering AI's failure mode. By the end of this chapter, the rule for every outbound motion your team runs.",
    },
    // SLIDE 2
    {
      title: 'Three prospecting uses that work',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · The wins',
      bodyHtml: `<p>Three AI uses in prospecting that ship real lift — measured in first-meeting quality, response rate per outreach, and rep time recovered.</p>`,
      narrationLead:
        "Three AI uses in prospecting that consistently ship real lift. Lift measured in three places — first-meeting quality, response rate per piece of outreach, and rep time recovered for human work. Each one is a low-risk starting point for revenue teams new to AI.",
      steps: [
        {
          html: stepCard('compass', 'blue', 'Use 1 — ICP refinement',
            "AI analyses your last 24 months of closed-won and closed-lost. Surfaces the firmographic and signal patterns your ICP definition actually got wrong. ICP gets sharper. Targeting gets cheaper. Conversion rises."),
          narration:
            "Use one. ICP refinement. AI looks across your last twenty-four months of closed-won deals and closed-lost deals — usually a dataset large enough to be statistically meaningful and small enough that the LLM can reason across it. It surfaces the firmographic and behavioural signal patterns your stated ICP definition actually got wrong. Maybe you assumed mid-market manufacturing was your sweet spot — but the data says sub-mid-market manufacturing with a specific ERP closes three times faster. Use the refined ICP. Targeting gets cheaper. First-call qualification rates rise. Most teams find at least one significant ICP correction worth tens of millions in pipeline.",
        },
        {
          html: stepCard('search', 'blue', 'Use 2 — Pre-meeting account research',
            "AI reads ten sources about the account in seconds — website, last earnings call, news, LinkedIn signal, industry reports. Rep walks into discovery genuinely prepared. First-meeting quality jumps."),
          narration:
            "Use two. Pre-meeting account research. AI reads ten sources about the target account in seconds — their website, their most recent earnings call if they're public, recent news, key LinkedIn signal across the buying committee, relevant industry analyst reports. It produces a clean two-paragraph briefing. The rep reads it in ninety seconds before the call. They walk in genuinely prepared. First-meeting quality jumps in a way that closes more second meetings. This is the highest ROI AI prospecting investment because the lift is immediate and the brand risk is zero — only the rep sees the AI output.",
        },
        {
          html: stepCard('zap', 'blue', 'Use 3 — Signal-based trigger detection',
            "AI watches your target accounts for the trigger events that actually predict purchase intent — funding rounds, exec hires, product launches, layoffs in adjacent functions. Outreach times itself."),
          narration:
            "Use three. Signal-based trigger detection. AI watches your target account list — quietly, without their knowledge it's specifically them — for the trigger events that actually predict purchase intent in your category. Funding rounds. Executive hires in relevant functions. Product launches. Layoffs in adjacent functions. Earnings calls mentioning your category. The signal arrives — the rep gets a routing note — the outreach times itself to the moment the prospect is most likely to respond. Response rate doubles or triples versus blind cold outreach. This is the high-discipline use that requires the most setup but produces the most durable advantage.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The AI-spam trap — and the math',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · The trap',
      bodyHtml: `<p>One trap is collapsing response rates across whole industries right now. It is the trap most boards are unknowingly funding. The math is in this slide.</p>`,
      narrationLead:
        "One trap is collapsing response rates across whole industries right now. It is the trap most boards are unknowingly funding through the AI tools they bought in the last twelve months. Let me walk you through the math — because the numbers are unforgiving and most leadership teams haven't done them.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'The trap',
            "AI generates ten thousand personalized emails per day. The pitch — scale outbound ten times. The reality — recipients pattern-match the same AI-generated templates within weeks and stop reading anything that smells like it."),
          narration:
            "The trap. The pitch from the AI sales tool vendor — generate ten thousand personalized emails per day. Scale your outbound team ten times. The reality once deployed. Recipients across the market start pattern-matching the same AI-generated templates within weeks — the same fake first-line personalization, the same paragraph rhythm, the same closing question. The pattern is unmistakable once seen. And then they stop reading any email that smells like the pattern. Including yours.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'The math — month 1 vs month 4',
            "Month 1 — response rate 2.5% on ten thousand emails. That's 250 responses. Month 4 — response rate 0.4% on the same volume. That's 40 responses. The volume looks bigger; the actual conversation count collapsed."),
          narration:
            "The math. Month one of an AI-spam program. Response rate of two and a half percent on ten thousand emails a day. That's two hundred and fifty actual responses to talk to. Month four of the same program. Response rate down to point four percent on the same volume. That's forty actual responses. The volume report looks bigger every month — the actual conversation count collapsed eighty-five percent. Most teams discover this only when pipeline drops two quarters later. By then the brand cost is also in the bloodstream.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'The brand cost that compounds',
            "Even after you stop the AI-spam program, your domain reputation and your sender pattern are now in the trained models of every recipient's spam filter and every recipient's brain. Recovery takes longer than the original drift."),
          narration:
            "The brand cost compounds after you stop the program. Your domain reputation is now downgraded in every major email provider's spam filter. Your sender pattern is now in the trained model of every recipient's spam folder. And — harder to measure but real — your brand is now in the implicit memory of the recipients who got the emails. They remember you as the company that spammed them last year. Recovery from the brand damage takes longer than the original program took to build. The shortcut at the start is what produces the long pain later. Same pattern as the licensing shortcut in chapter one of M365 Copilot — the discipline at the start is the value.",
        },
      ],
      calloutHtml: calloutBlock('alertTriangle', 'warning', 'If you have a fully-automated outbound tool running today',
        "Pause it for a quarter. Measure the response rate trend over the last six months. Most teams find the trend is already negative. The cost of stopping is small relative to the cost of continuing."),
      calloutNarration:
        "If you have a fully-automated AI outbound tool running today — pause it for one quarter. Measure the response rate trend across the last six months. Most teams find the trend is already negative — they hadn't measured it because the volume looks healthy in the dashboard. The cost of pausing for a quarter is small relative to the cost of continuing for another year. The honest measurement is the move.",
    },
    // SLIDE 4
    {
      title: 'The disciplined prospecting workflow',
      iconKey: 'cog',
      eyebrow: 'Lesson 3 · The workflow',
      bodyHtml: `<p>Three components — combined as a single workflow per rep, not as separate AI tools. Together they double response rates against blind cold and triple them against AI-spam.</p>`,
      narrationLead:
        "Three components, combined as a single workflow per rep — not as three separate AI tools the rep has to remember to use. Together they roughly double response rates against blind cold outreach and triple them against AI-spam outreach. This is the operating template — adapt it to your tech stack.",
      steps: [
        {
          html: stepCard('search', 'green', 'Component 1 — AI does the research, deeply',
            "Pre-call brief is two paragraphs of actual specifics — recent earnings note, exec change, product launch, hiring pattern. Not generic firmographics. Specifics the prospect would recognise about themselves."),
          narration:
            "Component one. AI does the account research deeply — not superficially. The pre-call brief that hits the rep's inbox is two paragraphs of actual specifics. The note the CFO made on the last earnings call about category spend. The recent VP-Engineering hire. The product launch that's signaling the next strategic wave. The hiring pattern across the team most relevant to your category. Not generic firmographics that the prospect already knows. Specifics that the prospect would recognise as actually about them — because they are.",
        },
        {
          html: stepCard('users', 'green', 'Component 2 — Human writes the first line',
            "Rep writes the first sentence of the outreach themselves. Two sentences max. Specific reference to the research. The AI helps with the next paragraphs — but never the first line. The first line is the trust signal."),
          narration:
            "Component two. The rep writes the first line of the outreach themselves. Not AI. Two sentences maximum. A specific reference to something from the research that earns the right to land in the inbox. AI helps with the next paragraphs — the value proposition, the call-to-action, the cleaner second paragraph — but never the first line. The first line is the trust signal that says a human noticed you, specifically. AI-generated first lines are the dead giveaway that triggers the spam pattern-match. Protect the first line.",
        },
        {
          html: stepCard('zap', 'green', 'Component 3 — Outreach times to a signal',
            "Don't outbound on a Tuesday because Tuesday is when SDRs outbound. Outreach times itself to a real signal — funding round, exec change, product launch. Volume goes down; response rate goes up; pipeline goes up."),
          narration:
            "Component three. The outreach times itself to a real signal — not to a Tuesday morning slot because that's when SDRs outbound. Funding round announced this week. New VP of operations in seat last month. Product launch that maps to your category. The signal arrives — the rep gets a routing note from the AI — the outreach goes out within forty-eight hours of the signal, with the signal explicitly named in the message. Total outbound volume goes down by roughly half. Response rate goes up by a factor of two to three. Pipeline produced per rep goes up by roughly the same multiplier. The math is consistent across industries when teams actually do it.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter three — lead scoring.</p>`,
      narrationLead:
        "Three anchors before chapter three — lead scoring with AI.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three prospecting wins',
            "ICP refinement · pre-meeting account research · signal-based trigger detection. All three are low-brand-risk because the AI output is for the rep, not the prospect."),
          narration:
            "One. Three prospecting wins. ICP refinement using your closed-won and closed-lost history. Pre-meeting account research that makes the rep genuinely prepared. Signal-based trigger detection that times outreach to a real moment. All three are low-brand-risk because the AI output goes to the rep, not directly to the prospect.",
        },
        {
          html: stepCard('check', 'green', 'Two — The AI-spam trap is real and measurable',
            "Response rates collapse from 2.5% to 0.4% within four months at scale. If you have a fully-automated outbound tool today, pause for one quarter, measure the trend honestly."),
          narration:
            "Two. The AI-spam trap is real and measurable. Response rates collapse from roughly two and a half percent down to four-tenths of a percent within four months of running at scale. If you have a fully-automated outbound tool today, pause it for one quarter, measure the response rate trend across the last six months. Most teams discover the trend is already negative and they hadn't noticed.",
        },
        {
          html: stepCard('check', 'green', 'Three — The disciplined workflow',
            "AI deep research · human writes the first line · outreach times to a real signal. Cuts volume in half, doubles or triples response rate, lifts pipeline per rep."),
          narration:
            "Three. The disciplined prospecting workflow that combines AI's strength with the human moment. AI does the deep research. The human writes the first line — always. The outreach times itself to a real signal, not to an arbitrary outbound slot. Cuts total volume in half. Doubles or triples response rate. Lifts pipeline produced per rep by a similar factor. The arithmetic is consistent across industries when teams actually run the discipline.",
        },
      ],
      narrationTrail:
        "Chapter three — lead scoring with AI. The two-layer model and the CRM data quality audit that decides if any of it works. See you there.",
    },
  ],
}
