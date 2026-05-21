# Chapter 3 — Choosing the right model

**Course:** Demand Forecasting in Practice · **Chapter:** 03 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. The decision-tree chapter.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter three. *Choosing the right model.* If the vendor pitch says "our AI is the best forecasting model" — *they're selling, not informing.* No single technique wins. This chapter is the decision tree.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · M5 evidence]

What the M5 competition told us. *Walmart, Kaggle, twenty twenty-two paper.* Top-fifty entries by forecast accuracy. *Predominantly LightGBM — gradient-boosted trees.* Some neural networks. *Classical methods — ETS, ARIMA, Theta — competitive on aggregated levels.* LightGBM dominated SKU-store level.

*The implication is operational. Not theoretical.* If you have lots of history and lots of signal — LightGBM-style models win. If your data is sparse — classical methods or ensemble approaches are competitive. *Don't let the vendor pitch the same model for every forecast layer.*

> [S3 ▸ slide change · t ≈ 1:20]

> [S3 ▸ reveal 1 · the decision tree]

The decision tree. *Three variables. History depth. Signal strength. Granularity.*

*If history is long, signal is rich, and granularity is fine — store-SKU or DC-SKU — LightGBM, XGBoost, or LSTM if you have the team. ML wins here.*

*If history is moderate and granularity is aggregated — total monthly, category-level — ETS, ARIMA, Theta. Classical methods are tight competitors. Don't over-engineer.*

*If demand is intermittent — spare parts, slow-moving SKUs, lots of zero-demand periods — Croston's method, or a Croston-LightGBM hybrid per Boylan twenty twenty-four. Pure LightGBM struggles with intermittency.*

*If history is too short — under one year, new product, new channel — ML is unreliable. Use analog-product lookup and judgement. Chapter six on NPI covers this.*

> [S4 ▸ slide change · t ≈ 2:35]

> [S4 ▸ reveal 1 · ensemble]

The ensemble option. *Combine three or four models — LightGBM, ETS, naive seasonal, and the planner's manual — and weight them by recent backtest performance.* This is the boring, robust approach. *Top-decile S&OP teams use ensembles because they reduce model-selection risk.*

The trade-off. *Ensembles are slower to update and harder to explain.* The S&OP leader has to understand the weighting logic. *If your vendor can't explain how the ensemble blends — don't sign.*

> [S5 ▸ slide change · t ≈ 3:25]

> [S5 ▸ reveal 1 · ML weakness]

Where ML is reliably weaker than classical. *Long-horizon forecasts — beyond six months.* The signal-to-noise ratio degrades. ML overfits to recent patterns. *Classical methods or judgement-heavy scenario planning wins past six months.*

The bottom line. *ML augments. ML doesn't replace.* The S&OP team that runs three or four models and picks the right one per SKU class beats the S&OP team that runs one model on everything.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your top three SKU classes by volume.* For each — what model is running today? What's the history depth, signal richness, granularity? *Is the model matched to the data?* If not, *that's the segmentation upgrade.*

> [S6 ▸ slide change · t ≈ 4:25]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Demand sensing.* Short-term forecasts driven by POS, weather, ad spend, social signals. *The five-to-fifteen percent lift on a four-week horizon. And the noise-chasing risk.*

> [end]
