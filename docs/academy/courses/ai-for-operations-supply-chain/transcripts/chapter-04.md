# Chapter 4 — Logistics optimization

**Course:** AI for Operations & Supply Chain · **Chapter:** 04 · ~4.5 min

## Persona
Andrew. Logistics-discipline register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter four. *Logistics optimization.* Where AI augments operations research, not replaces it.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · the AI plus OR principle]

The AI plus OR principle.

Logistics optimization is decades-old operations research. *Vehicle routing problem. Bin packing. Capacity planning. Network flow.* These are formal mathematical problems with mature solvers.

What AI changes. *Improves the inputs to the solvers.* Better demand forecasts. Better travel time predictions. Better service-time estimates per stop. *The OR solver still does the optimization. The AI gives it cleaner data.*

What does not change. *The mathematical optimization itself.* If you remove the OR solver and try to do logistics with ML alone, you usually do worse.

The teams that get this right. *Treat AI as input quality. OR as the optimizer. Continuous improvement on both.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 use cases]

Three logistics use cases where the pattern delivers.

*Use case one — last-mile routing.* AI predicts travel times, service times, customer windows. *OR solver builds the route. Drivers execute.*

*Use case two — capacity allocation.* AI forecasts demand by lane and time. *OR allocates trucks, drivers, dock doors to meet demand.*

*Use case three — slot optimization.* For delivery operations with appointment windows. *AI predicts customer flexibility. OR optimizes promise times against capacity.*

> [S4 ▸ slide change · t ≈ 2:15]

> [S4 ▸ reveal 1 · 3 failure modes]

Three logistics AI failure modes.

*Failure mode one — AI without OR.* "Let\'s use ML to do routing." Suboptimal routes. *Real cost.*

*Failure mode two — OR with stale AI inputs.* Demand forecasts not updated. Travel time predictions not refreshed. *Optimizer is solving last quarter\'s problem.*

*Failure mode three — black-box automation without exception handling.* AI plus OR generates the plan. *Edge cases — weather, accidents, dock issues — need human judgement to override.* When override paths are weak, optimization breaks at the operational level.

> [S5 ▸ slide change · t ≈ 3:15]

> [S5 ▸ reveal 1 · honest scoring]

How to score logistics AI honestly. *Two questions.*

*Question one — over the last quarter, has optimised routing reduced miles, time, or cost compared to the previous baseline?* Yes green. Inconsistent amber. *No or hard-to-tell red — measurement framework not in place.*

*Question two — for exception scenarios, can dispatchers override AI plus OR recommendations easily?* Yes green. With effort amber. *No or fights the system red.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Sit with a dispatcher for an hour.* Watch them work with the AI plus OR system. *When do they accept? When do they override? What\'s the override workflow like?* Their pattern tells you whether the system is genuinely helping or fighting them.

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Predictive maintenance.* The sensor-plus-narrative pattern.

> [end]
