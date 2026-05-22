# Chapter 5 — Model lifecycle management

**Course:** AI Program Management & PMO · **Chapter:** 05 · ~4.5 min

## Persona
Emma. Lifecycle-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Model lifecycle management.* Training. Deployment. Retraining. Retirement. *The cadence that keeps AI working over years.*

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 lifecycle stages]

The four lifecycle stages.

*Stage one — training.* Initial model trained on a defined dataset. Performance baseline established. *Documented for audit.*

*Stage two — deployment.* Model serves predictions in production. SLA defined. Monitoring active.

*Stage three — retraining.* On a schedule or trigger-driven. Performance drift detected. *Retrained, validated, redeployed.*

*Stage four — retirement.* The model is no longer the best option. Sunset planned. *Data and decisions archived for audit.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · retraining triggers]

Retraining triggers. *Four kinds.*

*Trigger one — performance drift.* Prediction quality drops below threshold. *Automated alerting. Required.*

*Trigger two — data drift.* Input distribution shifts significantly from training distribution. *Statistical monitoring detects.*

*Trigger three — schedule.* Quarterly or annual retraining regardless of metrics. *Catches gradual drift that doesn't trip alarms.*

*Trigger four — change in business context.* Regulation change. Market change. Product change. *Manual review triggered by program manager.*

Every production AI system should have all four. *Schedule alone is insufficient. Drift alone is reactive.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · model registry]

The model registry. *Single source of truth.*

For each model. *Owner. Last evaluated. Performance baseline. Current performance. Retraining cadence. Linked initiatives. Linked vendor.*

Without a registry — you don't know what models are in production. *You don't know what's silently breaking.* The registry is the foundation for every other lifecycle decision.

*Most enterprises don't have this yet. Building one is high-leverage PMO work.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score lifecycle honestly. *Two questions.*

*Question one — do you have a current model registry with last-evaluated dates?* Yes green. Partial amber. *No red.*

*Question two — when a production model degrades, how do you find out?* Automated alert green. Quarterly review amber. *Customer complaint red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Ask engineering for the list of every model in production with last-evaluation date.* Anything older than ninety days without re-evaluation — flag for review. *Don't wait for it to break.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Ops handoff.* Who owns the model after it ships.

> [end]
