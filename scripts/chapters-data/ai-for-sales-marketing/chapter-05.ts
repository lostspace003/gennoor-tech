import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiSalesChapter05: Chapter = {
  courseId: 'ai-for-sales-marketing',
  chapterId: 'chapter-05',
  chapterNumber: 5,
  chapterSlug: 'chapter-05-content-production',
  title: 'Content production — at scale, on brand',
  subtitle: 'A brand voice anchor that survives AI · four brand risks nobody talks about · the pipeline that doubles output without flattening voice.',
  slides: [
    // SLIDE 1
    {
      title: 'Content production — at scale, on brand',
      iconKey: 'sparkles',
      eyebrow: 'Chapter 5 · Opening',
      bodyHtml: `<p class="lead">Marketing content is where AI can double output volume without quality drop — or quietly flatten your brand to the generic AI register over a quarter. The difference is the brand voice anchor and four risks nobody talks about until they bite.</p>`,
      narrationLead:
        "Welcome to chapter five. Content production at scale, on brand. Marketing content is where AI can genuinely double output volume — blog posts, email sequences, landing-page variants, social posts — without quality drop perceived by readers. Or — and this is the path most teams accidentally take — it can quietly flatten your brand voice to the generic AI register that every other AI-heavy brand is also drifting toward. Same readers. Same channels. Different outcomes. The difference is the brand voice anchor and the four risks that nobody talks about until they bite. Both are in this chapter.",
    },
    // SLIDE 2
    {
      title: 'The brand voice anchor',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · The anchor',
      bodyHtml: `<p>Three components, deployed together. Each one alone is insufficient. Together, they preserve a recognisable brand voice through high-volume AI-assisted production.</p>`,
      narrationLead:
        "Three components for the brand voice anchor, deployed together. Each component alone is insufficient — most teams deploy one and watch their voice flatten anyway. Together, they preserve a recognisable brand voice through high-volume AI-assisted production. Setup is two to three weeks of focused work by the marketing leadership team. After that the discipline is light. Worth the setup.",
      steps: [
        {
          html: stepCard('bookOpen', 'blue', 'Component 1 — Style guide as system prompt',
            "Your written brand voice — sentence rhythm, vocabulary preferences, the words you never use, the rhetorical moves you favour — encoded as a system prompt the AI is given every generation. Not the brand book. The operating prompt."),
          narration:
            "Component one. Your style guide as a system prompt the AI is given every generation. Not the existing brand book PDF — that's a reference document, not a prompt. The operating style guide. Sentence rhythm preferences — short sentences, or longer flowing ones. Vocabulary preferences — concrete nouns over abstract ones, active voice over passive. The words you never use — corporate clichés, weasel adverbs. The rhetorical moves you favour — specifics before generalisations, claim before evidence. Two pages, written tightly. Sent to the model as the system prompt every time. This is the highest-leverage component because it shapes every output before the human even sees a draft.",
        },
        {
          html: stepCard('users', 'blue', 'Component 2 — Two human edit passes per piece',
            "Pass one — content editor for accuracy, structure, brand voice. Pass two — final editor for tone, specifics, the human touch the AI cannot fake. Both passes are non-negotiable for customer-facing content."),
          narration:
            "Component two. Two human edit passes per piece of customer-facing content. Pass one — a content editor checks for accuracy, structure, brand voice fidelity, any hallucinated facts, any breaches of the claim register from chapter four. Pass two — a final editor refines for tone, adds the specific examples that make the piece feel grounded, inserts the small human touches the AI cannot fake — the offhand reference, the inside joke, the specific customer name. Both passes are non-negotiable for any customer-facing content. The shortcut where the AI draft goes out with one quick read is where brand voice flattens fastest.",
        },
        {
          html: stepCard('search', 'blue', 'Component 3 — Quarterly voice fingerprint audit',
            "Once a quarter, sample 20 pieces of content from the previous quarter. Compare against 20 pieces from before AI was introduced. Has the voice drifted? Drift is gradual; the quarterly audit catches it before it becomes visible to customers."),
          narration:
            "Component three. Quarterly voice fingerprint audit. Once a quarter, the marketing leadership team samples twenty pieces of customer-facing content from the previous quarter. Compares them against twenty pieces from before AI was introduced. Has the voice drifted toward the AI generic register? Drift is gradual — usually two or three percent per quarter — and accumulates into something customers feel before anyone internal notices. The quarterly audit catches it while it's still small enough to correct via prompt updates and editor coaching. Without the audit, drift is invisible until it's already significant. Schedule the audit. Don't skip it.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Four brand risks nobody talks about',
      iconKey: 'alertTriangle',
      eyebrow: 'Lesson 2 · The risks',
      bodyHtml: `<p>Four risks of AI-assisted content. Each one is real and recurring across companies. Knowing the four lets the marketing team design checks specifically for them.</p>`,
      narrationLead:
        "Four brand risks specific to AI-assisted content production. Each one is real and recurring across companies in 2025 and 2026. Knowing the four lets the marketing team design specific checks for each. Generic risk awareness doesn't catch them — specific awareness does.",
      steps: [
        {
          html: stepCard('alertTriangle', 'red', 'Risk 1 — Hallucinated claims about your own product',
            "AI invents a feature your product doesn't have, a performance number nobody validated, a customer outcome you never achieved. Customer reads it. Buys based on it. The gap surfaces in onboarding."),
          narration:
            "Risk one. Hallucinated claims about your own product. AI invents a feature your product doesn't actually have, a performance number nobody internally has validated, or a customer outcome you never achieved. The customer reads it on a landing page or in an email. They buy partly because of the claim. The gap surfaces in onboarding when the feature they expected isn't there. The deal becomes a churn risk before it's even live. The claim register from chapter four extends to marketing content — every product claim must come from a vetted register, not from AI imagination. This is the most common AI content failure mode.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Risk 2 — Competitor confusion',
            "AI references a competitor's feature in your content because it learned that competitors talk about it. Reads as if you confused the two products. Embarrassing at best, legally exposed at worst."),
          narration:
            "Risk two. Competitor confusion. The AI references a competitor's feature in your content because the model learned during training that competitors in your category talk about that feature. The content reads as if you have confused the two products. At best, it's embarrassing — your readers notice and your competence signal drops. At worst, you're making implicit comparative claims that legal didn't approve. The check — every piece of content goes through a competitor-mention scan before publication. If competitor names appear, the marketing editor manually validates that the references are intentional and accurate.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Risk 3 — Regulatory exposure in regulated language',
            "Healthcare, financial services, legal, and regulated industries — the AI uses language the regulator has restricted. The claim sounds fine to a marketer; the regulator's language model flags it on review. Six-figure fines and content takedowns follow."),
          narration:
            "Risk three. Regulatory exposure in regulated language. Healthcare, financial services, legal services, education, and other regulated industries — the AI uses language the regulator has restricted. A diagnostic claim in healthcare. A guaranteed return claim in financial services. A passing-rate claim in education. The language sounds fine to a marketer who isn't a regulatory specialist. The regulator's review process — increasingly automated and increasingly AI-assisted itself — flags it on routine inspection. Six-figure fines and content takedowns follow. The check — regulated industries need a compliance review step in the content pipeline, with the regulated vocabulary explicitly checked. Build this into the workflow as a required step, not as an after-thought.",
        },
        {
          html: stepCard('alertTriangle', 'red', 'Risk 4 — Sameness drift across the market',
            "Every AI-heavy brand uses the same model with the same training data. Outputs converge across companies. Your content reads like every other company's content. Differentiation erodes invisibly over quarters."),
          narration:
            "Risk four. Sameness drift across the market — and this is the risk that's the hardest to see and the most consequential long-term. Every AI-heavy brand uses the same handful of foundation models, which were trained on the same internet content. Without strong style anchors and editorial discipline, outputs converge across companies. Your content starts reading like every other company's content in your category. Differentiation erodes invisibly over quarters until a customer says — you all sound the same now — and you realise you can't tell your blog posts apart from your competitor's blog posts. The defence — the brand voice anchor from the previous slide, run with discipline. The risk doesn't show up in any single piece of content. It shows up in the aggregate, over time. Watch for it.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The check that catches three of the four',
        "A pre-publication checklist with: claim register lookup · competitor-name scan · regulated-vocabulary scan. Takes the content editor 90 seconds per piece. Catches risks 1, 2, and 3. Risk 4 needs the quarterly audit."),
      calloutNarration:
        "The single check that catches three of the four risks. A pre-publication checklist run by the content editor. Three lookups. Claim register — every product claim sourced. Competitor name scan — any mentions intentional and validated. Regulated vocabulary scan if you're in a regulated industry. Total time, ninety seconds per piece. Catches risks one, two, and three before publication. Risk four — sameness drift — doesn't show up in any single piece, so the quarterly fingerprint audit from the previous slide is its specific catch. Together the two practices cover all four risks.",
    },
    // SLIDE 4
    {
      title: 'The content pipeline that works',
      iconKey: 'cog',
      eyebrow: 'Lesson 3 · The pipeline',
      bodyHtml: `<p>Three stages — AI drafts, human shapes, expert validates. Each stage has a clear owner and a clear stop signal. Skip a stage and the brand voice drift becomes inevitable within a quarter.</p>`,
      narrationLead:
        "Three stages in the content pipeline that ships volume without flattening voice. Each stage has a clear owner and a clear stop signal — if the stage owner isn't satisfied, the piece doesn't move forward. Skip a stage and the brand voice drift becomes inevitable within a quarter. Run all three on every customer-facing piece.",
      steps: [
        {
          html: stepCard('sparkles', 'green', 'Stage 1 — AI drafts (15 minutes per piece)',
            "Content marketer provides brief — topic, audience, three to five key points, target length. AI generates draft using the style-guide system prompt. Output: structured first draft. Time saved versus from-scratch is dramatic."),
          narration:
            "Stage one. AI drafts. The content marketer provides a focused brief — the topic, the audience persona, three to five key points the piece must cover, the target length. The AI generates the draft using the style guide as system prompt. Output is a structured first draft with the right shape. Time saved versus writing from scratch is dramatic — typically thirty minutes to an hour reduced to fifteen minutes for the brief plus generation. The temptation is to publish from here. Don't. The next two stages are what makes the volume sustainable without quality collapse.",
        },
        {
          html: stepCard('users', 'green', 'Stage 2 — Human shapes (20–30 minutes per piece)',
            "Content editor refines for brand voice, adds specific examples, tightens length, removes generic phrasing. The piece transforms from competent to recognisable. This is where the brand voice actually lives."),
          narration:
            "Stage two. Human shapes. The content editor refines for brand voice fidelity, adds specific examples and customer references the AI doesn't know, tightens the length because AI drafts are almost always slightly too long, removes the generic phrasing the AI defaulted to. The piece transforms from competent to recognisable. Time spent — twenty to thirty minutes per piece. This is where the brand voice actually lives. The editor's craft here is what produces durable brand voice through high AI-assisted volume. Hire and pay for this editorial role properly. It is the most undervalued role in AI-era content marketing.",
        },
        {
          html: stepCard('shield', 'green', 'Stage 3 — Expert validates (5–15 minutes per piece)',
            "Subject expert checks for accuracy. In regulated industries, compliance reviewer checks for vocabulary. Pre-publication checklist runs — claim register, competitor scan, regulated vocab. Only then publish."),
          narration:
            "Stage three. Expert validates. A subject matter expert — the product manager, the engineer, the legal reviewer in a regulated industry — checks for accuracy on the technical or domain-specific content. In regulated industries, a compliance reviewer also runs the regulated vocabulary scan. The pre-publication checklist from the previous slide runs here — claim register lookup, competitor name scan, regulated vocab scan. Total time five to fifteen minutes per piece. Only then does the piece publish. Skipping this stage is where the hallucinated claim, the embarrassing competitor reference, or the regulator violation reaches customers. Don't skip it. The fifteen minutes saved by skipping is not worth the brand event it occasionally produces.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 5 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter six — personalization that works.</p>`,
      narrationLead:
        "Three anchors before chapter six — personalization that works.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Three brand voice anchor components',
            "Style guide as system prompt · two human edit passes · quarterly voice fingerprint audit. All three together. Each alone is insufficient. The audit is the one most teams skip until drift is already visible."),
          narration:
            "One. Three brand voice anchor components, deployed together. Style guide as the system prompt the AI receives every generation. Two human edit passes on every customer-facing piece. Quarterly voice fingerprint audit comparing recent output to pre-AI baseline. All three together. Each alone is insufficient. The quarterly audit is the one most teams skip until drift is already visible to customers.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four brand risks',
            "Hallucinated product claims · competitor confusion · regulated-vocabulary exposure · sameness drift across the market. Three catch in the pre-publication checklist; sameness drift catches in the quarterly audit."),
          narration:
            "Two. Four brand risks specific to AI-assisted content. Hallucinated claims about your own product. Competitor confusion. Regulatory exposure in regulated language. Sameness drift across the market. The first three catch in the pre-publication checklist — claim register lookup, competitor scan, regulated vocab scan — ninety seconds per piece. Sameness drift only catches in the quarterly fingerprint audit because it doesn't show up in any single piece.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three-stage pipeline',
            "AI drafts (fast) · human shapes (the editorial craft) · expert validates (accuracy + compliance). Skip a stage and brand voice drift becomes inevitable. The editor role is the most undervalued role in AI-era marketing."),
          narration:
            "Three. Three-stage pipeline on every customer-facing piece. AI drafts in fifteen minutes. Human shapes in twenty to thirty minutes — this is where the brand voice actually lives, so hire and pay for editorial talent properly. Expert validates in five to fifteen minutes, including the pre-publication checklist. Skip a stage and brand voice drift or accuracy errors become inevitable. The total per-piece time of one hour produces volume that is sustainable without quality collapse.",
        },
      ],
      narrationTrail:
        "Chapter six — personalization that works. Three tiers, light to deep, and the creepy line you don't cross even when you can. See you there.",
    },
  ],
}
