import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiFoundationsChapter08: Chapter = {
  courseId: 'ai-foundations',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your AI starter plan',
  subtitle: 'Eight chapters down — now we turn everything you learned into one page you can actually use.',
  slides: [
    // ──────────────────────────────────────────────────────
    // SLIDE 1 — Opening
    // ──────────────────────────────────────────────────────
    {
      title: 'Capstone — Your AI starter plan',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Capstone',
      bodyHtml: `<p class="lead">You&rsquo;ve covered the foundations, the mechanics, the patterns, the risks, the practical use, and the habits. Now we bring it all together — into <em>one page</em>. A personal plan for the next thirty days, for yourself, and for the next conversation you have with your team.</p>`,
      narrationLead:
        "Welcome to chapter eight — the capstone. And honestly, congratulations for making it here. You've covered the foundations. The mechanics. The patterns. The risks. The practical use. And the habits. So now, in this final chapter, we bring it all together. Into one page. A personal plan for the next thirty days — for yourself, and for the next conversation you have with your team. That's the deliverable. One page. Let's build it.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 2 — The 1-page personal plan
    // ──────────────────────────────────────────────────────
    {
      title: 'The 1-page personal plan',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The deliverable',
      bodyHtml: `<p>The deliverable for this course is one document — one page — and not a slide longer. It has four sections. Writing them down is what makes the course <em>real</em>.</p>`,
      narrationLead:
        "Alright. Here's the deliverable. One document. One page. Not a slide longer. And it has four sections. The reason you actually write this down — instead of just thinking about it — is that writing forces clarity. And clarity is what turns this course from information, into something real in your week. Let's walk through the four sections.",
      steps: [
        {
          html: stepCard('lightbulb', 'blue', 'Section 1 · What I now believe about AI',
            "Your mental model in <em>three sentences</em>. Sentence one — what AI actually is. Sentence two — what it&rsquo;s genuinely good at in your context. Sentence three — what you specifically will <strong>not</strong> use it for. Three sentences forces the clarity."),
          narration:
            "Section one — what I now believe about AI. Three sentences. That's it. Sentence one is what AI actually is. Sentence two is what it's genuinely good at — in your context. And sentence three is what you specifically will not use it for. Just three sentences. The constraint is the point — it forces you to pick what really matters to you.",
        },
        {
          html: stepCard('calendar', 'amber', 'Section 2 · My three AI habits',
            'Three lines. Your three &ldquo;After I [X], I will [Y]&rdquo; habits from the last chapter. One for inbox. One for documents. One for meetings. Or whatever balance fits the shape of <em>your</em> week.'),
          narration:
            "Section two — my three AI habits. Three lines. These are the After-I-X-I-will-Y habits we built in the last chapter. One for your inbox. One for documents. One for meetings. Or whatever balance fits the shape of your week. The point isn't to copy mine — it's to have three of yours.",
        },
        {
          html: stepCard('bookOpen', 'green', 'Section 3 · My prompt library starter',
            'Three prompts you saved from chapter six, with a <em>one-line description</em> of when to use each. This is the seed of your prompt library — it grows from here, one good prompt at a time.'),
          narration:
            "Section three — my prompt library starter. Three prompts. The ones you saved from chapter six. Each with a one-line description of when to use it. This is the seed of your prompt library. And after three months — if you keep saving the ones that work — you'll have thirty or fifty prompts that fit your work exactly. But it all starts with these three.",
        },
        {
          html: stepCard('users', 'blue', 'Section 4 · My next conversation',
            'One paragraph. Who you&rsquo;re going to have an AI conversation with in the next <strong>seven days</strong>, and what you&rsquo;re going to say. Maybe it&rsquo;s your manager. Maybe a peer. Maybe your team. The act of saying it out loud to one person is what makes it stick.'),
          narration:
            "And section four — my next conversation. One paragraph. Who are you going to have an AI conversation with in the next seven days? And what are you going to say? Maybe it's your manager. I've been using AI for X — here's what I've learned. Maybe it's a peer. Can we share prompts that work? Maybe it's your team. Should we pilot AI for Y? Pick one person. One conversation. Seven days.",
        },
      ],
      calloutHtml: calloutBlock('target', 'tip', 'Keep it to one page',
        "Resist the urge to expand. The one-page constraint is what makes this plan <em>useful</em> — short enough to actually re-read, specific enough to actually do. If it grows past one page, you&rsquo;re planning, not doing."),
      calloutNarration:
        "And here's the rule that protects the whole exercise. Keep it to one page. Resist the urge to expand. The one-page constraint is what makes this plan useful. Short enough that you'll actually re-read it. Specific enough that you'll actually do it. If it grows past one page — you're planning. Not doing. So stop at one.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 3 — The team conversation prompt
    // ──────────────────────────────────────────────────────
    {
      title: 'The team conversation prompt',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · For team leaders',
      bodyHtml: `<p>If you manage a team — your next conversation is with them. And the prompt that works isn&rsquo;t a workshop, a strategy session, or a rollout plan. It&rsquo;s much smaller than that.</p>
      <blockquote class="quote-block">&ldquo;For the next two weeks, I want each of us to find <em>one</em> AI prompt that genuinely saves us time on our own work. We&rsquo;ll share them at the next team meeting. No theater. No buzzwords. Just one prompt that worked — with a real example.&rdquo;</blockquote>
      <p>That&rsquo;s it. That&rsquo;s the whole prompt.</p>`,
      narrationLead:
        "Now — if you lead a team, your next conversation is with them. And the prompt that works? It isn't a workshop. It isn't a strategy session. It isn't a rollout plan. It's much smaller than that. Here's what you say. For the next two weeks, I want each of us to find one AI prompt that genuinely saves us time on our own work. We'll share them at the next team meeting. No theater. No buzzwords. Just one prompt that worked — with a real example. That's it. That's the whole prompt.",
      calloutHtml: calloutBlock('sparkles', 'info', 'Why this works',
        "It&rsquo;s small. It&rsquo;s individual. It&rsquo;s tangible. People don&rsquo;t need to <em>&ldquo;transform their workflow&rdquo;</em> — they need to find <strong>one thing</strong> that helps them. The compounding starts there, and it spreads naturally."),
      calloutNarration:
        "Why does this work? Because it's small. It's individual. And it's tangible. People don't need to transform their workflow. They need to find one thing — one thing — that helps them. And once one person on the team finds something that works, and shares it? The compounding starts. It spreads naturally. You didn't have to push it.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 4 — What comes next
    // ──────────────────────────────────────────────────────
    {
      title: 'What comes next — beyond foundations',
      iconKey: 'compass',
      eyebrow: 'Lesson 3 · Beyond foundations',
      bodyHtml: `<p>You&rsquo;ve completed the foundations. The natural next step depends on what you do day-to-day. Pick the track that fits — not all of them. <em>One.</em></p>`,
      narrationLead:
        "So you've completed the foundations. Which means you've got the mental model. The patterns. The vocabulary. Now — what comes next depends on what you actually do day-to-day. There are four tracks from here. And the right move is to pick one. Not all of them. One. Let me walk you through them.",
      steps: [
        {
          html: stepCard('target', 'blue', 'Function track',
            "If you work in a specific function — HR, Finance, Sales, Customer Service, Operations, Legal — take the <em>Function track</em> course built for your role. Same depth as this one, applied directly to <strong>your</strong> workflows."),
          narration:
            "First — the function track. If you work in a specific function — HR, Finance, Sales, Customer Service, Operations, Legal — there's a course built for your role. Same depth as this one. But applied directly to your workflows. Your prompts. Your tools. Your data shapes. That's where most people go next.",
        },
        {
          html: stepCard('users', 'amber', 'Leadership track',
            "If you lead a team or a function, the <em>Leadership track</em> has <strong>AI Strategy for the C-Suite</strong> and <strong>AI ROI &amp; Business Case Building</strong> — for the conversations you&rsquo;ll have with your board, your CFO, and your peers."),
          narration:
            "Second — the leadership track. If you lead a team, or a function, this track has AI Strategy for the C-Suite, and AI ROI and Business Case Building. These are designed for the conversations you'll have with your board. Your CFO. Your peers. The framing is different — it's about decisions, not workflows.",
        },
        {
          html: stepCard('shield', 'green', 'Industry track',
            "If you work in a specific industry — Healthcare, BFSI, Manufacturing, Government, Energy, Retail, Education — the <em>Industry track</em> has a course tuned to your sector&rsquo;s regulations, use cases, and constraints."),
          narration:
            "Third — the industry track. If you work in a specific industry — Healthcare. Banking and Financial Services. Manufacturing. Government. Energy. Retail. Education. There's a course tuned to your sector. Its regulations. Its use cases. Its constraints. The patterns are the same. But the context matters.",
        },
        {
          html: stepCard('zap', 'red', 'Builder track',
            "If you want to go technical — the <em>Builder track</em> covers <strong>Prompt Engineering</strong>, <strong>Copilot Studio</strong>, <strong>RAG</strong>, and <strong>MLOps for LLMs</strong>. This is where foundations stops, and building begins."),
          narration:
            "And fourth — the builder track. If you want to go technical, this is where you go. Prompt Engineering. Copilot Studio. Retrieval Augmented Generation, or RAG. And MLOps for Large Language Models. This is where foundations stops — and building begins. You'll be writing prompts that drive systems, not just outputs.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 5 — A final note
    // ──────────────────────────────────────────────────────
    {
      title: 'A final note — the only thing that matters',
      iconKey: 'rocket',
      eyebrow: 'Closing',
      bodyHtml: `<p>Everything in this course is wasted — <em>genuinely wasted</em> — unless you do <strong>one thing</strong> this week. One prompt. One workflow. One anchored habit. Try it. See what happens.</p>
      <p>The compounding doesn&rsquo;t start with planning the perfect rollout. It doesn&rsquo;t start with reading another course. It starts with <em>one</em>.</p>`,
      narrationLead:
        "Alright. Final note. And I'll be honest with you here. Everything in this course is wasted — genuinely wasted — unless you do one thing this week. One prompt. One workflow. One anchored habit. Try it. And see what happens. The compounding doesn't start with planning the perfect rollout. It doesn't start with reading another course. It doesn't start with a strategy doc. It starts with one. One thing. This week.",
      calloutHtml: calloutBlock('rocket', 'tip', 'Pick one. Try it.',
        "Don&rsquo;t pick the most impressive one. Don&rsquo;t pick the most strategic one. Pick the <em>easiest</em> one — the one you could actually do in the next thirty minutes. That&rsquo;s the one that compounds. The rest follows."),
      calloutNarration:
        "And here's the part most people get wrong. Don't pick the most impressive habit. Don't pick the most strategic one. Pick the easiest one. The one you could actually do in the next thirty minutes. Because that's the one that compounds. The rest follows from there. Pick the easy one. Do it today. The harder ones get easier once you've done one.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 6 — Takeaways + course outro
    // ──────────────────────────────────────────────────────
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'check',
      eyebrow: 'Course complete',
      bodyHtml: `<ul class="takeaways">
        <li data-step="1"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>The course deliverable is <em>one page</em> — belief in 3 sentences · 3 habits · 3 saved prompts · 1 next conversation.</span></li>
        <li data-step="2"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>The team conversation prompt: &ldquo;Find <em>one</em> AI prompt that saves you time. Share at the next meeting.&rdquo;</span></li>
        <li data-step="3"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Next step depends on your role — function-specific, leadership, industry, or builder. Pick <strong>one</strong> track.</span></li>
        <li data-step="4"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Compounding starts with <em>one</em> habit — not with the perfect plan. Pick one. Try it this week.</span></li>
      </ul>`,
      narrationLead:
        "Let's wrap it up. Four takeaways from chapter eight. Number one. The course deliverable is one page. Belief in three sentences. Three habits. Three saved prompts. One next conversation. Number two. The team conversation prompt — find one AI prompt that saves you time. Share at the next meeting. Number three. Your next step depends on your role. Function track. Leadership track. Industry track. Or builder track. Pick one. Not all four. Just one. And number four. Compounding starts with one habit. Not with the perfect plan. Pick one. Try it this week. And that's it — that's AI Foundations for Everyone. Thank you for going through these eight chapters with me. The hardest part is over. The first habit. The first prompt. The first conversation. Go and do them. See you in the next course.",
    },
  ],
}
