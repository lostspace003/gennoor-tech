import type { Chapter } from './_types.ts'
import { stepCard, calloutBlock } from './_types.ts'

export const aiFoundationsChapter06: Chapter = {
  courseId: 'ai-foundations',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-hands-on-copilot',
  title: 'Hands-on with Copilot',
  subtitle: 'Three prompts you can run today — on your real work, not a demo.',
  slides: [
    // ──────────────────────────────────────────────────────
    // SLIDE 1 — Opening
    // ──────────────────────────────────────────────────────
    {
      title: 'Hands-on with Copilot',
      iconKey: 'zap',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">Reading about AI is the easy part. <em>Doing</em> it on your actual work is what matters. In the next few minutes, we&rsquo;ll run three specific prompts — on your real documents, your real emails, your real situation — and we&rsquo;ll talk about how to save the ones that work.</p>`,
      narrationLead:
        "Welcome to chapter six. This one is different. Up until now, we've been building mental models — what AI is, how it works, where it fits, what to watch out for. All useful. But here's the thing. Reading about AI is the easy part. Doing it on your actual work? That's what actually matters. So today — stop reading. Start doing. We're going to run three specific prompts. On your real documents. Your real emails. Your real situation. And then we'll talk about how to save the ones that work.",
      calloutHtml: calloutBlock('alertTriangle', 'warning', 'Before you start',
        "You need access to Microsoft 365 Copilot, ChatGPT (Enterprise version if available), Claude, or Gemini. If you don&rsquo;t have any of these, the free ChatGPT or Gemini will work for the practice — just <strong>don&rsquo;t paste anything sensitive</strong> (remember chapter four)."),
      calloutNarration:
        "Quick check before you start. You need access to something. Microsoft 365 Copilot. ChatGPT — Enterprise version if you have it. Claude. Or Gemini. Any one of those works. If you don't have any of them — the free ChatGPT or Gemini will do for the practice. But — and this is important — don't paste anything sensitive. Remember chapter four. Public tools, public data. Keep it that simple.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 2 — Prompt 1: Summarize
    // ──────────────────────────────────────────────────────
    {
      title: 'Prompt 1 — Summarize a long email thread',
      iconKey: 'bookOpen',
      eyebrow: 'Prompt 1 · Summarize',
      bodyHtml: `<p>Pick a long email thread in your inbox right now. At least eight messages — ideally more. The kind you keep meaning to read properly but never quite do.</p>
        <div class="callout callout-info">
          <div class="callout-icon">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>'}</div>
          <div>
            <div class="callout-title">The prompt — paste this verbatim</div>
            <div class="callout-body">&ldquo;Summarize this email thread in 4 bullet points. Cover: (1) what the discussion is about, (2) what decisions have been made, (3) what&rsquo;s still open, (4) what action items are assigned to whom. Use direct, plain language.&rdquo;</div>
          </div>
        </div>`,
      narrationLead:
        "So here's the first prompt. Take a long email thread in your inbox. Paste it. And then say — summarize this email thread in four bullet points. Cover four things. One — what the discussion is about. Two — what decisions have been made. Three — what's still open. And four — what action items are assigned, and to whom. Use direct, plain language. That's it. That's the whole prompt.",
      narrationTrail:
        "Now — watch what comes back. You'll notice it's usually about seventy percent right. And thirty percent needs tweaking. That's normal. The point isn't perfection. The point is that you went from a twelve-minute read — to a thirty-second understanding. That gap is the value.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 3 — Prompt 2: Draft
    // ──────────────────────────────────────────────────────
    {
      title: 'Prompt 2 — Draft a hard email from bullet points',
      iconKey: 'sparkles',
      eyebrow: 'Prompt 2 · Draft',
      bodyHtml: `<p>Think of an email you&rsquo;ve been putting off. Declining a request. Giving difficult feedback. Asking for something awkward. We all have one sitting in our heads right now.</p>
        <div class="callout callout-info">
          <div class="callout-icon">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/><path d="M4 17v2"/><path d="M5 18H3"/></svg>'}</div>
          <div>
            <div class="callout-title">The prompt — fill in the brackets</div>
            <div class="callout-body">&ldquo;Draft an email for me. Recipient: [name and role]. Context: [3 sentences of what&rsquo;s going on]. What I want to convey: [bullet points]. Tone: [direct but warm / formal / etc.]. Keep it under 150 words.&rdquo;</div>
          </div>
        </div>`,
      narrationLead:
        "Alright — prompt two. The hard email. The one you've been putting off. Maybe you're declining a request. Maybe you're giving someone difficult feedback. Maybe you're asking for something awkward. We've all got one. Here's the prompt. Draft an email for me. Recipient — name and role. Context — three sentences of what's going on. What I want to convey — bullet points. Tone — direct but warm. Or formal. Whatever fits. And — keep it under a hundred and fifty words.",
      narrationTrail:
        "The first draft will probably be eighty percent there. Your edits — that's where your voice and your judgment come in. But here's what changed. You're editing now. Not writing from scratch. And honestly? Most people find this is the single biggest time-saver in their entire week. The email you were dreading — it just got drafted in fifteen seconds.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 4 — Prompt 3: Extract
    // ──────────────────────────────────────────────────────
    {
      title: 'Prompt 3 — Extract action items from a meeting',
      iconKey: 'check',
      eyebrow: 'Prompt 3 · Extract',
      bodyHtml: `<p>Grab a recent meeting transcript. Teams and Zoom both generate these automatically. If you don&rsquo;t have one, your own meeting notes will do just fine.</p>
        <div class="callout callout-info">
          <div class="callout-icon">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'}</div>
          <div>
            <div class="callout-title">The prompt — note the grounding trick</div>
            <div class="callout-body">&ldquo;Extract from this meeting transcript: (1) Decisions made, (2) Action items with owner and due date if mentioned, (3) Open questions with no owner yet. Format as three clearly-labeled sections. <strong>Quote the exact phrase from the transcript where the action was assigned.</strong>&rdquo;</div>
          </div>
        </div>`,
      narrationLead:
        "And finally — prompt three. Take a meeting transcript. Teams or Zoom can generate these for you automatically. If you don't have one, your own notes from a recent meeting will work. Here's the prompt. Extract from this transcript — three things. Decisions made. Action items with owner and due date if mentioned. And open questions with no owner yet. Format as three clearly-labeled sections.",
      narrationTrail:
        "Now — here's the part that matters most. That last line. <em>Quote the exact phrase from the transcript where the action was assigned.</em> That's the trick. It forces the model to point at evidence. Which makes it much harder to hallucinate items that weren't actually in the transcript. Always — always — include that kind of grounding instruction when you're extracting from a source. It changes the output quality completely.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 5 — Saving prompts that work
    // ──────────────────────────────────────────────────────
    {
      title: 'Saving the prompts that work',
      iconKey: 'flag',
      eyebrow: 'Lesson · Building your library',
      bodyHtml: `<p>When you find a prompt that produces useful output — <strong>save it</strong>. Don&rsquo;t try to remember it. Create a simple &ldquo;AI Prompts&rdquo; document. Notion. OneNote. A folder of text files. Whatever fits your tools.</p>`,
      narrationLead:
        "Okay — here's a lesson that took me a while to learn. When you find a prompt that produces useful output — save it. Right then. Don't try to remember it later. You won't. Create a simple AI Prompts document. Notion. OneNote. A folder of text files. Doesn't matter what — just make it somewhere you'll actually open again. And for each prompt you save, capture three things.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', 'The prompt itself — verbatim',
            "Copy the exact text that worked. Don&rsquo;t paraphrase it. Don&rsquo;t &lsquo;tidy it up&rsquo;. The small details — the punctuation, the bracketed placeholders, the specific verbs — those are what made it work."),
          narration:
            "First — the prompt itself. Verbatim. Don't paraphrase it. Don't tidy it up. The small details — the exact punctuation, the bracketed placeholders, the specific verbs you used — those are what made it work. Copy them exactly.",
        },
        {
          html: stepCard('compass', 'blue', 'A one-line description of when to use it',
            "Future-you needs to scan the library and find the right prompt in five seconds. &ldquo;Summarize a long email thread&rdquo; beats &ldquo;email helper&rdquo; every time. Be specific about the use case."),
          narration:
            "Second — a one-line description of when to use it. Future-you needs to scan that library and find the right prompt in about five seconds. Summarize a long email thread — that's a good description. Email helper — that's useless. Be specific about the use case.",
        },
        {
          html: stepCard('sparkles', 'amber', 'A tweak or two for your situation',
            "Maybe you always want bullet points instead of paragraphs. Maybe you always want it in your company&rsquo;s tone. Save the personalisation alongside the base prompt — that&rsquo;s what makes the library <em>yours</em>."),
          narration:
            "And third — a tweak or two for your specific situation. Maybe you always want bullet points instead of paragraphs. Maybe you always want it in your company's tone of voice. Save those personalisations alongside the base prompt. That's what makes the library yours — not just a generic list off the internet.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The prompt library becomes the asset',
        "After three months of saving good prompts, you&rsquo;ll have a personal library of thirty to fifty patterns that fit your work. <strong>That library is more valuable than any single tool.</strong> It travels with you — to your next job, your next role, your next platform."),
      calloutNarration:
        "Here's why this matters. After three months of saving good prompts, you'll have a personal library of thirty to fifty patterns. All of them fit your specific work. And that library — it's more valuable than any single tool you'll ever use. Because it travels with you. To your next job. Your next role. Your next platform. Tools come and go. Your prompt library is the asset.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 6 — When the output is wrong
    // ──────────────────────────────────────────────────────
    {
      title: 'When the output is wrong',
      iconKey: 'lightbulb',
      eyebrow: 'Lesson · Debugging',
      bodyHtml: `<p>It <em>will</em> be wrong sometimes. That&rsquo;s the deal. The good news — two patterns fix almost every bad output. Reach for these before you give up on a prompt.</p>`,
      narrationLead:
        "Last lesson before we close. The output will be wrong sometimes. That's just the deal. The good news? Two patterns fix almost every bad output. So before you give up on a prompt — try these two things in order. They work surprisingly often.",
      steps: [
        {
          html: stepCard('bookOpen', 'green', 'Add an example',
            "&ldquo;Here&rsquo;s the format I want — [paste example output]. Now do the same for this input.&rdquo; Examples are the single most effective way to fix bad output. The model copies the <em>shape</em> of what you showed it."),
          narration:
            "Pattern one — add an example. Just paste one in. Say — here's the format I want — and then show it. Then say — now do the same for this input. That's it. Examples are the single most effective way to fix bad output. The model copies the shape of what you showed it. It's that simple.",
        },
        {
          html: stepCard('target', 'green', 'Add constraints',
            "&ldquo;Under 100 words. No bullet points. Formal tone. Don&rsquo;t mention X.&rdquo; <strong>Constraints are gifts to the model.</strong> They narrow the space of plausible outputs — which is exactly what you want when the first attempt was too vague."),
          narration:
            "Pattern two — be more specific about constraints. Under a hundred words. No bullet points. Formal tone. Don't mention X. Constraints are gifts to the model. They narrow the space of plausible outputs — and that's exactly what you want when the first attempt came back too vague or too sprawling. The more constraints you give, the better the output gets.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 7 — Takeaways
    // ──────────────────────────────────────────────────────
    {
      title: 'Key takeaways from chapter 6',
      iconKey: 'trophy',
      eyebrow: 'Closing',
      bodyHtml: `<ul class="takeaways">
        <li data-step="1"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>You learn AI by using it on real work — read less, try more.</span></li>
        <li data-step="2"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Three prompts cover most weekly time-saves · summarize emails · draft hard emails · extract action items.</span></li>
        <li data-step="3"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Saving the prompts that work compounds into a personal library that beats any single tool.</span></li>
        <li data-step="4"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>When output is wrong · add an example, or add constraints. Both fix most problems.</span></li>
      </ul>`,
      narrationLead:
        "Alright — let's wrap up chapter six. Four takeaways. Number one. You learn AI by using it on real work. Read less. Try more. Number two. Three prompts will cover most of your weekly time-saves. Summarize long emails. Draft hard emails. Extract action items from meetings. That's the starter pack. Number three. Saving the prompts that work compounds into a personal library — and that library beats any single tool. And number four. When the output is wrong, you've got two moves. Add an example. Or add constraints. Both fix most problems. In chapter seven — we look at how to make AI habits actually stick, beyond the first week. Because trying a prompt once is easy. Making it part of how you work? That's the real game. See you there.",
    },
  ],
}
