import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiCsChapter03: Chapter = {
  courseId: 'ai-for-customer-service-support',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-deflection-bots',
  title: 'Scoped tier-1 deflection bots',
  subtitle: 'When to deploy · how to scope (intent inventory + risk gate) · the clean-handoff design that protects CSAT.',
  slides: [
    // SLIDE 1
    {
      title: 'Scoped tier-1 deflection bots',
      iconKey: 'zap',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">The right scoped bot deflects 30–50% of in-scope contacts and raises CSAT. The wrong unscoped bot drops CSAT by 15–25 points and doubles repeat-contact rate. Same technology — opposite outcomes. The difference is scope.</p>`,
      narrationLead:
        "Welcome to chapter three. Scoped tier-1 deflection bots. The right scoped bot deflects thirty to fifty percent of in-scope contact volume and can actually raise customer satisfaction because customers prefer self-service for routine tasks. The wrong unscoped bot — discussed in chapter one as the disappointment — drops CSAT by fifteen to twenty-five points and doubles repeat-contact rate. Same underlying technology. Opposite outcomes. The difference is scope. When to deploy, how to scope, and the clean-handoff design that protects CSAT — all in this chapter.",
    },
    // SLIDE 2
    {
      title: 'When to deploy — the intent inventory test',
      iconKey: 'search',
      eyebrow: 'Lesson 1 · The fit test',
      bodyHtml: `<p>Run the intent inventory before deciding whether to deploy a bot. The inventory tells you whether bot deflection is the right tool — or whether agent assist alone will get you the same gain at less risk.</p>`,
      narrationLead:
        "Run the intent inventory before deciding whether to deploy a deflection bot at all. The inventory takes a week with the contact-centre leadership team and a sample of recent contacts. It tells you whether bot deflection is the right tool for your contact mix — or whether agent assist alone from chapter two will get you the same productivity gain at much less risk. Three checks in the inventory.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Check 1 — Top 10 intents = what % of volume?',
            "List the top 10 contact intents. If they cover 60%+ of volume, deflection bots are viable on those. If top 10 cover under 40%, your tail is too long for bot deflection to matter; stay with agent assist."),
          narration:
            "Check one. List the top ten contact intents in your last quarter. What percentage of total contact volume do they account for? If the top ten intents cover sixty percent or more of volume, bot deflection is genuinely viable on those high-volume intents. If the top ten cover less than forty percent, your contact tail is too long and too varied for bot deflection to move the needle. Stay with agent assist alone — it will give you the productivity gain without the bot-related CSAT risk. Honest measurement here saves you a year of misallocated investment.",
        },
        {
          html: stepCard('check', 'amber', 'Check 2 — Are the top intents truly deflectable?',
            "Deflectable means the customer has the information needed, the task is well-defined, and the action is reversible. Password reset — yes. Complex billing dispute — no. Be ruthless about the test."),
          narration:
            "Check two. Are the top intents actually deflectable? A truly deflectable intent meets three tests. The customer has the information needed to complete the task — they know their order number, their account email, the date of the transaction. The task is well-defined with a small number of correct outcomes — password reset, order status, return initiation, simple account update. The action is reversible — if the bot completes it incorrectly, the customer can recover without damage. Password reset passes all three. Complex billing dispute fails all three. Be ruthless about applying the three tests to each candidate intent. Most teams' instincts are too optimistic about what's deflectable.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Check 3 — What\'s the emotional weight of these intents?',
            "Routine task intents (password, status) — low weight, deflectable. Emotional intents (complaint, refund request, billing dispute) — high weight, NOT deflectable. The same intent at different emotional weights routes differently."),
          narration:
            "Check three. What's the emotional weight on each candidate intent? Routine task intents like password reset and order status have low emotional weight — customers are fine with self-service. Emotional intents like billing disputes, refund requests after a perceived wrong, complaints about service quality have high emotional weight — customers want a human even if the task itself is technically simple. The same intent at different emotional weights routes differently — the bot can handle the routine refund initiation when the customer is just following return policy on a planned return, but not the angry refund demand after a service failure. Configure intent classification to read emotional signal alongside intent type. Route accordingly.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'What the inventory often reveals',
        "Many teams discover their top 10 intents cover only 35–45% of volume, which means deflection bots aren't going to deliver the headline gain. Agent assist on the long tail will. Run the inventory honestly before investing in bots."),
      calloutNarration:
        "What the intent inventory often reveals — and this is the honest message most vendors won't lead with. Many contact centres discover their top ten intents cover only thirty-five to forty-five percent of contact volume rather than the sixty percent threshold. Deflection bots can't deliver the headline gain in that distribution because most contact volume sits in the long tail. Agent assist on the long tail will deliver. Run the inventory honestly before committing to bot infrastructure. The vendor pitch will always make bots look attractive — the inventory tells you whether your specific contact mix supports them.",
    },
    // SLIDE 3
    {
      title: 'How to scope — the risk gate',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · The scope',
      bodyHtml: `<p>Three scope rules. Together they protect CSAT through the rollout. Skip any one and the bot eventually meets a customer interaction it shouldn't have been in — and the brand event follows.</p>`,
      narrationLead:
        "Three scope rules. Together they protect customer satisfaction through the bot rollout and beyond. Skip any one rule and the bot eventually meets a customer interaction it shouldn't have been in — and the brand event follows, usually screenshotted to social media. The three rules are not optional. Build them into the bot configuration before the first customer interaction.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Rule 1 — Whitelist intents, not blacklist',
            "The bot only handles intents on the explicit approved list. Everything else routes to a human immediately. Don't try to enumerate what the bot can't do — enumerate what it can. The whitelist grows over time as you prove each addition."),
          narration:
            "Rule one. Whitelist the intents the bot can handle. Don't blacklist. The bot only handles intents on the explicit approved list — for example, password reset, order status, return initiation, simple address update. Everything else, including anything the bot is uncertain about, routes to a human agent immediately. This is the opposite of the unscoped bot pattern from chapter one. The whitelist grows over time as you prove each addition is safe — typically adding two or three new intents per quarter. Disciplined whitelist growth is what makes deflection bots durable. Without it, scope creep happens silently and the brand event follows within a year.",
        },
        {
          html: stepCard('shield', 'green', 'Rule 2 — Hard-cap consecutive failed turns',
            "If the bot fails to resolve in three exchanges, hard-route to a human. No exceptions. Most CSAT damage from bots happens in turn four through eight where customers spiral into frustration. Cap at three."),
          narration:
            "Rule two. Hard-cap consecutive failed turns. If the bot fails to resolve the customer's need in three exchanges, hard-route to a human agent. No exceptions. Most of the CSAT damage from bot deployments happens in turn four through eight where customers spiral into frustration as the bot keeps not understanding. Capping at three turns means even a worst-case bot interaction is short. The customer experience is — tried the bot, didn't work, got a human quickly. That's a tolerable experience. The customer experience is not — was stuck with the bot for fifteen minutes. That's the experience that produces churn. Cap at three.",
        },
        {
          html: stepCard('shield', 'green', 'Rule 3 — Detect emotional escalation and exit early',
            "Bot detects frustration signals — caps lock, urgent language, escalation keywords — and exits to a human before the three-turn cap. The customer who's upset doesn't get the standard bot loop. They get a person fast."),
          narration:
            "Rule three. Detect emotional escalation and exit to a human before the three-turn cap. The bot watches for frustration signals in the customer's messages — caps lock usage, urgent language like immediately or unacceptable, escalation keywords like complaint or speak to a manager. When detected, the bot exits to a human agent immediately, even if the customer started in scope. The customer who's already upset does not get the standard bot loop — they get a person fast. This rule alone protects most of the CSAT downside risk in bot deployments. Configure the detection. Watch for false positives in the first month and tune.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The clean-handoff design',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · The handoff',
      bodyHtml: `<p>The handoff is where customer trust is won or lost. Three components make a handoff feel clean to the customer. Without all three, the customer experiences the handoff as restart-from-zero — and CSAT drops.</p>`,
      narrationLead:
        "The handoff from bot to human agent is where customer trust is won or lost. Three components make a handoff feel clean to the customer. Without all three, the customer experiences the handoff as restart-from-zero, has to repeat everything they just told the bot, and the CSAT drops as if the bot had never been involved. The handoff design is the single most important deployment decision in the bot rollout.",
      steps: [
        {
          html: stepCard('users', 'green', 'Component 1 — Pass the full transcript',
            "The agent receives the complete bot-customer transcript before the customer starts speaking. Agent reads it in 15 seconds. Customer never repeats themselves. This is the single biggest CSAT lever in handoff design."),
          narration:
            "Component one. Pass the full bot-customer transcript to the agent. The agent receives the complete transcript of what the customer said to the bot, what the bot tried, where it failed. Agent reads it in fifteen seconds before engaging the customer. Customer never has to repeat themselves. This is the single biggest CSAT lever in the entire handoff design. The opposite — where the customer has to explain everything again to the human agent — is the experience that makes customers furious and is the dominant CSAT-killer in bad bot deployments. Verify the transcript-pass is working in production. Don't assume it.",
        },
        {
          html: stepCard('users', 'green', 'Component 2 — Acknowledge what the customer already shared',
            "Agent opens with explicit acknowledgement — 'I can see you've been trying to reset your password. Let me take it from here.' Three seconds of phrasing. Costs nothing. Worth significant CSAT lift."),
          narration:
            "Component two. The agent acknowledges what the customer already shared. The agent opens with an explicit reference — for example, I can see you've been trying to reset your password for the account ending in seven-two-one, let me take it from here. Three seconds of phrasing. Costs nothing operationally. Worth significant CSAT lift because the customer knows the handoff carried context and they don't have to start over. Train agents on the explicit acknowledgement phrasing. Make it standard practice on every handoff. The phrasing is the smallest investment with the largest perception return.",
        },
        {
          html: stepCard('users', 'green', 'Component 3 — Don\'t make the customer wait at the handoff',
            "If average wait at handoff is over 90 seconds, the bot deployment is hurting more than helping. Either staff for handoff peaks or limit bot volume during peak hours. The customer's patience after bot failure is shorter, not longer."),
          narration:
            "Component three. Don't make the customer wait at the handoff. If the average wait at handoff to a human agent is over ninety seconds, the bot deployment is hurting more than it's helping. The customer's patience after a bot interaction failed is shorter than their patience would have been if they'd reached a human first. Either staff for handoff peaks adequately or limit bot volume during peak hours so the human-agent queue can absorb the deflections that bounce back. Monitor handoff wait time as a top-line bot KPI. It's the easiest KPI to miss and the most consequential to get wrong.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The KPI to watch most closely',
        "Repeat-contact rate within 24 hours on bot-handled contacts. If repeat-contact rate doubles compared to human-only baseline, the bot is producing a false-resolution pattern. Investigate within a week."),
      calloutNarration:
        "The KPI to watch most closely after launch. Repeat-contact rate within twenty-four hours on bot-handled contacts. If repeat-contact rate doubles compared to your human-only baseline, the bot is producing a false-resolution pattern — the customer marked the bot interaction as complete but the underlying issue wasn't actually resolved. They come back the next day, often through a different channel, often angrier. Investigate within a week of the trend appearing. The fix is usually scope tightening — removing the specific intent producing the false resolutions from the whitelist until the pattern is understood.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter four — multilingual support at scale.</p>`,
      narrationLead:
        "Three anchors before chapter four — multilingual support at scale.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Intent inventory before investing',
            "Top 10 intents must cover 60%+ of volume, must be truly deflectable, must have low emotional weight. If your contact mix fails the test, stay with agent assist on the long tail."),
          narration:
            "One. Intent inventory before investing in deflection bot infrastructure. Top ten intents must cover sixty percent or more of contact volume — otherwise the long tail dominates and bots can't move the needle. Top intents must be truly deflectable under the three tests — customer has the information, task is well-defined, action is reversible. Intent must have low emotional weight — high-emotion intents stay with humans even when technically simple. Many contact centres discover after honest inventory that bot deflection isn't right for their mix; agent assist on the long tail will deliver the gain instead.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three scope rules',
            "Whitelist intents · cap consecutive failed turns at 3 · detect emotional escalation and exit early. All three together are non-negotiable for CSAT protection."),
          narration:
            "Two. Three scope rules built into the bot before launch. Whitelist the approved intents — never blacklist, scope creep is the failure mode. Hard-cap consecutive failed turns at three — prevents the deep-frustration CSAT collapse pattern. Detect emotional escalation signals and exit to human before the cap — the upset customer gets a person fast, not the standard bot loop. All three rules are non-negotiable for CSAT protection. Build them in before the first customer interaction.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three handoff components',
            "Pass full transcript · agent acknowledges context explicitly · keep handoff wait under 90 seconds. Watch repeat-contact rate within 24 hours as the canary KPI for false-resolution patterns."),
          narration:
            "Three. Three handoff components that protect CSAT through the bot-to-human transition. Pass the full bot transcript to the agent — single biggest CSAT lever in handoff design, do not skip. Agent explicitly acknowledges what the customer already shared — three seconds of phrasing, significant perception lift. Keep average handoff wait under ninety seconds — over that and the bot is hurting more than helping. Watch repeat-contact rate within twenty-four hours on bot-handled contacts as the canary KPI for false-resolution patterns. The bot KPI dashboard isn't optional.",
        },
      ],
      narrationTrail:
        "Chapter four — multilingual support at scale. The languages that matter, code-switching in real conversations, and the production gotchas in non-English deployments. See you there.",
    },
  ],
}
