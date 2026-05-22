# Chapter 2 — Demand forecasting at scale

**Course:** AI for Operations & Supply Chain · **Chapter:** 02 · ~4.5 min

## Persona
Andrew. Forecasting-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Demand forecasting at scale.* The MAPE trap and hierarchical forecasting reality.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the MAPE trap]

The MAPE trap.

Most operations leaders ask one question about forecasting. *What\'s our MAPE — mean absolute percentage error?* It feels like the right metric. *It is not the only one.*

Why MAPE alone misleads. *Average accuracy hides tail risk.* You can have nineteen percent MAPE on average and still miss the holiday season catastrophically. *Or get every promotion week wrong.*

What actually matters. *Forecast value add — FVA.* Where in the forecasting chain is accuracy added or lost? *Without FVA, you can\'t tell if your AI is helping or your humans are overriding it correctly.*

Plus tail-event accuracy. *MAPE on peak periods, holiday weeks, supply disruption events. Specifically.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · hierarchical reality]

Hierarchical forecasting reality.

You don\'t forecast at one level. *You forecast at category level, sub-category, brand, SKU, location, channel.* Each level has different signal-to-noise.

The pattern that works. *Bottom-up plus reconciliation.* Forecast at the most granular level. Roll up. *Reconcile against top-down constraints — budget, capacity, contractual commitments.*

Top quartile organisations achieve under twenty percent MAPE at SKU-store. *Many enterprises sit at thirty to forty percent and don\'t realise it.* The gap is often hierarchical discipline, not model sophistication.

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · 3 architectures]

Three forecasting architectures.

*Architecture one — gradient boosted machines.* LightGBM, XGBoost, CatBoost. Stable. Explainable. *Default for most enterprise forecasting.*

*Architecture two — hybrid statistical plus ML.* Classical model captures known seasonality. ML captures residual. *Often top of M5-style benchmarks.*

*Architecture three — deep learning for long-horizon or multivariate.* Transformer-based time series. *Increasingly competitive. Harder to debug.*

For most ops organisations — *start with GBM or hybrid. Add deep learning only when the data volume and complexity justify it.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score demand forecasting honestly. *Three questions.*

*Question one — SKU-store MAPE for top fifty percent of revenue.* Below twenty percent green. Twenty to thirty amber. *Above thirty percent red — invest.*

*Question two — tail-event accuracy.* Pull last holiday or supply disruption. Did the model perform similarly to average? Or substantially degrade? *Significant degradation is your tail risk.*

*Question three — FVA analysis run quarterly?* Yes green. Annual amber. *Never red — you don\'t know if AI helps.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last twelve months of forecast accuracy.* Run FVA analysis on it. *Where in the chain is accuracy being added or lost?* That answer is your forecasting investment priority.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Procurement automation.* Where AI plus OR delivers measurable savings.

> [end]
