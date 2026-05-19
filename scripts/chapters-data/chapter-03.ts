import type { Chapter } from './_types.ts'
import { stepCard, calloutBlock } from './_types.ts'

export const aiFoundationsChapter03: Chapter = {
  courseId: 'ai-foundations',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-where-ai-fits',
  title: 'Where AI fits in your work',
  subtitle: 'Five patterns that cover almost every useful AI workflow — and four that don&rsquo;t.',
  slides: [
    // ──────────────────────────────────────────────────────
    // SLIDE 1 — Opening
    // ──────────────────────────────────────────────────────
    {
      title: 'Where AI fits in your work',
      iconKey: 'target',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">AI is good at <em>specific</em> things and bad at others. In the next few minutes, we&rsquo;ll give you a pattern-matching frame — five tasks where generative AI is genuinely strong, with concrete examples for HR, Finance, Sales, and Operations. By the end, you&rsquo;ll have a candidate list for your own workflow.</p>`,
      narrationLead:
        "Welcome to chapter three. Here's the thing about AI — it's good at specific things, and bad at others. So instead of guessing, we're going to give you a pattern-matching frame. Five tasks where generative AI is genuinely strong. With concrete examples — for HR, Finance, Sales, Operations. And by the end of this chapter? You'll have a candidate list for your own workflow. Let's get into it.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 2 — The 5 AI-fit patterns
    // ──────────────────────────────────────────────────────
    {
      title: 'The 5 AI-fit patterns',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · The 5 patterns',
      bodyHtml: `<p>Most useful applications of generative AI fall into one of <strong>five patterns</strong>. Memorise these — and you can evaluate any AI use case at a glance.</p>`,
      narrationLead:
        "Most useful applications of generative AI fall into one of five patterns. That's it. Just five. Memorise these — and you can evaluate any AI use case, at a glance. Let me walk you through them, one by one.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', 'Pattern 1 — Summarize',
            "Take a long input, produce a shorter output that preserves the meaning. Meeting notes &rarr; action items. A 30-page contract &rarr; a 1-page brief. A batch of customer feedback &rarr; themes."),
          narration:
            "Pattern one — Summarize. You take a long input, and you produce a shorter output that preserves the meaning. Think meeting notes — turned into action items. A thirty-page contract — turned into a one-page brief. A batch of customer feedback — turned into themes. Long in, short out.",
        },
        {
          html: stepCard('sparkles', 'amber', 'Pattern 2 — Draft',
            "Produce a first draft from a brief. Email from bullet points. Job description from a role outline. Proposal section from talking points. The human polishes — but the blank page is gone."),
          narration:
            "Pattern two — Draft. You produce a first draft, from a brief. An email — from bullet points. A job description — from a role outline. A proposal section — from talking points. The human polishes the draft. But here's the win — the blank page is gone.",
        },
        {
          html: stepCard('flag', 'blue', 'Pattern 3 — Classify',
            "Sort items into categories. Inbound emails by urgency. Support tickets by topic. Resumes by relevance. CVs by seniority. <em>(This is what AI was doing before GenAI — but GenAI made it cheaper and faster to set up.)</em>"),
          narration:
            "Pattern three — Classify. Sort items into categories. Inbound emails — by urgency. Support tickets — by topic. Resumes — by relevance. CVs — by seniority. Now, here's a side note. This is actually what AI was doing before generative AI came along. But GenAI made it cheaper. Faster to set up. So it's worth knowing.",
        },
        {
          html: stepCard('search', 'green', 'Pattern 4 — Extract',
            "Pull specific information out of unstructured text. Names, dates, amounts from invoices. Key clauses from contracts. Action items from meeting transcripts."),
          narration:
            "Pattern four — Extract. You pull specific information out of unstructured text. Names. Dates. Amounts — from invoices. Key clauses — from contracts. Action items — from meeting transcripts. The information is buried in the mess. AI surfaces it.",
        },
        {
          html: stepCard('zap', 'amber', 'Pattern 5 — Transform',
            "Convert from one format to another. Bullet points &rarr; paragraph. Email &rarr; summary. Free-text policy &rarr; FAQ. English &rarr; Arabic. Python code &rarr; TypeScript code."),
          narration:
            "And pattern five — Transform. You convert from one format to another. Bullet points — to a paragraph. An email — to a summary. A free-text policy — to an FAQ. English — to Arabic. Python code — to TypeScript code. Same content. New shape.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'A quick test',
        "When you encounter an AI use case, ask: &lsquo;Which of the five patterns is this?&rsquo; If you can&rsquo;t name one of the five, the use case might be the wrong shape for current AI. The patterns are the green-light zone."),
      calloutNarration:
        "Here's a quick test you can use. When you encounter any AI use case, just ask yourself — which of the five patterns is this? Summarize. Draft. Classify. Extract. Transform. If you can't name one of the five, the use case might be the wrong shape for current AI. The patterns? They are the green-light zone. Stay in the zone — and you'll do well.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 3 — Examples by function
    // ──────────────────────────────────────────────────────
    {
      title: 'Examples by function — find yours',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · By function',
      bodyHtml: `<p>The five patterns show up everywhere. Here&rsquo;s what they look like across four common functions — find the one closest to your work, and you&rsquo;ll spot your candidates fast.</p>`,
      narrationLead:
        "Alright. Now let's make this concrete. The five patterns show up everywhere — but they look a little different in each function. So I'll walk you through four common functions. Find the one closest to your work — and you'll spot your candidates fast.",
      steps: [
        {
          html: stepCard('users', 'blue', 'HR &amp; People',
            "Summarize 100 employee survey comments into 5 themes. Draft job descriptions from a role brief. Extract candidate skills from resumes. Transform an internal policy into an FAQ for the intranet."),
          narration:
            "First up — HR and People. Summarize a hundred employee survey comments — into five clear themes. Draft job descriptions — from a short role brief. Extract candidate skills — straight from resumes. Transform an internal policy — into an FAQ for the intranet. Four patterns. Four wins.",
        },
        {
          html: stepCard('search', 'green', 'Finance &amp; Accounting',
            "Summarize a long earnings call transcript into 5 bullet points. Draft variance commentary for monthly reports from raw numbers. Extract amounts, dates, and vendor names from invoices. Transform an audit query email into a structured response."),
          narration:
            "Next — Finance and Accounting. Summarize a long earnings call — into five bullet points. Draft variance commentary — from the raw monthly numbers. Extract amounts, dates, and vendor names — from invoices. Transform an audit query email — into a structured response. Finance lives in unstructured text. AI thrives there.",
        },
        {
          html: stepCard('rocket', 'amber', 'Sales &amp; Marketing',
            "Summarize 30 sales-call transcripts into common objection themes. Draft outbound emails personalised to a prospect&rsquo;s LinkedIn. Classify inbound leads into hot / warm / cold. Transform a long blog post into 5 LinkedIn carousel slides."),
          narration:
            "Sales and Marketing — pattern-rich. Summarize thirty sales calls — into the common objection themes. Draft outbound emails — personalised to a prospect's LinkedIn profile. Classify inbound leads — hot, warm, or cold. Transform a long blog post — into five LinkedIn carousel slides. Same content, different shapes, more reach.",
        },
        {
          html: stepCard('cog', 'blue', 'Operations &amp; Supply Chain',
            "Summarize a supplier&rsquo;s quarterly performance report. Draft procurement RFP responses from a request brief. Extract shipment status from carrier email confirmations. Transform handwritten warehouse notes into a structured incident log."),
          narration:
            "And finally — Operations and Supply Chain. Summarize a supplier's quarterly performance report. Draft procurement RFP responses — from a request brief. Extract shipment status — from carrier email confirmations. Transform handwritten warehouse notes — into a structured incident log. Ops teams swim in messy text. AI loves messy text.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 4 — What doesn't fit
    // ──────────────────────────────────────────────────────
    {
      title: "What doesn't fit — four anti-patterns",
      iconKey: 'x',
      eyebrow: 'Lesson 3 · Anti-patterns',
      bodyHtml: `<p>Some tasks <em>look</em> like they should fit — but they don&rsquo;t. Not yet, anyway. Four anti-patterns worth knowing — so you don&rsquo;t spend a month forcing AI into the wrong shape.</p>`,
      narrationLead:
        "Now — the flip side. Some tasks look like they should fit AI. But they don't. Not yet, anyway. So here are four anti-patterns worth knowing. Memorise these too — because they'll save you from spending a month forcing AI into the wrong shape.",
      steps: [
        {
          html: stepCard('x', 'red', 'Anti-pattern 1 — Pure prediction',
            "&lsquo;Will this customer churn?&rsquo; &lsquo;Will this loan default?&rsquo; Classical machine learning is better at these — with structured numeric data and a clear target variable. Don&rsquo;t reach for GenAI here."),
          narration:
            "Anti-pattern one — pure prediction. Things like — will this customer churn? Will this loan default? Classical machine learning is just better at these. It works with structured numeric data. It has a clear target variable. Don't reach for generative AI here. It's the wrong tool.",
        },
        {
          html: stepCard('x', 'red', 'Anti-pattern 2 — High-stakes individual judgment',
            "Hiring decisions. Medical diagnosis. Credit denials. AI can <em>assist</em> — surfacing patterns, drafting summaries, flagging risk. But the final call belongs to a human. The accountability cannot be outsourced."),
          narration:
            "Anti-pattern two — high-stakes individual judgment. Hiring decisions. Medical diagnosis. Credit denials. Now — AI can assist here. It can surface patterns. Draft summaries. Flag risks. But the final call? It belongs to a human. Because the accountability cannot be outsourced — to a model.",
        },
        {
          html: stepCard('x', 'red', 'Anti-pattern 3 — Open creative work where voice is the value',
            "A keynote speech in your own voice. A founder&rsquo;s letter that has to <em>sound like you</em>. A brand identity that&rsquo;s new, not derivative. AI can speed up the scaffolding — but it can&rsquo;t replace your taste."),
          narration:
            "Anti-pattern three — open creative work, where the voice is the value. A keynote speech in your own voice. A founder's letter that has to sound like you. A brand identity that's new — not derivative. AI can speed up the scaffolding here. Sure. But it cannot replace your taste. Your taste is the product.",
        },
        {
          html: stepCard('x', 'red', 'Anti-pattern 4 — Real-time freshness',
            "Anything requiring information beyond the model&rsquo;s training cutoff — yesterday&rsquo;s news, this week&rsquo;s stock price, last month&rsquo;s regulation. Unless the AI has tools to look things up, it will confidently invent. Verify or use a tool-enabled version."),
          narration:
            "And anti-pattern four — real-time freshness. Anything that requires information beyond the model's training cutoff. Yesterday's news. This week's stock price. Last month's regulation. Unless the AI has tools to look things up — like web search built in — it will confidently invent the answer. So either verify it yourself. Or use a tool-enabled version. Don't trust the raw model on fresh facts.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 5 — Takeaways
    // ──────────────────────────────────────────────────────
    {
      title: 'Key takeaways from chapter 3',
      iconKey: 'trophy',
      eyebrow: 'Closing',
      bodyHtml: `<ul class="takeaways">
        <li data-step="1"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Five patterns cover most useful GenAI work — Summarize · Draft · Classify · Extract · Transform.</span></li>
        <li data-step="2"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>If a use case doesn&rsquo;t map to one of the five, it&rsquo;s probably the wrong shape for current GenAI.</span></li>
        <li data-step="3"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Every function has high-fit candidates — HR, Finance, Sales, Ops. Pick one and try it this week.</span></li>
        <li data-step="4"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Anti-patterns: pure prediction · high-stakes judgment · voice-driven creative · real-time freshness.</span></li>
      </ul>`,
      narrationLead:
        "Alright — let's wrap up. Here are the four takeaways from chapter three. Number one. Five patterns cover most useful generative AI work. Summarize. Draft. Classify. Extract. Transform. Burn those into memory. Number two. If a use case doesn't map to one of the five — it's probably the wrong shape for current generative AI. Don't force it. Number three. Every business function has high-fit candidates. HR. Finance. Sales. Operations. Pick one — and try it this week. And number four. Watch out for the anti-patterns. Pure prediction. High-stakes individual judgment. Voice-driven creative work. And real-time freshness. Those are not GenAI territory. Next up — chapter four. We'll cover the privacy, risk, and bias traps that come with AI. The things to watch — before you paste anything sensitive into a chatbot. See you there.",
    },
  ],
}
