import type { Chapter } from './_types.ts'
import { stepCard, calloutBlock } from './_types.ts'

export const aiFoundationsChapter07: Chapter = {
  courseId: 'ai-foundations',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-ai-habits-that-stick',
  title: 'Building AI habits that stick',
  subtitle: 'Adoption — not the technology — is where most AI journeys actually fail.',
  slides: [
    // ──────────────────────────────────────────────────────
    // SLIDE 1 — Opening
    // ──────────────────────────────────────────────────────
    {
      title: 'Building AI habits that stick',
      iconKey: 'rocket',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Most people try AI once, get something half-useful, and stop. The real risk isn&rsquo;t the technology — it&rsquo;s <em>adoption</em>. In this chapter, we&rsquo;ll design habits that anchor AI to workflows you already do, so you don&rsquo;t need willpower to keep using it.</p>`,
      narrationLead:
        "Welcome to chapter seven. Today we're talking about something most courses skip — building AI habits that actually stick. Here's the uncomfortable truth. Most people try AI once. They get something half-useful. And then they stop. So the real risk isn't the technology. It's adoption. In the next few minutes, we'll design habits that anchor AI to workflows you already do — so you don't need willpower to keep using it. Let's get into it.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 2 — Why adoption fails
    // ──────────────────────────────────────────────────────
    {
      title: 'Why adoption fails — it&rsquo;s not what you think',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 1 · The real reason',
      bodyHtml: `<p>It&rsquo;s rarely the technology. It&rsquo;s rarely the price. It&rsquo;s rarely the security. The most common reason people stop using AI after the first week — <strong>they forgot</strong>. Their existing workflow is automatic; the new AI step requires conscious effort. So three weeks in, they&rsquo;re back to the old pattern.</p>`,
      narrationLead:
        "So why does adoption fail? Let me tell you what it usually isn't. It's rarely the technology. It's rarely the price. It's rarely even the security concerns. The most common reason people stop using AI after the very first week? They forgot. That's it. Their existing workflow is automatic. But the new AI step? That requires conscious effort. So three weeks in — they're back to the old pattern. Like nothing ever changed.",
      calloutHtml: calloutBlock('lightbulb', 'info', 'The fix isn&rsquo;t willpower',
        "Willpower is a finite resource — and you&rsquo;re already spending it on a hundred other things during your workday. The fix is to <em>anchor</em> the AI step to a trigger that already exists in your day. No willpower required."),
      calloutNarration:
        "Here's the key insight. The fix isn't willpower. Willpower is a finite resource — and you're already spending it on a hundred other things during your workday. The fix is to anchor the AI step to a trigger that already exists in your day. No willpower required. Just a smarter design.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 3 — Habit-anchoring
    // ──────────────────────────────────────────────────────
    {
      title: 'The habit-anchoring formula',
      iconKey: 'lightbulb',
      eyebrow: 'Lesson 2 · The habit formula',
      bodyHtml: `<p>Borrowed from behavior science — and it works. The formula is simple. <strong>After I [existing habit], I will [AI habit].</strong> The existing habit is your trigger. The AI habit is the new behavior. You don&rsquo;t need to remember the new habit — the existing one cues it automatically.</p>`,
      narrationLead:
        "So how do we anchor AI? We borrow from behavior science. And the formula is beautifully simple. After I — existing habit — I will — AI habit. That's it. The existing habit is your trigger. The AI habit is the new behavior. And here's why it works. You don't need to remember the new habit. The existing one cues it for you — automatically. Let me show you three concrete examples.",
      steps: [
        {
          html: stepCard('zap', 'blue', 'After I open Outlook…',
            "…I will paste the longest email thread into Copilot and ask for a summary. Your inbox-opening ritual <em>becomes</em> the trigger — no extra remembering needed."),
          narration:
            "First example — after I open Outlook in the morning, I will paste the longest email thread into Copilot and ask for a summary. See how that works? Your inbox-opening ritual becomes the trigger. You're already opening Outlook. So you're already remembering. No extra mental load.",
        },
        {
          html: stepCard('users', 'blue', 'After I leave a meeting…',
            "…I will paste the transcript into Copilot and ask for action items. Every meeting longer than thirty minutes — same anchor, same outcome, every single time."),
          narration:
            "Second example — after I leave any meeting that lasted more than thirty minutes, I will paste the transcript into Copilot and ask for action items. Every meeting becomes a trigger. Same anchor, same outcome, every single time. And you walk out with action items already extracted.",
        },
        {
          html: stepCard('bookOpen', 'amber', 'Before I write a document…',
            "…I will spend two minutes drafting the outline with Copilot before opening Word. The act of sitting down to write <em>is</em> the cue. You move from blank page to first draft — without the friction."),
          narration:
            "Third example — before I sit down to write any document, I will spend two minutes drafting the outline with Copilot before opening Word. Notice the trigger here. The act of sitting down to write — that's the cue. And you move from blank page to first draft — without the friction. These three patterns. Inbox. Meetings. Documents. They cover most of a knowledge worker's week.",
        },
      ],
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 4 — Pick three habits, not ten
    // ──────────────────────────────────────────────────────
    {
      title: 'Pick three habits — not ten',
      iconKey: 'check',
      eyebrow: 'Lesson 3 · The right number',
      bodyHtml: `<p>Three weekly habits is plenty. Ten is too many to remember — and too easy to fail. Three is enough to see compounding value, but few enough that each one <em>actually</em> sticks. A balanced trio works best — one habit for inbox or communication, one for documents or analysis, one for meetings. That spreads the value across your week, and lets you notice the time savings clearly.</p>`,
      narrationLead:
        "Now here's where most people get it wrong. They get excited. They make a list of ten new AI habits. And by week two — they remember zero. So let me give you the rule. Three weekly habits is plenty. Ten is too many to remember — and too easy to fail. Three is enough to see compounding value. But few enough that each one actually sticks. And the trick is to balance the trio. One habit for inbox or communication. One for documents or analysis. One for meetings. That spreads the value across your week. And it lets you notice the time savings — clearly.",
      calloutHtml: calloutBlock('zap', 'tip', 'Write yours down today',
        "On a sticky note — yes, a real one — write three &ldquo;After I [X], I will [Y]&rdquo; sentences. Stick the note on your monitor for thirty days. Most people don&rsquo;t need it after that — by then the habit is automatic."),
      calloutNarration:
        "Here's your action for today. On a sticky note — yes, a real, physical one — write three After I [X], I will [Y] sentences. Stick the note on your monitor. Leave it there for thirty days. And here's what most people find. After thirty days? You don't need the note anymore. The habit is automatic. The sticky note has done its job.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 5 — Tracking, reinforcement, and avoiding fatigue
    // ──────────────────────────────────────────────────────
    {
      title: 'Tracking, reinforcement, and avoiding fatigue',
      iconKey: 'compass',
      eyebrow: 'Lesson 4 · Make it sustainable',
      bodyHtml: `<p>For the first two weeks, log when you do the habit. A simple tally in a notebook — or a checkbox in Outlook — works fine. The goal isn&rsquo;t to track success. It&rsquo;s to make the new behavior <em>visible</em> until it becomes automatic.</p>
      <p>After two weeks, review. What actually saved time? What didn&rsquo;t? Drop the habit that didn&rsquo;t pay off — and replace it with a new candidate. Most people cycle through five to eight habits in their first quarter before landing on the three that genuinely fit their work.</p>
      <p>And watch out for the opposite trap — the &ldquo;AI everywhere&rdquo; fatigue. Some people swing the other way. They try to use AI for everything, get exhausted by the tool-switching, and burn out. The fix is the inverse of forgetting — be <em>selective</em>. AI is for specific anchored moments. The rest of your work stays as it was.</p>`,
      narrationLead:
        "Okay — so you've got your three habits. How do you make sure they actually stick? Two things. First, for the first two weeks — log when you do the habit. A simple tally in a notebook works. A checkbox in Outlook works. The goal isn't to track success. It's just to make the new behavior visible — until it becomes automatic. Second, after two weeks, review. What actually saved time? What didn't? Drop the one that didn't pay off. Replace it with a new candidate. Most people cycle through five to eight habits in their first quarter — before landing on the three that genuinely fit their work. And one more thing. Watch out for the opposite trap. Some people swing the other way. They try to use AI for everything. They get exhausted by the constant tool-switching. They burn out. The fix is the inverse of forgetting — be selective. AI is for specific, anchored moments. The rest of your work stays as it was.",
      calloutHtml: calloutBlock('search', 'tip', 'The &ldquo;would I miss it&rdquo; test',
        "Every month, ask yourself one question — &ldquo;If this AI habit disappeared tomorrow, would I miss it?&rdquo; If yes, keep it. If no, drop it. Habits earn their place by saving time you <em>actually care</em> about saving."),
      calloutNarration:
        "Here's a simple test for the monthly review. The would I miss it test. Every month, ask yourself one question. If this AI habit disappeared tomorrow — would I miss it? If yes, keep it. If no, drop it. Habits earn their place by saving time you actually care about saving. Not theoretical time. Not someone else's time. Your time.",
    },

    // ──────────────────────────────────────────────────────
    // SLIDE 6 — Takeaways
    // ──────────────────────────────────────────────────────
    {
      title: 'Key takeaways from chapter 7',
      iconKey: 'trophy',
      eyebrow: 'Closing',
      bodyHtml: `<ul class="takeaways">
        <li data-step="1"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Adoption usually fails because of <em>forgetting</em> — not because of bad technology.</span></li>
        <li data-step="2"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Anchor each AI habit to an existing trigger using the &ldquo;After I [X], I will [Y]&rdquo; formula.</span></li>
        <li data-step="3"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Pick three habits — not ten. One for inbox, one for documents, one for meetings is a balanced trio.</span></li>
        <li data-step="4"><span class="takeaway-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span>Review monthly — keep habits that earn their place, drop habits you wouldn&rsquo;t miss.</span></li>
      </ul>`,
      narrationLead:
        "Alright — let's wrap up chapter seven. Four takeaways. Number one. Adoption usually fails because of forgetting. Not because of bad technology. So design around the forgetting. Number two. Anchor each AI habit to an existing trigger — using the After I [X], I will [Y] formula. The existing habit becomes your free reminder. Number three. Pick three habits, not ten. One for inbox. One for documents. One for meetings. That's a balanced trio. And number four. Review monthly. Keep the habits that earn their place. Drop the ones you wouldn't miss. That's how habits stay sustainable. And in our final chapter — we bring everything together with a one-page personal plan for your next thirty days. See you there.",
    },
  ],
}
