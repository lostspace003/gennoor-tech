# Chapter 2 — Infrastructure decisions

**Course:** AI Strategy for the CIO · **Chapter:** 02 · ~4.5 min

## Persona
Andrew. CIO-portfolio register.

---

## Transcript

> [S1 ▸ slide active · t = 0.0]

Chapter two. *Infrastructure decisions.* Cloud · on-prem · sovereign · hybrid. The 5-criterion test. Regional forcing factors.

> [S2 ▸ slide change · t ≈ 0:15]

> [S2 ▸ reveal 1 · 4 infra options]

Four infra options for AI workloads.

*Option one — hyperscaler public cloud.* AWS · Azure · Google. *Fast to start. Pay-per-use. Vendor lock-in by gravity.*

*Option two — sovereign cloud.* G42, NEOM, Mawani in UAE/Saudi · GovCloud in US · regional public clouds in India. *Required for many regulated workloads.*

*Option three — on-prem.* Your data centre. Owned GPUs. Owned operations. *Highest control. Highest fixed cost.*

*Option four — hybrid.* Sensitive workloads on-prem or sovereign. Non-sensitive on hyperscaler. *Most regulated enterprises end here.*

> [S3 ▸ slide change · t ≈ 1:15]

> [S3 ▸ reveal 1 · 5-criterion test]

Five criteria to pick.

*Criterion one — data residency requirements.* Forced by regulator? On-prem or sovereign.

*Criterion two — workload volume + variability.* Highly variable workload? Hyperscaler economics win. Steady high-volume? On-prem may win.

*Criterion three — talent availability.* You can hire ML platform engineers? On-prem is feasible. You can't? Hyperscaler is the answer.

*Criterion four — strategic dependency tolerance.* OK with hyperscaler dependency? Public cloud. Not OK? Sovereign or on-prem.

*Criterion five — capital vs operating expense preference.* CFO wants OpEx? Hyperscaler. CapEx OK? On-prem.

Three of five criteria pushing the same direction. *That's your answer.*

> [S4 ▸ slide change · t ≈ 2:45]

> [S4 ▸ reveal 1 · regional forcing factors]

Regional forcing factors that override.

*India DPDPA.* For sensitive PII workloads, in-country residency strongly preferred. *Hyperscalers offer India regions. Sovereign clouds emerging.*

*UAE and Saudi.* National AI strategies push toward sovereign infrastructure. *G42 in UAE, NEOM Cloud in Saudi increasingly expected for government and critical sector workloads.*

*EU.* GDPR + EU AI Act push toward EU regions or sovereign cloud (Gaia-X, Sovereign Cloud Stack). *Hyperscalers have EU regions but jurisdictional questions remain.*

*US.* For federal, FedRAMP boundary. GovCloud or on-prem.

If a regional factor forces the answer. *The other criteria don't matter.*

> [S5 ▸ slide change · t ≈ 3:45]

> [S5 ▸ reveal 1 · honest scoring]

How to score infra discipline. *Two questions.*

*Question one — has the 5-criterion test been run on your top AI workloads?* Yes documented green · informally amber · *no red — defaulting to hyperscaler without checking*.

*Question two — for regulated workloads, is residency confirmed in writing by vendor?* Yes contractually green · "they say they can" amber · *no red — audit failure waiting*.

> [S5 ▸ reveal 2 · the close]

The Monday move. *Pick top 3 AI workloads.* Walk the 5-criterion test for each. *Where defaults don't match criteria, that's the architectural conversation.*

> [S6 ▸ slide change · t ≈ 4:30]

> [S6 ▸ reveal 1 · next up]

Next chapter. *Build vs buy.* The third option most pitches skip.

> [end]
