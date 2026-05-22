# Chapter 2 — Demand forecasting

**Course:** AI for Energy & Utilities · **Chapter:** 02 · ~4.5 min

## Persona
Emma. Demand-forecasting register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Demand forecasting at scale.* Where AI consistently delivers in utilities.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the use case]

The use case. *Short-term load forecasting.*

Predicting electricity demand. *Hour-ahead. Day-ahead. Week-ahead.* Inputs include temperature, time of day, day of week, season, special events. *Output drives generation dispatch, energy market bidding, reserve scheduling.*

This is the most mature AI use case in utilities. *Statistical methods existed for decades. Modern ML adds five to fifteen percent accuracy improvement in most studies — meaningful given the operational stakes.*

> [S3 ▸ slide change · t ≈ 1:00]

> [S3 ▸ reveal 1 · 3 architectures]

Three forecasting architectures.

*Architecture one — gradient boosted machines.* LightGBM, XGBoost, CatBoost. Stable. Easy to debug. *Dominant choice for system-level load.*

*Architecture two — neural networks.* LSTM, transformer-based time series models. *Better for very large, complex datasets. Harder to debug.*

*Architecture three — hybrid statistical plus ML.* Classical model captures known seasonality and weather sensitivity. ML captures residual. *Often the best performer in benchmarks like the M-five competition.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · 3 failure modes]

Three demand forecasting failure modes.

*Failure mode one — over-fit on stable history.* Pandemic or heatwave or major behavioural shift breaks the model. *Test against tail events explicitly.*

*Failure mode two — calibration drift.* Model trained on year X behaves differently on year Y. *Quarterly retraining as default. Trigger-based retraining when accuracy drops below threshold.*

*Failure mode three — no scenario stress testing.* The model performs well on average. But operational decisions are bet on the model's worst case. *Stress test against high-impact scenarios — heatwave plus generation outage, severe storm, demand response failure.*

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · honest scoring]

How to score demand forecasting honestly. *Two questions.*

*Question one — what's your MAPE on the last twelve months of day-ahead forecasts?* Below three percent for system-level is green. Three to five amber. *Above five percent is red — your model needs investment.*

*Question two — does your forecast include explicit uncertainty bounds, not just point estimates?* Yes is green. Point estimates only is amber to red depending on how operations uses them.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull the forecast accuracy on the last hot day or cold snap.* If your model degraded substantially during the high-stakes period — that's the gap. *Tail-event accuracy matters more than average accuracy.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Grid management.* AI assisting grid operators. *Reliability first.*

> [end]
