import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiOpsChapter01: Chapter = {
  courseId: 'ai-for-operations-supply-chain',
  chapterId: 'chapter-01',
  chapterNumber: 1,
  chapterSlug: 'chapter-01-fit-map',
  title: 'The ops-AI fit map',
  subtitle: 'Six plays that ship · three vendor pitches that consistently disappoint · the data-stable filter that decides where to start.',
  slides: [
    // SLIDE 1
    {
      title: 'The ops-AI fit map',
      iconKey: 'compass',
      eyebrow: 'Chapter 1 · Opening',
      bodyHtml: `<p class="lead">Operations is where AI either creates compounding savings — quarter over quarter, year over year — or burns budget on pilots that never reach production. The fit map decides which path you're on before the first dollar is spent.</p>`,
      narrationLead:
        "Welcome to AI for Operations and Supply Chain. This course is for chief operating officers, supply chain directors, plant managers, logistics heads, and the rev ops teams who run the operational core of the business. Operations is where AI either creates compounding savings — quarter over quarter, year over year — or burns budget on pilots that never reach production. The fit map in this chapter decides which path you're on before the first dollar is spent. Six plays that ship reliably. Three vendor pitches that consistently disappoint. One filter — the data-stable filter — that tells you exactly which plays to start with.",
    },
    // SLIDE 2
    {
      title: 'Six plays that consistently ship',
      iconKey: 'check',
      eyebrow: 'Lesson 1 · The wins',
      bodyHtml: `<p>Six operations AI plays that consistently produce measurable savings when deployed with operational discipline. Each is covered in depth in a later chapter — this is the inventory.</p>`,
      narrationLead:
        "Six operations AI plays that consistently ship measurable savings. Each play is covered in a later chapter — this slide is the inventory. The pattern across all six. AI augments operational judgment with faster pattern detection and better data integration. AI never replaces the operational judgment itself — the decision about what to actually do, in this plant, with this supplier, under these conditions, stays with the operator.",
      steps: [
        {
          html: stepCard('target', 'green', 'Play 1 — Demand forecasting',
            "ML predicts future demand from historical patterns. LLM reads unstructured signals — news, weather, social — that ML misses. Combined, forecast accuracy lifts 15–25%. Stock-outs and overstock both drop. Chapter two."),
          narration:
            "Play one. Demand forecasting. The two-layer approach. Machine learning predicts future demand based on historical patterns — seasonality, trend, promotional response, the usual suspects. Large language model reads unstructured signals that ML misses — supplier press releases about disruptions, weather reports for upstream regions, social signals about category shifts. Combined, forecast accuracy lifts fifteen to twenty-five percent versus ML alone. Stock-outs drop. Overstock drops. Working capital tied up in inventory shrinks. Chapter two covers it including the data-readiness gate.",
        },
        {
          html: stepCard('bookOpen', 'green', 'Play 2 — Procurement document AI',
            "Invoices, purchase orders, contracts — extracted, structured, validated against your master data. Ninety-percent automation on routine documents. Audit-ready trail. Procurement team capacity redirects to vendor strategy. Chapter three."),
          narration:
            "Play two. Procurement document AI. Invoices, purchase orders, contracts — extracted from PDF or paper, structured into your ERP fields, validated against your master vendor and product data. Ninety percent automation rate on routine documents is achievable once the system is tuned. Audit-ready trail because every extraction is logged with the source document and the confidence score. Procurement team capacity redirects from manual document processing to vendor strategy and negotiation — the work that actually creates margin. Chapter three covers it.",
        },
        {
          html: stepCard('zap', 'green', 'Play 3 — Logistics optimisation',
            "AI complements classical operations research where OR runs out — dynamic re-routing under disruption, real-time constraint relaxation, fleet-wide pattern detection. Use AI as the OR amplifier, not the replacement. Chapter four."),
          narration:
            "Play three. Logistics optimisation. The critical framing — AI complements classical operations research where OR runs out, not replaces it. OR is excellent at deterministic optimisation problems with stable inputs. AI is excellent at dynamic re-routing under disruption, real-time constraint relaxation as conditions change mid-shift, fleet-wide pattern detection that surfaces issues before they become incidents. Use AI as the OR amplifier — not the replacement. Logistics teams that frame AI as augmenting OR ship reliable improvements. Teams that frame AI as replacing OR produce pilots that don't reach production. Chapter four covers the line.",
        },
        {
          html: stepCard('cog', 'green', 'Play 4 — Predictive maintenance',
            "Sensor data tells you the equipment is about to fail. LLM narrative tells the plant engineer what to do about it — in their language, with context, in time to act. Combined matters more than either alone. Chapter five."),
          narration:
            "Play four. Predictive maintenance. Same two-layer pattern. Sensor data and time-series ML tell you the equipment is showing pre-failure signatures — vibration drift, temperature pattern, current draw anomaly. The LLM narrative tells the plant engineer what to do about it in their language, with context from past similar events, and with action recommendations in time to actually prevent the failure. Combined matters more than either alone. Predictive maintenance vendors selling the sensor model without the narrative layer have a higher failure rate in real plant deployments because the engineers don't act on raw alerts. Chapter five covers the combined approach and the three vendor traps.",
        },
        {
          html: stepCard('search', 'green', 'Play 5 — Inventory intelligence',
            "AI solves stock-outs and overstock together — they're the same problem expressed differently. Surfaces actions in formats matched to ops cadence — daily for fast-moving SKUs, weekly for slow-moving. Working-capital reduction with service-level holds. Chapter six."),
          narration:
            "Play five. Inventory intelligence. AI solves the apparently contradictory problem of stock-outs and overstock simultaneously — because they're the same underlying problem expressed differently. Both come from forecast error compounded with the wrong reorder rules. AI fixes both with better forecasting plus dynamic safety stock by SKU velocity and supplier reliability. Critically, it surfaces actions in formats matched to operational cadence — daily for fast-moving SKUs, weekly for slow-moving SKUs, monthly for strategic stock decisions. Working capital tied up in inventory typically reduces eight to fifteen percent with service levels held or improved. Chapter six covers it.",
        },
        {
          html: stepCard('shield', 'green', 'Play 6 — Supplier risk monitoring',
            "AI reads supplier signals across news, financial filings, regulator actions, court records. Surfaces emerging risks weeks before they hit your supply chain. Risk team focuses on response, not on monitoring. Chapter seven."),
          narration:
            "Play six. Supplier risk monitoring. AI reads supplier signals continuously across news, financial filings, regulator actions, court records, employment indicators. Surfaces emerging risks weeks before they hit your supply chain — for example, a key supplier facing a class-action lawsuit, an upstream Tier-2 supplier in financial stress, a regulator action against a logistics partner. The risk team focuses on response and mitigation, not on monitoring noise. This is the play with the highest geopolitical-tension-era return, given how supply chains have become more fragile across 2024 and 2025. Chapter seven covers it.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Three vendor pitches that consistently disappoint',
      iconKey: 'x',
      eyebrow: 'Lesson 2 · The disappointments',
      bodyHtml: `<p>Three ops-AI pitches show up constantly in vendor decks and consistently disappoint when deployed. Name them. Don't fund them. Redirect the budget.</p>`,
      narrationLead:
        "Three operations AI pitches show up constantly in vendor decks and at supply chain conferences. All three consistently disappoint when actually deployed at production scale. Name them. Don't fund them. Redirect the budget to the six plays that ship. The pattern across all three disappointments — they promise to replace operational judgment with autonomous decisions, in environments where the judgment is the value.",
      steps: [
        {
          html: stepCard('x', 'red', 'Disappointment 1 — Autonomous supply planning',
            "AI sets supplier orders, production schedules, distribution moves — without planner judgment. Performs well in normal conditions; fails badly in the disruptions where the planner's judgment was the actual value. Use AI to inform planners. Don't autonomise planning."),
          narration:
            "Disappointment one. Autonomous supply planning. The pitch — AI sets supplier orders, production schedules, and distribution moves end-to-end without planner judgment in the loop. The reality. Performs well in stable conditions where the planner wasn't adding much value anyway. Fails badly in the disruptions and exceptional conditions where the planner's judgment was the actual value the business pays for. Tariff changes, geopolitical events, key supplier failures, demand shocks — these are exactly the situations where autonomous AI planning produces confident wrong answers and the cost compounds across the network within a week. Use AI to inform planners with better signal. Don't autonomise the planning itself.",
        },
        {
          html: stepCard('x', 'red', 'Disappointment 2 — Real-time end-to-end visibility dashboards',
            "The promise — one screen showing every node in your supply chain in real time. The reality — your master data isn\'t clean enough; integration costs are huge; the dashboard exists but is wrong on details. Start with the data hygiene; don\'t buy the dashboard."),
          narration:
            "Disappointment two. Real-time end-to-end visibility dashboards. The promise — one screen showing every node in your global supply chain in real time, with AI-powered insights surfaced automatically. The reality. Your master data across suppliers, items, and locations isn't clean enough to support what the dashboard claims. Integration costs to make it real are enormous. The dashboard exists in production but is wrong on details often enough that operations teams stop trusting it and revert to their existing spreadsheets. The investment was real; the value didn't materialise. The fix isn't a different vendor. The fix is a year of master data hygiene work first. Then the visibility dashboard is achievable. Without the foundation, no dashboard delivers.",
        },
        {
          html: stepCard('x', 'red', 'Disappointment 3 — Generative AI for procurement negotiation',
            "AI claims to negotiate vendor contracts autonomously. Negotiation is relational, not transactional. Suppliers detect AI-driven negotiation and either disengage or game it. Some early adopters quietly rolled back in 2025."),
          narration:
            "Disappointment three. Generative AI for procurement negotiation. The pitch — AI negotiates vendor contracts autonomously, capturing margin you currently leave on the table because human negotiators have cognitive biases. The reality. Vendor negotiation is fundamentally a relational activity, not a transactional one. Suppliers detect AI-driven negotiation within one or two cycles and either disengage from the relationship or game it back — for example, padding initial quotes by twenty percent because they know an AI will counter algorithmically. Several large enterprises that piloted this in 2024 and early 2025 quietly rolled back to human negotiation by mid-2025 after measurable damage to supplier relationships. Use AI for negotiation prep — competitive analysis, market benchmarks, historical performance review. Don't autonomise the negotiation itself. The relationship is the asset.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The pattern',
        "All three disappointments replace operational judgment with autonomous decisions in domains where the judgment is the value. The six wins augment judgment with faster pattern detection. The same principle from the sales and CS courses applies here — augment, don't replace."),
      calloutNarration:
        "The pattern across the three disappointments. All three replace operational judgment with autonomous AI decisions in domains where the judgment itself is the value. The six wins augment judgment with faster pattern detection, better signal integration, and more comprehensive data. The same principle applies across operations as it did in sales and customer service in earlier courses. AI augments human judgment. AI does not replace it. The asymmetry of outcomes is the same — small productivity gain when AI replaces judgment under stable conditions, large cost when conditions shift and AI is confidently wrong without recourse.",
    },
    // SLIDE 4
    {
      title: 'The data-stable filter',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · The filter',
      bodyHtml: `<p>One filter decides which of the six plays to start with in your specific operation. Run the filter honestly; sequence the plays accordingly. Most teams skip this and try to deploy everything at once — and most then underdeliver on each.</p>`,
      narrationLead:
        "One filter decides which of the six plays to start with in your specific operation. The data-stable filter. Run it honestly. Sequence the plays accordingly. Most teams skip this filter and try to deploy three or four plays in parallel — and then underdeliver on each because the operational attention is too thin and the data foundations aren't ready. The filter is two checks per play, applied to the six in order. Take twenty minutes. The output is the sequence.",
      steps: [
        {
          html: stepCard('check', 'amber', 'Check 1 — Is the data ready?',
            "Ready means: clean master data, consistent definitions, time-series of at least 12 months, structured enough to feed a model. If the data isn\'t ready, the AI play won\'t deliver — start with a data-hygiene quarter, not the AI pilot."),
          narration:
            "Check one for each candidate play. Is the data ready? Data ready means three things together. Clean master data across the dimensions the play needs — suppliers, items, locations, equipment, customers. Consistent definitions and units across the source systems involved. Time-series of at least twelve months for any forecasting or predictive play. If data isn't ready on any of the three dimensions, the AI play will not deliver the promised value regardless of which vendor you pick or how much you spend. The honest move is to start with a data-hygiene quarter, not an AI pilot. The data work feels unglamorous; it's the highest-ROI investment in your operations AI program.",
        },
        {
          html: stepCard('check', 'amber', 'Check 2 — Is the process stable?',
            "Stable means: the underlying business process is consistent across recent quarters, not undergoing major redesign. AI on top of a process that's changing produces a model that's wrong by the time it trains. Stabilise the process; then add AI."),
          narration:
            "Check two for each candidate play. Is the underlying business process stable? Process stable means the operational process the AI is meant to optimise is consistent across recent quarters and is not undergoing major redesign. If you're in the middle of a warehouse management system migration, a procurement-policy overhaul, or a logistics network redesign — wait. Adding AI on top of a process that's changing produces a model that's already wrong by the time it finishes training. The pattern the AI learns will not match the pattern after the redesign settles. Stabilise the process first. Then add AI on top of the stable foundation. This sequence saves teams from the pattern of AI projects that almost worked but got overtaken by a process change.",
        },
        {
          html: stepCard('flag', 'green', 'The sequence — start with both checks passed',
            "Plays where both data is ready and process is stable — pilot them first. Plays where only one is ready — start the prep work for the other. Plays where neither — postpone the AI pilot for two quarters of foundation work."),
          narration:
            "The sequence. Plays where both data is ready and process is stable — pilot them first. These are the wins available right now. Typically two or three of the six plays land here for most operations. Plays where only one of the two is ready — start the preparation work for the other dimension in parallel with your first pilots, with a target to pilot in the next quarter. Plays where neither data nor process is ready — postpone the AI pilot for two quarters of foundation work. The temptation is to start everything because the vendor demos are impressive. The discipline is to start only where the foundations support the deployment. Foundations first; pilots second.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 1 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter two — demand forecasting with AI.</p>`,
      narrationLead:
        "Three anchors before chapter two — demand forecasting with AI.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Six plays that ship',
            "Demand forecasting · procurement document AI · logistics optimisation · predictive maintenance · inventory intelligence · supplier risk monitoring. Each covered in chapters two through seven."),
          narration:
            "One. Six operations AI plays that consistently ship measurable value. Demand forecasting. Procurement document AI. Logistics optimisation as OR amplifier. Predictive maintenance with the sensor-plus-narrative pattern. Inventory intelligence solving stock-outs and overstock together. Supplier risk monitoring with the highest geopolitical-era return. Each is covered in depth in chapters two through seven.",
        },
        {
          html: stepCard('check', 'green', 'Two — Three pitches that disappoint',
            "Autonomous supply planning · real-time end-to-end visibility without master data hygiene · generative AI for procurement negotiation. Don\'t fund them. The pattern — all three try to replace judgment in domains where judgment is the value."),
          narration:
            "Two. Three vendor pitches that consistently disappoint at production scale. Autonomous supply planning — performs in stable conditions, fails in the disruptions where planner judgment was the value. Real-time end-to-end visibility dashboards without prior master data hygiene work — the dashboard exists but is wrong on details, ops teams stop trusting it. Generative AI for procurement negotiation — the relationship with suppliers is the asset and AI-driven negotiation damages it within one or two cycles. Don't fund them. The pattern across all three — they replace operational judgment with autonomous decisions in domains where the judgment is the value.",
        },
        {
          html: stepCard('check', 'green', 'Three — The data-stable filter',
            "Two checks per play — is data ready, is process stable. Plays where both check out — pilot first. Plays where neither check out — two quarters of foundation work before any AI pilot. Foundations first; pilots second."),
          narration:
            "Three. The data-stable filter. Two checks per play. Is the data ready — clean master data, consistent definitions, twelve months of time-series. Is the process stable — not undergoing major redesign that will invalidate the model. Plays where both check out — pilot them first, these are the wins available now. Plays where only one checks out — prep work in parallel for next quarter. Plays where neither checks out — two quarters of foundation work before any AI pilot in that area. Foundations first; pilots second; vendor demos are not the right sequencing input.",
        },
      ],
      narrationTrail:
        "Chapter two — demand forecasting with AI. The two-layer model, the data-readiness gate, and the handoff design that makes ops teams actually use the forecasts. See you there.",
    },
  ],
}
