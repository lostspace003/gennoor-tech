import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFoundationsChapter05: Chapter = {
  courseId: 'ai-foundations',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-evaluating-ai-claims',
  title: 'How to evaluate AI claims (and tools)',
  subtitle: 'A 90-second filter for the noise — so you stop buying hype and start buying value.',
  slides: [
    // ──────────────────────────────────────────────────────
    // SLIDE 1 — Opening
    // ──────────────────────────────────────────────────────
    {
      title: 'How to evaluate AI claims (and tools)',
      iconKey: 'search',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Every week there&rsquo;s a new AI tool, a new vendor, a new breathless announcement. Hype is the enemy of value. In the next few minutes, you&rsquo;ll get a <em>5-question framework</em> for evaluating any AI pitch in ninety seconds — plus the four red flags that should make you walk away.</p>`,
      narrationLead:
        "Hi, and welcome to chapter five. Today we're talking about how to evaluate AI claims — and the tools behind them. Here's the thing. Every single week, there's a new AI tool. A new vendor. A new breathless announcement. And hype, honestly, is the enemy of value. So in the next few minutes, I'll give you a 5-question framework. One you can use to evaluate any AI pitch — in ninety seconds. Plus four red flags that should make you walk away. Let's get into it.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 2 — The 5-question framework
    // ──────────────────────────────────────────────────────
    {
      title: 'The 5-question framework',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · The vendor filter',
      bodyHtml: `<p>Use this on every AI vendor pitch — every internal proposal — every &ldquo;we should buy this&rdquo; suggestion. If a tool can&rsquo;t answer all five clearly, it&rsquo;s <em>not ready</em> for your environment.</p>`,
      narrationLead:
        "So let's start with the framework itself. Five questions. Use them on every AI vendor pitch. Every internal proposal. Every quote-unquote we should buy this suggestion that lands on your desk. Here's the rule. If a tool can't answer all five — clearly — it's not ready for your environment. Let me walk you through them, one by one.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Question 1 — What specific problem does this solve?',
            "Not &ldquo;AI for sales.&rdquo; Not &ldquo;AI for HR.&rdquo; A <em>specific, named workflow</em> with a measurable outcome. If the vendor can only describe the category, they&rsquo;re selling a category — not a solution."),
          narration:
            "Question one. What specific problem does this solve? And I mean specific. Not quote AI for sales unquote. Not quote AI for HR unquote. I want a specific, named workflow — with a measurable outcome. Because here's the truth. If the vendor can only describe the category? They're selling you the category — not a solution.",
        },
        {
          html: stepCard('calendar', 'blue', 'Question 2 — What does success look like in week 4?',
            "Every good vendor should be able to describe a four-week pilot with measurable success criteria. If they can&rsquo;t? The use case isn&rsquo;t crisp — and your pilot will drift."),
          narration:
            "Question two. What does success look like in week four? Every good vendor should be able to describe a four-week pilot. With measurable success criteria. If they can't? The use case isn't crisp. And your pilot will drift — guaranteed.",
        },
        {
          html: stepCard('shield', 'blue', 'Question 3 — Where does our data live?',
            "Does it leave our tenant? Who has access? Is it used for training? What&rsquo;s the deletion policy? Vague answers here are not just a security problem — they&rsquo;re a <em>maturity</em> problem."),
          narration:
            "Question three. Where does our data live? Does it leave our tenant? Who has access? Is it used to train their next model? What's the deletion policy? And listen — vague answers here are not just a security problem. They're a maturity problem. The vendor either doesn't know — or doesn't want you to know. Both are bad.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Question 4 — What happens when it gets it wrong?',
            "Every AI tool makes mistakes. The good vendors tell you <em>exactly</em> how often, why, and what the human-in-the-loop pattern looks like. Vendors who pretend their tool doesn&rsquo;t fail are the ones whose failures will surprise you."),
          narration:
            "Question four. What happens when it gets it wrong? Because every AI tool makes mistakes. Every one. The good vendors tell you exactly how often. Why. And what the human-in-the-loop pattern looks like. The vendors who pretend their tool doesn't fail? Those are exactly the ones whose failures will surprise you. In production. Loudly.",
        },
        {
          html: stepCard('zap', 'amber', "Question 5 — What's the all-in cost over 12 months?",
            "Not the per-seat license. Implementation, integration, training, infrastructure, ongoing tuning, support — the full bill. The headline number is <em>rarely</em> the real number."),
          narration:
            "And question five. What's the all-in cost over twelve months? Not the per-seat license — the full bill. Implementation. Integration. Training. Infrastructure. Ongoing tuning. Support. All of it. Here's a small truth about enterprise software. The headline number is rarely the real number. Get the real one.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The 90-second test',
        "Ask any vendor these five questions in ninety seconds. If they answer the first three crisply, and the last two with realistic specifics — take them seriously. If they pivot to &ldquo;let&rsquo;s set up a deeper conversation&rdquo; — you have your answer."),
      calloutNarration:
        "Here's the simple test that ties it all together. The ninety-second test. Ask any vendor these five questions — in ninety seconds. If they answer the first three crisply. And the last two with realistic specifics? Take them seriously. But if they pivot to quote let's set up a deeper conversation unquote? You already have your answer. They don't know.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 3 — 4 red flags
    // ──────────────────────────────────────────────────────
    {
      title: '4 red flags that should make you walk away',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · Watch for these',
      bodyHtml: `<p>Some pitches answer the five questions and still aren&rsquo;t worth your time. Here are the four phrases that, by themselves, are usually enough to end the conversation.</p>`,
      narrationLead:
        "Alright. So some pitches will answer the five questions — and still aren't worth your time. Why? Because they say things that, by themselves, should end the conversation. Here are the four red flags. The four phrases I want you to listen for. When you hear them — walk away.",
      steps: [
        {
          html: stepCard('x', 'red', 'Red flag 1 — "Our AI achieves 99% accuracy"',
            "Accuracy on <em>what</em>? Measured how? Compared to what baseline? On their data — or yours? A claim without those qualifications is marketing, not science. Good vendors name the test set, the metric, and the baseline."),
          narration:
            "Red flag number one. Quote our AI achieves ninety-nine percent accuracy unquote. Okay. Accuracy on what? Measured how? Compared to what baseline? On their data — or yours? A claim without those qualifications is not science. It's marketing. The good vendors will name the test set. The metric. The baseline. And they'll tell you performance on your data may differ.",
        },
        {
          html: stepCard('x', 'red', 'Red flag 2 — "AI replaces your team"',
            "Almost nothing in business today is a candidate for full replacement. Augmentation works. Replacement, rarely — at least not safely or quickly. Vendors who lead with &ldquo;replacement&rdquo; are signalling either <em>inexperience</em> with deployment, or willingness to <em>over-promise</em>. Both are problems."),
          narration:
            "Red flag number two. Quote AI replaces your team unquote. Or your function. Or your role. Here's the deal. Almost nothing in business today is a candidate for full replacement. Augmentation works. Replacement? Rarely. At least not safely. Not quickly. So vendors who lead with replacement? They're signalling either inexperience with real deployment. Or willingness to over-promise. Both are problems.",
        },
        {
          html: stepCard('x', 'red', "Red flag 3 — \"You don't need to worry about the data\"",
            "You <em>always</em> need to worry about the data. Where it lives, who can access it, what happens if it leaks, how it&rsquo;s used for training. A vendor who waves this away either doesn&rsquo;t understand it — or hopes you don&rsquo;t. Make them produce a written DPA before the conversation goes further."),
          narration:
            "Red flag number three. Quote you don't need to worry about the data unquote. You always need to worry about the data. Always. Where it lives. Who can access it. What happens if it leaks. How it's used for training. A vendor who waves this away either doesn't understand it — which is bad. Or is hoping you don't — which is worse. Make them produce a written DPA. A data processing agreement. Before any conversation goes further.",
        },
        {
          html: stepCard('x', 'red', 'Red flag 4 — "We have proprietary AI"',
            "Most vendors don&rsquo;t. Most use OpenAI&rsquo;s, Anthropic&rsquo;s, Google&rsquo;s, or open-source models under the hood — with prompt engineering, RAG, and a UI on top. Nothing wrong with that. But &ldquo;proprietary AI&rdquo; <em>without naming the underlying model</em> usually means &ldquo;thin wrapper&rdquo; in a nicer outfit."),
          narration:
            "And red flag number four. Quote we have proprietary AI unquote. Most vendors don't. Most use OpenAI's models. Or Anthropic's. Or Google's. Or open source. Under the hood — with prompt engineering, retrieval, and a UI on top. And honestly? There's nothing wrong with that. It's a real category. But vendors who claim proprietary AI without naming the underlying model? They're usually hiding the fact that they're a thin wrapper. In a nicer outfit. So ask. Which foundation model are you using? The answer should be specific. Very specific.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 4 — A practical example
    // ──────────────────────────────────────────────────────
    {
      title: 'A practical example — pitch, translated honestly',
      iconKey: 'lightbulb',
      eyebrow: 'Lesson 3 · Pitch translation',
      bodyHtml: `<p>Let&rsquo;s run a real-sounding pitch through the framework — and translate it from marketing-speak into what the vendor is <em>actually</em> saying.</p>`,
      narrationLead:
        "Okay. Let's make this concrete. Let me run a real-sounding pitch through the framework — and then translate it. From marketing-speak. Into what the vendor is actually saying. You'll start hearing this pattern everywhere once you've seen it once.",
      calloutHtml: `<div class="callout callout-info">
        <div class="callout-icon">${`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>`}</div>
        <div>
          <div class="callout-title">The pitch — as you&rsquo;ll hear it</div>
          <div class="callout-body">
            <p><em>&ldquo;Our enterprise AI agent achieves 96% accuracy in customer service, replaces 60% of tier-1 support, and is fully compliant out of the box.&rdquo;</em></p>
            <p><strong>What it really means:</strong></p>
            <ul>
              <li>&ldquo;96% accuracy&rdquo; — on <em>their</em> test data. May differ wildly on yours.</li>
              <li>&ldquo;Replaces 60% of tier-1 support&rdquo; — ignores everything that happens when the bot is wrong, and who pays for the cleanup.</li>
              <li>&ldquo;Fully compliant out of the box&rdquo; — unverifiable without seeing their DPA, their security posture, and where your data actually lives.</li>
            </ul>
            <p>Ask the five questions. Watch what survives.</p>
          </div>
        </div>
      </div>`,
      calloutNarration:
        "Listen to this pitch. Quote — our enterprise AI agent achieves ninety-six percent accuracy in customer service. Replaces sixty percent of tier-one support. And is fully compliant out of the box — unquote. Sounds great, right? Now let's translate. Ninety-six percent accuracy? On their test data. May differ wildly on yours. Replaces sixty percent of tier-one? Ignores everything that happens when the bot is wrong. And who pays for the cleanup. Fully compliant out of the box? Unverifiable. Without seeing their DPA. Their security posture. And where your data actually lives. So here's what you do. You ask the five questions. And you watch — carefully — what survives the translation.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 5 — Build your own short-list
    // ──────────────────────────────────────────────────────
    {
      title: 'Build your own short-list — not the vendor’s',
      iconKey: 'flag',
      eyebrow: 'Lesson 4 · Your filter, not theirs',
      bodyHtml: `<p>The best filter for AI tools isn&rsquo;t the framework, the red flags, or any vendor scorecard. It&rsquo;s <em>your own list</em>. Before any AI procurement — write down the three to five specific workflows you want to improve, the measurable success criteria for each, and the constraints around data, regulation, and integration. Then evaluate vendors against <strong>your</strong> list — not theirs. A vendor who can&rsquo;t map their tool to your list cleanly is not the right vendor. No matter how good the demo looks.</p>`,
      narrationLead:
        "Okay. Final lesson — and honestly, the most important one. The best filter for AI tools isn't the framework. It isn't the red flags. It isn't any vendor scorecard. It's your own list. Before any AI procurement — sit down and write three things. The three to five specific workflows you want to improve. The measurable success criteria for each. And the constraints — around data, regulation, and integration. Then — and this is the trick — evaluate vendors against your list. Not theirs. Because here's what happens otherwise. Vendors run beautiful demos. Demos are designed to wow. So if you don't have your own list? You'll fall in love with whatever they show you. But if you have your list? Then the question becomes very simple. Does this tool — clearly — solve one of my five workflows? If yes, keep looking. If no, walk away. A vendor who can't map their tool to your list cleanly is not the right vendor. No matter how good the demo looks.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 6 — Takeaways
    // ──────────────────────────────────────────────────────
    {
      title: 'Key takeaways from chapter 5',
      iconKey: 'trophy',
      eyebrow: 'Closing',
      bodyHtml: `<ul class="takeaways">
        <li data-step="1"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Five questions filter most AI pitches — specific problem · success in week 4 · where data lives · failure mode · all-in cost.</span></li>
        <li data-step="2"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Four red flags — unqualified accuracy claims · &ldquo;replaces your team&rdquo; · &ldquo;don&rsquo;t worry about data&rdquo; · &ldquo;proprietary AI&rdquo; without naming the model.</span></li>
        <li data-step="3"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Translate every pitch — &ldquo;96% accuracy&rdquo; means &ldquo;on their data, not yours&rdquo; until proven otherwise.</span></li>
        <li data-step="4"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Start with your own short-list of workflows and constraints — then evaluate vendors against <em>your</em> list, not theirs.</span></li>
      </ul>`,
      narrationLead:
        "Alright — let's wrap up chapter five. Four takeaways. Number one. Five questions filter most AI pitches. Specific problem. Success in week four. Where the data lives. The failure mode. And the all-in cost. Number two. Four red flags. Unqualified accuracy claims. Quote replaces your team unquote. Quote don't worry about the data unquote. And quote proprietary AI unquote — without naming the model under the hood. Number three. Translate every pitch. When you hear quote ninety-six percent accuracy unquote — assume it means on their data, not yours. Until proven otherwise. And number four. Start with your own short-list. Your workflows. Your constraints. Then evaluate vendors against your list — not theirs. That's chapter five. In chapter six — we move from theory to hands-on. Three Copilot prompts you can run on your real work this week. See you there.",
    },
  ],
}
