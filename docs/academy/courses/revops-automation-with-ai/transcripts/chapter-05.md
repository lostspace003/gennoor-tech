# Chapter 5 — GTM data cleanup

**Course:** RevOps Automation with AI · **Chapter:** 05 · **Target duration:** ~4 min spoken

## Trainer persona
Andrew. The unglamorous foundation.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *GTM data cleanup.* The unglamorous AI win that makes every other use case in this course possible.

> [S2 ▸ slide change · t ≈ 0:10]

> [S2 ▸ reveal 1 · cost]

The cost of bad data. *Gartner estimates poor data quality costs the average organisation twelve point nine million dollars annually.* Beyond the dollar figure — *B2B contact data decays at twenty-two point five to thirty percent per year.* Email addresses go stale at twenty-three to thirty percent. *Within three years, most of your CRM contact records are wrong.*

That's the foundation problem. *Forecasting AI, scoring AI, narrative AI — all sit on top of contact and account data.* If the foundation is decaying at thirty percent per year, the AI layered on top inherits that decay.

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · annual fails]

Why annual cleanup projects fail. *Decay outruns the project cadence.* You spend six weeks cleaning twenty thousand records. *During those six weeks, four thousand more records went stale.* By the time you've finished, you're already eight thousand records behind. Annual projects never catch up.

The pattern that works — *continuous cleanup loops.* AI identifies dedup candidates, enrichment gaps, and stale records on a rolling basis. Field-level updates flow back into the CRM with quote-based grounding. *No quarterly project. No data-cleanup intern.* It's a background process.

> [S4 ▸ slide change · t ≈ 2:00]

> [S4 ▸ reveal 1 · identity res]

The foundation that makes this work. *Identity resolution.* Salesforce's own engineering blog from 2025 describes it as the layer Agentforce reasons over. *Fuzzy matching plus AI to merge the seven different versions of the same account across CRM, marketing automation, and product analytics.*

If your identity resolution layer is weak, *every downstream AI inherits the mess.* Two records for the same account. Three contacts that should be merged. *The model has no way to know they're the same. So it duplicates effort, miscounts pipeline, and generates contradictory recommendations.*

> [S5 ▸ slide change · t ≈ 3:00]

> [S5 ▸ reveal 1 · monday move]

The Monday move. *Pick one CRM object — accounts, contacts, or opportunities.* Measure your duplicate rate today. If you can't measure it, *you don't have an identity resolution layer.* Fix that before deploying any of the AI use cases from chapters one through four. *The order is the order.*

> [S5 ▸ reveal 2 · close]

Next chapter — *compensation modeling.* Where AI either stress-tests your plan or gets gamed by your top reps.

> [end]
