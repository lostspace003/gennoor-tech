import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const genAiBizChapter01: Chapter = {
  courseId: 'generative-ai-for-business',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-genai-explained-without-code',
  title: 'GenAI explained without code',
  subtitle: 'A working mental model for managers — what changed, what didn’t, and what to do about it.',
  slides: [
    // SLIDE 1
    {
      title: 'GenAI explained without code',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">This course is for managers and team leads. You don’t need to know what a transformer is. You need to know what generative AI changes in the work your team does — and where the value actually lands. In the next few minutes, the mental model that survives contact with reality.</p>`,
      narrationLead:
        "Welcome to the course. This is for managers and team leads. Heads of function. People who run real teams that do real work. You don't need to know what a transformer is. You don't need to know how large language models are trained. You need to know what generative AI actually changes in the work your team does day to day. And where the value lands. So in the next few minutes, we'll build the mental model that survives contact with reality. Without code. Without buzzwords. Without hype.",
    },
    // SLIDE 2
    {
      title: 'What actually changed in 2022 — and why it matters now',
      iconKey: 'lightbulb',
      eyebrow: 'Lesson 1 · The shift',
      bodyHtml: `<p>Generative AI isn’t magic. It isn’t sentient. It isn’t replacing your team. But it has changed three things that affect how your work gets done — and managers who understand those three are the ones whose teams adapt first.</p>`,
      narrationLead:
        "Generative AI isn't magic. It isn't sentient. It isn't replacing your team. But it has genuinely changed three things that affect how your work gets done. And managers who understand those three things — and not the technical details under them — are the ones whose teams adapt first. Here are the three.",
      steps: [
        {
          html: stepCard('sparkles', 'amber', 'Change 1 — Language became programmable',
            "Before 2022, automating anything to do with written or spoken language required writing rules — usually expensive, usually brittle. Now, a sentence in English is enough to instruct a system. Drafting, summarising, classifying, translating — all suddenly cheap. This is the foundational change."),
          narration:
            "Change one. Language became programmable. Before twenty twenty-two, automating anything to do with written or spoken language required writing rules. Usually expensive. Usually brittle. Often built by specialists. Now — a single sentence in English is enough to instruct a system. Drafting an email. Summarising a meeting. Classifying customer feedback. Translating between languages. All of those suddenly became cheap to do. This is the foundational change. Everything else flows from it.",
        },
        {
          html: stepCard('zap', 'blue', 'Change 2 — Knowledge work became compressible',
            "Tasks that took a person an hour now take ten minutes — when the person uses the tool well. The hour itself doesn't disappear. It moves. From doing the routine work to doing the work that needed you in the first place."),
          narration:
            "Change two. Knowledge work became compressible. Tasks that used to take a person an hour now take ten or fifteen minutes — when that person uses the tool well. The hour itself doesn't disappear. That's the bit most people get wrong. The hour moves. From doing the routine portion of the work to doing the portion of the work that actually needed you in the first place. The judgement calls. The customer conversations. The strategic thinking. That's the shift. Your team works the same hours. They produce different things.",
        },
        {
          html: stepCard('users', 'green', 'Change 3 — The skill gap moved',
            "Before, the most valuable skill was technical fluency — knowing how the tools worked. Now, the most valuable skill is judgement — knowing what to ask for, when to trust the answer, when to override. The skill gap moved from technical to judgement-based."),
          narration:
            "Change three. The skill gap moved. Before generative AI, the most valuable skill on most teams was technical fluency — knowing how the tools worked, mastering their menus, learning their quirks. Now, the most valuable skill is judgement. Knowing what to ask the AI for. When to trust the answer. When to override it. When to escalate it. The skill gap on most teams has moved from technical to judgement-based. And here's the implication for managers. Your hiring lens shifts. Your training shifts. Your performance conversations shift. The team that has good judgement compounds. The team without it stalls.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'A working manager\'s mental model',
        "Generative AI is a junior team member who works fast, doesn't sleep, has read everything but understands nothing, will confidently say something wrong if you let it, and gets better the more clearly you ask. Treat it like that — and your team will use it well."),
      calloutNarration:
        "Here's a working manager's mental model. Generative AI is a junior team member who works very fast. Doesn't sleep. Has read essentially everything but understands nothing. Will confidently say something wrong if you let it. And gets dramatically better the more clearly you ask. Treat it that way — and your team will use it well. Treat it as either magic or as a threat — and they won't. The mental model determines the management approach. Pick the right one.",
    },
    // SLIDE 3
    {
      title: 'Where it actually fits — and where it doesn\'t',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · Fit',
      bodyHtml: `<p>Generative AI fits some kinds of work very well, and other kinds poorly. Knowing the difference saves your team months of wasted effort.</p>`,
      narrationLead:
        "Generative AI fits some kinds of work very well. And it fits other kinds of work poorly. Knowing the difference saves your team months of wasted effort. Three categories worth knowing.",
      steps: [
        {
          html: stepCard('check', 'green', 'Fits well — Drafting · Summarising · Extracting',
            "Drafting a first version of a document. Summarising a long thread or document. Extracting structured information from messy text. These three are where most genuine value sits today. Start your team here."),
          narration:
            "Fits well. Drafting. Summarising. Extracting. Drafting a first version of a document. Summarising a long email thread or a meeting transcript. Extracting structured information — names, dates, amounts, decisions — from messy text. These three categories are where most genuine value sits today. Mature technology. Predictable outcomes. Manageable risk. Start your team here. Don't reach for harder use cases until these three are working.",
        },
        {
          html: stepCard('check', 'blue', 'Fits okay — Classification · Translation · Coding assistance',
            "Sorting items into categories. Translation between common languages. Writing or fixing code with a human in the loop. These work — but require more careful prompting and more verification than the first three. Second wave."),
          narration:
            "Fits okay. Classification. Translation. Coding assistance. Sorting items into categories. Translation between major world languages. Writing or fixing code with a human in the loop. These work — but they require more careful prompting and more verification than the first three. Second wave for most teams. Add these in months two and three. Not in week one.",
        },
        {
          html: stepCard('x', 'red', 'Fits poorly — Precise math · Real-time data · Genuine judgement',
            "Generative AI is bad at precise arithmetic over many numbers. It doesn't know what happened this morning. And it can't replace the judgement call your senior team member makes after twelve years on the job. Don't reach for these — you'll lose credibility with your team."),
          narration:
            "Fits poorly. Precise arithmetic over many numbers — use a spreadsheet, or wire the AI to one. Real-time information about what happened this morning — the AI doesn't know unless you tell it. Genuine judgement calls — the kind your senior team member makes after twelve years on the job. Don't reach for these use cases as your starting point. You'll lose credibility with your team. They'll see the failure. They'll generalise it. Eighteen months later they still won't trust the tool. Start with what works. Build from there.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Three myths that slow teams down',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Myths to retire',
      bodyHtml: `<p>Three myths I hear from managers and team leads almost every week. Each one slows adoption. Each one is preventable.</p>`,
      narrationLead:
        "Three myths I hear from managers and team leads almost every week. Each one slows adoption on the team. Each one is preventable with a clear conversation. So if you've been carrying one of these — let me try to retire it.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Myth 1 — “It will replace my team”',
            "It won't. It changes what they do, not whether they're needed. Teams that use AI well produce more — typically without growing headcount. The right framing for your team is opportunity, not threat."),
          narration:
            "Myth one. It will replace my team. It won't. It changes what they do, not whether they are needed. Teams that use AI well produce more — typically without growing headcount, sometimes with smaller teams over time. But the team is still there. Often doing better work. The right framing for your team is opportunity — they get to spend less time on the routine portion and more time on the work that actually needed them. Not threat. Make sure your team hears that framing from you, in your words, before they hear it elsewhere.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Myth 2 — “The tool will work itself out”',
            "It won't. Without active management — picking the use cases, training the team, watching adoption — the tool sits unused. Most Copilot license drawers prove this. Active management is the difference between adoption and waste."),
          narration:
            "Myth two. The tool will work itself out. It won't. Without active management — picking the right use cases for your team, training them on those specific use cases, watching adoption every week — the tool sits unused. Most Microsoft Copilot license drawers prove this. The licenses are paid for. The capability is real. The adoption is somewhere around ten percent. The difference between teams that hit fifty or sixty percent adoption — and teams that don't — is whether the manager actively manages the adoption. That's you. The tool won't do it for you.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Myth 3 — “We need to wait for the technology to mature”',
            "Some leaders quietly tell themselves this — they're waiting for AI to settle down before investing time. The technology that matters for your team — drafting, summarising, extracting — is already mature. Waiting costs you a year of compounding."),
          narration:
            "Myth three. We need to wait for the technology to mature. Some leaders quietly tell themselves this. They're waiting for AI to settle down before investing time. The honest reality — the technology that matters for your team's day-to-day work is already mature. Drafting, summarising, extracting. These are not changing in fundamental ways quarter to quarter. They are getting incrementally better. So waiting costs you a year of compounding adoption that your peers' teams are getting. The team that started in twenty twenty-four is now operationally ahead of the team that's still waiting. Don't be the second team.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 2 — the ROI conversation.</p>`,
      narrationLead:
        "Three anchors before we move to the ROI conversation in chapter two.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three changes that matter to managers',
            "Language is programmable · knowledge work is compressible · the skill gap moved to judgement. The technical details under those changes don't matter for management. The three changes do."),
          narration:
            "One. Three changes that matter to managers. Language became programmable. Knowledge work became compressible. The skill gap moved from technical to judgement-based. The technical details under those changes don't really matter for management. The three changes do. Internalise them — and the rest of the course makes sense quickly.",
        },
        {
          html: stepCard('check', 'green', 'Two — Drafting, summarising, extracting first',
            "These are the categories where generative AI just works today. Start your team here. Don't reach for harder use cases until these are running."),
          narration:
            "Two. Drafting, summarising, extracting first. These are the categories where generative AI just works today. Start your team here. Don't reach for harder use cases like classification, translation, or coding assistance until the first three are running well in your team's hands.",
        },
        {
          html: stepCard('check', 'green', 'Three — Active management or no adoption',
            "The tool won't manage itself. Pick the use cases. Train the team. Watch adoption weekly. That's the job. Skip it and you're funding a license drawer."),
          narration:
            "Three. Active management or no adoption. The tool will not manage itself. Pick the use cases for your specific team. Train the team on those specific use cases. Watch adoption weekly. That is the job — and it's mostly yours. Skip it and you're funding a license drawer. Do it and your team compounds.",
        },
      ],
      narrationTrail:
        "Chapter two — the ROI conversation. The math your CFO will eventually ask you for. See you there.",
    },
  ],
}
