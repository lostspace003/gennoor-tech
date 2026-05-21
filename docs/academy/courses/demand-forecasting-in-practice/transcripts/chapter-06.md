# Chapter 6 — New product introduction

**Course:** Demand Forecasting in Practice · **Chapter:** 06 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. NPI is judgement-heavy. Honest about it.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *New product introduction forecasting.* The use case where ML alone fails the hardest — and where the human-ML hybrid wins the most.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the problem]

The problem. *No history.* By definition, a new product hasn't been sold yet. *No training data for the ML model.* Pure ML is unreliable in the first weeks and months. Classical methods are useless without history.

The traditional fix — *judgement.* Sales says "we'll sell a hundred thousand units in year one." Marketing says "we need to forecast a hundred and fifty for the marketing budget." Finance says "let's plan eighty for safety." *Three forecasts, no method.*

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · the P&G case]

The pattern that works. *Procter and Gamble twenty twenty-four case study, published by McKinsey.* Two components.

*One — analog-product lookup.* Find historical products similar to the new product. *Similar category, similar pricing, similar channel, similar launch context.* Their first-twelve-month curves form the prior distribution for the new product.

*Two — first-four-week early signal.* Once the product launches, the first four weeks of real POS data update the analog-based forecast. ML model — typically LightGBM — combines the analog prior with the early signal. *Twelve-month forecast accuracy improves dramatically by week four.*

> [S4 ▸ slide change · t ≈ 2:10]

> [S4 ▸ reveal 1 · judgement layer]

The judgement layer. *Which analogs are valid?* The ML can compute similarity. *The category expert decides whether the analog is comparable.* A vegan ice cream launching in twenty twenty-six is probably *not* well-modelled by a regular ice cream from twenty seventeen. *The planner picks the analog set. The ML does the math.*

The discipline. *Lock the forecast for the first four weeks.* Don't let salespeople push the forecast up based on enthusiasm in week two. *Use week-four real signal to update.* That's when you have data. Not before.

> [S5 ▸ slide change · t ≈ 3:10]

> [S5 ▸ reveal 1 · what to defer]

What this *doesn't* work for. *Genuinely novel categories.* If the product has no comparable analog — first-of-kind innovation — the analog method fails. *You're back to judgement and scenario planning.* That's acceptable. *Just don't pretend the forecast is data-driven.*

The honest framing. *Categorise new product launches into three buckets.* Analog-rich — analog method plus early signal. Analog-thin — wider intervals, judgement-led. *Genuinely novel — scenario planning, no number until first thirty days of data.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick your next NPI launch.* Identify three analogs. *Pull their first-twelve-month curves.* If you can't find three comparable analogs, *bucket as analog-thin or novel.* Set expectations with finance and sales before the launch — not after.

> [S6 ▸ slide change · t ≈ 4:10]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Connecting forecast to S&OP.* Supply Chain Council research shows only around thirty-eight percent of organisations actually connect ML forecast to executive S&OP decisions. *FVA analysis. The LLM narrative layer. And the confabulated-source failure mode S&OP leaders are watching for in twenty twenty-six.*

> [end]
