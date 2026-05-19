import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiStrategyChapter03: Chapter = {
  courseId: 'ai-strategy-c-suite',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-capital-allocation',
  title: 'Capital allocation',
  subtitle: 'What to spend, when, and on what — without burning credibility.',
  slides: [
    // SLIDE 1
    {
      title: 'Capital allocation',
      iconKey: 'target',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">Capital allocation is where the AI strategy meets the CFO. In the next few minutes, three rules that protect your credibility — and a fourth that decides which capability your firm builds and which it buys.</p>`,
      narrationLead:
        "Welcome to chapter three. Capital allocation. This is where the AI strategy meets the CFO. And honestly, this is where the credibility of the whole AI programme gets won — or lost. We'll walk through three rules that protect your credibility, and then a fourth that decides which capabilities your firm builds itself, and which ones it buys.",
    },
    // SLIDE 2
    {
      title: 'Three rules for AI capital',
      iconKey: 'shield',
      eyebrow: 'Lesson 1 · The rules',
      bodyHtml: `<p>The CFO will ask you these questions. You answer them in advance.</p>`,
      narrationLead:
        "The CFO will ask you these questions — eventually. The trick is to answer them in advance. Three rules.",
      steps: [
        {
          html: stepCard('check', 'blue', 'Rule one — Fund phases, not projects',
            "Capital is released phase-by-phase, not as one block. Diagnose-train comes first. Innovate is gated on what diagnose found. Build is gated on what innovate proved. Sustain is gated on Go-Live. Cash flows match decision points."),
          narration:
            "Rule one. Fund phases — not projects. Capital is released phase by phase, not as one big block at the start. Diagnose and train come first. Innovate is gated on what the diagnostic actually found. Build is gated on what innovate genuinely proved. Sustain is gated on a successful Go-Live. Your cash flows match your decision points. The CFO will love you for this.",
        },
        {
          html: stepCard('check', 'blue', 'Rule two — 70/20/10 across maturity',
            "Seventy percent of AI capital on proven patterns. Twenty on novel-but-evidenced. Ten on exploration. Theatre and exploration both compete for that ten — don't let theatre win."),
          narration:
            "Rule two. Seventy, twenty, ten — across maturity. Seventy percent of your AI capital sits on proven patterns. Things you can buy off the shelf and configure. Twenty percent on novel-but-evidenced patterns. Things that have worked at other firms in your industry. Ten percent on exploration. And here's the catch — theatre and exploration both compete for that ten percent. Don't let theatre win it.",
        },
        {
          html: stepCard('check', 'blue', 'Rule three — Reserve 20% of year-1 for sustainment',
            "Sustainment is real. Twenty percent of your year-one AI capital reserves for the retainers that keep year-one investments alive. Without this reserve, year two is a fire-sale."),
          narration:
            "Rule three. Reserve twenty percent of your year-one AI capital for sustainment. Sustainment is real. It costs real money. Without this reserve, year two becomes a fire sale where you scramble to fund the maintenance of things you built last year — usually by cutting next year's innovation budget. That's a hole most firms only escape by stopping the AI programme entirely. Don't fall in.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'A pattern that survives audit',
        "Phase-gated funding + 70/20/10 + 20% sustainment reserve = a portfolio shape that survives an internal audit, a board challenge, and a CFO swap. These are not nice-to-haves. They are the discipline."),
      calloutNarration:
        "Here's a pattern that survives an audit. Phase-gated funding. Seventy-twenty-ten across maturity. And a twenty percent sustainment reserve. These three together — that's not a wishlist. That's the discipline. And if you put this in place at the start of an AI programme, you will be the only firm in your peer group with this discipline in place. Which means three years from now, you'll be the only firm in your peer group still scaling AI without panic.",
    },
    // SLIDE 3
    {
      title: 'Build versus buy — the only question that matters',
      iconKey: 'compass',
      eyebrow: 'Lesson 2 · Make-or-buy',
      bodyHtml: `<p>Most AI build-versus-buy decisions resolve quickly if you apply one filter — strategic uniqueness. The rest is noise.</p>`,
      narrationLead:
        "Build versus buy. Most of these decisions resolve quickly if you apply one filter — strategic uniqueness. Everything else is noise. Let me show you what that filter looks like in practice.",
      steps: [
        {
          html: stepCard('check', 'green', 'Buy — when the layer is commodity',
            "Document extraction. Transcription. Vector search. Translation. These are commodities now. Buying is faster, cheaper, and someone else maintains the model. Stop building these. You are not differentiated by the OCR engine you wrote in-house."),
          narration:
            "Buy when the layer is commodity. Document extraction. Transcription. Vector search. Translation. These are commodities now. Buying is faster, cheaper, and someone else maintains the model for you. Stop building these. You are not differentiated to your customers by the OCR engine you wrote in-house in twenty twenty-three. Buy that layer. Free up your engineers for the layer above.",
        },
        {
          html: stepCard('check', 'amber', 'Build — when the workflow is your moat',
            "Underwriting logic that's specific to your risk appetite. Clinical workflows that map to your hospital's protocols. Agent reasoning that encodes your service playbook. These you build — because copying them is your competitor's path to becoming you."),
          narration:
            "Build when the workflow is your moat. Underwriting logic that's specific to your risk appetite. Clinical workflows that map to your hospital's specific protocols. Agent reasoning that encodes your service playbook. These you build — because copying them is your competitor's path to becoming you. So you don't outsource them. You don't even let a consultancy own them. They live in your repository.",
        },
        {
          html: stepCard('check', 'blue', 'Partner — when you need senior speed without senior headcount',
            "The middle layer — integration, sustainment, governance, change management. You can do these in-house if you have the bench. Most firms don't. A boutique partner with senior people gets you there faster than hiring — without the long-term headcount commitment."),
          narration:
            "Partner when you need senior speed without taking on senior headcount. The middle layer is integration, sustainment, governance, change management. You can do these in-house if you have the bench. Most firms don't. A boutique partner with senior people gets you there faster than hiring — without committing to the long-term headcount. This is where most successful AI programmes actually deploy partnership capital.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'Where capital quietly leaks',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 3 · Watch-outs',
      bodyHtml: `<p>Most AI capital doesn't leak through bad decisions. It leaks through inattention. Three places to watch.</p>`,
      narrationLead:
        "Three places where AI capital quietly leaks. None of them are dramatic. None of them feel like bad decisions in the moment. But add them up across a year, and you've burned a quarter of your budget without realising it.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Cloud spend without cost-rationalisation',
            "GPT-4o, Claude, embeddings — they don't show up as a single line item. By the time someone notices, the run-rate has tripled. Set up cost dashboards on day one. Tag every workload. Review monthly."),
          narration:
            "One. Cloud spend without cost rationalisation. GPT-4o, Claude, embeddings — these don't show up as a single line item on your finance dashboard. By the time someone notices, the run rate has tripled. So you set up cost dashboards on day one. Tag every workload. Review monthly. Treat AI cloud spend the same way you treat any other piece of operational expenditure — because that's what it is.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Pilot proliferation without Go/No-Go',
            "Pilots are cheap individually. Pilots are expensive collectively. Without a forcing function — a real Go/No-Go at the end of each — they live forever, soaking up your engineers' time."),
          narration:
            "Two. Pilot proliferation without a Go-Slash-No-Go discipline. Individually, pilots are cheap. Collectively, pilots are expensive. Without a forcing function — a real Go-Slash-No-Go review at the end of each pilot — they live forever. They soak up your engineers' time. They occupy your data team's bandwidth. They block your real builds. Run the reviews on schedule. Embrace the no-goes.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Licence sprawl — Copilot, Notion AI, Adobe, Salesforce…',
            "Every SaaS vendor now bolts on an AI tier. Without governance, you're paying for the same capability three times across three platforms. Centralise the AI tooling decision."),
          narration:
            "Three. Licence sprawl. Every SaaS vendor has now bolted on an AI tier. Copilot. Notion AI. Adobe. Salesforce. ServiceNow. Without governance, you're paying for the same capability — drafting, summarisation, image generation — three or four times across three or four platforms. Centralise the AI tooling decision. Make somebody senior accountable. The annual saving is rarely under two hundred thousand for a mid-cap.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Two anchors before chapter 4 — where we turn from capital to people.</p>`,
      narrationLead:
        "Two anchors to take into the next chapter — where we shift from capital to the harder topic. People.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Fund phases, not projects',
            "Phase-gated capital + 70/20/10 across maturity + 20% sustainment reserve. Those three together form the discipline."),
          narration:
            "One. Fund phases, not projects. Phase-gated capital. Seventy-twenty-ten across maturity. Twenty percent sustainment reserve. Those three together form the entire discipline.",
        },
        {
          html: stepCard('check', 'green', 'Two — Buy commodity, build moat, partner for speed',
            "These three categories cover ninety percent of build-versus-buy decisions. The remaining ten percent — you'll know when you're in them."),
          narration:
            "Two. Buy commodity. Build moat. Partner for speed. These three categories cover ninety percent of your build-versus-buy decisions. The remaining ten percent — you'll know when you're in them.",
        },
      ],
      narrationTrail:
        "Next chapter — talent and organisation design. The harder problem. See you there.",
    },
  ],
}
