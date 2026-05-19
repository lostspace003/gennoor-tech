import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFoundationsChapter01: Chapter = {
  courseId: 'ai-foundations',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-what-is-ai',
  title: 'What is AI? (Without the hype)',
  subtitle: 'A working definition that survives contact with reality.',
  slides: [
    // ──────────────────────────────────────────────────────
    // SLIDE 1 — Opening
    // ──────────────────────────────────────────────────────
    {
      title: 'What is AI? (Without the hype)',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">Before you can use AI well, you need a working definition that survives contact with reality. In the next few minutes, we'll cut through three years of marketing noise — and look at three things AI is decisively <em>not</em>.</p>`,
      narrationLead:
        "Hi, and welcome to chapter one. Today we're talking about what AI actually is — without the hype. Here's the thing. Before you can use AI well at work, you really need a working definition. One that survives contact with reality. So in the next few minutes, we're going to cut through three years of marketing noise. And we'll also look at three things AI is — decisively — not. Let's get into it.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 2 — AI vs ML vs GenAI
    // ──────────────────────────────────────────────────────
    {
      title: 'AI, machine learning, and generative AI',
      iconKey: 'brain',
      eyebrow: 'Lesson 1 · Definitions',
      bodyHtml: `<p>Vendors use these three terms interchangeably. They&rsquo;re not the same. Getting them straight is the first step to spotting which problems each one can solve.</p>`,
      narrationLead:
        "So let's start with three terms you hear everywhere. AI. Machine learning. And generative AI. Vendors use these interchangeably — but they're not the same. And getting them straight is the very first step to spotting which problems each one can actually solve. Let's break them down, one by one.",
      steps: [
        {
          html: stepCard('brain', 'blue', 'AI · Artificial Intelligence',
            "The umbrella term for any system that performs tasks normally requiring human intelligence — recognising faces, translating languages, drafting emails. It's a <em>goal</em>, not a technique."),
          narration:
            "First up — AI, or Artificial Intelligence. Think of this as the umbrella term. It covers any system that performs tasks that normally would require human intelligence. Things like recognising faces. Translating languages. Drafting emails. The key thing to remember? AI is a goal — not a technique.",
        },
        {
          html: stepCard('cog', 'blue', 'ML · Machine Learning',
            'A specific technique for achieving AI. Instead of programming the rules, you show a system many examples and let it figure out the patterns. Spam filters, fraud detection, and recommendation engines all use ML.'),
          narration:
            "Next — machine learning. Or ML. This is a specific technique for achieving AI. Now here's what makes it different. Instead of programming the rules — like you would in old-school software — you show the system many examples. And you let it figure out the patterns on its own. Your spam filter? That uses ML. Fraud detection? ML. Netflix recommendations? Also ML.",
        },
        {
          html: stepCard('sparkles', 'amber', 'GenAI · Generative AI',
            'A recent subset of ML that learned from <em>so much</em> text and so many images that it can produce new text and images on demand. ChatGPT, Microsoft Copilot, Claude, and Gemini — these are generative AI.'),
          narration:
            "And finally — generative AI. GenAI for short. This is a recent subset of machine learning that learned from so much text — and so many images — that it can produce new text and new images on demand. ChatGPT? That's generative AI. Microsoft Copilot? Same. Claude. Gemini. All generative AI.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Shorthand to remember',
        'AI is the destination. ML is the road. Generative AI is the truck that arrived at the destination in late 2022 — and changed which problems we now think are worth solving.'),
      calloutNarration:
        "Here's a shorthand to remember all this. AI is the destination. Machine learning is the road. And generative AI? That's the truck that arrived at the destination in late 2022 — and changed which problems we now think are worth solving. Keep that picture in your head.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 3 — Three things AI is NOT
    // ──────────────────────────────────────────────────────
    {
      title: 'Three things AI is decisively NOT',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · Common myths',
      bodyHtml: `<p>Half the bad decisions about AI come from misunderstanding what it <em>isn't</em>. Three myths worth retiring today.</p>`,
      narrationLead:
        "Alright. Now for something equally important. Half the bad decisions about AI come from misunderstanding what it is not. So let me give you three myths that are worth retiring today.",
      steps: [
        {
          html: stepCard('x', 'red', 'Myth one — AI is sentient',
            "AI does not understand, the way you and I understand. It <em>predicts</em>. ChatGPT isn't &lsquo;thinking about your question&rsquo; — it's computing the statistically most likely next word, given everything before. That doesn't make it less useful. But it should change how you trust its output."),
          narration:
            "Myth number one — AI is sentient. It is not. AI does not understand, the way you and I understand. It predicts. When you ask ChatGPT something, it isn't sitting there thinking about your question. It's computing the statistically most likely next word — given everything that came before. That doesn't make it less useful. But it should change how you trust its output.",
        },
        {
          html: stepCard('x', 'red', 'Myth two — AI is infallible',
            "It produces fluent, confident-sounding text — that is sometimes completely wrong. The fluency comes from how it was trained. The wrongness comes from <em>the same place</em>. Always verify factual claims it makes — especially numbers, names, dates, and citations."),
          narration:
            "Myth number two — AI is infallible. Also not true. AI produces fluent, confident-sounding text — that is sometimes completely wrong. The fluency comes from how it was trained. And the wrongness? Comes from the same place. So always verify factual claims it makes. Especially numbers. Names. Dates. And citations. Don't skip this step.",
        },
        {
          html: stepCard('x', 'red', 'Myth three — AI is magic',
            "AI can only work with the information it has — what it was trained on, which is a snapshot of the past, and what you give it in your prompt, which is the present. It doesn't know your company's policies unless you tell it. It doesn't know what happened last week unless you supply that information."),
          narration:
            "And myth number three — AI is magic. It really isn't. AI can only work with the information it has. That means what it was trained on — a snapshot of the past. And what you give it in your prompt — the present. So it doesn't know your company's policies unless you tell it. And it doesn't know what happened last week, unless that information is supplied. No magic. Just statistics.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 4 — Why now (2022)
    // ──────────────────────────────────────────────────────
    {
      title: 'Why now — what changed in 2022',
      iconKey: 'calendar',
      eyebrow: 'Lesson 3 · The inflection point',
      bodyHtml: `<p>AI research has been going for <strong>seventy years</strong>. Two things made the recent wave different — the <em>scale</em> of training data, and an architectural breakthrough called the <em>Transformer</em>, introduced by Google researchers in 2017. Together, they produced language models so much better than what came before that, when ChatGPT launched in November 2022, the conversation about what AI can do for work — changed permanently.</p>`,
      narrationLead:
        "So you might be wondering — why are we suddenly talking about AI everywhere? AI research has been going for seventy years. So what changed? Two things, really. First — the scale of training data. We're talking about the entire public internet being used to train these models. Second — an architectural breakthrough called the Transformer, introduced by Google researchers back in 2017. Now, put those two things together — internet-scale training plus the Transformer architecture — and what you get are language models so much better than what came before. So much better that, when ChatGPT launched in November 2022, the conversation about what AI can do for work — changed permanently. And it changed for non-technical professionals. Not just specialists.",
      calloutHtml: calloutBlock('compass', 'info', 'Why this matters for your week',
        "You don't need to track research papers. But you should know — GenAI is genuinely different from the AI that came before. Different enough that the playbooks of 2019 don't apply. What changed is <em>who can benefit</em>. Five years ago, you needed a data science team. Now? You need a curious manager with thirty minutes."),
      calloutNarration:
        "Why does any of this matter for your week? Honestly — you don't need to track research papers. But you should know this. Generative AI is genuinely different from the AI that came before. Different enough that the playbooks of 2019 just don't apply anymore. And what really changed is who can benefit from AI. Five years ago, you needed a data science team. Now? You just need a curious manager — and thirty minutes.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 5 — Scope
    // ──────────────────────────────────────────────────────
    {
      title: "What this course doesn't cover",
      iconKey: 'compass',
      eyebrow: 'A note on scope',
      bodyHtml: `<p>This is a <em>foundations</em> course. It deliberately does not teach you to code, fine-tune a model, or architect a multi-agent system. It teaches you the mental model — and the practical workflows — that let you apply AI to your work this week. If you need the technical depth, the Builder track is where you go next.</p>`,
      narrationLead:
        "Quick note on scope before we move on. This is a foundations course. So it deliberately does not teach you to code, fine-tune a model, or architect a multi-agent system. What it does teach? The mental model. And the practical workflows that let you apply AI to your work — this week. If you need the technical depth, the Builder track is where you go next. But for now, we're keeping it grounded. Practical. Useful.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 6 — Takeaways
    // ──────────────────────────────────────────────────────
    {
      title: 'Key takeaways from chapter 1',
      iconKey: 'trophy',
      eyebrow: 'Closing',
      bodyHtml: `<ul class="takeaways">
        <li data-step="1"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>AI is the goal · ML is the technique · Generative AI is the recent wave that brought AI to non-technical work.</span></li>
        <li data-step="2"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>AI is not sentient · not infallible · not magic — it predicts, fluently, from training data and your prompt.</span></li>
        <li data-step="3"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>The 2022 inflection point was scale (internet-sized training data) plus architecture (the Transformer).</span></li>
        <li data-step="4"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>You don't need to be technical to benefit — you need a working mental model, and a willingness to try things.</span></li>
      </ul>`,
      narrationLead:
        "Alright — let's wrap up. Here are the four takeaways from chapter one. Number one. AI is the goal. ML is the technique. And generative AI is the recent wave that brought AI to non-technical work. Number two. AI is not sentient. Not infallible. Not magic. It predicts — fluently — from training data and from your prompt. Number three. The 2022 inflection point was scale, meaning internet-sized training data — plus architecture, meaning the Transformer. And finally, number four. You don't need to be technical to benefit from AI. You just need a working mental model. And a willingness to try things. That's chapter one. See you in chapter two — where we'll go a level deeper. We'll look at how Large Language Models actually work, under the hood.",
    },
  ],
}
