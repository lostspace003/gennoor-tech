# Chapter 2 — Accuracy, bias, and the MAPE trap

**Course:** Demand Forecasting in Practice · **Chapter:** 02 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. Metrics chapter. Practical.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Accuracy, bias, and the MAPE trap.* If your team measures forecast accuracy wrong, *AI on top doesn't fix it — it just measures wrong faster.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the bias problem]

The bias problem first. *APICS / ASCM twenty twenty-four to twenty-five bias studies* — across thousands of planners across CPG, B2C, durable goods. *Median forecast bias of plus five to plus twelve percent.* The forecasts come in over actual demand. Consistently. *Planners over-forecast more than they under-forecast.*

Why? *Promo plans assume best-case lift. New products are over-forecast as a CYA against stock-outs. Sales overrides bias upward — sales would rather have inventory than risk losing a sale.* The bias is structural.

The fix isn't blame. *The fix is measurement and visibility.* Track bias and accuracy separately. Report both to the S&OP team. *AI is good at being bias-neutral if you ask it to be. Humans drift upward.*

> [S3 ▸ slide change · t ≈ 1:25]

> [S3 ▸ reveal 1 · MAPE trap]

The MAPE trap. *Mean Absolute Percentage Error — the most-used forecast accuracy metric.* The problem — *MAPE is asymmetric.* Over-forecasting by a hundred percent shows as one hundred percent error. Under-forecasting by a hundred percent caps at one hundred percent. *MAPE is biased toward under-forecasting.*

In intermittent demand — spare parts, low-volume SKUs — *MAPE is even worse. A single zero-demand period blows up the metric.* Hyndman is unambiguous on this. The M5 forecasting competition used RMSSE — *root mean squared scaled error* — specifically because of MAPE's intermittent-demand failure mode.

What to use instead. *sMAPE — symmetric MAPE — for moderate-volume forecasts.* MASE or RMSSE for intermittent demand. *The metric you report is the metric you optimise.* Pick one that doesn't lie to you.

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · honest reporting]

The honest accuracy reporting standard. *Three numbers, every cycle, by SKU class.*

*One — accuracy.* MAPE or sMAPE or MASE — pick the right one. Report it.

*Two — bias.* The signed average error. Negative if you over-forecast, positive if you under-forecast. *Tell the truth on direction.*

*Three — interval coverage.* If you ship eighty percent prediction intervals, *what fraction of actuals land inside them?* If you're shipping eighty-percents and only sixty percent of actuals land inside — your intervals are too tight. *Recalibrate.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · cost benchmark]

What this costs. *APICS twenty twenty-four cost study — for a typical CPG company, one percentage point of MAPE equals half a million to one and a half million dollars in inventory cost per hundred million in revenue.*

For a billion-dollar CPG, *every percentage point of accuracy is five to fifteen million dollars in working capital.* This is why supply chain leaders care about MAPE reduction. *Not vanity — money.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull your top SKU class accuracy report from last cycle.* Three checks. *Is the metric right for the volume profile? Is bias reported separately? Are prediction intervals tracked?* If any answer is no, *that's the next process upgrade — before you scale ML on this forecast.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Choosing the right model.* M5 paper, Hyndman, Croston. *Why no single technique wins. And the decision tree by granularity, history, signal.*

> [end]
