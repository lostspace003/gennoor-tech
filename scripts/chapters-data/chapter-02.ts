import type { Chapter } from './_types.ts'
import { stepCard, calloutBlock } from './_types.ts'

export const aiFoundationsChapter02: Chapter = {
  courseId: 'ai-foundations',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-how-llms-work',
  title: 'How LLMs actually work',
  subtitle: 'One mental model — next-token prediction — that explains everything.',
  slides: [
    // ──────────────────────────────────────────────────────
    // SLIDE 1 — Opening
    // ──────────────────────────────────────────────────────
    {
      title: 'How LLMs actually work',
      iconKey: 'brain',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">If you remember <em>one</em> mental model from this whole course — make it this one. Understanding next-token prediction explains both why LLMs are so useful and why they hallucinate. It&rsquo;s the single concept that separates confident AI users from confused ones.</p>`,
      narrationLead:
        "Welcome back. So in chapter one, we covered what AI is — and what it isn't. Today we're going one level deeper. We're looking at how Large Language Models — LLMs — actually work, under the hood. And here's the thing. If you remember one mental model from this entire course, make it this one. Because understanding next-token prediction? It explains everything. It explains why LLMs are so useful. And it explains why they hallucinate. It's the single concept that separates confident AI users from confused ones. So let's get into it.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 2 — Next-token prediction
    // ──────────────────────────────────────────────────────
    {
      title: 'Next-token prediction — the only model you need',
      iconKey: 'sparkles',
      eyebrow: 'Lesson 1 · The core mechanism',
      bodyHtml: `<p>A Large Language Model is, mechanically, doing one thing over and over — given everything written so far, predict the most likely next word. Then add that word, and predict the next one. Then the next. Eventually it produces a sentence, a paragraph, an essay. That&rsquo;s it. That&rsquo;s the trick.</p>`,
      narrationLead:
        "Alright. Here's the core mechanism. An LLM is, mechanically, doing one thing — over and over. Given everything written so far, it predicts the most likely next word. Then it adds that word. And predicts the next one. Then the next. And the next. Eventually you get a sentence. A paragraph. An essay. That's it. That's the whole trick. Let me show you what that looks like in practice.",
      steps: [
        {
          html: stepCard('sparkles', 'blue', 'A worked example',
            "Type &lsquo;The capital of France is&rsquo; — and the model says &lsquo;Paris.&rsquo; It&rsquo;s not retrieving a fact from a database. It&rsquo;s computing that, given those eight words, the statistically most likely ninth word in its training data was &lsquo;Paris.&rsquo;"),
          narration:
            "Think about this. You type — the capital of France is — and the model says Paris. Now, here's what's interesting. It is not retrieving a fact from a database. It's computing — given those eight words you typed — that the statistically most likely ninth word in its training data was Paris. No lookup. No reasoning. Just statistics.",
        },
        {
          html: stepCard('cog', 'blue', 'Same mechanism · different output',
            "The same machinery that produces &lsquo;Paris&rsquo; for capitals produces &lsquo;the&rsquo; for incomplete sentences and &lsquo;Dear Sir or Madam&rsquo; for the opening of a formal letter. One mechanism. Endless outputs."),
          narration:
            "And here's the key insight. The same machinery that produces Paris for capitals — also produces the word the for incomplete sentences. And also produces Dear Sir or Madam for the opening of a formal letter. One mechanism. Endless outputs. That's what makes it both so powerful — and so easy to misunderstand.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The analogy that works',
        "Think of an LLM as autocomplete on extreme steroids. Your phone&rsquo;s autocomplete predicts the next word from your last three. An LLM predicts the next word from the last few <em>thousand</em> — and was trained on a substantial fraction of the public internet plus most published books."),
      calloutNarration:
        "Here's the analogy that really works. Think of an LLM as autocomplete — on extreme steroids. Your phone's autocomplete predicts the next word from your last three. An LLM? Predicts the next word from the last few thousand. And it was trained on a substantial fraction of the public internet — plus most published books. Same idea. Just operating at a wildly different scale.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 3 — How training works
    // ──────────────────────────────────────────────────────
    {
      title: 'How models get trained — without the math',
      iconKey: 'cog',
      eyebrow: 'Lesson 2 · Training',
      bodyHtml: `<p>So how does a model learn which words follow which? You don&rsquo;t program the rules. You show it examples. <em>Billions</em> of them.</p>`,
      narrationLead:
        "So how does a model actually learn which words follow which? Here's the thing — you don't program the rules. Nobody sits down and writes &lsquo;if user says capital of France, output Paris.&rsquo; That would never scale. Instead, you show it examples. Billions of them. Let me walk you through how that works.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', 'The masked-word game',
            "Imagine showing the system every page of every book — and every web article ever published. For each one, you mask out a word, and ask it to guess. Wrong? Adjust slightly. Right? Reinforce. Do this billions of times. The system that emerges has a deeply tuned sense of which words follow which — in which contexts."),
          narration:
            "Imagine this. You take every page of every book — and every web article ever published. And for each one, you mask out a word, and ask the system to guess. Was it wrong? Adjust slightly. Was it right? Reinforce. Now do this billions of times. What emerges? A system with a deeply tuned sense of which words follow which — in which contexts. That sense is what produces the fluency you see in ChatGPT.",
        },
        {
          html: stepCard('search', 'amber', 'It stored patterns · not text',
            "Crucially, the model never stored the books. It stored the statistical <em>patterns</em>. Ask it to quote a passage exactly — and it will often produce something <em>like</em> the passage, blended with other passages, with confident but invented details. This isn&rsquo;t a bug. It&rsquo;s how it works."),
          narration:
            "Now — this is the part that trips people up. The model never stored the books. It stored the statistical patterns. Big difference. So if you ask it to quote a passage exactly — it will often produce something that sounds like the passage. But blended with other passages. With confident — but invented — details. And this isn't a bug. It's literally how the thing works.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 4 — Why LLMs hallucinate
    // ──────────────────────────────────────────────────────
    {
      title: "Why LLMs hallucinate — and why they can't help it",
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · The hallucination problem',
      bodyHtml: `<p>When the model hits a question where the most-likely-next-word doesn&rsquo;t correspond to reality — because you asked about something <em>rare</em>, <em>recent</em>, or <em>specific</em> — it produces the most plausible-sounding answer anyway. That&rsquo;s a hallucination. Fluent. Confident. Wrong.</p>`,
      narrationLead:
        "Alright — now we're at the part everyone has heard of. Hallucinations. Here's what's really going on. When the model hits a question where the most-likely-next-word just doesn't correspond to reality — because you asked about something rare, or recent, or very specific — it doesn't stop. It doesn't say &lsquo;I don't know.&rsquo; It produces the most plausible-sounding answer anyway. That's a hallucination. Fluent. Confident. And wrong. Here are the four places this happens most.",
      steps: [
        {
          html: stepCard('users', 'red', 'Specific names',
            "Ask about someone obscure — a niche academic, a mid-career professional, a regional founder — and you get back an invented biography. Plausible job titles. Made-up affiliations. None of it real."),
          narration:
            "Number one — specific names. You ask the model about someone obscure. A niche academic, a mid-career professional, a regional founder. What do you get? An invented biography. Plausible job titles. Made-up affiliations. None of it real. But it'll sound completely confident.",
        },
        {
          html: stepCard('calendar', 'red', 'Recent events',
            "Ask about last month, or last week — and the model gives you a confident answer from <em>before</em> its training cutoff. It doesn&rsquo;t know what it doesn&rsquo;t know. It just keeps predicting the next word."),
          narration:
            "Number two — recent events. You ask about last month. Or last week. And the model hands you a confident answer that's actually from before its training cutoff. It doesn't know what it doesn't know. It just keeps predicting the next word. So the answer sounds current — but it's old.",
        },
        {
          html: stepCard('bookOpen', 'red', 'Citations',
            "Ask for academic references on any topic — and the model returns perfectly formatted papers with real-sounding author names, real-sounding journals, real-sounding DOIs. Almost none of them exist. This one catches a lot of students and analysts."),
          narration:
            "Number three — citations. Probably the most dangerous one. You ask the model for academic references on a topic. And it gives you perfectly formatted papers. Real-sounding author names. Real-sounding journals. Real-sounding DOIs. Almost none of them exist. This one catches a lot of students. And a lot of analysts.",
        },
        {
          html: stepCard('target', 'red', 'Numbers and dates',
            "Ask for the GDP share of a sector, the year a regulation passed, the dollar value of a market — and you get plausible numbers that don&rsquo;t check out. The confidence is the same whether the number is right or wrong."),
          narration:
            "And number four — numbers and dates. You ask for the GDP share of some sector. Or the year a regulation passed. Or the dollar value of a market. The model gives you plausible-looking numbers — that just don't check out. And here's the kicker. The confidence is the same whether the number is right or wrong. You cannot tell from the tone.",
        },
      ],
      calloutHtml: calloutBlock('alertTriangle', 'warning', "The verify-or-don't-use rule",
        "For anything that involves a specific fact you would <em>Google to confirm</em> — names, dates, numbers, citations, regulatory references — verify it. The model&rsquo;s confidence does <em>not</em> correlate with its accuracy in these cases. Treat its output as a high-quality first draft. Not a finished reference."),
      calloutNarration:
        "So here's the rule. The verify-or-don't-use rule. For anything that involves a specific fact you would Google to confirm — names, dates, numbers, citations, regulatory references — you verify it. Every time. Because the model's confidence does not correlate with its accuracy. Not in these cases. So treat its output as a high-quality first draft. Never as a finished reference. That mindset alone will save you from most of the mistakes people make with AI.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 5 — Why useful anyway
    // ──────────────────────────────────────────────────────
    {
      title: 'But also — why this same mechanism is so useful',
      iconKey: 'lightbulb',
      eyebrow: 'Lesson 4 · Where to trust LLMs',
      bodyHtml: `<p>The same statistical sense that lets it confidently <em>invent</em> citations — is what lets it draft a coherent email, summarize a complex document, restructure your messy notes into clear bullet points, translate between languages, or write code that almost compiles. The trick is knowing the difference between <strong>transforming</strong> input — and <strong>inventing</strong> facts.</p>`,
      narrationLead:
        "Okay so — if hallucinations are baked in, why is this thing useful at all? Great question. And the answer is the most important takeaway in this chapter. The same statistical sense that lets the model confidently invent citations — is what lets it draft a coherent email. Summarize a complex document. Restructure your messy notes into clean bullet points. Translate between languages. Or write code that almost compiles. The whole trick? Is knowing the difference between transforming input — and inventing facts. Let me show you what I mean.",
      steps: [
        {
          html: stepCard('check', 'green', 'Transform · trust higher',
            "&lsquo;Summarize this ten-page document I just pasted.&rsquo; &lsquo;Rewrite this paragraph more concisely.&rsquo; &lsquo;Translate this Arabic email to English.&rsquo; You gave it the source material. There&rsquo;s nothing to invent — only to <em>transform</em>. Hallucination risk drops dramatically."),
          narration:
            "First — transforming input. Trust is higher here. Examples? Summarize this ten-page document I just pasted. Rewrite this paragraph more concisely. Translate this Arabic email to English. In every one of these — you gave it the source material. There's nothing to invent. Only to transform. So the hallucination risk drops dramatically. This is where most of the practical value of AI actually lives.",
        },
        {
          html: stepCard('x', 'red', 'Invent · trust lower',
            "&lsquo;What is the share of GDP that AI contributes to Saudi Arabia&rsquo;s economy?&rsquo; &lsquo;Cite three papers about transformer architecture.&rsquo; &lsquo;When was X regulation passed?&rsquo; These require <em>external facts</em>. The model will produce something plausible — and you have to verify every single piece of it."),
          narration:
            "Now compare that — to inventing external facts. Trust is lower. What is the share of GDP that AI contributes to Saudi Arabia's economy? Cite three papers about transformer architecture. When was X regulation passed? See the difference? These require external facts. The model isn't transforming anything — it's pulling from those statistical patterns. It will produce something plausible. And you have to verify every single piece of it. The first three transformed input. The last three required external facts. That's the line.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 6 — Takeaways
    // ──────────────────────────────────────────────────────
    {
      title: 'Key takeaways from chapter 2',
      iconKey: 'trophy',
      eyebrow: 'Closing',
      bodyHtml: `<ul class="takeaways">
        <li data-step="1"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>LLMs work by predicting the next word — one at a time — based on everything written so far.</span></li>
        <li data-step="2"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>They don't retrieve facts — they generate plausible continuations from statistical patterns stored during training.</span></li>
        <li data-step="3"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Hallucinations are unavoidable for tasks requiring specific external facts — names, dates, citations, numbers.</span></li>
        <li data-step="4"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>For tasks that transform input <em>you</em> provided, risk drops dramatically — and that's where most of the practical value lives.</span></li>
      </ul>`,
      narrationLead:
        "Alright — let's wrap up. Four takeaways from chapter two. Number one. LLMs work by predicting the next word — one at a time — based on everything written so far. That's the whole mechanism. Number two. They don't retrieve facts. They generate plausible continuations from statistical patterns stored during training. There's no database in there. Number three. Hallucinations are unavoidable for tasks requiring specific external facts. Names. Dates. Citations. Numbers. The mechanism cannot tell you when it's making something up. And number four — the one that actually changes how you use AI. For tasks that transform input you provided — summarize, rewrite, translate, restructure — the risk drops dramatically. And that's where most of the practical value actually lives. So that's chapter two. See you in chapter three — where we'll look at where AI actually fits in your work.",
    },
  ],
}
