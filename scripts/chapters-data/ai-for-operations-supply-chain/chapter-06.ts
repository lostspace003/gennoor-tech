import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiOpsChapter06: Chapter = {
  courseId: 'ai-for-operations-supply-chain',
  chapterId: 'chapter-06',
  chapterNumber: 6,
  chapterSlug: 'chapter-06-inventory-intelligence',
  title: 'Inventory intelligence',
  subtitle: 'Stock-outs and overstock are the same problem · dynamic safety stock by velocity tier · action formats matched to operational cadence.',
  slides: [
    // SLIDE 1
    {
      title: 'Inventory intelligence',
      iconKey: 'search',
      eyebrow: 'Chapter 6 · Opening',
      bodyHtml: `<p class="lead">Stock-outs and overstock look like opposite problems on the dashboard. They are the same underlying problem expressed differently. AI inventory intelligence solves both together by fixing the root cause — forecast error compounded by the wrong reorder rules.</p>`,
      narrationLead:
        "Welcome to chapter six. Inventory intelligence. Stock-outs and overstock appear as opposite problems on the operations dashboard — one means we didn't have enough, the other means we had too much. They are the same underlying problem expressed differently. Both come from forecast error compounded by reorder rules that don't adapt to the actual demand pattern. AI inventory intelligence solves both together by fixing the root cause. Three components — the forecast bridge, dynamic safety stock by velocity tier, and the action formats matched to operational cadence. By the end, the architecture for inventory intelligence that delivers measurable working capital reduction.",
    },
    // SLIDE 2
    {
      title: 'Stock-outs and overstock — the same problem',
      iconKey: 'compass',
      eyebrow: 'Lesson 1 · The framing',
      bodyHtml: `<p>One mental shift unlocks the inventory problem. The shift is to stop treating stock-outs and overstock as opposite problems and start treating them as the same problem at different points of the same distribution.</p>`,
      narrationLead:
        "One mental shift unlocks the inventory problem. The shift is to stop treating stock-outs and overstock as opposite problems requiring different solutions — and to start treating them as the same problem at different points of the same demand distribution. Both come from the same root cause. Both respond to the same fix. The mental shift is what makes inventory intelligence make sense as a single program rather than two competing initiatives.",
      steps: [
        {
          html: stepCard('compass', 'amber', 'Reframe — both come from forecast error',
            "Forecast says 100 units next month. Actual demand is 130 — stock-out. Actual demand is 70 — overstock. Same forecast, two failures, both caused by the same forecast not being accurate. Fix the forecast accuracy and the buffer rules; both problems shrink."),
          narration:
            "Reframe one. Both stock-outs and overstock come from forecast error. The forecast says one hundred units of demand next month. Actual demand turns out to be one hundred thirty units — stock-out, customer service failure, lost sale. Actual demand turns out to be seventy units — overstock, working capital tied up, possible write-off. Same forecast. Two failure modes. Both caused by the same forecast not being accurate enough. Fix the forecast accuracy from chapter two and fix the buffer rules that responded to the forecast and both problems shrink simultaneously. Teams that treat stock-outs and overstock as separate initiatives with separate owners chase their tail because solving one tends to worsen the other in their architecture.",
        },
        {
          html: stepCard('compass', 'amber', 'Reframe — safety stock is the buffer for forecast error',
            "Safety stock exists to absorb forecast error. Too little safety stock — stock-outs. Too much — overstock. The right amount varies by SKU based on demand variance and supplier reliability. Uniform safety-stock rules across SKUs is the dominant source of inventory problems."),
          narration:
            "Reframe two. Safety stock exists to absorb forecast error. That's its only job — buffer against the difference between forecast and actual. Too little safety stock — stock-outs when actual exceeds forecast. Too much safety stock — overstock when actual undershoots forecast. The right amount of safety stock varies by SKU based on demand variance and supplier reliability. Uniform safety-stock rules across all SKUs — for example, two weeks of cover for everything — is the dominant source of inventory problems in most operations because demand variance varies by ten or twenty times across the SKU portfolio. The high-variance SKUs are underbuffered and stock out; the low-variance SKUs are overbuffered and tie up capital. Differentiated safety stock by SKU characteristic is the architectural fix.",
        },
        {
          html: stepCard('check', 'green', 'The combined solution — better forecast + differentiated buffer',
            "Layer 1 — better forecast from chapter two. Layer 2 — dynamic safety stock by SKU velocity and variance. Together they shrink stock-outs and overstock simultaneously. Working capital reduction of 8–15% with service levels held or improved is the consistent outcome."),
          narration:
            "The combined solution. Layer one — better demand forecast from chapter two, with the two-layer ML-plus-LLM model and explainable rationale. Layer two — dynamic safety stock by SKU velocity tier and demand variance, replacing the uniform rules. Together they shrink stock-outs and overstock simultaneously rather than trading one for the other. Working capital tied up in inventory reduces typically eight to fifteen percent across the portfolio with service levels held or improved. The combined solution is the inventory intelligence program. Treating it as two programs — better forecasting separately from inventory rules — leaves significant value on the table because the two are designed to work together.",
        },
      ],
    },
    // SLIDE 3
    {
      title: 'Dynamic safety stock by velocity tier',
      iconKey: 'cog',
      eyebrow: 'Lesson 2 · The buffer',
      bodyHtml: `<p>Four SKU velocity tiers. Each tier has different safety-stock logic. Match the rule to the tier and inventory metrics improve across the portfolio. Most teams operate uniform rules and pay the cost.</p>`,
      narrationLead:
        "Four SKU velocity tiers. Each tier has different safety-stock logic because each tier has different demand characteristics and different cost-of-error profile. Match the safety-stock rule to the velocity tier and inventory metrics improve across the entire portfolio. Most operations operate uniform safety-stock rules — the same days-of-cover policy across all SKUs — and pay the cost in either capital tied up or service level. Differentiation is the win.",
      steps: [
        {
          html: stepCard('flag', 'blue', 'Tier 1 — Fast movers (top 20% of SKUs, 70% of volume)',
            "Stable demand pattern, predictable variance. Low safety stock days because the high turnover absorbs forecast error fast. Optimised for inventory turns; service level held by frequent replenishment, not by buffer."),
          narration:
            "Tier one. Fast movers. Top twenty percent of SKUs accounting for typically seventy percent of demand volume. Stable demand pattern, predictable variance, high turnover. Low safety stock days because the high turnover absorbs forecast error fast — even a wrong forecast resolves into reality within a few replenishment cycles. Optimised for inventory turns rather than buffer. Service level held by frequent replenishment rather than by carrying extra stock. This tier is where the working capital reduction primarily comes from when inventory intelligence is implemented well — because uniform safety-stock rules tend to over-buffer fast movers significantly.",
        },
        {
          html: stepCard('flag', 'blue', 'Tier 2 — Steady movers (next 30% of SKUs, 20% of volume)',
            "Moderate demand, moderate variance. Standard safety-stock formula tuned to actual variance per SKU rather than uniform. The bulk of the SKU portfolio sits here; the standard rule is the right rule, just calibrated."),
          narration:
            "Tier two. Steady movers. Next thirty percent of SKUs accounting for about twenty percent of demand volume. Moderate demand, moderate variance. Standard safety-stock formula tuned to actual demand variance per SKU rather than a uniform days-of-cover rule across all. The bulk of the SKU portfolio sits in this tier and the classical safety-stock formula is the right tool — just calibrated to each SKU's actual variance rather than averaged across the tier. AI calibrates the variance per SKU automatically from history; classical rules just use a uniform assumption that's wrong for most SKUs.",
        },
        {
          html: stepCard('flag', 'amber', 'Tier 3 — Slow movers (next 40% of SKUs, 8% of volume)',
            "Sparse demand, high variance, hard to forecast. Two strategies — service-level commitment with explicit safety stock, OR demand-driven replenishment with longer lead times. Decide explicitly per SKU; don\'t default-apply fast-mover logic."),
          narration:
            "Tier three. Slow movers. Next forty percent of SKUs accounting for about eight percent of demand volume. Sparse demand — these SKUs sell in clumps with long gaps in between, or unpredictably across the year. Hard to forecast with statistical methods because the data is too sparse. Two strategies are available per SKU. Strategy one — explicit service-level commitment with safety stock sized for the rare but real demand. Strategy two — demand-driven replenishment with longer customer lead times and lower buffer. Decide explicitly per SKU based on customer importance and the cost-of-stockout. Don't default-apply the fast-mover logic to slow movers — it produces severe overstock in this tier, which is the dominant source of inventory write-offs.",
        },
        {
          html: stepCard('flag', 'red', 'Tier 4 — Erratic / strategic (bottom 10%, 2% of volume)',
            "Extreme variance, strategic importance, or both. Hand-managed by senior planners. AI surfaces signals but doesn\'t set the rule. The honest framing — some SKUs are not suitable for algorithmic safety stock and the team needs to know which."),
          narration:
            "Tier four. Erratic or strategically critical SKUs. Bottom ten percent of SKUs accounting for about two percent of volume — but possibly significant strategic importance, like spare parts for high-value equipment or items critical to key customer relationships. Extreme demand variance — sometimes near-zero, sometimes shock spikes. Hand-managed by senior planners with judgment rather than algorithmic rules. AI surfaces relevant signals — supplier risk, customer indication, lead-time changes — but doesn't set the safety-stock rule. The honest framing — some SKUs in your portfolio are not suitable for algorithmic safety stock and the operations team needs to know which ones. Tier four is the explicit acknowledgement. Without it, teams apply algorithmic rules to strategic SKUs and produce occasional severe failures.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Where the working capital reduction lives',
        "Tier 1 (over-buffered fast movers under uniform rules) and tier 3 (over-buffered slow movers under uniform rules) are where most teams find the working capital reduction. Tier 2 stays roughly the same. Tier 4 is unchanged by design."),
      calloutNarration:
        "Where the working capital reduction primarily lives in the four-tier architecture. Tier one — fast movers that were over-buffered under uniform days-of-cover rules — release significant working capital when safety stock right-sizes to their actual variance and high turnover. Tier three — slow movers that were over-buffered when fast-mover logic was applied to them — release working capital and prevent the write-offs that often hide in this tier. Tier two stays roughly the same with calibrated safety stock — the working capital is already approximately right under standard rules. Tier four is unchanged by design — these SKUs are managed by judgment rather than algorithm. The tier-by-tier honesty is what produces the eight to fifteen percent overall reduction reliably.",
    },
    // SLIDE 4
    {
      title: 'Action formats matched to operational cadence',
      iconKey: 'calendar',
      eyebrow: 'Lesson 3 · The cadence',
      bodyHtml: `<p>Three cadences in inventory operations. Each cadence needs a different action format from AI. Mismatched cadence and format is why most inventory AI deployments produce dashboards nobody acts on.</p>`,
      narrationLead:
        "Three cadences in operations inventory management. Daily for fast movers and reactive decisions. Weekly for steady movers and tactical reviews. Monthly for slow movers and strategic decisions. Each cadence needs a different format of AI-surfaced action. Mismatched cadence and format is why most inventory AI deployments produce dashboards nobody acts on — the format doesn't fit the operational rhythm of the people who would need to act.",
      steps: [
        {
          html: stepCard('calendar', 'blue', 'Cadence 1 — Daily action list for fast movers',
            "Single-screen list of high-priority replenishment orders to place today. Pre-populated quantities. Operator scans, approves, modifies. Five minutes per day; releases working capital and prevents stock-outs simultaneously."),
          narration:
            "Cadence one. Daily action list for fast movers. Single-screen list of high-priority replenishment orders the operations team needs to place today, with pre-populated quantities calculated from current stock plus AI demand forecast plus dynamic safety stock. The operator scans the list, approves the standard ones in bulk, modifies the exceptions, places the orders. Five to ten minutes per day for an operations team managing several hundred fast-mover SKUs. The format is daily because fast-mover replenishment cycles run daily — the AI output matches the operational rhythm. Releases working capital tied up in over-buffer while preventing stock-outs from under-buffer simultaneously.",
        },
        {
          html: stepCard('calendar', 'blue', 'Cadence 2 — Weekly steady-mover review',
            "Once a week, the inventory team reviews steady-mover positions — what\'s trending out of healthy band, what\'s changing in supplier signal, what\'s rotating slowly. Tactical adjustments and supplier conversations land here. Hour per week."),
          narration:
            "Cadence two. Weekly steady-mover review. Once a week, the inventory operations team reviews steady-mover positions. What's trending out of the healthy stock band on either side. What's changing in supplier delivery performance or lead-time signal. What's rotating more slowly than expected and may need promotion or markdown. Tactical adjustments and supplier conversations land in this cadence. AI surfaces the deviations and patterns; the team makes the calls. Roughly an hour per week for the inventory team. The format is a tactical review — not a transactional action list — because steady-mover decisions are about adjusting parameters rather than placing individual orders.",
        },
        {
          html: stepCard('calendar', 'amber', 'Cadence 3 — Monthly slow-mover and strategic review',
            "Once a month, the broader operations team reviews slow movers and strategic SKUs. Decisions about service-level commitments, end-of-life candidates, supplier diversification. AI surfaces market shifts and supplier risk signals. Decisions land at this cadence."),
          narration:
            "Cadence three. Monthly slow-mover and strategic review. Once a month, the broader operations team reviews slow-moving SKUs and tier-four strategic items. Decisions about service-level commitments to key customers, end-of-life candidates among slow-movers, supplier diversification for strategic items, inventory write-down decisions on dead stock. AI surfaces market shifts, supplier risk signals, customer demand changes. The decisions land at this cadence because they're strategic — not weekly tactical and not daily transactional. Roughly two to three hours per month with finance, sales, and operations together. The cross-functional format reflects that these decisions affect multiple parts of the business.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 6 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter seven — supplier risk monitoring.</p>`,
      narrationLead:
        "Three anchors before chapter seven — supplier risk monitoring and end-to-end visibility.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Stock-outs and overstock are the same problem',
            "Both come from forecast error compounded by uniform safety-stock rules. Fix the forecast (chapter 2) plus differentiate the safety stock by SKU. Both problems shrink together; treating them as separate initiatives leaves value on the table."),
          narration:
            "One. Stock-outs and overstock are the same underlying problem at different points of the same demand distribution. Both come from forecast error compounded by uniform safety-stock rules that don't match SKU characteristics. Fix the forecast — chapter two's two-layer model — plus differentiate the safety stock by SKU. Both problems shrink together. Teams treating stock-outs and overstock as two separate initiatives with two separate owners chase their tail because the architecture has them coupled. Treat it as one program.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four velocity tiers, four safety-stock approaches',
            "Fast movers (low buffer, high turn) · steady movers (calibrated standard formula) · slow movers (explicit service-level or demand-driven choice) · erratic/strategic (hand-managed, AI surfaces signals). Working capital reduction lives in tiers 1 and 3."),
          narration:
            "Two. Four velocity tiers with four safety-stock approaches. Fast movers — top twenty percent of SKUs, seventy percent of volume — low buffer, high turn, optimise for inventory turns. Steady movers — calibrated classical safety-stock formula, the bulk of the portfolio, AI calibrates variance per SKU. Slow movers — explicit per-SKU choice between service-level commitment with buffer or demand-driven with longer lead times, never default to fast-mover logic. Erratic or strategic — hand-managed by senior planners, AI surfaces signals but doesn't set rules. The working capital reduction primarily comes from tier one and tier three previously over-buffered under uniform rules.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three cadences, three action formats',
            "Daily action list for fast-mover replenishment · weekly tactical review for steady movers · monthly strategic review for slow movers and tier 4. Mismatched cadence-and-format is why most inventory AI dashboards go unused."),
          narration:
            "Three. Three cadences with three matched action formats. Daily action list for fast-mover replenishment — single screen, pre-populated quantities, five to ten minutes per day. Weekly tactical review for steady movers — deviations and patterns, supplier conversations, roughly an hour. Monthly strategic review for slow movers and tier-four items — cross-functional with finance and sales, two to three hours, decisions on service levels, end-of-life, diversification. Mismatched cadence and format is why most inventory AI dashboards go unused — the format doesn't fit the operational rhythm of the people who would need to act. Match the format to the cadence and adoption follows.",
        },
      ],
      narrationTrail:
        "Chapter seven — supplier risk monitoring and end-to-end visibility. The signal sources, the dashboard discipline, and the response cadence. See you there.",
    },
  ],
}
