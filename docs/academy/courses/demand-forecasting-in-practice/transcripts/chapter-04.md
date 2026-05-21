# Chapter 4 — Demand sensing

**Course:** Demand Forecasting in Practice · **Chapter:** 04 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. Short-horizon chapter. Practical lift, practical limits.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Demand sensing.* Short-term forecasts using point-of-sale, weather, ad spend, social signals. *The five-to-fifteen percent lift on a four-week horizon. And the noise-chasing risk that kills naive deployments.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · what it is]

What demand sensing is. *A short-horizon forecasting layer — one to four weeks — driven by signals that move faster than the mid-term planning forecast can capture.* POS data refreshed daily. Weather. Local ad spend. Promotional execution status. Social-listening signals. *The output is an override to the mid-term forecast for the next few weeks.*

The platforms. *Blue Yonder Luminate and o nine Solutions are the leaders. SAP IBP demand sensing module. Kinaxis Maestro signals layer.* All have demand sensing components by twenty twenty-five.

> [S3 ▸ slide change · t ≈ 1:10]

> [S3 ▸ reveal 1 · the lift]

The lift. *Industry case studies through twenty twenty-five — five to fifteen percent MAPE reduction on a four-week horizon* compared to using the mid-term forecast unchanged. *Real numbers.* Top performers in fast-moving CPG reach the high end.

What "five to fifteen percent" means in practice. *A one billion-dollar revenue CPG with twenty percent baseline MAPE in week-one shipping accuracy.* Demand sensing brings that to seventeen or eighteen percent. *Translated to inventory — millions of dollars of better-positioned stock.*

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · noise-chasing risk]

The risk. *Chasing noise.* The model picks up a one-week POS spike and over-corrects. Or it amplifies a weather signal that doesn't actually matter for your category. *The result — wrong inventory deployments, wrong promo executions, frustrated planners who lose trust in the model.*

The fix. *Confidence-weighted overrides.* The demand-sensing model proposes an override. *The system applies the override only above a confidence threshold.* Below threshold — keep the mid-term forecast. *And — cap the override magnitude.* Don't let the demand sensing layer override the mid-term by more than say twenty percent in any single week.

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · signal hygiene]

The signal hygiene piece. *Demand sensing is only as good as the signals feeding it.* POS data with two-week latency — useless for one-to-four-week horizon. Weather signal mapped to wrong SKU categories — adds noise, not signal. *Audit the signal pipeline before you trust the model.*

What the FVA analysis tells you. *Run demand sensing in shadow mode for a quarter.* Compare its proposals to actuals. *Did the override improve or worsen forecast accuracy compared to no-override baseline?* If improved — promote to production. If worsened — fix the signals or kill the layer.

> [S5 ▸ reveal 2 · the close]

The Monday move. *If you have a demand sensing platform — pull last quarter's override log.* For each significant override — *did it improve accuracy on that SKU for that week?* If you can't answer, FVA isn't running. *That's the gap.*

> [S6 ▸ slide change · t ≈ 4:00]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Promotional and event uplifts.* Coca-Cola, Unilever, Carrefour case studies. *Twenty to forty percent accuracy improvement on promotional weeks. And what breaks it.*

> [end]
