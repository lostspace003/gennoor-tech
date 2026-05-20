import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiOpsChapter02: Chapter = {
  courseId: 'ai-for-operations-supply-chain',
  chapterId: 'chapter-02',
  chapterNumber: 2,
  chapterSlug: 'chapter-02-demand-forecasting',
  title: 'Demand forecasting with AI',
  subtitle: 'The two-layer model · the data-readiness gate · the handoff that makes ops teams actually use the forecast.',
  slides: [
    // SLIDE 1
    {
      title: 'Demand forecasting with AI',
      iconKey: 'target',
      eyebrow: 'Chapter 2 · Opening',
      bodyHtml: `<p class="lead">Demand forecasting is the highest-leverage AI play in operations because every other ops decision downstream depends on it. Two-layer model. One data gate. One handoff that decides whether the ops team trusts the forecast or quietly reverts to their old spreadsheets.</p>`,
      narrationLead:
        "Welcome to chapter two. Demand forecasting with AI. Demand forecasting is the highest-leverage AI play in operations because every other operational decision downstream depends on it. Better forecast equals better inventory, better procurement, better logistics, better cash. Worse forecast — every downstream decision is wrong in cascading ways. Two-layer model that beats either layer alone. One data-readiness gate that decides whether the model can work at all. And one handoff design that decides whether your operations team actually uses the forecast in their daily decisions — or quietly reverts to the spreadsheet they've been running for a decade.",
    },
    // SLIDE 2
    {
      title: 'The two-layer model',
      iconKey: 'cog',
      eyebrow: 'Lesson 1 · The two layers',
      bodyHtml: `<p>Two layers, working together. Most teams deploy classical ML alone and miss the unstructured signal. A few deploy LLM alone and miss the historical pattern. The two combined produces the lift.</p>`,
      narrationLead:
        "Two layers, working together. Most operations teams deploy classical machine learning alone and miss the unstructured signal that often matters most. A few deploy large language models alone and miss the historical pattern that ML excels at. The two combined — designed as one system, not two — produces the fifteen to twenty-five percent forecast accuracy lift versus ML alone. Let me cover each layer and how they combine.",
      steps: [
        {
          html: stepCard('cog', 'blue', 'Layer 1 — Classical ML on structured history',
            "Time-series models — ARIMA, exponential smoothing, Prophet, or gradient-boosted trees — trained on 12–24 months of sales by SKU, region, channel. Excellent at seasonality, trend, promotional response. Necessary but not sufficient."),
          narration:
            "Layer one. Classical machine learning on structured sales history. Time-series models — ARIMA, exponential smoothing, Facebook Prophet, or gradient-boosted trees depending on your data structure — trained on twelve to twenty-four months of historical sales by SKU, region, and channel. Excellent at capturing seasonality, trend, promotional response, and the recurring patterns that account for most demand. Necessary but not sufficient. Run on its own it produces a baseline forecast that's accurate during stable conditions and consistently wrong during anything novel — the supplier disruption, the social media moment, the regulatory change, the competitor exit. The wrong-during-novel weakness is what layer two fixes.",
        },
        {
          html: stepCard('search', 'blue', 'Layer 2 — LLM signal extraction',
            "LLM reads unstructured signals — news about your category, weather for upstream regions, social sentiment, competitor announcements, regulator changes. Surfaces adjustments to the ML baseline with rationale. Catches what ML misses."),
          narration:
            "Layer two. Large language model signal extraction from unstructured sources. The LLM reads news about your category, weather forecasts for upstream supplier regions, social sentiment on your product line, competitor announcements about pricing or supply changes, regulator decisions that affect your market. It surfaces adjustments to the ML baseline forecast with explicit rationale — for example, ML baseline says October will be flat, but a key competitor announced production constraints last week, suggesting a five-to-eight percent upside for SKU group A. The LLM catches what ML cannot see because ML only learns from historical patterns and these signals are happening now, in the present, before they show up in your sales history.",
        },
        {
          html: stepCard('check', 'blue', 'The combined output — explainable forecasts',
            "Single forecast per SKU-region-channel. ML baseline value + LLM adjustment + explicit rationale. Ops planner sees not just the number but why. Explainability is the difference between trusted and ignored forecasts."),
          narration:
            "The combined output. Single forecast per SKU, region, and channel. ML baseline value, LLM adjustment value, combined forecast, explicit rationale for the adjustment. The operations planner sees not just the forecast number but why the number is what it is. Explainability is the difference between trusted forecasts the team plans against and ignored forecasts the team overrides every week. Black-box forecasts — single number with no rationale — get overridden within a month because planners don't know whether to trust them. Explainable forecasts get adopted into the daily planning rhythm because planners can validate the rationale. Design for explainability from day one.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'The most common mistake',
        "Teams deploy a single sophisticated model — usually a neural network — instead of the two-layer model. The sophisticated single model is harder to explain and tends to underperform the two-layer architecture in most operational settings. Layer the model; don\'t complicate it."),
      calloutNarration:
        "The most common mistake teams make in forecasting AI deployments. Deploying a single sophisticated model — usually a deep neural network architecture — instead of the two-layer model. The sophisticated single model is harder to explain to operations planners, harder to debug when it goes wrong, and tends to underperform the two-layer architecture in most real operational settings because the unstructured signal a separate LLM layer catches doesn't make it into the structured features of the single model. Layer the model — classical ML for the baseline, LLM for the adjustment — don't complicate it into a single black box. Simpler explainable architecture, better operational outcomes.",
    },
    // SLIDE 3
    {
      title: 'The data-readiness gate',
      iconKey: 'shield',
      eyebrow: 'Lesson 2 · The gate',
      bodyHtml: `<p>Four checks. Run them before deploying any forecasting AI. If two or more fail, the AI deployment will not deliver — do the data work first, the AI pilot second.</p>`,
      narrationLead:
        "Four data-readiness checks. Run them before deploying any forecasting AI. If two or more fail, the AI deployment will not deliver regardless of which model you pick or how much you spend. Do the data work first, the AI pilot second. The data work feels unglamorous and gets less budget attention than the AI pilot — but it's the determinant of whether the AI pilot actually delivers.",
      steps: [
        {
          html: stepCard('check', 'amber', 'Check 1 — 18+ months of clean sales history',
            "Need at least 18 months — ideally 24 — by SKU, region, channel. Need to be clean — no major source system migrations corrupting the time-series. Without this, ML can\'t learn seasonality reliably."),
          narration:
            "Check one. Eighteen months or more of clean sales history. By SKU, by region, by channel — the dimensions your forecasting will produce. Twenty-four months is better. Critically, the history must be clean — no major source-system migrations in the middle that corrupted the time-series and produced apparent demand shocks that were actually data artifacts. ERP migrations, channel reorganisations, SKU consolidations — these are common in the eighteen months before a forecasting AI pilot for a reason — the team realised the existing forecasting was inadequate and that's why they're investing in AI. The migrations also corrupted the training data. Verify cleanliness honestly. Six months of unaffected post-migration data is often the actual usable training window.",
        },
        {
          html: stepCard('check', 'amber', 'Check 2 — Promotional history captured',
            "If you ran promotions during the training window, those events must be tagged in the data with promo type, depth, dates. Without the tags, the model can\'t learn promo response — and will misforecast every future promo."),
          narration:
            "Check two. Promotional history captured properly. If your business ran promotions during the training window — and most businesses do — those promotional events must be explicitly tagged in the data with promo type, depth, start and end dates, channels involved. Without the tags, the ML model can't learn the demand pattern caused by the promo versus the underlying baseline. It also can't generalise — it will misforecast every future promo because it doesn't know what was a promo and what wasn't. Many CRM and ERP environments don't capture this cleanly. The fix is data engineering work to back-fill the tagging from marketing's promo history before forecasting AI trains. Skip the back-fill and forecast quality stays mediocre indefinitely.",
        },
        {
          html: stepCard('check', 'amber', 'Check 3 — Stock-out / lost-sale flags',
            "Periods when you couldn\'t meet demand because of stock-outs look like demand drops in raw sales data. Without lost-sale flags, the model learns to forecast lower demand than reality. Especially important post-pandemic supply chain disruptions."),
          narration:
            "Check three. Stock-out and lost-sale flags in the data. Periods when you couldn't meet demand because of stock-outs look like demand drops in raw sales data. The model — being a statistical thing — concludes demand was low during those periods and adjusts future forecasts downward. The forecast becomes self-fulfilling — it predicts low demand, you stock low, you have stock-outs, the data records low demand. Especially important after the 2020-2023 supply chain disruptions when many businesses had significant stock-out periods. The fix — lost-sale flags or substitution-tracking that records when demand was unmet. Many businesses don't capture this. Back-filling with proxies — for example, online out-of-stock click events — is often possible and worthwhile.",
        },
        {
          html: stepCard('check', 'amber', 'Check 4 — External signal sources are available',
            "Layer 2 needs unstructured signal sources — news APIs, weather data, social listening, competitor monitoring. They exist; they cost. If the budget for signal sources isn\'t there, layer 2 doesn\'t deploy — and the forecast lift is half what it could be."),
          narration:
            "Check four. External signal sources are available and budgeted. Layer two of the forecasting model needs unstructured signal sources — news APIs for category coverage, weather data for upstream supplier regions and downstream demand regions, social listening for category trends, competitor monitoring services for announcements. All of these exist as data services. All cost money — typically twenty to a hundred thousand dollars per year for mid-sized operations. If the budget for external signal sources isn't there, layer two doesn't actually deploy and the forecast lift is half what it could be. Budget for the signal sources at the same time as the forecasting AI, not afterward as an add-on that often gets cut.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The handoff that decides whether ops uses the forecast',
      iconKey: 'users',
      eyebrow: 'Lesson 3 · The handoff',
      bodyHtml: `<p>Three components in the forecast handoff to operations. Without all three, planners override the forecast within a month and the AI investment doesn't compound. With all three, planners trust and use it.</p>`,
      narrationLead:
        "Three components in the forecast handoff to operations planners. Without all three, planners override the AI forecast within a month and revert to their existing spreadsheet, and the AI investment doesn't compound across quarters. With all three, planners trust the forecast, use it as the planning anchor, and the AI investment delivers the value the business case promised. The handoff design is more important than the model quality after the first quarter.",
      steps: [
        {
          html: stepCard('users', 'blue', 'Component 1 — Forecast appears in the tool planners already use',
            "Don\'t make planners log into a new AI portal. The forecast flows into their existing planning system — SAP IBP, Anaplan, Oracle, whatever they already use. Reduces friction to zero; adoption follows."),
          narration:
            "Component one. The forecast appears in the tool planners already use. Not a new AI portal that requires a separate login, separate context, separate workflow. The forecast flows into the existing planning system — SAP IBP, Anaplan, Oracle Supply Chain Planning, Kinaxis, whatever the team already plans in. The friction to use the new forecast is zero — it shows up in the same screen where the planner already works. Adoption follows. Tools that require planners to log into a separate AI portal have well-documented adoption failure rates because the workflow change is the dominant barrier, not the forecast quality. Integrate into the existing tool. The integration work is worth the investment.",
        },
        {
          html: stepCard('users', 'blue', 'Component 2 — Side-by-side with planner judgment',
            "Show the AI forecast next to the planner\'s last forecast and to actuals from prior periods. Planner reviews, accepts, edits, or overrides — explicit one-click action. AI assists; planner decides."),
          narration:
            "Component two. Side-by-side display with planner judgment. The AI forecast appears in the planning interface next to the planner's last manual forecast and next to actuals from the prior period. The planner reviews the three numbers, makes a judgment, accepts the AI forecast, edits it, or overrides with their own number — as an explicit one-click action with rationale captured. AI assists; planner decides. The structure matters because it gives planners ownership of the final forecast while exposing them to the AI's signal continuously. Over time, planners start trusting the AI more on the categories where it consistently performs well and stay sceptical on categories where their own judgment beats it — which is exactly the right learning pattern.",
        },
        {
          html: stepCard('users', 'blue', 'Component 3 — Monthly forecast accuracy review by category',
            "Once a month, the planning team reviews AI forecast accuracy vs planner overrides vs actuals — by category. Surfaces where AI is winning, where planner judgment is winning, where neither is good enough. The rhythm builds team confidence in the system."),
          narration:
            "Component three. Monthly forecast accuracy review by category. Once a month, the operations planning team reviews AI forecast accuracy versus planner overrides versus actuals — broken down by category and by SKU group. Surfaces where AI is consistently winning against the previous manual forecasting, where planner judgment is still beating the AI, and where neither approach is good enough. The rhythm builds team confidence in the system because everyone sees the honest scorecard rather than the vendor's claimed accuracy. It also surfaces the data and model issues that need fixing in the next quarter. Without this monthly rhythm, the AI program drifts and teams gradually disengage. With the rhythm, it compounds. Schedule it before launch.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 2 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter three — procurement document AI.</p>`,
      narrationLead:
        "Three anchors before chapter three — procurement document AI.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Two-layer model',
            "Classical ML on structured history + LLM signal extraction from unstructured sources. Combined produces explainable forecasts. Avoid the single-sophisticated-model trap; layered architecture wins in most operational settings."),
          narration:
            "One. Two-layer model. Classical machine learning on structured sales history captures seasonality, trend, and promotional response. Large language model signal extraction from unstructured sources catches what historical patterns can't see. Combined, designed as one system, produces explainable forecasts with rationale that planners actually trust. Avoid the single sophisticated model trap — layered architecture outperforms in most real operational settings and is dramatically more debuggable.",
        },
        {
          html: stepCard('check', 'green', 'Two — Four-check data-readiness gate',
            "18+ months clean history · promotional events tagged · stock-out / lost-sale flags · budgeted external signal sources. Two or more failing — do data work first, AI pilot second. The data work is the determinant of AI value."),
          narration:
            "Two. Four-check data-readiness gate before deployment. Eighteen months or more of clean sales history by SKU, region, channel. Promotional events properly tagged so the model learns promo response correctly. Stock-out and lost-sale flags so the model doesn't misread supply-side issues as demand-side weakness. External signal sources budgeted and available. Two or more checks failing — do the data work first, AI pilot second. The data work is the unglamorous determinant of whether the AI pilot delivers.",
        },
        {
          html: stepCard('check', 'green', 'Three — Three handoff components',
            "Integrate into existing planning tool · side-by-side with planner judgment · monthly accuracy review by category. The handoff design is more important than model quality after the first quarter."),
          narration:
            "Three. Three handoff components that decide whether operations actually uses the forecast. Integrate into the existing planning tool — no new AI portal — reduces adoption friction to zero. Side-by-side display with planner judgment — AI forecast next to planner's last forecast and prior actuals, planner explicit one-click accept-edit-override. Monthly accuracy review by category — surfaces where AI wins, where planner judgment wins, where neither is good enough, builds team confidence through honest scorecards. The handoff design is more important than the model quality after the first quarter; the model quality plateaus while the handoff determines whether the team uses what the model produces.",
        },
      ],
      narrationTrail:
        "Chapter three — procurement document AI. Invoices, contracts, the human-in-loop pattern, and the audit posture. See you there.",
    },
  ],
}
