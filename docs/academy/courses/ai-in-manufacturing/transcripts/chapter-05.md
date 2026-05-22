# Chapter 5 — Plant-floor supply chain integration

**Course:** AI in Manufacturing · **Chapter:** 05 · ~4.5 min

## Persona
Emma. Plant-engineer register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter five. *Plant-floor supply chain integration.* Real-time re-planning when reality changes.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 3 signal flows]

Three signal flows into plant scheduling.

*Flow one — demand signal.* Customer order changes, demand forecast updates, urgent orders. *Plant scheduling needs to know within hours, not days.*

*Flow two — material and supplier signal.* Material lots arriving, quality issues with incoming materials, supplier disruption. *Scheduling adjusts which jobs to run when.*

*Flow three — equipment availability signal.* Predictive maintenance flags an asset for inspection. Equipment goes down. *Scheduling reroutes to alternative equipment or shifts the timeline.*

AI's role in integration. *Aggregate signals from multiple systems. Surface scheduling implications. Recommend re-plan options.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 3 re-planning cadences]

Three re-planning cadences in practice.

*Cadence one — strategic monthly.* Capacity allocation across product lines. Major orders. Inventory positioning. *Months out.*

*Cadence two — tactical weekly.* Week-ahead production plan. Customer order sequencing. Material commitment. *AI surfaces the plan, planning team adjusts and commits.*

*Cadence three — operational real-time.* Hour-to-hour disruption response. Equipment failure, material shortage, urgent order. *AI surfaces options, plant manager decides.*

What works. *AI proposes at each cadence. Humans decide.* What doesn't work. *AI auto-changes plans without human review. Plant operators wake up to plans they don't understand.*

> [S4 ▸ slide change · t ≈ 2:30]

> [S4 ▸ reveal 1 · 3 failure modes]

Three failure modes when integration breaks.

*Mode one — signal latency.* Material quality issue surfaces in lab system, takes three days to reach scheduling. *Scheduling continues to plan against material that won't pass.*

*Mode two — signal conflict.* Demand says "run more of A." Supplier signal says "material for A delayed." *Scheduling system gets conflicting signals, defaults to old plan.*

*Mode three — plan trust erosion.* AI surfaces re-plan recommendation. Planning team overrides. Cycle repeats. *Trust erodes. AI insights ignored.*

> [S5 ▸ slide change · t ≈ 3:30]

> [S5 ▸ reveal 1 · honest scoring]

How to score plant-floor supply chain integration honestly. *Two questions.*

*Question one — last quarter, how often did production plan change after the start of the week?* Less than once amber baseline. Two to four amber. *More than four red — re-planning is constant scrambling.*

*Question two — when AI surfaces a re-plan recommendation, do planners act on it?* Yes mostly green. Sometimes amber. *Rarely or never red — AI insights ignored.*

> [S5 ▸ reveal 2 · the close]

The Monday move. *Walk the plant during a major schedule change.* How did the change propagate from signal to decision to operator instruction? *Friction points are your integration priority.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Safety AI.* Support, not surveillance.

> [end]
