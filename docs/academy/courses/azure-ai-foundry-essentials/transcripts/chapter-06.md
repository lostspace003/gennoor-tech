# Chapter 6 — Cost monitoring

**Course:** Azure AI Foundry Essentials · **Chapter:** 06 · ~4.5 min

## Persona
Emma. Azure-architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter six. *Cost monitoring.* Azure Monitor + Cost Management. Catching runaway spend before the month-end invoice does.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 telemetry sources]

Three telemetry sources you wire up.

*Source one — Azure Monitor metrics.* Token usage, request counts, error rates, latency. *Available out of the box. Free to query.*

*Source two — Cost Management.* Daily and forecast cost by resource, tag, subscription. *Set up at the subscription level first.*

*Source three — Foundry usage dashboards.* Per-project token counts, model breakdowns. *Project-level view that maps cleanly to which feature is spending.*

Without all three. *Cost surprises arrive at month-end.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 alerts that actually fire]

Three cost alerts that actually trigger before you're hurt.

*Alert one — daily spend threshold.* Workload typically spends $X/day. Alert at 2x. *Catches abuse, runaway loops, accidental load tests.*

*Alert two — weekly forecast.* Cost Management's forecast crosses budget. *Catches steady growth before it becomes a Q3 surprise.*

*Alert three — per-request token spike.* Median request is 5k tokens. Alert when 95th percentile crosses 50k. *Catches accidental large-context queries before they compound.*

Without alerts. *You see cost in the next bill, after the damage.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 cost tags]

Three cost tags you mandate.

*Tag one — feature.* Which product or feature does this resource belong to? *Maps cost to revenue.*

*Tag two — environment.* Dev, test, prod. *Catches dev workloads accidentally running production volume.*

*Tag three — owner.* Which team owns this? *Removes "who's spending this?" debates.*

Enforce via Azure Policy. *Resources without these three tags get blocked at creation. Sounds harsh. Pays back every month.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score Foundry cost discipline. *Two questions.*

*Question one — can your CFO see LLM cost broken down by feature, environment, and team?* Yes green · partial amber · *no/total only red — optimisation is blind*.

*Question two — do you have all three alerts in place (daily spend, weekly forecast, per-request spike)?* Yes green · 1-2 amber · *zero red — month-end surprises waiting*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull last 30 days of Foundry cost.* Break down by feature using tags. *If the breakdown isn't possible, that's the first tag-policy enforcement.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Production readiness checklist.* 20 items. 3 disqualifiers.

> [end]
