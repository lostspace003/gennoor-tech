import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiSalesChapter03: Chapter = {
  courseId: 'ai-for-sales-marketing',
  chapterId: 'chapter-03',
  chapterNumber: 3,
  chapterSlug: 'chapter-03-lead-scoring',
  title: 'Lead scoring with AI',
  subtitle: 'Two scoring layers · the CRM data quality gate · and the score-to-action split between marketing and sales.',
  slides: [
    // SLIDE 1
    {
      title: 'Lead scoring with AI',
      iconKey: 'target',
      eyebrow: 'Chapter 3 · Opening',
      bodyHtml: `<p class="lead">Lead scoring is where AI in revenue can compound — or where it can fail invisibly for a year before anyone notices. Two scoring layers. One data-quality gate that decides if any of it works. One score-to-action split nobody talks about until it's wrong.</p>`,
      narrationLead:
        "Welcome to chapter three. Lead scoring with AI. Lead scoring is where AI in revenue can compound — every quarter the model gets sharper and the funnel converts faster. It is also where AI in revenue can fail invisibly for twelve months before anyone notices. Two scoring layers that work together. One CRM data-quality gate that decides whether any of the scoring works at all. And one score-to-action split between marketing and sales that, when wrong, destroys the value of the scoring entirely. Get all three right.",
    },
    // SLIDE 2
    {
      title: 'Two scoring layers — ML + LLM',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · The two layers',
      bodyHtml: `<p>Two layers, working together. Most teams deploy one and call it done — and lose two-thirds of the value of the other.</p>`,
      narrationLead:
        "Two layers, working together. Most teams deploy one of the two and call lead scoring done — and lose roughly two-thirds of the value the other layer would add. The two layers are different tools, different vendor categories, and different setup work — but they need to live as one scoring system. Let me cover what each layer does and what the combined score should look like.",
      steps: [
        {
          html: stepCard('cog', 'blue', 'Layer 1 — ML predictive scoring',
            "Machine learning model trained on closed-won and closed-lost from the last 24 months against structured CRM data — firmographic, behavioural, technographic. Outputs a probability-to-close score per lead."),
          narration:
            "Layer one. Machine learning predictive scoring. A model trained on your last twenty-four months of closed-won and closed-lost deals against structured CRM data — firmographic data like company size and industry, behavioural data like web visits and email engagement, technographic data like the stack the prospect is on. The model outputs a probability-to-close score per lead — typically zero to one hundred. This is the layer most teams already have, usually through HubSpot or Salesforce. It is necessary. It is not sufficient. Run on its own, it produces decent ranking — but it misses the signals an LLM can read.",
        },
        {
          html: stepCard('sparkles', 'blue', 'Layer 2 — LLM behavioural signal extraction',
            "Large language model reads unstructured signals — email replies, call transcripts, form free-text, support tickets, public posts. Surfaces intent and disqualification signals the ML model can't see in structured fields."),
          narration:
            "Layer two. Large language model behavioural signal extraction. The LLM reads the unstructured signals — actual email replies and how they read, call transcripts and what was said, form free-text fields where the prospect described their pain in their own words, support ticket text if the prospect is also a customer of an adjacent product, public posts where the prospect described their priorities. The LLM surfaces intent signals — the prospect said this is urgent — and disqualification signals — the prospect said budget is locked for the next quarter — that the structured ML model simply cannot see because they live in text fields. Run on its own this layer is noisy. Combined with layer one, it sharpens the score dramatically.",
        },
        {
          html: stepCard('check', 'blue', 'The combined score — what good looks like',
            "Single score per lead, 0–100, with the top-line confidence number plus three reason codes — two from ML features, one from LLM-extracted intent. The rep or marketer sees why the score is what it is."),
          narration:
            "What the combined score looks like in the rep's CRM view. Single number, zero to one hundred, top-line. Underneath it — three reason codes. Two of them from the ML model — for example, this account size has a thirty percent higher close rate than your base, this industry vertical has a forty percent higher close rate than your base. One of them from the LLM extraction — for example, the prospect's last reply mentioned an active evaluation against a named competitor. The rep or marketer sees not just the score, but why the score is what it is. Explainable lead scoring is the difference between trusted lead scoring and ignored lead scoring.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Where most teams deploy',
        "Most teams have layer 1 only. The lift from adding layer 2 is typically 20–35% improvement in MQL-to-SQL conversion, depending on how much unstructured signal sits in your CRM. The data is already there — extract it."),
      calloutNarration:
        "Where most teams currently are. Most teams have layer one only — the structured ML model their CRM platform offers. The lift from adding layer two — LLM signal extraction across the unstructured fields you already have — is typically twenty to thirty-five percent improvement in MQL to SQL conversion. The signal is already in your CRM. You're just not reading it. Layer two is the highest-ROI scoring investment available to most revenue teams right now.",
    },
    // SLIDE 3
    {
      title: 'The CRM data quality gate — six checks',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · The gate',
      bodyHtml: `<p>Six honest checks. Run them before scoring. If three or more fail, fix the data first; scoring will only amplify the noise.</p>`,
      narrationLead:
        "Six honest checks before you deploy any AI scoring. The CRM data quality gate. If three or more of the six fail, fix the data quality first. AI scoring on top of bad data doesn't improve outcomes — it amplifies the existing noise into confident-sounding wrong scores that reps stop trusting within a quarter. Run the gate.",
      steps: [
        {
          html: stepCard('check', 'amber', 'Check 1 — Are 80%+ of opportunities sourced and tagged?',
            "If half your closed-won deals show source 'unknown', the ML model can't learn what your best channels actually are. Below 80% — fix sourcing hygiene first."),
          narration:
            "Check one. Are eighty percent or more of your opportunities properly sourced and tagged? Source tags like inbound demo, outbound prospecting, partner referral, event, paid search. If half your closed-won deals show source unknown — and many teams find this on inspection — the ML model can't learn what your best channels actually are. The model will produce confident-sounding scores based on what's there, but the scores will be subtly wrong. Below eighty percent source-tag coverage — fix sourcing hygiene first.",
        },
        {
          html: stepCard('check', 'amber', 'Check 2 — Closed-lost reasons populated with discipline?',
            "Closed-lost reason is the highest-signal training input for the model. If most closed-lost rows say 'no decision' or are blank, the model can't learn what disqualifies a deal."),
          narration:
            "Check two. Closed-lost reasons populated with discipline. Closed-lost reason is the single highest-signal training input for any lead scoring model. If most of your closed-lost rows say no decision or are blank — and many teams find this — the model can't learn what disqualifies a deal in your business. Closed-lost reasons need to be a controlled vocabulary, populated by the rep before the opportunity actually closes, and audited monthly. This is unglamorous work and it is the highest-impact data-quality investment for scoring.",
        },
        {
          html: stepCard('check', 'amber', 'Check 3 — Activity logging in the last 90 days',
            "Are calls and emails logged automatically — or is the rep expected to log them manually? If manual, expect 30–50% logging coverage at best. AI call summarization solves this. See chapter seven."),
          narration:
            "Check three. Activity logging in the last ninety days. Are calls and emails getting logged in CRM automatically — via the AI call summarization covered in chapter seven, or via the email plug-in? Or is the rep expected to log activities manually? If manual, expect thirty to fifty percent logging coverage at best, with the high-activity reps logging less than the low-activity reps because they're busy. AI scoring relies on activity data. AI call summarization in chapter seven is therefore prerequisite infrastructure for AI scoring in this chapter.",
        },
        {
          html: stepCard('check', 'amber', 'Check 4 — Account-to-contact relationships clean?',
            "Buying committees with 3-7 contacts per account convert dramatically better than single-contact accounts. If your CRM treats each contact as a separate lead, scoring loses the committee signal."),
          narration:
            "Check four. Account to contact relationships clean. Buying committees with three to seven contacts per account convert dramatically better than single-contact accounts — every B2B revenue team's data confirms this once measured. If your CRM treats each contact as a separate lead disconnected from the account, scoring loses the committee signal entirely. Account-based architecture, with contacts properly nested under accounts, is prerequisite. Many CRM environments are technically capable but operationally broken on this dimension.",
        },
        {
          html: stepCard('check', 'amber', 'Check 5 — Duplicate accounts and contacts under control?',
            "More than 8% duplicate rate breaks scoring. The same account with three different versions splits the signal three ways and the model averages it to noise."),
          narration:
            "Check five. Duplicate accounts and contacts under control. More than eight percent duplicate rate — meaning more than eight out of every hundred rows are duplicates of other rows — breaks scoring quality measurably. The same account appearing as three different records splits the engagement signal three ways and the model averages it down to noise. Most CRM environments without active de-duplication run between twelve and twenty-five percent duplication. Fix this before scoring. There are mature tools for it.",
        },
        {
          html: stepCard('check', 'amber', 'Check 6 — The bias check on your training data',
            "If your closed-won history overrepresents a single industry, segment, or region, the model learns that bias. Audit explicitly: does my training data reflect where I want my pipeline to come from?"),
          narration:
            "Check six. The bias check on your training data. If your closed-won history over-represents a single industry — for instance financial services because that's where you started — the ML model learns that financial services prospects are higher quality. It will down-rank prospects from the verticals you're trying to expand into. That's not a model error — it's a training data bias. Audit explicitly. Does my training data reflect where I want my pipeline to come from in the next two years, or only where it's been? If the answer is only where it's been, supplement the training with explicit weighting on the verticals you're expanding into. This check is the one that's missing in eighty percent of deployments.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The score-to-action split',
      iconKey: 'flag',
      eyebrow: 'Lesson 3 · The split',
      bodyHtml: `<p>One score. Three actions. Marketing owns one of them. Sales owns another. Neither owns the third — and that's the one most teams get wrong.</p>`,
      narrationLead:
        "One combined lead score. Three different actions depending on which band the score lands in. Marketing owns one band. Sales owns another. The third band is the one most teams get wrong — neither marketing nor sales owns it, and so nobody acts, and the lead decays. Let me cover all three bands explicitly.",
      steps: [
        {
          html: stepCard('flag', 'green', 'Band 1 — High score (70+) — Sales acts within 24 hours',
            "High-score leads route to a named SDR or AE with an explicit SLA. 24 hours is the gold standard. After 48 hours, conversion drops by half. Speed-to-lead is the highest-leverage metric in the funnel."),
          narration:
            "Band one. High score, seventy or above. Sales acts within twenty-four hours. The lead routes to a named SDR or account executive — not a queue — with an explicit SLA. Twenty-four hours is the gold standard. After forty-eight hours, conversion drops by roughly half across industries. Speed-to-lead on high-score leads is one of the highest-leverage metrics in your entire funnel — and the easiest one to measure. Most teams have an SLA written down somewhere. Fewer teams have it actually enforced. Enforce it.",
        },
        {
          html: stepCard('flag', 'amber', 'Band 2 — Medium score (40–69) — Marketing nurtures',
            "Medium-score leads route back to marketing for nurture — high-quality content, gated assets, education sequences. The goal is to move them to high-score, not to push them to sales prematurely."),
          narration:
            "Band two. Medium score, between forty and sixty-nine. Marketing nurtures. The lead routes back into marketing for nurture sequencing — high-quality content, gated assets, education sequences that build context. The goal is to move the prospect into the high-score band over the next quarter, not to push them to sales prematurely. The temptation is always to push everything to sales because pipeline pressure is real. Resist it. Sales calls on band two leads waste rep capacity and produce the let-them-incubate response from prospects who weren't ready, which damages the brand for the eventual moment when they would be ready.",
        },
        {
          html: stepCard('flag', 'red', 'Band 3 — Low score (under 40) — The neither-owns trap',
            "Most teams treat low-score leads as ignored. They decay. The right move — automated check-in every 90 days, watching for the signal that changes the score. Nobody owns the cadence, so nobody runs it."),
          narration:
            "Band three. Low score, under forty. This is the band most teams get wrong. The lead doesn't fit today — but the signal that would change that may arrive in three months when a new exec joins, or in six months when budget reopens. Most teams treat low-score leads as silently ignored. The leads decay. The right move — an automated check-in cadence every ninety days that watches for the signal that would lift the score. Nobody currently owns this cadence because it's neither marketing's nurture flow nor sales' active pipeline. Assign it explicitly to rev ops — and have rev ops set up the automation. This is where the bulk of buried pipeline lives.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Where the bottleneck usually is',
        "It's not in the model. It's in the gap between band 1's SLA — frequently missed — and band 3's neither-owns-it status. Fix both, and your scoring system delivers two to three times more pipeline than the model alone."),
      calloutNarration:
        "Where the bottleneck in lead scoring usually lives. Not in the model — modern scoring models are good enough. The bottleneck is in the gap between band one's SLA being frequently missed and band three having no owner at all. Fix both, and the same scoring system delivers two to three times more pipeline than the model alone delivers. The model is the easy part. The operating model is the hard part. The operating model is where the value compounds.",
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 3 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter four — proposal generation.</p>`,
      narrationLead:
        "Three anchors before chapter four — proposal generation.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Two scoring layers, combined',
            "ML predictive on structured data + LLM signal extraction on unstructured text. Combined produces explainable scores reps trust. Layer 2 is the highest-ROI scoring upgrade most teams haven't made."),
          narration:
            "One. Two scoring layers, run as one combined system. Machine learning predictive scoring on structured CRM data. Large language model signal extraction on the unstructured text already sitting in your CRM. Combined, they produce explainable scores with reason codes that reps actually trust. Layer two is the highest-ROI scoring upgrade most revenue teams haven't yet made.",
        },
        {
          html: stepCard('check', 'green', 'Two — Six checks before you deploy',
            "Source tags · closed-lost reasons · activity logging · account-contact relationships · duplicates · training data bias. Three or more failing — fix data first, scoring after."),
          narration:
            "Two. Six honest checks on CRM data quality before you deploy any AI scoring. Source tags. Closed-lost reasons. Activity logging coverage. Account to contact relationship hygiene. Duplicate rate. Training data bias. Three or more failing — fix the data first. AI scoring on bad data confidently amplifies the noise. Reps stop trusting it within a quarter. Recovery from lost trust takes longer than the data fix would have taken.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three bands, three actions',
            "High score — sales acts in 24 hours. Medium — marketing nurtures. Low — rev ops automated check-in every 90 days. Band 3 is where most teams lose buried pipeline because nobody owns it."),
          narration:
            "Three. Three score bands, three different actions. High score — sales acts within twenty-four hours, with an enforced SLA, to a named rep. Medium score — marketing nurtures, with the goal of moving the prospect into the high band over a quarter, not pushing them to sales prematurely. Low score — rev ops runs an automated ninety-day check-in cadence that watches for the signal that would change the score. Band three is where most teams lose buried pipeline because neither marketing nor sales owns it. Assign it explicitly.",
        },
      ],
      narrationTrail:
        "Chapter four — proposal generation. The four-block template, the three guardrails, and where the saved time should go. See you there.",
    },
  ],
}
