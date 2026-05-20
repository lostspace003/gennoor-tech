import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const m365CopilotChapter04: Chapter = {
  courseId: 'm365-copilot-adoption',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-prompt-libraries',
  title: 'Persona-based prompt libraries',
  subtitle: 'The asset that makes Copilot stick — and how to build, maintain, and govern it across roles.',
  slides: [
    {
      title: 'Persona-based prompt libraries',
      iconKey: 'bookOpen',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">The prompt library is the single most valuable asset in a Copilot rollout. Done well, it’s what each new licensed user opens on day one — and what tells them what Copilot is for in their specific role. Done badly, it’s a generic list that helps no one.</p>`,
      narrationLead:
        "Welcome to chapter four. Persona-based prompt libraries. The prompt library is the single most valuable asset in a Copilot rollout. Done well, it is what each newly licensed user opens on day one — and what tells them what Copilot is for in their specific role, in plain language, with examples they can copy and paste. Done badly, it is a generic list of three hundred prompts that helps no one because nobody can find what fits their work. In the next few minutes, how to build it, how to maintain it, and how to govern it across roles.",
    },
    {
      title: 'The structure of a useful prompt library',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · Structure',
      bodyHtml: `<p>Three structural choices that determine whether the library gets used. Get the structure right and the content fills itself in.</p>`,
      narrationLead:
        "Three structural choices that determine whether the prompt library gets used by anyone. Get the structure right and the content fills itself in over time — pilot users contribute, then early adopters in the broader rollout, then everybody. Get the structure wrong and the library stays static and unread.",
      steps: [
        {
          html: stepCard('compass', 'green', 'Choice 1 — Organised by role, then by task',
            "Top level is role — Sales Executive, Finance Analyst, HR Business Partner, etc. Within each role, prompts are grouped by task — drafting, summarising, analysing. Users find their role; then find the task they're doing right now. Two clicks max."),
          narration:
            "Choice one. Organised by role, then by task. The top level of the library is role — Sales Executive, Finance Analyst, HR Business Partner, Engineering Lead, and so on. Within each role, prompts are grouped by task — drafting, summarising, analysing, extracting, scheduling. Users find their role first; then find the task they're doing right now. Two clicks maximum from opening the library to having a prompt to paste. Any structure that takes more than two clicks doesn't get used at the moment of need.",
        },
        {
          html: stepCard('compass', 'blue', 'Choice 2 — 5–10 prompts per role, not 50',
            "The temptation is to be comprehensive. Resist. 5–10 carefully chosen prompts per role beats 50 mediocre ones. Quality and curation matter more than quantity. Users actually use the curated 5–10; they ignore the comprehensive 50."),
          narration:
            "Choice two. Five to ten prompts per role. Not fifty. The temptation when building a prompt library is to be comprehensive — to cover every possible use case. Resist that temptation. Five to ten carefully chosen prompts per role beats fifty mediocre prompts. Quality and curation matter more than quantity. Users actually use the curated five to ten. They ignore the comprehensive fifty because they can't find anything in it. Less is more here — significantly.",
        },
        {
          html: stepCard('compass', 'amber', 'Choice 3 — Hosted in M365 itself, not in a separate tool',
            "The library lives in a SharePoint site, a Teams app, or a Loop page — wherever your users already go. Adding a separate tool — even a beautiful one — adds friction that kills adoption. Meet users where they already are."),
          narration:
            "Choice three. Hosted in Microsoft 365 itself — not in a separate tool. The library lives in a SharePoint site. A Teams app. A Loop workspace. A pinned channel. Wherever your users already go in their day-to-day. Adding a separate tool for the prompt library — even a beautiful purpose-built one — adds friction. The friction kills adoption. Users don't context-switch to a different tool to find a prompt when they're already in Word trying to draft a document. Meet users where they already are. Use the M365 stack itself to host the library.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The 5×5 launch grid',
        "For the broader rollout launch — five roles, five prompts each. Twenty-five prompts total. Each prompt has a one-line description, the prompt itself, and a 30-second video showing it in action. Ship this in week 1 of the broader rollout — expand from there based on what gets used."),
      calloutNarration:
        "The five-by-five launch grid for the broader rollout. Five roles. Five prompts each. Twenty-five prompts total at launch. Each prompt has a one-line description, the prompt itself, and a thirty-second video clip showing it in action — recorded by a real user, not by IT. Ship this in week one of the broader rollout. Expand from there based on what gets used and what gets requested. The launch library doesn't need to be perfect. It needs to be specific enough that each new licensed user finds their role in the grid and has five prompts to try today.",
    },
    {
      title: 'Where the content comes from',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · Content sourcing',
      bodyHtml: `<p>Three sources for prompt content. None of them is the vendor's default library — that's the dead end most teams accidentally pick.</p>`,
      narrationLead:
        "Three sources for prompt library content. None of them is the vendor's default prompt library — which is the dead end most teams accidentally pick. The vendor library is generic for everyone, which means specific for no one. Source from your own organisation instead.",
      steps: [
        {
          html: stepCard('users', 'green', 'Source 1 — The pilot users',
            "The 20 pilot users from the chapter-3 pilot. Their daily check-in produced the prompts that worked on their actual work. Curate the best 5–10 per role — that's the library's foundation. Authentic, role-specific, already validated."),
          narration:
            "Source one. The twenty pilot users from the chapter-three pilot. Their daily check-in in the Teams channel produced the prompts that actually worked on their real work. Curate the best five to ten per role represented in the pilot. That's the foundation of the library. Authentic — because the prompts came from real work. Role-specific — because the pilot users grouped naturally by role. Already validated — because every prompt that made it into the channel earned an excited reaction from at least one other pilot user. This is the highest-quality source of content available to you. Use it.",
        },
        {
          html: stepCard('users', 'blue', 'Source 2 — The champions in the broader rollout',
            "Once the broader rollout starts, the champion network produces ongoing prompt contributions. Set up a clear submission channel. Curate weekly. Add to the library with attribution — credit travels."),
          narration:
            "Source two. The champion network during the broader rollout. Once the broader rollout starts in earnest, the champions in each function become a continuous source of prompt contributions. Set up a clear submission channel — typically a Teams channel where champions post the prompts that worked for them or for their teams. The change manager curates the submissions weekly. The best ones are added to the library — with attribution to the champion who contributed them. Credit travels in champion networks. Make sure it does in yours.",
        },
        {
          html: stepCard('users', 'amber', 'Source 3 — Office hours questions',
            "Every prompt question asked at office hours that doesn't have a library answer is a gap in the library. The change manager logs them. The next month's library update closes the gaps. Office hours are the library's continuous-improvement loop."),
          narration:
            "Source three. Office hours questions. Every prompt question asked at the weekly office hours that doesn't have a library answer is a gap in the library. The change manager logs the gap during the office hours. The next monthly library update closes the gaps that have accumulated. Office hours are the continuous-improvement loop for the prompt library. Without office hours, the library calcifies. With office hours, the library improves continuously based on what users actually need. The two systems work together.",
        },
      ],
    },
    {
      title: 'Governing the library — three rules',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · Governance',
      bodyHtml: `<p>The library will accumulate problems over time without governance. Three rules that keep it useful — and protect the organisation from prompts that shouldn’t be in production.</p>`,
      narrationLead:
        "The library will accumulate problems over time without governance. Three rules that keep it useful — and protect the organisation from prompts that shouldn't be in production. None of the rules is heavy. All three are needed.",
      steps: [
        {
          html: stepCard('shield', 'blue', 'Rule 1 — No customer data, no employee data, no confidential text in prompts',
            "Prompts in the library are templates — placeholders for the specific data, never the data itself. Treat the library as published content. Anyone in the org can see it; behave accordingly."),
          narration:
            "Rule one. No customer data, no employee data, no confidential text in the library prompts themselves. Prompts in the library are templates — they show the structure of the prompt with placeholders for the specific data the user will fill in. The library never contains real customer names, real financial figures, real employee information. Treat the library as published content within your organisation. Anyone with a license can see it. Behave accordingly. This is the first audit finding when the library hasn't been governed; surface and prevent it.",
        },
        {
          html: stepCard('shield', 'amber', 'Rule 2 — Quarterly review by the change manager + IT',
            "Once a quarter, the change manager and the M365 admin review the library. Outdated prompts removed. New prompts added. Prompt patterns that reveal compliance issues escalated to IT. The review is on the calendar permanently."),
          narration:
            "Rule two. Quarterly review by the change manager and the M365 admin. Once a quarter, the two review the library together. Outdated prompts removed — particularly ones that referenced now-deprecated Copilot features or systems your organisation no longer uses. New prompts added based on the office hours signal and the champion contributions. And prompt patterns that reveal compliance issues — for example, prompts that consistently reference data the user shouldn't be touching — escalated to IT for investigation. The quarterly review is on the calendar permanently. Without it, the library decays within eighteen months.",
        },
        {
          html: stepCard('shield', 'green', 'Rule 3 — Sensitive-topic prompts go through legal review',
            "Some prompts touch sensitive topics — bias detection, HR scenarios, customer communications, financial commentary. Those prompts go through legal review before publication. The review is fast — a day, not a week — but it catches the prompts that shouldn't ship."),
          narration:
            "Rule three. Sensitive-topic prompts go through legal review before they're published in the library. Some prompts touch sensitive topics — bias detection in writing, HR-related scenarios, customer communications that could affect contracts, financial commentary that could be misinterpreted. Those prompts get reviewed by legal before they're published in the library. The review is fast — a day, sometimes less — but it catches the prompts that shouldn't ship in the form they were submitted. Build the relationship with legal early so the review is fast. Without the rule, sensitive prompts inevitably end up in the library, and the cleanup later is more costly than the review upfront.",
        },
      ],
    },
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 5 — governance and the IT conversation.</p>`,
      narrationLead:
        "Three anchors before chapter five — governance and the IT conversation.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three structural choices',
            "Role-then-task organisation · 5–10 prompts per role · hosted in M365 itself. The 5×5 launch grid for the broader rollout."),
          narration:
            "One. Three structural choices. Organise by role, then by task — two clicks maximum. Five to ten prompts per role, not fifty. Hosted in Microsoft 365 itself, not a separate tool. The five-by-five launch grid — five roles, five prompts each — for the broader rollout launch.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three sources for content',
            "Pilot users · champion network · office hours questions. Three sources, working together. None of them is the vendor's default library."),
          narration:
            "Two. Three sources for content. The pilot users from the chapter-three pilot, who produced the authentic prompts on their real work. The champion network during the broader rollout, contributing continuously. Office hours questions revealing gaps in the library. Three sources working together. None of them is the vendor's default library — which is generic for everyone, specific for nobody.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three governance rules',
            "No real data in prompts · quarterly review · legal review on sensitive topics. Lightweight. Necessary. Without them, the library accumulates problems."),
          narration:
            "Three. Three governance rules. No customer data, employee data, or confidential text in prompts. Quarterly review by the change manager and the M365 admin. Legal review on sensitive-topic prompts. Lightweight rules. All three necessary. Without them, the library accumulates problems that become hard to unwind later.",
        },
      ],
      narrationTrail:
        "Chapter five — governance and the IT conversation. What your IT team needs in place before the rollout reaches scale. See you there.",
    },
  ],
}
