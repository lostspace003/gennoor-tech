import type { Chapter } from '../_types.ts'
import { stepCard, calloutBlock } from '../_types.ts'

export const aiForFinanceChapter04: Chapter = {
  courseId: 'ai-for-finance-accounting',
  chapterId: 'chapter-04',
  chapterNumber: 4,
  chapterSlug: 'chapter-04-forecasting-with-ai',
  title: 'Forecasting with AI',
  subtitle: 'When ML beats Excel — and when Excel still wins.',
  slides: [
    // SLIDE 1
    {
      title: 'Forecasting with AI',
      iconKey: 'target',
      eyebrow: 'Chapter 4 · Opening',
      bodyHtml: `<p class="lead">Finance teams love forecasting AI for one quarter, then quietly stop using it for the next three. Why? Because nobody told them when ML beats Excel — and when Excel still wins. In the next few minutes, the honest decision frame.</p>`,
      narrationLead:
        "Welcome to chapter four. Forecasting with AI. Here's a pattern I see across many finance teams. They love forecasting AI for one quarter — and quietly stop using it for the next three. Why? Because nobody told them when ML actually beats Excel, and when Excel still wins. So in the next few minutes — the honest decision frame. When to use ML. When to use Excel. And the build that makes the choice deliberate, not accidental.",
    },
    // SLIDE 2
    {
      title: 'When ML beats Excel — and when it doesn’t',
      iconKey: 'target',
      eyebrow: 'Lesson 1 · The decision frame',
      bodyHtml: `<p>Five conditions. If three or more apply, ML is worth the build. If fewer than three, stay with Excel — and don’t feel bad about it.</p>`,
      narrationLead:
        "Five conditions. If three or more apply to your forecast, ML is worth the build. If fewer than three apply, stay with Excel — and don't feel bad about it. Excel was never the problem. Misapplied ML is.",
      steps: [
        {
          html: stepCard('check', 'green', 'Condition 1 — Volume of historical data (2+ years)',
            "ML needs history. Two years of monthly data is minimum. Five years of weekly data is comfortable. Without history, ML hallucinates patterns from noise."),
          narration:
            "Condition one. Volume of historical data. ML needs history to learn patterns. Two years of monthly data is the absolute minimum. Five years of weekly data is comfortable. Below that, ML hallucinates patterns from noise — and your forecast looks confident but it's actually random. With Excel, you can build a credible forecast on twelve months. With ML, you can't.",
        },
        {
          html: stepCard('check', 'blue', 'Condition 2 — Multiple drivers worth modelling',
            "If demand depends on price, promo, seasonality, weather, and competitor activity all at once — ML handles that combination. Excel struggles past three drivers. If you only really have one or two drivers, Excel is fine."),
          narration:
            "Condition two. Multiple drivers worth modelling. If your demand depends on price, promo activity, seasonality, weather, and competitor moves all at once — ML genuinely handles that combination. Excel struggles past three or four drivers, particularly when they interact. But if your forecast really only depends on one or two drivers, Excel is fine. Don't overcomplicate it. Many revenue forecasts are still one-driver problems.",
        },
        {
          html: stepCard('check', 'amber', 'Condition 3 — Non-linear patterns',
            "Promotion lift isn't linear. New product ramp isn't linear. Customer churn isn't linear. ML handles non-linear well. If your business is mostly linear month-to-month, Excel is still the right tool."),
          narration:
            "Condition three. Non-linear patterns. Promotion lift isn't linear with promo intensity. New product ramp isn't linear with time. Customer churn isn't linear with acquisition. ML handles non-linear patterns well. If your business is mostly linear month to month — utility, predictable subscription — Excel is still the right tool. Don't fix what isn't broken.",
        },
        {
          html: stepCard('check', 'red', 'Condition 4 — Frequent re-forecasting needed',
            "If you re-forecast weekly or monthly, automation pays off fast. If you re-forecast annually, the build cost is hard to justify against three forecast cycles."),
          narration:
            "Condition four. Frequent re-forecasting. If you re-forecast weekly or monthly — most retail, most CPG, most ops planning — automation pays off fast. The same ML pipeline runs every week without human time. If you re-forecast annually for budget purposes only, the build cost of an ML pipeline is hard to justify against three forecast cycles before the technology changes again. Frequency matters more than people expect.",
        },
        {
          html: stepCard('check', 'amber', 'Condition 5 — A scenario question that matters',
            "If the finance team regularly asks “what if promo intensity doubles” or “what if pricing changes 5%”, ML scenarios pay back. If scenarios are theoretical, ML adds little over manual sensitivity analysis."),
          narration:
            "Condition five. A scenario question that matters. If the finance team regularly fields what-if questions — what if promo intensity doubles, what if we change pricing by five percent, what if the new product ramp is twice as fast — ML scenarios pay back, because you can run thirty scenarios in the time Excel runs one. If scenarios are theoretical, ML adds little over a well-built sensitivity in Excel. Don't fund ML for scenarios that nobody actually asks.",
        },
      ],
      calloutHtml: calloutBlock('lightbulb', 'tip', 'Three or more = ML',
        "Score honestly. Three or more conditions = ML is worth the build. Fewer = stay with Excel. The honesty of the score determines the success of the project — vendors will always tell you to fund ML."),
      calloutNarration:
        "Score the five conditions honestly. Three or more means ML is worth the build. Fewer means stay with Excel — and don't apologise. The honesty of the score is what determines the success of the project. Vendors will always tell you ML is right for your situation. They have something to sell. The honest score is yours to make. Most retail, manufacturing, and supply-chain forecasts score four or five. Most simple revenue forecasts score one or two. Calibrate accordingly.",
    },
    // SLIDE 3
    {
      title: 'What a forecasting ML build actually looks like',
      iconKey: 'cog',
      eyebrow: 'Lesson 2 · The architecture',
      bodyHtml: `<p>Four components. Each one matters. Skipping any one is the most common reason ML forecasting projects underperform.</p>`,
      narrationLead:
        "If you've scored three or more — here's what the ML build actually looks like. Four components. Each one matters. Skipping any one is the most common reason ML forecasting projects underperform expectations.",
      steps: [
        {
          html: stepCard('cog', 'green', '1 · Data pipeline',
            "Historical sales, promo flags, price changes, calendar effects, exogenous drivers (weather, competitor, macro). Updated weekly. Versioned. Quality-checked. This is 60% of the work — and the reason ML forecasts succeed or fail."),
          narration:
            "One. The data pipeline. Historical sales. Promo flags. Price changes. Calendar effects — holidays, paydays, weekends. Exogenous drivers — weather, competitor activity, macro indicators. All updated weekly. Versioned, so you can reproduce a forecast from any past week. Quality-checked, so a bad row doesn't poison the model. This is sixty percent of the work in a forecasting project — and it's the reason ML forecasts succeed or fail. Underestimate it at your peril.",
        },
        {
          html: stepCard('cog', 'blue', '2 · Model layer',
            "Typically a hybrid — Prophet or DeepAR for the time series, gradient boosting (XGBoost, LightGBM) for the driver interactions. The combination beats either alone in most finance forecasts. Tested against a hold-out, not against last week."),
          narration:
            "Two. The model layer. Typically a hybrid architecture. Prophet or DeepAR for the time series itself — they handle seasonality and trend well. Gradient boosting models like XGBoost or LightGBM for the driver interactions — they handle the non-linear effects. The combination beats either model alone in most finance forecasting scenarios. Critical discipline — test against a hold-out period, not against last week. Testing against last week tells you the model fits last week, not that it will predict next week.",
        },
        {
          html: stepCard('cog', 'amber', '3 · Confidence intervals — not just point forecasts',
            "Single-number forecasts are worse than useless — they're falsely precise. The model returns a forecast band (e.g., 80% confidence interval). Finance teams plan within the band, not against the point."),
          narration:
            "Three. Confidence intervals — not just point forecasts. Single-number forecasts are worse than useless. They're falsely precise. The model returns a forecast band — typically an eighty percent confidence interval. The forecast is, sales next quarter will be between X and Y, with eighty percent confidence. The finance team plans within the band, not against the point. This is one of the genuine advantages of ML over Excel — Excel forecasts almost never have honest confidence intervals attached.",
        },
        {
          html: stepCard('cog', 'green', '4 · The natural-language interface',
            "FP&A leads ask, “what if we cut promo intensity by 30%?” The interface runs the scenario in seconds — not days. This is where ML genuinely beats Excel in the operational rhythm of FP&A."),
          narration:
            "Four. The natural-language scenario interface. FP and A leads ask the system — what if we cut promo intensity by thirty percent? The interface runs the scenario in seconds, not days. Returns the forecast band for that scenario. Possibly with a side-by-side against the base case. This is where ML genuinely changes the operational rhythm of FP and A. Scenarios stop being annual exercises. They become weekly questions. And the planning cycle compresses accordingly.",
        },
      ],
    },
    // SLIDE 4
    {
      title: 'The governance overlay',
      iconKey: 'shield',
      eyebrow: 'Lesson 3 · Governance',
      bodyHtml: `<p>Forecasting AI introduces a class of risk that document extraction doesn’t. Three governance items — non-negotiable.</p>`,
      narrationLead:
        "Forecasting AI introduces a class of risk that document extraction doesn't. Models drift. Scenarios proliferate. Bad inputs produce confident outputs. Three governance items are non-negotiable.",
      steps: [
        {
          html: stepCard('shield', 'blue', '1 · Drift monitoring weekly',
            "Track model error — forecast vs actual — every week. When error trends up, the team retrains. Without this, models silently degrade and finance plans against false confidence."),
          narration:
            "One. Drift monitoring weekly. Track model error — forecast versus actual — every single week. When error trends up over a few consecutive weeks, the team retrains the model. Without drift monitoring, ML models silently degrade — and finance plans against false confidence. This is the single most common reason forecasting AI loses its credibility in the second year. Weekly monitoring prevents it.",
        },
        {
          html: stepCard('shield', 'amber', '2 · Scenario approval discipline',
            "Once finance can run scenarios in seconds, they will run hundreds. Without discipline, the scenario that wins is the most recently run — not the most accurate. Insist on a scenario library with approval status and last-validated date."),
          narration:
            "Two. Scenario approval discipline. Once finance teams can run scenarios in seconds, they will run hundreds of them. Without discipline, the scenario that wins the planning meeting is the most recently run scenario — not the most rigorous or accurate one. So insist on a scenario library. Each scenario has a name, an owner, an approval status, and a last-validated date. When somebody presents a scenario in a planning meeting, it's pulled from the library — not freshly invented thirty seconds before. The library brings rigour.",
        },
        {
          html: stepCard('shield', 'red', '3 · Model card and version log',
            "Every forecasting model has a written model card — what it forecasts, on what data, with what limitations. Every version of the model is logged with date and reason for change. The audit committee will eventually ask. Have the answer ready."),
          narration:
            "Three. Model card and version log. Every forecasting model has a written model card — what it forecasts, on what data, with what known limitations. And every version of the model is logged with date and reason for change. The audit committee will eventually ask for this artefact. So will your external auditor when they get to AI-related controls testing. Have it ready before they ask. Producing it after the fact looks weak. Producing it on demand looks like the firm has its house in order.",
        },
      ],
    },
    // SLIDE 5
    {
      title: 'Key takeaways',
      iconKey: 'check',
      eyebrow: 'Chapter 4 · Takeaways',
      bodyHtml: `<p>Three anchors before chapter 5 — anomaly detection, audit, and fraud.</p>`,
      narrationLead:
        "Three anchors before chapter five — where we move into anomaly detection, audit, and fraud.",
      steps: [
        {
          html: stepCard('check', 'green', 'One — Score the five conditions honestly',
            "Three or more = ML. Fewer = Excel. Vendors will say differently. The honest score is yours to make."),
          narration:
            "One. Score the five conditions honestly. Three or more means ML. Fewer means Excel — and Excel is not a failure mode. The honest score is yours to make. Vendors will always argue for ML.",
        },
        {
          html: stepCard('check', 'green', 'Two — Confidence intervals, not points',
            "Single-number forecasts are falsely precise. Insist on forecast bands. Plan within the band."),
          narration:
            "Two. Confidence intervals, not point forecasts. Single-number forecasts are falsely precise — and they erode trust the first time they're significantly wrong. Insist on forecast bands. Plan within the band. The honest forecast wins long-term credibility.",
        },
        {
          html: stepCard('check', 'green', 'Three — Governance from day one',
            "Drift monitoring · scenario approval · model card. Without these three, forecasting AI loses credibility in year two."),
          narration:
            "Three. Governance from day one. Drift monitoring. Scenario approval discipline. Model card and version log. Without these three governance items, forecasting AI loses its credibility within twenty-four months. With them, the capability compounds across planning cycles.",
        },
      ],
      narrationTrail:
        "Chapter five — anomaly detection, audit, and fraud. The play that pays internal audit dividends. See you there.",
    },
  ],
}
