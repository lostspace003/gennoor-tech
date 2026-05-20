import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiSalesChapter06: Chapter = {
  courseId: 'ai-for-sales-marketing',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-personalization',
  title: 'Personalization that works',
  subtitle: 'Three personalization tiers · the creepy line you don\'t cross even when you can · and why relevant beats clever.',
  slides: [
    // SLIDE 1
    {
      title: 'Personalization that works',
      iconKey: 'target',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">Personalization is the easiest revenue AI play to overdo. AI knows more about your prospect than you should comfortably use. Three tiers — light to deep. One creepy line you don't cross even when you technically can.</p>`,
      narrationLead:
        "Welcome to chapter six. Personalization that works. Personalization is the easiest revenue AI play to overdo. AI now knows more about your prospect than you should be comfortable using in customer-facing communication. The wrong-side-of-the-line personalization costs trust faster than no personalization does. Three personalization tiers from light to deep. One creepy line you don't cross even when AI makes it technically easy. And one principle that beats cleverness every time.",
    },
    // SLIDE 2
    {
      title: 'Three personalization tiers',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The tiers',
      bodyHtml: `<p>Three tiers. Each tier has different mechanics, different cost, and different brand risk. Choose the tier per channel — don't mix tiers in the same campaign because it confuses both the customer and the optimisation.</p>`,
      narrationLead:
        "Three personalization tiers. Each tier has different mechanics, different cost to run, and different brand risk profile. Choose the tier deliberately per channel — don't accidentally mix tiers in the same campaign because the mix confuses both the customer and your own optimisation. Light, middle, deep. Let me cover each tier and where it fits.",
      steps: [
        {
          html: stepCard('flag', 'green', 'Tier 1 — Light (firmographic and segment)',
            "Email subject line varies by industry. Landing page headline varies by company size. Outreach varies by region. Mass scale, low brand risk, modest lift. Most teams should start here and stay here longer than they think."),
          narration:
            "Tier one. Light personalization. Firmographic and segment level. The email subject line varies by the prospect's industry — financial services prospects see a slightly different subject than healthcare prospects, both pulled from the same campaign. The landing page headline varies by company size. The outreach varies by region. Operates at full mass scale, brand risk is essentially zero because nothing referenced is individual to the prospect, lift is modest — typically ten to twenty percent on response rates. Most teams should start here and stay here longer than they think. Light tier done well outperforms deep tier done poorly.",
        },
        {
          html: stepCard('flag', 'amber', 'Tier 2 — Middle (behavioral and intent signal)',
            "Outreach references a recent action — a content download, a webinar attended, a feature page visited. Operates per prospect, references behaviour the prospect knows is observable. Moderate lift, low brand risk if the reference is clean."),
          narration:
            "Tier two. Middle personalization. Behavioral and intent signal level. The outreach references something the prospect actually did — they downloaded a content piece, attended a webinar, visited a specific feature page multiple times. The reference is to behaviour the prospect knows is observable. Operates per prospect rather than per segment. Lift is moderate — typically twenty to forty percent on response rates compared to no-personalization baseline. Brand risk is low if the reference is clean and the prospect remembers doing the action. Brand risk rises sharply if the reference is to behaviour the prospect doesn't remember or doesn't consider observable — which is the bridge into tier three.",
        },
        {
          html: stepCard('flag', 'red', 'Tier 3 — Deep (individual context and inferred intent)',
            "AI reasons across the prospect's public posts, role history, recent professional events, inferred priorities — to craft outreach referencing what the AI inferred. High lift if done well, very high brand risk if even slightly off."),
          narration:
            "Tier three. Deep personalization. Individual context and inferred intent. AI reasons across the prospect's public LinkedIn posts, their role history and tenure, recent professional events they spoke at, inferred priorities from their public writing. It crafts outreach that references what the AI inferred about the individual. Lift can be very high when done well — sixty to a hundred percent on response rates is plausible. Brand risk is also very high when even slightly off — the prospect feels surveilled, screenshots the email to their network, and the embarrassment travels. Deep tier requires careful editorial review per message, which means it can't operate at scale. Reserve it for high-value pursuit accounts where the AE has already qualified the relationship.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Most teams over-shoot the tier',
        "Most teams choose tier 3 because the demo was impressive — and operate at the volume of tier 1, which is where the creepy effect compounds. Start at tier 1. Move to tier 2 once tier 1 is mature. Only do tier 3 with high-value pursuit accounts."),
      calloutNarration:
        "Most teams over-shoot the tier because the deep-tier demo from the AI vendor was impressive. They then operate the deep tier at the volume of light tier — at thousands of prospects per week instead of dozens — which is exactly where the creepy effect compounds and the brand cost shows up. Start at tier one. Get the operating discipline right. Move to tier two once tier one is mature. Reserve tier three for high-value pursuit accounts where the account executive has already qualified the relationship and the deep personalisation lands as thoughtful research, not as surveillance.",
    },
    // SLIDE 3
    {
      title: 'The creepy line — three things you don\'t reference',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · The line',
      bodyHtml: `<p>Three things AI now knows about prospects. Three things you don't reference in customer-facing outreach — even when the AI surfaces them and even when technically observable.</p>`,
      narrationLead:
        "Three things AI now knows about your prospects from public data. Three things you don't reference in customer-facing outreach — even when the AI surfaces them in its account brief, even when they're technically observable, even when referencing them would clearly improve response rates. The creepy line. Cross it and you trade short-term response rates for long-term brand erosion. Hold it and you build the brand that gets the second meeting two years later.",
      steps: [
        {
          html: stepCard('x', 'red', 'Line 1 — Don\'t reference inferred personal life events',
            "AI can infer from LinkedIn that someone just got married, had a child, is going through a divorce, lost a parent. Don't reference any of it. Even if the reference is sympathetic. Even if the prospect posted about it publicly."),
          narration:
            "Line one. Don't reference inferred personal life events. The AI can — and will, if not bounded — infer from LinkedIn posts that someone just got married, had a child, is going through a divorce, lost a parent. Don't reference any of it in a commercial outreach. Even if the reference is sympathetic. Even if the prospect posted publicly about it. The reason — commercial outreach referencing personal life events feels predatory regardless of intent. The prospect's reaction is consistent across cultures and industries — they feel watched, they screenshot, they share. Train the model with explicit instruction to exclude personal life signals from outreach prompts. Verify the exclusion holds.",
        },
        {
          html: stepCard('x', 'red', 'Line 2 — Don\'t reference internal signals from third-party sources',
            "AI sometimes surfaces signals from data brokers — recent employee headcount, attrition rates, internal product issues from review sites. These are technically available. Don't reference them in outreach — they're not signals the prospect expects you to have."),
          narration:
            "Line two. Don't reference internal organisational signals sourced from data brokers, employee review sites, or scraped internal documents. AI sometimes surfaces these — recent employee headcount changes, attrition rates from data brokers, internal product issues reported on employee review sites, scraped internal documents. These are technically available somewhere on the public internet — but they are not signals the prospect expects an external commercial party to have. Referencing them reads as surveillance. The prospect concludes you have access to information they didn't agree to share. The brand damage is hard to reverse because trust is hard to rebuild. Bound the AI to public corporate signals — earnings, press, official site, official LinkedIn — and explicitly exclude broker and review-site sources.",
        },
        {
          html: stepCard('x', 'red', 'Line 3 — Don\'t reference inferred health or political position',
            "Inferred from group memberships, content engagement, public posts. Both categories are legally protected in many jurisdictions. Referencing them in commercial outreach creates legal exposure on top of brand cost. Easy line to hold."),
          narration:
            "Line three. Don't reference inferred health status or political position. AI can infer these from group memberships the prospect joined, content the prospect engaged with, public posts the prospect made. Both categories are legally protected in many jurisdictions — referencing them in commercial outreach creates legal exposure under GDPR, the EU AI Act, and emerging US state privacy laws on top of the brand cost. Easy line to hold once named. Explicitly exclude these inference categories from any personalisation prompt sent to the AI. Verify the exclusion at the prompt level and in the output review.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Relevant beats clever',
      iconKey: 'lightbulb',
      eyebrow: 'Lesson 3 · The principle',
      bodyHtml: `<p>The principle that beats every clever-personalization vendor demo. State it simply, hold it firmly, apply it to every personalization decision.</p>`,
      narrationLead:
        "The principle that beats every clever-personalization vendor demo. State it simply. Hold it firmly. Apply it to every personalization decision the team makes. The principle saves teams from the recurring mistake — confusing personalization that's impressive with personalization that converts. The two are not the same. The two often diverge significantly.",
      steps: [
        {
          html: stepCard('lightbulb', 'amber', 'The principle',
            "Relevant beats clever. Always. The prospect doesn't reward you for knowing something obscure about them. The prospect rewards you for knowing something useful about their actual problem."),
          narration:
            "The principle. Relevant beats clever. Always, in every channel, at every personalization tier. The prospect does not reward you for knowing something obscure about them — the obscure detail produces the screenshot to their network. The prospect rewards you for knowing something useful about their actual current business problem. The useful reference produces the response. The two are different intentions, and they read differently in the inbox. Train the team — and the AI — to optimise for usefulness, not for cleverness.",
        },
        {
          html: stepCard('check', 'green', 'The test before sending',
            "Read the outreach as if it landed in your own inbox. Would you respond? Would you forward it to your network with a comment about the company? Read it both ways before sending."),
          narration:
            "The test before sending. Read the outreach as if it had landed in your own inbox today, from a stranger. Would you respond — because something in it is useful to your current work? Would you forward it to your network with a comment about the company — meaning something in it crossed a line you weren't expecting? Read both ways before sending. The forward-test catches things the respond-test misses. Many AI-generated outreaches pass the respond-test and fail the forward-test — which is exactly the pattern that produces brand damage at scale. Make the forward-test routine before any AI-personalised outreach ships.",
        },
        {
          html: stepCard('users', 'blue', 'Train the team on the principle, weekly',
            "Once a week, the team reviews two outreach examples — one that worked, one that crossed the line. Five minutes. Repeated weekly, the team internalises the line. Without the rhythm, the line drifts within a quarter."),
          narration:
            "Train the team on the principle weekly. Once a week, the team reviews two real outreach examples from the previous week — one that worked, and one that crossed a line either by getting a complaint or by reading as creepy on internal review. Five minutes. Repeated weekly. The team internalises where the line is for your company, your industry, your customers. Without the weekly rhythm, the line drifts within a quarter — usually toward more aggressive personalisation because the dashboards reward the short-term response rate over the long-term brand cost. Hold the rhythm. It's a small investment with large compounding return.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter seven — sales call AI.</p>`,
      narrationLead:
        "Three anchors before chapter seven — sales call AI, transcripts to action.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three tiers, chosen deliberately',
            "Light (firmographic) · Middle (behavioural) · Deep (individual inferred). Start light, mature operations, move up gradually. Reserve deep tier for high-value pursuit accounts only."),
          narration:
            "One. Three personalization tiers, chosen deliberately. Light tier — firmographic and segment level, mass scale, low brand risk, modest lift. Middle tier — behavioural and intent signal, per prospect, moderate lift. Deep tier — individual context and inferred intent, requires editorial review, can't scale, reserve for high-value pursuit accounts. Most teams over-shoot the tier; start light and mature the operating discipline before moving up.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three lines you don\'t cross',
            "Inferred personal life events · internal signals from data brokers and review sites · inferred health or political position. Bound the AI explicitly. Verify the exclusion holds. Brand and legal cost is asymmetric."),
          narration:
            "Two. Three creepy-line categories you don't cross. Inferred personal life events from public posts. Internal organisational signals from data brokers, employee review sites, or scraped documents. Inferred health status or political position. Bound the AI explicitly to exclude these from personalization prompts. Verify the exclusions hold in actual outputs. The brand and legal cost of crossing any of the three is asymmetric — small lift in response rate, large risk in brand and regulatory exposure.",
        },
        {
          html: stepCard('check', 'green', 'Three — Relevant beats clever, every time',
            "Optimise for useful, not for impressive. Run the forward-test as well as the respond-test. Train the team on the principle weekly — five minutes — or the line drifts within a quarter."),
          narration:
            "Three. Relevant beats clever, every time. Optimise outreach for useful, not for impressive — the prospect rewards usefulness, not cleverness. Run the forward-test before sending — would the prospect screenshot this and share it with a comment about your company? Train the team on the principle in a weekly five-minute rhythm. Without the rhythm, the line drifts within a quarter, usually in the wrong direction because short-term metrics reward more aggressive personalization than long-term brand cost reveals.",
        },
      ],
      narrationTrail:
        "Chapter seven — sales call AI. Four extractions from every call, the coaching loop that improves reps, the privacy posture customers now expect. See you there.",
    },
  ],
}
