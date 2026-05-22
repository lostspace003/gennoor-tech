# Chapter 6 — Inventory intelligence

**Course:** AI for Operations & Supply Chain · **Chapter:** 06 · ~4.5 min

## Persona
Andrew. Inventory-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Inventory intelligence.* Dynamic safety stock and allocation optimization.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the inventory tradeoff]

The inventory tradeoff.

Every inventory decision is a tradeoff between two failure modes. *Overstock — capital tied up, storage cost, write-off risk.* And *understock — stock-outs, lost sales, customer dissatisfaction.*

Traditional safety stock formulas optimize for one of these. *Usually understock.* The result. *Buffer stock everywhere. Working capital tied up.*

Dynamic safety stock with AI solves the math differently. *Forecast-driven, location-specific, time-varying.* Less buffer where AI is confident. More buffer where AI is uncertain. *Same service level. Substantially lower inventory.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 use cases]

Three inventory AI use cases.

*Use case one — dynamic safety stock.* AI predicts demand variability per SKU per location. Safety stock adjusts continuously to match. *Capital working harder.*

*Use case two — allocation optimization.* When inventory moves from DC to stores, AI optimises the split. *Right SKU mix at right location. Minimum waste.*

*Use case three — markdown timing.* For seasonal, fashion, or perishable inventory. AI predicts demand curves. *Marks down the right SKUs at the right time to clear without leaving margin on the table.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 failure modes]

Three inventory AI failure modes.

*Failure mode one — single-source-of-truth demand signal not enforced.* Each system has its own demand forecast. Sales, ops, finance. *They disagree. Inventory decisions made on whichever number the decider liked.*

*Failure mode two — peak-event blindness.* AI optimised for normal weeks. *Holiday, weather event, viral product moment — model breaks. Stock-outs or major overstock.*

*Failure mode three — markdown panic.* AI surfaces markdown candidates conservatively. Buyers override aggressively in late season. *AI insights ignored. Margin destroyed unnecessarily.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score inventory AI honestly. *Three questions.*

*Question one — single source of truth on demand for inventory decisions?* Yes green. Multiple sources but reconciled amber. *Multiple sources unreconciled red.*

*Question two — has AI-supported inventory reduced both stock-out rate and inventory dollars over the last year?* Both yes green. One yes amber. *Honestly no red — AI is not paying back.*

*Question three — for peak events, did AI perform as well as normal weeks?* Yes green. Slightly degraded amber. *Substantially degraded red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last year\'s inventory turns and stock-out rate.* Has AI moved both in the right direction? *If only one moved or both moved the wrong way, that\'s your AI inventory health indicator.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Supplier risk monitoring.* Multi-source signal aggregation for early warning.

> [end]
