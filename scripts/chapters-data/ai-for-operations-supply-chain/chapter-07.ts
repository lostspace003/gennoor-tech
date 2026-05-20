import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiOpsChapter07: Chapter = {
  courseId: 'ai-for-operations-supply-chain',
  chapterId: 'chapter-07',
  chapterNumber: 7,
  chapterSlug: 'chapter-07-supplier-risk',
  title: 'Supplier risk and end-to-end visibility',
  subtitle: 'Five signal sources for supplier risk · the dashboard discipline that produces decisions · the four-phase response cadence.',
  slides: [
    // SLIDE 1
    {
      title: 'Supplier risk and end-to-end visibility',
      iconKey: 'shield',
      eyebrow: 'Chapter 7 · Opening',
      bodyHtml: `<p class="lead">Supply chain fragility has compounded across 2022 through 2026. AI supplier risk monitoring is now one of the highest-return operations AI investments available — if the deployment focuses on decisions rather than dashboard activity. Five signal sources. One discipline. One response cadence.</p>`,
      narrationLead:
        "Welcome to chapter seven. Supplier risk and end-to-end visibility. Supply chain fragility has compounded across the last four years — pandemic disruption, geopolitical events, climate impacts, financial stress at second-tier suppliers, regulator actions. AI supplier risk monitoring is now one of the highest-return operations AI investments available — if the deployment focuses on producing decisions rather than producing dashboard activity. Five signal sources to ingest. One discipline that produces decisions instead of noise. And one four-phase response cadence that converts signals into protected supply chain outcomes.",
    },
    // SLIDE 2
    {
      title: 'Five signal sources for supplier risk',
      iconKey: 'search',
      eyebrow: 'Lesson 1 · The signals',
      bodyHtml: `<p>Five signal sources to ingest continuously. Each catches different risk types. Together they produce the early warning that lets operations get ahead of disruption rather than react after.</p>`,
      narrationLead:
        "Five signal sources for supplier risk monitoring. Each source catches different risk types — financial, operational, regulatory, geopolitical, climate. Ingest all five together. Together they produce the early warning window that lets your operations team get ahead of disruption rather than react after the disruption hits your inbound deliveries. The five sources are now widely available as data services; the question is which to subscribe to and how to combine them.",
      steps: [
        {
          html: stepCard('search', 'blue', 'Signal 1 — News and press',
            "AI monitors news sources for supplier-related events — leadership changes, lawsuits, plant closures, recalls, regulator actions, M&A activity. Catches operational risks within hours of public disclosure. Cheapest source to deploy; broadest coverage."),
          narration:
            "Signal one. News and press monitoring. AI continuously monitors news sources globally for events related to your supplier list — leadership departures or changes at supplier executive level, lawsuits filed against the supplier, plant closures or major incidents, product recalls in the supplier's category, regulator actions against the supplier, mergers and acquisitions affecting ownership or strategy. Catches operational risks within hours of public disclosure. This is the cheapest source to deploy and provides the broadest risk coverage. Most supplier risk AI tools include news monitoring as the foundational layer; verify your tool's news source breadth and language coverage match your supplier geography.",
        },
        {
          html: stepCard('search', 'blue', 'Signal 2 — Financial signals',
            "Public-company financials (filings, ratings actions, equity moves). Private-company signals (court records, credit data, payment patterns). Financial stress predicts supply disruption 3–9 months in advance. Higher cost source; high ROI for strategic suppliers."),
          narration:
            "Signal two. Financial signals. For public-company suppliers — SEC and equivalent filings, credit ratings actions from major agencies, equity price and volume signals, debt covenant breaches if disclosed. For private-company suppliers — court records of bankruptcy or insolvency filings, commercial credit data services, payment pattern data, employee headcount trends from professional networks. Financial stress at a supplier reliably predicts supply disruption three to nine months in advance — earlier than any operational signal does. This is a higher-cost signal source than news monitoring — typically tens of thousands of dollars per year for the data feeds — but the ROI on strategic suppliers is high because the lead time is long enough to qualify alternative suppliers before disruption hits.",
        },
        {
          html: stepCard('search', 'blue', 'Signal 3 — Regulatory and trade signals',
            "Customs data, sanctions lists, export-control changes, trade actions, regulator enforcement. Particularly important after 2024–2025 escalations. AI ingests rapidly-shifting regulatory landscape and maps to your supplier list."),
          narration:
            "Signal three. Regulatory and trade signals. Customs declaration data and tariff classifications affecting your supplier's products. Sanctions lists across multiple jurisdictions — US OFAC, UK, EU, UN. Export-control changes affecting categories your supplier ships in. Trade actions like Section 301 tariffs in the US or retaliatory measures from other governments. Regulator enforcement actions against the supplier in their home country. Particularly important after the 2024 and 2025 escalations in trade and sanctions activity globally. AI ingests the rapidly-shifting regulatory landscape across jurisdictions and maps changes to your specific supplier list. Without AI, mapping regulatory changes to your supplier list manually is impractical at scale; with AI, it becomes routine monitoring.",
        },
        {
          html: stepCard('search', 'blue', 'Signal 4 — Climate and geographic risk',
            "Weather forecasts and climate signals for supplier regions. Acute events (hurricanes, floods, fires) and chronic risks (drought, sea level, heat stress). Maps to specific supplier facilities. Increasingly material across all operations regions."),
          narration:
            "Signal four. Climate and geographic risk. Weather forecasts and climate signals for the regions your suppliers operate in. Acute events — hurricanes, floods, wildfires, severe storms — that can disrupt supplier operations for days or weeks. Chronic risks — drought affecting water-intensive supplier operations, sea level rise affecting coastal facilities, heat stress affecting outdoor work or unconditioned facilities. AI maps the signals to specific supplier facility addresses rather than just regions, which catches risks that regional analysis would miss. Increasingly material across all operations geographies as climate volatility increases. The signal source is widely available — weather and climate APIs — and worth integrating even at modest cost.",
        },
        {
          html: stepCard('search', 'blue', 'Signal 5 — Tier-2 supplier visibility',
            "Most disruptions today come from second-tier suppliers your tier-1 supplier depends on. AI surfaces the tier-2 risks via supply chain mapping data services. Hardest signal source to deploy; highest ROI when done well — most supply disruptions hide here."),
          narration:
            "Signal five. Tier-two supplier visibility. The honest reality of supply chain risk in 2026 — most actual disruptions you'll experience come from second-tier suppliers your direct tier-one suppliers depend on. Your tier-one says they're fine because their tier-two just went down. By the time you know, you've lost weeks. AI supply chain mapping services attempt to surface tier-two and tier-three exposure based on data the suppliers themselves declared, public corporate filings about supplier relationships, and pattern detection across data sources. This is the hardest signal source to deploy because the data is incomplete and varies by supplier transparency. It is also the highest-ROI signal source when done well because most supply disruptions hide in tier-two exposure. Worth investing in even if coverage is partial.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'The dashboard discipline',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · The discipline',
      bodyHtml: `<p>Three discipline rules. Without them, supplier risk dashboards become noise that operations stops reading. With them, dashboards produce decisions.</p>`,
      narrationLead:
        "Three discipline rules for supplier risk dashboards. Without them, the dashboards become noise — too many signals, too much information, no clear action — and the operations team stops reading them within a quarter. With them, dashboards produce decisions and actions because they're designed around what the team needs to do, not around what the AI can detect. The discipline rules are simple to state and hard to hold; vendor enthusiasm always pushes toward more dashboard, more signals, more visualisation.",
      steps: [
        {
          html: stepCard('shield', 'green', 'Rule 1 — Tier suppliers; concentrate attention on strategic',
            "Categorise suppliers into strategic (top 5–10%), important (next 15–25%), routine (the rest). Monitoring depth differs by tier. Strategic suppliers get all five signal sources; routine get news monitoring only. The tiering is the cost-and-attention discipline."),
          narration:
            "Rule one. Tier suppliers and concentrate attention on strategic. Not all suppliers warrant the same monitoring depth. Tier the suppliers explicitly. Strategic — top five to ten percent by spend, by criticality, or by switching cost. Important — next fifteen to twenty-five percent. Routine — the long tail. Monitoring depth differs by tier. Strategic suppliers get all five signal sources, deep tier-two mapping, dedicated relationship management. Important suppliers get the cheaper signals — news, regulatory, climate — plus periodic financial review. Routine suppliers get news monitoring only with low-cost coverage. The tiering is the cost-and-attention discipline that makes the program affordable and effective. Without it, either the program costs too much for the value or it spreads too thin and catches nothing reliably.",
        },
        {
          html: stepCard('shield', 'green', 'Rule 2 — Surface decisions, not signals',
            "AI doesn\'t alert when a signal fires — it alerts when a decision is needed. The signal arrives, AI evaluates against your specific exposure, produces — \"Recommend qualifying alternative supplier for SKUs X, Y, Z in next 90 days because supplier Z\'s financial signal is deteriorating.\" Decisions, not raw signals."),
          narration:
            "Rule two. Surface decisions, not raw signals. The vendor dashboard tendency is to surface every signal that fires — every news article, every credit action, every tariff change — as a separate alert. This is noise. The discipline is — AI doesn't alert when a signal fires; AI alerts when a decision is needed. The signal arrives, AI evaluates it against your specific supplier exposure and the implications for your operations, and produces a recommended decision. For example — recommend qualifying alternative supplier for SKUs X, Y, Z in the next ninety days because supplier Z's financial signal is deteriorating and they currently represent the only source for these three SKUs. The team reviews and decides. Decisions, not raw signals. Hold this rule against vendor pressure to show off the volume of signals their tool ingests.",
        },
        {
          html: stepCard('shield', 'green', 'Rule 3 — Time-window context on every alert',
            "Every alert carries an estimated time-to-impact window — disruption may begin in 2 weeks, 3 months, 9 months. Time-window context lets the team prioritise. Without it, urgent and non-urgent alerts compete for attention and the team handles them in arrival order, missing the urgent ones."),
          narration:
            "Rule three. Time-window context on every alert. Every supplier risk alert carries an estimated time-to-impact window — the disruption may begin in two weeks, three months, nine months from the signal. The time-window context lets the team prioritise alerts appropriately. Two-week alerts go to the top of the queue immediately. Nine-month alerts go onto the quarterly strategic supplier review agenda. Without time-window context, all alerts compete for attention equally — and the team handles them in arrival order, often missing the two-week urgent ones because they arrived buried in less urgent signals. The time-window inference is one of the higher-judgment things AI does in this domain; verify the AI's time-window estimates against actual outcomes during the first quarter to calibrate.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The four-phase response cadence',
      iconKey: 'flag',
      eyebrow: 'Lesson 3 · The response',
      bodyHtml: `<p>Four phases from signal to response. Each phase has an owner, a clear action, and a clear next-step trigger. The cadence converts AI signals into operational decisions and protected supply chain outcomes.</p>`,
      narrationLead:
        "Four phases in the response cadence from AI signal to operational outcome. Each phase has an owner, a clear action, and a clear trigger to the next phase. The cadence is what converts AI supplier risk signals into actual operational decisions and protected supply chain outcomes. Without a defined response cadence, alerts fire and decisions don't get made consistently because there's no agreed process for who owns what when a signal arrives. Define the cadence. Walk through the four phases.",
      steps: [
        {
          html: stepCard('flag', 'blue', 'Phase 1 — Signal arrives, AI evaluates',
            "Signal lands. AI assesses against your supplier portfolio and your exposure. Classifies severity (yellow/orange/red) and produces a recommended decision. Lands in the inbox of the named supplier risk owner — typically procurement or supply chain leadership."),
          narration:
            "Phase one. Signal arrives and AI evaluates. A signal lands from one of the five sources — for example, a financial-stress signal on a strategic supplier. AI assesses the signal against your specific supplier portfolio — what does this supplier do for us, what's our concentration risk with them, what's the lead time to qualify alternatives, what's the cost of disruption. Classifies severity into yellow, orange, or red. Produces a recommended decision with rationale. Lands in the inbox of the named supplier risk owner — typically your chief procurement officer or supply chain director. Phase one is mostly automated; the human enters at phase two.",
        },
        {
          html: stepCard('flag', 'amber', 'Phase 2 — Risk owner reviews, decides response shape',
            "Within 48 hours of an orange or red signal, the risk owner reviews the recommendation. Decides response shape — qualify alternative supplier, increase safety stock, accelerate a relationship conversation, escalate to procurement committee, monitor for now. Decision captured with rationale."),
          narration:
            "Phase two. Risk owner reviews and decides the response shape. Within forty-eight hours of an orange or red signal — yellow signals can wait for the weekly review — the named risk owner reviews the AI's recommendation against their broader operational context the AI doesn't have. Decides the response shape. Qualify an alternative supplier in the next ninety days. Increase safety stock on affected SKUs in the next two weeks. Accelerate a strategic relationship conversation with the supplier in the next two weeks. Escalate to the procurement committee for a strategic decision. Monitor for now, no action yet. Decision captured with rationale in the system. The forty-eight hour SLA on orange-and-above is the discipline that prevents alerts from sitting too long.",
        },
        {
          html: stepCard('flag', 'green', 'Phase 3 — Cross-functional execution',
            "Decision shape determines who executes. Qualify alternative — procurement leads, engineering supports. Increase safety stock — supply chain planning. Accelerate relationship conversation — risk owner or executive sponsor. Each has a target completion date set in phase 2."),
          narration:
            "Phase three. Cross-functional execution. The decision shape determines who executes and on what timeline. Qualify an alternative supplier — procurement leads with engineering supporting on technical qualification, target sixty to ninety days. Increase safety stock — supply chain planning executes via the inventory intelligence workflow from chapter six, target one to two weeks. Accelerate strategic relationship conversation — the risk owner or executive sponsor handles it directly, target one to two weeks. Each execution path has a target completion date set in phase two so phase three has an explicit timeline rather than open-ended action. Cross-functional execution is where most supplier risk responses lose momentum; the explicit timeline and named owner is the discipline that prevents drift.",
        },
        {
          html: stepCard('flag', 'green', 'Phase 4 — Close-out and pattern review',
            "Response completes — outcome documented. Quarterly, the operations leadership reviews the response log — what signals fired, what was done, what was prevented, what was missed. Pattern review surfaces signal-source quality and operational improvements."),
          narration:
            "Phase four. Close-out and pattern review. Each response completes — alternative supplier qualified, safety stock adjusted, relationship conversation held — and the outcome is documented. What happened to the original risk in the following quarter — did disruption hit, was it avoided, was it mitigated. Quarterly, operations leadership reviews the full response log. What signals fired across the quarter. What responses were taken. What disruptions were prevented or mitigated based on the AI early warning. What disruptions occurred without prior signal — meaning the system missed something. Pattern review surfaces signal-source quality issues — for example, financial signals are catching things news isn't, or tier-two mapping is missing key relationships — and operational improvements for the next quarter. Close-out converts the program from a stream of activities into a learning system that compounds.",
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
        "Three anchors before chapter eight — the capstone, your 2-quarter operations AI roadmap.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Five signal sources',
            "News · financial (incl. private-company) · regulatory and trade · climate and geographic · tier-2 supplier visibility. All five together produce the early-warning window. Tier-2 is hardest and highest ROI — most disruptions hide there."),
          narration:
            "One. Five signal sources to ingest continuously. News and press for operational events within hours. Financial signals — public and private — for stress predicting disruption three to nine months ahead. Regulatory and trade signals for sanctions, customs, and enforcement. Climate and geographic for acute and chronic environmental risk. Tier-two supplier visibility for the disruptions that hide in your suppliers' suppliers. All five together produce the early warning window. Tier-two is hardest to deploy and highest ROI — most disruptions in 2026 hide there.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three dashboard discipline rules',
            "Tier suppliers (strategic / important / routine) · surface decisions not raw signals · time-window context on every alert. Hold against vendor pressure to show off signal volume. The discipline is what makes dashboards produce decisions."),
          narration:
            "Two. Three dashboard discipline rules. Tier suppliers explicitly into strategic, important, and routine with different monitoring depth per tier — the cost-and-attention discipline. Surface decisions not raw signals — AI alerts when a decision is needed and produces a recommendation, not every time a signal fires. Time-window context on every alert — two weeks, three months, nine months — so the team prioritises appropriately rather than handling alerts in arrival order. Hold all three rules against vendor pressure to maximise dashboard signal volume. The discipline is what makes the dashboard produce decisions instead of noise.",
        },
        {
          html: stepCard('check', 'green', 'Three — Four-phase response cadence',
            "Signal arrives + AI evaluates · risk owner decides within 48 hours · cross-functional execution with named owners and dates · close-out and quarterly pattern review. The cadence converts AI signals into protected supply chain outcomes."),
          narration:
            "Three. Four-phase response cadence. Phase one — signal arrives, AI evaluates against your portfolio, classifies severity, produces recommendation. Phase two — named risk owner reviews orange-or-above within forty-eight hours, decides response shape with rationale. Phase three — cross-functional execution with named owners and target dates per response type. Phase four — close-out documents outcome, quarterly pattern review surfaces signal-source quality and operational improvements. The cadence is what converts AI signals into protected supply chain outcomes. Without a defined cadence, alerts fire and decisions don't get made consistently.",
        },
      ],
      narrationTrail:
        "Chapter eight — the capstone. Your 2-quarter ops AI roadmap, the operational KPIs that prove value (not AI metrics), and four conversations to schedule Monday. See you there.",
    },
  ],
}
