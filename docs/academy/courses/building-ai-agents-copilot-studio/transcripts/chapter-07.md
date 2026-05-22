# Chapter 7 — Governance and monitoring at scale

**Course:** Building AI Agents with Copilot Studio · **Chapter:** 07 · ~4.5 min

## Persona
Andrew. Architect register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter seven. *Governance and monitoring at scale.* Where estates either compound value or get shadow-IT'd.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 governance layers]

Three governance layers.

*Layer one — tenant governance.* DLP policies, environment strategy, licensing model. *Set by Power Platform admin team.*

*Layer two — environment governance.* Per-environment maker roles, security roles, data policies. *Set by environment admin.*

*Layer three — per-agent governance.* Each agent has a clear owner, a clear use case, a clear retention plan. *Set by agent owner.*

Without all three layers. *Estate becomes unmanageable. Audit fails. Sensitive data leaks.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 5 monitoring signals]

Five monitoring signals every production agent needs.

*Signal one — usage.* Sessions per day, users per week. *Is this agent actually used?*

*Signal two — recognition rate.* Of user inputs, what percentage matched a topic versus fell to generative? *Falling rate means topic refactor needed.*

*Signal three — action success rate.* Of attempted actions, what percentage completed? *Below 80% means agent reliability issue.*

*Signal four — cost.* Token consumption, connector calls, capacity utilisation. *Track for chargeback and right-sizing.*

*Signal five — user feedback.* Thumbs-up/down per response, satisfaction scores. *Trend over time more important than absolute.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 estate-management rhythms]

Three estate-management rhythms.

*Rhythm one — weekly.* Top-5 agents reviewed. Usage, satisfaction, cost. *Anomalies investigated.*

*Rhythm two — quarterly.* Full estate review. *Agents below usage threshold sunset. New agent requests reviewed.*

*Rhythm three — annual.* Governance policy review. DLP refresh. Licensing model audit. *Strategy reset.*

Without rhythms. *Estate sprawls. Maintenance backlog grows. Compliance debt compounds.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score governance + monitoring honestly. *Three questions.*

*Question one — every production agent has an owner of record?* Yes for all green · most amber · *some/none red.*

*Question two — five monitoring signals tracked weekly on top agents?* Yes green · partial amber · *no red — production blind.*

*Question three — quarterly estate review actually happens?* Yes green · sporadically amber · *no red — sprawl in progress.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pull the agent inventory from Power Platform admin centre.* For each — owner, last-used date, signal status. *Orphan agents are your first cleanup.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Last chapter. *Production-grade design document. 12-item gate checklist. Builder.*

> [end]
