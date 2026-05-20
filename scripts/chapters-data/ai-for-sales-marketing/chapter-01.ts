import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiSalesChapter01: Chapter = {
  courseId: 'ai-for-sales-marketing',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-fit-map',
  title: 'The revenue-AI fit map',
  subtitle: 'Six AI plays that consistently ship value in sales and marketing — three where AI disappoints — and the principle that separates them.',
  slides: [
    // SLIDE 1
    {
      title: 'The revenue-AI fit map',
      iconKey: 'compass',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">AI in sales and marketing has produced both spectacular productivity wins and high-profile brand disasters in the last eighteen months. This chapter is the fit map — six AI plays that consistently work in revenue, three where AI consistently disappoints, and one principle that explains why.</p>`,
      narrationLead:
        "Welcome to AI for Sales and Marketing. This course is for chief revenue officers, chief marketing officers, sales ops, demand gen, and rev ops leaders who want to move from we have AI to measurable productivity gain. We start with the fit map. AI in revenue functions has produced both spectacular productivity wins in the last eighteen months — and a handful of high-profile brand disasters. Both are real. This chapter explains why some AI plays ship value reliably and others consistently disappoint. Six plays that work. Three that don't. One principle that separates them. Use this map to choose where to invest first.",
    },
    // SLIDE 2
    {
      title: 'Six plays that consistently ship value',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · The wins',
      bodyHtml: `<p>Six revenue AI plays that consistently ship measurable value when deployed with discipline. Each one is covered in depth in a later chapter — this is the inventory.</p>`,
      narrationLead:
        "Six revenue AI plays that consistently ship measurable value. Each of the six is covered in depth in a later chapter — this slide is the inventory. The pattern across all six. AI doesn't replace the rep or the marketer. AI removes the busywork so the human spends time on the work only a human can do.",
      steps: [
        {
          html: stepCard('search', 'green', 'Play 1 — Prospect and account research',
            "AI reads ten sources about a prospect in seconds and gives the rep a clean briefing. Ten-minute job becomes ten seconds. Reps walk into discovery calls genuinely prepared. Chapter two covers it."),
          narration:
            "Play one. Prospect and account research. AI reads ten sources about a target account — their website, their last earnings call, recent news, LinkedIn signal, the relevant industry reports — and gives the rep a clean two-paragraph briefing in seconds. What used to be a ten-minute job for reps who actually did it — and a skipped step for the reps who didn't — becomes a ten-second job that always happens. Reps walk into discovery calls genuinely prepared. The lift on first-meeting quality is significant. Chapter two covers how to do this well.",
        },
        {
          html: stepCard('target', 'green', 'Play 2 — Lead scoring',
            "ML predictive scoring + LLM-based behavioral signal extraction. Marketing knows which leads to route to sales fast. Sales knows which to call first. Chapter three covers the data-quality gate."),
          narration:
            "Play two. Lead scoring. Combines machine learning predictive scoring on structured CRM data with large language model behavioural signal extraction from emails, calls, and form responses. Marketing knows which leads to route to sales fast. Sales knows which leads to call first. The lift on velocity through the funnel is consistent — fifteen to twenty-five percent in well-run deployments. Chapter three covers it, including the CRM data quality gate that decides if any of this works.",
        },
        {
          html: stepCard('zap', 'green', 'Play 3 — Proposal generation',
            "Branded, CRM-grounded proposals in minutes instead of days. Reps spend reclaimed time on the conversation that actually closes deals. Chapter four covers templates and guardrails."),
          narration:
            "Play three. Proposal generation. Branded, CRM-grounded proposals in minutes instead of days. The rep doesn't lose the thinking — they refine the AI draft. The boilerplate goes away. The hours reclaimed go into the conversation that actually closes deals, not the document that gets attached to the email. Chapter four covers the template structure and the three guardrails that keep proposals accurate.",
        },
        {
          html: stepCard('bookOpen', 'green', 'Play 4 — Content first drafts',
            "Blog posts, email sequences, landing-page copy — first draft from AI, brand-voice shaping by humans. Output volume two to three times higher with no quality drop, when done right. Chapter five covers it."),
          narration:
            "Play four. Marketing content first drafts. Blog posts, email nurture sequences, landing-page copy, social media variants. AI produces the first draft. A human marketer shapes it for brand voice and stakes the claims. Output volume rises two to three times with no perceived quality drop — when done right. Chapter five covers the brand voice anchor and the four risks of getting this wrong.",
        },
        {
          html: stepCard('users', 'green', 'Play 5 — Call summarization and signal extraction',
            "AI listens to the sales call. Surfaces next steps, objections, decision criteria, competitor mentions. Rep updates the CRM in two minutes instead of fifteen — and managers see deal risk earlier. Chapter seven."),
          narration:
            "Play five. Call summarization and signal extraction. AI listens to the sales call — with consent. After the call, it surfaces next steps, objections raised, decision criteria revealed, and competitor mentions. The rep updates the CRM in two minutes instead of fifteen — and the manager sees deal risk earlier across the team. The CRM finally has the call notes the company has been promising itself for fifteen years. Chapter seven covers it, including the privacy and consent posture customers now expect.",
        },
        {
          html: stepCard('sparkles', 'green', 'Play 6 — Personalization at the right tier',
            "Email subject lines tuned per segment, web copy tuned per industry, outreach tuned per ICP signal — without crossing the creepy line. Chapter six covers the tiers and the line."),
          narration:
            "Play six. Personalization at the right tier. Email subject lines tuned to the segment. Web copy tuned to the industry the visitor is from. Outreach tuned to the actual signals that matter — funding round, hiring spike, recent product launch — without crossing into the creepy zone where prospects feel surveilled. Light, middle, and deep tiers, each with its own rule. Chapter six covers the tiers and the line you don't cross even when you technically can.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Three plays where AI consistently disappoints',
      iconKey: 'x',
      eyebrow: 'Lesson 2 · The disappointments',
      bodyHtml: `<p>Three revenue AI plays that get pitched constantly and consistently disappoint. Name them; don't fund them; redirect the budget to the six that work.</p>`,
      narrationLead:
        "Three revenue AI plays that get pitched constantly in board decks and on LinkedIn — and consistently disappoint when actually deployed. Name them. Don't fund them. Redirect the budget toward the six plays that work.",
      steps: [
        {
          html: stepCard('x', 'red', 'Disappointment 1 — Fully-automated outbound at scale',
            "AI writes ten thousand personalized emails per day. Response rates collapse within two months as recipients pattern-match the same templates. AI-generated cold outbound is now a negative signal in many industries."),
          narration:
            "Disappointment one. Fully-automated outbound at scale. The pitch — AI writes ten thousand personalized emails per day. The reality. Response rates start okay for the first few weeks. Then they collapse within two months as recipients across the market start pattern-matching the same template constructions, the same opening lines, the same fake personalization. AI-generated cold outbound is now a negative signal in many industries. The brand cost compounds even after you stop. Don't fund this play.",
        },
        {
          html: stepCard('x', 'red', 'Disappointment 2 — Brand voice replacement',
            "Marketing leadership decides AI will write 80% of all customer-facing content. Within a quarter, the brand voice flattens to the generic AI register. Engagement metrics drop. Reversing it takes longer than the original drift."),
          narration:
            "Disappointment two. Brand voice replacement. Marketing leadership decides AI will write eighty percent of customer-facing content with light human review. Within a quarter, the brand voice flattens toward the generic AI register that every other AI-heavy brand also uses. Engagement metrics drop. The brand starts sounding like every other brand. Reversing the drift takes longer than the original drift. Use AI for first drafts. Keep human authorship of the voice itself.",
        },
        {
          html: stepCard('x', 'red', 'Disappointment 3 — Fully-autonomous deal-stage prediction',
            "AI predicts which deals will close — without rep input. The model is confidently wrong about ten to twenty percent of deals every quarter. Reps lose trust in CRM forecasting. The forecast accuracy ends up worse than the spreadsheet."),
          narration:
            "Disappointment three. Fully-autonomous deal-stage prediction. AI looks at activity data and predicts which deals will close — without rep judgment in the loop. The model is confidently wrong about ten to twenty percent of deals every quarter — usually the deals that matter most because they're outside the training distribution. Reps lose trust in CRM forecasting. The forecast accuracy ends up worse than the manual spreadsheet it replaced. AI-assisted forecasting with the rep still calling the call works. Fully autonomous doesn't.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The pattern across the three disappointments',
        "All three replace human judgment instead of augmenting it. The six wins augment judgment — they don't replace it. That's the principle, and it's the next slide."),
      calloutNarration:
        "The pattern across the three disappointments is obvious once named. All three try to replace human judgment. The six wins augment human judgment. That difference is the principle that decides which AI plays in revenue work and which don't. The next slide makes it explicit — because it's worth saying directly.",
    },
    // SLIDE 4
    {
      title: 'The principle — AI assists judgment, never replaces it',
      iconKey: 'compass',
      eyebrow: 'Lesson 3 · The principle',
      bodyHtml: `<p>One principle decides which revenue AI plays ship value and which embarrass the brand. Tape it to the wall.</p>`,
      narrationLead:
        "One principle decides which revenue AI plays ship value and which embarrass the brand. Tape it somewhere visible. Use it as the test for every new AI vendor pitch that lands in the CRO inbox.",
      steps: [
        {
          html: stepCard('compass', 'amber', 'The principle',
            "AI removes the busywork around the rep, the marketer, the customer. AI never replaces the moment of judgment — the one where the human decides what to say, what to claim, what to commit to."),
          narration:
            "The principle. AI removes the busywork around the rep, the marketer, and the customer. AI never replaces the moment of judgment — the moment where the human decides what to say, what to claim, what to commit to. Research before the call — AI does it. Drafting the proposal — AI does it. Listening to the call and surfacing what was said — AI does it. The decision about whether this is a real deal, whether this prospect is qualified, whether this claim is true for this customer — the human does it, always, every time.",
        },
        {
          html: stepCard('check', 'green', 'How to apply it to new vendor pitches',
            "Ask one question. Does the AI take over the moment where the human decides what to say or commit? If yes — pass. If no — evaluate normally. The principle eliminates 60% of pitches in 10 seconds."),
          narration:
            "How to apply the principle to new vendor pitches. Ask one question. Does this AI take over the moment where the human decides what to say, what to claim, what to commit to? If yes — pass on the pitch, regardless of how impressive the demo is. If no — evaluate normally on price, integration, and team fit. The principle eliminates about sixty percent of revenue AI pitches in ten seconds. That's the right rejection rate.",
        },
        {
          html: stepCard('shield', 'amber', 'The two reasons the principle matters',
            "Reason one — replacing judgment introduces bias and brand risk you can't control. Reason two — customers can tell. AI-driven judgment in revenue is a negative trust signal and rising. Protect the human moment."),
          narration:
            "Two reasons the principle matters. Reason one — replacing the human moment of judgment introduces bias and brand risk you cannot fully control. The AI doesn't know your brand voice the way your CMO does. The AI doesn't know your enterprise discount policy the way your VP of sales does. Replacing that judgment with model output produces bad outcomes that show up later. Reason two — customers can tell. AI-driven judgment in revenue interactions is now a negative trust signal and rising. Protect the human moment. It is the value your customers actually pay for.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter two — AI in prospecting.</p>`,
      narrationLead:
        "Three anchors before chapter two — AI in prospecting.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Six plays that ship',
            "Research · scoring · proposals · content drafts · call signal extraction · personalization at the right tier. Each covered in detail in chapters two through seven."),
          narration:
            "One. Six revenue AI plays that consistently ship value. Prospect research. Lead scoring. Proposal generation. Content first drafts. Call signal extraction. Personalization at the right tier. Each of the six is covered in detail in chapters two through seven.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three that disappoint',
            "Fully-automated outbound · brand voice replacement · autonomous deal-stage prediction. Don't fund them, regardless of vendor pressure. Recognise the pattern and pass."),
          narration:
            "Two. Three plays that consistently disappoint. Fully-automated outbound at scale. Brand voice replacement. Autonomous deal-stage prediction. Don't fund them, regardless of how compelling the vendor pitch is. Recognise the pattern, decline the meeting, redirect the budget.",
        },
        {
          html: stepCard('check', 'green', 'Three — One principle for every pitch',
            "AI removes busywork around the human. AI never replaces the human moment of judgment. Apply the principle to every new vendor — it eliminates 60% of pitches in 10 seconds."),
          narration:
            "Three. One principle for every new AI pitch that hits the CRO or CMO inbox. AI removes busywork around the human. AI never replaces the moment of judgment where the human decides what to say, claim, or commit to. Apply this principle as the first filter — it eliminates roughly sixty percent of pitches in ten seconds, and that's the correct rejection rate for the current market.",
        },
      ],
      narrationTrail:
        "Chapter two — AI in prospecting. Where AI changes the rep's first call quality — and the trap that's killing response rates across the industry. See you there.",
    },
  ],
}
