# Chapter 2 — Forecasting and FP&A

**Course:** AI for Finance & Accounting · **Chapter:** 02 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. FP&A-leader register. Calibrated.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Forecasting and FP&A.* The use case where AI delivers measurable accuracy improvements — and where calibration matters more than confidence.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · what to forecast]

What to forecast with AI. *Three primary categories.*

*Cash flow.* Working capital cycles. Inflows by customer. Outflows by category. *AI plus pattern data does well on near-term — one to four weeks.*

*Revenue.* By product line. By region. By customer cohort. *AI plus structured data does well on medium-term — one to twelve months.*

*Expenses.* Routine operating expenses. Predictable patterns — utilities, rent, payroll fringe. *AI gets you eighty percent of the way with historical data plus simple drivers.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · M5 evidence]

The evidence base. *M five Forecasting Competition — Walmart and Kaggle twenty twenty-two paper.* Top-fifty entries were predominantly LightGBM-based gradient-boosted trees. *Classical methods like ETS and ARIMA — still competitive at aggregated levels.* LightGBM dominated granular forecasts.

Hyndman and Athanasopoulos — *the canonical reference, third edition* — says ML beats classical when there's enough signal and history. *No single technique wins every forecast.* You pick by granularity, history depth, signal-to-noise.

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · calibration]

The calibration discipline. *Don't ship point estimates to the CFO. Ship prediction intervals.*

A point estimate says "Q three revenue will be forty-five million." *A calibrated forecast says "Q three revenue will be forty-five million, plus or minus three million, with an eighty percent confidence band."* Force the conversation about how wide the band is. *That's the difference between a forecast and an opinion.*

Tetlock's twenty-plus years of forecasting research — *calibration matters more than confidence.* Applies to AI-augmented FP&A as much as to political forecasting. *The CFO who insists on intervals over point estimates builds better forecasting discipline.*

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · FVA]

The discipline. *Forecast Value Added analysis.* Mike Gilliland's methodology at SAS, taught for fifteen years now. *Measure where in the forecast chain accuracy is added — and where it's lost.*

The structure. *Naive baseline — last period carried.* Statistical model. *ML model.* Planner override. *Executive sign-off.* Measure accuracy at each layer. If ML adds accuracy over statistical — fund it. *If planner override consistently subtracts accuracy — that's a coaching conversation.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick one recurring FP&A forecast. Cash, revenue, or expense.* Add a calibrated interval to the next forecast you produce. *Track whether actuals land inside the eighty percent band over the next four cycles.* If they don't, your interval is too narrow. *That's the calibration work.*

> [S6 ▸ slide change · t ≈ 4:25]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Reporting and variance narratives.* KPMG fifty to seventy percent time savings. *Quote-or-cut rule.* The confabulated-source failure mode auditors are watching for.

> [end]
