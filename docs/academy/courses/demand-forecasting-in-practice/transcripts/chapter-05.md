# Chapter 5 — Promotional & event uplifts

**Course:** Demand Forecasting in Practice · **Chapter:** 05 · **Target duration:** ~5 min spoken

## Trainer persona
Andrew. Promo chapter. Cite the names.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Promotional and event uplifts.* This is where AI delivers the most dramatic accuracy improvements — and where naive deployments break the fastest.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the lift]

The lift. *Coca-Cola, Unilever, Carrefour twenty twenty-four to five case studies.* Promotional-week accuracy improvements of *twenty to forty percent* via ML uplift models versus naive baseline. *Real numbers from real companies, published in vendor case studies and Gartner research.*

Why so high? *Because the baseline is so bad.* Most companies forecast promotional weeks by applying a fixed-percentage lift to base demand. *That ignores promo depth, channel mix, competitor activity, cannibalisation.* ML uplift models pick all of that up.

> [S3 ▸ slide change · t ≈ 1:10]

> [S3 ▸ reveal 1 · the pattern]

The pattern that works. *Three components.*

*One — a clean promotion calendar.* What promotion ran when, at what depth, in which channel. *Sounds basic. Most CPG companies have promo calendars that drift between "planned" and "actually executed."* That drift kills the model.

*Two — the uplift model.* ML trained on historical promo-vs-no-promo deltas. Features — promo depth, duration, channel, week-of-month, competitor activity, weather. *LightGBM dominates here.*

*Three — cannibalisation modelling.* When SKU A is on promo, SKU B's demand drops because shoppers substitute. *Pure uplift models that don't capture cannibalisation over-forecast the category.* The good vendors model cannibalisation explicitly.

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · what breaks it]

What breaks it. *Promotion calendar drift.* Marketing changed the depth at the last minute. Sales added a channel. The store didn't execute. *Planned promo calendar shows "twenty percent off in lane A." Actual execution was "fifteen percent off in lanes A and B."*

*The fix — reconcile planned versus actual promo execution every cycle.* The ML model trains on actual execution. The forecast process uses the planned calendar. Reconciliation closes the loop. *Without reconciliation, the model is learning from one dataset and forecasting on another.*

> [S5 ▸ slide change · t ≈ 3:10]

> [S5 ▸ reveal 1 · the planner role]

The planner's role in this AI-augmented workflow. *Override authority on the edge cases.* New competitor entering the category. Disrupted supply on a competing brand. Regional anomaly the model hasn't seen.

The discipline. *Every planner override gets logged for FVA.* Chapter seven. *If planner overrides on promo forecasts consistently improve accuracy — great, the planner is adding value. If they consistently worsen — that's a coaching conversation about when to override.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last quarter's top-ten promotional weeks.* For each — *what was the forecast accuracy? Was there a planner override? What happened?* If you don't have the override log — *start it this cycle.* That's the FVA foundation.

> [S6 ▸ slide change · t ≈ 4:00]

> [S6 ▸ reveal 1 · next up]

Next chapter. *New product introduction.* Procter and Gamble twenty twenty-four case. *Analog-product lookup. First four weeks of real signal. The twelve-month forecast that holds together.*

> [end]
