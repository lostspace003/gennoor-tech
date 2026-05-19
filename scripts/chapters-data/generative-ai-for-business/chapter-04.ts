import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const genAiBizChapter04: Chapter = {
  courseId: 'generative-ai-for-business',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-vendor-evaluation',
  title: 'Vendor evaluation',
  subtitle: 'A 90-second filter that cuts through the noise — and the five questions that separate signal from pitch.',
  slides: [
    // SLIDE 1
    {
      title: 'Vendor evaluation',
      iconKey: 'search',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">There are now 4,000+ AI vendors competing for your attention. Most of them have a beautiful demo. Most of them ship something different than they demoed. In the next few minutes, the 90-second filter and the five questions that protect your team from the wrong choice.</p>`,
      narrationLead:
        "Welcome to chapter four. Vendor evaluation. There are now over four thousand AI vendors competing for your attention. Most of them have a beautiful demo. Most of them — when you sign the contract — ship something noticeably different from what they demoed. In the next few minutes, the ninety-second filter and the five questions that protect your team from the wrong vendor choice. Used well, they save you a quarter of regret per year.",
    },
    // SLIDE 2
    {
      title: 'The 90-second filter — three red flags',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 1 · The filter',
      bodyHtml: `<p>Three red flags. If a vendor’s opening pitch contains any of these — you can save 60 minutes of meeting by ending the conversation in 90 seconds.</p>`,
      narrationLead:
        "Three red flags. If a vendor's opening pitch contains any of these, you can save sixty minutes of meeting by ending the conversation politely in ninety seconds. Watch for them at the very start of the first call.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Red flag 1 — “We use cutting-edge AI”',
            "Cutting-edge tells you nothing. Every vendor says it. Ask — which model, which provider, which year. If the answer is vague — they're either uninformed or hiding something. End politely."),
          narration:
            "Red flag one. The vendor says — we use cutting-edge AI. Cutting-edge tells you absolutely nothing. Every vendor says it. Ask a direct follow-up — which model are you using, which provider, what year was it trained. If the answer is vague — they're either uninformed about their own product, or they're hiding something. End the meeting politely. The vendor who knows their stack will name it within ten seconds. The vendor who waffles is wasting your time.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Red flag 2 — “Our AI is proprietary”',
            "Most claims of proprietary AI mean — we wrap a public model behind our API. That's fine — but be clear about it. If the vendor genuinely won't tell you, you can't evaluate data flow, security, or sovereignty. Walk away from opacity."),
          narration:
            "Red flag two. The vendor says — our AI is proprietary. Most of the time this means we wrap a public model behind our API. Which is fine — but be clear about it. Ask which underlying model. If the vendor genuinely won't tell you — citing trade secrets — you cannot evaluate the data flow, the security posture, or the data residency. You're being asked to sign a contract for capability you cannot verify. Walk away from opacity. Transparent vendors will tell you exactly what's under the hood.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Red flag 3 — “We can do anything”',
            "The vendor who says they can do anything has built nothing well. The honest vendor names three specific use cases they ship, and is honest about the dozen they don't. Specificity wins. Generality is a tell."),
          narration:
            "Red flag three. The vendor says — we can do anything. We can build any AI use case you have. The vendor who says they can do anything has typically built nothing well. The honest vendor names three specific use cases they ship reliably. And is honest about the dozen others they don't. Specificity is a sign of operational maturity. Generality is a tell — usually that the vendor is a small team trying to win any deal they can. Save your time. Work with the specific vendor.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Use the 90-second filter on every first call',
        "These three red flags eliminate roughly 60% of the AI vendors in the market today. The 40% that pass are the ones worth a real evaluation. Use the filter consistently — it saves you a meeting a week."),
      calloutNarration:
        "Use this ninety-second filter on every first call. The three red flags eliminate roughly sixty percent of the AI vendors in the market today. The forty percent that pass the filter are the ones worth a real evaluation conversation. Use the filter consistently — across every vendor pitch your team takes — and you'll save roughly a meeting a week. That's a quarter of every year reclaimed for the actual work. Worth the discipline.",
    },
    // SLIDE 3
    {
      title: 'The five questions for vendors that pass the filter',
      iconKey: 'search',
      eyebrow: 'Lesson 2 · The questions',
      bodyHtml: `<p>For vendors that passed the 90-second filter — five questions to ask in the first real meeting. The answers separate signal from pitch.</p>`,
      narrationLead:
        "For the vendors that passed the ninety-second filter, five questions to ask in the first real evaluation meeting. The answers separate signal from pitch. Use these questions consistently across vendors — and compare answers, not promises.",
      steps: [
        {
          html: stepCard('search', 'blue', '1 · Show me three actual customer outcomes — by name',
            "Not a logo wall. Three named customers, with their actual measured outcomes. If the vendor won't or can't — they don't have the customers, or the outcomes weren't what the brochure says."),
          narration:
            "Question one. Show me three actual customer outcomes — by name. Not a logo wall on a slide. Three specific named customers, with their actual measured outcomes. The percentage improvement, the timeline, the scope. If the vendor won't or can't provide three named references — they either don't have the customers, or the outcomes weren't what their brochure says they are. Either way, you don't have enough signal to proceed.",
        },
        {
          html: stepCard('search', 'blue', '2 · Walk me through where my data goes during inference',
            "On a whiteboard. End to end. Which servers, which regions, what gets logged, what gets deleted, when. A vendor that can't draw this in five minutes hasn't thought about it — and your security team won't approve them."),
          narration:
            "Question two. Walk me through where my data goes during inference. Ask them to draw it on a whiteboard. End to end. Which servers. Which regions. What gets logged. What gets deleted. When deletion happens. A vendor that can't draw this in five minutes hasn't thought about it. Your security team won't approve them when you eventually bring them in. So filter for clarity here, early. The vendors who handle this question crisply are the ones who have done this with regulated customers before. The vendors who waffle are the ones who haven't.",
        },
        {
          html: stepCard('search', 'amber', '3 · What happens when your model gets it wrong?',
            "Every model gets some answers wrong. The honest vendor tells you what their error rate is, how it's monitored, what the fallback is, and how customers find out. The dishonest vendor pretends errors don't happen. They do."),
          narration:
            "Question three. What happens when your model gets an answer wrong? Every model gets some answers wrong. That's a statement of fact, not a criticism. The honest vendor will tell you what their error rate is on their primary use cases. How errors are monitored in production. What the fallback path is when an error is detected. And how customers find out their answer was wrong. The dishonest vendor will pretend errors don't really happen with their tool. They do. Don't accept the pretence.",
        },
        {
          html: stepCard('search', 'amber', '4 · What does adoption look like in your customers six months in?',
            "Not the launch press release. The actual usage rate at month six. If the vendor doesn't track adoption — that's a major signal about how invested they are in customer success. Adoption tracking is now table-stakes."),
          narration:
            "Question four. What does adoption look like in your customers six months in? Not the launch press release. Not the announcement deck. The actual usage rate at month six. Percentage of licensed users active per week. Time saved per user. If the vendor doesn't track customer adoption — that's a major signal about how invested they are in your success post-sale. Adoption tracking is now table stakes for any serious AI vendor. Treat its absence as a yellow flag.",
        },
        {
          html: stepCard('search', 'green', '5 · What happens to my data if we end the contract?',
            "Returned in usable format within 30 days. Then deleted with written certification. Standard cloud contract terms — apply them here. If the vendor pushes back or vagues out — your data has no exit. Walk away."),
          narration:
            "Question five. What happens to my data if we end the contract with you? You want a specific answer. Returned in a usable format within thirty days. Then deleted with written certification of deletion. These are standard cloud contract terms — apply them to your AI vendor. If the vendor pushes back on this question or gives a vague answer — your data effectively has no exit path. You're signing into lock-in. Walk away. The vendor who handles this question well is the vendor who has done it before, with serious customers.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'How to compare vendors — the scoring sheet',
      iconKey: 'target',
      eyebrow: 'Lesson 3 · Comparing',
      bodyHtml: `<p>After you’ve evaluated 2–3 vendors with the five questions — score them on the same sheet. Decision becomes obvious.</p>`,
      narrationLead:
        "After you've evaluated two or three vendors with the same five questions, score them on the same sheet. Five rows, three columns. The decision becomes obvious. And the conversation with the vendor you didn't pick becomes easy — you can show them exactly what they fell short on, which they often appreciate.",
      steps: [
        {
          html: stepCard('check', 'blue', 'Score 1–5 on each question',
            "1 = vague or evasive. 3 = competent answer with some gaps. 5 = specific, with named references and clear diagrams. Most vendors will land 2–4. The 5s are rare and worth recognising."),
          narration:
            "Score each vendor one to five on each of the five questions. One means vague or evasive. Three means competent answer with some gaps. Five means specific, with named references, clear diagrams, and confidence under follow-up questions. Most vendors will land in the two to four range on any given question. The five answers are rare and worth recognising. They're a sign of operational maturity.",
        },
        {
          html: stepCard('check', 'amber', 'Total out of 25',
            "Total of 25. Realistically, a serious vendor lands 17–22. Below 15 — they're not ready for your team. Above 22 — they are likely a strong candidate, even if pricing is higher."),
          narration:
            "Total out of twenty-five. Realistically, a serious AI vendor lands somewhere between seventeen and twenty-two. Below fifteen — they're not ready for your team yet. Above twenty-two — they are likely a strong candidate, even if their pricing is at the higher end of your evaluated range. Pricing matters. But the score matters more — because the vendor who scores well is the vendor whose deployment ships. The vendor who scores poorly is the vendor whose deployment slips three quarters.",
        },
        {
          html: stepCard('check', 'green', 'Share the sheet with the team and procurement',
            "Don't keep the scoring in your head. Share it. Procurement and IT will appreciate the structure. It also makes the conversation with the runner-up vendor honest — and many of them come back next year stronger."),
          narration:
            "Share the scoring sheet with your team and with procurement. Don't keep it in your head. Procurement and your IT team will appreciate the structured input — it makes their part of the evaluation easier. The scoring sheet also makes the conversation with the runner-up vendor honest. You can show them exactly where they fell short. Many vendors take that feedback seriously and come back the next year meaningfully stronger. The discipline propagates. That's a quietly positive effect of using the same evaluation rigorously.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 5 — pilot design.</p>`,
      narrationLead:
        "Three anchors before we move to pilot design in chapter five.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — The 90-second filter eliminates 60% of vendors',
            "Three red flags: cutting-edge claims · proprietary opacity · we-can-do-anything. End in 90 seconds. Save the meeting."),
          narration:
            "One. The ninety-second filter eliminates roughly sixty percent of AI vendors in the market today. Three red flags. Cutting-edge claims. Proprietary opacity. We can do anything. End the meeting politely within ninety seconds when any of the three appears. Save the meeting. Save the team.",
        },
        {
          html: stepCard('check', 'green', 'Two — Five questions for vendors that pass',
            "Named references · data path · error handling · adoption at month 6 · data exit. Same questions, every vendor."),
          narration:
            "Two. Five questions for vendors that pass the filter. Three named references. The data path on a whiteboard. What happens when the model is wrong. Adoption rate at month six. Data exit terms. Use the same five questions consistently across every vendor. The comparison becomes possible.",
        },
        {
          html: stepCard('check', 'green', 'Three — Score it, share it',
            "Total out of 25. Serious vendors land 17–22. Share the sheet with procurement and IT. Give runners-up honest feedback. The discipline propagates."),
          narration:
            "Three. Score the answers, total out of twenty-five, and share the sheet with procurement and IT. Serious vendors land seventeen to twenty-two. Give runners-up honest feedback on where they fell short. Many come back the next year stronger. The discipline propagates across the vendor ecosystem you work with.",
        },
      ],
      narrationTrail:
        "Chapter five — pilot design. The four-week template that ships something measurable. See you there.",
    },
  ],
}
