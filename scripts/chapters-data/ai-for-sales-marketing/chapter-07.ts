import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiSalesChapter07: Chapter = {
  courseId: 'ai-for-sales-marketing',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-call-ai',
  title: 'Sales call AI — transcripts to action',
  subtitle: 'Four useful extractions from every call · the coaching feedback loop · the privacy posture customers now expect.',
  slides: [
    // SLIDE 1
    {
      title: 'Sales call AI — transcripts to action',
      iconKey: 'users',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Call AI is the CRM data quality miracle the revenue function has been waiting for fifteen years. Done right, it finally fills CRM with the call notes that were always promised. Done wrong, it costs customer trust the next time a deal opens.</p>`,
      narrationLead:
        "Welcome to chapter seven. Sales call AI — transcripts to action. Call AI is the customer relationship management data quality miracle the revenue function has been waiting for, honestly, for fifteen years. Done right, it finally fills CRM with the call notes that every CRM rollout document since 2010 has promised. Done wrong, it costs customer trust the next time a deal opens with that customer. The right and wrong shapes of call AI are well understood now. Let me cover the four extractions that matter, the coaching loop that compounds, and the privacy posture customers now expect.",
    },
    // SLIDE 2
    {
      title: 'Four extractions from every call',
      iconKey: 'sparkles',
      eyebrow: 'Lesson 1 · The extractions',
      bodyHtml: `<p>Four extractions. Each one drives a specific downstream action. Together they make every call genuinely useful to the team — not just to the rep who took it.</p>`,
      narrationLead:
        "Four extractions from every customer-facing call. Each one drives a specific downstream action that wouldn't have happened without it. Together they make every call genuinely useful to the entire revenue team — not just to the individual rep who took the call. Configure your call AI tool to surface all four. If it only surfaces the first one, you're getting twenty-five percent of the available value.",
      steps: [
        {
          html: stepCard('flag', 'blue', 'Extraction 1 — Next steps, with owner and date',
            "Every call ends with next steps stated by the rep or the customer. AI captures them with explicit owners and dates. Rep approves with one click. CRM has the follow-up commitments in two minutes instead of the typical fifteen — or the typical not-at-all."),
          narration:
            "Extraction one. Next steps with owner and date. Every well-run customer-facing call ends with next steps explicitly stated by the rep or the customer. AI captures them as structured items with explicit owners and dates. The rep reviews and approves with one click after the call. CRM now has the follow-up commitments in two minutes instead of the typical fifteen — or, frankly, the typical not-at-all. This single extraction is what changes the follow-through rate on commitments made in calls. Pipeline conversion lifts measurably as commitments stop slipping into the gap between memory and CRM.",
        },
        {
          html: stepCard('alertTriangle', 'amber', 'Extraction 2 — Objections raised',
            "Every objection the customer raised — pricing, integration, security, internal politics. Surfaced for the rep to address; aggregated across the team for product, marketing, and product marketing to act on at the pattern level."),
          narration:
            "Extraction two. Objections raised. Every objection the customer raised during the call — pricing concerns, integration anxieties, security questions, internal political signals like he wouldn't go for this. The AI surfaces them for the individual rep to address in the next conversation. More importantly, it aggregates them across the entire team. Product, marketing, and product marketing leadership see the patterns — the top three objections this quarter, how often they appear, which segments raise them most. The aggregate view is where this extraction produces strategic value, not just tactical follow-through. Most teams set up extraction one and skip the aggregation. Set up the aggregation; it's where the executive value sits.",
        },
        {
          html: stepCard('target', 'amber', 'Extraction 3 — Decision criteria revealed',
            "What does the customer actually care about? Speed of deployment, security posture, total cost of ownership, vendor risk, executive relationships. AI surfaces what they said matters. Sales strategy adjusts deal by deal — and at the pattern level."),
          narration:
            "Extraction three. Decision criteria revealed during the call. What does this customer actually care about — not what your account brief assumed, but what they said in their own words during the call? Speed of deployment. Security and compliance posture. Total cost of ownership over three years. Vendor concentration risk. Executive relationships and references they trust. The AI surfaces what they said matters most. Sales strategy adjusts deal by deal in response. At the pattern level — across many calls — decision criteria patterns inform how marketing positions, how product prioritises, and how leadership messages. This is the strategic signal most teams aren't yet extracting.",
        },
        {
          html: stepCard('search', 'red', 'Extraction 4 — Competitor mentions',
            "Every competitor name mentioned — what the customer said about each, what they're evaluating, what they're afraid of. Aggregated across the team — this is the competitive intelligence layer the field has always promised and rarely delivered."),
          narration:
            "Extraction four. Competitor mentions. Every competitor name mentioned in the call — what the customer said about each, what they're actively evaluating, what they're afraid of with each one. Aggregated across the entire team. This is the competitive intelligence layer that field sales has always promised to deliver to product marketing and rarely actually delivered, because manual capture was unreliable. AI capture is reliable. The aggregated view — which competitors are showing up most, in which segments, with what positioning — is some of the highest-strategic-value data the revenue function can give to product, product marketing, and executive leadership. Configure this extraction. Aggregate it weekly. Share the rollup. It changes how the company competes.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The coaching feedback loop',
      iconKey: 'users',
      eyebrow: 'Lesson 2 · The loop',
      bodyHtml: `<p>Three stages. Together they convert call AI from a productivity tool into a team-development engine — which is where the long-term return actually compounds.</p>`,
      narrationLead:
        "Three stages in the coaching feedback loop that converts call AI from a productivity tool — which is what most teams settle for — into a team-development engine — which is where the long-term return actually compounds. The compounding return is the difference between a fifteen percent improvement and a sixty percent improvement on team-level pipeline production. Set up all three stages.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Stage 1 — Pattern detection across calls',
            "AI surfaces patterns — which reps consistently miss specific objections, which reps strong-handle them, which discovery moves correlate with deals closed. The data isn't anecdotal; it's the team's actual rhythm."),
          narration:
            "Stage one. Pattern detection across calls at the team level. The AI surfaces patterns that wouldn't show up in individual reviews — which reps consistently miss specific common objections, which reps handle them strongly, which discovery questions correlate with deals that closed versus deals that didn't, which call openings produce better second-call attendance. The data isn't anecdotal observation from a manager who heard a handful of calls — it's the team's actual rhythm aggregated across the full call volume. Pattern detection is where sales coaching becomes evidence-based instead of opinion-based.",
        },
        {
          html: stepCard('bookOpen', 'amber', 'Stage 2 — Sample review with the individual rep',
            "Weekly twenty-minute session, manager and rep, reviewing two specific call segments — one that worked, one that struggled. AI prepared the segments and the comparison. The conversation is about technique, not about whether the rep is performing."),
          narration:
            "Stage two. Sample review with the individual rep. A weekly twenty-minute session between the manager and the rep, reviewing two specific call segments — one that worked well and one that struggled. The AI has prepared the segments in advance and surfaced what made the difference. The conversation between manager and rep is about technique — what was said, what could have been said, what the customer signal suggested — not about whether the rep is performing at quota. Twenty minutes weekly, sustained for a quarter, measurably moves rep performance. Without the sample review, the AI insights stay as dashboards nobody acts on.",
        },
        {
          html: stepCard('calendar', 'green', 'Stage 3 — Team-level coaching at the weekly forum',
            "Once a week the team gathers — fifteen minutes. One pattern from the AI rollup. One technique that's working, taught by the rep who's doing it. Coaching at the team level compounds across reps in a way individual coaching alone can't."),
          narration:
            "Stage three. Team-level coaching at the weekly forum. Once a week the team gathers for fifteen minutes — usually as part of an existing pipeline meeting, not as a new meeting. One pattern from the AI rollup is highlighted — for example, this quarter, the top objection is pricing concerns about year-two renewal economics. One technique that's working is taught by the rep who's actively doing it well — for example, here's how I handle that objection, and here's a recent call where it landed. Coaching at the team level compounds across reps in a way that individual one-on-one coaching alone cannot match. The team-level forum is also where junior reps see senior reps' technique modeled — which accelerates ramp time for new hires more than any structured onboarding program.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The compounding number to watch',
        "Track ramp time for new reps before and after the coaching loop. Teams that run all three stages consistently report ramp time dropping 30–50%. That's a structural cost advantage that pays for the entire AI call investment many times over."),
      calloutNarration:
        "The compounding number to watch closely. Track ramp time for new reps before and after you put the coaching loop in place. Teams that run all three stages of the coaching loop consistently — pattern detection, sample review, team forum — report new-rep ramp time dropping by thirty to fifty percent. From the typical seven to nine months for full productivity down to four to five months. That ramp-time improvement is a structural cost advantage that pays for the entire AI call investment many times over, and it accumulates with every new hire. Most teams running call AI without the coaching loop don't see this benefit at all because the loop is where the team-level learning happens.",
    },
    // SLIDE 4
    {
      title: 'The privacy posture customers now expect',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · The posture',
      bodyHtml: `<p>Customers now ask explicit questions about call recording and AI processing. The teams with a clear answer win — the teams with a vague answer lose deals to the teams with a clear answer.</p>`,
      narrationLead:
        "Customers now ask explicit questions about call recording and AI processing in B2B conversations. Procurement, security, and increasingly the line-of-business sponsor themselves ask. The teams with a clear, written answer win — the teams with a vague answer lose deals to the teams with a clear answer. The clear answer has four components.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Component 1 — Explicit consent at the start of every call',
            "Spoken consent — 'we record and use AI to summarise for our internal notes, you can ask us to stop at any time.' Logged in CRM. Customers expect this now; saying it builds trust rather than triggering distrust."),
          narration:
            "Component one. Explicit spoken consent at the start of every call. Not a quiet line in a terms document — spoken consent from the rep, in the rep's voice. A standard phrasing — we record and use AI to summarise the call for our internal notes, you can ask us to stop at any time. Spoken once at the start, logged in CRM as confirmed. Customers expect this now. Saying it transparently and matter-of-factly builds trust rather than triggering distrust. The teams that skip it because consent feels awkward are the teams whose customers screenshot the awkwardness later when it surfaces in procurement. Build the consent script. Train the team to say it naturally. It is the cheapest brand investment available.",
        },
        {
          html: stepCard('shield', 'green', 'Component 2 — Documented retention limits',
            "Transcripts retained 30, 60, or 90 days, then deleted. Customer can request earlier deletion. Written, published, sent to customers who ask. Customers accept reasonable retention; they reject indefinite retention."),
          narration:
            "Component two. Documented retention limits for transcripts. Typically thirty, sixty, or ninety days, then automatic deletion. Customers can request earlier deletion on request. Written, published on your website's trust page, sent to customers who ask. Customers across industries accept reasonable retention windows — the data has to live somewhere for the call notes to be useful — and they reject indefinite retention. The teams with indefinite retention discover this in procurement reviews when their deals get held up. Set a documented retention window now. Make it shorter rather than longer.",
        },
        {
          html: stepCard('shield', 'green', 'Component 3 — Clear stored-vs-not boundary',
            "What's stored — transcripts, extracted next steps and signals. What's not — full audio, biometric voice data, anything sent to public LLM providers without enterprise terms. Published on your trust page."),
          narration:
            "Component three. A clear, published boundary between what's stored and what's not. What's stored — the text transcript, the extracted next steps, the objections, decision criteria, competitor mentions. What's not stored — typically the full audio recording after transcription, biometric voice data, anything sent to public large language model providers without enterprise terms in place. The boundary is written on your trust page and shared with customers when asked. Customers who care about this — and increasingly they all do — want the boundary explicit, not implied. Make it explicit.",
        },
        {
          html: stepCard('shield', 'green', 'Component 4 — One named contact for data requests',
            "A single email — typically privacy@ — that handles call data requests within a stated SLA, typically forty-eight hours. Most requests never come; existence of the contact is itself a trust signal that closes deals."),
          narration:
            "Component four. One named contact and one email — typically privacy at your domain — that handles all customer requests related to call data within a stated service level agreement, typically forty-eight hours. The honest reality — most requests never come. The existence of the named contact and the published SLA is itself a trust signal that helps close deals with security-conscious buyers. Set up the inbox, route it to a real owner, publish it. Cost is low. Signal value is high. Several deals per year close partly because this exists when the customer's procurement team checked.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 7 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter eight — the capstone.</p>`,
      narrationLead:
        "Three anchors before chapter eight — the capstone, your 2-quarter sales AI portfolio.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Four extractions, every call',
            "Next steps with owners and dates · objections raised · decision criteria revealed · competitor mentions. Configure all four. Aggregate across the team. Aggregation is where the strategic value lives."),
          narration:
            "One. Four extractions on every customer-facing call. Next steps with owners and dates — drives follow-through. Objections raised — drives both tactical response and strategic aggregation. Decision criteria revealed — drives positioning and messaging. Competitor mentions — drives competitive intelligence to product and product marketing. Configure all four extractions. Aggregate them weekly across the team. The individual-call value is tactical; the aggregated value is strategic, and the aggregated value is where the executive return lives.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three-stage coaching loop',
            "Pattern detection · weekly sample review per rep · team-level forum. Compounds team performance and drops new-rep ramp time 30–50%. Most teams skip the loop and leave most of the AI call return on the table."),
          narration:
            "Two. Three-stage coaching feedback loop. Pattern detection across calls — sales coaching becomes evidence-based. Weekly sample review per rep — twenty minutes, manager and rep, reviewing two specific segments. Team-level forum once a week, fifteen minutes, embedded in existing pipeline meetings — one pattern, one technique, both from the team's actual data. Compounds team performance and drops new-rep ramp time by thirty to fifty percent across rolling hires. Most teams running call AI skip the loop and leave most of the available return on the table. Build the loop.",
        },
        {
          html: stepCard('check', 'green', 'Three — Four-component privacy posture',
            "Spoken consent · documented retention · stored-vs-not boundary · named contact for requests. Customers now ask. Teams with a clear answer win deals; teams with a vague answer lose them."),
          narration:
            "Three. Four-component privacy posture customers now actively expect. Spoken consent at the start of every call, logged in CRM. Documented retention limits, published. Clear stored-versus-not-stored boundary, published. One named privacy contact with a published service level agreement for data requests. Customers now ask explicit questions about all four in procurement reviews. The teams with a clear written answer to each win deals — the teams with vague answers lose deals to the teams with clear answers. The cost of having the posture is low; the cost of not having it is asymmetric.",
        },
      ],
      narrationTrail:
        "Chapter eight — the capstone. Your 2-quarter sales AI portfolio on one page, the KPIs that prove or disprove ROI, and three conversations for week one. See you there.",
    },
  ],
}
