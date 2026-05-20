import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiOpsChapter08: Chapter = {
  courseId: 'ai-for-operations-supply-chain',
  chapterId: 'chapter-08',
  chapterNumber: 8,
  chapterSlug: 'chapter-08-capstone',
  title: 'Capstone — Your 2-quarter operations AI roadmap',
  subtitle: 'Seven chapters down. Two plays, two quarters. Operational KPIs, not AI metrics. Four conversations Monday.',
  slides: [
    // SLIDE 1
    {
      title: 'Capstone — Your 2-quarter operations AI roadmap',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Opening',
      bodyHtml: `<p class="lead">In seven chapters, we built the operating view of AI in operations. Now — one roadmap. Two plays. Two quarters. Operational KPIs the COO cares about — not AI metrics nobody on the operations floor recognises.</p>`,
      narrationLead:
        "Welcome to chapter eight. The capstone. In the previous seven chapters, we built the operating view of AI in operations and supply chain. The fit map and the data-stable filter. Two-layer demand forecasting. Procurement document AI with the three-tier human-in-loop. Logistics as AI-amplifying-OR. Predictive maintenance with sensor-plus-narrative. Inventory intelligence solving stock-outs and overstock together. Supplier risk with the five signal sources and four-phase response cadence. Now we collapse it. One roadmap. Two plays sequenced over two quarters. Operational KPIs the chief operating officer cares about — not AI metrics nobody on the operations floor recognises. Specific enough to start Monday; concrete enough to defend at the next operations leadership meeting.",
    },
    // SLIDE 2
    {
      title: 'Two plays, two quarters — sequenced for compounding',
      iconKey: 'flag',
      eyebrow: 'Lesson 1 · The roadmap',
      bodyHtml: `<p>Two plays. Not six. Operations attention is the constraint, not technology budget. Sequence the plays so each one funds the next. Hold the discipline.</p>`,
      narrationLead:
        "Two plays sequenced over two quarters. Not six plays attempted simultaneously. Operations attention is the constraint in AI deployments — not technology budget, not vendor selection. Sequence the plays so each one produces a measurable win that funds the next play. Hold the discipline against pressure to deploy more in parallel. Two well-executed plays beat six half-attempted plays by a wide margin in operations AI specifically. Here are the two plays in the recommended sequence.",
      steps: [
        {
          html: stepCard('calendar', 'blue', 'Quarter 1 — Play A: Procurement document AI',
            "Highest-probability win. Highest-volume document type — invoices first. 90%+ automation rate is achievable within the quarter. Audit-ready posture from day one. The win funds the operations sponsor\'s confidence in the broader program."),
          narration:
            "Quarter one. Play A — procurement document AI from chapter three. Highest-probability win in the operations AI portfolio. Highest-volume document type first — invoices, which gives the fastest payback. Ninety percent automation rate on routine invoices is achievable within the quarter when the three-tier human-in-loop is configured and tuned. Audit-ready posture configured from day one with confidence scores logged, source documents linked, model controls documented, error tracking enabled. The win — measurable procurement team capacity redirected from manual document processing to vendor strategy — funds the operations sponsor's confidence in the broader AI program. This is the foundation play that earns the right to do harder plays later.",
        },
        {
          html: stepCard('calendar', 'amber', 'Quarter 2 — Play B: Demand forecasting (chapter 2 + chapter 6)',
            "Higher complexity, higher impact. Two-layer model (ML + LLM signal) with explainable rationale, integrated into the existing planning tool. Differentiated safety stock by velocity tier follows. Working capital reduction lands by end of Q2."),
          narration:
            "Quarter two. Play B — demand forecasting from chapter two, combined with the dynamic safety stock layer from chapter six. Higher complexity than quarter one because it requires the four-check data-readiness gate to pass and the operational handoff design with the planning team. Higher impact when it lands. Two-layer model — classical ML on structured history plus large language model signal extraction from unstructured sources — produces explainable rationale that planners trust. Integrated into the existing planning tool — SAP IBP, Anaplan, Oracle, whichever — to land adoption. Differentiated safety stock by SKU velocity tier follows immediately after the forecast quality improves. Working capital reduction of eight to fifteen percent lands by end of quarter two. This is the play that delivers the headline operations savings.",
        },
        {
          html: stepCard('rocket', 'green', 'What\'s held out — and why',
            "Logistics optimisation, predictive maintenance, supplier risk monitoring. All good plays. None fits in Q1 or Q2 without thinning attention or running into foundation gaps. Sequence them in Q3 through Q5 after the foundation lands. The discipline is the multiplier."),
          narration:
            "What's deliberately held out of the first two quarters and why. Logistics optimisation — needs the OR baseline or rules-based heuristic working well first, often a foundation gap. Predictive maintenance — requires sensor coverage investment and the narrative layer development, both meaningful budget. Supplier risk monitoring — requires the supplier tiering exercise and the four-phase response cadence to be operationally agreed before deployment. All three are good plays. None fits cleanly in the first two quarters without thinning operational attention or running into foundation gaps. Sequence them in quarters three through five after the foundation lands and the procurement-and-forecasting wins fund the operational confidence to take on harder plays. The sequencing discipline is the multiplier; pressure to deploy more in parallel always comes — hold the discipline.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Why this sequence specifically',
        "Procurement document AI builds operational confidence in AI quickly with low brand risk. Demand forecasting compounds the procurement win with bigger savings. Together they earn the right to tackle the harder logistics, PdM, and supplier risk plays in Q3–Q5. Foundation, then compounding."),
      calloutNarration:
        "Why this sequence specifically. Procurement document AI in quarter one builds operational confidence in the AI program quickly with low brand risk — the output is internal, the audit posture protects against regulatory exposure, the team experience is positive. Demand forecasting in quarter two compounds the procurement quarter one win with bigger top-line savings — working capital reduction visible to finance. Together they earn the right to tackle the harder logistics, predictive maintenance, and supplier risk plays in quarters three through five. Foundation, then compounding. The opposite sequence — starting with logistics or PdM because the demos are more impressive — often produces pilots that don't ship and damages organisational confidence in operations AI for years. Sequence matters more than enthusiasm.",
    },
    // SLIDE 3
    {
      title: 'Operational KPIs — not AI metrics',
      iconKey: 'target',
      eyebrow: 'Lesson 2 · The KPIs',
      bodyHtml: `<p>Four operational numbers. Not four AI-system metrics. The COO cares about operational outcomes; nobody on the operations floor cares about model accuracy in isolation. Track the operational numbers and the AI value is visible to the people who decide funding.</p>`,
      narrationLead:
        "Four operational KPIs — not four AI-system metrics. This distinction matters. The chief operating officer and the chief financial officer care about operational outcomes — capacity recovered, working capital released, on-time delivery, supplier risk reduced. Nobody on the operations floor cares about model accuracy or precision-recall scores in isolation. Track operational numbers and AI value is visible to the people who decide whether to continue funding the program. Track AI metrics and the program becomes a story leadership stops believing.",
      steps: [
        {
          html: stepCard('target', 'blue', 'Number 1 — Procurement team capacity recovered',
            "Hours per week the procurement team spent on document processing pre-rollout vs post-rollout. Show the capacity redirected to vendor strategy and negotiation. Translates directly to operational value — not AI metric, operational metric."),
          narration:
            "Number one. Procurement team capacity recovered. Hours per week the procurement team collectively spent on document processing pre-rollout, baselined cleanly during the first quarter setup. Hours per week post-rollout once the three-tier human-in-loop is tuned. Show the difference. Show what the recovered capacity is now spent on — vendor strategy, contract negotiation, alternative supplier qualification. The capacity recovered translates directly to operational value the chief procurement officer can describe to peer executives without needing to explain AI. This is not an AI metric; it's an operational metric the AI deployment produced. Lead with this.",
        },
        {
          html: stepCard('target', 'blue', 'Number 2 — Forecast accuracy → service level',
            "Forecast MAPE (mean absolute percentage error) is an internal model metric. The operational metric is service level — % of orders fulfilled on time from stock — which improves when forecast improves. Track service level lift; don\'t lead with MAPE."),
          narration:
            "Number two. Forecast accuracy converted into service level. Forecast mean absolute percentage error — MAPE — is an internal model metric. Useful for the team running the AI, irrelevant for the chief operating officer reviewing the quarterly results. The operational metric that comes from improved forecast is service level — percentage of customer orders fulfilled on time from available stock. Better forecast equals more confident inventory positions equals fewer stock-outs equals higher service level. Track the service level lift over the baseline. Don't lead with MAPE in the quarterly review. MAPE goes in the appendix for the operations director; service level goes in the headline for the COO.",
        },
        {
          html: stepCard('target', 'amber', 'Number 3 — Working capital tied up in inventory',
            "Reported on the balance sheet. The CFO cares about this number. Reduce it 8–15% across the portfolio via better forecast plus dynamic safety stock and the operations AI program has visibly funded itself many times over."),
          narration:
            "Number three. Working capital tied up in inventory. This number is reported on the balance sheet. The chief financial officer cares about this number — it directly affects cash position and the cost-of-capital calculation. Reduce it eight to fifteen percent across the portfolio via the combined forecast improvement plus differentiated safety stock from chapters two and six and the operations AI program has visibly funded itself many times over within the first year. The CFO ratifies further investment because they see the working capital reduction directly. Other operations AI metrics are nice; working capital reduction on the balance sheet is the headline that defends the program through budget cycles.",
        },
        {
          html: stepCard('target', 'green', 'Number 4 — Operational team satisfaction with the AI tools',
            "The durability number. Quarterly survey of procurement and planning teams — do you want to keep using these tools? Below 75% positive — the program won\'t survive past the pilot. The KPI nobody puts on the dashboard and the one that decides whether the program survives turnover."),
          narration:
            "Number four. Operational team satisfaction with the AI tools. The durability number — the one that decides whether the program survives team turnover and changes in operational pressure. Quarterly survey of the procurement team and the planning team — five-minute survey, three questions. Do you want to keep using these tools. What's working. What's not. Below seventy-five percent positive response — the program will not survive past the initial pilot because teams will silently disengage when the AI champions move elsewhere or get promoted. The KPI nobody puts on the dashboard and the one that decides whether the program survives turnover. Survey quarterly. Act on the feedback visibly. Otherwise the program becomes a story in old slide decks rather than embedded operational practice.",
        },
      ],
      calloutHtml: calloutBlock('calendar', 'tip', 'Two cadences',
        "Monthly — operations leadership reviews the four KPIs with rev ops. Quarterly — executive sponsor (COO/CFO) reviews against baseline with explicit invest/sustain/exit decision per play. The cadence is the operating contract."),
      calloutNarration:
        "Two cadences for the KPI review. Monthly — operations leadership reviews the four KPIs with rev ops and any active AI program leads. Catches drift before it becomes a quarterly disappointment. Quarterly — the executive sponsor — chief operating officer or chief financial officer, depending on which side of the business funds the program — reviews the KPIs against pre-deployment baseline with an explicit decision per play. Invest more, sustain at current investment, or exit the play. The quarterly explicit decision prevents the pattern where AI programs become permanent fixtures regardless of whether they continue delivering. Both cadences are the operating contract that gives the program credibility. Schedule both before launch.",
    },
    // SLIDE 4
    {
      title: 'Four conversations Monday',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · Week one',
      bodyHtml: `<p>Four conversations in the first week. Each one unlocks something the program needs. None can be combined. Schedule them Monday morning.</p>`,
      narrationLead:
        "Four conversations to schedule in the first week of the program. Each unlocks something specific the program needs in order to actually ship. None can be combined into one meeting. Schedule them Monday morning before any other planning work. The first-week discipline is what determines whether the program lands or stays in the deck across the next two quarters. Here are the four.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Conversation 1 — COO or CFO',
            "Walks through the 2-quarter roadmap one-pager. Confirms scope, budget, and the quarterly review cadence in the calendar. Names the operations AI lead. This is the conversation that gives the program oxygen."),
          narration:
            "Conversation one. The executive sponsor — chief operating officer if the program is operations-led, chief financial officer if it's finance-led with operations as the delivery partner. Walk through the two-quarter roadmap one-pager from slide two. Confirm scope — procurement document AI in quarter one, demand forecasting and dynamic safety stock in quarter two. Confirm budget. Agree on the operations AI lead — the named operating owner. Commit the quarterly review cadence into the sponsor's calendar before leaving the room. This is the conversation that gives the program the oxygen it needs to actually ship across the full two quarters.",
        },
        {
          html: stepCard('users', 'blue', 'Conversation 2 — Procurement leadership',
            "Walks through quarter-one play in detail. Confirms the three-tier human-in-loop config, the audit posture, the team capacity baseline measurement. Agrees on the pilot vendor and the pilot scope (typically invoices first)."),
          narration:
            "Conversation two. Procurement leadership — chief procurement officer or director of procurement. Walk through the quarter-one play in detail. Confirm the three-tier human-in-loop configuration with the four conditions for the auto-process tier. Confirm the audit posture build — confidence scores logged, source documents linked, model controls policy drafted, error tracking enabled. Establish how the team capacity baseline will be measured cleanly during the first weeks before any AI is in production. Agree on the pilot vendor — most likely a tool you already evaluated and shortlisted, not a fresh evaluation cycle. Agree on the pilot scope — invoices first as the highest-volume document type. This conversation determines whether the quarter one play has a credible execution path.",
        },
        {
          html: stepCard('users', 'amber', 'Conversation 3 — Planning team + data engineering',
            "Walks through quarter-two play prerequisites. Runs the four-check data-readiness gate honestly — 18+ months clean history, promo tags, lost-sale flags, external signal sources budgeted. Identifies the data work that needs to land in Q1 to make Q2 viable."),
          narration:
            "Conversation three. Planning team plus data engineering. Walk through the quarter-two play prerequisites in detail. Run the four-check data-readiness gate honestly — eighteen months of clean sales history by SKU and region, promotional events tagged, stock-out and lost-sale flags, external signal sources for the LLM layer budgeted. Identify the data work that needs to land during quarter one in parallel with the procurement deployment to make the quarter two demand forecasting deployment viable. Without this conversation Monday, quarter two often discovers data gaps in week three of its own quarter and the play slips. The early identification is the discipline. Three of the four checks can usually be remediated within quarter one if started immediately.",
        },
        {
          html: stepCard('users', 'green', 'Conversation 4 — Two operational team members',
            "One procurement specialist and one planner. Walk them through what they\'ll experience. Get their honest reaction. Their feedback is the earliest signal on whether the workflow lands in operations reality. The conversation most programs skip — and the one that distinguishes programs that ship."),
          narration:
            "Conversation four. Two operational team members from the front line. One procurement specialist from the team that will use the document AI in quarter one. One demand planner from the team that will use the forecasting in quarter two. Walk them through what they will experience in their actual workflow. Get their honest reaction now, not after deployment. Their feedback is the earliest signal on whether the workflow lands in operations reality or only in the deployment deck. Adjust the rollout based on what they raise. This is the conversation most operations AI programs skip — and it is the one that distinguishes programs that ship from programs that bounce off the operational reality of the people who would need to use them. Schedule it Monday morning before the vendor calls.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'A final note',
      iconKey: 'lightbulb',
      eyebrow: 'Chapter 8 · Closing',
      bodyHtml: `<p>Operations AI sits where every business has more potential value to capture and more ways to spend money without capturing it than perhaps any other AI domain. Discipline and sequencing decide which side of the line you land on.</p>`,
      narrationLead:
        "A final note before the takeaways. Operations AI sits where every business has more potential value to capture and more ways to spend money without capturing it than perhaps any other AI domain. The plays that ship are well understood. The plays that disappoint are equally well understood. The data-stable filter is honest about which plays are available now and which need foundation work first. The sequencing — procurement first, forecasting second, harder plays in quarters three through five — is the discipline that compounds wins instead of producing parallel half-deliveries. The operational KPIs translate AI deployments into outcomes the chief operating officer and chief financial officer can fund. Discipline and sequencing decide which side of the value-capture line you land on. The technology is not the constraint in operations AI in 2026; the operational discipline is. Choose discipline.",
    },
    // SLIDE 6
    {
      title: 'Key takeaways — and the end of the course',
      iconKey: 'trophy',
      eyebrow: 'Chapter 8 · Takeaways',
      bodyHtml: `<p>Three anchors. Then the course is yours.</p>`,
      narrationLead:
        "Three anchors. Then the course is yours.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Two plays, two quarters',
            "Q1 — Procurement document AI (highest probability, fastest payback, foundation for confidence). Q2 — Demand forecasting + dynamic safety stock (working capital reduction headline). Hold logistics, PdM, supplier risk for Q3–Q5. Sequence is the multiplier."),
          narration:
            "One. Two plays sequenced across two quarters. Quarter one — procurement document AI as the foundation play with highest probability of clean win and fastest payback. Quarter two — demand forecasting combined with differentiated safety stock as the working capital reduction headline. Hold logistics, predictive maintenance, and supplier risk monitoring for quarters three through five after the foundation lands and earns the right to tackle harder plays. The sequencing discipline is the multiplier. Pressure to deploy more in parallel always comes from vendors and from executive enthusiasm. Hold the discipline.",
        },
        {
          html: stepCard('check', 'green', 'Two — Operational KPIs, not AI metrics',
            "Procurement capacity recovered · service level (not MAPE) · working capital tied up in inventory (balance sheet) · operational team satisfaction. The COO and CFO care about these; nobody on the floor cares about model accuracy in isolation."),
          narration:
            "Two. Operational KPIs, not AI metrics. Procurement team capacity recovered in hours per week, redirected to vendor strategy. Service level — percentage of orders fulfilled on time — not forecast MAPE in the headline. Working capital tied up in inventory as reported on the balance sheet, the number the chief financial officer cares about. Operational team satisfaction with the AI tools — the durability number. Two cadences — monthly with operations leadership, quarterly with the executive sponsor with explicit invest-sustain-exit decision per play. Track operational outcomes, not AI system metrics. The translation to operational value is what funds the program through budget cycles.",
        },
        {
          html: stepCard('check', 'green', 'Three — Four conversations Monday',
            "Executive sponsor (COO or CFO) · procurement leadership · planning team + data engineering · two operational team members. Each unlocks something. None can be combined. Schedule them before any vendor calls."),
          narration:
            "Three. Four conversations to schedule Monday. Executive sponsor — chief operating officer or chief financial officer — confirms scope, budget, and the quarterly review cadence. Procurement leadership — agrees the three-tier human-in-loop configuration, the audit posture, the baseline measurement, the pilot vendor. Planning team plus data engineering — runs the four-check data-readiness gate honestly, identifies the data work that needs to land in quarter one to make quarter two viable. Two operational team members from the front line — one procurement specialist, one demand planner — give the earliest signal on whether the workflow lands in operations reality. Each conversation unlocks something the program needs. None can be combined. Schedule them Monday before any vendor calls. That's the course. Build well.",
        },
      ],
      narrationTrail:
        "Thank you for completing AI for Operations and Supply Chain. The roadmap is yours. Now ship it.",
    },
  ],
}
